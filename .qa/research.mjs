import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { researchCopy } from '../scripts/research/copy.mjs';
import { readFileSync } from 'node:fs';
import { bookData } from '../scripts/research/build.mjs';

const dataset = JSON.parse(readFileSync(new URL('../data/research.json', import.meta.url), 'utf8'));
const expectedCount = dataset.papers.length;

const browser = await chromium.launch({ headless: true });
const main = process.env.AXIOM_URL || 'http://localhost:5462/';
const book = process.env.AXIOMX_URL || 'http://localhost:5461/';
let checks = 0;
const check = (value, label) => { assert.ok(value, label); checks++; console.log('PASS ' + label); };

try {
  for (const width of [390, 1024, 1440]) {
    for (const [name, base] of [['main', main], ['book', book]]) {
      const page = await browser.newPage({ viewport: { width, height: 844 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(base + '#research', { waitUntil: 'domcontentloaded' });
      const root = page.locator(name === 'main' ? '#research' : '#plate');
      await root.locator('[data-paper]').first().waitFor();
      await page.waitForFunction(() => {
        const el = document.querySelector('[data-research-map]');
        return el && el.closest('[data-research-library]').dataset.mapState === 'ready' && el.querySelector('svg')?.getBoundingClientRect().width > 0;
      });
      check(await root.locator('[data-paper]').count() === expectedCount, `${name} ${expectedCount} publications @${width}`);
      const geometry = await root.evaluate(el => {
        const rows = [...el.querySelectorAll('[data-paper]')];
        const header = document.querySelector('.masthead') || [...document.querySelectorAll('.bar')].find(node => node.getBoundingClientRect().height > 0);
        const headerRect = header.getBoundingClientRect();
        const controls = [...header.querySelectorAll('a,button')].filter(n => n.getBoundingClientRect().width);
        return {
          overflow: el.scrollWidth - el.clientWidth,
          headerHeight: headerRect.height,
          headerFits: controls.every(n => { const r = n.getBoundingClientRect(); return r.left >= headerRect.left - 1 && r.right <= headerRect.right + 1; }),
          rows: rows.map(row => {
            const title = row.querySelector('h2,h3').getBoundingClientRect();
            const meta = row.querySelector('.research-meta').getBoundingClientRect();
            const coverage = row.querySelector('.research-coverage').getBoundingClientRect();
            const actions = row.querySelector('.research-actions').getBoundingClientRect();
            const bounds = row.getBoundingClientRect();
            return { height: bounds.height, ordered: title.bottom <= meta.top + 1 && meta.bottom <= coverage.top + 1 && coverage.bottom <= actions.top + 1,
              gap: actions.top - coverage.bottom, metadataGap: coverage.top - meta.bottom, firstAction: actions.top - bounds.top };
          })
        };
      });
      check(geometry.overflow <= 1, `${name} no research overflow @${width}`);
      check(geometry.headerFits, `${name} header controls fit their pane @${width}`);
      check(geometry.headerHeight <= 76, `${name} compact header @${width}: ${geometry.headerHeight}px`);
      check(geometry.rows.every(r => r.ordered && r.gap <= 12 && r.metadataGap <= 8 && r.height <= (width === 390 ? 380 : 300)), `${name} title/metadata/coverage/PDF geometry @${width}`);
      const mapGeometry = await root.evaluate(el => {
        const map = el.querySelector('[data-research-map]');
        const rect = map.getBoundingClientRect();
        return { height: rect.height,
          usefulAction: el.querySelector('[data-research-first-pdf]').getBoundingClientRect().bottom,
          paths: [...map.querySelectorAll('path')].filter(path => {
            const bounds = path.getBoundingClientRect();
            return bounds.width > 1 && bounds.height > 1 && bounds.right > rect.left && bounds.left < rect.right && bounds.bottom > rect.top && bounds.top < rect.bottom;
          }).length,
          zoom: [...map.querySelectorAll('.leaflet-control-zoom a')].every(a => { const r = a.getBoundingClientRect(); return r.width >= 44 && r.height >= 44; }) };
      });
      check(mapGeometry.paths > 10, `${name} actual country geometry is in the map viewport @${width}`);
      check(mapGeometry.zoom, `${name} map zoom controls are usable @${width}`);
      check(mapGeometry.height <= 300, `${name} compact geographic index @${width}`);
      check(mapGeometry.usefulAction <= 844, `${name} map-exit PDF is in the first viewport @${width}: ${mapGeometry.usefulAction}`);
      const region = root.locator('[data-research-region]');
      const filter = root.locator('[data-research-filter]');
      await filter.selectOption('AirDash');
      check(await root.locator('[data-paper]:visible').count() === 1, `${name} system filter @${width}`);
      check((await root.locator('[data-paper]:visible').textContent()).includes('Pun Thiengburanathum'), `${name} published author spelling @${width}`);
      await filter.selectOption('');
      await region.selectOption('chiang-mai');
      check(await root.locator('[data-paper]:visible').count() === 1, `${name} provincial region filter @${width}`);
      await filter.selectOption('AirDash');
      check(await region.inputValue() === '', `${name} incompatible system resets region @${width}`);
      await region.selectOption('gulf');
      check(await filter.inputValue() === '', `${name} incompatible region resets system @${width}`);
      check(await root.locator('[data-research-first-pdf]').getAttribute('href') === 'https://axiom.nonarkara.org/research/seeing-a-war-v1.pdf', `${name} map-exit PDF follows selection @${width}`);
      await region.selectOption('');
      await root.scrollIntoViewIfNeeded();
      await page.screenshot({ path: `.qa/research-${name}-${width}.png` });
      // A reintroduced giant metadata/action gap must violate the same geometry budget.
      const caught = await root.evaluate(el => {
        const action = el.querySelector('.research-actions');
        action.style.marginTop = '200px';
        const meta = el.querySelector('.research-coverage').getBoundingClientRect();
        const fail = action.getBoundingClientRect().top - meta.bottom > 12;
        action.style.marginTop = '';
        return fail;
      });
      check(caught, `${name} scattered-action falsifier @${width}`);
      await page.addStyleTag({ content: 'html { font-size: 200% !important; } .research-row h2,.research-row h3,.research-meta,.research-coverage,.research-actions,.research-filter,.research-study,.research-selection { font-size: 200% !important; }' });
      check(await root.evaluate(el => el.scrollWidth <= el.clientWidth + 1), `${name} enlarged text reflows @${width}`);
      check(errors.length === 0, `${name} no script exceptions @${width}: ${errors.join(', ')}`);
      if (name === 'book' && width === 390) {
        await page.locator('#backBtn').click();
        const fits = await page.locator('.index > .bar').evaluate(header => {
          const bounds = header.getBoundingClientRect();
          return bounds.height > 0 && [...header.querySelectorAll('a,button')].every(control => {
            const rect = control.getBoundingClientRect();
            return rect.left >= bounds.left && rect.right <= bounds.right;
          });
        });
        check(fits, 'book phone index header remains usable with enlarged text');
      }
      await page.close();
    }
  }
  for (const [name, base] of [['main', main], ['book', book]]) {
    for (const asset of ['leaflet', 'research-geography']) {
      const page = await browser.newPage();
      await page.route(new RegExp(asset + '(?:\\.min)?\\.js(?:\\?|$)'), route => route.abort());
      await page.goto(base + '#research', { waitUntil: 'domcontentloaded' });
      const library = page.locator('[data-research-library]');
      await library.locator('[data-research-controls]').waitFor();
      check(await library.getAttribute('data-map-state') === 'unavailable', `${name} ${asset} failure is explicitly unavailable`);
      check((await library.locator('option[value="chiang-mai"]').textContent()).includes('Chiang Mai'), `${name} region names survive ${asset} failure`);
      await library.locator('select[data-research-region]').selectOption('chiang-mai');
      check(await library.locator('[data-paper]:visible').count() === 1, `${name} filtering survives ${asset} failure`);
      check((await library.locator('[data-research-first-pdf]').getAttribute('href')).endsWith('gauge-to-shelter-v1.pdf'), `${name} PDF survives ${asset} failure`);
      await page.close();
    }
    const page = await browser.newPage({ javaScriptEnabled: false });
    await page.goto(base + '#research', { waitUntil: 'domcontentloaded' });
    check(await page.locator('[data-paper]:visible').count() === expectedCount, `${name} static bibliography survives disabled JavaScript`);
    check(await page.locator('.research-actions a[download]:visible').count() === expectedCount, `${name} static PDF links remain available`);
    check((await page.locator('[data-research-fallback]').textContent()).includes('require JavaScript'), `${name} no-JavaScript message does not promise inert filters`);
    await page.close();
  }
  const keyboard = await browser.newPage();
  const errors = [];
  keyboard.on('pageerror', error => errors.push(error.message));
  await keyboard.addInitScript(() => {
    const Native = window.ResizeObserver;
    window.__researchObservers = [];
    window.ResizeObserver = class extends Native {
      observe(el, options) {
        if (el.matches('[data-research-map]')) window.__researchObservers.push(this);
        super.observe(el, options);
      }
      disconnect() { this.researchDisconnected = true; super.disconnect(); }
    };
  });
  await keyboard.goto(book + '#research', { waitUntil: 'domcontentloaded' });
  await keyboard.waitForSelector('[data-research-library][data-map-state="ready"]');
  const deferred = await keyboard.evaluate(() => {
    const holder = document.createElement('div');
    holder.style.display = 'none';
    holder.innerHTML = window.AXIOM_RESEARCH.html;
    document.body.appendChild(holder);
    const root = holder.firstElementChild;
    window.__deferredResearch = { holder, root, controller: window.AxiomResearch.mount(root, 'en') };
    return root.dataset.mapState === 'awaiting-layout' && !root.querySelector('svg');
  });
  check(deferred, 'shared controller defers all Leaflet creation while its container is hidden');
  await keyboard.evaluate(() => { window.__deferredResearch.holder.style.display = 'block'; });
  await keyboard.waitForFunction(() => window.__deferredResearch.root.dataset.mapState === 'ready');
  check(await keyboard.evaluate(() => window.__deferredResearch.root.querySelector('svg').getBoundingClientRect().width > 0), 'shared controller initializes only after positive visible geometry');
  await keyboard.evaluate(() => { window.__deferredResearch.controller.destroy(); window.__deferredResearch.holder.remove(); });
  const selector = keyboard.locator('select[data-research-region]');
  await selector.focus();
  await selector.press('ArrowDown');
  check(new URL(keyboard.url()).hash === '#research', 'book native select ArrowDown does not change entry');
  await selector.press('Escape');
  await selector.press('t');
  await selector.press('Tab');
  check((await selector.inputValue()) === 'thailand', 'book native select keyboard typeahead changes option');
  await keyboard.locator('[data-research-map]').focus();
  const before = await keyboard.locator('[data-research-map] .leaflet-map-pane').getAttribute('style');
  await keyboard.keyboard.press('ArrowRight');
  const after = await keyboard.locator('[data-research-map] .leaflet-map-pane').getAttribute('style');
  check(before !== after && new URL(keyboard.url()).hash === '#research', 'book focused map arrow pans without changing entry');
  await keyboard.locator('#q').fill('flood');
  await selector.focus();
  await keyboard.keyboard.press('Escape');
  check(await keyboard.locator('#q').inputValue() === '' && new URL(keyboard.url()).hash === '#research', 'Escape clears index search first from research control');
  await keyboard.evaluate(() => { window.__retiredResearchMap = document.querySelector('[data-research-map]'); location.hash = 'room'; });
  await keyboard.waitForSelector('[data-research-map]', { state: 'detached' });
  check(await keyboard.evaluate(() => !window.__retiredResearchMap._leaflet_id && window.__researchObservers.every(observer => observer.researchDisconnected)), 'book route exit destroys map and disconnects observer');
  await keyboard.evaluate(() => { location.hash = 'research'; });
  await keyboard.waitForSelector('[data-research-library][data-map-state="ready"]');
  check(await keyboard.locator('[data-research-map] svg').count() === 1 && errors.length === 0, 'book re-entry mounts exactly one map without exceptions');
  await keyboard.locator('#nav .item').first().click();
  const entry = new URL(keyboard.url()).hash;
  await keyboard.keyboard.press('ArrowDown');
  check(new URL(keyboard.url()).hash !== entry, 'book index-row arrow navigation is preserved');
  await keyboard.close();
  const visibleCountryCount = () => {
    const map = document.querySelector('[data-research-map]');
    if (!map) return 0;
    const rect = map.getBoundingClientRect();
    return [...map.querySelectorAll('path')].filter(path => {
      const bounds = path.getBoundingClientRect();
      return bounds.width > 1 && bounds.height > 1 && bounds.right > rect.left && bounds.left < rect.right && bounds.bottom > rect.top && bounds.top < rect.bottom && !path.getAttribute('d').includes('NaN');
    }).length;
  };
  for (let repeat = 0; repeat < 3; repeat++) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(book + '#research', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(visibleCountryCount).then(() => page.waitForFunction(() => {
      const svg = document.querySelector('[data-research-map] svg');
      return svg && svg.getBoundingClientRect().width > 0;
    }));
    check(await page.evaluate(visibleCountryCount) > 10 && errors.length === 0, `book fresh phone deep link ${repeat + 1} has visible geometry without NaN errors`);
    await page.screenshot({ path: `.qa/research-book-phone-repeat-${repeat}.png` });
    // This is the original wrong-green: paths exist but every path is M0 0.
    const falsified = await page.evaluate(() => {
      document.querySelectorAll('[data-research-map] path').forEach(path => { path.setAttribute('d', 'M0 0'); });
    }).then(() => page.evaluate(visibleCountryCount));
    check(falsified === 0, `book blank-geometry falsifier ${repeat + 1} rejects SVG presence without visible geography`);
    await page.close();
  }
  const phone = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const phoneErrors = [];
  phone.on('pageerror', error => phoneErrors.push(error.message));
  await phone.goto(book, { waitUntil: 'domcontentloaded' });
  await phone.locator('#nav .item[data-id="research"]').click();
  await phone.waitForFunction(visibleCountryCount);
  check(await phone.evaluate(visibleCountryCount) > 10, 'book phone entry from index draws real geography');
  await phone.locator('#backBtn').click();
  await phone.locator('#nav .item[data-id="research"]').click();
  await phone.waitForFunction(visibleCountryCount);
  check(await phone.evaluate(visibleCountryCount) > 10 && phoneErrors.length === 0, 'book phone Back and re-entry retain visible geometry without errors');
  await phone.close();
  for (const [state, papers] of [
    ['empty', []],
    ['unmapped', [{ ...dataset.papers[0], study: { region: null, label: 'Geography not established', scope: 'unspecified' } }]],
  ]) {
    const page = await browser.newPage();
    await page.route(/\/research\.js(?:\?|$)/, route => route.fulfill({ contentType: 'application/javascript', body: bookData(papers) }));
    await page.goto(book + '#research', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector(`[data-research-library][data-map-state="${state}"]`);
    check(await page.locator('[data-research-map]').isHidden() && await page.locator('[data-research-fallback]').isVisible(), `book ${state} geography has an honest fallback, not a blank ready map`);
    check(await page.locator('[data-paper]:visible').count() === papers.length, `book ${state} publication completeness`);
    await page.close();
  }
  const page = await browser.newPage();
  for (const [locale, copy] of Object.entries(researchCopy)) {
    await page.goto(main + '?lang=' + locale + '#research', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(title => document.querySelector('#research-title')?.textContent === title, copy.title);
    check(await page.locator('#research .research-heading p').first().textContent() === copy.notice, `main ${locale} preprint qualification`);
    check(await page.locator('[data-research-map]').getAttribute('aria-label') === copy.mapTitle, `main ${locale} map label`);
    check(await page.locator('#research .research-actions a').first().textContent() === copy.pdf, `main ${locale} PDF label`);
  }
  await page.goto(book + '#colophon', { waitUntil: 'domcontentloaded' });
  for (const host of ['co', 'vr']) check(await page.locator(`#plate a[href="https://${host}.nonarkara.org/"]`).count() > 0, `book ${host} remains accessible in colophon`);
  await page.goto(main, { waitUntil: 'domcontentloaded' });
  for (const host of ['co', 'vr']) check(await page.locator(`footer a[href="https://${host}.nonarkara.org/"]`).count() > 0, `main ${host} remains accessible in footer`);
  await page.close();
  console.log(`${checks} PASS, 0 FAIL`);
} finally { await browser.close(); }
