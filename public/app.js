/* ========================================
   AXIOM — Landing Page
   ======================================== */

// ── Loading Screen ────────────────────────────────────────────────

(function initLoader() {
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loaderBar');
  if (!loader || !bar) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress > 95) progress = 95;
    bar.style.width = progress + '%';
  }, 200);

  window.addEventListener('load', () => {
    clearInterval(interval);
    bar.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('done');
      document.body.style.overflow = '';
    }, 600);
  });

  // Safety fallback — never block more than 4s
  setTimeout(() => {
    clearInterval(interval);
    bar.style.width = '100%';
    loader.classList.add('done');
  }, 4000);
})();


// ── Custom Cursor ─────────────────────────────────────────────────

(function initCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  // Don't run on touch devices
  if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 769) return;

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
  });

  // Smooth ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const hoverables = 'a, button, .project-card, .capability-card, .philosophy-card, .team-card, .lab-item, .sat-btn, .trends-filter, input, textarea';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverables)) {
      ring.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverables)) {
      ring.classList.remove('hovering');
    }
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    dot.classList.add('hidden');
    ring.classList.add('hidden');
  });
  document.addEventListener('mouseenter', () => {
    dot.classList.remove('hidden');
    ring.classList.remove('hidden');
  });
})();


// ── System Health Monitor ─────────────────────────────────────────

(function initHealthMonitor() {
  const grid = document.getElementById('healthGrid');
  const uptimeEl = document.getElementById('healthUptime');
  const timestampEl = document.getElementById('healthTimestamp');
  if (!grid) return;

  const systems = [
    { name: 'Bangkok Smart City', url: 'https://smart-city-monitor-web.onrender.com' },
    { name: 'Middle East Monitor', url: 'https://middle-east-monitor.onrender.com' },
    { name: 'Phuket Dashboard', url: 'https://phuket-dashboard.onrender.com' },
    { name: 'Geopolitics Dashboard', url: 'https://geopolitics-dashboard.onrender.com' },
    { name: 'City Reporter Bot', url: 'https://city-reporter-line-bot.onrender.com' },
    { name: 'Phuket Smart Bus', url: 'https://phuket-smart-bus-y6tj.onrender.com' },
    { name: 'SLIC Index v2', url: 'https://slic-index-v2.onrender.com' },
    { name: 'Dr. Non OS Dashboard', url: 'https://dr-non-operating-systems.onrender.com' },
  ];

  // Render initial cards
  grid.innerHTML = systems.map(s => `
    <div class="health-card" data-url="${s.url}">
      <div class="health-dot checking"></div>
      <div class="health-info">
        <div class="health-name">${s.name}</div>
        <div class="health-url">${s.url.replace('https://', '')}</div>
      </div>
      <div class="health-ms">—</div>
    </div>
  `).join('');

  async function checkSystem(system, card) {
    const dot = card.querySelector('.health-dot');
    const ms = card.querySelector('.health-ms');
    const start = performance.now();

    try {
      // Use fetch with no-cors to at least check connectivity
      await fetch(system.url, { mode: 'no-cors', cache: 'no-store' });
      const elapsed = Math.round(performance.now() - start);
      dot.className = 'health-dot up';
      ms.textContent = elapsed + 'ms';
      ms.className = 'health-ms ' + (elapsed < 1000 ? 'fast' : elapsed < 3000 ? 'medium' : 'slow');
      return true;
    } catch (e) {
      dot.className = 'health-dot down';
      ms.textContent = 'DOWN';
      ms.className = 'health-ms slow';
      return false;
    }
  }

  async function runChecks() {
    const cards = grid.querySelectorAll('.health-card');
    let upCount = 0;

    // Check all in parallel
    const results = await Promise.all(
      systems.map((s, i) => checkSystem(s, cards[i]))
    );

    upCount = results.filter(Boolean).length;

    if (uptimeEl) {
      uptimeEl.textContent = upCount + '/' + systems.length + ' ONLINE';
    }
    if (timestampEl) {
      const now = new Date();
      const fmt = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Bangkok'
      });
      timestampEl.textContent = 'Last check: ' + fmt.format(now) + ' BKK';
    }
  }

  // Run initial checks with slight delay for page load
  setTimeout(runChecks, 2000);
  // Re-check every 60 seconds
  setInterval(runChecks, 60000);
})();


// ── Scroll Parallax ───────────────────────────────────────────────

(function initParallax() {
  const parallaxEls = document.querySelectorAll('.section-header');

  function update() {
    const scrollY = window.scrollY;
    parallaxEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (rect.top - window.innerHeight / 2) * 0.04;
        el.style.transform = `translateY(${offset}px)`;
      }
    });
  }

  window.addEventListener('scroll', update, { passive: true });
})();


// ── Satellite Hero Map ──────────────────────────────────────────────

