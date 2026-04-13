# 📋 Khoa — QA State Coverage: Sinh lời tự động

> **QA Engineer:** 📋 Khoa (QA Design)
> **Date:** 2026-03-22
> **Status:** Review v1.0
> **Files reviewed:** `screens.md` (116 states), `flow.md` (52 edge cases), `review.md` (Đức), `decisions.md` (Vi), `analysis.md` (Nate), `edge-case-library.md`

---

## 1. Coverage Summary

| Metric | Số liệu |
|--------|---------|
| Tổng screens | 20 |
| Tổng states trong screens.md | 116 |
| States cần có (theo flow.md + edge-case-library + decisions.md) | 138 |
| States đã cover | 116 |
| **States thiếu** | **22** |
| **Coverage** | **84.1%** |

### Breakdown theo Epic

| Epic | Screens | States có | States thiếu | Coverage |
|------|---------|-----------|--------------|----------|
| Epic 1 — Đăng ký | S1–S5 (5) | 32 | 4 | 88.9% |
| Epic 2 — Quản lý | S6–S7, S15–S18 (6) | 35 | 8 | 81.4% |
| Epic 3 — Nạp/Rút | S8–S14 (7) | 41 | 7 | 85.4% |
| Epic 4 — Hủy | S19–S20 (2) | 8 | 3 | 72.7% |

---

## 2. Missing States — Chi tiết

