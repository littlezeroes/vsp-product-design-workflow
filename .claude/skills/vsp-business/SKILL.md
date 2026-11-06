---
name: vsp-business
description: Phân tích nguồn tiền, chi phí, động lực đối tác và tính vận hành của phương án VSP/VinClub. Dùng cho câu hỏi cái gì ra tiền, giá trị kinh tế của ưu đãi, lead, thanh toán hoặc gói; không thay vai UX hay mặc định doanh thu đã phát sinh.
---

# VSP Business — giao dịch nào, tiền thuộc ai

Biến ý tưởng thành chuỗi kinh tế kiểm tra được. Không dùng lượt mở app, tổng điểm, GMV hay số dư ví thay cho doanh thu.

## Đọc đầu vào

Xác định người dùng, tác vụ, đơn vị cung cấp, bên bán, hợp đồng/phạm vi dịch vụ, năng lực vận hành hiện có. Đọc yêu cầu hiện hành và bản demo thật; tách tài liệu kế hoạch khỏi triển khai. Nếu ngày hoặc chính sách đã cũ, xác minh nguồn có thẩm quyền; không lấy sheet ARCHIVED làm cam kết.

Phân biệt dữ kiện nguồn, giả định có thể kiểm thử và điều chưa biết. Thiếu phí/biên lợi nhuận thì dùng công thức hoặc kịch bản gắn giả định, không tự đặt tỷ lệ để kết luận có lãi.

## Lập bản đồ tiền

Với mỗi nhánh, ghi: **khách làm gì → sự kiện tạo giá trị → ai trả → ai nhận → phần VinClub/VinPay hưởng → chi phí → thời điểm xác nhận/hoàn → nguồn chứng minh**.

- Bán vé/gói/dịch vụ: tách tổng tiền đơn, tiền thuộc nhà cung cấp và phần nền tảng được hưởng. Cân nhắc vai trò principal/agent như câu hỏi cần xác nhận với tài chính, không tự kết luận ghi nhận kế toán.
- Affiliate/merchant: lượt chuyển đi chưa phải chuyển đổi; cần attribution, xác nhận đơn, hủy/hoàn, đối soát và điều kiện hoa hồng.
- O2O: xem 3D → lead → tiếp nhận → lịch hẹn → tham dự → giao dịch là các bước khác nhau. Không tự giả định có phí lead/hoa hồng nếu chưa có thỏa thuận.
- Thanh toán: phí chấp nhận/cổng/thu chi hộ chỉ khi có mô hình được xác nhận; doanh số xử lý và tiền nạp ví không phải doanh thu phí.
- VPoint/voucher: xem đơn vị tài trợ, chi phí phát hành/sử dụng theo cơ chế, nghĩa vụ điểm, gian lận, hạn và hoàn. Mua điểm tạo dòng tiền nhưng chưa tự chứng minh doanh thu hay lợi nhuận.
- Membership/bundle: không tự giả định phí hội viên định kỳ. Đọc cấu phần, giá so mua lẻ, hạn, công suất, phân bổ nghĩa vụ và doanh thu giữa P&L.
- Chat/AI/chăm sóc/chiến dịch: phân tích đóng góp gián tiếp (chi tiêu tăng thêm, bán chéo, giữ chân, giảm chi phí), không gán cho chúng nguồn thu riêng khi chưa có bằng chứng.

## Kiểm tra tính thực tế

Nêu rõ ai cung cấp hàng/quyền lợi, ai chịu ngân sách, có tồn chỗ không, ai xác nhận sử dụng, ai xử lý hỗ trợ/hoàn và có dữ liệu kết quả không. App không thể hứa ưu đãi đối tác chưa cam kết cung ứng.

Phần thưởng có thể tạo lượt ghé nhưng cần xem người dùng làm gì sau nhận. So nhịp ngày/tuần/tháng với nguồn cung và ngân sách; cơ chế hợp một lần không tự thành Home thường ngày.

Đặt câu hỏi về tăng thêm: khách vốn đã mua hay thực sự mua thêm? Đo lợi nhuận đóng góp tăng thêm sau tài trợ/quà/phí/vận hành khi đủ dữ liệu. Không suy ra nhân quả từ tương quan; dùng holdout/so sánh thích hợp nếu phạm vi cho phép.

Khi so đối thủ, dùng nguồn chính thức cập nhật cho tính năng/mô hình, dẫn link sát nhận định. Pattern IA là diễn giải; mức phí và thành công ở thị trường khác không được chuyển thẳng sang VinClub.

## Đầu ra

Bảng `nhánh | tạo tiền trực tiếp/gián tiếp | chủ thể hưởng | chi phí/phụ thuộc | bằng chứng | điều cần kiểm chứng` và đề xuất ưu tiên có điều kiện. Nếu cần dự toán, công khai đơn vị và giả định, có kịch bản thấp/cơ sở/cao chỉ khi hữu ích.

Đưa UX ràng buộc kinh doanh có thật (giá, hạn, tồn, consent, nơi hoàn tất); không quyết định layout thay UX. Đưa Product điều kiện readiness và metric. Đưa CEO nhận định đâu đáng đầu tư, đâu chỉ là giả thuyết; không hứa tăng conversion khi chưa đo.
