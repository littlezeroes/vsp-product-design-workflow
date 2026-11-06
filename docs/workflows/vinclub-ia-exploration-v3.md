# VinClub — workflow khám phá IA / UI V3

Mục tiêu: tạo 10 cách tổ chức IA khác nhau, 10 cách trình bày UI cho mỗi IA (100 tổ hợp), rồi thu hẹp bằng bằng chứng. Giữ nguyên report và IA Map version trước. Không coi 100 tổ hợp là 100 phương án đã được khách hàng xác nhận.

## Đầu vào và nguồn

- Prototype baseline: workspace port 3202, Home VinClub nhúng từ port 3250.
- `Dinh_huong_chien_luoc_VinClub_B3.xlsx`: B1/B2 cho mô hình; B3 hiện hành cho phạm vi / hạn. Không lấy hạn B3_ARCHIVED làm cam kết.
- `Báo cáo Sa bàn ảo Đảo Ngọc.docx`: học cách giải thích hành trình → tác vụ → đối chiếu → điều chỉnh và lý do → kế hoạch → nội dung cần quyết định → phụ lục.
- Đã đọc cả đoạn văn và bảng 03 phiên bản trong tài liệu mẫu. Không lặp các so sánh AAA hoặc các tỷ lệ chất lượng 90% / 80% chưa có căn cứ đo lường cho VinClub.
- VSP: `app/globals.css`, `components/ui/`, `.claude/design-tokens-reference.md`. Quy tắc người dùng mới nhất ưu tiên hơn hướng dẫn cũ trong agent.

## Vai trò nhiều agent

| Vai trò | Trách nhiệm | File sở hữu |
|---|---|---|
| Điều phối / build | Hợp nhất dữ liệu, dựng gallery + UI + slide, chạy và sửa harness | Code gallery, harness, bản trình chiếu |
| IA strategist | 10 IA, đối tượng, nguyên tắc nhóm, nguồn tiền, trade-off, phân kỳ | `ia-strategies.json` |
| Competitor researcher | Nguồn chính thức, mô hình đối thủ, điều nên học / tránh | `competitors.json` |
| UT / narrative | Phương pháp kiểm chứng, cấu trúc kể chuyện và quy trình | `ut-plan.json`, `narrative.json`, workflow này |

Mỗi agent chỉ chỉnh file đã phân công. Điều phối giữ một đầu mối quyết định và tập hợp bằng chứng.

## Các gate

| Gate | Điều kiện đạt | Bằng chứng | Trạng thái lúc lập workflow |
|---|---|---|---|
| G0 — nguồn | Đọc tài liệu mẫu gồm bảng, xác định baseline và hạn B3 | Source notes trong narrative và IA | Đã đọc tài liệu mẫu; điều phối xác nhận nguồn còn lại |
| G1 — IA | Đủ 10 IA, khác cách nhóm / tìm đường; không chỉ đổi tên tab | `ia-strategies.json` | PASS — 10 IA trong ia-strategies.json |
| G2 — Lego | Khối dùng chung có vai trò, dữ liệu, hành vi rõ; map VSP component | Component inventory / code | PASS — page.tsx dùng Header, Button, ItemListItem, SearchBar, TextField, Checkbox |
| G3 — 100 UI | 10 IA × 10 UI, ID duy nhất, thay hierarchy / grouping / density / disclosure có chủ đích | Manifest + gallery | PASS — variants.json, 100 UI và 10 contact sheet |
| G4 — harness | Mọi tổ hợp pass checks đã công bố, lỗi được sửa và chạy lại | JSON log + screenshots | PASS — harness-results.json: 100/100, 100 ảnh khác nhau, 6 flow |
| G5 — chuyên gia | So sánh rõ ràng, chuyển đổi, giữ khách, khả thi; có lý do | Analyst matrix | PASS — điểm chuyên gia và shortlist, chưa human UT |
| G6 — trình bày | Deck có demo, bằng chứng, nguồn, giới hạn, quyết định tiếp | Slide HTML / file export | PASS — slide HTML, PPTX; PDF xuất từ slide |
| G7 — human UT | Pilot + phiên người dùng thực, consent, log nhiệm vụ | Dữ liệu phiên ẩn danh | CHƯA CHẠY — protocol không phải kết quả |

Hoàn thành delivery local khi G0–G6 có đầu ra review được. G7 là giai đoạn kiểm chứng tiếp theo cần người tham gia; không bịa kết quả để đánh dấu hoàn tất.

## Tạo 10 IA có ý nghĩa

Với mỗi IA, bắt buộc có: nhu cầu dẫn dắt, nguyên tắc tổ chức, tabs / hierarchy, thứ tự Home blocks, hành động chính, chỗ ra tiền, điểm mạnh / rủi ro, mốc 02/2027 và cuối 2027, phụ thuộc.

Mười IA phải khác mô hình tìm đường: chẳng hạn hội viên, nhiệm vụ, dịch vụ, nhu cầu cuộc sống, giao dịch, bối cảnh hoặc trợ lý. Hai phương án chỉ đổi nhãn tab hoặc màu không đủ điều kiện khác biệt.

