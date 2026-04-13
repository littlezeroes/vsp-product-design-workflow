# Figma Layer Restructure — Workflow

> Chuẩn hóa layer structure cho mọi screen: rối → chuẩn, giữ nguyên visual UI.

## Hierarchy chuẩn

```
Page (SCREEN)
│
├── [Screen] Tên màn hình          ← COMPONENT
│   ├── Section_Header             ← instance
│   ├── Tab                        ← instance
│   ├── [Section] Tên section      ← instance (từ ComponentSet bên ngoài)
│   │   └── Card slot              ← SLOT (drop card instances vào)
│   │       ├── Card item          ← instance (variant=State1)
│   │       ├── Card item          ← instance (variant=State2)
│   │       └── ...
│   ├── Bottom navigation bar      ← instance
│   └── Toast wrapper              ← SLOT
│
├── [Section] Tên section          ← COMPONENT_SET (quản lý riêng)
│   ├── Layout=Default             ← variant, chứa Slot
│   ├── Layout=Empty               ← variant, empty state
│   └── Layout=Loading             ← variant, skeleton
│
├── Card component                 ← COMPONENT_SET (quản lý riêng)
│   ├── Status=Pending
│   ├── Status=Active
│   └── Status=Complete
│
└── Badge / Button / ...           ← COMPONENT_SET (nhỏ, quản lý riêng)
```

## 4 tầng cấu trúc

### Tầng 1: Screen (COMPONENT)

Screen = Component để có thể reuse, override content qua slots.

**CRITICAL RULES:**
- Screen `layoutMode=VERTICAL`, `counterAxisSizingMode=FIXED` (390px), `primaryAxisSizingMode=AUTO` (HUG)
- ALL direct children: `layoutSizingHorizontal=FILL` — kéo dãn full width
- **Layer 1 rule:** VSP_Header, sections, fixedBottom, Toast wrapper phải là direct children — KHÔNG bọc trong Content/Group/Frame wrapper
- Không có frame nào ở giữa screen và children của nó

```
[Screen] Hợp đồng (COMPONENT)
  componentProps:
    - Toast wrapper: SLOT      ← cho toast/snackbar
  children:
    - Section_Header    (instance)
    - Tab               (instance)
    - [Section] ...     (instance)  ← từ Section ComponentSet
    - Bottom nav        (instance)
    - Toast wrapper     (SLOT)
```

**Rules:**
- Naming: `[Screen] Tên tiếng Việt`
- Layout: VERTICAL, auto-layout
- Slot bắt buộc: `Toast wrapper`
- Mọi child phải là instance hoặc slot — KHÔNG có frame rời

### Tầng 2: Section (COMPONENT_SET)

Section = ComponentSet nằm ngoài screen, có variants theo layout state.

```
[Section] Contract listing (COMPONENT_SET)
  variants:
    - Layout=Default     ← chứa Slot cho card list
    - Layout=Empty       ← empty state (illustration + message)
    - Layout=Loading     ← skeleton/shimmer
  componentProps:
    - Card slot: SLOT    ← trong variant Default, drop cards vào đây
```

**Rules:**
- Naming: `[Section] Tên section`
- Đặt bên ngoài screen, cùng page
- Mỗi section có ít nhất 2 variants: Default + Empty
- Variant Default PHẢI có Slot cho content items
- Section KHÔNG chứa data cứng — data qua instances trong slot

### Tầng 3: Content (COMPONENT hoặc COMPONENT_SET)

Content = thứ nằm TRONG Slot của Section. Content mới là thứ được component hóa.

```
[Content] Transaction from/to (COMPONENT)
  ├── From row
  ├── Arrow
  └── To row

Contract card (COMPONENT_SET)
  variants:
    - Status=Pending     ← có CTA button
    - Status=Active      ← chỉ badge
    - Status=Complete    ← chỉ badge
```

