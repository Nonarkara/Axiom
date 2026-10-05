import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../public/footprint.js', import.meta.url), 'utf8');
const context = { window: {} };
runInNewContext(source, context);
const { stops, projects, coverage, copy } = context.window.AXIOM_FOOTPRINT;
const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
const destinations = Array.from(html.matchAll(/href="(https:[^"]+)"/g), match => {
  const url = new URL(match[1]);
  return url.origin + url.pathname;
});

test('every mapped project belongs to a real tour stop and a catalog destination', () => {
  assert.equal(new Set(stops.map(stop => stop.key)).size, stops.length);
  assert.equal(new Set(projects.map(project => project.key)).size, projects.length);
  for (const project of projects) {
    const stop = stops.find(item => item.key === project.stop);
    assert.ok(stop, project.key);
    assert.ok(stop.projects.includes(project.key), project.key);
    const url = new URL(project.href || stop.href);
    assert.equal(url.protocol, 'https:');
    assert.ok(destinations.includes(url.origin + url.pathname), url.href);
    assert.ok(Math.abs(project.lat ?? stop.lat) <= 90);
    assert.ok(Math.abs(project.lng ?? stop.lng) <= 180);
  }
  for (const stop of stops) {
    assert.ok(stop.zoom >= 3 && stop.zoom <= 16, stop.key);
    for (const key of stop.projects) assert.ok(projects.some(project => project.key === key), key);
  }
});

test('requested geography and the original four theatre controls survive', () => {
  for (const key of ['chiang-mai', 'lopburi', 'nakhon-si-thammarat', 'chonburi', 'kmitl', 'chula', 'thailand', 'malaysia', 'kuching', 'ho-chi-minh-city']) {
    assert.ok(stops.some(stop => stop.key === key), key);
  }
  for (const key of ['bangkok', 'phuket', 'middle-east', 'southeast-asia']) {
    assert.ok(stops.some(stop => stop.key === key), key);
    assert.ok(html.includes(`data-city="${key}"`), key);
  }
  assert.ok(html.indexOf('src="footprint.js') < html.indexOf('src="app.js'));
  assert.match(html, /for="heroProjectSelect"/);
});

test('all seven locales name every stop and distinguish coverage from installation sites', () => {
  for (const locale of ['en', 'th', 'zh', 'ko', 'ja', 'vi', 'ts']) {
    const local = copy[locale];
    assert.equal(local.locations.length, stops.length, locale);
    for (const stop of stops) assert.ok(local.scopes[stop.scope], `${locale}:${stop.scope}`);
    for (const key of ['label', 'hud', 'watching', 'kicker', 'note', 'pause', 'resume', 'multi']) assert.ok(local[key], `${locale}:${key}`);
  }
  assert.equal(stops.find(stop => stop.key === 'thailand').scope, 'national');
  assert.equal(stops.find(stop => stop.key === 'malaysia').scope, 'national');
  assert.equal(stops.find(stop => stop.key === 'middle-east').scope, 'regional');
  assert.equal(coverage.malaysia.length, 2, 'Malaysia includes Peninsula and Borneo');
});

