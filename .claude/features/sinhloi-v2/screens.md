# Screen Breakdown — Sinh loi tu dong v2
> Designer: Ivy | Date: 2026-03-09 | Updated: 2026-03-09 (QA state fix)
> Based on: flow.md v2.1 + decisions.md + answers.md + BRD component tables

---

## Screen 1: Product Page (Gioi thieu + Demo lai)
- **Route:** `/sinhloi`
- **Type:** Marketing / Onboarding
- **UI Ref:** Cash App — one focus per screen, bottom CTA
- **BRD:** AC 1.2.1 + AC 1.2.2
- **Components:**
  | Component | Props | Notes |
  |-----------|-------|-------|
  | Header | variant="large-title", largeTitle="Sinh loi" | leading=ChevronLeft (back ve Home/Tat ca dich vu) |
  | Raw HTML — USP section | 3 USP items (cau hinh tu backend) | px-[22px], space-y-3 |
  | Raw HTML — Thong tin san pham | "So du toi da: X VND", "Rut tien ve vi: X VND/ngay" | text-md font-semibold, gia tri text-foreground |
  | Raw HTML — Demo tinh lai | Section title: "Tinh thu loi nhuan voi lai suat X%" | pt-[32px] |
  | Raw HTML — Progress bar | min=0, max=100tr, step=5tr, default=0 | rounded-full, bg-secondary, thumb bg-foreground |
  | Raw HTML — So tien demo | "So tien trong vi sinh loi: X VND" | text-md, gia tri text-xl font-bold tabular-nums |
  | Raw HTML — Lai du kien | "Tien lai du kien nhan duoc 1 nam: +X VND" | text-success cho gia tri, prefix "+" |
  | Raw HTML — Disclaimer | "San pham hoat dong theo mo hinh cho vay. Lai suat co the thay doi theo thoa thuan voi doi tac." | text-xs text-foreground-secondary, px-[22px] |
  | Button | variant="primary", size="48" | CTA dong: xem States |
  | Home Indicator | w-[139px] h-[5px] bg-foreground | Luon co |
- **States:**
  | State | Trigger | UI Change |
  |-------|---------|-----------|
  | default (da eKYC) | load, user da eKYC | CTA = "Kich hoat sinh loi" (primary, enabled) |
  | default (chua eKYC) | load, user chua eKYC | CTA = "Xac thuc ngay" (primary, enabled) — di vao luong eKYC |
  | dragging | user keo progress bar | So tien demo + lai du kien thay doi realtime (client-side, khong loading) |
  | loading | dang load thong tin san pham | Skeleton cho USP, lai suat, thong tin san pham (<=2s) |
  | error | API load san pham fail | FeedbackState: "Khong the tai thong tin. Vui long thu lai" + CTA "Thu lai" |
  | no-network | mat mang | Dialog: "Khong co ket noi mang. Vui long kiem tra Internet va thu lai" |
  | deep-link-entry | user vao S1 tu deep link (khong qua Home) | Load S1 binh thuong, Header leading back → Home (khong co man hinh truoc trong stack). Neu chua login → chuyen login → redirect lai S1 |
  | rate-changed | lai suat thay doi khi user dang o S1 (push realtime hoac re-fetch) | Banner inline: "Lai suat da duoc cap nhat" (text-foreground-secondary). Lai suat + demo tinh lai tu dong cap nhat. Khong block flow |
- **Transitions:**
  - tap CTA "Kich hoat sinh loi" (da eKYC) → Screen 2 (S2)
  - tap CTA "Xac thuc ngay" (chua eKYC) → Luong eKYC chung VSP → quay lai S1, CTA doi thanh "Kich hoat sinh loi"
  - back (ChevronLeft) → man hinh truoc (Home / Tat ca dich vu)

---

## Screen 2: Xac nhan kich hoat
- **Route:** `/sinhloi/xac-nhan-kich-hoat`
- **Type:** Confirmation
- **UI Ref:** OKX — detail list + checkbox confirmation
- **BRD:** AC 1.3.1
- **Components:**
  | Component | Props | Notes |
  |-----------|-------|-------|
  | Header | variant="default", title="Xac nhan kich hoat sinh loi" | leading=ChevronLeft |
  | ItemListItem | label="Ho va ten", metadata="{fullName}" | Du lieu tu eKYC, khong co chevron |
  | ItemListItem | label="So dien thoai", metadata="{phone}" | Dinh dang 10 so, bat dau bang "0" |
  | ItemListItem | label="Can cuoc cong dan", metadata="{cccd}" | Du lieu tu eKYC |
  | Checkbox | checked={cb1} | "Dong y chinh sach chia se du lieu" — tap link → O4 |
  | Checkbox | checked={cb2} | "Dong y hop dong cho vay voi cong ty ABC" — tap link → O5 |
  | Raw HTML — Disclaimer | "San pham hoat dong theo mo hinh cho vay..." | text-xs text-foreground-secondary |
  | Button | variant="primary", size="48", disabled={!cb1 \|\| !cb2} | "Xac nhan" — fixed bottom |
  | Home Indicator | w-[139px] h-[5px] bg-foreground | |
- **States:**
  | State | Trigger | UI Change |
  |-------|---------|-----------|
  | default | load | 2 checkbox unchecked, button disabled |
  | partial | 1 checkbox checked | Button van disabled |
  | valid | ca 2 checkbox checked | Button enabled |
  | loading | tap "Xac nhan" | Button isLoading, disable double-tap |
  | error | API fail | ToastBar hoac Dialog loi he thong |
  | error-server-20002 | API tra ve error 20002 (500/502/503/504) | Dialog: title="He thong dang ban", body="Dich vu tam thoi gian doan. Vui long thu lai sau it phut." + CTA "Thu lai" (re-call API) + CTA "Dong" (quay ve S1) |
  | no-network | mat mang | Dialog: "Khong co ket noi mang..." |
- **Transitions:**
  - tap "Xac nhan" (valid) → Screen 3 (S3 OTP)
  - tap link dieu khoan → O4 (Full screen Dieu khoan)
  - tap link hop dong → O5 (Full screen Hop dong)
  - back → Screen 1 (S1)

---