**Rules:**
- Naming: `[Content] Descriptor` hoặc tên mô tả (`Contract card`)
- Content PHẢI nằm trong Slot của Section — không bao giờ "trần" ngoài Section
- Variant property = điểm khác biệt giữa các states
- Nội dung bên trong dùng sub-components (Provider logo, Badge, divider...)
- Content KHÔNG biết nó nằm trong section nào — độc lập
- Componentize content TRƯỚC section (bottom-up)

### Tầng 4: Atomic components (COMPONENT_SET)

Smallest reusable pieces: Badge, Button, Divider, Icon...

```
Badge - Contract status (COMPONENT_SET)
  variants:
    - Status=Waiting for checkout
    - Status=Active
    - Status=Expired
```

**Rules:**
- Naming: mô tả chức năng + context (`Badge - Contract status`)
- Variant property = visual state
- Dùng design tokens (variables) cho color, spacing
- Không hardcode values

## Workflow: Restructure 1 screen

### Phase 1: Audit (đọc, không sửa)

```
Step 1: get_metadata → đọc full layer tree
Step 2: Phân loại mỗi node:
        - Đã là instance/component? → giữ nguyên
        - Frame có tên generic (Frame 123)? → cần rename
        - Frame có siblings giống structure? → variant candidate
        - Frame là wrapper thừa (1 child, no visual)? → flatten candidate
        - Frame là container cho list items? → section candidate
Step 3: get_screenshot → lưu visual "trước"
```

### Phase 2: Bottom-up componentize

Làm từ nhỏ → lớn. KHÔNG bao giờ làm ngược.

```
Step 4: Atomic components
        - Tìm badges, buttons, dividers chưa là component
        - Convert → ComponentSet với variants
        - Đặt bên ngoài screen

Step 5: Card / Content blocks
        - Tìm các frame siblings có structure giống nhau (>70% match)
        - Detect variant property (điểm khác biệt)
        - Convert → ComponentSet với variants
        - Đặt bên ngoài screen
        - Trong screen, replace frames bằng instances

Step 6: Section
        - Tìm các frame chứa list of cards/content
        - Tạo [Section] ComponentSet:
          - Variant Layout=Default: frame + Slot bên trong
          - Variant Layout=Empty: empty state
        - Đặt bên ngoài screen
        - Trong screen, replace frame bằng instance
        - Drop card instances vào Slot

Step 7: Screen
        - Convert screen frame → Component
        - Thêm Slot property cho Toast wrapper
        - Verify mọi child là instance hoặc slot
```

### Phase 3: Verify

```
Step 8: get_screenshot → so sánh visual "sau" với "trước"
Step 9: get_metadata → verify structure matches hierarchy chuẩn:
        - Screen = COMPONENT
        - Sections = instances (từ ComponentSet bên ngoài)
        - Cards = instances (từ ComponentSet bên ngoài)
        - No generic names (Frame xxx, Group xxx)
        - No redundant wrappers
Step 10: Check ComponentSets bên ngoài:
         - Mỗi set có variants hợp lý
         - Naming convention đúng
         - Đặt gọn gàng bên cạnh screen
```

## Variant Detection Algorithm

Khi nào 2+ frames nên là variants của cùng 1 ComponentSet:

```
INPUT: Array of sibling frames
OUTPUT: Groups of variant candidates + variant property name

1. STRUCTURE MATCH (>70%):
   - So sánh children count
   - So sánh children types (FRAME, INSTANCE, TEXT...)
   - So sánh children names
   → similarity_score = matching_children / total_children

2. VISUAL MATCH (>90%):
   - So sánh fills, strokes, effects
   - So sánh cornerRadius, padding, layoutMode
   - So sánh width, height
   → visual_score = matching_props / total_props

3. DETECT VARIANT PROPERTY:
   - Tìm children có mặt trong 1 frame nhưng thiếu/khác trong frame kia
   - Ví dụ: Frame A có "Continue button", Frame B không
     → Variant property = "Status" (Pending vs Active)
   - Ví dụ: Frame A badge="Expired", Frame B badge="Active"
     → Variant property = "Type" (Expired vs Active)

4. NAMING:
   - Variant property = danh từ mô tả sự khác biệt
   - Variant values = tính từ/trạng thái
   - Ví dụ: Status=Pending, Type=Motorbike, Layout=Default, Delete=True
```

