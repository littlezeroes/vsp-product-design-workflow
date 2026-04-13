# Sinh loi tu dong v2 — Build Summary
> Builder: Ivy | Date: 2026-03-09

## Flow Diagram

```
[Entry: /sinhloi]
  ├── S1: Product Page → CTA "Kich hoat sinh loi"
  │   └── S2: Xac nhan kich hoat → CTA "Xac nhan"
  │       └── S3: OTP → OTP dung
  │           └── S4: Ket qua dang ky
  │               ├── Thanh cong → S5: Dashboard
  │               └── That bai → S2 (Thu lai) / Home
  │
  ├── S5: Dashboard — Tab San pham (/sinhloi/(tabs))
  │   ├── "Nap tien" → S7: Nap/Rut (tab Nap)
  │   ├── "Rut tien" (so du > 0) → S7: Nap/Rut (tab Rut)
  │   ├── "Rut tien" (so du = 0) → O7: Dialog chan rut
  │   ├── Tap GD → S12: Chi tiet GD
  │   └── "Xem tat ca" → S11: Lich su GD
  │
  ├── S6: Dashboard — Tab Quan ly (/sinhloi/(tabs)/manage)
  │   ├── "Lich su giao dich" → S11
  │   ├── "Tong ket loi nhuan" → S13
  │   └── "Dieu khoan & Hop dong" → S14
  │
  ├── Nap/Rut Flow:
  │   S7 → S8: Xac nhan GD → S9: Auth PIN → S10: Ket qua GD → S5
  │
  └── Huy Flow:
      S14 → "Tat sinh loi" → S15: Xac nhan huy → S3: OTP → S16: Ket qua huy → Home
```

## Screens x Components x States

| # | Screen | Route | Components | States | Key Components |
|---|--------|-------|------------|--------|----------------|
| S1 | Product Page | `/sinhloi` | 10 | 8 | Header(large-title), Button, FeedbackState, range input |
| S2 | Xac nhan kich hoat | `/sinhloi/activate` | 9 | 7 | Header, Checkbox(x2), ItemListItem(x3), Button, Dialog |
| S3 | OTP | `/sinhloi/otp` | 5 | 9 | Header, OTP cells(x6), FeedbackState, Dialog |
| S4 | Ket qua dang ky | `/sinhloi/result-activate` | 4 | 3 | FeedbackState, Button(x2) |
| S5 | Dashboard — San pham | `/sinhloi/(tabs)` | 12 | 11 | Header(large-title+tabs), ButtonGroup, ItemListItem, BottomSheet(x3), Dialog |
| S6 | Dashboard — Quan ly | `/sinhloi/(tabs)/manage` | 5 | 3 | Header(large-title+tabs), ItemListItem(x3) |
| S7 | Nap/Rut tien | `/sinhloi/deposit-withdraw` | 11 | 10 | Header, Segmented control, Amount input, Quick chips, Button, Dialog |
| S8 | Xac nhan giao dich | `/sinhloi/confirm-tx` | 8 | 8 | Header, ItemListItem(x4), Button, FeedbackState, Dialog |
| S9 | Auth PIN/Biometric | `/sinhloi/auth` | 5 | 11 | Header, PIN dots(x6), Numpad, Dialog |
| S10 | Ket qua giao dich | `/sinhloi/result-tx/[type]` | 12 | 7 | Status icon, ItemListItem(x6), Button(x2) |
| S11 | Lich su giao dich | `/sinhloi/history` | 8 | 9 | Header, Dropdown, ItemListItem(loop), FeedbackState |
| S12 | Chi tiet giao dich | `/sinhloi/history/[id]` | 7 | 4 | Header, ItemListItem(x4), FeedbackState |
| S13 | Tong ket loi nhuan | `/sinhloi/profit` | 6 | 6 | Header, Dropdown, ItemListItem(loop) |
| S14 | Dieu khoan & Hop dong | `/sinhloi/terms` | 5 | 4 | Header, ItemListItem(x2), Button(danger) |
| S15 | Xac nhan huy | `/sinhloi/cancel` | 8 | 4 | Header, Button(x2: primary + danger), Dialog |
| S16 | Ket qua huy | `/sinhloi/result-cancel` | 6 | 2 | FeedbackState, Button(x2) |

## Overlays

