# PO Answers — Sinh lời tự động v2
> Date: 2026-03-09 | PO: Huy

## Q1. User chưa eKYC vào sinh lời → block ở đâu?
**→ Option B mở rộng:** Không block. User vẫn vào được, thấy màn onboarding giới thiệu sinh lời nhưng button "Kích hoạt" ở trạng thái disabled. Hiển thị thông báo cần eKYC trước → tạo động lực cho user hoàn tất eKYC.

## Q3. Chuyển tiền + Thanh toán (US 3.3 + 3.4) — in scope?
**→ Out of scope MVP.** Tick MVP 2. Chỉ build Nạp/Rút trong giai đoạn này.

## Q4. "Hợp đồng cho vay" — bản chất sản phẩm?
**→ PO skip.** AI assume: đúng là mô hình cho vay, cần disclaimer phù hợp.

## Q5. Cài đặt "Nạp tiền số dư sinh lời" (AC 2.6.1)?
**→ PO skip.** AI assume: chưa rõ, defer to MVP 2 cùng với Q6.

## Q6. "Số dư tối thiểu" (AC 2.6.2) — tối thiểu ở đâu?
**→ Tối thiểu ở ví sinh lời.** Nhưng chưa làm trong MVP này, tick MVP 2.

## Q2. Hủy đăng ký khi còn số dư > 0?
**→ PO answered.** Hệ thống tự xử lý 100%:
1. Tính toán lãi còn lại
2. Trả lãi về tài khoản sinh lời
3. Rút toàn bộ số dư từ tk sinh lời về ví chính
- KH chỉ trigger hủy, không cần thao tác gì thêm
- Quá trình xử lý trong ngày (không instant, có thể T+0)
- UX implication: cần màn "Đang xử lý hủy" hoặc thông báo "Yêu cầu hủy đã được tiếp nhận, số dư sẽ được chuyển về ví trong ngày"

## Summary for flow design
- **MVP scope:** Epic 1 (Đăng ký) + Epic 2 (Quản lý, trừ AC 2.6.1 + 2.6.2) + Epic 3 (chỉ Nạp/Rút) + Epic 4 (Hủy)
- **MVP 2:** US 3.3 (Chuyển tiền) + US 3.4 (Thanh toán) + AC 2.6.1 (Cài đặt nạp) + AC 2.6.2 (Số dư tối thiểu)
- **eKYC gate:** Soft block — cho xem onboarding, disable button kích hoạt
- **Hủy khi có balance:** AI assume tự động rút về ví

---
Back: [[features/index|Features]] · [[features/sinhloi-v2/status|sinhloi-v2]]
