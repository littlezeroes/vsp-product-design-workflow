# Feature Summary — Sinh lời tự động

## Overview
Tính năng cho phép user tối ưu số dư nhàn rỗi trong Ví V-SmartPay. One-click kích hoạt, tự động sinh lời, rút tức thì.

## Pipeline Artifacts

| File | Agent | Description |
|------|-------|-------------|
| `brd-raw.md` | Vi | BRD extracted từ Confluence |
| `analysis.md` | Nate | 10 gaps, 6 UX risks, 40+ edge cases, 8 recommendations |
| `flow.md` | Nate | 10 Mermaid charts, 52 edge cases, 8 screen state maps |
| `review.md` | Đức | Adversarial review — PASS WITH CONCERNS, 4 critical |
| `decisions.md` | Vi | All critical issues resolved |
| `screens.md` | Ivy | 20 screens, 116 states |
| `qa-states.md` | Khoa | State coverage QA — 84.1%, P0 items identified |
| `qa-fixes-needed.md` | Vi | P0 fix list for Ivy |
| `qa-final.md` | Khoa | Final QA report |

## Screens Built (15 files)

### Epic 1 — Đăng ký sinh lời
| Screen | Route | Key Features |
|--------|-------|-------------|
| Product Intro | `/sinhloi/intro` | Lãi suất, benefits, eKYC gate, rate-changed banner |
| Confirm Activation | `/sinhloi/activate` | Masked info, 2 checkboxes, terms bottomsheet |
| OTP | `/sinhloi/otp` | 6-digit, 3 attempts, lock state, multi-context |
| Result Activation | `/sinhloi/result-activate` | Success/fail/processing, "Nạp tiền ngay" CTA |

### Epic 2 — Quản lý sinh lời
| Screen | Route | Key Features |
|--------|-------|-------------|
| Dashboard | `/sinhloi/dashboard` | 2-tab pill (Sản phẩm/Quản lý), pending TX badge |
| Transaction History | `/sinhloi/history` | Filter dropdown, calendar, empty states |
| Transaction Detail | `/sinhloi/history/[id]` | Copy txId, failed reason card |
| Profit Summary | `/sinhloi/profit` | Yearly/monthly, "Ước tính" badge, empty CTA |
| Terms & Conditions | `/sinhloi/terms` | View terms + contract, loading skeleton |

### Epic 3 — Nạp/Rút tiền
| Screen | Route | Key Features |
|--------|-------|-------------|
| Deposit/Withdraw | `/sinhloi/deposit-withdraw` | Tab switch, min 10K, monthly limit display, interest estimate |
| Confirm Transaction | `/sinhloi/confirm-tx` | Tiered auth (≤5M skip), stale timeout, balance warning |
| Auth (OTP) | `/sinhloi/auth` | 6-digit OTP, resend timer, locked state |
| Result Transaction | `/sinhloi/result-tx/[type]` | Success/processing/failed, new balance display |

### Epic 4 — Hủy đăng ký
| Screen | Route | Key Features |
|--------|-------|-------------|
| Cancel | `/sinhloi/cancel` | Balance gate, profit summary, danger button |
| Cancel Result | `/sinhloi/result-cancel` | Success/fail/processing |

## Key Design Decisions
1. **Tiered Auth:** Nạp ≤ 5M skip OTP, > 5M + Rút → OTP/Biometric
2. **Min Amount:** 10,000đ cho cả nạp và rút
3. **Monthly Limit:** Hiển thị "Hạn mức còn lại" trên form nạp
4. **Pending TX:** Yellow badge on dashboard, auto-refresh 30s
5. **Cancel Flow:** User tự rút hết → confirm → OTP → result

## Tech Stack
- Next.js App Router + TypeScript
- Tailwind v4 (CSS variable tokens)
- VSP Component Library (11 components)
- CVA for variants
- Lucide React icons

---
Back: [[features/index|Features]] · [[features/sinhloi-auto/status|sinhloi-auto]]
