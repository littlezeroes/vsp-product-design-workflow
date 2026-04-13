# 👹 Đức — Adversarial Review: Sinh lời tự động

> **Reviewer:** 👹 Đức (Senior UX Reviewer)
> **Date:** 2026-03-22
> **Files reviewed:** `analysis.md`, `flow.md`, `brd-raw.md`
> **Verdict:** ⚠️ **PASS WITH CONCERNS**

---

## 1. Overall Assessment

Flow design của Nate khá solid — cover được hầu hết happy path và edge cases chính. Analysis sắc, đặc biệt phần competitive insights và UX risks. Tuy nhiên, tao thấy MÂU THUẪN nội bộ giữa analysis và flow: Nate recommend bỏ OTP cho nạp (Rec 1) nhưng flow.md vẫn vẽ OTP/biometric cho cả nạp lẫn rút. Nate recommend hệ thống tự rút khi hủy (Rec 8, Q10) nhưng flow.md Epic 4 vẫn bắt user rút tay trước. Nate nói "ít step" nhưng flow confirm activation có 2 checkboxes + OTP = vẫn nhiều step. Cần align recommendations với flow trước khi chuyển sang Ivy.

---

## 2. Critical Issues — PHẢI SỬA trước khi design

### 🔴 C1: Flow.md mâu thuẫn với chính Analysis recommendations

**Vấn đề:** Nate viết analysis rất hay — recommend bỏ OTP nạp, recommend hệ thống tự rút khi hủy, recommend merge screens. Nhưng flow.md KHÔNG reflect những recommendations đó. Flow vẫn vẽ:
- Nạp tiền → OTP/biometric (dù Rec 1 nói bỏ)
- Hủy → bắt rút hết trước (dù Rec 8 nói hệ thống tự rút)

**Tại sao user gặp khó:** Nếu Ivy code theo flow.md, sẽ implement flow mà chính Nate đã recommend KHÔNG nên làm.

**Sửa:** Nate cần chốt: flow.md follow recommendations hay follow BRD raw? Nếu follow recommendations → update flow.md. Nếu chờ PO confirm → mark rõ trong flow.md những chỗ "pending PO decision" với 2 variants (A = BRD original, B = Nate recommend).

---

### 🔴 C2: Minimum deposit/withdraw amount — KHÔNG CÓ trong flow

**Vấn đề:** Analysis mention "assume 10.000đ" cho minimum. Nhưng flow.md validation KHÔNG có case `amount < minimum`. BRD cũng không nói.

**Tại sao user gặp khó:** User nạp 1.000đ → hệ thống chấp nhận? Lãi 1 ngày = 0.12đ. Hoặc user nạp 100đ vì bấm nhầm → tạo transaction rác. Không có minimum = mở cửa cho abuse và confusion.

**Sửa:** Thêm validation `amount < MIN_DEPOSIT` vào flow Nạp/Rút. Đề xuất MIN = 50.000đ (hợp lý với context tài chính VN). Quick chips thấp nhất = 500K nên cũng đủ cover, nhưng user vẫn có thể type tay.

---

### 🔴 C3: Monthly deposit limit (100M/tháng) — flow chưa handle đúng

**Vấn đề:** Flow Nạp tiền validate "Tổng SL > 100M" (max balance), nhưng KHÔNG validate monthly deposit limit riêng. BRD nói rõ: "Hạn mức giao dịch: 100M/tháng (Thông tư 40/2024)".

Scenario: User có SL balance 50M, đã nạp 90M trong tháng, muốn nạp thêm 20M. Max balance check: 50M + 20M = 70M < 100M → pass. Nhưng monthly limit: 90M + 20M = 110M > 100M → PHẢI block.

**Tại sao user gặp khó:** Nếu không validate → (a) vi phạm Thông tư 40/2024, hoặc (b) backend reject nhưng FE không hiện lý do rõ ràng → user confused.

**Sửa:** Thêm node validate `Tổng nạp tháng + số tiền > 100M/tháng → "Đã đạt hạn mức giao dịch tháng. Hạn mức còn lại: X đ"`. Hiển thị remaining monthly limit trên form nạp.

