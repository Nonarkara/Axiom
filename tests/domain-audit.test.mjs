import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

test('the live domain audit rejects a wrong host or route even when SPA HTML matches', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'axiom-domain-audit-'));
  try {
    for (const [fault, expectedStatus] of [['none', 0], ['path', 1], ['host', 1]]) {
      const code = `
        globalThis.fetch = async value => {
          const url = new URL(value);
          url.hash = '';
          if (url.hostname === 'lcb.nonarkara.org') {
            if (${JSON.stringify(fault)} === 'path') url.pathname = '/';
            if (${JSON.stringify(fault)} === 'host') url.hostname = 'other.nonarkara.org';
          }
          return { status: 200, url: url.href, text: async () => '<title>The same SPA shell</title>' };
        };
        await import(${JSON.stringify(new URL('../.qa/domain-audit.mjs', import.meta.url).href)});
      `;
      const result = spawnSync(process.execPath, ['--input-type=module', '-e', code], {
        encoding: 'utf8',
        env: { ...process.env, DOMAIN_EVIDENCE: join(dir, fault + '.json') }
      });
      assert.equal(result.status, expectedStatus, result.stdout + result.stderr);
      if (fault !== 'none') assert.match(result.stdout, /FAIL lcbcity/);
      else assert.doesNotMatch(result.stdout, /FAIL/);
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
