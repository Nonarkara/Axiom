import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { validateResearch, safeURL, verifyDestinations, mainDocument, renderMain, bookData, build } from '../scripts/research/build.mjs';
import { researchCopy } from '../scripts/research/copy.mjs';

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
