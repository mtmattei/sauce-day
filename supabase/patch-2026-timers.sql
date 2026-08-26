-- ============================================================================
--  SAUCE DAY · 2026 patch: two timers join the toolkit, already bought.
--
--  Matt picked up a pair on 26 Aug 2026, $10 for the two — one to sit on the
--  sauce pot, one on the jars, so the boil and the sterilising both get a
--  clock instead of a guess. The row lands on the Buy list already ticked,
--  and the $10 lands in the ledger as a toolkit expense paid by Matt.
--
--  Run this in the Supabase SQL editor INSTEAD of re-running seed.sql —
--  seed.sql wipes the year's expenses and obtained ticks; this touches only
--  the rows it names. Safe to re-run.
-- ============================================================================

-- Re-runnable: clear our own rows before adding them back. The expense goes
-- first, since it points at the item.
delete from public.expenses
where year = 2026 and label = 'Timers x2';
delete from public.items
where year = 2026 and name = 'Timers';

-- kind 'Need' is what puts it on the Buy list; obtained = true is what ticks
-- it off there. Not 'Owned' — that is next year's status, which repeat_next
-- already carries.
insert into public.items
  (year, category, subcategory, sort_index, name, kind, qty, budget, assigned_to, store,
   obtained, repeat_next, comments, link) values
  (2026, 'toolkit', 'Cooking & Heat', 205, 'Timers', 'Need', '2', 10.00, 'Matt', null,
   true, 'Yes', 'Two of them: one on the pot, one on the jars.', null);

-- The receipt. item_id ties it to the row above so the Ledger shows the money
-- against the thing it bought.
insert into public.expenses (year, item_id, category, paid_by, amount, label, spent_on)
select 2026, i.id, 'toolkit', 'Matt', 10.00, 'Timers x2', date '2026-08-26'
from public.items i
where i.year = 2026 and i.name = 'Timers';
