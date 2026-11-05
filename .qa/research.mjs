import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { researchCopy } from '../scripts/research/copy.mjs';
import { readFileSync } from 'node:fs';
import { bookData } from '../scripts/research/build.mjs';

const dataset = JSON.parse(readFileSync(new URL('../data/research.json', import.meta.url), 'utf8'));
const expectedCount = dataset.papers.length;
const regressionPaperIds = ['rain-to-phone', 'nobody-owns-the-haze', 'gauge-to-shelter', 'seeing-a-war', 'nst-last-mile'];

const browser = await chromium.launch({ headless: true });
const main = process.env.AXIOM_URL || 'http://localhost:5502/';
const book = process.env.AXIOMX_URL || 'http://localhost:5501/';
let checks = 0;
const check = (value, label) => { assert.ok(value, label); checks++; console.log('PASS ' + label); };
const firstPDF = root => root.locator('.research-actions a[download]:visible').first();
const compositionViolations = [];

async function composition(library) {
  return library.evaluate(el => {
    const rect = node => {
      const r = node.getBoundingClientRect();
      return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
    };
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const control = node => {
      const style = getComputedStyle(node);
      context.font = style.font || `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      // A native select sizes for its option set, not only the selected label.
      const labels = node.matches('select') ? [...node.options].map(option => option.textContent) : [node.textContent];
      const textWidth = Math.max(...labels.map(text => context.measureText(text.trim()).width));
      return { ...rect(node), textWidth, select: node.matches('select') };
    };
    return {
      book: el.classList.contains('research-library--book'),
      section: rect(el), desk: rect(el.querySelector('.research-desk') || el),
      atlas: rect(el.querySelector('.research-atlas')), map: rect(el.querySelector('[data-research-map]')),
      index: rect(el.querySelector('.research-index') || el.querySelector('.research-list')), heading: rect(el.querySelector('.research-heading')),
      filters: rect(el.querySelector('[data-research-controls]')),
      duplicate: !!el.querySelector('[data-research-selection],[data-research-first-pdf]'),
      rows: [...el.querySelectorAll('[data-paper]')].filter(row => row.getBoundingClientRect().height).map(row => ({
        id: row.dataset.paper, bounds: rect(row), title: rect(row.querySelector('h2,h3')),
        meta: rect(row.querySelector('.research-meta')), coverage: rect(row.querySelector('.research-coverage')),
        actions: rect(row.querySelector('.research-actions')), summary: rect(row.querySelector('.research-study summary')),
        pdf: rect(row.querySelector('.research-actions a[download]')),
        controls: [...row.querySelectorAll('.research-actions a,.research-study summary')].map(control),
      })),
      controls: [...el.querySelectorAll('[data-research-controls] select')].map(control),
    };
  });
}

// One set of measured relationships judges both the candidate and fault fixture.
function compositionFailures(g, width) {
  const failures = [];
  const require = (condition, label) => { if (!condition) failures.push(label); };
  const phone = width <= 600;
  // Measured five-paper book: longest phone row 239px, previously 318px.
  const rowLimit = phone ? 250 : 160;
  require(!g.duplicate, 'no duplicate selection/PDF strip');
  require(g.section.width <= 1441 && g.desk.width <= 1441, 'section measure <=1440px');
  // Preserve the old five-paper budgets; new papers earn only one bounded row.
  const baseSectionLimit = phone ? 1750 : g.section.width >= 850 ? 950 : 1250;
  const sectionLimit = baseSectionLimit + Math.max(0, g.rows.length - regressionPaperIds.length) * rowLimit;
  require(regressionPaperIds.every((id, index) => g.rows[index]?.id === id),
    'original five papers remain complete and in regression order');
  require(g.section.height <= sectionLimit, `whole research task <=${sectionLimit}px (${g.section.height})`);
  require(g.map.height <= 300.5, 'map height <=300px');
  if (g.section.width >= 850) {
    require(g.atlas.right <= g.index.left && g.index.left - g.atlas.right <= 32,
      'independent left atlas beside right index');
    require(g.map.width <= 340 && g.index.width >= 480, 'rail/index width balance');
    require(g.atlas.height < g.index.height - 100, 'atlas not stretched to publication list');
  } else {
    require(g.map.bottom <= g.heading.top + 1 && g.heading.top - g.atlas.bottom <= 20,
      'map exits into compact heading');
  }
  require(g.filters.top - g.heading.bottom <= 12, 'heading/filter proximity');
  require(g.filters.height <= (phone ? 132 : 90), 'compact filter band');
  for (const row of g.rows) {
    const id = row.id;
    require(row.bounds.height <= rowLimit, `${id} closed row <=${rowLimit}px (${row.bounds.height})`);
    require(row.title.bottom <= row.meta.top + 1, `${id} title precedes metadata`);
    const inline = Math.abs(row.meta.top - row.coverage.top) <= 1;
    require(inline ? row.meta.right <= row.coverage.left + 1
      : row.coverage.top >= row.meta.bottom - 1 && row.coverage.top - row.meta.bottom <= 8,
    `${id} metadata/coverage together without overlap`);
    const factsBottom = Math.max(row.meta.bottom, row.coverage.bottom);
    require(row.actions.top >= factsBottom - 1 && row.actions.top - factsBottom <= 12,
      `${id} metadata/action distance <=12px`);
    require(Math.abs(row.actions.top - row.summary.top) <= 1
      && row.summary.left >= row.actions.right - 1 && row.summary.left - row.actions.right <= 24,
    `${id} PDF/source/details share one compact command line`);
    const actionRight = Math.max(...row.controls.slice(0, 2).map(control => control.right));
    require(row.actions.right - actionRight <= 24, `${id} action strip hugs commands instead of filling dead row`);
    for (const c of row.controls) {
      require(c.left >= row.bounds.left - 1 && c.right <= row.bounds.right + 1
        && c.top >= row.bounds.top && c.bottom <= row.bounds.bottom + 1,
      `${id} actions contained within their row`);
    }
  }
  require(g.rows[0]?.pdf.top >= 0 && g.rows[0]?.pdf.bottom <= 844,
    'first real paper action within first 844px');
  if (width >= 1152) {
    // Book's 739px pane stacks the map even at a 1152px viewport.
    const visibleCount = g.book ? (g.section.width >= 850 ? 3 : 2) : 5;
    require(g.rows.slice(0, visibleCount).length === visibleCount
      && g.rows.slice(0, visibleCount).every(r => r.pdf.top >= 0 && r.pdf.bottom <= 900),
    `first ${visibleCount} real paper actions within first 900px`);
  }
  for (const c of [...g.controls, ...g.rows.flatMap(row => row.controls)]) {
    require(c.height >= 43.5 && c.height <= 64,
      'command/filter target height 44..64px');
    require(c.width <= Math.max(44, c.textWidth * 2 + (c.select ? 48 : 16)),
      'command/filter controls content-sized');
  }
  return failures;
}

async function assertComposition(library, name, width) {
  const geometry = await composition(library);
  const failures = compositionFailures(geometry, width);
  console.log('MEASURE ' + JSON.stringify({ name, width, section: geometry.section.width,
    sectionHeight: geometry.section.height,
    rows: geometry.rows.map(row => ({ id: row.id, height: row.bounds.height, pdfBottom: row.pdf.bottom })), failures }));
  if (failures.length) compositionViolations.push(`${name} @${width}: ${failures.join('; ')}`);
  else check(true, `${name} composition @${width}`);
}

async function falsifyStack(page, library, name, width) {
  // Restore beb7dd2's actual mechanism: single full-width stack, capped copy,
  // separately stacked facts/actions/details. No arbitrary height injection.
  const style = await page.addStyleTag({ content: `
    [data-research-library] .research-desk { display:block !important; }
    [data-research-library] .research-atlas { position:static !important; margin-bottom:8px !important; }
    [data-research-library] .research-map { height:${width <= 600 ? 240 : 300}px !important; }
    [data-research-library] .research-index { display:block !important; }
    [data-research-library] .research-heading { display:block !important; }
    [data-research-library] .research-row { display:grid !important; grid-template-columns:minmax(0,1fr) !important; gap:4px !important; padding-block:12px !important; }
    [data-research-library] .research-row h2,[data-research-library] .research-row h3 { max-width:65ch !important; font-size:var(--t-lede,20px) !important; line-height:1.35 !important; }
    [data-research-library] .research-facts,[data-research-library] .research-commands { display:contents !important; }
    [data-research-library] .research-meta,[data-research-library] .research-coverage { max-width:75ch !important; }
    [data-research-library] .research-actions { width:100% !important; gap:4px 20px !important; }
    [data-research-library] .research-study { width:100% !important; }
  ` });
  try {
    const geometry = await composition(library);
    const failures = compositionFailures(geometry, width);
    console.log('FALSIFY ' + JSON.stringify({ name, width, sectionHeight: geometry.section.height, rows: geometry.rows.map(r => r.bounds.height), failures }));
    check(failures.length > 0, `${name} old stack fails shared composition budgets @${width}`);
    if (width > 600 || geometry.book) check(failures.some(f => f.includes('closed row')),
      `${name} old full-width row fails measured row-height budget @${width}`);
    check(failures.some(f => f.includes('command line')), `${name} old separate details row fails unchanged command-line budget @${width}`);
    if (width >= 1152) check(failures.some(f => f.includes('whole research task')),
      `${name} old stack fails unchanged whole-section budget @${width}`);
    if (geometry.section.width >= 850) check(failures.includes('independent left atlas beside right index'),
      `${name} old map-over-list stack fails unchanged column budget @${width}`);
  } finally { await style.evaluate(node => node.remove()); }
}

async function summaryGeometry(library) {
  return library.locator('.research-study summary').evaluateAll(nodes => nodes.map(node => {
    const style = getComputedStyle(node);
    const box = node.getBoundingClientRect();
    const context = document.createElement('canvas').getContext('2d');
    context.font = style.font || `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const longestWord = Math.max(...node.textContent.trim().split(/\s+/).map(word => context.measureText(word).width));
    let splitWord = false;
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const text = walker.currentNode;
      for (const match of text.textContent.matchAll(/\S+/g)) {
        const range = document.createRange();
        range.setStart(text, match.index);
        range.setEnd(text, match.index + match[0].length);
        const lines = [...range.getClientRects()].filter(rect => rect.width > 0 && rect.height > 0);
        if (lines.some(rect => Math.abs(rect.top - lines[0].top) > 1)) splitWord = true;
      }
    }
    const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    const marker = style.listStyleType === 'none' ? 0 : parseFloat(style.fontSize) * 0.75;
    return { width: box.width, height: box.height, longestWord, marker, splitWord,
      maxHeight: 2 * parseFloat(style.lineHeight) + padding + 1 };
  }));
}

