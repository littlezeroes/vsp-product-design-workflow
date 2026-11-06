# Ride-hailing Super App — Entrypoint UX Research

> **Status:** Draft v1
> **Author:** VSP Design (huykieu)
> **Date:** 2026-04-29
> **Audience:** Product, Design, BOD
> **Scope:** Home screen (entrypoint) của các ride-hailing super app trong khu vực SEA + MENA, lấy XanhSM làm chủ thể nghiên cứu.

---

## 0. TL;DR

- **Entrypoint của ride-hailing super app đã hội tụ về một IA chuẩn 5 zone.** Khác biệt giữa Gojek, Grab, Careem nằm ở **cách prioritize wallet, content và service**, không phải ở layout.
- **Wallet hub là retention loop quan trọng nhất** — Gojek đặt wallet ngay trên cùng vì đó là daily-active driver. Grab và Careem nudge wallet activation.
- **XanhSM hiện đang ở giai đoạn chuyển tiếp** từ "ride app thuần" → "super app". Entrypoint hiện tại có 3 điểm sáng (AI prompt, visual taste, gamification) nhưng cũng có 3 gap quan trọng (thiếu wallet surface, hero duplicate với grid, service grid loãng do bị VinFast asset products chiếm 50%).
- **Đề xuất:** giữ AI prompt làm signature, bổ sung wallet hub, dọn lại hero để loại redundancy, restructure service grid về daily-use services.

---

## 1. Method

- **Subject:** 5 ảnh chụp entrypoint của Gojek (2 variant), Grab, Careem (2 variant), so sánh với entrypoint XanhSM hiện tại.
- **Lens:** IA decomposition (zone-by-zone) + UX heuristics + product strategy (retention loop, daily active driver).
- **Scope giới hạn:** chỉ home screen lúc user đã đăng nhập. Không cover onboarding, post-ride, in-trip.

---

## 2. Bối cảnh thị trường

### 2.1 Super app evolution

Ride-hailing super app trải qua 3 giai đoạn:

| Stage | Focus | Entrypoint character |
|---|---|---|
| **1. Pure ride** (2012–2016) | Đặt xe nhanh | Bản đồ + nút "Book" |
| **2. Service expansion** (2016–2020) | Food, delivery, payment | Service grid 4×n |
| **3. Super app / lifestyle** (2020–nay) | Discovery, finance, content | Service grid + content feed + wallet hub |

XanhSM đang ở **stage 2 → 3**. Gojek/Grab đã ở stage 3 ổn định.

### 2.2 Daily active driver

Trong super app, services được phân loại theo tần suất:

```
DAILY        Ride, Food, Wallet (top up, pay)
WEEKLY       Delivery, Mart, Bills
MONTHLY      Membership, Travel, Subscription
RARE         Buy car, Insurance, Loan
```

→ **Quy tắc:** zone đắt giá nhất (top-fold) phải dành cho **daily** services.

### 2.3 Vietnam context

- Grab dominant với ~70% share, Be ~20%, XanhSM mới nhưng tăng trưởng nhanh nhờ EV + VinGroup ecosystem.
- User Việt Nam có 2 hành vi đặc thù:
  1. **Quen với Grab pattern** — change là cost.
  2. **Sensitive với promo** — banner và voucher có ROI cao hơn các thị trường khác.

---

## 3. Competitive teardown

### 3.1 Gojek (Indonesia) — Wallet-first

GoPay là DNA, ride là vehicle để monetize wallet.

```
1. Search "Find services, food, or places"   ← universal intent
2. Banner promo (food deal)
3. WALLET HUB (RpO/GoPay + Pay/TopUp/More)    ← daily action #1
4. Service grid 4×2
   GoRide / GoCar / GoFood / GoSend
   GoMart / GoTagihan / GoShop / More
5. gojekPLUS subscription banner               ← retention
6. Content feed (Tokopedia cross-sell)
7. Bottom nav: Home / Promo / Activity / Chat
```

**Insights:** Wallet hub đặt ngay sau search → mỗi lần mở app, user thấy số dư → friction để top up cực thấp. "Promo" có tab riêng. 8/8 service grid là daily/weekly services.

### 3.2 Grab (SEA) — Marketplace + Finance

```
1. Search "Search places"                      ← destination intent
2. Service grid 4×2
   Food / Transport / Mart / DineOut
   Shopping / Chope / Ride later / All
3. Shortcut row: Activate GrabPay / Add Email / GrabReward
4. Travel Pass subscription banner
5. Promo strip (10%/50%/15% off rides)
6. Content feed
7. Bottom nav: Discover / Activity / Finance / Messages
```

