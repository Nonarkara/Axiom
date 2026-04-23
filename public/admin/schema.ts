export type ContentLocale = 'en' | 'th' | 'zh';
export type UiMode = ContentLocale | 'ts';

export type CaseStudyTranslation = Partial<{
  title: string;
  stakeholder: string;
  deploymentWindow: string;
  decisionSurface: string;
  summary: string;
  note: string;
  outcome: string;
  evidenceSourceLabel: string;
  linkLabel: string;
}>;

export type HistoryTranslation = Partial<{
  source: string;
  title: string;
  summary: string;
  category: string;
  eventPeriod: string;
  proofNote: string;
}>;

export interface CaseStudyMetric {
  value: string;
  label: string;
}

export interface CaseStudyRecord {
  id: number | null;
  slug: string;
  badge: string;
  title: string;
  status: string;
  regionCode: string;
  location: string;
  client: string;
  sector: string;
  stakeholder: string;
  deploymentWindow: string;
  decisionSurface: string;
  summary: string;
  note: string;
  outcome: string;
  evidenceType: string;
  evidenceSourceLabel: string;
  evidenceSourceUrl: string;
  confidenceScore: number;
  languageCoverage: string;
  artifactCount: number;
  lastVerifiedAt: string;
  linkLabel: string;
  linkUrl: string;
  proofOrder: number;
  metrics: CaseStudyMetric[];
  translations: Partial<Record<Exclude<ContentLocale, 'en'>, CaseStudyTranslation>>;
}

export interface HistoryRecord {
  id: number | null;
  source: string;
  title: string;
  summary: string;
  category: string;
  eventPeriod: string;
  location: string;
  url: string;
  historyOrder: number;
  metadata: Record<string, unknown>;
  status: string;
  artifactType: string;
  confidenceScore: number;
  proofNote: string;
  translations: Partial<Record<Exclude<ContentLocale, 'en'>, HistoryTranslation>>;
}

export interface EditorSnapshot {
  uiMode: UiMode;
  contentLocale: ContentLocale;
  analytics: {
    totalPageviews: number;
    last7DaysPageviews?: number;
    latestPageviewAt?: string | null;
    topPage?: string;
    topPageViews?: number;
    caseStudyCount?: number;
    contentHistoryCount?: number;
  };
  selectedCaseStudy: CaseStudyRecord;
  selectedTimelineEntry: HistoryRecord;
}
