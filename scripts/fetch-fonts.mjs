#!/usr/bin/env node
/**
 * Download OFL IBM Plex Sans Thai + Noto Sans KR Hangul woff2 into public/fonts/.
 * Used by Cloudflare Pages deploy so /fonts/*.woff2 resolve even if binaries
 * were not committed (MCP text pushes cannot ship woff2). Idempotent.
 */
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
  if (!res.ok) throw new Error(`fetch ${name}: ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  console.log('wrote', name, buf.length);
}
console.log('fonts ready in', outDir);
