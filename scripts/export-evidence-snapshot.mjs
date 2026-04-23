import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';
import {
  getAnalyticsSummary,
  getCaseStudyProof,
  getContentHistory,
} from '../server.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const outDir = path.join(rootDir, 'public', 'data');
const outPath = path.join(outDir, 'evidence-snapshot.json');

const generatedAt = new Date().toISOString();
const snapshot = {
  generatedAt,
  source: 'static-snapshot',
  analytics: {
    ...getAnalyticsSummary(),
    snapshotGeneratedAt: generatedAt,
  },
  caseStudies: getCaseStudyProof(),
  contentHistory: getContentHistory(),
};

await mkdir(outDir, { recursive: true });
await writeFile(outPath, `${JSON.stringify(snapshot, null, 2)}\n`);

console.log(JSON.stringify({
  ok: true,
  outPath,
  caseStudies: snapshot.caseStudies.length,
  contentHistory: snapshot.contentHistory.length,
  generatedAt,
}, null, 2));