## Screen 3: OTP (reuse)
- **Route:** `/sinhloi/otp`
- **Type:** Auth — OTP
- **UI Ref:** OKX — cell boxes, numpad
- **BRD:** AC 1.3.2 + AC 4.1.2
- **(reuse)** Luong OTP chung VSP
- **Components:**
  | Component | Props | Notes |
  |-----------|-------|-------|
  | Header | variant="default", title="Nhap ma OTP" | leading=ChevronLeft |
  | Raw HTML — OTP cells | 6 o input, auto-focus | Cell boxes theo OKX pattern |
  | Raw HTML — Countdown | "Gui lai OTP sau Xs" | text-sm text-foreground-secondary |
  | Button (link) | "Gui lai OTP" | Chi hien khi het countdown |
  | Home Indicator | | |
- **States:**
  | State | Trigger | UI Change |
  |-------|---------|-----------|
  | sent | OTP vua gui | Countdown timer hien, cells empty |
  | entering | user nhap 1-5 so | Cells fill dan |
  | verifying | nhap du 6 so | Auto-submit, loading indicator |
  | correct | OTP dung | → S4 (dang ky) hoac API huy (huy) |
  | wrong | OTP sai | Inline error "Ma OTP khong dung" + clear cells + retry |
  | expired | het thoi gian | "Ma OTP da het han" + button "Gui lai OTP" |
  | resend-limit | gui lai qua nhieu lan | "Thu lai sau X phut" |
  | network-error | mat mang khi gui OTP | Dialog loi mang |
  | api-error-post-otp | OTP dung nhung API kich hoat/huy fail (server 500, error 20002) | FeedbackState: icon=XCircle, title="Khong the hoan tat yeu cau", body="He thong dang xu ly. Vui long thu lai." + CTA "Thu lai" (re-call API voi OTP da verify, KHONG yeu cau nhap lai OTP) + CTA "Ve trang chu" → Home |
- **Transitions:**
  - OTP dung (dang ky) → Screen 4 (S4)
  - OTP dung (huy) → API huy atomic → Screen 16 (S16)
  - back → S2 (dang ky) hoac S15 (huy)

---

## Screen 4: Ket qua dang ky (reuse)
- **Route:** `/sinhloi/ket-qua-dang-ky`
- **Type:** Result
- **UI Ref:** Cash App — centered, minimal
- **BRD:** AC 1.3.3
- **(reuse)** Result pattern chung VSP
- **Components:**
  | Component | Props | Notes |
  |-----------|-------|-------|
  | FeedbackState | icon={CheckCircle 64px}, title="Chuc mung...", actionLabel="Hoan tat, xem chi tiet Sinh loi" | Thanh cong |
  | FeedbackState | icon={XCircle 64px}, title="Kich hoat sinh loi that bai...", actionLabel="Thu lai" | That bai |
  | Button | variant="secondary", size="48" | "Ve trang chu" — chi co khi that bai |
  | Home Indicator | | |
- **States:**
  | State | Trigger | UI Change |
  |-------|---------|-----------|
  | success | API dang ky thanh cong | Icon check xanh + title thanh cong + 1 CTA |
  | failed | API dang ky that bai | Icon X do + title that bai + 2 CTA (Thu lai + Ve trang chu) |
  | no-network | mat mang khi load ket qua | Dialog: "Khong co ket noi mang. Vui long kiem tra Internet va thu lai" + CTA "Thu lai" (re-fetch ket qua) |
- **Transitions:**
  - success → tap "Hoan tat, xem chi tiet Sinh loi" → Screen 5 (S5 Dashboard)
  - failed → tap "Thu lai" → Screen 2 (S2)
  - failed → tap "Ve trang chu" → Home

---

## Screen 5: Dashboard — Tab San pham
- **Route:** `/sinhloi/dashboard`
- **Type:** List / Dashboard
- **UI Ref:** Revolut — clean rows, balance hero
- **BRD:** AC 2.1.1 + AC 2.1.2
- **Components:**
  | Component | Props | Notes |
  |-----------|-------|-------|
  | Header | variant="large-title", largeTitle="Sinh loi", tabs=[{label:"San pham",value:"product"},{label:"Quan ly",value:"manage"}], activeTab="product" | leading=ChevronLeft, tab bar duoi header |
  | Raw HTML — Balance hero | "So du hien tai" + so tien (text-[40px] font-bold tabular-nums) + toggle an/hien (Eye/EyeOff) | Centered, px-[22px] |
  | Raw HTML — Lai suat | "Sinh loi X%/nam" | text-md font-semibold text-foreground |
  | Raw HTML — Tien loi hom qua | "+XXX VND" + icon info (tap → O2) | text-success cho so tien, prefix "+" |
  | Raw HTML — Tong tien loi | "+XXX VND" + icon info (tap → O3) | text-success cho so tien, prefix "+" |
  | Raw HTML — Section "3 GD gan nhat" | SectionTitle "Giao dich gan nhat" + action "Xem tat ca" | pt-[32px], max 3 items |
  | ItemListItem (x3) | label=loai GD, sublabel=ngay, metadata="+/-XXX VND" | prefix=icon circle 44px, tap → S12 |
  | Raw HTML — Note T-1 | "Giao dich hom nay se hien thi vao ngay mai (T-1)" | text-xs text-foreground-secondary |
  | Raw HTML — Gioi thieu co che | Card bg-secondary rounded-[28px] | Tap → O1 |
  | ButtonGroup | layout="horizontal" | "Nap tien" (primary) + "Rut tien" (secondary) — fixed bottom |
  | Home Indicator | | |
