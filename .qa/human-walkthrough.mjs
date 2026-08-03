import { chromium, devices } from 'playwright';
import http from 'node:http';

const BASE = 'http://127.0.0.1:3000';
const results = { issues: [], likes: [], missing: [], fixes: [] };

function log(section, msg) {
  console.log(`[${section}] ${msg}`);
}

async function takeScreenshot(page, name, viewportLabel) {
  await page.screenshot({ path: `.qa/audit-${viewportLabel}-${name}.png`, fullPage: false });
}

async function auditPage(page, url, name, viewportLabel) {
  console.log(`\n=== Auditing ${name} (${viewportLabel}) ===`);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Check console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  // Check for broken images
  const brokenImages = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src);
  });

  // Check for visible text content
  const title = await page.title();
  const h1 = await page.$eval('h1', el => el.innerText).catch(() => 'NO H1');

  // Check all links
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href]')).map(a => ({
      href: a.href,
      text: a.innerText.trim().slice(0, 50),
      target: a.target,
    }));
  });

  // Check forms
  const forms = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('form')).map(f => ({
      action: f.action,
      method: f.method,
      inputs: Array.from(f.querySelectorAll('input, textarea, select, button')).map(i => i.name || i.type || i.tagName),
    }));
  });

  // Check buttons without associated actions
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => ({
      text: b.innerText.trim().slice(0, 50),
      hasClick: b.onclick !== null || b.hasAttribute('data-map') || b.hasAttribute('id') || b.hasAttribute('class'),
    }));
  });

  await takeScreenshot(page, name, viewportLabel);

  return {
    url,
    name,
    viewportLabel,
    title,
    h1,
    consoleErrors,
    brokenImages,
    linkCount: links.length,
    externalLinks: links.filter(l => l.href.startsWith('http') && !l.href.includes('127.0.0.1')),
    forms,
    buttons,
  };
}

async function exploreHomepage(page, viewportLabel) {
  const r = await auditPage(page, BASE + '/', 'homepage', viewportLabel);

  // Click theme toggle
  const themeToggle = await page.$('#themeToggle');
  if (themeToggle) {
    await themeToggle.click();
    await page.waitForTimeout(500);
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    log('THEME', `${viewportLabel}: toggled to ${theme}`);
    await takeScreenshot(page, 'homepage-theme-light', viewportLabel);
    await themeToggle.click();
    await page.waitForTimeout(500);
  }

  // Click locale buttons
  const locales = ['th', 'zh', 'ts'];
  for (const loc of locales) {
    const btn = await page.$(`.locale-btn[data-locale="${loc}"]`);
    if (btn) {
      await btn.click();
      await page.waitForTimeout(800);
      log('LOCALE', `${viewportLabel}: switched to ${loc}`);
      await takeScreenshot(page, `homepage-locale-${loc}`, viewportLabel);
    }
  }
  // Back to EN
  const enBtn = await page.$(`.locale-btn[data-locale="en"]`);
  if (enBtn) await enBtn.click();
  await page.waitForTimeout(500);

  // Scroll through sections
  const sections = ['#systems', '#stages', '#team', '#press', '#contact'];
  for (const sec of sections) {
    const el = await page.$(sec);
    if (el) {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      await takeScreenshot(page, `homepage-scroll-${sec.replace('#','')}`, viewportLabel);
    }
  }

  // Click system tabs
  const tabs = await page.$$('.sys-tab');
  log('TABS', `${viewportLabel}: found ${tabs.length} system tabs`);
  for (let i = 0; i < Math.min(tabs.length, 5); i++) {
    await tabs[i].click();
    await page.waitForTimeout(600);
    await takeScreenshot(page, `homepage-tab-${i+1}`, viewportLabel);
  }

  // Click system map buttons
  const mapBtns = await page.$$('button.sys-map-btn');
  log('MAPBTNS', `${viewportLabel}: found ${mapBtns.length} system map buttons`);
  for (let i = 0; i < Math.min(mapBtns.length, 3); i++) {
    await mapBtns[i].click();
    await page.waitForTimeout(800);
    await takeScreenshot(page, `homepage-map-${i+1}`, viewportLabel);
    // Close diagram if there's a close mechanism
    const closeBtn = await page.$('.diagram__close, .sys__diagram-close');
    if (closeBtn) await closeBtn.click();
    else {
      // Click same button again to toggle off
      await mapBtns[i].click();
    }
    await page.waitForTimeout(400);
  }

  // Check all external links on homepage
  const extLinks = r.externalLinks;
  log('LINKS', `${viewportLabel}: ${extLinks.length} external links found`);
  for (const link of extLinks.slice(0, 10)) {
    log('LINK', `${link.text} -> ${link.href}`);
  }

  return r;
}

async function exploreAdmin(page, viewportLabel) {
  const r = await auditPage(page, BASE + '/admin/', 'admin', viewportLabel);

  // Click new case study
  const newBtn = await page.$('#newCaseStudyBtn');
  if (newBtn) {
    await newBtn.click();
    await page.waitForTimeout(800);
    await takeScreenshot(page, 'admin-new-case', viewportLabel);
  }

  // Click new timeline
  const newTimeline = await page.$('#newTimelineBtn');
  if (newTimeline) {
    await newTimeline.click();
    await page.waitForTimeout(800);
    await takeScreenshot(page, 'admin-new-timeline', viewportLabel);
  }

  // Switch locale in admin
  for (const loc of ['th', 'zh', 'ts']) {
    const btn = await page.$(`.locale-pill[data-locale="${loc}"]`);
    if (btn) {
      await btn.click();
      await page.waitForTimeout(600);
      await takeScreenshot(page, `admin-locale-${loc}`, viewportLabel);
    }
  }

  return r;
}

async function run() {
  const browser = await chromium.launch({ headless: true });

  // Desktop
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await exploreHomepage(desktop, 'desktop');
  await exploreAdmin(desktop, 'desktop');
  await desktop.close();

  // Mobile
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await exploreHomepage(mobile, 'mobile');
  await exploreAdmin(mobile, 'mobile');
  await mobile.close();

  // iPad
  const ipad = await browser.newPage({ viewport: { width: 820, height: 1180 } });
  await exploreHomepage(ipad, 'tablet');
  await ipad.close();

  await browser.close();
  console.log('\n=== AUDIT COMPLETE ===');
}

run().catch(e => { console.error(e); process.exit(1); });
