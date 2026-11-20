-- PayLens support request queue. Safe to re-run in the Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  topic text not null,
  message text not null,
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists support_requests_created_at_idx
  on public.support_requests (created_at desc);

create or replace function public.set_support_requests_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists support_requests_set_updated_at on public.support_requests;
create trigger support_requests_set_updated_at
before update on public.support_requests
for each row execute function public.set_support_requests_updated_at();

alter table public.support_requests enable row level security;

drop policy if exists "Anyone can submit support requests" on public.support_requests;
create policy "Anyone can submit support requests"
  on public.support_requests for insert
  to anon, authenticated
  with check (
    status = 'open'
    and char_length(name) between 1 and 120
    and char_length(email) between 1 and 200
    and char_length(topic) between 1 and 120
    and char_length(message) between 1 and 5000
  );

drop policy if exists "Admins read support requests" on public.support_requests;
create policy "Admins read support requests"
  on public.support_requests for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins update support requests" on public.support_requests;
create policy "Admins update support requests"
  on public.support_requests for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
