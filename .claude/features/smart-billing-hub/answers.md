# PO Answers — Smart Billing Hub
> Date: 2026-03-10

## MUST ANSWERS

1. **Màn "Thanh toán tập trung"?** → Shared confirm screen (giống VAS `/vas/confirm`)
2. **Multi-PnL payment?** → B: 1 transaction, SBH split backend → user thấy 1 kết quả
3. **Auth PIN/Biometric?** → PIN (chuẩn VSP)
4. **Xóa/sửa profile?** → Cả 2 (edit + delete)
5. **Vinschool bill detail?** → B: Generic (tên, ngày, số tiền, trạng thái)
6. **Auto pay fail?** → A: Fail + push notification
7. **Cross-service selection?** → Bỏ qua (PO skip) → AI assume: Có, cho chọn cross-service

## SHOULD ANSWERS
PO skip → dùng AI assumptions từ analysis.md

---
Back: [[features/index|Features]] · [[features/smart-billing-hub/status|smart-billing-hub]]
