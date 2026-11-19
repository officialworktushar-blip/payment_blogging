import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect("/admin/login");
  }

  const email = data.user.email;
  if (!email) {
    redirect("/admin/login?error=unauthorized");
  }

  const { data: adminRow, error: adminError } = await supabase
    .from("admin_users")
    .select("email")
    .ilike("email", email)
    .maybeSingle();

  if (adminError) {
    redirect("/admin/login?error=admin_check");
  }

  if (!adminRow) {
    const { error: signOutError } = await supabase.auth.signOut();
    redirect(signOutError ? "/admin/login?error=signout" : "/admin/login?error=unauthorized");
  }

  return data.user;
}
