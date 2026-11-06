# VinClub Dualsurface — phân tích và 10 hướng sản phẩm

## Phạm vi và độ tin cậy

Phân tích dựa trên source của route `/vinclub-dualsurface`, không phải phỏng vấn hay dữ liệu hành vi người dùng. Các painpoint và nhu cầu bên dưới là giả thuyết thiết kế cần kiểm chứng. Khoảng cách, giá, lịch, quyền lợi và kết quả trong 10 phiên bản là dữ liệu minh họa; không có giao dịch hoặc đặt dịch vụ thật.

Route gốc được giữ nguyên. Bộ phương án đặt tại `/vinclub-redesign`, dữ liệu nội dung ở `app/vinclub-redesign/concepts.ts`. Mục tiêu là so sánh mô hình UX và sản phẩm của toàn app, không chỉ thay màu hoặc hero.

## Bản hiện hành: V3

Hai bản thử đầu đã được thay thế vì chỉ trình bày các hành trình ngắn và chưa giữ đủ chức năng của app gốc. Bản dùng để review hiện tại là `/vinclub-redesign`, với 10 route theo hướng sản phẩm và bản clone riêng tại `/vinclub-redesign/baseline`.

V3 có 10 bộ hình raster mới được tạo bằng imagegen, 10 bố cục trang chủ với thứ tự ưu tiên và điều hướng riêng. Các màn hình chức năng dùng chung primitive VSP và mô hình dữ liệu, có thay đổi cách trình bày theo hướng thiết kế; đây không phải 10 design system độc lập.

Các luồng prototype gồm ví (nạp/rút/chuyển/QR), thêm và thanh toán hóa đơn, thẻ hội viên, lưu/đổi ưu đãi, tìm sản phẩm/giỏ hàng/checkout, vé/phòng/booking, nhà/xe, phiên sạc mô phỏng, lịch chăm sóc, quy tắc nhắc, yêu cầu xe/đồ ăn/chuyến bay, trợ lý, hồ sơ và lịch sử. Dữ liệu lưu riêng từng version trên thiết bị. Có cập nhật số dư, điểm, tồn kho, trạng thái hóa đơn và biên nhận. Các tích hợp ngân hàng, bảo hiểm và BNPL liên kết tới luồng có sẵn trong repo.

Giới hạn: không gọi backend thanh toán, hãng bay, nhà cung cấp xe/đồ ăn hoặc thiết bị sạc; yêu cầu dịch vụ chưa gửi thật. Catalogue mua sắm là dữ liệu mẫu, chưa tái tạo toàn bộ cấu trúc thành phố → mall → cửa hàng của app gốc. Ngày và giá mẫu không phải nguồn dữ liệu vận hành. Vì vậy nên dùng bản này để đánh giá thiết kế và usability, không nghiệm thu tích hợp sản xuất.

QA V3 kiểm tra cả 10 version: truy cập domain, đúng billId và số tiền, đổi voucher/điểm, đơn hàng/giỏ/tồn kho, booking/biên nhận/lịch sử, form sai, ngày quá khứ, số khách sai, thiếu số dư, care, rules, charging resume/stop và assistant. Kiểm tra CSS thực tế: content22px, card28px, header54/56px, một primary, indicator139×5 và không overflow ngang. Script: `scripts/vinclub-redesign-v3-check.cjs`; artifact: `output/vinclub-redesign-v3/`. Prompt hình: `docs/vinclub-redesign-image-prompts.json`; ảnh: `public/vinclub-redesign-art/`.

Token-check toàn repo còn selector showcase cũ trả `NOT_FOUND`; audit có phạm vi V3 thay thế cho kiểm tra các màn hình mới. Các lỗi TypeScript ngoài redesign được ghi riêng, không đồng nghĩa toàn repo sạch lỗi.

## Những gì app hiện tại đã làm

