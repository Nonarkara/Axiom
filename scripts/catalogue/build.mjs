#!/usr/bin/env node
/**
 * The generator.
 *
 * Reads `data/catalogue/` and writes every place the catalogue appears:
 *
 *   public/app.js              the panels and category tables, the architecture
 *                              blocks, the proof line
 *   public/i18n-regional.js    the same tables for ko, ja, vi
 *   public/index.html          the catalogue cells
 *   axiomx/catalog.js          the reading room's catalogue
 *   axiomx/i18n.js             the reading room's per-locale copy
 *   axiomx/plates.js           the artwork list
 *
 * One source, six renderings. Nothing here is hand-maintained afterwards:
 * edit `data/catalogue/systems.json`, run this, and every surface moves.
 *
 *   node scripts/catalogue/build.mjs           # write the artefacts
 *   node scripts/catalogue/build.mjs --check   # fail if they have drifted
 */

import {
  BOOK_LOCALES, PLATE_FIELDS, SITE_LOCALES, canonicalJSON, loadCatalogue, read, write,
} from './lib.mjs';
import { elementEnd, htmlEscape, jsKey, jsString, memberPath, splice } from './edit.mjs';

const catalogue = loadCatalogue();
const systems = catalogue.systems.systems;
const categories = catalogue.categories;
const plates = catalogue.plates;
const byId = new Map(systems.map((s) => [s.id, s]));

/** The word the reading room files a state under. */
const BOOK_STATUS_WORD = {
  live: 'Live', preview: 'Preview', soon: 'Soon', dev: 'Dev',
  emerging: 'Emerging', gated: 'Sign-in required',
};

/** The systems of one cluster, in catalogue order. */
const inCluster = (cluster) => systems.filter((s) => s.cluster === cluster);

// ── the copy tables ────────────────────────────────────────────────────────

/** `panels.<key>` — every system's copy for one locale, minus its category. */
function panelsFor(locale) {
  const table = {};
  for (const system of systems) {
    const copy = { ...(system.copy[locale] || {}) };
    delete copy.cat;
    table[system.panelsKey] = copy;
  }
  return table;
}

/** `cats.<key>` — the shared category table for one locale. */
function catsFor(locale) {
  const table = {};
  for (const [key, byLocale] of Object.entries(categories)) {
    table[key] = byLocale[locale];
  }
  return table;
}

/** The status labels the main site wears, for one locale. */
function siteStatusFor(locale) {
  const table = {};
  for (const [state, vocabulary] of Object.entries(catalogue.systems.statusVocabulary)) {
    const label = vocabulary.site?.[locale];
    if (label !== undefined && label !== null) table[state] = label;
  }
  return table;
}

/** The status words the reading room files a system under, for one locale. */
function bookStatusFor(locale) {
  const table = {};
  for (const [state, vocabulary] of Object.entries(catalogue.systems.statusVocabulary)) {
    const label = vocabulary.book?.[locale];
    if (label !== undefined && label !== null) table[BOOK_STATUS_WORD[state]] = label;
  }
  return table;
}

/** The cluster headings for one locale, with the counts the catalogue holds. */
function clusterMetaFor(locale) {
  const template = catalogue.systems.clusterMeta[locale] || {};
  const counts = catalogue.systems.clusterCounts || {};
  const total = systems.length;
  const countries = catalogue.systems.countries;
  const filled = {};
  for (const [key, value] of Object.entries(template)) {
    if (typeof value !== 'string') { filled[key] = value; continue; }
    const clusterKey = { command: 'City Dashboards', intelligence: 'Intelligence', civic: 'Civic', emerging: 'Emerging', lab: 'Lab' }[key.replace(/Meta$/, '')];
    const count = clusterKey ? (counts[clusterKey] ?? 0) : total;
    filled[key] = value
      .replace(/\{count\}/g, String(count))
      .replace(/\{countries\}/g, String(countries));
  }
  return filled;
}

/** The reading room's per-locale copy for one system. */
function bookCopy(system, locale) {
  const copy = system.copy[locale] || system.copy.en;
  return {
    name: copy.name,
    cat: categories[system.catKey][locale],
    lede: copy.lede,
    cta: copy.cta,
  };
}

/** The reading room's catalogue — one entry per system. */
function bookCatalogue() {
  return systems.map((system) => {
    const entry = {
      id: system.id,
      cluster: system.cluster,
      idx: system.idx,
      name: system.copy.en.name,
      cat: categories[system.catKey].en,
      lede: system.copy.en.lede,
      status: BOOK_STATUS_WORD[system.status],
      href: system.href,
      cta: system.copy.en.cta,
      img: system.image.src,
      alt: system.image.alt,
    };
    if (system.edition) entry.edition = system.edition;
    if (system.arch) entry.arch = bookArch(system.arch);
    return entry;
  });
}

