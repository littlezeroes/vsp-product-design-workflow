# 🔍 Nate — BRD Analysis: Sinh lời tự động (Auto Earnings)

> Feature: Sinh lời tự động — V-Smart Pay
> Ngày phân tích: 2026-03-22
> Analyst: Nate (UX Researcher)
> Status: Draft — chờ PO confirm các mục MUST

---

## 1. BRD Summary

**Mục tiêu:** Cho phép user tối ưu số dư nhàn rỗi trong Ví V-Smart Pay bằng cách tự động chuyển sang sản phẩm sinh lời. One-click activate, rút tức thì.

**4 Epics:**
1. **Đăng ký sinh lời** — Khám phá → Xem thông tin → Kích hoạt (OTP) → Kết quả
2. **Quản lý sinh lời** — Dashboard (2 tabs), lịch sử GD, tổng kết lợi nhuận, điều khoản
3. **Nạp/Rút tiền** — Nạp từ Ví VSP (max 100M/tháng), rút về Ví VSP (tức thì), OTP/biometric auth
4. **Hủy đăng ký** — Rút hết → Xác nhận hủy → OTP → Kết quả

**Business constraints:**
- eKYC bắt buộc
- Số dư tối đa: 100M VND (configurable)
- Lãi suất: tính hàng ngày, trả hàng tháng
- Hạn mức: 100M/tháng (Thông tư 40/2024)
- OTP cho mọi action nhạy cảm

**KPIs chính:** Activation ≥ 85%, Time-to-activate ≤ 30s, Sweep success ≥ 99%, Adoption 15-25%

---

## 2. Gaps & Unclear Points

### MUST — Block Flow Design (cần PO confirm)

**Q1: "Tự động" nghĩa là gì cụ thể?**
- BRD nói "tự động chuyển tiền sang sản phẩm sinh lời" nhưng KHÔNG mô tả cơ chế auto-sweep.
- User bật rồi tiền tự chuyển? Hay user phải nạp thủ công mỗi lần?
- Nếu auto-sweep: ngưỡng bao nhiêu? (VD: giữ 500k trong ví chính, phần còn lại tự chuyển sang sinh lời?)
- Lý do hỏi: Đây là CORE VALUE PROP. Nếu chỉ là nạp thủ công thì tên "tự động" gây misleading → UX trust issue.
- **Assume nếu không trả lời:** Giai đoạn 1 = nạp thủ công. "Tự động" ám chỉ lãi tự tích lũy, không phải auto-sweep. Sẽ design toggle "Nhận tiền tự động" cho phase 2.

**Q2: Đối tác tài chính (provider) là ai?**
- BRD ghi provider = "ABC" (placeholder). Cần biết tên thật để hiển thị trên UI (regulatory requirement).
- Lý do hỏi: Thông tư 40/2024 yêu cầu minh bạch đối tác quản lý tiền. UI cần show rõ tên + giấy phép.
- **Assume nếu không trả lời:** Dùng placeholder "[Tên đối tác]" trong mock, mark là dynamic content.

**Q3: Lãi suất có thay đổi không? Cơ chế thông báo?**
- BRD ghi 4.5% nhưng nói "lợi nhuận tạm tính" → lãi suất có thể thay đổi.
- Khi thay đổi: thông báo trước bao lâu? User có quyền từ chối? Tự động áp dụng?
- Lý do hỏi: Ảnh hưởng UX flow — cần design notification + confirmation hay chỉ inform?
- **Assume nếu không trả lời:** Lãi suất thay đổi → push notification + in-app banner trên dashboard. User không cần confirm, chỉ được inform.

**Q4: Hạn mức 100M/tháng — reset theo calendar month hay rolling 30 ngày?**
- Lý do hỏi: Ảnh hưởng cách hiển thị "Hạn mức còn lại" và validation logic.
- **Assume nếu không trả lời:** Calendar month (ngày 1 hàng tháng reset).

**Q5: Daily withdraw limit?**
- BRD mention "hạn mức rút" nhưng không nói con số. Data mock hiện tại có `dailyWithdrawLimit: 30_000_000`.
- Lý do hỏi: Cần confirm 30M/ngày hay unlimited (instant to ví)?
- **Assume nếu không trả lời:** 30M/ngày theo mock data hiện tại.

### SHOULD — Block UI Detail

