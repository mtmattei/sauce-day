// ============================================================================
//  The drawn mark family. One 24x24 grid, stroked in currentColor, weight set
//  by CSS. The root of the set is the cut tomato: a whole fruit with its bad
//  end sliced off and set aside. That is the tagline drawn, and every other
//  mark is built on the same grid and the same stroke.
// ============================================================================
const P = {
  // the signature
  cut:
    '<path d="M14.5 8.44A7 7 0 1 0 14.5 20.56Z"/>' +
    '<path d="M11 7.6V4.4"/>' +
    '<path d="M11 7.6C9.4 6.2 7.7 5.9 6.1 6.3"/>' +
    '<path d="M11 7.6c1.4-1.2 2.9-1.6 4.4-1.3"/>' +
    '<path d="M18.4 8.9a6.2 6.2 0 0 1 0 11.2Z"/>',

  tomato:
    '<circle cx="12" cy="14.6" r="6.9"/>' +
    '<path d="M12 7.7V4.3"/>' +
    '<path d="M12 7.7C10.3 6.2 8.5 5.9 6.8 6.3"/>' +
    '<path d="M12 7.7c1.7-1.5 3.5-1.8 5.2-1.4"/>',

  jar:
    '<path d="M8.6 3.8h6.8v2.1H8.6z"/>' +
    '<path d="M7.9 5.9h8.2v2.2H7.9z"/>' +
    '<path d="M8.8 8.1v9.6a2.6 2.6 0 0 0 2.6 2.6h1.2a2.6 2.6 0 0 0 2.6-2.6V8.1"/>',

  mill:
    '<path d="M4.6 8.4h14.8l-3.3 9.4H7.9z"/>' +
    '<path d="M3.4 8.4h17.2"/><path d="M12 8.4V5.2"/><path d="M12 5.2h4.4"/>' +
    '<circle cx="17.4" cy="5.2" r="1.4"/>',

  fork:
    '<path d="M9.2 3.6v5a2.4 2.4 0 0 0 4.8 0v-5"/>' +
    '<path d="M11.6 3.6v5"/><path d="M11.6 11v9.4"/>',

  list:
    '<path d="M9 6.4h11"/><path d="M9 12h11"/><path d="M9 17.6h11"/>' +
    '<path d="M4 6.2l1.4 1.4L8 5"/><path d="M4 11.8l1.4 1.4L8 10.6"/>' +
    '<path d="M4.4 17.6h2.6"/>',

  clock:
    '<circle cx="12" cy="12.6" r="8.2"/><path d="M12 7.8v4.8l3.2 2"/>',

  // one pot, five ways
  split:
    '<circle cx="12" cy="12" r="8.4"/>' +
    '<path d="M12 3.6V12l7.4 4"/><path d="M12 12l-7.6 4.4"/>' +
    '<path d="M12 12l7.2-4.6"/><path d="M12 12l-7.4-4.4"/>',

  bottle:
    '<path d="M10.3 3.2h3.4v3.2c0 1 .5 1.6 1.1 2.3.8 1 1.5 2.1 1.5 3.5v6.9a1.9 1.9 0 0 1-1.9 1.9H9.6a1.9 1.9 0 0 1-1.9-1.9v-6.9c0-1.4.7-2.5 1.5-3.5.6-.7 1.1-1.3 1.1-2.3z"/>' +
    '<path d="M9.7 3.2h4.6"/><path d="M7.7 13.4h8.6"/>',

  rows:
    '<path d="M3.4 5.6h17.2"/><path d="M3.4 10.4h17.2"/>' +
    '<path d="M3.4 15.2h17.2"/><path d="M3.4 20h17.2"/><path d="M9 3.4v18"/>',

  bars:
    '<path d="M4 20.4V13"/><path d="M9.4 20.4V7.6"/>' +
    '<path d="M14.6 20.4v-10"/><path d="M20 20.4V4"/><path d="M2.6 20.4h18.8"/>',

  dial:
    '<path d="M4 16.6a8.6 8.6 0 0 1 16 0"/><path d="M12 16.6l4.6-5"/>' +
    '<circle cx="12" cy="16.6" r="1.3"/>' +
    '<path d="M4 16.6h1.8"/><path d="M18.2 16.6H20"/><path d="M12 8v-1.8"/>',

  crew:
    '<circle cx="8.2" cy="8.6" r="2.7"/><circle cx="16.2" cy="8.6" r="2.7"/>' +
    '<path d="M3.2 18.8c0-2.8 2.2-4.8 5-4.8s5 2 5 4.8"/>' +
    '<path d="M11.2 18.8c0-2.8 2.2-4.8 5-4.8s5 2 5 4.8"/>',

  flame:
    '<path d="M12 3.2c3 4 5.1 5.6 5.1 9.1a5.1 5.1 0 0 1-10.2 0c0-1.6.8-2.9 1.7-3.9.4 1 1 1.6 1.8 2C10.1 8.3 11 5.7 12 3.2z"/>'
};

