# Screen Breakdown — BIDV Liên kết, Nạp/Rút Ví
> Designer: Ivy | Date: 2026-03-09
> Based on: flow.md (approved 2026-03-09) + decisions.md (PO chốt theo Đức)

---

## Screen S1: Danh sách ngân hàng
- **Route:** `/bank-link/`
- **Type:** List
- **UI Ref:** Revolut — clean rows
- **Reuse from:** Liên kết ngân hàng `40002105:6991`
- **Why this screen exists:** Entry point chọn NH cần liên kết. Filter chỉ hiển thị NH chưa liên kết.
- **Step Indicator:** 1/3

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="large-title", largeTitle="Liên kết ngân hàng", leftIcon=ChevronLeft | icon-only nav, page name in largeTitle |
| Step Indicator | step=1, total=3 | Raw HTML: 3 dots/bar, active = bg-foreground |
| ItemList | — | List NH khả dụng |
| ItemListItem | prefix={BIDVLogo}, label="BIDV", sublabel="Ngân hàng TMCP Đầu tư và Phát triển VN", showChevron={true} | Mỗi NH 1 row |
| ItemListItem | prefix={OtherLogo}, label="...", showChevron={true} | Các NH khác (out of scope) |

**Hierarchy:** Logo + tên NH nổi bật nhất. User scan danh sách, tap chọn.

**States:**

| State | Trigger | UI Change |
|-------|---------|-----------|
| loaded | API trả list NH | List NH hiển thị, BIDV đã liên kết thì ẩn |
| empty | Tất cả NH đã liên kết | FeedbackState: "Bạn đã liên kết tất cả ngân hàng hỗ trợ" |
| loading | Đang load API | Skeleton rows |
| error | API fail | FeedbackState: "Không thể tải danh sách" + Button "Thử lại" |

**Transitions:**
- Tap BIDV → S2 (Form Liên kết BIDV)
- Tap NH khác → flow NH tương ứng (out of scope)
- Back → previous screen (Home / Tài khoản)

**Content:**
- Large title: "Liên kết ngân hàng"
- Empty: "Bạn đã liên kết tất cả ngân hàng hỗ trợ"

---

## Screen S2: Form Liên kết BIDV
- **Route:** `/bank-link/bidv/`
- **Type:** Form Input
- **UI Ref:** Cash App — 1 focus per screen
- **Reuse from:** NEW (unique: readonly eKYC fields + STK input + TnC)
- **Step Indicator:** 2/3

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="large-title", largeTitle="Liên kết BIDV", leftIcon=ChevronLeft | |
| Step Indicator | step=2, total=3 | |
| TextField | label="Họ và tên", value={eKYCName}, readOnly=true | Từ eKYC, không chỉnh được |
| TextField | label="Số điện thoại", value={phone}, readOnly=true | Readonly |
| TextField | label="Số CCCD", value={cccd}, readOnly=true | Readonly |
| TextField | label="Số tài khoản BIDV", placeholder="Nhập số tài khoản", type="numeric", maxLength=14 | 3-14 ký tự số. Auto-validate on paste |
| Button | variant="primary", size="48", fullWidth | "Đồng ý & Tiếp tục" — tap mở TnC bottom sheet |
| BottomSheet | — | TnC content + CTA "Đồng ý & Tiếp tục" |

**Hierarchy:** STK input là focus chính (duy nhất field user nhập). Readonly fields mờ hơn. CTA ở bottom.

**States:**

| State | Trigger | UI Change |
|-------|---------|-----------|
| empty | Initial load | STK empty, Button disabled (grey) |
| typing | User nhập STK | Real-time character count, Button vẫn disabled nếu < 3 chars |
| valid | STK 3-14 ký tự | Button enabled |
| tnc-sheet | Tap "Đồng ý & Tiếp tục" | BottomSheet TnC mở. User đọc + tap "Đồng ý & Tiếp tục" trong sheet → trigger API |
| loading | Submit after TnC agree | Button loading spinner, disabled double-tap |
| error-stk | API: STK không tồn tại (code 033) | TextField error="Số tài khoản không tồn tại" |
| error-mismatch | API: CCCD/SĐT/Tên mismatch (code 003/040) | TextField error="Thông tin không khớp với ngân hàng" |
| error-no-smartbanking | API: Chưa đăng ký SmartBanking (code 041) | TextField error="Tài khoản chưa đăng ký SmartBanking" |
| error-maintenance | BIDV đang bảo trì | InformMessage: "BIDV đang bảo trì. Vui lòng thử lại sau." |
| error-rate-limit | Quá nhiều request | InformMessage: "Quá nhiều yêu cầu. Thử lại sau [X] phút." |
| error-network | Network timeout | Dialog: "Mất kết nối mạng. Vui lòng thử lại." + Button "Thử lại" |
| redirect-store | BIDV SmartBanking chưa cài | Redirect App Store/Play Store. Persist STK vào local storage |
| resume-from-store | Quay lại từ Store, BIDV đã cài | ToastBar: "BIDV SmartBanking đã sẵn sàng" + auto-trigger deeplink |
| deeplink-fail | Không mở được BIDV SmartBanking | Dialog: "Không thể mở BIDV SmartBanking. Vui lòng kiểm tra ứng dụng đã được cập nhật." + CTA mở Store |

**Transitions:**
- TnC agree + BIDV installed → deeplink BIDV → S3
- TnC agree + BIDV not installed → Store redirect → resume
- Back → S1
- Error → stay S2, show inline error

**Content:**
- Large title: "Liên kết BIDV"
- CTA: "Đồng ý & Tiếp tục"
- TnC sheet title: "Điều khoản & Điều kiện"
- TnC sheet CTA: "Đồng ý & Tiếp tục"
- Error STK: "Số tài khoản không tồn tại"
- Error mismatch: "Thông tin không khớp với ngân hàng"
- Error SmartBanking: "Tài khoản chưa đăng ký SmartBanking"
- Deeplink fail: "Không thể mở BIDV SmartBanking. Vui lòng kiểm tra ứng dụng đã được cập nhật."
- Store resume toast: "BIDV SmartBanking đã sẵn sàng"

