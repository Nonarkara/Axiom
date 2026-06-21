import { chromium, devices } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY ||= '1';

const baseUrl = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const outDir = path.join(process.cwd(), '.qa');

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function gotoPage(page, url = baseUrl) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  } catch (error) {
    await page.goto('about:blank', { waitUntil: 'commit', timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(500);
    await page.goto(url, { waitUntil: 'commit', timeout: 45000 });
  }
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function isKnownDevConsoleMessage(message) {
  return message.text.includes('in-browser Babel transformer');
}

function isActionableRequestFailure(failure) {
  if (!failure?.url) return false;
  if (failure.url.endsWith('/favicon.ico')) return false;
  return true;
}

function createTelemetry(page) {
  const consoleMessages = [];
  const pageErrors = [];
  const requestFailures = [];

  page.on('console', (message) => {
    if (['error', 'warning', 'warn'].includes(message.type())) {
      consoleMessages.push({
        type: message.type(),
        text: normalizeText(message.text()),
      });
    }
  });
  page.on('pageerror', (error) => {
    pageErrors.push(normalizeText(error?.stack || error?.message || String(error)));
  });
  page.on('requestfailed', (request) => {
    requestFailures.push({
      url: request.url(),
      error: request.failure()?.errorText || 'unknown',
    });
  });

  return { consoleMessages, pageErrors, requestFailures };
}

async function collectPageHealth(page, expectedSelectors = []) {
  const selectorStates = {};
  for (const selector of expectedSelectors) {
    selectorStates[selector] = await page.locator(selector).count();
  }

  const runtime = await page.evaluate(() => {
    const overlaySelector = '[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay';
    const overflow = Array.from(document.querySelectorAll('body *'))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          id: element.id || '',
          className: typeof element.className === 'string' ? element.className.slice(0, 120) : '',
          overflow: Math.round(rect.right - document.documentElement.clientWidth),
        };
      })
      .filter((entry) => entry.overflow > 1)
      .sort((left, right) => right.overflow - left.overflow)
      .slice(0, 8);

    return {
      title: document.title,
      bodyTextLength: document.body.innerText.trim().length,
      hasErrorOverlay: Boolean(document.querySelector(overlaySelector)),
      viewport: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        clientWidth: document.documentElement.clientWidth,
        clientHeight: document.documentElement.clientHeight,
      },
      documentWidth: document.documentElement.scrollWidth,
      documentHeight: document.documentElement.scrollHeight,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      overflow,
      buttonCount: document.querySelectorAll('button').length,
      anchorCount: document.querySelectorAll('a').length,
    };
  });

  return { selectorStates, ...runtime };
}

async function primeScrollReveals(page) {
  const selectors = [
    '.hero',
    '#systems',
    '#stages',
    '#team',
    '#press',
    '#contact',
  ];

  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if (await locator.count()) {
      await locator.scrollIntoViewIfNeeded();
      await page.waitForTimeout(180);
    }
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(350);
}

async function checkAnchor(page, label, selector, expectedId) {
  await gotoPage(page);
  await page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => {});
  await page.waitForTimeout(250);

  const link = page.locator(selector);
  const linkCount = await link.count();
  if (linkCount !== 1) {
    return { kind: 'anchor', label, ok: false, state: { linkCount } };
  }

  await link.click();
  await page.waitForFunction((id) => {
    const target = document.getElementById(id);
    const rect = target?.getBoundingClientRect();
    return Boolean(target)
      && rect
      && rect.top < window.innerHeight - 80
      && rect.bottom > 80;
  }, expectedId, { timeout: 3000 }).catch(() => {});

  const state = await page.evaluate((id) => {
    const target = document.getElementById(id);
    const rect = target?.getBoundingClientRect();
    return {
      targetFound: Boolean(target),
      top: rect ? Math.round(rect.top) : null,
      bottom: rect ? Math.round(rect.bottom) : null,
      viewportHeight: window.innerHeight,
      hash: location.hash,
      scrollY: Math.round(scrollY),
    };
  }, expectedId);

  const visibleInViewport = state.targetFound
    && state.top !== null
    && state.bottom !== null
    && state.top < state.viewportHeight - 80
    && state.bottom > 80;

  return { kind: 'anchor', label, ok: visibleInViewport, state };
}

