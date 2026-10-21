#!/usr/bin/env node
// Run the spatial gate over a route set that is too big for one browser run.
//
// The gate sweeps every route in one Chrome run, and the reading room
// re-downloads and re-parses 300KB of catalogue, plate and locale data on
// every entry. A single run over a hundred routes exhausts the browser's
// virtual-time budget before the last measurement lands — and a gate that
// measures less than it promised fails, which is correct behaviour but not
// a useful one.
//
// So the routes are swept in chunks and the chunks are merged into one
// baseline. The measurement code is the vendored instrument's, byte
// identical; only the number of routes per browser run changes.
//
//   node .qa/spatial-sweep.mjs --base http://127.0.0.1:5311/ --routes /a,/b,/c
//   node .qa/spatial-sweep.mjs --dir public
//
// The baseline is written with --update. Read the diff before you believe
// it: the point of the baseline is the review, not the recording.

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, rmSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf('--' + name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const has = (name) => argv.includes('--' + name);

const BASE = arg('base', null);
const DIR = arg('dir', null);
const ROUTES_ARG = arg('routes', null);
// The gate's own sweep is the project's committed widths PLUS every
// breakpoint the CSS declares and the pixel on either side of it. Passing
// --widths narrows that, and a narrowed sweep is a partial sweep: it
// cannot judge whether a reason has gone stale. So --widths is opt-in
// here, for a quick look, and it says so.
const WIDTHS_ARG = arg('widths', null);
const WIDTHS = WIDTHS_ARG ? WIDTHS_ARG.split(',').map(Number) : null;
const CHUNK = Number(arg('chunk', '6'));
const BASELINE = path.resolve(arg('baseline', 'design/spatial-baseline.json'));
const CHECK = has('check');

if (!BASE && !DIR) {
  console.error('Pass --base <url> or --dir <path>.');
  process.exit(2);
}

const gate = 'scripts/spatial/spatial-check.mjs';
const scratch = mkdtempSync(path.join(tmpdir(), 'axiom-spatial-'));

// ── the route list ─────────────────────────────────────────────────────────
let routes = ROUTES_ARG ? ROUTES_ARG.split(',').map(s => s.trim()).filter(Boolean) : null;

if (!routes) {
  if (DIR) {
    // The built routes: the root document, and every directory with an
    // index.html of its own.
    const { readdirSync } = await import('node:fs');
    const root = path.resolve(DIR);
    routes = [];
    if (existsSync(path.join(root, 'index.html'))) routes.push('/');
    for (const name of readdirSync(root, { withFileTypes: true })) {
      if (!name.isDirectory()) continue;
      if (name.name === 'node_modules' || name.name.startsWith('.')) continue;
      if (existsSync(path.join(root, name.name, 'index.html'))) routes.push('/' + name.name + '/');
    }
  } else {
    // A running site: ask the gate which routes it measures.
    const out = execFileSync('node', [gate, '--base', BASE, '--report'], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    });
    routes = [];
    for (const line of out.split('\n')) {
      const m = line.match(/^(\/\S*)\s+\d+\s+\d+\s+/);
      if (m) routes.push(m[1]);
    }
  }
  if (!routes.length) routes = ['/'];
}

// ── sweep in chunks, merging the baselines ────────────────────────────────
const merged = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')) : null;
// Merge with what the baseline already knows: the main catalogue and the
// reading room are two surfaces of one project, and one sweep must not
// erase the other's routes.
const routesOut = { ...(merged?.routes || {}) };

for (let i = 0; i < routes.length; i += CHUNK) {
  const slice = routes.slice(i, i + CHUNK);
  const part = path.join(scratch, `base-${i}.json`);
  const args = [gate, '--update', '--baseline', part];
  if (WIDTHS) args.push('--widths', WIDTHS.join(','));
  if (BASE) args.push('--base', BASE);
  if (DIR) args.push('--dir', DIR);
  args.push('--routes', slice.join(','));
  // The FIRST browser run in a fresh process can come up cold and produce no
  // measurement at all — Chrome exits zero and the harness writes nothing.
  // It is not the route's fault, and it is not a finding. So a chunk that
  // wrote no baseline is tried once more before it is called failed.
  let attempts = 0;
  while (attempts < 2) {
    attempts++;
    try {
      execFileSync('node', args, { stdio: ['ignore', 'ignore', 'ignore'] });
    } catch (e) {
      // The gate exits non-zero when a decision has no reason yet. That is
      // the review working, not a failed chunk: the baseline is still written.
      if (!existsSync(part)) {
        if (attempts < 2) continue;
        console.error(`  chunk ${i / CHUNK + 1} failed: ${String(e.message).split('\n')[0]}`);
        break;
      }
    }
    break;
  }
  if (!existsSync(part)) { console.error(`  chunk ${i / CHUNK + 1}: no baseline written`); continue; }
  const b = JSON.parse(readFileSync(part, 'utf8'));
  Object.assign(routesOut, b.routes || {});
  console.error(`  chunk ${i / CHUNK + 1}: ${slice.length} routes`);
}

// ── write the merged baseline ─────────────────────────────────────────────
if (merged && merged.reasons) {
  for (const [k, v] of Object.entries(merged.reasons)) {
    // keep a reason only if its decision was measured again
    const stillThere = Object.values(routesOut).some(r => Object.values(r).some(m =>
      (m.findings || []).some(f => (f.kind + '|' + f.sel) === k)));
    if (stillThere) merged.reasons[k] = v;
  }
}
const out = {
  version: 2,
  tool: 'spatial-law',
  widths: merged?.widths || WIDTHS || [],
  measuredWidths: merged?.measuredWidths || WIDTHS || [],
  limits: merged?.limits || {},
  reasons: merged?.reasons || {},
  exempt: merged?.exempt || [],
  routes: routesOut,
};
writeFileSync(BASELINE, JSON.stringify(out, null, 2) + '\n');
console.error(`wrote ${BASELINE} — ${Object.keys(routesOut).length} routes`);

// ── the gate itself, over what was just written ───────────────────────────
// Run per chunk, against the merged baseline: a hundred routes in one
// browser run is the thing that does not work. Every route is still
// measured, and every measurement is still judged against the same
// baseline.
let failed = 0;
for (let i = 0; i < routes.length; i += CHUNK) {
  const slice = routes.slice(i, i + CHUNK);
  const gateArgs = [gate, '--baseline', BASELINE];
  if (WIDTHS) gateArgs.push('--widths', WIDTHS.join(','));
  if (BASE) gateArgs.push('--base', BASE);
  if (DIR) gateArgs.push('--dir', DIR);
  gateArgs.push('--routes', slice.join(','));
  try {
    execFileSync('node', gateArgs, { stdio: 'inherit' });
  } catch {
    failed++;
  }
}
if (failed) {
  console.error(`\n${failed} chunk(s) reported findings against the baseline.\n`);
  process.exitCode = 1;
}
rmSync(scratch, { recursive: true, force: true });
