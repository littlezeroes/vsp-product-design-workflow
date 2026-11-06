---
name: design
description: 'Full design pipeline: BRD → Flow decompose → Information design → UI gen → States browser. 4 phases, confirm mỗi phase. Trigger: "design", "thiết kế", "design feature", "làm feature"'
---

# Design — BRD → Production UI trong 4 phases

Mỗi phase có **confirm gate** — KHÔNG proceed khi chưa được user confirm.

---

## Input

1. **BRD/PRD text** — paste trực tiếp hoặc link file
2. **Hoặc** tên feature + mô tả ngắn
3. **Hoặc** "tiếp [feature]" để resume từ phase đã dừng

---

## Phase 1: FLOW DECOMPOSE

**Mục tiêu:** Chia feature thành flows → screens → states → edge cases.

### Bước 1.1: Đọc BRD
- Extract: user stories, actors (admin/member), pre/post conditions
- Xác định: feature thuộc nhóm nào trong roadmap (nếu có)

### Bước 1.2: Chia flows
Mỗi flow = 1 hành động user có thể làm. Format:

```
### F1: [Tên flow]
[Entry point] → [Step 1] → [Step 2] → ... → [Result]

| Screen | Route | States |
|--------|-------|--------|
| S1: ... | /feature/... | default, error, loading |

Edge cases:
- [ ] Case 1
- [ ] Case 2
```

### Bước 1.3: Summary table

```
| Flow | Screens | Edge cases |
|------|---------|------------|
| F1   | 2       | 4          |
| TOTAL| N       | M          |
```

### Output:
- File: `.claude/features/[name]/flows.md`
- Hiện summary cho user

### Confirm gate:
```
"Tổng X flows, Y screens, Z edge cases. OK không?"
→ User: "OK" → proceed Phase 2
→ User: "thêm/bỏ/sửa" → adjust → ask lại
```

---

## Phase 2: INFORMATION DESIGN

**Mục tiêu:** Mỗi screen → chia zones → lý do layout → mental model.

### Bước 2.1: Mental model
Cho MỖI screen chính, trả lời:
- User mở screen này **nghĩ gì**? (1 câu)
- **Cái quan trọng nhất** trên screen? → phải lớn nhất
- **Action chính** user muốn làm? → phải rõ nhất

### Bước 2.2: Zone map
Chia screen thành zones, mỗi zone có lý do:

```
┌─────────────────────────┐
│ Zone 1: [Tên]           │  Lý do: [tại sao ở đây]
│ Zone 2: [Tên]           │  Lý do: [tại sao ở đây]
│ Zone 3: [Tên]           │  Lý do: [tại sao ở đây]
└─────────────────────────┘
```

### Bước 2.3: Check với Taste Engine principles
- [ ] Hierarchy rõ? (size scale 3-5 levels)
- [ ] Alignment 22px?
- [ ] Color max 4-5?
- [ ] Premium = restraint? (bỏ gì được nữa không?)
- [ ] Reference app nào? (Cash App, Revolut, ...)

### Bước 2.4: Recall + Save patterns
- **Recall**: check `memory/design-decisions/` xem có pattern tương tự không
  - VD: "screen có số dư" → recall `pattern-hero-balance.md`
  - Nếu có → apply, không cần reasoning lại
- **Save**: nếu tạo reasoning mới → save vào `memory/design-decisions/`

### Output:
- File: `.claude/features/[name]/info-design.md`
- Annotated wireframe trên localhost (optional, nếu cần visual)
- Patterns saved to memory

### Confirm gate:
```
"Screen X: [zone map + lý do]. Có muốn đổi gì không?"
→ User: "OK" → proceed Phase 3
→ User: "đổi zone X" → adjust → ask lại
```

---

## Phase 3: UI GEN

**Mục tiêu:** Code screens theo info-design, dùng VSP components.

### Rules (từ memory):
1. **Cash App structure** — massive typography, whitespace, no decoration
2. **22px alignment axis** — mọi text cùng x=22
3. **Smooth corner 0.6** — tất cả radius
4. **₫ inline** — không "đồng" xuống dòng
5. **Header pl-[8px]** — optical alignment
6. **Premium = restraint** — khi boring, bỏ bớt, đừng thêm
7. **Dùng VSP components** — Header, Button, TextField, ItemList, FeedbackState...
8. **Khi user nói "fix X" → CHỈ fix X** — không đổi gì khác

### Per screen:
1. Đọc info-design → biết zones + hierarchy
2. Code screen với proper components
3. Tự check: alignment, hierarchy, consistency, color (Taste Engine structural score)
4. Nếu score < 0.7 → tự fix trước khi show

### Output:
- Files: `app/[feature]/[screen]/page.tsx`
- Chạy được trên localhost

### Confirm gate:
```
"X screens đã gen. Mở localhost:3000/[feature]/[screen] xem."
→ User feedback → iterate
```

---

## Phase 4: STATES BROWSER

**Mục tiêu:** Tạo states browser cho review toàn bộ.

### Template: Copy từ `app/sinhloi/page.tsx`
- 2 tabs: UI + Flow
- Sidebar: epics → screens → state pills
- iPhone frame: iframe preview
- Mermaid: flow charts per epic
- Prev/Next navigation

### Output:
- File: `app/[feature]/page.tsx`
- URL: `localhost:3000/[feature]`

### Confirm gate:
```
"States browser ready. X epics, Y screens, Z states."
→ User review all states
→ Done hoặc iterate
```

---

## File structure output

```
.claude/features/[name]/
├── flows.md              ← Phase 1 output
└── info-design.md        ← Phase 2 output

app/[name]/
├── page.tsx              ← Phase 4: States browser
├── [screen-1]/page.tsx   ← Phase 3: UI screens
├── [screen-2]/page.tsx
└── ...

memory/design-decisions/
├── pattern-xxx.md        ← Phase 2: auto-saved patterns
└── ...
```

---

## Resume

Nếu user nói "tiếp [feature]":
1. Đọc `.claude/features/[name]/flows.md` → biết đang ở phase nào
2. Check screens đã gen → biết còn thiếu gì
3. Resume từ phase tiếp theo

---

## KHÔNG làm

- ❌ Không skip phase — phải chạy tuần tự 1→2→3→4
- ❌ Không tự proceed khi chưa confirm
- ❌ Không gen UI trước khi có info-design (Phase 3 phụ thuộc Phase 2)
- ❌ Không đổi layout/style khi user chỉ nói fix 1 thứ
- ❌ Không dùng glassmorphism, glow, gradient decoration (trừ khi user chỉ định)
- ❌ Không fake shadow — nếu CSS không render, debug DevTools trước
