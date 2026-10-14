/* ============================================================
   AXIOM — SPEAKING CIRCUIT controls
   ------------------------------------------------------------
   The rail is a fixed-height instrument, not a carousel with
   personality. It has no autoplay, no dots, no easing theatre.
   Two 44x44 buttons page it one card at a time; arrow keys work
   when the rail has focus; the buttons disable at each end so
   the boundary is visible instead of silently doing nothing.

   The scroll position is the source of truth. The buttons never
   own a separate index, which means a trackpad swipe, a scrollbar
   drag, a keyboard and the buttons all stay in agreement without
   any synchronisation code.

   If this file fails to load the rail is still a scrollable row
   of cards. Degradation is a working scroll region, not a hole.
   ============================================================ */

(function () {
  'use strict';

  var rail = document.getElementById('cx-rail');
  var prev = document.querySelector('[data-cx-prev]');
  var next = document.querySelector('[data-cx-next]');
  if (!rail) return;

  var cards = rail.querySelectorAll('.cx-card');
  if (!cards.length) return;

  var reduceMotion = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function step() {
    var first = cards[0];
    if (!first) return rail.clientWidth;
    var styles = window.getComputedStyle(rail);
    var gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
    return first.getBoundingClientRect().width + gap;
  }

  /* Nearest card boundary, so the rail never parks half a card
     off-screen where half the photo and none of the date show. */
  function nearestIndex() {
    var unit = step();
    if (unit <= 0) return 0;
    var raw = rail.scrollLeft / unit;
    return Math.round(raw);
  }

  function sync() {
    var unit = step();
    var max = Math.max(0, rail.scrollWidth - rail.clientWidth);
    var atStart = rail.scrollLeft <= 1;
    var atEnd = rail.scrollLeft >= max - 1;
    if (prev) prev.disabled = atStart;
    if (next) next.disabled = atEnd || unit <= 0;
  }

  function page(direction) {
    var unit = step();
    var target = nearestIndex() + direction;
    var clamped = Math.max(0, Math.min(target, cards.length - 1));
    rail.scrollTo({
      left: clamped * unit,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
    /* Safari honours scrollTo immediately; the scroll event still
       fires, but sync once now so the button states are right even
       if the rail is already at the end and no scroll occurs. */
    window.setTimeout(sync, reduceMotion ? 0 : 320);
  }

  if (prev) {
    prev.addEventListener('click', function () {
      page(-1);
    });
  }
  if (next) {
    next.addEventListener('click', function () {
      page(1);
    });
  }

  rail.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);

  rail.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      page(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      page(-1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      rail.scrollTo({ left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    } else if (event.key === 'End') {
      event.preventDefault();
      rail.scrollTo({
        left: rail.scrollWidth,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    }
  });

  /* Expose for the QA audit; harmless in production. */
  window.AXIOM_CIRCUIT_RAIL = {
    cards: cards.length,
    sync: sync,
  };

  sync();
})();