-- PayLens Supabase schema (blogs)
-- Manual steps:
-- 1. Open the Supabase Dashboard -> SQL Editor -> New query.
-- 2. Paste this entire file and click Run. It is safe to re-run.
-- 3. Create an auth user (Authentication -> Users -> Add user).
-- 4. Register that user as an admin with the same lowercase email, for example:
--      insert into public.admin_users (email)
--      values ('you@example.com')
--      on conflict (email) do nothing;
-- 5. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.
-- 6. Restart the dev server if it is running.

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text,
  sort_order integer not null default 0
);

create unique index if not exists categories_slug_key on public.categories (slug);

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  slug text not null,
  description text,
  content text not null default '',
  category_id uuid references public.categories (id) on delete set null,
  cover_image_url text,
  cover_image_alt text,
  cover_image_note text,
  author_name text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  is_featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists blogs_slug_key on public.blogs (slug);
create index if not exists blogs_status_published_at_idx
  on public.blogs (status, published_at desc);

comment on column public.blogs.description is 'Used as both the article excerpt and SEO description.';
comment on column public.blogs.cover_image_note is 'Describes the image or mockup needed; keep examples fictional.';

create table if not exists public.admin_users (
  email text primary key
);

create or replace function public.set_blogs_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists blogs_set_updated_at on public.blogs;
create trigger blogs_set_updated_at
before update on public.blogs
for each row execute function public.set_blogs_updated_at();

insert into public.categories (name, slug, description, sort_order)
values
  (
    'Payment Gateways',
    'payment-gateways',
    'How gateways route card, wallet and net-banking payments.',
    1
  ),
  (
    'UPI & Wallets',
    'upi-wallets',
    'Everyday UPI and wallet flows, explained without real handles.',
    2
  ),
  (
    'Cards',
    'cards',
    'Card payments, tokenisation, refunds and chargebacks.',
    3
  ),
  (
    'Net Banking',
    'net-banking',
    'Bank transfers, IMPS, NEFT and RTGS basics.',
    4
  ),
  (
    'Payment Security',
    'payment-security',
    'Safe habits for OTPs, PINs, CVVs and suspicious messages.',
    5
  )
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    sort_order = excluded.sort_order;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users as admin_user
    where lower(admin_user.email) = lower(auth.jwt() ->> 'email')
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.categories enable row level security;
alter table public.blogs enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Categories are readable by everyone" on public.categories;
create policy "Categories are readable by everyone"
on public.categories for select
to anon, authenticated
using (true);

drop policy if exists "Published blogs are readable; admins read all" on public.blogs;
create policy "Published blogs are readable; admins read all"
on public.blogs for select
to anon, authenticated
using (status = 'published' or public.is_admin());

drop policy if exists "Admins insert blogs" on public.blogs;
create policy "Admins insert blogs"
on public.blogs for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins update blogs" on public.blogs;
create policy "Admins update blogs"
on public.blogs for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins delete blogs" on public.blogs;
create policy "Admins delete blogs"
on public.blogs for delete
to authenticated
using (public.is_admin());

drop policy if exists "Admins insert categories" on public.categories;
create policy "Admins insert categories"
on public.categories for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins update categories" on public.categories;
create policy "Admins update categories"
on public.categories for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins delete categories" on public.categories;
create policy "Admins delete categories"
on public.categories for delete
to authenticated
using (public.is_admin());

drop policy if exists "Users read own admin row" on public.admin_users;
create policy "Users read own admin row"
on public.admin_users for select
to authenticated
using (lower(email) = lower(auth.jwt() ->> 'email'));