| # | Screen | State thiếu | Mô tả | Impact | Priority |
|---|--------|-------------|-------|--------|----------|
| M1 | S3: OTP | **Locked countdown visible** | Đức (N5) yêu cầu countdown timer khi bị lock 5 phút ("Thử lại sau 4:32"). screens.md chỉ ghi "Thử lại sau 5 phút" tĩnh, KHÔNG có countdown. | User không biết còn chờ bao lâu → anxiety | 🔴 P1 |
| M2 | S6: Dashboard | **Pending TX banner** | decisions.md (C4) yêu cầu: "Dashboard khi có pending tx → hiện badge 'Đang xử lý' trên balance area". screens.md KHÔNG có state này. | User không biết GD đang xử lý → mở thêm GD mới → duplicate | 🔴 P0 |
| M3 | S6: Dashboard | **Auto-refresh khi có pending** | decisions.md: "Auto-refresh dashboard mỗi 30s khi có pending TX". screens.md không mention. | Pending TX resolve nhưng UI không cập nhật | 🟡 P1 |
| M4 | S8: Deposit | **Minimum amount validation** | decisions.md (C2): min = 10,000đ, error "Số tiền tối thiểu là 10.000đ". screens.md có validation cho zero, exceed wallet, exceed max, exceed monthly — NHƯNG THIẾU min amount. | User nạp 1.000đ → tạo GD rác hoặc backend reject mà FE không báo | 🔴 P0 |
| M5 | S9: Withdraw | **Minimum amount validation** | Tương tự S8 — thiếu validate amount < 10,000đ. | Tương tự S8 | 🔴 P0 |
| M6 | S10: Confirm Deposit | **Balance re-fetch + changed warning** | decisions.md (M3): "Confirm screen luôn fetch fresh balance. Nếu balance thay đổi → show warning + redirect về input". screens.md có "Stale" (>5 phút) nhưng KHÔNG có "balance changed" state riêng. | Balance thay đổi giữa flow → confirm amount sai → GD fail hoặc sai số | 🔴 P1 |
| M7 | S11: Confirm Withdraw | **Balance re-fetch + changed warning** | Tương tự S10 | Tương tự S10 | 🔴 P1 |
| M8 | S8: Deposit | **Tiered auth indicator** | decisions.md (C1): Nạp ≤ 5M không cần OTP, > 5M cần OTP/biometric. screens.md KHÔNG hiển thị auth level sẽ áp dụng. User không biết nạp 4.9M thì không cần OTP nhưng 5.1M thì cần. | Surprise OTP prompt → user confusion | 🟡 P2 |
| M9 | S3: OTP | **Biometric cancel (khác fail)** | Đức (M6): User chủ động cancel biometric ≠ biometric fail. Cần option "Hủy giao dịch" cạnh "Dùng OTP". screens.md không có state riêng cho biometric cancel. | User cancel biometric bị auto-fallback OTP mà không muốn | 🟡 P1 |
| M10 | S8: Deposit | **Adaptive quick chips** | Đức (N1): chips > balance nên disable hoặc adapt. screens.md có "Quick chip exceed" nhưng chip vẫn active → fill rồi mới error. | Tap chip 10tr khi ví có 800K → nhập rồi mới báo lỗi → thừa step | 🟢 P2 |
| M11 | S9: Withdraw | **Adaptive quick chips** | Tương tự S8 cho rút — chips > SL balance nên disable. | Tương tự | 🟢 P2 |
| M12 | S15: History | **Calendar default range** | Đức (N2): chưa define default range khi mở calendar. Đề xuất 30 ngày. screens.md không mention. | Calendar mở lên user không biết đang xem khoảng nào | 🟢 P2 |
| M13 | S15: History | **Pending TX filter** | decisions.md (C4): "Lịch sử GD filter 'Đang xử lý' phải hiện rõ". screens.md filter chips chỉ có: Tất cả / Nạp tiền / Rút tiền / Trả lãi. KHÔNG có filter "Đang xử lý". | User có GD pending muốn check → không filter được | 🟡 P1 |
| M14 | S17: Profit | **First month annotation** | Đức (M5): tháng đầu kích hoạt giữa chừng cần annotation "Kích hoạt ngày 28/03". screens.md không có state này. | User thấy lãi tháng đầu rất ít → nghĩ product tệ | 🟡 P2 |
| M15 | S6: Dashboard | **Maintenance banner** | decisions.md (M4): 503 → maintenance page. Nhưng dashboard cũng cần hiện banner disable Nạp/Rút khi provider maintenance (Đức EC-6). screens.md không có. | User vào dashboard, tap Nạp → lỗi 503 bất ngờ | 🟡 P1 |
| M16 | S1: Product Intro | **Rate = 0% / service paused** | Đức (EC-3): if rate ≤ 0 → disable activation + banner. screens.md không có state này. | User kích hoạt sản phẩm lãi 0% → misleading | 🟡 P1 |
| M17 | S19: Cancel | **Unpaid interest info** | screens.md có "Lãi chưa thanh toán tháng này" nhưng KHÔNG có state khi lãi = 0 hoặc không đủ điều kiện nhận. | User hiểu nhầm sẽ nhận lãi nhưng thực tế không đủ điều kiện | 🟢 P2 |
| M18 | S19: Cancel | **Re-activation history note** | Đức (EC-7): Khi hủy, cần nói rõ "Lịch sử GD sẽ được giữ lại" hoặc "reset". decisions.md không confirm. screens.md có mention "Dữ liệu lịch sử vẫn được lưu" nhưng thiếu trường hợp khi kích hoạt lại → lịch sử cũ hiện hay không. | User kích hoạt lại → confused về data cũ | 🟢 P3 |
| M19 | Global | **Account frozen mid-flow** | Đức (EC-4): Compliance freeze account giữa flow → error "Tài khoản tạm khóa, liên hệ CSKH". KHÔNG có screen/state nào handle. | User bị freeze → generic error → panic | 🟡 P1 |
| M20 | Global | **Session expired** | edge-case-library Navigation: "Session timeout → dialog retry or restart". flow.md edge case #49 mention nhưng screens.md KHÔNG có state cụ thể ở bất kỳ screen nào. | User đang giữa flow → session hết → lost progress | 🟡 P1 |
| M21 | S10/S11: Confirm | **Double-tap spinner** | edge-case-library Confirmation: "Double tap prevention (disable confirm after first tap)". screens.md mention "Double-tap prevention" trong validation nhưng KHÔNG có visual state riêng (disabled + spinner). S10 có Loading state nhưng S11 chỉ ghi "Đang xử lý" mà không detail. | Double tap → duplicate GD | 🟢 P2 |
| M22 | S8: Deposit | **Currency format edge** | Đức (N3): format realtime hay sau blur? screens.md ghi "format realtime" nhưng không handle cursor position issue trên mobile. | Cursor nhảy lung tung khi format realtime → UX frustration | 🟢 P3 |

---

## 3. Decision Compliance Check

