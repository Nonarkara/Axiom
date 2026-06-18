const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  console.log('Fetching Horizon 45...');
  try {
    await page.goto('https://horizon-field-lab.pages.dev/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(4000);
    await page.screenshot({ path: '/Users/nonarkara/Projects/axiom/public/screenshots/horizon45.png' });
    console.log('Saved horizon45.png');
  } catch (e) {
    console.log('Error fetching Horizon 45:', e);
  }

  await browser.close();
})();