---

### 🔴 C4: "Đang xử lý" result — rồi sao tiếp?

**Vấn đề:** Cả 4 epic đều có trạng thái "Đang xử lý" (API timeout/pending). Flow chỉ show "Về trang chủ". Nhưng:
- User quay lại dashboard → dashboard show gì? Balance cũ hay mới?
- Giao dịch pending có hiện trong lịch sử không?
- Nếu pending resolve thành success/fail → thông báo bằng gì? Push notification? In-app banner?

**Tại sao user gặp khó:** "Đang xử lý" mà không biết bao giờ xong, check ở đâu = anxiety tài chính cực lớn. Tiền của user đang trong limbo.

**Sửa:** Thêm vào flow:
1. Dashboard khi có pending tx → hiện banner "Có 1 giao dịch đang xử lý" + link lịch sử
2. Push notification khi pending resolve
3. Lịch sử GD filter "Đang xử lý" phải hiện rõ
4. Mỗi pending tx có estimated resolve time ("Thường hoàn tất trong 1-5 phút")

---

## 3. Major Concerns — NÊN SỬA

### 🟡 M1: Confirm Activation screen — cognitive load cao

**Vấn đề:** Screen hiện: Họ tên, SĐT, CCCD (readonly) + 2 checkboxes (Điều khoản + Chính sách) + Button "Kích hoạt".

Mày là user mày có đọc 2 cái checkbox đó không? Không. Mày tick cả 2 mà không đọc. Vậy tại sao bắt tick 2 checkbox riêng?

**Sửa:** Merge thành 1 checkbox: "Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật" (2 link khác nhau trong text). Ít action hơn = ít friction. Nếu legal bắt tách → keep 2 nhưng đặt disclaimer text nhỏ phía dưới, không phải 2 dòng checkbox dài.

---

### 🟡 M2: Switch tab Nạp↔Rút reset input — user sẽ bực

**Vấn đề:** Flow nói "Reset input, chuyển tab" khi user đã nhập số tiền rồi switch tab. User đang ở Nạp, nhập 5M, nhỡ tap Rút, muốn quay lại Nạp → mất input → phải nhập lại.

**Tại sao user gặp khó:** Accidental tap rất hay xảy ra trên mobile. Mất data = frustration.

**Sửa:** 2 options:
- (A) Giữ input state riêng cho mỗi tab (better UX, phức tạp hơn)
- (B) Show confirm dialog "Bạn đã nhập số tiền, chuyển tab sẽ xóa. Tiếp tục?" (safe nhưng thêm step)
- **Đề xuất: Option A** — state riêng mỗi tab, không reset.

---

### 🟡 M3: Back navigation giữa flow Nạp/Rút — thiếu detail

**Vấn đề:** Flow vẽ: Input → Confirm → Auth → Result. Nhưng KHÔNG vẽ back navigation:
- Đang ở Confirm, bấm back → quay về Input (giữ data hay reset?)
- Đang ở OTP, bấm back → quay về Confirm hay cancel OTP session?
- Đang ở Result, bấm back → ĐÃ LÀM XONG GD, back về đâu??

**Sửa:** Thêm back navigation vào flow:
- Confirm → back → Input (giữ data)
- OTP → back → Confirm (OTP session vẫn valid 60s, có ghi chú ở Epic 1 nhưng Epic 3 thiếu)
- Result → KHÔNG có back button (prevent double transaction confusion). Chỉ có CTA buttons.

---

### 🟡 M4: Dashboard empty state (balance = 0) — CTA thiếu urgency

**Vấn đề:** Edge case #13 nói "Hiển thị 0đ, prompt Nạp tiền ngay". Nhưng flow không vẽ chi tiết empty state dashboard. User vừa kích hoạt → vào dashboard → thấy 0đ + biểu đồ trống → "rồi sao tiếp?"

