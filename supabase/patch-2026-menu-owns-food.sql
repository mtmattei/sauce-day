-- ============================================================================
--  SAUCE DAY · 2026 patch: the Menu becomes the food's only list.
--
--  The Food ledger and the Menu were the same 25 dishes twice, with the same
--  person and the same store on both sides and the description word for word
--  the same on sixteen of them. Every dish had to be ticked twice — `obtained`
--  on the buy list, `confirmed` on the menu — and whoever changed his mind
--  about bringing the cannoli had to say so in two places or the two lists
--  quietly disagreed.
--
--  So: the Menu owns the dish, who is bringing it, where it comes from and
--  whether it is sorted. The ledger keeps the money — food spend still books
--  to the `food` category through `expenses`, which is where it always was.
--  The buy list and the spend screen read both tables now, so nothing is lost
--  from the shopping trip: the dishes still group under their store.
--
--  Nothing here carried a budget — all 27 food rows were $0 — so no money
--  moves and no expense is orphaned (expenses.item_id is set null on delete).
--
--  Run in the Supabase SQL editor, after the app is on the matching version.
--  Safe to re-run.
-- ============================================================================

-- ---------------------------------------------------------------- room first
-- Menu sort_index goes to tens, once, so a dish can be slipped between two
-- others. Guarded, so a re-run does not multiply again.
do $$
begin
  if (select coalesce(max(sort_index), 0) from public.menu where year = 2026) < 100 then
    update public.menu set sort_index = sort_index * 10 where year = 2026;
  end if;
end $$;

-- ------------------------------------------------- the two the menu was missing
-- Bread for grilling and Ice existed only in the ledger. They are food, so
-- they join the menu rather than die with the rows they lived on.
delete from public.menu
where year = 2026 and dish in ('Bread for grilling', 'Ice');

insert into public.menu (year, sort_index, service, dish, who, source, qty, notes) values
  (2026,  55, 'Antipasto', 'Bread for grilling', 'Nate', 'Bakery', '2 loaves',
   'Crusty loaf for the parm & balsamic.'),
  (2026, 255, 'Drinks', 'Ice', 'David', 'Depanneur', '4 bags',
   'Friday chill-down needs it and every party forgets it.');

-- --------------------------------------------- details worth keeping from the ledger
update public.menu set qty = '12'
where year = 2026 and dish = 'San Pellegrino' and qty is null;

update public.menu set notes = 'Pickled vegetables for the antipasto.'
where year = 2026 and dish = 'Giardiniera' and notes is null;

-- --------------------------------------------------------------- the duplicates
-- Everything else in the food ledger is a dish the menu already holds. The
-- receipts survive: expenses.item_id is ON DELETE SET NULL and the expense
-- keeps its own label, amount, payer and category.
delete from public.items
where year = 2026 and category = 'food';
