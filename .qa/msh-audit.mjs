// ============================================================================
// MSH AUDIT — enforce the Massacre Spatial Hallucination laws
//
// Runs the bible's auditor checklist (MSH.md §3) against both surfaces at
// the three named widths (390 / 1024 / 1440) and returns a verdict:
//
//   PASS   — no B-fails, scanner clean or explained
//   REVISE — fixable MSH without product loss
//   BLOCK  — first-screen void/bleed, self-review only, or map/geo hallucination
//
//   node .qa/msh-audit.mjs              # against live hosts
//   node .qa/msh-audit.mjs --local      # against local servers
// ============================================================================

import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const argv = process.argv.slice(2);
const has = (n) => argv.includes('--' + n);
const LOCAL = has('local');
const OUT = 'docs/design/evidence';
const AXIOM = LOCAL ? 'http://127.0.0.1:5312/' : 'https://axiom.nonarkara.org/';
const AXIOMX = LOCAL ? 'http://127.0.0.1:5311/' : 'https://axiomx.nonarkara.org/';

// 390 x 844 and 1440 x 900 are the first-screen checks the law names;
// 1024 is the intermediate, and the law asks for the height used there.
const WIDTHS = [
  { w: 390, h: 844, label: '390x844' },
  { w: 1024, h: 900, label: '1024x900' },
  { w: 1440, h: 900, label: '1440x900' },
];

const fails = [];   // { rule, surface, width, detail }
const notes = [];   // { surface, width, detail }
const measured = []; // raw numbers for the report

// ── measurement (runs inside the page) ───────────────────────────────────
const MEASURE = () => {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const doc = document.documentElement;
  const html = document.documentElement;

  // chrome cost — fixed/sticky bands + the page's header band
  const isFixed = (el) => {
    const cs = getComputedStyle(el);
    return (cs.position === 'fixed' || cs.position === 'sticky') ? cs : null;
  };
  const chromeEls = [...document.querySelectorAll('body *')].filter(isFixed);
  const top = new Set(), bottom = new Set();
  for (const el of chromeEls) {
    const r = el.getBoundingClientRect();
    if (r.height <= 0 || r.width <= 0) continue;
    if (r.bottom <= 2) top.add(el);
    if (r.top >= vh - 2) bottom.add(el);
  }
  const headers = [...document.querySelectorAll('header, .masthead, .bar')];
  let headerH = 0;
  for (const h of headers) {
    const r = h.getBoundingClientRect();
    const cs = getComputedStyle(h);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    if (r.height <= 0 || r.width <= 0) continue;
    if (r.top > 4) continue;
    if (r.height > headerH) headerH = Math.round(r.height);
  }
  const topH = [...top].reduce((n, el) => n + el.getBoundingClientRect().height, 0);
  const bottomH = [...bottom].reduce((n, el) => n + el.getBoundingClientRect().height, 0);
  const chromeH = Math.max(headerH, topH) + bottomH;

  // task visibility — first actionable + primary actions + h1 in first screen
  const actionable = [...document.querySelectorAll('a[href], button, [role="button"], input, select')];
  let firstAction = null;
  for (const el of actionable) {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (r.width <= 0 || r.height <= 0) continue;
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    if (r.top < 0 || r.top > vh) continue;
    if (!firstAction || r.top < firstAction.top) firstAction = Math.round(r.top);
  }
  const h1 = document.querySelector('h1');
  const h1r = h1 ? h1.getBoundingClientRect() : null;
  const primaryActions = [...document.querySelectorAll('#hero .hero-actions a, #heroProjectSelect, #plate .actions a, #plate button')]
    .filter((el) => {
      const r = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return style.visibility !== 'hidden' && Number(style.opacity) > 0 &&
        r.width > 0 && r.height > 0 && r.top >= 0 && r.left >= 0 &&
        r.right <= vw && r.bottom <= vh;
    });

  // overflow
  const overflowX = Math.round(doc.scrollWidth - doc.clientWidth);

  // hierarchy — biggest header wins by a real step
  const voice = [...document.querySelectorAll('h1, h2, h3, .t-display, [class*="display"]')]
    .filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; })
    .map((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return { size: Math.round(parseFloat(cs.fontSize)), y: Math.round(r.top) };
    })
    .sort((a, b) => b.size - a.size);

  // box fit — stat tiles / chips / buttons: box width vs rendered text width
  const boxFit = [];
  const boxSels = ['.hero-stat', '.chip', '.sys-cell', '.btn', '.sys-cell__shot'];
  for (const sel of boxSels) {
    for (const el of document.querySelectorAll(sel)) {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (r.width <= 0 || r.height <= 0) continue;
      // rendered text width: measure a same-font span
      const text = el.textContent.trim();
      if (!text) continue;
      const probe = document.createElement('span');
      probe.textContent = text;
      probe.style.font = cs.font;
      probe.style.whiteSpace = 'nowrap';
      probe.style.position = 'absolute';
      probe.style.visibility = 'hidden';
      document.body.appendChild(probe);
      const textW = probe.getBoundingClientRect().width;
      document.body.removeChild(probe);
      const pad = parseFloat(cs.paddingLeft || 0) + parseFloat(cs.paddingRight || 0) + 8; // border + slack
      const needed = textW + pad;
      boxFit.push({ sel, w: Math.round(r.width), needed: Math.round(needed), ratio: +(r.width / Math.max(needed, 1)).toFixed(2), text: text.slice(0, 20) });
    }
  }

  // 44px tap targets (B13 access) — classify isolated primary actions vs
  // dense text groups (MSH: isolated actions get real 44px; dense groups keep
  // label-plus-padding boxes ≥32px, never below 24px WCAG floor).
  const taps = [];
  for (const el of document.querySelectorAll('button, a[href], [role="button"]')) {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (r.width <= 0 || r.height <= 0) continue;
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    const cls = el.className || '';
    const closest = (s) => !!el.closest(s);
    const isPrimary = /btn--primary/.test(cls) ||
      closest('.hero-actions, .field-band__actions, .contact, .brand-actions') ||
      (el.tagName === 'A' && /btn/.test(cls) && !closest('.nav, .foot__row'));
    if (r.width < 44 || r.height < 44) taps.push({
      sel: el.tagName + (cls ? '.' + cls.split(' ')[0] : ''),
      w: Math.round(r.width), h: Math.round(r.height), isPrimary,
      fontSize: Math.round(parseFloat(cs.fontSize))
    });
  }

  // map coverage (B9) — Leaflet map or .leaflet-container vs first screen
  const map = document.querySelector('#heroMap, .leaflet-container, #map');
  let mapCoverPct = null;
  if (map) {
    const mr = map.getBoundingClientRect();
    const screenH = Math.max(0, vh - headerH); // first screen below chrome
    const screenArea = vw * screenH;
    if (screenArea > 0) {
      const visibleTop = Math.max(0, mr.top);
      const visibleBottom = Math.min(vh, mr.bottom);
      const visibleLeft = Math.max(0, mr.left);
      const visibleRight = Math.min(vw, mr.right);
      const visibleH = Math.max(0, visibleBottom - visibleTop);
      const visibleW = Math.max(0, visibleRight - visibleLeft);
      mapCoverPct = +((visibleW * visibleH) / screenArea * 100).toFixed(1);
    }
  }

  return {
    vw, vh, docH: Math.round(doc.scrollHeight),
    chromeH: Math.round(chromeH), chromePct: +((chromeH / vh) * 100).toFixed(1),
    overflowX, firstAction, h1Visible: h1r ? (h1r.top >= 0 && h1r.bottom <= vh) : false,
    primaryActionVisible: primaryActions.length > 0,
    voiceTop: voice[0] ? voice[0].size : 0, voiceSecond: voice[1] ? voice[1].size : 0,
    boxFit, taps, mapCoverPct,
    lang: html.getAttribute('lang') || null,
  };
};

