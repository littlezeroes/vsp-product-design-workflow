---
name: design-loop
description: 'Vòng lặp cải tiến thiết kế có đo lường: Analyze → Identify → Improve → Implement → Validate → Repeat trên một bản clone (vN) của màn hình, giữ nguyên IA. Chuẩn đối chiếu: Nielsen 10, WCAG 2.2 AA, Apple HIG, lưới 4px, type scale, token VSP. Trigger: "design loop", "loop thiết kế", "cải tiến lặp", "review lặp", "analyze improve validate", "world-class ui"'
---

# Design Loop — cải tiến có đo, không đoán

Bạn là design director có công cụ đo. Mỗi vòng: chụp → đo → xếp hạng lỗi → sửa **một cụm nhỏ** → đo lại → ghi log. Không sửa trước khi đo xong. Không tuyên bố "đẹp hơn" nếu không có ảnh và số.

## 0. Trước khi bắt đầu (bắt buộc)

1. **Xác định đúng repo và port.** URL người dùng đưa có thể thuộc project khác (ví dụ `:3300` = `~/Documents/vinclub-prototype`, `:3000` = `vsp-ui`). Chạy `lsof -nP -iTCP:<port> -sTCP:LISTEN` rồi đọc `cwd` của process. Sai repo = mất cả buổi.
2. **Đọc IA và luật.** `IA.md`, `HOME-USER-NEEDS.md`, `VISUAL-INVENTORY.md` (nếu có), `CLAUDE.md`, memory. Luật IA: **không đổi tab, không đổi điểm đến, không thêm/bớt khối** trừ khi người dùng yêu cầu.
3. **Clone, không sửa bản gốc.** Tạo route `vN` cạnh bản gốc (vd `app/(vinclub)/vinclub-home/v2/`): `rsync -a --exclude '<sub-route>' ./ ./v2/`, sửa import thoát khỏi thư mục (`../../x` → `../../../x`), xác nhận `curl` 200 và **pixel diff = 0%** với bản gốc trước khi đổi bất cứ gì.
4. **Scope mọi override.** Thêm `data-v2` lên `<main>` và một file `v2.css` với selector `#<id>[data-v2] …`. Mọi thay đổi style nằm trong file này; đổi copy/markup thì sửa trong bản clone. Diff sạch = review được.

## 1. Đo (Analyze)

Script mẫu: `scripts/vinclub-v2/loop.cjs` trong `vinclub-prototype` (Playwright headless + axe-core + pngjs). Chạy `node scripts/vinclub-v2/loop.cjs --round N`. Mỗi round ghi `output/<feature>/round-N/{original,v2}-{360,390,430}.png`, `diff-*.png`, `report.json`, `summary.md`.

Chỉ số bắt buộc mỗi render:

| Nhóm | Đo gì | Ngưỡng |
|---|---|---|
| Lỗi | console/page errors, overflow-x ngoài scroller | 0 |
| Target | nút < 24×24 (WCAG 2.5.8) · nút < 44×44 (HIG) | 0 · ghi nhận |
| Contrast | chữ trên nền phẳng, tính cả opacity tổ tiên | ≥ 4.5 (≥ 3 với ≥ 24px hoặc ≥ 18.66px bold) |
| Chữ nhỏ | font < 11px | chỉ tab label 10px được phép |
| Type scale | số cặp size/weight; weight ngoài 400/500/600/700 | ≤ 10 cặp · 0 weight lạ |
| Radius | ngoài token 8/14/28/pill | 0 |
| Lưới 4px | x, y (tính từ đáy status bar), h không chia hết 4 | giảm dần mỗi round |
| Ảnh | hỏng, < 1.5× DPR, logo bị ép méo | 0 |
| axe | WCAG 2 A/AA, 2.1 AA, 2.2 AA | 0 hoặc giải thích từng vi phạm |
| Pixel diff | vN vs gốc, vN vs round trước | để biết round đổi gì |

Phải mở ảnh và **nhìn** (Read ảnh) ở cả 360 và 430, không chỉ 390: lỗi cắt chữ thường chỉ lộ ở 360.

## 2. Xếp hạng (Identify)

- **P0** gãy: chữ bị cắt, nút không bấm được, lỗi runtime.
- **P1** chất lượng: target < 24, contrast fail, copy sai luật nghiệp vụ (vd hứa tích VPoint cho hạng chưa được), lặp từ ("Hạng thành viên · Thành viên"), logo ép méo, tỷ lệ phụ thuộc width làm layout vỡ ở máy nhỏ.
- **P2** polish: weight lẻ (650/750), radius lệch token, nửa pixel, gap không ×4, widow trong tiêu đề.
- **P3** sở thích.

Mỗi round chỉ sửa P0 → P1 trước. Verdict phải gọi tên **một** thay đổi quan trọng nhất.

## 3. Sửa (Improve → Implement)

- Một round = một cụm liên quan (vd "header + target"), không "sửa 15 thứ".
- Ưu tiên quy tắc thay cho số cứng: chiều cao thẻ từ `round(calc((100cqw - 44px) * tỉ lệ), 4px)`, sheet đè theo "dải nhìn thấy cố định" (`margin-top: calc(var(--band) - var(--card-h))`) thay vì `-108px`.
- Mọi container query cần `container-type: inline-size` trên scroller, không trên phần tử có con absolute.
- Nhớ các memory: ₫ sau số, smooth corner 0.6, chữ cấp màn hình trục 22px, premium = bớt chứ không thêm. Nếu thêm nội dung (vd dòng trạng thái hạng), phải nêu lý do theo Nielsen và ghi là quyết định có thể revert.
- Copy: đổi trong bản clone (`sed`), không đổi shared component.

## 4. Kiểm (Validate)

1. Chạy lại script, đọc `summary.md`, mở ảnh 360/390/430.
2. Smoke tương tác bằng Playwright: tap thẻ hạng, mở search, chuyển tab, quay về; `errors` phải rỗng.
3. `npx tsc --noEmit` lọc theo thư mục clone: 0 lỗi mới.
4. Nếu chỉ số xấu đi hoặc ảnh xấu đi → revert cụm đó (`git checkout -- <file>` hoặc xóa block trong `v2.css`), ghi lý do.

## 5. Dừng khi

- Không còn P0/P1 ở cả ba width, axe = 0 hoặc đã giải thích, và round mới không đổi pixel đáng kể (< 1%) → đã hội tụ.
- Hoặc round tiếp theo chỉ còn P3 → dừng, chuyển cho người dùng quyết.

## 6. Báo cáo (bắt buộc)

Ghi `docs/design-reviews/<feature>-vN.md`: URL gốc, URL vN, chuẩn áp dụng, bảng round (đổi gì → chỉ số trước/sau → bằng chứng ảnh), vi phạm chấp nhận và lý do, việc chưa làm, cách chạy lại loop. Trả lời người dùng bằng tiếng Việt, dẫn URL và đường dẫn ảnh.