/** The reading room states every architecture field, even an empty one. */
function bookArch(arch) {
  return {
    ver: arch.ver || '',
    inputs: arch.inputs || [],
    core: arch.core,
    outputs: arch.outputs || [],
    foot: arch.foot || '',
    stack: arch.stack || [],
    ai: arch.ai || '',
  };
}

/** The main site states only the architecture fields that have a value. */
function siteArch(system) {
  const arch = system.arch;
  if (!arch) return null;
  const out = {};
  if (arch.name) out.name = arch.name;
  if (arch.ver) out.ver = arch.ver;
  if (arch.idx) out.idx = arch.idx;
  if (arch.inputs) out.inputs = arch.inputs;
  if (arch.core) out.core = arch.core;
  if (arch.outputs) out.outputs = arch.outputs;
  if (arch.foot) out.foot = arch.foot;
  return out;
}

// ── emitting JavaScript ────────────────────────────────────────────────────

/** `{ p48: { lede: '…', cta: '…' } }` in the house style. */
function emitObject(table, indent) {
  const pad = ' '.repeat(indent);
  const inner = ' '.repeat(indent + 2);
  const lines = [];
  for (const [key, value] of Object.entries(table)) {
    if (value === null || value === undefined) continue;
    if (typeof value === 'object' && !Array.isArray(value)) {
      const fields = Object.entries(value)
        .filter(([, v]) => v !== null && v !== undefined)
        .map(([k, v]) => `${inner}${jsKey(k)}: ${jsString(v)},`);
      lines.push(`${pad}${jsKey(key)}: {\n${fields.join('\n')}\n${pad}},`);
    } else {
      lines.push(`${pad}${jsKey(key)}: ${jsString(value)},`);
    }
  }
  return `{\n${lines.join('\n')}\n${pad}}`;
}

/** A flat string table: `{ c01: '…' }`. */
function emitFlat(table, indent) {
  const pad = ' '.repeat(indent);
  const lines = Object.entries(table).map(([key, value]) => `${pad}${jsKey(key)}: ${jsString(value)},`);
  return `{\n${lines.join('\n')}\n${pad}}`;
}

/** A JSON value, indented to sit inside an existing block. */
function emitJSON(value, indent) {
  const text = JSON.stringify(value, null, 2);
  const pad = ' '.repeat(indent);
  return text.split('\n').map((line, index) => (index === 0 ? line : pad + line)).join('\n');
}

// ── public/app.js ──────────────────────────────────────────────────────────

function buildAppJs() {
  let source = read('public/app.js');

  // The panels table for en, th, zh, ts.
  for (const locale of ['en', 'th', 'zh', 'ts']) {
    const span = memberPath(source, 'const i18nExt = {', [locale, 'panels']);
    source = splice(source, span.valueStart, span.valueEnd, emitObject(panelsFor(locale), 6));
  }
  // The shared category table for en, th, zh, ts.
  for (const locale of ['en', 'th', 'zh', 'ts']) {
    const span = memberPath(source, 'const i18nExt2 = {', [locale, 'cats']);
    source = splice(source, span.valueStart, span.valueEnd, emitFlat(catsFor(locale), 6));
  }
  // The status labels the cells wear, for en, th, zh, ts.
  for (const locale of ['en', 'th', 'zh', 'ts']) {
    const span = memberPath(source, 'const i18nExt2 = {', [locale, 'sysStatus']);
    source = splice(source, span.valueStart, span.valueEnd, emitFlat(siteStatusFor(locale), 6));
  }
  // The cluster headings, whose counts come from the catalogue.
  for (const locale of ['en', 'th', 'zh', 'ts']) {
    const span = memberPath(source, 'const i18nExt2 = {', [locale, 'sysClusters']);
    source = splice(source, span.valueStart, span.valueEnd, emitObject(clusterMetaFor(locale), 6));
  }
  // The architecture blocks.
  {
    const span = memberPath(source, 'const ARCHITECTURES = {', []);
    const table = {};
    for (const system of systems) {
      const arch = siteArch(system);
      if (arch) table[system.id] = arch;
    }
    source = splice(source, span.valueStart, span.valueEnd, emitObject(table, 2));
  }
  // The release copy now carries only the proof line; the copy itself lives
  // in the panels table, which is generated from one source.
  {
    const span = memberPath(source, 'const catalogReleaseCopy = {', []);
    const table = {};
    for (const locale of SITE_LOCALES) {
      table[locale] = { proofLine: proofLine(locale) };
    }
    source = splice(source, span.valueStart, span.valueEnd, emitObject(table, 2));
  }
  // …and the page no longer needs to copy release copy over the panels.
  {
    const from = 'Object.entries(catalogReleaseCopy).forEach(([locale, release]) => {';
    const at = source.indexOf(from);
    if (at < 0) throw new Error('the release copy merge is missing from public/app.js');
    const open = source.indexOf('{', at);
    const end = source.indexOf('\n});', open);
    source = splice(source, at, end + 4,
      'Object.entries(catalogReleaseCopy).forEach(([locale, release]) => {\n'
      + '  uiCopy[locale].pitch.proofLine = release.proofLine;\n'
      + '});');
  }
  return source;
}

