-- ============================================================================
--  SAUCE DAY · 2026 patch: this year's bottle has a name.
--
--  Distilleria Gualco, Grappa di Barbera — Silvano d'Orba, Piemonte. Pure
--  vinaccia, distilled in a bain-marie alembic, rested about six months.
--  700 ml at 42%, wax seal, corded cork. The first bottle since 2020 that is
--  not from the Veneto, so the Poli run ends here.
--
--  The photograph and what is printed on the label are catalogue data and
--  live in js/grappas.js. What this file writes is the crew's half: the row
--  the Grappa screen edits. The price is deliberately left null — nothing on
--  a label says what was paid, and the record is settled on that number
--  alone. Whoever paid puts it in on the Grappa screen.
--
--  Run this in the Supabase SQL editor INSTEAD of re-running seed.sql —
--  seed.sql wipes the year's expenses and every tick. Safe to re-run.
-- ============================================================================

update public.grappa set
  bottle   = 'Grappa di Barbera',
  producer = 'Distilleria Gualco',
  region   = 'Silvano d''Orba, Piemonte, Italy',
  notes    = 'Pure vinaccia, bain-marie alembic, about six months rested. 700 ml at 42%. First bottle since 2020 that is not from the Veneto. Price still to go in.'
where year = 2026;
