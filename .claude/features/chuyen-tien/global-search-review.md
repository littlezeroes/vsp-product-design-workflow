# Đức Review — Global Search (Chuyển tiền Entry)

> **Level:** Flow + Screen + Code
> **File reviewed:** `app/transfer/entry/page.tsx` — `SearchSheetContent` + main page search
> **Verdict: REWORK**

---

## 1. Roast — Chê thẳng từng vấn đề

### 1.1. HAI SEARCH BAR — Ai nghĩ ra cái này?

Main page có search bar (`px-[22px]`). User gõ vào, nhấn Enter → mở BottomSheet → trong sheet có THÊM MỘT search bar nữa. Cùng placeholder. Cùng icon. Cùng chức năng.

**Tại sao xấu:** User gõ "098" trên main page, nhấn Enter, sheet mở ra — giá trị `initialValue` truyền vào sheet nhưng sheet tạo state MỚI (`useState(initSearch)`). Hai state không sync. User đã gõ rồi, giờ phải nhìn lại cái đã gõ lần nữa trong context khác. Cognitive overhead vô nghĩa.

**Tệ hơn nữa:** Main page search bar filter `filteredSaved` trực tiếp trên main page. Nhưng search sheet thì filter `DANHBA_VSP` + `ALL_SAVED` riêng. Hai nơi filter khác nhau, kết quả khác nhau, cùng input. User sẽ nghĩ: "Ủa, ở ngoài thấy 2 kết quả, vào đây thấy 5 kết quả? Cái nào đúng?"

MoMo không làm thế. ZaloPay không làm thế. Revolut không làm thế. **Một search bar, một nơi hiện kết quả.** Không negotiate.

### 1.2. STATE MACHINE BỊ LEAK RA URL

Toàn bộ state flow dùng `searchParams.get("state")` — tức là `router.push("/transfer/entry?state=sheet-search-typing-sdt")`. Mỗi lần gõ ký tự, nếu muốn chuyển state, phải push URL mới.

**Tại sao xấu:**
- User nhấn back trên browser/gesture → quay lại state cũ → sheet đóng/mở lung tung, UI flicker
- Không có transition animation giữa các state — chỉ là conditional render dựa trên string
- State `sheet-search-typing-sdt` là state PROTOTYPE (mock cố định), không phải logic thật. Code dùng `initSearch()` để hardcode value theo state name. Đây là prototype giả search, không phải search thật.

### 1.3. DESTINATION PICKER KHI PASTE STK — Over-engineered

User paste "19038291832" → sheet mở ra → hiện dòng "Có phải bạn muốn chuyển đến" → hiện STK to đùng → rồi phải CHỌN từ list: Ví VSP (ưu tiên) + 8 banks.

**Tại sao xấu:** User paste STK thì user BIẾT đó là tài khoản ngân hàng. Không ai paste STK mà muốn chuyển đến ví VSP cả. Câu hỏi "Có phải bạn muốn chuyển đến" là thừa. List 8 ngân hàng để user chọn bằng tay là THỤT LÙI — cả ngành đã có auto-detect bank từ BIN/prefix STK rồi (Napas API).

MoMo paste STK → auto-detect bank → hiện luôn tên ngân hàng + tra cứu tên chủ tài khoản. 1 step. VSP paste STK → mở sheet → hiện question → hiện 9 options → user chọn bank → RỒI mới verify. 3 steps. Thừa 2 steps.

### 1.4. DANH BẠ VÍ VSP — SHOW DEFAULT KHI CHƯA GÕ GÌ

Sheet mở ra, chưa gõ gì, hiện 6 contacts danh bạ ví VSP + 5 saved recipients. 11 items ngay lập tức.

**Tại sao xấu:** User mở search để TÌM. Hiện 11 items random là noise. User phải SCAN qua 11 items trước khi quyết định gõ hay chọn. Principle 5 (Progressive Disclosure): "Surface only what's needed now." 11 items khi chưa gõ gì KHÔNG phải "what's needed now."

