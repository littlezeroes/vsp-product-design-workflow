---
name: wireframe
description: 'Quick wireframe từ BRD/idea → code screens + states browser → localhost. Monochrome, VSP components. Trigger: "wireframe", "wf", "sketch", "phác", "mock"'
---

# Wireframe — BRD → Localhost trong 10 phút

Mục tiêu duy nhất: **PO mở localhost → thấy wireframe → feedback → iterate.**

Không cần pixel-perfect. Không cần Figma. Không cần dark mode. Chỉ cần đúng layout + đúng flow + đúng states.

---

## Input

1. **BRD text** — mô tả feature
2. **Hoặc** danh sách screens + states
3. **Hoặc** "thêm screen X vào feature Y"

---

## Output

```
app/[feature]/
├── page.tsx                ← States browser (copy từ sinhloi template)
├── [screen-1]/page.tsx     ← Wireframe screen
├── [screen-2]/page.tsx
└── ...
```

PO mở `localhost:3000/[feature]` → thấy tất cả screens + states + flow charts.

---

## 3 bước (không hơn)

### Bước 1: Parse BRD → Screen list (2 phút)

Đọc BRD, output bảng:

| # | Screen | Route | States | Components |
|---|--------|-------|--------|------------|
| S1 | Nhập SĐT | /topup | empty, valid, error | Header, TextField, Button |
| S2 | Chọn mệnh giá | /topup/amount | default, selected | Header, Chip[], Button |
| S3 | Confirm | /topup/confirm | default, loading | Header, ItemList, ButtonGroup |
| S4 | Result | /topup/result | success, failed | Header, FeedbackState, Button |

**Tự quyết định — không hỏi PO ở bước này.** Hỏi sau khi có wireframe.

### Bước 2: Gen wireframe screens (5 phút)

**Template cho mỗi screen:**

```tsx
"use client"
import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Header } from "@/components/ui/header"
// ... VSP components

export default function ScreenName() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "default"

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header variant="large-title" largeTitle="Title" onBack={() => router.back()} />

      <div className="flex-1 overflow-y-auto pb-[21px]">
        {/* Content per state */}
        <div className="pt-[24px]">
          <div className="px-[22px]">
            {/* Wireframe content here */}
          </div>
        </div>
      </div>

      {/* Home indicator */}
      <div className="flex justify-center pb-[8px]">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}
```

**Rules wireframe:**
- Monochrome only — `bg-background`, `text-foreground`, `bg-secondary`, `border-border`
- Dùng VSP components — Header, Button, TextField, ItemList, FeedbackState...
- **State switching qua URL params** — `?state=error`, `?state=loading`
- Placeholder text ok — "Lorem ipsum" ok cho wireframe
- **Không cần animations, transitions, API calls**
- **Mỗi screen dưới 150 dòng** — wireframe phải lean

### Bước 3: Gen states browser (3 phút)

**PHẢI copy pattern từ `app/sinhloi/page.tsx`.**

Tạo `app/[feature]/page.tsx` với:

```tsx
const EPICS: Epic[] = [
  {
    id: "e1",
    title: "Epic 1 — [name]",
    desc: "S1 → S2 → S3",
    color: "#6366f1",
    screens: [
      {
        screen: "S1: [Screen name]",
        route: "/[feature]/[screen]",
        states: [
          { label: "default", param: "" },
          { label: "error", param: "?state=error" },
          { label: "loading", param: "?state=loading" },
        ],
      },
      // ... all screens
    ],
  },
]

const FLOWS: Record<string, string> = {
  e1: `flowchart TD
  START(([Entry])) --> S1[S1: Screen name]
  S1 --> S2[S2: Next screen]
  ...`,
}
```

**Copy phần render UI (sidebar, tabs, iframe, Mermaid) nguyên từ sinhloi template.** Chỉ thay data `EPICS` và `FLOWS`.

---

## Checklist done

- [ ] `npm run dev` không lỗi
- [ ] `localhost:3000/[feature]` → states browser mở được
- [ ] Tab UI: sidebar click → iframe render đúng screen + state
- [ ] Tab Flow: Mermaid chart render đúng
- [ ] Mỗi screen có ít nhất 2 states (default + 1 edge case)

**KHÔNG cần:**
- ❌ Screenshot verify
- ❌ Dark mode check
- ❌ Token audit
- ❌ Pixel-perfect spacing
- ❌ Figma compare

---

## Iterate với PO

PO feedback → sửa trực tiếp:

```
"thêm state loading cho S2"     → thêm state vào EPICS data + screen code
"đổi flow S1 → S3 thay vì S2"  → sửa Mermaid chart + navigation
"bỏ screen confirm"             → xóa route + update EPICS
"thêm field email"              → thêm TextField vào screen
```

Mỗi lần sửa < 2 phút. PO refresh browser → thấy ngay.

---

## Sau wireframe approved

```
Wireframe OK → /vsp-build (polish từng screen) → /fast-loop (match Figma) → /vsp-launch (ship)
```

Wireframe là bước 1 — nhanh, bẩn, đúng flow. Polish sau.
