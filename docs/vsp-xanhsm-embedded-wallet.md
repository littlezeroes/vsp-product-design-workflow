# VSP × XanhSM — Embedded Wallet Design Dossier

**Scope:** Thiết kế tầng VSP nhúng trong XanhSM — 5 khoảnh khắc hành trình + 3 signature flow + receipt card system.
**Người viết:** Kiều Mạnh Huy · Staff Principal Product Designer, VSP
**Ngày:** 23/04/2026
**Đọc trong:** ~25 phút full, 5 phút executive.
**Tone:** Senior-to-senior. Không scaffolding.

---

## 0 · Executive synthesis — và chỗ tôi push back

### Tiền đề tôi đồng ý
Ecosystem lock-in (XanhSM · VinFast · V-Green · Vincom · Vinschool · Vinpearl · VinMec) là cái MoMo/ZaloPay không có và không thể copy. Đó là **moat cấu trúc**, không phải feature moat.

### Chỗ tôi KHÔNG đồng ý với brief
1. **"Ride-hailing là funnel acquisition lý tưởng cho ví"** — nửa đúng. Ride payment là **invisible payment** (tap → pay → quên). User không nhìn thấy ví trong lúc trả tiền nữa. Funnel acquisition thực ra là moment **SAU** chuyến (receipt) và moment **NGOÀI** chuyến (ambient home) — không phải checkout. Nếu thiết kế cho checkout, ta sẽ cạnh tranh với MoMo/ZaloPay ở mặt trận họ đã thắng. Nên đổi trọng tâm về **post-ride + ambient**.

2. **"Split fare là feature giá trị"** — false for Xanh Bike/Car. Chuyến 50-80k chia 3 người = 25k/người. Ma sát UI > giá trị tiết kiệm. Chỉ valuable khi chuyến ≥ 200k (Limo, Airport, Liên Tỉnh). Phải **gate theo amount + service tier**, không show default.

3. **"BNPL inline cho chuyến cao giá"** — ok, nhưng phải gate CỰC CHẶT. BNPL cho chuyến Bike 35k là grotesque và rủi ro thương hiệu. BNPL chỉ xuất hiện khi: ride ≥ 500k VND, HOẶC membership/gói dài hạn. Dưới mức đó, chip không được hiện — kể cả user có limit.

4. **"Auto-yield làm ambient upsell trong XanhSM"** — phải OFF default trong XanhSM. Yield banner trong ride-hailing app = nhà băng đang cấy quảng cáo. Opt-in phải xảy ra trong VSP tab, không phải trong XanhSM. Sau khi opt-in rồi, yield chỉ xuất hiện ở dạng **micro-signal** ("+127₫ hôm nay" dưới balance chip) — proof of life, không phải marketing.

### Một nguyên tắc guồng toàn doc

> **Trong XanhSM: VSP phải biến mất, trừ khi có ROI rõ.**
> **Trong VSP tab: mobility là 1 trong N category PFM, không phải trung tâm.**
> **Giao giữa 2 = receipt screen.** Đó mới là prime real estate thực sự.

---

## 0.5 · MVP SCOPE — chỉ với capability đã ship T4/2026

**Capability dùng được ngay:**
- eKYC
- Liên kết ngân hàng (BIDV live)
- Nạp / Rút
- QR nhận tiền
- Pay ride bằng VSP balance (baseline integration đã có)

**Tất cả phần còn lại của doc (yield, BNPL, family, group, insurance, V-Point, PFM, split fare, voucher, auto-pay) là Phase 1+.** Đừng nhét vào MVP.

### MVP = chỉ làm đúng 4 việc

**MVP.1 — Onboarding nhúng trong XanhSM checkout**
Lần đầu user book ride, chưa có VSP account → payment method selector có 1 chip mới:
```
Phương thức:
○ MoMo · kết nối
○ ZaloPay · kết nối
○ Thẻ ****4521
○ Tiền mặt
─────────────────────────
● Tạo ví VSP — 0 phí ride     NEW
   Setup 2-3 phút · 1 lần
```
Tap → deep link V-App VSP onboarding:
1. eKYC (đã có)
2. Link BIDV (đã có)
3. Nạp lần đầu — gợi ý mức bằng giá ride × 3
4. Deep link quay về XanhSM, VSP giờ là chip chọn được

Zero capability mới. Pure UX decision + deep linking.

**MVP.2 — VSP là payment chip mặc định (sau lần đầu)**
User đã có VSP + balance đủ → VSP tự default. Booking screen:
```
● VSP · 156.000₫     [Đổi]
```
1 dòng, không modal, không xác nhận. 95% ride không đụng.

**MVP.3 — Top-up inline khi balance không đủ**
```
● VSP · 30.000₫ (thiếu 18.000₫ cho chuyến này)
   [Nạp 50.000₫ từ BIDV ****4521]
   [Đổi phương thức]
```
Tap "Nạp 50.000₫" → half-sheet OTP/biometric → 3-5s → chip update "VSP · 80.000₫" → user tap Đặt. Gợi ý mức làm tròn trên số thiếu.

**MVP.4 — Receipt tối giản**
Không card contextual, không rule engine, không upsell.
```
✓ Đã trả 48.000₫ từ VSP
Còn 32.000₫ trong ví

Xanh Car · Vinhomes → Văn phòng · 12p
⭐⭐⭐⭐⭐ Anh Tuấn

[Xem hoá đơn]  [Đặt tiếp]
```

### MVP — những gì CẮT

| Phần | Tại sao cắt |
|---|---|
| Moment 1 yield micro-signal | Chưa có auto-yield (T5-7) |
| Moment 2 BNPL chip | Chưa có BNPL (T8-9) |
| Moment 2 insurance chip | Chưa có insurance (T5-7) |
| Moment 2 split fare chip trong XanhSM | Split bill đã có trong VSP — MVP link user qua VSP tab thay vì inline |
| Moment 3 family live-share | Chưa có family wallet (T5-7) |
| Moment 4 receipt card 1-8 | Đa số card cần capability T5-9 — cắt hết cho MVP |
| Moment 5 PFM mobility | Chưa có PFM engine |
| Signature 1/2/3 | Đều cần capability chưa ship |
| V-Point framing | Chưa có V-Point earning (T8-9) |

### MVP role của "QR nhận tiền"

**Không nằm trong XanhSM flow.** QR nhận tiền là capability của VSP tab — user share QR để người khác chuyển tiền vào (chia bill cà phê, bạn trả lại tiền ăn, v.v.).

**Trong ride context**, QR nhận tiền xuất hiện gián tiếp:
- User ngồi cùng xe bạn, user trả → bạn muốn gửi trả 1/2 giá ride.
- Link nhẹ từ receipt (optional, phase 0.5): "Đi cùng ai? Chia sẻ mã nhận tiền" → mở VSP tab "Nhận tiền" (feature đã có).
- **Không xây dialog split trong XanhSM**. Đường tắt deep link là đủ.

### MVP success metric (90 ngày đầu)

| Metric | Target | Note |
|---|---|---|
| % XanhSM user thấy "Tạo ví VSP" chip | 100% | Chip luôn hiện cho user chưa có VSP |
| CTR "Tạo ví VSP" chip | ≥ 8% | Baseline; < 5% thì copy/vị trí sai |
| Onboarding completion (eKYC → first top-up) | ≥ 60% | Drop-off nặng nhất là eKYC |
| % ride trả bằng VSP trong cohort đã có VSP | ≥ 40% sau 30 ngày | Nếu thấp → default chưa đúng hoặc top-up khó |
| Top-up inline conversion khi balance thiếu | ≥ 60% | < 40% = top-up flow quá nặng |
| Ride trả VSP có NPS micro-survey | ≥ +40 | Guard rail — không damage UX XanhSM |

### MVP timeline realistic

| Tuần | Việc |
|---|---|
| W1-2 | Design + token alignment — chip, top-up sheet, receipt minimal |
| W3-4 | XanhSM side wiring (onboarding deep link, payment selector modification) |
| W5-6 | VSP side — return deep link từ onboarding về XanhSM ngay, không bắt user tự quay |
| W7 | QA end-to-end · edge cases (eKYC fail, bank link timeout, top-up fail, refund) |
| W8 | 5% rollout · metric dashboard |
| W9-10 | Iterate copy + chip position theo CTR |
| W11-12 | 100% rollout nếu metric đạt |

