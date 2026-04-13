# BRD Analysis — Sinh lời tự động v2
> Analyst: Nate | Date: 2026-03-09

## Lưu ý quan trọng về BRD
File BRD được cung cấp chứa **2 tài liệu ghép lại**:
- **Phần 1 (chính):** BRD + PRD "Sinh lời tự động" v2.0 — Epic 1→4, NFRs, Notifications, Error codes
- **Phần 2 (không liên quan):** PRD "Bảo hiểm TNDS xe cơ giới" — từ section "Executive Summary" thứ 2 trở đi (có nhắc đến xe máy, ô tô, giấy chứng nhận bảo hiểm)

Phân tích dưới đây **chỉ focus vào phần Sinh lời tự động**.

---

## Tóm tắt feature
Sinh lời tự động cho phép người dùng VSP kích hoạt tính năng để tiền nhàn rỗi trong ví tự động sinh lời thông qua đối tác tài chính (ngân hàng/quỹ). Người dùng có thể nạp tiền vào ví sinh lời, theo dõi lãi suất realtime, và rút tiền tức thì về ví chính. Feature bao gồm 4 epic: Đăng ký, Quản lý, Nạp/Rút, và Hủy đăng ký.

---

## Đã hiểu từ BRD

### Business & Product
- Target activation rate: 15-25%, AUM retention >= 70% sau 30 ngày
- Hạn mức ví sinh lời tối đa: 100 triệu VND (cấu hình được)
- Hạn mức giao dịch ví: 100 triệu/tháng (theo Thông tư 40/2024/TT-NHNN)
- Lãi suất cấu hình được, hiển thị %/năm
- Lợi nhuận tạm tính theo ngày, trả theo tháng
- Golive dự kiến: 16/04/2026

### Flow chính
- **Đăng ký:** Home/Landing → Product page (demo lãi) → Xác nhận thông tin (checkbox T&C) → OTP → Kết quả
- **Dashboard (tab Sản phẩm):** Số dư hiện tại + toggle ẩn/hiện + Lãi hôm qua + Tổng lãi + Lãi suất
- **Dashboard (tab Quản lý):** Lịch sử GD + Tổng kết lợi nhuận + Điều khoản & Hợp đồng + Cài đặt
- **Nạp tiền:** Chọn nạp → Nhập số tiền → Xác nhận → Auth (PIN/Biometric) → Kết quả (Success/Processing/Failed)
- **Rút tiền:** Chọn rút → Nhập số tiền → Xác nhận → Auth → Kết quả
- **Hủy:** Điều khoản & Hợp đồng → Hủy → Xác nhận → OTP → Kết quả (chuyển inactive, không xóa data)

### UX Details đã rõ
- Product page có progress bar demo lãi (0-100tr, bước nhảy 5tr)
- Nạp tiền hiển thị "tiền lãi năm dự kiến nhận thêm"
- Rút tiền hiển thị "tiền lãi năm dự kiến mất đi"
- Lịch sử GD: filter theo loại (Tất cả/Nạp/Rút/Trả lãi) + calendar (7 ngày default, max 90 ngày)
- Tổng kết lợi nhuận: theo năm, dropdown từng tháng, max 5 năm
- Cài đặt: nạp tiền số dư sinh lời + số dư tối thiểu (AC 2.6.1 + 2.6.2)
- Error codes: 20000-20003 cho sinh lời, HTTP mapping rõ ràng
- Notifications: 3 loại push (nạp thành công, rút thành công, trả lãi)
- Xác thực GD: tham chiếu luồng auth chung của VSP

### Tương đồng với VSP flows hiện tại
- Flow nạp/rút sinh lời tương tự flow Nạp/Rút tiền ví (Home → Số tiền → Confirm → Auth → Result)
- Luồng OTP dùng chung luồng OTP của app
- Luồng auth giao dịch dùng chung (PIN/Biometric theo thiết bị)
- Result screen có 3 trạng thái giống shared pattern: Thành công / Đang xử lý / Thất bại

---

## Cần PO confirm

### MUST ANSWER (block flow)

1. **Điều kiện tiên quyết để bật sinh lời?**
   - Lý do hỏi: BRD nhắc "user đã eKYC" trong assumptions nhưng không specify rõ trong flow. Nếu user chưa eKYC vào product page thì hiện gì? Block hay vẫn cho xem demo?
   - Option A: Block ngay khi vào — hiện dialog "Vui lòng hoàn tất eKYC" → điều hướng eKYC
   - Option B: Cho xem product page + demo lãi, block khi nhấn "Kích hoạt" → dialog eKYC