| Decision | Ref | screens.md reflect? | Chi tiết |
|----------|-----|---------------------|----------|
| **C1: Tiered auth** — Nạp ≤ 5M không OTP, > 5M cần OTP/biometric | decisions.md C1 | ⚠️ Partial | S10 (Confirm Deposit) exit to OTP/biometric nhưng KHÔNG phân biệt ≤5M vs >5M. Không có logic "skip auth" cho nạp nhỏ. Thiếu indicator trên S8 cho user biết auth level. |
| **C2: Minimum 10,000đ** | decisions.md C2 | ❌ Missing | S8 + S9 KHÔNG có validation state cho amount < 10,000đ. |
| **C3: Monthly limit validate + display** | decisions.md C3 | ✅ Có | S8 có state "Invalid — Exceed monthly" + error message. Nhưng thiếu "Hạn mức còn lại tháng này: Xđ" hiển thị mặc định trên form (decisions.md yêu cầu "ngay trên input"). |
| **C3 (supplement): Monthly limit display** | decisions.md C3 | ⚠️ Partial | S8 Content Spec section 3 chỉ hiện "Số dư Ví V-Smart Pay", KHÔNG hiện "Hạn mức nạp còn lại tháng". |
| **C4: Pending TX banner on dashboard** | decisions.md C4 | ❌ Missing | S6 states KHÔNG có "Pending TX banner" state. |
| **C4: Push notification khi pending resolve** | decisions.md C4 | ⚠️ N/A | Nằm ngoài scope screens.md (backend/push), nhưng cần note ở Result Processing screen. |
| **C4: Pending TX in history với chip vàng** | decisions.md C4 | ✅ Có | S16 có "Loaded — Pending" state với badge vàng. |
| **C4: Auto-refresh 30s** | decisions.md C4 | ❌ Missing | S6 không mention auto-refresh interval. |
| **M1: Hủy — user tự rút trước** | decisions.md M1 | ✅ Có | S7 có "Cancel blocked — balance > 0" dialog. S9 có "Prefill full balance" state. |
| **M2: Concurrent sessions — disable button** | decisions.md M2 | ✅ Có | screens.md mention "Double-tap prevention" ở nhiều screens. |
| **M3: Re-fetch balance on confirm** | decisions.md M3 | ⚠️ Partial | S10/S11 có "Stale" state (>5 phút) nhưng KHÔNG có "balance changed" state khi fresh fetch khác amount. |
| **M4: Maintenance → 503 page** | decisions.md M4 | ❌ Missing | Không có maintenance state ở bất kỳ screen nào. |

### Compliance Score: 4/12 ✅ đầy đủ, 4/12 ⚠️ partial, 4/12 ❌ missing = **33% fully compliant**

---

## 4. Edge Case Gaps — 52 Edge Cases từ flow.md

### Đã cover trong screens.md (40/52 = 76.9%)

| Edge Case # | Mô tả | Screen | Status |
|-------------|-------|--------|--------|
| 1 | User chưa eKYC | S1 — eKYC Required | ✅ |
| 2 | User đã kích hoạt | S1 — Already Activated | ✅ |
| 3 | OTP sai 3 lần | S3 — Error Wrong OTP (lần 3) → Locked | ✅ |
| 4 | OTP hết hạn | S3 — Expired | ✅ |
| 5 | Gửi lại OTP quá limit | S3 — Locked | ✅ |
| 6 | API timeout kích hoạt | S5 — Processing | ✅ |
| 7 | Mất mạng gửi OTP | S3 — Error Send fail | ✅ |
| 8 | Double tap kích hoạt | S2 — validation mention | ✅ |
| 11 | Dashboard load | S6 — Loading | ✅ |
| 12 | API lỗi dashboard | S6 — Error | ✅ |
| 13 | Số dư = 0 | S6 — Zero Balance | ✅ |
| 14 | Pull to refresh | S6 — Refreshing | ✅ |
| 15 | Ẩn/hiện persist | S6 — Balance Hidden + validation | ✅ |
| 16 | Lịch sử trống | S15 — Empty | ✅ |
| 17 | Filter không kết quả | S15 — Filtered no results | ✅ |
| 18 | Calendar > 90 ngày | S15 — validation mention | ✅ |
| 19 | Infinite scroll hết | S15 — Infinite scroll end | ✅ |
| 20 | Lợi nhuận chưa có | S17 — Empty | ✅ |
| 21 | Tháng = ước tính | S17 — Current month estimate | ✅ |
| 22 | Số tiền = 0 (nạp) | S8 — Invalid Zero | ✅ |
| 23 | Số tiền > ví | S8 — Invalid Exceed wallet | ✅ |
| 24 | Tổng SL > 100M | S8 — Invalid Exceed max | ✅ |
| 25 | Nhập rồi xóa | S8 — quay về Empty | ✅ (implicit) |
| 26 | Tap quick chip | S8 — Quick chip selected | ✅ |
| 27 | Quick chip > balance | S8 — Quick chip exceed | ✅ |
| 28 | Lãi suất thay đổi | S10 — Rate changed | ✅ |
| 29 | Biometric fail | S10 exit to OTP fallback | ✅ |
| 31 | API nạp timeout | S13 — Processing Deposit | ✅ |
| 32 | Nạp thành công → nạp thêm | S12 — Success Deposit: "Nạp thêm" | ✅ |
| 34 | Số tiền = 0 (rút) | S9 — Invalid Zero | ✅ |
| 35 | Số tiền > SL balance | S9 — Invalid Exceed SL | ✅ |
| 36 | Số tiền > 30M/ngày | S9 — Invalid Exceed daily | ✅ |
| 37 | Đã rút gần hết limit | S9 — Invalid Partial daily limit | ✅ |
| 39 | API rút timeout | S13 — Processing Withdraw | ✅ |
| 40 | Switch tab Nạp↔Rút | S8 — Tab switch, S9 — Tab switch | ✅ |
| 41 | Hủy khi balance > 0 | S7 — Cancel blocked balance | ✅ |
| 42 | Hủy khi có GD pending | S7 — Cancel blocked pending | ✅ |
| 43 | Hủy thành công | S20 — Success | ✅ |
| 44 | API hủy timeout | S20 — Processing | ✅ |
| 46 | Deep link Dashboard | S6 — Deep link (chưa kích hoạt) redirect | ✅ |

