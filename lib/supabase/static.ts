import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/env";
import type { Database } from "@/lib/types";

export function createClient() {
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll(): void {
        return;
      },
    },
  });
}

export const createStaticClient = createClient;
