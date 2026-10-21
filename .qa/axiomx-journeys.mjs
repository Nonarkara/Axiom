import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
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
  p.on('console', m => {
    if (m.type() === 'error') {
      const txt = m.text();
      if (txt.includes('compute-pressure')) return;
      fails.push('CONSOLE: ' + txt);
    }
  });
  return p;
}

// ── JOURNEY 1: a governor lands, reads the pitch, opens a system ────────────
{
  const p = await newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' });
  check('lands on the pitch', (await p.textContent('.poster')).includes('flood arrives'));
  check('71 systems shown', (await p.textContent('.fig b')) === '71', `got "${await p.textContent('.fig b')}"`);
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
  const baseline = await p.$$eval('#nav .item', e => e.length);
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
  check('Escape clears the search and restores the index', cleared.val === '' && cleared.items === baseline,
        JSON.stringify({ cleared, baseline }));
  await p.keyboard.press('/');
  await p.keyboard.type('zzzznomatch');
  await p.waitForTimeout(250);
  check('empty search says so', (await p.textContent('#nav')).includes('Nothing under that name'));
  await p.keyboard.press('Escape');
  await p.keyboard.press('Escape');
  await p.waitForTimeout(200);
  check('second Escape fully restores', await p.evaluate((n) => document.querySelectorAll('#nav .item').length === n, baseline));
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
// ── JOURNEY 8: multilingual switching across all six editions ───────────────
// When editions are translated, each code switches the active language, updates
// document lang attribute, index groups, controls, and pitches.
{
  const p = await newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' });
  const codes = await p.$$eval('.locale-btn', els => els.map(e => e.dataset.locale));
  check('locale control shows six codes', codes.length === 6, codes.join(' '));
  check('EN is the active edition by default', await p.evaluate(() =>
    document.querySelector('.locale-btn.is-active')?.dataset.locale === 'en'));

  // Switch to TH
  await p.click('.locale-btn[data-locale="th"]');
  await p.waitForTimeout(200);
  const thState = await p.evaluate(() => ({
    lang: document.documentElement.lang,
    active: document.querySelector('.locale-btn.is-active')?.dataset.locale,
    poster: document.querySelector('.poster')?.textContent || '',
    saved: localStorage.getItem('axiomx_locale')
  }));
  check('TH switches active edition', thState.active === 'th', thState.active);
  check('TH sets document lang', thState.lang === 'th', thState.lang);
  check('TH translates pitch poster', thState.poster.includes('น้ำท่วม'), thState.poster);
  check('TH persists locale in storage', thState.saved === 'th', thState.saved);

  // Switch to ZH
  await p.click('.locale-btn[data-locale="zh"]');
  await p.waitForTimeout(200);
  const zhLang = await p.evaluate(() => document.documentElement.lang);
  check('ZH sets document lang zh-Hans', zhLang === 'zh-Hans', zhLang);

  // Switch to KO
  await p.click('.locale-btn[data-locale="ko"]');
  await p.waitForTimeout(200);
  const koLang = await p.evaluate(() => document.documentElement.lang);
  check('KO sets document lang ko', koLang === 'ko', koLang);

  // Switch to JA
  await p.click('.locale-btn[data-locale="ja"]');
  await p.waitForTimeout(200);
  const jaLang = await p.evaluate(() => document.documentElement.lang);
  check('JA sets document lang ja', jaLang === 'ja', jaLang);

  // Switch to VI
  await p.click('.locale-btn[data-locale="vi"]');
  await p.waitForTimeout(200);
  const viLang = await p.evaluate(() => document.documentElement.lang);
  check('VI sets document lang vi', viLang === 'vi', viLang);

  // Switch back to EN
  await p.click('.locale-btn[data-locale="en"]');
  await p.waitForTimeout(200);
  const enState = await p.evaluate(() => ({
    lang: document.documentElement.lang,
    active: document.querySelector('.locale-btn.is-active')?.dataset.locale,
    poster: document.querySelector('.poster')?.textContent || ''
  }));
  check('EN restores active edition', enState.active === 'en', enState.active);
  check('EN restores pitch poster', enState.poster.includes('flood arrives'), enState.poster);

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

// ── FIELD VIDEO STUDIO ──────────────────────────────────────────────────────────
// The field briefing video deck appears on FloodDash and Innovation-as-a-Service:
// on FloodDash because that watch is read from standing in the rain, and on
// Innovation-as-a-Service because the practice begins in the same place. Each
// carries its own caption.
{
  const p0 = await newPage();
  await p0.goto(BASE + '#flood-ami', { waitUntil: 'networkidle' });
  await p0.waitForTimeout(600);
  const fd = await p0.evaluate(() => {
    const fig = document.querySelector('.vstudio');
    return {
      found: !!fig,
      caption: fig && fig.querySelector('.vstudio-desc') ? fig.querySelector('.vstudio-desc').textContent : '',
    };
  });
  check('FloodDash carries the video studio, by instruction', fd.found);
  check('and its caption is the flood one', /flood season/i.test(fd.caption), fd.caption.slice(0, 60));
  await p0.context().close();
  const p = await newPage();
  await p.goto(BASE + '#iaas', { waitUntil: 'networkidle' });
  await p.waitForTimeout(600);
  const r = await p.evaluate(async () => {
    const fig = document.querySelector('.vstudio');
    const iframe = fig && fig.querySelector('iframe');
    const items = fig ? Array.from(fig.querySelectorAll('.vstudio-item')) : [];
    const initialSrc = iframe ? iframe.src : '';
    
    // Test interactive clicking on thumbnail 1 (index 1)
    let switchWorked = false;
    if (items.length > 1) {
      items[1].click();
      switchWorked = iframe && iframe.src.includes('lLnq4LefXiI') && items[1].classList.contains('is-active');
    }

    return {
      found: !!fig,
      caption: fig && fig.querySelector('.vstudio-desc') ? fig.querySelector('.vstudio-desc').textContent : '',
      initialSrc,
      itemCount: items.length,
      switchWorked,
      w: fig ? Math.round(fig.getBoundingClientRect().width) : 0,
      fits: fig ? fig.getBoundingClientRect().width <= 960 : false,
    };
  });
  check('Innovation-as-a-Service carries the field video studio', r.found);
  check('its caption is the practice one, not the flood one',
    !/flood season|in Thai, in public/i.test(r.caption), r.caption.slice(0, 60));
  check('video studio has an iframe pointing at YouTube hero', /youtube-nocookie\.com\/embed\/0-A3R_i3wrs/.test(r.initialSrc), r.initialSrc);
  check('video studio carries 5 field briefing cards', r.itemCount === 5, `${r.itemCount} items`);
  check('clicking a playlist item switches player to that video', r.switchWorked === true);
  check('video studio fits bounded measure', r.fits, `${r.w}px`);
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
    // Every plate is a museum work: public domain, or CC0 from the holding
    // museum's own open-access file. There are no studio originals, so a
    // plate that carries anything else is a licence gap, not a house credit.
    const OK_LIC = ['Public domain', 'CC0'];
    const badLic = Object.keys(plates).filter(id => !OK_LIC.includes(plates[id][5]));
    const broken = [];
    for (const id of Object.keys(plates)) {
      const res = await fetch('art/' + id + '.webp', { method: 'HEAD' });
      if (res.status !== 200) broken.push(id);
    }
    location.hash = '#pb-ascn';
    await new Promise(r => setTimeout(r, 150));
    const pb = !!document.querySelector('#plate .shot') && !document.querySelector('#plate .plate-art');
    const sysIds = new Set(sys);
    // A plate is live if a system mounts it or a page in the book references it.
    // Deriving this beats exempting a prefix: a plate added to plates.js and
    // wired into nothing now fails, instead of passing on a naming convention.
    const bookIds = new Set(window.AXIOM_BOOK_PLATES || []);
    const orphans = Object.keys(plates).filter(id => !sysIds.has(id) && !bookIds.has(id));
    // The mirror: a page that asks for an artwork nobody defined renders empty,
    // because the plate builders skip an unknown id without complaining.
    const dangling = [...bookIds].filter(id => !plates[id]);
    return { sys: sys.length, n: Object.keys(plates).length, missing, badLic, broken, pb, orphans, dangling, book: bookIds.size };
  });
  check('every system has a plate', r.missing.length === 0, `${r.n} plates for ${r.sys} systems, missing: ${r.missing.join(',') || 'none'}`);
  check('no plate is orphaned', r.orphans.length === 0, r.orphans.join(','));
  check('every page artwork exists', r.dangling.length === 0, r.dangling.join(','));
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

// ── AFFORDANCE: the index row under the cursor has to say so ───────────────
// 113 rows of near-identical 14px lines is where a hover either earns its
// place or gets ignored. These guard the three things that make it honest:
// the row grows, it grows without moving anything, and it never opens a
// sideways scrollbar in a list that only scrolls vertically.
{
  const p = await newPage(1440, 900);
  await p.goto(BASE, { waitUntil: 'networkidle' });
  const widest = await p.evaluate(() => {
    let best = null;
    document.querySelectorAll('.item').forEach(el => {
      const lb = el.querySelector('.lb');
      if (!lb) return;
      const w = lb.getBoundingClientRect().width;
      if (!best || w > best.w) best = { w, id: el.dataset.id };
    });
    return best;
  });
  check('every index label carries its own hook', !!widest, widest ? widest.id : 'no .lb found');

  const rest = await p.evaluate(() => getComputedStyle(document.querySelector('.item .lb')).transform);
  check('a row at rest is not scaled', rest === 'none', rest);

  await p.hover(`.item[data-id="${widest.id}"]`);
  await p.waitForTimeout(320);
  const h = await p.evaluate(id => {
    const el = document.querySelector(`.item[data-id="${id}"]`);
    const lb = el.querySelector('.lb');
    const row = el.getBoundingClientRect(), lbBox = lb.getBoundingClientRect();
    const sc = document.querySelector('.index-scroll');
    const scale = new DOMMatrix(getComputedStyle(lb).transform).a;
    return {
      scale,
      originX: getComputedStyle(lb).transformOrigin,
      ox: getComputedStyle(sc).overflowX,
      idxRight: Math.round(document.querySelector('.index').getBoundingClientRect().right),
      lbRight: Math.round(lbBox.right),
      rowH: Math.round(row.height),
      // neighbour must not move: a hover that shifts the list is a bug
      sibTop: Math.round(el.nextElementSibling ? el.nextElementSibling.getBoundingClientRect().top : 0),
    };
  }, widest.id);

  check('the hovered label grows', h.scale > 1.05, `scale ${h.scale}`);
  check('it grows from its left edge, not its centre', /^0px\b/.test(h.originX), h.originX);
  check('the grown label stays inside the index column', h.lbRight <= h.idxRight, `${h.lbRight} vs ${h.idxRight}`);
  check('the row keeps its 44px target', h.rowH >= 44, `${h.rowH}px`);
  check('a vertical list never offers a sideways scrollbar', h.ox === 'hidden', `overflow-x ${h.ox}`);

  const quiet = await p.evaluate(() => [...document.querySelectorAll('.item .lb')]
    .filter(lb => getComputedStyle(lb).transform !== 'none').length);
  check('exactly one row responds to the pointer', quiet === 1, `${quiet} scaled`);
  await p.context().close();
}

// ── REDUCED MOTION: the affordance survives, the travel does not ───────────
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' });
  const id = await p.evaluate(() => document.querySelector('.item').dataset.id);
  await p.hover(`.item[data-id="${id}"]`);
  await p.waitForTimeout(200);
  const r = await p.evaluate(sel => {
    const lb = document.querySelector(sel);
    return { t: getComputedStyle(lb).transform, dur: getComputedStyle(lb).transitionDuration };
  }, `.item[data-id="${id}"] .lb`);
  check('reduced motion still shows which row you are on', r.t !== 'none', r.t);
  check('reduced motion drops the transition', /^(0s|0s, 0s)/.test(r.dur), r.dur);
  await ctx.close();
}

