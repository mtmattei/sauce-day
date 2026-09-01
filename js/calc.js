// ============================================================================
//  Every number the app shows is derived here, in one place.
//  Same arithmetic as the Excel planner, so the two agree line for line.
// ============================================================================
import { state, YEAR } from "./db.js";

export const CATS = [
  { key: "toolkit",     label: "Sauce toolkit",     short: "Toolkit" },
  { key: "ingredients", label: "Sauce ingredients", short: "Ingredients" },
  { key: "food",        label: "Food & drinks",     short: "Food" }
];

export const money  = v => (v < 0 ? "-$" : "$") +
  Math.abs(Number(v) || 0).toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const money0 = v => (v < 0 ? "-$" : "$") +
  Math.round(Math.abs(Number(v) || 0)).toLocaleString("en-CA");
export const num = (v, d = 0) => (Number(v) || 0).toLocaleString("en-CA",
  { minimumFractionDigits: d, maximumFractionDigits: d });

export const crewNames = () => state.members.map(m => m.display_name);

// ---------------------------------------------------------------- the buy list
// One rule, stated once. It was written out in four places and had already
// drifted in one of them — readiness() counted a kind of "Costco" as nothing to
// buy while the buy list showed it, so the meter could never reach full.
export const BUYABLE_KINDS = ["Need", "Buy", "Refill", "Costco"];
export const buyable = i => !!i.store || BUYABLE_KINDS.includes(i.kind);

/**
 * The dishes that have been broken into ingredients. A food item's
 * `subcategory` names the dish it is for, the way a toolkit item's names its
 * section.
 */
export const brokenOutDishes = () => new Set(
  state.items.filter(i => i.category === "food" && i.subcategory).map(i => i.subcategory));

/**
 * A dish belongs on the shopping list only while nothing is listed under it.
 * Bought whole — the cannoli, the taralli, the prosecco — it is itself the
 * purchase. Broken into ingredients, it steps aside for them: you cannot hand
 * a butcher the word "braciole", and nothing should appear on the list twice.
 */
export const shoppable = (m, broken = brokenOutDishes()) => !broken.has(m.dish);

// Food and drink live in `menu`, the kit and the ingredients in `items`, so the
// person responsible is `who` on one and `assigned_to` on the other.
export const ownerOf = r => r.assigned_to ?? r.who ?? null;

// A job the whole crew owns. "All" is what the run sheet has said since the
// first year; "Crew" turns up in the bushels. All three mean the same thing and
// all three land on every man's list.
export const EVERYONE = "Everyone";
const EVERYONE_WORDS = new Set([EVERYONE, "All", "Crew"]);

// The field is free text ("Matt / David", "David (4) / Matt (2)"), so
// membership is a substring test, not equality — and a job that belongs to
// everyone belongs to you too, or it sits on nobody's list at all.
export const assignedTo = (r, name) => {
  const owner = ownerOf(r);
  if (!name || !owner) return false;
  return EVERYONE_WORDS.has(owner.trim()) || owner.includes(name);
};

// ---------------------------------------------------------------- money
export function budgetByCat() {
  const out = { toolkit: 0, ingredients: 0, food: 0 };
  state.items.forEach(i => { out[i.category] += Number(i.budget) || 0; });
  return out;
}

export function spentByCat() {
  const out = { toolkit: 0, ingredients: 0, food: 0 };
  state.expenses.forEach(e => { out[e.category] += Number(e.amount) || 0; });
  return out;
}

export const sum = o => Object.values(o).reduce((a, b) => a + b, 0);

export function spentByPerson() {
  const out = {};
  crewNames().forEach(n => { out[n] = 0; });
  state.expenses.forEach(e => {
    if (!(e.paid_by in out)) out[e.paid_by] = 0;
    out[e.paid_by] += Number(e.amount) || 0;
  });
  return out;
}

/** Even split, then the smallest set of transfers that clears it. */
export function settlement() {
  const paid = spentByPerson();
  const names = Object.keys(paid);
  const total = names.reduce((a, n) => a + paid[n], 0);
  const share = names.length ? total / names.length : 0;
  const net = names.map(n => ({ name: n, paid: paid[n], share, net: paid[n] - share }));

  const credits = net.filter(p => p.net > 0.005);
  const debts   = net.filter(p => p.net < -0.005);
  const totalCredit = credits.reduce((a, p) => a + p.net, 0);
  const transfers = [];
  debts.forEach(d => credits.forEach(c => {
    const amt = -d.net * (c.net / (totalCredit || 1));
    if (amt > 0.005) transfers.push({ from: d.name, to: c.name, amount: amt });
  }));
  return { net, total, share, transfers, balanced: Math.abs(net.reduce((a, p) => a + p.net, 0)) < 0.01 };
}

