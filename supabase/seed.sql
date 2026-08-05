-- ============================================================================
--  SAUCE DAY  ·  seed data
--  Run AFTER schema.sql. Loads 2020-2025 history and the 2026 starting plan.
--  Safe to re-run: it clears the tables it fills first.
-- ============================================================================

delete from public.expenses;
delete from public.items         where year = 2026;
delete from public.bushels       where year = 2026;
delete from public.jar_inventory where year = 2026;
delete from public.runsheet      where year = 2026;
delete from public.menu          where year = 2026;
delete from public.app_settings  where year = 2026;
delete from public.grappa;
delete from public.history;
delete from public.members;

-- ---------------------------------------------------------------- crew
-- Replace the .invalid addresses with your friends' real emails, either here
-- or from the Crew screen once you are signed in.
insert into public.members (email, display_name, is_admin, sort_index) values
  ('matthewunoplatform@gmail.com', 'Matt', true, 1),
  ('david@change-me.invalid', 'David', false, 2),
  ('nate@change-me.invalid', 'Nate', false, 3),
  ('chris@change-me.invalid', 'Chris', false, 4),
  ('mike@change-me.invalid', 'Mike', false, 5);

-- ---------------------------------------------------------------- this year
insert into public.app_settings
  (year, edition, sauce_date, crew_size, litres_per_bushel, buffer_pct,
   price_per_bushel, jar_price, band_price, lid_price) values
  (2026, 7, '2026-08-29', 5, 14.0, 0.10, 25.00, 19.99, 8.79, 4.99);

