# State Coverage QA — Sinh loi tu dong v2
> QA: Khoa | Date: 2026-03-09
> Source: flow.md v2.1 + edge-case-library.md + decisions.md
> Cross-reference: screens.md (Ivy — 2026-03-09)
> Status: **DA CROSS-REFERENCE XONG**

---

## Per Screen

### Screen: S1 — Product Page — ✅ 6/8 | 🔴 2 MISSING
Screen type: **Landing / Marketing + Form (CTA)**
Required states: 8 | Found: 6 | Missing: 2

| # | State | Required by | Status | Ghi chu |
|---|-------|-------------|--------|---------|
| 1 | Default (da eKYC) — CTA "Kich hoat sinh loi" | flow.md | ✅ PASS | screens.md: state "default (da eKYC)" |
| 2 | Default (chua eKYC) — CTA "Xac thuc ngay" | flow.md + decision #4 | ✅ PASS | screens.md: state "default (chua eKYC)" |
| 3 | Progress bar interaction — keo demo lai | flow.md | ✅ PASS | screens.md: state "dragging" |
| 4 | Disclaimer cho vay hien thi | flow.md v2.1 + decision #6 | ✅ PASS | screens.md: component "Disclaimer" co text day du |
| 5 | Loading (fetch lai suat tu API) | edge-case-library: List/Dashboard | ✅ PASS | screens.md: state "loading" — Skeleton cho USP, lai suat, thong tin san pham (<=2s) |
| 6 | Error (API fail load data) | edge-case-library: List/Dashboard | ✅ PASS | screens.md: state "error" — FeedbackState + CTA "Thu lai" |
| 7 | Network error (mat mang) | edge-case #11 + error 20003 | ✅ PASS | screens.md: state "no-network" — Dialog loi mang |
| 8 | Deep link entry (load truc tiep khong qua Home) | edge-case-library: Navigation | 🔴 MISSING | screens.md KHONG co state deep link entry. Flow.md Flow 6 ghi ro deeplink vao S1 khi chua kich hoat |

---

### Screen: S2 — Xac nhan kich hoat — ✅ 8/9 | 🔴 1 MISSING
Screen type: **Confirmation + Form (checkbox)**
Required states: 9 | Found: 8 | Missing: 1

| # | State | Required by | Status | Ghi chu |
|---|-------|-------------|--------|---------|
| 1 | Default — 0 checkbox checked, button disabled | flow.md + edge-case-library: Form | ✅ PASS | screens.md: state "default" — 2 checkbox unchecked, button disabled |
| 2 | 1 checkbox checked, button van disabled | edge-case-library: Form (partial) | ✅ PASS | screens.md: state "partial" |
| 3 | 2 checkbox checked, button enabled | flow.md | ✅ PASS | screens.md: state "valid" |
| 4 | Loading (tap Xac nhan → spinner) | edge-case-library: Form | ✅ PASS | screens.md: state "loading" — Button isLoading |
| 5 | Double-tap prevention (disable sau tap dau) | edge-case #12 | ✅ PASS | screens.md: state "loading" ghi "disable double-tap" |
| 6 | Disclaimer cho vay hien thi | flow.md v2.1 | ✅ PASS | screens.md: component "Disclaimer" co text |
| 7 | Thong tin user hien thi (Ho ten, SDT, CCCD) | flow.md | ✅ PASS | screens.md: 3 ItemListItem (Ho va ten, So dien thoai, Can cuoc cong dan) |
| 8 | Network error | error 20003 | ✅ PASS | screens.md: state "no-network" |
| 9 | API error (server 500) | error 20002 | 🔴 MISSING | screens.md state "error" ghi "ToastBar hoac Dialog loi he thong" — KHONG phan biet error code 20002 cu the. Chap nhan noi dung nhung thieu error code mapping |

> Note: S2 state "error" cover chung — tuy nhien khong ghi ro error code 20002 (500/502/503/504) va message cu the "Dich vu tam thoi gian doan". Danh MISSING vi thieu specificity.

---

### Screen: S3 — OTP (reuse) — ✅ 7/8 | 🔴 1 MISSING
Screen type: **Auth — OTP**
Required states: 8 | Found: 7 | Missing: 1

| # | State | Required by | Status | Ghi chu |
|---|-------|-------------|--------|---------|
| 1 | OTP sent — countdown timer | edge-case-library: Auth OTP | ✅ PASS | screens.md: state "sent" — Countdown timer hien |
| 2 | Entering digits (partial) | edge-case-library: Auth OTP | ✅ PASS | screens.md: state "entering" |
| 3 | OTP dung → proceed | flow.md | ✅ PASS | screens.md: state "correct" — → S4 hoac API huy |
| 4 | OTP sai → error inline + retry | flow.md + edge-case #13 | ✅ PASS | screens.md: state "wrong" — Inline error + clear cells + retry |
| 5 | OTP het han → "Gui lai OTP" | flow.md + edge-case #13 | ✅ PASS | screens.md: state "expired" |
| 6 | Resend limit reached → "Thu lai sau X phut" | edge-case-library: Auth OTP | ✅ PASS | screens.md: state "resend-limit" |
| 7 | Network error gui OTP | edge-case-library: Auth OTP | ✅ PASS | screens.md: state "network-error" |
| 8 | API error sau OTP dung (server fail) | error 20002 | 🔴 MISSING | screens.md state "correct" chi ghi proceed, KHONG co state cho truong hop API call sau OTP dung bi fail (server 500). Can state "api-error-after-verify" |

