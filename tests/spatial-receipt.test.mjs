import test from 'node:test';
import assert from 'node:assert/strict';
import { assembleSpatialBaseline } from '../.qa/spatial-receipt.mjs';

const cell = () => ({ findings: [], chrome: { top: 50, bottom: 0 } });
const receipt = (route, widths = [360, 1440]) => ({
  measuredWidths: widths,
  provenance: { measuredAt: '2026-10-30T00:00:00Z' },
  routes: { [route]: Object.fromEntries(widths.map(width => [width, cell()])) },
});

test('spatial assembly preserves other surfaces and reports exact widths and provenance', () => {
  const seed = { widths: [360, 480, 1440], routes: { '/old': { 480: cell() } } };
  const out = assembleSpatialBaseline(seed, [receipt('/new')], ['/new']);
  assert.deepEqual(out.measuredWidths, [360, 480, 1440]);
  assert.deepEqual(out.provenance.carriedOver, ['/old']);
  assert.equal(out.provenance.measurements, 2);
  assert.deepEqual(out.routes['/old'], seed.routes['/old']);
});

test('old cells cannot cover a failed fresh chunk', () => {
  const seed = { routes: { '/required': receipt('/required').routes['/required'] } };
  assert.throws(() => assembleSpatialBaseline(seed, [], ['/required']), /missing: \/required/);
  assert.throws(() => assembleSpatialBaseline(seed, [null], ['/required']), /no fresh/);
});

test('spatial assembly rejects truncated and unreadable chunks', () => {
  const partial = receipt('/a');
  delete partial.routes['/a'][1440];
  assert.throws(() => assembleSpatialBaseline(null, [partial], ['/a']), /incomplete/);
  const failed = receipt('/a');
  failed.routes['/a'][360].error = 'unreadable page';
  assert.throws(() => assembleSpatialBaseline(null, [failed], ['/a']), /unreadable/);
});

test('spatial assembly rejects duplicated and unexpected routes', () => {
  assert.throws(() => assembleSpatialBaseline(null, [receipt('/a'), receipt('/a')], ['/a']), /twice/);
  assert.throws(() => assembleSpatialBaseline(null, [receipt('/b')], ['/a']), /unexpected: \/b/);
});

test('spatial assembly drops only reasons with no remaining measured decision', () => {
  const part = receipt('/a');
  part.routes['/a'][360].findings.push({ kind: 'dead', sel: '.kept', metric: 80 });
  const out = assembleSpatialBaseline({ reasons: { 'dead|.gone': 'removed', 'dead|.kept': 'a real reason' } }, [part], ['/a']);
  assert.deepEqual(out.reasons, { 'dead|.kept': 'a real reason' });
});
