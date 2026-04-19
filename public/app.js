/* ========================================
   AXIOM — Landing Page
   ======================================== */

// ── i18n ──────────────────────────────────────────────────────────

let activeLocale = 'en';

const uiCopy = {
  en: {
    nav: {
      systems: 'Systems',
      services: 'Services',
      launch: 'Launch',
      team: 'Team',
      cta: 'Partner With Us',
    },
    hero: {
      badge: 'All Systems Online',
      titleLine1: 'Innovation',
      subtitle: 'AI should feel like infrastructure, not theatre. We map the pressure, ship a working surface fast, and instrument it from day one so cities, governments, and operators can make fewer, clearer decisions under pressure.',
      cta: 'Start With the Pressure Map',
      ctaSecondary: 'See Live Systems',
      nodeLabel: 'Tap a live theatre',
      statSystems: 'Live Systems',
      statMonitoring: 'Live Monitoring',
      statCountries: 'Countries',
    },
    engagement: {
      tag: 'Operating Model',
      title: 'Start with the pressure, not the theatre.',
      desc: 'Taking the Non-Claude-Skills logic seriously means shipping first, using the data already on the table, and leaving a proof trail from the first deployment.',
      step1: {
        day: 'DAY 01-03',
        kicker: 'Find the real decision',
        title: 'Pressure map the problem.',
        desc: 'We identify the operating question, the real users, and the data that already exists so the first version solves something concrete instead of performing strategy theatre.',
        li1: 'Define one decision that must get faster or clearer',
        li2: 'Map current feeds, gaps, and who actually uses the output',
        li3: 'Cut anything decorative before it enters scope',
      },
      step2: {
        day: 'DAY 04-07',
        kicker: 'Ship before perfect',
        title: 'Put a working surface in the room.',
        desc: 'The first deliverable is a live view or pilot surface people can react to immediately. We prefer an ugly working system over a polished promise that teaches us nothing.',
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
      desc: 'No org chart cosplay. Two founders stay in the build. The network only shows up when the mission gets weird enough to deserve it.',
      foundersCaption: 'Two founders. No account managers standing in the middle of the work.',
      playbookLabel: 'How Axiom actually runs',
      playbookTitle: 'Lean core. Elastic network.',
      playbookText: 'We keep the core brutally small so decisions stay fast. When a project needs UAV feeds, traffic engineering, finance, or policy translation, we pull in the exact specialist instead of staffing a decorative army.',
      rule1: { label: 'Rule 01', title: 'No org-chart theatre', desc: 'You talk to builders, not handlers.' },
      rule2: { label: 'Rule 02', title: 'Founders stay hands-on', desc: 'Strategy and shipping happen in the same room.' },
      rule3: { label: 'Rule 03', title: 'Specialists join by mission', desc: 'Only when the brief truly needs them.' },
    },
    contact: {
      title: 'Ready to find<br>your axioms?',
      desc: 'If the problem matters and clarity matters, we should talk. We prefer partnership over vendor theatre.',
      commit1: 'Pressure mapped in week one',
      commit2: 'Working pilot before deck theatre',
      commit3: 'Data trail from day one',
      fieldName: 'Name',
      fieldEmail: 'Email',
      fieldMessage: 'Message',
      submit: 'Send Message',
    },
  },

  th: {
    nav: {
      systems: 'ระบบ',
      services: 'บริการ',
      launch: 'เปิดตัว',
      team: 'ทีม',
      cta: 'ร่วมเป็นพันธมิตร',
    },
    hero: {
      badge: 'ระบบทั้งหมดออนไลน์',
      titleLine1: 'นวัตกรรม',
      subtitle: 'AI ควรทำงานเหมือนโครงสร้างพื้นฐาน ไม่ใช่การแสดงละคร เราวิเคราะห์จุดกดดัน พัฒนาระบบที่ใช้งานได้จริงอย่างรวดเร็ว และวัดผลตั้งแต่วันแรก เพื่อให้เมือง รัฐบาล และผู้ปฏิบัติงานตัดสินใจได้ดีขึ้น',
      cta: 'เริ่มต้นด้วย Pressure Map',
      ctaSecondary: 'ดูระบบที่ใช้งานอยู่',
      nodeLabel: 'แตะเพื่อเลือกพื้นที่',
      statSystems: 'ระบบที่ใช้งาน',
      statMonitoring: 'ติดตามตลอดเวลา',
      statCountries: 'ประเทศ',
    },
    engagement: {
      tag: 'โมเดลการทำงาน',
      title: 'เริ่มจากแรงกดดัน ไม่ใช่การแสดง',
      desc: 'หลักการของเราคือส่งมอบก่อน ใช้ข้อมูลที่มีอยู่ และสร้างหลักฐานตั้งแต่การ deploy ครั้งแรก',
      step1: {
        day: 'วันที่ 01-03',
        kicker: 'ค้นหาการตัดสินใจที่แท้จริง',
        title: 'วิเคราะห์แผนที่แรงกดดัน',
        desc: 'เราระบุคำถามหลัก ผู้ใช้จริง และข้อมูลที่มีอยู่ เพื่อให้เวอร์ชันแรกแก้ปัญหาที่เป็นรูปธรรม',
        li1: 'กำหนดการตัดสินใจหนึ่งข้อที่ต้องเร็วขึ้นหรือชัดเจนขึ้น',
        li2: 'ทำแผนที่แหล่งข้อมูลและช่องว่างที่มีอยู่',
        li3: 'ตัดสิ่งที่ไม่จำเป็นออกก่อนเริ่มต้น',
      },
      step2: {
        day: 'วันที่ 04-07',
        kicker: 'ส่งมอบก่อนสมบูรณ์',
        title: 'นำ surface ที่ใช้งานได้เข้าห้อง',
        desc: 'สิ่งแรกที่ส่งมอบคือมุมมองที่ใช้งานได้จริงซึ่งผู้คนสามารถตอบสนองได้ทันที เราเลือกระบบที่ทำงานได้มากกว่าคำสัญญาที่สวยงาม',
        li1: 'ใช้ข้อมูลฟรีและที่มีอยู่ก่อนซื้อโครงสร้างพื้นฐานใหม่',
        li2: 'ตรวจสอบกับผู้ปฏิบัติงาน ไม่ใช่แค่ผู้สนับสนุน',
        li3: 'ให้ interface แสดง trade-off แทนที่จะซ่อน',
      },
      step3: {
        day: 'วันที่ 08-14',
        kicker: 'วัดสิ่งที่สำคัญ',
        title: 'เปลี่ยน pilot เป็นระบบที่ทำซ้ำได้',
        desc: 'ตั้งแต่การ deploy แรก เราติดตามสิ่งที่ถูกดู สิ่งที่เปลี่ยนพฤติกรรม และสิ่งที่ควรได้รับ backend ที่หนักกว่า',
        li1: 'เพิ่ม pageview เนื้อหา และสัญญาณการใช้งานตั้งแต่วันแรก',
        li2: 'เก็บบันทึกการตัดสินใจที่เปลี่ยนแปลงหลัง launch',
        li3: 'บันทึกระบบเพื่อให้นำไปใช้ซ้ำ ไม่ใช่สร้างใหม่',
      },
      proof: {
        label: 'สิ่งที่ส่งมอบแต่เนิ่นๆ',
        title: 'หลักฐาน ไม่ใช่ moodboard',
        text: 'บทเรียนสำคัญคือทุกโปรเจกต์ควรเริ่มด้วย evidence architecture: คำถามที่คมชัด surface ที่ใช้งานได้ และ data trail',
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
      desc: 'เราสร้างระบบที่ยังคงมีประโยชน์หลัง launch: สำหรับสัญญาณ การปฏิบัติงานในเมือง และการตัดสินใจสาธารณะ',
      introLabel: 'สามโหมดการทำงาน หนึ่ง playbook',
      introTitle: 'ห้องสงคราม ห้องเมือง เครื่องจัดอันดับ',
      introText: 'จำนวนสำคัญน้อยกว่ารูปแบบ ทุกระบบ Axiom เริ่มด้วยสรุปเดียวกัน: ค้นหาแรงกดดัน จำกัดการตัดสินใจ และแสดงการกระทำที่สำคัญจริงๆ',
    },
    capabilities: {
      tag: 'แกนหลัก Axiom Protocol',
      title: 'การออกแบบคือกระบวนการ<br>ความฉลาดคือผลิตภัณฑ์',
      desc: 'เราอยู่ระหว่างการวางผังเมือง AI governance และการส่งมอบ งานมีคุณค่าเชิงกลยุทธ์เฉพาะเมื่อรอดจากการ deploy',
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
      playbookText: 'เราเก็บแกนกลางให้เล็กเพื่อให้การตัดสินใจเร็ว เมื่อโปรเจกต์ต้องการผู้เชี่ยวชาญ เราดึงคนที่ตรงมาโดยตรง',
      rule1: { label: 'กฎข้อ 01', title: 'ไม่มีการแสดง org chart', desc: 'คุณคุยกับผู้สร้าง ไม่ใช่ตัวแทน' },
      rule2: { label: 'กฎข้อ 02', title: 'ผู้ก่อตั้งอยู่ในงานตลอด', desc: 'กลยุทธ์และการสร้างเกิดในห้องเดียวกัน' },
      rule3: { label: 'กฎข้อ 03', title: 'ผู้เชี่ยวชาญเข้าร่วมตามภารกิจ', desc: 'เฉพาะเมื่อ brief ต้องการจริงๆ' },
    },
    contact: {
      title: 'พร้อมค้นหา<br>axioms ของคุณ?',
      desc: 'ถ้าปัญหาสำคัญและความชัดเจนสำคัญ เราควรคุยกัน เราเลือกความเป็นพันธมิตรมากกว่าการแสดงของ vendor',
      commit1: 'วิเคราะห์แรงกดดันในสัปดาห์แรก',
      commit2: 'ระบบ pilot ที่ใช้งานได้ก่อนนำเสนอ',
      commit3: 'Data trail ตั้งแต่วันแรก',
      fieldName: 'ชื่อ',
      fieldEmail: 'อีเมล',
      fieldMessage: 'ข้อความ',
      submit: 'ส่งข้อความ',
    },
  },

  zh: {
    nav: {
      systems: '系统',
      services: '服务',
      launch: '发布',
      team: '团队',
      cta: '成为合作伙伴',
    },
    hero: {
      badge: '所有系统在线',
      titleLine1: '创新',
      subtitle: 'AI 应该像基础设施一样运作，而非舞台表演。我们绘制压力图，快速交付可运行的系统，并从第一天就量化成效，让城市、政府和运营商做出更少、更清晰的决策。',
      cta: '从压力图开始',
      ctaSecondary: '查看在线系统',
      nodeLabel: '点击选择区域',
      statSystems: '在线系统',
      statMonitoring: '全天候监控',
      statCountries: '国家',
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
    },
  },

  ts: {
    nav: {
      systems: 'type Systems',
      services: 'interface Services',
      launch: 'export Launch',
      team: 'class Team',
      cta: 'await partner()',
    },
    hero: {
      badge: '// status: ONLINE',
      titleLine1: 'Innovation',
      subtitle: '// AI should feel like infrastructure, not theatre\nconst axiom = new DecisionSystem({ pressure: true, theatre: false })',
      cta: 'pressureMap.start()',
      ctaSecondary: 'systems.getLive()',
      nodeLabel: '// select theatre',
      statSystems: 'LiveSystem[]',
      statMonitoring: 'readonly 24/7',
      statCountries: 'Country<T>',
    },
    engagement: {
      tag: '// OPERATING_MODEL',
      title: 'type Engagement = Pressure, not Theatre',
      desc: '/** @param pressure — real\n * @param theatre — false\n * @returns working_system */',
      step1: {
        day: 'Phase<01-03>',
        kicker: '// find real decision',
        title: 'pressureMap(problem: unknown): Decision',
        desc: 'const { question, users, data } = await identify(scope)\nreturn new WorkingVersion({ concrete: true, theatre: false })',
        li1: 'defineDecision(): void // one that must get faster',
        li2: 'mapFeeds(gaps: Gap[]): DataSource[]',
        li3: 'trim(decorative: Feature[]): void',
      },
      step2: {
        day: 'Phase<04-07>',
        kicker: '// ship before perfect',
        title: 'deploy(surface: WorkingSurface): void',
        desc: 'return uglier_working_system > prettier_polished_promise',
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
      desc: '// no org-chart cosplay\nconst founders = new Set(builders)\nnetwork.join(when: missionIsWeird)',
      foundersCaption: '// 2 founders, 0 account managers in the middle',
      playbookLabel: '// how Axiom actually runs',
      playbookTitle: 'core.size === "brutal small"\nnetwork.type === "elastic"',
      playbookText: 'if (project.needs(specialist)) pull(exact)\n// never staff(decorativeArmy)',
      rule1: { label: '// Rule<01>', title: 'no OrgChartTheatre', desc: 'talk to builders, not handlers' },
      rule2: { label: '// Rule<02>', title: 'founders.stayHandsOn()', desc: 'strategy && shipping in same room' },
      rule3: { label: '// Rule<03>', title: 'specialists.joinByMission()', desc: 'only when brief.needs(them)' },
    },
    contact: {
      title: 'ready to find()<br>your axioms?',
      desc: '// if problem.matters && clarity.matters\nawait talk()\n// prefer partnership over vendorTheatre',
      commit1: 'pressureMap: Week<1>',
      commit2: 'pilot.worksBefore(deck)',
      commit3: 'trail: DataFrom<Day1>',
      fieldName: 'name: string',
      fieldEmail: 'email: Email',
      fieldMessage: 'message: string',
      submit: 'send()',
    },
  },
};

function renderStaticCopy() {
  const copy = uiCopy[activeLocale] || uiCopy.en;

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.getAttribute('data-i18n');
    const value = key.split('.').reduce((obj, k) => obj?.[k], copy);
    if (typeof value === 'string') node.textContent = value;
  });

  document.querySelectorAll('[data-i18n-html]').forEach((node) => {
    const key = node.getAttribute('data-i18n-html');
    const value = key.split('.').reduce((obj, k) => obj?.[k], copy);
    if (typeof value === 'string') node.innerHTML = value;
  });

  document.querySelectorAll('[data-locale]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.locale === activeLocale);
  });
}

