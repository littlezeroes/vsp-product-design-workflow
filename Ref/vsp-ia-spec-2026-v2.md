# V-Smart Pay — Information Architecture 2026

**Version 2.0 · Product Design Specification**
**Ngày: 21/03/2026 · Tác giả: Product Design Team · Phân loại: Internal — C-level & Product**

---

=== 1. Executive Summary ===

## 1. Executive Summary

**Vision:** V-Smart Pay chuyển từ ví thanh toán đơn thuần sang nền tảng quản lý tài chính cá nhân tích hợp hệ sinh thái Vingroup — nơi mọi giao dịch tiền bạc trong đời sống người dùng Việt Nam đều chạy qua một điểm duy nhất.

### 3 quyết định chiến lược

| # | Quyết định | Lý do | Impact |
|---|-----------|-------|--------|
| 1 | Giải phóng tab Chuyển tiền → thay bằng tab **Thanh toán** | 1 action không xứng chiếm 1 tab; ~20 dịch vụ mới cần nhà | Mở khoá monetization từ transaction fees |
| 2 | Thêm tab **Tài chính** (Q3) thay tab Giao dịch | 6 product lines (SL + BĐS + BH + CCQ + BNPL + Vay) cần destination riêng | Tạo AUM engine — revenue driver dài hạn |
| 3 | Thêm tab **Ưu đãi** (Q4) thay tab Tài khoản | V-Point + Voucher + HST deals đủ weight; Tài khoản lên avatar | Retention + partner revenue + HST lock-in |

### Phased Navigation Evolution

| Phase | Timeline | Bottom Nav | Thay đổi |
|-------|----------|-----------|----------|
| **Phase 1** | 30/04/2026 | Trang chủ · **Thanh toán** · QR · Giao dịch · Tài khoản | Chuyển tiền → Thanh toán |
| **Phase 2** | Q3 2026 | Trang chủ · Thanh toán · QR · **Tài chính** · Tài khoản | Giao dịch → Tài chính |
| **Phase 3** | Q4 2026 | Trang chủ · Thanh toán · QR · Tài chính · **Ưu đãi** | Tài khoản → Ưu đãi |

**Nguyên tắc xuyên suốt:** Mỗi phase chỉ đổi 1 tab. Backward compatible — tap count cho mọi action cũ không tăng. Tab mới chỉ xuất hiện khi đủ content thực tế, không bao giờ tạo tab trống.

---

=== 2. Business Context & Objectives ===

## 2. Business Context & Objectives

### 2.1 Hiện trạng sản phẩm

V-Smart Pay v1.0.6 là ví điện tử thuần thanh toán, thuộc hệ sinh thái Vingroup. App chưa mass launch, đang ở giai đoạn early adopters.

| Chỉ số | Giá trị hiện tại |
|--------|-----------------|
| Bottom nav | 5 tabs: Trang chủ · Chuyển tiền · QR · Giao dịch · Tài khoản |
| Số features | ~12 (nạp/rút/chuyển/nhận, QR, lịch sử, hóa đơn cơ bản) |
| Revenue stream | Chỉ transaction fees từ chuyển tiền + thanh toán |
| Điểm yếu IA | Tab Chuyển tiền = 1 action chiếm 1 slot; không có destination cho tài chính/ưu đãi |

### 2.2 Kế hoạch hoạt động 2026

Thêm ~50 features mới trong 4 mảng kinh doanh:

| Mảng | Số features | Timeline | Revenue model |
|------|------------|----------|---------------|
| **Thanh toán mở rộng** | ~20 dịch vụ (HĐ, HST, vé, auto-pay) | 30/4 → Q3 | Transaction fees 0.5-1.5% |
| **Tài chính & Đầu tư** | 6 product lines (SL, CCQ, BĐS, BH, BNPL, Vay) | Q2 → Q4 | AUM fees + BH premium + lending margin |
| **Ưu đãi & Loyalty** | V-Point, voucher, HST deals, referral | 30/4 voucher → Q4 full | Partner commission 3-8% + V-Point breakage |
| **HST Vingroup** | XanhSM, VHR, VinPearl, VinFast, Vinschool... | T3 → T8 | Integrated transaction + ecosystem lock-in |

### 2.3 Mục tiêu chiến lược IA

| Mục tiêu | Đo lường bằng | Target |
|----------|---------------|--------|
| Mỗi feature mới có "nhà" rõ ràng | Zero orphaned features | 100% |
| Không phá vỡ thói quen hiện tại | Core Task Completion Rate | Không drop >10% |
| Revenue diversification | Finance revenue share | ≥25% tổng revenue cuối 2026 |
| Ecosystem stickiness | HST cross-sell conversion | ≥8% từ in-app exposure |

### 2.4 Ràng buộc

- **Chưa mass launch** → có thể thay đổi nav mạnh hơn app đã có 10M users
- **Regulatory:** Ví điện tử, không phải ngân hàng — giới hạn sản phẩm tài chính
- **Vingroup dependency:** Timeline HST phụ thuộc đối tác nội bộ (XanhSM, VHR...)
- **Resource:** 1 design team, multiple engineering squads — phải phase để không overload

---

=== 3. User Research & Mental Models ===

## 3. User Research & Mental Models

### 3.1 Jobs-to-be-Done Framework

Thay vì personas (dễ trở thành fiction), document này dùng **JTBD** — tập trung vào việc user thuê app làm gì.

#### Core Job 1: "Tiền di chuyển" — Move money quickly

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Job statement** | Khi tôi cần chuyển/nạp/rút tiền, tôi muốn hoàn thành trong ≤3 tap để không mất thời gian |
| **Sub-jobs** | Chuyển tiền P2P · Nạp tiền vào ví · Rút về ngân hàng · Nhận tiền qua QR |
| **Tần suất** | 5-10 lần/tuần |
| **Kỳ vọng** | Nhanh, không phải tìm, quen tay |
| **Pain hiện tại** | Chuyển tiền nằm ở tab riêng nhưng mental model = quick action (ngang hàng Nạp/Rút) → user phải tìm |
| **Evidence** | User tap Nạp/Rút trên Home nhưng tìm không thấy Chuyển tiền ở cùng vị trí |
| **Giải pháp IA** | Đưa Chuyển tiền lên Home quick actions cạnh Nạp/Rút/Nhận |

