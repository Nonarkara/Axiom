import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const migrations = JSON.parse(readFileSync(new URL('./catalogue-domains.json', import.meta.url), 'utf8'));
const results = [];
for (const entry of migrations) {
  const responses = [];
  for (const url of [entry.from, entry.to]) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
      const html = await response.text();
      responses.push({
        requested: url, final: response.url, status: response.status,
        title: html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '',
        hash: createHash('sha256').update(html).digest('hex')
      });
    } catch (error) {
      responses.push({ requested: url, error: error.message });
    }
  }
  const [old, current] = responses;
  const expected = new URL(entry.to);
  const actual = current.final ? new URL(current.final) : null;
  // Fragments belong to the browser router and are checked in the browser pass.
  expected.hash = '';
  if (actual) actual.hash = '';
  const passed = old.status === 200 && current.status === 200 && old.hash === current.hash &&
    actual?.href === expected.href;
  results.push({ id: entry.id, passed, responses });
  console.log(`${passed ? 'PASS' : 'FAIL'} ${entry.id}: ${entry.to}`);
}
const output = process.env.DOMAIN_EVIDENCE || '/tmp/axiom-domain-audit.json';
writeFileSync(output, JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2) + '\n');
console.log('Evidence: ' + output);
if (results.some(result => !result.passed)) process.exitCode = 1;

if (process.argv.includes('--browser')) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  const axiom = process.env.AXIOM_URL || 'https://axiom.nonarkara.org/';
  const axiomx = process.env.AXIOMX_URL || 'https://axiomx.nonarkara.org/';
  const checks = [];
  try {
    for (const width of [390, 1024, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 } });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(axiom, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.AXIOM_FOOTPRINT && document.querySelector('#heroProjectSelect')?.options.length > 1);
      for (const entry of migrations.filter(entry => entry.id !== 'blog')) {
        const href = await page.locator(`a.sys-cell[data-arch="${entry.id}"]`).getAttribute('href');
        assert.equal(new URL(href, axiom).href, entry.to, entry.id);
      }
      assert.ok(await page.locator('a[href="https://blog.nonarkara.org/"]').count());
      for (const key of ['thailand', 'kmitl', 'muang-thong-thani', 'chonburi', 'laem-chabang', 'yala']) {
        await page.selectOption('#heroProjectSelect', key);
        const href = await page.locator('#heroFeaturedBadge').getAttribute('href');
        assert.ok(new URL(href).hostname.endsWith('.nonarkara.org'), key);
        const expected = await page.evaluate(key => window.AXIOM_FOOTPRINT.stops.find(s => s.key === key).href, key);
        assert.equal(href, expected);
      }
      await page.goto(axiomx, { waitUntil: 'domcontentloaded' });
      await page.locator('#nav button[data-id="flood-ami"]').waitFor();
      for (const entry of migrations.filter(entry => entry.id !== 'blog')) {
        await page.locator(`#nav button[data-id="${entry.id}"]`).click();
        assert.equal(await page.locator('#barOpen').getAttribute('href'), entry.to, entry.id);
        assert.equal(new URL(await page.locator('#plate .actions a').first().getAttribute('href'), axiomx).href, entry.to);
        if (width <= 860) await page.locator('#backBtn').click();
      }
      await page.locator('#nav button[data-id="colophon"]').click();
      assert.ok(await page.locator('#plate a[href="https://blog.nonarkara.org/"]').count());
      assert.deepEqual(errors, []);
      checks.push({ width, catalogueLinks: 14, mapStops: 6, blogOnBoth: true });
      console.log('PASS browser: both catalogues and map links @' + width);
      await context.close();
    }
    const page = await browser.newPage();
    await page.goto('https://superleague.nonarkara.org/#/lobby', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => location.hash === '#/lobby' && document.title.includes('Super League'));
    console.log('PASS browser: Super League keeps #/lobby');
    writeFileSync(output + '.browser.json', JSON.stringify({ axiom, axiomx, checks, superleague: page.url() }, null, 2) + '\n');
  } finally {
    await browser.close();
  }
}