### CHƯA cover trong screens.md (12/52 = 23.1%)

| Edge Case # | Mô tả | Gap | Priority |
|-------------|-------|-----|----------|
| **9** | Back button giữa flow OTP | S3 mention "back quay về màn trước, OTP session valid 60s" trong Content Spec nhưng KHÔNG có state riêng. Flow hành vi đúng nhưng thiếu visual state khi quay lại Confirm (OTP đã gửi, countdown đang chạy). | 🟢 P3 |
| **10** | App kill giữa flow | Không có state nào handle resume/restart sau app kill. flow.md ghi "restart từ đầu" nhưng screens.md không ghi. | 🟢 P3 |
| **30** | Biometric chưa đăng ký | S10/S11 exit to "OTP hoặc Auth (biometric)" nhưng KHÔNG có state "chỉ hiện OTP" khi biometric chưa enroll. | 🟡 P1 |
| **33** | Network lost giữa confirm | S10 có "Error — Network" với Dialog retry. Nhưng S11 chỉ ghi "Dialog retry" mà không detail. Thiếu offline indicator persistent. | 🟡 P2 |
| **38** | Rút khi có pending deposit | screens.md KHÔNG mention pending deposit ảnh hưởng available balance. "Rút từ confirmed balance" chưa reflect trên UI. | 🟡 P1 |
| **45** | Kích hoạt lại sau hủy | S1 có "Re-activation" state. Nhưng KHÔNG nói rõ data lịch sử hiện hay không, membership reset hay không. | 🟡 P2 |
| **47** | Deep link vào Nạp tiền | S8 KHÔNG có state "chưa kích hoạt → redirect". Chỉ S6 có. | 🟡 P1 |
| **48** | Mất mạng bất kỳ lúc nào | Không có global offline state. Mỗi screen tự handle riêng, nhưng một số screen thiếu (S9, S12, S13, S17, S18, S19). | 🟡 P1 |
| **49** | Session hết hạn | Không có state "session expired dialog" ở bất kỳ screen nào. | 🟡 P1 |
| **50** | Currency formatting | S8 ghi "format realtime" nhưng không detail cursor behavior. | 🟢 P3 |
| **51** | Dark mode | screens.md không mention token usage cụ thể. Giả định follow globals.css nhưng cần verify. | 🟢 P2 |
| **52** | Accessibility | screens.md không mention VoiceOver labels, focus order, contrast ratios cho bất kỳ screen nào. | 🟡 P1 |

---

## 5. Đức's Missing Edge Cases (EC-1 → EC-9) Coverage

