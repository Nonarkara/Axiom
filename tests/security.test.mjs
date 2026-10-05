import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import path from 'node:path';
import os from 'node:os';
import { randomBytes } from 'node:crypto';
import { mkdtemp, readFile, rm, symlink } from 'node:fs/promises';
import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { once } from 'node:events';
import { renderPagesHeaders } from '../lib/security.mjs';

const root = new URL('../', import.meta.url);
const exec = promisify(execFile);

async function startServer(password = '') {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'axiom-security-'));
  const child = spawn(process.execPath, ['server.mjs'], {
    cwd: root,
    env: { ...process.env, PORT: '0', AXIOM_DATA_DIR: directory, AXIOM_ADMIN_USER: 'admin', AXIOM_ADMIN_PASSWORD: password },
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  try {
    const port = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Server startup timed out')), 10_000);
      child.once('exit', () => { clearTimeout(timer); reject(new Error('Server exited during startup')); });
      child.once('error', (error) => { clearTimeout(timer); reject(error); });
      let output = '';
      child.stdout.on('data', (chunk) => {
        output += chunk;
        const match = output.match(/running on http:\/\/127\.0\.0\.1:(\d+)/);
        if (match) { clearTimeout(timer); resolve(Number(match[1])); }
      });
    });
    return {
      port,
      directory,
      authorization: `Basic ${Buffer.from(`admin:${password}`).toString('base64')}`,
      async stop() {
        if (child.exitCode === null) { const stopped = once(child, 'exit'); child.kill(); await stopped; }
        await rm(directory, { recursive: true, force: true });
      },
    };
  } catch (error) {
    if (child.exitCode === null) { const stopped = once(child, 'exit'); child.kill(); await stopped; }
    await rm(directory, { recursive: true, force: true });
    throw error;
  }
}

function request(server, target, { method = 'GET', headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: '127.0.0.1', port: server.port, path: target, method, headers }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        let json;
        try { json = JSON.parse(text); } catch { /* Static files are not JSON. */ }
        resolve({ status: res.statusCode, headers: res.headers, text, json });
      });
    });
    req.on('error', reject);
    req.end(body);
  });
}

test('security headers match the generated deployment artifact', async () => {
  assert.equal(await readFile(new URL('../public/_headers', import.meta.url), 'utf8'), renderPagesHeaders());
  const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /ipapi\.co|script\.google\.com/);
  assert.match(html, /integrity="sha256-20nQCchB9co0qIjJZRGuk2\/Z9VM\+kNiyxNV1lvTlZBo="/);
  const snapshot = JSON.parse(await readFile(new URL('../public/data/evidence-snapshot.json', import.meta.url), 'utf8'));
  assert.equal(Object.hasOwn(snapshot, 'pipeline'), false);
  assert.equal(Object.hasOwn(snapshot.analytics, 'pipelineCount'), false);
});

test('catalog editions and earned hero interactions remain present', async () => {
  const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
  for (const host of ['champion', 'soccer', 'vision', 'dao', 'daoriginal']) {
    assert.match(html, new RegExp(`href="https://${host}\\.nonarkara\\.org/"`));
  }
  for (const id of ['heroCanvas', 'heroMap', 'satHud', 'heroRotatingText', 'mapModeBtn', 'heroFeaturedBadge']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /sys-cell__edition/);
  const editorial = await readFile(new URL('../public/editorial.css', import.meta.url), 'utf8');
  assert.match(editorial, /@layer editorial/);
});

test('unconfigured admin fails closed while the public page stays available', async () => {
  const server = await startServer();
  try {
    assert.equal((await request(server, '/')).status, 200);
    for (const target of ['/admin/', '/admin/app.js', '/api/admin/bootstrap', '/api/analytics/summary']) {
      assert.equal((await request(server, target)).status, 503);
    }
  } finally { await server.stop(); }
});