**Designer resource:** 1 người (Huy) — feasible trong 12 tuần vì 90% là UI work trên capability đã có. Backend là deep link + existing API.

### Tại sao MVP dừng ở đây

1. **Prove the funnel trước khi build moat.** Nếu MVP không chuyển ≥ 8% user XanhSM → VSP, thì mọi feature phase 1+ (family, BNPL, yield) đều built trên user base giả. Cần validation thật.
2. **Giảm blast radius.** XanhSM là production app triệu user/ngày. Mỗi UI change trên payment selector = regression risk. MVP ship 1 chip mới + 1 inline sheet. Phase 1+ thêm receipt card system là scope lớn hơn, cần MVP stable trước.
3. **1 designer resource.** 12 tuần cho MVP là chặt. Nhét thêm thứ = miss ship date hoặc chất lượng tệ. Kỷ luật cắt là yêu cầu.

### Phase gate — khi nào mở Phase 1

**Ship Phase 1 (receipt cards + family beta + yield opt-in)** CHỈ KHI:
- MVP 100% rollout stable ≥ 30 ngày.
- % ride trả bằng VSP trong cohort VSP ≥ 40%.
- Crash/error rate không tăng so với baseline XanhSM.
- 2+ capability T5-7 đã ship + tested trong VSP standalone (insurance, family wallet).

Không đạt → hold Phase 1, iterate MVP. Không ship vì "quý đã vào kế hoạch."

---

## 1 · Benchmark matrix (8 apps × 22 features)

Ký hiệu: ● có · ○ có nhưng yếu · — không có · ✗ đã bỏ / đã tách

| Feature | Grab (SEA) | Gojek/GoPay (ID) | Uber (US) | Lyft (US) | DiDi (CN) | Ola (IN) | Careem (GCC) | 99 (BR) |
|---|---|---|---|---|---|---|---|---|
| Ví tích hợp trong app | ● GrabPay | ● (& standalone) | ● Uber Cash | ● Lyft Cash | ● DiDi Pay | ○ (split off) | ● Careem Pay | ● 99Pay |
| Default payment = ví (invisible) | ● | ● | ● | ● | ● | ○ | ● | ● |
| Balance visibility trên home ride | ○ chỉ checkout | ○ trong GoPay tab | — | — | ● | — | ● | ○ |
| Auto-top-up (threshold based) | ● | ● | ● | ● reward tiered | ● | ○ | ● | ○ |
| Interest/yield on balance | — | ● GoPay Tabungan | — | ✗ (explicit "no") | ● (tài trợ) | — | — | — |
| Cashback on rides | ○ (promo only) | ○ | ○ (promo) | ● Cash Rewards 2-5% | ● | ○ | ● | ○ |
| Loyalty points earn in-ride | ● GrabRewards | ● GoClub | ● Uber One | ● Lyft Pink | ● | ● OlaSelect | ● Careem Rewards | — |
| Loyalty → ride redemption | ○ indirect | ● | ● | ● | ● | ● | ● | ○ |
| BNPL integrated | ● GrabPay Later (4mo 0%) | ● GoPayLater | ○ (Klarna 3rd party) | — | ● (trong DiDi Finance) | ○ | ○ | — |
| BNPL inline at ride payment | ● | ● | — | — | ○ | — | — | — |
| Split fare in app | ● (group) | ● | ● (shared rides) | ● | ● (WeChat group link) | ○ | ○ | — |
| Family / teen account | ● Teen Account | — | ● Uber Teen | ● Lyft for Teens | ● | ○ | — | — |
| Parent live-view child ride | ● | — | ● | ● | — | — | — | — |
| Per-member spending limit | ○ | — | ○ | ○ | ● | — | — | — |
| Group/shared wallet | — | — | — | — | ● (WeChat) | — | — | — |
| In-ride insurance offer | ● | ● | ○ (airport) | ○ | ● | ○ | ● | ○ |
| Post-ride contextual card | ○ (promo banner) | ○ | ● (tip + rate) | ● (rewards tile) | ● (đa dạng) | ○ | ● | ○ |
| Receipt → merchant expansion CTA | ○ | ● (mạnh) | — | — | ● | — | ● | — |
| Mobility PFM category | — | ● (GoTagihan) | — | ● (bill summary) | ● | — | ○ | — |
| Auto-pay recurring | ● (bills) | ● | ○ (Uber Pass) | ● (Lyft Pink) | ● | ○ | ● | — |
| Cross-ecosystem pay (food/shopping) | ● | ● | ● Uber Eats | — | ● | — | ● | ○ |
| Chat context (detect group intent) | — | — | — | — | ● WeChat tight | — | — | — |

### Đọc matrix thế nào

- **DiDi** là app ride-hailing có ví tích hợp sâu nhất thế giới — nhưng vì TQ có WeChat + Alipay ép buộc integration, không replicable 100% ở VN.
- **Lyft Cash Rewards** (2025-2026) là pattern mới thú vị: auto-reload tiered rewards 2-5% thay vì yield. Là **"cash-back as loyalty"** — không phải yield thật nhưng feel giống.
- **Uber** giữ wallet cực kỳ invisible — Uber Cash auto-apply, không ai nhớ. Đó là mô hình cần trong 95% trường hợp của XanhSM.
- **GoPay** tách standalone (8/2023) không phải vì siêu-app fail — mà **để reach tier-2/3** nơi super-app quá nặng. Đây là chiến lược phân khúc, không phải rút ra vì thua.

---

## 2 · Pattern library — cái STEAL và cái AVOID

### 2.1 STEAL

**(S1) Invisible-by-default payment (Uber, Grab)**
Default = last method. Không mở dialog. Chip nhỏ hiển thị ở góc booking screen, tap để đổi. 95% ride không ai đụng vào.

**(S2) BNPL as payment chip, not as loan flow (Grab, Gojek)**
BNPL sống trong payment selector như 1 phương thức. Không bao giờ có "Đăng ký vay" button lớn. Không có marketing banner BNPL trên home. User đã pre-approved → chip xuất hiện inline. Chưa approve → không hiện gì.

**(S3) Tiered auto-reload rewards (Lyft Cash Rewards 2025)**
Reload $25 → 2% · $50 → 4% · $100 → 5%. Tiền vào ví không sinh lãi, nhưng **reload có reward**. Framing biến "nạp tiền" thành "tiết kiệm". Fit với người dùng VN chưa quen khái niệm lãi.

**(S4) Post-ride tile stack (DiDi)**
DiDi receipt screen luôn có 1-2 tile contextual: invoice · driver rate · promo · next ride book. Tile được chọn theo rule engine, không phải banner quảng cáo.

**(S5) Teen account with geo-fenced + time-fenced rules (Uber Teen, Lyft for Teens, Grab Teen)**
3 app này đã chuẩn hóa: parent approve setup → teen book độc lập → parent nhận live share. KEY: parent không phải approve từng chuyến. Auto-approve trong limit/rule; chỉ alert khi out-of-bound.

**(S6) Mobility category as standalone PFM lens (Lyft, GoPay GoTagihan)**
Người dùng thích xem "tôi đã tiêu X cho đi lại tháng này" — category-first visualization. Không phải transaction list ngược thời gian.

**(S7) Redemption framed in consumption units (nhiều app)**
"430 điểm = 1 chuyến Bike miễn phí" thay vì "430 điểm". Tangible framing tăng conversion 2-3x theo nhiều case study.

### 2.2 AVOID

**(A1) Yield banner trên ride app (hypothetical, nhưng nhiều ví châu Á đã thử)**
"5.5%/năm tự động" hiện trên home ride = quảng cáo sản phẩm bank trong môi trường không liên quan. Damage trust: user cảm giác đang bị cross-sell. Framing presence-first, không upsell.

**(A2) Tip UX đậm (Uber, Lyft)**
Post-ride dialog 15%/20%/25% là pattern Mỹ. VN không có văn hóa tip. Import nguyên trạng = ma sát. Max là optional "bo thêm" nhỏ, không có dialog bắt chọn.

**(A3) QR payment to random merchant trong ride app (hypothetical — MoMo đã thắng)**
Không có lý do XanhSM có QR scan. Đó là địa hạt của MoMo/ZaloPay. Mở QR = tự nhận là super-app → user confused tại sao mở XanhSM để scan QR ngoài đời. Né mặt trận này.

