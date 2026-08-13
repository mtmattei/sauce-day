// ============================================================================
//  Every screen. Each render function returns a DocumentFragment.
// ============================================================================
import { sb, state, YEAR, update, insert, remove, upsert, flash, signOut } from "./db.js";
import {
  CATS, money, money0, num, crewNames,
  settlement, yieldPlan, seriesData, grappaRecord, daysToGo
} from "./calc.js";
import { h, frag, field, select, check, personSelect, delButton, card, stat,
         sectionBar, empty, addRow, nextSort, me } from "./ui.js";
import { stackedBars, bars, line } from "./charts.js";
import { bottle, icon } from "./icons.js";
import { SHORTLIST, perLitre, shortlistVerdict } from "./grappas.js";
import { mountStack } from "./stack.js";
import { jarWall } from "./jars.js";

const SERIES_COLORS = ["var(--series-1)", "var(--series-2)", "var(--series-3)"];

// ============================================================ BUY LIST
export function viewBuy() {
  const items = state.items
    .filter(i => i.store || ["Need", "Buy", "Refill", "Costco"].includes(i.kind))
    .sort((a, b) => (a.store || "zzz").localeCompare(b.store || "zzz")
      || a.category.localeCompare(b.category)
      || a.sort_index - b.sort_index);

  const byStore = new Map();
  items.forEach(i => {
    const k = i.store || "No store yet";
    if (!byStore.has(k)) byStore.set(k, []);
    byStore.get(k).push(i);
  });

  const only = state.ui?.buyMine ? me() : null;
  const blocks = [];
  byStore.forEach((list, store) => {
    // assigned_to is free text — "Matt / David", "David (4) / Matt (2)" — so
    // "mine" is a substring test. Equality showed 2 of Matt's 14 items.
    const shown = only ? list.filter(i => i.assigned_to && i.assigned_to.includes(only)) : list;
    if (!shown.length) return;
    const total = shown.reduce((a, i) => a + (Number(i.budget) || 0), 0);
    const todo = shown.filter(i => !i.obtained);
    const got = shown.filter(i => i.obtained);
    blocks.push(h("div", { class: "store" },
      sectionBar(store),
      h("div", { class: "storemeta" },
        `${got.length} of ${shown.length} got · est. ${money(total)}`),
      ...todo.map(buyRow),
      ...foldDone("buy:" + store, got, "got", buyRow)));
  });

  const filter = h("div", { class: "btnrow" },
    h("button", { class: "btn" + (state.ui?.buyMine ? " primary" : ""), onClick: () => {
      state.ui = { ...(state.ui || {}), buyMine: !state.ui?.buyMine };
      render();
    } }, state.ui?.buyMine ? "Showing only mine" : "Show only mine"));

  return frag(
    card("Buy list", "Claim an item by putting your name on it, then tick it when you've got it. Everyone sees it instantly.",
      filter),
    ...blocks);
}

function buyRow(i) {
  // what has actually been paid against this item, as opposed to budgeted
  const paid = state.expenses
    .filter(e => e.item_id && String(e.item_id) === String(i.id))
    .reduce((a, e) => a + Number(e.amount || 0), 0);
  return h("div", { class: "row buy" + (i.obtained ? " got" : "") },
    check("items", i, "obtained"),
    h("div", { class: "rowmain" },
      h("div", { class: "rowtitle" }, i.name,
        i.link ? h("a", { href: i.link, target: "_blank", rel: "noopener", class: "link" }, "↗") : null),
      h("div", { class: "rowsub" },
        [i.qty ? "qty " + i.qty : null, i.kind, i.comments,
         paid ? "paid " + money(paid) : null].filter(Boolean).join(" · "))),
    h("div", { class: "rowend" },
      personSelect("items", i, "assigned_to"),
      field("items", i, "budget", { type: "number", class: "w80", placeholder: "$" })));
}

// ============================================================ LEDGER
export function viewLedger() {
  const cat = state.ui?.cat || "toolkit";
  const rows = state.items.filter(i => i.category === cat);
  const meta = CATS.find(c => c.key === cat);

  const tabs = h("div", { class: "subtabs" }, ...CATS.map(c =>
    h("button", { class: "subtab" + (c.key === cat ? " on" : ""), onClick: () => {
      state.ui = { ...(state.ui || {}), cat: c.key }; render();
    } }, c.short)));

  const total = rows.reduce((a, i) => a + (Number(i.budget) || 0), 0);
  const add = h("button", { class: "btn primary", onClick: () =>
    addRow("items", { category: cat, sort_index: nextSort(rows), name: "New item",
      kind: "Need", budget: 0 }, "Item added") }, "+ Add item");

  // toolkit rows carry a subcategory ("Cooking & Heat", "Jarring & Canning");
  // group under section bars where they do, stay flat where they don't
  const bySub = new Map();
  rows.forEach(i => {
    const k = i.subcategory || "";
    if (!bySub.has(k)) bySub.set(k, []);
    bySub.get(k).push(i);
  });
  const blocks = [];
  bySub.forEach((list, sub) => {
    blocks.push(h("div", { class: "store" },
      sub ? sectionBar(sub) : null,
      ...list.map(ledgerRow)));
  });

  return frag(
    card(meta.label, "Everything in this category, and what we plan to spend on it.",
      tabs,
      h("div", { class: "btnrow spread" },
        h("span", { class: "mono big" }, money(total) + " budgeted"), add)),
    ...blocks);
}