function bindLocaleSwitch() {
  ['localeSwitch', 'localeSwitchMobile'].forEach((id) => {
    document.getElementById(id)?.addEventListener('click', (e) => {
      const btn = e.target instanceof HTMLElement ? e.target.closest('[data-locale]') : null;
      if (!btn) return;
      activeLocale = btn.dataset.locale || 'en';
      renderStaticCopy();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderStaticCopy();
  bindLocaleSwitch();
});

const axiomMedia = {
  isReduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  isTouch: window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(hover: none)').matches,
  isMobile: window.matchMedia('(max-width: 768px)').matches,
};

function isEditableElement(element) {
  if (!element) return false;
  if (element.isContentEditable) return true;

  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName);
}


// ── Loading Screen ────────────────────────────────────────────────

(function initLoader() {
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loaderBar');
  if (!loader || !bar) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 30 + 15;
    if (progress > 95) progress = 95;
    bar.style.width = progress + '%';
  }, 80);

  window.addEventListener('load', () => {
    clearInterval(interval);
    bar.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('done');
      document.body.style.overflow = '';
    }, 200);
  });

  // Safety fallback — never block more than 800ms
  setTimeout(() => {
    clearInterval(interval);
    bar.style.width = '100%';
    loader.classList.add('done');
  }, 800);
})();


