import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script, runInNewContext } from 'node:vm';
import { execFileSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(join(root, path), 'utf8');
const html = read('public/index.html');
const app = read('public/app.js');

test('full current page and interactive surfaces are preserved', () => {
  assert.ok(html.split('\n').length > 2400);
  for (const id of ['heroMap', 'heroCanvas', 'satHud', 'heroRotatingText', 'heroNodeRail', 'mapModeBtn']) {
    assert.ok(html.includes(`id="${id}"`), id);
  }
  for (const content of ['SCSE_2026_TPE', 'shanghai-keynote.jpg', '58 systems', 'data-arch="malaysia"', 'data-arch="carbon"']) {
    assert.ok(html.includes(content), content);
  }
  assert.doesNotMatch(html, /DO NOT MERGE|<<<<<<<|>>>>>>>/);
});

test('local styles and all font binaries exist; no Google Fonts dependency', () => {
  assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
  assert.match(html, /fonts\.css\?v=20261001a/);
  assert.ok(html.indexOf('font-stack.css') > html.indexOf('rams.css'));
  for (const match of read('public/fonts.css').matchAll(/url\('(fonts\/[^']+)'\)/g)) {
    const bytes = readFileSync(join(root, 'public', match[1]));
    assert.equal(bytes.subarray(0, 4).toString(), 'wOF2');
    assert.equal(bytes.readUInt32BE(8), bytes.length);
  }
  for (const name of ['OFL-IBM-Plex.txt', 'OFL-Noto-Sans-KR.txt']) {
    assert.match(read(`public/fonts/${name}`), /SIL OPEN FONT LICENSE|SIL Open Font License/);
  }
});

test('local page references resolve', () => {
  for (const [, url] of html.matchAll(/(?:src|href)="([^"#][^"]*)"/g)) {
    if (/^(https?:|mailto:|tel:|data:)/.test(url)) continue;
    const path = decodeURIComponent(url.split(/[?#]/)[0]).replace(/^\//, '');
    assert.ok(existsSync(join(root, 'public', path)), path);
  }
});

test('JavaScript and inline scripts parse', () => {
  new Script(app);
  new Script(read('public/i18n-regional.js'));
  for (const [, attrs, script] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (attrs.includes('application/ld+json')) JSON.parse(script);
    else new Script(script);
  }
});

test('FloodDash target and degraded labels survive all seven locales', () => {
  assert.doesNotMatch(html + app, /flood-ami\.pages\.dev/);
  assert.match(html, /data-arch="scth"[\s\S]*?sysStatus\.degraded/);
  const ext = app.slice(app.indexOf('const i18nExt2 ='), app.indexOf('const i18nPitch ='));
  const dictionaries = runInNewContext(ext + '; i18nExt2', { uiCopy: {} });
  for (const locale of ['en', 'th', 'zh', 'ts']) assert.ok(dictionaries[locale].sysStatus.degraded, locale);
  const window = {};
  runInNewContext(read('public/i18n-regional.js'), { window });
  for (const locale of ['ko', 'ja', 'vi']) assert.ok(window.AXIOM_REGIONAL_LOCALES[locale].sysStatus.degraded, locale);
});

test('font helper rerun cannot overwrite the recovered HTML', () => {
  execFileSync(process.execPath, ['scripts/fetch-fonts.mjs'], { cwd: root });
  assert.equal(read('public/index.html'), html);
});