function ledgerRow(i) {
  const open = state.ui?.openItem === i.id;
  // Owned kit is locked: the mill and the cauldrons don't change between
  // Augusts, but a thumb on a phone changes them by accident. The lock is a
  // guard, not a wall — one tap opens it, and it closes itself next session.
  const unlocked = !!state.ui?.unlockedItems?.[i.id];
  const locked = !!i.locked && !unlocked;
  const toggleLock = () => {
    const u = { ...(state.ui?.unlockedItems || {}) };
    if (unlocked) delete u[i.id]; else u[i.id] = true;
    state.ui = { ...(state.ui || {}), unlockedItems: u,
                 openItem: unlocked && open ? null : state.ui?.openItem };
    render();
  };
  return h("div", { class: "row item" + (open ? " open" : "") + (locked ? " locked" : "") },
    check("items", i, "obtained"),
    h("div", { class: "rowmain", onClick: () => {
      if (locked) { flash("Owned kit is locked — tap the padlock to edit"); return; }
      state.ui = { ...(state.ui || {}), openItem: open ? null : i.id }; render();
    } },
      h("div", { class: "rowtitle" }, i.name),
      h("div", { class: "rowsub" },
        [i.kind, i.qty ? "qty " + i.qty : null, i.store, i.assigned_to].filter(Boolean).join(" · ")
        || "tap to edit")),
    h("div", { class: "rowend" },
      h("span", { class: "mono" }, money(i.budget)),
      i.locked ? h("button", {
        class: "icon lockbtn" + (unlocked ? " on" : ""),
        title: locked ? "Unlock to edit" : "Lock again",
        "aria-label": locked ? `Unlock ${i.name} for editing` : `Lock ${i.name}`,
        "aria-pressed": unlocked ? "true" : "false",
        onClick: toggleLock
      }, icon(locked ? "lock" : "lockopen")) : null),
    open ? h("div", { class: "editor" },
      lbl("Name", field("items", i, "name")),
      lbl("Need / owned", field("items", i, "kind")),
      lbl("Qty", field("items", i, "qty")),
      lbl("Budget", field("items", i, "budget", { type: "number" })),
      lbl("Assigned to", personSelect("items", i, "assigned_to")),
      lbl("Store", field("items", i, "store")),
      lbl("Use next year?", select("items", i, "repeat_next", ["Yes", "No", "Buy", "Refill", "Maybe"])),
      lbl("Link", field("items", i, "link", { placeholder: "https://" })),
      lbl("Notes", field("items", i, "comments")),
      // writes the DB column, so the lock is shared: lock it here and it is
      // locked on every phone. The padlock's unlock stays session-only.
      check("items", i, "locked", "Locked — guard this row from stray edits"),
      h("div", { class: "btnrow spread" },
        h("button", { class: "btn", onClick: () => {
          state.ui = { ...(state.ui || {}), openItem: null }; render();
        } }, "Close"),
        delButton("items", i, i.name))) : null);
}

const lbl = (text, ctrl) => h("label", { class: "fl" }, h("span", {}, text), ctrl);

/**
 * Completed rows fold shut. A list where the 32 things already handled sit
 * at full height above the 3 that still matter reads as 35 things to worry
 * about — the done rows collapse behind one line that says how many, and a
 * tap brings them back. Fold state lives in state.ui: session-only, gone on
 * reload, which is the right lifetime for "I just wanted to check one".
 */
function foldDone(key, doneRows, word, rowFn) {
  if (!doneRows.length) return [];
  const open = !!state.ui?.folds?.[key];
  const bar = h("button", { class: "foldbar" + (open ? " open" : ""), onClick: () => {
    const folds = { ...(state.ui?.folds || {}), [key]: !open };
    state.ui = { ...(state.ui || {}), folds };
    render();
  } },
    h("span", {}, `${doneRows.length} ${word}`),
    h("i", {}, open ? "hide" : "show"));
  return open ? [bar, ...doneRows.map(rowFn)] : [bar];
}

