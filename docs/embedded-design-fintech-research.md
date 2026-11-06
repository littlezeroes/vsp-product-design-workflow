# Embedded Design trong Fintech — Research Dossier

**Version:** v1 · Draft · April 2026
**Scope:** Làm rõ cách các fintech thế giới tổ chức design team, để đối chiếu với đề xuất "Designer embed trong khối fintech VSP" thay vì ngồi ngoài Design Center.
**Tone:** Formal. Không công kích. Trích dẫn nguyên văn từ nguồn chính chủ (blog engineering/design team, interview founder, tuyển dụng).
**Intended use:** Làm nền cho slide escalation C-Level. Docs này là data; slide sẽ là argument.

---

## 0 · TL;DR

1. Sáu fintech được coi là global benchmark (Revolut, Monzo, Nubank, Stripe, Wise, N26) **đều dùng embedded design model** — designer ngồi trong product squad cùng PM, engineer, data — không tách thành Design Center ngoài khối.
2. Central design function ở các công ty này **không phân bổ designer** cho các team, mà **tập trung làm 3 thứ**: Design System, DesignOps, User Research. Đây là tầng hỗ trợ, không phải tầng quản trị.
3. Lý do được các head of design nói thẳng: **fintech đòi hỏi tốc độ và ownership — embedded model cho designer quyết cùng team, không chờ approve từ ngoài**.
4. Mô hình "designer ngồi ngoài + phục vụ đa dự án" (centralized/agency model) bị các design leader của các công ty trên **phê bình rõ** là gây ra "disempowered designers" và "shut up and color in" — thường gắn với doanh nghiệp lớn, tốc độ chậm.
5. Hệ quả cho VSP: Để cạnh tranh với MoMo / ZaloPay / Cake và đạt TTM < 8s, designer phải embed trong khối Fintech BU. Design Center có thể tồn tại, nhưng vai trò là **platform (DS/DesignOps/Research)**, không phải **allocation gate**.

---

## 1 · Định nghĩa — 3 mô hình tổ chức design

Đây là 3 mô hình phổ biến được Nielsen Norman Group, Superside, và UX Collective liệt kê. Không phải ý kiến cá nhân.

| Mô hình | Mô tả | Khi nào phù hợp | Rủi ro |
|---|---|---|---|
| **Centralized (agency)** | Toàn bộ designer ngồi chung 1 phòng, manager phân bổ theo dự án | Enterprise lớn, nhiều brand, cần nhất quán | Designer bị "shut up and color in", bị kéo vào cuối flow để "tô màu" sản phẩm đã quyết xong |
| **Embedded (in-squad)** | Designer ngồi trong product team cùng PM + engineer + data, full ownership cùng team | Product-led, tốc độ cao, fintech / SaaS | Thiếu design system / research chung → mỗi squad tự làm, dễ phân mảnh |
| **Hybrid (central platform + embedded)** | Designer embed trong squad; central team nuôi DS, DesignOps, Research | Fintech scale vừa đến lớn | Cần design leadership đủ senior để duy trì 2 tầng |

> Trích UX Collective: *"Centralized design teams can result in disempowered designers who are frequently brought in too late just to 'color in' what's already been built."* [1]

> Trích Superside: *"Embedded teams are multidisciplinary teams (Engineering, Product, and Design) that normally consist of about 7 people from different areas working for the same purpose in agile methodologies... The embedded model strengthens and empowers product teams with design energy, gives the most ownership to designers."* [2]

**Hybrid** là mô hình **đang chiếm đa số trong các fintech global**. Centralized = model cũ của các tập đoàn truyền thống.

---

## 2 · Six global fintech case studies

### 2.1 Revolut (UK) — 315 product FTE, embedded squad

- **Structure:** Small, empowered squads "own domain of their own, from design to deployment." [3]
- **Design headcount:** Từ 10 FTE product năm 2016, trong đó **6 là product designer** (60%). Đến 2018, **15/42 là product designer**. Design được prioritize từ early day. [4]
- **Reporting line:** Matrix — "every person has two reporting lines: function (dotted) and department (fixed)." Tức designer vừa report về design chapter (craft), vừa trong team (delivery). [4]
- **Designer không tách riêng:** Engineers are "deeply embedded in product squads, where they own features end-to-end from architecture to deployment to monitoring" — designer đi cùng flow này. [3]

**Điểm đáng học:** Revolut không có "Design Center" tách biệt. Design là **first-class citizen trong squad**, không phải service function.

### 2.2 Monzo (UK) — 100 người design org, "Collectives" model

