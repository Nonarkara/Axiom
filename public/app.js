(function bootAxiomVNext() {
  const SITE_COPY = window.AXIOM_SITE_COPY || {};
  const DEFAULT_LOCALE = 'en';
  const REGION_LABELS = {
    en: {
      global: 'Global',
      thailand: 'Thailand',
      asean: 'ASEAN',
      local: 'Local',
    },
    th: {
      global: 'Global',
      thailand: 'ประเทศไทย',
      asean: 'อาเซียน',
      local: 'พื้นที่เฉพาะ',
    },
    zh: {
      global: '全球',
      thailand: '泰国',
      asean: '东盟',
      local: '本地',
    },
  };
  const UI_LABELS = {
    en: {
      loading: 'Loading...',
      close: 'Close',
      dismiss: 'Dismiss feedback',
      openNav: 'Open navigation',
      closeNav: 'Close navigation',
    },
    th: {
      loading: 'กำลังโหลด...',
      close: 'ปิด',
      dismiss: 'ปิดข้อความแจ้งเตือน',
      openNav: 'เปิดเมนูนำทาง',
      closeNav: 'ปิดเมนูนำทาง',
    },
    zh: {
      loading: '加载中...',
      close: '关闭',
      dismiss: '关闭反馈信息',
      openNav: '打开导航',
      closeNav: '关闭导航',
    },
  };
  const METRIC_LABEL_TRANSLATIONS = {
    th: {
      'Open and operational sources compressed into one live surface': 'แหล่งข้อมูลเปิดและใช้งานจริงที่ถูกรวมไว้ในพื้นผิวเดียว',
      'Continuous monitoring for escalation and spillover tracking': 'ใช้ติดตามการยกระดับและความเสี่ยงลุกลามอย่างต่อเนื่อง',
      'Multi-theater view across conflict, economy, and narrative': 'มุมมองหลายสมรภูมิ ครอบคลุมความขัดแย้ง เศรษฐกิจ และ narrative',
      'Field demo speed referenced in launch and press coverage': 'ความเร็วระดับเดโมภาคสนามที่ถูกอ้างอิงในงานเปิดตัวและสื่อ',
      'Browser-side ping reference captured on the homepage health layer': 'ค่าหน่วงอ้างอิงจากฝั่งเบราว์เซอร์ที่ถูกจับไว้ในชั้นสุขภาพของหน้าเว็บ',
      'Sensor and device count represented in the flagship ops room story': 'จำนวน sensor และอุปกรณ์ที่สะท้อนอยู่ในเรื่องราวของห้องปฏิบัติการหลัก',
      'Live telemetry architecture instead of static reporting': 'สถาปัตยกรรม telemetry สด แทนรายงานแบบคงที่',
      'Governor-grade operating surface, not a brochure dashboard': 'พื้นผิวการทำงานระดับผู้ว่าฯ ไม่ใช่แดชบอร์ดแบบโบรชัวร์',
      'Cities indexed in the launch story and public ranking narrative': 'จำนวนเมืองที่อยู่ในเรื่องเล่าการเปิดตัวและตรรกะการจัดอันดับสาธารณะ',
      'Nations represented in the Taipei launch context around the index': 'จำนวนประเทศที่ถูกพาดพิงในบริบทการเปิดตัวที่ไทเป',
      'Livability pillars exposed to users instead of hidden weighting logic': 'จำนวนเสาความน่าอยู่ที่เปิดให้ผู้ใช้เห็น แทนที่จะซ่อนไว้ในตรรกะการถ่วงน้ำหนัก',
      'Open programme surface designed to be defended in daylight': 'พื้นผิวโครงการแบบเปิดที่ออกแบบมาให้ป้องกันตัวเองได้ต่อหน้าสาธารณะ',
    },
    zh: {
      'Open and operational sources compressed into one live surface': '把开放且正在运行的来源压缩进一个实时界面',
      'Continuous monitoring for escalation and spillover tracking': '持续监测升级与外溢风险',
      'Multi-theater view across conflict, economy, and narrative': '跨冲突、经济与叙事的多剧场视角',
      'Field demo speed referenced in launch and press coverage': '在发布与报道中被引用的现场演示速度',
      'Browser-side ping reference captured on the homepage health layer': '首页健康层记录下来的浏览器侧延迟参考值',
      'Sensor and device count represented in the flagship ops room story': '旗舰运行室场景中代表的传感器与设备数量',
      'Live telemetry architecture instead of static reporting': '实时遥测架构，而不是静态报告',
      'Governor-grade operating surface, not a brochure dashboard': '面向省级决策的运行界面，而不是宣传型仪表盘',
      'Cities indexed in the launch story and public ranking narrative': '在发布叙事与公开排名中纳入索引的城市数',
      'Nations represented in the Taipei launch context around the index': '在台北发布语境中被提及的国家数',
      'Livability pillars exposed to users instead of hidden weighting logic': '向用户公开而非隐藏在权重逻辑里的宜居维度数',
      'Open programme surface designed to be defended in daylight': '一个被设计成可在公开场合自我辩护的开放项目界面',
    },
  };

  const state = {
    locale: getStoredLocale(),
    evidence: null,
    filter: 'all',
    isLoading: true,
    loadError: null,
    feedbackTimer: null,
    reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    revealed: new WeakSet(),
  };

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    bindEvents();
    render();

    try {
      state.evidence = await loadEvidence();
      state.isLoading = false;
      state.loadError = null;
      await trackPageview();
      render();

      const copy = getCopy();
      if (state.evidence?.source === 'static-snapshot') {
        showFeedbackStrip('info', copy.evidence.feedback.staticMode);
      } else {
        showFeedbackStrip('success', copy.evidence.feedback.apiMode);
      }
    } catch (error) {
      state.isLoading = false;
      state.loadError = error;
      render();
      showFeedbackStrip('error', getCopy().evidence.feedback.loadError, true);
    }
  }

  function bindEvents() {
    document.addEventListener('click', handleDocumentClick);

    const form = document.getElementById('contactForm');
    if (form) {
      form.addEventListener('submit', handleContactSubmit);
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth > 980) {
        closeMobilePanel();
      }
    });
  }

  function handleDocumentClick(event) {
    const target = event.target instanceof HTMLElement ? event.target : null;
    if (!target) return;

    const localeButton = target.closest('[data-locale]');
    if (localeButton instanceof HTMLElement) {
      const nextLocale = localeButton.getAttribute('data-locale');
      if (nextLocale && SITE_COPY[nextLocale] && nextLocale !== state.locale) {
        state.locale = nextLocale;
        persistLocale(nextLocale);
        render();
      }
      return;
    }

    const filterButton = target.closest('[data-filter]');
    if (filterButton instanceof HTMLElement) {
      const nextFilter = filterButton.getAttribute('data-filter') || 'all';
      if (nextFilter !== state.filter) {
        state.filter = nextFilter;
        render();
      }
      return;
    }

    if (target.closest('#navToggle')) {
      toggleMobilePanel();
      return;
    }

    if (target.closest('.mobile-link') || target.closest('#mobileCta')) {
      closeMobilePanel();
      return;
    }

    if (target.closest('.feedback-dismiss')) {
      hideFeedbackStrip();
      return;
    }
  }

  async function handleContactSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement)) return;

    const copy = getCopy();
    const submitButton = form.querySelector('button[type="submit"]');
    const originalLabel = submitButton?.textContent || '';

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
      submitButton.textContent = copy.teamContact.contact.fields.submit;
    }

    showFeedbackStrip('info', copy.teamContact.feedback.sending, true);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: new FormData(form),
      });

      if (!response.ok) {
        throw new Error(`Form submission failed: ${response.status}`);
      }

      form.reset();
      showFeedbackStrip('success', copy.teamContact.feedback.success, true);
    } catch (error) {
      showFeedbackStrip('error', copy.teamContact.feedback.error, true);
    } finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
        submitButton.textContent = originalLabel || copy.teamContact.contact.fields.submit;
      }
    }
  }

  function render() {
    const copy = getCopy();
    renderMeta(copy);
    renderNav(copy);
    renderHero(copy);
    renderOperatingModel(copy);
    renderFlagshipSystems(copy);
    renderEvidence(copy);
    renderPublicRecord(copy);
    renderTeamContact(copy);
    refreshEnhancements();
  }

  function renderMeta(copy) {
    document.documentElement.lang = state.locale;
    document.title = copy.hero.metaTitle;

    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', copy.hero.metaDescription);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (ogTitle) ogTitle.setAttribute('content', copy.hero.metaTitle);
    if (ogDescription) ogDescription.setAttribute('content', copy.hero.metaDescription);
    if (twitterTitle) twitterTitle.setAttribute('content', copy.hero.metaTitle);
    if (twitterDescription) twitterDescription.setAttribute('content', copy.hero.metaDescription);
  }

  function renderNav(copy) {
    setText('navOperatingModel', copy.hero.nav.operatingModel);
    setText('navFlagshipSystems', copy.hero.nav.flagshipSystems);
    setText('navEvidence', copy.hero.nav.evidence);
    setText('navPublicRecord', copy.hero.nav.publicRecord);
    setText('navTeamContact', copy.hero.nav.teamContact);
    setText('navCta', copy.hero.nav.cta);

    setText('mobileKicker', copy.hero.nav.mobileKicker);
    setText('mobileCopy', copy.hero.nav.mobileCopy);
    setText('mobileOperatingModel', copy.hero.nav.operatingModel);
    setText('mobileFlagshipSystems', copy.hero.nav.flagshipSystems);
    setText('mobileEvidence', copy.hero.nav.evidence);
    setText('mobilePublicRecord', copy.hero.nav.publicRecord);
    setText('mobileTeamContact', copy.hero.nav.teamContact);
    setText('mobileCta', copy.hero.nav.cta);
    updateNavToggleLabel();

    document.querySelectorAll('[data-locale]').forEach((button) => {
      button.classList.toggle('is-active', button.getAttribute('data-locale') === state.locale);
    });
  }

  function renderHero(copy) {
    setText('heroBadge', copy.hero.badge);
    setText('heroTitle', copy.hero.title);
    setText('heroSummary', copy.hero.summary);
    setText('heroPrimaryCta', copy.hero.primaryCta);
    setText('heroSecondaryCta', copy.hero.secondaryCta);
    setText('heroStripLabel', copy.hero.stripLabel);
    setText('heroStripBody', copy.hero.stripBody);
    setText('heroProofNote', copy.hero.proofNote);
    setText('heroFactPrimaryLabel', copy.hero.statPrimary);
    setText('heroFactPrimaryValue', copy.hero.statPrimaryValue);
    setText('heroFactSecondaryLabel', copy.hero.statSecondary);
    setText('heroFactSecondaryValue', copy.hero.statSecondaryValue);

    const proofStrip = document.getElementById('heroProofStrip');
    if (!proofStrip) return;

    const evidence = state.evidence;
    const caseStudyCount = evidence?.caseStudies?.length || copy.flagshipSystems.cards.length;
    const historyCount = evidence?.contentHistory?.length || copy.publicRecord.fieldProofCards.length + copy.publicRecord.references.length;
    const languageCount = 3;
    const deploymentMode = evidence?.source === 'static-snapshot' ? 'STATIC' : 'LIVE';
    const deploymentLabel = evidence?.source === 'static-snapshot' ? copy.hero.stripItems.deployment : copy.hero.stripItems.live;

    proofStrip.innerHTML = [
      renderProofStatCard({
        value: String(caseStudyCount),
        label: copy.hero.stripItems.flagship,
        countTo: caseStudyCount,
      }),
      renderProofStatCard({
        value: String(historyCount),
        label: copy.hero.stripItems.traces,
        countTo: historyCount,
      }),
      renderProofStatCard({
        value: String(languageCount),
        label: copy.hero.stripItems.languages,
        countTo: languageCount,
      }),
      renderProofStatCard({
        value: deploymentMode,
        label: deploymentLabel,
      }),
    ].join('');
  }

  function renderOperatingModel(copy) {
    setText('operatingTag', copy.operatingModel.tag);
    setText('operatingTitle', copy.operatingModel.title);
    setText('operatingSummary', copy.operatingModel.summary);

    const stepsMount = document.getElementById('operatingStepsMount');
    const proofMount = document.getElementById('operatingProofMount');
    if (stepsMount) {
      stepsMount.innerHTML = copy.operatingModel.steps.map((step) => `
        <article class="module-card step-card" data-reveal>
          <div class="step-head">
            <span class="card-label">${escapeHtml(step.phase)}</span>
            <span class="card-kicker">${escapeHtml(step.kicker)}</span>
          </div>
          <h3 class="card-title">${escapeHtml(step.title)}</h3>
          <p class="card-meta">${escapeHtml(step.body)}</p>
          <ul class="bullet-list">
            ${step.points.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}
          </ul>
        </article>
      `).join('');
    }

    if (proofMount) {
      proofMount.innerHTML = `
        <span class="card-label">${escapeHtml(copy.operatingModel.proofPanel.label)}</span>
        <h3 class="card-title">${escapeHtml(copy.operatingModel.proofPanel.title)}</h3>
        <p class="card-meta">${escapeHtml(copy.operatingModel.proofPanel.body)}</p>
        <ul class="bullet-list">
          ${copy.operatingModel.proofPanel.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      `;
    }
  }

  function renderFlagshipSystems(copy) {
    setText('systemsTag', copy.flagshipSystems.tag);
    setText('systemsTitle', copy.flagshipSystems.title);
    setText('systemsSummary', copy.flagshipSystems.summary);

    const mount = document.getElementById('flagshipSystemsMount');
    if (!mount) return;

    if (state.isLoading) {
      mount.innerHTML = `<div class="module-loading" data-reveal>${escapeHtml(getUiLabel('loading'))}</div>`;
      return;
    }

    if (!state.evidence?.caseStudies?.length) {
      mount.innerHTML = `<div class="empty-state" data-reveal>${escapeHtml(copy.evidence.feedback.loadError)}</div>`;
      return;
    }

    const cards = copy.flagshipSystems.cards.map((card) => {
      const record = state.evidence.caseStudies.find((study) => study.slug === card.slug);
      if (!record) return '';
      return renderSystemRecordCard(record, card, copy);
    }).filter(Boolean);

    mount.innerHTML = cards.length
      ? cards.join('')
      : `<div class="empty-state" data-reveal>${escapeHtml(copy.evidence.empty.caseStudies)}</div>`;
  }

  function renderEvidence(copy) {
    setText('evidenceTag', copy.evidence.tag);
    setText('evidenceTitle', copy.evidence.title);
    setText('evidenceSummary', copy.evidence.summary);
    setText('evidenceLocaleNote', copy.evidence.localeNote);
    setText('evidenceExplainerLabel', copy.evidence.explainerLabel);
    setText('evidenceExplainerText', copy.evidence.explainerText);
    setText('statusChartTitle', copy.evidence.charts.statusTitle);
    setText('statusChartText', copy.evidence.charts.statusText);
    setText('regionChartTitle', copy.evidence.charts.regionTitle);
    setText('regionChartText', copy.evidence.charts.regionText);
    setText('typeChartTitle', copy.evidence.charts.typeTitle);
    setText('typeChartText', copy.evidence.charts.typeText);
    setText('caseStudiesTitle', copy.evidence.caseStudies.title);
    setText('caseStudiesText', copy.evidence.caseStudies.text);
    setText('historyTitle', copy.evidence.history.title);
    setText('historyText', copy.evidence.history.text);

    const summaryMount = document.getElementById('evidenceSummaryMount');
    const filterMount = document.getElementById('evidenceFilterStrip');
    const caseMount = document.getElementById('caseStudyProofMount');
    const historyList = document.getElementById('contentHistoryList');
    const historyMeta = document.getElementById('contentHistoryMeta');
    const statusMount = document.getElementById('evidenceStatusViz');
    const regionMount = document.getElementById('evidenceRegionViz');
    const typeMount = document.getElementById('evidenceTypeViz');

    if (!summaryMount || !filterMount || !caseMount || !historyList || !historyMeta || !statusMount || !regionMount || !typeMount) {
      return;
    }

    if (state.isLoading) {
      const loading = escapeHtml(getUiLabel('loading'));
      summaryMount.innerHTML = `<div class="module-loading" data-reveal>${loading}</div>`;
      filterMount.innerHTML = '';
      caseMount.innerHTML = `<div class="module-loading" data-reveal>${loading}</div>`;
      historyList.innerHTML = `<div class="module-loading" data-reveal>${loading}</div>`;
      historyMeta.textContent = getUiLabel('loading');
      statusMount.innerHTML = `<div class="module-loading">${loading}</div>`;
      regionMount.innerHTML = `<div class="module-loading">${loading}</div>`;
      typeMount.innerHTML = `<div class="module-loading">${loading}</div>`;
      return;
    }

    if (!state.evidence) {
      summaryMount.innerHTML = `<div class="empty-state" data-reveal>${escapeHtml(copy.evidence.feedback.loadError)}</div>`;
      filterMount.innerHTML = '';
      caseMount.innerHTML = `<div class="empty-state">${escapeHtml(copy.evidence.feedback.loadError)}</div>`;
      historyList.innerHTML = `<div class="empty-state">${escapeHtml(copy.evidence.feedback.loadError)}</div>`;
      historyMeta.textContent = copy.evidence.feedback.loadError;
      statusMount.innerHTML = `<div class="empty-state">${escapeHtml(copy.evidence.feedback.loadError)}</div>`;
      regionMount.innerHTML = `<div class="empty-state">${escapeHtml(copy.evidence.feedback.loadError)}</div>`;
      typeMount.innerHTML = `<div class="empty-state">${escapeHtml(copy.evidence.feedback.loadError)}</div>`;
      return;
    }

    const dashboard = computeDashboard();

    summaryMount.innerHTML = [
      renderProofStatCard({
        value: String(dashboard.totalPageviews),
        label: copy.evidence.summaryCards.visits,
        secondary: copy.evidence.summaryCards.visitsNote,
        countTo: dashboard.totalPageviews,
      }),
      renderProofStatCard({
        value: String(dashboard.caseStudyCount),
        label: copy.evidence.summaryCards.proof,
        secondary: copy.evidence.summaryCards.proofNote,
        countTo: dashboard.caseStudyCount,
      }),
      renderProofStatCard({
        value: String(dashboard.regionCount),
        label: copy.evidence.summaryCards.regions,
        secondary: copy.evidence.summaryCards.regionsNote,
        countTo: dashboard.regionCount,
      }),
      renderProofStatCard({
        value: String(dashboard.sourceCount),
        label: copy.evidence.summaryCards.sources,
        secondary: copy.evidence.summaryCards.sourcesNote,
        countTo: dashboard.sourceCount,
      }),
      renderProofStatCard({
        value: `${dashboard.averageConfidence}%`,
        label: copy.evidence.summaryCards.confidence,
        secondary: copy.evidence.summaryCards.confidenceNote,
        countTo: dashboard.averageConfidence,
        suffix: '%',
      }),
    ].join('');

    filterMount.innerHTML = Object.entries(copy.evidence.caseStudies.filters).map(([key, label]) => `
      <button type="button" class="filter-pill${state.filter === key ? ' is-active' : ''}" data-filter="${escapeHtml(key)}">
        ${escapeHtml(label)}
      </button>
    `).join('');

    statusMount.innerHTML = renderBarList(dashboard.statusCounts, (value) => translateStatus(value), copy.evidence.empty.bars);
    regionMount.innerHTML = renderBarList(dashboard.regionCounts, (value) => translateRegion(value), copy.evidence.empty.bars);
    typeMount.innerHTML = renderBarList(dashboard.typeCounts, (value) => translateEvidenceType(value), copy.evidence.empty.bars);

    const filteredCaseStudies = state.filter === 'all'
      ? dashboard.caseStudies
      : dashboard.caseStudies.filter((study) => study.status === state.filter);

    if (!filteredCaseStudies.length) {
      caseMount.innerHTML = `<div class="empty-state" data-reveal>${escapeHtml(state.filter === 'all' ? copy.evidence.empty.caseStudies : copy.evidence.empty.filteredCaseStudies)}</div>`;
    } else {
      caseMount.innerHTML = filteredCaseStudies.map((study) => {
        const media = copy.flagshipSystems.cards.find((card) => card.slug === study.slug) || null;
        return renderSystemRecordCard(study, media, copy, true);
      }).join('');
    }

    historyMeta.textContent = `${dashboard.history.length} ${copy.evidence.history.countSuffix}`;
    if (!dashboard.history.length) {
      historyList.innerHTML = `<div class="empty-state">${escapeHtml(copy.evidence.empty.history)}</div>`;
    } else {
      historyList.innerHTML = dashboard.history.map((item) => renderHistoryItem(item, copy)).join('');
    }
  }

  function renderPublicRecord(copy) {
    setText('publicRecordTag', copy.publicRecord.tag);
    setText('publicRecordTitle', copy.publicRecord.title);
    setText('publicRecordSummary', copy.publicRecord.summary);
    setText('fieldProofLabel', copy.publicRecord.fieldProofLabel);
    setText('fieldProofText', copy.publicRecord.fieldProofText);
    setText('referenceLabel', copy.publicRecord.referenceLabel);
    setText('referenceText', copy.publicRecord.referenceText);

    const fieldProofMount = document.getElementById('fieldProofMount');
    const publicReferenceMount = document.getElementById('publicReferenceMount');
    if (!fieldProofMount || !publicReferenceMount) return;

    if (state.isLoading) {
      const loading = escapeHtml(getUiLabel('loading'));
      fieldProofMount.innerHTML = `<div class="module-loading" data-reveal>${loading}</div>`;
      publicReferenceMount.innerHTML = `<div class="module-loading" data-reveal>${loading}</div>`;
      return;
    }

    const history = state.evidence?.contentHistory || [];
    const fieldProofCards = copy.publicRecord.fieldProofCards.map((card) => {
      const record = history.find((item) => {
        if (card.historyId && Number(item.id) === Number(card.historyId)) {
          return true;
        }

        if (card.historyOrder && Number(item.historyOrder) === Number(card.historyOrder)) {
          return true;
        }

        return false;
      });
      return record ? renderFieldProofCard(record, card, copy) : '';
    }).filter(Boolean);

    fieldProofMount.innerHTML = fieldProofCards.length
      ? fieldProofCards.join('')
      : `<div class="empty-state" data-reveal>${escapeHtml(copy.evidence.empty.history)}</div>`;

    publicReferenceMount.innerHTML = copy.publicRecord.references.map((reference) => renderPublicRecordRow(reference, copy)).join('');
  }

  function renderTeamContact(copy) {
    setText('teamTag', copy.teamContact.tag);
    setText('teamTitle', copy.teamContact.title);
    setText('teamSummary', copy.teamContact.summary);

    const founderMount = document.getElementById('founderBandMount');
    const networkMount = document.getElementById('networkBandMount');
    if (founderMount) {
      founderMount.innerHTML = `
        <div class="founder-band-layout">
          <div class="founder-band-copy">
            <span class="card-label">${escapeHtml(copy.teamContact.founderBand.label)}</span>
            <h3 class="card-title">${escapeHtml(copy.teamContact.founderBand.title)}</h3>
            <p class="card-meta">${escapeHtml(copy.teamContact.founderBand.body)}</p>
            <ul class="bullet-list">
              ${copy.teamContact.founderBand.points.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}
            </ul>
          </div>
          <figure class="founder-figure">
            <img src="${escapeHtml(copy.teamContact.founderBand.image)}" alt="${escapeHtml(copy.teamContact.founderBand.imageAlt)}" class="founder-photo" loading="lazy">
            <figcaption>${escapeHtml(copy.teamContact.founderBand.caption)}</figcaption>
          </figure>
        </div>
      `;
    }

    if (networkMount) {
      networkMount.innerHTML = `
        <span class="card-label">${escapeHtml(copy.teamContact.networkBand.label)}</span>
        <h3 class="card-title">${escapeHtml(copy.teamContact.networkBand.title)}</h3>
        <p class="card-meta">${escapeHtml(copy.teamContact.networkBand.body)}</p>
        <ul class="bullet-list">
          ${copy.teamContact.networkBand.rules.map((rule) => `<li>${escapeHtml(rule)}</li>`).join('')}
        </ul>
      `;
    }

    setText('contactLabel', copy.teamContact.contact.label);
    setText('contactTitle', copy.teamContact.contact.title);
    setText('contactBody', copy.teamContact.contact.body);
    setText('contactNameLabel', copy.teamContact.contact.fields.name);
    setText('contactEmailLabel', copy.teamContact.contact.fields.email);
    setText('contactMessageLabel', copy.teamContact.contact.fields.message);
    setText('contactSubmit', copy.teamContact.contact.fields.submit);
    setText('footerStrapline', copy.teamContact.footer.strapline);
    setText('footerLocation', copy.teamContact.footer.location);
    setText('footerFinePrint', copy.teamContact.footer.finePrint);

    const commitments = document.getElementById('contactCommitments');
    if (commitments) {
      commitments.innerHTML = copy.teamContact.contact.commitments.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
    }
  }

  function renderSystemRecordCard(record, media, copy, compact = false) {
    const labels = copy.flagshipSystems.labels;
    const localizedTitle = localizedCaseStudyField(record, 'title');
    const sourceUrl = safeUrl(record.evidenceSourceUrl || record.linkUrl || '');
    const metricSlice = Array.isArray(record.metrics) ? record.metrics.slice(0, 3) : [];

    return `
      <article class="system-card module-card${compact ? ' system-card-compact' : ''}" data-reveal>
        ${media?.image ? `
          <div class="system-media">
            <img src="${escapeHtml(media.image)}" alt="${escapeHtml(media.imageAlt || localizedTitle)}" loading="lazy">
          </div>
        ` : ''}
        <div class="system-body">
          <div class="system-head">
            <span class="card-label">${escapeHtml(media?.mode || record.evidenceType || record.status || 'SYSTEM')}</span>
            <span class="card-kicker">${escapeHtml(translateStatus(record.status))}</span>
          </div>
          <h3 class="card-title">${escapeHtml(localizedTitle)}</h3>
          <p class="card-meta">${escapeHtml(media?.blurb || localizedCaseStudyField(record, 'summary'))}</p>

          <dl class="detail-grid">
            <div>
              <dt>${escapeHtml(labels.who)}</dt>
              <dd>${escapeHtml(localizedCaseStudyField(record, 'stakeholder') || record.client || '')}</dd>
            </div>
            <div>
              <dt>${escapeHtml(labels.location)}</dt>
              <dd>${escapeHtml(record.location || '')}</dd>
            </div>
            <div>
              <dt>${escapeHtml(labels.delivered)}</dt>
              <dd>${escapeHtml(localizedCaseStudyField(record, 'deploymentWindow'))}</dd>
            </div>
            <div>
              <dt>${escapeHtml(labels.decision)}</dt>
              <dd>${escapeHtml(localizedCaseStudyField(record, 'decisionSurface'))}</dd>
            </div>
            <div>
              <dt>${escapeHtml(labels.outcome)}</dt>
              <dd>${escapeHtml(localizedCaseStudyField(record, 'outcome'))}</dd>
            </div>
            <div>
              <dt>${escapeHtml(labels.source)}</dt>
              <dd>${escapeHtml(localizedCaseStudyField(record, 'evidenceSourceLabel') || record.evidenceSourceLabel || '')}</dd>
            </div>
          </dl>

          <div class="metric-row">
            ${metricSlice.map((metric) => `
              <article class="mini-metric">
                <strong>${escapeHtml(metric.value)}</strong>
                <span>${escapeHtml(translateMetricLabel(metric.label))}</span>
              </article>
            `).join('')}
          </div>

          <div class="system-foot">
            <span class="meta-inline">${escapeHtml(copy.evidence.labels.confidence)} ${Math.round(Number(record.confidenceScore || 0) * 100)}%</span>
            <span class="meta-inline">${escapeHtml(copy.evidence.labels.artifacts)} ${escapeHtml(String(record.artifactCount || metricSlice.length || 0))}</span>
            <span class="meta-inline">${escapeHtml(copy.evidence.labels.verified)} ${escapeHtml(formatDate(record.lastVerifiedAt))}</span>
            ${sourceUrl ? `<a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener" class="inline-link">${escapeHtml(labels.live)}</a>` : ''}
          </div>
        </div>
      </article>
    `;
  }

  function renderHistoryItem(item, copy) {
    const linkUrl = safeUrl(item.url || '');
    return `
      <article class="history-item" data-reveal>
        <div class="history-item-head">
          <span class="card-label">${escapeHtml(localizedHistoryField(item, 'eventPeriod'))}</span>
          <span class="card-kicker">${escapeHtml(translateEvidenceType(item.artifactType))}</span>
        </div>
        <h3 class="history-item-title">${escapeHtml(localizedHistoryField(item, 'title'))}</h3>
        <p class="card-meta">${escapeHtml(localizedHistoryField(item, 'summary'))}</p>
        <p class="history-proof-note">${escapeHtml(copy.evidence.labels.historyProof)}: ${escapeHtml(localizedHistoryField(item, 'proofNote') || item.proofNote || '')}</p>
        <div class="history-item-foot">
          <span class="meta-inline">${escapeHtml(localizedHistoryField(item, 'source'))}</span>
          <span class="meta-inline">${escapeHtml(copy.evidence.labels.confidence)} ${Math.round(Number(item.confidenceScore || 0) * 100)}%</span>
          ${linkUrl ? `<a href="${escapeHtml(linkUrl)}" target="_blank" rel="noopener" class="inline-link">${escapeHtml(copy.evidence.labels.liveLink)}</a>` : ''}
        </div>
      </article>
    `;
  }

  function renderFieldProofCard(record, card, copy) {
    const linkUrl = safeUrl(record.url || '');
    const title = card.title || localizedHistoryField(record, 'title');
    const summary = card.summary || localizedHistoryField(record, 'summary');

    return `
      <article class="field-proof-card module-card" data-reveal>
        <div class="field-proof-media">
          <img src="${escapeHtml(card.image)}" alt="${escapeHtml(card.imageAlt)}" loading="lazy">
        </div>
        <div class="field-proof-body">
          <span class="card-label">${escapeHtml(card.kicker)}</span>
          <h3 class="card-title">${escapeHtml(title)}</h3>
          <p class="card-meta">${escapeHtml(summary)}</p>
          <div class="field-proof-meta">
            <span class="meta-inline">${escapeHtml(copy.publicRecord.labels.period)} ${escapeHtml(localizedHistoryField(record, 'eventPeriod'))}</span>
            <span class="meta-inline">${escapeHtml(copy.publicRecord.labels.source)} ${escapeHtml(localizedHistoryField(record, 'source'))}</span>
          </div>
          <p class="history-proof-note">${escapeHtml(copy.publicRecord.labels.proof)}: ${escapeHtml(localizedHistoryField(record, 'proofNote') || record.proofNote || '')}</p>
          ${linkUrl ? `<a href="${escapeHtml(linkUrl)}" target="_blank" rel="noopener" class="inline-link">${escapeHtml(copy.publicRecord.labels.open)}</a>` : ''}
        </div>
      </article>
    `;
  }

  function renderPublicRecordRow(reference, copy) {
    const linkUrl = safeUrl(reference.url || '');
    return `
      <article class="reference-row module-card" data-reveal>
        <div class="reference-copy">
          <div class="reference-head">
            <span class="card-label">${escapeHtml(reference.source)}</span>
            <span class="card-kicker">${escapeHtml(reference.type)}</span>
          </div>
          <h3 class="card-title reference-title">${escapeHtml(reference.title)}</h3>
          <p class="card-meta">${escapeHtml(reference.summary)}</p>
        </div>
        ${linkUrl ? `<a href="${escapeHtml(linkUrl)}" target="_blank" rel="noopener" class="btn btn-secondary reference-link">${escapeHtml(copy.publicRecord.labels.open)}</a>` : ''}
      </article>
    `;
  }

  function renderProofStatCard({ value, label, secondary = '', countTo = null, suffix = '' }) {
    const countAttr = typeof countTo === 'number'
      ? ` data-count-to="${escapeHtml(String(countTo))}" data-count-suffix="${escapeHtml(suffix)}"`
      : '';

    return `
      <article class="proof-stat-card" data-reveal>
        <strong class="proof-stat-value"${countAttr}>${escapeHtml(value)}</strong>
        <span class="proof-stat-label">${escapeHtml(label)}</span>
        ${secondary ? `<span class="proof-stat-secondary">${escapeHtml(secondary)}</span>` : ''}
      </article>
    `;
  }

  function renderBarList(counts, labelResolver, emptyText) {
    const entries = Object.entries(counts).sort((left, right) => right[1] - left[1]);
    if (!entries.length) {
      return `<div class="empty-state">${escapeHtml(emptyText)}</div>`;
    }

    const max = entries[0][1] || 1;
    return entries.map(([key, value]) => `
      <div class="bar-row">
        <div class="bar-row-head">
          <span class="bar-label">${escapeHtml(labelResolver(key))}</span>
          <span class="bar-value">${escapeHtml(String(value))}</span>
        </div>
        <div class="bar-track">
          <span class="bar-fill" style="width:${Math.max((value / max) * 100, 8)}%"></span>
        </div>
      </div>
    `).join('');
  }

  function computeDashboard() {
    const caseStudies = Array.isArray(state.evidence?.caseStudies) ? state.evidence.caseStudies : [];
    const history = Array.isArray(state.evidence?.contentHistory) ? state.evidence.contentHistory : [];
    const regionCodes = new Set(caseStudies.map((study) => study.regionCode).filter(Boolean));
    const sourceUrls = new Set([
      ...caseStudies.map((study) => study.evidenceSourceUrl).filter(Boolean),
      ...history.map((item) => item.url).filter(Boolean),
    ]);
    const confidenceValues = [
      ...caseStudies.map((study) => Number(study.confidenceScore || 0)),
      ...history.map((item) => Number(item.confidenceScore || 0)),
    ].filter((value) => Number.isFinite(value) && value > 0);

    return {
      totalPageviews: Number(state.evidence?.analytics?.totalPageviews || 0),
      caseStudyCount: caseStudies.length,
      regionCount: regionCodes.size,
      sourceCount: sourceUrls.size,
      averageConfidence: confidenceValues.length
        ? Math.round((confidenceValues.reduce((sum, value) => sum + value, 0) / confidenceValues.length) * 100)
        : 0,
      statusCounts: aggregateCounts([
        ...caseStudies.map((study) => study.status),
        ...history.map((item) => item.status),
      ]),
      regionCounts: aggregateCounts(caseStudies.map((study) => study.regionCode)),
      typeCounts: aggregateCounts([
        ...caseStudies.map((study) => study.evidenceType),
        ...history.map((item) => item.artifactType),
      ]),
      caseStudies,
      history,
    };
  }

  function aggregateCounts(values) {
    return values.reduce((accumulator, value) => {
      if (!value) return accumulator;
      const key = String(value);
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {});
  }

  function translateStatus(status) {
    return getCopy().evidence.statuses[status] || status;
  }

  function translateEvidenceType(type) {
    return getCopy().evidence.evidenceTypes[type] || type;
  }

  function translateRegion(regionCode) {
    return (REGION_LABELS[state.locale] && REGION_LABELS[state.locale][regionCode]) || regionCode || '';
  }

  function translateMetricLabel(label) {
    return METRIC_LABEL_TRANSLATIONS[state.locale]?.[label] || label;
  }

  function localizedCaseStudyField(record, field) {
    if (state.locale === DEFAULT_LOCALE) return record?.[field] || '';
    return record?.translations?.[state.locale]?.[field] || record?.[field] || '';
  }

  function localizedHistoryField(record, field) {
    if (state.locale === DEFAULT_LOCALE) return record?.[field] || '';
    return record?.translations?.[state.locale]?.[field] || record?.[field] || '';
  }

  function getCopy() {
    return SITE_COPY[state.locale] || SITE_COPY[DEFAULT_LOCALE];
  }

  function getUiLabel(key) {
    return UI_LABELS[state.locale]?.[key] || UI_LABELS[DEFAULT_LOCALE][key] || '';
  }

  function getStoredLocale() {
    try {
      const stored = localStorage.getItem('axiom-public-locale');
      if (stored && SITE_COPY[stored]) return stored;
    } catch {
      // Ignore storage failures.
    }
    return DEFAULT_LOCALE;
  }

  function persistLocale(locale) {
    try {
      localStorage.setItem('axiom-public-locale', locale);
    } catch {
      // Ignore storage failures.
    }
  }

  function safeUrl(value) {
    if (!value) return '';
    try {
      const url = new URL(value, window.location.origin);
      if (!['http:', 'https:', 'mailto:'].includes(url.protocol)) return '';
      return url.toString();
    } catch {
      return '';
    }
  }

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function formatDate(value) {
    if (!value) return '-';
    const normalized = value.includes('T') ? value : value.replace(' ', 'T');
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return value;

    const localeMap = {
      en: 'en-GB',
      th: 'th-TH',
      zh: 'zh-CN',
    };

    return new Intl.DateTimeFormat(localeMap[state.locale] || 'en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }

  function showFeedbackStrip(tone, message, sticky = false) {
    const strip = document.getElementById('feedbackStrip');
    if (!strip) return;

    clearTimeout(state.feedbackTimer);
    strip.hidden = false;
    strip.className = `feedback-strip tone-${tone}`;
    strip.innerHTML = `
      <span class="feedback-message">${escapeHtml(message)}</span>
      <button type="button" class="feedback-dismiss" aria-label="${escapeHtml(getUiLabel('dismiss'))}">${escapeHtml(getUiLabel('close'))}</button>
    `;

    if (!sticky) {
      state.feedbackTimer = window.setTimeout(() => {
        hideFeedbackStrip();
      }, 4000);
    }
  }

  function hideFeedbackStrip() {
    const strip = document.getElementById('feedbackStrip');
    if (!strip) return;
    strip.hidden = true;
    strip.innerHTML = '';
  }

  function toggleMobilePanel() {
    const panel = document.getElementById('mobilePanel');
    const toggle = document.getElementById('navToggle');
    if (!panel || !toggle) return;

    const isOpen = !panel.hidden;
    panel.hidden = isOpen;
    document.body.classList.toggle('menu-open', !isOpen);
    toggle.setAttribute('aria-expanded', String(!isOpen));
    updateNavToggleLabel();
  }

  function closeMobilePanel() {
    const panel = document.getElementById('mobilePanel');
    const toggle = document.getElementById('navToggle');
    if (!panel || !toggle) return;
    panel.hidden = true;
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    updateNavToggleLabel();
  }

  function updateNavToggleLabel() {
    const toggle = document.getElementById('navToggle');
    const panel = document.getElementById('mobilePanel');
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-label', panel.hidden ? getUiLabel('openNav') : getUiLabel('closeNav'));
  }

  function refreshEnhancements() {
    refreshRevealObserver();
    refreshCounterObserver();
  }

  function refreshRevealObserver() {
    const targets = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!targets.length) return;

    if (state.reduceMotion || !('IntersectionObserver' in window)) {
      document.documentElement.classList.remove('motion-ok');
      targets.forEach((target) => target.classList.add('is-in'));
      return;
    }

    document.documentElement.classList.add('motion-ok');
    targets.forEach((target) => {
      if (state.revealed.has(target)) {
        target.classList.add('is-in');
      }
    });

    if (state.revealObserver) {
      state.revealObserver.disconnect();
    }

    state.revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          state.revealed.add(entry.target);
          state.revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

    targets.forEach((target) => {
      if (!target.classList.contains('is-in')) {
        state.revealObserver.observe(target);
      }
    });
  }

  function refreshCounterObserver() {
    const counters = Array.from(document.querySelectorAll('[data-count-to]'));
    if (!counters.length) return;

    const finalize = (node) => {
      const countTo = Number(node.getAttribute('data-count-to') || '0');
      const suffix = node.getAttribute('data-count-suffix') || '';
      node.textContent = `${countTo}${suffix}`;
      node.dataset.countDone = 'true';
    };

    if (state.reduceMotion || !('IntersectionObserver' in window)) {
      counters.forEach(finalize);
      return;
    }

    if (state.counterObserver) {
      state.counterObserver.disconnect();
    }

    state.counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        state.counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    counters.forEach((counter) => {
      if (counter.dataset.countDone === 'true') return;
      state.counterObserver.observe(counter);
    });

    function animateCounter(node) {
      if (!(node instanceof HTMLElement)) return;
      const countTo = Number(node.getAttribute('data-count-to') || '0');
      const suffix = node.getAttribute('data-count-suffix') || '';
      const duration = 900;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = `${Math.round(countTo * eased)}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          node.dataset.countDone = 'true';
        }
      };

      requestAnimationFrame(step);
    }
  }

  function siteAssetUrl(assetPath) {
    const cleanPath = String(assetPath || '').replace(/^\/+/, '');
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const firstSegment = pathParts[0]?.toLowerCase();
    const basePath = (window.location.hostname.endsWith('github.io') || firstSegment === 'axiom') && pathParts[0]
      ? `/${pathParts[0]}/`
      : '/';
    return new URL(cleanPath, `${window.location.origin}${basePath}`).toString();
  }

  function apiUrl(apiPath) {
    return new URL(String(apiPath || '').replace(/^\/+/, ''), `${window.location.origin}/`).toString();
  }

  function isStaticDeployment() {
    const firstSegment = window.location.pathname.split('/').filter(Boolean)[0]?.toLowerCase();
    return window.location.hostname.endsWith('github.io') || firstSegment === 'axiom';
  }

  async function fetchJson(url, options = {}) {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
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
      };
    }

    try {
      const payload = await fetchJson(apiUrl('api/evidence'), { cache: 'no-store' });
      return {
        ...payload,
        source: 'api',
      };
    } catch (error) {
      const snapshot = await fetchJson(siteAssetUrl('data/evidence-snapshot.json'), { cache: 'no-cache' });
      return {
        ...snapshot,
        source: 'static-snapshot',
      };
    }
  }

  async function trackPageview() {
    if (isStaticDeployment()) return;

    try {
      await fetch(apiUrl('api/pageview'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: window.location.pathname || '/',
          referrer: document.referrer || null,
          language: state.locale,
        }),
        keepalive: true,
      });
    } catch {
      // Analytics must never block the experience.
    }
  }
})();