(function initSatelliteHero() {
  const container = document.getElementById('heroMap');
  if (!container || !window.L) return;

  // Cities Axiom operates in
  const CITIES = [
    { name: 'Bangkok', lat: 13.7563, lng: 100.5018, zoom: 12 },
    { name: 'Phuket', lat: 7.8804, lng: 98.3923, zoom: 13 },
    { name: 'Middle East', lat: 25.2048, lng: 55.2708, zoom: 11 },
    { name: 'Southeast Asia', lat: 10.5, lng: 105.0, zoom: 5 },
  ];

  const map = L.map(container, {
    center: [CITIES[0].lat, CITIES[0].lng],
    zoom: CITIES[0].zoom,
    zoomControl: false,
    attributionControl: false,
    dragging: true,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    touchZoom: true,
    keyboard: true,
    boxZoom: true,
    fadeAnimation: true,
    zoomAnimation: true,
  });

  // Tile layers are added in the layer switching section below

  // Pulse markers for active cities
  const pulseIcon = L.divIcon({
    className: 'sat-pulse-marker',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });

  const markerLocations = [
    [13.7563, 100.5018],  // Bangkok
    [7.8804, 98.3923],    // Phuket
    [25.2048, 55.2708],   // Dubai
    [24.7136, 46.6753],   // Riyadh
  ];

  markerLocations.forEach(coords => {
    L.marker(coords, { icon: pulseIcon }).addTo(map);
  });

  // ── Auto Tour Mode ──
  const mapModeDot = document.getElementById('mapModeDot');
  const mapModeLabel = document.getElementById('mapModeLabel');
  const mapModeBtn = document.getElementById('mapModeBtn');
  const mapModePause = document.getElementById('mapModePause');
  const mapModePlay = document.getElementById('mapModePlay');
  const heroCityLabel = document.getElementById('heroCityLabel');

  let autoTour = true;
  let cityIndex = 0;
  let driftTimer = null;
  let driftInterval = null;
  let resumeTimeout = null;

  function setModeUI(touring) {
    if (mapModeDot) mapModeDot.className = 'map-mode-dot' + (touring ? '' : ' exploring');
    if (mapModeLabel) {
      mapModeLabel.textContent = touring ? 'AUTO TOUR' : 'EXPLORING';
      mapModeLabel.className = 'map-mode-label' + (touring ? '' : ' exploring');
    }
    if (mapModePause) mapModePause.style.display = touring ? 'block' : 'none';
    if (mapModePlay) mapModePlay.style.display = touring ? 'none' : 'block';
  }

  function driftToNext() {
    if (!autoTour) return;
    cityIndex = (cityIndex + 1) % CITIES.length;
    const city = CITIES[cityIndex];
    if (heroCityLabel) heroCityLabel.textContent = city.name.toUpperCase();
    map.flyTo([city.lat, city.lng], city.zoom, {
      duration: 8,
      easeLinearity: 0.1,
    });
  }

  function startTour() {
    autoTour = true;
    setModeUI(true);
    if (resumeTimeout) { clearTimeout(resumeTimeout); resumeTimeout = null; }
    driftToNext();
    driftInterval = setInterval(driftToNext, 12000);
  }

  function pauseTour(fromUser) {
    autoTour = false;
    setModeUI(false);
    if (driftInterval) { clearInterval(driftInterval); driftInterval = null; }
    if (driftTimer) { clearTimeout(driftTimer); driftTimer = null; }
    map.stop(); // stop any in-progress flyTo

    // If user paused by interacting, offer resume after 20s of inactivity
    if (fromUser && resumeTimeout) clearTimeout(resumeTimeout);
    if (fromUser) {
      resumeTimeout = setTimeout(() => {
        // Gently blink the play button to suggest resuming
        if (mapModeBtn) mapModeBtn.classList.add('map-mode-btn-pulse');
        setTimeout(() => { if (mapModeBtn) mapModeBtn.classList.remove('map-mode-btn-pulse'); }, 3000);
      }, 20000);
    }
  }

  // Toggle button
  if (mapModeBtn) {
    mapModeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (autoTour) {
        pauseTour(true);
      } else {
        startTour();
      }
    });
  }

  // Detect user interaction with the map → pause tour
  map.on('dragstart', () => { if (autoTour) pauseTour(true); });
  map.on('zoomstart', () => {
    // Only pause if zoom was initiated by user (not flyTo)
    if (autoTour && !map._flyInProgress) pauseTour(true);
  });

  // Intercept flyTo to track in-progress state
  const origFlyTo = map.flyTo.bind(map);
  map.flyTo = function(latlng, zoom, options) {
    map._flyInProgress = true;
    return origFlyTo(latlng, zoom, options);
  };
  map.on('moveend', () => { map._flyInProgress = false; });

  // Start auto tour after initial pause
  driftTimer = setTimeout(() => {
    driftToNext();
    driftInterval = setInterval(driftToNext, 12000);
  }, 5000);

  // ── Layer switching ──

  const tileLayers = {
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18 }),
    terrain: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18 }),
    dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }),
    topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17 }),
  };

  let activeLayer = tileLayers.satellite;
  activeLayer.addTo(map);

  // Layer buttons
  document.querySelectorAll('.sat-btn[data-layer]').forEach(btn => {
    btn.addEventListener('click', () => {
      const layerName = btn.dataset.layer;
      if (tileLayers[layerName] && tileLayers[layerName] !== activeLayer) {
        map.removeLayer(activeLayer);
        activeLayer = tileLayers[layerName];
        activeLayer.addTo(map);

        document.querySelectorAll('.sat-btn[data-layer]').forEach(b => b.classList.remove('sat-btn-active'));
        btn.classList.add('sat-btn-active');
      }
    });
  });

  // ── 1km Grid Overlay ──

  let gridLayer = null;

  function createGrid() {
    const bounds = map.getBounds();
    const lines = [];

    // Calculate 1km grid spacing in degrees (approx)
    const latCenter = map.getCenter().lat;
    const kmPerDegreeLat = 111.32;
    const kmPerDegreeLng = 111.32 * Math.cos(latCenter * Math.PI / 180);
    const dLat = 1 / kmPerDegreeLat;
    const dLng = 1 / kmPerDegreeLng;

    const south = Math.floor(bounds.getSouth() / dLat) * dLat;
    const north = bounds.getNorth();
    const west = Math.floor(bounds.getWest() / dLng) * dLng;
    const east = bounds.getEast();

    // Latitude lines
    for (let lat = south; lat <= north; lat += dLat) {
      lines.push(L.polyline([[lat, west], [lat, east]], {
        color: 'rgba(37, 99, 255, 0.18)',
        weight: 0.5,
        interactive: false,
      }));
    }

    // Longitude lines
    for (let lng = west; lng <= east; lng += dLng) {
      lines.push(L.polyline([[south, lng], [north, lng]], {
        color: 'rgba(37, 99, 255, 0.18)',
        weight: 0.5,
        interactive: false,
      }));
    }

    return L.layerGroup(lines);
  }

  function updateGrid() {
    if (gridLayer) {
      map.removeLayer(gridLayer);
      gridLayer = createGrid();
      gridLayer.addTo(map);
    }
  }

  const gridToggle = document.getElementById('gridToggle');
  if (gridToggle) {
    gridToggle.addEventListener('click', () => {
      const active = gridToggle.dataset.active === 'true';
      if (active) {
        if (gridLayer) { map.removeLayer(gridLayer); gridLayer = null; }
        gridToggle.dataset.active = 'false';
      } else {
        gridLayer = createGrid();
        gridLayer.addTo(map);
        gridToggle.dataset.active = 'true';
      }
    });
  }

  // Rebuild grid on move/zoom
  map.on('moveend', () => { if (gridLayer) updateGrid(); });
  map.on('zoomend', () => { if (gridLayer) updateGrid(); });

  // ── Live Satellite HUD Telemetry ──

  const satCoord = document.getElementById('satCoord');
  const satZoom = document.getElementById('satZoom');
  const satRes = document.getElementById('satRes');
  const satTile = document.getElementById('satTile');
  const satTime = document.getElementById('satTime');
  const satProvider = document.getElementById('satProvider');

  const layerProviders = {
    satellite: { name: 'ESRI World Imagery', tile: 'arcgisonline.com/World_Imagery' },
    terrain: { name: 'ESRI World Street Map', tile: 'arcgisonline.com/World_Street_Map' },
    dark: { name: 'CartoDB Dark Matter', tile: 'basemaps.cartocdn.com/dark_all' },
    topo: { name: 'OpenTopoMap', tile: 'tile.opentopomap.org' },
  };

  let currentLayerName = 'satellite';

  function updateHud() {
    const center = map.getCenter();
    const zoom = map.getZoom();
    const lat = center.lat.toFixed(4);
    const lng = center.lng.toFixed(4);
    const latDir = center.lat >= 0 ? 'N' : 'S';
    const lngDir = center.lng >= 0 ? 'E' : 'W';

    // Resolution: at equator, zoom 0 = ~156543 m/px, halves each zoom
    const metersPerPx = (156543.03392 * Math.cos(center.lat * Math.PI / 180)) / Math.pow(2, zoom);
    let resText;
    if (metersPerPx >= 1000) resText = '~' + (metersPerPx / 1000).toFixed(1) + 'km/px';
    else resText = '~' + Math.round(metersPerPx) + 'm/px';

    if (satCoord) satCoord.textContent = Math.abs(lat) + '°' + latDir + ' ' + Math.abs(lng) + '°' + lngDir;
    if (satZoom) satZoom.textContent = 'Z' + Math.round(zoom);
    if (satRes) satRes.textContent = resText;

    const prov = layerProviders[currentLayerName] || layerProviders.satellite;
    if (satProvider) satProvider.textContent = prov.name;
    if (satTile) satTile.textContent = 'Tile: ' + prov.tile;

    if (satTime) {
      const now = new Date();
      const fmt = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Bangkok'
      });
      satTime.textContent = 'Fetched: ' + fmt.format(now) + ' BKK';
    }
  }

  map.on('moveend', updateHud);
  map.on('zoomend', updateHud);
  updateHud();
  setInterval(updateHud, 1000); // keep time fresh

  // Update layer name tracking in layer button clicks
  document.querySelectorAll('.sat-btn[data-layer]').forEach(btn => {
    btn.addEventListener('click', () => {
      const layerName = btn.dataset.layer;
      if (tileLayers[layerName] && tileLayers[layerName] !== activeLayer) {
        currentLayerName = layerName;
        updateHud();
      }
    });
  });

  // Subtle parallax on mouse move — only during auto tour
  let rafId;
  document.addEventListener('mousemove', (e) => {
    if (!autoTour) return;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      if (!autoTour) return;
      const dx = (e.clientX / window.innerWidth - 0.5) * 0.003;
      const dy = (e.clientY / window.innerHeight - 0.5) * 0.003;
      const center = map.getCenter();
      map.panTo([center.lat + dy, center.lng + dx], { animate: false });
    });
  });
})();


