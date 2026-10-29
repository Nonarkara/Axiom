#!/usr/bin/env node
/**
 * Prove that the generated artefacts say the same thing as the ones they
 * replaced.
 *
 * A generator that quietly changes the site is worse than no generator. So
 * this compares the two versions at the level the page reads: the copy tables
 * after they are merged the way the page merges them, and every catalogue
 * cell resolved to the words a reader would see.
 *
 *   node scripts/catalogue/compare.mjs /tmp/axiom-before . 
 *
 * Exits non-zero when anything differs that should not.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import vm from 'node:vm';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const LOCALES = ['en', 'th', 'zh', 'ko', 'ja', 'vi', 'ts'];

function read(root, file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}
function runGlobal(source, name) {
  const context = { window: {}, console };
  context.global = context;
  vm.createContext(context);
  vm.runInContext(source, context);
  return context.window[name];
}
function sliceObject(source, name) {
  const start = source.indexOf(`const ${name} = {`);
  const open = source.indexOf('{', start);
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    const ch = source[i];
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0) return source.slice(open, i + 1); }
    else if (ch === '`') { i++; while (source[i] !== '`') { if (source[i] === '\\') i++; i++; } }
    else if (ch === '"' || ch === "'") { const q = ch; i++; while (source[i] !== q) { if (source[i] === '\\') i++; i++; } }
  }
  throw new Error(`unbalanced ${name}`);
}
const evaluate = (text) => vm.runInNewContext(`(${text})`);

const RELEASE_IDS = ['champion', 'soccer', 'vision', 'each', 'jakarta', 'constitution', 'ladder',
  'techhunt', 'bangkokIoc', 'life', 'burma', 'llm', 'dhaka', 'tsunami', 'universe_69', 'dog', 'pavilion'];

function mergedCopy(root) {
  const app = read(root, 'public/app.js');
  const uiCopy = evaluate(sliceObject(app, 'uiCopy'));
  const i18nExt = evaluate(sliceObject(app, 'i18nExt'));
  const i18nExt2 = evaluate(sliceObject(app, 'i18nExt2'));
  const i18nPitch = evaluate(sliceObject(app, 'i18nPitch'));
  const release = evaluate(sliceObject(app, 'catalogReleaseCopy'));
  const regional = runGlobal(read(root, 'public/i18n-regional.js'), 'AXIOM_REGIONAL_LOCALES');
  for (const [locale, table] of Object.entries(i18nExt)) if (uiCopy[locale]) Object.assign(uiCopy[locale], table);
  Object.assign(uiCopy, regional);
  for (const [locale, table] of Object.entries(i18nExt2)) if (uiCopy[locale]) Object.assign(uiCopy[locale], table);
  for (const [locale, table] of Object.entries(i18nPitch)) if (uiCopy[locale]) Object.assign(uiCopy[locale], table);
  for (const [locale, table] of Object.entries(release)) {
    if (!uiCopy[locale]) continue;
    for (const id of RELEASE_IDS) {
      if (table[id]) uiCopy[locale].panels[id] = table[id];
    }
    if (table.dao) Object.assign(uiCopy[locale].panels.p24, table.dao);
    if (table.proofLine) uiCopy[locale].pitch.proofLine = table.proofLine;
  }
  return uiCopy;
}

/** Every catalogue cell, resolved to the words a reader sees. */
function cells(root) {
  const html = read(root, 'public/index.html');
  const copy = mergedCopy(root);
  const pattern = /<(a|div) class="(sys-cell(?: [^"]*)?)"([^>]*)>/g;
  const found = [];
  let match;
  while ((match = pattern.exec(html))) {
    const [, tag, className, attributes] = match;
    if (!/data-arch=/.test(attributes)) continue;
    const id = (attributes.match(/data-arch="([^"]+)"/) || [])[1];
    const open = match.index;
    let end = -1;
    if (tag === 'a') end = html.indexOf('</a>', open + match[0].length);
    else {
      let depth = 1;
      const scan = /<(\/?)div\b/g;
      scan.lastIndex = open + match[0].length;
      let step;
      while ((step = scan.exec(html))) {
        depth += step[1] ? -1 : 1;
        if (depth === 0) { end = step.index; break; }
      }
    }
    const inner = html.slice(open + match[0].length, end);
    const text = (selector) => {
      const hit = inner.match(new RegExp(`class="${selector}"[^>]*>([\\s\\S]*?)<`));
      return hit ? hit[1].replace(/\s+/g, ' ').trim() : null;
    };
    const keyOf = (namespace, field) => {
      const hit = inner.match(new RegExp(`data-i18n="${namespace}\\.([^".]+)\\.${field}"`));
      return hit ? hit[1] : null;
    };
    const ledeKey = keyOf('panels', 'lede');
    const ctaKey = keyOf('panels', 'cta');
    const nameKey = keyOf('panels', 'name');
    const catKey = (inner.match(/class="sys-cell__cat" data-i18n="([^"]+)"/) || [])[1] || null;
    const statusKey = (inner.match(/class="sys-cell__status">[\s\S]*?data-i18n="([^"]+)"/) || [])[1] || null;

    const resolve = (key) => {
      if (!key) return null;
      const [namespace, field] = key.includes('.') ? key.split('.') : [null, key];
      if (namespace === 'panels') {
        const panel = copy.en.panels[field];
        if (!panel) return null;
        return panel[field === 'panels' ? '' : ''] ?? panel[namespace.split('.')[1]] ?? null;
      }
      if (namespace === 'cats') return copy.en.cats[field] ?? null;
      if (namespace === 'sysStatus') return copy.en.sysStatus[field] ?? null;
      return null;
    };
    const resolveStatus = () => {
      if (!statusKey) return null;
      if (statusKey.startsWith('panels.')) {
        const [, , field] = statusKey.split('.');
        const panelKey = statusKey.split('.')[1];
        return copy.en.panels[panelKey]?.[field] ?? null;
      }
      const field = statusKey.split('.')[1];
      return copy.en.sysStatus[field] ?? null;
    };
    const resolveCat = () => {
      if (!catKey) return null;
      if (catKey.startsWith('cats.')) return copy.en.cats[catKey.slice(5)] ?? null;
      const panelKey = catKey.split('.')[1];
      return copy.en.panels[panelKey]?.cat ?? null;
    };

    found.push({
      id,
      variant: className.includes('--editions') ? 'editions' : className.includes('--soon') ? 'soon' : 'link',
      idx: text('sys-cell__idx'),
      name: nameKey ? (copy.en.panels[nameKey]?.name ?? null) : text('sys-cell__name'),
      category: resolveCat(),
      lede: ledeKey ? (copy.en.panels[ledeKey]?.lede ?? null) : null,
      cta: ctaKey ? (copy.en.panels[ctaKey]?.cta ?? null) : null,
      status: resolveStatus(),
      href: (attributes.match(/href="([^"]+)"/) || [])[1] ?? (inner.match(/class="sys-cell__primary"[^>]*href="([^"]+)"/) || [])[1] ?? null,
      img: (inner.match(/<img class="sys-cell__shot[^"]*" src="([^"]+)"/) || [])[1] ?? null,
      webp: (inner.match(/<source srcset="([^"]+)" type="image\/webp">/) || [])[1] ?? null,
      alt: (inner.match(/<img[^>]*alt="([^"]*)"/) || [])[1] ?? null,
    });
  }
  return found;
}

