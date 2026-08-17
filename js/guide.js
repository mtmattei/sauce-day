// ============================================================================
//  The guide. A full-screen "find your way" sheet: every screen with what it
//  is for, and a task index for the person who knows what they want to do but
//  not where it lives. Opens from the ? in the masthead; opens itself once on
//  a device's first visit and never again.
//
//  It is its own DOM layer, outside the router — opening it must not disturb
//  the screen underneath, and closing it must put focus back where it was.
// ============================================================================
import { h } from "./ui.js";
import { icon } from "./icons.js";

// "I want to do X" → the screen that owns X. The verbs the crew actually
// arrives with, not the section names.
const TASKS = [
  ["Tick off something I bought", "#/buy", "Buy"],
  ["Log what I paid", "#/spend", "Spend"],
  ["See who owes whom", "#/spend", "Spend"],
  ["Find how many jars to buy", "#/sauce", "Sauce"],
  ["Add an item or change a budget", "#/ledger", "Ledger"],
  ["See whose gear is whose", "#/ledger", "Ledger"],
  ["Put my name on a dish", "#/menu", "Menu"],
  ["See the schedule for the day", "#/run", "Run"],
  ["Check the grappa record", "#/grappa", "Grappa"],
  ["Add a photograph", "#/photos", "Photos"],
  ["Look at past years", "#/history", "History"],
  ["Add someone to the crew", "#/crew", "Crew"]
];

const SEEN_KEY = "sauce:guide-seen";
let open = null;          // { el, restoreFocus }

function seen() {
  try { return !!localStorage.getItem(SEEN_KEY); } catch { return true; }
}
function markSeen() {
  try { localStorage.setItem(SEEN_KEY, "1"); } catch { /* private mode */ }
}

export function closeGuide() {
  if (!open) return;
  document.removeEventListener("keydown", onKey);
  open.el.remove();
  open.restoreFocus?.focus?.();
  open = null;
  markSeen();
}

function onKey(e) {
  if (e.key === "Escape") closeGuide();
}

/**
 * routes: the ROUTES array from app.js — hash, label, icon, desc, rail.
 * firstRun dresses the same sheet with one extra line telling the newcomer
 * where the ? lives, so the sheet can be dismissed without being lost.
 */
export function openGuide(routes, { firstRun = false } = {}) {
  if (open) return;
  const sections = routes.filter(r => r.desc);

  const go = hash => () => { closeGuide(); if (location.hash !== hash) location.hash = hash; };

  const screenRows = sections.map((r, i) => h("a", {
    class: "gd-row", href: r.hash, onClick: e => { e.preventDefault(); go(r.hash)(); }
  },
    h("span", { class: "gd-n" }, r.rail ? "··" : String(i + 1).padStart(2, "0")),
    h("span", { class: "gd-i" }, icon(r.icon)),
    h("span", { class: "gd-t" },
      h("b", {}, r.label),
      h("span", {}, r.desc)),
    h("span", { class: "gd-a", "aria-hidden": "true" }, "→")));

  const taskRows = TASKS.map(([task, hash, label]) => h("a", {
    class: "gd-task", href: hash, onClick: e => { e.preventDefault(); go(hash)(); }
  },
    h("span", {}, task),
    h("b", {}, label, h("i", { "aria-hidden": "true" }, " →"))));

  const close = h("button", { class: "gd-close", "aria-label": "Close the guide",
    onClick: closeGuide }, "×");

  const el = h("div", { class: "guide", role: "dialog", "aria-modal": "true",
    "aria-label": "Find your way",
    // clicking the dark margin around the sheet closes it; clicks inside do not
    onClick: e => { if (e.target === el) closeGuide(); } },
    h("div", { class: "gd-in" },
      h("header", { class: "gd-head" },
        h("div", {},
          h("b", {}, "Find your way"),
          h("span", { class: "gd-sub" }, "every screen, and what it is for")),
        close),
      firstRun ? h("p", { class: "gd-first" },
        "First time here? This sheet is the map. The ",
        h("b", {}, "?"), " in the top corner brings it back any time.") : null,
      h("div", { class: "gd-cols" },
        h("section", {},
          h("h3", {}, "The screens"),
          ...screenRows),
        h("section", {},
          h("h3", {}, "Where do I…"),
          ...taskRows))));

  open = { el, restoreFocus: document.activeElement };
  document.body.appendChild(el);
  document.addEventListener("keydown", onKey);
  close.focus();
}

/** Once per device: the first signed-in render opens the map unprompted. */
export function maybeFirstRun(routes) {
  if (seen()) return;
  openGuide(routes, { firstRun: true });
}
