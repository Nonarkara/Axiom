// @ts-check

/** @typedef {'en' | 'th' | 'zh' | 'ts'} UiLocale */
/** @typedef {'en' | 'th' | 'zh'} ContentLocale */

/**
 * @typedef {{
 *   id: number | null,
 *   slug: string,
 *   badge: string,
 *   title: string,
 *   location: string,
 *   client: string,
 *   sector: string,
 *   deploymentWindow: string,
 *   decisionSurface: string,
 *   summary: string,
 *   note: string,
 *   linkLabel: string,
 *   linkUrl: string,
 *   proofOrder: number,
 *   translations: Record<string, Partial<Record<'title' | 'deploymentWindow' | 'decisionSurface' | 'summary' | 'note' | 'linkLabel', string>>>,
 *   metrics: Array<{ value: string, label: string }>
 * }} CaseStudyRecord
 */

/**
 * @typedef {{
 *   id: number | null,
 *   source: string,
 *   title: string,
 *   summary: string,
 *   category: string,
 *   eventPeriod: string,
 *   location: string,
 *   url: string,
 *   historyOrder: number,
 *   metadata: Record<string, unknown>,
 *   translations: Record<string, Partial<Record<'source' | 'title' | 'summary' | 'category' | 'eventPeriod', string>>>
 * }} HistoryRecord
 */

