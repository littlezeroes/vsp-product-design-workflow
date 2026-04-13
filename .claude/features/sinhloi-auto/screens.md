# Sinh loi tu dong — Screen Breakdown

> **Author:** Ivy (UI Designer / Builder)
> **Date:** 2026-03-22
> **Status:** Draft v1.0
> **Ref:** `flow.md`, `analysis.md`, `brd-raw.md`

---

## Tong quan

- **20 screens** across 4 epics
- **VSP Components:** Header, Button, ButtonGroup, BottomSheet, Dialog, FeedbackState, ItemList/ItemListItem, TextField, Checkbox, InformMessage, ToastBar, Tip

### Route Map — Existing vs New

| # | Screen | Route | Status |
|---|--------|-------|--------|
| 1 | Product Intro | `/sinhloi/intro` | DA CO |
| 2 | Confirm Activation | `/sinhloi/activate` | DA CO |
| 3 | OTP | `/sinhloi/otp` | DA CO |
| 4 | Result — Activation Success | `/sinhloi/result-activate` | DA CO |
| 5 | Result — Activation Failed | `/sinhloi/result-activate` | DA CO (query param) |
| 6 | Dashboard — Tab San pham | `/sinhloi/dashboard` | DA CO |
| 7 | Dashboard — Tab Quan ly | `/sinhloi/dashboard?tab=manage` | CAN THEM tab |
| 8 | Deposit (Nap tien) | `/sinhloi/deposit-withdraw?tab=deposit` | DA CO |
| 9 | Withdraw (Rut tien) | `/sinhloi/deposit-withdraw?tab=withdraw` | DA CO |
| 10 | Confirm Transaction (Deposit) | `/sinhloi/confirm-tx?type=deposit` | DA CO |
| 11 | Confirm Transaction (Withdraw) | `/sinhloi/confirm-tx?type=withdraw` | DA CO |
| 12 | Result — Transaction Success | `/sinhloi/result-tx/[type]?status=success` | DA CO |
| 13 | Result — Transaction Processing | `/sinhloi/result-tx/[type]?status=processing` | DA CO |
| 14 | Result — Transaction Failed | `/sinhloi/result-tx/[type]?status=failed` | DA CO |
| 15 | Transaction History | `/sinhloi/history` | DA CO |
| 16 | Transaction Detail | `/sinhloi/history/[id]` | DA CO |
| 17 | Profit Summary | `/sinhloi/profit` | DA CO |
| 18 | Terms & Conditions | `/sinhloi/terms` | DA CO |
| 19 | Cancel Confirmation | `/sinhloi/cancel` | DA CO |
| 20 | Cancel Result | `/sinhloi/result-cancel` | DA CO |

**Tat ca routes da co.** Khong can tao route moi. Chi can bo sung states va refine UI.

---

## Epic 1 — Dang ky Sinh loi

---

### Screen 1: Product Intro
- **Route:** `/sinhloi/intro`
- **Epic:** 1
- **Entry from:** Homepage (tap "Sinh loi"), Deep link
- **Exit to:** Screen 2 (Confirm Activation), Homepage (quay ve), eKYC flow
- **Components used:** Header, Button, BottomSheet, Dialog, FeedbackState, InformMessage

#### States:
| State | Condition | Visual Description |
|-------|-----------|-------------------|
| Default | User da eKYC, chua kich hoat | Hero illustration + 3 USP bullets (Lai suat X%/nam, Rut tuc thi, Toi da 100M) + Button primary "Kich hoat ngay" |
| Loading | Dang kiem tra trang thai eKYC/activation | Skeleton placeholder cho hero + content area |
| Error — Network | API fail khi load thong tin san pham | FeedbackState: icon wifi-off, "Khong the tai thong tin", "Vui long thu lai", Button "Thu lai" |
| eKYC Required | User chua hoan tat eKYC | Dialog: title "Xac thuc danh tinh", desc "Ban can hoan tat eKYC de su dung Sinh loi", primary "Xac thuc ngay" → eKYC, secondary "De sau" → Homepage |
| Already Activated | User da kich hoat (deep link hoac re-visit) | Redirect tu dong sang `/sinhloi/dashboard` — khong hien thi screen nay |
| Rate Changed | Lai suat da cap nhat since last visit | InformMessage banner: "Lai suat da cap nhat: X%/nam" hien o top duoi NavBar |
| Re-activation | User da huy truoc do, dang ky lai | Giong Default nhung co banner nho: "Chao mung ban quay lai!" |

#### Content Spec:
- **NavBar:** `variant="default"`, title="Sinh loi", leading=ChevronLeft (back to homepage)
- **Sections:**
  1. Hero illustration (svg/image) + tagline "Tien nhan roi, sinh loi moi ngay"
  2. USP cards (3 items): Lai suat canh tranh X%/nam | Rut tuc thi, khong mat phi | Toi da 100 trieu dong
  3. Provider info: "Doi tac tai chinh: [Ten doi tac]" + logo
  4. How it works: 3 buoc — Kich hoat → Nap tien → Nhan lai moi ngay
- **Actions:** Button primary "Kich hoat ngay" (fixed bottom)
- **Validation:** Check eKYC status truoc khi cho tap "Kich hoat ngay"

---

### Screen 2: Confirm Activation (Xac nhan kich hoat)
- **Route:** `/sinhloi/activate`
- **Epic:** 1
- **Entry from:** Screen 1 (Product Intro)
- **Exit to:** Screen 3 (OTP), Screen 1 (back)
- **Components used:** Header, Button, Checkbox, BottomSheet, ToastBar