-- ---------------------------------------------------------------- ledger
insert into public.items
  (year, category, sort_index, name, kind, qty, budget, assigned_to, store,
   repeat_next, comments, link) values
  (2026, 'toolkit', 1, 'Table blanket', 'Owned', '1', 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 2, 'Food mill', 'Owned', '1', 0, 'Matt', null, 'Yes', '2025 note: consider a new mill', null),
  (2026, 'toolkit', 3, 'Cauldrons', 'Owned', '3', 0, 'Matt (2) / David (1) / Chris (2)', null, 'Yes', null, null),
  (2026, 'toolkit', 4, 'Mason jars', 'Owned', null, 39.98, 'David / Matt', 'Canadian Tire', 'Yes', 'See Yield & Jars tab for this year''s count', null),
  (2026, 'toolkit', 5, 'Funnel (wide mouth)', 'Owned', '1', 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 6, 'Cheesecloth', 'Need', '4', 0, 'Matt', 'Market', 'No', null, null),
  (2026, 'toolkit', 7, 'Ladle', 'Owned', '1', 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 8, 'Cutting boards', 'Owned', '5', 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 9, 'Knives', 'Owned', '5', 0, 'BYOK / Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 10, 'Kiddie pool', 'Owned', '1', 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 11, 'Chairs', 'Owned', '5', 0, 'David (4) / Matt (2)', null, 'Yes', null, null),
  (2026, 'toolkit', 12, 'Tables', 'Owned', '2', 0, 'Matt (1) / Chris (1)', null, 'Yes', null, null),
  (2026, 'toolkit', 13, 'Rims', 'Need', null, 0, 'David / Matt', 'Canadian Tire', 'No', 'All new sets of rims', null),
  (2026, 'toolkit', 14, 'Buckets (Canadian Tire)', 'Owned', '6', 0, 'David', 'Canadian Tire', 'Buy', null, null),
  (2026, 'toolkit', 15, 'Lids', 'Need', '2', 14.97, 'David', 'Canadian Tire', 'No', 'See Yield & Jars tab', null),
  (2026, 'toolkit', 16, 'Burners', 'Owned', '3', 0, 'David (2) / Matt (1)', 'Home Depot', 'Buy', null, 'https://www.homedepot.ca/product/martin-r65-propane-burner/1000751079'),
  (2026, 'toolkit', 17, 'Propane', 'Refill', '3', 35.0, 'Matt (2) / Mike / Chris', null, 'Yes', 'Recurring every year', null),
  (2026, 'toolkit', 18, 'Mason jar lifters', 'Owned', '2', 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 19, 'Buckets (Home Depot)', 'Owned', '7', 0, 'David / Matt', 'Home Depot', 'Yes', null, null),
  (2026, 'toolkit', 20, 'Spider ladle', 'Owned', null, 0, 'Matt / Mike', null, 'Yes', null, null),
  (2026, 'toolkit', 21, 'Stainless deep dish pan', 'Owned', null, 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 22, 'Metal bowl', 'Owned', null, 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 23, 'Garbage bags', 'Owned', null, 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 24, 'Metal sponges', 'Owned', null, 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 25, 'Cleaning brush', 'Owned', null, 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 26, 'Aprons', 'Owned', null, 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 27, 'Napkins', 'Owned', null, 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 28, 'Cloth to strain water', 'Owned', null, 0, 'Matt', 'Amazon', 'Yes', 'David to check Amazon', null),
  (2026, 'toolkit', 29, 'Dawn dish soap', 'Owned', null, 0, 'David', null, 'Yes', null, null),
  (2026, 'toolkit', 30, 'Scrub pads', 'Owned', null, 0, 'David', null, 'Yes', null, null),
  (2026, 'toolkit', 31, 'Barkeepers Friend', 'Owned', null, 0, 'David', null, 'Yes', null, null),
  (2026, 'toolkit', 32, 'Pop-up tent', 'Owned', null, 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 33, 'Strainer for sauce pot', 'Need', '1', 0, null, null, 'Buy', 'Carried over from 2025 notes', null),
  (2026, 'toolkit', 34, 'Speakers', 'Owned', '1', 0, 'David', null, 'Yes', null, null),
  (2026, 'ingredients', 1, 'Bushels of tomatoes', 'Need', '10', 175.0, 'Matt / David / Nate', 'Market', 'Yes', 'Recurring. Budget links to Yield & Jars tab', null),
  (2026, 'ingredients', 2, 'Basil', 'Need', null, 0, 'Matt / David / Nate', 'Market', 'Yes', 'Matt potentially has', null),
  (2026, 'ingredients', 3, 'Parsley', 'Need', null, 0, 'Matt / David / Nate', 'Market', 'Yes', 'Matt potentially has', null),
  (2026, 'ingredients', 4, 'Onions', 'Costco', null, 0, 'Matt / David / Nate', 'Costco', 'Yes', null, null),
  (2026, 'ingredients', 5, 'Garlic', 'Costco', null, 0, 'Matt / David / Nate', 'Costco', 'Yes', null, null),
  (2026, 'ingredients', 6, 'Carrots', 'Costco', null, 0, 'Matt / David / Nate', 'Costco', 'Yes', null, null),
  (2026, 'ingredients', 7, 'Celery', 'Costco', null, 0, 'Matt / David / Nate', 'Costco', 'Yes', null, null),
  (2026, 'ingredients', 8, 'Salt', 'Have', null, 0, 'Matt / David / Nate', null, 'Yes', null, null),
  (2026, 'ingredients', 9, 'Sugar', 'Have', null, 0, 'Matt / David / Nate', null, 'Yes', null, null),
  (2026, 'food', 1, 'McDonald''s breakfast combos', 'Breakfast run', '5', 0, 'Chris', 'McDonald''s', 'Yes', null, null),
  (2026, 'food', 2, 'Grappa', 'The annual bottle - beat last year', '1', 0, 'David', 'SAQ', 'Yes', 'See Grappa Hall of Fame tab', 'https://www.saq.com/en/11849106'),
  (2026, 'food', 3, 'Orange juice', 'For mimosas / morning', null, 0, null, 'Costco', 'Yes', null, null),
  (2026, 'food', 4, 'Biscotti', 'Get the day off the tomatoes', null, 0, 'Nate', 'Bakery', 'Yes', null, null),
  (2026, 'food', 5, 'Bread', 'For fontina bites', null, 0, 'Nate', 'Bakery', 'Yes', null, null),
  (2026, 'food', 6, 'Marinated olives', null, null, 0, 'Nate', 'Market', 'Yes', null, null),
  (2026, 'food', 7, 'Mozzarella', null, null, 0, null, 'Market', 'Yes', null, null),
  (2026, 'food', 8, 'Roasted peppers', null, null, 0, null, 'Market', 'Yes', null, null),
  (2026, 'food', 9, 'Canned tuna', null, null, 0, 'Chris', 'Grocery', 'Yes', null, null),
  (2026, 'food', 10, 'Cannellini beans', null, null, 0, 'Chris', 'Grocery', 'Yes', null, null),
  (2026, 'food', 11, 'Good olive oil', 'The nice bottle', null, 0, 'Nate', 'Market', 'Yes', null, null),
  (2026, 'food', 12, 'Italian lemonade', 'Siciliana?', '20', 0, null, 'Grocery', 'Yes', null, null),
  (2026, 'food', 13, 'Arancini', 'From Little Italy', null, 0, null, 'Little Italy', 'Yes', null, null),
  (2026, 'food', 14, 'Lupini', null, '10', 0, null, 'Market', 'Yes', null, null),
  (2026, 'food', 15, 'Prosecco', null, null, 0, 'David', 'SAQ', 'Yes', null, null),
  (2026, 'food', 16, 'Fresh pasta', 'For the dinner service', null, 0, null, 'Market', 'Yes', 'NOTE: this $31 line was excluded from the 2025 stated food total', null),
  (2026, 'food', 17, 'Meatballs', 'Veal, pork and beef from Inman', null, 0, null, 'Inman', 'Yes', null, null),
  (2026, 'food', 18, 'Cold cuts', 'Prosciutto, mortadella, capicollo', null, 0, null, 'Market', 'Yes', null, null),
  (2026, 'food', 19, 'Insalata caprese', 'To list out', null, 0, null, 'Market', 'Yes', null, null),
  (2026, 'food', 20, 'Rustic garlic bread', 'Costco', null, 0, null, 'Costco', 'Yes', null, null),
  (2026, 'food', 21, 'Hard cheese', null, null, 0, null, 'Market', 'Yes', null, null),
  (2026, 'food', 22, 'Bruschetta', 'To list ingredients', null, 0, null, 'Market', 'Yes', null, null),
  (2026, 'food', 23, 'Vodka', null, null, 0, 'David', 'SAQ', 'Yes', null, null),
  (2026, 'food', 24, 'Kahlua', null, null, 0, 'David', 'SAQ', 'Yes', null, null),
  (2026, 'food', 25, 'Wine', '2 white, 1 red?', '4', 0, 'David', 'SAQ', 'Yes', null, null),
  (2026, 'food', 26, 'Sausages', null, null, 0, 'David', 'Butcher', 'Yes', null, null),
  (2026, 'food', 27, 'Espresso', 'Pick up from the roastery - grind first', null, 0, 'David', 'Roastery', 'Yes', '2025 note: grind before the day', null),
  (2026, 'food', 28, 'Dried sausages', null, null, 0, null, 'Butcher', 'Yes', null, null),
  (2026, 'food', 29, 'Grapes', null, null, 0, 'David', 'Market', 'Yes', null, null),
  (2026, 'food', 30, 'Focaccia', 'Mike to make', null, 0, 'Mike', 'Homemade', 'Yes', null, null),
  (2026, 'food', 31, 'Sparkling water', 'Costco', null, 0, null, 'Costco', 'Yes', null, null),
  (2026, 'food', 32, 'Beer', null, null, 0, null, 'Depanneur', 'Yes', null, null);

-- ---------------------------------------------------------------- bushels
-- One row, not a roster: the crew goes and buys the lot together, so the only
-- number that matters is the total. calc.js sums every row in this table, so
-- adding rows back later still works if that ever changes.
insert into public.bushels (year, person, count) values
  (2026, 'Crew', 7);

-- ---------------------------------------------------------------- jars on hand
insert into public.jar_inventory (year, person, jars, bands, lids) values
  (2026, 'Matt', 67, 74, 48),
  (2026, 'David', 24, 10, 0),
  (2026, 'Nate', 0, 0, 0),
  (2026, 'Chris', 0, 0, 0),
  (2026, 'Mike', 0, 0, 0);

-- ---------------------------------------------------------------- run sheet
-- Two levels. `milestone` rows are the headline beats of the day and get their
-- own card on the Sauce Day timeline; the rest are the operational steps that
-- sit underneath the milestone above them. Both live in one table so the Run
-- tab stays a single editable list and there is one source of truth.
insert into public.runsheet
  (year, sort_index, section, time_label, activity, lead, crew, equipment,
   icon, duration_min, ingredients, milestone, critical, notes) values
  -- Friday night
  (2026,  1, 'PREP', 'Fri PM', 'Pick up bushels from the market', 'Nate', 'David', 'Truck, buckets',
   'bushel', 90, '7 bushels of San Marzano', true, false, 'Get there early, best tomatoes go first'),
  (2026,  2, 'PREP', 'Fri PM', 'Wash and sterilise every jar', 'Matt', 'All', 'Jars, dishwasher, Barkeepers Friend',
   'jar', 120, null, true, false, 'Count as you go'),
  (2026,  3, 'PREP', 'Fri PM', 'Set up tables, tent, chairs, kiddie pool', 'Matt', 'Chris', 'Tables, tent, chairs, pool',
   null, 45, null, false, false, null),
  (2026,  4, 'PREP', 'Fri PM', 'Fill and check propane tanks', 'Matt', 'Mike', '3 tanks',
   null, 30, null, false, false, 'Refill beats buying new'),
  (2026,  5, 'PREP', 'Fri PM', 'Chill all beer, wine, prosecco, water', 'David', null, 'Coolers, ice',
   null, 20, null, false, false, null),
  (2026,  6, 'PREP', 'Fri PM', 'Grind the espresso', 'David', null, 'Grinder',
   null, 10, 'Beans from the roastery', false, false, '2025 lesson: do this the night before'),

  -- The day
  (2026,  7, 'DAY', '06:30', 'Start sauce prep', 'Matt', 'All', 'Espresso, moka',
   'tomato', 60, 'Espresso', true, false, 'Crew arrives. Coffee before anything else.'),
  (2026,  8, 'DAY', '07:00', 'McDonald''s run', 'Chris', null, 'Cash',
   null, 30, null, false, false, '5 breakfast combos'),
  (2026,  9, 'DAY', '07:30', 'Fire up the burners', 'Matt', 'Mike', '3 burners, cauldrons, propane',
   'flame', 30, 'Propane', true, false, 'Wash water on at the same time'),
  (2026, 10, 'DAY', '08:00', 'Wash tomatoes', 'All', 'All', 'Kiddie pool, buckets, strainer',
   null, 60, '7 bushels', false, false, 'Two-stage rinse'),
  (2026, 11, 'DAY', '09:00', 'First batch cooking', 'Nate', 'David', 'Cauldrons, spider ladle',
   'cauldron', 90, 'Washed tomatoes', true, false, 'Blanch and cook'),
  (2026, 12, 'DAY', '10:30', 'Coffee break', 'David', 'All', 'Moka, biscotti',
   'coffee', 20, 'Espresso, biscotti', true, false, 'Get the day off the tomatoes for ten minutes'),
  (2026, 13, 'DAY', '10:45', 'First mill run', 'Chris', 'Matt', 'Food mill, deep dish pan',
   null, 45, null, false, false, 'Watch for skins clogging'),
  (2026, 14, 'DAY', '11:30', 'Jars into hot water, lids ready', 'Matt', null, 'Jar lifters, cauldron',
   null, 30, null, false, false, null),
  (2026, 15, 'DAY', '12:00', 'Lunch break', 'Nate', 'All', 'Tables, boards',
   'fork', 60, 'The antipasti spread', true, false, 'See the Menu tab'),
  (2026, 16, 'DAY', '13:00', 'Milling continues, bottling line starts', 'All', 'All', 'Funnel, ladle, mill',
   null, 120, null, false, false, null),
  (2026, 17, 'DAY', '15:00', 'Jarring begins', 'All', 'All', 'Funnel, rims, lids, bands',
   'jar', 90, 'Milled sauce, basil', true, true, 'Wipe every rim before capping. This is the one that matters.'),
  (2026, 18, 'DAY', '16:30', 'Wine break', 'David', 'All', 'Glasses',
   'glass', 30, 'Prosecco, the whites', true, false, 'Water bath goes on at the same time'),
  (2026, 19, 'DAY', '16:30', 'Water bath — seal the jars', 'Matt', 'David', 'Cauldron, jar lifters',
   null, 60, null, false, true, 'Listen for the pops'),
  (2026, 20, 'DAY', '18:00', 'Annual grappa toast', 'David', 'All', 'The bottle',
   'bottle', 30, 'This year''s grappa', true, true, 'It has to beat last year. See the Grappa tab.'),
  (2026, 21, 'DAY', '19:00', 'Dinner — pasta with this year''s sauce', 'Mike', 'All', 'Pots, fresh pasta',
   'plate', 90, 'Fresh pasta, this year''s sauce', true, false, 'The whole point'),
  (2026, 22, 'DAY', '20:30', 'Pizza run', 'Chris', null, 'Cash, the truck',
   'pizza', 45, null, true, false, 'Second wind. Nobody has ever regretted this.'),
  (2026, 23, 'DAY', '21:00', 'Cooling and cleanup', 'All', 'All', 'Dawn, scrub pads, metal sponges',
   'cool', 60, null, true, false, 'Jars stay put until they are cold. Do not move them early.'),
  (2026, 24, 'DAY', '22:00', 'Group photo', 'Matt', 'All', 'A phone and a timer',
   'camera', 15, null, true, false, 'Goes straight into the Photobook'),
  (2026, 25, 'DAY', '22:15', 'Count jars, log fallen soldiers, divide the sauce', 'Matt', 'All', 'Notebook',
   null, 15, null, false, false, 'Enter the count on the History tab'),
  (2026, 26, 'DAY', '22:30', 'Sauce Day complete', 'Matt', 'All', 'This workbook',
   'check', null, null, true, true, 'Settle up, then bed. Settlement says who pays whom.');

-- ---------------------------------------------------------------- menu
insert into public.menu (year, sort_index, service, dish, who, source, qty, notes) values
  (2026, 1, 'Breakfast', 'McDonald''s combos', 'Chris', 'McDonald''s', '5', null),
  (2026, 2, 'Breakfast', 'Espresso', 'David', 'Roastery', '-', 'Ground the night before'),
  (2026, 3, 'Breakfast', 'Biscotti', 'Nate', 'Bakery', '-', 'To get the day off the tomatoes'),
  (2026, 4, 'Breakfast', 'Orange juice / mimosas', null, 'Costco', '-', null),
  (2026, 5, 'Snack', 'Marinated olives', 'Nate', 'Market', '-', null),
  (2026, 6, 'Snack', 'Lupini', null, 'Market', '10', null),
  (2026, 7, 'Snack', 'Fontina bites on bread', 'Nate', 'Bakery', '-', null),
  (2026, 8, 'Lunch', 'Cold cuts - prosciutto, mortadella, capicollo', null, 'Market', '-', null),
  (2026, 9, 'Lunch', 'Insalata caprese', null, 'Market', '-', 'Mozzarella, basil, good olive oil'),
  (2026, 10, 'Lunch', 'Bruschetta', null, 'Market', '-', 'List the ingredients'),
  (2026, 11, 'Lunch', 'Roasted peppers', null, 'Market', '-', null),
  (2026, 12, 'Lunch', 'Canned tuna and cannellini beans', 'Chris', 'Grocery', '-', null),
  (2026, 13, 'Lunch', 'Hard cheese', null, 'Market', '-', null),
  (2026, 14, 'Lunch', 'Rustic garlic bread', null, 'Costco', '-', null),
  (2026, 15, 'Lunch', 'Focaccia', 'Mike', 'Homemade', '-', 'Mike makes it'),
  (2026, 16, 'Lunch', 'Arancini', null, 'Little Italy', '-', null),
  (2026, 17, 'Dinner', 'Fresh pasta with this year''s sauce', null, 'Market', '-', 'The whole point'),
  (2026, 18, 'Dinner', 'Meatballs - veal, pork and beef', null, 'Inman', '-', null),
  (2026, 19, 'Dinner', 'Sausages', 'David', 'Butcher', '-', null),
  (2026, 20, 'Dinner', 'Dried sausages', null, 'Butcher', '-', null),
  (2026, 21, 'Dinner', 'Grapes', 'David', 'Market', '-', null),
  (2026, 22, 'Drinks', 'Grappa - the annual bottle', 'David', 'SAQ', '1', 'Must beat last year'),
  (2026, 23, 'Drinks', 'Wine - 2 white, 1 red', 'David', 'SAQ', '4', null),
  (2026, 24, 'Drinks', 'Prosecco', 'David', 'SAQ', '-', null),
  (2026, 25, 'Drinks', 'Beer', null, 'Depanneur', '-', null),
  (2026, 26, 'Drinks', 'Vodka and Kahlua', 'David', 'SAQ', '-', 'Espresso martinis after dinner'),
  (2026, 27, 'Drinks', 'Italian lemonade', null, 'Grocery', '20', 'Siciliana?'),
  (2026, 28, 'Drinks', 'Sparkling water', null, 'Costco', '-', null);

-- ---------------------------------------------------------------- grappa
insert into public.grappa (year, bottle, producer, region, price, bought_by, rating, notes) values
  (2020, null, null, null, null, null, null, 'No record'),
  (2021, null, null, null, 0.0, null, null, 'No grappa line recorded on the 2021 sheet'),
  (2022, null, null, null, 80.0, 'David', null, 'Bottle not named on the sheet'),
  (2023, null, null, null, 0.0, null, null, 'No grappa recorded'),
  (2024, null, null, null, 82.25, 'David', null, 'Bottle not named on the sheet'),
  (2025, null, null, null, 135.0, 'David', null, 'SAQ product 11849106 - https://www.saq.com/en/11849106'),
  (2026, null, null, null, null, 'David', null, 'Not bought yet. It has to beat $135.00.');

-- ---------------------------------------------------------------- history
insert into public.history
  (year, edition, sauce_date, toolkit, ingredients, food, crew_size, bushels,
   litres, jars_filled, fallen_soldiers, grappa, notes) values
  (2020, 1, null, null, null, null, 5, null, 78, null, null, null, 'No sheet provided. Litres from the ''Year 1 = 78 L'' note in the 2025 workbook. Fill the rest from your archive.'),
  (2021, 2, '2021-09-06', 294.04, 230.3, 101.2, 5, 7, 60, null, null, 0.0, 'Rebuilt from the Sauce Boss 2021 sheet. Line items total $625.49; sheet''s own total was $625.49.'),
  (2022, 3, null, 257.0, 250.0, 350.94, 5, null, null, null, null, 80.0, 'From the 2022 column of the 2025 workbook.'),
  (2023, 4, null, 294.35, 322.0, 129.42, 5, null, null, null, null, 0.0, 'From the 2023 column of the 2025 workbook. No grappa recorded.'),
  (2024, 5, null, 527.55, 307.0, 209.3, 5, null, null, null, null, 82.25, 'From the 2024 column of the 2025 workbook. Big toolkit year (burners + cauldrons).'),
  (2025, 6, '2025-08-30', 242.34, 250.0, 543.58, 5, 7, null, null, null, 135.0, 'Food total as stated on the 2025 sheet; the $31 fresh-pasta line appears to have been left out of it.');

