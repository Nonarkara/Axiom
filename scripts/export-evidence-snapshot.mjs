import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const dbPath = path.join(rootDir, 'data', 'axiom.sqlite');
const outDir = path.join(rootDir, 'public', 'data');
const outPath = path.join(outDir, 'evidence-snapshot.json');

if (!existsSync(dbPath)) {
  throw new Error(`SQLite database not found at ${dbPath}. Start the local server first, then rerun this export.`);
}

const db = new DatabaseSync(dbPath);

function parseStoredJson(value, fallback) {
  if (!value) return fallback;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function getAnalyticsSummary() {
  const totals = db.prepare(`
    SELECT
      COUNT(*) AS total_pageviews,
      SUM(CASE WHEN created_at >= datetime('now', '-7 days') THEN 1 ELSE 0 END) AS last_7_days_pageviews,
      MAX(created_at) AS latest_pageview_at
    FROM pageviews
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
    topPage: '/',
    topPageViews: 0,
    caseStudyCount: Number(counts.case_study_count || 0),
    contentHistoryCount: Number(counts.content_history_count || 0),
    staticMode: true,
  };
}

function getCaseStudyProof() {
  const studies = db.prepare(`
    SELECT
      id,
      slug,
      badge,
      title,
      status,
      region_code AS regionCode,
      location,
      client,
      sector,
      stakeholder,
      deployment_window AS deploymentWindow,
      decision_surface AS decisionSurface,
      summary,
      note,
      outcome,
      record_type AS recordType,
      evidence_source_label AS evidenceSourceLabel,
      evidence_source_url AS evidenceSourceUrl,
      confidence_score AS confidenceScore,
      language_coverage AS languageCoverage,
      artifact_count AS artifactCount,
      last_verified_at AS lastVerifiedAt,
      link_label AS linkLabel,
      link_url AS linkUrl,
      proof_order AS proofOrder,
      translations
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

function getContentHistory() {
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
      status,
      record_type AS recordType,
      confidence_score AS confidenceScore,
      proof_note AS proofNote,
      source_type AS sourceType,
      translations
    FROM content_history
    ORDER BY history_order ASC, id ASC
  `).all().map((item) => ({
    ...item,
    metadata: parseStoredJson(item.metadata, {}),
    translations: parseStoredJson(item.translations, {}),
  }));
}

function getPipeline() {
  return db.prepare(`
    SELECT
      id, project_name AS projectName, client_name AS clientName,
      stage, has_contract AS hasContract, sector, notes,
      record_type AS recordType, source_type AS sourceType,
      external_ref AS externalRef, pipeline_order AS pipelineOrder,
      created_at AS createdAt, updated_at AS updatedAt
    FROM pipeline
    ORDER BY pipeline_order ASC, id ASC
  `).all();
}

const generatedAt = new Date().toISOString();
const pipeline = getPipeline();
const snapshot = {
  generatedAt,
  source: 'static-snapshot',
  analytics: {
    ...getAnalyticsSummary(),
    pipelineCount: pipeline.length,
    snapshotGeneratedAt: generatedAt,
  },
  caseStudies: getCaseStudyProof(),
  contentHistory: getContentHistory(),
  pipeline,
};

await mkdir(outDir, { recursive: true });
await writeFile(outPath, `${JSON.stringify(snapshot, null, 2)}\n`);

console.log(JSON.stringify({
  ok: true,
  outPath,
  caseStudies: snapshot.caseStudies.length,
  contentHistory: snapshot.contentHistory.length,
  pipeline: pipeline.length,
  generatedAt,
}, null, 2));