// ── Data Lines Canvas (overlay on satellite) ────────────────────────

(function initDataLines() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }
  resize();
  window.addEventListener('resize', resize);

  // Scanning line effect
  const lines = [];
  for (let i = 0; i < 5; i++) {
    lines.push({
      y: Math.random() * canvas.offsetHeight,
      speed: 0.3 + Math.random() * 0.5,
      alpha: 0.03 + Math.random() * 0.04,
    });
  }

  // Data nodes — scattered points of light
  const nodes = [];
  for (let i = 0; i < 40; i++) {
    nodes.push({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      r: 1 + Math.random() * 2,
      pulse: Math.random() * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.03,
    });
  }

  // Grid overlay
  function drawGrid() {
    const cw = canvas.offsetWidth;
    const ch = canvas.offsetHeight;
    ctx.strokeStyle = 'rgba(37, 99, 255, 0.04)';
    ctx.lineWidth = 0.5;
    const gridSize = 80;

    for (let x = 0; x < cw; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ch);
      ctx.stroke();
    }
    for (let y = 0; y < ch; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(cw, y);
      ctx.stroke();
    }
  }

  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 1;

    const cw = canvas.offsetWidth;
    const ch = canvas.offsetHeight;
    ctx.clearRect(0, 0, cw, ch);

    // Grid
    drawGrid();

    // Scan lines
    lines.forEach(line => {
      line.y += line.speed;
      if (line.y > ch) line.y = -2;

      ctx.strokeStyle = `rgba(37, 99, 255, ${line.alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, line.y);
      ctx.lineTo(cw, line.y);
      ctx.stroke();
    });

    // Data nodes
    nodes.forEach(node => {
      node.pulse += node.speed;
      const alpha = 0.2 + Math.sin(node.pulse) * 0.15;
      const r = node.r + Math.sin(node.pulse) * 0.5;

      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(37, 99, 255, ${alpha})`;
      ctx.fill();

      // Outer ring
      ctx.beginPath();
      ctx.arc(node.x, node.y, r + 4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(37, 99, 255, ${alpha * 0.3})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // Connection lines between nearby nodes
    ctx.lineWidth = 0.3;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const alpha = (1 - dist / 200) * 0.06;
          ctx.strokeStyle = `rgba(37, 99, 255, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
  }
  animate();
})();


// ── Navigation ─────────────────────────────────────────────────────

(function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => menu.classList.remove('open'));
    });
  }
})();


// ── Smooth anchor links ────────────────────────────────────────────

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ── Counter Animation ──────────────────────────────────────────────

(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const animated = new Set();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated.has(entry.target)) {
        animated.add(entry.target);
        const target = parseInt(entry.target.dataset.count);
        const duration = 2000;
        const startTime = performance.now();

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          entry.target.textContent = Math.round(target * eased);
          if (progress < 1) requestAnimationFrame(updateCount);
        }
        requestAnimationFrame(updateCount);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
})();


// ── Scroll Reveal ──────────────────────────────────────────────────

(function initReveal() {
  const revealSelectors = [
    '.project-card',
    '.capability-card',
    '.metric-card',
    '.section-header',
    '.cta-block',
    '.philosophy-card',
    '.team-card',
    '.case-study',
    '.lab-item',
  ];

  revealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.05}s`;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


// ── Metric Bar Animation ───────────────────────────────────────────

(function initMetricBars() {
  const bars = document.querySelectorAll('.metric-bar-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(bar => observer.observe(bar));
})();


// ── Rotating Hero Text ─────────────────────────────────────────────

(function initRotatingText() {
  const el = document.getElementById('heroRotatingText');
  if (!el) return;

  const phrases = [
    'as a Service',
    'that disappears',
    'that works',
    'for cities',
    'for decisions',
    'as water',
  ];

  let index = 0;

  setInterval(() => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(8px)';

    setTimeout(() => {
      index = (index + 1) % phrases.length;
      el.textContent = phrases[index];
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    }, 400);
  }, 3500);

  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
})();


// ── Trends Dashboard ──────────────────────────────────────────────

(function initTrendsDashboard() {
  const mapContainer = document.getElementById('trendsMap');
  const listContainer = document.getElementById('trendsList');
  const regionsContainer = document.getElementById('trendsRegions');
  const clockBar = document.getElementById('trendsClockBar');
  const exchangeBar = document.getElementById('trendsExchangeBar');
  const refreshBtn = document.getElementById('trendsRefresh');
  const lastUpdateEl = document.getElementById('trendsLastUpdate');
  if (!mapContainer || !window.L) return;

  // ── World Clock ──
  const clockCities = [
    { name: 'Los Angeles', tz: 'America/Los_Angeles' },
    { name: 'New York', tz: 'America/New_York' },
    { name: 'London', tz: 'Europe/London' },
    { name: 'Dubai', tz: 'Asia/Dubai' },
    { name: 'Bangkok', tz: 'Asia/Bangkok', home: true },
    { name: 'Singapore', tz: 'Asia/Singapore' },
    { name: 'Shanghai', tz: 'Asia/Shanghai' },
    { name: 'Tokyo', tz: 'Asia/Tokyo' },
    { name: 'Sydney', tz: 'Australia/Sydney' },
  ];

  function renderClocks() {
    if (!clockBar) return;
    clockBar.innerHTML = '';
    clockCities.forEach(city => {
      const now = new Date();
      const timeFmt = new Intl.DateTimeFormat('en-GB', {
        timeZone: city.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      });
      const dateFmt = new Intl.DateTimeFormat('en-GB', {
        timeZone: city.tz, day: '2-digit', month: 'short'
      });
      const el = document.createElement('div');
      el.className = 'trends-clock-city' + (city.home ? ' is-home' : '');
      el.innerHTML = `
        <span class="trends-clock-name">${city.name}</span>
        <span class="trends-clock-time">${timeFmt.format(now)}</span>
        <span class="trends-clock-date">${dateFmt.format(now)}</span>
      `;
      clockBar.appendChild(el);
    });
  }

  renderClocks();
  setInterval(renderClocks, 1000);

  // ── Exchange Rates (real, from open API) ──
  const exchangePairs = [
    { from: 'USD', to: 'THB', label: 'USD/THB' },
    { from: 'EUR', to: 'THB', label: 'EUR/THB' },
    { from: 'GBP', to: 'THB', label: 'GBP/THB' },
    { from: 'JPY', to: 'THB', label: 'JPY/THB', scale: 100 },
    { from: 'CNY', to: 'THB', label: 'CNY/THB' },
    { from: 'AED', to: 'THB', label: 'AED/THB' },
    { from: 'USD', to: 'EUR', label: 'USD/EUR' },
    { from: 'BTC', to: 'USD', label: 'BTC/USD', crypto: true },
  ];

  function fetchExchangeRates() {
    if (!exchangeBar) return;

    // Fetch THB rates from open API
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(r => r.json())
      .then(data => {
        if (data.result !== 'success') throw new Error('API error');
        const rates = data.rates;
        exchangeBar.innerHTML = '';

        exchangePairs.forEach(pair => {
          if (pair.crypto) {
            // BTC from a separate source — skip or show placeholder
            const el = document.createElement('div');
            el.className = 'trends-exchange-item';
            el.innerHTML = `<span class="trends-exchange-pair">${pair.label}</span><span class="trends-exchange-rate">—</span>`;
            exchangeBar.appendChild(el);
            return;
          }
          let rate;
          if (pair.from === 'USD') {
            rate = rates[pair.to];
          } else if (pair.to === 'THB') {
            // Cross rate: FROM/THB = THB_rate / FROM_rate
            rate = rates['THB'] / rates[pair.from];
          } else {
            rate = rates[pair.to] / rates[pair.from];
          }
          if (pair.scale) rate = rate * pair.scale;

          const el = document.createElement('div');
          el.className = 'trends-exchange-item';
          el.innerHTML = `
            <span class="trends-exchange-pair">${pair.label}${pair.scale ? ' (per ' + pair.scale + ')' : ''}</span>
            <span class="trends-exchange-rate">${rate.toFixed(rate > 100 ? 2 : 4)}</span>
          `;
          exchangeBar.appendChild(el);
        });

        // Also try BTC
        fetch('https://api.coindesk.com/v1/bpi/currentprice/USD.json')
          .then(r => r.json())
          .then(btc => {
            const btcItem = exchangeBar.querySelector('.trends-exchange-item:last-child');
            if (btcItem && btc.bpi && btc.bpi.USD) {
              const price = btc.bpi.USD.rate_float;
              btcItem.querySelector('.trends-exchange-rate').textContent = '$' + Math.round(price).toLocaleString();
            }
          }).catch(() => {});

        if (lastUpdateEl) {
          const now = new Date();
          const fmt = new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Bangkok'
          });
          lastUpdateEl.textContent = 'Last refresh: ' + fmt.format(now) + ' BKK';
        }
      })
      .catch(() => {
        exchangeBar.innerHTML = '<span class="trends-exchange-loading">Exchange rates unavailable</span>';
      });
  }

  fetchExchangeRates();

  // ── Refresh button ──
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      refreshBtn.classList.add('spinning');
      fetchExchangeRates();
      setTimeout(() => refreshBtn.classList.remove('spinning'), 900);
    });
  }

  // Auto-refresh every 5 minutes
  setInterval(fetchExchangeRates, 300000);

  // ── Map ──
  const map = L.map(mapContainer, {
    center: [20, 40],
    zoom: 2,
    zoomControl: false,
    attributionControl: false,
    dragging: true,
    scrollWheelZoom: false,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
  }).addTo(map);

  // Heatmap hotspots
  const hotspots = [
    { lat: 13.75, lng: 100.50, intensity: 0.95, label: 'Bangkok' },
    { lat: 7.88, lng: 98.39, intensity: 0.7, label: 'Phuket' },
    { lat: 1.35, lng: 103.82, intensity: 0.85, label: 'Singapore' },
    { lat: 25.20, lng: 55.27, intensity: 0.8, label: 'Dubai' },
    { lat: 24.71, lng: 46.67, intensity: 0.6, label: 'Riyadh' },
    { lat: 35.68, lng: 139.69, intensity: 0.75, label: 'Tokyo' },
    { lat: 37.57, lng: 126.98, intensity: 0.7, label: 'Seoul' },
    { lat: 22.30, lng: 114.17, intensity: 0.65, label: 'Hong Kong' },
    { lat: 51.51, lng: -0.13, intensity: 0.6, label: 'London' },
    { lat: 48.86, lng: 2.35, intensity: 0.55, label: 'Paris' },
    { lat: 40.71, lng: -74.01, intensity: 0.65, label: 'New York' },
    { lat: 37.77, lng: -122.42, intensity: 0.7, label: 'San Francisco' },
    { lat: -33.87, lng: 151.21, intensity: 0.45, label: 'Sydney' },
    { lat: 3.14, lng: 101.69, intensity: 0.6, label: 'Kuala Lumpur' },
    { lat: 14.60, lng: 120.98, intensity: 0.5, label: 'Manila' },
    { lat: 28.61, lng: 77.21, intensity: 0.7, label: 'Delhi' },
    { lat: 31.23, lng: 121.47, intensity: 0.8, label: 'Shanghai' },
    { lat: 39.90, lng: 116.40, intensity: 0.75, label: 'Beijing' },
    { lat: 52.52, lng: 13.41, intensity: 0.5, label: 'Berlin' },
    { lat: 59.33, lng: 18.07, intensity: 0.55, label: 'Stockholm' },
  ];

  hotspots.forEach(h => {
    const radius = h.intensity * 25 + 8;
    const color = h.intensity > 0.7 ? '#2563ff' : h.intensity > 0.5 ? '#6b8aff' : '#4a5568';

    L.circleMarker([h.lat, h.lng], {
      radius: radius + 8, fillColor: color, fillOpacity: h.intensity * 0.12,
      stroke: false, interactive: false,
    }).addTo(map);

    L.circleMarker([h.lat, h.lng], {
      radius: radius, fillColor: color, fillOpacity: h.intensity * 0.35,
      color: color, weight: 1, opacity: 0.3, interactive: false,
    }).addTo(map);

    L.circleMarker([h.lat, h.lng], {
      radius: 3, fillColor: '#fff', fillOpacity: h.intensity * 0.7,
      stroke: false, interactive: false,
    }).addTo(map);
  });

  // Trending topics
  const trends = [
    { name: 'Smart City Governance', pct: 87, change: '+12%', dir: 'up' },
    { name: 'Digital Twin Infrastructure', pct: 74, change: '+28%', dir: 'up' },
    { name: 'Urban AI Monitoring', pct: 68, change: '+15%', dir: 'up' },
    { name: 'IoT Sensor Networks', pct: 61, change: '+8%', dir: 'up' },
    { name: 'Citizen Engagement Tech', pct: 55, change: '+22%', dir: 'up' },
    { name: 'Geospatial Analytics', pct: 48, change: '+5%', dir: 'up' },
    { name: 'Open Data Platforms', pct: 42, change: '-3%', dir: 'down' },
  ];

  if (listContainer) {
    trends.forEach(t => {
      const el = document.createElement('div');
      el.className = 'trend-item';
      el.innerHTML = `
        <span class="trend-name">${t.name}</span>
        <div class="trend-bar-wrap">
          <div class="trend-bar"><div class="trend-bar-inner" style="width:${t.pct}%"></div></div>
          <span class="trend-change ${t.dir}">${t.change}</span>
        </div>
      `;
      listContainer.appendChild(el);
    });
  }

  // Regional activity
  const regions = [
    { name: 'Southeast Asia', heat: [3, 3, 2, 2, 3] },
    { name: 'Middle East', heat: [2, 3, 2, 1, 2] },
    { name: 'East Asia', heat: [3, 2, 3, 2, 2] },
    { name: 'Europe', heat: [1, 2, 1, 2, 1] },
    { name: 'North America', heat: [2, 1, 2, 3, 2] },
  ];

  if (regionsContainer) {
    regions.forEach(r => {
      const el = document.createElement('div');
      el.className = 'region-item';
      const heatCells = r.heat.map(h =>
        `<div class="region-heat-cell ${h === 3 ? 'hot' : h === 2 ? 'warm' : ''}"></div>`
      ).join('');
      el.innerHTML = `
        <span class="region-name">${r.name}</span>
        <div class="region-heat">${heatCells}</div>
      `;
      regionsContainer.appendChild(el);
    });
  }
})();


