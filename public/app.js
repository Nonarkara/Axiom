/* ========================================
   AXIOM — Landing Page
   ======================================== */

// ── i18n ──────────────────────────────────────────────────────────

let activeLocale = 'en';

// Lightweight media-query helper (pre-existing axiomMedia was referenced
// but never defined; recreate it here so the satellite hero and data
// lines can still detect touch / reduced-motion / mobile).
const axiomMedia = (() => {
  if (typeof window === 'undefined') return { isTouch: false, isReduced: false, isMobile: false };
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const narrow = window.matchMedia?.('(max-width: 700px)').matches ?? false;
  return { isTouch: coarse, isReduced: reduced, isMobile: narrow };
})();

// ── System architecture popovers ────────────────────────────────────────────
// On hover (or on mobile tap), each .sys-cell[data-arch] gets a small
// floating diagram showing inputs → core → outputs. Architecture data
// lives here so the HTML stays clean.

// i18n helper for architecture text — looks up a flat key in the active
// locale's uiCopy, falling back to English, then to the supplied default.
function _t(key, fallback) {
  try {
    const copy = (typeof uiCopy !== 'undefined' && uiCopy) || {};
    const locale = (typeof activeLocale !== 'undefined' && activeLocale) || 'en';
    const cur = copy[locale] || {};
    if (typeof cur[key] === 'string') return cur[key];
    if (copy.en && typeof copy.en[key] === 'string') return copy.en[key];
  } catch (e) { /* ignore */ }
  return fallback;
}

const ARCHITECTURES = {
  // CITY DASHBOARDS
  'flood-ami': {
    name: 'FLOODDASH',
    ver: '2.4.1',
    idx: '23',
    inputs: ['NASA FIRMS', 'GISTDA', 'CEMS', 'HIMAWARI-9', 'TMD', 'Open-Meteo', 'OpenStreetMap', 'Tide stations', 'Rain gauges'],
    core: { name: 'FLOODDASH', meta: ['3–60 min refresh', '77 provinces'] },
    outputs: ['National map', 'Province detail', 'Watch list', '3-day forecast'],
    foot: '9 public sources · 24/7 · Thailand-wide',
  },
  'sikhio': {
    name: 'SIKHIO OPS',
    ver: '1.0.0',
    idx: '26',
    inputs: ['AQI sensors', 'Weather', 'Traffic', 'Live city data'],
    core: { name: 'SIKHIO', meta: ['town-scale', 'real-time'] },
    outputs: ['City pulse', 'Traffic patterns', 'Environmental reads'],
    foot: 'town-scale command room · Nakhon Ratchasima',
  },
  'lcbcity': {
    name: 'LAEM CHABANG',
    ver: '1.2.0',
    idx: '22',
    inputs: ['Truck GPS', 'Port traffic', 'Regulatory data', 'CCTV (where available)'],
    core: { name: 'LAEM CHABANG', meta: ['port + city', 'live'] },
    outputs: ['Truck monitor', 'Compliance tracker', 'Congestion alerts'],
    foot: 'Thailand Eastern Seaboard · port logistics',
  },
  'phuket': {
    name: 'PHUKET OPS',
    ver: '3.1.2',
    idx: '01',
    inputs: ['Transit', 'Public safety', 'Environmental signals', 'Tourism feeds'],
    core: { name: 'PHUKET OPS', meta: ['governor view', '30-second read'] },
    outputs: ['Unified ops room', 'Incident board', 'Alert timeline'],
    foot: 'governor-grade · Andaman coast',
  },
  'hcmc': {
    name: 'HCMCx',
    ver: '1.8.0',
    idx: '21',
    inputs: ['Traffic cameras', 'Flood sensors', 'Air quality', 'News / reports'],
    core: { name: 'HCMCx', meta: ['3D city map', 'metropolitan scale'] },
    outputs: ['Dynamic routing', 'Incident board', '3D city view'],
    foot: 'Ho Chi Minh City · metropolitan command',
  },
  'mtt': {
    name: 'MTT SUPER',
    ver: '2.0.1',
    idx: '33',
    inputs: ['IMPACT events', 'Flood gauges', 'Traffic / CWR', 'AQI', 'Parking', 'CCTV / feeds'],
    core: { name: 'MTT SUPER', meta: ['3D district twin', 'event load'] },
    outputs: ['Arena ops board', 'Flood alert', 'Layer stack', 'Guest load'],
    foot: 'Muang Thong Thani · IMPACT + Challenger',
  },
  'kuching': {
    name: 'KUCHING IOC',
    ver: '2.3.0',
    idx: '05',
    inputs: ['Foreign exchange', 'Flights', 'Satellite imagery', 'Environmental reads'],
    core: { name: 'KUCHING IOC', meta: ['full-spectrum', 'Sarawak'] },
    outputs: ['Cross-domain board', 'FX monitor', 'Flight log'],
    foot: 'Greater Kuching · IOC for the operator',
  },
  'chula': {
    name: 'CHULA TOWER',
    ver: '1.4.2',
    idx: '13',
    inputs: ['Traffic', 'Incidents', 'Air quality', 'Satellite', 'CU Shuttle', 'News', 'Emergency'],
    core: { name: 'CHULA TOWER', meta: ['47 live feeds', 'campus scale'] },
    outputs: ['3D campus map', 'Strategic alerts', 'Civic reports'],
    foot: 'Chulalongkorn University · Siam–Samyan',
  },
  'chonburi': {
    name: 'CHONBURI TOWER',
    ver: '1.5.0',
    idx: '16',
    inputs: ['Weather', 'Marine state', 'EEC news', 'CCTV / AIS / AQ / WX'],
    core: { name: 'CHONBURI TOWER', meta: ['20,877 3D buildings', 'mayor\'s desk'] },
    outputs: ['3D province render', 'Coastal watch', 'EEC trends'],
    foot: 'Eastern Seaboard · 3D command surface',
  },
  'kmitl': {
    name: 'KMITL TOWER',
    ver: '1.3.1',
    idx: '18',
    inputs: ['Traffic', 'Incidents', 'Air quality', 'Satellite', 'Shuttles', 'News', 'Emergency'],
    core: { name: 'KMITL TOWER', meta: ['56 live feeds', 'campus scale'] },
    outputs: ['3D campus map', 'Operational view', 'Civic reports'],
    foot: 'King Mongkut\'s IT Ladkrabang',
  },
  'yala': {
    name: 'YALA TOWER',
    ver: '1.2.0',
    idx: '19',
    inputs: ['3D city model', 'Satellite layers', 'Flood watch', 'Deep South security', '30+ feeds'],
    core: { name: 'YALA TOWER', meta: ['3D city', 'civic intelligence'] },
    outputs: ['3D city view', 'Incident board', 'Initiative tracker'],
    foot: 'Yala Municipality · Deep South',
  },
  'city-hub': {
    name: 'CITY HUB',
    ver: '5.0.0',
    idx: '15',
    inputs: ['City name', 'Whatever data exists', 'Satellite + base layers'],
    core: { name: 'CITY HUB', meta: ['replicable', '5 cities live'] },
    outputs: ['Side-by-side compare', 'Per-city pulse', 'Lens toolkit'],
    foot: 'name a city → start its brain',
  },
  'air-dnd': {
    name: 'AIRDASH',
    ver: '1.1.0',
    idx: '27',
    inputs: ['PM2.5 ground obs', 'CAMS satellite', 'Weather', 'Rain washout'],
    core: { name: 'AIRDASH', meta: ['province ranking', '24/7'] },
    outputs: ['Watch list', '3-day forecast', 'Top-5 AT-risk', 'National pattern donut'],
    foot: 'Thailand air quality + dust watch',
  },
    'slic': {
    name: 'SLIC',
    ver: '3.2.0',
    idx: '04',
    inputs: ['157 cities', '5 livability pillars', 'User weights'],
    core: { name: 'SLIC INDEX', meta: ['adjustable ranking', 'transparent math'] },
    outputs: ['Live ranking', 'Pillar breakdown', 'Cross-city compare'],
    foot: 'a ranking that argues back',
  },
  'globalmonitor': {
    name: 'GLOBAL MONITOR',
    ver: '2.6.1',
    idx: '24',
    inputs: ['Middle East', 'SE Asia', 'Thailand', 'Open data', 'Fires', 'Conflict', 'Ships'],
    core: { name: 'GLOBAL MONITOR', meta: ['3 regions', 'heat + conflict + ports'] },
    outputs: ['Layered world map', 'Event stream', 'Energy + port watch'],
    foot: 'three regions, one open data lens',
  },
  'mem': {
    name: 'MEM',
    ver: '2.1.0',
    idx: '06',
    inputs: ['Multi-source news', 'OSINT feeds', 'No editorial layer'],
    core: { name: 'MIDDLE EAST MONITOR', meta: ['machine speed', 'no filter bubble'] },
    outputs: ['Live news surface', 'Multi-source feed', 'Geo timeline'],
    foot: 'news before the algorithm decides what\'s war',
  },
  'daytraders': {
    name: 'DAY TRADERS',
    ver: '2.0.0',
    idx: '14',
    inputs: ['SET / MAI', 'US markets', 'Graham / Buffett / Munger frameworks'],
    core: { name: 'DAY TRADERS', meta: ['Thai + global', 'value lens'] },
    outputs: ['Stability range', 'Bump radar', 'News × market map'],
    foot: 'Bloomberg signals · Thai market · your rules',
  },
  // CIVIC
  'sciti': {
    name: 'SCITI',
    ver: '2.0.3',
    idx: '03',
    inputs: ['174 urban areas', '7 Smart City pillars', 'Milestone events'],
    core: { name: 'SCITI', meta: ['depa · national programme'] },
    outputs: ['City index', 'Bilingual progress', 'Milestone ledger'],
    foot: 'Smart City Thailand Index · depa',
  },
  'phuket-bus': {
    name: 'PHUKET BUS',
    ver: '1.0.0',
    idx: '07',
    inputs: ['GPS tracking', 'Passenger telemetry', 'Route definitions'],
    core: { name: 'PHUKET SMART BUS', meta: ['rider-first', 'no control room needed'] },
    outputs: ['Real-time bus position', 'Next arrival', 'Route clarity'],
    foot: 'designed for the phone, not the dashboard',
  },
  'scth': {
    name: 'SCTH V2',
    ver: '2.1.0',
    idx: '08',
    inputs: ['Telegram reports', 'LINE reports', 'Field photos', 'SLA data'],
    core: { name: 'SCTH V2', meta: ['AI classification', 'AI pattern detection'] },
    outputs: ['AI-classified reports', 'Pattern map', 'Response tasks'],
    foot: 'reports arrive → AI turns them into action',
  },
  'nsp': {
    name: 'NSP',
    ver: '2.1.0',
    idx: '12',
    inputs: ['21 NBTC-licensed channels', 'EPG feed', 'Viewership telemetry'],
    core: { name: 'NSP', meta: ['national broadcast', 'free HD'] },
    outputs: ['Live streaming', 'EPG guide', 'CAP v1.2 emergency alerts'],
    foot: 'all 21 Thai digital TV channels · one surface',
  },
  'ekkasarn': {
    name: 'EKKASARN AI',
    ver: '1.1.0',
    idx: '17',
    inputs: ['Thai tax invoices', 'Receipts', 'Withholding certificates'],
    core: { name: 'EKKASARN', meta: ['OCR + classify', 'no login'] },
    outputs: ['Extracted fields', 'Document type', 'Structured JSON'],
    foot: 'Thai document intelligence · no login',
  },
  'nonwriter': {
    name: 'NON-WRITER',
    ver: '1.4.0',
    idx: '29',
    inputs: ['Your draft', 'Source language', 'Target language'],
    core: { name: 'NON-WRITER', meta: ['rewrite → voice → language', 'proxy chain'] },
    outputs: ['Cleaner text', 'Dr Non\'s voice', 'Any language'],
    foot: 'paste → pick the line → ship · up to 3,000 words',
  },
  // EMERGING
  'ai-council': {
    name: 'AI COUNCIL',
    ver: '1.0.0',
    idx: '09',
    inputs: ['Decision question', 'Personal journals', 'Decision history'],
    core: { name: '11 JUSTICES', meta: ['palindromic names', '4 operating modes'] },
    outputs: ['Deliberation transcript', 'Mode moves', 'Defensible position'],
    foot: 'eleven voices · one decision',
  },
  'tkcx': {
    name: 'TKCX',
    ver: '1.0.0',
    idx: '10',
    inputs: ['Employees', 'Projects', 'Skill profiles', 'Moneyball budget'],
    core: { name: 'TKCX', meta: ['5 archetypes', 'readiness formula'] },
    outputs: ['Optimal formation', 'Skill gap map', 'Allocation discipline'],
    foot: 'treat talent like a portfolio, not a headcount',
  },
  'second-brain': {
    name: 'SECOND BRAIN OS',
    ver: '1.6.0',
    idx: '11',
    inputs: ['Obsidian vault', 'MCP server configs', 'Voice + decisions'],
    core: { name: 'SECOND BRAIN OS', meta: ['19 server configs', 'voice-cloned agents'] },
    outputs: ['Agents that write in your voice', 'Decision memory', 'Tool routing'],
    foot: 'brain-anatomy folder structure · make your vault operational',
  },
  'horizon45': {
    name: 'HORIZON 45',
    ver: '1.0.0',
    idx: '20',
    inputs: ['Real AI tasks', 'User attempts', 'Capability scoring'],
    core: { name: 'HORIZON 45', meta: ['field instrument', '45 challenges'] },
    outputs: ['Capability portrait', 'Learning roadmap', 'Honest score'],
    foot: 'a test of actual AI judgment · not a survey',
  },
  'ascn': {
    name: 'ASCN DIRECTOR\'S CUT',
    ver: '1.2.0',
    idx: '24',
    inputs: ['134 ASCN projects', '38 cities', '4 M&E cycles'],
    core: { name: 'ASCN DIRECTOR', meta: ['portfolio momentum', 'focus shift'] },
    outputs: ['Network insights', 'Momentum panels', 'Cross-cycle compare'],
    foot: 'the 134-project ASCN portfolio · read by a director',
  },
  'dao': {
    name: 'DAO DE JING',
    ver: '1.3.0',
    idx: '25',
    inputs: ['Dao De Jing text', 'Tsai comics', 'Buddhist parallels', 'Psychology notes'],
    core: { name: 'READING ROOM', meta: ['trilingual', 'living reference'] },
    outputs: ['TH / EN / ZH reading', 'Pinyin', 'Cross-tradition map'],
    foot: 'a trilingual reading room · still growing',
  },
  'ikigai': {
    name: 'IKIGAI ENGINE',
    ver: '1.0.0',
    idx: '26',
    inputs: ['SME balance sheet', 'Income statement', 'Cash flow'],
    core: { name: 'IKIGAI', meta: ['5 indices', 'research prototype'] },
    outputs: ['Balance sheet signal', 'Cash runway', 'Bank scorecard'],
    foot: 'finance as signal · ABC Company is fictitious mock data',
    stack: ['Next.js 16', 'React 19', 'Cloudflare Workers', 'D1', 'KV', 'R2'],
    ai: 'Generative: NL journal capture (photo/text → structured entry proposal), Gemini/Claude vision OCR on receipts, and a multi-agent research pass (registry, financials, market). Deterministic: every score, runway figure, and balance-sheet number is computed by typed finance-toolkit functions after a human approves the entry — the model drafts, it never posts.',
  },
  'flood-blueprint': {
    name: 'FLOODDASH BLUEPRINT',
    ver: '1.0.0',
    idx: '28',
    inputs: ['Sensor network specs', 'Drainage logic', 'AI flood prediction', 'Response playbooks'],
    core: { name: 'BLUEPRINT', meta: ['open research', 'replicable'] },
    outputs: ['Sensors', 'Drainage', 'AI predict', 'Decision pipeline'],
    foot: 'the open companion to FloodDash · fork and adapt',
  },
  'drnon-digests': {
    name: "DR NON'S DIGESTS",
    ver: '1.0.0',
    idx: '30',
    inputs: ['News feeds', 'Substack radar', 'AI frontier sources', 'Manual picks'],
    core: { name: "DR NON'S DIGESTS", meta: ['daily digest', 'AI frontier'] },
    outputs: ["Today's lead", 'AI frontier briefs', 'Sector watch', 'Archive'],
    foot: 'the desk, by the numbers',
  },
  'nonscrape': {
    name: 'NON-SCRAPE',
    ver: '1.0.0',
    idx: '31',
    inputs: ['URLs', 'Your question', 'Source language'],
    core: { name: 'NON-SCRAPE', meta: ['read + extract', 'multi-language'] },
    outputs: ['Answer in any language', 'Source citations', 'Structured JSON'],
    foot: 'scraping as a service · no code',
  },
};

function injectSystemVersions() {
  const cells = Array.from(document.querySelectorAll('.sys-cell[data-arch]'));
  for (const cell of cells) {
    const key = cell.getAttribute('data-arch');
    const arch = ARCHITECTURES[key];
    if (!arch || !arch.ver) continue;
    if (cell.querySelector('.sys-cell__ver')) continue;
    const head = cell.querySelector('.sys-cell__head');
    if (!head) continue;
    const ver = document.createElement('span');
    ver.className = 'sys-cell__ver';
    ver.textContent = `v${arch.ver}`;
    ver.setAttribute('title', `${arch.name || key} v${arch.ver}`);
    const status = head.querySelector('.sys-cell__status');
    if (status) head.insertBefore(ver, status);
    else head.appendChild(ver);
  }
}