#### States:
| State | Condition | Visual Description |
|-------|-----------|-------------------|
| Default (unchecked) | Vua vao, chua tick checkbox | Thong tin readonly (Ho ten, SDT, CCCD) + 2 checkbox unchecked + Button "Kich hoat" disabled (secondary style) |
| Partial checked | Tick 1 trong 2 checkbox | Button van disabled |
| Valid (both checked) | Ca 2 checkbox da tick | Button "Kich hoat" enabled (primary style) |
| Loading | Dang gui OTP | Button hien spinner + text "Dang xu ly...", disabled. Toan bo form readonly |
| Error — OTP send fail | API gui OTP that bai | ToastBar: "Khong gui duoc ma OTP. Vui long thu lai." Quay ve state Valid |
| Error — Network | Mat mang khi gui OTP | ToastBar: "Khong co ket noi mang. Vui long kiem tra lai." |
| Terms detail | Tap link "Dieu khoan su dung" | BottomSheet: noi dung dieu khoan tom tat (3-5 bullets) + link "Xem day du" |
| Policy detail | Tap link "Chinh sach bao mat" | BottomSheet: noi dung chinh sach |

#### Content Spec:
- **NavBar:** `variant="default"`, title="Xac nhan kich hoat", leading=ChevronLeft
- **Sections:**
  1. `pt-[32px]` — Thong tin ca nhan (readonly fields):
     - Ho ten: `MOCK_USER.fullName`
     - So dien thoai: `MOCK_USER.phone` (masked: 091****678)
     - CCCD: `MOCK_USER.cccd` (masked: 0123****8901)
  2. `pt-[32px]` — Dong y dieu khoan:
     - Checkbox 1: "Toi dong y voi [Dieu khoan su dung]" (link underline)
     - Checkbox 2: "Toi hieu loi nhuan la tam tinh va co the thay doi"
  3. `pt-[32px]` — Tom tat san pham:
     - Lai suat: 4.5%/nam
     - Han muc: Toi da 100.000.000d
     - Rut tien: Tuc thi, khong mat phi
- **Actions:** Button primary "Kich hoat" (fixed bottom), disabled khi chua tick du 2 checkbox
- **Validation:** Ca 2 checkbox phai checked. Double-tap prevention: disable button sau first tap.

---

### Screen 3: OTP
- **Route:** `/sinhloi/otp?context=activate`
- **Epic:** 1
- **Entry from:** Screen 2 (Confirm Activation), Screen 10/11 (Confirm Transaction — nap/rut), Screen 19 (Cancel)
- **Exit to:** Screen 4/5 (Result Activation), Screen 12-14 (Result Transaction), Screen 20 (Cancel Result), Screen 2 (back)
- **Components used:** Header, Button, ToastBar

#### States:
| State | Condition | Visual Description |
|-------|-----------|-------------------|
| Sent (empty) | OTP da gui, countdown 60s, user chua nhap | 6 o input trong, countdown "Gui lai sau 59s", SDT masked "Ma OTP da gui den 091****678" |
| Entering | User dang nhap (1-5 ky tu) | Cac o da nhap hien so, o hien tai co cursor blink |
| Verifying | User nhap du 6 so, auto submit | Loading spinner nho tren form, input disabled |
| Success | OTP dung, API tra 200 | Chuyen man hinh (khong hien thi gi o OTP screen) — navigate to Result |
| Error — Wrong OTP | OTP sai | Clear input, text do "Ma OTP khong chinh xac. Vui long thu lai." Dem so lan sai (max 3) |
| Error — Wrong OTP (lan 2) | Sai lan 2 | Giong tren nhung hien "Ban con 1 lan thu" |
| Error — Wrong OTP (lan 3) | Sai lan 3 | Chuyen sang Locked state |
| Expired | Countdown = 0, user chua nhap du | Input disabled, text "Ma OTP da het han", Button "Gui lai" hien |
| Resending | Tap "Gui lai" | Loading inline, countdown reset |
| Locked | Gui lai > 3 lan HOAC sai OTP 3 lan | Text: "Ban da thu qua nhieu lan. Vui long thu lai sau 5 phut.", input disabled, khong co button "Gui lai" |
| Error — Network | Mat mang khi verify OTP | ToastBar: "Loi mang. Vui long kiem tra ket noi." Input giu nguyen, khong clear |
| Error — Send fail | API gui OTP that bai | ToastBar: "Khong gui duoc ma OTP." Button "Thu lai" |

#### Content Spec:
- **NavBar:** `variant="default"`, title="Xac thuc OTP", leading=ChevronLeft
- **Sections:**
  1. `pt-[32px]` — Instruction text: "Nhap ma OTP da gui den {masked phone}"
  2. `pt-[16px]` — 6-digit OTP input boxes (auto-focus first box)
  3. `pt-[16px]` — Countdown: "Gui lai sau {seconds}s" (text-foreground-secondary)
  4. Error message (if any): text-danger, duoi OTP boxes
- **Actions:** Auto-submit khi nhap du 6 so. "Gui lai" link khi expired.
- **Validation:** Chi cho nhap so (0-9). Auto-submit. Back button quay ve man hinh truoc, OTP session van valid trong 60s.

---

### Screen 4: Result — Activation Success
- **Route:** `/sinhloi/result-activate?status=success`
- **Epic:** 1
- **Entry from:** Screen 3 (OTP — OTP dung + API 200)
- **Exit to:** Screen 6 (Dashboard)
- **Components used:** Header, Button, FeedbackState

#### States:
| State | Condition | Visual Description |
|-------|-----------|-------------------|
| Success | API kich hoat tra 200 OK | FeedbackState: icon checkmark xanh, title "Kich hoat thanh cong!", desc "Tai khoan sinh loi cua ban da san sang. Nap tien de bat dau sinh loi ngay.", Button primary "Ve Dashboard" |
| Loading | Dang doi API response | Skeleton/spinner centered |