#### Core Job 2: "Trả tiền cho dịch vụ" — Pay bills & services

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Job statement** | Khi tôi cần trả hóa đơn hoặc mua dịch vụ, tôi muốn tìm đúng nhà cung cấp và thanh toán 1 chỗ |
| **Sub-jobs** | Trả hóa đơn (điện/nước/net) · Nạp ĐT · Mua BH · Trả dịch vụ HST · Mua vé · Auto-pay |
| **Tần suất** | 3-5 lần/tháng |
| **Kỳ vọng** | Tìm được dịch vụ nhanh, lưu biller, tự động nhắc |
| **Pain hiện tại** | ~20 dịch vụ mới sắp ship nhưng chỉ có 1 banner + 1 sub-page — không đủ chỗ |
| **Evidence** | Hóa đơn điện/nước đã có nhưng chôn sâu, conversion thấp vì không có entry point rõ |
| **Giải pháp IA** | Tab Thanh toán riêng — search, categories, saved billers, HST grid |

#### Core Job 3: "Tiền sinh ra tiền / Bảo vệ tài sản" — Grow & protect wealth

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Job statement** | Khi tôi có tiền nhàn rỗi, tôi muốn sinh lời hoặc bảo vệ tài sản mà không cần rời app |
| **Sub-jobs** | Sinh lời tự động · Đầu tư BĐS · Mua BH · Mua CCQ · Dùng BNPL · Vay trả góp |
| **Tần suất** | 2-4 lần/tháng (check), 1-2 lần/tháng (action) |
| **Kỳ vọng** | Mindset khác thanh toán — cần trust, thông tin rõ, portfolio view |
| **Pain hiện tại** | Không có destination — SL/BH/BĐS sẽ phải nằm rải rác trên Home |
| **Evidence** | User có balance >5M liên tục không biết app có sinh lời |
| **Giải pháp IA** | Tab Tài chính (Q3) — tổng tài sản + product cards + portfolio |

### 3.2 Three Mental Modes

User không nghĩ theo "feature list" mà theo **mode tâm lý** khi mở app:

```
Mode 1: "Xong nhanh"     → Chuyển/Nạp/Rút     → Home quick actions (≤2 taps)
Mode 2: "Trả cho ai đó"  → HĐ/HST/Vé          → Tab Thanh toán (browse → pick → pay)
Mode 3: "Quản lý tiền"   → SL/BĐS/BH/CCQ      → Tab Tài chính (review → action)
```

**Mapping IA:**

| Mental Mode | Entry Point | Interaction Pattern | Time Spent |
|------------|-------------|-------------------|------------|
| Xong nhanh | Home quick actions | Tap → flow → done | 15-30s |
| Trả cho ai đó | Tab Thanh toán | Browse/search → select → confirm | 1-3 phút |
| Quản lý tiền | Tab Tài chính | Review status → deep dive → action | 3-10 phút |

### 3.3 HST Persona vs General Persona

| Dimension | HST Persona | General Persona |
|-----------|------------|----------------|
| **Profile** | Cư dân Vinhomes, chủ xe VinFast, KH VinPearl | User phổ thông VN, đang dùng MoMo/ZaloPay |
| **Core jobs** | Trả dịch vụ HST + BH xe + đầu tư BĐS Vinhomes | Chuyển tiền + trả HĐ + nạp ĐT |
| **AUM potential** | Cao — đã trust Vingroup với tài sản lớn | Thấp ban đầu — cần prove value |
| **IA priority** | HST section trong Thanh toán + BĐS/BH trong Tài chính | Quick actions + HĐ tiện ích |
| **Retention driver** | Ecosystem lock-in (chỉ trả được qua VSP) | Ưu đãi + convenience |

### 3.4 JTBD → IA Mapping Summary

```
┌──────────────────────────────────────────────────┐
│              USER MENTAL MODEL                    │
├────────────┬────────────────┬────────────────────┤
│ Mode 1     │ Mode 2         │ Mode 3             │
│ Xong nhanh │ Trả cho ai đó  │ Quản lý tiền       │
├────────────┼────────────────┼────────────────────┤
│ Home       │ Tab Thanh toán │ Tab Tài chính      │
│ Quick Acts │ Browse → Pay   │ Review → Action    │
├────────────┼────────────────┼────────────────────┤
│ 15-30s     │ 1-3 min        │ 3-10 min           │
│ 5-10x/week │ 3-5x/month     │ 2-4x/month         │
└────────────┴────────────────┴────────────────────┘
              + Tab Ưu đãi (cross-cutting: tiết kiệm khi chi tiêu)
```

---

=== 4. Current State Analysis ===

## 4. Current State Analysis

### 4.1 Cấu trúc hiện tại (v1.0.6)

```
Bottom Nav:  🏠 Trang chủ  ·  ↔ Chuyển tiền  ·  📱 QR  ·  🕐 Giao dịch  ·  👤 Tài khoản
```

### 4.2 Đánh giá từng tab

| Tab | Nội dung | Tần suất sử dụng | Đánh giá | Quyết định |
|-----|---------|------------------|---------|-----------|
| **Trang chủ** | Balance + quick actions (Nạp/Rút/Nhận/TT) + GD gần đây + promo | Mỗi session | Hoạt động tốt. Cần evolve thành widget-based | **Giữ + nâng cấp** |
| **Chuyển tiền** | Chọn ví hoặc ngân hàng → flow chuyển | 2-3 lần/tuần | 1 action chiếm 1 tab — lãng phí slot. Mental model = quick action, không phải destination | **Thay bằng Thanh toán** |
| **QR** | Mã nhận tiền VietQR (center tab) | Mỗi session | Standard pattern, hoạt động tốt | **Giữ** |
| **Giao dịch** | Lịch sử chi tiết với filter | 1-2 lần/tuần | User VN check thường xuyên. Nhưng lịch sử = context của ví, không phải destination độc lập | **Merge vào Home (Q3)** |
| **Tài khoản** | Profile + bảo mật + settings | 1 lần/tháng | Tần suất thấp nhất — không xứng chiếm tab | **Lên avatar (Q4)** |

### 4.3 Annotated Current State

```
┌─────────────────────────────────────┐
│ 👤 Xin chào              🔔        │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Ví V-Smart Pay                  │ │
│ │ 14.328.000 đ              👁   │ │
│ └─────────────────────────────────┘ │
│                                     │
│  [Nạp]  [Rút]  [Nhận]  [Thanh toán]│ ← Chuyển tiền THIẾU ở đây
│                                     │   (nằm ở tab riêng — sai mental model)
│                                     │
│ Giao dịch gần đây          Tất cả  │
│  CONG TY DIEN LUC HN    -38.000    │
│  HO THI MINH ANH       -100.000    │
│  NAP TIEN                +50.000    │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [Promo banner — đang chiếm      │ │ ← Không có chỗ cho SL/BH/BĐS
│ │  không gian cho tính năng mới]  │ │   khi ship 50 features
│ └─────────────────────────────────┘ │
│                                     │
│ [TC] [CT]  [QR]  [GD] [TK]         │
│       ↑              ↑    ↑        │
│       Lãng phí       Sẽ   Sẽ      │
│       slot           merge move    │
└─────────────────────────────────────┘
```

