// ============================================================================
//  The jar wall. A grid of drawn mason jars, twelve to a row, because twelve
//  to a box is how they come off the shelf at Canadian Tire — one row IS one
//  pack. Before the day it reads what's on hand against what's required;
//  once the year is counted it reads yield, with the fallen soldiers tipped
//  over where they fell.
//
//  Pure: numbers in, one <svg> out. Same hand as the bottles in icons.js —
//  stroked in currentColor, weight 1.3, no decoration the glyph doesn't need.
// ============================================================================

const COLS = 12;

// One jar on an 18x24 box: lid disc, screw band, shouldered body.
const JAR_W = 18, JAR_H = 24;
const BODY =
  "M4.6 6.2 V7.4 C3.5 8.1 2.9 9 2.9 10.2 V19.9 A2.1 2.1 0 0 0 5 22 " +
  "H13 A2.1 2.1 0 0 0 15.1 19.9 V10.2 C15.1 9 14.5 8.1 13.4 7.4 V6.2 Z";
const LID  = '<rect x="4.6" y="1.4" width="8.8" height="2.2"/>';
const BAND = '<rect x="3.9" y="3.6" width="10.2" height="2.4"/>';
// the one that didn't make it: a crack down the shoulder
const CRACK = '<path d="M7.2 8.6l1.5 2.5-1.1 1.7 1.9 3.1" fill="none"/>';

const GAP_X = 4, GAP_Y = 5;
const PITCH_X = JAR_W + GAP_X, PITCH_Y = JAR_H + GAP_Y;

// The fill animates once per page load. Realtime re-renders repaint the wall
// silently — a wave that replayed on every ticked checkbox would be noise.
let hasAnimated = false;

/**
 * jarWall({ total, full, fallen = 0, mode = "prep" }) -> <svg>
 *
 *   total  — jars the plan calls for (grid size)
 *   full   — prep: on hand · yield: filled and sealed
 *   fallen — yield only: broke in the bath, drawn tipped over
 *   mode   — "prep" | "yield", changes the aria sentence and the fallen slot
 *
 * total = 0 renders one ghost row of twelve: the plan has no bushel count yet.
 */
export function jarWall({ total = 0, full = 0, fallen = 0, mode = "prep" } = {}) {
  const ghost = total <= 0;
  const n = ghost ? COLS : total;
  full = Math.max(0, Math.min(ghost ? 0 : full, n));
  fallen = Math.max(0, Math.min(fallen, n - full));

  // Guard for a plan gone silly: past 20 packs the wall stops being readable
  // as individual jars, so it becomes one glyph per pack instead.
  const perGlyph = n > 240 ? COLS : 1;
  const glyphs = Math.ceil(n / perGlyph);
  const rows = Math.ceil(glyphs / COLS);

  const w = Math.min(glyphs, COLS) * PITCH_X - GAP_X;
  const hgt = rows * PITCH_Y - GAP_Y;

  const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("viewBox", `0 0 ${w} ${hgt}`);
  s.setAttribute("fill", "none");
  s.setAttribute("stroke-width", "1.3");
  s.setAttribute("stroke-linejoin", "round");
  s.setAttribute("role", "img");
  s.setAttribute("class", "jw" + (ghost ? " ghost" : ""));
  s.setAttribute("aria-label", ghost
    ? "No jar plan yet"
    : mode === "yield"
      ? `${full} jars filled${fallen ? `, ${fallen} fallen soldiers` : ""}, of ${n} planned`
      : `${full} of ${n} jars on hand`);

  const animate = !ghost && !hasAnimated;
  if (!ghost) hasAnimated = true;

  let body = `<defs>
    <g id="jw-glass">${LID}${BAND}<path d="${BODY}"/></g>
    <g id="jw-sauce"><rect x="4.6" y="1.4" width="8.8" height="2.2"/><path d="${BODY}"/></g>
  </defs>`;

  for (let i = 0; i < glyphs; i++) {
    const x = (i % COLS) * PITCH_X, y = Math.floor(i / COLS) * PITCH_Y;
    const count = Math.min(perGlyph, n - i * perGlyph);
    const fullHere = Math.max(0, Math.min(count, full - i * perGlyph));
    // in pack mode a pack is "full" only when every jar in it is
    const isFull = perGlyph === 1 ? fullHere === 1 : fullHere === count && count > 0;
    const isFallen = perGlyph === 1 && !isFull && (i - full) < fallen && i >= full;

    // fallen jars lie down: rotate about the cell centre, land on the row base
    const tf = isFallen
      ? `translate(${x} ${y}) rotate(90 ${JAR_W / 2} ${JAR_H / 2}) translate(0 -3)`
      : `translate(${x} ${y})`;
    const cls = "jw-cell " + (isFallen ? "is-fallen" : isFull ? "is-full" : "is-empty");
    const delay = animate ? ` style="animation-delay:${i * 8}ms"` : "";

    body += `<g class="${cls}${animate ? " in" : ""}" transform="${tf}"${delay} aria-hidden="true">` +
      ((isFull || isFallen) ? `<use href="#jw-sauce" class="jw-fill"/>` : "") +
      `<use href="#jw-glass" class="jw-glass"/>` +
      (isFallen ? CRACK : "") +
      (perGlyph > 1 ? `<text class="jw-n" x="${JAR_W / 2}" y="15">${count}</text>` : "") +
      `</g>`;
  }

  s.innerHTML = body;
  return s;
}

/** Reset the once-per-load animation gate (used by nothing in prod; tests). */
export function resetJarWall() { hasAnimated = false; }
