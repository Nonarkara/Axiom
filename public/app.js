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
      systems: 'Systems', stages: 'Stages', team: 'Team', press: 'Press', cta: 'Work With Us',
    },
    heroCurrent: {
      sub: 'Most "smart city" work ends as a deck. Ours runs in production. Problem mapped in week one. Something working before any presentation. Every decision tracked from the start.',
      cta1: 'See live systems', cta2: 'Start a brief',
      stat1lbl: 'Systems in production', stat2lbl: 'Countries operating',
      stat3lbl: 'Cities indexed', stat4lbl: 'On main stage, GITEX Asia',
    },
    sysSect: {
      kicker: 'Live in production',
      title: 'Real systems. <em>Real cities.</em> Operating today.',
      lede: "Each one started as a sharp question, shipped as a working surface, and stays useful long after the launch press cycle ends. Click through and use them — they're live.",
    },
    stageSect: {
      kicker: 'Two stages, one signal',
      title: 'Governments are tired of <em>waiting for the deck.</em>',
      lede: "In six months we took the same thesis to two of Asia's biggest stages. Both rooms were full. Both had the same response: build it now, not after the next budget cycle.",
    },
    teamSect: {
      kicker: 'Who builds it',
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
      systems: 'ระบบ', stages: 'เวที', team: 'ทีม', press: 'สื่อ', cta: 'เริ่มงานร่วมกัน',
    },
    heroCurrent: {
      sub: 'งาน "เมืองอัจฉริยะ" ส่วนใหญ่จบที่งานนำเสนอ ของผมจบที่ระบบที่รันจริง ทำแผนที่ปัญหาในสัปดาห์แรก มีระบบทำงานก่อนการนำเสนอครั้งแรก วัดผลทุกการตัดสินใจตั้งแต่วันแรก',
      cta1: 'ดูระบบที่รันจริง', cta2: 'ส่งโจทย์เข้ามา',
      stat1lbl: 'ระบบที่ใช้งานอยู่', stat2lbl: 'ประเทศที่ใช้งาน',
      stat3lbl: 'เมืองที่จัดอันดับ', stat4lbl: 'บนเวทีหลัก GITEX Asia',
    },
    sysSect: {
      kicker: 'ใช้งานจริงอยู่ตอนนี้',
      title: 'ระบบจริง <em>เมืองจริง</em> รันอยู่วันนี้',
      lede: 'ทุกระบบเริ่มจากคำถามที่คม ส่งมอบเป็นเครื่องมือใช้งานได้ และยังมีประโยชน์อยู่อีกนานหลังรอบข่าวเปิดตัวจบ คลิกเข้าไปใช้ได้เลย — ทุกตัวรันอยู่จริง',
    },
    stageSect: {
      kicker: 'สองเวที สัญญาณเดียว',
      title: 'รัฐบาลเหนื่อย<em>กับการรองานนำเสนอ</em>แล้ว',
      lede: 'ในหกเดือน ผมพาแนวคิดเดียวกันขึ้นเวทีใหญ่ที่สุดของเอเชียสองครั้ง ห้องเต็มทั้งสองครั้ง คำตอบจากห้องเดียวกัน: สร้างเลย ไม่ต้องรอรอบงบประมาณถัดไป',
    },
    teamSect: {
      kicker: 'คนที่สร้าง',
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
      systems: '系统', stages: '舞台', team: '团队', press: '媒体', cta: '开始合作',
    },
    heroCurrent: {
      sub: '多数"智慧城市"项目都停在幻灯片阶段。我们的停在运行中的系统上。第一周就把问题摸清楚 演示之前就有能跑的东西 每一个决策从第一天起就留下记录。',
      cta1: '看在线系统', cta2: '把题目发过来',
      stat1lbl: '运行中的系统', stat2lbl: '在用的国家',
      stat3lbl: '建档城市', stat4lbl: 'GITEX Asia 主舞台',
    },
    sysSect: {
      kicker: '正在生产中运行',
      title: '真实系统 <em>真实城市</em> 今天就在跑',
      lede: '每个系统都从一个尖锐的问题开始 以可用的界面交付 在发布新闻周期结束之后依然有用 点进去用就行 全部都在线跑着',
    },
    stageSect: {
      kicker: '两个舞台 一个信号',
      title: '政府已经<em>厌倦等一份幻灯片</em>了',
      lede: '六个月里我们把同一个论点带上亚洲最大的两个舞台 两个会议室都满 两个房间给的反应一样：现在就开始建 不用等下一个预算周期',
    },
    teamSect: {
      kicker: '谁在搭',
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
      cta: 'workWith(us)',
    },
    heroCurrent: {
      sub: '// most "smart city" work: Promise<Deck> — never resolves\n// ours: LiveSystem — deployed, instrumented, running\n// method: pressureMap() → shipRough() → instrument(day1)',
      cta1: 'systems.getLive()',
      cta2: 'brief.start()',
      stat1lbl: 'LiveSystem[]',
      stat2lbl: 'Country<T>[]',
      stat3lbl: 'cities.indexed',
      stat4lbl: 'GITEX.mainStage',
    },
    sysSect: {
      kicker: '// LIVE_IN_PRODUCTION',
      title: 'type Systems = Real<Cities> // operating today',
      lede: '// each: sharpQuestion → workingSurface → staysUseful\n// click through: systems.forEach(s => assert(s.isLive()))',
    },
    stageSect: {
      kicker: '// TWO_STAGES_ONE_SIGNAL',
      title: 'governments.tireof(waitingForTheDeck)',
      lede: '// 6 months. same thesis. asia\'s biggest stages.\n// response: { build: "now", waitForBudgetCycle: false }',
    },
    teamSect: {
      kicker: '// WHO_BUILDS_IT',
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
      p02: {
        title: 'Macro signal, <em>before the room starts guessing.</em>',
        lede: 'DNGWS Monitor pulls live escalation tracking, economic spillover, and cross-source crisis visualization into one surface. For decision-makers who can\'t wait for the briefing deck.',
        w1lbl:'Why it\'s special', w1:'Bloomberg Terminal costs $25K/seat/year. This runs on open data. Cross-source crisis fusion, escalation deltas, and economic spillover — surfaced fast enough to brief a minister before the cable news cycle catches up.',
        w2lbl:'What it replaced', w2:'Subscription intelligence platforms, ad-hoc analyst PDFs, and the gap between "something happened" and "we have a position."',
        w3lbl:'Earned on day one', w3:'Sentinel-2 satellite imagery, OSINT feed fusion, and 53-country NLP brief layer — deployed at the edge for sub-second region switches.', cta:'Open live system',
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
        w3lbl:'What it changes', w3:'Directors stop hoarding people. Projects stop running on political capital. Skill gaps become visible before they become failures. And HR — renamed Talent Incubation — becomes the most strategic function in the building, not the most avoided one.', cta:'Explore the engine',
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
    },
    notesContent: {
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
    pressSection: {
      kicker:'In the press', title:'Read. Watch. Decide.', lede:'Outside coverage of the work, the thesis, and the systems.',
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
      p02: {
        title: 'สัญญาณภาพรวม <em>ก่อนคนในห้องเริ่มเดา</em>',
        lede: 'DNGWS Monitor รวมการติดตามสถานการณ์แบบเรียลไทม์ ผลกระทบเศรษฐกิจ และการแสดงวิกฤตจากหลายแหล่งไว้ในจอเดียว สำหรับผู้ตัดสินใจที่รอเอกสารบรีฟไม่ไหว',
        w1lbl:'จุดที่พิเศษ', w1:'Bloomberg Terminal ราคา 25,000 ดอลลาร์ต่อที่นั่งต่อปี ระบบนี้รันบนข้อมูลสาธารณะ ผสมวิกฤตจากหลายแหล่ง ส่วนต่างของการยกระดับ และผลกระทบเศรษฐกิจ เร็วพอที่จะบรีฟรัฐมนตรีก่อนรอบข่าวจะตามทัน',
        w2lbl:'สิ่งที่ถูกแทนที่', w2:'แพลตฟอร์มข่าวกรองแบบจ่ายรายเดือน PDF เฉพาะกิจจากนักวิเคราะห์ และช่องว่างระหว่าง "มีอะไรเกิดขึ้น" กับ "เรามีจุดยืนแล้ว"',
        w3lbl:'ได้ตั้งแต่วันแรก', w3:'ภาพดาวเทียม Sentinel-2 การรวม OSINT feed และชั้น NLP บรีฟ 53 ประเทศ ทำงานที่ edge สลับภูมิภาคได้ในเสี้ยววินาที', cta:'เปิดระบบสด',
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
        w3lbl:'สิ่งที่เปลี่ยนไป', w3:'ผู้อำนวยการเลิกกักตุนคน โครงการเลิกขับเคลื่อนด้วยทุนการเมือง ช่องว่างทักษะมองเห็นได้ก่อนกลายเป็นความล้มเหลว และ HR ที่เปลี่ยนชื่อเป็น Talent Incubation กลายเป็นฟังก์ชันที่มียุทธศาสตร์มากที่สุดในตึก ไม่ใช่ฟังก์ชันที่ทุกคนหลีกเลี่ยง', cta:'สำรวจเครื่องยนต์',
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
    },
    notesContent: {
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
    pressSection: { kicker:'ในสื่อ', title:'อ่าน ดู ตัดสินใจ', lede:'รายงานจากภายนอกเกี่ยวกับงาน แนวคิด และระบบทั้งหมด' },
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
      p02: {
        title: '宏观信号，<em>在房间里开始瞎猜之前</em>',
        lede: 'DNGWS Monitor把实时升级追踪、经济外溢、跨来源的危机可视化全部塞进一个界面，给那些等不到简报文档的决策者用。',
        w1lbl:'特别之处', w1:'彭博终端一个席位每年两万五千美元，这个跑在公开数据上。跨来源的危机融合、升级幅度、经济外溢，快到可以在有线电视追上之前给部长做简报。',
        w2lbl:'替代了什么', w2:'订阅制情报平台、临时打的分析师PDF，以及"出事了"和"我们有立场了"之间那段真空。',
        w3lbl:'第一天就有价值', w3:'Sentinel-2卫星图像、OSINT信息流融合、53国NLP简报层——部署在边缘节点，切换区域不到一秒。', cta:'打开在线系统',
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
        w3lbl:'改变了什么', w3:'部门主管不再囤人。项目不再靠政治资本跑。技能缺口在变成失败之前就显出来。而HR——改名叫人才孵化——变成大楼里最有战略性的部门，不再是最被绕开的那个。', cta:'探索引擎',
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
    },
    notesContent: {
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
    pressSection: { kicker:'媒体报道', title:'读 看 决定', lede:'外界对这些工作、论点和系统的报道' },
  },

  ts: {
    panels: {
      p01: { title:'Governor<em>.situationRoom</em>: BrowserTab', lede:'// phuket.transit + safety + env → 30s read\n// built: weeks; not: procurementCycle', w1lbl:'// WHY_SPECIAL', w1:'// govDashboards: ReadonlyPDF[]\n// phuket: WorkingOpsRoom — transit & safety & env\n// refresh: 42ms; analysts: never[]', w2lbl:'// REPLACED', w2:'threeAgencyReports + smsChain + tuesdayBriefing', w3lbl:'// DAY_ONE', w3:'existingIoT.build() // no new hardware', cta:'system.open()' },
      p02: { title:'macroSignal<em>.before(roomStartsGuessing)</em>', lede:'// DNGWS: escalation + spillover + crossSourceCrisis\n// for: DecisionMaker.cannotWait(briefingDeck)', w1lbl:'// WHY_SPECIAL', w1:'bloomberg.cost: $25k/seat // this: openData\ncrisis.fuse() // minister.brief(beforeCycle)', w2lbl:'// REPLACED', w2:'subscriptionPlatforms + adHocPDFs + positionGap', w3lbl:'// DAY_ONE', w3:'sentinel2 + OSINT + nlpBrief(53countries)', cta:'system.open()' },
      p03: { title:'bureaucracy<em>.makeLegible()</em>', lede:'// thailand.smartCity.programme → public surface\n// proposals.in; progress.visible; pdfs.never()', w1lbl:'// WHY_SPECIAL', w1:'nationalProgramme.online(bilingual)\n// outcomes not ceremony; status.update(onMilestone)', w2lbl:'// FUNDED_BY', w2:'depa // digital economy promotion agency\n// direct gov engagement, not sub-vendor', w3lbl:'// MATTERS', w3:'template.for(nationalSmartCity.programmes)', cta:'system.open()' },
      p04: { title:'ranking<em>.arguesBack()</em>', lede:'SLIC.show(5pillars)\n// mayors.define(livability)\n// math.follows()', w1lbl:'// WHY_SPECIAL', w1:'others.hand(finishedVerdict)\nSLIC.hand(math) // weights.move() → ranking.change()', w2lbl:'// REPLACED', w2:'staticLeaderboards + annualPDF + methodology.dispute', w3lbl:'// SIGNAL', w3:'MayorsOfEurope.adopted()\n// live-demo: SCSE 45min', cta:'SLIC.v3.open()' },
      p05: { title:'Kuching<em>.oneCommandSurface()</em>', lede:'// IOC: fullSpectrum\n// fx + flights + satellite + env → unified', w1lbl:'// WHY_SPECIAL', w1:'most: IOC<SingleDomain>\nkuching: crossDomain.fuse() // never switchTabs()', w2lbl:'// USERS', w2:'cityOperators + planners\n// realTime situational awareness, daily use', w3lbl:'// MATTERS', w3:'bloomberg.density / city // fraction.of.cost', cta:'system.open()' },
      p06: { title:'news<em>.before(algorithm.decidesWar)</em>', lede:'MEM: fastest opensource news surface\n// multiSource; noEditorialDelay; noFilterBubble', w1lbl:'// WHY_SPECIAL', w1:'platforms.have(editorial.layer)\nMEM.remove(that) // same signals, machineSpeed', w2lbl:'// REPLACED', w2:'3tabs + 2telegramChannels + twitterList', w3lbl:'// USERS', w3:'journalists + analysts + ngoFieldTeams', cta:'system.open()' },
      p07: { title:'bus.tracked<em>.rider.informed</em>', lede:'// GPS: realTime; telemetry: passenger\n// designed: phone.first // not controlRoom', w1lbl:'// WHY_SPECIAL', w1:'smartBus.for(operator.dashboard) // old\nthis.for(person.waiting(stop)) // new', w2lbl:'// REPLACED', w2:'noInfo + 2019schedule + "transit.cannotBeReadable"', w3lbl:'// BUILT_ON', w3:'phuket.IoT.existing\n// same sensor as governor ops room', cta:'system.open()' },
      p08: { title:'reports.arrive<em>.AI.turnsIntoAction()</em>', lede:'// telegram + LINE → AI.analyze()\n// satellite + map layers → nearRealTime', w1lbl:'// WHY_SPECIAL', w1:'complaintSystems.stop(ticketNumber)\nSCTH.stream → decisionSurface()', w2lbl:'// REPLACED', w2:'chatGroupScreenshots + manualTriage + staticLayers', w3lbl:'// DECISION_POWER', w3:'absorb + assign + analyze + export + push', w4lbl:'// LIVE_TUNNEL', w4:'system.proprietary.continuous\n// if !resolve: midUpgrade → retry()', cta:'system.open()' },
      p09: { title:'voices: 11<em>.decision: 1</em>', lede:'// 11 justices, palindromic names\n// local Mac; sharedTranscript; ~$3/month\n// trained: personal data // proprietary: byDesign', w1lbl:'// WHY_EXISTS', w1:'singleModel.gives(oneAnswer)\n// VERIFY | DECIDE | EXPLORE | DEBATE\n// moves: EXPAND | QUALIFY | CONCEDE | STAND | PASS', w2lbl:'// COST', w2:'manus.class @ $3/mo\n// chair: Mistral3; Ada: ThaiLLM(free)\n// Otto: ocr+video+email+pdf+drive', w3lbl:'// NO_DEMO', w3:'trained: { journals, decisions, voice }\n// protocol: ~600 lines Python // open\n// IP = coordinationMethodology', cta:'protocol.v1.read()', cta2:'agentic.v2.run()' },
      p10: { title:'HR.recordSystem<em>.enough(years)</em>', lede:'// TKCX: TalentKnowledgeCollaborativeExplorers\n// employees: partyMembers; projects: quests\n// teamAssembly: strategy', w1lbl:'// PROBLEM', w1:'HR.is(complianceRecord)\n// tells: whoEmployed\n// NOT: { deploy: where, with: whom }', w2lbl:'// ENGINE', w2:'DQ3.partySystem\n// 5 archetypes; moneyball: budget÷10\n// readiness(coverage+chemistry+morale)', w3lbl:'// CHANGES', w3:'directors.stop(hoardingPeople)\n// skillGaps.visible(beforeFailure)\n// HR.rename("TalentIncubation")', cta:'engine.explore()' },
      p11: { title:'AI<em>.knows(you)</em>', lede:'// ObsidianVault → MCP → allPlatforms: simultaneously\n// brainAnatomy.folders; serverConfigs: 19\n// agents.access(persona, voice, decisions)', w1lbl:'// GAP_CLOSED', w1:'session.starts(cold) // no context\nSecondBrainOS.feeds(voice + values + decisions)\n// AI.already.knows(whoItWorksWith)', w2lbl:'// ARCHITECTURE', w2:'vault: { PrefrontalCortex, Hippocampus, TemporalLobe }\n// 19 MCP configs → Cursor + Codex + ClaudeCode\n// livingKnowledgeGraph.connected(atOnce)', w3lbl:'// OPEN_SOURCE', w3:'license: MIT // brain: yours\n// fork(structure); adapt(mcpConfigs)\n// 12levelDiagnostic: strip(aiSpeak)', cta:'architecture.explore()' },
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
    },
    notesContent: {
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
    pressSection: { kicker:'// IN_THE_PRESS', title:'read() // watch() // decide()', lede:'// outside coverage: { work, thesis, systems }' },
  },
};

// Merge i18nExt into uiCopy
Object.keys(i18nExt).forEach(locale => {
  if (uiCopy[locale]) Object.assign(uiCopy[locale], i18nExt[locale]);
});

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
    },
    cats: {
      c01:'Regional Operations', c02:'Strategic Intelligence',
      c03:'National Programme', c04:'City Benchmarking',
      c05:'Intelligent Operations', c06:'Open Intelligence',
      c07:'Transit Intelligence', c08:'Civic Intelligence',
      c09:'Agentic Intelligence', c10:'Talent Intelligence',
      c11:'Knowledge Intelligence', c12:'National Broadcast',
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
      smallPrint:'Decision systems for cities, governments, and operators. Bangkok · Southeast Asia. © 2026 Axiom. All rights reserved. Axiom is a registered trade name. System uptime, response times, and outcome metrics are case-specific observations, not guarantees of future performance.',
    },
    misc: { swipeHint:'12 systems — swipe to explore' },
    metaKeys: {
      AI:'AI', Access:'Access', Audience:'Audience', Authority:'Authority',
      Backup:'Backup', 'Brain layers':'Brain layers', Cadence:'Cadence',
      Channels:'Channels', Cities:'Cities', Cost:'Cost', Coverage:'Coverage',
      Data:'Data', Employees:'Employees', Engine:'Engine', Intake:'Intake',
      Interface:'Interface', Justices:'Justices', Latency:'Latency',
      Layers:'Layers', Mode:'Mode', Peak:'Peak', Pillars:'Pillars',
      Platforms:'Platforms', Programme:'Programme', Protocol:'Protocol',
      Region:'Region', Scope:'Scope', Screens:'Screens', Sensors:'Sensors',
      Sources:'Sources', Stack:'Stack', Status:'Status', Stream:'Stream',
      Tracking:'Tracking',
    },
  },

  th: {
    chips: {
      p01:'สด · ภูเก็ต', p02:'สด · ทั่วโลก', p03:'สด · ระดับชาติ',
      p04:'สด · 157 เมือง', p05:'สด · ซาราวัก', p06:'สด · ตะวันออกกลาง',
      p07:'สด · ขนส่งภูเก็ต', p08:'สด · งานเมือง',
      p09:'กรรมสิทธิ์ · Local-first', p10:'สด · Enterprise HR',
      p11:'Research Preview · Protocol เปิด',
      p12:'สด · กระจายเสียงแห่งชาติ',
    },
    cats: {
      c01:'ปฏิบัติการระดับภูมิภาค', c02:'ข่าวกรองเชิงกลยุทธ์',
      c03:'โครงการระดับชาติ', c04:'การจัดอันดับเมือง',
      c05:'ปฏิบัติการอัจฉริยะ', c06:'ข่าวกรองแบบเปิด',
      c07:'ระบบขนส่งอัจฉริยะ', c08:'ข่าวกรองพลเมือง',
      c09:'ข่าวกรอง Agentic', c10:'ข่าวกรองบุคลากร',
      c11:'ข่าวกรองความรู้', c12:'กระจายเสียงแห่งชาติ',
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
      smallPrint:'ระบบการตัดสินใจสำหรับเมือง รัฐบาล และผู้ปฏิบัติงาน · กรุงเทพฯ · เอเชียตะวันออกเฉียงใต้ · © 2569 Axiom สงวนลิขสิทธิ์ Axiom เป็นเครื่องหมายการค้าจดทะเบียน · uptime ของระบบ เวลาตอบสนอง และตัวชี้วัดผลลัพธ์ทั้งหมดเป็นการสังเกตเฉพาะกรณี ไม่ใช่การรับประกันผลในอนาคต',
    },
    misc: { swipeHint:'12 ระบบ — ปัดเพื่อสำรวจ' },
    metaKeys: {
      AI:'AI', Access:'การเข้าถึง', Audience:'ผู้ชม', Authority:'หน่วยงาน',
      Backup:'สำรองข้อมูล', 'Brain layers':'ชั้นสมอง', Cadence:'จังหวะ',
      Channels:'ช่อง', Cities:'เมือง', Cost:'ต้นทุน', Coverage:'พื้นที่ครอบคลุม',
      Data:'ข้อมูล', Employees:'พนักงาน', Engine:'เครื่องยนต์', Intake:'การรับเข้า',
      Interface:'อินเทอร์เฟซ', Justices:'ตุลาการ', Latency:'ความหน่วง',
      Layers:'เลเยอร์', Mode:'โหมด', Peak:'สูงสุด', Pillars:'เสาหลัก',
      Platforms:'แพลตฟอร์ม', Programme:'โครงการ', Protocol:'โปรโตคอล',
      Region:'ภูมิภาค', Scope:'ขอบเขต', Screens:'หน้าจอ', Sensors:'เซ็นเซอร์',
      Sources:'แหล่งข้อมูล', Stack:'Stack', Status:'สถานะ', Stream:'สตรีม',
      Tracking:'การติดตาม',
    },
  },

  zh: {
    chips: {
      p01:'实时 · 普吉', p02:'实时 · 全球', p03:'实时 · 国家级',
      p04:'实时 · 157座城市', p05:'实时 · 砂拉越', p06:'实时 · 中东',
      p07:'实时 · 普吉公交', p08:'实时 · 城市运营',
      p09:'专有 · 本地优先', p10:'实时 · 企业HR',
      p11:'研究预览 · 开放协议',
      p12:'实时 · 国家广播',
    },
    cats: {
      c01:'区域运营', c02:'战略情报', c03:'国家级项目',
      c04:'城市基准评分', c05:'智能运营', c06:'开放情报',
      c07:'交通智能', c08:'公民智能', c09:'智能体情报',
      c10:'人才智能', c11:'知识智能', c12:'国家广播',
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
      smallPrint:'面向城市、政府和运营商的决策系统。曼谷 · 东南亚。© 2026 Axiom 版权所有。Axiom 是注册商号。系统正常运行时间、响应时间和成果指标均为个案观察，并非未来表现的保证。',
    },
    misc: { swipeHint:'12 个系统 — 滑动浏览' },
    metaKeys: {
      AI:'AI', Access:'访问', Audience:'受众', Authority:'主管机构',
      Backup:'备份', 'Brain layers':'脑层级', Cadence:'频率',
      Channels:'频道', Cities:'城市', Cost:'成本', Coverage:'覆盖范围',
      Data:'数据', Employees:'员工', Engine:'引擎', Intake:'输入',
      Interface:'界面', Justices:'法官', Latency:'延迟', Layers:'图层',
      Mode:'模式', Peak:'峰值', Pillars:'支柱', Platforms:'平台',
      Programme:'项目', Protocol:'协议', Region:'区域', Scope:'范围',
      Screens:'屏幕', Sensors:'传感器', Sources:'数据源', Stack:'技术栈',
      Status:'状态', Stream:'流媒体', Tracking:'追踪',
    },
  },

  ts: {
    chips: {
      p01:'live: Phuket', p02:'live: Global', p03:'live: National',
      p04:'live: 157cities', p05:'live: Sarawak', p06:'live: MiddleEast',
      p07:'live: PhuketTransit', p08:'live: CityOps',
      p09:'proprietary: localFirst', p10:'live: EnterpriseHR',
      p11:'researchPreview: openProtocol',
      p12:'live: NationalBroadcast',
    },
    cats: {
      c01:'RegionalOps', c02:'StrategicIntel', c03:'NationalProgramme',
      c04:'CityBenchmark', c05:'IntelligentOps', c06:'OpenIntel',
      c07:'TransitIntel', c08:'CivicIntel', c09:'AgenticIntel',
      c10:'TalentIntel', c11:'KnowledgeIntel', c12:'NationalBroadcast',
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
      smallPrint:'// decisionSystems<City | Government | Operator>\n// Bangkok · SEA · © 2026 Axiom\n// uptime, responseTime, outcomeMetrics: caseSpecific[]\n// !guarantees<FuturePerformance>',
    },
    misc: { swipeHint:'systems[12].swipe()' },
    metaKeys: {
      AI:'AI', Access:'access', Audience:'audience', Authority:'authority',
      Backup:'backup', 'Brain layers':'brainLayers', Cadence:'cadence',
      Channels:'channels', Cities:'cities', Cost:'cost', Coverage:'coverage',
      Data:'data', Employees:'employees', Engine:'engine', Intake:'intake',
      Interface:'interface', Justices:'justices', Latency:'latency',
      Layers:'layers', Mode:'mode', Peak:'peak', Pillars:'pillars',
      Platforms:'platforms', Programme:'programme', Protocol:'protocol',
      Region:'region', Scope:'scope', Screens:'screens', Sensors:'sensors',
      Sources:'sources', Stack:'stack', Status:'status', Stream:'stream',
      Tracking:'tracking',
    },
  },
};

Object.keys(i18nExt2).forEach(locale => {
  if (uiCopy[locale]) Object.assign(uiCopy[locale], i18nExt2[locale]);
});

function renderStaticCopy() {
  const copy = uiCopy[activeLocale] || uiCopy.en;
  const fallback = uiCopy.en;
  document.documentElement.lang = activeLocale;
  const lookup = (key) => {
    const parts = key.split('.');
    const val = parts.reduce((obj, k) => obj?.[k], copy);
    if (typeof val === 'string') return val;
    return parts.reduce((obj, k) => obj?.[k], fallback);
  };

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const value = lookup(node.getAttribute('data-i18n'));
    if (typeof value === 'string') node.textContent = value;
  });

  document.querySelectorAll('[data-i18n-html]').forEach((node) => {
    const value = lookup(node.getAttribute('data-i18n-html'));
    if (typeof value === 'string') node.innerHTML = value;
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
  initScrollReveal();
});

