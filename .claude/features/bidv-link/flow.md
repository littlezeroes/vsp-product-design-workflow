# User Flow — BIDV Liên kết, Nạp/Rút Ví
> Designer: 🔍 Nate | Date: 2026-03-09
> Based on: BRD + PO answers 2026-03-09

---

## Entry Points

1. **Home → "Liên kết ngay"** — Banner/CTA trên Home khi user chưa liên kết NH nào
2. **Home → "Nạp/Rút"** — Quick action button → nếu chưa có NH → redirect Epic 1
3. **Tài khoản → Liên kết ngân hàng** — Từ tab Tài khoản, menu "Liên kết ngân hàng"
4. **Push Notification** — Tap notification kết quả GD → Chi tiết GD (deep link)
5. **Thanh toán → "Nạp thêm"** — Trong flow thanh toán khi số dư không đủ → redirect Epic 2

---

## Epic 1 — Liên kết BIDV

### Happy Path
```
[Entry] → [S1: Danh sách NH] → [S2: Form Liên kết BIDV] → [S3: Chờ xác thực BIDV] → [S4: Kết quả]
```
> 4 screens. S1 reuse `40002105:6991`. S4 reuse `40013468:41558`.

### Flow Diagram
```
[S1: Danh sách NH] (reuse — chỉ hiển thị NH chưa liên kết)
  ├── Chọn BIDV → [S2: Form Liên kết BIDV]
  ├── Chọn NH khác → flow NH tương ứng (out of scope)
  └── Back → previous screen

[S2: Form Liên kết BIDV]
  │   Content: Họ tên (readonly, từ eKYC), SĐT (readonly), CCCD (readonly)
  │   Input: Số tài khoản BIDV (3-14 ký tự số)
  │   Checkbox: TnC + đồng ý chia sẻ (uncheck mặc định → button disabled)
  │
  ├── STK empty / invalid → button disabled (inline validation)
  ├── STK valid + checkbox checked → button "Tiếp tục" enabled
  ├── Tap "Tiếp tục" → loading → check BIDV SmartBanking installed
  │     ├── Installed → deeplink mở BIDV SmartBanking → [S3: Chờ xác thực]
  │     └── Not installed → redirect App Store/Play Store
  │         └── User install → quay lại VSP → tap "Tiếp tục" lại
  ├── API error (STK không tồn tại, CCCD mismatch, etc.) → inline error message
  └── Back → [S1]

[S3: Chờ xác thực BIDV] (NEW screen)
  │   Content: "Đang chờ xác thực từ BIDV SmartBanking"
  │   Countdown: 3 phút
  │   CTA: "Mở lại BIDV SmartBanking" (deeplink retry)
  │
  ├── Callback SUCCESS → [S4: Kết quả Thành công]
  ├── Callback FAILED → [S4: Kết quả Thất bại]
  ├── Callback PENDING → [S4: Kết quả Đang xử lý]
  ├── Countdown hết (3 phút, không callback) → [S4: Kết quả Thất bại — timeout]
  ├── User cancel trên BIDV app → callback cancel → [S4: Kết quả Thất bại]
  └── Network lost → retry dialog

[S4: Kết quả Liên kết] (reuse shared template `40013468:41558`)
  │   3 states:
  │   ✅ Thành công: "Liên kết BIDV thành công" + STK masking + CTA "Về trang chủ"
  │   ❌ Thất bại: Error message + CTA "Thử lại" (→ S2) + "Về trang chủ"
  │   ⏳ Đang xử lý: "Đang xử lý, kiểm tra sau" + CTA "Về trang chủ"
  │
  ├── "Về trang chủ" → Home (updated: BIDV hiển thị trong Quản lý TT)
  ├── "Thử lại" → [S2: Form Liên kết BIDV]
  └── "Nạp tiền ngay" (chỉ khi success) → Epic 2: [S5: Nạp tiền]
```

