# BRD Raw — Sinh lời tự động

**Source:** Confluence `[Đầu tư] Sinh lời tự động - V-Pay - VINIT`
**Date:** 2026-03-09
**PIC:** @trungna3, @Đinh Khánh Dương
**Status:** Draft v2.0
**Target launch:** W13-17/04/2026

---

## Objective
Triển khai tính năng sinh lời tự động cho phép người dùng tối ưu hóa số dư nhàn rỗi trong Ví V-SmartPay bằng cách tự động chuyển tiền nhàn rỗi sang các sản phẩm sinh lời với lãi suất hấp dẫn. One-click, luôn sẵn sàng rút.

## 4 Epics

### Epic 1 — Đăng ký sinh lời
- US 1.1: Khám phá sinh lời (entry từ homepage)
- US 1.2: Xem thông tin sản phẩm (lãi suất, min/max, hạn mức)
- US 1.3: Kích hoạt (confirm info → OTP → result)

### Epic 2 — Quản lý sinh lời
- US 2.1: Xem số dư + lãi (dashboard 2 tabs: Sản phẩm + Quản lý)
- US 2.2: Hiểu cơ chế sinh lời (bottom sheets)
- US 2.3: Xem điều khoản & hợp đồng
- US 2.4: Lịch sử giao dịch (filter type + calendar, max 90 ngày)
- US 2.5: Tổng kết lợi nhuận (yearly/monthly breakdown)

### Epic 3 — Nạp/Rút tiền
- US 3.1: Nạp tiền (from Ví VSP, validate, confirm, auth, result)
- US 3.2: Rút tiền (to Ví VSP, validate, confirm, auth, result)
- US 3.3: Thanh toán/Chuyển tiền — OUT OF SCOPE giai đoạn 1

### Epic 4 — Hủy đăng ký
- US 4.1: Hủy (must rút hết → confirm → OTP → result)

## Key Business Rules
- eKYC bắt buộc
- Max balance: 100 triệu VND (configurable)
- Rút tiền: tức thì về Ví VSP
- Lãi: tính daily, trả monthly
- Hiển thị: "lợi nhuận tạm tính" (không cam kết)
- Hạn mức giao dịch: 100M/tháng (Thông tư 40/2024)
- OTP cho mọi action nhạy cảm
- Auth: reuse luồng OTP/biometric hiện tại của VSP

## Target Users
1. Người đi làm 25-40, tiền nhàn rỗi ngắn hạn
2. Quản lý tài chính gia đình 30-50
3. Gen Z 18-30, ví là tài khoản chính
4. Hộ kinh doanh nhỏ

## KPIs
- Activation completion ≥ 85%
- Time to activate ≤ 30s (P90)
- Sweep success ≥ 99%
- Adoption rate 15-25%
- Instant withdraw success ≥ 99%
- AUM retention ≥ 70% (30 ngày)

## Key Screens (from BRD)
1. Product Intro Page (pre-activation)
2. Confirm Activation (name, phone, CCCD, 2 checkboxes, button)
3. OTP (reuse VSP)
4. Result Activation (success/fail)
5. Dashboard — Tab Sản phẩm (balance, interest rate, yesterday earnings, total earnings)
6. Dashboard — Tab Quản lý (terms, history, profit summary, cancel)
7. Deposit screen (switch Nạp/Rút, from Ví VSP, amount input, estimated interest)
8. Withdraw screen (switch Nạp/Rút, to Ví VSP, amount input, lost interest)
9. Confirm Transaction (deposit/withdraw details)
10. Transaction Result (success/processing/failed)
11. Transaction History (filter type dropdown, calendar picker)
12. Transaction Detail
13. Profit Summary (yearly with monthly breakdown)
14. Terms & Conditions / Loan Agreement
15. Cancel Confirmation
16. Cancel Result

## Validation Rules
- Nạp: amount ≠ 0, ≤ balance Ví, total balance sinh lời ≤ 100M
- Rút: amount ≠ 0, ≤ balance sinh lời, within daily limit
- Hủy: balance must be 0
- Error messages: inline, red text

---
Back: [[features/index|Features]] · [[features/sinhloi-auto/status|sinhloi-auto]]
