import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "@/lib/supabase/env";

interface CookieToSet {
  name: string;
  value: string;
  options: CookieOptions;
}

type CookieStore = Awaited<ReturnType<typeof cookies>>;

export async function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  let cookieStore: CookieStore | null = null;

  try {
    cookieStore = await cookies();
  } catch (caught: unknown) {
    console.error("[supabase] cookies()", caught instanceof Error ? caught.message : "Unknown error");
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        try {
          return cookieStore?.getAll() ?? [];
        } catch {
          return [];
        }
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          if (!cookieStore) {
            return;
          }

          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          return;
        }
      },
    },
  });
}
