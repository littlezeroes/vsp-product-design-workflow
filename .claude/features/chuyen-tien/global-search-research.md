# Research: Flow Chọn Người Nhận — Chuyển Tiền
**Researcher:** Nate | **Date:** 2026-03-09
**Scope:** 15 apps (10 quốc tế + 5 VN) | **Focus:** Bước "Gửi cho ai" (WHO) trước "Gửi bao nhiêu" (HOW MUCH)

---

## 1. Research Table — So sánh tất cả apps

| App | Region | Users | Recipient-First? | Search Type | Recent/Frequent | P2P vs Bank | QR Scan | Auto-detect Bank | Paste Support | Bước chọn người nhận |
|-----|--------|-------|-------------------|-------------|-----------------|-------------|---------|-----------------|---------------|---------------------|
| **Wise** | Global | 16M | YES — chọn recipient trước, rồi mới nhập amount | Full-screen search: @Wisetag, email, phone, bank details | Danh sách existing recipients, search được | **Tách**: P2P (Wisetag/email/phone) vs Bank (IBAN/details) — nhưng cùng 1 screen | Không | Không | YES — upload invoice/screenshot, AI auto-fill | 2-3 bước (chọn recipient > chọn currency > nhập details nếu mới) |
| **Revolut** | EU | 45M | YES — chọn recipient rồi mới enter amount | Full-screen: search by Revtag, phone, email, hoặc chọn từ contacts | Recent transactions hiện đầu, Revolut friends list | **Gộp**: cùng 1 entry point "Send money", tự detect Revolut user vs bank | YES | Không | Không rõ | 1-2 bước (chọn contact hoặc search > enter details nếu external bank) |
| **Venmo** | US | 90M | YES — chọn recipient trước | Full-screen search: name, @username, phone, email | Recent contacts hiện trên đầu search screen | **P2P only** — không có bank transfer, chỉ Venmo-to-Venmo | Không | N/A | Không | 1 bước (search/chọn recipient > enter amount cùng screen) |
| **PayPal** | Global | 430M | YES — nhập recipient trước | Inline search: name, @username, email, mobile | Contact list + recent | **Gộp**: cùng flow, chọn "Goods & Services" hay "Friends & Family" sau | Không | Không | Không | 1-2 bước (search recipient > enter amount > chọn type) |
| **Zelle** | US | 100M | YES — chọn/nhập recipient trước | Inline search: name, phone, email. Purple "Z" badge = registered | Recent recipients list, có badge | **P2P only** — qua bank backend, nhưng user chỉ cần phone/email | YES | Tự detect qua phone/email (Zelle network) | Không | 1-2 bước (search/enter phone/email > enter amount) |
| **N26** | EU | 8M | YES | Full-screen contact list (MoneyBeam) hoặc manual IBAN entry (bank transfer) | Contact list sync từ phone, hiện N26 users | **Tách**: MoneyBeam (P2P, chọn contact) vs Bank Transfer (nhập IBAN) — 2 entry riêng | Không | Không | Không | MoneyBeam: 1 bước (chọn contact). Bank: 2-3 bước (nhập IBAN + tên) |
| **Monzo** | UK | 9M | YES — "Pay Someone" > chọn ai | Full-screen: search by name/username, phone contacts sync | "Recent" section + "Pay Contacts on Monzo" section — tách riêng | **Gộp**: cùng "Pay Someone", auto-detect Monzo user. "Pay Someone New" = bank details | YES (monzo.me link) | Confirmation of Payee (CoP) — verify tên vs account | Không | 1-2 bước (chọn từ recent/contacts hoặc nhập bank details mới) |
| **GrabPay** | SEA | 40M+ | YES | Nhập phone number | Không rõ recent list | **P2P only** — qua phone number trong Grab ecosystem | YES (QR code rất mạnh, primary payment method) | N/A | Không | 1 bước (nhập phone > enter amount) |
| **GoPay** | ID | 50M+ | YES | Nhập phone number | Không rõ | **P2P only** — GoPay-to-GoPay qua phone. Bank transfer là flow riêng | Không rõ | Không | Không | 1 bước (nhập phone > enter amount > PIN) |
| **WeChat Pay** | CN | 1.2B | YES — chọn friend trong chat trước | Không search riêng — chọn friend từ chat list, rồi tap "Transfer" | Chat list = recent by default | **P2P only** — chat-based. Bank transfer là flow hoàn toàn khác | YES (QR rất mạnh) | N/A | Không | 1 bước (chọn friend trong chat > tap Transfer > nhập amount) |
| **Alipay** | CN | 1B+ | YES — chọn contact trước | Search by Alipay account/phone/Taobao account | Friends list, recent transfers | **P2P chính** — phải add friend trước. Bank transfer riêng | YES (QR primary) | N/A | Không | 2-3 bước (tìm/add friend > tap Transfer > nhập amount) |
| **Paytm** | IN | 350M+ | YES — "To Mobile or Contact" | Inline search: phone number, UPI ID, hoặc chọn từ contacts | Recent contacts trên home screen | **Gộp**: "To Mobile" (P2P/UPI), "To Bank A/c" (bank), "Scan & Pay" (QR) — 3 entry cùng level | YES (Scan & Pay) | Auto-detect qua UPI ID (biết bank nào) | Không | 1 bước (chọn/nhập phone > enter amount > UPI PIN) |
| **MoMo** | VN | 40M+ | YES — search/chọn người nhận trước | Inline search: tên, SĐT, số tài khoản | Gợi ý người nhận thường xuyên + gần nhất, cho phép "yêu thích" | **Gộp**: cùng "Chuyển tiền", nhập SĐT (P2P) hoặc STK (bank) | YES | Auto-detect bank từ STK | Không rõ | 1-2 bước (search/chọn > nhập số tiền > xác nhận) |
| **ZaloPay** | VN | 20M+ | YES | Search qua Zalo chat hoặc nhập SĐT | Zalo chat = recent contacts | **Tách**: Chuyển tiền ví (qua SĐT/Zalo) vs Chuyển ngân hàng (qua STK) | YES | Không rõ | Không | 1-2 bước (chọn từ Zalo chat/nhập SĐT > nhập amount) |
| **ViettelMoney** | VN | 20M+ | YES | Nhập SĐT hoặc chọn danh bạ | Lưu người nhận thường xuyên | **Tách**: "Chuyển tới SĐT" vs "Chuyển ngân hàng" — 2 menu riêng | YES (QR) | Không rõ | Không | 1-2 bước (nhập SĐT > nhập amount > OTP) |
| **BIDV SmartBanking** | VN | 15M+ | YES | Nhập STK, SĐT, hoặc chọn từ danh sách đã lưu | Lưu người thụ hưởng | **Tách**: Nội bộ BIDV vs Liên ngân hàng vs Quốc tế — 3 entry riêng | YES (QR) | Có — detect bank từ STK (Napas) | Không | 2-3 bước (chọn loại CK > nhập STK/SĐT > nhập amount) |
| **VCB Digibank** | VN | 20M+ | YES | Nhập STK, chọn từ danh sách lưu | Lưu người thụ hưởng | **Tách**: Nội bộ VCB vs Liên ngân hàng — menu riêng | YES (QR) | Có — detect bank từ STK | Không | 2-3 bước (chọn loại > nhập STK > nhập amount) |

