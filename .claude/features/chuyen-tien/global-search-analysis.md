# Global Search — Phân tích UX
> Nate | 2026-03-09
> "Khoan, case này chưa cover nè"

---

## 1. Đánh giá hiện tại

### Điểm mạnh
- **Smart detection** hoạt động tốt: phân biệt SĐT (bắt đầu 0) vs STK (không bắt đầu 0) vs tên (có chữ cái) — logic rõ ràng, không cần user chọn manual.
- **Danh bạ ví VSP** là ý tưởng đúng: user chuyển tiền thường xuyên cho contacts đã có ví, đưa lên đầu là hợp lý.
- **Highlight text** khi search — giúp user confirm kết quả đúng.
- **Paste button** trên search bar — shortcut tốt cho use case copy STK từ chat.
- **DetectBadge** ("SĐT -> Ví VSP", "STK -> Ngân hàng") — giúp user hiểu hệ thống đang interpret input gì.

### Điểm yếu (PO nói "chưa đẹp" — đây là lý do)

1. **Search sống trong BottomSheet — sai container.** BottomSheet là cho action ngắn (chọn 1 option, confirm). Search là exploration — cần full-screen. User gõ search trong sheet bị chật, scroll bị conflict giữa sheet drag và list scroll, keyboard đẩy sheet lên trông lộn xộn.

2. **Hai search bar trên cùng 1 flow.** Main page có search input ở giữa content. Tap vào → mở BottomSheet có search input khác. User phải gõ lại hoặc giá trị được pass qua `initialValue` — dù cách nào cũng tạo cảm giác "đang ở đâu?". Vi phạm Don't Make Me Think.

3. **Default state quá tải.** Sheet mở ra hiện cả danh bạ ví VSP (6 contacts) + danh sách đã lưu (5 items) = 11 items cùng lúc. Chưa kể 2 section headers + badges. Cognitive load cao, hierarchy không rõ — user scan không biết bắt đầu từ đâu.

4. **STK Bank Picker là bước thừa.** Khi user paste/gõ STK, hiện ra danh sách 8+ ngân hàng để chọn. Nhưng BRD nói hệ thống tự detect ngân hàng từ STK (BIN lookup). Vậy tại sao lại bắt user chọn manual? Nếu detect được → auto-fill. Nếu không detect được → mới hỏi.

5. **Transition states không mượt.** Từ typing → resolved: không có loading indicator trong search context. User gõ xong SĐT → resolved card xuất hiện đột ngột. Thiếu "Đang tìm..." state.

6. **Saved list hiện 3 dòng info mỗi item** (nickname, tên thật, SĐT/STK). Quá nhiều text. User chỉ cần nhận diện nhanh — nickname + badge type là đủ.

7. **"Chọn nơi nhận ->" link** trên main page khi detect SĐT/STK — UX không rõ ràng. User không biết link này dẫn đi đâu. Nên là action tự động, không phải manual link.

---

## 2. Benchmark

### MoMo (Vietnam — 30M+ users)
- **Search = full-screen page**, không phải sheet.
- Default state: **Recent** (3-5 người gần đây nhất) + search bar. Không dump toàn bộ danh bạ.
- Gõ SĐT → auto-resolve, hiện tên + avatar nếu có MoMo.
- Không cần chọn "Ví MoMo" hay "Ngân hàng" — SĐT = MoMo, STK + chọn bank = ngân hàng. Hai flow tách biệt từ đầu.
- **Key insight:** MoMo tách "Chuyển MoMo" và "Chuyển ngân hàng" thành 2 entry point riêng. Không merge.

### ZaloPay (Vietnam — 20M+ users)
- Search cũng full-screen.
- **Danh bạ điện thoại** có badge "ZaloPay" cho contacts đã đăng ký.
- Gõ SĐT → resolve inline, không cần thêm step.
- STK chuyển ngân hàng: nhập STK → chọn ngân hàng → auto-lookup tên. Không có "global search" gộp cả hai.
- **Key insight:** ZaloPay cũng tách flow. "Global search" gộp tất cả là pattern VSP tự chọn — không có ref app nào ở VN làm vậy.