| EC | Mô tả | screens.md có? | Chi tiết |
|----|-------|---------------|----------|
| EC-1 | Nạp khi ví VSP = 0 | ✅ | S8 — "Wallet empty" state |
| EC-2 | Concurrent sessions | ⚠️ Partial | decisions.md nói "server reject", UI chỉ disable button. Không có state "GD đang xử lý trên thiết bị khác". |
| EC-3 | Lãi suất = 0% / negative | ❌ | Không có state nào handle |
| EC-4 | Account frozen | ❌ | Không có state nào handle |
| EC-5 | Timezone edge | N/A | Server-side, không cần UI state riêng |
| EC-6 | Maintenance mode | ❌ | Không có maintenance state |
| EC-7 | Re-activation — data lịch sử | ⚠️ Partial | S1 có Re-activation state nhưng thiếu chi tiết data handling |
| EC-8 | Rút toàn bộ — lãi ngày đó | ✅ | S9 — "Rút toàn bộ" warning: "Bạn sẽ mất tiền lãi hôm nay" |
| EC-9 | Balance thay đổi giữa flow | ⚠️ Partial | S10/S11 có Stale nhưng thiếu "balance changed" state riêng |

**Score: 2/9 fully covered, 3/9 partial, 3/9 missing, 1/9 N/A**

---

## 6. Consistency Issues — Pattern Mismatches

| # | Issue | Screens | Chi tiết |
|---|-------|---------|----------|
| C1 | **Error state inconsistency** | S10 vs S11 | S10 (Confirm Deposit) có 5 states chi tiết (Default, Loading, Stale, Rate changed, Error Network). S11 (Confirm Withdraw) chỉ có 4 states (Default, Loading, Stale, Error Network). Thiếu "Rate changed" — lãi suất thay đổi cũng ảnh hưởng rút tiền (lãi bị giảm ước tính sẽ thay đổi). |
| C2 | **Network error handling** | S10 vs S11 | S10 có Dialog chi tiết ("Mất kết nối mạng. Thử lại khi có mạng." primary "Thử lại", secondary "Hủy"). S11 chỉ ghi "Dialog retry" — thiếu detail. |
| C3 | **FeedbackState usage** | S4 vs S12 | S4 (Result Activation Success) có Loading state (skeleton). S12 (Result TX Success) KHÔNG có Loading state. Nếu API trả chậm → S12 treo ở đâu? |
| C4 | **Back navigation** | S10, S11 | S10 exit to "Screen 8 (back)" nhưng KHÔNG nói giữ data hay reset. S11 tương tự. Đức (M3) yêu cầu "Confirm → back → Input (giữ data)". screens.md không explicit. |
| C5 | **Result screen NavBar** | S4, S5, S12-14, S20 | Tất cả Result screens đều "Ẩn NavBar" — consistent. ✅ |
| C6 | **Button primary count** | S4, S12, S19 | S4: 2 buttons (primary "Về Dashboard" + secondary "Nạp tiền ngay") ✅. S12 Deposit: primary + secondary ✅. S19: primary "Xác nhận hủy" (danger) + secondary "Quay lại" ✅. Tất cả đúng rule 1 primary/screen. |
| C7 | **Quick chips pattern** | S8 vs S9 | S8 ghi chi tiết chip values (500k, 1tr, 5tr, 10tr). S9 chỉ ghi "Quick chips" không list values. Rút tiền chips nên khác nạp (VD: 1tr, 5tr, 10tr, Tất cả) vì context khác. |
| C8 | **Content Spec padding** | Toàn bộ | S8 có chi tiết padding (pt-[32px], pt-[8px], pt-[16px]). S11 KHÔNG có chi tiết padding — chỉ reference "Giống Screen 10". Cần explicit để tránh sai khi implement. |

---

## 7. Edge Case Library Cross-Check

### edge-case-library.md patterns vs screens.md coverage

| Category | Total patterns | Covered | Missing |
|----------|---------------|---------|---------|
| Form Input | 10 | 8 | "Keyboard covers input (scroll into view)", "Max length reached" |
| Confirmation/Review | 7 | 5 | "Content overflow scrollable" (nếu confirm dài), "Multiple sheets stacked" |
| Auth — OTP | 8 | 8 | ✅ Full |
| Auth — PIN | 9 | 3 | PIN states không áp dụng (feature dùng OTP/biometric, không PIN). Biometric states thiếu: "Biometric not enrolled → OTP only" |
| Result — Success | 4 | 3 | "Share/screenshot option" — không có nhưng có thể N/A |
| Result — Failed | 5 | 5 | ✅ Full |
| List/Dashboard | 7 | 7 | ✅ Full |
| Bottom Sheet/Dialog | 5 | 3 | "Keyboard opens inside sheet → sheet resizes", "Multiple sheets stacked" |
| Navigation/Global | 7 | 2 | **Deep link, back button, app kill, network lost, network restored — hầu hết thiếu hoặc inconsistent** |
| Financial/Fintech | 10 | 7 | "Amount < minimum", "Fee calculation" (N/A — không phí), "Transfer to self" (N/A) |

