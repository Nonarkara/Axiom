#!/usr/bin/env node
// Resolve Wikimedia Commons file titles for a set of artworks and print the
// metadata the catalogue needs: artist, date, licence, collection, dimensions.
//
//   node .qa/commons-verify.mjs <candidates.json>
//
// The candidate file is an array of { key, search, expect } — `search` is a
// Commons full-text query, `expect` is a substring the resolved title must
// contain (guards against the search returning a different artwork).
//
// Nothing here is typed by hand: every field printed comes back from the API.

const UA = 'AxiomReadingRoom/1.0 (https://axiom.nonarkara.org; dr-non@nonarkara.org)';
const API = 'https://commons.wikimedia.org/w/api.php';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', formatversion: '2', ...params })}`;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
      const body = await res.text();
      if (!body.trim()) { await sleep(1500); continue; }
      const json = JSON.parse(body);
      if (json.error) { console.error('API error', JSON.stringify(json.error)); return null; }
      return json;
    } catch {
      await sleep(1500);
    }
  }
  console.error('API unreachable:', params.srsearch || params.titles);
  return null;
}

const strip = (html) => (html || '')
  .replace(/<[^>]*>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/\s+/g, ' ')
  .trim();

// Commons dates arrive as "1881 date QS:P571,+1881-00-00T00:00:00Z/9".
const cleanDate = (raw) => {
  if (!raw) return '';
  const s = strip(raw).split(' QS:')[0].replace(/\s+date\b/, '').trim();
  return s;
};

async function wikidata(qid) {
  if (!qid) return null;
  const url = `https://www.wikidata.org/w/api.php?${new URLSearchParams({
    action: 'wbgetentities', ids: qid, props: 'labels|claims', languages: 'en', format: 'json',
  })}`;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      const body = await res.text();
      if (!body.trim()) { await sleep(1500); continue; }
      const json = JSON.parse(body);
      return json.entities?.[qid] || null;
    } catch { await sleep(1500); }
  }
  return null;
}

const firstLabel = (claim, entity) => {
  const snak = claim?.mainsnak;
  if (!snak || snak.snaktype !== 'value') return '';
  const dv = snak.datavalue;
  if (!dv) return '';
  if (dv.type === 'wikibase-entityid') {
    const q = dv.value.id;
    const l = entity?.labels?.[q];
    return l?.value || q;
  }
  if (dv.type === 'string') return dv.value;
  if (dv.type === 'time') return dv.value.time.replace(/^\+/, '').split('T')[0];
  return '';
};

// A Commons File: page points at a Wikimedia *file* item; the artwork itself
// is reached through P180 (depicts). Collections live on the artwork item.
async function artworkFacts(fileQid) {
  const fileItem = await wikidata(fileQid);
  if (!fileItem) return { held: [], creators: [], inception: '', artworkQid: '' };
  const depicts = (fileItem.claims?.P180 || [])
    .map((c) => firstLabel(c, fileItem))
    .filter((q) => /^Q\d+$/.test(q));
  const artworkQid = depicts[0] || '';
  const art = artworkQid && artworkQid !== fileQid ? await wikidata(artworkQid) : fileItem;
  const held = [];
  for (const prop of ['P195', 'P276']) {
    for (const c of (art?.claims?.[prop] || []).slice(0, 3)) {
      const v = firstLabel(c, art);
      if (v && !held.includes(v)) held.push(v);
    }
  }
  const creators = (art?.claims?.P170 || []).map((c) => firstLabel(c, art)).filter(Boolean);
  const inception = art?.claims?.P571 ? firstLabel(art.claims.P571[0], art) : '';

  // Collection labels live on other entities — fetch them, do not print QIDs.
  const qids = [];
  for (const prop of ['P195', 'P276']) {
    for (const c of (art?.claims?.[prop] || []).slice(0, 3)) {
      const dv = c?.mainsnak?.datavalue;
      const q = dv?.type === 'wikibase-entityid' ? dv.value.id : null;
      if (q && !qids.includes(q)) qids.push(q);
    }
  }
  const named = new Map();
  if (qids.length) {
    const url = `https://www.wikidata.org/w/api.php?${new URLSearchParams({
      action: 'wbgetentities', ids: qids.join('|'), props: 'labels', languages: 'en', format: 'json',
    })}`;
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const res = await fetch(url, { headers: { 'User-Agent': UA } });
        const body = await res.text();
        if (!body.trim()) { await sleep(1500); continue; }
        const json = JSON.parse(body);
        for (const [q, e] of Object.entries(json.entities || {})) named.set(q, e?.labels?.en?.value || q);
        break;
      } catch { await sleep(1500); }
    }
  }
  const heldNames = qids.map((q) => named.get(q) || q);
  return { held: heldNames, creators, inception, artworkQid };
}

