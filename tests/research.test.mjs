import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { validateResearch, safeURL, verifyDestinations, mainDocument, renderMain, bookData, build } from '../scripts/research/build.mjs';
import { researchCopy } from '../scripts/research/copy.mjs';
import { geographyData } from '../scripts/research/geography.mjs';
import { createHash } from 'node:crypto';

const data = JSON.parse(await readFile(new URL('../data/research.json', import.meta.url), 'utf8'));
const one = () => structuredClone({ papers: [data.papers[0]] });

test('shared research dataset, local PDF bytes, hashes and generated artifacts agree', async () => {
  validateResearch(data);
  await verifyDestinations(data.papers);
  await build({ check: true });
  const context = { window: {} };
  runInNewContext(bookData(data.papers), context);
  assert.equal(JSON.stringify(context.window.AXIOM_RESEARCH.papers), JSON.stringify(data.papers));
  assert.match(renderMain(data.papers), /Pun Thiengburanathum/);
});

test('duplicate identity, PDF or publication/version is rejected', () => {
  for (const field of ['id', 'pdf', 'publication']) {
    const input = one();
    const second = { ...input.papers[0], id: 'different', pdf: 'https://example.org/different.pdf', title: 'Different title' };
    if (field === 'publication') second.title = input.papers[0].title.toUpperCase();
    else second[field] = input.papers[0][field];
    input.papers.push(second);
    assert.throws(() => validateResearch(input), /Duplicate/);
  }
});

test('unsafe URLs, non-PDF endpoints and malformed records fail closed', () => {
  for (const url of ['javascript:alert(1)', 'http://example.org/a.pdf', '//evil.org/a.pdf', '/%2e%2e/secret.pdf', '/a\\b.pdf', 'https://user:pass@example.org/a.pdf']) {
    assert.throws(() => safeURL(url));
  }
  for (const [key, value] of [['pdf', 'https://example.org/paper'], ['source', 'javascript:alert(1)'], ['date', '2026-02-30'], ['authors', []], ['status', 'Published']]) {
    const input = one();
    input.papers[0][key] = value;
    assert.throws(() => validateResearch(input));
  }
});

test('a 200 HTML soft error is not a PDF; remote PDFs need actual PDF bytes', async () => {
  const paper = { ...data.papers[0], pdf: 'https://example.org/paper.pdf' };
  await assert.rejects(verifyDestinations([paper], { fetcher: async () => new Response('<html>not found</html>') }), /Not PDF bytes/);
  await assert.rejects(verifyDestinations([paper], { fetcher: async () => new Response('missing', { status: 404 }) }), /HTTP 404/);
  await verifyDestinations([paper], { fetcher: async () => new Response('%PDF-1.7\nfixture') });
});

test('HTML escapes publication metadata and generation is idempotent', () => {
  const paper = { ...data.papers[0], title: '<script>alert("paper")</script>' };
  const html = mainDocument('before\n    <!-- ============== CREDENTIALS & STANDARDS ============== -->\nafter', [paper]);
  assert.ok(html.startsWith('before\n'));
  assert.ok(html.endsWith('\nafter'));
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.equal(mainDocument(html, [paper]), html);
});

test('all seven locales carry complete research interface and preprint qualification', () => {
  assert.deepEqual(Object.keys(researchCopy).sort(), ['en', 'ja', 'ko', 'th', 'ts', 'vi', 'zh']);
  for (const copy of Object.values(researchCopy)) {
    assert.deepEqual(Object.keys(copy).sort(), Object.keys(researchCopy.en).sort());
    for (const value of Object.values(copy)) assert.ok(typeof value === 'string' && value.length);
  }
});

