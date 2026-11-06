# Workflow UX × Business × Product × Visual × CEO

Dùng khi user giao phân tích/thiết kế sản phẩm cần nhiều góc nhìn. Với việc nhỏ chỉ gọi vai cần thiết. Review không tự cho phép sửa sản phẩm; build được giao thì tiến hành đến đầu ra kiểm tra được, không dừng ở lời đề xuất.

## Cách gọi

- `$vsp-ux`: đọc source, học từ option cũ, chọn IA/layout/tương tác.
- `$vsp-business`: xác định nguồn tiền, chủ thể hưởng, chi phí và phụ thuộc vận hành.
- `$vsp-product`: điều phối bài toán, phương án, phân kỳ, build và kiểm chứng khi được giao.
- `$vsp-visual`: hoàn thiện visual kế thừa source; kiểm tra chữ, màu, vật liệu, hình ảnh, chuyển động và trạng thái bằng render.
- `$vsp-ceo`: phản biện và viết bản trình quyết định.

Các định nghĩa agent nằm ở `.claude/agents/vsp-{ux,business,product,visual,ceo}.md`. Skill bản gốc nằm ở `.claude/skills/vsp-*/`; đường đăng ký Codex trỏ tới cùng nội dung, không duy trì hai bản khác nhau. Khởi tạo phiên mới nếu client chưa cập nhật danh sách skill; có thể đọc file trực tiếp trong phiên đang chạy.

## 1. Product xác lập context chung

Tìm đúng source bằng host/port/process/route/iframe; đọc tài liệu và lựa chọn hiện có. Ghi bản snapshot ngắn vào folder task đã có; chỉ tạo `.claude/features/<ten-task>/` khi cần lưu artifact mới.

Context gồm: câu hỏi cần quyết định; ai dùng và hoàn cảnh; mục tiêu khách và kinh doanh; baseline; cái đã chốt/đã thử; ràng buộc và version giữ lại; bằng chứng; scope review/build; đầu ra cần giao.

Không bắt user xác nhận lại context nếu đã đủ từ phiên và source. Phần chưa biết không cản công việc độc lập thì ghi rõ rồi tiếp tục.

## 2. UX và Business đọc độc lập cùng context

| Vai | File sở hữu | Câu hỏi bắt buộc |
|---|---|---|
| UX | `ux.md`, screenshot/trace của review | Khách mở vì sao; nhìn gì trước; chọn layout nào cho khối nào; chạm xong đi đâu; làm xong quay lại vì sao? |
| Business | `business.md` | Sự kiện tạo giá trị nào, tiền thuộc ai, chi phí gì, ai cung ứng/xác nhận/đối soát? |
| Product | `product.md`, decision log và renderer khi build | Vấn đề nào đáng giải, phương án nào khác thật, điều kiện sẵn sàng và phạm vi mỗi giai đoạn? |
| Visual Design | `visual.md/json`, asset và screenshot được giao | Cùng khung UX đã chọn, thể hiện thế nào để phân cấp, dễ đọc, có chất liệu và cảm xúc; CSS thực có đúng ý định không? |
| CEO Review | `decision.md` và narrative trình bày | Có đủ căn cứ chọn không; đánh đổi gì; cần nhìn demo/bằng chứng nào tiếp theo? |

Chỉ chạy song song khi delegation được user hoặc hướng dẫn đang áp dụng cho phép. Tách file sở hữu; hai người không chỉnh chung renderer. Không có agent tool thì làm tuần tự, không giả vờ đã có review độc lập.

## 3. Product hợp nhất thành các phương án có lý do

Mỗi phương án có:

1. Vấn đề và trạng thái khách nó phục vụ.
2. Lý do giữ/bỏ từ source, tách giả thuyết mới.
3. IA và thứ tự nội dung; bảng layout theo từng vai trò nội dung.
4. Chuỗi mở → hành động → giá trị → quay lại.
5. Giá trị trực tiếp/gián tiếp và điều kiện kinh tế.
6. Khả năng triển khai; phụ thuộc và thời hạn có nguồn.
7. Đánh đổi, bằng chứng và điều có thể làm đổi khuyến nghị.

Không ép đủ 3 hay 10 phương án khi user không yêu cầu. Nếu user yêu cầu 10 IA ×10 UI, làm đủ nhưng chọn tập nhỏ hơn cho bản trình; không gọi ảnh khác nhau là UX khác nhau. So IA với UI/nội dung kiểm soát; dùng tác vụ phù hợp từng mục tiêu, không chấm O2O chỉ bằng mua vé rồi kết luận cho toàn sản phẩm.