### Edge Cases — Epic 1
| # | Case | Trigger | UI Response | Source |
|---|------|---------|-------------|--------|
| 1 | STK không tồn tại | API validate | Inline error "Số tài khoản không tồn tại" | BRD code 033 |
| 2 | CCCD/SĐT/Họ tên mismatch | API validate | Inline error "Thông tin không khớp với ngân hàng" | BRD code 003/040 |
| 3 | User chưa đăng ký SmartBanking | API response | Inline error "Tài khoản chưa đăng ký SmartBanking" | BRD code 041 |
| 4 | BIDV đã liên kết | S1 filter | BIDV không hiển thị trong danh sách | BRD |
| 5 | User cancel trên BIDV app | Callback cancel | S4 Thất bại: "Bạn đã hủy xác thực" + Thử lại | BRD |
| 6 | BIDV SmartBanking not installed | OS check | Redirect App Store / Play Store | PO answer Q5 |
| 7 | BIDV SmartBanking version cũ, deeplink fail | Deeplink error | Dialog: "Vui lòng cập nhật BIDV SmartBanking" + link Store | Assumption |
| 8 | Network lost khi đang redirect | Network check | Retry dialog: "Mất kết nối. Thử lại?" | edge-case-lib |
| 9 | Callback delay (retry 1p→3p→10p) | Server retry | S3 countdown reset + "Đang xử lý" | BRD |
| 10 | STK nhập quá 14 ký tự | Input maxLength | Input stops accepting | edge-case-lib |
| 11 | Paste STK from clipboard | Paste event | Auto-validate after paste | edge-case-lib |
| 12 | Double tap "Tiếp tục" | Tap event | Button disabled after first tap | edge-case-lib |
| 13 | App kill mid-flow (đang ở S3) | OS kill | Quay lại VSP → check pending liên kết → resume S3 hoặc show S4 | edge-case-lib |

---

## Epic 2 — Nạp tiền Ví

### Happy Path
```
[Entry] → [S5: Nạp tiền] → [S6: Xác nhận nạp] → [Auth: PIN/FaceID] → [S7: Chờ xác thực BIDV] → [S8: Kết quả]
```
> PO answer Q4: tất cả GD đều qua deeplink xác thực BIDV. Không phân loại A/C/D.

### Flow Diagram
```
[S5: Nạp tiền] (reuse tab "Nạp tiền" — `40002297:32958`)
  │   Content: Chọn nguồn tiền (BIDV — STK masking), Nhập số tiền
  │   Components: AmountInput + QuickAmountChips
  │
  ├── Amount empty → button disabled
  ├── Amount = 0 → inline error "Vui lòng nhập số tiền"
  ├── Amount < min (10.000đ) → inline error "Tối thiểu 10.000đ"
  ├── Amount > max → inline error "Tối đa [max]đ"
  ├── Amount > daily limit → inline error "Vượt hạn mức ngày [limit]đ"
  ├── Amount > monthly limit → inline error "Vượt hạn mức tháng"
  ├── Amount valid → button "Tiếp tục" enabled → [S6]
  └── Back → previous screen

[S6: Xác nhận nạp tiền] (reuse Confirmation pattern)
  │   Content: Nguồn (BIDV ****1234), Số tiền, Phí (nếu có)
  │
  ├── "Xác nhận" → [Auth: PIN/FaceID overlay]
  │     ├── Auth success → check BIDV SmartBanking installed
  │     │     ├── Installed → deeplink mở BIDV → [S7: Chờ xác thực]
  │     │     └── Not installed → redirect Store
  │     ├── Auth fail 1-2x → retry (inline error "Sai PIN")
  │     ├── Auth fail 3x → lock account
  │     └── Biometric fail → fallback PIN
  ├── "Sửa" / Back → [S5]
  └── Session timeout → dialog retry

[S7: Chờ xác thực BIDV] (reuse S3 pattern)
  │   Content: "Xác thực giao dịch tại BIDV SmartBanking"
  │   Countdown: 3 phút
  │   CTA: "Mở lại BIDV SmartBanking"
  │
  ├── Callback SUCCESS → [S8: Kết quả Thành công]
  ├── Callback FAILED → [S8: Kết quả Thất bại]
  ├── Callback PENDING → [S8: Kết quả Đang xử lý]
  ├── Countdown hết → [S8: Kết quả Thất bại — timeout]
  └── Network lost → retry dialog

[S8: Kết quả Nạp tiền] (reuse shared template)
  │   ✅ Thành công: Amount, Nguồn BIDV, Thời gian, Mã GD, Số dư mới
  │   ❌ Thất bại: Error message + "Thử lại" + "Về trang chủ"
  │   ⏳ Đang xử lý: "Kiểm tra sau" + "Về trang chủ"
  │
  ├── "Về trang chủ" → Home
  ├── "Thử lại" → [S5]
  ├── "Nạp thêm" (khi success) → [S5]
  └── Entry từ "Nạp thêm" (thanh toán) + success → quay về flow thanh toán pending
```

