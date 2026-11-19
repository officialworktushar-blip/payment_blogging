import type { NextConfig } from "next";

function getSupabaseHostname(): string {
  try {
    const configuredUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
    return configuredUrl.hostname;
  } catch {
    return "";
  }
}

const hostname = getSupabaseHostname();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: hostname
      ? [
          {
            protocol: "https",
            hostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