## 4. Build và harness khi nằm trong scope

Giữ version cũ khi được yêu cầu. Ghép components VSP và token hiện hành, không tạo lại button/header. Đọc Screen Structure, cấp căn lề và named radius từ rule dự án; không dùng quy tắc cũ trong agent để ghi đè.

Đặt check theo artifact: render ở viewport đích; layout/overflow và nhịp nhìn; target/keyboard; entry/CTA đúng nghĩa; back và bảo toàn ngữ cảnh; giá/điều kiện; hoàn tất và tìm lại; trạng thái lỗi có liên quan. Với mock, đánh dấu mô phỏng và không hứa API thật. Một Home nhiều nhu cầu không tự nhiên có một CTA lớn cố định chỉ vì màn xác nhận có CTA.

Chạy → sửa lỗi ảnh hưởng → chạy lại tập chịu ảnh hưởng. Nếu sửa renderer chung thì chạy lại tập variant liên quan. Dừng khi kiểm tra đạt và không còn lỗi vật chất trong scope; không chạy lặp để tạo cảm giác tiến độ.

## 5. Visual hoàn thiện UI và ngôn ngữ slide

Sau khi UX/Product chốt vai trò khối, Visual đọc baseline/source để kế thừa hình thức có chủ đích. Không thay art direction bằng UI generic hoặc glass mặc định. Định nghĩa palette semantic, typography, vật liệu từng vai trò, icon/ảnh, corner treatment và motion có reduced-motion. Kiểm tra computed CSS, clipping, tương phản, touch target và trạng thái; sửa rồi chụp lại các màn liên quan. Đầu ra final UI có flow, tài sản sau thao tác và nhãn demo rõ; slide dùng cùng ngôn ngữ và ảnh chụp final. Visual không đổi roadmap hoặc tự gán nguồn thu. Một đầu mối sửa renderer tránh ghi đè.

## 6. CEO phản biện rồi trình

Dẫn bằng khuyến nghị. Kể theo: hành trình khách → thao tác nhìn thấy/bấm được → so phương án và lý do → tiền và phụ thuộc → cái đã kiểm chứng/chưa biết → bước cần chốt.

Mỗi nguyên tắc thiết kế phải nối tới quyết định UI. Chỉ viết triết lý sau khi các quyết định có nội dung; không dùng slogan, glass, 3D, AI hay “dopamine” lấp khoảng trống hành trình. Kho phương án và log để phụ lục; không bắt lãnh đạo tự xem 100 màn để tìm khuyến nghị.

CEO Review có thể gửi một gap cụ thể về UX/Business/Product. Không cho vòng phản biện vô hạn hoặc tự tạo approval/deploy. Khi thiếu dữ liệu thật, giao protocol và kết luận có điều kiện, không bịa bằng chứng.

## Hợp đồng bằng chứng

Dùng ID khi report có nhiều claim. Một dòng đủ gồm:

`claim_id | quan sát/tài liệu/giả thuyết/kiểm chứng | nguồn + version/thời điểm | claim | giới hạn | quyết định liên quan`

- Source note là ghi chú tác giả, không tự thành quan sát người dùng.
- Kế hoạch có hạn không chứng minh đã bàn giao; archive không thay thế roadmap hiện hành.
- Default/confirmed/URL/render có thể khác; báo khác biệt.
- Harness pass = đúng check đã chạy; không chứng minh usability/retention/conversion.
- UT protocol sẵn sàng khác UT đã chạy. Không có người tham gia thì trạng thái “chưa chạy”.
- Kết quả tiền cần tách doanh thu, GMV, dòng tiền, chi phí và phần hưởng từng đơn vị.
- Đối thủ/tính năng hiện hành cần nguồn chính thức cập nhật; diễn giải pattern phải gắn nhãn diễn giải.

## Điều kiện giao xong

Có đề xuất trả lời đúng câu hỏi; trace được quyết định tới bằng chứng; phân tích layout và kinh tế đủ cho scope; artifact mở/đọc được; kiểm tra đúng loại đầu ra có bằng chứng (review source dùng trích dẫn và decision trace, build dùng render/flow log; không ép review-only phải chạy harness); các thiếu sót/phụ thuộc được công bố; version cũ không bị mất. Human UT chưa chạy không được đổi thành PASS; đó là bước kiểm chứng tiếp khi có người thật, không phải lý do giữ bản trình local mãi chưa giao.