**(A4) Checkout friction "Confirm payment method" (Ola early 2020s)**
Mỗi ride bắt confirm phương thức = đổ trách nhiệm chọn sang user mỗi lần. Ola đã bỏ. Grab/Uber chưa bao giờ có. Đừng copy.

**(A5) BNPL marketing trên home (nhiều ví Đông Nam Á)**
Banner "Trả sau 0 lãi suất — Đăng ký ngay" trên home XanhSM = biến app đi lại thành kênh vay. Rất tệ về regulation risk + reputation risk. BNPL chỉ xuất hiện inline khi context cho phép.

**(A6) Group wallet dạng GroupBuy (Tiki, Shopee)**
Nghe hấp dẫn nhưng fit với e-commerce, không fit ride. Chuyến là event cá nhân (hoặc nhóm nhỏ có người dẫn). Đừng cố social-ize checkout.

---

## 3 · Top 10 insights — prioritized by relevance VSP × XanhSM

1. **Invisible wins checkout.** 95% ride chỉ tap → pay. Mọi upsell/dialog trong checkout là tax. VSP priority #1 trong XanhSM: đừng đòi user chọn gì.

2. **Post-ride receipt = prime real estate, không phải booking screen.** User đã pay, đã rate driver, chờ close. Đây là khoảnh khắc duy nhất user sẵn lòng đọc 1 thông điệp.

3. **"Money waiting to ride also earns yield" là signature concept — nhưng signature phải SILENT.** Yield là proof of life, không phải banner. Micro-signal "+127₫ hôm nay" dưới balance chip ≫ banner 5.5%/năm.

4. **Family wallet × child commute là moat thật.** Chỉ Vingroup có wallet + ride + school trong 1 nhà. Không cần API Vinschool — dùng self-declared route đủ để MVP. Cạnh tranh với MoMo ở đây = thắng tự động vì MoMo không có ride fleet kiểm soát.

5. **BNPL phải gate bằng amount, không bằng user segment.** Không có chuyện "user A có limit nên thấy BNPL mọi ride". Ride 35k thấy BNPL = tệ. Ride 1.6M thấy BNPL = hữu ích.

6. **Split fare chỉ có giá trị khi ride ≥ 200k.** Default off. Chỉ hiện ở Limo, Airport, Liên Tỉnh, hoặc declared group trip.

7. **V-Point framing: "1 chuyến Bike miễn phí cách bạn 70 điểm" ≫ "430 V-Point".** Convert sang unit mà user muốn.

8. **GoPay standalone không phải cautionary tale — nó là chiến lược phân khúc.** Bài học VSP: nếu định tách thành app riêng, phải có mục tiêu phân khúc rõ (VD: "VSP Lite" cho user không có V-App). Không tách chỉ vì chính trị.

9. **Vietnam tipping is dead, splitting is common, family sharing is strong.** Import pattern US/EU có filter: cắt tip, giữ split (gated), amplify family.

10. **MoMo/ZaloPay thắng QR-to-merchant. VSP thắng ecosystem-to-ecosystem.** Đừng cố địa hạt MoMo. Focus: XanhSM → V-Green charging → Vincom mall → Vinschool fee → Vinpearl stay. Flow chuỗi, không phải QR đơn lẻ.

---

## 4 · Vietnam-specific UX context

| Dimension | VN pattern | Hàm ý thiết kế |
|---|---|---|
| Tipping | Không phổ biến ở ride-hailing (khác MoMo bill split hay waiter) | KHÔNG import tip dialog Uber/Lyft. Max "bo thêm 5k" optional chip sau rating 5★ |
| Splitting | Phổ biến giữa bạn bè ăn/uống/đi chơi, nhưng ride rẻ thường 1 người trả rồi đòi sau qua Zalo | Split trong ride-hailing khi ride ≥ 200k. Split thông qua deep link share Zalo, không bắt ở-trong-app |
| Family financial sharing | Mạnh — cha mẹ trả cho con là chuẩn, không phải option | Family wallet là signature. Teen account không bị kỳ thị "con chưa đủ tuổi xài tiền" — ngược lại là status |
| Wallet trust | MoMo 10+ năm, ZaloPay ~8 năm, VNPAY QR phổ biến. VSP mới, chưa có trust mass | Trust build qua ecosystem visibility (BIDV linked, VinFast seen) chứ không qua banner "An toàn tuyệt đối" |
| Credit/vay ngại | Credit card penetration ~7% | BNPL framing không bao giờ dùng từ "vay". Dùng "trả dần X kỳ" hoặc "chia làm N lần" |
| Motorbike dominance | Xe máy phủ ≫ ô tô. Airport/inter-province rare cho average user | BNPL, insurance chỉ surface ở top-tier services (Car/Limo/Airport/Inter-Province) — không trên Bike |
| Super-app fatigue | MoMo/Zalo đã quá nhiều tab | VSP trong V-App là 1 tab; VSP trong XanhSM phải invisible hơn nữa |

---

## 5 · Design deep dive — 5 khoảnh khắc

### Nguyên tắc guồng chung
1. **Presence > upsell** trong XanhSM.
2. **1 signal / screen max.** Nhiều là nhiễu.
3. **Default path 0 friction.** Option path OK friction.
4. **Ngôn từ: trung tính > hype.** Không "tuyệt vời", không "siêu tiết kiệm".

---

### Moment 1 — Pre-ride (mở XanhSM)

**User story:**
> "Tôi mở XanhSM để đi đâu đó. Nếu ví có gì đáng biết, cho tôi biết trong 0.5s; còn không, đừng cản đường tôi book ride."

**Key tension:** XanhSM là app di chuyển. User không vào để check ví.

**Design move:**
```
┌────────────────────────────────┐
│ [avatar]   XanhSM        [⚙]  │ ← Status+Nav (từ XanhSM, không đụng)
├────────────────────────────────┤
│ 💳 VSP · 2.486.000₫  +127₫ ✨ │ ← Balance chip (32px cao, optional row)
│                                │
│ Bạn đi đâu?                    │ ← Large search (XanhSM default)
│ ┌──────────────────────────┐   │
│ │ 🔍 Nhập điểm đến...      │   │
│ └──────────────────────────┘   │
│                                │
│ Gợi ý: [Vinhomes] [Văn phòng]  │
│        [Trường bé Minh]        │
│                                │
│ [cards dịch vụ: Bike/Car/...] │
└────────────────────────────────┘
```

- **Balance chip** 1 dòng 32px, có thể ẩn/hiện theo user toggle trong cài đặt XanhSM.
- **"+127₫ ✨"** chỉ hiện nếu user đã opt-in yield. "✨" là icon tiny, không decoration. Tap chip → half-sheet VSP mini (top-up nhanh, link bank, recent).
- **KHÔNG** full navigation sang VSP tab. Sự cắt ngang hành trình đi lại sang hành trình banking là anti-pattern.
- **KHÔNG** hiện yield nudge lần đầu. Nudge xảy ra trong VSP tab, không trong XanhSM.

**Capability dependency:** Đã ship (balance + bank link). Yield: tháng 5-7.

**Success metric:**
- % user tap balance chip ≤ 8% (nếu > 15% nghĩa là user đang phải-check chứ không phải ambient).
- Chip dismiss rate (nếu toggle off > 30% → thiết kế fail, balance chip gây khó chịu).

---

### Moment 2 — Booking (chọn đích + xe)

**User story:**
> "Tôi đã có điểm đến. Tôi chỉ muốn chọn xe và đi. Đừng hỏi tôi về thẻ, vay, bảo hiểm, trừ khi thật sự đáng."

**Design move:**
```
┌────────────────────────────────┐
│ ← Đặt chuyến                   │
├────────────────────────────────┤
│ 📍 Vinhomes Ocean Park         │
│ 🎯 Nội Bài · 45km · ~1h        │
├────────────────────────────────┤
│ ┌─────┐  Xanh Car        520k  │
│ │ 🚗  │  5p · 4 chỗ            │
│ └─────┘                        │
│                                │
│ ┌─────┐  Xanh Limo       780k  │
│ │ 🚙  │  Cao cấp · VIP         │
│ └─────┘                        │
│                                │
│ ┌─────┐  Xanh Airport    640k  │
│ │ ✈   │  Có bảo hiểm 💡        │ ← context hint
│ └─────┘                        │
├────────────────────────────────┤
│ 💳 VSP · đủ         [Đổi]      │ ← payment chip compact
│                                │
│ Chuyến xa → trả dần 3 kỳ?      │ ← BNPL chip (conditional)
│ 173k × 3 · 0% lãi              │
│ [Bỏ qua] [Trả dần]             │
├────────────────────────────────┤
│         [ĐẶT CHUYẾN]           │
└────────────────────────────────┘
```

