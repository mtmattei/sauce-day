# SPEC — The Board: a dashboard for the homies

Sauce Day's home screen today is the live run-of-day timeline. That is the
right screen *on* sauce day and the wrong one for the seventeen days before
it: it answers "how is the day going" when the crew is asking "what do I need
to do, what do I owe, are we ready". This spec replaces the home route with a
context-aware dashboard — the **Board** — and runs a density pass over the
shell so the app reads as an instrument a friend built, not a corporate
tracker.

Design constitution stays **Counter** (see styles.css header): one typeface,
zero radii, zero shadows, hairlines, tomato-means-something. "Fun" is earned
through drawn objects (the jar wall, the existing icon family, the pixel
loader precedent), personal address ("you owe", "your three things"), and
motion — never through rounded-corner gloss, gradients, or mascots.

---

## Architecture Brief

**Module structure** (no framework, ES modules, no build step — unchanged):

- `js/home.js` — NEW. `viewHome()`, the Board. Composes existing calc
  functions; owns no data.
- `js/jars.js` — NEW. `jarWall(host, opts)` — renders the mason-jar grid
  SVG. Pure function of numbers in → SVG out, same philosophy as
  `charts.js`. Reused by the Board and by `viewSauce()`.
- `js/timeline.js` — unchanged. `viewSauceDay()` keeps existing route
  behavior on the day itself (see navigation).
- `js/views.js` — `viewSauce()` swaps its numeric jar tiles for the jar
  wall; otherwise untouched this pass.
- `js/app.js` — route table change only.

**State model**: unchanged. The Board is a pure projection of `state` via
`calc.js` (`yieldPlan`, `settlement`, `readiness`, `daysToGo`,
`grappaRecord`, `spentByPerson`) plus `state.me` for personalization. No new
tables, no new columns, no schema change.

**Navigation model**:

- `#/` → `viewHome` (the Board) — **except** when `buildDay().isToday`
  (or the settings date is past and jars aren't counted), when `#/` renders
  the existing timeline. The dashboard is "what matters right now"; on the
  day, what matters is the timeline. One route, context decides.
- The Board links deep: every card is a door into the screen that owns the
  data. Section label "Sauce Day" stays; the graduated rule is untouched.
- Before the day, the timeline stays reachable: the Board's countdown card
  carries a "see the run of the day" link that renders the timeline via a
  `state.ui.peekDay` flag (no new route, back = tap the brand or the link
  again).

**Data flow**: unchanged — `onChange(render)`; realtime reloads a table, the
Board re-renders. The Board must render correctly from partial state (demo
mode and mid-load).

**Dependencies**: none added. Jar SVG is hand-rolled in `jars.js` exactly as
`icons.js` hand-rolls bottles. No icon pack, no chart lib, no CSS framework.

**Platform constraints**: GitHub Pages static hosting; ES modules straight
from source; must work on the crew's phones (the primary device). Chrome +
Safari iOS. Pages caches JS for 10 min — ship the whole redesign as one
push so nobody sees a half-updated app.

**Testing/validation**: demo mode (`?demo`) for every state permutation
(fresh year, mid-prep, day-of, post-day); live site smoke via browser MCP;
`buildDay().isToday` forced via a temporary settings-date override in the
console, never by editing live data.

---

## Design Brief

**Visual direction**: Counter, applied at lower density. The current shell
shows ~30 numbers on load; the Board shows **five big ones** and lets
everything else sit one tap away. Graphite field, hairline dividers, tomato
only where it already has meaning. The Board is allowed one drawn signature
element: the jar wall.

**Layout structure** (mobile-first, single column; two columns ≥ 900px):

1. **Countdown hero** — "17 days". The biggest type in the app (clamp to
   ~5rem). Under it, one line: date, first-pot time. This is the only card
   with no action.
2. **You** — addressed to `state.me.display_name`. Your balance (owed/owing,
   green/tomato), your unbought items count, your unconfirmed menu dishes.
   Each line is the fact + a deep link. If everything's clear: "You're
   square. Nothing on your list." — the empty state is the reward.
3. **The jar wall** — see below. Header: "108 jars" / subline "9 packs to
   buy · $180 with lids".
4. **Crew pulse** — one row per member: name, items outstanding, balance
   sign. Tomato dot = has stuff to do; no dot = clear. Tap → Buy filtered
   view (existing screen, existing filter if present; else just Buy).
5. **The record** — grappa card: record price as the dashed line figure,
   this year's status ("not bought yet · beat $135"). Tap → Grappa.
6. **Readiness strip** — three thin meters (Buy x/y, Menu x/y, Run x/y)
   in one row, each a link. Replaces nothing — this is the rail's "Bought"
   number given two friends.

**The jar wall** (`jars.js`):

- A grid of small mason-jar silhouettes, **12 per row — one row is one
  pack**, which is literally how they're bought. Row count =
  `ceil(jarsRequired / 12)`.
- Jar states: **full** (filled tomato body + lid) = on hand;
  **empty** (hairline outline) = still to buy. Pre-day the wall shows
  `onHand.jars` full out of `jarsRequired`.
- During and after the day the same wall represents **actual yield** —
  filled = jars filled, plus **fallen soldiers** drawn tipped over with a
  hairline crack, because the crew tracks those and it should sting a
  little. After close-out this reads from `history[YEAR].jars_filled`.
  During the day there is currently no live filled-count column — see
  Unresolved; v1 may switch to yield mode only once the count is entered
  at the 22:15 "count jars" runsheet step.
- Jar glyph: single `<symbol>`/`<use>`, ~18×24px viewBox, mouth + band +
  shoulder + straight body — recognizably a Mason jar in 6 path segments,
  drawn in the same hand as `icons.js` bottles.
- At 108 jars this is ~9 rows; cap the wall's height and let it be the
  card's whole body. If `jarsRequired` exceeds 240, fall back to one row
  per pack (12-jar chunk = one glyph + count) — don't render 400 nodes.

**Typography**: Chivo, existing scale. Hero number gets the one new size.
Card headers are the existing `.k` caps style. No new fonts, no new weights.

**Spacing**: cards separated by hairlines, not boxes — the Board is a
ruled sheet, not a card grid. `--pad` rhythm unchanged.

**Theme usage**: tokens only; both themes; jar fill uses `--tomato`,
empty uses `--hair`; fallen soldier uses `--fg-3`. No new colors.

**Responsive**: single column below 900px; the rail already collapses on
mobile (verify — if the readout rail hides on phones, the Board must carry
its numbers, which it does by design). Jar wall scales via viewBox width.

**Density pass (shell-wide, this spec's second half)**:

- Rail: keep six numbers but demote sublabels to one line each.
- Buy/Menu/Run screens: collapse completed groups by default ("32 owned —
  show"), keeping the fold state in `state.ui` (session-only). All data
  stays; nothing is removed, it's folded.
- Kill duplicate figures: the readout rail already shows share/owed — the
  Spend screen's split table stays, but its header stat tiles go.
- Tables → rows: anywhere a `<table>`-like grid shows on mobile narrower
  than 400px, it becomes stacked rows (Spend split, History columns).

---

## Interaction Brief

**User flows**:

- Crew member opens app → Board → sees countdown, their own status, jar
  wall. Taps their items line → Buy screen, does their ticking there.
- Day-of: opens app → timeline (automatic). No navigation relearning.
- Matt (admin) closes the year on History → next open, jar wall shows
  yield + fallen soldiers.

**Input behavior**: the Board is read-mostly. Two exceptions:
- Readiness meters and crew rows are links, full-row tap targets ≥ 44px.
- The jar wall is **not** an input this pass (see Unresolved).

**Empty states**: fresh year (no bushels row) → jar wall shows a single
ghost row of 12 with "set the bushel count" link to Sauce. No member match
(`state.me` null can't happen post-gate, but demo defaults to Matt).

**Loading states**: Board renders from cache instantly on repeat visits
(existing behavior); first paint with empty tables must not NaN — every
calc call already guards, verify on Board copy ("— days" never "NaN days").

**Error states**: sync bar unchanged and sits above the Board like every
screen.

**Animations** (respect `prefers-reduced-motion`, all ≤ 300ms, `--e`):
- Jar wall fills left-to-right, row by row, 8ms stagger per jar, on first
  mount only (not on every realtime re-render — key off a module flag).
- Countdown hero: no animation. It's a number, not a firework.
- Card entrance: none. The ruled sheet is just there.

**Feedback states**: realtime change to any table re-renders the Board
silently (existing `emit()` path). A jar count change animates only the
delta jars.

**Accessibility**: jar wall gets `role="img"` + `aria-label="72 of 108
jars on hand"`; individual jars `aria-hidden`. Countdown is live text.
Row-links are real `<a>` elements. Contrast: empty-jar hairline on
graphite must pass at the glyph scale — if not, bump to `--fg-4`.

**Runtime verification steps**:
1. `python -m http.server 8080` → `?demo` → Board renders, all five cards,
   no console errors, both themes (emulate via devtools).
2. Console-force `state.settings.sauce_date` to today → reload route →
   timeline appears at `#/`.
3. Demo: set `jar_inventory` counts to partial → wall shows mixed
   full/empty; set `history` row with `jars_filled` + `fallen_soldiers` →
   yield mode with tipped jars.
4. Mobile viewport (390×844): single column, tap targets, no horizontal
   scroll.
5. Live site: sign-in intact, Board reads real data, deep links land.

---

## Implementation Plan

Fresh session, reading this spec cold. Order:

1. `js/jars.js` — jar symbol + `jarWall()`; verify standalone in demo on
   the Sauce screen first (lowest-risk host).
2. `js/home.js` — the Board, five cards + readiness strip, all deep links.
3. `js/app.js` — route swap with the `isToday` branch + `peekDay` flag.
4. Density pass — rail sublabels, fold-completed groups on Buy/Menu/Run,
   Spend header tiles removal, mobile row conversion.
5. Styles — one new section in styles.css (`/* THE BOARD */`), tokens only.
6. Verify per Interaction Brief; commit per step (conventional messages);
   single push at the end.

Estimated: 3–4 commits, one session.

## Unresolved Questions

All resolved with Matt, 2026-08-12. Recorded as decisions:

- **Live yield during the day**: no schema change. The wall shows prep
  status until the jar count is entered at the 22:15 close-out step, then
  flips to yield mode. A live tap-to-count interaction is a candidate
  follow-up spec before the day — not this pass.
- **Jar wall input**: read-only instrument face. Counts stay editable on
  the Sauce screen only.
- **Buy personal filter**: yes — add a one-tap "mine" filter to viewBuy
  (matches `assigned_to` containing the member's display name); the
  Board's "your items" line deep-links to it.
- **Rail on the Board**: the readout rail hides on `#/` only and stays on
  every other screen. The Board carries its numbers full-width.
- **Day-of takeover** (accepted proposal): timeline takes over `#/` when
  `daysToGo() ≤ 1`, so Friday-evening prep already shows the run of the day.
- **Crew pulse privacy** (accepted proposal): the Board shows balance
  *direction* per member only (owed / owing / square); amounts stay on
  Spend and Ledger.