### 4.4 Vấn đề cần giải quyết

| # | Vấn đề | Severity | Phase giải quyết |
|---|--------|----------|-----------------|
| 1 | Chuyển tiền sai vị trí (tab thay vì quick action) | High | Phase 1 |
| 2 | Không có destination cho ~20 dịch vụ thanh toán mới | Critical | Phase 1 |
| 3 | Không có destination cho 6 product lines tài chính | Critical | Phase 2 |
| 4 | Home thiếu widget architecture cho cross-sell | Medium | Phase 1-2 |
| 5 | Tab Tài khoản chiếm slot nhưng dùng 1 lần/tháng | Low | Phase 3 |

---

=== 5. Competitive Analysis ===

## 5. Competitive Analysis

### 5.1 Bảng so sánh Navigation

| App | Nav hiện tại | Khi nào thêm Wealth/Finance tab | Promo vs Utility ratio (Home) | Key takeaway |
|-----|-------------|-------------------------------|------------------------------|-------------|
| **Cash App** | Home · Pay · Activity · Banking · Invest | Invest từ 2019 (sau 6 năm) khi đủ stocks + BTC + savings | 90/10 utility | Profile = avatar góc phải, không chiếm tab. Mỗi tab = 1 job rõ ràng |
| **Revolut 2026** | Home · Payments · Hub · Crypto · More | Crypto tab khi >3M crypto users (2021). Wealth nằm trong Hub | 85/15 utility | Hub = catch-all cho features nhỏ. Payments tab = all outgoing money |
| **Monzo** | Home · Payments · Analytics · Browse | Không có Finance tab riêng — tất cả trong Browse | 95/5 utility | Browse = discovery hub. Analytics thay Activity/History |
| **ZaloPay** | Trang chủ · Ví · QR · Ưu đãi · Cá nhân | Chưa có Finance tab — wealth minimal | 40/60 promo | Home = banner blindness. Ưu đãi tab = retention play |
| **MoMo** | Trang chủ · Ví · QR · Feed · Tài khoản | Chưa tách — mọi thứ trên Home grid | 30/70 promo | Cautionary tale: 70% promo → engagement drop 40%. Super app grid khó navigate |
| **OKX** | Home · Trade · Discover · Wallet · Assets | Trade từ ngày 1 (core business) | 80/20 utility | Financial app = data-dense, dark mode first. Portfolio view = trust builder |

### 5.2 Pattern Analysis

**Pattern 1: Tab xuất hiện khi đủ weight**
- Cash App: 6 năm mới thêm Invest tab
- Revolut: 3 năm mới tách Crypto tab
- Bài học: **Không tạo tab trống. Tab = commitment.**

**Pattern 2: Profile không cần tab**
- Cash App, Revolut, Monzo: Profile = avatar hoặc icon góc phải
- ZaloPay, MoMo: Vẫn giữ tab Tài khoản
- Bài học: **App tài chính mature đều move Profile lên avatar.** Risk cho VN: user chưa quen → cần feature flag.

**Pattern 3: Home ratio quyết định trust**
- Cash App, Revolut, Monzo: 85-95% utility
- MoMo: 30% utility → bị user than phiền "quảng cáo nhiều quá"
- Bài học: **70/30 utility/promo là minimum. VSP target 70/30, lý tưởng 80/20.**

**Pattern 4: History/Activity merge trend**
- Cash App: Activity = tab riêng (legacy, đang giảm prominence)
- Revolut 2026: History nằm trong từng account/card
- Monzo: Analytics thay History (insight > raw data)
- Bài học: **History đang bị merge vào context (wallet, account). Không cần tab riêng lâu dài.**

### 5.3 Competitive Positioning

```
                    Utility-first
                        ▲
              Revolut ● │ ● Cash App
                        │
     Monzo ●            │            ● OKX
                        │
  ───────────────────── ● VSP (target) ─────────
  Simple                │              Complex
                        │
         ZaloPay ●      │
                        │     ● MoMo
                        ▼
                    Promo-heavy
```

VSP target: **Utility-first, moderate complexity** — giữa Revolut (full bank) và Cash App (simple), phức tạp hơn ZaloPay nhưng sạch hơn MoMo.

---

=== 6. Proposed Information Architecture ===

## 6. Proposed Information Architecture

### 6.1 Nguyên tắc thiết kế IA

| # | Nguyên tắc | Giải thích | Test |
|---|-----------|-----------|------|
| 1 | **Modular, không monolith** | Mỗi tab = 1 module độc lập. Thêm/bỏ module không ảnh hưởng core | Xoá 1 tab → app vẫn functional? |
| 2 | **1 tab = 1 job** | Thanh toán = trả tiền. Tài chính = grow. Nếu 1 tab làm 2 việc → tách | Tab description ≤5 từ? |
| 3 | **Backward compatible** | Đổi nav không bao giờ tăng tap count cho action cũ | Tap count audit trước/sau mỗi phase |
| 4 | **Home = status, Tab = action** | Widget trên Home show trạng thái. Tap → tab để thực hiện hành động | Không duplicate functionality |
| 5 | **Tab khi đủ weight** | Tab mới chỉ xuất hiện khi có ≥3 product lines sẵn sàng | Zero empty tabs |

### 6.2 Bottom Nav Evolution

```
HIỆN TẠI (v1.0.6)
┌────────┬────────────┬────┬──────────┬──────────┐
│Trang   │ Chuyển     │ QR │ Giao     │ Tài      │
│chủ     │ tiền       │    │ dịch     │ khoản    │
└────────┴────────────┴────┴──────────┴──────────┘

PHASE 1 (30/4/2026) — Thay 1 tab
┌────────┬────────────┬────┬──────────┬──────────┐
│Trang   │ Thanh      │ QR │ Giao     │ Tài      │
│chủ     │ toán ★     │    │ dịch     │ khoản    │
└────────┴────────────┴────┴──────────┴──────────┘

PHASE 2 (Q3/2026) — Thay 1 tab
┌────────┬────────────┬────┬──────────┬──────────┐
│Trang   │ Thanh      │ QR │ Tài      │ Tài      │
│chủ     │ toán       │    │ chính ★  │ khoản    │
└────────┴────────────┴────┴──────────┴──────────┘

PHASE 3 (Q4/2026) — Thay 1 tab
┌────────┬────────────┬────┬──────────┬──────────┐
│Trang   │ Thanh      │ QR │ Tài      │ Ưu       │
│chủ     │ toán       │    │ chính    │ đãi ★    │
└────────┴────────────┴────┴──────────┴──────────┘
★ = tab mới trong phase đó
```

