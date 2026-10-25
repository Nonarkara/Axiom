(function () {
  const MEDIA = 'https://axiom.nonarkara.org/';
  const systems = Array.isArray(window.AXIOM_SYSTEMS) ? window.AXIOM_SYSTEMS : [];
  // One public-domain artwork per system, in place of the product screenshot.
  // After DIE WELT's 6 October 2011 edition, in which Ellsworth Kelly replaced
  // every news photograph with his own work. Pro bono entries keep their photos.
  // The nine page artworks are museum works too, chosen because the painting
  // tells that page's story — the flood, the missing picture, the working thing.
  const PLATES = window.AXIOM_PLATES || {};
  // Cloudflare serves static assets with a four-hour max-age. A plate whose
  // file changed under the same name keeps serving the old bytes for hours,
  // so every plate is addressed by a versioned path. Bump this when art ships.
  const ART_V = '20261026a';
  const DIAGRAMS = window.AXIOM_DIAGRAMS || {};
  const I18N = window.AXIOM_I18N || { ui: {}, systems: {}, docs: {} };

  let currentLocale = 'en';
  try {
    const saved = localStorage.getItem('axiomx_locale');
    const param = new URLSearchParams(location.search).get('lang');
    if (param && ['en', 'th', 'zh', 'ko', 'ja', 'vi'].includes(param)) currentLocale = param;
    else if (saved && ['en', 'th', 'zh', 'ko', 'ja', 'vi'].includes(saved)) currentLocale = saved;
  } catch (e) {}

  function resolve(obj, path) {
    if (!obj || !path) return undefined;
    if (obj[path] !== undefined) return obj[path];
    const parts = path.split('.');
    let cur = obj;
    for (let i = 0; i < parts.length; i++) {
      if (cur == null || typeof cur !== 'object') return undefined;
      cur = cur[parts[i]];
    }
    return cur !== undefined ? cur : undefined;
  }

  function t(key, fallback) {
    const locMap = I18N.ui?.[currentLocale] || {};
    const enMap = I18N.ui?.en || {};
    const valLoc = resolve(locMap, key);
    if (valLoc !== undefined) return valLoc;
    const valEn = resolve(enMap, key);
    if (valEn !== undefined) return valEn;
    return fallback !== undefined ? fallback : key;
  }

  function localizedTitle(entry) {
    if (!entry) return '';
    if (entry.kind === 'system') {
      const locSys = (I18N.systems?.[currentLocale] || {})[entry.id];
      if (locSys && locSys.name) return locSys.name;
      return entry.title;
    }
    const locDoc = (I18N.docs?.[currentLocale] || {})[entry.id];
    if (locDoc && locDoc.title) return locDoc.title;
    return entry.title;
  }

  const shell = document.getElementById('shell');
  const nav = document.getElementById('nav');
  const plate = document.getElementById('plate');
  const q = document.getElementById('q');
  const findCount = document.getElementById('findCount');
  const barKicker = document.getElementById('barKicker');
  const barOpen = document.getElementById('barOpen');
  const locatorNum = document.getElementById('locatorNum');
  const locatorMeta = document.getElementById('locatorMeta');
  const themeBtn = document.getElementById('themeBtn');
  const themeBtn2 = document.getElementById('themeBtn2');
  const backBtn = document.getElementById('backBtn');
  const locale = document.querySelector('.locale');

  let current = '';
  let query = '';

  function media(src) {
    if (!src) return '';
    if (/^https?:\/\//.test(src)) return src;
    return MEDIA + src.split('/').map(encodeURIComponent).join('/');
  }

  // A looping clip — the ground condition a system actually runs in. Muted and
  // inline so it never interrupts, lazy so it costs nothing until the reader
  // arrives, and it does not autoplay when the reader has asked for less
  // motion: the poster still stands in, so the figure is never a blank box.
  // If the browser refuses to autoplay, the poster is the honest fallback.
  function addClip(clip) {
    const fig = el('figure', 'clip');
    const v = document.createElement('video');
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.preload = 'none';
    v.setAttribute('poster', media(clip.poster));
    v.setAttribute('aria-label', clip.alt || '');
    const source = document.createElement('source');
    source.src = media(clip.src);
    source.type = 'video/mp4';
    v.appendChild(source);
    const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!still) {
      const started = v.play();
      if (started && started.catch) started.catch(function () { /* poster stands in */ });
    }
    fig.appendChild(v);
    if (clip.caption) fig.appendChild(el('figcaption', '', clip.caption));
    plate.appendChild(fig);
    return fig;
  }

  const FIELD_VIDEOS = [
    {
      id: '0-A3R_i3wrs',
      title: 'ยืนกลางซอยน้ำท่วม — อธิบายสถานการณ์จากจุดเกิดเหตุ',
      meta: 'FloodDash Field · Live',
      desc: 'The ground condition. Read from standing in it — every flood season since the first watch, in Thai, in public.'
    },
    {
      id: 'lLnq4LefXiI',
      title: 'หน้าจอจริง — คะแนนจังหวัด · เรดาร์ · MY AREA',
      meta: 'System Walkthrough · Multi-source',
      desc: 'Reading the situation picture: how provincial hazard scoring, rain radar, and neighborhood alerts work together in real time.'
    },
    {
      id: 'O80WcxnzC9Q',
      title: 'เปิดแผนที่บนโน้ตบุ๊ก — อ่านสียังไงไม่ให้ตกใจ',
      meta: 'Decision Guide · Interface',
      desc: 'Decoding colour bands and risk thresholds without panic: how a commander or resident reads the map.'
    },
    {
      id: 'RQe0izP7BUs',
      title: 'น้ำท่วมถึงน่อง! เดินเช็ก FloodDash กลางซอย',
      meta: 'Ground Truth · Field Check',
      desc: 'Ground-truthing civic models in shin-deep floodwaters: verifying sensors against physical reality.'
    },
    {
      id: '1SNQIOcz7-o',
      title: 'ทำไมกรุงเทพฯ ฝนตกหนักวันนี้? + AI ช่วยเฝ้าระวังน้ำท่วม',
      meta: 'Analysis · Meteorology & AI',
      desc: 'Analyzing urban cloudburst dynamics, weather radar patterns, and real-time surveillance.'
    }
  ];

  function addVideoStudio(captionText) {
    const fig = el('figure', 'vstudio');

    const main = el('div', 'vstudio-main');
    const wrap = el('div', 'vstudio-player');

    // THE PLAYER IS A POSTER UNTIL THE READER ASKS FOR THE FILM.
    // A third-party frame that loads on its own is a request to a third
    // party the reader never made, and it is the reason the entry takes
    // seconds to settle. The poster is the same frame, still the same
    // figure, and it becomes the film on one click.
    const poster = document.createElement('button');
    poster.type = 'button';
    poster.className = 'vstudio-poster';
    poster.setAttribute('aria-label', 'Play the field briefing');
    const posterImg = document.createElement('img');
    posterImg.className = 'vstudio-poster-img';
    posterImg.src = 'https://img.youtube.com/vi/' + FIELD_VIDEOS[0].id + '/hqdefault.jpg';
    posterImg.alt = '';
    posterImg.loading = 'lazy';
    poster.appendChild(posterImg);
    const playBtn = el('span', 'vstudio-poster-play');
    playBtn.setAttribute('aria-hidden', 'true');
    playBtn.textContent = '▶';
    poster.appendChild(playBtn);
    wrap.appendChild(poster);

    let iframe = null;
    function startVideo(v, autoplay) {
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.className = 'vstudio-iframe';
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; compute-pressure');
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.setAttribute('frameborder', '0');
        wrap.appendChild(iframe);
      }
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + v.id +
        '?enablejsapi=1&rel=0' + (autoplay ? '&autoplay=1' : '');
      iframe.title = v.title;
    }

    poster.addEventListener('click', function () {
      poster.remove();
      startVideo(FIELD_VIDEOS[0], true);
    });

    main.appendChild(wrap);

    const info = el('figcaption', 'vstudio-info');
    const metaTag = el('span', 'vstudio-tag', FIELD_VIDEOS[0].meta);
    const titleEl = el('h3', 'vstudio-title', FIELD_VIDEOS[0].title);
    const descEl = el('p', 'vstudio-desc', captionText || FIELD_VIDEOS[0].desc);
    info.appendChild(metaTag);
    info.appendChild(titleEl);
    info.appendChild(descEl);
    main.appendChild(info);
    fig.appendChild(main);

    const list = el('div', 'vstudio-list');
    const listHead = el('div', 'vstudio-list-head');
    listHead.appendChild(el('span', 'vstudio-list-title', 'Field Briefings'));
    listHead.appendChild(el('span', 'vstudio-list-count', FIELD_VIDEOS.length + ' videos'));
    list.appendChild(listHead);

    const itemsWrap = el('div', 'vstudio-items');
    itemsWrap.setAttribute('role', 'tablist');

    FIELD_VIDEOS.forEach(function (v, idx) {
      const card = el('button', 'vstudio-item' + (idx === 0 ? ' is-active' : ''));
      card.type = 'button';
      card.setAttribute('role', 'tab');
      card.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
      card.setAttribute('aria-label', v.title);

      const thumb = el('div', 'vstudio-thumb');
      const img = document.createElement('img');
      img.src = 'https://img.youtube.com/vi/' + v.id + '/mqdefault.jpg';
      img.alt = v.title;
      img.loading = 'lazy';
      thumb.appendChild(img);
      const badge = el('span', 'vstudio-idx', '0' + (idx + 1));
      thumb.appendChild(badge);
      card.appendChild(thumb);

      const copy = el('div', 'vstudio-meta');
      copy.appendChild(el('span', 'vstudio-item-meta', v.meta));
      copy.appendChild(el('span', 'vstudio-item-title', v.title));
      card.appendChild(copy);

      card.addEventListener('click', function () {
        itemsWrap.querySelectorAll('.vstudio-item').forEach(function (c) {
          c.classList.remove('is-active');
          c.setAttribute('aria-selected', 'false');
        });
        card.classList.add('is-active');
        card.setAttribute('aria-selected', 'true');
        // Choosing a briefing from the list IS the request to watch it.
        // Leaving the poster up would ask the reader to click twice for one
        // intent, and put the decision in one place and the action in
        // another — the scattered-action failure.
        if (poster.parentNode) poster.remove();
        startVideo(v, true);
        metaTag.textContent = v.meta;
        titleEl.textContent = v.title;
        descEl.textContent = v.desc;
      });

      itemsWrap.appendChild(card);
    });

    list.appendChild(itemsWrap);
    fig.appendChild(list);
    plate.appendChild(fig);
    return fig;
  }

  // A plate: the artwork, then a credit line set like a museum label, then one
  // line on why this work stands for this system.
  // Every plate is a museum work with a public source to point at.
  function sourceLine(art) {
    const src = el('p', 'plate-src');
    src.appendChild(link(art[4], t('source', 'Source')));
    src.appendChild(document.createTextNode(' · ' + art[5]));
    return src;
  }

  function addPlate(id, art, host) {
    const fig = el('figure', 'plate-art');
    const img = el('img', 'plate-img');
    const artSrc = 'art/' + id + '.webp?v=' + ART_V;
    img.src = artSrc;
    img.alt = art[1] + ', ' + art[0] + ', ' + art[2];
    img.width = art[7];
    img.height = art[8];
    img.decoding = 'async';
    fig.appendChild(img);
    const cap = el('figcaption');
    const label = el('p', 'plate-label');
    label.appendChild(el('b', '', art[0]));
    label.appendChild(el('i', '', art[1]));
    label.appendChild(document.createTextNode(', ' + art[2] + '. ' + art[3] + '.'));
    cap.appendChild(label);
    const whyP = el('p', 'plate-why', art[6]);
    cap.appendChild(whyP);
    cap.appendChild(sourceLine(art));
    fig.appendChild(cap);

    // Easter egg: Double-click (or double-tap on touch) at the artwork to toggle
    // the real production system screen from axiom.nonarkara.org.
    const sys = systems.find(function (s) { return s.id === id; });
    if (sys && sys.img) {
      fig.style.cursor = 'pointer';
      fig.title = 'Double-click to view the real production interface';
      let showingScreen = false;
      const screenSrc = media(sys.img);
      function toggle() {
        showingScreen = !showingScreen;
        if (showingScreen) {
          img.src = screenSrc;
          img.alt = sys.alt || sys.name;
          fig.classList.add('is-real-screen');
          whyP.textContent = '⚡ Production Interface · ' + (sys.name || id) + ' (double-click to return to masterwork).';
        } else {
          img.src = artSrc;
          img.alt = art[1] + ', ' + art[0] + ', ' + art[2];
          fig.classList.remove('is-real-screen');
          whyP.textContent = art[6];
        }
      }
      fig.addEventListener('dblclick', function (e) {
        e.preventDefault();
        toggle();
      });
      let lastTap = 0;
      fig.addEventListener('touchend', function (e) {
        const now = Date.now();
        if (now - lastTap < 350) {
          e.preventDefault();
          toggle();
        }
        lastTap = now;
      });
    }

    (host || plate).appendChild(fig);

    // The label belongs to the plate, so the label is never allowed to run
    // wider than the plate it names. A portrait work is height-capped by
    // the page, so CSS alone cannot measure it — the rendered image can.
    // The label keeps its own reading measure when the plate is wide enough
    // to carry it, and shrinks to the plate when it is not.
    const reading = parseFloat(getComputedStyle(cap).maxWidth) || 0;
    function fitLabel() {
      if (!img.naturalWidth) return;
      const w = Math.round(img.getBoundingClientRect().width);
      if (!w) return;
      cap.style.maxWidth = Math.min(w, reading || w) + 'px';
    }
    if (window.ResizeObserver) {
      new ResizeObserver(fitLabel).observe(img);
    } else {
      img.addEventListener('load', fitLabel);
      window.addEventListener('resize', fitLabel);
    }
    fitLabel();
    return fig;
  }

  // The hero: one wide plate, edge to edge, with the museum label under it.
  // The poster above it is a sentence long; the picture has to run the length
  // of that sentence, not sit beside it like a stamp.
  function addHero(id, art) {
    const fig = el('figure', 'hero-art');
    const img = el('img', 'hero-img');
    img.src = 'art/' + id + '.webp?v=' + ART_V;
    img.alt = art[1] + ', ' + art[0] + ', ' + art[2];
    img.width = art[7];
    img.height = art[8];
    img.decoding = 'async';
    fig.appendChild(img);
    const cap = el('figcaption');
    const label = el('p', 'plate-label');
    label.appendChild(el('b', '', art[0]));
    label.appendChild(el('i', '', art[1]));
    label.appendChild(document.createTextNode(', ' + art[2] + '. ' + art[3] + '.'));
    cap.appendChild(label);
    cap.appendChild(el('p', 'plate-why', art[6]));
    cap.appendChild(sourceLine(art));
    fig.appendChild(cap);
    plate.appendChild(fig);
    return fig;
  }

  // The field notes get two objects under the prose: an artwork that stands for
  // the claim, and a drawing of the claim. The plate keeps the same museum label
  // it carries everywhere else — same credit, same source, same licence — so the
  // duo inherits the audit trail rather than needing its own.
  function addDuo(block) {
    const art = PLATES[block.plate];
    if (!art) return;
    const band = el('section', 'duo');
    addPlate(block.plate, art, band);

    const fig = el('figure', 'duo-fig');
    const svg = DIAGRAMS[block.diagram];
    if (svg) fig.innerHTML = svg;
    if (block.caption) fig.appendChild(el('figcaption', '', block.caption));
    band.appendChild(fig);

    plate.appendChild(band);
    return band;
  }

  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function link(href, label, cls) {
    const a = el('a', cls || 'inline-link', label);
    a.href = href;
    if (/^https?:\/\//.test(href)) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
    return a;
  }

  function doc(id, group, title, blocks, extra) {
    const search = [group, title].concat(textOf(blocks)).join(' ');
    return Object.assign({ id, group, title, kind: 'doc', blocks, search }, extra || {});
  }

  function textOf(blocks) {
    const out = [];
    (blocks || []).forEach(function (b) {
      ['text', 'lede', 'note', 'v', 'l', 't', 'q', 'a', 'k', 'title', 'meta', 'label', 'name', 'role'].forEach(function (key) {
        if (b[key]) out.push(b[key]);
      });
      (b.rows || b.items || b.groups || []).forEach(function (row) {
        if (typeof row === 'string') out.push(row);
        else out.push(row.v, row.l, row.t, row.q, row.a, row.k, row.title, row.meta, row.text, row.name);
        (row.items || []).forEach(function (item) { out.push(item.text || item); });
      });
    });
    return out.filter(Boolean);
  }

  const STACK = [
    ['Cloud infrastructure', 'Where it runs', [
      ['Docker'], ['GitHub Pages', 1, 1], ['Vercel', 1], ['Cloudflare Pages', 1], ['Cloudflare Workers', 1], ['Wrangler', 1], ['Cloudflare DNS', 1], ['Cloudflare R2', 1], ['Netlify', 1], ['Supabase', 1], ['Render', 1], ['Railway', 1], ['Fly.io', 1], ['Hetzner VPS', 1]
    ]],
    ['Framework and connectors', 'What wires it', [
      ['React', 0, 1], ['Node.js'], ['Next.js'], ['Tailwind CSS'], ['Vite'], ['Express'], ['GitHub Actions', 1], ['ngrok'], ['Fastify'], ['Cloudflare Tunnel', 1]
    ]],
    ['Platform and build tools', 'Where we build', [
      ['VS Code'], ['GitHub', 1], ['Cursor'], ['Claude Code', 0, 1], ['OpenAI Codex', 1], ['Terminal'], ['Warp'], ['Obsidian'], ['Cline'], ['Wispr Flow'], ['Kilocode'], ['Google Antigravity', 1], ['Google Stitch', 1], ['Claude Design', 1], ['Playwright'], ['Blip']
    ]],
    ['AI models and engines', 'The intelligence', [
      ['OpenAI GPT', 1], ['Google Gemini', 1], ['Grok', 1], ['Perplexity', 1], ['DeepSeek', 1], ['Opus 4.8', 1, 1], ['Ollama'], ['Kimi 2.7', 1], ['Kimi 2.6', 1], ['GLM 5.2', 1], ['Qwen3-Coder 30B'], ['Qwen2.5-Coder 32B'], ['Qwen2.5-Coder 7B'], ['Gemma 4 12B'], ['Fable 5'], ['OpenRouter', 1], ['litellm'], ['nomic-embed']
    ]],
    ['Software and libraries', 'The working parts', [
      ['Redis'], ['SQLite'], ['D3'], ['OpenCV'], ['Leaflet'], ['Mapbox GL', 1], ['Chart.js'], ['PostGIS', 1], ['YOLO'], ['Deck.gl', 0, 1], ['MapLibre'], ['pgvector'], ['grammY'], ['vis-network'], ['LINE SDK'], ['Firebase', 1], ['React Router'], ['Telegram Bot API'], ['Xiaohei illustration', 1, 0, 'https://github.com/helloianneo/ian-xiaohei-illustrations']
    ]],
    ['Languages', 'The source', [
      ['JavaScript'], ['Python', 0, 1], ['HTML'], ['CSS'], ['TypeScript'], ['SQL'], ['PHP'], ['Bash'], ['Go']
    ]],
    ['Live data sources', 'The inputs', [
      ['NASA FIRMS', 1], ['NASA GIBS', 1], ['World Bank', 1], ['Copernicus Sentinel', 1], ['FRED', 1], ['Open-Meteo', 1], ['OpenSky', 1], ['OpenAQ', 1], ['GDELT', 1], ['EIA', 1], ['ACLED', 1], ['Bank of Thailand', 1], ['GISTDA', 1, 1], ['AISStream', 1], ['CelesTrak', 1]
    ]],
    ['Channels', 'The outputs', [
      ['WhatsApp', 1], ['Telegram', 1, 1], ['Slack', 1], ['Discord', 1], ['LINE', 1], ['Feishu', 1], ['Warp', 1]
    ]],
    ['Local runtime', 'The desk', [
      ['M5 Max · 128GB', 0, 1], ['M3 MacBook Air'], ['Chrome Remote Desktop'], ['Git'], ['PostgreSQL'], ['Docker Desktop']
    ]]
  ];

  const book = [];

  book.push(doc('axiom', 'Index', 'Axiom', [
    { type: 'poster', text: 'The flood arrives at 2 a.m.', em: 'The dashboard arrives next fiscal year.' },
    { type: 'hero', plate: 'page-hero' },
    { type: 'lede', text: 'City data already exists. In a crisis, nobody sees it whole. We build one screen for one decision, and put it in the room in two weeks.' },
    { type: 'figs', rows: [
      { v: String(systems.length), l: 'Systems', t: 'Across five countries. Open one.' },
      { v: '2 wk', l: 'To a screen', t: 'On data you already have. No new hardware to start.' },
      { v: '24/7', l: 'Monitoring', t: 'Public sources, refreshed while the room is asleep.' },
      { v: '112K', l: 'Following', t: 'The FloodDash brief, in public, in Thai.' }
    ]},
    { type: 'p', text: 'For governors, mayors, agency heads, and the operators who have to decide before the meeting.' },
    { type: 'p', text: 'Bangkok — flood, campus, urban. Phuket — coast, transit, air. The Middle East — conflict, open intelligence. Southeast Asia — border, index, scale. These name a scope. They are not a list of installation sites.' },
    { type: 'actions', items: [
      { href: '#problem', label: 'The problem' },
      { href: '#brief', label: 'Start a two-week proof' },
      { href: '#flood-ami', label: 'FloodDash' }
    ]}
  ]));

  book.push(doc('problem', 'Method', 'The picture is late', [
    { type: 'h', text: 'The picture is late' },
    { type: 'lede', text: 'Rain, traffic, air, complaints, satellites — held by a dozen agencies, each on its own clock. The crisis arrives on one clock. It arrives at 2 a.m. Nothing else does.' },
    { type: 'plate', plate: 'page-problem' },
    { type: 'steps', items: [
      { t: 'The data is already there.', d: 'It sits in TMD rainfall gauges, GISTDA satellite passes, Pollution Control Department air readings, municipal spreadsheets, and a phone call from a district officer. Almost all of it is public. None of it is hard to obtain. It is only hard to see.' },
      { t: 'The clocks do not match.', d: 'Gauges report every five minutes. A satellite passes every ten days. Complaints get logged when somebody is awake to log them. A decision needs all three in the same second. No agency is built to do that, because no single agency owns the decision that would need it.' },
      { t: 'The quote takes a year.', d: 'A budget cycle later what arrives is a deck. The deck is not wrong. It is about a flood that already happened, delivered to a room that has already decided.' },
      { t: 'The first hour is phone calls.', d: 'People ask what is happening. The decision about what to do waits behind the answer. In a flood that is the distance between a warning and a recovery plan.' }
    ]}
  ], { num: '01' }));

  book.push(doc('room', 'Method', 'No handlers', [
    { type: 'h', text: 'No handlers' },
    { type: 'lede', text: 'Bring the problem. The people you meet in week one are the people writing the code in week two. There is no account layer and no hand-off.' },
    { type: 'plate', plate: 'page-room' },
    { type: 'steps', items: [
      { t: 'The large firm', d: 'A senior partner sells the work. A delivery team you never meet builds it. You get slides, a change-request cycle, and a vendor relationship to manage instead of a problem to solve.' },
      { t: 'What that costs', d: 'Every question survives two translations — once into a proposal, once into a build. The answers come back shaped like the proposal rather than like your problem.' },
      { t: 'Here', d: 'Two founders. One writes the architecture and the argument. One keeps the ambition tied to infrastructure that survives contact with the city. Specialists join a mission, not a bench.' },
      { t: 'What that buys you', d: 'You judge a working system rather than a promise. And if it is wrong, the person who can fix it is already in the room.' }
    ]}
  ], { num: '02' }));

  book.push(doc('steps', 'Method', 'Three steps', [
    { type: 'h', text: 'Three steps' },
    { type: 'lede', text: 'Two weeks to a screen somebody can actually use. The steps never change. The decision does.' },
    { type: 'steps', items: [
      { t: 'Week 1 — Name the decision.', d: 'We sit with the person who really decides — a governor, a flood desk, a port authority — and agree on one decision to make faster. Who owns it. What data already exists. What it would mean to be wrong in time.', plate: 'page-step-1' },
      { t: 'Week 2 — A working screen, in the room.', d: 'Built on your data and on free public sources. No new hardware, no procurement, no procurement-grade lead time. You judge it live, on your own numbers, and tell us what is wrong with it.', plate: 'page-step-2' },
      { t: 'From day one — Measure, then scale.', d: 'Every screen logs who opens it and which decision it served. The next version is built from what the first one taught. Scaling follows use instead of being decided in advance.', plate: 'page-step-3' }
    ]},
    { type: 'note', text: 'The constraint is never the technology. It is agreeing, in week one, that there is one decision worth two weeks.' }
  ], { num: '03' }));

  book.push(doc('changed', 'Method', 'What changed', [
    { type: 'h', text: 'What changed' },
    { type: 'lede', text: 'Measured on live systems. Not promised in a deck.' },
    { type: 'figs', rows: [
      { v: '30s', l: 'Phuket Ops', t: 'Transit, safety, and environment on one screen a governor can read in half a minute.' },
      { v: '77', l: 'FloodDash', t: 'Every Thai province on one flood picture. Nine public sources, refreshed every 3–60 minutes.' },
      { v: '45m', l: 'SLIC · Taipei', t: '157 cities ranked live, on stage, inside a 45-minute keynote.' },
      { v: '14d', l: 'Field note', t: 'A vendor called it too complex. A working version was in the room fourteen days later.' }
    ]},
    { type: 'plate', plate: 'page-changed' },
    { type: 'p', text: 'One objection is worth answering properly. Two weeks sounds fast because it sounds thin. It is thin — on purpose. A first screen is one decision, live, on real data, with its limits visible. It is not a finished product and we will not sell it as one.' },
    { type: 'p', text: 'What it buys is knowledge. In two weeks you find out whether the decision is real, whether the data actually supports it, and whether anybody opens the screen at two in the morning. A year of procurement answers none of those three questions until it is too late to change course.' },
    { type: 'p', text: systems.length + ' systems across five countries. Open one. Use it. Judge it.' }
  ], { num: '04' }));

  book.push(doc('questions', 'Method', 'Before you ask', [
    { type: 'h', text: 'Before you ask' },
    { type: 'steps', items: [
      { t: 'Is it expensive?', d: 'No hardware. The first step is a two-week proof on data you already own. Anything larger waits until you have seen it work.' },
      { t: 'Will it work with our data?', d: 'The systems here already run on Thai public data — TMD, GISTDA, the Pollution Control Department, OpenStreetMap. Messy data is the starting point.' },
      { t: 'Is our data safe?', d: 'The first step uses public data, so sensitive records stay with you. Delivery follows PDPA, GDPR-informed practice, and ISO/IEC frameworks. That is practice, not a certification. See the record.' },
      { t: 'You are a small team. Can you deliver?', d: 'You deal with the builders — Dr Non Arkaraprasertkul and Dr Poon Thiengburanathum. Specialists join for a mission, not as a standing bench.' },
      { t: 'Will it still run after launch?', d: 'Most systems here have outlived their launch. Each is documented and instrumented so your own team can keep it.' }
    ]},
    { type: 'plate', plate: 'page-questions' }
  ], { num: '05' }));

  book.push(doc('iaas', 'Practice', 'Innovation-as-a-Service', [
    { type: 'h', text: 'Innovation-as-a-Service' },
    { type: 'lede', text: 'Not a product. A way of working. We sit with the people who decide, and build the thing with them, inside their rules.' },
    { type: 'plate', plate: 'iaas' },
    { type: 'vstudio', caption: 'The ground condition. The thing you have to stand in before you can be trusted to build for it.' },
    { type: 'p', text: 'A city is usually sold a product: a box, a licence, a platform that arrives finished and fits nobody. Innovation-as-a-Service turns that around. We start with one problem the city already has, one decision it cannot make fast enough, and we build the answer alongside the people who own it.' },
    { type: 'p', text: 'There is an old trap here. A city is asked for a feasibility study before it tries anything, but you cannot study something you have not yet tried. So we try it first, small and cheap, on data the city already holds, with no new hardware. Then the study writes itself from what actually happened.' },
    { type: 'steps', items: [
      { t: 'Start with the pain, not the product.', d: 'Who decides, what they need to know, and what it costs to know it late. Everything else waits.' },
      { t: 'Steal, improve, credit.', d: 'If Taipei or Christchurch already solved part of it, we use that, adapt it, and say where it came from. Reinventing is the expensive option.' },
      { t: 'Everyone can be an innovator.', d: 'Identify the pain point, build a rough version, show it, fix it. The method belongs to the clerk and the governor as much as to the engineer.' },
      { t: 'Small wins pay for the next step.', d: 'Lower procurement cost, less R&D time, quick public results. The savings become the budget for what comes after.' }
    ]},
    { type: 'p', text: 'Four parties make it work: the people with the problem, the public agency that backs them, the private builders with the tools, and the partnership that holds them together. Top-down resources, bottom-up insight.' },
    { type: 'p', text: 'FloodDash is the clearest example. It began as a public flood watch in Thai and grew into a national picture, because it was built where the water was, not in a meeting room.' },
    { type: 'actions', items: [
      { href: '#flood-ami', label: 'FloodDash' },
      { href: '#steps', label: 'Three steps' },
      { href: '#brief', label: 'Tell us the decision' }
    ]},
    { type: 'rows', items: [
      { href: 'https://govinsider.asia/intl-en/article/can-innovation-as-a-service-close-the-gap-between-policy-and-implementation', title: 'Can innovation-as-a-service close the gap between policy and implementation?', meta: 'GovInsider' },
      { href: 'https://ascn.nonarkara.org/', title: 'ASCN Innovation-as-a-Service: live systems, not a roadmap', meta: 'ascn.nonarkara.org' }
    ]}
  ]));

  book.push(doc('catalogue', 'Catalogue', 'How to read this', [
    { type: 'h', text: 'How to read this' },
    { type: 'lede', text: 'Every entry here started as one decision somebody could not make fast enough. It is live, or it says it is not.' },
    { type: 'plate', plate: 'page-catalogue' },
    { type: 'p', text: 'These are not demos dressed up for a pitch. They are working systems in a sandbox, built to scale rather than to impress. Deployments under NDA are larger; what you can open here behaves like them, with advanced modules withheld.' },
    { type: 'steps', items: [
      { t: 'Live', d: 'Running now, on public or client data. Read the entry, then open it. It will still be running in the morning.' },
      { t: 'Preview', d: 'Built and openable, but the data is illustrative or the scope is narrower than the entry implies. Marked on the entry rather than quietly left out.' },
      { t: 'Soon and Dev', d: 'In progress. Listed because the work is real and the date is not a promise. Nothing in this book is presented as finished when it is not.' }
    ]},
    { type: 'p', text: 'Each entry is one plate: what the system decides, what it takes in, what it shows, and where it runs. There are three ways in — read the five Method entries for the argument, browse a group for the catalogue, or search across everything. Press / to search, the arrow keys to move between entries, Escape to step back.' },
    { type: 'note', text: 'The Method group is five entries and takes about four minutes. If you read only one group, read that one.' }
  ]));

  systems.forEach(function (system) {
    const bits = [system.cluster, system.name, system.cat, system.status, system.lede, system.cta];
    if (PLATES[system.id]) bits.push(PLATES[system.id][0], PLATES[system.id][1]);
    if (system.arch) {
      bits.push(system.arch.foot, system.arch.ai, (system.arch.inputs || []).join(' '), (system.arch.outputs || []).join(' '), (system.arch.stack || []).join(' '));
    }
    book.push({
      id: system.id,
      group: system.cluster,
      num: system.idx,
      title: system.name,
      kind: 'system',
      system: system,
      search: bits.filter(Boolean).join(' ')
    });
  });

  const probono = [
    ['pb-ascn', '38 cities. 10 nations. One platform.', 'For ASEAN Secretariat', 'ASEAN Smart Cities Network', 'https://ascn.depa.or.th', 'photos/probono/ascn.jpg', 'ASEAN Smart Cities Network launch at SCSE Taipei', ['Next.js', 'Cloudflare Pages', 'D1', 'Tailwind']],
    ['pb-csco', '112,000 users. Born from real flooding.', 'ASEAN · UNDP · UN-Habitat', 'ASEAN CSCO Handbook', 'https://asean.nonarkara.org/#manifesto', 'photos/probono/csco.jpg', 'CSCO Handbook workshop', ['Static HTML', 'Cloudflare Pages', 'D1', 'Hand-tuned typography']],
    ['pb-solomon', 'A whole-of-government digital roadmap.', 'UN DESA · Solomon Islands Government', 'Honiara · two-day workshop', 'https://solomon.nonarkara.org/#institutions', 'photos/probono/solomon.jpg', 'UN DESA digital transformation workshop in Honiara', ['Static HTML', 'Cloudflare Pages', 'Workshop facilitation']],
    ['pb-scl', 'Thailand’s digital agency, online.', 'For depa Thailand', 'Smart City Leadership · bilingual', 'https://scl.nonarkara.org/', 'photos/probono/scl.jpg', 'depa Smart City Leadership programme', ['Static HTML', 'Cloudflare Pages', 'Bilingual interface']],
    ['pb-usdot', 'Fieldwork, turned into a toolkit.', 'depa · US DOT', 'US–ASEAN Smart Cities Partnership', 'https://depa-usdot.nonarkara.org/', 'photos/probono/usdot.jpg', 'depa US DOT Smart Cities Toolkit', ['Static and SSR', 'Cloudflare Pages', 'Workers', 'D1']]
  ];

  book.push(doc('probono', 'Pro bono', 'Institutional work', [
    { type: 'h', text: 'Institutional work' },
    { type: 'lede', text: 'Five platforms. Live, public, and still in use. Not a deck, and not a report.' },
    { type: 'plate', plate: 'probono' },
    { type: 'p', text: 'Each one was built with the institution that had to use it.' },
    { type: 'rows', items: probono.map(function (row) {
      return { href: '#' + row[0], title: row[1], meta: row[2] + ' @ ' + row[3] };
    })}
  ]));

  probono.forEach(function (row, i) {
    book.push(doc(row[0], 'Pro bono', row[1], [
      { type: 'image', src: row[5], alt: row[6] },
      { type: 'h', text: row[1] },
      { type: 'lede', text: row[2] + '. ' + row[3] + '.' },
      { type: 'note', text: row[7].join(' · ') },
      { type: 'actions', items: [{ href: row[4], label: 'Open the platform' }] }
    ], { num: String(i + 1).padStart(2, '0') }));
  });

  const stages = [
    ['osaka', '10.08', 'Osaka', '2026.10.08', 'Osaka Metropolitan University · Morinomiya', 'What happens after the pilot works — and why the constraint is institutional, not technical.', 'images/osaka-keynote.jpg', 'Dr. Non speaking at the Osaka Asia Roundtable 2026', [['3', 'Sessions'], ['7 min', 'On record'], ['4', 'Delegations']]],
    ['shanghai', '09.22', 'Shanghai', '2026.09.22', 'Tomorrow.City Shanghai 2026 · Zhangjiang Science Hall', 'Stop calling it a digital twin — call it God Mode. Raw speed, to cubic metres, to freeboard, to whether the water fits.', 'images/shanghai-stage-screen.jpg', 'Tomorrow.City Shanghai — FloodDash running live on the cube screen', [['4th', 'On this stage'], ['9', 'Data sources'], ['4', 'Takeaways']]],
    ['hong-kong', '07.10', 'Hong Kong', '2026.07.10', 'LEAP East 2026 · Orbital Stage · HKCEC', 'From Congestion to Connection. FloodDash launched live — a Thailand flood watch, 24/7, nine public sources.', 'images/leap-east-panel-speakers.png', 'Dr. Non on the Orbital Stage panel at LEAP East 2026, Hong Kong', [['Orbital', 'Stage tier'], ['4', 'Speakers'], ['9', 'Live sources']]],
    ['singapore', '04', 'Singapore', '2026.04', 'GITEX AI Asia · Marina Bay Sands · Main Stage', 'A main-stage keynote, then a workshop that filled in minutes. The hallway was full. Every face was on the demo.', 'images/singapore-workshop.jpg', 'Dr. Non at the lectern, GITEX AI Asia 2026, Singapore', [['1K+', 'Main stage'], ['23K+', 'Attendees'], ['Full', 'Workshop']]],
    ['taipei', '03.18', 'Taipei', '2026.03.18', 'Smart City Summit & Expo · City Vision stage', 'A working surface, built in the room, not concept art. 174 cities, 53 nations, ranking logic you can adjust.', 'images/taipei-stage.jpg', 'Dr. Non on the City Vision stage in Taipei', [['174', 'Cities'], ['53', 'Nations'], ['45 min', 'To build']]]
  ];

  book.push(doc('stages', 'Stages', 'Proven in public', [
    { type: 'h', text: 'Proven in public' },
    { type: 'lede', text: 'Five stages across Asia in 2026. Each one had a system running live in the room — SLIC Index in Taipei, FloodDash in Singapore, Shanghai, and Hong Kong, DEPA in Osaka.' },
    { type: 'plate', plate: 'stages' },
    { type: 'figs', rows: [
      { v: '5', l: 'Stops', t: 'Osaka, Shanghai, Hong Kong, Singapore, Taipei.' },
      { v: '5', l: 'Cities', t: 'One thesis, carried into a different room each time.' },
      { v: '13', l: 'Photographs', t: 'From the stage, not from a stock library.' }
    ]},
    { type: 'rows', items: stages.map(function (row) {
      return { href: '#' + row[0], title: row[2], meta: row[3] + ' @ ' + row[4].split(' @ ')[0] };
    })},
    { type: 'note', text: 'Every date comes from the organiser’s agenda. Nothing here is asserted without one.' }
  ]));

  stages.forEach(function (row) {
    book.push(doc(row[0], 'Stages', row[2], [
      { type: 'image', src: row[6], alt: row[7] },
      { type: 'h', text: row[2] },
      { type: 'lede', text: row[5] },
      { type: 'note', text: row[3] + ' · ' + row[4] },
      { type: 'figs', rows: row[8].map(function (f) { return { v: f[0], l: f[1], t: '' }; }) }
    ], { num: row[1], locator: row[3] }));
  });

  const notes = [
    ['note-1', 'The vendor said no. We shipped in fourteen days.', 'Every system here started because a procurement cycle, a vendor quote, or a committee called the problem too complex or too expensive. The answer was not a better argument. It was a rough working version, in the room. A live surface changes the conversation faster than a proposal.'],
    ['note-2', 'AI-native is not AI-assisted.', 'Every line of code across these systems was written by Claude Code, directed by Dr Non. The model is the engineer. The human is the architect. Directing a model precisely is the skill that compounds. The code is not the hard part.'],
    ['note-3', 'The problem is never the data.', 'It is the decision behind the data. Clients ask for a dashboard. What they need is one decision that must get faster or better. Find that first. Feeds, stack, and interface follow. Skip it, and you build a beautiful screen nobody opens after launch week.'],
    ['note-4', 'An org chart is not a team.', 'It tells you who reports to whom. It tells you nothing about who should build what, with whom. TKCX was built on that gap: archetypes, readiness, and a Moneyball salary cap. Treat talent as a portfolio, not a headcount.'],
    ['note-5', 'A single model answers. A council deliberates.', 'For decisions that matter, one model gives you one framing — the one in its training. The AI Council runs eleven justices with different priors, explicit moves, and a shared transcript. The disagreement is the product. You leave with a position you can defend.'],
    ['note-6', 'Instrument from day one.', 'Not after. Every Axiom system ships with a trail: pageviews, use, decision logs. Not because day one needs a dashboard of itself, but because measuring a live system later is close to impossible. The next version is built from what the first one taught. Leave a record.']
  ];

  // Under each note, two objects: an artwork that stands for the claim, and a
  // drawing of the claim. The caption names what the drawing is asserting, so
  // the figure is never asked to speak for itself.
  const duoCaption = {
    'note-1': 'Both lanes begin with the same request. Only one of them arrives anywhere.',
    'note-2': 'Direction runs left to right. The dashed return is the step that is usually skipped.',
    'note-3': 'The same four things, in a different order. The decision is the only one that comes first.',
    'note-4': 'The tree gives the chain of command. The grid gives the work. They are not the same shape.',
    'note-5': 'One model returns one line. Eleven priors return a spread, and the spread is what you read.',
    'note-6': 'The loop closes on day one. The shortcut is the one that cannot be taken back later.'
  };

  notes.forEach(function (row, i) {
    book.push(doc(row[0], 'Field notes', row[1], [
      { type: 'h', text: row[1] },
      { type: 'lede', text: row[2] },
      { type: 'duo', plate: row[0], diagram: row[0], caption: duoCaption[row[0]] }
    ], { num: String(i + 1).padStart(2, '0') }));
  });

  book.push(doc('stack', 'Field notes', 'The desk', [
    { type: 'h', text: 'The desk' },
    { type: 'lede', text: 'Local first. No build team. No vendor lock-in. One machine in Bangkok runs inference, builds, and deploys.' },
    { type: 'note', text: 'Nine layers. Heavier type marks the tools in daily use. “Cloud” marks what does not run on the desk.' },
    { type: 'duo', plate: 'stack', diagram: 'stack', caption: 'Everything runs in one room. Whatever does not run in the room is marked as such.' },
    { type: 'stack' }
  ], { num: '07' }));

  book.push(doc('non', 'Founders', 'Dr. Non Arkaraprasertkul', [
    { type: 'h', text: 'Dr. Non Arkaraprasertkul' },
    { type: 'lede', text: 'Co-founder. Systems and story. Anthropologist, architect, builder. He watches how a city actually behaves, then turns that into an interface people use without a manual.' },
    { type: 'plate', plate: 'non' },
    { type: 'p', text: 'PhD in Anthropology, Harvard. MIT and Oxford. Former visiting lecturer at MIT, postdoctoral fellow at NYU. He designs from fieldwork, because people are not spreadsheets and cities are not slides.' },
    { type: 'note', text: 'PhD · Harvard · MPhil · Oxford · MSc · MIT · Visiting lecturer · MIT' },
    { type: 'steps', items: [
      { t: 'Now', d: 'Senior Expert in Smart City Promotion, Digital Economy Promotion Agency (depa), Bangkok, since May 2019. Advisor to Thailand Media Fund, SLIC, NXPO, and the National Strategic Taskforce on the Northern Economic Corridor.' },
      { t: 'Education', d: 'PhD in Anthropology, Harvard, 2016. MA in Anthropology, Harvard, 2015. MPhil in Modern Chinese Studies, Oxford, 2010. MSc in Architecture Studies and Urban Design Certificate, MIT, 2007. BArch, First Class Honours, KMITL, 2004.' },
      { t: 'Selected roles', d: 'Visiting lecturer, MIT, architecture and urban design. Global postdoctoral fellow, NYU Shanghai. Expert-in-residence, urban anthropology, IDEO Shanghai. Honorary senior lecturer, University of Sydney. Rectorial visiting professor, Jagiellonian University, Kraków. Expert, product and service design, True Digital Group. Teaching fellow, Harvard.' },
      { t: 'Scale', d: '120+ technology and public-private projects across 77 Thai provinces. 5,000+ officials trained in digital literacy and smart city practice. 300+ keynotes. 50+ publications, including Urban Studies and the Journal of Urban Design.' },
      { t: 'Awards', d: 'Tomorrow City China Leaders’ Award, 2025. ASOCIO Best Project (DX), 2024. Smart City Expo World Congress, Global Leadership Award, 2024. Taiwan Presidential Hackathon, Excellent Team, international track, 2023. Expo 2020 Dubai Future Water Hack, first prize, 2022.' }
    ]},
    { type: 'actions', items: [
      { href: 'https://www.researchgate.net/profile/Non-Arkaraprasertkul', label: 'ResearchGate' },
      { href: 'https://www.linkedin.com/in/drnon/', label: 'LinkedIn' },
      { href: 'https://www.harvard-yenching.org/person/non-arkaraprasertkul/', label: 'Harvard-Yenching' },
      { href: 'https://www.depa.or.th/en/article-view/20220807_05', label: 'depa' }
    ]}
  ]));

  book.push(doc('poon', 'Founders', 'Dr. Poon Thiengburanathum', [
    { type: 'h', text: 'Dr. Poon Thiengburanathum' },
    { type: 'lede', text: 'Co-founder. Infrastructure and delivery. Engineer, strategist, the person who keeps ambition tied to a system that survives contact with the city.' },
    { type: 'plate', plate: 'poon' },
    { type: 'p', text: 'Associate professor at Chiang Mai University. Co-author of Chiang Mai’s Smart City Master Plan. He works on cities as complex adaptive systems — bus prediction, transit decisions, infrastructure that has to last.' },
    { type: 'note', text: 'PhD · civil engineering · Associate professor · Chiang Mai University' },
    { type: 'steps', items: [
      { t: 'Now', d: 'Deputy Director, Program Management Unit for Area-Based Development (PMU-A), Ministry of Higher Education, Science, Research and Innovation. Director, Excellence Center for Urban Study and Public Policy, Chiang Mai University.' },
      { t: 'Education', d: 'B.Eng. in Civil Engineering, Chiang Mai University, 1995. M.S. in Construction Management, University of Colorado at Boulder, 1997. Ph.D. in Construction Management, Colorado at Boulder, 2003. M.S. in Transportation Engineering, Colorado at Denver, 2003.' },
      { t: 'Practice', d: 'Civil engineering, construction management, sustainable infrastructure, climate, disaster, logistics, urban planning, mobility, and transport.' },
      { t: 'Selected work', d: 'Head of the Sustainable Infrastructure and Climate Change Research Unit, Chiang Mai University, since 2010. Lead coordinator, Research University Network for climate and disaster, since 2015. Bus rapid transit and mass-transport studies in Chiang Mai. Land use, logistics, and transport with the World Bank. Green logistics and renewable energy for agriculture and industry. Disaster management for critical infrastructure and supply chains.' }
    ]},
    { type: 'actions', items: [
      { href: 'https://www.researchgate.net/profile/Poon-Thiengburanathum', label: 'ResearchGate' }
    ]}
  ]));

  book.push(doc('collective', 'Founders', 'The collective', [
    { type: 'h', text: 'The collective, on call' },
    { type: 'lede', text: 'You talk to the two people who write the code and decide the architecture. When a mission needs someone else, that person joins for the mission. There is no standing bench.' },
    { type: 'plate', plate: 'collective' },
    { type: 'p', text: 'Researchers, traffic engineers, anthropologists, financiers, policy translators, media operators. Paid for the problem in front of us, not kept on an org chart waiting for one.' },
    { type: 'note', text: 'Traffic engineers · UAV operators · Economists · Financiers · Policy translators · Urban researchers · Media operators' }
  ]));

  book.push(doc('press', 'Press', 'Outside the room', [
    { type: 'h', text: 'Outside the room' },
    { type: 'lede', text: 'Read it. Watch it. Then decide.' },
    { type: 'plate', plate: 'press' },
    { type: 'rows', items: [
      { href: 'https://govinsider.asia/intl-en/article/with-the-vendor-saying-no-thai-civil-servant-built-his-own-tools', title: 'With the vendor saying no, a Thai civil servant built his own tools', meta: 'GovInsider · News' },
      { href: 'https://govinsider.asia/intl-en/article/can-innovation-as-a-service-close-the-gap-between-policy-and-implementation', title: 'Can innovation-as-a-service close the gap between policy and implementation?', meta: 'GovInsider · Feature' },
      { href: 'https://mayorsofeurope.eu/news/they-built-the-index-but-you-build-the-ranking/', title: 'They built the index, but you build the ranking', meta: 'Mayors of Europe' },
      { href: 'https://theaseanmagazine.asean.org/article/non-arkaraprasertkul-phd/', title: 'On digital connectivity, open innovation, and why a smart city only works when inclusion scales', meta: 'The ASEAN Magazine' },
      { href: 'https://www.youtube.com/watch?v=NC11q3zM6x4', title: 'How AI is mining city data cheaply, and making cities sharper', meta: 'YouTube' },
      { href: 'https://technode.global/2023/01/18/a-smart-city-cannot-exist-without-its-citizens-and-technological-advances-will-foster-stronger-trust-between-citizens-and-institutions-and-encourage-civic-participation-says-dr-non-arkaraprasertkul/', title: 'A smart city cannot exist without its citizens', meta: 'TechNode Global' }
    ]}
  ]));

  const sheets = [
    ['01', 'Cover', 'The introduction', 'corporate-identity/axiom-brand-01-cover.png'],
    ['02', 'Logo', 'The mark, and how it is used', 'corporate-identity/axiom-brand-02-logo.png'],
    ['03', 'Colour', 'The palette', 'corporate-identity/axiom-brand-03-colors.png'],
    ['04', 'Type', 'The type system', 'corporate-identity/axiom-brand-04-typography.png'],
    ['05', 'Layout', 'Grid and spacing', 'corporate-identity/axiom-brand-05-layout.png'],
    ['06', 'Applications', 'The mark in use', 'corporate-identity/axiom-brand-06-applications.png'],
    ['07', 'Photography', 'How the work is pictured', 'corporate-identity/axiom-brand-07-photography.png'],
    ['08', 'Voice', 'Tone and language', 'corporate-identity/axiom-brand-08-voice.png']
  ];

  book.push(doc('brand', 'Brand', 'Eight sheets', [
    { type: 'h', text: 'Eight sheets' },
    { type: 'lede', text: 'Cover, logo, colour, type, layout, use, photography, voice. Take the kit, or read it here one sheet at a time.' },
    { type: 'actions', items: [
      { href: media('axiom-brand-kit.zip'), label: 'Download the brand kit' },
      { href: media('assets/AXIOM_Corporate_Identity_Manual.pdf'), label: 'Identity manual' },
      { href: media('assets/AXIOM_Quick_Reference.pdf'), label: 'Quick reference' }
    ]}
  ]));

  sheets.forEach(function (row) {
    book.push(doc('brand-' + row[0], 'Brand', row[1], [
      { type: 'image', src: row[3], alt: 'Axiom brand sheet — ' + row[1] },
      { type: 'h', text: row[1] },
      { type: 'lede', text: row[2] }
    ], { num: row[0] }));
  });

  book.push(doc('entity', 'Record', 'Axiom X Co., Ltd.', [
    { type: 'h', text: 'Axiom X Co., Ltd.' },
    { type: 'lede', text: 'The work operates as Axiom. The registered entity is Axiom X Co., Ltd., in Thailand.' },
    { type: 'plate', plate: 'entity' },
    { type: 'defs', rows: [
      { k: 'Thai name', v: 'บริษัท แอคเซี่ยม เอ็กซ์ จำกัด', lang: 'th' },
      { k: 'English name', v: 'Axiom X Co., Ltd.' },
      { k: 'Registration', v: '0105569099335' },
      { k: 'Registered', v: '28 May 2026 (28 พ.ค. 2569)' },
      { k: 'Jurisdiction', v: 'Kingdom of Thailand' },
      { k: 'Address', v: '16 Soi Phahonyothin 59 Yaek 1, Anusawari, Bang Khen, Bangkok' },
      { k: 'Authority', v: 'Department of Business Development, Ministry of Commerce' },
      { k: 'Capital', v: 'THB 1,000,000' },
      { k: 'Scope', v: 'Technology, AI, digital systems, smart-city consulting, innovation services' }
    ]},
    { type: 'actions', items: [
      { href: media('axiom-company-registration-certificate.pdf'), label: 'Registration certificate' }
    ]}
  ]));

  book.push(doc('standards', 'Record', 'Standards, by practice', [
    { type: 'h', text: 'Standards, by practice' },
    { type: 'lede', text: 'We design and deliver against these frameworks. This is operational alignment. It is not a claim of ISO certification, unless an independent audit is named.' },
    { type: 'plate', plate: 'standards' },
    { type: 'groups', groups: [
      { title: 'Foundations', items: [
        { text: 'ISO/IEC 30173:2023 — digital twin concepts', href: 'https://www.iso.org/standard/44290.html' },
        { text: 'ISO 23247 — digital twin framework', href: 'https://www.iso.org/standard/75066.html' },
        { text: 'IEC / ISO / IEEE digital-twin ecosystem' },
        { text: 'NIST digital twin programme', href: 'https://www.nist.gov/el' }
      ]},
      { title: 'Governance', items: [
        { text: 'ISO/IEC JTC 1 — the ICT standards base' },
        { text: 'Interoperability and data-exchange frameworks' },
        { text: 'ISO/IEC 42001 — AI management', href: 'https://www.iso.org/standard/81230.html' },
        { text: 'ISO/IEC 23894 — AI risk', href: 'https://www.iso.org/standard/77304.html' },
        { text: 'NIST AI Risk Management Framework', href: 'https://www.nist.gov/itl/ai-risk-management-framework' }
      ]},
      { title: 'Law', items: [
        { text: 'PDPA — Thailand Personal Data Protection Act' },
        { text: 'GDPR — advisory alignment for work that faces Europe' },
        { text: 'Sector privacy and trust rules, as the engagement requires' }
      ]},
      { title: 'Ethics', items: [
        { text: 'OECD AI Principles', href: 'https://www.oecd.org/en/topics/ai-principles.html' },
        { text: 'UNESCO Recommendation on the Ethics of AI', href: 'https://www.unesco.org/en/artificial-intelligence/recommendation-ethics' },
        { text: 'Transparency, fairness, human oversight' },
        { text: 'Safety, robustness, accountable deployment' }
      ]}
    ]},
    { type: 'p', text: 'A working reference stack: ISO/IEC 30173, ISO 23247, ISO/IEC 42001, ISO/IEC 23894, PDPA, GDPR.' },
    { type: 'note', text: 'Alignment means the work is designed and run to these frameworks. It does not mean a certificate, an accreditation, or a third-party audit, unless that audit is stated and shown.' }
  ]));

  // Every published number, stated once. All of these are derived from the
  // catalogue rather than kept by hand — the previous version of this page
  // listed four different system counts because they were typed in.
  const liveCount = systems.filter(function (s) { return s.status === 'Live'; }).length;
  const byCluster = systems.reduce(function (acc, s) {
    acc[s.cluster] = (acc[s.cluster] || 0) + 1; return acc;
  }, {});

  book.push(doc('ledger', 'Record', 'The record', [
    { type: 'h', text: 'The record' },
    { type: 'lede', text: 'Every number on this site, stated once. None of them is typed in — they are read from the catalogue, so none of them can drift.' },
    { type: 'plate', plate: 'ledger' },
    { type: 'defs', rows: [
      { k: 'Systems', v: systems.length + ' entries, all of them listed in the index to your left.' },
      { k: 'Live', v: liveCount + ' are marked Live. The rest are marked Preview, Soon or Dev, and say so on their entry.' },
      { k: 'By group', v: Object.keys(byCluster).sort(function (a, b) { return byCluster[b] - byCluster[a]; }).map(function (k) { return k + ' ' + byCluster[k]; }).join(' · ') },
      { k: 'Countries', v: 'Five. Bangkok, Phuket and the Gulf, Taipei, the Middle East, and Southeast Asia at scale.' },
      { k: 'Public sources', v: '247+ named feeds across the live systems. Each is credited inside the system that reads it.' },
      { k: 'Following', v: '112K on the FloodDash brief — in public, in Thai, since the first flood.' },
      { k: 'Stages 2026', v: 'Five dated stops: Taipei, Singapore, Hong Kong, Shanghai, Osaka. Each carries the organiser’s date, not ours.' }
    ]},
    { type: 'note', text: 'Case-specific observations are not a guarantee of the next one. Sandbox numbers are a reading, not a verdict.' }
  ]));

  book.push(doc('brief', 'Brief', 'Tell us the decision', [
    { type: 'h', text: 'Tell us the decision' },
    { type: 'lede', text: 'We will show it working in two weeks.' },
    { type: 'plate', plate: 'brief' },
    { type: 'p', text: 'Write one paragraph: the decision that has to get faster, who makes it, and where the data sits today. You will get a clear yes, a clear no, or one sharper question. No sales deck. No procurement warm-up.' },
    { type: 'steps', items: [
      { t: 'Week 1', d: 'The decision, the people, and the data, agreed on one page.' },
      { t: 'Week 2', d: 'A working pilot on data you have, and on free public data. No new hardware to start.' },
      { t: 'From day one', d: 'Every use and every decision logged, so you scale only what is proven.' }
    ]},
    { type: 'actions', items: [
      { href: 'mailto:non@nonarkara.org?subject=Brief%20%E2%80%94%20Two-Week%20Proof', label: 'non@nonarkara.org' },
      { href: 'https://www.linkedin.com/company/axiomthailand/', label: 'LinkedIn' },
      { href: 'https://www.linkedin.com/showcase/slic-index/', label: 'SLIC Index' }
    ]},
    { type: 'note', text: 'Bangkok · Southeast Asia' }
  ]));

  book.push(doc('plates', 'Colophon', 'The plates', [
    { type: 'h', text: 'The plates' },
    { type: 'lede', text: 'No screenshots on the system pages. Each one carries a work of art instead.' },
    { type: 'plate', plate: 'plates' },
    { type: 'p', text: 'On 6 October 2011 the German daily DIE WELT handed a whole edition to the painter Ellsworth Kelly. It ran without a single news photograph; his cycle of colour and form ran from the first page to the last, beside the ordinary columns of type. The edition won gold at the 2012 LeadAwards. It was the second of the paper\u2019s artist editions, after Georg Baselitz in 2010.' },
    { type: 'p', text: 'This book borrows the idea, not the pictures. Kelly\u2019s work is still in copyright, so every plate here is public domain or CC0: Renaissance frescoes, ukiyo-e prints, early abstraction, sculpture, a colour theory, a geometry book. Each sits beside a system because it says something true about it. The screenshots are one click away, behind Open.' },
    { type: 'note', text: 'Pro bono entries keep their own photographs. That work belongs to the institutions it was done for.' },
    { type: 'rows', items: [
      { href: 'https://www.axelspringer.com/de/ax-press-release/die-welt-des-ellsworth-kelly', title: 'DIE WELT des Ellsworth Kelly (3 Oct 2011)', meta: 'Axel Springer' },
      { href: 'https://www.axelspringer.com/de/ax-press-release/leadawards-2012-auszeichnungen-in-gold-und-bronze-fuer-medienmarken-von-axel-springer', title: 'LeadAwards 2012: gold for the Kelly edition', meta: 'Axel Springer' },
      { href: 'https://www.lesershop24.de/die-welt/kuenstlerausgaben-uebersicht', title: 'DIE WELT artist editions since 2010', meta: 'WELT' }
    ]},
    { type: 'credits' }
  ]));

  book.push(doc('colophon', 'Colophon', 'Colophon', [
    { type: 'h', text: 'Colophon' },
    { type: 'plate', plate: 'colophon' },
    { type: 'p', text: 'Axiom builds decision systems for cities, governments, and operators, to ISO/IEC digital-twin practice, AI governance, and data-protection frameworks.', lang: 'en' },
    { type: 'p', text: 'Axiom สร้างแดชบอร์ดเมืองอัจฉริยะและระบบข้อมูลเพื่อการตัดสินใจสำหรับเมือง หน่วยงานรัฐ และผู้บริหารทั่วอาเซียน — ระบบที่ใช้งานได้จริงในการปฏิบัติงาน ไม่ใช่เพียงสไลด์นำเสนอ', lang: 'th' },
    { type: 'p', text: 'ก่อตั้งและนำโดย ดร.นน อัครประเสริฐกุล ผู้เชี่ยวชาญอาวุโส ฝ่ายส่งเสริมเมืองอัจฉริยะ สำนักงานส่งเสริมเศรษฐกิจดิจิทัล (depa) — ที่ปรึกษาและวิทยากรด้านเมืองอัจฉริยะ การวิเคราะห์ข้อมูลเมือง และการเปลี่ยนผ่านสู่ดิจิทัลของภาครัฐ', lang: 'th' },
    { type: 'steps', items: [
      { t: 'Reference, not a certificate', d: 'Digital twin and interoperability: ISO/IEC 30173, ISO 23247, NIST. AI governance and risk: ISO/IEC 42001, ISO/IEC 23894, NIST AI RMF, OECD AI Principles. Privacy: PDPA, and GDPR-informed practice. Compliance is specific to the engagement. No ISO certification, accreditation, or third-party audit is claimed unless it is stated.' },
      { t: 'Sandbox', d: 'Systems you can open here use illustrative and public data. They are not legal, financial, or investment advice. Production systems under NDA may differ. Treat every metric as a hint. A real decision still needs the authority that owns the source. Axiom is not liable for a decision made on sandbox data.' },
      { t: 'Data', d: 'Sandbox feeds include TMD, GISTDA, JICA, NBTC, the Pollution Control Department, OpenStreetMap, TomTom, and other public or open-licensed sources, credited inside each system. Commercial feeds — Air4Thai o61, 33V, 34T, Naver CFT — are named in the system that uses them.' },
      { t: 'Use', d: 'Use the work lawfully. Do not republish screenshots, dashboards, model outputs, or system internals without written permission. Axiom and the system names are trade names of Axiom X Co., Ltd.' },
      { t: 'Privacy', d: 'The previous public site used Cloudflare for aggregate traffic. This page sets no advertising cookies and does not sell visitor data. A host may still process request metadata. Linked systems have their own privacy policies.' },
      { t: 'Law', d: 'These terms are governed by the laws of the Kingdom of Thailand. Disputes sit with the courts of Bangkok. Where a translation disagrees with this English text, the English text prevails.' },
      { t: 'This page', d: 'A reading room for the same record as axiom.nonarkara.org. Built as a static page. Client systems stay private. Source of the original record: github.com/Nonarkara/Axiom.' }
    ]},
    { type: 'actions', items: [
      { href: 'https://axiom.nonarkara.org/', label: 'axiom.nonarkara.org' },
      { href: 'https://github.com/Nonarkara/Axiom', label: 'Source' },
      { href: 'https://nonarkara-blog.pages.dev/', label: 'Blog' },
      { href: 'https://www.linkedin.com/company/axiomthailand/', label: 'LinkedIn' },
      { href: 'https://www.linkedin.com/showcase/slic-index/', label: 'SLIC Index' }
    ]},
    { type: 'note', text: 'Bangkok · Southeast Asia. © 2026 Axiom X Co., Ltd. Figures on this site are case-specific. They are not a promise of the next case.' }
  ]));

  // Which artworks does the book actually mount? A plate that exists in
  // plates.js but is wired into no page is a file nobody ever sees, so the list
  // of live plates is derived here and read by the QA harness.
  const bookPlates = [];
  book.forEach(function (entry) {
    (entry.blocks || []).forEach(function (block) {
      if (block.plate && bookPlates.indexOf(block.plate) === -1) bookPlates.push(block.plate);
      (block.items || []).forEach(function (item) {
        if (item && item.plate && bookPlates.indexOf(item.plate) === -1) bookPlates.push(item.plate);
      });
    });
  });
  window.AXIOM_BOOK_PLATES = bookPlates;

  function visible() {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return book;
    return book.filter(function (entry) {
      const hay = (entry.search || '').toLowerCase();
      const title = localizedTitle(entry).toLowerCase();
      const group = t('groups.' + entry.group, entry.group).toLowerCase();
      let locLede = '';
      if (entry.kind === 'system') {
        const locSys = (I18N.systems?.[currentLocale] || {})[entry.id];
        if (locSys && locSys.lede) locLede = locSys.lede.toLowerCase();
      }
      return words.every(function (word) {
        return hay.indexOf(word) !== -1 || title.indexOf(word) !== -1 || group.indexOf(word) !== -1 || locLede.indexOf(word) !== -1;
      });
    });
  }

  function renderIndex() {
    const list = visible();
    nav.replaceChildren();
    if (!list.length) {
      nav.appendChild(el('p', 'empty', t('empty', 'Nothing under that name.')));
    } else {
      let group = null;
      let box = null;
      list.forEach(function (entry) {
        const transGroup = t('groups.' + entry.group, entry.group);
        if (transGroup !== group) {
          group = transGroup;
          box = el('section', 'group');
          const count = list.filter(function (item) { return t('groups.' + item.group, item.group) === group; }).length;
          const h = el('h2', '', group);
          h.appendChild(el('span', '', String(count)));
          box.appendChild(h);
          nav.appendChild(box);
        }
        const btn = el('button', 'item');
        btn.type = 'button';
        btn.dataset.id = entry.id;
        btn.appendChild(el('span', 'num', entry.num || ''));
        btn.appendChild(el('span', 'lb', localizedTitle(entry)));
        if (entry.id === current) btn.setAttribute('aria-current', 'true');
        box.appendChild(btn);
      });
    }
    if (query.trim()) {
      findCount.hidden = false;
      findCount.textContent = String(list.length);
    } else {
      findCount.hidden = true;
      findCount.textContent = '';
    }
  }

  function addSteps(items) {
    const wrap = el('div', 'rule-list rule-list--prose');
    items.forEach(function (item, i) {
      const row = el('div', 'numbered');
      row.appendChild(el('div', 'n', String(i + 1).padStart(2, '0')));
      row.appendChild(el('h2', '', item.t));
      row.appendChild(el('p', '', item.d));
      if (item.plate && PLATES[item.plate]) addPlate(item.plate, PLATES[item.plate], row);
      wrap.appendChild(row);
    });
    plate.appendChild(wrap);
  }

  function addFigs(rows) {
    const wrap = el('div', 'rule-list');
    rows.forEach(function (row) {
      const line = el('div', row.t ? 'fig' : 'fig fig--pair');
      line.appendChild(el('b', '', row.v));
      line.appendChild(el('i', '', row.l));
      if (row.t) line.appendChild(el('span', '', row.t));
      wrap.appendChild(line);
    });
    plate.appendChild(wrap);
  }

  function addActions(items) {
    const row = el('div', 'actions');
    items.forEach(function (item) { row.appendChild(link(item.href, item.label)); });
    plate.appendChild(row);
  }

  function renderDoc(entry) {
    const locDoc = (I18N.docs?.[currentLocale] || {})[entry.id];
    let blocks = entry.blocks;
    if (locDoc && locDoc.blocks) {
      blocks = locDoc.blocks;
    } else if (locDoc) {
      let pIdx = 0;
      blocks = (entry.blocks || []).map(function (b) {
        if (b.type === 'poster' && locDoc.poster) return Object.assign({}, b, { text: locDoc.poster, em: locDoc.posterEm || b.em });
        if (b.type === 'h' && locDoc.title) return Object.assign({}, b, { text: locDoc.title });
        if (b.type === 'lede' && locDoc.lede) return Object.assign({}, b, { text: locDoc.lede });
        if (b.type === 'steps' && locDoc.steps) return Object.assign({}, b, { items: locDoc.steps });
        if (b.type === 'figs' && locDoc.figs) return Object.assign({}, b, { rows: locDoc.figs });
        if (b.type === 'p') {
          pIdx++;
          const pKey = 'p' + pIdx;
          if (locDoc[pKey]) return Object.assign({}, b, { text: locDoc[pKey] });
          if (Array.isArray(locDoc.paragraphs) && locDoc.paragraphs[pIdx - 1]) return Object.assign({}, b, { text: locDoc.paragraphs[pIdx - 1] });
        }
        if (b.type === 'note' && locDoc.note) return Object.assign({}, b, { text: locDoc.note });
        return b;
      });
    }

    (blocks || []).forEach(function (block) {
      if (block.type === 'poster') {
        const h = el('h1', 'poster', block.text);
        if (block.em) h.appendChild(el('em', '', block.em));
        plate.appendChild(h);
      } else if (block.type === 'h') {
        plate.appendChild(el('h1', 'name', block.text));
      } else if (block.type === 'lede') {
        plate.appendChild(el('p', 'lede inset', block.text));
      } else if (block.type === 'p' || block.type === 'note') {
        const p = el('p', (block.type === 'note' ? 'note' : 'prose') + ' inset', block.text);
        if (block.lang) p.lang = block.lang;
        plate.appendChild(p);
      } else if (block.type === 'steps') {
        addSteps(block.items);
      } else if (block.type === 'figs') {
        addFigs(block.rows);
      } else if (block.type === 'actions') {
        addActions(block.items);
      } else if (block.type === 'credits') {
        const wrap = el('div', 'rule-list');
        systems.forEach(function (s) {
          const art = PLATES[s.id];
          if (!art) return;
          const a = link(art[4], '', 'row');
          const text = el('span');
          text.appendChild(el('b', '', s.name));
          text.appendChild(el('i', '', art[0] + ', ' + art[1] + ', ' + art[2] + ' \u00b7 ' + art[5]));
          a.appendChild(text);
          a.appendChild(el('span', '', '\u2197'));
          wrap.appendChild(a);
        });
        plate.appendChild(wrap);
      } else if (block.type === 'clip') {
        addClip(block.clip);
      } else if (block.type === 'vstudio') {
        addVideoStudio(block.caption);
      } else if (block.type === 'hero') {
        const art = PLATES[block.plate];
        if (art) addHero(block.plate, art);
      } else if (block.type === 'plate') {
        const art = PLATES[block.plate];
        if (art) addPlate(block.plate, art);
      } else if (block.type === 'image') {
        const img = el('img', 'shot');
        img.src = media(block.src);
        img.alt = block.alt || '';
        img.addEventListener('error', function () { img.remove(); });
        plate.appendChild(img);
      } else if (block.type === 'duo') {
        addDuo(block);
      } else if (block.type === 'defs') {
        const wrap = el('div', 'rule-list');
        block.rows.forEach(function (row) {
          const line = el('div', 'def');
          line.appendChild(el('div', '', row.k));
          const val = el('div', '', row.v);
          if (row.lang) val.lang = row.lang;
          line.appendChild(val);
          wrap.appendChild(line);
        });
        plate.appendChild(wrap);
      } else if (block.type === 'rows') {
        const wrap = el('div', 'rule-list');
        block.items.forEach(function (item) {
          const a = link(item.href, '', 'row');
          const text = el('span');
          const title = el('b', '', item.title);
          // The arrow is a signifier on the title's line. In a column of its
          // own it left 92px of nothing under it in every multi-line row.
          title.appendChild(el('span', 'row__arrow', '↗'));
          text.appendChild(title);
          text.appendChild(el('i', '', item.meta));
          a.appendChild(text);
          wrap.appendChild(a);
        });
        plate.appendChild(wrap);
      } else if (block.type === 'groups') {
        block.groups.forEach(function (group) {
          const box = el('section', 'group-block inset');
          box.appendChild(el('h2', '', group.title));
          const ul = el('ul');
          group.items.forEach(function (item) {
            const li = el('li');
            if (item.href) li.appendChild(link(item.href, item.text));
            else li.textContent = item.text;
            ul.appendChild(li);
          });
          box.appendChild(ul);
          plate.appendChild(box);
        });
      } else if (block.type === 'stack') {
        const wrap = el('div', 'rule-list');
        STACK.forEach(function (layer) {
          const line = el('div', 'layer');
          const head = el('div', 'layer__head');
          head.appendChild(el('h2', '', layer[0]));
          head.appendChild(el('p', '', layer[1]));
          line.appendChild(head);
          const tools = el('div', 'tools');
          layer[2].forEach(function (tool) {
            const node = tool[3] ? link(tool[3], tool[0], 'tool') : el('span', 'tool', tool[0]);
            if (tool[2]) node.classList.add('is-fav');
            if (tool[1]) node.appendChild(el('i', '', 'cloud'));
            tools.appendChild(node);
          });
          line.appendChild(tools);
          wrap.appendChild(line);
        });
        plate.appendChild(wrap);
      }
    });
  }

  function renderSystem(system) {
    const locSys = (I18N.systems?.[currentLocale] || {})[system.id] || {};
    const sysName = locSys.name || system.name;
    const sysLede = locSys.lede || system.lede;
    const sysCta = locSys.cta || system.cta || 'Open';

    const h = el('h1', 'name', sysName);
    plate.appendChild(h);
    if (sysLede) {
      plate.appendChild(el('p', 'lede inset', sysLede));
    }
    const actions = [];
    if (system.href) actions.push({ href: system.href, label: sysCta.replace(/\s*▸\s*$/, '') });
    if (system.edition && system.edition.href) actions.push(system.edition);
    if (actions.length) addActions(actions);

    const art = PLATES[system.id];
    if (art) {
      addPlate(system.id, art);
    } else if (system.img) {
      const img = el('img', 'shot');
      img.src = media(system.img);
      img.alt = system.alt || sysName;
      img.addEventListener('error', function () { img.remove(); });
      plate.appendChild(img);
    }

    // The ground condition, after the product shot. Any system may carry one.
    if (system.id === 'flood-ami') {
      addVideoStudio('The ground condition. Read from standing in it — every flood season since the first watch, in Thai, in public.');
    } else if (system.video) {
      addClip(system.video);
    }

    const arch = system.arch;
    if (arch && ((arch.inputs && arch.inputs.length) || (arch.outputs && arch.outputs.length) || arch.core)) {
      const grid = el('div', 'arch');
      [[t('inputs', 'Inputs'), arch.inputs || []], [arch.core ? arch.core.name : t('core', 'Engine'), arch.core ? (arch.core.meta || []) : []], [t('outputs', 'Outputs'), arch.outputs || []]].forEach(function (col) {
        if (!col[1].length) return;
        const section = el('section');
        section.appendChild(el('h2', '', col[0]));
        const ul = el('ul');
        col[1].forEach(function (item) { ul.appendChild(el('li', '', item)); });
        section.appendChild(ul);
        grid.appendChild(section);
      });
      if (grid.childElementCount) {
        grid.dataset.cols = String(grid.childElementCount);
        plate.appendChild(grid);
      }
    }

    const foot = [];
    if (arch && arch.foot) foot.push(arch.foot);
    if (arch && arch.stack && arch.stack.length) foot.push(arch.stack.join(' · '));
    if (foot.length) {
      plate.appendChild(el('p', 'note inset', foot.join('  ·  ')));
    }
    if (arch && arch.ai) {
      plate.appendChild(el('p', 'prose prose--ai inset', arch.ai));
    }
  }

  function neighbors(entry) {
    const list = visible();
    const i = list.findIndex(function (item) { return item.id === entry.id; });
    return {
      prev: i > 0 ? list[i - 1] : null,
      next: i >= 0 && i < list.length - 1 ? list[i + 1] : null
    };
  }

  function renderPlate(entry) {
    plate.replaceChildren();
    plate.scrollTop = 0;
    barKicker.textContent = t('groups.' + entry.group, entry.group);
    locatorNum.textContent = entry.num || '';
    locatorMeta.replaceChildren();
    if (entry.kind === 'system') {
      const locSys = (I18N.systems?.[currentLocale] || {})[entry.system.id] || {};
      const cat = locSys.cat || entry.system.cat;
      const status = entry.system.status;
      const statusLabel = t('status.' + status, status);
      const bits = [cat, entry.system.arch && entry.system.arch.ver ? 'v' + entry.system.arch.ver : ''].filter(Boolean);
      if (bits.length) locatorMeta.append(bits.join('  ·  '));
      if (status) {
        if (bits.length) locatorMeta.append('  ·  ');
        locatorMeta.appendChild(el('span', status === 'Live' ? 'is-live' : '', statusLabel));
      }
    } else if (entry.locator) {
      locatorMeta.textContent = entry.locator;
    }

    const href = entry.kind === 'system' ? entry.system.href : '';
    if (href) {
      barOpen.hidden = false;
      barOpen.href = href;
      barOpen.textContent = t('barOpen', 'Open');
    } else {
      barOpen.hidden = true;
      barOpen.removeAttribute('href');
    }

    if (entry.kind === 'system') renderSystem(entry.system);
    else renderDoc(entry);

    const near = neighbors(entry);
    const pager = el('nav', 'pager');
    pager.setAttribute('aria-label', 'Adjacent entries');
    if (near.prev) pager.appendChild(link('#' + near.prev.id, '← ' + localizedTitle(near.prev)));
    else pager.appendChild(el('span', '', ''));
    if (near.next) pager.appendChild(link('#' + near.next.id, localizedTitle(near.next) + ' →'));
    plate.appendChild(pager);

    const docTitle = localizedTitle(entry);
    document.title = entry.id === 'axiom' ? t('docTitlePitch', 'Axiom — Decision systems') : docTitle + ' — Axiom';
  }

  function paint(opts) {
    renderIndex();
    const entry = book.find(function (item) { return item.id === current; }) || book[0];
    current = entry.id;
    renderPlate(entry);
    const btn = nav.querySelector('[aria-current="true"]');
    if (btn && !(opts && opts.keepScroll)) btn.scrollIntoView({ block: 'nearest' });
  }

  function select(id, opts) {
    const entry = book.find(function (item) { return item.id === id; }) || book[0];
    current = entry.id;
    const next = '#' + current;
    const push = !opts || opts.push !== false;
    if (location.hash !== next) {
      if (push) history.pushState({ id: current }, '', next);
      else history.replaceState({ id: current }, '', next);
    }
    paint(opts);
    if (window.matchMedia('(max-width: 860px)').matches && (!opts || opts.open !== false)) {
      shell.classList.add('is-open');
      plate.focus();
    }
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('axiomx-theme', theme); } catch (err) { /* private mode */ }
    const label = theme === 'dark' ? t('themeLight', 'Light') : t('themeDark', 'Dark');
    themeBtn.textContent = label;
    themeBtn2.textContent = label;
    themeBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#111110' : '#faf9f7');
  }

  function setLocale(loc) {
    if (!loc || !['en', 'th', 'zh', 'ko', 'ja', 'vi'].includes(loc)) return;
    currentLocale = loc;
    try { localStorage.setItem('axiomx_locale', loc); } catch (e) {}
    document.documentElement.lang = loc === 'zh' ? 'zh-Hans' : loc;
    document.querySelectorAll('.locale-btn').forEach(function (btn) {
      const active = btn.dataset.locale === loc;
      btn.classList.toggle('is-active', active);
      if (active) btn.setAttribute('aria-current', 'true');
      else btn.removeAttribute('aria-current');
    });
    if (q) q.placeholder = t('searchPlaceholder', 'Find');
    const isDark = document.documentElement.dataset.theme === 'dark';
    const label = isDark ? t('themeLight', 'Light') : t('themeDark', 'Dark');
    if (themeBtn) themeBtn.textContent = label;
    if (themeBtn2) themeBtn2.textContent = label;
    if (backBtn) backBtn.textContent = t('back', 'Back');
    paint({ keepScroll: true });
  }

  nav.addEventListener('click', function (event) {
    const btn = event.target.closest('button[data-id]');
    if (!btn) return;
    select(btn.dataset.id);
  });

  q.addEventListener('input', function () {
    query = q.value;
    renderIndex();
  });

  backBtn.addEventListener('click', function () {
    shell.classList.remove('is-open');
  });

  themeBtn.addEventListener('click', function () {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });
  themeBtn2.addEventListener('click', function () {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  if (locale) {
    locale.addEventListener('click', function (event) {
      const btn = event.target.closest('button[data-locale]');
      if (!btn) return;
      setLocale(btn.dataset.locale);
    });
  }

  document.addEventListener('keydown', function (event) {
    const typing = event.target === q;
    if (event.key === 'Escape') {
      // First Escape clears a running search, wherever focus happens to be —
      // clicking a result leaves the box populated but unfocused, and blurring
      // alone would strand the reader in a filtered index with no way back.
      if (q.value) {
        q.value = '';
        query = '';
        renderIndex();
        if (typing) q.focus();
        return;
      }
      if (typing) q.blur();
      shell.classList.remove('is-open');
      return;
    }
    if (typing) return;
    if (event.key === '/') {
      event.preventDefault();
      q.focus();
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      const list = visible();
      const i = list.findIndex(function (item) { return item.id === current; });
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault();
        if (list[i + 1]) select(list[i + 1].id);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (list[i - 1]) select(list[i - 1].id);
      } else if (window.matchMedia('(max-width: 860px)').matches) {
        shell.classList.remove('is-open');
      }
    }
  });

  window.addEventListener('hashchange', function () {
    const id = decodeURIComponent(location.hash.replace(/^#/, '')) || 'axiom';
    if (id !== current) select(id, { push: false });
  });

  window.addEventListener('popstate', function () {
    select(decodeURIComponent(location.hash.replace(/^#/, '')) || 'axiom', { push: false });
  });

  let stored = 'light';
  try { stored = localStorage.getItem('axiomx-theme') || 'light'; } catch (err) { stored = 'light'; }
  setTheme(stored === 'dark' ? 'dark' : 'light');
  setLocale(currentLocale);
  select(decodeURIComponent(location.hash.replace(/^#/, '')) || 'axiom', { push: false, open: location.hash.length > 1 });
})();
