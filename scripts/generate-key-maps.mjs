#!/usr/bin/env node
/**
 * Generate ko-by-key.json, ja-by-key.json, vi-by-key.json from en/zh flat + section bundles.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mapsDir = path.join(__dirname, 'maps');
fs.mkdirSync(mapsDir, { recursive: true });

const enFlat = JSON.parse(fs.readFileSync('/tmp/axiom-en-flat.json', 'utf8'));
const zhFlat = JSON.parse(fs.readFileSync('/tmp/axiom-zh-flat.json', 'utf8'));

const extra = {
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
Object.assign(enFlat, {
  'sysClusters.sysMeta': '21 systems · 5 countries',
  'panels.p23.lede': extra['panels.p23.lede'].vi.replace(/^Chỉ số.*$/, 'The official Smart City Thailand Index (SCITI) evaluating the progress and impact of 174 urban areas across the country based on the 7 Smart City pillars.'),
  'panels.p23.cta': 'Open live system',
});
enFlat['panels.p23.lede'] = 'The official Smart City Thailand Index (SCITI) evaluating the progress and impact of 174 urban areas across the country based on the 7 Smart City pillars.';

// Load per-locale bundles (key -> value)
const bundles = ['ko', 'ja', 'vi'].map((loc) => {
  const p = path.join(__dirname, 'bundles', `${loc}.json`);
  if (!fs.existsSync(p)) throw new Error(`Missing bundle: ${p}`);
  return [loc, JSON.parse(fs.readFileSync(p, 'utf8'))];
});

for (const [loc, bundle] of bundles) {
  const out = {};
  const source = loc === 'vi' ? enFlat : zhFlat;
  for (const key of Object.keys(enFlat)) {
    if (extra[key]) out[key] = extra[key][loc];
    else if (bundle[key] !== undefined) out[key] = bundle[key];
    else throw new Error(`Missing ${loc} translation for key: ${key}`);
  }
  fs.writeFileSync(path.join(mapsDir, `${loc}-by-key.json`), JSON.stringify(out));
  console.log(`${loc}: ${Object.keys(out).length} keys`);
}