const uiCopy = {
  en: {
    hero: {
      kicker: 'Evidence Control Room',
      title: 'Edit the proof without editing the code.',
      desc: 'This local workspace updates the records behind the public evidence section. English drives the public page today. Thai and Chinese are stored here for the next multilingual phase.',
      openSite: 'Open public site',
    },
    overview: {
      kicker: 'Where we are now',
      title: 'The evidence layer is live and editable.',
      desc: 'These numbers come from the local database, not from hard-coded page copy.',
      pageviews: 'Visits recorded',
      caseStudies: 'Project proof files',
      caseStudiesMeta: 'Records available to the public page.',
      timeline: 'Timeline entries',
      pageviewsMeta: 'Latest visit',
      timelineMeta: 'Public milestones in the evidence layer.',
    },
    case: {
      kicker: 'Project proof',
      title: 'Case-study records',
      desc: 'Pick a project, update the facts, and the public evidence section will read the new record.',
      labels: {
        badge: 'Badge',
        slug: 'Slug',
        order: 'Display order',
        client: 'Who it was for',
        location: 'Where',
        sector: 'Type of work',
        linkUrl: 'Live URL',
        linkLabel: 'English link label',
        metrics: 'Result metrics',
        metricsHelp: 'One metric per line in the format: value | label',
        title: 'Title',
        deploymentWindow: 'What was delivered',
        decisionSurface: 'What decisions it helped',
        summary: 'Why it matters',
        note: 'Operator note',
      },
      locale: {
        en: {
          title: 'English content',
          hint: 'This is the text the public page uses right now.',
        },
        th: {
          title: 'Thai content',
          hint: 'These Thai values are stored now and can be used in the next public rollout.',
        },
        zh: {
          title: 'Chinese content',
          hint: 'These Chinese values are stored now and can be used in the next public rollout.',
        },
        ts: {
          title: 'TypeScript preview',
          hint: 'Read-only developer view. Switch back to English, Thai, or Chinese to edit text.',
        },
      },
      empty: 'No project records found yet.',
      newItem: 'Untitled project record',
      deleteConfirm: 'Delete this project record?',
    },
    history: {
      kicker: 'Project timeline',
      title: 'Public history records',
      desc: 'This list explains where the proof came from and when the work entered the public record.',
      labels: {
        order: 'Display order',
        location: 'Location',
        url: 'Source URL',
        source: 'Source',
        title: 'Headline',
        summary: 'Summary',
        category: 'Category',
        eventPeriod: 'Time period',
      },
      locale: {
        en: {
          title: 'English content',
          hint: 'This is the text the public timeline uses right now.',
        },
        th: {
          title: 'Thai content',
          hint: 'These Thai values are stored now and can be used in the next public rollout.',
        },
        zh: {
          title: 'Chinese content',
          hint: 'These Chinese values are stored now and can be used in the next public rollout.',
        },
        ts: {
          title: 'TypeScript preview',
          hint: 'Read-only developer view. Switch back to English, Thai, or Chinese to edit text.',
        },
      },
      empty: 'No timeline records found yet.',
      newItem: 'Untitled timeline entry',
      deleteConfirm: 'Delete this timeline entry?',
    },
    locale: {
      kicker: 'Language layer',
    },
    actions: {
      newCase: 'New project record',
      newHistory: 'New timeline entry',
      save: 'Save changes',
      deleteCase: 'Delete project',
      deleteHistory: 'Delete timeline entry',
    },
    guide: {
      kicker: 'Operator guide',
      title: 'How this works',
      desc: 'The editor changes database records, not the homepage markup. English is live now; Thai and Chinese are stored for the next public rollout.',
      items: [
        { title: 'Public page', text: 'The homepage still reads the English fields by default, so changes to English are visible immediately.' },
        { title: 'Thai and Chinese', text: 'Those translations are now stored with each record, even before the public switching layer is built.' },
        { title: 'TypeScript mode', text: 'The fourth mode is a typed preview for developers, so product and engineering can look at the same record shape.' },
      ],
    },
    typescript: {
      title: 'Typed preview',
      desc: 'A developer-readable snapshot of the selected records and current locale.',
    },
    notifications: {
      loaded: 'Editor loaded from the local evidence database.',
      caseSaved: 'Project record saved.',
      historySaved: 'Timeline entry saved.',
      caseDeleted: 'Project record deleted.',
      historyDeleted: 'Timeline entry deleted.',
      loadFailed: 'Could not load the editor data from the local API server.',
    },
  },
  th: {
    hero: {
      kicker: 'ห้องควบคุมหลักฐาน',
      title: 'แก้ไขหลักฐานได้โดยไม่ต้องแก้โค้ดหน้าเว็บ',
      desc: 'พื้นที่แก้ไขนี้อัปเดตข้อมูลที่อยู่หลังส่วน Evidence บนหน้าเว็บสาธารณะ ตอนนี้หน้าเว็บใช้ภาษาอังกฤษเป็นหลัก ส่วนภาษาไทยและภาษาจีนจะถูกเก็บไว้สำหรับเฟสหลายภาษาในลำดับถัดไป',
      openSite: 'เปิดหน้าเว็บสาธารณะ',
    },
    overview: {
      kicker: 'ตอนนี้เราอยู่ตรงไหน',
      title: 'ชั้นข้อมูลหลักฐานเปิดใช้งานแล้วและแก้ไขได้',
      desc: 'ตัวเลขเหล่านี้มาจากฐานข้อมูลภายในเครื่อง ไม่ได้มาจากข้อความที่เขียนค้างไว้ในหน้าเว็บ',
      pageviews: 'จำนวนการเข้าชมที่บันทึกแล้ว',
      caseStudies: 'แฟ้มหลักฐานโครงการ',
      caseStudiesMeta: 'ระเบียนที่หน้าเว็บสาธารณะสามารถอ่านได้',
      timeline: 'รายการไทม์ไลน์',
      pageviewsMeta: 'การเข้าชมล่าสุด',
      timelineMeta: 'หมุดหมายสาธารณะในชั้นหลักฐาน',
    },
    case: {
      kicker: 'หลักฐานโครงการ',
      title: 'ระเบียนกรณีศึกษา',
      desc: 'เลือกโครงการ แก้ข้อมูลข้อเท็จจริง แล้วหน้า Evidence สาธารณะจะอ่านระเบียนใหม่ทันที',
      labels: {
        badge: 'ป้ายกำกับ',
        slug: 'สลัก',
        order: 'ลำดับการแสดงผล',
        client: 'สำหรับใคร',
        location: 'ที่ไหน',
        sector: 'ประเภทงาน',
        linkUrl: 'ลิงก์ระบบจริง',
        linkLabel: 'ข้อความลิงก์ภาษาอังกฤษ',
        metrics: 'ผลลัพธ์ที่ต้องการแสดง',
        metricsHelp: 'หนึ่งบรรทัดต่อหนึ่งค่า รูปแบบคือ: value | label',
        title: 'ชื่อเรื่อง',
        deploymentWindow: 'ส่งมอบอะไร',
        decisionSurface: 'ช่วยเรื่องการตัดสินใจอะไร',
        summary: 'ทำไมจึงสำคัญ',
        note: 'หมายเหตุสำหรับผู้ปฏิบัติการ',
      },
      locale: {
        en: { title: 'เนื้อหาภาษาอังกฤษ', hint: 'ข้อความชุดนี้คือสิ่งที่หน้าเว็บสาธารณะใช้อยู่ตอนนี้' },
        th: { title: 'เนื้อหาภาษาไทย', hint: 'ค่าภาษาไทยจะถูกเก็บไว้ตอนนี้ และใช้ได้ในเฟสหลายภาษาถัดไป' },
        zh: { title: 'เนื้อหาภาษาจีน', hint: 'ค่าภาษาจีนจะถูกเก็บไว้ตอนนี้ และใช้ได้ในเฟสหลายภาษาถัดไป' },
        ts: { title: 'ตัวอย่าง TypeScript', hint: 'โหมดนี้อ่านอย่างเดียว สลับกลับไปภาษาอังกฤษ ไทย หรือจีนเพื่อแก้ข้อความ' },
      },
      empty: 'ยังไม่มีระเบียนโครงการ',
      newItem: 'ระเบียนโครงการใหม่',
      deleteConfirm: 'ลบระเบียนโครงการนี้หรือไม่',
    },
    history: {
      kicker: 'ไทม์ไลน์โครงการ',
      title: 'ระเบียนประวัติสาธารณะ',
      desc: 'รายการนี้อธิบายว่าหลักฐานมาจากไหน และงานเข้าสู่บันทึกสาธารณะเมื่อใด',
      labels: {
        order: 'ลำดับการแสดงผล',
        location: 'สถานที่',
        url: 'ลิงก์แหล่งอ้างอิง',
        source: 'แหล่งที่มา',
        title: 'หัวข้อ',
        summary: 'สรุป',
        category: 'หมวดหมู่',
        eventPeriod: 'ช่วงเวลา',
      },
      locale: {
        en: { title: 'เนื้อหาภาษาอังกฤษ', hint: 'ข้อความชุดนี้คือสิ่งที่ไทม์ไลน์สาธารณะใช้อยู่ตอนนี้' },
        th: { title: 'เนื้อหาภาษาไทย', hint: 'ค่าภาษาไทยจะถูกเก็บไว้ตอนนี้ และใช้ได้ในเฟสหลายภาษาถัดไป' },
        zh: { title: 'เนื้อหาภาษาจีน', hint: 'ค่าภาษาจีนจะถูกเก็บไว้ตอนนี้ และใช้ได้ในเฟสหลายภาษาถัดไป' },
        ts: { title: 'ตัวอย่าง TypeScript', hint: 'โหมดนี้อ่านอย่างเดียว สลับกลับไปภาษาอังกฤษ ไทย หรือจีนเพื่อแก้ข้อความ' },
      },
      empty: 'ยังไม่มีระเบียนไทม์ไลน์',
      newItem: 'รายการไทม์ไลน์ใหม่',
      deleteConfirm: 'ลบรายการไทม์ไลน์นี้หรือไม่',
    },
    locale: { kicker: 'ชั้นภาษา' },
    actions: {
      newCase: 'สร้างระเบียนโครงการ',
      newHistory: 'สร้างรายการไทม์ไลน์',
      save: 'บันทึกการเปลี่ยนแปลง',
      deleteCase: 'ลบโครงการ',
      deleteHistory: 'ลบรายการไทม์ไลน์',
    },
    guide: {
      kicker: 'คู่มือผู้ปฏิบัติการ',
      title: 'ระบบนี้ทำงานอย่างไร',
      desc: 'ตัวแก้ไขนี้เปลี่ยนข้อมูลในฐานข้อมูล ไม่ได้แก้ markup ของหน้าเว็บโดยตรง ตอนนี้ภาษาอังกฤษแสดงผลจริง ส่วนไทยและจีนถูกเก็บไว้สำหรับรอบถัดไป',
      items: [
        { title: 'หน้าเว็บสาธารณะ', text: 'หน้าโฮมเพจยังอ่านค่าภาษาอังกฤษเป็นค่าเริ่มต้น ดังนั้นการแก้ภาษาอังกฤษจะเห็นผลทันที' },
        { title: 'ภาษาไทยและภาษาจีน', text: 'คำแปลทั้งสองภาษาถูกเก็บไว้กับระเบียนแต่ละรายการแล้ว แม้ยังไม่มีตัวสลับภาษาสาธารณะ' },
        { title: 'โหมด TypeScript', text: 'โหมดที่สี่คือมุมมองแบบ typed สำหรับนักพัฒนา เพื่อให้ทีมผลิตภัณฑ์และทีมวิศวกรรมเห็นโครงสร้างเดียวกัน' },
      ],
    },
    typescript: {
      title: 'ตัวอย่างแบบมีชนิดข้อมูล',
      desc: 'ภาพรวมของระเบียนที่เลือกในรูปแบบที่นักพัฒนาอ่านได้',
    },
    notifications: {
      loaded: 'โหลดตัวแก้ไขจากฐานข้อมูลภายในเครื่องแล้ว',
      caseSaved: 'บันทึกระเบียนโครงการแล้ว',
      historySaved: 'บันทึกรายการไทม์ไลน์แล้ว',
      caseDeleted: 'ลบระเบียนโครงการแล้ว',
      historyDeleted: 'ลบรายการไทม์ไลน์แล้ว',
      loadFailed: 'ไม่สามารถโหลดข้อมูลตัวแก้ไขจาก API ภายในเครื่องได้',
    },
  },
  zh: {
    hero: {
      kicker: '证据控制台',
      title: '现在可以修改证据，而不必直接改页面代码',
      desc: '这个本地工作台会更新公开 Evidence 区块背后的记录。当前公开页面仍以英文为主，泰文和中文会先存入数据库，供下一阶段多语言发布使用。',
      openSite: '打开公开页面',
    },
    overview: {
      kicker: '当前状态',
      title: '证据数据层已经上线，而且可以直接编辑',
      desc: '这些数字来自本地数据库，不是写死在页面里的文案。',
      pageviews: '已记录访问量',
      caseStudies: '项目证明档案',
      caseStudiesMeta: '公开页面可读取的记录数',
      timeline: '时间线记录',
      pageviewsMeta: '最近一次访问',
      timelineMeta: '证据层中的公开里程碑',
    },
    case: {
      kicker: '项目证明',
      title: '案例记录',
      desc: '选择一个项目，更新事实内容，公开 Evidence 区块就会读取新的记录。',
      labels: {
        badge: '标签',
        slug: 'Slug',
        order: '显示顺序',
        client: '服务对象',
        location: '地点',
        sector: '工作类型',
        linkUrl: '线上链接',
        linkLabel: '英文链接文字',
        metrics: '结果指标',
        metricsHelp: '每行一个指标，格式为: value | label',
        title: '标题',
        deploymentWindow: '交付内容',
        decisionSurface: '支持了什么决策',
        summary: '为什么重要',
        note: '操作备注',
      },
      locale: {
        en: { title: '英文内容', hint: '公开页面当前使用这组英文内容' },
        th: { title: '泰文内容', hint: '泰文内容现在会被存储，供下一阶段公开多语言切换使用' },
        zh: { title: '中文内容', hint: '中文内容现在会被存储，供下一阶段公开多语言切换使用' },
        ts: { title: 'TypeScript 预览', hint: '该模式为只读开发视图。请切回英文、泰文或中文进行编辑。' },
      },
      empty: '还没有项目记录',
      newItem: '新的项目记录',
      deleteConfirm: '确定删除这条项目记录吗？',
    },
    history: {
      kicker: '项目时间线',
      title: '公开历史记录',
      desc: '这里说明证据来自哪里，以及工作在何时进入公开记录。',
      labels: {
        order: '显示顺序',
        location: '地点',
        url: '来源链接',
        source: '来源',
        title: '标题',
        summary: '摘要',
        category: '类别',
        eventPeriod: '时间段',
      },
      locale: {
        en: { title: '英文内容', hint: '公开时间线当前使用这组英文内容' },
        th: { title: '泰文内容', hint: '泰文内容现在会被存储，供下一阶段公开多语言切换使用' },
        zh: { title: '中文内容', hint: '中文内容现在会被存储，供下一阶段公开多语言切换使用' },
        ts: { title: 'TypeScript 预览', hint: '该模式为只读开发视图。请切回英文、泰文或中文进行编辑。' },
      },
      empty: '还没有时间线记录',
      newItem: '新的时间线记录',
      deleteConfirm: '确定删除这条时间线记录吗？',
    },
    locale: { kicker: '语言层' },
    actions: {
      newCase: '新建项目记录',
      newHistory: '新建时间线记录',
      save: '保存修改',
      deleteCase: '删除项目',
      deleteHistory: '删除时间线',
    },
    guide: {
      kicker: '操作说明',
      title: '它是如何工作的',
      desc: '这个编辑器修改的是数据库记录，而不是首页的静态 markup。英文现在就会上线，泰文和中文会先存储，供下一轮公开多语言发布使用。',
      items: [
        { title: '公开页面', text: '首页目前默认读取英文字段，所以修改英文会立刻反映到公开页面。' },
        { title: '泰文与中文', text: '这两种翻译已经会跟随每条记录一起保存，即使公开页面还没有切换器。' },
        { title: 'TypeScript 模式', text: '第四种模式是给开发者看的 typed 预览，让产品和工程可以对着同一份数据结构工作。' },
      ],
    },
    typescript: {
      title: '带类型预览',
      desc: '以开发者更容易阅读的方式展示当前选中记录',
    },
    notifications: {
      loaded: '编辑器已从本地证据数据库加载完成',
      caseSaved: '项目记录已保存',
      historySaved: '时间线记录已保存',
      caseDeleted: '项目记录已删除',
      historyDeleted: '时间线记录已删除',
      loadFailed: '无法从本地 API 服务器加载编辑器数据',
    },
  },
  ts: {
    hero: {
      kicker: 'Evidence Schema Console',
      title: 'Edit records, store translations, inspect the typed shape.',
      desc: 'This view keeps the same operator workflow, but frames the data for developers. English is the live public source. Thai and Chinese are stored beside it as structured translations.',
      openSite: 'Open public site',
    },
    overview: {
      kicker: 'Runtime state',
      title: 'Local evidence records are live.',
      desc: 'These counters are hydrated from SQLite through the local API server.',
      pageviews: 'Recorded visits',
      caseStudies: 'Case-study records',
      caseStudiesMeta: 'Public evidence records currently available.',
      timeline: 'Timeline records',
      pageviewsMeta: 'Latest write',
      timelineMeta: 'Persisted public milestones.',
    },
    case: {
      kicker: 'caseStudyProof[]',
      title: 'Project proof records',
      desc: 'Use the form to mutate the English source of truth and store Thai/Chinese translations alongside it.',
      labels: {
        badge: 'badge',
        slug: 'slug',
        order: 'proofOrder',
        client: 'client',
        location: 'location',
        sector: 'sector',
        linkUrl: 'linkUrl',
        linkLabel: 'linkLabel (en)',
        metrics: 'metrics[]',
        metricsHelp: 'One line per metric: value | label',
        title: 'title',
        deploymentWindow: 'deploymentWindow',
        decisionSurface: 'decisionSurface',
        summary: 'summary',
        note: 'note',
      },
      locale: {
        en: { title: 'English source fields', hint: 'These top-level values are what the public site consumes today.' },
        th: { title: 'translations.th', hint: 'Thai strings are stored as nested translation values.' },
        zh: { title: 'translations.zh', hint: 'Chinese strings are stored as nested translation values.' },
        ts: { title: 'TypeScript preview', hint: 'Read-only developer view. Use another locale mode to change string values.' },
      },
      empty: 'No case-study records available.',
      newItem: 'newCaseStudyRecord()',
      deleteConfirm: 'Delete this case study record?',
    },
    history: {
      kicker: 'contentHistory[]',
      title: 'Timeline records',
      desc: 'These records back the public timeline block and now carry multilingual content fields.',
      labels: {
        order: 'historyOrder',
        location: 'location',
        url: 'url',
        source: 'source',
        title: 'title',
        summary: 'summary',
        category: 'category',
        eventPeriod: 'eventPeriod',
      },
      locale: {
        en: { title: 'English source fields', hint: 'These top-level values are what the public site consumes today.' },
        th: { title: 'translations.th', hint: 'Thai strings are stored as nested translation values.' },
        zh: { title: 'translations.zh', hint: 'Chinese strings are stored as nested translation values.' },
        ts: { title: 'TypeScript preview', hint: 'Read-only developer view. Use another locale mode to change string values.' },
      },
      empty: 'No timeline records available.',
      newItem: 'newTimelineRecord()',
      deleteConfirm: 'Delete this timeline record?',
    },
    locale: { kicker: 'Content locale' },
    actions: {
      newCase: 'New case-study record',
      newHistory: 'New timeline record',
      save: 'Persist changes',
      deleteCase: 'Delete case-study',
      deleteHistory: 'Delete timeline record',
    },
    guide: {
      kicker: 'Operator notes',
      title: 'What this editor now does',
      desc: 'The admin tool writes to the database, stores multilingual text by record, and surfaces the exact typed structure that frontend and backend now share.',
      items: [
        { title: 'English source of truth', text: 'Top-level fields stay live and public right away.' },
        { title: 'Structured translations', text: 'Thai and Chinese variants sit under translations.th and translations.zh for each record.' },
        { title: 'Shared record shape', text: 'TypeScript mode exposes the current object structure so the content and code layers stay aligned.' },
      ],
    },
    typescript: {
      title: 'Typed preview',
      desc: 'Generated from the selected draft records and the current UI mode.',
    },
    notifications: {
      loaded: 'Editor loaded from the local evidence database.',
      caseSaved: 'Case-study record saved.',
      historySaved: 'Timeline record saved.',
      caseDeleted: 'Case-study record deleted.',
      historyDeleted: 'Timeline record deleted.',
      loadFailed: 'Could not load the editor data from the local API server.',
    },
  },
};