**Rule engine cho chip xuất hiện** (priority order — chỉ 1 chip/lần):

| Chip | Trigger | Ride threshold |
|---|---|---|
| **BNPL** | Ride ≥ 500k AND user pre-approved BNPL limit | Chỉ Car/Limo/Airport/Inter-Province |
| **Insurance travel** | Airport/Inter-Province AND chưa mua gói insurance XanhSM | 15k-30k depending on distance |
| **Split fare** | Ride ≥ 200k AND (user declared group OR user in active group wallet) | Car/Limo/Airport/Inter-Province |
| **Auto-pay commute** | Cùng route ≥ 5 lần / 14 ngày | No threshold, nhưng Bike/Car daily only |
| **Membership hint** | Ride ≥ 10 tháng này, user chưa có XanhSM membership | — |
| **Voucher apply** | Có voucher còn hiệu lực cho tier này | — |

- **Chỉ 1 chip/screen.** Nếu trùng, ưu tiên theo thứ tự bảng.
- **BNPL chip** mặc định collapse. Tap "Trả dần" → mới expand kỳ/ngày.
- **Payment chip "VSP · đủ"** hiển thị 1 dòng. Tap [Đổi] → half-sheet list methods. Không mở modal full screen.
- **"Gợi ý bảo hiểm"** như 💡 hint TRÊN tile Airport, không phải dialog. User hover/tap mới expand.

**Capability dependency:**
- BNPL: tháng 8-9 (full flow)
- Insurance: tháng 5-7
- Auto-pay: tháng 10-12
- Split fare (với group wallet): tháng 5-7
- Voucher: tháng 5-7

**Success metric:**
- BNPL chip CTR ≥ 12% khi xuất hiện, conversion ≥ 50% nếu tap (chỉ ra relevance).
- Payment chip tap rate < 5% (nghĩa là default đúng).
- Post-booking abandonment < 3% (chip không gây confuse).

---

### Moment 3 — In-ride

**User story:**
> "Tôi đang ngồi xe. Đừng có gì phiền tôi. Trừ khi tôi là phụ huynh đang theo dõi con đi học."

**Design move:** Minimal interference. Toàn bộ UI là của XanhSM (bản đồ + ETA + chat driver). VSP không chen ngang.

**Exception duy nhất — Family live-share (parent side, trong V-App):**
```
[V-App notification]
───────────────────────────────
👦 Bé Minh đang về nhà
───────────────────────────────
🚲 Xanh Bike · Trường → Nhà
📍 Đã đi 2.1/5.4km · ETA 12p
💳 Giữ tiền: 45.000₫

[Xem bản đồ]  [Nhắn tài xế]
───────────────────────────────
```

- Notification opens V-App > Family tab > Live share screen (map + driver info + contact driver button).
- Parent KHÔNG thấy balance chip, KHÔNG thấy ads. Chỉ safety-relevant info.
- Child-side UI hoàn toàn như bình thường, không có "parent đang xem" indicator (tránh tạo áp lực).
- Khi child đến nhà: notification "Minh đã đến nhà 16:42" + tự close live map.

**Anti-pattern cần né:**
- Không push "Thời gian rảnh, check voucher?" trong ride.
- Không cross-sell bảo hiểm trong ride (chỉ trước, không phải đang).
- Không hỏi "rate ride ngay?" khi chưa kết thúc.

**Capability dependency:** Family wallet (tháng 5-7) + live-share notification (build mới, tận dụng XanhSM tracking có sẵn).

**Success metric:**
- Parent-side open-rate của notification ≥ 40% (signal of real use).
- Child-side UI không có interference click nào (bằng 0).

---

### Moment 4 — Post-ride receipt 🎯 (receipt card system)

**User story:**
> "Tôi vừa xuống xe. Tôi muốn: 1) xác nhận tiền đã trả, 2) rate tài xế, 3) đi tiếp việc của tôi. Tôi có 5-10s attention cho cái thứ 4 nếu nó đáng."

Receipt screen = 3 block:

```
┌────────────────────────────────┐
│ ✓ Chuyến xong                  │ ← success header
│                                │
│ 520.000₫ · Xanh Car            │
│ Vinhomes OP → Nội Bài · 58p    │
│                                │
│ ⭐⭐⭐⭐⭐ Anh Tuấn · 4.9          │
├────────────────────────────────┤
│ ┌──────────────────────────┐   │
│ │ [CONTEXTUAL ACTION CARD] │   │ ← 1 card, selected by rule
│ │                          │   │
│ └──────────────────────────┘   │
├────────────────────────────────┤
│ [Xem hoá đơn]  [Đặt tiếp]     │ ← safe exits
└────────────────────────────────┘
```

#### 4.1 Card template library (8 cards)

##### C1 — Yield awareness
```
💰 Số dư đang sinh thêm
─────────────────────────
Sau chuyến này: 1.966.000₫
Đang nhận ~+12₫/ngày từ tiết kiệm tự động.

[Xem tiết kiệm]
```
- Trigger: user opt-in yield AND balance sau ride ≥ 500k.
- Frequency cap: 1×/tuần/user. Không show cho 90% ride.

##### C2 — Split
```
👥 Đi cùng 2 người?
─────────────────────────
520k chia 3 = 173k/người.
Gửi link yêu cầu chia qua Zalo.

[Chia tiền] [Không]
```
- Trigger: ride ≥ 200k AND (user đã declare group khi book OR trong group wallet active).
- Tap "Chia tiền" → generate deep link Zalo với số tiền, tự động request qua VSP P2P.
- Frequency: no cap (always relevant khi trigger match).

##### C3 — BNPL awareness (educational, not retroactive)
```
💳 Lần sau chuyến này có thể trả dần
─────────────────────────
Chuyến ≥ 500k đủ điều kiện chia 3 kỳ 0%.
Không áp dụng ngược cho chuyến đã trả.

[Tìm hiểu] [Bỏ qua]
```
- Trigger: ride ≥ 500k AND user chưa dùng BNPL trong 30 ngày AND có limit BNPL.
- **Quan trọng:** không cho phép "convert ride cũ sang BNPL" — đó là lending anti-pattern. Card chỉ educational.
- Frequency cap: 1×/tháng.

##### C4 — Insurance hindsight
```
🛡️ Chuyến sân bay — lần sau có bảo hiểm
─────────────────────────
15.000₫ cho toàn chuyến, chi trả 200M VND
nếu tai nạn. Lỡ gì có nơi lo.

[Bật tự động] [Bỏ qua]
```
- Trigger: ride này là Airport/Inter-Province AND user chưa mua insurance.
- "Bật tự động" = next airport ride auto-add 15k. Opt-in rõ ràng.
- Frequency cap: show 2 lần rồi im (nếu user không bật, không nhắc nữa 90 ngày).

##### C5 — Membership upsell
```
⭐ 11 chuyến tháng này
─────────────────────────
Gói tháng XanhSM tiết kiệm ~280k/tháng
so với cách tính hiện tại.

[Dùng thử 14 ngày] [Bỏ qua]
```
- Trigger: user ≥ 10 ride/tháng AND không có membership.
- Frequency cap: 1×/14 ngày, max 3 lần.

##### C6 — V-Point progress (fallback default)
```
⭐ +45 V-Point
─────────────────────────
[▓▓▓▓▓▓▓▓░░] 430 / 500
Còn 70 điểm → 1 chuyến Xanh Bike miễn phí.

[Xem điểm]
```
- Trigger: luôn (sau tháng 8 khi V-Point earning live).
- Default fallback khi không có card nào khác fit.
- Frequency: mọi ride (nhưng progress tự advance tạo novelty — không thấy chán).

##### C7 — Family audit (parent-side only)
```
👦 Bé Minh về an toàn
─────────────────────────
Tháng này bé đi 8 chuyến · 280.000₫
Trong mức: 280 / 500k tuần này.

[Xem chi tiết]
```
- Trigger: ride này là của child account, viewer = parent.
- Show trong V-App notification tab hoặc VSP tab, không trong XanhSM (child dùng XanhSM).
- Frequency: 1×/tuần per child (chỉ Chủ nhật).

