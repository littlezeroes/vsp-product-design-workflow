# BRD Analysis — BIDV Liên kết, Nạp/Rút Ví
> Analyst: 🔍 Nate | Date: 2026-03-09

---

## Đã hiểu từ BRD

### Scope tổng quan
- Feature mở rộng liên kết ngân hàng BIDV cho VSP (hiện chỉ có Techcombank + Napas)
- 5 Epics: Liên kết → Nạp tiền → Rút tiền → Hủy liên kết → Quản lý giao dịch
- Target launch: W23 — 28/03/2026
- Prerequisite: User đã eKYC
- KPI: Completion Rate ≥80%, User Activation (eKYC + liên kết) ≥90%

### Epic 1 — Liên kết Ví với TK ngân hàng BIDV
- Entry points: "Liên kết ngay" (Home) hoặc "Nạp/Rút" → popup "Thêm ngân hàng" hoặc Tài khoản → Liên kết ngân hàng
- **Improvement:** bỏ bước trung gian "Quản lý thanh toán" — từ "Liên kết ngay" đi thẳng "Liên kết ngân hàng"
- Chỉ hiển thị ngân hàng chưa liên kết + VSP đã có kết nối
- Màn Liên kết BIDV: hiển thị info KH (Họ tên, SĐT, CCCD) từ eKYC, input Số thẻ/STK (3-14 ký tự số)
- API vấn tin 1 chạm: auto-fill STK masking cho user chọn (đặc thù BIDV)
- Checkbox TnC + đồng ý chia sẻ dữ liệu (uncheck mặc định, button disable)
- 2 phương thức xác thực: deeplink (app-to-app BIDV SmartBanking) HOẶC OTP (SMS/app tùy NH)
- OTP countdown: 3 phút
- Kết quả: SUCCESS / FAILED (retry) / PENDING (enquiry) / Callback lỗi (retry 1p→3p→10p)

### Epic 2 — Nạp tiền Ví
- Entry: "Nạp/Rút" (Home) → Tab "Nạp tiền" | hoặc "Nạp thêm" khi thanh toán không đủ dư
- Validate: amount >0, integer, min/max theo NH, daily/monthly limit
- Auth: PIN/FaceID/Biometric → gửi yêu cầu NH
- **Improvement:** phân loại GD theo response NH:
  - GD loại C/D: cần xác thực thêm tại app NH (deeplink + countdown 3 phút)
  - GD loại A: không cần xác thực NH, cập nhật trạng thái trực tiếp
- Kết quả: SUCCESS (so khớp amount) / FAILED / PENDING / Amount mismatch → FAILED + log

### Epic 3 — Rút tiền Ví
- Tương tự nạp, nhưng: trừ tiền ví trước → gửi NH → chờ callback
- Thêm validate: Số dư ví ≥ số tiền rút
- Rút KHÔNG cần xác thực tại app NH (chỉ auth tại VSP)
- Kết quả: tương tự nạp

### Epic 4 — Hủy liên kết
- Entry: Tài khoản → Liên kết NH → Quản lý TT → chọn NH → Chi tiết → Hủy liên kết
- Popup cảnh báo khác nhau: nhiều NH vs NH cuối cùng
- 2 phương thức: deeplink đến NH HOẶC auth tại VSP (PIN/FaceID)
- Kết quả: SUCCESS (revoke token, show lại NH trong danh sách liên kết) / FAILED / PENDING

### Epic 5 — Quản lý giao dịch
- Quản lý liên kết: Tài khoản → Liên kết NH → "Quản lý thanh toán" (hiển thị NH đã liên kết + còn token)
- Lịch sử GD: "Xem tất cả" (Home) hoặc tab "Giao dịch" → màn Lịch sử GD

### NFRs rõ ràng
- Tải trang ≤2s, 95% GD resolve trong SLA, uptime ≥99.9%
- Mọi GD phải có trạng thái cuối cùng xác định
- Timeout/network issue → PENDING (không fail ngay)
- Disable action khi PROCESSING, chặn double submit
- Error message thân thiện, có CTA rõ ràng

### Notifications
- 6 loại push notification (liên kết/hủy thành công/thất bại, nạp/rút thành công/thất bại)
- Bilingual (VI + EN)

### Error codes
- Bảng mã lỗi BIDV đầy đủ (003, 004, 005, 031-048, 061, 066, 096-104, 114, 128...)
- HTTP error mapping (404, 408, 500, 502, 503, 504)
- VSP errors: hạn mức min/max/ngày/tháng, sai PIN, số dư không đủ

---

## Cần PO confirm

