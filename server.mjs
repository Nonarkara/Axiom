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
ensureColumn('case_study_proof', 'status', `TEXT DEFAULT 'live'`);
ensureColumn('case_study_proof', 'region_code', `TEXT DEFAULT 'global'`);
ensureColumn('case_study_proof', 'stakeholder', `TEXT`);
ensureColumn('case_study_proof', 'outcome', `TEXT`);
ensureColumn('case_study_proof', 'evidence_type', `TEXT DEFAULT 'reference'`);
ensureColumn('case_study_proof', 'evidence_source_label', `TEXT`);
ensureColumn('case_study_proof', 'evidence_source_url', `TEXT`);
ensureColumn('case_study_proof', 'confidence_score', `REAL DEFAULT 0.75`);
ensureColumn('case_study_proof', 'language_coverage', `TEXT DEFAULT 'en'`);
ensureColumn('case_study_proof', 'artifact_count', `INTEGER DEFAULT 1`);
ensureColumn('case_study_proof', 'last_verified_at', `TEXT`);
ensureColumn('content_history', 'translations', `TEXT DEFAULT '{}'`);
ensureColumn('content_history', 'status', `TEXT DEFAULT 'published'`);
ensureColumn('content_history', 'artifact_type', `TEXT DEFAULT 'brief'`);
ensureColumn('content_history', 'confidence_score', `REAL DEFAULT 0.75`);
ensureColumn('content_history', 'proof_note', `TEXT`);