##### C8 — Charging nudge (VinFast owner only)
```
⚡ Cần sạc xe?
─────────────────────────
V-Green gần nhà bạn:
• Ocean Park B3 · 3 chỗ trống
• Times City T18 · 1 chỗ trống

[Đặt giờ] [Bỏ qua]
```
- Trigger: user có VinFast linked AND ride này kết thúc < 3km từ trạm V-Green có chỗ trống.
- Frequency: 1×/tuần max.

#### 4.2 Selection rule engine

```
Pseudocode:
─────────────────────────
IF viewer is parent of child account ride → C7 (always)
ELSE IF ride ≥ 500k AND user has BNPL limit AND last_BNPL_card > 30d → C3
ELSE IF (ride ≥ 200k AND user declared group) OR in active group wallet → C2
ELSE IF ride was Airport/IP AND no insurance AND last_C4 > 90d → C4
ELSE IF user ≥ 10 ride/month AND no membership AND last_C5 > 14d → C5
ELSE IF ride ended near V-Green AND user has VinFast AND last_C8 > 7d → C8
ELSE IF balance ≥ 500k AND yield opt-in AND last_C1 > 7d → C1
ELSE → C6 (V-Point progress, always safe default)
```

#### 4.3 Visual hierarchy guidance

- Card = 1 primary button (action), 1 secondary (dismiss/continue). Never 3+ buttons.
- Icon 24px, title 17px semibold, body 15px regular, 2 lines max.
- Radius 28px (token VSP), padding 20px, border 1px outline-subtle.
- Không card nào có image background. Không gradient. Không "premium" styling.

#### 4.4 Dismissal / frequency rules

- Mỗi card type có `last_shown_at` per user.
- User tap "Bỏ qua" 2 lần liên tiếp cùng card type → tăng cooldown ×3 cho type đó.
- User tap primary CTA ≥ 1 lần → card hoạt động đúng, giữ frequency.
- User chưa bao giờ tương tác với card type nào sau 5 lần show → auto-mute type đó 180 ngày.
- **Global cap:** không show card cùng type liên tiếp 2 ride. Tránh fatigue kể cả trigger match.

**Capability dependency table:**
| Card | Ship month |
|---|---|
| C1 Yield | T5-7 |
| C2 Split | Đã ship (split bill) + group wallet T5-7 |
| C3 BNPL aware | T8-9 |
| C4 Insurance | T5-7 |
| C5 Membership | Đã có (XanhSM side) |
| C6 V-Point | T8-9 |
| C7 Family | T5-7 |
| C8 Charging | T5-7 |

**Success metric:**
- Tap-through rate card ≥ 8% (below = noise, should prune).
- Post-tap completion ≥ 40% (trigger đúng context).
- User-level mute rate < 15% cho bất kỳ card type nào (nếu cao → over-triggering).

---

### Moment 5 — VSP tab trong V-App (mobility lens)

**User story:**
> "Thỉnh thoảng tôi vào VSP để top-up hoặc xem số dư. Nếu tôi có thể thấy tôi tiêu bao nhiêu cho đi lại, tôi sẽ vào đây thường hơn."

**Design move:**

```
┌────────────────────────────────┐
│ VSP                            │
├────────────────────────────────┤
│ 2.486.000₫                     │
│ +127₫ sinh thêm hôm nay        │
│                                │
│ [Nạp]  [Chuyển]  [Rút]         │
├────────────────────────────────┤
│ Tháng 4/2026                   │
│ ─ Chi tiêu theo mục ─          │
│                                │
│ 🚗 Di chuyển    1.280.000₫ ←▲│ ← tap → deep view
│ 🛒 Mua sắm        820.000₫    │
│ 🏥 Y tế           450.000₫    │
│ 📚 Học phí      2.300.000₫    │
│                                │
├────────────────────────────────┤
│ [Deep view — khi tap Di chuyển]│
│                                │
│ Di chuyển · T4/2026            │
│ 1.280.000₫ · 18 chuyến         │
│                                │
│ [dòng chart tuần 1-4]          │
│                                │
│ Xanh Bike       6 chuyến · 210k│
│ Xanh Car        9 chuyến · 640k│
│ Xanh Airport    1 chuyến · 520k│
│ V-Green sạc     2 lần   · 180k│
│                                │
│ ─ V-Point ─                    │
│ 430 / 500 điểm                 │
│ Còn 70 → 1 chuyến Bike miễn phí│
│                                │
│ ─ Gia đình (nếu parent) ─      │
│ Bé Minh   8 chuyến · 280k      │
│ Bé Lan     0 chuyến             │
└────────────────────────────────┘
```

**Key design moves:**
- PFM category là **default view**, không phải transaction list. Transaction list nằm dưới (scroll).
- Mobility card có ▲ / ▼ arrow nhỏ so với tháng trước (+15% / -8%) — ambient context.
- V-Point framing dưới dạng "còn N → 1 chuyến X" ngay trong mobility view.
- Family mobility: chỉ hiện nếu user có family wallet setup + là parent. Không hỏi, chỉ hiện.

**Anti-pattern né:**
- Không có leaderboard "bạn đi nhiều hơn/ít hơn X% friends" — creepy.
- Không có "challenge" dạng Strava ("Đi 30 chuyến tháng này!"). Fintech, không fitness.
- Không có social share "Tôi đã chi 1.2M cho XanhSM" — privacy gán.

**Capability dependency:**
- PFM category: tháng 8-12 (chưa có lịch rõ, cần confirm)
- V-Point earning: tháng 8-9
- V-Point spending: tháng 10-12

**Success metric:**
- VSP tab DAU/MAU tăng ≥ 20% sau khi PFM mobility live.
- V-Point redemption rate ≥ 8% của eligible users/tháng.
- Family mobility view open rate ≥ 30% ở parent users.

---

## 6 · Signature concept flows (3 end-to-end)

### Signature 1 — Family Wallet × Xanh Bike kids commute

**Why this is moat:** Vingroup duy nhất sở hữu wallet + ride + school ecosystem. Không cần API Vinschool; dùng **self-declared route** + time fence. MoMo/ZaloPay không thể replicate vì họ không kiểm soát fleet.

**User story:**
> Linh (mẹ, 38t) có bé Minh (13t) học Vinschool Ocean Park, tan trường 15h30. Linh muốn Minh tự đi Xanh Bike về nhà các ngày không đón được, trong khung an toàn.

#### Flow — setup (1 lần, trong VSP tab V-App)

```
VSP > Ví Gia Đình > Thêm thành viên
│
├─ Chọn loại: [Con dưới 18]
│
├─ Nhập: tên · tuổi · số điện thoại (riêng hoặc dùng chung)
│
├─ Tạo passcode riêng cho Minh (Minh set)
│
├─ Cấu hình giới hạn:
│   ├─ Hạn mức tuần: 500.000₫
│   ├─ Category allowed: [Di chuyển] [Ăn uống canteen] ✓
│   └─ Service allowed: Xanh Bike ✓ · Xanh Car (chỉ khi mưa/tối) ✓
│
├─ Đăng ký tuyến:
│   ├─ Tuyến 1: Nhà ↔ Vinschool Ocean Park
│   │   ├─ Khung giờ: 6h30-8h00 VÀ 15h00-17h30
│   │   └─ Auto-approve nếu trong route + khung
│   └─ [+ Thêm tuyến khác]
│
├─ Cài nhắc:
│   ├─ Mũ bảo hiểm check: ✓ (bé phải tick trước khi book)
│   └─ Notify khi off-route: ✓
│
└─ Hoàn tất → Minh nhận link active tài khoản con trên XanhSM
```

#### Flow — child booking (daily, trong XanhSM)

Minh mở XanhSM → child mode UI (simpler, no complex filter):
```
┌──────────────────────────┐
│  Xin chào bé Minh 👋     │
├──────────────────────────┤
│  🏠 [VỀ NHÀ] 15p          │ ← one-tap, pre-filled
│  🏫 [TỚI TRƯỜNG] 20p      │
│                          │
│  Khác? [Nhập địa chỉ...] │ ← fallback, always need parent approve
└──────────────────────────┘
```

Bấm "Về nhà" →
```
┌──────────────────────────┐
│  Về nhà                  │
│  Vinschool OP → Nhà      │
│  🚲 Xanh Bike · 35.000₫   │
│                          │
│  ☐ Bé đã đeo mũ bảo hiểm │ ← required tick
│                          │
│  [XÁC NHẬN ĐI]           │
└──────────────────────────┘
```

