# Figma Dedup Report — V-Smart Pay v1.0 (Copy)
**File:** `AKgeX1Cp6bNY00QGZwoR1g`
**Date:** 2026-03-29

## Summary

| Metric | Count |
|--------|-------|
| **ComponentSets created** | **22** |
| **Total variants** | **~140** |
| **Screens merged** | **~140 → 22 sets** |
| **True duplicates deleted** | 1 |
| Pages processed | 10 |

## ComponentSets Created

### eKYC page (8 sets, 32 variants)
| ComponentSet | Variants |
|---|---|
| Edit Information | 10 (Form Empty → Form Complete flow) |
| NFC/Unknown | 4 (Intro → Scanning → Modal → Success) |
| NFC/Android | 4 (same pattern) |
| eKYC Onboard | 4 |
| Face Capture Screen | 3 (Default / Error / Detail) |
| eKYC Screen | 3 |
| NFC/iPhone | 2 (Error / Scanning) |
| NFC/iPhone Modal | 2 (Scanning / Success) + 1 duplicate deleted |

### Nạp/Rút tiền (1 set, 4 variants)
| ComponentSet | Variants |
|---|---|
| Thanh toán thành công | 4 (Minimal / Default / With Detail / Full) |

### Chuyển tiền (1 set, 7 variants)
| ComponentSet | Variants |
|---|---|
| Chuyển tiền | 7 states |

### Lịch sử GD (3 sets, 30 variants)
| ComponentSet | Variants |
|---|---|
| History/Default | 14 states |
| Thanh toán thành công | 12 states |
| History/Search | 4 states |

### Liên kết NH (3 sets, 16 variants)
| ComponentSet | Variants |
|---|---|
| Link bank account / chi tiết | 8 states |
| Topup | 6 states |
| Liên kết thẻ - napas | 2 states |

### Quản lý TK (2 sets, 13 variants)
| ComponentSet | Variants |
|---|---|
| Link bank account / chọn ngân hàng | 10 states |
| dialog | 3 states |

### Thanh toán QR (3 sets, 28 variants)
| ComponentSet | Variants |
|---|---|
| My Qr | 18 states |
| Scan Qr | 6 states |
| Payment Code/Phase 2 | 4 states |

### Trang chủ (2 sets, 9 variants)
| ComponentSet | Variants |
|---|---|
| Demo | 6 states |
| chi tiết tài khoản | 3 states |

## Pages with NO duplicates (clean)
- Xác thực GD
- Account/Profile
- Help center
- Nạp tiền ĐT
- Đăng nhập thiết bị mới
- Notification
- Payment hub

## Variant Naming
All variants currently named `State=1`, `State=2`, etc.
**Action needed:** Review each ComponentSet in Figma and rename variants to semantic names (e.g., `State=Empty`, `State=Filled`, `State=Error`).

## Method
- `figma.combineAsVariants([comp1, comp2, ...], parent)` — zero-copy merge
- Screenshot comparison for state classification (eKYC group)
- Text fingerprinting for duplicate detection
- ~15 MCP calls for all merges

---
Back: [[Home]]
