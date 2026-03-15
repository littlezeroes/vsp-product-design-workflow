# Step 09 — Ivy gen code + verify localhost + output bảng tổng hợp

## Agent: 🎨 Ivy (Claude Code)
## Input: `screens.md` (approved) + `decisions.md` + `flow.md`
## Output:
- `app/[feature]/**/*.tsx` — code chạy được
- `.claude/features/[name]/summary.md` — bảng tổng hợp cho PO vẽ Figma
- Localhost verified — `npm run dev` chạy ok, không lỗi

---

## Instructions cho Ivy

### 1. Đọc trước khi build
- `screens.md` — approved screen breakdown
- `decisions.md` — PO choices
- `flow.md` — approved flow
- `.claude/agents/vsp-designer.md` — FULL reference (token, component, template, anti-patterns)
- `.claude/design-principles.md` — 7 design laws
- `app/globals.css` — token definitions
- **`app/bidv-link/` — GOLD STANDARD TEMPLATE** — ĐỌC TRƯỚC, BÁM SÁT 100%:
  - `app/bidv-link/deposit/page.tsx` — **Nạp/Rút tiền mẫu**: Custom Numpad, big amount center, pill tab switcher, quick chips
  - `app/bidv-link/deposit-auth/page.tsx` — **Confirm + Auth mẫu**: Dark header hero (`bg-foreground`) + white card overlap (`-mt-[32px]`, `rounded-[28px]`) + PIN cells + auth method selector (FaceID/TouchID/PIN)
  - `app/bidv-link/deposit-result/page.tsx` — **Result screen mẫu**: Dark header + white card overlap + detail ItemList + multi-CTA
  - `app/bidv-link/transactions/page.tsx` — **Lịch sử GD mẫu**: Filter chips horizontal, grouped by date, skeleton loading, FeedbackState empty/error
  - `app/bidv-link/bidv-form/page.tsx` — **Form mẫu**: StepIndicator, BottomSheet T&C, Dialog errors, InformMessage banners
  - `app/bidv-link/layout.tsx` — **Layout mẫu**: Suspense wrapper
  - **Pattern rules từ BIDV (BẮT BUỘC):**
    - Nạp/Rút → Custom Numpad (KHÔNG dùng TextField cho số tiền)
    - Confirm/Auth/Result → Dark header `bg-foreground` + white card `-mt-[32px]` overlap
    - PIN → PinCell components (44x44, rounded-[14px], border-2)
    - Tab switch → Pill toggle (`bg-secondary rounded-full p-[3px]`)
    - Quick amounts → Pill chips (`rounded-full`, toggle `bg-foreground text-background`)
    - Lịch sử → Grouped by date, filter chips, skeleton loading
- **`app/rwa/` — SECONDARY REFERENCE** — cho onboarding, tab layout:
  - `app/rwa/onbo/page.tsx` — onboarding flow mẫu (slides, navigation, states)
  - `app/rwa/(tabs)/layout.tsx` — tab layout pattern

### 2. Create route structure
```
app/[feature]/
  ├── page.tsx              ← screen 1 (entry)
  ├── [screen-2]/page.tsx
  ├── [screen-3]/page.tsx
  ├── [screen-N]/page.tsx
  └── _states/page.tsx      ← BẮT BUỘC: màn hình list ALL states
```

### 3. Build mỗi screen theo template

```tsx
"use client"

import { Header } from "@/components/ui/header"
// ... other VSP components

export default function ScreenName() {
  // 1. State declarations (from screens.md states)
  // 2. Handlers

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">

      {/* Header */}
      <Header variant="..." ... />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-[21px]">

        {/* Sections — pt-[32px] gap, px-[22px] content */}
        <div className="pt-[32px]">
          <div className="px-[22px] space-y-3">
            {/* VSP components */}
          </div>
        </div>

      </div>

      {/* Home indicator */}
      <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] bg-background pointer-events-none">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>

    </div>
  )
}
```

### 4. Implement ALL states from screens.md
Mỗi state trong screens.md phải có code handling:
- `empty` → conditional render
- `loading` → spinner / skeleton
- `error` → inline error message hoặc FeedbackState
- `disabled` → button disabled prop
- `success/failed` → FeedbackState component

### 5. Tạo màn hình `_states/page.tsx` — BẮT BUỘC

Tạo route `app/[feature]/_states/page.tsx` — một trang đặc biệt render TẤT CẢ states của TẤT CẢ screens trong feature. Giống Storybook nhưng chạy trên localhost.

**Mục đích:** PO mở 1 link duy nhất → thấy hết mọi state → check không miss → dùng để vẽ Figma.