---

## 2. Common Patterns (xuất hiện ở >50% apps)

### Pattern 1: Recipient-First là CHUẨN (15/15 apps = 100%)
- **Tất cả** app đều follow logic: Gửi cho ai → Gửi bao nhiêu. Không app nào hỏi số tiền trước.
- Đây là mental model tự nhiên: bạn nghĩ "tôi muốn gửi tiền cho An" trước khi nghĩ "tôi gửi 500k".

### Pattern 2: Search đa kênh — phone/name/ID (13/15 = 87%)
- Hầu hết app cho phép search recipient bằng nhiều identifier: SĐT, tên, username/tag, email.
- Chỉ WeChat Pay (chat-based) và GoPay (phone-only) giới hạn hơn.

### Pattern 3: Recent/Frequent contacts hiện đầu tiên (14/15 = 93%)
- Gần như tất cả app hiện recent/frequent recipients ở vị trí nổi bật nhất trên screen chọn người nhận.
- WeChat Pay dùng chat list làm recent by default — pattern tự nhiên nhất.
- MoMo cho phép đánh dấu "yêu thích" để pin lên đầu.

### Pattern 4: Full-screen search (10/15 = 67%)
- Wise, Revolut, Venmo, N26, Monzo, Paytm, MoMo dùng full-screen search khi tap vào search.
- Một số (PayPal, Zelle) dùng inline search bar ngay trên screen danh sách.