### Edge Cases — Epic 2
| # | Case | Trigger | UI Response | Source |
|---|------|---------|-------------|--------|
| 1 | TK BIDV không đủ số dư | Callback/API | S8 Thất bại: "Tài khoản ngân hàng không đủ số dư" | BRD code 035 |
| 2 | Countdown hết, không xác thực BIDV | Timer 3 phút | S8 Thất bại: "Hết thời gian xác thực" + Thử lại | BRD |
| 3 | Amount mismatch (NH trả amount khác) | Callback check | S8 Thất bại + log server. Error: "Giao dịch không thành công" | BRD |
| 4 | Double submit | Tap event | Button disabled after first tap | NFR |
| 5 | App kill ở S7 | OS kill | Resume: check pending GD → show S7 hoặc S8 | edge-case-lib |
| 6 | Callback delay tối đa 10 phút | Server retry | Push notification khi có kết quả | BRD |
| 7 | "Nạp thêm" entry → nạp xong | Thanh toán flow | Redirect về flow thanh toán đang pending | Assumption |
| 8 | User đổi amount sau khi back từ S6 | Navigation | S6 cập nhật amount mới | Standard |
| 9 | Phí GD thay đổi giữa S5 và S6 | Data stale | Warning "Phí đã thay đổi" trên S6 | edge-case-lib |

---

## Epic 3 — Rút tiền Ví

### Happy Path
```
[Entry] → [S9: Rút tiền] → [S10: Xác nhận rút] → [Auth: PIN/FaceID] → [S11: Kết quả]
```
> Rút tiền KHÔNG cần xác thực tại app BIDV (PO answer + BRD). Chỉ auth VSP. Tiền trừ ví trước → gửi NH → callback.

### Flow Diagram
```
[S9: Rút tiền] (reuse tab "Rút tiền" — `40002297:32958`)
  │   Content: Chọn TK nhận (BIDV — STK masking), Nhập số tiền
  │   Components: AmountInput + QuickAmountChips
  │
  ├── Amount empty → button disabled
  ├── Amount = 0 → inline error
  ├── Amount < min (10.000đ) → inline error "Tối thiểu 10.000đ"
  ├── Amount > max → inline error
  ├── Amount > số dư ví → inline error "Số dư ví không đủ"
  ├── Amount > daily/monthly limit → inline error
  ├── Amount valid → button "Tiếp tục" → [S10]
  └── Back → previous screen

[S10: Xác nhận rút tiền] (reuse Confirmation pattern)
  │   Content: TK nhận (BIDV ****1234), Số tiền, Phí (nếu có), Số dư còn lại
  │
  ├── "Xác nhận" → [Auth: PIN/FaceID overlay]
  │     ├── Auth success → trừ tiền ví → gửi NH → [S11: Kết quả]
  │     ├── Auth fail 1-2x → retry
  │     ├── Auth fail 3x → lock
  │     └── Biometric fail → fallback PIN
  ├── Back → [S9]
  └── Session timeout → dialog retry

[S11: Kết quả Rút tiền] (reuse shared template)
  │   ✅ Thành công: Amount, TK nhận BIDV, Thời gian, Mã GD
  │   ❌ Thất bại: Error + "Thử lại" + "Về trang chủ"
  │     → Nếu tiền đã trừ ví: "Tiền sẽ được hoàn trong [X]" (refund notice)
  │   ⏳ Đang xử lý: "Đang xử lý, kiểm tra sau" + "Về trang chủ"
  │
  ├── "Về trang chủ" → Home
  └── "Thử lại" → [S9]
```

