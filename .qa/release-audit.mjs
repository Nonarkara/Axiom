import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const htmlFiles = [
  path.join(publicDir, 'index.html'),
  path.join(publicDir, 'admin', 'index.html'),
];
const snapshotPath = path.join(publicDir, 'data', 'evidence-snapshot.json');

const localIssues = [];
const rootRelativeAdminIssues = [];
const externalUrls = new Set();

function isSkippable(value) {
  return !value || value.startsWith('#') || /^(mailto|tel|javascript|data):/i.test(value);
}

function resolveLocalFile(pagePath, rawUrl) {
  const pageUrl = pagePath.endsWith('/index.html')
    ? `https://example.local/${path.relative(publicDir, path.dirname(pagePath)).replaceAll(path.sep, '/')}/`
    : `https://example.local/${path.relative(publicDir, pagePath).replaceAll(path.sep, '/')}`;
  const resolved = new URL(rawUrl, pageUrl);
  const cleanPath = decodeURIComponent(resolved.pathname).replace(/^\/+/, '');
  return path.join(publicDir, cleanPath || 'index.html');
}

for (const filePath of htmlFiles) {
  const html = fs.readFileSync(filePath, 'utf8');
  const linkedAttributes = [...html.matchAll(/<([a-z0-9-]+)\b([^>]*)\b(?:href|src|action)=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => ({
      tagName: match[1].toLowerCase(),
      tagAttrs: match[2] || '',
      rawUrl: match[3].replaceAll('&amp;', '&'),
    }));

  for (const { tagName, tagAttrs, rawUrl } of linkedAttributes) {
    if (isSkippable(rawUrl)) continue;
    if (tagName === 'link' && /\brel=["'][^"']*preconnect/i.test(tagAttrs)) continue;

    if (/^https?:\/\//i.test(rawUrl)) {
      externalUrls.add(rawUrl);
      continue;
    }

    if (filePath.includes(`${path.sep}admin${path.sep}`) && rawUrl.startsWith('/')) {
      rootRelativeAdminIssues.push({ filePath, rawUrl });
    }

    const localPath = resolveLocalFile(filePath, rawUrl);
    const exists = fs.existsSync(localPath) || fs.existsSync(path.join(localPath, 'index.html'));
    if (!exists) {
      localIssues.push({ filePath, rawUrl, localPath });
    }
  }
}

if (fs.existsSync(snapshotPath)) {
  const snapshot = JSON.stringify(JSON.parse(fs.readFileSync(snapshotPath, 'utf8')));
  for (const match of snapshot.matchAll(/https?:\/\/[^"',\s]+/g)) {
    externalUrls.add(match[0]);
  }
}

async function checkExternalUrl(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    let response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'AxiomReleaseAudit/1.0' },
    });

    if ([405, 403, 999].includes(response.status)) {
      response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'User-Agent': 'AxiomReleaseAudit/1.0' },
      });
    }

    return {
      url,
      status: response.status,
      ok: response.status < 400
        || [401, 403, 999].includes(response.status)
        || (response.status === 400 && url.includes('formspree.io/f/')),
      finalUrl: response.url,
    };
  } catch (error) {
    return {
      url,
      ok: false,
      error: error?.name === 'AbortError' ? 'timeout' : error?.message || String(error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

const externalResults = [];
for (const url of Array.from(externalUrls).sort()) {
  externalResults.push(await checkExternalUrl(url));
}

const report = {
  generatedAt: new Date().toISOString(),
  localIssues,
  rootRelativeAdminIssues,
  externalResults,
  externalFailures: externalResults.filter((result) => !result.ok),
};

const outPath = path.join(root, '.qa', 'release-audit-report.json');
fs.writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(JSON.stringify({
  reportPath: outPath,
  localIssues: localIssues.length,
  rootRelativeAdminIssues: rootRelativeAdminIssues.length,
  externalChecked: externalResults.length,
  externalFailures: report.externalFailures.length,
}, null, 2));