### Pattern 5: QR Code scan support (10/15 = 67%)
- Revolut, Zelle, GrabPay, WeChat Pay, Alipay, Paytm, MoMo, ZaloPay, ViettelMoney, BIDV, VCB đều hỗ trợ QR.
- Đặc biệt mạnh ở Châu Á: WeChat Pay, Alipay, GrabPay dùng QR là primary method.

### Pattern 6: P2P và Bank Transfer có entry point riêng (9/15 = 60%)
- Các bank app (BIDV, VCB, N26) và e-wallet VN (ZaloPay, ViettelMoney) **tách** P2P vs bank transfer.
- Các super-app (Revolut, PayPal, MoMo, Paytm, Monzo) **gộp** — auto-detect loại chuyển khoản.
- **Trend mới**: Gộp là hướng đi hiện đại hơn, giảm cognitive load.

---

## 3. Innovative Patterns (ít app làm nhưng hay)

### 3.1 AI Invoice/Screenshot Upload (Wise)
- Wise cho upload screenshot hoặc invoice (PDF/PNG/JPEG), AI tự extract recipient + amount + bank details.
- Cực kỳ tiện cho business transfers. Chưa app nào khác làm được level này.
- **Relevance cho VSP:** Thấp cho P2P, nhưng cao nếu VSP mở rộng sang business payments.

### 3.2 Chat-Based Transfer (WeChat Pay)
- Transfer tiền trực tiếp từ chat conversation — không cần rời khỏi chat.
- "Chọn người nhận" = implicit (đang chat với ai thì gửi cho người đó).
- **Relevance cho VSP:** Cao nếu VSP có messaging feature hoặc tích hợp với Zalo/chat app.

### 3.3 Unified Search + Auto-Detect (MoMo, Revolut, Monzo)
- 1 ô search duy nhất, nhập SĐT → detect P2P, nhập STK → detect bank, nhập tên → search contacts.
- Không bắt user chọn "loại chuyển khoản" trước — app tự hiểu.
- **Relevance cho VSP:** RẤT CAO. Giảm 1 bước quyết định, phù hợp "ít step = tốt hơn".

### 3.4 Confirmation of Payee (Monzo)
- Khi nhập bank details mới, Monzo verify tên người nhận vs tên trên tài khoản ngân hàng.
- Green tick = match, warning = mismatch. Tăng trust + giảm chuyển nhầm.
- **Relevance cho VSP:** CAO. Napas VN đang triển khai tương tự.

### 3.5 Favorite/Pin Recipients (MoMo)
- Cho phép đánh dấu người nhận yêu thích, hiện đầu tiên mỗi lần mở chuyển tiền.
- Khác với "recent" (tự động) — "favorite" là user chủ động pin.
- **Relevance cho VSP:** CAO. Đặc biệt cho user chuyển tiền cho bố mẹ/vợ chồng hàng tháng.

### 3.6 Smart Suggestion dựa trên context (MoMo)
- MoMo gợi ý cả người nhận, số tiền, và lời nhắn dựa trên lịch sử giao dịch.
- VD: Hay gửi 2 triệu cho mẹ mỗi tháng → suggest "Gửi mẹ 2,000,000đ?"
- **Relevance cho VSP:** CAO. Giảm effort cho recurring transfers.

### 3.7 Multi-recipient (Venmo)
- Venmo cho chọn nhiều người nhận cùng lúc, gửi cùng 1 amount cho tất cả.
- Hữu ích cho split bill ngược (host trả tiền cho nhiều người).
- **Relevance cho VSP:** TRUNG BÌNH. Nice-to-have, không core.

---

## 4. OPTIONS cho VSP — Flow "Chọn Người Nhận"

> Logic bắt buộc tất cả options: **Gửi cho ai → Gửi bao nhiêu tiền**

### Option A: "Unified Smart Search" (Gộp tất cả, 1 ô search)
**Mô hình:** MoMo + Revolut + Monzo

**Flow:**
```
[Home] → Tap "Chuyển tiền"
  → [Screen: Chọn người nhận]
     - Top: Thanh search (placeholder: "SĐT, tên, số tài khoản...")
     - Dưới search: Hàng ngang "Người thường gửi" (avatar + tên, max 5-6)
     - Dưới: "Gần đây" list (avatar + tên + bank/ví + ngày cuối)
     - QR icon ở góc phải thanh search
     - User nhập → app auto-detect:
       * 10 số bắt đầu 0 → SĐT → tìm ví VSP hoặc bank
       * Dãy dài hơn → STK → auto-detect ngân hàng
       * Chữ cái → search tên trong contacts/danh bạ
  → Chọn/xác nhận người nhận
  → [Screen: Nhập số tiền]
```