**Library coverage: 51/72 applicable patterns = 70.8%**

---

## 8. Dark Mode & Accessibility

### Dark Mode
- screens.md KHÔNG mention bất kỳ token nào cụ thể (VD: `text-foreground`, `bg-secondary`).
- Giả định follow CLAUDE.md Golden Rule #1 (never hardcode color) và Rule #9 (semantic tokens only).
- **Risk:** Nếu Ivy implement mà không có explicit token mapping → có thể dùng hardcoded colors (đặc biệt: hero dark section S6, danger cards S19, status badges S15/S16).
- **Recommendation:** Thêm token mapping vào screens.md cho mỗi color usage:
  - Hero dark → `bg-foreground text-background`
  - Danger text → `text-danger`
  - Success badge → `bg-success/10 text-success`
  - Warning badge → `bg-warning/10 text-warning`
  - Pending badge → `bg-warning/10 text-warning`

### Accessibility
- **KHÔNG có** VoiceOver labels cho bất kỳ screen nào.
- **KHÔNG có** focus order specification.
- **KHÔNG có** contrast ratio checks.
- **KHÔNG có** screen reader hints cho:
  - Balance hidden state (VoiceOver nên đọc "Số dư đã ẩn" thay vì "sao sao sao sao")
  - OTP input (từng ô hay toàn bộ?)
  - Chart 7 ngày (alternative text description)
  - Status badges (màu sắc không đủ — cần text label)

**Accessibility score: ❌ 0% — cần bổ sung toàn bộ**

---

## 9. Recommendations — Thứ tự ưu tiên

### 🔴 P0 — Block implementation (PHẢI sửa trước khi code)

| # | Action | Owner | Screens |
|---|--------|-------|---------|
| R1 | Thêm **minimum amount validation** (10,000đ) vào S8 + S9 — thêm state "Invalid — Below minimum" + error message | Ivy | S8, S9 |
| R2 | Thêm **Pending TX banner** state vào S6 Dashboard — badge trên balance area + link xem lịch sử | Ivy | S6 |
| R3 | Thêm **monthly limit display** mặc định trên S8 form (không chỉ khi error) — "Hạn mức nạp còn lại: Xđ" | Ivy | S8 |

### 🟡 P1 — Nên sửa trước khi code

| # | Action | Owner | Screens |
|---|--------|-------|---------|
| R4 | Thêm **tiered auth logic** vào S10 — phân nhánh: ≤5M → skip OTP (navigate thẳng API), >5M → OTP/biometric. Indicator trên S8 cho user biết. | Ivy + Vi confirm | S8, S10 |
| R5 | Thêm **"Đang xử lý" filter chip** vào S15 History | Ivy | S15 |
| R6 | Thêm **balance changed state** vào S10 + S11 — khác "Stale" (>5 phút), đây là fresh fetch mà balance khác | Ivy | S10, S11 |
| R7 | Thêm **biometric cancel state** — user cancel ≠ biometric fail. Options: "Dùng OTP" + "Hủy giao dịch" | Ivy | Auth screen (not in 20 screens — CẦN ADD) |
| R8 | Thêm **session expired dialog** — global state áp dụng cho mọi screen | Ivy | Global |
| R9 | Thêm **OTP locked countdown** — "Thử lại sau 4:32" thay vì text tĩnh | Ivy | S3 |
| R10 | Thêm **deep link redirect** cho S8/S9 — nếu chưa kích hoạt → redirect intro | Ivy | S8, S9 |
| R11 | Thêm **maintenance state** vào S6 (banner + disable Nạp/Rút) | Ivy | S6 |
| R12 | Thêm **rate ≤ 0 state** vào S1 — disable activation button + banner | Ivy | S1 |
| R13 | Thêm **biometric not enrolled** explicit state — auth screen chỉ hiện OTP option | Ivy | Auth |
| R14 | Thêm **network error states** cho screens thiếu: S9, S17, S18 | Ivy | S9, S17, S18 |
| R15 | Bổ sung **accessibility annotations** cơ bản: VoiceOver labels cho balance, OTP, charts, badges | Ivy | All |
| R16 | Thêm **"pending deposit affects available balance"** note vào S9 — rút từ confirmed balance only | Ivy | S9 |