#### Content Spec:
- **NavBar:** An NavBar (full screen result)
- **Sections:**
  1. Center screen: Icon success (checkmark circle, bg-success) + Title + Description
  2. Chi tiet: Lai suat 4.5%/nam | Han muc: 100.000.000d
- **Actions:** Button primary "Ve Dashboard" → navigate `/sinhloi/dashboard`. Button secondary "Nap tien ngay" → navigate `/sinhloi/deposit-withdraw?tab=deposit`
- **Validation:** Khong cho back ve OTP screen (replace history)

---

### Screen 5: Result — Activation Failed
- **Route:** `/sinhloi/result-activate?status=failed`
- **Epic:** 1
- **Entry from:** Screen 3 (OTP — API error)
- **Exit to:** Screen 2 (Thu lai), Homepage
- **Components used:** Header, Button, FeedbackState

#### States:
| State | Condition | Visual Description |
|-------|-----------|-------------------|
| Failed (retryable) | API tra loi that bai (500, timeout) | FeedbackState: icon X do, title "Kich hoat that bai", desc "Da xay ra loi. Vui long thu lai.", Button primary "Thu lai", Button secondary "Ve trang chu" |
| Failed (non-retryable) | Loi nghiem trong (da kich hoat o noi khac, tai khoan bi khoa) | FeedbackState: icon X do, title "Khong the kich hoat", desc "[Chi tiet loi]", Chi co Button "Ve trang chu" |
| Processing | API timeout, khong biet ket qua | FeedbackState: icon clock vang, title "Dang xu ly", desc "Yeu cau kich hoat dang duoc xu ly. Vui long kiem tra lai sau.", Button "Ve trang chu" |

#### Content Spec:
- **NavBar:** An NavBar
- **Sections:** Center screen: icon + title + description + error code (neu co)
- **Actions:** "Thu lai" → navigate back to `/sinhloi/activate`. "Ve trang chu" → navigate `/`
- **Validation:** Replace history, khong cho back ve OTP

---

## Epic 2 — Quan ly Sinh loi (Dashboard)

---

### Screen 6: Dashboard — Tab San pham
- **Route:** `/sinhloi/dashboard` hoac `/sinhloi/dashboard?tab=product`
- **Epic:** 2
- **Entry from:** Screen 4 (Activation Success), Homepage, Deep link
- **Exit to:** Screen 7 (Tab Quan ly), Screen 8 (Nap tien), Screen 9 (Rut tien), Screen 15 (History), Screen 17 (Profit), Account Detail, Settings, FAQ, Membership, Upgrade
- **Components used:** Header, ButtonGroup, ItemListItem, BottomSheet, Dialog, FeedbackState

#### States:
| State | Condition | Visual Description |
|-------|-----------|-------------------|
| Loading | API dang load du lieu | Skeleton: hero area xam, chart area xam, transaction list xam (3 rows) |
| Loaded | Du lieu san sang | Hero dark (so du + lai suat + loi hom qua), Interest card (chart 7 ngay), GD gan nhat (3 items), Kham pha section |
| Balance Hidden | User tap icon eye | So du hien "********", loi hom qua "****", tong loi "****", chart bars van hien nhung khong co so |
| Zero Balance | So du = 0 (vua kich hoat) | So du hien "0 d", FeedbackState thay cho GD list: "Nap tien de bat dau sinh loi" + CTA "Nap tien ngay", chart hidden |
| Error | API fail | FeedbackState full screen: "Khong the tai thong tin" + Button "Thu lai" |
| Refreshing | Pull to refresh | Loading indicator o top, data re-fetch |
| Rate Banner | Lai suat da thay doi | InformMessage banner duoi NavBar: "Lai suat da cap nhat: X%/nam tu [ngay]" |
| Deep link (chua kich hoat) | User chua kich hoat nhung truy cap URL | Redirect sang `/sinhloi/intro` |

#### Content Spec:
- **NavBar:** `variant="default"`, title="Sinh loi", leading=ChevronLeft (back to homepage)
- **Sections:**
  1. Hero dark (bg-foreground): So du sinh loi (32px bold), eye toggle, "+X d hom qua | Tong loi: +Y d", "Lai suat Z%/nam"
  2. Quick action chips: "Nang cap lai suat" | "+ Nap/Rut" | "Cai dat"
  3. White card overlap (-mt-[32px]): Loi hom qua + Tong loi + Chart 7 ngay
  4. `pt-[32px]` — Giao dich gan nhat (3 items) + "Xem tat ca" link
  5. `pt-[32px]` — Nudge CTA card: "Nho chuyen them vao Vi sinh loi" + "Nap ngay"
  6. `pt-[32px]` — Upgrade tier card
  7. `pt-[32px]` — Kham pha grid (2 cols): Hang thanh vien, Co che sinh loi
  8. `pt-[32px]` — Tim hieu them (3 icons): Ngay nhan loi, Quyen loi TK, Cau hoi
  9. `pt-[32px]` — Rating card
  10. `pt-[32px]` — Bottom links: Dieu khoan, FAQ, Cai dat
- **Actions:** ButtonGroup fixed bottom: "Nap tien" (primary) + "Rut tien" (secondary). Rut khi zero balance → Dialog "Chua co so du"
- **Validation:** Balance hidden state persist qua sessions (localStorage)

---

### Screen 7: Dashboard — Tab Quan ly
- **Route:** `/sinhloi/dashboard?tab=manage`
- **Epic:** 2
- **Entry from:** Screen 6 (Tab San pham — chuyen tab)
- **Exit to:** Screen 6 (Tab San pham), Screen 15 (History), Screen 17 (Profit), Screen 18 (Terms), Screen 19 (Cancel)
- **Components used:** Header, ItemListItem, Dialog