const caseLocaleFields = ['title', 'deploymentWindow', 'decisionSurface', 'summary', 'note', 'linkLabel'];
const historyLocaleFields = ['source', 'title', 'summary', 'category', 'eventPeriod'];

const state = {
  activeLocale: /** @type {UiLocale} */ ('en'),
  caseStudies: /** @type {CaseStudyRecord[]} */ ([]),
  contentHistory: /** @type {HistoryRecord[]} */ ([]),
  selectedCaseStudyId: /** @type {number | null} */ (null),
  selectedHistoryId: /** @type {number | null} */ (null),
  caseDraft: /** @type {CaseStudyRecord} */ (createEmptyCaseStudy()),
  historyDraft: /** @type {HistoryRecord} */ (createEmptyHistory()),
  lastAnalytics: null,
};

const refs = {
  localeSwitch: document.getElementById('localeSwitch'),
  globalBanner: document.getElementById('globalBanner'),
  caseStudyList: document.getElementById('caseStudyList'),
  historyList: document.getElementById('historyList'),
  caseStudyForm: /** @type {HTMLFormElement | null} */ (document.getElementById('caseStudyForm')),
  historyForm: /** @type {HTMLFormElement | null} */ (document.getElementById('historyForm')),
  caseLocaleFields: document.getElementById('caseLocaleFields'),
  historyLocaleFields: document.getElementById('historyLocaleFields'),
  caseLocaleTitle: document.getElementById('caseLocaleTitle'),
  caseLocaleHint: document.getElementById('caseLocaleHint'),
  historyLocaleTitle: document.getElementById('historyLocaleTitle'),
  historyLocaleHint: document.getElementById('historyLocaleHint'),
  typescriptPreview: document.getElementById('typescriptPreview'),
  guideCopy: document.getElementById('guideCopy'),
};

