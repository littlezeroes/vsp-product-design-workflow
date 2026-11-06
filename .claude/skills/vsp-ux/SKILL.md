---
name: vsp-ux
description: Phân tích và chọn IA, layout, tương tác từ source, bản render và các option đã thử trong VSP/VinClub. Dùng khi cần hiểu lựa chọn thiết kế, so phương án hoặc dựng UI có lý do; không thay thế phân tích nguồn tiền hay quyết định roadmap.
---

# VSP UX — đọc hành vi trước khi chọn layout

Đưa ra quyết định thiết kế giải thích được: khách thấy gì, hiểu gì, muốn chạm gì, làm gì tiếp và quay lại vì sao. Đừng bắt đầu bằng slogan hay nhân số lượng màn.

## Đọc đúng hiện trạng

- Với localhost, xác định process/repo phục vụ đúng port, route và iframe. Không mặc định workspace hiện tại là source đích; phân biệt VinClub host với ví nhúng.
- Đọc quy tắc dự án đang áp dụng, entrypoint, renderer, dữ liệu option, CSS cuối cùng ghi đè và hành vi thực. Tìm cấu hình selected/confirmed/default, archive và ghi chú pros/cons.
- Phân biệt **ý định của option → cấu hình đang lưu → kết quả render**. Archive không chứng minh người dùng đã bác bỏ, càng không chứng minh nguyên nhân; chỉ ghi lý do loại khi có quyết định/ghi chú tương ứng. Default code cũng không chứng minh cấu hình đang dùng khi URL/storage ghi đè.
- Khi chỉ review, không sửa sản phẩm. Khi được yêu cầu build/fix, thực hiện trong phạm vi đã giao; không biến review-only của một skill khác thành cấm sửa toàn phiên.
- Mỗi kết luận quan trọng gắn source file:line, screenshot, trace hoặc tài liệu. Gắn nhãn `quan sát`, `tài liệu`, `giả thuyết`, `đã kiểm chứng`; thiếu nguồn thì nói chưa biết.

## Chọn layout theo vai trò nội dung

Với từng khối, điền: **vai trò → trạng thái khách → mức chú ý → hình thức → điểm vào/đích đến → đánh đổi → cách kiểm chứng**.

1. Tài sản/trạng thái (điểm, tiền, hạng): nhận biết nhanh, đọc đúng, có đích quản lý riêng; không chiếm hết diện tích nội dung tạo hành động.
2. Công cụ/dịch vụ: tìm hoặc chọn nhanh, tên và lợi ích phân biệt được; chọn grid/list theo số lựa chọn, độ dài nhãn và nhu cầu so sánh.
3. Ưu đãi: một lời đề nghị với thương hiệu, lợi ích, điều kiện; phân biệt đang khám phá và đã sở hữu.
4. Quà/khoảnh khắc: lời mời gọn, mở sâu khi khách quan tâm; kiểm tra nhận xong đi đâu và lý do quay lại. Không thêm phần thưởng ngẫu nhiên chỉ để tạo hứng thú.
5. Trải nghiệm: giúp hình dung và muốn tham gia; ảnh/thẻ lớn phải phục vụ quyết định, không che giá, điều kiện hoặc hành động.
6. Hoạt động: đang diễn ra/đã hoàn tất/cần xử lý; trạng thái, lịch sử và hỗ trợ phải tìm lại được.

Đọc nhịp toàn màn: **nhận biết → chọn/chạm thử → hình dung/khám phá**, hoặc nhịp khác có lý do theo tác vụ. Đây là giả thuyết khởi đầu cho Home, không phải template bắt buộc cho mọi màn.

Đo viewport, độ cao khối, vùng đầu màn, phần nội dung bị đẩy xuống, lượng lựa chọn cùng lúc và dấu hiệu còn nội dung. Nếu giảm khối tĩnh, nói nội dung nào được nhìn sớm hơn. Một ví cao 237→199px trong source từng đọc là ví dụ tiết kiệm 38px, không phải kích thước chuẩn cho mọi ví.

- Rail phù hợp khám phá có chọn lọc nếu có dấu hiệu vuốt và đường xem đủ; grid/list phù hợp tìm và so sánh. Không mặc định rail luôn tốt hay xấu.
- Giữ trục chữ cấp màn hình và padding nội bộ card theo cấp nội dung; không kéo mọi chữ về cùng mép.
- Giữ nhận diện ổn định giữa nhiều loại thẻ, nhưng không làm ví, voucher, dịch vụ và trải nghiệm trông giống hệt nhau.
- Primary CTA cố định chỉ khi có một hành động cam kết rõ. Home nhiều nhu cầu không tự động cần một CTA lớn cố định chỉ để đủ mẫu. Theo quy tắc dự án về số primary, không suy ra mọi màn phải có đúng một primary nếu quy tắc chỉ đặt trần.

## So phương án và kiểm chứng

Tách **IA** (nhóm, đường tìm, quan hệ nội dung) khỏi **UI** (diện tích, trình bày, độ mở chi tiết) và khỏi skin. So IA bằng cùng tác vụ/nội dung và một UI kiểm soát; sau đó so UI. Nếu người dùng yêu cầu 10×10, tạo đủ và ghi rõ giả thuyết, không gọi mọi tổ hợp là khác biệt UX chỉ vì khác ảnh.

Đọc [references/source-lessons.md](references/source-lessons.md) khi cần học từ lựa chọn VinClub đã thử.

Kiểm tra render và tương tác đúng phạm vi: back, search, trạng thái dữ liệu, giá/điều kiện, hoàn tất, tìm lại tài sản, loading/empty/error có liên quan. Prototype phải ghi rõ phần mô phỏng; không tuyên bố giao dịch hay lead đã thực hiện thật.

Harness chứng minh cấu trúc/flow kỹ thuật. Human UT mới cung cấp bằng chứng tìm đường/hiểu/hoàn thành; preference không tự chứng minh conversion. Dùng thử thứ tự luân phiên, cùng dữ liệu; không dựng số người hay kết quả.

## Đầu ra

Dẫn bằng phát hiện thay đổi quyết định, sau đó bảng: `khối/flow | bằng chứng hiện tại | chọn/giữ/bỏ | tác động với khách | đánh đổi | kiểm chứng`. Nếu thiếu phần “cách chọn layout”, report chưa đạt.

Triết lý chỉ viết sau các quyết định: **vấn đề → nguyên tắc → hành vi UI cụ thể → cảm nhận kỳ vọng → phép thử**. Không dùng “dopamine”, premium, thông minh hoặc thấu hiểu thay cho cơ chế cụ thể. Không thêm material/3D/motion nếu chúng chưa có vai trò.
