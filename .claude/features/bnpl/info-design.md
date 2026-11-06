# Ví trả sau (BNPL) — Information Design

Source: VSP Fintech Roadmap 2026, section 3.1 + 3.2 (PO: Nguyễn Thị Ngọc Ái · TECH: Trần Quang Hiển · deadline 30/09/2026).

---

## S1 · Pre-approved Teaser

**Mental model:** "App báo tao được duyệt sẵn 15 triệu — thật không? Có phải bẫy nợ không?"

**Hoàn cảnh:** User nhận push-app "Bạn được pre-approved hạn mức 15 triệu". Tò mò tap vào. Có thể đang ở bất kỳ đâu — lunch break, đi xe bus, đang mua sắm online.
**Cảm xúc:** Vui vì được credit sẵn, nhưng sợ vay. Cần được trấn an lãi suất thấp, không phí ẩn.
**Quyết định:** Có đáng dành 2 phút đăng ký không?
**Thành công khi:** Hiểu trong 10 giây: hạn mức bao nhiêu, lãi suất thế nào, đăng ký mất gì.

| Zone | Nội dung | Lý do |
|------|----------|-------|
| Hero hạn mức pre-approved | "Pre-approved cho bạn" · "Hạn mức tạm duyệt" · 15.000.000 ₫ (40px bold) · "Lãi suất từ 0% · Kỳ hạn 1/3/6/12 tháng" | Số tiền là anchor — user đến vì số này. Phải lớn nhất màn hình. Dòng "0% lãi" đặt ngay dưới để kill ngay sợ hãi "sao lại free". |
| Benefits 3-step (01/02/03) | Mua ngay trả sau · Chia nhỏ theo kỳ · Xét duyệt tức thì (tái dùng eKYC) | User sợ "thêm 1 dịch vụ financial = thêm phức tạp". Nhấn mạnh "tái dùng eKYC" để họ biết không phải nộp lại giấy tờ. |
| CTA kép (primary + secondary) | Nút đen "Bắt đầu đăng ký" + nút xám "Để sau" | User chưa quyết → đừng ép. "Để sau" cho họ thoát không cảm giác mất cơ hội. |

**Reference:** Klarna "Get pre-approved" flow — focus vào limit reveal.

---

## S2 · Intro + FAQ + Consent

**Mental model:** "OK đọc kỹ coi có gì khuất tất không."

**Hoàn cảnh:** User đã tap "Bắt đầu đăng ký" — cam kết đi tiếp, nhưng cảnh giác. Đây là lần đầu tiếp xúc với thông tin pháp lý của sản phẩm credit.
**Cảm xúc:** Cẩn thận, muốn hiểu rõ trước khi tick consent. Sợ phí ẩn, sợ ảnh hưởng CIC.
**Quyết định:** Tick 2 checkbox để tiếp tục, hay thoát?
**Thành công khi:** Đọc được FAQ quan trọng nhất (lãi/phí, trễ hạn) và tick consent mà không phải đọc wall of text.

| Zone | Nội dung | Lý do |
|------|----------|-------|
| How it works (3 bước đánh số) | 1. Đăng ký · 2. Mua & chọn kỳ · 3. Trả theo lịch | Flow mental cho user thấy full journey — xét duyệt → mua sắm → trả nợ. Không tạo mơ hồ "đăng ký xong thì sao". |
| FAQ accordion (4 câu) | Là gì? · Lãi và phí? · Trả sớm có được? · Trễ hạn thì sao? | 4 câu quan trọng nhất. FAQ collapse mặc định question #1 — user scan tiêu đề câu nào quan tâm, mở đọc. Câu #4 (trễ hạn + CIC) đặc biệt quan trọng vì là nỗi sợ lớn nhất. |
| 2 checkbox consent tách biệt | Checkbox 1: chia sẻ dữ liệu cá nhân · Checkbox 2: T&C dịch vụ | Theo GDPR / NĐ 13: data consent phải tách khỏi T&C consent. Gộp 1 checkbox duy nhất là vi phạm quy định. |
| Primary button disabled cho đến khi cả 2 check | Nút "Tiếp tục" đen, disabled state muted | Forcing function — user không thể lỡ tay bỏ qua consent. |

---

## S3 · Bổ sung thông tin

**Mental model:** "Nộp thông tin tối thiểu, không muốn bị quay kiểu ngân hàng."

**Hoàn cảnh:** User đã consent, giờ phải điền form để thẩm định. Không muốn upload giấy tờ (đã có eKYC). Sợ form dài 20 field.
**Cảm xúc:** Hơi mệt — vừa đọc FAQ xong. Nếu form dài sẽ drop off.
**Quyết định:** Có bõ công điền tiếp không?
**Thành công khi:** Điền xong trong 45 giây, không phải gõ gì nhiều.

