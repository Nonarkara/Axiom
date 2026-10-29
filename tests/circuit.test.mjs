// The speaking circuit. Three things are load-bearing and therefore tested:
//
//   1. ONE BAR PER STOP, IN DATE ORDER, IN THE FLOW. The records began as four
//      full-height articles — a viewport each — then became a horizontal rail
//      and a ledger table, which stopped the bleed in the wrong register. They
//      are now five bars stacked vertically. Adding a sixth adds one bar.
//      The order is document order, so it has to be asserted, not assumed.
//
//   2. NO TABLE, NO SIDEWAYS SCROLL. Both were the wrong answer to the bleeding
//      problem and are cheap to reintroduce by accident, so they are banned by
//      name.
//
//   3. EVERY KEY TRANSLATES. Seven locales. A missing key silently falls back to
//      English at runtime, which is how a Thai reader ends up looking at
//      English. This catches that at commit time.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
const circuitCss = await readFile(new URL('../public/circuit.css', import.meta.url), 'utf8');
const ramsCss = await readFile(new URL('../public/rams.css', import.meta.url), 'utf8');

const imageDir = new URL('../public/images/', import.meta.url);
const imagesOnDisk = await readdir(imageDir);

const appSource = await readFile(new URL('../public/app.js', import.meta.url), 'utf8');
const regionalSource = await readFile(new URL('../public/i18n-regional.js', import.meta.url), 'utf8');

const LOCALE_KEYS = ['en', 'th', 'zh', 'ko', 'ja', 'vi', 'ts'];

/** The body of a single CSS rule, up to its own closing brace. */
function cssRule(source, selector) {
  const at = source.indexOf(selector);
  if (at < 0) return null;
  const open = source.indexOf('{', at);
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}' && --depth === 0) return source.slice(open, i + 1);
  }
  return null;
}

/** Read one balanced `{ … }` object literal starting at the first brace after `from`. */
function balancedBlock(source, from) {
  let i = source.indexOf('{', from);
  let depth = 0;
  let inString = null;
  for (let j = i; j < source.length; j += 1) {
    const ch = source[j];
    if (inString) {
      if (ch === '\\') { j += 1; continue; }
      if (ch === inString) inString = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { inString = ch; continue; }
    if (ch === '{') depth += 1;
    else if (ch === '}' && --depth === 0) return source.slice(i, j + 1);
  }
  throw new Error('unbalanced object literal');
}

function extractLocaleTables(source, keyOf, keys) {
  const blocks = {};
  for (const key of keys) {
    const re = new RegExp(`^[ \\t]*${keyOf(key)}: \\{`, 'gm');
    blocks[key] = [...source.matchAll(re)].map(m => new Function(`return (${balancedBlock(source, m.index)});`)());
  }
  return blocks;
}

const appTables = extractLocaleTables(appSource, k => k, ['stageSect', 'cx']);
const regionalTables = extractLocaleTables(regionalSource, k => `"${k}"`, ['stageSect', 'cx']);

/** zip the per-key block lists into one table per locale */
function zipLocales(groups, count) {
  return Array.from({ length: count }, (_, i) => ({ stageSect: groups.stageSect[i], cx: groups.cx[i] }));
}

const appLocaleTables = zipLocales(appTables, 4);
const regionalLocaleTables = zipLocales(regionalTables, 3);

const section = html.slice(html.indexOf('<section class="section" id="stages">'));
const circuit = section.slice(0, section.indexOf('<!-- ============== FIELD NOTES'));

/** Resolve a dotted key against a locale table, returning undefined if absent. */
function lookup(table, key) {
  return key.split('.').reduce((node, part) => node?.[part], table);
}

function tables() {
  const merged = {};
  ['en', 'th', 'zh', 'ts'].forEach((locale, i) => { merged[locale] = appLocaleTables[i]; });
  ['ko', 'ja', 'vi'].forEach((locale, i) => { merged[locale] = regionalLocaleTables[i]; });
  return merged;
}

const bars = circuit.split('<li class="cx-bar">').slice(1);

test('all seven locale tables were found in source', () => {
  assert.equal(appLocaleTables.length, 4, 'expected a table in each of en/th/zh/ts');
  assert.equal(regionalLocaleTables.length, 3, 'expected a table in each of ko/ja/vi');
  for (const table of [...appLocaleTables, ...regionalLocaleTables]) {
    assert.ok(table.stageSect && table.cx, 'each locale needs both stageSect and cx');
  }
});

test('the table and the sideways rail are both gone', () => {
  assert.doesNotMatch(circuit, /cx-ledger/, 'no ledger table — the cities belong in the prose');
  assert.doesNotMatch(circuit, /cx-rail|cx-card|cx-ctrl/, 'no horizontal rail');
  assert.doesNotMatch(circuitCss, /cx-ledger|cx-rail|cx-card|cx-ctrl/);
  assert.doesNotMatch(html, /circuit\.js/, 'the rail-control script is dead weight now');
  assert.doesNotMatch(ramsCss, /\.stage__/, 'dead .stage CSS must not linger');
});

test('the bars state every stop, in the flow of the page', () => {
  assert.ok(bars.length >= 5, `expected at least 5 bars, found ${bars.length}`);
  for (const bar of bars) {
    assert.match(bar, /class="cx-bar__date"/);
    assert.match(bar, /class="cx-bar__city"/);
    assert.match(bar, /class="cx-bar__venue"/);
    assert.match(bar, /class="cx-bar__claim"/);
    assert.match(bar, /class="cx-bar__quote"/);
    assert.match(bar, /class="cx-bar__shot"/, 'every stop carries a photograph');
    assert.equal((bar.match(/<b[\s>]/g) || []).length, 3, 'each bar carries exactly three figures');
  }
  // the list is an <ol>, not a table
  assert.match(circuit, /<ol class="cx-bars">/);
});

test('every bar photograph resolves to a file that exists', () => {
  // A speaking circuit whose only evidence that a person stood on a stage
  // is a filename that 404s is worse than one with no photograph at all:
  // it looks like evidence and is not. This is the guard for the exact
  // regression where the bars were rebuilt and the <picture> dropped.
  const referenced = [...circuit.matchAll(/cx-bar__shot[\s\S]*?<img src="images\/([^"]+)"/g)];
  assert.equal(referenced.length, bars.length, `every bar must have a shot (found ${referenced.length}/${bars.length})`);
  for (const [, file] of referenced) {
    assert.ok(imagesOnDisk.includes(file), `images/${file} is referenced but not on disk`);
  }
  for (const [, file] of [...circuit.matchAll(/cx-bar__shot[\s\S]*?<source srcset="images\/([^"]+)"/g)]) {
    assert.ok(imagesOnDisk.includes(file), `images/${file} (webp source) is referenced but not on disk`);
  }
});

test('every stage photograph has an alt that names the place', () => {
  for (const [, block] of [...circuit.matchAll(/<div class="cx-bar__shot">([\s\S]*?)<\/div>/g)]) {
    const alt = block.match(/alt="([^"]+)"/);
    assert.ok(alt, 'every stage photograph needs alt text');
    assert.ok(alt[1].length > 20, `alt text is too thin to be useful: "${alt[1]}"`);
  }
});

