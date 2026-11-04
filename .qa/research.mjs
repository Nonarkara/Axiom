import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { researchCopy } from '../scripts/research/copy.mjs';
import { readFileSync } from 'node:fs';

const expectedCount = JSON.parse(readFileSync(new URL('../data/research.json', import.meta.url), 'utf8')).papers.length;

const browser = await chromium.launch({ headless: true });
const main = process.env.AXIOM_URL || 'http://localhost:5462/';
const book = process.env.AXIOMX_URL || 'http://localhost:5461/';
let checks = 0;
const check = (value, label) => { assert.ok(value, label); checks++; console.log('PASS ' + label); };

try {
  for (const width of [390, 1024, 1440]) {
    for (const [name, base] of [['main', main], ['book', book]]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(base + '#research', { waitUntil: 'domcontentloaded' });
      const root = page.locator(name === 'main' ? '#research' : '#plate');
      await root.locator('[data-paper]').first().waitFor();
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
            const actions = row.querySelector('.research-actions').getBoundingClientRect();
            const bounds = row.getBoundingClientRect();
            return { height: bounds.height, ordered: title.bottom <= meta.top + 1 && meta.bottom <= actions.top + 1,
              gap: actions.top - meta.bottom, firstAction: actions.top - bounds.top };
          })
        };
      });
      check(geometry.overflow <= 1, `${name} no research overflow @${width}`);
      check(geometry.headerFits, `${name} header controls fit their pane @${width}`);
      check(geometry.headerHeight <= 76, `${name} compact header @${width}: ${geometry.headerHeight}px`);
      check(geometry.rows.every(r => r.ordered && r.gap <= 12 && r.height <= (width === 390 ? 300 : 240)), `${name} title/metadata/PDF geometry @${width}`);
      const filter = root.locator('select');
      await filter.selectOption('AirDash');
      check(await root.locator('[data-paper]:visible').count() === 1, `${name} system filter @${width}`);
      check((await root.locator('[data-paper]:visible').textContent()).includes('Pun Thiengburanathum'), `${name} published author spelling @${width}`);
      await filter.selectOption('');
      await root.scrollIntoViewIfNeeded();
      await page.screenshot({ path: `.qa/research-${name}-${width}.png` });
      // A reintroduced giant metadata/action gap must violate the same geometry budget.
      const caught = await root.evaluate(el => {
        const action = el.querySelector('.research-actions');
        action.style.marginTop = '200px';
        const meta = el.querySelector('.research-meta').getBoundingClientRect();
        const fail = action.getBoundingClientRect().top - meta.bottom > 12;
        action.style.marginTop = '';
        return fail;
      });
      check(caught, `${name} scattered-action falsifier @${width}`);
      await page.addStyleTag({ content: 'html { font-size: 200% !important; } .research-row h2,.research-row h3,.research-meta,.research-actions,.research-filter { font-size: 200% !important; }' });
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
  const page = await browser.newPage();
  for (const [locale, copy] of Object.entries(researchCopy)) {
    await page.goto(main + '?lang=' + locale + '#research', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(title => document.querySelector('#research-title')?.textContent === title, copy.title);
    check(await page.locator('#research > p').textContent() === copy.notice, `main ${locale} preprint qualification`);
    check(await page.locator('#research .research-actions a').first().textContent() === copy.pdf, `main ${locale} PDF label`);
  }
  await page.goto(book + '#colophon', { waitUntil: 'domcontentloaded' });
  for (const host of ['co', 'vr']) check(await page.locator(`#plate a[href="https://${host}.nonarkara.org/"]`).count() > 0, `book ${host} remains accessible in colophon`);
  await page.goto(main, { waitUntil: 'domcontentloaded' });
  for (const host of ['co', 'vr']) check(await page.locator(`footer a[href="https://${host}.nonarkara.org/"]`).count() > 0, `main ${host} remains accessible in footer`);
  await page.close();
  console.log(`${checks} PASS, 0 FAIL`);
} finally { await browser.close(); }
