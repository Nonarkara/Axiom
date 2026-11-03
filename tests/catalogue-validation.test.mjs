import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { loadCatalogue, ROOT } from '../scripts/catalogue/lib.mjs';
import { validateCatalogue } from '../scripts/catalogue/validate.mjs';

const fixture = () => structuredClone(loadCatalogue());
const link = (source) => source.systems.systems.find((s) => s.variant === 'link');
const soon = (source) => source.systems.systems.find((s) => s.variant === 'soon');
const editions = (source) => source.systems.systems.find((s) => s.variant === 'editions');

// Feed fixtures through the actual generator without changing any source or
// artefact on disk. The CLI path counts writes and artefact reads before failure.
function generate(source, cli = false) {
  const child = spawnSync(process.execPath, ['--input-type=module', '-e', `
    import fs from 'node:fs';
    import path from 'node:path';
    import { pathToFileURL } from 'node:url';
    import vm from 'node:vm';
    const { source, cli } = JSON.parse(fs.readFileSync(0, 'utf8'));
    const read = fs.readFileSync;
    let writes = 0;
    const artefactReads = [];
    fs.readFileSync = function(file, ...args) {
      if (String(file).endsWith('/data/catalogue/systems.json')) return JSON.stringify(source.systems);
      if (/\\/(public|axiomx)\\//.test(String(file))) artefactReads.push(String(file));
      return read.call(this, file, ...args);
    };
    fs.writeFileSync = () => { writes++; };
    const entry = path.resolve('scripts/catalogue/build.mjs');
    if (cli) process.argv[1] = entry;
    try {
      const { ARTEFACTS } = await import(pathToFileURL(entry));
      const html = cli ? undefined : ARTEFACTS['public/index.html']();
      const scriptErrors = [];
      if (!cli) for (const [name, build] of Object.entries(ARTEFACTS)) {
        if (!name.endsWith('.js')) continue;
        try { new vm.Script(build(), { filename: name }); }
        catch (error) { scriptErrors.push(name + ': ' + error.message); }
      }
      console.log(JSON.stringify({ writes, artefactReads, html, scriptErrors }));
    } catch (error) {
      console.log(JSON.stringify({ writes, artefactReads, error: error.message }));
    }
  `], {
    cwd: ROOT, encoding: 'utf8', input: JSON.stringify({ source, cli }),
    maxBuffer: 4 * 1024 * 1024,
  });
  assert.equal(child.status, 0, child.stderr);
  return JSON.parse(child.stdout);
}

test('the current catalogue passes variant, destination and image validation', () => {
  assert.doesNotThrow(() => validateCatalogue(loadCatalogue()));
});

const invalid = [
  ['misspelled variant', (c) => { soon(c).variant = 'sooon'; }, /variant/],
  ['missing variant', (c) => { delete link(c).variant; }, /variant/],
  ['link missing href', (c) => { delete link(c).href; }, /href/],
  ['soon with href', (c) => { soon(c).href = 'https://example.org/'; }, /href/],
  ['link with edition data', (c) => { link(c).edition = editions(c).edition; }, /edition/],
  ['soon with edition data', (c) => { soon(c).edition = editions(c).edition; }, /edition/],
  ['editions missing primary href', (c) => { editions(c).href = ''; }, /href/],
  ['editions missing data', (c) => { editions(c).edition = null; }, /edition/],
  ['edition missing href', (c) => { delete editions(c).edition.href; }, /edition.href/],
  ['edition with wrong copy key', (c) => { editions(c).edition.key = 'panels.wrong.original'; }, /edition.key/],
  ['edition missing localized label', (c) => { delete editions(c).copy.th.original; }, /copy.th.original/],
  ['javascript destination', (c) => { link(c).href = 'javascript:alert(1)'; }, /href/],
  ['HTTP destination', (c) => { link(c).href = 'http://example.org/'; }, /href/],
  ['relative destination', (c) => { link(c).href = '/local'; }, /href/],
  ['malformed destination', (c) => { link(c).href = 'https://'; }, /href/],
  ['credential destination', (c) => { link(c).href = 'https://user:secret@example.org/'; }, /href/],
  ['credential edition', (c) => { editions(c).edition.href = 'https://user@example.org/'; }, /edition.href/],
  ['destination quote injection', (c) => { link(c).href = 'https://example.org/" onclick="alert(1)'; }, /href/],
  ['destination control character', (c) => { link(c).href = 'https://exam\nple.org/'; }, /href/],
  ['destination backslash', (c) => { link(c).href = 'https://example.org/\\other'; }, /href/],
  ['identifier quote injection', (c) => { link(c).id += '" onclick="alert(1)'; }, /\.id:/],
  ['identifier trailing newline', (c) => { link(c).id += '\n'; }, /\.id:/],
  ['DOM id quote injection', (c) => { link(c).domId = '" onclick="alert(1)'; }, /domId/],
  ['remote image', (c) => { link(c).image.src = 'https://example.org/image.png'; }, /image.src/],
  ['protocol-relative image', (c) => { link(c).image.src = '//example.org/image.png'; }, /image.src/],
  ['absolute image', (c) => { link(c).image.src = '/image.png'; }, /image.src/],
  ['traversal image', (c) => { link(c).image.src = 'screenshots/../private.png'; }, /image.src/],
  ['encoded traversal image', (c) => { link(c).image.src = 'screenshots/%2e%2e/private.png'; }, /image.src/],
  ['backslash image', (c) => { link(c).image.src = 'screenshots\\image.png'; }, /image.src/],
  ['image trailing newline', (c) => { link(c).image.src = 'screenshots/image.png\n'; }, /image.src/],
  ['image quote injection', (c) => { link(c).image.src = 'image.png" onerror="alert(1)'; }, /image.src/],
  ['WebP srcset injection', (c) => { link(c).image.webp = 'image.webp, https://example.org/a.webp'; }, /image.webp/],
  ['WebP srcset whitespace', (c) => { link(c).image.webp = 'screenshots/two words.webp'; }, /image.webp/],
  ['dimension quote injection', (c) => { link(c).image.width = '1" onload="alert(1)'; }, /dimensions/],
  ['unpaired dimensions', (c) => { link(c).image.width = 100; link(c).image.height = null; }, /dimensions/],
  ['crop quote injection', (c) => { link(c).image.crop = 'top" onclick="alert(1)'; }, /image.crop/],
  ...[false, 'false', null].map((value) => [
    `unsupported full flag ${JSON.stringify(value)}`, (c) => { link(c).full = value; }, /full/,
  ]),
];

