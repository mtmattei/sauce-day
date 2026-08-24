# SPEC — The tally: counting jars as they come out of the bath

Sauce day is 29 August. Between about 15:00 and 22:15 the crew fills, caps and
bathes something like a hundred and eight jars, and the number of them is
written on nothing until Matt types a total into the History screen at the end
of the night. The app draws a jar wall that knows exactly how many jars were
*bought* and nothing about how many got *filled* — the one number the day is
actually about.

This spec adds the live count. A fat counter bar on the timeline, one tap per
jar, every phone showing the same total a second later, per-man credit, and the
jar wall filling in real time. It is the follow-up deliberately deferred from
the Board. That spec shipped in August; it is in git history as SPEC.md at
commit 4041654, and a working copy sits in the (untracked) `_backup/` folder.

Design constitution stays **Counter** (see the styles.css header): one typeface,
zero radii, zero shadows, hairlines, tomato-means-something. The one licence
this feature takes is size — the primary target is the biggest interactive
element in the app, because it is used with wet hands, in the dark, next to a
propane burner.

---

## Architecture Brief

**Module structure** (no framework, ES modules, no build step — unchanged):

- `js/tally.js` — NEW. `tallyBar(day)` renders the counter bar; `logJar()` /
  `logFallen()` / `undoLast()` own the writes. Presentation plus its three
  writes, the same shape `timeline.js` already has for `toggleStep`.
- `js/calc.js` — NEW export `jarTally()`. The single reader of `state.jarLog`.
  Returns `{ filled, fallen, byPerson, live, lastByMe }`.
- `js/timeline.js` — mounts the bar above `.sdstrip`; `paintStrip`'s Jars cell
  reads `jarTally()` instead of `history.jars_filled`.
- `js/home.js` — the jar wall's mode decision reads the tally before it reads
  the closed-out history row.
- `js/jars.js` — unchanged shape. It already takes `{ total, full, fallen,
  mode }` and already draws tipped jars; one addition, a delta-animation gate
  so a realtime bump animates only the jars that changed.
- `js/db.js` — one `KEY` entry, one `TABLES` entry, `jar_log` added to
  `AUTHORED`. Realtime subscribes automatically: `startRealtime()` iterates
  `Object.keys(KEY)`.
- `js/views.js` — History close-out prefills `jars_filled` / `fallen_soldiers`
  from the tally instead of leaving them null.
- `js/demo.js` — a `jar_log` array so demo mode exercises every state.
- `index.html` — one importmap line for `./js/tally.js`.

**State model**: one new table, append-only.

```sql
create table public.jar_log (
  id         uuid primary key default gen_random_uuid(),
  year       int  not null,
  person     text not null,            -- display_name, matching the rest of the app
  kind       text not null check (kind in ('filled','fallen')),
  delta      int  not null default 1,  -- +1, +12, or negative for an undo
  at         timestamptz not null default now(),
  created_by text
);
create index jar_log_year_idx on public.jar_log (year, at);
```

Append-only is the whole point. Five phones incrementing one integer column is
a read-modify-write race and taps get eaten; five phones inserting rows cannot
collide. It also carries per-man credit and a timestamp per jar for free —
enough for a pace line later, though not this pass.

No `updated_at` / `updated_by`, so `jar_log` stays **out** of `STAMPED` in
db.js and goes **into** `AUTHORED` (`created_by`). Sending `updated_by` to a
table without the column is the PGRST204 failure that once left the ledger
silently empty — the comment in db.js already says so; obey it.

`state.jarLog` is the cache key. `jarTally()` sums deltas:

```
filled = sum of delta where kind = 'filled'   (undo rows carry a negative delta)
fallen = sum of delta where kind = 'fallen'
byPerson[name] = { filled, fallen }           sorted desc by filled
live   = rows.length > 0
```

**Navigation model**: unchanged. No new route. The bar lives inside the
existing timeline view, which already owns `#/` on the day (`daysToGo() <= 1`)
and is reachable before then through the Board's "see the run of the day" peek.

**Data flow**: tap → `insert("jar_log", …)` → `reloadTable` on the writer's
phone, realtime `postgres_changes` → `reloadTable("jar_log")` on everyone
else's → `emit()` → the timeline's `onChange(render)` repaint. The count is
never held in module state; it is always `jarTally()` read fresh, so a
reconnect after a dead zone reconciles by itself.

**Reconciliation with close-out**: the tally is the live truth for the current
year; `history.jars_filled` is the permanent record. Close-out copies the tally
in (it currently writes neither field). After close-out both agree, and
`jarTally()` still wins for the current year, so re-opening the app on Sunday
shows the same number it showed at midnight. Editing the History cell by hand
afterwards is still allowed and still the final word — for a *past* year, which
is the only year that cell is ever edited for.

**Dependencies**: none added.