Sau xác nhận:
- Backend check: route match ✓ · giờ match ✓ · balance đủ ✓ · limit còn ✓
- **Auto-approve, NO parent approval needed** (trong rule).
- Driver assigned.

#### Flow — parent notification (live)

Phone Linh vibrate → V-App push:
```
👦 Minh đang đi về nhà
Xanh Bike · Vinschool OP → Nhà
ETA 18p · 35.000₫ đã giữ
[Xem bản đồ]
```

Linh mở → V-App > Family > Live ride (map, driver info, ETA, contact driver).

#### Flow — edge cases

**Off-route detection:**
```
Driver pickup xong. Sau 2 phút, GPS lệch >500m khỏi route đã đăng ký.

→ Parent notification (urgent):
  "⚠️ Minh đang đi lệch tuyến. Hiện tại: Metro Lotte (lệch 1.2km).
   [Huỷ chuyến] [Nhắn tài xế] [Ổn, cho tiếp]"

→ Linh có 60s decide. Nếu không chọn gì sau 60s → mặc định "Ổn, cho tiếp"
  (ride tiếp tục, nhưng đã log là off-route).

→ Child không thấy notification này. Không gây stress cho bé.
```

**Over-limit:**
```
Minh đã tiêu 480/500k tuần này. Giá ride 45k (vượt limit 25k).

→ Booking blocked. UI child:
  "Chuyến này vượt hạn mức tuần này.
   [Gửi xin phép mẹ] [Chọn cách khác]"

→ Tap "Gửi xin phép mẹ" → parent nhận notification 1-tap approve.
  Parent approve → override limit cho ride này, không đổi limit tuần.
```

**Driver cancel:**
```
Driver cancel sau khi pickup.

→ Push ngay cho parent (urgent) + child:
  Parent: "Tài xế huỷ. Bé Minh đang đợi ở Vinschool.
           [Đặt lại] [Gọi cho bé] [Xem bản đồ]"
  Child:  "Tài xế huỷ. Không sao, đợi tài xế mới hoặc nhắn mẹ."
```

**Connection lost mid-ride:**
```
Phone Minh mất sóng >2 phút.

→ Parent notification:
  "📍 Mất liên lạc với Minh 2p (thường trong hầm/Tòa)
   Vị trí cuối: 21.0x, 105.9x · 16:23
   ETA còn: 8p
   [Gọi cho tài xế]"

→ Khi connection khôi phục, auto-clear.
```

#### Parental safety UX principles

1. **Không tạo cảm giác "con đang bị giám sát".** Child UI y như user thường, không có banner "parent watching".
2. **Helmet check là positive cue**, không phải cảnh báo.
3. **Auto-approve trong rule = giảm tải phiên trời cho cha mẹ.** Cha mẹ chỉ phải act khi có exception.
4. **Driver anonymous feedback từ parent**: Linh có thể rate driver ẩn danh sau chuyến; rating không ảnh hưởng ride hiện tại của Minh.
5. **"Đồ án trường" fallback**: nếu ngày cuối kỳ có tuyến khác (trường → bảo tàng chẳng hạn), Linh approve 1 ride ngoại lệ, không cần xóa rule.

#### Capability dependency timeline

| Capability | Cần cho | Ship |
|---|---|---|
| Family wallet + per-member limit | Setup | T5-7 |
| Child passcode/account | Setup | T5-7 |
| Self-declared route engine | Auto-approve | **Cần build mới** (not in VSP roadmap) |
| Time fence | Auto-approve | Trong family wallet scope |
| Live ride share to parent | Parent notify | **Cần build cross-team XanhSM + VSP** |
| Over-limit request-to-approve | Edge case | Có thể xây trên split bill rails |
| Helmet check | UI child side | XanhSM side |

**⚠️ Gap cần escalate:** Self-declared route engine và live-share cross-team integration chưa có trong VSP roadmap. Cần brief C-level riêng.

**Success metric (6 tháng sau launch):**
- 10.000 family wallet active với ít nhất 1 child ride/tuần.
- Parent NPS ≥ +60 trong cohort active.
- Off-route alert rate < 2% tổng child ride (nếu cao, route engine quá chặt).
- Parent override rate > 80% (khi nhận off-route alert, parent vẫn "cho tiếp" → rule quá chặt).

---

### Signature 2 — BNPL as inline source-of-fund

**Why this matters:** BNPL hầu hết fintech VN đang framing như "vay" → khách sợ + regulation risk. VSP có thể framing như "chia kỳ trả" nếu giữ nó inline trong payment selector. Grab đã validate pattern này.

**User story:**
> Huy (29t, lương 22tr) book chuyến Hà Nội → Sapa thứ 6 tối cho weekend đi với bạn gái. Xanh Liên Tỉnh 1.6M. Huy vừa trả tiền nhà tháng này, balance VSP còn 450k, không muốn rút BIDV một cục.

#### Prerequisite (off-flow)
Huy đã eKYC + set up BNPL limit 5M trong VSP 2 tuần trước (1 lần, off XanhSM flow). Limit này sống trong VSP, không marketing trong XanhSM.

#### Flow — booking screen

```
Booking Xanh Liên Tỉnh · HN → Sapa · 1.600.000₫

─ Chọn phương thức ─

○ VSP · 450.000₫          [không đủ]
● BIDV · ****4521         [đủ]
○ Trả dần 3 kỳ · 0%       NEW ← BNPL chip
  533.000₫ × 3

[ĐẶT CHUYẾN]
```

- BNPL chip **expanded inline**, không collapsed. Tap → chọn plan.
- "NEW" badge xuất hiện max 3 lần cho mỗi user (sau đó là chip thường).

Tap BNPL chip → expand more:
```
Trả dần
─────────────────────────
○ 1 tháng  · 1.600k × 1 · 0%
● 3 tháng  · 533k × 3  · 0%
○ 6 tháng  · 275k × 6  · 3.5%
○ 12 tháng · 145k × 12 · 6.0%

Kỳ 1 trả hôm nay từ BIDV ****4521
Kỳ 2: 15/05/2026 (533.333₫)
Kỳ 3: 15/06/2026 (533.333₫)

Tổng phí: 0₫

[ÁP DỤNG]
```

Tap "Áp dụng" → quay về booking screen, BNPL chip now active.
Tap "ĐẶT CHUYẾN" → Face ID → done.

#### Flow — receipt

```
✓ Chuyến đã đặt
1.600.000₫ · Xanh Liên Tỉnh
HN → Sapa · T6 20h00

Hôm nay: -533.333₫ từ BIDV
Kỳ 2: 15/05 · auto-trừ BIDV
Kỳ 3: 15/06 · auto-trừ BIDV

[Xem lịch thanh toán]
```

#### Flow — next payment (T-3 ngày)

```
Push: 3 ngày nữa đến kỳ trả
─────────────────────────
VSP · Trả dần
Kỳ 2/3 · 533.333₫
Hạn: 15/05/2026 (thứ 5)
Tự động trừ BIDV ****4521

[Đổi thẻ thanh toán]
[Trả sớm]
```

Ngày đến hạn → auto-deduct BIDV. Confirmation notif: "Đã trả kỳ 2/3. Còn 1 kỳ."

#### Edge cases

**Limit không đủ:**
Ride 1.6M nhưng user chỉ còn 1M limit → BNPL chip **không hiện**. KHÔNG có UX gợi ý "tăng limit". User muốn tăng phải tự vào VSP > Cài đặt > BNPL.

**Chưa eKYC + chưa apply BNPL:**
Chip không hiện. Trong VSP tab, Huy có thể "Đăng ký trả dần" qua flow riêng — không phải trong XanhSM.

**Miss payment:**
- T-3, T-1, ngày hạn: push nhắc.
- Grace 3 ngày post-due: không phí phạt, nhưng điểm tín dụng nội bộ VSP bị giảm (transparent trong VSP tab, hiện explicit).
- Sau 3 ngày: phí phạt 2%/ngày trên kỳ đó. UI hiện rõ trong payment schedule.
- Sau 15 ngày post-due: flag + email + limit freeze.

**Refund chuyến:**
- Ride bị cancel/refund → VSP backend tự cancel kỳ chưa trừ.
- Kỳ đã trừ → refund về VSP balance trong 1-3 ngày.

**User muốn trả sớm toàn bộ:**
VSP > BNPL > "Trả hết 1.066.666₫ còn lại" button. Auto-trừ từ linked bank hoặc VSP balance. Không phí.

