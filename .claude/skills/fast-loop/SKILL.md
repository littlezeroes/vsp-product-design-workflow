---
name: fast-loop
description: 'Fast design-to-code iteration loop. Figma → Code → Screenshot → Compare → Fix → Repeat. Trigger: "fast loop", "quick build", "iterate", "fix UI", "match figma"'
---

# Fast Loop — Visual Parity Iteration

Lightweight loop cho daily iteration. Không cần 11-step pipeline — chỉ cần: nhìn design → build code → so sánh → sửa → done.

---

## Khi nào dùng

| Dùng Fast Loop | Dùng Full Pipeline |
|---|---|
| Sửa 1 screen có sẵn | Feature mới từ BRD |
| Thêm state cho screen | Cần research UX flow |
| Match code với Figma mới update | Nhiều screens liên kết |
| PO feedback "đổi cái này" | Cần debate Nate vs Đức |
| Tweak spacing/color/layout | Chưa có flow diagram |

---

## Input

Chấp nhận 1 trong 3:
1. **Figma URL** — `https://figma.com/design/.../node-id=X-Y`
2. **Screenshot** — ảnh chụp design mong muốn
3. **Text** — "đổi button thành secondary" / "thêm loading state"

---

## Loop (4 bước, lặp đến khi khớp)

### Bước 1: Đọc design (1 lần)

**Nếu Figma URL:**
```
1. get_design_context(nodeId, fileKey) → code hints + component mapping
2. get_screenshot(nodeId, fileKey) → ảnh design gốc (LƯU LẠI để so sánh)
```

**Nếu screenshot:** Đọc ảnh, phân tích layout/components/spacing.

**Nếu text:** Đọc file code hiện tại, hiểu context, apply thay đổi.

**Output bước 1:**
- [ ] Biết chính xác screen cần build/sửa ở file nào
- [ ] Có ảnh design gốc (Figma screenshot hoặc user screenshot)
- [ ] List components + spacing + colors cần đạt

---

### Bước 2: Build / Sửa code

**Rules cứng (từ CLAUDE.md — không đọc lại, phải thuộc):**

```
LAYOUT:
├── Root:        max-w-[390px] min-h-screen bg-background text-foreground flex flex-col
├── Header:      <Header> component, KHÔNG div tự build
├── Content:     flex-1 overflow-y-auto
├── Sections:    pt-[24px] pb-[12px] giữa sections
├── Padding:     px-[22px] MỌI content column
├── Cards:       rounded-28, px-[12px] inner padding
├── Home bar:    w-[139px] h-[5px] rounded-full bg-foreground
└── CTA bottom:  px-[22px] pt-[12px] pb-[16px]

TYPOGRAPHY (Inter):
├── 24px/600  → Heading lớn (result screens)
├── 20px/600  → Title hero, product name
├── 16px/600  → Section title, button text
├── 14px/600  → Card title, label bold
├── 16px/400  → Body text
├── 14px/400  → Secondary text
├── 12px/400  → Help text, disclaimer
├── 12px/500  → Caption
└── 10px/500  → Date badge, tiny label

SPACING:
├── 22px  → Content padding (px-[22px])
├── 24px  → Section title top (pt-[24px])
├── 12px  → Section title bottom (pb-[12px])
├── 8px   → Default element gap
├── 12px  → Card/list item gap
├── 16px  → Section/group gap

COLORS (chỉ dùng token class):
├── text-foreground / text-foreground-secondary
├── bg-background / bg-secondary / bg-foreground
├── text-success / text-danger
├── border-border
└── KHÔNG BAO GIỜ hardcode hex
```

**Information Architecture checklist:**
- [ ] Visual hierarchy rõ ràng: heading > title > body > caption
- [ ] Metadata/giá trị → phải text-right (không center, không trái)
- [ ] Section title → luôn left-align, px-[22px], cùng line với content
- [ ] Body text → KHÔNG BAO GIỜ center (trừ result/feedback screen)
- [ ] Grouped content → spacing phân tách, KHÔNG dùng border
- [ ] Reading flow: top-to-bottom, left-to-right, Z-pattern cho hero