/**
 * The proof line says how big the catalogue is. The number is derived, never
 * typed: a catalogue that gains a system must not leave a stale "80" behind.
 */
function proofLine(locale) {
  const template = catalogue.systems.proofLines[locale];
  if (!template) throw new Error(`no proof line for ${locale}`);
  const count = systems.length;
  const countries = catalogue.systems.countries;
  return template.replace(/\{count\}/g, String(count)).replace(/\{countries\}/g, String(countries));
}

// ── public/i18n-regional.js ────────────────────────────────────────────────

function buildRegional() {
  let source = read('public/i18n-regional.js');
  for (const locale of ['ko', 'ja', 'vi']) {
    const panels = memberPath(source, 'global.AXIOM_REGIONAL_LOCALES = {', [locale, 'panels']);
    source = splice(source, panels.valueStart, panels.valueEnd, emitJSON(panelsFor(locale), 6));
    const cats = memberPath(source, 'global.AXIOM_REGIONAL_LOCALES = {', [locale, 'cats']);
    source = splice(source, cats.valueStart, cats.valueEnd, emitJSON(catsFor(locale), 6));
    const status = memberPath(source, 'global.AXIOM_REGIONAL_LOCALES = {', [locale, 'sysStatus']);
    source = splice(source, status.valueStart, status.valueEnd, emitJSON(siteStatusFor(locale), 6));
    const clusters = memberPath(source, 'global.AXIOM_REGIONAL_LOCALES = {', [locale, 'sysClusters']);
    source = splice(source, clusters.valueStart, clusters.valueEnd, emitJSON(clusterMetaFor(locale), 6));
  }
  return source;
}

// ── axiomx/catalog.js ──────────────────────────────────────────────────────

function buildBookCatalogue() {
  return 'window.AXIOM_SYSTEMS = ' + JSON.stringify(bookCatalogue()) + ';\n';
}

// ── axiomx/i18n.js ─────────────────────────────────────────────────────────

function buildBookI18n() {
  let source = read('axiomx/i18n.js');
  const table = {};
  for (const locale of BOOK_LOCALES) {
    const entries = {};
    for (const system of systems) entries[system.id] = bookCopy(system, locale);
    table[locale] = entries;
  }
  const span = memberPath(source, 'global.AXIOM_I18N = {', ['systems']);
  source = splice(source, span.valueStart, span.valueEnd, emitJSON(table, 4));
  for (const locale of BOOK_LOCALES) {
    const status = memberPath(source, 'global.AXIOM_I18N = {', ['ui', locale, 'status']);
    source = splice(source, status.valueStart, status.valueEnd, emitJSON(bookStatusFor(locale), 8));
  }
  return source;
}

// ── axiomx/plates.js ───────────────────────────────────────────────────────

function buildPlates() {
  const head = read('axiomx/plates.js').split('window.AXIOM_PLATES = {')[0];
  const lines = Object.entries(plates).map(([id, fields]) => {
    const ordered = PLATE_FIELDS.map((field) => fields[field]);
    return `${JSON.stringify(id)}: ${JSON.stringify(ordered)},`;
  });
  return `${head}window.AXIOM_PLATES = {\n${lines.join('\n')}\n};\n`;
}

// ── public/index.html ──────────────────────────────────────────────────────

/** The status label a cell wears, and whether it carries the live dot. */
function statusMarkup(system) {
  if (system.status === 'gated') {
    const label = system.copy.en.access || 'Sign-in required';
    return { key: `panels.${system.panelsKey}.access`, label, dot: false };
  }
  const key = `sysStatus.${system.status}`;
  const vocabulary = catalogue.systems.statusVocabulary[system.status] || {};
  const label = vocabulary.site?.en || system.statusLabel;
  return { key, label, dot: system.status === 'live' };
}