- **States:**
  | State | Trigger | UI Change |
  |-------|---------|-----------|
  | loading | dang load dashboard | Skeleton placeholders cho balance, lai, GD (<=2s) |
  | loaded | data san sang | Hien day du thong tin |
  | balance-hidden | user tap toggle an | So du hien "******", tien loi an |
  | balance-visible | user tap toggle hien | So du hien so that |
  | empty-transactions | chua co GD nao | Section "3 GD gan nhat" an hoac hien text "Chua co giao dich" |
  | pull-to-refresh | user keo xuong | Reload so du + lai + GD |
  | error | API load fail | FeedbackState: "Khong the tai thong tin" + CTA "Thu lai" |
  | no-network | mat mang | Dialog loi mang |
  | zero-balance | moi kich hoat, so du = 0, chua co GD | Balance hero hien "0 VND". Section lai hien "0 VND". Section "3 GD gan nhat" an. Card gioi thieu co che hien noi bat. Button "Rut tien" van hien nhung tap → O7 |
  | deep-link-entry | user vao S5 tu push noti / deep link | Load S5 binh thuong. Header leading back → Home (khong co man hinh truoc trong stack). Neu tu push noti GD → back stack: S5 |
  | stale-balance | user o man hinh lau (>60s), so du co the da thay doi | Banner inline phia tren balance: "Dang cap nhat so du..." (text-foreground-secondary) + auto pull-to-refresh. Neu refresh fail → banner "So du co the chua cap nhat. Keo xuong de tai lai" |
- **Transitions:**
  - tap "Nap tien" → Screen 7 (S7 tab Nap)
  - tap "Rut tien" (so du > 0) → Screen 7 (S7 tab Rut)
  - tap "Rut tien" (so du = 0) → O7 (Dialog chan rut)
  - tap 1 GD → Screen 12 (S12)
  - tap "Xem tat ca" → Screen 11 (S11)
  - tap info tien loi hom qua → O2
  - tap info tong tien loi → O3
  - tap gioi thieu co che → O1
  - switch tab "Quan ly" → Screen 6 (S6)
  - back → Home

---

## Screen 6: Dashboard — Tab Quan ly
- **Route:** `/sinhloi/dashboard` (tab=manage)
- **Type:** Settings / Navigation list
- **UI Ref:** Revolut — grouped rows, chevron disclosure
- **BRD:** AC 2.3.1 + AC 2.4.1 + AC 2.5.1
- **Components:**
  | Component | Props | Notes |
  |-----------|-------|-------|
  | Header | variant="large-title", largeTitle="Sinh loi", tabs=[...], activeTab="manage" | leading=ChevronLeft |
  | ItemListItem | label="Lich su giao dich", showChevron=true | Tap → S11 |
  | ItemListItem | label="Tong ket loi nhuan", showChevron=true | Tap → S13 |
  | ItemListItem | label="Dieu khoan & Hop dong", showChevron=true | Tap → S14 |
  | Home Indicator | | |
- **States:**
  | State | Trigger | UI Change |
  |-------|---------|-----------|
  | default | load | 3 navigation rows |
  | loading | chuyen tab | Brief skeleton (rare, data da co tu S5) |
  | error | API fail khi load tab Quan ly | FeedbackState: "Khong the tai thong tin" + CTA "Thu lai" |
- **Transitions:**
  - tap "Lich su giao dich" → Screen 11 (S11)
  - tap "Tong ket loi nhuan" → Screen 13 (S13)
  - tap "Dieu khoan & Hop dong" → Screen 14 (S14)
  - switch tab "San pham" → Screen 5 (S5)
  - back → Screen 5 (S5) — KHONG phai Home

---

## Screen 7: Nap/Rut tien (shared screen, switch tab)
- **Route:** `/sinhloi/nap-rut`
- **Type:** Form Input
- **UI Ref:** Cash App — 1 focus per screen, numpad
- **BRD:** AC 3.1.1 (nap) + AC 3.2.1 (rut)
- **Components:**
  | Component | Props | Notes |
  |-----------|-------|-------|
  | Header | variant="default" | leading=ChevronLeft, KHONG co title (segmented control thay the) |
  | Raw HTML — Segmented Control | "Nap tien" \| "Rut tien" | bg-secondary rounded-full, active=bg-background shadow-sm |
  | Raw HTML — Nguon tien | Nap: "Tu Vi V-Smart Pay" + so du vi chinh / Rut: "Den Vi V-Smart Pay" + so du vi chinh | text-md, so du text-foreground-secondary |
  | Raw HTML — Input so tien | Auto-focus, ban phim so, format 1.000.000 d | text-[40px] font-bold tabular-nums, centered |
  | Raw HTML — Quick amount chips | 500k \| 1tr \| 5tr \| 10tr | Pill style: bg-secondary rounded-full px-[14px] py-[8px] |
  | Raw HTML — Rut tat ca (chi tab Rut) | "Rut tat ca" link | text-success font-semibold, prefill max |
  | Raw HTML — Lai du kien (tab Nap) | "Lai du kien cho so tien nay: +XXX VND/nam" | text-sm text-foreground-secondary, so tien text-success |
  | Raw HTML — Mat lai (tab Rut) | "Ban co the mat so tien lai nam du kien: -XXX VND" | text-sm text-foreground-secondary, so tien text-danger |
  | Raw HTML — Inline error | Text mau do duoi input | text-sm text-danger |
  | Button | variant="primary", size="48", disabled={invalid} | "Tiep tuc" — fixed bottom |
  | Home Indicator | | |
- **States:**
  | State | Trigger | UI Change |
  |-------|---------|-----------|
  | empty (default) | load | Input empty, button disabled, chips hien |
  | typing | user nhap so | So tien hien, tinh lai du kien realtime |
  | valid | so tien hop le | Button "Tiep tuc" enabled |
  | error-zero | nhap 0 | Inline error "So tien [nap/rut] phai khac 0", button disabled |
  | error-exceed-balance | > so du vi chinh (nap) hoac > so du sinh loi (rut) | Inline error "So tien [nap/rut] vuot qua so du nguon tien" |
  | error-exceed-max | nap + so du > 100tr | Inline error "So du vi sinh loi vuot qua 100 trieu VND" |
  | error-exceed-limit | vuot han muc 100tr/thang (nap) hoac han muc rut/ngay | Inline error "So tien [nap/rut] vuot qua han muc" |
  | chip-selected | tap quick amount chip | Prefill so tien, re-validate |
  | loading | dang submit | Button isLoading, disable double-tap (button disabled ngay sau tap dau, chi cho 1 request) |
  | balance-changed | so du vi thay doi giua luc nhap | Khi tap "Tiep tuc" → API validate → dialog "So du vi da thay doi" → quay ve S7 |
  | no-network | mat mang | Dialog loi mang |