**Q6: US 3.3 "Thanh toán/Chuyển tiền từ ví sinh lời" — out of scope giai đoạn 1, nhưng có UI placeholder không?**
- Lý do hỏi: Nếu có placeholder → cần design disabled state + "Sắp ra mắt" badge.
- **Assume:** Không show gì. Không tạo expectation cho feature chưa có.

**Q7: Dashboard 2 tabs — "Sản phẩm" vs "Quản lý" — content cụ thể mỗi tab?**
- "Sản phẩm" = thông tin sản phẩm (lãi suất, hạn mức, provider)?
- "Quản lý" = số dư + lãi + chart + GD gần đây?
- Lý do hỏi: Quyết định information architecture. Hiện tại mock chỉ có 1 dashboard view.
- **Assume:** Tab "Tổng quan" (số dư, chart lãi, GD gần đây) + Tab "Chi tiết" (lãi suất hiện tại, hạn mức, provider, điều khoản).

**Q8: Profit summary — "Tổng kết lợi nhuận" là screen riêng hay section trong dashboard?**
- Lý do hỏi: Nếu riêng → thêm 1 screen. Nếu section → tiết kiệm navigation.
- **Assume:** Section trong dashboard (tab Tổng quan), có "Xem chi tiết" link ra full-page nếu cần.

**Q9: Auth cho nạp/rút — OTP hay biometric hay cả hai?**
- BRD ghi "OTP/biometric" nhưng không rõ logic chọn.
- **Assume:** Biometric nếu đã enroll (Face ID/fingerprint) → fallback OTP nếu fail hoặc chưa enroll. Giống flow auth hiện tại của VSP (ref: node `40004333:4827`).

**Q10: Hủy đăng ký — "Rút hết tiền trước" là bắt buộc hay hệ thống tự rút?**
- Lý do hỏi: Nếu user phải tự rút → 2 steps (rút trước, hủy sau). Nếu hệ thống tự rút → 1 step (confirm hủy, tiền tự về ví).
- **Assume:** Hệ thống tự rút khi confirm hủy. User không phải tự rút trước — friction quá cao, drop-off sẽ lớn.

---

## 3. UX Risks

### Risk 1: Tên "Tự động" nhưng flow thủ công (HIGH)
- Nếu user phải tự nạp tiền mỗi lần → tên "sinh lời tự động" tạo kỳ vọng sai.
- User sẽ hỏi: "tự động ở đâu?" → mất trust.
- **Mitigation:** Hoặc (a) implement auto-sweep thật, hoặc (b) đổi tên thành "Sinh lời" (bỏ "tự động"), hoặc (c) giải thích rõ "tự động tính lãi" ngay trên product page.

### Risk 2: OTP cho MỌI action = friction cao (HIGH)
- BRD yêu cầu OTP cho: kích hoạt, nạp, rút, hủy = 4 OTP flows.
- Nạp 500k cũng phải OTP? User nạp 3 lần/tuần = 12 OTP/tháng chỉ riêng nạp tiền.
- **Mitigation:** Đề xuất threshold-based auth: < 5M → biometric only (nếu đã enroll), ≥ 5M → OTP. Hoặc: nạp không cần OTP (tiền từ ví mình sang ví mình), chỉ rút mới cần.
- **KPI impact:** "Time to activate ≤ 30s" rất khó đạt nếu OTP flow mất 15-20s riêng bước chờ + nhập.

### Risk 3: Số dư tối đa 100M — UX khi gần limit (MEDIUM)
- User có 95M trong sinh lời, muốn nạp thêm 10M → chỉ được nạp 5M.
- Nếu không show rõ "Còn có thể nạp: 5.000.000đ" → user nhập 10M → lỗi → frustration.
- **Mitigation:** Show remaining capacity ngay trên form nạp, pre-fill max amount option.

### Risk 4: "Lợi nhuận tạm tính" gây confusion (MEDIUM)
- User thấy số tiền lãi nhưng có disclaimer "tạm tính" → không biết có nhận thật không.
- **Mitigation:** Dùng từ ngữ rõ: "Lợi nhuận ước tính hôm nay" + tooltip/info icon giải thích: "Lợi nhuận được tính trên số dư cuối ngày, trả vào cuối tháng."