// ============================================================ SPEND
export function viewSpend() {
  const st = settlement();

  // The receipt is the moment you know both facts — that it is paid for and
  // that it is in the truck — so picking the item here does both jobs at once.
  const outstanding = state.items
    .filter(i => !i.obtained && (i.store || ["Need", "Buy", "Refill", "Costco"].includes(i.kind)))
    .sort((a, b) => (a.store || "zzz").localeCompare(b.store || "zzz")
      || a.name.localeCompare(b.name));

  const form = h("form", { class: "spendform", onSubmit: async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const amount = Number(f.get("amount"));
    if (!amount || amount <= 0) { flash("Put an amount in", true); return; }
    const itemId = f.get("item_id") || null;
    await insert("expenses", {
      category: f.get("category"), paid_by: f.get("paid_by"),
      amount, label: f.get("label") || null, item_id: itemId,
      spent_on: f.get("spent_on") || new Date().toISOString().slice(0, 10),
      created_by: state.session?.user?.email || null
    });
    // one action, both books: the receipt is logged and the item is ticked off
    if (itemId) await update("items", itemId, { obtained: true });
    e.target.reset();
    e.target.querySelector('[name=paid_by]').value = me() || "";
    flash(itemId ? "Logged " + money(amount) + " and ticked it off"
                 : "Logged " + money(amount));
  } },
    lbl("Who paid", h("select", { name: "paid_by", class: "f", required: true },
      ...crewNames().map(n => h("option", { value: n, selected: n === me() }, n)))),
    lbl("What did it pay for", h("select", { name: "item_id", class: "f", onChange: e => {
      const it = outstanding.find(x => String(x.id) === e.target.value);
      if (!it) return;
      // the category follows the item; the amount does not — items.budget is an
      // estimate and logging an estimate as a receipt is how a split goes wrong
      const fm = e.target.form;
      fm.querySelector("[name=category]").value = it.category;
      if (!fm.querySelector("[name=label]").value) {
        fm.querySelector("[name=label]").value = it.name;
      }
    } },
      h("option", { value: "" }, "— nothing on the buy list —"),
      ...outstanding.map(i => h("option", { value: i.id },
        `${i.store ? i.store + " · " : ""}${i.name}${i.budget ? " · est. " + money(i.budget) : ""}`)))),
    lbl("Category", h("select", { name: "category", class: "f" },
      ...CATS.map(c => h("option", { value: c.key }, c.label)))),
    lbl("Amount", h("input", { name: "amount", class: "f", type: "number", step: "0.01",
      inputmode: "decimal", placeholder: "0.00", required: true })),
    lbl("What for", h("input", { name: "label", class: "f", placeholder: "e.g. 7 bushels at the market" })),
    lbl("Date", h("input", { name: "spent_on", class: "f", type: "date",
      value: new Date().toISOString().slice(0, 10) })),
    h("button", { class: "btn primary wide", type: "submit" }, "Log it"));

  // No Share column: an even split means it is the same number in every row,
  // so it was five identical cells. It is stated once in the card subtitle.
  const netRows = st.net.map(p => h("tr", { class: p.name === me() ? "mine" : "" },
    h("td", {}, p.name), h("td", {}, money(p.paid)),
    h("td", { class: p.net >= 0 ? "good" : "warn" },
      (p.net >= 0 ? "gets back " : "owes ") + money(Math.abs(p.net)))));

  const transfers = st.transfers.length
    ? h("ul", { class: "transfers" }, ...st.transfers.map(t =>
        h("li", {}, h("b", {}, t.from), " pays ", h("b", {}, t.to), " ",
          h("span", { class: "mono big" }, money(t.amount)))))
    : empty("Nothing to settle yet — nobody has logged a payment.");

  const log = state.expenses.length
    ? state.expenses.map(e => h("div", { class: "row exp" },
        h("div", { class: "rowmain" },
          h("div", { class: "rowtitle" }, e.label || CATS.find(c => c.key === e.category)?.label),
          h("div", { class: "rowsub" },
            [e.paid_by, CATS.find(c => c.key === e.category)?.short, e.spent_on,
             e.item_id ? "ticked off " + (state.items.find(i => String(i.id) === String(e.item_id))?.name || "an item") : null
            ].filter(Boolean).join(" · "))),
        h("div", { class: "rowend" }, h("span", { class: "mono" }, money(e.amount)),
          e.paid_by === me() || state.me?.is_admin ? delButton("expenses", e, e.label || "this expense") : null)))
    : [empty("No receipts logged yet.")];

  return frag(
    card("Log what you paid", "Only your own receipts. The split updates for everyone the moment you hit the button.", form),
    card("The split", `${money(st.total)} in, split ${st.net.length} ways — ${money(st.share)} each`,
      h("table", { class: "grid" },
        h("thead", {}, h("tr", {}, h("th", {}, "Person"), h("th", {}, "Paid"),
          h("th", {}, "Standing"))),
        h("tbody", {}, ...netRows))),
    card("Who pays whom", "Settle up at the end of the night.", transfers),
    card("Receipts", state.expenses.length + " logged", ...log));
}