- **Structure:** Designers được **"embedded in cross-functional product squads"**. Groups of squads gọi là **"Collectives"** — ứng với business area (Core Banking, Business, Wealth, Payments, Borrowing, Ops, Growth, Fincrime). [5]
- **Team size:** ~50 product designers · ~30 researchers · ~10 brand designers · ~15 design leaders = ~100 tổng. [5]
- **Embedded rõ ràng:**
  > *"Designers are embedded in cross-functional product squads and are responsible for all design contributions in the team, from initial discovery and user journey mapping through to the implementation of final UI design. Designers partner closely with Product Managers, Engineers, and Data scientists."* [5]
- **Research cũng embedded:** *"User Research is embedded in every collective (group of squads)."* [5]
- **Squad thực tế** (quote từ product designer Monzo):
  > *"My squad includes a combination of client engineers (iOS and Android), backend engineers, product, product marketing, design, data science, UX research and QA."* [6]

**Điểm đáng học:** Monzo organize design **theo business area, không theo skillset**. Designer báo cáo về craft chapter, nhưng deliver cho BU.

### 2.3 Nubank (Brazil) — 200+ designers, BU-based

- **Structure:** *"Our teams work in big Business Units (BUs) focused on products. Inside them, we have clusters of multidisciplinary squads."* [7]
- **Squad composition:** Mỗi squad có PM, Product Designer, Product Operations, Software Engineering, Business Analysts. [7]
- **Design disciplines:** Product Designer (trong squad), UXR (between squads), Content Designer.
- **Career path:** Y-shaped — IC (individual contributor) hoặc Manager. Không bắt buộc thành manager để lên level. [7]
- **Lý do chọn mô hình này (head of design):**
  > Design principles gồm 5 điều: *"Start early, Co-create, Go beyond, Context, Humanize."* [8] — "Start early" ám chỉ designer có mặt từ khâu định nghĩa problem, không đợi PM deliver brief.

**Điểm đáng học:** Nubank có Chief Design Officer (Ethan Eismann) — báo cáo trực tiếp lên C-level, không dưới CTO hoặc CPO. Design có tiếng nói độc lập.

### 2.4 Stripe (US) — product-embedded, "Day One" involvement

- **Structure:** *"Product designers at Stripe are organized around specific product areas... Designers partner with teams across: Payments, Revenue & Finance, Seller Experiences, Connect, Dashboard experiences, Billing, Terminal, and more."* [9]
- **Quote nổi tiếng về tầm quan trọng của embed:**
  > *"Having designers positioned so early on in everything, we've been able to have a lot of impact on everything we've built because we're there working on the products from Day One."* [10]
- **Cross-functional mặc định:** *"Product Designers work directly with Engineers, Product Managers, Data Scientists, and Marketers, as strategic partners, in each product area."* [9]
- **Ownership:** *"A designer winds up owning a very large part of something and they can have ownership over it and make the decisions that they think are best, but they still have the support of the team when they need it."* [10]

**Điểm đáng học:** Stripe giữ design "loose in terms of structure" — không quan liêu hóa process, nhưng luôn embed.

### 2.5 Wise / TransferWise (UK) — autonomy triệt để, 1 designer / team

- **Structure:** *"Product designers at TransferWise are embedded in product teams. This gives them an incredible level of independence and control over the impact they have."* [11]
- **Embed size:** *"Our embedded setup usually means one designer per product team, designing alone."* [11]
- **Autonomy rõ ràng:** *"Alongside their team, designers can pick the customer problems they believe are the most important to solve, and they are accountable for the outcome."* [11]
- **Platform tầng trên:** 3 bộ phận hỗ trợ — Design Systems, Design Ops, Design Advocates (14 designer senior hoạt động như "eyes and ears" toàn org). [12]
- **Typical team:** engineers + PM + product analyst + designer + Ops/CS contacts. [12]

**Điểm đáng học:** Wise là minh chứng "single designer per squad" vẫn hoạt động ở quy mô fintech châu Âu. Design Ops + Design Advocates là cơ chế giữ chất lượng **không cần** tập trung hóa.

### 2.6 N26 (Germany) — >40 UX, hybrid discipline meetings

- **Structure:** UX team thuộc **Product & UX organisation**, >40 người chia Product Design, User Research, UX Writing, Design Operations. [13]
- **Embedded confirmed:** Lead designer (home screen project 2019) ngồi trong cross-team gồm PMs, User Researcher, Software Quality Engineer, Android/iOS Engineer, Tech Leads. [13]
- **Discipline alignment:** Brand design, product design, user research có sync meeting riêng — giữ craft nhưng không phân bổ. [14]
- **Quote từ head of design (Christian Hertlein):**
  > *"When we were smaller, designers were able to just go over to the person who wrote the brief and talk the details over. As we become bigger, that doesn't really work."* → N26 giải bằng Atomic Design Language (Design System), không bằng Design Center. [14]

