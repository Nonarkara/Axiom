// Generated from public/research-ui.js.
(function () {
  'use strict';
  const mounted = new WeakMap();
  function mount(root, initialLocale) {
    if (mounted.has(root)) return mounted.get(root);
    const data = window.AXIOM_RESEARCH;
    if (!data) return { destroy: function () {} };
    if (!root.isConnected || !root.getBoundingClientRect().width) {
      let active = null;
      let locale = initialLocale;
      root.dataset.mapState = 'awaiting-layout';
      const visible = new ResizeObserver(function () {
        if (!root.isConnected || !root.getBoundingClientRect().width) return;
        visible.disconnect();
        mounted.delete(root);
        active = mount(root, locale);
      });
      const deferred = {
        setLocale: function (next) { locale = next; if (active) active.setLocale(next); },
        destroy: function () { visible.disconnect(); if (active) active.destroy(); mounted.delete(root); },
      };
      mounted.set(root, deferred);
      visible.observe(root);
      return deferred;
    }
    const geography = window.AXIOM_RESEARCH_GEOGRAPHY;
    const regionSelect = root.querySelector('[data-research-region]');
    const systemSelect = root.querySelector('[data-research-filter]');
    const mapNode = root.querySelector('[data-research-map]');
    const fallback = root.querySelector('[data-research-fallback]');
    fallback.dataset.i18n = 'research.mapUnavailable';
    const rows = Array.from(root.querySelectorAll('[data-paper]'));
    let locale = initialLocale || 'en';
    let map = null;
    let observer = null;
    const layers = [];
    function focusMap(event) {
      if (!event.target.closest('.leaflet-control')) mapNode.focus({ preventScroll: true });
    }
    function fitFilterValue() {
      const output = root.querySelector('[data-research-filter-value]');
      if (!output) return;
      const label = systemSelect.selectedOptions[0].textContent;
      const intrinsic = systemSelect.cloneNode(true);
      intrinsic.removeAttribute('data-research-filter');
      intrinsic.setAttribute('aria-hidden', 'true');
      intrinsic.tabIndex = -1;
      intrinsic.style.cssText = 'position:absolute;visibility:hidden;max-width:none;width:max-content;pointer-events:none';
      systemSelect.parentNode.append(intrinsic);
      intrinsic.value = systemSelect.value;
      const required = intrinsic.getBoundingClientRect().width;
      intrinsic.remove();
      output.textContent = label;
      output.hidden = !systemSelect.value || required <= systemSelect.getBoundingClientRect().width + 1;
    }
    const filterObserver = new ResizeObserver(fitFilterValue);
    filterObserver.observe(systemSelect);
    const copy = () => data.copy[locale] || data.copy.en;
    const name = region => copy()[region.nameKey];

    function selectRegion(id) {
      regionSelect.value = id;
      if (!data.papers.some(p => (p.study.region || 'unmapped') === id && (!systemSelect.value || p.system === systemSelect.value))) systemSelect.value = '';
      update(true);
      const paper = rows.find(row => !row.hidden);
      if (paper) paper.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
    }
    function update(fit) {
      const region = regionSelect.value;
      const system = systemSelect.value;
      const visible = data.papers.filter(p => (!region || (p.study.region || 'unmapped') === region) && (!system || p.system === system));
      const ids = new Set(visible.map(p => p.id));
      rows.forEach(row => { row.hidden = !ids.has(row.dataset.paper); });
      root.querySelector('[data-research-count]').textContent = visible.length + ' / ' + data.papers.length + ' ' + copy().papers;
      root.querySelector('[data-research-empty]').hidden = visible.length > 0;
      root.querySelectorAll('[data-region-option]').forEach(option => {
        const id = option.dataset.regionOption;
        const definition = geography && geography.regions.find(item => item.id === id);
        const count = data.papers.filter(p => (p.study.region || 'unmapped') === id).length;
        option.textContent = (definition ? name(definition) : copy()[option.dataset.nameKey] || copy().unspecified) + ' (' + count + ')';
      });
      Array.from(systemSelect.options).slice(1).forEach(option => {
        const count = data.papers.filter(p => p.system === option.value && (!region || (p.study.region || 'unmapped') === region)).length;
        option.textContent = option.value + ' (' + count + ')';
      });
      fitFilterValue();
      if (!map) {
        if (!data.papers.some(p => p.study.region)) fallback.textContent = data.papers.length ? copy().unspecified : copy().empty;
        return;
      }
      const regions = new Set(visible.map(p => p.study.region).filter(Boolean));
      layers.forEach(item => {
        const active = regions.has(item.region.id);
        item.layer.setStyle({ opacity: active ? 1 : 0.15, fillOpacity: active ? 0.08 : 0, weight: active ? 2 : 1 });
        const label = document.createElement('span');
        label.textContent = name(item.region);
        item.layer.setTooltipContent(label);
        if (item.region.kind === 'reference') {
          if (region === item.region.id) item.layer.openTooltip();
          else item.layer.closeTooltip();
        }
      });
      const unmapped = !regions.size;
      mapNode.hidden = unmapped;
      fallback.hidden = !unmapped;
      if (unmapped) fallback.textContent = visible.length ? copy().unspecified : data.papers.length ? copy().noResults : copy().empty;
      root.dataset.mapState = unmapped ? (visible.length ? 'unmapped' : 'empty') : 'ready';
      const size = mapNode.getBoundingClientRect();
      if (fit && !unmapped && size.width > 0 && size.height > 0) {
        const bounds = window.L.latLngBounds([]);
        geography.regions.filter(item => regions.has(item.id)).forEach(item => {
          // Reference cities cannot establish provincial fit boxes.
          bounds.extend(item.bounds || geography.regions.find(item => item.id === 'thailand').bounds);
        });
        if (bounds.isValid()) map.fitBounds(bounds, { animate: false, padding: [24, 20] });
      }
    }
    function setLocale(next) {
      locale = data.copy[next] ? next : 'en';
      root.querySelectorAll('[data-i18n^="research."]').forEach(node => {
        const key = node.dataset.i18n.slice('research.'.length);
        if (typeof copy()[key] === 'string') node.textContent = copy()[key];
      });
      mapNode.setAttribute('aria-label', copy().mapTitle);
      const zoomIn = mapNode.querySelector('.leaflet-control-zoom-in');
      const zoomOut = mapNode.querySelector('.leaflet-control-zoom-out');
      if (zoomIn) zoomIn.setAttribute('aria-label', copy().zoomIn);
      if (zoomOut) zoomOut.setAttribute('aria-label', copy().zoomOut);
      update(false);
    }
    function onRegion() {
      if (regionSelect.value && systemSelect.value && !data.papers.some(p => (p.study.region || 'unmapped') === regionSelect.value && p.system === systemSelect.value)) systemSelect.value = '';
      update(true);
    }
    function onSystem() {
      if (regionSelect.value && systemSelect.value && !data.papers.some(p => p.system === systemSelect.value && (p.study.region || 'unmapped') === regionSelect.value)) regionSelect.value = '';
      update(true);
    }
    regionSelect.addEventListener('change', onRegion);
    systemSelect.addEventListener('change', onSystem);
    root.querySelector('[data-research-controls]').hidden = false;
    root.dataset.mapState = 'unavailable';
    setLocale(locale);
    try {
      if (window.L && geography && data.papers.some(p => p.study.region)) {
        const L = window.L;
        mapNode.hidden = false;
        mapNode.setAttribute('aria-label', copy().mapTitle);
        const size = mapNode.getBoundingClientRect();
        if (!size.width || !size.height) throw new Error('Research map has no rendered size');
        map = L.map(mapNode, { zoomControl: true, attributionControl: true, keyboard: true, scrollWheelZoom: false, doubleClickZoom: false, zoomAnimation: false, fadeAnimation: false, markerZoomAnimation: false });
        // Leaflet's pointer focus otherwise scrolls a short reader pane mid-click.
        mapNode.addEventListener('mousedown', focusMap, true);
        map.fitBounds(geography.regions.find(region => region.id === 'thailand').bounds, { animate: false, padding: [24, 20] });
        const panBy = map.panBy;
        map.panBy = function (offset, options) { return panBy.call(this, offset, Object.assign({}, options, { animate: false })); };
        map.attributionControl.setPrefix(false);
        map.attributionControl.addAttribution('<a href="https://www.naturalearthdata.com/">Natural Earth</a> · <a href="https://www.geonames.org/">GeoNames</a>');
        // Bundled SVG country context: no tiles, geocoding or external requests.
        L.geoJSON(geography.basemap, { interactive: false, style: { color: '#8b9396', weight: 0.65, fillColor: '#e2e7e7', fillOpacity: 1 } }).addTo(map);
        const used = new Set(data.papers.map(p => p.study.region));
        geography.regions.filter(region => used.has(region.id)).forEach(region => {
          const options = { color: '#00247d', weight: 2, fillOpacity: 0.08, className: 'research-region', dashArray: region.kind === 'frame' ? '5 4' : undefined };
          const layer = region.kind === 'frame' ? L.rectangle(region.bounds, options) : L.circleMarker(region.point, Object.assign({ radius: 6 }, options));
          layer.addTo(map).bindTooltip(name(region), { permanent: region.kind === 'frame', direction: 'center', className: 'research-map-label' });
          layer.on('click', () => selectRegion(region.id));
          const element = layer.getElement();
          if (element) element.dataset.researchMapRegion = region.id;
          layers.push({ region, layer });
        });
        fallback.hidden = true;
        root.dataset.mapState = 'ready';
        let previous = '';
        let firstVisibleLayout = true;
        observer = new ResizeObserver(() => {
          const bounds = mapNode.getBoundingClientRect();
          const size = bounds.width + ':' + bounds.height;
          if (bounds.width && bounds.height && size !== previous) {
            previous = size;
            map.invalidateSize({ animate: false, pan: false });
            if (firstVisibleLayout) {
              firstVisibleLayout = false;
              update(true);
            }
          }
        });
        observer.observe(mapNode);
        setLocale(locale);
        update(true);
      } else if (!data.papers.some(p => p.study.region)) {
        mapNode.hidden = true;
        fallback.hidden = false;
        fallback.textContent = data.papers.length ? copy().unspecified : copy().empty;
        root.dataset.mapState = data.papers.length ? 'unmapped' : 'empty';
      }
    } catch (error) {
      if (observer) observer.disconnect();
      if (map) map.remove();
      map = null;
      mapNode.hidden = true;
      fallback.hidden = false;
      fallback.textContent = copy().mapUnavailable;
      root.dataset.mapState = 'unavailable';
      root.dataset.mapError = error.message;
    }
    const controller = { setLocale, destroy: function () {
      regionSelect.removeEventListener('change', onRegion);
      systemSelect.removeEventListener('change', onSystem);
      mapNode.removeEventListener('mousedown', focusMap, true);
      filterObserver.disconnect();
      if (observer) observer.disconnect();
      if (map) map.remove();
      map = null;
      mounted.delete(root);
    } };
    mounted.set(root, controller);
    return controller;
  }
  window.AxiomResearch = { mount };
  function main() {
    const header = document.querySelector('.masthead');
    if (!header) return;
    new ResizeObserver(function () {
      const offset = Math.ceil(header.getBoundingClientRect().height) + 8;
      document.documentElement.style.setProperty('--masthead-offset', offset + 'px');
      const target = document.getElementById('research');
      const top = target && target.getBoundingClientRect().top;
      if (location.hash === '#research' && top >= 0 && top < offset) target.scrollIntoView({ block: 'start', behavior: 'instant' });
    }).observe(header);
    const root = document.querySelector('[data-research-library]');
    if (!root) return;
    const controller = mount(root, document.documentElement.dataset.locale || 'en');
    window.addEventListener('axiom:localechange', event => controller.setLocale(event.detail.locale));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', main, { once: true });
  else main();
}());