// ============================================================ SAUCE (yield)
export function viewSauce() {
  const y = yieldPlan(), s = state.settings || {};
  const setField = (col, label, step) => lbl(label,
    field("app_settings", s, col, { type: "number", step: step || "0.01", idCol: "year" }));

  // The crew buys the lot together, so bushels are one number, not a roster.
  // calc.js sums every row in the table, so a single canonical row is all it
  // takes — no schema change, and the cascade below is unaffected.
  const crewBushels = state.bushels.find(b => b.person === "Crew") || state.bushels[0] || null;
  const strays = state.bushels.filter(b => b !== crewBushels && Number(b.count) > 0);

  const bushelField = crewBushels
    ? lbl("Bushels bought", field("bushels", crewBushels, "count", { type: "number", step: "0.5" }))
    : lbl("Bushels bought", h("button", { class: "btn", onClick: () =>
        upsert("bushels", { person: "Crew", count: 7 }, "year,person") }, "Set the count"));

  const inputs = card("The forecast", "Change any of these and everything below recalculates.",
    h("div", { class: "fgrid" },
      bushelField,
      setField("litres_per_bushel", "Litres per bushel", "0.1"),
      setField("buffer_pct", "Spare-jar buffer (0.10 = 10%)", "0.01"),
      setField("price_per_bushel", "Price per bushel", "0.01")),
    // if older per-person rows are still around, say so rather than quietly
    // folding them into a total nobody can see
    strays.length ? h("p", { class: "note" },
      `Also counted: ${strays.map(s => `${s.person} ${s.count}`).join(", ")}. ` +
      `Zero these out on the old rows if they are no longer separate.`) : null,
    // Was a row of four tiles. Two of them only ever restated something already
    // on screen: Bushels is the field directly above, and Jars required is the
    // Required row of the buy table below. The other two are the only place
    // litres and the tomato spend appear at all, so they stay — as one line.
    h("div", { class: "bigline" },
      "Forecast ", h("b", {}, num(y.litres, 1) + " L"),
      h("span", { class: "sep" }, "tomatoes"), h("b", {}, money0(y.bushelBudget))),
    h("p", { class: "note" },
      "Your 2025 sheet carried a low/mid/high of 10 / 14 / 18 litres per bushel, and a separate two-year " +
      "average of 9.9. 14 is the midpoint. Tomatoes vary — buy a few spare jars."));

  const jarRows = state.jars.sort((a, b) => a.person.localeCompare(b.person)).map(j =>
    h("div", { class: "row tight" },
      h("div", { class: "rowmain" }, h("div", { class: "rowtitle" }, j.person),
        h("div", { class: "rowsub" }, "jars · bands · lids")),
      h("div", { class: "rowend" },
        field("jar_inventory", j, "jars", { type: "number", step: "1", class: "w60" }),
        field("jar_inventory", j, "bands", { type: "number", step: "1", class: "w60" }),
        field("jar_inventory", j, "lids", { type: "number", step: "1", class: "w60" }))));

  const buyPlan = h("table", { class: "grid" },
    h("thead", {}, h("tr", {}, h("th", {}, ""), h("th", {}, "Jars"), h("th", {}, "Bands"), h("th", {}, "Lids"))),
    h("tbody", {},
      trio("Required", y.jarsRequired, y.jarsRequired, y.jarsRequired),
      trio("On hand", y.onHand.jars, y.onHand.bands, y.onHand.lids),
      trio("Comes with jar packs", "—", y.jarPacks * 12, y.jarPacks * 12),
      trio("Comes with band packs", "—", "—", y.bandPacks * 12),
      trio("Still to buy", y.jarsToBuy, y.bandsToBuy, y.lidsToBuy),
      trio("Packs (dozens)", y.jarPacks, y.bandPacks, y.lidPacks),
      trio("Cost", money(y.jarPacks * (s.jar_price || 0)),
           money(y.bandPacks * (s.band_price || 0)),
           money(y.lidPacks * (s.lid_price || 0)), true)));

  const prices = h("div", { class: "fgrid" },
    setField("jar_price", "Jars per dozen"),
    setField("band_price", "Bands per dozen"),
    setField("lid_price", "Lids per dozen"));

  const push = h("button", { class: "btn primary", onClick: async () => {
    const find = n => state.items.find(i => i.name === n);
    const jobs = [
      [find("Bushels of tomatoes"), y.bushelBudget],
      [find("Mason jars"), y.jarPacks * (Number(s.jar_price) || 0)],
      [find("Lids"), y.bandPacks * (Number(s.band_price) || 0) + y.lidPacks * (Number(s.lid_price) || 0)]
    ].filter(([it]) => it);
    for (const [it, amount] of jobs) await update("items", it.id, { budget: Number(amount.toFixed(2)) });
    flash("Budgets pushed to the ledger");
  } }, "Push these numbers to the ledger");

  return frag(
    inputs,
    card("Jars, bands and lids on hand", "Recount before the day — these carry over from last year.",
      // the wall: what the plan calls for, drawn a pack to a row
      h("div", { class: "jarwallwrap" },
        jarWall({ total: y.jarsRequired, full: y.onHand.jars }),
        h("p", { class: "note" },
          y.jarsRequired
            ? `${y.onHand.jars} of ${y.jarsRequired} on hand — a row is a pack of 12`
            : "Set the bushel count above and the wall draws itself.")),
      ...jarRows),
    card("What to buy", "Jar packs ship with bands and lids, so the maths cascades.",
      buyPlan, prices,
      h("div", { class: "bigline" }, "Total jar kit cost ", h("b", {}, money(y.cost))),
      h("div", { class: "btnrow" }, push),
      h("p", { class: "note" },
        "This writes the bushel budget and the jar/band/lid cost onto the Bushels of tomatoes, " +
        "Mason jars and Lids lines in the ledger, so the buy list and the budget agree.")));
}

const trio = (label, a, b, c, bold) => h("tr", { class: bold ? "tot" : "" },
  h("td", {}, label), h("td", {}, String(a)), h("td", {}, String(b)), h("td", {}, String(c)));

