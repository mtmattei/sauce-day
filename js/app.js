// ============================================================================
//  Boot, sign-in gate, router.
// ============================================================================
import { state, DEMO, YEAR, loadAll, startRealtime, onChange, currentSession,
         sendCode, verifyCode, signInWithPassword, sb, flash } from "./db.js";
import { h, me } from "./ui.js";
import { icon } from "./icons.js";
import { money0, settlement, yieldPlan, grappaRecord, daysToGo, readiness } from "./calc.js";
import { viewSauceDay, stopTimeline } from "./timeline.js";
import * as V from "./views.js";

const ROUTES = [
  { hash: "#/",        label: "Sauce Day", icon: "check", view: viewSauceDay },
  { hash: "#/buy",     label: "Buy",     icon: "list",   view: V.viewBuy },
  { hash: "#/spend",   label: "Spend",   icon: "split",  view: V.viewSpend },
  { hash: "#/sauce",   label: "Sauce",   icon: "jar",    view: V.viewSauce },
  { hash: "#/menu",    label: "Menu",    icon: "fork",   view: V.viewMenu },
  { hash: "#/run",     label: "Run",     icon: "clock",  view: V.viewRun },
  { hash: "#/ledger",  label: "Ledger",  icon: "rows",   view: V.viewLedger },
  { hash: "#/grappa",  label: "Grappa",  icon: "bottle", view: V.viewGrappa },
  { hash: "#/photos",  label: "Photos",  icon: "plates", view: V.viewPhotos },
  { hash: "#/history", label: "History", icon: "bars",   view: V.viewHistory },
  // rail: not a section of the day, so it keeps its route but gives up its tick
  // on the graduated rule and lives at the foot of the readout instead.
  { hash: "#/crew",    label: "Crew",    icon: "crew",   view: V.viewCrew, rail: true }
];

const SECTIONS = ROUTES.filter(r => !r.rail);

const app = () => document.getElementById("app");
const nav = () => document.getElementById("nav");

function currentRoute() {
  return ROUTES.find(r => r.hash === (location.hash || "#/")) || ROUTES[0];
}

function renderNav() {
  const r = currentRoute();
  nav().innerHTML = "";
  SECTIONS.forEach((x, i) => nav().appendChild(
    h("a", { href: x.hash, class: "navlink" + (x === r ? " on" : ""),
             "aria-current": x === r ? "page" : null },
      h("span", { class: "ni" }),
      h("span", { class: "nn" }, String(i + 1).padStart(2, "0")),
      h("span", { class: "nl" }, icon(x.icon), x.label))));
  const on = nav().querySelector(".navlink.on");
  if (on) on.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  wireRipple(nav());
}

/**
 * The ripple down the rule. Each link is told how many sections it sits from
 * the one under the pointer; the stylesheet turns that distance into both the
 * size of the lift and the delay before it happens, so the wave travels.
 */
function wireRipple(host) {
  const links = [...host.querySelectorAll(".navlink")];
  links.forEach((link, i) => link.addEventListener("pointerenter", () => {
    host.classList.add("rip");
    links.forEach((other, j) => other.style.setProperty("--rd", Math.abs(j - i)));
  }));
  host.addEventListener("pointerleave", () => {
    host.classList.remove("rip");
    links.forEach(l => l.style.removeProperty("--rd"));
  });
}

// Sauce day starts at seven. The date comes from settings so it follows
// whatever the crew set; only the hour is fixed here.
const START_HOUR = 7;
let countdownTimer = null;

function sauceStart() {
  const d = state.settings?.sauce_date;
  if (!d) return null;
  const t = new Date(d + "T00:00:00");
  t.setHours(START_HOUR, 0, 0, 0);
  return t;
}

/** Hours and minutes to the first pot, or null when there is no date yet. */
function toGo() {
  const t = sauceStart();
  if (!t) return null;
  const ms = t - new Date();
  if (ms <= 0) return { past: true, at: t };
  const mins = Math.floor(ms / 60000);
  return { hours: Math.floor(mins / 60), mins: mins % 60, at: t };
}