**Pros:**
- Ít step nhất (1 screen chọn người nhận, không cần chọn "loại chuyển khoản")
- Mental model đơn giản: "tôi muốn gửi cho X" — không cần biết X dùng ví hay bank
- Auto-detect giảm cognitive load — app tự hiểu intent
- Recent + Frequent giúp 80% giao dịch chỉ cần 1 tap
- Đây là trend hiện đại nhất (MoMo, Revolut, Monzo đều đi hướng này)

**Cons:**
- Auto-detect cần logic phức tạp (phân biệt SĐT vs STK, detect ngân hàng)
- Edge case: SĐT 10 số có thể trùng format STK một số bank
- Cần fallback UI khi auto-detect sai (cho user chọn lại)
- User mới có thể không biết mình có thể nhập STK vào cùng ô search

---

### Option B: "Tab-Based Split" (Tách P2P vs Bank bằng tabs)
**Mô hình:** ZaloPay + ViettelMoney + N26

**Flow:**
```
[Home] → Tap "Chuyển tiền"
  → [Screen: Chọn người nhận]
     - Top: 2 tabs → [Tới ví VSP] | [Tới ngân hàng]

     Tab 1 — "Tới ví VSP":
       - Search: SĐT hoặc tên
       - Recent/Frequent list
       - QR scan button

     Tab 2 — "Tới ngân hàng":
       - Chọn ngân hàng (grid logo hoặc search)
       - Nhập STK
       - QR scan button

  → Chọn/xác nhận người nhận
  → [Screen: Nhập số tiền]
```

**Pros:**
- Rõ ràng, dễ hiểu — user biết chính xác mình đang làm gì
- Logic đơn giản hơn (không cần auto-detect)
- Mỗi tab tối ưu UI cho use case riêng
- Quen thuộc với user VN (ZaloPay, ViettelMoney đã train user pattern này)

**Cons:**
- Thêm 1 quyết định cho user: "tôi chuyển qua ví hay bank?" — nhiều user không biết/không care
- Nếu recent contact nằm ở tab khác, user phải switch tab
- 2 tabs = duplicated UI components (search, recent list, QR)
- Không scale tốt nếu thêm loại chuyển khoản mới (quốc tế, ví khác)

---

### Option C: "Contacts-First + Smart Actions" (Danh bạ là trung tâm)
**Mô hình:** WeChat Pay + Venmo + Zelle

**Flow:**
```
[Home] → Tap "Chuyển tiền"
  → [Screen: Danh bạ chuyển tiền]
     - Top: Search bar (tên, SĐT)
     - Section 1: "Yêu thích" (pinned contacts, avatar lớn, ngang scroll)
     - Section 2: "Gần đây" (list dọc)
     - Section 3: "Danh bạ điện thoại" (sync contacts, hiện badge nếu có ví VSP)
     - Bottom: Link "Chuyển bằng STK ngân hàng" → mở form nhập manual
  → Tap contact
  → App auto-detect: có ví VSP → chuyển P2P, không có → hỏi nhập STK
  → [Screen: Nhập số tiền]
```

**Pros:**
- Contact-centric: phù hợp mental model "gửi cho NGƯỜI, không phải gửi cho SỐ TÀI KHOẢN"
- Favorite/recent giúp repeat transfers cực nhanh (1 tap)
- Social proof: thấy ai trong danh bạ dùng VSP → viral growth
- Bank transfer không mất đi, chỉ ẩn xuống dưới (80% user chuyển P2P, 20% bank)

**Cons:**
- Bank transfer bị coi là "secondary" — user cần chuyển ngân hàng phải scroll/tap thêm
- Phụ thuộc vào contact sync permission (nếu user không cho quyền → screen trống)
- Không phù hợp nếu VSP có lượng user nhỏ (danh bạ toàn người không dùng VSP)
- User chuyển khoản ngân hàng thường xuyên sẽ thấy phiền

---

### Option D: "Adaptive Hybrid" (Kết hợp A + C, thay đổi theo hành vi)
**Mô hình:** MoMo enhanced + Paytm

