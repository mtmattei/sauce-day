// ============================================================================
//  SAUCE DAY — the live command centre.
//
//  Not a project tracker. One vertical line down the day: where we are, what is
//  next, whether we are behind, and where you can help. It runs off the same
//  runsheet rows the Run tab edits, so there is one source of truth — the
//  `milestone` flag decides what gets its own card and what sits underneath.
//
//  The clock ticks every 20 seconds. It patches the handful of nodes that
//  actually change rather than re-rendering the view, so nobody loses focus in
//  a note field mid-sentence.
// ============================================================================
import { state, YEAR, update, flash } from "./db.js";
import { h, me } from "./ui.js";
import { icon } from "./icons.js";
import { money0, spentByCat, sum, yieldPlan } from "./calc.js";

const GRACE_MIN = 10;          // late by less than this is not "delayed"
const TICK_MS   = 20000;
const MONTREAL  = { lat: 45.5019, lon: -73.5674 };

let ticker = null;
let weather = null;            // cached across renders; fetched once per session

/* ---------------------------------------------------------------- time */
/** "06:30" on sauce day → a Date. "Fri PM" → 18:00 the evening before. */
function scheduledAt(step, sauceDate) {
  if (!sauceDate) return null;
  const base = new Date(sauceDate + "T00:00:00");
  const t = (step.time_label || "").trim();
  const hm = t.match(/^(\d{1,2}):(\d{2})$/);
  if (hm) {
    const d = new Date(base);
    d.setHours(+hm[1], +hm[2], 0, 0);
    return d;
  }
  if (/^fri/i.test(t)) {           // the evening before
    const d = new Date(base);
    d.setDate(d.getDate() - 1);
    d.setHours(18, 0, 0, 0);
    return d;
  }
  return null;
}

const fmtClock = d => d.toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit", hour12: false });
const mins = ms => Math.round(ms / 60000);

/** A finish time that has rolled past midnight has to say so, or 05:01 reads
 *  as five in the morning today, which is a very different piece of news. */
function fmtFinish(d, ref) {
  if (!d) return "";
  const sameDay = d.toDateString() === ref.toDateString();
  return fmtClock(d) + (sameDay ? "" : " tomorrow");
}

function humanGap(m) {
  const a = Math.abs(m);
  if (a < 1) return "now";
  if (a < 60) return a + (a === 1 ? " minute" : " minutes");
  const hrs = Math.floor(a / 60), rem = a % 60;
  return hrs + (hrs === 1 ? " hour" : " hours") + (rem ? ` ${rem} min` : "");
}

/* ---------------------------------------------------------------- model */
/**
 * Builds the day: every runsheet row, with a status, folded so that non-
 * milestone steps hang off the milestone above them.
 */
export function buildDay(now = new Date()) {
  const sauceDate = state.settings?.sauce_date || null;
  const rows = [...state.runsheet].sort((a, b) => (a.sort_index || 0) - (b.sort_index || 0));

  const steps = rows.map(r => {
    const at = scheduledAt(r, sauceDate);
    return { ...r, at, done: !!r.done };
  });

  // Exactly one step is "in progress": the first undone one whose time has come.
  // It stays current however late it is — on a day running six hours behind you
  // still need to know what you are doing right now. Everything else that
  // should already have started is queued behind it, which is what delayed
  // means here.
  const firstUndone = steps.find(s => !s.done);
  const currentId = steps.find(s => !s.done && s.at && s.at <= now)?.id ?? null;

  steps.forEach(s => {
    if (s.done)          { s.status = "done"; return; }
    if (s.id === currentId) { s.status = "current"; s.lateMin = Math.max(0, mins(now - s.at)); return; }
    if (!s.at)           { s.status = "upcoming"; return; }
    s.lateMin = mins(now - s.at);
    s.status = s.lateMin > GRACE_MIN ? "delayed" : "upcoming";
  });

  // how far behind: the worst overrun among steps that should have started
  const overdue = steps.filter(s => !s.done && s.at && s.at < now);
  const slipMin = overdue.length ? Math.max(...overdue.map(s => mins(now - s.at))) : 0;

  const last = [...steps].reverse().find(s => s.at);
  const projectedFinish = last?.at ? new Date(last.at.getTime() + slipMin * 60000) : null;

  const next = steps.find(s => !s.done && s.at && s.at > now) || null;

  // fold sub-steps under the milestone above them
  const groups = [];
  steps.forEach(s => {
    if (s.milestone || !groups.length) groups.push({ head: s, subs: [] });
    else groups[groups.length - 1].subs.push(s);
  });

  const dayStart = steps.find(s => s.section === "DAY" && s.at)?.at || null;
  const dayEnd   = last?.at || null;

  return {
    steps, groups, slipMin, projectedFinish, next, currentId, firstUndone,
    dayStart, dayEnd, sauceDate,
    done: steps.filter(s => s.done).length,
    total: steps.length,
    isToday: sauceDate ? new Date(sauceDate + "T00:00:00").toDateString() === now.toDateString() : false,
    daysOut: sauceDate
      ? Math.ceil((new Date(sauceDate + "T00:00:00") - new Date(now.toDateString())) / 86400000) : null
  };
}

