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
  await page.waitForSelector('.sys-tabs', { timeout: 15000 });
  await page.waitForSelector('#team', { timeout: 15000 });
  await page.waitForSelector('#contact', { timeout: 15000 });
  await page.waitForTimeout(1200);
  await primeScrollReveals(page);

  const fullPath = path.join(outDir, `homepage-${name}-full.png`);
  await page.screenshot({ path: fullPath, fullPage: true });

  const tabs = page.locator('.sys-tab');
  const tabCount = await tabs.count();
  for (let index = 0; index < tabCount; index += 1) {
    const tab = tabs.nth(index);
    const panelId = await tab.getAttribute('data-panel');
    await tab.click();
    await page.waitForTimeout(80);

    const tabState = await page.evaluate((expectedPanelId) => {
      const selectedTabs = Array.from(document.querySelectorAll('.sys-tab'))
        .filter((item) => item.getAttribute('aria-selected') === 'true');
      const activePanels = Array.from(document.querySelectorAll('.sys-panel.active'));
      const panel = document.getElementById(expectedPanelId);
      return {
        selectedCount: selectedTabs.length,
        activePanelCount: activePanels.length,
        expectedPanelActive: panel?.classList.contains('active') || false,
        expectedPanelVisible: Boolean(panel) && getComputedStyle(panel).display !== 'none',
        title: String(panel?.querySelector('.sys__title')?.textContent || '').replace(/\s+/g, ' ').trim(),
      };
    }, panelId);

    checks.push({
      kind: 'system-tab',
      label: normalizeText(await tab.innerText()),
      ok: tabState.selectedCount === 1
        && tabState.activePanelCount === 1
        && tabState.expectedPanelActive
        && tabState.expectedPanelVisible,
      state: tabState,
    });

    const mapButton = page.locator(`#${panelId} .sys-map-btn`);
    if (await mapButton.count() === 1) {
      const mapId = await mapButton.getAttribute('data-map');
      await mapButton.click();
      await page.waitForTimeout(80);
      const opened = await page.evaluate((id) => {
        const diagram = document.getElementById(id);
        return {
          openClass: diagram?.classList.contains('open') || false,
          visible: Boolean(diagram) && getComputedStyle(diagram).display !== 'none',
        };
      }, mapId);
      const openText = normalizeText(await mapButton.innerText());
      await mapButton.click();
      await page.waitForTimeout(80);
      const closed = await page.evaluate((id) => {
        const diagram = document.getElementById(id);
        return {
          openClass: diagram?.classList.contains('open') || false,
          visible: Boolean(diagram) && getComputedStyle(diagram).display !== 'none',
        };
      }, mapId);
      const closeText = normalizeText(await mapButton.innerText());

      checks.push({
        kind: 'system-map',
        label: `${panelId} system map`,
        ok: opened.openClass
          && opened.visible
          && !closed.openClass
          && !closed.visible
          && openText.includes('⊖')
          && closeText.includes('⊕'),
        state: { opened, closed, openText, closeText },
      });
    }
  }

  await tabs.nth(0).click();
  await tabs.nth(0).focus();
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(80);
  const keyboardState = await page.evaluate(() => ({
    selectedText: document.querySelector('.sys-tab[aria-selected="true"]')?.innerText.trim() || '',
    activePanel: document.querySelector('.sys-panel.active')?.id || '',
  }));
  checks.push({
    kind: 'system-tab-keyboard',
    label: 'ArrowRight from first system tab',
    ok: keyboardState.activePanel === 'panel-02',
    state: keyboardState,
  });

  const cvButtons = page.locator('.cv-btn');
  const cvCount = await cvButtons.count();
  for (let index = 0; index < cvCount; index += 1) {
    const cvButton = cvButtons.nth(index);
    const cvId = await cvButton.getAttribute('data-cv');
    await cvButton.click();
    await page.waitForTimeout(80);
    const opened = await page.evaluate((id) => {
      const panel = document.getElementById(id);
      return {
        openClass: panel?.classList.contains('open') || false,
        visible: Boolean(panel) && getComputedStyle(panel).display !== 'none',
      };
    }, cvId);
    const openText = normalizeText(await cvButton.innerText());
    await cvButton.click();
    await page.waitForTimeout(80);
    const closed = await page.evaluate((id) => {
      const panel = document.getElementById(id);
      return {
        openClass: panel?.classList.contains('open') || false,
        visible: Boolean(panel) && getComputedStyle(panel).display !== 'none',
      };
    }, cvId);
    const closeText = normalizeText(await cvButton.innerText());

    checks.push({
      kind: 'cv-toggle',
      label: cvId,
      ok: opened.openClass
        && opened.visible
        && !closed.openClass
        && !closed.visible
        && openText.includes('⊖')
        && closeText.includes('⊕'),
      state: { opened, closed, openText, closeText },
    });
  }

  checks.push(await checkAnchor(page, 'hero systems CTA', 'a.btn--primary[href="#systems"]', 'systems'));
  checks.push(await checkAnchor(page, 'hero contact CTA', 'a.btn--ghost[href="#contact"]', 'contact'));
  checks.push(await checkAnchor(page, 'topbar contact CTA', 'a.topbar__cta[href="#contact"]', 'contact'));
  checks.push(await checkAnchor(page, 'footer systems', '.foot__links a[href="#systems"]', 'systems'));
  checks.push(await checkAnchor(page, 'footer contact', '.foot__links a[href="#contact"]', 'contact'));

  await gotoPage(page);
  await page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => {});
  await page.evaluate(() => window.postMessage({ type: '__activate_edit_mode' }, '*'));
  await page.waitForTimeout(500);
  const tweakBefore = await page.evaluate(() => ({
    panelVisible: Boolean(document.querySelector('.twk-panel')),
    toggleCount: document.querySelectorAll('.twk-toggle').length,
    sliderCount: document.querySelectorAll('.twk-slider').length,
    colorCount: document.querySelectorAll('.twk-swatch').length,
  }));

  if (tweakBefore.panelVisible) {
    const firstToggle = page.locator('.twk-toggle').first();
    const before = await page.evaluate(() => ({
      gridOpacity: getComputedStyle(document.documentElement).getPropertyValue('--grid-opacity').trim(),
      noGlitch: document.body.classList.contains('no-glitch'),
    }));
    await firstToggle.click();
    await page.waitForTimeout(100);
    const afterToggle = await page.evaluate(() => ({
      gridOpacity: getComputedStyle(document.documentElement).getPropertyValue('--grid-opacity').trim(),
      noGlitch: document.body.classList.contains('no-glitch'),
    }));
    await page.locator('.twk-x').click();
    await page.waitForTimeout(100);
    const afterClose = await page.evaluate(() => ({
      panelVisible: Boolean(document.querySelector('.twk-panel')),
    }));
    checks.push({
      kind: 'tweak-panel',
      label: 'activate/toggle/close',
      ok: tweakBefore.toggleCount >= 6
        && tweakBefore.sliderCount >= 1
        && tweakBefore.colorCount >= 2
        && before.gridOpacity !== afterToggle.gridOpacity
        && !afterClose.panelVisible,
      state: { tweakBefore, before, afterToggle, afterClose },
    });
  } else {
    checks.push({ kind: 'tweak-panel', label: 'activate/toggle/close', ok: false, state: tweakBefore });
  }

  await gotoPage(page);
  await page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => {});
  await page.waitForTimeout(1000);
  const evidencePath = path.join(outDir, `homepage-${name}-evidence.png`);
  await page.locator('#systems').screenshot({ path: evidencePath });

  const diagnostics = await collectPageHealth(page, [
    '.hero',
    '.sys-tabs',
    '.sys-panel',
    '#stages',
    '#team',
    '#press',
    '#contact',
    '#tweaks-root',
  ]);

  const counts = await page.evaluate(() => ({
    systemTabs: document.querySelectorAll('.sys-tab').length,
    systemPanels: document.querySelectorAll('.sys-panel').length,
    mapButtons: document.querySelectorAll('.sys-map-btn').length,
    cvButtons: document.querySelectorAll('.cv-btn').length,
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

      if (result.counts.systemTabs !== 17 || result.counts.systemPanels !== 17 || result.counts.mapButtons !== 17) {
        findings.push(`homepage/${result.viewportName}: system tab/map count changed unexpectedly`);
      }

      if (result.counts.cvButtons !== 2 || result.counts.pressLinks < 6 || result.counts.proBonoLinks < 4) {
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