### MUST ANSWER (block flow)

1. **API vấn tin 1 chạm BIDV — response format?**
   - Lý do hỏi: BRD nói "auto fill vào trường STK masking để người dùng chọn" — nhưng không rõ: user có thể có nhiều STK tại BIDV? Nếu có, UI cần list chọn. Nếu chỉ 1, chỉ cần auto-fill.
   - Option A: API trả danh sách STK masking → user chọn từ list
   - Option B: API trả 1 STK → auto-fill, user chỉ confirm
   - Option C: API có thể trả 0 (user không có STK phù hợp) → cần error state

2. **Xác thực liên kết BIDV dùng deeplink hay OTP?**
   - Lý do hỏi: BRD có cả 2 AC (1.2.3 deeplink + 1.2.4 OTP) nhưng không rõ BIDV cụ thể dùng phương thức nào. Câu "áp dụng với NH hợp tác cho phép liên kết qua deeplink" gợi ý deeplink, nhưng cần xác nhận.
   - Option A: BIDV chỉ dùng deeplink (BIDV SmartBanking) → không cần màn OTP cho liên kết
   - Option B: BIDV dùng OTP → cần màn OTP
   - Option C: Cả hai (tùy user setup) → cần cả 2 flow

3. **Hủy liên kết BIDV — deeplink hay auth VSP?**
   - Lý do hỏi: AC 4.2.1 (deeplink đến NH) và AC 4.2.2 (auth tại VSP) — BIDV dùng cái nào?
   - Option A: Deeplink → redirect BIDV SmartBanking
   - Option B: Auth VSP (PIN/FaceID) → không cần mở app NH
   - Option C: Cả hai

4. **GD loại A/C/D — threshold cụ thể của BIDV?**
   - Lý do hỏi: Improvement nạp tiền phụ thuộc vào phân loại GD. Ví dụ BRD: T=15tr nạp 2tr → loại A (chỉ auth VSP). T=19tr nạp 2tr → loại C/D (auth thêm NH). Nhưng "T" là tổng luỹ kế gì? Threshold chính xác?
   - Impact: Quyết định khi nào show màn "Mở app NH xác thực" vs khi nào chỉ cần auth VSP

5. **User chưa cài BIDV SmartBanking — xử lý thế nào?**
   - Lý do hỏi: BRD ghi "Thiết bị đã cài đặt ứng dụng BIDV SmartBanking" như prerequisite. Nhưng nếu user chưa cài → deeplink fail.
   - Option A: Check trước → nếu chưa cài → redirect App Store/Play Store
   - Option B: Fallback sang OTP
   - Option C: Block + thông báo "Vui lòng cài BIDV SmartBanking"

### SHOULD ANSWER (block UI)

6. **Wording popup hủy NH cuối cùng — chi tiết?**
   - Lý do: BRD chỉ ghi "Hủy liên kết ngân hàng cuối cùng" — cần wording cụ thể hơn: cảnh báo gì? Hệ quả gì? User mất gì?
   - Default nếu không trả lời: "Đây là ngân hàng liên kết cuối cùng. Sau khi hủy, bạn sẽ không thể nạp/rút tiền cho đến khi liên kết ngân hàng mới."

7. **Min/Max amount nạp/rút cụ thể cho BIDV?**
   - Lý do: BRD ghi "min/max tùy theo NH liên kết" — cần số cụ thể để hiển thị error message
   - Default: Min 10.000đ (theo error table), Max chờ BIDV confirm

8. **Có giao dịch PENDING khi hủy liên kết — block hay cho phép?**
   - Lý do: BRD ghi "không làm ảnh hưởng đến tiền và GD đang xử lý" nhưng không nói rõ: nếu có GD nạp/rút PENDING → cho hủy hay block?
   - Default: Block hủy + thông báo "Có giao dịch đang xử lý. Vui lòng chờ hoàn tất."

9. **Màn hình kết quả — dùng shared template (node 40013468:41558) hay custom?**
   - Lý do: VSP đã có template kết quả GD dùng chung. BRD không specify design riêng.
   - Default: Dùng shared template, thêm fields: Ngân hàng, Số TK masking

10. **Entry "Nạp thêm" khi thanh toán không đủ dư — redirect về đâu sau nạp?**
    - Lý do: AC 2.1.2 chỉ nói redirect đến màn Nạp tiền, nhưng sau nạp thành công → quay về flow thanh toán hay Home?
    - Default: Quay về flow thanh toán đang pending

---

## AI ASSUMPTIONS (sẽ dùng nếu PO skip)