const formFields = {
  case: {
    badge: /** @type {HTMLInputElement | null} */ (document.getElementById('caseBadge')),
    slug: /** @type {HTMLInputElement | null} */ (document.getElementById('caseSlug')),
    proofOrder: /** @type {HTMLInputElement | null} */ (document.getElementById('caseProofOrder')),
    client: /** @type {HTMLInputElement | null} */ (document.getElementById('caseClient')),
    location: /** @type {HTMLInputElement | null} */ (document.getElementById('caseLocation')),
    sector: /** @type {HTMLInputElement | null} */ (document.getElementById('caseSector')),
    linkUrl: /** @type {HTMLInputElement | null} */ (document.getElementById('caseLinkUrl')),
    metrics: /** @type {HTMLTextAreaElement | null} */ (document.getElementById('caseMetrics')),
  },
  history: {
    historyOrder: /** @type {HTMLInputElement | null} */ (document.getElementById('historyOrder')),
    location: /** @type {HTMLInputElement | null} */ (document.getElementById('historyLocation')),
    url: /** @type {HTMLInputElement | null} */ (document.getElementById('historyUrl')),
  },
};

init();

function init() {
  bindLocaleSwitch();
  bindActions();
  loadBootstrap();
}

function bindLocaleSwitch() {
  if (!refs.localeSwitch) return;

  refs.localeSwitch.addEventListener('click', (event) => {
    const button = /** @type {HTMLElement | null} */ (event.target instanceof HTMLElement ? event.target.closest('[data-locale]') : null);
    if (!button) return;

    persistDrafts();
    state.activeLocale = /** @type {UiLocale} */ (button.dataset.locale || 'en');
    render();
  });
}