// Custom cursor removed


// ── System Health Monitor ─────────────────────────────────────────

(function initHealthMonitor() {
  const grid = document.getElementById('healthGrid');
  const uptimeEl = document.getElementById('healthUptime');
  const latEl = document.getElementById('healthAvgLat');
  const timestampEl = document.getElementById('healthTimestamp');
  if (!grid) return;

  const systems = [
    { name: 'Global Monitor', url: 'https://globalmonitor.fly.dev/' },
    { name: 'MEM Intelligence', url: 'https://nonarkara.github.io/mem-by-non/' },
    { name: 'War Monitor', url: 'https://middleeast-monitor.pages.dev/' },
    { name: 'Phuket Dashboard', url: 'https://nonarkara.github.io/phuket-dashboard/war-room' },
    { name: 'Phuket Smart Bus', url: 'https://nonarkara.github.io/phuket-smart-bus/' },
    { name: 'Smart City Thailand', url: 'https://nonarkara.github.io/smart-city-thailand-index/' },
    { name: 'MTT Monitor', url: 'https://nonarkara.github.io/smart-city-thailand-monitor/' },
    { name: 'SLIC Index', url: 'https://nonarkara.github.io/SLIC-Index/' },
    { name: 'Kuching IOC', url: 'https://nonarkara.github.io/kuching-ioc/' },
  ];

  // Render HUD cards
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
      await fetch(system.url, { mode: 'no-cors', cache: 'no-store' });
      const elapsed = Math.round(performance.now() - start);
      dot.className = 'health-dot up';
      ms.textContent = elapsed + 'ms';
      return elapsed;
    } catch (e) {
      dot.className = 'health-dot down';
      ms.textContent = 'FAIL';
      return null;
    }
  }

  async function runChecks() {
    const cards = grid.querySelectorAll('.health-card');
    const results = await Promise.all(
      systems.map((s, i) => checkSystem(s, cards[i]))
    );

    const upCount = results.filter(r => r !== null).length;
    const latencies = results.filter(r => r !== null);
    const avgLat = latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0;

    if (uptimeEl) uptimeEl.textContent = upCount + '/' + systems.length + ' RESPONDING';
    if (latEl) latEl.textContent = avgLat + 'ms';
    if (timestampEl) {
      const now = new Date();
      timestampEl.textContent = now.getUTCHours().toString().padStart(2, '0') + ':' +
                                now.getUTCMinutes().toString().padStart(2, '0') + ':' +
                                now.getUTCSeconds().toString().padStart(2, '0') + ' UTC';
    }
  }

  setTimeout(runChecks, 2000);
  setInterval(runChecks, 60000);
})();


