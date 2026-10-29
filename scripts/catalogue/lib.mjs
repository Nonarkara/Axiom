/**
 * The catalogue model — one place that knows how a system is described.
 *
 * Axiom holds one catalogue in two renderings: the main site draws it as
 * cards, the reading room holds it as data. For months both were written by
 * hand, and they drifted — silently, because every test looked at one file at
 * a time. The fix is not another test. It is one source of truth that the
 * renderings are generated from, so the two cannot disagree.
 *
 * This module is the contract:
 *
 *   data/catalogue/systems.json      every system, every field, every locale
 *   data/catalogue/categories.json   the shared category dictionary
 *   data/catalogue/plates.json       one artwork per entry, named fields
 *   data/catalogue/ebooks.json       reading-room-only publications
 *
 * The generators in `build.mjs` read those files and write the artefacts. The
 * gate in `check.mjs` regenerates them and refuses a commit whose artefacts
 * disagree with the source.
 *
 * Locales: the main site speaks seven (en/th/zh/ko/ja/vi/ts). The reading
 * room speaks six (no ts). `ts` is the source view — English rendered as
 * code — so its copy is deliberately terse and mechanical.
 */

import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const DATA = path.join(ROOT, 'data', 'catalogue');

export const SITE_LOCALES = ['en', 'th', 'zh', 'ko', 'ja', 'vi', 'ts'];
export const BOOK_LOCALES = ['en', 'th', 'zh', 'ko', 'ja', 'vi'];

/** The clusters, in the order the reading room prints its index. */
export const CLUSTERS = [
  { key: 'City Dashboards', label: 'CITY DASHBOARDS' },
  { key: 'Intelligence', label: 'INTELLIGENCE' },
  { key: 'Civic', label: 'CIVIC' },
  { key: 'Emerging', label: 'EMERGING' },
  { key: 'Lab', label: 'LAB' },
];

/**
 * The canonical status vocabulary. Every surface states a system's state in
 * one of these words; the reading room prints the word, the main site prints
 * the label its locale defines. `gated` is the one state whose label is
 * per-system copy rather than a shared string, because "Sign-in required"
 * says something different about a finance tower than about a life simulator.
 */
export const STATUS = {
  live: { book: 'Live', site: 'sysStatus.live' },
  preview: { book: 'Preview', site: 'sysStatus.preview' },
  soon: { book: 'Soon', site: 'sysStatus.soon' },
  dev: { book: 'Dev', site: 'sysStatus.dev' },
  emerging: { book: 'Emerging', site: 'sysStatus.emerging' },
  gated: { book: 'Sign-in required', site: null },
};

