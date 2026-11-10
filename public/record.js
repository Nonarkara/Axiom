/* Unabridged catalogue lines. The homepage shows a short face of the same sentences. */
(function () {
  const root = document.getElementById('record');
  if (!root || typeof uiCopy === 'undefined') return;

  const esc = (s) => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const plain = (s) => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const read = (locale, path) => {
    const parts = path.split('.');
    const pick = (loc) => parts.reduce((obj, key) => obj?.[key], uiCopy[loc]);
    const value = pick(locale);
    if (typeof value === 'string' && value.trim()) return value;
    const fallback = pick('en');
    return typeof fallback === 'string' ? fallback : '';
  };

  const HEADS = {
    en: ['Measured lines', 'How it works', 'In the field', 'Field notes'],
    th: ['ประโยคที่วัดได้', 'วิธีการ', 'ในพื้นที่', 'บันทึกภาคสนาม'],
    zh: ['已写明的句子', '做法', '现场', '现场笔记'],
    ko: ['적어 둔 문장', '진행', '현장', '현장 노트'],
    ja: ['書いてある文', '進め方', '現場', '現場ノート'],
    vi: ['Các câu đã viết', 'Cách làm', 'Hiện trường', 'Ghi chép'],
    ts: ['measured[]', 'steps[]', 'field[]', 'notes[]'],
  };
  const EXTRA_KEYS = [
    ['pitch.r1', 'pitch.r2', 'pitch.r3', 'pitch.r4', 'pitch.proofLine'],
    ['pitch.step1body', 'pitch.step2body', 'pitch.step3body', 'pitch.a1', 'pitch.a2', 'pitch.a3', 'pitch.a4', 'pitch.a5'],
    ['field.line', 'field.point1Desc', 'field.point2Desc', 'field.point3Desc'],
    ['notesContent.lede', 'notesContent.n1body', 'notesContent.n2body', 'notesContent.n3body', 'notesContent.n4body', 'notesContent.n5body', 'notesContent.n6body'],
  ];

  function render() {
    const locale = (typeof activeLocale === 'string' && uiCopy[activeLocale]) ? activeLocale : 'en';
    const panels = uiCopy.en.panels || {};
    const parts = [];
    for (const id of Object.keys(panels)) {
      const lede = read(locale, `panels.${id}.lede`);
      if (!lede) continue;
      const title = plain(read(locale, `panels.${id}.title`)) || id;
      parts.push(`<article class="record-entry"><h2>${esc(title)}</h2><p>${esc(lede)}</p></article>`);
    }
    const heads = HEADS[locale] || HEADS.en;
    EXTRA_KEYS.forEach((keys, index) => {
      const rows = keys.map((key) => read(locale, key)).filter(Boolean);
      if (!rows.length) return;
      parts.push(`<article class="record-entry"><h2>${esc(heads[index])}</h2>${rows.map((row) => `<p>${esc(row)}</p>`).join('')}</article>`);
    });
    root.innerHTML = parts.join('');
  }

  render();
  window.addEventListener('axiom:localechange', render);
})();
