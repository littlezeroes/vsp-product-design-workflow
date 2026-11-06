# Embedded Design — Executive Brief

**Gửi:** Ban Lãnh đạo V-Smart Pay
**Người đề xuất:** Kiều Mạnh Huy · Staff Principal Product Designer
**Ngày:** 22/04/2026
**Đọc trong:** 3 phút
**Ask:** Phê duyệt 6-month pilot — 1 squad, 2 designer embed, 1 metric đo được. Không thay đổi cấu trúc tổ chức hiện tại.

---

## 1 · Vấn đề (Cost of current model)

VSP đang trong cuộc đua với MoMo (31M users), ZaloPay (60M users qua Zalo), Cake (6.2M users, lãi sau 3.5 năm). Tất cả đối thủ **đang ship tuần**, không ship quý.

Mô hình hiện tại — **designer ở Design Center, xin brief, chờ phân bổ** — tạo 3 cost cụ thể:

- **Handoff debt**: Mỗi feature qua 2–3 handoff (PM → Design Center → Dev), mỗi lần mất 3–5 ngày, cộng dồn 10–15 ngày/feature.
- **Discovery gap**: Designer chỉ nhận brief đã chốt → không tham gia problem framing → UI đúng quy trình nhưng **chưa chắc giải quyết đúng vấn đề**.
- **Ownership vacuum**: Designer không accountable cho outcome vì không sống trong team ship. Feature ship → không ai chịu trách nhiệm UX failure.

---

## 2 · Đề xuất (6-month pilot, không đụng Design Center)

**Không** đề xuất: đổi cấu trúc Design Center, sa thải ai, reorg toàn tổ chức.

**Có** đề xuất: thử embed 2 designer vào 1 squad fintech trong 6 tháng, đo kết quả, rồi quyết.

| Thông số | Cam kết |
|---|---|
| Squad pilot | Payments Core (flow chuyển tiền — impact cao nhất) |
| Designer embed | 2 người (1 senior + 1 mid) từ pool hiện tại |
| Thời gian | 22/04 → 22/10/2026 (6 tháng) |
| Chi phí tăng thêm | 0 VND — dùng designer hiện có, chỉ đổi vị trí ngồi |
| Chỉ số đo | Chỉ số UX: TTM · task success · NPS trong flow · handoff cycle |
| Check-point | Tháng 1 (baseline), tháng 3 (giữa kỳ), tháng 6 (kết) |
| Nếu miss target | Dừng pilot, designer về Design Center, báo cáo học được gì |

Designer vẫn **thuộc Design Center về mặt hành chính** (career, craft QA). Chỉ đổi **chỗ làm việc hàng ngày** và **line delivery**. Đây là thay đổi **hành vi**, không phải thay đổi **cơ cấu**.

---

## 3 · Bằng chứng (chỉ số UX)

### 3.1 Monzo — Embedded model, UK digital bank

- **NPS +70** — gấp **2.3× trung bình ngành ngân hàng UK** (+30). [1]
- **2/3 sign-up mới đến từ word-of-mouth** — tín hiệu UX satisfaction tự lan, khách giới thiệu khách. [1]
- **Cấu trúc UX:** 50 product designers + 30 researchers embedded trong **Collectives** (nhóm squad theo BU). [2]

### 3.2 Nubank — BU-embedded, Latin America's #1 digital bank

- **NPS 90** — cao hơn toàn bộ ngân hàng truyền thống Brazil, vượt cả các fintech lớn khác. [3]
- **NPS 84** trên dòng cao cấp Ultravioleta (700k khách). [3]
- **83% activity rate** — tỉ lệ user active hàng tháng, rất cao cho mobile banking. [3]
- **4.1 sản phẩm trung bình/khách** — engagement đa sản phẩm mạnh. [3]
- **80% growth từ word-of-mouth** — UX đủ tốt để user tự marketing. [3]
- **Cấu trúc UX:** 200+ designer trong **BU + squad** (PM · Product Designer · POps · Eng · BA cùng ngồi). [4]

### 3.3 Wise — 1 designer / squad, autonomous model

- **74% giao dịch chuyển tiền đến trong < 20 giây** · **20% instant** → TTM benchmark. [5]
- **NPS ~86** — thuộc nhóm cao nhất trong toàn ngành fintech. [5]
- **Cấu trúc UX:** 1 designer/squad, 3 function trung tâm = Design Systems + DesignOps + Design Advocates. [6]

### 3.4 McKinsey Design Index — 300 công ty niêm yết, 5 năm

4 trụ của top-quartile design-led companies — đo bằng **chỉ số UX**, không phải bằng số designer: [7]

1. **Measure design with rigor** — có KPI UX, không làm theo cảm tính
2. **Phá vỡ silo** giữa physical · digital · service
3. **User-centric là trách nhiệm của mọi người**, không chỉ designer
4. **De-risk bằng listen · test · iterate liên tục** với end-user

Hiệu ứng nhất quán trong medtech, consumer goods, **retail banking**.