// ---------------------------------------------------------------- bottles
// Four silhouettes so a shelf of years reads as a shelf and not seven clones.
// Height is driven by price, so beating the record is something you can see.
const SHAPES = [
  { w: 34, neck: 30, shoulder: 15, bodyW: 30 },
  { w: 38, neck: 24, shoulder: 20, bodyW: 36 },
  { w: 32, neck: 34, shoulder: 12, bodyW: 26 },
  { w: 40, neck: 20, shoulder: 18, bodyW: 38 }
];

/**
 * bottle(factor, shapeIndex, opts) -> <svg>
 * factor 0-1 scales total height between opts.min and opts.max.
 * opts.empty draws the outline only: a year with no bottle at all.
 */
export function bottle(factor, shapeIndex = 0, opts = {}) {
  const S = SHAPES[shapeIndex % SHAPES.length];
  const MIN = opts.min ?? 40, MAX = opts.max ?? 170;
  const h = Math.round(MIN + (MAX - MIN) * Math.max(0, Math.min(1, factor)));
  const w = S.w, cx = w / 2, neckW = 11, nx = cx - neckW / 2;
  const neckEnd = S.neck, shoulderEnd = S.neck + S.shoulder;
  const bx = cx - S.bodyW / 2, bx2 = cx + S.bodyW / 2;
  const base = h - 1, r = 3;

  const d =
    `M${nx} 5V${neckEnd}` +
    `C${nx} ${neckEnd + S.shoulder * .55} ${bx} ${shoulderEnd - S.shoulder * .5} ${bx} ${shoulderEnd}` +
    `V${base - r}a${r} ${r} 0 0 0 ${r} ${r}H${bx2 - r}a${r} ${r} 0 0 0 ${r} ${-r}V${shoulderEnd}` +
    `C${bx2} ${shoulderEnd - S.shoulder * .5} ${nx + neckW} ${neckEnd + S.shoulder * .55} ${nx + neckW} ${neckEnd}` +
    `V5a${neckW / 2} 2.6 0 0 0 ${-neckW} 0Z`;

  const labelTop = shoulderEnd + (base - shoulderEnd) * .22;
  const labelH = Math.max(10, (base - shoulderEnd) * .34);

  const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("viewBox", `0 0 ${w} ${h}`);
  s.setAttribute("width", w);
  s.setAttribute("height", h);
  s.setAttribute("fill", "none");
  s.setAttribute("stroke", "currentColor");
  s.setAttribute("stroke-width", "1.3");
  s.setAttribute("stroke-linejoin", "round");
  s.setAttribute("role", "img");
  s.setAttribute("class", "btl" + (opts.cls ? " " + opts.cls : ""));
  if (opts.label) s.setAttribute("aria-label", opts.label);
  s.innerHTML =
    `<path class="btl-body" d="${d}"/>` +
    (opts.empty ? "" :
      `<path class="btl-cap" d="M${nx} 5.5h${neckW}v13h${-neckW}z"/>` +
      `<path class="btl-label" d="M${bx + 2} ${labelTop}h${S.bodyW - 4}v${labelH}h${-(S.bodyW - 4)}z"/>`);
  return s;
}
export const BOTTLE_SHAPES = SHAPES;

/** Returns an <svg> element. Stroke weight and colour come from CSS. */
export function icon(name, cls) {
  const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("viewBox", "0 0 24 24");
  s.setAttribute("fill", "none");
  s.setAttribute("stroke", "currentColor");
  s.setAttribute("stroke-width", "1.5");
  s.setAttribute("stroke-linecap", "round");
  s.setAttribute("stroke-linejoin", "round");
  s.setAttribute("aria-hidden", "true");
  s.setAttribute("focusable", "false");
  s.setAttribute("class", "ico" + (cls ? " " + cls : ""));
  s.innerHTML = P[name] || P.tomato;
  return s;
}

export const ICONS = P;