#### Anti-patterns cần né

| Anti-pattern | Tại sao xấu |
|---|---|
| Banner "Mở BNPL 5M ngay!" trên home XanhSM | Biến XanhSM thành kênh vay, damage trust |
| Popup "Bạn có đủ 1.6M không?" khi chưa pay | Condescending + ma sát |
| Auto-upsell BNPL khi balance VSP đủ | Tăng nợ không cần thiết |
| BNPL chip cho ride 35k | Trivializing credit, regulation risk |
| Hidden fee trong "3 tháng 0%" | Lòng tin bị phá, một lần là đủ |
| "Trả dần" framing y như thẻ tín dụng (interest/APR chi tiết phức tạp) | Không fit user VN, cần flat fee rõ |

**Capability dependency:**
- BNPL full flow: T8-9
- Schedule auto-deduct: T8-9 trong BNPL module
- Soft credit score nội bộ: cần build cùng BNPL launch

**Success metric:**
- BNPL chip CTR khi xuất hiện ≥ 15%.
- Post-apply conversion ≥ 70%.
- On-time payment rate ≥ 95% (fintech benchmark).
- NPS cohort BNPL-user ≥ +40 sau 3 kỳ (không bị burned).

---

### Signature 3 — Auto-yield "money waiting to ride"

**Why this matters:** VSP có thể cung cấp yield via Infina backend. MoMo/ZaloPay cũng sẽ làm. Cuộc đua không phải ở % lãi — là ở **framing**. Phải biến yield thành **property của balance**, không phải **sản phẩm để sell**.

**User story:**
> Mai (33t) giữ 3-5M trong VSP thường xuyên để đi lại hàng ngày. Mai không quan tâm đến "tiết kiệm" nhưng thấy balance nằm không thì phí.

#### Principles

1. **OFF by default.** Không auto-opt-in, không dark pattern.
2. **Opt-in trong VSP tab, không phải XanhSM.** Ride app không phải nơi bán sản phẩm tài chính.
3. **Sau opt-in: silent presence.** Không banner, không congratulation.
4. **Withdrawal = friction-less.** Pay ride → backend tự partial withdraw từ Infina. User không biết.

#### Flow — first opt-in nudge (in VSP tab)

Điều kiện trigger: balance ≥ 500k trong ≥ 7 ngày AND chưa opt-in AND chưa được hỏi trong 90 ngày.

```
VSP home
─────────────────────────
2.486.000₫

💡 Balance của bạn đang nằm không
Bật Tiết kiệm tự động để sinh
+316.000₫/năm (ước tính).

[Bật]  [Không, cảm ơn]
```

- Ngôn từ: "sinh thêm" thay vì "lãi" (tránh từ ngữ bank-y).
- "Không, cảm ơn" → 90 ngày không hỏi lại.
- "Bật" → confirm screen:

```
Tiết kiệm tự động
─────────────────────────
• Balance VSP tự nhận ~5.5%/năm
  (tỉ lệ có thể thay đổi, theo Infina)
• Rút lúc nào cũng được, tự động
  khi bạn trả ride/hoá đơn
• Không ràng buộc, không phí

[Bật tiết kiệm]  [Huỷ]
```

Tap Bật → animation nhẹ 1s → "Đã bật. Bạn sẽ thấy lãi cộng mỗi ngày."

#### Flow — ambient presence (post opt-in)

**Trong XanhSM home:**
```
💳 VSP · 2.486.000₫  +127₫ ✨
```

- "+127₫" = delta hôm nay only. Không cumulative.
- "✨" = icon 12px vàng nhạt. Decoration minimal.
- Tap chip → half-sheet: balance breakdown + recent + top-up. Trong sheet có mục "Tiết kiệm tự động · đang bật".

**Trong VSP tab:**
```
2.486.000₫
+127₫ sinh thêm hôm nay
─────────────────────────
Tiết kiệm tự động · đang bật · 5.4%
Tháng này: +3.872₫
```

- 1 dòng duy nhất, không banner.
- Tap → detail screen (Infina-powered, shown as VSP).

#### Flow — withdrawal (invisible)

User book ride 520k. VSP balance 2.486k.

Backend flow:
1. VSP balance - 520k.
2. Infina parallel: partial unwind 520k từ yield pool → settle back.
3. User sees: balance = 1.966k.
4. Tomorrow: "+108₫" (giảm từ 127₫ vì pool giảm) — tự nhiên.

User KHÔNG thấy:
- "Bạn đang rút từ tiết kiệm?"
- "Số dư tiết kiệm giảm"
- Bất kỳ friction nào.

#### Edge cases

**Yield drop < 3% (Infina side):**
- Backend event → auto-pause yield nếu user opt-in rằng pause khi < 3% (default true).
- Notification: "Tỉ lệ tiết kiệm đã giảm < 3%. Tạm dừng để chờ phục hồi. Bạn có thể bật lại."
- Không ngộp user với detail kỹ thuật.

**Infina partner down:**
- VSP side: hiện "Tiết kiệm tạm tắt tự động. Hệ thống đang cập nhật."
- Balance vẫn available 100%.
- Không đổ lỗi Infina. Là trách nhiệm VSP.

**User deposit lớn đột ngột (>10M):**
- Không auto-convert toàn bộ. Bảo: "Phần > 10M chưa được đưa vào tiết kiệm. Bạn muốn:
  [Đưa vào tiết kiệm] [Giữ cash flow]"
- Lý do: regulation + liquidity management.

**User rút hết balance:**
- Yield auto-stop gracefully. Khi user deposit lại → yield auto-resume.

#### Anti-patterns cần né (quan trọng)

| Anti-pattern | Tại sao xấu |
|---|---|
| Banner "5.5%/năm tự động!" trên XanhSM home | Bank advertising trong ride app |
| "Bạn đã bỏ lỡ 12.000₫ lãi tuần này!" | FOMO anti-pattern |
| Progress bar "Đã đạt 50.000₫ lãi tích luỹ!" | Gamification quá tay |
| Celebration modal khi đạt mốc lãi | Phóng đại sản phẩm nhỏ |
| "So với bạn bè, bạn tiết kiệm hơn X%" | Social comparison, privacy vấn đề |
| "Bật tiết kiệm" prompt lặp > 1 lần / 90 ngày | Dark pattern |
| Đưa yield vào receipt card trực tiếp sau ride | Wrong moment — ride khác, yield khác |

**Exception:** Receipt card C1 (yield awareness) chỉ show **sau khi user đã opt-in** và **max 1 lần/tuần**. Không phải sell, là nudge-to-remember.

**Capability dependency:**
- Auto-yield (Infina): T5-7.
- Balance breakdown UI: trong VSP tab, T5-7.
- Backend partial unwind: cần build với Infina, T5-7.

**Success metric:**
- Opt-in rate sau 90 ngày (cohort có balance ≥ 500k): ≥ 35%.
- Retention opt-in: > 90% (nếu drop lớn → sản phẩm có vấn đề).
- No spike trong "rút toàn bộ balance" sau opt-in (signal user không thấy bị khoá).
- Cohort opt-in có balance trung bình cao hơn cohort không opt-in ≥ 20% sau 6 tháng.

---

## 7 · Capability × Moment dependency matrix

Cái nào dùng được KHI nào để ship incrementally:

| Moment / Flow | Cần đã ship T4 | Cần T5-7 | Cần T8-9 | Cần T10-12 |
|---|---|---|---|---|
| M1 Balance chip | ✓ Balance | — | — | — |
| M1 Yield micro-signal | — | Auto-yield | — | — |
| M2 Payment chip (invisible) | ✓ Payment | — | — | — |
| M2 BNPL chip | — | — | BNPL full | — |
| M2 Insurance | — | Travel ins | — | — |
| M2 Auto-pay commute | — | — | — | Auto-pay bills |
| M2 Split group | ✓ Split | Group wallet | — | — |
| M2 Voucher | — | Vouchers | — | — |
| M3 Family live-share | — | Family wallet + cross-team build | — | — |
| M4 C1 Yield | — | Auto-yield | — | — |
| M4 C2 Split | ✓ Split | Group wallet | — | — |
| M4 C3 BNPL | — | — | BNPL | — |
| M4 C4 Insurance | — | Travel ins | — | — |
| M4 C5 Membership | ✓ XanhSM membership | — | — | — |
| M4 C6 V-Point | — | — | V-Point earn | — |
| M4 C7 Family | — | Family wallet | — | — |
| M4 C8 Charging | — | V-Green pay | — | — |
| M5 Mobility PFM | — | — | — | PFM (if built) |
| M5 V-Point deep | — | — | V-Point earn | V-Point spend |
| Signature 1 Family × Bike | — | Family + cross-team | — | — |
| Signature 2 BNPL inline | — | — | BNPL | — |
| Signature 3 Auto-yield | — | Auto-yield | — | — |