---

### Screen: S4 — Ket qua dang ky — ✅ 2/3 | 🔴 1 MISSING
Screen type: **Result**
Required states: 3 | Found: 2 | Missing: 1

| # | State | Required by | Status | Ghi chu |
|---|-------|-------------|--------|---------|
| 1 | Thanh cong — CTA "Xem chi tiet Sinh loi" | flow.md | ✅ PASS | screens.md: state "success" — CTA "Hoan tat, xem chi tiet Sinh loi" |
| 2 | That bai — CTA "Thu lai" + "Ve trang chu" | flow.md | ✅ PASS | screens.md: state "failed" — 2 CTA dung |
| 3 | Network error (mat mang khi load ket qua) | error 20003 | 🔴 MISSING | screens.md CHI co 2 states (success/failed). Khong co state network error / no-network |

---

### Screen: S5 — Dashboard Tab San pham — ✅ 9/12 | 🔴 3 MISSING
Screen type: **Dashboard**
Required states: 12 | Found: 9 | Missing: 3

| # | State | Required by | Status | Ghi chu |
|---|-------|-------------|--------|---------|
| 1 | Loading (skeleton) | edge-case-library: List/Dashboard + edge-case #16 | ✅ PASS | screens.md: state "loading" — Skeleton placeholders (<=2s) |
| 2 | Loaded — co so du, co lai, co GD | flow.md | ✅ PASS | screens.md: state "loaded" |
| 3 | Loaded — so du = 0 (moi kich hoat, chua nap) | edge-case #15 | 🔴 MISSING | screens.md KHONG co state rieng cho so du = 0. Chi co "empty-transactions" nhung khong ghi ro so du = 0 |
| 4 | Toggle an/hien so du | flow.md | ✅ PASS | screens.md: state "balance-hidden" + "balance-visible" |
| 5 | Section 3 GD gan nhat — co GD | flow.md v2.1 | ✅ PASS | screens.md: component Section "3 GD gan nhat" + max 3 items |
| 6 | Section 3 GD gan nhat — khong co GD (empty) | edge-case-library: List | ✅ PASS | screens.md: state "empty-transactions" — an hoac hien text "Chua co giao dich" |
| 7 | Pull-to-refresh | flow.md + edge-case-library | ✅ PASS | screens.md: state "pull-to-refresh" |
| 8 | API error load dashboard | edge-case #16 | ✅ PASS | screens.md: state "error" — FeedbackState + CTA "Thu lai" |
| 9 | Network error | error 20003 | ✅ PASS | screens.md: state "no-network" |
| 10 | Tap "Rut tien" khi so du = 0 → dialog O7 | flow.md + decision #5 | ✅ PASS | screens.md: Transitions ghi ro "tap Rut tien (so du = 0) → O7" |
| 11 | Deep link entry (tu push noti) | flow.md Flow 6 | 🔴 MISSING | screens.md KHONG co state deep link entry. Flow.md ghi push noti → S12 → back → S5 |
| 12 | Stale balance (user o man lau, so du da thay doi) | edge-case #3 + fintech edge | 🔴 MISSING | screens.md KHONG co state stale balance. Pull-to-refresh co nhung khong ghi ro auto-detect stale data |

---

### Screen: S6 — Dashboard Tab Quan ly — ✅ 3/4 | 🔴 1 MISSING
Screen type: **Dashboard / Menu**
Required states: 4 | Found: 3 | Missing: 1

| # | State | Required by | Status | Ghi chu |
|---|-------|-------------|--------|---------|
| 1 | Default — 3 row menu | flow.md | ✅ PASS | screens.md: state "default" — 3 navigation rows |
| 2 | Loading | edge-case-library: List/Dashboard | ✅ PASS | screens.md: state "loading" — Brief skeleton |
| 3 | Error | edge-case-library: List/Dashboard | 🔴 MISSING | screens.md KHONG co error state. Chi co default + loading |
| 4 | Back → S5 (khong phai Home) | flow.md v2.1 + decision #6 | ✅ PASS | screens.md: Transitions ghi "back → Screen 5 (S5) — KHONG phai Home" |

---

### Screen: S7 — Nap/Rut tien (tab Nap) — ✅ 11/12 | 🔴 1 MISSING
Screen type: **Form Input**
Required states: 12 | Found: 11 | Missing: 1

