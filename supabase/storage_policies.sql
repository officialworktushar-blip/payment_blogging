create table if not exists public.admin_users (
  email text primary key
);

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

alter table public.admin_users enable row level security;

drop policy if exists "Users read own admin row" on public.admin_users;
create policy "Users read own admin row"
on public.admin_users for select
to authenticated
using (lower(email) = lower(auth.jwt() ->> 'email'));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read blog images" on storage.objects;
create policy "Public read blog images"
on storage.objects for select
to public
using (bucket_id = 'blog-images');

drop policy if exists "Admins insert blog images" on storage.objects;
create policy "Admins insert blog images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'blog-images' and public.is_admin());

drop policy if exists "Admins update blog images" on storage.objects;
create policy "Admins update blog images"
on storage.objects for update
to authenticated
using (bucket_id = 'blog-images' and public.is_admin())
with check (bucket_id = 'blog-images' and public.is_admin());

drop policy if exists "Admins delete blog images" on storage.objects;
create policy "Admins delete blog images"
on storage.objects for delete
to authenticated
using (bucket_id = 'blog-images' and public.is_admin());