async function inspectHomepage(browser, name, contextOptions) {
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  const telemetry = createTelemetry(page);
  const checks = [];

  await gotoPage(page);
  await page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => {});
  await page.waitForSelector('.hero', { timeout: 15000 });
  await page.waitForSelector('#systems .sys-cell', { timeout: 15000 });
  await page.waitForSelector('#team', { timeout: 15000 });
  await page.waitForSelector('#contact', { timeout: 15000 });
  await page.waitForTimeout(1200);
  await primeScrollReveals(page);

  const fullPath = path.join(outDir, `homepage-${name}-full.png`);
  await page.screenshot({ path: fullPath, fullPage: true });

  await page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll('#systems img'));
    for (const image of images) {
      image.loading = 'eager';
      image.scrollIntoView({ block: 'center' });
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() => Array.from(document.querySelectorAll('#systems img'))
    .every((image) => image.complete && image.naturalWidth > 0), null, { timeout: 8000 }).catch(() => {});

  const systemGridState = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#systems .sys-cell'));
    const images = cards.map((card) => {
      const image = card.querySelector('img');
      return {
        name: card.querySelector('.sys-cell__name')?.textContent?.trim() || '',
        src: image?.getAttribute('src') || '',
        complete: Boolean(image?.complete),
        naturalWidth: image?.naturalWidth || 0,
      };
    });
    const hrefs = cards.map((card) => card.getAttribute('href') || '');
    return {
      cardCount: cards.length,
      liveStatusCount: document.querySelectorAll('#systems .sys-cell__status').length,
      imageCount: images.length,
      brokenImages: images.filter((image) => !image.complete || image.naturalWidth < 1),
      cdpRootLink: hrefs.includes('https://cdp.nonarkara.org/'),
      staleCdpLink: hrefs.includes('https://cdp.nonarkara.org/v2/dashboard.html'),
      externalLinkCount: hrefs.filter((href) => /^https?:\/\//.test(href)).length,
    };
  });
  checks.push({
    kind: 'system-grid',
    label: 'systems card grid',
    ok: systemGridState.cardCount >= 20
      && systemGridState.liveStatusCount >= 20
      && systemGridState.imageCount >= 20
      && systemGridState.brokenImages.length === 0
      && systemGridState.cdpRootLink
      && !systemGridState.staleCdpLink,
    state: systemGridState,
  });

  const localeStates = [];
  for (const locale of ['th', 'zh', 'ts', 'en']) {
    await page.click(`#localeSwitch [data-locale="${locale}"]`);
    await page.waitForTimeout(120);
    localeStates.push(await page.evaluate((expectedLocale) => ({
      expectedLocale,
      htmlLang: document.documentElement.lang,
      active: document.querySelector('#localeSwitch .active')?.getAttribute('data-locale') || '',
      heading: document.querySelector('.hero__title')?.textContent?.replace(/\s+/g, ' ').trim() || '',
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    }), locale));
  }
  checks.push({
    kind: 'locale-switch',
    label: 'homepage locale buttons',
    ok: localeStates.every((state) => state.htmlLang === state.expectedLocale
      && state.active === state.expectedLocale
      && state.heading.length > 8
      && !state.horizontalOverflow),
    state: localeStates,
  });

  checks.push(await checkAnchor(page, 'hero systems CTA', '.hero a.btn--primary[href="#systems"]', 'systems'));
  checks.push(await checkAnchor(page, 'hero contact CTA', '.hero a.btn--ghost[href="#contact"]', 'contact'));
  if (name !== 'mobile') {
    checks.push(await checkAnchor(page, 'masthead contact CTA', '.masthead a.btn--primary[href="#contact"]', 'contact'));
  }
  checks.push(await checkAnchor(page, 'footer systems', '.foot .nav a[href="#systems"]', 'systems'));
  checks.push(await checkAnchor(page, 'footer contact', '.foot .nav a[href="#contact"]', 'contact'));

  const staticContentState = await page.evaluate(() => ({
    founderCount: document.querySelectorAll('#team .cv__name').length,
    cvBlockCount: document.querySelectorAll('#team .cv-block').length,
    pressRows: document.querySelectorAll('#press .press-row').length,
    proBonoCards: document.querySelectorAll('#team .probono-card').length,
    contactLinks: document.querySelectorAll('#contact .btn').length,
  }));
  checks.push({
    kind: 'static-content',
    label: 'team/press/contact sections',
    ok: staticContentState.founderCount >= 2
      && staticContentState.cvBlockCount >= 8
      && staticContentState.pressRows >= 6
      && staticContentState.proBonoCards >= 4
      && staticContentState.contactLinks >= 3,
    state: staticContentState,
  });

  await gotoPage(page);
  await page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => {});
  await page.waitForTimeout(1000);
  const evidencePath = path.join(outDir, `homepage-${name}-evidence.png`);
  await page.locator('#systems').screenshot({ path: evidencePath });

  const diagnostics = await collectPageHealth(page, [
    '.hero',
    '.hero__columns',
    '#systems .sys-cell',
    '#stages',
    '#team',
    '#press',
    '#contact',
  ]);

  const counts = await page.evaluate(() => ({
    systemCards: document.querySelectorAll('#systems .sys-cell').length,
    systemImages: document.querySelectorAll('#systems .sys-cell img').length,
    founderNames: document.querySelectorAll('#team .cv__name').length,
    localeButtons: document.querySelectorAll('#localeSwitch [data-locale]').length,
    pressLinks: document.querySelectorAll('.press-row').length,
    proBonoLinks: document.querySelectorAll('.probono-card').length,
  }));

  await context.close();

  return {
    page: 'homepage',
    viewportName: name,
    screenshots: { full: fullPath, systems: evidencePath },
    counts,
    checks,
    diagnostics,
    telemetry,
  };
}

