# VSP Design Tokens Reference

## Layout Grid (8px base unit — everything aligns to 4px or 8px)

| Token | Value | Usage |
|---|---|---|
| `px-[22px]` | 22px | Trục chữ cấp màn hình; lề khung section/card thông thường |
| `px-[12px]` | 12px | Card inner padding (inside cards/sections) |
| `pt-[24px]` | 24px | Section title top spacing |
| `pb-[12px]` | 12px | Section title bottom spacing |
| `gap-[8px]` | 8px | Default gap between elements |
| `gap-[12px]` | 12px | Gap between cards, list items |
| `gap-[16px]` | 16px | Gap between sections/groups |
| `pt-[12px] pb-[16px]` | 12/16 | FixedBottom CTA area |
| `pb-[8px]` | 8px | Home indicator bottom |
| `py-[12px]` | 12px | Tab item vertical padding |
| `py-[8px]` | 8px | ItemList row vertical padding |
| `p-[10px]` | 10px | Icon button touch target padding |

## Typography Scale (Inter)

| Style | Size | Weight | Line-height | Usage |
|---|---|---|---|---|
| Heading/L | 24px | 600 (semibold) | 32px | Large titles, result screens |
| Title/M | 20px | 600 | 24px | Section hero, product name |
| Title/S | 16px | 600 | 24px | Section titles, button text |
| Title/XS | 14px | 600 | 20px | Card titles, labels |
| Body/M | 16px | 400 | 24px | Body text, descriptions |
| Body/S | 14px | 400 | 20px | Sublabels, secondary text |
| Body/XS | 12px | 400 | 20px | Help text, disclaimers |
| Caption/M | 12px | 500 | 20px | Footnotes, legal |
| Caption/S | 10px | 500 | 16px | Date badges, tiny labels |

## Component Sizes

| Component | Height | Radius |
|---|---|---|
| StatusBar | 54px | — |
| NavBar | 56px | — |
| Button primary/secondary | 48px | rounded-full |
| Button small | 32px | rounded-full |
| TextField | 58px | rounded-14 |
| ItemList row | 44-72px | — |
| Checkbox/Radio | 24px | rounded-8 / rounded-full |
| Toggle | 32×52px | rounded-full |
| Card | auto | rounded-28 |
| Action icon button | 44×44px | rounded-full |
| Badge | 22px | rounded-full |
| Tab underline | 2.5px | — |
| Home indicator | 5×139px | rounded-full |

## Alignment Rules — theo cấp nội dung

Áp dụng cho mọi page. Xác định cấp thông tin trước khi căn; không quyết định chỉ dựa vào text có nằm trong card hay không.

### 1. Chữ cấp cao căn với chữ cấp cao

Lời chào, VPoint, tên ví, số dư và tiêu đề section dùng trục trái **22px** tính từ màn hình/phone frame.

**“Ví VinClub” và số dư vẫn là chữ cấp cao dù nằm trong card ví.** Phải thẳng với lời chào và VPoint. Vỏ ví có thể cách mép màn hình 10px, cộng padding trong 12px để giữ đúng trục chữ 22px.

### 2. Card thường căn theo khung riêng

Service, Quà tặng mỗi ngày, Trải nghiệm dành riêng và Ưu đãi dành cho bạn dùng chung mép ngoài **22px mỗi bên**. Card cùng cấp căn theo mép khung; card trong lưới giữ cùng mép ngoài và gap 12px.

Chữ bên trong dùng padding riêng **12px** và căn nhất quán trong card. Không ép chữ/icon bên trong về trục chữ màn hình. Không bỏ padding card để chạy theo chữ bên ngoài.

**Bỏ qua card con khi kiểm tra alignment cấp màn hình.** Chỉ kiểm tra card con trong hệ tọa độ của card cha. Không kéo toàn bộ card hoặc text bằng một offset chung.

### Home V14 — trục nền và trục chữ

Theo yêu cầu riêng của Home V14: nền card cách mép màn hình **10px**, chữ cách mép màn hình **22px**; padding trong card **12px** (`10 + 12 = 22`). Áp dụng cho thẻ thành viên, reminder và card nội dung dưới search. Ảnh full-width phủ tới mép card; chữ bên dưới vẫn theo trục 22px. Đây là quy định riêng của V14, không đổi lề mặc định cho các màn khác.

### Text với text, khung với khung

Căn chữ theo mép bắt đầu của nội dung nhìn thấy, không lấy mép button hoặc card thay cho mép chữ. Trong cùng một khối, tiêu đề, mô tả và chữ CTA cùng trục; nếu CTA có padding, đặt khung nút lùi bằng padding đó để chữ thẳng hàng, vẫn giữ vùng bấm. Không dùng khoảng trắng trong chuỗi để bù căn lề.

Phân biệt cấp nội dung: tên ví, số dư và VPoint theo trục màn hình 22px; tiêu đề và mô tả của card theo padding trong card. Card thành viên, reminder, search và card tin có vai trò khác nhau, không ép mọi text về một trục chung. Khung các card cùng cấp vẫn giữ cùng lề ngoài.

### 3. Chữ cùng hàng căn theo baseline

Nhãn và giá trị cùng hàng căn theo baseline chữ, không chỉ căn giữa bounding box. Số và nhãn VPoint luôn cùng dòng. Giá trị/metadata cuối hàng căn phải theo mép trong của nhóm.

Dải service dùng icon 44×44, nhãn cùng baseline; mỗi icon và nhãn có chung trục giữa trong ô của nó. Body/list text vẫn căn trái.

