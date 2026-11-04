import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve, extname } from 'node:path';
import { securityHeaders } from '../lib/security.mjs';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

test('VR uses a pinned module, real canvas and honest demonstration copy', async () => {
  const html = await read('public/vr/index.html');
  const js = await read('public/vr/vr.js');
  assert.match(html, /<canvas id="vrCanvas"/);
  assert.match(html, /<script type="module" src="vr.js\?v=/);
  assert.match(js, /await import\('https:\/\/unpkg.com\/three@0\.160\.0\/build\/three.module.js'\)/);
  assert.match(html, /FICTIONAL DEMONSTRATION/);
  assert.doesNotMatch(html + js, /openfootball|fetched 2026|Premier League 2026/);
  assert.doesNotMatch(js, /requestAnimationFrame|window\.addEventListener\('(click|pointermove)'/);
  assert.match(js, /if \(!document.hidden\) renderer.render/);
  assert.match(js, /canvas.getBoundingClientRect\(\)/);
  assert.match(js, /prefers-reduced-motion|Render only on input/);
});

test('CO tiles and attribution use the existing CSP allowance', async () => {
  const js = await read('public/co/co.js');
  assert.match(js, /attributionControl: true/);
  assert.match(js, /https:\/\/server.arcgisonline.com\/ArcGIS\/rest\/services\/World_Street_Map\/MapServer\/tile\/\{z\}\/\{y\}\/\{x\}/);
  assert.doesNotMatch(js, /cartocdn/);
  assert.match(js, /Tiles &copy; Esri/);
});

// Opt in: VR_BROWSER_TEST=1 node --test tests/vr.test.mjs
test('VR/CO browser regressions under unchanged CSP', { skip: !process.env.VR_BROWSER_TEST, timeout: 180_000 }, async () => {
  const { chromium } = await import('playwright');
  const publicRoot = resolve(new URL('public/', root).pathname);
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = resolve(publicRoot, `.${path}${path.endsWith('/') ? 'index.html' : ''}`);
    if (!file.startsWith(`${publicRoot}/`)) return res.writeHead(403).end();
    try {
      const body = await readFile(file);
      const type = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' }[extname(file)] || 'application/octet-stream';
      res.writeHead(200, { ...securityHeaders(), 'Content-Type': type });
      res.end(body);
    } catch { res.writeHead(404).end(); }
  });
  await new Promise((done) => server.listen(0, '127.0.0.1', done));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch();
  const evidence = process.env.VR_EVIDENCE_DIR || '/tmp/axiom-vr-evidence';
  await mkdir(evidence, { recursive: true });
  try {
    for (const width of [390, 1024, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      const errors = [];
      await page.addInitScript(() => {
        window.draws = 0;
        for (const type of [WebGLRenderingContext, WebGL2RenderingContext]) {
          for (const name of ['drawElements', 'drawArrays']) {
            const original = type.prototype[name];
            type.prototype[name] = function (...args) {
              window.draws++;
              return original.apply(this, args);
            };
          }
        }
      });
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (/Content Security Policy|Refused to/.test(message.text())) errors.push(message.text());
      });
      await page.goto(`${base}/vr/`);
      await page.waitForSelector('canvas[data-ready="true"]', { timeout: 45_000 });
      const canvas = page.locator('#vrCanvas');
      const box = await canvas.boundingBox();
      assert.ok(box.height >= 280 && box.width === width, `bounded stage at ${width}`);
      const pixels = await canvas.screenshot();
      const painted = await page.evaluate(async (data) => {
        const image = new Image();
        image.src = `data:image/png;base64,${data}`;
        await image.decode();
        const c = document.createElement('canvas');
        c.width = image.width; c.height = image.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(image, 0, 0);
        const { data: rgba } = ctx.getImageData(0, 0, c.width, c.height);
        let green = 0, colored = 0;
        for (let i = 0; i < rgba.length; i += 4) {
          if (rgba[i + 1] > rgba[i] * 1.3 && rgba[i + 1] > rgba[i + 2] * 1.1) green++;
          if (Math.max(rgba[i], rgba[i + 1], rgba[i + 2]) - Math.min(rgba[i], rgba[i + 1], rgba[i + 2]) > 30) colored++;
        }
        return { green, colored };
      }, pixels.toString('base64'));
      assert.ok(painted.green > 1000 && painted.colored > 2000, `nonblank pitch/bars: ${JSON.stringify(painted)}`);
      assert.equal(await page.locator('#vrTable').evaluate((el) => getComputedStyle(el).transitionDuration), '0s');
      const draws = await page.evaluate(() => window.draws);
      await page.waitForTimeout(100);
      assert.equal(await page.evaluate(() => window.draws), draws, 'no idle animation');
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { configurable: true, value: true });
        document.dispatchEvent(new Event('visibilitychange'));
        document.querySelector('canvas').dispatchEvent(new PointerEvent('pointermove', { clientX: 20, clientY: 20 }));
      });
      assert.equal(await page.evaluate(() => window.draws), draws, 'hidden page does not render on input');
      await page.evaluate(() => {
        delete document.hidden;
        document.dispatchEvent(new Event('visibilitychange'));
      });
      assert.ok(await page.evaluate(() => window.draws) > draws, 'visible page renders again');

      // Project a known bar centre, then click without a preceding pointermove.
      const point = await page.evaluate(async () => {
        const THREE = await import('https://unpkg.com/three@0.160.0/build/three.module.js');
        const r = document.querySelector('canvas').getBoundingClientRect();
        const camera = new THREE.PerspectiveCamera(45, r.width / r.height, 1, 500);
        const distance = Math.max(100, 125 / camera.aspect);
        camera.position.set(0, distance * 0.65, distance);
        camera.lookAt(0, 4, 0); camera.updateMatrixWorld();
        const angle = -Math.PI * 0.42;
        const p = new THREE.Vector3(Math.sin(angle) * 46, 7, -Math.cos(angle) * 46 + 24).project(camera);
        return { x: r.left + (p.x + 1) * r.width / 2, y: r.top + (1 - p.y) * r.height / 2 };
      });
      await page.dispatchEvent('#vrCanvas', 'click', { clientX: point.x, clientY: point.y });
      assert.equal(await page.locator('.vr-table__row--active button').textContent(), 'Manchester City');
      await page.getByRole('button', { name: 'Close table' }).click();
      assert.equal(await page.locator('#vrTable').getAttribute('aria-hidden'), 'true');
      await page.waitForTimeout(250);
      assert.equal(await page.locator('#vrTable').getAttribute('aria-hidden'), 'true', 'close does not re-open via global click');
      await page.mouse.click(point.x, point.y);
      assert.equal(await page.locator('#vrTableToggle').getAttribute('aria-expanded'), 'true', 'real pointer selects bar');
      await page.keyboard.press('Escape');
      await canvas.focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('#vrTableToggle').getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Escape');
      assert.equal(await canvas.evaluate((el) => el === document.activeElement), true);
      await page.getByRole('button', { name: 'Table', exact: true }).click();
      await page.locator('[data-team="2"]').click();
      assert.match(await page.locator('#vrTableNote').textContent(), /Liverpool/);
      await page.keyboard.press('Escape');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      if (width === 390) assert.ok(box.height <= 320, 'phone stage does not invent vertical voids');
      await page.screenshot({ path: `${evidence}/vr-${width}.png`, fullPage: true });
      await page.addStyleTag({ content: '.vr-title__main { font-size: 56px } .vr-title__sub { font-size: 22px }' });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'enlarged text does not overflow');
      assert.equal(await page.locator('#vrTableToggle').isVisible(), true);
      console.log(`${width}px: ${JSON.stringify(painted)}; pointer, close, keyboard and overflow PASS`);
      assert.deepEqual(errors, []);
      await page.close();
    }

    const fallback = await browser.newPage();
    await fallback.route('https://unpkg.com/three@*/**', (route) => route.abort());
    await fallback.goto(`${base}/vr/`);
    await fallback.getByRole('status').filter({ hasText: '3D unavailable' }).waitFor();
    assert.equal(await fallback.locator('#vrTableBody tr').count(), 20);
    await fallback.locator('[data-team="1"]').click();
    assert.match(await fallback.locator('#vrTableNote').textContent(), /Arsenal/);
    await fallback.close();

    const noWebGL = await browser.newPage();
    await noWebGL.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        return /webgl/.test(type) ? null : original.call(this, type, ...args);
      };
    });
    await noWebGL.goto(`${base}/vr/`);
    await noWebGL.getByRole('status').filter({ hasText: '3D unavailable' }).waitFor();
    assert.equal(await noWebGL.locator('#vrTableBody tr').count(), 20);
    await noWebGL.getByRole('button', { name: 'Close table' }).click();
    await noWebGL.getByRole('button', { name: 'Table', exact: true }).click();
    assert.equal(await noWebGL.locator('#vrTable').getAttribute('aria-hidden'), 'false');
    await noWebGL.close();

    const noJS = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    await noJS.goto(`${base}/vr/`);
    assert.equal(await noJS.locator('#vrTableBody tr').count(), 20);
    assert.equal(await noJS.getByRole('table').isVisible(), true);
    await noJS.close();

    const co = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const violations = [];
    await co.addInitScript(() => {
      window.cspViolations = [];
      document.addEventListener('securitypolicyviolation', (event) => window.cspViolations.push(event.blockedURI));
    });
    co.on('pageerror', (error) => violations.push(error.message));
    const tile = co.waitForResponse((response) => response.url().includes('server.arcgisonline.com/') && response.status() === 200);
    await co.goto(`${base}/co/`);
    await tile;
    await co.locator('.leaflet-tile-loaded').first().waitFor();
    assert.equal(await co.locator('.leaflet-control-attribution').isVisible(), true);
    assert.match(await co.locator('.leaflet-control-attribution').textContent(), /Esri/);
    assert.deepEqual(await co.evaluate(() => window.cspViolations), []);
    assert.deepEqual(violations, []);
    await co.screenshot({ path: `${evidence}/co-390.png`, fullPage: true });
    console.log('CO: successful Esri tile response, painted tiles, visible attribution, zero CSP violations');
    await co.close();
  } finally {
    await browser.close();
    await new Promise((done) => server.close(done));
  }
});
