# Screen Breakdown — VAS Payment Redesign
> Designer: Vi (AI) | Date: 2026-03-09
> Based on: flow.md + BRD Design Brief + VSP v1.0 Figma

---

## Screen V1: VAS Home
- **Route:** `/vas/`
- **Type:** Dashboard / Category Grid
- **UI Ref:** MoMo — service grid + saved items
- **Reuse from:** NEW (redesign from scratch)

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="large-title", largeTitle="Dịch vụ", leftIcon=ChevronLeft | |
| Search bar | — | TextField placeholder="Tìm dịch vụ" — filter across categories |
| Section "Đã lưu" | — | Horizontal scroll: saved billers + saved SĐT. Max 5 visible + "Xem tất cả" |
| Section "Danh mục" | — | 2-column grid: Điện, Nước, Internet & Truyền hình, Di động, Tài chính & Bảo hiểm, Khác |
| Category card | — | Icon + label, bg-secondary rounded-[28px], tap → sub-flow |

**States:**

| State | Trigger | UI Change |
|-------|---------|-----------|
| loaded | Default | Grid + saved items |
| empty-saved | Chưa lưu gì | Section "Đã lưu" ẩn |
| loading | Init | Skeleton grid |
| search-active | Tap search | Full-screen search with results cross-category |
| search-empty | No results | "Không tìm thấy dịch vụ" |

**Transitions:**
- Tap category → V2/V3/V4/V9/V10
- Tap saved item → pre-filled flow (Flow 4)
- Tap "Quản lý" → V6
- Back → Home

---

## Screen V2: Chọn danh mục dịch vụ (Hóa đơn)
- **Route:** `/vas/bill/`
- **Type:** List
- **Reuse from:** Thanh toán hóa đơn `40002431:144546`

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="large-title", largeTitle="Thanh toán hóa đơn", leftIcon=ChevronLeft | |
| Sub-category list | — | ItemList: Điện, Nước, Internet, Truyền hình — each with icon + chevron |

**States:**
| State | UI |
|-------|----|
| loaded | Sub-category list |

**Transitions:**
- Tap sub-category → V2a (NCC selector)
- Back → V1

---

## Screen V2a: Chọn nhà cung cấp
- **Route:** `/vas/bill/provider/`
- **Type:** List + Search
- **UI Ref:** ZaloPay — grouped provider list
- **Reuse from:** NEW

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="default", title="Chọn nhà cung cấp", leftIcon=ChevronLeft | |
| TextField (search) | placeholder="Tìm nhà cung cấp" | Filter list |
| Section per region | — | "TP. Hồ Chí Minh", "Hà Nội", etc. — for Điện/Nước |
| ItemListItem | prefix={ProviderLogo}, label="EVN HCMC", showChevron | |

**BRD note:** Điện/Nước grouped by tỉnh/TP. Gợi ý tỉnh/TP dựa trên location permission.

**States:**
| State | UI |
|-------|----|
| loaded | Provider list grouped by region |
| search-active | Filtered results |
| search-empty | "Không tìm thấy" |
| location-suggest | Auto-highlight user's region |

**Transitions:**
- Tap provider → V2b (nhập mã KH)
- Back → V2

---

## Screen V2b: Nhập thông tin khách hàng
- **Route:** `/vas/bill/input/`
- **Type:** Form
- **UI Ref:** Cash App — single focus
- **Reuse from:** REFRESH existing `40002431:144546`

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="default", title={providerName}, leftIcon=ChevronLeft | Dynamic title |
| Provider card | — | Logo + name, bg-secondary rounded-[14px] |
| TextField | label="Mã khách hàng", placeholder="Nhập mã khách hàng" | |
| Link "Xem hướng dẫn" | — | BRD: mỗi màn nhập cần có. Load content theo provider |
| Button | variant="primary", size="48", fullWidth | "Tra cứu" |

**States:**
| State | UI |
|-------|----|
| empty | Input empty, button disabled |
| typing | Input has text |
| valid | Button enabled |
| loading | Button loading, fetching bill |
| error-not-found | "Không tìm thấy hóa đơn" |
| error-network | Dialog retry |
| bill-found | Navigate → V2c (bill detail) or show inline |

**Transitions:**
- "Tra cứu" → fetch bill → V5 confirm (if bill found)
- "Xem hướng dẫn" → BottomSheet with provider-specific guide
- Back → V2a

---

## Screen V3: Nạp tiền điện thoại
- **Route:** `/vas/topup/`
- **Type:** Form
- **UI Ref:** Cash App — amount focus
- **Reuse from:** REFRESH `40002305:67696`

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="default", title="Nạp tiền điện thoại", leftIcon=ChevronLeft | |
| Section "SĐT đã lưu" | — | Horizontal scroll saved numbers |
| TextField | label="Số điện thoại", inputMode="tel" | Auto-detect carrier on 3+ digits |
| Carrier badge | — | Logo nhà mạng auto-detected |
| Denomination chips | — | 10K, 20K, 50K, 100K, 200K, 500K — pill style |
| Button | variant="primary", size="48", fullWidth | "Tiếp tục" |