// ============================================================ MENU
export function viewMenu() {
  const groups = new Map();
  state.menu.forEach(m => {
    if (!groups.has(m.service)) groups.set(m.service, []);
    groups.get(m.service).push(m);
  });
  const blocks = [];
  groups.forEach((list, service) => {
    const todo = list.filter(m => !m.confirmed);
    const donel = list.filter(m => m.confirmed);
    blocks.push(h("div", { class: "store" }, sectionBar(service),
      ...todo.map(menuRow),
      ...foldDone("menu:" + service, donel, "confirmed", menuRow)));
  });
  const add = h("form", { class: "inline", onSubmit: async e => {
    e.preventDefault();
    const f = new FormData(e.target);
    if (!f.get("dish").trim()) return;
    await addRow("menu", { sort_index: nextSort(state.menu), service: f.get("service"),
      dish: f.get("dish").trim(), who: me() });
    e.target.reset();
  } },
    // the services come from the data itself, so Antipasto and Dessert exist
    // the moment a row does — a hardcoded list here went stale once already
    h("select", { name: "service", class: "f" },
      ...([...new Set(state.menu.map(m => m.service))].length
        ? [...new Set(state.menu.map(m => m.service))]
        : ["Breakfast", "Antipasto", "Lunch", "Dinner", "Dessert", "Drinks"])
        .map(s => h("option", {}, s))),
    h("input", { name: "dish", class: "f grow", placeholder: "Add a dish or a drink" }),
    h("button", { class: "btn primary", type: "submit" }, "Add"));

  return frag(card("Menu", "Put your name on what you're bringing, then confirm it once it's actually bought or made.", add), ...blocks);
}

function menuRow(m) {
  const open = state.ui?.openMenu === m.id;
  return h("div", { class: "row item" + (m.confirmed ? " got" : "") + (open ? " open" : "") },
    check("menu", m, "confirmed"),
    h("div", { class: "rowmain", onClick: () => {
      state.ui = { ...(state.ui || {}), openMenu: open ? null : m.id }; render();
    } },
      h("div", { class: "rowtitle" }, m.dish),
      h("div", { class: "rowsub" }, [m.source, m.qty ? "qty " + m.qty : null, m.notes].filter(Boolean).join(" · ") || "tap to edit")),
    h("div", { class: "rowend" }, personSelect("menu", m, "who")),
    open ? h("div", { class: "editor" },
      lbl("Dish", field("menu", m, "dish")),
      lbl("Source", field("menu", m, "source")),
      lbl("Qty", field("menu", m, "qty")),
      lbl("Notes", field("menu", m, "notes")),
      h("div", { class: "btnrow spread" },
        h("button", { class: "btn", onClick: () => {
          state.ui = { ...(state.ui || {}), openMenu: null }; render();
        } }, "Close"), delButton("menu", m, m.dish))) : null);
}

// ============================================================ RUN SHEET
export function viewRun() {
  const groups = new Map();
  state.runsheet.forEach(r => {
    if (!groups.has(r.section)) groups.set(r.section, []);
    groups.get(r.section).push(r);
  });
  const blocks = [];
  groups.forEach((list, section) => {
    const todo = list.filter(r => !r.done);
    const donel = list.filter(r => r.done);
    // the run sheet keeps its order sacred on the day itself — done steps fold
    // only while the day is still ahead, because during the day the sequence
    // (step 12 after step 11) is the whole reading
    const foldable = (daysToGo() ?? 99) > 1;
    blocks.push(h("div", { class: "store" },
      sectionBar(section),
      h("div", { class: "storemeta" }, `${donel.length} of ${list.length} done`),
      ...(foldable
        ? [...todo.map(runRow), ...foldDone("run:" + section, donel, "done", runRow)]
        : list.map(runRow))));
  });
  return frag(
    card("Run sheet", "The order the day happens in. Tick each step as it happens — everyone's phone updates."),
    ...blocks);
}

function runRow(r) {
  const open = state.ui?.openRun === r.id;
  return h("div", { class: "row item" + (r.done ? " got" : "") + (open ? " open" : "") },
    check("runsheet", r, "done"),
    h("div", { class: "rowmain", onClick: () => {
      state.ui = { ...(state.ui || {}), openRun: open ? null : r.id }; render();
    } },
      h("div", { class: "rowtitle" }, h("span", { class: "time" }, r.time_label || ""), " ", r.activity),
      h("div", { class: "rowsub" }, [r.equipment, r.notes].filter(Boolean).join(" · "))),
    h("div", { class: "rowend" }, personSelect("runsheet", r, "lead")),
    open ? h("div", { class: "editor" },
      lbl("Time", field("runsheet", r, "time_label")),
      lbl("Activity", field("runsheet", r, "activity")),
      lbl("Crew", field("runsheet", r, "crew")),
      lbl("Equipment", field("runsheet", r, "equipment")),
      lbl("Notes", field("runsheet", r, "notes")),
      h("div", { class: "btnrow spread" },
        h("button", { class: "btn", onClick: () => {
          state.ui = { ...(state.ui || {}), openRun: null }; render();
        } }, "Close"), delButton("runsheet", r, r.activity))) : null);
}

