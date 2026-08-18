# Sauce Day

A live, shared planner for the annual sauce day. Static site on GitHub Pages,
Supabase for the data. Everyone on the crew list can claim items, tick things
off, and log what they paid; the settlement updates on everyone's phone at once.

Nobody but you can change the site itself — that lives in this repo and only you
push to it.

---

## What's here

```
index.html          the app shell: the graduated rule, the readout rail
styles.css          all styling — "Counter": graphite, one typeface, zero radii
js/config.js        THE ONLY FILE YOU EDIT
js/db.js            Supabase client, cache, realtime, demo fallback
js/calc.js          every number the app shows (settlement, yield, jars)
js/charts.js        hand-rolled SVG charts
js/icons.js         the drawn layer: the tomato mark family, the bottle shapes
js/grappas.js       the grappa shortlist — real SAQ products, prices, photos
js/ui.js            DOM helpers and the bound-field editors
js/views.js         the ten screens
js/app.js           boot, sign-in, router, the readout rail
js/guide.js         the ? sheet: every screen and where to do what
manifest.json       web app manifest — add to home screen
img/icon/           app icons, the cut-tomato mark
tools/hooks/        git hooks; install with tools/Install-Hooks.ps1
js/demo.js          offline demo data (used until config.js is filled in)
img/grappa/         bottle photographs
supabase/schema.sql tables, row-level security, realtime
supabase/seed.sql   2020-2025 history plus the 2026 starting plan
_backup/            the pre-Counter stylesheet and shell, kept for reference
```

**The look.** One typeface (Chivo) across nine weights, no rounded corners, no
shadows, hairline rules. Tomato is the only colour and it always means one of
three things: money going out, something still to buy, or the record to beat.
Dark and light are both designed; it follows whatever your phone is set to.

**The rail** down the left holds six numbers on every screen — days out, what
*you* owe or are owed, the even share, jars still to buy, the grappa record,
and how much of the buy list is done. An instrument that hides its reading is
useless.

**The grappa screen** draws every year since 2020 as a bottle whose height is
what it cost, with the standing record dashed across as the line to clear, then
lists the shortlist with real photographs and tells you plainly whether any of
them beats it. (Right now none of them do — the Torcolato is the closest, and
it is still $27.50 short.)

## Try it before you set anything up

Open `index.html` through a local server — ES modules won't load from `file://`.

```powershell
cd sauce-day
python -m http.server 8080
# then open http://localhost:8080
```

You'll get a red **demo mode** bar. Everything works, nothing saves. Click
around, then come back here.

---

## Setup — about 15 minutes

### 1. Create the Supabase project

1. Go to <https://supabase.com>, sign in, **New project**.
2. Name it `sauce-day`, pick a region near Montreal (`us-east-1` is closest),
   set a database password, create.
3. Wait for it to finish provisioning.

### 2. Run the SQL

1. Left sidebar → **SQL Editor** → **New query**.
2. Paste the whole of `supabase/schema.sql`, hit **Run**. You want
   "Success. No rows returned."
3. New query again. Paste the whole of `supabase/seed.sql`, **Run**.

If you re-run either file later it wipes and reloads what it owns, so it's safe
to redo if something goes sideways.

### 3. Point the app at it

Left sidebar → **Project Settings** → **Data API**. Copy the **Project URL** and
the **anon public** key. Put them in `js/config.js`:

```js
export const SUPABASE_URL = "https://abcdefghijk.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOi...";
export const CURRENT_YEAR = 2026;
```

The anon key is meant to be public — it's in every request the browser makes.
What protects your data is the row-level security in `schema.sql`, which refuses
anyone whose email isn't in the `members` table.

Reload the page. The demo bar disappears and you get a sign-in screen.

### 4. Turn on email sign-in

Supabase → **Authentication** → **Sign In / Providers** → make sure **Email** is
enabled. Leave "Confirm email" on; the app uses six-digit codes, not links.

Under **Authentication → URL Configuration**, add your GitHub Pages URL to
**Redirect URLs** once you have it (step 5), e.g.
`https://YOURNAME.github.io/sauce-day/**`.

> Supabase's free tier sends a limited number of auth emails per hour. For five
> people that's fine. If you ever hit the limit, plug in your own SMTP under
> **Authentication → Emails → SMTP Settings**.

### 5. Put it on GitHub Pages

