#!/usr/bin/env node
// Guard the reading room's plate discipline.
//
// The book is a memory palace: each system, and each of the book's own
// entry screens, carries one famous work of art, and the picture has to
// explain the system it stands beside. These checks stop that from
// rotting back into a set of decorative pictures.
//
//   node .qa/axiomx-plates.mjs
//
// Run it from the repo root. It reads the built book, not the network.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
global.window = {};
await import('file://' + join(root, 'axiomx/plates.js'));
const PLATES = global.window.AXIOM_PLATES;
global.window = {};
await import('file://' + join(root, 'axiomx/catalog.js'));
await import('file://' + join(root, 'axiomx/ebooks.js'));
const SYSTEMS = global.window.AXIOM_SYSTEMS.concat(global.window.AXIOM_EBOOKS);

const reader = readFileSync(join(root, 'axiomx/reader.js'), 'utf8');

let pass = 0;
let fail = 0;
function check(ok, label, detail) {
  if (ok) { pass++; console.log('  ✓ ' + label); }
  else { fail++; console.log('  ✗ ' + label + (detail ? ' — ' + detail : '')); }
}

// ── 1. the shape of a plate ────────────────────────────────────────────────
console.log('\nplate shape');
const bad = [];
for (const [key, p] of Object.entries(PLATES)) {
  if (p.length !== 10) bad.push(key + ' has ' + p.length + ' fields');
  else if (!p[0] || !p[1] || !p[2] || !p[3] || !p[4] || !p[5] || !p[6] || !p[7] || !p[8] || !p[9]) bad.push(key + ' has an empty field');
}
check(bad.length === 0, 'every plate carries all ten fields', bad.slice(0, 4).join('; '));

// ── 2. licence ─────────────────────────────────────────────────────────────
console.log('\nlicence');
const OK_LIC = new Set(['Public domain', 'CC0']);
const badLic = Object.entries(PLATES).filter(([, p]) => !OK_LIC.has(p[5]));
check(badLic.length === 0, 'every plate is Public domain or CC0',
  badLic.map(([k, p]) => k + ' → ' + p[5]).slice(0, 4).join('; '));

// ── 3. one picture, once ───────────────────────────────────────────────────
console.log('\nthe palace');
const seen = new Map();
const dupes = [];
for (const [key, p] of Object.entries(PLATES)) {
  const id = p[4];
  if (seen.has(id)) dupes.push(key + ' and ' + seen.get(id) + ' share one file');
  else seen.set(id, key);
}
check(dupes.length === 0, 'no picture is used twice', dupes.slice(0, 3).join('; '));

// ── 4. the artist spread ───────────────────────────────────────────────────
console.log('\nartist spread');
const byArtist = {};
for (const p of Object.values(PLATES)) byArtist[p[0]] = (byArtist[p[0]] || 0) + 1;
const heavy = Object.entries(byArtist).filter(([, n]) => n > 3);
check(heavy.length === 0, 'no artist carries more than three plates',
  heavy.map(([a, n]) => a + ' ×' + n).join('; '));
console.log('    ' + Object.keys(byArtist).length + ' artists across ' + Object.keys(PLATES).length + ' plates');

// ── 5. every system has a plate ────────────────────────────────────────────
console.log('\nsystems');
const noPlate = SYSTEMS.filter((s) => !PLATES[s.id]);
check(noPlate.length === 0, 'every system carries a plate',
  noPlate.map((s) => s.id).join(', '));

// ── 6. no empty entry screens ──────────────────────────────────────────────
// Every page in the book is either a system, a method page, a field note, a
// brand sheet, or one of the book's own entries — and the book's own entries
// each carry an artwork. A page with nothing on it is a hole in the palace.
console.log('\nentry screens');
const BOOK_PLATES = ['page-hero', 'page-problem', 'page-room', 'page-step-1', 'page-step-2',
  'page-step-3', 'page-changed', 'page-questions', 'page-catalogue',
  'iaas', 'probono', 'stages', 'non', 'poon', 'collective', 'press', 'entity',
  'standards', 'ledger', 'brief', 'plates', 'colophon'];
const missingBook = BOOK_PLATES.filter((k) => !PLATES[k]);
check(missingBook.length === 0, 'every entry screen has its own plate', missingBook.join(', '));

// every plate that is not a system plate must actually be used by a page
const used = new Set([...SYSTEMS.map((s) => s.id), ...BOOK_PLATES,
  'note-1', 'note-2', 'note-3', 'note-4', 'note-5', 'note-6', 'stack']);
const orphans = Object.keys(PLATES).filter((k) => !used.has(k));
check(orphans.length === 0, 'no plate is orphaned', orphans.join(', '));

// ── 7. the plate sits where the eye lands ──────────────────────────────────
// The house position for a page artwork is: heading, lede, plate, body. The
// three step plates are the exception — they belong inside the numbered step
// they illustrate, so they are placed there rather than above the list.
console.log('\ncomposition');
const placed = new Set();
for (const m of reader.matchAll(/plate: '([a-z0-9-]+)'/g)) placed.add(m[1]);
const wanted = BOOK_PLATES.filter((k) => k !== 'page-hero');
const notWired = wanted.filter((k) => !placed.has(k));
check(notWired.length === 0, 'every entry screen places its plate in the body',
  notWired.join(', '));

// ── 8. the group covers index their children ───────────────────────────────
console.log('\ngroup covers');
check(/probono[\s\S]{0,1400}probono\.map/.test(reader),
  'the pro bono cover lists the five institutions it contains');
check(/stages[\s\S]{0,2000}stages\.map/.test(reader),
  'the stages cover lists the five stops it contains');

console.log('\n' + pass + ' PASS, ' + fail + ' FAIL');
process.exit(fail ? 1 : 0);
