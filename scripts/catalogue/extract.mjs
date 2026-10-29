#!/usr/bin/env node
/**
 * One-time migration: read the catalogue out of the hand-written artefacts
 * and write it into `data/catalogue/`, where one generator can own it.
 *
 * Nothing here invents content. Every field is lifted from a file that is
 * already live, and the report at the end names every disagreement it found
 * along the way, so the two renderings can be reconciled deliberately rather
 * than by accident.
 *
 *   node scripts/catalogue/extract.mjs            # write the source of truth
 *   node scripts/catalogue/extract.mjs --dry-run  # report only, write nothing
 */

import {
  BOOK_LOCALES, SITE_LOCALES, canonicalJSON, loadBook, loadMainSiteCells,
  loadMainSiteCopy, PLATE_FIELDS, readCommitted, runBrowserScript, unescapeHtml, write,
} from './lib.mjs';
import fs from 'node:fs';
import path from 'node:path';

const dryRun = process.argv.includes('--dry-run');
const force = process.argv.includes('--force');
const SOURCE = 'data/catalogue/systems.json';
const notes = [];
const note = (kind, message) => notes.push({ kind, message });

// The catalogue is read out of the committed artefacts, so this can be run
// again without reading its own output.
const { uiCopy, release, releaseIds, architectures } = loadMainSiteCopy(readCommitted);
const cells = loadMainSiteCells(readCommitted);
const cards = cells.filter((cell) => cell.variant !== 'brand');
const { systems: bookSystems, i18n: bookI18n, plates: bookPlates } = loadBook(readCommitted);

const cardsById = new Map(cards.map((card) => [card.id, card]));
const bookById = new Map(bookSystems.map((system) => [system.id, system]));

// ── the clusters, in the order both surfaces use ───────────────────────────
const CLUSTER_MARKERS = [
  { key: 'City Dashboards', marker: '<!-- CITY DASHBOARDS -->' },
  { key: 'Intelligence', marker: '<!-- INTELLIGENCE -->' },
  { key: 'Civic', marker: '<!-- CIVIC -->' },
  { key: 'Emerging', marker: '<!-- EMERGING -->' },
  { key: 'Lab', marker: '<!-- LAB -->' },
];

// ── the status vocabulary ──────────────────────────────────────────────────
const SITE_STATUS_TO_STATE = {
  'sysStatus.live': 'live',
  'sysStatus.preview': 'preview',
  'sysStatus.soon': 'soon',
  'sysStatus.dev': 'dev',
  'sysStatus.emerging': 'emerging',
};
const BOOK_STATUS_TO_STATE = {
  Live: 'live',
  Preview: 'preview',
  Soon: 'soon',
  Dev: 'dev',
  Emerging: 'emerging',
  'Coming soon': 'soon',
  'In Development': 'dev',
  'Sign-in required': 'gated',
};
/** What the reading room calls each state. */
/**
 * The status vocabulary — one set of states, shared by both surfaces.
 *
 * The main site wears one word for a state and the reading room another:
 * "Coming soon" on a card, "Soon" in the book, and four states the reading
 * room had no word for at all, so it printed them in English whatever
 * language it was set to. One vocabulary, one meaning, every language.
 */
const statusVocabulary = {};
for (const state of ['live', 'preview', 'soon', 'dev', 'emerging', 'gated']) {
  statusVocabulary[state] = { site: {}, book: {} };
}
// The main site's own labels, read from the copy tables as they stand.
for (const locale of SITE_LOCALES) {
  for (const [key, value] of Object.entries(uiCopy[locale].sysStatus || {})) {
    const state = SITE_STATUS_TO_STATE[`sysStatus.${key}`];
    if (state) statusVocabulary[state].site[locale] = value;
  }
}
// The reading room's own words, read from its status dictionary.
const BOOK_STATE_BY_WORD = { Live: 'live', Preview: 'preview', Soon: 'soon', Dev: 'dev' };
for (const locale of BOOK_LOCALES) {
  for (const [word, value] of Object.entries(bookI18n.ui?.[locale]?.status || {})) {
    const state = BOOK_STATE_BY_WORD[word];
    if (state) statusVocabulary[state].book[locale] = value;
  }
}
// Two states the reading room had no word for: it printed them in English in
// every language. And the main site had no word for "emerging" at all.
statusVocabulary.emerging.site = {
  en: 'Emerging', th: 'กำลังเกิดใหม่', zh: '新兴', ko: '테어나는 중',
  ja: '誕生途中', vi: 'Đang nổi lên', ts: 'emerging',
};
statusVocabulary.emerging.book = {
  en: 'Emerging', th: 'กำลังเกิดใหม่', zh: '新兴', ko: '테어나는 중',
  ja: '誕生途中', vi: 'Đang nổi lên',
};
statusVocabulary.gated.book = {
  en: 'Sign-in required', th: 'ต้องเข้าสู่ระบบ', zh: '需要登录',
  ko: '로그인 필요', ja: 'ログインが必要', vi: 'Cần đăng nhập',
};
/** The word the reading room files a system under. */
const BOOK_STATUS_WORD = {
  live: 'Live', preview: 'Preview', soon: 'Soon', dev: 'Dev',
  emerging: 'Emerging', gated: 'Sign-in required',
};