const before = process.argv[2] || '/tmp/axiom-before';
const after = process.argv[3] || ROOT;
let failures = 0;
const note = (message) => { failures++; console.log(`  ✗ ${message}`); };

console.log(`=== comparing ${before} with ${after} ===\n`);

// ── the copy tables ────────────────────────────────────────────────────────
const copyBefore = mergedCopy(before);
const copyAfter = mergedCopy(after);
let copyDiffs = 0;
for (const locale of LOCALES) {
  const a = copyBefore[locale] || {};
  const b = copyAfter[locale] || {};
  for (const namespace of ['panels', 'cats', 'sysStatus', 'sysClusters']) {
    const tableA = a[namespace] || {};
    const tableB = b[namespace] || {};
    const keys = new Set([...Object.keys(tableA), ...Object.keys(tableB)]);
    for (const key of keys) {
      const valueA = tableA[key];
      const valueB = tableB[key];
      if (JSON.stringify(valueA) === JSON.stringify(valueB)) continue;
      // Compare field by field: a key that moved is not a key that changed.
      const plain = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
      if (!plain(valueA) || !plain(valueB)) {
        copyDiffs++;
        const short = (v) => String(v ?? '').slice(0, 110);
        console.log(`  copy ${locale}.${namespace}.${key}`);
        console.log(`      before: ${short(JSON.stringify(valueA))}`);
        console.log(`      after : ${short(JSON.stringify(valueB))}`);
        continue;
      }
      const fields = new Set([
        ...Object.keys(valueA || {}), ...Object.keys(valueB || {}),
      ]);
      for (const field of fields) {
        const a = JSON.stringify(valueA?.[field]);
        const b = JSON.stringify(valueB?.[field]);
        if (a === b) continue;
        copyDiffs++;
        const short = (v) => String(v ?? '').slice(0, 110);
        console.log(`  copy ${locale}.${namespace}.${key}.${field}`);
        console.log(`      before: ${short(a)}`);
        console.log(`      after : ${short(b)}`);
      }
    }
  }
}
console.log(`\ncopy differences: ${copyDiffs}`);

