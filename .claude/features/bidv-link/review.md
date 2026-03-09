# Flow Review — BIDV Liên kết, Nạp/Rút Ví
> Reviewer: 👹 Đức | Date: 2026-03-09
> Reviewed: flow.md by Nate

---

## 🔴 Phải sửa (block)

### 1. **Epic 1 — S2: "Not installed → redirect Store" là dead end**
- **Vấn đề:** User tap "Tiếp tục" → phát hiện chưa cài BIDV SmartBanking → redirect Store. Xong cài app → quay lại VSP. Flow ghi "tap Tiếp tục lại" — nhưng user quay lại VSP thì đang ở đâu? S2 có còn state không? Nếu app bị kill khi user qua Store thì sao? User phải nhập lại STK?
- **Tại sao quan trọng:** Đây là drop-off point lớn nhất. User phải: (1) qua Store, (2) cài app, (3) quay lại VSP, (4) nhớ bấm Tiếp tục. 4 bước cognitive load. Nhiều user sẽ quên hoặc bỏ luôn.
- **Đề xuất:**
  - S2 phải persist state (STK + checkbox) vào local storage.
  - Khi user quay lại VSP từ Store, auto-detect BIDV đã cài → show toast "BIDV SmartBanking đã sẵn sàng" + auto-trigger deeplink (hoặc ít nhất highlight CTA).
  - Flow cần ghi rõ state resume behavior khi quay lại từ Store.

### 2. **Epic 2 — S6 → Auth → deeplink BIDV = 3 bước confirm liên tiếp, quá nhiều**
- **Vấn đề:** Mày là user, mày muốn nạp 100k. Flow: S5 (nhập tiền) → S6 (xác nhận) → Auth PIN → deeplink BIDV → chờ → kết quả. Đó là **5 bước** sau khi nhập số tiền. S6 "Xác nhận" rồi lại Auth rồi lại xác thực BIDV — user confirm 3 lần cho 1 giao dịch. Mỗi lần confirm user đều phải hỏi "mình đã bấm cái này chưa?"
- **Tại sao quan trọng:** Fintech rule: mỗi lần confirm thêm = ~15-20% drop-off. 3 lần confirm = mất nửa user.
- **Đề xuất:**
  - Merge S6 confirm vào Auth screen: show tóm tắt GD ngay trên PIN screen (như Momo, VNPay). User nhìn thấy chi tiết + nhập PIN = 1 bước thay vì 2.
  - Hoặc: Auth trigger ngay khi tap "Xác nhận" trên S6 (overlay) — đừng navigate sang screen mới. Flow ghi "overlay" nhưng user vẫn cảm giác 2 bước riêng biệt. Cần làm rõ Auth là inline modal, không phải screen transition.

### 3. **Epic 3 — Rút tiền: "Tiền đã trừ ví" nhưng NH timeout — user hoảng**
- **Vấn đề:** Flow ghi: "Tiền trừ ví trước → gửi NH → callback." Nếu NH timeout → S11 "Đang xử lý" + refund notice "Tiền sẽ được hoàn trong [X]". Nhưng [X] là bao lâu? Refund auto hay manual? User thấy ví bị trừ + NH chưa nhận = panic moment. "Kiểm tra sau" là câu trả lời tệ nhất khi tiền user đang lơ lửng.
- **Tại sao quan trọng:** Đây là trust killer #1 trong fintech. User mất tiền (dù tạm) = gọi hotline ngay = support cost + churn.
- **Đề xuất:**
  - S11 "Đang xử lý" phải hiển thị: thời gian hoàn tối đa cụ thể (ví dụ "Hoàn tiền trong tối đa 15 phút"), **số dư hiện tại** (cho user biết tiền ở đâu), + **hotline/live chat** button.
  - Push notification phải gửi ngay khi biết PENDING, không đợi resolve. Content: "Giao dịch rút X đồng đang xử lý. Nếu thất bại, tiền sẽ hoàn về ví trong 15 phút."
  - Flow cần define rõ: refund là auto (bao lâu) hay manual (cần CS)?

### 4. **Global — "Chờ xác thực BIDV" (S3/S7/S13) không có cancel**
- **Vấn đề:** User đang ở S3 (chờ xác thực), countdown 3 phút. User đổi ý → muốn hủy → không có nút Cancel. Chỉ có "Mở lại BIDV SmartBanking". User bị trap: phải chờ 3 phút hết timeout hoặc kill app.
- **Tại sao quan trọng:** Vi phạm "quay lại phải dễ như đi tới." User mất quyền kiểm soát = frustration. 3 phút là rất lâu khi user đang chờ mà không muốn chờ.
- **Đề xuất:** Thêm CTA "Hủy giao dịch" (secondary, dưới "Mở lại BIDV") → confirm dialog "Bạn muốn hủy?" → navigate về screen trước. Server-side: cancel pending request nếu chưa callback.