// ── the category table ─────────────────────────────────────────────────────
// The main site keeps categories in a shared table because many systems share
// one. A few newer systems kept their category inside their own copy block
// instead — the same fact in two places. The source of truth gives every
// system one category key and the generator writes the single shared table.
const categoryTable = new Map();
for (const locale of SITE_LOCALES) {
  for (const [key, value] of Object.entries(uiCopy[locale].cats || {})) {
    if (!categoryTable.has(key)) categoryTable.set(key, new Map());
    categoryTable.get(key).set(locale, value);
  }
}

/**
 * Three categories were filed under two keys each, and the two copies were
 * not always the same words. The site therefore showed one category two ways
 * depending on which cell asked for it — "Campus Intelligence" came out as
 * 캠퍼스 인텔리전스 on one card and 캠퍼스 지능 on another.
 *
 * The survivor is the one that matches the house style: every other
 * intelligence category in every language uses 인텔리전스, インテリジェンス
 * and "Tình báo". Fieldwork Book keeps the literal reading of "fieldwork"
 * rather than the later drift into "field record".
 */
const CATEGORY_ALIASES = {
  c39: 'c03', // National Programme — the two copies were identical
  c49: 'c13', // Campus Intelligence — c13 matches the house style
  c48: 'c38', // Fieldwork Book — c38 is the literal reading
};
const canonicalKey = (key) => CATEGORY_ALIASES[key] || key;

const keyByEnglish = new Map();
for (const [key, byLocale] of categoryTable) {
  const english = byLocale.get('en');
  if (english === undefined) continue;
  const canonical = canonicalKey(key);
  if (canonical !== key) continue;
  if (!keyByEnglish.has(english)) keyByEnglish.set(english, key);
}
let nextCategoryNumber = 1;
for (const key of categoryTable.keys()) {
  const number = Number(String(key).replace(/^c/, ''));
  if (Number.isFinite(number)) nextCategoryNumber = Math.max(nextCategoryNumber, number + 1);
}

// ── assemble every system ──────────────────────────────────────────────────
const ordered = [];
for (const cluster of CLUSTER_MARKERS) {
  for (const system of bookSystems) {
    if (system.cluster === cluster.key) ordered.push(system);
  }
}
for (const system of bookSystems) {
  if (!CLUSTER_MARKERS.some((c) => c.key === system.cluster)) {
    note('cluster', `${system.id} sits in an unknown cluster "${system.cluster}"`);
    ordered.push(system);
  }
}

const categories = {};
const records = [];

