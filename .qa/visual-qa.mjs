import { chromium, devices } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const outDir = path.join(process.cwd(), '.qa');
const homepageSectionSelectors = [
  '#hero',
  '#engagement',
  '#capabilities',
  '#projects',
  '#evidence',
  '#launch',
  '#launch-beta',
  '#interface-atlas',
  '#team',
  '#impact',
  '#featured',
  '#contact',
];

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function simplifyConsole(message) {
  return {
    type: message.type(),
    text: normalizeText(message.text()),
  };
}

function createTelemetry(page) {
  const consoleMessages = [];
  const pageErrors = [];
  const requestFailures = [];

  page.on('console', (message) => {
    consoleMessages.push(simplifyConsole(message));
  });
  page.on('pageerror', (error) => {
    pageErrors.push(normalizeText(error?.stack || error?.message || String(error)));
  });
  page.on('requestfailed', (request) => {
    requestFailures.push({
      url: request.url(),
      failure: request.failure()?.errorText || 'unknown',
    });
  });

  return { consoleMessages, pageErrors, requestFailures };
}

function isActionableRequestFailure(currentBaseUrl, failure) {
  if (!failure || !failure.url) {
    return false;
  }

  const errorText = String(failure.failure || '').toLowerCase();
  if (errorText === 'net::err_aborted') {
    const pageOrigin = new URL(currentBaseUrl).origin;
    const failureOrigin = new URL(failure.url).origin;
    return failureOrigin === pageOrigin;
  }

  return true;
}

async function collectCommonDiagnostics(page, expectedSelectors = []) {
  const selectorStates = {};
  for (const selector of expectedSelectors) {
    selectorStates[selector] = await page.locator(selector).count();
  }

  const pageHealth = await page.evaluate(() => {
    const overlaySelector = '[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay';
    const overlay = document.querySelector(overlaySelector);
    const viewportWidth = document.documentElement.clientWidth;
    const overflowing = Array.from(document.querySelectorAll('body *'))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          id: element.id || '',
          className: typeof element.className === 'string' ? element.className.slice(0, 120) : '',
          overflow: rect.right - viewportWidth,
        };
      })
      .filter((entry) => entry.overflow > 1)
      .sort((left, right) => right.overflow - left.overflow)
      .slice(0, 8);

    return {
      bodyTextLength: document.body.innerText.trim().length,
      hasErrorOverlay: Boolean(overlay),
      pageTitle: document.title,
      viewport: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        clientWidth: document.documentElement.clientWidth,
        clientHeight: document.documentElement.clientHeight,
      },
      documentWidth: document.documentElement.scrollWidth,
      documentHeight: document.documentElement.scrollHeight,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      overflowing,
    };
  });

  return {
    selectorStates,
    ...pageHealth,
  };
}

