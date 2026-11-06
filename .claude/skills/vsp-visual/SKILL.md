---
name: vsp-visual
description: Thiết kế và tinh chỉnh visual VSP/VinClub từ source, token và ảnh render; thống nhất final UI và slide. Dùng cho art direction, typography, material, illustration và visual QA; không quyết định mô hình phí hay roadmap.
---

# VSP Visual — làm rõ giá trị bằng hình thức

Chịu trách nhiệm chất lượng thị giác sau quyết định UX: nhìn thấy gì trước, nhận diện thuộc hệ nào, đọc có rõ và tương tác có nhất quán. Phân biệt **IA** (nhóm/đường đi), **visual fidelity** (giữ đặc trưng nguồn) và **visual refinement** (cải thiện trình bày). Đổi màu hoặc ảnh không tự tạo một IA mới.

## Đọc và chọn hướng

- Đọc AGENTS.md, `.claude/design-tokens-reference.md`, `app/globals.css`, component đang dùng và CSS thắng cuối cùng. Với localhost, xác định đúng repo/port/route/iframe và tham số; ảnh archive không chứng minh user đã bác bỏ.
- Lập bảng ngắn `nội dung → vai trò → mức chú ý → treatment → bằng chứng → đánh đổi`. Phân biệt tài sản, dịch vụ, voucher/quà và trải nghiệm; không áp cùng một skin lên mọi khối.
- Kế thừa art direction có bằng chứng. VinClub nguồn từng dùng nền gold ấm, ví carbon, lớp paper sáng, ảnh trải nghiệm và minh họa vật thể. Đây là quan sát theo version, không phải bộ token bất biến. Không tự thêm glass, neon, 3D hoặc blur khắp màn để gọi là premium.
- Chốt hệ thống type, màu semantic, shape, material, icon, illustration và ảnh trước khi polish; mỗi hiệu ứng phải hỗ trợ phân cấp hoặc nhận diện. Giữ ý nghĩa thương hiệu và điều kiện ưu đãi rõ hơn trang trí.

## Triển khai có kiểm soát

Compose thư viện `components/ui/`; dùng Button thật cho hành động. Kiểm tra DOM và computed CSS: component nền có thể áp `rounded-full`, height, overflow hoặc wrapper làm mất shape/text của card. Đừng chỉ đọc class được truyền vào.

Dùng semantic tokens, named radius `rounded-8/14/28`, Header → Section(s) → FixedBottom, section title `pt-[24px] pb-[12px]` và home indicator theo quy tắc dự án. Chữ cấp màn hình giữ trục 22px; card thường có lề khung 22px và padding riêng 12px. Kiểm tra smooth corner 60% bằng treatment hiện có của dự án khi áp dụng; không giả nhận CSS border-radius đã tương đương squircle.

Kiểm tra baseline số/đơn vị, glyph và khung icon; bù quang học tại glyph/icon tối đa 1px, không dịch cả layout. Giữ cỡ ảnh, góc cắt, điểm nhấn và mật độ icon nhất quán; ảnh không che giá, điều kiện hay CTA. Rà contrast chữ trên gradient/ảnh, focus/pressed/disabled, vùng chạm tối thiểu 44px, nhãn dài và số lớn. Dark mode theo semantic tokens.

Thiết kế loading/empty/error/success liên quan tới flow đã giao; thành công phải nêu đúng trạng thái thực, không biến yêu cầu thành booking xác nhận. Motion chỉ giải thích thay đổi trạng thái; tôn trọng reduced motion và giữ nội dung sử dụng được khi tắt chuyển động.

## Vòng kiểm chứng và bàn giao

1. Chụp render thật đúng viewport, state và dữ liệu của nguồn; so cùng điều kiện. Ghi nguồn screenshot/source và nhãn quan sát/giả thuyết/đã kiểm chứng.
2. Critique theo thứ tự: nội dung bị cắt/che → phân cấp/đọc → shape/alignment → material/ảnh → chi tiết. Sửa trong phạm vi được giao rồi chụp lại; không kết luận đạt chỉ từ source hoặc build xanh.
3. Chạy các flow liên quan để thấy trạng thái cuối và chỗ tìm lại. Nếu chưa kiểm tra hoặc chỉ demo, ghi rõ. Dừng khi không còn lỗi thị giác chặn tác vụ và các chênh lệch có chủ ý đã được giải thích; không polish vô hạn.
4. Bàn giao final UI và slide cùng palette, typography, shape, icon/ảnh và ngôn ngữ trạng thái; slide dùng ảnh final đã chụp, không screenshot cũ lỗi. Nêu tradeoff và bằng chứng bên cạnh quyết định. Không đưa ghi chú kỹ thuật nội bộ vào UI khách hàng.

Đầu ra: art direction có nguồn; quyết định theo khối; ảnh trước/sau hoặc đường dẫn evidence; lỗi đã sửa và giới hạn còn lại; visual specification dùng chung cho agent làm slide và agent làm final UI. Nếu chỉ review thì không sửa sản phẩm. Không tự đổi billing, ngân sách thưởng, roadmap hoặc ghi nhận hiệu quả kinh doanh chưa được đo.