// ── Scroll Parallax ───────────────────────────────────────────────

(function initParallax() {
  if (axiomMedia.isTouch || axiomMedia.isReduced) return;

  const layers = [
    { selector: '.section-header', rate: 0.04 },
    { selector: '.section-tag', rate: 0.02 },
    { selector: '.proof-photo', rate: 0.03 },
  ];

  const allEls = [];
  layers.forEach(layer => {
    document.querySelectorAll(layer.selector).forEach(el => {
      allEls.push({ el, rate: layer.rate });
    });
  });

  function update() {
    allEls.forEach(({ el, rate }) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (rect.top - window.innerHeight / 2) * rate;
        el.style.transform = `translateY(${offset}px)`;
      }
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


// ── Satellite Hero Map ──────────────────────────────────────────────

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

  const map = L.map(container, {
    center: [CITIES[0].lat, CITIES[0].lng],
    zoom: CITIES[0].zoom,
    zoomControl: false,
    attributionControl: false,
    dragging: true,
    scrollWheelZoom: false,
    doubleClickZoom: true,
    touchZoom: true,
    keyboard: true,
    boxZoom: true,
    fadeAnimation: !useLiteMotion,
    zoomAnimation: !useLiteMotion,
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

      if (isActive && shouldScroll && typeof button.scrollIntoView === 'function') {
        button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
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

  heroNodeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const city = CITIES.find((item) => item.key === button.dataset.city);
      if (!city) return;
      cityIndex = CITIES.findIndex((item) => item.key === city.key);
      pauseTour(true);
      syncCityDisplay(city, { shouldScroll: true });
      map.flyTo([city.lat, city.lng], city.zoom, {
        duration: useLiteMotion ? 5 : 8,
        easeLinearity: useLiteMotion ? 0.15 : 0.08,
      });
    });
  });

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


// ── Data Lines Canvas (overlay on satellite) ────────────────────────

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


// ── Navigation ─────────────────────────────────────────────────────

(function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  if (toggle && menu) {
    function openMenu() {
      menu.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
      const firstLink = menu.querySelector('a');
      if (firstLink) firstLink.focus();
      document.addEventListener('keydown', trapFocus);
    }

    function closeMenu() {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      document.removeEventListener('keydown', trapFocus);
      toggle.focus();
    }

    function trapFocus(e) {
      if (e.key === 'Escape') { closeMenu(); return; }
      if (e.key !== 'Tab') return;
      const focusable = menu.querySelectorAll('a, button');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }

    toggle.addEventListener('click', () => {
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && menu.classList.contains('open')) {
        closeMenu();
      }
    });
  }
})();


