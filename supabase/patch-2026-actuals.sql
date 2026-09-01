-- ============================================================================
--  SAUCE DAY · 2026 actuals: what the day really cost.
--
--  The plan is in seed.sql and the patches before this one. This file records
--  what actually happened on 29 August 2026, receipt by receipt.
--
--  1. Ten bushels for $280 at the market. Logged as an ingredients receipt
--     against the "Bushels of tomatoes" line and ticked off the buy list, the
--     same two writes the Spend screen makes. The planned price per bushel is
--     deliberately left alone — see the note at the foot of section 1.
--
--  Run in the Supabase SQL editor. Safe to re-run: each receipt is deleted by
--  its label before it is inserted, so nothing doubles up.
--
--  !! BEFORE RUNNING: set the payer on the bushels receipt below. It is the
--  !! one field with no default, and the settlement is wrong if it is wrong.
-- ============================================================================

-- ---------------------------------------------------------------- 1. bushels
delete from public.expenses
where year = 2026 and label = '10 bushels at the market';

insert into public.expenses (year, item_id, category, paid_by, amount, label, spent_on)
select
  2026,
  (select id from public.items
    where year = 2026 and category = 'ingredients' and name = 'Bushels of tomatoes'
    limit 1),
  'ingredients',
  'TODO-WHO-PAID',            -- <<< Matt / David / Nate / Chris / Mike
  280.00,
  '10 bushels at the market',
  date '2026-08-29';

-- The receipt is also the proof it is in the truck.
update public.items
set obtained = true
where year = 2026 and category = 'ingredients' and name = 'Bushels of tomatoes';

-- app_settings.price_per_bushel stays at the planned $25.00, and the item's
-- budget stays at $175. They are the forecast, and a forecast quietly rewritten
-- to match the receipt can never be wrong — which makes the whole
-- budget-versus-actual reading worthless. Ten bushels at $28 is the news, and
-- the Sauce screen reading $250 planned against $280 spent is the app working.

-- ---------------------------------------------------------------- 2. grappa
-- Mike brought the bottle this year, so the record follows him and not David,
-- who has bought it every year since 2022. The bottle was not on the shortlist,
-- so js/grappas.js carries its photograph in WINNERS while this carries the
-- facts.
--
--  !! The bottle and the price are still TODO. Until the price is in, the
--  !! Verdict tile reads "Not bought yet" and the shelf leaves 2026 empty.
update public.grappa
set bought_by = 'Mike',
    notes     = 'Mike brought it. Not off the shortlist.'
where year = 2026;

-- When you have the label and the receipt, this is the line:
-- update public.grappa
-- set bottle = 'TODO', producer = 'TODO', region = 'TODO',
--     price = 0.00, rating = null
-- where year = 2026;