---

## Screen S3: Chờ xác thực BIDV (Liên kết)
- **Route:** `/bank-link/bidv/waiting/`
- **Type:** Waiting / Processing
- **UI Ref:** OKX — centered status with countdown
- **Reuse from:** NEW (shared pattern cho S7, S13 — cùng layout, khác copy)
- **Step Indicator:** 3/3

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="default", title="Xác thực liên kết" | Không có back (tránh user thoát giữa chừng) |
| Step Indicator | step=3, total=3 | |
| Illustration/Icon | — | Icon BIDV hoặc shield icon, centered, 64px |
| Title text | — | "Đang chờ xác thực từ BIDV SmartBanking" centered |
| Countdown | — | "Còn lại: 2:45" — countdown 3 phút, text-foreground-secondary |
| Button | variant="primary", size="48", fullWidth | "Mở lại BIDV SmartBanking" (deeplink retry) |
| Button | variant="secondary", size="48", fullWidth | "Hủy giao dịch" (PO chốt: thêm Cancel) |

**Hierarchy:** Title + countdown nổi bật nhất (user cần biết đang chờ gì, còn bao lâu). CTA ở bottom.

**States:**

| State | Trigger | UI Change |
|-------|---------|-----------|
| waiting | Initial | Countdown running, cả 2 CTA hiển thị |
| callback-success | BIDV callback SUCCESS | Auto-navigate → S4 (thành công) |
| callback-failed | BIDV callback FAILED | Auto-navigate → S4 (thất bại) |
| callback-pending | BIDV callback PENDING | Auto-navigate → S4 (đang xử lý) |
| callback-cancel | User hủy trên BIDV app | Auto-navigate → S4 (thất bại: "Bạn đã hủy xác thực") |
| timeout | Countdown hết 3 phút | Auto-navigate → S4 (thất bại: "Hết thời gian xác thực") |
| cancel-confirm | Tap "Hủy giao dịch" | Dialog: "Bạn muốn hủy?" + "Hủy giao dịch" (destructive) + "Tiếp tục chờ" (secondary) |
| cancelled | Confirm hủy | Navigate về S2 (form pre-filled từ local storage) |
| network-lost | Mất kết nối | Dialog: "Mất kết nối. Thử lại?" + Button "Thử lại" |
| app-resume | Quay lại từ BIDV / app kill | Check pending liên kết → resume countdown hoặc show S4 nếu đã có kết quả |

**Transitions:**
- Callback success/failed/pending/timeout/cancel → S4
- Cancel confirm → S2 (pre-filled)
- "Mở lại BIDV SmartBanking" → deeplink retry

**Content:**
- Title: "Đang chờ xác thực từ BIDV SmartBanking"
- Countdown: "Còn lại: X:XX"
- CTA primary: "Mở lại BIDV SmartBanking"
- CTA secondary: "Hủy giao dịch"
- Cancel dialog: "Bạn muốn hủy giao dịch liên kết?"
- Cancel confirm: "Hủy giao dịch"
- Cancel dismiss: "Tiếp tục chờ"

---

## Screen S4: Kết quả Liên kết
- **Route:** `/bank-link/bidv/result/`
- **Type:** Result
- **UI Ref:** Cash App — centered, minimal
- **Reuse from:** Kết quả giao dịch (shared) `40013468:41558`

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| FeedbackState | variant="success" / "error" / "pending" | Icon 64px centered + title + description |
| ItemList | — | Chi tiết: NH, STK masking (chỉ khi success) |
| Button | variant="primary", size="48", fullWidth | CTA chính tùy state |
| Button | variant="secondary", size="48", fullWidth | CTA phụ (nếu có) |

**Hierarchy:** Icon trạng thái + title là trọng tâm. Chi tiết bên dưới. CTA ở bottom.

**States:**

| State | Trigger | UI Change |
|-------|---------|-----------|
| success | Callback SUCCESS | FeedbackState success: icon checkmark, title "Liên kết BIDV thành công", detail: "BIDV ****1234". CTA "Nạp tiền ngay" (primary) + "Về trang chủ" (secondary) |
| failed | Callback FAILED / TIMEOUT | FeedbackState error: icon X, title "Liên kết không thành công", description = error message. CTA "Thử lại" (primary) + "Về trang chủ" (secondary) |
| failed-cancel | User hủy trên BIDV | FeedbackState error: title "Liên kết không thành công", description "Bạn đã hủy xác thực trên BIDV SmartBanking". CTA "Thử lại" + "Về trang chủ" |
| failed-timeout | Hết 3 phút | FeedbackState error: description "Hết thời gian xác thực. Vui lòng thử lại." |
| pending | Callback PENDING | FeedbackState pending: icon clock, title "Đang xử lý", description "Kết quả sẽ được thông báo qua tin nhắn". CTA "Về trang chủ" |

**Transitions:**
- "Về trang chủ" → Home (BIDV hiển thị trong Quản lý TT nếu success)
- "Thử lại" → S2 (form pre-filled từ local storage — PO chốt)
- "Nạp tiền ngay" (success only) → S5 (Nạp tiền)

**Content:**
- Success title: "Liên kết BIDV thành công"
- Success detail: "BIDV ****1234"
- Success CTA primary: "Nạp tiền ngay"
- Success CTA secondary: "Về trang chủ"
- Failed title: "Liên kết không thành công"
- Failed cancel desc: "Bạn đã hủy xác thực trên BIDV SmartBanking"
- Failed timeout desc: "Hết thời gian xác thực. Vui lòng thử lại."
- Pending title: "Đang xử lý"
- Pending desc: "Kết quả sẽ được thông báo qua tin nhắn"
- Retry CTA: "Thử lại"
- Home CTA: "Về trang chủ"