- `page.tsx` mở `IPhonePreview` với version `dualsurface`.
- `screen.tsx` chứa ba không gian VinPay / VinClub / VinLife và năm mục điều hướng Trang chủ / Trải nghiệm / Quét mã / Ưu đãi / Tài khoản. Đổi không gian đưa về Trang chủ; đổi nav đưa về không gian VinClub. Vì vậy hai hệ điều hướng có quan hệ phụ thuộc, không phải hai bộ lọc độc lập.
- Trang chủ VinClub đặt thẻ hội viên và điểm phía trên, tiếp theo là trợ lý, promo, tám dịch vụ, các nhóm khám phá và ưu đãi. `home-discovery.tsx` nhóm nội dung theo di chuyển/ăn uống, mua sắm/tiện ích, nghỉ dưỡng/chăm sóc.
- `my-space.tsx` đã có xe, nhà, hóa đơn theo nhóm, thêm hóa đơn, lưu voucher và yêu cầu dịch vụ. Đây là nền tảng hữu ích cho mô hình theo tài sản, không cần bắt đầu lại từ catalog.
- `offers-browser.tsx` đã có tìm kiếm không phân biệt dấu, danh mục và bộ lọc đã lưu. `membership.tsx` có hạng, điểm, quyền lợi đủ điều kiện và các thẻ tham khảo.
- `experiences.tsx` và `experience-booking.tsx` có chọn trải nghiệm, ngày, số khách, nguồn thanh toán và biên nhận/vé demo. Có kiểm tra ngày và số khách, chặn thao tác xác nhận trùng trong component booking.
- `ai-chat.tsx` có hội thoại và các luồng ride/food được điều khiển bằng state. Không có bằng chứng trong phần source đã kiểm tra rằng đây là trợ lý dùng mô hình ngôn ngữ hoặc dữ liệu trực tiếp.
- `screen.tsx` điều hướng các chức năng tiền sang những route khác như `/qr-payment`, `/sbh/my-bills`, `/bnpl`, `/insurance`. Các action khác mở panel hoặc các luồng shopping/booking nội bộ.
- Source có quản lý focus/Escape cho panel, dùng semantic UI components, hỗ trợ reduced motion trong một số animation. Đây là điểm tốt cần giữ khi redesign.

## Các vấn đề cấu trúc đáng kiểm chứng

| Quan sát trong source | Giả thuyết ảnh hưởng UX | Cách kiểm chứng |
| --- | --- | --- |
| Ba không gian cùng năm nav; đổi nav reset không gian | Người mới khó đoán đang ở đâu và quay về đâu | Cho 5–8 người tìm hóa đơn từ từng không gian, ghi nhận sai đường và thời gian |
| Thẻ hội viên, promo, dịch vụ và discovery cùng xuất hiện trên home | Người có việc gấp phải tìm trong nhiều khối nội dung | So sánh tìm hóa đơn đến hạn và đặt xe giữa bản gốc và option 1 |
| Voucher có danh sách và điều kiện, nhưng chưa so sánh lợi ích ròng theo giỏ hàng | Lưu ưu đãi chưa chắc dẫn đến sử dụng | Đo tỷ lệ từ lưu đến dùng, lý do không dùng, hiểu đúng điều kiện |
| Nhà/xe/hóa đơn theo hồ sơ Minh Anh | Chưa hỗ trợ phân công giữa thành viên gia đình | Phỏng vấn ai phụ trách, ai duyệt, các trường hợp trùng hoặc quên khoản |
| Lịch trình, hóa đơn, voucher và các route tài chính ở nhiều state/entry | Trạng thái toàn app khó đối chiếu | Yêu cầu người dùng tìm kết quả giao dịch vừa làm và nơi hỗ trợ |
| State như trips, paidBills, savedVouchers ở React `useState` | Prototype không chứng minh khả năng lưu bền hoặc đồng bộ nhiều thiết bị | Kiểm tra reload và chuyển route; thiết kế backend riêng khi phát triển thật |
| Booking tạo mã demo và báo thanh toán demo | Không thể suy ra dịch vụ thật đã đặt hoặc giá thật khả dụng | Gắn nhãn demo và tách trạng thái thanh toán / nhà cung cấp trong production |

