import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const catalogue = JSON.parse(await readFile(new URL('../data/catalogue/systems.json', import.meta.url)));
const { papers } = JSON.parse(await readFile(new URL('../data/research.json', import.meta.url)));
const main = process.env.AXIOM_URL || 'http://127.0.0.1:5742/';
const book = process.env.AXIOMX_URL || 'http://127.0.0.1:5741/';
const browser = await chromium.launch();
try {
  for (const width of [390, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce', hasTouch: width === 390 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const locale of ['en', 'th', 'zh', 'ko', 'ja', 'vi', 'ts']) {
      await page.goto(new URL('?lang=' + locale, main).href);
      await page.waitForFunction(value => document.documentElement.dataset.locale === value, locale);
    }
    await page.goto(new URL('?lang=en', main).href);
    await page.locator('#heroMap .leaflet-tile-loaded').first().waitFor();
    assert.equal(await page.locator('.sys-cell[data-arch]').count(), catalogue.systems.length);
    assert.equal(await page.locator('#stages .cx-bars > li').count(), 6);
    for (const tab of await page.locator('.hero-console__tab').all()) {
      await tab.click();
      assert.equal(await tab.getAttribute('aria-selected'), 'true');
    }
    for (const link of await page.locator('.cluster-jump a').all()) {
      const hash = await link.getAttribute('href');
      await link.click();
      await page.waitForFunction(hash => {
        const target = document.querySelector(hash)?.getBoundingClientRect();
        const header = document.querySelector('.masthead').getBoundingClientRect();
        return location.hash === hash && target?.top >= header.bottom - 1 && target.bottom < innerHeight;
      }, hash);
    }
    for (const base of [main, book]) {
      await page.goto(new URL('#research', base).href);
      const root = page.locator('[data-research-library][data-map-state="ready"]');
      await root.waitFor();
      assert.equal(await root.locator('[data-paper]').count(), papers.length);
      if (base === book) {
        assert.equal(await page.evaluate(() => scrollY), 0);
        assert.ok(await page.locator('.plate-shell .bar, .reader .bar, #barKicker').last().isVisible());
      }
      const preview = root.locator('[data-research-preview]').first();
      await preview.click();
      const dialog = root.locator('dialog[open][data-reader-state="ready"]');
      await dialog.locator('canvas').waitFor();
      assert.ok(await dialog.locator('.textLayer span').count());
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'hidden' });
      assert.ok(await preview.evaluate(el => el === document.activeElement));
    }
    assert.deepEqual(errors, []);
    console.log(`PASS ${width}px: catalogue, locales, console, jumps and both research readers`);
    await page.close();
  }
  for (const base of [main, book]) for (const paper of papers) {
    const res = await fetch(new URL(new URL(paper.pdf).pathname, base), { signal: AbortSignal.timeout(15000) });
    assert.ok(res.ok, paper.id);
    const bytes = Buffer.from(await res.arrayBuffer());
    assert.equal(bytes.subarray(0, 5).toString(), '%PDF-', paper.id);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), paper.sha256, paper.id);
  }
  console.log(`PASS ${papers.length * 2} preserved PDF signatures and hashes`);
} finally {
  await browser.close();
}