### 6.3 Full IA Tree (End State — Q4 2026)

```
V-Smart Pay
├── 🏠 Trang chủ
│   ├── Wallet Card (balance, ẩn/hiện, tap → lịch sử GD)
│   ├── Quick Actions: Nạp · Rút · Chuyển · Nhận
│   ├── Utility Widgets (70%)
│   │   ├── Sinh lời status card
│   │   ├── BH active card
│   │   ├── Upcoming bills
│   │   └── GD gần đây (3 items)
│   └── Promo Widget (30%, 1 max, dismissible)
│
├── 💳 Thanh toán
│   ├── Search bar
│   ├── Category tabs: Tất cả · HĐ · HST · Vé
│   ├── Hóa đơn tiện ích
│   │   ├── Điện · Nước · Internet · Data
│   │   ├── Nạp ĐT · Mua thẻ
│   │   ├── Học phí · Vé phim
│   │   └── Thanh toán tài chính (khoản vay)
│   ├── Hệ sinh thái Vingroup
│   │   ├── XanhSM · VHR · VinPearl · VinFast
│   │   └── Vinschool · VinUni · Vincom · VinMec
│   ├── Saved billers
│   └── Auto-pay & nhắc lịch
│
├── 📱 QR (center)
│   ├── Quét QR thanh toán
│   ├── Mã nhận tiền VietQR
│   └── QR chuyển tiền
│
├── 💰 Tài chính
│   ├── Tổng tài sản (ví + SL + đầu tư)
│   ├── Sinh lời tự động
│   │   └── Kích hoạt · Nạp/Rút · Dashboard · Lịch sử · Huỷ
│   ├── Đầu tư BĐS mã hoá
│   │   └── Dự án · Chi tiết · Đặt mua · Settlement · Trao đổi
│   ├── Bảo hiểm
│   │   └── Xe máy · Ô tô · Du lịch · Sức khỏe → Mua · Quản lý HĐ
│   ├── Chứng chỉ quỹ
│   │   └── Mở TK · Mua · Bán · Portfolio · Hồ sơ
│   ├── Ví trả sau (BNPL)
│   │   └── Đăng ký · Thanh toán · Quản lý dư nợ
│   └── Vay trả góp xe VinFast
│
├── 🎁 Ưu đãi
│   ├── V-Point (điểm tích luỹ)
│   ├── Voucher store
│   ├── Category tabs: Tất cả · Ăn · Đi · Mua
│   ├── HST deals (VinPearl, XanhSM, Highland...)
│   ├── Flash deals
│   └── Giới thiệu bạn (referral)
│
└── 👤 Tài khoản (avatar góc phải — không tab)
    ├── Profile & KYC
    ├── Ngân hàng liên kết
    ├── Bảo mật (PIN, biometric, thiết bị)
    ├── Settings & thông báo
    └── Trợ giúp
```

### 6.4 Tap Count Audit — Backward Compatibility

| Action | Hiện tại | Phase 1 | Phase 2 | Phase 3 | Verdict |
|--------|---------|---------|---------|---------|---------|
| Chuyển tiền | 1 tap (tab) | 1 tap (Home quick action) | 1 tap | 1 tap | Giữ nguyên |
| Nạp tiền | 1 tap (Home) | 1 tap | 1 tap | 1 tap | Giữ nguyên |
| Xem lịch sử | 1 tap (tab) | 1 tap (tab) | 1 tap (tap wallet) | 1 tap | Giữ nguyên |
| Trả hóa đơn | 3 tap (Home → banner → pick) | 2 tap (tab → pick) | 2 tap | 2 tap | Cải thiện |
| Xem profile | 1 tap (tab) | 1 tap (tab) | 1 tap (tab) | 1 tap (avatar) | Giữ nguyên |
| Sinh lời | N/A | 2 tap (Home card → page) | 1 tap (tab → card) | 1 tap | Cải thiện |

---

=== 7. Phased Rollout Plan ===

## 7. Phased Rollout Plan

### 7.1 Phase 1: Tab Thanh toán (30/04/2026)

**Thay đổi nav:** Chuyển tiền → **Thanh toán**
**Lý do:** ~20 dịch vụ ship trước 30/4 không có chỗ. Tab CT lãng phí slot cho 1 action.

#### Nội dung ship

| Feature | Ready date | Priority |
|---------|-----------|----------|
| Hóa đơn: Điện, Nước, Internet, Data, Nạp ĐT, Mua thẻ | 30/4 | P0 |
| HST: XanhSM | T3 (done) | P0 |
| Saved billers + Nhắc thanh toán | 20/4 | P1 |
| BH xe máy + ô tô (TNDS) | 20/4 | P1 |
| Voucher basic | 30/4 | P2 |
| BĐS mã hoá (basic listing) | 30/4 | P2 |

#### Home Phase 1

| Khu vực | Nội dung | Rule |
|---------|---------|------|
| **Wallet Card** | Balance + ẩn/hiện | Fixed, không thay đổi |
| **Quick Actions** | Nạp · Rút · **Chuyển** · Nhận | Thêm Chuyển tiền (từ tab cũ) |
| **Utility (70%)** | GD gần đây + Sinh lời teaser card + BH card | Status only, tap → deep link |
| **Promo (30%)** | 1 card max, dismissible, contextual | Không banner blindness |

#### Migration Plan — Phase 1

| Bước | Action | Timeline |
|------|--------|----------|
| 1 | Ship Chuyển tiền vào Home quick actions (A/B test) | T3 W3 |
| 2 | Feature flag tab Thanh toán cho Vingroup employees | T4 W1 |
| 3 | Monitor Core Task Completion 2 tuần | T4 W1-2 |
| 4 | Rollout Vinhomes residents | T4 W3 |
| 5 | General rollout | 30/4 |
| 6 | Remove tab CT cũ | 30/4+7 ngày |

### 7.2 Phase 2: Tab Tài chính (Q3/2026)

**Thay đổi nav:** Giao dịch → **Tài chính**
**Lý do:** 6 product lines đủ weight. Giao dịch merge vào Home wallet area.

#### Nội dung ship