2. **Hủy đăng ký khi còn số dư sinh lời > 0?**
   - Lý do hỏi: AC 4.1.1 chỉ nói "hiển thị số tiền trong text lấy theo số dư hiện tại" nhưng không nói rõ: số dư có tự động rút về ví không? Hay phải rút hết trước khi hủy?
   - Option A: Bắt buộc rút hết trước khi hủy → block button "Vẫn muốn hủy" nếu balance > 0
   - Option B: Tự động rút về ví khi hủy → hiển thị "Số dư X VND sẽ được chuyển về ví chính"
   - Option C: Cho hủy, số dư sẽ được chuyển về ví trong T+1 (async)

3. **Chuyển tiền và Thanh toán từ ví sinh lời — scope thực sự là gì?**
   - Lý do hỏi: Epic 3 liệt kê US 3.3 (Chuyển tiền) và US 3.4 (Thanh toán) với đầy đủ AC. Nhưng phần "Out of Scope" lại ghi rõ "Chuyển tiền, thanh toán (giai đoạn 1 chỉ dừng ở nạp/rút ví sinh lời)". Hai thông tin mâu thuẫn nhau.
   - Option A: US 3.3 + US 3.4 nằm trong MVP → build flow chuyển tiền + thanh toán từ ví sinh lời
   - Option B: US 3.3 + US 3.4 là post-MVP → chỉ build nạp/rút, bỏ qua chuyển tiền + thanh toán

4. **"Hợp đồng cho vay" — bản chất sản phẩm là cho vay?**
   - Lý do hỏi: Checkbox 2 trong AC 1.3.1 ghi "đồng ý với hợp đồng cho vay với công ty ABC". Điều này có nghĩa sản phẩm thực chất là cho vay (user cho đối tác vay tiền, nhận lãi), không phải đầu tư quỹ. Điều này ảnh hưởng cực lớn đến wording, disclaimer, và flow pháp lý.
   - Option A: Đúng là mô hình cho vay → cần disclaimer "đây không phải tiền gửi ngân hàng, lãi suất không được đảm bảo"
   - Option B: BRD dùng từ "cho vay" nhưng thực chất là khác → cần PO clarify tên chính xác

5. **Cài đặt "Nạp tiền số dư sinh lời" (AC 2.6.1) — cụ thể là gì?**
   - Lý do hỏi: AC 2.6.1 chỉ có title, không có Given/When/Then, không mô tả UI. Đây có phải auto-sweep (tự động chuyển tiền từ ví chính sang ví sinh lời khi vượt ngưỡng)? Hay chỉ là shortcut nạp tiền?
   - Option A: Auto-sweep — user set threshold, tiền vượt threshold tự động chuyển sang ví sinh lời
   - Option B: Recurring deposit — user set số tiền + chu kỳ nạp tự động
   - Option C: Chỉ là cài đặt hiển thị/shortcut, chưa có logic tự động

6. **Cài đặt "Số dư tối thiểu" (AC 2.6.2) — tối thiểu ở đâu?**
   - Lý do hỏi: Không rõ "số dư tối thiểu" là của ví sinh lời (luôn giữ lại ít nhất X trong ví sinh lời) hay của ví chính (luôn giữ lại X trong ví chính, phần còn lại sweep sang sinh lời). Hai cách hiểu dẫn đến UX hoàn toàn khác.
   - Option A: Min balance ví sinh lời — khi rút, không cho rút dưới mức này
   - Option B: Min balance ví chính — auto-sweep chỉ sweep phần vượt threshold này

### SHOULD ANSWER (block UI)

1. **Entry point trên Home — icon/banner hay cả hai?**
   - Lý do: AC 1.1.1 nói "mục sinh lời trong danh mục dịch vụ" nhưng AC 1.1.2 nói "Landing Page trên Trang chủ". Cần biết có bao nhiêu entry point.
   - Default nếu không trả lời: 2 entry points — 1 icon trong danh mục dịch vụ + 1 banner/landing page trên Home

2. **Tab "Sản phẩm" vs "Quản lý" — tab bar nằm ở đâu?**
   - Lý do: BRD nhắc đến 2 tab nhưng không mô tả vị trí tab bar (top hay bottom), không có wireframe.
   - Default nếu không trả lời: Tab bar phía trên, dưới header, theo pattern chuẩn VSP

