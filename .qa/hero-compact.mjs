import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const before = process.argv.includes('--before');
const out = process.env.HERO_EVIDENCE || '/tmp/axiom-hero-20261105';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
let failures = 0;
const check = (ok, label) => { console.log(`${ok ? 'PASS' : 'FAIL'} ${label}`); if (!ok) failures++; };
for (const [width, height, dpr, enlarged] of [[390,844,1,false],[1024,900,1,false],[1152,760,3,false],[1440,900,1,false],[390,844,1,true]]) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: dpr, reducedMotion: 'reduce' });
  if (before) {
    const css = (await readFile(new URL('../public/hero.css', import.meta.url), 'utf8')).split('/* 2026-11-05: column operating table.')[0];
    await page.route('**/hero.css?*', route => route.fulfill({ contentType:'text/css', body:css }));
  }
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(process.env.HERO_URL || 'http://127.0.0.1:5613/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  if (enlarged) await page.addStyleTag({ content: '#hero :is(p,span,button,select,a,label) { font-size: 150% !important; }' });
  await page.waitForTimeout(1200);
  const key = `${width}${dpr > 1 ? '-3x' : ''}${enlarged ? '-large' : ''}`;
  const measure = () => page.evaluate(() => {
    const box = s => { const r = document.querySelector(s).getBoundingClientRect(); return { x:r.x,y:r.y,w:r.width,h:r.height,b:r.bottom,r:r.right }; };
    const map = box('#heroMap');
    const instruments = ['.hero-copy','.hero-node-strip','.hero-stats','.hero-proof','.map-mode','.sat-hud'].map(box);
    return { hero:box('#hero'), map, mode:box('.map-mode'), action:box('.hero-actions .btn--primary'), copy:box('.hero-copy'), nodes:box('.hero-node-strip'), stats:box('.hero-stats'), proof:box('.hero-proof'),
      occlusions: instruments.filter(r => r.x < map.r && r.r > map.x && r.y < map.b - 1 && r.b > map.y + 1).length,
      filter:getComputedStyle(document.querySelector('#heroMap')).filter,
      overflow:document.documentElement.scrollWidth > innerWidth,
      canvas:!!document.querySelector('#heroCanvas'), tiles:document.querySelectorAll('#heroMap .leaflet-tile-loaded').length,
      pins:[...document.querySelectorAll('#heroMap .sat-project-pin')].filter(e => { const r=e.getBoundingClientRect(); return r.x >= map.x && r.right <= map.r && r.y >= map.y && r.bottom <= map.b; }).length,
      options:document.querySelector('#heroProjectSelect').options.length, chips:document.querySelectorAll('.hero-node').length };
  });
  const geometry = await measure();
  await page.screenshot({ path:`${out}/${before ? 'before' : 'after'}-${key}.png` });
  await page.locator('#hero').screenshot({ path:`${out}/${before ? 'before' : 'after'}-${key}-hero.png` });
  results.push({ key, geometry, errors });
  if (!before) {
    check(geometry.map.h * geometry.map.w >= height * width * .6 - 2, `${key}: map occupies >=60% viewport`);
    check(!geometry.occlusions && geometry.filter === 'none', `${key}: unobscured undimmed map`);
    check(geometry.mode.b <= height && (width < 701 ? geometry.mode.y >= geometry.map.b - 1 : geometry.mode.x >= geometry.map.r - 1), `${key}: first map action visible at exit`);
    check(geometry.hero.b <= height + 1, `${key}: hero cannot bleed past viewport`);
    if (enlarged) {
      const action = page.locator('.hero-actions .btn--primary');
      await action.scrollIntoViewIfNeeded();
      check(await action.evaluate(e => { const r=e.getBoundingClientRect(), h=document.querySelector('#hero').getBoundingClientRect(); return r.top >= h.top && r.bottom <= h.bottom; }), `${key}: enlarged proof action reachable by scrolling`);
    } else check(geometry.action.b <= geometry.hero.b, `${key}: primary proof action fully visible`);
    check(!geometry.overflow && geometry.tiles > 0 && geometry.canvas && geometry.options > 1 && geometry.chips === 4 && !errors.length, `${key}: preserved working surface`);
    check(geometry.pins > 0, `${key}: project pins visible inside map`);
    check(width < 701 || geometry.proof.x >= geometry.map.r - 1 && geometry.proof.b <= geometry.hero.b, `${key}: console docked inside hero`);
    check(width < 701 || geometry.proof.y - geometry.stats.b >= 0 && geometry.proof.y - geometry.stats.b <= 16, `${key}: stats and console joined without clipping or void`);
    for (const tab of await page.locator('.hero-console__tab').all()) {
      await tab.click();
      const id = await tab.getAttribute('aria-controls');
      const panel = page.locator(`#${id}`);
      check(await panel.isVisible() && await tab.getAttribute('aria-selected') === 'true', `${key}: ${id} opens`);
      const depth = await panel.evaluate(e => { e.scrollTop = e.scrollHeight; return {h:e.clientHeight, scroll:e.scrollHeight, end:e.scrollTop + e.clientHeight >= e.scrollHeight - 2}; });
      check(depth.h <= 258 && depth.end, `${key}: ${id} depth reachable inside bounded panel`);
      await page.locator('#heroConsole').screenshot({ path:`${out}/after-${key}-${id}.png` });
    }
    await page.locator('#heroProjectSelect').selectOption({ index: 1 });
    check(await page.locator('#heroProjectSelect').inputValue() !== 'thailand', `${key}: location selector works`);
    await page.evaluate(() => scrollTo(0,0));
    await page.addStyleTag({ content:'#hero { min-height: 2400px !important; row-gap: 180px !important; } #heroMap { height: 200px !important; }' });
    const bad = await measure();
    check(bad.hero.h > height * 2.15 && bad.map.h < height * .6, `${key}: old-height / gap falsifier rejected`);
  }
  await page.close();
}
if (!before) {
  const page = await browser.newPage({ viewport:{width:1152,height:760}, deviceScaleFactor:3 });
  await page.goto(process.env.HERO_URL || 'http://127.0.0.1:5613/', { waitUntil:'networkidle' });
  await page.waitForTimeout(1000);
  check(await page.locator('#mapModeBtn').getAttribute('aria-pressed') === 'true', 'motion: AUTO TOUR starts');
  const title = await page.locator('#heroRotatingText').textContent();
  await page.waitForTimeout(6500);
  check(await page.locator('#heroRotatingText').textContent() !== title, 'motion: headline rotates');
  const pixels = await page.locator('#heroCanvas').evaluate(c => {
    const a=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
    let painted=0; for(let i=3;i<a.length;i+=4) if(a[i]) painted++;
    return painted;
  });
  check(pixels > 0, 'motion: canvas paints real pixels');
  await page.locator('#mapModeBtn').click();
  check(await page.locator('#mapModeBtn').getAttribute('aria-pressed') === 'false', 'motion: tour pauses on request');
  for (const chip of await page.locator('.hero-node').all()) {
    await chip.click();
    check(await chip.getAttribute('aria-pressed') === 'true', `chip ${await chip.getAttribute('data-city')} selects theatre`);
  }
  await page.screenshot({path:`${out}/after-1152-3x-motion.png`});
  await page.close();
}
await browser.close();
await writeFile(`${out}/${before ? 'before' : 'after'}.json`, JSON.stringify(results,null,2));
console.log(`Evidence: ${out}; failures: ${failures}`);
process.exitCode = failures ? 1 : 0;
