-- ============================================================================
--  SAUCE DAY · 2026 patch: the Friday plan lands on the run sheet.
--
--  What this adds, from the crew's checklist, against what the workbook
--  already held:
--    · Lead-up decisions — order the sink, confirm Chris's table, the grappa
--    · Wash the tomato mill; clean and check each piece as it comes out
--    · Pull out and organise the gear (burners, tent, plastic table)
--    · Friday setup for the sink, the burners, the barbecue and the TV
--    · Prep all food, and stage jars/mill/tools for the morning
--    · Saturday: a final setup check, and sterilising moved close to canning
--    · Toolkit gains the barbecue and the TV, which were only implied before
--      (the propane row already counts a tank for the BBQ)
--
--  Run this in the Supabase SQL editor INSTEAD of re-running seed.sql —
--  seed.sql wipes the year's expenses and every tick. This touches only the
--  rows it names, and is safe to re-run.
--
--  Ordering note: sort_index moves to tens, so a step can be slipped between
--  two others without renumbering the day. This supersedes the three
--  sort_index lines at the end of patch-2026-cleaning-and-sink.sql, which
--  have been updated to the new numbering.
-- ============================================================================

-- ---------------------------------------------------------------- toolkit
-- Renumber to tens, once. The guard keeps a re-run from multiplying again.
do $$
begin
  if (select coalesce(max(sort_index), 0) from public.items
      where year = 2026 and category = 'toolkit') < 100 then
    update public.items set sort_index = sort_index * 10
    where year = 2026 and category = 'toolkit';
  end if;
end $$;

-- The barbecue and the TV are Friday-setup kit. Both were assumed rather than
-- listed: the propane row already counts a tank for the BBQ, and the TV goes
-- up with the work area. Owned, so they sit in the manifest, not the Buy list.
delete from public.items
where year = 2026 and name in ('Barbecue', 'TV');

insert into public.items
  (year, category, subcategory, sort_index, name, kind, qty, budget, assigned_to, store,
   locked, repeat_next, comments, link) values
  (2026, 'toolkit', 'Setup & Workspace', 65, 'Barbecue', 'Owned', '1', 0, 'Matt', null,
   true, 'Yes', 'Set up Friday. The propane row already counts its tank.', null),
  (2026, 'toolkit', 'Setup & Workspace', 68, 'TV', 'Owned', '1', 0, 'Matt', null,
   true, 'Yes', 'Set up Friday with the work area. Extension cord, and a spot out of the splash zone.', null);

-- Two tables, and one of them is Chris's — which is why it is a lead-up task.
update public.items
set comments = 'Matt''s plastic table plus Chris''s — confirm Chris''s before Friday.'
where year = 2026 and name = 'Tables';

-- ---------------------------------------------------------------- run sheet
-- Retitle first, so the renumbering below can key on the final names.
-- Friday washes the jars; Saturday sterilises them close to canning.
update public.runsheet
set activity  = 'Wash every mason jar',
    time_label = 'Fri AM',
    equipment = 'Jars, dishwasher, Dawn, sponges',
    notes     = 'Count as you go. Sterilising happens Saturday, close to canning.'
where year = 2026 and activity in ('Wash and sterilise every jar', 'Wash every mason jar');

update public.runsheet
set activity   = 'Sterilise the jars and lids',
    time_label = '14:00',
    duration_min = 60,
    critical   = true,
    notes      = 'Close to canning on purpose: jars go from hot water straight into filling. One that has gone cold gets done again.'
where year = 2026 and activity in ('Jars into hot water, lids ready', 'Sterilise the jars and lids');

-- New steps. Delete-then-insert keeps the whole patch re-runnable.
delete from public.runsheet
where year = 2026 and activity in (
  'Order the utility sink/counter',
  'Confirm Chris is bringing his table',
  'Sort out the grappa',
  'Wash the tomato mill',
  'Pull out and organise the gear',
  'Clean and check each piece as it comes out',
  'Set up the utility sink/counter',
  'Set up the burners',
  'Set up the barbecue',
  'Set up the TV',
  'Prep all food',
  'Stage jars, mill, tools and supplies for the morning',
  'Final equipment and setup check');