3. **Ẩn/hiện số dư sinh lời — đồng bộ với toggle ẩn/hiện số dư ví chính không?**
   - Lý do: VSP hiện có toggle ẩn/hiện số dư ở Home. Ví sinh lời cũng có action icon ẩn/hiện. Cần biết 2 toggle này có liên kết không.
   - Default nếu không trả lời: Độc lập — toggle ở ví sinh lời chỉ ảnh hưởng ví sinh lời

4. **USP 1/2/3 trên product page — content là gì?**
   - Lý do: BRD ghi "Cập nhật sau" cho cả 3 USP. Cần content để design.
   - Default nếu không trả lời: Dùng placeholder cho 3 USP, ưu tiên ship rồi update content sau

5. **Rút tiền — có "Rút tất cả" button không?**
   - Lý do: Nhiều app fintech có quick action "Rút tất cả". BRD không nhắc đến.
   - Default nếu không trả lời: Có button "Rút tất cả" prefill max amount vào input

6. **AC 2.2.1, 2.2.2, 2.2.3 đều ghi "cập nhật sau" — ship without hay block?**
   - Lý do: 3 AC về giới thiệu cơ chế sinh lời + tổng lợi nhuận tạm tính + thời điểm trả lợi nhuận đều chưa có detail. Đây là thông tin quan trọng cho user trust.
   - Default nếu không trả lời: Ship MVP với placeholder bottom sheet, nội dung do PO cung cấp trước golive

7. **Quick amount chips cho nạp/rút?**
   - Lý do: Flow nạp/rút ví VSP hiện tại có quick amount chips (100k, 200k, 500k...). BRD sinh lời không nhắc đến. Nên có để giảm friction.
   - Default nếu không trả lời: Thêm quick chips (1tr, 5tr, 10tr, 50tr) theo pattern VSP

8. **Lịch sử GD — chỉ lấy trạng thái thành công?**
   - Lý do: AC 2.4.1 ghi "chỉ lấy giao dịch có trạng thái thành công". Điều này có nghĩa user không thấy GD thất bại/đang xử lý trong lịch sử. Có thể gây confusion ("tôi vừa nạp sao không thấy?").
   - Default nếu không trả lời: Hiển thị tất cả trạng thái (thành công, đang xử lý, thất bại) với badge status rõ ràng

9. **Notification trả lãi — trả lãi vào ví sinh lời hay ví chính?**
   - Lý do: Notification body ghi "nhận lãi về ví sinh lời". Cần confirm lãi được cộng vào số dư sinh lời (compound) chứ không phải ví chính.
   - Default nếu không trả lời: Lãi cộng vào ví sinh lời (compound interest)

10. **Trạng thái "Chờ xử lý" — timeout bao lâu thì chuyển thành thất bại?**
    - Lý do: BRD có màn "Chờ xử lý" nhưng không specify timeout. User nhìn thấy "đang xử lý" mà không biết phải chờ bao lâu.
    - Default nếu không trả lời: Hiển thị "Vui lòng kiểm tra lại sau 5 phút" + auto-refresh khi quay lại

### AI ASSUMPTIONS (sẽ dùng nếu PO skip)

1. **Khi user quay lại app sau khi kill mid-flow (đang nạp/rút), app sẽ hiển thị dashboard sinh lời, không resume flow.** — Lý do: BRD không mention resume logic. An toàn nhất là quay về dashboard và để user kiểm tra lịch sử GD.

2. **Double-tap prevention trên tất cả action buttons (Xác nhận, Xác thực, Nạp, Rút).** — Lý do: Edge case library yêu cầu. BRD không nhắc nhưng đây là fintech — duplicate transaction là critical bug.

3. **Khi mất mạng giữa flow, hiển thị error code 20003 + "Thử lại" button. Không auto-retry.** — Lý do: BRD có error code 20003 cho no internet. Auto-retry trên fintech transaction có thể gây duplicate.

4. **Balance hiển thị trên màn nạp/rút là realtime (fetch khi vào màn). Nếu balance thay đổi giữa chừng (từ session khác), validate lại khi nhấn "Tiếp tục".** — Lý do: Edge case "Price/fee changed" + "Data stale" trong library. Fintech phải validate server-side trước khi execute.

5. **Progress bar demo lãi trên product page là client-side calculation, không gọi API.** — Lý do: BRD ghi "không có loading section" khi kéo. Lãi suất đã có sẵn trên page.

