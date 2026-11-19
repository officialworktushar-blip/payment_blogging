# Repository rules

STRICT RULE: Do NOT run any terminal, shell, npm/npx/pnpm/yarn, git, build, lint, test or dev-server commands. Do not start or stop any server. Only create and edit files directly. If a command is needed, list it at the end under "Commands for me to run manually".

NEXT.JS 16 RULES (always follow):

- Do NOT enable Cache Components / cacheComponents / ppr / dynamicIO / partial prefetching. Do not use "use cache", cacheLife, cacheTag or unstable_cache.
- Do NOT use generateStaticParams for blog or category routes. Use `export const dynamic = "force-dynamic"` (or revalidate = 60) and call revalidatePath after admin changes.
- `params` and `searchParams` are Promises: type them as Promise<{...}> and await them in pages and generateMetadata.
- Create the cookies-based Supabase client inside the request: `const supabase = await createClient()`.
- error.tsx props typed `{ error: Error & { digest?: string }; reset: () => void }`; show error.message only in development.
- next.config.ts: `import type { NextConfig } from "next"`; images.remotePatterns with protocol "https" (literal), hostname from new URL(process.env.NEXT_PUBLIC_SUPABASE_URL) inside try/catch, pathname "/storage/v1/object/public/**", no port/search; empty array if env missing.
- Strict TypeScript that passes `next build`: no implicit any, no `{}` types, no untyped catch usage.
- Tiptap custom extension storage: NEVER write `editor.storage.<customName>` directly (TS error "Property does not exist on type Storage"). Always use a typed helper that casts via `editor.storage as unknown as Record<string, MyStorage | undefined>` and handle undefined.
- SQL rules: never include `alter table storage.objects enable row level security` (fails with 42501 in Supabase SQL Editor). All SQL must be safe to re-run (if not exists / drop policy if exists).
- All Supabase queries must check `error` and never throw uncaught.
- Respect prefers-reduced-motion for every animation.
- Payment content rule: never include real card numbers, real UPI IDs, real OTP/CVV examples or real brand logos. Use obviously fake examples (e.g. 4111 xxxx xxxx 1111, user@example).