async function inspectAdmin(browser, name, contextOptions) {
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  const telemetry = createTelemetry(page);
  const url = `${baseUrl.replace(/\/$/, '')}/admin/`;

  await gotoPage(page, url);
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  await page.waitForSelector('#localeSwitch', { timeout: 15000 });
  await page.waitForTimeout(1000);

  const fullPath = path.join(outDir, `admin-${name}-full-en.png`);
  await page.screenshot({ path: fullPath, fullPage: true });

  const initialCounts = await page.evaluate(() => ({
    localeButtons: document.querySelectorAll('#localeSwitch [data-locale]').length,
    caseForm: Boolean(document.querySelector('#caseStudyForm')),
    historyForm: Boolean(document.querySelector('#historyForm')),
    caseItems: document.querySelectorAll('#caseStudyList [data-case-id]').length,
    historyItems: document.querySelectorAll('#historyList [data-history-id]').length,
  }));

  await page.click('#localeSwitch [data-locale="th"]');
  await page.waitForTimeout(250);
  const thaiHeading = normalizeText(await page.locator('#caseLocaleTitle').textContent());

  await page.click('#localeSwitch [data-locale="zh"]');
  await page.waitForTimeout(250);
  const chineseHeading = normalizeText(await page.locator('#caseLocaleTitle').textContent());

  await page.click('#localeSwitch [data-locale="ts"]');
  await page.waitForTimeout(250);
  const typescriptHeading = normalizeText(await page.locator('#caseLocaleTitle').textContent());
  const previewText = normalizeText((await page.locator('#typescriptPreview').textContent()) || '');
  const typescriptPath = path.join(outDir, `admin-${name}-typescript.png`);
  await page.screenshot({ path: typescriptPath, fullPage: true });

  const diagnostics = await collectPageHealth(page, [
    '#localeSwitch',
    '#caseStudyForm',
    '#historyForm',
    '#typescriptPreview',
  ]);

  await context.close();

  return {
    page: 'admin',
    viewportName: name,
    screenshots: { full: fullPath, typescript: typescriptPath },
    initialCounts,
    localeSwitch: {
      thaiHeading,
      chineseHeading,
      typescriptHeading,
      previewHasSnapshot: previewText.includes('editorSnapshot'),
    },
    diagnostics,
    telemetry,
  };
}

