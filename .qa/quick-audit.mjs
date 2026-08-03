import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:3000';

async function snap(page, name) {
  await page.screenshot({ path: `.qa/${name}.png`, fullPage: true });
}

async function run() {
  const browser = await chromium.launch({ headless: true });

  // Desktop homepage
  const d = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await d.goto(BASE + '/', { waitUntil: 'networkidle' });
  await d.waitForTimeout(2000);
  await snap(d, 'homepage-desktop');

  // Scroll to systems
  await d.evaluate(() => document.getElementById('systems').scrollIntoView());
  await d.waitForTimeout(800);
  await snap(d, 'systems-desktop');

  // Click tab 2
  await d.click('.sys-tab[data-panel="panel-02"]');
  await d.waitForTimeout(800);
  await snap(d, 'systems-tab2-desktop');

  // Scroll to team
  await d.evaluate(() => document.getElementById('team').scrollIntoView());
  await d.waitForTimeout(800);
  await snap(d, 'team-desktop');

  // Scroll to contact
  await d.evaluate(() => document.getElementById('contact').scrollIntoView());
  await d.waitForTimeout(800);
  await snap(d, 'contact-desktop');

  // Theme light
  await d.click('#themeToggle');
  await d.waitForTimeout(800);
  await snap(d, 'homepage-light-desktop');
  await d.click('#themeToggle');
  await d.waitForTimeout(500);

  // Locale Thai
  await d.click('.locale-btn[data-locale="th"]');
  await d.waitForTimeout(1000);
  await snap(d, 'homepage-th-desktop');

  await d.close();

  // Mobile homepage
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await m.goto(BASE + '/', { waitUntil: 'networkidle' });
  await m.waitForTimeout(2000);
  await snap(m, 'homepage-mobile');

  // Scroll systems mobile
  await m.evaluate(() => document.getElementById('systems').scrollIntoView());
  await m.waitForTimeout(800);
  await snap(m, 'systems-mobile');

  // Click tab on mobile
  await m.click('.sys-tab[data-panel="panel-02"]');
  await m.waitForTimeout(800);
  await snap(m, 'systems-tab2-mobile');

  // Scroll to contact mobile
  await m.evaluate(() => document.getElementById('contact').scrollIntoView());
  await m.waitForTimeout(800);
  await snap(m, 'contact-mobile');

  // Theme toggle mobile
  await m.click('#themeToggle');
  await m.waitForTimeout(800);
  await snap(m, 'homepage-light-mobile');

  await m.close();

  // Admin desktop
  const a = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await a.goto(BASE + '/admin/', { waitUntil: 'networkidle' });
  await a.waitForTimeout(2000);
  await snap(a, 'admin-desktop');
  await a.close();

  // Admin mobile
  const am = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await am.goto(BASE + '/admin/', { waitUntil: 'networkidle' });
  await am.waitForTimeout(2000);
  await snap(am, 'admin-mobile');
  await am.close();

  await browser.close();
  console.log('Screenshots saved to .qa/');
}

run().catch(e => { console.error(e); process.exit(1); });
