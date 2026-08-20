-- ============================================================================
--  SAUCE DAY · does the Buy list actually cook the Menu?
--
--  Every dish on the Menu tab needs its purchases on the Buy list, and some
--  dishes are several purchases: a breakfast sandwich is eggs, bacon, sausage,
--  cheese and muffins, and none of those buy themselves. This is that check.
--  Paste it into the Supabase SQL editor; it reads and changes nothing.
--
--  `needs` is the map from dish to shopping. When the menu changes, change it
--  here too — that is the point of the file: the mapping is written down
--  instead of living in whoever last read the menu.
-- ============================================================================
with needs(dish, line) as (values
  -- Breakfast
  ('Breakfast Sandwiches','Eggs'), ('Breakfast Sandwiches','Bacon'),
  ('Breakfast Sandwiches','Breakfast sausage'), ('Breakfast Sandwiches','Sliced cheese'),
  ('Breakfast Sandwiches','English muffins'),
  ('Espresso','Espresso'),
  ('Cornetti','Cornetti'),
  ('Blood orange juice / mimosas','Blood orange juice'),
  ('Blood orange juice / mimosas','Prosecco'),
  -- Antipasto
  ('Parm & Balsamic glaze','Parm & Balsamic glaze'),
  ('Parm & Balsamic glaze','Bread for grilling'), ('Parm & Balsamic glaze','Olive oil'),
  ('Grilled artichokes','Grilled artichokes'), ('Grilled artichokes','Olive oil'),
  ('Giardiniera','Giardiniera'),
  ('Marinated mushrooms','Marinated mushrooms'), ('Marinated mushrooms','Olive oil'),
  ('Marinated mushrooms','Garlic'), ('Marinated mushrooms','Parsley'),
  ('Soppressata','Soppressata'),
  ('Bresaola','Bresaola'), ('Bresaola','Arugula'), ('Bresaola','Lemons'),
  ('Bresaola','Parm & Balsamic glaze'),
  ('Taralli','Taralli'),
  -- Lunch
  ('Steak, Pepperoni & Capicollo Subs','Steak, Pepperoni & Capicollo Subs'),
  ('Steak, Pepperoni & Capicollo Subs','Italian rolls'),
  ('Italian rolls','Italian rolls'),
  ('Melon and prosciutto','Melon and prosciutto'),
  ('Fennel and orange salad','Fennel and orange salad'),
  ('Fennel and orange salad','Olive oil'), ('Fennel and orange salad','Parsley'),
  -- Dinner
  ('Rigatoni with this year''s sauce','Rigatoni'),
  ('Braciole','Braciole'),
  -- Dessert. An affogato is not sold in a shop; the gelato is.
  ('Cannoli','Cannoli'),
  ('Affogato','Vanilla gelato'), ('Affogato','Espresso'),
  -- Drinks
  ('Grappa - the annual bottle','Grappa'),
  ('Prosecco','Prosecco'),
  ('Aperol','Aperol'), ('Aperol','Prosecco'), ('Aperol','San Pellegrino'),
  ('Italian red wine','Italian red wine'),
  ('Italian lager','Italian lager'),
  ('San Pellegrino','San Pellegrino')
),
-- The Buy screen's own test: a row is on the list if it names a store or is
-- still wanted. Keep this in step with viewBuy() in js/views.js.
buyable as (
  select name from public.items
  where year = 2026 and (store is not null or kind in ('Need','Buy','Refill','Costco'))
),
problems as (
  select 'DISH NOT IN THE MAP BELOW' as problem, m.dish as detail
  from public.menu m
  where m.year = 2026 and not exists (select 1 from needs n where n.dish = m.dish)
  union all
  select 'NEEDED PURCHASE NOT ON THE BUY LIST', n.dish || ' → ' || n.line
  from needs n
  where not exists (select 1 from buyable b where b.name = n.line)
)
select * from problems
union all
select 'OK', 'every dish on the menu has its purchases on the buy list'
where not exists (select 1 from problems)
union all
-- Not a fault: a buy that feeds no dish. Ice and the toolkit belong here.
-- Worth an eye each August in case a dish quietly left the menu.
select 'FOOD LINE NO DISH USES (check, not a fault)', i.name
from public.items i
where i.year = 2026 and i.category = 'food'
  and not exists (select 1 from needs n where n.line = i.name);