| Zone | Nội dung | Lý do |
|------|----------|-------|
| Thu nhập hàng tháng (TextField) | Placeholder "Ví dụ: 15.000.000", inputMode numeric | Field bắt buộc #1 cho underwriting. Placeholder là số cụ thể → user hiểu format mong đợi, giảm lỗi. |
| Nghề nghiệp (tap-to-select list) | 6 option: Văn phòng / Công nhân / Kinh doanh / Công chức / Sinh viên / Khác | Dropdown trên mobile tệ. Tap-list cho user thấy full options → quyết định nhanh. |
| Mục đích sử dụng (chip grid) | 6 chip: Mua sắm / Hóa đơn / Du lịch / Sức khỏe / Giáo dục / Khác | Data cho risk team — purpose giúp họ segmenting. Chip thay vì dropdown vì user có thể muốn 1 tap, không muốn đọc dài. |
| Error state: thu nhập < 5M | Red helptext "Thu nhập tối thiểu phải từ 5.000.000 ₫" | Pre-empt rejection reason #1. Cho user biết ngay thay vì đi tiếp rồi bị reject ở S5. |

---

## S4 · Ký hợp đồng + OTP

**Mental model:** "Đây là commit thật — đọc hợp đồng lần cuối rồi ký."

**Hoàn cảnh:** Bước cuối trước khi hệ thống duyệt. User đọc summary contract + nhập OTP. Đây là pháp lý — chữ ký điện tử.
**Cảm xúc:** Căng thẳng nhẹ. Đây là lúc cam kết pháp lý.
**Quyết định:** OTP là thật tay mình đang ký — có muốn tiếp không?
**Thành công khi:** Đọc xong key terms trong 20s, gõ OTP đúng lần đầu, không bị confuse.

| Zone | Nội dung | Lý do |
|------|----------|-------|
| Contract file card | "Hợp đồng cấp hạn mức BNPL · PDF · 248 KB" + nút Download | User có quyền giữ bản hợp đồng. Button download = affordance pháp lý. Nếu không có, họ cảm thấy "app giấu thông tin". |
| Key terms list (6 rows) | Hạn mức 15M · Lãi suất 0% kỳ 1T · 1.5% kỳ 3-12T · Phí xử lý 0.5% · Phạt trễ hạn 150K · Hiệu lực 12T | TL;DR hợp đồng — user không đọc full 10 trang PDF. 6 con số quan trọng nhất đưa lên card — ai không đọc PDF vẫn biết mình đang ký gì. |
| OTP PinInput 6 số | 6 ô + "Gửi lại mã (00:48)" + error state "Còn 2 lần thử" | Pattern chuẩn VSP. Count-down visible giúp user không spam resend. Error cho biết còn bao nhiêu attempt — tránh lock đột ngột. |
| Sub-note pháp lý | "Chữ ký điện tử có giá trị pháp lý tương đương chữ ký tay" | Phải có theo NĐ 165/2018. User cũng cần biết đây là binding. |

---

## S5 · Kết quả phê duyệt

**Mental model:** "Duyệt chưa? Nếu rớt thì sao?"

**Hoàn cảnh:** Moment of truth — system đã chấm điểm. User vừa ký xong, chờ ~5s.
**Cảm xúc:** Approved: vui, muốn dùng ngay. Rejected: buồn, muốn biết tại sao. Pending: lo lắng, không biết chờ bao lâu.
**Quyết định:** Approved → dùng ngay hay để sau? Rejected → biết lý do không? Pending → đi đâu tiếp?
**Thành công khi:** Thấy kết quả rõ ràng trong 1 giây, biết bước tiếp theo.

| Zone | Nội dung | Lý do |
|------|----------|-------|
| Icon status 80px circle | Approved: Check xanh · Rejected: X đỏ · Pending: Clock xám | Universal pattern feedback — màu + icon → user đọc được kết quả chỉ qua glance. |
| Title + desc (≤ 24px bold) | Approved: "Phê duyệt thành công" · Rejected: "Không đủ điều kiện" · Pending: "Đang xét duyệt" | Wording ngắn, direct. Không dùng "Rất tiếc" vì user đã biết từ icon đỏ — thêm sympathy sẽ condescending. |
| Limit reveal card (chỉ Approved) | "HẠN MỨC ĐƯỢC CẤP" · 15.000.000 ₫ (32px bold) trong card xám | Reward moment — user đã qua 5 màn, cho họ cảm giác "thành quả". Card tách biệt với desc để số dễ thấy. |
| CTA kép | Approved: "Bắt đầu dùng ngay" (đi dashboard) + "Về trang chủ" · Rejected: "Về trang chủ" + "Liên hệ hỗ trợ" · Pending: "Đã hiểu" | Khớp emotion — Approved muốn action, Pending muốn confirm, Rejected muốn exit/retry. |

