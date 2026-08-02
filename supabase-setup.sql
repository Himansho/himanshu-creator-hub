-- ================================================================
-- HIMANSHU'S CREATOR HUB — one-time database setup
--
-- HOW TO USE (takes ~2 minutes):
--   1. Open your Supabase project → SQL Editor → "New query"
--   2. Paste this ENTIRE file
--   3. Click "Run"
--   4. You should see: "Setup complete ✅ …"
--
-- Safe to run more than once — nothing gets duplicated.
-- ================================================================


-- ----------------------------------------------------------------
-- 1) TABLES
-- ----------------------------------------------------------------

create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  full_name     text,
  headline      text,
  tagline       text,
  bio           text,
  display_email text,
  avatar_url    text,
  social_links  jsonb not null default '{}'::jsonb,
  updated_at    timestamptz not null default now()
);

create table if not exists public.projects (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  summary         text,
  description     text,
  tech_stack      text[] not null default '{}',
  status          text not null default 'draft'
                    check (status in ('draft', 'in_progress', 'published')),
  cover_image_url text,
  demo_url        text,
  repo_url        text,
  private_notes   text,        -- never exposed publicly (see views below)
  progress        int not null default 0 check (progress between 0 and 100),
  featured        boolean not null default false,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  published_at    timestamptz  -- set by trigger on first publish
);


-- ----------------------------------------------------------------
-- 2) TRIGGERS
-- ----------------------------------------------------------------

-- Keep updated_at fresh automatically
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Stamp published_at only on the FIRST publish (republishing keeps the
-- original date — PRD §9)
create or replace function public.set_published_at()
returns trigger language plpgsql as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end $$;

drop trigger if exists projects_set_published_at on public.projects;
create trigger projects_set_published_at
  before insert or update on public.projects
  for each row execute function public.set_published_at();

-- The FIRST user ever created becomes the admin: their profile row is
-- auto-created with Himanshu's defaults. Later users (which shouldn't
-- exist — sign-ups are disabled) get NO profile and therefore NO admin
-- rights (PRD §10 S-2).
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.profiles) then
    insert into public.profiles (id, full_name, headline, tagline, bio, display_email)
    values (
      new.id,
      'Himanshu Bartwal',
      'Creator',
      'I build things which solve real problems',
      'I''m a creator who builds with modern tools and AI. This hub collects everything I make — apps, experiments, and ideas in progress.',
      'Himanshubartwal2022@gmail.com'
    );
  end if;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ----------------------------------------------------------------
-- 3) ROW LEVEL SECURITY
-- ----------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.projects enable row level security;

-- "Am I the admin?" = my login id has a profile row.
-- (security definer so it can check without tripping over RLS itself)
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as
$$ select auth.uid() is not null
     and exists (select 1 from public.profiles where id = auth.uid()) $$;

-- Writes are scoped to the admin — NOT merely "any authenticated user"
-- (PRD §10 S-2). Visitors (anon) get no policies at all: they can only
-- read through the views in section 4.
drop policy if exists "admin full access to projects" on public.projects;
create policy "admin full access to projects" on public.projects
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin reads own profile" on public.profiles;
create policy "admin reads own profile" on public.profiles
  for select to authenticated
  using (auth.uid() = id);

drop policy if exists "admin updates own profile" on public.profiles;
create policy "admin updates own profile" on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "admin inserts own profile" on public.profiles;
create policy "admin inserts own profile" on public.profiles
  for insert to authenticated
  with check (auth.uid() = id);

-- Defense in depth: anonymous visitors can't even attempt the base tables.
revoke all on public.profiles from anon;
revoke all on public.projects from anon;


-- ----------------------------------------------------------------
-- 4) PUBLIC READ VIEWS (PRD §9)
--
-- These owner-rights views are the ONLY window visitors have:
-- published rows only, safe columns only. private_notes, progress,
-- and drafts are structurally unreachable.
--
-- NOTE: Supabase's linter flags these as "security definer views".
-- That is EXPECTED and intentional here — the base tables have no
-- anonymous access at all, and the views expose exactly what the
-- public site needs. (PRD §10 S-1)
-- ----------------------------------------------------------------

create or replace view public.public_projects
with (security_invoker = off) as
  select id, title, slug, summary, description, tech_stack,
         cover_image_url, demo_url, repo_url, featured, sort_order,
         published_at
  from public.projects
  where status = 'published';

create or replace view public.public_profile
with (security_invoker = off) as
  select full_name, headline, tagline, bio, display_email, avatar_url,
         social_links
  from public.profiles;

grant select on public.public_projects to anon, authenticated;
grant select on public.public_profile to anon, authenticated;


-- ----------------------------------------------------------------
-- 5) STORAGE (image buckets — PRD §9)
-- ----------------------------------------------------------------

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('project-images', 'project-images', true)
on conflict (id) do update set public = true;

-- Anyone may view images (they appear on the public site)…
drop policy if exists "public read images" on storage.objects;
create policy "public read images" on storage.objects
  for select
  using (bucket_id in ('avatars', 'project-images'));

-- …but only the admin may add, change, or remove them (PRD §10 S-2).
drop policy if exists "admin uploads images" on storage.objects;
create policy "admin uploads images" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('avatars', 'project-images') and public.is_admin());

drop policy if exists "admin updates images" on storage.objects;
create policy "admin updates images" on storage.objects
  for update to authenticated
  using (bucket_id in ('avatars', 'project-images') and public.is_admin());

drop policy if exists "admin deletes images" on storage.objects;
create policy "admin deletes images" on storage.objects
  for delete to authenticated
  using (bucket_id in ('avatars', 'project-images') and public.is_admin());


-- ----------------------------------------------------------------
-- Done!
-- ----------------------------------------------------------------
select 'Setup complete ✅ — next: turn OFF sign-ups, then create your admin user (Authentication → Users → Add user)' as message;