| # | State | Required by | Status | Ghi chu |
|---|-------|-------------|--------|---------|
| 1 | Empty — auto-focus, ban phim so, button disabled | flow.md + edge-case-library: Form | ✅ PASS | screens.md: state "empty (default)" |
| 2 | Typing (partial) — button disabled | edge-case-library: Form | ✅ PASS | screens.md: state "typing" |
| 3 | Valid — button enabled | flow.md | ✅ PASS | screens.md: state "valid" |
| 4 | Error: so tien = 0 | flow.md | ✅ PASS | screens.md: state "error-zero" |
| 5 | Error: vuot so du vi chinh | flow.md | ✅ PASS | screens.md: state "error-exceed-balance" |
| 6 | Error: tong vuot 100tr | flow.md + edge-case #5 | ✅ PASS | screens.md: state "error-exceed-max" |
| 7 | Error: vuot han muc 100tr/thang | flow.md + edge-case #6 | ✅ PASS | screens.md: state "error-exceed-limit" |
| 8 | Quick amount chips: 500k, 1tr, 5tr, 10tr | flow.md v2.1 | ✅ PASS | screens.md: state "chip-selected" + component Quick amount chips |
| 9 | Lai du kien hien thi | flow.md v2.1 | ✅ PASS | screens.md: component "Lai du kien (tab Nap)" |
| 10 | Loading (tap "Tiep tuc" → validate) | edge-case-library: Form | ✅ PASS | screens.md: state "loading" — Button isLoading |
| 11 | Double-tap prevention | edge-case #12 | 🔴 MISSING | screens.md state "loading" KHONG ghi ro disable double-tap cho S7. Chi ghi "Button isLoading" — khong du. So sanh voi S2 co ghi ro "disable double-tap" |
| 12 | Stale balance validation (so du thay doi) | edge-case #3 | ✅ PASS | screens.md: state "balance-changed" — dialog "So du vi da thay doi" |

---

### Screen: S7 — Nap/Rut tien (tab Rut) — ✅ 10/11 | 🔴 1 MISSING
Screen type: **Form Input**
Required states: 11 | Found: 10 | Missing: 1

| # | State | Required by | Status | Ghi chu |
|---|-------|-------------|--------|---------|
| 1 | Empty — auto-focus, ban phim so, button disabled | flow.md + edge-case-library: Form | ✅ PASS | screens.md dung chung S7, state "empty (default)" |
| 2 | Typing (partial) — button disabled | edge-case-library: Form | ✅ PASS | screens.md: state "typing" |
| 3 | Valid — button enabled | flow.md | ✅ PASS | screens.md: state "valid" |
| 4 | Error: so tien = 0 | flow.md | ✅ PASS | screens.md: state "error-zero" — ghi "[nap/rut]" |
| 5 | Error: vuot so du vi sinh loi | flow.md | ✅ PASS | screens.md: state "error-exceed-balance" — ghi "so du nguon tien" cover ca 2 tab |
| 6 | Error: vuot han muc rut/ngay | flow.md | ✅ PASS | screens.md: state "error-exceed-limit" — ghi "han muc" chung |
| 7 | Quick amount chips: 500k, 1tr, 5tr, 10tr | flow.md v2.1 | ✅ PASS | screens.md: component Quick amount chips |
| 8 | Quick action: "Rut tat ca" | flow.md | ✅ PASS | screens.md: component "Rut tat ca (chi tab Rut)" — text-success, prefill max |
| 9 | Canh bao mat lai: "-XXX VND" | flow.md | ✅ PASS | screens.md: component "Mat lai (tab Rut)" — text-danger |
| 10 | Loading (tap "Tiep tuc" → validate) | edge-case-library: Form | ✅ PASS | screens.md: state "loading" |
| 11 | Double-tap prevention | edge-case #12 | 🔴 MISSING | Tuong tu tab Nap — khong ghi ro double-tap prevention |

---

### Screen: S8 — Xac nhan giao dich (Nap + Rut shared) — ✅ 5/7 | 🔴 2 MISSING
Screen type: **Confirmation**
Required states: 7 | Found: 5 | Missing: 2

> Note: screens.md merge Nap va Rut thanh 1 screen S8 chung. QA nay cung merge.

| # | State | Required by | Status | Ghi chu |
|---|-------|-------------|--------|---------|
| 1 | Default — hien thi du lieu: so tien, phi, nguon | flow.md | ✅ PASS | screens.md: state "ready" — hien day du thong tin |
| 2 | Loading (tap "Xac thuc giao dich") | edge-case-library: Confirmation | ✅ PASS | screens.md: state "loading" — Button isLoading, disable after tap dau |
| 3 | Fetch error → retry | edge-case-library: Confirmation | 🔴 MISSING | screens.md state "error" ghi "Dialog loi he thong" nhung KHONG co state loading khi fetch data. Chi co "ready" (data da co) — thieu state fetch-loading + fetch-error |
| 4 | Double-tap prevention (disable sau tap dau) | flow.md + edge-case #12 | ✅ PASS | screens.md: state "loading" ghi "disable after tap dau" |
| 5 | Session timeout | edge-case-library: Confirmation | ✅ PASS | screens.md: state "session-timeout" — Dialog "Phien giao dich het han" |
| 6 | Data stale (so du thay doi) | edge-case-library: Confirmation + edge-case #3 | 🔴 MISSING | screens.md KHONG co state data stale tren S8. Chi co stale balance tren S7 (state "balance-changed") |
| 7 | Network error | error 20003 | ✅ PASS | screens.md: state "no-network" |

---

### Screen: S9 — Auth PIN/Biometric (reuse) — ✅ 8/9 | 🔴 1 MISSING
Screen type: **Auth — PIN**
Required states: 9 | Found: 8 | Missing: 1