### Edge Cases — Epic 3
| # | Case | Trigger | UI Response | Source |
|---|------|---------|-------------|--------|
| 1 | Số dư ví không đủ | Client validate | Inline error "Số dư ví không đủ" trên S9 | BRD |
| 2 | TK BIDV đã đóng/đông | Callback | S11 Thất bại: "Tài khoản ngân hàng không khả dụng" + refund notice | BRD code 036 |
| 3 | Tiền đã trừ ví, NH timeout | Callback timeout | S11 Đang xử lý + push khi resolve. Refund auto nếu fail | BRD |
| 4 | Amount mismatch | Callback | S11 Thất bại + refund + log | BRD |
| 5 | Callback delay (retry 1p→3p→10p) | Server | Push notification khi có kết quả | BRD |
| 6 | Double submit | Tap | Button disabled | NFR |
| 7 | App kill sau auth, trước callback | OS kill | Resumable: check pending GD → show S11 | edge-case-lib |

---

## Epic 4 — Hủy liên kết BIDV

### Happy Path
```
[Entry] → [S12: Chi tiết NH] → [Dialog: Xác nhận hủy] → [S13: Chờ xác thực BIDV] → [S14: Kết quả]
```
> PO answer Q3: Hủy qua deeplink BIDV SmartBanking.

### Flow Diagram
```
[S12: Chi tiết ngân hàng BIDV] (reuse Quản lý TT — `40002297:23425`)
  │   Content: Logo BIDV, Tên NH, STK masking, Ngày liên kết
  │   CTA: "Hủy liên kết"
  │
  ├── "Hủy liên kết" → check GD pending
  │     ├── Có GD pending → Dialog: "Có giao dịch đang xử lý. Vui lòng chờ hoàn tất."
  │     └── Không có GD pending → [Dialog: Xác nhận hủy]
  └── Back → Quản lý TT list

[Dialog: Xác nhận hủy] (BottomSheet)
  │   Variant A (còn NH khác): "Bạn muốn hủy liên kết BIDV? Bạn có thể liên kết lại sau."
  │   Variant B (NH cuối cùng): "Đây là ngân hàng liên kết cuối cùng. Sau khi hủy, bạn sẽ không thể nạp/rút tiền cho đến khi liên kết ngân hàng mới."
  │   CTAs: "Hủy liên kết" (destructive) + "Giữ lại" (secondary)
  │
  ├── "Hủy liên kết" → check BIDV SmartBanking installed
  │     ├── Installed → deeplink → [S13: Chờ xác thực]
  │     └── Not installed → redirect Store
  ├── "Giữ lại" → dismiss dialog → stay S12
  └── Tap outside / swipe down → dismiss

[S13: Chờ xác thực BIDV] (reuse S3 pattern)
  │   Content: "Xác thực hủy liên kết tại BIDV SmartBanking"
  │   Countdown: 3 phút
  │
  ├── Callback SUCCESS → [S14: Kết quả hủy thành công]
  ├── Callback FAILED → [S14: Kết quả thất bại]
  ├── Countdown hết → [S14: Thất bại — timeout]
  └── Network lost → retry dialog

[S14: Kết quả Hủy liên kết] (reuse shared template)
  │   ✅ Thành công: "Đã hủy liên kết BIDV" + CTA "Về trang chủ"
  │     → BIDV hiển thị lại trong danh sách NH khả dụng (S1)
  │     → Token BIDV revoke
  │   ❌ Thất bại: Error + "Thử lại" + "Về trang chủ"
  │
  ├── "Về trang chủ" → Home
  └── "Thử lại" → [S12]
```