insert into public.runsheet
  (year, sort_index, section, time_label, activity, lead, crew, equipment,
   icon, duration_min, ingredients, milestone, critical, notes) values
  -- Lead-up. No clock on purpose: time_label only parses "Fri…" and "HH:MM",
  -- so these carry no scheduled time and never become the current step.
  (2026,  10, 'PREP', 'This week', 'Order the utility sink/counter', 'Matt', 'David', null,
   null, null, null, false, false, 'Toolkit → Wash & Prep holds both options. Committing = set that row from Prospect to Need and give it a store. Order early enough to ship.'),
  (2026,  20, 'PREP', 'This week', 'Confirm Chris is bringing his table', 'Matt', 'Chris', null,
   null, null, null, false, false, 'The Tables row counts two: Matt''s plastic one and Chris''s.'),
  (2026,  30, 'PREP', 'This week', 'Sort out the grappa', 'David', null, null,
   null, null, null, false, false, 'It has to beat last year''s $135. See the Grappa tab.'),

  -- Friday
  (2026,  60, 'PREP', 'Fri AM', 'Wash the tomato mill', 'Matt', null, 'Food mill, cleaning brush, Barkeepers Friend',
   null, 20, null, false, false, 'Strip it down. Last year''s pulp lives in the hopper threads.'),
  (2026,  70, 'PREP', 'Fri PM', 'Pull out and organise the gear', 'Matt', 'Chris', 'Burners, pop-up tent, plastic table',
   null, 30, null, false, false, 'Burners, tent, plastic table — everything out of the garage in one pass.'),
  (2026,  80, 'PREP', 'Fri PM', 'Clean and check each piece as it comes out', 'Matt', 'All', 'Dawn, scrub pads, Barkeepers Friend',
   null, 30, null, false, false, 'Cracked, rusted or missing gets found now, not at 07:00.'),
  (2026, 100, 'PREP', 'Fri PM', 'Set up the utility sink/counter', 'Matt', 'David', 'Sink, hose',
   null, 30, null, false, false, 'No faucet in the listing — plan on a hose tap and somewhere for the water to drain.'),
  (2026, 110, 'PREP', 'Fri PM', 'Set up the burners', 'Matt', 'Mike', '3 burners, propane',
   null, 20, null, false, false, 'Placed and hooked up Friday. Lighting them is a Saturday job.'),
  (2026, 120, 'PREP', 'Fri PM', 'Set up the barbecue', 'Matt', null, 'BBQ, propane',
   null, 20, null, false, false, null),
  (2026, 130, 'PREP', 'Fri PM', 'Set up the TV', 'Matt', null, 'TV, extension cord',
   null, 20, null, false, false, 'Out of the splash zone.'),
  (2026, 150, 'PREP', 'Fri PM', 'Prep all food', 'Matt', 'All', 'Boards, knives, containers',
   'fork', 120, 'See the Menu tab', true, false, 'Everything that can be made the night before gets made the night before.'),
  (2026, 180, 'PREP', 'Fri PM', 'Stage jars, mill, tools and supplies for the morning', 'Matt', 'All', 'Jars, mill, tools',
   null, 30, null, false, false, 'Everything where it will be used, so 06:30 starts with coffee and not a search party.'),

  -- The day
  (2026, 200, 'DAY', '06:45', 'Final equipment and setup check', 'Matt', 'All', 'Friday''s setup',
   null, 15, null, false, false, 'Walk the work area: burners hooked up, sink draining, mill clamped, jars staged.');

-- Renumber the steps that were already here into the same scheme. Keyed on
-- activity, so running this twice changes nothing.
update public.runsheet r
set sort_index = m.si
from (values
  ('Pick up bushels from the market',                       40),
  ('Wash every mason jar',                                  50),
  ('Set up tables, tent and chairs',                        90),
  ('Fill and check propane tanks',                         140),
  ('Chill all beer, wine, prosecco, water',                160),
  ('Grind the espresso',                                   170),
  ('Start sauce prep',                                     190),
  ('Breakfast sandwiches',                                 210),
  ('Fire up the burners',                                  220),
  ('Wash tomatoes',                                        230),
  ('First batch cooking',                                  240),
  ('Coffee break',                                         250),
  ('First mill run',                                       260),
  ('Lunch break',                                          270),
  ('Milling continues, bottling line starts',              280),
  ('Sterilise the jars and lids',                          290),
  ('Jarring begins',                                       300),
  ('Wine break',                                           310),
  ('Water bath — seal the jars',                           320),
  ('Annual grappa toast',                                  330),
  ('Dinner — rigatoni with this year''s sauce',            340),
  ('Pizza run',                                            350),
  ('Cooling and cleanup',                                  360),
  ('Group photo',                                          370),
  ('Count jars, log fallen soldiers, divide the sauce',    380),
  ('Sauce Day complete',                                   390)
) as m(activity, si)
where r.year = 2026 and r.activity = m.activity;
