import { chromium } from 'playwright';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';

const args = process.argv.slice(2);
const value = (key, fallback) => args.includes(key) ? args[args.indexOf(key) + 1] : fallback;
const mode = value('--mode', 'check');
const base = process.env.AXIOM_URL || 'http://127.0.0.1:5312/';
const out = value('--out', '/tmp/axiom-compact-' + mode);
const locales = args.includes('--all-locales') ? ['en', 'th', 'zh', 'ko', 'ja', 'vi', 'ts'] : ['en'];
const widths = [390, 1024, 1280, 1440];
const budgets = mode === 'check' || mode === 'falsify'
  ? JSON.parse(readFileSync(new URL('../design/compact-budgets.json', import.meta.url), 'utf8')) : null;
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const report = [];
const failures = [];
const measure = () => {
  const box = selector => {
    const e = document.querySelector(selector), r = e.getBoundingClientRect();
    return { width: r.width, height: r.height, top: r.top + scrollY, bottom: r.bottom + scrollY };
  };
  const rows = selector => [...document.querySelectorAll(selector)].map(e => e.getBoundingClientRect().height);
  const text = selector => [...document.querySelectorAll(selector)].map(e => e.textContent.trim());
  return {
    viewport: innerWidth, page: document.documentElement.scrollHeight,
    hero: box('#hero'), why: box('#why'), field: box('#groundTruth'), contact: box('#contact'), footer: box('.foot'),
    map: box('#heroMap'), mapWindow: box('.hero-map-space'),
    chrome: box('.masthead'), title: box('.hero-title'), actions: box('.hero-actions'),
    console: box('.hero-console'), nodes: rows('.hero-node'),
    consoleName: box('.hero-console__title-wrap'),
    fieldVideo: box('.field-band__video-wrap'), fieldActions: box('.field-band__actions'),
    fieldLead: box('.field-band__line'), firstPoint: box('.field-band__point'),
    proofs: rows('#why .grid--4 > .cell'), faq: rows('#why .numbered'),
    systems: document.querySelectorAll('.sys-cell[data-arch]').length,
    pins: document.querySelectorAll('.sat-project-pin').length,
    canvas: (() => {
      const c = document.querySelector('#heroCanvas');
      const pixels = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
      let painted = false;
      for (let i = 3; i < pixels.length; i += 4) if (pixels[i]) { painted = true; break; }
      return { width: c.width, height: c.height, painted };
    })(),
    copy: text('#why [data-i18n], #groundTruth [data-i18n], #contact [data-i18n]'),
    font: getComputedStyle(document.querySelector('#why .t-body-2')).fontSize,
    targets: [...document.querySelectorAll('.hero-actions .btn, .hero-node, .hero-console__tab, #mapModeBtn, #why .btn, #groundTruth .btn, .field-band__play-btn, #contact .btn')].filter(e => e.getBoundingClientRect().width).map(e => ({ text: e.textContent.trim(), height: e.getBoundingClientRect().height })),
    overflow: document.documentElement.scrollWidth - innerWidth
  };
};