### Edge Cases — Epic 4
| # | Case | Trigger | UI Response | Source |
|---|------|---------|-------------|--------|
| 1 | Có GD PENDING | Check before unlink | Dialog block: "Có giao dịch đang xử lý" | Assumption (confirmed) |
| 2 | NH cuối cùng | Check NH count | Dialog variant B — cảnh báo mạnh hơn | BRD |
| 3 | Hủy rồi liên kết lại ngay | User action | Cho phép — BIDV xuất hiện lại trong S1 | Assumption |
| 4 | Token BIDV chưa revoke kịp | Race condition | Server-side: queue revoke. UI: không ảnh hưởng | Assumption |
| 5 | User cancel trên BIDV app | Callback | S14 Thất bại: "Bạn đã hủy xác thực" | BRD |
| 6 | BIDV SmartBanking not installed | OS check | Redirect Store | PO answer |
| 7 | Callback delay | Server retry | Push notification khi resolve | BRD |

---

## Epic 5 — Quản lý

### Screens (tất cả reuse)
```
[S15: Quản lý thanh toán] (reuse `40002297:23425`)
  │   Content: List NH đã liên kết (card: logo, tên, STK masking, trạng thái)
  │   BIDV card mới thêm vào list sau liên kết thành công
  │
  ├── Tap NH card → [S12: Chi tiết NH]
  ├── "Thêm ngân hàng" → [S1: Danh sách NH]
  └── Back → Tài khoản

[S16: Lịch sử giao dịch] (reuse `40003664:4167`)
  │   Content: List GD (filter by type: Nạp/Rút/Liên kết/Hủy)
  │   GD BIDV hiển thị: icon BIDV, type, amount, time, status
  │
  ├── Tap GD → [S17: Chi tiết GD]
  ├── Filter → filter sheet
  ├── Empty state → "Chưa có giao dịch nào"
  └── Pull to refresh

[S17: Chi tiết giao dịch] (reuse shared pattern)
  │   Content: Type, Status (badge), Amount, Phí, NH (BIDV), STK, Thời gian, Mã GD
  │   Status: Thành công (green) | Đang xử lý (yellow) | Thất bại (red)
  │
  ├── Deep link entry (từ push notification) → load trực tiếp
  └── Back → [S16]
```

### Edge Cases — Epic 5
| # | Case | Trigger | UI Response | Source |
|---|------|---------|-------------|--------|
| 1 | Chưa liên kết NH nào | Empty state | FeedbackState: "Chưa liên kết ngân hàng nào" + CTA "Liên kết ngay" | edge-case-lib |
| 2 | Lịch sử GD trống | Empty state | FeedbackState: "Chưa có giao dịch nào" | edge-case-lib |
| 3 | Lịch sử GD > 20 items | Pagination | Infinite scroll / load more | edge-case-lib |
| 4 | Filter active, no results | Filter | "Không tìm thấy giao dịch" | edge-case-lib |
| 5 | Deep link notification → Chi tiết GD | Push tap | Load S17 trực tiếp, back → S16 | BRD |
| 6 | GD status thay đổi (PENDING → SUCCESS) | Real-time/pull | Update badge + amount khi refresh | BRD |

---

## Error States (Global — áp dụng tất cả epics)

| Error | Screens affected | Behavior |
|-------|-----------------|----------|
| Network timeout | S2, S3, S5, S6, S7, S9, S10, S13 | Retry dialog: "Mất kết nối mạng. Vui lòng thử lại." |
| Server 500/502/503 | All API calls | Error screen: illustration + "Hệ thống đang bận" + "Thử lại" |
| Server 504 (Gateway timeout) | S3, S7, S13 | Treat as PENDING → push notification khi resolve |
| Auth locked (3x wrong PIN) | S6, S10 | Redirect lock screen. Unlock qua OTP. |
| Session expired | S6, S10 | Dialog: "Phiên đã hết hạn" → re-auth |
| BIDV maintenance | S2 (API call) | Inline: "BIDV đang bảo trì. Vui lòng thử lại sau." |
| Rate limit (BIDV API) | S2, S3, S7, S13 | Inline: "Quá nhiều yêu cầu. Thử lại sau [X] phút." |