// ── THE RESPONSE COVERS THE TARGET, IN BOTH THEMES ────────────────────────
// The clickable row is 419x44 but the title inks about 200px of it, so a
// text-only hover answers a hand's width away from a reader parked in the
// empty side of the row. The wash is what puts the answer under the cursor.
for (const theme of ['light', 'dark']) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' });
  if (theme === 'dark') {
    await p.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
    await p.waitForTimeout(250);
  }
  await p.hover('.item[data-id="flood-ami"]');
  await p.waitForTimeout(320);
  const row = await p.evaluate(() => {
    const el = document.querySelector('.item[data-id="flood-ami"]');
    const cs = getComputedStyle(el);
    return {
      bg: cs.backgroundColor, color: cs.color,
      num: getComputedStyle(el.querySelector('.num')).color,
      heights: [...new Set([...document.querySelectorAll('.item')].map(e => Math.round(e.getBoundingClientRect().height)))],
    };
  });
  check(`${theme}: the hover washes the whole row`, row.bg !== 'rgba(0, 0, 0, 0)' && row.bg !== 'transparent', row.bg);
  check(`${theme}: a wash that darkens a dark row would eat its own contrast`, theme === 'light'
    ? row.bg.startsWith('rgba(0, 36, 125') : row.bg.startsWith('rgba(158, 188, 240'), row.bg);
  check(`${theme}: row and number brighten together`, row.num === row.color, `${row.num} vs ${row.color}`);
  check(`${theme}: the wash costs no row height`, row.heights.length === 1 && row.heights[0] === 44, JSON.stringify(row.heights));

  // contrast read off the painted pixel, not modelled from the tokens
  const shot = await p.locator('.item[data-id="flood-ami"]').screenshot();
  const px = await p.evaluate(async b64 => {
    const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    c.getContext('2d').drawImage(img, 0, 0);
    const d = c.getContext('2d').getImageData(Math.round(img.width * 0.93), Math.round(img.height * 0.5), 1, 1).data;
    return [d[0], d[1], d[2]];
  }, shot.toString('base64'));
  const fg = (row.color.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
  const lum = c => { const f = x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const l1 = lum(fg), l2 = lum(px);
  const ratio = Math.round(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)) * 100) / 100;
  check(`${theme}: the label keeps AA contrast on the painted wash`, ratio >= 4.5, `${ratio}:1`);
  await ctx.close();
}