#### States:
| State | Condition | Visual Description |
|-------|-----------|-------------------|
| Default | Tab Quan ly active | List cac muc: Dieu khoan & Hop dong, Lich su giao dich, Tong ket loi nhuan, Huy dang ky |
| Loading | Dang load | Skeleton list 4 rows |
| Error | API fail | FeedbackState: "Khong the tai thong tin" + "Thu lai" |
| Cancel blocked — balance > 0 | Tap "Huy dang ky" khi so du > 0 | Dialog: "Vui long rut het tien truoc khi huy", primary "Rut tien" → deposit-withdraw, secondary "Dong" |
| Cancel blocked — pending tx | Tap "Huy dang ky" khi co GD pending | Dialog: "Co giao dich dang xu ly, vui long doi hoan tat", primary "Xem giao dich" → history filter pending, secondary "Dong" |

#### Content Spec:
- **NavBar:** Dung chung voi Tab San pham, chi doi tab indicator
- **Sections:**
  1. Tab switcher: San pham | Quan ly (pill toggle, giong deposit-withdraw)
  2. `pt-[32px]` — Menu list:
     - Dieu khoan & Hop dong (icon FileText, chevron right) → `/sinhloi/terms`
     - Lich su giao dich (icon Clock, chevron right) → `/sinhloi/history`
     - Tong ket loi nhuan (icon TrendingUp, chevron right) → `/sinhloi/profit`
     - Huy dang ky (icon XCircle, text-danger, chevron right) → check balance/pending truoc
- **Actions:** Moi row la navigable (onPress)
- **Validation:** Check balance va pending truoc khi cho vao flow huy

---

## Epic 3 — Nap/Rut tien

---

### Screen 8: Deposit (Nap tien)
- **Route:** `/sinhloi/deposit-withdraw?tab=deposit`
- **Epic:** 3
- **Entry from:** Screen 6 (Dashboard — tap "Nap tien"), Screen 12 (Success — "Nap them")
- **Exit to:** Screen 10 (Confirm Deposit), Screen 6 (back), Screen 9 (switch tab)
- **Components used:** Header, Button, Dialog, InformMessage

#### States:
| State | Condition | Visual Description |
|-------|-----------|-------------------|
| Empty | Vua vao, chua nhap gi | Input hien "0" placeholder, so du vi VSP duoi input, quick chips (500k, 1tr, 5tr, 10tr), uoc tinh lai = "--", Button "Tiep tuc" disabled |
| Typing | User dang nhap so tien | So tien format realtime (1.000.000), uoc tinh lai cap nhat realtime |
| Valid | So tien hop le | Button "Tiep tuc" enabled (primary), uoc tinh lai/ngay va lai/thang hien duoi input |
| Invalid — Zero | So tien = 0 | Button disabled, khong hien error (giong empty) |
| Invalid — Exceed wallet | So tien > so du vi VSP | Inline error text-danger: "So du vi khong du" duoi input. Hien so du vi con lai. Button disabled |
| Invalid — Exceed max | Tong so du SL + so tien > 100M | Inline error: "Vuot han muc toi da 100.000.000d. Co the nap them: {remaining}d" Button disabled |
| Invalid — Exceed monthly | Vuot han muc thang | Inline error: "Da dat han muc nap thang. Thu lai tu {ngay 1 thang sau}" Button disabled |
| Quick chip selected | Tap 1 chip (VD: 5tr) | Fill so tien = 5.000.000, auto validate, highlight chip dang chon |
| Quick chip exceed | Tap chip > balance | Fill so tien nhung hien error ngay |
| Loading | Tap "Tiep tuc" | Button hien spinner, navigate to Confirm |
| Wallet empty | So du vi VSP = 0 | InformMessage: "So du vi khong du. Nap tien vao vi truoc." + link "Nap vi" |
| Tab switch from Rut | Dang o tab Rut, chuyen sang Nap | Reset input ve empty state |

#### Content Spec:
- **NavBar:** `variant="default"`, title="Nap tien", leading=ChevronLeft
- **Sections:**
  1. Tab switcher (pill toggle): Nap | Rut
  2. `pt-[32px]` — Amount display (big number, center): "0" placeholder hoac so da nhap
  3. `pt-[8px]` — So du vi: "So du Vi V-Smart Pay: {balance}d"
  4. `pt-[16px]` — Quick amount chips: 500k | 1tr | 5tr | 10tr (horizontal scroll)
  5. `pt-[16px]` — Uoc tinh lai: "Lai uoc tinh/ngay: +X d" va "Lai uoc tinh/thang: +Y d"
  6. Error message inline (text-danger) neu invalid
  7. Numpad (custom, BIDV pattern)
- **Actions:** Button primary "Tiep tuc" (fixed bottom, disabled khi invalid/empty)
- **Validation:**
  - amount != 0
  - amount <= MOCK_USER.walletBalance
  - MOCK_BALANCE.balance + amount <= SINHLOI_CONFIG.maxBalance (100M)
  - amount <= SINHLOI_CONFIG.monthlyDepositLimit (100M/thang)
  - Currency format: `vi-VN` locale
  - Double-tap prevention

---

### Screen 9: Withdraw (Rut tien)
- **Route:** `/sinhloi/deposit-withdraw?tab=withdraw`
- **Epic:** 3
- **Entry from:** Screen 6 (Dashboard — tap "Rut tien"), Screen 7 (Cancel blocked → rut truoc)
- **Exit to:** Screen 11 (Confirm Withdraw), Screen 6 (back), Screen 8 (switch tab)
- **Components used:** Header, Button, Dialog, InformMessage

