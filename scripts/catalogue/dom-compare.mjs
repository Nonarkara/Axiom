#!/usr/bin/env node
/**
 * Prove two builds of the site show the same catalogue.
 *
 * The generator rewrites the catalogue's markup and copy, so the question is
 * not whether the files match — it is whether a reader sees the same thing.
 * This opens both builds in a real browser, in all seven languages, and
 * compares every cell as it renders: its number, its status, its name, its
 * category, its description, its call to action, its link and its picture.
 *
 *   node scripts/catalogue/dom-compare.mjs http://127.0.0.1:5322/ http://127.0.0.1:5321/
 *
 * Exits non-zero when a reader would see a difference.
 */

import { chromium } from 'playwright';

const before = process.argv[2];
const after = process.argv[3];
if (!before || !after) {
  console.error('usage: node scripts/catalogue/dom-compare.mjs <before-url> <after-url>');
  process.exit(2);
}

const LOCALES = ['en', 'th', 'zh', 'ko', 'ja', 'vi', 'ts'];
const browser = await chromium.launch();

async function readCatalogue(url, locale) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  await page.addInitScript((value) => {
    try { localStorage.setItem('axiom:locale', value); } catch (e) { /* private mode */ }
  }, locale);
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.dataset.locale
    && document.querySelectorAll('.sys-cell[data-arch]').length > 0);
  await page.evaluate(() => document.fonts.ready.then(() => undefined));

  const data = await page.evaluate(() => {
    const cells = [...document.querySelectorAll('.sys-cell[data-arch]')].map((cell) => {
      const text = (selector) => {
        const node = cell.querySelector(selector);
        return node ? node.textContent.replace(/\s+/g, ' ').trim() : null;
      };
      const image = cell.querySelector('img');
      return {
        id: cell.getAttribute('data-arch'),
        idx: text('.sys-cell__idx'),
        status: text('.sys-cell__status'),
        dot: !!cell.querySelector('.dot'),
        name: text('.sys-cell__name'),
        category: text('.sys-cell__cat'),
        lede: text('.sys-cell__lede'),
        cta: text('.sys-cell__link'),
        href: cell.getAttribute('href')
          || cell.querySelector('.sys-cell__primary')?.getAttribute('href')
          || null,
        image: image ? image.getAttribute('src') : null,
        alt: image ? image.getAttribute('alt') : null,
      };
    });
    const value = (selector) => {
      const node = document.querySelector(selector);
      return node ? node.textContent.trim() : null;
    };
    return {
      locale: document.documentElement.dataset.locale,
      cells,
      heroCatalogue: value('.hero-stat-value'),
      consoleLive: value('.hero-console__metric-val'),
      stripSystems: value('#evidenceSystems'),
      stripLive: value('#evidenceLive'),
      headings: [...document.querySelectorAll('.cluster-head')].map((node) => ({
        title: node.querySelector('.t-label')?.textContent.trim() || null,
        meta: node.querySelector('.s-head__meta')?.textContent.trim() || null,
      })),
    };
  });

  await context.close();
  return { data, errors };
}

let differences = 0;
const report = (message) => { differences++; console.log(`  ✗ ${message}`); };

for (const locale of LOCALES) {
  const a = await readCatalogue(before, locale);
  const b = await readCatalogue(after, locale);
  if (a.errors.length || b.errors.length) {
    report(`${locale}: page errors — ${[...a.errors, ...b.errors].join('; ')}`);
  }
  if (a.data.locale !== locale || b.data.locale !== locale) {
    report(`${locale}: the page did not settle on that language`);
  }

  const beforeCells = new Map(a.data.cells.map((c) => [c.id, c]));
  const afterCells = new Map(b.data.cells.map((c) => [c.id, c]));
  for (const id of beforeCells.keys()) {
    if (!afterCells.has(id)) report(`${locale}: ${id} is missing from the new build`);
  }
  for (const id of afterCells.keys()) {
    if (!beforeCells.has(id)) report(`${locale}: ${id} is new in the new build`);
  }
  for (const [id, cellA] of beforeCells) {
    const cellB = afterCells.get(id);
    if (!cellB) continue;
    for (const field of ['idx', 'status', 'dot', 'name', 'category', 'lede', 'cta', 'href', 'image', 'alt']) {
      if (cellA[field] === cellB[field]) continue;
      report(`${locale} · ${id} · ${field}`);
      console.log(`      before: ${String(cellA[field]).slice(0, 120)}`);
      console.log(`      after : ${String(cellB[field]).slice(0, 120)}`);
    }
  }

  for (const field of ['heroCatalogue', 'consoleLive', 'stripSystems', 'stripLive']) {
    if (a.data[field] !== b.data[field]) {
      report(`${locale} · ${field}: ${a.data[field]} → ${b.data[field]}`);
    }
  }
  if (JSON.stringify(a.data.headings) !== JSON.stringify(b.data.headings)) {
    report(`${locale} · the cluster headings changed`);
    console.log(`      before: ${JSON.stringify(a.data.headings)}`);
    console.log(`      after : ${JSON.stringify(b.data.headings)}`);
  }
  console.log(`  ${locale}: ${b.data.cells.length} cells, ${b.data.cells.length === a.data.cells.length ? 'same count' : 'DIFFERENT COUNT'}`);
}

await browser.close();

if (differences) {
  console.error(`\nFAIL — ${differences} difference(s) a reader would see.`);
  process.exit(1);
}
console.log('\nPASS — both builds show the same catalogue, in all seven languages.');
