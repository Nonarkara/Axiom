#!/usr/bin/env node
/**
 * Finish KO / JA / VI regional locales: HTML translations + i18n-regional.js + app.js wiring.
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

const uiCopy = loadMergedUiCopy();
const enFlat = flatten(uiCopy.en);
const zhFlat = flatten(uiCopy.zh);

// HTML keys from index.html
const html = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
const htmlKeys = [...new Set([...html.matchAll(/data-i18n(?:-html)?="([^"]+)"/g)].map((m) => m[1]))];
fs.writeFileSync(path.join(__dirname, 'html-keys.json'), JSON.stringify(htmlKeys, null, 2) + '\n');

const koHtml = JSON.parse(fs.readFileSync(path.join(__dirname, 'html-ko.json'), 'utf8'));
const jaHtml = JSON.parse(fs.readFileSync(path.join(__dirname, 'html-ja.json'), 'utf8'));
const viHtml = JSON.parse(fs.readFileSync(path.join(__dirname, 'html-vi.json'), 'utf8'));

function buildLocale(htmlMap, loc) {
  const out = { ...enFlat };
  for (const key of htmlKeys) {
    if (htmlMap[key] !== undefined) out[key] = htmlMap[key];
    else throw new Error(`Missing ${loc} translation for HTML key: ${key}`);
  }
  // extras not always in html
  const extras = {
    'sysClusters.sysMeta': {
      ko: '21개 시스템 · 5개국',
      ja: '21システム · 5か国',
      vi: '21 hệ thống · 5 quốc gia',
    },
    'panels.p23.lede': {
      ko: '태국 공식 스마트시티 지수(SCITI). 7대 스마트시티 기둥에 따라 전국 174개 도시권의 진행 상황과 영향을 평가합니다.',
      ja: 'タイ公式スマートシティ指数（SCITI）。7つのスマートシティ基準に基づき、全国174の都市圏の進捗と影響を評価します。',
      vi: 'Chỉ số Thành phố Thông minh Thái Lan chính thức (SCITI) đánh giá tiến độ và tác động của 174 khu đô thị trên cả nước theo 7 trụ cột thành phố thông minh.',
    },
    'panels.p23.cta': {
      ko: '라이브 시스템 열기',
      ja: 'ライブシステムを開く',
      vi: 'Mở hệ thống trực tiếp',
    },
  };
  for (const [k, v] of Object.entries(extras)) {
    if (v[loc]) out[k] = v[loc];
  }
  if (loc === 'vi') {
    // VI uses EN base for legacy off-page keys; translate high-traffic legacy from ZH where available
    for (const key of Object.keys(zhFlat)) {
      if (!htmlKeys.includes(key) && zhFlat[key] && typeof zhFlat[key] === 'string') {
        // keep en for deep legacy — visible page uses htmlKeys only
      }
    }
  }
  return out;
}

const koFlat = buildLocale(koHtml, 'ko');
const jaFlat = buildLocale(jaHtml, 'ja');
const viFlat = buildLocale(viHtml, 'vi');

['ko', 'ja', 'vi'].forEach((loc) => {
  const flat = loc === 'ko' ? koFlat : loc === 'ja' ? jaFlat : viFlat;
  if (flat['metaKeys.AI']) flat['metaKeys.AI'] = 'AI';
});

const regional = {
  ko: unflatten(koFlat),
  ja: unflatten(jaFlat),
  vi: unflatten(viFlat),
};

fs.mkdirSync(path.join(__dirname, 'maps'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'maps/ko-by-key.json'), JSON.stringify(koFlat));
fs.writeFileSync(path.join(__dirname, 'maps/ja-by-key.json'), JSON.stringify(jaFlat));
fs.writeFileSync(path.join(__dirname, 'maps/vi-by-key.json'), JSON.stringify(viFlat));

const bootstrap = `/* AXIOM regional locales — KO, JA, VI */
(function (global) {
  global.AXIOM_REGIONAL_LOCALES = ${JSON.stringify(regional, null, 2)};
})(typeof window !== 'undefined' ? window : global);
`;
fs.writeFileSync(path.join(root, 'public/i18n-regional.js'), bootstrap);

// Patch app.js
let appJs = fs.readFileSync(path.join(root, 'public/app.js'), 'utf8');

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

if (!appJs.includes('LOCALE_HTML_LANG')) {
  appJs = appJs.replace(
    '  document.documentElement.lang = activeLocale;',
    `  const LOCALE_HTML_LANG = { en: 'en', th: 'th', zh: 'zh-Hans', ko: 'ko', ja: 'ja', vi: 'vi', ts: 'en' };
  document.documentElement.lang = LOCALE_HTML_LANG[activeLocale] || activeLocale;`,
  );
}

// No EN fallback for regional locales in lookup
if (!appJs.includes('REGIONAL_LOCALES')) {
  appJs = appJs.replace(
    `function renderStaticCopy() {
  const copy = uiCopy[activeLocale] || uiCopy.en;
  const fallback = uiCopy.en;
  document.documentElement.lang = activeLocale;
  const lookup = (key) => {
    const parts = key.split('.');
    const val = parts.reduce((obj, k) => obj?.[k], copy);
    if (typeof val === 'string') return val;
    return parts.reduce((obj, k) => obj?.[k], fallback);
  };`,
    `const REGIONAL_LOCALES = new Set(['ko', 'ja', 'vi']);

function renderStaticCopy() {
  const copy = uiCopy[activeLocale] || uiCopy.en;
  const fallback = REGIONAL_LOCALES.has(activeLocale) ? copy : uiCopy.en;
  const LOCALE_HTML_LANG = { en: 'en', th: 'th', zh: 'zh-Hans', ko: 'ko', ja: 'ja', vi: 'vi', ts: 'en' };
  document.documentElement.lang = LOCALE_HTML_LANG[activeLocale] || activeLocale;
  const lookup = (key) => {
    const parts = key.split('.');
    const val = parts.reduce((obj, k) => obj?.[k], copy);
    if (typeof val === 'string') return val;
    if (REGIONAL_LOCALES.has(activeLocale)) return undefined;
    return parts.reduce((obj, k) => obj?.[k], fallback);
  };`,
  );
}

fs.writeFileSync(path.join(root, 'public/app.js'), appJs);

// Patch index.html to load i18n-regional.js before app.js
let indexHtml = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
if (!indexHtml.includes('i18n-regional.js')) {
  indexHtml = indexHtml.replace(
    '<script defer src="app.js',
    '<script defer src="i18n-regional.js?v=20260626"></script>\n  <script defer src="app.js',
  );
  fs.writeFileSync(path.join(root, 'public/index.html'), indexHtml);
}

// Verify
for (const loc of ['ko', 'ja', 'vi']) {
  const flat = loc === 'ko' ? koFlat : loc === 'ja' ? jaFlat : viFlat;
  const missing = htmlKeys.filter((k) => !(k in flat) || !flat[k]);
  const stillEn = htmlKeys.filter((k) => flat[k] === enFlat[k]);
  console.log(`${loc}: ${Object.keys(flat).length} total keys, html missing: ${missing.length}, html still EN: ${stillEn.length}`);
  if (missing.length) console.log('  missing:', missing.join(', '));
  if (stillEn.length) console.log('  still EN sample:', stillEn.slice(0, 5).join(', '));
}

console.log('Done: public/i18n-regional.js + app.js + index.html');