Ba mốc luôn được đọc đúng: hiện tại = prototype quan sát; tháng 02/2027 = kế hoạch có hạn đến 28/02/2027; cuối 2027 = kế thừa cộng nhánh mở rộng có hoặc chưa có hạn. Không gán ngày tự động cho Chat / AI / cư dân số.

## Lego component → 100 composition

Mỗi khối có contract: `id`, mục đích người dùng, dữ liệu, điểm vào, trạng thái và đích đến. Khối cấu trúc chỉ compose component VSP hiện hữu; không tạo lại Button, Header, TextField, ItemList, BottomSheet hoặc Dialog.

Mỗi UI variant giữ nguyên dữ liệu và tác vụ để so sánh, nhưng thay một cấu hình được ghi rõ: hero ưu tiên quyền lợi / dịch vụ; lưới / danh sách; tầng thông tin; điều hướng trong nội dung; mật độ; cách mở chi tiết. Không tính thay màu đơn thuần là biến thể UI.

Quy tắc: Header → Section(s) → FixedBottom; StatusBar 54px + NavBar 56px; content axis 22px; section title pt24 / pb12; named radius 8 / 14 / 28; tối đa một primary CTA mỗi screen; ChevronLeft; home indicator 139×5; semantic tokens và dark mode nếu có. Không raw color, không text-muted-foreground, không border phân section, không custom button div.

## Harness chạy tới khi có kết quả cụ thể

1. Sinh manifest 100 tổ hợp và xác nhận ID / cấu hình không trùng.
2. Mở từng tổ hợp bằng Playwright; desktop và mobile. Lưu URL / viewport / error / check result.
3. Kiểm tra render, page overflow, lỗi runtime, title / dữ liệu chính, Header / FixedBottom / home indicator và primary count.
4. Bấm điểm vào, tab, CTA, back / close. Phân biệt hành vi demo với giao dịch thực. Không gọi API thanh toán thật.
5. Lưu ảnh đại diện và contact sheet; kiểm tra glyph, baseline, hierarchy bằng ảnh. Chỉ hiệu chỉnh icon / glyph tối đa 1px nếu cần; không dịch cả khung để che lệch.
6. Khi fail, sửa nguyên nhân ở khối dùng chung; chạy lại tổ hợp lỗi và các tổ hợp phụ thuộc. Nếu đổi renderer / tokens dùng chung, chạy lại toàn bộ 100.
7. Chỉ ghi PASS khi log có bằng chứng. Báo riêng unsupported checks, console từ môi trường và giới hạn demo; không che lỗi bằng timeout hoặc bỏ check.

Harness là QA kỹ thuật, không chứng minh usability hoặc doanh thu. Không chạy lặp sau khi mọi check đã pass trừ khi có thay đổi mới hoặc vấn đề chưa giải quyết.

## Chấm chuyên gia và chọn shortlist

Thang 1–5 cho rõ ràng, khả năng dẫn tới chuyển đổi, giữ khách, khả thi. Mỗi điểm có lý do và rủi ro. Trọng số là đề xuất, không phải sự thật về người dùng. Dẫn chứng nguồn tiền cần phân biệt doanh thu P&L, phần VinClub hưởng theo hợp đồng, tổng tiền giao dịch và chi phí điểm / thưởng.

Chọn 3 IA khác biệt để kiểm chứng; giữ cùng một UI kiểm soát trong vòng so IA. Sau khi thu hẹp IA mới thử các UI khác. Không bắt một người trải nghiệm cả 100 tổ hợp.

## Human UT sau delivery

Dùng `ut-plan.json`: 6 nhóm tác vụ, counterbalance ABC / BCA / CAB / ACB / CBA / BAC, dữ liệu tương đương và không hỗ trợ chỉ đường. Ghi task success, first click, time, backtracks, SEQ và hiểu đúng khái niệm. Mẫu nhỏ dùng để phát hiện vấn đề; không tuyên bố conversion uplift hoặc ý nghĩa thống kê nếu chưa có thiết kế nghiên cứu phù hợp.

## Cấu trúc slide

Theo `narrative.json`: 15 slide, mỗi slide một ý. Dẫn bằng hành trình khách rồi tới tác vụ, bằng chứng đối chiếu, nguyên tắc Lego, khác biệt phương án, thay đổi và lý do, kiểm tra đã chạy, shortlist, kế hoạch và nội dung cần quyết định. Phụ lục có link demo / report / UT / workflow và nguồn đối thủ.

Trước khi trình, điều phối cập nhật slide kiểm thử từ log thật. Giữ dòng “Chưa chạy human UT” cho tới khi có dữ liệu phiên thực.

## Một lệnh chạy toàn workflow local

```sh
node scripts/vinclub-lab-v3/run.cjs
```

## Lệnh chạy từng bước

```sh
node scripts/vinclub-lab-v3/harness.cjs
python3 scripts/vinclub-lab-v3/build-deliverables.py
node scripts/vinclub-lab-v3/verify-deliverables.cjs
```

Ứng dụng Next cần chạy ở port 3250. Human UT chưa chạy; không có dữ liệu người dùng được giả lập thành kết quả.
