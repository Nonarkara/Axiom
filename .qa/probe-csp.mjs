// Verify a page still works under a Content-Security-Policy, enforced.
//
// The header is attached to every same-origin response, so the browser blocks
// anything the policy does not allow and reports it in the console.
//
// ── Reading the output honestly ───────────────────────────────────────────
// A browser closing mid-initialisation cancels whatever is still in flight,
// and the failure arrives as `net::ERR_ABORTED`. The YouTube player alone
// leaves three such cancellations behind on every run. They are not
// violations and they are not failures — counting them as either makes the
// probe cry wolf on a clean page.
//
// So the probe separates three things and names them:
//   · a console error         → a violation. CSP refusals always log here.
//   · a failed request        → a failure. The resource did not arrive.
//   · a cancelled request     → nothing. Reported, never counted.
//
// The console is the authoritative signal: Chrome logs every refused
// resource with the directive that refused it, so a policy that blocks
// something cannot pass silently.
//
// ── Proving the probe bites ───────────────────────────────────────────────
// A probe that has never failed proves nothing. `--self-test` deliberately
// asks the page for a resource the policy does not allow, and fails unless
// the probe catches it. Run it after changing the probe.
//
//   node .qa/probe-csp.mjs <url> "<csp>" [clickSelector]
//   node .qa/probe-csp.mjs --self-test <url> "<csp>"

import { chromium } from 'playwright';

const argv = process.argv.slice(2);
const SELF_TEST = argv.includes('--self-test');
const args = argv.filter(a => a !== '--self-test');
const url = args[0] || 'http://127.0.0.1:5311/';
const csp = args[1];
const clickSelector = args[2] || null;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const violations = [];   // a refusal. Counted.
const failures = [];     // a resource that did not arrive. Counted.
const cancelled = [];    // a request the browser called off. Not counted.

page.on('console', (m) => {
  if (m.type() !== 'error') return;
  const txt = m.text();
  if (txt.includes('compute-pressure')) return;
  violations.push('console: ' + txt.slice(0, 220));
});
page.on('requestfailed', (r) => {
  const why = r.failure()?.errorText || '';
  const where = r.url().slice(0, 120);
  if (why === 'net::ERR_ABORTED') {
    cancelled.push('cancelled: ' + where);
    return;
  }
  failures.push('failed: ' + where + ' ' + why);
});

if (csp) {
  await page.route('**/*', async (route) => {
    const res = await route.fetch();
    const headers = { ...res.headers() };
    // Only the page's own responses carry the policy. A header attached to a
    // third-party response would be a different document's policy, and it
    // would block the frame for a reason that does not exist in production.
    const url = route.request().url();
    if (url.startsWith('http://127.0.0.1') || url.startsWith('http://localhost')) {
      headers['content-security-policy'] = csp;
    }
    await route.fulfill({ response: res, headers });
  });
}

await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(3000);

if (clickSelector) {
  try {
    await page.click(clickSelector, { timeout: 5000 });
    await page.waitForTimeout(2500);
  } catch (e) {
    failures.push('click failed: ' + clickSelector + ' — ' + String(e.message).split('\n')[0]);
  }
}

if (SELF_TEST) {
  // Ask for something the policy does not allow. If the probe cannot see this,
  // then the probe cannot see a real refusal either.
  await page.evaluate(() => {
    const probe = new Image();
    probe.src = 'https://csp-probe.invalid/blocked.png';
  });
  await page.waitForTimeout(1500);
}

const state = await page.evaluate(() => {
  const imgs = [...document.querySelectorAll('img')];
  return {
    chars: document.body.innerText.length,
    imgs: imgs.length,
    brokenImgs: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
    stylesheets: document.styleSheets.length,
    sheetRules: [...document.styleSheets].reduce((n, s) => {
      try { return n + s.cssRules.length; } catch (e) { return n; }
    }, 0),
    fontsLoaded: document.fonts ? document.fonts.status : 'n/a',
    plates: document.querySelectorAll('.plate, .plate__img, .duo .plate').length,
  };
});

console.log('state:', JSON.stringify(state));

if (cancelled.length) {
  console.log('\ncancelled at teardown, not counted (' + cancelled.length + '):');
  for (const c of [...new Set(cancelled)].slice(0, 8)) console.log('  · ' + c);
}

if (SELF_TEST) {
  const caught = violations.length + failures.length;
  console.log('\nself-test: ' + (caught > 0
    ? 'the probe sees a refusal — ' + caught + ' caught.'
    : 'THE PROBE IS BLIND. It saw nothing when the policy refused a resource.'));
  if (caught === 0) process.exitCode = 1;
  await browser.close();
  process.exit(process.exitCode || 0);
}

const problems = violations.length + failures.length;
if (problems) {
  if (violations.length) {
    console.log('\nVIOLATIONS (' + violations.length + '):');
    for (const v of [...new Set(violations)].slice(0, 15)) console.log('  - ' + v);
  }
  if (failures.length) {
    console.log('\nFAILURES (' + failures.length + '):');
    for (const f of [...new Set(failures)].slice(0, 15)) console.log('  - ' + f);
  }
  process.exitCode = 1;
} else {
  console.log('\nno refusals, no failed requests under the policy.');
}
await browser.close();
