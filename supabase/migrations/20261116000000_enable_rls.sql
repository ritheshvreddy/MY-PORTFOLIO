-- =====================================================================
-- Enable Row Level Security on every public table
--
-- Who can do what afterwards:
--   Visitors (anon key) .... read portfolio content (published rows only
--                            where a table has a "published" column) and
--                            submit contact messages. Nothing else.
--   Admin ................... everything. "Admin" means the logged-in user
--                            is listed in public.admin_users, checked by the
--                            existing public.is_admin() function. Other
--                            signed-up accounts get visitor access only.
--
-- Also locks down the storage buckets: uploads, overwrites and deletes
-- were open to anyone; now only the admin can change files.
--
-- Safe to re-run: existing policies on these tables are dropped first.
-- =====================================================================

begin;

do $$
declare
  -- Tables with a "published" flag: visitors see published rows only
  published_tables text[] := array[
    'about_hobbies', 'certifications', 'hero_quotes', 'hero_roles',
    'projects', 'roles', 'skill_categories', 'skills', 'terminal_commands'
  ];

  -- Content tables without a flag: visitors can read every row
  open_tables text[] := array[
    'about_profile', 'profile', 'site_settings',
    'case_studies', 'certification_gallery', 'certification_points',
    'project_case_sections', 'project_challenges', 'project_features',
    'project_future_improvements', 'project_gallery', 'project_highlights',
    'project_learnings', 'project_responsibilities', 'project_technologies',
    'role_responsibilities', 'role_skills'
  ];

  t text;
  p record;
begin
  -- Start clean: drop every existing policy on the tables we manage
  -- (admin_users keeps its own policy and is not touched).
  for p in
    select tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = any (published_tables || open_tables || array['contact_messages'])
  loop
    execute format('drop policy %I on public.%I', p.policyname, p.tablename);
  end loop;

  -- Visitors: published rows only
  foreach t in array published_tables loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "Public can read published rows" on public.%I
         for select to anon, authenticated
         using (published is true)', t);
  end loop;

  -- Visitors: all rows
  foreach t in array open_tables loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "Public can read" on public.%I
         for select to anon, authenticated
         using (true)', t);
  end loop;

  -- Admin: full access to all content
  foreach t in array published_tables || open_tables loop
    execute format(
      'create policy "Admin can manage" on public.%I
         for all to authenticated
         using ((select public.is_admin()))
         with check ((select public.is_admin()))', t);
  end loop;
end
$$;

-- ---------------------------------------------------------------------
-- Contact messages: anyone may submit, only the admin may read/manage
-- ---------------------------------------------------------------------
alter table public.contact_messages enable row level security;

create policy "Anyone can submit a message"
  on public.contact_messages
  for insert to anon, authenticated
  with check (true);

create policy "Admin can manage messages"
  on public.contact_messages
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- admin_users already has RLS enabled with an own-record read policy;
-- make sure RLS stays on.
alter table public.admin_users enable row level security;

-- Both of the owner's login accounts are admins (ids from auth.users).
insert into public.admin_users (user_id)
select v.id
from (values
  ('972ce74d-8abf-421b-86a2-9b20ca1e4055'::uuid),
  ('86931af3-c8cd-4700-ad4b-7e763f250bdc'::uuid)
) as v(id)
where exists (select 1 from auth.users u where u.id = v.id)
  and not exists (select 1 from public.admin_users a where a.user_id = v.id);

-- ---------------------------------------------------------------------
-- Storage: buckets stay publicly readable (images, resume), but only
-- the admin can upload, overwrite or delete files.
-- ---------------------------------------------------------------------
drop policy if exists "Allow public uploads to portfolio" on storage.objects;
drop policy if exists "Allow public updates to portfolio" on storage.objects;
drop policy if exists "Allow public deletes from portfolio" on storage.objects;
drop policy if exists "Allow authenticated uploads" on storage.objects;
drop policy if exists "Authenticated users can upload portfolio media" on storage.objects;
drop policy if exists "Authenticated users can update portfolio media" on storage.objects;
drop policy if exists "Authenticated users can delete portfolio media" on storage.objects;
drop policy if exists "Admin can upload portfolio files" on storage.objects;
drop policy if exists "Admin can update portfolio files" on storage.objects;
drop policy if exists "Admin can delete portfolio files" on storage.objects;

create policy "Admin can upload portfolio files"
  on storage.objects for insert to authenticated
  with check (
    bucket_id in ('portfolio', 'portfolio-media')
    and (select public.is_admin())
  );

create policy "Admin can update portfolio files"
  on storage.objects for update to authenticated
  using (
    bucket_id in ('portfolio', 'portfolio-media')
    and (select public.is_admin())
  )
  with check (
    bucket_id in ('portfolio', 'portfolio-media')
    and (select public.is_admin())
  );

create policy "Admin can delete portfolio files"
  on storage.objects for delete to authenticated
  using (
    bucket_id in ('portfolio', 'portfolio-media')
    and (select public.is_admin())
  );

commit;