**Điểm đáng học:** Khi scale-up, N26 build design system + shared language thay vì tập trung designer. Đây là **bằng chứng trực tiếp chống lại** ý tưởng "lớn hơn → cần Design Center".

---

## 3 · Pattern chung rút ra

| Dimension | Mẫu chung ở 6 công ty |
|---|---|
| **Designer ngồi ở đâu?** | Trong product squad / BU. Không ngồi riêng. |
| **Ai là sếp trực tiếp?** | Design Manager thuộc design chapter (craft) + PM của squad (delivery) — matrix report |
| **Central function làm gì?** | Design System · DesignOps · User Research · Design Advocates. Không phân bổ designer. |
| **Head of Design báo cho ai?** | C-level (CEO / CPO / CDO) — ngang hàng engineering & product |
| **Quy mô embedded** | 1 designer / squad (Wise) → đội nhỏ 2-3 designer / BU (Nubank, Monzo) |
| **Career path** | Y-shape (IC ↔ Manager) — designer giỏi không cần lên management |
| **Khi scale lên** | Build Design System + DesignOps, **không** build Design Center |

---

## 4 · VN fintech — state of play (cần research thêm)

Đây là phần cần đo thêm bằng nguồn VN (LinkedIn, tuyển dụng, interview). Hiện tại chỉ có public data về brand & product, **chưa có public data về cách tổ chức design team nội bộ** của MoMo / ZaloPay / Cake. Phần này coi như placeholder, cần bổ sung primary interview.

| Công ty | Users / Scale | Vị thế UX (public perception) | Design org (cần xác minh) |
|---|---|---|---|
| **MoMo** | 31M users, 140k payment points | Super app, được đánh giá cao về convenience, brand trust. [15] | **?** — cần xác minh có Design Center hay embedded |
| **ZaloPay** | 60M users (qua Zalo), 1.6 giao dịch/user/day, 84% brand loyalty | Integration mạnh với Zalo; UX khá, nhưng nhiều menu lớp ngoài. [15] | **?** |
| **Cake (by VPBank)** | 5M users (2024), Best Digital Bank VN 2024 (Asian Banker), rank 87 World Top 100 Digital Banks 2025 | Clean UX, focus simplicity, collab với Google Cloud/ChromeOS. [16] | **?** |
| **Timo** | (thuộc VPBank Group trước, digital-only) | Early digital bank VN, award "Best Digital Bank VN 2021" | **?** |
| **TPBank LiveBank** | Live 2017, branch-in-kiosk model | Feature-dense, heritage từ bank. Ops cost -28%, tx cost -75%. [16] | **?** |

**Action item:** cần 1 researcher (Minh?) làm primary interview với 3-5 designer đã/đang ở MoMo, ZaloPay, Cake để xác minh họ organize theo model nào. Đây là evidence có trọng lượng nhất cho slide.

**Giả thuyết (cần kiểm chứng):** Các fintech VN đã scale tốt (MoMo, Cake) nhiều khả năng cũng đã chuyển sang embedded/hybrid. Nếu xác nhận được điều này thì argument cho VSP rất mạnh: *"ngay cả đối thủ VN cũng không còn dùng Design Center ngoài khối."*

---

## 5 · Hàm ý cho V-Smart Pay

### 5.1 Design Center không sai — nhưng sai vai trò

Design Center ở VSP hiện tại đang làm **allocation gate** (phân bổ designer, duyệt brief). Đây là **mô hình quản trị hành chính truyền thống** — không phải mô hình fintech.

Các công ty trên có "central design" nhưng central team đó làm **platform** (DS + DesignOps + Research + Advocates), không làm **gate**.

### 5.2 Đề xuất cấu trúc cho VSP

```
                      Head of Design (report to CEO / CPO)
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
    Design Chapter         Design Platform          Product BUs
    (craft, career)       (DS, Ops, Research)     (Payments, Banking,
                                                   Onboarding, ...)
                                                          │
                                              ┌───────────┴───────────┐
                                            Squad                   Squad
                                         [PM · Eng · Design ·     [PM · Eng · Design ·
                                          Data · Research]          Data · Research]
```

