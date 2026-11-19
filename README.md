# PayLens

A payments education blog built with Next.js 16 (App Router), TypeScript, Tailwind CSS, Supabase and Tiptap. All examples are fictional: no real card numbers, UPI IDs, OTPs, CVVs or brand logos.

## Stack

- Next.js 16 App Router with strict TypeScript
- Tailwind CSS 3 with PostCSS and Autoprefixer
- Supabase Auth, Postgres and Storage via `@supabase/ssr`
- Tiptap rich text editor in the admin area
- `motion` for reduced-motion-aware animations
- `lucide-react` icons and `slugify` for slugs

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the environment template and fill in your Supabase project values:

   ```bash
   cp .env.example .env.local
   ```

   - `NEXT_PUBLIC_SUPABASE_URL` — Project URL from Supabase settings
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon/public key
   - `NEXT_PUBLIC_SITE_URL` — e.g. `http://localhost:3000`

3. In the Supabase SQL Editor, run `supabase/migrations/0001_init.sql`. It is safe to re-run and creates the `posts` and `categories` tables, RLS policies, the `post-images` storage bucket, policies and five seeded articles.

4. Create an auth user in Supabase (Authentication -> Users -> Add user). Any authenticated user can access `/admin` in this starter.

5. Start the dev server:

   ```bash
   npm run dev
   ```

6. Open `http://localhost:3000` and sign in at `http://localhost:3000/admin/login`.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint

## Project layout

- `app/` — root layout, error and not-found boundaries, globals
- `app/(site)/` — public pages (home, articles, categories, about, contact)
- `app/admin/` — sign-in and protected admin area
- `components/` — shared UI, `components/animations/` for motion wrappers
- `lib/` — site config, types, Supabase clients, queries, server actions, utilities
- `supabase/migrations/` — SQL schema, policies and seed content

## Design system

- White page background with a deep navy hero and footer, one violet/blue accent, `success` green `#16a34a` and `error` red `#dc2626`.
- Serif headings for article content and page titles; sans-serif for UI.
- Shared public UI lives in `components/`: `ArticleCard`, `HeroFeatured`, `CategorySection`, `Breadcrumbs`, `Pagination` and `ImagePlaceholder`.
- `components/animations/` holds lightweight `motion`/CSS/SVG effects: `PaymentFlowHero`, `FlipCard`, `QRScan`, `PaymentMethodsStrip`, `FloatingCoins`, `SecurityShield`, `CountUp`, `Reveal` and `PageProgress`.
- Every animation honours `prefers-reduced-motion`; the payment-method marquee also pauses on hover.

## Editing content

Sign in to `/admin`, add categories, then create an article. The Tiptap editor supports headings, lists, quotes, inline code, links and images. Status can be `draft` or `published`; publishing calls `revalidatePath` so public routes refresh immediately. Blog and category routes are dynamic and do not use `generateStaticParams`.

## Admin access

Run `supabase/schema.sql`, create a Supabase Auth user, then insert that email into `public.admin_users`. `/admin/login` accepts email and password only; there is no public sign-up. `middleware.ts` refreshes the session and redirects unauthenticated or unauthorised users away from every `/admin/*` route except `/admin/login`. The admin sidebar links to Dashboard, All Blogs, Add New Blog, Categories and Support Requests.

## Placeholder details

`lib/site-config.ts` holds the placeholder name, navigation and contact details. Replace the email, phone and hours before launch. `NEXT_PUBLIC_SITE_URL` should be your real deployment origin for canonical URLs and Open Graph metadata.

## Safety rules for content

- Never publish real card numbers, UPI IDs, OTPs or CVVs.
- Use obviously fake examples such as `4111 xxxx xxxx 1111` and `user@example`.
- Do not add real payment brand logos.
- Keep the educational disclaimer on article pages.
