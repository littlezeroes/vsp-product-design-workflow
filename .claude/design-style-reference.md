# V-Smart Pay/Save — Design Style Reference

Source: V-Smart-Save Figma (file `IjKFkmh6cvBQCwsCeD0iiz`), nodes 40019066:15336 + 40019066:15525. Screenshots trong conversation history 2026-04-19.

## 2 patterns gốc

### Pattern A — Receipt / Detail screens (Chi tiết giao dịch)
*Khi: transaction result, account detail, history detail.*

```
┌────────────────────────────────┐
│ < · Chi tiết giao dịch · [⌂] │ ← NavBar (back + title + home icon)
├────────────────────────────────┤
│                                │
│      [guilloche pattern bg]    │ ← Subtle rosette/security pattern overlay
│        [wallet icon 32px]      │
│                                │
│   Nạp tiền vào {productName}   │ ← Subtitle 14-16px regular
│                                │
│       +1.000.000 ₫             │ ← Amount 36-40px BOLD GREEN
│                                │
│        ✓ Thành công            │ ← Status mini: green dot + 14px
├────────────────────────────────┤
│  [V] NGUYEN DUC THIEN          │ ← Source card (flow visualization)
│      Ví V-Smart Pay│***2321    │
│           ↓                     │
│  [●] {productName}             │ ← Target
├────────────────────────────────┤
│  Mã giao dịch   {{id}}  [copy] │ ← Detail list (key-value rows)
│  Thời gian      hh:mm • dd/mm  │
│  Số tiền        {{amt}}        │
│  Phí dịch vụ    Miễn phí       │
├────────────────────────────────┤
│  [🎧] Gửi yêu cầu hỗ trợ    > │ ← Action row card
├────────────────────────────────┤
│                                │
│       [Nạp thêm]               │ ← Primary CTA, pill
│            ─                   │ ← Home indicator
└────────────────────────────────┘
```

### Pattern B — Registration form (Đăng ký)
*Khi: consent + review step before commit.*

```
┌────────────────────────────────┐
│ < · Đăng ký {productName}      │
├────────────────────────────────┤
│  ┌────────────────────────┐   │ ← Product card white, subtle border
│  │ Sản phẩm tham gia       │   │
│  │ {productName}      [□] │   │ ← Product image right
│  └────────────────────────┘   │
├────────────────────────────────┤
│  Thông tin khách hàng          │ ← Section title 16px bold
│                                │
│  Họ và tên      Kiều Mạnh Huy  │ ← Key-value row
│  Số điện thoại  029932883       │
├────────────────────────────────┤
│  Tóm tắt sản phẩm              │
│                                │
│  Sinh lời lên đến  %d%/năm     │ ← Value GREEN (accent)
│  Số dư tối đa      {amount} đ  │
│  Rút tiền          Tức thì     │
├────────────────────────────────┤
│  ☐ Tôi xác nhận ... CHÍNH SÁCH │ ← Checkbox + consent text với
│    QUYỀN RIÊNG TƯ của V-Smart  │   GREEN UNDERLINED links
│  ☐ Tôi đã đọc ... HỢP ĐỒNG     │
│    HỢP TÁC                      │
├────────────────────────────────┤
│       [Đăng ký]                │ ← Disabled gray pill until both ✓
│            ─                   │
└────────────────────────────────┘
```

## Style rules đã extract

### 1. Màu
- **Background**: bg-background (white)
- **Card**: bg-white với subtle shadow hoặc border `rounded-28`
- **Success accent**: GREEN `text-success` (#00b182) cho amount dương, rate %, link text
- **Destructive**: chỉ dùng cho error, không dùng cho neutral info
- **No gradient hero** ở detail/form screens — gradient dành cho "moment" screens (approved reveal)

### 2. Typography
| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Amount hero | 36-40px | 800 (black) | text-success khi positive |
| Page title (NavBar) | 18px | 700 | text-foreground |
| Section title | 16px | 700 | text-foreground |
| Row label | 14-15px | 400 | text-foreground-secondary |
| Row value | 14-15px | 600 | text-foreground |
| Link text (inline) | inherit | 500 + underline | text-success |
| Status mini | 14px | 500 | text-foreground-secondary |
| Button label | 16px | 600 | text-background (on primary) |

### 3. Layout
- **Section cards**: lề ngoài 22px, padding nội dung 12px, dùng `bg-secondary rounded-28` hoặc `bg-background rounded-28`; smooth corner theo treatment 60% của dự án.
- **Section spacing**: 24-32px giữa các section
- **Row gaps trong card**: 12px hoặc divider `border-b border-border` tuỳ density
- **Alignment**: theo cấp nội dung trong `.claude/design-tokens-reference.md`: chữ cấp màn hình và thông tin ví chủ đạo ở x=22; các card service/quà/trải nghiệm/ưu đãi có hệ căn nội bộ riêng. Card thường lề ngoài 22px, padding trong 12px; không ép text card con ra trục màn hình.
- **FixedBottom**: black pill button, disabled = `bg-disabled-bg text-disabled-fg`
- **Home indicator**: `w-[139px] h-[5px] rounded-full bg-foreground` trong FixedBottom

### 4. Icon treatment
- **Monochrome stroke icons** — Lucide icons mặc định, no fill colors
- **Avatar/logo circles**:
  - V logo = black circle bg-foreground + white "V" letter
  - Product icon = checkered pattern hoặc placeholder
  - Contact avatar = 44×44 bg-secondary + initial
- **Support/utility icon**: headphone, info, question trong 44px rounded-full bg

### 5. Visualization patterns
- **Transaction flow**: source card → down arrow (↓) → target card. Avatar 44px + label/meta 2 dòng.
- **Key-value list**: left label muted + right value bold. Right-aligned value.
- **Guilloche background** (optional on receipt): subtle radial rosette SVG pattern, opacity ~8-12%, behind hero content. Chỉ dùng khi muốn cảm giác "certificate/bill".

### 6. Consent pattern
- Checkbox 24×24 left
- Text 13-14px regular với **GREEN UNDERLINED** keywords cho chính sách / hợp đồng
- 2 checkbox tách biệt (data sharing vs T&C) — compliance rule
- CTA disabled until BOTH checked

### 7. States
| State | Button bg | Button text |
|-------|-----------|-------------|
| Enabled | bg-foreground | text-background |
| Disabled | bg-disabled-bg (light gray) | text-disabled-fg (dark gray) |
| Loading | bg-foreground | spinner center |

## Khi nào dùng pattern nào

| Pattern | Dùng cho |
|---------|----------|
| **A (Receipt)** | S8 checkout result, S10 loan detail header, transaction history detail |
| **B (Registration)** | S3 info (form + consent), S4 contract review, Registration flow |
| **Hero gradient** | S1 teaser (pre-approved reveal), S5 approved (celebration moment) |
| **Dashboard with ring** | S9 dashboard |

## Don't
- ❌ Gradient hero trên receipt/detail screens — làm mất cảm giác "document/bill"
- ❌ Color icon (full-color illustrations) — chỉ dùng monochrome
- ❌ Center-aligned body text nhiều hơn 2-3 dòng — key-value rows luôn right-aligned value
- ❌ Link color != success green — consistency với brand
- ❌ Button radius < rounded-full — VSP pattern là pill