### Incremental ship plan (my recommendation)

**Phase 0 (now - T4):** Ship **Moment 1 balance chip** (ambient, no yield yet) + **Moment 2 payment chip invisible**. Đây là zero-new-capability. Chỉ UI và decision "default to VSP".

**Phase 1 (T5-7):** Ship **Moment 4 receipt card system** với C2, C4, C5, C7 (split, insurance, membership, family). **Signature 1 Family × Bike soft-launch** với beta family. **Signature 3 Auto-yield opt-in** trong VSP tab. Moment 1 yield micro-signal go live.

**Phase 2 (T8-9):** Ship **Signature 2 BNPL inline** cho Car/Limo/Airport/Inter-Province. Card C3 (BNPL aware), C6 (V-Point). Napas interbank (support).

**Phase 3 (T10-12):** Ship **Moment 5 Mobility PFM** + V-Point redemption framing. **Moment 2 Auto-pay commute**. Card C8 (charging nudge).

Designer 1-man = phase-gate từng quarter. Mỗi phase = 1 demo-able vertical slice, không big bang.

---

## 8 · Ngôn từ style guide (Vietnamese UX copy)

Short lexicon cho designer/PM/copywriter:

| Đừng dùng | Dùng | Tại sao |
|---|---|---|
| Vay / khoản vay | Trả dần · chia N kỳ | Giảm stigma |
| Lãi suất | Sinh thêm · thưởng ngày | Natural |
| Tuyệt vời / tuyệt cú mèo | (không nói) | Marketing noise |
| Bảo mật tuyệt đối | Được bảo vệ bởi [bank/partner] | Proof > claim |
| Đăng ký ngay | Bật / Thử | Less committal |
| Tiết kiệm hàng triệu | Ước tính tiết kiệm [số] | Không phóng đại |
| Khách hàng thân thiết | (không nói với user) | Internal term |
| Gói VIP | [Tên gói cụ thể] | Không hero-ize |
| Kết nối cuộc sống | (cắt) | Empty slogan |
| Trải nghiệm liền mạch | (cắt) | Empty slogan |
| Đồng bộ hoá | (không nói, chỉ làm) | User không care |

---

## 9 · What I would push back on if challenged

1. **"Sao không làm QR scan trong XanhSM cho tiện?"** — vì đó là cuộc chiến của MoMo, không phải của VSP. Mở QR = confess VSP đang cố làm super-app. Chiến thắng là làm chuỗi ecosystem sâu, không phải copy feature ngang.

2. **"Sao BNPL không bật cho Bike?"** — vì ride 35k không cần credit. Bật BNPL cho Bike là marketing "có BNPL" chứ không phải feature. Rủi ro regulation cao + damage thương hiệu.

3. **"Sao không upsell insurance ở mọi ride?"** — vì insurance 15k cho ride Bike trong thành phố = scam-adjacent. Chỉ surface ở Airport/Inter-Province là đúng context.

4. **"Sao không cho tip?"** — VN không có văn hoá tip ride. Import pattern = ma sát không return. "Bo thêm" optional (chỉ khi rate 5★) có thể test sau, không phải signature.

5. **"Sao family wallet không làm cho cặp vợ chồng thay vì cha mẹ-con?"** — cặp vợ chồng = group wallet (T5-7, ship song song). Family wallet khác: **hierarchy + safeguards + live visibility**. Nhập 2 vào 1 sẽ làm loãng cả 2.

6. **"Sao Moment 3 in-ride không có gì?"** — vì đó là đúng. Thêm UI trong ride = interference. Chỉ có family live-share là có ROI, các thứ khác là quảng cáo.

7. **"Sao VSP tab lại có PFM thay vì ship nhiều feature fintech hơn?"** — PFM là retention engine, không phải feature acquisition. Engagement ≠ acquisition. VSP đang thiếu cả 2 — PFM giải engagement lâu dài, cần thiết. Feature fintech ship song song với BNPL/insurance/yield đã có rồi.

8. **"Self-declared route không đủ an toàn so với Vinschool API."** — đúng. Nhưng API không có, mà ship được. Self-declared + off-route alert + parent override = đủ MVP. V1 ship, V2 sau khi có API thì upgrade.

---

## 10 · Open questions / gaps tôi nhận ra khi thiết kế

1. **Child app mode** trong XanhSM — cần confirm team XanhSM có sẵn UX child-friendly chưa, hay phải build mới.
2. **Live-share cross-app** VSP ↔ XanhSM — cần API hoặc shared session; chưa trong VSP roadmap rõ.
3. **V-Point earning logic** — VSP roadmap ghi T8-9 nhưng earning rule/rate chưa public. Receipt card C6 framing phụ thuộc rule này.
4. **PFM category engine** — chưa có trong VSP roadmap rõ; Moment 5 có thể cần phase 3+ hoặc ngoài 2026.
5. **Infina yield rate actual** — giả định 5.5% nhưng có thể biến động. Cần có fallback UX cho yield drop.
6. **BNPL pre-approval flow** — user làm ở đâu? VSP tab? Ngân hàng? Cần 1 owner rõ.
7. **Teen/child identity in eKYC** — eKYC hiện của VSP có support dưới 18? Luật VN về ví cho trẻ em?
8. **Shared vehicle state (family + VinFast)** — ai owner xe trong family wallet? Charging pay trừ ai?

Các câu này nên được answer trước khi ship phase nào chạm tới.

---

## 11 · Deliverables checklist

- [x] Benchmark matrix 8 apps × 22 features (§1)
- [x] Pattern library — steal & avoid (§2)
- [x] Top 10 insights (§3)
- [x] VN-specific context map (§4)
- [x] 5 Moment UX concepts wireframe-level (§5)
- [x] Receipt card system — 8 templates + rule engine + dismissal (§5 M4)
- [x] 3 Signature flows end-to-end (§6)
- [x] Capability × Moment dependency matrix (§7)
- [x] Success metric per moment (§5, §6)
- [x] Ngôn từ style guide (§8)
- [x] Push-back memo (§9)
- [x] Open gaps (§10)

---

## Sources

- [GoPay standalone launch 2023 — The Jakarta Post](https://www.thejakartapost.com/paper/2023/07/28/goto-launches-gopay-e-wallet-as-stand-alone-app.html)
- [GoPay Statistics 2025 — CoinLaw](https://coinlaw.io/gopay-statistics/)
- [Grab PayLater Singapore](https://www.grab.com/sg/consumer/finance/paylater/)
- [Asia-Pacific BNPL Report 2025-2029 — GlobeNewswire](https://www.globenewswire.com/news-release/2026/01/29/3228841/28124/en/Asia-Pacific-Buy-Now-Pay-Later-Business-Report-2025-2029-Grab-PayLater-GoPayLater-Shopee-PayLater-and-PayPay-Lead-Adoption-While-Afterpay-Zip-Amazon-and-Flipkart-Expand-Platform-Ba.html)
- [Lyft Cash Rewards launch — The Points Guy](https://thepointsguy.com/travel/lyft-cash-rewards/)
- [Lyft Cash Rewards prepaid wallet loyalty — Embedded Finance Review](https://www.embeddedfinancereview.com/lyft-cash-rewards-how-lyft-built-a-prepaid-wallet-into-its-loyalty-program/)
- [Lyft Tests Rewards Program — Bloomberg](https://www.bloomberg.com/news/articles/2025-10-22/lyft-tests-rewards-program-offering-some-users-cash-back-on-future-rides)
- [Vietnam's Top Payment Methods — Transfi](https://www.transfi.com/blog/vietnams-top-payment-methods-momo-zalopay-vietqr-explained)

---

## Changelog

- **v1 (23/04/2026):** Draft đầu. 10 section. Push-back memo với brief: 4 điểm. 8 card receipt + rule engine. 3 signature flow full edge case. Capability dependency timeline cho ship incrementally. Open gap phần 10 — cần owner trả lời trước khi ship.