/** The inverse of HTML escaping, for text read back out of markup. */
export function unescapeHtml(value) {
  return String(value ?? '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

/**
 * The reading room's plate, as ten fields. The source of truth holds them by
 * name; the artefact holds them in this order, because that is the order the
 * reader reads them in.
 */
export const PLATE_FIELDS = [
  'artist', 'title', 'year', 'collection', 'source',
  'licence', 'why', 'width', 'height', 'medium',
];

export function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

export function readJSON(file) {
  return JSON.parse(read(file));
}

/**
 * The committed version of a file.
 *
 * The extractor reads the catalogue out of the artefacts as they are
 * committed, not as they sit in the working tree — otherwise running it
 * twice would read its own output and quietly empty the catalogue.
 */
export function readCommitted(file) {
  try {
    return execFileSync('git', ['show', `HEAD:${file}`], {
      cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
    });
  } catch (error) {
    throw new Error(`cannot read the committed ${file}: ${error.message}`);
  }
}

/**
 * Run a browser-shaped script (it assigns to `window` or `global`) in a
 * context that pretends to be a browser, and hand back what it exported.
 * These files are the site's runtime data; they are read, never executed.
 */
export function runBrowserScript(source, exportName) {
  const context = { window: {}, console };
  context.global = context;
  vm.createContext(context);
  vm.runInContext(source, context);
  return context.window[exportName];
}

/**
 * Cut a `const NAME = { … }` literal out of a script and evaluate it.
 * Used for the copy tables inside `public/app.js`, which are object
 * literals rather than exported globals.
 */
export function sliceObjectLiteral(source, name) {
  const start = source.indexOf(`const ${name} = {`);
  if (start < 0) throw new Error(`no object literal named ${name}`);
  const open = source.indexOf('{', start);
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    const ch = source[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return source.slice(open, i + 1);
    } else if (ch === '`') {
      i++;
      while (i < source.length && source[i] !== '`') {
        if (source[i] === '\\') i++;
        i++;
      }
    } else if (ch === '"' || ch === "'") {
      const quote = ch;
      i++;
      while (i < source.length && source[i] !== quote) {
        if (source[i] === '\\') i++;
        i++;
      }
    }
  }
  throw new Error(`unbalanced object literal: ${name}`);
}

export function evaluateLiteral(text) {
  return vm.runInNewContext(`(${text})`);
}

/**
 * The copy tables exactly as the page assembles them. The order matters:
 * the base tables, then the extensions, then the regional locales, then the
 * release copy, which overwrites the panels it names.
 */
export function loadMainSiteCopy(reader = read) {
  const app = reader('public/app.js');
  const uiCopy = evaluateLiteral(sliceObjectLiteral(app, 'uiCopy'));
  const i18nExt = evaluateLiteral(sliceObjectLiteral(app, 'i18nExt'));
  const i18nExt2 = evaluateLiteral(sliceObjectLiteral(app, 'i18nExt2'));
  const i18nPitch = evaluateLiteral(sliceObjectLiteral(app, 'i18nPitch'));
  const release = evaluateLiteral(sliceObjectLiteral(app, 'catalogReleaseCopy'));
  const regional = runBrowserScript(reader('public/i18n-regional.js'), 'AXIOM_REGIONAL_LOCALES');

  for (const [locale, table] of Object.entries(i18nExt)) {
    if (uiCopy[locale]) Object.assign(uiCopy[locale], table);
  }
  Object.assign(uiCopy, regional);
  for (const [locale, table] of Object.entries(i18nExt2)) {
    if (uiCopy[locale]) Object.assign(uiCopy[locale], table);
  }
  for (const [locale, table] of Object.entries(i18nPitch)) {
    if (uiCopy[locale]) Object.assign(uiCopy[locale], table);
  }

  const releaseIds = Object.keys(release.en).filter((key) => key !== 'proofLine' && key !== 'dao');
  for (const [locale, table] of Object.entries(release)) {
    if (!uiCopy[locale]) continue;
    for (const id of releaseIds) uiCopy[locale].panels[id] = table[id];
    Object.assign(uiCopy[locale].panels.p24, table.dao);
    uiCopy[locale].pitch.proofLine = table.proofLine;
  }

  return { uiCopy, release, releaseIds, architectures: evaluateLiteral(sliceObjectLiteral(app, 'ARCHITECTURES')) };
}

/**
 * The cells the main site renders, read out of the HTML.
 *
 * There are four shapes, and the difference matters:
 *
 *   link      <a class="sys-cell" data-arch="…">            a system that opens
 *   soon      <div class="sys-cell sys-cell--soon" …>       a system not yet open
 *   editions  <div class="sys-cell sys-cell--editions" …>   a system with a second address
 *   brand     <a class="sys-cell">                           a brand plate, not a system
 *
 * Only the first three name a system, and only those three are counted.
 */
export function loadMainSiteCells(reader = read) {
  const html = reader('public/index.html');
  const cellPattern = /<(a|div) class="(sys-cell(?: [^"]*)?)"([^>]*)>/g;
  const cells = [];
  let match;
  while ((match = cellPattern.exec(html))) {
    const [tag, className, attributes] = [match[1], match[2], match[3]];
    const open = match.index;
    // The cell's body runs to the matching close of its own tag. A div cell
    // nests divs, so the close is found by counting, not by first match.
    let end = -1;
    if (tag === 'a') {
      end = html.indexOf('</a>', open + match[0].length);
    } else {
      let depth = 1;
      const scan = /<(\/?)div\b/g;
      scan.lastIndex = open + match[0].length;
      let step;
      while ((step = scan.exec(html))) {
        depth += step[1] ? -1 : 1;
        if (depth === 0) { end = step.index; break; }
      }
    }
    const inner = html.slice(open + match[0].length, end === -1 ? html.length : end);
    const closeTag = tag === 'a' ? '</a>' : '</div>';

    const isBrand = !/data-arch=/.test(attributes);
    const variant = isBrand ? 'brand'
      : className.includes('--editions') ? 'editions'
      : className.includes('--soon') ? 'soon'
      : 'link';

    const keyOf = (namespace, field) => {
      const found = inner.match(new RegExp(`data-i18n="${namespace}\\.([^".]+)\\.${field}"`));
      return found ? found[1] : null;
    };
    const attr = (name) => (attributes.match(new RegExp(`\\b${name}="([^"]*)"`)) || [])[1] ?? null;

    cells.push({
      variant,
      id: attr('data-arch'),
      domId: attr('id'),
      href: attr('href') ?? ((inner.match(/class="sys-cell__primary"[^>]*href="([^"]+)"/) || [])[1] ?? null),
      target: attr('target'),
      rel: attr('rel'),
      editionHref: (inner.match(/class="sys-cell__edition"[^>]*href="([^"]+)"/) || [])[1] ?? null,
      editionKey: (inner.match(/class="sys-cell__edition"[^>]*data-i18n="([^"]+)"/) || [])[1] ?? null,
      img: (inner.match(/<img class="sys-cell__shot[^"]*" src="([^"]+)"/) || [])[1] ?? null,
      webp: (inner.match(/<source srcset="([^"]+)" type="image\/webp">/) || [])[1] ?? null,
      alt: (inner.match(/<img[^>]*alt="([^"]*)"/) || [])[1] ?? null,
      width: (inner.match(/<img[^>]*\bwidth="([^"]+)"/) || [])[1] ?? null,
      height: (inner.match(/<img[^>]*\bheight="([^"]+)"/) || [])[1] ?? null,
      loading: (inner.match(/<img[^>]*\bloading="([^"]+)"/) || [])[1] ?? null,
      crop: (inner.match(/sys-cell__shot--([a-z]+)/) || [])[1] ?? null,
      idx: (inner.match(/class="sys-cell__idx">([^<]*)</) || [])[1] ?? null,
      nameLiteral: (inner.match(/class="sys-cell__name"[^>]*>([\s\S]*?)<\/div>/) || [])[1]?.trim() ?? null,
      nameKey: keyOf('panels', 'name'),
      catKey: (inner.match(/class="sys-cell__cat" data-i18n="([^"]+)"/) || [])[1] ?? null,
      ledeKey: keyOf('panels', 'lede'),
      ctaKey: keyOf('panels', 'cta'),
      statusKey: (inner.match(/class="sys-cell__status">[\s\S]*?data-i18n="([^"]+)"/) || [])[1] ?? null,
      hasDot: /class="dot"/.test(inner),
      position: open,
      raw: html.slice(open, end === -1 ? html.length : end + closeTag.length),
    });
  }
  return cells;
}

/** Only the cells that name a system. */
export function loadMainSiteCards() {
  return loadMainSiteCells().filter((cell) => cell.variant !== 'brand');
}

/** The reading room's data, as the page sees it. */
export function loadBook(reader = read) {
  const systems = runBrowserScript(reader('axiomx/catalog.js'), 'AXIOM_SYSTEMS');
  const i18n = runBrowserScript(reader('axiomx/i18n.js'), 'AXIOM_I18N');
  const plates = runBrowserScript(reader('axiomx/plates.js'), 'AXIOM_PLATES');
  return { systems, i18n, plates };
}

/** Load the source of truth. */
export function loadCatalogue() {
  return {
    systems: readJSON('data/catalogue/systems.json'),
    categories: readJSON('data/catalogue/categories.json'),
    plates: readJSON('data/catalogue/plates.json'),
    ebooks: readJSON('data/catalogue/ebooks.json'),
  };
}

export function write(file, contents) {
  const target = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents);
  return contents.length;
}

/** Deterministic JSON: keys in insertion order, two-space indent, trailing newline. */
export function canonicalJSON(value) {
  return JSON.stringify(value, null, 2) + '\n';
}