// ── TOUCH: a hover that latches after a tap is worse than no hover ────────
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  const media = await p.evaluate(() => ({ none: matchMedia('(hover: none)').matches, coarse: matchMedia('(pointer: coarse)').matches }));
  check('the phone really reports no hover', media.none && media.coarse, JSON.stringify(media));
  await p.evaluate(() => { const bk = document.querySelector('.back'); if (bk) bk.click(); });
  await p.waitForTimeout(400);
  await p.tap('.item[data-id="flood-ami"]');
  await p.waitForTimeout(700);
  const after = await p.evaluate(() => {
    const el = document.querySelector('.item[data-id="flood-ami"]');
    return { bg: getComputedStyle(el).backgroundColor, scaled: getComputedStyle(el.querySelector('.lb')).transform, hash: location.hash };
  });
  check('a tap navigates', after.hash === '#flood-ami', after.hash);
  check('no row is left washed behind the tap', after.bg === 'rgba(0, 0, 0, 0)', after.bg);
  check('no label is left latched behind the tap', after.scaled === 'none', after.scaled);
  await ctx.close();
}

// ── KEYBOARD: focus has its own signal and must not borrow the hover's ─────
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  for (let i = 0; i < 9; i++) await p.keyboard.press('Tab');
  const f = await p.evaluate(() => {
    const el = document.activeElement;
    if (!el || !el.classList.contains('item')) return null;
    const cs = getComputedStyle(el);
    return { outline: cs.outlineStyle + ' ' + cs.outlineWidth + ' ' + cs.outlineColor,
             scaled: getComputedStyle(el.querySelector('.lb')).transform, bg: cs.backgroundColor };
  });
  check('tabbing lands on an index row', !!f, f ? '' : 'focus never reached a row');
  if (f) {
    check('focus is drawn as a real outline', f.outline.includes('solid'), f.outline);
    check('focus does not borrow the hover wash', f.bg === 'rgba(0, 0, 0, 0)', f.bg);
    check('focus does not inflate the label', f.scaled === 'none', f.scaled);
  }
  await ctx.close();
}

