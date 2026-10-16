import { chromium } from 'playwright';
// Defaults to the local reading room; set AXIOMX_URL to test a deployment.
const BASE = (process.env.AXIOMX_URL || 'http://127.0.0.1:5311/').replace(/\/?$/, '/');
const b = await chromium.launch();
const fails = [];
const ok = [];
const check = (name, cond, detail = '') => (cond ? ok : fails).push(`${name}${detail ? ' — ' + detail : ''}`);

async function newPage(w = 1440, h = 900) {
  const ctx = await b.newContext({ viewport: { width: w, height: h } });
  const p = await ctx.newPage();
  p.on('pageerror', e => fails.push('JS ERROR: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') fails.push('CONSOLE: ' + m.text()); });
  return p;
}

// ── JOURNEY 1: a governor lands, reads the pitch, opens a system ────────────
{
  const p = await newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' });
  check('lands on the pitch', (await p.textContent('.poster')).includes('flood arrives'));
  check('67 shown, not 66', (await p.textContent('.fig b')) === '67', `got "${await p.textContent('.fig b')}"`);
  const kicker = await p.textContent('.bar-kicker');
  check('bar kicker populated', kicker.trim().length > 0, `"${kicker}"`);
  // click through the index to a live system
  await p.click('#nav button[data-id="flood-ami"]');
  await p.waitForTimeout(350);
  const title = await p.textContent('h1.name');
  check('opens FLOODDASH on click', /FLOODDASH/.test(title), title);
  check('URL deep-links to the entry', p.url().endsWith('#flood-ami'), p.url());
  const openBtn = await p.$eval('.bar-open', e => ({ hidden: e.hidden, href: e.getAttribute('href') }));
  check('Open button wired to the system', !openBtn.hidden && !!openBtn.href, JSON.stringify(openBtn));
  await p.waitForFunction(() => { const i = document.querySelector('.plate-img'); return i && i.complete; }, null, { timeout: 5000 }).catch(() => {});
  const imgOk = await p.evaluate(() => {
    const i = document.querySelector('.plate-img');
    return i ? { src: i.src, ok: i.complete && i.naturalWidth > 0, label: (document.querySelector('.plate-label') || {}).textContent || '', shot: !!document.querySelector('.shot') } : null;
  });
  check('system plate artwork loads locally', !!imgOk && imgOk.ok && /\/art\//.test(imgOk.src), imgOk ? imgOk.src : 'no img');
  check('plate carries a credit line', !!imgOk && imgOk.label.length > 10, imgOk ? imgOk.label : '');
  check('plate replaces the screenshot', !!imgOk && !imgOk.shot);
  await p.context().close();
}

// ── JOURNEY 2: someone searches for "flood" ────────────────────────────────
{
  const p = await newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.keyboard.press('/');
  const focused = await p.evaluate(() => document.activeElement.id);
  check('"/" focuses search', focused === 'q', `focus was #${focused}`);
  await p.keyboard.type('flood');
  await p.waitForTimeout(250);
  const count = await p.textContent('#findCount');
  const items = await p.$$eval('#nav .item', e => e.length);
  check('search narrows the index', items > 0 && Number(count) === items, `count=${count} items=${items}`);
  await p.click('#nav .item');
  await p.waitForTimeout(300);
  check('search result opens', (await p.textContent('h1.name, .poster')).length > 0);
  await p.keyboard.press('Escape');
  await p.waitForTimeout(200);
  const cleared = await p.evaluate(() => ({
    val: document.getElementById('q').value,
    items: document.querySelectorAll('#nav .item').length,
  }));
  check('Escape clears the search and restores the index', cleared.val === '' && cleared.items === 113,
        JSON.stringify(cleared));
  await p.keyboard.press('/');
  await p.keyboard.type('zzzznomatch');
  await p.waitForTimeout(250);
  check('empty search says so', (await p.textContent('#nav')).includes('Nothing under that name'));
  await p.keyboard.press('Escape');
  await p.keyboard.press('Escape');
  await p.waitForTimeout(200);
  check('second Escape fully restores', await p.evaluate(() => document.querySelectorAll('#nav .item').length === 113));
  await p.context().close();
}

// ── JOURNEY 3: keyboard only ──────────────────────────────────────────────
{
  const p = await newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' });
  const before = await p.textContent('#barKicker');
  await p.keyboard.press('ArrowDown');
  await p.waitForTimeout(250);
  const after = await p.textContent('#barKicker');
  check('arrow keys move between entries', before !== after, `${before} -> ${after}`);
  await p.keyboard.press('ArrowUp');
  await p.waitForTimeout(250);
  check('arrow up comes back', (await p.textContent('#barKicker')) === before);
  // tab order: can you reach the index from the top?
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.keyboard.press('Tab');
  const t1 = await p.evaluate(() => document.activeElement.className);
  check('Tab lands on something meaningful', t1.length > 0, `.${t1}`);
  await p.context().close();
}

// ── JOURNEY 4: browser back / forward ──────────────────────────────────────
{
  const p = await newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.click('#nav button[data-id="room"]');
  await p.waitForTimeout(250);
  await p.click('#nav button[data-id="questions"]');
  await p.waitForTimeout(250);
  await p.goBack(); await p.waitForTimeout(250);
  check('back button works', p.url().endsWith('#room'), p.url());
  await p.goForward(); await p.waitForTimeout(250);
  check('forward button works', p.url().endsWith('#questions'), p.url());
  await p.context().close();
}

// ── JOURNEY 5: deep link + dark mode ───────────────────────────────────────
{
  const p = await newPage();
  await p.goto(BASE + '#ladder', { waitUntil: 'networkidle' });
  await p.waitForTimeout(300);
  check('deep link opens the right entry', /Ladder/i.test(await p.textContent('h1.name')));
  await p.click('#themeBtn');
  await p.waitForTimeout(150);
  check('dark theme applies', await p.evaluate(() => document.documentElement.dataset.theme === 'dark'));
  const bg = await p.evaluate(() => getComputedStyle(document.body).backgroundColor);
  check('dark theme actually repaints', bg !== 'rgb(250, 249, 247)', bg);
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(200);
  check('theme persists across reload', await p.evaluate(() => document.documentElement.dataset.theme === 'dark'));
  await p.context().close();
}

// ── JOURNEY 6: phone ───────────────────────────────────────────────────────
{
  const p = await newPage(390, 844);
  await p.goto(BASE, { waitUntil: 'networkidle' });
  const overflow = await p.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }));
  check('no horizontal overflow on phone', overflow.scrollW <= overflow.clientW + 1, JSON.stringify(overflow));
  // plate should be hidden until you pick something
  const plateVisible = await p.evaluate(() => getComputedStyle(document.querySelector('.plate')).display !== 'none');
  check('phone shows the index first', !plateVisible);
  const itemH = await p.evaluate(() => Math.round(document.querySelector('.item').getBoundingClientRect().height));
  check('phone tap target ≥44px', itemH >= 44, `${itemH}px`);
  await p.click('#nav .item');
  await p.waitForTimeout(350);
  const openNow = await p.evaluate(() => document.querySelector('.shell').classList.contains('is-open'));
  check('tapping an entry opens the plate', openNow);
  const backVisible = await p.evaluate(() => {
    const b = document.querySelector('.back');
    return getComputedStyle(b).display !== 'none' ? Math.round(b.getBoundingClientRect().height) : 0;
  });
  check('back button present and tappable on phone', backVisible >= 44, `${backVisible}px`);
  await p.click('.back');
  await p.waitForTimeout(250);
  check('back returns to the index', await p.evaluate(() => !document.querySelector('.shell').classList.contains('is-open')));
  await p.context().close();
}