## Naming Convention

| Tầng | Format | Ví dụ |
|------|--------|-------|
| Screen | `[Screen] Tên tiếng Việt` | `[Screen] Hợp đồng` |
| Section | `[Section] Tên section` | `[Section] Contract listing` |
| Content | `[Content] Tên block` | `[Content] Vehicle info` |
| Modal | `[Modal] Tên modal` | `[Modal] Delete confirmation` |
| Card | `Tên card` | `Contract card` |
| Badge | `Badge - Context` | `Badge - Contract status` |
| Slot | `Tên slot` | `Card slot`, `Toast wrapper` |
| Variant | `Property=Value` | `Status=Pending`, `Layout=Empty` |

## Component Placement

```
Page layout (cùng page):

  ┌─────────────────┐  ┌──────────────────────────┐
  │ [Screen] Hợp đồng │  │ Components (bên phải)     │
  │                 │  │                          │
  │  Section_Header │  │ [Section] Contract listing│
  │  Tab            │  │  ├ Layout=Default         │
  │  [Section]...   │  │  └ Layout=Empty           │
  │  Bottom nav     │  │                          │
  │  Toast wrapper  │  │ Contract card             │
  │                 │  │  ├ Status=Pending          │
  │                 │  │  ├ Status=Active           │
  │                 │  │  └ Status=Complete         │
  │                 │  │                          │
  │                 │  │ Badge - Contract status    │
  │                 │  │  ├ Status=Active           │
  │                 │  │  └ Status=Expired          │
  └─────────────────┘  └──────────────────────────┘
```

- Components đặt bên phải screen, cách 100px
- Xếp theo tầng: Section → Card → Atomic (từ trên xuống)
- Mỗi ComponentSet cách nhau 40px vertical

## use_figma Execution Order

Khi dùng MCP `use_figma` để restructure:

```
Call 1:  get_metadata → đọc tree
Call 2:  get_screenshot → lưu "before"
Call 3:  use_figma → backup (duplicate screen)
Call 4:  use_figma → inspect properties (fills, layout, children) của candidates
Call 5:  use_figma → create atomic ComponentSets + move outside
Call 6:  use_figma → create card ComponentSets + move outside
Call 7:  use_figma → create section ComponentSets (with Slot) + move outside
Call 8:  use_figma → replace frames in screen with instances
Call 9:  use_figma → convert screen frame → Component, add Slot props
Call 10: get_screenshot → verify visual
Call 11: get_metadata → verify structure
```

**Rule: 1 call = 1 việc. Không gộp. Verify sau mỗi bước quan trọng.**

## Checklist cuối cùng

- [ ] Screen là COMPONENT
- [ ] Screen VERTICAL auto-layout, children FILL horizontal
- [ ] Không có Content/Group wrapper ở layer 1
- [ ] Mọi section trong screen là INSTANCE (không phải frame rời)
- [ ] Section ComponentSets có variant Layout=Default + Layout=Empty
- [ ] Section Default variant có SLOT cho content
- [ ] Card ComponentSets có variants theo state/type
- [ ] Không còn tên generic (Frame xxx, Group xxx, Rectangle xxx)
- [ ] Không còn wrapper thừa (1 child, no visual)
- [ ] ComponentSets đặt bên ngoài screen, cùng page
- [ ] Visual trước/sau giống nhau pixel-perfect
- [ ] Design tokens (variables) được giữ nguyên qua restructure
- [ ] Tất cả instances link đúng library (không local component khi có library version)

---
Back: [[workflows/index|Workflows]]