// ── FIELD NOTES: a claim you can only read is not a claim you can check ────
// Each note is a title and a paragraph. On its own that leaves a hole in the
// page, which is the tell that the note is asserting something it is not
// showing. Under the prose each one now carries two objects: an artwork that
// stands for the claim, and a drawing of the claim.
{
  const p = await newPage(1440, 1000);
  await p.goto(BASE, { waitUntil: 'networkidle' });
  const notes = await p.evaluate(async () => {
    const ids = [...document.querySelectorAll('#nav button[data-id]')]
      .map(b => b.dataset.id).filter(id => /^note-\d|^stack$/.test(id));
    const out = [];
    for (const id of ids) {
      location.hash = '#' + id;
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const duo = document.querySelector('.duo');
      const img = duo && duo.querySelector('.plate-img');
      // The band is rebuilt on each note change; read the frame only once it has
      // painted, or naturalWidth is still 0 and the ratio below comes back NaN.
      if (img && !img.complete) {
        await new Promise(r => { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }); setTimeout(r, 5000); });
      }
      const svg = duo && duo.querySelector('svg.dg');
      out.push({
        id,
        hasDuo: !!duo,
        twoSides: duo ? duo.children.length === 2 : false,
        artOk: !!(img && img.complete && img.naturalWidth > 0),
        artRatio: img ? +(img.naturalWidth / img.naturalHeight).toFixed(2) : 0,
        artLabel: !!(duo && duo.querySelector('.plate-label b')),
        artSrc: !!(duo && duo.querySelector('.plate-src a[href^="https://commons"]')),
        hasSvg: !!svg,
        svgTitled: !!(svg && svg.querySelector('title') && svg.querySelector('title').textContent.trim()),
        shapes: svg ? svg.querySelectorAll('path,rect,circle,polygon,text').length : 0,
        capText: (duo && duo.querySelector('.duo-fig figcaption') || {}).textContent || '',
      });
    }
    return out;
  });
  check('all seven field notes carry a duo band', notes.length === 7, `${notes.length} notes`);
  for (const n of notes) {
    check(`${n.id}: has a duo`, n.hasDuo);
    check(`${n.id}: duo is two sides`, n.twoSides);
    check(`${n.id}: artwork side loads`, n.artOk);
    check(`${n.id}: artwork is landscape`, n.artRatio > 1.2, `${n.artRatio}`);
    check(`${n.id}: artwork keeps its museum label`, n.artLabel && n.artSrc);
    check(`${n.id}: diagram is drawn`, n.hasSvg && n.shapes >= 6, `${n.shapes} shapes`);
    check(`${n.id}: diagram is named for a screen reader`, n.svgTitled);
    check(`${n.id}: caption explains the drawing`, n.capText.length > 20);
  }

  // A vertical frame in this column would reintroduce the imbalance the column
  // exists to remove, so the duo's own art is capped by height rather than
  // allowed to stand tall beside a wide diagram.
  const capped = await p.evaluate(() => {
    location.hash = '#note-1';
    const img = document.querySelector('.duo .plate-img');
    return img ? Math.round(img.getBoundingClientRect().height) : 0;
  });
  check('duo artwork is capped, never billboarded', capped > 0 && capped <= 300, `${capped}px`);

  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('the duo adds no sideways overflow', overflow === 0, `${overflow}px`);
  await p.context().close();
}

