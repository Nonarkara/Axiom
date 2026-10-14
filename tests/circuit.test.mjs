// The speaking circuit. Three things are load-bearing and therefore tested:
//
//   1. FIXED FOOTPRINT. The original four keynote blocks grew the page by roughly
//      a viewport per talk. That is the defect this section was built to remove,
//      so the fix is asserted rather than trusted: card height comes from a single
//      token, and nothing inside a card may exceed it. A future agent adding a
//      seventh stop, or a fifth stat, must not be able to silently undo this.
//
//   2. EVERY STOP IS ON THE LEDGER. The rail carries the stops with evidence. The
//      ledger carries all of them, including the one whose date is not yet
//      confirmed. A stop with no date is still a stop; it just has to SAY so
//      rather than carry a date nobody can source.
//
//   3. EVERY KEY TRANSLATES. Seven locales. A missing key silently falls back to
//      English at runtime, which is exactly how a Thai reader ends up looking at
//      English. This catches that at commit time instead.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';


const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
const circuitCss = await readFile(new URL('../public/circuit.css', import.meta.url), 'utf8');
const ramsCss = await readFile(new URL('../public/rams.css', import.meta.url), 'utf8');

const appSource = await readFile(new URL('../public/app.js', import.meta.url), 'utf8');
const regionalSource = await readFile(new URL('../public/i18n-regional.js', import.meta.url), 'utf8');

const LOCALE_KEYS = ['en', 'th', 'zh', 'ko', 'ja', 'vi', 'ts'];

/** The body of a single CSS rule, e.g. `.cx-card { … }`, up to its own brace. */
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

/**
 * Pull every `stageSect: { … }` and `cx: { … }` object literal out of a source
 * file and evaluate them.
 *
 * app.js cannot be run in a VM — it drives the DOM at module scope — so the
 * locale tables are lifted straight out of the source instead. That is more
 * honest anyway: this asserts what is actually in the file, not what a
 * half-stubbed runtime happens to produce.
 */
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
  return Array.from({ length: count }, (_, i) => ({
    stageSect: groups.stageSect[i],
    cx: groups.cx[i],
  }));
}

const appLocaleTables = zipLocales(appTables, 4);
const regionalLocaleTables = zipLocales(regionalTables, 3);

const section = html.slice(html.indexOf('<section class="section" id="stages">'));
const circuit = section.slice(0, section.indexOf('<!-- ============== FIELD NOTES'));

/** Resolve a dotted key against a locale table, returning undefined if absent. */
function lookup(table, key) {
  return key.split('.').reduce((node, part) => node?.[part], table);
}

/** The circuit copy for every locale: app.js holds en/th/zh/ts, regional holds ko/ja/vi. */
function tables() {
  const merged = {};
  ['en', 'th', 'zh', 'ts'].forEach((locale, i) => { merged[locale] = appLocaleTables[i]; });
  ['ko', 'ja', 'vi'].forEach((locale, i) => { merged[locale] = regionalLocaleTables[i]; });
  return merged;
}

test('all seven locale tables were found in source', () => {
  assert.equal(appLocaleTables.length, 4, 'expected a table in each of en/th/zh/ts');
  assert.equal(regionalLocaleTables.length, 3, 'expected a table in each of ko/ja/vi');
  for (const table of [...appLocaleTables, ...regionalLocaleTables]) {
    assert.ok(table.stageSect && table.cx, 'each locale needs both stageSect and cx');
  }
});

const rail = circuit.slice(circuit.indexOf('class="cx-rail"'), circuit.indexOf('</div>\n\n        <div class="cx-ctrl"'));
const cards = rail.split('<article class="cx-card">').slice(1);
const ledgerRows = [...circuit.matchAll(/class="cx-ledger__row[ "]/g)];

test('the rail renders one card per sourced stop', () => {
  assert.ok(cards.length >= 5, `expected at least 5 cards, found ${cards.length}`);
  for (const card of cards) {
    assert.match(card, /class="cx-card__venue"/, 'card needs a venue');
    assert.match(card, /class="cx-card__format"/, 'card needs a format');
    assert.match(card, /class="cx-card__note"/, 'card needs a note');
    assert.match(card, /class="cx-card__quote"/, 'card needs a quote');
    assert.match(card, /class="cx-card__cite"/, 'card needs attribution');
    assert.match(card, /class="cx-card__shot"/, 'card needs a shot or a type block');
    assert.equal((card.match(/class="cx-card__stat"/g) || []).length, 3, 'card needs exactly 3 readouts');
  }
});

