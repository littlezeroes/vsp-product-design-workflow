/* Info design source — structured mental model + zones per screen.
 * Follow quy-nhom pattern: mỗi screen có userGoal, context, emotion,
 * decisionPoints, successCriteria + danh sách zones với bbox %
 * trên khung 390×844.
 */

export interface MentalModel {
  userGoal: string
  context: string
  emotion: string
  decisionPoints: string[]
  successCriteria: string
}

export interface Zone {
  zone: string
  content: string
  why: string
  bbox?: [number, number, number, number]
}

export interface ScreenInfo {
  mentalModel: MentalModel
  zones: Zone[]
  reference?: string
}

export const INFO_DESIGN: Record<string, ScreenInfo> = {
  /* ── E4 · Onboarding ─────────────────────────────────────────── */
  "S0 · GSM Home · entry": {
    mentalModel: {
      userGoal: "Người dùng mở Xanh SM để đi đâu đó. Họ không vào app để tìm ví — nhưng nếu thấy ví hiện rõ trên trang chủ, họ sẽ cân nhắc dùng.",
      context: "Lần đầu thấy VSP trong Xanh SM, hoặc người dùng lặp lại nhiều lần khi book ride. Thời gian attention ngắn ~3 giây cho card VSP.",
      emotion: "Trung tính — muốn đặt chuyến nhanh. Không hào hứng với tính năng tài chính khi đang cần đi.",
      decisionPoints: [
        "Có cần mở ví để tiện sau không?",
        "Số dư ví có đủ cho chuyến sắp tới không?",
      ],
      successCriteria: "Trong 3 giây nhận ra có ví VSP · biết số dư · biết 4 action chính · hoặc nhận ra cần mở ví.",
    },
    zones: [
      {
        zone: "Search bar white pill",
        content: "Input 'Bạn muốn đi đâu?' 56px, radius 28px, shadow nhẹ.",
        why: "Người dùng vào Xanh SM để đi — search bar phải là thứ đầu tiên và lớn nhất. Mọi thứ khác phụ trợ.",
        bbox: [4, 8, 92, 8],
      },
      {
        zone: "VSP card trắng · icon xanh đậm",
        content: "Card trắng 22px radius, VSP icon 40×40 gradient xanh đậm, balance 20px bold, 4 action inline làm bottom row.",
        why: "VSP brand (xanh đậm) chỉ dùng trong icon 40×40 — không flood toàn card. Phần còn lại dùng ngôn ngữ Xanh SM (trắng, mint). Balance visible nhưng không dominant hơn search bar.",
        bbox: [4, 45, 92, 14],
      },
      {
        zone: "Banner nhắc eKYC/link bank inline",
        content: "Banner nhỏ vàng (eKYC) hoặc mint (link bank) nằm trong card VSP khi chưa hoàn tất onboarding.",
        why: "Nhắc KHÔNG bằng popup chặn. Banner sống trong chính card VSP — user tự click khi sẵn lòng. Đừng biến onboarding thành barrier.",
      },
      {
        zone: "4 action inline · Nạp · QR · Chuyển · Dịch vụ",
        content: "Bottom row của VSP card, chia 4 cột đều, tap mở bottom sheet SDK tương ứng. Action bị khoá có dot vàng góc phải.",
        why: "Slide 2 của deck liệt kê đúng 4 action: Nạp tiền · Quét QR · Chuyển tiền · Mua FS. Đặt inline thay vì hub riêng giảm 1 navigation step.",
        bbox: [4, 54, 92, 7],
      },
      {
        zone: "Bottom nav floating blur pill + XEM NGAY chip",
        content: "Nav 4 tab (Home · Hoạt động · Thông báo · Tài khoản) floating với blur 24px. Chip 'XEM NGAY' tròn 60px gradient xanh lá tách riêng bên phải.",
        why: "Đúng UI thật Xanh SM. XEM NGAY là Green Race CTA — marketing campaign riêng, cần tách visually khỏi nav core. Giữ nguyên pattern này giúp user không bị choáng khi nhúng VSP.",
        bbox: [4, 93, 92, 6],
      },
    ],
    reference: "GoPay card on GoJek home + Xanh SM native UI (photo user đã cung cấp).",
  },

  "S1 · Intro · auto-created": {
    mentalModel: {
      userGoal: "Người dùng vừa tap icon VSP. Không biết sẽ phải làm gì. Muốn biết bước tiếp theo nhanh nhất.",
      context: "Thời điểm conversion quan trọng nhất của funnel. Nếu màn này scare user, họ close và không quay lại ngay.",
      emotion: "Tò mò pha nghi ngờ. Sợ phải nhập nhiều thông tin hoặc bị buộc làm eKYC ngay.",
      decisionPoints: [
        "Tạo ví hay thoát?",
        "Có cần đồng ý điều khoản gì không?",
      ],
      successCriteria: "Hiểu trong 5 giây: ví đã tạo sẵn · chỉ cần đặt PIN · mọi thứ khác làm sau.",
    },
    zones: [
      {
        zone: "Card xanh đậm gradient · ví đã tạo",
        content: "Card VSP brand gradient, icon Wallet 24px trong box 52×52 bg-white/15, headline 'Ví đã sẵn sàng được tạo cho bạn', SĐT hiển thị.",
        why: "Framing QUAN TRỌNG: ví đã được tạo — user không cần 'quyết định tạo'. Slide 8 của deck ghi rõ 'Được tự động tạo tài khoản VSP'. Hiển thị SĐT để user thấy VSP dùng cùng SĐT Xanh SM, không app mới.",
        bbox: [6, 10, 88, 22],
      },
      {
        zone: "Headline + subcopy 'Chỉ còn 1 bước'",
        content: "Headline 22px bold 'Chỉ còn 1 bước — đặt mã PIN 6 số'. Subcopy 13px giải thích eKYC và link bank bổ sung sau.",
        why: "Chống fear: rõ ràng chỉ 1 bước bắt buộc. eKYC/link bank defer → giảm cognitive load.",
        bbox: [6, 34, 88, 10],
      },
      {
        zone: "3 bullet giá trị",
        content: "3 dòng with check icon: tự kết nối SĐT, dùng ngay, miễn phí trọn đời.",
        why: "Value prop không bắt đọc paragraph. 3 bullet ngắn = scannable trong 2s.",
        bbox: [6, 48, 88, 16],
      },
    ],
  },

  "S2 · PIN setup / confirm": {
    mentalModel: {
      userGoal: "Chọn 6 số PIN dễ nhớ nhưng không ai đoán được. Hoàn thành nhanh.",
      context: "Thường đang ở nơi công cộng — không muốn dùng system keyboard có thể bị cached.",
      emotion: "Hơi lo bảo mật. Muốn có guidance chọn PIN tốt.",
      decisionPoints: ["6 số nào?"],
      successCriteria: "Nhập 2 lần khớp nhau trong < 30 giây, không bị sai.",
    },
    zones: [
      {
        zone: "6 PIN dots",
        content: "6 chấm tròn 14px gap 16px, fill xanh đậm khi đủ số, border mờ khi trống.",
        why: "Visual feedback rõ ràng mà không lộ số. Gap 16px đủ rộng để đếm dễ từ xa.",
        bbox: [38, 28, 24, 4],
      },
      {
        zone: "Custom keypad 4×3 grid",
        content: "12 phím (1-9, 0, xoá). Không dùng system keyboard. Tap auto-advance khi đủ 6 số.",
        why: "Custom keypad bảo mật hơn system keyboard (không bị cache, không keylogger). Quy-nhom Epic 7 Auth cùng pattern.",
        bbox: [6, 44, 88, 48],
      },
      {
        zone: "Copy 'không trùng SĐT/ngày sinh'",
        content: "Subcopy dưới title, 12px, màu thứ cấp.",
        why: "Proactive security tip — không đợi user sai rồi mới báo. Đặt trước khi nhập để user hình thành PIN tốt ngay.",
        bbox: [6, 20, 88, 6],
      },
    ],
  },

  "S5 · eKYC · camera capture": {
    mentalModel: {
      userGoal: "Chụp CCCD đúng ngay lần đầu để khỏi làm lại.",
      context: "Ánh sáng có thể không tốt. Máy có thể run. CCCD có thể bị cong.",
      emotion: "Lo chụp không đúng và bị fail. Có thể sợ share CCCD.",
      decisionPoints: [
        "Đặt CCCD trong khung?",
        "Có cần bỏ kính/hộp?",
      ],
      successCriteria: "Khung CCCD khớp outline · ảnh rõ · qua OCR một lần.",
    },
    zones: [
      {
        zone: "Camera frame với outline CCCD",
        content: "Khung đen aspect 85:54 (CCCD ratio), outline dashed white 2px, 4 corner markers 28×28.",
        why: "Outline guide user đặt đúng vị trí. 4 corner markers là pattern phổ biến cho doc scan (Monzo, Revolut, Wise).",
        bbox: [6, 22, 88, 42],
      },
      {
        zone: "Title + subcopy",
        content: "'Mặt trước CCCD' 17px bold + subcopy 12px 'Đặt CCCD trong khung · đủ ánh sáng · không chói'.",
        why: "3 yêu cầu rõ ràng từ trước khi user chụp thay vì fail + retry. Tiết kiệm 1 lần fail.",
        bbox: [6, 14, 88, 6],
      },
      {
        zone: "Disclaimer mock",
        content: "Card info 'Ví dụ mock · production dùng SDK VSP embed'.",
        why: "Minh bạch — đây là demo. Đừng pretend production. Tránh confusion khi demo cho stakeholder.",
        bbox: [6, 68, 88, 8],
      },
    ],
  },

  "S6 · Link bank · pick + enter + result": {
    mentalModel: {
      userGoal: "Chọn ngân hàng đang dùng và liên kết để nạp tiền.",
      context: "Có thể chưa kích hoạt Smart OTP. Có thể không nhớ số TK chính xác.",
      emotion: "Dè chừng — đưa thông tin ngân hàng vào app mới.",
      decisionPoints: [
        "Ngân hàng nào?",
        "Tin tưởng đủ để nhập số TK + OTP?",
      ],
      successCriteria: "Nhập xong số TK + OTP trong 60 giây · nhận confirm thành công.",
    },
    zones: [
      {
        zone: "Ngân hàng list · chỉ Techcombank cho MVP",
        content: "MVP release chỉ có 1 ngân hàng Techcombank (đỏ #d32c1f). Bank khác sẽ add sau phase 2.",
        why: "Minh bạch roadmap thay vì ẩn. User biết kỳ vọng đúng. Không làm fake 'Sắp ra mắt' mơ hồ.",
        bbox: [4, 20, 92, 64],
      },
      {
        zone: "OTP 6 ô tròn",
        content: "6 ô 48×56px rounded 12px bg-white, dot ở ô đã nhập.",
        why: "Pattern phổ biến cho OTP (Apple, Google, banking). Tách ô riêng giúp user đếm đúng số đã nhập.",
        bbox: [6, 68, 88, 10],
      },
      {
        zone: "Timer 60s + gửi lại",
        content: "'Mã có hiệu lực 60 giây · Gửi lại' text dưới OTP.",
        why: "Giảm anxiety về thời gian. Link gửi lại để user không phải start over nếu OTP hết hạn.",
      },
    ],
  },

  /* ── E5 · Wallet + booking ────────────────────────────────────── */
  "S8 · VSP Wallet mini": {
    mentalModel: {
      userGoal: "Xem số dư · nạp nhanh · hoặc dùng 1 trong 4 action chính.",
      context: "Mở VSP trong Xanh SM. Mục đích có thể là check balance trước ride, hoặc nạp tiền, hoặc xem giao dịch.",
      emotion: "Trung tính — đang kiểm soát tài chính nhỏ. Cần feedback nhanh.",
      decisionPoints: [
        "Nạp bao nhiêu?",
        "Dùng action nào trong 4?",
      ],
      successCriteria: "Thấy balance ngay trong 1 giây · biết mỗi action làm gì · biết cách nạp/rút nhanh.",
    },
    zones: [
      {
        zone: "Balance card hero · trắng + VSP icon 40×40",
        content: "Card trắng radius 24px shadow nhẹ. Icon VSP xanh đậm gradient 40×40 bên trái. Label 'SỐ DƯ VÍ VSP' 11px uppercase. Balance 30px black tracking-tight + eye toggle.",
        why: "Balance là thông tin #1 user quay lại để xem. Size 30px prominent nhưng không dominate toàn screen. Eye toggle cho privacy (quán cafe, họp nhóm). VSP brand chỉ ở icon 40×40 để hòa với Xanh SM.",
        bbox: [4, 14, 92, 18],
      },
      {
        zone: "4 action inline · bottom row card",
        content: "Grid 4 cột, icon 34×34 rounded 12px bg-mint, label 11px bold. Nạp/QR/Chuyển/Dịch vụ.",
        why: "4 dịch vụ chính theo slide 2 deck. Đặt CÙNG card với balance = 1 mental model 'đây là ví + thao tác ví'. Action bị khoá có dot vàng góc phải + tap → popup eKYC/link bank reminder.",
        bbox: [4, 30, 92, 10],
      },
      {
        zone: "Shortcut · Dùng trong Xanh SM",
        content: "4 card trắng nhỏ: Trả chuyến (0 phí tag) · Nạp e-Card · Mua quà tặng · QR quán ăn.",
        why: "Use case ecosystem-specific — khác hẳn 4 action chung. Đây là 'VSP có thể làm gì TRONG Xanh SM', trong khi 4 action trên là core wallet. Tách layer để mỗi nhóm có meaning riêng.",
        bbox: [4, 46, 92, 14],
      },
      {
        zone: "Giao dịch grouped card",
        content: "Card trắng single với 4 giao dịch, divider 1px subtle giữa items. Icon circle bg-mint cho mỗi tx. Amount +green/-black.",
        why: "Grouped card hơn list riêng lẻ = ít noise hơn. 4 tx là con số đúng — dài quá user scroll, ngắn quá không đủ context.",
        bbox: [4, 62, 92, 30],
      },
    ],
    reference: "GrabPay Wallet tab (card-based hero + actions + services grid).",
  },

  "S9 · Booking · VSP default": {
    mentalModel: {
      userGoal: "Đặt chuyến. Không muốn bị dialog 'chọn phương thức' mỗi lần.",
      context: "95% các lần book ride, user không đổi payment method. Chỉ khi ride lạ (inter-province lớn) mới cân nhắc.",
      emotion: "Muốn nhanh. Mỗi giây chờ payment dialog là 1 giây nghĩ về việc khác.",
      decisionPoints: ["Xe nào?"],
      successCriteria: "Tap 'Đặt chuyến' trong < 10 giây từ khi mở app.",
    },
    zones: [
      {
        zone: "Payment chip · 1 dòng · nút Đổi",
        content: "Card 1 dòng: VSP icon + balance + label 'VSP · đủ' + nút 'Đổi' text nhỏ bên phải.",
        why: "1 dòng = 0 friction. Nút 'Đổi' thay vì chevron tránh user hiểu nhầm là expand. 95% user không đụng — đây là default invisible.",
        bbox: [4, 52, 92, 7],
      },
      {
        zone: "Service tier selector · 3 option",
        content: "Bike · Car · Limo. Card border 14px radius. Active state border đen + bg secondary. Badge 'Đề xuất' cho Car.",
        why: "Default tier dựa vào route length + giờ. Chỉ 3 option chính — đừng show Liên tỉnh/Airport/Limo cùng lúc trên màn book thường (đó là edge case, đi qua flow khác).",
        bbox: [4, 22, 92, 26],
      },
      {
        zone: "Fee summary card · transparent",
        content: "Giá chuyến + Phí 0₫ (nếu VSP) hoặc +528₫ (nếu MoMo) + Tổng trả.",
        why: "Phí minh bạch. User chọn MoMo sẽ thấy +528₫ — tự động hiểu VSP tiết kiệm. Không cần nói 'VSP tốt hơn' — để số tự nói.",
        bbox: [4, 72, 92, 14],
      },
      {
        zone: "CTA 'Đặt chuyến · 48K' primary xanh",
        content: "Full width 52px rounded-full, text amount inline.",
        why: "Amount inline CTA = final confirmation không cần modal riêng. Face ID/PIN tự trigger khi tap.",
        bbox: [4, 90, 92, 8],
      },
    ],
  },

  "S12 · Receipt · VSP đã trả": {
    mentalModel: {
      userGoal: "Confirm tiền đã trừ đúng · rate driver · thoát về home.",
      context: "Vừa xuống xe. Đang chuyển context sang việc kế tiếp. 10 giây attention cho screen này.",
      emotion: "Relief. Hoàn thành ride. Tay có thể đang bận bag/phone.",
      decisionPoints: [
        "Driver có tốt không?",
        "Tiền đã trừ đúng không?",
      ],
      successCriteria: "Confirm + rate trong < 15 giây · thoát về home cho việc kế tiếp.",
    },
    zones: [
      {
        zone: "Hero xanh · Đã trả 48K từ VSP",
        content: "Hero gradient xanh đậm. Icon check trắng 72×72 trong circle bg-white/15. Amount 44px black. Subline 'Còn 32K trong ví'.",
        why: "Hero khẳng định trừ đúng + số dư sau. Balance-after = quan trọng hơn amount (user muốn biết còn bao nhiêu để không phải mở wallet).",
        bbox: [0, 0, 100, 36],
      },
      {
        zone: "Rate driver card",
        content: "Avatar tài xế + tên + rating 4.9 + 5 sao tap-to-rate.",
        why: "Đặt giữa (không đầu không cuối) = cân bằng với confirm + exit. Sao hover state → fill vàng nhạt.",
        bbox: [4, 46, 92, 18],
      },
      {
        zone: "Invoice · Phí thanh toán 0₫",
        content: "Row 'Giá chuyến' + 'Phí thanh toán 0₫ xanh' + 'Đã trừ VSP 48K' + link 'Xem hoá đơn điện tử'.",
        why: "0₫ phí đánh dấu lợi thế VSP so với MoMo/ZaloPay (+0.5-1.1%). Không cần marketing — cho số nói.",
        bbox: [4, 66, 92, 20],
      },
    ],
  },

  /* ── E6 · e-Card ──────────────────────────────────────────────── */
  "S13 · e-Card hub": {
    mentalModel: {
      userGoal: "Xem tổng giá trị thẻ · nạp thêm · hoặc quy đổi quà thành tiền.",
      context: "User có ít nhất 1 e-Card (chính) + có thể thẻ quà tặng nhận được. Muốn quản lý.",
      emotion: "Khám phá. Có thể chưa biết quy đổi quà tặng khả dụng.",
      decisionPoints: [
        "Nạp thẻ hay quy đổi?",
        "Thẻ nào?",
      ],
      successCriteria: "Phân biệt được thẻ chính vs thẻ quà tặng · biết 2 action khả dụng.",
    },
    zones: [
      {
        zone: "Tổng giá trị thẻ · 36px",
        content: "'Tổng giá trị thẻ 520.000 ₫' prominent top.",
        why: "Aggregate trước khi detail. User thường quan tâm 'tổng có bao nhiêu' trước, sau mới xem thẻ nào.",
        bbox: [4, 14, 92, 8],
      },
      {
        zone: "2 card thẻ · gradient xanh rêu",
        content: "Mỗi thẻ 1 card radius 22px gradient xanh đậm. Emoji riêng (🌿 chính, 🎁 quà tặng). Label rõ loại thẻ dưới.",
        why: "Visual differentiation quan trọng để user không quy đổi nhầm thẻ chính (không cho phép). Emoji giúp glance nhanh.",
        bbox: [4, 26, 92, 26],
      },
      {
        zone: "2 action card · Nạp + Quy đổi",
        content: "Grid 2 col: 'Nạp thẻ' (icon + gradient VSP) + 'Quy đổi' (icon mint). Subline '0 phí' và 'Thẻ → VSP ví'.",
        why: "2 action chính được expose ở screen đầu, không nest sâu. Slide 5.2 deck ưu tiên cả 2 luồng (nạp + quy đổi).",
        bbox: [4, 58, 92, 12],
      },
    ],
  },

  /* ── E9 · Driver ──────────────────────────────────────────────── */
  "S20 · Driver wallet home": {
    mentalModel: {
      userGoal: "Kiểm tra TKĐB đủ chưa · xem tiền cuốc hôm nay · rút về ngân hàng.",
      context: "Tài xế mở app cuối ca/giữa ca để check thu nhập. Có thể đang bận, check 10s rồi tắt.",
      emotion: "Quan tâm thu nhập · lo TKĐB thiếu không mở được cuốc tiền mặt.",
      decisionPoints: [
        "TKĐB đủ cho ngày mai chưa?",
        "Rút về bank hôm nay hay để mai?",
      ],
      successCriteria: "Trong 5 giây thấy 2 balance · trạng thái TKĐB (đủ/thiếu) · biết 1 tap để rút.",
    },
    zones: [
      {
        zone: "TKĐB card · xanh đậm gradient",
        content: "Card xanh đậm 450K TKĐB + text 'Cần ≥100K để mở cuốc tiền mặt · hiện ĐỦ'. 2 nút Nạp/Rút TKĐB.",
        why: "TKĐB là collateral — 2 nút inline (thay vì nest trong menu) vì tài xế cần nạp nhanh giữa ca. Status 'đủ/thiếu' = quan trọng nhất.",
        bbox: [4, 14, 92, 26],
      },
      {
        zone: "Pocket card trắng · tiền cuốc đã thu",
        content: "Card trắng 2.45M + delta '+320K hôm nay' + '24 cuốc'. 2 nút Rút/Lịch sử.",
        why: "Phân biệt rõ TKĐB (collateral) vs Pocket (thu nhập thực). Tài xế quan tâm pocket nhất — nên Rút làm primary CTA gradient VSP.",
        bbox: [4, 42, 92, 22],
      },
      {
        zone: "Hoạt động hôm nay list",
        content: "Card trắng với list cuốc today. Mix cuốc VSP (+amount xanh) và cuốc tiền mặt (-amount nâu, ghi 'đã trừ TKĐB').",
        why: "Màu amount phân biệt 2 loại giao dịch. Cuốc tiền mặt trừ TKĐB = pattern edge case quan trọng cho tài xế hiểu.",
        bbox: [4, 66, 92, 28],
      },
    ],
  },

  /* ── E8 · Merchant ────────────────────────────────────────────── */
  "S18 · Merchant wallet home": {
    mentalModel: {
      userGoal: "Xem doanh thu · rút nhanh về bank · biết mình tiết kiệm bao nhiêu so với settle qua bank.",
      context: "Chủ hộ KD mở app cuối ngày để settlement. Thường 1 người dùng cho 1 cửa hàng.",
      emotion: "Quan tâm cash flow. Muốn minh bạch phí.",
      decisionPoints: [
        "Rút hôm nay hay để mai?",
        "Số này có đúng với POS không?",
      ],
      successCriteria: "Thấy settlement balance + so sánh phí với bank · 1 tap rút.",
    },
    zones: [
      {
        zone: "Settlement card xanh đậm · real-time",
        content: "Card xanh gradient 4.28M + tag 'Real-time · không đợi T+1 bank'. Nút 'Rút về ngân hàng' full width trắng.",
        why: "Real-time vs T+1 bank = giá trị CHÍNH của merchant wallet theo deck slide 5. Đặt tag này gần balance để user hiểu ngay vì sao VSP > bank.",
        bbox: [4, 10, 92, 30],
      },
      {
        zone: "2 stat card · doanh thu + chờ settle",
        content: "Grid 2 col nhỏ: 'Doanh thu hôm nay 1.24M · 42 đơn' + 'Chờ settle 180K · trong 15p'.",
        why: "Phân biệt 'đã thu' vs 'chờ' vs 'sẵn rút'. Thời gian 'trong 15p' cho pending = expectation setting rõ.",
        bbox: [4, 42, 92, 10],
      },
      {
        zone: "Banner vàng · tiết kiệm 2-4% phí",
        content: "Banner mini 'Tiết kiệm 2-4% phí chuyển khoản so với settle qua bank'.",
        why: "Value prop chính theo deck: 'Xanh giảm được chi phí chuyển khoản ngân hàng'. Hiển thị trực tiếp để merchant nhớ lý do dùng VSP.",
        bbox: [4, 82, 92, 10],
      },
    ],
  },
}