function bindActions() {
  document.getElementById('newCaseStudyBtn')?.addEventListener('click', () => {
    persistDrafts();
    state.selectedCaseStudyId = null;
    state.caseDraft = createEmptyCaseStudy(state.caseStudies.length);
    render();
  });

  document.getElementById('newHistoryBtn')?.addEventListener('click', () => {
    persistDrafts();
    state.selectedHistoryId = null;
    state.historyDraft = createEmptyHistory(state.contentHistory.length);
    render();
  });

  refs.caseStudyForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    await saveCaseStudy();
  });

  refs.historyForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    await saveHistory();
  });

  document.getElementById('deleteCaseStudyBtn')?.addEventListener('click', async () => {
    await deleteCaseStudy();
  });

  document.getElementById('deleteHistoryBtn')?.addEventListener('click', async () => {
    await deleteHistory();
  });
}

async function loadBootstrap() {
  try {
    const response = await fetch('/api/admin/bootstrap', {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Bootstrap request failed.');
    }

    const payload = await response.json();
    state.caseStudies = Array.isArray(payload.caseStudies) ? payload.caseStudies : [];
    state.contentHistory = Array.isArray(payload.contentHistory) ? payload.contentHistory : [];

    state.selectedCaseStudyId = state.caseStudies[0]?.id ?? null;
    state.selectedHistoryId = state.contentHistory[0]?.id ?? null;
    state.caseDraft = cloneRecord(state.caseStudies[0] || createEmptyCaseStudy(state.caseStudies.length));
    state.historyDraft = cloneRecord(state.contentHistory[0] || createEmptyHistory(state.contentHistory.length));

    render(payload.analytics || null);
    showBanner(currentCopy().notifications.loaded, 'success');
  } catch (error) {
    render(null);
    showBanner(currentCopy().notifications.loadFailed, 'error');
  }
}

function render(analytics = null) {
  syncLocaleButtons();
  renderStaticCopy();
  renderOverview(analytics);
  renderCaseStudyList();
  renderHistoryList();
  renderCaseForm();
  renderHistoryForm();
  renderGuide();
  renderTypeScriptPreview(analytics);
}

function renderStaticCopy() {
  const copy = currentCopy();

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.getAttribute('data-i18n');
    if (!key) return;
    const value = getCopyValue(copy, key);
    if (typeof value === 'string') {
      node.textContent = value;
    }
  });

  setText('caseBadgeLabel', copy.case.labels.badge);
  setText('caseSlugLabel', copy.case.labels.slug);
  setText('caseOrderLabel', copy.case.labels.order);
  setText('caseClientLabel', copy.case.labels.client);
  setText('caseLocationLabel', copy.case.labels.location);
  setText('caseSectorLabel', copy.case.labels.sector);
  setText('caseLinkUrlLabel', copy.case.labels.linkUrl);
  setText('caseMetricsLabel', copy.case.labels.metrics);
  setText('caseMetricsHelp', copy.case.labels.metricsHelp);
  setText('historyOrderLabel', copy.history.labels.order);
  setText('historyLocationLabel', copy.history.labels.location);
  setText('historyUrlLabel', copy.history.labels.url);
}

function renderOverview(analytics) {
  const pageviews = analytics?.totalPageviews ?? state.lastAnalytics?.totalPageviews ?? 0;
  const caseStudies = analytics?.caseStudyCount ?? state.caseStudies.length;
  const timeline = analytics?.contentHistoryCount ?? state.contentHistory.length;

  state.lastAnalytics = analytics || state.lastAnalytics || {
    totalPageviews: pageviews,
    latestPageviewAt: null,
    caseStudyCount: caseStudies,
    contentHistoryCount: timeline,
  };

  setText('statPageviews', numberFormat(pageviews));
  setText('statCaseStudies', numberFormat(caseStudies));
  setText('statTimeline', numberFormat(timeline));

  const copy = currentCopy();
  const latestVisit = state.lastAnalytics.latestPageviewAt
    ? `${copy.overview.pageviewsMeta}: ${formatTimestamp(state.lastAnalytics.latestPageviewAt)}`
    : copy.overview.caseStudiesMeta;

  setText('statPageviewsMeta', latestVisit);
  setText('statTimelineMeta', copy.overview.timelineMeta);
}