test('every photograph carries alt text and a real file', () => {
  const imgs = [...circuit.matchAll(/<img[^>]+src="([^"]+)"[^>]*>/g)];
  assert.ok(imgs.length >= 5, `expected at least 5 stage photographs, found ${imgs.length}`);
  for (const [, tag] of imgs) void tag;
  for (const match of circuit.matchAll(/<img\b[^>]*>/g)) {
    const tag = match[0];
    assert.match(tag, /alt="[^"]{8,}"/, `weak or missing alt: ${tag.slice(0, 90)}`);
  }
  // every <source> must have a sibling fallback in a raster format
  for (const match of circuit.matchAll(/<source\b[^>]*srcset="([^"]+)"[^>]*>/g)) {
    assert.match(match[1], /\.webp$/, match[1]);
  }
  assert.equal(
    [...circuit.matchAll(/<source\b/g)].length,
    [...circuit.matchAll(/<picture>/g)].length,
    'every picture needs a webp source',
  );
});

test('every ledger row carries a real date from the organiser', () => {
  // The unconfirmed Hong Kong placeholder is gone: it turned out to be LEAP East
  // 2026 at the Hong Kong Convention and Exhibition Centre, 8–10 July 2026. A row
  // without a sourced date is the failure this whole rail was built to avoid, so
  // the invariant is that none may exist.
  assert.equal(ledgerRows.length, 6, 'one header row plus one row per stop');
  assert.doesNotMatch(circuit, /cx-ledger__row--pending/, 'no stop may fall back to a pending marker');
  assert.doesNotMatch(circuit, /data-i18n="cx\.l\.pending"/, 'the pending key should be gone with the row');

  const ledgerBody = circuit.slice(circuit.indexOf('cx-ledger"'), circuit.indexOf('cx-ledger__foot'));
  for (const match of ledgerBody.matchAll(/class="cx-ledger__date"[^>]*>([^<]+)</g)) {
    const value = match[1].trim();
    assert.match(value, /^\d{4}(\.\d{2}(\.\d{2})?)?$/, `unrecognised ledger date: "${value}"`);
  }
});

test('LEAP East is Hong Kong, not Bangkok', () => {
  // Regression guard. The rail previously placed LEAP East 2026 in Bangkok under
  // an EVENT_ID ending _BKK. It was at the Hong Kong Convention and Exhibition
  // Centre, 8–10 July 2026 — see leapeast.com/events/2026-agenda and the HKSAR
  // Government release of 8 July 2026.
  assert.match(circuit, /data-i18n="cx\.leap\.city">Hong Kong</);
  assert.match(circuit, /data-i18n="cx\.leap\.venueShort">LEAP East · HKCEC</);
  assert.doesNotMatch(circuit, /Bangkok/, 'LEAP East must not be filed under Bangkok');
  assert.doesNotMatch(html, /LEAP_EAST_2026_BKK/);

  const copy = tables();
  for (const locale of LOCALE_KEYS) {
    assert.equal(lookup(copy[locale], 'cx.leap.city'), copy[locale].cx.leap.city);
    assert.match(lookup(copy[locale], 'cx.leap.venue'), /LEAP[ .]East/);
    assert.doesNotMatch(lookup(copy[locale], 'cx.leap.venue'), /Bangkok|กรุงเทพฯ|曼谷/);
  }
});