test('unknown geography remains listable and unpinned; registered regions enforce sourced scope', () => {
  const unknown = one();
  unknown.papers[0].study = { region: null, label: 'Geography not established', scope: 'unspecified' };
  validateResearch(unknown);
  assert.match(renderMain(unknown.papers), /data-region="unmapped"/);
  for (const study of [
    { region: 'imaginary-place', label: 'Unknown', scope: 'provincial' },
    { region: 'chiang-mai', label: 'Chiang Mai', scope: 'national' },
    { region: null, label: 'Unknown', scope: 'regional' },
  ]) {
    const input = one();
    input.papers[0].study = study;
    assert.throws(() => validateResearch(input));
  }
  const missing = one();
  delete missing.papers[0].limitation;
  assert.throws(() => validateResearch(missing), /limitation/);
});

test('geography includes traceable approximate frames and independently sourced reference cities', async () => {
  const geo = geographyData();
  assert.equal(geo.provenance.retrieved, '2026-11-04');
  assert.match(geo.basemap.source, /ca96624a56bd078437bca8184e78163e5039ad19/);
  assert.equal(geo.basemap.license, 'Public domain');
  assert.equal(geo.basemap.features.length, 39);
  assert.deepEqual(geo.regions.find(region => region.id === 'gulf').bounds, [[10, 24], [42, 65]]);
  assert.match(geo.regions.find(region => region.id === 'gulf').source, /#page=4$/);
  for (const city of geo.provenance.cityReferences) {
    const rdf = await readFile(new URL('../scripts/research/assets/' + city.id + '.rdf', import.meta.url));
    assert.equal(createHash('sha256').update(rdf).digest('hex'), city.sourceSHA256);
    assert.ok(rdf.toString().includes('<wgs84_pos:lat>' + city.point[0] + '</wgs84_pos:lat>'));
    assert.ok(rdf.toString().includes('<wgs84_pos:long>' + city.point[1] + '</wgs84_pos:long>'));
    const region = geo.regions.find(region => region.id === city.id);
    assert.equal(region.kind, 'reference');
    assert.equal(region.scope, 'provincial');
    assert.ok(!region.bounds, 'a city reference cannot invent a province extent');
  }
});

test('both surfaces share local map/controller/CSS assets, and book Leaflet has verified SRI under unchanged CSP', async () => {
  for (const file of ['research-geography.js', 'research.css']) {
    assert.equal(await readFile(new URL('../public/' + file, import.meta.url), 'utf8'), await readFile(new URL('../axiomx/' + file, import.meta.url), 'utf8'));
  }
  const controller = await readFile(new URL('../public/research-ui.js', import.meta.url), 'utf8');
  assert.equal(await readFile(new URL('../axiomx/research-ui.js', import.meta.url), 'utf8'), '// Generated from public/research-ui.js.\n' + controller);
  assert.doesNotMatch(controller, /tileLayer|setInterval|flyTo|fetch\(/);
  const html = await readFile(new URL('../axiomx/index.html', import.meta.url), 'utf8');
  for (const file of ['leaflet.js', 'leaflet.css']) {
    const bytes = await readFile(new URL('../axiomx/vendor/leaflet/' + file, import.meta.url));
    const integrity = 'sha256-' + createHash('sha256').update(bytes).digest('base64');
    assert.ok(html.includes('vendor/leaflet/' + file + '" integrity="' + integrity));
  }
  const headers = await readFile(new URL('../axiomx/_headers', import.meta.url), 'utf8');
  assert.match(headers, /script-src 'self';/);
  assert.ok(!headers.includes('unpkg.com'));
  assert.match(html, /<noscript><div class="research-noscript">/);
});

test('book PDFs preserve the reader and English summary metadata is escaped', () => {
  const input = one();
  input.papers[0].evidence = '<img src=x onerror=alert(1)>';
  const context = { window: {} };
  runInNewContext(bookData(input.papers), context);
  const html = context.window.AXIOM_RESEARCH.html;
  assert.match(html, /download target="_blank" rel="noopener"/);
  assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));
  assert.ok(!html.includes('<img src=x'));
  assert.match(html, /<dd lang="en">/);
  assert.match(html, /data-research-map role="region"/);
});