**Component mapping (check trước khi tự build):**
```
Cần nút bấm?     → <Button> / <ButtonGroup>
Cần input?        → <TextField> / <TextArea> / <SpecialTextField>
Cần list?         → <ItemList> / <ItemListItem>
Cần checkbox?     → <Checkbox> / <Radio>
Cần toggle?       → <Toggle>
Cần modal?        → <Dialog>
Cần sheet?        → <BottomSheet>
Cần tabs?         → <Tab>
Cần badge?        → <Badge> / <Label>
Cần banner?       → <InformMessage>
Cần toast?        → <ToastBar>
Cần empty/error?  → <FeedbackState>
Cần skeleton?     → <Skeleton>
```

**Exit criteria:** Code compiles, no TypeScript errors.

---

### Bước 3: Screenshot & Compare

**Bắt buộc — KHÔNG được skip.**

```
1. Mở localhost bằng Playwright:
   → browser_navigate("http://localhost:3000/[route]")
   → browser_resize({ width: 390, height: 844 })  ← iPhone 14 Pro
   → browser_wait_for({ state: "networkidle" })

2. Chụp screenshot code:
   → browser_take_screenshot()

3. SO SÁNH với design gốc (Figma screenshot từ bước 1):
```

**Checklist so sánh (check từng cái):**

| Mục | Check |
|---|---|
| **Layout** | Đúng cấu trúc: Header → Content → CTA → Home bar? |
| **Spacing** | Khoảng cách giữa sections đúng? Padding đúng 22px? |
| **Typography** | Font size đúng? Weight đúng? Line-height đúng? |
| **Color** | Đúng token? Foreground/secondary không bị lẫn? |
| **Alignment** | Text left-align? Values right-align? Center chỉ khi cần? |
| **Components** | Đúng component? Button size? TextField height? |
| **Proportion** | Tỷ lệ visual giống design? Không bị stretch/compress? |
| **Content** | Text content đúng? Placeholder đúng? |

**Output:** List cụ thể những chỗ KHÁC giữa code và design.

---

### Bước 4: Fix & Loop

**Nếu có diff:**
1. Fix từng issue theo thứ tự: Layout → Spacing → Typography → Color → Alignment
2. QUAY LẠI bước 3 (screenshot lại)
3. Lặp đến khi checklist bước 3 pass hết

**Nếu khớp:**
1. Check dark mode (toggle `.dark` class, screenshot lại)
2. Close browser (`browser_close`)
3. Report done với evidence (screenshots)

**Max iterations:** 5 lần. Nếu sau 5 lần vẫn không khớp → dừng, báo user cụ thể chỗ nào không fix được.

---

## Output

Khi done, report format:

```markdown
## Fast Loop — [Screen Name]

**Input:** [Figma URL / Screenshot / Text]
**File:** `app/[feature]/[screen]/page.tsx`
**Iterations:** N

### Result
[Screenshot code final]

### Changes made
1. [change 1]
2. [change 2]
...

### Parity check
- Layout: ✅
- Spacing: ✅
- Typography: ✅
- Color: ✅
- Alignment: ✅
- Dark mode: ✅
```

---

## Anti-Rationalization

| Excuse | Rebuttal |
|---|---|
| "Looks close enough" | Đo bằng mắt không đủ. Screenshot + compare. |
| "Skip dark mode, chỉ sửa nhỏ" | Dark mode check mất 30 giây. Làm. |
| "Không cần screenshot, tôi biết đúng rồi" | Bước 3 bắt buộc. Không screenshot = không done. |
| "Figma design không rõ, tôi đoán" | Hỏi user hoặc dùng get_screenshot zoom vào. Không đoán. |
| "Component này chưa có trong library" | Check lại 44 components. Nếu thật sự chưa có → raw HTML + token class, KHÔNG build component mới. |
| "5 iterations không đủ" | Nếu 5 lần chưa khớp = approach sai. Dừng, báo user, không tiếp tục guess. |

---

## Kết hợp với tools khác

| Sau Fast Loop | Tool |
|---|---|
| Muốn QC sâu hơn | `/vsp-launch` (6 gates) |
| Muốn check tất cả tokens | `npm run token-check` |
| Muốn push design ngược lên Figma | `/figma:figma-generate-design` |
| Muốn full feature pipeline | `vspteam` (11 steps) |