- **Transitions:**
  - tap "Tiep tuc" (valid) → Screen 8 (S8 Xac nhan)
  - switch tab Nap ↔ Rut → cung screen, doi content
  - back → Screen 5 (S5 Dashboard)

---

## Screen 8: Xac nhan giao dich (Nap hoac Rut)
- **Route:** `/sinhloi/xac-nhan-giao-dich`
- **Type:** Confirmation
- **UI Ref:** OKX — bottom sheet / detail list
- **BRD:** AC 3.1.2 (nap) + AC 3.2.2 (rut)
- **Components:**
  | Component | Props | Notes |
  |-----------|-------|-------|
  | Header | variant="default", title="Xac nhan [nap/rut] tien [vao/tu] Vi sinh loi" | leading=ChevronLeft |
  | Raw HTML — So tien hero | so tien lon | text-[40px] font-bold tabular-nums text-foreground, centered |
  | ItemListItem | label="Service Title", metadata="[Nap/Rut] tien sinh loi" | Khong co chevron |
  | ItemListItem | label="So tien", metadata="XXX VND" | tabular-nums |
  | ItemListItem | label="Phi", metadata="Mien phi" | text-success cho "Mien phi" |
  | ItemListItem | label="Nguon thanh toan", metadata="Vi V-Smart Pay" | |
  | Button | variant="primary", size="48" | "Xac thuc giao dich" — fixed bottom, double-tap prevention |
  | Home Indicator | | |
- **States:**
  | State | Trigger | UI Change |
  |-------|---------|-----------|
  | fetch-loading | dang fetch du lieu xac nhan (so tien, phi, nguon) | Skeleton placeholders cho cac ItemListItem, button disabled |
  | ready | load thanh cong | Hien day du thong tin, button enabled |
  | fetch-error | API fetch du lieu xac nhan fail | FeedbackState: "Khong the tai thong tin giao dich" + CTA "Thu lai" (re-fetch) + CTA "Quay lai" (→ S7) |
  | loading | tap "Xac thuc giao dich" | Button isLoading, disable after tap dau |
  | data-stale | so du thay doi giua S7 → S8 (API detect balance mismatch) | Dialog: title="So du da thay doi", body="So du vi cua ban da thay doi. Vui long kiem tra lai so tien giao dich." + CTA "Kiem tra lai" → quay ve S7 (clear data, re-fetch balance) |
  | session-timeout | o man qua lau | Dialog "Phien giao dich het han" + CTA quay lai |
  | error | API fail | Dialog loi he thong |
  | no-network | mat mang | Dialog loi mang |
- **Transitions:**
  - tap "Xac thuc giao dich" → Screen 9 (S9 Auth)
  - back → Screen 7 (S7) — giu nguyen data da nhap

---

## Screen 9: Xac thuc giao dich — PIN/Biometric (reuse)
- **Route:** `/sinhloi/xac-thuc`
- **Type:** Auth — PIN
- **UI Ref:** OKX — cell boxes
- **BRD:** AC 3.1.3 + AC 3.2.3
- **(reuse)** Luong auth chung VSP
- **Components:**
  | Component | Props | Notes |
  |-----------|-------|-------|
  | Header | variant="default", title="Xac thuc giao dich" | leading=ChevronLeft |
  | Raw HTML — PIN cells | 6 cells | Cell boxes, dot fill |
  | Raw HTML — Numpad | 0-9 + delete + biometric | Grid layout |
  | Raw HTML — Biometric option | FaceID/TouchID icon | Hien khi device ho tro |
  | Home Indicator | | |
- **States:**
  | State | Trigger | UI Change |
  |-------|---------|-----------|
  | empty | load | 6 cells empty, numpad active |
  | entering | nhap 1-5 so | Cells fill dan (dot) |
  | verifying | nhap du 6 so | Auto-submit, loading |
  | correct | PIN dung | → API nap/rut → S10 |
  | wrong-1 | PIN sai lan 1 | Error "PIN khong dung" + clear + retry |
  | wrong-2 | PIN sai lan 2 | Error "PIN khong dung. Con 1 lan thu" + clear |
  | locked | PIN sai lan 3 | Khoa tai khoan → redirect man khoa → CSKH |
  | biometric-prompt | chon biometric | He thong hien FaceID/TouchID |
  | biometric-fail | biometric that bai | Fallback ve PIN |
  | forgot-pin | user tap "Quen PIN?" | Link "Quen PIN?" hien duoi numpad (text-foreground-secondary, underline). Tap → chuyen sang luong Quen PIN chung VSP (thoat khoi flow sinh loi). Sau reset PIN → quay lai man hinh truoc (S8) |
  | no-network | mat mang | Dialog loi mang |
- **Transitions:**
  - xac thuc thanh cong → API giao dich → Screen 10 (S10)
  - tap "Quen PIN?" → Luong Quen PIN chung VSP
  - back → Screen 8 (S8)

---

## Screen 10: Ket qua giao dich (reuse)
- **Route:** `/sinhloi/ket-qua-giao-dich`
- **Type:** Result
- **UI Ref:** Cash App — centered, minimal
- **BRD:** AC 3.1.4 (nap) + AC 3.2.4 (rut)
- **(reuse)** Result pattern chung VSP — 3 trang thai
- **Components:**
  | Component | Props | Notes |
  |-----------|-------|-------|
  | Raw HTML — Status icon | CheckCircle (thanh cong) / Clock (cho xu ly) / XCircle (that bai) | 64px, centered |
  | Raw HTML — Status title | "Giao dich thanh cong/dang xu ly/that bai" | text-lg font-medium |
  | Raw HTML — So tien | XXX VND | text-[40px] font-bold tabular-nums |
  | Raw HTML — Notice (cho xu ly) | "GD da duoc tiep nhan va cho xu ly..." | text-sm text-foreground-secondary |
  | ItemListItem | label="Thoi gian", metadata="hh:mm – dd/mm/yyyy" | |
  | ItemListItem | label="Ma giao dich", metadata="{txnId}" | |
  | ItemListItem | label="Service Title", metadata="[Nap/Rut] tien sinh loi" | |
  | ItemListItem | label="Nguon thanh toan", metadata="Vi V-Smart Pay" | |
  | ItemListItem | label="So tien", metadata="XXX VND" | |
  | ItemListItem | label="Phi", metadata="Mien phi" | |
  | Button | variant="primary", size="48" | "Trang chu sinh loi" — luon co |
  | Button | variant="secondary", size="48" | "Thu lai" — chi co khi that bai |
  | Home Indicator | | |