for (const book of ordered) {
  const card = cardsById.get(book.id);
  if (!card) { note('missing-card', `${book.id} is in the reading room but has no cell on the main site`); continue; }

  const panelsKey = card.ledeKey;
  const copy = {};

  for (const locale of SITE_LOCALES) {
    const table = uiCopy[locale] || {};
    const panel = { ...(table.panels || {})[panelsKey] || {} };
    const bookLocale = (bookI18n.systems?.[locale] || {})[book.id] || {};

    // The category comes from the shared table, or from the panel for the few
    // systems that kept it there.
    const categoryKeyInPanel = panel.cat;
    const categoryFrom = categoryKeyInPanel !== undefined ? 'panel'
      : bookLocale.cat !== undefined ? 'book' : 'fallback';
    delete panel.cat;

    // The name: the panel's own, or the reading room's translation.
    if (!panel.name) panel.name = bookLocale.name ?? book.name;

    // The lede and the call to action.
    panel.lede = panel.lede ?? bookLocale.lede ?? book.lede;
    panel.cta = panel.cta ?? bookLocale.cta ?? book.cta;

    if (locale === 'en' && book.lede && panel.lede !== book.lede) {
      note('copy', `${book.id}: the cell and the reading room catalogue state different English descriptions`);
    }
    if (locale === 'en' && book.cta && panel.cta !== book.cta) {
      note('copy', `${book.id}: the cell says "${panel.cta}", the reading room catalogue says "${book.cta}"`);
    }
    copy[locale] = { ...panel, cat: categoryKeyInPanel ?? bookLocale.cat ?? book.cat };
    copy[locale].__from = categoryFrom;
  }

  // One category key per system. A cell that names a shared key keeps it;
  // a cell that kept its category in its own copy block is given one.
  const englishCategory = copy.en.cat;
  const ownKey = card.catKey && card.catKey.startsWith('cats.')
    ? canonicalKey(card.catKey.slice('cats.'.length))
    : null;
  let catKey = ownKey || keyByEnglish.get(englishCategory);
  if (!catKey) {
    catKey = `c${String(nextCategoryNumber++).padStart(2, '0')}`;
    keyByEnglish.set(englishCategory, catKey);
    note('category', `new category key ${catKey} for "${englishCategory}"`);
  }
  if (!categories[catKey]) categories[catKey] = {};
  for (const locale of SITE_LOCALES) {
    const shared = categoryTable.get(canonicalKey(catKey))?.get(locale);
    const own = copy[locale].cat;
    if (shared !== undefined && shared !== own && copy[locale].__from !== 'fallback') {
      note('category', `${catKey}: "${book.id}" says "${own}" in ${locale}, the shared table says "${shared}"`);
    }
    // The shared table wins: it is what most cells ask for, and it is the
    // one the translation gate reads.
    categories[catKey][locale] = shared !== undefined ? shared : own;
  }

  // Status: the two surfaces use different words for the same state.
  const bookState = BOOK_STATUS_TO_STATE[book.status] || null;
  const siteState = card.statusKey
    ? (SITE_STATUS_TO_STATE[card.statusKey] || (card.statusKey.startsWith('panels.') ? 'gated' : null))
    : null;
  if (bookState && siteState && bookState !== siteState) {
    note('status', `${book.id}: the main site says "${card.statusKey}", the reading room says "${book.status}" — the reading room's is kept`);
  }
  const status = bookState || siteState || 'live';

  const image = {
    src: card.img || book.img || null,
    webp: card.webp || null,
    // The alt text is read out of markup, so it arrives escaped. The source of
    // truth holds the words; the generator escapes them again on the way out.
    alt: card.alt ? unescapeHtml(card.alt) : (book.alt || null),
    width: card.width ? Number(card.width) : null,
    height: card.height ? Number(card.height) : null,
    crop: card.crop || null,
  };

  // The architecture block, which the two surfaces also hold twice.
  const arch = book.arch ? { ...book.arch } : null;
  const siteArch = architectures[book.id] || null;
  if (arch && siteArch) {
    const meaningful = (value) => value !== '' && value !== null && value !== undefined
      && !(Array.isArray(value) && value.length === 0);
    const bookShape = {};
    for (const [key, value] of Object.entries(arch)) if (meaningful(value)) bookShape[key] = value;
    const siteShape = { ...siteArch };
    delete siteShape.name;
    delete siteShape.idx;
    if (JSON.stringify(bookShape) !== JSON.stringify(siteShape)) {
      note('architecture', `${book.id}: the main site and the reading room hold different architecture data — the reading room's is kept`);
    }
    if (siteArch.name) arch.name = siteArch.name;
    if (siteArch.idx) arch.idx = siteArch.idx;
  } else if (siteArch && !arch) {
    arch = { ...siteArch };
    delete arch.name;
    delete arch.idx;
    note('architecture', `${book.id}: the main site holds architecture data the reading room does not`);
  }

  const edition = card.editionHref
    ? { href: card.editionHref, key: card.editionKey }
    : null;

  for (const locale of SITE_LOCALES) delete copy[locale].__from;

  records.push({
    id: book.id,
    cluster: book.cluster,
    idx: String(book.idx),
    panelsKey,
    catKey,
    status,
    statusLabel: BOOK_STATUS_WORD[status],
    href: card.href ?? book.href ?? '',
    domId: card.domId,
    variant: card.variant,
    edition,
    image,
    arch,
    copy,
  });
}

// ── the reading room's own plates, as named fields ─────────────────────────
const plateRecords = {};
for (const [id, value] of Object.entries(bookPlates)) {
  if (!Array.isArray(value) || value.length !== PLATE_FIELDS.length) {
    note('plate', `${id} does not hold the expected ${PLATE_FIELDS.length} fields`);
    continue;
  }
  const record = {};
  PLATE_FIELDS.forEach((field, index) => { record[field] = value[index]; });
  plateRecords[id] = record;
}

// ── the e-books ────────────────────────────────────────────────────────────
const ebooksSource = runBrowserScript(readCommitted('axiomx/ebooks.js'), 'AXIOM_EBOOKS');
const ebookRecords = ebooksSource.map((book) => ({
  id: book.id,
  name: book.name,
  cat: book.cat,
  lede: book.lede,
  href: book.href,
  img: book.img,
  alt: book.alt,
  status: book.status,
  cta: book.cta,
  edition: book.edition,
  arch: book.arch,
}));