**Platform constraints**: GitHub Pages static hosting, ES modules from source,
the crew's phones (Chrome Android + Safari iOS) as the primary device, mostly
one-handed, often at arm's length on a propped phone. Pages caches for ten
minutes and the importmap stamp makes each deploy atomic — so run the schema
patch *before* pushing code. A phone on new code reading a table that does not
exist yet is the only ordering that breaks.

**Testing/validation**: demo mode (`?demo`) for every permutation — no rows,
mid-count, over-count, undo, fallen only. Live smoke on the real project after
the patch runs. Concurrency check: two browsers tapping at once must land two
rows and one total.

---

## Design Brief

**Visual direction**: Counter, at maximum size. The bar is a hairline-ruled
band, not a card, not a floating pill. Tomato is the fill and the count; the
fallen control is `--fg-3` and stays quiet until it is used.

**Layout structure** — the bar, pinned above the strip on the timeline:

```
+----------------------------------------------------+
| JARS FILLED                               undo +12  |
|                                                     |
|   74           +--------------+   +------+          |
|   of 108       |      +1      |   | +12  |          |
|   3 lost       +--------------+   +------+          |
|                                                     |
| ==============================------------  lost one |
+----------------------------------------------------+
```

- **The count** is the largest number in the app after the Board's countdown —
  `clamp(3.5rem, 14vw, 5rem)`, Chivo at the weight the countdown uses. Under it
  "of 108" in the `.k` caps style, and the fallen count only once it is
  non-zero.
- **+1** is the primary: minimum 96px tall, at least half the bar's width, full
  tomato. **+12** sits beside it at the same height, half the width, hairline
  outline — a rack out of the canner, and not a mis-tap risk next to the big
  one.
- **lost one** is a text-weight control on the bottom rule, deliberately small
  and deliberately not next to +1.
- **undo** appears top-right only while this crew member's own last row is
  under 90 seconds old, and names what it undoes ("undo +12").
- The **progress rule** under the buttons is the existing meter treatment from
  the Board's readiness strip — the same `.track` / `i` hairline pair, not a
  new component.

**Typography**: Chivo, existing scale, one new size token for the count
(`--tally-num`). Button labels are the existing button type at 1.5× — no new
weights.

**Spacing**: `--pad` rhythm. The bar is separated from the strip below it by
the same hairline every section uses. Thumb reach beats balance: the buttons
sit at the bar's bottom edge, the number above them.

**Component hierarchy**: `.tally` › `.tallynum` / `.tallybtns` / `.tallytrack`
/ `.tallyfoot`. One new section in styles.css (`/* THE TALLY */`), tokens only.

**Theme usage**: `--tomato` fill, `--hair` rules, `--fg-3` for the fallen and
the undo. Both themes; no new colours.

**Responsive**: single column always. Below 380px the +12 drops under the +1
rather than either shrinking below 96px. Above 900px the bar caps at the
timeline's content width and the number moves left of the buttons instead of
above them.

---

## Interaction Brief

**When the bar exists.** It arms when jarring starts and never disarms:

1. the first `DAY`-section run-sheet step with `icon = 'jar'` ("Jarring
   begins", 15:00) has status `current` or `done`, **or**
2. any `jar_log` row exists for the year (someone started early, or the step
   was never ticked).

Before that it is not rendered at all. There is no reason to show a zero on a
Tuesday, and the Board already answers Tuesday's questions.

**User flows**:

- A man seals a jar, taps **+1**, sees the number move on his phone and on
  everyone else's. That is the whole flow, a hundred times.
- A rack of twelve comes out of the bath → **+12**.
- A jar cracks in the bath → **lost one** → the count of lost rises, the wall
  tips one over, filled is untouched. A fallen jar is its own tally, not a
  subtraction.
- Fat-fingered → **undo** within 90 seconds, which appends a compensating
  negative row rather than deleting, so per-man credit stays honest and there
  is no delete race.
- 22:15, the count step: the number is already there. Matt ticks the step.
- Close-out on the History screen carries the tally into the record.

**Input behavior**: every control is a real `<button>`. Taps are optimistic —
the number moves on the writer's phone the instant it is tapped, before the
insert resolves, and reconciles on the reload. A phone in a dead zone at the
bottom of the yard must not feel broken. A failed insert falls back to the
existing `flash(…, true)` + sync-bar path, and the optimistic number rolls back
with a "not saved" line under the count.

**Empty states**: armed with no rows → the number reads `0`, "of 108", no
fallen line, no undo, empty track. The bar looks exactly as it will at jar one.

**Loading states**: the bar renders from cache instantly like every other
screen; `jarTally()` on empty state returns zeroes, never NaN. A tally that has
not loaded yet must not draw an empty wall over a full one — the wall keeps its
prep reading until `state.jarLog` has been fetched at least once.

**Error states**: insert failure as above. A count that exceeds `jarsRequired`
is **not** an error — the plan was a forecast, the day is the fact. The wall
grows to `max(jarsRequired, filled + fallen)` and the sub-line reads "12 over
the plan", which is a good problem and should read like one.

**Animations** (`prefers-reduced-motion` respected, all <= 300ms, `--e`):

- Tap: the existing press treatment (scale 0.98, no bounce).
- The number counts up rather than jumping — a 180ms tween, and only when the
  delta is >= 12, because a +1 that animates reads as lag.
- The jar wall fills **only the delta jars**, 8ms stagger, keyed off a module
  flag the way `jars.js` already gates its first-mount wave.
- The fallen jar tips over on arrival: 240ms rotate to 90°, and that is the one
  animation allowed to be slightly slow, because it should register.

**Feedback states**: no toast on a successful tap — the number moving *is* the
receipt, and a hundred toasts in an evening is a hundred taps' worth of noise.
Realtime arrivals from another phone move the number silently.

**Accessibility**: the count is `aria-live="polite"` and reads "74 jars filled
of 108". Buttons carry real labels ("Count one jar", "Count a rack of twelve",
"Log a broken jar"). Targets are >= 96px, far past the 44px floor. The jar wall
keeps `role="img"` with its sentence updated for live mode. Contrast on the
tomato button is the existing primary-button pair, already checked.