- **States:**
  | State | Trigger | UI Change |
  |-------|---------|-----------|
  | success | GD thanh cong | Icon check xanh + thong tin day du + 1 CTA |
  | processing | GD cho xu ly | Icon clock vang + notice text + 1 CTA |
  | failed | GD that bai | Icon X do + 2 CTA ("Thu lai" + "Trang chu sinh loi") |
  | failed-conflict | nap khi dang tra lai | "He thong dang xu ly. Vui long thu lai sau it phut" |
  | failed-maintenance | doi tac downtime | "Dich vu tam thoi gian doan" |
  | failed-exceed | race condition vuot 100tr | "So du vi sinh loi vuot qua 100 trieu VND" |
  | no-network | mat mang khi load ket qua GD | Dialog: "Khong co ket noi mang. Vui long kiem tra Internet va thu lai" + CTA "Thu lai" (re-fetch ket qua). Luu y: GD co the da thanh cong phia server — khong cho user submit lai GD |
- **Transitions:**
  - tap "Trang chu sinh loi" → Screen 5 (S5 Dashboard)
  - tap "Thu lai" (that bai) → Screen 8 (S8) — khong phai nhap lai so tien

---

## Screen 11: Lich su giao dich
- **Route:** `/sinhloi/lich-su`
- **Type:** List / Dashboard
- **UI Ref:** Revolut — clean rows, filter
- **BRD:** AC 2.4.1
- **Components:**
  | Component | Props | Notes |
  |-----------|-------|-------|
  | Header | variant="default", title="Lich su giao dich" | leading=ChevronLeft |
  | Raw HTML — Dropdown loai GD | "Tat ca" \| "Nap tien" \| "Rut tien" \| "Tra lai thang XX" | Dropdown component, default "Tat ca" |
  | Raw HTML — Calendar picker | Default 7 ngay (T-1), max 90 ngay | Khong cho chon hom nay hoac tuong lai |
  | Raw HTML — Note T-1 | "Giao dich hom nay se hien thi vao ngay mai" | text-xs text-foreground-secondary |
  | ItemListItem (loop) | label=loai GD, sublabel="dd/mm/yyyy", metadata="+/-XXX VND", prefix=icon circle | Tap → S12 |
  | Raw HTML — Loading more | "Dang tai them..." | Infinite scroll, 20 items/page |
  | FeedbackState | title="Chua co giao dich nao" | Empty state |
  | Home Indicator | | |
- **States:**
  | State | Trigger | UI Change |
  |-------|---------|-----------|
  | loading | load / filter change | Skeleton placeholders |
  | loaded | data san sang | Danh sach GD hien |
  | empty | khong co GD nao | FeedbackState "Chua co giao dich nao" |
  | filter-no-result | filter nhung khong co ket qua | FeedbackState "Khong tim thay giao dich" |
  | loading-more | scroll xuong cuoi | "Dang tai them..." o cuoi list |
  | end-of-list | het data | An loading indicator |
  | pull-to-refresh | keo xuong | Reload data |
  | error | API fail | FeedbackState + CTA "Thu lai" |
  | no-network | mat mang | Dialog loi mang |
- **Transitions:**
  - tap 1 GD → Screen 12 (S12)
  - back → Screen 6 (S6)

---

## Screen 12: Chi tiet giao dich
- **Route:** `/sinhloi/giao-dich/:id`
- **Type:** Detail
- **UI Ref:** Revolut — large amount header, grouped info
- **BRD:** AC 2.4.2
- **Components:**
  | Component | Props | Notes |
  |-----------|-------|-------|
  | Header | variant="default", title="Chi tiet giao dich" | leading=ChevronLeft |
  | ItemListItem | label="Loai giao dich", metadata="{type}" | Nap tien / Rut tien / Tra lai thang XX |
  | Raw HTML — So tien | +/-XXX VND | text-[40px] font-bold tabular-nums, +text-success / -text-danger |
  | ItemListItem | label="Trang thai", metadata="{status}" | |
  | ItemListItem | label="Ngay giao dich", metadata="dd/mm/yyyy" | |
  | ItemListItem | label="Ma giao dich", metadata="{txnId}" | |
  | Home Indicator | | |
- **States:**
  | State | Trigger | UI Change |
  |-------|---------|-----------|
  | loading | dang load | Skeleton |
  | loaded | data san sang | Hien day du |
  | error | API fail / 404 | "Noi dung ban dang tim hien chua san sang hoac khong con ton tai" + CTA "Quay lai" |
  | no-network | mat mang | Dialog loi mang |
- **Transitions:**
  - back → Screen 11 (S11) — hoac Screen 5 (S5) neu vao tu deep link push noti

---

## Screen 13: Tong ket loi nhuan
- **Route:** `/sinhloi/tong-ket`
- **Type:** List / Dashboard
- **UI Ref:** Revolut — clean rows, dropdown
- **BRD:** AC 2.5.1
- **Components:**
  | Component | Props | Notes |
  |-----------|-------|-------|
  | Header | variant="default", title="Tong ket loi nhuan" | leading=ChevronLeft |
  | Raw HTML — Dropdown nam | Max 5 nam, bao gom nam hien tai | Dropdown, icon ChevronDown |
  | Raw HTML — Danh sach thang | Moi nam: cac thang co lai | Accordion/expandable per year |
  | ItemListItem (loop) | label="Thang X", metadata="+XXX VND" hoac "du kien +XXX VND" | "du kien" = text-foreground-secondary |
  | Raw HTML — Tong loi nhuan da nhan | "+XXX VND" | text-lg font-bold text-success, pt-[32px] |
  | Home Indicator | | |
- **States:**
  | State | Trigger | UI Change |
  |-------|---------|-----------|
  | loading | dang load | Skeleton |
  | loaded | data san sang | Danh sach thang + tong |
  | empty | nam khong co lai | "Chua co du lieu loi nhuan" |
  | year-change | chon nam khac | Reload danh sach thang |
  | error | API fail / 404 | "Noi dung ban dang tim hien chua san sang..." + CTA "Quay lai" |
  | no-network | mat mang | Dialog loi mang |