const toGoValue = c =>
  c.past ? "under way" : `${c.hours}<small>h ${String(c.mins).padStart(2, "0")}m</small>`;

/** One readout, rendered by the rail. */
function ro(label, value, sub, tone) {
  return h("div", { class: "ro" + (tone ? " " + tone : "") },
    h("div", { class: "k" }, label),
    h("div", { class: "v", html: value }),
    sub ? h("div", { class: "s" }, sub) : null);
}

/**
 * The rail. An instrument that hides its reading is useless, so the six
 * numbers worth glancing at stay on screen whichever section you are in.
 */
function renderReadout() {
  const host = document.getElementById("readout");
  if (!host) return;
  host.innerHTML = "";

  const st = settlement(), y = yieldPlan(), r = readiness();
  const days = daysToGo();
  const record = grappaRecord();
  const g = state.grappa.find(x => x.year === YEAR);
  const mine = st.net.find(p => p.name === me());
  const date = state.settings?.sauce_date;

  if (date) {
    const end = new Date(date + "T00:00:00");
    const start = new Date(end.getFullYear() + "-02-01T00:00:00");
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const pct = Math.min(100, Math.max(0, ((today - start) / (end - start)) * 100));
    host.appendChild(h("div", { class: "season" },
      h("div", { class: "k" }, "Season"),
      h("div", { class: "track" },
        h("i", { style: `width:${pct.toFixed(1)}%` }),
        h("b", { style: `left:calc(${pct.toFixed(1)}% - 1px)` })),
      h("div", { class: "ends" }, h("span", {}, "1 FEB"),
        h("span", {}, end.toLocaleDateString("en-CA", { day: "numeric", month: "short" }).toUpperCase()))));
  }

  // The day count is already in the masthead, so the rail counts down the hours
  const c = toGo();
  host.appendChild(ro("To the first pot", c ? toGoValue(c) : "—",
    c ? (c.past ? "started " + c.at.toLocaleTimeString("en-CA",
          { hour: "2-digit", minute: "2-digit", hour12: false })
       : "07:00, " + c.at.toLocaleDateString("en-CA",
          { weekday: "long", day: "numeric", month: "long" }))
      : "no date set", "hot countdown"));

  if (mine) {
    host.appendChild(ro(mine.net >= 0 ? "You're owed" : "You owe",
      money0(Math.abs(mine.net)), "you've paid " + money0(mine.paid),
      mine.net >= 0 ? "good" : "hot"));
  }

  host.appendChild(ro("Share per man", money0(st.share),
    `${money0(st.total)} logged, ${st.net.length} ways`));

  host.appendChild(ro("Jars to buy", String(y.jarsToBuy),
    y.jarsToBuy ? `${y.jarPacks} pack${y.jarPacks === 1 ? "" : "s"} · ${money0(y.cost)} with lids`
                : "all in hand",
    y.jarsToBuy ? "hot" : null));

  host.appendChild(ro("Grappa record", money0(record),
    g?.price ? (Number(g.price) > record ? "beaten by " + money0(Number(g.price) - record)
                                         : "this year " + money0(g.price))
             : "not bought yet",
    g?.price && Number(g.price) > record ? "good" : null));

  host.appendChild(ro("Bought",
    `${r.buy.done}<small>/ ${r.buy.total}</small>`,
    `${r.buy.total - r.buy.done} items outstanding`));

  // A countdown that only moves when you navigate is a clock that lies. Patch
  // the one node every half minute rather than re-rendering the rail.
  const cd = host.querySelector(".ro.countdown .v");
  clearInterval(countdownTimer);
  countdownTimer = cd ? setInterval(() => {
    if (!document.body.contains(cd)) { clearInterval(countdownTimer); countdownTimer = null; return; }
    const now = toGo();
    if (now) cd.innerHTML = toGoValue(now);
  }, 30000) : null;

  const crew = ROUTES.find(x => x.hash === "#/crew");
  host.appendChild(h("a", {
    href: crew.hash,
    class: "railcrew" + (location.hash === crew.hash ? " on" : ""),
    "aria-current": location.hash === crew.hash ? "page" : null
  }, icon(crew.icon), h("span", {}, crew.label)));
}