const seededCaseStudies = [
  {
    slug: 'dngws-monitor',
    badge: 'CASE_01 // SIGNAL',
    title: 'DNGWS Monitor',
    location: 'Global / multi-theater',
    client: 'Strategic intelligence operators',
    sector: 'Geopolitics + macro signal',
    status: 'live',
    regionCode: 'global',
    stakeholder: 'Strategic operators and advisory rooms',
    deploymentWindow: 'Rapid live demo -> production monitoring surface',
    decisionSurface: 'Escalation tracking, spillover risk, and cross-source narrative compression.',
    summary: 'A working surface for geopolitical monitoring built for people who do not have time for PowerPoint latency.',
    note: 'The system keeps the room focused on a narrowing set of actions instead of a widening pile of feeds.',
    outcome: 'One monitoring surface replaced fragmented feed-checking and sharpened escalation briefings.',
    evidenceType: 'monitor',
    evidenceSourceLabel: 'Live system',
    evidenceSourceUrl: 'https://globalmonitor.fly.dev/',
    confidenceScore: 0.93,
    languageCoverage: 'en,th,zh',
    artifactCount: 12,
    lastVerifiedAt: '2026-04-19 17:20:00',
    linkLabel: 'Open live system',
    linkUrl: 'https://globalmonitor.fly.dev/',
    translations: {
      th: {
        title: 'DNGWS Monitor',
        stakeholder: 'ทีมปฏิบัติการเชิงยุทธศาสตร์และห้องที่ปรึกษา',
        deploymentWindow: 'จากเดโมสดอย่างรวดเร็วสู่ระบบติดตามใช้งานจริง',
        decisionSurface: 'ใช้ติดตามความเสี่ยงการยกระดับ ความเสี่ยงลุกลาม และสรุปสัญญาณจากหลายแหล่งให้สั้นลง',
        summary: 'พื้นผิวการติดตามภูมิรัฐศาสตร์ที่ใช้งานได้จริง สำหรับคนที่ไม่มีเวลารอ PowerPoint',
        note: 'ระบบนี้ช่วยให้การสนทนาโฟกัสกับทางเลือกที่แคบลง แทนที่จะจมอยู่กับฟีดที่กระจายออกไป',
        outcome: 'หน้าจอติดตามเดียวแทนการเช็กหลายฟีดแยกกัน และช่วยให้การสรุปสถานการณ์คมขึ้น',
        evidenceSourceLabel: 'ระบบที่เปิดใช้งานจริง',
        linkLabel: 'เปิดระบบจริง',
      },
      zh: {
        title: 'DNGWS Monitor',
        stakeholder: '战略运营团队与顾问决策室',
        deploymentWindow: '从快速现场演示到正式监测系统',
        decisionSurface: '用于跟踪升级风险、外溢风险，并把多来源叙事压缩成可操作判断',
        summary: '一个真正可用的地缘政治监测界面，服务于没有时间等待幻灯片的人',
        note: '它让会议聚焦于更少但更重要的行动，而不是越来越多的资讯流',
        outcome: '一个监测界面取代了分散的多路信息检查，并让升级简报更聚焦',
        evidenceSourceLabel: '在线系统',
        linkLabel: '打开在线系统',
      },
    },
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
    status: 'pilot',
    regionCode: 'thailand',
    stakeholder: 'Provincial command and regional operators',
    deploymentWindow: 'Pilot dashboard -> operational command room',
    decisionSurface: 'Transit telemetry, public safety, and environmental signals in one governor-facing view.',
    summary: 'A regional command layer that cuts city operations down to the few decisions the room actually needs to make fast.',
    note: 'The product logic is simple: use the existing data, compress the decision, and keep the interface awake enough for live operations.',
    outcome: 'Transit, safety, and environmental inputs were compressed into one governor-facing operating room.',
    evidenceType: 'operations',
    evidenceSourceLabel: 'Governor war room',
    evidenceSourceUrl: 'https://nonarkara.github.io/phuket-dashboard/war-room',
    confidenceScore: 0.88,
    languageCoverage: 'en,th,zh',
    artifactCount: 8,
    lastVerifiedAt: '2026-04-19 17:20:00',
    linkLabel: 'Open live system',
    linkUrl: 'https://nonarkara.github.io/phuket-dashboard/war-room',
    translations: {
      th: {
        title: 'Phuket Dashboard',
        stakeholder: 'ศูนย์สั่งการระดับจังหวัดและผู้ปฏิบัติการระดับภูมิภาค',
        deploymentWindow: 'จากแดชบอร์ดนำร่องสู่ห้องปฏิบัติการสั่งการ',
        decisionSurface: 'รวมข้อมูลการขนส่ง ความปลอดภัยสาธารณะ และสิ่งแวดล้อมไว้ในมุมมองเดียวสำหรับผู้ว่าฯ',
        summary: 'ชั้นบัญชาการระดับภูมิภาคที่ย่อการปฏิบัติการเมืองให้เหลือเฉพาะการตัดสินใจที่ต้องทำทันที',
        note: 'ตรรกะของผลิตภัณฑ์เรียบง่าย: ใช้ข้อมูลที่มีอยู่ ย่อการตัดสินใจ และทำให้อินเทอร์เฟซพร้อมสำหรับงานสด',
        outcome: 'ข้อมูลขนส่ง ความปลอดภัย และสิ่งแวดล้อมถูกรวมเป็นห้องปฏิบัติการเดียวสำหรับผู้ว่าฯ',
        evidenceSourceLabel: 'ห้องวอร์รูมผู้ว่าฯ',
        linkLabel: 'เปิดระบบจริง',
      },
      zh: {
        title: 'Phuket Dashboard',
        stakeholder: '府级指挥中心与区域运营团队',
        deploymentWindow: '从试点仪表盘到实际指挥室',
        decisionSurface: '把交通遥测、公共安全与环境信号放进同一个面向省长的界面',
        summary: '一个区域指挥层，把城市运营压缩成会议室真正需要快速决定的少数事项',
        note: '产品逻辑很简单：使用现有数据，压缩决策路径，让界面随时可用于现场运营',
        outcome: '交通、安全与环境输入被压缩进同一间面向省级领导的运行室',
        evidenceSourceLabel: '省长作战室',
        linkLabel: '打开在线系统',
      },
    },
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
    status: 'launched',
    regionCode: 'thailand',
    stakeholder: 'National programme teams and candidate cities',
    deploymentWindow: 'Public reference layer with live programme visibility',
    decisionSurface: 'Proposal tracking, programme legibility, and ranking logic that can survive scrutiny.',
    summary: 'A national smart city tracking surface that makes the programme legible and keeps the evidence visible.',
    note: 'This is the clearest proof of the Axiom stance that governance systems should make bureaucracy readable, not ceremonial.',
    outcome: 'A national programme became inspectable in public instead of hidden in slide decks and reporting loops.',
    evidenceType: 'index',
    evidenceSourceLabel: 'Public index',
    evidenceSourceUrl: 'https://nonarkara.github.io/smart-city-thailand-index/',
    confidenceScore: 0.91,
    languageCoverage: 'en,th,zh',
    artifactCount: 5,
    lastVerifiedAt: '2026-04-19 17:20:00',
    linkLabel: 'Open live system',
    linkUrl: 'https://nonarkara.github.io/smart-city-thailand-index/',
    translations: {
      th: {
        title: 'Smart City Thailand Index',
        stakeholder: 'ทีมโครงการระดับชาติและเมืองผู้สมัคร',
        deploymentWindow: 'ชั้นอ้างอิงสาธารณะที่มองเห็นความคืบหน้าโครงการได้แบบสด',
        decisionSurface: 'ใช้ติดตามข้อเสนอ ความชัดเจนของโครงการ และตรรกะการจัดอันดับที่ตรวจสอบได้',
        summary: 'พื้นผิวติดตามโครงการสมาร์ตซิตี้ระดับชาติที่ทำให้โครงการอ่านได้และทำให้หลักฐานมองเห็นได้',
        note: 'นี่คือหลักฐานที่ชัดที่สุดของแนวคิด Axiom ว่าระบบกำกับดูแลควรทำให้ระบบราชการอ่านได้ ไม่ใช่เป็นเพียงพิธีกรรม',
        outcome: 'โครงการระดับชาติกลายเป็นสิ่งที่สาธารณะตรวจสอบได้ แทนที่จะซ่อนอยู่ในสไลด์และวงจรรายงาน',
        evidenceSourceLabel: 'ดัชนีสาธารณะ',
        linkLabel: 'เปิดระบบจริง',
      },
      zh: {
        title: 'Smart City Thailand Index',
        stakeholder: '国家项目团队与候选城市',
        deploymentWindow: '具备实时项目可见性的公共参考层',
        decisionSurface: '用于跟踪提案、提升项目可读性，并公开可经受审视的排名逻辑',
        summary: '一个国家级智慧城市追踪界面，让项目更易理解，也让证据始终可见',
        note: '这是 Axiom 立场最清晰的证明：治理系统应该让官僚流程可读，而不是只剩仪式感',
        outcome: '一个国家项目从幻灯片和报告流程中走出来，变成公众可检查的表层',
        evidenceSourceLabel: '公开指数',
        linkLabel: '打开在线系统',
      },
    },
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
    status: 'published',
    artifactType: 'keynote',
    confidenceScore: 0.95,
    proofNote: 'Public keynote backed by on-stage screenshots and live demonstrations.',
    translations: {
      th: {
        source: 'SCSE Taipei',
        title: 'Protocol Alpha เปิดตัวที่ไทเปพร้อมแดชบอร์ดสดบนเวที',
        summary: 'คีย์โน้ต หลักฐานภาคสนาม และตรรกะการจัดอันดับถูกแสดงเป็นระบบที่ทำงานจริง ไม่ใช่งานคอนเซปต์',
        category: 'เปิดตัว',
        eventPeriod: 'ไตรมาส 1 ปี 2026',
        proofNote: 'คีย์โน้ตสาธารณะที่มีภาพหน้าจอและการสาธิตสดบนเวทีรองรับ',
      },
      zh: {
        source: 'SCSE Taipei',
        title: 'Protocol Alpha 在台北发布，并在台上展示实时仪表盘',
        summary: '主题演讲、现场证据与排名逻辑以可运行系统的形式出现，而不是概念图',
        category: '发布',
        eventPeriod: '2026年第一季度',
        proofNote: '公开演讲由现场截图和实时演示支持',
      },
    },
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
    status: 'published',
    artifactType: 'index',
    confidenceScore: 0.9,
    proofNote: 'Public index surface and launch references remain accessible online.',
    translations: {
      th: {
        source: 'Smart City Thailand Index',
        title: 'การติดตามโครงการระดับชาติกลายเป็นพื้นผิวอ้างอิงสาธารณะ',
        summary: 'ดัชนีเปลี่ยนจากคำกล่าวอ้างแบบคงที่ไปสู่ชั้นสาธารณะที่อ่านได้ ซึ่งทำให้ข้อเสนอ ความคืบหน้า และตรรกะของโครงการยังคงมองเห็นได้',
        category: 'โครงการ',
        eventPeriod: 'ไตรมาส 4 ปี 2025',
        proofNote: 'ดัชนีสาธารณะและหลักฐานการเปิดตัวยังคงเปิดให้เข้าถึงทางออนไลน์',
      },
      zh: {
        source: 'Smart City Thailand Index',
        title: '国家项目跟踪成为一个面向公众的参考界面',
        summary: '该指数从静态主张转变为一个可读的公共层，使提案、进展和项目逻辑持续可见',
        category: '项目',
        eventPeriod: '2025年第四季度',
        proofNote: '公开指数界面与发布资料仍可在线访问',
      },
    },
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
    status: 'field',
    artifactType: 'operations',
    confidenceScore: 0.87,
    proofNote: 'Working interface and operational screenshots demonstrate the field build.',
    translations: {
      th: {
        source: 'Phuket Dashboard',
        title: 'การสร้างแดชบอร์ดภาคสนามสำหรับผู้ว่าฯ ทำให้โมเดลห้องปฏิบัติการเมืองคมขึ้น',
        summary: 'ข้อมูลขนส่ง สัญญาณสิ่งแวดล้อม และความปลอดภัยสาธารณะถูกรวมไว้ในอินเทอร์เฟซเดียวที่ออกแบบมาสำหรับการตัดสินใจแบบสดภายใต้แรงกดดัน',
        category: 'ลงพื้นที่',
        eventPeriod: 'ไตรมาส 4 ปี 2025',
        proofNote: 'อินเทอร์เฟซที่ใช้งานได้จริงและภาพหน้าจอการปฏิบัติการยืนยันการทำงานภาคสนาม',
      },
      zh: {
        source: 'Phuket Dashboard',
        title: '省长仪表盘的现场构建，让城市运行室模型更加清晰',
        summary: '交通遥测、环境信号与公共安全被压缩进同一个为高压下实时决策而设计的界面',
        category: '部署',
        eventPeriod: '2025年第四季度',
        proofNote: '可运行界面与操作截图证明了现场构建过程',
      },
    },
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
    status: 'published',
    artifactType: 'network',
    confidenceScore: 0.84,
    proofNote: 'Regional project layer and supporting materials remain published online.',
    translations: {
      th: {
        source: 'ASEAN Smart Cities Network',
        title: 'การเปรียบเทียบข้ามเมืองขยับจากงานนำเสนอไปสู่ชั้นภูมิภาคที่ใช้งานได้',
        summary: 'งานในเครือข่ายอาเซียนเชื่อมการติดตามโครงการเข้ากับเกณฑ์เปรียบเทียบ SLIC ทำให้ความร่วมมือระดับภูมิภาคใช้งานได้จริงมากกว่าพิธีกรรม',
        category: 'ภูมิภาค',
        eventPeriod: 'ไตรมาส 3 ปี 2025',
        proofNote: 'ชั้นข้อมูลระดับภูมิภาคและเอกสารประกอบยังเผยแพร่ออนไลน์',
      },
      zh: {
        source: 'ASEAN Smart Cities Network',
        title: '跨城市基准比较从展示材料变成了可用的区域层',
        summary: '东盟网络工作把项目跟踪与 SLIC 基准比较连接起来，使区域协作从仪式转向可导航的工作层',
        category: '区域',
        eventPeriod: '2025年第三季度',
        proofNote: '区域项目层与相关材料仍在线公开',
      },
    },
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
    status: 'published',
    artifactType: 'roadmap',
    confidenceScore: 0.82,
    proofNote: 'Workshop materials and institutional framing remain available online.',
    translations: {
      th: {
        source: 'Solomon Islands Workshop',
        title: 'งานโรดแมปดิจิทัลทั้งภาครัฐพิสูจน์โมเดลนี้นอกตลาดหลัก',
        summary: 'เวิร์กชอปวางกรอบการเปลี่ยนผ่านดิจิทัลระดับรัฐให้เป็นเส้นทางของระบบที่ทำได้จริง ไม่ใช่เพียงคำขวัญเรื่องความทันสมัย',
        category: 'โรดแมป',
        eventPeriod: 'ไตรมาส 2 ปี 2025',
        proofNote: 'เอกสารเวิร์กชอปและกรอบสถาบันยังคงเข้าถึงได้ออนไลน์',
      },
      zh: {
        source: 'Solomon Islands Workshop',
        title: '全政府数字路线图工作在核心本土市场之外验证了这一模型',
        summary: '该工作坊把主权数字化转型定义为一条务实的系统路径，而不是抽象的现代化口号',
        category: '路线图',
        eventPeriod: '2025年第二季度',
        proofNote: '工作坊材料与制度框架仍可在线访问',
      },
    },
    historyOrder: 5,
  },
];