---

## S6 · Checkout — Chọn nguồn thanh toán

**Mental model:** "Tao đang mua gì đó, phải trả tiền — dùng nguồn nào đây?"

**Hoàn cảnh:** Tại bước checkout VinMart+ / VinFast / VinMec. Đã biết số tiền. Phải chọn nguồn: Ví / Bank / Card / **BNPL**.
**Cảm xúc:** Trung lập. Muốn xong nhanh. Nếu đơn hàng lớn → cân nhắc BNPL để chia nhỏ.
**Quyết định:** Trả full bằng Ví hay chia kỳ qua BNPL?
**Thành công khi:** So sánh được nguồn, chọn 1 tap, thấy hạn mức BNPL còn bao nhiêu trước khi chọn.

| Zone | Nội dung | Lý do |
|------|----------|-------|
| Order summary card trên cùng | "Đơn hàng tại VinMart+" + 1.890.000 ₫ (28px bold) | Anchor context — user thấy số tiền cần trả trước khi chọn nguồn. Thiếu số này, họ scroll lên check lại. |
| BNPL highlighted card (tách biệt) | Badge "Trả sau — lãi suất từ 0%" · Avatar đen "BNPL" · Limit bar (green/black/red theo % dùng) · "Còn X triệu khả dụng" | BNPL là giá trị unique VSP cung cấp — tách khỏi list "nguồn khác" để hút attention. Limit bar visible TRƯỚC khi chọn → user không phải click rồi mới biết có đủ hạn mức. |
| Other sources (3 radio rows) | Ví VSP · BIDV •• 4321 · VISA •• 8812 | Nguồn thông thường — xếp sau BNPL. Mỗi row 72px với avatar 44px → easy tap, không cramped. |
| State disabled khi maxed | Card BNPL mờ 50%, radio disabled, caption "Hết hạn mức khả dụng" | Prevent error — user không thể chọn BNPL khi đã dùng hết. Thay vì error sau tap, disable trước. |

---

## S7 · Chọn kỳ hạn + Breakdown

**Mental model:** "Chia làm mấy kỳ thì mỗi tháng trả bao nhiêu?"

**Hoàn cảnh:** Đã chọn BNPL. Giờ tính toán: 1 tháng thì trả full, 3 tháng / 6 tháng / 12 tháng thì nhỏ hơn nhưng có lãi. Cần so sánh.
**Cảm xúc:** Tính toán — muốn biết exactly mỗi tháng trả bao nhiêu. Lo về total interest.
**Quyết định:** Kỳ nào cân bằng giữa "nhỏ mỗi tháng" và "tổng lãi ít"?
**Thành công khi:** Nhìn breakdown real-time khi tap tenor khác, quyết định trong 30 giây.

| Zone | Nội dung | Lý do |
|------|----------|-------|
| Tenor grid 4 option (1/3/6/12) | Grid 4 cột, mỗi ô cao 80px, số tháng 22px bold. Ô "1 tháng" có badge "0% lãi" xanh | So sánh ngang bằng — user thấy cả 4 lựa chọn cùng lúc, không phải dropdown. Badge "0% lãi" là anchor incentive — nhiều user chỉ cần kỳ ngắn. |
| Per-month hero amount | "Mỗi kỳ bạn trả" + số 36px bold. "× N kỳ · Tổng X ₫" | Thông tin user quan tâm nhất — số trả mỗi tháng. Lớn nhất màn hình. Tổng đặt nhỏ hơn bên dưới. |
| Breakdown 4 dòng | Tiền gốc · Phí 0.5% · Lãi theo % · Tổng (bold, border-top) | Transparent breakdown — user tin tưởng vì thấy đủ component. Thiếu 1 dòng là user nghi "còn phí gì giấu". |
| Schedule preview (N rows) | Kỳ 1: 20/05 · Số tiền. Kỳ 2... | Preview giúp user thấy trước lịch trả. Tránh surprise sau này. |
| InformMessage về auto-debit | "Kỳ tiếp sẽ auto trừ từ Ví vào ngày 20 — tắt được trong Cài đặt" | Disclose auto-debit trước khi ký — tránh surprise. Đồng thời cho biết tắt được → giảm lo "bị trói". |

---

## S8 · Kết quả thanh toán

