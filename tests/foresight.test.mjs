import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const folder = new URL('../docs/research/foresight/', import.meta.url);
const report = JSON.parse(await readFile(new URL('results.json', folder), 'utf8'));

test('Foresight supplementary results retain their exact analysis and capture hashes', async () => {
  for (const [file, key] of [['analysis.mjs', 'analysisSha256'], ['primary-checks.json', 'primaryChecksSha256']]) {
    const hash = createHash('sha256').update(await readFile(new URL(file, folder))).digest('hex');
    assert.equal(hash, report[key], file);
  }
  assert.match(report.sourceCommit, /^[a-f0-9]{40}$/);
  assert.equal(Object.keys(report.inputHashes).length, 11);
});

test('Foresight reported state counts and field changes are recoverable from the complete result table', () => {
  const fields = ['value', 'growth', 'local', 'sovereignty', 'stance'];
  const baseline = new Map(report.states.find(state => state.mask === 0).rows.map(row => [row.cluster, row]));
  const changedProperties = Object.fromEntries(fields.map(field => [field, 0]));
  let changedRows = 0;
  let rows = 0;
  assert.equal(new Set(report.states.map(state => state.mask)).size, 16);
  for (const state of report.states) {
    assert.equal(state.rows.length, baseline.size);
    for (const row of state.rows) {
      const changed = fields.filter(field => row[field] !== baseline.get(row.cluster)[field]);
      assert.deepEqual([...row.changed].sort(), changed.sort());
      for (const field of changed) changedProperties[field]++;
      if (changed.length) changedRows++;
      rows++;
    }
  }
  assert.equal(rows, report.counts.clusterStateRows);
  assert.equal(changedRows, report.counts.changedRows);
  assert.equal(rows - changedRows, report.counts.unchangedRows);
  assert.deepEqual(changedProperties, report.counts.changedProperties);
  assert.equal(changedProperties.value, 0);
  assert.equal(changedProperties.local, 0);
});
