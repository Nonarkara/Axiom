// The evidence MSH.md requires before anyone may declare a pass.
//
// The law says: "Source scans and successful builds cannot prove a visual
// pass." So this measures the RENDERED interface — the chrome cost, the
// task visibility, the geometry failures, the hierarchy and the
// preservation — at the three widths the law names, and writes the
// screenshots out so a human can look at them.
//
//   node .qa/msh-evidence.mjs                       # both surfaces, live
//   node .qa/msh-evidence.mjs --local               # against the local servers
//   node .qa/msh-evidence.mjs --out docs/design/evidence
//
// The screenshots are the point. The numbers are what you argue with when
// a screenshot looks wrong and you need to know whether it is.

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const argv = process.argv.slice(2);
const has = (n) => argv.includes('--' + n);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };

const LOCAL = has('local');
const OUT = arg('out', 'docs/design/evidence');
const AXIOM = LOCAL ? 'http://127.0.0.1:5312/' : 'https://axiom.nonarkara.org/';
const AXIOMX = LOCAL ? 'http://127.0.0.1:5311/' : 'https://axiomx.nonarkara.org/';

// 390 x 844 and 1440 x 900 are the first-screen checks the law names.
// 1024 is the intermediate, and the law asks for the height used there.
const WIDTHS = [
  { w: 390, h: 844, label: '390x844' },
  { w: 1024, h: 900, label: '1024x900' },
  { w: 1440, h: 900, label: '1440x900' },
];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const report = [];