```powershell
cd sauce-day
git init
git add .
git commit -m "feat: sauce day planner"
git branch -M main
git remote add origin https://github.com/YOURNAME/sauce-day.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Source: Deploy from a branch → `main` /
`(root)` → Save**. A minute later it's at
`https://YOURNAME.github.io/sauce-day/`.

The repo has to be public for Pages on a free account. That's fine — the code is
public, the data isn't. Anyone can read `config.js`; nobody can read a row
without an email on the crew list.

The `.nojekyll` file in the root stops GitHub from doing anything clever to the
`js/` folder. Leave it there.

**Install the git hooks once per clone:**

```powershell
.\tools\Install-Hooks.ps1
```

That puts a `pre-commit` hook in place which stamps the cache version for you
whenever a commit touches `js/`, `styles.css`, `manifest.json` or `index.html`.
With it installed you can ignore the next paragraph — it happens by itself.
`git commit --no-verify` skips it if you ever need to.

**When you change any code**, run `.\tools\Bump-Version.ps1` before you commit.
It rewrites the version stamp in `index.html`, which pins every script and the
stylesheet to one version. Pages caches files for ten minutes and phones cache
harder; without the bump, someone can get your new HTML with last week's
JavaScript — the stamp makes each deploy all-or-nothing. Content-only edits
(SQL, images, this file) don't need it.

### 6. Add the crew

Sign in with your own email (it's already seeded as admin). Go to **Crew** and
replace the four `@change-me.invalid` addresses with real ones. That's it —
they can sign in immediately.

---

## Day-to-day

| Screen | What it's for |
|---|---|
| **Today** | Countdown, what you owe, budget vs actual, how ready we are |
| **Buy** | Grouped by store. Claim an item, tick it when you've got it |
| **Spend** | Log your own receipts. The split recalculates for everyone |
| **Sauce** | Bushels → litres → jars, bands and lids to buy |
| **Menu** | Who's bringing what, by service |
| **Run** | The order the day happens in, tick as you go |
| **Ledger** | The full item list, three categories, add and edit anything |
| **Grappa** | The shelf, the shortlist with photos, and whether it beat last year |
| **History** | Every year since 2020, plus six charts |
| **Crew** | Who can get in (admin only) |

Everything syncs live. If David ticks the grappa off at the SAQ, it goes grey on
your phone a second later.

**Put it on your home screen.** The app ships a web manifest and icons, so
"Add to Home Screen" (iOS Share menu, Android's install prompt) gives you a
full-screen app instead of a browser tab with a URL bar over the run sheet.
On sauce day itself — and from the Friday prep evening — the run-of-day screen
holds a wake lock so the phone stops sleeping between steps.

This same map lives in the app: the **?** in the masthead opens the guide —
every screen with what it's for, plus a "Where do I…" index that maps the thing
you want to do to the screen that owns it. It opens itself the first time a
phone loads the app, then stays behind the ?. Hovering a section on the
graduated rule shows the same one-liner as a tooltip.

## Changing the grappa shortlist

`js/grappas.js` is a plain list. To add a bottle: drop a photo in `img/grappa/`,
copy an existing block, and fill in the SAQ number, price and size. The verdict
against the record works itself out. Keep the photo path **relative** — a
leading slash works locally and 404s on GitHub Pages.

Prices were read off the SAQ on **5 August 2026**. They move. Re-check before
anyone drives to the store.

## Next August

1. Bump `CURRENT_YEAR` in `js/config.js` to 2027, commit, push.
2. On the **History** screen, hit **Close out 2026** first — that writes the
   finished year into the permanent record.
3. Run a copy of `seed.sql` with `2026` swapped for `2027` to carry the item
   list forward, or add items by hand from the Ledger screen.

## Troubleshooting

**"Not on the list"** — your email isn't in `members`. Sign in as admin on
another device and add it, or add the row directly in the Supabase table editor.

**Nothing loads, no error** — open the browser console. A 401 means the anon key
is wrong; an empty result with no error usually means `schema.sql` ran but
`seed.sql` didn't.

**Changes don't appear on other phones** — realtime needs the tables in the
`supabase_realtime` publication. `schema.sql` does that at the bottom; re-run
just that block if you're unsure.

**Code email never arrives** — check spam, then Supabase → **Authentication →
Logs**. Rate limiting is the usual cause.
