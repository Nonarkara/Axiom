#!/usr/bin/env node
// Read a pinned local commit into an ephemeral execution directory; never use HEAD.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const COMMIT = '459d79c585d8c67830bd492ebe791429824f1024';
// Fixed independently of results.json and of the supplied snapshot manifest.
const EXPECTED_HASHES = {
  'src/data/anchor.ts': 'a9819b36efc17076d045c70a19e09d0aae955463bd5ac3ea5df3cab9030bfbd8',
  'src/data/clusters.ts': 'c4acbf3f39cd9df1472a4268ccc5d268c68c1dd21b0e03f0fbe1307cf605f9d4',
  'src/data/geography.ts': '67edd7462a1b75207725fb3567f05b1fe723273c132fec98b74ff745a40c430b',
  'src/data/sources.ts': '33d68ef552b641160a3059657dad6f3731b1c3334c53d1bce80adda59293056a',
  'src/data/research.ts': 'a8b141e27bdc92375ffaabbae7874a30fd0217080341973fd7623b843df683a6',
  'src/data/corroboration.ts': 'ed381dca61e5c6c3009b6f2dc0629a6ba301f6109da317171ed5fa35108a5a56',
  'src/data/thailandSeries.ts': '98c3dcd3fcaa98a4a74f15d50e6c764fe46c1294d09a1838c84404d71bc23894',
  'src/lib/scoring.ts': '9cb519e6e71f9b4a5340c67c4db29ff29ffa1b0cb613e798e4417b5867b5a912',
  'src/lib/thailandProvinces.ts': '3bc4a9c94bd238ba9cdf9c3128327ee2face5e748ca3f63d7d912160b51eaf4f',
  'src/lib/thailandProvinces.generated.ts': 'daeb438db818b9a7c15ccc0e8e5503c0c4b0f5c57ae29f9969101be26104fefb',
  'src/lib/provenance.test.ts': '9a18a9b4bceebc41e6ca615c01def38791889a005cd5fa108050472c97fdf574',
};
const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const options = {};
for (let i = 0; i < args.length; i += 2) {
  assert.ok(['--repo', '--snapshot', '--out'].includes(args[i]) && args[i + 1], 'Use --repo PATH or --snapshot ROOT, optionally --out PATH');
  assert.ok(!(args[i] in options), `Duplicate option ${args[i]}`);
  options[args[i]] = args[i + 1];
}
const repo = resolve(options['--repo'] ?? join(here, '../../../../Foresights'));
assert.ok(!(options['--repo'] && options['--snapshot']), 'Choose --repo or --snapshot, not both');
const snapshot = options['--snapshot'] ? resolve(options['--snapshot']) : null;
const git = (...a) => execFileSync('git', ['-C', repo, ...a], { maxBuffer: 20 * 1024 * 1024 });
if (snapshot) {
  const manifest = JSON.parse(readFileSync(join(snapshot, 'snapshot-manifest.json'), 'utf8'));
  assert.equal(manifest.sourceCommit, COMMIT, 'Snapshot commit does not match audit pin');
  assert.deepEqual(manifest.inputHashes, EXPECTED_HASHES, 'Snapshot manifest does not match fixed audit hashes');
} else {
  assert.equal(git('rev-parse', `${COMMIT}^{commit}`).toString().trim(), COMMIT);
}
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const paths = [
  'src/data/anchor.ts', 'src/data/clusters.ts', 'src/data/geography.ts',
  'src/data/sources.ts', 'src/data/research.ts', 'src/data/corroboration.ts',
  'src/data/thailandSeries.ts', 'src/lib/scoring.ts',
  'src/lib/thailandProvinces.ts', 'src/lib/thailandProvinces.generated.ts',
  'src/lib/provenance.test.ts',
];
const temp = mkdtempSync(join(tmpdir(), 'axiom-foresight-audit-'));
try {
  const inputHashes = {};
  for (const path of paths) {
    const bytes = snapshot ? readFileSync(join(snapshot, path)) : git('show', `${COMMIT}:${path}`);
    inputHashes[path] = sha(bytes);
    assert.equal(inputHashes[path], EXPECTED_HASHES[path], `Source hash mismatch: ${path}`);
    const destination = join(temp, path);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, bytes);
    assert.equal(sha(readFileSync(destination)), inputHashes[path]);
  }
  writeFileSync(join(temp, 'package.json'), '{"type":"module"}\n');
  const load = (path) => import(pathToFileURL(join(temp, path)).href);
  const { CLUSTERS, adjustedCluster } = await load('src/data/clusters.ts');
  const { THRESHOLDS } = await load('src/lib/scoring.ts');
  const { REGIONS, STRATEGIC_CLUSTERS } = await load('src/data/geography.ts');
  const { SOURCE_LIST } = await load('src/data/sources.ts');
  const { STRESS_GRID, TRAJECTORIES } = await load('src/data/anchor.ts');
  const { LITERATURE } = await load('src/data/research.ts');
  const { THAILAND_SERIES } = await load('src/data/thailandSeries.ts');
  const fields = ['value', 'growth', 'local', 'sovereignty', 'stance'];
  const profile = (c) => Object.fromEntries(fields.map((key) => [key, c[key]]));
  const original = JSON.stringify(CLUSTERS);
  const changedProperties = Object.fromEntries(fields.map((key) => [key, 0]));
  const states = [];
  const profiles = new Set();
  let changedRows = 0;
  let unchangedRows = 0;
  let localityChecks = 0;
  let orderChecks = 0;
  let repeatChecks = 0;
  for (let mask = 0; mask < 2 ** THRESHOLDS.length; mask++) {
    const ids = THRESHOLDS.filter((_, i) => mask & (1 << i)).map((t) => t.id);
    const active = new Set(ids);
    const rows = CLUSTERS.map((base) => {
      const adjusted = adjustedCluster(base.id, active);
      const changed = fields.filter((key) => adjusted[key] !== base[key]);
      assert.deepEqual([...adjusted.moved].sort(), [...changed].sort());
      assert.equal(adjusted.value, base.value);
      assert.equal(adjusted.local, base.local);
      if (!THRESHOLDS.some((t) => active.has(t.id) && t.cluster === base.id)) {
        assert.deepEqual(profile(adjusted), profile(base));
      }
      localityChecks++;
      assert.deepEqual(adjustedCluster(base.id, new Set([...ids].reverse())), adjusted);
      orderChecks++;
      assert.deepEqual(adjustedCluster(base.id, active), adjusted);
      repeatChecks++;
      if (mask === 0) assert.deepEqual(profile(adjusted), profile(base));
      if (changed.length) changedRows++; else unchangedRows++;
      for (const key of changed) changedProperties[key]++;
      profiles.add(JSON.stringify([base.id, profile(adjusted)]));
      return { cluster: base.id, ...profile(adjusted), changed };
    });
    states.push({ mask, active: ids, rows });
  }
  assert.equal(JSON.stringify(CLUSTERS), original, 'Source mutation');
  const uniqueStates = new Set(states.map((s) => JSON.stringify(s.rows))).size;
  const singleSwitchEffects = THRESHOLDS.map((t) => {
    const base = CLUSTERS.find((c) => c.id === t.cluster);
    const result = adjustedCluster(t.cluster, new Set([t.id]));
    return { switch: t.id, cluster: t.cluster, condition: t.condition,
      before: profile(base), after: profile(result), changed: result.moved };
  });
  const tap = execFileSync(process.execPath,
    ['--experimental-strip-types', '--test', '--test-reporter=tap', join(temp, 'src/lib/provenance.test.ts')],
    { encoding: 'utf8', maxBuffer: 5 * 1024 * 1024 });
  const tests = Number(tap.match(/^# tests (\d+)/m)?.[1]);
  const passes = Number(tap.match(/^# pass (\d+)/m)?.[1]);
  const failures = Number(tap.match(/^# fail (\d+)/m)?.[1]);
  assert.ok(tests > 0 && passes === tests && failures === 0);
  const checkPath = join(here, 'primary-checks.json');
  const primary = JSON.parse(readFileSync(checkPath, 'utf8'));
  const statisticalComparisons = primary.worldBank.map((capture) => {
    const series = THAILAND_SERIES.find((s) => s.id === capture.consoleSeries);
    const value = series.points.find((p) => p.year === 2024).value;
    return { indicator: capture.indicator, url: capture.url, year: 2024,
      consoleValue: value, capturedPrimaryValue: capture.value,
      differenceConsoleMinusPrimary: value - capture.value,
      primaryLastUpdated: capture.lastUpdated };
  });
  const report = {
    schemaVersion: 1, sourceCommit: COMMIT,
    analysisSha256: sha(readFileSync(fileURLToPath(import.meta.url))),
    primaryChecksSha256: sha(readFileSync(checkPath)), inputHashes,
    counts: { clusters: CLUSTERS.length, axes: 4, thresholds: THRESHOLDS.length,
      trajectories: TRAJECTORIES.length, stressRows: STRESS_GRID.length,
      regions: REGIONS.length, strategicClusters: STRATEGIC_CLUSTERS.length,
      uniqueDerivedProvinceMembers: new Set(STRATEGIC_CLUSTERS.flatMap((c) => c.provinces)).size,
      sourceRecords: SOURCE_LIST.length, literatureRecords: LITERATURE.length,
      configurations: states.length, clusterStateRows: states.length * CLUSTERS.length,
      uniqueSystemStates: uniqueStates, uniqueClusterProfiles: profiles.size,
      changedRows, unchangedRows, changedProperties },
    checks: { localityChecks, insertionOrderChecks: orderChecks,
      repeatedReadChecks: repeatChecks, sourceUnmutated: true,
      baselineUnchanged: true, valueAndLocalInvariant: true,
      pinnedExistingTests: { tests, passes, failures } },
    singleSwitchEffects, statisticalComparisons, states,
  };
  assert.equal(report.counts.configurations, 16);
  assert.equal(report.counts.clusterStateRows, 176);
  assert.equal(changedRows, 32);
  assert.equal(unchangedRows, 144);
  assert.deepEqual(changedProperties, { value: 0, growth: 8, local: 0, sovereignty: 16, stance: 16 });
  const serialized = `${JSON.stringify(report, null, 2)}\n`;
  if (options['--out']) writeFileSync(resolve(options['--out']), serialized);
  else process.stdout.write(serialized);
  process.stderr.write(`Verified ${states.length} configurations, ${changedRows} changed rows; ${passes}/${tests} pinned tests pass.\n`);
} finally {
  rmSync(temp, { recursive: true, force: true });
}