// ── Humanities Art Background (Getty Open Content) ──────────────────

(function initHumanitiesArt() {
  const layerA = document.getElementById('humanitiesArtA');
  const layerB = document.getElementById('humanitiesArtB');
  const nextBtn = document.getElementById('humanitiesNextBtn');
  const artLabel = document.getElementById('humanitiesArtLabel');
  if (!layerA || !layerB) return;

  // Curated public domain masterworks — high-res from Wikimedia Commons
  const artworks = [
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1920px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg', title: 'The Starry Night', artist: 'Vincent van Gogh, 1889' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/VanGogh-starry_night_ballance1.jpg/1920px-VanGogh-starry_night_ballance1.jpg', title: 'Starry Night Over the Rh\u00f4ne', artist: 'Vincent van Gogh, 1888' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/1440px-1665_Girl_with_a_Pearl_Earring.jpg', title: 'Girl with a Pearl Earring', artist: 'Johannes Vermeer, 1665' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/1440px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg', title: 'Mona Lisa', artist: 'Leonardo da Vinci, 1503' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/The_Great_Wave_off_Kanagawa.jpg/1920px-The_Great_Wave_off_Kanagawa.jpg', title: 'The Great Wave off Kanagawa', artist: 'Katsushika Hokusai, 1831' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Monet_-_Impression%2C_Sunrise.jpg/1920px-Monet_-_Impression%2C_Sunrise.jpg', title: 'Impression, Sunrise', artist: 'Claude Monet, 1872' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/The_Scream.jpg/1440px-The_Scream.jpg', title: 'The Scream', artist: 'Edvard Munch, 1893' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Tsunami_by_hokusai_19th_century.jpg/1920px-Tsunami_by_hokusai_19th_century.jpg', title: 'The Great Wave (variant)', artist: 'Katsushika Hokusai, c.1830' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Adolphe_William_Bouguereau_-_The_Nut_Gatherers_-_1882.jpg/1440px-Adolphe_William_Bouguereau_-_The_Nut_Gatherers_-_1882.jpg', title: 'The Nut Gatherers', artist: 'William Bouguereau, 1882' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg/1440px-Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg', title: 'Wanderer Above the Sea of Fog', artist: 'Caspar David Friedrich, 1818' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Salvator_Rosa_-_Witches_at_their_Incantations_-_Google_Art_Project.jpg/1920px-Salvator_Rosa_-_Witches_at_their_Incantations_-_Google_Art_Project.jpg', title: 'Witches at their Incantations', artist: 'Salvator Rosa, 1646' },
    { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Gustave_Caillebotte_-_Jour_de_pluie_%C3%A0_Paris.jpg/1920px-Gustave_Caillebotte_-_Jour_de_pluie_%C3%A0_Paris.jpg', title: 'Paris Street; Rainy Day', artist: 'Gustave Caillebotte, 1877' },
  ];

  let index = 0;
  let activeLayer = layerA;
  let nextLayer = layerB;
  let timer;

  function updateLabel(i) {
    if (artLabel) {
      artLabel.textContent = artworks[i].title + ' \u2014 ' + artworks[i].artist;
    }
  }

  // Set first artwork immediately
  layerA.style.backgroundImage = `url(${artworks[0].url})`;
  updateLabel(0);
  index = 1;

  function crossfade() {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      nextLayer.style.backgroundImage = `url(${artworks[index].url})`;
      nextLayer.classList.add('humanities-art-active');
      activeLayer.classList.remove('humanities-art-active');
      const tmp = activeLayer;
      activeLayer = nextLayer;
      nextLayer = tmp;
      updateLabel(index);
      index = (index + 1) % artworks.length;
    };
    img.onerror = function() {
      // Skip broken image, advance to next
      index = (index + 1) % artworks.length;
      crossfade();
    };
    img.src = artworks[index].url;
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(crossfade, 7000);
  }

  // Auto-rotate
  timer = setInterval(crossfade, 7000);

  // Manual next button
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      crossfade();
      resetTimer();
    });
  }
})();