Các quan sát không chứng minh người dùng hiện đang gặp những vấn đề này; chúng chỉ chỉ ra nơi nên đặt câu hỏi và thử nghiệm.

## Nhu cầu người dùng theo công việc

1. Xử lý việc đến hạn mà không bỏ sót.
2. Chi tiêu có lợi thật, không đổi điểm cho thứ không dùng.
3. Phối hợp gia đình với quyền xem và quyền duyệt rõ.
4. Ghép dịch vụ thành một hành trình phù hợp lịch và ngân sách.
5. Tìm dịch vụ gần và có thể dùng vào thời điểm hiện tại.
6. Giảm thao tác lặp nhưng giữ quyền kiểm soát.
7. Diễn đạt ý định mà không phải hiểu tên menu.
8. Biến quyền lợi hội viên thành giá trị đã sử dụng.
9. Duy trì lịch chăm sóc chủ động, tôn trọng riêng tư.
10. Hiểu giá, trạng thái, biên nhận và cách xử lý khi có lỗi.

## So sánh 10 phương án

| # | Hướng / IA chính | Painpoint → problem | Story | Khác biệt sản phẩm | Chỉ số nên đo |
| --- | --- | --- | --- | --- | --- |
| 1 | Hôm nay cần gì / hàng đợi công việc | Việc đến hạn chìm trong khám phá → ưu tiên theo catalog | Minh Anh xử lý điện giữa giờ làm | Xếp theo hạn và mức ưu tiên, home là task queue | Thời gian hoàn tất; tỷ lệ đúng hạn |
| 2 | Chi tiêu đáng tiền / lợi ích ròng | Không biết voucher dùng được → thiếu giá sau điều kiện | Lan so giỏ 650.000đ trước chọn ưu đãi | Nhu cầu và ngân sách trước promo, tách lưu/dùng | Lưu → dùng; tiết kiệm thực |
| 3 | Cả nhà cùng lo / phối hợp | Trùng hoặc quên thanh toán → thiếu phân công | Minh Anh giao học phí cho Hoàng và giữ quyền duyệt | Người phụ trách, người duyệt, lịch chung | Việc có chủ; trễ hạn; trùng |
| 4 | Một hành trình trọn vẹn / lịch trình | Dịch vụ không khớp lịch → nhiều đơn lẻ | Lan ghép nghỉ dưỡng và vé cuối tuần | Tổng dự kiến, timeline và trạng thái từng dịch vụ | Hoàn tất hành trình; xung đột lịch |
| 5 | Quanh nhà mình / địa điểm | Gợi ý xa hoặc đóng cửa → thiếu bối cảnh địa lý | Cư dân chọn trạm sạc tiện đường | Khu vực, khoảng cách, giờ mở và yêu thích | Tìm → chọn; gợi ý khả dụng |
| 6 | Việc đều đặn tự lo / quy tắc | Nhớ lại việc cũ mỗi tháng → workflow lặp thủ công | Minh Anh đặt nhắc điện với ngưỡng và duyệt | Điều kiện kích hoạt, giới hạn, log và pause | Đúng hạn; can thiệp; pause |
| 7 | Nói điều mình cần / ý định | Biết việc, không biết menu → catalog bắt người dùng dịch ý định | Lan nói “đưa mẹ đi khám” | Bản nháp có thể sửa, thiếu thông tin rõ | Hiểu đúng; sửa; hoàn tất |
| 8 | Quyền lợi thành giá trị / kích hoạt | Có hạng nhưng ít dùng → tấm thẻ hơn đường dùng | Minh Anh kích hoạt quyền lợi nghỉ dưỡng | Quyền lợi đủ điều kiện và hướng dẫn dùng | Activation; đã dùng; hết hạn |
| 9 | Sống khỏe có kế hoạch / routine | Quên lịch và thiếu chuẩn bị → chăm sóc rời rạc | Minh Anh tạo nhắc chăm sóc cho mẹ | Lịch nhắc khác lịch xác nhận, checklist, riêng tư | Tham dự; chuẩn bị; bỏ nhắc |
| 10 | Mọi bước đều rõ / trạng thái | Không biết tiền và đơn đến đâu → trạng thái phân tán | Lan tra biên nhận và bước xác nhận nhà cung cấp | Trung tâm giao dịch, tổng phí, hỗ trợ theo khoản | Trùng; hiểu trạng thái; phục hồi |