- **Chapter** = nơi designer học nghề, career path, QA craft (dotted line)
- **Platform** = đội 3-5 người làm DS/Ops/Research dùng chung (solid line)
- **Squad** = nơi designer sống hằng ngày, ship cùng PM/Eng (solid line)

Designer có **1 boss hành chính (chapter)** và **1 boss delivery (squad)**. Giống Revolut.

### 5.3 Cam kết đo lường 6 tháng

Sau khi chuyển sang model này, VSP có thể cam kết đo:

| Metric | Baseline (Design Center cũ) | Target sau 6 tháng |
|---|---|---|
| Design → Dev handoff time | cần đo | giảm ≥ 50% |
| Designer tham gia từ stage | thường "UI only" | "Discovery → Ship" |
| Ratio designer / engineer trong squad | cần đo | ≥ 1:8 (benchmark Monzo) |
| Design Review cycle | cần đo | < 3 ngày |
| TTM core flow (send money) | cần đo | ≤ 10s (Cash App 4s, Wise 6s) |

---

## 6 · Open questions (cần brief thêm)

1. **VN fintech design org** — cần primary interview 3-5 designer cựu/đương nhiệm ở MoMo / ZaloPay / Cake để xác minh model
2. **VSP current baseline** — cần đo hiện tại: designer / squad ratio, handoff time, design review cycle. Không có baseline thì không có cam kết
3. **Relation với Design Center** — giữ nguyên hay chuyển vai trò? Đề xuất: Design Center → Design Platform (DS + Ops + Research). Giữ người, đổi vai
4. **Head of Design reporting line** — C-level (CPO/CEO)? Hay giữ dưới Design Center trưởng? Đây là đòn bẩy quyết định

---

## Sources

[1] [The 3 types of design teams: centralized, embedded, and the elevator team — UX Collective](https://uxdesign.cc/3-design-team-structures-centralized-embedded-and-the-elevator-team-f2970008ed41)
[2] [Design Team Structures: Centralized, Embedded & Flexible — Superside](https://www.superside.com/blog/design-team)
[3] [Under the Hood: Engineering at Revolut — Revolut Tech / Medium](https://medium.com/revolut/under-the-hood-engineering-at-revolut-2dc183c04228)
[4] [A Deep Dive into Revolut's Product Organisation — The Big Byte](https://thebigbyte.substack.com/p/a-deep-dive-into-revoluts-product)
[5] [Design at Monzo — Verified Insider (Tom Scott & Jay Clark interview)](https://verifiedinsider.substack.com/p/design-at-monzo)
[6] [My first three months at Monzo as a Product Designer — Monzo Blog](https://monzo.com/blog/first-three-months-product-designer)
[7] [What is it like to have a career at Nubank's Design team? — Building Nubank](https://building.nubank.com/career-at-nubanks-design-team/)
[8] [Design principles at Nubank — Building Nubank](https://building.nubank.com/design-principles-at-nubank/)
[9] [Stripe Product Design Jobs — Stripe.com/jobs](https://stripe.com/jobs/listing/product-designer/7568117)
[10] [Design, Process, and Collaboration at Stripe — Jordan Koschei / Medium](https://medium.com/in-progress/design-and-collaboration-at-stripe-304626b59312)
[11] [Product Design and Autonomy at TransferWise — Duncan Lamb / Wise Design](https://medium.com/transferwise-design/product-design-and-autonomy-at-transferwise-55deb93ff54b)
[12] [About Wise Design — Wise Design / Medium](https://medium.com/transferwise-design/about)
[13] [How N26 makes banking more approachable with Figma — Figma Customer Story](https://www.figma.com/customers/how-n26-makes-banking-approachable/)
[14] [How N26 Created a Design-centric Culture from Day One — Christian Hertlein interview / Facilitator](https://www.facilitator.com/blog/christian-hertlein-interview)
[15] [Vietnam's Top Payment Methods (MoMo, ZaloPay, VietQR) Explained — Transfi](https://www.transfi.com/blog/vietnams-top-payment-methods-momo-zalopay-vietqr-explained)
[16] [Timo, TNEX and Cake lead Vietnam's digital banking revolution — Mambu](https://mambu.com/insights/articles/timo-tnex-and-cake-lead-vietnam-s-digital-banking-revolution)

---

## Changelog

- **v1 (22/04/2026):** Draft đầu tiên. Covered 6 global fintech (Revolut, Monzo, Nubank, Stripe, Wise, N26) với quote trực tiếp. VN fintech phần state-of-play cần research bổ sung bằng primary interview. Hàm ý VSP được đề xuất nhưng cần validate với baseline đo thật.