// ============================================================ GRAPPA
export function viewGrappa() {
  const record = grappaRecord();
  const rows = [...state.grappa].sort((a, b) => a.year - b.year);
  const thisYear = rows.find(g => g.year === YEAR);
  const beat = thisYear?.price ? (Number(thisYear.price) > record ? "YES" : "No") : "Not bought yet";

  const hall = rows.map(g => {
    const prior = rows.filter(x => x.year < g.year).map(x => Number(x.price) || 0);
    const best = prior.length ? Math.max(...prior) : 0;
    const verdict = g.price == null ? "—" : Number(g.price) === 0 ? "none bought"
      : !prior.length ? "first bottle" : Number(g.price) > best ? "beat it" : "fell short";
    return h("tr", { class: g.year === YEAR ? "mine" : "" },
      h("td", {}, String(g.year)),
      h("td", {}, g.bottle || (g.year === YEAR ? "—" : "not recorded")),
      h("td", {}, g.price == null ? "—" : money(g.price)),
      h("td", {}, g.rating ? g.rating + "/10" : "—"),
      h("td", { class: verdict === "beat it" ? "good" : verdict === "fell short" ? "warn" : "" }, verdict));
  });

  const editor = thisYear ? card("This year's bottle", "Fill this in when David gets back from the SAQ.",
    h("div", { class: "fgrid" },
      lbl("Bottle", field("grappa", thisYear, "bottle", { idCol: "year" })),
      lbl("Producer", field("grappa", thisYear, "producer", { idCol: "year" })),
      lbl("Region", field("grappa", thisYear, "region", { idCol: "year" })),
      lbl("Price", field("grappa", thisYear, "price", { type: "number", idCol: "year" })),
      lbl("Bought by", select("grappa", thisYear, "bought_by", crewNames(), { idCol: "year" })),
      lbl("Rating /10", field("grappa", thisYear, "rating", { type: "number", step: "0.5", idCol: "year" }))),
    lbl("Notes", field("grappa", thisYear, "notes", { idCol: "year" }))) : null;

  // ---- the shelf: every year standing on one line, height scaled to price
  const maxPrice = Math.max(...rows.map(g => Number(g.price) || 0), 1);
  const MIN = 34, MAX = 150;
  const hOf = f => Math.round(MIN + (MAX - MIN) * f);
  const recordH = record ? hOf(record / maxPrice) : 0;

  const shelf = h("div", { class: "shelfwrap" },
    h("div", { class: "shelf" },
      recordH ? h("div", { class: "datum", style: `bottom:${recordH}px` },
        h("b", {}, `${money0(record)} · the line to clear`)) : null,
      ...rows.map((g, i) => {
        const price = Number(g.price) || 0;
        const isNow = g.year === YEAR;
        const isRec = price === record && price > 0 && !isNow;
        const cls = isNow ? "now" : isRec ? "is-rec" : price ? "" : "gone";
        return h("div", { class: "slot " + cls },
          bottle(price / maxPrice, i, {
            min: MIN, max: MAX, empty: !price,
            label: `${g.year} — ${price ? money(price) : "no bottle"}`
          }),
          h("span", { class: "yr" }, String(g.year)),
          h("span", { class: "pr" },
            g.price == null ? "no record" : price === 0 ? "none" : money0(price)));
      })));

  // ---- the shortlist: real bottles, real photographs, measured against the record
  const sv = shortlistVerdict(record);
  const cards = SHORTLIST
    .slice().sort((a, b) => b.price - a.price)
    .map(g => {
      const clears = g.price > record;
      return h("div", { class: "bottlecard" + (clears ? " clears" : "") },
        // No loading="lazy" here. These <img>s are built detached and inserted
        // by a full innerHTML swap; Chrome then never registers them with the
        // intersection observer, so they sit at currentSrc="" forever even when
        // fully on screen. Five images on one screen — eager is correct anyway.
        h("div", { class: "shot" },
          h("img", { src: g.photo, alt: `${g.range} ${g.name}`, decoding: "async" })),
        h("div", { class: "bmeta" },
          h("div", { class: "bprice" }, money(g.price)),
          h("div", { class: "bname" }, g.name),
          h("div", { class: "brange" }, `${g.range} · ${g.size} · ${g.abv}%`),
          h("div", { class: "bsub" }, `${g.producer} — ${g.region}`),
          h("div", { class: "bverdict" + (clears ? " good" : " warn") },
            clears ? `clears the record by ${money(g.price - record)}`
                   : `${money(record - g.price)} short of the record`),
          h("div", { class: "bsub" }, `${money(perLitre(g))} per litre`),
          g.note ? h("p", { class: "bnote" }, g.note) : null,
          h("a", { class: "btn", href: g.url, target: "_blank", rel: "noopener" }, "SAQ ↗")));
    });

  const shortlist = card("The shortlist",
    `${sv.count} bottles in the running. Prices read off the SAQ on 5 August 2026 — check before anyone drives out.`,
    h("p", { class: sv.anyClears ? "note" : "bigline" },
      sv.anyClears
        ? `${sv.clears.length} of ${sv.count} clear ${money0(record)}.`
        : [`Not one of these beats ${money0(record)}. `,
           h("b", {}, money(sv.gap)),
           ` short at best — the Torcolato.`]),
    h("div", { class: "bottles" }, ...cards));

  return frag(
    h("div", { class: "tiles" },
      stat("Record to beat", money0(record), "set in " + (rows.find(g => Number(g.price) === record)?.year || "—")),
      stat("This year", thisYear?.price ? money0(thisYear.price) : "—", "the bottle so far"),
      stat("Verdict", beat, "the only rule", beat === "YES" ? "good" : beat === "No" ? "warn" : ""),
      stat("Shortlist best", money0(sv.best.price), sv.anyClears ? "clears it" : "still short",
        sv.anyClears ? "good" : "warn"),
      stat("All time", money0(rows.reduce((a, g) => a + (Number(g.price) || 0), 0)), "spent on grappa")),
    card("The shelf", "Every bottle since 2020, drawn to the height of what it cost. The dashed line is the record.",
      shelf,
      h("p", { class: "note" },
        "A dashed outline is a year with no bottle at all, which is not the same as a cheap one.")),
    shortlist,
    editor,
    card("The hall of fame", "Only prices survive from the old sheets — the bottle names were never written down.",
      h("table", { class: "grid" },
        h("thead", {}, h("tr", {}, h("th", {}, "Year"), h("th", {}, "Bottle"),
          h("th", {}, "Price"), h("th", {}, "Rating"), h("th", {}, "Verdict"))),
        h("tbody", {}, ...hall))));
}

