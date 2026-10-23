// Count check — one number, one meaning.
//
// The catalogue shows its size in three places: the hero stat, the console
// metric and the status strip. A reader can count the catalogue's cards and
// read the status badges on them, so every figure that claims to count
// systems has to agree with them. This asserts that agreement in a browser
// and fails loudly when it breaks, instead of leaving it to a screenshot.
//
//   node .qa/count-check.mjs                      # the live site
//   node .qa/count-check.mjs http://127.0.0.1:5312/   # a local server
//
// Exit code 0 = every figure agrees with what the page can be counted for.

import { chromium } from 'playwright';

const BASE = process.argv[2] || 'https://axiom.nonarkara.org/';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

const m = await page.evaluate(() => {
  const cells = [...document.querySelectorAll('.sys-cell[data-arch]')];
  const byLabel = {};
  let dots = 0;
  let dotsOnNonLive = 0;
  let liveWithoutDot = 0;

  for (const c of cells) {
    const st = c.querySelector('.sys-cell__status');
    const label = st ? st.textContent.trim() : '(none)';
    const hasDot = !!c.querySelector('.dot');
    byLabel[label] = (byLabel[label] || 0) + 1;
    if (hasDot) dots++;
    const isLive = label.toLowerCase() === 'live';
    if (hasDot && !isLive) dotsOnNonLive++;
    if (!hasDot && isLive) liveWithoutDot++;
  }

  const text = (sel) => {
    const e = document.querySelector(sel);
    return e ? e.textContent.trim() : null;
  };

  return {
    cells: cells.length,
    dots,
    dotsOnNonLive,
    liveWithoutDot,
    byLabel,
    consoleLive: text('.hero-console__metric-val'),
    heroCatalog: text('.hero-stat-value'),
    evidenceSystems: text('#evidenceSystems'),
    evidenceLive: text('#evidenceLive'),
  };
});

await browser.close();

const num = (v) => (v === null ? null : Number(v));
const liveLabelled = num(m.consoleLive);
const failures = [];
const ok = (name, pass, detail) => { if (!pass) failures.push(`${name} — ${detail}`); };

console.log(`catalogue cells      ${m.cells}`);
console.log(`blinking dots        ${m.dots}`);
console.log(`status labels        ${JSON.stringify(m.byLabel)}`);
console.log(`console live figure  ${m.consoleLive}`);
console.log(`hero catalogue       ${m.heroCatalog}`);
console.log(`strip systems        ${m.evidenceSystems}`);
console.log(`strip live           ${m.evidenceLive}`);

// 1. A dot is the live indicator: it may only sit on a cell the page calls Live.
ok('dot on a non-live cell', m.dotsOnNonLive === 0, `${m.dotsOnNonLive} dot(s) on a cell that is not live`);
ok('live cell without a dot', m.liveWithoutDot === 0, `${m.liveWithoutDot} live cell(s) with no dot`);

// 2. The console's live figure must equal the number of cells labelled Live.
const labelledLive = m.byLabel.Live || 0;
ok('console live figure', liveLabelled === labelledLive, `console says ${m.consoleLive}, page labels ${labelledLive} Live`);

// 3. The status strip's live figure must agree with the console's.
ok('strip live figure', num(m.evidenceLive) === liveLabelled, `strip says ${m.evidenceLive}, console says ${m.consoleLive}`);

// 4. The catalogue figure must equal the number of cards.
ok('hero catalogue figure', num(m.heroCatalog) === m.cells, `hero says ${m.heroCatalog}, page has ${m.cells} cards`);
ok('strip systems figure', num(m.evidenceSystems) === m.cells, `strip says ${m.evidenceSystems}, page has ${m.cells} cards`);

if (failures.length) {
  console.error(`\nFAIL — ${failures.length} count problem(s):`);
  for (const f of failures) console.error(`  · ${f}`);
  process.exit(1);
}

console.log(`\nPASS — every figure agrees with what the page can be counted for (${liveLabelled} live of ${m.cells}).`);
