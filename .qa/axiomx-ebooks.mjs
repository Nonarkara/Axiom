import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const base = process.env.AXIOMX_URL || 'http://127.0.0.1:5311/';
const out = process.env.EBOOK_EVIDENCE || '/tmp/axiomx-ebooks-evidence';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const report = [];
const errors = [];
try {
  for (const width of [390, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 } });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    for (const id of ['mean', 'ninja', 'slowdown']) {
      await page.goto(new URL('#' + id, base).href, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.locator('.plate-img').evaluate(image => image.decode());
      const data = await page.evaluate(() => {
        const rect = element => {
          const r = element.getBoundingClientRect();
          return { x: r.x, y: r.y, width: r.width, height: r.height, bottom: r.bottom };
        };
        const actions = [...document.querySelectorAll('#plate .actions a')];
        const image = document.querySelector('.plate-img');
        const caption = document.querySelector('.plate-art figcaption');
        const chrome = rect(document.querySelector('#platePane > .bar')).height + rect(document.querySelector('#locator')).height;
        return {
          title: document.querySelector('h1.name').textContent,
          href: document.querySelector('#barOpen').href,
          action: actions.map(a => ({ href: a.href, ...rect(a) })),
          image: rect(image), caption: rect(caption), chrome,
          horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
          textOverflow: [...document.querySelectorAll('#plate h1, #plate .lede')].some(e => e.scrollWidth > e.clientWidth + 1),
          primaryVisible: rect(document.querySelector('h1.name')).bottom <= innerHeight && actions.length > 0 && rect(actions[0]).bottom <= innerHeight,
          groupCount: [...document.querySelectorAll('#nav .group h2')].filter(h => h.textContent.startsWith('E-books')).length,
          tapHeight: document.querySelector('#nav button[data-id="slowdown"]').getBoundingClientRect().height
        };
      });
      assert.equal(data.href, `https://${id}.nonarkara.org/`);
      assert.equal(data.action[0].href, data.href);
      assert.equal(data.groupCount, 1);
      assert.equal(data.horizontalOverflow, false);
      assert.equal(data.textOverflow, false);
      assert.equal(data.primaryVisible, true);
      if (width > 860) assert.ok(data.tapHeight >= 44);
      assert.ok(data.caption.width <= data.image.width + 1);
      await page.screenshot({ path: `${out}/${id}-${width}.png` });
      report.push({ id, width, ...data });
    }
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.locator('#q').fill('E-books');
    assert.equal(await page.locator('#nav button[data-id="mean"], #nav button[data-id="ninja"], #nav button[data-id="slowdown"]').count(), 3);
    await page.locator('#nav button[data-id="ninja"]').click();
    assert.match(await page.locator('h1.name').textContent(), /Ninja Innovation/);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#q').inputValue(), '');
    if (width === 390) {
      await page.locator('#backBtn').click();
      assert.equal(await page.locator('#shell').evaluate(e => e.classList.contains('is-open')), false);
      assert.ok(await page.locator('#nav button[data-id="slowdown"]').evaluate(e => e.getBoundingClientRect().height >= 44));
    }
    await page.locator('#nav button[data-id="mean"]').click();
    await page.keyboard.press('ArrowRight');
    await page.waitForURL('**/#ninja');
    await page.goBack();
    assert.match(await page.locator('h1.name').textContent(), /What I Mean/);
    await page.locator(width === 390 ? '#themeBtn2' : '#themeBtn').click();
    await page.screenshot({ path: `${out}/mean-dark-${width}.png` });
    await context.close();
  }
  assert.deepEqual(errors, []);
  writeFileSync(`${out}/report.json`, JSON.stringify({ base, report, errors }, null, 2));
  console.log('PASS: three e-books at 390/1024/1440; deep links, artwork, Open links, search, Escape, arrows, history, phone return, dark mode.');
  console.log('Evidence: ' + out);
} finally {
  await browser.close();
}