| ID | Type | Trigger | Location |
|----|------|---------|----------|
| O1 | BottomSheet | Tap "Tim hieu co che" card trên S5 | S5 inline |
| O2 | BottomSheet | Tap info icon "Tien loi hom qua" trên S5 | S5 inline |
| O3 | BottomSheet | Tap info icon "Tong tien loi" trên S5 | S5 inline |
| O4 | Full Screen | Tap "Dieu khoan su dung" | `/sinhloi/terms?doc=policy` |
| O5 | Full Screen | Tap "Hop dong cho vay" | `/sinhloi/terms?doc=contract` |
| O7 | Dialog | Tap "Rut tien" khi so du = 0 | S5 inline |

## Component Inventory

| Component | Import | Usage Count |
|-----------|--------|-------------|
| Header | `@/components/ui/header` | 14 |
| Button | `@/components/ui/button` | 16+ |
| ButtonGroup | `@/components/ui/button-group` | 1 |
| ItemListItem | `@/components/ui/item-list` | 30+ |
| Checkbox | `@/components/ui/checkbox` | 2 |
| FeedbackState | `@/components/ui/feedback-state` | 8 |
| Dialog | `@/components/ui/dialog` | 7 |
| BottomSheet | `@/components/ui/bottom-sheet` | 3 |

## State Matrix

| State Category | Screens Covered | Total States |
|----------------|-----------------|--------------|
| Loading | S1, S5, S7, S8 | 4 |
| Error (API fail) | S1, S2, S5, S6, S8, S11, S12 | 7 |
| No-network | S1-S16 (Dialog) | 16 |
| Empty | S5(zero-balance), S11, S13 | 3 |
| Validation error | S7(5 types) | 5 |
| Success result | S4, S10, S16 | 3 |
| Failed result | S4, S10, S16 | 3 |
| Processing result | S10 | 1 |
| Balance hidden/visible | S5 | 2 |
| PIN states | S9(empty, entering, wrong x3, locked) | 6 |
| OTP states | S3(sent, entering, wrong, expired, api-error) | 5 |

**Total unique states rendered in /sinhloi/states: 45+**

## URLs

| URL | Description |
|-----|-------------|
| `/sinhloi` | S1: Product Page (entry) |
| `/sinhloi/activate` | S2: Xac nhan kich hoat |
| `/sinhloi/otp?context=activate` | S3: OTP (kich hoat) |
| `/sinhloi/otp?context=cancel` | S3: OTP (huy) |
| `/sinhloi/result-activate?status=success` | S4: Ket qua (thanh cong) |
| `/sinhloi/result-activate?status=failed` | S4: Ket qua (that bai) |
| `/sinhloi/(tabs)` | S5: Dashboard — Tab San pham |
| `/sinhloi/(tabs)/manage` | S6: Dashboard — Tab Quan ly |
| `/sinhloi/deposit-withdraw?tab=deposit` | S7: Nap tien |
| `/sinhloi/deposit-withdraw?tab=withdraw` | S7: Rut tien |
| `/sinhloi/confirm-tx?type=deposit&amount=X` | S8: Xac nhan GD nap |
| `/sinhloi/confirm-tx?type=withdraw&amount=X` | S8: Xac nhan GD rut |
| `/sinhloi/auth?type=deposit&amount=X` | S9: Auth PIN |
| `/sinhloi/result-tx/deposit?amount=X&status=success` | S10: Ket qua GD nap |
| `/sinhloi/result-tx/withdraw?amount=X&status=failed` | S10: Ket qua GD rut |
| `/sinhloi/history` | S11: Lich su giao dich |
| `/sinhloi/history/t1` | S12: Chi tiet giao dich |
| `/sinhloi/profit` | S13: Tong ket loi nhuan |
| `/sinhloi/terms` | S14: Dieu khoan & Hop dong |
| `/sinhloi/terms?doc=policy` | O4: Dieu khoan su dung |
| `/sinhloi/terms?doc=contract` | O5: Hop dong cho vay |
| `/sinhloi/cancel` | S15: Xac nhan huy |
| `/sinhloi/result-cancel?status=success` | S16: Ket qua huy (thanh cong) |
| `/sinhloi/result-cancel?status=failed` | S16: Ket qua huy (that bai) |
| `/sinhloi/states` | All states rendered |

## Build Status
- **Build:** PASS
- **TypeScript:** No errors
- **Routes:** 16 pages + 1 states page = 17 routes
- **Mock data:** Vietnamese realistic (VND amounts, names, phone numbers)

---
Back: [[features/index|Features]] · [[features/sinhloi-v2/status|sinhloi-v2]]