**Mental model:** "OK xong chưa? Hạn mức còn bao nhiêu?"

**Hoàn cảnh:** Ngay sau khi confirm. User chờ ~2s system xử lý.
**Cảm xúc:** Hồi hộp nhẹ — đã quen pattern thanh toán Ví, nhưng BNPL là lần đầu.
**Quyết định:** Dừng hay đi xem dashboard?
**Thành công khi:** Thấy success + transaction detail + limit mới còn lại trong 1 màn.

| Zone | Nội dung | Lý do |
|------|----------|-------|
| Icon + title + desc | Giống S5 nhưng nội dung về thanh toán + kỳ trả đầu tiên | Consistent pattern với approve result. |
| Transaction detail card (5 rows) | Số tiền · Kỳ · Trả mỗi kỳ · Merchant · Mã GD | Receipt — user cần biết chính xác đã thanh toán gì. Mã GD để tra soát sau. |
| Limit-updated card | "HẠN MỨC CÒN LẠI" · 10.910.000 ₫ / 15.000.000 ₫ + progress bar 27% | Phản hồi impact của giao dịch lên hạn mức. Bar màu đen → còn an toàn. Nếu > 80% thì màu đỏ. |
| CTA kép | "Xem quản lý nợ" (primary, vào dashboard) + "Về trang chủ" | Dashboard là next logical step. Home cho user muốn dừng. |

---

## S9 · Dashboard BNPL

**Mental model:** "Tình trạng nợ của tao thế nào? Có trễ hạn gì không?"

**Hoàn cảnh:** User vào 1-2 lần/tuần để check. Hoặc bị push-app "Kỳ tới hạn trong 3 ngày" → tap vào.
**Cảm xúc:** Cẩn thận — đây là nợ, không phải tiền mình. Muốn biết % hạn mức đã dùng, kỳ kế tiếp, có trễ hạn không.
**Quyết định:** Cần trả ngay không? Dùng tiếp hay dừng?
**Thành công khi:** Thấy 3 thứ trong 2 giây: % hạn mức, kỳ kế tiếp, trễ hạn (nếu có).

| Zone | Nội dung | Lý do |
|------|----------|-------|
| Limit ring 180px center | SVG circle, stroke-dasharray theo % dùng, màu theo tình trạng (đen healthy / đỏ overdue). Center: "Đã dùng %" + số % 28px | Visualization duy nhất cho hạn mức — ring tốt hơn bar vì user associate "fuel gauge". Màu = trạng thái, không cần đọc chữ. |
| Alert banner đỏ (khi overdue) | "Trễ hạn N ngày — Phí phạt 150K" + "Trả ngay để tránh ảnh hưởng CIC" | Trễ hạn = tình trạng nghiêm trọng → banner trên cùng, đỏ toàn khối. Đề cập CIC để trigger fear — motivate trả ngay. |
| Next payment card (đen hoặc đỏ) | "KỲ TRẢ KẾ TIẾP" hoặc "CẦN TRẢ NGAY" + số tiền 28px bold + ngày · "Trả ngay →" | CTA chính của dashboard. Đen = normal, đỏ = overdue. Đặt trên list khoản vay vì đây là action ưu tiên. |
| Active loans list | Mỗi loan 1 row: avatar merchant · tên · "Kỳ N/M · ngày" · số tiền · chevron | Cho user drill-down từng khoản. Row overdue có label đỏ "Trễ hạn". |
| CTA "Dùng ví trả sau" | FixedBottom, disabled khi locked | Shortcut vào checkout từ dashboard. Locked state → CTA disabled + caption. |

**Reference:** Apple Pay Later dashboard — ring + schedule list.

---

## S10 · Chi tiết khoản vay + Schedule timeline

**Mental model:** "Tao đã trả mấy kỳ rồi? Còn mấy? Bao giờ xong?"

**Hoàn cảnh:** User tap 1 loan từ dashboard. Muốn xem tiến độ + decide trả trước / tất toán.
**Cảm xúc:** Curious về progress. Nếu thấy đã trả nhiều → có cảm giác "gần xong". Nếu mới trả 1/12 → có cảm giác áp lực dài hạn.
**Quyết định:** Trả kỳ này / Tất toán sớm / Đợi.
**Thành công khi:** Thấy được progress, schedule, và biết kỳ nào đã trả / kỳ nào đang tới.

