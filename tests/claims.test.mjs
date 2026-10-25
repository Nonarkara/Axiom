import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const app = await readFile(new URL('../public/app.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
const footprintSource = await readFile(new URL('../public/footprint.js', import.meta.url), 'utf8');
const heroCss = await readFile(new URL('../public/hero.css', import.meta.url), 'utf8');
const context = { window: {} };
runInNewContext(footprintSource, context);
const footprint = context.window.AXIOM_FOOTPRINT;
const pitchStart = app.indexOf('const i18nPitch = {');
const pitchEnd = app.indexOf('\nObject.keys(i18nPitch)', pitchStart);
runInNewContext(app.slice(pitchStart, pitchEnd) + '\nthis.pitch = i18nPitch;', context);
const locales = ['en', 'th', 'zh', 'ko', 'ja', 'vi', 'ts'];

function countHarness({ catalog = 73, live = 61, domains = 6, data = footprint } = {}) {
  const nodes = new Map();
  const sizes = {
    '.sys-cell__link': catalog,
    '.sys-cell[data-arch] [data-i18n="sysStatus.live"]': live,
    '#panelSystems .hero-console__item': domains,
  };
  const document = {
    querySelectorAll(selector) {
      if (selector in sizes) return Array.from({ length: sizes[selector] }, () => ({}));
      const key = selector.match(/^\[data-count="([^"]+)"\]$/)?.[1];
      assert.ok(key, `unexpected count source: ${selector}`);
      if (!nodes.has(key)) nodes.set(key, [{ textContent: 'stale' }, { textContent: 'stale' }]);
      return nodes.get(key);
    },
  };
  const start = app.indexOf('function renderCatalogueCounts() {');
  const end = app.indexOf('\nfunction renderStaticCopy()', start);
  assert.ok(start >= 0 && end > start, 'all hero figures must derive from their own named source');
  runInNewContext(app.slice(start, end) + '\nrenderCatalogueCounts();', {
    window: { AXIOM_FOOTPRINT: data }, document,
  });
  return Object.fromEntries([...nodes].map(([key, values]) => {
    assert.equal(values[0].textContent, values[1].textContent, `${key} must update every instance`);
    return [key, Number(values[0].textContent)];
  }));
}

test('hero figures derive from the catalogue, displayed domains and footprint, including zero', () => {
  assert.deepEqual(countHarness(), {
    catalog: 73, live: 61, domains: 6, 'other-statuses': 12,
    'mapped-systems': 25, 'tour-stops': 18, currencies: 3,
  });
  assert.deepEqual(countHarness({ catalog: 4, live: 0, domains: 2, data: {
    projects: [{ key: 'one' }, { key: 'two' }],
    stops: [{ currency: 'THB' }, { currency: 'THB · MYR · VND' }, { currency: 'multi' }],
  } }), {
    catalog: 4, live: 0, domains: 2, 'other-statuses': 4,
    'mapped-systems': 2, 'tour-stops': 3, currencies: 3,
  });
  assert.deepEqual(countHarness({ catalog: 0, live: 0, domains: 0, data: { projects: [], stops: [] } }), {
    catalog: 0, live: 0, domains: 0, 'other-statuses': 0,
    'mapped-systems': 0, 'tour-stops': 0, currencies: 0,
  });
});

test('every hero fallback figure agrees with its named source', () => {
  const counts = countHarness({
    catalog: (html.match(/class="sys-cell__link"/g) || []).length,
    live: (html.match(/data-i18n="sysStatus.live"/g) || []).length,
    domains: (html.match(/class="hero-console__item"/g) || []).length,
  });
  for (const key of Object.keys(counts)) assert.ok(html.includes(`data-count="${key}"`), `missing count: ${key}`);
  for (const match of html.matchAll(/data-count="([^"]+)">(\d+)</g)) {
    assert.equal(Number(match[2]), counts[match[1]], match[1]);
  }
});

function assertHonestConsole(console) {
  for (const key of ['tagFlood', 'tagAir', 'tagPorts', 'tagAirspace', 'tagCivic', 'tagSecurity']) {
    assert.doesNotMatch(console[key], /\d/, `${key} must not imply an untraceable system count`);
  }
  for (const key of ['socialValue', 'feedsValue', 'costValue']) {
    assert.doesNotMatch(console[key], /\d|\$/, `${key} is a delivery term, not a measured outcome`);
  }
  assert.doesNotMatch(JSON.stringify(console), /68M|247\+|60\s*FPS|2-hr|112,000|Citizens Protected|Live Systems in Production/i);
  for (const key of ['footerLabel', 'scopePrefix', 'socialValue', 'feedsValue', 'speedValue', 'costValue']) {
    assert.ok(console[key]?.trim(), `missing ${key}`);
  }
}

test('all seven console editions separate reach, catalogue status and outcomes', () => {
  for (const locale of locales) assertHonestConsole(context.pitch[locale].heroConsole);
  const en = context.pitch.en.heroConsole;
  assert.equal(en.systemsLabel, 'Labelled Live');
  assert.equal(en.problemsLabel, 'Domains shown');
  assert.equal(en.slideDecksLabel, 'Other statuses');
  assert.match(en.socialDesc, /not a count of users or people protected/);
  assert.match(en.feedsDesc, /not a feed-health monitor/);
  assert.match(en.speedDesc, /proposed proof/);
  assert.match(en.costDesc, /does not imply zero operating cost/);
});

test('the claim guard rejects the previous domain, protection and frame-rate claims', () => {
  const current = context.pitch.en.heroConsole;
  for (const mutation of [
    { tagFlood: 'DISASTER & FLOOD · 22' },
    { citizensLabel: 'Citizens Protected' },
    { feedsValue: '247+' },
    { costValue: '$0' },
    { footerLabel: 'LIVE · 60 FPS' },
  ]) assert.throws(() => assertHonestConsole({ ...current, ...mutation }));
});

test('the hero does not present a blanket online status or a measured frame rate', () => {
  const hero = html.slice(html.indexOf('id="hero"'), html.indexOf('id="why"'));
  assert.ok(hero.length > 0, 'hero source not found');
  assert.doesNotMatch(hero, /All Systems Online|68M\+|247\+|60 FPS|Systems in Production/i);
  assert.match(hero, /data-i18n="heroConsole.footerLabel"/);
  assert.match(hero, /data-count="mapped-systems"/);
  assert.match(hero, /data-count="tour-stops"/);
  assert.match(hero, /data-count="currencies"/);
});

test('the phone HUD keeps its count on its own row, and obsolete rail declarations cannot close the media query', () => {
  assert.match(heroCss, /\.sat-hud \{ flex-direction: column; align-items: stretch; gap: 2px; \}/);
  assert.match(heroCss, /\.sat-hud-row:has\(\.sat-hud-signals\) \{ display: none; \}/);
  assert.match(heroCss, /\.sat-hud-row:first-child \{ display: grid; grid-template-columns: minmax\(0, 1fr\); gap: 0; \}/);
  assert.doesNotMatch(heroCss, /\}\s*scroll-snap-type:\s*x proximity;\s*\}/);
  assert.doesNotMatch(heroCss, /backdrop-filter:\s*blur/);
  assert.doesNotMatch(html, /class="hero-gradient"/);
  assert.match(html, /hero\.css\?v=20261025a/);
});