### Revolut (Global — 45M+ users)
- Transfer search: **full-screen** với tabs (Contacts / New).
- Contacts tab: danh sách người đã chuyển, sorted by recent.
- New tab: nhập account details (IBAN/phone).
- Search bar filter trên contacts — không filter across types.
- **Key insight:** Tách "người đã biết" (contacts) và "người mới" (nhập thông tin) thành 2 tabs. Không trộn.

### Cash App (US — 55M+ users)
- "$cashtag" hoặc phone number trên cùng 1 input.
- **Nhưng:** Cash App chỉ có 1 loại transfer (P2P qua $cashtag). Không có bank transfer trong cùng flow.
- Recent contacts hiện dạng horizontal scroll avatars — nhỏ gọn, không chiếm space.
- **Key insight:** Single-purpose search works BECAUSE there's only 1 destination type.

### Kết luận benchmark
- **Không app nào gộp P2P + bank transfer vào 1 search box.** VSP đang cố làm "Universal Search" nhưng pattern này tạo complexity không cần thiết.
- **Search luôn full-screen**, không bao giờ trong BottomSheet.
- **Recent/Frequent contacts** luôn ưu tiên hơn full danh bạ.

---

## 3. Vấn đề cụ thể

### 3.1 Hierarchy sai
| Vấn đề | Chi tiết |
|---|---|
| Danh bạ ví VSP vs Đã lưu | Cả hai hiện cùng lúc, cùng visual weight. User không biết nên scan nhóm nào trước. |
| Badge đếm (`6`, `5`) | Số đếm không giúp gì — user không cần biết có bao nhiêu contact, chỉ cần tìm đúng người. |
| Section headers UPPERCASE | `DANH BẠ VÍ VSP`, `ĐÃ LƯU` — uppercase + tracking tạo cảm giác "label hệ thống", không thân thiện. |

### 3.2 Cognitive load
| Vấn đề | Chi tiết |
|---|---|
| 3 dòng text mỗi saved item | nickname + tên thật + sub (SĐT/STK + bank). Quá nhiều. Nickname + 1 dòng sub là đủ. |
| DetectBadge xuất hiện/biến mất | Khi gõ → badge "SĐT -> Ví VSP" hiện. Xóa → mất. Flicker gây distraction. |
| Bank picker 8 items | Danh sách 8 ngân hàng khi paste STK. User phải scan 8 options — high friction cho 1 bước lẽ ra auto. |

### 3.3 Transition gaps
| Vấn đề | Chi tiết |
|---|---|
| Main search → Sheet search | Giá trị pass qua `initialValue` nhưng state reset. User mất context. |
| Typing → Resolved | Không có loading state giữa. Resolved card xuất hiện đột ngột. |
| No result → Recovery | "Không tìm thấy" hiện nhưng không có action. User bị stuck — phải tự xóa và gõ lại. |

### 3.4 Edge cases thiếu
| Case | Status |
|---|---|
| Paste SĐT (không chỉ STK) | Thiếu — paste handler chỉ check `\d{3,}`, không phân biệt SĐT bắt đầu 0 |
| Gõ SĐT 10 số đủ → auto-resolve | Thiếu — user phải tap thêm để trigger lookup |
| Network error khi resolve | Thiếu — không có error state trong search context |
| Danh bạ ví VSP = 0 contacts | Thiếu — không có empty state cho section này |
| Trùng contact giữa danh bạ và saved | Thiếu — Phạm Văn Nam xuất hiện ở CẢ HAI section |
| Keyboard dismiss khi scroll list | Thiếu — keyboard vẫn mở khi scroll results |

---

## 4. Đề xuất flow mới