- **Transitions:**
  - back → Screen 6 (S6)

---

## Screen 14: Dieu khoan va Hop dong
- **Route:** `/sinhloi/dieu-khoan`
- **Type:** Settings / Navigation list
- **UI Ref:** Revolut — grouped rows
- **BRD:** AC 2.3.1
- **Components:**
  | Component | Props | Notes |
  |-----------|-------|-------|
  | Header | variant="default", title="Dieu khoan va hop dong" | leading=ChevronLeft |
  | ItemListItem | label="Dieu khoan su dung", showChevron=true | Tap → O4 |
  | ItemListItem | label="Hop dong cho vay", showChevron=true | Tap → O5 |
  | Button | variant="primary", intent="danger", size="48" | "Tat sinh loi" — destructive, mau do, fixed bottom |
  | Home Indicator | | |
- **States:**
  | State | Trigger | UI Change |
  |-------|---------|-----------|
  | default | load | 2 rows + button huy |
  | loading-tap | tap "Tat sinh loi" | Button isLoading |
  | not-configured | backend chua cau hinh noi dung dieu khoan/hop dong | 2 rows van hien nhung tap vao → O4/O5 se hien state "not-configured" ("Thong tin dang duoc cap nhat"). Button "Tat sinh loi" van hoat dong binh thuong |
  | no-network | mat mang | Dialog: "Khong co ket noi mang. Vui long kiem tra Internet va thu lai" |
- **Transitions:**
  - tap "Dieu khoan su dung" → O4 (Full screen)
  - tap "Hop dong cho vay" → O5 (Full screen)
  - tap "Tat sinh loi" → Screen 15 (S15)
  - back → Screen 6 (S6)

---

## Screen 15: Xac nhan huy dang ky
- **Route:** `/sinhloi/xac-nhan-huy`
- **Type:** Confirmation (Destructive)
- **UI Ref:** OKX — confirmation detail
- **BRD:** AC 4.1.1
- **Components:**
  | Component | Props | Notes |
  |-----------|-------|-------|
  | Header | variant="default", title="Tat sinh loi" | leading=ChevronLeft |
  | Raw HTML — Title | "Ban co chac muon tat tinh nang sinh loi?" | text-xl font-bold |
  | Raw HTML — Body (so du > 0) | "So du va lai se duoc chuyen ve Vi V-Smart Pay trong ngay" | text-md text-foreground |
  | Raw HTML — Chi tiet so du | "So du: XXX VND \| Lai du kien: YYY VND" | text-md, so tien font-semibold |
  | Raw HTML — Body (so du = 0) | "Vi sinh loi cua ban hien khong co so du" | text-md text-foreground-secondary |
  | Button | variant="primary", size="48" | "Giu tinh nang" — primary = an toan |
  | Button | variant="primary", intent="danger", size="48" | "Tat sinh loi" — destructive, mau do |
  | Home Indicator | | |
- **Luu y:** Primary CTA la "Giu tinh nang" (an toan). "Tat sinh loi" la destructive (do). Ngoai le 1 primary/screen vi day la destructive confirmation — can 2 CTA ro rang.
- **States:**
  | State | Trigger | UI Change |
  |-------|---------|-----------|
  | default (co so du) | load, so du > 0 | Hien so du + lai du kien + 2 CTA |
  | default (khong so du) | load, so du = 0 | Hien text "khong co so du" + 2 CTA |
  | loading | tap "Tat sinh loi" | Button isLoading, disable double-tap (disable ca 2 button ngay sau tap dau, chi cho 1 request) |
  | no-network | mat mang | Dialog loi mang |
- **Transitions:**
  - tap "Giu tinh nang" → quay lai Screen 14 (S14)
  - tap "Tat sinh loi" → Screen 3 (S3 OTP — reuse)
  - back → Screen 14 (S14)

---

## Screen 16: Ket qua huy dang ky (reuse)
- **Route:** `/sinhloi/ket-qua-huy`
- **Type:** Result
- **UI Ref:** Cash App — centered, minimal
- **BRD:** AC 4.1.3
- **(reuse)** Result pattern chung VSP
- **Components:**
  | Component | Props | Notes |
  |-----------|-------|-------|
  | FeedbackState | icon={CheckCircle 64px}, title="Da tiep nhan yeu cau tat tinh nang" | Thanh cong |
  | Raw HTML — Body | "So du va lai cua ban se duoc chuyen ve Vi V-Smart Pay trong ngay..." | text-sm text-foreground |
  | Raw HTML — Chi tiet | "So du: XXX VND + Lai du kien: YYY VND" | text-md font-semibold |
  | FeedbackState | icon={XCircle 64px}, title="Huy that bai" | That bai (rut fail → huy fail, ATOMIC) |
  | Raw HTML — Body that bai | "Khong the tat tinh nang sinh loi luc nay. Vui long thu lai sau." | |
  | Button | variant="primary", size="48" | Thanh cong: "Ve trang chu" / That bai: "Thu lai" |
  | Button | variant="secondary", size="48" | That bai: "Ve trang chu" |
  | Home Indicator | | |
- **KHONG co back button.** Chi co CTA. System back gesture → Home.
- **States:**
  | State | Trigger | UI Change |
  |-------|---------|-----------|
  | success | huy thanh cong (atomic: rut OK + huy OK) | Icon check + title + chi tiet so du/lai + CTA "Ve trang chu" |
  | failed | huy that bai (rut fail → huy fail) | Icon X do + "Huy that bai" + 2 CTA. Sinh loi VAN ACTIVE. |
- **Transitions:**
  - success → tap "Ve trang chu" → Home (KHONG phai Dashboard)
  - failed → tap "Thu lai" → Screen 15 (S15)
  - failed → tap "Ve trang chu" → Home
  - system back gesture → Home

---

## Overlay O1: Bottom sheet — Gioi thieu co che sinh loi
- **Type:** Bottom Sheet
- **UI Ref:** Revolut — info bottom sheet
- **BRD:** AC 2.2.1
- **Components:**
  | Component | Props | Notes |
  |-----------|-------|-------|
  | BottomSheet | open={true} | Grabber 36x6px |
  | Raw HTML — Content | Noi dung gioi thieu co che (cau hinh backend) | px-[22px], text-md |
  | Home Indicator | | Ben trong sheet |
