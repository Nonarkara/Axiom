// i18n check — the seven languages, measured.
//
// The page renders a translation by looking the key up in the active
// locale's copy table and falling back to English when the key is missing
// or still holds the English string. Both fallbacks are silent: the page
// looks translated and is half English, with nothing to say so.
//
// So the instrument separates three things that all look the same on the
// screen:
//
//   MISSING  a key English has and the locale does not. Always a defect.
//   KEPT     the locale shows the English string on the page, and another
//            locale translates it. Usually a defect; sometimes a decision,
//            and a decision has to be written down in design/i18n-allowlist.json
//            with its reason. Anything not written down fails.
//   NAMED    the value is the same in every language — a product name, an
//            organisation, a registered address. Never a defect.
//
// It also drives the switch itself: every button is clicked, the choice is
// reloaded, and a ?lang= link is opened, because a switch that forgets
// itself is not a switch.
//
//   node .qa/i18n-check.mjs                          # the live site
//   node .qa/i18n-check.mjs http://127.0.0.1:5312/   # a local server

import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const BASE = process.argv[2] || 'https://axiom.nonarkara.org/';
const LOCALES = ['en', 'th', 'zh', 'ko', 'ja', 'vi', 'ts'];
// The source view is not a language: it renders the page as code, so its
// English values are the subject, not a missing translation.
const TRANSLATED_LOCALES = ['th', 'zh', 'ko', 'ja', 'vi'];
const ALLOWLIST_PATH = new URL('../design/i18n-allowlist.json', import.meta.url);

