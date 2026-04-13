# Phase 3 Analysis — Tab Ưu đãi (Q4)
🔍 Nate — UX Researcher

## 1. Tab Ưu đãi Content & Ordering
- **Hero:** V-Point balance card (điểm hiện có + "Đổi quà") — lý do: V-Point là anchor của tab, user mở tab = check điểm.
- **Dưới hero:** Hot deal (1 featured, banner lớn) → Category pills → Deal list (scroll vertical)
- **Bottom:** Referral card ("Giới thiệu bạn, nhận 50K")
- **Ordering logic:** V-Point (sở hữu) → Featured deal (urgency) → Category browse (discovery) → Referral (acquisition)

## 2. V-Point UX
- **Tích điểm:** Tự động khi thanh toán qua VSP. Home: toast notification "Bạn nhận 25 V-Point ✓"
- **Xem điểm:** Tab Ưu đãi hero card (primary) + Home widget optional (nếu user pin)
- **Dùng điểm khi checkout:** Ở bước confirm thanh toán → toggle "Dùng V-Point" → hiện bao nhiêu điểm khả dụng, quy đổi bao nhiêu tiền, số tiền còn phải trả
- **Flow:** Tab Ưu đãi → "Đổi quà" → Danh sách quà/voucher đổi bằng V-Point → Chọn → Confirm → Done
- **Edge case:** Điểm = 0 (user mới) → CTA "Thanh toán để tích điểm" thay vì empty state

## 3. Avatar Pattern — Tài khoản
- **Cash App:** Avatar góc phải Home, tap → Profile/Settings/Support. User US quen vì iOS/Android system settings cũng dùng avatar.
- **Risk cho user VN:**
  - User quen tab "Tài khoản" ở bottom → sẽ tìm ở bottom trước
  - "Liên kết NH" → hiện cần: tap avatar (1) → tap "Liên kết NH" (2) = 2 taps. Trước: tap tab TK (1) → tap "Liên kết NH" (2) = 2 taps. **Bằng nhau.**
  - "Đổi mật khẩu/PIN" → tap avatar (1) → Bảo mật (2) → Đổi PIN (3) = 3 taps. Trước: tap tab TK (1) → Bảo mật (2) → Đổi PIN (3) = 3 taps. **Bằng nhau.**
  - **Kết luận:** Tap count không tăng. Risk chính = discoverability, không phải accessibility.
- **Mitigation:** Avatar có badge notification khi cần action (liên kết NH mới, bảo mật update). First-time: tooltip "Tài khoản đã chuyển lên đây ↗"

## 4. Edge Cases
- **User 0 V-Point:** Hero card vẫn hiện, CTA "Thanh toán để tích điểm đầu tiên" thay số 0 buồn
- **Không có deals:** Hiện "Chưa có ưu đãi phù hợp. Quay lại sau!" + recent transactions có thể earn V-Point. KHÔNG để tab trống.
- **Referral hết hạn:** Ẩn card referral, không show expired state
- **Voucher expired:** Di chuyển xuống section "Đã hết hạn" (collapsed by default), không xoá — user muốn xem lại
- **Deal đã dùng:** Label "Đã sử dụng" + mờ đi. Giữ 7 ngày rồi ẩn.

## 5. Deals Curation
- **Phase 1 (Q4 launch):** Manual curation — business team chọn deals. Đủ cho <50 deals.
- **Phase 2 (2027):** Personalized — dựa trên:
  - HST usage: user đi XanhSM thường → push XanhSM deals lên top
  - Transaction history: user hay mua café → Highland/Starbucks deals
  - Location: user ở Vinhomes → Vinhomes services deals
- **Vingroup internal deals** hiện riêng section "Đặc quyền Vingroup" — differentiator vs MoMo/ZaloPay
- **External partner deals** hiện chung "Ưu đãi cho bạn"

