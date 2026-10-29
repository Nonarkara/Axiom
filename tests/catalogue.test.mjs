import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

// ---------------------------------------------------------------------------
// axiomx holds the catalogue as data. axiom renders it as cards. They were
// free to drift, and they did, in four ways that no test saw because every
// test looked at one file at a time:
//
//   - simcity and tdv sat in Lab on axiom and in City Dashboards on axiomx,
//     so the two sites stated different cluster sizes for the same systems;
//   - FormHypes was listed twice, under two names, pointing at one URL;
//   - two cards carried the number 59, because both entries claimed that idx;
//   - both cards then asked for the same copy key, and the second definition
//     won, so the FormHypes card rendered the Palette's description.
//
// So the rule is stated over the pair, not over one file: one catalogue, two
// renderings, and they must agree on every system, every cluster, every
// number, and every copy key.
// ---------------------------------------------------------------------------

const catalogSource = await readFile(new URL('../axiomx/catalog.js', import.meta.url), 'utf8');
const context = { window: {} };
runInNewContext(catalogSource, context);
const systems = context.window.AXIOM_SYSTEMS;

const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
const app = await readFile(new URL('../public/app.js', import.meta.url), 'utf8');

const CLUSTERS = [
  ['CITY DASHBOARDS', 'City Dashboards'],
  ['INTELLIGENCE', 'Intelligence'],
  ['CIVIC', 'Civic'],
  ['EMERGING', 'Emerging'],
  ['LAB', 'Lab'],
];

// The cards of one cluster: from its marker to the next marker or section end.
function clusterCards(label) {
  const start = html.indexOf(`<!-- ${label} -->`);
  assert.ok(start >= 0, `no ${label} section in index.html`);
  const comment = html.indexOf('<!--', start + 10);
  const section = html.indexOf('</section>', start);
  const end = comment >= 0 && (section < 0 || comment < section) ? comment : section;
  return Array.from(html.slice(start, end).matchAll(/data-arch="([^"]+)"/g), match => match[1]);
}

const cards = Array.from(html.matchAll(/data-arch="([^"]+)"/g), match => match[1]);

test('the two catalogues name the same systems, once each', () => {
  const catalogueIds = systems.map(system => system.id);
  assert.equal(new Set(catalogueIds).size, catalogueIds.length,
    'axiomx lists the same system twice');
  assert.equal(new Set(cards).size, cards.length,
    'axiom renders the same card twice');
  assert.deepEqual([...cards].sort(), [...catalogueIds].sort(),
    'axiom and axiomx list different systems');
});

test('every system sits in the same cluster on both sites', () => {
  for (const [label, cluster] of CLUSTERS) {
    const inCluster = clusterCards(label);
    for (const id of inCluster) {
      const system = systems.find(entry => entry.id === id);
      assert.ok(system, `${id} is on axiom but not in the catalogue`);
      assert.equal(system.cluster, cluster,
        `${id} sits in ${cluster} on axiom but in ${system.cluster} on axiomx`);
    }
  }
  const placed = CLUSTERS.flatMap(([label]) => clusterCards(label));
  assert.deepEqual([...placed].sort(), [...cards].sort(),
    'a card sits outside every cluster section');
});

test('every system carries the same number on both sites, and no number repeats', () => {
  const numbers = systems.map(system => Number(system.idx));
  assert.equal(new Set(numbers).size, numbers.length,
    `two systems claim the same number: ${numbers.join(', ')}`);
  assert.deepEqual([...numbers].sort((a, b) => a - b),
    Array.from({ length: systems.length }, (_, index) => index + 1),
    'the numbers should run 1..N with none missing');

  for (const id of cards) {
    const system = systems.find(entry => entry.id === id);
    const stated = Number(html.match(
      new RegExp(`data-arch="${id}"[\\s\\S]{0,400}?sys-cell__idx">(\\d+)`))?.[1]);
    assert.equal(stated, Number(system.idx),
      `${id} is numbered ${stated} on axiom but ${system.idx} in the catalogue`);
  }
});

test('no two systems share a destination URL', () => {
  const seen = new Map();
  for (const system of systems) {
    if (!system.href) continue;
    assert.ok(!seen.has(system.href),
      `${system.id} and ${seen.get(system.href)} both point at ${system.href}`);
    seen.set(system.href, system.id);
  }
});

