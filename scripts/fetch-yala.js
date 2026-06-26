const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  console.log('Fetching Yala...');
  try {
    // Wait until 'domcontentloaded' instead of networkidle
    await page.goto('https://yala-control-tower.pages.dev/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    // Force a wait of 5 seconds to allow Mapbox to render
    await page.waitForTimeout(5000);
    await page.screenshot({ path: '/Users/nonarkara/Projects/axiom/public/screenshots/yala.png' });
    console.log('Saved yala.png');
  } catch (e) {
    console.log('Error fetching Yala:', e);
  }

  await browser.close();
})();
