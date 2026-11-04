// Publication metadata stays in its published language; interface copy is localized.
export const researchCopy = {
  en: { title: 'Research', notice: 'Preprints · Not peer-reviewed', pdf: 'Download PDF', source: 'Source', empty: 'No preprints published yet.' },
  th: { title: 'งานวิจัย', notice: 'บทความฉบับก่อนตีพิมพ์ · ยังไม่ผ่านการประเมินโดยผู้ทรงคุณวุฒิ', pdf: 'ดาวน์โหลด PDF', source: 'แหล่งที่มา', empty: 'ยังไม่มีบทความฉบับก่อนตีพิมพ์' },
  zh: { title: '研究', notice: '预印本 · 未经同行评审', pdf: '下载 PDF', source: '来源', empty: '尚无预印本。' },
  ko: { title: '연구', notice: '프리프린트 · 동료 심사 미완료', pdf: 'PDF 다운로드', source: '출처', empty: '아직 공개된 프리프린트가 없습니다.' },
  ja: { title: '研究', notice: 'プレプリント · 査読前', pdf: 'PDF をダウンロード', source: '出典', empty: '公開されたプレプリントはまだありません。' },
  vi: { title: 'Nghiên cứu', notice: 'Bản thảo tiền xuất bản · Chưa qua bình duyệt', pdf: 'Tải PDF', source: 'Nguồn', empty: 'Chưa có bản thảo tiền xuất bản.' },
  ts: { title: 'research[]', notice: 'status: Preprint; peerReviewed: false', pdf: 'download(PDF)', source: 'source', empty: 'papers: []' },
};

const filters = {
  en: ['System', 'All systems'], th: ['ระบบ', 'ทุกระบบ'], zh: ['系统', '所有系统'],
  ko: ['시스템', '모든 시스템'], ja: ['システム', 'すべてのシステム'],
  vi: ['Hệ thống', 'Tất cả hệ thống'], ts: ['system', 'systems.all'],
};
for (const [locale, [system, all]] of Object.entries(filters)) Object.assign(researchCopy[locale], { system, all });
