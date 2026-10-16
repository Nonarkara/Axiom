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
  const imgOk = await p.evaluate(() => {
    const i = document.querySelector('.shot');
    return i ? { src: i.src, ok: i.complete && i.naturalWidth > 0 } : null;
  });
  check('system screenshot loads from the main site', !!imgOk && imgOk.ok, imgOk ? imgOk.src : 'no img');
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
  check('Escape clears the search and restores the index', cleared.val === '' && cleared.items === 111,
        JSON.stringify(cleared));
  await p.keyboard.press('/');
  await p.keyboard.type('zzzznomatch');
  await p.waitForTimeout(250);
  check('empty search says so', (await p.textContent('#nav')).includes('Nothing under that name'));
  await p.keyboard.press('Escape');
  await p.keyboard.press('Escape');
  await p.waitForTimeout(200);
  check('second Escape fully restores', await p.evaluate(() => document.querySelectorAll('#nav .item').length === 111));
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