// ============================================================ PHOTOBOOK
let liveStack = null;

export function viewPhotos() {
  // tear down any stack from the previous render — it holds a resize listener
  if (liveStack) { liveStack.destroy(); liveStack = null; }

  const photos = [...state.photos].sort((a, b) =>
    (b.year - a.year) || ((a.sort_index || 0) - (b.sort_index || 0)));

  const years = [...new Set(photos.map(p => p.year))].sort((a, b) => b - a);
  const filter = state.ui?.photoYear ?? null;
  const shown = filter ? photos.filter(p => p.year === filter) : photos;

  const yearTabs = years.length > 1 ? h("div", { class: "subtabs" },
    h("button", { class: "subtab" + (filter === null ? " on" : ""), onClick: () => {
      state.ui = { ...(state.ui || {}), photoYear: null }; render();
    } }, `All · ${photos.length}`),
    ...years.map(y => h("button", {
      class: "subtab" + (filter === y ? " on" : ""),
      onClick: () => { state.ui = { ...(state.ui || {}), photoYear: y }; render(); }
    }, `${y} · ${photos.filter(p => p.year === y).length}`))) : null;

  // the stack itself
  const host = h("div", { class: "stackhost" });
  if (shown.length) {
    queueMicrotask(() => {
      liveStack = mountStack(host, shown.map(p => ({
        url: p.url, caption: p.caption || "", year: p.year
      })));
    });
  } else {
    host.appendChild(h("div", { class: "pempty" },
      h("div", { class: "pemptyframe" }),
      h("p", {}, "Nothing in the book yet."),
      h("p", { class: "note" },
        "Add the first one below. Paste any image link — a Supabase Storage URL, " +
        "a Dropbox or Drive direct link. It shows up on everyone's phone at once.")));
  }

  const addForm = h("form", { class: "spendform", onSubmit: async e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const url = (f.get("url") || "").trim();
    if (!url) { flash("Needs an image link", true); return; }
    await insert("photos", {
      year: Number(f.get("year")) || YEAR,
      url,
      caption: (f.get("caption") || "").trim() || null,
      taken_by: me(),
      sort_index: nextSort(state.photos)
    });
    e.target.reset();
    e.target.querySelector('[name=year]').value = String(YEAR);
    flash("Added to the book");
  } },
    lbl("Image link", h("input", { name: "url", class: "f", type: "url",
      placeholder: "https://…", required: true })),
    lbl("Caption", h("input", { name: "caption", class: "f",
      placeholder: "e.g. the first cauldron on" })),
    lbl("Year", h("input", { name: "year", class: "f", type: "number",
      step: "1", value: String(YEAR) })),
    h("button", { class: "btn primary wide", type: "submit" }, "Add photograph"));

  const list = shown.length ? shown.map(p => h("div", { class: "row tight" },
    h("div", { class: "rowmain" },
      h("div", { class: "rowtitle" }, p.caption || "Untitled"),
      h("div", { class: "rowsub" },
        [p.year, p.taken_by ? "by " + p.taken_by : null].filter(Boolean).join(" · "))),
    h("div", { class: "rowend" },
      p.taken_by === me() || state.me?.is_admin
        ? delButton("photos", p, p.caption || "this photograph") : null)))
    : [];

  return frag(
    card("Photobook",
      shown.length
        ? "Drag a print off the top, tap it, or use the arrow keys."
        : "One stack, newest first.",
      yearTabs, host),
    card("Add to the book",
      "Anything the browser can load. The stack picks it up straight away.", addForm),
    shown.length ? card("Everything in the book", `${shown.length} photograph${shown.length === 1 ? "" : "s"}`, ...list) : null);
}

