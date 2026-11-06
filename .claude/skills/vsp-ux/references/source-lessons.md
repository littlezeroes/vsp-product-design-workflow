# Bài học từ VinClub đã quan sát — không phải quy tắc phổ quát

Bối cảnh: source phục vụ localhost:3300 trong repo vinpay-all ở thời điểm review; vị trí repo/port có thể thay đổi. Tìm lại bằng route và process trước khi dùng. Những ghi chú source là đánh giá thiết kế, chưa phải nghiên cứu người dùng.

| Dấu vết | Cách đọc đúng | Điều không được suy ra |
|---|---|---|
| `hooks.tsx`: approach có why, pros/cons, competitor refs | Thiết kế đã thử lý do mở app, nhịp ngày/tuần/tháng và tác dụng sau khi nhận | Mọi option cũ đều bị chủ sản phẩm bác bỏ hoặc đã có dữ liệu UT |
| `CONFIRMED_STACK_OPTIONS` trong page | Tập lựa chọn cần bảo tồn khi thử hướng khác; kiểm tra URL và render | Tên option bảo đảm CSS cuối cùng vẫn làm đúng ý định |
| Ví option 2 thấp hơn option 1 38px khi đo | Đánh đổi diện tích tài sản tĩnh để khối sau xuất hiện sớm | Ví nào cũng phải cao 199px |
| Quà mỗi ngày nằm trong `HomeStory`; quà mở sâu | Giữ lời mời khám phá nhỏ trên Home, mở trải nghiệm khi khách quan tâm | Khách chắc chắn quay lại hoặc quà chắc chắn tăng mua |
| Ưu đãi rail + Xem tất cả | Một tầng gợi ý, một tầng duyệt đầy đủ | Rail đã giải quyết nhu cầu tìm một voucher cụ thể |
| Trải nghiệm ảnh lớn | Dành diện tích cho hình dung; kiểm tra cảm hứng và hành động sau đó | Ảnh lớn luôn tốt hơn list |
| Source ghi award chỉ hợp lúc vừa đạt | Moment có thể làm overlay theo sự kiện thay vì Home thường trực | Phải bỏ celebration khỏi sản phẩm |
| Source ghi expiry dễ phiền, progress xa đích gây nản | Cần điều kiện hiển thị theo trạng thái người dùng | Cứ tăng khẩn cấp hoặc tiến độ sẽ tăng retention |

Đường đọc gợi ý: `app/**/vinclub-home/page.tsx`, `hooks.tsx`, `ref-layouts.tsx`, `ref-layouts.css`, `hierarchy.css`, `home-story.tsx`; màn ví `app/**/ui-templates/sumeria/vsp/client.tsx`. Theo import và CSS cascade thực tế, không tìm theo tên rồi dừng.

Thí dụ lập luận tốt: “Giữ số dư và đường mở ví; giảm chiều cao 38px để ưu đãi xuất hiện sớm hơn. Cần thử khách còn nhận ra ví và đọc số dư đúng không.”

Thí dụ kém: “Option 2 premium hơn”, “100 ảnh khác nhau nghĩa là 100 UX”, “người dùng thích rail vì nó đã được chốt”.
