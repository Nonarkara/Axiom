// Measure displayed vs intrinsic dimensions for every <img class="sys-cell__shot">.
// Output: /tmp/thumb-audit.json — {path, intrinsicW, intrinsicH, fileBytes, displayedW, displayedH, viewport}
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const URL = 'http://127.0.0.1:8814/';
const VIEWPORTS = [
  { name: 'iphone-se',  w: 375,  h: 667,  dsf: 2 },
  { name: 'tablet-768', w: 768,  h: 1024, dsf: 2 },
  { name: 'desktop-1280', w: 1280, h: 800,  dsf: 1 },
];

const browser = await chromium.launch({
  executablePath: '/Users/nonarkara/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
});

const report = [];
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: vp.dsf });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  // Scroll to load lazy images
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 800) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);

  const data = await page.evaluate(() => {
    const shots = Array.from(document.querySelectorAll('img.sys-cell__shot'));
    return shots.map((img) => {
      const r = img.getBoundingClientRect();
      return {
        src: img.getAttribute('src'),
        displayedW: r.width,
        displayedH: r.height,
        naturalW: img.naturalWidth,
        naturalH: img.naturalHeight,
      };
    });
  });
  report.push({ viewport: vp.name, w: vp.w, h: vp.h, dsf: vp.dsf, shots: data });
  await ctx.close();
}
await browser.close();
writeFileSync('/tmp/thumb-audit.json', JSON.stringify(report, null, 2));
console.log('wrote /tmp/thumb-audit.json');
