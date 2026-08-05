/* ===========================================================================
   SAUCE DAY — the loading screen.

   A San Marzano goes from whole tomato to a sealed jar in thirty-six frames.
   Loaded as a CLASSIC script, on purpose: it sits right after the markup in
   index.html so it starts the moment the parser reaches it, well before the
   deferred module graph in js/app.js has even been fetched. The splash is
   covering that fetch, so it cannot wait for it.

   Contract with app.js:
     window.SAUCE_SPLASH.done  — a promise that settles when the animation has
                                 run its course. app.js awaits it, so the app
                                 appears when the sauce is jarred and not before.
     window.SAUCE_SPLASH.dismiss() — fade out and remove.

   It always dismisses. If the sprite sheet 404s, if decoding stalls, if
   anything at all goes wrong, the failsafe below tears it down anyway. A
   loading screen that can trap you inside it is worse than no loading screen.
   =========================================================================== */
(function () {
  "use strict";

  var COLS = 6, ROWS = 6, FRAMES = 36;
  var FRAME_MS = 125;               // 36 x 125 = 4.5s
  var FAILSAFE_MS = 8000;           // hard ceiling, whatever happens

  var LABELS = [
    "Selecting tomato",
    "Checking ripeness",
    "Crushing gently",
    "Breaking it down",
    "Ready for the pot",
    "Simmering slowly",
    "Stirring the sauce",
    "Sauce is ready"
  ];

  var root = document.getElementById("splash");
  if (!root) return;

  var sprite = root.querySelector(".sp-sprite");
  var label  = root.querySelector(".sp-label");
  var cells  = [].slice.call(root.querySelectorAll(".sp-cell"));
  var pct    = root.querySelector(".sp-pct");

  var reduced = window.matchMedia &&
                window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var settle, done = new Promise(function (res) { settle = res; });
  var finished = false, raf = null, failsafe = null;
  var TOTAL_MS = FRAMES * FRAME_MS;

  function paint(i) {
    var col = i % COLS, row = Math.floor(i / COLS);
    // background-size is 600% 600%, so each step is 100/(n-1) = 20%
    sprite.style.backgroundPosition =
      (col * (100 / (COLS - 1))) + "% " + (row * (100 / (ROWS - 1))) + "%";

    var stage = Math.min(LABELS.length - 1,
      Math.floor((i / (FRAMES - 1)) * (LABELS.length - 1) + 0.001));
    label.textContent = LABELS[stage];

    var progress = (i + 1) / FRAMES;
    for (var c = 0; c < cells.length; c++) {
      cells[c].classList.toggle("on", progress >= (c + 1) / cells.length);
    }
    pct.textContent = Math.round(progress * 100) + "%";
    root.classList.toggle("is-done", i === FRAMES - 1);
  }

  function finish() {
    if (finished) return;
    finished = true;
    if (raf) cancelAnimationFrame(raf);
    clearTimeout(failsafe);
    settle();
  }

  function dismiss() {
    finish();
    if (root.classList.contains("is-gone")) return;
    root.classList.add("is-gone");
    // matches the CSS transition; remove so it can never eat a tap
    setTimeout(function () { root.remove(); }, 460);
  }

  if (reduced) {
    paint(FRAMES - 1);                       // show the jar, hold, move on
    failsafe = setTimeout(finish, FAILSAFE_MS);
    setTimeout(finish, 600);
  } else {
    paint(0);
    // Start the clock the first time the tab is actually looked at.
    //
    // Two things bite otherwise. setInterval gets clamped to roughly 1Hz in a
    // backgrounded tab, which stretches a 4.5s splash into a 36s one; and rAF
    // does not run in a hidden tab at all, which freezes it on frame one. So:
    // drive the frame off elapsed wall-clock (a throttled tick then skips
    // frames rather than stretching), and do not start that clock until the
    // page is visible. Open the link in a background tab, come to it a minute
    // later, and you still get the whole tomato-to-jar run from the top.
    var t0 = null;

    var step = function (now) {
      if (finished) return;
      var elapsed = now - t0;
      if (elapsed >= TOTAL_MS) { paint(FRAMES - 1); finish(); return; }
      paint(Math.min(FRAMES - 1, Math.floor(elapsed / FRAME_MS)));
      raf = requestAnimationFrame(step);
    };

    var begin = function () {
      if (t0 !== null || finished) return;
      t0 = performance.now();
      // the failsafe covers the run itself, not the wait for someone to look
      failsafe = setTimeout(finish, FAILSAFE_MS);
      raf = requestAnimationFrame(step);
    };

    if (document.hidden) {
      document.addEventListener("visibilitychange", function onVis() {
        if (document.hidden) return;
        document.removeEventListener("visibilitychange", onVis);
        begin();
      });
      // A tab that is never brought forward must not hold the app hostage
      // either — settle quietly so it is ready the moment it is opened.
      setTimeout(function () { if (t0 === null) finish(); }, FAILSAFE_MS);
    } else {
      begin();
    }
  }

  window.SAUCE_SPLASH = { done: done, dismiss: dismiss };
})();
