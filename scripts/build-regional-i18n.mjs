#!/usr/bin/env node
/**
 * Build KO / JA / VI locale objects from ZH + EN flat maps.
 * Run: node scripts/build-regional-i18n.mjs
 */
import fs from 'fs';
import vm from 'vm';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function loadMergedUiCopy() {
  const code = fs.readFileSync(path.join(root, 'public/app.js'), 'utf8');
  const slice = code.split('// Merge i18nExt into uiCopy')[0]
    + '\nconst i18nExt2 = '
    + code.split('const i18nExt2 = ')[1].split('Object.keys(i18nExt2)')[0];
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(slice + '\nthis.result = { uiCopy, i18nExt, i18nExt2 };', ctx);
  const { uiCopy, i18nExt, i18nExt2 } = ctx.result;
  Object.keys(i18nExt).forEach((l) => {
    if (uiCopy[l]) Object.assign(uiCopy[l], i18nExt[l]);
  });
  Object.keys(i18nExt2).forEach((l) => {
    if (uiCopy[l]) Object.assign(uiCopy[l], i18nExt2[l]);
  });
  return uiCopy;
}

function flatten(obj, prefix = '') {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(out, flatten(v, key));
    else out[key] = v;
  }
  return out;
}

function unflatten(flat) {
  const out = {};
  for (const [key, value] of Object.entries(flat)) {
    const parts = key.split('.');
    let cur = out;
    parts.forEach((p, i) => {
      if (i === parts.length - 1) cur[p] = value;
      else cur = cur[p] ||= {};
    });
  }
  return out;
}