#### States:
| State | Condition | Visual Description |
|-------|-----------|-------------------|
| Empty | Vua vao, chua nhap | Input "0", so du sinh loi hien thi, uoc tinh lai bi giam = "--", Button disabled |
| Typing | User dang nhap | So tien format realtime, uoc tinh lai bi giam cap nhat |
| Valid | Hop le | Button "Tiep tuc" enabled, uoc tinh "Lai bi giam/ngay: -X d" |
| Invalid — Zero | So tien = 0 | Button disabled |
| Invalid — Exceed SL balance | So tien > so du sinh loi | Inline error: "So du sinh loi khong du" |
| Invalid — Exceed daily limit | So tien > 30M/ngay | Inline error: "Vuot han muc rut 30.000.000d/ngay. Han muc con lai: {remaining}d" |
| Invalid — Partial daily limit | Da rut 1 phan limit hom nay | Hien han muc con lai: "Han muc rut hom nay: {remaining}d" duoi so du |
| Quick chip selected | Tap chip | Fill amount, auto validate |
| Rut toan bo | User nhap so tien = toan bo so du | Warning: "Ban se mat tien lai hom nay: {estimated_lost}d". Button van enabled |
| Loading | Tap "Tiep tuc" | Button spinner |
| Tab switch from Nap | Dang o Nap, chuyen sang Rut | Reset input |
| Prefill full balance | Tu Cancel flow (so du > 0 → rut truoc) | Auto fill so du max, ready to confirm |

#### Content Spec:
- **NavBar:** `variant="default"`, title="Rut tien", leading=ChevronLeft
- **Sections:** Giong Screen 8 nhung:
  1. Tab "Rut" active
  2. So du hien thi: "So du sinh loi: {balance}d" (thay vi so du vi)
  3. Uoc tinh: "Lai bi giam/ngay: -X d" (thay vi lai them)
  4. Warning khi rut toan bo
- **Actions:** Button primary "Tiep tuc"
- **Validation:**
  - amount != 0
  - amount <= MOCK_BALANCE.balance
  - amount <= SINHLOI_CONFIG.dailyWithdrawLimit (30M)
  - amount <= remaining daily limit (30M - da rut hom nay)

---

### Screen 10: Confirm Transaction (Deposit)
- **Route:** `/sinhloi/confirm-tx?type=deposit&amount={amount}`
- **Epic:** 3
- **Entry from:** Screen 8 (Deposit — tap "Tiep tuc")
- **Exit to:** Screen 3 (OTP) hoac Auth (biometric), Screen 8 (back)
- **Components used:** Header, Button, ItemListItem, InformMessage

#### States:
| State | Condition | Visual Description |
|-------|-----------|-------------------|
| Default | Hien chi tiet giao dich | Toan bo thong tin nap: So tien, Tu: Vi V-Smart Pay, Lai uoc tinh/ngay, Lai uoc tinh/thang. Button "Xac nhan" |
| Loading | Tap "Xac nhan", dang gui request | Button spinner, form readonly |
| Stale | User o man hinh qua 5 phut | InformMessage: "Thong tin co the da thay doi. Vui long kiem tra lai." + re-fetch data |
| Rate changed | Lai suat thay doi giua luc dang confirm | InformMessage warning: "Lai suat da cap nhat tu X% → Y%" Hien lai moi |
| Error — Network | Mat mang khi confirm | Dialog: "Mat ket noi mang. Thu lai khi co mang." primary "Thu lai", secondary "Huy" |

#### Content Spec:
- **NavBar:** `variant="default"`, title="Xac nhan nap tien", leading=ChevronLeft
- **Sections:**
  1. `pt-[32px]` — So tien nap (big number, center, bold)
  2. `pt-[32px]` — Chi tiet:
     - Tu: Vi V-Smart Pay (icon wallet)
     - Den: Vi sinh loi
     - Lai uoc tinh/ngay: +X d
     - Lai uoc tinh/thang: +Y d
  3. `pt-[16px]` — Disclaimer: "Loi nhuan la tam tinh va co the thay doi"
- **Actions:** Button primary "Xac nhan" (fixed bottom)
- **Validation:** Double-tap prevention. Timeout check (5 phut → re-validate)

---

### Screen 11: Confirm Transaction (Withdraw)
- **Route:** `/sinhloi/confirm-tx?type=withdraw&amount={amount}`
- **Epic:** 3
- **Entry from:** Screen 9 (Withdraw — tap "Tiep tuc")
- **Exit to:** Screen 3 (OTP) hoac Auth (biometric), Screen 9 (back)
- **Components used:** Header, Button, ItemListItem, InformMessage

#### States:
| State | Condition | Visual Description |
|-------|-----------|-------------------|
| Default | Hien chi tiet rut | So tien rut, Ve: Vi V-Smart Pay, So du SL sau rut, Lai bi giam uoc tinh. Button "Xac nhan" |
| Loading | Dang xu ly | Button spinner |
| Stale | > 5 phut | InformMessage re-fetch |
| Error — Network | Mat mang | Dialog retry |

#### Content Spec:
- **NavBar:** `variant="default"`, title="Xac nhan rut tien", leading=ChevronLeft
- **Sections:**
  1. `pt-[32px]` — So tien rut (big number, bold)
  2. `pt-[32px]` — Chi tiet:
     - Tu: Vi sinh loi
     - Ve: Vi V-Smart Pay (icon wallet)
     - So du SL sau rut: {balance - amount}d
     - Lai bi giam/ngay: -X d
  3. `pt-[16px]` — Note: "Tien se ve Vi V-Smart Pay ngay lap tuc"
- **Actions:** Button primary "Xac nhan"
- **Validation:** Giong Screen 10

---

### Screen 12: Result — Transaction Success
- **Route:** `/sinhloi/result-tx/deposit?status=success&amount={amount}` hoac `/sinhloi/result-tx/withdraw?status=success&amount={amount}`
- **Epic:** 3
- **Entry from:** Screen 3 (OTP dung) hoac Auth (biometric thanh cong)
- **Exit to:** Screen 6 (Dashboard), Screen 8 (Nap them)
- **Components used:** Button, ButtonGroup, FeedbackState