function renderCaseStudyList() {
  if (!refs.caseStudyList) return;
  const locale = localeForContent();
  const copy = currentCopy();

  if (state.caseStudies.length === 0) {
    refs.caseStudyList.innerHTML = `<div class="record-empty">${escapeHtml(copy.case.empty)}</div>`;
    return;
  }

  refs.caseStudyList.innerHTML = state.caseStudies.map((item) => {
    const title = localizedValue(item, 'title', locale) || item.title || copy.case.newItem;
    const meta = item.client || item.location || item.slug || '—';
    const activeClass = item.id === state.selectedCaseStudyId ? ' is-active' : '';

    return `
      <button type="button" class="record-item${activeClass}" data-case-id="${item.id}">
        <div class="record-title-row">
          <strong class="record-title">${escapeHtml(title)}</strong>
          <span class="record-tag">${escapeHtml(item.badge || 'CASE')}</span>
        </div>
        <div class="record-meta-row">
          <span class="record-meta">${escapeHtml(meta)}</span>
          <span class="record-meta">#${escapeHtml(String(item.proofOrder ?? 0))}</span>
        </div>
      </button>
    `;
  }).join('');

  refs.caseStudyList.querySelectorAll('[data-case-id]').forEach((button) => {
    button.addEventListener('click', () => {
      persistCaseDraft();
      const id = Number(button.getAttribute('data-case-id'));
      const selected = state.caseStudies.find((item) => item.id === id);
      if (!selected) return;
      state.selectedCaseStudyId = id;
      state.caseDraft = cloneRecord(selected);
      render();
    });
  });
}

function renderHistoryList() {
  if (!refs.historyList) return;
  const locale = localeForContent();
  const copy = currentCopy();

  if (state.contentHistory.length === 0) {
    refs.historyList.innerHTML = `<div class="record-empty">${escapeHtml(copy.history.empty)}</div>`;
    return;
  }

  refs.historyList.innerHTML = state.contentHistory.map((item) => {
    const title = localizedValue(item, 'title', locale) || item.title || copy.history.newItem;
    const meta = item.eventPeriod || item.category || '—';
    const activeClass = item.id === state.selectedHistoryId ? ' is-active' : '';

    return `
      <button type="button" class="record-item${activeClass}" data-history-id="${item.id}">
        <div class="record-title-row">
          <strong class="record-title">${escapeHtml(title)}</strong>
          <span class="record-tag">${escapeHtml(item.category || 'LOG')}</span>
        </div>
        <div class="record-meta-row">
          <span class="record-meta">${escapeHtml(meta)}</span>
          <span class="record-meta">#${escapeHtml(String(item.historyOrder ?? 0))}</span>
        </div>
      </button>
    `;
  }).join('');

  refs.historyList.querySelectorAll('[data-history-id]').forEach((button) => {
    button.addEventListener('click', () => {
      persistHistoryDraft();
      const id = Number(button.getAttribute('data-history-id'));
      const selected = state.contentHistory.find((item) => item.id === id);
      if (!selected) return;
      state.selectedHistoryId = id;
      state.historyDraft = cloneRecord(selected);
      render();
    });
  });
}

function renderCaseForm() {
  const draft = state.caseDraft;
  const copy = currentCopy();

  setInputValue(formFields.case.badge, draft.badge);
  setInputValue(formFields.case.slug, draft.slug);
  setInputValue(formFields.case.proofOrder, String(draft.proofOrder ?? 0));
  setInputValue(formFields.case.client, draft.client);
  setInputValue(formFields.case.location, draft.location);
  setInputValue(formFields.case.sector, draft.sector);
  setInputValue(formFields.case.linkUrl, draft.linkUrl);
  setTextAreaValue(formFields.case.metrics, metricsToText(draft.metrics));

  const localeMeta = copy.case.locale[state.activeLocale];
  if (refs.caseLocaleTitle) refs.caseLocaleTitle.textContent = localeMeta.title;
  if (refs.caseLocaleHint) refs.caseLocaleHint.textContent = localeMeta.hint;

  if (!refs.caseLocaleFields) return;
  if (state.activeLocale === 'ts') {
    refs.caseLocaleFields.innerHTML = `
      <div class="record-empty">${escapeHtml(copy.case.locale.ts.hint)}</div>
      <pre class="typescript-preview">${escapeHtml(typeScriptPreviewForCase(draft))}</pre>
    `;
    return;
  }

  const locale = localeForContent();
  const values = locale === 'en' ? draft : (draft.translations[locale] || {});

  refs.caseLocaleFields.innerHTML = caseLocaleFields.map((field) => {
    const fieldType = field === 'summary' || field === 'note' || field === 'decisionSurface' ? 'textarea' : 'input';
    const label = copy.case.labels[field];
    const value = values[field] || '';

    if (fieldType === 'textarea') {
      return `
        <label class="field">
          <span>${escapeHtml(label)}</span>
          <textarea data-case-locale-field="${field}" rows="${field === 'summary' ? '4' : '3'}">${escapeHtml(value)}</textarea>
        </label>
      `;
    }

    return `
      <label class="field">
        <span>${escapeHtml(label)}</span>
        <input data-case-locale-field="${field}" type="text" value="${escapeHtml(value)}" autocomplete="off">
      </label>
    `;
  }).join('');
}

function renderHistoryForm() {
  const draft = state.historyDraft;
  const copy = currentCopy();

  setInputValue(formFields.history.historyOrder, String(draft.historyOrder ?? 0));
  setInputValue(formFields.history.location, draft.location);
  setInputValue(formFields.history.url, draft.url);

  const localeMeta = copy.history.locale[state.activeLocale];
  if (refs.historyLocaleTitle) refs.historyLocaleTitle.textContent = localeMeta.title;
  if (refs.historyLocaleHint) refs.historyLocaleHint.textContent = localeMeta.hint;

  if (!refs.historyLocaleFields) return;
  if (state.activeLocale === 'ts') {
    refs.historyLocaleFields.innerHTML = `
      <div class="record-empty">${escapeHtml(copy.history.locale.ts.hint)}</div>
      <pre class="typescript-preview">${escapeHtml(typeScriptPreviewForHistory(draft))}</pre>
    `;
    return;
  }

  const locale = localeForContent();
  const values = locale === 'en' ? draft : (draft.translations[locale] || {});

  refs.historyLocaleFields.innerHTML = historyLocaleFields.map((field) => {
    const fieldType = field === 'summary' ? 'textarea' : 'input';
    const label = copy.history.labels[field];
    const value = values[field] || '';

    if (fieldType === 'textarea') {
      return `
        <label class="field">
          <span>${escapeHtml(label)}</span>
          <textarea data-history-locale-field="${field}" rows="4">${escapeHtml(value)}</textarea>
        </label>
      `;
    }

    return `
      <label class="field">
        <span>${escapeHtml(label)}</span>
        <input data-history-locale-field="${field}" type="text" value="${escapeHtml(value)}" autocomplete="off">
      </label>
    `;
  }).join('');
}