**Sửa:** Empty state dashboard cần:
1. Hero illustration (visual cue: ví tiền + mũi tên)
2. Copy rõ: "Nạp tiền để bắt đầu sinh lời — Lãi suất 4.5%/năm, rút bất cứ lúc nào"
3. CTA button primary: "Nạp tiền ngay"
4. Ẩn chart section (không hiện chart trống → looks broken)

---

### 🟡 M5: Tổng kết lợi nhuận — khi user kích hoạt giữa tháng

**Vấn đề:** Flow "Tổng kết lợi nhuận" show theo tháng. Nhưng nếu user kích hoạt ngày 28 → tháng đầu tiên chỉ có 2-3 ngày → lãi rất ít → user nghĩ product tệ.

**Sửa:** Tháng đầu tiên cần annotation: "Kích hoạt ngày 28/03 — Lãi tính từ 28/03" để user hiểu context. Hoặc show per-day breakdown cho tháng đầu thay vì chỉ tổng.

---

### 🟡 M6: Biometric flow thiếu state "User cancel biometric"

**Vấn đề:** Flow vẽ: Biometric → Thành công → API, Biometric → Thất bại → OTP. Nhưng thiếu: User chủ động cancel biometric dialog (bấm Cancel trên Face ID / Touch ID prompt). Đây không phải "thất bại" — đây là user KHÔNG MUỐN dùng biometric.

**Sửa:** Thêm: Biometric → Cancel → hiện OTP option (không auto-fallback, vì user có thể muốn cancel cả flow luôn). Nên có "Hủy giao dịch" option cạnh "Dùng OTP".

---

## 4. Minor Issues — Nice-to-have

### 🟢 N1: Quick chips cứng 500K, 1M, 5M, 10M — thiếu context

Nếu user có 800K trong ví → chip 1M, 5M, 10M đều vô dụng. Nên: chip adapt theo balance (VD: 25%, 50%, 75%, max), hoặc ít nhất disable chip > balance.

---

### 🟢 N2: Calendar picker — chưa nói default range

Lịch sử GD có calendar picker, max 90 ngày. Nhưng mở lên default hiện gì? 7 ngày? 30 ngày? Tháng hiện tại? Cần define default.

**Đề xuất:** Default = 30 ngày gần nhất.

---

### 🟢 N3: Currency formatting edge case

Flow nói "luôn dùng locale vi-VN: 1.000.000đ". Nhưng khi user đang nhập, format realtime hay format sau khi blur input? Realtime formatting trên mobile hay bị lỗi cursor position.

**Đề xuất:** Format sau blur. Khi typing hiện raw number.

---

### 🟢 N4: Ẩn/hiện số dư — persist scope

Edge case #15 nói "lưu local, persist qua sessions". Nhưng scope: chỉ Sinh lời dashboard hay đồng bộ với ẩn/hiện balance ở Homepage? Nếu Homepage show balance mà SL ẩn → inconsistent.

**Đề xuất:** 1 setting global cho toàn app, không riêng per-feature.

---

### 🟢 N5: "Gửi lại OTP quá 3 lần → thử lại sau 5 phút" — UX copy

5 phút lock cứng → user chờ 5 phút trên 1 screen trống không biết đếm ngược. Cần countdown timer visible: "Thử lại sau 4:32".

---

## 5. Debate Points — Tao không đồng ý với Nate

### Debate 1: "Bỏ OTP cho nạp" (Nate Rec 1) — TAO ĐỒNG Ý NHƯNG CẦN ĐIỀU KIỆN

Nate nói đúng: nạp = từ túi trái sang túi phải. MoMo/ZaloPay không cần OTP nạp. NHƯNG:

- Nếu ví VSP bị compromise (ai đó có access device) → có thể sweep toàn bộ balance sang SL để "giấu tiền"? Rồi chuyển qua flow rút (lúc đó mới cần OTP)?
- Mitigation: Nạp < 5M → không cần auth. Nạp >= 5M → biometric (không OTP). Nạp >= 50M → OTP bắt buộc.
- Threshold-based auth là đúng hướng, nhưng Nate đề xuất bỏ hẳn thì quá aggressive cho banking app ở VN (regulatory sensitivity).