### 3.5 Forrester — Collaborative design culture (2018, cross-industry)

- Team thành công **76% có khả năng cao hơn** trong việc công nhận đồng nghiệp khi tiếp thu feedback. [8]
- Team thành công **67% có khả năng cao hơn** chia sẻ work-in-progress với design + dev + product. [8]
- Đây là hành vi embed-first, không làm được nếu designer ngồi ngoài.

### Tóm tắt chỉ số UX

| Công ty | NPS | TTM / velocity UX | Engagement |
|---|---|---|---|
| Monzo (embed) | **+70** | — | 2/3 word-of-mouth |
| Nubank (embed) | **+90** | — | 83% activity, 4.1 sp/user |
| Wise (embed) | **+86** | **74% < 20s** | — |
| Industry avg (UK banks) | +30 | — | — |

Không có fintech nào trong benchmark đạt NPS 70+ mà dùng Design Center model. **Pattern nhất quán là embedded.**

---

## 4 · Rủi ro & Cách kiểm soát

| Rủi ro | Likelihood | Cách kiểm soát |
|---|---|---|
| **Mất chất lượng craft** khi designer không QA tập trung | Trung bình | Design Chapter giữ weekly craft review 1h/tuần. DS + DesignOps duy trì chuẩn. Thực tế Monzo, Wise, Nubank vẫn giữ craft cao bằng cơ chế này. |
| **Mất kiểm soát priority** — sợ designer làm linh tinh theo ý PM squad | Thấp | Priority vẫn thuộc PM squad + Product Lead tổng. Designer vai trò **co-creator**, không quyết roadmap. Cam kết: OKR squad approve bởi Product Head. |
| **Drama tổ chức** — Design Center phản ứng | Thấp | Không đụng ai, không sa thải. Chỉ đổi vị trí ngồi 2 người trong 6 tháng. Nếu miss → revert. Đây là **experiment**, không phải **reform**. |
| **Nhân sự nghỉ** vì áp lực squad | Thấp | 2 designer pilot tự nguyện. Có cơ chế rút về Design Center bất cứ lúc nào. |
| **Kết quả không đủ đẹp** để escalate | Trung bình | Chỉ số đã định trước, đo độc lập bởi PM Head + Data. Miss là miss. Báo cáo thật. |

---

## 5 · Ask cụ thể

Phê duyệt 6 tháng với 4 điều:

- [ ] **1 squad** Payments Core làm pilot site.
- [ ] **2 designer** embed full-time (1 senior + 1 mid), vẫn thuộc Design Center về hành chính.
- [ ] **3 chỉ số UX** đo upfront:
  - **TTM flow "Gửi tiền" ≤ 12s** (baseline hiện tại đo tuần 1)
  - **Task success rate ≥ 92%** cho core flow
  - **NPS in-flow** (micro-survey sau giao dịch) ≥ +50
- [ ] **Monthly report** 1 trang gửi CEO + Head of Design + Head of Product. Checkpoint cứng: tháng 1, 3, 6.

**Cam kết ngược lại:**

- Nếu cả 3 chỉ số đều không đạt target trong 6 tháng → dừng pilot, designer về Design Center, báo cáo lesson.
- Nếu có drama tổ chức (complaint formal) → review ngay lập tức.
- Nếu đạt target sớm (tháng 3) → trình đề xuất scale sang squad thứ 2.

**Không đòi hỏi:** budget tăng, headcount mới, thay đổi cơ cấu tổ chức, reporting line mới.

---

## 6 · Nguồn

- [1] [Monzo Annual Report 2024 + fintech.global coverage](https://monzo.com/annual-report/2024)
- [2] [Design at Monzo — Verified Insider (Tom Scott, Jay Clark)](https://verifiedinsider.substack.com/p/design-at-monzo)
- [3] [Nubank Q4 2024 Financial Results + WhiteSight analysis](https://international.nubank.com.br/company/nu-holdings-ltd-reports-fourth-quarter-and-full-year-2024-financial-results/)
- [4] [Career at Nubank's Design Team — Building Nubank](https://building.nubank.com/career-at-nubanks-design-team/)
- [5] [Wise FY2024 Results + Statista customer data](https://wise.com/imaginary-v2/images/49fe62e15cf1aa3bed60d68f23f62c99-Wise%20FY2023%20RNS%20for%20IR%20FINAL.pdf)
- [6] [Product Design and Autonomy at TransferWise — Duncan Lamb](https://medium.com/transferwise-design/product-design-and-autonomy-at-transferwise-55deb93ff54b)
- [7] [The Business Value of Design — McKinsey](https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-business-value-of-design)
- [8] [Design study by Forrester — design collaboration benchmarks](https://www.figma.com/design-study-by-forrester/)

**Research dossier đầy đủ (40+ trang):** [`docs/embedded-design-fintech-research.md`](./embedded-design-fintech-research.md) — 6 case study, quote trực tiếp, cấu trúc tổ chức chi tiết.