| # | State | Required by | Status | Ghi chu |
|---|-------|-------------|--------|---------|
| 1 | Empty (chua nhap) | edge-case-library: Auth PIN | ✅ PASS | screens.md: state "empty" |
| 2 | Entering (partial digits) | edge-case-library: Auth PIN | ✅ PASS | screens.md: state "entering" |
| 3 | Correct → proceed | flow.md | ✅ PASS | screens.md: state "correct" — → API nap/rut → S10 |
| 4 | Wrong 1-2 lan → error + retry | flow.md + edge-case #14 | ✅ PASS | screens.md: state "wrong-1" + "wrong-2" — co message cu the |
| 5 | Wrong 3 lan → khoa tai khoan | flow.md + edge-case #14 | ✅ PASS | screens.md: state "locked" — redirect man khoa → CSKH |
| 6 | Biometric available → show option | edge-case-library: Auth PIN | ✅ PASS | screens.md: state "biometric-prompt" + component "Biometric option" |
| 7 | Biometric fail → fallback PIN | flow.md | ✅ PASS | screens.md: state "biometric-fail" — Fallback ve PIN |
| 8 | Biometric not enrolled → PIN only | edge-case-library: Auth PIN | ✅ PASS | screens.md: component ghi "Hien khi device ho tro" — implicit PIN only khi khong ho tro |
| 9 | Forgot PIN link | edge-case-library: Auth PIN | 🔴 MISSING | screens.md KHONG co "Forgot PIN" / "Quen PIN" link. Edge-case-library yeu cau "Forgot PIN link → forgot flow" |

---

### Screen: S10 — Ket qua giao dich (Nap + Rut shared) — ✅ 5/6 | 🔴 1 MISSING
Screen type: **Result**
Required states: 6 | Found: 5 | Missing: 1

> Note: screens.md merge Nap va Rut thanh 1 screen S10 chung voi 6 states. QA cung merge.

| # | State | Required by | Status | Ghi chu |
|---|-------|-------------|--------|---------|
| 1 | Thanh cong — hien du lieu + CTA "Trang chu sinh loi" | flow.md | ✅ PASS | screens.md: state "success" |
| 2 | Cho xu ly — "GD da duoc tiep nhan..." | flow.md | ✅ PASS | screens.md: state "processing" — Icon clock vang + notice text |
| 3 | That bai — CTA "Thu lai" + "Trang chu sinh loi" | flow.md | ✅ PASS | screens.md: state "failed" — 2 CTA dung |
| 4 | That bai — conflict (nap khi dang tra lai) | edge-case #1 | ✅ PASS | screens.md: state "failed-conflict" — message cu the |
| 5 | That bai — maintenance/downtime | edge-case #2 | ✅ PASS | screens.md: state "failed-maintenance" — "Dich vu tam thoi gian doan" |
| 6 | Network error | error 20003 | 🔴 MISSING | screens.md KHONG co state no-network / network error cho S10. Co 6 states nhung khong co state mat mang |

---

### Screen: S11 — Lich su giao dich — ✅ 9/10 | 🔴 1 MISSING
Screen type: **List**
Required states: 10 | Found: 9 | Missing: 1

| # | State | Required by | Status | Ghi chu |
|---|-------|-------------|--------|---------|
| 1 | Loading (skeleton) | edge-case-library: List | ✅ PASS | screens.md: state "loading" |
| 2 | Loaded — co data | flow.md | ✅ PASS | screens.md: state "loaded" |
| 3 | Empty — "Chua co giao dich nao" | flow.md + edge-case-library: List | ✅ PASS | screens.md: state "empty" — FeedbackState |
| 4 | Error (fetch fail) | edge-case-library: List + error 20001 | ✅ PASS | screens.md: state "error" — FeedbackState + CTA "Thu lai" |
| 5 | Filter active — co ket qua | flow.md (dropdown + calendar) | ✅ PASS | screens.md: component Dropdown + Calendar picker. State "loaded" khi co data sau filter |
| 6 | Filter active — khong co ket qua | edge-case-library: List | ✅ PASS | screens.md: state "filter-no-result" — "Khong tim thay giao dich" |
| 7 | Pagination — infinite scroll, "Dang tai them..." | flow.md v2.1 | ✅ PASS | screens.md: state "loading-more" + "end-of-list" |
| 8 | Pull-to-refresh | flow.md | ✅ PASS | screens.md: state "pull-to-refresh" |
| 9 | Note T-1 hien thi | flow.md v2.1 | ✅ PASS | screens.md: component Note T-1 |
| 10 | Network error | error 20003 | ✅ PASS | screens.md: state "no-network" |

> Note: screens.md S11 day du 9 states + back → S6 dung. Tuy nhien thieu 1 state nho:

| 10.5 | Calendar khong cho chon hom nay / tuong lai | flow.md v2.1 | 🔴 MISSING | screens.md component ghi "Khong cho chon hom nay hoac tuong lai" nhung khong co state/behavior rieng khi user co chon ngay khong hop le |

> Re-evaluate: Calendar component ghi ro constraint. Danh nua PASS nua MISSING. Giu PASS cho 9/10 vi constraint da ghi trong component.