// ============================================================ HISTORY
export function viewHistory() {
  const rows = seriesData();
  const years = rows.map(r => r.year);
  const totals = rows.map(r => r.total);
  const series = CATS.map((c, i) => ({
    name: c.label, color: SERIES_COLORS[i],
    values: rows.map(r => r[c.key] ?? 0)
  }));

  const charts = [
    ["Where the money goes", "Total spend split three ways, per year.", host => stackedBars(host, years, series, totals, money0)],
    ["Total spend, by year", "Every year we have a record for.", host => line(host, years, totals, money0, money0, "Total")],
    ["Cost per man", "Even split, so this is what each of you actually pays.", host => line(host, years, rows.map(r => r.perMan), money0, money0, "Per man")],
    ["The grappa escalation", "The bottle has to beat last year.", host => bars(host, years, rows.map(r => r.grappa), money0, money0, "Grappa")],
    ["Spend mix", "The same money as a share of the year.", host => stackedBars(host, years, series, totals, money0, true)],
    ["Litres yielded", "Only the first two years were ever written down.", host => bars(host, years, rows.map(r => r.litres), v => num(v) + " L", v => num(v), "Yield")]
  ].map(([title, sub, draw]) => {
    const host = h("div", { class: "chart" });
    const c = card(title, sub, host);
    queueMicrotask(() => draw(host));
    return c;
  });

  const table = h("table", { class: "grid wide" },
    h("thead", {}, h("tr", {}, h("th", {}, "Year"), h("th", {}, "Toolkit"), h("th", {}, "Ingredients"),
      h("th", {}, "Food"), h("th", {}, "Total"), h("th", {}, "Per man"),
      h("th", {}, "Litres"), h("th", {}, "Jars"), h("th", {}, "Broken"), h("th", {}, "Grappa"))),
    h("tbody", {}, ...rows.map(r => {
      const past = state.history.find(x => x.year === r.year);
      const cell = (v, f) => v == null ? "—" : f(v);
      const editable = (col, step) => past
        ? field("history", past, col, { type: "number", step: step || "1", idCol: "year", class: "w60" })
        : "—";
      return h("tr", { class: r.live ? "mine" : "" },
        h("td", {}, String(r.year) + (r.live ? " · live" : "")),
        h("td", {}, cell(r.toolkit, money)), h("td", {}, cell(r.ingredients, money)),
        h("td", {}, cell(r.food, money)), h("td", {}, cell(r.total, money)),
        h("td", {}, cell(r.perMan, money)),
        h("td", {}, editable("litres", "0.1")), h("td", {}, editable("jars_filled")),
        h("td", {}, editable("fallen_soldiers")), h("td", {}, cell(r.grappa, money)));
    })));

  const closeout = h("button", { class: "btn primary", onClick: async () => {
    const live = rows.find(r => r.live);
    if (!confirm(`Write ${YEAR} into the permanent record? You can still edit the numbers afterwards.`)) return;
    const g = state.grappa.find(x => x.year === YEAR);
    const y = yieldPlan();
    const { error } = await sb.from("history").upsert({
      year: YEAR, edition: state.settings?.edition, sauce_date: state.settings?.sauce_date,
      toolkit: live.toolkit || 0, ingredients: live.ingredients || 0, food: live.food || 0,
      crew_size: state.members.length, bushels: y.bushels, grappa: g?.price ?? null,
      notes: "Closed out from the app."
    }, { onConflict: "year" });
    if (error) flash(error.message, true);
    else { flash("Year closed out"); location.reload(); }
  } }, `Close out ${YEAR}`);

  return frag(
    card("The record", "Blank cells are years nobody wrote the number down. Type into the litres, jars and broken columns to fill them in.",
      h("div", { class: "scroll" }, table),
      h("div", { class: "btnrow" }, closeout),
      h("p", { class: "note" },
        "Close-out copies this year's live totals into the permanent record. Do it after settling up.")),
    ...charts);
}

// ============================================================ CREW
export function viewCrew() {
  const admin = !!state.me?.is_admin;
  const rows = state.members.map(m => h("div", { class: "row tight" },
    h("div", { class: "rowmain" },
      h("div", { class: "rowtitle" }, m.display_name, m.is_admin ? h("span", { class: "pill" }, "admin") : null),
      h("div", { class: "rowsub" }, m.email)),
    admin ? h("div", { class: "rowend" },
      field("members", m, "email", { idCol: "email", class: "w200", placeholder: "email" }),
      delButton("members", m, m.display_name)) : null));

  const add = admin ? h("form", { class: "inline", onSubmit: async e => {
    e.preventDefault();
    const f = new FormData(e.target);
    await addRow("members", { email: f.get("email").trim().toLowerCase(),
      display_name: f.get("name").trim(), sort_index: state.members.length + 1 }, "Added to the crew");
    e.target.reset();
  } },
    h("input", { name: "name", class: "f", placeholder: "Name", required: true }),
    h("input", { name: "email", class: "f grow", type: "email", placeholder: "email", required: true }),
    h("button", { class: "btn primary", type: "submit" }, "Add")) : null;

  return frag(
    card("The crew", admin
      ? "Only these email addresses can open the site. Change one and that person is in — or out."
      : "Only Matt can change this list.",
      ...rows, add),
    card("You", null,
      h("p", {}, "Signed in as ", h("b", {}, state.session?.user?.email || "—"),
        state.me ? ` — you are ${state.me.display_name} on the sheet.` : ""),
      h("button", { class: "btn", onClick: signOut }, "Sign out")));
}

// re-render hook, set by app.js
export let render = () => {};
export function setRender(fn) { render = fn; }