---

## Screen S5: Nạp tiền
- **Route:** `/wallet/deposit/`
- **Type:** Form Input
- **UI Ref:** Cash App — amount input focus
- **Reuse from:** Nạp tiền tab `40002297:32958`

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="large-title", largeTitle="Nạp tiền", leftIcon=ChevronLeft | |
| Balance display | — | "Số dư ví: XXX,XXXđ" — text-sm text-foreground-secondary (PO chốt: show số dư) |
| Source selector | — | Card: logo BIDV + "BIDV ****1234" — bg-secondary rounded-[14px] |
| Amount input | — | Large centered amount "0đ" → user nhập. text-[40px] font-bold tabular-nums |
| Quick amount chips | — | Row: 100K, 200K, 500K, 1M — pill chips bg-secondary rounded-full |
| Button | variant="primary", size="48", fullWidth | "Tiếp tục" — disabled until valid amount |

**Hierarchy:** Amount input lớn nhất (financial data = biggest text). Số dư ví hiển thị trên amount. Source NH bên dưới.

**States:**

| State | Trigger | UI Change |
|-------|---------|-----------|
| empty | Initial | Amount = "0đ", Button disabled |
| typing | User nhập số | Amount cập nhật real-time, Button vẫn disabled nếu invalid |
| valid | Amount trong range (10K-max) | Button enabled |
| error-min | Amount < 10.000đ | Inline error "Tối thiểu 10.000đ" dưới input |
| error-max | Amount > max | Inline error "Tối đa [max]đ" |
| error-daily | Amount > daily limit | Inline error "Vượt hạn mức ngày [limit]đ" |
| error-monthly | Amount > monthly limit | Inline error "Vượt hạn mức tháng" |
| quick-select | Tap chip 100K/200K/500K/1M | Amount fill chip value, validate |
| loading | Submit | Button loading spinner |

**Transitions:**
- Valid + "Tiếp tục" → Auth screen (merged confirm — PO chốt: không có S6 riêng)
- Back → previous screen

**Content:**
- Large title: "Nạp tiền"
- Balance: "Số dư ví: XXX,XXXđ"
- Source: "BIDV ****1234"
- CTA: "Tiếp tục"
- Error min: "Tối thiểu 10.000đ"
- Error max: "Tối đa [max]đ"
- Error daily: "Vượt hạn mức ngày [limit]đ"
- Error monthly: "Vượt hạn mức tháng"

---

## Screen Auth-Deposit: Xác nhận & Xác thực Nạp tiền
- **Route:** `/wallet/deposit/auth/`
- **Type:** Auth (PIN/FaceID) + Confirmation (merged)
- **UI Ref:** OKX — PIN cell boxes + summary (Momo/VNPay pattern)
- **Reuse from:** Xác thực giao dịch `40004769:73935` (extended: thêm summary section)
- **Note:** PO chốt merge S6 confirm vào Auth screen — show tóm tắt GD ngay trên PIN

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="default", title="Xác nhận nạp tiền", leftIcon=ChevronLeft | |
| Summary section | — | Nguồn: BIDV ****1234, Số tiền: XXX,XXXđ, Phí: 0đ (nếu có). ItemList rows, bg-secondary rounded-[14px] |
| PIN input | 6 cells | OTP-style 6 cells centered. Auto-submit khi đủ 6 số |
| Biometric prompt | — | FaceID/TouchID nếu enrolled. Fallback → PIN |

**Hierarchy:** Summary GD ở trên (user review trước khi nhập PIN). PIN cells ở giữa = focus chính. Không có CTA button riêng — auto-submit khi đủ PIN.

**States:**

| State | Trigger | UI Change |
|-------|---------|-----------|
| default | Load screen | Summary hiển thị, PIN empty, biometric prompt (nếu enrolled) |
| biometric-prompt | Auto-trigger | OS biometric dialog |
| biometric-success | Auth thành công | Check BIDV installed → deeplink → S7 |
| biometric-fail | Biometric fail | Fallback: show PIN input |
| pin-typing | User nhập PIN | Cells fill, dot masking |
| pin-success | PIN đúng | Loading → check BIDV → deeplink → S7 |
| pin-error-1 | PIN sai lần 1 | Shake animation + "Sai mã PIN. Còn 2 lần thử" |
| pin-error-2 | PIN sai lần 2 | Shake + "Sai mã PIN. Còn 1 lần thử" |
| pin-locked | PIN sai lần 3 | Lock account. Navigate → lock screen. Unlock qua OTP |
| redirect-store | BIDV chưa cài (after auth) | Redirect Store. Persist state |
| resume-store | Quay lại từ Store | Toast + auto-trigger deeplink |
| session-timeout | Session hết hạn | Dialog: "Phiên đã hết hạn" → re-auth |
| fee-changed | Phí thay đổi so với S5 | InformMessage warning: "Phí đã thay đổi" trên summary |

**Transitions:**
- Auth success + BIDV installed → deeplink BIDV → S7
- Auth success + BIDV not installed → Store redirect
- Back → S5 (giữ amount đã nhập)
- Pin locked → lock screen

**Content:**
- Title: "Xác nhận nạp tiền"
- Summary rows: "Nguồn tiền" / "Số tiền" / "Phí giao dịch"
- PIN label: "Nhập mã PIN"
- Error 1: "Sai mã PIN. Còn 2 lần thử"
- Error 2: "Sai mã PIN. Còn 1 lần thử"
- Fee warning: "Phí đã thay đổi"
- Session expired: "Phiên đã hết hạn. Vui lòng thử lại."

---

