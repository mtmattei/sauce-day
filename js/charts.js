// ============================================================================
//  Hand-rolled SVG charts. No chart library, no build step.
//  Palette slots 1-3 of the validated categorical set, light and dark.
// ============================================================================
const NS = "http://www.w3.org/2000/svg";
const W = 640, H = 300, M = { t: 24, r: 18, b: 34, l: 62 };
const PW = W - M.l - M.r, PH = H - M.t - M.b;

const el = (tag, attrs) => {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
};

function scale(raw) {
  if (!(raw > 0)) return { max: 1, ticks: 4 };
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const steps = [];
  [mag / 100, mag / 10, mag, mag * 10].forEach(m => [1, 2, 2.5, 5].forEach(f => steps.push(m * f)));
  steps.sort((a, b) => a - b);
  for (const st of steps) {
    const n = Math.ceil(raw / st);
    if (n >= 4 && n <= 6) return { max: n * st, ticks: n };
  }
  return { max: Math.ceil(raw / mag) * mag, ticks: 4 };
}

function topRound(x, y, w, h, r) {
  r = Math.min(r, h, w / 2);
  return `M${x},${y + h}V${y + r}a${r},${r} 0 0 1 ${r},${-r}h${w - 2 * r}` +
         `a${r},${r} 0 0 1 ${r},${r}V${y + h}Z`;
}

// ---------------------------------------------------------------- tooltip
let tip;
function tipEl() {
  if (!tip) {
    tip = document.createElement("div");
    tip.className = "tt";
    document.body.appendChild(tip);
  }
  return tip;
}
function showTip(evt, title, rows) {
  const t = tipEl();
  t.innerHTML = `<b>${title}</b>` + rows.map(r =>
    `<div class="row"><span>${r.color ? `<i class="sw" style="background:${r.color}"></i>` : ""}${r.label}</span><span>${r.value}</span></div>`).join("");
  t.classList.add("on");
  const pad = 14, b = t.getBoundingClientRect();
  let x = evt.clientX + pad, y = evt.clientY + pad;
  if (x + b.width > innerWidth - 8) x = evt.clientX - b.width - pad;
  if (y + b.height > innerHeight - 8) y = evt.clientY - b.height - pad;
  t.style.left = x + "px"; t.style.top = y + "px";
}
const hideTip = () => tipEl().classList.remove("on");

// ---------------------------------------------------------------- frame
function frame(host, years, max, ticks, fmtY) {
  host.innerHTML = "";
  const s = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img" });
  host.appendChild(s);
  for (let i = 0; i <= ticks; i++) {
    const v = max * i / ticks;
    const y = M.t + PH - (v / max) * PH;
    s.appendChild(el("line", { x1: M.l, x2: M.l + PW, y1: y, y2: y,
      stroke: i === 0 ? "var(--baseline)" : "var(--grid)", "stroke-width": i === 0 ? 1.5 : 1 }));
    const t = el("text", { x: M.l - 9, y: y + 4, "text-anchor": "end", class: "tick" });
    t.textContent = fmtY(v); s.appendChild(t);
  }
  const band = PW / years.length;
  years.forEach((yr, i) => {
    const t = el("text", { x: M.l + band * (i + 0.5), y: M.t + PH + 20,
      "text-anchor": "middle", class: "tick" });
    t.textContent = yr; s.appendChild(t);
  });
  return { s, band };
}

// ---------------------------------------------------------------- stacked
export function stackedBars(host, years, series, totals, fmt, pct = false) {
  const sc = pct ? { max: 100, ticks: 4 } : scale(Math.max(...totals.map(v => v || 0)) * 1.12);
  const { s, band } = frame(host, years, sc.max, sc.ticks,
    pct ? v => Math.round(v) + "%" : fmt);
  const bw = Math.min(52, band * 0.56);
  years.forEach((yr, i) => {
    if (totals[i] == null) {
      const t = el("text", { x: M.l + band * (i + .5), y: M.t + PH - 8,
        "text-anchor": "middle", class: "tick" });
      t.textContent = "—"; s.appendChild(t); return;
    }
    const x = M.l + band * (i + .5) - bw / 2;
    let acc = 0;
    series.forEach((ser, si) => {
      const raw = Number(ser.values[i]) || 0;
      const v = pct ? (raw / (totals[i] || 1)) * 100 : raw;
      const h = (v / sc.max) * PH;
      const yTop = M.t + PH - ((acc + v) / sc.max) * PH;
      const gap = si === series.length - 1 ? 0 : 2;
      const hh = Math.max(0, h - gap);
      if (hh > 0.4) {
        const node = si === series.length - 1
          ? el("path", { d: topRound(x, yTop, bw, hh, 0), fill: ser.color })
          : el("rect", { x, y: yTop + gap, width: bw, height: hh, fill: ser.color });
        node.addEventListener("mousemove", e => showTip(e, `${yr} · ${ser.name}`, [
          { label: "Amount", value: fmt(raw), color: ser.color },
          { label: "Share", value: Math.round((raw / (totals[i] || 1)) * 100) + "%" },
          { label: "Year total", value: fmt(totals[i]) }]));
        node.addEventListener("mouseleave", hideTip);
        s.appendChild(node);
      }
      acc += v;
    });
    if (!pct) {
      const lab = el("text", { x: M.l + band * (i + .5),
        y: M.t + PH - (totals[i] / sc.max) * PH - 7, "text-anchor": "middle", class: "dlabel" });
      lab.textContent = fmt(totals[i]); s.appendChild(lab);
    }
  });
}

