import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/types";

interface CookieToSet {
  name: string;
  value: string;
  options: CookieOptions;
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isLoginRoute = pathname === "/admin/login";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    if (isAdminRoute && !isLoginRoute) {
      const setupTarget = request.nextUrl.clone();
      setupTarget.pathname = "/admin/login";
      setupTarget.search = "";
      setupTarget.searchParams.set("notice", "setup");
      return NextResponse.redirect(setupTarget);
    }

    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        supabaseResponse = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  function redirectToLogin(reason?: string) {
    const target = request.nextUrl.clone();
    target.pathname = "/admin/login";
    target.search = "";

    if (reason) {
      target.searchParams.set("error", reason);
    }

    const response = NextResponse.redirect(target);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value);
    });
    return response;
  }

  async function signOutAndRedirect(reason: string) {
    const { error: signOutError } = await supabase.auth.signOut();
    return redirectToLogin(signOutError ? "signout" : reason);
  }

  const { data, error } = await supabase.auth.getUser();

  if (isAdminRoute && !isLoginRoute) {
    if (error || !data.user) {
      return redirectToLogin();
    }

    const email = data.user.email;
    if (!email) {
      return await signOutAndRedirect("unauthorized");
    }

    const { data: adminRow, error: adminError } = await supabase
      .from("admin_users")
      .select("email")
      .ilike("email", email)
      .maybeSingle();

    if (adminError) {
      return redirectToLogin("admin_check");
    }

    if (!adminRow) {
      return await signOutAndRedirect("unauthorized");
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