### Risk 5: Hủy flow phức tạp → user bỏ giữa chừng (LOW-MEDIUM)
- Nếu phải rút hết tiền trước → user cần: (1) Vào rút tiền, (2) Rút hết, (3) Chờ xử lý, (4) Vào hủy, (5) Confirm, (6) OTP, (7) Kết quả.
- 7 steps để hủy = churn risk (user bực → đánh giá 1 sao).
- **Mitigation:** Một nút "Hủy đăng ký" → hệ thống tự rút tiền + hủy trong 1 transaction. Max 3 steps: Confirm → OTP → Result.

### Risk 6: Entry point không rõ (LOW)
- BRD nói "entry point từ homepage" nhưng không chi tiết vị trí.
- Homepage đã có nhiều modules → thêm Sinh lời ở đâu cho không bị ngập?
- **Mitigation:** Cần Vi/Ivy quyết định placement: banner carousel, quick action grid, hoặc dedicated card section.

---

## 4. Edge Cases to Handle

### Từ Edge Case Library (mapped)

**Form Input (Nạp/Rút):**
- [ ] Empty state (button disabled)
- [ ] Amount = 0 → block
- [ ] Amount < minimum → inline error (BRD chưa nói min là bao nhiêu — **assume 10,000đ**)
- [ ] Amount > balance (ví VSP khi nạp, ví sinh lời khi rút) → "Số dư không đủ"
- [ ] Amount > remaining capacity (100M - current balance) → "Vượt hạn mức"
- [ ] Amount > monthly limit remaining → "Vượt hạn mức tháng"
- [ ] Amount > daily withdraw limit → "Vượt hạn mức rút/ngày"
- [ ] Quick amount chip > balance → chip disabled hoặc inline error khi tap
- [ ] Paste amount from clipboard → auto-validate
- [ ] Currency formatting realtime (1.000.000)
- [ ] Double tap prevention (disable button sau first tap)
- [ ] Loading state (spinner on button)

**Auth — OTP:**
- [ ] OTP sent (countdown timer)
- [ ] Wrong OTP → error + retry
- [ ] OTP expired → resend button
- [ ] Resend limit reached → "Thử lại sau X phút"
- [ ] Network error sending OTP → retry option

**Dashboard:**
- [ ] Empty state (vừa kích hoạt, chưa có GD) → FeedbackState "Nạp tiền để bắt đầu sinh lời"
- [ ] Loading (skeleton)
- [ ] Loaded (with data)
- [ ] Fetch error → retry
- [ ] Balance hidden (ẩn số dư) — đã có trong mock: `showBalance` setting
- [ ] Zero balance (đã rút hết) → show 0đ + CTA nạp tiền

**Result screens:**
- [ ] Success with details (amount, time, balance mới)
- [ ] Failed retryable → "Thử lại"
- [ ] Failed non-retryable → "Về trang chủ" + error code
- [ ] Processing/Pending → "Đang xử lý, kiểm tra sau"

**Transaction History:**
- [ ] Empty (no transactions) → "Chưa có giao dịch"
- [ ] Filter active but no results → "Không tìm thấy giao dịch"
- [ ] Pagination / infinite scroll (nếu > 20 items)
- [ ] Pull to refresh

### Domain-Specific Edge Cases (Sinh lời)

**Lãi suất:**
- [ ] Lãi suất thay đổi giữa lúc user đang ở product page → show warning "Lãi suất đã cập nhật"
- [ ] Lãi suất = 0% (edge case cực đoan) → block activation? Hay vẫn cho?
- [ ] User kích hoạt ngay cuối tháng → lãi tháng đầu rất ít → cần set expectation

**Nạp tiền:**
- [ ] Nạp khi ví VSP = 0đ → "Số dư ví không đủ. Nạp tiền vào ví trước."
- [ ] Nạp đúng 100M (max) → thành công nhưng after this mọi lần nạp thêm đều fail
- [ ] Nạp khi đã dùng hết hạn mức tháng → "Đã đạt hạn mức tháng. Thử lại từ [ngày 1 tháng sau]."
- [ ] Nạp khi hệ thống bảo trì (provider downtime) → "Hệ thống đang bảo trì"
- [ ] Concurrent nạp (2 sessions cùng lúc) → backend phải lock, UI show processing

**Rút tiền:**
- [ ] Rút khi lãi đang được tính (cuối ngày) → có miss lãi không? Cần giải thích.
- [ ] Rút toàn bộ → show "Bạn sẽ mất lãi ngày hôm nay: X đ"
- [ ] Rút > daily limit → "Vượt hạn mức rút/ngày. Còn lại: X đ"
- [ ] Rút khi provider đang xử lý GD trước đó → queue hoặc reject?