---

## 🟡 Nên sửa

### 1. **Epic 1 — S2: Checkbox TnC uncheck mặc định = friction thừa**
- **Vấn đề:** User phải: nhập STK + scroll đọc TnC + check checkbox + tap Tiếp tục. Checkbox uncheck mặc định nghĩa là thêm 1 tap. Nhiều user sẽ không thấy checkbox (ở dưới fold) → bấm Tiếp tục → không hiểu tại sao disabled.
- **Đề xuất:** Đổi thành: tap "Tiếp tục" mở TnC bottom sheet → user đọc + "Đồng ý & Tiếp tục" (1 action). Hoặc ít nhất: khi user tap Tiếp tục mà chưa check → scroll tới checkbox + highlight shake animation. Đừng im lặng disable.

### 2. **Epic 1 — Edge case 7: "Vui lòng cập nhật BIDV SmartBanking" — assumption chưa validate**
- **Vấn đề:** Deeplink fail do version cũ → dialog "Vui lòng cập nhật." Nhưng làm sao detect được là version cũ vs deeplink scheme thay đổi vs app bị crash? Hầu hết OS không cho phép check app version. Source ghi "Assumption."
- **Đề xuất:** Đổi thành generic: "Không thể mở BIDV SmartBanking. Vui lòng kiểm tra ứng dụng đã được cập nhật." + CTA mở Store. Đừng assume nguyên nhân.

### 3. **Epic 2 — S5: Thiếu hiển thị số dư ví hiện tại**
- **Vấn đề:** User nhập số tiền nạp nhưng flow không ghi rõ có hiển thị số dư ví hiện tại trên S5 không. User không biết mình đang có bao nhiêu → không biết nạp bao nhiêu cho đủ.
- **Đề xuất:** S5 phải show "Số dư ví: X đ" ngay trên input. Nếu entry là "Nạp thêm" từ thanh toán → show thêm "Cần thêm: Y đ" (số tiền thiếu).

### 4. **Epic 4 — Hủy liên kết: thiếu flow "Forgot PIN" khi auth lock**
- **Vấn đề:** Epic 2 & 3 có Auth lock (3x wrong PIN). Epic 4 flow ghi hủy qua deeplink BIDV — không cần auth VSP. Nhưng nếu PO sau này đổi: cần auth VSP trước khi hủy liên kết (vì đây là action nhạy cảm) → flow thiếu.
- **Đề xuất:** Ghi chú rõ: "Hủy liên kết KHÔNG yêu cầu auth VSP (confirm by PO)." Để khi PO đổi ý, team biết cần thêm auth step.

### 5. **S4/S8/S11/S14 — Result "Thử lại" quay về form quá xa**
- **Vấn đề:** S8 (Kết quả nạp thất bại) → "Thử lại" → S5 (nhập lại số tiền). User phải nhập lại từ đầu. Nếu lỗi chỉ là BIDV timeout → user chỉ muốn retry cùng amount, không muốn nhập lại.
- **Đề xuất:** "Thử lại" → quay về S6 (confirm) với data đã nhập, không phải S5. Hoặc: show "Thử lại với X đ" (pre-fill) nếu quay S5.

### 6. **Epic 5 — S16: Filter thiếu "Tất cả" option rõ ràng**
- **Vấn đề:** Filter by type: Nạp/Rút/Liên kết/Hủy. Khi user chọn filter → muốn xóa filter → cần có "Tất cả" chip rõ ràng hoặc clear button. Flow không ghi.
- **Đề xuất:** Thêm "Tất cả" là option đầu tiên (selected mặc định) trong filter chips. Hoặc: filter chip có X button để deselect.

### 7. **Terminology không consistent: "Tiếp tục" vs "Xác nhận"**
- **Vấn đề:** S2 dùng "Tiếp tục" (liên kết). S6 dùng "Xác nhận" (nạp). S10 dùng "Xác nhận" (rút). Hủy dùng "Hủy liên kết" (destructive). Tại sao liên kết dùng "Tiếp tục" mà không phải "Xác nhận"?
- **Đề xuất:** Thống nhất: form nhập → "Tiếp tục". Review/confirm → "Xác nhận". Destructive → "Hủy [action]". Hiện tại S2 "Tiếp tục" là hợp lý vì sau đó còn step xác thực BIDV. Nhưng cần ghi rõ rule này trong flow doc để team khỏi tự đặt CTA label.