6. **Trang chủ sinh lời có pull-to-refresh.** — Lý do: Dashboard pattern trong edge case library yêu cầu pull-to-refresh. Số dư + lãi cần refresh.

7. **Kết quả GD thất bại nạp tiền — "Thử lại" quay về màn Xác nhận (AC 3.1.2), không phải nhập lại số tiền.** — Lý do: BRD ghi "Quay về màn Xác thực giao dịch". Giữ nguyên data đã nhập để giảm friction.

8. **Calendar picker trong lịch sử GD không cho chọn ngày tương lai hoặc ngày hôm nay (T-1 rule).** — Lý do: BRD ghi rõ "tính từ ngày T-1 trở về trước".

9. **Khi hủy đăng ký thất bại (OTP sai / API error), quay về màn xác nhận hủy, không auto-retry.** — Lý do: Hủy đăng ký là destructive action. Cần user intent rõ ràng.

10. **Service title trong màn xác nhận rút tiền hiển thị "Rút tiền sinh lời" (không phải "Nạp tiền sinh lời" như BRD ghi — đây là lỗi copy-paste trong BRD dòng 1974).** — Lý do: Context là rút tiền, tiếng Anh đúng "Withdraw from earning wallet", tiếng Việt bị paste nhầm.

---

## Edge Cases chưa được BRD cover (cần bổ sung)

### Financial Edge Cases
| # | Edge Case | Severity | BRD Coverage |
|---|-----------|----------|--------------|
| 1 | User nạp tiền đúng lúc đang xử lý trả lãi tháng | High | Không có |
| 2 | Rút tiền khi đối tác tài chính maintenance/downtime | High | Chỉ có generic error |
| 3 | Số dư ví chính thay đổi sau khi user đã vào màn nạp (session khác nạp/rút) | High | Không có |
| 4 | Lãi suất thay đổi giữa lúc user đang xem product page và lúc kích hoạt | Medium | Không có |
| 5 | User nạp số tiền khiến tổng vượt 100tr (race condition: 2 device cùng lúc) | High | Client check có, server check không rõ |
| 6 | Hạn mức 100tr/tháng bị vượt do cộng dồn nhiều GD nhỏ trong ngày | Medium | Có nhắc nhưng không rõ UX khi bị block |

### UX Edge Cases
| # | Edge Case | Severity | BRD Coverage |
|---|-----------|----------|--------------|
| 7 | User vừa hủy xong, nhấn back → thấy dashboard sinh lời empty? hay redirect? | Medium | Không có |
| 8 | Deeplink vào sinh lời khi user chưa login | Medium | Không có |
| 9 | Deeplink vào sinh lời khi user chưa kích hoạt | Low | AC 1.1.2 cover partially |
| 10 | Landscape mode trên tablet | Low | Không có |
| 11 | VoiceOver/TalkBack cho progress bar demo lãi | Low | Không có |
| 12 | User ở tab Quản lý, nhận push noti trả lãi → UI có auto-refresh? | Medium | Không có |

---

## Lỗi/Mâu thuẫn phát hiện trong BRD

1. **Mâu thuẫn scope Epic 3:** US 3.3 (Chuyển tiền) + US 3.4 (Thanh toán) có AC đầy đủ nhưng Out of Scope ghi "giai đoạn 1 chỉ dừng ở nạp/rút" → **MUST resolve**.

2. **Copy-paste lỗi AC 3.2.2:** Service Title trong màn xác nhận rút tiền ghi "Nạp tiền sinh lời" thay vì "Rút tiền sinh lời" (dòng 1974).

3. **AC 4.1 (Hủy đăng ký) — "I want" sai context:** Ghi "xem lại danh sách tất cả các hợp đồng bảo hiểm đã mua" — đây là copy-paste từ PRD bảo hiểm, không liên quan đến sinh lời.

4. **AC 2.6.1 + 2.6.2 (Cài đặt):** Chỉ có title, không có Given/When/Then, không có mô tả component → **block UI design**.

5. **AC 2.2.1, 2.2.2, 2.2.3:** Đều ghi "cập nhật sau" — thiếu content cho 3 bottom sheets quan trọng về trust.

6. **PRD section trong cùng file:** Từ dòng ~2450 trở đi là PRD bảo hiểm TNDS, ghép nhầm vào file sinh lời. Gây confusion.

---
Back: [[features/index|Features]] · [[features/sinhloi-v2/status|sinhloi-v2]]