function loadKeyMap(name) {
  const p = path.join(__dirname, 'maps', `${name}-by-key.json`);
  if (!fs.existsSync(p)) throw new Error(`Missing map: ${p}`);
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function applyKeyMap(baseFlat, map) {
  const out = {};
  for (const key of Object.keys(baseFlat)) {
    if (map[key] === undefined) throw new Error(`Missing translation for key: ${key}`);
    out[key] = map[key];
  }
  return out;
}

const uiCopy = loadMergedUiCopy();
const enFlat = flatten(uiCopy.en);
const zhFlat = flatten(uiCopy.zh);

// Add missing keys to en/zh base before regional build
const extra = {
  'sysClusters.sysMeta': '21 systems · 5 countries',
  'panels.p23.lede': 'The official Smart City Thailand Index (SCITI) evaluating the progress and impact of 174 urban areas across the country based on the 7 Smart City pillars.',
  'panels.p23.cta': 'Open live system',
};
Object.assign(enFlat, extra);

const zhExtra = {
  'sysClusters.sysMeta': '21 个系统 · 5 个国家',
  'panels.p23.lede': '泰国官方智慧城市指数（SCITI）依据七大智慧城市支柱，评估全国174个城市区域的进展与影响。',
  'panels.p23.cta': '打开在线系统',
};
Object.assign(zhFlat, zhExtra);

const koFlat = applyKeyMap(enFlat, loadKeyMap('ko'));
const jaFlat = applyKeyMap(enFlat, loadKeyMap('ja'));
const viFlat = applyKeyMap(enFlat, loadKeyMap('vi'));

// Key-level overrides for meta keys that must stay English labels in some locales
['ko', 'ja', 'vi'].forEach((loc) => {
  const flat = loc === 'vi' ? viFlat : loc === 'ja' ? jaFlat : koFlat;
  if (flat['metaKeys.AI']) flat['metaKeys.AI'] = 'AI';
});

const regional = {
  ko: unflatten(koFlat),
  ja: unflatten(jaFlat),
  vi: unflatten(viFlat),
};

// Patch app.js: inject into uiCopy, i18nExt, i18nExt2 by splitting regional trees
function splitRegional(locale) {
  const uiKeys = new Set(Object.keys(uiCopy.en));
  const extKeys = new Set(Object.keys(i18nExt.en));
  const ext2Keys = new Set(Object.keys(i18nExt2.en));
  const flat = flatten(locale);
  const ui = {};
  const ext = {};
  const ext2 = {};
  for (const [k, v] of Object.entries(flat)) {
    const top = k.split('.')[0];
    if (uiKeys.has(top)) Object.assign(ui, unflatten({ [k]: v }));
    else if (extKeys.has(top)) Object.assign(ext, unflatten({ [k]: v }));
    else if (ext2Keys.has(top)) Object.assign(ext2, unflatten({ [k]: v }));
  }
  return { ui, ext, ext2 };
}

// Write regional bootstrap file
const bootstrap = `/* AXIOM regional locales — KO, JA, VI (generated) */
(function (global) {
  global.AXIOM_REGIONAL_LOCALES = ${JSON.stringify(regional, null, 2)};
})(typeof window !== 'undefined' ? window : global);
`;
fs.writeFileSync(path.join(root, 'public/i18n-regional.js'), bootstrap);

// Patch en/th/zh missing keys in app.js
let appJs = fs.readFileSync(path.join(root, 'public/app.js'), 'utf8');

const sysMetaEn = "      sysMeta: '21 systems · 5 countries',";
if (!appJs.includes('sysClusters')) {
  appJs = appJs.replace(
    '    misc: { swipeHint:',
    "    sysClusters: {\n      sysMeta: '21 systems · 5 countries',\n    },\n    misc: { swipeHint:",
  );
}

const p23En = `      p23: {
        lede: 'The official Smart City Thailand Index (SCITI) evaluating the progress and impact of 174 urban areas across the country based on the 7 Smart City pillars.',
        cta: 'Open live system',
      },`;
if (!appJs.includes('p23:')) {
  appJs = appJs.replace(
    '      p24: {',
    `${p23En}\n      p24: {`,
  );
}

// th/zh p23 and sysClusters in i18nExt2
const thSysPatch = "    sysClusters: { sysMeta: '21 ระบบ · 5 ประเทศ' },";
if (!appJs.includes("sysMeta: '21 ระบบ")) {
  appJs = appJs.replace(
    '    misc: { swipeHint:\'4 กลุ่ม',
    `${thSysPatch}\n    misc: { swipeHint:'4 กลุ่ม`,
  );
}

const zhSysPatch = "    sysClusters: { sysMeta: '21 个系统 · 5 个国家' },";
if (!appJs.includes("sysMeta: '21 个系统")) {
  appJs = appJs.replace(
    '    misc: { swipeHint:\'4 组',
    `${zhSysPatch}\n    misc: { swipeHint:'4 组`,
  );
}

if (!appJs.includes('panels.p23') && !appJs.includes('p23:')) {
  // already handled in en panels
}

// th p23 in panels
if (!appJs.includes('p23:') || !appJs.match(/th:[\s\S]*?p23:/)) {
  const thP23 = `      p23: {
        lede: 'ดัชนีเมืองอัจฉริยะไทยอย่างเป็นทางการ (SCITI) ประเมินความคืบหน้าและผลกระทบของ 174 พื้นที่เมืองทั่วประเทศตาม 7 เสาหลักเมืองอัจฉริยะ',
        cta: 'เปิดระบบสด',
      },`;
  if (!appJs.includes('p23:')) {
    appJs = appJs.replace(/(  th: \{[\s\S]*?)(      p24: \{)/, `$1${thP23}\n$2`);
  }
}

if (!appJs.includes('泰国官方智慧城市指数')) {
  const zhP23 = `      p23: {
        lede: '泰国官方智慧城市指数（SCITI）依据七大智慧城市支柱，评估全国174个城市区域的进展与影响。',
        cta: '打开在线系统',
      },`;
  appJs = appJs.replace(/(  zh: \{[\s\S]*?panels: \{[\s\S]*?)(      p24: \{)/, `$1${zhP23}\n$2`);
}

// Merge regional into app.js uiCopy
if (!appJs.includes('AXIOM_REGIONAL_LOCALES')) {
  appJs = appJs.replace(
    'Object.keys(i18nExt2).forEach(locale => {',
    `// Regional locales (KO, JA, VI)
if (typeof window !== 'undefined' && window.AXIOM_REGIONAL_LOCALES) {
  Object.assign(uiCopy, window.AXIOM_REGIONAL_LOCALES);
}

Object.keys(i18nExt2).forEach(locale => {`,
  );
}

// lang attribute map
if (!appJs.includes('LOCALE_HTML_LANG')) {
  appJs = appJs.replace(
    '  document.documentElement.lang = activeLocale;',
    `  const LOCALE_HTML_LANG = { en: 'en', th: 'th', zh: 'zh-Hans', ko: 'ko', ja: 'ja', vi: 'vi', ts: 'en' };
  document.documentElement.lang = LOCALE_HTML_LANG[activeLocale] || activeLocale;`,
  );
}

fs.writeFileSync(path.join(root, 'public/app.js'), appJs);

// Verify
const html = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
const htmlKeys = [...new Set([...html.matchAll(/data-i18n(?:-html)?="([^"]+)"/g)].map((m) => m[1]))];
for (const loc of ['ko', 'ja', 'vi']) {
  const flat = flatten(regional[loc]);
  const missing = htmlKeys.filter((k) => !(k in flat));
  console.log(`${loc}: ${Object.keys(flat).length} keys, missing html: ${missing.length}`);
  if (missing.length) console.log('  ', missing.join(', '));
}

console.log('Wrote public/i18n-regional.js and patched public/app.js');
