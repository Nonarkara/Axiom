#!/usr/bin/env node
/** Generate scripts/html-ja.json and scripts/html-vi.json from professional translation map. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlKeys = JSON.parse(fs.readFileSync(path.join(__dirname, 'html-keys.json'), 'utf8'));
const enZh = JSON.parse(fs.readFileSync(path.join(__dirname, 'html-en-zh.json'), 'utf8'));

// Professional JA / VI for all visible HTML keys
const JA = {
  "navCurrent.systems": "システム",
  "navCurrent.stages": "ステージ",
  "navCurrent.team": "チーム",
  "navCurrent.press": "プレス",
  "navCurrent.brand": "ブランドキット",
  "navCurrent.credentials": "資格",
  "navCurrent.cta": "一緒に始める",
  "heroCurrent.meta1": "<b>24/7</b> モニタリング",
  "heroCurrent.meta2": "<b>157</b> SLIC Index 都市",
  "heroCurrent.meta3": "<b>174</b> Smart City Thailand Index 都市",
  "heroCurrent.meta4": "クチン、マレーシア",
  "heroCurrent.meta5": "中東",
  "heroCurrent.meta6": "アジア太平洋",
  "heroCurrent.meta7": "ASEAN",
  "heroCurrent.title": "政府が<em>待てない</em> <br><span class=\"hero__punch\"><span class=\"hero__punch-afford\">動くシステム</span><span class=\"hero__punch-wait\">をつくる。</span></span>",
  "heroCurrent.sub": "多くの「スマートシティ」はスライドで終わる。私たちのは本番で動いている。初週に問題をマップする。プレゼンの前に動くものを出す。すべての決定は初日から記録される。",
  "heroCurrent.cta1": "ライブシステムを見る",
  "heroCurrent.cta2": "ブリーフを始める",
  "heroCurrent.stat1lbl": "本番稼働システム",
  "heroCurrent.stat2lbl": "稼働国",
  "heroCurrent.stat3lbl": "インデックス済み都市",
  "heroCurrent.stat4lbl": "GITEX Asia メインステージ",
  "sysSect.kicker": "本番稼働中",
  "sysClusters.sysMeta": "21システム · 5か国",
  "sysSect.lede": "それぞれ鋭い問いから始まり、動く画面として出荷され、ローンチの報道サイクルが終わっても使える。クリックして使ってください — すべてライブです。",
  "sysSect.sandboxKicker": "Sandbox // Live",
  "sysSect.sandboxNote": "デモではありません — サンドボックスで動く実システムです。見せるためではなく、スケールするために作られています。クライアント本番環境はNDA下でより大規模です。ここで動くものは同じ挙動をし、高度なモジュールは偽物ではなくNDAのため非公開です。",
  "stageSect.kicker": "二つのステージ、一つのシグナル",
  "stageSect.title": "政府は<em>スライドを待つのにうんざりしている。</em>",
  "stageSect.lede": "6か月で同じ論旨をアジア最大のステージ二つに持ち込んだ。両方の会場は満席。反応も同じだった：次の予算サイクルではなく、今つくれ。",
  "teamSect.kicker": "誰がつくるか",
  "teamSect.title": "二人の創業者。<em>ハンドラーなし。</em>",
  "teamSect.lede": "コードを書き、アーキテクチャを決める人と直接話す。UAVオペレーター、交通エンジニア、政策翻訳者が必要なときだけ、そのミッションのために呼ぶ — 常設ベンチにはしない。",
  "ctaSect.kicker": "一緒に始める",
  "ctaSect.title": "ブリーフを送ってください。<em>プレッシャーをマップします。</em>",
  "ctaSect.body": "問題が本物で決定が重要なら、2週間以内に証明できることを見せます。調達サイクルのウォームアップなし。ムードボードなし。",
  "ctaSect.promise1": "初週にプレッシャーをマップ。決定、ユーザー、テーブル上のデータ。",
  "ctaSect.promise2": "スライドの磨き込みの前に動くパイロット。無料・既存データ優先；新インフラは正当化されたときだけ。",
  "ctaSect.promise3": "初日からデータトレイル。ページビュー、コンテンツ、決定ログ — 次のビルドが読めるように。",
  "footer.contact": "連絡先",
  "footer.smallPrint": "都市、政府、オペレーターのための意思決定システム。バンコク · 東南アジア。© 2026 Axiom. All rights reserved. Axiomは登録商号です。システム稼働時間、応答時間、成果指標は事例ごとの観察であり、将来の成果を保証するものではありません。",
};

const VI = {
  "navCurrent.systems": "Hệ thống",
  "navCurrent.stages": "Sân khấu",
  "navCurrent.team": "Đội ngũ",
  "navCurrent.press": "Báo chí",
  "navCurrent.brand": "Bộ nhận diện",
  "navCurrent.credentials": "Chứng nhận",
  "navCurrent.cta": "Hợp tác",
  "heroCurrent.meta1": "<b>24/7</b> giám sát",
  "heroCurrent.meta2": "<b>157</b> thành phố SLIC Index",
  "heroCurrent.meta3": "<b>174</b> thành phố Smart City Thailand Index",
  "heroCurrent.meta4": "Kuching, Malaysia",
  "heroCurrent.meta5": "Trung Đông",
  "heroCurrent.meta6": "Châu Á Thái Bình Dương",
  "heroCurrent.meta7": "ASEAN",
  "heroCurrent.title": "Chúng tôi xây <em>hệ thống chạy được</em> mà chính phủ <br><span class=\"hero__punch\"><span class=\"hero__punch-afford\">không thể chờ</span> <span class=\"hero__punch-wait\">thêm nữa.</span></span>",
  "heroCurrent.sub": "Hầu hết dự án \"thành phố thông minh\" dừng ở slide. Của chúng tôi chạy trong sản xuất. Tuần đầu lập bản đồ vấn đề. Có thứ chạy được trước mọi buổi thuyết trình. Mọi quyết định được ghi từ ngày một.",
  "heroCurrent.cta1": "Xem hệ thống trực tiếp",
  "heroCurrent.cta2": "Gửi brief",
  "heroCurrent.stat1lbl": "Hệ thống đang vận hành",
  "heroCurrent.stat2lbl": "Quốc gia vận hành",
  "heroCurrent.stat3lbl": "Thành phố đã lập chỉ mục",
  "heroCurrent.stat4lbl": "Sân khấu chính GITEX Asia",
  "sysSect.kicker": "Đang chạy trong sản xuất",
  "sysClusters.sysMeta": "21 hệ thống · 5 quốc gia",
  "sysSect.lede": "Mỗi hệ thống bắt đầu bằng một câu hỏi sắc, ra mắt như một giao diện dùng được, và vẫn hữu ích sau chu kỳ báo chí ra mắt. Nhấp vào và dùng — tất cả đều trực tiếp.",
  "sysSect.sandboxKicker": "Sandbox // Live",
  "sysSect.sandboxNote": "Không phải demo — đây là hệ thống thật chạy trong sandbox. Xây để mở rộng, không phải để gây ấn tượng. Triển khai sản xuất của khách hàng lớn hơn và phức tạp hơn dưới NDA; những gì chạy ở đây hoạt động giống vậy, các module nâng cao bị giữ lại vì NDA chứ không phải vì chúng là giả.",
  "stageSect.kicker": "Hai sân khấu, một tín hiệu",
  "stageSect.title": "Chính phủ đã mệt <em>chờ một bộ slide.</em>",
  "stageSect.lede": "Trong sáu tháng chúng tôi mang cùng luận điểm lên hai sân khấu lớn nhất châu Á. Cả hai phòng đều đầy. Phản ứng giống nhau: làm ngay, không chờ chu kỳ ngân sách tiếp theo.",
  "teamSect.kicker": "Ai xây nên",
  "teamSect.title": "Hai nhà sáng lập. <em>Không có người đứng giữa.</em>",
  "teamSect.lede": "Bạn nói chuyện với người viết code và quyết định kiến trúc. Khi cần UAV, kỹ sư giao thông hoặc dịch chính sách, chúng tôi chỉ gọi họ cho nhiệm vụ đó — không giữ đội cố định.",
  "ctaSect.kicker": "Hợp tác",
  "ctaSect.title": "Gửi brief. <em>Chúng tôi sẽ lập bản đồ áp lực.</em>",
  "ctaSect.body": "Nếu vấn đề là thật và quyết định quan trọng, chúng tôi cho bạn thấy điều có thể chứng minh trong hai tuần. Không khởi động chu kỳ mua sắm. Không moodboard.",
  "ctaSect.promise1": "Lập bản đồ áp lực trong tuần một. Quyết định, người dùng, dữ liệu trên bàn.",
  "ctaSect.promise2": "Pilot chạy được trước khi chỉnh slide. Dữ liệu miễn phí và sẵn có trước; hạ tầng mới chỉ khi xứng đáng.",
  "ctaSect.promise3": "Dấu vết dữ liệu từ ngày một. Pageview, nội dung, nhật ký quyết định — để bản build tiếp theo đọc được.",
  "footer.contact": "Liên hệ",
  "footer.smallPrint": "Hệ thống quyết định cho thành phố, chính phủ và đơn vị vận hành. Bangkok · Đông Nam Á. © 2026 Axiom. All rights reserved. Axiom là tên thương mại đã đăng ký. Thời gian hoạt động, thời gian phản hồi và chỉ số kết quả là quan sát theo từng trường hợp, không đảm bảo hiệu suất tương lai.",
};

// Load extended translations from companion file if present
const extPath = path.join(__dirname, 'regional-ja-vi-ext.json');
if (fs.existsSync(extPath)) {
  const ext = JSON.parse(fs.readFileSync(extPath, 'utf8'));
  Object.assign(JA, ext.ja || {});
  Object.assign(VI, ext.vi || {});
}

const missingJa = [];
const missingVi = [];
const jaOut = {};
const viOut = {};

for (const key of htmlKeys) {
  if (JA[key]) jaOut[key] = JA[key];
  else missingJa.push(key);
  if (VI[key]) viOut[key] = VI[key];
  else missingVi.push(key);
}

if (missingJa.length || missingVi.length) {
  console.error('Missing JA:', missingJa.length, missingJa.slice(0, 10));
  console.error('Missing VI:', missingVi.length, missingVi.slice(0, 10));
  process.exit(1);
}

fs.writeFileSync(path.join(__dirname, 'html-ja.json'), JSON.stringify(jaOut, null, 2) + '\n');
fs.writeFileSync(path.join(__dirname, 'html-vi.json'), JSON.stringify(viOut, null, 2) + '\n');
console.log('Wrote html-ja.json and html-vi.json:', htmlKeys.length, 'keys each');