**Runtime verification steps**:

1. `python -m http.server 8080` → `?demo` → force the jarring step current
   (mark the 14:00 demo `runsheet` row done) → the bar appears; before that it
   does not.
2. Tap +1 ten times, +12 twice → 34; the wall shows 34 filled; the strip's Jars
   cell reads 34.
3. Tap **lost one** → fallen 1, a tipped jar on the wall, filled unchanged.
4. Undo inside 90s → back to 33; the undo control disappears after 90s.
5. Over-count past `jarsRequired` → the wall grows, the sub-line reads "over
   the plan", nothing clips.
6. Mobile viewport 390×844: +1 >= 96px tall, no horizontal scroll, the number
   readable at arm's length.
7. Both themes; `prefers-reduced-motion: reduce` → no count-up, no fill wave.
8. Live: two browsers signed in as two members, tapping at the same time → two
   rows, one agreed total, both phones showing it inside a second.
9. Close out the year in demo → `jars_filled` / `fallen_soldiers` prefilled
   from the tally; the wall still reads the same number afterwards.

---

## Implementation Plan

Fresh session, reading this spec cold. Order:

1. `supabase/patch-2026-jar-log.sql` — create table, RLS (the same four crew
   policies every table gets), realtime publication. Mirror the same block into
   `schema.sql` (drop line, create, RLS array, realtime array) so a clean run
   includes it. **Run the patch on the live project before pushing code.**
2. `js/db.js` — `KEY.jar_log = "jarLog"`, a `TABLES` entry filtered to `YEAR`
   ordered by `at`, `jar_log` into `AUTHORED`, `state.jarLog = []`.
   `js/demo.js` — a `jar_log` array and the `pushDemo()` line.
3. `js/calc.js` — `jarTally()`. Verify against demo rows before any UI exists.
4. `js/tally.js` + the styles section — the bar, its three writes, the arming
   rule. Mount it in `timeline.js`; repoint `paintStrip`'s Jars cell.
5. `js/home.js` + `js/jars.js` — live mode on the wall, delta animation.
6. `js/views.js` — close-out prefill.
7. `index.html` importmap line; `.\tools\Bump-Version.ps1` (or let the
   pre-commit hook do it).
8. Verify per the Interaction Brief; commit per step, one push at the end.

Estimated: 3–4 commits, one session. **It has to be live and smoke-tested
before Friday 28 August** — the Friday prep evening is the last moment anyone
can find a problem without it costing the day.

## Unresolved Questions

All resolved with Matt, 2026-08-24. Recorded as decisions:

- **Credit model**: per-man append log (`jar_log`), not a shared integer.
  Concurrency safety is the reason; per-man credit is the bonus.
- **Placement**: pinned bar at the top of the timeline, armed when jarring
  starts, not tucked inside the 22:15 count step.
- **Tap unit**: +1 primary, +12 beside it, undo within 90 seconds.
- **Fallen soldiers**: logged live, second smaller control, same bar.
- **Accepted risk**: the arming rule keys off `icon = 'jar'` on a `DAY` step
  rather than a new column. If that row's icon is ever changed the bar falls
  back to rule 2 (rows exist), and the first tap then has to come from
  somewhere — in practice, ticking the step. Cheap to fix with a `tally`
  boolean later; not worth a schema column five days out.
- **Not in scope**: a pace chart from the `at` timestamps, a per-man
  leaderboard on the Board, and jar-wall tap-to-count (the wall stays an
  instrument face, as decided in the Board spec).