function renderHead() {
  const ed = document.getElementById("edition");
  const now = document.getElementById("now");
  const sig = document.getElementById("sig");
  if (sig && !sig.firstChild) sig.appendChild(icon("cut"));
  if (ed) ed.textContent = state.settings?.edition
    ? `${YEAR} / ${roman(state.settings.edition)}` : String(YEAR);
  const d = daysToGo();
  if (now) now.innerHTML = state.settings?.sauce_date
    ? `SAUCE DAY <b>${state.settings.sauce_date}</b>` +
      (d === null ? "" : ` · T MINUS <b>${d}</b> DAY${d === 1 ? "" : "S"}`)
    : "";
}
const roman = n => ["", "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"][n] || n;

export function render() {
  if (!state.session) return renderLogin();
  if (!state.me) return renderNotOnList();
  const r = currentRoute();
  document.getElementById("shell").hidden = false;
  document.getElementById("gate").hidden = true;
  document.title = `Sauce Day ${YEAR} · ${r.label}`;
  renderNav();
  renderHead();
  renderReadout();
  const el = app();
  const y = el.scrollTop;
  stopTimeline();          // the timeline holds a clock; never leave two running
  el.innerHTML = "";
  el.appendChild(r.view());
  el.scrollTop = y;
}
V.setRender(render);

// ---------------------------------------------------------------- sign in
/**
 * Two columns: the day on the left, the door on the right.
 *
 * The hero is the last frame of the loader sprite — the sealed jar. It is
 * already in the repo and already in the browser cache from the splash, so it
 * costs nothing and the two screens read as one piece. To put a real
 * photograph there instead, point --gate-hero at it in styles.css; the layout
 * does not care what the image is.
 */
function gate(...kids) {
  document.getElementById("shell").hidden = true;
  const g = document.getElementById("gate");
  g.hidden = false;
  g.innerHTML = "";

  // The poster carries its own headline — Vino, Amici & Trallallà. Anything I
  // set over it would just be arguing with it, so the left column is the print
  // and nothing else. The words live in the right column now.
  const hero = h("div", { class: "gatehero" },
    h("div", { class: "gheroart", role: "img",
               "aria-label": "Vino, Amici e Trallallà — a bottle of grappa, three glasses " +
                             "and a plate of salami, olives and cheese" }));

  const nonno = h("div", { class: "gninjawrap" },
    h("div", { class: "gninja", role: "img",
               "aria-label": "An old man slicing a tomato in half, over and over" }),
    h("div", { class: "gninjacap" }, "cut the bad"));

  const panel = h("div", { class: "gatepanel" },
    h("div", { class: "gatebox" }, ...kids), nonno);
  g.append(hero, panel);
}

let pendingEmail = "";

function renderLogin() {
  gate(
    h("div", { class: "gsig" }, icon("cut")),
    h("h1", {}, "SAUCE DAY"),
    h("p", {}, "Your email and your password."),
    h("form", { class: "gform", onSubmit: async e => {
      e.preventDefault();
      const f = new FormData(e.target);
      const btn = e.target.querySelector("button");
      btn.disabled = true; btn.textContent = "Checking…";
      try {
        await signInWithPassword(f.get("email"), f.get("password"));
        await boot();
      } catch (err) {
        btn.disabled = false; btn.textContent = "Let me in";
        gateError(err.message);
      }
    } },
      h("input", { name: "email", class: "f", type: "email", required: true,
        placeholder: "you@example.com", autocomplete: "email" }),
      h("input", { name: "password", class: "f", type: "password", required: true,
        placeholder: "Password", autocomplete: "current-password" }),
      h("button", { class: "btn primary wide", type: "submit" }, "Let me in")),
    h("button", { class: "btn ghost", onClick: renderMagic }, "Email me a code instead"),
    h("p", { class: "fine" }, "Only the five emails on the crew list can get in.")
  );
}

