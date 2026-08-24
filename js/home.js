// ============================================================================
//  The Board. What the crew needs to know right now, and nothing else —
//  every number here is a door into the screen that owns it. The run-of-day
//  timeline takes this route over when the day is close enough to matter
//  (app.js decides); until then the Board answers the three questions people
//  actually open the app with: how long, what do I owe, are we ready.
// ============================================================================
import { state, YEAR } from "./db.js";
import { money0, settlement, yieldPlan, readiness, daysToGo, grappaRecord,
         buyable, assignedTo } from "./calc.js";
import { h, frag, me } from "./ui.js";
import { icon } from "./icons.js";
import { jarWall } from "./jars.js";

function section(cls, ...kids) {
  return h("section", { class: "bsec " + cls }, ...kids);
}

export function viewBoard() {
  const name = me();
  const st = settlement();
  const y = yieldPlan();
  const r = readiness();
  const days = daysToGo();
  const record = grappaRecord();
  const g = state.grappa.find(x => x.year === YEAR);
  const closed = state.history.find(x => x.year === YEAR && x.jars_filled != null);

  // ---- 1 · the countdown: the one card with no job but the date
  const date = state.settings?.sauce_date
    ? new Date(state.settings.sauce_date + "T00:00:00")
        .toLocaleDateString("en-CA", { weekday: "long", day: "numeric", month: "long" })
    : null;
  const hero = section("bhero",
    h("div", { class: "bdays" },
      days === null ? "—"
        : days === 0 ? "today"
        : h("span", {}, h("b", {}, String(days)), h("small", {}, days === 1 ? "day" : "days"))),
    h("div", { class: "bwhen" },
      date ? `${date} · first pot at 07:00` : "no date set yet"),
    h("a", { class: "bpeek", href: "#/", onClick: e => {
      e.preventDefault();
      state.ui = { ...(state.ui || {}), peekDay: true };
      render();
    } }, "see the run of the day →"));

  // ---- 2 · you: addressed by name, one fact per line, each line a door
  const mine = st.net.find(p => p.name === name);
  const myItems = state.items.filter(i => buyable(i) && !i.obtained && assignedTo(i, name));
  const myDishes = state.menu.filter(m => m.who === name && !m.confirmed);

  const yous = [];
  if (mine && Math.abs(mine.net) >= 0.005) {
    yous.push(h("a", { class: "bline", href: "#/spend" },
      h("b", { class: mine.net >= 0 ? "good" : "hot" },
        (mine.net >= 0 ? "you're owed " : "you owe ") + money0(Math.abs(mine.net))),
      h("span", {}, "settle on the spend screen"), arrow()));
  }
  if (myItems.length) {
    yous.push(h("a", { class: "bline", href: "#/buy", onClick: () => {
      state.ui = { ...(state.ui || {}), buyMine: true };
    } },
      h("b", { class: "hot" }, `${myItems.length} thing${myItems.length === 1 ? "" : "s"} to get`),
      h("span", {}, myItems.slice(0, 3).map(i => i.name).join(" · ")
        + (myItems.length > 3 ? " …" : "")), arrow()));
  }
  if (myDishes.length) {
    yous.push(h("a", { class: "bline", href: "#/menu" },
      h("b", { class: "hot" }, `${myDishes.length} dish${myDishes.length === 1 ? "" : "es"} to confirm`),
      h("span", {}, myDishes.map(m => m.dish).join(" · ")), arrow()));
  }
  const you = section("byou",
    h("h2", { class: "k" }, name ? `Ciao ${name}` : "You"),
    yous.length ? frag(...yous)
      : h("p", { class: "bsquare" }, "You're square. Nothing on your list."));

  // ---- 3 · what nobody has claimed. The crew pulse tells each man what he
  // owes; work with no name on it belongs to everyone, which in practice means
  // it belongs to nobody until someone goes looking. This is that someone.
  const openItems = state.items.filter(i => buyable(i) && !i.obtained && !i.assigned_to);
  const openDishes = state.menu.filter(m => !m.confirmed && !m.who);
  const opens = [];
  if (openItems.length) {
    opens.push(h("a", { class: "bline", href: "#/buy", onClick: () => {
      // land on the full list, not on whatever "mine" filter was left behind
      state.ui = { ...(state.ui || {}), buyMine: false };
    } },
      h("b", { class: "hot" }, `${openItems.length} thing${openItems.length === 1 ? "" : "s"} to buy`),
      h("span", {}, openItems.slice(0, 3).map(i => i.name).join(" · ")
        + (openItems.length > 3 ? " …" : "")), arrow()));
  }
  if (openDishes.length) {
    opens.push(h("a", { class: "bline", href: "#/menu" },
      h("b", { class: "hot" }, `${openDishes.length} dish${openDishes.length === 1 ? "" : "es"}`),
      h("span", {}, openDishes.slice(0, 3).map(m => m.dish).join(" · ")
        + (openDishes.length > 3 ? " …" : "")), arrow()));
  }
  const unclaimed = opens.length
    ? section("bopen", h("h2", { class: "k" }, "Nobody's name on it"), ...opens)
    : null;

  // ---- 4 · the jar wall: prep until the year is counted, then yield
  const wallHead = closed
    ? `${closed.jars_filled} jars filled`
    : y.jarsRequired ? `${y.jarsRequired} jars` : "the jar plan";
  const wallSub = closed
    ? (closed.fallen_soldiers ? `${closed.fallen_soldiers} fallen soldier${closed.fallen_soldiers === 1 ? "" : "s"}` : "not one lost")
    : y.jarsRequired
      ? (y.jarsToBuy ? `${y.jarsToBuy} to buy · ${y.jarPacks} pack${y.jarPacks === 1 ? "" : "s"} · ${money0(y.cost)} with lids`
                     : "all in hand")
      : "set the bushel count and the wall draws itself";
  const wall = section("bjars",
    h("h2", { class: "vh" }, "The jars"),
    h("a", { class: "bhead", href: "#/sauce" },
      h("span", { class: "k" }, "The jars"),
      h("b", {}, wallHead), h("span", { class: "bsub" }, wallSub), arrow()),
    jarWall(closed
      ? { total: Math.max(y.jarsRequired, (closed.jars_filled || 0) + (closed.fallen_soldiers || 0)),
          full: closed.jars_filled || 0, fallen: closed.fallen_soldiers || 0, mode: "yield" }
      : { total: y.jarsRequired, full: y.onHand.jars }));

  // ---- 5 · crew pulse: a dot per homie with something still to do
  const pulse = section("bpulse",
    h("h2", { class: "k" }, "The crew"),
    ...state.members.map(m => {
      // his kit and his dishes both count — a man down for the SAQ run has a
      // list, even when nothing in `items` has his name on it
      const left = state.items.filter(i => buyable(i) && !i.obtained && assignedTo(i, m.display_name)).length
                 + state.menu.filter(d => !d.confirmed && assignedTo(d, m.display_name)).length;
      const net = st.net.find(p => p.name === m.display_name)?.net || 0;
      const square = !left && Math.abs(net) < 0.005;
      return h("a", { class: "bcrewrow" + (square ? " clear" : ""), href: "#/buy" },
        h("i", { class: "dot" + (left ? " on" : "") }),
        h("b", {}, m.display_name),
        h("span", {}, [
          left ? `${left} to get` : "list clear",
          Math.abs(net) < 0.005 ? null : net > 0 ? "is owed" : "owes"
        ].filter(Boolean).join(" · ")));
    }));

  // ---- 6 · the record
  const grappaLine = g?.price
    ? (Number(g.price) > record
        ? { b: money0(g.price), s: `beats the record by ${money0(Number(g.price) - record)}`, good: true }
        : { b: money0(g.price), s: `${money0(record - Number(g.price))} short of the record` })
    : { b: money0(record), s: "the line to clear — not bought yet" };
  const grappa = section("brecord",
    h("h2", { class: "vh" }, "The grappa"),
    h("a", { class: "bhead", href: "#/grappa" },
      h("span", { class: "k" }, "The grappa"),
      h("b", { class: grappaLine.good ? "good" : "" }, grappaLine.b),
      h("span", { class: "bsub" }, grappaLine.s), arrow()));

  // ---- 7 · readiness: three thin meters, each a door
  const meter = (label, hash, d) => h("a", { class: "bmeter", href: hash },
    h("span", { class: "k" }, label),
    h("b", {}, `${d.done}`, h("small", {}, `/ ${d.total}`)),
    h("span", { class: "track" },
      h("i", { style: `width:${d.total ? (d.done / d.total * 100).toFixed(1) : 0}%` })));
  const ready = section("bready",
    h("h2", { class: "vh" }, "Readiness"),
    meter("Bought", "#/buy", r.buy),
    meter("Menu", "#/menu", r.menu),
    meter("Run sheet", "#/run", r.run));

  return frag(h("div", { class: "board" }, hero, you, unclaimed, wall, pulse, grappa, ready));
}

const arrow = () => h("span", { class: "barrow", "aria-hidden": "true" }, "→");

// render is injected the same way views.js gets it, to avoid an import cycle
let render = () => {};
export function setRender(fn) { render = fn; }