```tsx
"use client"

import { Header } from "@/components/ui/header"

export default function AllStatesPage() {
  return (
    <div className="w-full max-w-[390px] min-h-screen bg-background text-foreground">

      <Header variant="large-title" largeTitle="All States" />

      <div className="flex-1 overflow-y-auto pb-[21px]">

        {/* === Screen 1: [Name] === */}
        <div className="pt-[32px]">
          <div className="px-[22px]">
            <h2 className="text-[17px] font-semibold text-foreground">Screen 1: [Name]</h2>
          </div>
        </div>

        {/* State: empty */}
        <div className="pt-[16px]">
          <div className="px-[22px]">
            <p className="text-[13px] font-medium text-foreground-secondary mb-2">State: empty</p>
          </div>
          <div className="border border-border rounded-[28px] mx-[12px] overflow-hidden">
            {/* Render screen component with empty state */}
          </div>
        </div>

        {/* State: loading */}
        <div className="pt-[16px]">
          <div className="px-[22px]">
            <p className="text-[13px] font-medium text-foreground-secondary mb-2">State: loading</p>
          </div>
          <div className="border border-border rounded-[28px] mx-[12px] overflow-hidden">
            {/* Render screen component with loading state */}
          </div>
        </div>

        {/* ... repeat for ALL states of ALL screens ... */}

      </div>
    </div>
  )
}
```

**Rules cho _states page:**
- Mỗi screen = 1 section, title hiện tên screen
- Mỗi state = 1 card bọc trong border, label state name ở trên
- Render component thật (không mock) — force state qua props/params
- Thứ tự: Screen 1 all states → Screen 2 all states → ... → Screen N all states
- URL: `http://localhost:3000/[feature]/_states`

### 6. Build checklist (trước khi report done)
- [ ] All colors from token classes (no hex)
- [ ] `px-[22px]` on all content columns
- [ ] `pt-[32px]` between sections
- [ ] All components from VSP library
- [ ] One `variant="primary"` button per screen
- [ ] `ChevronLeft` for back
- [ ] Home indicator present
- [ ] No `text-muted-foreground`
- [ ] No `rounded-lg` / `rounded-xl` on cards
- [ ] All states from screens.md implemented
- [ ] `_states/page.tsx` renders ALL states of ALL screens
- [ ] Code style matches `app/rwa/` reference pattern

### 7. Verify localhost
Sau khi build xong code:
```bash
# Check build không lỗi
npm run build 2>&1 | tail -20

# Nếu lỗi → fix → build lại
# Nếu pass → confirm dev server chạy ok
npm run dev &
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/[feature]
# Phải return 200
```

Ivy PHẢI FIX hết build errors trước khi report done.

### 8. Output bảng tổng hợp (`summary.md`)
Tạo file `.claude/features/[name]/summary.md` cho PO review + vẽ Figma:

```markdown
# [Feature Name] — Summary
> Builder: Ivy | Date: [date]

## Flow Diagram
```
[Entry] → [Screen 1] → [Screen 2] → ... → [Result]
              ├── error → [Error handling]
              └── cancel → [Back]
```

## Screens × Components × States

| # | Screen | Route | Components | States |
|---|--------|-------|------------|--------|
| 1 | [Name] | /feature/ | Header, TextField, Button | empty, valid, error, loading |
| 2 | [Name] | /feature/confirm | Header, ItemList, ButtonGroup | loading, ready |
| 3 | [Name] | /feature/result | Header, FeedbackState, Button | success, failed |

## Component Inventory

| Component | Used in screens | Props/Variants |
|-----------|----------------|----------------|
| Header | 1, 2, 3 | variant="large-title" / "default" |
| TextField | 1 | label="...", error="..." |
| Button | 1, 3 | variant="primary", size="48" |
| ItemList | 2 | [items] |
| FeedbackState | 3 | variant="success" / "error" |

## State Matrix (cho PO check không miss)

| Screen | empty | loading | valid | error | disabled | success | failed |
|--------|-------|---------|-------|-------|----------|---------|--------|
| Input | ✅ | ✅ | ✅ | ✅ | ✅ | — | — |
| Confirm | — | ✅ | — | ✅ | — | — | — |
| Result | — | — | — | — | — | ✅ | ✅ |

## URLs để review
- Entry: http://localhost:3000/[feature]
- Screen 2: http://localhost:3000/[feature]/confirm
- Screen 3: http://localhost:3000/[feature]/result
- **ALL STATES: http://localhost:3000/[feature]/_states** ← PO dùng trang này để review + vẽ Figma
```

---

## Handoff
- Code built + localhost verified
- summary.md created
- Notify: `openclaw system event --text "Ivy done: code built, localhost ready. Review: http://localhost:3000/[feature]. Summary: .claude/features/[name]/summary.md" --mode now`
- Dispatch Khoa cho step-10 (full QA)
