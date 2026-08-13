// Verify after resize: every thumbnail still loads, layout intact.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const URL = 'http://127.0.0.1:8814/?cb=' + Date.now();
const browser = await chromium.launch({
  executablePath: '/Users/nonarkara/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
});

const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();
const failed = [];
page.on('response', (r) => {
  if (r.url().endsWith('.png') || r.url().endsWith('.jpg')) {
    if (r.status() >= 400) failed.push({ url: r.url(), status: r.status() });
  }
});

await page.goto(URL, { waitUntil: 'networkidle' });
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 800) {
    window.scrollTo(0, y);
    await new Promise(r => setTimeout(r, 100));
  }
});
await page.waitForTimeout(2000);

const broken = await page.evaluate(() => {
  const imgs = Array.from(document.querySelectorAll('img'));
  return imgs
    .filter((i) => i.complete && i.naturalWidth === 0)
    .map((i) => i.getAttribute('src'));
});

const sizes = await page.evaluate(() => {
  const shots = Array.from(document.querySelectorAll('img.sys-cell__shot'));
  return shots.map((s) => ({
    src: s.getAttribute('src'),
    natural: `${s.naturalWidth}x${s.naturalHeight}`,
    disp: `${Math.round(s.getBoundingClientRect().width)}x${Math.round(s.getBoundingClientRect().height)}`,
  })).slice(0, 5);
});

await page.screenshot({ path: '/tmp/after-resize-desktop.png', fullPage: false });
writeFileSync('/tmp/after-resize-report.json', JSON.stringify({ failed, broken, sizes }, null, 2));
console.log(`Failed image responses: ${failed.length}`);
console.log(`Broken <img>: ${broken.length}`);
console.log('First 5 thumbnails:', JSON.stringify(sizes, null, 2));

await browser.close();
