import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('the visual laws are checked in and wired into the project contract', () => {
  const style = readFileSync(new URL('../STYLE.md', import.meta.url), 'utf8');
  for (const file of ['THE-BOOK.md', 'MSH.md', 'GLANCE-PATH-FOR-AI.md', 'KINETIC-GRIDS-FOR-AI.md']) {
    assert.ok(readFileSync(new URL('../' + file, import.meta.url), 'utf8').length > 5000);
    assert.ok(style.includes('(' + file + ')'));
  }
  assert.match(style, /different agent/);
  assert.match(style, /Nong Plub/);
});