async function resolveByTitle(titles) {
  for (const t of titles) {
    const info = await api({
      action: 'query', titles: t, prop: 'imageinfo',
      iiprop: 'url|extmetadata|size|mime', iiurlwidth: '2000',
    });
    const page = info?.query?.pages?.[0];
    if (page && !page.missing && page.imageinfo?.[0]) {
      // pageprops arrives in a continuation when imageinfo is also requested,
      // so it has to be a second call.
      const pp = await api({ action: 'query', titles: t, prop: 'pageprops' });
      const p = pp?.query?.pages?.[0];
      page.pageprops = p?.pageprops || {};
      return page;
    }
  }
  return null;
}

async function resolve(search, expect) {
  if (search && search.startsWith('TITLE:')) {
    const page = await resolveByTitle(search.slice(6).split('|'));
    if (!page) return { error: 'no direct title resolved' };
    return describe(page);
  }
  const found = await api({ action: 'query', list: 'search', srsearch: search, srnamespace: '6', srlimit: '12' });
  const hits = (found?.query?.search || []).map((h) => h.title);
  if (!hits.length) return { error: 'no search hits', hits: [] };
  const pick = expect ? hits.find((t) => t.toLowerCase().includes(expect.toLowerCase())) : hits[0];
  if (!pick) return { error: `no hit containing "${expect}"`, hits };

  const info = await api({
    action: 'query', titles: pick, prop: 'imageinfo',
    iiprop: 'url|extmetadata|size|mime', iiurlwidth: '2000',
  });
  const page = info?.query?.pages?.[0];
  if (!page?.imageinfo?.[0]) return { error: 'no imageinfo', title: pick, hits };
  const pp = await api({ action: 'query', titles: pick, prop: 'pageprops' });
  page.pageprops = pp?.query?.pages?.[0]?.pageprops || {};
  return { ...(await describe(page)), hits };
}

async function describe(page) {
  const ii = page.imageinfo[0];
  const m = ii.extmetadata || {};
  const val = (k) => strip(m[k]?.value);
  const facts = await artworkFacts(page.pageprops?.wikibase_item);
  const extDate = cleanDate(val('DateTimeOriginal') || val('DateTime'));
  const extArtist = val('Artist');

  return {
    title: page.title,
    url: ii.url,
    thumb: ii.thumburl || null,
    width: ii.width,
    height: ii.height,
    mime: ii.mime,
    artist: extArtist || facts.creators.join(', '),
    date: extDate || facts.inception,
    objectName: val('ObjectName'),
    description: val('ImageDescription').slice(0, 700),
    credit: val('Credit'),
    institution: val('Institution'),
    held: facts.held,
    wikidata: facts.artworkQid,
    licence: val('LicenseShortName') || val('License'),
    usage: val('UsageTerms'),
    licenceUrl: val('LicenseUrl'),
    restrictions: val('Restrictions'),
    categories: (m.Categories?.value || '').split('|').filter(Boolean).slice(0, 14),
  };
}

const file = process.argv[2];
if (!file) { console.error('usage: node .qa/commons-verify.mjs <candidates.json>'); process.exit(1); }
const { readFileSync } = await import('node:fs');
const candidates = JSON.parse(readFileSync(file, 'utf8'));

for (const c of candidates) {
  const r = await resolve(c.search, c.expect);
  if (r.error) { console.log(`\n### ${c.key} — ERROR: ${r.error}\n   hits: ${(r.hits || []).slice(0, 6).join(' | ')}`); continue; }
  console.log(`\n### ${c.key}`);
  console.log(`  title     ${r.title}`);
  console.log(`  artist    ${r.artist}`);
  console.log(`  date      ${r.date}`);
  console.log(`  licence   ${r.licence} | ${r.usage}`);
  console.log(`  held      ${r.held.join(' | ') || '(none)'}`);
  console.log(`  credit    ${r.credit}`);
  console.log(`  inst      ${r.institution}`);
  console.log(`  object    ${r.objectName}`);
  console.log(`  size      ${r.width}x${r.height} ${r.mime}`);
  console.log(`  url       ${r.url}`);
  console.log(`  desc      ${r.description.slice(0, 320)}`);
  console.log(`  cats      ${r.categories.join(' | ')}`);
  await sleep(400);
}
