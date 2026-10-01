#!/usr/bin/env node
/** Download missing self-hosted OFL fonts. Never rewrite public/index.html. */
import { mkdir, writeFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'fonts');

const files = [
  ['IBMPlexSansThai-Regular.woff2', 'https://cdn.jsdelivr.net/npm/@ibm/plex-sans-thai@1.1.0/fonts/complete/woff2/IBMPlexSansThai-Regular.woff2'],
  ['IBMPlexSansThai-Medium.woff2', 'https://cdn.jsdelivr.net/npm/@ibm/plex-sans-thai@1.1.0/fonts/complete/woff2/IBMPlexSansThai-Medium.woff2'],
  ['IBMPlexSansThai-SemiBold.woff2', 'https://cdn.jsdelivr.net/npm/@ibm/plex-sans-thai@1.1.0/fonts/complete/woff2/IBMPlexSansThai-SemiBold.woff2'],
  ['IBMPlexSansThai-Bold.woff2', 'https://cdn.jsdelivr.net/npm/@ibm/plex-sans-thai@1.1.0/fonts/complete/woff2/IBMPlexSansThai-Bold.woff2'],
  ['NotoSansKR-Regular.woff2', 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-kr@5.2.5/files/noto-sans-kr-korean-400-normal.woff2'],
  ['NotoSansKR-Medium.woff2', 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-kr@5.2.5/files/noto-sans-kr-korean-500-normal.woff2'],
  ['NotoSansKR-SemiBold.woff2', 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-kr@5.2.5/files/noto-sans-kr-korean-600-normal.woff2'],
  ['NotoSansKR-Bold.woff2', 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-kr@5.2.5/files/noto-sans-kr-korean-700-normal.woff2'],
];

await mkdir(outDir, { recursive: true });
for (const [name, url] of files) {
  const dest = join(outDir, name);
  try {
    await access(dest);
    console.log('keep', name);
    continue;
  } catch { /* missing */ }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${name}: ${res.status}`);
  const bytes = Buffer.from(await res.arrayBuffer());
  if (bytes.subarray(0, 4).toString() !== 'wOF2') throw new Error(`invalid WOFF2: ${name}`);
  await writeFile(dest, bytes);
  console.log('wrote', name);
}
console.log('fonts ready');