/* ---------------------------------------------------------------- weather */
async function loadWeather() {
  if (weather !== null) return weather;
  try {
    const u = `https://api.open-meteo.com/v1/forecast?latitude=${MONTREAL.lat}` +
              `&longitude=${MONTREAL.lon}&current=temperature_2m,weather_code` +
              `&timezone=America%2FToronto`;
    const r = await fetch(u);
    if (!r.ok) throw new Error("weather " + r.status);
    const j = await r.json();
    weather = { temp: Math.round(j.current.temperature_2m), code: j.current.weather_code };
  } catch {
    weather = false;                    // asked and failed; do not ask again
  }
  return weather;
}
const WX = c =>
  c === 0 ? "Clear" : c <= 3 ? "Cloud" : c <= 48 ? "Fog" :
  c <= 67 ? "Rain" : c <= 77 ? "Snow" : c <= 82 ? "Showers" : "Storm";

/* ---------------------------------------------------------------- wake lock */
/**
 * On the day the phone is propped against a bucket with tomato on everyone's
 * hands, and a screen that sleeps every thirty seconds is a screen nobody
 * reads. Hold the wake lock while the timeline is the live view, and only
 * then — a February peek at the run of the day has no business keeping a
 * screen alive.
 *
 * The OS drops the lock whenever the tab is hidden (a call, a lock button, a
 * switch to the camera), and it never comes back on its own, so re-request it
 * when the page becomes visible again. Unsupported browsers no-op: this is a
 * comfort, never a dependency.
 */
let wakeLock = null;
let wantWake = false;

async function acquireWake() {
  if (!wantWake || wakeLock || !("wakeLock" in navigator) || document.hidden) return;
  try {
    const l = await navigator.wakeLock.request("screen");
    // Identity check, not a bare null: render() releases and re-acquires around
    // every repaint, and a late release event from the OLD lock would otherwise
    // drop our reference to the NEW one — leaving a lock held with no way back
    // to it. Only the current lock may clear the slot.
    l.addEventListener("release", () => { if (wakeLock === l) wakeLock = null; });
    if (wantWake) wakeLock = l;
    else l.release().catch(() => {});      // gave up while we were waiting
  } catch {
    wakeLock = null;              // denied (battery saver, no user gesture yet)
  }
}

function releaseWake() {
  wantWake = false;
  const l = wakeLock;
  wakeLock = null;
  l?.release?.().catch(() => {});
}

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) acquireWake();
});

/* ---------------------------------------------------------------- writes */
async function toggleStep(step, on) {
  await update("runsheet", step.id, { done: on, done_at: on ? new Date().toISOString() : null });
}

async function addNote(step, text) {
  const stamp = `${me() || "someone"}: ${text.trim()}`;
  const next = step.notes ? `${step.notes}\n${stamp}` : stamp;
  await update("runsheet", step.id, { notes: next });
  flash("Note added");
}