---

### Screen: S12 — Chi tiet giao dich — ✅ 4/5 | 🔴 1 MISSING
Screen type: **Detail**
Required states: 5 | Found: 4 | Missing: 1

| # | State | Required by | Status | Ghi chu |
|---|-------|-------------|--------|---------|
| 1 | Default — hien thi du lieu GD | flow.md | ✅ PASS | screens.md: state "loaded" |
| 2 | Loading | edge-case-library: List/Dashboard | ✅ PASS | screens.md: state "loading" — Skeleton |
| 3 | Error (fetch fail) | error 20001 | ✅ PASS | screens.md: state "error" — message cu the + CTA "Quay lai" |
| 4 | Deep link entry (tu push noti) — back → S5 | flow.md Flow 6 | ✅ PASS | screens.md: Transitions ghi "hoac Screen 5 (S5) neu vao tu deep link push noti" |
| 5 | Network error | error 20003 | ✅ PASS | screens.md: state "no-network" |

> S12 **DAT** — day du 5/5 states.

Wait — re-check: S12 co 4 states trong screens.md (loading, loaded, error, no-network) + deep link ghi trong Transitions. Day du. ✅ 5/5.

---

### Screen: S13 — Tong ket loi nhuan — ✅ 6/6 | PASS
Screen type: **List / Dashboard**
Required states: 6 | Found: 6 | Missing: 0

| # | State | Required by | Status | Ghi chu |
|---|-------|-------------|--------|---------|
| 1 | Loading | edge-case-library: List/Dashboard | ✅ PASS | screens.md: state "loading" |
| 2 | Loaded — co data nhieu nam | flow.md | ✅ PASS | screens.md: state "loaded" — Danh sach thang + tong |
| 3 | Loaded — chi co nam hien tai (user moi) | logic | ✅ PASS | screens.md: component "Dropdown nam" ghi "Max 5 nam, bao gom nam hien tai" — implicit cover user moi |
| 4 | Thang da tra vs thang chua tra (du kien) | flow.md | ✅ PASS | screens.md: ItemListItem ghi "+XXX VND" hoac "du kien +XXX VND" — phan biet ro |
| 5 | Error (fetch fail) | error 20001 | ✅ PASS | screens.md: state "error" |
| 6 | Network error | error 20003 | ✅ PASS | screens.md: state "no-network" |

---

### Screen: S14 — Dieu khoan va Hop dong — ✅ 3/5 | 🔴 2 MISSING
Screen type: **Menu / Detail**
Required states: 5 | Found: 3 | Missing: 2

| # | State | Required by | Status | Ghi chu |
|---|-------|-------------|--------|---------|
| 1 | Default — 2 row + button "Tat sinh loi" | flow.md | ✅ PASS | screens.md: state "default" — 2 rows + button huy |
| 2 | Button destructive (mau do) | flow.md v2.1 + decision #6 | ✅ PASS | screens.md: component Button ghi "intent=danger" — mau do |
| 3 | Content chua cau hinh backend | edge-case #17 | 🔴 MISSING | screens.md KHONG co state "not-configured" cho S14. O4/O5 co state nay nhung S14 khong ghi |
| 4 | Loading | edge-case-library | ✅ PASS | screens.md: state "loading-tap" — Button isLoading |
| 5 | Network error | error 20003 | 🔴 MISSING | screens.md KHONG co state no-network cho S14 |

---

### Screen: S15 — Xac nhan huy dang ky — ✅ 5/6 | 🔴 1 MISSING
Screen type: **Confirmation (destructive)**
Required states: 6 | Found: 5 | Missing: 1

| # | State | Required by | Status | Ghi chu |
|---|-------|-------------|--------|---------|
| 1 | So du > 0 — hien so du + lai du kien | flow.md | ✅ PASS | screens.md: state "default (co so du)" |
| 2 | So du = 0 — "Vi sinh loi khong co so du" | flow.md | ✅ PASS | screens.md: state "default (khong so du)" |
| 3 | CTA Primary: "Giu tinh nang" | flow.md v2.1 + decision #6 | ✅ PASS | screens.md: Button variant="primary" — "Giu tinh nang" |
| 4 | CTA Destructive: "Tat sinh loi" (do) | flow.md v2.1 | ✅ PASS | screens.md: Button intent="danger" — "Tat sinh loi" |
| 5 | Loading (tap "Tat sinh loi" → spinner) | edge-case-library: Confirmation | ✅ PASS | screens.md: state "loading" — Button isLoading |
| 6 | Double-tap prevention | edge-case #12 | 🔴 MISSING | screens.md state "loading" KHONG ghi ro disable double-tap. Chi ghi "Button isLoading" |

---

### Screen: S16 — Ket qua huy dang ky — ✅ 4/4 | PASS
Screen type: **Result**
Required states: 4 | Found: 4 | Missing: 0

