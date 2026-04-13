# Fast Loop — 2 Con Đường Vào

## Path A: Từ BRD → Code chỉnh chu

```
BRD (text / doc / Figma)
    │
    ▼
┌─ UNDERSTAND (10-15 phút) ──────────────────────────┐
│                                                      │
│  Nate đọc BRD → tìm gaps → hỏi PO                  │
│  → PO trả lời → Nate vẽ flow                        │
│                                                      │
│  Output: flow.md (screens + states + edge cases)     │
└──────────────────────────────────────────────────────┘
    │
    ▼
┌─ BUILD (5-10 phút / screen) ────────────────────────┐
│                                                      │
│  /vsp-build [screen name from flow.md]               │
│                                                      │
│  AI đọc flow.md → map components VSP → gen code      │
│  → self-QC (grep tokens) → screenshot localhost      │
│                                                      │
│  Output: app/[feature]/[screen]/page.tsx              │
└──────────────────────────────────────────────────────┘
    │
    ▼
┌─ ITERATE (3-5 phút / round) ────────────────────────┐
│                                                      │
│  /fast-loop app/[feature]/[screen]/page.tsx           │
│                                                      │
│  Screenshot code → PO xem → feedback                 │
│  → AI sửa → screenshot lại → PO xem → ...           │
│  → Khớp? → done                                     │
│                                                      │
│  Loop này lặp nhanh — không cần chạy lại pipeline    │
└──────────────────────────────────────────────────────┘
    │
    ▼
┌─ SHIP ──────────────────────────────────────────────┐
│  /vsp-launch                                         │
│  Token audit + dark mode + final screenshot          │
└──────────────────────────────────────────────────────┘
```

### Ví dụ thực tế — Path A

```
User: "Tạo feature nạp tiền điện thoại. BRD: user chọn nhà mạng, 
       nhập số điện thoại, chọn mệnh giá, confirm, nhập PIN, kết quả."

→ Nate analyze BRD (step 01-03 rút gọn):
  - 6 screens: Chọn NM → Nhập SĐT → Chọn mệnh giá → Confirm → PIN → Result
  - Edge cases: SĐT sai format, mạng không hỗ trợ, PIN sai 3 lần
  - Output: flow.md

→ /vsp-build "màn nhập số điện thoại"
  - AI dùng: Header(large-title) + TextField(phone) + Button(primary)
  - Spacing: px-[22px], pt-[24px]
  - Screenshot verify

→ PO feedback: "thêm gợi ý số gần đây ở dưới input"
→ /fast-loop "thêm list 3 số gần đây dưới TextField, dùng ItemList"
  - AI sửa → screenshot → compare → done

→ /vsp-launch → ship
```

---

## Path B: Từ Figma có sẵn → Code match

```
Figma URL (design đã vẽ)
    │
    ▼
┌─ IMPLEMENT (10-15 phút / screen) ───────────────────┐
│                                                      │
│  /fast-loop https://figma.com/design/.../node-id=X   │
│                                                      │
│  Bước 1: get_design_context + get_screenshot         │
│          → AI phân tích: components, spacing, colors  │
│          → map sang VSP components                    │
│                                                      │
│  Bước 2: Gen code dùng VSP DS                        │
│          Header, Button, TextField, ItemList...       │
│          KHÔNG copy raw từ Figma — PHẢI dùng library  │
│                                                      │
│  Bước 3: Screenshot localhost (390×844)               │
│          So sánh với Figma screenshot                 │
│          Check: layout, spacing, typography, color    │
│                                                      │
│  Bước 4: Có diff? → Fix → Bước 3                     │
│          Khớp? → Done                                │
│                                                      │
│  Output: code match Figma, dùng 100% VSP components  │
└──────────────────────────────────────────────────────┘
    │
    ▼
┌─ ITERATE (PO feedback) ─────────────────────────────┐
│                                                      │
│  PO: "padding hơi rộng" / "font to quá"             │
│  → /fast-loop "giảm padding section xuống 16px"      │
│  → Screenshot → compare → done                      │
│                                                      │
└──────────────────────────────────────────────────────┘
    │
    ▼
┌─ SHIP ──────────────────────────────────────────────┐
│  /vsp-launch                                         │
│  Token audit + dark mode + final screenshot          │
└──────────────────────────────────────────────────────┘
```

### Ví dụ thực tế — Path B

```
User: "Match cái này"
      https://figma.com/design/m8U2GMl2eptDD5gv9iwXDs/...?node-id=5256-8737

→ /fast-loop [figma-url]
  
  Bước 1: get_design_context trả về:
    - TextField component, label="Số điện thoại", variant="default"
    - Button primary, text="Tiếp tục"
    - Spacing: 22px padding, 24px section gap
    
  Bước 2: Gen code:
    <Header variant="large-title" largeTitle="Nạp tiền" />
    <TextField label="Số điện thoại" type="tel" />
    <Button variant="primary">Tiếp tục</Button>
    
  Bước 3: Screenshot localhost → so sánh Figma screenshot
    - Layout: ✅
    - Spacing: ❌ section gap 32px thay vì 24px
    - Typography: ✅
    - Color: ✅
    
  Bước 4: Fix spacing → screenshot lại
    - Spacing: ✅
    → All pass → check dark mode → done
```

---

## Khi nào dùng gì

```
                    ┌─────────────────┐
                    │  Có BRD/idea?   │
                    └────────┬────────┘
                      YES    │    NO
                      ↓      │     ↓
              ┌───────────┐  │  ┌──────────────┐
              │ Nhiều      │  │  │ Có Figma     │
              │ screens?   │  │  │ design?      │
              └──┬─────┬──┘  │  └──┬────────┬──┘
              YES│     │NO   │  YES│        │NO
               ↓ │     ↓     │    ↓         ↓
    ┌──────────┐ │ ┌────────┐│ ┌─────────┐ ┌────────┐
    │ Full     │ │ │ Nate   ││ │ /fast-  │ │ /vsp-  │
    │ Pipeline │ │ │ flow + ││ │ loop    │ │ build  │
    │ vspteam  │ │ │ /vsp-  ││ │ [url]   │ │ [desc] │
    │ 11 steps │ │ │ build  ││ │         │ │        │
    └──────────┘ │ └────────┘│ └─────────┘ └────────┘
                 │           │
                 │    Sau build, PO feedback?
                 │           │
                 │     ┌─────▼─────┐
                 └────▶│ /fast-loop │◀── luôn dùng để iterate
                       │ [feedback] │
                       └─────┬─────┘
                             │
                       ┌─────▼─────┐
                       │/vsp-launch │
                       │  → ship    │
                       └───────────┘
```

---

## VSP DS Components Quick Ref (44 components)

### Layout (7)
header · fixed-bottom · section · divider · tab · search-bar · glass-bar

### Input (14)
button · button-group · text-field · text-area · special-text-field · date-field
checkbox · radio · toggle · chip · dropdown · pin-input · uploader · calendar

### Display (13)
item-list · badge · label · tip · inform-message · toast-bar · feedback-state
skeleton · pagination · image-frame · terms · card · avatar

### Overlay (2)
dialog · bottom-sheet