function renderGuide() {
  if (!refs.guideCopy) return;
  const copy = currentCopy();

  refs.guideCopy.innerHTML = copy.guide.items.map((item) => `
    <div class="guide-row">
      <strong>${escapeHtml(item.title)}</strong>
      <span>${escapeHtml(item.text)}</span>
    </div>
  `).join('');
}

function renderTypeScriptPreview(analytics) {
  if (!refs.typescriptPreview) return;

  const snapshot = {
    uiMode: state.activeLocale,
    contentLocale: state.activeLocale === 'ts' ? 'en' : state.activeLocale,
    analytics: analytics || state.lastAnalytics || {},
    selectedCaseStudy: state.caseDraft,
    selectedTimelineEntry: state.historyDraft,
  };

  refs.typescriptPreview.textContent = [
    `type SupportedContentLocale = 'en' | 'th' | 'zh';`,
    `type UiMode = SupportedContentLocale | 'ts';`,
    '',
    `const editorSnapshot = ${JSON.stringify(snapshot, null, 2)} as const;`,
  ].join('\n');
}

function persistDrafts() {
  persistCaseDraft();
  persistHistoryDraft();
}

function persistCaseDraft() {
  if (!state.caseDraft) return;

  state.caseDraft.badge = formFields.case.badge?.value.trim() || '';
  state.caseDraft.slug = formFields.case.slug?.value.trim() || '';
  state.caseDraft.proofOrder = Number.parseInt(formFields.case.proofOrder?.value || '0', 10) || 0;
  state.caseDraft.client = formFields.case.client?.value.trim() || '';
  state.caseDraft.location = formFields.case.location?.value.trim() || '';
  state.caseDraft.sector = formFields.case.sector?.value.trim() || '';
  state.caseDraft.linkUrl = formFields.case.linkUrl?.value.trim() || '';
  state.caseDraft.metrics = parseMetrics(formFields.case.metrics?.value || '');

  if (state.activeLocale === 'ts') return;

  const locale = localeForContent();
  const fields = {};
  document.querySelectorAll('[data-case-locale-field]').forEach((element) => {
    const key = element.getAttribute('data-case-locale-field');
    if (!key) return;
    const value = /** @type {HTMLInputElement | HTMLTextAreaElement} */ (element).value.trim();
    fields[key] = value;
  });

  if (locale === 'en') {
    caseLocaleFields.forEach((field) => {
      state.caseDraft[field] = fields[field] || '';
    });
  } else {
    state.caseDraft.translations[locale] = /** @type {Record<string, string>} */ ({});
    caseLocaleFields.forEach((field) => {
      const value = fields[field] || '';
      if (value) {
        state.caseDraft.translations[locale][field] = value;
      }
    });
  }
}

function persistHistoryDraft() {
  if (!state.historyDraft) return;

  state.historyDraft.historyOrder = Number.parseInt(formFields.history.historyOrder?.value || '0', 10) || 0;
  state.historyDraft.location = formFields.history.location?.value.trim() || '';
  state.historyDraft.url = formFields.history.url?.value.trim() || '';

  if (state.activeLocale === 'ts') return;

  const locale = localeForContent();
  const fields = {};
  document.querySelectorAll('[data-history-locale-field]').forEach((element) => {
    const key = element.getAttribute('data-history-locale-field');
    if (!key) return;
    const value = /** @type {HTMLInputElement | HTMLTextAreaElement} */ (element).value.trim();
    fields[key] = value;
  });

  if (locale === 'en') {
    historyLocaleFields.forEach((field) => {
      state.historyDraft[field] = fields[field] || '';
    });
  } else {
    state.historyDraft.translations[locale] = /** @type {Record<string, string>} */ ({});
    historyLocaleFields.forEach((field) => {
      const value = fields[field] || '';
      if (value) {
        state.historyDraft.translations[locale][field] = value;
      }
    });
  }
}

async function saveCaseStudy() {
  persistCaseDraft();

  const payload = {
    slug: state.caseDraft.slug,
    badge: state.caseDraft.badge,
    title: state.caseDraft.title,
    location: state.caseDraft.location,
    client: state.caseDraft.client,
    sector: state.caseDraft.sector,
    deploymentWindow: state.caseDraft.deploymentWindow,
    decisionSurface: state.caseDraft.decisionSurface,
    summary: state.caseDraft.summary,
    note: state.caseDraft.note,
    linkLabel: state.caseDraft.linkLabel,
    linkUrl: state.caseDraft.linkUrl,
    proofOrder: state.caseDraft.proofOrder,
    metrics: state.caseDraft.metrics,
    translations: state.caseDraft.translations,
  };

  const method = state.selectedCaseStudyId ? 'PUT' : 'POST';
  const url = state.selectedCaseStudyId
    ? `/api/admin/case-studies/${state.selectedCaseStudyId}`
    : '/api/admin/case-studies';

  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Unable to save case study.');
    }

    upsertCaseStudy(result.item);
    state.selectedCaseStudyId = result.item.id;
    state.caseDraft = cloneRecord(result.item);
    render();
    showBanner(currentCopy().notifications.caseSaved, 'success');
  } catch (error) {
    showBanner(error.message || 'Unable to save case study.', 'error');
  }
}

async function saveHistory() {
  persistHistoryDraft();

  const payload = {
    source: state.historyDraft.source,
    title: state.historyDraft.title,
    summary: state.historyDraft.summary,
    category: state.historyDraft.category,
    eventPeriod: state.historyDraft.eventPeriod,
    location: state.historyDraft.location,
    url: state.historyDraft.url,
    historyOrder: state.historyDraft.historyOrder,
    translations: state.historyDraft.translations,
    metadata: state.historyDraft.metadata || {},
  };

  const method = state.selectedHistoryId ? 'PUT' : 'POST';
  const url = state.selectedHistoryId
    ? `/api/admin/content-history/${state.selectedHistoryId}`
    : '/api/admin/content-history';

  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Unable to save timeline entry.');
    }

    upsertHistory(result.item);
    state.selectedHistoryId = result.item.id;
    state.historyDraft = cloneRecord(result.item);
    render();
    showBanner(currentCopy().notifications.historySaved, 'success');
  } catch (error) {
    showBanner(error.message || 'Unable to save timeline entry.', 'error');
  }
}

