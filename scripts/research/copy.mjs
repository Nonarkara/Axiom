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

const geographyCopy = {
  en: ['Study region', 'All regions', 'Research geography', 'Coverage, not fieldwork. Frames are approximate; dots are city references for provincial studies.', 'Map unavailable. The publication list and filters remain available.', 'English articles and summaries', 'Study details', 'Question', 'Evidence', 'Limitations', 'No papers match these filters.', 'papers', 'Map sources', 'Thailand', 'Chiang Mai province', 'Nakhon Si Thammarat', 'Middle East / Gulf', 'National', 'Provincial', 'Regional', 'Geography not established', 'Coarse coverage frame', 'City reference, not field site', 'ADS-B analysis frame · p. 4'],
  th: ['พื้นที่ศึกษา', 'ทุกพื้นที่', 'ภูมิศาสตร์งานวิจัย', 'ขอบเขตการศึกษา ไม่ใช่พื้นที่ลงภาคสนาม กรอบเป็นขอบเขตโดยประมาณ จุดคือเมืองอ้างอิงของการศึกษาระดับจังหวัด', 'แผนที่ไม่พร้อมใช้งาน รายการบทความและตัวกรองยังใช้งานได้', 'บทความและบทสรุปเป็นภาษาอังกฤษ', 'รายละเอียดการศึกษา', 'คำถาม', 'หลักฐาน', 'ข้อจำกัด', 'ไม่มีบทความที่ตรงกับตัวกรอง', 'บทความ', 'แหล่งข้อมูลแผนที่', 'ประเทศไทย', 'จังหวัดเชียงใหม่', 'นครศรีธรรมราช', 'ตะวันออกกลาง / อ่าวเปอร์เซีย', 'ระดับประเทศ', 'ระดับจังหวัด', 'ระดับภูมิภาค', 'ยังไม่ระบุพื้นที่ศึกษา', 'กรอบขอบเขตโดยประมาณ', 'เมืองอ้างอิง ไม่ใช่จุดลงภาคสนาม', 'กรอบวิเคราะห์ ADS-B · น. 4'],
  zh: ['研究区域', '所有区域', '研究地理范围', '表示覆盖范围，不代表实地调查。框线为概略范围；点为省级研究的城市参考位置。', '地图不可用，文献列表和筛选仍可使用。', '文章及摘要为英文', '研究详情', '问题', '证据', '局限', '没有符合筛选条件的论文。', '篇论文', '地图来源', '泰国', '清迈府', '洛坤', '中东 / 海湾', '全国', '省级', '区域', '地理范围尚未确定', '概略覆盖框', '城市参考点，非调查地点', 'ADS-B 分析框 · 第4页'],
  ko: ['연구 지역', '모든 지역', '연구 지리 범위', '현장 조사 위치가 아닌 연구 범위입니다. 사각형은 대략적인 범위이며 점은 주 단위 연구의 기준 도시입니다.', '지도를 사용할 수 없습니다. 논문 목록과 필터는 계속 사용할 수 있습니다.', '논문과 요약은 영어', '연구 상세', '질문', '근거', '한계', '필터에 맞는 논문이 없습니다.', '논문', '지도 출처', '태국', '치앙마이주', '나콘시탐마랏', '중동 / 걸프', '전국', '주 단위', '지역', '지리 범위 미확정', '대략적인 범위', '기준 도시, 현장 위치 아님', 'ADS-B 분석 범위 · 4쪽'],
  ja: ['研究地域', 'すべての地域', '研究の地理的範囲', '対象範囲であり、現地調査地点ではありません。枠は概略の範囲、点は県単位の研究の参照都市です。', '地図を利用できません。論文一覧と絞り込みは引き続き利用できます。', '論文と要約は英語', '研究の詳細', '問い', '根拠', '限界', '条件に合う論文はありません。', '論文', '地図の出典', 'タイ', 'チェンマイ県', 'ナコーンシータンマラート', '中東 / 湾岸', '全国', '県単位', '地域', '地理的範囲未確定', '概略の対象範囲', '参照都市、調査地点ではない', 'ADS-B 分析枠 · 4頁'],
  vi: ['Vùng nghiên cứu', 'Tất cả các vùng', 'Địa lý nghiên cứu', 'Phạm vi nghiên cứu, không phải địa điểm thực địa. Khung là phạm vi gần đúng; chấm là thành phố tham chiếu cho nghiên cứu cấp tỉnh.', 'Bản đồ không khả dụng. Danh sách và bộ lọc vẫn hoạt động.', 'Bài báo và tóm tắt bằng tiếng Anh', 'Chi tiết nghiên cứu', 'Câu hỏi', 'Bằng chứng', 'Hạn chế', 'Không có bài nào khớp bộ lọc.', 'bài báo', 'Nguồn bản đồ', 'Thái Lan', 'Tỉnh Chiang Mai', 'Nakhon Si Thammarat', 'Trung Đông / vùng Vịnh', 'Toàn quốc', 'Cấp tỉnh', 'Khu vực', 'Chưa xác định địa lý', 'Khung phạm vi gần đúng', 'Thành phố tham chiếu, không phải thực địa', 'Khung phân tích ADS-B · tr. 4'],
  ts: ['study.region', 'regions.all', 'research.geography', '// coverage !== fieldwork; frame.approximate; point.cityReference !== provinceBoundary', 'map.unavailable; papers.available = true', 'articles.lang = "en"; summaries.lang = "en"', 'study.details', 'question', 'evidence', 'limitation', 'papers.filter().length === 0', 'papers', 'map.sources', 'Thailand', 'ChiangMaiProvince', 'NakhonSiThammarat', 'MiddleEast/Gulf', 'scope.national', 'scope.provincial', 'scope.regional', 'geography.unknown', 'frame.coarseCoverage', 'point.cityReference !== fieldSite', 'frame.ADSB; source.page = 4'],
};
const keys = ['region', 'allRegions', 'mapTitle', 'mapNote', 'mapUnavailable', 'english', 'details', 'question', 'evidence', 'limitation', 'noResults', 'papers', 'mapSources', 'thailand', 'chiangMai', 'nakhon', 'gulf', 'national', 'provincial', 'regional', 'unspecified', 'coarseFrame', 'cityReference', 'analysisFrame'];
for (const [locale, values] of Object.entries(geographyCopy)) {
  if (values.length !== keys.length) throw new Error(`Incomplete research map copy: ${locale}`);
  keys.forEach((key, index) => { researchCopy[locale][key] = values[index]; });
}
for (const [locale, value] of Object.entries({ en: 'First matching paper', th: 'บทความแรกที่ตรงกับตัวกรอง', zh: '首篇匹配论文', ko: '첫 번째 일치 논문', ja: '最初の該当論文', vi: 'Bài đầu tiên khớp bộ lọc', ts: 'papers.filtered[0]' })) researchCopy[locale].firstPaper = value;
for (const [locale, [zoomIn, zoomOut]] of Object.entries({ en: ['Zoom in', 'Zoom out'], th: ['ขยายแผนที่', 'ย่อแผนที่'], zh: ['放大', '缩小'], ko: ['확대', '축소'], ja: ['拡大', '縮小'], vi: ['Phóng to', 'Thu nhỏ'], ts: ['map.zoomIn()', 'map.zoomOut()'] })) Object.assign(researchCopy[locale], { zoomIn, zoomOut });
for (const [locale, value] of Object.entries({
  en: 'The map and filters require JavaScript. All papers and PDF links are available below.',
  th: 'แผนที่และตัวกรองต้องใช้ JavaScript บทความและลิงก์ PDF ทั้งหมดยังคงอยู่ด้านล่าง',
  zh: '地图和筛选需要 JavaScript。所有论文和 PDF 链接均列于下方。',
  ko: '지도와 필터에는 JavaScript가 필요합니다. 모든 논문과 PDF 링크는 아래에 있습니다.',
  ja: '地図と絞り込みには JavaScript が必要です。すべての論文と PDF リンクは以下にあります。',
  vi: 'Bản đồ và bộ lọc cần JavaScript. Tất cả bài báo và liên kết PDF vẫn có ở dưới.',
  ts: 'map.requires(JavaScript); filters.requires(JavaScript); papers.available = true',
})) researchCopy[locale].mapStatic = value;