// ── City label on hero ─────────────────────────────────────────────
// (Now handled by the Auto Tour system in initSatelliteHero)


// ── Command Terminal ──────────────────────────────────────────────

(function initTerminal() {
  const overlay = document.getElementById('terminalOverlay');
  const input = document.getElementById('terminalInput');
  const body = document.getElementById('terminalBody');
  const closeBtn = document.getElementById('terminalClose');
  if (!overlay || !input || !body) return;

  const startTime = Date.now();

  function openTerminal() {
    overlay.classList.add('open');
    setTimeout(() => input.focus(), 100);
  }

  function closeTerminal() {
    overlay.classList.remove('open');
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Open terminal: / or Ctrl+K
    if ((e.key === '/' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') ||
        ((e.ctrlKey || e.metaKey) && e.key === 'k')) {
      e.preventDefault();
      if (overlay.classList.contains('open')) closeTerminal();
      else openTerminal();
      return;
    }

    // Close on Escape
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeTerminal();
      return;
    }

    // Layer shortcuts (only when terminal closed and not in input)
    if (!overlay.classList.contains('open') && document.activeElement.tagName !== 'INPUT') {
      const layerMap = { '1': 'satellite', '2': 'terrain', '3': 'dark', '4': 'topo' };
      if (layerMap[e.key]) {
        const btn = document.querySelector(`.sat-btn[data-layer="${layerMap[e.key]}"]`);
        if (btn) btn.click();
        return;
      }
      if (e.key.toLowerCase() === 'g') {
        const gridBtn = document.getElementById('gridToggle');
        if (gridBtn) gridBtn.click();
        return;
      }
    }
  });

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeTerminal();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeTerminal);

  function addLine(html, className) {
    const div = document.createElement('div');
    div.className = 'terminal-line ' + (className || '');
    div.innerHTML = html;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  const commands = {
    help: () => {
      addLine(`<span class="terminal-cmd">Available commands:</span>`, 'terminal-line-info');
      addLine('  status    — System health overview');
      addLine('  about     — Who is Axiom');
      addLine('  founders  — Meet the team');
      addLine('  stack     — Technology stack');
      addLine('  systems   — Live production systems');
      addLine('  uptime    — Current session uptime');
      addLine('  ping      — Test connectivity');
      addLine('  time      — World clock snapshot');
      addLine('  rates     — Exchange rates');
      addLine('  axioms    — Our operating principles');
      addLine('  roi       — The 5,000% story');
      addLine('  contact   — Get in touch');
      addLine('  linkedin  — Company LinkedIn');
      addLine('  os        — Dr. Non OS Dashboard');
      addLine('  clear     — Clear terminal');
      addLine('  exit      — Close terminal');
    },

    status: () => {
      const cards = document.querySelectorAll('.health-card');
      let up = 0, total = cards.length;
      cards.forEach(c => { if (c.querySelector('.health-dot.up')) up++; });
      addLine(`<span class="terminal-cmd">AXIOM SYSTEM STATUS</span>`, 'terminal-line-info');
      addLine(`  Systems monitored: ${total}`);
      addLine(`  Online: <span style="color:var(--green)">${up}</span> / ${total}`);
      addLine(`  Availability: <span style="color:var(--green)">${((up/total)*100).toFixed(1)}%</span>`);
      const uptimeEl = document.getElementById('healthTimestamp');
      if (uptimeEl) addLine(`  ${uptimeEl.textContent}`);
    },

    about: () => {
      addLine(`<span class="terminal-cmd">AXIOM — Innovation as a Service</span>`, 'terminal-line-info');
      addLine('  AI as water — invisible, essential, everywhere.');
      addLine('  We build intelligent systems for cities, governments,');
      addLine('  and organizations. Your success is our KPI.');
      addLine('  Founded: 2024 | HQ: Bangkok, Thailand');
      addLine('  Countries: Thailand, UAE, Solomon Islands, Singapore');
      addLine('  Proven ROI: 5,000% on first deployment');
    },

    founders: () => {
      addLine(`<span class="terminal-cmd">FOUNDING TEAM</span>`, 'terminal-line-info');
      addLine('');
      addLine('  Dr. Non Arkaraprasertkul — Co-Founder');
      addLine('    PhD Anthropology, Harvard University');
      addLine('    MPhil Chinese Studies, University of Oxford');
      addLine('    MSc Architecture Studies, MIT');
      addLine('    Fmr. Visiting Lecturer MIT | Postdoc NYU');
      addLine('    400+ academic citations | Builder of the 5,000% ROI system');
      addLine('');
      addLine('  Dr. Poon Thiengburanathum — Co-Founder');
      addLine('    PhD Civil Engineering');
      addLine('    Assoc. Prof., Chiang Mai University');
      addLine('    Drafted Chiang Mai Smart City Master Plan (2018-2023)');
      addLine('    Smart city infrastructure & public policy expert');
    },

    stack: () => {
      addLine(`<span class="terminal-cmd">TECHNOLOGY STACK</span>`, 'terminal-line-info');
      addLine('  Frontend:   Vanilla JS, Leaflet.js, Canvas API');
      addLine('  Maps:       ESRI, CartoDB, OpenTopoMap (open tiles)');
      addLine('  Data:       open.er-api.com, CoinDesk, Met Museum API');
      addLine('  Platform:   Render Cloud Services');
      addLine('  AI:         NLP, Sentiment Analysis, Computer Vision');
      addLine('  Design:     Bauhaus minimalism, Inter + JetBrains Mono');
      addLine('  Philosophy: No frameworks. No dependencies. Pure engineering.');
    },

    systems: () => {
      addLine(`<span class="terminal-cmd">LIVE PRODUCTION SYSTEMS</span>`, 'terminal-line-info');
      const systems = [
        'Bangkok Smart City Monitor', 'Middle East Monitor',
        'Phuket Dashboard', 'Geopolitics Dashboard',
        'City Reporter Bot', 'Phuket Smart Bus',
        'SLIC Index v2', 'Dr. Non OS Dashboard'
      ];
      systems.forEach((s, i) => {
        addLine(`  <span style="color:var(--green)">●</span> ${s}`);
      });
      addLine(`\n  Total: ${systems.length} systems | 5 countries | 99.9% uptime`);
    },

    uptime: () => {
      const elapsed = Date.now() - startTime;
      const mins = Math.floor(elapsed / 60000);
      const secs = Math.floor((elapsed % 60000) / 1000);
      addLine(`Session uptime: ${mins}m ${secs}s`);
      addLine(`Page loaded: ${new Date(startTime).toISOString()}`);
    },

    ping: () => {
      addLine('Pinging axiom systems...');
      const cards = document.querySelectorAll('.health-card');
      cards.forEach(c => {
        const name = c.querySelector('.health-name')?.textContent || '?';
        const ms = c.querySelector('.health-ms')?.textContent || '—';
        const up = c.querySelector('.health-dot.up') ? '✓' : '✗';
        const color = c.querySelector('.health-dot.up') ? 'var(--green)' : 'var(--red)';
        addLine(`  <span style="color:${color}">${up}</span> ${name} — ${ms}`);
      });
    },

    time: () => {
      addLine(`<span class="terminal-cmd">WORLD CLOCK</span>`, 'terminal-line-info');
      const zones = [
        { name: 'Los Angeles', tz: 'America/Los_Angeles' },
        { name: 'New York', tz: 'America/New_York' },
        { name: 'London', tz: 'Europe/London' },
        { name: 'Dubai', tz: 'Asia/Dubai' },
        { name: 'Bangkok', tz: 'Asia/Bangkok' },
        { name: 'Singapore', tz: 'Asia/Singapore' },
        { name: 'Tokyo', tz: 'Asia/Tokyo' },
        { name: 'Sydney', tz: 'Australia/Sydney' },
      ];
      zones.forEach(z => {
        const t = new Intl.DateTimeFormat('en-GB', {
          timeZone: z.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        }).format(new Date());
        const marker = z.name === 'Bangkok' ? ' ◀ HOME' : '';
        addLine(`  ${z.name.padEnd(14)} ${t}${marker}`);
      });
    },

    rates: () => {
      addLine(`<span class="terminal-cmd">EXCHANGE RATES</span>`, 'terminal-line-info');
      const items = document.querySelectorAll('.trends-exchange-item');
      items.forEach(item => {
        const pair = item.querySelector('.trends-exchange-pair')?.textContent || '';
        const rate = item.querySelector('.trends-exchange-rate')?.textContent || '—';
        addLine(`  ${pair.padEnd(22)} ${rate}`);
      });
      const ts = document.getElementById('trendsLastUpdate');
      if (ts) addLine(`\n  ${ts.textContent}`);
    },

    axioms: () => {
      addLine(`<span class="terminal-cmd">OUR AXIOMS</span>`, 'terminal-line-info');
      addLine('  01. Your Success Is Our KPI');
      addLine('  02. AI as Water — invisible, essential');
      addLine('  03. The 36-Button Rule — simplicity by design');
      addLine('  04. Low-Fidelity, High-Impact');
      addLine('  05. Partners, Not Vendors');
      addLine('  06. Moral Foundation — Kant\'s categorical imperative');
    },

    roi: () => {
      addLine(`<span class="terminal-cmd">THE 5,000% ROI STORY</span>`, 'terminal-line-info');
      addLine('  Client: Large Middle Eastern operations firm');
      addLine('  Tool:   One laptop. Natural language programming.');
      addLine('  Result: 90% reduction in manual reporting');
      addLine('          Decision latency: Days → Minutes');
      addLine('          ROI in Year 1: 5,000%');
      addLine('          Client built the last 3 features themselves');
      addLine('  ');
      addLine('  That\'s the Axiom way — we don\'t create dependency.');
      addLine('  We create capability.');
    },

    contact: () => {
      addLine(`<span class="terminal-cmd">CONTACT</span>`, 'terminal-line-info');
      addLine('  Email:    axiomaxiom.corp@gmail.com');
      addLine('  LinkedIn: linkedin.com/company/axiomaxiom');
      addLine('  HQ:       Bangkok, Thailand');
    },

    linkedin: () => {
      addLine('Opening Axiom LinkedIn...');
      window.open('https://www.linkedin.com/company/axiomaxiom/about/', '_blank');
    },

    os: () => {
      addLine('Opening Dr. Non Operating Systems Dashboard...');
      window.open('https://dr-non-operating-systems.onrender.com', '_blank');
    },

    clear: () => {
      body.innerHTML = '';
    },

    exit: () => {
      closeTerminal();
    },
  };

  // Handle input
  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const cmd = input.value.trim().toLowerCase();
    input.value = '';
    if (!cmd) return;

    addLine(`<span class="terminal-prompt">axiom $</span> <span class="terminal-line-cmd">${cmd}</span>`);

    if (commands[cmd]) {
      commands[cmd]();
    } else {
      addLine(`command not found: ${cmd}. Type <span class="terminal-cmd">help</span> for available commands.`, 'terminal-line-error');
    }
  });
})();


