import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile, cp, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const version = '6.5.438';
const source = `https://registry.npmjs.org/pdfjs-dist/-/pdfjs-dist-${version}.tgz`;
const integrity = 'vg8Pw1x+AFKy4AMDvhuWl5cOYV8d698UoEANoFFhc79hqXDnZQqnOXoxw3HG907WHOg1JYOvLhP756boddFxpA==';
const folder = resolve(`public/vendor/pdfjs-${version}`);
const temp = await mkdtemp(join(tmpdir(), 'axiom-pdfjs-'));
try {
  const response = await fetch(source);
  if (!response.ok) throw new Error('PDF.js download failed');
  const bytes = Buffer.from(await response.arrayBuffer());
  if (createHash('sha512').update(bytes).digest('base64') !== integrity) throw new Error('PDF.js integrity mismatch');
  await writeFile(join(temp, 'source.tgz'), bytes);
  execFileSync('tar', ['-xzf', join(temp, 'source.tgz'), '-C', temp]);
  await mkdir(folder, { recursive: true });
  for (const name of ['pdf', 'pdf.worker', 'pdf.renderer']) {
    const path = join(temp, 'package/build', name + '.min.mjs');
    try { await cp(path, join(folder, name + '.mjs')); } catch (error) { if (error.code !== 'ENOENT' || name !== 'pdf.renderer') throw error; }
  }
  for (const name of ['standard_fonts', 'cmaps', 'wasm', 'LICENSE']) await cp(join(temp, 'package', name), join(folder, name), { recursive: true });
  const files = {};
  async function index(directory, prefix = '') {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const name = prefix + entry.name;
      if (entry.isDirectory()) await index(join(directory, entry.name), name + '/');
      else files[name] = createHash('sha256').update(await readFile(join(directory, entry.name))).digest('hex');
    }
  }
  await index(folder);
  await writeFile(join(folder, 'provenance.json'), JSON.stringify({ version, source, integrity: 'sha512-' + integrity, files }, null, 2) + '\n');
  const icons = resolve('public/vendor/lucide');
  await mkdir(icons, { recursive: true });
  for (const name of ['book-open', 'download', 'external-link', 'info', 'x', 'chevron-left', 'chevron-right', 'zoom-in', 'zoom-out', 'scan']) {
    const response = await fetch(`https://raw.githubusercontent.com/lucide-icons/lucide/0.468.0/icons/${name}.svg`);
    if (!response.ok) throw new Error('Icon download failed: ' + name);
    await writeFile(join(icons, name + '.svg'), await response.text());
  }
  const license = await fetch('https://raw.githubusercontent.com/lucide-icons/lucide/0.468.0/LICENSE');
  if (!license.ok) throw new Error('Icon licence unavailable');
  await writeFile(join(icons, 'LICENSE'), await license.text());
  console.log('Vendored PDF.js ' + version + ' with source integrity and Lucide 0.468.0 icons.');
} finally { await rm(temp, { recursive: true, force: true }); }