**Insights:** "Ride later" là service riêng. Shortcut row = onboarding nudges thông minh, biến mất khi user đã activate đủ. Bottom nav có "Finance" tab riêng → wallet ngang hàng core flows.

### 3.3 Careem (MENA) — Discovery + retail

```
1. Search "Discover food / Discover places"    ← discovery intent
2. Sign-up / Plus Week banner
3. Service grid 4×2
   Rides / Food / Quik / Pay
   Hala Taxi / Box / Electronics / Home & Spa
4. Shortcut row: Top up / Ride to / Saved address
5. Hala Taxi feature banner
6. Promo grid (50% off, AED 500 off)
7. Brand list feed
```

**Insights:** "Pay" là 1 ô trong grid, không là hub riêng → trade-off: wallet ít visibility nhưng grid sạch. "Quik" (q-commerce) ngang hàng Rides/Food. Search prompt adaptive theo context.

### 3.4 XanhSM (current) — AI-prompt + VinFast ecosystem

```
1. Search "Bạn muốn đi đâu?"                    ← destination intent
2. AI suggest block "Di chuyển nhanh với Bike"  ← personalization (UNIQUE)
   - Đặt xe đi The Coffee House
   - Đặt xe đi AMERICANO COFFEE
3. Filter chip: Đặt đồ ăn / Đặt xe ô tô
4. Hero card 2×1: Gọi xe / Gọi đồ ăn           ← duplicate of grid
5. Service grid 4×2
   Xe máy / Giao hàng / Hội viên / Thẻ quà tặng
   Thuê xe tự lái / VinBus / Liên tỉnh / Mua VinFast
6. GreenSM rewards banner
7. Bottom nav 5 tabs + floating Trophy (gamification)
```

**Insights:** AI prompt là dấu ấn duy nhất trong khu vực. Service grid 4/8 ô là VinFast asset products → tần suất thấp. Không có wallet hub dù chiến lược BIDV-link đã công bố.

---

## 4. IA framework — 5 zone universal

```
┌─────────────────────────────────────────────┐
│ ZONE 1 — Search / Discovery                  │
│   intent capture: destination | service | content │
├─────────────────────────────────────────────┤
│ ZONE 2 — Quick Action                        │
│   wallet hub | shortcut row | personalized prompt │
├─────────────────────────────────────────────┤
│ ZONE 3 — Service Grid (4×2 = 8 cells)        │
├─────────────────────────────────────────────┤
│ ZONE 4 — Content Feed                        │
│   promo | subscription | gamification | banner │
├─────────────────────────────────────────────┤
│ ZONE 5 — System Nav (4–5 tab)                │
└─────────────────────────────────────────────┘
```

**Quy tắc:**
- Zone 1 và 3 là invariant — mọi app đều có.
- Zone 2 là **đòn bẩy chiến lược** — chỗ tuyên bố DNA:
  - Wallet → wallet-first (Gojek)
  - Shortcut adaptive → onboarding-first (Grab)
  - AI prompt → AI-first (XanhSM)
  - Bỏ trống → discovery-first, banner chiếm chỗ (Careem)
- Zone 4 cho retention/cross-sell. Zone 5 cho navigation depth.

---

## 5. XanhSM diagnosis & principles

### 5.1 Heuristic check

| Heuristic | Pass? | Note |
|---|---|---|
| **One entrypoint per flow** | ❌ | 3 entrypoint cho đặt xe máy: AI prompt + Hero "Gọi xe" + grid "Xe máy" |
| **Daily before monthly** (top-fold) | ❌ | 4/8 ô grid là VinFast asset (Thuê xe, VinBus, Liên tỉnh, Mua VinFast) — monthly/rare |
| **Wallet earns surface** | ❌ | Không có wallet hub. Embedded wallet không có nơi để land |
| **Search intent rõ** | ✅ | Destination-first khớp DNA ride |
| **Personalization context-aware** | ⚠️ | AI prompt có nhưng chưa rõ time/location aware, chưa có dismiss |
| **Filter chip ở đúng vị trí** | ❌ | Chip thường modify list bên dưới; ở đây modify block phía trên → confusing |

### 5.2 Strengths cần giữ

