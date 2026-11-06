# Soft OTP — Information Design

> PRD: Xác thực giao dịch bằng Soft OTP — V-Pay (v1.0)
> Mục tiêu: Thay thế FIDO bằng Soft OTP cơ bản (giai đoạn 1) cho xác thực giao dịch loại A, B, C, đáp ứng TT50/2024/TT-NHNN.

---

## S0 · Trung tâm bảo mật

**Mental model:** "Tôi muốn bật/tắt xác thực giao dịch bằng Soft OTP ở đâu? Tôi đã bật chưa?"

**Hoàn cảnh:** Vào lần đầu sau khi nhận tin từ ngân hàng/CSKH yêu cầu bật Soft OTP. Hoặc vào để xử lý sau khi tài khoản bị tạm khoá xác thực.
**Cảm xúc:** Cảnh giác — đây là cài đặt bảo mật, người dùng cẩn thận hơn bình thường, không muốn bấm nhầm.
**Quyết định:** Có bật Soft OTP không? Tắt thì sẽ ra sao?
**Thành công khi:** Thấy rõ trạng thái hiện tại (bật/tắt) chỉ trong 1 cú liếc mắt.

| Zone | Nội dung | Lý do |
|------|----------|-------|
| Header & breadcrumb | "Trung tâm bảo mật" + back. Description một dòng: "Quản lý phương thức xác thực giao dịch của bạn" | Người dùng đến từ Settings → Security Center. Tiêu đề phải nói rõ đang ở đâu, vì đây là entry point quan trọng đến cài đặt nhạy cảm. |
| Section "Xác thực giao dịch" | Group title `pt-[24px] pb-[12px]` chữ nhỏ hoa, dưới là row "Xác thực bằng Soft OTP" + Toggle | Toggle là affordance quen thuộc (giống bật Face ID trên iOS). Đặt trong section có label rõ ràng giúp người dùng biết toggle này điều khiển cái gì. |
| Status indicator dưới toggle | Khi off: "Chưa kích hoạt" (gray). Khi on: "Đang sử dụng cho giao dịch" (green). Khi locked: "Tạm khoá — bật lại để tiếp tục" (red) | Toggle position alone không đủ context — phụ thêm 1 dòng text giúp xác nhận user đang nhìn đúng trạng thái, đặc biệt khi locked. |
| Info banner ở đáy | Tip màu vàng nhạt: "Soft OTP thay thế FIDO. Mã OTP được sinh ngay trong app, không cần chờ SMS khi xác thực giao dịch." | Lần đầu chuyển sang Soft OTP, người dùng cần biết tại sao — và lợi ích so với cách cũ. Tip thay vì popup vì không chặn flow. |

**Reference:** iOS Settings → Face ID & Passcode — toggle với status text inline, không có gì decorative.

---

## S1 · Xác thực bằng PIN đăng nhập

**Mental model:** "Tôi vừa quyết định bật/tắt/xác nhận một thứ quan trọng. App muốn chắc đây là tôi."

**Hoàn cảnh:** Bước trung gian giữa hành động bảo mật và kết quả. Đến từ: bật/tắt Soft OTP, mỗi lần xác thực giao dịch, hoặc đăng nhập thiết bị mới.
**Cảm xúc:** Cảnh giác nhưng không muốn chậm — đã cam kết hành động trước đó, giờ chỉ là rào cuối.
**Quyết định:** Dùng PIN hay sinh trắc học (nếu khả dụng)?
**Thành công khi:** Đúng PIN một lần, app tự submit khi đủ 6 số.

| Zone | Nội dung | Lý do |
|------|----------|-------|
| Context line dưới title | "Bật xác thực bằng Soft OTP" hoặc "Xác thực giao dịch 500.000 ₫" | Người dùng phải biết PIN đang xác nhận cho hành động nào. Nếu chỉ có "Nhập PIN" mà không context, có thể họ tap nhầm và xác nhận sai thứ. Đây là yêu cầu TT50 (informed consent). |
| 6 PIN dots | Hàng 6 ô tròn, fill dần khi nhập, đỏ khi sai | Pattern đã quen từ login. PIN dots cho feedback ngay, không lộ số. |
| Hint khi sai | "Mã PIN không đúng. Bạn còn {x} lần nhập trước khi tài khoản bị tạm khoá." | TT50 quy định cảnh báo số lần còn. Hint inline thay vì toast vì user cần đọc kỹ trước khi nhập lại. |
| Numpad tuỳ chỉnh | Grid 3×4 với số 0-9 + biometric + delete | System keyboard có autocomplete/cache — leak PIN. Numpad tuỳ chỉnh không lưu input. |
| Forgot PIN link | Text link dưới numpad, không prominent | Hầu hết user nhớ PIN. Đặt prominent gây phân tâm. Nhưng vẫn có lối thoát khi cần. |

**Reference:** Apple Pay PIN screen — context line trên dots, numpad-only.

---

## S2 · Nhập SMS OTP để kích hoạt

**Mental model:** "Tin nhắn vừa đến — nhập 6 số vào đây để xong bước kích hoạt."