**Hủy đăng ký:**
- [ ] Hủy khi balance > 0 → phải rút hết trước (hoặc tự rút — xem Q10)
- [ ] Hủy khi có GD pending → block hủy cho đến khi GD settled
- [ ] Hủy rồi đăng ký lại → data lịch sử có giữ không?
- [ ] Hủy nhưng lãi cuối tháng chưa trả → lãi có được trả nốt không?

**Navigation / Global:**
- [ ] Deep link vào dashboard khi chưa kích hoạt → redirect về product page
- [ ] Deep link vào deposit khi chưa kích hoạt → redirect
- [ ] App kill giữa flow kích hoạt → resume hay restart?
- [ ] Network lost giữa OTP → offline message + retry khi có mạng
- [ ] Session timeout trên confirm screen → dialog "Phiên đã hết hạn"

---

## 5. Competitive Insights

### MoMo — "Sinh lời" (Tự động)
- **Model:** Auto-sweep — tiền trong ví tự chuyển sang quỹ mở, rút bất cứ lúc nào.
- **UX tốt:** One-tap activate, dashboard đơn giản, rút tức thì. Không cần OTP để nạp (vì tiền từ ví mình).
- **UX chưa tốt:** Lãi suất hiển thị phức tạp (có lúc hiện %, có lúc hiện tuyệt đối), nhiều disclaimer nhỏ.
- **Takeaway cho VSP:** Copy mô hình rút không cần OTP cho nạp. Dashboard cần clarity hơn MoMo.

### ZaloPay — "Quỹ tích lũy"
- **Model:** User chủ động nạp, lãi hàng ngày, rút tức thì.
- **UX tốt:** Hiển thị "Hôm nay bạn được +X đ" rất motivating. Chart 7 ngày gần nhất.
- **UX chưa tốt:** Flow kích hoạt dài (phải đọc nhiều điều khoản). Hủy phải gọi hotline (!).
- **Takeaway cho VSP:** Chart daily interest (đã có trong mock `MOCK_DAILY_INTEREST`). Hủy phải self-serve, KHÔNG bao giờ yêu cầu gọi hotline.

### Cake by VPBank — "Ví sinh lời"
- **Model:** Gửi tiết kiệm online, kỳ hạn linh hoạt.
- **UX tốt:** Onboarding rõ ràng, so sánh lãi suất các kỳ hạn.
- **UX chưa tốt:** Quá nhiều options (3-6-12 tháng) gây decision paralysis.
- **Takeaway cho VSP:** Keep it simple — 1 product, 1 lãi suất. Không nên có multiple tiers ở giai đoạn 1 (dù mock data có `INTEREST_TIERS` — đề xuất hide cho phase 1).

### Tổng kết competitive:
| Feature | MoMo | ZaloPay | Cake | VSP (đề xuất) |
|---|---|---|---|---|
| Auto-sweep | Có | Không | Không | Phase 2 |
| Rút tức thì | Có | Có | Tùy kỳ hạn | Có |
| OTP nạp | Không | Không | Có | Không (đề xuất) |
| OTP rút | Biometric | OTP | OTP | Biometric (fallback OTP) |
| Daily interest display | Có | Có | Không | Có |
| Self-serve hủy | Có | Không (!) | Có | Có |

---

## 6. Recommendations

### Rec 1: Bỏ OTP cho nạp tiền (STRONG)
- Tiền từ ví VSP → ví sinh lời = tiền từ túi trái sang túi phải. Không có risk mất tiền.
- MoMo + ZaloPay đều không yêu cầu OTP nạp.
- Impact: Giảm friction nạp → tăng deposit frequency → tăng AUM.
- Chỉ cần biometric/PIN confirm là đủ (hoặc không cần auth nếu < threshold).

### Rec 2: Rename hoặc clarify "Tự động" (STRONG)
- Nếu phase 1 chưa có auto-sweep → đừng gọi "Sinh lời tự động".
- Đề xuất: "Sinh lời" (ngắn gọn, đúng bản chất). Thêm badge "Tự động tích lũy lãi" để giải thích.
- Khi có auto-sweep (phase 2) → mới rebrand thành "Sinh lời tự động".

