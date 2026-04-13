# INPUT — VAS Payment Redesign

## Source
- **BRD**: Design Brief - Redesign VAS Payment (V-Pay) — by Nguyễn Đức Thiện (VSF-FINTECH-QLSP)
- **File**: `/Users/huykieu/Downloads/Design Brief - Redesign VAS Payment - V-Pay - VINIT Confluence (3_9_2026 4：15：51 PM).html`
- **Related BRD**: Smart Billing Hub (Vapp) — shares Payment Hub + auto-pay pattern
- **Related BRD file**: `/Users/huykieu/Downloads/BRD/` (36 photos)

## Existing Figma (VSP v1.0)
| Screen | Node ID | Status |
|--------|---------|--------|
| Payment Hub | `40009143:10433` | ready |
| Nạp tiền ĐT | `40002305:67696` | ready |
| Thanh toán hóa đơn | `40002431:144546` | ready |
| Thanh toán hóa đơn 1/2026 | `40019518:27104` | updated |
| Xác thực GD | `40004769:73935` | ready — reuse |
| Kết quả GD (shared) | `40013468:41558` | ready — reuse |
| VAS reference | `40008698:23879` | ref |

## Existing VSP UX Flow
```
Nạp ĐT:  Hub → Nhập SĐT → Auto-detect carrier → Chọn mệnh giá → Auth → Result
Hóa đơn: Hub → Chọn dịch vụ → Mã KH → Fetch bill → Confirm → Auth → Result
```

## Scope (from BRD)
### Redesign existing:
- VAS Home / danh sách dịch vụ
- Thanh toán hóa đơn (điện, nước, internet)
- Nạp tiền điện thoại
- Mua thẻ cao
- Payment flow & confirmation
- Trạng thái & lịch sử GD hóa đơn
- Lưu SĐT đã nạp
- Lưu hóa đơn

### New features:
- Mua gói data
- Thanh toán tài chính (vay tiêu dùng) — 12 providers
- Thanh toán tự động (recurring) — Phase 1: toggle + ngày cố định

## 8 User Flows (from BRD)
1. Thanh toán hóa đơn mới
2. Nạp tiền điện thoại
3. Mua thẻ cao
4. Thanh toán nhanh (từ đã lưu)
5. Quản lý hóa đơn & SĐT đã lưu
6. Cài đặt thanh toán tự động
7. Thanh toán tài chính (vay tiêu dùng)
8. Mua gói data

## Deadline
~30/04/2026

## Design References (from BRD)
- Techcombank, MoMo, ZaloPay, VNPay

---
Back: [[features/index|Features]] · [[features/vas-payment/status|vas-payment]]