## Screen S7: Chờ xác thực BIDV (Nạp tiền)
- **Route:** `/wallet/deposit/waiting/`
- **Type:** Waiting / Processing
- **UI Ref:** OKX — centered status with countdown
- **Reuse from:** S3 pattern (cùng layout, khác copy)

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="default", title="Xác thực giao dịch" | Không có back |
| Illustration/Icon | — | Shield/BIDV icon centered 64px |
| Title text | — | "Xác thực giao dịch tại BIDV SmartBanking" centered |
| Countdown | — | "Còn lại: X:XX" — 3 phút |
| Button | variant="primary", size="48", fullWidth | "Mở lại BIDV SmartBanking" |
| Button | variant="secondary", size="48", fullWidth | "Hủy giao dịch" (PO chốt) |

**Hierarchy:** Giống S3. Title + countdown nổi bật.

**States:**

| State | Trigger | UI Change |
|-------|---------|-----------|
| waiting | Initial | Countdown running |
| callback-success | SUCCESS | → S8 (thành công) |
| callback-failed | FAILED | → S8 (thất bại) |
| callback-pending | PENDING | → S8 (đang xử lý) |
| timeout | 3 phút hết | → S8 (thất bại timeout) |
| cancel-confirm | Tap "Hủy giao dịch" | Dialog: "Bạn muốn hủy giao dịch nạp tiền?" |
| cancelled | Confirm hủy | → S5 (pre-filled) |
| network-lost | Mất kết nối | Retry dialog |
| app-resume | Quay lại app | Check pending GD → resume hoặc show S8 |

**Transitions:**
- Callback → S8
- Cancel → Auth-Deposit hoặc S5 (pre-filled — PO chốt: "Thử lại" quay về confirm pre-filled)
- Retry deeplink → BIDV SmartBanking

**Content:**
- Title: "Xác thực giao dịch tại BIDV SmartBanking"
- Countdown: "Còn lại: X:XX"
- CTA primary: "Mở lại BIDV SmartBanking"
- CTA secondary: "Hủy giao dịch"
- Cancel dialog: "Bạn muốn hủy giao dịch nạp tiền?"

---

## Screen S8: Kết quả Nạp tiền
- **Route:** `/wallet/deposit/result/`
- **Type:** Result
- **UI Ref:** Cash App — centered, minimal
- **Reuse from:** Kết quả giao dịch (shared) `40013468:41558`

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| FeedbackState | variant tùy state | Icon + title + description |
| ItemList | — | Chi tiết GD: Nguồn, Số tiền, Phí, Thời gian, Mã GD, Số dư mới |
| Button | variant="primary", size="48", fullWidth | CTA chính |
| Button | variant="secondary", size="48", fullWidth | CTA phụ |

**Hierarchy:** Icon trạng thái + amount nổi bật nhất. Chi tiết GD bên dưới.

**States:**

| State | Trigger | UI Change |
|-------|---------|-----------|
| success | SUCCESS | FeedbackState success. Detail: Nguồn BIDV, Amount, Phí, Thời gian, Mã GD, Số dư mới. CTA "Nạp thêm" (primary) + "Về trang chủ" (secondary) |
| failed | FAILED | FeedbackState error. Error message. CTA "Thử lại" (primary) + "Về trang chủ" (secondary) |
| failed-insufficient | BIDV không đủ số dư (code 035) | FeedbackState error: "Tài khoản ngân hàng không đủ số dư" |
| failed-timeout | Hết thời gian | FeedbackState error: "Hết thời gian xác thực" |
| pending | PENDING | FeedbackState pending: "Đang xử lý, kiểm tra sau". CTA "Về trang chủ" |

**Transitions:**
- "Về trang chủ" → Home
- "Thử lại" → Auth-Deposit (pre-filled — PO chốt: quay về confirm, không phải form)
- "Nạp thêm" (success) → S5
- Entry từ "Nạp thêm" (thanh toán) + success → quay về flow thanh toán pending

**Content:**
- Success title: "Nạp tiền thành công"
- Success detail rows: "Nguồn tiền: BIDV ****1234" / "Số tiền: XXX,XXXđ" / "Phí: 0đ" / "Thời gian: DD/MM/YYYY HH:mm" / "Mã giao dịch: XXXXXX" / "Số dư mới: XXX,XXXđ"
- Success CTA primary: "Nạp thêm"
- Failed title: "Nạp tiền không thành công"
- Failed insufficient: "Tài khoản ngân hàng không đủ số dư"
- Failed timeout: "Hết thời gian xác thực"
- Pending title: "Đang xử lý"
- Pending desc: "Kết quả sẽ được thông báo qua tin nhắn"
- Retry CTA: "Thử lại"
- Home CTA: "Về trang chủ"

---

## Screen S9: Rút tiền
- **Route:** `/wallet/withdraw/`
- **Type:** Form Input
- **UI Ref:** Cash App — amount input focus
- **Reuse from:** Rút tiền tab `40002297:32958`

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="large-title", largeTitle="Rút tiền", leftIcon=ChevronLeft | |
| Balance display | — | "Số dư ví: XXX,XXXđ" — text-sm text-foreground-secondary (PO chốt: show số dư) |
| Destination selector | — | Card: logo BIDV + "BIDV ****1234" — bg-secondary rounded-[14px] |
| Amount input | — | Large centered "0đ" → text-[40px] font-bold tabular-nums |
| Quick amount chips | — | Row: 100K, 200K, 500K, 1M |
| Button | variant="primary", size="48", fullWidth | "Tiếp tục" |

**Hierarchy:** Amount input lớn nhất. Số dư ví hiển thị rõ (quan trọng cho rút tiền — user cần biết giới hạn).

**States:**

| State | Trigger | UI Change |
|-------|---------|-----------|
| empty | Initial | Amount = "0đ", Button disabled |
| typing | User nhập | Amount cập nhật |
| valid | Amount trong range, <= số dư | Button enabled |
| error-min | < 10.000đ | Inline error "Tối thiểu 10.000đ" |
| error-max | > max | Inline error "Tối đa [max]đ" |
| error-balance | > số dư ví | Inline error "Số dư ví không đủ" |
| error-daily | > daily limit | Inline error "Vượt hạn mức ngày [limit]đ" |
| error-monthly | > monthly limit | Inline error "Vượt hạn mức tháng" |
| quick-select | Tap chip | Amount fill + validate |

