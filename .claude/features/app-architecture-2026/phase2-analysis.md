# Phase 2 Analysis — Tab Tài chính (Q3)
🔍 Nate — UX Researcher

## 1. Tab Tài chính = Financial Hub
- **Hero card:** Tổng tài sản = chỉ assets thật (Ví + SL + BĐS + CCQ). BH hiện riêng "Đang bảo vệ: X sản phẩm" — BH không phải tài sản. BNPL hiện riêng "Dư nợ: X" — BNPL là liability, không cộng vào tổng.
- **User mở tab → thấy:** Tổng tài sản (hero) → Product cards (scroll vertical) → Hoạt động gần đây
- **Không chart ở hero.** Chart = full screen khi tap tổng tài sản. Hero phải glanceable trong 2 giây.

## 2. Product Ordering
- **Dynamic by AUM:** Product nào user có nhiều tiền nhất → hiện đầu tiên
- **Default cho user mới:** Sinh lời (dễ nhất) → BH (cần thiết) → BĐS (hấp dẫn) → CCQ → BNPL → Vay VinFast
- **Không cần sub-nav.** 6 product cards scroll vertical đủ. Sub-nav tạo thêm 1 layer navigation = chậm hơn.
- **Group bằng section title nhẹ:** "Tích luỹ" (SL, CCQ) / "Đầu tư" (BĐS) / "Bảo vệ" (BH) / "Tín dụng" (BNPL, Vay)

## 3. GD Merge vào Home
- **Wallet Card:** Thêm affordance rõ "Tap xem lịch sử" hoặc chevron/arrow indicator
- **Tap → Fullscreen GD:** Search bar + Filter pills (Tất cả / Chuyển / Nhận / TT HĐ / Sinh lời / BH / Nạp-Rút) + Grouped by date
- **Risk:** User quen scroll GD trong tab riêng. Nay phải tap wallet → extra step? **Không** — wallet area trên Home có "GD gần đây" 3 items luôn visible. Tap "Xem tất cả" = same tap count cũ.

## 4. Edge Cases
- **User 0 products:** Tab TC = discovery mode. Hiện "Khám phá sản phẩm" cards (SL, BH, BĐS) — không empty state. Mỗi card = CTA kích hoạt.
- **User 1 product:** Hero = số liệu product đó. Bên dưới = discovery cards cho products chưa dùng.
- **User 5+ products:** Compact cards, scroll vertical. Hero = tổng tài sản aggregate.
- **BH hết hạn:** Warning card màu amber, CTA "Gia hạn ngay"
- **BNPL quá hạn:** Danger card, badge đỏ trên tab icon, CTA "Thanh toán ngay"
- **BĐS chưa có giá (settlement pending):** Hiện "Đang xử lý", không hiện giá trị = 0
- **CCQ NAV T-1:** Note "Giá trị cập nhật T-1" dưới số liệu
- **SL pending rút:** Hiện "Đang rút X đ" với spinner

## 5. Behavioral Graduation
- **Recommend: Big bang** — tất cả user đổi cùng lúc, không chia 2 UI
- **Lý do:** 2 UIs song song = QA nightmare (test 2x), user nói chuyện nhau confuse ("mày tab Tài chính ở đâu?" — "tao đâu có"), support phải handle 2 versions
- **Mitigation thay graduation:** Feature flag per segment (Vingroup employees → Vinhomes → general). Nhưng mỗi segment = tất cả user trong segment đổi cùng lúc.
- **Timeline:** Vingroup employees 2 tuần → Vinhomes 2 tuần → general. Tổng 4-6 tuần rollout.

## 6. Widget → Tab Handoff
- Home widget "SL: 5M +45K" → tap → **Product detail page** (push navigation từ Home, không phải tab switch)
- User mental model: tap widget = "show me more about THIS product". Không phải "take me to Tài chính tab".
- **Nhưng** — product detail page thuộc tab Tài chính. Nên deep link: tap widget → navigate to TC tab → auto-scroll to SL section.
- Hoặc: present product detail as modal/push from Home → user tap back → quay Home. Simpler.

## 7. Portfolio View — 2 Levels
- **Level 1 (Glanceable):** Hero card trên tab TC. Tổng số + breakdown pills (Ví X · SL X · BĐS X). Không chart.
- **Level 2 (Full screen):** Tap hero → Portfolio detail. Chart lịch sử (1W/1M/3M/1Y), breakdown barchart, performance %.
- **Khi nào cần Level 2:** Khi user có ≥ 2 products active. User 1 product → level 2 = overkill.

## 8. Cross-sell trong Tab
- **KHÔNG cross-sell trong product detail.** User đang xem SL detail → pop up "Thử BĐS?" = annoying.
- **Cross-sell ở tab TC level:** Max 2 discovery cards ở bottom, sau tất cả active products. Dismissible. Respect 3-dismiss rule.
- **Logic:** Chỉ show product user chưa có. User đã có SL + BH → show BĐS, CCQ. User có tất cả → không show gì.

## 9. Mental Model: "Tài chính"
- **Giữ tên "Tài chính"** — industry standard VN. MoMo/ZaloPay đã train mental model.
- **BH có phải "tài chính"?** Trong context VN: "quản lý tài chính" bao gồm BH. User mua BH qua app tài chính = accepted.
- **Phân loại rõ bên trong tab:** Section titles "Tích luỹ & Đầu tư" / "Bảo vệ" / "Tín dụng" giúp user phân biệt mà không cần sub-nav.

## 10. Habit Break: Mất Tab GD
- **Severity: MEDIUM-HIGH.** User VN check GD rất thường xuyên (post-transaction, cuối tháng, đối soát).
- **Mitigation:**
  - Home "GD gần đây" section luôn visible (3 items) — user thấy ngay không cần tìm
  - Wallet card affordance rõ: "Xem lịch sử →"
  - Transition BottomSheet hiện 1 lần: "Lịch sử giao dịch giờ nằm trong Ví" + animation chỉ wallet card
  - Search shortcut trên Home: tap search → filter "Giao dịch" → GD list

## 4 câu cần PO confirm
1. Tổng tài sản có tính BH value không? (recommend: KHÔNG — BH = bảo vệ, không phải asset)
2. BNPL dư nợ hiện trong tổng tài sản hay tách riêng? (recommend: tách riêng — liability ≠ asset)
3. Cross-sell max bao nhiêu cards? (recommend: 2, dismissible)
4. GD merge Home: wallet card tap → fullscreen hay inline expand? (recommend: fullscreen push)

---
Back: [[features/index|Features]] · [[features/app-architecture-2026/status|app-architecture-2026]]
