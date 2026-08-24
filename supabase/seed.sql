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
--
-- Two categories only. Food and drink live in `menu`, one row per dish, which
-- owns who is bringing it and where it comes from; the buy list and the spend
-- screen read both tables. The `food` category still exists for `expenses`,
-- which is where food money has always been booked.
insert into public.items
  (year, category, subcategory, sort_index, name, kind, qty, budget, assigned_to, store,
   repeat_next, comments, link) values

  -- Toolkit · Setup & Workspace
  (2026, 'toolkit', 'Setup & Workspace', 10, 'Table blanket', 'Owned', '1', 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 'Setup & Workspace', 20, 'Tables', 'Owned', '2', 0, 'Matt (1) / Chris (1)', null, 'Yes', 'Matt''s plastic table plus Chris''s — confirm Chris''s before Friday.', null),
  (2026, 'toolkit', 'Setup & Workspace', 30, 'Chairs', 'Owned', '5', 0, 'David (4) / Matt (2)', null, 'Yes', null, null),
  (2026, 'toolkit', 'Setup & Workspace', 40, 'Pop-up tent', 'Owned', null, 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 'Setup & Workspace', 50, 'Aprons', 'Owned', '5', 0, 'BYO — each brings his own', null, 'Yes', null, null),
  (2026, 'toolkit', 'Setup & Workspace', 60, 'Speakers', 'Owned', '1', 0, 'David', null, 'Yes', null, null),
  -- The barbecue and the TV are Friday-setup kit: they get pulled out and
  -- set up with the tables, and the propane line already counts a tank for
  -- the barbecue.
  (2026, 'toolkit', 'Setup & Workspace', 65, 'Barbecue', 'Owned', '1', 0, 'Matt', null, 'Yes', 'Set up Friday. Propane row already counts its tank.', null),
  (2026, 'toolkit', 'Setup & Workspace', 68, 'TV', 'Owned', '1', 0, 'Matt', null, 'Yes', 'Set up Friday with the work area. Extension cord and a spot out of the splash zone.', null),

  -- Toolkit · Wash & Prep
  -- The sink is a prospect, not a purchase: kind 'Prospect' and no store keep
  -- it off the Buy list and out of the readiness count. How to commit it is on
  -- the run sheet task that does the committing.
  (2026, 'toolkit', 'Wash & Prep', 70, 'Outdoor sink', 'Prospect', '1', 279.99, null, null, 'Maybe', 'Preferred: 1 m stainless sink station — half countertop, half bowl, 304 restaurant steel, $279.99 on Amazon, in stock, 4.8/5. No faucet in the listing — plan on a hose tap. Budget option: PDG folding table with sink & tap, $124.99 at Canadian Tire. Prices read 17 Aug 2026.', 'https://www.amazon.ca/dp/B0H397TB3K'),
  -- One row: they are the same buckets, counted twice because they were bought
  -- in two shops. Owned kit needs no store — a store is what puts a row on the
  -- Buy list, and these two were sitting there as things to go and get.
  (2026, 'toolkit', 'Wash & Prep', 80, 'Buckets', 'Owned', '13', 0, 'David (11) / Matt (2)', null, 'Yes', '6 from Canadian Tire, 7 from Home Depot.', null),
  (2026, 'toolkit', 'Wash & Prep', 100, 'Cutting boards', 'Owned', '5', 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 'Wash & Prep', 110, 'Knives', 'Owned', '5', 0, 'BYOK / Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 'Wash & Prep', 120, 'Measuring pitcher', 'Owned', '1', 0, 'Matt', null, 'Yes', null, null),

  -- Toolkit · Cooking & Heat
  (2026, 'toolkit', 'Cooking & Heat', 130, 'Cauldrons', 'Owned', '3', 0, 'Matt (2) / David (1) / Chris (2)', null, 'Yes', null, null),
  (2026, 'toolkit', 'Cooking & Heat', 140, 'Burners', 'Owned', '3', 0, 'Matt', 'Home Depot', 'Buy', null, 'https://www.homedepot.ca/product/martin-r65-propane-burner/1000751079'),
  (2026, 'toolkit', 'Cooking & Heat', 150, 'Propane', 'Refill', '4', 40.0, 'Matt (3) / Chris (1)', null, 'Yes', 'Recurring every year. 3 sauce burners + 1 BBQ.', null),
  (2026, 'toolkit', 'Cooking & Heat', 160, 'Ladle', 'Owned', '1', 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 'Cooking & Heat', 170, 'Spider ladle', 'Owned', '1', 0, 'Matt / Mike', null, 'Yes', null, null),
  (2026, 'toolkit', 'Cooking & Heat', 180, 'Stainless deep dish pan', 'Owned', null, 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 'Cooking & Heat', 190, 'Metal bowl', 'Owned', '1', 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 'Cooking & Heat', 200, 'Wooden stirring paddle', 'Owned', '1', 0, 'Matt', null, 'Yes', null, null),

  -- Toolkit · Milling & Straining
  (2026, 'toolkit', 'Milling & Straining', 210, 'Food mill', 'Owned', '1', 0, 'Matt', null, 'Yes', '2025 note: consider a new mill', null),
  (2026, 'toolkit', 'Milling & Straining', 220, 'Cheesecloth', 'Need', '4', 0, 'Matt', 'Market', 'No', null, null),
  (2026, 'toolkit', 'Milling & Straining', 230, 'Cloth to strain water', 'Owned', null, 0, 'Matt', 'Amazon', 'Yes', 'David to check Amazon', null),
  (2026, 'toolkit', 'Milling & Straining', 240, 'Strainer for sauce pot', 'Need', '1', 0, null, null, 'Buy', 'Carried over from 2025 notes', null),

  -- Toolkit · Jarring & Canning
  (2026, 'toolkit', 'Jarring & Canning', 250, 'Mason jars', 'Owned', null, 39.98, 'Chris', 'Canadian Tire', 'Yes', 'Chris brings the difference — whatever the Yield & Jars tab still shows to buy.', null),
  (2026, 'toolkit', 'Jarring & Canning', 260, 'Funnel (wide mouth)', 'Owned', '3', 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 'Jarring & Canning', 270, 'Rims', 'Need', null, 0, 'David / Matt', 'Canadian Tire', 'No', 'All new sets of rims', null),
  (2026, 'toolkit', 'Jarring & Canning', 280, 'Lids', 'Need', '2', 14.97, 'David', 'Canadian Tire', 'No', 'See Yield & Jars tab', null),
  (2026, 'toolkit', 'Jarring & Canning', 290, 'Mason jar lifters', 'Owned', '2', 0, 'Matt', null, 'Yes', null, null),

  -- Toolkit · Cleaning & Sanitation
  (2026, 'toolkit', 'Cleaning & Sanitation', 300, 'Garbage bags', 'Owned', null, 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 'Cleaning & Sanitation', 310, 'Metal sponges', 'Owned', null, 0, 'Matt', null, 'Yes', null, null),
  (2026, 'toolkit', 'Cleaning & Sanitation', 320, 'Cleaning brush', 'Owned', null, 0, 'Matt', null, 'Yes', null, null),
  -- Dawn and the sponge pack are bought fresh this year, so they are 'Need',
  -- carry a store and a budget, and land on the Buy list under Grocery.
  (2026, 'toolkit', 'Cleaning & Sanitation', 330, 'Dawn dish soap', 'Need', '1', 6.00, 'David', 'Grocery', 'Buy', 'Fresh bottle for this year.', null),
  (2026, 'toolkit', 'Cleaning & Sanitation', 340, 'Sponges (pack)', 'Need', '1 pack', 5.00, 'David', 'Grocery', 'Buy', 'New this year — kitchen sponges for the wash station.', null),
  (2026, 'toolkit', 'Cleaning & Sanitation', 350, 'Scrub pads', 'Owned', null, 0, 'David', null, 'Yes', null, null),
  (2026, 'toolkit', 'Cleaning & Sanitation', 360, 'Barkeepers Friend', 'Owned', null, 0, 'David', null, 'Yes', null, null),

  -- Toolkit · Serving & Extras
  (2026, 'toolkit', 'Serving & Extras', 370, 'Napkins', 'Owned', null, 0, 'Matt', null, 'Yes', null, null),

  -- Ingredients
  (2026, 'ingredients', null, 1, 'Bushels of tomatoes', 'Need', null, 175.0, 'Matt / David / Nate', 'Market', 'Yes', 'Pickup Fri Aug 28 at the market. Count and budget live on the Yield & Jars tab.', null),
  (2026, 'ingredients', null, 2, 'Basil', 'Need', null, 0, 'Matt / David / Nate', 'Market', 'Yes', 'Matt potentially has', null),
  (2026, 'ingredients', null, 3, 'Parsley', 'Need', null, 0, 'Matt / David / Nate', 'Market', 'Yes', 'Matt potentially has', null),
  (2026, 'ingredients', null, 4, 'Onions', 'Need', '5 kg (~20)', 0, 'Matt / David / Nate', 'Market', 'Yes', 'Soffritto — roughly one per 5 L of sauce.', null),
  (2026, 'ingredients', null, 5, 'Garlic', 'Need', '12 heads', 0, 'Matt / David / Nate', 'Market', 'Yes', 'Soffritto — a head per 8 L of sauce.', null),
  (2026, 'ingredients', null, 6, 'Carrots', 'Need', '2 kg (~15)', 0, 'Matt / David / Nate', 'Market', 'Yes', 'Soffritto — one per 7 L of sauce.', null),
  (2026, 'ingredients', null, 7, 'Celery', 'Need', '2 bunches', 0, 'Matt / David / Nate', 'Market', 'Yes', 'Soffritto — a stalk per 7 L of sauce.', null),
  (2026, 'ingredients', null, 8, 'Salt', 'Owned', null, 0, 'Matt / David / Nate', null, 'Yes', null, null),
  (2026, 'ingredients', null, 9, 'Sugar', 'Owned', null, 0, 'Matt / David / Nate', null, 'Yes', null, null),

  -- Food · the shopping, filed under the dish it is for. A dish with rows
  -- under it steps off the buy list and lets them stand in for it; the dishes
  -- themselves are the Menu's. Quantities are a first pass for five men.


  -- Breakfast
  (2026, 'food', 'Breakfast Sandwiches', 10, 'Eggs', 'Need', '18', 0, null, 'Grocery', 'Yes', null, null),
  (2026, 'food', 'Breakfast Sandwiches', 20, 'Bacon', 'Need', '1 kg', 0, null, 'Butcher', 'Yes', null, null),
  (2026, 'food', 'Breakfast Sandwiches', 30, 'Breakfast sausage', 'Need', '1 kg', 0, null, 'Butcher', 'Yes', null, null),
  (2026, 'food', 'Breakfast Sandwiches', 40, 'Sliced cheese', 'Need', '500 g', 0, null, 'Grocery', 'Yes', 'Provolone or cheddar, whatever the sandwich wants.', null),
  (2026, 'food', 'Breakfast Sandwiches', 50, 'English muffins', 'Need', '12', 0, null, 'Bakery', 'Yes', null, null),
  (2026, 'food', 'Blood orange juice / mimosas', 60, 'Blood orange juice', 'Need', '3 L', 0, null, 'Grocery', 'Yes', 'The prosecco is its own line under Drinks.', null),

  -- Antipasto
  (2026, 'food', 'Parm & Balsamic glaze', 70, 'Parmigiano Reggiano', 'Need', '1 kg wedge', 0, null, 'Italian Market', 'Yes', 'The same wedge grates over the bresaola.', null),
  (2026, 'food', 'Parm & Balsamic glaze', 80, 'Balsamic glaze', 'Need', '1 bottle', 0, null, 'Italian Market', 'Yes', null, null),
  (2026, 'food', 'Parm & Balsamic glaze', 90, 'Good olive oil', 'Need', '500 ml', 0, null, 'Italian Market', 'Yes', 'Also dresses the mushrooms and both salads. The cooking oil is a separate bottle.', null),
  (2026, 'food', 'Grilled artichokes', 100, 'Artichokes', 'Need', '10', 0, null, 'Market', 'Yes', null, null),
  (2026, 'food', 'Grilled artichokes', 110, 'Lemons', 'Need', '6', 0, null, 'Market', 'Yes', 'The bresaola wants one too.', null),
  (2026, 'food', 'Marinated mushrooms', 120, 'Cremini mushrooms', 'Need', '1 kg', 0, 'Chris', 'Market', 'Yes', 'Garlic, parsley and oil come off the sauce table.', null),
  (2026, 'food', 'Bresaola', 130, 'Bresaola', 'Need', '400 g', 0, null, 'Italian Market', 'Yes', 'Sliced thin, and not the day before.', null),
  (2026, 'food', 'Bresaola', 140, 'Arugula', 'Need', '2 bunches', 0, null, 'Market', 'Yes', null, null),

  -- Lunch
  (2026, 'food', 'Steak, Pepperoni & Capicollo Subs', 150, 'Steak, thin sliced', 'Need', '1.5 kg', 0, null, 'Butcher', 'Yes', null, null),
  (2026, 'food', 'Steak, Pepperoni & Capicollo Subs', 160, 'Pepperoni', 'Need', '500 g', 0, null, 'Italian Market', 'Yes', null, null),
  (2026, 'food', 'Steak, Pepperoni & Capicollo Subs', 170, 'Capicollo', 'Need', '500 g', 0, null, 'Italian Market', 'Yes', null, null),
  (2026, 'food', 'Steak, Pepperoni & Capicollo Subs', 180, 'Provolone', 'Need', '500 g', 0, null, 'Italian Market', 'Yes', null, null),
  (2026, 'food', 'Steak, Pepperoni & Capicollo Subs', 190, 'Frying peppers', 'Need', '6', 0, null, 'Market', 'Yes', 'The rolls are their own line under Lunch.', null),
  (2026, 'food', 'Melon and prosciutto', 200, 'Cantaloupe', 'Need', '2', 0, null, 'Market', 'Yes', null, null),
  (2026, 'food', 'Melon and prosciutto', 210, 'Prosciutto', 'Need', '400 g', 0, null, 'Italian Market', 'Yes', 'Two stores, which is why the dish is two lines.', null),
  (2026, 'food', 'Fennel and orange salad', 220, 'Fennel', 'Need', '3 bulbs', 0, null, 'Market', 'Yes', null, null),
  (2026, 'food', 'Fennel and orange salad', 230, 'Oranges', 'Need', '6', 0, null, 'Market', 'Yes', null, null),

  -- Dinner
  (2026, 'food', 'Braciole', 240, 'Beef top round, sliced thin', 'Need', '2 kg', 0, null, 'Butcher', 'Yes', 'Ask for the braciole cut and he will do the slicing.', null),
  (2026, 'food', 'Braciole', 250, 'Breadcrumbs', 'Need', '1 bag', 0, null, 'Italian Market', 'Yes', null, null),
  (2026, 'food', 'Braciole', 260, 'Pecorino', 'Need', '300 g', 0, null, 'Italian Market', 'Yes', null, null),
  (2026, 'food', 'Braciole', 270, 'Butcher''s twine', 'Need', '1 roll', 0, null, 'Butcher', 'Yes', null, null),

  -- Dessert
  (2026, 'food', 'Affogato', 280, 'Vanilla gelato', 'Need', '2 L', 0, null, 'Grocery', 'Yes', 'The espresso is its own line under Breakfast.', null);

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
  (2026, 'Matt', 55, 66, 0),
  (2026, 'David', 9, 0, 0),
  (2026, 'Nate', 0, 0, 0),
  (2026, 'Chris', 0, 0, 0),
  (2026, 'Mike', 0, 0, 0);

-- ---------------------------------------------------------------- run sheet
-- Two levels. `milestone` rows are the headline beats of the day and get their
-- own card on the Sauce Day timeline; the rest are the operational steps that
-- sit underneath the milestone above them. Both live in one table so the Run
-- tab stays a single editable list and there is one source of truth.
--
-- sort_index runs in tens so a step can be slipped between two others without
-- renumbering the whole day.
insert into public.runsheet
  (year, sort_index, section, time_label, activity, lead, crew, equipment,
   icon, duration_min, ingredients, milestone, critical, notes) values
  -- Lead-up. No clock on purpose: `time_label` only parses "Fri…" and "HH:MM",
  -- so these carry no scheduled time and never become the current step. They
  -- are the decisions that have to land before Friday can happen at all.
  (2026,  10, 'PREP', 'This week', 'Order the utility sink/counter', 'Matt', 'David', null,
   null, null, null, false, false, 'Toolkit → Wash & Prep holds both options. Committing = set that row from Prospect to Need and give it a store. Order early enough to ship.'),
  (2026,  20, 'PREP', 'This week', 'Confirm Chris is bringing his table', 'Matt', 'Chris', null,
   null, null, null, false, false, 'The Tables row counts two: Matt''s plastic one and Chris''s.'),
  (2026,  30, 'PREP', 'This week', 'Sort out the grappa', 'David', null, null,
   null, null, null, false, false, 'It has to beat last year. See the Grappa tab.'),

  -- Friday
  (2026,  40, 'PREP', 'Fri 28', 'Pick up bushels from the market', 'Nate', 'David', 'Truck, buckets',
   'bushel', 90, '7 bushels of San Marzano', true, false, 'Get there early, best tomatoes go first'),
  (2026,  50, 'PREP', 'Fri AM', 'Wash every mason jar', 'Matt', 'All', 'Jars, dishwasher, Dawn, sponges',
   'jar', 120, null, true, false, 'Count as you go. Sterilising happens Saturday, close to canning.'),
  (2026,  60, 'PREP', 'Fri AM', 'Wash the tomato mill', 'Matt', null, 'Food mill, cleaning brush, Barkeepers Friend',
   null, 20, null, false, false, 'Strip it down. Last year''s pulp lives in the hopper threads.'),
  (2026,  70, 'PREP', 'Fri PM', 'Pull out the gear, cleaning and checking each piece', 'Matt', 'Chris', 'Burners, tent, plastic table, Dawn, scrub pads',
   null, 45, null, false, false, 'Everything out of the garage in one pass. Cracked, rusted or missing gets found now, not at 07:00.'),
  -- The setup block carries its own milestone, so the sink, the burners and
  -- the barbecue fold under it rather than under the jar washing.
  (2026,  90, 'PREP', 'Fri PM', 'Set up the work area — tables, tent and chairs', 'Matt', 'Chris', 'Tables, tent, chairs',
   null, 45, null, true, false, 'The whole work area goes up in this block: tables first, then the sink, the burners and the barbecue.'),
  (2026, 100, 'PREP', 'Fri PM', 'Set up the utility sink/counter', 'Matt', 'David', 'Sink, hose',
   null, 30, null, false, false, 'Hose tap, and somewhere for the water to drain.'),
  (2026, 110, 'PREP', 'Fri PM', 'Set up the burners', 'Matt', 'Mike', '3 burners, propane',
   null, 20, null, false, false, 'Placed and hooked up Friday. Lighting them is a Saturday job.'),
  (2026, 120, 'PREP', 'Fri PM', 'Set up the barbecue and the TV', 'Matt', null, 'BBQ, propane, TV, extension cord',
   null, 30, null, false, false, 'TV out of the splash zone.'),
  (2026, 140, 'PREP', 'Fri PM', 'Fill and check propane tanks', 'Matt', 'Mike', '4 tanks',
   null, 30, null, false, false, 'Refill beats buying new'),
  (2026, 150, 'PREP', 'Fri PM', 'Prep all food', 'Matt', 'All', 'Boards, knives, containers',
   'fork', 120, 'See the Menu tab', true, false, 'Everything that can be made the night before gets made the night before.'),
  (2026, 160, 'PREP', 'Fri PM', 'Chill all beer, wine, prosecco, water', 'David', null, 'Coolers, ice',
   null, 20, null, false, false, null),
  (2026, 170, 'PREP', 'Fri PM', 'Grind the espresso', 'David', null, 'Grinder',
   null, 10, 'Beans from the roastery', false, false, '2025 lesson: do this the night before'),
  (2026, 180, 'PREP', 'Fri PM', 'Stage jars, mill, tools and supplies for the morning', 'Matt', 'All', 'Jars, mill, tools',
   null, 30, null, true, false, 'Everything where it will be used, so 06:30 starts with coffee and not a search party.'),

  -- The day
  (2026, 190, 'DAY', '06:30', 'Start sauce prep', 'Matt', 'All', 'Espresso, moka',
   'tomato', 60, 'Espresso', true, false, 'Crew arrives. Coffee before anything else.'),
  (2026, 200, 'DAY', '06:45', 'Final equipment and setup check', 'Matt', 'All', 'Friday''s setup',
   null, 15, null, false, false, 'Walk the work area: burners hooked up, sink draining, mill clamped, jars staged.'),
  (2026, 210, 'DAY', '07:00', 'Breakfast sandwiches', null, 'All', 'Breakfast setup',
   null, 30, 'Egg, bacon, sausage, cheese', false, false, 'Breakfast before the main production push'),
  (2026, 220, 'DAY', '07:30', 'Fire up the burners', 'Matt', 'Mike', '3 burners, cauldrons, propane',
   'flame', 30, 'Propane', true, false, 'Wash water on at the same time'),
  (2026, 230, 'DAY', '08:00', 'Wash tomatoes', 'All', 'All', 'Buckets, strainer',
   null, 60, '7 bushels', false, false, 'Two-stage rinse'),
  (2026, 240, 'DAY', '09:00', 'First batch cooking', 'Nate', 'David', 'Cauldrons, spider ladle',
   'cauldron', 90, 'Washed tomatoes', true, false, 'Blanch and cook'),
  (2026, 250, 'DAY', '10:30', 'Coffee break', 'David', 'All', 'Moka, cornetti',
   'coffee', 20, 'Espresso, cornetti', true, false, 'Get the day off the tomatoes for ten minutes'),
  (2026, 260, 'DAY', '10:45', 'First mill run', 'Chris', 'Matt', 'Food mill, deep dish pan',
   null, 45, null, false, false, 'Watch for skins clogging'),
  (2026, 270, 'DAY', '12:00', 'Lunch break', 'Nate', 'All', 'Tables, boards',
   'fork', 60, 'Steak, pepperoni & capicollo subs', true, false, 'See the Menu tab'),
  (2026, 280, 'DAY', '13:00', 'Milling continues, bottling line starts', 'All', 'All', 'Funnel, ladle, mill',
   null, 120, null, false, false, null),
  (2026, 290, 'DAY', '14:00', 'Sterilise the jars and lids', 'Matt', null, 'Jar lifters, cauldron',
   null, 60, null, false, true, 'Close to canning on purpose: jars go from hot water straight into filling. One that has gone cold gets done again.'),
  (2026, 300, 'DAY', '15:00', 'Jarring begins', 'All', 'All', 'Funnel, rims, lids, bands',
   'jar', 90, 'Milled sauce, basil', true, true, 'Wipe every rim before capping. This is the one that matters.'),
  (2026, 310, 'DAY', '16:30', 'Wine break', 'David', 'All', 'Glasses',
   'glass', 30, 'Prosecco, the whites', true, false, 'Water bath goes on at the same time'),
  (2026, 320, 'DAY', '16:30', 'Water bath — seal the jars', 'Matt', 'David', 'Cauldron, jar lifters',
   null, 60, null, false, true, 'Listen for the pops'),
  (2026, 330, 'DAY', '18:00', 'Annual grappa toast', 'David', 'All', 'The bottle',
   'bottle', 30, 'This year''s grappa', true, true, 'It has to beat last year. See the Grappa tab.'),
  (2026, 340, 'DAY', '19:00', 'Dinner — rigatoni with this year''s sauce', 'Mike', 'All', 'Pots, rigatoni',
   'plate', 90, 'Rigatoni, this year''s sauce', true, false, 'The whole point'),
  (2026, 350, 'DAY', '20:30', 'Pizza run', 'Chris', null, 'Cash, the truck',
   'pizza', 45, null, true, false, 'Second wind. Nobody has ever regretted this.'),
  (2026, 360, 'DAY', '21:00', 'Cooling and cleanup', 'All', 'All', 'Dawn, scrub pads, metal sponges',
   'cool', 60, null, true, false, 'Jars stay put until they are cold. Do not move them early.'),
  (2026, 370, 'DAY', '22:00', 'Group photo', 'Matt', 'All', 'A phone and a timer',
   'camera', 15, null, true, false, 'Goes straight into the Photobook'),
  (2026, 380, 'DAY', '22:15', 'Count jars, log fallen soldiers, divide the sauce', 'Matt', 'All', 'Notebook',
   null, 15, null, false, false, 'Enter the count on the History tab'),
  (2026, 390, 'DAY', '22:30', 'Sauce Day complete', 'Matt', 'All', 'This workbook',
   'check', null, null, true, true, 'Settle up, then bed. Settlement says who pays whom.');

-- ---------------------------------------------------------------- menu
-- The food and drink list, and the only one: the ledger carries no food rows.
-- sort_index runs in tens so a dish slips in without renumbering the service.
insert into public.menu (year, sort_index, service, dish, who, source, qty, notes) values
  -- Breakfast
  (2026, 10, 'Breakfast', 'Breakfast Sandwiches', null, 'Market', null, 'Egg, bacon, sausage, cheese'),
  (2026, 20, 'Breakfast', 'Espresso', 'David', 'Roastery', null, 'Grind fresh before Sauce Day'),
  (2026, 30, 'Breakfast', 'Cornetti', 'Nate', 'Bakery', null, 'Morning pastries with espresso'),
  (2026, 40, 'Breakfast', 'Blood orange juice / mimosas', null, 'Grocery', null, null),

  -- Antipasto
  (2026, 50, 'Antipasto', 'Parm & Balsamic glaze', null, 'Market', null, 'Serve with olive oil and grilled bread'),
  (2026, 55, 'Antipasto', 'Bread for grilling', 'Nate', 'Bakery', '2 loaves', 'Crusty loaf for the parm & balsamic.'),
  (2026, 60, 'Antipasto', 'Grilled artichokes', null, 'Market', null, null),
  (2026, 70, 'Antipasto', 'Giardiniera', 'Chris', 'Italian Market', null, 'Pickled vegetables for the antipasto.'),
  (2026, 80, 'Antipasto', 'Marinated mushrooms', 'Chris', 'Market', null, 'Garlic, parsley and olive oil'),
  (2026, 90, 'Antipasto', 'Soppressata', null, 'Italian Market', null, null),
  (2026, 100, 'Antipasto', 'Bresaola', null, 'Italian Market', null, 'Serve with arugula, lemon and Parmigiano'),
  (2026, 110, 'Antipasto', 'Taralli', null, 'Italian Market', null, 'Crunchy snack for the table'),

  -- Lunch
  (2026, 120, 'Lunch', 'Steak, Pepperoni & Capicollo Subs', null, 'Butcher', null, null),
  (2026, 130, 'Lunch', 'Italian rolls', 'Nate', 'Bakery', null, 'For the subs'),
  (2026, 140, 'Lunch', 'Melon and prosciutto', null, 'Market', null, 'Cold afternoon snack'),
  (2026, 150, 'Lunch', 'Fennel and orange salad', null, 'Market', null, 'Fennel, orange, parsley and olive oil'),

  -- Dinner
  (2026, 160, 'Dinner', 'Rigatoni with this year''s sauce', null, 'Italian Market', null, 'Dinner pasta with the fresh sauce'),
  (2026, 170, 'Dinner', 'Braciole', null, 'Butcher', null, 'Beef rolls braised in the new sauce'),

  -- Dessert
  (2026, 180, 'Dessert', 'Cannoli', null, 'Little Italy', null, null),
  (2026, 190, 'Dessert', 'Affogato', null, 'Grocery', null, 'Vanilla gelato and espresso'),

  -- Drinks
  (2026, 200, 'Drinks', 'Grappa - the annual bottle', 'David', 'SAQ', '1', 'Must beat last year'),
  (2026, 210, 'Drinks', 'Prosecco', 'David', 'SAQ', null, 'Morning mimosas and aperitivo'),
  (2026, 220, 'Drinks', 'Aperol', 'David', 'SAQ', null, 'For spritzes'),
  (2026, 230, 'Drinks', 'Italian red wine', 'David', 'SAQ', '3', 'Chianti, Montepulciano or similar'),
  (2026, 240, 'Drinks', 'Italian lager', null, 'Depanneur', null, 'Peroni, Moretti or similar'),
  (2026, 250, 'Drinks', 'San Pellegrino', null, 'Costco', '12', 'Sparkling water for the day'),
  (2026, 255, 'Drinks', 'Ice', 'David', 'Depanneur', '4 bags', 'Friday chill-down needs it and every party forgets it.');

-- ---------------------------------------------------------------- grappa
insert into public.grappa (year, bottle, producer, region, price, bought_by, rating, notes) values
  (2020, null, null, null, null, null, null, 'No record'),
  (2021, null, null, null, 0.0, null, null, 'No grappa line recorded on the 2021 sheet'),
  (2022, null, null, null, 80.0, 'David', null, 'Bottle not named on the sheet'),
  (2023, null, null, null, 0.0, null, null, 'No grappa recorded'),
  (2024, null, null, null, 82.25, 'David', null, 'Bottle not named on the sheet'),
  (2025, null, null, null, 135.0, 'David', null, 'SAQ product 11849106 - https://www.saq.com/en/11849106'),
  (2026, null, null, null, null, 'David', null, 'Not bought yet.');

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