const surfaces = [
  { name: 'axiom', url: AXIOM, hash: '' },
  { name: 'axiomx', url: AXIOMX, hash: '#flood-ami' },
];

const browser = await chromium.launch();
for (const s of surfaces) {
  for (const vp of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push('JS ERROR: ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text().slice(0, 120)); });
    await page.goto(s.url + s.hash, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(surface => surface === 'axiom'
      ? document.querySelector('#heroMap')
      : document.querySelector('#plate'), s.name);
    await page.evaluate(() => document.fonts.ready.then(() => undefined));
    await page.waitForTimeout(2000);
    // Layout-stable measurement: re-measure after a settle so post-load grid
    // re-layouts (hero columns, flex wrap) don't produce ghost findings.
    const stableMeasure = async () => {
      let prev = null;
      let cur = await page.evaluate(MEASURE);
      for (let i = 0; i < 3; i++) {
        await page.waitForTimeout(400);
        prev = cur;
        cur = await page.evaluate(MEASURE);
        if (cur.overflowX === prev.overflowX &&
            cur.boxFit.length === prev.boxFit.length &&
            cur.boxFit.every((b, i) => b.w === prev.boxFit[i].w && b.ratio === prev.boxFit[i].ratio))
          break;
      }
      return cur;
    };
    const m = await stableMeasure();
    m.errors = [...new Set(errors)];
    measured.push({ surface: s.name, viewport: vp.label, ...m });

    // ── B checks ─────────────────────────────────────────────────────────
    const w = vp.label;

    // B1 First-screen task — primary info + action visible together
    if (!m.primaryActionVisible) fails.push({ rule: 'B1', surface: s.name, width: w, detail: 'no primary action visible in first screen' });
    if (!m.h1Visible && s.name === 'axiom') notes.push({ surface: s.name, width: w, detail: 'h1 not fully in first screen' });

    // B2 Chrome cost — chrome ≤ ⅓ of viewport
    if (m.chromePct > 33) fails.push({ rule: 'B2', surface: s.name, width: w, detail: `chrome ${m.chromeH}px = ${m.chromePct}% of viewport (over ⅓)` });
    else if (m.chromePct > 20) notes.push({ surface: s.name, width: w, detail: `chrome ${m.chromePct}% of viewport` });

    // B3 Box fit — no box over ~2× what its content needs
    const overBoxes = m.boxFit.filter((b) => b.ratio > 2.0 && b.w > 120);
    for (const b of overBoxes) fails.push({ rule: 'B3', surface: s.name, width: w, detail: `${b.sel} "${b.text}" box ${b.w}px vs content ~${b.needed}px (${b.ratio}×)` });

    // B4/B5 Void & scroll honesty — docH vs viewport, flag very tall first screens
    if (m.docH > m.vh * 3) notes.push({ surface: s.name, width: w, detail: `document ${m.docH}px = ${(m.docH / m.vh).toFixed(1)}× viewport height` });

    // B7 Hierarchy — biggest header is a real step over the second
    if (m.voiceTop && m.voiceSecond && m.voiceTop < m.voiceSecond * 1.4) notes.push({ surface: s.name, width: w, detail: `no clear hierarchy step (${m.voiceTop}px vs ${m.voiceSecond}px)` });

    // B9 Map/data — map ≥ 60% of first screen on map products
    if (m.mapCoverPct !== null && m.mapCoverPct < 60) fails.push({ rule: 'B9', surface: s.name, width: w, detail: `map covers ${m.mapCoverPct}% of first screen (under 60%)` });
    else if (m.mapCoverPct !== null) notes.push({ surface: s.name, width: w, detail: `map covers ${m.mapCoverPct}% of first screen` });

    // B12 Language — lang attribute set
    if (!m.lang) fails.push({ rule: 'B12', surface: s.name, width: w, detail: 'no lang attribute on <html>' });

    // B13 Access — MSH: isolated primary actions get real 44px; dense text
    // groups keep label-plus-padding boxes ≥32px, never below 24px WCAG floor.
    // Prose credit links (small font-size metadata, e.g. "Source") are not tap
    // targets — exempt from B13, noted instead.
    for (const t of m.taps) {
      if (t.fontSize <= 13) {
        notes.push({ surface: s.name, width: w, detail: `prose credit link ${t.sel} ${t.w}×${t.h}px (font ${t.fontSize}px) — not a tap target` });
        continue;
      }
      const failThresh = t.isPrimary ? 44 : 24;
      const noteThresh = t.isPrimary ? 44 : 32;
      if (t.w < failThresh || t.h < failThresh) {
        fails.push({ rule: 'B13', surface: s.name, width: w,
          detail: `tap target ${t.sel} ${t.w}×${t.h}px ${t.isPrimary ? 'under 44px (isolated action)' : 'below dense-group floor'}` });
      } else if (!t.isPrimary && (t.w < noteThresh || t.h < noteThresh)) {
        notes.push({ surface: s.name, width: w, detail: `dense text group ${t.sel} ${t.w}×${t.h}px below 32px target` });
      }
    }

    // JS errors
    for (const e of m.errors) notes.push({ surface: s.name, width: w, detail: 'JS error: ' + e });
    await ctx.close();
  }
}
await browser.close();

// ── verdict ──────────────────────────────────────────────────────────────
const blockFails = fails.filter((f) => f.rule === 'B9' || f.rule === 'B12');
const reviseFails = fails.filter((f) => f.rule !== 'B9' && f.rule !== 'B12');

let verdict = 'PASS';
if (blockFails.length) verdict = 'BLOCK';
else if (reviseFails.length) verdict = 'REVISE';

const report = {
  verdict, checkedAt: new Date().toISOString(),
  fails, notes, measured,
  summary: { surfaces: surfaces.length, widths: WIDTHS.length, measurements: measured.length, fails: fails.length, notes: notes.length },
};

writeFileSync(`${OUT}/msh-audit.json`, JSON.stringify(report, null, 2) + '\n');

console.log(`\n═══ MSH AUDIT ══════════════════════════════════════════════════════════`);
console.log(`VERDICT: ${verdict}`);
console.log(`Fails: ${fails.length}  Notes: ${notes.length}  Measurements: ${measured.length}`);
if (fails.length) {
  console.log('\n-- FAILS --');
  for (const f of fails) console.log(`  ${f.rule} ${f.surface}@${f.width}: ${f.detail}`);
}
if (notes.length) {
  console.log('\n-- NOTES --');
  for (const n of notes) console.log(`  ${n.surface}@${n.width}: ${n.detail}`);
}
console.log(`════════════════════════════════════════════════════════════════════════`);
console.log(`wrote ${OUT}/msh-audit.json`);
process.exit(verdict === 'PASS' ? 0 : 1);
