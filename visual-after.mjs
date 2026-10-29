// Visual capture of showcase section after resize
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL = 'http://127.0.0.1:8814/?cb=' + Date.now();
const browser = await chromium.launch({
  executablePath: '/Users/nonarkara/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
});

mkdirSync('/tmp/after-visual', { recursive: true });

const VIEWPORTS = [
  { name: 'iphone-se',  w: 375,  h: 667,  dsf: 2 },
  { name: 'desktop-1280', w: 1280, h: 800,  dsf: 1 },
];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: vp.dsf });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 800) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 80));
    }
    // Find the first .sys-cell and scroll it into view
    const first = document.querySelector('img.sys-cell__shot');
    if (first) first.scrollIntoView({ block: 'start' });
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `/tmp/after-visual/${vp.name}-showcase.png` });
  await ctx.close();
  console.log(`captured ${vp.name}`);
}

await browser.close();