function renderMagic() {
  gate(
    h("div", { class: "gsig" }, icon("cut")),
    h("h1", {}, "SAUCE DAY"),
    // the year span used to be listed here; the hero says it twice already
    h("p", {}, "Put in your email and we'll send you a six-digit code. No password to remember."),
    h("form", { class: "gform", onSubmit: async e => {
      e.preventDefault();
      const email = new FormData(e.target).get("email");
      const btn = e.target.querySelector("button");
      btn.disabled = true; btn.textContent = "Sending…";
      try {
        await sendCode(email);
        pendingEmail = email;
        renderCode();
      } catch (err) {
        btn.disabled = false; btn.textContent = "Send me a code";
        gateError(err.message);
      }
    } },
      h("input", { name: "email", class: "f", type: "email", required: true,
        placeholder: "you@example.com", autocomplete: "email" }),
      h("button", { class: "btn primary wide", type: "submit" }, "Send me a code")),
    h("button", { class: "btn ghost", onClick: renderLogin }, "Use a password instead"),
    h("p", { class: "fine" }, "Only the five emails on the crew list can get in.")
  );
}

function renderCode() {
  gate(
    h("div", { class: "gsig" }, icon("cut")),
    h("h1", {}, "SAUCE DAY"),
    h("p", {}, "Code sent to ", h("b", {}, pendingEmail), ". It's good for an hour."),
    h("form", { class: "gform", onSubmit: async e => {
      e.preventDefault();
      const code = new FormData(e.target).get("code");
      const btn = e.target.querySelector("button");
      btn.disabled = true; btn.textContent = "Checking…";
      try {
        await verifyCode(pendingEmail, code);
        await boot();
      } catch (err) {
        btn.disabled = false; btn.textContent = "Let me in";
        gateError(err.message);
      }
    } },
      h("input", { name: "code", class: "f code", inputmode: "numeric", required: true,
        placeholder: "000000", maxlength: "8", autocomplete: "one-time-code" }),
      h("button", { class: "btn primary wide", type: "submit" }, "Let me in")),
    h("button", { class: "btn ghost", onClick: renderMagic }, "Use a different email")
  );
}

function renderNotOnList() {
  gate(
    h("h1", {}, "Not on the list"),
    h("p", {}, "You're signed in as ", h("b", {}, state.session?.user?.email || "—"),
      ", but that address isn't on the crew list yet. Ask Matt to add it."),
    h("button", { class: "btn", onClick: () => sb?.auth.signOut().then(() => location.reload()) },
      "Sign out")
  );
}

function gateError(msg) {
  const g = document.querySelector(".gatebox");
  const old = g.querySelector(".gerr");
  if (old) old.remove();
  g.appendChild(h("p", { class: "gerr" }, msg));
}

// ---------------------------------------------------------------- boot
/**
 * The splash covers the module fetch, the auth round-trip and the first load,
 * so most of its four and a half seconds is real work rather than theatre.
 * Whichever finishes last wins: the app never appears mid-jar, and a slow
 * network never leaves you staring at a finished jar.
 *
 * splash.js guarantees its promise settles — it carries its own failsafe — so
 * awaiting it cannot hang the boot.
 */
async function waitForSplash() {
  const s = window.SAUCE_SPLASH;
  if (!s) return;
  try { await s.done; } catch { /* never blocks the app */ }
  s.dismiss();
}

async function boot() {
  await currentSession();
  if (!state.session) { await waitForSplash(); renderLogin(); return; }
  await loadAll();
  startRealtime();
  await waitForSplash();
  render();
}

onChange(() => { if (state.session && state.me) render(); });
addEventListener("hashchange", render);

if (DEMO) {
  document.getElementById("demobar").hidden = false;
}
if (!DEMO && sb) {
  sb.auth.onAuthStateChange((_evt, session) => {
    const had = !!state.session;
    state.session = session;
    if (session && !had) boot();
    if (!session) renderLogin();
  });
}

boot().catch(async err => {
  // a broken boot must still clear the splash, or the error is invisible
  await waitForSplash();
  gate(h("h1", {}, "Something broke"),
       h("p", {}, err.message),
       h("p", { class: "fine" }, "Check js/config.js and that schema.sql ran without errors."));
});
