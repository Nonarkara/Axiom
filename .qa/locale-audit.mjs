import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:3000';

async function snap(page, name) {
  await page.screenshot({ path: `.qa/${name}.png`, fullPage: true });
}

async function run() {
  const browser = await chromium.launch({ headless: true });

  for (const locale of ['en', 'th', 'zh']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Switch locale via JS instead of clicking
    await page.evaluate((loc) => {
      if (typeof window.setAxiomLocale === 'function') {
        window.setAxiomLocale(loc);
      }
    }, locale);
    await page.waitForTimeout(1500);

    await snap(page, `homepage-${locale}-mobile`);
    await page.close();
  }

  await browser.close();
  console.log('Locale screenshots saved');
}

run().catch(e => { console.error(e); process.exit(1); });
