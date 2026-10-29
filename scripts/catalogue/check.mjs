#!/usr/bin/env node
/**
 * The catalogue gate.
 *
 * One catalogue, six renderings. Nothing keeps them in step except this:
 * the generator writes the artefacts from `data/catalogue/`, and the gate
 * regenerates them in memory and refuses the commit if what is on disk
 * disagrees with the source.
 *
 * The failure it exists to catch is the one that already happened: the two
 * renderings drifted apart for months and every test was green, because each
 * test looked at one file at a time.
 *
 *   node scripts/catalogue/check.mjs
 *
 * Exit code 0 = every artefact matches the source of truth.
 */

import { ARTEFACTS } from './build.mjs';
import { read } from './lib.mjs';

let drift = 0;
for (const [file, build] of Object.entries(ARTEFACTS)) {
  let built;
  try {
    built = build();
  } catch (error) {
    drift++;
    console.error(`  ERROR ${file} — ${error.message}`);
    continue;
  }
  const current = read(file);
  if (current === built) {
    console.log(`  ok    ${file}`);
    continue;
  }
  drift++;
  console.error(`  DRIFT ${file}`);
  const currentLines = current.split('\n');
  const builtLines = built.split('\n');
  const first = (() => {
    for (let i = 0; i < Math.max(currentLines.length, builtLines.length); i++) {
      if (currentLines[i] !== builtLines[i]) return i + 1;
    }
    return 0;
  })();
  console.error(`        line ${first}: committed "${(currentLines[first - 1] || '').trim().slice(0, 90)}"`);
  console.error(`                 generated "${(builtLines[first - 1] || '').trim().slice(0, 90)}"`);
  console.error(`        committed ${current.length} bytes, generated ${built.length} bytes`);
}

if (drift) {
  console.error(`\nFAIL — ${drift} artefact(s) disagree with data/catalogue/.`);
  console.error('Run: node scripts/catalogue/build.mjs');
  process.exit(1);
}
console.log('\nPASS — every artefact matches the source of truth.');