#### States:
| State | Condition | Visual Description |
|-------|-----------|-------------------|
| Success — Deposit | Nap thanh cong | FeedbackState: icon check xanh, title "Nap tien thanh cong!", chi tiet: So tien nap, So du moi, Thoi gian. Button primary "Ve Dashboard" + secondary "Nap them" |
| Success — Withdraw | Rut thanh cong | FeedbackState: icon check xanh, title "Rut tien thanh cong!", chi tiet: So tien rut, So du SL con lai, So du vi moi, Thoi gian. Button primary "Ve Dashboard" |

#### Content Spec:
- **NavBar:** An
- **Sections:**
  1. Center: Icon success + Title
  2. Chi tiet card:
     - Deposit: So tien nap | So du sinh loi moi | Thoi gian GD | Ma GD
     - Withdraw: So tien rut | So du SL con lai | So du vi moi | Thoi gian GD | Ma GD
- **Actions:**
  - Deposit: "Ve Dashboard" (primary) + "Nap them" (secondary)
  - Withdraw: "Ve Dashboard" (primary)
- **Validation:** Replace history

---

### Screen 13: Result — Transaction Processing
- **Route:** `/sinhloi/result-tx/[type]?status=processing&amount={amount}`
- **Epic:** 3
- **Entry from:** Screen 3/Auth — API timeout
- **Exit to:** Homepage, Screen 15 (History)
- **Components used:** Button, FeedbackState

#### States:
| State | Condition | Visual Description |
|-------|-----------|-------------------|
| Processing — Deposit | Nap dang xu ly | FeedbackState: icon clock vang, title "Dang xu ly", desc "Giao dich nap tien dang duoc xu ly. Kiem tra lai trong lich su giao dich.", Button "Ve trang chu" |
| Processing — Withdraw | Rut dang xu ly | Tuong tu, desc: "Giao dich rut tien dang duoc xu ly..." |

#### Content Spec:
- **NavBar:** An
- **Sections:** Center: icon warning/clock + title + description + ma GD (neu co)
- **Actions:** "Ve trang chu" (primary) → Homepage. "Xem lich su" (secondary/link) → History
- **Validation:** Replace history

---

### Screen 14: Result — Transaction Failed
- **Route:** `/sinhloi/result-tx/[type]?status=failed&amount={amount}`
- **Epic:** 3
- **Entry from:** Screen 3/Auth — API error
- **Exit to:** Screen 8/9 (Thu lai), Screen 6 (Dashboard)
- **Components used:** Button, ButtonGroup, FeedbackState

#### States:
| State | Condition | Visual Description |
|-------|-----------|-------------------|
| Failed — Deposit (retryable) | Nap that bai, co the thu lai | FeedbackState: icon X do, title "Nap tien that bai", desc "Da xay ra loi...", Button primary "Thu lai" + secondary "Ve Dashboard" |
| Failed — Withdraw (retryable) | Rut that bai | Tuong tu |
| Failed — Non-retryable | Loi nghiem trong (he thong bao tri, tai khoan bi khoa) | Chi co Button "Ve Dashboard" |
| Failed — Maintenance | Provider dang bao tri | FeedbackState: icon wrench, title "He thong dang bao tri", desc "Vui long thu lai sau.", Button "Ve Dashboard" |

#### Content Spec:
- **NavBar:** An
- **Sections:** Center: icon + title + description + error code
- **Actions:**
  - Retryable: "Thu lai" → quay ve input screen. "Ve Dashboard" → dashboard
  - Non-retryable: chi "Ve Dashboard"
- **Validation:** Replace history

---

## Epic 2 (continued) — Lich su & Loi nhuan

---

### Screen 15: Transaction History
- **Route:** `/sinhloi/history`
- **Epic:** 2
- **Entry from:** Screen 6 (Dashboard — "Xem tat ca"), Screen 7 (Tab Quan ly)
- **Exit to:** Screen 16 (Transaction Detail), Screen 6 (back)
- **Components used:** Header, ItemListItem, FeedbackState

#### States:
| State | Condition | Visual Description |
|-------|-----------|-------------------|
| Loading | Dang tai du lieu | Skeleton: filter chips + 5 skeleton rows |
| Loaded | Co data | Monthly stats card (tong nap/rut/lai thang nay) + Filter chips + Danh sach GD grouped by date |
| Empty | Chua co giao dich nao | FeedbackState: icon empty, "Chua co giao dich nao" |
| Filtered — no results | Filter active nhung khong co ket qua | FeedbackState: "Khong tim thay giao dich phu hop" + link "Xoa bo loc" |
| Filtered — has results | Filter active va co ket qua | Hien chi GD matching filter, chip dang chon highlighted |
| Infinite scroll loading | Scroll het page, con data | Spinner o cuoi list, load them 20 items |
| Infinite scroll end | Het data | Footer: "Da hien thi tat ca giao dich" |
| Error | API fail | FeedbackState: "Khong the tai lich su" + "Thu lai" |
| Pull to refresh | Keo xuong | Loading indicator top |

#### Content Spec:
- **NavBar:** `variant="large-title"`, largeTitle="Lich su giao dich", leading=ChevronLeft
- **Sections:**
  1. Monthly stats card: Tong nap | Tong rut | Lai thang nay | Hoan tien
  2. Filter chips (horizontal scroll): Tat ca | Nap tien | Rut tien | Tra lai
  3. Transaction list grouped by date:
     - Date header: "06/03/2026"
     - Row: Icon (deposit=ArrowDownLeft green, withdraw=ArrowUpRight red, interest=TrendingUp green) + Label + Date + Amount + Status badge
  4. Tap row → navigate chi tiet
- **Actions:** Filter chips, tap row → detail, infinite scroll
- **Validation:** Calendar filter max 90 ngay

