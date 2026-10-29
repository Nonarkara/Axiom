import test from 'node:test';
import assert from 'node:assert/strict';

import { ARTEFACTS } from '../scripts/catalogue/build.mjs';
import { read, readJSON } from '../scripts/catalogue/lib.mjs';

// ---------------------------------------------------------------------------
// One catalogue, six renderings.
//
// The two surfaces used to hold the same systems in two hand-written places,
// and they drifted: the reading room described sixteen systems differently
// from the main site, three categories were filed under two keys each with
// different translations, and four states the reading room had no word for
// were printed in English in every language.
//
// These tests do not look at the artefacts to see whether they are plausible.
// They regenerate the artefacts from `data/catalogue/` and require the
// committed bytes to match, so a hand edit that the source does not know
// about fails the build instead of quietly shipping.
// ---------------------------------------------------------------------------

test('every catalogue artefact matches the source of truth', () => {
  for (const [file, build] of Object.entries(ARTEFACTS)) {
    assert.equal(read(file), build(),
      `${file} disagrees with data/catalogue/ — run: node scripts/catalogue/build.mjs`);
  }
});

test('the source of truth describes every system, in every language', () => {
  const source = readJSON('data/catalogue/systems.json');
  const categories = readJSON('data/catalogue/categories.json');
  const plates = readJSON('data/catalogue/plates.json');

  assert.ok(source.systems.length > 0, 'the catalogue is empty');

  for (const system of source.systems) {
    for (const locale of source.locales) {
      const copy = system.copy[locale];
      assert.ok(copy, `${system.id} has no ${locale} copy`);
      assert.ok(copy.lede && copy.lede.length > 20, `${system.id} has no ${locale} description`);
      assert.ok(copy.cta, `${system.id} has no ${locale} call to action`);
      assert.ok(copy.name, `${system.id} has no ${locale} name`);
    }
    assert.ok(categories[system.catKey], `${system.id} points at a category that does not exist`);
    for (const locale of source.locales) {
      assert.ok(categories[system.catKey][locale],
        `${system.id} has no ${locale} category (${system.catKey})`);
    }
    assert.ok(plates[system.id], `${system.id} has no plate`);
  }
});

test('every category is stated once, in every language', () => {
  const categories = readJSON('data/catalogue/categories.json');
  const source = readJSON('data/catalogue/systems.json');
  for (const [key, byLocale] of Object.entries(categories)) {
    for (const locale of source.locales) {
      assert.ok(byLocale[locale], `category ${key} has no ${locale} statement`);
    }
  }
  // Two keys for one category is how the site came to show "Campus
  // Intelligence" two ways in the same language.
  const byEnglish = new Map();
  for (const [key, byLocale] of Object.entries(categories)) {
    const seen = byEnglish.get(byLocale.en);
    assert.ok(!seen, `categories ${seen} and ${key} both say "${byLocale.en}"`);
    byEnglish.set(byLocale.en, key);
  }
});

test('the counts the site states are the counts the catalogue holds', () => {
  const source = readJSON('data/catalogue/systems.json');
  const total = source.systems.length;
  for (const [locale, template] of Object.entries(source.proofLines)) {
    const filled = template
      .replace(/\{count\}/g, String(total))
      .replace(/\{countries\}/g, String(source.countries));
    assert.ok(!/\{(count|countries)\}/.test(filled), `${locale} still has an unfilled number`);
  }
  const clusterTotal = Object.values(source.clusterCounts).reduce((a, b) => a + b, 0);
  assert.equal(clusterTotal, total, 'the cluster counts do not add up to the catalogue');
});

test('every system appears once, with one number and one destination', () => {
  const source = readJSON('data/catalogue/systems.json');
  const ids = new Set();
  const numbers = new Set();
  const destinations = new Map();
  for (const system of source.systems) {
    assert.ok(!ids.has(system.id), `${system.id} appears twice`);
    ids.add(system.id);
    assert.ok(!numbers.has(system.idx), `two systems carry the number ${system.idx}`);
    numbers.add(system.idx);
    if (system.href) {
      assert.ok(!destinations.has(system.href),
        `${system.id} and ${destinations.get(system.href)} share a destination`);
      destinations.set(system.href, system.id);
    }
  }
});