Mỗi phương án có bốn màn hình tương ứng toàn cảnh riêng, khám phá dịch vụ, hoạt động và quản lý. Tên nav và cách xếp thông tin được đổi theo mô hình sản phẩm; cùng một dịch vụ nền được diễn đạt theo công việc người dùng. Mỗi phương án có một luồng minh họa ba bước và kết quả. Đây là prototype để review hướng, chưa phải bộ đầy đủ mọi edge case và tích hợp nhà cung cấp của một app production.

## Đề xuất lựa chọn và cách thử

Chưa có dữ liệu để chốt một hướng là tốt nhất. Với nguồn hiện tại, option 1 đáng làm ứng viên baseline vì hóa đơn, việc và tài sản đã có trong code, ít phụ thuộc dữ liệu mới. Option 10 là nguyên tắc xuyên suốt cho mọi hướng khi có giao dịch. Nếu mục tiêu kinh doanh là sử dụng đặc quyền, thử option 8 cạnh option 2; nếu muốn mở rộng nhóm gia đình, thử option 3 thay vì chỉ thêm promo cho gia đình.

Option 4 và 5 cần dữ liệu khả dụng và địa điểm từ nhà cung cấp. Option 6 cần quy tắc, audit log, xử lý lỗi và quyền ủy quyền thật trước khi tự thanh toán. Option 7 cần xác nhận intent và trạng thái công cụ thực thi đáng tin cậy. Option 9 chỉ quản lý lịch và checklist, không đưa ra chẩn đoán hoặc điều trị.

Một vòng usability test nên dùng cùng tác vụ cho các hướng phù hợp: trả hóa đơn đến hạn, tìm voucher cho nhu cầu có sẵn, tra kết quả vừa làm. Ghi thời gian, sai đường, hiểu đúng giá/điều kiện và mức tự tin. Sau đó chạy tác vụ riêng của từng hướng: phân công gia đình, lập lịch trình, tạo quy tắc. Không so các option bằng điểm “đẹp” chung.

## Những gì còn cần cho triển khai thật

- Research xác nhận segment và mức độ thường xuyên của các công việc.
- Dữ liệu thật về hạn hóa đơn, giá cuối, tồn dịch vụ, giờ mở và điều kiện quyền lợi.
- Persistence, đồng bộ, idempotency và biên nhận từ backend.
- Hệ quyền gia đình, ủy quyền và thu hồi quyền theo dữ liệu cụ thể.
- Trạng thái loading, empty, pending, retry, partial failure, cancel và refund theo từng luồng.
- Đo lường funnel nhất quán; bảo vệ chỉ số về giao dịch trùng, lỗi và quyền riêng tư.
- Kiểm tra accessibility, navigation, layout mobile và token trước bàn giao production.


## Bản thử đã thay thế

V1/V2 và các script QA cũ chỉ phục vụ lịch sử thử nghiệm. Chúng chưa đáp ứng phạm vi toàn app, nên không dùng các con số màn hình, tab hay luồng của hai bản này để đánh giá V3. Preview tại `public/vinclub-redesign-previews/` hiện là ảnh V3.
