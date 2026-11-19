create extension if not exists pgcrypto;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  cover_image text,
  category_id uuid references public.categories(id) on delete set null,
  author text not null default 'PayLens Team',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_status_published_at_idx
  on public.posts (status, published_at desc);

create index if not exists posts_category_id_idx
  on public.posts (category_id);

alter table public.categories enable row level security;
alter table public.posts enable row level security;

drop policy if exists "categories_public_select" on public.categories;
create policy "categories_public_select"
  on public.categories for select
  to anon, authenticated
  using (true);

drop policy if exists "categories_authenticated_write" on public.categories;
create policy "categories_authenticated_write"
  on public.categories for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "posts_public_select_published" on public.posts;
create policy "posts_public_select_published"
  on public.posts for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "posts_authenticated_write" on public.posts;
create policy "posts_authenticated_write"
  on public.posts for all
  to authenticated
  using (true)
  with check (true);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

drop policy if exists "post_images_public_select" on storage.objects;
create policy "post_images_public_select"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'post-images');

drop policy if exists "post_images_authenticated_write" on storage.objects;
create policy "post_images_authenticated_write"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'post-images')
  with check (bucket_id = 'post-images');

insert into public.categories (name, slug, description)
values
  ('Cards', 'cards', 'How card networks, issuers and acquirers work together.'),
  ('UPI and Wallets', 'upi-and-wallets', 'Instant transfers, handles and digital wallet basics.'),
  ('Gateways', 'gateways', 'The plumbing behind online checkout and settlement.'),
  ('Security', 'security', 'Habits and red flags that help keep your money safe.')
on conflict (slug) do nothing;

insert into public.posts
  (title, slug, excerpt, content, category_id, author, status, published_at)
select
  'How a card payment travels from tap to settlement',
  'how-a-card-payment-travels',
  'A step by step look at authorisation, clearing and settlement using a fictional card.',
  '<h2>At the counter</h2><p>When you tap a card, the terminal sends a request through the acquirer and the card network to the issuer. The issuer checks the account and returns an approval or decline in seconds.</p><h2>Clearing and settlement</h2><p>Approval is not the final transfer. Batches of approved transactions are cleared later, and the money moves between institutions after that. That is why a pending charge can disappear and reappear as the final amount.</p><p>In examples we use a fictional number such as 4111 xxxx xxxx 1111. Never publish a real card number, and never ask a reader to share an OTP or CVV.</p>',
  (select id from public.categories where slug = 'cards'),
  'PayLens Team',
  'published',
  now() - interval '8 days'
where not exists (
  select 1 from public.posts where slug = 'how-a-card-payment-travels'
);

insert into public.posts
  (title, slug, excerpt, content, category_id, author, status, published_at)
select
  'UPI basics: handles, requests and safety',
  'upi-basics',
  'Understand what a UPI handle means and how to spot a suspicious payment request.',
  '<h2>What a handle really is</h2><p>A UPI handle maps a friendly address to a bank account. Treat it like an email address: useful for receiving money, but not proof that a message is genuine.</p><h2>Collect or pay</h2><p>A collect request asks you to approve a debit. Read the payee name and amount before you approve anything. A request that appears from user@example in a demo is fictional; real requests deserve real scrutiny.</p><ul><li>Never approve a request you did not expect.</li><li>Do not read out OTPs or approve prompts during an unsolicited call.</li><li>Check the amount, not just the name.</li></ul>',
  (select id from public.categories where slug = 'upi-and-wallets'),
  'PayLens Team',
  'published',
  now() - interval '5 days'
where not exists (
  select 1 from public.posts where slug = 'upi-basics'
);

insert into public.posts
  (title, slug, excerpt, content, category_id, author, status, published_at)
select
  'Gateway or processor: what is the difference',
  'gateway-or-processor',
  'A simple mental model for the services between your checkout button and your bank account.',
  '<h2>Two jobs, often one vendor</h2><p>A payment gateway collects and secures customer details at checkout. A processor routes the transaction, handles authorisation and helps move funds. Many companies bundle both jobs into one product.</p><h2>Why it matters</h2><p>When a checkout fails, knowing which layer is involved makes support conversations faster. Ask whether the issue is at the form, the authorisation step or the payout stage.</p><p>All examples on PayLens use fictional data, including demo handles like user@example.</p>',
  (select id from public.categories where slug = 'gateways'),
  'PayLens Team',
  'published',
  now() - interval '2 days'
where not exists (
  select 1 from public.posts where slug = 'gateway-or-processor'
);

insert into public.posts
  (title, slug, excerpt, content, category_id, author, status, published_at)
select
  'Seven payment scams to recognise quickly',
  'payment-scams-to-recognise',
  'Common pressure tactics and the simple checks that slow a scam down.',
  '<h2>Urgency is a warning sign</h2><p>Scammers push you to act now, keep secrets and move to another channel. A genuine payment provider will not ask you to share an OTP, CVV or password.</p><h2>Slow down and verify</h2><ul><li>Open the app yourself instead of tapping a link in a message.</li><li>Call the organisation using a number from its official site.</li><li>Check the payee and amount before approving any request.</li><li>Use fictional test data such as 4111 xxxx xxxx 1111 in demos and training.</li></ul><p>If something feels wrong, stop and ask someone you trust before authorising a payment.</p>',
  (select id from public.categories where slug = 'security'),
  'PayLens Team',
  'published',
  now() - interval '1 day'
where not exists (
  select 1 from public.posts where slug = 'payment-scams-to-recognise'
);