### Nguyên tắc redesign
1. **Bỏ BottomSheet cho search** → dùng inline search trên main page.
2. **Không gộp P2P + bank** vào 1 search — giữ hub cards làm entry point tách biệt.
3. **Search trên main page chỉ filter saved + danh bạ** — không resolve SĐT/STK mới.
4. **Recent contacts** thay thế full danh bạ ở default state.
5. **Auto-resolve** khi input đủ dài (10 số cho SĐT, 8+ số cho STK).

### Flow mới — "Search trên Entry Page"

#### State 1: Default (vừa vào trang)
```
[Header: Chuyển tiền]
[Hub: Đến ví | Đến ngân hàng]        ← giữ nguyên, 2 cards
[Search bar: SĐT hoặc tên người nhận] ← simplified placeholder
[Gần đây (3)]                         ← horizontal avatar row, tap = chuyển ngay
  [avatar1] [avatar2] [avatar3]
[Đã lưu (5)]                          ← vertical list
  [nickname + sub + badge] x5
```
**WHY:**
- Hub cards tách rõ 2 flow (P2P vs Bank) — user không cần suy nghĩ.
- "Gần đây" dạng horizontal avatar = compact, nhận diện nhanh bằng mặt/initials.
- Search bar placeholder chỉ nói "SĐT hoặc tên" — không nhắc STK vì STK thuộc flow "Đến ngân hàng".

#### State 2: Typing (filter inline)
```
[Header: Chuyển tiền]
[Search bar: "Nam" + X]
[Đã lưu]
  [Anh Nam — 0983 882 233 — VSP]      ← filtered, highlighted
  [Nam Đào — 0901 232 512 — VSP]      ← filtered, highlighted
  [Mạnh TCB — sẽ KHÔNG hiện vì không match]
```
**WHY:**
- Filter inline trên chính main page — không mở sheet, không chuyển context.
- Kết quả hiện tức thì khi gõ — real-time filter, không cần Enter.
- Chỉ filter saved list. Danh bạ ví VSP đã merge vào saved (xem giải thích bên dưới).

#### State 3: Không tìm thấy
```
[Header: Chuyển tiền]
[Search bar: "xyzabc" + X]
[Empty: icon + "Không tìm thấy người nhận đã lưu"]
[Link: "Chuyển đến ví mới" | "Chuyển đến ngân hàng"]
```
**WHY:**
- Empty state có escape hatch — 2 link dẫn đến hub flows thay vì dead end.
- User không bao giờ bị stuck.

#### State 4: Hub → P2P Sheet (giữ nguyên)
Tap "Đến ví" → BottomSheet nhập SĐT → resolve → tiếp tục. Flow này đã tốt, không đổi.

#### State 5: Hub → Bank Sheet (giữ nguyên)
Tap "Đến ngân hàng" → BottomSheet nhập STK → auto-detect bank → resolve → tiếp tục. Flow này đã tốt, không đổi.

### Thay đổi quan trọng

#### Bỏ SearchSheetContent hoàn toàn
- Search giờ là inline filter trên main page — không cần sheet riêng.
- Giảm 8 states (sheet-search-*) xuống 0.
- Tổng states giảm từ ~15 xuống ~7.

#### Merge "Danh bạ ví VSP" vào "Đã lưu"
- Hiện tại danh bạ ví VSP là section riêng — gây confusion ("tại sao người này ở đây mà không ở kia?").
- Giải pháp: Lần đầu user chuyển cho 1 contact trong danh bạ VSP → tự động thêm vào "Đã lưu" với badge "VSP".
- Default state không hiện full danh bạ — quá nhiều noise. Chỉ hiện "Gần đây" + "Đã lưu".

#### Thêm "Gần đây" (horizontal avatars)
- 3-5 người chuyển gần nhất.
- Tap avatar → đi thẳng đến Amount page (skip entry form hoàn toàn).
- Pattern: Revolut, MoMo, ZaloPay đều có.
- **WHY:** 80% chuyển tiền là cho người đã chuyển trước đó. 1 tap > 3 taps.