/* ---------------------------------------------------------------- view */
export function viewSauceDay() {
  if (ticker) { clearInterval(ticker); ticker = null; }

  const day = buildDay();
  const root = h("div", { class: "sday" });

  // the prep evening counts: Friday night is jars and propane, also read off a
  // propped-up phone. Anything further out is planning, and planning can sleep.
  wantWake = day.daysOut !== null && day.daysOut <= 1;
  if (wantWake) acquireWake(); else releaseWake();

  // ---- the head: clock, next up, how the day is running
  root.appendChild(dayHead(day));

  // ---- the strip of live context
  const strip = h("div", { class: "sdstrip" });
  root.appendChild(strip);
  paintStrip(strip, day);

  // ---- the line
  const line = h("div", { class: "sdline" },
    h("div", { class: "sdrail" },
      h("i", { class: "sdfill" }),
      h("span", { class: "sdmarker" }, icon("tomato"))),
    ...day.groups.map(g => milestone(g, day)));
  root.appendChild(line);

  // weather arrives late; patch it in rather than blocking the render
  loadWeather().then(() => { if (document.body.contains(strip)) paintStrip(strip, buildDay()); });

  // keep the clock honest without re-rendering the whole page
  ticker = setInterval(() => {
    if (!document.body.contains(root)) { clearInterval(ticker); ticker = null; return; }
    retick(root);
  }, TICK_MS);

  queueMicrotask(() => retick(root));
  return root;
}

function dayHead(day) {
  const now = new Date();
  const behind = day.slipMin > GRACE_MIN;
  return h("div", { class: "sdhead" + (day.isToday ? " is-live" : "") },
    h("div", { class: "sdclock" },
      h("div", { class: "k" }, day.isToday ? "Now" : "Sauce day"),
      h("div", { class: "v", "data-clock": "1" },
        day.isToday ? fmtClock(now)
          : new Date(day.sauceDate + "T00:00:00").toLocaleDateString("en-CA",
              { weekday: "short", day: "numeric", month: "short" }))),
    h("div", { class: "sdnext" },
      h("div", { class: "k" }, day.isToday ? "Next up" : "Starts in"),
      h("div", { class: "v", "data-next": "1" },
        day.isToday
          ? (day.next ? day.next.activity : day.firstUndone ? day.firstUndone.activity : "Nothing left")
          : `${day.daysOut} days`),
      h("div", { class: "s", "data-nextin": "1" },
        day.isToday && day.next?.at ? "in " + humanGap(mins(day.next.at - now)) : "")),
    h("div", { class: "sdpace" + (behind ? " is-behind" : "") },
      h("div", { class: "k" }, "Pace"),
      h("div", { class: "v", "data-pace": "1" },
        !day.isToday ? "—" : behind ? humanGap(day.slipMin) + " behind" : "On time"),
      h("div", { class: "s", "data-finish": "1" },
        day.projectedFinish && day.isToday ? "finishing about " + fmtFinish(day.projectedFinish, now) : "")),
    h("div", { class: "sdprog" },
      h("div", { class: "k" }, "Done"),
      h("div", { class: "v", "data-count": "1" }, `${day.done}`,
        h("small", {}, "/ " + day.total))));
}

function paintStrip(strip, day) {
  const spent = sum(spentByCat());
  const y = yieldPlan();
  const jarsDone = state.history.find(hh => hh.year === YEAR)?.jars_filled ?? null;
  const cells = [
    weather && weather !== false ? ["Outside", weather.temp + "°", WX(weather.code)] : null,
    ["Tomatoes", y.bushels + " bu", y.litres.toFixed(0) + " L forecast"],
    ["Jars", jarsDone != null ? String(jarsDone) : "—", "of " + y.jarsRequired + " needed"],
    ["Spent", money0(spent), "running total"]
  ].filter(Boolean);
  strip.innerHTML = "";
  cells.forEach(([k, v, s]) => strip.appendChild(
    h("div", { class: "sdcell" },
      h("div", { class: "k" }, k), h("div", { class: "v" }, v), h("div", { class: "s" }, s))));
}