**Transitions:**
- Valid + "Tiếp tục" → Auth-Withdraw (merged confirm — PO chốt)
- Back → previous screen

**Content:**
- Large title: "Rút tiền"
- Balance: "Số dư ví: XXX,XXXđ"
- Destination: "BIDV ****1234"
- CTA: "Tiếp tục"
- Error min: "Tối thiểu 10.000đ"
- Error balance: "Số dư ví không đủ"

---

## Screen Auth-Withdraw: Xác nhận & Xác thực Rút tiền
- **Route:** `/wallet/withdraw/auth/`
- **Type:** Auth (PIN/FaceID) + Confirmation (merged)
- **UI Ref:** OKX — PIN cell boxes + summary
- **Reuse from:** Xác thực giao dịch `40004769:73935` (extended: thêm summary)
- **Note:** PO chốt merge S10 confirm vào Auth screen (tương tự Auth-Deposit)

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="default", title="Xác nhận rút tiền", leftIcon=ChevronLeft | |
| Summary section | — | TK nhận: BIDV ****1234, Số tiền: XXX,XXXđ, Phí: Xđ, Số dư còn lại: XXXđ. bg-secondary rounded-[14px] |
| PIN input | 6 cells | Auto-submit khi đủ |
| Biometric prompt | — | FaceID/TouchID fallback PIN |

**Hierarchy:** Summary ở trên (đặc biệt "Số dư còn lại" nổi bật — user cần biết). PIN cells ở giữa.

**States:**

| State | Trigger | UI Change |
|-------|---------|-----------|
| default | Load | Summary hiển thị, biometric prompt |
| biometric-prompt | Auto | OS dialog |
| biometric-success | OK | Trừ ví → gửi NH → S11 |
| biometric-fail | Fail | Fallback PIN |
| pin-typing | Nhập | Cells fill |
| pin-success | Đúng | Loading → trừ ví → gửi NH → S11 |
| pin-error-1 | Sai 1 | Shake + "Sai mã PIN. Còn 2 lần thử" |
| pin-error-2 | Sai 2 | Shake + "Sai mã PIN. Còn 1 lần thử" |
| pin-locked | Sai 3 | Lock → OTP unlock |
| session-timeout | Timeout | Dialog re-auth |

**Transitions:**
- Auth success → trừ ví → gửi NH → S11 (Rút tiền KHÔNG cần deeplink BIDV)
- Back → S9
- Pin locked → lock screen

**Content:**
- Title: "Xác nhận rút tiền"
- Summary rows: "Tài khoản nhận" / "Số tiền" / "Phí giao dịch" / "Số dư còn lại"
- PIN label: "Nhập mã PIN"

---

## Screen S11: Kết quả Rút tiền
- **Route:** `/wallet/withdraw/result/`
- **Type:** Result
- **UI Ref:** Cash App — centered, minimal
- **Reuse from:** Kết quả giao dịch (shared) `40013468:41558`
- **Note:** PO chốt: Pending state phải show thời gian hoàn + số dư + hotline

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| FeedbackState | variant tùy state | Icon + title + description |
| ItemList | — | Chi tiết GD |
| InformMessage | hierarchy="primary" | Chỉ khi pending: refund notice + hotline |
| Button | variant="primary", size="48", fullWidth | CTA chính |
| Button | variant="secondary", size="48", fullWidth | CTA phụ |

**Hierarchy:** Icon trạng thái + amount. Pending state: InformMessage refund notice nổi bật (text-warning).

**States:**

| State | Trigger | UI Change |
|-------|---------|-----------|
| success | NH callback SUCCESS | FeedbackState success: "Rút tiền thành công". Detail: TK nhận BIDV, Amount, Phí, Thời gian, Mã GD. CTA "Về trang chủ" |
| failed | FAILED | FeedbackState error. CTA "Thử lại" (primary) + "Về trang chủ" (secondary) |
| failed-account | TK BIDV đóng/đông (code 036) | FeedbackState error: "Tài khoản ngân hàng không khả dụng" + InformMessage: "Tiền sẽ được hoàn về ví trong tối đa 15 phút" |
| failed-refund | Tiền đã trừ ví, NH fail | FeedbackState error + InformMessage: "Tiền sẽ được hoàn về ví trong tối đa 15 phút" |
| pending | PENDING / NH timeout | FeedbackState pending: "Đang xử lý". InformMessage: "Hoàn tiền trong tối đa 15 phút nếu giao dịch không thành công" + "Số dư hiện tại: XXX,XXXđ" + Button "Liên hệ hỗ trợ" (hotline/live chat). CTA "Về trang chủ" |

**Transitions:**
- "Về trang chủ" → Home
- "Thử lại" → Auth-Withdraw (pre-filled — PO chốt: quay về confirm)
- "Liên hệ hỗ trợ" → hotline / live chat

**Content:**
- Success title: "Rút tiền thành công"
- Success detail: "Tài khoản nhận: BIDV ****1234" / "Số tiền: XXX,XXXđ" / "Thời gian: DD/MM/YYYY HH:mm" / "Mã giao dịch: XXXXXX"
- Failed title: "Rút tiền không thành công"
- Failed account: "Tài khoản ngân hàng không khả dụng"
- Refund notice: "Tiền sẽ được hoàn về ví trong tối đa 15 phút"
- Pending title: "Đang xử lý"
- Pending balance: "Số dư hiện tại: XXX,XXXđ"
- Pending refund: "Hoàn tiền trong tối đa 15 phút nếu giao dịch không thành công"
- Hotline CTA: "Liên hệ hỗ trợ"
- Retry CTA: "Thử lại"
- Home CTA: "Về trang chủ"

---