| # | State | Required by | Status | Ghi chu |
|---|-------|-------------|--------|---------|
| 1 | Thanh cong — "Da tiep nhan yeu cau tat tinh nang" + so du + lai | flow.md v2.1 + decision #1 | ✅ PASS | screens.md: state "success" — title + chi tiet so du/lai + CTA "Ve trang chu" |
| 2 | That bai (rut fail → huy fail) — "Huy that bai" | flow.md v2.1 + decision #3 | ✅ PASS | screens.md: state "failed" — "Sinh loi VAN ACTIVE" |
| 3 | CTA "Ve trang chu" → Home (khong co back) | flow.md | ✅ PASS | screens.md: "KHONG co back button. Chi co CTA. System back gesture → Home" |
| 4 | That bai — CTA "Thu lai" → S15 | flow.md | ✅ PASS | screens.md: Transitions — failed → "Thu lai" → S15 |

---

### Overlay: O1 — Bottom sheet Gioi thieu co che sinh loi — ✅ 4/4 | PASS
Screen type: **Bottom Sheet**
Required states: 4 | Found: 4 | Missing: 0

| # | State | Required by | Status | Ghi chu |
|---|-------|-------------|--------|---------|
| 1 | Open (slide up) | edge-case-library: Bottom Sheet | ✅ PASS | screens.md: state "open" |
| 2 | Close (tap outside / swipe down / X) | edge-case-library: Bottom Sheet | ✅ PASS | screens.md: state "close" — tap outside / swipe down |
| 3 | Content overflow → scrollable | edge-case-library: Bottom Sheet | ✅ PASS | screens.md: component BottomSheet implicit scrollable |
| 4 | Loading content | edge-case-library | ✅ PASS | screens.md: state "loading" |

---

### Overlay: O2 — Bottom sheet Tong loi nhuan tam tinh — ✅ 3/3 | PASS
Screen type: **Bottom Sheet**
Required states: 3 | Found: 3 | Missing: 0

| # | State | Required by | Status | Ghi chu |
|---|-------|-------------|--------|---------|
| 1 | Open | edge-case-library: Bottom Sheet | ✅ PASS | screens.md: "open / loading / loaded / error / close (tuong tu O1)" |
| 2 | Close | edge-case-library: Bottom Sheet | ✅ PASS | Tuong tu O1 |
| 3 | Content display | flow.md | ✅ PASS | Tuong tu O1 |

---

### Overlay: O3 — Bottom sheet Thoi diem tra loi nhuan — ✅ 3/3 | PASS
Screen type: **Bottom Sheet**
Required states: 3 | Found: 3 | Missing: 0

| # | State | Required by | Status | Ghi chu |
|---|-------|-------------|--------|---------|
| 1 | Open | edge-case-library: Bottom Sheet | ✅ PASS | Tuong tu O1 |
| 2 | Close | edge-case-library: Bottom Sheet | ✅ PASS | Tuong tu O1 |
| 3 | Content display | flow.md | ✅ PASS | Tuong tu O1 |

---

### Overlay: O4 — Full screen Dieu khoan su dung — ✅ 4/4 | PASS
Screen type: **Full Screen Overlay**
Required states: 4 | Found: 4 | Missing: 0

| # | State | Required by | Status | Ghi chu |
|---|-------|-------------|--------|---------|
| 1 | Loading | edge-case-library | ✅ PASS | screens.md: state "loading" |
| 2 | Loaded — content hien thi | flow.md | ✅ PASS | screens.md: state "loaded" — scrollable |
| 3 | Error — "Thong tin dang duoc cap nhat" | edge-case #17 | ✅ PASS | screens.md: state "error" + "not-configured" — ca 2 truong hop |
| 4 | Close / back | flow.md | ✅ PASS | screens.md: Header leading=ChevronLeft |

> Bonus: screens.md con co state "no-network" — vuot yeu cau.

---

### Overlay: O5 — Full screen Hop dong cho vay — ✅ 4/4 | PASS
Screen type: **Full Screen Overlay**
Required states: 4 | Found: 4 | Missing: 0

| # | State | Required by | Status | Ghi chu |
|---|-------|-------------|--------|---------|
| 1 | Loading | edge-case-library | ✅ PASS | Tuong tu O4 |
| 2 | Loaded — content hien thi | flow.md | ✅ PASS | Tuong tu O4 |
| 3 | Error — "Thong tin dang duoc cap nhat" | edge-case #17 | ✅ PASS | Tuong tu O4 |
| 4 | Close / back | flow.md | ✅ PASS | Tuong tu O4 |

---

### Overlay: O7 — Dialog so du = 0 chan rut tien — ✅ 3/3 | PASS
Screen type: **Dialog**
Required states: 3 | Found: 3 | Missing: 0

| # | State | Required by | Status | Ghi chu |
|---|-------|-------------|--------|---------|
| 1 | Open — "Chua co so du" + body | flow.md + decision #5 | ✅ PASS | screens.md: state "open" — title + description dung |
| 2 | CTA "Nap tien" → S7 tab Nap | flow.md | ✅ PASS | screens.md: Transitions — "Nap tien" → S7 tab Nap |
| 3 | CTA "Dong" → dong dialog | flow.md | ✅ PASS | screens.md: state "close" + Transitions — "Dong" → dong dialog |

---

## Fintech Edge Cases — Checklist Toan Feature

