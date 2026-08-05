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

export function daysToGo() {
  const d = state.settings?.sauce_date;
  if (!d) return null;
  const target = new Date(d + "T00:00:00");
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((target - today) / 86400000));
}

export function readiness() {
  const done = (arr, f) => ({ done: arr.filter(f).length, total: arr.length });
  return {
    buy: done(state.items.filter(i => i.store || i.kind === "Need" || i.kind === "Buy" || i.kind === "Refill"),
              i => i.obtained),
    run: done(state.runsheet, r => r.done),
    menu: done(state.menu, m => m.confirmed)
  };
}
