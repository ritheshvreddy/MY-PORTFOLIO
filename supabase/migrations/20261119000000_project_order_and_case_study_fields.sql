-- =====================================================================
-- Project ordering + new case study sections
--
-- 1. projects.display_order: lets the admin choose the order projects
--    appear in (lowest number first). Existing projects are numbered in
--    their current order (newest first) so nothing moves on day one.
--
-- 2. case_studies.architecture / case_studies.tech_stack: new
--    "System Architecture" and "Technology Stack" sections, replacing
--    "My Role & Contribution" on the site. The old "role" column is left
--    in place so no written content is lost.
--
-- Safe to re-run: columns are only added if missing, and the numbering
-- only runs while every project still has the default order of 0.
-- =====================================================================

begin;

alter table public.projects
  add column if not exists display_order integer not null default 0;

update public.projects p
set display_order = o.position
from (
  select id, (row_number() over (order by created_at desc))::integer - 1 as position
  from public.projects
) o
where p.id = o.id
  and not exists (
    select 1 from public.projects where display_order <> 0
  );

create index if not exists projects_display_order_idx
  on public.projects (display_order);

alter table public.case_studies
  add column if not exists architecture text,
  add column if not exists tech_stack text;

commit;