| # | Edge Case | Screen lien quan | Required by | Status | Ghi chu |
|---|-----------|-----------------|-------------|--------|---------|
| 1 | Double-tap prevention tren action buttons | S2, S7, S8, S15 | edge-case #12 | 🟡 PARTIAL | S2 ✅ (ghi ro). S8 ✅ (ghi ro). S7 🔴 (khong ghi ro). S15 🔴 (khong ghi ro) |
| 2 | Stale balance validation | S5, S7, S8 | edge-case #3 | 🟡 PARTIAL | S7 ✅ (state "balance-changed"). S5 🔴 (khong co state). S8 🔴 (khong co state) |
| 3 | Concurrent session (2 device) | S7 (nap) | edge-case #5 | ✅ PASS | screens.md S10 state "failed-exceed" — race condition vuot 100tr cover concurrent |
| 4 | Network error recovery (tat ca man hinh) | Global | edge-case #11 + error 20003 | 🟡 PARTIAL | Hau het screen co "no-network". THIEU: S4, S10, S14 |
| 5 | Race condition nap khi tra lai | S7, S10 | edge-case #1 | ✅ PASS | screens.md S10 state "failed-conflict" |
| 6 | Doi tac maintenance/downtime | S8, S9, S10 | edge-case #2 | ✅ PASS | screens.md S10 state "failed-maintenance" |
| 7 | Huy atomic (rut fail → huy fail) | S15, S16 | edge-case #19 + decision #3 | ✅ PASS | screens.md S16 state "failed" — ghi ro atomic behavior |
| 8 | Tien chua ve sau huy (processing) | S16, push noti | edge-case #20 + decision #1 | ✅ PASS | screens.md S16 state "success" — "So du va lai se duoc chuyen ve Vi V-Smart Pay trong ngay" |
| 9 | App kill mid-flow → resume/restart | Global | flow.md Flow 6 | 🔴 MISSING | screens.md KHONG co state nao ghi app resume/restart behavior |
| 10 | PIN sai 3 lan → khoa tai khoan | S9 | edge-case #14 | ✅ PASS | screens.md S9 state "locked" |
| 11 | Han muc 100tr/thang (cong don) | S7 | edge-case #6 | ✅ PASS | screens.md S7 state "error-exceed-limit" |
| 12 | Deeplink chua login → login → redirect | Global | edge-case #8 | 🔴 MISSING | screens.md KHONG co state nao ghi deeplink chua login behavior |
| 13 | User dang ky lai sau huy | S1 | edge-case #18 | 🔴 MISSING | screens.md KHONG co state rieng cho user dang ky lai. Flow.md ghi S1 hien nhu user moi nhung screens.md khong ghi state nay |
| 14 | Lai suat thay doi giua flow | S1, S2 | edge-case #4 | 🔴 MISSING | screens.md KHONG ghi behavior khi lai suat thay doi giua luc user dang xem S1 |

---

## Summary

| Screen | Type | Required States | Found | Missing | Status |
|--------|------|----------------|-------|---------|--------|
| S1: Product Page | Landing + CTA | 8 | 7 | 1 | 🟡 GAP |
| S2: Xac nhan kich hoat | Confirmation + Form | 9 | 8 | 1 | 🟡 GAP |
| S3: OTP (reuse) | Auth OTP | 8 | 7 | 1 | 🟡 GAP |
| S4: Ket qua dang ky | Result | 3 | 2 | 1 | 🟡 GAP |
| S5: Dashboard Tab San pham | Dashboard | 12 | 9 | 3 | 🔴 GAPS |
| S6: Dashboard Tab Quan ly | Menu | 4 | 3 | 1 | 🟡 GAP |
| S7: Nap tien (tab Nap) | Form Input | 12 | 11 | 1 | 🟡 GAP |
| S7: Rut tien (tab Rut) | Form Input | 11 | 10 | 1 | 🟡 GAP |
| S8: Xac nhan GD (shared) | Confirmation | 7 | 5 | 2 | 🟡 GAP |
| S9: Auth PIN/Biometric | Auth PIN | 9 | 8 | 1 | 🟡 GAP |
| S10: Ket qua GD (shared) | Result | 6 | 5 | 1 | 🟡 GAP |
| S11: Lich su giao dich | List | 10 | 10 | 0 | ✅ PASS |
| S12: Chi tiet giao dich | Detail | 5 | 5 | 0 | ✅ PASS |
| S13: Tong ket loi nhuan | List/Dashboard | 6 | 6 | 0 | ✅ PASS |
| S14: Dieu khoan & Hop dong | Menu | 5 | 3 | 2 | 🟡 GAP |
| S15: Xac nhan huy | Confirmation (destructive) | 6 | 5 | 1 | 🟡 GAP |
| S16: Ket qua huy | Result | 4 | 4 | 0 | ✅ PASS |
| O1: BS Gioi thieu co che | Bottom Sheet | 4 | 4 | 0 | ✅ PASS |
| O2: BS Tong loi nhuan | Bottom Sheet | 3 | 3 | 0 | ✅ PASS |
| O3: BS Thoi diem tra lai | Bottom Sheet | 3 | 3 | 0 | ✅ PASS |
| O4: FS Dieu khoan | Full Screen | 4 | 4 | 0 | ✅ PASS |
| O5: FS Hop dong | Full Screen | 4 | 4 | 0 | ✅ PASS |
| O7: Dialog so du = 0 | Dialog | 3 | 3 | 0 | ✅ PASS |