test('the stage-shot count in the header is the number of stage photos that exist', () => {
  // The header states a figure. An unsourced figure on a judge-facing page is
  // worse than no figure, because a reader cannot tell a real one from a
  // guessed one. This counted 14 while 13 stage photos were on disk.
  const STAGE_PREFIX = /^(osaka|shanghai|singapore|taipei|leap-east)/;
  const stagePhotos = new Set(
    imagesOnDisk
      .map((f) => f.replace(/\.(jpg|webp|png)$/i, ''))
      .filter((base) => STAGE_PREFIX.test(base)),
  );
  const stated = Number(html.match(/cx-head__num">(\d+)<\/span><span class="cx-head__lbl"\s+data-i18n="cx\.shots"/)?.[1]);
  assert.equal(stated, stagePhotos.size,
    `header claims ${stated} stage shots but ${stagePhotos.size} exist in public/images`);
});

test('a quote is never the same sentence as the claim above it', () => {
  // The rebuild once wrote each note into its own quote slot, so every stop
  // printed the same sentence twice in a row. Distinctness is the whole point
  // of having a quote.
  for (const key of ['osaka', 'sh', 'leap', 'sg', 'tpe']) {
    const block = balancedBlock(appSource, appSource.indexOf(`${key}: {`));
    const note = block.match(/note:\s*'((?:[^'\\]|\\.)*)'/)?.[1];
    const quote = block.match(/quote:\s*'((?:[^'\\]|\\.)*)'/)?.[1];
    assert.ok(note && quote, `${key}: needs both a note and a quote`);
    assert.notEqual(note, quote, `${key}: the quote repeats the claim verbatim`);
  }
});

test('the lede names every city, so the sequence is read before it is scanned', () => {
  const lede = circuit.slice(circuit.indexOf('class="cx-lede"'), circuit.indexOf('<ol class="cx-bars">'));
  for (const city of ['Taipei', 'Singapore', 'Hong Kong', 'Shanghai', 'Osaka']) {
    assert.match(lede, new RegExp(city), `the lede must name ${city}`);
  }
});