#### Bỏ STK Bank Picker
- Khi user nhập STK trong Bank Sheet → hệ thống tự detect ngân hàng (BIN lookup).
- Nếu detect thành công → auto-fill, không hỏi.
- Nếu detect thất bại → hiện dropdown chọn ngân hàng (nhưng chỉ top 10, có search).
- **WHY:** Bank picker 8 items là step thừa trong 90% cases.

---

## 5. State Diagram

```
ENTRY PAGE
├── [Default]
│   ├── Tap "Đến ví"        → [P2P Sheet: Empty]
│   ├── Tap "Đến ngân hàng" → [Bank Sheet: Empty]
│   ├── Tap recent avatar    → /transfer/amount (direct)
│   ├── Tap saved item       → /transfer/amount (direct)
│   ├── Type in search       → [Filtering]
│   └── Tap "Dán"            → [Filtering] (auto-paste value)
│
├── [Filtering]
│   ├── Has results          → Show filtered saved list
│   ├── No results           → [No Result + escape links]
│   ├── Clear search (X)     → [Default]
│   └── Tap filtered item    → /transfer/amount (direct)
│
├── [No Result]
│   ├── Tap "Chuyển đến ví mới"     → [P2P Sheet: Empty]
│   ├── Tap "Chuyển đến ngân hàng"  → [Bank Sheet: Empty]
│   └── Edit search                  → [Filtering]
│
├── [P2P Sheet]  (BottomSheet — giữ nguyên)
│   ├── Empty       → user nhập SĐT
│   ├── Typing      → partial input
│   ├── Resolving   → loading spinner
│   ├── Resolved    → show name + avatar → Tap "Tiếp tục" → /transfer/amount
│   ├── Not Found   → error + "Mời đăng ký"
│   └── Error       → validation error
│
└── [Bank Sheet]  (BottomSheet — giữ nguyên)
    ├── Empty        → user nhập STK
    ├── Typing       → partial input
    ├── Auto-detect  → bank auto-filled, verifying name
    ├── Resolved     → bank + name confirmed → Tap "Tiếp tục" → /transfer/amount
    ├── No bank match → show bank dropdown (fallback)
    ├── Not Found    → STK invalid
    └── Error        → format error
```

### Transitions quan trọng

| From | Trigger | To | Animation |
|---|---|---|---|
| Default | Gõ ký tự đầu | Filtering | Fade: "Gần đây" ẩn, list filter instant |
| Filtering | Xóa hết text | Default | Fade: "Gần đây" hiện lại |
| Filtering | Tap item | /transfer/amount | Push navigation |
| Default | Tap hub card | P2P/Bank Sheet | Sheet slide up |
| No Result | Tap escape link | P2P/Bank Sheet | Sheet slide up |
| P2P Sheet: Typing | SĐT đủ 10 số | P2P Sheet: Resolving | Auto-trigger, spinner |
| P2P Sheet: Resolving | API trả về | P2P Sheet: Resolved | Fade in resolved card |
| Bank Sheet: Typing | STK >= 8 số + pause 500ms | Bank Sheet: Auto-detect | Auto BIN lookup |

---

## Tóm tắt cho PO

**"Chưa đẹp" vì:**
1. Search trong BottomSheet — chật, lộn xộn khi keyboard mở.
2. Hai search bar (main + sheet) — confusing.
3. Default state dump 11 items — overwhelm.
4. Bank picker 8 options — bước thừa.

**Fix:**
1. Search inline trên main page — bỏ Search Sheet.
2. Thêm "Gần đây" (horizontal avatars) — 1 tap chuyển tiền.
3. Merge danh bạ VSP vào saved — 1 list duy nhất.
4. Auto-detect bank từ STK — bỏ manual picker.
5. Tổng states giảm từ ~15 → ~7.

---

*Nate out. Đợi Đức review.*

---
Back: [[features/index|Features]] · [[features/chuyen-tien/status|chuyen-tien]]