## Screen S12: Chi tiết ngân hàng BIDV
- **Route:** `/bank-management/bidv/`
- **Type:** Detail
- **UI Ref:** Revolut — clean detail rows
- **Reuse from:** Quản lý tài khoản liên kết `40002297:23425`

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="large-title", largeTitle="BIDV", leftIcon=ChevronLeft | |
| Bank card | — | Logo BIDV + "BIDV" + STK masking. bg-secondary rounded-[14px] p-[14px] |
| ItemList | — | "Tên ngân hàng: BIDV" / "Số tài khoản: ****1234" / "Ngày liên kết: DD/MM/YYYY" |
| Button | variant="secondary", size="48", fullWidth, intent="danger" | "Hủy liên kết" — destructive |
| BottomSheet (Confirm hủy) | — | 2 variants |
| BottomSheet (GD pending block) | — | Khi có GD pending |

**Hierarchy:** Bank info card nổi bật. "Hủy liên kết" ở bottom, destructive styling.

**States:**

| State | Trigger | UI Change |
|-------|---------|-----------|
| loaded | API load | Bank detail hiển thị, "Hủy liên kết" button |
| unlink-check | Tap "Hủy liên kết" | Loading check GD pending |
| pending-block | Có GD pending | Dialog: "Có giao dịch đang xử lý. Vui lòng chờ hoàn tất trước khi hủy liên kết." + "Đóng" |
| confirm-normal | Không có GD pending, còn NH khác | BottomSheet: "Bạn muốn hủy liên kết BIDV? Bạn có thể liên kết lại sau." + "Hủy liên kết" (destructive) + "Giữ lại" (secondary) |
| confirm-last | NH cuối cùng | BottomSheet variant B: "Đây là ngân hàng liên kết cuối cùng. Sau khi hủy, bạn sẽ không thể nạp/rút tiền cho đến khi liên kết ngân hàng mới." + "Hủy liên kết" (destructive) + "Giữ lại" (secondary) |
| redirect-store | BIDV SmartBanking chưa cài | Redirect Store |
| loading | API call | Button loading |

**Transitions:**
- Confirm "Hủy liên kết" + BIDV installed → deeplink BIDV → S13
- Confirm + not installed → Store redirect
- "Giữ lại" / tap outside → dismiss sheet, stay S12
- Back → S15 (Quản lý thanh toán)

**Content:**
- Large title: "BIDV"
- Detail rows: "Tên ngân hàng" / "Số tài khoản" / "Ngày liên kết"
- CTA destructive: "Hủy liên kết"
- Confirm normal: "Bạn muốn hủy liên kết BIDV? Bạn có thể liên kết lại sau."
- Confirm last: "Đây là ngân hàng liên kết cuối cùng. Sau khi hủy, bạn sẽ không thể nạp/rút tiền cho đến khi liên kết ngân hàng mới."
- Confirm CTA destructive: "Hủy liên kết"
- Confirm CTA secondary: "Giữ lại"
- Pending block: "Có giao dịch đang xử lý. Vui lòng chờ hoàn tất trước khi hủy liên kết."
- Note: Hủy liên kết KHÔNG yêu cầu auth VSP (PO confirmed)

---

## Screen S13: Chờ xác thực BIDV (Hủy liên kết)
- **Route:** `/bank-management/bidv/waiting/`
- **Type:** Waiting / Processing
- **UI Ref:** OKX — centered status with countdown
- **Reuse from:** S3 pattern (cùng layout, khác copy)

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="default", title="Xác thực hủy liên kết" | Không có back |
| Illustration/Icon | — | Shield/BIDV icon centered 64px |
| Title text | — | "Xác thực hủy liên kết tại BIDV SmartBanking" |
| Countdown | — | 3 phút |
| Button | variant="primary", size="48", fullWidth | "Mở lại BIDV SmartBanking" |
| Button | variant="secondary", size="48", fullWidth | "Hủy giao dịch" (PO chốt) |

**Hierarchy:** Giống S3/S7.

**States:**

| State | Trigger | UI Change |
|-------|---------|-----------|
| waiting | Initial | Countdown running |
| callback-success | SUCCESS | → S14 (thành công) |
| callback-failed | FAILED | → S14 (thất bại) |
| callback-cancel | User hủy trên BIDV | → S14 (thất bại: "Bạn đã hủy xác thực") |
| timeout | 3 phút | → S14 (thất bại timeout) |
| cancel-confirm | Tap "Hủy giao dịch" | Dialog: "Bạn muốn hủy?" |
| cancelled | Confirm | → S12 |
| network-lost | Mất kết nối | Retry dialog |

**Transitions:**
- Callback → S14
- Cancel → S12

**Content:**
- Title: "Xác thực hủy liên kết tại BIDV SmartBanking"
- CTA primary: "Mở lại BIDV SmartBanking"
- CTA secondary: "Hủy giao dịch"
- Cancel dialog: "Bạn muốn hủy yêu cầu hủy liên kết?"

---

## Screen S14: Kết quả Hủy liên kết
- **Route:** `/bank-management/bidv/result/`
- **Type:** Result
- **UI Ref:** Cash App — centered, minimal
- **Reuse from:** Kết quả giao dịch (shared) `40013468:41558`

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| FeedbackState | variant tùy state | Icon + title + description |
| Button | variant="primary", size="48", fullWidth | CTA chính |
| Button | variant="secondary", size="48", fullWidth | CTA phụ (nếu có) |

**Hierarchy:** Icon + title. Minimal detail (hủy liên kết không cần nhiều info).

**States:**

| State | Trigger | UI Change |
|-------|---------|-----------|
| success | SUCCESS | FeedbackState success: "Đã hủy liên kết BIDV". CTA "Về trang chủ". BIDV xuất hiện lại trong S1 |
| failed | FAILED | FeedbackState error + error message. CTA "Thử lại" (primary) + "Về trang chủ" (secondary) |
| failed-cancel | User hủy trên BIDV | "Bạn đã hủy xác thực trên BIDV SmartBanking" |
| failed-timeout | Timeout | "Hết thời gian xác thực. Vui lòng thử lại." |

