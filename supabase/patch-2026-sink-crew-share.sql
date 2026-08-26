-- ============================================================================
--  SAUCE DAY · 2026 patch: the sink goes on the sheet at the crew's number.
--
--  Matt's own share of the sink comes off the books entirely. What the five of
--  them settle is $150, split the ordinary way — $30 a man — and the rest of
--  the price is Matt's, out of pocket, deliberately not recorded. One receipt
--  where there were two, and no uneven split left in the year.
--
--  Run this AFTER patch-2026-utility-sink.sql, which is what put the two
--  receipts there. Run it in the Supabase SQL editor INSTEAD of re-running
--  seed.sql — seed.sql wipes the year's expenses and obtained ticks; this
--  touches only the rows it names. Safe to re-run.
-- ============================================================================

-- The budget follows the receipt: what the ledger prices is what the crew is
-- being asked for, and the comment is where the rest of the story lives.
update public.items set
  budget   = 150.00,
  comments = 'Stainless station — half countertop, half bowl. $150 on the sheet, $30 a man; Matt covers the rest out of pocket.'
where year = 2026 and name = 'Utility sink';

-- Out with the two halves, in with the one share. shared_by stays null: this
-- is the whole crew's, which is the ordinary case and the even split.
delete from public.expenses
where year = 2026 and label in ('Utility sink — Matt''s half',
                                'Utility sink — the crew''s half',
                                'Utility sink — the crew''s share');

insert into public.expenses (year, item_id, category, paid_by, amount, label, shared_by, spent_on)
select 2026, i.id, 'toolkit', 'Matt', 150.00, 'Utility sink — the crew''s share',
       null, date '2026-08-26'
from public.items i where i.year = 2026 and i.name = 'Utility sink';

-- The run sheet note said two receipts. There is one.
update public.runsheet set
  notes = 'Done — bought 26 Aug. Matt paid; the crew''s $150 is one receipt on the Spend screen, $30 a man.'
where year = 2026 and activity = 'Order the utility sink/counter';