**Hoàn cảnh:** Ngay sau khi nhập PIN thành công ở S1 (luồng kích hoạt Soft OTP). SMS vừa đến trong vài giây qua.
**Cảm xúc:** Mong xong nhanh — chỉ là 6 số nữa thôi. Bực nếu phải đợi SMS quá lâu.
**Quyết định:** Đã nhận SMS chưa? Gõ tay hay paste? Có cần yêu cầu gửi lại không?
**Thành công khi:** Nhập đúng 6 số, app tự verify và chuyển sang màn thành công.

| Zone | Nội dung | Lý do |
|------|----------|-------|
| Title + subtitle | "Nhập mã xác thực" + "Đã gửi đến **+84 ••• 234**" | Mask số điện thoại để confirm đúng số mà không leak. Người dùng biết SMS đến đâu để check. |
| 6-box PIN input | VSP_PinInput length=6, auto-focus ô đầu | iOS support OTP autofill từ SMS — input có inputMode numeric + autoComplete="one-time-code". Tự fill nếu user cho phép. |
| Countdown timer | "Mã hết hiệu lực sau {2:00}" — đổi sang đỏ khi <30s | TT50 quy định OTP có hạn 2 phút. Countdown giúp user biết khi nào phải yêu cầu lại. |
| "Gửi lại mã" link | Disable trong 30s đầu (tránh spam), enable sau | Avoid SMS abuse — tốn tiền của bank. Theo Admin Portal hạn mức yêu cầu lại. |
| Error message | "Mã OTP không đúng hoặc đã hết hạn. Bạn còn {x} lần nhập trước khi tài khoản bị tạm khoá." | Yêu cầu của PRD AC-04 corner case. Cảnh báo số lần còn vì lock sẽ làm phiền user nhiều. |

**Reference:** Apple two-factor auth — masked phone, auto-fill từ SMS, countdown.

---

## S3 · Hiển thị mã Soft OTP

**Mental model:** "Đây là mã của giao dịch này. Tôi đọc nhanh và bấm xác nhận trong vài giây."

**Hoàn cảnh:** Đang xác thực giao dịch (chuyển tiền/thanh toán) loại A/B/C/D. Đã qua PIN, giờ thấy mã 6 số sinh sẵn trong app, không cần đợi SMS.
**Cảm xúc:** Cảnh giác — đang chuyển tiền. Nhưng cũng có chút yên tâm vì OTP đã được sinh sẵn (không phải đợi SMS).
**Quyết định:** Mã có khớp với thông tin giao dịch trên hiển thị không? Bấm xác nhận hay huỷ?
**Thành công khi:** Đọc mã + bấm "Xác nhận" trong vòng thời gian hiệu lực (~30s).

| Zone | Nội dung | Lý do |
|------|----------|-------|
| Banner thông tin giao dịch | Card pastel: số tiền lớn + nguồn (ví → ngân hàng nào) + người nhận | Người dùng phải verify TRƯỚC khi đọc OTP. Đặt lớn nhất vì đây là thông tin quyết định "có xác nhận không". Phòng phishing/MITM — OTP đúng nhưng giao dịch sai. |
| Mã OTP 6 chữ số | Hiển thị `1 2 3 4 5 6` ở center, font lớn (40-48px), letter-spacing rộng | Đây là focal point — user phải đọc và đối chiếu. Letter-spacing rộng giúp tách rõ từng chữ số, tránh đọc nhầm. KHÔNG cho copy/edit — tránh bị social engineering "đọc OTP cho tôi". |
| Countdown ring/timer | "Mã hết hạn sau {0:30}" + circular progress bao quanh mã | OTP có hạn 40s (PRD). 10s cuối đổi sang đỏ + pulse. Tự tạo OTP mới khi hết hạn (PRD AC-03). Visual countdown giúp user biết áp lực thời gian. |
| Cảnh báo bảo mật | Inline tip nhỏ: "Không chia sẻ mã OTP với bất kỳ ai, kể cả nhân viên ngân hàng." | TT50 + best practice. Đặt dưới mã, nhỏ, nhắc nhở. |
| CTA "Xác nhận" | Button primary full-width, "Xác nhận giao dịch" | 1 CTA duy nhất — user đã đọc OTP rồi, chỉ cần một bước. Cancel = back button (không primary). |

**Reference:** Google Authenticator / Authy — OTP lớn ở center, countdown ring. Khác: thêm context giao dịch ở trên (transaction-binding cho phase 2).

---

## S4 · Xác thực khuôn mặt (FaceAuthen)

**Mental model:** "Giao dịch lớn — thêm một lớp an toàn nữa, quét mặt thôi."

**Hoàn cảnh:** Sau khi xác nhận Soft OTP thành công (S3) đối với giao dịch loại C/D. Hoặc khi unlock xác thực giao dịch sau khi bị locked.
**Cảm xúc:** Đã quen với Face ID/Touch ID — không có gì lạ, chỉ cần giữ điện thoại đúng tầm.
**Quyết định:** Không có decision — chỉ là quét mặt.
**Thành công khi:** Camera nhận diện được mặt và verify thành công trong 1-3 giây.

