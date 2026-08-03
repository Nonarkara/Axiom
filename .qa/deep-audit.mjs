import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:3000';
const issues = [];

function issue(type, msg) {
  issues.push({ type, msg });
  console.log(`[${type}] ${msg}`);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') issue('CONSOLE_ERROR', msg.text());
  });
  page.on('pageerror', err => {
    issue('PAGE_ERROR', err.message);
  });

  // Homepage
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Check for broken images
  const brokenImages = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).filter(img => !img.complete || img.naturalWidth === 0).map(img => ({ src: img.src, alt: img.alt }));
  });
  brokenImages.forEach(img => issue('BROKEN_IMAGE', `${img.alt || 'no-alt'} -> ${img.src}`));

  // Check version tag
  const versionText = await page.$eval('#versionTag', el => el.textContent).catch(() => null);
  if (!versionText || versionText.includes('Loading')) issue('VERSION_TAG', `Version tag shows: "${versionText}"`);
  else console.log(`[OK] Version tag: ${versionText}`);

  // Check counters
  const counters = await page.$$eval('.counter', els => els.map(el => ({ to: el.dataset.to, text: el.textContent })));
  counters.forEach(c => {
    if (c.text === '0') issue('COUNTER', `Counter stuck at 0 (target: ${c.to})`);
    else console.log(`[OK] Counter: ${c.text} (target: ${c.to})`);
  });

  // Check all links
  const allLinks = await page.$$eval('a[href]', els => els.map(el => ({ href: el.href, text: el.textContent.trim().slice(0, 40) })));
  const externalLinks = allLinks.filter(l => l.href.startsWith('http') && !l.href.includes('127.0.0.1'));
  console.log(`[INFO] External links: ${externalLinks.length}`);

  // Check form existence
  const hasContactForm = await page.$('#contactForm') !== null;
  if (!hasContactForm) issue('MISSING', 'No contact form found — only mailto link');

  // Check for evidence section
  const hasEvidence = await page.$('#evidence') !== null;
  if (!hasEvidence) issue('MISSING', 'No evidence dashboard section found');

  // Check for terminal
  const hasTerminal = await page.$('#terminalOverlay') !== null;
  if (!hasTerminal) issue('MISSING', 'No command terminal found');

  // Check for hero map
  const hasHeroMap = await page.$('#heroMap') !== null;
  if (!hasHeroMap) issue('MISSING', 'No hero satellite map found');

  // Check for health grid
  const hasHealth = await page.$('#healthGrid') !== null;
  if (!hasHealth) issue('MISSING', 'No health monitor grid found');

  // Check SEO meta tags
  const title = await page.title();
  const desc = await page.$eval('meta[name="description"]', el => el.content).catch(() => null);
  const ogImage = await page.$eval('meta[property="og:image"]', el => el.content).catch(() => null);
  console.log(`[OK] Title: ${title}`);
  console.log(`[OK] Description: ${desc}`);
  console.log(`[OK] OG Image: ${ogImage}`);

  // Check pageview API
  const pvRes = await page.evaluate(async () => {
    try {
      const r = await fetch('/api/pageview', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: '/' }) });
      return r.status;
    } catch(e) { return e.message; }
  });
  console.log(`[OK] Pageview API status: ${pvRes}`);

  // Check analytics summary
  const analytics = await page.evaluate(async () => {
    try {
      const r = await fetch('/api/analytics/summary');
      return r.ok ? await r.json() : null;
    } catch(e) { return null; }
  });
  console.log(`[OK] Analytics: ${JSON.stringify(analytics)}`);

  // Check sitemap
  const sitemap = await page.goto(BASE + '/sitemap.xml', { waitUntil: 'domcontentloaded' });
  const sitemapOk = sitemap.status() === 200;
  console.log(`[OK] Sitemap: ${sitemapOk ? '200' : sitemap.status()}`);

  // Check robots.txt
  const robots = await page.goto(BASE + '/robots.txt', { waitUntil: 'domcontentloaded' });
  const robotsOk = robots.status() === 200;
  console.log(`[OK] Robots: ${robotsOk ? '200' : robots.status()}`);

  // Check 404 handling
  const notFound = await page.goto(BASE + '/nonexistent-page', { waitUntil: 'networkidle' });
  const notFoundStatus = notFound.status();
  console.log(`[INFO] 404 page status: ${notFoundStatus}`);

  await browser.close();

  console.log('\n=== AUDIT SUMMARY ===');
  const grouped = {};
  issues.forEach(i => { grouped[i.type] = (grouped[i.type] || 0) + 1; });
  Object.entries(grouped).forEach(([type, count]) => console.log(`${type}: ${count}`));
  if (issues.length === 0) console.log('No issues found!');
}

run().catch(e => { console.error(e); process.exit(1); });