---

### Screen 16: Transaction Detail
- **Route:** `/sinhloi/history/[id]`
- **Epic:** 2
- **Entry from:** Screen 15 (History — tap 1 GD)
- **Exit to:** Screen 15 (back)
- **Components used:** Header, ItemListItem

#### States:
| State | Condition | Visual Description |
|-------|-----------|-------------------|
| Loading | Dang tai chi tiet | Skeleton |
| Loaded — Success | GD thanh cong | Full detail: Loai GD, So tien, Ngay gio, Trang thai (badge xanh "Thanh cong"), Ma GD, Ghi chu |
| Loaded — Pending | GD dang xu ly | Trang thai badge vang "Dang xu ly" |
| Loaded — Failed | GD that bai | Trang thai badge do "That bai" + Ly do that bai |
| Error | Khong tai duoc | FeedbackState: "Khong the tai chi tiet" + "Thu lai" |

#### Content Spec:
- **NavBar:** `variant="default"`, title="Chi tiet giao dich", leading=ChevronLeft
- **Sections:**
  1. `pt-[32px]` — Icon + So tien (big, center) + Trang thai badge
  2. `pt-[32px]` — Chi tiet rows:
     - Loai giao dich: Nap tien / Rut tien / Tra lai
     - So tien: {formatted}
     - Ngay thuc hien: {date} {time}
     - Trang thai: badge (Thanh cong / Dang xu ly / That bai)
     - Ma giao dich: {id} (copy button)
     - Ghi chu: (neu co)
- **Actions:** Copy ma GD
- **Validation:** None

---

### Screen 17: Profit Summary (Tong ket loi nhuan)
- **Route:** `/sinhloi/profit`
- **Epic:** 2
- **Entry from:** Screen 6 (Dashboard — "Ngay nhan loi"), Screen 7 (Tab Quan ly)
- **Exit to:** Screen 6 (back)
- **Components used:** Header, FeedbackState

#### States:
| State | Condition | Visual Description |
|-------|-----------|-------------------|
| Loading | Dang tai | Skeleton |
| Loaded | Co data | Year selector (2026/2025) + Danh sach thang: Thang X: +Y d, tong ca nam o cuoi |
| Empty | Chua co du lieu (vua kich hoat) | FeedbackState: "Chua co du lieu loi nhuan. Bat dau nap tien de sinh loi!" |
| Error | API fail | FeedbackState + "Thu lai" |
| Current month estimate | Thang hien tai | Badge "Uoc tinh" ben canh so tien (isEstimate: true) |

#### Content Spec:
- **NavBar:** `variant="large-title"`, largeTitle="Tong ket loi nhuan", leading=ChevronLeft
- **Sections:**
  1. Year selector (pill toggle hoac dropdown): 2026 | 2025
  2. `pt-[32px]` — List thang:
     - Row: "Thang {month}" | "+{amount} d" | Badge "Uoc tinh" (neu isEstimate)
     - Thang hien tai highlight (bg-success/5)
  3. `pt-[32px]` — Tong: "Tong nam {year}: +{total} d" (bold, text-success)
  4. `pt-[16px]` — Disclaimer: "Loi nhuan la tam tinh, duoc tinh dua tren so du cuoi ngay"
- **Actions:** Switch year
- **Validation:** None

---

### Screen 18: Terms & Conditions (Dieu khoan & Hop dong)
- **Route:** `/sinhloi/terms`
- **Epic:** 2
- **Entry from:** Screen 7 (Tab Quan ly), Screen 6 (Dashboard bottom links)
- **Exit to:** Screen 7/6 (back)
- **Components used:** Header

#### States:
| State | Condition | Visual Description |
|-------|-----------|-------------------|
| Loading | Dang tai noi dung | Skeleton text blocks |
| Loaded | Noi dung san sang | Full text dieu khoan, scroll doc |
| Error | API fail | FeedbackState: "Khong the tai dieu khoan" + "Thu lai" |

#### Content Spec:
- **NavBar:** `variant="large-title"`, largeTitle="Dieu khoan & Hop dong", leading=ChevronLeft
- **Sections:**
  1. `pt-[32px]` — Thong tin hop dong:
     - Ngay kich hoat: {date}
     - Doi tac: {provider}
     - Lai suat: {rate}%/nam
     - Han muc: {maxBalance}d
  2. `pt-[32px]` — Noi dung dieu khoan (long text, scroll)
  3. `pt-[32px]` — Noi dung chinh sach bao mat (long text)
- **Actions:** Scroll doc. Co the co "Tai ve PDF" button.
- **Validation:** None

---

## Epic 4 — Huy dang ky

---

### Screen 19: Cancel Confirmation (Xac nhan huy)
- **Route:** `/sinhloi/cancel`
- **Epic:** 4
- **Entry from:** Screen 7 (Tab Quan ly — tap "Huy dang ky", so du = 0, khong pending)
- **Exit to:** Screen 3 (OTP — context=cancel), Screen 7 (back)
- **Components used:** Header, Button, ButtonGroup, InformMessage

#### States:
| State | Condition | Visual Description |
|-------|-----------|-------------------|
| Default | So du = 0, khong co GD pending | Warning card (bg-danger/5): "Sau khi huy, tien loi se ngung duoc tinh" + Thong tin: Tong loi nhuan da nhan: +X d + Button "Xac nhan huy" (danger variant) |
| Loading | Dang gui OTP | Button spinner |
| Error — OTP send | Gui OTP that bai | ToastBar: "Khong gui duoc OTP" |
| Error — Network | Mat mang | ToastBar: "Khong co ket noi mang" |