| Feature | Ready date | Priority |
|---------|-----------|----------|
| Sinh lời tự động (full) | 30/6 | P0 |
| BH 4 loại (xe/ô tô/du lịch/sức khỏe) | 30/6 | P0 |
| BĐS mã hoá — trao đổi | 17/7 | P1 |
| CCQ (Chứng chỉ quỹ) | 30/9 | P1 |
| BNPL (Ví trả sau) | 30/9 | P1 |
| Vay trả góp VinFast | 31/5 | P2 |
| Lịch sử GD merge vào Home wallet | Q3 | P0 |

#### Behavioral Graduation Strategy

Không đổi nav đồng loạt. Dùng behavioral graduation:

```
User đã dùng SL/BH/BĐS (≥1 action)
  → Thấy tab Tài chính + tooltip "Tài chính của bạn, 1 chỗ"
  → Lịch sử GD = tap Wallet Card trên Home

User chưa dùng sản phẩm tài chính nào
  → Vẫn thấy tab Giao dịch (không thay đổi)
  → Khi 80% users graduate → force switch cho tất cả
```

#### Migration Plan — Phase 2

| Bước | Action | Timeline |
|------|--------|----------|
| 1 | Ship "Tap Wallet → Lịch sử" trên Home (không đổi tab) | T6 |
| 2 | A/B: Users có SL/BH → thấy tab Tài chính | T7 W1 |
| 3 | Monitor: GD tab usage drop + Tài chính adoption | T7 W1-4 |
| 4 | Graduation threshold: 80% qualified users migrated | T8 |
| 5 | Force switch toàn bộ | Q3 end |

### 7.3 Phase 3: Tab Ưu đãi (Q4/2026)

**Thay đổi nav:** Tài khoản → **Ưu đãi**
**Lý do:** V-Point + Voucher + HST deals đủ weight. Tài khoản lên avatar góc phải.

#### Nội dung ship

| Feature | Ready date | Priority |
|---------|-----------|----------|
| V-Point (loyalty) | 30/9 | P0 |
| Voucher store (expanded) | Q4 | P0 |
| HST deals (VinPearl, XanhSM, Highland...) | Q4 | P1 |
| Giới thiệu bạn (referral) | Q4 | P1 |
| Flash deals | Q4 | P2 |
| Tài khoản → Avatar góc phải | Q4 | P0 |

#### Migration Plan — Phase 3

| Bước | Action | Timeline |
|------|--------|----------|
| 1 | Ship avatar icon góc phải (alongside tab TK) | T9 |
| 2 | Track: avatar usage vs tab TK usage (4 tuần) | T9-T10 |
| 3 | Feature flag tab Ưu đãi cho Vingroup employees | T10 |
| 4 | Rollout (Vinhomes → general) | T11 |
| 5 | Remove tab TK, avatar = duy nhất | T12 |

**Risk:** User VN chưa quen profile-in-avatar pattern. Mitigation: "Cái mới" dot indicator + 1-line tooltip khi tap lần đầu. Rage tap detector: tap vị trí cũ >3 lần → tooltip chỉ hướng.

### 7.4 Timeline Overview

```
2026   T3    T4     T5     T6     T7     T8     T9     T10    T11    T12
       │     │      │      │      │      │      │      │      │      │
       ├─ P1 rollout ─┤    │      │      │      │      │      │      │
       │  CT→TT       │    │      │      │      │      │      │      │
       │              ├──── P2 prep ─────┤      │      │      │      │
       │              │   SL/BH ship     │      │      │      │      │
       │              │                  ├─ P2 rollout ─┤      │      │
       │              │                  │ GD→TC         │      │      │
       │              │                  │               ├── P3 rollout ──┤
       │              │                  │               │  TK→ƯĐ        │
       │              │                  │               │                │
       ▼              ▼                  ▼               ▼                ▼
    5 tabs         5 tabs            5 tabs          5 tabs           5 tabs
    (CT→TT)       (prep)            (GD→TC)         (prep)           (TK→ƯĐ)
```

---

=== 8. Wireframes & Detailed Tab Design ===

## 8. Wireframes & Detailed Tab Design

### 8.1 Home — Widget Architecture

**Nguyên tắc 70/30:** 70% above-fold utility, 30% max promo. MoMo = cautionary tale: 70% promo → banner blindness → engagement drop 40%.

**Rule:** Home widgets show STATUS, tabs enable ACTION. Widget = glance ("SL: 12.5M +45K"). Tap → tab Tài chính cho full action. Không duplicate functionality.

#### Home Layout Specification

```
┌─────────────────────────────────────┐
│ HEADER                              │
│  Greeting (left)     🔔  👤 (right) │ ← Avatar thay vì tab TK (Phase 3)
├─────────────────────────────────────┤
│ WALLET CARD                         │
│  Ví V-Smart Pay                     │
│  14.328.000 đ                  👁   │ ← Tap → Lịch sử GD (Phase 2+)
├─────────────────────────────────────┤
│ QUICK ACTIONS (fixed)               │
│  [Nạp]  [Rút]  [Chuyển]  [Nhận]    │ ← Chuyển tiền từ Phase 1
├─────────────────────────────────────┤
│ UTILITY ZONE (70%)                  │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 💰 Sinh lời: 5.000.000đ        │ │ ← Hiện khi user activated
│ │    +12.500đ hôm nay    Xem ›   │ │   Tap → Tab Tài chính
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 🛡 Bảo hiểm: 2 HĐ active      │ │ ← Hiện khi có hợp đồng
│ │    Xe máy + Ô tô       Xem ›   │ │   Tap → Tab Tài chính
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 📋 HĐ sắp đến hạn             │ │ ← Hiện khi có bill saved
│ │    Tiền điện T4: 380K   Trả ›  │ │   Tap → Tab Thanh toán
│ └─────────────────────────────────┘ │
│                                     │
│ Giao dịch gần đây          Tất cả  │
│  CONG TY DIEN LUC HN    -38.000    │
│  HO THI MINH ANH       -100.000    │
│  NAP TIEN                +50.000    │
├─────────────────────────────────────┤
│ PROMO ZONE (30%)                    │
│ ┌─────────────────────────────────┐ │
│ │ ✕  CCQ từ 50K — Bắt đầu đầu tư│ │ ← 1 card max, dismissible
│ └─────────────────────────────────┘ │
│         "Khám phá thêm"            │
└─────────────────────────────────────┘
```

**Widget rules:**
- Widget chỉ hiện khi user đã activate sản phẩm tương ứng (SL, BH) HOẶC khi có data contextual (upcoming bill)
- User chưa dùng sản phẩm nào → Home sạch, chỉ có balance + quick actions + GD gần đây
- Behavioral trigger: balance >5M liên tục 3 ngày → show SL teaser widget