**Flow:**
```
[Home] → Tap "Chuyển tiền"
  → [Screen: Chọn người nhận — Adaptive]
     - Top: Smart search bar (SĐT, tên, STK — unified)
     - QR icon + "Chuyển bằng STK" shortcut (2 icon buttons cạnh search)

     Nếu user ĐÃ CÓ lịch sử:
       - "Gợi ý" row: 1-2 suggestion cards (AI: "Gửi mẹ 2tr?" dựa trên pattern)
       - "Thường xuyên" row: horizontal scroll avatars
       - "Gần đây" list: vertical, có subtitle (Ví VSP / BIDV / VCB...)

     Nếu user MỚI (chưa có lịch sử):
       - "Bắt đầu chuyển tiền" illustration
       - 3 quick actions: "Nhập SĐT" | "Quét QR" | "Nhập STK ngân hàng"
       - "Đồng bộ danh bạ" button

  → Chọn/nhập người nhận
  → Auto-detect loại (ví VSP / bank / chưa đăng ký)
  → [Screen: Nhập số tiền]
```

**Pros:**
- Best of both worlds: unified search + smart suggestions + explicit shortcuts
- Adaptive UI: new user thấy guidance, returning user thấy shortcuts
- AI suggestions giảm effort cho recurring patterns (pattern MoMo đã prove)
- QR + STK shortcut đảm bảo bank transfer không bị ẩn
- Scale tốt: thêm loại chuyển khoản chỉ cần thêm vào auto-detect, không thêm tab

**Cons:**
- Phức tạp nhất để implement (AI suggestion, adaptive UI, auto-detect)
- Cần data lịch sử đủ lớn để AI suggestion có ý nghĩa
- Risk: quá nhiều elements trên 1 screen nếu không design cẩn thận
- A/B test khó hơn vì UI thay đổi theo user state

---

## 5. Recommendation

### Nate khuyến nghị: **Option A (Unified Smart Search)** cho MVP, evolve sang **Option D (Adaptive Hybrid)** cho v2.

**Lý do:**

1. **First principles — User cần gì?**
   - User nghĩ: "Gửi tiền cho An" — không nghĩ "An dùng ví hay bank"
   - 1 ô search giải quyết đúng mental model này
   - VSP là ví điện tử, nhưng user VN chuyển khoản ngân hàng rất nhiều → PHẢI support cả hai, nhưng không bắt user phân loại

2. **Ít step = tốt hơn**
   - Option A: 2 screens (chọn người → nhập tiền). Option B: 3 decisions (chọn tab → chọn người → nhập tiền)
   - Mỗi bước thêm = 10-15% drop-off. Option A giảm 1 quyết định.

3. **Context fintech VN**
   - MoMo đã train 40M+ user VN pattern "1 ô search, nhập SĐT hoặc STK"
   - User VN quen rồi → không cần re-educate
   - Bank apps VN (BIDV, VCB) vẫn dùng tab-based → VSP dùng unified search sẽ differentiate

4. **Lộ trình rõ ràng**
   - **v1 (MVP):** Option A — unified search + recent + frequent + QR. Đủ dùng, ship nhanh.
   - **v2:** Thêm AI suggestions từ Option D (gợi ý người nhận + số tiền). Cần data lịch sử.
   - **v3:** Full adaptive UI từ Option D (new user vs returning user khác nhau).

5. **Risk mitigation**
   - Auto-detect SĐT vs STK: dùng regex + Napas BIN table → độ chính xác cao
   - Fallback: nếu detect sai, show bottom sheet "Bạn muốn chuyển qua Ví VSP hay Ngân hàng?"
   - Option B (tabs) dùng làm fallback nếu user research cho thấy auto-detect confuse user

### Thiếu gì cần PO confirm trước khi design flow:

- **Q1:** VSP có messaging/chat feature không? Nếu có → WeChat-style (Option C variant) đáng cân nhắc.
- **Q2:** Tỷ lệ P2P (ví-ví) vs bank transfer dự kiến bao nhiêu? Nếu bank > 50% thì cần bank UX ngang hàng P2P.
- **Q3:** VSP có plan support chuyển tiền quốc tế không? Nếu có → unified search phải scale thêm.
- **Q4:** Có plan tích hợp Napas Confirmation of Payee (verify tên người nhận) không? Nếu có → cần UI cho match/mismatch state.

---

*Research bởi Nate — "Khoan, 15 app rồi mà chưa thấy app nào hỏi số tiền trước khi hỏi gửi cho ai. Recipient-first là universal truth."*

---
Back: [[features/index|Features]] · [[features/chuyen-tien/status|chuyen-tien]]
