#!/usr/bin/env node
/**
 * 1) Restore public/index.html from gzip+base64 sidecar if present (MCP-sized push).
 * 2) Idempotent download of OFL IBM Plex Sans Thai (non-looped) + Noto Sans KR woff2.
 * Thai MUST stay IBM Plex Sans Thai — never Sarabun / Looped.
 */
import { mkdir, writeFile, access, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const outDir = join(pub, 'fonts');

async function restoreIndex() {
  let b64;
  try {
    b64 = await readFile(join(pub, 'index.html.gz.b64'), 'utf8');
  } catch {
    try {
      const parts = [];
      for (let i = 0; i < 8; i++) {
        try {
          parts.push(await readFile(join(pub, `index.html.gz.b64.p${i}`), 'utf8'));
        } catch {
          break;
        }
      }
      if (!parts.length) {
        console.log('no index.html.gz.b64 — skip index restore');
        return;
      }
      b64 = parts.join('');
    } catch {
      console.log('no index.html.gz.b64 — skip index restore');
      return;
    }
  }
  const html = gunzipSync(Buffer.from(String(b64).replace(/\s+/g, ''), 'base64'));
  await writeFile(join(pub, 'index.html'), html);
  console.log('restored index.html', html.length, 'bytes');
}

await restoreIndex();

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
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  console.log('wrote', name);
}
console.log('fonts ready');
