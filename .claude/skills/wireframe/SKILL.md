---
name: wireframe
description: 'Quick wireframe từ BRD/idea → research → code screens + states browser (4 tabs) → localhost. Dùng /quy-nhom framework mới. Trigger: "wireframe", "wf", "sketch", "phác", "mock"'
---

# Wireframe — BRD → Localhost với framework /quy-nhom

Mục tiêu: PO mở `localhost:3000/[feature]` → thấy **4 tabs** (UI / Flow / Inspect / Handoff), tất cả screens + states + mental model + zones + FigJam flow + live handoff. Feedback → iterate trong phút.

**Template chuẩn: `app/quy-nhom/page.tsx`** (2382 lines) — KHÔNG dùng `/sinhloi` (old framework). Copy wholesale, swap data only.

---

## Input

- BRD text / danh sách screens + states / hoặc "thêm screen vào feature Y"

---

## Output structure

```
.claude/features/[feature]/
└── info-design.md              ← SOURCE: mental models + zones + why (BẮT BUỘC)

app/[feature]/
├── layout.tsx                  ← Suspense wrapper
├── page.tsx                    ← States browser (copy từ app/quy-nhom/page.tsx)
├── [screen-1]/page.tsx         ← Individual screens (VSP components)
├── [screen-2]/page.tsx
└── ...
```

---

## 4 bước (research → gen → states browser → verify)

### Bước 0 — Research (5 phút) — **BẮT BUỘC, không được skip**

Trước khi viết dòng code nào, làm đủ các research step sau để tránh sai framework:

1. **Đọc template chuẩn** (nếu chưa thuộc):
   ```
   Read app/quy-nhom/page.tsx (2382 lines — scan sections: EPICS, INFO_DESIGN, FLOW_CHARTS, HANDOFF_IFRAMES, HANDOFF_LABELS, HANDOFF_FLOW_STARTS, HandoffPanel, InspectPanel)
   Read .claude/features/quy-nhom/info-design.md (source format)
   Read 1 sample screen: app/quy-nhom/dashboard/page.tsx (VSP component usage)
   ```

2. **Scan component library:**
   ```
   ls components/ui/     → biết component nào có sẵn (đừng tự tạo mới)
   Read components/ui/header.tsx · button.tsx · fixed-bottom.tsx (core 3)
   Read component nào đặc thù cho feature (pin-input nếu có OTP, radio nếu có picker, v.v.)
   ```

3. **Scan BRD cho edge cases:**
   - Role-based? (admin vs member vs kid)
   - Time-based? (DPD, overdue, kỳ hạn)
   - Quota-based? (limit còn, số dư đủ)
   - Permission-based? (locked, suspended, pending)
   
   Từng loại → ≥ 1 state riêng.

4. **Output bảng screens trước khi code** (tự quyết, không hỏi PO):

   | # | Screen | Route | Mental model (1 câu) | States | VSP components |
   |---|--------|-------|----------------------|--------|----------------|
   | S1 | ... | /feat/... | User muốn ... | default, error, ... | Header, Button, ... |

5. **Check similar features trong codebase** (tránh reinvent):
   ```
   Grep cho pattern tương tự — ví dụ feature có "OTP" → tìm existing OTP screen reuse layout
   ```

**Không research = làm sai framework (như lần đầu làm BNPL với /sinhloi).**

---

### Bước 1 — Viết info-design.md (10 phút)

File: `.claude/features/[feature]/info-design.md`

Format cho mỗi screen:

```markdown
## S1: [Screen name]

**Mental model:** "[1 câu mô tả user muốn gì khi mở màn này]"

**Hoàn cảnh:** [Khi nào, ở đâu, với ai]
**Cảm xúc:** [Mood state — háo hức, cẩn thận, bối rối, bình tĩnh]
**Quyết định:** [Điều user phải quyết]
**Thành công khi:** [Tiêu chí cảm thấy xong]

| Zone | Nội dung | Lý do |
|------|----------|-------|
| Hero ... | ... mô tả cụ thể layout ... | ... vì sao design như vậy, tham chiếu pattern ... |
| CTA ... | ... | ... |

**Reference:** [App/pattern industry tương đương, optional]
```

Đây là source truth — sẽ paste nguyên vào INFO_DESIGN dict trong `page.tsx`.

---

### Bước 2 — Viết individual screens (tuỳ complexity)

Mỗi screen: `app/[feature]/[route]/page.tsx`. Template chuẩn:

```tsx
"use client"
import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import { FixedBottom } from "@/components/ui/fixed-bottom"

export default function ScreenName() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "default"

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header
        variant="large-title"
        largeTitle="Title"
        leading={<button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full"><ChevronLeft size={18} /></button>}
      />
      <div className="flex-1 overflow-y-auto pb-[140px]">
        {/* State-driven content */}
      </div>
      <FixedBottom>
        <Button variant="primary" size="48" className="w-full">CTA</Button>
        <div className="flex justify-center pt-[8px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </FixedBottom>
    </div>
  )
}
```