### 8. **Progress indicator thiếu — user không biết mình ở step mấy**
- **Vấn đề:** Epic 1 có 4 bước (S1→S2→S3→S4). Epic 2 có 4-5 bước. User không biết còn bao nhiêu bước nữa. "Mày là user, mày đang ở S2, mày có biết sau khi bấm Tiếp tục thì còn phải làm gì nữa không?" — Không.
- **Đề xuất:** Thêm step indicator (1/3, 2/3, 3/3) cho Epic 1 flow. Epic 2/3 không cần vì flow ngắn hơn + quen thuộc (nạp/rút tiền user biết expect confirm → done). Nhưng Epic 1 (liên kết lần đầu) user chưa biết flow dài bao nhiêu → cần signal.

---

## ✅ Chấp nhận được

- **Reuse strategy:** 14/17 screens reuse existing = rất tốt. Giữ consistency, giảm effort.
- **Edge case coverage:** 42 edge cases là comprehensive. Phủ được network, deeplink, auth, app kill, double tap.
- **Entry points đa dạng:** 5 entry points cover đủ user journey (Home, Nạp/Rút, Tài khoản, Notification, Thanh toán). Không thiếu entry nào obvious.
- **Epic 3 ngắn hơn Epic 2 vì không cần BIDV auth:** Đúng. Rút tiền chỉ cần auth VSP → ít step hơn. Hợp lý.
- **Error states global table:** Structured rõ, cover đủ HTTP errors + auth + maintenance + rate limit.
- **Callback state machine clear:** 5 states (SUCCESS/FAILED/PENDING/TIMEOUT/CANCEL) phủ đủ. Server retry schedule (1p→3p→10p) hợp lý.
- **Deep link entry cho notification → S17:** Đúng pattern. Back → S16 (list) chứ không phải Home. Good.
- **Dialog variant B (NH cuối cùng):** Cảnh báo mạnh hơn khi hủy NH duy nhất. Chấp nhận được.

---

## Đức vs Nate (disagreement)

| Topic | Nate nói | Đức nói | PO cần chọn |
|-------|----------|----------|-------------|
| S6 confirm riêng biệt | Cần S6 confirm trước auth (tiêu chuẩn fintech) | Merge confirm vào auth screen để giảm 1 step. Momo/VNPay đã làm thế. | Giữ S6 riêng hay merge? |
| Checkbox TnC | Uncheck mặc định + button disabled | Thay bằng "Đồng ý & Tiếp tục" button mở TnC sheet trước | Checkbox hay TnC sheet? |
| "Thử lại" destination | Quay về S5/S9 (form nhập) | Quay về S6/S10 (confirm) pre-filled để retry nhanh | Retry về form hay confirm? |
| Cancel trên S3/S7/S13 | Không có cancel (chờ timeout) | Phải có cancel button — user cần quyền thoát | Cho cancel hay không? |

---

## Gaps chưa cover

1. **Accessibility:** Flow không mention VoiceOver / TalkBack order cho S2 (form phức tạp: readonly fields + input + checkbox). Cần ghi.
2. **Biometric enrollment prompt:** Nếu user chưa enroll biometric trên VSP → flow Epic 2/3 chỉ show PIN. Nhưng khi nào prompt user enroll biometric? Sau liên kết thành công là timing tốt.
3. **Rate limit trên client:** User spam "Thử lại" nhanh sau khi fail → cần cooldown (ít nhất 3 giây) trước khi cho retry.
4. **Landscape mode:** Flow assume portrait. Ghi rõ: portrait lock hay support landscape?
5. **Multi-account BIDV:** User có 2 TK BIDV → S2 chỉ nhập 1 STK. Liên kết lần 2 với STK khác có được không? S1 filter BIDV đi nếu đã liên kết → user không liên kết thêm TK BIDV thứ 2.

---

## Verdict: REWORK

**4 issues 🔴 phải sửa trước khi sang screen breakdown:**
1. Define rõ Store redirect → resume behavior (persist state)
2. Giảm confirmation steps ở Epic 2 (PO chốt merge hay giữ)
3. S11 rút tiền PENDING phải có thời gian hoàn cụ thể + hotline
4. S3/S7/S13 phải có nút Cancel

Sau khi Nate update flow.md theo PO decisions → Đức review lại lần 2.