- **States:**
  | State | Trigger | UI Change |
  |-------|---------|-----------|
  | open | tap card gioi thieu tren S5 | Sheet slide up |
  | loading | dang load noi dung | Loading indicator |
  | loaded | noi dung san sang | Hien text |
  | error | API fail | "Thong tin dang duoc cap nhat." |
  | close | tap outside / swipe down | Sheet dong, quay lai S5 |

---

## Overlay O2: Bottom sheet — Tong loi nhuan tam tinh
- **Type:** Bottom Sheet
- **BRD:** AC 2.2.2
- **Components:**
  | Component | Props | Notes |
  |-----------|-------|-------|
  | BottomSheet | open={true} | |
  | Raw HTML — Content | Dinh nghia tong loi nhuan tam tinh | px-[22px] |
  | Home Indicator | | |
- **States:** open / loading / loaded / error / close (tuong tu O1)

---

## Overlay O3: Bottom sheet — Thoi diem tra loi nhuan
- **Type:** Bottom Sheet
- **BRD:** AC 2.2.3
- **Components:**
  | Component | Props | Notes |
  |-----------|-------|-------|
  | BottomSheet | open={true} | |
  | Raw HTML — Content | Thoi diem tra loi nhuan | px-[22px] |
  | Home Indicator | | |
- **States:** open / loading / loaded / error / close (tuong tu O1)

---

## Overlay O4: Full screen — Dieu khoan su dung
- **Type:** Full Screen Overlay
- **BRD:** AC 1.3.1 (tu S2) + AC 2.3.1 (tu S14)
- **Components:**
  | Component | Props | Notes |
  |-----------|-------|-------|
  | Header | variant="default", title="Dieu khoan su dung" | leading=ChevronLeft (quay lai man truoc) |
  | Raw HTML — Content | Noi dung dieu khoan (tu backend) | px-[22px], scrollable |
  | Home Indicator | | |
- **States:**
  | State | Trigger | UI Change |
  |-------|---------|-----------|
  | loading | dang load noi dung | Loading indicator |
  | loaded | noi dung san sang | Hien text scrollable |
  | error | API fail | "Vui long thu lai." |
  | not-configured | backend chua cau hinh | "Thong tin dang duoc cap nhat." |
  | no-network | mat mang | Dialog loi mang |

---

## Overlay O5: Full screen — Hop dong cho vay
- **Type:** Full Screen Overlay
- **BRD:** AC 1.3.1 (tu S2) + AC 2.3.1 (tu S14)
- **Components:**
  | Component | Props | Notes |
  |-----------|-------|-------|
  | Header | variant="default", title="Hop dong cho vay" | leading=ChevronLeft |
  | Raw HTML — Content | Noi dung hop dong (tu backend, dien san thong tin KH) | px-[22px], scrollable |
  | Home Indicator | | |
- **States:** loading / loaded / error / not-configured / no-network (tuong tu O4)

---

## Overlay O7: Dialog — So du = 0 chan rut tien
- **Type:** Dialog
- **BRD:** PO Decision #5
- **Components:**
  | Component | Props | Notes |
  |-----------|-------|-------|
  | Dialog | open={true}, title="Chua co so du", description="Vi sinh loi chua co so du. Ban co muon nap tien?" | |
  | Button (trong Dialog) | variant="primary" | "Nap tien" → S7 tab Nap |
  | Button (trong Dialog) | variant="secondary" | "Dong" → dong dialog |
- **States:**
  | State | Trigger | UI Change |
  |-------|---------|-----------|
  | open | tap "Rut tien" khi so du = 0 | Dialog hien tren overlay |
  | close | tap "Dong" hoac tap outside | Dialog dong, quay lai S5 |
- **Transitions:**
  - tap "Nap tien" → Screen 7 (S7 tab Nap)
  - tap "Dong" → dong dialog, quay lai Screen 5 (S5)

---

## Summary Table

| # | Ten man hinh | Route | Type | UI Ref | Components | States | Reuse? |
|---|-------------|-------|------|--------|------------|--------|--------|
| S1 | Product Page | `/sinhloi` | Marketing | Cash App | 10 | 8 | Moi |
| S2 | Xac nhan kich hoat | `/sinhloi/xac-nhan-kich-hoat` | Confirmation | OKX | 9 | 7 | Moi |
| S3 | OTP | `/sinhloi/otp` | Auth — OTP | OKX | 5 | 9 | (reuse) |
| S4 | Ket qua dang ky | `/sinhloi/ket-qua-dang-ky` | Result | Cash App | 4 | 3 | (reuse) |
| S5 | Dashboard — Tab San pham | `/sinhloi/dashboard` | Dashboard | Revolut | 12 | 11 | Moi |
| S6 | Dashboard — Tab Quan ly | `/sinhloi/dashboard?tab=manage` | Settings | Revolut | 5 | 3 | Moi |
| S7 | Nap/Rut tien | `/sinhloi/nap-rut` | Form Input | Cash App | 11 | 10 | Moi |
| S8 | Xac nhan giao dich | `/sinhloi/xac-nhan-giao-dich` | Confirmation | OKX | 8 | 8 | Moi |
| S9 | Auth PIN/Biometric | `/sinhloi/xac-thuc` | Auth — PIN | OKX | 5 | 11 | (reuse) |
| S10 | Ket qua giao dich | `/sinhloi/ket-qua-giao-dich` | Result | Cash App | 12 | 7 | (reuse) |
| S11 | Lich su giao dich | `/sinhloi/lich-su` | List | Revolut | 8 | 9 | Moi |
| S12 | Chi tiet giao dich | `/sinhloi/giao-dich/:id` | Detail | Revolut | 7 | 4 | Moi |
| S13 | Tong ket loi nhuan | `/sinhloi/tong-ket` | List | Revolut | 6 | 6 | Moi |
| S14 | Dieu khoan va Hop dong | `/sinhloi/dieu-khoan` | Settings | Revolut | 5 | 4 | Moi |
| S15 | Xac nhan huy | `/sinhloi/xac-nhan-huy` | Confirmation | OKX | 8 | 4 | Moi |
| S16 | Ket qua huy | `/sinhloi/ket-qua-huy` | Result | Cash App | 6 | 2 | (reuse) |
| O1 | BS: Gioi thieu co che | overlay | Bottom Sheet | Revolut | 3 | 5 | Moi |
| O2 | BS: Tong loi nhuan tam tinh | overlay | Bottom Sheet | Revolut | 3 | 5 | Moi |
| O3 | BS: Thoi diem tra lai | overlay | Bottom Sheet | Revolut | 3 | 5 | Moi |
| O4 | FS: Dieu khoan su dung | overlay | Full Screen | — | 3 | 5 | Moi |
| O5 | FS: Hop dong cho vay | overlay | Full Screen | — | 3 | 5 | Moi |
| O7 | Dialog: Chan rut tien | overlay | Dialog | — | 3 | 2 | Moi |

