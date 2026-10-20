import { chromium } from 'playwright';
// Defaults to a local server on 5312; set AXIOM_URL to test a deployment.
const BASE = (process.env.AXIOM_URL || 'http://127.0.0.1:5312/').replace(/\/?$/, '/');
const BAND = 21 / 8;
const b = await chromium.launch();
const fails = [];
const ok = [];
const check = (name, cond, detail = '') => (cond ? ok : fails).push(`${name}${detail ? ' — ' + detail : ''}`);

const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
p.on('pageerror', e => fails.push('JS ERROR: ' + e.message));
p.on('console', m => { if (m.type() === 'error') fails.push('CONSOLE: ' + m.text()); });

await p.goto(BASE, { waitUntil: 'networkidle' });
await p.waitForTimeout(600);

// Every thumbnail in the catalogue is one band. A card whose image is taller
// than the band is a card that has left the grid, and the page reads ragged
// where it should read ruled.
//
// The cause is quiet: an <img> carries a height attribute, which the browser
// treats as a presentational hint for the height property. CSS sets width but
// not height, so the hint wins and the aspect-ratio is ignored — a 16:10
// screenshot renders at its own 800px and the band becomes a portrait column.
// This was live on the site before it was caught here.

// Walk the grid so every lazy image is in the viewport and actually decoded.
const ids = await p.evaluate(() =>
  [...document.querySelectorAll('.sys-cell[data-arch]')].map(c => c.dataset.arch));
check('the catalogue has cards to check', ids.length > 0, `${ids.length} cards`);

for (const id of ids) {
  await p.locator(`[data-arch="${id}"]`).scrollIntoViewIfNeeded();
}
await p.waitForTimeout(1500);

const shots = await p.evaluate(() =>
  [...document.querySelectorAll('.sys-cell[data-arch] .sys-cell__shot')].map(img => {
    const b = img.getBoundingClientRect();
    const cell = img.closest('.sys-cell');
    return {
      id: cell ? cell.dataset.arch : '(none)',
      w: Math.round(b.width),
      h: Math.round(b.height),
      ratio: b.width / b.height,
      loaded: img.complete && img.naturalWidth > 0,
      natural: img.naturalWidth + 'x' + img.naturalHeight,
    };
  }));

check('every card has a thumbnail', shots.length === ids.length, `${shots.length} for ${ids.length} cards`);

const offBand = shots.filter(s => Math.abs(s.ratio - BAND) > 0.02);
check('every thumbnail sits in the 21:8 band', offBand.length === 0,
  offBand.map(s => `${s.id} ${s.w}x${s.h} (${s.ratio.toFixed(2)})`).join(', '));

const notLoaded = shots.filter(s => !s.loaded);
check('every thumbnail decoded', notLoaded.length === 0,
  notLoaded.map(s => `${s.id} ${s.natural}`).join(', '));

// The band can be the right shape and still hold a picture that does not
// fill it. object-fit:contain letterboxes the image inside the band against
// a background the same colour as the card, so the picture floats in the
// middle of an empty strip and the card reads as broken. The box is right;
// the fill is not.
const notFilled = await p.evaluate(() =>
  [...document.querySelectorAll('.sys-cell[data-arch] .sys-cell__shot')]
    .map(img => ({ id: img.closest('.sys-cell').dataset.arch, fit: getComputedStyle(img).objectFit }))
    .filter(x => x.fit !== 'cover'));
check('every thumbnail fills its band', notFilled.length === 0,
  notFilled.map(x => `${x.id} ${x.fit}`).join(', '));

// The band is a band: no thumbnail may be taller than the row it shares.
const tallest = shots.reduce((a, s) => (s.h > a.h ? s : a), shots[0]);
const shortest = shots.reduce((a, s) => (s.h < a.h ? s : a), shots[0]);
check('the band is one height across the catalogue', Math.abs(tallest.h - shortest.h) <= 2,
  `tallest ${tallest.id} ${tallest.h}px, shortest ${shortest.id} ${shortest.h}px`);

// A card that leaves the band leaves its row with a hole under the text.
// Each cluster is its own three-wide grid and may end on a short row, so
// only the rows before a grid's last have to be full.
const rows = await p.evaluate(() => {
  const grids = [...document.querySelectorAll('#systems .grid--3, #lab .grid--3')];
  return grids.map(grid => {
    const cells = [...grid.querySelectorAll('.sys-cell[data-arch]')];
    if (!cells.length) return null;
    const tops = cells.map(c => c.getBoundingClientRect().top).sort((a, b) => a - b);
    const buckets = [];
    tops.forEach(t => {
      const near = buckets.find(g => Math.abs(g.top - t) <= 6);
      if (near) near.count++;
      else buckets.push({ top: t, count: 1 });
    });
    return buckets.map(g => g.count);
  }).filter(Boolean);
});
const ragged = rows.flatMap((g, grid) =>
  g.slice(0, -1).filter(n => n !== 3).map(n => `grid ${grid}: a row of ${n}`));
check('every catalogue row is full but the last', ragged.length === 0,
  ragged.join(', ') || rows.map(g => g.join('/')).join('  '));

// And the page must not scroll sideways, which a wide thumbnail would cause.
const overflow = await p.evaluate(() =>
  document.documentElement.scrollWidth - document.documentElement.clientWidth);
check('no sideways overflow', overflow === 0, `${overflow}px`);

await ctx.close();
await b.close();

ok.forEach(line => console.log('  ✓ ' + line));
fails.forEach(line => console.log('  ✗ ' + line));
console.log(`\n${ok.length} PASS, ${fails.length} FAIL`);
process.exit(fails.length ? 1 : 0);