async function heroHarness(reduced = false) {
  const app = await readFile(new URL('../public/app.js', import.meta.url), 'utf8');
  const start = app.indexOf('(function initSatelliteHero() {');
  const end = app.indexOf('(function initDataLines()', start);
  assert.ok(start >= 0 && end > start);
  const elements = new Map();
  function element(id) {
    if (elements.has(id)) return elements.get(id);
    const node = {
      textContent: '', style: {}, dataset: {}, attributes: {}, listeners: {}, options: [],
      classList: { toggle() {}, add() {}, remove() {} },
      getBoundingClientRect: () => ({ top: 0, height: 180 }),
      setAttribute(name, value) { this.attributes[name] = value; },
      addEventListener(name, callback) { this.listeners[name] = callback; },
      append(option) { this.options.push(option); },
    };
    elements.set(id, node);
    return node;
  }
  const select = element('heroProjectSelect');
  select.firstElementChild = { remove() {} };
  const intervals = new Map();
  const timeouts = new Map();
  let timerId = 0;
  const handlers = {};
  const markers = [];
  const flights = [];
  const point = (x, y) => ({ x, y, add(other) { return point(x + other.x, y + other.y); } });
  const map = {
    on(name, callback) { handlers[name] = callback; },
    invalidateSize() {}, stop() {}, getSize: () => ({ x: 1280, y: 626 }),
    project: position => point(position[1] * 100, position[0] * 100),
    unproject: position => ({ lat: position.y / 100, lng: position.x / 100 }),
    flyTo(center, zoom, options) {
      flights.push({ center, zoom, options });
      handlers.zoomstart?.();
      handlers.moveend?.();
      return this;
    },
  };
  const layer = () => ({ addTo() { return this; }, clearLayers() {} });
  const heroCopy = {
    hudWatching: 'SYSTEMS IN VIEW',
    theatres: Object.fromEntries(stops.map((stop, index) => [stop.key, {
      name: copy.en.locations[index], meta: copy.en.scopes[stop.scope], featuredName: stop.system,
    }])),
  };
  const window = {
    AXIOM_FOOTPRINT: context.window.AXIOM_FOOTPRINT,
    L: {}, axiom: {}, dispatchEvent() {}, addEventListener() {},
    matchMedia: () => ({ matches: false }),
  };
  Object.assign(window.L, {
    map: () => map, point, tileLayer: layer, layerGroup: layer, rectangle: layer,
    divIcon: icon => icon,
    marker(position, options) {
      const pin = element(`pin-${markers.length}`);
      const marker = {
        position, options, handlers: {},
        addTo() { return this; }, on(name, callback) { this.handlers[name] = callback; },
        setIcon(icon) { this.options.icon = icon; }, setZIndexOffset() {}, getElement: () => pin,
      };
      markers.push(marker);
      return marker;
    },
  });
  runInNewContext(app.slice(start, end), {
    window, L: window.L, axiom: window.axiom, activeLocale: 'en', uiCopy: { en: { hero: heroCopy } },
    axiomMedia: { isTouch: false, isMobile: false, isReduced: reduced },
    document: { hidden: false, getElementById: element, querySelectorAll: () => [], querySelector: () => null, createElement: () => ({}), addEventListener() {} },
    ResizeObserver: class { observe() {} }, CustomEvent: class {}, escapeHtml: value => value,
    setTimeout(callback, delay) { const id = ++timerId; timeouts.set(id, { callback, delay }); return id; },
    clearTimeout: id => timeouts.delete(id),
    setInterval(callback) { const id = ++timerId; intervals.set(id, callback); return id; },
    clearInterval: id => intervals.delete(id),
  });
  return { elements, select, markers, intervals, timeouts, flights };
}

test('the complete tour keeps pins and scope aligned, and a pin selects its own dashboard', async () => {
  const harness = await heroHarness();
  assert.equal(harness.select.value, 'thailand');
  assert.equal(harness.markers.length, 20);
  const initial = Array.from(harness.timeouts.values()).find(timer => timer.delay === 9000);
  initial.callback();
  assert.equal(harness.select.value, stops[1].key);
  const tick = Array.from(harness.intervals.values())[0];
  for (let index = 2; index <= stops.length; index++) {
    tick();
    assert.equal(harness.select.value, stops[index % stops.length].key);
    assert.equal(harness.markers.length, 20);
  }
  const culture = harness.markers.find(marker => marker.getElement().dataset.project === 'culture');
  culture.handlers.click();
  assert.equal(harness.intervals.size, 0);
  assert.equal(harness.elements.get('heroFeaturedName').textContent, 'BKKx Culture');
  assert.equal(harness.elements.get('heroFeaturedBadge').href, 'https://bkk.nonarkara.org/');
  assert.equal(harness.elements.get('mapModeBtn').attributes['aria-pressed'], 'false');
  const campus = harness.markers.find(marker => marker.getElement().dataset.project === 'kmitl');
  campus.getElement().onkeydown({ key: ' ', preventDefault() {}, stopPropagation() {} });
  assert.equal(harness.elements.get('heroFeaturedBadge').href, 'https://kmitl-control-tower.pages.dev/');
  assert.equal(harness.select.value, 'kmitl');
  harness.elements.get('mapModeBtn').listeners.click({ stopPropagation() {} });
  assert.equal(harness.intervals.size, 1);
  assert.equal(harness.select.value, 'muang-thong-thani');
});

test('reduced motion initializes Hold without scheduling a tour or animated flight', async () => {
  const harness = await heroHarness(true);
  assert.equal(harness.timeouts.size, 0);
  assert.equal(harness.intervals.size, 0);
  assert.equal(harness.elements.get('mapModeBtn').attributes['aria-pressed'], 'false');
  assert.equal(harness.flights[0].options.animate, false);
});