function injectSystemArchitectures() {
  const cells = Array.from(document.querySelectorAll('.sys-cell[data-arch]'));
  for (const cell of cells) {
    const key = cell.getAttribute('data-arch');
    const arch = ARCHITECTURES[key];
    if (!arch) continue;

    // Skip if already injected
    if (cell.querySelector('.sys-arch')) continue;

    const inCount = (arch.inputs || []).length;
    const outCount = (arch.outputs || []).length;

    const inputsHtml = (arch.inputs || [])
      .map(s => `<span class="sys-arch__chip">${escapeHtml(s)}</span>`)
      .join('');
    const outputsHtml = (arch.outputs || [])
      .map(s => `<span class="sys-arch__chip is-emph">${escapeHtml(s)}</span>`)
      .join('');
    const coreMeta = (arch.core.meta || [])
      .map(s => `<span class="sys-arch__core-tag">${escapeHtml(s)}</span>`)
      .join('');
    const stackHtml = (arch.stack || [])
      .map(s => `<span class="sys-arch__chip">${escapeHtml(s)}</span>`)
      .join('');

    const html = `
      <div class="sys-arch" data-arch-pop="${escapeHtml(key)}" role="tooltip" aria-label="How ${escapeHtml(arch.name)} works">
        <div class="sys-arch__head">
          <div class="sys-arch__head-left">
            <span class="sys-arch__tag">${escapeHtml(_t('HOW_IT_WORKS', 'HOW IT WORKS'))}</span>
            <span class="sys-arch__spec">${inCount} FEEDS → ${outCount} VIEWS</span>
          </div>
          <span class="sys-arch__idx">#${escapeHtml(arch.idx || '')}${arch.ver ? ` · v${escapeHtml(arch.ver)}` : ''}</span>
        </div>
        <div class="sys-arch__flow">
          <div class="sys-arch__stage sys-arch__stage--inputs">
            <span class="sys-arch__lbl">SOURCES (${inCount})</span>
            <div class="sys-arch__chips">${inputsHtml}</div>
          </div>
          <div class="sys-arch__arrow">→</div>
          <div class="sys-arch__stage sys-arch__stage--core">
            <span class="sys-arch__lbl">ENGINE</span>
            <div class="sys-arch__core-box">
              <div class="sys-arch__core-name">${escapeHtml(arch.name)}</div>
              <div class="sys-arch__core-tags">${coreMeta}</div>
            </div>
          </div>
          <div class="sys-arch__arrow">→</div>
          <div class="sys-arch__stage sys-arch__stage--outputs">
            <span class="sys-arch__lbl">OUTPUTS (${outCount})</span>
            <div class="sys-arch__chips">${outputsHtml}</div>
          </div>
        </div>
        ${arch.stack || arch.ai ? `
        <div class="sys-arch__meta">
          ${arch.stack ? `
          <div class="sys-arch__meta-row">
            <span class="sys-arch__lbl">STACK</span>
            <div class="sys-arch__chips">${stackHtml}</div>
          </div>` : ''}
          ${arch.ai ? `
          <div class="sys-arch__meta-row">
            <span class="sys-arch__lbl">GENERATIVE AI</span>
            <p class="sys-arch__ai-copy">${escapeHtml(arch.ai)}</p>
          </div>` : ''}
        </div>` : ''}
        ${arch.foot ? `<div class="sys-arch__foot"><span class="sys-arch__dot">●</span> ${escapeHtml(arch.foot)}</div>` : ''}
      </div>`;

    cell.insertAdjacentHTML('beforeend', html);
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const uiCopy = {
  en: {
    nav: {
      systems: 'Systems',
      services: 'Services',
      launch: 'Launch Trail',
      team: 'Team',
      cta: 'Work With Us',
    },
    hero: {
      badge: 'All Systems Online',
      titleLine1: 'Innovation',
      subtitle: 'You build the ranking. We build the reality. Axiom maps the pressure, ships a working surface fast, and instruments it from day one — so cities, governments, and operators can make fewer, clearer decisions under pressure.',
      cta: 'Start With the Pressure Map',
      ctaSecondary: 'See Live Systems',
      nodeLabel: 'Tap a live system',
      statSystems: 'Live Systems',
      statMonitoring: 'Live Monitoring',
      statCountries: 'Countries',
      featured: {
        kicker: 'FEATURED',
        event: 'EVENT_ID: FLOODDASH_LIVE',
        name: 'FloodDash',
        lede: 'Thailand flood watch · 24/7 live · 9 sources',
        cta: 'Open live system',
        counter: 'slide {current} of {total}',
      },
    },
    engagement: {
      tag: 'Operating Model',
      title: 'Start with the pressure, not the pitch.',
      desc: 'Taking the Non-Claude-Skills logic seriously means shipping first, using the data already on the table, and leaving a proof trail from the first deployment.',
      step1: {
        day: 'DAY 01-03',
        kicker: 'Find the real decision',
        title: 'Pressure map the problem.',
        desc: 'We identify the operating question, the real users, and the data that already exists so the first version solves something concrete instead of staying abstract.',
        li1: 'Define one decision that must get faster or clearer',
        li2: 'Map current feeds, gaps, and who actually uses the output',
        li3: 'Cut anything non-essential before it enters scope',
      },
      step2: {
        day: 'DAY 04-07',
        kicker: 'Ship before perfect',
        title: 'Put a working surface in the room.',
        desc: 'The first deliverable is a live view or pilot surface people can react to immediately. We prefer a rough working system over a polished deck that teaches us nothing.',
        li1: 'Use free and existing data before buying new infrastructure',
        li2: 'Review with operators, not just sponsors and comms teams',
        li3: 'Let the interface expose trade-offs instead of hiding them',
      },
      step3: {
        day: 'DAY 08-14',
        kicker: 'Instrument what matters',
        title: 'Turn the pilot into a repeatable operating layer.',
        desc: 'From the first deploy, we track what is being watched, what changes behavior, and what deserves a heavier backend. That keeps the stack honest and the next build legible.',
        li1: 'Add pageview, content, and usage signals from day one',
        li2: 'Keep a simple decision log of what changed after launch',
        li3: 'Document the system so it can be reused, not reinvented',
      },
      proof: {
        label: 'What Ships Early',
        title: 'Proof, not moodboards.',
        text: "The repo's strongest lesson is that every project should start with evidence architecture: one sharp question, one working surface, and one data trail strong enough to tell us what to keep.",
        stat1: 'FIRST LIVE DEMO',
        stat2: 'LIVE SYSTEMS',
        stat3: 'CITIES INDEXED',
        stat4: 'NATIONS IN ROOM',
        stackTitle: 'Day-one stack discipline',
        sli1: 'SEO and share-ready narrative layer',
        sli2: 'Analytics and pageview trail',
        sli3: 'Cached content or evidence history',
        sli4: 'Simple docs so the system can survive handoff',
        note: 'Use what already exists. Add heavier infrastructure only when the pressure is real enough to earn it.',
      },
    },
    projects: {
      tag: 'Production Intelligence',
      title: 'Deployment as product.',
      desc: 'We build systems that stay useful after launch: for signal, street operations, and public decision-making.',
      introLabel: 'Three operating modes. One playbook.',
      introTitle: 'War room, city room, scoring engine.',
      introText: 'The count matters less than the pattern. Every Axiom system starts with the same brief: find the pressure, narrow the decision, and surface the few actions that actually matter.',
    },
    capabilities: {
      tag: 'Axiom Protocol Core',
      title: 'Design as process.<br>Intelligence as product.',
      desc: 'We sit between urban planning, AI governance, and operational delivery. The work is strategic only if it survives deployment.',
      prt1: { title: 'City-Level Command', desc: 'Governor-grade dashboards that pull satellite imagery, cameras, and civic feeds into one working situation room.' },
      prt2: { title: 'Intelligent Vision', desc: 'Computer vision on top of existing infrastructure for incident detection, movement tracking, and response triggers.' },
      prt3: { title: 'Geopolitics NLP', desc: 'AI briefs that compress sentiment, risk, and narrative shifts into something a decision-maker can scan fast.' },
      prt4: { title: 'Qualitative Design', desc: 'Behavior-first system design grounded in what residents tolerate, trust, and actually use.' },
      prt5: { title: 'Rapid Deployment', desc: 'Reusable architecture adapted to local context, so working systems ship in weeks instead of multi-year procurement cycles.' },
      prt6: { title: 'Blue Bird Engine', desc: 'The replication layer behind Axiom deployments: modular, hardware-agnostic, and secure enough to move fast without improvising.' },
    },
    team: {
      tag: 'Team',
      title: 'Right people.<br>Right time.',
      desc: 'No account-manager layer. Two founders stay in the build, and the network only joins when the mission needs specific expertise.',
      foundersCaption: 'Two founders. No account managers standing in the middle of the work.',
      playbookLabel: 'How Axiom actually runs',
      playbookTitle: 'Lean core. Elastic network.',
      playbookText: 'We keep the core small so decisions stay fast. When a project needs UAV feeds, traffic engineering, finance, or policy translation, we pull in the exact specialist instead of adding roles for optics.',
      rule1: { label: 'Rule 01', title: 'No handoff maze', desc: 'You talk to builders, not handlers.' },
      rule2: { label: 'Rule 02', title: 'Founders stay hands-on', desc: 'Strategy and shipping happen in the same room.' },
      rule3: { label: 'Rule 03', title: 'Specialists join by mission', desc: 'Only when the brief truly needs them.' },
    },
    contact: {
      title: 'Ready to find<br>your axioms?',
      desc: 'If the problem is real and the decision matters, send the brief. We will map the pressure, identify the first usable surface, and show what can be proven.',
      commit1: 'Pressure mapped in week one',
      commit2: 'Working pilot before slide polish',
      commit3: 'Data trail from day one',
      fieldName: 'Name',
      fieldEmail: 'Email',
      fieldMessage: 'Message',
      submit: 'Send Message',
      successTitle: 'Message sent',
      successDesc: "We'll get back to you soon.",
    },
    navCurrent: {
      systems: 'Systems', stages: 'Stages', team: 'Team', press: 'Press', brand: 'Brand Kit', credentials: 'Credentials', cta: 'Work With Us',
    },
    heroCurrent: {
      title: 'We build the <em>working systems</em> governments <br><span class="hero__punch"><span class="hero__punch-afford">can\'t afford</span> <span class="hero__punch-wait">to wait for.</span></span>',
      sub: 'Most "smart city" work ends as a deck. Ours runs in production. Problem mapped in week one. Something working before any presentation. Every decision tracked from the start.',
      cta1: 'Use FloodDash now', cta2: 'Start a brief',
      stat1lbl: 'Systems in production', stat2lbl: 'Countries operating',
      stat3lbl: 'Cities indexed', stat4lbl: 'FloodDash · LEAP East',
      meta1: '<b>24/7</b> monitoring', meta2: '<b>157</b> SLIC Index cities',
      meta3: '<b>174</b> Smart City Thailand Index cities', meta4: 'Kuching, Malaysia',
      meta5: 'Middle East', meta6: 'Asia Pacific', meta7: 'ASEAN',
    },
    sysSect: {
      kicker: 'Live in production',
      title: 'Real systems. <em>Real cities.</em> Operating today.',
      lede: "Each one started as a sharp question, shipped as a working surface, and stays useful long after the launch press cycle ends. Click through and use them — they're live.",
      sandboxKicker: 'Sandbox // Live',
      sandboxNote: "These aren't demos — they're working systems in a sandbox. Built to scale, not to impress. Production deployments under client NDAs are larger; what runs here behaves like them, with advanced modules withheld.",
    },
    stageSect: {
      kicker: 'Three stages, one arc',
      title: 'Governments are tired of <em>waiting for the deck.</em>',
      lede: "Q1 opened in Taipei. Q2 hit Singapore's main stage at GITEX. The trilogy closes at LEAP East — Asia's largest stage — with FloodDash live in the room. Same thesis every time: build it now, not after the next budget cycle.",
    
      meta: '2026 · Taipei · Singapore · Bangkok',},
    flooddashSect: {
      kicker: 'Q1–Q2 · Act III',
      meta: 'GITEX → LEAP East → FloodDash',
      title: 'Use <em>FloodDash</em> now.',
      lede: "Thailand flood watch — 24/7 live geospatial data from nine public sources, refreshed every 3–60 minutes. Launched from Asia's largest stage at LEAP East. Everyone monitoring floods in Thailand should be on this surface today.",
      live: 'LIVE',
      m1: '9 public sources',
      m2: '3–60 min refresh',
      m3: '77 provinces',
      slide1: 'National overview — every province on one surface',
      slide2: 'Hat Yai regional — southern flood corridor',
      slide3: 'Trat detail — alerts and basin-level readout',
      cta: 'Open FloodDash live',
      cta2: 'LEAP East launch',
    },
    teamSect: {
      kicker: 'Who builds it',
      foldLine: 'Team · Dr Non & Dr Poon · two founders, collective on call',
      title: 'Two founders. <em>No handlers.</em>',
      lede: 'You talk to the people who write the code and decide the architecture. When the work needs UAV operators or traffic engineers or policy translators, we pull them in for that mission only — never as a standing bench.',
    },
    ctaSect: {
      kicker: 'Work With Us',
      title: 'Send the brief. <em>We\'ll map the pressure.</em>',
      body: 'If the problem is real and the decision matters, we\'ll show what can be proven inside two weeks. No procurement-cycle warm-ups. No moodboards.',
      promise1: 'Pressure mapped in week one. The decision, the users, the data on the table.',
      promise2: 'Working pilot before slide polish. Free and existing data first; new infrastructure only when earned.',
      promise3: 'Data trail from day one. Pageviews, content, decision log — so the next build is legible.',
      alt: 'Or find us on',
    },
  },

  th: {
    nav: {
      systems: 'ระบบ',
      services: 'บริการ',
      launch: 'เส้นทางเปิดตัว',
      team: 'ทีม',
      cta: 'เริ่มงานร่วมกัน',
    },
    hero: {
      badge: 'ระบบทั้งหมดออนไลน์',
      titleLine1: 'นวัตกรรม',
      subtitle: 'คุณสร้างการจัดอันดับ ผมสร้างความเป็นจริง Axiom ทำแผนที่แรงกดดัน ส่งพื้นผิวใช้งานได้เร็ว และวางระบบวัดผลตั้งแต่วันแรก',
      cta: 'เริ่มต้นด้วย Pressure Map',
      ctaSecondary: 'ดูระบบที่ใช้งานอยู่',
      nodeLabel: 'แตะเพื่อเลือกพื้นที่',
      statSystems: 'ระบบที่ใช้งาน',
      statMonitoring: 'ติดตามตลอดเวลา',
      statCountries: 'ประเทศ',
      featured: {
        kicker: 'ไฮไลต์',
        event: 'EVENT_ID: FLOODDASH_LIVE',
        name: 'FloodDash',
        lede: 'เฝ้าน้ำท่วมไทย · สด 24/7 · 9 แหล่ง',
        cta: 'เปิดระบบสด',
        counter: 'ภาพ {current}/{total}',
      },
    },
    engagement: {
      tag: 'โมเดลการทำงาน',
      title: 'เริ่มจากแรงกดดัน ไม่ใช่การแสดง',
      desc: 'หลักการของผมคือส่งมอบก่อน ใช้ข้อมูลที่มีอยู่ และทิ้งร่องรอยหลักฐานตั้งแต่การส่งมอบครั้งแรก',
      step1: {
        day: 'วันที่ 01-03',
        kicker: 'ค้นหาการตัดสินใจที่แท้จริง',
        title: 'วิเคราะห์แผนที่แรงกดดัน',
        desc: 'ผมระบุคำถามหลัก ผู้ใช้จริง และข้อมูลที่มีอยู่ เพื่อให้เวอร์ชันแรกแก้ปัญหาที่เป็นรูปธรรม',
        li1: 'กำหนดการตัดสินใจหนึ่งข้อที่ต้องเร็วขึ้นหรือชัดเจนขึ้น',
        li2: 'ทำแผนที่แหล่งข้อมูลและช่องว่างที่มีอยู่',
        li3: 'ตัดสิ่งที่ไม่จำเป็นออกก่อนเริ่มต้น',
      },
      step2: {
        day: 'วันที่ 04-07',
        kicker: 'ส่งมอบก่อนสมบูรณ์',
        title: 'นำพื้นผิวที่ใช้งานได้เข้าห้อง',
        desc: 'สิ่งแรกที่ส่งมอบคือมุมมองที่ใช้งานได้จริงซึ่งผู้คนตอบสนองได้ทันที ผมเลือกระบบที่ทำงานได้มากกว่าคำสัญญาที่สวยงาม',
        li1: 'ใช้ข้อมูลฟรีและที่มีอยู่ก่อนซื้อโครงสร้างพื้นฐานใหม่',
        li2: 'ตรวจสอบกับผู้ปฏิบัติงาน ไม่ใช่แค่ผู้สนับสนุน',
        li3: 'ให้อินเทอร์เฟซแสดง trade-off แทนที่จะซ่อน',
      },
      step3: {
        day: 'วันที่ 08-14',
        kicker: 'วัดสิ่งที่สำคัญ',
        title: 'เปลี่ยน pilot เป็นระบบที่ทำซ้ำได้',
        desc: 'ตั้งแต่การส่งมอบครั้งแรก ผมติดตามสิ่งที่ถูกดู สิ่งที่เปลี่ยนพฤติกรรม และสิ่งที่ควรได้รับโครงสร้างหลังบ้านที่หนักกว่า',
        li1: 'เพิ่ม pageview เนื้อหา และสัญญาณการใช้งานตั้งแต่วันแรก',
        li2: 'เก็บบันทึกการตัดสินใจที่เปลี่ยนแปลงหลัง launch',
        li3: 'บันทึกระบบเพื่อให้นำไปใช้ซ้ำ ไม่ใช่สร้างใหม่',
      },
      proof: {
        label: 'สิ่งที่ส่งมอบแต่เนิ่นๆ',
        title: 'หลักฐาน ไม่ใช่ moodboard',
        text: 'บทเรียนสำคัญคือทุกโครงการควรเริ่มด้วยสถาปัตยกรรมของหลักฐาน: คำถามที่คมชัด พื้นผิวที่ใช้งานได้ และเส้นทางของข้อมูลที่ชัดเจน',
        stat1: 'เดโมสดครั้งแรก',
        stat2: 'ระบบที่ใช้งาน',
        stat3: 'เมืองที่จัดอันดับ',
        stat4: 'ชาติในห้องประชุม',
        stackTitle: 'วินัยของ stack ตั้งแต่วันแรก',
        sli1: 'ชั้น SEO และเรื่องราวที่แชร์ได้',
        sli2: 'Analytics และ pageview trail',
        sli3: 'เนื้อหา cache หรือประวัติหลักฐาน',
        sli4: 'เอกสารเพื่อให้ระบบอยู่รอดหลัง handoff',
        note: 'ใช้สิ่งที่มีอยู่แล้ว เพิ่มโครงสร้างพื้นฐานหนักเมื่อแรงกดดันมากพอ',
      },
    },
    projects: {
      tag: 'ระบบอัจฉริยะในการผลิต',
      title: 'การ deploy คือผลิตภัณฑ์',
      desc: 'ผมสร้างระบบที่ยังคงมีประโยชน์หลังเปิดตัว: สำหรับสัญญาณ การปฏิบัติงานในเมือง และการตัดสินใจสาธารณะ',
      introLabel: 'สามโหมดการทำงาน หนึ่งคู่มือ',
      introTitle: 'ห้องสงคราม ห้องเมือง เครื่องจัดอันดับ',
      introText: 'จำนวนสำคัญน้อยกว่ารูปแบบ ทุกระบบของ Axiom เริ่มด้วยสรุปเดียวกัน: ค้นหาแรงกดดัน จำกัดการตัดสินใจ และแสดงการกระทำที่สำคัญจริงๆ',
    },
    capabilities: {
      tag: 'แกนหลัก Axiom Protocol',
      title: 'การออกแบบคือกระบวนการ<br>ความฉลาดคือผลิตภัณฑ์',
      desc: 'ผมอยู่ระหว่างการวางผังเมือง การกำกับดูแล AI และการส่งมอบ งานมีคุณค่าเชิงกลยุทธ์เฉพาะเมื่อรอดจากการใช้งานจริง',
      prt1: { title: 'ศูนย์บัญชาการระดับเมือง', desc: 'dashboard ระดับผู้ว่าฯ ที่รวมภาพถ่ายดาวเทียม กล้อง และฟีดพลเมือง' },
      prt2: { title: 'ระบบมองเห็นอัจฉริยะ', desc: 'Computer vision บนโครงสร้างพื้นฐานที่มีอยู่สำหรับตรวจจับเหตุการณ์และติดตามการเคลื่อนไหว' },
      prt3: { title: 'NLP ภูมิรัฐศาสตร์', desc: 'AI briefs ที่บีบความรู้สึก ความเสี่ยง และการเปลี่ยนแปลงเรื่องราวให้ผู้ตัดสินใจอ่านได้เร็ว' },
      prt4: { title: 'การออกแบบเชิงคุณภาพ', desc: 'การออกแบบระบบที่เน้นพฤติกรรมตามสิ่งที่ผู้อยู่อาศัยยอมรับ เชื่อถือ และใช้จริง' },
      prt5: { title: 'การ deploy รวดเร็ว', desc: 'สถาปัตยกรรมที่นำมาใช้ซ้ำได้ปรับให้เข้ากับบริบทท้องถิ่น ระบบที่ใช้งานได้ใน weeks ไม่ใช่ years' },
      prt6: { title: 'Blue Bird Engine', desc: 'ชั้น replication เบื้องหลัง Axiom: modular ไม่ขึ้นกับ hardware และปลอดภัยพอสำหรับการเคลื่อนที่เร็ว' },
    },
    team: {
      tag: 'ทีม',
      title: 'คนที่ใช่<br>เวลาที่ใช่',
      desc: 'ไม่มีการสร้างภาพด้วย org chart ผู้ก่อตั้งสองคนอยู่ในการสร้าง เครือข่ายมาถึงเฉพาะเมื่อภารกิจต้องการ',
      foundersCaption: 'สองผู้ก่อตั้ง ไม่มี account manager กั้นกลาง',
      playbookLabel: 'วิธี Axiom ทำงานจริง',
      playbookTitle: 'แกนกลางที่เล็ก เครือข่ายที่ยืดหยุ่น',
      playbookText: 'ผมเก็บแกนกลางให้เล็กเพื่อให้การตัดสินใจเร็ว เมื่อโครงการต้องการผู้เชี่ยวชาญ ผมดึงคนที่ตรงมาโดยตรง',
      rule1: { label: 'กฎข้อ 01', title: 'ไม่มีการแสดง org chart', desc: 'คุณคุยกับผู้สร้าง ไม่ใช่ตัวแทน' },
      rule2: { label: 'กฎข้อ 02', title: 'ผู้ก่อตั้งอยู่ในงานตลอด', desc: 'กลยุทธ์และการสร้างเกิดในห้องเดียวกัน' },
      rule3: { label: 'กฎข้อ 03', title: 'ผู้เชี่ยวชาญเข้าร่วมตามภารกิจ', desc: 'เฉพาะเมื่อ brief ต้องการจริงๆ' },
    },
    contact: {
      title: 'พร้อมค้นหา<br>axioms ของคุณ?',
      desc: 'ถ้าปัญหาจริงและการตัดสินใจสำคัญ ส่งบรีฟมา ผมจะช่วยทำแผนที่แรงกดดัน ระบุพื้นผิวแรกที่ใช้งานได้ และพิสูจน์สิ่งที่ควรพิสูจน์ก่อน',
      commit1: 'วิเคราะห์แรงกดดันในสัปดาห์แรก',
      commit2: 'ระบบ pilot ที่ใช้งานได้ก่อนนำเสนอ',
      commit3: 'Data trail ตั้งแต่วันแรก',
      fieldName: 'ชื่อ',
      fieldEmail: 'อีเมล',
      fieldMessage: 'ข้อความ',
      submit: 'ส่งข้อความ',
      successTitle: 'ส่งข้อความแล้ว',
      successDesc: 'ผมจะติดต่อกลับเร็วๆ นี้',
    },
    navCurrent: {
      systems: 'ระบบ', stages: 'เวที', team: 'ทีม', press: 'สื่อ', brand: 'แบรนด์คิต', credentials: 'หนังสือรับรอง', cta: 'เริ่มงานร่วมกัน',
    },
    heroCurrent: {
      title: 'เราสร้าง <em>ระบบที่ใช้งานได้จริง</em> ให้รัฐบาล<br><span class="hero__punch"><span class="hero__punch-afford">ไม่ต้องรอ</span> <span class="hero__punch-wait">ให้ใครมาทำให้</span></span>',
      sub: 'งาน "เมืองอัจฉริยะ" ส่วนใหญ่จบที่งานนำเสนอ ของเราจบที่ระบบที่รันจริง ทำแผนที่ปัญหาในสัปดาห์แรก มีระบบทำงานก่อนการนำเสนอครั้งแรก วัดผลทุกการตัดสินใจตั้งแต่วันแรก',
      cta1: 'ใช้ FloodDash ตอนนี้', cta2: 'ส่งโจทย์เข้ามา',
      stat1lbl: 'ระบบที่ใช้งานอยู่', stat2lbl: 'ประเทศที่ใช้งาน',
      stat3lbl: 'เมืองที่จัดอันดับ', stat4lbl: 'FloodDash · LEAP East',
      meta1: '<b>24/7</b> ติดตาม', meta2: '<b>157</b> เมือง SLIC Index',
      meta3: '<b>174</b> เมือง Smart City Thailand Index', meta4: 'กูชิง มาเลเซีย',
      meta5: 'ตะวันออกกลาง', meta6: 'เอเชียแปซิฟิก', meta7: 'อาเซียน',
    },
    sysSect: {
      kicker: 'ใช้งานจริงอยู่ตอนนี้',
      title: 'ระบบจริง <em>เมืองจริง</em> รันอยู่วันนี้',
      lede: 'ทุกระบบเริ่มจากคำถามที่คม ส่งมอบเป็นเครื่องมือใช้งานได้ และยังมีประโยชน์อยู่อีกนานหลังรอบข่าวเปิดตัวจบ คลิกเข้าไปใช้ได้เลย — ทุกตัวรันอยู่จริง',
      sandboxKicker: 'Sandbox // Live',
      sandboxNote: 'ไม่ใช่ demo — ทุกระบบรันใน sandbox จริง สร้างให้ scale ได้ ไม่ใช่สร้างมาโชว์ การ deploy จริงของลูกค้าอยู่ภายใต้ NDA ใหญ่กว่าและซับซ้อนกว่า สิ่งที่รันที่นี่ทำงานแบบเดียวกัน โมดูลขั้นสูงถูกถอดออกเพราะ NDA ไม่ใช่เพราะของปลอม',
    },
    stageSect: {
      kicker: 'สามเวที หนึ่งเส้นเรื่อง',
      title: 'รัฐบาลเหนื่อย<em>กับการรองานนำเสนอ</em>แล้ว',
      lede: 'Q1 เปิดที่ไทเป Q2 ขึ้นเวทีหลัก GITEX ที่สิงคโปร์ ไตรภาคีจบที่ LEAP East — เวทีใหญ่ที่สุดของเอเชีย — พร้อม FloodDash สดในห้อง วิทยานิพนธ์เดิมทุกครั้ง: สร้างเลย ไม่ต้องรอรอบงบประมาณถัดไป',
    
      meta: '2569 · ไทเป · สิงคโปร์ · กรุงเทพฯ',},
    flooddashSect: {
      kicker: 'Q1–Q2 · บทที่ 3',
      meta: 'GITEX → LEAP East → FloodDash',
      title: 'ใช้ <em>FloodDash</em> ตอนนี้',
      lede: 'ระบบเฝ้าดูน้ำท่วมประเทศไทย — ข้อมูลภูมิสารสนเทศสด 24/7 จากแหล่งสาธารณะ 9 แหล่ง อัปเดตทุก 3–60 นาที เปิดตัวจากเวทีใหญ่ที่สุดของเอเชียที่ LEAP East ทุกคนที่ติดตามน้ำท่วมในไทยควรใช้พื้นผิวนี้วันนี้',
      live: 'LIVE',
      m1: '9 แหล่งสาธารณะ',
      m2: 'รีเฟรช 3–60 นาที',
      m3: '77 จังหวัด',
      slide1: 'ภาพรวมประเทศ — ทุกจังหวัดบนพื้นผิวเดียว',
      slide2: 'หาดใหญ่ระดับภูมิภาค — ระเบียงน้ำท่วมภาคใต้',
      slide3: 'ตราดละเอียด — การแจ้งเตือนและระดับลุ่มน้ำ',
      cta: 'เปิด FloodDash สด',
      cta2: 'เปิดตัวที่ LEAP East',
    },
    teamSect: {
      kicker: 'คนที่สร้าง',
      foldLine: 'ทีม · ดร.นน และ ดร.พูน · สองผู้ก่อตั้ง ทีมเสริมตามภารกิจ',
      title: 'สองผู้ก่อตั้ง <em>ไม่มีคนกลาง</em>',
      lede: 'คุณคุยกับคนที่เขียนโค้ดและตัดสินใจสถาปัตยกรรมโดยตรง เมื่องานต้องการคนคุมโดรน วิศวกรจราจร หรือผู้แปลนโยบาย ผมดึงเข้ามาเฉพาะภารกิจนั้น ไม่เคยมีเป็นทีมประจำ',
    },
    ctaSect: {
      kicker: 'ทำงานกับเรา',
      title: 'ส่งโจทย์มา <em>ผมจะทำแผนที่แรงกดดันให้</em>',
      body: 'ถ้าปัญหาจริงและการตัดสินใจมีน้ำหนัก ผมจะแสดงสิ่งที่พิสูจน์ได้ภายในสองสัปดาห์ ไม่ต้องวอร์มอัพรอบจัดซื้อ ไม่ใช้ moodboard',
      promise1: 'ทำแผนที่แรงกดดันในสัปดาห์แรก พร้อมการตัดสินใจ ผู้ใช้ และข้อมูลครบบนโต๊ะ',
      promise2: 'มีระบบ pilot ที่ใช้งานได้ก่อนขัดเกลาสไลด์ ใช้ข้อมูลฟรีและที่มีอยู่ก่อน ลงทุนโครงสร้างใหม่เมื่อสมเหตุสมผลจริง',
      promise3: 'data trail ตั้งแต่วันแรก ทั้งยอดเข้าชม เนื้อหา บันทึกการตัดสินใจ เพื่อให้รุ่นต่อไปอ่านบทเรียนได้',
      alt: 'หรือหาผมได้ที่',
    },
  },

  zh: {
    nav: {
      systems: '系统',
      services: '服务',
      launch: '发布轨迹',
      team: '团队',
      cta: '成为合作伙伴',
    },
    hero: {
      badge: '所有系统在线',
      titleLine1: '创新',
      subtitle: '你建排名，我们建现实。Axiom 绘制压力图谱，快速交付可用界面，从第一天起就布署可追溯的度量层。',
      cta: '从压力图开始',
      ctaSecondary: '查看在线系统',
      nodeLabel: '点击选择区域',
      statSystems: '在线系统',
      statMonitoring: '全天候监控',
      statCountries: '国家',
    
      featured: {
        kicker: '精选',
        event: 'EVENT_ID: FLOODDASH_LIVE',
        name: 'FloodDash',
        lede: '泰国洪水监测 · 24/7 实时 · 9 个数据源',
        cta: '打开在线系统',
        counter: '幻灯片 {current}/{total}',
      },
},
    engagement: {
      tag: '运营模式',
      title: '从压力出发，而非表演',
      desc: '我们的原则是先交付，使用现有数据，并从第一次部署起留下证据轨迹。',
      step1: {
        day: '第 01-03 天',
        kicker: '找到真实决策',
        title: '绘制问题压力图',
        desc: '我们识别核心问题、真实用户和现有数据，让第一个版本解决具体问题，而非表演战略。',
        li1: '确定一个需要更快或更清晰的决策',
        li2: '梳理现有数据源、差距和实际用户',
        li3: '在进入范围之前剔除装饰性内容',
      },
      step2: {
        day: '第 04-07 天',
        kicker: '先交付，再完善',
        title: '在会议室放入可用界面',
        desc: '第一个交付物是人们可以立即做出反应的实时视图。我们更喜欢丑陋但可用的系统，而非什么都没教会我们的精美承诺。',
        li1: '使用免费和现有数据，而非购买新基础设施',
        li2: '与运营者审查，而非仅与赞助商和传播团队',
        li3: '让界面暴露权衡，而非隐藏它们',
      },
      step3: {
        day: '第 08-14 天',
        kicker: '量化重要指标',
        title: '将试点转化为可重复的运营层',
        desc: '从第一次部署开始，我们跟踪什么被观看、什么改变行为、什么值得更重的后端。',
        li1: '从第一天起添加页面浏览、内容和使用信号',
        li2: '保持简单的决策日志记录发布后的变化',
        li3: '记录系统以便重复使用，而非重新发明',
      },
      proof: {
        label: '早期交付内容',
        title: '证据，而非概念板',
        text: '最重要的经验是每个项目都应从证据架构开始：一个清晰的问题、一个可用的界面和一条数据轨迹。',
        stat1: '首次现场演示',
        stat2: '在线系统',
        stat3: '已建立索引的城市',
        stat4: '会议室内的国家',
        stackTitle: '第一天的技术栈纪律',
        sli1: 'SEO 和可分享的叙述层',
        sli2: '分析和页面浏览追踪',
        sli3: '缓存内容或证据历史',
        sli4: '简单文档确保系统在交接后存活',
        note: '使用已有资源。只有在压力足够真实时才增加更重的基础设施。',
      },
    },
    projects: {
      tag: '生产级智能系统',
      title: '部署即产品',
      desc: '我们构建在发布后仍然有用的系统：用于信号、街道运营和公共决策。',
      introLabel: '三种运营模式。一套 playbook。',
      introTitle: '战情室、城市室、评分引擎',
      introText: '数量不如模式重要。每个 Axiom 系统都从相同的简报开始：找到压力，缩小决策，浮现真正重要的行动。',
    },
    capabilities: {
      tag: 'Axiom 协议核心',
      title: '设计即过程<br>智能即产品',
      desc: '我们处于城市规划、AI 治理和运营交付之间。工作只有在经受住部署考验后才具有战略价值。',
      prt1: { title: '城市级指挥中心', desc: '将卫星图像、摄像头和城市数据整合到一个工作态势感知室的省长级仪表板。' },
      prt2: { title: '智能视觉', desc: '在现有基础设施上的计算机视觉，用于事件检测、运动跟踪和响应触发。' },
      prt3: { title: '地缘政治 NLP', desc: '将情感、风险和叙事转变压缩成决策者可以快速扫描内容的 AI 简报。' },
      prt4: { title: '定性设计', desc: '基于居民实际容忍、信任和使用情况的行为优先系统设计。' },
      prt5: { title: '快速部署', desc: '适应本地情境的可重用架构，让可用系统在数周而非数年内交付。' },
      prt6: { title: 'Blue Bird Engine', desc: 'Axiom 部署背后的复制层：模块化、硬件无关，安全到足以快速移动而无需即兴发挥。' },
    },
    team: {
      tag: '团队',
      title: '对的人<br>对的时间',
      desc: '没有组织架构表演。两位创始人保持在构建中。网络只在任务足够奇特时才出现。',
      foundersCaption: '两位创始人。没有客户经理站在工作中间。',
      playbookLabel: 'Axiom 实际运作方式',
      playbookTitle: '精简核心。弹性网络。',
      playbookText: '我们让核心保持极度精简以确保决策快速。当项目需要无人机、交通工程、金融或政策翻译时，我们引入准确的专家，而非配备装饰性团队。',
      rule1: { label: '规则 01', title: '没有组织架构表演', desc: '你与建设者交谈，而非处理者。' },
      rule2: { label: '规则 02', title: '创始人保持亲力亲为', desc: '战略和交付在同一个房间发生。' },
      rule3: { label: '规则 03', title: '专家按任务加入', desc: '只有在简报真正需要时。' },
    },
    contact: {
      title: '准备好找到<br>您的公理了吗?',
      desc: '如果问题重要且清晰度重要，我们应该谈谈。我们更喜欢合作伙伴关系，而非供应商表演。',
      commit1: '第一周完成压力图',
      commit2: '展示前先有可用试点',
      commit3: '第一天起建立数据轨迹',
      fieldName: '姓名',
      fieldEmail: '电子邮件',
      fieldMessage: '留言',
      submit: '发送消息',
      successTitle: '消息已发送',
      successDesc: '我们会尽快回复您。',
    },
    navCurrent: {
      systems: '系统', stages: '舞台', team: '团队', press: '媒体', brand: '品牌套件', credentials: '资质', cta: '开始合作',
    },
    heroCurrent: {
      title: '我们建造<em>能运行的系统</em><br>让政府<span class="hero__punch"><span class="hero__punch-afford">不用再等</span> <span class="hero__punch-wait">别人来做</span></span>',
      sub: '多数"智慧城市"项目都停在幻灯片阶段。我们的停在运行中的系统上。第一周就把问题摸清楚 演示之前就有能跑的东西 每一个决策从第一天起就留下记录。',
      cta1: '立刻使用 FloodDash', cta2: '把题目发过来',
      stat1lbl: '运行中的系统', stat2lbl: '在用的国家',
      stat3lbl: '建档城市', stat4lbl: 'FloodDash · LEAP East',
      meta1: '<b>24/7</b> 监控', meta2: '<b>157</b> SLIC 指数城市',
      meta3: '<b>174</b> 泰国智慧城市指数城市', meta4: '古晋 马来西亚',
      meta5: '中东', meta6: '亚太地区', meta7: '东盟',
    },
    sysSect: {
      kicker: '正在生产中运行',
      title: '真实系统 <em>真实城市</em> 今天就在跑',
      lede: '每个系统都从一个尖锐的问题开始 以可用的界面交付 在发布新闻周期结束之后依然有用 点进去用就行 全部都在线跑着',
      sandboxKicker: 'Sandbox // Live',
      sandboxNote: '不是演示稿——是运行在沙盒里的可用系统。按可扩展的方式搭建，不是为了好看。客户生产部署在保密协议下规模更大；这里运行的逻辑与之一致，敏感模块不对外展示，不是因为它们是假的。',
    },
    stageSect: {
      kicker: '三个舞台 一条弧线',
      title: '政府已经<em>厌倦等一份幻灯片</em>了',
      lede: 'Q1 在台北开场。Q2 登上新加坡 GITEX 主舞台。三部曲在 LEAP East——亚洲最大舞台——收束，FloodDash 在现场上线。同一条论点每次都一样：现在就建，别等下一个预算周期。',
    
      meta: '2026 · 台北 · 新加坡 · 曼谷',},
    flooddashSect: {
      kicker: 'Q1–Q2 · 第三幕',
      meta: 'GITEX → LEAP East → FloodDash',
      title: '立刻使用 <em>FloodDash</em>。',
      lede: '泰国洪水监测——来自九个公开数据源的 24/7 实时地理空间数据，每 3–60 分钟刷新。从 LEAP East 亚洲最大舞台发布。每一位在泰国盯洪水的人，今天就该用这张面。',
      live: 'LIVE',
      m1: '9 个公开数据源',
      m2: '3–60 分钟刷新',
      m3: '77 个府',
      slide1: '全国总览 — 每个府都在同一张面上',
      slide2: '合艾区域 — 南部洪水走廊',
      slide3: '达叻明细 — 警报与流域读数',
      cta: '打开 FloodDash 实时版',
      cta2: 'LEAP East 发布现场',
    },
    teamSect: {
      kicker: '谁在搭',
      foldLine: '团队 · 诺博士与蓬博士 · 两位创始人 按需集结',
      title: '两位创始人 <em>没有中间人</em>',
      lede: '你直接跟写代码、定架构的人对话 工作需要无人机操作员 交通工程师 或者政策翻译时 我们只为那个任务把人请进来 从不养成常设团队',
    },
    ctaSect: {
      kicker: '一起来做',
      title: '把题目发过来 <em>我们来画压力图</em>',
      body: '如果问题是真的 决策也重要 两周内我们让你看到能证明的东西 不走采购周期热身 不做情绪板',
      promise1: '第一周就把压力图画完 决策、用户、数据全部摆上桌',
      promise2: '在打磨幻灯片之前 先有能跑的试点 优先用免费和现有的数据 新基础设施只在该建的时候才建',
      promise3: '从第一天起就留下数据轨迹 页面浏览、内容、决策日志 让下一版构建读得懂',
      alt: '或者在这里找我们',
    },
  },

  ts: {
    nav: {
      systems: 'type Systems',
      services: 'interface Services',
      launch: 'export Launch',
      team: 'class Team',
      cta: 'await workTogether()',
    },
    hero: {
      badge: '// status: ONLINE',
      titleLine1: 'Innovation',
      subtitle: '// AI should feel like infrastructure, not performance\nconst axiom = new DecisionSystem({ pressure: true, performative: false })',
      cta: 'pressureMap.start()',
      ctaSecondary: 'systems.getLive()',
      nodeLabel: '// select system',
      statSystems: 'LiveSystem[]',
      statMonitoring: 'readonly 24/7',
      statCountries: 'Country<T>',
      featured: {
        kicker: '// FEATURED',
        event: 'EVENT_ID: FLOODDASH_LIVE',
        name: 'FloodDash',
        lede: '// thailand.floodWatch // live.24/7 // sources: 9',
        cta: 'system.open()',
        counter: '// slide: {current}/{total}',
      },
    },
    engagement: {
      tag: '// OPERATING_MODEL',
      title: 'type Engagement = Pressure, not Pitch',
      desc: '/** @param pressure — real\n * @param performative — false\n * @returns working_system */',
      step1: {
        day: 'Phase<01-03>',
        kicker: '// find real decision',
        title: 'pressureMap(problem: unknown): Decision',
        desc: 'const { question, users, data } = await identify(scope)\nreturn new WorkingVersion({ concrete: true, performative: false })',
        li1: 'defineDecision(): void // one that must get faster',
        li2: 'mapFeeds(gaps: Gap[]): DataSource[]',
        li3: 'trim(nonEssential: Feature[]): void',
      },
      step2: {
        day: 'Phase<04-07>',
        kicker: '// ship before perfect',
        title: 'deploy(surface: WorkingSurface): void',
        desc: 'return roughWorkingSystem > polishedDeck',
        li1: 'useExisting(data: FreeData): void // no new infra',
        li2: 'reviewWith(operators: User[]): Feedback[]',
        li3: 'expose(tradeoffs: boolean): Interface // not hide',
      },
      step3: {
        day: 'Phase<08-14>',
        kicker: '// instrument what matters',
        title: 'pilot.toRepeatable(): OperatingLayer',
        desc: 'track({ watched: boolean, behavior: Change[], backend: Weight })',
        li1: 'addSignals(pageview, content, usage): void',
        li2: 'log(decisions: Decision[], when: Date): Trail',
        li3: 'document(): void // reuse, not reinvent',
      },
      proof: {
        label: '// SHIPS_EARLY',
        title: 'type Proof = never MoodBoard',
        text: 'const lesson = { question: sharp, surface: working, trail: data }\n// Start with evidence architecture',
        stat1: 'FIRST_LIVE_DEMO',
        stat2: 'LIVE_SYSTEMS',
        stat3: 'CITIES_INDEXED',
        stat4: 'NATIONS_IN_ROOM',
        stackTitle: '// day-one stack discipline',
        sli1: 'SEO: LayerConfig // share-ready',
        sli2: 'Analytics: Trail // pageview',
        sli3: 'content: Cache | EvidenceHistory',
        sli4: 'docs: Handoff // survive transfer',
        note: '// useExisting() first\n// addHeavyInfra() only when pressure.isReal()',
      },
    },
    projects: {
      tag: '// PRODUCTION_INTELLIGENCE',
      title: 'deployment satisfies Product',
      desc: '// systems that stay useful: signal | street | decision',
      introLabel: '// 3 operating modes. 1 playbook.',
      introTitle: 'warRoom | cityRoom | scoringEngine',
      introText: 'count < pattern\naxiom.systems.forEach(s => s.brief === { pressure, decision, actions })',
    },
    capabilities: {
      tag: '// AXIOM_PROTOCOL_CORE',
      title: 'Design = Process<br>Intelligence = Product',
      desc: '// urban planning & AI governance & operational delivery\nconst strategic = work.survivesDeployment()',
      prt1: { title: 'CityCommand: Dashboard', desc: 'Governor<Grade> pulls satellite | cameras | civicFeeds → SituationRoom' },
      prt2: { title: 'Vision: ComputerVision', desc: 'incidents.detect() | movement.track() | triggers.respond()' },
      prt3: { title: 'Geopolitics: NLP<LLM>', desc: 'compress(sentiment, risk, narrative) → Scannable<DecisionMaker>' },
      prt4: { title: 'Design: Qualitative<T>', desc: 'behaviorFirst(residents.tolerate | trust | use): SystemDesign' },
      prt5: { title: 'Deploy: Rapid<Local>', desc: 'reusableArch.adaptTo(context) // weeks not years' },
      prt6: { title: 'BlueBird: Engine<Core>', desc: 'replication: modular & hardwareAgnostic & secure // move fast' },
    },
    team: {
      tag: 'class Team',
      title: 'RightPeople<br>RightTime',
      desc: '// no account-manager layer\nconst founders = new Set(builders)\nnetwork.join(when: missionNeedsExpertise)',
      foundersCaption: '// 2 founders, 0 account managers in the middle',
      playbookLabel: '// how Axiom actually runs',
      playbookTitle: 'core.size === "small"\nnetwork.type === "elastic"',
      playbookText: 'if (project.needs(specialist)) pull(exact)\n// never addRoles(forOptics)',
      rule1: { label: '// Rule<01>', title: 'noHandoffMaze()', desc: 'talk to builders, not handlers' },
      rule2: { label: '// Rule<02>', title: 'founders.stayHandsOn()', desc: 'strategy && shipping in same room' },
      rule3: { label: '// Rule<03>', title: 'specialists.joinByMission()', desc: 'only when brief.needs(them)' },
    },
    contact: {
      title: 'ready to find()<br>your axioms?',
      desc: '// if problem.isReal && decision.matters\nawait pressureMap()\n// prove first, polish second',
      commit1: 'pressureMap: Week<1>',
      commit2: 'pilot.beforeSlidePolish()',
      commit3: 'trail: DataFrom<Day1>',
      fieldName: 'name: string',
      fieldEmail: 'email: Email',
      fieldMessage: 'message: string',
      submit: 'send()',
    },
    navCurrent: {
      systems: 'LiveSystem[]',
      stages: 'Stage<Keynote>',
      team: 'class Team',
      press: 'Press[]',
      brand: 'BrandKit',
      credentials: 'TrustRecord',
      cta: 'workWith(us)',
    },
    heroCurrent: {
      title: 'LiveSystem<em>.build()</em> <br>// gov.cannotWait() → ship() → instrument(day1)',
      sub: '// most "smart city" work: Promise<Deck> — never resolves\n// ours: LiveSystem — deployed, instrumented, running\n// method: pressureMap() → shipRough() → instrument(day1)',
      cta1: 'FloodDash.useNow()',
      cta2: 'brief.start()',
      stat1lbl: 'LiveSystem[]',
      stat2lbl: 'Country<T>[]',
      stat3lbl: 'cities.indexed',
      meta1: '<b>24/7</b> monitor', meta2: '<b>157</b> SLIC.cities',
      meta3: '<b>174</b> SCTH.cities', meta4: 'Kuching, Malaysia',
      meta5: 'Middle East', meta6: 'Asia Pacific', meta7: 'ASEAN',
      stat4lbl: 'FloodDash@LEAP.East',
    },
    sysSect: {
      kicker: '// LIVE_IN_PRODUCTION',
      title: 'type Systems = Real<Cities> // operating today',
      lede: '// each: sharpQuestion → workingSurface → staysUseful\n// click through: systems.forEach(s => assert(s.isLive()))',
      sandboxKicker: '// SANDBOX // LIVE',
      sandboxNote: '// not demos — systems.runIn(sandbox)\n// built.toScale(), not.toImpress()\n// prod under NDA: larger; behavior.same(); advancedModules.withheld(not.faked)',
    },
    stageSect: {
      kicker: '// THREE_STAGES_ONE_ARC',
      title: 'governments.tireof(waitingForTheDeck)',
      lede: '// Q1: Taipei → Q2: GITEX.mainStage → LEAP.East closes trilogy\n// FloodDash.liveInRoom(); thesis: { build: "now" }',
    
      meta: '// 2026.taipei.singapore.bangkok',},
    flooddashSect: {
      kicker: '// Q1_Q2.ACT_III',
      meta: 'GITEX → LEAP.East → FloodDash',
      title: 'FloodDash<em>.useNow()</em>',
      lede: '// ThailandFloodWatch: geospatial.live(24/7)\n// sources: 9.public; refresh: 3..60min\n// launched: LEAP.East // asia.largestStage\n// everyone.monitoringFloods.shouldUse(today)',
      live: 'LIVE',
      m1: 'sources: 9.public',
      m2: 'refresh: 3..60min',
      m3: 'provinces: 77',
      slide1: 'national.overview // everyProvince',
      slide2: 'hatYai.regional // southCorridor',
      slide3: 'trat.detail // alerts + basin',
      cta: 'FloodDash.openLive()',
      cta2: 'LEAP.East.launch',
    },
    teamSect: {
      kicker: '// WHO_BUILDS_IT',
      foldLine: '// team: [DrNon, DrPoon] · founders: 2 · handlers: never[]',
      title: 'const team: [Founder, Founder] // handlers: never[]',
      lede: '// you.talkTo(builders) // not handlers\n// specialists.join({ when: mission.needs(them), as: "standing bench" }) // throws',
    },
    ctaSect: {
      kicker: '// WORK_WITH_US',
      title: 'brief.send() // we.will.map(pressure)',
      body: 'if (problem.isReal && decision.matters) {\n  return show(provable, { within: "2w" })\n  // no procurementWarmups()\n  // no moodboards()\n}',
      promise1: 'pressureMap(): Week<1> // { decision, users, data } on table',
      promise2: 'pilot.before(slidePolish) // freeData.first(); newInfra.only(whenEarned)',
      promise3: 'trail: DataFrom<Day1> // pageviews + content + decisionLog → nextBuild.legible()',
      alt: '// or find us on',
    },
  },
};

// ── i18n extension — panels, stages, team, field notes, press ──────────────
const i18nExt = {
  en: {
    panels: {
      p01: {
        title: 'A governor\'s <em>situation room</em>, in a browser tab.',
        lede: 'Phuket\'s transit, public safety, and environmental signals, unified into one surface that an actual governor can read in 30 seconds. Built in weeks, not procurement cycles.',
        w1lbl:'Why it\'s special', w1:'Most government dashboards are read-only PDFs disguised as software. Phuket is a working operations room: transit, safety, and environment fused on one screen, refreshed every 42ms. The governor reads it directly — no analyst translation layer.',
        w2lbl:'What it replaced', w2:'Three siloed agency reports, an SMS escalation chain, and a Tuesday-morning briefing slot.',
        w3lbl:'Earned on day one', w3:'Built on existing IoT infrastructure — no new hardware procurement.', cta:'Open live system',
      },
            p03: {
        title: 'Bureaucracy, <em>made legible.</em>',
        lede: 'We built the public surface for Thailand\'s national smart city programme with depa. Proposals go in. Progress stays visible. The programme stops disappearing into PDFs.',
        w1lbl:'Why it\'s special', w1:'National programmes usually live in annual reports nobody reads. This one is online, bilingual, and tied to outcomes — not ceremony. A candidate city\'s status moves the moment a milestone clears.',
        w2lbl:'Who pays for it', w2:'depa — Thailand\'s Digital Economy Promotion Agency. Direct-to-government engagement, not a sub-vendor relationship.',
        w3lbl:'Why it matters', w3:'Sets the template for any national smart-city programme that wants to stay legible past the launch press cycle. SLIC integrates as the benchmarking layer.', cta:'Open live system',
      },
      p04: {
        title: 'A ranking <em>that argues back.</em>',
        lede: 'The SLIC Index doesn\'t tell cities what they\'re worth. It shows them five pillars and lets them test their own priorities. Mayors decide what livability means — and the math follows.',
        w1lbl:'Why it\'s special', w1:'Every other livability index hands cities a finished verdict. SLIC hands them the math. Move the pillar weights, watch your ranking change — and your peers\' — in real time. The argument becomes the product.',
        w2lbl:'What it replaced', w2:'Static prestige leaderboards. The annual ranking PDF. The conversation that ended with "we don\'t agree with the methodology."',
        w3lbl:'Audience signal', w3:'Picked up by Mayors of Europe. Live-demo\'d at SCSE Taipei in 45 minutes. Treated as a civic argument, not a moodboard.', cta:'Open SLIC v3',
      },
      p05: {
        title: 'Greater Kuching, <em>one command surface.</em>',
        lede: 'A full-spectrum IOC for Greater Kuching, Sarawak. Foreign exchange, flights, satellite imagery, and environmental signals — unified for the operators who run Southeast Asia\'s fastest-growing smart city.',
        w1lbl:'Why it\'s special', w1:'Most IOCs are single-domain. Kuching fuses cross-domain signals in one view — currency pressure, flight arrivals, Sentinel-2 sweeps, environmental reads. The operator never switches tabs to see the full picture.',
        w2lbl:'Who uses it', w2:'Greater Kuching city operators and planners. Built for real-time situational awareness — not a demo room, for daily use.',
        w3lbl:'Why it matters', w3:'Same information density a Bloomberg terminal gives a trading desk — but for a city, at a fraction of the cost.', cta:'Open live system',
      },
      p06: {
        title: 'News <em>before the algorithm decides what\'s war.</em>',
        lede: 'MEM is the fastest open-source news surface for Middle Eastern conflict coverage. Live multi-source feeds, no editorial delay, no filter bubble. The signal before the cycle.',
        w1lbl:'Why it\'s special', w1:'Every major news platform has an editorial layer that slows, filters, frames. MEM removes that layer. The same signals a desk analyst aggregates manually — in one surface, at machine speed.',
        w2lbl:'What it replaced', w2:'Three browser tabs, two Telegram channels, and a Twitter/X list — open simultaneously to triangulate what was actually happening on the ground.',
        w3lbl:'Who uses it', w3:'Journalists, policy analysts, NGO field teams. Anyone who needs ground-level signal faster than the 24-hour news cycle delivers it.', cta:'Open live system',
      },
      p07: {
        title: 'The bus, tracked. <em>The rider, informed.</em>',
        lede: 'Real-time GPS tracking and passenger telemetry for Phuket\'s smart bus network. Designed for the rider\'s phone first — not a control room screen. Works on the road, in the heat, with one thumb.',
        w1lbl:'Why it\'s special', w1:'Smart bus systems usually exist for the operator\'s dashboard. This one exists for the person waiting at the stop. GPS position, next arrival, route clarity — for a tourist who doesn\'t read Thai and a commuter who doesn\'t have time to guess.',
        w2lbl:'What it replaced', w2:'Standing at a stop with no information. A bus schedule printed in 2019. The assumption that transit on a tourist island can\'t be made legible.',
        w3lbl:'Built on top of', w3:'Phuket\'s existing IoT infrastructure — the same sensor layer that feeds the Governor\'s operations room. No new hardware.', cta:'Open live system',
      },
      p08: {
        title: 'Reports arrive. <em>AI turns them into action.</em>',
        lede: 'SCTH V2 is a Smart City Thailand city data platform that absorbs civic reports from Telegram and LINE, analyzes problems with AI, and overlays near-real-time satellite and map layers for city builders, city developers, and city managers.',
        w1lbl:'Why it\'s special', w1:'Most city complaint systems stop at a ticket number. SCTH V2 turns the report stream into a decision surface. Messenger reports, field photos, SLA risk, and AI pattern detection sit on the same map as precipitation, aerosol, cloud, terrain, and street layers.',
        w2lbl:'What it replaced', w2:'Screenshots in chat groups, manual spreadsheet triage, static map layers, and the delay between "someone reported it" and "someone can act on it."',
        w3lbl:'Decision power', w3:'City teams can absorb reports, assign owners, analyze recurring patterns, export sheets or PDFs, and push response tasks while the city context is still live.',
        w4lbl:'Live access', w4:'Proprietary system under continuous daily development. The link runs a live tunnel — if it doesn\'t resolve, the system is mid-upgrade. Check back in a moment.', cta:'Open live system',
      },
      p09: {
        title: 'Eleven voices. <em>One decision.</em>',
        lede: 'Dr Non\'s AI Council is a personal multi-agent deliberation system: 11 AI justices with palindromic names (Tenet, Radar, Otto, Hannah, Ada…) running continuously on a local Mac, arguing through a shared transcript log, for around $3 a month. Trained on personal journals, decisions, and voice — proprietary by design, not by accident.',
        w1lbl:'Why it exists', w1:'Single models give one answer. Problems worth solving deserve argument. The council runs four operating modes — VERIFY, DECIDE, EXPLORE, DEBATE — and justices use explicit moves (EXPAND, QUALIFY, CONCEDE, STAND, PASS) so every position change is visible and traceable.',
        w2lbl:'What it costs', w2:'Manus-class autonomous-agent capability at $3/month. The council chair runs on Mistral Large 3. The Thai-native skeptic (Ada) runs on ThaiLLM — a government-backed model, free. The executor (Otto) handles OCR, video downloads, email drafts, PDF generation, and Google Drive sync without touching cloud infrastructure.',
        w3lbl:'Why no demo', w3:'The council is trained on Dr Non\'s personal journals, decisions, meeting notes, and voice. Proprietary by necessity. The protocol stack — ~600 lines of Python — is open. The IP is the coordination methodology, not the weights.', cta:'v1 · DIY Protocol', cta2:'v2 · Agentic + Executor',
      },
      p10: {
        title: 'HR has been a <em>record system</em> long enough.',
        lede: 'Talent Knowledge Collaborative Explorers (TKCX) is a game-based talent operating system that treats employees as party members, projects as quests, and team assembly as strategy. It makes every decision about people visible, measurable, and connected to outcomes — replacing org-chart politics with capability intelligence.',
        w1lbl:'The problem', w1:'Most HR systems are compliance records, not intelligence. They tell you who is employed — not who should be deployed, where, and with whom. Decisions about people are made on gut feel and political capital. The best people leave. The comfortable ones stay. Nobody can see why.',
        w2lbl:'The engine', w2:'Built on Dragon Quest III\'s party system. Five archetypes map to real workplace roles (captain, tech, sales, ops, scout). A Moneyball budget cap — project budget ÷ 10 = monthly salary ceiling — forces allocation discipline. The readiness formula weighs coverage, quality, chemistry, and morale so the right team is visible before the project starts, not after it fails.',
        w3lbl:'What it changes', w3:'Directors stop hoarding people. Projects stop running on political capital. Skill gaps become visible before they become failures. And HR — renamed Talent Incubation — becomes the most strategic function in the building, not the most avoided one.', cta:'GitHub repo — coming soon',
      },
      p11: {
        title: 'The AI <em>that knows you.</em>',
        lede: 'Second Brain OS connects your Obsidian vault to every AI coding platform simultaneously via MCP. Brain-anatomy folder structure. 19 server configs. AI agents that access your persona blueprint, write in your voice, and remember every decision you\'ve ever logged. The knowledge you\'ve been building for years — finally working for you.',
        w1lbl:'The gap it closes', w1:'Every AI session starts cold. It doesn\'t know your voice, your values, your past decisions, or the years of journal entries that shaped your thinking. Second Brain OS feeds all of that into every coding platform simultaneously via a single MCP connection — so the AI you work with already knows who it\'s working with.',
        w2lbl:'How it\'s built', w2:'Your Obsidian vault is structured like a brain: PrefrontalCortex for strategy, Hippocampus for atomic memories, TemporalLobe for patterns, Cerebellum for skills and procedures. 19 MCP server configurations connect this living knowledge graph to Cursor, Codex, Claude Code, and every other platform in your stack — at once.',
        w3lbl:'Why it\'s open', w3:'The architecture is MIT-licensed. The brain is yours. Anyone can fork the structure, adapt the MCP configs, and connect their own vault. Includes a 12-level diagnostic for stripping AI-speak out of your writing — so the knowledge you accumulate stays in your voice, not the model\'s.', cta:'Explore the architecture',
      },
      p12: {
        title: '21 channels. <em>Free. Everywhere.</em>',
        lede: 'NSP is Thailand\'s national streaming platform — all 21 NBTC-licensed digital TV channels, free, full HD, on any device. Live EPG, per-channel viewership telemetry, AI content guide, and CAP v1.2 emergency alert integration in one interface.',
        w1lbl:'Why it\'s special', w1:'Most national TV portals are afterthoughts. <b>NSP puts all 21 licensed channels in one interface</b> with live EPG, per-channel concurrency, stream health telemetry, and an AI guide that answers "what\'s on now?" across the whole kingdom — without an app install.',
        w2lbl:'What it replaced', w2:'Fragmented broadcaster apps, illegal streams, and the assumption that free-to-air TV can\'t be made as legible as a subscription platform.',
        w3lbl:'Decision power', w3:'Operators see live viewer concurrency, channel audience share, and stream health in real time. The CAP v1.2 emergency warning integration means national alerts surface through the same interface as entertainment — no separate system.',
        w4lbl:'Live access', w4:'National deployment under NBTC licensing authority. Open to all devices, no account required.',
        cta:'Open live platform',
      },
      p13: {
        title: '47 feeds. <em>7 lenses. One campus.</em>',
        lede: 'Chula Control Tower is a real-time operations dashboard for Chulalongkorn University — 47 live data feeds across traffic, incidents, air quality, satellite imagery, CU Shuttle, news, and emergency events for Bangkok\'s Siam–Samyan district.',
        w1lbl:'Why it\'s special', w1:'Most university dashboards show one feed at a time. <b>CCT puts 47 live sources on a single 3D map</b> — traffic, air quality, shuttle positions, incident reports, satellite layers, and underground utilities — so the campus president has one surface for every decision.',
        w2lbl:'What it replaced', w2:'Separate siloed systems for traffic, security, and environmental data. Manual incident reports. No unified view of the campus at any given moment.',
        w3lbl:'Decision power', w3:'Seven operational lenses — from day-to-day campus management to presidential strategic view — let each role see exactly what they need. 3D buildings and underground utility layers turn planning from guesswork into evidence.',
        w4lbl:'Live access', w4:'Deployed at Chulalongkorn University, Bangkok\'s Siam–Samyan district. Open access — no account required.',
        cta:'Open live system',
      },
      p14: {
        title: 'Bloomberg signals. <em>Thai market. Your rules.</em>',
        lede: 'DayTraders is a personalized Thai market intelligence platform — Bloomberg-style signals applied to SET, MAI, mutual funds, RMF, and Thai ESG instruments. Graham, Buffett, and Munger frameworks built in; you set the KPIs that matter to your portfolio.',
        w1lbl:'Why it\'s special', w1:'Thai retail investors get either raw broker data or generic apps that don\'t apply value-investing logic. <b>DayTraders brings institutional-grade signal analysis to the Thai SET</b> — with Graham margin-of-safety, Buffett moat screens, and Munger mental models built into the feed, not bolted on.',
        w2lbl:'What it replaced', w2:'Broker portals with no analytical framework, LINE group tips, and the assumption that rigorous value investing is only for institutions with Bloomberg terminals.',
        w3lbl:'Decision power', w3:'Personalized KPI dashboards let investors track exactly the metrics they use — not a generic screener. Covers SET equities, MAI growth stocks, RMF tax-efficient funds, and Thai ESG instruments in one surface.',
        w4lbl:'Live access', w4:'Live Thai market data. Open platform — no paywall, no broker lock-in.',
        cta:'Open live platform',
      },
      p15: {
        title: 'Name the city. <em>We\'ll build its brain.</em>',
        lede: 'City Hub is a replicable city intelligence platform — give it a city name, and it maps it with satellite and base layers, absorbs whatever data you have, connects APIs and sensors, and starts synthesizing the picture. v.5 with five cities live: Bangkok, Chiang Mai, Phuket, Singapore, Kuching.',
        w1lbl:'Why it\'s special', w1:'Most city platforms are custom-built for one city, one budget cycle, no portability. <b>City Hub treats the intelligence layer as a template</b> — any city can onboard, import whatever data already exists, and the system starts connecting the dots. No year-long procurement. The brain builds itself from what\'s already there.',
        w2lbl:'What it replaced', w2:'Custom one-off dashboards with no cross-city learning, no AI synthesis, and no ability to detect where citizen data outpaces official infrastructure. The Bangkok SIT ROOM now tracks air quality, flood risk, heat, civic issues, and disease alerts — synthesized daily by AI.',
        w3lbl:'Decision power', w3:'The AI brief synthesizes all live city feeds into a morning briefing: gap detection (where citizen reports exist but official polygons don\'t), actionable items, PM2.5 provincial ranking, and a five-day weather forecast. A +24H timeline scrubber lets operators replay the city\'s last day of data.',
        w4lbl:'Live access', w4:'Platform at v.5. Five cities active: Bangkok, Chiang Mai, Phuket, Singapore, Kuching. Any city can onboard — bring whatever data you have.',
        cta:'Open live platform',
      },
      p16: {
        title: 'A coastal province, <em>rendered as a control tower.</em>',
        lede: 'Chonburi Control Tower is a 3D command surface for the Eastern Seaboard: 42 live sources, coastal weather and marine state, market and tourism signals, mayoral incident feeds, EEC trends, and building-scale overlays in one operational lens.',
        w1lbl:'Why it\'s special', w1:'Most provincial dashboards flatten the city into cards and charts. <b>Chonburi Control Tower renders the province as an operating environment</b> — 20,877 3D buildings, source health, weather, marine risk, EEC news, CCTV/AIS/AQ/WX toggles, and a mayor\'s desk on one surface.',
        w2lbl:'What it replaced', w2:'Separate weather sites, marine dashboards, market tickers, tourism spreadsheets, news tabs, and static GIS layers that never told the same story at the same time.',
        w3lbl:'Decision power', w3:'Operators can see live and degraded system states, trend panels for the Chonburi EEC, civic layers, source counts, and mayoral incidents while staying inside a 3D map that preserves geographic context.',
        w4lbl:'Live access', w4:'Public control tower for Chonburi Town Center and the Eastern Seaboard. Built for quick operational reading, not a static planning report.',
        cta:'Open control tower',
      },
      p17: {
        title: 'Thai paperwork, <em>read by the machine.</em>',
        lede: 'Ekkasarn AI is a Thai document intelligence engine for tax invoices, receipts, and withholding tax certificates. Upload a real document or pick a sample; the system runs OCR, classifies the document, and extracts usable fields without mock data or a required login.',
        w1lbl:'Why it\'s special', w1:'Most OCR demos work only on clean, invented forms. <b>Ekkasarn AI reads real Thai paperwork</b> — crumpled receipts, VAT invoices, and withholding certificates — then returns category, confidence, shop, phone, and total as structured output.',
        w2lbl:'What it replaced', w2:'Manual accounting entry, receipt photo backlogs, spreadsheet categorization, and the fragile handoff between Thai paper documents and digital finance workflows.',
        w3lbl:'Decision power', w3:'A finance team can classify documents, verify extracted fields, and route them into downstream accounting logic immediately instead of waiting for human sorting.',
        w4lbl:'Live access', w4:'Public bilingual demo with Thai-first document types. Uploads are processed live and not retained.',
        cta:'Open live system',
      },
      p18: {
        lede: 'KMITL Control Tower is a real-time operations dashboard for King Mongkut\'s Institute of Technology Ladkrabang — 56 live data feeds across traffic, incidents, air quality, satellite imagery, campus shuttles, news, and emergency events for Bangkok\'s Lat Krabang district.',
        cta:'Open live system',
      },
      p19: {
        lede: 'Yala Control Tower provides real-time civic intelligence for Yala City Municipality in Thailand\'s Deep South. A 3D city model, satellite layers, flood watch, Deep South security incidents, and over 30 live data feeds.',
        cta:'Open live system',
      },
      p20: {
        lede: 'Horizon 45 is a field instrument designed to test actual AI judgment. From deepfake detection to prompt engineering, users navigate real-world signals and leave with a capability portrait and learning roadmap.',
        cta:'Open live system',
      },
      p21: {
        lede: 'A massive-scale command surface for Ho Chi Minh City. Integrates live traffic, flood monitoring, air quality, and dynamic routing into a single high-performance map for urban decision-makers.',
        cta:'Open live system',
      },
      p33: {
        lede: 'Command surface for Muang Thong Thani — IMPACT Arena, Challenger halls, flood watch, traffic, AQI, and event load on one 3D district map. Built for operators running Thailand\'s densest mixed-use complex.',
        cta:'Open live system',
      },
      p22: {
        lede: 'Monitoring three regions (Middle East, Southeast Asia, Thailand): an ultimate monitoring platform based on open data that reveals insights through layering.',
        cta:'Open live system',
      },
      p23: {
        lede: 'The official Smart City Thailand Index (SCITI) evaluating the progress and impact of 174 urban areas across the country based on the 7 Smart City pillars.',
        cta:'Open live system',
      },
      p24: {
        lede: 'A trilingual Dao De Jing reading room with Tsai comics, Buddhist parallels, psychology notes, pinyin, and a living reference shelf.',
        cta:'Open live system',
      },
      ikigai: {
        name: 'Ikigai Finance Engine',
        lede: 'SME finance intelligence — balance sheet as signal, cash runway, bank scorecard, and composite finance indices (Ikigai, Lean, Zero, Default, Solvency). Development-stage research prototype; screenshots only — ABC Company Limited is fictitious mock data. No live deployment yet.',
        cta: 'View research repo',
      },
      p27: {
        lede: 'AirDash is a 24/7 Thailand air quality and dust watch — province watch ranking, 3-day CAMS-minus-rain forecast, top-5 AT-risk and PM2.5 provinces, washout logic, and a national pattern donut on one surface. Built so every Thai province can read the same air picture from the same public data.',
        cta: 'Open live system',
      },
      p28: {
        lede: 'The FloodDash Blueprint is the open research companion to the live Thailand Flood Watch — sensor network, drainage logic, AI flood prediction, response playbooks, and the full data-to-decision pipeline laid out for any city to read, fork, and adapt. The blueprint that makes the system replicable, not a one-off.',
        cta: 'View on GitHub',
      },
      p29: {
        lede: "Paste a draft. The Non-Writer runs it through a chain of proxies and boxes, and comes out the other side as the sentence you meant to write — in the voice Dr Non would have used. Now also translates into any language you ask for.",
        cta: 'Open live system',
      },
      p30: {
        lede: "The desk, by the numbers. A daily intelligence brief on the AI frontier — what's actually shipping, what is hot air, and what to read tonight. Sector watch, manual picks, and an archive that compounds.",
        cta: 'Open live system',
      },
      p31: {
        lede: 'Scraping as a service — no code. Hand it a URL and a question; it goes out, reads the page in the source language, and comes back with the answer in yours, with citations and structured JSON you can pipe downstream.',
        cta: 'Open live system',
      },
    },
    stagesContent: {
      taipeiLoc:'Taipei · City Vision Stage · March 2026',
      taipeiTitle:'Live dashboard, demo\'d in 45 minutes.',
      taipeiLede:'Keynote at the Smart City Summit & Expo. Working surface in the room, not concept art. SLIC went live during the talk: 157 cities, five pillars, adjustable ranking logic.',
      taipeiQuote:'"We didn\'t build an index for the shelf. We built a command system for the street. You build the ranking; we build the reality."',
      taipeiCite:'— Dr. Non, Taipei keynote',
      taipeiS1:'Cities indexed', taipeiS2:'Nations represented', taipeiS3:'Intel partners', taipeiS4:'First live demo',
      sgLoc:'Singapore · Marina Bay Sands · Main Stage · April 2026',
      sgTitle:'Standing room only.',
      sgLede:'Main-stage keynote at GITEX AI Asia. Then a workshop on Government Innovation as a Service that hit capacity within minutes — standing room taken, hallway full, every face locked on the live demo.',
      sgQuote:'"The room was standing-room only. That is not applause — that is a demand signal. Governments want working systems. They are tired of waiting for the deck."',
      sgCite:'— Dr. Non, post-keynote',
      sgS1:'Main stage audience', sgS2:'Total attendees', sgS3:'Nations represented', sgS4:'Workshop capacity',
      leapLoc:'LEAP East 2026 · Orbital Stage · Jul 10',
      leapTitle:"Asia's largest stage. FloodDash launches here.",
      leapLede:'Panel on the Orbital Stage — "From Congestion to Connection: The Tech Powered Future of Transport in Asia." Dr. Non Arkara, Senior Expert Smart City Promotion at DEPA, joined Mitchell Price, Richard Chung, and Will Peters to close the Q1–Q2 arc with a live FloodDash launch.',
      leapQuote:'"Three stages in six months. Taipei indexed the cities. GITEX filled the room. LEAP East shipped the flood watch — live, public, and running before we left the stage."',
      leapCite:'— Dr. Non, LEAP East panel',
      leapS1:'Main stage tier', leapS2:'Panel speakers', leapS3:'Live data sources', leapS4:'FloodDash at launch',
    },
    teamContent: {
      founderLabel:'Co-Founders · Bangkok',
      collectiveTitle:'The collective, on call.',
      collectiveLede:'Researchers, traffic engineers, anthropologists, financiers, policy translators, and media operators. They join by problem, not by org chart. We pay for the brains we need, when we need them.',
      probonoTitle:'Pro bono · Institutional work',
      probonoNote:'These are live, working platforms — not decks or reports. Each one was built with real institutional partners, deployed publicly, and is still in use. Click through and see what the work actually looks like when it ships.',
      pb1org:'For ASEAN Secretariat', pb1title:'38 cities. 10 nations. One platform.', pb1for:'ASEAN Smart Cities Network',
      pb2org:'ASEAN · UNDP · UN-Habitat', pb2title:'112,000 users. Born from real flooding.', pb2for:'ASEAN CSCO Handbook',
      pb3org:'UN DESA · Solomon Islands Gov.', pb3title:'Whole-of-government digital roadmap.', pb3for:'Honiara · Two-day workshop',
      pb4org:'For depa Thailand', pb4title:'Thailand\'s digital agency, online.', pb4for:'Smart City Leadership · Bilingual',
      pb5org:'depa · US DOT', pb5title:'Fieldwork to software. City systems toolkit.', pb5for:'US-ASEAN Smart Cities Partnership',
    },
    notesContent: {
      foldLine:'Field notes · 6 patterns · how we ship',
      kicker:'How it gets built',
      title:'Things learned by actually shipping.',
      lede:'Ten systems. Two people. Twelve months. These are the patterns that held — and the ones that didn\'t. Published here because the gap between what governments need and what the market supplies only closes if people share what they\'ve figured out.',
      n1title:'The vendor said no. We shipped in fourteen days.',
      n1body:'Every system on this page started because a procurement cycle, a vendor quote, or a committee said the problem was too complex or too expensive. The answer was never to argue — it was to build a rough working version and put it in the room. A live surface changes the conversation faster than any proposal.',
      n2title:'AI-native is not AI-assisted.',
      n2body:'Every line of code across these ten systems was written by Claude Code, directed by Dr Non. The AI is the engineer. The human is the architect. This isn\'t a shortcut — it\'s a different model of who does what. Knowing how to direct AI precisely is the skill that compounds. The code is not the hard part.',
      n3title:'The problem is never the data. It\'s always the decision behind the data.',
      n3body:'Clients ask for dashboards. What they need is clarity on one decision that must get faster or better. Find that decision first. Everything else — the feeds, the stack, the interface — flows from it. Skip this step and you build a beautiful dashboard nobody checks after the launch week.',
      n4title:'An org chart tells you who reports to whom. It tells you nothing about who should build what with whom.',
      n4body:'TKCX was built on this gap. Game archetypes, readiness scores, and a Moneyball salary cap exposed what the org chart hid: the right people for a given project, the chemistry between them, and the skill gaps that will surface midway through. Treat talent like a portfolio, not a headcount.',
      n5title:'A single AI answers. A council deliberates.',
      n5body:'For decisions that matter, a single model gives you one framing — the one baked into its training. The AI Council runs eleven justices with different priors, explicit moves (EXPAND, QUALIFY, CONCEDE, STAND, PASS), and a shared transcript everyone reads before speaking. The disagreement is the product. You leave with a more defensible position than you started with.',
      n6title:'Instrument from day one. Not after.',
      n6body:'Every Axiom system ships with a data trail: pageviews, usage signals, decision logs. Not because we need the analytics on day one — but because retrofitting measurement onto a live system is nearly impossible, and the next version is always built from what the first version taught you. Leave a record. Future you will need it.',
      stackNote:'Local-first. No build team. No vendor lock-in. The M5 Max runs inference, builds, and deploys from one desk in Bangkok.',
    },
    builtStack: {
      heading:'Built with', meta:'114 tools · 9 layers',
      expandFull:'Full technology stack',
      l1name:'Cloud Infrastructure', l1role:'where it runs',
      l2name:'Framework & Connectors', l2role:'what wires it',
      l3name:'Platform & Build Tools', l3role:'where we build',
      l4name:'AI Models & Engines', l4role:'the intelligence',
      l5name:'Software & Libraries', l5role:'the working parts',
      l6name:'Languages', l6role:'the source',
      l7name:'Live Data Sources', l7role:'the inputs',
      l8name:'Channels', l8role:'the outputs',
      l9name:'Local Runtime', l9role:'the desk',
      legend:'<span data-runtime="cloud">cloud</span><span data-runtime="local">// local</span>',
    
      expandHint:'9 layers · 117 tools · built and run from one desk in Bangkok. Click below for the full list.',},
    brandSect: {
      foldLine:'Brand Kit · 8 sheets · download available',
      kicker:'Brand Kit',
      meta:'8 sheets · Axiom Identity System',
      lede:'Cover, logo, colors, type, layout — eight sheets. Download the package or browse every sheet.',
      downloadCta:'Download Brand Kit',
      expandAll:'View all brand sheets',
    },
    pressSection: {
      foldLine:'Press · 7 articles · GovInsider, ASEAN Magazine, YouTube',
      kicker:'In the press', title:'Read. Watch. Decide.', lede:'Outside coverage of the work, the thesis, and the systems.',
    },
    pressContent: {
      p1title:'With the vendor saying no, Thai civil servant built his own tools',
      p2title:'Can Innovation-as-a-Service close the gap between policy and implementation?',
      p3title:'They built the index, but you build the ranking',
      p4title:'On digital connectivity, open innovation, and why smart cities only work when inclusion scales',
      p5title:'How AI is mining city data cheaply and making them smarter',
      p6title:'Why smart cities need citizens, not just technology',
      p7title:'Middle East War Monitor — live conflict signal across the region',
    },
    credentialsSect: {
      foldLine:'Axiom X Co., Ltd. · Reg. 0105569099335 · Thailand · DBD registered',
      kicker:'Credentials',
      eyebrow:'Entity',
      title:'Legally registered in Thailand',
      compactLine:'Axiom X Co., Ltd. · Reg. 0105569099335 · Thailand · DBD registered',
      tradeNameNote:'This site and our services are presented under the trade name Axiom. The registered legal entity is Axiom X Co., Ltd. (Thailand).',
      summaryToggle:'Registration & standards details',
      companyTitle:'Registered entity',
      nameLbl:'Company name',
      nameTh:'บริษัท แอคเซี่ยม เอ็กซ์ จำกัด',
      nameEnLbl:'English name',
      nameEn:'Axiom X Co., Ltd.',
      regNoLbl:'Registration no.',
      regDateLbl:'Registered',
      regDate:'28 May 2026 (28 พ.ค. 2569)',
      jurisdictionLbl:'Jurisdiction',
      jurisdiction:'Kingdom of Thailand',
      addressLbl:'Registered address',
      address:'16 Soi Phahonyothin 59 Yaek 1, Anusawari, Bang Khen, Bangkok',
      authorityLbl:'Issuing authority',
      authority:'Department of Business Development, Ministry of Commerce',
      capitalLbl:'Registered capital',
      capital:'THB 1,000,000',
      businessLbl:'Core business scope',
      business:'Technology, AI, digital systems, smart-city consulting, innovation services',
      standardsTitle:'Standards alignment',
      standardsMeta:'4 tiers · practice-based',
      standardsLede:'We design and deliver against these frameworks. This is operational alignment — not a claim of formal ISO certification unless independently audited and stated.',
      tier1:'Foundational standards',
      tier2:'Governance standards',
      tier3:'Legal frameworks',
      tier4:'Ethics frameworks',
      t1i1:'ISO/IEC 30173:2023 — digital twin concepts',
      t1i2:'ISO 23247 — digital twin framework',
      t1i3:'IEC / ISO / IEEE digital-twin ecosystem',
      t1i4:'NIST digital twin programme',
      t2i1:'ISO/IEC JTC 1 — ICT standards base',
      t2i2:'Interoperability & data-exchange frameworks',
      t2i3:'ISO/IEC 42001 — AI management system',
      t2i4:'ISO/IEC 23894 — AI risk management',
      t2i5:'NIST AI RMF',
      t3i1:'PDPA — Thailand Personal Data Protection Act',
      t3i2:'GDPR — advisory alignment for EU-facing work',
      t3i3:'Sectoral privacy & trust guidelines',
      t4i1:'OECD AI Principles',
      t4i2:'UNESCO AI Ethics Recommendation',
      t4i3:'Transparency · fairness · human oversight',
      t4i4:'Safety · robustness · accountable deployment',
      stackTag:'Stack',
      stackCallout:'Recommended reference stack: ISO/IEC 30173 + ISO 23247 + ISO/IEC 42001 + ISO/IEC 23894 + PDPA + GDPR',
      disclaimer:'Alignment means we design and operate to these frameworks in our delivery practice. It does not imply formal certification, accreditation, or third-party audit unless explicitly stated and evidenced.',
    },
  },

  th: {
    panels: {
      p01: {
        title: 'ห้องสั่งการของผู้ว่าฯ <em>ในแท็บเบราว์เซอร์</em>',
        lede: 'ข้อมูลการจราจร ความปลอดภัยสาธารณะ และสิ่งแวดล้อมของภูเก็ต รวมไว้ในจอเดียวที่ผู้ว่าฯ อ่านเข้าใจได้ภายใน 30 วินาที สร้างเสร็จในไม่กี่สัปดาห์ ไม่ใช่รอวงจรจัดซื้อหลายปี',
        w1lbl:'จุดที่พิเศษ', w1:'แดชบอร์ดของภาครัฐส่วนใหญ่คือ PDF อ่านอย่างเดียวที่แอบใส่หน้าซอฟต์แวร์ ของภูเก็ตคือห้องสั่งการจริง การจราจร ความปลอดภัย และสิ่งแวดล้อมหลอมรวมในจอเดียว รีเฟรชทุก 42 มิลลิวินาที ผู้ว่าฯ อ่านเองได้ ไม่ต้องผ่านนักวิเคราะห์มาตีความให้ฟัง',
        w2lbl:'สิ่งที่ถูกแทนที่', w2:'รายงานสามหน่วยงานที่ต่างคนต่างทำ เครือข่ายส่ง SMS แจ้งเตือน และคิวประชุมบรีฟเช้าวันอังคาร',
        w3lbl:'ได้ตั้งแต่วันแรก', w3:'สร้างบนโครงสร้าง IoT ที่มีอยู่แล้วของจังหวัด ไม่ต้องจัดซื้อฮาร์ดแวร์ใหม่', cta:'เปิดระบบสด',
      },
            p03: {
        title: 'ระบบราชการ <em>ที่อ่านออก</em>',
        lede: 'ผมสร้างหน้าเว็บสาธารณะให้โครงการเมืองอัจฉริยะแห่งชาติของไทย ร่วมกับ depa ข้อเสนอเข้ามา ความคืบหน้าเห็นได้ตลอด โครงการไม่หายเข้าไปใน PDF อีกต่อไป',
        w1lbl:'จุดที่พิเศษ', w1:'โครงการระดับชาติส่วนใหญ่อยู่ในรายงานประจำปีที่ไม่มีใครอ่าน อันนี้ออนไลน์ สองภาษา และผูกกับผลลัพธ์ ไม่ใช่พิธีการ สถานะของเมืองที่สมัครเปลี่ยนทันทีเมื่อผ่านหมุดหมาย',
        w2lbl:'ผู้สนับสนุน', w2:'depa สำนักงานส่งเสริมเศรษฐกิจดิจิทัล ทำงานตรงกับภาครัฐ ไม่ใช่ในฐานะผู้รับเหมาช่วง',
        w3lbl:'ความสำคัญ', w3:'เป็นต้นแบบให้โครงการเมืองอัจฉริยะระดับชาติที่อยากให้คนยังอ่านเข้าใจหลังรอบข่าวเปิดตัวจบ SLIC ต่อเข้ามาเป็นชั้นจัดอันดับเปรียบเทียบ', cta:'เปิดระบบสด',
      },
      p04: {
        title: 'การจัดอันดับ <em>ที่โต้กลับได้</em>',
        lede: 'SLIC Index ไม่บอกเมืองว่ามีค่าเท่าไร แต่แสดง 5 เสาหลักให้เมืองทดสอบลำดับความสำคัญของตัวเอง นายกเทศมนตรีตัดสินว่าคำว่า "เมืองน่าอยู่" หมายถึงอะไร แล้วคณิตศาสตร์ค่อยตามมา',
        w1lbl:'จุดที่พิเศษ', w1:'ดัชนีเมืองน่าอยู่อื่น ๆ ส่งคำตัดสินสำเร็จรูปให้เมือง SLIC ส่งคณิตศาสตร์ให้ ปรับน้ำหนักเสาหลักได้เอง อันดับของคุณและของคู่แข่งขยับให้เห็นแบบสด การถกเถียงกลายเป็นตัวผลิตภัณฑ์',
        w2lbl:'สิ่งที่ถูกแทนที่', w2:'ลีดเดอร์บอร์ดศักดิ์ศรีแบบหยุดนิ่ง PDF จัดอันดับประจำปี และบทสนทนาที่จบลงด้วย "เราไม่เห็นด้วยกับวิธีคิด"',
        w3lbl:'สัญญาณจากผู้ชม', w3:'Mayors of Europe นำไปใช้ Demo สดที่ SCSE Taipei ใน 45 นาที ถูกมองเป็นการถกเถียงเชิงพลเมือง ไม่ใช่ moodboard', cta:'เปิด SLIC v3',
      },
      p05: {
        title: 'มหานครกูชิง <em>หนึ่งจอบัญชาการ</em>',
        lede: 'IOC ครบวงจรของมหานครกูชิง รัฐซาราวัก อัตราแลกเปลี่ยน เที่ยวบิน ภาพดาวเทียม และสัญญาณสิ่งแวดล้อม รวมไว้ให้ทีมที่บริหารเมืองอัจฉริยะที่โตเร็วที่สุดในเอเชียตะวันออกเฉียงใต้',
        w1lbl:'จุดที่พิเศษ', w1:'IOC ส่วนใหญ่ดูแลโดเมนเดียว กูชิงหลอมรวมสัญญาณข้ามโดเมนในมุมเดียว แรงกดดันค่าเงิน เที่ยวบินขาเข้า การสแกน Sentinel-2 ค่าสิ่งแวดล้อม ไม่ต้องสลับแท็บเพื่อเห็นภาพรวม',
        w2lbl:'ผู้ใช้งาน', w2:'ทีมปฏิบัติการและนักวางแผนของมหานครกูชิง สร้างมาเพื่อรับรู้สถานการณ์แบบเรียลไทม์ ไม่ใช่ห้องโชว์ แต่ใช้งานจริงทุกวัน',
        w3lbl:'ความสำคัญ', w3:'ความหนาแน่นของข้อมูลเหมือนที่ Bloomberg terminal ให้โต๊ะเทรด แต่สำหรับเมือง ในราคาเศษเสี้ยว', cta:'เปิดระบบสด',
      },
      p06: {
        title: 'ข่าว <em>ก่อนอัลกอริทึมจะตัดสินว่าอะไรคือสงคราม</em>',
        lede: 'MEM คือหน้าข่าวโอเพนซอร์สที่เร็วที่สุดสำหรับสถานการณ์ความขัดแย้งในตะวันออกกลาง ฟีดสดจากหลายแหล่ง ไม่มีดีเลย์จากกองบรรณาธิการ ไม่มีฟิลเตอร์บับเบิล สัญญาณก่อนรอบข่าวจะมาถึง',
        w1lbl:'จุดที่พิเศษ', w1:'ทุกแพลตฟอร์มข่าวใหญ่มีชั้นบรรณาธิการที่หน่วงเวลา กรอง และตีกรอบ MEM ตัดชั้นนั้นออก สัญญาณเดียวกับที่นักวิเคราะห์รวบรวมเองทีละชิ้น แต่อยู่ในจอเดียวด้วยความเร็วเครื่องจักร',
        w2lbl:'สิ่งที่ถูกแทนที่', w2:'แท็บเบราว์เซอร์สามแท็บ Telegram สองห้อง และ Twitter/X อีกหนึ่งลิสต์ ที่เปิดพร้อมกันเพื่อเช็กว่าจริง ๆ บนพื้นที่เกิดอะไรขึ้น',
        w3lbl:'ผู้ใช้งาน', w3:'นักข่าว นักวิเคราะห์นโยบาย ทีมภาคสนาม NGO ใครก็ตามที่ต้องการสัญญาณภาคพื้นเร็วกว่าที่รอบข่าว 24 ชั่วโมงจะส่งให้ได้', cta:'เปิดระบบสด',
      },
      p07: {
        title: 'รถเมล์ถูกติดตาม <em>ผู้โดยสารได้รับข้อมูล</em>',
        lede: 'ติดตาม GPS แบบเรียลไทม์และข้อมูลผู้โดยสารของเครือข่ายรถเมล์อัจฉริยะภูเก็ต ออกแบบสำหรับมือถือผู้โดยสารก่อน ไม่ใช่จอห้องคอนโทรล ใช้งานได้บนถนน ในแดด ด้วยนิ้วเดียว',
        w1lbl:'จุดที่พิเศษ', w1:'ระบบรถเมล์อัจฉริยะส่วนใหญ่สร้างให้แดชบอร์ดของผู้ปฏิบัติการ อันนี้สร้างให้คนรอที่ป้าย ตำแหน่งรถ เวลามาถึงครั้งหน้า เส้นทางที่ชัดเจน สำหรับนักท่องเที่ยวที่อ่านไทยไม่ออกและคนทำงานที่ไม่มีเวลาเดา',
        w2lbl:'สิ่งที่ถูกแทนที่', w2:'การยืนรอที่ป้ายโดยไม่มีข้อมูล ตารางเดินรถที่พิมพ์ไว้ตั้งแต่ปี 2562 และข้อสันนิษฐานว่าระบบขนส่งบนเกาะท่องเที่ยวทำให้อ่านง่ายไม่ได้',
        w3lbl:'สร้างต่อยอดบน', w3:'โครงสร้าง IoT ที่มีอยู่ของภูเก็ต ชั้นเซ็นเซอร์ตัวเดียวกับที่ป้อนห้องสั่งการของผู้ว่าฯ ไม่ต้องลงทุนฮาร์ดแวร์ใหม่', cta:'เปิดระบบสด',
      },
      p08: {
        title: 'รายงานเข้ามา <em>AI เปลี่ยนเป็นการลงมือ</em>',
        lede: 'SCTH V2 คือแพลตฟอร์มข้อมูลเมืองของ Smart City Thailand ที่รับรายงานจากพลเมืองผ่าน Telegram และ LINE วิเคราะห์ปัญหาด้วย AI และซ้อนชั้นดาวเทียมและแผนที่แบบเกือบเรียลไทม์ ให้ผู้สร้างเมือง ผู้พัฒนาเมือง และผู้บริหารเมือง',
        w1lbl:'จุดที่พิเศษ', w1:'ระบบร้องเรียนของเมืองส่วนใหญ่จบที่หมายเลข ticket SCTH V2 เปลี่ยนสตรีมรายงานให้กลายเป็นจอตัดสินใจ รายงานจาก Messenger ภาพภาคสนาม ความเสี่ยง SLA และการตรวจจับรูปแบบของ AI อยู่บนแผนที่เดียวกับชั้นฝน ละออง เมฆ ภูมิประเทศ และถนน',
        w2lbl:'สิ่งที่ถูกแทนที่', w2:'ภาพแคปจากกลุ่มแชต การคัดแยกด้วย Excel ด้วยมือ ชั้นแผนที่ที่หยุดนิ่ง และช่องว่างระหว่าง "มีคนรายงาน" กับ "มีคนลงมือทำ"',
        w3lbl:'อำนาจตัดสินใจ', w3:'ทีมเมืองรับรายงาน มอบหมายผู้รับผิดชอบ วิเคราะห์รูปแบบที่เกิดซ้ำ ส่งออก sheet หรือ PDF และผลักงานตอบสนองในขณะที่บริบทเมืองยังสด',
        w4lbl:'การเข้าถึงสด', w4:'ระบบเป็นกรรมสิทธิ์ พัฒนาต่อเนื่องทุกวัน ลิงก์รันผ่าน tunnel แบบสด ถ้าเข้าไม่ได้แปลว่าระบบกำลังอัปเกรด ลองใหม่อีกสักครู่', cta:'เปิดระบบสด',
      },
      p09: {
        title: 'สิบเอ็ดเสียง <em>หนึ่งคำตัดสิน</em>',
        lede: 'AI Council คือระบบไตร่ตรองหลายเอเจนต์ส่วนตัวของผม ตุลาการ AI 11 คนที่ตั้งชื่อแบบ palindrome (Tenet, Radar, Otto, Hannah, Ada…) ทำงานต่อเนื่องบน Mac ส่วนตัว ถกเถียงกันผ่าน transcript log ที่ใช้ร่วมกัน ในราคาประมาณ 3 ดอลลาร์ต่อเดือน ฝึกบนบันทึกส่วนตัว การตัดสินใจ และเสียงของผม กรรมสิทธิ์โดยการออกแบบ ไม่ใช่บังเอิญ',
        w1lbl:'เหตุผลที่มีอยู่', w1:'โมเดลเดี่ยวให้คำตอบเดียว ปัญหาที่ควรค่าแก่การแก้สมควรได้รับการถกเถียง Council รันสี่โหมด — VERIFY, DECIDE, EXPLORE, DEBATE — และตุลาการใช้คำสั่งที่ชัดเจน (EXPAND, QUALIFY, CONCEDE, STAND, PASS) การเปลี่ยนจุดยืนทุกครั้งจึงมองเห็นและตามรอยได้',
        w2lbl:'ต้นทุน', w2:'ความสามารถระดับ Manus autonomous-agent ในราคา 3 ดอลลาร์ต่อเดือน ประธาน Council รันบน Mistral Large 3 ผู้คลางแคลงสายไทย (Ada) รันบน ThaiLLM โมเดลของรัฐ ฟรี ผู้ปฏิบัติการ (Otto) ทำ OCR ดาวน์โหลดวิดีโอ ร่างอีเมล สร้าง PDF และซิงก์ Google Drive โดยไม่แตะคลาวด์',
        w3lbl:'ทำไมไม่มีเดโม', w3:'Council ฝึกบนบันทึกส่วนตัว การตัดสินใจ บันทึกประชุม และเสียงของผม กรรมสิทธิ์เพราะจำเป็น โปรโตคอลสแต็ก Python ราว 600 บรรทัด เปิดสาธารณะ ทรัพย์สินทางปัญญาคือวิธีการประสานงาน ไม่ใช่น้ำหนักของโมเดล', cta:'v1 · DIY Protocol', cta2:'v2 · Agentic + Executor',
      },
      p10: {
        title: 'HR เป็น<em>ระบบบันทึก</em>มานานพอแล้ว',
        lede: 'Talent Knowledge Collaborative Explorers (TKCX) คือระบบปฏิบัติการด้านบุคลากรที่ใช้กลไกของเกม มองพนักงานเป็นสมาชิกปาร์ตี้ โครงการเป็นเควสต์ และการประกอบทีมเป็นกลยุทธ์ ทำให้ทุกการตัดสินใจเรื่องคนมองเห็นได้ วัดได้ และผูกกับผลลัพธ์ แทนการเมืององค์กรด้วยข่าวกรองเรื่องขีดความสามารถ',
        w1lbl:'ปัญหา', w1:'ระบบ HR ส่วนใหญ่คือบันทึกการปฏิบัติตาม ไม่ใช่ข่าวกรอง บอกว่าใครเป็นพนักงาน ไม่ได้บอกว่าใครควรไปทำอะไร ที่ไหน กับใคร การตัดสินใจเรื่องคนใช้สัญชาตญาณและทุนทางการเมือง คนเก่งที่สุดลาออก คนที่อยู่สบายคงอยู่ ไม่มีใครเห็นว่าทำไม',
        w2lbl:'เครื่องยนต์', w2:'สร้างบนระบบปาร์ตี้ของ Dragon Quest III ห้า archetype จับคู่กับบทบาทจริงในที่ทำงาน (captain, tech, sales, ops, scout) เพดานงบแบบ Moneyball งบโครงการหารด้วย 10 = เพดานเงินเดือนรายเดือน บีบให้มีวินัยในการจัดสรร สูตรความพร้อมถ่วงน้ำหนัก coverage คุณภาพ chemistry และขวัญกำลังใจ ทีมที่ใช่จึงมองเห็นได้ก่อนโครงการเริ่ม ไม่ใช่หลังจากล้ม',
        w3lbl:'สิ่งที่เปลี่ยนไป', w3:'ผู้อำนวยการเลิกกักตุนคน โครงการเลิกขับเคลื่อนด้วยทุนการเมือง ช่องว่างทักษะมองเห็นได้ก่อนกลายเป็นความล้มเหลว และ HR ที่เปลี่ยนชื่อเป็น Talent Incubation กลายเป็นฟังก์ชันที่มียุทธศาสตร์มากที่สุดในตึก ไม่ใช่ฟังก์ชันที่ทุกคนหลีกเลี่ยง', cta:'GitHub repo — เร็ว ๆ นี้',
      },
      p11: {
        title: 'AI <em>ที่รู้จักคุณ</em>',
        lede: 'Second Brain OS เชื่อม Obsidian vault ของคุณเข้ากับทุกแพลตฟอร์ม AI coding พร้อมกันผ่าน MCP โครงสร้างโฟลเดอร์ตามกายวิภาคของสมอง 19 server config เอเจนต์ AI ที่อ่าน persona blueprint ของคุณ เขียนด้วยน้ำเสียงของคุณ และจำทุกการตัดสินใจที่เคยบันทึก ความรู้ที่สั่งสมมาหลายปี ในที่สุดก็ทำงานให้คุณได้',
        w1lbl:'ช่องว่างที่ปิด', w1:'ทุก session ของ AI เริ่มจากศูนย์ ไม่รู้น้ำเสียงของคุณ ค่านิยม การตัดสินใจในอดีต หรือบันทึกหลายปีที่หล่อหลอมความคิด Second Brain OS ส่งทั้งหมดนั้นเข้าทุกแพลตฟอร์ม coding พร้อมกันผ่าน MCP เส้นเดียว AI ที่คุณทำงานด้วยจึงรู้แล้วว่ากำลังทำงานกับใคร',
        w2lbl:'วิธีสร้าง', w2:'Obsidian vault ของคุณถูกจัดเหมือนสมอง: PrefrontalCortex สำหรับกลยุทธ์ Hippocampus สำหรับความจำเชิงอะตอม TemporalLobe สำหรับรูปแบบ Cerebellum สำหรับทักษะและขั้นตอน 19 MCP server config เชื่อมแผนภาพความรู้ที่มีชีวิตนี้กับ Cursor, Codex, Claude Code และทุกแพลตฟอร์มในสแต็กของคุณพร้อมกัน',
        w3lbl:'ทำไมเปิดให้คนนำไปใช้', w3:'สถาปัตยกรรมเป็น MIT-licensed สมองเป็นของคุณ ใครก็ตาม fork โครงสร้าง ปรับ MCP config และต่อ vault ของตัวเองได้ มีเครื่องมือวินิจฉัย 12 ระดับสำหรับขจัด AI-speak ออกจากการเขียน เพื่อให้ความรู้ที่สั่งสมยังคงเป็นน้ำเสียงของคุณ ไม่ใช่ของโมเดล', cta:'สำรวจสถาปัตยกรรม',
      },
      p12: {
        title: '21 ช่อง. <em>ฟรี. ทุกที่.</em>',
        lede: 'NSP คือแพลตฟอร์มสตรีมมิ่งแห่งชาติของไทย — ครบ 21 ช่องทีวีดิจิตอลที่ได้รับใบอนุญาตจาก กสทช. ฟรี FullHD บนทุกอุปกรณ์ EPG สด ข้อมูลผู้ชมรายช่อง ผู้ช่วย AI แนะนำรายการ และระบบเตือนภัยฉุกเฉิน CAP v1.2 รวมในหน้าจอเดียว',
        w1lbl:'ทำไมพิเศษ', w1:'แพลตฟอร์มทีวีแห่งชาติส่วนใหญ่เป็นแค่เว็บดูหลังบ้าน <b>NSP รวม 21 ช่องที่ได้รับใบอนุญาตไว้ในหน้าจอเดียว</b> พร้อม EPG สด ข้อมูล concurrency รายช่อง สุขภาพสตรีม และ AI ที่ตอบว่า "ตอนนี้มีอะไรน่าดู?" ทั่วทั้งประเทศ โดยไม่ต้องติดตั้งแอป',
        w2lbl:'แทนที่อะไร', w2:'แอปของแต่ละสถานีที่กระจัดกระจาย สตรีมผิดกฎหมาย และความเชื่อว่าทีวีฟรีทีวีทำให้ชัดเจนเท่า streaming subscription ไม่ได้',
        w3lbl:'อำนาจการตัดสินใจ', w3:'ผู้ดูแลระบบเห็น concurrency สด ส่วนแบ่งผู้ชมรายช่อง และสุขภาพสตรีมแบบเรียลไทม์ การผนวก CAP v1.2 หมายความว่าการแจ้งเตือนฉุกเฉินระดับชาติปรากฏผ่านช่องทางเดียวกับความบันเทิง ไม่ต้องมีระบบแยกต่างหาก',
        w4lbl:'เข้าถึงสด', w4:'ใช้งานจริงระดับประเทศภายใต้อำนาจการออกใบอนุญาตของ กสทช. เปิดให้ทุกอุปกรณ์ ไม่ต้องสมัครสมาชิก',
        cta:'เปิดแพลตฟอร์มสด',
      },
      p13: {
        title: '47 ฟีด. <em>7 มุมมอง. หนึ่งมหาวิทยาลัย.</em>',
        lede: 'Chula Control Tower คือแดชบอร์ดปฏิบัติการแบบเรียลไทม์ของจุฬาลงกรณ์มหาวิทยาลัย — 47 ฟีดข้อมูลสดครอบคลุมการจราจร เหตุการณ์ คุณภาพอากาศ ภาพถ่ายดาวเทียม รถบัส CU ข่าวสาร และเหตุฉุกเฉินในย่านสยาม–สามย่าน กรุงเทพฯ',
        w1lbl:'ทำไมพิเศษ', w1:'แดชบอร์ดมหาวิทยาลัยส่วนใหญ่แสดงข้อมูลทีละฟีด <b>CCT รวม 47 แหล่งข้อมูลสดบนแผนที่ 3D แผ่นเดียว</b> — การจราจร คุณภาพอากาศ ตำแหน่งรถบัส รายงานเหตุการณ์ ชั้นดาวเทียม และสาธารณูปโภคใต้ดิน เพื่อให้ผู้บริหารมีพื้นผิวเดียวสำหรับทุกการตัดสินใจ',
        w2lbl:'แทนที่อะไร', w2:'ระบบแยกกันสำหรับการจราจร ความปลอดภัย และข้อมูลสิ่งแวดล้อม รายงานเหตุการณ์แบบ manual ไม่มีมุมมองรวมของมหาวิทยาลัย ณ เวลาใดเวลาหนึ่ง',
        w3lbl:'อำนาจการตัดสินใจ', w3:'เจ็ดมุมมองปฏิบัติการ — จากการจัดการวิทยาเขตประจำวันถึงมุมมองเชิงกลยุทธ์ระดับผู้บริหาร — ให้แต่ละบทบาทเห็นสิ่งที่ต้องการพอดี อาคาร 3D และชั้นสาธารณูปโภคใต้ดินเปลี่ยนการวางแผนจากการเดาเป็นหลักฐาน',
        w4lbl:'เข้าถึงสด', w4:'ใช้งานจริงที่จุฬาลงกรณ์มหาวิทยาลัย ย่านสยาม–สามย่าน กรุงเทพฯ เข้าใช้ได้ฟรี ไม่ต้องสมัครสมาชิก',
        cta:'เปิดระบบสด',
      },
      p14: {
        title: 'สัญญาณ Bloomberg. <em>ตลาดไทย. กฎของคุณ.</em>',
        lede: 'DayTraders คือแพลตฟอร์มข่าวกรองตลาดไทยส่วนตัว — สัญญาณสไตล์ Bloomberg ใช้กับ SET, MAI, กองทุนรวม, RMF และ Thai ESG กรอบคิด Graham, Buffett และ Munger ฝังอยู่แล้ว คุณกำหนด KPI ที่สำคัญต่อพอร์ตของคุณเอง',
        w1lbl:'ทำไมพิเศษ', w1:'นักลงทุนไทยรายย่อยได้ข้อมูลดิบจากโบรกเกอร์หรือแอปทั่วไปที่ไม่ใช้ตรรกะ value investing <b>DayTraders นำการวิเคราะห์สัญญาณระดับสถาบันมาสู่ SET ไทย</b> — พร้อม margin-of-safety ของ Graham, ตัวกรอง moat ของ Buffett และ mental models ของ Munger ฝังในฟีด ไม่ใช่ต่อเติมทีหลัง',
        w2lbl:'แทนที่อะไร', w2:'พอร์ทัลโบรกเกอร์ที่ไม่มีกรอบวิเคราะห์ ทิปส์ในกลุ่ม LINE และความเชื่อว่า value investing ที่เข้มงวดมีแต่สถาบันที่มี Bloomberg terminal เท่านั้น',
        w3lbl:'อำนาจการตัดสินใจ', w3:'แดชบอร์ด KPI ส่วนตัวให้นักลงทุนติดตามตัวชี้วัดที่ตัวเองใช้จริง ไม่ใช่ screener ทั่วไป ครอบคลุม SET, หุ้น MAI, กองทุน RMF และ Thai ESG ในพื้นผิวเดียว',
        w4lbl:'เข้าถึงสด', w4:'ข้อมูลตลาดไทยสด แพลตฟอร์มเปิด ไม่มีค่าสมัคร ไม่ผูกกับโบรกเกอร์',
        cta:'เปิดแพลตฟอร์มสด',
      },
      p15: {
        title: 'บอกชื่อเมือง <em>ผมสร้างสมองให้</em>',
        lede: 'City Hub คือแพลตฟอร์มข่าวกรองเมืองที่ปรับใช้ซ้ำได้ — บอกชื่อเมือง ระบบแมปด้วยดาวเทียมและชั้นแผนที่ รับข้อมูลที่มีอยู่ เชื่อมต่อ API และเซ็นเซอร์ แล้วเริ่มสังเคราะห์ภาพรวม v.5 ห้าเมืองออนไลน์แล้ว: กรุงเทพฯ เชียงใหม่ ภูเก็ต สิงคโปร์ กูชิง',
        w1lbl:'ทำไมพิเศษ', w1:'แพลตฟอร์มเมืองส่วนใหญ่สร้างขึ้นสำหรับเมืองเดียว งบประมาณรอบเดียว ไม่สามารถนำไปใช้ใหม่ได้ <b>City Hub ถือว่าชั้นข่าวกรองเป็นเทมเพลต</b> — เมืองไหนก็เข้าร่วมได้ นำเข้าข้อมูลที่มีอยู่ และระบบเริ่มเชื่อมโยงจุดต่างๆ ไม่ต้องรอจัดซื้อยาวนาน สมองสร้างตัวเองจากสิ่งที่มีอยู่แล้ว',
        w2lbl:'แทนที่อะไร', w2:'แดชบอร์ดที่สร้างขึ้นครั้งเดียวโดยไม่มีการเรียนรู้ข้ามเมือง ไม่มีการสังเคราะห์ด้วย AI และไม่สามารถตรวจจับช่องว่างที่ข้อมูลพลเมืองนำหน้าโครงสร้างพื้นฐานทางการ Bangkok SIT ROOM ติดตามคุณภาพอากาศ น้ำท่วม ความร้อน ปัญหาเมือง และโรคระบาด — สังเคราะห์ทุกวันโดย AI',
        w3lbl:'อำนาจการตัดสินใจ', w3:'บรีฟ AI สังเคราะห์ฟีดเมืองทั้งหมดเป็นรายงานเช้า: การตรวจจับช่องว่าง (ที่รายงานพลเมืองมีแต่ polygon ทางการไม่มี) รายการที่ต้องดำเนินการ การจัดอันดับ PM2.5 จังหวัด และพยากรณ์อากาศ 5 วัน เครื่องมือ +24H timeline ให้ผู้ปฏิบัติงานดูข้อมูลย้อนหลัง',
        w4lbl:'เข้าถึงสด', w4:'แพลตฟอร์ม v.5 ห้าเมืองออนไลน์แล้ว: กรุงเทพฯ เชียงใหม่ ภูเก็ต สิงคโปร์ กูชิง เมืองไหนก็เข้าร่วมได้ — นำข้อมูลที่มีอยู่มาเลย',
        cta:'เปิดแพลตฟอร์มสด',
      },
      p16: {
        title: 'จังหวัดชายฝั่ง <em>ในรูปแบบหอควบคุม</em>',
        lede: 'Chonburi Control Tower คือพื้นผิวสั่งการ 3D สำหรับ Eastern Seaboard รวม 42 แหล่งข้อมูลสด สภาพอากาศชายฝั่ง ทะเล ตลาด ท่องเที่ยว ฟีดเหตุการณ์ของนายกเมือง เทรนด์ EEC และเลเยอร์ระดับอาคารไว้ในมุมมองเดียว',
        w1lbl:'ทำไมพิเศษ', w1:'แดชบอร์ดจังหวัดส่วนใหญ่อัดเมืองลงเป็นการ์ดและกราฟ <b>Chonburi Control Tower ทำให้จังหวัดกลายเป็นสภาพแวดล้อมปฏิบัติการ</b> — อาคาร 3D 20,877 หลัง สุขภาพแหล่งข้อมูล ความเสี่ยงทะเล ข่าว EEC ปุ่ม CCTV/AIS/AQ/WX และโต๊ะนายกเมืองในจอเดียว',
        w2lbl:'แทนที่อะไร', w2:'เว็บอากาศ แดชบอร์ดทะเล ticker ตลาด spreadsheet ท่องเที่ยว แท็บข่าว และ GIS แบบนิ่งที่ไม่เคยเล่าเรื่องเดียวกันในเวลาเดียวกัน',
        w3lbl:'อำนาจการตัดสินใจ', w3:'ผู้ปฏิบัติงานเห็นสถานะ live/degraded เทรนด์ Chonburi EEC เลเยอร์พลเมือง จำนวนแหล่งข้อมูล และเหตุการณ์ของนายกเมือง โดยไม่หลุดออกจากแผนที่ 3D ที่ยังรักษาบริบทพื้นที่ไว้',
        w4lbl:'เข้าถึงสด', w4:'หอควบคุมสาธารณะสำหรับ Chonburi Town Center และ Eastern Seaboard สร้างเพื่ออ่านสถานการณ์เร็ว ไม่ใช่รายงานวางแผนแบบนิ่ง',
        cta:'เปิดหอควบคุม',
      },
      p17: {
        title: 'เอกสารไทย <em>ให้เครื่องอ่านได้</em>',
        lede: 'Ekkasarn AI คือเครื่องยนต์ข่าวกรองเอกสารไทยสำหรับใบกำกับภาษี ใบเสร็จ และหนังสือรับรองหักภาษี ณ ที่จ่าย อัปโหลดเอกสารจริงหรือเลือกตัวอย่าง ระบบทำ OCR จัดหมวดหมู่ และดึงฟิลด์ใช้งานได้ โดยไม่ต้องใช้ข้อมูลปลอมและไม่บังคับล็อกอิน',
        w1lbl:'ทำไมพิเศษ', w1:'เดโม OCR ส่วนใหญ่ทำงานได้เฉพาะฟอร์มสะอาดที่สร้างขึ้นมาเอง <b>Ekkasarn AI อ่านเอกสารไทยจริง</b> — ใบเสร็จยับ ใบกำกับ VAT และหนังสือหักภาษี แล้วคืนหมวด ความมั่นใจ ร้านค้า เบอร์โทร และยอดรวมเป็นข้อมูลโครงสร้าง',
        w2lbl:'แทนที่อะไร', w2:'การกรอกบัญชีด้วยมือ รูปใบเสร็จค้างกอง การจัดหมวดด้วย spreadsheet และจุดต่อที่เปราะบางระหว่างเอกสารกระดาษไทยกับ workflow การเงินดิจิทัล',
        w3lbl:'อำนาจการตัดสินใจ', w3:'ทีมการเงินจัดประเภทเอกสาร ตรวจฟิลด์ที่ดึงออกมา และส่งต่อเข้าสู่ตรรกะบัญชีได้ทันที ไม่ต้องรอคนคัดแยก',
        w4lbl:'เข้าถึงสด', w4:'เดโมสองภาษาแบบ Thai-first สำหรับประเภทเอกสารไทย อัปโหลดแล้วประมวลผลสดและไม่เก็บไฟล์ไว้',
        cta:'เปิดระบบสด',
      },
      p18: {
        lede: 'KMITL Control Tower คือแดชบอร์ดปฏิบัติการแบบเรียลไทม์สำหรับสถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง — 56 ฟีดข้อมูลสดครอบคลุมการจราจร เหตุการณ์ คุณภาพอากาศ ภาพดาวเทียม รถรับส่งในมหาวิทยาลัย ข่าว และเหตุฉุกเฉิน สำหรับเขตลาดกระบัง กรุงเทพฯ',
        cta:'เปิดระบบสด',
      },
      p19: {
        lede: 'Yala Control Tower ให้ข่าวกรองพลเมืองแบบเรียลไทม์สำหรับเทศบาลนครยะลา ในภาคใต้ลึกของไทย โมเดลเมือง 3D ชั้นดาวเทียม เฝ้าระวังน้ำท่วม เหตุการณ์ด้านความมั่นคง และฟีดข้อมูลสดกว่า 30 แหล่ง',
        cta:'เปิดระบบสด',
      },
      p20: {
        lede: 'Horizon 45 คือเครื่องมือภาคสนามสำหรับทดสอบการตัดสินใจของ AI จริง ตั้งแต่การตรวจจับดีปเฟก ไปจนถึง prompt engineering ผู้ใช้เดินผ่านสัญญาณจากโลกจริงและออกไปพร้อมภาพความสามารถและแผนการเรียนรู้',
        cta:'เปิดระบบสด',
      },
      p21: {
        lede: 'พื้นผิวสั่งการระดับมหานครสำหรับนครโฮจิมินห์ รวมการจราจรสด การเฝ้าระวังน้ำท่วม คุณภาพอากาศ และการกำหนดเส้นทางแบบไดนามิกบนแผนที่ประสิทธิภาพสูงสำหรับผู้ตัดสินใจด้านเมือง',
        cta:'เปิดระบบสด',
      },
      p33: {
        lede: 'พื้นผิวสั่งการสำหรับเมืองทองธานี — IMPACT Arena ฮอลล์ Challenger เฝ้าน้ำท่วม จราจร AQI และโหลดงานอีเวนต์บนแผนที่เขตแบบ 3D สำหรับผู้ปฏิบัติการในคอมเพล็กซ์ผสมที่หนาแน่นที่สุดของไทย',
        cta:'เปิดระบบสด',
      },
      p22: {
        lede: 'เฝ้าติดตามสามภูมิภาค (ตะวันออกกลาง เอเชียตะวันออกเฉียงใต้ ไทย): แพลตฟอร์มมอนิเตอร์ขั้นสูงจากข้อมูลเปิดที่เปิดเผยอินไซต์ผ่านการซ้อนเลเยอร์',
        cta:'เปิดระบบสด',
      },
      p23: {
        lede: 'ดัชนีเมืองอัจฉริยะไทยอย่างเป็นทางการ (SCITI) ประเมินความคืบหน้าและผลกระทบของ 174 พื้นที่เมืองทั่วประเทศตาม 7 เสาหลักเมืองอัจฉริยะ',
        cta:'เปิดระบบสด',
      },
      p24: {
        lede: 'ห้องอ่านต้าวเต๋อจิงสามภาษา พร้อมการ์ตูนไช่ คู่ขนานทางพุทธศาสนา บันทึกจิตวิทยา พินอิน และชั้นหนังสืออ้างอิงที่ยังคงเติบโต',
        cta:'เปิดระบบสด',
      },
      ikigai: {
        name: 'Ikigai Finance Engine',
        lede: 'ข่าวกรองการเงินสำหรับ SME — งบดุลเป็นสัญญาณ เงินสดคงเหลือ runway สกอร์การ์ดธนาคาร และดัชนีการเงินรวม (Ikigai, Lean, Zero, Default, Solvency) ต้นแบบวิจัยระหว่างพัฒนา มีเฉพาะภาพหน้าจอ — ABC Company Limited เป็นข้อมูลจำลอง ยังไม่มีการ deploy สาธารณะ',
        cta: 'ดู research repo',
      },
      p27: {
        lede: 'AirDash คือระบบเฝ้าคุณภาพอากาศและฝุ่นของไทย 24/7 — อันดับจังหวัดเสี่ยง 3 วัน พยากรณ์ CAMS ลบ rain washout, 5 จังหวัดเสี่ยง AT-risk และ PM2.5, donut รูปแบบทั้งประเทศ บนหน้าจอเดียว เพื่อให้ทุกจังหวัดอ่านภาพอากาศเดียวกันจากข้อมูลสาธารณะชุดเดียวกัน',
        cta: 'เปิดระบบสด',
      },
      p28: {
        lede: 'FloodDash Blueprint คือคู่มือวิจัยเปิดของระบบเฝ้าน้ำท่วมไทย — เครือข่ายเซ็นเซอร์ ตรรกะท่อระบายน้ำ AI พยากรณ์น้ำท่วม คู่มือตอบสนอง และ pipeline ข้อมูล-สู่-การตัดสินใจครบชุด ให้ทุกเมืองอ่าน fork และปรับใช้ เพื่อให้ระบบทำซ้ำได้ ไม่ใช่ one-off',
        cta: 'ดูบน GitHub',
      },
      p29: {
        lede: 'วางดราฟต์ลงไป The Non-Writer จะส่งข้อความผ่านห่วงโซ่ของพร็อกซีและบ็อกซ์ แล้วออกมาอีกฝั่งเป็นประโยคที่คุณตั้งใจเขียน — ในน้ำเสียงที่ดร.นนจะใช้ ตอนนี้ยังแปลเป็นภาษาใดก็ได้ที่คุณต้องการ',
        cta: 'เปิดระบบสด',
      },
      p30: {
        lede: 'โต๊ะทำงาน วัดด้วยตัวเลข บทสรุปข่าวกรองรายวันเกี่ยวกับ AI frontier — อะไรกำลัง ship จริง อะไรคือลม และอะไรควรอ่านคืนนี้ sector watch ทางเลือกจากมือ และ archive ที่สะสมมูลค่า',
        cta: 'เปิดระบบสด',
      },
      p31: {
        lede: 'บริการดูดข้อมูล — ไม่ต้องเขียนโค้ด ส่ง URL กับคำถามมา ระบบจะออกไปอ่านเพจในภาษาต้นทาง แล้วกลับมาตอบเป็นภาษาของคุณ พร้อมอ้างอิงแหล่งที่มา และ JSON โครงสร้างที่ต่อท่อลง downstream ได้เลย',
        cta: 'เปิดระบบสด',
      },
    },
    stagesContent: {
      taipeiLoc:'ไทเป · City Vision Stage · มีนาคม 2569',
      taipeiTitle:'แดชบอร์ดสด เดโมใน 45 นาที',
      taipeiLede:'Keynote ที่ Smart City Summit & Expo เครื่องมือใช้งานได้จริงในห้อง ไม่ใช่ภาพ concept SLIC ขึ้นสดระหว่างการพูด 157 เมือง ห้าเสาหลัก ตรรกะการจัดอันดับที่ปรับได้',
      taipeiQuote:'"ผมไม่ได้สร้างดัชนีไว้วางบนชั้น ผมสร้างระบบสั่งการสำหรับถนน คุณสร้างการจัดอันดับ ผมสร้างความเป็นจริง"',
      taipeiCite:'— ดร.นน, keynote ไทเป',
      taipeiS1:'เมืองที่จัดอันดับ', taipeiS2:'ชาติที่เข้าร่วม', taipeiS3:'พันธมิตรข่าวกรอง', taipeiS4:'เดโมสดครั้งแรก',
      sgLoc:'สิงคโปร์ · Marina Bay Sands · เวทีหลัก · เมษายน 2569',
      sgTitle:'ไม่มีที่นั่งเหลือ',
      sgLede:'Keynote บนเวทีหลัก GITEX AI Asia ตามด้วย workshop เรื่อง Government Innovation as a Service ที่เต็มภายในไม่กี่นาที ที่ยืนถูกจองหมด ทางเดินเต็ม ทุกสายตาจับจ้องอยู่ที่เดโมสด',
      sgQuote:'"ห้องเต็มจนต้องยืน นั่นไม่ใช่เสียงปรบมือ นั่นคือสัญญาณดีมานด์ รัฐบาลต้องการระบบที่ทำงานได้จริง เหนื่อยกับการรองานนำเสนอแล้ว"',
      sgCite:'— ดร.นน, หลัง keynote',
      sgS1:'ผู้ชมเวทีหลัก', sgS2:'ผู้เข้าร่วมทั้งหมด', sgS3:'ชาติที่เข้าร่วม', sgS4:'ความจุ workshop',
      leapLoc:'LEAP East 2026 · Orbital Stage · 10 ก.ค.',
      leapTitle:'เวทีใหญ่ที่สุดของเอเชีย FloodDash เปิดตัวที่นี่',
      leapLede:'Panel บน Orbital Stage — "From Congestion to Connection: The Tech Powered Future of Transport in Asia" ดร.นน อัครา Senior Expert Smart City Promotion ที่ DEPA ร่วมกับ Mitchell Price, Richard Chung และ Will Peters เพื่อปิดเส้นเรื่อง Q1–Q2 ด้วยการเปิดตัว FloodDash สด',
      leapQuote:'"สามเวทีในหกเดือน ไทเปจัดอันดับเมือง GITEX เติมห้อง LEAP East ส่งมอบระบบเฝ้าดูน้ำท่วม — สด สาธารณะ และรันก่อนที่เราจะลงจากเวที"',
      leapCite:'— ดร.นน, panel ที่ LEAP East',
      leapS1:'ระดับเวทีหลัก', leapS2:'วิทยากร panel', leapS3:'แหล่งข้อมูลสด', leapS4:'FloodDash ตอนเปิดตัว',
    },
    teamContent: {
      founderLabel:'ผู้ก่อตั้งร่วม · กรุงเทพฯ',
      collectiveTitle:'เครือข่าย พร้อมเรียกได้ทุกเวลา',
      collectiveLede:'นักวิจัย วิศวกรจราจร นักมานุษยวิทยา นักการเงิน ผู้แปลนโยบาย และผู้ปฏิบัติงานสื่อ พวกเขาเข้ามาตามปัญหา ไม่ใช่ตามผังองค์กร ผมจ่ายให้สมองที่ต้องการเมื่อต้องการเท่านั้น',
      probonoTitle:'งาน Pro Bono · งานเชิงสถาบัน',
      probonoNote:'ทั้งหมดนี้คือแพลตฟอร์มที่รันอยู่จริง ไม่ใช่สไลด์หรือรายงาน แต่ละชิ้นสร้างกับพันธมิตรเชิงสถาบันจริง เปิดสาธารณะ และยังใช้งานอยู่ คลิกเข้าไปดูว่างานจริงเป็นยังไงเมื่อมันถูกส่งมอบ',
      pb1org:'สำหรับ ASEAN Secretariat', pb1title:'38 เมือง 10 ชาติ หนึ่งแพลตฟอร์ม', pb1for:'ASEAN Smart Cities Network',
      pb2org:'ASEAN · UNDP · UN-Habitat', pb2title:'112,000 ผู้ใช้ เกิดจากน้ำท่วมจริง', pb2for:'ASEAN CSCO Handbook',
      pb3org:'UN DESA · รัฐบาลหมู่เกาะโซโลมอน', pb3title:'โรดแมปดิจิทัลทั่วทั้งรัฐบาล', pb3for:'โฮนีอารา · workshop สองวัน',
      pb4org:'สำหรับ depa ประเทศไทย', pb4title:'หน่วยงานดิจิทัลของไทย ออนไลน์แล้ว', pb4for:'Smart City Leadership · สองภาษา',
      pb5org:'depa · US DOT', pb5title:'จากภาคสนามสู่ซอฟต์แวร์ ชุดเครื่องมือระบบเมือง', pb5for:'พันธมิตรเมืองอัจฉริยะ สหรัฐฯ-อาเซียน',
    },
    notesContent: {
      foldLine:'บันทึกภาคสนาม · 6 บทเรียน · วิธีส่งมอบ',
      kicker:'วิธีสร้างจริง',
      title:'บทเรียนจากการส่งมอบของจริง',
      lede:'สิบเอ็ดระบบ สองคน สิบสองเดือน นี่คือรูปแบบที่ใช้ได้ และที่ใช้ไม่ได้ เผยแพร่ตรงนี้เพราะช่องว่างระหว่างสิ่งที่รัฐบาลต้องการกับสิ่งที่ตลาดจัดหาให้ จะปิดได้ก็ต่อเมื่อคนแบ่งปันสิ่งที่ค้นพบ',
      n1title:'ผู้ขายปฏิเสธ เราส่งมอบใน 14 วัน',
      n1body:'ทุกระบบในหน้านี้เริ่มต้นเพราะรอบการจัดซื้อ ใบเสนอราคา หรือคณะกรรมการบอกว่าปัญหาซับซ้อนเกินไปหรือแพงเกินไป คำตอบไม่เคยเป็นการโต้เถียง แต่เป็นการสร้างเวอร์ชันทำงานได้แบบหยาบ ๆ แล้วเอาเข้าห้องประชุม เครื่องมือที่รันสด ๆ เปลี่ยนบทสนทนาได้เร็วกว่าข้อเสนอใด ๆ',
      n2title:'AI-native ไม่เหมือน AI-assisted',
      n2body:'ทุกบรรทัดของโค้ดใน 10 ระบบนี้เขียนโดย Claude Code ผมเป็นคนกำกับ AI คือวิศวกร มนุษย์คือสถาปนิก นี่ไม่ใช่ทางลัด แต่เป็นโมเดลใหม่ของการแบ่งงาน การรู้วิธีกำกับ AI อย่างแม่นยำคือทักษะที่ทบต้น โค้ดไม่ใช่ส่วนที่ยาก',
      n3title:'ปัญหาไม่ใช่ข้อมูล แต่คือการตัดสินใจเบื้องหลังข้อมูล',
      n3body:'ลูกค้าขอแดชบอร์ด สิ่งที่ต้องการจริง ๆ คือความชัดเจนเรื่องการตัดสินใจหนึ่งข้อที่ต้องเร็วขึ้นหรือดีขึ้น หาเจอการตัดสินใจนั้นก่อน ทุกอย่างที่เหลือ ทั้งข้อมูล สแต็ก หน้าจอ ไหลตามจากตรงนั้น ข้ามขั้นนี้แล้วคุณจะได้แดชบอร์ดสวย ๆ ที่ไม่มีใครเปิดดูหลังสัปดาห์เปิดตัว',
      n4title:'ผังองค์กรบอกว่าใครรายงานใคร ไม่บอกว่าใครควรสร้างอะไรกับใคร',
      n4body:'TKCX สร้างขึ้นบนช่องว่างนี้ archetype จากเกม คะแนนความพร้อม และเพดานเงินเดือนแบบ Moneyball เปิดเผยสิ่งที่ผังองค์กรซ่อนไว้ คนที่ใช่สำหรับโครงการ chemistry ระหว่างกัน และช่องว่างทักษะที่จะโผล่ขึ้นกลางทาง มองพนักงานเหมือนพอร์ตการลงทุน ไม่ใช่ตัวเลขจำนวนหัว',
      n5title:'AI ตัวเดียวตอบ Council ถกเถียง',
      n5body:'สำหรับการตัดสินใจที่สำคัญ โมเดลตัวเดียวให้กรอบเดียว กรอบที่ถูกอบมากับการเทรน AI Council รัน 11 ตุลาการที่มีมุมมองตั้งต้นต่างกัน คำสั่งที่ชัดเจน (EXPAND, QUALIFY, CONCEDE, STAND, PASS) และ transcript ที่ทุกคนอ่านก่อนเริ่มพูด การไม่เห็นด้วยคือตัวผลิตภัณฑ์ ออกจากห้องไปด้วยจุดยืนที่ปกป้องตัวเองได้แข็งแรงกว่าตอนเข้ามา',
      n6title:'วัดผลตั้งแต่วันแรก ไม่ใช่ทีหลัง',
      n6body:'ทุกระบบของ Axiom ส่งมอบพร้อม data trail ทั้งยอดเข้าชม สัญญาณการใช้งาน บันทึกการตัดสินใจ ไม่ใช่เพราะต้องใช้ analytics ในวันแรก แต่เพราะการมาติดตั้งเครื่องวัดทีหลังบนระบบที่รันอยู่แล้วแทบเป็นไปไม่ได้ และเวอร์ชันต่อไปมักสร้างจากสิ่งที่เวอร์ชันแรกสอนให้รู้ ทิ้งบันทึกไว้ ตัวคุณในอนาคตจะต้องการมัน',
      stackNote:'Local-first ไม่มีทีม build ไม่ผูกกับเวนเดอร์ M5 Max รัน inference สร้าง และดีพลอย จากโต๊ะทำงานเดียวในกรุงเทพฯ',
    },
    builtStack: {
      heading:'สร้างด้วย', meta:'109 เครื่องมือ · 9 ชั้น',
      expandFull:'ดูเทคโนโลยีสแต็กทั้งหมด',
      l1name:'โครงสร้างพื้นฐานคลาวด์', l1role:'ที่ระบบทำงาน',
      l2name:'เฟรมเวิร์กและตัวเชื่อม', l2role:'สิ่งที่เชื่อมระบบ',
      l3name:'แพลตฟอร์มและเครื่องมือสร้าง', l3role:'ที่เราสร้างงาน',
      l4name:'โมเดล AI และเอนจิน', l4role:'ส่วนปัญญา',
      l5name:'ซอฟต์แวร์และไลบรารี', l5role:'ส่วนที่ทำงานจริง',
      l6name:'ภาษาโปรแกรม', l6role:'โค้ดต้นทาง',
      l7name:'แหล่งข้อมูลสด', l7role:'ข้อมูลขาเข้า',
      l8name:'ช่องทาง', l8role:'ข้อมูลขาออก',
      l9name:'รันไทม์ในเครื่อง', l9role:'โต๊ะทำงาน',
      legend:'<span data-runtime="cloud">คลาวด์</span><span data-runtime="local">// local</span>',
    
      expandHint:'9 ชั้น · 117 เครื่องมือ · สร้างและรันจากโต๊ะทำงานเดียวในกรุงเทพฯ คลิกด้านล่างเพื่อดูรายการทั้งหมด',},
    brandSect: {
      foldLine:'Brand Kit · 8 แผ่น · ดาวน์โหลดได้',
      kicker:'Brand Kit',
      meta:'8 แผ่น · ระบบอัตลักษณ์ Axiom',
      lede:'ปก โลโก้ สี ตัวอักษร เลย์เอาต์ — 8 แผ่น ดาวน์โหลดชุดเต็มหรือเปิดดูทีละแผ่น',
      downloadCta:'ดาวน์โหลด Brand Kit',
      expandAll:'ดูแผ่นแบรนด์ทั้งหมด',
    },
    pressSection: { foldLine:'สื่อ · 7 บทความ · GovInsider, ASEAN Magazine, YouTube', kicker:'ในสื่อ', title:'อ่าน ดู ตัดสินใจ', lede:'รายงานจากภายนอกเกี่ยวกับงาน แนวคิด และระบบทั้งหมด' },
    pressContent: {
      p1title:'ผู้ขายปฏิเสธ เจ้าหน้าที่ไทยสร้างเครื่องมือเอง',
      p2title:'Innovation-as-a-Service ปิดช่องว่างระหว่างนโยบายกับการทำจริงได้หรือไม่',
      p3title:'เขาสร้างดัชนี แต่คุณสร้างการจัดอันดับ',
      p4title:'การเชื่อมต่อดิจิทัล นวัตกรรมเปิด และทำไมเมืองอัจฉริยะต้องมีการคลอบคลุม',
      p5title:'AI ขุดข้อมูลเมืองอย่างถูกและฉลาดขึ้นอย่างไร',
      p6title:'ทำไมเมืองอัจฉริยะต้องการพลเมือง ไม่ใช่แค่เทคโนโลยี',
      p7title:'Middle East War Monitor — สัญญาณความขัดแย้งแบบสดทั่วภูมิภาค',
    },
    credentialsSect: {
      foldLine:'บริษัท แอคเซี่ยม เอ็กซ์ จำกัด · เลขทะเบียน 0105569099335 · ประเทศไทย · จดทะเบียน กรมพัฒนาธุรกิจการค้า',
      kicker:'หนังสือรับรอง',
      eyebrow:'นิติบุคคล',
      title:'จดทะเบียนถูกต้องในประเทศไทย',
      compactLine:'บริษัท แอคเซี่ยม เอ็กซ์ จำกัด · เลขทะเบียน 0105569099335 · ประเทศไทย · จดทะเบียน กรมพัฒนาธุรกิจการค้า',
      tradeNameNote:'เว็บไซต์และบริการของเรานำเสนอภายใต้ชื่อทางการค้า Axiom นิติบุคคลที่จดทะเบียนคือ บริษัท แอคเซี่ยม เอ็กซ์ จำกัด (ประเทศไทย)',
      summaryToggle:'รายละเอียดการจดทะเบียนและมาตรฐาน',
      companyTitle:'นิติบุคคลจดทะเบียน',
      nameLbl:'ชื่อบริษัท',
      nameTh:'บริษัท แอคเซี่ยม เอ็กซ์ จำกัด',
      nameEnLbl:'ชื่อภาษาอังกฤษ',
      nameEn:'Axiom X Co., Ltd.',
      regNoLbl:'เลขทะเบียนนิติบุคคล',
      regDateLbl:'วันจดทะเบียน',
      regDate:'28 พฤษภาคม 2569 (28 May 2026)',
      jurisdictionLbl:'เขตอำนาจ',
      jurisdiction:'ราชอาณาจักรไทย',
      addressLbl:'ที่ตั้งสำนักงานแห่งใหญ่',
      address:'เลขที่ 16 ซอยพหลโยธิน 59 แยก 1 แขวงอนุสาวรีย์ เขตบางเขน กรุงเทพมหานคร',
      authorityLbl:'หน่วยงานออกหนังสือรับรอง',
      authority:'กรมพัฒนาธุรกิจการค้า กระทรวงพาณิชย์',
      capitalLbl:'ทุนจดทะเบียน',
      capital:'1,000,000 บาท',
      businessLbl:'วัตถุประสงค์หลัก',
      business:'เทคโนโลยี ปัญญาประดิษฐ์ ระบบดิจิทัล ที่ปรึกษาเมืองอัจฉริยะ และบริการนวัตกรรม',
      standardsTitle:'การจัดแนวมาตรฐาน',
      standardsMeta:'4 ชั้น · เชิงปฏิบัติ',
      standardsLede:'เราออกแบบและส่งมอบงานตามกรอบเหล่านี้ นี่คือการจัดแนวเชิงปฏิบัติ — ไม่ใช่การอ้างว่าได้รับการรับรอง ISO อย่างเป็นทางการ เว้นแต่มีการตรวจสอบและระบุไว้อย่างชัดเจน',
      tier1:'มาตรฐานพื้นฐาน',
      tier2:'มาตรฐานการกำกับดูแล',
      tier3:'กรอบกฎหมาย',
      tier4:'กรอบจริยธรรม',
      t1i1:'ISO/IEC 30173:2023 — แนวคิด digital twin',
      t1i2:'ISO 23247 — กรอบ digital twin',
      t1i3:'ระบบนิเวศ digital twin ของ IEC / ISO / IEEE',
      t1i4:'โครงการ digital twin ของ NIST',
      t2i1:'ISO/IEC JTC 1 — ฐานมาตรฐาน ICT',
      t2i2:'กรอบการเชื่อมต่อและแลกเปลี่ยนข้อมูล',
      t2i3:'ISO/IEC 42001 — ระบบบริหารจัดการ AI',
      t2i4:'ISO/IEC 23894 — การบริหารความเสี่ยง AI',
      t2i5:'NIST AI RMF',
      t3i1:'PDPA — พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล',
      t3i2:'GDPR — การจัดแนวเชิงที่ปรึกษาสำหรับงานที่เกี่ยวข้อง EU',
      t3i3:'แนวทางความเป็นส่วนตัวและความน่าเชื่อถือเชิงภาคส่วน',
      t4i1:'หลักการ AI ของ OECD',
      t4i2:'คำแนะนำจริยธรรม AI ของ UNESCO',
      t4i3:'ความโปร่งใส · ความเป็นธรรม · การกำกับดูแลโดยมนุษย์',
      t4i4:'ความปลอดภัย · ความทนทาน · การใช้งานที่รับผิดชอบ',
      stackTag:'Stack',
      stackCallout:'ชุดอ้างอิงที่แนะนำ: ISO/IEC 30173 + ISO 23247 + ISO/IEC 42001 + ISO/IEC 23894 + PDPA + GDPR',
      disclaimer:'การจัดแนวหมายถึงเราออกแบบและดำเนินงานตามกรอบเหล่านี้ในการส่งมอบงานจริง ไม่ได้หมายถึงการรับรอง การให้สิทธิ์ หรือการตรวจสอบโดยบุคคลที่สาม เว้นแต่ระบุและพิสูจน์ไว้อย่างชัดเจน',
    },
  },

  zh: {
    panels: {
      p01: {
        title: '省长级<em>作战室</em>，藏在浏览器标签里',
        lede: '普吉的交通、公共安全、环境信号，全部集成在一个界面上，省长30秒就能看明白。几周交付，不用等采购周期走完。',
        w1lbl:'特别之处', w1:'大多数政府仪表板，本质上就是裹着软件外壳的只读PDF。普吉这个是真正的作战室：交通、安全、环境融在一个屏幕上，每42毫秒刷新一次。省长自己读得懂，不需要分析师再翻译一遍。',
        w2lbl:'替代了什么', w2:'三个部门各自交的孤立报告、一条SMS上报链，加上每周二早上的固定汇报会议。',
        w3lbl:'第一天就有价值', w3:'建在已有的IoT基础设施上，没多采购一件新硬件。', cta:'打开在线系统',
      },
            p03: {
        title: '官僚体系，<em>变得看得懂</em>',
        lede: '我和depa一起，给泰国国家智慧城市项目搭了对外的公开页面。提案进来，进度全程可见，项目不再消失在PDF里。',
        w1lbl:'特别之处', w1:'国家级项目通常活在没人翻的年度报告里。这一个在线、双语，跟着结果走，不走仪式。候选城市过了里程碑，状态当场就更新。',
        w2lbl:'谁在买单', w2:'depa——泰国数字经济促进局。直接对接政府，不是分包关系。',
        w3lbl:'为何重要', w3:'给所有想在发布新闻周期之后还看得懂的国家级智慧城市项目立了模板。SLIC作为基准评分层接进来。', cta:'打开在线系统',
      },
      p04: {
        title: '一个<em>会顶嘴的</em>排名',
        lede: 'SLIC Index不告诉城市自己值多少。它把五根支柱摆出来，让城市自己测试优先级。市长定义"宜居"是什么意思，数学跟着走。',
        w1lbl:'特别之处', w1:'别的宜居指数都甩给城市一个写好的判决。SLIC甩给城市的是数学。把支柱权重一拉，自己的排名和对手的排名实时一起动，争论本身就成了产品。',
        w2lbl:'替代了什么', w2:'静态的面子排行榜。年度排名PDF。以"我们不认同这个方法论"收尾的那种对话。',
        w3lbl:'受众反应', w3:'被欧洲市长组织拿去用了。台北SCSE上45分钟现场演示。被当成公民议题在讨论，不是当概念板。', cta:'打开 SLIC v3',
      },
      p05: {
        title: '大古晋，<em>一个指挥界面</em>',
        lede: '砂拉越大古晋的全谱IOC。外汇、航班、卫星图像、环境信号——给运营东南亚增长最快智慧城市的团队，全部整合到一个地方。',
        w1lbl:'特别之处', w1:'大多数IOC只看一个领域。古晋在一个视图里把跨领域信号融在一起：货币压力、航班到达、Sentinel-2扫描、环境读数。操作员看全局不用切换标签页。',
        w2lbl:'谁在使用', w2:'大古晋的城市运营和规划团队。为实时态势感知而建，不是演示厅，是每天上手的工具。',
        w3lbl:'为何重要', w3:'彭博终端给交易桌的信息密度，挪到城市层面，成本只是零头。', cta:'打开在线系统',
      },
      p06: {
        title: '新闻，<em>抢在算法决定什么是战争之前</em>',
        lede: 'MEM是中东冲突报道里最快的开源新闻界面。实时多源信息流，没有编辑层延迟，没有过滤气泡。新闻周期开始之前的那个信号。',
        w1lbl:'特别之处', w1:'每个主流新闻平台都有一层编辑层在减速、过滤、定调。MEM把那一层去掉了。分析师手动汇总的那些信号，全部塞在一个界面里，按机器速度更新。',
        w2lbl:'替代了什么', w2:'三个浏览器标签页、两个Telegram频道、一个Twitter/X列表——同时开着，互相对照才知道地面上到底发生了什么。',
        w3lbl:'谁在使用', w3:'记者、政策分析师、NGO的前线团队。任何想比24小时新闻周期更快拿到地面信号的人。', cta:'打开在线系统',
      },
      p07: {
        title: '巴士被追踪。<em>乘客被告知。</em>',
        lede: '普吉智能巴士网络的实时GPS追踪和乘客数据。先为乘客的手机而设计，不是为控制室的大屏。在路上、在高温下、用一只大拇指就能操作。',
        w1lbl:'特别之处', w1:'智能巴士系统通常服务运营商的仪表板。这一个服务的是站台上等车的人。GPS位置、下一班到达、路线说明——给不懂泰文的游客和没时间猜的通勤者。',
        w2lbl:'替代了什么', w2:'在站台上没有信息地干等。2019年印的那张时刻表。"旅游岛上的公共交通做不到清晰易懂"这个假设。',
        w3lbl:'建在什么之上', w3:'普吉已有的IoT基础设施。和省长作战室用的是同一层传感器，没有新硬件。', cta:'打开在线系统',
      },
      p08: {
        title: '报告进来。<em>AI把它变成行动。</em>',
        lede: 'SCTH V2是Smart City Thailand的城市数据平台，通过Telegram和LINE接收市民报告，用AI分析问题，并把准实时的卫星和地图图层叠在上面，给城市建设者、开发商和管理者用。',
        w1lbl:'特别之处', w1:'大多数城市投诉系统在一个工单号那里就停了。SCTH V2把报告流变成了决策界面。Messenger上的报告、现场照片、SLA风险、AI识别出的模式，跟降水、气溶胶、云层、地形、街道图层在同一张地图上。',
        w2lbl:'替代了什么', w2:'聊天群里的截图、手动用Excel分类、静态地图图层，以及"有人报告了"和"有人能动手处理"之间的等待。',
        w3lbl:'决策能力', w3:'城市团队接收报告、指派负责人、分析重复模式、导出Sheet或PDF、在城市状况还是实时的时候把响应任务推下去。',
        w4lbl:'实时访问', w4:'专有系统，每天都在持续开发中。链接走的是实时隧道。如果打不开，说明系统正在升级，稍后再试一下。', cta:'打开在线系统',
      },
      p09: {
        title: '十一个声音。<em>一个决定。</em>',
        lede: '我的AI Council是个个人多智能体的审议系统：11位名字是回文的AI法官（Tenet、Radar、Otto、Hannah、Ada……）在本地Mac上持续运行，通过一个共享的transcript日志互相辩论，每月大概3美元。基于个人日记、决策和声音训练——专有是设计选择，不是意外。',
        w1lbl:'为什么存在', w1:'单个模型只给一个答案。值得解的问题，值得被辩论。Council跑四种工作模式——VERIFY、DECIDE、EXPLORE、DEBATE——法官用明确的动作（EXPAND、QUALIFY、CONCEDE、STAND、PASS），每一次立场变化都看得见、追得到。',
        w2lbl:'成本', w2:'Manus级自主智能体的能力，每月3美元。Council主席跑在Mistral Large 3上，泰语本地的怀疑论者（Ada）跑在ThaiLLM上——政府支持的模型，免费。执行者（Otto）做OCR、下载视频、起草邮件、生成PDF、同步Google Drive，全程不碰云。',
        w3lbl:'为什么没有演示', w3:'Council基于我个人的日记、决定、会议笔记和声音训练。专有是因为必须。协议栈——大约600行Python——是开放的。知识产权是协调方法论，不是模型权重。', cta:'v1 · DIY 协议', cta2:'v2 · 智能体 + 执行者',
      },
      p10: {
        title: 'HR当<em>记录系统</em>当得够久了',
        lede: 'Talent Knowledge Collaborative Explorers（TKCX）是个用游戏机制的人才操作系统，把员工当成队伍成员、把项目当成任务、把组队当成策略。每一个关于人的决定都可见、可量化、跟结果挂钩——用能力情报取代组织图政治。',
        w1lbl:'问题在哪', w1:'大多数HR系统是合规记录，不是情报。告诉你谁是员工，不告诉你谁该被派去哪里、跟谁一起。关于人的决定靠直觉和政治资本做出来。最好的那批人离开，舒服的那批人留下，谁也看不出来为什么。',
        w2lbl:'引擎', w2:'建在《勇者斗恶龙III》的队伍系统上。五个原型对应真实职场角色（队长、技术、销售、运营、侦察）。Moneyball式的预算上限——项目预算÷10=月薪上限——逼出分配纪律。就绪公式权衡覆盖率、质量、化学反应和士气，合适的团队在项目开始之前就看得出来，不是失败之后才知道。',
        w3lbl:'改变了什么', w3:'部门主管不再囤人。项目不再靠政治资本跑。技能缺口在变成失败之前就显出来。而HR——改名叫人才孵化——变成大楼里最有战略性的部门，不再是最被绕开的那个。', cta:'GitHub 仓库 — 即将推出',
      },
      p11: {
        title: '<em>认识你的</em>AI',
        lede: 'Second Brain OS通过MCP把你的Obsidian知识库同时接到所有AI编程平台。按脑解剖命名的文件夹结构、19个服务器配置、能读取你人格蓝图、用你的声音写作、记得你每一个曾经记下的决定的AI智能体。你这些年积累的知识，终于开始替你工作了。',
        w1lbl:'填补的空白', w1:'每一次AI对话都从零开始。不知道你的声音、你的价值观、你过去的决定，或者那些塑造你思考方式的多年日记。Second Brain OS通过单一MCP连接，把这一切同时送进所有编程平台——和你协作的AI，已经知道它在跟谁协作。',
        w2lbl:'怎么搭起来的', w2:'你的Obsidian知识库按大脑结构组织：PrefrontalCortex放战略，Hippocampus放原子记忆，TemporalLobe放模式，Cerebellum放技能和流程。19个MCP服务器配置把这个活的知识图谱同时接到Cursor、Codex、Claude Code和你技术栈里所有的平台。',
        w3lbl:'为什么开源', w3:'架构是MIT许可的。大脑是你的。任何人都可以fork结构、调整MCP配置、接上自己的知识库。还包含一个12级诊断工具，把AI腔从你的写作里剥出来——保证你积累的知识保留你的声音，不是模型的。', cta:'探索架构',
      },
      p12: {
        title: '21个频道。<em>免费。随处可看。</em>',
        lede: 'NSP是泰国国家流媒体平台——NBTC授权的全部21个数字电视频道，免费，全高清，支持任何设备。实时节目指南、逐频道收视遥测、AI内容助手，以及CAP v1.2紧急预警集成，全在一个界面里。',
        w1lbl:'为什么特别', w1:'大多数国家电视平台都是事后凑合做的。<b>NSP把21个持牌频道放进一个界面</b>，配备实时EPG、逐频道并发数据、流媒体健康遥测，以及能回答"现在有什么可看"的AI助手——全国范围内，不用装任何App。',
        w2lbl:'替代了什么', w2:'各家电视台散装的App、非法流媒体，以及那种认为免费电视不可能做得跟订阅平台一样清晰的假设。',
        w3lbl:'决策能力', w3:'运营方实时看到在线并发人数、频道收视份额和流媒体健康状况。CAP v1.2紧急预警集成意味着全国性紧急警报通过娱乐内容的同一界面推送——不需要另建一套系统。',
        w4lbl:'实时访问', w4:'在NBTC许可权限下全国部署。向所有设备开放，无需注册。',
        cta:'打开在线平台',
      },
      p13: {
        title: '47条数据流。<em>7个视角。一所大学。</em>',
        lede: 'Chula Control Tower是朱拉隆功大学的实时运营仪表板——47条实时数据流，横跨交通、事件、空气质量、卫星图像、CU校车、新闻和紧急事件，覆盖曼谷暹罗–三岩地区。',
        w1lbl:'为什么特别', w1:'大多数大学仪表板一次只显示一条数据流。<b>CCT把47个实时来源放在一张3D地图上</b>——交通、空气质量、校车位置、事件报告、卫星图层和地下管网——让校长对所有决策只需一个界面。',
        w2lbl:'替代了什么', w2:'交通、安保和环境数据各自为政的系统。手动记录的事件报告。没有任何一刻能看到整个校园的全貌。',
        w3lbl:'决策能力', w3:'七个运营视角——从日常校园管理到校长战略全局——让每个角色只看自己需要的东西。3D建筑和地下管网图层把规划从猜测变成有据可查的事。',
        w4lbl:'实时访问', w4:'部署于曼谷暹罗–三岩地区的朱拉隆功大学。开放访问，无需注册。',
        cta:'打开在线系统',
      },
      p14: {
        title: '彭博信号。<em>泰国市场。你的规则。</em>',
        lede: 'DayTraders是个性化的泰国市场情报平台——Bloomberg级别的信号分析，适用于SET、MAI、公募基金、RMF和泰国ESG产品。Graham、Buffett和Munger的投资框架已经内嵌；你来设定对自己投资组合重要的KPI。',
        w1lbl:'为什么特别', w1:'泰国散户投资者要么拿到原始券商数据，要么用完全不带价值投资逻辑的普通App。<b>DayTraders把机构级信号分析带进了泰国SET</b>——Graham的安全边际、Buffett的护城河筛选、Munger的心智模型，全部内嵌进信息流，不是后来拼上去的。',
        w2lbl:'替代了什么', w2:'没有分析框架的券商门户、LINE群里的小道消息，以及"严格的价值投资只有拿着彭博终端的机构才能做"这个假设。',
        w3lbl:'决策能力', w3:'个性化KPI仪表板让投资者只追踪自己真正在用的那些指标，而不是泛泛的筛选器。一个界面覆盖SET股票、MAI成长股、RMF税优基金和泰国ESG产品。',
        w4lbl:'实时访问', w4:'实时泰国市场数据。开放平台，没有付费墙，不锁定任何券商。',
        cta:'打开在线平台',
      },
      p15: {
        title: '说出城市名字。<em>我来搭它的大脑。</em>',
        lede: 'City Hub是可复用的城市智能平台——告诉它城市名字，它就用卫星和底图把它描出来，吸收你已有的任何数据，连接API和传感器，开始把点连成图谱。现在v.5，五座城市在线：曼谷、清迈、普吉、新加坡、古晋。',
        w1lbl:'为什么特别', w1:'大多数城市平台都是为一座城市定制的，一个采购周期，无法复用。<b>City Hub把情报层当成模板</b>——任何城市都能接入，导入已有的数据，系统就开始把点连成线。不用等漫长的采购流程。大脑从已有的东西里自己长出来。',
        w2lbl:'替代了什么', w2:'一次性定制仪表板——城市之间不共享学习，没有AI合成，也检测不到市民数据跑在官方基础设施前面的地方。曼谷SIT ROOM现在追踪空气质量、洪水风险、热量、民事问题和疾病预警——每天由AI合成一次简报。',
        w3lbl:'决策能力', w3:'AI简报把所有实时城市信号合成成一份早间汇报：缺口检测（市民报告有数据但官方多边形没有的地方）、可操作事项、PM2.5省级排名，以及五天天气预报。+24H时间轴拉杆让运营者回放城市昨天的数据。',
        w4lbl:'实时访问', w4:'平台v.5。五座城市在线：曼谷、清迈、普吉、新加坡、古晋。任何城市都能接入——带上已有的数据就行。',
        cta:'打开在线平台',
      },
      p16: {
        title: '一座海岸省份，<em>变成控制塔。</em>',
        lede: 'Chonburi Control Tower是面向泰国东部海岸的3D指挥界面：42个实时来源、海岸天气与海况、市场和旅游信号、市长事件流、EEC趋势，以及建筑级图层，都在同一个运营视角中。',
        w1lbl:'为什么特别', w1:'大多数省级仪表板把城市压平成卡片和图表。<b>Chonburi Control Tower把省份渲染成一个运营环境</b>——20,877栋3D建筑、来源健康状态、天气、海事风险、EEC新闻、CCTV/AIS/AQ/WX开关和市长办公桌都在一个界面里。',
        w2lbl:'替代了什么', w2:'分散的天气网站、海事仪表板、市场ticker、旅游表格、新闻标签页，以及永远无法同时讲同一个故事的静态GIS图层。',
        w3lbl:'决策能力', w3:'运营者可以在3D地图内看到实时和降级状态、Chonburi EEC趋势、公民图层、来源数量和市长事件，同时保留地理语境。',
        w4lbl:'实时访问', w4:'面向Chonburi Town Center和Eastern Seaboard的公开控制塔。为快速运营阅读而建，不是静态规划报告。',
        cta:'打开控制塔',
      },
      p17: {
        title: '泰国纸质文件，<em>让机器读懂。</em>',
        lede: 'Ekkasarn AI是面向泰国税务发票、收据和预扣税证明的文档智能引擎。可以上传真实文件或选择样本；系统会运行OCR、分类文档，并提取可用字段，不依赖模拟数据，也不强制登录。',
        w1lbl:'为什么特别', w1:'大多数OCR演示只适合干净的虚构表单。<b>Ekkasarn AI读取真实泰国纸面文件</b>——皱掉的收据、VAT发票和预扣税证明，然后输出类别、置信度、商店、电话和总额等结构化结果。',
        w2lbl:'替代了什么', w2:'手工会计录入、堆积的收据照片、电子表格分类，以及泰国纸质文件进入数字财务流程时那道脆弱的交接。',
        w3lbl:'决策能力', w3:'财务团队可以立即分类文件、核验抽取字段，并把结果送入后续会计逻辑，而不是等待人工分拣。',
        w4lbl:'实时访问', w4:'泰国文档优先的公开双语演示。上传文件会实时处理，不会保留。',
        cta:'打开在线系统',
      },
      p18: {
        lede: 'KMITL控制塔是泰国先皇科技大学（拉卡邦）的实时运营仪表板——56路实时数据，覆盖交通、事件、空气质量、卫星影像、校园班车、新闻和应急事件，服务曼谷拉卡邦片区。',
        cta:'打开在线系统',
      },
      p19: {
        lede: 'Yala控制塔为泰国南部深南地区的亚拉市自治政府提供实时公民情报：3D城市模型、卫星图层、洪水监测、深南安全事件，以及30多路实时数据。',
        cta:'打开在线系统',
      },
      p20: {
        lede: 'Horizon 45是一款测试真实AI判断力的现场仪器。从深度伪造识别到提示工程，用户穿行于真实世界信号，离开时带走能力画像与学习路线图。',
        cta:'打开在线系统',
      },
      p21: {
        lede: '胡志明市大规模指挥界面：将实时交通、洪水监测、空气质量与动态路径规划整合到一张高性能地图中，供城市决策者使用。',
        cta:'打开在线系统',
      },
      p33: {
        lede: 'Muang Thong Thani 指挥界面——IMPACT Arena、Challenger 展厅、洪水监测、交通、空气质量与活动负荷，叠在一张 3D 片区地图上。为泰国最密的综合体运营者而建。',
        cta:'打开在线系统',
      },
      p22: {
        lede: '监测三个区域（中东、东南亚、泰国）：基于开放数据的终极监测平台，通过图层叠加揭示洞察。',
        cta:'打开在线系统',
      },
      p23: {
        lede: '泰国官方智慧城市指数（SCITI）依据七大智慧城市支柱，评估全国174个城市区域的进展与影响。',
        cta:'打开在线系统',
      },
      p24: {
        lede: '三语《道德经》阅读室：蔡志忠漫画、佛学对照、心理学笔记、拼音，以及持续更新的参考书架。',
        cta:'打开在线系统',
      },
      ikigai: {
        name: 'Ikigai Finance Engine',
        lede: '中小企业金融情报——资产负债表即信号、现金跑道、银行评分卡与综合金融指数（Ikigai、Lean、Zero、Default、Solvency）。开发阶段研究原型，仅提供截图——ABC Company Limited 为虚构演示数据，尚无公开部署。',
        cta: '查看研究仓库',
      },
      p27: {
        lede: 'AirDash 是 24/7 泰国空气质量与粉尘监测——省份关注度排名、3 天 CAMS 减雨预报、AT-risk 与 PM2.5 前 5 省份、雨洗逻辑、全国模式环图，全部在一张界面上。让每个泰国省份从同一份公开数据看到同一张空气质量图。',
        cta: '打开在线系统',
      },
      p28: {
        lede: 'FloodDash Blueprint 是泰国洪水监测的开放研究配套——传感网络、排水逻辑、AI 洪水预测、响应剧本，以及完整的数据到决策流水线，向所有城市开放阅读、复用与适配。让系统可被复制，而不是一次性交付。',
        cta: '在 GitHub 查看',
      },
      p29: {
        lede: '贴上一段草稿。The Non-Writer 会把它送过一连串代理与处理单元,从另一端出来时,就变成你本来想写的那句话——用 Dr Non 会用的声音。现在还可以翻译成你想要的任何语言。',
        cta: '打开在线系统',
      },
      p30: {
        lede: '那张桌子,用数字说话。每天一期的 AI 前沿情报简报——什么真的在出货,什么是噱头,今晚该读什么。行业关注、人工精选、以及会随时间复利的存档。',
        cta: '打开在线系统',
      },
      p31: {
        lede: '抓取即服务——无需代码。给它一个 URL 和一个问题,它就去读源语言页面,然后用你的语言回答你,带引用、可直接接入下游的结构化 JSON。',
        cta: '打开在线系统',
      },
    },
    stagesContent: {
      taipeiLoc:'台北 · 城市愿景舞台 · 2026年3月',
      taipeiTitle:'实时仪表板 45分钟内现场演示',
      taipeiLede:'智慧城市峰会暨展览的主题演讲 现场跑的是真界面 不是概念图 SLIC在演讲过程中上线：157座城市 五根支柱 可以调整的排名逻辑',
      taipeiQuote:'"我们不是为了摆上书架做了个指数 我们做的是一个街头指挥系统 你来排名 我们来造现实"',
      taipeiCite:'— 阿南博士 台北主题演讲',
      taipeiS1:'建档城市', taipeiS2:'参会国家', taipeiS3:'情报伙伴', taipeiS4:'首次现场演示',
      sgLoc:'新加坡 · 滨海湾金沙 · 主舞台 · 2026年4月',
      sgTitle:'只剩站位',
      sgLede:'GITEX AI Asia主舞台的主题演讲 接着是一场政府创新即服务的工作坊 几分钟就满员 站位被站满 走廊挤满 每张脸都锁定在现场演示上',
      sgQuote:'"会议室只剩站位 那不是掌声 那是需求信号 政府要的是能跑的系统 已经厌倦等一份幻灯片了"',
      sgCite:'— 阿南博士 演讲后',
      sgS1:'主舞台观众', sgS2:'总参会人数', sgS3:'参会国家', sgS4:'工作坊容量',
      leapLoc:'LEAP East 2026 · Orbital Stage · 7月10日',
      leapTitle:'亚洲最大舞台。FloodDash 在这里发布。',
      leapLede:'Orbital Stage 圆桌——「From Congestion to Connection: The Tech Powered Future of Transport in Asia」。Dr. Non Arkara（DEPA 智慧城市推广高级专家）与 Mitchell Price、Richard Chung、Will Peters 一起，用 FloodDash 现场发布收束 Q1–Q2 弧线。',
      leapQuote:'"六个月三场舞台。台北建了城市索引。GITEX 把房间坐满。LEAP East 把洪水监测交出去——上线、公开，还没下台就已经在跑。"',
      leapCite:'— 阿南博士，LEAP East 圆桌',
      leapS1:'主舞台档位', leapS2:'圆桌发言人', leapS3:'实时数据源', leapS4:'FloodDash 发布',
    },
    teamContent: {
      founderLabel:'联合创始人 · 曼谷',
      collectiveTitle:'随时待命的协作圈',
      collectiveLede:'研究员、交通工程师、人类学家、金融人士、政策翻译、媒体运营 他们按问题加入 不按组织图 需要哪颗大脑 在那个时候付钱给那颗大脑',
      probonoTitle:'公益工作 · 机构项目',
      probonoNote:'这些全是在跑的平台 不是幻灯片也不是报告 每一个都跟真实的机构合作方一起做出来 对外公开部署 现在还在用 点进去看看真东西交付出来是什么样',
      pb1org:'为东盟秘书处', pb1title:'38座城市 10个国家 一个平台', pb1for:'东盟智慧城市网络',
      pb2org:'东盟 · UNDP · UN-Habitat', pb2title:'112,000用户 起源于真实的洪灾', pb2for:'东盟CSCO手册',
      pb3org:'联合国经社部 · 所罗门群岛政府', pb3title:'覆盖整个政府的数字化路线图', pb3for:'霍尼亚拉 · 两天工作坊',
      pb4org:'为泰国depa', pb4title:'泰国数字机构 上线了', pb4for:'智慧城市领导力 · 双语',
      pb5org:'depa · US DOT', pb5title:'从田野到软件 城市系统工具包', pb5for:'美-东盟智慧城市伙伴关系',
    },
    notesContent: {
      foldLine:'现场笔记 · 6条经验 · 交付方式',
      kicker:'怎么搭出来的',
      title:'真做出来才学到的事',
      lede:'十一个系统 两个人 十二个月 这些是坚持下来的模式 以及那些没坚持住的 把它们放在这里 因为政府的需求和市场的供给之间那道缝 只有大家把弄明白的东西分享出来 才能慢慢闭合',
      n1title:'供应商说不行 我们十四天就交付了',
      n1body:'这一页上每一个系统都是这么来的：采购周期、供应商报价或者委员会说问题太复杂或者太贵 答案从来不是辩论 而是搭一个粗糙能跑的版本 然后摆进会议室 一个能跑的真界面 比任何提案都能更快地改变对话',
      n2title:'AI原生 跟AI辅助不是一回事',
      n2body:'这十一个系统每一行代码都是Claude Code写的 由我来指挥 AI是工程师 人是建筑师 这不是捷径 这是一种不同的分工模型 精准地指挥AI的能力是会复利的技能 代码不是难的部分',
      n3title:'问题从来不是数据 永远是数据背后的那个决策',
      n3body:'客户要的是仪表板 真正需要的是把一个必须更快或者更准的决策搞清楚 先找到那个决策 剩下的一切 数据流、技术栈、界面 都顺着它流出来 跳过这一步 你会做出一个漂亮的仪表板 发布周一过就没人再开了',
      n4title:'组织图告诉你谁向谁汇报 它一句也不告诉你谁该跟谁一起搭什么',
      n4body:'TKCX就是建在这道缝上 游戏原型、就绪分数、Moneyball式的薪资上限 把组织图遮住的东西显出来：合适的人选、他们之间的化学反应、会在半路上冒出来的技能缺口 把人才当成投资组合看 不是当成人头数',
      n5title:'单个AI回答 委员会审议',
      n5body:'重要决策上 单个模型只给你一种框架 那种烘进训练里的框架 AI Council跑十一位有不同先验的法官 明确的动作（EXPAND、QUALIFY、CONCEDE、STAND、PASS）和一份每个人发言前都得读的共享transcript 分歧就是产品 你离开的时候 立场比进来时更站得住脚',
      n6title:'从第一天就装好仪表 不是后面再补',
      n6body:'每一个Axiom系统交付时都自带数据轨迹：页面浏览、使用信号、决策日志 不是因为第一天就要看分析 而是因为之后再往一个跑着的系统上加测量 几乎做不到 下一版总是从上一版教给你的东西里建起来 留下记录 未来的你会需要它',
      stackNote:'本地优先 没有构建团队 不被供应商锁定 一台M5 Max在曼谷一张桌子上跑推理、构建和部署',
    },
    builtStack: {
      heading:'技术栈', meta:'109 项工具 · 9 层',
      expandFull:'查看完整技术栈',
      l1name:'云基础设施', l1role:'运行所在',
      l2name:'框架与连接', l2role:'把系统接起来',
      l3name:'平台与构建工具', l3role:'我们构建的地方',
      l4name:'AI 模型与引擎', l4role:'智能核心',
      l5name:'软件与库', l5role:'运转部件',
      l6name:'编程语言', l6role:'源码',
      l7name:'实时数据源', l7role:'输入',
      l8name:'通道', l8role:'输出',
      l9name:'本地运行时', l9role:'工作台',
      legend:'<span data-runtime="cloud">云端</span><span data-runtime="local">// local</span>',
    
      expandHint:'9 层 · 117 项工具 · 从曼谷的一张桌子上构建和运行。点击下方查看完整列表',},
    brandSect: {
      foldLine:'品牌工具包 · 8张 · 可下载',
      kicker:'品牌工具包',
      meta:'8 张 · Axiom 识别系统',
      lede:'封面、标志、色彩、字体、版式——八张规范。下载完整包或逐张浏览。',
      downloadCta:'下载品牌工具包',
      expandAll:'查看全部品牌规范',
    },
    pressSection: { foldLine:'媒体报道 · 7篇 · GovInsider、东盟杂志、YouTube', kicker:'媒体报道', title:'读 看 决定', lede:'外界对这些工作、论点和系统的报道' },
    credentialsSect: {
      foldLine:'Axiom X Co., Ltd. · 注册号 0105569099335 · 泰国 · 商务部登记',
      kicker:'资质',
      eyebrow:'法人',
      title:'在泰国合法注册',
      compactLine:'Axiom X Co., Ltd. · 注册号 0105569099335 · 泰国 · 企业发展局登记',
      tradeNameNote:'本网站及我们的服务以商号 Axiom 呈现。注册法人为 Axiom X Co., Ltd.（泰国）。',
      summaryToggle:'注册与标准详情',
      companyTitle:'注册法人',
      nameLbl:'公司名称',
      nameTh:'บริษัท แอคเซี่ยม เอ็กซ์ จำกัด',
      nameEnLbl:'英文名称',
      nameEn:'Axiom X Co., Ltd.',
      regNoLbl:'注册编号',
      regDateLbl:'注册日期',
      regDate:'2026年5月28日（28 พ.ค. 2569）',
      jurisdictionLbl:'管辖',
      jurisdiction:'泰王国',
      addressLbl:'注册地址',
      address:'曼谷邦肯区阿努萨瓦里 拍凤裕庭路59巷1弄16号',
      authorityLbl:'发证机关',
      authority:'泰国商业部企业发展局',
      capitalLbl:'注册资本',
      capital:'100万泰铢',
      businessLbl:'核心业务范围',
      business:'技术、人工智能、数字系统、智慧城市咨询、创新服务',
      standardsTitle:'标准对齐',
      standardsMeta:'四层 · 实践导向',
      standardsLede:'我们按这些框架设计和交付。这是运营层面的对齐——除非经过独立审计并明确说明，否则不构成正式的 ISO 认证声明。',
      tier1:'基础标准',
      tier2:'治理标准',
      tier3:'法律框架',
      tier4:'伦理框架',
      t1i1:'ISO/IEC 30173:2023 — 数字孪生概念',
      t1i2:'ISO 23247 — 数字孪生框架',
      t1i3:'IEC / ISO / IEEE 数字孪生生态',
      t1i4:'NIST 数字孪生计划',
      t2i1:'ISO/IEC JTC 1 — ICT 标准基础',
      t2i2:'互操作与数据交换框架',
      t2i3:'ISO/IEC 42001 — AI 管理体系',
      t2i4:'ISO/IEC 23894 — AI 风险管理',
      t2i5:'NIST AI RMF',
      t3i1:'PDPA — 泰国个人数据保护法',
      t3i2:'GDPR — 面向欧盟工作的咨询对齐',
      t3i3:'行业隐私与信任指南',
      t4i1:'OECD AI 原则',
      t4i2:'UNESCO AI 伦理建议',
      t4i3:'透明 · 公平 · 人类监督',
      t4i4:'安全 · 稳健 · 负责任部署',
      stackTag:'技术栈',
      stackCallout:'推荐参考栈：ISO/IEC 30173 + ISO 23247 + ISO/IEC 42001 + ISO/IEC 23894 + PDPA + GDPR',
      disclaimer:'对齐是指我们在交付实践中按这些框架设计和运营。除非明确说明并有证据，否则不意味着正式认证、认可或第三方审计。',
    },
  },

  ts: {
    panels: {
      p01: { title:'Governor<em>.situationRoom</em>: BrowserTab', lede:'// phuket.transit + safety + env → 30s read\n// built: weeks; not: procurementCycle', w1lbl:'// WHY_SPECIAL', w1:'// govDashboards: ReadonlyPDF[]\n// phuket: WorkingOpsRoom — transit & safety & env\n// refresh: 42ms; analysts: never[]', w2lbl:'// REPLACED', w2:'threeAgencyReports + smsChain + tuesdayBriefing', w3lbl:'// DAY_ONE', w3:'existingIoT.build() // no new hardware', cta:'system.open()' },
            p03: { title:'bureaucracy<em>.makeLegible()</em>', lede:'// thailand.smartCity.programme → public surface\n// proposals.in; progress.visible; pdfs.never()', w1lbl:'// WHY_SPECIAL', w1:'nationalProgramme.online(bilingual)\n// outcomes not ceremony; status.update(onMilestone)', w2lbl:'// FUNDED_BY', w2:'depa // digital economy promotion agency\n// direct gov engagement, not sub-vendor', w3lbl:'// MATTERS', w3:'template.for(nationalSmartCity.programmes)', cta:'system.open()' },
      p04: { title:'ranking<em>.arguesBack()</em>', lede:'SLIC.show(5pillars)\n// mayors.define(livability)\n// math.follows()', w1lbl:'// WHY_SPECIAL', w1:'others.hand(finishedVerdict)\nSLIC.hand(math) // weights.move() → ranking.change()', w2lbl:'// REPLACED', w2:'staticLeaderboards + annualPDF + methodology.dispute', w3lbl:'// SIGNAL', w3:'MayorsOfEurope.adopted()\n// live-demo: SCSE 45min', cta:'SLIC.v3.open()' },
      p05: { title:'Kuching<em>.oneCommandSurface()</em>', lede:'// IOC: fullSpectrum\n// fx + flights + satellite + env → unified', w1lbl:'// WHY_SPECIAL', w1:'most: IOC<SingleDomain>\nkuching: crossDomain.fuse() // never switchTabs()', w2lbl:'// USERS', w2:'cityOperators + planners\n// realTime situational awareness, daily use', w3lbl:'// MATTERS', w3:'bloomberg.density / city // fraction.of.cost', cta:'system.open()' },
      p06: { title:'news<em>.before(algorithm.decidesWar)</em>', lede:'MEM: fastest opensource news surface\n// multiSource; noEditorialDelay; noFilterBubble', w1lbl:'// WHY_SPECIAL', w1:'platforms.have(editorial.layer)\nMEM.remove(that) // same signals, machineSpeed', w2lbl:'// REPLACED', w2:'3tabs + 2telegramChannels + twitterList', w3lbl:'// USERS', w3:'journalists + analysts + ngoFieldTeams', cta:'system.open()' },
      p07: { title:'bus.tracked<em>.rider.informed</em>', lede:'// GPS: realTime; telemetry: passenger\n// designed: phone.first // not controlRoom', w1lbl:'// WHY_SPECIAL', w1:'smartBus.for(operator.dashboard) // old\nthis.for(person.waiting(stop)) // new', w2lbl:'// REPLACED', w2:'noInfo + 2019schedule + "transit.cannotBeReadable"', w3lbl:'// BUILT_ON', w3:'phuket.IoT.existing\n// same sensor as governor ops room', cta:'system.open()' },
      p08: { title:'reports.arrive<em>.AI.turnsIntoAction()</em>', lede:'// telegram + LINE → AI.analyze()\n// satellite + map layers → nearRealTime', w1lbl:'// WHY_SPECIAL', w1:'complaintSystems.stop(ticketNumber)\nSCTH.stream → decisionSurface()', w2lbl:'// REPLACED', w2:'chatGroupScreenshots + manualTriage + staticLayers', w3lbl:'// DECISION_POWER', w3:'absorb + assign + analyze + export + push', w4lbl:'// LIVE_TUNNEL', w4:'system.proprietary.continuous\n// if !resolve: midUpgrade → retry()', cta:'system.open()' },
      p09: { title:'voices: 11<em>.decision: 1</em>', lede:'// 11 justices, palindromic names\n// local Mac; sharedTranscript; ~$3/month\n// trained: personal data // proprietary: byDesign', w1lbl:'// WHY_EXISTS', w1:'singleModel.gives(oneAnswer)\n// VERIFY | DECIDE | EXPLORE | DEBATE\n// moves: EXPAND | QUALIFY | CONCEDE | STAND | PASS', w2lbl:'// COST', w2:'manus.class @ $3/mo\n// chair: Mistral3; Ada: ThaiLLM(free)\n// Otto: ocr+video+email+pdf+drive', w3lbl:'// NO_DEMO', w3:'trained: { journals, decisions, voice }\n// protocol: ~600 lines Python // open\n// IP = coordinationMethodology', cta:'protocol.v1.read()', cta2:'agentic.v2.run()' },
      p10: { title:'HR.recordSystem<em>.enough(years)</em>', lede:'// TKCX: TalentKnowledgeCollaborativeExplorers\n// employees: partyMembers; projects: quests\n// teamAssembly: strategy', w1lbl:'// PROBLEM', w1:'HR.is(complianceRecord)\n// tells: whoEmployed\n// NOT: { deploy: where, with: whom }', w2lbl:'// ENGINE', w2:'DQ3.partySystem\n// 5 archetypes; moneyball: budget÷10\n// readiness(coverage+chemistry+morale)', w3lbl:'// CHANGES', w3:'directors.stop(hoardingPeople)\n// skillGaps.visible(beforeFailure)\n// HR.rename("TalentIncubation")', cta:'github.repo.coming.soon' },
      p11: { title:'AI<em>.knows(you)</em>', lede:'// ObsidianVault → MCP → allPlatforms: simultaneously\n// brainAnatomy.folders; serverConfigs: 19\n// agents.access(persona, voice, decisions)', w1lbl:'// GAP_CLOSED', w1:'session.starts(cold) // no context\nSecondBrainOS.feeds(voice + values + decisions)\n// AI.already.knows(whoItWorksWith)', w2lbl:'// ARCHITECTURE', w2:'vault: { PrefrontalCortex, Hippocampus, TemporalLobe }\n// 19 MCP configs → Cursor + Codex + ClaudeCode\n// livingKnowledgeGraph.connected(atOnce)', w3lbl:'// OPEN_SOURCE', w3:'license: MIT // brain: yours\n// fork(structure); adapt(mcpConfigs)\n// 12levelDiagnostic: strip(aiSpeak)', cta:'architecture.explore()' },
      ikigai: {
        name: 'IkigaiFinanceEngine',
        lede: '// SME.financeIntel: balanceSheet.asSignal + cashRunway + bankScorecard\n// indices: { Ikigai, Lean, Zero, Default, Solvency }\n// status: dev.stage // screenshots.only\n// ABCCompanyLtd: fictitious.mockData // !liveDeployment',
        cta: 'researchRepo.open()',
      },
      p27: {
        lede: '// AirDash = thailand.aqDust.watch(24/7)\n// provinceRanking + 3day.CAMSminusRain + top5.AT-risk + top5.PM25\n// + washoutLogic + nationalPatternDonut\n// every.province.reads(sameAirPicture // from publicData)',
        cta: 'system.open()',
      },
      p28: {
        lede: '// FloodDash.Blueprint = open.research.companion\n// sensors + drainageLogic + AI.predict() + responsePlaybooks\n// + data.to.decision.pipeline(complete)\n// cities: read.fork.adapt // system.replicable(not one-off)',
        cta: 'github.open()',
      },
      p29: {
        lede: '// paste.draft()\n// Non-Writer: chainOfProxies.run()\n// outputs: cleaner.text | drNon.voice | any.language()',
        cta: 'system.open()',
      },
      p12: { lede: '// NSP.thailand.streamingPlatform()\n// 21 NBTC-licensed digital TV channels // free, full HD, any device // live EPG + viewership telemetry + AI guide + CAP v1.2 emergency alerts', cta: 'platform.open()' },
      p13: { lede: '// Chula.ControlTower\n// 47 live data streams: traffic, events, AQ, satellite, campus, security, transport // one surface for the operations team', cta: 'system.open()' },
      p14: { lede: '// DayTraders.thaiMarketIntelligence()\n// Bloomberg-class signals for SET, MAI, mutual funds, RMF // personalized watchlists and AI summaries', cta: 'platform.open()' },
      p15: { lede: '// CityHub.replicableCityIntelligence()\n// give it a city name, it draws the map, absorbs your data, wires APIs and dashboards // one city at a time', cta: 'platform.open()' },
      p16: { lede: '// Chonburi.ControlTower\n// 3D command surface for the Eastern Seaboard: 42 live sources // coast weather, sea state, market and tourism, all in one', cta: 'tower.open()' },
      p17: { lede: '// Ekkasarn.AI.thaiDocumentIntelligence()\n// tax invoices, receipts, withholding certificates // OCR + validation + structured output', cta: 'system.open()' },
      p18: { lede: '// KMITL.ControlTower\n// 56 live data streams for King Mongkut\'s Institute of Technology Ladkrabang // traffic, events, AQ, satellite, campus, security', cta: 'system.open()' },
      p19: { lede: '// Yala.ControlTower\n// real-time civic intelligence for Yala City Municipality // 3D city model + satellite + flood monitoring + deep-south security events', cta: 'system.open()' },
      p20: { lede: '// Horizon45.aiJudgmentFieldInstrument()\n// deepfake detection → prompt engineering // users navigate real-world signals, leave with a capability portrait', cta: 'system.open()' },
      p21: { lede: '// HCMC.massiveScaleCommandSurface()\n// live traffic + flood monitoring + AQ + dynamic routing // one high-performance map for city decision-makers', cta: 'system.open()' },
      p33: { lede: '// MTT.superDashboard.v2()\n// IMPACT Arena + Challenger halls + flood + traffic + AQI + event load // 3D district map for Thailand densest mixed-use complex', cta: 'system.open()' },
      p22: { lede: '// threeRegionsMonitor()\n// Middle East, Southeast Asia, Thailand on one surface // open-data + layer overlays = insight', cta: 'system.open()' },
      p23: { lede: '// SCITI.smartCityThailandIndex()\n// official Thai index: 174 city areas, 7 smart-city pillars // progress and impact evaluated', cta: 'system.open()' },
      p24: { lede: '// DaoDeJing.trilingualReadingRoom()\n// Tsai comics + Buddhist parallels + psychology notes + pinyin + reference bookshelf // continuously updated', cta: 'system.open()' },
      p30: { lede: '// the desk.byTheNumbers()\n// daily AI-frontier brief // what is shipping, what is hot air, what to read tonight // sector watch + manual picks + compounding archive', cta: 'system.open()' },
      p31: { lede: '// NonScrape.scrapingAsAService()\n// no code // give it a URL + a question, it reads the page in source language, returns the answer in yours // with citations + structured JSON', cta: 'system.open()' },
    },
    stagesContent: {
      taipeiLoc:'Taipei<Stage.CityVision> March2026',
      taipeiTitle:'dashboard.live() // demo: 45min',
      taipeiLede:'// keynote: SmartCitySummit\n// SLIC.wentLive(during: talk)\n// cities: 157; pillars: 5; logic: adjustable',
      taipeiQuote:'"index.for(shelf): never\ncommand.for(street): always\nyou.build(ranking) // we.build(reality)"',
      taipeiCite:'// Dr.Non, TaipeiKeynote',
      taipeiS1:'cities.indexed', taipeiS2:'nations.represented', taipeiS3:'intel.partners', taipeiS4:'first.liveDemo',
      sgLoc:'Singapore<MainStage.GITEX> April2026',
      sgTitle:'capacity: standing_room_only',
      sgLede:'// GITEX AI Asia mainStage\n// workshop.hitCapacity(minutes)\n// hallway.full; every.face.on(liveDemo)',
      sgQuote:'"standingRoom: not applause\nstandingRoom: demandSignal\ngovernments.want(workingSystems)\ntired.of(waitingForTheDeck)"',
      sgCite:'// Dr.Non, postKeynote',
      sgS1:'mainStage.audience', sgS2:'total.attendees', sgS3:'nations.represented', sgS4:'workshop.capacity',
      leapLoc:'LEAP.East2026<OrbitalStage> Jul10',
      leapTitle:'asia.largestStage // FloodDash.launches()',
      leapLede:'// OrbitalStage.panel: FromCongestionToConnection\n// speakers: MitchellPrice, RichardChung, WillPeters, DrNon(DEPA)\n// closes: Q1_Q2.arc with FloodDash.liveLaunch',
      leapQuote:'"stages: 3; months: 6\nTaipei.indexed(cities); GITEX.filled(room)\nLEAP.East.shipped(floodWatch) // live, public, running"',
      leapCite:'// Dr.Non, LEAP.East.panel',
      leapS1:'stage.tier: Orbital', leapS2:'panel.speakers: 4', leapS3:'data.sources: 9', leapS4:'FloodDash: live',
    },
    teamContent: {
      founderLabel:'CoFounders<Bangkok>',
      collectiveTitle:'collective.onCall()',
      collectiveLede:'// researchers + trafficEngineers + anthropologists\n// financiers + policyTranslators + mediaOperators\n// join: byProblem; not: byOrgChart',
      probonoTitle:'proBono: Institutional[]',
      probonoNote:'// live working platforms[]\n// not: Deck[] | Report[]\n// each: built(realPartner).deployed(public).stillInUse()',
      pb1org:'for: ASEANSecretariat', pb1title:'cities: 38; nations: 10; platform: 1', pb1for:'ASEAN SmartCitiesNetwork',
      pb2org:'ASEAN + UNDP + UNHabitat', pb2title:'users: 112_000 // born: realFlooding', pb2for:'ASEAN CSCO Handbook',
      pb3org:'UNDESA + SolomonIslandsGov', pb3title:'digital.roadmap: wholeOfGovernment', pb3for:'Honiara<Workshop, 2days>',
      pb4org:'for: depaThailand', pb4title:'digitalAgency.online()', pb4for:'SmartCityLeadership<Bilingual>',
      pb5org:'depa<USDOT>', pb5title:'fieldworkToSoftware(toolkit)', pb5for:'US_ASEAN_SmartCitiesPartnership',
    },
    notesContent: {
      foldLine:'// fieldNotes: 6 patterns · howWeShip()',
      kicker:'// HOW_IT_GETS_BUILT',
      title:'type Lessons = LearnedByActuallyShipping',
      lede:'// 10 systems; 2 people; 12 months\n// patterns.that.held + patterns.that.didnt\n// published: because gap.closes(whenPeopleShare)',
      n1title:'vendor.said("no") // shipped: day14',
      n1body:'every system: procurement.said("tooExpensive")\n// answer: never argue\n// answer: build(rough).put(inRoom)\n// liveSurface.changes(conversation) > anyProposal',
      n2title:'aiNative !== aiAssisted',
      n2body:'every line: writtenBy(ClaudeCode).directedBy(DrNon)\n// AI: engineer; human: architect\n// skill.that.compounds = directingAI(precisely)\n// code !== hardPart',
      n3title:'problem !== data // problem === decision.behind(data)',
      n3body:'clients.ask(dashboard)\nthey.need(clarity.on(oneDecision))\n// find(decision).first()\n// everything else flows from it',
      n4title:'orgChart.tells(whoReports)\n// NOT: who.should.build(what).with(whom)',
      n4body:'TKCX.built(onThisGap)\n// archetypes + readiness + moneyballCap\n// expose: { rightPeople, chemistry, skillGaps }',
      n5title:'singleAI.answers() // council.deliberates()',
      n5body:'singleModel.gives(oneFraming)\n// council: 11justices(differentPriors)\n// moves: EXPAND|QUALIFY|CONCEDE|STAND|PASS\n// disagreement === product',
      n6title:'instrument(fromDay1) // not: after',
      n6body:'every system: ships({ pageviews, signals, decisionLog })\n// retrofitting: impossible\n// nextVersion = built(from: firstVersion.taught)\n// leave: Record<string, Evidence>',
      stackNote:'localFirst: true\nbuildTeam: never[]\nvendorLockIn: false\nM5Max.runs({ inference, builds, deploys })\n// location: oneDeskInBangkok',
    },
    builtStack: {
      heading:'buildStack[]', meta:'// 114 tools, 9 layers',
      expandFull:'stack.expandAll() // 114 tools, 9 layers',
      l1name:'infra.cloud()', l1role:'// runtime host',
      l2name:'framework.connect()', l2role:'// the wiring',
      l3name:'platform.build()', l3role:'// dev surface',
      l4name:'ai.models[]', l4role:'// the brain',
      l5name:'lib.runtime', l5role:'// moving parts',
      l6name:'lang.src', l6role:'// the source',
      l7name:'data.live()', l7role:'// inputs',
      l8name:'channels.out', l8role:'// outputs',
      l9name:'runtime.local()', l9role:'// the desk',
      legend:'<span data-runtime="cloud">// cloud</span><span data-runtime="local">// local</span>',
    
      expandHint:'// 9 layers, 117 tools, one desk.bangkok() // click below for the full list',},
    brandSect: {
      foldLine:'// brandKit[8] · download.available()',
      kicker:'brandKit[]',
      meta:'// 8 sheets · axiom.identitySystem',
      lede:'// cover, logo, colors, type, layout — 8 sheets\n// download.zip() || browse.all()',
      downloadCta:'brandKit.download()',
      expandAll:'brandSheets.viewAll()',
    },
    pressSection: { foldLine:'// press: 7 articles · GovInsider | ASEAN | YouTube', kicker:'// IN_THE_PRESS', title:'read() // watch() // decide()', lede:'// outside coverage: { work, thesis, systems }' },
    pressContent: {
      p1title:'// vendor.refuse() → civilServant.build()',
      p2title:'// InnovationService.close(gap: PolicyToImplementation)',
      p3title:'// index.builtByThem; ranking.builtByYou',
      p4title:'// digitalConnectivity + openInnovation + inclusion.scales()',
      p5title:'// AI.mine(cityData).cheaply().smarter()',
      p6title:'// smartCities.need: citizens, not just tech',
      p7title:'// MiddleEast.monitor(conflictSignal, live)',
    },
    credentialsSect: {
      foldLine:'// AxiomXCoLtd · reg:0105569099335 · TH · DBD',
      kicker:'// CREDENTIALS',
      eyebrow:'entity',
      title:'legalEntity.registered(TH)',
      compactLine:'Axiom X Co., Ltd. · regNo: 0105569099335 · TH · DBD.registered',
      tradeNameNote:'// site + services.presentedAs(tradeName: Axiom)\n// legalEntity.registered: Axiom X Co., Ltd. (Thailand)',
      summaryToggle:'details.expand(registration + standards)',
      companyTitle:'RegisteredEntity',
      nameLbl:'name.th',
      nameTh:'บริษัท แอคเซี่ยม เอ็กซ์ จำกัด',
      nameEnLbl:'name.en',
      nameEn:'Axiom X Co., Ltd.',
      regNoLbl:'regNo',
      regDateLbl:'registeredAt',
      regDate:'2026-05-28 // 28 พ.ค. 2569',
      jurisdictionLbl:'jurisdiction',
      jurisdiction:'KingdomOfThailand',
      addressLbl:'hq.address',
      address:'16 Soi Phahonyothin 59 Yaek 1, Anusawari, Bang Khen, Bangkok',
      authorityLbl:'issuedBy',
      authority:'DBD, MinistryOfCommerce',
      capitalLbl:'capital.registered',
      capital:'THB 1_000_000',
      businessLbl:'scope.core',
      business:'tech + AI + digitalSystems + smartCity.consulting + innovation.services',
      standardsTitle:'standards.align()',
      standardsMeta:'4 tiers · practiceBased',
      standardsLede:'// design + deliver against frameworks[]\n// operationalAlignment — NOT formal ISO.cert unless audited + stated',
      tier1:'tier.foundational',
      tier2:'tier.governance',
      tier3:'tier.legal',
      tier4:'tier.ethics',
      t1i1:'ISO/IEC 30173:2023 // digitalTwin.concepts',
      t1i2:'ISO 23247 // digitalTwin.framework',
      t1i3:'IEC / ISO / IEEE // digitalTwin.ecosystem',
      t1i4:'NIST.digitalTwin.programme',
      t2i1:'ISO/IEC JTC 1 // ICT.standardsBase',
      t2i2:'interop + dataExchange.frameworks',
      t2i3:'ISO/IEC 42001 // AI.managementSystem',
      t2i4:'ISO/IEC 23894 // AI.riskManagement',
      t2i5:'NIST.AI.RMF',
      t3i1:'PDPA // Thailand',
      t3i2:'GDPR // advisory(EU-facing)',
      t3i3:'sectoral.privacy + trust.guidelines',
      t4i1:'OECD.AI.Principles',
      t4i2:'UNESCO.AI.Ethics',
      t4i3:'transparency · fairness · humanOversight',
      t4i4:'safety · robustness · accountableDeploy',
      stackTag:'stack.ref',
      stackCallout:'refStack: ISO/IEC 30173 + ISO 23247 + ISO/IEC 42001 + ISO/IEC 23894 + PDPA + GDPR',
      disclaimer:'// alignment = design + operate.to(frameworks) in delivery\n// NOT: certification | accreditation | thirdPartyAudit\n// unless explicitly.stated + evidenced',
    },
  },
};

// Merge i18nExt into uiCopy
Object.keys(i18nExt).forEach(locale => {
  if (uiCopy[locale]) Object.assign(uiCopy[locale], i18nExt[locale]);
});

// Regional locales (KO, JA, VI) — loaded from i18n-regional.js
if (typeof window !== 'undefined' && window.AXIOM_REGIONAL_LOCALES) {
  Object.assign(uiCopy, window.AXIOM_REGIONAL_LOCALES);
}

// ── Phase 2: chips, categories, bios, network, footer ─────────────────────
const i18nExt2 = {
  en: {
    chips: {
      p01:'Live · Phuket', p02:'Live · Global', p03:'Live · National',
      p04:'Live · 157 cities', p05:'Live · Sarawak', p06:'Live · Middle East',
      p07:'Live · Phuket Transit', p08:'Live · City ops',
      p09:'Proprietary · Local-first', p10:'Live · Enterprise HR',
      p11:'Research Preview · Open Protocol',
      p12:'Live · National Broadcast',
      p13:'Live · Campus Ops',
      p14:'Live · Thai Markets',
      p15:'Live · 5 cities',
      p16:'Live · Chonburi EEC',
      p17:'Live · Thai docs',
      p27:'Live · 24/7 Air Watch',
      p28:'Open Blueprint · GitHub',
      p29:'Live · Writing Service',
      p30:'Live · Daily Digest',
      p31:'Live · Scraping',
      p33:'Live · District Ops',
    },
    cats: {
      c01:'Regional Operations', c02:'Strategic Intelligence',
      c03:'National Programme', c04:'City Benchmarking',
      c05:'Intelligent Operations', c06:'Open Intelligence',
      c07:'Transit Intelligence', c08:'Civic Intelligence',
      c09:'Agentic Intelligence', c10:'Talent Intelligence',
      c11:'Knowledge Intelligence', c12:'National Broadcast',
      c13:'Campus Intelligence', c14:'Market Intelligence',
      c15:'City Intelligence',
      c16:'Coastal Intelligence', c17:'Document Intelligence',
      c18:'Metropolitan Operations', c19:'Environmental Watch',
      c20:'Capability Lab', c23:'Digital Humanities', c25:'Finance Intelligence',
      c26:'Open Blueprint', c27:'Writing Intelligence',
      c28:'News Intelligence', c29:'Scraping Service',
    },
    bioCommon: { cvBtn:'View CV', education:'Education' },
    bioNon: {
      role:'Co-Founder · Systems & Story',
      lede:'Anthropologist, architect, builder. He watches how cities actually behave, then turns that mess into interfaces people use without a training manual.',
      bio:'Harvard PhD in Anthropology. MIT and Oxford alumnus. Former Visiting Lecturer at MIT, postdoctoral fellow at NYU. He designs from fieldwork first — because people aren\'t spreadsheets and cities aren\'t slides.',
      cvHeader:'Non Arkara, PhD — Quick Profile',
      cvCurrentRole:'Current Role',
      cvCurrentRoleBody:'Senior Expert in Smart City Promotion, Digital Economy Promotion Agency (depa), Bangkok — May 2019–present. Advisor to Thailand Media Fund, SLIC, NXPO, and the National Strategic Taskforce on Northern Economic Corridor (NeEC).',
      cvSelectedRoles:'Selected Roles',
      cvScale:'Scale of Work',
      cvScale1:'120+ technology and public-private projects across 77 Thai provinces',
      cvScale2:'5,000+ government officials trained in digital literacy and smart city',
      cvScale3:'300+ keynote appearances at global and domestic forums',
      cvScale4:'50+ publications in Urban Studies, Journal of Urban Design, and others',
      cvAwards:'Selected Awards',
    },
    bioPoon: {
      role:'Co-Founder · Infrastructure & Delivery',
      lede:'Engineer, strategist, operational anchor. He keeps ambition tied to working systems and makes sure the product survives contact with reality.',
      bio:'Associate Professor at Chiang Mai University. Co-author of Chiang Mai\'s Smart City Master Plan. Works on cities as complex adaptive systems — real-time bus prediction, transit decision support, sustainable infrastructure.',
      cvCurrentRoles:'Current Roles',
      cvCurrentRolesBody:'Deputy Director, Program Management Unit for Area-Based Development (PMU-A), Ministry of Higher Education, Science, Research and Innovation, Thailand; Director, Excellence Center for Urban Study and Public Policy (ECUP), Chiang Mai University.',
      cvExpertise:'Core Expertise',
      cvExpertiseBody:'Civil engineering, construction management, sustainable infrastructure development, climate change, disaster management, logistics, urban planning, urban mobility, and transportation systems.',
      cvSelectedWork:'Selected Work',
      cvWork1:'Head of Sustainable Infrastructure Development and Climate Change Research Unit, Chiang Mai University, 2010–present',
      cvWork2:'Lead Coordinator, Research University Network (RUN) for Climate Change and Disaster Management, 2015–present',
      cvWork3:'Bus rapid transit and mass transportation studies in Chiang Mai',
      cvWork4:'Integrated land-use, logistics, and transport management with World Bank',
      cvWork5:'Green logistics and renewable energy projects for agriculture and industry',
      cvWork6:'Disaster management for critical infrastructure and supply chains',
    },
    network: {
      traffic:'Traffic engineers', uav:'UAV operators', economists:'Economists',
      financiers:'Financiers', policy:'Policy translators',
      urban:'Urban researchers', media:'Media operators',
    },
    footer: {
      contact:'Contact',
      p1:'Axiom builds decision systems for cities, governments, and operators. Delivery is designed with reference to recognised international frameworks for digital twins, AI governance, and data protection.',
      p2:'Unless expressly stated in writing, no ISO certification, formal accreditation, or third-party audit is claimed. Demonstration and sandbox environments on this site use illustrative data. Nothing here constitutes legal, financial, or investment advice. Client engagements are governed by separate agreements; production systems under NDA may differ from public demonstrations.',
      frameworksLabel:'Reference frameworks (alignment by practice, not certification)',
      fwTwin:'Digital twin & interoperability — ISO/IEC 30173, ISO 23247, NIST',
      fwAi:'AI governance & risk — ISO/IEC 42001, ISO/IEC 23894, NIST AI RMF, OECD AI Principles',
      fwPrivacy:'Privacy & trust — PDPA, GDPR-informed principles; jurisdictional compliance is engagement-specific',
      legalLabel:'Terms · Privacy · Liability · Law',
      terms:'By using this site you agree to use it lawfully and not to republish the screenshots, dashboards, model outputs, or system internals without written permission. Axiom, the Axiom name, and the system names shown here are trade names of Axiom X Co., Ltd.',
      privacy:'This site does not collect personal data beyond a 12-character hashed visitor tag used for rate limiting and aggregate traffic measurement. The systems linked from here have their own privacy practices — read theirs before you paste their data anywhere. We do not set advertising cookies and we do not sell or share visitor data with third parties.',
      dataAttribution:'Live data shown in the sandbox systems comes from public sources including TMD, GISTDA, JICA, NBTC, Pollution Control Department, OpenStreetMap contributors, TomTom, and other public or open-licensed feeds credited in-system. Where commercial feeds are mixed in (e.g. Air4Thai o61, 33V, 34T, Naver CFT) the source is named in the system view.',
      liability:'Sandbox and demonstration systems on this site are working, not guaranteed. Treat every metric as a hint, not a verdict. Real decisions need real verification with the originating authority. Axiom is not liable for decisions made on sandbox data.',
      governingLaw:'These terms are governed by the laws of the Kingdom of Thailand. Disputes are subject to the exclusive jurisdiction of the courts of Bangkok. Where this English text conflicts with any translation, the English text prevails.',
      hosting:'Hosted on Cloudflare Pages · Built and operated from Bangkok, Thailand · Source for this site: github.com/Nonarkara/Axiom (public site only; client systems are private).',
      copyright:'Bangkok · Southeast Asia. © 2026 Axiom X Co., Ltd. Uptime, response times, and outcome metrics cited here are case-specific observations, not guarantees of future performance.',
    },
    misc: { swipeHint:'4 groups · 17 systems — swipe' },
    sysClusters: {
      sysMeta: '32 systems · 5 countries',
      command: 'City Dashboards',
      commandMeta: 'Real-time city operations rooms & environmental watch · 13',
      intelligence: 'Intelligence',
      intelligenceMeta: 'Signal & analysis · 4',
      civic: 'Civic',
      civicMeta: 'National platforms & citizen infrastructure · 4',
      emerging: 'Emerging',
      emergingMeta: 'Research-grade & new operating models · 8',
      lab: 'Lab',
      labMeta: 'Side tools · in the open · 4',
    },
    sysStatus: { live: 'Live', preview: 'Preview', dev: 'In Development', soon: 'Coming soon' },
    metaKeys: {
      AI:'AI', Access:'Access', Audience:'Audience', Authority:'Authority',
      Backup:'Backup', 'Brain layers':'Brain layers', Cadence:'Cadence',
      Channels:'Channels', Cities:'Cities', Cost:'Cost', Coverage:'Coverage',
      Data:'Data', Documents:'Documents', Employees:'Employees', Engine:'Engine', Intake:'Intake',
      Interface:'Interface', Justices:'Justices', Latency:'Latency',
      Layers:'Layers', Match:'Match', Mode:'Mode', Peak:'Peak', Pillars:'Pillars',
      Platforms:'Platforms', Programme:'Programme', Protocol:'Protocol',
      Region:'Region', Scope:'Scope', Screens:'Screens', Sensors:'Sensors',
      Sources:'Sources', Stack:'Stack', Status:'Status', Stream:'Stream',
      Tracking:'Tracking', Feeds:'Feeds', Lenses:'Lenses', Site:'Site',
      Market:'Market', Signals:'Signals', Frameworks:'Frameworks',
    },
    HOW_IT_WORKS: 'HOW IT WORKS',
    archTag: 'Architecture',
    stackLbl: 'Stack',
    pb1in1:'38 cities', pb1in2:'134 projects', pb1in3:'11 nations', pb1in4:'M&E submissions',
    pb1cm:'multi-tenant city benchmarking',
    pb1out1:'Scorecards', pb1out2:'Public dashboards', pb1out3:'Mayoral insights',
    pb2in1:'112,000 residents', pb2in2:'City officials', pb2in3:'UNDP + UN-Habitat', pb2in4:'Field evidence',
    pb2cm:'12-chapter citizen-first playbook',
    pb2out1:'Policy playbook', pb2out2:'Workshop toolkit', pb2out3:'Field case studies',
    pb3in1:'8 ministries', pb3in2:'UN DESA team', pb3in3:'2-day workshop', pb3in4:'Honiara field input',
    pb3cm:'whole-of-government digital transformation',
    pb3out1:'Digital roadmap', pb3out2:'Implementation timeline', pb3out3:'Capacity-building plan',
    pb4in1:'depa Thailand', pb4in2:'174 cities', pb4in3:'Leadership cohort', pb4in4:'Curriculum data',
    pb4cm:'smart city executive programme',
    pb4out1:'Bilingual portal', pb4out2:'Executive directory', pb4out3:'Programme schedule',
    pb5in1:'depa Thailand', pb5in2:'US DOT Volpe', pb5in3:'Field research', pb5in4:'Survey data',
    pb5cm:'institutional capacity building',
    pb5out1:'Toolkit portal', pb5out2:'Best-practices library', pb5out3:'City-to-city modules',
  },

  th: {
    chips: {
      p01:'สด · ภูเก็ต', p02:'สด · ทั่วโลก', p03:'สด · ระดับชาติ',
      p04:'สด · 157 เมือง', p05:'สด · ซาราวัก', p06:'สด · ตะวันออกกลาง',
      p07:'สด · ขนส่งภูเก็ต', p08:'สด · งานเมือง',
      p09:'กรรมสิทธิ์ · Local-first', p10:'สด · Enterprise HR',
      p11:'Research Preview · Protocol เปิด',
      p12:'สด · กระจายเสียงแห่งชาติ',
      p13:'สด · ปฏิบัติการวิทยาเขต',
      p14:'สด · ตลาดไทย',
      p15:'สด · 5 เมือง',
      p16:'สด · Chonburi EEC',
      p17:'สด · เอกสารไทย',
      p27:'สด · เฝ้าอากาศ 24/7',
      p28:'Blueprint เปิด · GitHub',
      p29:'สด · บริการเขียน',
      p30:'สด · บทความรายวัน',
      p31:'สด · ดูดข้อมูล',
      p33:'สด · ปฏิบัติการเขต',
    },
    cats: {
      c01:'ปฏิบัติการระดับภูมิภาค', c02:'ข่าวกรองเชิงกลยุทธ์',
      c03:'โครงการระดับชาติ', c04:'การจัดอันดับเมือง',
      c05:'ปฏิบัติการอัจฉริยะ', c06:'ข่าวกรองแบบเปิด',
      c07:'ระบบขนส่งอัจฉริยะ', c08:'ข่าวกรองพลเมือง',
      c09:'ข่าวกรอง Agentic', c10:'ข่าวกรองบุคลากร',
      c11:'ข่าวกรองความรู้', c12:'กระจายเสียงแห่งชาติ',
      c13:'ข่าวกรองวิทยาเขต', c14:'ข่าวกรองตลาด',
      c15:'ข่าวกรองเมือง',
      c16:'ข่าวกรองชายฝั่ง', c17:'ข่าวกรองเอกสาร',
      c18:'ปฏิบัติการมหานคร', c19:'เฝ้าสิ่งแวดล้อม',
      c20:'ห้องทดลองความสามารถ', c23:'มนุษยศาสตร์ดิจิทัล', c25:'ข่าวกรองการเงิน',
      c26:'Blueprint เปิด', c27:'ข่าวกรองการเขียน',
      c28:'ข่าวกรองข่าว', c29:'บริการดูดข้อมูล',
    },
    bioCommon: { cvBtn:'ดู CV', education:'การศึกษา' },
    bioNon: {
      role:'ผู้ร่วมก่อตั้ง · ระบบและการเล่าเรื่อง',
      lede:'นักมานุษยวิทยา สถาปนิก นักสร้าง เขาเฝ้าดูว่าเมืองทำงานอย่างไรจริงๆ แล้วเปลี่ยนความยุ่งเหยิงนั้นให้เป็นอินเทอร์เฟซที่ผู้คนใช้ได้โดยไม่ต้องมีคู่มือ',
      bio:'PhD ด้านมานุษยวิทยาจาก Harvard ศิษย์เก่า MIT และ Oxford อดีต Visiting Lecturer ที่ MIT postdoctoral fellow ที่ NYU เขาออกแบบจากงานภาคสนามก่อน เพราะคนไม่ใช่ spreadsheet และเมืองไม่ใช่สไลด์',
      cvHeader:'ดร.นน อัครประเสริฐกุล · ประวัติย่อ',
      cvCurrentRole:'ตำแหน่งปัจจุบัน',
      cvCurrentRoleBody:'ผู้เชี่ยวชาญอาวุโสด้านการส่งเสริมเมืองอัจฉริยะ สำนักงานส่งเสริมเศรษฐกิจดิจิทัล (depa) กรุงเทพฯ พ.ค. 2562–ปัจจุบัน ที่ปรึกษาให้ Thailand Media Fund, SLIC, NXPO และ National Strategic Taskforce on Northern Economic Corridor (NeEC)',
      cvSelectedRoles:'บทบาทคัดสรร',
      cvScale:'ขนาดของงาน',
      cvScale1:'โครงการเทคโนโลยีและความร่วมมือรัฐ-เอกชน 120+ โครงการ ใน 77 จังหวัด',
      cvScale2:'อบรมข้าราชการด้าน digital literacy และเมืองอัจฉริยะ 5,000+ คน',
      cvScale3:'ขึ้น keynote 300+ ครั้งในเวทีระดับโลกและในประเทศ',
      cvScale4:'ผลงานตีพิมพ์ 50+ ฉบับใน Urban Studies, Journal of Urban Design และอื่นๆ',
      cvAwards:'รางวัลคัดสรร',
    },
    bioPoon: {
      role:'ผู้ร่วมก่อตั้ง · โครงสร้างพื้นฐานและการส่งมอบ',
      lede:'วิศวกร นักกลยุทธ์ จุดยึดของการปฏิบัติงาน เขายึดความทะเยอทะยานไว้กับระบบที่ทำงานได้จริง และทำให้ผลิตภัณฑ์รอดจากการสัมผัสกับความเป็นจริง',
      bio:'รองศาสตราจารย์มหาวิทยาลัยเชียงใหม่ ผู้ร่วมเขียนแผนแม่บทเมืองอัจฉริยะของเชียงใหม่ ทำงานเรื่องเมืองในฐานะระบบปรับตัวที่ซับซ้อน การทำนายรถเมล์แบบเรียลไทม์ การสนับสนุนการตัดสินใจด้านขนส่ง โครงสร้างพื้นฐานยั่งยืน',
      cvCurrentRoles:'ตำแหน่งปัจจุบัน',
      cvCurrentRolesBody:'รองผู้อำนวยการ Program Management Unit for Area-Based Development (PMU-A) กระทรวง อว. ผู้อำนวยการ Excellence Center for Urban Study and Public Policy (ECUP) มหาวิทยาลัยเชียงใหม่',
      cvExpertise:'ความเชี่ยวชาญหลัก',
      cvExpertiseBody:'วิศวกรรมโยธา การจัดการก่อสร้าง การพัฒนาโครงสร้างพื้นฐานยั่งยืน การเปลี่ยนแปลงสภาพภูมิอากาศ การจัดการภัยพิบัติ โลจิสติกส์ การวางผังเมือง การเคลื่อนที่ในเมือง และระบบขนส่ง',
      cvSelectedWork:'ผลงานคัดสรร',
      cvWork1:'หัวหน้าหน่วยวิจัยการพัฒนาโครงสร้างพื้นฐานยั่งยืนและการเปลี่ยนแปลงสภาพภูมิอากาศ มหาวิทยาลัยเชียงใหม่ 2553–ปัจจุบัน',
      cvWork2:'หัวหน้าผู้ประสานงาน Research University Network (RUN) for Climate Change and Disaster Management 2558–ปัจจุบัน',
      cvWork3:'การศึกษา Bus Rapid Transit และระบบขนส่งมวลชนในเชียงใหม่',
      cvWork4:'การจัดการการใช้ประโยชน์ที่ดิน โลจิสติกส์ และขนส่งร่วมกับธนาคารโลก',
      cvWork5:'โครงการโลจิสติกส์สีเขียวและพลังงานทดแทนสำหรับเกษตรและอุตสาหกรรม',
      cvWork6:'การจัดการภัยพิบัติสำหรับโครงสร้างพื้นฐานสำคัญและห่วงโซ่อุปทาน',
    },
    network: {
      traffic:'วิศวกรจราจร', uav:'ผู้ปฏิบัติการ UAV', economists:'นักเศรษฐศาสตร์',
      financiers:'นักการเงิน', policy:'ผู้แปลนโยบาย',
      urban:'นักวิจัยเมือง', media:'ผู้ปฏิบัติงานสื่อ',
    },
    footer: {
      contact:'ติดต่อ',
      p1:'Axiom สร้างระบบการตัดสินใจสำหรับเมือง รัฐบาล และผู้ปฏิบัติงาน การส่งมอบงานออกแบบโดยอ้างอิงกรอบมาตรฐานสากลที่ได้รับการยอมรับด้าน digital twin การกำกับดูแล AI และการคุ้มครองข้อมูล',
      p2:'เว้นแต่จะระบุเป็นลายลักษณ์อักษรอย่างชัดเจน จะไม่อ้างการรับรอง ISO การให้สิทธิ์อย่างเป็นทางการ หรือการตรวจสอบโดยบุคคลที่สาม สภาพแวดล้อมสาธิตและ sandbox บนเว็บไซต์นี้ใช้ข้อมูลเพื่อประกอบการนำเสนอเท่านั้น เนื้อหาที่นี่ไม่ใช่คำแนะนำทางกฎหมาย การเงิน หรือการลงทุน งานลูกค้าอยู่ภายใต้สัญญาแยกต่างหาก ระบบจริงภายใต้ NDA อาจแตกต่างจากที่แสดงต่อสาธารณะ',
      frameworksLabel:'กรอบอ้างอิง (จัดแนวตามการปฏิบัติ ไม่ใช่การรับรอง)',
      fwTwin:'Digital twin และการทำงานร่วมกัน — ISO/IEC 30173, ISO 23247, NIST',
      fwAi:'การกำกับดูแลและความเสี่ยง AI — ISO/IEC 42001, ISO/IEC 23894, NIST AI RMF, OECD AI Principles',
      fwPrivacy:'ความเป็นส่วนตัวและความน่าเชื่อถือ — PDPA หลักการตาม GDPR การปฏิบัติตามกฎหมายขึ้นกับขอบเขตงานแต่ละรายการ',
      legalLabel:'ข้อกำหนด · ความเป็นส่วนตัว · ความรับผิด · กฎหมาย',
      terms:'การใช้เว็บไซต์นี้ถือว่าคุณยอมรับที่จะใช้อย่างถูกกฎหมาย และจะไม่เผยแพร่ซ้ำภาพหน้าจอ แดชบอร์ด ผลลัพธ์จากโมเดล หรือระบบภายในโดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร Axiom ชื่อ Axiom และชื่อระบบที่ปรากฏ เป็นชื่อทางการค้าของบริษัท แอคเซี่ยม เอ็กซ์ จำกัด',
      privacy:'เว็บไซต์นี้ไม่เก็บข้อมูลส่วนบุคคลใด ๆ นอกเหนือจากแฮชผู้เข้าชม 12 ตัวอักษร เพื่อจำกัดอัตราการร้องขอและวัดปริมาณการใช้งานรวม ระบบที่เชื่อมโยงจากที่นี่มีนโยบายความเป็นส่วนตัวของตนเอง โปรดอ่านก่อนนำข้อมูลไปใช้ เราไม่ตั้งคุกกี้โฆษณา ไม่ขาย และไม่แบ่งปันข้อมูลผู้เข้าชมกับบุคคลที่สาม',
      dataAttribution:'ข้อมูลสดในระบบ sandbox มาจากแหล่งสาธารณะ รวมถึง TMD, GISTDA, JICA, NBTC, กรมควบคุมมลพิษ, ผู้มีส่วนร่วม OpenStreetMap, TomTom และแหล่งข้อมูลสาธารณะหรือที่มีสัญญาอนุญาตแบบเปิดอื่น ๆ ที่ระบุในระบบ หากมีการผสมแหล่งข้อมูลเชิงพาณิชย์ (เช่น Air4Thai o61, 33V, 34T, Naver CFT) จะระบุแหล่งที่มาในมุมมองของระบบ',
      liability:'ระบบ sandbox และสาธิตบนเว็บไซต์นี้ทำงานได้จริง แต่ไม่รับประกัน ตัวเลขทุกตัวเป็นเพียงสัญญาณ ไม่ใช่คำตัดสิน การตัดสินใจจริงต้องตรวจสอบกับหน่วยงานต้นทาง Axiom ไม่รับผิดชอบต่อการตัดสินใจที่อิงข้อมูล sandbox',
      governingLaw:'ข้อกำหนดเหล่านี้อยู่ภายใต้กฎหมายแห่งราชอาณาจักรไทย ข้อพิพาทอยู่ในเขตอำนาจศาลแห่งกรุงเทพมหานครโดยเฉพาะ หากข้อความภาษาอังกฤษขัดแย้งกับคำแปล ให้ใช้ภาษาอังกฤษเป็นหลัก',
      hosting:'โฮสต์บน Cloudflare Pages · สร้างและดำเนินงานจากกรุงเทพฯ · ซอร์สของเว็บไซต์นี้: github.com/Nonarkara/Axiom (เฉพาะเว็บสาธารณะ ระบบลูกค้าเป็นส่วนตัว)',
      copyright:'กรุงเทพฯ · เอเชียตะวันออกเฉียงใต้ © 2569 บริษัท แอคเซี่ยม เอ็กซ์ จำกัด ตัวเลข uptime เวลาตอบสนอง และผลลัพธ์ที่อ้างถึงเป็นการสังเกตเฉพาะกรณี ไม่ใช่การรับประกันผลในอนาคต',
    },
    misc: { swipeHint:'4 กลุ่ม · 17 ระบบ — ปัดเพื่อสำรวจ' },
    sysClusters: {
      sysMeta: '32 ระบบ · 5 ประเทศ',
      command: 'แดชบอร์ดเมือง',
      commandMeta: 'ห้องปฏิบัติการเมืองแบบเรียลไทม์และเฝ้าสิ่งแวดล้อม · 13',
      intelligence: 'ข่าวกรอง',
      intelligenceMeta: 'สัญญาณและการวิเคราะห์ · 4',
      civic: 'พลเมือง',
      civicMeta: 'แพลตฟอร์มระดับชาติและโครงสร้างพื้นฐานพลเมือง · 4',
      emerging: 'ระบบใหม่',
      emergingMeta: 'ระดับวิจัยและแบบจำลองการดำเนินงานใหม่ · 8',
      lab: 'แล็บ',
      labMeta: 'เครื่องมือเสริม · เปิดกว้าง · 4',
    },
    sysStatus: { live: 'สด', preview: 'พรีวิว', dev: 'กำลังพัฒนา', soon: 'เร็ว ๆ นี้' },
    metaKeys: {
      AI:'AI', Access:'การเข้าถึง', Audience:'ผู้ชม', Authority:'หน่วยงาน',
      Backup:'สำรองข้อมูล', 'Brain layers':'ชั้นสมอง', Cadence:'จังหวะ',
      Channels:'ช่อง', Cities:'เมือง', Cost:'ต้นทุน', Coverage:'พื้นที่ครอบคลุม',
      Data:'ข้อมูล', Documents:'เอกสาร', Employees:'พนักงาน', Engine:'เครื่องยนต์', Intake:'การรับเข้า',
      Interface:'อินเทอร์เฟซ', Justices:'ตุลาการ', Latency:'ความหน่วง',
      Layers:'เลเยอร์', Match:'การจับคู่', Mode:'โหมด', Peak:'สูงสุด', Pillars:'เสาหลัก',
      Platforms:'แพลตฟอร์ม', Programme:'โครงการ', Protocol:'โปรโตคอล',
      Region:'ภูมิภาค', Scope:'ขอบเขต', Screens:'หน้าจอ', Sensors:'เซ็นเซอร์',
      Sources:'แหล่งข้อมูล', Stack:'Stack', Status:'สถานะ', Stream:'สตรีม',
      Tracking:'การติดตาม', Feeds:'ฟีดข้อมูล', Lenses:'มุมมอง', Site:'สถานที่',
      Market:'ตลาด', Signals:'สัญญาณ', Frameworks:'กรอบคิด',
    },
    HOW_IT_WORKS: 'มันทำงานยังไง',
    archTag:'สถาปัตยกรรม',
    stackLbl:'สแต็ก',
    pb1in1:'38 เมือง', pb1in2:'134 โครงการ', pb1in3:'11 ประเทศ', pb1in4:'ข้อมูล M&E',
    pb1cm:'การเปรียบเทียบเมืองแบบหลายผู้เช่า',
    pb1out1:'คะแนน', pb1out2:'แดชบอร์ดสาธารณะ', pb1out3:'ข้อมูลเชิงลึกสำหรับผู้ว่าฯ',
    pb2in1:'ชาวเมือง 112,000 คน', pb2in2:'เจ้าหน้าที่เมือง', pb2in3:'UNDP + UN-Habitat', pb2in4:'หลักฐานภาคสนาม',
    pb2cm:'คู่มือ 12 บท ที่ประชาชนเป็นศูนย์กลาง',
    pb2out1:'คู่มือนโยบาย', pb2out2:'ชุดเครื่องมือเวิร์กช็อป', pb2out3:'กรณีศึกษาภาคสนาม',
    pb3in1:'8 กระทรวง', pb3in2:'ทีม UN DESA', pb3in3:'เวิร์กช็อป 2 วัน', pb3in4:'ข้อมูลภาคสนามโฮนีอารา',
    pb3cm:'การเปลี่ยนผ่านดิจิทัลทั่วทั้งรัฐบาล',
    pb3out1:'โรดแมปดิจิทัล', pb3out2:'ไทม์ไลน์การดำเนินงาน', pb3out3:'แผนเสริมสร้างศักยภาพ',
    pb4in1:'depa ประเทศไทย', pb4in2:'174 เมือง', pb4in3:'รุ่นผู้นำ', pb4in4:'ข้อมูลหลักสูตร',
    pb4cm:'หลักสูตรผู้บริหารเมืองอัจฉริยะ',
    pb4out1:'พอร์ทัลสองภาษา', pb4out2:'ทำเนียบผู้บริหาร', pb4out3:'กำหนดการหลักสูตร',
    pb5in1:'depa ไทย', pb5in2:'US DOT Volpe', pb5in3:'งานวิจัยภาคสนาม', pb5in4:'ข้อมูลสำรวจ',
    pb5cm:'การเสริมสร้างศักยภาพของสถาบัน',
    pb5out1:'พอร์ทัลชุดเครื่องมือ', pb5out2:'คลังแนวปฏิบัติที่ดี', pb5out3:'โมดูลเมืองสู่เมือง',
  },

  zh: {
    chips: {
      p01:'实时 · 普吉', p02:'实时 · 全球', p03:'实时 · 国家级',
      p04:'实时 · 157座城市', p05:'实时 · 砂拉越', p06:'实时 · 中东',
      p07:'实时 · 普吉公交', p08:'实时 · 城市运营',
      p09:'专有 · 本地优先', p10:'实时 · 企业HR',
      p11:'研究预览 · 开放协议',
      p12:'实时 · 国家广播',
      p13:'实时 · 校园运营',
      p14:'实时 · 泰国市场',
      p15:'实时 · 5座城市',
      p16:'实时 · 春武里EEC',
      p17:'实时 · 泰国文档',
      p27:'实时 · 24/7空气质量',
      p28:'开放蓝图 · GitHub',
      p29:'在线 · 写作服务',
      p30:'在线 · 每日摘要',
      p31:'在线 · 抓取',
      p33:'在线 · 片区运营',
    },
    cats: {
      c01:'区域运营', c02:'战略情报', c03:'国家级项目',
      c04:'城市基准评分', c05:'智能运营', c06:'开放情报',
      c07:'交通智能', c08:'公民智能', c09:'智能体情报',
      c10:'人才智能', c11:'知识智能', c12:'国家广播',
      c13:'校园智能', c14:'市场智能',
      c15:'城市智能',
      c16:'海岸智能', c17:'文档智能',
      c18:'都会运营', c19:'环境监测',
      c20:'能力实验室', c23:'数字人文', c25:'金融情报',
      c26:'开放蓝图', c27:'写作智能',
      c28:'新闻情报', c29:'抓取服务',
    },
    bioCommon: { cvBtn:'查看简历', education:'教育背景' },
    bioNon: {
      role:'联合创始人 · 系统与叙事',
      lede:'人类学家、建筑师、建造者。他观察城市真实的运行方式，然后把那种混乱转化为人们无需培训手册就能使用的界面。',
      bio:'哈佛人类学博士。MIT 和牛津校友。前 MIT 客座讲师，纽约大学博士后研究员。他从田野调查出发设计——因为人不是表格，城市不是幻灯片。',
      cvHeader:'阿南博士 · 简要档案',
      cvCurrentRole:'现任职位',
      cvCurrentRoleBody:'数字经济促进局（depa）智慧城市促进高级专家，曼谷，2019年5月至今。担任泰国媒体基金、SLIC、NXPO 以及北部经济走廊（NeEC）国家战略工作组顾问。',
      cvSelectedRoles:'部分职务',
      cvScale:'工作规模',
      cvScale1:'120+ 技术与公私合作项目，覆盖泰国 77 府',
      cvScale2:'5,000+ 政府官员接受数字素养与智慧城市培训',
      cvScale3:'300+ 全球及国内论坛主题演讲',
      cvScale4:'50+ 篇论文发表于《Urban Studies》、《Journal of Urban Design》等',
      cvAwards:'部分获奖',
    },
    bioPoon: {
      role:'联合创始人 · 基础设施与交付',
      lede:'工程师、战略家、运营之锚。他让野心与可运行的系统挂钩，确保产品在与现实接触后仍能存活。',
      bio:'清迈大学副教授。清迈智慧城市总体规划共同作者。研究城市作为复杂适应系统——实时公交预测、交通决策支持、可持续基础设施。',
      cvCurrentRoles:'现任职务',
      cvCurrentRolesBody:'泰国高等教育、科学、研究与创新部 PMU-A 副主任；清迈大学 ECUP 主任。',
      cvExpertise:'核心专长',
      cvExpertiseBody:'土木工程、建筑管理、可持续基础设施开发、气候变化、灾害管理、物流、城市规划、城市移动性和交通系统。',
      cvSelectedWork:'部分工作',
      cvWork1:'清迈大学可持续基础设施开发与气候变化研究中心负责人，2010 至今',
      cvWork2:'气候变化与灾害管理研究型大学网络（RUN）首席协调员，2015 至今',
      cvWork3:'清迈快速公交与公共交通研究',
      cvWork4:'与世界银行合作的综合土地利用、物流与交通管理',
      cvWork5:'农业与工业的绿色物流与可再生能源项目',
      cvWork6:'关键基础设施与供应链的灾害管理',
    },
    network: {
      traffic:'交通工程师', uav:'无人机操作员', economists:'经济学家',
      financiers:'金融专家', policy:'政策翻译',
      urban:'城市研究员', media:'媒体运营',
    },
    footer: {
      contact:'联系',
      p1:'Axiom 为城市、政府和运营商构建决策系统。交付实践参照公认的数字孪生、AI 治理和数据保护国际框架进行设计。',
      p2:'除非书面明确说明，不宣称 ISO 认证、正式认可或第三方审计。本网站的演示和沙箱环境使用示意数据。本站内容不构成法律、财务或投资建议。客户项目受单独协议约束；受 NDA 保护的生产系统可能与公开展示不同。',
      frameworksLabel:'参考框架（实践对齐，非认证声明）',
      fwTwin:'数字孪生与互操作 — ISO/IEC 30173、ISO 23247、NIST',
      fwAi:'AI 治理与风险 — ISO/IEC 42001、ISO/IEC 23894、NIST AI RMF、OECD AI 原则',
      fwPrivacy:'隐私与信任 — PDPA、GDPR 原则；司法管辖合规因项目而异',
      legalLabel:'条款 · 隐私 · 责任 · 法律',
      terms:'使用本网站即表示您同意合法使用，且未经书面许可不得转载截图、仪表板、模型输出或系统内部。Axiom、Axiom 名称以及此处显示的系统名称均为 Axiom X Co., Ltd. 的商号。',
      privacy:'本网站除用于限流和聚合流量统计的 12 字符哈希访客标签外，不收集任何个人数据。从此处链接的系统各自有独立的隐私惯例——粘贴其数据前请先阅读其条款。我们不设置广告 Cookie，不出售、不与第三方共享访客数据。',
      dataAttribution:'沙箱系统中显示的实时数据来自公共来源，包括 TMD、GISTDA、JICA、NBTC、污染控制厅、OpenStreetMap 贡献者、TomTom 以及其他在系统内注明出处的公共或开放许可数据源。如混入商业数据源（如 Air4Thai o61、33V、34T、Naver CFT），来源会在系统视图中标明。',
      liability:'本网站上的沙箱与演示系统可工作，但不构成保证。所有指标仅为提示，不是定论。真实决策需与原始主管单位核实。Axiom 不对基于沙箱数据做出的决策承担责任。',
      governingLaw:'本条款受泰王国法律管辖。争议由曼谷法院专属管辖。如英文文本与任何翻译有冲突，以英文文本为准。',
      hosting:'托管于 Cloudflare Pages · 在曼谷建造并运营 · 本站源码：github.com/Nonarkara/Axiom（仅限公开站点；客户系统为私有）。',
      copyright:'曼谷 · 东南亚。© 2026 Axiom X Co., Ltd. 本站引用的正常运行时间、响应时间和成果指标均为个案观察，不构成对未来表现的保证。',
    },
    misc: { swipeHint:'4 组 · 17 个系统 — 滑动浏览' },
    sysClusters: {
      sysMeta: '32 个系统 · 5 个国家',
      command: '城市仪表板',
      commandMeta: '实时城市作战室与环境监测 · 13',
      intelligence: '情报',
      intelligenceMeta: '信号与分析 · 4',
      civic: '民生',
      civicMeta: '国家级平台与公民基础设施 · 4',
      emerging: '新兴',
      emergingMeta: '研究级与新运营模式 · 8',
      lab: '实验室',
      labMeta: '辅助工具 · 开放中 · 4',
    },
    sysStatus: { live: '在线', preview: '预览', dev: '开发中', soon: '即将推出' },
    pressContent: {
      p1title:'供应商说不 泰国公务员自己建工具',
      p2title:'创新即服务能否弥合政策与执行之间的鸿沟',
      p3title:'他们建了指数 但你来建排名',
      p4title:'数字连接、开放创新 以及为什么智慧城市只有在包容性扩展时才有效',
      p5title:'AI 如何廉价挖掘城市数据并让它们更智能',
      p6title:'为什么智慧城市需要公民 而不仅仅是技术',
      p7title:'中东战争监测器 — 跨地区实时冲突信号',
    },
    metaKeys: {
      AI:'AI', Access:'访问', Audience:'受众', Authority:'主管机构',
      Backup:'备份', 'Brain layers':'脑层级', Cadence:'频率',
      Channels:'频道', Cities:'城市', Cost:'成本', Coverage:'覆盖范围',
      Data:'数据', Documents:'文档', Employees:'员工', Engine:'引擎', Intake:'输入',
      Interface:'界面', Justices:'法官', Latency:'延迟', Layers:'图层',
      Match:'匹配', Mode:'模式', Peak:'峰值', Pillars:'支柱', Platforms:'平台',
      Programme:'项目', Protocol:'协议', Region:'区域', Scope:'范围',
      Screens:'屏幕', Sensors:'传感器', Sources:'数据源', Stack:'技术栈',
      Status:'状态', Stream:'流媒体', Tracking:'追踪',
      Feeds:'数据源', Lenses:'视角', Site:'地点',
      Market:'市场', Signals:'信号', Frameworks:'分析框架',
    },
    HOW_IT_WORKS: '它是如何工作的',
    archTag:'架构',
    stackLbl:'技术栈',
    pb1in1:'38座城市', pb1in2:'134个项目', pb1in3:'11个国家', pb1in4:'M&E 提交',
    pb1cm:'多租户城市对标',
    pb1out1:'评分卡', pb1out2:'公开仪表板', pb1out3:'市长洞察',
    pb2in1:'11.2万居民', pb2in2:'市政府官员', pb2in3:'UNDP + UN-Habitat', pb2in4:'田野证据',
    pb2cm:'12章公民优先手册',
    pb2out1:'政策手册', pb2out2:'工作坊工具包', pb2out3:'田野案例',
    pb3in1:'8个部委', pb3in2:'UN DESA 团队', pb3in3:'两天工作坊', pb3in4:'霍尼亚拉田野',
    pb3cm:'全政府数字化转型',
    pb3out1:'数字化路线图', pb3out2:'实施时间表', pb3out3:'能力建设计划',
    pb4in1:'泰国 depa', pb4in2:'174座城市', pb4in3:'领导力学员', pb4in4:'课程数据',
    pb4cm:'智慧城市高管项目',
    pb4out1:'双语门户', pb4out2:'高管名录', pb4out3:'项目日程',
    pb5in1:'泰国 depa', pb5in2:'US DOT Volpe', pb5in3:'田野研究', pb5in4:'调研数据',
    pb5cm:'机构能力建设',
    pb5out1:'工具门户', pb5out2:'最佳实践库', pb5out3:'城对城模块',
  },

  ts: {
    chips: {
      p01:'live: Phuket', p02:'live: Global', p03:'live: National',
      p04:'live: 157cities', p05:'live: Sarawak', p06:'live: MiddleEast',
      p07:'live: PhuketTransit', p08:'live: CityOps',
      p09:'proprietary: localFirst', p10:'live: EnterpriseHR',
      p11:'researchPreview: openProtocol',
      p12:'live: NationalBroadcast',
      p13:'live: CampusOps',
      p14:'live: ThaiMarkets',
      p15:'live: 5cities',
      p16:'live: ChonburiEEC',
      p17:'live: ThaiDocs',
      p27:'live: airWatch.24_7',
      p28:'openBlueprint: github',
      p29:'live: writingService',
      p30:'live: dailyDigest',
      p31:'live: scraping',
      p33:'live: districtOps',
    },
    cats: {
      c01:'RegionalOps', c02:'StrategicIntel', c03:'NationalProgramme',
      c04:'CityBenchmark', c05:'IntelligentOps', c06:'OpenIntel',
      c07:'TransitIntel', c08:'CivicIntel', c09:'AgenticIntel',
      c10:'TalentIntel', c11:'KnowledgeIntel', c12:'NationalBroadcast',
      c13:'CampusIntel', c14:'MarketIntel',
      c15:'CityIntel',
      c16:'CoastalIntel', c17:'DocumentIntel',
      c18:'MetroOps', c19:'EnvWatch',
      c20:'CapabilityLab', c23:'DigitalHumanities', c25:'FinanceIntel',
      c26:'OpenBlueprint', c27:'WritingIntel',
      c28:'NewsIntel', c29:'ScrapingService',
    },
    bioCommon: { cvBtn:'cv.open()', education:'education[]' },
    bioNon: {
      role:'CoFounder<Systems & Story>',
      lede:'// anthropologist + architect + builder\n// watches cities.behave() → interfaces.usable(noManual)',
      bio:'PhD<Anthropology, Harvard>; MSc<MIT>; MPhil<Oxford>\n// formerLecturer(MIT); postDoc(NYU)\n// designs.from(fieldwork) // people !== spreadsheet',
      cvHeader:'NonArkara, PhD — quickProfile()',
      cvCurrentRole:'// CURRENT_ROLE',
      cvCurrentRoleBody:'SeniorExpert<SmartCity> @ depa Bangkok (2019–present)\n// advisor: { ThaiMediaFund, SLIC, NXPO, NeEC }',
      cvSelectedRoles:'// SELECTED_ROLES',
      cvScale:'// SCALE_OF_WORK',
      cvScale1:'projects: 120+ // 77 ThaiProvinces',
      cvScale2:'officials.trained: 5_000+ // digitalLiteracy + smartCity',
      cvScale3:'keynotes: 300+ // global + domestic',
      cvScale4:'publications: 50+ // UrbanStudies, JUD, others',
      cvAwards:'// SELECTED_AWARDS',
    },
    bioPoon: {
      role:'CoFounder<Infrastructure & Delivery>',
      lede:'// engineer + strategist + operationalAnchor\n// ambition.tiedTo(workingSystems)\n// product.survives(contactWithReality)',
      bio:'AssocProf @ ChiangMaiUniversity\n// coAuthor: ChiangMai.smartCityMasterPlan\n// cities: ComplexAdaptive<System>',
      cvCurrentRoles:'// CURRENT_ROLES',
      cvCurrentRolesBody:'DeputyDirector<PMU-A> @ MOHESI Thailand\n// Director<ECUP> @ ChiangMaiUniversity',
      cvExpertise:'// CORE_EXPERTISE',
      cvExpertiseBody:'civilEng + constructionMgmt + sustainableInfra\n// climateChange + disasterMgmt + logistics\n// urbanPlanning + mobility + transportSystems',
      cvSelectedWork:'// SELECTED_WORK',
      cvWork1:'Head<SustainableInfra & ClimateChange> @ CMU (2010–present)',
      cvWork2:'LeadCoordinator<RUN.ClimateChange & DisasterMgmt> (2015–present)',
      cvWork3:'BRT + massTransit.studies @ ChiangMai',
      cvWork4:'integrated(landUse, logistics, transport) // WorldBank',
      cvWork5:'greenLogistics + renewableEnergy @ agriculture + industry',
      cvWork6:'disasterMgmt @ criticalInfra + supplyChain',
    },
    network: {
      traffic:'TrafficEngineer[]', uav:'UAVOperator[]', economists:'Economist[]',
      financiers:'Financier[]', policy:'PolicyTranslator[]',
      urban:'UrbanResearcher[]', media:'MediaOperator[]',
    },
    footer: {
      contact:'contact()',
      p1:'// delivery: decisionSystems<City|Government|Operator>\n// design.ref: internationalFrameworks{digitalTwin, aiGovernance, dataProtection}',
      p2:'// !claims: ISO.cert | accreditation | thirdPartyAudit // unless written.explicit\n// demo + sandbox: illustrativeData\n// !advice: legal | financial | investment\n// clientWork: separateAgreements; NDA.production !== public.demo',
      frameworksLabel:'// referenceFrameworks[] // alignmentByPractice NOT certification',
      fwTwin:'// digitalTwin + interoperability: ISO/IEC_30173, ISO_23247, NIST',
      fwAi:'// aiGovernance + risk: ISO/IEC_42001, ISO/IEC_23894, NIST_AI_RMF, OECD',
      fwPrivacy:'// privacy + trust: PDPA, GDPR.informed; compliance.engagementSpecific',
      legalLabel:'// terms · privacy · liability · law',
      terms:'// usingThisSite = agree(lawfulUse); noRepublish{screenshots, dashboards, modelOutput, internals} withoutWritten(permission); Axiom + systemNames = tradeNames(Axiom X Co., Ltd.)',
      privacy:'// collectedData: NONE.personal; visitorTag: 12char.hash forRateLimit; no.adCookies; no.sell(); no.share(visitorData, thirdParties)',
      dataAttribution:'// liveData: TMD | GISTDA | JICA | NBTC | PCD | OSM.contributors | TomTom | openLicense.feeds; commercial: Air4Thai{o61,33V,34T} | Naver.CFT // source.named(inSystem)',
      liability:'// sandbox.working.withoutGuarantee; metrics: hints, NOT.verdicts; realDecisions: verify(originAuthority); !Axiom.liable(decision.onSandboxData)',
      governingLaw:'// governedBy: laws(KingdomOfThailand); jurisdiction: courts(Bangkok).exclusive; conflict<enText vs i18n>: enText.prevails',
      hosting:'// hosting: cloudflare.pages; builtIn: Bangkok; source: github.com/Nonarkara/Axiom // publicSiteOnly; clientSystems.private',
      copyright:'// Bangkok · SEA · © 2026 Axiom X Co., Ltd.\n// metrics: caseSpecific[] // !guarantees<futurePerformance>',
    },
    misc: { swipeHint:'groups[4].systems[17].swipe()' },
    sysClusters: {
      sysMeta: '32 systems · 5 countries',
      command: 'CityDashboards',
      commandMeta: 'cityOps.realtime & envWatch · count[13]',
      intelligence: 'Intelligence',
      intelligenceMeta: 'signal & analysis · count[4]',
      civic: 'Civic',
      civicMeta: 'nationalPlatforms & citizenInfra · count[4]',
      emerging: 'Emerging',
      emergingMeta: 'researchGrade & newOperatingModels · count[8]',
      lab: 'Lab',
      labMeta: 'sideTools & openProcess · count[4]',
    },
    sysStatus: { live: 'live', preview: 'preview', dev: 'dev.stage', soon: 'coming.soon' },
    metaKeys: {
      AI:'AI', Access:'access', Audience:'audience', Authority:'authority',
      Backup:'backup', 'Brain layers':'brainLayers', Cadence:'cadence',
      Channels:'channels', Cities:'cities', Cost:'cost', Coverage:'coverage',
      Data:'data', Documents:'documents', Employees:'employees', Engine:'engine', Intake:'intake',
      Interface:'interface', Justices:'justices', Latency:'latency',
      Layers:'layers', Match:'match', Mode:'mode', Peak:'peak', Pillars:'pillars',
      Platforms:'platforms', Programme:'programme', Protocol:'protocol',
      Region:'region', Scope:'scope', Screens:'screens', Sensors:'sensors',
      Sources:'sources', Stack:'stack', Status:'status', Stream:'stream',
      Tracking:'tracking', Feeds:'feeds[]', Lenses:'lenses[]', Site:'site',
      Market:'market', Signals:'signals[]', Frameworks:'frameworks[]',
    },
    HOW_IT_WORKS: 'arch.dataFlow',
    archTag:'arch:dataFlow',
    stackLbl:'stack',
    pb1in1:'cities: 38', pb1in2:'projects: 134', pb1in3:'nations: 11', pb1in4:'submissions: M&E',
    pb1cm:'city.benchmark(multiTenant)',
    pb1out1:'scorecards', pb1out2:'dashboards(public)', pb1out3:'insights(forMayors)',
    pb2in1:'residents: 112_000', pb2in2:'officials: city', pb2in3:'partners: UNDP+UNHabitat', pb2in4:'evidence: field',
    pb2cm:'playbook(citizenFirst)<12chapters>',
    pb2out1:'playbook(policy)', pb2out2:'toolkit(workshop)', pb2out3:'cases(field)',
    pb3in1:'ministries: 8', pb3in2:'team: UNDESA', pb3in3:'workshop: 2days', pb3in4:'input: honiara',
    pb3cm:'digitalTransform(wholeOfGovernment)',
    pb3out1:'roadmap(digital)', pb3out2:'timeline(implementation)', pb3out3:'plan(capacityBuilding)',
    pb4in1:'depaThailand', pb4in2:'cities: 174', pb4in3:'cohort: leadership', pb4in4:'data: curriculum',
    pb4cm:'executiveProgramme()',
    pb4out1:'portal: bilingual', pb4out2:'directory: executive', pb4out3:'schedule: programme',
    pb5in1:'depa: thailand', pb5in2:'USDOT: volpe', pb5in3:'research: field', pb5in4:'data: survey',
    pb5cm:'capacityBuilding(institutional)',
    pb5out1:'portal(toolkit)', pb5out2:'library(bestPractices)', pb5out3:'modules(cityToCity)',
  },
};

Object.keys(i18nExt2).forEach(locale => {
  if (uiCopy[locale]) Object.assign(uiCopy[locale], i18nExt2[locale]);
});

const REGIONAL_LOCALES = new Set(['ko', 'ja', 'vi']);

function renderStaticCopy() {
  const copy = uiCopy[activeLocale] || uiCopy.en;
  const fallback = REGIONAL_LOCALES.has(activeLocale) ? copy : uiCopy.en;
  const LOCALE_HTML_LANG = { en: 'en', th: 'th', zh: 'zh-Hans', ko: 'ko', ja: 'ja', vi: 'vi', ts: 'en' };
  document.documentElement.lang = LOCALE_HTML_LANG[activeLocale] || activeLocale;
  const lookup = (key) => {
    const parts = key.split('.');
    const val = parts.reduce((obj, k) => obj?.[k], copy);
    if (typeof val === 'string') return val;
    if (REGIONAL_LOCALES.has(activeLocale)) return undefined;
    return parts.reduce((obj, k) => obj?.[k], fallback);
  };
  const renderInlineMarkup = (value) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&lt;(\/?)(b|em)&gt;/g, '<$1$2>')
    .replace(/&lt;br&gt;/g, '<br>')
    .replace(/&lt;span class="(hero__punch|hero__punch-afford|hero__punch-wait)"&gt;/g, '<span class="$1">')
    .replace(/&lt;span data-runtime="(cloud|local)"&gt;/g, '<span data-runtime="$1">')
    .replace(/&lt;\/span&gt;/g, '</span>');

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const value = lookup(node.getAttribute('data-i18n'));
    if (typeof value !== 'string') return;
    if (value.includes('<b>') || value.includes('<em>')) {
      node.innerHTML = renderInlineMarkup(value);
    } else {
      node.textContent = value;
    }
  });

  document.querySelectorAll('[data-i18n-html]').forEach((node) => {
    const value = lookup(node.getAttribute('data-i18n-html'));
    if (typeof value === 'string') node.innerHTML = renderInlineMarkup(value);
  });

  document.querySelectorAll('#localeSwitch [data-locale], #localeSwitchMobile [data-locale]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.locale === activeLocale);
  });
}