function cellMarkup(system) {
  const indent = ' '.repeat(10);
  const status = statusMarkup(system);
  const crop = system.image.crop ? ` sys-cell__shot--${system.image.crop}` : '';
  const dims = system.image.width && system.image.height
    ? ` width="${system.image.width}" height="${system.image.height}"` : '';
  const domId = system.domId ? ` id="${system.domId}"` : '';
  const name = system.copy.en.name;

  const head = `${indent}  <div class="sys-cell__head"><span class="sys-cell__idx">${system.idx}</span>`
    + `<span class="sys-cell__status">${status.dot ? '<span class="dot"></span>' : ''}`
    + `<span data-i18n="${status.key}">${htmlEscape(status.label)}</span></span></div>`;
  const img = `<img class="sys-cell__shot${crop}" src="${system.image.src}" loading="lazy"${dims}`
    + ` alt="${htmlEscape(system.image.alt || '')}">`;
  // A cell with a modern source wears it in a <picture>; one without keeps a
  // plain <img>, so the browser never asks for a file that is not there.
  const picture = system.image.webp
    ? `${indent}  <picture><source srcset="${system.image.webp}" type="image/webp">${img}</picture>`
    : `${indent}  ${img}`;
  const body = [
    `${indent}  <div class="sys-cell__body">`,
    `${indent}    <div class="sys-cell__name" data-i18n="panels.${system.panelsKey}.name">${htmlEscape(name)}</div>`,
    `${indent}    <div class="sys-cell__cat" data-i18n="cats.${system.catKey}">${htmlEscape(system.copy.en.cat)}</div>`,
    `${indent}    <div class="sys-cell__lede" data-i18n="panels.${system.panelsKey}.lede">${htmlEscape(system.copy.en.lede)}</div>`,
    `${indent}    <span class="sys-cell__link"><span data-i18n="panels.${system.panelsKey}.cta">${htmlEscape(system.copy.en.cta)}</span> <span class="tri">▸</span></span>`,
    `${indent}  </div>`,
  ].join('\n');

  if (system.variant === 'soon') {
    return [
      `${indent}<div class="sys-cell sys-cell--soon" data-arch="${system.id}">`,
      head, picture, body,
      `${indent}</div>`,
    ].join('\n');
  }

  if (system.variant === 'editions') {
    return [
      `${indent}<div class="sys-cell sys-cell--editions" data-arch="${system.id}">`,
      `${indent}  <a class="sys-cell__primary" href="${system.href}" target="_blank" rel="noopener">`,
      head, picture, body,
      `${indent}  </a>`,
      `${indent}  <a class="sys-cell__edition" href="${system.edition.href}" target="_blank" rel="noopener"`
      + ` data-i18n="panels.${system.panelsKey}.original">${htmlEscape(system.copy.en.original || '')}</a>`,
      `${indent}</div>`,
    ].join('\n');
  }

  return [
    `${indent}<a class="sys-cell"${domId} data-arch="${system.id}" href="${system.href}" target="_blank" rel="noopener">`,
    head, picture, body,
    `${indent}</a>`,
  ].join('\n');
}

function buildHtml() {
  let source = read('public/index.html');
  for (const cluster of catalogue.systems.clusters) {
    const markerAt = source.indexOf(cluster.marker);
    if (markerAt < 0) throw new Error(`missing cluster marker: ${cluster.marker}`);
    // The cluster's heading stays as it is — it is the page's writing, not the
    // catalogue's. Only the grid of cells is generated.
    const gridAt = source.indexOf('<div class="grid', markerAt);
    if (gridAt < 0) throw new Error(`no grid after ${cluster.marker}`);
    const { contentEnd } = elementEnd(source, gridAt);
    const gridOpen = source.slice(gridAt, source.indexOf('>', gridAt) + 1);
    const cells = inCluster(cluster.key).map(cellMarkup).join('\n');
    source = splice(source, gridAt + gridOpen.length, contentEnd, `\n${cells}\n        `);
  }
  return source;
}

// ── the artefacts ──────────────────────────────────────────────────────────

export const ARTEFACTS = {
  'public/app.js': buildAppJs,
  'public/i18n-regional.js': buildRegional,
  'public/index.html': buildHtml,
  'axiomx/catalog.js': buildBookCatalogue,
  'axiomx/i18n.js': buildBookI18n,
  'axiomx/plates.js': buildPlates,
};

function main() {
  const check = process.argv.includes('--check');
  let drift = 0;
  for (const [file, build] of Object.entries(ARTEFACTS)) {
    const built = build();
    if (check) {
      const current = read(file);
      if (current === built) {
        console.log(`  ok    ${file}`);
      } else {
        drift++;
        console.log(`  DRIFT ${file}`);
        console.log(`        committed ${current.length} bytes, generated ${built.length} bytes`);
      }
    } else {
      write(file, built);
      console.log(`  wrote ${file} (${built.length} bytes)`);
    }
  }
  if (check && drift) {
    console.error(`\nFAIL — ${drift} artefact(s) disagree with data/catalogue/. Run: node scripts/catalogue/build.mjs`);
    process.exit(1);
  }
  if (check) console.log('\nPASS — every artefact matches the source of truth.');
}

if (import.meta.url === `file://${process.argv[1]}`) main();
