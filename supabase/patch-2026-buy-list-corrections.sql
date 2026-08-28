-- ============================================================================
--  SAUCE DAY · 2026 patch: the buy list catches up with ten bushels.
--
--  Three bushels more is 42 more litres, and six rows were still written for
--  seven. Plus three rows that were saying something they did not mean.
--
--  1. The jar run. 140 L with the 10% buffer is 154 jars against 64 on hand:
--     8 packs of jars and 5 packs of lids, ~$185, where the two rows carried
--     $54.95 between them. Bands need none — 66 on hand plus the 96 that come
--     in the jar packs clears 154.
--  2. The bushel line still costs seven. Ten at $25 is $250.
--  3. The soffritto is still cut for 98 L. The ledger's own ratios want more.
--  4. Fennel comes back. It was struck with the other five, but oranges still
--     sit under 'Fennel and orange salad', so the dish stays broken out and
--     nothing was asking for fennel at all.
--  5. Burners and the straining cloth are Owned and were on the buy list only
--     because they still carried a store. A store is what puts a row on the
--     list; these two have nothing to buy, so the store goes.
--  6. The outdoor sink is a no for this year. It stays a Prospect at its
--     researched price, and the row says so rather than reading as pending.
--
--  Run this in the Supabase SQL editor INSTEAD of re-running seed.sql —
--  seed.sql wipes the year's expenses and obtained ticks; this touches only
--  the rows it names. Safe to re-run.
-- ============================================================================

-- ------------------------------------------------------------ 1. the jar run
-- Quantities are packs, which is how they are sold and how the Yield & Jars
-- tab counts them. The budgets are 8 x $19.99 and 5 x $4.99.
update public.items set
  qty = '8 packs', budget = 159.92,
  comments = 'Chris brings the difference — whatever the Yield & Jars tab still shows to buy. '
             'Ten bushels: 154 jars needed against 64 on hand.'
where year = 2026 and name = 'Mason jars';

update public.items set
  qty = '5 packs', budget = 24.95,
  comments = 'See Yield & Jars. 58 short once the jar packs are counted.'
where year = 2026 and name = 'Lids';

-- Bands come free with the jar packs: 66 on hand + 96 in the boxes beats 154.
-- The row stays on the list because new sets were wanted anyway; it just stops
-- implying a shortfall.
update public.items set
  comments = 'All new sets of rims, if we want them — 66 bands on hand plus 96 in the '
             'jar packs already covers 154, so nothing here is short.'
where year = 2026 and name = 'Rims';

-- ------------------------------------------------------------ 2. the bushels
update public.items set
  budget = 250.00,
  comments = 'Pickup Fri Aug 28 at the market. Ten bushels at $25. '
             'Count and budget live on the Yield & Jars tab.'
where year = 2026 and name = 'Bushels of tomatoes';

-- ----------------------------------------------------------- 3. the soffritto
-- Same ratios the rows already carried, run against 140 L instead of 98.
update public.items set qty = '7 kg (~28)'
  where year = 2026 and name = 'Onions';
update public.items set qty = '18 heads'
  where year = 2026 and name = 'Garlic';
update public.items set qty = '3 kg (~20)'
  where year = 2026 and name = 'Carrots';
update public.items set qty = '3 bunches', comments = 'Soffritto — a stalk per 7 L of sauce. Twenty stalks at ten bushels.'
  where year = 2026 and name = 'Celery';

-- -------------------------------------------------------------- 4. the fennel
-- Re-runnable: clear it before putting it back.
delete from public.items
where year = 2026 and category = 'food' and name = 'Fennel';

insert into public.items
  (year, category, subcategory, sort_index, name, kind, qty, budget, assigned_to, store, comments)
values
  (2026, 'food', 'Fennel and orange salad', 220, 'Fennel', 'Need', '3 bulbs', 0, null, 'Market',
   'Struck with the ten-bushel six, but the oranges kept the dish broken out — so nothing was asking for fennel.');

-- ------------------------------------------------- 5. owned rows, no shopping
-- Clearing the store is what takes them off the Buy list. Both stay Owned and
-- stay in the Ledger where they belong.
update public.items set store = null
where year = 2026 and name in ('Burners', 'Cloth to strain water') and kind = 'Owned';

update public.items set comments = 'Owned. David was checking Amazon for more, but nothing ships in time — off the buy list.'
where year = 2026 and name = 'Cloth to strain water';

-- ---------------------------------------------------------------- 6. the sink
-- Not bought this year. The research stays on the row for next August.
update public.items set
  repeat_next = 'Maybe',
  comments = 'NOT for 2026 — never ordered, and there is no lead time left. Revisit next year. '
             'Preferred: 1 m stainless sink station — half countertop, half bowl, 304 restaurant '
             'steel, $279.99 on Amazon, 4.8/5. No faucet in the listing — plan on a hose tap. '
             'Budget option: PDG folding table with sink & tap, $124.99 at Canadian Tire. '
             'Prices read 17 Aug 2026.'
where year = 2026 and name = 'Outdoor sink';