function collectFindings(results) {
  const findings = [];

  for (const result of results) {
    if (result.telemetry.pageErrors.length) {
      findings.push(`${result.page}/${result.viewportName}: page errors detected`);
    }

    const actionableConsole = result.telemetry.consoleMessages.filter((message) => !isKnownDevConsoleMessage(message));
    if (actionableConsole.length) {
      findings.push(`${result.page}/${result.viewportName}: console warnings/errors detected`);
    }

    const actionableRequestFailures = result.telemetry.requestFailures.filter(isActionableRequestFailure);
    if (actionableRequestFailures.length) {
      findings.push(`${result.page}/${result.viewportName}: request failures detected`);
    }

    if (result.diagnostics.hasErrorOverlay) {
      findings.push(`${result.page}/${result.viewportName}: framework error overlay detected`);
    }

    if (result.diagnostics.bodyTextLength < 80) {
      findings.push(`${result.page}/${result.viewportName}: page body text unexpectedly short`);
    }

    if (result.diagnostics.horizontalOverflow) {
      findings.push(`${result.page}/${result.viewportName}: horizontal overflow detected`);
    }

    if (result.page === 'homepage') {
      const missingSelectors = Object.entries(result.diagnostics.selectorStates)
        .filter(([, count]) => count < 1)
        .map(([selector]) => selector);
      if (missingSelectors.length) {
        findings.push(`homepage/${result.viewportName}: missing selectors ${missingSelectors.join(', ')}`);
      }

      const failedChecks = result.checks.filter((check) => !check.ok);
      if (failedChecks.length) {
        findings.push(`homepage/${result.viewportName}: failed interaction checks ${failedChecks.map((check) => check.label).join(', ')}`);
      }

      if (result.counts.systemCards < 20 || result.counts.systemImages < 20) {
        findings.push(`homepage/${result.viewportName}: system card/image count changed unexpectedly`);
      }

      if (result.counts.founderNames < 2 || result.counts.localeButtons < 4 || result.counts.pressLinks < 6 || result.counts.proBonoLinks < 4) {
        findings.push(`homepage/${result.viewportName}: team/press/pro-bono controls missing`);
      }
    }

    if (result.page === 'admin') {
      if (result.initialCounts.localeButtons < 4 || !result.initialCounts.caseForm || !result.initialCounts.historyForm) {
        findings.push(`admin/${result.viewportName}: editor controls missing`);
      }

      if (!result.localeSwitch.thaiHeading || !result.localeSwitch.chineseHeading || !result.localeSwitch.previewHasSnapshot) {
        findings.push(`admin/${result.viewportName}: locale or TypeScript preview did not update`);
      }
    }
  }

  return findings;
}

const browser = await chromium.launch({ headless: true });

try {
  await ensureDir(outDir);

  const results = [];
  results.push(await inspectHomepage(browser, 'desktop', { viewport: { width: 1440, height: 1200 } }));
  results.push(await inspectHomepage(browser, 'mobile', {
    ...devices['iPhone 13'],
    viewport: { width: 390, height: 1200 },
  }));
  results.push(await inspectAdmin(browser, 'desktop', { viewport: { width: 1440, height: 980 } }));
  results.push(await inspectAdmin(browser, 'mobile', {
    ...devices['iPhone 13'],
    viewport: { width: 390, height: 1000 },
  }));

  const findings = collectFindings(results);
  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    findings,
    results,
  };

  const reportPath = path.join(outDir, 'visual-qa-report.json');
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ reportPath, findingsCount: findings.length, findings }, null, 2));
} finally {
  await browser.close();
}