**Transitions:**
- "Về trang chủ" → Home
- "Thử lại" → S12

**Content:**
- Success title: "Đã hủy liên kết BIDV"
- Success CTA: "Về trang chủ"
- Failed title: "Hủy liên kết không thành công"
- Retry CTA: "Thử lại"
- Home CTA: "Về trang chủ"

---

## Screen S15: Quản lý thanh toán
- **Route:** `/bank-management/`
- **Type:** List
- **UI Ref:** Revolut — clean rows
- **Reuse from:** Quản lý tài khoản liên kết `40002297:23425`

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="large-title", largeTitle="Quản lý thanh toán", leftIcon=ChevronLeft | |
| ItemList | — | List NH đã liên kết |
| ItemListItem | prefix={BankLogo}, label="BIDV", sublabel="****1234", metadata="Đã liên kết", showChevron={true} | Card mỗi NH |
| Button | variant="secondary", size="48", fullWidth | "Thêm ngân hàng" |

**Hierarchy:** NH cards nổi bật. "Thêm ngân hàng" CTA ở bottom.

**States:**

| State | Trigger | UI Change |
|-------|---------|-----------|
| loaded | API load | List NH hiển thị |
| empty | Chưa liên kết NH nào | FeedbackState: "Chưa liên kết ngân hàng nào" + Button "Liên kết ngay" |
| loading | Đang load | Skeleton rows |

**Transitions:**
- Tap NH card → S12 (Chi tiết NH)
- "Thêm ngân hàng" → S1 (Danh sách NH)
- Back → Tài khoản

**Content:**
- Large title: "Quản lý thanh toán"
- Empty: "Chưa liên kết ngân hàng nào"
- Empty CTA: "Liên kết ngay"
- Add CTA: "Thêm ngân hàng"

---

## Screen S16: Lịch sử giao dịch
- **Route:** `/transactions/`
- **Type:** List / Dashboard
- **UI Ref:** Revolut — transaction list with filters
- **Reuse from:** Lịch sử giao dịch `40003664:4167`

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="large-title", largeTitle="Lịch sử giao dịch", leftIcon=ChevronLeft | |
| Filter chips | — | "Tất cả" (default active) / "Nạp" / "Rút" / "Liên kết" / "Hủy" — horizontal scroll, pill style. PO chốt: thêm "Tất cả" chip đầu tiên |
| ItemList | — | List GD grouped by date |
| ItemListItem | prefix={BIDVIcon}, label="Nạp tiền", sublabel="DD/MM HH:mm", metadata="+100,000đ", subMetadata="Thành công" | Mỗi GD 1 row |
| FeedbackState | — | Empty state |

**Hierarchy:** Filter chips ở trên. GD list là main content. Amount + status nổi bật mỗi row.

**States:**

| State | Trigger | UI Change |
|-------|---------|-----------|
| loaded | API | List GD hiển thị, "Tất cả" chip active |
| empty | Chưa có GD | FeedbackState: "Chưa có giao dịch nào" |
| filtered | Tap chip | List filter theo type, chip active style |
| filtered-empty | Filter active, no results | FeedbackState: "Không tìm thấy giao dịch" |
| loading | Load / refresh | Skeleton rows |
| load-more | Scroll bottom, > 20 items | Infinite scroll / load more spinner |
| pull-refresh | Pull down | Refresh indicator + reload data |

**Transitions:**
- Tap GD → S17 (Chi tiết GD)
- Filter chip → filter list
- Back → previous screen

**Content:**
- Large title: "Lịch sử giao dịch"
- Filter chips: "Tất cả" / "Nạp" / "Rút" / "Liên kết" / "Hủy"
- Empty: "Chưa có giao dịch nào"
- Filtered empty: "Không tìm thấy giao dịch"
- Amount format: "+100,000đ" (nạp, positive) / "-100,000đ" (rút, negative)
- Status: "Thành công" (text-success) / "Đang xử lý" (text-warning) / "Thất bại" (text-danger)

---

## Screen S17: Chi tiết giao dịch
- **Route:** `/transactions/[id]/`
- **Type:** Detail
- **UI Ref:** Revolut — transaction detail
- **Reuse from:** Chi tiết giao dịch (shared pattern)

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="default", title="Chi tiết giao dịch", leftIcon=ChevronLeft | |
| Amount display | — | text-[40px] font-bold centered. "+100,000đ" hoặc "-100,000đ" |
| Status badge | — | Pill: "Thành công" bg-success/10 text-success / "Đang xử lý" bg-warning/10 text-warning / "Thất bại" bg-danger/10 text-danger |
| ItemList | — | Detail rows |
| ItemListItem | label="Loại giao dịch", metadata="Nạp tiền" | |
| ItemListItem | label="Ngân hàng", metadata="BIDV" | |
| ItemListItem | label="Số tài khoản", metadata="****1234" | |
| ItemListItem | label="Phí", metadata="0đ" | |
| ItemListItem | label="Thời gian", metadata="DD/MM/YYYY HH:mm" | |
| ItemListItem | label="Mã giao dịch", metadata="XXXXXX" | |

**Hierarchy:** Amount lớn nhất (top). Status badge ngay dưới. Detail rows bên dưới.

**States:**

| State | Trigger | UI Change |
|-------|---------|-----------|
| loaded | API / navigation | Full detail hiển thị |
| loading | Deep link entry | Loading spinner → load detail |
| status-updated | GD status thay đổi (PENDING → SUCCESS) | Badge + amount update khi refresh |

**Transitions:**
- Back → S16 (Lịch sử GD)
- Deep link entry (push notification tap) → load trực tiếp, back → S16

**Content:**
- Title: "Chi tiết giao dịch"
- Detail rows: "Loại giao dịch" / "Trạng thái" / "Ngân hàng" / "Số tài khoản" / "Số tiền" / "Phí" / "Thời gian" / "Mã giao dịch"

