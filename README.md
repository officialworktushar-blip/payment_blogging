# PayLens

A payments education blog built with Next.js 16 (App Router), TypeScript, Tailwind CSS, Supabase and Tiptap. All examples are fictional: no real card numbers, UPI IDs, OTPs, CVVs or brand logos.

## Stack

- Next.js 16 App Router with strict TypeScript
- Tailwind CSS 3 with PostCSS and Autoprefixer
- Supabase Auth, Postgres and Storage via `@supabase/ssr`
- Tiptap rich text editor in the admin area
- `motion` for reduced-motion-aware animations
- `lucide-react` icons and `slugify` for slugs

## Prerequisites

- Node.js 20.9 or newer and npm
- A Supabase project (Postgres, Auth and Storage)
- A Vercel account only if you want to deploy

## 1. Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and replace the example values with your own Supabase project values:

   ```bash
   cp .env.example .env.local
   ```

3. In the Supabase SQL Editor, run these files in order. Each is safe to re-run:

   - `supabase/schema.sql` — `categories`, `blogs`, `admin_users`, RLS and seeded categories.
   - `supabase/storage_policies.sql` — public `blog-images` bucket and admin-only image writes.
   - `supabase/schema_support.sql` — `support_requests` with anon insert and admin read/update.
   - `supabase/migrations/0001_init.sql` — the older `posts` table used by `/admin/posts`.
   - `supabase/seed.sql` — 15 published example articles across five categories.

   Run `0001_init.sql` after `schema.sql` so the seeded categories already exist. Blog and category routes are dynamic (`force-dynamic`) and do not use `generateStaticParams`.

4. Disable public sign-ups in Supabase: **Authentication → Providers → Email**, untick **Allow new users to sign up**.

5. Start the dev server:

   ```bash
   npm run dev
   ```

6. Open `http://localhost:3000` and sign in at `http://localhost:3000/admin/login`.

## 2. Environment variables

| Variable | Required | Where to get it | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase **Project Settings → API → Project URL** | Supabase client and image hostname allow-list in `next.config.ts`. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase **Project Settings → API → anon/public key** | Browser and server Supabase clients. This key is public by design. |
| `NEXT_PUBLIC_SITE_URL` | Yes | Your site origin | Canonical URLs, Open Graph metadata and `sitemap.xml`. Use `http://localhost:3000` locally and your real HTTPS origin in production. |

Never put a Supabase service-role key in this app or in any `NEXT_PUBLIC_*` variable. Restart `npm run dev` after changing `.env.local`.

## 3. Adding an admin

1. In Supabase, go to **Authentication → Users → Add user**, enter an email and password, and tick **Auto Confirm User**.
2. Register that same lowercase email in `public.admin_users` in the SQL Editor:

   ```sql
   insert into public.admin_users (email)
   values ('you@example.com')
   on conflict (email) do nothing;
   ```

3. Sign in at `/admin/login`. There is no public sign-up. `middleware.ts` and `lib/auth.ts` both check `admin_users`; unauthenticated or unauthorised sessions are redirected and signed out.

## 4. Adding a blog

1. Sign in at `/admin/login`.
2. Go to `/admin/blogs` and click **New blog** (or open `/admin/blogs/new`).
3. Fill in:
   - **Heading** (required) and optional **Sub Heading**.
   - **Short Description** (required) — used as the excerpt and SEO description.
   - **Content** — use the Tiptap editor for H2/H3, lists, quotes, code blocks, links, pasted/dropped images and image placeholder boxes.
4. In the **Publishing** panel choose **Status** (`draft` or `published`), **Author**, **Category** and optionally **Featured blog**.
5. Set the **Slug** (auto-generated from the heading until you edit it) and optionally add a **Cover image** with alt text and a mockup note.
6. Click **Create blog**. Saving calls `revalidatePath`, so public pages refresh immediately. A draft is never visible on public pages or in `sitemap.xml`.
7. To publish, unpublish, edit or delete later, use the actions on `/admin/blogs`.
8. Use only fictional identifiers in content, for example `4111 xxxx xxxx 1111` and `user@example`.

The older `/admin/posts` area edits the legacy `posts` table from `supabase/migrations/0001_init.sql`. New content should use `/admin/blogs`.

## 5. Deploying to Vercel

1. Push this repository to your Git provider (GitHub, GitLab or Bitbucket).
2. In Vercel, choose **Add New → Project** and import the repository. The Next.js framework preset is detected automatically; the build command is `npm run build`.
3. In **Project Settings → Environment Variables**, add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SITE_URL` with your production values. Set `NEXT_PUBLIC_SITE_URL` to your final HTTPS origin. Apply them to Production, Preview and Development as needed.
4. Deploy. Vercel does not manage Supabase, so run the SQL files from step 3 of **Local setup** in your production Supabase project and add your admin user as described in **Adding an admin**.
5. After the first deploy, check `/`, `/admin/login`, `/blog`, a published `/blog/<slug>` page and `/sitemap.xml`.
6. If you use a custom domain, add it in **Project Settings → Domains**, point `NEXT_PUBLIC_SITE_URL` at that exact origin and redeploy so canonical URLs and Open Graph images are correct.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint

## Project layout

- `app/` — root layout, error and not-found boundaries, globals
- `app/(site)/` — public pages (home, blog, categories, search, about, support, legal)
- `app/admin/` — sign-in and protected admin area
- `components/` — shared UI, `components/animations/` for motion wrappers
- `lib/` — site config, types, Supabase clients, queries, server actions, utilities
- `supabase/` — schema, storage policies, support schema, seed content and `migrations/`

## Design system

- White page background with a deep navy hero and footer, one violet/blue accent, `success` green `#16a34a` and `error` red `#dc2626`.
- Serif headings for article content and page titles; sans-serif for UI.
- Shared public UI lives in `components/`: `BlogCard`, `BlogHeroFeatured`, `BlogCategorySection`, `Breadcrumbs`, `Pagination`, `ShareBar`, `ReadingProgress` and `ImagePlaceholder`.
- `components/animations/` holds lightweight `motion`/CSS/SVG effects: `PaymentFlowHero`, `FlipCard`, `QRScan`, `PaymentMethodsStrip`, `FloatingCoins`, `SecurityShield`, `CountUp`, `Reveal` and `PageProgress`.
- Every animation honours `prefers-reduced-motion`; the payment-method marquee also pauses on hover.

## Editing content

Sign in to `/admin` and use `/admin/blogs` to create and manage blogs. The shared form at `/admin/blogs/new` and `/admin/blogs/[id]/edit` includes a Tiptap editor with H2/H3, lists, quotes, code blocks, links, direct image uploads and image placeholder boxes. Status can be `draft` or `published`; publishing calls `revalidatePath` so public routes refresh immediately.

## Placeholder details

`lib/site-config.ts` holds the placeholder name, navigation and contact details. Replace the email, phone and hours before launch. `NEXT_PUBLIC_SITE_URL` should be your real deployment origin for canonical URLs and Open Graph metadata. The privacy policy, terms and disclaimer pages are placeholders that need legal review before launch.

## Safety rules for content

- Never publish real card numbers, UPI IDs, OTPs or CVVs.
- Use obviously fake examples such as `4111 xxxx xxxx 1111` and `user@example`.
- Do not add real payment brand logos.
- Keep the educational disclaimer on article pages.