async function deleteCaseStudy() {
  if (!state.selectedCaseStudyId) return;
  if (!window.confirm(currentCopy().case.deleteConfirm)) return;

  try {
    const response = await fetch(`/api/admin/case-studies/${state.selectedCaseStudyId}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Unable to delete case study.');
    }

    state.caseStudies = state.caseStudies.filter((item) => item.id !== state.selectedCaseStudyId);
    state.selectedCaseStudyId = state.caseStudies[0]?.id ?? null;
    state.caseDraft = cloneRecord(state.caseStudies[0] || createEmptyCaseStudy(state.caseStudies.length));
    render();
    showBanner(currentCopy().notifications.caseDeleted, 'success');
  } catch (error) {
    showBanner(error.message || 'Unable to delete case study.', 'error');
  }
}

async function deleteHistory() {
  if (!state.selectedHistoryId) return;
  if (!window.confirm(currentCopy().history.deleteConfirm)) return;

  try {
    const response = await fetch(`/api/admin/content-history/${state.selectedHistoryId}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Unable to delete timeline entry.');
    }

    state.contentHistory = state.contentHistory.filter((item) => item.id !== state.selectedHistoryId);
    state.selectedHistoryId = state.contentHistory[0]?.id ?? null;
    state.historyDraft = cloneRecord(state.contentHistory[0] || createEmptyHistory(state.contentHistory.length));
    render();
    showBanner(currentCopy().notifications.historyDeleted, 'success');
  } catch (error) {
    showBanner(error.message || 'Unable to delete timeline entry.', 'error');
  }
}

function upsertCaseStudy(item) {
  const next = state.caseStudies.filter((entry) => entry.id !== item.id).concat([item]);
  state.caseStudies = next.sort((a, b) => (a.proofOrder ?? 0) - (b.proofOrder ?? 0) || (a.id ?? 0) - (b.id ?? 0));
}

function upsertHistory(item) {
  const next = state.contentHistory.filter((entry) => entry.id !== item.id).concat([item]);
  state.contentHistory = next.sort((a, b) => (a.historyOrder ?? 0) - (b.historyOrder ?? 0) || (a.id ?? 0) - (b.id ?? 0));
}

function currentCopy() {
  return uiCopy[state.activeLocale];
}

function localeForContent() {
  return /** @type {ContentLocale} */ (state.activeLocale === 'ts' ? 'en' : state.activeLocale);
}

function createEmptyCaseStudy(count = 0) {
  return {
    id: null,
    slug: '',
    badge: '',
    title: '',
    location: '',
    client: '',
    sector: '',
    deploymentWindow: '',
    decisionSurface: '',
    summary: '',
    note: '',
    linkLabel: '',
    linkUrl: '',
    proofOrder: count + 1,
    translations: {},
    metrics: [],
  };
}

function createEmptyHistory(count = 0) {
  return {
    id: null,
    source: '',
    title: '',
    summary: '',
    category: '',
    eventPeriod: '',
    location: '',
    url: '',
    historyOrder: count + 1,
    metadata: {},
    translations: {},
  };
}

function localizedValue(record, field, locale) {
  if (locale === 'en') {
    return record[field] || '';
  }

  return record.translations?.[locale]?.[field] || record[field] || '';
}

function metricsToText(metrics) {
  return (metrics || []).map((metric) => `${metric.value} | ${metric.label}`).join('\n');
}

function parseMetrics(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [value, ...labelParts] = line.split('|');
      return {
        value: (value || '').trim(),
        label: labelParts.join('|').trim(),
      };
    })
    .filter((metric) => metric.value && metric.label);
}

function showBanner(message, tone) {
  if (!refs.globalBanner) return;
  refs.globalBanner.hidden = false;
  refs.globalBanner.textContent = message;
  refs.globalBanner.classList.remove('is-error', 'is-success');
  refs.globalBanner.classList.add(tone === 'error' ? 'is-error' : 'is-success');
}

function syncLocaleButtons() {
  document.querySelectorAll('[data-locale]').forEach((button) => {
    button.classList.toggle('is-active', button.getAttribute('data-locale') === state.activeLocale);
  });
}

function getCopyValue(copy, key) {
  return key.split('.').reduce((value, segment) => (value ? value[segment] : undefined), copy);
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = value;
}

function setInputValue(input, value) {
  if (input) input.value = value;
}

function setTextAreaValue(textarea, value) {
  if (textarea) textarea.value = value;
}

function cloneRecord(record) {
  return JSON.parse(JSON.stringify(record));
}

function numberFormat(value) {
  return new Intl.NumberFormat('en-US').format(value || 0);
}

function formatTimestamp(timestamp) {
  try {
    const normalized = String(timestamp).includes('T')
      ? timestamp
      : String(timestamp).replace(' ', 'T') + 'Z';

    return new Intl.DateTimeFormat(state.activeLocale === 'ts' ? 'en-US' : state.activeLocale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(normalized));
  } catch {
    return String(timestamp);
  }
}

function typeScriptPreviewForCase(record) {
  return [
    `type CaseStudyTranslation = {`,
    `  title?: string;`,
    `  deploymentWindow?: string;`,
    `  decisionSurface?: string;`,
    `  summary?: string;`,
    `  note?: string;`,
    `  linkLabel?: string;`,
    `};`,
    ``,
    `const caseStudyRecord = ${JSON.stringify(record, null, 2)} as const;`,
  ].join('\n');
}

function typeScriptPreviewForHistory(record) {
  return [
    `type TimelineTranslation = {`,
    `  source?: string;`,
    `  title?: string;`,
    `  summary?: string;`,
    `  category?: string;`,
    `  eventPeriod?: string;`,
    `};`,
    ``,
    `const timelineRecord = ${JSON.stringify(record, null, 2)} as const;`,
  ].join('\n');
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[character]));
}