### 4. Optical alignment kiểm tra trên ảnh render

So mép glyph, baseline và phần hình thực sự nhìn thấy của icon. Chuẩn hóa khung icon trước; chỉ bù quang học tại glyph/icon tối đa 1px khi cần. Không dùng khoảng trắng trong text hoặc dịch cả layout để bù lệch.

Card nghiêng thì cả card và nội dung cùng nghiêng. Không bắt chữ trong card nghiêng thẳng tuyệt đối với chữ bên ngoài.

### 5. Thứ tự kiểm tra

1. Chữ cấp cao: lời chào → VPoint → tên ví → số dư → tiêu đề section.
2. Mép khung các card cùng cấp.
3. Padding, baseline và icon bên trong từng card; card con kiểm tra riêng.
4. Optical alignment trên ảnh thực tế.

Giữ named radius tokens và smooth corner 60% theo treatment `corner-shape: superellipse(1.6)`. Bo góc không thay đổi trục căn. FixedBottom giữ lề nút 22px.

## Border Radius Rules

### Góc lồng nhau theo khoảng đệm

Khi hai bề mặt bo góc lồng nhau, dùng `R trong = max(0, R ngoài − inset)`. Inset là khoảng cách thực giữa hai mép ở góc đang xét, gồm cả border nếu có. Không gán cùng một radius cho cha và con: khoảng hở ở góc sẽ không đều.

- Dùng named tokens `rounded-8`, `rounded-14`, `rounded-28` làm nền tảng. Không dùng `rounded-[Xpx]`, không override token gốc để sửa riêng một màn.
- Nếu cần radius ngoài thang token, khai báo biến theo vai trò và tính bằng `calc()` từ token cùng inset. Không thêm một số radius tùy ý.
- Giữ padding theo vai trò nội dung: card thường 12px, cột màn hình 22px. Chỉ điều chỉnh padding riêng khi bố cục yêu cầu; không đổi mọi card sang 14px để khớp công thức.
- Với inset ngang và dọc khác nhau, không thể bảo đảm đồng tâm bằng một radius tròn duy nhất. Giữ layout đã chọn, kiểm tra quang học trên render; không ép mọi lớp theo một công thức chung.

### Áp dụng theo loại bề mặt

| Trường hợp | Quy tắc |
|---|---|
| Card chứa ảnh có đệm đều | Card dùng `rounded-28`; ảnh lấy radius ngoài trừ inset thực tế. Không đổi padding chỉ để khớp token. |
| Ảnh phủ sát mép card | Card cha dùng `rounded-28` và `overflow: hidden`; ảnh không bo riêng, góc trên được cha clip. Mép ảnh tiếp giáp phần chữ giữ thẳng. |
| Sheet chứa card hoặc search | Xét góc trên của sheet theo lớp con gần góc và khoảng lùi thực tế; không lấy radius của một card sâu trong danh sách để suy ra góc sheet. |
| Tab đang chọn trong khay | Radius tab bằng radius khay trừ padding khay; dùng biến dẫn xuất nếu không khớp token. |
| Pill và nút tròn | Giữ shape mặc định của component; pill có radius hiệu dụng tối đa bằng nửa cạnh ngắn. Không ép pill sang smooth rectangle. |
| Card độc lập | Chọn named token theo loại component; không áp công thức lồng nhau khi không có bề mặt bao quanh. |

### Smooth corner và kiểm chứng

Giữ treatment dự án `corner-shape: superellipse(1.6)` cho card/sheet và ảnh lồng trong chúng; pill dùng `corner-shape: round`. Công thức đồng tâm chính xác với góc tròn; với smooth corner, dùng làm điểm xuất phát và kiểm tra khoảng hở bằng ảnh render. Không coi cùng một giá trị `corner-shape` là bằng chứng các đường cong song song hoàn toàn.

Kiểm tra computed radius, padding và border thực tế sau khi CSS/component wrapper đã áp dụng. Chụp render ở trạng thái thu gọn và mở rộng; rà góc ảnh, clip nội dung, khay/tab và vùng chạm. Bo góc không làm thay đổi trục căn chữ 22px hoặc khoảng cách giữa các section.

## VSP_Wireframe Template (dev tool pages)

- **Reference:** `app/sinhloi/page.tsx` — copy full template when creating new states browser
- **Style: Monochrome only** — black, white, grays. NO epic/brand colors in the shell UI
- **Color tokens:** use `var(--foreground)`, `var(--background)`, `var(--secondary)`, `var(--border)`, `var(--foreground-secondary)` — NEVER hardcode hex
- **Text hierarchy:** primary text = `var(--foreground)`, secondary/inactive = `var(--foreground-secondary)`, disabled only = `var(--muted-foreground)`
- **Active state pill:** `background: var(--foreground)` + `color: var(--background)` (black on white / white on black)
- **Inactive state pill:** `background: var(--secondary)` + `color: var(--foreground-secondary)`
- **Sidebar active:** `background: var(--secondary)` + `borderLeft: 3px solid var(--foreground)` — no colored tints
- **Phone frame:** always dark bezel (`#1a1a1a` + `#333` border) — physical device, not themed
- **Flow charts (Mermaid):** light mode = `theme: "neutral"` with grayscale classDefs, dark mode = `theme: "dark"` with original colors
- **Required features:** 2 tabs (UI + Flow), shared sidebar, iPhone frame preview, Prev/Next nav, epic expand/collapse
- **Dark/light detection:** `MutationObserver` on `<html>` class for `"dark"`