async function sweepHomepageSections(page) {
  const states = [];

  for (const selector of homepageSectionSelectors) {
    const locator = page.locator(selector).first();
    const count = await locator.count();
    if (!count) {
      states.push({ selector, present: false, visible: false, textLength: 0, height: 0 });
      continue;
    }

    await locator.scrollIntoViewIfNeeded();
    await page.waitForTimeout(220);
    states.push(await locator.evaluate((element, selected) => {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return {
        selector: selected,
        present: true,
        visible: style.display !== 'none' && style.visibility !== 'hidden' && rect.height > 0,
        textLength: element.innerText.trim().length,
        height: Math.round(rect.height),
      };
    }, selector));
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  return states;
}

async function waitForHomepageContent(page) {
  await page.waitForSelector('#hero', { timeout: 15000 });
  await page.waitForFunction(() => {
    const systemsReady = document.querySelectorAll('#projects .project-card-spotlight').length >= 3;
    const evidenceReady = document.querySelectorAll('#caseStudyProofMount .case-study').length > 0;
    const historyReady = document.querySelectorAll('#contentHistoryList .evidence-history-item').length > 0;
    const eventSectionsReady = document.querySelectorAll('#launch .launch-photo-wrap').length >= 4
      && document.querySelectorAll('#launch-beta .launch-photo-wrap').length >= 4;
    return systemsReady && evidenceReady && historyReady && eventSectionsReady;
  }, { timeout: 15000 });
  await page.waitForTimeout(900);
}

async function clickVisible(page, selector) {
  const locator = page.locator(selector).first();
  if (!await locator.count()) {
    return false;
  }

  const visible = await locator.isVisible().catch(() => false);
  if (!visible) {
    return false;
  }

  return locator.click({ timeout: 5000 })
    .then(() => true)
    .catch(() => false);
}

async function switchHomepageLocale(page, locale) {
  if (await clickVisible(page, `#localeSwitch [data-locale="${locale}"]`)) {
    await page.waitForTimeout(320);
    return 'desktop';
  }

  const navToggle = page.locator('#navToggle');
  if (await navToggle.count()) {
    const panelVisible = await page.locator('#mobileMenu.open').isVisible().catch(() => false);
    if (!panelVisible) {
      await navToggle.click();
      await page.waitForTimeout(260);
    }
  }

  if (await clickVisible(page, `#localeSwitchMobile [data-locale="${locale}"]`)) {
    await page.keyboard.press('Escape').catch(() => {});
    await page.waitForTimeout(320);
    return 'mobile';
  }

  throw new Error(`Could not switch locale to ${locale}`);
}

async function inspectHomepage(browser, name, contextOptions) {
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  const telemetry = createTelemetry(page);

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 6000 }).catch(() => {});
  await waitForHomepageContent(page);

  const sectionSweep = await sweepHomepageSections(page);
  const fullPath = path.join(outDir, `homepage-${name}-full.png`);
  await page.screenshot({ path: fullPath, fullPage: true });

  const heroTitleEn = normalizeText(await page.locator('.hero-title').textContent());
  const evidenceTitleEn = normalizeText(await page.locator('#evidenceTitle').textContent());
  const languageEn = await page.locator('html').getAttribute('lang');

  const localeSwitchMode = await switchHomepageLocale(page, 'th');
  const heroTitleTh = normalizeText(await page.locator('.hero-title').textContent());
  const evidenceTitleTh = normalizeText(await page.locator('#evidenceTitle').textContent());
  const languageTh = await page.locator('html').getAttribute('lang');

  await switchHomepageLocale(page, 'zh');
  const heroTitleZh = normalizeText(await page.locator('.hero-title').textContent());
  const evidenceTitleZh = normalizeText(await page.locator('#evidenceTitle').textContent());
  const languageZh = await page.locator('html').getAttribute('lang');

  await page.locator('#evidence').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const evidencePath = path.join(outDir, `homepage-${name}-evidence.png`);
  await page.locator('#evidence').screenshot({ path: evidencePath });

  let filterResult = null;
  const filterButtons = page.locator('#evidenceFilterStrip [data-status]');
  const filterCount = await filterButtons.count();
  if (filterCount > 1) {
    const chosenLabel = normalizeText(await filterButtons.nth(1).textContent());
    await filterButtons.nth(1).click();
    await page.waitForTimeout(300);
    filterResult = {
      chosenLabel,
      visibleCases: await page.locator('#caseStudyProofMount .case-study').count(),
    };
  }

  let lightbox = { opened: false, imageSrc: '', ariaHidden: 'true' };
  const lightboxTrigger = page.locator('.lightbox-trigger').first();
  if (await lightboxTrigger.count()) {
    await lightboxTrigger.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await lightboxTrigger.click();
    await page.waitForTimeout(250);
    lightbox = await page.evaluate(() => {
      const overlay = document.getElementById('imageLightbox');
      const image = document.getElementById('imageLightboxImg');
      return {
        opened: Boolean(overlay?.classList.contains('open')),
        imageSrc: image?.getAttribute('src') || '',
        ariaHidden: overlay?.getAttribute('aria-hidden') || '',
      };
    });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(150);
  }

  const diagnostics = await collectCommonDiagnostics(page, [
    '#localeSwitch',
    '#heroMap',
    '#heroCanvas',
    '#satHud',
    '#mapModeLabel',
    '#projects .project-card-spotlight',
    '#evidenceStatusViz .evidence-bar-row',
    '#evidenceRegionViz .evidence-bar-row',
    '#evidenceTypeViz .evidence-bar-row',
    '#caseStudyProofMount .case-study',
    '#contentHistoryList .evidence-history-item',
    '#launch .launch-photo-wrap',
    '#launch-beta .launch-photo-wrap',
    '#interface-atlas img',
  ]);

  const summaryCards = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.evidence-summary-card')).map((card) => ({
      label: card.querySelector('.evidence-summary-label')?.textContent?.trim() || '',
      value: card.querySelector('.evidence-summary-value')?.textContent?.trim() || '',
    }));
  });

  const counts = await page.evaluate(() => ({
    systems: document.querySelectorAll('#projects .project-card-spotlight').length,
    caseStudies: document.querySelectorAll('#caseStudyProofMount .case-study').length,
    history: document.querySelectorAll('#contentHistoryList .evidence-history-item').length,
    launchAlpha: document.querySelectorAll('#launch .launch-photo-wrap').length,
    launchBeta: document.querySelectorAll('#launch-beta .launch-photo-wrap').length,
    interfaceAtlas: document.querySelectorAll('#interface-atlas img').length,
    eventTags: Array.from(document.querySelectorAll('.section-tag')).filter((tag) => tag.textContent.includes('EVENT_ID')).length,
    heroNodes: document.querySelectorAll('.hero-node').length,
    heroCanvas: Boolean(document.querySelector('#heroCanvas')),
    heroMapReady: Boolean(document.querySelector('#heroMap.leaflet-container')),
    mapModeLabel: document.querySelector('#mapModeLabel')?.textContent?.trim() || '',
    mapModeAuto: document.querySelector('#mapModeLabel')?.textContent?.includes('AUTO') || false,
    sectionMeta: document.querySelectorAll('.section-meta').length,
  }));

  const reducedMotionHonored = contextOptions.reducedMotion === 'reduce'
    ? await page.evaluate(() => !document.documentElement.classList.contains('motion-ok'))
    : null;

  await context.close();

  return {
    page: 'homepage',
    viewportName: name,
    screenshots: {
      full: fullPath,
      evidence: evidencePath,
    },
    localeSwitch: {
      via: localeSwitchMode,
      heroTitleEn,
      heroTitleTh,
      heroTitleZh,
      evidenceTitleEn,
      evidenceTitleTh,
      evidenceTitleZh,
      languageEn,
      languageTh,
      languageZh,
      switchedToThai: heroTitleTh && heroTitleTh !== heroTitleEn && evidenceTitleTh && evidenceTitleTh !== evidenceTitleEn,
      switchedToChinese: heroTitleZh && heroTitleZh !== heroTitleEn && evidenceTitleZh && evidenceTitleZh !== evidenceTitleEn,
    },
    filterResult,
    sectionSweep,
    summaryCards,
    counts,
    lightbox,
    reducedMotionHonored,
    diagnostics,
    telemetry,
  };
}