1. **Màn "Liên kết ngân hàng" (danh sách NH) dùng lại design hiện có** — Lý do: BRD ghi "tham chiếu tương tự hiện hữu", VSP đã có page "Liên kết ngân hàng" (node `40002105:6991`). Chỉ thêm BIDV vào list.

2. **Nạp/Rút dùng tab UI hiện có** — Lý do: VSP đã có page "Nạp tiền / Rút tiền" (node `40002297:32958`). BRD không yêu cầu redesign, chỉ thêm BIDV làm nguồn tiền.

3. **Auth flow dùng shared pattern** — Lý do: PIN/FaceID/Biometric đã có sẵn (node `40004769:73935`, `40004333:4827`). BRD nói "theo rule chung".

4. **Transaction result dùng shared template** — Lý do: Node `40013468:41558` đã có 3 states (Success/Processing/Failed). BRD không yêu cầu custom.

5. **Quản lý thanh toán dùng page hiện có** — Lý do: Node `40002297:23425` đã có. Chỉ thêm BIDV account card.

6. **Lịch sử GD dùng page hiện có** — Lý do: Node `40003664:4167` đã có filter, list. GD BIDV nạp/rút chỉ thêm row type.

7. **OTP countdown = 3 phút** — Lý do: BRD specify rõ cho cả liên kết và xác thực nạp tiền.

8. **Retry callback schedule: 1p → 3p → 10p → fail** — Lý do: BRD specify rõ, áp dụng cho cả liên kết, nạp, rút, hủy.

9. **Notification deeplink → Chi tiết GD** — Lý do: Bảng notification ghi "Target screen: Chi tiết giao dịch".

10. **Rút tiền KHÔNG cần xác thực tại app NH** — Lý do: Epic 3 không đề cập deeplink/app-to-app, chỉ auth VSP. Tiền trừ ví trước → gửi NH → callback.

---

## User Personas

### Persona 1: Anh Tuấn — Người dùng mới, vừa eKYC
- 28 tuổi, nhân viên văn phòng Vinhomes
- Vừa tải VSP, hoàn tất eKYC, ví trống
- **Goal:** Liên kết BIDV → nạp tiền lần đầu → thanh toán dịch vụ Vinhomes
- **Pain point:** Không biết bắt đầu từ đâu, sợ mất tiền
- **Behavior:** Đọc lướt, bấm nhanh, muốn xong trong 2 phút
- **Risk:** Drop-off nếu phải chuyển app quá nhiều bước

### Persona 2: Chị Linh — Người dùng active, đã có TCB
- 35 tuổi, đã liên kết Techcombank, dùng VSP thanh toán hàng ngày
- **Goal:** Thêm BIDV vì lương chuyển qua BIDV, muốn nạp ví trực tiếp
- **Pain point:** Phải chuyển khoản TCB→BIDV rồi mới nạp ví
- **Behavior:** Biết app rồi, chỉ cần path ngắn nhất
- **Risk:** So sánh với MoMo/ZaloPay — nếu flow dài hơn sẽ bỏ

### Persona 3: Bác Hải — Người lớn tuổi, ít tech-savvy
- 55 tuổi, cư dân Vinhomes, con cái cài VSP giúp
- **Goal:** Rút tiền ví về BIDV khi cần
- **Pain point:** Không hiểu "deeplink", sợ bấm nhầm mất tiền, hoang mang khi app chuyển qua chuyển lại
- **Behavior:** Đọc kỹ từng dòng, do dự trước khi bấm
- **Risk:** Gọi hotline nếu thấy "Đang xử lý" quá 30 giây

---

## User Journeys

### Journey 1: Liên kết BIDV lần đầu (Happy path)
```
Home → "Liên kết ngay" → Màn "Liên kết ngân hàng" (list NH)
→ Chọn BIDV → Màn "Liên kết BIDV" (info + input STK + TnC)
→ "Tiếp tục" → Redirect BIDV SmartBanking (xác thực)
→ Callback → "Liên kết thành công" → Home (updated)
```
**Screens:** 4 (List NH → Form BIDV → Waiting/Redirect → Result)

### Journey 2: Nạp tiền (Happy path — GD loại A)
```
Home → "Nạp/Rút" → Tab "Nạp tiền" → Chọn BIDV → Nhập amount
→ "Tiếp tục" → Xác nhận nạp tiền → Auth (PIN/FaceID)
→ API response loại A → "Nạp tiền thành công"
```
**Screens:** 3 (Nạp tiền → Confirm → Result)