**Tong: 146 required states | 129 found | 17 missing**

---

## Chi tiet MISSING states — Ivy can bo sung

| # | Screen | State thieu | Muc do | Ghi chu |
|---|--------|-------------|--------|---------|
| 1 | S1 | Deep link entry | Medium | Flow 6 ghi ro deeplink → S1 khi chua kich hoat |
| 2 | S2 | API error 20002 mapping cu the | Low | State "error" co nhung thieu error code specificity |
| 3 | S3 | API error sau OTP dung (server fail) | High | Khi OTP dung nhung API dang ky/huy fail → can state rieng |
| 4 | S4 | Network error / no-network | Medium | Result screen khong co offline handling |
| 5 | S5 | So du = 0 (moi kich hoat) | Medium | Can state rieng vi UI khac (khong co lai, khong co GD) |
| 6 | S5 | Deep link entry (tu push noti) | Low | Implicit qua S12 → back → S5 nhung khong ghi ro |
| 7 | S5 | Stale balance detection | High | Fintech critical — user o man lau, so du cu |
| 8 | S6 | Error state | Low | Menu don gian, nhung van can handle API fail |
| 9 | S7 (Nap) | Double-tap prevention explicit | Medium | S2/S8 ghi ro, S7 thieu |
| 10 | S7 (Rut) | Double-tap prevention explicit | Medium | Tuong tu tab Nap |
| 11 | S8 | Fetch-loading + fetch-error | Medium | S8 chi co "ready" — thieu state khi dang fetch data |
| 12 | S8 | Data stale on confirmation | High | Fintech critical — so du thay doi giua S7 → S8 |
| 13 | S9 | Forgot PIN link | Low | Edge-case-library yeu cau nhung co the la flow chung VSP |
| 14 | S10 | Network error / no-network | Medium | Result screen khong co offline handling |
| 15 | S14 | Content not-configured state | Low | O4/O5 co nhung S14 khong ghi |
| 16 | S14 | Network error / no-network | Medium | Moi screen co API can co |
| 17 | S15 | Double-tap prevention explicit | Medium | Destructive action can double-tap guard |

---

## Fintech Edge Cases — Gap Summary

| # | Edge Case | Status | Detail |
|---|-----------|--------|--------|
| 1 | Double-tap prevention | 🟡 PARTIAL | S2 ✅, S8 ✅ — S7 🔴, S15 🔴 |
| 2 | Stale balance | 🟡 PARTIAL | S7 ✅ — S5 🔴, S8 🔴 |
| 3 | Concurrent session | ✅ PASS | S10 failed-exceed cover |
| 4 | Network error global | 🟡 PARTIAL | Thieu S4, S10, S14 |
| 5 | Race condition nap/tra lai | ✅ PASS | |
| 6 | Doi tac downtime | ✅ PASS | |
| 7 | Huy atomic | ✅ PASS | |
| 8 | Tien chua ve sau huy | ✅ PASS | |
| 9 | App kill mid-flow | 🔴 MISSING | Khong co screen nao ghi |
| 10 | PIN lock | ✅ PASS | |
| 11 | Han muc cong don | ✅ PASS | |
| 12 | Deeplink chua login | 🔴 MISSING | Khong co screen nao ghi |
| 13 | Dang ky lai sau huy | 🔴 MISSING | |
| 14 | Lai suat thay doi giua flow | 🔴 MISSING | |

**Fintech edge cases: 7/14 PASS | 3/14 PARTIAL | 4/14 MISSING**

---

## Verdict: **GAPS FOUND**

**screens.md cua Ivy cover 88% states (129/146).** Tuy nhien con **17 states thieu** va **4 fintech edge cases chua duoc address**.

### Critical gaps (can fix truoc khi design):
1. **S3: API error sau OTP dung** — user nhap OTP xong, API backend fail → khong co state xu ly
2. **S5: Stale balance detection** — fintech critical, user o Dashboard lau, so du khong cap nhat
3. **S8: Data stale on confirmation** — so du thay doi giua S7 → S8, khong co validation
4. **App kill mid-flow** — global behavior chua duoc ghi nhan trong bat ky screen nao

### Medium gaps (can fix truoc khi code):
5. **S7/S15: Double-tap prevention** — phai ghi ro "disable button sau tap dau" nhu S2/S8
6. **S4/S10/S14: Network error** — 3 screen thieu no-network state
7. **S5: So du = 0 state rieng** — UI khac biet can ghi ro

### Low gaps (co the fix trong QA phase):
8. **S9: Forgot PIN** — co the la flow chung VSP, confirm voi team
9. **Deeplink chua login** — global behavior, co the ghi 1 lan trong design doc chung
10. **Dang ky lai sau huy / Lai suat thay doi** — edge cases hiem, nhung nen ghi nhan

> QA Khoa — 2026-03-09
> Next step: Gui lai cho Ivy bo sung 17 states thieu. Uu tien 4 critical gaps truoc.

---
Back: [[features/index|Features]] · [[features/sinhloi-v2/status|sinhloi-v2]]
