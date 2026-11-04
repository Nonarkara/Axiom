import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { researchCopy } from './copy.mjs';
import { createHash } from 'node:crypto';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const START = '<!-- research:generated:start -->';
const END = '<!-- research:generated:end -->';
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const json = value => JSON.stringify(value, null, 2).replace(/</g, '\\u003c');

export function safeURL(value, field = 'URL') {
  if (typeof value !== 'string' || !value || /[\s\\\u0000-\u001f]/.test(value)) throw new Error(`Invalid ${field}`);
  if (value.startsWith('/') && !value.startsWith('//')) {
    const decoded = decodeURIComponent(value.split(/[?#]/)[0]);
    if (decoded.includes('\\') || decoded.split('/').includes('..') || decoded.startsWith('//')) throw new Error(`Unsafe ${field}`);
  } else {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error(`Unsafe ${field}`);
  }
  return value;
}

export function validateResearch(data) {
  if (!data || !Array.isArray(data.papers)) throw new Error('Expected {papers: [...]}');
  const seen = { id: new Set(), pdf: new Set(), publication: new Set() };
  for (const paper of data.papers) {
    for (const key of ['id', 'title', 'system', 'version', 'date', 'pdf', 'source']) {
      if (typeof paper[key] !== 'string' || !paper[key].trim()) throw new Error(`Missing ${key}`);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(paper.id)) throw new Error(`Invalid id: ${paper.id}`);
    if (!Array.isArray(paper.authors) || !paper.authors.length || paper.authors.some(a => typeof a !== 'string' || !a.trim())) throw new Error(`Missing authors: ${paper.id}`);
    if (paper.status !== 'Preprint') throw new Error(`Expected Preprint: ${paper.id}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(paper.date) || new Date(paper.date).toISOString().slice(0, 10) !== paper.date) throw new Error(`Invalid date: ${paper.id}`);
    safeURL(paper.pdf, 'pdf');
    safeURL(paper.source, 'source');
    const pdf = new URL(paper.pdf, 'https://axiom.nonarkara.org');
    if (!decodeURIComponent(pdf.pathname).toLowerCase().endsWith('.pdf')) throw new Error(`Not a PDF destination: ${paper.id}`);
    const keys = { id: paper.id, pdf: pdf.origin + pdf.pathname, publication: paper.title.trim().toLowerCase() + ':' + paper.version.trim().toLowerCase() };
    for (const [key, value] of Object.entries(keys)) {
      if (seen[key].has(value)) throw new Error(`Duplicate ${key}: ${value}`);
      seen[key].add(value);
    }
  }
  return data.papers;
}

export function localPDFPath(pdf) {
  const url = new URL(pdf, 'https://axiom.nonarkara.org');
  return url.origin === 'https://axiom.nonarkara.org' ? url.pathname : null;
}

export async function verifyDestinations(papers, { root = ROOT, fetcher = fetch } = {}) {
  for (const paper of papers) {
    let bytes;
    const local = localPDFPath(paper.pdf);
    if (local) {
      const path = resolve(root, 'public', '.' + decodeURIComponent(local));
      if (!path.startsWith(resolve(root, 'public') + sep)) throw new Error('PDF escapes public root');
      bytes = await readFile(path);
    } else {
      const response = await fetcher(paper.pdf, { headers: { Range: 'bytes=0-1023' }, signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error(`PDF HTTP ${response.status}: ${paper.pdf}`);
      safeURL(response.url || paper.pdf, 'PDF redirect');
      const reader = response.body.getReader();
      const chunks = [];
      let size = 0;
      try {
        while (size < 1024) {
          const { value, done } = await reader.read();
          if (done) break;
          chunks.push(Buffer.from(value));
          size += value.length;
        }
      } finally { await reader.cancel(); }
      bytes = Buffer.concat(chunks);
    }
    if (!bytes.subarray(0, 1024).includes(Buffer.from('%PDF-'))) throw new Error(`Not PDF bytes: ${paper.pdf}`);
    if (local && paper.sha256 && createHash('sha256').update(bytes).digest('hex') !== paper.sha256) throw new Error(`PDF hash mismatch: ${paper.id}`);
  }
}

export function renderMain(papers) {
  const text = (key, tag = 'span') => `<${tag} data-i18n="research.${key}">${escape(researchCopy.en[key])}</${tag}>`;
  const systems = [...new Set(papers.map(p => p.system))];
  const options = systems.map(system => `<option value="${escape(system)}">${escape(system)} (${papers.filter(p => p.system === system).length})</option>`).join('');
  const rows = papers.map(p => `        <article class="research-row" data-paper="${escape(p.id)}" data-system="${escape(p.system)}">
          <h3 lang="en">${escape(p.title)}</h3>
          <p class="research-meta">${escape(p.authors.join(', '))} · <time datetime="${p.date}">${p.date}</time> · ${escape(p.system)} · ${escape(p.version)}</p>
          <div class="research-actions"><a href="${escape(p.pdf)}" download>${text('pdf')}</a><a href="${escape(p.source)}" target="_blank" rel="noopener">${text('source')}</a></div>
        </article>`).join('\n');
  return `${START}
    <section class="section research-library" id="research" aria-labelledby="research-title">
      <h2 class="t-title" id="research-title" data-i18n="research.title">Research</h2>
      ${text('notice', 'p')}
      <label class="research-filter">${text('system')} <select data-research-filter><option value="" data-i18n="research.all">${escape(researchCopy.en.all)}</option>${options}</select></label>
      <div class="research-list">
${rows || '        ' + text('empty', 'p')}
      </div>
    </section>
    ${END}`;
}

export function mainDocument(html, papers) {
  const content = renderMain(papers);
  if (html.includes(START) && html.includes(END)) return html.slice(0, html.indexOf(START)) + content + html.slice(html.indexOf(END) + END.length);
  const anchor = '    <!-- ============== CREDENTIALS & STANDARDS ============== -->';
  if (!html.includes(anchor)) throw new Error('Research insertion anchor missing');
  return html.replace(anchor, '    ' + content + '\n\n' + anchor);
}

export function bookData(papers) {
  return '// Generated by scripts/research/build.mjs. Edit data/research.json.\nwindow.AXIOM_RESEARCH = ' + json({ papers, copy: researchCopy }) + ';\n';
}

export async function build({ root = ROOT, check = false, verify = false } = {}) {
  const papers = validateResearch(JSON.parse(await readFile(resolve(root, 'data/research.json'), 'utf8')));
  // Local PDFs must exist even when network verification was not requested.
  await verifyDestinations(papers.filter(p => localPDFPath(p.pdf)), { root });
  if (verify) await verifyDestinations(papers.filter(p => !localPDFPath(p.pdf)), { root });
  const index = resolve(root, 'public/index.html');
  const html = await readFile(index, 'utf8');
  const outputs = new Map([
    [index, mainDocument(html, papers)],
    [resolve(root, 'axiomx/research.js'), bookData(papers)],
    [resolve(root, 'public/research.js'), '// Generated by scripts/research/build.mjs.\nwindow.AXIOM_RESEARCH_COPY = ' + json(researchCopy) + ';\n'],
  ]);
  for (const [file, value] of outputs) {
    if (check) {
      if (await readFile(file, 'utf8') !== value) throw new Error(`Stale research artifact: ${file}`);
    } else await writeFile(file, value);
  }
  return papers.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  build({ check: process.argv.includes('--check'), verify: process.argv.includes('--verify') })
    .then(count => console.log(`Research: ${count} preprints; ${process.argv.includes('--check') ? 'artifacts current' : 'generated'}`))
    .catch(error => { console.error(error.message); process.exitCode = 1; });
}