Revolut: search mở ra → empty + focus keyboard → gõ → kết quả. Clean.

### 1.5. BADGE "ƯU TIÊN" TRÊN VÍ VSP — Self-promotion

Trong destination picker, Ví VSP có badge đỏ "Ưu tiên". Ưu tiên cho AI? Cho VSP? Chắc chắn không phải ưu tiên cho user, vì user paste STK thì user muốn chuyển bank.

**Tại sao xấu:** Đây là business bias lộ ra UI. User thấy "Ưu tiên" sẽ nghĩ "sao app ép tao chuyển ví?" → mất trust. Fintech = trust. Mất trust = mất user.

### 1.6. DETECT BADGE TRÊN MAIN PAGE — Thông tin thừa

Gõ "098" trên main page → hiện badge "SĐT → Ví VSP" + link "Chọn nơi nhận →". Gõ "1903" → hiện badge "STK → Ngân hàng".

**Tại sao xấu:** Badge nói user cái user đã biết. User gõ SĐT — user BIẾT đó là SĐT. Badge chỉ thêm noise. Link "Chọn nơi nhận →" lại dẫn đến destination picker sheet — thêm 1 tap thừa. Auto-route đi. Đừng hỏi user cái user đã answer bằng hành động gõ.

### 1.7. HARDCODED COLORS TRONG AVATAR VÀ BADGE

```tsx
bg-[#EEF2FF] text-[#4F46E5]  // bank avatar
bg-[#FFF0F2] text-[#E31837]  // VSP badge
```

**Golden Rule #1: NEVER hardcode color.** Đây là vi phạm trực tiếp. Khi dark mode bật, `#FFF0F2` sẽ chói mắt trên nền dark. `#EEF2FF` sẽ bị mất contrast. Phải dùng semantic tokens.

### 1.8. BORDER SEPARATOR TRONG DESTINATION PICKER

```tsx
border-b border-border  // giữa các bank items
```

**Design Principle 1 (Clean & Premium):** "No gratuitous dividers or borders." Bank list dùng border-b giữa mỗi row trong cùng 1 card `bg-secondary`. Ref apps dùng spacing, không dùng border trong card. Cash App "no divider" variant dùng khi bg contrast đã đủ — `bg-secondary` là đủ rồi.

### 1.9. `style={{ backgroundColor }}` TRÊN BANK LOGO

```tsx
style={{ backgroundColor: `${color}15` }}
// và
style={{ color }}
```

**Golden Rule #1 + Absolute Don't:** Inline style với color. Hardcode bank brand color trực tiếp. Đây không phải token, không support dark mode, không consistent.

---

## 2. Cognitive Load — User phải suy nghĩ ở đâu?

| Điểm | Cognitive Load | Vấn đề |
|---|---|---|
| Main page search vs Sheet search | CAO | "Gõ ở đâu? Ở ngoài hay ở trong?" — 2 entry points cho cùng 1 action |
| Paste STK → chọn bank | CAO | "Tại sao tao phải chọn bank? App không biết sao?" — user bị hỏi thứ app nên tự biết |
| Default state 11 items | TRUNG BÌNH | "Tao muốn tìm ai? À, cuộn xuống xem..." — scan cost |
| Detect badges | THẤP nhưng THỪA | Thông tin user đã biết = noise = phân tán attention |
| "Chọn nơi nhận →" link | CAO | "Nơi nhận là gì? Tao đang ở search mà?" — terminology mới giữa flow |

**Tổng kết:** User phải ra 2-3 quyết định trước khi đến được màn nhập số tiền. MoMo: chọn người → nhập tiền. VSP: gõ → (có thể) nhấn Enter → sheet → (có thể) chọn bank → resolve → confirm. Quá nhiều.

---

## 3. Flow Breaks — User bị lost ở đâu?

1. **Main page gõ → Enter → Sheet mở:** Sheet mở full, search bar mới, value copied nhưng context reset. User đang ở mode "gõ trên main" → bị teleport vào sheet. Không có animation dẫn dắt, chỉ là sheet pop up. User mất 1-2 giây orient lại.

