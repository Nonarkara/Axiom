/* ========================================
   AXIOM — Landing Page
   ======================================== */

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
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    touchZoom: false,
    keyboard: false,
    boxZoom: false,
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

  // Slow cinematic drift between cities
  let cityIndex = 0;
  function driftToNext() {
    cityIndex = (cityIndex + 1) % CITIES.length;
    const city = CITIES[cityIndex];
    map.flyTo([city.lat, city.lng], city.zoom, {
      duration: 8,
      easeLinearity: 0.1,
    });
  }

  // Start drifting after initial pause
  setTimeout(() => {
    driftToNext();
    setInterval(driftToNext, 12000);
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

  // Subtle parallax on mouse move
  let rafId;
  document.addEventListener('mousemove', (e) => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
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
  const bg = document.getElementById('humanitiesArt');
  if (!bg) return;

  // Curated public domain masterworks — high-res URLs from major museum open access programs
  const artworks = [
    'https://images.metmuseum.org/CRDImages/ep/original/DT1567.jpg', // Vermeer - Girl with a Pearl Earring (Met)
    'https://images.metmuseum.org/CRDImages/ep/original/DP346474.jpg', // Monet - Bridge Over a Pond of Water Lilies
    'https://images.metmuseum.org/CRDImages/ep/original/DT1502.jpg', // Van Gogh - Wheat Field with Cypresses
    'https://images.metmuseum.org/CRDImages/ep/original/DP-14936-023.jpg', // Rembrandt - Self Portrait
    'https://images.metmuseum.org/CRDImages/ep/original/DT47.jpg', // Renoir - Luncheon of the Boating Party
    'https://images.metmuseum.org/CRDImages/ep/original/DP145937.jpg', // Turner - Grand Canal Venice
    'https://images.metmuseum.org/CRDImages/ep/original/DT1947.jpg', // Cezanne - Still Life with Apples
    'https://images.metmuseum.org/CRDImages/as/original/DP251139.jpg', // Hokusai - Great Wave
  ];

  let index = 0;

  function setArt() {
    bg.style.backgroundImage = `url(${artworks[index]})`;
    index = (index + 1) % artworks.length;
  }

  setArt();
  setInterval(setArt, 8000);
})();


// ── City label on hero ─────────────────────────────────────────────

(function initCityLabel() {
  const label = document.getElementById('heroCityLabel');
  if (!label) return;

  const cities = ['BANGKOK', 'PHUKET', 'MIDDLE EAST', 'SOUTHEAST ASIA'];
  let i = 0;

  setInterval(() => {
    label.style.opacity = 0;
    setTimeout(() => {
      i = (i + 1) % cities.length;
      label.textContent = cities[i];
      label.style.opacity = 1;
    }, 400);
  }, 12000);

  // Start with first city after map starts
  setTimeout(() => {
    label.style.opacity = 0;
    setTimeout(() => {
      i = 1;
      label.textContent = cities[i];
      label.style.opacity = 1;
    }, 400);
  }, 5000);
})();