// ---------------------------------------------------------------- the sauce
export function yieldPlan() {
  const s = state.settings || {};
  const lpb    = Number(s.litres_per_bushel) || 14;
  const buffer = Number(s.buffer_pct) || 0;
  const bushels = state.bushels.reduce((a, b) => a + (Number(b.count) || 0), 0);
  const litres  = bushels * lpb;
  const jarsRequired = Math.ceil(litres * (1 + buffer));

  const onHand = state.jars.reduce((a, j) => ({
    jars: a.jars + (j.jars || 0), bands: a.bands + (j.bands || 0), lids: a.lids + (j.lids || 0)
  }), { jars: 0, bands: 0, lids: 0 });

  const jarsToBuy   = Math.max(0, jarsRequired - onHand.jars);
  const jarPacks    = Math.ceil(jarsToBuy / 12);
  const bandsToBuy  = Math.max(0, jarsRequired - onHand.bands - jarPacks * 12);
  const bandPacks   = Math.ceil(bandsToBuy / 12);
  const lidsToBuy   = Math.max(0, jarsRequired - onHand.lids - jarPacks * 12 - bandPacks * 12);
  const lidPacks    = Math.ceil(lidsToBuy / 12);

  const cost = jarPacks * (Number(s.jar_price)  || 0)
             + bandPacks * (Number(s.band_price) || 0)
             + lidPacks * (Number(s.lid_price)  || 0);

  return {
    bushels, lpb, buffer, litres, jarsRequired, onHand,
    jarsToBuy, jarPacks, bandsToBuy, bandPacks, lidsToBuy, lidPacks, cost,
    bushelBudget: bushels * (Number(s.price_per_bushel) || 0)
  };
}

// ---------------------------------------------------------------- the record
/** History rows plus the live current year, ready for the charts. */
export function seriesData() {
  const rows = state.history.map(h => ({ ...h, live: false }));
  const spent = spentByCat();
  const g = state.grappa.find(x => x.year === YEAR);
  rows.push({
    year: YEAR,
    edition: state.settings?.edition ?? null,
    toolkit: spent.toolkit || null,
    ingredients: spent.ingredients || null,
    food: spent.food || null,
    crew_size: state.settings?.crew_size || state.members.length || 5,
    bushels: yieldPlan().bushels || null,
    litres: null, jars_filled: null, fallen_soldiers: null,
    grappa: g?.price ?? null,
    live: true
  });
  rows.sort((a, b) => a.year - b.year);
  return rows.map(r => {
    const hasMoney = [r.toolkit, r.ingredients, r.food].some(v => v !== null && v !== undefined);
    const total = hasMoney ? (Number(r.toolkit) || 0) + (Number(r.ingredients) || 0) + (Number(r.food) || 0) : null;
    return { ...r, total, perMan: total && r.crew_size ? total / r.crew_size : null };
  });
}

export function grappaRecord() {
  const past = state.grappa.filter(g => g.year !== YEAR).map(g => Number(g.price) || 0);
  return past.length ? Math.max(...past) : 0;
}

/**
 * Days between today and sauce day, SIGNED. Negative once the day has passed.
 *
 * It used to clamp at zero, which meant the app had no way to know the day was
 * over: the countdown read "T minus 0 days" forever, the home route handed
 * itself to the run-of-day timeline forever, and the wake lock was never let
 * go. A planner for an annual event spends 364 days a year not being the day,
 * and two of those states are not the same state.
 */
export function daysToGo() {
  const d = state.settings?.sauce_date;
  if (!d) return null;
  const target = new Date(d + "T00:00:00");
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
}

/**
 * The three days the app has to be, from one number.
 *
 *   before — planning. The Board answers everything.
 *   during — the Friday prep evening and the day itself. The timeline takes
 *            the home route, holds the screen awake, and stops folding steps,
 *            because the sequence is the whole reading.
 *   after  — it happened. The Board comes back, now reading in the past tense,
 *            and the timeline stays reachable as the record of how it went.
 *
 * No date set at all reads as `before`: nothing has been scheduled, so nothing
 * has passed.
 */
export const phaseOf = d =>
  d === null ? "before" : d < 0 ? "after" : d <= 1 ? "during" : "before";

export const dayPhase = () => phaseOf(daysToGo());

// ---------------------------------------------------------------- the trip
// Two tables, one shopping trip. The kit and the sauce ingredients are `items`;
// food and drink are `menu`, which owns the dish, who is bringing it and where
// it comes from. A dish broken into ingredients steps aside for them, so
// nothing is on the list twice.
//
// This lives here rather than in views.js because the Buy screen is not the
// only thing that needs to know what is on the list: the readiness meter and
// the rail both quote a fraction of it, and for two refactors they quoted a
// different set of rows than the screen they link to.
const CAT_RANK = { toolkit: 0, ingredients: 1, food: 2 };

export function buyEntries() {
  const broken = brokenOutDishes();
  return [
    ...state.items.filter(buyable).map(i => ({
      table: "items", row: i, store: i.store, rank: CAT_RANK[i.category] ?? 3,
      sort: i.sort_index, got: i.obtained, budget: Number(i.budget) || 0
    })),
    ...state.menu.filter(m => shoppable(m, broken)).map(m => ({
      table: "menu", row: m, store: m.source, rank: CAT_RANK.food,
      sort: m.sort_index, got: m.confirmed, budget: 0
    }))
  ].sort((a, b) => (a.store || "zzz").localeCompare(b.store || "zzz")
    || a.rank - b.rank || a.sort - b.sort);
}

/**
 * Three meters, each matching the screen it is a door into.
 *
 * `buy` counts the shopping trip exactly as the Buy screen draws it — kit,
 * ingredients, and the dishes bought whole. It used to count `items` alone,
 * so the meter and the screen it links to disagreed by however many dishes
 * were being bought rather than cooked.
 *
 * `menu` is a different question — is the menu settled — and so it counts
 * every dish, including the ones the buy list hides behind their ingredients.
 * The overlap is real and intended: a dish can be both a thing to buy and a
 * thing to confirm.
 */
export function readiness() {
  const done = (arr, f) => ({ done: arr.filter(f).length, total: arr.length });
  return {
    buy: done(buyEntries(), e => e.got),
    run: done(state.runsheet, r => r.done),
    menu: done(state.menu, m => m.confirmed)
  };
}