## 6. Engagement Loop
```
User mở Ưu đãi → thấy V-Point → "gần đủ 1000đ rồi, cố thêm"
→ dùng VSP thanh toán nhiều hơn → earn V-Point → quay lại check
→ thấy deal mới → dùng deal → earn thêm V-Point → loop
```
- **Loop hoạt động** nếu: V-Point earn rate đủ nhanh (user thấy progress) + deals đủ hấp dẫn (discount thật, không 1-2%)
- **Risk:** V-Point earn quá chậm → user quên → tab trở thành dead tab. Cần calibrate: ~100 V-Point/giao dịch trung bình, 1000 V-Point = 10.000đ.
- **Gamification nhẹ:** "Còn 3 giao dịch nữa để lên hạng Bạc" — tier system (Đồng/Bạc/Vàng/Kim cương)

## 7. Ưu đãi vs Thanh toán Overlap
- **Recommend: BottomSheet deal detail → deep link checkout**
- User tap deal → BottomSheet hiện: điều kiện, HSD, nút "Dùng ngay"
- Tap "Dùng ngay" → deep link sang tab Thanh toán (hoặc checkout flow tương ứng) với deal pre-applied
- Tap back / swipe down → quay lại tab Ưu đãi (không mất context)
- **Tại sao không chỉ "Lưu ưu đãi":** User muốn action ngay khi thấy deal hấp dẫn. "Lưu" = friction thêm, conversion thấp hơn "Dùng ngay".

## 8. Mental Model: "Ưu đãi" trong VN
- MoMo tab "Ưu đãi" = deals + cashback + games. User VN quen.
- ZaloPay tab "Ưu đãi" = voucher + partner deals. User VN quen.
- **VSP "Ưu đãi" = expectation match.** User sẽ expect: deals, giảm giá, điểm thưởng, voucher. Đúng.
- **Khác biệt VSP:** Vingroup exclusive deals — content mà MoMo/ZaloPay không có. Phải nổi bật section này.

## 9. Categories
- **Đề xuất:** Tất cả / Vingroup / Ăn uống / Di chuyển / Mua sắm / Du lịch
- **"Vingroup" category riêng** — USP. User HST sẽ filter ngay.
- **Không cần "Giải trí"** ở Q4 — chưa có partner. Thêm khi có content.
- Category pills = horizontal scroll. Active = filled, inactive = outline.

## 10. Revenue per Feature
- **V-Point breakage:** 15-20% points never redeemed = pure revenue
- **Partner commission:** 3-8% per deal redemption
- **Referral:** Cost 50K/user acquired. Positive ROI nếu retention >30 ngày
- **QUAN TRỌNG: Tab Ưu đãi = cost center, KHÔNG self-sustaining ở 100K MAU.** Giá trị thực = retention + HST lock-in + behavioral data. Đừng đo tab này bằng direct revenue — đo bằng MAU retention lift và HST transaction volume.

## 11. Thêm findings từ deep analysis
- **3 break points của engagement loop:** (1) context switch giữa tab Ưu đãi → tab TT quá xa, (2) V-Point rate quá thấp → user quên, (3) deals lặp lại → boring
- **7 edge cases chưa trong BRD:** dispute deal, quota race (nhiều user redeem cùng lúc), deal stacking (dùng 2 deal cùng lúc?), fraud detection, V-Point expiry, merchant cancel deal, geo-restriction
- **Avatar risk chi tiết:** "Liên kết NH" có thể tăng 1 tap nếu avatar menu có nhiều items. Cần: avatar menu flat (không nested), max 7 items
- **HST badge thay vì category riêng:** Deal HST có badge "Vingroup" trên card + filter pill "Vingroup". Không tách category riêng — giữ deal list unified
- **Deals curation 3 tầng:** Q4 Manual → 2027 Q1 Rule-based (if XanhSM user → boost XanhSM deals) → 2027 Q3 ML personalized

---
Back: [[features/index|Features]] · [[features/app-architecture-2026/status|app-architecture-2026]]