// The measurement, run inside the page. It is the same code for both
// surfaces, because the law is the same law.
const MEASURE = () => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const doc = document.documentElement;

  // ── chrome cost ────────────────────────────────────────────────────────
  // The height of every region that is fixed or sticky at the top and at
  // the bottom, plus the page's own header band. Stacked sticky regions
  // count once, combined: that is what they cost the reader.
  const isFixed = (el) => {
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed' || cs.position === 'sticky') return cs;
    return null;
  };
  const chromeEls = [...document.querySelectorAll('body *')].filter((el) => isFixed(el));
  const top = new Set();
  const bottom = new Set();
  for (const el of chromeEls) {
    const r = el.getBoundingClientRect();
    if (r.height <= 0 || r.width <= 0) continue;
    if (r.bottom <= 2) top.add(el);
    if (r.top >= vh - 2) bottom.add(el);
  }
  // The page's own header band, which is not fixed but is chrome all the
  // same: it is above the content and it is not content. There can be more
  // than one header in the document — the reading room has a desktop bar
  // and a phone bar — so take the first one that is actually on screen.
  // Taking the first in the document measures a hidden band and reports
  // the chrome cost as zero, which is a false clean bill.
  const headers = [...document.querySelectorAll('header, .masthead, .bar')];
  let header = null;
  let headerRect = null;
  for (const h of headers) {
    const r = h.getBoundingClientRect();
    const cs = getComputedStyle(h);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    if (r.height <= 0 || r.width <= 0) continue;
    if (r.top > 4) continue;               // a header that is not at the top is content
    if (!header || r.height > headerRect.height) { header = h; headerRect = r; }
  }
  const headerH = headerRect ? Math.round(headerRect.height) : 0;

  const topH = [...top].reduce((n, el) => n + el.getBoundingClientRect().height, 0);
  const bottomH = [...bottom].reduce((n, el) => n + el.getBoundingClientRect().height, 0);
  const chromeH = Math.round(Math.max(headerH, topH) + bottomH);

  // ── task visibility ────────────────────────────────────────────────────
  // The first thing a reader can DO, and whether the page's own subject
  // and that action are on screen together.
  const actionable = [...document.querySelectorAll('a[href], button, [role="button"], input, select')];
  let firstAction = null;
  for (const el of actionable) {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (r.width <= 0 || r.height <= 0) continue;
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    if (r.top > vh) continue;              // below the fold is not visible
    if (r.top < 0) continue;               // scrolled past
    if (!firstAction || r.top < firstAction.top) {
      firstAction = { top: Math.round(r.top), tag: el.tagName, text: (el.textContent || '').trim().slice(0, 40) };
    }
  }
  // The subject of the page: the h1, and where it sits.
  const h1 = document.querySelector('h1');
  const h1r = h1 ? h1.getBoundingClientRect() : null;
  const primaryActions = [...document.querySelectorAll('#hero .hero-actions a, #heroProjectSelect, #plate .actions a, #plate button')]
    .map(el => {
      const r = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return {
        label: (el.getAttribute('aria-label') || el.labels?.[0]?.textContent || el.textContent || '').trim().slice(0, 70),
        selector: el.id ? '#' + CSS.escape(el.id) : el.tagName.toLowerCase() + Array.from(el.classList, name => '.' + CSS.escape(name)).join(''),
        x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height),
        visible: style.visibility !== 'hidden' && Number(style.opacity) > 0 && r.width > 0 && r.height > 0 && r.top >= 0 && r.left >= 0 && r.right <= vw && r.bottom <= vh,
      };
    });
  const assets = [...document.querySelectorAll('script[src], link[rel="stylesheet"]')]
    .map(el => el.src || el.href)
    .filter(url => new URL(url).origin === location.origin);

  // ── geometry failures ──────────────────────────────────────────────────
  const overflowX = doc.scrollWidth - doc.clientWidth;

  // ── hierarchy ──────────────────────────────────────────────────────────
  // The reading order the screenshot should make obvious: the biggest,
  // boldest thing, then the next, then the next.
  const voice = [...document.querySelectorAll('h1, h2, h3, .t-display, [class*="display"]')]
    .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; })
    .map((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''),
        text: (el.textContent || '').trim().slice(0, 34),
        size: Math.round(parseFloat(cs.fontSize)),
        weight: cs.fontWeight,
        y: Math.round(r.top),
      };
    })
    .sort((a, b) => (b.size - a.size) || (a.y - b.y))
    .slice(0, 3);

  return {
    vw, vh,
    docH: Math.round(doc.scrollHeight),
    headerH, topH: Math.round(topH), bottomH: Math.round(bottomH),
    chromeH,
    chromePct: +((chromeH / vh) * 100).toFixed(1),
    firstAction,
    primaryActions,
    assets,
    h1: h1r ? { text: (h1.textContent || '').trim().slice(0, 46), size: Math.round(parseFloat(getComputedStyle(h1).fontSize)), y: Math.round(h1r.top), bottom: Math.round(h1r.bottom) } : null,
    overflowX,
    voice,
  };
};

const surfaces = [
  { name: 'axiom', url: AXIOM, hash: '' },
  { name: 'axiomx', url: AXIOMX, hash: '#flood-ami' },
];

for (const s of surfaces) {
  for (const vp of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push('JS ERROR: ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text().slice(0, 160)); });

    await page.goto(s.url + s.hash, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(surface => surface === 'axiom'
      ? document.documentElement.dataset.locale && document.querySelector('#heroMap .leaflet-tile-loaded')
      : document.querySelector('#plate h1'), s.name);
    await page.evaluate(() => document.fonts.ready.then(() => undefined));
    await page.waitForTimeout(2500);
    const m = await page.evaluate(MEASURE);
    const file = `${OUT}/${s.name}-${vp.label}.png`;
    await page.screenshot({ path: file, fullPage: false });
    report.push({ surface: s.name, viewport: vp.label, file, ...m, errors: [...new Set(errors)] });
    console.log(`${s.name} ${vp.label}  chrome=${m.chromeH}px (${m.chromePct}%)  overflowX=${m.overflowX}  firstAction=${m.firstAction ? m.firstAction.top + 'px' : 'none'}  errors=${errors.length}`);
    await ctx.close();
  }
}

await browser.close();
writeFileSync(`${OUT}/msh-evidence.json`, JSON.stringify(report, null, 2) + '\n');
console.log('\nwrote ' + OUT + '/msh-evidence.json');
