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
  ('admin@change-me.invalid', 'Matt', true, 1),
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
-- Toolkit rows use `subcategory` so the UI can group the equipment into clear
-- sections without overloading `kind`, which remains the Owned / Need / Refill state.
insert into public.items
  (year, category, subcategory, sort_index, name, kind, qty, budget, assigned_to, store,
   repeat_next, comments, link) values

  -- Toolkit · Setup & Workspace
  (2026, 'toolkit', 'Setup & Workspace', 1, 'Table blanket', 'Owned', '1', 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 'Setup & Workspace', 2, 'Tables', 'Owned', '2', 0, 'Matt (1) / Chris (1)', null, 'Yes', null, null),
  (2026, 'toolkit', 'Setup & Workspace', 3, 'Chairs', 'Owned', '5', 0, 'David (4) / Matt (2)', null, 'Yes', null, null),
  (2026, 'toolkit', 'Setup & Workspace', 4, 'Pop-up tent', 'Owned', null, 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 'Setup & Workspace', 5, 'Aprons', 'Owned', null, 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 'Setup & Workspace', 6, 'Speakers', 'Owned', '1', 0, 'David', null, 'Yes', null, null),

  -- Toolkit · Wash & Prep
  (2026, 'toolkit', 'Wash & Prep', 8, 'Buckets (Canadian Tire)', 'Owned', '6', 0, 'David', 'Canadian Tire', 'Buy', null, null),
  (2026, 'toolkit', 'Wash & Prep', 9, 'Buckets (Home Depot)', 'Owned', '7', 0, 'David / Matt', 'Home Depot', 'Yes', null, null),
  (2026, 'toolkit', 'Wash & Prep', 10, 'Cutting boards', 'Owned', '5', 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 'Wash & Prep', 11, 'Knives', 'Owned', '5', 0, 'BYOK / Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 'Wash & Prep', 12, 'Measuring pitcher', 'Owned', '1', 0, 'Matt', null, 'Yes', null, null),

  -- Toolkit · Cooking & Heat
  (2026, 'toolkit', 'Cooking & Heat', 13, 'Cauldrons', 'Owned', '3', 0, 'Matt (2) / David (1) / Chris (2)', null, 'Yes', null, null),
  (2026, 'toolkit', 'Cooking & Heat', 14, 'Burners', 'Owned', '3', 0, 'David (2) / Matt (1)', 'Home Depot', 'Buy', null, 'https://www.homedepot.ca/product/martin-r65-propane-burner/1000751079'),
  (2026, 'toolkit', 'Cooking & Heat', 15, 'Propane', 'Refill', '4', 40.0, 'Matt (3) / Chris (1)', null, 'Yes', 'Recurring every year. 3 sauce burners + 1 BBQ.', null),
  (2026, 'toolkit', 'Cooking & Heat', 16, 'Ladle', 'Owned', '1', 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 'Cooking & Heat', 17, 'Spider ladle', 'Owned', '1', 0, 'Matt / Mike', null, 'Yes', null, null),
  (2026, 'toolkit', 'Cooking & Heat', 18, 'Stainless deep dish pan', 'Owned', null, 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 'Cooking & Heat', 19, 'Metal bowl', 'Owned', '1', 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 'Cooking & Heat', 20, 'Wooden stirring paddle', 'Owned', '1', 0, 'Matt', null, 'Yes', null, null),

  -- Toolkit · Milling & Straining
  (2026, 'toolkit', 'Milling & Straining', 21, 'Food mill', 'Owned', '1', 0, 'Matt', null, 'Yes', '2025 note: consider a new mill', null),
  (2026, 'toolkit', 'Milling & Straining', 22, 'Cheesecloth', 'Need', '4', 0, 'Matt', 'Market', 'No', null, null),
  (2026, 'toolkit', 'Milling & Straining', 23, 'Cloth to strain water', 'Owned', null, 0, 'Matt', 'Amazon', 'Yes', 'David to check Amazon', null),
  (2026, 'toolkit', 'Milling & Straining', 24, 'Strainer for sauce pot', 'Need', '1', 0, null, null, 'Buy', 'Carried over from 2025 notes', null),

  -- Toolkit · Jarring & Canning
  (2026, 'toolkit', 'Jarring & Canning', 25, 'Mason jars', 'Owned', null, 39.98, 'David / Matt', 'Canadian Tire', 'Yes', 'See Yield & Jars tab for this year''s count', null),
  (2026, 'toolkit', 'Jarring & Canning', 26, 'Funnel (wide mouth)', 'Owned', '3', 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 'Jarring & Canning', 27, 'Rims', 'Need', null, 0, 'David / Matt', 'Canadian Tire', 'No', 'All new sets of rims', null),
  (2026, 'toolkit', 'Jarring & Canning', 28, 'Lids', 'Need', '2', 14.97, 'David', 'Canadian Tire', 'No', 'See Yield & Jars tab', null),
  (2026, 'toolkit', 'Jarring & Canning', 29, 'Mason jar lifters', 'Owned', '2', 0, 'Matt', null, 'Yes', null, null),

  -- Toolkit · Cleaning & Sanitation
  (2026, 'toolkit', 'Cleaning & Sanitation', 30, 'Garbage bags', 'Owned', null, 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 'Cleaning & Sanitation', 31, 'Metal sponges', 'Owned', null, 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 'Cleaning & Sanitation', 32, 'Cleaning brush', 'Owned', null, 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 'Cleaning & Sanitation', 33, 'Dawn dish soap', 'Owned', null, 0, 'David', null, 'Yes', null, null),
  (2026, 'toolkit', 'Cleaning & Sanitation', 34, 'Scrub pads', 'Owned', null, 0, 'David', null, 'Yes', null, null),
  (2026, 'toolkit', 'Cleaning & Sanitation', 35, 'Barkeepers Friend', 'Owned', null, 0, 'David', null, 'Yes', null, null),

  -- Toolkit · Serving & Extras
  (2026, 'toolkit', 'Serving & Extras', 36, 'Napkins', 'Owned', null, 0, 'Matt', null, 'Yes', null, null),

  -- Ingredients
  (2026, 'ingredients', null, 1, 'Bushels of tomatoes', 'Need', '10', 175.0, 'Matt / David / Nate', 'Market', 'Yes', 'Recurring. Budget links to Yield & Jars tab', null),
  (2026, 'ingredients', null, 2, 'Basil', 'Need', null, 0, 'Matt / David / Nate', 'Market', 'Yes', 'Matt potentially has', null),
  (2026, 'ingredients', null, 3, 'Parsley', 'Need', null, 0, 'Matt / David / Nate', 'Market', 'Yes', 'Matt potentially has', null),
  (2026, 'ingredients', null, 4, 'Onions', 'Costco', null, 0, 'Matt / David / Nate', 'Costco', 'Yes', null, null),
  (2026, 'ingredients', null, 5, 'Garlic', 'Costco', null, 0, 'Matt / David / Nate', 'Costco', 'Yes', null, null),
  (2026, 'ingredients', null, 6, 'Carrots', 'Costco', null, 0, 'Matt / David / Nate', 'Costco', 'Yes', null, null),
  (2026, 'ingredients', null, 7, 'Celery', 'Costco', null, 0, 'Matt / David / Nate', 'Costco', 'Yes', null, null),
  (2026, 'ingredients', null, 8, 'Salt', 'Have', null, 0, 'Matt / David / Nate', null, 'Yes', null, null),
  (2026, 'ingredients', null, 9, 'Sugar', 'Have', null, 0, 'Matt / David / Nate', null, 'Yes', null, null),

  -- Food
  (2026, 'food', null, 1, 'Breakfast Sandwiches', 'Egg, bacon, sausage, cheese', null, 0, null, 'Market', 'Yes', null, null),
  (2026, 'food', null, 2, 'Espresso', 'Grind fresh before Sauce Day', null, 0, 'David', 'Roastery', 'Yes', null, null),
  (2026, 'food', null, 3, 'Cornetti', 'Morning pastries with espresso', null, 0, 'Nate', 'Bakery', 'Yes', null, null),
  (2026, 'food', null, 4, 'Blood orange juice', 'For morning mimosas', null, 0, null, 'Grocery', 'Yes', null, null),
  (2026, 'food', null, 5, 'Parm & Balsamic glaze', 'Serve with olive oil and grilled bread', null, 0, null, 'Market', 'Yes', null, null),
  (2026, 'food', null, 6, 'Grilled artichokes', 'For the antipasto table', null, 0, null, 'Market', 'Yes', null, null),
  (2026, 'food', null, 7, 'Giardiniera', 'Pickled vegetables for antipasto', null, 0, 'Chris', 'Italian Market', 'Yes', null, null),
  (2026, 'food', null, 8, 'Marinated mushrooms', 'Garlic, parsley and olive oil', null, 0, 'Chris', 'Market', 'Yes', null, null),
  (2026, 'food', null, 9, 'Soppressata', 'For the antipasto board', null, 0, null, 'Italian Market', 'Yes', null, null),
  (2026, 'food', null, 10, 'Bresaola', 'Serve with arugula, lemon and Parmigiano', null, 0, null, 'Italian Market', 'Yes', null, null),
  (2026, 'food', null, 11, 'Taralli', 'Crunchy snack for the table', null, 0, null, 'Italian Market', 'Yes', null, null),
  (2026, 'food', null, 12, 'Steak, Pepperoni & Capicollo Subs', 'Steak, pepperoni and capicollo subs', null, 0, null, 'Butcher', 'Yes', null, null),
  (2026, 'food', null, 13, 'Italian rolls', 'For subs', null, 0, 'Nate', 'Bakery', 'Yes', null, null),
  (2026, 'food', null, 14, 'Melon and prosciutto', 'Cold afternoon snack', null, 0, null, 'Market', 'Yes', null, null),
  (2026, 'food', null, 15, 'Fennel and orange salad', 'Fennel, orange, parsley and olive oil', null, 0, null, 'Market', 'Yes', null, null),
  (2026, 'food', null, 16, 'Rigatoni', 'Dinner pasta for the fresh sauce', null, 0, null, 'Italian Market', 'Yes', null, null),
  (2026, 'food', null, 17, 'Braciole', 'Beef rolls braised in the new sauce', null, 0, null, 'Butcher', 'Yes', null, null),
  (2026, 'food', null, 18, 'Cannoli', 'Dessert', null, 0, null, 'Little Italy', 'Yes', null, null),
  (2026, 'food', null, 19, 'Affogato', 'Vanilla gelato and espresso', null, 0, null, 'Grocery', 'Yes', null, null),
  (2026, 'food', null, 20, 'Grappa', 'The annual bottle - beat last year', '1', 0, 'David', 'SAQ', 'Yes', 'See Grappa Hall of Fame tab', 'https://www.saq.com/en/11849106'),
  (2026, 'food', null, 21, 'Prosecco', 'Morning mimosas and aperitivo', null, 0, 'David', 'SAQ', 'Yes', null, null),
  (2026, 'food', null, 22, 'Aperol', 'For spritzes', null, 0, 'David', 'SAQ', 'Yes', null, null),
  (2026, 'food', null, 23, 'Italian red wine', 'Chianti, Montepulciano or similar', '3', 0, 'David', 'SAQ', 'Yes', null, null),
  (2026, 'food', null, 24, 'Italian lager', 'Peroni, Moretti or similar', null, 0, null, 'Depanneur', 'Yes', null, null),
  (2026, 'food', null, 25, 'San Pellegrino', 'Sparkling water for the day', null, 0, null, 'Costco', 'Yes', null, null);

-- Lock in anything the crew already owns. `locked` is separate from `kind` so
-- the UI can offer an explicit Unlock/Edit action later without changing status.
update public.items
set locked = true
where year = 2026
  and category = 'toolkit'
  and kind = 'Owned';

-- ---------------------------------------------------------------- bushels
-- One row, not a roster: the crew goes and buys the lot together, so the only
-- number that matters is the total. calc.js sums every row in this table, so
-- adding rows back later still works if that ever changes.
insert into public.bushels (year, person, count) values
  (2026, 'Crew', 7);

-- ---------------------------------------------------------------- jars on hand
insert into public.jar_inventory (year, person, jars, bands, lids) values
  (2026, 'Matt', 25, 66, 0),
  (2026, 'David', 0,0, 0),
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
  (2026,  3, 'PREP', 'Fri PM', 'Set up tables, tent and chairs', 'Matt', 'Chris', 'Tables, tent, chairs',
   null, 45, null, false, false, null),
  (2026,  4, 'PREP', 'Fri PM', 'Fill and check propane tanks', 'Matt', 'Mike', '4 tanks',
   null, 30, null, false, false, 'Refill beats buying new'),
  (2026,  5, 'PREP', 'Fri PM', 'Chill all beer, wine, prosecco, water', 'David', null, 'Coolers, ice',
   null, 20, null, false, false, null),
  (2026,  6, 'PREP', 'Fri PM', 'Grind the espresso', 'David', null, 'Grinder',
   null, 10, 'Beans from the roastery', false, false, '2025 lesson: do this the night before'),

  -- The day
  (2026,  7, 'DAY', '06:30', 'Start sauce prep', 'Matt', 'All', 'Espresso, moka',
   'tomato', 60, 'Espresso', true, false, 'Crew arrives. Coffee before anything else.'),
  (2026,  8, 'DAY', '07:00', 'Breakfast sandwiches', null, 'All', 'Breakfast setup',
   null, 30, 'Egg, bacon, sausage, cheese', false, false, 'Breakfast before the main production push'),
  (2026,  9, 'DAY', '07:30', 'Fire up the burners', 'Matt', 'Mike', '3 burners, cauldrons, propane',
   'flame', 30, 'Propane', true, false, 'Wash water on at the same time'),
  (2026, 10, 'DAY', '08:00', 'Wash tomatoes', 'All', 'All', 'Buckets, strainer',
   null, 60, '7 bushels', false, false, 'Two-stage rinse'),
  (2026, 11, 'DAY', '09:00', 'First batch cooking', 'Nate', 'David', 'Cauldrons, spider ladle',
   'cauldron', 90, 'Washed tomatoes', true, false, 'Blanch and cook'),
  (2026, 12, 'DAY', '10:30', 'Coffee break', 'David', 'All', 'Moka, cornetti',
   'coffee', 20, 'Espresso, cornetti', true, false, 'Get the day off the tomatoes for ten minutes'),
  (2026, 13, 'DAY', '10:45', 'First mill run', 'Chris', 'Matt', 'Food mill, deep dish pan',
   null, 45, null, false, false, 'Watch for skins clogging'),
  (2026, 14, 'DAY', '11:30', 'Jars into hot water, lids ready', 'Matt', null, 'Jar lifters, cauldron',
   null, 30, null, false, false, null),
  (2026, 15, 'DAY', '12:00', 'Lunch break', 'Nate', 'All', 'Tables, boards',
   'fork', 60, 'Steak, pepperoni & capicollo subs', true, false, 'See the Menu tab'),
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
  (2026, 21, 'DAY', '19:00', 'Dinner — rigatoni with this year''s sauce', 'Mike', 'All', 'Pots, rigatoni',
   'plate', 90, 'Rigatoni, this year''s sauce', true, false, 'The whole point'),
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
  -- Breakfast
  (2026, 1, 'Breakfast', 'Breakfast Sandwiches', null, 'Market', '-', 'Egg, bacon, sausage, cheese'),
  (2026, 2, 'Breakfast', 'Espresso', 'David', 'Roastery', '-', 'Grind fresh before Sauce Day'),
  (2026, 3, 'Breakfast', 'Cornetti', 'Nate', 'Bakery', '-', 'Morning pastries with espresso'),
  (2026, 4, 'Breakfast', 'Blood orange juice / mimosas', null, 'Grocery', '-', null),

  -- Antipasto
  (2026, 5, 'Antipasto', 'Parm & Balsamic glaze', null, 'Market', '-', 'Serve with olive oil and grilled bread'),
  (2026, 6, 'Antipasto', 'Grilled artichokes', null, 'Market', '-', null),
  (2026, 7, 'Antipasto', 'Giardiniera', 'Chris', 'Italian Market', '-', null),
  (2026, 8, 'Antipasto', 'Marinated mushrooms', 'Chris', 'Market', '-', 'Garlic, parsley and olive oil'),
  (2026, 9, 'Antipasto', 'Soppressata', null, 'Italian Market', '-', null),
  (2026, 10, 'Antipasto', 'Bresaola', null, 'Italian Market', '-', 'Serve with arugula, lemon and Parmigiano'),
  (2026, 11, 'Antipasto', 'Taralli', null, 'Italian Market', '-', 'Crunchy snack for the table'),

  -- Lunch
  (2026, 12, 'Lunch', 'Steak, Pepperoni & Capicollo Subs', null, 'Butcher', '-', null),
  (2026, 13, 'Lunch', 'Italian rolls', 'Nate', 'Bakery', '-', 'For the subs'),
  (2026, 14, 'Lunch', 'Melon and prosciutto', null, 'Market', '-', 'Cold afternoon snack'),
  (2026, 15, 'Lunch', 'Fennel and orange salad', null, 'Market', '-', 'Fennel, orange, parsley and olive oil'),

  -- Dinner
  (2026, 16, 'Dinner', 'Rigatoni with this year''s sauce', null, 'Italian Market', '-', 'Dinner pasta with the fresh sauce'),
  (2026, 17, 'Dinner', 'Braciole', null, 'Butcher', '-', 'Beef rolls braised in the new sauce'),

  -- Dessert
  (2026, 18, 'Dessert', 'Cannoli', null, 'Little Italy', '-', null),
  (2026, 19, 'Dessert', 'Affogato', null, 'Grocery', '-', 'Vanilla gelato and espresso'),

  -- Drinks
  (2026, 20, 'Drinks', 'Grappa - the annual bottle', 'David', 'SAQ', '1', 'Must beat last year'),
  (2026, 21, 'Drinks', 'Prosecco', 'David', 'SAQ', '-', 'Morning mimosas and aperitivo'),
  (2026, 22, 'Drinks', 'Aperol', 'David', 'SAQ', '-', 'For spritzes'),
  (2026, 23, 'Drinks', 'Italian red wine', 'David', 'SAQ', '3', 'Chianti, Montepulciano or similar'),
  (2026, 24, 'Drinks', 'Italian lager', null, 'Depanneur', '-', 'Peroni, Moretti or similar'),
  (2026, 25, 'Drinks', 'San Pellegrino', null, 'Costco', '-', 'Sparkling water for the day');

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