**States:**
| State | UI |
|-------|----|
| empty | SĐT empty, chips unselected |
| typing | SĐT input, carrier detecting |
| carrier-detected | Carrier logo shown |
| amount-selected | Chip active, button enabled |
| loading | Button loading |
| error-invalid-phone | "Số điện thoại không hợp lệ" |

**Transitions:**
- "Tiếp tục" → V5 (confirm)
- Tap saved SĐT → pre-fill
- Back → V1

---

## Screen V4: Mua thẻ cao
- **Route:** `/vas/card/`
- **Type:** Form
- **Reuse from:** Clone V3 pattern

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="default", title="Mua thẻ cao", leftIcon=ChevronLeft | |
| Carrier selector | — | Grid 2x3: Viettel, Mobi, Vina, VNMobile, Reddi, Itel |
| Denomination chips | — | Same as V3 |
| Quantity selector | — | Stepper 1-5 |
| Button | variant="primary", size="48", fullWidth | "Tiếp tục" |

**States:**
| State | UI |
|-------|----|
| empty | No carrier selected |
| carrier-selected | Carrier highlighted, show chips |
| amount-selected | Chip active |
| loading | Button loading |

**Transitions:**
- "Tiếp tục" → V5 (confirm)
- Back → V1

---

## Screen V5: Xác nhận thanh toán (SHARED)
- **Route:** `/vas/confirm/`
- **Type:** Confirmation
- **UI Ref:** Payment Hub pattern `40009143:10433`
- **Reuse from:** REFRESH — shared across all VAS flows

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="default", title="Xác thực thanh toán", leftIcon=X (close) | X close, not back |
| Provider info | — | Logo + name + mã KH |
| Amount | — | text-[28px] font-bold centered |
| Detail rows | — | ItemList: Nhà cung cấp, Mã KH, Phí DV, dynamic per flow |
| Section "Nguồn thanh toán" | — | Horizontal scroll: "Ví V-Smart Pay XXX,XXXđ" (selected), "Thêm liên kết" |
| Button | variant="primary", size="48", fullWidth | "Xác thực giao dịch" |

**Figma note:** Payment Hub shows this exact pattern — amount top, detail rows, payment source selector bottom, CTA.

**States:**
| State | UI |
|-------|----|
| default | Full confirm view |
| insufficient-balance | Nguồn TT badge "Không đủ số dư" |
| loading | Button loading |

**Transitions:**
- "Xác thực giao dịch" → Auth screen (existing `40004769:73935`)
- Auth success → Result (existing `40013468:41558`)
- X close → Dialog "Bạn có chắc muốn hủy?" → back to form

---

## Screen V6: Quản lý đã lưu
- **Route:** `/vas/saved/`
- **Type:** Tabbed List
- **Reuse from:** NEW

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="large-title", largeTitle="Quản lý", leftIcon=ChevronLeft | |
| Tab bar | — | "Hóa đơn" | "Số điện thoại" — pill toggle |
| ItemList | — | Grouped by service type |
| ItemListItem | prefix={icon}, label, sublabel, showChevron | Each saved biller |
| FeedbackState | — | Empty state per tab |

**States:**
| State | UI |
|-------|----|
| bill-tab | Hóa đơn list grouped |
| phone-tab | SĐT list |
| empty-bill | "Chưa lưu hóa đơn nào" |
| empty-phone | "Chưa lưu số điện thoại nào" |

**Transitions:**
- Tap item → V7 (detail)
- Back → V1

---

## Screen V7: Chi tiết đã lưu
- **Route:** `/vas/saved/[id]/`
- **Type:** Detail
- **Reuse from:** NEW

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="default", title="Chi tiết", leftIcon=ChevronLeft | |
| Provider card | — | Logo + name + mã KH |
| Detail rows | — | ItemList: nhà cung cấp, mã KH, loại DV |
| Auto-pay toggle | — | Toggle "Thanh toán tự động" → V8 if on |
| Button | variant="primary", size="48", fullWidth | "Thanh toán ngay" |
| Button | variant="secondary", intent="danger" | "Xóa" |

**States:**
| State | UI |
|-------|----|
| loaded | Detail + actions |
| auto-pay-on | Toggle on, show config summary |
| auto-pay-off | Toggle off |
| confirm-delete | Dialog "Xóa hóa đơn đã lưu?" |

**Transitions:**
- "Thanh toán ngay" → pre-filled flow (V2b or V3)
- Toggle on → V8 (auto-pay config)
- "Xóa" → confirm → back to V6
- Back → V6

---

## Screen V8: Cài đặt thanh toán tự động
- **Route:** `/vas/saved/[id]/auto-pay/`
- **Type:** Config Form
- **Reuse from:** NEW (shared pattern with SBH/Vapp)

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="default", title="Thanh toán tự động", leftIcon=ChevronLeft | |
| Provider info | — | Logo + name + mã KH |
| Date picker | — | "Ngày thanh toán" — 01 đến 28. BottomSheet picker |
| Payment source | — | "Nguồn tiền" — drag-to-reorder list (Phase 2) or single select (Phase 1) |
| Button | variant="primary", size="48", fullWidth | "Kích hoạt" |

