// ============================================================================
// BOX PROBE — report every visible box whose width or height is far beyond
// what its own text needs (spatial hallucination: a box inflated for no job).
//
//   node .qa/box-probe.mjs
// ============================================================================

import { chromium } from 'playwright';

const AXIOM = 'http://127.0.0.1:5312/';
const AXIOMX = 'http://127.0.0.1:5311/';
const WIDTHS = [{ w: 390, h: 844 }, { w: 1024, h: 900 }, { w: 1440, h: 900 }];

const PROBE = () => {
  const out = [];
  const seen = new Set();
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) continue;
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) continue;
    if (r.width > window.innerWidth + 1) continue;
    const hasChrome = parseFloat(cs.borderTopWidth) > 0 ||
      (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') ||
      cs.backgroundImage !== 'none';
    if (!hasChrome) continue;
    // direct text only (leaf-ish)
    const direct = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
    const text = direct || (el.children.length === 0 ? (el.textContent || '').trim() : '');
    if (!text || text.length > 90) continue;
    const probe = document.createElement('span');
    probe.textContent = text;
    probe.style.font = cs.font;
    probe.style.whiteSpace = 'nowrap';
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    document.body.appendChild(probe);
    const textW = probe.getBoundingClientRect().width;
    document.body.removeChild(probe);
    const fs = parseFloat(cs.fontSize) || 16;
    const lh = parseFloat(cs.lineHeight) || fs * 1.4;
    const pt = parseFloat(cs.paddingTop) || 0, pb = parseFloat(cs.paddingBottom) || 0;
    const pl = parseFloat(cs.paddingLeft) || 0, pr = parseFloat(cs.paddingRight) || 0;
    const bw = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
    const bh = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    const needW = textW + pl + pr + bw;
    const needH = lh + pt + pb + bh;
    const wRatio = +(r.width / Math.max(needW, 1)).toFixed(2);
    const hRatio = +(r.height / Math.max(needH, 1)).toFixed(2);
    const key = el.tagName + '|' + String(el.className).split(' ')[0] + '|' + text.slice(0, 20);
    if ((wRatio > 2.0 && r.width > 100) || (hRatio > 1.8 && r.height > 32)) {
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        tag: el.tagName, cls: String(el.className || '').split(' ')[0],
        text: text.slice(0, 34),
        w: Math.round(r.width), needW: Math.round(needW), wRatio,
        h: Math.round(r.height), needH: Math.round(needH), hRatio,
      });
    }
  }
  out.sort((a, b) => (b.wRatio + b.hRatio) - (a.wRatio + a.hRatio));
  return out.slice(0, 25);
};

const browser = await chromium.launch();
for (const s of [{ name: 'axiom', url: AXIOM }, { name: 'axiomx', url: AXIOMX, hash: '#flood-ami' }]) {
  for (const vp of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
    const page = await ctx.newPage();
    await page.goto(s.url + (s.hash || ''), { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(surface => surface === 'axiom' ? document.querySelector('#heroMap') : document.querySelector('#plate'), s.name);
    await page.evaluate(() => document.fonts.ready.then(() => undefined));
    await page.waitForTimeout(1200);
    const boxes = await page.evaluate(PROBE);
    console.log(`\n──── ${s.name} @ ${vp.w} ────`);
    if (!boxes.length) console.log('  none');
    for (const b of boxes) {
      const flags = [];
      if (b.wRatio > 2) flags.push(`W ${b.w}/${b.needW} = ${b.wRatio}x`);
      if (b.hRatio > 1.8) flags.push(`H ${b.h}/${b.needH} = ${b.hRatio}x`);
      console.log(`  ${b.tag}.${b.cls} "${b.text}" — ${flags.join('  ·  ')}`);
    }
    await ctx.close();
  }
}
await browser.close();