test('local API enforces authentication, validation and private/public boundaries', async (t) => {
  const server = await startServer(randomBytes(24).toString('hex'));
  const auth = { Authorization: server.authorization };
  const jsonHeaders = { ...auth, 'Content-Type': 'application/json' };
  try {
    await t.test('anonymous admin reads and writes are denied, including encoded/case variants', async () => {
      for (const target of ['/admin', '/admin/', '/ADMIN/index.html', '/%61dmin/app.js', '/api/%61dmin/bootstrap', '/api/admin/pipeline']) {
        const response = await request(server, target);
        assert.equal(response.status, 401, target);
        assert.match(response.headers['www-authenticate'], /^Basic /);
        assert.equal(response.headers['cache-control'], 'no-store');
      }
      assert.equal((await request(server, '/api/admin/pipeline', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })).status, 401);
    });

    await t.test('host and cross-site checks do not trust forwarding headers', async () => {
      assert.equal((await request(server, '/', { headers: { Host: `attacker.example:${server.port}` } })).status, 403);
      assert.equal((await request(server, '/api/admin/bootstrap', { headers: { ...auth, Origin: 'https://attacker.example' } })).status, 403);
      assert.equal((await request(server, '/api/admin/bootstrap', { headers: { ...auth, 'Sec-Fetch-Site': 'cross-site' } })).status, 403);
      assert.equal((await request(server, '/api/admin/bootstrap', { headers: { ...auth, Origin: `http://127.0.0.1:${server.port}` } })).status, 200);
      assert.equal((await request(server, '/api/pageview', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'null' }, body: '{}' })).status, 403);
    });

    await t.test('JSON must be a bounded, valid object of the correct content type', async () => {
      for (const target of ['/api/admin/case-studies', '/api/admin/content-history', '/api/admin/pipeline', '/api/pageview']) {
        for (const body of ['', '{broken', 'null', '[]', 'true']) {
          assert.equal((await request(server, target, { method: 'POST', headers: jsonHeaders, body })).status, 400);
        }
        assert.equal((await request(server, target, { method: 'POST', headers: auth, body: '{}' })).status, 415);
        assert.equal((await request(server, target, { method: 'POST', headers: jsonHeaders, body: JSON.stringify({ value: 'x'.repeat(1024 * 1024) }) })).status, 413);
      }
    });

    await t.test('unsafe stored URLs are rejected without mutating existing proof', async () => {
      const study = (await request(server, '/api/admin/case-studies', { headers: auth })).json.items[0];
      for (const linkUrl of ['javascript:alert(1)', 'data:text/html,x', 'file:///etc/passwd', 'https://user:password@example.com/']) {
        assert.equal((await request(server, `/api/admin/case-studies/${study.id}`, {
          method: 'PUT', headers: jsonHeaders, body: JSON.stringify({ ...study, title: 'Must not save', linkUrl }),
        })).status, 400);
      }
      const unchanged = (await request(server, `/api/admin/case-studies/${study.id}`, { headers: auth })).json.item;
      assert.equal(unchanged.title, study.title);
      assert.equal((await request(server, '/api/admin/case-studies', { method: 'POST', headers: jsonHeaders,
        body: JSON.stringify({ title: 'Long input', badge: 'QA', summary: 'x'.repeat(10001) }) })).status, 400);
    });

    await t.test('authenticated pipeline CRUD and notes still work; exports never contain private data', async () => {
      const canary = `PRIVATE-${randomBytes(12).toString('hex')}`;
      const created = await request(server, '/api/admin/pipeline', { method: 'POST', headers: jsonHeaders,
        body: JSON.stringify({ projectName: canary, clientName: canary, notes: canary, hasContract: '0' }) });
      assert.equal(created.status, 201);
      assert.equal(created.json.item.hasContract, 0);
      const id = created.json.item.id;
      const updated = await request(server, `/api/admin/pipeline/${id}`, { method: 'PUT', headers: jsonHeaders,
        body: JSON.stringify({ ...created.json.item, stage: 'proposal', hasContract: true }) });
      assert.equal(updated.status, 200);
      assert.equal(updated.json.item.hasContract, 1);
      const note = await request(server, `/api/admin/pipeline/${id}/notes`, { method: 'POST', headers: jsonHeaders, body: JSON.stringify({ body: canary }) });
      assert.equal(note.status, 201);
      const outputDirectory = path.join(server.directory, 'export');
      await exec(process.execPath, ['scripts/export-evidence-snapshot.mjs'], { cwd: root,
        env: { ...process.env, AXIOM_DATA_DIR: server.directory, AXIOM_EVIDENCE_OUTPUT_DIR: outputDirectory } });
      const exported = await readFile(path.join(outputDirectory, 'evidence-snapshot.json'), 'utf8');
      assert.equal(exported.includes(canary), false);
      assert.equal(Object.hasOwn(JSON.parse(exported), 'pipeline'), false);
      assert.equal((await request(server, '/api/evidence')).text.includes(canary), false);
      assert.equal((await request(server, `/api/admin/pipeline/${id}/notes/${note.json.item.id}`, { method: 'DELETE', headers: auth })).status, 200);
      assert.equal((await request(server, `/api/admin/pipeline/${id}`, { method: 'DELETE', headers: auth })).status, 200);
    });

    await t.test('static paths cannot traverse directories, follow outside symlinks or serve hidden configuration', async () => {
      for (const target of ['/bad%ZZ', '/%00', '/x%5Cy', '/x/%2e%2e%2fserver.mjs']) {
        assert.equal((await request(server, target)).status, 400);
      }
      for (const target of ['/.env', '/_headers', '/.git/config']) assert.equal((await request(server, target)).status, 403);
      const name = `security-${randomBytes(8).toString('hex')}.sqlite`;
      const link = new URL(`../public/${name}`, import.meta.url);
      await symlink(path.join(server.directory, 'axiom.sqlite'), link);
      try { assert.equal((await request(server, `/${name}`)).status, 403); }
      finally { await rm(link); }
      const status = await request(server, '/api/status');
      assert.equal(status.status, 200);
      assert.equal(Object.hasOwn(status.json.database, 'path'), false);
      assert.equal(status.text.includes(server.directory), false);
    });

    await t.test('all responses carry browser protections; scripts do not permit arbitrary inline code', async () => {
      for (const target of ['/', '/api/status', '/missing-file.txt', '/%ZZ']) {
        const response = await request(server, target);
        assert.equal(response.headers['x-content-type-options'], 'nosniff');
        assert.equal(response.headers['x-frame-options'], 'DENY');
        const scripts = response.headers['content-security-policy'].split('; ').find((part) => part.startsWith('script-src'));
        assert.doesNotMatch(scripts, /unsafe-inline|unsafe-eval/);
        assert.match(scripts, /sha256-/);
      }
    });

    await t.test('pageviews discard query strings, referrer paths and user-agent fingerprints', async () => {
      const response = await request(server, '/api/pageview', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: '/test?token=secret#private', referrer: 'https://example.com/private?token=secret', language: 'en' }) });
      assert.equal(response.status, 201);
      const { DatabaseSync } = await import('node:sqlite');
      const db = new DatabaseSync(path.join(server.directory, 'axiom.sqlite'));
      try {
        const item = db.prepare('SELECT path, referrer, user_agent FROM pageviews ORDER BY id DESC LIMIT 1').get();
        assert.equal(item.path, '/test');
        assert.equal(item.referrer, 'https://example.com');
        assert.equal(item.user_agent, 'not-collected');
      } finally { db.close(); }
    });

    await t.test('failed authentication is rate limited using the socket address', async () => {
      let response;
      for (let index = 0; index < 21; index++) {
        response = await request(server, '/api/admin/bootstrap', { headers: { 'X-Forwarded-For': `192.0.2.${index}` } });
      }
      assert.equal(response.status, 429);
      assert.equal(response.headers['retry-after'], '60');
      assert.equal((await request(server, '/api/admin/bootstrap', { headers: auth })).status, 200);
    });
  } finally { await server.stop(); }
});