| Zone | Nội dung | Lý do |
|------|----------|-------|
| Merchant header card | Avatar + tên merchant + "Mã L3" · số tiền còn phải trả 28px · "Đã trả N/M kỳ" · progress bar 6px | TL;DR status khoản vay trên đầu. User không phải đọc 12 dòng schedule mới biết còn bao nhiêu. |
| Key info list (5 rows) | Tiền gốc · Kỳ hạn · Lãi suất · Ngày cấp · Ngày đáo hạn | Metadata — minh bạch cho user. Không tất cả user xem, nhưng ai cần thì có đủ. |
| Timeline vertical với dot + line | Mỗi kỳ: dot (paid: green check · current: black clock · overdue: red alert · upcoming: gray outline) + "Kỳ N · ngày · trạng thái" + số tiền | Pattern timeline universal — user visualize được position trong process. Dot màu khác nhau → scan nhanh. Paid row có strike-through text → reinforce "done". |
| CTA context-aware | Default: "Trả X ₫ ngay" (bằng perMonth) · Completed: "Đã hoàn tất" (secondary, disabled) | CTA match với state khoản vay. Không show "Trả ngay" khi đã hoàn tất. |

---

## S11 · Thanh toán dư nợ

**Mental model:** "Trả bao nhiêu? Từ Ví có đủ không?"

**Hoàn cảnh:** Tap "Trả ngay" từ dashboard hoặc loan detail. Có thể đang gần hạn (nhắc bởi app) hoặc tất toán sớm.
**Cảm xúc:** Quyết đoán. Ngại nếu Ví không đủ → phải nạp thêm trước.
**Quyết định:** Trả kỳ này / Tất toán / Số khác? Nguồn tiền nào?
**Thành công khi:** Chọn số → xác nhận trong 2 tap, không bị surprise "số dư không đủ".

| Zone | Nội dung | Lý do |
|------|----------|-------|
| 3 radio options cho số tiền | "Trả kỳ này" (amount = perMonth) · "Tất toán toàn bộ" (amount = totalDebt) · "Số khác" (custom input) | 80% user dùng 2 option đầu. Custom cho 20% cần trả partial amount khác. |
| Custom amount input (khi chọn Số khác) | Large text input 24px bold numeric | Ghi đè quick options — user gõ số mình muốn. Số lớn để dễ nhìn. |
| Source row — Ví + balance | Ví VSP · "Số dư 2.450.000 ₫". Insufficient state: đỏ + "Không đủ" | Cho user confirm nguồn — nhưng cho trạng thái balance để validate realtime. Nếu insufficient → red + CTA disabled. |
| Summary card | Số tiền trả + Phí miễn phí + "Tổng trừ từ Ví" | Confirm trước khi action — tránh user trả nhầm số. |
| Error banner (insufficient) | "Số dư Ví không đủ. Nạp thêm hoặc chọn số nhỏ hơn" | Actionable error — cho user 2 đường fix. Không chỉ báo lỗi suông. |

---

## S12 · Cài đặt Ví trả sau

**Mental model:** "Cho tao bật/tắt auto-pay. Cho tao khoá ví nếu nghi bị hack."

**Hoàn cảnh:** User vào settings qua icon ⚙ từ dashboard. Thường vào khi: muốn tắt auto-debit, khoá lại, xem contract, quản lý thiết bị.
**Cảm xúc:** Cẩn trọng — đây là fintech settings, không phải app settings thông thường. Sợ tap nhầm.
**Quyết định:** Bật/tắt auto-pay hay notif? Có cần khoá ví không?
**Thành công khi:** Tìm đúng setting và toggle trong 15 giây.

| Zone | Nội dung | Lý do |
|------|----------|-------|
| Status card trên đầu | Active: icon đen · "Đang hoạt động" + "Mã HĐ ·" / Locked: icon đỏ · "Đang bị khóa" + "Liên hệ CSKH" | State indicator — user biết ngay trạng thái trước khi làm gì. Lock state dùng màu đỏ để cảnh báo. |
| Auto-payment group (2 toggle rows) | Auto debit (tự trừ từ Ví vào ngày hạn) + Nhắc hạn trả (3 và 1 ngày trước) | 2 toggle độc lập — user có thể muốn nhắc mà không muốn auto. Toggle = 1-tap, match user mental model "bật/tắt". |
| Security group (2 nav rows) | Thiết bị đăng nhập (3 thiết bị) + Hợp đồng & sao kê | Navigate-only rows cho audit-type info. Meta cho thấy có gì để xem trước khi tap. |
| Destructive CTA "Khóa Ví trả sau" | Secondary button với intent=danger (đỏ text trên nền nhạt) + caption explain | Pattern iOS settings — destructive đặt cuối, đỏ nhưng không prominent. Caption cho biết hậu quả trước khi tap. |

**Reference:** iOS Apple Card settings — clean rows, danger action đỏ ở cuối.
