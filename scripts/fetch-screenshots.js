const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  console.log('Fetching KMITL...');
  try {
    await page.goto('https://kmitl-control-tower.pages.dev/', { waitUntil: 'networkidle', timeout: 30000 });
    // Wait an extra 2 seconds for any animations or maps to load
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/Users/nonarkara/Projects/axiom/public/screenshots/kmitl.png' });
    console.log('Saved kmitl.png');
  } catch (e) {
    console.log('Error fetching KMITL:', e);
  }

  console.log('Fetching Yala...');
  try {
    await page.goto('https://yala-control-tower.pages.dev/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/Users/nonarkara/Projects/axiom/public/screenshots/yala.png' });
    console.log('Saved yala.png');
  } catch (e) {
    console.log('Error fetching Yala:', e);
  }

  await browser.close();
})();