function summaryFailures(rows) {
  return rows.flatMap((row, index) => [
    ...(row.width + 1 < row.longestWord + row.marker ? [`summary ${index} cannot fit longest word plus marker`] : []),
    ...(row.splitWord ? [`summary ${index} breaks inside a word`] : []),
    ...(row.height > row.maxHeight ? [`summary ${index} exceeds two natural text lines`] : []),
  ]);
}

try {
  for (const width of [390, 1024, 1440]) {
    for (const [name, base] of [['main', main], ['book', book]]) {
      const page = await browser.newPage({ viewport: { width, height: 844 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(base + '#research', { waitUntil: 'domcontentloaded' });
      const root = page.locator(name === 'main' ? '#research' : '#plate');
      const library = page.locator('[data-research-library]:visible').first();
      await root.locator('[data-paper]').first().waitFor();
      await page.waitForFunction(() => {
        const el = document.querySelector('[data-research-map]');
        return el && el.closest('[data-research-library]').dataset.mapState === 'ready' && el.querySelector('svg')?.getBoundingClientRect().width > 0;
      });
      await library.evaluate(el => el.scrollIntoView({ block: 'start' }));
      check(await root.locator('[data-paper]').count() === expectedCount, `${name} ${expectedCount} publications @${width}`);
      check(await root.locator('[data-paper]:visible').count() === expectedCount,
        `${name} every manifest paper is initially visible, not hidden to meet budgets @${width}`);
      const geometry = await root.evaluate(el => {
        const header = document.querySelector('.masthead') || [...document.querySelectorAll('.bar')].find(node => node.getBoundingClientRect().height > 0);
        const headerRect = header.getBoundingClientRect();
        const controls = [...header.querySelectorAll('a,button')].filter(n => n.getBoundingClientRect().width);
        return {
          overflow: el.scrollWidth - el.clientWidth,
          headerHeight: headerRect.height,
          headerFits: controls.every(n => { const r = n.getBoundingClientRect(); return r.left >= headerRect.left - 1 && r.right <= headerRect.right + 1; }),
        };
      });
      check(geometry.overflow <= 1, `${name} no research overflow @${width}`);
      check(geometry.headerFits, `${name} header controls fit their pane @${width}`);
      check(geometry.headerHeight <= 76, `${name} compact header @${width}: ${geometry.headerHeight}px`);
      await assertComposition(library, name, width);
      const mapGeometry = await root.evaluate(el => {
        const map = el.querySelector('[data-research-map]');
        const rect = map.getBoundingClientRect();
        return { height: rect.height,
          usefulAction: [...el.querySelectorAll('.research-actions a[download]')].find(a => a.getBoundingClientRect().height > 0).getBoundingClientRect().bottom,
          paths: [...map.querySelectorAll('path')].filter(path => {
            const bounds = path.getBoundingClientRect();
            return bounds.width > 1 && bounds.height > 1 && bounds.right > rect.left && bounds.left < rect.right && bounds.bottom > rect.top && bounds.top < rect.bottom;
          }).length,
          zoom: [...map.querySelectorAll('.leaflet-control-zoom a')].every(a => { const r = a.getBoundingClientRect(); return r.width >= 44 && r.height >= 44; }) };
      });
      check(mapGeometry.paths > 10, `${name} actual country geometry is in the map viewport @${width}`);
      check(mapGeometry.zoom, `${name} map zoom controls are usable @${width}`);
      check(mapGeometry.height <= 300, `${name} compact geographic index @${width}`);
      check(mapGeometry.usefulAction <= 844, `${name} first visible paper PDF is in the first viewport @${width}: ${mapGeometry.usefulAction}`);
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
      check(await firstPDF(root).getAttribute('href') === 'https://axiom.nonarkara.org/research/seeing-a-war-v1.pdf', `${name} first visible paper PDF follows selection @${width}`);
      await region.selectOption('');
      const details = root.locator('[data-paper]').first().locator('.research-study');
      await details.locator('summary').click();
      check(await details.getAttribute('open') !== null && await details.locator('dd').count() === 3
        && await details.locator('dl').isVisible(), `${name} question/evidence/limitation details open @${width}`);
      check(await library.evaluate(el => el.scrollWidth <= el.clientWidth + 1), `${name} expanded details remain within index @${width}`);
      await details.locator('summary').click();
      await library.evaluate(el => el.scrollIntoView({ block: 'start' }));
      await page.screenshot({ path: `.qa/research-${name}-${width}.png` });
      await falsifyStack(page, library, name, width);
      // Preserve the scattered-action falsifier, judged by the real shared gate.
      await root.evaluate(el => {
        const action = el.querySelector('.research-actions');
        action.style.marginTop = '200px';
      });
      const scattered = compositionFailures(await composition(library), width);
      await root.evaluate(el => { el.querySelector('.research-actions').style.marginTop = ''; });
      check(scattered.some(f => f.includes('metadata/action distance')), `${name} scattered-action falsifier @${width}`);
      await page.addStyleTag({ content: 'html { font-size: 200% !important; } .research-row h2,.research-row h3,.research-meta,.research-coverage,.research-actions,.research-filter,.research-study,.research-selection { font-size: 200% !important; }' });
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const enlargedFits = await root.evaluate(el => el.scrollWidth <= el.clientWidth + 1);
      if (!enlargedFits) compositionViolations.push(`${name} enlarged text overflows @${width}`);
      else check(true, `${name} enlarged text reflows @${width}`);
      const summaries = summaryFailures(await summaryGeometry(library));
      check(summaries.length === 0, `${name} enlarged summaries fit whole words and marker @${width}: ${summaries.join('; ')}`);
      if (width === 390) {
        const crushedGrid = await page.addStyleTag({ content: '[data-research-library] .research-commands { display:grid !important; grid-template-columns:max-content minmax(0,1fr) !important; overflow:hidden !important; }' });
        try {
          const broken = summaryFailures(await summaryGeometry(library));
          check(broken.some(failure => failure.includes('longest word') || failure.includes('inside a word')),
            `${name} enlarged crushed-grid falsifier fails the same whole-word gate despite clipped overflow`);
        } finally { await crushedGrid.evaluate(node => node.remove()); }
        await details.locator('summary').click();
        check(await details.getAttribute('open') !== null && await details.locator('dl').isVisible(),
          `${name} enlarged details open after whole command groups wrap`);
        check(await library.evaluate(el => el.scrollWidth <= el.clientWidth + 1),
          `${name} enlarged open details stay within the reading column`);
        await details.locator('summary').click();
      }
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
  for (const width of [1152, 1440, 1920, 3440]) {
    for (const [name, base] of [['main', main], ['book', book]]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: width === 1152 ? 3 : 1 });
      await page.goto(base + '#research', { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('[data-research-library][data-map-state="ready"]');
      const library = page.locator('[data-research-library]:visible').first();
      await library.evaluate(el => el.scrollIntoView({ block: 'start' }));
      await assertComposition(library, name, width);
      await page.screenshot({ path: `.qa/research-composition-${name}-${width}.png` });
      await falsifyStack(page, library, name, width);
      await page.close();
    }
  }
  for (const height of [600, 900]) {
    for (const [name, base] of [['main', main], ['book', book]]) {
      const page = await browser.newPage({ viewport: { width: 1440, height } });
      await page.goto(base + '#research', { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('[data-research-library][data-map-state="ready"]');
      const library = page.locator('[data-research-library]:visible').first();
      await library.locator('[data-paper][data-system="AirDash"] summary').click();
      await library.locator('[data-paper]').last().locator('h2,h3').scrollIntoViewIfNeeded();
      await library.locator('[data-research-map-region="chiang-mai"]').click();
      check(await library.locator('[data-research-region]').inputValue() === 'chiang-mai'
        && await library.locator('[data-paper]:visible').count() === 1
        && await library.locator('[data-paper]:visible').getAttribute('data-paper') === 'gauge-to-shelter',
      `${name} one sticky-map click selects Chiang Mai after expanded-list scroll @1440x${height}`);
      const visibleResult = await library.locator('[data-paper]:visible').evaluate(row => {
        const title = row.querySelector('h2,h3').getBoundingClientRect();
        const pdf = row.querySelector('a[download]').getBoundingClientRect();
        const header = document.querySelector('.masthead') || [...document.querySelectorAll('.bar')].find(el => el.getBoundingClientRect().height);
        const top = header?.getBoundingClientRect().bottom || 0;
        return title.top >= top - 1 && title.bottom <= innerHeight && pdf.top >= top - 1 && pdf.bottom <= innerHeight;
      });
      check(visibleResult, `${name} sticky map click keeps selected title/PDF visible after expanded list collapses @1440x${height}`);
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
      check((await firstPDF(library).getAttribute('href')).endsWith('gauge-to-shelter-v1.pdf'), `${name} PDF survives ${asset} failure`);
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
  console.log(`${checks} checks passed; ${compositionViolations.length} composition failures`);
  check(compositionViolations.length === 0, `composition budgets: ${compositionViolations.join('\n')}`);
  console.log(`${checks} PASS, 0 FAIL`);
} finally { await browser.close(); }
