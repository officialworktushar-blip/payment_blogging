interface SupabaseEnv {
  url: string;
  anonKey: string;
}

export function getSupabaseEnv(): SupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    const missing: string[] = [];

    if (!url) {
      missing.push("NEXT_PUBLIC_SUPABASE_URL");
    }

    if (!anonKey) {
      missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    }

    throw new Error(`Missing required environment variable(s): ${missing.join(", ")}`);
  }

  return { url, anonKey };
}