| Zone | Nội dung | Lý do |
|------|----------|-------|
| Title + context | "Xác thực khuôn mặt" + "Giao dịch giá trị lớn cần xác thực thêm" | Giải thích tại sao đột nhiên cần Face — user không cần quét Face cho giao dịch nhỏ trước đó, có thể bối rối. |
| Camera viewport tròn | Vòng tròn 240×240px ở center với preview camera (mock = gradient + icon ScanFace) | Vòng tròn tự nhiên cho khuôn mặt — pattern eKYC quen. Center vì đây là điểm focus duy nhất. |
| Status text dưới viewport | "Đưa mặt vào khung" / "Đang xác thực..." / "Xác thực thành công" / "Không nhận diện được" | Feedback realtime — camera là blackbox, user cần biết app đang làm gì. |
| Fallback link | "Dùng cách khác" → mở support hoặc fallback | TT50 yêu cầu fallback khi Face fail. Không prominent nhưng vẫn có. |
| Cảnh báo số lần thử | "Bạn còn {x} lần thử trước khi bị tạm khoá" — hiện khi đã sai 1-2 lần | Theo AC-02 US-05 — số lần config trên Admin Portal. |

**Reference:** eKYC iOS (Vietcombank, MB) — camera tròn ở center, status text rõ ràng.

---

## S5 · Kết quả

**Mental model:** "Xong rồi — có thành công không? Cần làm gì tiếp?"

**Hoàn cảnh:** Đến từ flow kích hoạt, hủy kích hoạt, hoặc xác thực giao dịch. Là màn cuối cùng của mỗi journey.
**Cảm xúc:** Nhẹ nhõm khi success. Bối rối/khó chịu khi fail — cần lý do và lối thoát.
**Quyết định:** Đóng và quay lại, hay thử lại nếu fail?
**Thành công khi:** Hiểu kết quả + biết action tiếp theo trong < 2 giây.

| Zone | Nội dung | Lý do |
|------|----------|-------|
| Icon trạng thái 64px | Success = check xanh trong vòng tròn. Fail = X đỏ. Locked = Lock đỏ. Pending = Clock vàng. | Visual confirm — user đọc icon trước title. Màu = trạng thái. |
| Title | Success: "Kích hoạt thành công" / "Giao dịch thành công" / "Đã tắt xác thực". Fail: "Giao dịch thất bại" / "Mã OTP không hợp lệ". Locked: "Tạm khoá xác thực giao dịch". | Trạng thái rõ ràng, không vague. Verb + tính từ. |
| Description | Success: chi tiết giao dịch (số tiền, người nhận, mã GD). Fail: lý do + cách xử lý. Locked: "Vì lý do bảo mật, tính năng xác thực giao dịch bị tạm khoá. Vui lòng bật lại để tiếp tục." | Detail vừa đủ — user có thể chụp màn cho support. Lý do giúp user không bối rối. |
| CTA primary | Success: "Hoàn tất" / "Về trang chủ". Fail: "Thử lại". Locked: "Bật lại xác thực" (deeplink về S0). | 1 CTA chính theo trạng thái. Tránh đường cụt — luôn có lối ra. |
| CTA secondary (optional) | Success: "Xem biên lai" (nếu là giao dịch). Fail: "Quay lại" / "Liên hệ hỗ trợ". | Cho user lựa chọn thoát khác — đặc biệt khi fail nhiều lần. |

**Reference:** Stripe / Wise transaction result — icon + title + 2-3 dòng detail + 1 CTA chính.

---

## Dialog · Bật xác thực giao dịch (US-03 AC-01)

**Mental model:** "Tôi muốn xác thực giao dịch, nhưng app bảo phải bật cái gì đó trước."

**Hoàn cảnh:** User đang trong flow giao dịch (chuyển tiền/thanh toán). Đến bước xác thực thì app phát hiện Soft OTP chưa bật → chặn lại.
**Cảm xúc:** Bị ngắt — đang muốn xong giao dịch, giờ phải làm thêm bước. Cần CTA rõ ràng để không bỏ cuộc.
**Quyết định:** Bật ngay hay để sau? Có hủy giao dịch luôn không?

| Zone | Nội dung | Lý do |
|------|----------|-------|
| Title | "Bật xác thực giao dịch" | Hành động rõ ràng, không vague. |
| Message | "Bạn cần bật phương thức xác thực giao dịch để tiếp tục" | Giải thích tại sao bị chặn. Không đe doạ. |
| Secondary CTA | "Để sau" — đóng dialog, không huỷ giao dịch | Cho user quyền quyết định không bật ngay. Nhưng phải hiểu là giao dịch không thực hiện. |
| Primary CTA | "Bật ngay" — deeplink vào flow kích hoạt (S1 → S2 → S5), sau success quay lại bước xác thực | Lối tắt — không bắt user tự tìm đường vào Security Center. PRD: "Sau khi kích hoạt thành công, điều hướng Người dùng quay lại màn hình xác thực giao dịch để tiếp tục". |

**Reference:** iOS prompt "Cho phép truy cập danh bạ" — pattern blocking với CTA bật/để sau.
