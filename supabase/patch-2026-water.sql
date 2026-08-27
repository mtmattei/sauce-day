-- ============================================================================
--  SAUCE DAY · 2026 patch: a case each of water, flat and bubbly.
--
--  The menu has carried San Pellegrino since the start and nothing still, on a
--  day when five men stand over open flame outdoors from seven in the morning.
--  Both are a case of 24 now, both from Costco, neither claimed yet — whoever
--  is doing the Costco run picks them up with the rest of it.
--
--  Run this in the Supabase SQL editor INSTEAD of re-running seed.sql —
--  seed.sql wipes the year's expenses and every tick. Safe to re-run.
-- ============================================================================

update public.menu set
  qty   = '24',
  notes = 'Sparkling water for the day — a case of 24.'
where year = 2026 and dish = 'San Pellegrino';

-- Re-runnable: clear our own row before adding it back.
delete from public.menu where year = 2026 and dish = 'Still water';

insert into public.menu (year, sort_index, service, dish, who, source, qty, notes) values
  (2026, 252, 'Drinks', 'Still water', null, 'Costco', '24', 'Flat water for the day — a case of 24.');