test('the bars are ordered newest first', () => {
  const dates = [...circuit.matchAll(/class="cx-bar__date">([\d.]+)</g)].map(m => m[1]);
  assert.equal(dates.length, bars.length);
  const keys = dates.map(d => d.split('.').map(Number));
  for (let i = 1; i < keys.length; i += 1) {
    const [py, pm = 1, pd = 1] = keys[i - 1];
    const [cy, cm = 1, cd = 1] = keys[i];
    assert.ok(cy * 10000 + cm * 100 + cd <= py * 10000 + pm * 100 + pd,
      `${dates[i]} (${dates[i - 1]}) is out of order`);
  }
});

test('bar height is one token, and nothing inside a bar is unbounded', () => {
  const token = circuitCss.match(/--cx-bar-h:\s*(\d+)px/);
  assert.ok(token, '--cx-bar-h must be declared in circuit.css');
  assert.equal((circuitCss.match(/--cx-bar-h:/g) || []).length, 1,
    'the bar height is declared once, not redefined per breakpoint');
  assert.match(cssRule(circuitCss, '.cx-bar {'), /min-height: var\(--cx-bar-h\)/);
  // the only text blocks that could outgrow the budget are clamped
  assert.match(cssRule(circuitCss, '.cx-bar__claim {'), /line-clamp: 2/);
});

test('no stop falls back to a pending marker', () => {
  assert.doesNotMatch(circuit, /pending/);
  assert.doesNotMatch(circuit, /cx\.l\.pending/);
  for (const match of circuit.matchAll(/class="cx-bar__date">([^<]+)</g)) {
    assert.match(match[1].trim(), /^\d{4}(\.\d{2}(\.\d{2})?)?$/, `unrecognised bar date: "${match[1]}"`);
  }
});

test('LEAP East is Hong Kong, not Bangkok', () => {
  // Regression guard. The rail previously filed LEAP East 2026 under Bangkok.
  // It was at the Hong Kong Convention and Exhibition Centre, 8–10 July 2026.
  assert.match(circuit, /data-i18n="cx\.leap\.city">Hong Kong</);
  assert.doesNotMatch(circuit, /Bangkok/);
  assert.doesNotMatch(html, /LEAP_EAST_2026_BKK/);
  for (const locale of LOCALE_KEYS) {
    assert.match(lookup(tables()[locale], 'cx.leap.venue'), /LEAP[ .]East/);
    assert.doesNotMatch(lookup(tables()[locale], 'cx.leap.venue'), /Bangkok|กรุงเทพฯ|曼谷/);
  }
});

test('Shanghai is 2026', () => {
  // Tomorrow.City Shanghai 2026 ran 22–26 September 2026 at Zhangjiang.
  assert.match(circuit, /2026\.09\.22/);
  assert.doesNotMatch(circuit, /2025-11-05/);
  for (const locale of LOCALE_KEYS) {
    assert.match(lookup(tables()[locale], 'cx.sh.venue'), /2026/, `${locale} must name the year`);
  }
});

/** Event and organisation names. These stay in Latin script in every locale. */
const PROPER_NOUN_KEYS = new Set([
  'cx.osaka.cite', 'cx.leap.cite', 'cx.tpe.cite', 'cx.tpe.venueShort',
]);

test('every circuit key resolves in all seven locales', () => {
  const used = new Set([...circuit.matchAll(/data-i18n="([^"]+)"/g)].map(m => m[1]));
  assert.ok(used.size >= 30, `expected a substantial key surface, found ${used.size}`);
  const copy = tables();
  const missing = [];
  for (const locale of LOCALE_KEYS) {
    for (const key of used) {
      const value = lookup(copy[locale], key);
      if (typeof value !== 'string' || !value.trim()) missing.push(`${locale}:${key}`);
    }
  }
  assert.deepEqual(missing, [], `untranslated circuit keys: ${missing.join(', ')}`);
});

test('no sentence-length key falls through to English in a non-English locale', () => {
  const copy = tables();
  const used = [...new Set([...circuit.matchAll(/data-i18n="([^"]+)"/g)].map(m => m[1]))];
  const suspicious = [];
  for (const locale of ['th', 'zh', 'ko', 'ja', 'vi']) {
    for (const key of used) {
      const en = lookup(copy.en, key);
      const loc = lookup(copy[locale], key);
      if (typeof en !== 'string' || typeof loc !== 'string') continue;
      if (PROPER_NOUN_KEYS.has(key)) continue;
      if (en.length >= 24 && loc === en) suspicious.push(`${locale}:${key}`);
    }
  }
  assert.deepEqual(suspicious, [], `untranslated sentence-length keys: ${suspicious.join(', ')}`);
});