// ── Smooth anchor links ────────────────────────────────────────────

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
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
  }, { threshold: 0.1 });

  counters.forEach(c => observer.observe(c));
})();


// ── Scroll Reveal ──────────────────────────────────────────────────

(function initReveal() {
  const revealSelectors = [
    '.projects-intro',
    '.project-card',
    '.project-support-card',
    '.capability-card',
    '.metric-card',
    '.evidence-summary-card',
    '.evidence-history-card',
    '.section-header',
    '.team-stage',
    '.team-rule',
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


// ── Evidence Layer: Pageviews + Proof + History ───────────────────

(function initEvidenceLayer() {
  const pageviewsEl = document.getElementById('evidencePageviews');
  const pageviewsNoteEl = document.getElementById('evidencePageviewsNote');
  const last7DaysEl = document.getElementById('evidenceLast7Days');
  const caseFilesEl = document.getElementById('evidenceCaseFiles');
  const historyRecordsEl = document.getElementById('evidenceHistoryRecords');
  const topPageEl = document.getElementById('evidenceTopPage');
  const caseStudyMount = document.getElementById('caseStudyProofMount');
  const historyList = document.getElementById('contentHistoryList');
  const historyMeta = document.getElementById('contentHistoryMeta');

  if (!pageviewsEl || !caseStudyMount || !historyList) return;

  const numberFormatter = new Intl.NumberFormat('en-US');

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[char]));
  }

  function safeUrl(url) {
    if (typeof url !== 'string') return '';
    return /^https?:\/\//.test(url) ? url : '';
  }

  function formatTimestamp(timestamp) {
    if (!timestamp) return 'No visits recorded yet.';

    try {
      const normalizedTimestamp = String(timestamp).includes('T')
        ? timestamp
        : String(timestamp).replace(' ', 'T') + 'Z';

      return new Intl.DateTimeFormat(navigator.language || 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(normalizedTimestamp));
    } catch (error) {
      return timestamp;
    }
  }

  function renderSummary(analytics) {
    pageviewsEl.textContent = numberFormatter.format(analytics.totalPageviews || 0);
    last7DaysEl.textContent = numberFormatter.format(analytics.last7DaysPageviews || 0);
    if (caseFilesEl) caseFilesEl.textContent = numberFormatter.format(analytics.caseStudyCount || 0);
    if (historyRecordsEl) historyRecordsEl.textContent = numberFormatter.format(analytics.contentHistoryCount || 0);

    if (pageviewsNoteEl) {
      pageviewsNoteEl.textContent = analytics.latestPageviewAt
        ? 'Most recent visit: ' + formatTimestamp(analytics.latestPageviewAt)
        : 'No visits have been recorded yet.';
    }

    if (topPageEl) {
      if (analytics.topPageViews > 0) {
        topPageEl.textContent = `Most visited page: ${analytics.topPage} (${numberFormatter.format(analytics.topPageViews)} visits)`;
      } else {
        topPageEl.textContent = 'Most visited page: /';
      }
    }
  }

  function renderCaseStudies(caseStudies) {
    if (!caseStudies.length) {
      caseStudyMount.innerHTML = '<div class="evidence-loading">No project proof has been loaded yet.</div>';
      return;
    }

    caseStudyMount.innerHTML = caseStudies.map((study) => {
      const details = [
        { label: 'Who it was for', value: study.client },
        { label: 'Where', value: study.location },
        { label: 'Type of work', value: study.sector },
        { label: 'What was delivered', value: study.deploymentWindow },
        { label: 'What decisions it helped', value: study.decisionSurface },
        { label: 'Why it matters', value: study.summary },
      ];

      const detailMarkup = details.map((detail) => `
        <div class="case-detail">
          <span class="case-detail-label">${escapeHtml(detail.label)}</span>
          <span class="case-detail-value">${escapeHtml(detail.value)}</span>
        </div>
      `).join('');

      const resultsMarkup = (study.metrics || []).map((metric) => `
        <div class="case-result">
          <div class="case-result-value">${escapeHtml(metric.value)}</div>
          <div class="case-result-label">${escapeHtml(metric.label)}</div>
        </div>
      `).join('');

      const linkUrl = safeUrl(study.linkUrl);
      const linkMarkup = linkUrl
        ? ` <a href="${escapeHtml(linkUrl)}" target="_blank" rel="noopener">${escapeHtml(study.linkLabel || 'View live example')}</a>`
        : '';

      return `
        <article class="case-study">
          <div class="case-study-badge">${escapeHtml(study.badge)}</div>
          <h3 class="case-study-title">${escapeHtml(study.title)}</h3>
          <div class="case-study-content">
            <div class="case-study-details">${detailMarkup}</div>
            <div class="case-study-results">${resultsMarkup}</div>
          </div>
          <div class="case-study-note">${escapeHtml(study.note)}${linkMarkup}</div>
        </article>
      `;
    }).join('');
  }

  function renderContentHistory(items) {
    if (historyMeta) {
      historyMeta.textContent = items.length
        ? `${numberFormatter.format(items.length)} timeline entries`
        : 'No timeline entries yet';
    }

    if (!items.length) {
      historyList.innerHTML = '<div class="evidence-loading">No timeline entries have been loaded yet.</div>';
      return;
    }

    historyList.innerHTML = items.map((item) => {
      const linkUrl = safeUrl(item.url);
      const linkMarkup = linkUrl
        ? `<a href="${escapeHtml(linkUrl)}" target="_blank" rel="noopener" class="evidence-history-link">View source</a>`
        : '';

      return `
        <article class="evidence-history-item">
          <div class="evidence-history-top">
            <span class="evidence-history-period">${escapeHtml(item.eventPeriod)}</span>
            <span class="evidence-history-pill">${escapeHtml(item.category)}</span>
          </div>
          <h3 class="evidence-history-title">${escapeHtml(item.title)}</h3>
          <p class="evidence-history-summary">${escapeHtml(item.summary)}</p>
          <div class="evidence-history-foot">
            <span class="evidence-history-source">${escapeHtml(item.source)}${item.location ? ' · ' + escapeHtml(item.location) : ''}</span>
            ${linkMarkup}
          </div>
        </article>
      `;
    }).join('');
  }

  async function trackPageview() {
    const payload = {
      path: window.location.pathname || '/',
      referrer: document.referrer || null,
      language: navigator.language || null,
    };

    try {
      await fetch('/api/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } catch (error) {
      // Quietly fail — analytics should never block the experience.
    }
  }

  async function loadEvidence() {
    const response = await fetch('/api/evidence', {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Unable to load evidence layer.');
    }

    return response.json();
  }

  async function init() {
    await trackPageview();
    const evidence = await loadEvidence();
    renderSummary(evidence.analytics || {});
    renderCaseStudies(evidence.caseStudies || []);
    renderContentHistory(evidence.contentHistory || []);
  }

  init().catch(() => {
    const evidenceSection = document.getElementById('evidence');
    if (evidenceSection) evidenceSection.style.display = 'none';
  });
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

// ── Screenshot Lightbox ───────────────────────────────────────────

(function initImageLightbox() {
  const overlay = document.getElementById('imageLightbox');
  const image = document.getElementById('imageLightboxImg');
  const closeBtn = document.getElementById('imageLightboxClose');
  const titleEl = document.getElementById('imageLightboxTitle');
  const kickerEl = document.getElementById('imageLightboxKicker');
  const copyEl = document.getElementById('imageLightboxCopy');
  const triggers = document.querySelectorAll('.lightbox-trigger');
  if (!overlay || !image || !closeBtn || !titleEl || !kickerEl || !copyEl || !triggers.length) return;

  let lastTrigger = null;

  function extractLightboxContent(trigger) {
    const imageEl = trigger.querySelector('img');
    return {
      src: imageEl?.getAttribute('src') || '',
      alt: imageEl?.getAttribute('alt') || '',
      kicker: trigger.querySelector('.photo-node-label, .interface-atlas-kicker, .interface-card-step')?.textContent?.trim() || '',
      title: trigger.querySelector('.interface-atlas-title, .interface-card h3')?.textContent?.trim() || imageEl?.getAttribute('alt') || 'Screenshot preview',
      copy: trigger.querySelector('.interface-atlas-text, .interface-card p')?.textContent?.trim() || '',
    };
  }

  function openLightbox(trigger) {
    const content = extractLightboxContent(trigger);
    if (!content.src) return;

    lastTrigger = trigger;
    image.src = content.src;
    image.alt = content.alt;
    kickerEl.textContent = content.kicker;
    titleEl.textContent = content.title;
    copyEl.textContent = content.copy;
    copyEl.hidden = !content.copy;
    kickerEl.hidden = !content.kicker;

    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    closeBtn.focus();
  }

  function closeLightbox() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    image.src = '';
    image.alt = '';
    document.body.classList.remove('lightbox-open');

    if (lastTrigger) {
      lastTrigger.focus();
    }
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => openLightbox(trigger));
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(trigger);
      }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeLightbox();
    }
  });
})();

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
    const activeElement = document.activeElement;
    const isTyping = isEditableElement(activeElement);
    const imageLightboxOpen = document.getElementById('imageLightbox')?.classList.contains('open');

    if (imageLightboxOpen) return;

    // Open terminal: / or Ctrl+K
    if ((e.key === '/' && !e.ctrlKey && !e.metaKey && !isTyping) ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && !isTyping)) {
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
    if (!overlay.classList.contains('open') && !isTyping) {
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
      addLine('  axioms    — Our operating principles');
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
      addLine('  Decision systems for cities, governments, and operators.');
      addLine('  Built to stay useful under pressure, not just at launch.');
      addLine('  HQ: Bangkok, Thailand');
      addLine('  Reach: 5 countries | 9 live systems');
      addLine('  Live monitoring: 24/7 across all systems');
    },

    founders: () => {
      addLine(`<span class="terminal-cmd">FOUNDING TEAM</span>`, 'terminal-line-info');
      addLine('');
      addLine('  Dr. Non Arkaraprasertkul — Co-Founder');
      addLine('    PhD Anthropology, Harvard University');
      addLine('    MPhil Chinese Studies, University of Oxford');
      addLine('    MSc Architecture Studies, MIT');
      addLine('    Fmr. Visiting Lecturer MIT | Postdoc NYU');
      addLine('    400+ academic citations | Builder of production-grade AI systems');
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
      addLine('  Data:       Open civic APIs, SQLite evidence layer, live telemetry');
      addLine('  Platform:   Local Node server + API routes');
      addLine('  AI:         NLP, Sentiment Analysis, Computer Vision');
      addLine('  Design:     Outfit, Inter, JetBrains Mono');
      addLine('  Philosophy: Precision, speed, no decorative platform theatre.');
    },

    systems: () => {
      addLine(`<span class="terminal-cmd">LIVE PRODUCTION SYSTEMS</span>`, 'terminal-line-info');
      const systems = [
        'Global Monitor',
        'MEM Intelligence',
        'War Monitor',
        'Phuket Dashboard',
        'Phuket Smart Bus',
        'Smart City Thailand Index',
        'MTT Monitor',
        'SLIC Index',
        'Kuching IOC'
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

    axioms: () => {
      addLine(`<span class="terminal-cmd">OUR AXIOMS</span>`, 'terminal-line-info');
      addLine('  01. Your Success Is Our KPI');
      addLine('  02. AI as Water — invisible, essential');
      addLine('  03. The 36-Button Rule — simplicity by design');
      addLine('  04. Low-Fidelity, High-Impact');
      addLine('  05. Partners, Not Vendors');
      addLine('  06. Moral Foundation — Kant\'s categorical imperative');
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
      addLine('Dr. Non OS Dashboard — currently upgrading.');
      addLine('Check back soon.', 'terminal-line-info');
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


// ── Team Bio Read-More (mobile) ───────────────────────────────────

(function initBioReadMore() {
  if (window.innerWidth > 768) return;

  document.querySelectorAll('.team-card p').forEach(function(p) {
    if (p.textContent.length < 120) return;

    p.classList.add('bio-truncated');
    const btn = document.createElement('button');
    btn.className = 'team-read-more';
    btn.textContent = 'Read more';
    btn.addEventListener('click', function() {
      const expanded = p.classList.toggle('bio-expanded');
      p.classList.toggle('bio-truncated', !expanded);
      btn.textContent = expanded ? 'Show less' : 'Read more';
    });
    p.parentNode.insertBefore(btn, p.nextSibling);
  });
})();


// ── Scroll Progress Bar ──────────────────────────────────────────

(function initScrollProgress() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;

  function update() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    bar.style.width = (scrollY / docHeight * 100) + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


// ── Contact Form Submit with Success Animation ───────────────────

(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const btnSpan = btn.querySelector('span');
    const origText = btnSpan.textContent;

    btnSpan.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        form.innerHTML = `
          <div class="contact-form-success">
            <div class="success-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3>Message sent</h3>
            <p>We'll get back to you soon.</p>
          </div>
        `;
      } else {
        btnSpan.textContent = 'Try Again';
        btn.style.background = 'var(--red)';
        btn.disabled = false;
        setTimeout(() => { btnSpan.textContent = origText; btn.style.background = ''; }, 3000);
      }
    } catch (err) {
      btnSpan.textContent = 'Try Again';
      btn.style.background = 'var(--red)';
      btn.disabled = false;
      setTimeout(() => { btnSpan.textContent = origText; btn.style.background = ''; }, 3000);
    }
  });
})();