**Totals:**
- Screens: 16 (10 moi + 6 reuse)
- Overlays: 6 (O1-O5 + O7)
- Tong components (unique): ~121
- Tong states (unique): ~128 (bao gom 17 states bo sung tu QA + 4 global states)
- Reuse ratio: 37.5%

---

## Global States

> Cac state ap dung cho toan bo feature Sinh loi tu dong, khong thuoc rieng man hinh nao.

| State | Trigger | UI Change |
|-------|---------|-----------|
| app-kill-mid-flow | user tat app giua flow (VD: dang o S2, S3, S7, S8, S15) | Khi mo lai app: KHONG resume flow. Quay ve man hinh cuoi cung co data stable (S1 neu chua kich hoat, S5 neu da kich hoat). Neu dang o S3 OTP → OTP het han, phai bat dau lai tu S2/S15. Neu dang o S9 PIN → quay ve S8, data van giu. Neu dang o S8 xac nhan → quay ve S7, data van giu |
| deeplink-not-logged-in | user tap deep link khi chua login | Chuyen sang man hinh Login/Dang nhap. Sau login thanh cong → redirect lai man hinh deep link goc (S1 neu chua kich hoat, S5 neu da kich hoat). Neu login fail/cancel → ve Home |
| re-register-after-cancel | user da huy sinh loi (S16 success), quay lai S1 | S1 hien nhu user moi (da eKYC). CTA = "Kich hoat sinh loi". Khong hien thong bao "ban da huy truoc do". Flow kich hoat giong hoan toan user moi |
| rate-changed-mid-flow | lai suat thay doi khi user dang o giua flow (S1 → S2 → S3) | Neu lai suat thay doi giua luc user dang o S2 (chua confirm): quay ve S2, thong tin lai suat tu dong cap nhat (khong block). Neu da qua S3 OTP: lai suat cu van ap dung (theo thoa thuan da dong y). Khong hien warning giua flow de tranh confuse |

---

## Changelog — State Fix

> QA: Khoa | Fix: Ivy | Date: 2026-03-09
> Reference: qa-states.md — 17 MISSING states

| # | Screen | State da them | Muc do | Mo ta |
|---|--------|---------------|--------|-------|
| 1 | S1 | `deep-link-entry` | Medium | Deep link vao S1 khi chua kich hoat — load binh thuong, back → Home |
| 2 | S1 | `rate-changed` | Medium | Lai suat thay doi khi user dang o S1 — banner inline + auto cap nhat |
| 3 | S2 | `error-server-20002` | Low | API error 20002 (500/502/503/504) — Dialog cu the voi message "Dich vu tam thoi gian doan" |
| 4 | S3 | `api-error-post-otp` | **High** | OTP dung nhung API fail — FeedbackState error + CTA "Thu lai" (khong nhap lai OTP) |
| 5 | S4 | `no-network` | Medium | Network error tren Result screen — Dialog loi mang + CTA "Thu lai" |
| 6 | S5 | `zero-balance` | Medium | So du = 0 (moi kich hoat) — UI rieng: lai = 0, GD an, card gioi thieu noi bat |
| 7 | S5 | `deep-link-entry` | Low | Vao S5 tu push noti / deep link — back → Home |
| 8 | S5 | `stale-balance` | **High** | So du cu (user o man lau) — banner "Dang cap nhat so du" + auto refresh |
| 9 | S6 | `error` | Low | API fail tab Quan ly — FeedbackState + CTA "Thu lai" |
| 10 | S7 | `loading` (updated: double-tap) | Medium | Bo sung "disable double-tap" vao state loading cua S7 (tab Nap + tab Rut) |
| 11 | S7 | (tuong tu #10 — cover ca tab Rut) | Medium | Cung 1 state loading, ap dung cho ca 2 tab |
| 12 | S8 | `fetch-loading` + `fetch-error` | Medium | Them state loading khi fetch data xac nhan + error khi fetch fail |
| 13 | S8 | `data-stale` | **High** | So du thay doi giua S7 → S8 — Dialog canh bao + CTA quay ve S7 |
| 14 | S9 | `forgot-pin` | Low | Link "Quen PIN?" duoi numpad → luong Quen PIN chung VSP |
| 15 | S10 | `no-network` | Medium | Network error tren Result GD — Dialog loi mang (luu y: khong cho submit lai GD) |
| 16 | S14 | `not-configured` | Low | Backend chua cau hinh noi dung — tuong tu O4/O5 |
| 17 | S14 | `no-network` | Medium | Network error tren man Dieu khoan — Dialog loi mang |
| — | S15 | `loading` (updated: double-tap) | Medium | Bo sung "disable double-tap" vao state loading cua S15 |
| G1 | Global | `app-kill-mid-flow` | **High** | Tat app giua flow → khong resume, quay ve man hinh stable |
| G2 | Global | `deeplink-not-logged-in` | Medium | Deep link chua login → login → redirect |
| G3 | Global | `re-register-after-cancel` | Low | Dang ky lai sau huy — S1 hien nhu user moi |
| G4 | Global | `rate-changed-mid-flow` | Medium | Lai suat thay doi giua flow — auto cap nhat o S2, lai suat cu ap dung sau S3 |

---
Back: [[features/index|Features]] · [[features/sinhloi-v2/status|sinhloi-v2]]
