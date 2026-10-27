import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = name => readFileSync(new URL('../axiomx/' + name, import.meta.url), 'utf8');
const context = { window: {} };
runInNewContext(source('catalog.js'), context);
const sharedBefore = JSON.stringify(context.window.AXIOM_SYSTEMS);
runInNewContext(source('ebooks.js'), context);
const ebooks = context.window.AXIOM_EBOOKS;
const shared = context.window.AXIOM_SYSTEMS;

test('the three requested e-books extend axiomx without changing the shared catalogue', () => {
  assert.equal(JSON.stringify(shared), sharedBefore);
  assert.equal(ebooks.map(book => book.id).join(','), 'mean,ninja,slowdown');
  const publicHtml = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
  for (const book of ebooks) {
    assert.equal(book.cluster, 'E-books');
    assert.equal(book.href, `https://${book.id}.nonarkara.org/`);
    assert.equal(book.cta, 'Read the e-book');
    assert.ok(book.name && book.lede && book.cat);
    assert.ok(!shared.some(system => system.id === book.id));
    assert.ok(!publicHtml.includes(`data-arch="${book.id}"`));
  }
});

test('e-book numbers follow the shared catalogue and all destinations are unique', () => {
  const all = [...shared, ...ebooks];
  assert.equal(new Set(all.map(system => system.id)).size, all.length);
  assert.equal(new Set(all.map(system => system.idx)).size, all.length);
  assert.equal(new Set(all.filter(system => system.href).map(system => system.href)).size,
    all.filter(system => system.href).length);
  const last = Math.max(...shared.map(system => Number(system.idx)));
  assert.deepEqual(Array.from(ebooks, book => Number(book.idx)), [last + 1, last + 2, last + 3]);
});

test('the reading room loads its extension before rendering and every e-book has a plate', () => {
  const html = source('index.html');
  assert.ok(html.indexOf('catalog.js?') < html.indexOf('ebooks.js?'));
  assert.ok(html.indexOf('ebooks.js?') < html.indexOf('reader.js?'));
  assert.match(source('reader.js'), /\.concat\(Array\.isArray\(window\.AXIOM_EBOOKS\)/);
  runInNewContext(source('plates.js'), context);
  for (const book of ebooks) {
    assert.equal(context.window.AXIOM_PLATES[book.id]?.length, 10, book.id);
    assert.ok(readFileSync(new URL(`../axiomx/art/${book.id}.webp`, import.meta.url)).length > 1000);
  }
});
