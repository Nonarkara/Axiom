/* ============================================================
   co.nonarkara.org — Community places directory behaviour
   ============================================================ */

(function () {
  'use strict';

  /* ── Place data ── */
  const places = [
    {
      id: 'wang-mai',
      name: 'Wang Mai',
      thai: 'วังใหม่',
      cat: 'cafe',
      rating: 95,
      badge: 'GREAT GOOD PLACE INDEX · TOP 1% OF BANGKOK',
      lat: 13.7563,
      lng: 100.5018,
      fields: [
        { label: 'Access', value: '~1 min to rail (straight line)' },
        { label: 'Scene', value: '133 third places within 250 m' },
        { label: 'Character', value: 'independent' },
        { label: 'Footprint', value: 'listed by 4 sources' },
        { label: 'Work', value: 'Wi-Fi not tagged · hours known' },
        { label: 'Notable', value: 'no record' },
      ],
      hours: 'Closed now · Mo–Fr 07:30–18:30; Sa 08:30–17:30',
      address: '154 ซุ้มกอพิจิตร สวนหลวงราชินีวัฒนากร',
      facebook: 'https://facebook.com/742506365781243',
      phone: '+66942205366',
    },
    {
      id: 'the-mustang-blu',
      name: 'The Mustang Blu Café',
      thai: 'เดอะ มัสแตง บลู คาเฟ่',
      cat: 'cafe',
      rating: 88,
      badge: 'TOP 5% OF BANGKOK',
      lat: 13.7450,
      lng: 100.4950,
      fields: [
        { label: 'Access', value: '~3 min to rail' },
        { label: 'Scene', value: '98 third places within 250 m' },
        { label: 'Character', value: 'independent' },
        { label: 'Footprint', value: 'listed by 3 sources' },
        { label: 'Work', value: 'Wi-Fi · hours known' },
        { label: 'Notable', value: 'outdoor seating' },
      ],
      hours: 'Open now · Daily 08:00–19:00',
      address: 'Sukhumvit 71, Bangkok',
      facebook: null,
      phone: null,
    },
    {
      id: 'hor-hidden-cafe',
      name: 'Hor Hidden Café',
      thai: 'หอซ่อนคาเฟ่',
      cat: 'cafe',
      rating: 82,
      badge: 'TOP 10% OF BANGKOK',
      lat: 13.7620,
      lng: 100.5100,
      fields: [
        { label: 'Access', value: '~5 min to rail' },
        { label: 'Scene', value: '76 third places within 250 m' },
        { label: 'Character', value: 'independent' },
        { label: 'Footprint', value: 'listed by 2 sources' },
        { label: 'Work', value: 'Wi-Fi not tagged' },
        { label: 'Notable', value: 'courtyard seating' },
      ],
      hours: 'Open now · Daily 09:00–18:00',
      address: 'Ari, Bangkok',
      facebook: null,
      phone: null,
    },
    {
      id: 'ban-rak-library',
      name: 'Ban Rak Library',
      thai: 'บ้านรักห้องสมุด',
      cat: 'library',
      rating: 91,
      badge: 'TOP 3% OF BANGKOK',
      lat: 13.7380,
      lng: 100.4800,
      fields: [
        { label: 'Access', value: '~8 min to rail' },
        { label: 'Scene', value: '44 third places within 250 m' },
        { label: 'Character', value: 'community-run' },
        { label: 'Footprint', value: 'listed by 5 sources' },
        { label: 'Work', value: 'quiet · power outlets' },
        { label: 'Notable', value: 'Thai literature section' },
      ],
      hours: 'Open now · Tue–Sun 10:00–18:00',
      address: 'Bang Kapi, Bangkok',
      facebook: null,
      phone: null,
    },
    {
      id: 'sam-yan-cowork',
      name: 'Sam Yan Co-work',
      thai: 'สามย่านควอร์ก',
      cat: 'cowork',
      rating: 87,
      badge: 'TOP 7% OF BANGKOK',
      lat: 13.7420,
      lng: 100.4780,
      fields: [
        { label: 'Access', value: '~2 min to rail' },
        { label: 'Scene', value: '156 third places within 250 m' },
        { label: 'Character', value: 'students · freelancers' },
        { label: 'Footprint', value: 'listed by 6 sources' },
        { label: 'Work', value: 'Wi-Fi · desks · meeting rooms' },
        { label: 'Notable', value: 'student discount' },
      ],
      hours: 'Open now · Daily 08:00–22:00',
      address: 'Sam Yan, Bangkok',
      facebook: null,
      phone: null,
    },
    {
      id: 'drink-coffee-ho',
      name: 'Drink Coffee Ho',
      thai: 'ดริงก์คอฟฟี่โฮ',
      cat: 'food',
      rating: 79,
      badge: 'TOP 15% OF BANGKOK',
      lat: 13.7500,
      lng: 100.5150,
      fields: [
        { label: 'Access', value: '~4 min to rail' },
        { label: 'Scene', value: '67 third places within 250 m' },
        { label: 'Character', value: 'street food adjacent' },
        { label: 'Footprint', value: 'listed by 2 sources' },
        { label: 'Work', value: 'limited seating' },
        { label: 'Notable', value: ' Thai coffee beans' },
      ],
      hours: 'Closed now · Mo–Sa 07:00–15:00',
      address: 'Phaya Thai, Bangkok',
      facebook: null,
      phone: null,
    },
    {
      id: 'reno-espresso-bar',
      name: 'Reno Espresso Bar',
      thai: 'เรโน่ เอสเพรสโซ่ บาร์',
      cat: 'cafe',
      rating: 84,
      badge: 'TOP 8% OF BANGKOK',
      lat: 13.7480,
      lng: 100.5050,
      fields: [
        { label: 'Access', value: '~6 min to rail' },
        { label: 'Scene', value: '89 third places within 250 m' },
        { label: 'Character', value: 'specialty coffee' },
        { label: 'Footprint', value: 'listed by 3 sources' },
        { label: 'Work', value: 'Wi-Fi · power outlets' },
        { label: 'Notable', value: 'single-origin beans' },
      ],
      hours: 'Open now · Daily 07:30–18:30',
      address: 'Siam, Bangkok',
      facebook: null,
      phone: null,
    },
    {
      id: 'unicorn-cafe',
      name: 'Unicorn Cafe',
      thai: 'ยูนิคอร์นคาเฟ่',
      cat: 'cafe',
      rating: 76,
      badge: 'TOP 20% OF BANGKOK',
      lat: 13.7350,
      lng: 100.4850,
      fields: [
        { label: 'Access', value: '~10 min to rail' },
        { label: 'Scene', value: '52 third places within 250 m' },
        { label: 'Character', value: 'themed' },
        { label: 'Footprint', value: 'listed by 2 sources' },
        { label: 'Work', value: 'not recommended' },
        { label: 'Notable', value: 'unicorn decor' },
      ],
      hours: 'Open now · Daily 10:00–20:00',
      address: 'Bang Kapi, Bangkok',
      facebook: null,
      phone: null,
    },
  ];

  /* ── Map ── */
  const map = L.map('coMap', {
    zoomControl: false,
    attributionControl: false,
  }).setView([13.7500, 100.5000], 13);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap &copy; CARTO',
  }).addTo(map);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  const markers = {};
  const markerIcons = {
    cafe: '#a51931',
    cowork: '#8f8b80',
    library: '#00247d',
    food: '#d8d4ca',
  };

  places.forEach((place) => {
    const marker = L.circleMarker([place.lat, place.lng], {
      radius: 6,
      color: markerIcons[place.cat],
      fillColor: markerIcons[place.cat],
      fillOpacity: 0.9,
      weight: 1.5,
    }).addTo(map);

    marker.place = place;
    markers[place.id] = marker;

    marker.on('click', () => {
      openPlace(place);
      map.flyTo([place.lat, place.lng], 16, { duration: 1 });
    });
  });

  /* ── Panel ── */
  const panel = document.getElementById('coPanel');
  const panelInner = document.getElementById('coPanelInner');
  const closeBtn = document.querySelector('.co-panel__close');
  const stage = document.getElementById('coStage');

  function openPlace(place) {
    panelInner.innerHTML = placeMarkup(place);
    panel.classList.add('co-panel--open');
    stage.classList.add('co-stage--panel');
  }

  function closePlace() {
    panel.classList.remove('co-panel--open');
    stage.classList.remove('co-stage--panel');
    panelInner.innerHTML = '';
  }

  closeBtn.addEventListener('click', closePlace);

  /* ── Markup ── */
  function placeMarkup(p) {
    const fieldsHtml = p.fields
      .map(
        (f) => `
        <div class="co-place__field">
          <span class="co-place__field-label">${f.label}</span>
          <span class="co-place__field-value">${f.value}</span>
        </div>`
      )
      .join('');

    const facebookHtml = p.facebook
      ? `<a href="${p.facebook}" target="_blank" rel="noopener">facebook</a>`
      : '';
    const phoneHtml = p.phone ? `<a href="tel:${p.phone}">${p.phone}</a>` : '';
    const contactHtml = [facebookHtml, phoneHtml].filter(Boolean).join(' &middot; ');

    return `
      <div class="co-place__name">${p.name}</div>
      <div class="co-place__thai">${p.thai}</div>
      <div class="co-place__meta">
        <span class="co-place__rating">${p.rating}</span>
        <span class="co-place__rating-sub">${p.badge}</span>
      </div>
      <hr class="co-place__divider">
      <div class="co-place__field">
        <span class="co-place__field-label">Category</span>
        <span class="co-place__field-value">${p.cat}</span>
      </div>
      ${fieldsHtml}
      ${contactHtml ? `<div class="co-place__field"><span class="co-place__field-value">${contactHtml}</span></div>` : ''}
      <div class="co-place__field">
        <span class="co-place__field-label">Hours</span>
        <span class="co-place__field-value">${p.hours}</span>
      </div>
      <div class="co-place__field">
        <span class="co-place__field-label">Address</span>
        <span class="co-place__field-value">${p.address}</span>
      </div>
      <div class="co-place__actions">
        <button class="co-place__btn co-place__btn--ghost" type="button">Save</button>
        <button class="co-place__btn" type="button">Directions</button>
      </div>
    `;
  }

  /* ── Filters ── */
  const chips = document.querySelectorAll('.co-chip');

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cat = chip.dataset.cat;

      chips.forEach((c) => c.classList.remove('co-chip--active'));
      chip.classList.add('co-chip--active');

      places.forEach((place) => {
        const marker = markers[place.id];
        if (cat === 'all' || place.cat === cat) {
          marker.addTo(map);
        } else {
          map.removeLayer(marker);
        }
      });
    });
  });

  /* ── Search ── */
  const searchInput = document.getElementById('coSearch');
  const searchBtn = document.querySelector('.co-search__btn');

  function doSearch() {
    const q = searchInput.value.toLowerCase().trim();
    if (!q) return;

    const match = places.find(
      (p) => p.name.toLowerCase().includes(q) || p.thai.includes(q)
    );
    if (match) {
      openPlace(match);
      map.flyTo([match.lat, match.lng], 16, { duration: 1 });
    }
  }

  searchBtn.addEventListener('click', doSearch);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });

  /* ── Click map background closes panel ── */
  map.on('click', (e) => {
    if (e.target === map) closePlace();
  });

  /* ── ESC closes panel ── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePlace();
  });
})();