[INSERT HIGH-FIDELITY WIREFRAME — HOME PHASE 1 HERE]

[INSERT HIGH-FIDELITY WIREFRAME — HOME PHASE 2 HERE]

[INSERT HIGH-FIDELITY WIREFRAME — HOME PHASE 3 HERE]

### 8.2 Tab Thanh toán (Phase 1)

**Job:** "Trả tiền cho dịch vụ" — browse, pick provider, pay.

#### Layout Specification

```
┌─────────────────────────────────────┐
│ Thanh toán                          │
├─────────────────────────────────────┤
│ 🔍 Tìm dịch vụ, nhà cung cấp...   │ ← Search (pill-shaped)
├─────────────────────────────────────┤
│ [Tất cả] [Hóa đơn] [HST] [Vé]     │ ← Category tabs (scroll horizontal)
├─────────────────────────────────────┤
│                                     │
│ HÓA ĐƠN TIỆN ÍCH                  │
│  ⚡ Điện                        ›   │ ← Tap → provider picker → bill
│  💧 Nước                        ›   │   lookup → confirm → pay
│  📶 Internet                    ›   │
│  📱 Nạp điện thoại              ›   │
│  💳 Mua thẻ điện thoại          ›   │
│  📊 Data 4G                     ›   │
│                                     │
│ HỆ SINH THÁI VINGROUP              │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐       │ ← Grid 4 columns
│  │Xanh│ │VHR │ │VPrl│ │VFst│       │   Tap → service-specific flow
│  │ SM │ │    │ │    │ │    │       │
│  └────┘ └────┘ └────┘ └────┘       │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐       │
│  │VSch│ │VUni│ │VCom│ │VMec│       │
│  └────┘ └────┘ └────┘ └────┘       │
│                                     │
│ SAVED BILLERS                       │
│  ⭐ EVN HN (T4)              380K   │ ← Quick-pay saved billers
│  ⭐ FPT Internet              220K   │   Tap → pre-filled confirm
│                                     │
│ VÉ & DỊCH VỤ                       │
│  🎬 Vé xem phim                ›   │
│  🚂 Vé xe & tàu                ›   │
└─────────────────────────────────────┘
```

**Interaction flow:** Tap service → Provider picker (nếu cần) → Nhập mã KH/SĐT → Bill lookup → Confirm → Auth (PIN/biometric) → Result

**Above fold:** Search + categories + top 4 dịch vụ phổ biến nhất. Scroll để xem HST + vé.

[INSERT HIGH-FIDELITY WIREFRAME — TAB THANH TOÁN HERE]

### 8.3 Tab Tài chính (Phase 2)

**Job:** "Tiền sinh ra tiền / bảo vệ tài sản" — review portfolio, take action.

#### Layout Specification

```
┌─────────────────────────────────────┐
│ Tài chính                           │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Tổng tài sản                    │ │ ← Portfolio summary
│ │ 25.014.328 đ               👁   │ │   Ví 14K · SL 5M · BĐS 20M
│ │ Ví 14K · SL 5M · BĐS 20M      │ │   Tap → breakdown detail
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 💰 Sinh lời tự động             │ │ ← Card: balance + daily profit
│ │ 5.000.000 đ                     │ │   + annual rate
│ │ +12.500đ hôm nay    5.5%/năm   │ │   Tap → SL dashboard
│ │ [Nạp thêm]           [Chi tiết]│ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🏠 BĐS mã hoá                  │ │ ← Card: holding + unrealized P&L
│ │ Vinhomes Grand Park             │ │   Tap → portfolio detail
│ │ 20.000.000 đ        +2.3%      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 🛡 Bảo hiểm                    ›   │ ← Row: count + status
│    4 loại · 2 HĐ active            │   Tap → BH management
│                                     │
│ 📊 Chứng chỉ quỹ              ›   │ ← Row: portfolio summary
│    Mua · Bán · Portfolio            │   Tap → CCQ dashboard
│                                     │
│ 💳 Ví trả sau                  ›   │ ← Row: limit + balance
│    Hạn mức 5M · Dư nợ 1.2M         │   Tap → BNPL management
│                                     │
│ 🚗 Vay trả góp VinFast         ›   │
│    12/36 kỳ · 8.5M còn lại         │
└─────────────────────────────────────┘
```

**Above fold:** Tổng tài sản card + Sinh lời card (2 products có AUM cao nhất). User thấy "tiền đang grow" ngay khi mở tab → reinforce saving behavior.

**Content priority:** Cards (SL, BĐS) cho products có balance/AUM. Rows cho products khác (BH, CCQ, BNPL). Card = số liệu lớn + quick action. Row = status + chevron.

[INSERT HIGH-FIDELITY WIREFRAME — TAB TÀI CHÍNH HERE]

### 8.4 Tab Ưu đãi (Phase 3)

**Job:** "Tiết kiệm khi chi tiêu" — discover deals, earn/burn points.

#### Layout Specification

```
┌─────────────────────────────────────┐
│ Ưu đãi                             │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🏆 V-Point                      │ │ ← Point balance card
│ │ 1.250 điểm                  ›   │ │   Tap → V-Point detail
│ │ = 12.500đ                       │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🔥 XanhSM giảm 50%             │ │ ← Featured deal (hero card)
│ │ HSD: 30/12/2026                 │ │   Tap → detail + claim
│ │ [Lấy ngay]                      │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ [Tất cả] [Ăn uống] [Di chuyển]     │ ← Category filter
│ [Mua sắm] [Du lịch] [Giải trí]     │
├─────────────────────────────────────┤
│                                     │
│ 🎁 VinPearl — Giảm 30%         ›   │ ← Deal rows
│ 🏠 Vinhomes — Cashback 2%      ›   │
│ 🚗 XanhSM — Giảm 20K           ›   │
│ ☕ Highland — Giảm 15%          ›   │
│ 🍜 Phở 24 — Mua 1 tặng 1      ›   │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 👥 Giới thiệu bạn              │ │ ← Referral card
│ │ Nhận 50.000đ mỗi người     ›   │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

[INSERT HIGH-FIDELITY WIREFRAME — TAB ƯU ĐÃI HERE]

### 8.5 Tài khoản — Avatar Pattern (Phase 3)

```
┌─────────────────────────────────────┐
│ Home header:                        │
│  Xin chào, Huy            🔔  [👤] │ ← Tap avatar
│                                     │
│  ┌──── Sheet/Page ─────────────┐    │
│  │ Huy Kieu                    │    │
│  │ 0912***456 · KYC verified ✓ │    │
│  │                             │    │
│  │ 🏦 Ngân hàng liên kết   ›  │    │
│  │ 🔒 Bảo mật & PIN        ›  │    │
│  │ 🔔 Cài đặt thông báo    ›  │    │
│  │ ❓ Trợ giúp              ›  │    │
│  │ 📄 Điều khoản            ›  │    │
│  │                             │    │
│  │ Đăng xuất                   │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

