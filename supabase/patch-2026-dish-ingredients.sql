-- ============================================================================
--  SAUCE DAY · 2026 patch: the buy list learns what a dish is made of.
--
--  A dish is not a purchase. "Braciole" is nothing you can hand to a butcher —
--  two kilos of top round, sliced thin, is. So the ledger's food category,
--  which held a second copy of the dish names until it was emptied, now holds
--  the shopping: one row per thing that goes in the cart, with `subcategory`
--  naming the dish it is for. Same shape the toolkit already uses for
--  "Cooking & Heat", so the Ledger groups them under their dish for free.
--
--  The buy list follows one rule: a dish appears only while nothing is listed
--  under it. Bought whole — cannoli, taralli, the prosecco — it stays a single
--  line and behaves as it does today. Broken into ingredients, it steps aside
--  for them, so nothing is ever on the list twice and every line is something
--  you can actually put in a cart.
--
--  Quantities are a first pass for five men eating all day. They are meant to
--  be corrected in the app, not treated as gospel — every one of them is one
--  tap away on the Buy screen.
--
--  Run in the Supabase SQL editor, after the deploy that carries the rule.
--  Safe to re-run.
-- ============================================================================

-- Re-runnable: clear this patch's own rows before adding them back. Scoped to
-- rows that name a dish, so anything added by hand from the Ledger survives.
delete from public.items
where year = 2026 and category = 'food' and subcategory is not null;

insert into public.items
  (year, category, subcategory, sort_index, name, kind, qty, budget, assigned_to, store, comments) values

  -- Breakfast
  (2026, 'food', 'Breakfast Sandwiches', 10, 'Eggs', 'Need', '18', 0, null, 'Grocery', null),
  (2026, 'food', 'Breakfast Sandwiches', 20, 'Bacon', 'Need', '1 kg', 0, null, 'Butcher', null),
  (2026, 'food', 'Breakfast Sandwiches', 30, 'Breakfast sausage', 'Need', '1 kg', 0, null, 'Butcher', null),
  (2026, 'food', 'Breakfast Sandwiches', 40, 'Sliced cheese', 'Need', '500 g', 0, null, 'Grocery', 'Provolone or cheddar, whatever the sandwich wants.'),
  (2026, 'food', 'Breakfast Sandwiches', 50, 'English muffins', 'Need', '12', 0, null, 'Bakery', null),
  (2026, 'food', 'Blood orange juice / mimosas', 60, 'Blood orange juice', 'Need', '3 L', 0, null, 'Grocery', 'The prosecco is its own line under Drinks.'),

  -- Antipasto
  (2026, 'food', 'Parm & Balsamic glaze', 70, 'Parmigiano Reggiano', 'Need', '1 kg wedge', 0, null, 'Italian Market', 'The same wedge grates over the bresaola.'),
  (2026, 'food', 'Parm & Balsamic glaze', 80, 'Balsamic glaze', 'Need', '1 bottle', 0, null, 'Italian Market', null),
  (2026, 'food', 'Parm & Balsamic glaze', 90, 'Good olive oil', 'Need', '500 ml', 0, null, 'Italian Market', 'Also dresses the mushrooms and both salads. The cooking oil is a separate bottle.'),
  (2026, 'food', 'Grilled artichokes', 100, 'Artichokes', 'Need', '10', 0, null, 'Market', null),
  (2026, 'food', 'Grilled artichokes', 110, 'Lemons', 'Need', '6', 0, null, 'Market', 'The bresaola wants one too.'),
  (2026, 'food', 'Marinated mushrooms', 120, 'Cremini mushrooms', 'Need', '1 kg', 0, 'Chris', 'Market', 'Garlic, parsley and oil come off the sauce table.'),
  (2026, 'food', 'Bresaola', 130, 'Bresaola', 'Need', '400 g', 0, null, 'Italian Market', 'Sliced thin, and not the day before.'),
  (2026, 'food', 'Bresaola', 140, 'Arugula', 'Need', '2 bunches', 0, null, 'Market', null),

  -- Lunch
  (2026, 'food', 'Steak, Pepperoni & Capicollo Subs', 150, 'Steak, thin sliced', 'Need', '1.5 kg', 0, null, 'Butcher', null),
  (2026, 'food', 'Steak, Pepperoni & Capicollo Subs', 160, 'Pepperoni', 'Need', '500 g', 0, null, 'Italian Market', null),
  (2026, 'food', 'Steak, Pepperoni & Capicollo Subs', 170, 'Capicollo', 'Need', '500 g', 0, null, 'Italian Market', null),
  (2026, 'food', 'Steak, Pepperoni & Capicollo Subs', 180, 'Provolone', 'Need', '500 g', 0, null, 'Italian Market', null),
  (2026, 'food', 'Steak, Pepperoni & Capicollo Subs', 190, 'Frying peppers', 'Need', '6', 0, null, 'Market', 'The rolls are their own line under Lunch.'),
  (2026, 'food', 'Melon and prosciutto', 200, 'Cantaloupe', 'Need', '2', 0, null, 'Market', null),
  (2026, 'food', 'Melon and prosciutto', 210, 'Prosciutto', 'Need', '400 g', 0, null, 'Italian Market', 'Two stores, which is why the dish is two lines.'),
  (2026, 'food', 'Fennel and orange salad', 220, 'Fennel', 'Need', '3 bulbs', 0, null, 'Market', null),
  (2026, 'food', 'Fennel and orange salad', 230, 'Oranges', 'Need', '6', 0, null, 'Market', null),

  -- Dinner
  (2026, 'food', 'Braciole', 240, 'Beef top round, sliced thin', 'Need', '2 kg', 0, null, 'Butcher', 'Ask for the braciole cut and he will do the slicing.'),
  (2026, 'food', 'Braciole', 250, 'Breadcrumbs', 'Need', '1 bag', 0, null, 'Italian Market', null),
  (2026, 'food', 'Braciole', 260, 'Pecorino', 'Need', '300 g', 0, null, 'Italian Market', null),
  (2026, 'food', 'Braciole', 270, 'Butcher''s twine', 'Need', '1 roll', 0, null, 'Butcher', null),

  -- Dessert
  (2026, 'food', 'Affogato', 280, 'Vanilla gelato', 'Need', '2 L', 0, null, 'Grocery', 'The espresso is its own line under Breakfast.');