// ── LOCALE CONTROL ─────────────────────────────────────────────────────────
// The bar carries EN / TH / ZH / KO / JA / VI. Only EN exists. The rest are
// graded Soon rather than hidden, and a Soon code must never be a dead
// control — that is the one behaviour this book does not use anywhere else.
{
  const p = await newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' });
  const codes = await p.$$eval('.locale-btn', els => els.map(e => e.dataset.locale));
  check('locale control shows six codes', codes.length === 6, codes.join(' '));
  check('EN is the active edition', await p.evaluate(() =>
    document.querySelector('.locale-btn.is-active')?.dataset.locale === 'en'));

  const soon = await p.$$eval('.locale-btn[data-soon]', els => els.map(e => e.dataset.locale));
  check('five editions marked Soon, not hidden', soon.length === 5, soon.join(' '));

  // A Soon code is not disabled. It has an action, and that action is to
  // explain itself. aria-disabled here would be a lie and would also stop a
  // keyboard user reaching the explanation.
  const disabled = await p.$$eval('.locale-btn[data-soon]', els =>
    els.filter(e => e.getAttribute('aria-disabled') === 'true').length);
  check('Soon codes are not aria-disabled', disabled === 0, `${disabled} disabled`);

  await p.click('.locale-btn[data-locale="th"]');
  await p.waitForTimeout(350);
  const landed = await p.evaluate(() => ({
    hash: location.hash,
    heading: (document.querySelector('h1.name') || {}).textContent?.trim()
  }));
  check('a Soon code explains itself, not nothing', landed.hash === '#catalogue', JSON.stringify(landed));
  check('and lands on "How to read this"', landed.heading === 'How to read this', landed.heading);

  // The bar carries the mark, six codes and Dark. It must not widen the page.
  const overflow = await p.evaluate(() => {
    const c = document.querySelector('.locale').getBoundingClientRect();
    const bar = document.querySelector('.bar').getBoundingClientRect();
    return { over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
             inside: c.right <= bar.right };
  });
  check('locale control sits inside the bar', overflow.inside);
  await p.context().close();
}