test('the rail and the ledger are ordered newest first', () => {
  // The markup renders in document order, so ordering is structure. Getting it
  // wrong puts a March talk above a September one with no other symptom.
  const railDates = [...rail.matchAll(/class="cx-card__date">([\d.]+)</g)].map(m => m[1]);
  // bound the slice at the footer, which reuses the .cx-ledger__date class for
  // its own "Updated" stamp
  const ledgerBody = circuit.slice(circuit.indexOf('cx-ledger"'), circuit.indexOf('cx-ledger__foot'));
  const ledgerDates = [...ledgerBody.matchAll(/class="cx-ledger__date"[^>]*>([^<]+)</g)].map(m => m[1].trim());

  assert.ok(railDates.length >= 5, 'expected five rail cards');
  assert.deepEqual(railDates, ledgerDates, 'the ledger must mirror the rail order');

  const keys = railDates.map(d => d.split('.').map(Number));
  for (let i = 1; i < keys.length; i += 1) {
    const [py, pm = 1, pd = 1] = keys[i - 1];
    const [cy, cm = 1, cd = 1] = keys[i];
    assert.ok(cy * 10000 + cm * 100 + cd <= py * 10000 + pm * 100 + pd,
      `${railDates[i]} (${railDates[i - 1]}) is out of order`);
  }
});

test('Shanghai is 2026, not 2025', () => {
  // Tomorrow.City Shanghai 2026 ran 22–26 September 2026 at Zhangjiang Science
  // Hall. The rail previously carried 2025-11-05, which no source supported.
  assert.match(circuit, /2026\.09\.22/);
  assert.doesNotMatch(circuit, /2025-11-05/);
  for (const locale of LOCALE_KEYS) {
    assert.match(lookup(tables()[locale], 'cx.sh.venue'), /2026/, `${locale} sh venue must name the year`);
  }
});

test('card height is one token, and nothing in the card is unbounded', () => {
  // The footprint is the whole point: a seventh stop must cost no extra height.
  const token = circuitCss.match(/--cx-card-h:\s*(\d+)px/);
  assert.ok(token, '--cx-card-h must be declared in circuit.css');
  assert.equal((circuitCss.match(/--cx-card-h:/g) || []).length, 2,
    'one desktop value plus one mobile override — nothing else may redefine it');

  const cardRule = cssRule(circuitCss, '.cx-card {');
  assert.ok(cardRule, '.cx-card must exist');
  assert.match(cardRule, /height: var\(--cx-card-h\)/, 'the card must take its height from the token');
  assert.match(cardRule, /overflow: hidden/, 'overflow must be clipped so the card cannot grow');

  // The two unbounded text blocks are the only places a card could silently
  // outgrow its budget, so both must be line-clamped.
  assert.match(cssRule(circuitCss, '.cx-card__note {'), /line-clamp: 3/);
  assert.match(cssRule(circuitCss, '.cx-card__quote > span {'), /line-clamp: 2/);
  assert.doesNotMatch(cssRule(circuitCss, '.cx-card__quote {'), /line-clamp/,
    'clamping the blockquote would eat the <cite> attribution');
});

test('the retired .stage markup and its CSS are both gone', () => {
  assert.doesNotMatch(circuit, /class="stage"/, 'the old vertical stage blocks must not return');
  assert.doesNotMatch(ramsCss, /\.stage__/, 'dead .stage CSS must not linger');
});

test('every circuit key resolves in all seven locales', () => {
  const used = new Set([...circuit.matchAll(/data-i18n="([^"]+)"/g)].map(m => m[1]));
  assert.ok(used.size >= 25, `expected a substantial key surface, found ${used.size}`);

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

/** Event and organisation names. These stay in Latin script in every locale. */
const PROPER_NOUN_KEYS = new Set([
  'cx.osaka.cite', 'cx.leap.cite', 'cx.tpe.cite',
  'cx.tpe.venueShort', 'cx.leap.venueShort', 'cx.sh.venueShort',
]);

test('no circuit key falls through to the English string in a non-English locale', () => {
  const copy = tables();
  const used = [...new Set([...circuit.matchAll(/data-i18n="([^"]+)"/g)].map(m => m[1]))];

  // Short labels legitimately match across scripts (proper nouns, numbers).
  // Only flag a locale that copied the English string for a sentence-length key.
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

test('the rail controls exist and the script ships', () => {
  assert.match(html, /<script defer src="circuit\.js\?v=[^"]+"><\/script>/);
  assert.match(html, /<link rel="stylesheet" href="circuit\.css\?v=[^"]+">/);
  assert.match(html, /data-cx-prev/);
  assert.match(html, /data-cx-next/);
  const btn = cssRule(circuitCss, '.cx-ctrl__btn {');
  assert.match(btn, /width: 44px/);
  assert.match(btn, /height: 44px/);
});