**Findability rule:** Settings/bảo mật luôn accessible trong ≤2 taps (avatar → item). Balance luôn visible. Lịch sử GD luôn accessible (wallet card).

### 8.6 Annotation — Key Interaction Patterns

| Pattern | Mô tả | Ví dụ |
|---------|-------|-------|
| **Widget → Tab** | Home widget show status, tap → navigate to relevant tab | "SL: 5M +45K" → tap → Tab Tài chính > Sinh lời |
| **Quick Action → Flow** | Home quick action icon → full transaction flow | [Chuyển] → Contact picker → Amount → Confirm → Auth → Result |
| **Category → Provider → Pay** | Tab TT: chọn category → chọn NCC → nhập mã → pay | [Điện] → EVN HN → Mã KH → Bill 380K → Confirm → Auth |
| **Card → Dashboard** | Tab TC: product card → full product dashboard | [Sinh lời card] → SL Dashboard (balance, chart, history, nạp/rút) |
| **Saved → Quick Pay** | Tab TT: saved biller → pre-filled confirm | ⭐ EVN HN → Confirm 380K → Auth → Done (2 taps) |

---

=== 9. Success Metrics & KPIs ===

## 9. Success Metrics & KPIs

### 9.1 North Star Metric

**MATU** — Monthly Active Transacting Users

Định nghĩa: Unique users hoàn thành ≥1 giao dịch tài chính/tháng (thanh toán, chuyển tiền, nạp/rút, mua BH, đầu tư).

| Tại sao MATU | Tại sao không metrics khác |
|-------------|---------------------------|
| Đo hành vi thực tế, không vanity | **MAU** = mở app nhưng không transact = vanity |
| Cân bằng giữa whale và long-tail | **TPV** = bị skew bởi 1% whale users |
| Gắn trực tiếp với revenue | **DAU** = quá sensitive với promo spike |

### 9.2 Per-Tab KPIs

| Tab | Primary Metric | Target Phase 1 | Target Phase 2 | Target Phase 3 |
|-----|---------------|----------------|----------------|----------------|
| **Home** | Widget Tap-Through Rate | >15% sessions | >20% | >25% |
| **Thanh toán** | Transactions/User/Month | 2+ | 4+ | 5+ |
| **QR** | QR Scan Success Rate | >90% | >92% | >95% |
| **Tài chính** | — | — | AUM growth 20% MoM | AUM growth 15% MoM |
| **Ưu đãi** | — | — | — | Revenue/Active User 50K/tháng |

### 9.3 Detailed KPI Table

| Category | KPI | Baseline (v1.0.6) | Target 30/4 | Target Q3 | Target Q4 |
|----------|-----|--------------------|-------------|-----------|-----------|
| **Engagement** | MATU | — | 10K | 30K | 80K |
| | Sessions/User/Week | 3.2 | 4.0 | 5.5 | 7.0 |
| | Core Task Completion Rate | 85% | ≥85% | ≥85% | ≥85% |
| **Thanh toán** | Bill Payment Users | 800 | 5K | 15K | 25K |
| | HST Transaction Volume | — | 2K/tháng | 10K/tháng | 30K/tháng |
| | Saved Billers/User | 0.3 | 1.5 | 3.0 | 4.0 |
| | Auto-pay Adoption | 0% | 5% | 15% | 25% |
| **Tài chính** | Sinh lời AUM | — | — | 5B VND | 20B VND |
| | SL Activation Rate | — | — | 15% eligible | 25% eligible |
| | BH Policies Sold | — | 500 | 3K | 8K |
| | BĐS Investors | — | 200 | 1K | 3K |
| **Ưu đãi** | V-Point Active Users | — | — | — | 20K |
| | Voucher Redemption Rate | — | 8% | 12% | 18% |
| | Referral Conversion | — | — | — | 5% |
| **Revenue** | Total GMV/month | 2B | 10B | 50B | 150B |

### 9.4 Revenue Trajectory 2026-2027

| Period | Payments | Finance | Deals/Loyalty | Total Revenue Index |
|--------|----------|---------|---------------|-------------------|
| 2026 H1 | 95% | 3% | 2% | 1.0x |
| 2026 H2 | 70% | 25% | 5% | 3.5x |
| 2027 H1 | 50% | 35% | 15% | 8.0x |
| 2027 H2 | 40% | 40% | 20% | 15.0x |

```
Revenue Mix Evolution
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2026 H1  ████████████████████████████████████░░  95% Pay / 3% Fin / 2% Deal
2026 H2  ████████████████████░░░░░░░░░░░░░░░░░  70% Pay / 25% Fin / 5% Deal
2027 H1  █████████████████░░░░░░░░░░░░░░░▒▒▒▒  50% Pay / 35% Fin / 15% Deal
2027 H2  ████████████████░░░░░░░░░░░░░░░░▒▒▒▒  40% Pay / 40% Fin / 20% Deal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
█ = Payments  ░ = Finance  ▒ = Deals/Loyalty

→ Finance overtakes Payments cuối 2027
→ Deals/Loyalty = 20% (partner commission + V-Point breakage 15-20%)
```

### 9.5 Guardrails

| Guardrail | Threshold | Action |
|-----------|-----------|--------|
| Core Task Completion Rate drop | >10% trong 7 ngày | Investigate immediately, fix forward |
| Home promo ratio exceed | >30% viewport | Auto-cap, remove lowest-performing promo |
| Tab switch causes confusion | Rage tap >5% users | Activate tooltip + rage tap detector |
| Finance tab empty state | <2 products ready | Delay phase launch |

---

=== 10. Implementation Strategy, Risks & Mitigations ===

## 10. Implementation Strategy, Risks & Mitigations

### 10.1 Chiến lược triển khai

**Nguyên tắc: Soft Launch & Graduate. Roll forward, không rollback.**

App chưa mass launch = early adopters, forgiving. Tận dụng window này để thay đổi nav mạnh.