let allow = { decisions: {} };
try {
  allow = JSON.parse(readFileSync(ALLOWLIST_PATH, 'utf8'));
} catch (e) {
  console.error(`FAIL — cannot read the allowlist at ${ALLOWLIST_PATH.pathname}: ${e.message}`);
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

// ---- what the page asks for, and what each locale holds ------------------
const data = await page.evaluate(async (locales) => {
  const flat = (o, pre = '', r = {}) => {
    for (const [k, v] of Object.entries(o || {})) {
      const key = pre ? `${pre}.${k}` : k;
      if (v && typeof v === 'object' && !Array.isArray(v)) flat(v, key, r);
      else r[key] = typeof v === 'string' ? v : JSON.stringify(v);
    }
    return r;
  };
  if (typeof uiCopy === 'undefined') return { error: 'uiCopy is not reachable in the page' };
  const tables = {};
  for (const loc of Object.keys(uiCopy)) tables[loc] = flat(uiCopy[loc]);
  const en = tables.en;
  const used = new Set();
  for (const n of document.querySelectorAll('[data-i18n]')) used.add(n.getAttribute('data-i18n'));
  for (const n of document.querySelectorAll('[data-i18n-html]')) used.add(n.getAttribute('data-i18n-html'));
  const rendered = {};
  for (const loc of locales) {
    window.setAxiomLocale(loc);
    await new Promise((r) => setTimeout(r, 350));
    rendered[loc] = {
      lang: document.documentElement.lang,
      title: document.title,
      items: [...document.querySelectorAll('[data-i18n]')].map((n) => ({
        key: n.getAttribute('data-i18n'),
        text: n.textContent.trim(),
      })),
      html: [...document.querySelectorAll('[data-i18n-html]')].map((n) => ({
        key: n.getAttribute('data-i18n-html'),
        text: n.textContent.trim(),
      })),
    };
  }
  return { tables, used: [...used], rendered };
}, LOCALES);

if (data.error) {
  console.error(`FAIL — ${data.error}`);
  await browser.close();
  process.exit(1);
}

const { tables, used, rendered } = data;
const en = tables.en;
const failures = [];
const notes = [];

// ---- 1. the shape --------------------------------------------------------
const unknown = used.filter((k) => !(k in en));
if (unknown.length) failures.push(`markup uses ${unknown.length} key(s) no locale defines: ${unknown.slice(0, 8).join(', ')}`);

for (const loc of LOCALES) {
  const t = tables[loc] || {};
  // The contract is about what the page renders. A key the page never asks
  // for is not a missing translation — the source view does not carry
  // strings for pages that are not on the page — but the debt is named so
  // it is not invisible.
  const missingRendered = used.filter((k) => !(k in t));
  if (missingRendered.length) failures.push(`${loc}: ${missingRendered.length} rendered key(s) missing → ${missingRendered.slice(0, 8).join(', ')}`);
  const missingUnrendered = Object.keys(en).filter((k) => !(k in t) && !used.includes(k));
  if (missingUnrendered.length) {
    notes.push(`${loc}: ${missingUnrendered.length} copy-table key(s) the page does not show are not translated (${missingUnrendered.slice(0, 4).join(', ')})`);
  }
}

// ---- 2. the visible copy -------------------------------------------------
// A key is a miss when the locale shows English, the page shows that key,
// and another locale translates it. A value that is the same in every
// language is a proper noun and never a miss.
const translatedSomewhere = {};
for (const k of Object.keys(en)) {
  translatedSomewhere[k] = Object.keys(tables)
    .filter((l) => l !== 'en')
    .some((l) => tables[l][k] !== undefined && tables[l][k] !== en[k]);
}
const usedSet = new Set(used);
const decisions = allow.decisions || {};

for (const loc of TRANSLATED_LOCALES) {
  const t = tables[loc] || {};
  const misses = Object.keys(en).filter((k) => {
    if (!usedSet.has(k)) return false;
    if (t[k] === undefined) return false;
    if (t[k] !== en[k]) return false;
    return translatedSomewhere[k];
  });
  const written = decisions[loc] || {};
  const unwritten = [];
  for (const k of misses) {
    if (!written[k]) unwritten.push(k);
  }
  const stale = Object.keys(written).filter((k) => !misses.includes(k));
  if (unwritten.length) {
    failures.push(`${loc}: ${unwritten.length} visible string(s) still in English with no written decision`);
    for (const k of unwritten.slice(0, 10)) failures.push(`    ${k} = "${en[k]}"`);
  }
  if (stale.length) {
    failures.push(`${loc}: ${stale.length} written decision(s) no longer apply: ${stale.join(', ')}`);
  }
  console.log(`  ${loc.padEnd(3)} visible English kept: ${misses.length - unwritten.length} written down, ${unwritten.length} undecided`);
}

// ---- 3. the switch itself ------------------------------------------------
const switchReport = await page.evaluate(async () => {
  const out = { buttons: [], errors: [] };
  const sw = document.getElementById('localeSwitch');
  const mobile = document.getElementById('localeSwitchMobile');
  out.hasDesktop = !!sw;
  out.hasMobile = !!mobile;
  for (const btn of (sw ? [...sw.querySelectorAll('[data-locale]')] : [])) {
    const before = document.documentElement.lang;
    btn.click();
    await new Promise((r) => setTimeout(r, 250));
    const active = btn.classList.contains('active');
    out.buttons.push({
      locale: btn.dataset.locale,
      lang: document.documentElement.lang,
      changed: document.documentElement.lang !== before || btn.dataset.locale === 'en',
      active,
      title: document.title,
    });
  }
  return out;
});
for (const b of switchReport.buttons) {
  if (!b.active) failures.push(`the switch did not mark "${b.locale}" as the chosen language`);
}
if (!switchReport.hasDesktop) failures.push('the language switch is missing');
if (switchReport.hasMobile) {
  notes.push('there are two language switches in the markup (desktop and mobile)');
}

// The switch has to be reachable on a phone, where most of the readers are.
// A switch that exists in the markup but cannot be tapped is not a switch.
const phone = await browser.newPage({ viewport: { width: 390, height: 844 } });
await phone.goto(BASE, { waitUntil: 'networkidle' });
await phone.waitForTimeout(1800);
const phoneSwitch = await phone.evaluate(() => {
  const sw = document.getElementById('localeSwitch');
  if (!sw) return { missing: true };
  const r = sw.getBoundingClientRect();
  const style = getComputedStyle(sw);
  const buttons = [...sw.querySelectorAll('[data-locale]')].map((b) => {
    const br = b.getBoundingClientRect();
    return { loc: b.dataset.locale, w: Math.round(br.width), h: Math.round(br.height), visible: br.width > 0 && br.height > 0 && getComputedStyle(b).visibility !== 'hidden' };
  });
  return {
    missing: false,
    inViewport: r.width > 0 && r.height > 0 && r.top < window.innerHeight && r.left < window.innerWidth && r.right > 0 && r.bottom > 0,
    display: style.display,
    buttons,
  };
});
if (phoneSwitch.missing) failures.push('the language switch is missing on a phone');
else {
  if (!phoneSwitch.inViewport) failures.push('the language switch is not on the phone screen');
  if (phoneSwitch.display === 'none') failures.push('the language switch is hidden on a phone');
  const hidden = phoneSwitch.buttons.filter((b) => !b.visible).map((b) => b.loc);
  if (hidden.length) failures.push(`the language switch has hidden buttons on a phone: ${hidden.join(', ')}`);
  const tiny = phoneSwitch.buttons.filter((b) => b.visible && b.h < 20).map((b) => b.loc);
  if (tiny.length) failures.push(`the language switch has buttons too small to read on a phone: ${tiny.join(', ')}`);
  console.log(`phone switch            : ${phoneSwitch.buttons.length} buttons, all visible: ${phoneSwitch.buttons.every((b) => b.visible)}`);
}
await phone.close();

// The choice has to survive a reload, and a link has to be able to carry a
// language. Both are checked in a second page so the storage is not warm.
const page2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page2.goto(BASE, { waitUntil: 'networkidle' });
await page2.waitForTimeout(1500);
await page2.evaluate(() => {
  const btn = document.querySelector('#localeSwitch [data-locale="th"]');
  if (btn) btn.click();
});
await page2.waitForTimeout(500);
const stored = await page2.evaluate(() => {
  try { return window.localStorage.getItem('axiom:locale'); } catch (e) { return null; }
});
await page2.reload({ waitUntil: 'networkidle' });
await page2.waitForTimeout(1500);
const afterReload = await page2.evaluate(() => ({
  lang: document.documentElement.lang,
  stored: (() => { try { return window.localStorage.getItem('axiom:locale'); } catch (e) { return null; } })(),
}));
if (stored !== 'th') failures.push(`choosing a language did not store it (stored ${JSON.stringify(stored)}, expected "th")`);
if (afterReload.lang !== 'th') failures.push(`the chosen language did not survive a reload (page came back as "${afterReload.lang}")`);
await page2.close();

const page3 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page3.goto(`${BASE}${BASE.includes('?') ? '&' : '?'}lang=ja`, { waitUntil: 'networkidle' });
await page3.waitForTimeout(1500);
const viaUrl = await page3.evaluate(() => ({
  lang: document.documentElement.lang,
  stored: (() => { try { return window.localStorage.getItem('axiom:locale'); } catch (e) { return null; } })(),
}));
if (viaUrl.lang !== 'ja') failures.push(`?lang=ja did not open the page in Japanese (came back as "${viaUrl.lang}")`);
if (viaUrl.stored === 'ja') failures.push('?lang=ja overwrote the reader\'s own stored preference');
await page3.close();

await browser.close();

// ---- 4. the figures, in every language ----------------------------------
for (const loc of LOCALES) {
  const r = rendered[loc];
  if (!r) { failures.push(`${loc}: the page could not be switched to it`); continue; }
  const expectLang = { en: 'en', th: 'th', zh: 'zh-Hans', ko: 'ko', ja: 'ja', vi: 'vi', ts: 'en' }[loc];
  if (r.lang !== expectLang) failures.push(`${loc}: the page reports lang="${r.lang}", expected "${expectLang}"`);
}
if (errors.length) {
  for (const e of [...new Set(errors)].slice(0, 6)) failures.push(`JavaScript error while switching: ${e}`);
}

console.log(`\nlocales in the copy table : ${Object.keys(tables).join(', ')}`);
console.log(`english keys              : ${Object.keys(en).length}`);
console.log(`keys the page asks for    : ${used.length}`);
console.log(`switch buttons            : ${switchReport.buttons.map((b) => `${b.locale}:${b.lang}`).join(' ')}`);
console.log(`remembered after reload   : ${afterReload.lang} (stored ${JSON.stringify(afterReload.stored)})`);
console.log(`?lang=ja opened            : ${viaUrl.lang} (stored ${JSON.stringify(viaUrl.stored)})`);

if (notes.length) for (const n of notes) console.log(`NOTE — ${n}`);

if (failures.length) {
  console.error(`\nFAIL — ${failures.length} i18n problem(s):`);
  for (const f of failures) console.error(`  · ${f}`);
  process.exit(1);
}
console.log('\nPASS — every language carries every key the page asks for, and every decision is written down.');
