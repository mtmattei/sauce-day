-- ============================================================================
--  SAUCE DAY · 2026 patch: one fact, one place.
--
--  A de-duplication pass over the run sheet, the ledger and the menu. Nothing
--  is dropped that carried its own meaning; what goes is the second and third
--  copy of a fact that already lives somewhere the app computes it.
--
--  1. Friday gets its nesting back. The timeline folds every step under the
--     milestone above it, so "Set up the TV" was reading as a sub-step of
--     washing the jars. Two rows become milestones and two pairs merge:
--       · pull out the gear + clean each piece  -> one pass, one row
--       · set up the barbecue + set up the TV   -> one trip to the patio
--  2. Frozen arithmetic comes out of the comments. Litres, bushel counts and
--     last year's grappa price are computed on the Sauce and Grappa tabs; a
--     number typed into a comment is a number that goes stale silently.
--  3. One word per state: 'Have' becomes 'Owned'.
--  4. The menu's "qty -" placeholder becomes empty, so the row shows what it
--     actually knows.
--  5. The buckets were one pile counted twice, split by the shop they came
--     from. Thirteen buckets, one row.
--
--  Run this in the Supabase SQL editor. It touches only the rows it names and
--  is safe to re-run.
-- ============================================================================

-- ---------------------------------------------------------------- run sheet
-- Merge: the gear gets cleaned and checked as it comes out of the garage.
-- Two rows described one pass over the same pile.
update public.runsheet set
  activity  = 'Pull out the gear, cleaning and checking each piece',
  equipment = 'Burners, tent, plastic table, Dawn, scrub pads',
  duration_min = 45,
  notes     = 'Everything out of the garage in one pass. Cracked, rusted or missing gets found now, not at 07:00.'
where year = 2026 and activity in ('Pull out and organise the gear',
                                   'Pull out the gear, cleaning and checking each piece');

delete from public.runsheet
where year = 2026 and activity = 'Clean and check each piece as it comes out';

-- Merge: the barbecue and the TV are the same trip to the patio.
update public.runsheet set
  activity  = 'Set up the barbecue and the TV',
  equipment = 'BBQ, propane, TV, extension cord',
  duration_min = 30,
  notes     = 'TV out of the splash zone.'
where year = 2026 and activity in ('Set up the barbecue',
                                   'Set up the barbecue and the TV');

delete from public.runsheet
where year = 2026 and activity = 'Set up the TV';

-- The setup block gets its own headline, so the sink, the burners, the
-- barbecue and the propane hang off it instead of off the jar washing.
update public.runsheet set
  activity  = 'Set up the work area — tables, tent and chairs',
  milestone = true,
  notes     = 'The whole work area goes up in this block: tables first, then the sink, the burners and the barbecue.'
where year = 2026 and activity in ('Set up tables, tent and chairs',
                                   'Set up the work area — tables, tent and chairs');

-- Staging is the last act of Friday, not a footnote to the food prep.
update public.runsheet set milestone = true
where year = 2026 and activity = 'Stage jars, mill, tools and supplies for the morning';

-- Close the gaps the merges left. Keyed on activity, so re-running is a no-op.
update public.runsheet r set sort_index = m.si
from (values
  ('Pull out the gear, cleaning and checking each piece',    70),
  ('Set up the work area — tables, tent and chairs',         90),
  ('Set up the utility sink/counter',                       100),
  ('Set up the burners',                                    110),
  ('Set up the barbecue and the TV',                        120),
  ('Fill and check propane tanks',                          140)
) as m(activity, si)
where r.year = 2026 and r.activity = m.activity;

-- Last year's grappa price lives on the Grappa tab, which computes the record
-- from the years themselves. Two run sheet rows had it typed in.
update public.runsheet
set notes = 'It has to beat last year. See the Grappa tab.'
where year = 2026 and activity = 'Sort out the grappa';

-- The purchase spec for the sink lives on the item. The run sheet keeps only
-- what Friday needs to know.
update public.runsheet
set notes = 'Hose tap, and somewhere for the water to drain.'
where year = 2026 and activity = 'Set up the utility sink/counter';

-- ---------------------------------------------------------------- ledger
-- One word for one state. 'Have' and 'Owned' meant the same thing, and the UI
-- had to test for both.
update public.items set kind = 'Owned'
where year = 2026 and kind = 'Have';

-- The bushel count is live on the Yield & Jars tab: 'qty 10' here disagreed
-- with the seven bushels the crew actually plans on, and the budget is written
-- by that tab's push button anyway.
update public.items set
  qty = null,
  comments = 'Pickup Fri Aug 28 at the market. Count and budget live on the Yield & Jars tab.'
where year = 2026 and name = 'Bushels of tomatoes';

-- The soffritto rows each restated the same total litres. The ratio is the
-- part that survives a change of plan; the litres are on the Sauce tab.
update public.items set comments = 'Soffritto — roughly one per 5 L of sauce.'
where year = 2026 and name = 'Onions';
update public.items set comments = 'Soffritto — a head per 8 L of sauce.'
where year = 2026 and name = 'Garlic';
update public.items set comments = 'Soffritto — one per 7 L of sauce.'
where year = 2026 and name = 'Carrots';
update public.items set comments = 'Soffritto — a stalk per 7 L of sauce.'
where year = 2026 and name = 'Celery';

-- How to commit the sink now lives on the run sheet task that does the
-- committing. The item keeps the two options and their prices.
update public.items set
  comments = 'Preferred: 1 m stainless sink station — half countertop, half bowl, 304 restaurant steel, $279.99 on Amazon, in stock, 4.8/5. No faucet in the listing — plan on a hose tap. Budget option: PDG folding table with sink & tap, $124.99 at Canadian Tire. Prices read 17 Aug 2026.'
where year = 2026 and name = 'Outdoor sink';

-- ---------------------------------------------------------------- grappa
-- grappaRecord() takes the record from the past years themselves, so the
-- number does not need typing into this year's note as well.
update public.grappa set notes = 'Not bought yet.'
where year = 2026;

-- ---------------------------------------------------------------- menu
-- '-' is not a quantity. The row renders "qty -" for it, on every line that
-- never had a quantity to give.
update public.menu set qty = null
where year = 2026 and qty = '-';

-- ---------------------------------------------------------------- buckets
-- Same buckets, counted twice because they were bought in two shops. Thirteen
-- of them: David has eleven, Matt two. Owned kit needs no store — a store is
-- what puts a row on the Buy list, and these two were sitting there as things
-- to go and get, which they are not.
update public.items set
  name        = 'Buckets',
  qty         = '13',
  assigned_to = 'David (11) / Matt (2)',
  store       = null,
  repeat_next = 'Yes',
  comments    = '6 from Canadian Tire, 7 from Home Depot.',
  locked      = true
where year = 2026 and name in ('Buckets (Canadian Tire)', 'Buckets');

delete from public.items
where year = 2026 and name = 'Buckets (Home Depot)';