| Strategy | Chi tiết |
|----------|---------|
| **Feature flag per segment** | Vingroup employees (2-4 tuần) → Vinhomes residents → General. Test segment gần nhất, loyal nhất trước |
| **Behavioral graduation** | User đã dùng sản phẩm → thấy tab mới. User chưa dùng → giữ tab cũ. Khi 80% graduate → force switch |
| **"Cái mới" badge** | Dot indicator + 1-line tooltip. Không coach marks, không guided tour (completion <15% ở VN) |
| **Rage tap detector** | Tap vị trí cũ >3 lần → tooltip chỉ hướng mới. Auto-log for analytics |
| **1 metric rule** | Core Task Completion Rate. Drop >10% → investigate. Không rollback — fix forward |

### 10.2 Technical Requirements

| Requirement | Scope | Owner |
|-------------|-------|-------|
| Feature flag system | Per-segment, per-tab toggle | Platform team |
| Widget framework | Dynamic Home widgets, render by user state | Frontend team |
| Analytics events | Tab switch, widget tap, rage tap, completion rate | Data team |
| Deep link update | All features reachable via deep link (backward compat) | All teams |
| A/B testing infra | 50/50 split per segment | Platform team |

### 10.3 Risk Register

| # | Risk | Probability | Impact | Mitigation |
|---|------|------------|--------|-----------|
| 1 | **User không tìm được Chuyển tiền** sau Phase 1 | Medium | High | Quick action nổi bật trên Home + tooltip "Chuyển tiền ở đây" + rage tap detector |
| 2 | **HST timeline trượt** (XanhSM, VHR delay) | High | Medium | Tab Thanh toán không phụ thuộc HST — có đủ HĐ tiện ích. HST = bonus content |
| 3 | **Tab Tài chính trống** nếu SL/BĐS chưa ready Q3 | Medium | High | Guardrail: ≥3 products ready mới launch. Delay 1 tháng nếu cần |
| 4 | **User VN không quen avatar pattern** (Phase 3) | Medium | Medium | Feature flag 4 tuần + tooltip + giữ tab TK song song ban đầu |
| 5 | **Promo pressure từ business** (>30% Home) | High | High | Hard cap 30% trong design system. Escalation path: CPO sign-off cho exception |
| 6 | **Regulatory block** trên sản phẩm tài chính | Low | Critical | BH/CCQ/BNPL có partner licensed. BĐS mã hoá cần legal review riêng |
| 7 | **Engineering resource overload** (3 phase changes/năm) | Medium | Medium | Mỗi phase chỉ đổi 1 tab + 4 tuần prep. Không ship cùng lúc feature mới + nav change |

### 10.4 Dependency Map

```
Phase 1 (30/4)
  ├── P0: ~20 dịch vụ thanh toán ready ← Phụ thuộc API partners
  ├── P0: Chuyển tiền trong Home quick actions ← Frontend only
  └── P1: Feature flag system ready ← Platform team

Phase 2 (Q3)
  ├── P0: Sinh lời full (30/6) ← Backend + partner bank
  ├── P0: Wallet → Lịch sử GD flow ← Frontend only
  ├── P1: BH 4 loại (30/6) ← Insurance partner
  └── P1: Behavioral graduation logic ← Data + Frontend

Phase 3 (Q4)
  ├── P0: V-Point system (30/9) ← Loyalty platform team
  ├── P0: Avatar + profile sheet ← Frontend only
  └── P1: HST deals integration ← Multiple Vingroup partners
```

---

=== 11. Next Steps & Appendix ===

## 11. Next Steps & Appendix

### Next Steps

| # | Action | Owner | Deadline |
|---|--------|-------|----------|
| 1 | Review & approve IA spec (C-level + Product) | CPO | T3 W4 |
| 2 | High-fidelity wireframes cho Phase 1 | Design team | T4 W1 |
| 3 | Feature flag system scoping | Platform lead | T4 W1 |
| 4 | Analytics event taxonomy (tab switch, widget tap, rage tap) | Data lead | T4 W1 |
| 5 | A/B test plan: Chuyển tiền Home quick action | Product + Design | T3 W4 |
| 6 | Phase 1 engineering sprint planning | Engineering leads | T4 W2 |
| 7 | Phase 2 product readiness check (SL + BH timeline) | Product | T6 W2 |

### Appendix

**A. Reference Apps Analyzed**
- Cash App iOS (Nov 2025) — 236 screens
- Revolut iOS (May 2025) — 656 screens
- OKX iOS (May 2024) — 429 screens
- Monzo iOS (2025)
- ZaloPay iOS (2025)
- MoMo iOS (2025)

**B. Input Documents**
- KHHĐ Fintech 2026 (Excel) — ~50 features, phased timeline
- V-Smart Pay v1.0.6 — Production app screenshots (7 screens)
- IA Analysis v1.0 (Vi — Design Lead, 21/03/2026)
- VSP UX Documentation — 34 pages, 119 screens

**C. Key Design Decisions Log**

| Decision | Rationale | Alternative Considered |
|----------|-----------|----------------------|
| CT → Home quick action (không merge vào tab TT) | Mental model khác: CT = "tiền di chuyển", TT = "trả cho dịch vụ" | Merge CT vào TT — rejected vì mode conflict |
| GD merge vào Wallet Card (không giữ tab) | Lịch sử = context của ví, không phải destination. Revolut/Monzo đã merge | Giữ tab GD — rejected vì cần slot cho Tài chính |
| TK → Avatar (không giữ tab) | 1 lần/tháng usage, Cash App pattern proven | Giữ tab TK — rejected vì cần slot cho Ưu đãi |
| 70/30 Home ratio (không 50/50) | MoMo cautionary tale: 70% promo → engagement drop | 50/50 — rejected, business pressure sẽ push >50% promo |
| Behavioral graduation (không force switch) | Giảm confusion, user thấy tab mới khi đã có context | Big bang switch — rejected vì Core Task Completion risk |

**D. Glossary**

| Thuật ngữ | Định nghĩa |
|-----------|-----------|
| MATU | Monthly Active Transacting Users |
| AUM | Assets Under Management |
| HST | Hệ sinh thái (Vingroup ecosystem) |
| SL | Sinh lời (auto-interest feature) |
| CCQ | Chứng chỉ quỹ (mutual funds) |
| BĐS | Bất động sản (real estate) |
| BNPL | Buy Now Pay Later |
| HĐ | Hóa đơn (bills) |
| VAS | Value-Added Services |
| CT | Chuyển tiền (transfer) |
| TT | Thanh toán (payments) |
| TC | Tài chính (finance) |
| ƯĐ | Ưu đãi (deals/loyalty) |
| TK | Tài khoản (account) |

---

*V-Smart Pay IA 2026 — Version 2.0 — 21/03/2026 — Product Design Specification*
*Confidential — Internal use only — Vingroup Financial Technology*

---
Back: [[Home]] · [[knowledge/CLAUDE|Rules]]
