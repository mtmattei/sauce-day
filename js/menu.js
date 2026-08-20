// ============================================================================
//  The phone's nav.
//
//  The graduated rule is a desk instrument: ten ticks want a metre of glass.
//  On a phone they were squeezed into a strip that scrolled sideways with no
//  edge to say so, so half the app sat off the side of the screen and the
//  section you wanted was one you could not see. Below 60rem the rule stands
//  down and this takes over: one control in the masthead that names the screen
//  you are on, and drops the whole list of them down underneath it.
//
//  Same layer discipline as the guide — opening it must not disturb the screen
//  underneath, and closing it must put focus back on the button that opened it.
// ============================================================================
import { h } from "./ui.js";
import { icon } from "./icons.js";

let open = null;          // { sheet, scrim, btn }

export const isMenuOpen = () => !!open;

export function closeMenu() {
  if (!open) return;
  const { sheet, scrim, btn } = open;
  open = null;
  document.removeEventListener("keydown", onKey);
  sheet.remove();
  scrim.remove();
  btn?.setAttribute("aria-expanded", "false");
  btn?.classList.remove("on");
  // only pull focus back if it is still inside the sheet — a tap that
  // navigated has already put it somewhere better
  if (!document.activeElement || document.activeElement === document.body) btn?.focus?.();
}

function onKey(e) {
  if (e.key === "Escape") { e.preventDefault(); closeMenu(); }
}

/**
 * routes: the ROUTES array from app.js — hash, label, icon, desc, rail.
 * btn:    the masthead button, so it can wear its own open state.
 *
 * The sheet hangs off .rule rather than off body: the masthead is sticky, and
 * a panel that is a child of it is pinned under it for free, however far down
 * the page has been scrolled.
 */
export function openMenu(routes, currentHash, btn) {
  if (open) return;
  const rule = document.querySelector(".rule");
  if (!rule) return;

  const go = hash => e => {
    e.preventDefault();
    closeMenu();
    if (location.hash !== hash) location.hash = hash;
  };

  // the numbered sections keep their number; the crew door is not a section of
  // the day, so it wears the guide's ·· and sits below the rule
  const sections = routes.filter(r => !r.rail);
  const rows = routes.map(r => {
    const i = sections.indexOf(r);
    return h("a", {
      class: "mrow" + (r.hash === currentHash ? " on" : "") + (r.rail ? " rail" : ""),
      href: r.hash, title: r.desc,
      "aria-current": r.hash === currentHash ? "page" : null,
      onClick: go(r.hash)
    },
      h("span", { class: "mn" }, i < 0 ? "··" : String(i + 1).padStart(2, "0")),
      h("span", { class: "mi" }, icon(r.icon)),
      h("span", { class: "ml" }, r.label));
  });

  const sheet = h("nav", { id: "menusheet", class: "msheet", "aria-label": "Sections" },
    h("div", { class: "msheet-in" }, ...rows));

  // a full-screen catcher under the sheet: tapping the page closes the menu,
  // and touch-action stops the page scrolling behind an open panel
  const scrim = h("div", { class: "mscrim", onClick: closeMenu });

  document.body.appendChild(scrim);
  rule.appendChild(sheet);
  open = { sheet, scrim, btn };
  btn?.setAttribute("aria-expanded", "true");
  btn?.classList.add("on");
  document.addEventListener("keydown", onKey);

  // one frame of the closed state first, so the drop has something to drop from
  requestAnimationFrame(() => sheet.classList.add("is-in"));
  (sheet.querySelector(".mrow.on") || sheet.querySelector(".mrow"))?.focus();
}

export function toggleMenu(routes, currentHash, btn) {
  if (open) closeMenu(); else openMenu(routes, currentHash, btn);
}

/**
 * A render can land while the menu is open — somebody else's edit arriving
 * over realtime, or the countdown ticking. Move the mark rather than closing
 * the sheet under the reader's thumb.
 */
export function syncMenu(currentHash) {
  if (!open) return;
  open.sheet.querySelectorAll(".mrow").forEach(a => {
    const on = a.getAttribute("href") === currentHash;
    a.classList.toggle("on", on);
    if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });
}
