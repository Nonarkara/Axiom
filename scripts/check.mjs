import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const filename = `${directory}/${entry.name}`;
    if (entry.isDirectory()) files.push(...await filesIn(filename));
    else if (/\.(?:js|mjs)$/.test(entry.name)) files.push(filename);
  }
  return files;
}

const files = ['server.mjs'];
for (const directory of ['lib', 'scripts', 'public', 'tests']) files.push(...await filesIn(directory));
for (const filename of files) {
  const result = spawnSync(process.execPath, ['--check', filename], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}
console.log(`Syntax checked ${files.length} JavaScript files.`);
