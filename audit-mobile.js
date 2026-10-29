const { chromium } = require('playwright');
const fs = require('fs');

const viewports = [
  { name: 'iPhone-SE', w: 375, h: 667, pixelRatio: 2 },
  { name: 'iPhone-12', w: 390, h: 844, pixelRatio: 3 },
  { name: 'Pixel-7', w: 412, h: 915, pixelRatio: 2.625 },
  { name: 'iPhone-Plus', w: 414, h: 896, pixelRatio: 3 },
  { name: 'iPad-mini', w: 768, h: 1024, pixelRatio: 2 },
];

const sections = [
  { name: '01-hero', scrollSelector: '#hero' },
  { name: '02-systems-city', scrollSelector: '#systems' },
  { name: '03-systems-mid', scrollSelector: null, scrollY: 1500 },
  { name: '04-systems-low', scrollSelector: null, scrollY: 3500 },
  { name: '05-lab', scrollSelector: '#lab' },
  { name: '06-stages', scrollSelector: '#stages' },
  { name: '07-team', scrollSelector: '#team' },
  { name: '08-press', scrollSelector: null, scrollY: 'find:press' },
  { name: '09-contact', scrollSelector: '#contact' },
  { name: '10-footer', scrollSelector: 'footer' },
];

async function scrollToSection(page, sec) {
  if (sec.scrollSelector) {
    return await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return 0;
      el.scrollIntoView({ block: 'start' });
      return window.scrollY;
    }, sec.scrollSelector);
  } else if (typeof sec.scrollY === 'string' && sec.scrollY.startsWith('find:')) {
    const sel = sec.scrollY.slice(5);
    return await page.evaluate((s) => {
      const el = document.querySelector(s);
      if (!el) return 0;
      el.scrollIntoView({ block: 'start' });
      return window.scrollY;
    }, sel);
  } else {
    await page.evaluate((y) => window.scrollTo(0, y), sec.scrollY);
    return sec.scrollY;
  }
}

async function auditIssues(page, vp) {
  return await page.evaluate((vpName) => {
    const issues = [];
    
    // Check 1: Tap targets - find all small links/buttons
    document.querySelectorAll('a, button').forEach((el, i) => {
      const r = el.getBoundingClientRect();
      // Only check visible elements
      if (r.width === 0 || r.height === 0) return;
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const cs = window.getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      // Tap target check: less than 32x32 is bad
      if (r.width < 32 || r.height < 32) {
        issues.push({
          type: 'tap-target',
          severity: r.width < 24 || r.height < 24 ? 'high' : 'medium',
          element: el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ')[0] : ''),
          text: (el.textContent || '').trim().slice(0, 40),
          size: `${Math.round(r.width)}x${Math.round(r.height)}`,
        });
      }
    });
    
    // Check 2: Body horizontal overflow
    const bodyW = document.documentElement.scrollWidth;
    const viewW = window.innerWidth;
    if (bodyW > viewW + 1) {
      issues.push({
        type: 'horizontal-overflow',
        severity: 'high',
        bodyW,
        viewW,
        diff: bodyW - viewW,
      });
    }
    
    // Check 3: Font size too small for body text
    document.querySelectorAll('p, li, td, .t-body, .t-body-2, .cell').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.bottom < 0 || r.top > window.innerHeight) return;
      const cs = window.getComputedStyle(el);
      const fs = parseFloat(cs.fontSize);
      if (fs < 11 && el.textContent && el.textContent.trim().length > 10) {
        issues.push({
          type: 'small-text',
          severity: fs < 9 ? 'high' : 'medium',
          fontSize: fs,
          text: el.textContent.trim().slice(0, 60),
        });
      }
    });
    
    // Check 4: Fixed positioning that might cause issues on mobile
    document.querySelectorAll('*').forEach((el) => {
      const cs = window.getComputedStyle(el);
      if (cs.position === 'fixed' && el.offsetWidth > 100) {
        const r = el.getBoundingClientRect();
        // Check if it covers too much of the viewport
        if (r.width / window.innerWidth > 0.9) {
          issues.push({
            type: 'fixed-wide',
            element: el.tagName.toLowerCase() + (el.id ? '#' + el.id : ''),
            width: r.width,
            viewport: window.innerWidth,
          });
        }
      }
    });
    
    return issues;
  }, vp.name);
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/Users/nonarkara/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    args: ['--no-sandbox']
  });
  const results = {};
  for (const vp of viewports) {
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      deviceScaleFactor: vp.pixelRatio,
      isMobile: vp.w < 768,
      hasTouch: vp.w < 768,
      userAgent: vp.w < 768 ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' : undefined,
    });
    const page = await ctx.newPage();
    page.on('console', msg => {
      if (msg.type() === 'error') console.log(`[${vp.name} CONSOLE ERROR]`, msg.text().slice(0, 200));
    });
    page.on('pageerror', err => console.log(`[${vp.name} PAGE ERROR]`, err.message));
    await page.goto('https://axiom.nonarkara.org/?cb=' + Date.now(), { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    
    results[vp.name] = { issues: {}, screenshots: [] };
    
    for (const sec of sections) {
      const y = await scrollToSection(page, sec);
      await page.waitForTimeout(500);
      const filename = `/tmp/audit-${vp.name}-${sec.name}.png`;
      await page.screenshot({ path: filename, fullPage: false });
      results[vp.name].screenshots.push(filename);
      
      // Audit issues for this section
      const issues = await auditIssues(page, vp);
      if (issues.length > 0) {
        results[vp.name].issues[sec.name] = issues;
      }
    }
    
    await ctx.close();
  }
  await browser.close();
  
  // Write report
  fs.writeFileSync('/tmp/audit-report.json', JSON.stringify(results, null, 2));
  
  // Print summary
  console.log('\n=== AUDIT SUMMARY ===');
  let totalIssues = 0;
  for (const [vp, data] of Object.entries(results)) {
    const issueCount = Object.values(data.issues).reduce((s, arr) => s + arr.length, 0);
    totalIssues += issueCount;
    console.log(`\n${vp}: ${issueCount} issues across ${Object.keys(data.issues).length} sections`);
    for (const [sec, issues] of Object.entries(data.issues)) {
      console.log(`  ${sec}: ${issues.length}`);
      issues.slice(0, 3).forEach(i => console.log(`    - [${i.severity || '?'}] ${i.type}: ${i.text || i.element || JSON.stringify(i).slice(0, 100)}`));
    }
  }
  console.log(`\nTotal: ${totalIssues} issues`);
  console.log('Screenshots:', Object.values(results).flatMap(r => r.screenshots).length);
})();
