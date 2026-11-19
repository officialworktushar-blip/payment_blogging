"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    if (!supabase) {
      router.push("/admin/login");
      return;
    }

    setPending(true);
    const { error } = await supabase.auth.signOut();
    setPending(false);

    if (error) {
      console.error(`Sign out failed: ${error.message}`);
      return;
    }

    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
    >
      <LogOut aria-hidden="true" size={14} />
      {pending ? "Signing out..." : "Sign out"}
    </button>
  );
}