**Recommendation:** Tiered auth, không bỏ hẳn.

---

### Debate 2: "Hệ thống tự rút khi hủy" (Nate Rec 8) — TẠO KHÔNG ĐỒNG Ý HOÀN TOÀN

Nate nói: hệ thống tự rút + hủy trong 1 transaction, max 3 steps.

Vấn đề:
- Nếu số dư SL = 95M → hệ thống tự rút 95M về ví → vượt daily withdraw limit 30M/ngày?
- Nếu auto-withdraw fail giữa chừng → tiền ở đâu? SL đã hủy nhưng tiền chưa về ví = nightmare.
- Legal: "hủy dịch vụ tài chính + tự động chuyển tiền" cần consent rõ ràng hơn.

**Recommendation:** Giữ 2 steps nhưng streamline: Step 1 = "Xác nhận hủy — Số dư 95M sẽ được chuyển về ví" (show rõ consequences + amount). Step 2 = OTP/biometric. Step 3 = Result. BACKEND tự rút + hủy trong 1 API call. User KHÔNG phải tự vào screen rút tiền riêng. Khác với Nate: user vẫn thấy rõ tiền sẽ được rút, nhưng không phải thao tác riêng.

---

### Debate 3: "Rename Sinh lời tự động → Sinh lời" (Nate Rec 2) — TAO ĐỒNG Ý 100%

Đây là no-brainer. Nếu phase 1 không có auto-sweep thì gọi "tự động" là lừa user. Tao đẩy mạnh hơn Nate: nếu PO vẫn muốn giữ "tự động" → PHẢI có explainer ngay trên Product Intro: "Tự động" = lãi được tính tự động mỗi ngày, không phải tiền tự chuyển. Và tao sẽ flag đây là UX debt phải trả ở phase 2.

---

### Debate 4: Profit Summary — screen riêng hay không?

Nate nói merge vào dashboard tab. Tao nghĩ: PHẢI có screen riêng. Dashboard tab sẽ chật nếu nhồi cả chart 7 ngày + GD gần đây + profit summary tháng + năm. Screen riêng cho Tổng kết cho phép: year picker, monthly breakdown, comparison. Nhưng ENTRY từ dashboard tab phải rõ: 1 row "Tổng kết lợi nhuận" + chevron right → full screen.

---

## 6. Missing Edge Cases — Nate bỏ sót

| # | Edge Case | Epic | Severity | Detail |
|---|-----------|------|----------|--------|
| EC-1 | **Nạp khi ví VSP balance = 0** | 3 | 🔴 | Flow có validate "Số tiền > Số dư ví" nhưng KHÔNG handle case mở screen nạp khi ví = 0. Nên check ngay khi load screen → show inline message "Số dư ví: 0đ — Nạp tiền vào ví trước" + disable input. Analysis mention nhưng flow.md không vẽ. |
| EC-2 | **Concurrent sessions** | 3 | 🔴 | User mở app trên 2 thiết bị, cùng rút tiền → double withdrawal. Flow không mention mutex/locking. Backend concern nhưng UX cần handle: "Giao dịch đang được xử lý trên thiết bị khác". |
| EC-3 | **Lãi suất = 0% hoặc negative** | 2 | 🟡 | Analysis mention nhưng flow không handle. Nếu provider set rate = 0 → dashboard show "0% / năm"? Product Intro vẫn hiện "Kích hoạt ngay"? Cần gate: if rate <= 0 → disable activation + banner "Tạm ngưng nhận đăng ký mới". |
| EC-4 | **User bị block/freeze account giữa flow** | Global | 🟡 | Compliance có thể freeze account bất kỳ lúc nào. Đang nạp/rút mà account bị freeze → API reject nhưng error message gì? "Tài khoản tạm khóa, liên hệ CSKH" + hotline/chat link. |
| EC-5 | **Timezone edge case — lãi tính cuối ngày** | 2 | 🟢 | User ở timezone khác (Việt kiều dùng app) → "hôm qua" là hôm qua của server hay client? Nên dùng server timezone (GMT+7) và note trên UI. |
| EC-6 | **Maintenance mode — provider downtime** | Global | 🟡 | Analysis mention "Nạp khi hệ thống bảo trì" nhưng flow không vẽ. Cần: Entry point → check maintenance flag → nếu maintenance → show banner trên dashboard + disable Nạp/Rút buttons + tooltip "Hệ thống đang bảo trì, thử lại sau". |
| EC-7 | **Re-activation sau hủy — data lịch sử** | 1 | 🟡 | Edge case #45 nói "cho phép đăng ký lại bình thường" nhưng: Lịch sử GD cũ có hiện không? Tổng lợi nhuận tính từ đầu hay reset? Membership rank reset? Cần PO confirm. |
| EC-8 | **Rút toàn bộ balance — lãi ngày hôm đó** | 3 | 🟡 | Analysis mention "Rút khi lãi đang tính" nhưng flow không handle. User rút hết 10M lúc 3PM → lãi ngày đó (đến 3PM) có được tính không? Nếu có → số dư thực tế > 10M (vì có lãi). Nếu không → user mất lãi nửa ngày. Cần copy rõ trên Confirm: "Lãi hôm nay sẽ được tính đến thời điểm rút". |
| EC-9 | **Số dư sinh lời bị thay đổi giữa flow** | 3 | 🔴 | User mở screen Rút, thấy balance 10M, nhập rút 10M. Nhưng giữa lúc đó lãi được cộng → balance thành 10.001.234đ. Hoặc ngược lại: user khác session rút trước → balance giảm. Confirm screen PHẢI re-fetch balance mới nhất và validate lại. |

