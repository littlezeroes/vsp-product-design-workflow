# BRD: App Architecture Evolution 2026

## Background
VSP v1.0.6 = payment wallet thuần. 5 tabs: Trang chủ | Chuyển tiền | QR | Giao dịch | Tài khoản.
KHHĐ 2026 thêm ~50 features trong 4 mảng. Cần restructure app.

## Triết lý: Financial OS
Modular, user là admin, mỗi module 1 job, backward compatible, user controls.

## Đề xuất IA — 3 phases

### Phase 1 (30/4): CT → Thanh toán
- Nav: Trang chủ — **Thanh toán** — QR — Giao dịch — Tài khoản
- Chuyển tiền lên Home quick actions (Nạp · Rút · Chuyển · Nhận)
- Tab Thanh toán: Hóa đơn (điện/nước/net/ĐT), HST grid (XanhSM/VHR/VinPearl/VinFast...), Vé (phim/xe/tàu), Tài chính (khoản vay)
- Home: Wallet + 4 actions + Sinh lời card (teaser) + BH card (teaser) + GD gần đây
- Mental model: "tiền di chuyển" (Home) vs "tiền trả cho ai đó" (Thanh toán)

### Phase 2 (Q3): GD → Tài chính
- Nav: Trang chủ — Thanh toán — QR — **Tài chính** — Tài khoản
- GD merge vào Home wallet area (tap wallet → full history)
- Tab Tài chính = Financial Hub: Tổng tài sản + Sinh lời + BĐS + BH + CCQ + BNPL
- Home: Widgets (70% utility / 30% promo, 1 card max, dismissible)
- Mental model: "tiền sinh ra tiền / bảo vệ tài sản"

### Phase 3 (Q4): TK → Ưu đãi
- Nav: Trang chủ — Thanh toán — QR — Tài chính — **Ưu đãi**
- Tài khoản → avatar góc phải (Cash App pattern)
- Tab Ưu đãi: V-Point + Voucher + HST deals + Referral + Cashback
- Mental model: "tiết kiệm khi chi tiêu"

## KHHĐ Timeline (thật)
- BH xe máy/ô tô: 20/4
- BĐS basic: 30/4
- VAS điện/nước/net: 30/4
- HST: XanhSM (T3), VHR/VinPearl/VinFast (T4), Vinschool/VinUni/Vincom (T6)
- Sinh lời full: 30/6
- BH du lịch: 31/5, sức khỏe: 30/6
- CCQ: 30/9, BNPL: 30/9
- V-Point: 30/9

## Personas
- HST: Vinhomes/VinFast/VinPearl users
- General: MoMo/ZaloPay users thử VSP

## Layout principles (từ Cash App / OKX / Revolut)
- Balance = hero centered
- Actions ngang hàng dưới balance (circles)
- List rows cho services (không grid icons)
- Search ở top
- Minimal above fold

## Output cần
Mỗi phase cần:
1. Analysis: flow chi tiết, edge cases, mental model validation
2. Review: adversarial critique
3. Screen breakdown: screens + states cần build
4. Lofi wireframe: build bằng VSP DS
5. QA: state coverage check

---
Back: [[features/index|Features]] · [[features/app-architecture-2026/status|app-architecture-2026]]
