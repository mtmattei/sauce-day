-- ============================================================================
--  SAUCE DAY · 2026: the Friday run, booked.
--
--  Ten card transactions from 28 August, off Matt's card ending 3474, read off
--  the statement while they were all still pending. $708.48 in one day.
--
--  What is a guess and what is not:
--    · Amounts, dates and merchants are exact — they came off the statement.
--    · paid_by is Matt on all ten. One card.
--    · Only Le Potager is tied to a ledger row (the bushels) and ticks it off.
--      Every other receipt covers several lines at once — a salumeria run is
--      the bresaola AND the prosciutto AND the soppressata — and expenses.item_id
--      holds one line, so the rest are logged against the category and the
--      lines get ticked by hand as they come out of the bags.
--    · Categories follow the shop. Two are judgement calls, flagged below.
--
--  Run in the Supabase SQL editor. Safe to re-run.
-- ============================================================================

-- Re-runnable: clear this day's own rows before adding them back.
delete from public.expenses
where year = 2026 and spent_on = date '2026-08-28'
  and label like '28 Aug ·%';

insert into public.expenses (year, category, paid_by, amount, label, spent_on, item_id, created_by) values
  -- The bushels. The one receipt that maps to exactly one row, so it carries
  -- the link and ticks the line off below. $280 against a $250 budget.
  (2026, 'ingredients', 'Matt', 280.00, '28 Aug · Le Potager Mont Rouge — the bushels', '2026-08-28',
   (select id from public.items where year = 2026 and name = 'Bushels of tomatoes'), 'Matt'),

  -- Produce. Booked to ingredients on the reading that this was the soffritto
  -- run — onions, garlic, carrots, celery. If it was the salad and antipasto
  -- veg instead, this is 'food'.
  (2026, 'ingredients', 'Matt', 38.00, '28 Aug · Eric L Ecuyer Fruits et Legumes', '2026-08-28', null, 'Matt'),

  -- Parking on the market run. Not a line on the buy list; booked with the
  -- run it belongs to rather than invented as its own category.
  (2026, 'ingredients', 'Matt', 5.00, '28 Aug · Impark — parking on the market run', '2026-08-28', null, 'Matt'),

  -- The Italian shops.
  (2026, 'food', 'Matt', 91.31, '28 Aug · Fruiterie Milano', '2026-08-28', null, 'Matt'),
  (2026, 'food', 'Matt', 58.46, '28 Aug · Piazza Salumi (1 of 2)', '2026-08-28', null, 'Matt'),
  (2026, 'food', 'Matt', 37.58, '28 Aug · Piazza Salumi (2 of 2)', '2026-08-28', null, 'Matt'),

  -- The butchers.
  (2026, 'food', 'Matt', 85.89, '28 Aug · Cochons Tout Ronds', '2026-08-28', null, 'Matt'),
  (2026, 'food', 'Matt', 39.19, '28 Aug · Boucherie Les Fermes Solidaires', '2026-08-28', null, 'Matt'),

  -- The grocery. Dawn and the sponges are toolkit rows and are almost certainly
  -- inside one of these two receipts; without the itemisation both go to food.
  (2026, 'food', 'Matt', 38.56, '28 Aug · IGA Extra Lalonde (1 of 2)', '2026-08-28', null, 'Matt'),
  (2026, 'food', 'Matt', 34.49, '28 Aug · IGA Extra Lalonde (2 of 2)', '2026-08-28', null, 'Matt');

-- The tomatoes are in the truck.
update public.items set obtained = true
where year = 2026 and name = 'Bushels of tomatoes';
