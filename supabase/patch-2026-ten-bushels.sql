-- ============================================================================
--  SAUCE DAY · 2026 patch: ten bushels, white wine, and a shorter buy list.
--
--  1. The crew buys ten bushels, not seven. The run sheet lines that spelled
--     out "7 bushels" follow the number.
--  2. David picks up two more buckets at Canadian Tire. The thirteen owned
--     buckets stay one row; the two to buy are their own Need line so they
--     show on the buy list and go grey when he has them.
--  3. Off the buy list: blood orange juice, pecorino, artichokes, lemons,
--     cremini mushrooms, fennel.
--  4. The Italian red wine becomes white.
--
--  Run in the Supabase SQL editor. Safe to re-run.
-- ============================================================================

-- ---------------------------------------------------------------- 1. bushels
update public.bushels set count = 10 where year = 2026 and person = 'Crew';

update public.runsheet
set ingredients = replace(ingredients, '7 bushels', '10 bushels')
where year = 2026 and ingredients like '%7 bushels%';

-- ---------------------------------------------------------------- 2. buckets
delete from public.items
where year = 2026 and category = 'toolkit' and name = 'Buckets' and kind = 'Need';

insert into public.items
  (year, category, subcategory, sort_index, name, kind, qty, budget, assigned_to, store, repeat_next, comments)
values
  (2026, 'toolkit', 'Wash & Prep', 81, 'Buckets', 'Need', '2', 0, 'David', 'Canadian Tire', 'Yes',
   'Two more on top of the thirteen we own.');

-- ---------------------------------------------------------------- 3. off the list
delete from public.items
where year = 2026 and category = 'food'
  and name in ('Blood orange juice', 'Pecorino', 'Artichokes', 'Lemons', 'Cremini mushrooms', 'Fennel');

-- The buy list shows a dish only while nothing is listed under it. With their
-- ingredients gone, 'Grilled artichokes' and 'Blood orange juice / mimosas'
-- come back as single lines. If they are off the menu entirely, uncomment:
-- delete from public.menu
-- where year = 2026 and dish in ('Grilled artichokes', 'Blood orange juice / mimosas');

-- ---------------------------------------------------------------- 4. white wine
update public.menu
set dish = 'Italian white wine',
    notes = 'Pinot Grigio, Soave or similar'
where year = 2026 and dish = 'Italian red wine';