**States:**
| State | UI |
|-------|----|
| config | Date + source selection |
| loading | Button loading → auth |
| active | BottomSheet "Đã kích hoạt!" + summary |
| deactivate-confirm | Dialog "Tắt thanh toán tự động?" |

**Transitions:**
- "Kích hoạt" → Auth → active
- Back → V7

---

## Screen V9: Mua gói data
- **Route:** `/vas/data/`
- **Type:** Form + Grid
- **Reuse from:** NEW

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="default", title="Mua gói data", leftIcon=ChevronLeft | |
| TextField | label="Số điện thoại", inputMode="tel" | Auto-detect carrier |
| Carrier badge | — | Like V3 |
| Section "Gói data" | — | 2-column grid: each card = dung lượng + giá + thời hạn |
| Data package card | — | "3GB 30 ngày 30.000đ" — bg-secondary rounded-[28px] |
| Button | variant="primary", size="48", fullWidth | "Tiếp tục" |

**States:**
| State | UI |
|-------|----|
| empty | SĐT empty |
| carrier-detected | Show data packages for carrier |
| package-selected | Card highlighted, button enabled |
| loading | Button loading |

**Transitions:**
- "Tiếp tục" → V5 (confirm)
- Back → V1

---

## Screen V10: Thanh toán tài chính
- **Route:** `/vas/finance/`
- **Type:** List → Form
- **Reuse from:** NEW

**Components (provider list):**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="large-title", largeTitle="Tài chính", leftIcon=ChevronLeft | |
| ItemList | — | 12 providers: ACS, FE Credit, Home Credit, Mcredit, Miraeasset, OCB, Shinhan Finance, TPFICO, PTFINANCE, Lotte Finance, FCCOM, SHBFINANCE |
| ItemListItem | prefix={logo}, label={name}, showChevron | |

---

## Screen V10a: Nhập định danh tài chính
- **Route:** `/vas/finance/[provider]/`
- **Type:** Form
- **Reuse from:** NEW (dynamic input per provider)

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="default", title={providerName}, leftIcon=ChevronLeft | |
| Provider card | — | Logo + name |
| TextField(s) | — | Dynamic per provider. Some accept 1 input, some accept multiple (mã HĐ OR CCCD) |
| Input type selector | — | Nếu provider chấp nhận nhiều loại: SegmentedControl "Mã hợp đồng" | "CCCD" |
| Button | variant="primary", size="48", fullWidth | "Tra cứu" |

**BRD note:** FE Credit, OCB, TPFICO, PTFINANCE, FCCOM chấp nhận nhiều loại định danh.

**States:**
| State | UI |
|-------|----|
| empty | Input empty |
| typing | Validating |
| loading | Fetching loan info |
| found | Show loan detail → V5 confirm |
| not-found | "Không tìm thấy khoản vay" |

**Transitions:**
- "Tra cứu" → fetch → V5 (confirm)
- Back → V10

---

## Screen V11: Lịch sử GD VAS
- **Route:** `/vas/history/`
- **Type:** List
- **Reuse from:** Clone from bidv-link/transactions pattern

**Components:**

| Component | Props | Notes |
|-----------|-------|-------|
| Header | variant="large-title", largeTitle="Lịch sử giao dịch", leftIcon=ChevronLeft | |
| Filter chips | — | "Tất cả", "Điện/Nước", "Di động", "Thẻ cao", "Tài chính" |
| Transaction list | — | Grouped by date, colored amounts, status pills |

**States:** Same as bidv-link transactions

---

## Summary

| Screen | Type | Action | Priority |
|--------|------|--------|----------|
| V1: VAS Home | Dashboard | REDESIGN | P0 |
| V2: Danh mục hóa đơn | List | REFRESH | P0 |
| V2a: Chọn NCC | List + Search | NEW | P0 |
| V2b: Nhập mã KH | Form | REFRESH | P0 |
| V3: Nạp tiền ĐT | Form | REFRESH | P0 |
| V4: Mua thẻ cao | Form | REFRESH | P1 |
| V5: Xác nhận TT | Confirm | REFRESH (shared) | P0 |
| V6: Quản lý đã lưu | Tabbed List | NEW | P1 |
| V7: Chi tiết đã lưu | Detail | NEW | P1 |
| V8: Auto-pay config | Config Form | NEW | P1 |
| V9: Mua gói data | Form + Grid | NEW | P1 |
| V10: TT Tài chính | List | NEW | P1 |
| V10a: Nhập định danh | Form | NEW | P1 |
| V11: Lịch sử GD VAS | List | CLONE | P2 |
| Auth | Auth | REUSE | — |
| Result | Result | REUSE | — |

**Totals:**
- New screens: 14 (V1-V11 + V2a/V2b/V10a)
- Reuse from existing: 2 (Auth + Result)
- P0: 5 screens (core bill + topup flows)
- P1: 7 screens (new features)
- P2: 1 screen (history clone)
- Estimated states: ~80+

---
Back: [[features/index|Features]] · [[features/vas-payment/status|vas-payment]]
