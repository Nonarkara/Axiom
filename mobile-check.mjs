import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('console', msg => console.log(`[${msg.type()}] ${msg.text()}`));
page.on('pageerror', err => console.log(`[ERROR] ${err.message}`));
await page.goto('http://127.0.0.1:3000');
await page.waitForTimeout(2000);
await page.screenshot({ path: '/tmp/qa-mobile.png', fullPage: false });
console.log('Mobile screenshot saved');
await browser.close();
