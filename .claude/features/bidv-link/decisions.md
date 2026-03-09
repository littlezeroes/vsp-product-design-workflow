# PO Decisions — bidv-link
> Date: 2026-03-09 | PO: Anh Huy

## 🔴 Chốt (theo Đức)

### 1. Store redirect → persist state + auto-detect
- S2 persist STK + checkbox vào local storage
- Khi quay lại từ Store, auto-detect BIDV đã cài → toast + auto-trigger deeplink

### 2. Merge S6 confirm vào Auth screen
- Không có S6 riêng. Show tóm tắt GD ngay trên PIN screen (như Momo/VNPay)
- Giảm 1 step: S5 → Auth (có summary) → deeplink BIDV → kết quả
- Áp dụng tương tự cho S10 (rút tiền)

### 3. Rút tiền pending — show cụ thể
- S11 "Đang xử lý" phải hiển thị: thời gian hoàn tối đa (15 phút), số dư hiện tại, hotline/live chat button
- Push notification gửi ngay khi PENDING, không đợi resolve

### 4. S3/S7/S13 — thêm Cancel
- Thêm CTA "Hủy giao dịch" (secondary) dưới "Mở lại BIDV SmartBanking"
- Confirm dialog "Bạn muốn hủy?" → navigate về screen trước
- Server-side: cancel pending request

## 🟡 Nên sửa (apply luôn)
- TnC: đổi thành "Đồng ý & Tiếp tục" mở TnC bottom sheet
- "Thử lại": quay về confirm (pre-filled) thay vì form nhập lại
- S5/S9: show số dư ví hiện tại trên input
- Filter: thêm "Tất cả" chip đầu tiên
- Terminology: form → "Tiếp tục", review → "Xác nhận", destructive → "Hủy [action]"
- Epic 1: thêm step indicator (1/3, 2/3, 3/3)
- Edge case 7: generic message "Không thể mở BIDV SmartBanking" thay vì assume version cũ
- Ghi chú: Hủy liên kết KHÔNG yêu cầu auth VSP (confirmed by PO)