#### Content Spec:
- **NavBar:** `variant="default"`, title="Huy dang ky", leading=ChevronLeft
- **Sections:**
  1. `pt-[32px]` — Warning icon + Title: "Ban chac chan muon huy?"
  2. `pt-[16px]` — InformMessage (type warning): "Sau khi huy dang ky sinh loi:
     - Tien loi se ngung duoc tinh
     - Du lieu lich su van duoc luu
     - Ban co the dang ky lai bat ky luc nao"
  3. `pt-[32px]` — Tong ket:
     - Tong loi nhuan da nhan: +{total} d
     - Lai chua thanh toan thang nay: +{current_month} d (se duoc tra neu du dieu kien)
- **Actions:** Button primary "Xac nhan huy" (bg-danger text) → gui OTP. Button secondary "Quay lai" → back
- **Validation:** Double-tap prevention

---

### Screen 20: Cancel Result (Ket qua huy)
- **Route:** `/sinhloi/result-cancel`
- **Epic:** 4
- **Entry from:** Screen 3 (OTP — context=cancel, OTP dung, API 200)
- **Exit to:** Homepage
- **Components used:** Button, FeedbackState

#### States:
| State | Condition | Visual Description |
|-------|-----------|-------------------|
| Success | Huy thanh cong | FeedbackState: icon check, title "Huy dang ky thanh cong", desc "Tai khoan sinh loi da duoc huy. Tien lai (neu co) se duoc tra vao cuoi thang.", Button "Ve trang chu" |
| Failed (retryable) | API error | FeedbackState: icon X, title "Huy that bai", desc "Da xay ra loi...", Button primary "Thu lai" + secondary "Ve trang chu" |
| Failed (non-retryable) | Loi nghiem trong | Chi co "Ve trang chu" |
| Processing | API timeout | FeedbackState: icon clock, title "Dang xu ly", desc "Yeu cau huy dang duoc xu ly. Kiem tra lai sau.", Button "Ve trang chu" |

#### Content Spec:
- **NavBar:** An
- **Sections:** Center: icon + title + description
- **Actions:**
  - Success: "Ve trang chu" → navigate `/` (clear sinhloi state)
  - Failed retryable: "Thu lai" → `/sinhloi/cancel`
  - Processing: "Ve trang chu" → `/`
- **Validation:** Replace history. Xoa trang thai activation local.

---

## Tong hop Components su dung

| Component | File | Screens su dung |
|-----------|------|-----------------|
| Header | `components/ui/header.tsx` | 1, 2, 3, 6, 7, 8, 9, 10, 11, 15, 16, 17, 18, 19 |
| Button | `components/ui/button.tsx` | 1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 14, 19, 20 |
| ButtonGroup | `components/ui/button-group.tsx` | 6, 12, 14, 19, 20 |
| BottomSheet | `components/ui/bottom-sheet.tsx` | 1, 2, 6 |
| Dialog | `components/ui/dialog.tsx` | 1, 6, 7, 8, 10, 11 |
| FeedbackState | `components/ui/feedback-state.tsx` | 1, 4, 5, 6, 7, 12, 13, 14, 15, 16, 17, 20 |
| ItemListItem | `components/ui/item-list.tsx` | 6, 7, 10, 11, 15, 16 |
| TextField | `components/ui/text-field.tsx` | (numpad custom thay the, nhung co the dung cho search/filter) |
| Checkbox | `components/ui/checkbox.tsx` | 2 |
| InformMessage | `components/ui/inform-message.tsx` | 1, 6, 8, 9, 10, 11, 19 |
| ToastBar | `components/ui/toast-bar.tsx` | 2, 3, 19 |
| Tip | `components/ui/tip.tsx` | (co the dung cho tooltips tren Dashboard) |

---

## State Count Summary

| Screen | Total States |
|--------|-------------|
| S1: Product Intro | 7 |
| S2: Confirm Activation | 8 |
| S3: OTP | 12 |
| S4: Result — Success | 2 |
| S5: Result — Failed | 3 |
| S6: Dashboard — Tab San pham | 8 |
| S7: Dashboard — Tab Quan ly | 5 |
| S8: Deposit | 12 |
| S9: Withdraw | 12 |
| S10: Confirm Deposit | 5 |
| S11: Confirm Withdraw | 4 |
| S12: Result — TX Success | 2 |
| S13: Result — TX Processing | 2 |
| S14: Result — TX Failed | 4 |
| S15: Transaction History | 9 |
| S16: Transaction Detail | 5 |
| S17: Profit Summary | 5 |
| S18: Terms & Conditions | 3 |
| S19: Cancel Confirmation | 4 |
| S20: Cancel Result | 4 |
| **TONG** | **116 states** |

---

## Ghi chu cho Ivy (implementation)

1. **Tat ca routes da ton tai** — khong can tao folder moi. Chi can update code trong cac file hien co.
2. **Tab Quan ly (Screen 7)** — can them tab switcher vao Dashboard page hien tai. Co the dung cung TabSwitcher component tu deposit-withdraw.
3. **OTP screen** da co, nhung can bo sung states: locked, network error, resending.
4. **Result screens** da co pattern chung — dung FeedbackState component + Button/ButtonGroup.
5. **Cancel flow (Screen 19, 20)** — da co route `/sinhloi/cancel` va `/sinhloi/result-cancel`. Can implement UI.
6. **Auth screen** (`/sinhloi/auth`) — da co route cho biometric/PIN, dung truoc OTP fallback.
7. **Numpad** — da implement trong deposit-withdraw, reuse cho moi input so tien.
8. **Data constraints** — tat ca tu `SINHLOI_CONFIG` trong `data.ts`: interestRate=4.5, maxBalance=100M, dailyWithdrawLimit=30M, monthlyDepositLimit=100M.

---

*Ivy — UI Designer / Builder | V-Smart Pay Team*

---
Back: [[features/index|Features]] · [[features/sinhloi-auto/status|sinhloi-auto]]