try {
  for (const locale of locales) for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 } });
    if (mode === 'falsify') {
      assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname), 'falsification is local only');
      for (const file of ['index.html', 'rams.css', 'hero.css']) {
        const body = execFileSync('git', ['show', budgets.beforeCommit + ':public/' + file], { encoding: 'utf8', maxBuffer: 2000000 });
        await context.route(url => url.origin === new URL(base).origin && url.pathname === (file === 'index.html' ? '/' : '/' + file),
          route => route.fulfill({ body, contentType: file.endsWith('.css') ? 'text/css' : 'text/html' }));
      }
    }
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(new URL('?lang=' + locale, base).href, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.documentElement.dataset.locale && document.querySelector('#heroMap .leaflet-tile-loaded'));
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => {
      const button = document.getElementById('mapModeBtn');
      if (button.getAttribute('aria-pressed') === 'true') button.click();
    });
    await page.waitForTimeout(350);
    if (mode === 'prototype-a' || mode === 'prototype-b') {
      await page.evaluate(mode => {
        const next = key => document.querySelector('[data-i18n="pitch.' + key + '"]').nextElementSibling;
        next('howLabel').classList.add('pitch-steps');
        const faq = next('faqLabel');
        faq.classList.add('pitch-faq');
        if (mode === 'prototype-b') {
          const items = [...faq.children];
          for (const group of [items.slice(0, 3), items.slice(3)]) {
            const col = document.createElement('div');
            group.forEach(item => col.appendChild(item));
            faq.appendChild(col);
          }
          faq.lastElementChild.appendChild(document.querySelector('#why .btn-row'));
        }
      }, mode);
      await page.addStyleTag({ content: mode === 'prototype-a'
        ? '@media(min-width:760px){.pitch-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;align-items:start}.pitch-steps .numbered{border:0}}'
        : '@media(min-width:760px){.pitch-faq{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;align-items:start}}' });
    }
    const m = await page.evaluate(measure);
    m.locale = locale;
    m.errors = errors;
    if (locale === 'en') {
      await page.screenshot({ path: out + '/hero-' + width + '.png' });
      for (const [name, selector] of [['why', '#why'], ['field', '#groundTruth'], ['contact', '#contact']]) {
        await page.evaluate(selector => {
          const y = document.querySelector(selector).getBoundingClientRect().top + scrollY;
          window.scrollTo({ top: y - document.querySelector('.masthead').getBoundingClientRect().height - 8, behavior: 'instant' });
        }, selector);
        await page.screenshot({ path: out + '/' + name + '-' + width + '.png' });
      }
    }
    if (budgets) {
      const b = budgets.widths[String(width)];
      const violations = [];
      // English is the measured reading budget; other editions retain their full copy.
      if (locale === 'en') for (const [name, max] of Object.entries(b.maxHeights)) {
        if (m[name].height > max) violations.push(name + ' ' + Math.round(m[name].height) + ' > ' + max);
      }
      if (m.actions.bottom > (width === 390 ? 844 : 900)) violations.push('primary actions below first screen');
      if (m.fieldActions.bottom - m.field.top + m.chrome.height > (width === 390 ? 844 : 900)) violations.push('video and its next action are separated beyond the first field screen');
      if (m.fieldActions.top - m.fieldVideo.bottom > 100) violations.push('video action too far from its evidence');
      if (m.firstPoint.top - m.fieldLead.bottom > 24) violations.push('field lead-in separated from its points');
      if (m.consoleName.width <= 1 || m.consoleName.height <= 1) violations.push('console name hidden');
      if (width === 390 && m.mapWindow.height < 180) violations.push('operating map window shrank');
      if (m.map.height < b.minMapHeight) violations.push('map too small');
      if (m.systems !== 75 || m.pins !== 20 || !m.canvas.painted || m.copy.length !== 64 || m.faq.length !== 8) violations.push('earned content missing');
      if (m.nodes.some(h => h < 44)) violations.push('theatre target below 44px');
      if (m.targets.some(t => t.height < 44)) violations.push('an affected control is below 44px');
      if (m.font !== '13px') violations.push('body type changed');
      if (m.overflow > 0 || errors.length) violations.push('overflow or runtime error');
      m.violations = violations;
      if (violations.length) failures.push({ width, locale, violations });
    }
    // Every view and native fold remains reachable; no new collapsed content.
    for (const id of ['tabBtnSystems', 'tabBtnImpact', 'tabBtnTrends', 'tabBtnDossier']) {
      const tab = page.locator('#' + id);
      await tab.click();
      assert.equal(await page.locator('.hero-console__panel:not([hidden])').count(), 1);
      assert.equal(await tab.getAttribute('aria-selected'), 'true');
      assert.equal(await page.locator('#' + await tab.getAttribute('aria-controls')).getAttribute('hidden'), null);
    }
    if (locale === 'en' && width === 1280) {
      const frame = await page.locator('#heroCanvas').evaluate(c => c.toDataURL());
      await page.waitForTimeout(100);
      assert.notEqual(await page.locator('#heroCanvas').evaluate(c => c.toDataURL()), frame, 'canvas still moves');
      assert.equal(await page.locator('#fieldVideoWrap iframe').count(), 0, 'field video remains a poster until requested');
      await page.locator('.field-band__play-btn').click();
      await page.locator('#fieldVideoWrap iframe').waitFor();
      assert.match(await page.locator('#fieldVideoWrap iframe').getAttribute('src'), /autoplay=1/);
    }
    await page.evaluate(() => document.querySelectorAll('.fold-row').forEach(e => { e.open = true; }));
    m.expanded = await page.evaluate(() => ({ page: document.documentElement.scrollHeight, overflow: document.documentElement.scrollWidth - innerWidth, folds: document.querySelectorAll('.fold-row[open]').length, disclosures: [...document.querySelectorAll('summary')].filter(e => e.getBoundingClientRect().width).map(e => ({ text: e.textContent.trim(), height: e.getBoundingClientRect().height })) }));
    assert.equal(m.expanded.overflow, 0);
    if (mode === 'check') assert.ok(m.expanded.disclosures.every(d => d.height >= 44), 'all native disclosures have 44px targets');
    assert.deepEqual(errors, [], 'no runtime errors after exercising the views');
    report.push(m);
    console.log(`${mode} ${locale} ${width}: hero=${Math.round(m.hero.height)} why=${Math.round(m.why.height)} field=${Math.round(m.field.height)} contact=${Math.round(m.contact.height)} page=${m.page}`);
    await context.close();
  }
} finally {
  await browser.close();
}
writeFileSync(out + '/report.json', JSON.stringify({ base, mode, report, failures }, null, 2) + '\n');
if (mode === 'falsify') {
  assert.equal(failures.length, widths.length, 'every original English layout must break its new compactness budget');
  assert.ok(failures.every(f => f.violations.some(v => /^(hero|why|field|contact|footer) \d+ >/.test(v))), 'each original case must fail a measured height, not only a control check');
  console.log('PASS falsifier: all four original layouts failed the compactness budgets.');
} else if (failures.length) {
  console.error(failures);
  process.exitCode = 1;
}
