#!/usr/bin/env node
/**
 * Build full ko/ja/vi locale bundles: HTML keys translated; legacy keys from en (stored in locale object).
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function loadMerged() {
  const code = fs.readFileSync(path.join(root, 'public/app.js'), 'utf8');
  const slice = code.split('// Merge i18nExt into uiCopy')[0]
    + '\nconst i18nExt2 = '
    + code.split('const i18nExt2 = ')[1].split('Object.keys(i18nExt2)')[0];
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(slice + '\nthis.result = { uiCopy, i18nExt, i18nExt2 };', ctx);
  const { uiCopy, i18nExt, i18nExt2 } = ctx.result;
  Object.keys(i18nExt).forEach((l) => { if (uiCopy[l]) Object.assign(uiCopy[l], i18nExt[l]); });
  Object.keys(i18nExt2).forEach((l) => { if (uiCopy[l]) Object.assign(uiCopy[l], i18nExt2[l]); });
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

const uiCopy = loadMerged();
const enFlat = flatten(uiCopy.en);
const zhFlat = flatten(uiCopy.zh);

const htmlKeys = JSON.parse(fs.readFileSync(path.join(__dirname, 'html-keys.json'), 'utf8'));

// Load partial HTML translations; merge with generated remainder from zh/en references
const koHtml = JSON.parse(fs.readFileSync(path.join(__dirname, 'html-ko.json'), 'utf8'));
const jaHtml = JSON.parse(fs.readFileSync(path.join(__dirname, 'html-ja.json'), 'utf8'));
const viHtml = JSON.parse(fs.readFileSync(path.join(__dirname, 'html-vi.json'), 'utf8'));

function buildLocale(htmlMap, baseFlat) {
  const out = { ...baseFlat };
  for (const key of htmlKeys) {
    if (htmlMap[key] !== undefined) out[key] = htmlMap[key];
  }
  return out;
}

const koFlat = buildLocale(koHtml, enFlat);
const jaFlat = buildLocale(jaHtml, enFlat);
const viFlat = buildLocale(viHtml, enFlat);

// extras
const extras = {
  'sysClusters.sysMeta': { ko: '21개 시스템 · 5개국', ja: '21システム · 5か国', vi: '21 hệ thống · 5 quốc gia' },
  'panels.p23.lede': {
    ko: '태국 공식 스마트시티 지수(SCITI). 7대 스마트시티 기둥에 따라 전국 174개 도시권의 진행 상황과 영향을 평가합니다.',
    ja: 'タイ公式スマートシティ指数（SCITI）。7つのスマートシティ基準に基づき、全国174の都市圏の進捗と影響を評価します。',
    vi: 'Chỉ số Thành phố Thông minh Thái Lan chính thức (SCITI) đánh giá tiến độ và tác động của 174 khu đô thị trên cả nước theo 7 trụ cột thành phố thông minh.',
  },
  'panels.p23.cta': { ko: '라이브 시스템 열기', ja: 'ライブシステムを開く', vi: 'Mở hệ thống trực tiếp' },
};
for (const [k, v] of Object.entries(extras)) {
  koFlat[k] = v.ko;
  jaFlat[k] = v.ja;
  viFlat[k] = v.vi;
}

const regional = {
  ko: unflatten(koFlat),
  ja: unflatten(jaFlat),
  vi: unflatten(viFlat),
};

fs.mkdirSync(path.join(root, 'scripts/maps'), { recursive: true });
fs.writeFileSync(path.join(root, 'scripts/maps/ko-by-key.json'), JSON.stringify(koFlat));
fs.writeFileSync(path.join(root, 'scripts/maps/ja-by-key.json'), JSON.stringify(jaFlat));
fs.writeFileSync(path.join(root, 'scripts/maps/vi-by-key.json'), JSON.stringify(viFlat));

const bootstrap = `/* AXIOM regional locales — KO, JA, VI */
(function (global) {
  global.AXIOM_REGIONAL_LOCALES = ${JSON.stringify(regional, null, 2)};
})(typeof window !== 'undefined' ? window : global);
`;
fs.writeFileSync(path.join(root, 'public/i18n-regional.js'), bootstrap);

// Verify HTML coverage
for (const loc of ['ko', 'ja', 'vi']) {
  const flat = loc === 'ko' ? koFlat : loc === 'ja' ? jaFlat : viFlat;
  const missing = htmlKeys.filter((k) => !flat[k] || flat[k] === enFlat[k]);
  const untranslated = htmlKeys.filter((k) => flat[k] === enFlat[k]);
  console.log(`${loc}: ${Object.keys(flat).length} keys, html still English: ${untranslated.length}`);
  if (untranslated.length) console.log('  sample:', untranslated.slice(0, 10).join(', '));
}

console.log('Wrote public/i18n-regional.js');
