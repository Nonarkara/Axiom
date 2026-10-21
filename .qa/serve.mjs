// Static server for the reading room and the catalogue.
//
//   node .qa/serve.mjs 5311           # serve axiomx/
//   node .qa/serve.mjs 5312 public    # serve the main catalogue
//
// Why this exists instead of `python3 -m http.server`: that server is
// single-threaded and speaks HTTP/1.0, so it closes every connection and
// answers one request at a time. The reading room now loads a 200KB locale
// bundle, and a browser opening several requests at once can stall behind
// one slow response — the page then fails its checks for reasons that have
// nothing to do with the page. That produced a run that reported two
// failures on a deployment that was clean.
//
// This one is concurrent and keeps connections alive, so a local run
// measures the site instead of the transport.

import http from 'node:http';
import { createReadStream, existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number.parseInt(process.argv[2] || '5311', 10);
const target = process.argv[3] || 'axiomx';
const base = path.join(root, target);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon',
};

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let rel = decodeURIComponent(url.pathname);
    if (rel.endsWith('/')) rel += 'index.html';
    const file = path.join(base, path.normalize(rel).replace(/^(\.\.[/\\])+/, ''));
    if (!file.startsWith(base)) { res.writeHead(403).end('forbidden'); return; }
    const info = await stat(file).catch(() => null);

    // The reading room is a hash-routed book: one document, many entries. A
    // path with no extension that does not exist on disk is therefore an
    // entry, and is served the shell with the hash set. This makes every
    // entry addressable by a real URL, which the spatial gate needs — it
    // loads each route in an iframe, and a fragment-only change never fires
    // the load event, so two entries measured one after the other would
    // silently measure the first one twice.
    if (!info && !path.extname(rel) && existsSync(path.join(base, 'index.html'))) {
      const entry = rel.replace(/\.html$/, '').replace(/^\/+|\/+$/g, '');
      const html = await readFile(path.join(base, 'index.html'), 'utf8');
      const shim = `<script>if(location.pathname!=='/'&&!location.hash){location.hash='${entry}';}</script>`;
      const body = /<head[^>]*>/i.test(html)
        ? html.replace(/<head[^>]*>/i, (m) => m + shim)
        : shim + html;
      res.writeHead(200, { 'Content-Type': TYPES['.html'], 'Cache-Control': 'no-store' });
      res.end(body);
      return;
    }

    if (!info || !info.isFile()) {
      // A directory is a route, not a 404: serve its index.html.
      if (info && info.isDirectory()) {
        const idx = path.join(file, 'index.html');
        const idxInfo = await stat(idx).catch(() => null);
        if (idxInfo && idxInfo.isFile()) {
          res.writeHead(200, {
            'Content-Type': TYPES['.html'],
            'Content-Length': idxInfo.size,
            'Cache-Control': 'no-store',
          });
          createReadStream(idx).pipe(res);
          return;
        }
      }
      res.writeHead(404).end('not found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Content-Length': info.size,
      // A local run must see the bytes on disk, not a cached older build.
      'Cache-Control': 'no-store',
    });
    createReadStream(file).pipe(res);
  } catch {
    res.writeHead(404).end('not found');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`serving ${target} at http://127.0.0.1:${port}`);
});