### Journey 3: Nạp tiền (GD loại C/D — cần auth NH)
```
...→ Auth (PIN/FaceID) → API response loại C/D
→ Màn hướng dẫn (countdown 3p) → Redirect BIDV SmartBanking
→ Xác thực tại BIDV → Callback → "Nạp tiền thành công"
```
**Screens:** 4 (Nạp tiền → Confirm → Waiting → Result)

### Journey 4: Rút tiền (Happy path)
```
Home → "Nạp/Rút" → Tab "Rút tiền" → Chọn BIDV → Nhập amount
→ "Tiếp tục" → Xác nhận rút tiền → Auth (PIN/FaceID)
→ Callback → "Rút tiền thành công"
```
**Screens:** 3 (Rút tiền → Confirm → Result)

### Journey 5: Hủy liên kết
```
Tài khoản → Liên kết NH → Quản lý TT → Chọn BIDV
→ Chi tiết NH → "Hủy liên kết" → Popup cảnh báo → Auth
→ Callback → "Hủy thành công"
```
**Screens:** 3 (Chi tiết NH → Popup → Result) — dùng lại Quản lý TT

---

## Pain Points & Risks

### UX Risks
1. **App-switching anxiety:** User chuyển từ VSP → BIDV SmartBanking → quay lại VSP. Nếu BIDV app chậm hoặc user lạc → drop-off cao. Cần hướng dẫn rõ + countdown visible.
2. **PENDING state confusion:** User nạp tiền → thấy "Đang xử lý" → hoang mang → nạp lại → double charge potential. NFR có "disable action khi PROCESSING" nhưng cần UX rõ ràng hơn.
3. **Amount mismatch silent fail:** User nạp 1tr, NH trả 900k → fail + log. User không hiểu tại sao fail. Error message cần rõ.
4. **Callback delay tối đa 10 phút:** User nạp xong → chờ → đóng app → quên kiểm tra. Cần push notification kịp thời.
5. **Hủy NH cuối cùng:** Impact lớn nhưng BRD chỉ có 1 dòng cảnh báo. Cần copy rõ hệ quả.

### Technical Risks
1. **BIDV SmartBanking deeplink compatibility:** Không phải user nào cũng có phiên bản mới nhất BIDV app. Deeplink có thể fail trên version cũ.
2. **Callback reliability:** BRD acknowledge timeout + retry schedule, nhưng 10 phút là lâu. User experience tệ.
3. **API vấn tin 1 chạm:** Feature mới chỉ cho BIDV. Nếu API fail → user phải tự nhập STK → friction tăng.
4. **Rút tiền trừ trước:** Nếu NH fail/timeout → tiền đã trừ ví nhưng chưa về NH → cần refund flow (BRD không đề cập rõ).

### Business Risks
1. **Compliance:** Thông tư 40/2024/TT-NHNN — cần verify TnC wording với legal team.
2. **Fraud:** Liên kết STK người khác → BRD check CCCD/SĐT/Họ tên match, nhưng nếu BIDV data khác VSP eKYC data → false reject.

---

## Dependencies

| Dependency | Owner | Status | Impact nếu thiếu |
|---|---|---|---|
| BIDV API specs (link, unlink, top-up, withdraw, enquiry) | BIDV Tech | Cần confirm | Block toàn bộ |
| BIDV SmartBanking deeplink format | BIDV | Cần confirm | Block auth flow |
| API vấn tin 1 chạm (auto-fill STK) | BIDV | Cần confirm | Degrade → manual input |
| GD loại A/C/D threshold config | BIDV | Cần confirm | Block nạp tiền improvement |
| TnC + Data sharing consent wording | Legal | Cần confirm | Block liên kết flow |
| Error code mapping (đầy đủ) | BIDV + BE | Partial (có bảng) | Degrade UX error states |
| Push notification templates | BE + Marketing | Có draft (bilingual) | OK |
| Existing VSP screens (Liên kết, Nạp/Rút, Quản lý TT) | Design | Có sẵn | OK |

---

## Edge Cases (cross-ref edge-case-library)

### Liên kết
- [ ] User nhập STK không tồn tại → error "Số tài khoản không tồn tại" (code 033)
- [ ] User có STK BIDV nhưng chưa đăng ký SmartBanking → error code 041
- [ ] User đã liên kết BIDV rồi → BIDV không xuất hiện trong list (BRD cover)
- [ ] User cancel giữa chừng trên BIDV SmartBanking → VSP cần handle back navigation
- [ ] CCCD/SĐT/Họ tên mismatch giữa VSP eKYC và BIDV → error code 003/040
- [ ] Network lost khi đang redirect → stuck screen
- [ ] BIDV SmartBanking crash/not installed → deeplink fail
- [ ] API vấn tin 1 chạm trả 0 kết quả → fallback manual input?
- [ ] API vấn tin 1 chạm trả nhiều STK → user chọn sai → hệ quả?