// ── Console ASCII Art (for developers who inspect) ────────────────

console.log(`%c
    █████╗ ██╗  ██╗██╗ ██████╗ ███╗   ███╗
   ██╔══██╗╚██╗██╔╝██║██╔═══██╗████╗ ████║
   ███████║ ╚███╔╝ ██║██║   ██║██╔████╔██║
   ██╔══██║ ██╔██╗ ██║██║   ██║██║╚██╔╝██║
   ██║  ██║██╔╝ ██╗██║╚██████╔╝██║ ╚═╝ ██║
   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝     ╚═╝
`, 'color: #2563ff; font-size: 10px; font-family: monospace;');

console.log('%c Innovation as a Service ', 'background: #2563ff; color: white; font-size: 14px; padding: 4px 12px; font-family: sans-serif;');
console.log('%c Built by Dr. Non Arkaraprasertkul & Dr. Poon Thiengburanathum ', 'color: #7a7a8a; font-size: 11px; font-family: monospace;');
console.log('%c Press / to open the command terminal ', 'color: #22c55e; font-size: 11px; font-family: monospace;');
console.log('%c Harvard · Oxford · MIT · Chiang Mai University ', 'color: #4a4a58; font-size: 10px; font-family: monospace;');
console.log('%c —————————————————————————————————— ', 'color: #1a1a2a;');
console.log('%c If you\'re reading this, we should probably talk. ', 'color: #2563ff; font-size: 12px; font-family: monospace;');
console.log('%c axiomaxiom.corp@gmail.com ', 'color: #eeeef0; font-size: 11px; font-family: monospace;');