seedDatabase();
syncSeedEvidenceRecords();

const insertPageviewStatement = db.prepare(`
  INSERT INTO pageviews (path, referrer, country, language, user_agent)
  VALUES (?, ?, ?, ?, ?)
`);

const insertCaseStudyStatement = db.prepare(`
  INSERT INTO case_study_proof (
    slug, badge, title, location, client, sector, deployment_window,
    decision_surface, summary, note, link_label, link_url, proof_order,
    status, region_code, stakeholder, outcome, evidence_type, evidence_source_label,
    evidence_source_url, confidence_score, language_coverage, artifact_count, last_verified_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    status = ?,
    region_code = ?,
    stakeholder = ?,
    outcome = ?,
    evidence_type = ?,
    evidence_source_label = ?,
    evidence_source_url = ?,
    confidence_score = ?,
    language_coverage = ?,
    artifact_count = ?,
    last_verified_at = ?,
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
    source, title, summary, category, event_period, location, url, history_order, metadata,
    status, artifact_type, confidence_score, proof_note
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    metadata = ?,
    status = ?,
    artifact_type = ?,
    confidence_score = ?,
    proof_note = ?
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
    const insertMetric = db.prepare(`
      INSERT INTO case_study_metrics (case_study_id, metric_value, metric_label, metric_order)
      VALUES (?, ?, ?, ?)
    `);

    db.exec('BEGIN');
    try {
      seededCaseStudies.forEach((study) => {
        const result = insertCaseStudyStatement.run(
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
          study.proofOrder,
          study.status,
          study.regionCode,
          study.stakeholder,
          study.outcome,
          study.evidenceType,
          study.evidenceSourceLabel,
          study.evidenceSourceUrl,
          study.confidenceScore,
          study.languageCoverage,
          study.artifactCount,
          study.lastVerifiedAt
        );

        db.prepare(`
          UPDATE case_study_proof
          SET translations = ?
          WHERE id = ?
        `).run(JSON.stringify(study.translations || {}), result.lastInsertRowid);

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
    db.exec('BEGIN');
    try {
      seededContentHistory.forEach((item) => {
        const result = insertContentHistoryStatement.run(
          item.source,
          item.title,
          item.summary,
          item.category,
          item.eventPeriod,
          item.location,
          item.url,
          item.historyOrder,
          JSON.stringify({}),
          item.status,
          item.artifactType,
          item.confidenceScore,
          item.proofNote
        );

        db.prepare(`
          UPDATE content_history
          SET translations = ?
          WHERE id = ?
        `).run(JSON.stringify(item.translations || {}), result.lastInsertRowid);
      });
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  }
}

function mergeSeedTranslations(seedTranslations, currentTranslations) {
  const merged = {};
  const languages = new Set([
    ...Object.keys(seedTranslations || {}),
    ...Object.keys(currentTranslations || {}),
  ]);

  languages.forEach((language) => {
    const seedEntry = seedTranslations?.[language];
    const currentEntry = currentTranslations?.[language];
    const nextEntry = {
      ...(seedEntry && typeof seedEntry === 'object' ? seedEntry : {}),
      ...(currentEntry && typeof currentEntry === 'object' ? currentEntry : {}),
    };

    if (Object.keys(nextEntry).length > 0) {
      merged[language] = nextEntry;
    }
  });

  return merged;
}

function pickSeedText(currentValue, seedValue, placeholderValue = null) {
  const normalized = cleanText(currentValue, '');
  if (!normalized) return seedValue || null;
  if (placeholderValue !== null && normalized === placeholderValue) return seedValue || null;
  return normalized;
}

function pickSeedNumber(currentValue, seedValue, placeholderValue = null) {
  if (currentValue === null || currentValue === undefined || currentValue === '') {
    return seedValue;
  }

  const numeric = Number(currentValue);
  if (placeholderValue !== null && numeric === placeholderValue) {
    return seedValue;
  }

  return currentValue;
}

function syncSeedEvidenceRecords() {
  seededCaseStudies.forEach((study) => {
    const existing = db.prepare(`
      SELECT
        id,
        status,
        region_code AS regionCode,
        stakeholder,
        outcome,
        evidence_type AS evidenceType,
        evidence_source_label AS evidenceSourceLabel,
        evidence_source_url AS evidenceSourceUrl,
        confidence_score AS confidenceScore,
        language_coverage AS languageCoverage,
        artifact_count AS artifactCount,
        last_verified_at AS lastVerifiedAt,
        translations
      FROM case_study_proof
      WHERE slug = ?
    `).get(study.slug);

    if (!existing) return;

    const translations = mergeSeedTranslations(
      study.translations || {},
      parseStoredJson(existing.translations, {})
    );

    db.prepare(`
      UPDATE case_study_proof
      SET
        status = ?,
        region_code = ?,
        stakeholder = ?,
        outcome = ?,
        evidence_type = ?,
        evidence_source_label = ?,
        evidence_source_url = ?,
        confidence_score = ?,
        language_coverage = ?,
        artifact_count = ?,
        last_verified_at = ?,
        translations = ?
      WHERE slug = ?
    `).run(
      pickSeedText(existing.status, study.status, 'live'),
      pickSeedText(existing.regionCode, study.regionCode, 'global'),
      pickSeedText(existing.stakeholder, study.stakeholder),
      pickSeedText(existing.outcome, study.outcome),
      pickSeedText(existing.evidenceType, study.evidenceType, 'reference'),
      pickSeedText(existing.evidenceSourceLabel, study.evidenceSourceLabel),
      pickSeedText(existing.evidenceSourceUrl, study.evidenceSourceUrl),
      pickSeedNumber(existing.confidenceScore, study.confidenceScore, 0.75),
      pickSeedText(existing.languageCoverage, study.languageCoverage, 'en'),
      pickSeedNumber(existing.artifactCount, study.artifactCount, 1),
      pickSeedText(existing.lastVerifiedAt, study.lastVerifiedAt),
      JSON.stringify(translations),
      study.slug
    );
  });

  seededContentHistory.forEach((item) => {
    const existing = db.prepare(`
      SELECT
        id,
        status,
        artifact_type AS artifactType,
        confidence_score AS confidenceScore,
        proof_note AS proofNote,
        translations
      FROM content_history
      WHERE title = ?
    `).get(item.title);

    if (!existing) return;

    const translations = mergeSeedTranslations(
      item.translations || {},
      parseStoredJson(existing.translations, {})
    );

    db.prepare(`
      UPDATE content_history
      SET
        status = ?,
        artifact_type = ?,
        confidence_score = ?,
        proof_note = ?,
        translations = ?
      WHERE title = ?
    `).run(
      pickSeedText(existing.status, item.status, 'published'),
      pickSeedText(existing.artifactType, item.artifactType, 'brief'),
      pickSeedNumber(existing.confidenceScore, item.confidenceScore, 0.75),
      pickSeedText(existing.proofNote, item.proofNote),
      JSON.stringify(translations),
      item.title
    );
  });
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

function cleanFloat(value, fallback = 0) {
  const numeric = Number.parseFloat(String(value ?? fallback));
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
  const fields = ['title', 'stakeholder', 'deploymentWindow', 'decisionSurface', 'summary', 'note', 'outcome', 'evidenceSourceLabel', 'linkLabel'];
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
  const fields = ['source', 'title', 'summary', 'category', 'eventPeriod', 'proofNote'];
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

function normalizeLanguageCoverage(input) {
  if (typeof input !== 'string') return 'en';

  const normalized = Array.from(new Set(
    input
      .split(',')
      .map((part) => part.trim().toLowerCase())
      .filter(Boolean)
      .filter((part) => ['en', 'th', 'zh'].includes(part))
  ));

  return normalized.length ? normalized.join(',') : 'en';
}

function mergeLanguageCoverage(input, translations) {
  const languages = new Set(normalizeLanguageCoverage(input).split(','));

  ['th', 'zh'].forEach((language) => {
    const entry = translations?.[language];
    if (!entry || typeof entry !== 'object') return;

    if (Object.values(entry).some((value) => cleanText(value, ''))) {
      languages.add(language);
    }
  });

  return Array.from(languages).filter(Boolean).join(',');
}

function normalizeCaseStudyPayload(input) {
  const title = cleanRequiredText(input?.title, 'Title');
  const slug = cleanText(input?.slug, '') || slugify(title);
  const translations = normalizeCaseStudyTranslations(input?.translations);
  if (!slug) {
    throw new Error('Slug could not be generated. Please enter a title or slug.');
  }

  return {
    slug,
    badge: cleanRequiredText(input?.badge, 'Badge'),
    title,
    status: cleanText(input?.status, 'live') || 'live',
    regionCode: cleanText(input?.regionCode, 'global') || 'global',
    location: cleanNullableText(input?.location),
    client: cleanNullableText(input?.client),
    sector: cleanNullableText(input?.sector),
    stakeholder: cleanNullableText(input?.stakeholder),
    deploymentWindow: cleanNullableText(input?.deploymentWindow),
    decisionSurface: cleanNullableText(input?.decisionSurface),
    summary: cleanNullableText(input?.summary),
    note: cleanNullableText(input?.note),
    outcome: cleanNullableText(input?.outcome),
    evidenceType: cleanText(input?.evidenceType, 'reference') || 'reference',
    evidenceSourceLabel: cleanNullableText(input?.evidenceSourceLabel),
    evidenceSourceUrl: cleanNullableText(input?.evidenceSourceUrl),
    confidenceScore: Math.max(0, Math.min(1, cleanFloat(input?.confidenceScore, 0.75))),
    languageCoverage: mergeLanguageCoverage(input?.languageCoverage, translations),
    artifactCount: Math.max(1, cleanInteger(input?.artifactCount, 1)),
    lastVerifiedAt: cleanNullableText(input?.lastVerifiedAt),
    linkLabel: cleanNullableText(input?.linkLabel),
    linkUrl: cleanNullableText(input?.linkUrl),
    proofOrder: cleanInteger(input?.proofOrder, 0),
    translations,
    metrics: normalizeCaseStudyMetrics(input?.metrics),
  };
}

function normalizeHistoryPayload(input) {
  const metadata = typeof input?.metadata === 'string'
    ? parseStoredJson(input.metadata, {})
    : (input?.metadata && typeof input.metadata === 'object' ? input.metadata : {});

  return {
    source: cleanRequiredText(input?.source, 'Source'),
    title: cleanRequiredText(input?.title, 'Title'),
    summary: cleanRequiredText(input?.summary, 'Summary'),
    category: cleanRequiredText(input?.category, 'Category'),
    eventPeriod: cleanRequiredText(input?.eventPeriod, 'Event period'),
    location: cleanNullableText(input?.location),
    url: cleanNullableText(input?.url),
    historyOrder: cleanInteger(input?.historyOrder, 0),
    metadata,
    status: cleanText(input?.status, 'published') || 'published',
    artifactType: cleanText(input?.artifactType, 'brief') || 'brief',
    confidenceScore: Math.max(0, Math.min(1, cleanFloat(input?.confidenceScore, 0.75))),
    proofNote: cleanNullableText(input?.proofNote),
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
      evidence_type AS evidenceType,
      evidence_source_label AS evidenceSourceLabel,
      evidence_source_url AS evidenceSourceUrl,
      confidence_score AS confidenceScore,
      language_coverage AS languageCoverage,
      artifact_count AS artifactCount,
      last_verified_at AS lastVerifiedAt,
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
      payload.proofOrder,
      payload.status,
      payload.regionCode,
      payload.stakeholder,
      payload.outcome,
      payload.evidenceType,
      payload.evidenceSourceLabel,
      payload.evidenceSourceUrl,
      payload.confidenceScore,
      payload.languageCoverage,
      payload.artifactCount,
      payload.lastVerifiedAt
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
      payload.status,
      payload.regionCode,
      payload.stakeholder,
      payload.outcome,
      payload.evidenceType,
      payload.evidenceSourceLabel,
      payload.evidenceSourceUrl,
      payload.confidenceScore,
      payload.languageCoverage,
      payload.artifactCount,
      payload.lastVerifiedAt,
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
      status,
      artifact_type AS artifactType,
      confidence_score AS confidenceScore,
      proof_note AS proofNote,
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
      JSON.stringify(payload.metadata),
      payload.status,
      payload.artifactType,
      payload.confidenceScore,
      payload.proofNote
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
      payload.status,
      payload.artifactType,
      payload.confidenceScore,
      payload.proofNote,
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
      evidence_type AS evidenceType,
      evidence_source_label AS evidenceSourceLabel,
      evidence_source_url AS evidenceSourceUrl,
      confidence_score AS confidenceScore,
      language_coverage AS languageCoverage,
      artifact_count AS artifactCount,
      last_verified_at AS lastVerifiedAt,
      link_label AS linkLabel,
      link_url AS linkUrl,
      translations
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
      status,
      artifact_type AS artifactType,
      confidence_score AS confidenceScore,
      proof_note AS proofNote,
      translations
    FROM content_history
    ORDER BY history_order ASC, id ASC
  `).all().map((item) => ({
    ...item,
    translations: parseStoredJson(item.translations, {}),
  }));
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