for (const [name, mutate, expected] of invalid) {
  test(`rejects ${name}`, () => {
    const source = fixture();
    mutate(source);
    assert.throws(() => validateCatalogue(source), expected);
  });
}

test('CLI rejects a late invalid record before reading or writing any artefact', () => {
  const source = fixture();
  source.systems.systems.at(-1).href = 'javascript:alert(1)';
  const result = generate(source, true);
  assert.match(result.error, /href/);
  assert.equal(result.writes, 0);
  assert.deepEqual(result.artefactReads, []);
});

test('generated attributes escape text and URLs while preserving native variants', () => {
  const source = fixture();
  const primary = link(source);
  primary.href = 'https://example.org/?a=1&b=2';
  primary.image.alt = 'A "quote" & <tag> and \'apostrophe\'';
  editions(source).edition.href = 'https://example.org/original?a=1&b=2';
  const result = generate(source);
  assert.equal(result.error, undefined);
  assert.equal(result.writes, 0);
  assert.match(result.html, /href="https:\/\/example.org\/\?a=1&amp;b=2" target="_blank" rel="noopener"/);
  assert.match(result.html, /alt="A &quot;quote&quot; &amp; &lt;tag&gt; and &#39;apostrophe&#39;"/);
  assert.match(result.html, /<div class="sys-cell sys-cell--soon" data-arch="tkcx">/);
  assert.match(result.html, /<a class="sys-cell__primary" href="https:\/\/dao.nonarkara.org\/" target="_blank" rel="noopener">/);
  assert.match(result.html, /<a class="sys-cell__edition" href="https:\/\/example.org\/original\?a=1&amp;b=2" target="_blank" rel="noopener"/);
  assert.match(result.html, /sys-cell--full/);
});

test('local filenames with spaces and existing crop windows remain valid', () => {
  const source = fixture();
  link(source).image.src = 'photos/products/SLIC Index.png';
  link(source).image.crop = 'lower';
  assert.doesNotThrow(() => validateCatalogue(source));
  link(source).image.crop = 'middle';
  assert.doesNotThrow(() => validateCatalogue(source));
});

test('accepted copy with CR and Unicode separators emits parseable JavaScript', () => {
  const source = fixture();
  link(source).copy.en.name = 'First\rSecond\u2028Third\u2029Fourth';
  const result = generate(source);
  assert.equal(result.error, undefined);
  assert.deepEqual(result.scriptErrors, []);
});

test('static counts and proof fallback follow catalogue changes without hand edits', () => {
  const source = fixture();
  source.systems.systems.pop();
  const total = source.systems.systems.length;
  const live = source.systems.systems.filter(system => system.status === 'live').length;
  const lab = source.systems.systems.filter(system => system.cluster === 'Lab').length;
  const result = generate(source);
  assert.equal(result.error, undefined);
  assert.match(result.html, new RegExp('data-count="catalog">' + total + '</span>'));
  assert.match(result.html, new RegExp('data-count="live">' + live + '</span>'));
  assert.match(result.html, new RegExp('data-i18n="sysClusters.labMeta">[^<]*' + lab + '</div>'));
  assert.match(result.html, new RegExp('data-i18n="pitch.proofLine"[^>]*>' + total + ' systems'));
  assert.deepEqual(result.scriptErrors, []);
});