// ── Magnetic Buttons (desktop only) ──────────────────────────────

(function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.btn-primary, .btn-ghost, .nav-link-cta').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.15;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.15;
      btn.style.transform = `translate(${x}px, ${y - 1}px)`;
      btn.style.transition = 'transform 0.1s ease';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => { btn.style.transition = ''; }, 500);
    });
  });
})();


// ── Typewriter HUD Coordinates ───────────────────────────────────

(function initTypewriterHud() {
  const satCoord = document.getElementById('satCoord');
  if (!satCoord) return;

  let currentText = satCoord.textContent;
  let typeTimer = null;

  window.typewriterUpdate = function(el, newText) {
    if (newText === currentText) return;
    clearTimeout(typeTimer);

    // Find first differing character
    let diffIndex = 0;
    while (diffIndex < currentText.length && diffIndex < newText.length && currentText[diffIndex] === newText[diffIndex]) {
      diffIndex++;
    }

    let i = diffIndex;
    function tick() {
      if (i <= newText.length) {
        el.textContent = newText.substring(0, i);
        i++;
        typeTimer = setTimeout(tick, 30);
      } else {
        currentText = newText;
      }
    }
    tick();
  };

  // Patch updateHud to use typewriter for coordinates
  const observer = new MutationObserver(() => {
    const newText = satCoord.textContent;
    if (newText !== currentText && newText.includes('°')) {
      currentText = newText;
    }
  });
  observer.observe(satCoord, { childList: true, characterData: true, subtree: true });
})();
