# Decisions — Sinh lời tự động
> Vi (Design Lead) resolve critical issues từ Đức review + Nate analysis

---

## Critical Issues Resolution

### 🔴 C1: OTP inconsistency (Nate recommend bỏ OTP nạp, nhưng flow vẫn có)
**Decision:** Áp dụng **tiered auth** theo Đức đề xuất:
- **Nạp ≤ 5M:** Không OTP, chỉ confirm screen → thực hiện luôn
- **Nạp > 5M:** OTP hoặc Biometric
- **Rút (mọi mức):** Luôn OTP/Biometric (vì tiền ra khỏi sinh lời)
- **Kích hoạt:** OTP (theo BRD, không thay đổi)
- **Hủy:** OTP (action nghiêm trọng)

**Lý do:** Giảm friction cho nạp nhỏ (tăng activation), vẫn giữ security cho rút/hủy.

### 🔴 C2: Thiếu minimum amount validation
**Decision:**
- **Minimum nạp:** 10,000 VND (standard VSP minimum)
- **Minimum rút:** 10,000 VND
- **Error message:** "Số tiền tối thiểu là 10.000đ"
- Thêm vào `data.ts`: `minAmount: 10000`

### 🔴 C3: Monthly limit 100M chưa validate trong flow Nạp
**Decision:**
- Validate tại màn Nạp tiền: check (total nạp tháng này + amount) ≤ 100M
- Hiển thị "Hạn mức còn lại tháng này: X đ" ngay trên input
- Error inline: "Số tiền nạp vượt quá hạn mức tháng. Hạn mức còn lại: X đ"
- Cũng validate server-side (double check)

### 🔴 C4: "Đang xử lý" result không define post-flow
**Decision:**
- Màn "Đang xử lý" có nút "Trang chủ sinh lời" → về dashboard
- Dashboard: giao dịch pending hiển thị badge "Đang xử lý" trên balance area
- Push notification khi giao dịch hoàn tất (success/fail)
- Transaction history: pending TX hiển thị với status chip màu vàng
- Auto-refresh dashboard mỗi 30s khi có pending TX

---

## Major Concerns Resolution

### 🟡 M1: Hủy flow — rút tay vs tự rút
**Decision:** Theo BRD gốc — user phải tự rút hết trước khi hủy. Lý do: minh bạch, user biết rõ tiền đi đâu. Cancel screen sẽ check balance > 0 → show message "Vui lòng rút hết số dư trước khi hủy" + button "Rút tiền" redirect.

### 🟡 M2: Concurrent sessions
**Decision:** Không handle UI-side. Server sẽ reject duplicate requests. UI chỉ disable button sau khi tap (prevent double-tap).

### 🟡 M3: Re-fetch balance on confirm screen
**Decision:** Confirm screen luôn fetch fresh balance khi mount. Nếu balance thay đổi → show warning "Số dư đã thay đổi, vui lòng kiểm tra lại" + redirect về input screen.

### 🟡 M4: Maintenance mode
**Decision:** Global error handler — nếu API trả 503 → show full-screen maintenance page (reuse existing VSP pattern).

---

## Design Principles Applied
1. **Fewer steps > more steps** — tiered auth giảm friction
2. **Show don't tell** — hiển thị hạn mức còn lại, ước tính lãi realtime
3. **Progressive disclosure** — bottom sheets cho thông tin chi tiết
4. **Error prevention > error handling** — validate inline, disable button khi invalid
5. **Trust through transparency** — "lợi nhuận tạm tính", không dùng từ "cam kết"

---

## Assumptions (chưa PO confirm)
1. Tiered auth threshold 5M — có thể điều chỉnh qua config
2. Min amount 10,000đ — standard VSP, chưa confirm với đối tác
3. Auto-refresh 30s — UX decision, chưa confirm backend support
4. Daily withdraw limit 30M — từ data.ts existing, chưa confirm BRD mới

---
Back: [[features/index|Features]] · [[features/sinhloi-auto/status|sinhloi-auto]]
