/* ===========================================================================
   SAUCE DAY — the drawn layer.

   Everything here renders from geometry, never from an asset, so the workbook
   is fully visual before a single photograph exists. Three parts:

   1. ICONS   one 24x24 family, all stroked in currentColor at a stroke-width
              the host theme sets. The root of the family is the cut tomato:
              a whole fruit with its bad end sliced off and set aside. That is
              the tagline drawn, and it is the mark the whole set descends from.

   2. BOTTLES grappa bottles built as paths, height scaled to price, four
              silhouettes so a shelf reads as a shelf. A real photograph, when
              one exists, replaces the drawing; the drawing is the fallback,
              never a placeholder box.

   3. FRAMES  photobook plates. An empty plate draws its own corner marks and
              carries its caption, so the book has a shape before it has
              pictures.
   =========================================================================== */
(function (global) {
"use strict";

/* ---------------------------------------------------------------- icons */
const P = {
  /* the signature: tomato, cut, bad end set aside */
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

  /* a mason jar: lid, band, shoulders, body */
  jar:
    '<path d="M8.6 3.8h6.8v2.1H8.6z"/>' +
    '<path d="M7.9 5.9h8.2v2.2H7.9z"/>' +
    '<path d="M8.8 8.1v9.6a2.6 2.6 0 0 0 2.6 2.6h1.2a2.6 2.6 0 0 0 2.6-2.6V8.1"/>',

  /* food mill: cone, rim, crank */
  mill:
    '<path d="M4.6 8.4h14.8l-3.3 9.4H7.9z"/>' +
    '<path d="M3.4 8.4h17.2"/>' +
    '<path d="M12 8.4V5.2"/>' +
    '<path d="M12 5.2h4.4"/>' +
    '<circle cx="17.4" cy="5.2" r="1.4"/>',

  /* a glass, for food and drinks */
  glass:
    '<path d="M7.4 4h9.2l-3.3 7.6v6.6"/>' +
    '<path d="M16.6 4l-3.3 7.6"/>' +
    '<path d="M9.4 20.2h5.2"/>' +
    '<path d="M13.3 18.2v2"/>',

  fork:
    '<path d="M9.2 3.6v5a2.4 2.4 0 0 0 4.8 0v-5"/>' +
    '<path d="M11.6 3.6v5"/>' +
    '<path d="M11.6 11v9.4"/>',

  list:
    '<path d="M9 6.4h11"/><path d="M9 12h11"/><path d="M9 17.6h11"/>' +
    '<path d="M4 6.2l1.4 1.4L8 5"/>' +
    '<path d="M4 11.8l1.4 1.4L8 10.6"/>' +
    '<path d="M4.4 17.6h2.6"/>',

  clock:
    '<circle cx="12" cy="12.6" r="8.2"/>' +
    '<path d="M12 7.8v4.8l3.2 2"/>',

  /* settlement: one pot, five ways */
  split:
    '<circle cx="12" cy="12" r="8.4"/>' +
    '<path d="M12 3.6V12l7.4 4"/>' +
    '<path d="M12 12l-7.6 4.4"/>' +
    '<path d="M12 12l7.2-4.6"/>' +
    '<path d="M12 12l-7.4-4.4"/>',

  bottle:
    '<path d="M10.3 3.2h3.4v3.2c0 1 .5 1.6 1.1 2.3.8 1 1.5 2.1 1.5 3.5v6.9a1.9 1.9 0 0 1-1.9 1.9H9.6a1.9 1.9 0 0 1-1.9-1.9v-6.9c0-1.4.7-2.5 1.5-3.5.6-.7 1.1-1.3 1.1-2.3z"/>' +
    '<path d="M9.7 3.2h4.6"/>' +
    '<path d="M7.7 13.4h8.6"/>',

  /* photobook: two plates, one behind the other */
  plates:
    '<path d="M7.4 3.9h13v11.7h-13z"/>' +
    '<path d="M3.6 8.4v11.7h13"/>' +
    '<path d="M7.4 12.6l3.1-3 2.5 2.4 2.4-2.2 5 4.6"/>' +
    '<circle cx="11" cy="7.5" r="1.2"/>',

  rows:
    '<path d="M3.4 5.6h17.2"/><path d="M3.4 10.4h17.2"/>' +
    '<path d="M3.4 15.2h17.2"/><path d="M3.4 20h17.2"/>' +
    '<path d="M9 3.4v18"/>',

  bars:
    '<path d="M4 20.4V13"/><path d="M9.4 20.4V7.6"/>' +
    '<path d="M14.6 20.4v-10"/><path d="M20 20.4V4"/>' +
    '<path d="M2.6 20.4h18.8"/>',

  /* dashboard: a dial with the needle past halfway */
  dial:
    '<path d="M4 16.6a8.6 8.6 0 0 1 16 0"/>' +
    '<path d="M12 16.6l4.6-5"/>' +
    '<circle cx="12" cy="16.6" r="1.3"/>' +
    '<path d="M4 16.6h1.8"/><path d="M18.2 16.6H20"/><path d="M12 8v-1.8"/>',

  bushel:
    '<path d="M3.6 7.6h16.8l-1.7 12H5.3z"/>' +
    '<path d="M3.6 7.6l1.7-3.2h13.4l1.7 3.2"/>' +
    '<path d="M9.4 7.6l-.6 12"/><path d="M14.6 7.6l.6 12"/>',

  drop:
    '<path d="M12 3.4s5.6 6.4 5.6 9.9a5.6 5.6 0 1 1-11.2 0C6.4 9.8 12 3.4 12 3.4z"/>',

  flame:
    '<path d="M12 3.2c3 4 5.1 5.6 5.1 9.1a5.1 5.1 0 0 1-10.2 0c0-1.6.8-2.9 1.7-3.9.4 1 1 1.6 1.8 2C10.1 8.3 11 5.7 12 3.2z"/>',

  camera:
    '<path d="M3.6 7.8h4l1.6-2.4h5.6l1.6 2.4h4v11.6h-16.8z"/>' +
    '<circle cx="12" cy="13.4" r="3.7"/>'
};

/** icon("jar") -> an inline svg string. Stroke width comes from the theme. */
function icon(name, cls, size) {
  const d = P[name] || P.tomato;
  return '<svg class="ico' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" ' +
    'width="' + (size || 24) + '" height="' + (size || 24) + '" ' +
    'fill="none" stroke="currentColor" stroke-width="1.4" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
    d + '</svg>';
}

/* ---------------------------------------------------------------- bottles */
/* Four silhouettes. Each returns a path for a bottle W wide and H tall, drawn
   bottom-aligned so a row of them stands on one shelf line. */
const SHAPES = [
  { w: 34, neck: 30, shoulder: 15, bodyW: 30, name: "tall, narrow shoulder" },
  { w: 38, neck: 24, shoulder: 20, bodyW: 36, name: "classic grappa flask" },
  { w: 32, neck: 34, shoulder: 12, bodyW: 26, name: "very tall, slim" },
  { w: 40, neck: 20, shoulder: 18, bodyW: 38, name: "squat, wide base" }
];

/**
 * bottle(factor, shapeIndex, opts)
 *   factor 0-1 scales total height between MIN and MAX.
 *   Returns { svg, h, w, shape }.
 */
function bottle(factor, shapeIndex, opts) {
  opts = opts || {};
  const S = SHAPES[(shapeIndex || 0) % SHAPES.length];
  const MIN = opts.min || 74, MAX = opts.max || 190;
  const h = Math.round(MIN + (MAX - MIN) * Math.max(0, Math.min(1, factor)));
  const w = S.w, cx = w / 2;
  const neckW = 11, nx = cx - neckW / 2;
  const neckEnd = S.neck;
  const shoulderEnd = S.neck + S.shoulder;
  const bx = cx - S.bodyW / 2, bx2 = cx + S.bodyW / 2;
  const base = h - 1, r = 3;

  // neck up the left, over the lip, down the right, out to the shoulder,
  // down the body, round the base, back up.
  const d =
    `M${nx} 5` +
    `V${neckEnd}` +
    `C${nx} ${neckEnd + S.shoulder * .55} ${bx} ${shoulderEnd - S.shoulder * .5} ${bx} ${shoulderEnd}` +
    `V${base - r}` +
    `a${r} ${r} 0 0 0 ${r} ${r}` +
    `H${bx2 - r}` +
    `a${r} ${r} 0 0 0 ${r} ${-r}` +
    `V${shoulderEnd}` +
    `C${bx2} ${shoulderEnd - S.shoulder * .5} ${nx + neckW} ${neckEnd + S.shoulder * .55} ${nx + neckW} ${neckEnd}` +
    `V5` +
    `a${neckW / 2} 2.6 0 0 0 ${-neckW} 0Z`;

  // capsule over the cork, and a label band at a constant proportion
  const capH = 13;
  const labelTop = shoulderEnd + (base - shoulderEnd) * .22;
  const labelH = Math.max(10, (base - shoulderEnd) * .34);

  const cls = opts.cls || "";
  const svg =
    `<svg class="btl ${cls}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" ` +
    `role="img" aria-label="${opts.label || "bottle"}" ` +
    `fill="none" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round">` +
      `<path class="btl-body" d="${d}"/>` +
      (opts.empty ? "" :
        `<path class="btl-cap" d="M${nx} 5.5h${neckW}v${capH}h${-neckW}z"/>` +
        `<path class="btl-label" d="M${bx + 2} ${labelTop}h${S.bodyW - 4}v${labelH}h${-(S.bodyW - 4)}z"/>`) +
    `</svg>`;

  return { svg, h, w, shape: S.name };
}

/* ---------------------------------------------------------------- frames */
/**
 * plate(p, opts) — one photobook plate.
 * Renders the photograph if p.src is set. Otherwise draws an empty plate that
 * states its own aspect and carries its caption: a shape waiting for a picture,
 * rather than a grey rectangle apologising for one.
 */
function plate(p, opts) {
  opts = opts || {};
  const ratio = (p.w / p.h) || 1;
  const cls = opts.cls || "";
  if (p.src) {
    return `<figure class="plate has-shot ${cls}" style="--ar:${ratio}">` +
      `<img src="${p.src}" alt="${(p.cap || "").replace(/"/g, "&quot;")}" loading="lazy">` +
      (p.cap ? `<figcaption>${p.cap}</figcaption>` : "") + `</figure>`;
  }
  // One registration tick in the corner, drawn in CSS so its arms stay equal
  // whatever the plate's aspect. An SVG stretched to fit distorts them.
  return `<figure class="plate is-empty ${cls}" style="--ar:${ratio}">` +
    `<div class="plate-well" aria-hidden="true">` +
      icon(opts.mark || "camera", "plate-mark") +
    `</div>` +
    (p.cap ? `<figcaption>${p.cap}</figcaption>` : "") + `</figure>`;
}

global.SV = { icon, bottle, plate, SHAPES, PATHS: P };
})(window);