1. **AI prompt block** — signature differentiator, không đối thủ nào có.
2. **Visual taste** — pastel teal, glassmorphism bottom nav, premium hơn Grab/Gojek.
3. **Gamification surface** — floating trophy, lifestyle-friendly hơn promo banner truyền thống.

### 5.3 Risk

- **Giữ nguyên khi launch wallet:** wallet không có entry surface → adoption chậm → break promise của VSP × XanhSM strategy.
- **Rip & replace theo Grab pattern:** mất AI prompt → mất differentiator duy nhất.

### 5.4 5 design principles (guardrail)

1. **One entrypoint per flow.** Mỗi flow chính chỉ có 1 nơi khởi động. AI prompt OK nếu là personalized shortcut, không duplicate hero + grid cho cùng service.
2. **Daily before monthly.** Top-fold (zone 1–3) chỉ chứa daily/weekly services. VinFast asset products move xuống "Xem tất cả" hoặc dedicated VinFast hub.
3. **Wallet earns its place.** Wallet phải hiện diện ở zone 2 — không chiếm chỗ AI prompt mà bổ sung **ở dưới** AI prompt.
4. **AI prompt là signature, không phải gimmick.** Phải context-aware (time, location, history) và có "tại sao" minh bạch.
5. **Trade content for action.** Giảm banner promo top-fold. Promo có activity tab riêng (như Gojek). Top-fold ưu tiên action.

---

## 6. Decision options

3 hướng đi để chốt với Product/BOD:

### Option A — Hold (giữ nguyên)

> Chấp nhận entrypoint hiện tại, không thay đổi cho đến khi có data.

- **Cost:** rất thấp.
- **Risk:** wallet launch không có surface → adoption thấp; service grid loãng tiếp tục đẩy daily flow xuống.
- **Phù hợp khi:** team không có bandwidth, hoặc đang muốn thu thập baseline trước khi can thiệp.

### Option B — Evolve có chọn lọc ⭐ (recommended)

> Giữ AI prompt làm signature, dọn redundancy, bổ sung wallet hub theo wallet-nudge pattern (Grab).

**Thay đổi:**
- Bỏ hero card 2×1 "Gọi xe / Gọi đồ ăn" (duplicate với grid và AI prompt).
- Đổi filter chip → segmented control trong AI block hoặc bỏ luôn.
- Thêm **wallet shortcut row** ngay dưới AI prompt: `Số dư · Top up · Pay · Lịch sử` (pattern Grab — chỉ hiện khi wallet activated; nếu chưa, hiện "Activate VSP wallet").
- Restructure service grid: giữ 4 ô daily (Xe máy, Giao hàng, Hội viên, Thẻ quà tặng), gom 4 ô VinFast vào dedicated "VinFast Hub" hoặc đẩy "Xem tất cả".
- AI prompt: thêm context (sáng → cà phê, chiều → về nhà), thêm dismiss "Không phải", hiện badge "Vì bạn đi 3 lần/tuần".

- **Cost:** 1–2 sprint design + dev.
- **Risk:** thấp — không phá visual taste, giữ AI signature.
- **Phù hợp khi:** muốn launch wallet trong Q3 và tránh disruption lớn.

### Option C — Rip & rebuild theo Gojek pattern

> Wallet-first super app — wallet hub chiếm zone 2, AI prompt thành phần tử nhỏ trong zone 4.

**Thay đổi:**
- Wallet hub full-width ngay sau search (theo pattern Gojek).
- AI prompt thu nhỏ thành 1 row insight ở zone 4.
- Service grid full daily-use, không còn VinFast asset.
- Bottom nav restructure: thêm "Finance" tab.

- **Cost:** 4–6 sprint, kéo theo nhiều flow downstream.
- **Risk:** cao — mất differentiator AI prompt; user XanhSM hiện hữu phải re-learn.
- **Phù hợp khi:** wallet trở thành business priority #1, AI prompt đo được không hiệu quả.

### Recommendation

**Đi Option B trong 6 tháng đầu.** Đo wallet adoption, AI prompt CTR, service grid usage. Sau 6 tháng, nếu wallet adoption < target → escalate sang Option C; nếu AI prompt CTR < 5% → cân nhắc demote AI prompt.

---

## Source

- 5 ảnh chụp entrypoint do team thu thập (nguồn Mobbin): Gojek variant 1 & 2, Grab, Careem variant 1 & 2.
- XanhSM screenshot ngày 2026-04-29 (user's device).