---

## Overlay: Dialog Xác nhận hủy liên kết
- **Type:** BottomSheet
- **Used in:** S12
- **Reuse from:** BottomSheet component

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| BottomSheet | — | Grabber pill top |
| Title | — | Tùy variant |
| Description | — | Tùy variant |
| ButtonGroup | layout="vertical" | 2 buttons |
| Button | variant="primary", intent="danger", size="48" | "Hủy liên kết" (destructive) |
| Button | variant="secondary", size="48" | "Giữ lại" |

**States:**

| State | Content |
|-------|---------|
| variant-normal | Title: "Hủy liên kết BIDV?", Desc: "Bạn có thể liên kết lại sau." |
| variant-last | Title: "Hủy liên kết BIDV?", Desc: "Đây là ngân hàng liên kết cuối cùng. Sau khi hủy, bạn sẽ không thể nạp/rút tiền cho đến khi liên kết ngân hàng mới." |

---

## Overlay: Dialog Cancel (S3/S7/S13)
- **Type:** Dialog (centered)
- **Used in:** S3, S7, S13

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Dialog | — | Centered modal |
| Title | — | "Hủy giao dịch?" |
| Description | — | Context-dependent |
| Button | variant="primary", intent="danger" | "Hủy giao dịch" |
| Button | variant="secondary" | "Tiếp tục chờ" |

**States:**

| State | Description text |
|-------|-----------------|
| cancel-link (S3) | "Yêu cầu liên kết sẽ bị hủy." |
| cancel-deposit (S7) | "Yêu cầu nạp tiền sẽ bị hủy." |
| cancel-unlink (S13) | "Yêu cầu hủy liên kết sẽ bị hủy." |

---

## Overlay: Network Retry Dialog
- **Type:** Dialog
- **Used in:** S2, S3, S5, S7, S9, S13 (global)

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Dialog | — | Centered |
| Title | — | "Mất kết nối mạng" |
| Description | — | "Vui lòng kiểm tra kết nối và thử lại." |
| Button | variant="primary" | "Thử lại" |

---

## Overlay: Server Error Screen
- **Type:** Full screen overlay
- **Used in:** Any API call (global)

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| FeedbackState | variant="error" | Illustration + "Hệ thống đang bận" |
| Button | variant="primary", size="48" | "Thử lại" |

---

## Summary

| Screen | Type | Components | States | Route |
|--------|------|-----------|--------|-------|
| S1: Danh sách NH | List | 4 | 4 | /bank-link/ |
| S2: Form Liên kết BIDV | Form Input | 7 | 14 | /bank-link/bidv/ |
| S3: Chờ xác thực (Liên kết) | Waiting | 6 | 10 | /bank-link/bidv/waiting/ |
| S4: Kết quả Liên kết | Result | 4 | 5 | /bank-link/bidv/result/ |
| S5: Nạp tiền | Form Input | 6 | 8 | /wallet/deposit/ |
| Auth-Deposit: Xác nhận & Xác thực Nạp | Auth+Confirm | 4 | 12 | /wallet/deposit/auth/ |
| S7: Chờ xác thực (Nạp) | Waiting | 6 | 8 | /wallet/deposit/waiting/ |
| S8: Kết quả Nạp tiền | Result | 4 | 5 | /wallet/deposit/result/ |
| S9: Rút tiền | Form Input | 6 | 8 | /wallet/withdraw/ |
| Auth-Withdraw: Xác nhận & Xác thực Rút | Auth+Confirm | 4 | 10 | /wallet/withdraw/auth/ |
| S11: Kết quả Rút tiền | Result | 5 | 5 | /wallet/withdraw/result/ |
| S12: Chi tiết NH BIDV | Detail | 6 | 6 | /bank-management/bidv/ |
| S13: Chờ xác thực (Hủy) | Waiting | 6 | 8 | /bank-management/bidv/waiting/ |
| S14: Kết quả Hủy liên kết | Result | 3 | 4 | /bank-management/bidv/result/ |
| S15: Quản lý thanh toán | List | 4 | 3 | /bank-management/ |
| S16: Lịch sử GD | List | 5 | 7 | /transactions/ |
| S17: Chi tiết GD | Detail | 7 | 3 | /transactions/[id]/ |
| Overlay: Dialog hủy liên kết | BottomSheet | 5 | 2 | — |
| Overlay: Dialog Cancel | Dialog | 4 | 3 | — |
| Overlay: Network Retry | Dialog | 3 | 1 | — |
| Overlay: Server Error | Full screen | 2 | 1 | — |

**Totals:**
- Screens: 17 (S1-S17, thay S6/S10 bằng Auth-Deposit/Auth-Withdraw merged)
- Overlays: 4
- Components used: Header, ItemList, ItemListItem, TextField, Button, ButtonGroup, BottomSheet, Dialog, FeedbackState, InformMessage, ToastBar
- Total states: ~147
- Step indicator: Epic 1 only (1/3, 2/3, 3/3)

**PO Decisions Applied:**
1. S6/S10 merged vào Auth screen (Auth-Deposit, Auth-Withdraw) — show summary trên PIN screen
2. S3/S7/S13 có nút "Hủy giao dịch" (secondary) + confirm dialog
3. Store redirect → persist state (local storage) + auto-detect BIDV installed → toast + auto-trigger deeplink
4. S11 pending → show thời gian hoàn (15 phút) + số dư hiện tại + hotline button
5. TnC → "Đồng ý & Tiếp tục" mở TnC bottom sheet (thay checkbox)
6. "Thử lại" → quay về Auth screen (pre-filled confirm) thay vì form nhập lại
7. S5/S9 → show "Số dư ví: XXX,XXXđ"
8. Epic 1 → step indicator (1/3, 2/3, 3/3)
9. S16 filter → thêm "Tất cả" chip đầu tiên (default active)

---

> screens.md done → dispatch Khoa cho step-07 (state coverage check).