// ── the cluster counts, with their numbers turned into placeholders ────────
// The site says how big the catalogue is in four places per language. Those
// numbers were typed by hand, which is how a catalogue of 80 ends up
// claiming to be 79. They are placeholders now; the generator fills them in.
const CLUSTER_COUNT_KEYS = {
  command: 'City Dashboards',
  intelligence: 'Intelligence',
  civic: 'Civic',
  emerging: 'Emerging',
  lab: 'Lab',
};
const clusterCounts = {};
for (const system of records) clusterCounts[system.cluster] = (clusterCounts[system.cluster] || 0) + 1;

const markNumbers = (text, replacements) => {
  let index = 0;
  return String(text).replace(/\d+/g, () => (index < replacements.length ? replacements[index++] : ''));
};

const clusterMeta = {};
for (const locale of SITE_LOCALES) {
  const table = uiCopy[locale].sysClusters || {};
  const entry = {};
  entry.sysMeta = markNumbers(table.sysMeta || '', ['{count}', '{countries}']);
  for (const [key, cluster] of Object.entries(CLUSTER_COUNT_KEYS)) {
    entry[key] = table[key];
    entry[`${key}Meta`] = markNumbers(table[`${key}Meta`] || '', ['{count}']);
  }
  clusterMeta[locale] = entry;
}

// ── the proof line, with its numbers turned into placeholders ──────────────
const proofLines = {};
for (const locale of SITE_LOCALES) {
  const line = release[locale]?.proofLine;
  if (!line) { note('proof', `${locale} has no proof line`); continue; }
  const catalogueSize = String(ordered.length);
  proofLines[locale] = line
    .replace(new RegExp(`\\b${catalogueSize}\\b`), '{count}')
    .replace(new RegExp(`\\b${String(5)}\\b`), '{countries}');
  if (!proofLines[locale].includes('{count}') || !proofLines[locale].includes('{countries}')) {
    note('proof', `${locale}: could not mark the proof line's numbers — "${line}"`);
    proofLines[locale] = line;
  }
}

// ── report ──────────────────────────────────────────────────────────────────
console.log('=== what the artefacts hold today ===');
console.log(`  main-site cells          : ${cells.length} (${cards.length} systems, ${cells.length - cards.length} brand plates)`);
console.log(`  cell shapes              : ${Object.entries(cards.reduce((acc, c) => { acc[c.variant] = (acc[c.variant] || 0) + 1; return acc; }, {})).map(([k, v]) => `${k}:${v}`).join(' ')}`);
console.log(`  reading-room systems     : ${bookSystems.length}`);
console.log(`  reading-room e-books     : ${ebookRecords.length}`);
console.log(`  reading-room plates      : ${Object.keys(plateRecords).length}`);
console.log(`  category keys            : ${Object.keys(categories).length}`);
console.log(`  locales                  : ${SITE_LOCALES.length} on the site, ${BOOK_LOCALES.length} in the book`);

const kinds = [...new Set(notes.map((n) => n.kind))];
console.log('\n=== disagreements found ===');
for (const kind of kinds) {
  const list = notes.filter((n) => n.kind === kind);
  console.log(`\n  ${kind} (${list.length})`);
  for (const item of list.slice(0, 24)) console.log(`    ${item.message}`);
  if (list.length > 24) console.log(`    … and ${list.length - 24} more`);
}

if (dryRun) {
  console.log('\nDry run: nothing written.');
  process.exit(0);
}

// The source of truth is hand-edited once it exists — a translator fixes a
// name in it and the fix must survive the next run of this script. So the
// migration refuses to write over it.
if (fs.existsSync(path.join(process.cwd(), SOURCE)) && !force) {
  console.error(`\nREFUSING — ${SOURCE} already exists.`);
  console.error('It is the source of truth now and is edited by hand.');
  console.error('Delete it deliberately, or pass --force, to migrate again.');
  process.exit(1);
}

const payload = {
  $schema: 'axiom/catalogue/v1',
  locales: SITE_LOCALES,
  bookLocales: BOOK_LOCALES,
  clusters: CLUSTER_MARKERS,
  countries: 5,
  statusVocabulary,
  clusterMeta,
  clusterCounts,
  proofLines,
  systems: records,
};

write('data/catalogue/systems.json', canonicalJSON(payload));
write('data/catalogue/categories.json', canonicalJSON(categories));
write('data/catalogue/plates.json', canonicalJSON(plateRecords));
write('data/catalogue/ebooks.json', canonicalJSON(ebookRecords));
console.log('\nWrote data/catalogue/{systems,categories,plates,ebooks}.json');