---

## 7. Final Recommendations — Priority Order

| Priority | Action | Owner | Blocking? |
|----------|--------|-------|-----------|
| **P0** | Align flow.md với analysis recommendations (hoặc mark pending PO decisions rõ ràng) | Nate | ✅ Block Ivy |
| **P0** | Thêm monthly deposit limit validation vào flow Nạp | Nate | ✅ Block Ivy |
| **P0** | Define "Đang xử lý" post-flow: dashboard banner, push notification, lịch sử filter | Nate | ✅ Block Ivy |
| **P0** | Thêm minimum amount validation (50.000đ đề xuất) | Nate + PO | ✅ Block Ivy |
| **P1** | Thêm back navigation cho Epic 3 (Nạp/Rút) — đặc biệt Result screen = no back | Nate | Nên có |
| **P1** | Detail empty state dashboard (hero + copy + CTA) | Nate → Ivy | Nên có |
| **P1** | Handle biometric cancel (khác với biometric fail) | Nate | Nên có |
| **P1** | Re-fetch balance trên Confirm screen trước khi submit | Nate | Nên có |
| **P2** | Define default calendar range cho Lịch sử GD | Nate | Không block |
| **P2** | Adaptive quick chips (disable > balance) | Nate → Ivy | Không block |
| **P2** | OTP lock countdown visible | Nate → Ivy | Không block |
| **P2** | Hủy flow redesign: 1 API call rút + hủy, nhưng show amount rõ trên confirm | Nate + PO | Chờ PO |
| **P3** | Tiered auth cho nạp (threshold-based thay vì bỏ hẳn OTP) | PO decision | Chờ PO |

---

## Chấp nhận được

- Edge case matrix 52 items — coverage tốt, tốt hơn hầu hết BRD analysis tao từng review
- Competitive insights MoMo/ZaloPay/Cake — sắc, actionable
- State transitions cho mỗi screen — chi tiết, đúng format
- Tab Nạp/Rút dùng chung screen — đúng pattern, tiết kiệm navigation
- OTP flow reuse từ VSP hiện tại — consistency tốt
- "Stale" state trên Confirm screen (>5 phút → re-fetch) — tốt, ít ai nghĩ tới

---

*👹 Đức — "Mày là user mày có hiểu cái này không?" — Review done. Ball is Nate's to fix P0s, then Vi routes to Ivy.*

---
Back: [[features/index|Features]] · [[features/sinhloi-auto/status|sinhloi-auto]]
