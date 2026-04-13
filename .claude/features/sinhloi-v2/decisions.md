# PO Decisions — Sinh lời tự động v2
> Date: 2026-03-09 | PO: Huy | After: Nate vs Đức debate

## Decision #1: Flow hủy timing → THEO ĐỨC
- Sửa wording S16: "Số dư và lãi sẽ được chuyển về Ví V-Smart Pay trong ngày"
- Hiển thị cụ thể: số dư + lãi dự kiến
- Thêm push noti khi tiền đã chuyển xong
- GD rút tự động hiện trong lịch sử GD chung VSP (không chỉ trong dashboard sinh lời)

## Decision #2: Theo dõi tiền sau hủy → THEO ĐỨC
- GD rút tự động phải hiện trong lịch sử GD chung VSP
- Push noti khi hoàn tất + push noti nếu thất bại (kèm CTA liên hệ CSKH)

## Decision #3: Hủy atomic → OPTION A (ATOMIC)
- Rút fail → hủy cũng fail → sinh lời vẫn active
- User thấy: "Hủy thất bại, vui lòng thử lại"
- Tiền vẫn an toàn trong ví sinh lời, user retry khi nào muốn

## Decision #4: eKYC gate → PO OVERRIDE CẢ HAI
- **Không dùng disabled button** (Đức)
- **Không dùng dialog** (Nate)
- **PO decision:** User vẫn vào Product Page bình thường, xem lãi suất, kéo demo. CTA cuối trang hiển thị **"Xác thực ngay"** (đi eKYC) thay vì "Kích hoạt" disabled. Sau khi eKYC xong quay lại → CTA đổi thành "Kích hoạt sinh lời".
- Lý do: biến blocker thành motivation, user thấy value trước → muốn eKYC

## Decision #5: Số dư = 0 + Rút tiền → THEO ĐỨC
- Chặn trước bằng dialog, không cho vào màn nhập số tiền
- Dialog: "Ví sinh lời chưa có số dư. Bạn có muốn nạp tiền?" CTA: "Nạp tiền" / "Đóng"

## Decision #6-10: Suggestions Đức → ĐỒNG Ý HẾT
- Thêm disclaimer "cho vay" ở product page + màn xác nhận kích hoạt
- Tab Quản lý back → tab Sản phẩm (không phải Home)
- CTA "Không hủy" → "Giữ tính năng" + "Tắt sinh lời" (destructive, màu đỏ)
- Quick chips: 500k | 1tr | 5tr | 10tr (bỏ 50tr)
- Thêm note T-1 trong lịch sử GD + "3 GD gần nhất" trên tab Sản phẩm

---
Back: [[features/index|Features]] · [[features/sinhloi-v2/status|sinhloi-v2]]