function setPageLocale(locale, options = {}) {
  activeLocale = uiCopy[locale] ? locale : 'en';
  renderStaticCopy();
  if (!options.silent) {
    window.dispatchEvent(new CustomEvent('axiom:localechange', {
      detail: { locale: activeLocale },
    }));
  }
}

window.setAxiomLocale = setPageLocale;

function bindLocaleSwitch() {
  ['localeSwitch', 'localeSwitchMobile'].forEach((id) => {
    document.getElementById(id)?.addEventListener('click', (e) => {
      const btn = e.target instanceof HTMLElement ? e.target.closest('[data-locale]') : null;
      if (!btn) return;
      setPageLocale(btn.dataset.locale || 'en');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setPageLocale(activeLocale, { silent: true });
  bindLocaleSwitch();
  initFlooddashCarousel();
  injectSystemVersions();
  injectSystemArchitectures();
});

function initFlooddashCarousel() {
  const root = document.querySelector('[data-carousel="flooddash"]');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('[data-carousel-slide]'));
  const dots = Array.from(root.querySelectorAll('[data-carousel-dot]'));
  const prevBtn = root.querySelector('[data-carousel-prev]');
  const nextBtn = root.querySelector('[data-carousel-next]');
  const pauseBtn = root.querySelector('[data-carousel-pause]');
  const progressBar = root.querySelector('.flooddash-carousel__progress-bar');
  if (!slides.length) return;

  const INTERVAL_MS = 5200;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = Math.max(0, slides.findIndex((s) => s.classList.contains('is-active')));
  let timer = null;
  let userPaused = reduced;
  let softPaused = false;
  let progressToken = 0;

  root.style.setProperty('--carousel-ms', `${INTERVAL_MS}ms`);
  if (reduced) root.classList.add('is-reduced');
  root.setAttribute('tabindex', '0');

  function isHeld() {
    return userPaused || softPaused || reduced;
  }

  function paint() {
    slides.forEach((slide, i) => {
      const on = i === index;
      slide.classList.toggle('is-active', on);
      slide.setAttribute('aria-hidden', on ? 'false' : 'true');
    });
    dots.forEach((dot, i) => {
      const on = i === index;
      dot.classList.toggle('is-active', on);
      dot.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  function restartProgress() {
    if (!progressBar) return;
    progressToken += 1;
    root.classList.remove('is-running');
    void progressBar.offsetWidth;
    if (!isHeld()) root.classList.add('is-running');
  }

  function go(to) {
    index = ((to % slides.length) + slides.length) % slides.length;
    paint();
    arm();
  }

  function clearTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function arm() {
    clearTimer();
    root.classList.toggle('is-paused', isHeld());
    restartProgress();
    if (isHeld()) return;
    timer = setTimeout(() => go(index + 1), INTERVAL_MS);
  }

  function syncPauseBtn() {
    if (!pauseBtn) return;
    pauseBtn.classList.toggle('is-paused', userPaused);
    pauseBtn.setAttribute('aria-pressed', userPaused ? 'true' : 'false');
    pauseBtn.setAttribute('aria-label', userPaused ? 'Resume autoplay' : 'Pause autoplay');
    pauseBtn.textContent = userPaused ? '▶' : '❚❚';
  }

  function setUserPaused(next) {
    userPaused = next;
    syncPauseBtn();
    arm();
  }

  function setSoftPaused(next) {
    softPaused = next;
    arm();
  }

  prevBtn?.addEventListener('click', () => go(index - 1));
  nextBtn?.addEventListener('click', () => go(index + 1));
  pauseBtn?.addEventListener('click', () => setUserPaused(!userPaused));
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const n = Number(dot.getAttribute('data-carousel-dot'));
      if (Number.isFinite(n)) go(n);
    });
  });

  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === ' ') {
      e.preventDefault();
      setUserPaused(!userPaused);
    }
  });

  root.addEventListener('pointerenter', () => setSoftPaused(true));
  root.addEventListener('pointerleave', () => setSoftPaused(false));
  root.addEventListener('focusin', () => setSoftPaused(true));
  root.addEventListener('focusout', (e) => {
    if (!root.contains(e.relatedTarget)) setSoftPaused(false);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearTimer();
    else arm();
  });

  paint();
  syncPauseBtn();
  arm();
}

