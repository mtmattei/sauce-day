-- ============================================================================
--  SAUCE DAY · 2026 patch: the menu's composite dishes become purchases.
--
--  Every dish on the Menu had a line on the Buy list, but five of them are a
--  dish rather than a thing you can put in a basket, so the components went
--  unbought: the breakfast sandwiches (eggs, bacon, sausage, cheese, muffins),
--  the olive oil four antipasto dishes call for, the arugula and lemon under
--  the bresaola, and the gelato that is the buyable half of an affogato.
--
--  Run this in the Supabase SQL editor INSTEAD of re-running seed.sql —
--  seed.sql wipes the year's expenses and obtained ticks; this touches only
--  the rows it names. Safe to re-run.
-- ============================================================================

-- ---- 1 · the breakfast sandwiches become the five things you buy
-- The dish line goes; the Menu tab still carries the dish.
delete from public.items where year = 2026 and name = 'Breakfast Sandwiches';

-- Re-runnable without clobbering: each row goes in only if it is not there
-- already, so a second run never wipes an obtained tick or orphans an expense.
insert into public.items
  (year, category, sort_index, name, kind, qty, budget, assigned_to, store, repeat_next, comments)
select * from (values
  (2026, 'food', 1, 'Eggs', 'For the breakfast sandwiches', '2 dozen', 0, 'Chris'::text, 'Market', 'Yes', 'Two each, plus spares.'::text),
  (2026, 'food', 2, 'Bacon', 'For the breakfast sandwiches', '1 kg', 0, 'Chris', 'Butcher', 'Yes', null),
  (2026, 'food', 3, 'Breakfast sausage', 'For the breakfast sandwiches', '1 kg', 0, 'Chris', 'Butcher', 'Yes', null),
  (2026, 'food', 4, 'Sliced cheese', 'For the breakfast sandwiches', '1 pack', 0, 'Chris', 'Market', 'Yes', 'Provolone or cheddar — whatever melts.'),
  (2026, 'food', 5, 'English muffins', 'For the breakfast sandwiches', '12', 0, 'Nate', 'Bakery', 'Yes', 'Nate is at the bakery anyway for the cornetti and the rolls.'),
  -- Four antipasto dishes call for olive oil and not one line bought any.
  -- Separate from the sauce: this is the bottle you finish a plate with.
  (2026, 'food', 11, 'Olive oil', 'The good bottle, for finishing', '1 L', 0, null, 'Market', 'Yes', 'The parm, the artichokes, the mushrooms and the fennel salad all want it.'),
  (2026, 'food', 17, 'Arugula', 'The bed under the bresaola', '1 bag', 0, null, 'Market', 'Yes', null),
  (2026, 'food', 18, 'Lemons', 'Squeezed over the bresaola', '3', 0, null, 'Market', 'Yes', null)
) as v(year, category, sort_index, name, kind, qty, budget, assigned_to, store, repeat_next, comments)
where not exists (
  select 1 from public.items i
  where i.year = v.year and i.category = v.category and i.name = v.name);

-- ---- 2 · an affogato is not sold in a shop; the gelato is
-- Renamed in place rather than deleted, so any expense already logged against
-- the row keeps its item.
update public.items set
  name = 'Vanilla gelato',
  kind = 'The affogato, with the espresso poured over',
  qty = '1 L',
  comments = 'Menu calls it Affogato; this is the half of it you buy.'
where year = 2026 and category = 'food' and name = 'Affogato';

-- ---- 3 · the shared lines say what else draws on them
update public.items set
  comments = 'One wedge covers this and the shaving over the bresaola.'
where year = 2026 and name = 'Parm & Balsamic glaze';

update public.items set
  comments = 'Garlic and parsley come off the Ingredients list — the counts there are sized for the sauce, so take the extra.'
where year = 2026 and name = 'Marinated mushrooms';

update public.items set
  comments = 'Parsley off the Ingredients list; the oil is the finishing bottle above.'
where year = 2026 and name = 'Fennel and orange salad';

update public.items set
  comments = 'Also the affogato and the coffee break.'
where year = 2026 and name = 'Espresso';

update public.items set
  comments = 'Mimosas are this and the Prosecco.'
where year = 2026 and name = 'Blood orange juice';

