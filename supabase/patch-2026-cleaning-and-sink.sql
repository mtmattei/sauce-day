-- ============================================================================
--  SAUCE DAY · 2026 patch: sponges + Dawn become this year's buys, and the
--  outdoor sink joins the toolkit as a prospect.
--
--  Run this in the Supabase SQL editor INSTEAD of re-running seed.sql —
--  seed.sql wipes the year's expenses and obtained ticks; this touches only
--  the rows it names. Safe to re-run.
-- ============================================================================

-- Dawn is bought fresh this year: off the owned shelf, onto the Buy list.
update public.items set
  kind = 'Need', qty = '1', budget = 6.00, store = 'Grocery',
  repeat_next = 'Buy', comments = 'Fresh bottle for this year.', locked = false
where year = 2026 and name = 'Dawn dish soap';

-- Re-runnable: clear our own inserts before adding them back.
delete from public.items
where year = 2026 and name in ('Sponges (pack)', 'Outdoor sink');

insert into public.items
  (year, category, subcategory, sort_index, name, kind, qty, budget, assigned_to, store,
   repeat_next, comments, link) values
  (2026, 'toolkit', 'Cleaning & Sanitation', 34, 'Sponges (pack)', 'Need', '1 pack', 5.00, 'David', 'Grocery', 'Buy', 'New this year — kitchen sponges for the wash station.', null),
  -- kind 'Prospect' + no store keeps the sink off the Buy list and out of the
  -- readiness count until the crew commits (a store would put it on the list).
  -- Committing = set kind to 'Need' and store to 'Canadian Tire'.
  (2026, 'toolkit', 'Wash & Prep', 7, 'Outdoor sink', 'Prospect', '1', 124.99, null, null, 'Maybe', 'Prospect: PDG folding cleaning table with built-in sink & tap, $124.99 at Canadian Tire, in stock for pickup. Alt: CleanIT Riverstone wall-mount at Home Depot, $89.98, delivery only. Prices read 17 Aug 2026.', 'https://www.canadiantire.ca/en/pdp/pdg-outdoor-portable-fish-game-cleaning-table-with-built-in-sink-tap-1784959p.html');

-- Matt recounted: 55 jars on hand.
update public.jar_inventory set jars = 55 where year = 2026 and person = 'Matt';

-- Keep the section's ordering in step with the reseeded numbering.
update public.items set sort_index = 35 where year = 2026 and name = 'Scrub pads';
update public.items set sort_index = 36 where year = 2026 and name = 'Barkeepers Friend';
update public.items set sort_index = 37 where year = 2026 and name = 'Napkins';