### 🟢 P2 — Nice to have

| # | Action | Owner | Screens |
|---|--------|-------|---------|
| R17 | **Adaptive quick chips** — disable chips > available balance/limit | Ivy | S8, S9 |
| R18 | **Calendar default range** — define 30 ngày mặc định | Ivy | S15 |
| R19 | **First month annotation** trong Profit Summary | Ivy | S17 |
| R20 | **Token mapping** cho dark mode — explicit color tokens mỗi screen | Ivy | All |
| R21 | **Auto-refresh 30s** khi có pending TX | Ivy | S6 |
| R22 | **Withdraw quick chips** cần values khác nạp — thêm "Tất cả" chip | Ivy | S9 |
| R23 | **S11 detail parity** — copy đầy đủ từ S10 thay vì "tương tự" | Ivy | S11 |
| R24 | **Back navigation spec** — explicit "giữ data" khi back từ Confirm → Input | Ivy | S10, S11 |

### 🟢 P3 — Backlog

| # | Action | Owner | Screens |
|---|--------|-------|---------|
| R25 | Currency format: format sau blur thay vì realtime (tránh cursor issue) | Ivy | S8, S9 |
| R26 | App kill behavior ghi rõ: restart flow, không resume | Ivy | Global |
| R27 | Re-activation data handling: confirm với PO lịch sử cũ hiện hay reset | Vi + PO | S1 |

---

## 10. Auth Screen Gap — CRITICAL NOTE

screens.md liệt kê 20 screens nhưng **THIẾU Auth screen** (biometric/PIN/OTP fallback). S10/S11 exit to "OTP hoặc Auth (biometric)" nhưng Auth screen KHÔNG có trong 20 screens breakdown. OTP screen (S3) chỉ handle OTP flow.

**Cần bổ sung Screen 21: Auth (Biometric)** với states:
- Default: Biometric prompt active
- Success: Navigate to API call
- Fail: Show OTP fallback option
- Cancel: User chủ động cancel → "Dùng OTP" + "Hủy giao dịch"
- Not enrolled: Skip biometric, show OTP directly
- Locked: Biometric locked (too many fails) → OTP only

**Hoặc** merge vào S3 (OTP) như pre-step: Biometric attempt → fail/cancel → OTP flow. Nhưng cần explicit states.

---

## Verdict

| Metric | Score | Đánh giá |
|--------|-------|----------|
| State coverage | 84.1% (116/138) | ⚠️ Thiếu 22 states |
| Decision compliance | 33% fully compliant | ❌ 4/12 decisions chưa reflect |
| Edge case coverage (flow.md) | 76.9% (40/52) | ⚠️ 12 edge cases thiếu |
| Edge case coverage (Đức EC) | 22.2% fully (2/9) | ❌ Cần bổ sung |
| Library pattern coverage | 70.8% (51/72) | ⚠️ Navigation/Global yếu nhất |
| Component consistency | 8 issues found | ⚠️ S10 vs S11 bất đồng |
| Dark mode | Implicit only | ⚠️ Không explicit token mapping |
| Accessibility | 0% | ❌ Chưa có annotations |

### Overall: ⚠️ CONDITIONAL PASS

screens.md có nền tảng tốt — 116 states cover phần lớn happy paths và error states. Nhưng **decisions.md compliance quá thấp** (33%), đặc biệt thiếu:
1. Minimum amount validation (P0)
2. Pending TX banner (P0)
3. Tiered auth (P1)
4. Auth screen breakdown (Critical gap)

**Recommendation:** Ivy cần update screens.md với P0 items (R1–R3) trước khi bắt tay code. P1 items (R4–R16) nên xử lý song song khi implement. Ball is Ivy's.

---

*📋 Khoa — "116 states mà vẫn thiếu 22 cái. QA không thương ai." — Review done.*

---
Back: [[features/index|Features]] · [[features/sinhloi-auto/status|sinhloi-auto]]