### Nạp tiền
- [ ] Amount = 0 → block (BRD cover)
- [ ] Amount < 10.000đ → error "Hạn mức tối thiểu" (BRD cover)
- [ ] Amount > max → error (BRD cover)
- [ ] Amount > daily/monthly limit → error (BRD cover)
- [ ] TK BIDV không đủ số dư → error code 035
- [ ] User xác thực VSP thành công nhưng không mở BIDV app trong 3 phút → FAILED
- [ ] User xác thực BIDV lúc 2:59 → NH ghi nhận nhưng callback delay tối đa 10 phút
- [ ] Amount mismatch (NH trả amount khác request) → FAILED + log
- [ ] Double submit → NFR cover (disable button)
- [ ] App kill mid-flow → resume hay restart?
- [ ] "Nạp thêm" từ thanh toán → nạp xong redirect về đâu?

### Rút tiền
- [ ] Số dư ví không đủ → error (BRD cover)
- [ ] Tiền đã trừ ví nhưng NH timeout → PENDING → user hoang mang → refund khi nào?
- [ ] Rút về TK BIDV đã đóng/đông → error code 036
- [ ] Rút min amount = ? (BRD: 10.000đ?)

### Hủy liên kết
- [ ] Hủy khi có GD PENDING → block hay cho phép? (assumption: block)
- [ ] Hủy NH cuối → user chỉ còn ví trống, không nạp/rút được
- [ ] Hủy thành công nhưng token BIDV chưa revoke kịp → race condition
- [ ] User hủy rồi liên kết lại ngay → API cho phép không?

### Global
- [ ] Dark mode: tất cả screens mới phải map đúng semantic tokens
- [ ] Bilingual: tất cả error messages + notification + UI labels cần VI + EN
- [ ] Deep link entry: notification tap → mở đúng Chi tiết GD
- [ ] Accessibility: VoiceOver cho countdown timer, error states

---

## Design Patterns cần apply (từ VSP Design System)

| Pattern | Nguồn | Áp dụng cho |
|---|---|---|
| Bank Selector List | `40002105:6991` (Liên kết NH) | Epic 1 — Chọn BIDV |
| Form Input + Validation | edge-case-library: Form Input | Epic 1 — Nhập STK |
| Checkbox + Button enable/disable | Design system | Epic 1 — TnC consent |
| AmountInput + QuickAmountChips | `40002297:32958` (Nạp/Rút) | Epic 2, 3 |
| Confirmation Card | Shared pattern | Epic 2, 3 — Xác nhận GD |
| Auth Sheet (PIN/FaceID) | `40004769:73935` | Epic 2, 3, 4 |
| Countdown Timer | Cần design mới (hoặc reuse OTP pattern) | Epic 1 (OTP), Epic 2 (app-to-app) |
| Transaction Result (3 states) | `40013468:41558` | Epic 2, 3, 4 — Kết quả |
| Confirm Dialog / Bottom Sheet | edge-case-library: Bottom Sheet | Epic 4 — Popup hủy |
| Bank Account Card | `40002297:23425` (Quản lý TT) | Epic 5 — List liên kết |
| Transaction List Item | `40003664:4167` (Lịch sử) | Epic 5 — History |
| Error Screen | Shared pattern | Tất cả epics |
| Loading / Skeleton | Shared pattern | Tất cả epics |
| Push Notification | Existing system | Tất cả epics |

---

## Tổng kết Nate

**BRD quality: 7/10** — Chi tiết acceptance criteria tốt, có bảng mã lỗi, có NFR. Nhưng thiếu:
- Không rõ BIDV dùng deeplink hay OTP cho từng epic
- Threshold GD loại A/C/D không rõ
- Refund flow khi rút tiền timeout không đề cập
- "Nạp thêm" redirect sau nạp không rõ
- Edge case "chưa cài BIDV SmartBanking" không cover

**Recommendation:** Cần PO trả lời 5 câu MUST trước khi Nate design flow. Đặc biệt Q2 (deeplink vs OTP) quyết định số screens và complexity.

**Estimated screens mới cần design:** ~3-5 (Form liên kết BIDV, Waiting/redirect screen, maybe OTP screen). Còn lại reuse existing.

**Risk level:** MEDIUM — Feature well-scoped nhưng phụ thuộc nặng vào BIDV API behavior và deeplink reliability.
