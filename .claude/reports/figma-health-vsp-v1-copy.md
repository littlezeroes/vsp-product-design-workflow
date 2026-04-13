# Figma Design Health Report
**File:** `-MVP- V-Smart Pay v1.0 (Copy)`
**Key:** `AKgeX1Cp6bNY00QGZwoR1g`
**Date:** 2026-03-29
**Total pages:** 50+

## Summary

| Metric | Count |
|--------|-------|
| Pages with content | ~35 |
| Pages with issues | ~15 |
| Screen-as-FRAME (should be COMPONENT) | ~30+ |
| Generic names (Frame N, Group N) | ~10+ |
| SECTIONs (OK, no fix needed) | ~25 |

## Issue Breakdown by Page

### Priority HIGH (>5 FRAME screens)

| Page | FRAME screens | Generic names | Notes |
|---|---|---|---|
| eKYC (Chụp CCCD) | ~15 | 1 | 69 total nodes, very messy. Multiple `screen`, `loadingFrame`, `Face Capture` FRAMEs |
| V-App → VSP | ~5 | 0 | 30+ nodes, lots of reference images mixed with screens |
| V-App → VSP (suggest improve) | ~8 | 0 | 4x `Demo` FRAMEs, 2x `Hero image` FRAMEs |

### Priority MED (1-5 FRAME screens)

| Page | FRAME screens | Generic names | Notes |
|---|---|---|---|
| Đăng nhập / Đăng ký | 2 | 0 | `Footer` FRAME, `Profile/Language` FRAME |
| Splashscreen | 1 | 0 | `[Splashscreen]` is FRAME |
| Thanh toán hóa đơn | 2 | 0 | `Thanh toán thành công`, `Lưu hóa đơn` FRAMEs |
| TT hóa đơn 1/2026 | 1 | 0 | `bill payment` FRAME |
| Loading | 1 | 0 | `Loading` FRAME |

### Priority LOW (clean / no issues)

| Page | Status |
|---|---|
| Trang chủ | Clean (SECTIONs only) |
| Payment hub | Clean |
| Chuyển tiền | Clean |
| Xác thực GD | Clean |
| Quản lý TK liên kết | Clean |
| Lịch sử GD | Clean |
| Thanh toán & Nhận tiền | Clean |
| Notification | Clean |
| Account/Profile | Clean |
| Help center | Clean |
| Nạp tiền ĐT | Clean |

## Restructure Plan

### Phase 1: eKYC page (highest impact)
- Convert 15 FRAME screens → COMPONENT
- Rename generic `screen` → `[Screen] eKYC Step N`
- Rename `loadingFrame` → `[Screen] eKYC Loading`
- Rename `Group 11929` → semantic name
- Estimated MCP calls: ~60

### Phase 2: V-App → VSP pages
- Convert Demo FRAMEs → COMPONENT
- Clean up reference images
- Estimated MCP calls: ~30

### Phase 3: Remaining MED pages
- Convert individual FRAME screens → COMPONENT
- Estimated MCP calls: ~20

### Total estimated: ~110 MCP calls across 3 phases

## Rate Limit Consideration
- Current plan: View seat on Starter → 6 calls/month (!!!)
- OR: Full/Dev seat on Pro/Org → 200 calls/day
- With 200/day: Phase 1 in 1 night, all phases in 2 nights
- With 6/month: Cannot auto-restructure, need manual or local approach

## Execution Log — Auto Research Pass 1 (2026-03-29)

### Account: `v.huykm@vinsmartfuture.tech` — Full seat, Org tier (200 calls/day)

### Conversions completed: 27 FRAME → COMPONENT

#### eKYC page (14 screens)
| Old ID | New ID | Name | Status |
|---|---|---|---|
| 40002401:10951 | 40026015:10007 | Face Capture Screen | OK |
| 40002303:54396 | 40026015:10008 | [Screen] eKYC Step 1 | OK + renamed |
| 40002402:9729 | 40026015:10009 | [Screen] eKYC Step 2 | OK + renamed |
| 40002537:48689 | 40026015:10010 | [Screen] eKYC Step 3 | OK + renamed |
| 40002537:48620 | 40026015:10011 | [Screen] eKYC Loading 1 | OK + renamed |
| 40002401:11442 | 40026015:10012 | Face Capture Screen | OK |
| 40002537:48918 | 40026015:10013 | [Screen] eKYC Loading 2 | OK + renamed |
| 40003867:49142 | 40026015:10014 | Face Capture | OK |
| 40003867:49180 | 40026015:10015 | Face Capture Interface | OK |
| 40003867:49218 | 40026015:10016 | Face Capture 2 | OK + renamed |
| 40003867:49255 | 40026015:10017 | Face Capture 3 | OK + renamed |
| 40007301:24266 | 40026015:10019 | Profile/Not Verify | OK |
| 40013147:611839 | 40026015:10020 | Status Screen | OK |
| 40022038:44491 | 40026015:10021 | Chuyển tiền | OK |

- SKIPPED: `40022038:19753` (Account/Not Verify) — has COMPONENT child + Mona Sans font issue
- RENAMED: `Group 11929` → `[Group] eKYC Reference`

#### Other pages (13 screens)
| Page | Old ID | Name | Status |
|---|---|---|---|
| Đăng nhập | 40017575:83803 | Profile/Language | OK |
| Splashscreen | 40017314:6656 | [Splashscreen] | OK |
| TT hóa đơn | 40005000:21710 | Thanh toán thành công | OK |
| TT hóa đơn | 40005000:21349 | Lưu hóa đơn | OK |
| TT hóa đơn 1/2026 | 40022624:27621 | bill payment | OK |
| TT hóa đơn 1/2026 | 40022624:28010 | Thanh toán hóa đơn Internet | OK |
| V-App suggest | 40019980:26805 | Demo | OK |
| V-App suggest | 40020011:23097 | Demo | OK |
| V-App suggest | 40020011:23289 | Demo | OK |
| V-App suggest | 40019980:27528 | Demo | OK |
| V-App suggest | 40019980:26509 | [Screen] App loading | OK |
| V-App suggest | 40019980:27242 | [Screen] App loading | OK |
| Loading | — | No FRAME screens found | CLEAN |

### Remaining issues (manual fix needed)
1. `40022038:19753` Account/Not Verify — COMPONENT child + font issue, cannot auto-convert
2. Some pages have screens inside SECTIONs (nested) — would need deeper scan
3. Demo screens on V-App page need semantic renaming
4. Archive pages not touched (intentionally)

### Method used
- `figma.createComponentFromNode(frame)` — zero-copy conversion, preserves all fills/strokes/effects/fonts
- No font loading needed (unlike appendChild approach)
- 1 batch call per page group, ~5 MCP calls total for conversions

---
Back: [[Home]]