### Rec 3: Merge screens để giảm steps (STRONG)
Hiện BRD mô tả khá nhiều screens. Đề xuất merge:
- **Confirm activation:** Merge info display + checkboxes vào 1 screen (đã có trong current design).
- **Deposit/Withdraw:** Dùng tab switch trên cùng 1 screen (đã implement — `/sinhloi/deposit-withdraw`).
- **Profit summary:** Đừng tạo screen riêng — đặt trong dashboard tab "Chi tiết" hoặc expand section.
- **Terms:** Bottom sheet, không full page (trừ khi > 3 scroll heights).

### Rec 4: Show "Lãi mỗi ngày" prominently trên Dashboard (MEDIUM)
- ZaloPay pattern rất hiệu quả: "Hôm nay +2.714đ" → dopamine hit → user quay lại check.
- Đã có `MOCK_DAILY_INTEREST` data và chart 7 ngày → implement prominently.
- Đặt ngay dưới balance, trước transaction list.

### Rec 5: Progressive disclosure cho điều khoản (MEDIUM)
- Đừng show wall-of-text điều khoản. Dùng:
  - Tóm tắt 3 bullet points (lãi suất, hạn mức, rút tức thì)
  - "Xem đầy đủ" link → bottom sheet / full page
- Checkboxes trên confirm screen: "Tôi đồng ý điều khoản" + "Tôi hiểu lợi nhuận tạm tính"

### Rec 6: Gamification — INTEREST_TIERS nên để phase 2 (MEDIUM)
- Mock data đã có `INTEREST_TIERS` (Cơ bản → Bạc → Vàng → Kim cương) + `MEMBERSHIP_RANKS`.
- Phase 1 nên focus vào core: kích hoạt + nạp/rút + dashboard.
- Gamification (tier unlock, missions) add complexity → test core trước, gamify sau.
- **Rec:** Hide tier UI ở phase 1. Show lãi suất cố định. Phase 2 mới unlock tiers.

### Rec 7: Empty state → CTA rõ ràng (LOW)
- Vừa kích hoạt xong → dashboard balance = 0 → screen trông trống.
- Cần FeedbackState mạnh: icon + "Nạp tiền để bắt đầu sinh lời" + CTA button "Nạp tiền ngay".
- Tương tự cho zero-balance sau khi rút hết.

### Rec 8: "Hủy" flow = tối đa 3 steps (LOW)
- Confirm (show consequences: mất lãi tháng này, hủy membership tier) → Auth → Result.
- Hệ thống tự rút tiền về ví + hủy account trong 1 transaction.
- Không bắt user rút tiền trước rồi mới cho hủy.

---

## Existing Implementation Status

Dựa trên codebase hiện tại (`app/sinhloi/`), các phần sau ĐÃ được implement:
- `/sinhloi/` — States browser (UI + Flow tabs, Mermaid charts)
- `/sinhloi/dashboard` — Dashboard screen
- `/sinhloi/data.ts` — Full mock data (balance, transactions, config, tiers, membership, FAQ, settings)
- `/sinhloi/history` — Transaction history
- `/sinhloi/intro` — Product intro page
- `/sinhloi/activate` — Activation confirm
- `/sinhloi/otp` — OTP screen
- `/sinhloi/result-activate` — Activation result
- `/sinhloi/deposit-withdraw` — Deposit/Withdraw (tab-based)
- `/sinhloi/account-detail` — Account breakdown
- `/sinhloi/faq` — FAQ page
- `/sinhloi/membership` — Membership ranks
- `/sinhloi/settings` — Settings
- `/sinhloi/upgrade` — Upgrade tier

**Gaps so với BRD:**
- Chưa có screen "Hủy đăng ký" (Epic 4)
- Chưa có screen "Tổng kết lợi nhuận" riêng (có thể merge vào dashboard)
- Chưa có confirm + auth screens cho nạp/rút (S8, S9, S10)
- Chưa có "Xem điều khoản & hợp đồng" (US 2.3)
- Gamification (tiers, membership) đã có nhưng cần PO confirm có ship phase 1 không

---

*Nate — "Khoan, case này chưa cover nè" — Analysis complete. Chờ PO confirm Q1-Q10 trước khi Nate design flow.md.*

---
Back: [[features/index|Features]] · [[features/sinhloi-auto/status|sinhloi-auto]]
