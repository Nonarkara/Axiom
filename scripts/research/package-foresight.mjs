#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, mkdtemp, rm, readdir, utimes, chmod } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const study = join(root, 'docs/research/foresight');
const repo = resolve(process.argv[2] || join(root, '../Foresights'));
const results = JSON.parse(await readFile(join(study, 'results.json'), 'utf8'));
const temp = await mkdtemp(join(tmpdir(), 'axiom-foresight-package-'));
const output = join(root, 'public/research/foresight-methods-v1.zip');
const archive = temp + '.zip';
try {
  for (const [path, hash] of Object.entries(results.inputHashes)) {
    if (!path.startsWith('src/') || path.split('/').includes('..')) throw new Error('Unsafe input path');
    const bytes = execFileSync('git', ['-C', repo, 'show', results.sourceCommit + ':' + path]);
    if (createHash('sha256').update(bytes).digest('hex') !== hash) throw new Error('Input hash mismatch: ' + path);
    await mkdir(dirname(join(temp, path)), { recursive: true });
    await writeFile(join(temp, path), bytes);
  }
  for (const name of ['analysis.mjs', 'results.json', 'primary-checks.json', 'manuscript-v1.md']) {
    await writeFile(join(temp, name), await readFile(join(study, name)));
  }
  const attribution = await readFile(join(root, 'scripts/research/assets/foresight-thailand-upstream-README.md'));
  const attributionHash = createHash('sha256').update(attribution).digest('hex');
  if (attributionHash !== 'a5e6137fe27da9e58059066b8ab50340ae33c464b87e31dc6a89f18fd24486df') throw new Error('Upstream attribution changed; review before packaging');
  await writeFile(join(temp, 'UPSTREAM-thailand-README.md'), attribution);
  await writeFile(join(temp, 'snapshot-manifest.json'), JSON.stringify({
    sourceCommit: results.sourceCommit, inputHashes: results.inputHashes,
    upstreamAttribution: { source: 'https://github.com/apisit/thailand.json/blob/master/README.md', captured: '2026-11-05', sha256: attributionHash },
  }, null, 2) + '\n');
  await writeFile(join(temp, 'README.md'), `# Foresight Methods Supplement v1

Preprint - not peer-reviewed. Research: Poon Thiengburanathum. Analysis: Non Arkaraprasertkul.

With Node.js 22.13 or later (native TypeScript stripping):

    node --experimental-strip-types analysis.mjs --snapshot . --out reproduced.json

Compare reproduced.json with results.json. The snapshot contains only the eleven pinned
source files needed by the audit, not the private Git repository, application secrets,
or the unavailable full source reports. snapshot-manifest.json records their hashes.

The source pin is ${results.sourceCommit}. Results describe encoded rules, not policy
effects or calibrated forecasts. primary-checks.json captures selected later statistical
responses; differences do not establish errors at the original publication vintage.

Provided as inspection material for this owner-requested preprint. No blanket licence
to third-party statistics, reports or referenced publications is asserted. Consult their
original sources and terms. Province SVG geometry derives from apisit/thailand.json;
its MIT notice and copyright are preserved in UPSTREAM-thailand-README.md.
`);
  const files = [];
  async function collect(directory, prefix = '') {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const name = prefix + entry.name;
      if (entry.isDirectory()) await collect(join(directory, entry.name), name + '/');
      else files.push(name);
    }
  }
  await collect(temp);
  for (const name of files) {
    await chmod(join(temp, name), 0o644);
    await utimes(join(temp, name), new Date('2026-11-05T00:00:00Z'), new Date('2026-11-05T00:00:00Z'));
  }
  execFileSync('zip', ['-q', '-X', archive, ...files.sort()], { cwd: temp, env: { ...process.env, TZ: 'UTC' } });
  const bytes = await readFile(archive);
  // A released version must never be replaced silently by a later invocation.
  let existing;
  try { existing = await readFile(output); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (existing && !existing.equals(bytes)) throw new Error('Versioned supplement exists; create a new version rather than overwrite it');
  if (!existing) await writeFile(output, bytes);
  console.log(output);
} finally {
  await rm(archive, { force: true });
  await rm(temp, { recursive: true, force: true });
}
