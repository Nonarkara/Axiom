import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createReadStream, existsSync, mkdirSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { DatabaseSync } from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, 'public');
const dataDir = path.join(__dirname, 'data');
const port = Number.parseInt(process.env.PORT || '3000', 10);

mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'axiom.sqlite');
const db = new DatabaseSync(dbPath);
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS pageviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL,
    referrer TEXT,
    country TEXT,
    language TEXT,
    user_agent TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_pageviews_created_at ON pageviews(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_pageviews_path ON pageviews(path);

  CREATE TABLE IF NOT EXISTS case_study_proof (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    badge TEXT NOT NULL,
    title TEXT NOT NULL,
    location TEXT,
    client TEXT,
    sector TEXT,
    deployment_window TEXT,
    decision_surface TEXT,
    summary TEXT,
    note TEXT,
    link_label TEXT,
    link_url TEXT,
    proof_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_case_study_proof_order ON case_study_proof(proof_order);

  CREATE TABLE IF NOT EXISTS case_study_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_study_id INTEGER NOT NULL,
    metric_value TEXT NOT NULL,
    metric_label TEXT NOT NULL,
    metric_order INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(case_study_id) REFERENCES case_study_proof(id) ON DELETE CASCADE,
    UNIQUE(case_study_id, metric_order)
  );

  CREATE INDEX IF NOT EXISTS idx_case_study_metrics_case_id ON case_study_metrics(case_study_id, metric_order);

  CREATE TABLE IF NOT EXISTS content_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT NOT NULL,
    title TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    category TEXT NOT NULL,
    event_period TEXT NOT NULL,
    location TEXT,
    url TEXT,
    history_order INTEGER NOT NULL DEFAULT 0,
    metadata TEXT DEFAULT '{}',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_content_history_order ON content_history(history_order);
`);

ensureColumn('case_study_proof', 'translations', `TEXT DEFAULT '{}'`);
ensureColumn('content_history', 'translations', `TEXT DEFAULT '{}'`);

const seededCaseStudies = [
  {
    slug: 'dngws-monitor',
    badge: 'CASE_01 // SIGNAL',
    title: 'DNGWS Monitor',
    location: 'Global / multi-theater',
    client: 'Strategic intelligence operators',
    sector: 'Geopolitics + macro signal',
    deploymentWindow: 'Rapid live demo -> production monitoring surface',
    decisionSurface: 'Escalation tracking, spillover risk, and cross-source narrative compression.',
    summary: 'A working surface for geopolitical monitoring built for people who do not have time for PowerPoint latency.',
    note: 'The system keeps the room focused on a narrowing set of actions instead of a widening pile of feeds.',
    linkLabel: 'Open live system',
    linkUrl: 'https://globalmonitor.fly.dev/',
    proofOrder: 1,
    metrics: [
      { value: '12+', label: 'Open and operational sources compressed into one live surface' },
      { value: 'LIVE', label: 'Continuous monitoring for escalation and spillover tracking' },
      { value: 'GLOBAL', label: 'Multi-theater view across conflict, economy, and narrative' },
      { value: '45m', label: 'Field demo speed referenced in launch and press coverage' },
    ],
  },
  {
    slug: 'phuket-dashboard',
    badge: 'CASE_02 // STREET',
    title: 'Phuket Dashboard',
    location: 'Phuket, Thailand',
    client: 'Governor-grade regional operations',
    sector: 'Urban operations + transit + safety',
    deploymentWindow: 'Pilot dashboard -> operational command room',
    decisionSurface: 'Transit telemetry, public safety, and environmental signals in one governor-facing view.',
    summary: 'A regional command layer that cuts city operations down to the few decisions the room actually needs to make fast.',
    note: 'The product logic is simple: use the existing data, compress the decision, and keep the interface awake enough for live operations.',
    linkLabel: 'Open live system',
    linkUrl: 'https://nonarkara.github.io/phuket-dashboard/war-room',
    proofOrder: 2,
    metrics: [
      { value: '42ms', label: 'Browser-side ping reference captured on the homepage health layer' },
      { value: '3.2k', label: 'Sensor and device count represented in the flagship ops room story' },
      { value: 'REAL-TIME', label: 'Live telemetry architecture instead of static reporting' },
      { value: 'REGIONAL', label: 'Governor-grade operating surface, not a brochure dashboard' },
    ],
  },
  {
    slug: 'smart-city-thailand-index',
    badge: 'CASE_03 // STATE',
    title: 'Smart City Thailand Index',
    location: 'Thailand / national programme',
    client: 'depa and candidate cities',
    sector: 'Public programme tracking + civic benchmarking',
    deploymentWindow: 'Public reference layer with live programme visibility',
    decisionSurface: 'Proposal tracking, programme legibility, and ranking logic that can survive scrutiny.',
    summary: 'A national smart city tracking surface that makes the programme legible and keeps the evidence visible.',
    note: 'This is the clearest proof of the Axiom stance that governance systems should make bureaucracy readable, not ceremonial.',
    linkLabel: 'Open live system',
    linkUrl: 'https://nonarkara.github.io/smart-city-thailand-index/',
    proofOrder: 3,
    metrics: [
      { value: '174', label: 'Cities indexed in the launch story and public ranking narrative' },
      { value: '53', label: 'Nations represented in the Taipei launch context around the index' },
      { value: '5', label: 'Livability pillars exposed to users instead of hidden weighting logic' },
      { value: 'PUBLIC', label: 'Open programme surface designed to be defended in daylight' },
    ],
  },
];

const seededContentHistory = [
  {
    source: 'SCSE Taipei',
    title: 'Protocol Alpha launched in Taipei with live dashboards on stage.',
    summary: 'Keynote, field proof, and ranking logic were shown as working systems instead of concept art, reinforcing the ship-first discipline behind the stack.',
    category: 'Launch',
    eventPeriod: '2026 Q1',
    location: 'Taipei',
    url: '',
    historyOrder: 1,
  },
  {
    source: 'Smart City Thailand Index',
    title: 'National programme tracking became a public-facing reference surface.',
    summary: 'The index shifted from a static claim into a legible public layer where proposals, progress, and programme logic stayed visible.',
    category: 'Programme',
    eventPeriod: '2025 Q4',
    location: 'Thailand',
    url: 'https://nonarkara.github.io/smart-city-thailand-index/',
    historyOrder: 2,
  },
  {
    source: 'Phuket Dashboard',
    title: 'Governor dashboard field build tightened the city-room operating model.',
    summary: 'Transit telemetry, environmental signal, and public safety were compressed into one interface designed for live decision-making under pressure.',
    category: 'Deployment',
    eventPeriod: '2025 Q4',
    location: 'Phuket',
    url: 'https://nonarkara.github.io/phuket-dashboard/war-room',
    historyOrder: 3,
  },
  {
    source: 'ASEAN Smart Cities Network',
    title: 'Cross-city benchmarking moved from presentation to usable regional layer.',
    summary: 'The ASEAN network work connected project tracking with SLIC benchmarking, turning regional collaboration into something navigable instead of ceremonial.',
    category: 'Regional',
    eventPeriod: '2025 Q3',
    location: 'ASEAN',
    url: 'https://nonarkara.github.io/ascn-smart-cities-network/',
    historyOrder: 4,
  },
  {
    source: 'Solomon Islands Workshop',
    title: 'Whole-of-government digital roadmap work proved the model outside the core home market.',
    summary: 'The workshop framed sovereign digital transformation as a practical systems journey, not an abstract modernization slogan.',
    category: 'Roadmap',
    eventPeriod: '2025 Q2',
    location: 'Honiara',
    url: 'https://nonarkara.github.io/solomon-islands-workshop/#institutions',
    historyOrder: 5,
  },
];

seedDatabase();

const insertPageviewStatement = db.prepare(`
  INSERT INTO pageviews (path, referrer, country, language, user_agent)
  VALUES (?, ?, ?, ?, ?)
`);

const insertCaseStudyStatement = db.prepare(`
  INSERT INTO case_study_proof (
    slug, badge, title, location, client, sector, deployment_window,
    decision_surface, summary, note, link_label, link_url, proof_order
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const updateCaseStudyStatement = db.prepare(`
  UPDATE case_study_proof
  SET
    slug = ?,
    badge = ?,
    title = ?,
    location = ?,
    client = ?,
    sector = ?,
    deployment_window = ?,
    decision_surface = ?,
    summary = ?,
    note = ?,
    link_label = ?,
    link_url = ?,
    proof_order = ?,
    updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`);

const deleteCaseStudyStatement = db.prepare(`
  DELETE FROM case_study_proof
  WHERE id = ?
`);

const deleteCaseStudyMetricsStatement = db.prepare(`
  DELETE FROM case_study_metrics
  WHERE case_study_id = ?
`);

const insertCaseStudyMetricStatement = db.prepare(`
  INSERT INTO case_study_metrics (case_study_id, metric_value, metric_label, metric_order)
  VALUES (?, ?, ?, ?)
`);

const insertContentHistoryStatement = db.prepare(`
  INSERT INTO content_history (
    source, title, summary, category, event_period, location, url, history_order, metadata
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const updateContentHistoryStatement = db.prepare(`
  UPDATE content_history
  SET
    source = ?,
    title = ?,
    summary = ?,
    category = ?,
    event_period = ?,
    location = ?,
    url = ?,
    history_order = ?,
    metadata = ?
  WHERE id = ?
`);

const deleteContentHistoryStatement = db.prepare(`
  DELETE FROM content_history
  WHERE id = ?
`);

function ensureColumn(tableName, columnName, definition) {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
  if (!columns.some((column) => column.name === columnName)) {
    db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

function seedDatabase() {
  const caseCount = db.prepare('SELECT COUNT(*) AS count FROM case_study_proof').get().count;
  if (caseCount === 0) {
    const insertCaseStudy = db.prepare(`
      INSERT INTO case_study_proof (
        slug, badge, title, location, client, sector, deployment_window,
        decision_surface, summary, note, link_label, link_url, proof_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertMetric = db.prepare(`
      INSERT INTO case_study_metrics (case_study_id, metric_value, metric_label, metric_order)
      VALUES (?, ?, ?, ?)
    `);

    db.exec('BEGIN');
    try {
      seededCaseStudies.forEach((study) => {
        const result = insertCaseStudy.run(
          study.slug,
          study.badge,
          study.title,
          study.location,
          study.client,
          study.sector,
          study.deploymentWindow,
          study.decisionSurface,
          study.summary,
          study.note,
          study.linkLabel,
          study.linkUrl,
          study.proofOrder
        );

        study.metrics.forEach((metric, metricIndex) => {
          insertMetric.run(result.lastInsertRowid, metric.value, metric.label, metricIndex + 1);
        });
      });
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  }

  const historyCount = db.prepare('SELECT COUNT(*) AS count FROM content_history').get().count;
  if (historyCount === 0) {
    const insertHistory = db.prepare(`
      INSERT INTO content_history (
        source, title, summary, category, event_period, location, url, history_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    db.exec('BEGIN');
    try {
      seededContentHistory.forEach((item) => {
        insertHistory.run(
          item.source,
          item.title,
          item.summary,
          item.category,
          item.eventPeriod,
          item.location,
          item.url,
          item.historyOrder
        );
      });
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  }
}

function parseStoredJson(value, fallback = {}) {
  if (typeof value !== 'string' || !value.trim()) return fallback;

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function cleanText(value, fallback = '') {
  return typeof value === 'string' ? value.trim() : fallback;
}

function cleanNullableText(value) {
  const normalized = cleanText(value, '');
  return normalized || null;
}

function cleanRequiredText(value, fieldName) {
  const normalized = cleanText(value, '');
  if (!normalized) {
    throw new Error(`${fieldName} is required.`);
  }
  return normalized;
}

function cleanInteger(value, fallback = 0) {
  const numeric = Number.parseInt(String(value ?? fallback), 10);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function slugify(value) {
  return cleanText(value, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function normalizeCaseStudyTranslations(input) {
  const raw = input && typeof input === 'object' ? input : {};
  const languages = ['th', 'zh'];
  const fields = ['title', 'deploymentWindow', 'decisionSurface', 'summary', 'note', 'linkLabel'];
  const normalized = {};

  languages.forEach((language) => {
    const entry = raw[language];
    if (!entry || typeof entry !== 'object') return;

    const cleanedEntry = {};
    fields.forEach((field) => {
      const cleanedValue = cleanText(entry[field], '');
      if (cleanedValue) {
        cleanedEntry[field] = cleanedValue;
      }
    });

    if (Object.keys(cleanedEntry).length > 0) {
      normalized[language] = cleanedEntry;
    }
  });

  return normalized;
}

function normalizeHistoryTranslations(input) {
  const raw = input && typeof input === 'object' ? input : {};
  const languages = ['th', 'zh'];
  const fields = ['source', 'title', 'summary', 'category', 'eventPeriod'];
  const normalized = {};

  languages.forEach((language) => {
    const entry = raw[language];
    if (!entry || typeof entry !== 'object') return;

    const cleanedEntry = {};
    fields.forEach((field) => {
      const cleanedValue = cleanText(entry[field], '');
      if (cleanedValue) {
        cleanedEntry[field] = cleanedValue;
      }
    });

    if (Object.keys(cleanedEntry).length > 0) {
      normalized[language] = cleanedEntry;
    }
  });

  return normalized;
}

function normalizeCaseStudyMetrics(input) {
  if (!Array.isArray(input)) return [];

  return input
    .map((metric) => ({
      value: cleanText(metric?.value, ''),
      label: cleanText(metric?.label, ''),
    }))
    .filter((metric) => metric.value && metric.label)
    .slice(0, 12);
}

function normalizeCaseStudyPayload(input) {
  const title = cleanRequiredText(input?.title, 'Title');
  const slug = cleanText(input?.slug, '') || slugify(title);
  if (!slug) {
    throw new Error('Slug could not be generated. Please enter a title or slug.');
  }

  return {
    slug,
    badge: cleanRequiredText(input?.badge, 'Badge'),
    title,
    location: cleanNullableText(input?.location),
    client: cleanNullableText(input?.client),
    sector: cleanNullableText(input?.sector),
    deploymentWindow: cleanNullableText(input?.deploymentWindow),
    decisionSurface: cleanNullableText(input?.decisionSurface),
    summary: cleanNullableText(input?.summary),
    note: cleanNullableText(input?.note),
    linkLabel: cleanNullableText(input?.linkLabel),
    linkUrl: cleanNullableText(input?.linkUrl),
    proofOrder: cleanInteger(input?.proofOrder, 0),
    translations: normalizeCaseStudyTranslations(input?.translations),
    metrics: normalizeCaseStudyMetrics(input?.metrics),
  };
}

function normalizeHistoryPayload(input) {
  return {
    source: cleanRequiredText(input?.source, 'Source'),
    title: cleanRequiredText(input?.title, 'Title'),
    summary: cleanRequiredText(input?.summary, 'Summary'),
    category: cleanRequiredText(input?.category, 'Category'),
    eventPeriod: cleanRequiredText(input?.eventPeriod, 'Event period'),
    location: cleanNullableText(input?.location),
    url: cleanNullableText(input?.url),
    historyOrder: cleanInteger(input?.historyOrder, 0),
    metadata: parseStoredJson(typeof input?.metadata === 'string' ? input.metadata : '{}', {}),
    translations: normalizeHistoryTranslations(input?.translations),
  };
}

function replaceCaseStudyMetrics(caseStudyId, metrics) {
  deleteCaseStudyMetricsStatement.run(caseStudyId);
  metrics.forEach((metric, metricIndex) => {
    insertCaseStudyMetricStatement.run(caseStudyId, metric.value, metric.label, metricIndex + 1);
  });
}

function getAdminCaseStudies() {
  const studies = db.prepare(`
    SELECT
      id,
      slug,
      badge,
      title,
      location,
      client,
      sector,
      deployment_window AS deploymentWindow,
      decision_surface AS decisionSurface,
      summary,
      note,
      link_label AS linkLabel,
      link_url AS linkUrl,
      proof_order AS proofOrder,
      translations,
      created_at AS createdAt,
      updated_at AS updatedAt
    FROM case_study_proof
    ORDER BY proof_order ASC, id ASC
  `).all();

  const metrics = db.prepare(`
    SELECT
      case_study_id AS caseStudyId,
      metric_value AS value,
      metric_label AS label,
      metric_order AS metricOrder
    FROM case_study_metrics
    ORDER BY case_study_id ASC, metric_order ASC
  `).all();

  const metricsByStudy = new Map();
  metrics.forEach((metric) => {
    if (!metricsByStudy.has(metric.caseStudyId)) {
      metricsByStudy.set(metric.caseStudyId, []);
    }

    metricsByStudy.get(metric.caseStudyId).push({
      value: metric.value,
      label: metric.label,
      metricOrder: metric.metricOrder,
    });
  });

  return studies.map((study) => ({
    ...study,
    translations: parseStoredJson(study.translations, {}),
    metrics: metricsByStudy.get(study.id) || [],
  }));
}

function getCaseStudyById(caseStudyId) {
  return getAdminCaseStudies().find((study) => study.id === caseStudyId) || null;
}

function createCaseStudy(input) {
  const payload = normalizeCaseStudyPayload(input);

  db.exec('BEGIN');
  try {
    const result = insertCaseStudyStatement.run(
      payload.slug,
      payload.badge,
      payload.title,
      payload.location,
      payload.client,
      payload.sector,
      payload.deploymentWindow,
      payload.decisionSurface,
      payload.summary,
      payload.note,
      payload.linkLabel,
      payload.linkUrl,
      payload.proofOrder
    );

    db.prepare(`
      UPDATE case_study_proof
      SET translations = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(JSON.stringify(payload.translations), result.lastInsertRowid);

    replaceCaseStudyMetrics(result.lastInsertRowid, payload.metrics);
    db.exec('COMMIT');
    return getCaseStudyById(Number(result.lastInsertRowid));
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

function updateCaseStudy(caseStudyId, input) {
  const payload = normalizeCaseStudyPayload(input);

  db.exec('BEGIN');
  try {
    const result = updateCaseStudyStatement.run(
      payload.slug,
      payload.badge,
      payload.title,
      payload.location,
      payload.client,
      payload.sector,
      payload.deploymentWindow,
      payload.decisionSurface,
      payload.summary,
      payload.note,
      payload.linkLabel,
      payload.linkUrl,
      payload.proofOrder,
      caseStudyId
    );

    if (result.changes === 0) {
      throw new Error('Case study not found.');
    }

    db.prepare(`
      UPDATE case_study_proof
      SET translations = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(JSON.stringify(payload.translations), caseStudyId);

    replaceCaseStudyMetrics(caseStudyId, payload.metrics);
    db.exec('COMMIT');
    return getCaseStudyById(caseStudyId);
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

function deleteCaseStudy(caseStudyId) {
  const result = deleteCaseStudyStatement.run(caseStudyId);
  return result.changes > 0;
}

function getAdminContentHistory() {
  return db.prepare(`
    SELECT
      id,
      source,
      title,
      summary,
      category,
      event_period AS eventPeriod,
      location,
      url,
      history_order AS historyOrder,
      metadata,
      translations,
      created_at AS createdAt
    FROM content_history
    ORDER BY history_order ASC, id ASC
  `).all().map((item) => ({
    ...item,
    metadata: parseStoredJson(item.metadata, {}),
    translations: parseStoredJson(item.translations, {}),
  }));
}

function getContentHistoryById(historyId) {
  return getAdminContentHistory().find((item) => item.id === historyId) || null;
}

function createContentHistory(input) {
  const payload = normalizeHistoryPayload(input);

  db.exec('BEGIN');
  try {
    const result = insertContentHistoryStatement.run(
      payload.source,
      payload.title,
      payload.summary,
      payload.category,
      payload.eventPeriod,
      payload.location,
      payload.url,
      payload.historyOrder,
      JSON.stringify(payload.metadata)
    );

    db.prepare(`
      UPDATE content_history
      SET translations = ?
      WHERE id = ?
    `).run(JSON.stringify(payload.translations), result.lastInsertRowid);

    db.exec('COMMIT');
    return getContentHistoryById(Number(result.lastInsertRowid));
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

function updateContentHistory(historyId, input) {
  const payload = normalizeHistoryPayload(input);

  db.exec('BEGIN');
  try {
    const result = updateContentHistoryStatement.run(
      payload.source,
      payload.title,
      payload.summary,
      payload.category,
      payload.eventPeriod,
      payload.location,
      payload.url,
      payload.historyOrder,
      JSON.stringify(payload.metadata),
      historyId
    );

    if (result.changes === 0) {
      throw new Error('Timeline entry not found.');
    }

    db.prepare(`
      UPDATE content_history
      SET translations = ?
      WHERE id = ?
    `).run(JSON.stringify(payload.translations), historyId);

    db.exec('COMMIT');
    return getContentHistoryById(historyId);
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

function deleteContentHistory(historyId) {
  const result = deleteContentHistoryStatement.run(historyId);
  return result.changes > 0;
}

function isConstraintError(error) {
  return String(error?.message || '').includes('UNIQUE constraint failed');
}

function getAnalyticsSummary() {
  const totals = db.prepare(`
    SELECT
      COUNT(*) AS total_pageviews,
      SUM(CASE WHEN created_at >= datetime('now', '-7 days') THEN 1 ELSE 0 END) AS last_7_days_pageviews,
      MAX(created_at) AS latest_pageview_at
    FROM pageviews
  `).get();

  const topPage = db.prepare(`
    SELECT path, COUNT(*) AS views
    FROM pageviews
    GROUP BY path
    ORDER BY views DESC, path ASC
    LIMIT 1
  `).get();

  const counts = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM case_study_proof) AS case_study_count,
      (SELECT COUNT(*) FROM content_history) AS content_history_count
  `).get();

  return {
    totalPageviews: Number(totals.total_pageviews || 0),
    last7DaysPageviews: Number(totals.last_7_days_pageviews || 0),
    latestPageviewAt: totals.latest_pageview_at || null,
    topPage: topPage?.path || '/',
    topPageViews: Number(topPage?.views || 0),
    caseStudyCount: Number(counts.case_study_count || 0),
    contentHistoryCount: Number(counts.content_history_count || 0),
  };
}

function getCaseStudyProof() {
  const studies = db.prepare(`
    SELECT
      id,
      slug,
      badge,
      title,
      location,
      client,
      sector,
      deployment_window AS deploymentWindow,
      decision_surface AS decisionSurface,
      summary,
      note,
      link_label AS linkLabel,
      link_url AS linkUrl
    FROM case_study_proof
    ORDER BY proof_order ASC, id ASC
  `).all();

  const metrics = db.prepare(`
    SELECT
      case_study_id AS caseStudyId,
      metric_value AS value,
      metric_label AS label
    FROM case_study_metrics
    ORDER BY case_study_id ASC, metric_order ASC
  `).all();

  const metricsByStudy = new Map();
  metrics.forEach((metric) => {
    if (!metricsByStudy.has(metric.caseStudyId)) {
      metricsByStudy.set(metric.caseStudyId, []);
    }
    metricsByStudy.get(metric.caseStudyId).push(metric);
  });

  return studies.map((study) => ({
    ...study,
    metrics: metricsByStudy.get(study.id) || [],
  }));
}

function getContentHistory() {
  return db.prepare(`
    SELECT
      source,
      title,
      summary,
      category,
      event_period AS eventPeriod,
      location,
      url
    FROM content_history
    ORDER BY history_order ASC, id ASC
  `).all();
}

function getStatusPayload() {
  const analytics = getAnalyticsSummary();

  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      path: dbPath,
      tables: {
        pageviews: analytics.totalPageviews,
        caseStudyProof: analytics.caseStudyCount,
        contentHistory: analytics.contentHistoryCount,
      },
    },
  };
}

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.heic': 'image/heic',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ts': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
};

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body),
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(body);
}

function sendMethodNotAllowed(res, allowedMethods) {
  res.writeHead(405, {
    Allow: allowedMethods.join(', '),
    'Content-Type': 'application/json; charset=utf-8',
  });
  res.end(JSON.stringify({ error: 'Method not allowed' }));
}

async function readJsonBody(req) {
  const chunks = [];
  let totalBytes = 0;

  for await (const chunk of req) {
    totalBytes += chunk.length;
    if (totalBytes > 1024 * 1024) {
      throw new Error('Request body too large');
    }
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString('utf8').trim();
  if (!rawBody) return {};

  try {
    return JSON.parse(rawBody);
  } catch {
    return {};
  }
}

function getCountryFromHeaders(headers) {
  return headers['cf-ipcountry'] || headers['x-vercel-ip-country'] || headers['x-country-code'] || 'unknown';
}

async function handleApi(req, res, pathname) {
  const caseStudyMatch = pathname.match(/^\/api\/admin\/case-studies(?:\/(\d+))?$/);
  if (caseStudyMatch) {
    const caseStudyId = caseStudyMatch[1] ? Number(caseStudyMatch[1]) : null;

    try {
      if (caseStudyId === null) {
        if (req.method === 'GET') {
          return sendJson(res, 200, { items: getAdminCaseStudies() });
        }

        if (req.method === 'POST') {
          const body = await readJsonBody(req);
          const item = createCaseStudy(body);
          return sendJson(res, 201, { item });
        }

        return sendMethodNotAllowed(res, ['GET', 'POST']);
      }

      if (req.method === 'GET') {
        const item = getCaseStudyById(caseStudyId);
        if (!item) return sendJson(res, 404, { error: 'Case study not found' });
        return sendJson(res, 200, { item });
      }

      if (req.method === 'PUT') {
        const body = await readJsonBody(req);
        const item = updateCaseStudy(caseStudyId, body);
        return sendJson(res, 200, { item });
      }

      if (req.method === 'DELETE') {
        const deleted = deleteCaseStudy(caseStudyId);
        if (!deleted) return sendJson(res, 404, { error: 'Case study not found' });
        return sendJson(res, 200, { ok: true });
      }

      return sendMethodNotAllowed(res, ['GET', 'PUT', 'DELETE']);
    } catch (error) {
      const statusCode = isConstraintError(error)
        ? 409
        : String(error?.message || '').includes('not found')
          ? 404
          : 400;
      return sendJson(res, statusCode, { error: error.message || 'Unable to save case study' });
    }
  }

  const historyMatch = pathname.match(/^\/api\/admin\/content-history(?:\/(\d+))?$/);
  if (historyMatch) {
    const historyId = historyMatch[1] ? Number(historyMatch[1]) : null;

    try {
      if (historyId === null) {
        if (req.method === 'GET') {
          return sendJson(res, 200, { items: getAdminContentHistory() });
        }

        if (req.method === 'POST') {
          const body = await readJsonBody(req);
          const item = createContentHistory(body);
          return sendJson(res, 201, { item });
        }

        return sendMethodNotAllowed(res, ['GET', 'POST']);
      }

      if (req.method === 'GET') {
        const item = getContentHistoryById(historyId);
        if (!item) return sendJson(res, 404, { error: 'Timeline entry not found' });
        return sendJson(res, 200, { item });
      }

      if (req.method === 'PUT') {
        const body = await readJsonBody(req);
        const item = updateContentHistory(historyId, body);
        return sendJson(res, 200, { item });
      }

      if (req.method === 'DELETE') {
        const deleted = deleteContentHistory(historyId);
        if (!deleted) return sendJson(res, 404, { error: 'Timeline entry not found' });
        return sendJson(res, 200, { ok: true });
      }

      return sendMethodNotAllowed(res, ['GET', 'PUT', 'DELETE']);
    } catch (error) {
      const statusCode = isConstraintError(error)
        ? 409
        : String(error?.message || '').includes('not found')
          ? 404
          : 400;
      return sendJson(res, statusCode, { error: error.message || 'Unable to save timeline entry' });
    }
  }

  if (pathname === '/api/admin/bootstrap') {
    if (req.method !== 'GET') return sendMethodNotAllowed(res, ['GET']);
    return sendJson(res, 200, {
      analytics: getAnalyticsSummary(),
      caseStudies: getAdminCaseStudies(),
      contentHistory: getAdminContentHistory(),
      localeSupport: {
        ui: ['en', 'th', 'zh', 'ts'],
        content: ['en', 'th', 'zh'],
      },
    });
  }

  if (pathname === '/api/status') {
    if (req.method !== 'GET') return sendMethodNotAllowed(res, ['GET']);
    return sendJson(res, 200, getStatusPayload());
  }

  if (pathname === '/api/pageview') {
    if (req.method !== 'POST') return sendMethodNotAllowed(res, ['POST']);

    const body = await readJsonBody(req);
    const pathValue = typeof body.path === 'string' && body.path.trim() ? body.path.trim() : '/';
    const referrerValue = typeof body.referrer === 'string' ? body.referrer.trim() : '';
    const languageValue = typeof body.language === 'string' && body.language.trim()
      ? body.language.trim()
      : (req.headers['accept-language'] || '').split(',')[0] || 'unknown';
    const userAgentValue = req.headers['user-agent'] || 'unknown';
    const countryValue = getCountryFromHeaders(req.headers);

    insertPageviewStatement.run(
      pathValue,
      referrerValue || null,
      countryValue,
      languageValue,
      userAgentValue
    );

    return sendJson(res, 201, { ok: true });
  }

  if (pathname === '/api/analytics/summary') {
    if (req.method !== 'GET') return sendMethodNotAllowed(res, ['GET']);
    return sendJson(res, 200, getAnalyticsSummary());
  }

  if (pathname === '/api/case-study-proof') {
    if (req.method !== 'GET') return sendMethodNotAllowed(res, ['GET']);
    return sendJson(res, 200, { caseStudies: getCaseStudyProof() });
  }

  if (pathname === '/api/content-history') {
    if (req.method !== 'GET') return sendMethodNotAllowed(res, ['GET']);
    return sendJson(res, 200, { items: getContentHistory() });
  }

  if (pathname === '/api/evidence') {
    if (req.method !== 'GET') return sendMethodNotAllowed(res, ['GET']);
    return sendJson(res, 200, {
      analytics: getAnalyticsSummary(),
      caseStudies: getCaseStudyProof(),
      contentHistory: getContentHistory(),
    });
  }

  return sendJson(res, 404, { error: 'Not found' });
}

async function serveStatic(req, res, pathname) {
  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  const decodedPath = decodeURIComponent(requestedPath);
  const normalizedPath = path
    .normalize(decodedPath)
    .replace(/^(\.\.(\/|\\|$))+/, '')
    .replace(/^[/\\]+/, '');
  let filePath = path.join(publicDir, normalizedPath);

  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  let fileStat;
  try {
    fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      fileStat = await stat(filePath);
    }
  } catch {
    if (!path.extname(filePath)) {
      const fallbackPath = path.join(publicDir, 'index.html');
      if (existsSync(fallbackPath)) {
        filePath = fallbackPath;
        fileStat = await stat(filePath);
      }
    }
  }

  if (!fileStat) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[extension] || 'application/octet-stream';
  const cacheControl = extension === '.html'
    ? 'no-cache'
    : 'public, max-age=3600';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': fileStat.size,
    'Cache-Control': cacheControl,
    'X-Content-Type-Options': 'nosniff',
  });

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = requestUrl.pathname;

  try {
    if (pathname.startsWith('/api/')) {
      await handleApi(req, res, pathname);
      return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      sendMethodNotAllowed(res, ['GET', 'HEAD']);
      return;
    }

    await serveStatic(req, res, pathname);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: 'Internal server error' });
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Axiom server running on http://127.0.0.1:${port}`);
  console.log(`SQLite evidence layer ready at ${dbPath}`);
});
