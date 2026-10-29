import { writeFile } from 'node:fs/promises';
import { renderPagesHeaders } from '../lib/security.mjs';

await writeFile(new URL('../public/_headers', import.meta.url), renderPagesHeaders());
console.log('Updated public/_headers.');