update public.items set
  comments = 'Carries the mimosas and the spritzes both.'
where year = 2026 and name = 'Prosecco';

update public.items set
  comments = 'Spritz is this, the Prosecco and the San Pellegrino.'
where year = 2026 and name = 'Aperol';

update public.items set
  comments = 'One counter, three meats — ordered together.'
where year = 2026 and name = 'Steak, Pepperoni & Capicollo Subs';

update public.items set
  comments = 'Rolled at the counter. Rolling them at home would add breadcrumbs and string to this list.'
where year = 2026 and name = 'Braciole';

-- The dish's own notes name all five, so the Menu and the Run sheet tell the
-- same story as the Buy list.
update public.menu set
  notes = 'Eggs, bacon, sausage, cheese, muffins — each its own line on the Buy list'
where year = 2026 and dish = 'Breakfast Sandwiches';

update public.runsheet set
  ingredients = 'Eggs, bacon, sausage, cheese, muffins'
where year = 2026 and activity = 'Breakfast sandwiches';

-- ---- 4 · the sauce quantities were sized for the sauce alone
-- The mushrooms and the fennel salad were taking from soffritto's count.
update public.items set
  qty = '14 heads',
  comments = 'Soffritto for ~98 L is 12, a head per 8 L. Two more for the marinated mushrooms.'
where year = 2026 and category = 'ingredients' and name = 'Garlic';

update public.items set
  comments = 'Matt potentially has. The marinated mushrooms and the fennel salad draw on it too.'
where year = 2026 and category = 'ingredients' and name = 'Parsley';

-- ---- 5 · keep the Ledger reading down the day
update public.items set sort_index = 6  where year = 2026 and category = 'food' and name = 'Espresso';
update public.items set sort_index = 7  where year = 2026 and category = 'food' and name = 'Cornetti';
update public.items set sort_index = 8  where year = 2026 and category = 'food' and name = 'Blood orange juice';
update public.items set sort_index = 9  where year = 2026 and category = 'food' and name = 'Parm & Balsamic glaze';
update public.items set sort_index = 10 where year = 2026 and category = 'food' and name = 'Bread for grilling';
update public.items set sort_index = 12 where year = 2026 and category = 'food' and name = 'Grilled artichokes';
update public.items set sort_index = 13 where year = 2026 and category = 'food' and name = 'Giardiniera';
update public.items set sort_index = 14 where year = 2026 and category = 'food' and name = 'Marinated mushrooms';
update public.items set sort_index = 15 where year = 2026 and category = 'food' and name = 'Soppressata';
update public.items set sort_index = 16 where year = 2026 and category = 'food' and name = 'Bresaola';
update public.items set sort_index = 19 where year = 2026 and category = 'food' and name = 'Taralli';
update public.items set sort_index = 20 where year = 2026 and category = 'food' and name = 'Steak, Pepperoni & Capicollo Subs';
update public.items set sort_index = 21 where year = 2026 and category = 'food' and name = 'Italian rolls';
update public.items set sort_index = 22 where year = 2026 and category = 'food' and name = 'Melon and prosciutto';
update public.items set sort_index = 23 where year = 2026 and category = 'food' and name = 'Fennel and orange salad';
update public.items set sort_index = 24 where year = 2026 and category = 'food' and name = 'Rigatoni';
update public.items set sort_index = 25 where year = 2026 and category = 'food' and name = 'Braciole';
update public.items set sort_index = 26 where year = 2026 and category = 'food' and name = 'Cannoli';
update public.items set sort_index = 27 where year = 2026 and category = 'food' and name = 'Vanilla gelato';
update public.items set sort_index = 28 where year = 2026 and category = 'food' and name = 'Grappa';
update public.items set sort_index = 29 where year = 2026 and category = 'food' and name = 'Prosecco';
update public.items set sort_index = 30 where year = 2026 and category = 'food' and name = 'Aperol';
update public.items set sort_index = 31 where year = 2026 and category = 'food' and name = 'Italian red wine';
update public.items set sort_index = 32 where year = 2026 and category = 'food' and name = 'Italian lager';
update public.items set sort_index = 33 where year = 2026 and category = 'food' and name = 'San Pellegrino';
update public.items set sort_index = 34 where year = 2026 and category = 'food' and name = 'Ice';
