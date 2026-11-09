// ============================================================================
// BLEED PROBE — find page bleed (horizontal overflow) and oversized boxes
// (spatial hallucination: a box much bigger than the text it holds) on both
// surfaces, across the project's real width range.
//
//   node .qa/bleed-probe.mjs            # against local servers
//   node .qa/bleed-probe.mjs --live     # against the live hosts
//
// Local servers: .qa/serve.mjs 5312 public  and  .qa/serve.mjs 5311 axiomx
// ============================================================================

import { chromium } from 'playwright';

const LIVE = process.argv.includes('--live');
const AXIOM = LIVE ? 'https://axiom.nonarkara.org/' : 'http://127.0.0.1:5312/';
const AXIOMX = LIVE ? 'https://axiomx.nonarkara.org/' : 'http://127.0.0.1:5311/';

const WIDTHS = [320, 360, 390, 414, 480, 520, 600, 640, 700, 760, 768, 820, 900, 1024, 1080, 1200, 1280, 1366, 1440, 1600, 1920, 2560, 3440];

const PROBE = () => {
  const vw = window.innerWidth;
  const doc = document.documentElement;
  const overflowX = Math.round(doc.scrollWidth - doc.clientWidth);

  // elements that stick out past the viewport's right edge (or left)
  const bleeders = [];
  if (overflowX > 0) {
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) continue;
      const right = Math.round(r.right + window.scrollX);
      const left = Math.round(r.left + window.scrollX);
      if (right > vw + 1 || left < -1) {
        bleeders.push({
          tag: el.tagName,
          cls: (el.className && String(el.className).split(' ')[0]) || '',
          id: el.id || '',
          left, right, w: Math.round(r.width),
          text: (el.textContent || '').trim().slice(0, 30),
        });
      }
    }
    // keep the outermost offenders only
    bleeders.sort((a, b) => (b.right - vw) - (a.right - vw));
  }

  // oversized boxes: a visible box (bg or border) whose width is far beyond
  // the text it holds, or whose height is far beyond its line count.
  const boxes = [];
  const sels = '.chip, .btn, .hero-stat, .hero-node, .hero-badge, .stat, .card, .tile, .tag, .pill, .sys-cell, .btn--ghost, .hero-link, [class*="badge"], [class*="chip"], [class*="pill"]';
  for (const el of document.querySelectorAll(sels)) {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0 || cs.display === 'none' || cs.visibility === 'hidden') continue;
    const hasChrome = (parseFloat(cs.borderTopWidth) > 0) || cs.backgroundImage !== 'none' ||
      (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)');
    if (!hasChrome) continue;
    const text = (el.textContent || '').trim();
    if (!text) continue;
    // measure the text at the element's own font
    const probe = document.createElement('span');
    probe.textContent = text;
    probe.style.font = cs.font;
    probe.style.whiteSpace = 'nowrap';
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    document.body.appendChild(probe);
    const textW = probe.getBoundingClientRect().width;
    document.body.removeChild(probe);
    const textH = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4;
    const lines = Math.max(1, Math.round((r.height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)) / textH));
    const needW = textW + parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) + parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
    const needH = textH * lines + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    const wRatio = +(r.width / Math.max(needW, 1)).toFixed(2);
    const hRatio = +(r.height / Math.max(needH, 1)).toFixed(2);
    if (wRatio > 2.0 || hRatio > 1.8) {
      boxes.push({
        tag: el.tagName,
        cls: (el.className && String(el.className).split(' ')[0]) || '',
        text: text.slice(0, 24),
        w: Math.round(r.width), needW: Math.round(needW), wRatio,
        h: Math.round(r.height), needH: Math.round(needH), hRatio,
      });
    }
  }

  // dead void in first screen: an empty band (no visible children with text
  // or media) larger than 1/3 of the first screen
  const voidBands = [];
  const vh = window.innerHeight;
  const bandLimit = vh / 3;
  for (const el of document.querySelectorAll('body > *, body > * > section, body > * > div, main > *, section > div, #hero > div')) {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (r.top > vh || r.bottom < 0) continue;
    if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) continue;
    const h = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    if (h < bandLimit) continue;
    const hasContent = [...el.querySelectorAll('*')].some((c) => {
      const ccs = getComputedStyle(c);
      if (ccs.display === 'none' || ccs.visibility === 'hidden') return false;
      if ((c.textContent || '').trim().length > 0) return true;
      if (c.tagName === 'IMG' || c.tagName === 'CANVAS' || c.tagName === 'VIDEO' || c.tagName === 'SVG') return true;
      const cr = c.getBoundingClientRect();
      return cr.width > 24 && cr.height > 24 && ((parseFloat(ccs.borderTopWidth) > 0) || (ccs.backgroundColor && ccs.backgroundColor !== 'rgba(0, 0, 0, 0)'));
    });
    if (!hasContent) voidBands.push({ tag: el.tagName, cls: (el.className && String(el.className).split(' ')[0]) || '', h: Math.round(h) });
  }

  return { vw, vh, overflowX, bleeders: bleeders.slice(0, 6), boxes: boxes.slice(0, 12), voidBands };
};

const surfaces = [
  { name: 'axiom', url: AXIOM },
  { name: 'axiomx', url: AXIOMX, hash: '#flood-ami' },
];

const browser = await chromium.launch();
const report = { bleeds: [], boxes: [], voids: [] };

for (const s of surfaces) {
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(s.url + (s.hash || ''), { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(surface => surface === 'axiom'
      ? document.querySelector('#heroMap')
      : document.querySelector('#plate'), s.name);
    await page.evaluate(() => document.fonts.ready.then(() => undefined));
    await page.waitForTimeout(1200);
    const m = await page.evaluate(PROBE);
    for (const b of m.bleeders) report.bleeds.push({ surface: s.name, width: w, overflowX: m.overflowX, ...b });
    for (const b of m.boxes) report.boxes.push({ surface: s.name, width: w, ...b });
    for (const v of m.voidBands) report.voids.push({ surface: s.name, width: w, ...v });
    if (errors.length) console.log(`${s.name}@${w}: JS errors: ${errors.slice(0, 2).join(' | ')}`);
    await ctx.close();
  }
}

console.log('\n=== PAGE BLEED (horizontal overflow) ===');
if (!report.bleeds.length) console.log('  none');
for (const b of report.bleeds) {
  console.log(`  ${b.surface}@${b.width}: +${b.overflowX}px  ${b.tag}.${b.cls}${b.id ? '#' + b.id : ''} left=${b.left} right=${b.right} w=${b.w}  "${b.text}"`);
}

console.log('\n=== OVERSIZED BOXES (wRatio > 2 / hRatio > 1.8) ===');
if (!report.boxes.length) console.log('  none');
const uniq = new Map();
for (const b of report.boxes) {
  const k = `${b.surface}|${b.cls}|${b.text}`;
  if (!uniq.has(k)) uniq.set(k, b);
}
for (const b of uniq.values()) {
  console.log(`  ${b.surface}@${b.width}: ${b.tag}.${b.cls} "${b.text}"  w ${b.w}/${b.needW} (${b.wRatio}x)  h ${b.h}/${b.needH} (${b.hRatio}x)`);
}

console.log('\n=== DEAD VOIDS (empty band > 1/3 first screen) ===');
if (!report.voids.length) console.log('  none');
for (const v of report.voids) console.log(`  ${v.surface}@${v.width}: ${v.tag}.${v.cls} ${v.h}px`);

await browser.close();