{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' });
  const ph = await p.evaluate(() => {
    const btn = document.querySelector('.locale-btn');
    return {
      h: Math.round(btn.getBoundingClientRect().height),
      over: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  });
  check('phone locale tap target ≥44px', ph.h >= 44, `${ph.h}px`);
  check('locale control adds no phone overflow', ph.over <= 0, `${ph.over}px`);
  await ctx.close();
}

// ── FIELD CLIP ─────────────────────────────────────────────────────────────
// The ground-condition loop appears twice, and the duplication is deliberate:
// on FloodDash because that watch is read from standing in the rain, and on
// Innovation-as-a-Service because the practice begins in the same place. Each
// carries its own caption -- the same clip with a FloodDash sentence on the
// practice page would be a claim about a page it is not making.
// It is portrait, so the plate must cap it by height.
{
  const p0 = await newPage();
  await p0.goto(BASE + '#flood-ami', { waitUntil: 'networkidle' });
  await p0.waitForTimeout(600);
  const fd = await p0.evaluate(() => {
    const fig = document.querySelector('.clip');
    return {
      found: !!fig,
      caption: fig && fig.querySelector('figcaption') ? fig.querySelector('figcaption').textContent : '',
    };
  });
  check('FloodDash carries the clip, by instruction', fd.found);
  check('and its caption is the flood one', /flood season/i.test(fd.caption), fd.caption.slice(0, 60));
  await p0.context().close();
  const p = await newPage();
  await p.goto(BASE + '#iaas', { waitUntil: 'networkidle' });
  await p.waitForTimeout(600);
  const r = await p.evaluate(() => {
    const fig = document.querySelector('.clip');
    const v = fig && fig.querySelector('video');
    return {
      found: !!fig,
      caption: fig && fig.querySelector('figcaption') ? fig.querySelector('figcaption').textContent : '',
      h: v ? Math.round(v.getBoundingClientRect().height) : 0,
      w: v ? Math.round(v.getBoundingClientRect().width) : 0,
      muted: v ? v.muted : null,
      loop: v ? v.loop : null,
      poster: v ? !!v.poster : null,
      // it must not be the 960px screenshot measure scaled to a billboard
      tallest: v ? v.getBoundingClientRect().height < 700 : false,
    };
  });
  check('Innovation-as-a-Service carries the field clip', r.found);
  // The same clip appears here and on FloodDash, so the captions have to
  // differ. A flood-season sentence on the practice page is a claim about a
  // page it is not making -- it is the exact defect that a merge can introduce
  // silently, by moving a figure without moving the words.
  check('its caption is the practice one, not the flood one',
    !/flood season|in Thai, in public/i.test(r.caption), r.caption.slice(0, 60));
  check('clip is capped by height, not the wide measure', r.tallest, `${r.w}x${r.h}`);
  check('clip is muted and loops', r.muted === true && r.loop === true);
  check('clip has a poster for reduced motion', r.poster === true);

  // The source is hot-linked off the main site, so this is really a check
  // that the main site still serves the asset.
  const src = await p.evaluate(() => {
    const v = document.querySelector('.clip video source');
    return v ? v.src : '';
  });
  check('clip points at the main-site asset', /axiom\.nonarkara\.org/.test(src), src);

  const res = await p.evaluate(async (u) => {
    try { const r = await fetch(u, { method: 'HEAD' }); return r.status; } catch (e) { return 0; }
  }, src);
  check('the clip asset actually resolves', res === 200, `HTTP ${res}`);
  await p.context().close();
}

// ── PLATES: every system has a credited artwork; pro bono keeps its photo ──
{
  const p = await newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' });
  const r = await p.evaluate(async () => {
    const sys = (window.AXIOM_SYSTEMS || []).map(s => s.id);
    const plates = window.AXIOM_PLATES || {};
    const missing = sys.filter(id => !plates[id]);
    const badLic = Object.keys(plates).filter(id => !/^(Public domain|CC0)$/.test(plates[id][5]));
    const broken = [];
    for (const id of Object.keys(plates)) {
      const res = await fetch('art/' + id + '.webp', { method: 'HEAD' });
      if (res.status !== 200) broken.push(id);
    }
    location.hash = '#pb-ascn';
    await new Promise(r => setTimeout(r, 150));
    const pb = !!document.querySelector('#plate .shot') && !document.querySelector('#plate .plate-art');
    return { sys: sys.length, n: Object.keys(plates).length, missing, badLic, broken, pb };
  });
  check('every system has a plate', r.missing.length === 0 && r.n === r.sys, `${r.n}/${r.sys} ${r.missing.join(',')}`);
  check('every plate is public domain or CC0', r.badLic.length === 0, r.badLic.join(','));
  check('every plate image resolves', r.broken.length === 0, r.broken.join(','));
  check('pro bono keeps its own photograph', r.pb);
  await p.context().close();
}

// ── STRUCTURE: every entry renders without error ───────────────────────────
{
  const p = await newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' });
  const r = await p.evaluate(async () => {
    const ids = [...document.querySelectorAll('#nav button[data-id]')].map(b => b.dataset.id);
    const bad = [];
    for (const id of ids) {
      location.hash = '#' + id;
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const plate = document.querySelector('#plate');
      if (!plate || plate.textContent.trim().length < 10) bad.push(id + ' (empty plate)');
    }
    return { total: ids.length, bad };
  });
  check('all ' + r.total + ' entries render', r.bad.length === 0, r.bad.join(', '));
  await p.context().close();
}

console.log('PASS ' + ok.length);
ok.forEach(o => console.log('  ✓ ' + o));
console.log('\nFAIL ' + fails.length);
fails.forEach(f => console.log('  ✗ ' + f));
await b.close();
process.exit(fails.length ? 1 : 0);