function milestone(g, day) {
  const s = g.head;
  const el = h("div", {
    class: "sdstep is-" + s.status + (s.critical ? " is-critical" : "") +
           (s.milestone ? "" : " is-sub") + (s.status === "done" ? " is-folded" : ""),
    "data-step": s.id
  });

  const mark = h("div", { class: "sdmark" }, s.icon ? icon(s.icon) : icon("dial"));

  const tick = h("button", {
    class: "sdtick", title: s.done ? "Undo" : "Mark done",
    "aria-pressed": String(s.done),
    onClick: () => toggleStep(s, !s.done)
  }, icon("check"));

  const head = h("div", { class: "sdstephead" },
    h("time", {}, s.time_label || ""),
    h("div", { class: "sdtitle" }, s.activity),
    h("div", { class: "sdstatus" },
      s.status === "done" ? "done"
      : s.status === "current" ? (s.lateMin > GRACE_MIN ? `in progress · ${humanGap(s.lateMin)} late` : "in progress")
      : s.status === "delayed" ? "delayed" : "upcoming"));

  const meta = [];
  if (s.duration_min) meta.push(`${s.duration_min} min`);
  if (s.lead) meta.push(`lead ${s.lead}`);
  if (s.crew && s.crew !== s.lead) meta.push(`with ${s.crew}`);
  if (s.equipment) meta.push(s.equipment);
  if (s.ingredients) meta.push(s.ingredients);

  const body = h("div", { class: "sdbody" },
    meta.length ? h("div", { class: "sdmeta" }, meta.join(" · ")) : null,
    s.notes ? h("div", { class: "sdnotes" },
      ...String(s.notes).split("\n").map(n => h("p", {}, n))) : null,
    g.subs.length ? h("ul", { class: "sdsubs" }, ...g.subs.map(sub =>
      h("li", { class: "is-" + sub.status },
        h("button", {
          class: "sdsubtick", "aria-pressed": String(sub.done),
          title: sub.done ? "Undo" : "Mark done",
          onClick: () => toggleStep(sub, !sub.done)
        }, icon("check")),
        h("time", {}, sub.time_label || ""),
        h("span", {}, sub.activity)))) : null,
    noteForm(s));

  el.append(mark, tick, head, body);
  return el;
}

function noteForm(s) {
  return h("form", { class: "sdnoteform", onSubmit: e => {
    e.preventDefault();
    const inp = e.target.querySelector("input");
    if (!inp.value.trim()) return;
    addNote(s, inp.value);
    inp.value = "";
  } },
    h("input", { class: "f", placeholder: "Add a note…", "aria-label": "Add a note" }),
    h("button", { class: "btn", type: "submit" }, "Add"));
}

/* ---------------------------------------------------------------- tick */
/** Patch only what the clock changes. No re-render, so focus survives. */
function retick(root) {
  const day = buildDay();
  const now = new Date();

  const set = (sel, val) => { const n = root.querySelector(sel); if (n && val != null) n.textContent = val; };
  if (day.isToday) {
    set("[data-clock]", fmtClock(now));
    set("[data-next]", day.next ? day.next.activity : day.firstUndone ? day.firstUndone.activity : "Nothing left");
    set("[data-nextin]", day.next?.at ? "in " + humanGap(mins(day.next.at - now)) : "");
    const behind = day.slipMin > GRACE_MIN;
    set("[data-pace]", behind ? humanGap(day.slipMin) + " behind" : "On time");
    root.querySelector(".sdpace")?.classList.toggle("is-behind", behind);
    set("[data-finish]", day.projectedFinish ? "finishing about " + fmtFinish(day.projectedFinish, now) : "");
  }
  const count = root.querySelector("[data-count]");
  if (count) count.childNodes[0].nodeValue = String(day.done);

  // statuses and the fill
  day.steps.forEach(s => {
    const el = root.querySelector(`[data-step="${s.id}"]`);
    if (!el) return;
    el.className = el.className.replace(/is-(done|current|delayed|upcoming)/g, "").trim() + " is-" + s.status;
    el.classList.toggle("is-folded", s.status === "done");
  });

  const pct = day.total ? (day.done / day.total) * 100 : 0;
  const fill = root.querySelector(".sdfill");
  if (fill) fill.style.height = pct.toFixed(1) + "%";
  const marker = root.querySelector(".sdmarker");
  if (marker) marker.style.top = `calc(${pct.toFixed(1)}% - .6rem)`;

  root.classList.toggle("is-sealed", day.done === day.total && day.total > 0);
}

export function stopTimeline() {
  if (ticker) { clearInterval(ticker); ticker = null; }
  releaseWake();                  // navigating away gives the screen back
}