test('both catalogues link to the same destination, including paths and fragments', () => {
  for (const match of html.matchAll(/<a\b[^>]*\bdata-arch="([^"]+)"[^>]*>/g)) {
    const system = systems.find(entry => entry.id === match[1]);
    if (!system?.href) continue;
    const href = match[0].match(/\bhref="([^"]+)"/)?.[1];
    assert.equal(new URL(href, 'https://axiom.nonarkara.org/').href,
      new URL(system.href).href, system.id);
  }
});

test('verified custom-domain migrations preserve the exact destination route', async () => {
  const migrations = JSON.parse(await readFile(new URL('../.qa/catalogue-domains.json', import.meta.url), 'utf8'));
  for (const entry of migrations) {
    const old = new URL(entry.from), current = new URL(entry.to);
    assert.equal(current.protocol, 'https:');
    assert.ok(current.hostname.endsWith('.nonarkara.org'));
    assert.equal(current.pathname + current.search + current.hash, old.pathname + old.search + old.hash, entry.id);
    if (entry.id !== 'blog') assert.equal(new URL(systems.find(s => s.id === entry.id).href).href, current.href);
  }
});

test('active catalogue, hero, map and reading-room links do not regress to provider domains', async () => {
  const providerHost = value => /\.(?:pages|workers)\.dev$/.test(new URL(value).hostname);
  assert.equal(providerHost('https://flood-ami.pages.dev/'), true);
  assert.equal(providerHost('https://example.account.workers.dev/path'), true);
  assert.equal(providerHost('https://flood.nonarkara.org/pages.dev'), false);
  const files = ['public/index.html', 'public/footprint.js', 'axiomx/catalog.js', 'axiomx/reader.js', 'axiomx/ebooks.js'];
  for (const file of files) {
    const source = await readFile(new URL('../' + file, import.meta.url), 'utf8');
    for (const match of source.matchAll(/https?:\/\/[^\s"'<>`)]+/g)) {
      assert.equal(providerHost(match[0]), false, `${file}: ${match[0]}`);
    }
  }
});

test('axiom states the true size of every cluster', () => {
  for (const [label] of CLUSTERS) {
    const actual = clusterCards(label).length;
    const start = html.indexOf(`<!-- ${label} -->`);
    const meta = html.slice(start, start + 400).match(/s-head__meta[^>]*>([^<]*)</);
    assert.ok(meta, `${label} states no size`);
    const stated = Number(meta[1].match(/·\s*(\d+)\s*$/)?.[1]);
    assert.equal(stated, actual,
      `${label} states ${stated} but holds ${actual} cards`);
  }
});

// ---------------------------------------------------------------------------
// The copy key is the quietest defect in the set. Two cards asked for
// panels.p66. In a JavaScript object literal the second definition wins, so
// the Palette's description was written over the FormHypes one and the
// FormHypes card showed the Palette's text. Nothing threw. Nothing was
// missing from the DOM. The card simply said the wrong thing.
//
// A duplicate key inside one object is invisible to every test that looks for
// missing content, so it has to be looked for directly.
// ---------------------------------------------------------------------------
// The copy lives in two places. The legacy `panels` blocks carry the pNN keys
// for the four locales that define them; catalogReleaseCopy carries named
// keys for seven locales and is merged in at load. A key can live in either.
function panelsBlocks() {
  const out = [];
  const re = /^ {4}panels: \{/gm;
  let match;
  while ((match = re.exec(app))) {
    let depth = 1;
    let index = match.index + match[0].length;
    while (depth > 0 && index < app.length) {
      if (app[index] === '{') depth++;
      else if (app[index] === '}') depth--;
      index++;
    }
    out.push(app.slice(match.index + match[0].length, index - 1));
  }
  return out;
}

function releaseBlocks() {
  const start = app.indexOf('const catalogReleaseCopy = {');
  if (start < 0) return [];
  const out = [];
  const re = /^ {2}([a-z]{2}): \{/gm;
  let match;
  while ((match = re.exec(app))) {
    if (match.index < start) continue;
    let depth = 1;
    let index = match.index + match[0].length;
    while (depth > 0 && index < app.length) {
      if (app[index] === '{') depth++;
      else if (app[index] === '}') depth--;
      index++;
    }
    out.push(app.slice(match.index + match[0].length, index - 1));
  }
  return out;
}

const keysOf = block => Array.from(block.matchAll(/^ {4}([A-Za-z_]\w*):/gm), m => m[1]);

test('no locale defines the same copy key twice', () => {
  for (const [label, blocks] of [['panels', panelsBlocks()], ['release', releaseBlocks()]]) {
    assert.ok(blocks.length >= 4, `expected ${label} copy blocks, found ${blocks.length}`);
    blocks.forEach((block, index) => {
      const keys = label === 'panels'
        ? Array.from(block.matchAll(/^ {6}([A-Za-z_]\w*):/gm), m => m[1])
        : keysOf(block);
      const repeated = keys.filter((key, at) => keys.indexOf(key) !== at);
      assert.deepEqual(repeated, [],
        `the ${label} copy block ${index} defines ${repeated.join(', ')} twice — ` +
        'the second one silently overwrites the first');
    });
  }
});

test('every copy key a card asks for exists, and no two cards share one', () => {
  const legacy = panelsBlocks();
  const release = releaseBlocks();
  const legacyKeys = legacy.map(block =>
    new Set(Array.from(block.matchAll(/^ {6}([A-Za-z_]\w*):/gm), m => m[1])));
  const releaseKeys = release.map(block => new Set(keysOf(block)));
  const legacyUnion = new Set(legacyKeys.flatMap(set => [...set]));

  const used = new Map();
  const marks = Array.from(html.matchAll(/data-arch="([^"]+)"/g));
  for (let at = 0; at < marks.length; at++) {
    const id = marks[at][1];
    // A card may be a link or a plain box; either way it runs to the next card.
    const start = marks[at].index;
    const end = at + 1 < marks.length ? marks[at + 1].index : html.length;
    const card = html.slice(start, end);
    for (const [, key] of card.matchAll(/data-i18n="panels\.([A-Za-z_]\w*)\./g)) {
      // A card may ask for the lede and the cta of one panel. Two cards may
      // not ask for the same panel: the second would overwrite the first.
      assert.ok(!used.has(key) || used.get(key) === id,
        `${id} and ${used.get(key)} both ask for panels.${key}`);
      used.set(key, id);
      if (legacyUnion.has(key)) {
        legacyKeys.forEach((keys, index) => {
          assert.ok(keys.has(key), `the panels copy block ${index} has no panels.${key} for ${id}`);
        });
      } else {
        releaseKeys.forEach((keys, index) => {
          assert.ok(keys.has(key), `the release copy block ${index} has no panels.${key} for ${id}`);
        });
      }
    }
  }
  assert.ok(used.size > 0, 'expected the cards to reference copy keys');
});

// ---------------------------------------------------------------------------
// The reading room's index prints a group header whenever the cluster changes
// from one entry to the next. Entries appended to the end of the array in the
// order they were built (simcity, miaoshen, tdv, techhunt, ...) put City
// Dashboards under its header four separate times and Lab twice, each header
// restating a count — the index spent its first screen saying the same thing.
// Nothing threw, every id and number was right, and every other test passed.
// ---------------------------------------------------------------------------
test('the reading-room catalogue is grouped, so each cluster header prints once', () => {
  const seen = new Set();
  let previous = null;
  for (const system of systems) {
    if (system.cluster !== previous) {
      assert.ok(!seen.has(system.cluster),
        `${system.id} reopens the ${system.cluster} group — move it next to the rest of its cluster`);
      seen.add(system.cluster);
      previous = system.cluster;
    }
  }
});

// A system added without a spatial sweep passes the gate by not being in it:
// seven systems (dhaka, burma, tsunami, universe-69, pavilion, llm, dog) shipped
// unmeasured while every check stayed green.
test('every reading-room system has a measured route in the spatial baseline', async () => {
  const baseline = JSON.parse(await readFile(new URL('../design/spatial-baseline.json', import.meta.url), 'utf8'));
  const missing = Array.from(systems, s => '/' + s.id).filter(r => !baseline.routes[r]);
  assert.deepEqual(missing, [], `sweep these routes and record them: ${missing.join(', ')}`);
});
