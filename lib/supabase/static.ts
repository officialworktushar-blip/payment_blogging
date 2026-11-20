import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/supabase/env";

export function createClient() {
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient(url, anonKey, {
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