// ── THE DIAGRAMS OBEY THE HOUSE RULES ──────────────────────────────────────
// Rams as method: square corners, hairline or single-weight strokes, and no
// decoration that is not carrying meaning. An SVG cannot be audited by looking
// at it, so it is audited by reading it.
{
  const raw = await readFile(new URL('../axiomx/diagrams.js', import.meta.url), 'utf8');
  // The prose at the top of that file describes these rules, so it necessarily
  // contains the words "gradient" and "corner". Audit the drawing, not the
  // comment about the drawing — otherwise this check passes and fails on prose.
  const svg = raw.replace(/\/\*[\s\S]*?\*\//g, '');
  check('no diagram paints a gradient', !/<(linear|radial)Gradient|url\(#/i.test(svg));
  check('no diagram rounds a corner', !/rx\s*=|ry\s*=|border-radius/i.test(svg));
  check('no diagram uses a filter or shadow', !/<filter|feDropShadow|drop-shadow/i.test(svg));
  check('no diagram sets an inline hex colour', !/#[0-9a-f]{3,6}/i.test(svg));
  const keys = [...raw.matchAll(/^  '([a-z0-9-]+)':/gim)].map(m => m[1]);
  check('there is a diagram per field note', keys.length === 7, keys.join(','));
  check('every diagram names itself for assistive tech',
    (raw.match(/aria-labelledby=/g) || []).length === keys.length,
    `${(raw.match(/aria-labelledby=/g) || []).length} for ${keys.length} diagrams`);
}

// ── PHONE: the duo stacks, and the diagram stays legible ───────────────────
for (const w of [390, 320]) {
  const p = await newPage(w, 900);
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.evaluate(() => { location.hash = '#note-5'; });
  await p.waitForTimeout(700);
  const r = await p.evaluate(() => {
    const duo = document.querySelector('.duo');
    const kids = duo ? [...duo.children].map(c => Math.round(c.getBoundingClientRect().top)) : [];
    return {
      stacked: kids.length === 2 && kids[1] > kids[0],
      svgW: Math.round((document.querySelector('.duo svg.dg') || { getBoundingClientRect: () => ({ width: 0 }) }).getBoundingClientRect().width),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  check(`duo stacks at ${w}px`, r.stacked);
  check(`diagram still reads at ${w}px`, r.svgW > 200, `${r.svgW}px wide`);
  check(`no sideways overflow at ${w}px`, r.overflow === 0, `${r.overflow}px`);
  await p.context().close();
}

// ── VIDEO STUDIO: responsive layout and no sideways overflow ──────────────
{
  const p = await newPage(1440, 1000);
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.evaluate(() => { location.hash = '#flood-ami'; });
  await p.waitForTimeout(900);
  const m = await p.evaluate(() => {
    const s = document.querySelector('.vstudio'), v = document.querySelector('.vstudio-player'), l = document.querySelector('.vstudio-list');
    const sb = s.getBoundingClientRect(), vb = v.getBoundingClientRect(), lb = l.getBoundingClientRect();
    return {
      display: getComputedStyle(s).display,
      studioW: Math.round(sb.width),
      vW: Math.round(vb.width),
      lW: Math.round(lb.width),
      sideBySide: Math.abs(vb.y - lb.y) < 15,
    };
  });
  check('video studio is a grid with side-by-side player and playlist', m.display === 'grid' && m.sideBySide, JSON.stringify(m));
  check('the studio is sized to its container, not overflowing', m.studioW <= 960, `${m.studioW}px`);
  await p.context().close();
}

// NARROW: across viewports, video studio stacks cleanly without sideways overflow
for (const w of [1030, 900, 640, 390, 320]) {
  const p = await newPage(w, 900);
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.evaluate(() => { location.hash = '#flood-ami'; });
  await p.waitForTimeout(800);
  const r = await p.evaluate(() => {
    const s = document.querySelector('.vstudio');
    const sb = s.getBoundingClientRect();
    const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    return {
      overflow,
      fits: sb.right <= document.documentElement.clientWidth + 2,
    };
  });
  check(`video studio never leaves its column @${w}`, r.fits);
  check(`no sideways overflow @${w}`, r.overflow === 0, `${r.overflow}px`);
  await p.context().close();
}

// ── JOURNEY: the stack entry and the touch targets ──────────────────────────
// The stack entry appends 114 tool names as adjacent inline boxes. With no
// whitespace between them there is no legal line break, so the row ran off the
// page (+996px desktop, +1406px phone) and the main journeys never saw it:
// they measure the document, and the plate scrolls sideways inside it.
for (const [w, h] of [[1440, 900], [1030, 900], [390, 844], [320, 700]]) {
  const p = await newPage(w, h);
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.evaluate(() => { location.hash = '#stack'; });
  await p.waitForTimeout(350);
  const r = await p.evaluate(() => {
    const pl = document.getElementById('plate');
    return { plate: pl.scrollWidth - pl.clientWidth, doc: document.documentElement.scrollWidth - innerWidth,
      tools: document.querySelectorAll('.tool').length, rows: new Set([...document.querySelectorAll('.tool')].map(e => Math.round(e.getBoundingClientRect().top))).size };
  });
  check(`stack: the plate does not scroll sideways @${w}`, r.plate <= 0, `${r.plate}px`);
  check(`stack: no document overflow @${w}`, r.doc <= 0, `${r.doc}px`);
  check(`stack: tool names wrap onto several rows @${w}`, r.tools > 100 && r.rows > 8, `${r.tools} tools, ${r.rows} rows`);
  await p.context().close();
}
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  p.on('pageerror', e => fails.push('JS ERROR: ' + e.message));
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.evaluate(() => { location.hash = '#moma-rules'; });
  await p.waitForTimeout(250);
  const pager = await p.evaluate(() => [...document.querySelectorAll('.pager a')].map(a => { const r = a.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; }));
  check('phone: previous/next links are 44px targets in both dimensions', pager.length === 2 && pager.every(([w, h]) => w >= 44 && h >= 44), JSON.stringify(pager));
  const bar = await p.evaluate(() => [...document.querySelectorAll('.text-btn')].filter(e => e.getBoundingClientRect().width).map(e => [e.id || e.textContent.trim(), Math.round(e.getBoundingClientRect().width), Math.round(e.getBoundingClientRect().height)]));
  check('phone: bar text buttons are 44px in both dimensions', bar.length > 0 && bar.every(([, w, h]) => w >= 44 && h >= 44), JSON.stringify(bar));
  await p.evaluate(() => { location.hash = '#non'; });
  await p.waitForTimeout(250);
  const act = await p.evaluate(() => [...document.querySelectorAll('.actions a')].map(a => { const r = a.getBoundingClientRect(); return [a.textContent.trim().slice(0, 14), Math.round(r.width), Math.round(r.height)]; }));
  check('phone: action links are 44px in both dimensions', act.length > 0 && act.every(([, w, h]) => w >= 44 && h >= 44), JSON.stringify(act));
  await ctx.close();
}

console.log('PASS ' + ok.length);
ok.forEach(o => console.log('  ✓ ' + o));
console.log('\nFAIL ' + fails.length);
fails.forEach(f => console.log('  ✗ ' + f));
await b.close();
process.exit(fails.length ? 1 : 0);