function animateCounter(el, target, suffix, duration) {
  const start = performance.now();
  const step = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const val = target < 10 ? (target * ease).toFixed(1) : Math.round(target * ease);
    el.textContent = val + suffix;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Fade-in stagger for card grids
  const fadeTargets = document.querySelectorAll(
    '.health-card, .matrix-item, .featured-card'
  );
  if (fadeTargets.length) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Array.from(fadeTargets).indexOf(entry.target) % 8;
          entry.target.style.transition = `opacity 0.4s ease ${idx * 0.05}s, transform 0.4s ease ${idx * 0.05}s`;
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.classList.add('revealed');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    fadeTargets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(12px)';
      fadeObserver.observe(el);
    });
  }

  // Counter-up for numeric values
  const counterTargets = document.querySelectorAll('.intel-value, .evidence-summary-value');
  if (counterTargets.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const raw = el.textContent.trim();
          const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
          const suffix = raw.replace(/^[\d.]+/, '');
          if (!isNaN(num) && num > 0 && num < 100000) animateCounter(el, num, suffix, 900);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.6 });
    counterTargets.forEach(el => counterObserver.observe(el));
  }
}

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

  const systemGroups = [
    {
      label: 'SIGNAL',
      systems: [
        { name: 'Global Monitor', url: 'https://globalmonitor.fly.dev/' },
        { name: 'MEM Intelligence', url: 'https://nonarkara.github.io/mem-by-non/' },
        { name: 'Middle East Situation Room', url: 'https://middleeast-monitor.pages.dev/' },
      ],
    },
    {
      label: 'STREET',
      systems: [
        { name: 'Phuket Dashboard', url: 'https://nonarkara.github.io/phuket-dashboard/war-room' },
        { name: 'Phuket Smart Bus', url: 'https://nonarkara.github.io/phuket-smart-bus/' },
        { name: 'Kuching IOC', url: 'https://nonarkara.github.io/kuching-ioc/' },
      ],
    },
    {
      label: 'STATE',
      systems: [
        { name: 'Smart City Thailand', url: 'https://nonarkara.github.io/smart-city-thailand-index/' },
        { name: 'MTT Monitor', url: 'https://nonarkara.github.io/smart-city-thailand-monitor/' },
        { name: 'SLIC Index', url: 'https://nonarkara.github.io/SLIC-Index/' },
      ],
    },
  ];

  const systems = systemGroups.flatMap(g => g.systems);

  // Render HUD cards with category labels
  grid.innerHTML = systemGroups.map(group => `
    <div class="health-category-label">${group.label}</div>
    ${group.systems.map(s => `
      <div class="health-card" data-url="${s.url}">
        <div class="health-dot checking"></div>
        <div class="health-info">
          <div class="health-name">${s.name}</div>
          <div class="health-url">${s.url.replace('https://', '')}</div>
        </div>
        <div class="health-ms">—</div>
      </div>
    `).join('')}
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
  const allowDirectMapInteraction = !axiomMedia.isMobile;

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
    dragging: allowDirectMapInteraction,
    scrollWheelZoom: false,
    doubleClickZoom: allowDirectMapInteraction,
    touchZoom: allowDirectMapInteraction,
    keyboard: allowDirectMapInteraction,
    boxZoom: allowDirectMapInteraction,
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

      if (isActive && shouldScroll && !axiomMedia.isMobile && typeof button.scrollIntoView === 'function') {
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

  // Track programmatic flyTo in progress — local variable, no private Leaflet APIs
  let flyInProgress = false;

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
        if (!flyInProgress) syncCityDisplay(getClosestCity(center.lat, center.lng));
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

  let autoTour = !axiomMedia.isMobile;
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
    syncCityDisplay(city);
    flyInProgress = true;
    map.flyTo([city.lat, city.lng], city.zoom, {
      duration: tourDuration,
      easeLinearity: useLiteMotion ? 0.1 : 0.05,
    });
  }

  function startTour() {
    if (axiomMedia.isMobile) return;
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
    if (fromUser && !axiomMedia.isMobile) {
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
    // Only pause if zoom was initiated by user (not a programmatic flyTo)
    if (autoTour && !flyInProgress) pauseTour(true);
  });
  map.on('moveend', () => {
    flyInProgress = false;
    const center = map.getCenter();
    const closest = getClosestCity(center.lat, center.lng);
    cityIndex = CITIES.findIndex((city) => city.key === closest.key);
    syncCityDisplay(closest);
  });

  // Start auto tour after initial pause on desktop only. Mobile must never pull scroll back to the hero.
  if (!axiomMedia.isMobile) {
    driftTimer = setTimeout(() => {
      driftToNext();
      driftInterval = setInterval(driftToNext, tourIntervalMs);
    }, useLiteMotion ? 2500 : 5000);
  } else {
    setModeUI(false);
  }

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
      syncCityDisplay(city, { shouldScroll: !axiomMedia.isMobile });
      flyInProgress = true;
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
  const sectionLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"], .mobile-link[href^="#"]'));
  const sectionMap = sectionLinks.reduce((map, link) => {
    const id = link.getAttribute('href')?.slice(1);
    const section = id ? document.getElementById(id) : null;
    if (section) {
      if (!map.has(id)) map.set(id, { section, links: [] });
      map.get(id).links.push(link);
    }
    return map;
  }, new Map());

  const setActiveSection = (id) => {
    sectionMap.forEach(({ links }, sectionId) => {
      links.forEach((link) => {
        const isActive = sectionId === id;
        link.classList.toggle('is-active', isActive);
        if (isActive) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  };

  const updateActiveSection = () => {
    if (!sectionMap.size) return;
    const probeY = Math.min(window.innerHeight * 0.42, 420);
    let activeId = '';

    sectionMap.forEach(({ section }, id) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= probeY && rect.bottom > probeY) {
        activeId = id;
      }
    });

    if (activeId) setActiveSection(activeId);
  };

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveSection();
  }, { passive: true });

  updateActiveSection();
  window.addEventListener('resize', updateActiveSection);

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
    '.evidence-visual-card',
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
  const localeButtons = Array.from(document.querySelectorAll('#evidenceLocaleSwitch [data-locale]'));
  const pageviewsEl = document.getElementById('evidencePageviews');
  const pageviewsNoteEl = document.getElementById('evidencePageviewsNote');
  const caseFilesEl = document.getElementById('evidenceCaseFiles');
  const regionsCoveredEl = document.getElementById('evidenceRegionsCovered');
  const verifiedSourcesEl = document.getElementById('evidenceVerifiedSources');
  const averageConfidenceEl = document.getElementById('evidenceAverageConfidence');
  const proofNoteEl = document.getElementById('evidenceProofNote');
  const regionNoteEl = document.getElementById('evidenceRegionNote');
  const sourceNoteEl = document.getElementById('evidenceSourceNote');
  const confidenceNoteEl = document.getElementById('evidenceConfidenceNote');
  const caseStudyMount = document.getElementById('caseStudyProofMount');
  const historyList = document.getElementById('contentHistoryList');
  const historyMeta = document.getElementById('contentHistoryMeta');
  const filterStrip = document.getElementById('evidenceFilterStrip');
  const statusViz = document.getElementById('evidenceStatusViz');
  const regionViz = document.getElementById('evidenceRegionViz');
  const typeViz = document.getElementById('evidenceTypeViz');

  if (!pageviewsEl || !caseStudyMount || !historyList || !statusViz || !regionViz || !typeViz) return;

  const evidenceCopy = {
    en: {
      tag: 'Evidence Dashboard',
      title: 'What we can prove, where it lives, and how current it is.',
      desc: 'This section now reads live records from the evidence database. It shows project proof, regional spread, source quality, and a public timeline you can scan quickly.',
      localeNote: 'This switch changes the evidence section only.',
      explainerKicker: 'IN PLAIN ENGLISH',
      explainerText: 'This is the part of the homepage that behaves more like a dashboard than a brochure. It counts visits, groups proof by status and region, and shows which public records back each claim.',
      summary: {
        visits: 'VISITS RECORDED',
        proof: 'PROOF FILES',
        regions: 'REGIONS COVERED',
        sources: 'VERIFIED SOURCES',
        confidence: 'AVERAGE CONFIDENCE',
        proofNote: 'Project records backed by stored proof.',
        regionNote: 'Distinct operating footprints represented in the proof set.',
        sourceNote: 'Distinct live sources or public references behind the records.',
        confidenceNote: 'A quick read on how strong the current proof set is.',
      },
      visuals: {
        statusHeading: 'DELIVERY STATUS',
        statusText: 'Which records are live now, in pilot, or already publicly launched.',
        regionHeading: 'REGIONAL FOOTPRINT',
        regionText: 'Where the evidence is concentrated right now.',
        typeHeading: 'EVIDENCE MIX',
        typeText: 'The balance between monitoring, operations, and public reference work.',
      },
      caseHeading: 'PROJECT PROOF',
      caseText: 'Each record shows who it served, what shipped, which source backs it, and how current the proof still is.',
      historyHeading: 'PUBLIC TIMELINE',
      historyText: 'Every line below is a public trace that supports the story: launch, deployment, workshop, or regional rollout.',
      historyMetaSuffix: 'entries loaded',
      filters: {
        all: 'All records',
        live: 'Live',
        pilot: 'Pilot',
        launched: 'Launched',
        published: 'Published',
        field: 'Field',
      },
      statuses: {
        live: 'Live',
        pilot: 'Pilot',
        launched: 'Launched',
        published: 'Published',
        field: 'Field',
      },
      regions: {
        global: 'Global',
        thailand: 'Thailand',
        asean: 'ASEAN',
        local: 'Local',
      },
      evidenceTypes: {
        monitor: 'Monitoring',
        operations: 'Operations room',
        index: 'Public index',
        keynote: 'Keynote',
        network: 'Network layer',
        roadmap: 'Roadmap',
        brief: 'Brief',
        reference: 'Reference',
      },
      recordLabels: {
        client: 'Who it was for',
        location: 'Where',
        stakeholder: 'Primary stakeholder',
        sector: 'Type of work',
        deploymentWindow: 'What was delivered',
        decisionSurface: 'What decisions it helped',
        outcome: 'Measured outcome',
        source: 'Proof source',
        verified: 'Last verified',
        languages: 'Languages',
        confidence: 'Confidence',
        artifacts: 'Artifacts',
      },
      historyLabels: {
        proof: 'Proof note',
        confidence: 'Confidence',
      },
      languages: {
        en: 'English',
        th: 'Thai',
        zh: 'Chinese',
      },
      loading: {
        status: 'Loading status distribution.',
        region: 'Loading regional footprint.',
        type: 'Loading evidence mix.',
        proof: 'Loading project proof.',
        history: 'Loading timeline entries.',
      },
      empty: {
        caseStudies: 'No project proof has been loaded yet.',
        filteredCaseStudies: 'No project records match this status yet.',
        history: 'No timeline entries have been loaded yet.',
        bars: 'No records yet.',
      },
      errors: {
        proof: 'Project proof is unavailable right now. Check the local API server.',
        history: 'Timeline data is unavailable right now. Check the local API server.',
        visits: 'Visit data is unavailable right now.',
      },
      notes: {
        latestVisit: 'Most recent visit',
        staticSnapshot: 'GitHub Pages snapshot. Live visit counting is disabled here.',
      },
      links: {
        viewSource: 'View source',
        viewLive: 'View live example',
      },
    },
    th: {
      tag: 'แดชบอร์ดหลักฐาน',
      title: 'สิ่งที่ผมพิสูจน์ได้ อยู่ที่ไหน และอัปเดตล่าสุดเมื่อใด',
      desc: 'ส่วนนี้อ่านข้อมูลสดจากฐานหลักฐาน แสดงหลักฐานโครงการ การกระจายตามภูมิภาค คุณภาพของแหล่งอ้างอิง และไทม์ไลน์สาธารณะที่กวาดตาอ่านได้เร็ว',
      localeNote: 'ตัวสลับนี้เปลี่ยนเฉพาะส่วน Evidence',
      explainerKicker: 'อธิบายแบบภาษาคน',
      explainerText: 'นี่คือส่วนของหน้าโฮมเพจที่ทำงานเหมือนแดชบอร์ดมากกว่าบรอชัวร์ มันนับการเข้าชม จัดกลุ่มหลักฐานตามสถานะและภูมิภาค และชี้ว่ามีบันทึกสาธารณะใดรองรับแต่ละคำกล่าวอ้าง',
      summary: {
        visits: 'จำนวนการเข้าชม',
        proof: 'แฟ้มหลักฐาน',
        regions: 'ภูมิภาคที่ครอบคลุม',
        sources: 'แหล่งอ้างอิงที่ยืนยันได้',
        confidence: 'ความเชื่อมั่นเฉลี่ย',
        proofNote: 'ระเบียนโครงการที่มีหลักฐานรองรับจริง',
        regionNote: 'จำนวนพื้นที่ปฏิบัติการที่แสดงอยู่ในชุดหลักฐาน',
        sourceNote: 'จำนวนแหล่งสดหรือเอกสารสาธารณะที่รองรับระเบียนเหล่านี้',
        confidenceNote: 'ภาพรวมอย่างเร็วว่าชุดหลักฐานตอนนี้แข็งแรงแค่ไหน',
      },
      visuals: {
        statusHeading: 'สถานะการส่งมอบ',
        statusText: 'ระเบียนใดที่ใช้งานจริง อยู่ช่วงนำร่อง หรือเปิดตัวสาธารณะแล้ว',
        regionHeading: 'รอยเท้าตามภูมิภาค',
        regionText: 'ตอนนี้หลักฐานกระจุกตัวอยู่ที่พื้นที่ใด',
        typeHeading: 'สัดส่วนของหลักฐาน',
        typeText: 'สมดุลระหว่างงานติดตาม งานห้องปฏิบัติการ และงานอ้างอิงสาธารณะ',
      },
      caseHeading: 'หลักฐานโครงการ',
      caseText: 'แต่ละระเบียนบอกว่าให้บริการใคร ส่งมอบอะไร มีแหล่งใดรองรับ และหลักฐานยังใหม่แค่ไหน',
      historyHeading: 'ไทม์ไลน์สาธารณะ',
      historyText: 'ทุกบรรทัดด้านล่างคือร่องรอยสาธารณะที่รองรับเรื่องเล่า: การเปิดตัว การลงพื้นที่ เวิร์กชอป หรือการขยายระดับภูมิภาค',
      historyMetaSuffix: 'รายการที่โหลดแล้ว',
      filters: {
        all: 'ทั้งหมด',
        live: 'ใช้งานจริง',
        pilot: 'นำร่อง',
        launched: 'เปิดตัวแล้ว',
        published: 'เผยแพร่แล้ว',
        field: 'ภาคสนาม',
      },
      statuses: {
        live: 'ใช้งานจริง',
        pilot: 'นำร่อง',
        launched: 'เปิดตัวแล้ว',
        published: 'เผยแพร่แล้ว',
        field: 'ภาคสนาม',
      },
      regions: {
        global: 'ทั่วโลก',
        thailand: 'ไทย',
        asean: 'อาเซียน',
        local: 'พื้นที่เฉพาะ',
      },
      evidenceTypes: {
        monitor: 'งานติดตาม',
        operations: 'ห้องปฏิบัติการ',
        index: 'ดัชนีสาธารณะ',
        keynote: 'คีย์โน้ต',
        network: 'ชั้นเครือข่าย',
        roadmap: 'โรดแมป',
        brief: 'บรีฟ',
        reference: 'เอกสารอ้างอิง',
      },
      recordLabels: {
        client: 'สำหรับใคร',
        location: 'ที่ไหน',
        stakeholder: 'ผู้มีส่วนได้ส่วนเสียหลัก',
        sector: 'ประเภทงาน',
        deploymentWindow: 'ส่งมอบอะไร',
        decisionSurface: 'ช่วยเรื่องการตัดสินใจอะไร',
        outcome: 'ผลลัพธ์ที่วัดได้',
        source: 'แหล่งหลักฐาน',
        verified: 'ตรวจล่าสุด',
        languages: 'ภาษา',
        confidence: 'ความเชื่อมั่น',
        artifacts: 'ชิ้นหลักฐาน',
      },
      historyLabels: {
        proof: 'หมายเหตุหลักฐาน',
        confidence: 'ความเชื่อมั่น',
      },
      languages: {
        en: 'อังกฤษ',
        th: 'ไทย',
        zh: 'จีน',
      },
      loading: {
        status: 'กำลังโหลดการกระจายตามสถานะ',
        region: 'กำลังโหลดรอยเท้าตามภูมิภาค',
        type: 'กำลังโหลดสัดส่วนของหลักฐาน',
        proof: 'กำลังโหลดหลักฐานโครงการ',
        history: 'กำลังโหลดไทม์ไลน์',
      },
      empty: {
        caseStudies: 'ยังไม่มีข้อมูลหลักฐานโครงการ',
        filteredCaseStudies: 'ยังไม่มีโครงการที่ตรงกับสถานะนี้',
        history: 'ยังไม่มีรายการไทม์ไลน์',
        bars: 'ยังไม่มีข้อมูล',
      },
      errors: {
        proof: 'หลักฐานโครงการไม่พร้อมใช้งานตอนนี้ กรุณาตรวจสอบ local API server',
        history: 'ข้อมูลไทม์ไลน์ไม่พร้อมใช้งานตอนนี้ กรุณาตรวจสอบ local API server',
        visits: 'ข้อมูลการเข้าชมไม่พร้อมใช้งานตอนนี้',
      },
      notes: {
        latestVisit: 'การเข้าชมล่าสุด',
        staticSnapshot: 'สแนปช็อตสำหรับ GitHub Pages ส่วนนี้ยังไม่นับการเข้าชมแบบสด',
      },
      links: {
        viewSource: 'ดูแหล่งที่มา',
        viewLive: 'เปิดตัวอย่างจริง',
      },
    },
    zh: {
      tag: '证据仪表板',
      title: '我们能证明什么、它分布在哪里、以及它有多新',
      desc: '这一部分直接读取证据数据库中的实时记录，展示项目证明、区域分布、来源质量，以及可快速浏览的公开时间线。',
      localeNote: '这个切换器只影响 Evidence 区块',
      explainerKicker: '用白话解释',
      explainerText: '这一段更像一个仪表板，而不是宣传页。它会统计访问、按状态和区域整理证明，并指出每项主张背后有哪些公开记录。',
      summary: {
        visits: '已记录访问量',
        proof: '证明档案',
        regions: '覆盖区域',
        sources: '已验证来源',
        confidence: '平均可信度',
        proofNote: '带有真实证据支撑的项目记录',
        regionNote: '当前证明集中覆盖的运行区域数量',
        sourceNote: '支持这些记录的在线来源或公开参考数量',
        confidenceNote: '快速查看当前证明集合的强度',
      },
      visuals: {
        statusHeading: '交付状态',
        statusText: '哪些记录已经在线、仍在试点，或已经公开发布。',
        regionHeading: '区域分布',
        regionText: '当前证据主要集中在哪些地区。',
        typeHeading: '证据构成',
        typeText: '监测、运行室与公开参考工作之间的平衡。',
      },
      caseHeading: '项目证明',
      caseText: '每条记录都说明服务对象、交付内容、支撑来源，以及证据目前的新鲜度。',
      historyHeading: '公开时间线',
      historyText: '下面每一条都是支持这段故事的公开痕迹：发布、部署、工作坊或区域扩展。',
      historyMetaSuffix: '条记录已加载',
      filters: {
        all: '全部',
        live: '在线',
        pilot: '试点',
        launched: '已发布',
        published: '已公开',
        field: '现场',
      },
      statuses: {
        live: '在线',
        pilot: '试点',
        launched: '已发布',
        published: '已公开',
        field: '现场',
      },
      regions: {
        global: '全球',
        thailand: '泰国',
        asean: '东盟',
        local: '本地',
      },
      evidenceTypes: {
        monitor: '监测',
        operations: '运行室',
        index: '公开指数',
        keynote: '主题演讲',
        network: '网络层',
        roadmap: '路线图',
        brief: '简报',
        reference: '参考资料',
      },
      recordLabels: {
        client: '服务对象',
        location: '地点',
        stakeholder: '主要相关方',
        sector: '工作类型',
        deploymentWindow: '交付内容',
        decisionSurface: '支持了什么决策',
        outcome: '可衡量结果',
        source: '证明来源',
        verified: '最近验证',
        languages: '语言',
        confidence: '可信度',
        artifacts: '证据数量',
      },
      historyLabels: {
        proof: '证明说明',
        confidence: '可信度',
      },
      languages: {
        en: '英文',
        th: '泰文',
        zh: '中文',
      },
      loading: {
        status: '正在加载状态分布',
        region: '正在加载区域分布',
        type: '正在加载证据构成',
        proof: '正在加载项目证明',
        history: '正在加载时间线',
      },
      empty: {
        caseStudies: '还没有项目证明记录',
        filteredCaseStudies: '当前状态下还没有匹配的项目记录',
        history: '还没有时间线记录',
        bars: '还没有记录',
      },
      errors: {
        proof: '项目证明当前不可用，请检查本地 API 服务。',
        history: '时间线数据当前不可用，请检查本地 API 服务。',
        visits: '访问数据当前不可用。',
      },
      notes: {
        latestVisit: '最近访问',
        staticSnapshot: 'GitHub Pages 静态快照。这里不启用实时访问计数。',
      },
      links: {
        viewSource: '查看来源',
        viewLive: '查看在线示例',
      },
    },
  };

  const localeFormatters = {
    en: 'en-US',
    th: 'th-TH',
    zh: 'zh-CN',
  };

  const uiState = {
    locale: getStoredEvidenceLocale(),
    statusFilter: 'all',
    evidence: null,
  };

  const numberFormatter = new Intl.NumberFormat('en-US');

  localeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextLocale = button.getAttribute('data-locale');
      if (!nextLocale) return;
      if (typeof window.setAxiomLocale === 'function') {
        window.setAxiomLocale(nextLocale);
        return;
      }
      applyEvidenceLocale(nextLocale);
    });
  });

  window.addEventListener('axiom:localechange', (event) => {
    applyEvidenceLocale(event.detail?.locale);
  });

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

  function currentCopy() {
    return evidenceCopy[uiState.locale] || evidenceCopy.en;
  }

  function getStoredEvidenceLocale() {
    try {
      const stored = localStorage.getItem('axiom-evidence-locale');
      return evidenceCopy[stored] ? stored : 'en';
    } catch {
      return 'en';
    }
  }

  function persistEvidenceLocale(locale) {
    try {
      localStorage.setItem('axiom-evidence-locale', locale);
    } catch {
      // Ignore storage failures.
    }
  }

  function applyEvidenceLocale(locale) {
    if (!evidenceCopy[locale] || locale === uiState.locale) return;
    uiState.locale = locale;
    persistEvidenceLocale(locale);
    render();
  }

  function siteAssetUrl(assetPath) {
    const cleanPath = String(assetPath || '').replace(/^\/+/, '');
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const isRepoPath = pathParts[0]?.toLowerCase() === 'axiom';
    const basePath = (window.location.hostname.endsWith('github.io') || isRepoPath) && pathParts[0]
      ? `/${pathParts[0]}/`
      : '/';
    return new URL(cleanPath, `${window.location.origin}${basePath}`).toString();
  }

  function isStaticDeployment() {
    const firstPathSegment = window.location.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
    return window.location.hostname.endsWith('github.io') || firstPathSegment === 'axiom';
  }

  function apiUrl(apiPath) {
    return new URL(String(apiPath || '').replace(/^\/+/, ''), `${window.location.origin}/`).toString();
  }

  function localizedField(record, field) {
    if (uiState.locale === 'en') return record?.[field] || '';
    return record?.translations?.[uiState.locale]?.[field] || record?.[field] || '';
  }

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  function translateStatus(status) {
    const copy = currentCopy();
    return copy.statuses[status] || status || '—';
  }

  function translateRegion(regionCode) {
    const copy = currentCopy();
    return copy.regions[regionCode] || regionCode || '—';
  }

  function translateEvidenceType(type) {
    const copy = currentCopy();
    return copy.evidenceTypes[type] || type || '—';
  }

  function formatCoverage(coverage) {
    const copy = currentCopy();
    return String(coverage || 'en')
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)
      .map((value) => copy.languages[value] || value.toUpperCase())
      .join(' / ');
  }

  function formatTimestamp(timestamp) {
    if (!timestamp) return '—';

    try {
      const normalizedTimestamp = String(timestamp).includes('T')
        ? timestamp
        : String(timestamp).replace(' ', 'T') + 'Z';

      return new Intl.DateTimeFormat(localeFormatters[uiState.locale] || 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(normalizedTimestamp));
    } catch (error) {
      return timestamp;
    }
  }

  function renderStaticCopy() {
    const copy = currentCopy();
    setText('evidenceTag', copy.tag);
    setText('evidenceTitle', copy.title);
    setText('evidenceDesc', copy.desc);
    setText('evidenceLocaleNote', copy.localeNote);
    setText('evidenceExplainerKicker', copy.explainerKicker);
    setText('evidenceExplainerText', copy.explainerText);
    setText('evidenceVisitsLabel', copy.summary.visits);
    setText('evidenceProofLabel', copy.summary.proof);
    setText('evidenceRegionLabel', copy.summary.regions);
    setText('evidenceSourceLabel', copy.summary.sources);
    setText('evidenceConfidenceLabel', copy.summary.confidence);
    if (proofNoteEl) proofNoteEl.textContent = copy.summary.proofNote;
    if (regionNoteEl) regionNoteEl.textContent = copy.summary.regionNote;
    if (sourceNoteEl) sourceNoteEl.textContent = copy.summary.sourceNote;
    if (confidenceNoteEl) confidenceNoteEl.textContent = copy.summary.confidenceNote;
    setText('evidenceStatusHeading', copy.visuals.statusHeading);
    setText('evidenceStatusText', copy.visuals.statusText);
    setText('evidenceRegionHeading', copy.visuals.regionHeading);
    setText('evidenceRegionText', copy.visuals.regionText);
    setText('evidenceTypeHeading', copy.visuals.typeHeading);
    setText('evidenceTypeText', copy.visuals.typeText);
    setText('evidenceCaseHeading', copy.caseHeading);
    setText('evidenceCaseText', copy.caseText);
    setText('evidenceHistoryLabel', copy.historyHeading);
    setText('evidenceHistoryText', copy.historyText);

    localeButtons.forEach((button) => {
      button.classList.toggle('is-active', button.getAttribute('data-locale') === uiState.locale);
    });
  }

  function computeDashboard(analytics, caseStudies, contentHistory) {
    const statusCounts = new Map();
    const regionCounts = new Map();
    const typeCounts = new Map();
    const uniqueRegions = new Set();
    const uniqueSources = new Set();
    const confidenceScores = [];

    caseStudies.forEach((study) => {
      const status = study.status || 'published';
      const region = study.regionCode || 'global';
      const type = study.evidenceType || 'reference';

      statusCounts.set(status, (statusCounts.get(status) || 0) + 1);
      regionCounts.set(region, (regionCounts.get(region) || 0) + 1);
      typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
      uniqueRegions.add(region);

      const sourceKey = study.evidenceSourceUrl || study.linkUrl || study.evidenceSourceLabel;
      if (sourceKey) uniqueSources.add(sourceKey);

      if (Number.isFinite(Number(study.confidenceScore))) {
        confidenceScores.push(Number(study.confidenceScore));
      }
    });

    const averageConfidence = confidenceScores.length
      ? Math.round((confidenceScores.reduce((sum, value) => sum + value, 0) / confidenceScores.length) * 100)
      : 0;

    return {
      analytics,
      caseStudies,
      contentHistory,
      uniqueRegionCount: uniqueRegions.size,
      verifiedSourceCount: uniqueSources.size,
      averageConfidence,
      statusCounts: Array.from(statusCounts.entries()).map(([key, count]) => ({ key, count })),
      regionCounts: Array.from(regionCounts.entries()).map(([key, count]) => ({ key, count })),
      typeCounts: Array.from(typeCounts.entries()).map(([key, count]) => ({ key, count })),
    };
  }

  function renderSummary(dashboard) {
    const analytics = dashboard.analytics || {};
    const copy = currentCopy();
    const isStaticSnapshot = Boolean(analytics.staticMode || uiState.evidence?.source === 'static-snapshot');

    pageviewsEl.textContent = isStaticSnapshot
      ? 'Static'
      : numberFormatter.format(analytics.totalPageviews || 0);

    if (caseFilesEl) caseFilesEl.textContent = numberFormatter.format(dashboard.caseStudies.length || 0);
    if (regionsCoveredEl) regionsCoveredEl.textContent = numberFormatter.format(dashboard.uniqueRegionCount || 0);
    if (verifiedSourcesEl) verifiedSourcesEl.textContent = numberFormatter.format(dashboard.verifiedSourceCount || 0);
    if (averageConfidenceEl) averageConfidenceEl.textContent = `${dashboard.averageConfidence || 0}%`;

    if (pageviewsNoteEl) {
      pageviewsNoteEl.textContent = isStaticSnapshot
        ? `${copy.notes.staticSnapshot}${analytics.snapshotGeneratedAt ? ` · ${formatTimestamp(analytics.snapshotGeneratedAt)}` : ''}`
        : analytics.latestPageviewAt
        ? `${copy.notes.latestVisit}: ${formatTimestamp(analytics.latestPageviewAt)}`
        : copy.errors.visits;
    }
  }

  function renderBarList(target, items, labelFn) {
    const copy = currentCopy();
    if (!target) return;

    if (!items.length) {
      target.innerHTML = `<div class="evidence-loading">${escapeHtml(copy.empty.bars)}</div>`;
      return;
    }

    const maxCount = Math.max(...items.map((item) => item.count), 1);
    target.innerHTML = items.map((item) => {
      const width = Math.max(8, Math.round((item.count / maxCount) * 100));
      return `
        <div class="evidence-bar-row">
          <div class="evidence-bar-meta">
            <span class="evidence-bar-label">${escapeHtml(labelFn(item.key))}</span>
            <span class="evidence-bar-count">${numberFormatter.format(item.count)}</span>
          </div>
          <div class="evidence-bar-track">
            <div class="evidence-bar-fill" style="width:${width}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderFilters(caseStudies) {
    const copy = currentCopy();
    if (!filterStrip) return;

    const orderedStatuses = ['all', 'live', 'pilot', 'launched', 'published', 'field'];
    const activeStatuses = new Set(caseStudies.map((study) => study.status).filter(Boolean));
    const filters = orderedStatuses.filter((status) => status === 'all' || activeStatuses.has(status));

    filterStrip.innerHTML = filters.map((status) => `
      <button type="button" class="evidence-filter-button${uiState.statusFilter === status ? ' is-active' : ''}" data-status="${status}">
        ${escapeHtml(copy.filters[status] || status)}
      </button>
    `).join('');

    filterStrip.querySelectorAll('[data-status]').forEach((button) => {
      button.addEventListener('click', () => {
        uiState.statusFilter = button.getAttribute('data-status') || 'all';
        render();
      });
    });
  }

  function renderCaseStudies(caseStudies) {
    const copy = currentCopy();
    renderFilters(caseStudies);

    const filteredCaseStudies = uiState.statusFilter === 'all'
      ? caseStudies
      : caseStudies.filter((study) => study.status === uiState.statusFilter);

    if (!filteredCaseStudies.length) {
      caseStudyMount.innerHTML = `<div class="evidence-loading">${escapeHtml(copy.empty.filteredCaseStudies)}</div>`;
      return;
    }

    caseStudyMount.innerHTML = filteredCaseStudies.map((study) => {
      const details = [
        { label: copy.recordLabels.client, value: study.client },
        { label: copy.recordLabels.location, value: study.location },
        { label: copy.recordLabels.stakeholder, value: localizedField(study, 'stakeholder') },
        { label: copy.recordLabels.sector, value: study.sector },
        { label: copy.recordLabels.deploymentWindow, value: localizedField(study, 'deploymentWindow') },
        { label: copy.recordLabels.decisionSurface, value: localizedField(study, 'decisionSurface') },
        { label: copy.recordLabels.outcome, value: localizedField(study, 'outcome') },
      ].filter((detail) => detail.value);

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

      const sourceUrl = safeUrl(study.evidenceSourceUrl || study.linkUrl);
      const sourceLabel = localizedField(study, 'evidenceSourceLabel') || study.evidenceSourceLabel || study.linkLabel || copy.links.viewLive;
      const linkMarkup = sourceUrl
        ? `<a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener">${escapeHtml(sourceLabel)}</a>`
        : escapeHtml(sourceLabel || '—');

      return `
        <article class="case-study">
          <div class="case-study-badge-row">
            <div class="case-study-badge">${escapeHtml(study.badge)}</div>
            <div class="evidence-chip-row">
              <span class="evidence-chip">${escapeHtml(translateStatus(study.status))}</span>
              <span class="evidence-chip">${escapeHtml(translateRegion(study.regionCode))}</span>
              <span class="evidence-chip">${escapeHtml(translateEvidenceType(study.evidenceType))}</span>
            </div>
          </div>
          <h3 class="case-study-title">${escapeHtml(localizedField(study, 'title'))}</h3>
          <div class="evidence-proof-rail">
            <div class="evidence-proof-kpi">
              <span class="evidence-proof-value">${Math.round(Number(study.confidenceScore || 0) * 100)}%</span>
              <span class="evidence-proof-label">${escapeHtml(copy.recordLabels.confidence)}</span>
            </div>
            <div class="evidence-proof-kpi">
              <span class="evidence-proof-value">${escapeHtml(formatCoverage(study.languageCoverage))}</span>
              <span class="evidence-proof-label">${escapeHtml(copy.recordLabels.languages)}</span>
            </div>
            <div class="evidence-proof-kpi">
              <span class="evidence-proof-value">${numberFormatter.format(Number(study.artifactCount || 0))}</span>
              <span class="evidence-proof-label">${escapeHtml(copy.recordLabels.artifacts)}</span>
            </div>
          </div>
          <div class="case-study-content">
            <div class="case-study-details">${detailMarkup}</div>
            <details class="case-study-mobile-details">
              <summary>${escapeHtml(copy.caseHeading)}</summary>
              <div class="case-study-details">${detailMarkup}</div>
            </details>
            <div class="case-study-results">${resultsMarkup}</div>
          </div>
          <div class="case-study-note">
            ${escapeHtml(localizedField(study, 'summary'))}
            <span class="evidence-inline-meta">${escapeHtml(copy.recordLabels.source)}: ${linkMarkup}</span>
            <span class="evidence-inline-meta">${escapeHtml(copy.recordLabels.verified)}: ${escapeHtml(formatTimestamp(study.lastVerifiedAt))}</span>
            ${localizedField(study, 'note') ? `<span class="evidence-inline-note">${escapeHtml(localizedField(study, 'note'))}</span>` : ''}
          </div>
        </article>
      `;
    }).join('');
  }

  function renderContentHistory(items) {
    const copy = currentCopy();
    if (historyMeta) {
      historyMeta.textContent = items.length
        ? `${numberFormatter.format(items.length)} ${copy.historyMetaSuffix}`
        : copy.empty.history;
    }

    if (!items.length) {
      historyList.innerHTML = `<div class="evidence-loading">${escapeHtml(copy.empty.history)}</div>`;
      return;
    }

    historyList.innerHTML = items.map((item) => {
      const linkUrl = safeUrl(item.url);
      const linkMarkup = linkUrl
        ? `<a href="${escapeHtml(linkUrl)}" target="_blank" rel="noopener" class="evidence-history-link">${escapeHtml(copy.links.viewSource)}</a>`
        : '';
      const proofNote = localizedField(item, 'proofNote') || item.proofNote || '';

      return `
        <article class="evidence-history-item">
          <div class="evidence-history-top">
            <span class="evidence-history-period">${escapeHtml(localizedField(item, 'eventPeriod'))}</span>
            <div class="evidence-chip-row">
              <span class="evidence-history-pill">${escapeHtml(localizedField(item, 'category'))}</span>
              <span class="evidence-chip">${escapeHtml(translateStatus(item.status))}</span>
              <span class="evidence-chip">${escapeHtml(translateEvidenceType(item.artifactType))}</span>
            </div>
          </div>
          <h3 class="evidence-history-title">${escapeHtml(localizedField(item, 'title'))}</h3>
          <p class="evidence-history-summary">${escapeHtml(localizedField(item, 'summary'))}</p>
          ${proofNote ? `<p class="evidence-history-proof">${escapeHtml(copy.historyLabels.proof)}: ${escapeHtml(proofNote)}</p>` : ''}
          <div class="evidence-history-foot">
            <span class="evidence-history-source">${escapeHtml(localizedField(item, 'source'))}${item.location ? ' · ' + escapeHtml(item.location) : ''} · ${escapeHtml(copy.historyLabels.confidence)} ${Math.round(Number(item.confidenceScore || 0) * 100)}%</span>
            ${linkMarkup}
          </div>
        </article>
      `;
    }).join('');
  }

  async function trackPageview() {
    if (isStaticDeployment()) return;

    const payload = {
      path: window.location.pathname || '/',
      referrer: document.referrer || null,
      language: navigator.language || null,
    };

    try {
      await fetch(apiUrl('api/pageview'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } catch (error) {
      // Quietly fail — analytics should never block the experience.
    }
  }

  async function fetchJson(url, options = {}) {
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
  }

  async function loadEvidence() {
    if (isStaticDeployment()) {
      const snapshot = await fetchJson(siteAssetUrl('data/evidence-snapshot.json'), { cache: 'no-cache' });
      return {
        ...snapshot,
        source: 'static-snapshot',
        analytics: {
          ...(snapshot.analytics || {}),
          staticMode: true,
          snapshotGeneratedAt: snapshot.generatedAt || snapshot.analytics?.snapshotGeneratedAt || null,
        },
      };
    }

    try {
      const evidence = await fetchJson(apiUrl('api/evidence'), { cache: 'no-store' });
      return {
        ...evidence,
        source: 'api',
      };
    } catch (apiError) {
      const snapshot = await fetchJson(siteAssetUrl('data/evidence-snapshot.json'), { cache: 'no-cache' });
      return {
        ...snapshot,
        source: 'static-snapshot',
        analytics: {
          ...(snapshot.analytics || {}),
          staticMode: true,
          snapshotGeneratedAt: snapshot.generatedAt || snapshot.analytics?.snapshotGeneratedAt || null,
        },
      };
    }
  }

  async function init() {
    await trackPageview();
    uiState.evidence = await loadEvidence();
    render();
  }

  function render() {
    renderStaticCopy();

    if (!uiState.evidence) return;

    const dashboard = computeDashboard(
      uiState.evidence.analytics || {},
      uiState.evidence.caseStudies || [],
      uiState.evidence.contentHistory || []
    );

    renderSummary(dashboard);
    renderBarList(statusViz, dashboard.statusCounts, translateStatus);
    renderBarList(regionViz, dashboard.regionCounts, translateRegion);
    renderBarList(typeViz, dashboard.typeCounts, translateEvidenceType);
    renderCaseStudies(dashboard.caseStudies || []);
    renderContentHistory(dashboard.contentHistory || []);
  }

  init().catch(() => {
    const copy = currentCopy();
    caseStudyMount.innerHTML = `<div class="evidence-loading">${escapeHtml(copy.errors.proof)}</div>`;
    historyList.innerHTML = `<div class="evidence-loading">${escapeHtml(copy.errors.history)}</div>`;
    statusViz.innerHTML = `<div class="evidence-loading">${escapeHtml(copy.errors.proof)}</div>`;
    regionViz.innerHTML = `<div class="evidence-loading">${escapeHtml(copy.errors.proof)}</div>`;
    typeViz.innerHTML = `<div class="evidence-loading">${escapeHtml(copy.errors.proof)}</div>`;
    if (pageviewsNoteEl) pageviewsNoteEl.textContent = copy.errors.visits;
    if (historyMeta) historyMeta.textContent = 'API unavailable';
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
  const launcher = document.getElementById('commandLauncher');
  if (!overlay || !input || !body) return;

  const startTime = Date.now();
  let lastTerminalOpener = null;

  const destinations = {
    home: 'hero',
    hero: 'hero',
    systems: 'projects',
    services: 'capabilities',
    capabilities: 'capabilities',
    evidence: 'evidence',
    proof: 'evidence',
    launch: 'launch',
    beta: 'launch-beta',
    atlas: 'interface-atlas',
    interface: 'interface-atlas',
    team: 'team',
    impact: 'impact',
    press: 'featured',
    featured: 'featured',
    contact: 'contact',
  };

  function setTerminalState(isOpen) {
    overlay.classList.toggle('open', isOpen);
    document.body.classList.toggle('terminal-open', isOpen);
    if (launcher) launcher.setAttribute('aria-expanded', String(isOpen));
  }

  function openTerminal(opener = null) {
    lastTerminalOpener = opener || document.activeElement;
    setTerminalState(true);
    overlay.classList.add('open');
    setTimeout(() => input.focus(), 100);
  }

  function closeTerminal(options = {}) {
    const { restoreFocus = true } = options;
    setTerminalState(false);
    if (restoreFocus && lastTerminalOpener instanceof HTMLElement && lastTerminalOpener.isConnected) {
      lastTerminalOpener.focus();
    }
  }

  function scrollToDestination(rawTarget) {
    const normalized = String(rawTarget || '').trim().toLowerCase().replace(/^#/, '');
    const sectionId = destinations[normalized] || normalized;
    const target = document.getElementById(sectionId);

    if (!target) {
      addLine(`unknown destination: ${normalized || '(empty)'}`, 'terminal-line-error');
      addLine('try: go systems, go evidence, go launch, go contact');
      return;
    }

    closeTerminal({ restoreFocus: false });
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (launcher) {
    launcher.addEventListener('click', () => {
      if (overlay.classList.contains('open')) closeTerminal();
      else openTerminal(launcher);
    });
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
      else openTerminal(document.body);
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
      addLine('  go [name] — Jump to a section');
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
      addLine('  Philosophy: Precision, speed, no vanity platform work.');
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
      addLine(`\n  Total: ${systems.length} systems | 5 countries | live evidence trail`);
    },

    go: (args = []) => {
      scrollToDestination(args.join(' '));
    },

    evidence: () => {
      scrollToDestination('evidence');
    },

    launch: () => {
      scrollToDestination('launch');
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
      addLine('  01. Outcomes Before Optics');
      addLine('  02. AI as Water — invisible, essential');
      addLine('  03. The 36-Button Rule — simplicity by design');
      addLine('  04. Low-Fidelity, High-Impact');
      addLine('  05. Builders Stay Close');
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

    const [commandName, ...args] = cmd.split(/\s+/);
    if (commands[cmd]) {
      commands[cmd]();
    } else if (commands[commandName]) {
      commands[commandName](args);
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
        const copy = uiCopy[activeLocale]?.contact || uiCopy.en.contact;
        form.innerHTML = `
          <div class="contact-form-success">
            <div class="success-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3>${copy.successTitle}</h3>
            <p>${copy.successDesc}</p>
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
