# Step 06 — Ivy tạo screen breakdown + states

## Agent: 🎨 Ivy (Claude Code)
## Input: `flow.md` (approved) + `decisions.md`
## Output: `.claude/features/[name]/screens.md`

---

## Instructions cho Ivy

### 1. Đọc inputs
- `flow.md` — approved flow
- `decisions.md` — PO choices
- `.claude/agents/vsp-designer.md` — component library + token system
- `.claude/ref-patterns.md` — UI reference (visual only)

### 2. Cho mỗi screen trong flow, xác định:

**Screen type** → quyết định UI Ref:
```
Form Input      → Cash App (1 focus per screen)
Confirmation    → OKX (bottom sheet / detail list)
Result          → Cash App (centered, minimal)
Auth (PIN/OTP)  → OKX (cell boxes)
List/Dashboard  → Revolut (clean rows)
Settings        → Revolut (grouped toggles)
```

**Components** → map từ VSP library:
```
Nav bar         → Header
Input field     → TextField
Checkbox        → Checkbox
List row        → ItemListItem
Bottom sheet    → BottomSheet
Modal           → Dialog
Banner          → InformMessage / ToastBar
Empty/error     → FeedbackState
Buttons         → Button / ButtonGroup
```

**States** → từ edge-case-library + flow branches:
```
Mỗi screen PHẢI list tất cả states.
Nếu flow.md không nói rõ → check edge-case-library cho screen type đó.
```

### 3. Output format

```markdown
# Screen Breakdown — [Feature Name]
> Designer: Ivy | Date: [date]
> Based on: flow.md (approved [date])

---

## Screen 1: [Name]
- **Route:** `/[feature]/`
- **Type:** [Form Input / Confirmation / Result / ...]
- **UI Ref:** [Cash App / OKX / Revolut] — [pattern name]
- **Components:**
  | Component | Props | Notes |
  |-----------|-------|-------|
  | Header | variant="large-title", largeTitle="..." | |
  | TextField | label="...", type="..." | |
  | Button | variant="primary", size="48" | disabled until valid |
- **States:**
  | State | Trigger | UI Change |
  |-------|---------|-----------|
  | empty | initial load | TextField empty, Button disabled |
  | valid | 10 digits entered | Button enabled |
  | error | API returns not found | TextField error="..." |
  | loading | submit pressed | Button loading spinner |
- **Transitions:**
  - valid + submit → Screen 2
  - back → previous screen

---

## Screen 2: [Name]
[same format]

---

## Summary
| Screen | Components | States | Route |
|--------|-----------|--------|-------|
| [name] | [count] | [count] | /[path] |
| ... | ... | ... | ... |

**Totals:**
- Screens: N
- Components used: [list unique]
- Total states: N
```

---

## Handoff
screens.md saved → dispatch Khoa cho step-07 (state coverage check).