---

## Transitions & Callbacks

### Deeplink Flow (Epic 1, 2, 4)
```
VSP → [Check BIDV app installed]
  ├── YES → deeplink://bidv.smartbanking/... → BIDV app opens
  │         User xác thực trên BIDV → callback to VSP
  │         VSP foreground → S3/S7/S13 (countdown active)
  │         Callback arrives → navigate to Result screen
  │
  └── NO → Universal Link → App Store / Play Store
           User install → back to VSP → user tap "Tiếp tục" lại
```

### Callback States
| State | Meaning | UI Action |
|-------|---------|-----------|
| SUCCESS | GD hoàn tất | Navigate → Result ✅ + push notification |
| FAILED | GD thất bại | Navigate → Result ❌ + push notification |
| PENDING | Chờ xử lý | Navigate → Result ⏳ (enquiry later) + push khi resolve |
| TIMEOUT | Không callback trong 3 phút | Navigate → Result ❌ "Hết thời gian" |
| CANCEL | User hủy trên BIDV app | Navigate → Result ❌ "Đã hủy" |

### Server Retry Schedule (khi callback delay)
```
Attempt 1: sau 1 phút
Attempt 2: sau 3 phút
Attempt 3: sau 10 phút
Fail: mark as FAILED + push notification
```

---

## Screen Inventory

### Screens MỚI cần design (3)
| # | Screen | Type | Justification |
|---|--------|------|---------------|
| S2 | Form Liên kết BIDV | Full screen | Unique: info eKYC readonly + input STK + TnC checkbox. Không merge được vì content khác NH khác |
| S3 | Chờ xác thực BIDV | Full screen | Unique: countdown + deeplink retry CTA. Reuse cho S7 và S13 (cùng pattern, khác copy) |
| Dialog | Xác nhận hủy liên kết | BottomSheet | 2 variants (NH cuối vs không). Nhỏ, không tính screen |

### Screens REUSE (8)
| # | Screen | Reuse từ | Node ID |
|---|--------|----------|---------|
| S1 | Danh sách NH | Liên kết ngân hàng | `40002105:6991` |
| S4, S8, S11, S14 | Kết quả GD | Kết quả giao dịch (shared) | `40013468:41558` |
| S5, S9 | Nạp/Rút tiền | Nạp tiền / Rút tiền | `40002297:32958` |
| S6, S10 | Xác nhận GD | Confirmation pattern | Shared |
| Auth | PIN/FaceID | Xác thực giao dịch | `40004769:73935` |
| S12, S15 | Quản lý TT / Chi tiết NH | Quản lý tài khoản liên kết | `40002297:23425` |
| S16 | Lịch sử GD | Quản lý lịch sử giao dịch | `40003664:4167` |
| S17 | Chi tiết GD | Chi tiết giao dịch | Shared |

---

## Summary

- **Total unique screens:** 17 (S1–S17)
  - Mới cần design: **3** (Form BIDV, Chờ xác thực, Dialog hủy)
  - Reuse existing: **14**
- **Total overlays:** 3 (Auth PIN/FaceID sheet, Dialog xác nhận hủy, Retry dialog)
- **Total unique UI states:** ~45
  - Epic 1: 13 states (form validation + deeplink + callback)
  - Epic 2: 12 states (amount validation + auth + deeplink + callback)
  - Epic 3: 9 states (amount + balance validation + auth + callback)
  - Epic 4: 7 states (pending check + dialog variants + deeplink + callback)
  - Epic 5: 4 states (empty/loaded/filter/detail)
- **Max depth:** 4 levels (Home → Nạp/Rút → Confirm → Auth → Result)
- **Edge cases covered:** 42
- **Entry points:** 5
- **Deeplink flows:** 3 (liên kết, nạp, hủy — rút tiền không cần)

---

## Handoff
> flow.md done → dispatch 👹 Đức cho step-04 (review).