2. **Sheet search gõ SĐT → resolve → "Chuyển tiền" button:** Resolved card hiện inline trong sheet, có button "Chuyển tiền" riêng. Nhưng kết quả chỉ 1 người. User phải confirm bằng tap "Chuyển tiền" — thêm 1 tap cho 1 kết quả duy nhất. Auto-navigate đi.

3. **STK bank picker → chọn bank → ... rồi sao?** `onSelectBank` chỉ push `/transfer/amount?type=bank`. Nghĩa là chọn bank xong → nhảy thẳng sang nhập tiền? Không verify tên chủ tài khoản? Không confirm? Đây là flow bank transfer mà bỏ qua name verification = nghiêm trọng.

4. **Back navigation từ sheet:** Sheet close → main page. Nhưng main page search bar vẫn giữ `searchInput` state trong React state, trong khi URL đã reset về `?state=default`. State bị out-of-sync. User close sheet, thấy search bar main page vẫn có text cũ, nhưng saved list đã filter theo text đó — confusing.

---

## 4. Redundancy — Cái gì thừa?

| Thành phần | Ở đâu | Verdict |
|---|---|---|
| Search bar | Main page + Sheet | **THỪA 1.** Chọn 1, bỏ 1. |
| Filter saved list | Main page (inline) + Sheet (riêng) | **THỪA.** Cùng data, 2 nơi filter khác nhau. |
| Detect badge | Main page + Sheet | **THỪA 1.** Nếu giữ 1 search bar thì chỉ cần 1 nơi hiện badge. |
| "Chọn nơi nhận →" link | Main page | **THỪA.** Auto-route theo input type. |
| Destination picker (9 items) | Sheet | **THỪA TOÀN BỘ** nếu có auto-detect bank. |
| "Có phải bạn muốn chuyển đến" question | Sheet | **THỪA.** User paste → user biết. |
| SaveToggle hiện trong P2P sheet + Bank sheet | 2 sheets khác nhau | **OK** nhưng nên nhớ: user lần đầu không biết toggle này làm gì. Cần tooltip hoặc không hiện cho first-time transfer. |

**Main page search bar vs Sheet search bar — conflict?** CÓ. Nghiêm trọng. User không biết search nào là "chính". Main page search filter saved list inline — tức là có kết quả ngay. Nhưng Enter/paste lại mở sheet — kết quả khác, context khác. Hai mental model xung đột.

---

## 5. Competitive Gap — So với MoMo / ZaloPay / Revolut

| Feature | MoMo | ZaloPay | Revolut | VSP |
|---|---|---|---|---|
| Single search bar | 1 | 1 | 1 | **2 (conflict)** |
| Auto-detect bank từ STK | BIN lookup | BIN lookup | IBAN/SORT | **Manual chọn** |
| Name verification inline | Auto sau detect | Auto | Auto | **Chỉ sau chọn bank** |
| Recent/frequent contacts | Top 4-5 avatars ngang | Top row | Frequent first | **11 items dump** |
| Paste-to-transfer | Paste → detect → verify → done | Paste → detect → done | Paste → done | **Paste → sheet → chọn bank → ???** |
| Keyboard auto-type | numpad cho SĐT/STK | numpad | Smart keyboard | **Default keyboard** |

### Thiếu nghiêm trọng:
1. **Auto-detect bank từ STK prefix/BIN** — đây là table stakes 2024, VSP vẫn bắt user chọn tay
2. **Recent/frequent row** — MoMo có hàng avatar ngang ở trên, tap 1 cái là xong. VSP dump toàn bộ list.
3. **QR scan entry** — MoMo/ZaloPay có nút scan QR ngay trên transfer entry. VSP không có.
4. **Smart keyboard** — gõ SĐT nên show numpad, gõ tên nên show text keyboard. VSP dùng `type="text"` cho search bar — không optimal.

---

## 6. Đề xuất sửa