// ---------------------------------------------------------------- bars
export function bars(host, years, values, fmt, fmtY, unit) {
  const sc = scale(Math.max(...values.map(v => v || 0)) * 1.15);
  const { s, band } = frame(host, years, sc.max, sc.ticks, fmtY);
  const bw = Math.min(46, band * 0.5);
  years.forEach((yr, i) => {
    const v = values[i], cx = M.l + band * (i + .5);
    if (v == null) {
      const t = el("text", { x: cx, y: M.t + PH - 8, "text-anchor": "middle", class: "tick" });
      t.textContent = "—"; s.appendChild(t); return;
    }
    if (v === 0) {
      const t = el("text", { x: cx, y: M.t + PH - 8, "text-anchor": "middle", class: "dlabel" });
      t.textContent = "none"; s.appendChild(t); return;
    }
    const h = (v / sc.max) * PH, y = M.t + PH - h;
    const node = el("path", { d: topRound(cx - bw / 2, y, bw, h, 0), fill: "var(--series-1)" });
    node.addEventListener("mousemove", e => showTip(e, String(yr),
      [{ label: unit, value: fmt(v), color: "var(--series-1)" }]));
    node.addEventListener("mouseleave", hideTip);
    s.appendChild(node);
    const lab = el("text", { x: cx, y: y - 7, "text-anchor": "middle", class: "dlabel" });
    lab.textContent = fmt(v); s.appendChild(lab);
  });
}

// ---------------------------------------------------------------- line
export function line(host, years, values, fmt, fmtY, unit) {
  const sc = scale(Math.max(...values.map(v => v || 0)) * 1.18);
  const { s, band } = frame(host, years, sc.max, sc.ticks, fmtY);
  const pts = years.map((y, i) => values[i] == null ? null : {
    x: M.l + band * (i + .5), y: M.t + PH - (values[i] / sc.max) * PH, v: values[i], yr: y });
  let d = "", pen = false;
  pts.forEach(p => { if (!p) { pen = false; return; } d += (pen ? "L" : "M") + p.x + "," + p.y; pen = true; });
  s.appendChild(el("path", { d, fill: "none", stroke: "var(--series-1)", "stroke-width": 2,
    "stroke-linejoin": "round", "stroke-linecap": "round" }));
  const cross = el("line", { y1: M.t, y2: M.t + PH, stroke: "var(--baseline)",
    "stroke-width": 1, "stroke-dasharray": "3 3", opacity: 0 });
  const live = pts.filter(Boolean);
  if (!live.length) return;
  const maxPt = live.reduce((a, b) => (b.v > a.v ? b : a), live[0]);
  const lastPt = live[live.length - 1];
  live.forEach(p => {
    s.appendChild(el("circle", { cx: p.x, cy: p.y, r: 4.5, fill: "var(--series-1)",
      stroke: "var(--surface-1)", "stroke-width": 2 }));
    if (p === maxPt || p === lastPt) {
      const lab = el("text", { x: p.x, y: p.y - 12, "text-anchor": "middle", class: "dlabel" });
      lab.textContent = fmt(p.v); s.appendChild(lab);
    }
    const hit = el("rect", { x: p.x - band / 2, y: M.t, width: band, height: PH, fill: "transparent" });
    hit.addEventListener("mousemove", e => {
      cross.setAttribute("x1", p.x); cross.setAttribute("x2", p.x); cross.setAttribute("opacity", 1);
      showTip(e, String(p.yr), [{ label: unit, value: fmt(p.v), color: "var(--series-1)" }]);
    });
    hit.addEventListener("mouseleave", () => { cross.setAttribute("opacity", 0); hideTip(); });
    s.appendChild(hit);
  });
  s.appendChild(cross);
}
