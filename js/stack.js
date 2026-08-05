// ============================================================================
//  The photograph stack.
//
//  A pile of prints you push off the top with your thumb. Drag it, tap it, or
//  use the arrow keys. Adapted from the Kodak stack prototype — the mechanics
//  and the timing are kept exactly, because that is what makes it feel like
//  paper: resisted drag, velocity projection past the release point, the rear
//  cards easing up a rank as the front one leaves.
//
//  The chrome is Counter's: square corners (a real print has square corners),
//  hairline edge, graphite surround. The warm grade and the grain stay, since
//  those belong to the photograph rather than to the interface.
// ============================================================================

// Depth 0 is the print you are holding. Each one behind sits a little lower
// and a little askew, the way a stack that has been handled actually sits.
const LAYOUTS = [
  { x:  0, y:  0, r:  0,    s: 1     },
  { x:  7, y:  5, r:  1.15, s: 0.985 },
  { x: -6, y: 10, r: -1.55, s: 0.972 },
  { x: 10, y: 14, r:  2.05, s: 0.958 }
];
const DEPTH = LAYOUTS.length;

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * mountStack(host, photos, opts)
 *   photos: [{ url, caption, year }]
 *   Returns { destroy() }.
 */
export function mountStack(host, photos, opts = {}) {
  if (!photos.length) return { destroy() {} };

  host.innerHTML = "";
  host.classList.add("pstage");

  const stack = document.createElement("div");
  stack.className = "pstack";
  stack.tabIndex = 0;
  stack.setAttribute("role", "group");
  stack.setAttribute("aria-roledescription", "photograph stack");
  stack.setAttribute("aria-label",
    "Photograph stack. Drag, tap, or use the left and right arrow keys.");

  const cap = document.createElement("div");
  cap.className = "pcap";
  cap.setAttribute("aria-live", "polite");

  const hint = document.createElement("div");
  hint.className = "phint";
  hint.textContent = "DRAG · TAP · ← →";

  host.append(stack, cap, hint);

  let idx = 0, animating = false, dead = false;

  const layout = (card, depth) => {
    const l = LAYOUTS[depth];
    card.style.setProperty("--x", l.x + "px");
    card.style.setProperty("--y", l.y + "px");
    card.style.setProperty("--r", l.r + "deg");
    card.style.setProperty("--s", l.s);
  };

  function caption() {
    const p = photos[idx];
    cap.classList.add("is-changing");
    setTimeout(() => {
      if (dead) return;
      cap.innerHTML =
        `<span class="ptext">${escapeHtml(p.caption || "")}</span>` +
        `<span class="pcount">${p.year ? p.year + " · " : ""}` +
        `${String(idx + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}</span>`;
      cap.classList.remove("is-changing");
    }, reduced() ? 0 : 170);
  }

  function render() {
    if (dead) return;
    stack.innerHTML = "";
    // back to front, so the front card is last in the DOM and on top
    for (let depth = DEPTH - 1; depth >= 0; depth--) {
      const p = photos[(idx + depth) % photos.length];
      const card = document.createElement("div");
      card.className = "pcard is-loading" + (depth === 0 ? " is-front" : "");
      card.dataset.depth = depth;
      card.style.zIndex = 20 - depth;
      layout(card, depth);

      const img = document.createElement("img");
      img.draggable = false;
      img.alt = p.caption || "Sauce day photograph";
      // No loading="lazy": these are built detached and inserted by a wholesale
      // swap, and Chrome then never registers them with the intersection
      // observer — they sit at currentSrc="" forever, even fully on screen.
      img.decoding = "async";
      img.onload = () => card.classList.remove("is-loading");
      img.onerror = () => { card.classList.remove("is-loading"); card.classList.add("is-error"); };
      img.src = p.url;

      card.appendChild(img);
      stack.appendChild(card);
    }
    attachDrag(stack.querySelector(".is-front"));
    caption();
    animating = false;
  }

  function advance(direction = 1, fromDrag = 0) {
    if (animating || dead) return;
    animating = true;
    host.classList.add("has-interacted");

    const front = stack.querySelector(".is-front");
    if (!front) { animating = false; return; }
    front.classList.add("is-leaving");
    front.classList.remove("is-dragging");

    const sign = direction > 0 ? 1 : -1;
    const travel = Math.max(innerWidth * 0.62, 620);
    front.style.setProperty("--x", sign * travel + "px");
    front.style.setProperty("--y", fromDrag * 0.12 + 18 + "px");
    front.style.setProperty("--r", sign * 13 + "deg");
    front.style.opacity = ".12";

    // everyone behind moves up one rank
    [...stack.children].forEach(c => {
      const d = Number(c.dataset.depth);
      if (d > 0) layout(c, d - 1);
    });

    idx = (idx + direction + photos.length) % photos.length;
    caption();
    opts.onChange?.(idx, photos[idx]);
    setTimeout(render, reduced() ? 0 : 560);
  }

  function attachDrag(card) {
    if (!card) return;
    let sx = 0, sy = 0, lastX = 0, lastT = 0, vx = 0, dragging = false, moved = false;

    card.addEventListener("pointerdown", e => {
      if (animating) return;
      dragging = true; moved = false;
      sx = lastX = e.clientX; sy = e.clientY;
      lastT = performance.now(); vx = 0;
      card.setPointerCapture(e.pointerId);
      card.classList.add("is-dragging");
      host.classList.add("has-interacted");
    });

    card.addEventListener("pointermove", e => {
      if (!dragging) return;
      const now = performance.now(), dx = e.clientX - sx, dy = e.clientY - sy;
      vx = (e.clientX - lastX) / Math.max(1, now - lastT);
      lastX = e.clientX; lastT = now;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
      // resisted: the paper does not follow your finger one for one
      card.style.setProperty("--x", dx * 0.82 + "px");
      card.style.setProperty("--y", dy * 0.42 + "px");
      card.style.setProperty("--r", Math.max(-8, Math.min(8, dx / 28)) + "deg");
      card.style.setProperty("--s", ".995");
      [...stack.children].forEach(rear => {
        const d = Number(rear.dataset.depth);
        if (d > 0) {
          rear.style.setProperty("--x", LAYOUTS[d].x - dx * 0.012 * d + "px");
          rear.style.setProperty("--y", LAYOUTS[d].y - dy * 0.006 * d + "px");
        }
      });
    });

    const finish = e => {
      if (!dragging) return;
      dragging = false;
      card.releasePointerCapture?.(e.pointerId);
      const dx = e.clientX - sx;
      // project where it would land, so a fast flick counts even if it is short
      const projected = dx + vx * 110;
      card.classList.remove("is-dragging");
      if (Math.abs(projected) > 105) {
        advance(projected > 0 ? 1 : -1, e.clientY - sy);
      } else {
        layout(card, 0);
        [...stack.children].forEach(rear => layout(rear, Number(rear.dataset.depth)));
      }
    };
    card.addEventListener("pointerup", finish);
    card.addEventListener("pointercancel", finish);
    card.addEventListener("click", () => { if (!moved) advance(1); });
  }

  const onKey = e => {
    if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") { e.preventDefault(); advance(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); advance(-1); }
  };
  stack.addEventListener("keydown", onKey);

  const onResize = () => {
    if (!animating) [...stack.children].forEach(c => layout(c, Number(c.dataset.depth)));
  };
  addEventListener("resize", onResize);

  render();

  return {
    destroy() {
      dead = true;
      removeEventListener("resize", onResize);
      host.innerHTML = "";
      host.classList.remove("pstage", "has-interacted");
    },
    next: () => advance(1),
    prev: () => advance(-1)
  };
}

const escapeHtml = s => String(s ?? "").replace(/[&<>"]/g,
  c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