### 6.1. BỎ search bar trên main page. Giữ 1 nơi search duy nhất.
**WHY:** Hai search bar = hai mental model = confusion. Chọn 1: hoặc search inline trên main page (như MoMo), hoặc search trong sheet. Không cả hai.

**Đề xuất:** Search inline trên main page. Gõ → kết quả hiện ngay dưới (thay thế saved list). Không cần sheet cho search. Sheet chỉ cho P2P input + Bank input (2 HubCard flows).

### 6.2. Auto-detect bank từ STK — bỏ destination picker
**WHY:** User paste STK thì expect app tự biết bank. Bắt chọn từ 9 options = prehistoric UX. Dùng Napas BIN table hoặc bank prefix mapping.

**Cách sửa:** STK → auto-detect bank → auto-lookup tên → hiện resolved card. 0 extra tap.

### 6.3. Default state: Recent contacts row (avatar ngang) thay vì dump 11 items
**WHY:** 11 items khi chưa gõ = overwhelm. 4-5 avatar ngang = quick tap, progressive disclosure.

**Cách sửa:** Row ngang 4-5 frequent contacts (avatar + tên ngắn). Dưới đó: saved list (collapsed, "Xem tất cả" nếu >3). Gõ → filter cả hai.

### 6.4. Bỏ detect badge và "Chọn nơi nhận" link
**WHY:** Thông tin thừa. User gõ SĐT thì auto-route sang P2P flow. Gõ STK thì auto-route sang bank flow. Không cần badge nói lại điều hiển nhiên.

### 6.5. Resolved card → auto-navigate, không cần button "Chuyển tiền"
**WHY:** Kết quả duy nhất + đã resolve + user đang trong flow chuyển tiền = auto-navigate sang amount screen sau 1 giây (với micro-animation confirm). Hoặc ít nhất: resolved card là tappable, tap vào = next. Không cần button riêng.

### 6.6. Fix hardcoded colors — dùng semantic tokens
**WHY:** Golden Rule #1. Dark mode sẽ hỏng.

**Cách sửa:**
- `bg-[#FFF0F2] text-[#E31837]` → tạo token `--badge-vsp-bg` / `--badge-vsp-text`
- `bg-[#EEF2FF] text-[#4F46E5]` → tạo token `--badge-bank-bg` / `--badge-bank-text`
- `style={{ backgroundColor, color }}` trên BankLogo → dùng token hoặc ít nhất `className` with CSS variable

### 6.7. Bỏ border-b giữa bank items trong destination picker (nếu giữ picker)
**WHY:** Principle 1. Dùng spacing thay border.

### 6.8. Thêm QR scan button trên entry page
**WHY:** MoMo, ZaloPay đều có. Scan QR = paste STK tự động. Table stakes cho fintech VN.

---

## Tổng kết

| Hạng mục | Điểm | Ghi chú |
|---|---|---|
| Flow logic | 3/10 | 2 search bar conflict, destination picker thừa, back nav broken |
| Cognitive load | 4/10 | User phải suy nghĩ quá nhiều cho 1 action đơn giản |
| Visual/Token compliance | 5/10 | Hardcoded colors, inline styles, border violations |
| Competitive parity | 3/10 | Thiếu auto-detect bank, QR, smart keyboard, recent row |
| Progressive disclosure | 4/10 | Default state dump 11 items, badges thừa |

### Verdict: REWORK

Flow này cần redesign lại từ IA level, không phải fix CSS. Vấn đề gốc: **cố nhét quá nhiều chức năng vào 1 page** (search + hub cards + saved list + sheet search + sheet P2P + sheet bank + destination picker). Kết quả: user không biết bắt đầu từ đâu.

**Nguyên tắc sửa:** "Mày là user, mày có hiểu cái này không?" — Nếu phải giải thích flow bằng lời thì flow đã fail.

---

*Reviewed by Đức — 2026-03-09*

---
Back: [[features/index|Features]] · [[features/chuyen-tien/status|chuyen-tien]]