// ── Hero featured carousel — rotates background screenshots ────────────────
(function initHeroFeatured() {
  const bg = document.getElementById('heroFeaturedBg');
  if (!bg) return;
  const slides = Array.from(bg.querySelectorAll('[data-featured-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-featured-dot]'));
  if (slides.length < 2) return;
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const INTERVAL = isReduced ? 12000 : 6000;
  let idx = 0;
  let timer = null;
  function show(n) {
    idx = (n + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
  }
  function tick() { show(idx + 1); }
  function arm() {
    if (timer) clearInterval(timer);
    if (isReduced) return;
    timer = setInterval(tick, INTERVAL);
  }
  // Pause when tab hidden so the cycle doesn't burn cycles
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (timer) clearInterval(timer); }
    else arm();
  });
  arm();
})();

(function initSatelliteHero() {
  const container = document.getElementById('heroMap');
  if (!container || !window.L) return;
  const useLiteMotion = axiomMedia.isTouch || axiomMedia.isReduced || axiomMedia.isMobile;

  // Cities Axiom operates in
  const CITIES = [
    { key: 'bangkok', name: 'Bangkok', meta: 'Urban command', lat: 13.7563, lng: 100.5018, zoom: 12 },
    { key: 'phuket', name: 'Phuket', meta: 'Regional ops', lat: 7.8804, lng: 98.3923, zoom: 13 },
    { key: 'middle-east', name: 'Middle East', meta: 'Strategic signal', lat: 25.2048, lng: 55.2708, zoom: 11 },
    { key: 'southeast-asia', name: 'Southeast Asia', meta: 'Scale layer', lat: 10.5, lng: 105.0, zoom: 5 },
  ];

  // Touch devices: the map is the full-bleed hero background, so a single-
  // finger drag must scroll the page, not pan the map (the "Drag to explore"
  // hint is already hidden on mobile via CSS — this completes that same
  // decision in JS). Desktop mouse-drag panning is unaffected.
  const map = L.map(container, {
    center: [CITIES[0].lat, CITIES[0].lng],
    zoom: CITIES[0].zoom,
    minZoom: 3,
    worldCopyJump: false,
    zoomControl: false,
    attributionControl: false,
    dragging: !axiomMedia.isTouch,
    scrollWheelZoom: false,
    doubleClickZoom: true,
    touchZoom: false,
    keyboard: true,
    boxZoom: true,
    fadeAnimation: !useLiteMotion,
    zoomAnimation: !useLiteMotion,
  });

  // Tile layers are added in the layer switching section below

  // Pulse markers for active cities.
  // iconSize = 32x32 (real touch target). Visual pulse stays 14x14
  // centered inside via CSS (margin 9px + box-sizing content-box).
  const pulseIcon = L.divIcon({
    className: 'sat-pulse-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
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

  // ── Intelligence Overlays Trigger (V6) ──
  function updateIntelligenceOverlays(lat, lng) {
    const dubaiDist = Math.sqrt(Math.pow(lat - 25.2048, 2) + Math.pow(lng - 55.2708, 2));
    const bkkDist = Math.sqrt(Math.pow(lat - 13.7563, 2) + Math.pow(lng - 100.5018, 2));
    
    const dubaiOverlay = document.getElementById('intelOverlayDubai');
    const bkkOverlay = document.getElementById('intelOverlayBangkok');
    
    if (dubaiOverlay) dubaiOverlay.classList.toggle('active', dubaiDist < 0.5);
    if (bkkOverlay) bkkOverlay.classList.toggle('active', bkkDist < 0.5);
  }

  const heroCityLabel = document.getElementById('heroCityLabel');
  const heroNodeButtons = Array.from(document.querySelectorAll('.hero-node'));
  const satSourceNote = document.getElementById('satSourceNote');

  function syncCityDisplay(city, options = {}) {
    const { shouldScroll = false } = options;
    if (!city) return;
    if (heroCityLabel) heroCityLabel.textContent = city.name.toUpperCase();
    heroNodeButtons.forEach((button) => {
      const isActive = button.dataset.city === city.key;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
      if (isActive && shouldScroll) {
        const rail = document.getElementById('heroNodeRail') || button.parentElement;
        if (rail && typeof rail.scrollTo === 'function') {
          const targetLeft = button.offsetLeft - (rail.clientWidth / 2) + (button.clientWidth / 2);
          rail.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
        }
      }
    });
  }

  function getClosestCity(lat, lng) {
    let closest = CITIES[0];
    let minDistance = Number.POSITIVE_INFINITY;

    CITIES.forEach((city) => {
      const distance = Math.hypot(lat - city.lat, lng - city.lng);
      if (distance < minDistance) {
        minDistance = distance;
        closest = city;
      }
    });

    return closest;
  }

  window.axiom = window.axiom || {};
  window.axiom.showroom = {
    goLive: function(id) {
      const container = document.querySelector(`.mockup-container[data-id="${id}"]`);
      if (!container) return;
      
      const iframeContainer = container.querySelector('.live-iframe-container');
      if (!iframeContainer) return;
      const src = iframeContainer.dataset.src;
      
      if (!iframeContainer.querySelector('iframe')) {
        const iframe = document.createElement('iframe');
        iframe.src = src;
        iframeContainer.appendChild(iframe);
      }
      
      container.classList.add('is-live');
    },
    exitLive: function(id) {
      const container = document.querySelector(`.mockup-container[data-id="${id}"]`);
      if (container) container.classList.remove('is-live');
    },
    revealMore: function() {
      document.querySelectorAll('.project-card').forEach(c => c.style.display = 'flex');
      const btn = document.querySelector('.projects-see-all');
      if (btn) btn.style.display = 'none';
    },
    initV6: function() {
      // SITREP HUD Telemetry
      const xLine = document.querySelector('.telemetry-axis-x');
      const yLine = document.querySelector('.telemetry-axis-y');
      const tracker = document.querySelector('.hero-tracker');
      
      map.on('move', () => {
        const center = map.getCenter();
        const screenPos = map.latLngToContainerPoint(center);
        if (xLine) xLine.style.top = screenPos.y + 'px';
        if (yLine) yLine.style.left = screenPos.x + 'px';
        if (tracker) {
          tracker.style.top = screenPos.y + 'px';
          tracker.style.left = screenPos.x + 'px';
        }
        updateIntelligenceOverlays(center.lat, center.lng);
        syncCityDisplay(getClosestCity(center.lat, center.lng));
      });
    }
  };

  axiom.showroom.initV6();

  // ── Auto Tour Mode ──
  const mapModeDot = document.getElementById('mapModeDot');
  const mapModeLabel = document.getElementById('mapModeLabel');
  const mapModeBtn = document.getElementById('mapModeBtn');
  const mapModePause = document.getElementById('mapModePause');
  const mapModePlay = document.getElementById('mapModePlay');

  let autoTour = true;
  let cityIndex = 0;
  let driftTimer = null;
  let driftInterval = null;
  let resumeTimeout = null;
  const tourIntervalMs = useLiteMotion ? 16000 : 12000;
  const tourDuration = useLiteMotion ? 7 : 10;

  function setModeUI(touring) {
    if (mapModeDot) mapModeDot.className = 'map-mode-dot' + (touring ? '' : ' exploring');
    if (mapModeLabel) {
      mapModeLabel.textContent = touring ? 'AUTO TOUR' : 'EXPLORING';
      mapModeLabel.className = 'map-mode-label' + (touring ? '' : ' exploring');
    }
    if (mapModeBtn) {
      mapModeBtn.setAttribute('aria-label', touring ? 'Pause auto tour' : 'Resume auto tour');
      mapModeBtn.setAttribute('aria-pressed', String(touring));
    }
    if (mapModePause) mapModePause.style.display = touring ? 'block' : 'none';
    if (mapModePlay) mapModePlay.style.display = touring ? 'none' : 'block';
    // While the AUTO TOUR is running, the static FEATURED panel
    // (which always points to FloodDash) and the live map show
    // two different things at once — that was the confusing bit.
    // Hide the panel when touring; reveal it when the user has
    // paused on a specific city.
    const heroEl = document.getElementById('hero');
    if (heroEl) heroEl.classList.toggle('is-touring', touring);
  }

  function driftToNext() {
    if (!autoTour) return;
    cityIndex = (cityIndex + 1) % CITIES.length;
    const city = CITIES[cityIndex];
    syncCityDisplay(city, { shouldScroll: axiomMedia.isMobile });
    map.flyTo([city.lat, city.lng], city.zoom, {
      duration: tourDuration,
      easeLinearity: useLiteMotion ? 0.1 : 0.05,
    });
  }

  function startTour() {
    autoTour = true;
    setModeUI(true);
    if (resumeTimeout) { clearTimeout(resumeTimeout); resumeTimeout = null; }
    driftToNext();
    driftInterval = setInterval(driftToNext, tourIntervalMs);
  }

  function pauseTour(fromUser) {
    autoTour = false;
    setModeUI(false);
    if (driftInterval) { clearInterval(driftInterval); driftInterval = null; }
    if (driftTimer) { clearTimeout(driftTimer); driftTimer = null; }
    map.stop(); // stop any in-progress flyTo

    const center = map.getCenter();
    updateIntelligenceOverlays(center.lat, center.lng);
    syncCityDisplay(getClosestCity(center.lat, center.lng));


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

  // City node clicks → fly to that city, pause the tour
  heroNodeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const city = CITIES.find((item) => item.key === button.dataset.city);
      if (!city) return;
      const newIndex = CITIES.findIndex((item) => item.key === city.key);
      if (newIndex >= 0) cityIndex = newIndex;
      pauseTour(true);
      syncCityDisplay(city, { shouldScroll: true });
      map.flyTo([city.lat, city.lng], city.zoom, {
        duration: useLiteMotion ? 5 : 8,
        easeLinearity: useLiteMotion ? 0.15 : 0.08,
      });
    });
  });

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
  map.on('moveend', () => {
    map._flyInProgress = false;
    const center = map.getCenter();
    const closest = getClosestCity(center.lat, center.lng);
    cityIndex = CITIES.findIndex((city) => city.key === closest.key);
    syncCityDisplay(closest);
  });

  // Start auto tour after initial pause
  driftTimer = setTimeout(() => {
    driftToNext();
    driftInterval = setInterval(driftToNext, tourIntervalMs);
  }, useLiteMotion ? 2500 : 5000);

  // ── Layer switching ──

  const tileLayers = {
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18 }),
    terrain: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18 }),
    dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }),
    topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17 }),
  };

  const layerProviders = {
    satellite: { name: 'ESRI World Imagery', tile: 'arcgisonline.com/World_Imagery' },
    terrain: { name: 'ESRI World Street Map', tile: 'arcgisonline.com/World_Street_Map' },
    dark: { name: 'CartoDB Dark Matter', tile: 'basemaps.cartocdn.com/dark_all' },
    topo: { name: 'OpenTopoMap', tile: 'tile.opentopomap.org' },
  };

  let currentLayerName = 'dark';
  let activeLayer = tileLayers[currentLayerName];
  activeLayer.addTo(map);

  function updateLayerUI(layerName) {
    currentLayerName = layerName;
    document.querySelectorAll('.sat-btn[data-layer]').forEach((button) => {
      button.classList.toggle('sat-btn-active', button.dataset.layer === layerName);
    });
    if (satSourceNote) {
      satSourceNote.textContent = (layerProviders[layerName] || layerProviders.dark).name;
    }
  }

  function switchMapLayer(layerName) {
    if (tileLayers[layerName] && tileLayers[layerName] !== activeLayer) {
      map.removeLayer(activeLayer);
      activeLayer = tileLayers[layerName];
      activeLayer.addTo(map);
      updateLayerUI(layerName);
      updateHud();
    }
  }

  document.querySelectorAll('.sat-btn[data-layer]').forEach((button) => {
    button.addEventListener('click', () => {
      switchMapLayer(button.dataset.layer);
    });
  });

  updateLayerUI(currentLayerName);

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
    if (satSourceNote) satSourceNote.textContent = prov.name;

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


  // Subtle parallax on mouse move — only during auto tour
  if (!useLiteMotion) {
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
  }

  syncCityDisplay(CITIES[0]);
  updateIntelligenceOverlays(CITIES[0].lat, CITIES[0].lng);
})();
(function initDataLines() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || axiomMedia.isReduced) return;
  const useLiteCanvas = axiomMedia.isTouch || axiomMedia.isMobile;

  const ctx = canvas.getContext('2d');

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(canvas.offsetWidth * dpr);
    canvas.height = Math.round(canvas.offsetHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  // Scanning line effect
  const lines = [];
  for (let i = 0; i < (useLiteCanvas ? 2 : 5); i++) {
    lines.push({
      y: Math.random() * canvas.offsetHeight,
      speed: 0.3 + Math.random() * 0.5,
      alpha: 0.03 + Math.random() * 0.04,
    });
  }

  // Data nodes — scattered points of light
  const nodes = [];
  for (let i = 0; i < (useLiteCanvas ? 18 : 40); i++) {
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

  let rafId = null;
  let running = true;

  function animate() {
    if (!running) return;
    rafId = requestAnimationFrame(animate);

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

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      return;
    }

    if (!running) {
      running = true;
      animate();
    }
  });

  animate();
})();

// ── Rotating Hero Text (restored from ee756b7) ────────────────
// Cycles the second line of the hero title every 3.5s.
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

  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

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
})();