**Rules:**
- State switching qua URL params — `?state=error`, `?role=admin`, `?status=pending`
- Dùng VSP components có sẵn (không custom button/input div)
- **Không hardcode color** — dùng semantic tokens (`text-foreground`, `bg-secondary`, `bg-danger`, etc.)
- Layout: Header → Section(s) → FixedBottom (xem CLAUDE.md)

---

### Bước 3 — States browser `page.tsx` (10 phút) — **COPY WHOLESALE**

```bash
cp app/quy-nhom/page.tsx app/[feature]/page.tsx
```

Sau đó Edit tool để swap **CHỈ** các phần data sau:

| Biến | Vị trí | Nội dung mới |
|------|--------|--------------|
| `INFO_DESIGN: Record<string, ScreenInfo>` | ~line 32 | Paste từ info-design.md, format theo interface |
| `EPICS: Epic[]` | ~line 179 | List screens + states với route `/[feature]/...` |
| `FLOW_CHARTS: Record<string, string>` | ~line 346 | Mermaid per epic, edge label "Có"/"Không" (→ auto green/red pills) |
| `HANDOFF_IFRAMES: Record<string, string>` | ~line 1321 | Map flow node ID → iframe route |
| `HANDOFF_LABELS: Record<string, string>` | ~line 1360 | Short label per screen node |
| `HANDOFF_FLOW_STARTS: Record<string, string>` | ~line 1400 | Node ID nào là starting point mỗi epic (blue play badge) |
| Sidebar header title | ~line 2194 | Replace "Quỹ nhóm" → tên feature mới |
| Link "V" (top-left) | ~line 2181 | Giữ nguyên — link về /design-review |

**KHÔNG sửa:** mọi function component (Sidebar, FlowRenderer, ZoomableCanvas, FlowPanel, HandoffPanel, HandoffFlowRender, HandoffScreenOverlay, InspectPanel, LegendRow, MetaStat, CapsuleTab, TabButton, ChevronIcon, FloatingCopyToolbar, ZoneCopyActions, MentalRow, ZoomBtn) — và mọi CSS (`--tool-*` variables, Poppins font, dot grid, Figma blue #0d99ff).

**Nhớ:**
- Flow `edge label` phải dùng chữ "Có"/"Không" (auto render pill xanh/đỏ)
- HANDOFF_IFRAMES node ID phải match với ID trong FLOW_CHARTS (vd: `S1`, `S4A`, `DIALOG_D`, không phải tên screen)
- INFO_DESIGN key = EPICS.screens[].screen (exact string match)

---

### Bước 4 — Verify

```bash
npm run dev  # (nếu chưa chạy)
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/[feature]
# Tất cả routes phải trả 200
```

Dùng Playwright mở `http://localhost:3000/[feature]`:
- Tab **UI** — sidebar → iframe render đúng screen + state, prev/next chạy
- Tab **Flow** — Mermaid chart FigJam style, edge có pill Có/Không, hover node có "Hỏi AI"
- Tab **Inspect** — iframe nhỏ + zone hotspots (number badge) + mental model panel phải
- Tab **Handoff** — live iframes ở flow node, click → mở UI, pan/zoom chạy
- Dark mode toggle (Moon icon top-left) không lỗi

**Close browser sau khi check xong** (memory rule).

---

## Checklist done

- [ ] `info-design.md` tồn tại với đủ mental model + zones + why cho mọi screen
- [ ] `app/[feature]/page.tsx` có 4 tabs UI/Flow/Inspect/Handoff (copy từ quy-nhom)
- [ ] `INFO_DESIGN` key khớp EPICS.screens[].screen
- [ ] `HANDOFF_IFRAMES` map đủ node ID trong Mermaid
- [ ] Mọi route 200
- [ ] Playwright verify 4 tabs render, browser đã close

**KHÔNG cần:**
- ❌ Screenshot verify pixel (chỉ cần UI/Flow/Inspect render)
- ❌ Token audit (có /vsp-launch sau)
- ❌ Figma compare

---

## Iterate với PO

PO feedback → edit sạch:
- "thêm state loading cho S2" → thêm state vào EPICS + code screen
- "đổi flow S1 → S3" → sửa FLOW_CHARTS Mermaid
- "thêm zone Y ở S3" → thêm entry vào INFO_DESIGN + bbox tương ứng
- "bỏ screen confirm" → xóa route + update EPICS + HANDOFF_IFRAMES

Mỗi lần sửa < 2 phút. PO refresh browser → thấy ngay.

---

## Sau wireframe approved

```
Wireframe OK → /vsp-build (polish từng screen) → /fast-loop (match Figma) → /vsp-launch (ship)
```

Wireframe là bước 1 — đúng framework, đúng flow, đúng data. Polish sau.
