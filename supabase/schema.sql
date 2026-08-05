-- ============================================================================
--  SAUCE DAY  ·  schema
--  Run this once, whole file, in the Supabase SQL editor.
--  Safe to re-run: everything is drop-and-recreate.
-- ============================================================================

-- ---------------------------------------------------------------- clean slate
drop table if exists public.photos        cascade;
drop table if exists public.expenses      cascade;
drop table if exists public.items         cascade;
drop table if exists public.bushels       cascade;
drop table if exists public.jar_inventory cascade;
drop table if exists public.runsheet      cascade;
drop table if exists public.menu          cascade;
drop table if exists public.grappa        cascade;
drop table if exists public.history       cascade;
drop table if exists public.app_settings  cascade;
drop table if exists public.members       cascade;
drop function if exists public.is_member() cascade;
drop function if exists public.is_admin()  cascade;
drop function if exists public.touch_row() cascade;

-- ---------------------------------------------------------------- crew
create table public.members (
  email        text primary key,
  display_name text not null,
  is_admin     boolean not null default false,
  sort_index   int not null default 0,
  created_at   timestamptz not null default now()
);
comment on table public.members is
  'The allow-list. Only emails in this table can sign in and touch anything.';

-- security definer so the RLS policies can read this table without recursing
create function public.is_member() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.members m
    where lower(m.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.members m
    where lower(m.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and m.is_admin
  );
$$;

-- ---------------------------------------------------------------- settings
create table public.app_settings (
  year               int primary key,
  edition            int  not null,
  sauce_date         date not null,
  crew_size          int  not null default 5,
  litres_per_bushel  numeric not null default 14.0,
  buffer_pct         numeric not null default 0.10,
  price_per_bushel   numeric not null default 25.00,
  jar_price          numeric not null default 19.99,
  band_price         numeric not null default 8.79,
  lid_price          numeric not null default 4.99,
  updated_at         timestamptz not null default now(),
  updated_by         text
);

-- ---------------------------------------------------------------- ledger
create table public.items (
  id           uuid primary key default gen_random_uuid(),
  year         int  not null,
  category     text not null check (category in ('toolkit','ingredients','food')),
  sort_index   int  not null default 0,
  name         text not null,
  kind         text,                      -- Need / Owned / Costco / description
  qty          text,
  budget       numeric default 0,
  assigned_to  text,
  store        text,
  obtained     boolean not null default false,
  repeat_next  text,
  comments     text,
  link         text,
  updated_at   timestamptz not null default now(),
  updated_by   text
);
create index items_year_cat_idx on public.items (year, category, sort_index);

-- ---------------------------------------------------------------- money in
create table public.expenses (
  id         uuid primary key default gen_random_uuid(),
  year       int  not null,
  item_id    uuid references public.items(id) on delete set null,
  category   text not null check (category in ('toolkit','ingredients','food')),
  paid_by    text not null,
  amount     numeric not null check (amount >= 0),
  label      text,
  spent_on   date not null default current_date,
  created_at timestamptz not null default now(),
  created_by text
);
create index expenses_year_idx on public.expenses (year, created_at desc);

-- ---------------------------------------------------------------- the sauce
create table public.bushels (
  id     uuid primary key default gen_random_uuid(),
  year   int  not null,
  person text not null,
  count  numeric not null default 0,
  unique (year, person)
);

create table public.jar_inventory (
  id     uuid primary key default gen_random_uuid(),
  year   int  not null,
  person text not null,
  jars   int not null default 0,
  bands  int not null default 0,
  lids   int not null default 0,
  unique (year, person)
);

-- ---------------------------------------------------------------- the day
create table public.runsheet (
  id         uuid primary key default gen_random_uuid(),
  year       int  not null,
  sort_index int  not null default 0,
  section    text not null default 'SAUCE DAY',
  time_label text,
  activity   text not null,
  lead       text,
  crew       text,
  equipment  text,
  done       boolean not null default false,
  notes      text,
  -- ---- the Sauce Day timeline reads these ----
  icon         text,                  -- key into the drawn mark family
  duration_min int,                   -- how long the step is expected to take
  ingredients  text,                  -- what it consumes, as opposed to equipment
  milestone    boolean not null default false,  -- headline step, gets its own card
  critical     boolean not null default false,  -- jarring and the like: stronger accent
  done_at      timestamptz,           -- stamped on tick; drives pace and slippage
  updated_at timestamptz not null default now(),
  updated_by text
);
comment on column public.runsheet.done_at is
  'When the step was actually ticked. The timeline compares this against '
  'time_label to work out whether the day is running behind, and projects a '
  'finish time from the pace so far.';
create index runsheet_year_idx on public.runsheet (year, sort_index);

create table public.menu (
  id         uuid primary key default gen_random_uuid(),
  year       int  not null,
  sort_index int  not null default 0,
  service    text not null,
  dish       text not null,
  who        text,
  source     text,
  qty        text,
  confirmed  boolean not null default false,
  notes      text,
  updated_at timestamptz not null default now(),
  updated_by text
);
create index menu_year_idx on public.menu (year, sort_index);

-- ---------------------------------------------------------------- the record
create table public.grappa (
  year      int primary key,
  bottle    text,
  producer  text,
  region    text,
  price     numeric,
  bought_by text,
  rating    numeric,
  notes     text,
  updated_at timestamptz not null default now(),
  updated_by text
);

create table public.history (
  year            int primary key,
  edition         int,
  sauce_date      date,
  toolkit         numeric,
  ingredients     numeric,
  food            numeric,
  crew_size       int default 5,
  bushels         numeric,
  litres          numeric,
  jars_filled     int,
  fallen_soldiers int,
  grappa          numeric,
  notes           text,
  updated_at      timestamptz not null default now(),
  updated_by      text
);
comment on table public.history is
  'One row per completed year. The current year is computed live and is NOT stored here '
  'until you close the year out from the History screen.';

-- ---------------------------------------------------------------- photobook
-- Deliberately NOT scoped to one year: the photobook is the whole record.
-- `url` is any publicly reachable image — a Supabase Storage public URL, a
-- Google Photos direct link, anything the browser can load.
create table public.photos (
  id         uuid primary key default gen_random_uuid(),
  year       int  not null,
  url        text not null,
  caption    text,
  taken_by   text,
  sort_index int  not null default 0,
  created_at timestamptz not null default now(),
  created_by text,
  updated_at timestamptz not null default now(),
  updated_by text
);
create index photos_year_idx on public.photos (year desc, sort_index);
comment on table public.photos is
  'The photobook. Ordered newest year first, then sort_index within the year.';

-- ---------------------------------------------------------------- touch trigger
create function public.touch_row() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  new.updated_by := coalesce(auth.jwt() ->> 'email', new.updated_by);
  return new;
end $$;

do $$
declare t text;
begin
  foreach t in array array['items','runsheet','menu','grappa','history','app_settings','photos']
  loop
    execute format(
      'create trigger touch_%1$s before update on public.%1$s
       for each row execute function public.touch_row()', t);
  end loop;
end $$;

-- ============================================================================
--  ROW LEVEL SECURITY
--  Everything is readable and writable by anyone on the crew list, and by
--  nobody else. The crew list itself is admin-only to change.
-- ============================================================================
do $$
declare t text;
begin
  foreach t in array array['app_settings','items','expenses','bushels','jar_inventory',
                           'runsheet','menu','grappa','history','photos']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy crew_read   on public.%I for select using (public.is_member())', t);
    execute format('create policy crew_insert on public.%I for insert with check (public.is_member())', t);
    execute format('create policy crew_update on public.%I for update using (public.is_member()) with check (public.is_member())', t);
    execute format('create policy crew_delete on public.%I for delete using (public.is_member())', t);
  end loop;
end $$;

alter table public.members enable row level security;
create policy members_read   on public.members for select using (public.is_member());
create policy members_insert on public.members for insert with check (public.is_admin());
create policy members_update on public.members for update using (public.is_admin()) with check (public.is_admin());
create policy members_delete on public.members for delete using (public.is_admin());

-- ============================================================================
--  REALTIME  ·  so everyone's phone updates the moment someone ticks a box
-- ============================================================================
do $$
declare t text;
begin
  foreach t in array array['app_settings','items','expenses','bushels','jar_inventory',
                           'runsheet','menu','grappa','history','members','photos']
  loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;
