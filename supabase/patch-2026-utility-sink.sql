-- ============================================================================
--  SAUCE DAY · 2026 patch: the sink stops being a prospect, and a receipt
--  learns who it is split between.
--
--  Matt bought the stainless station on 26 Aug 2026, $275 the lot, and is
--  paying half of it himself. An even five-way split cannot say that, so
--  `expenses.shared_by` names the men a receipt is split between — null, the
--  ordinary case, still means the whole crew. The sink lands as two receipts
--  against the one item: $137.50 shared by Matt alone, and $137.50 shared by
--  the other four, which is $34.38 each.
--
--  Run this in the Supabase SQL editor INSTEAD of re-running seed.sql —
--  seed.sql wipes the year's expenses and obtained ticks; this touches only
--  the rows it names. Safe to re-run.
-- ============================================================================

-- ---------------------------------------------------------------- the column
-- schema.sql carries this now; the `if not exists` is what makes an existing
-- project safe to patch without re-running the schema.
alter table public.expenses add column if not exists shared_by text;
comment on column public.expenses.shared_by is
  'The men this receipt is split between, written the way assigned_to is '
  '("David / Nate / Chris / Mike"). Null means the whole crew, which is the '
  'ordinary case — store null rather than every name, so a receipt is never '
  'left split between a crew that has since changed.';

-- ---------------------------------------------------------------- the sink
-- 'Outdoor sink' was the prospect's name; the run sheet has called it the
-- utility sink since the Friday plan landed, so the two agree from here on.
-- kind 'Need' with obtained true is a thing that was bought, the same shape
-- the timers use. 'Owned' is next year's status, which repeat_next carries.
update public.items set
  name        = 'Utility sink',
  kind        = 'Need',
  qty         = '1',
  budget      = 275.00,
  assigned_to = 'Matt',
  obtained    = true,
  repeat_next = 'Yes',
  comments    = 'Stainless station — half countertop, half bowl. $275 the lot: Matt pays half, the other four $34.38 each.',
  locked      = false
where year = 2026 and name in ('Outdoor sink', 'Utility sink');

-- ---------------------------------------------------------------- the money
-- Re-runnable: clear our own receipts before adding them back.
delete from public.expenses
where year = 2026 and label in ('Utility sink — Matt''s half', 'Utility sink — the crew''s half');

-- Matt paid all $275, so both rows are paid_by Matt. What differs is who each
-- half is split between, and that is the whole of the arithmetic: his half
-- nets to nothing, and the crew's half is $34.38 a man from the other four.
insert into public.expenses (year, item_id, category, paid_by, amount, label, shared_by, spent_on)
select 2026, i.id, 'toolkit', 'Matt', 137.50, 'Utility sink — Matt''s half',
       'Matt', date '2026-08-26'
from public.items i where i.year = 2026 and i.name = 'Utility sink'
union all
select 2026, i.id, 'toolkit', 'Matt', 137.50, 'Utility sink — the crew''s half',
       'David / Nate / Chris / Mike', date '2026-08-26'
from public.items i where i.year = 2026 and i.name = 'Utility sink';

-- ---------------------------------------------------------------- the day
-- The lead-up task is spent: the thing it was waiting on is in the truck.
update public.runsheet set
  done    = true,
  -- stamped rather than now(), so a re-run does not move the day's record
  done_at = timestamptz '2026-08-26 12:00:00-04',
  notes   = 'Done — bought 26 Aug for $275. Matt paid; his half and the crew''s half are two receipts on the Spend screen.'
where year = 2026 and activity = 'Order the utility sink/counter';