async function inspectAdmin(browser, name, contextOptions) {
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  const telemetry = createTelemetry(page);

  await page.goto(`${baseUrl}/admin/`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  await page.waitForSelector('#localeSwitch', { timeout: 15000 });
  await page.waitForTimeout(1200);

  const fullPath = path.join(outDir, `admin-${name}-full-en.png`);
  await page.screenshot({ path: fullPath, fullPage: true });

  const fieldValues = await page.evaluate(() => {
    const getValue = (selector) => document.querySelector(selector)?.value || '';
    return {
      caseStatus: getValue('#caseStatus'),
      caseRegionCode: getValue('#caseRegionCode'),
      caseEvidenceType: getValue('#caseEvidenceType'),
      caseConfidenceScore: getValue('#caseConfidenceScore'),
      historyStatus: getValue('#historyStatus'),
      historyArtifactType: getValue('#historyArtifactType'),
      historyConfidenceScore: getValue('#historyConfidenceScore'),
    };
  });

  await page.click('#localeSwitch [data-locale="th"]');
  await page.waitForTimeout(300);
  const thaiHeading = normalizeText(await page.locator('#caseLocaleTitle').textContent());
  const thaiPath = path.join(outDir, `admin-${name}-thai.png`);
  await page.screenshot({ path: thaiPath, fullPage: true });

  await page.click('#localeSwitch [data-locale="ts"]');
  await page.waitForTimeout(300);
  const typescriptHeading = normalizeText(await page.locator('#caseLocaleTitle').textContent());
  const previewText = normalizeText((await page.locator('#typescriptPreview').textContent()) || '');
  const previewSnippet = previewText.slice(0, 240);
  const typescriptPath = path.join(outDir, `admin-${name}-typescript.png`);
  await page.screenshot({ path: typescriptPath, fullPage: true });

  const diagnostics = await collectCommonDiagnostics(page, [
    '#localeSwitch',
    '#caseStatus',
    '#caseRegionCode',
    '#caseEvidenceType',
    '#caseEvidenceSourceUrl',
    '#historyStatus',
    '#historyArtifactType',
    '#historyConfidenceScore',
    '#typescriptPreview',
  ]);

  const recordCounts = await page.evaluate(() => ({
    caseItems: document.querySelectorAll('#caseStudyList [data-case-id]').length,
    historyItems: document.querySelectorAll('#historyList [data-history-id]').length,
  }));

  await context.close();

  return {
    page: 'admin',
    viewportName: name,
    screenshots: {
      full: fullPath,
      thai: thaiPath,
      typescript: typescriptPath,
    },
    localeSwitch: {
      thaiHeading,
      typescriptHeading,
      previewSnippet,
      previewHasSnapshot: previewText.includes('editorSnapshot'),
    },
    fieldValues,
    recordCounts,
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

    const severeConsole = result.telemetry.consoleMessages.filter((message) => ['error', 'warning', 'assert'].includes(message.type));
    if (severeConsole.length) {
      findings.push(`${result.page}/${result.viewportName}: console ${severeConsole.map((entry) => entry.type).join(', ')} messages detected`);
    }

    const actionableRequestFailures = result.telemetry.requestFailures.filter((failure) => isActionableRequestFailure(baseUrl, failure));
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
      const weakSections = result.sectionSweep.filter((section) => (
        !section.present || !section.visible || section.textLength < 60 || section.height < 60
      ));
      if (weakSections.length) {
        findings.push(`homepage/${result.viewportName}: weak or missing sections ${weakSections.map((section) => section.selector).join(', ')}`);
      }
      if (!result.localeSwitch.switchedToThai) {
        findings.push(`homepage/${result.viewportName}: locale switch did not update Thai homepage copy`);
      }
      if (!result.localeSwitch.switchedToChinese) {
        findings.push(`homepage/${result.viewportName}: locale switch did not update Chinese homepage copy`);
      }
      if (result.localeSwitch.languageTh !== 'th' || result.localeSwitch.languageZh !== 'zh') {
        findings.push(`homepage/${result.viewportName}: html lang did not track locale`);
      }
      const heroMapInitialized = result.counts.heroCanvas && result.counts.heroMapReady && result.counts.heroNodes >= 4;
      const heroModeReady = result.viewportName === 'mobile'
        ? heroMapInitialized
        : heroMapInitialized && result.counts.mapModeAuto;
      if (!heroModeReady) {
        findings.push(`homepage/${result.viewportName}: protected hero map/HUD surface did not initialize`);
      }
      if (result.counts.eventTags < 2 || result.counts.sectionMeta < 6) {
        findings.push(`homepage/${result.viewportName}: protected event/meta sections are missing`);
      }
      if (result.counts.systems < 3 || result.counts.launchAlpha < 4 || result.counts.launchBeta < 4 || result.counts.interfaceAtlas < 3) {
        findings.push(`homepage/${result.viewportName}: proof modules did not render expected card counts`);
      }
      if (result.counts.caseStudies < 1 || result.counts.history < 1) {
        findings.push(`homepage/${result.viewportName}: evidence ledger content did not render`);
      }
      if (result.summaryCards.length < 4) {
        findings.push(`homepage/${result.viewportName}: summary proof strip rendered too few cards`);
      }
      if (result.filterResult && result.filterResult.visibleCases < 1) {
        findings.push(`homepage/${result.viewportName}: filter ${result.filterResult.chosenLabel} returned no visible cases`);
      }
      if (!result.lightbox.opened || !result.lightbox.imageSrc || result.lightbox.ariaHidden !== 'false') {
        findings.push(`homepage/${result.viewportName}: image lightbox did not open correctly`);
      }
      if (result.reducedMotionHonored === false) {
        findings.push(`homepage/${result.viewportName}: reduced-motion context still enabled motion class`);
      }
    }

    if (result.page === 'admin') {
      if (!result.recordCounts.caseItems || !result.recordCounts.historyItems) {
        findings.push(`admin/${result.viewportName}: record lists did not populate`);
      }
      if (!result.localeSwitch.previewHasSnapshot) {
        findings.push(`admin/${result.viewportName}: TypeScript preview did not render expected snapshot`);
      }
    }
  }

  return findings;
}

const browser = await chromium.launch({ headless: true });

try {
  await ensureDir(outDir);

  const results = [];
  results.push(await inspectHomepage(browser, 'desktop', { viewport: { width: 1440, height: 920 } }));
  results.push(await inspectHomepage(browser, 'desktop-reduced', {
    viewport: { width: 1440, height: 920 },
    reducedMotion: 'reduce',
  }));
  results.push(await inspectHomepage(browser, 'mobile', {
    ...devices['iPhone 13'],
    viewport: { width: 390, height: 844 },
  }));
  results.push(await inspectAdmin(browser, 'desktop', { viewport: { width: 1440, height: 980 } }));
  results.push(await inspectAdmin(browser, 'mobile', {
    ...devices['iPhone 13'],
    viewport: { width: 390, height: 844 },
  }));

  const findings = collectFindings(results);
  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    findings,
    results,
  };

  const reportPath = path.join(outDir, 'visual-qa-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ reportPath, findingsCount: findings.length }, null, 2));
} finally {
  await browser.close();
}