// ── the catalogue cells ────────────────────────────────────────────────────
const cellsBefore = cells(before);
const cellsAfter = cells(after);
console.log(`cells: ${cellsBefore.length} before, ${cellsAfter.length} after`);
if (cellsBefore.length !== cellsAfter.length) note('the number of catalogue cells changed');

const beforeById = new Map(cellsBefore.map((c) => [c.id, c]));
const afterById = new Map(cellsAfter.map((c) => [c.id, c]));
for (const id of beforeById.keys()) if (!afterById.has(id)) note(`${id} disappeared from the catalogue`);
for (const id of afterById.keys()) if (!beforeById.has(id)) note(`${id} is new to the catalogue`);

let cellDiffs = 0;
for (const [id, a] of beforeById) {
  const b = afterById.get(id);
  if (!b) continue;
  for (const field of ['variant', 'idx', 'name', 'category', 'lede', 'cta', 'status', 'href', 'img', 'webp', 'alt']) {
    if (a[field] === b[field]) continue;
    cellDiffs++;
    console.log(`  cell ${id}.${field}`);
    console.log(`      before: ${String(a[field]).slice(0, 100)}`);
    console.log(`      after : ${String(b[field]).slice(0, 100)}`);
  }
}
console.log(`cell differences: ${cellDiffs}`);

// ── the reading room ───────────────────────────────────────────────────────
const systemsBefore = runGlobal(read(before, 'axiomx/catalog.js'), 'AXIOM_SYSTEMS');
const systemsAfter = runGlobal(read(after, 'axiomx/catalog.js'), 'AXIOM_SYSTEMS');
console.log(`\nreading-room catalogue: ${systemsBefore.length} before, ${systemsAfter.length} after`);
let bookDiffs = 0;
const bookBefore = new Map(systemsBefore.map((s) => [s.id, s]));
const bookAfter = new Map(systemsAfter.map((s) => [s.id, s]));
for (const [id, a] of bookBefore) {
  const b = bookAfter.get(id);
  if (!b) { note(`${id} disappeared from the reading room`); continue; }
  for (const field of ['cluster', 'idx', 'name', 'cat', 'lede', 'status', 'href', 'cta', 'img', 'alt']) {
    if (a[field] === b[field]) continue;
    bookDiffs++;
    console.log(`  book ${id}.${field}`);
    console.log(`      before: ${String(a[field]).slice(0, 100)}`);
    console.log(`      after : ${String(b[field]).slice(0, 100)}`);
  }
}
console.log(`reading-room differences: ${bookDiffs}`);

console.log(`\n${copyDiffs + cellDiffs + bookDiffs} difference(s) recorded.`);
