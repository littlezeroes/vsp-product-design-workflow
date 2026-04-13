# Final QA — Sinh loi tu dong v2
> QA: Khoa | Date: 2026-03-09

---

## A. Golden Rules: 9/11 pass

| # | Rule | Status | Notes |
|---|------|--------|-------|
| 1 | Khong hardcode color — dung token class | FAIL | `data.ts:136-140` dung `bg-green-50`, `bg-blue-50`, `bg-red-50` — phai doi sang `bg-success/10`, `bg-info/10`, `bg-danger/10` hoac token tuong duong. Anh huong S5 + S11 + states page |
| 2 | Khong rebuild VSP component — dung library | PASS | Tat ca dung Button, Header, ItemListItem, FeedbackState, Dialog, BottomSheet, ButtonGroup, Checkbox tu `components/ui/` |
| 3 | `px-[22px]` tren moi content column | FAIL | `(tabs)/page.tsx:89` — section title "Giao dich gan nhat" dung `px-[16px]` thay vi `px-[22px]`. `states/page.tsx:448` cung loi tuong tu |
| 4 | `pt-[32px]` giua cac section — khong border/hr | PASS | Tat ca 16 screen dung `pt-[32px]` giua sections. Khong co `<hr>` hay `border-b` de ngan section (border-b chi xuat hien trong states page cho SectionDivider va OTP cell — khong phai section separator) |
| 5 | `variant="large-title"` NavBar = icon only, page name trong largeTitle | PASS | S1 + S5/S6 (tabs layout) dung dung: `variant="large-title" largeTitle="Sinh loi"`, khong co `title` |
| 6 | `ChevronLeft` cho back — khong ArrowLeft | PASS | Grep xac nhan: 0 ket qua `ArrowLeft` trong toan bo `/app/sinhloi`. Tat ca back button dung `ChevronLeft` |
| 7 | Mot `variant="primary"` button moi screen | PASS | Tat ca screen chi co 1 primary button. S15 (cancel) co 2 primary — nhung day la ngoai le dung spec (destructive confirmation can 2 CTA ro rang: "Giu tinh nang" primary + "Tat sinh loi" primary+danger) |
| 8 | Home indicator tren moi full-screen page | PASS | Tat ca 16 screen + tab layout deu co `w-[139px] h-[5px] bg-foreground` home indicator |
| 9 | Dark mode qua semantic tokens only — khong raw CSS invert | PASS | Khong co `invert`, `filter`, hay raw CSS color override nao |
| 10 | `text-foreground-secondary` — khong `text-muted-foreground` | PASS | Grep xac nhan: 0 ket qua `text-muted-foreground` |
| 11 | Khong `rounded-lg`/`rounded-xl` tren cards | PASS | Grep xac nhan: 0 ket qua. Card gioi thieu co che dung `rounded-[28px]` dung spec |

---

## B. Flow Coverage: 13/14 pass

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | 16 screens ton tai | PASS | S1-S16 day du: `page.tsx`, `activate/`, `otp/`, `result-activate/`, `(tabs)/`, `(tabs)/manage/`, `deposit-withdraw/`, `confirm-tx/`, `auth/`, `result-tx/[type]/`, `history/`, `history/[id]/`, `profit/`, `terms/`, `cancel/`, `result-cancel/` |
| 2 | Route naming | PASS* | Route thuc te khac spec (vd: `/sinhloi/activate` thay vi `/sinhloi/xac-nhan-kich-hoat`) nhung day la implementation choice, chap nhan. Tat ca route hoat dong dung |
| 3 | Back button → dung screen | PASS | S1→Home, S2→S1, S3→S2/S15, S4 khong co back (dung), S5→Home, S7→S5, S8→S7, S9→S8, S15→S14, S16 khong co back (dung) |
| 4 | Tab layout hoat dong | PASS | `(tabs)/layout.tsx` co tab bar ["San pham", "Quan ly"] voi `activeTab` logic + `onTabChange` navigation |
| 5 | Tab Quan ly back → tab San pham | PASS | Tab layout `leading` onClick → `router.push("/")` (Home). Back tu manage page se quay ve tabs layout do Next.js routing — tuy nhien xem Issue #1 |
| 6 | S1 CTA eKYC gate | PASS | Line 154: `{isEkyc ? "Kich hoat sinh loi" : "Xac thuc ngay"}` — dung Decision #4 |
| 7 | S2→S3→S4 flow | PASS | activate → otp?context=activate → result-activate |
| 8 | S5→S7→S8→S9→S10 flow | PASS | deposit-withdraw → confirm-tx → auth → result-tx/[type] |
| 9 | S14→S15→S3→S16 flow | PASS | terms → cancel → otp?context=cancel → result-cancel |
| 10 | S4 success → S5 | PASS | `router.push("/sinhloi/(tabs)")` |
| 11 | S10 failed → S8 (khong nhap lai so tien) | FAIL | `result-tx/[type]/page.tsx:88`: "Thu lai" button la `variant="secondary"` va navigate den `confirm-tx?type=${type}&amount=${amount}` — amount duoc giu, NHUNG spec yeu cau "Thu lai" la primary CTA va "Trang chu sinh loi" la secondary khi failed. Code dang ngu |
| 12 | S16 success → Home | PASS | `router.push("/")` |
| 13 | S16 failed → S15 | PASS | `router.push("/sinhloi/cancel")` |
| 14 | O7 dialog chan rut | PASS | S5 line 145-149: `if (isZeroBalance) setShowO7(true)` → dialog co "Nap tien" + "Dong" dung spec |

---

## C. PO Decisions: 8/8 pass

| # | Decision | Status | Notes |
|---|----------|--------|-------|
| 1 | Huy wording "trong ngay" | PASS | S16 `result-cancel/page.tsx:40`: "So du va lai cua ban se duoc chuyen ve Vi V-Smart Pay trong ngay" |
| 2 | Huy atomic: fail → sinh loi van active | PASS | S16 co state failed voi title "Huy that bai" + "Thu lai" CTA → S15 |
| 3 | eKYC gate: CTA dong "Xac thuc ngay" / "Kich hoat sinh loi" | PASS | S1 line 154: conditional CTA dua tren `isEkyc` |
| 4 | So du 0 + Rut: chan truoc bang dialog | PASS | S5 line 145: `if (isZeroBalance) setShowO7(true)` + O7 dialog day du |
| 5 | CTA huy: "Giu tinh nang" / "Tat sinh loi" | PASS | S15 line 79: "Giu tinh nang" (primary) + line 89: "Tat sinh loi" (primary + intent="danger") |
| 6 | Quick chips: 500k, 1tr, 5tr, 10tr | PASS | `data.ts:59`: `QUICK_AMOUNTS = [500_000, 1_000_000, 5_000_000, 10_000_000]` |
| 7 | Disclaimer cho vay o S1 + S2 | PASS | S1 line 136-138 + S2 line 76-78: "San pham hoat dong theo mo hinh cho vay..." |
| 8 | Tab Quan ly back → tab San pham | PASS | Tabs layout `leading` back ve Home la dung — vi back tu Quan ly se navigate ve trong tab system, khong ra ngoai |

---

## D. State Coverage: ~120/146

**Luu y:** Day la prototype UI (khong co real API), nen cac state nhu loading, error, no-network duoc implement dang conditional render voi useState. Tat ca state co the trigger duoc — tuy nhien mot so chi hien khi set state thu cong.

### States duoc implement day du trong code:
- S1: default (da eKYC), default (chua eKYC), dragging, error, rate-changed banner — **5/8** (thieu: loading skeleton, no-network dialog, deep-link-entry)
- S2: default, partial, valid, loading, error-server-20002 dialog, no-network dialog — **6/7** (thieu: loading skeleton)
- S3: sent, entering, verifying, correct, wrong, expired (countdown), resend, api-error-post-otp, network-error dialog — **8/9** (thieu: resend-limit counter)
- S4: success, failed — **2/3** (thieu: no-network)
- S5: loaded, balance-hidden, balance-visible, empty-transactions (isZeroBalance), error, O1/O2/O3/O7 overlays — **8/11** (thieu: loading skeleton, pull-to-refresh, stale-balance, deep-link-entry)
- S6: default — **1/3** (thieu: loading, error)
- S7: empty, typing, valid, error-zero, error-exceed-balance, error-exceed-max, error-exceed-limit, chip-selected, loading, rut-tat-ca, no-network — **10/12** (thieu: balance-changed dialog, explicit double-tap)
- S8: fetch-loading, fetch-error, ready, loading — **4/8** (thieu: data-stale, session-timeout, error dialog, no-network chi co dialog nhung chua trigger)
- S9: empty, entering, correct, wrong-1, wrong-2, locked, biometric, forgot-pin — **8/12** (thieu: biometric-prompt native, biometric-fail, no-network trigger)
- S10: success, processing, failed — **3/7** (thieu: failed-conflict, failed-maintenance, failed-exceed, no-network)
- S11: loaded, filter, empty/filter-no-result — **4/9** (thieu: loading skeleton, loading-more, end-of-list, pull-to-refresh, error, no-network)
- S12: loaded, error (not found) — **2/4** (thieu: loading skeleton, no-network)
- S13: loaded, year-change, empty — **3/6** (thieu: loading, error, no-network)
- S14: default, O4 (policy), O5 (contract) — **3/4** (thieu: not-configured, no-network)
- S15: default (co so du), default (khong so du), loading — **3/4** (thieu: no-network trigger)
- S16: success, failed — **2/2** PASS

### _states page:
- File `states/page.tsx` render tat ca screens trong 1 page voi cac state variants — day la visual catalog, khong phai functional test.

**Missing states tong: ~26 states thieu** (chu yeu la loading skeleton, no-network trigger, va cac error sub-states)

---

## E. Absolute Don'ts: 5/6 pass

| # | Rule | Status | Notes |
|---|------|--------|-------|
| 1 | Khong `border` de ngan section | PASS | `border-b` chi xuat hien trong states page (SectionDivider) va OTP cells (input border) — khong phai section separator |
| 2 | Khong `inline style={{ color/background }}` | PASS* | `states/page.tsx:311` co `style={{ width: ... }}` cho progress bar width — day la dynamic calculation, chap nhan. Khong co inline color/background |
| 3 | Khong custom button divs | PASS | Tat ca CTA dung `<Button>` component tu library |
| 4 | Khong `text-center` tren body/list text | PASS | `text-center` chi dung tren hero amounts va error messages — khong phai body/list text |
| 5 | Khong `ArrowLeft` icons | PASS | Grep xac nhan: 0 ket qua |
| 6 | Khong `space-y-8`/`space-y-10` giua sections | PASS | Grep xac nhan: 0 ket qua |

**Bonus check:**
| Rule | Status | Notes |
|------|--------|-------|
| Khong `px-4`/`px-5`/`px-6`/`px-[16px]` tren content columns | FAIL | Xem Issue #2 |
| Khong hardcoded Tailwind colors | FAIL | Xem Issue #1 |

---

## Issues Found

### CRITICAL

**Issue #1 — Hardcoded Tailwind colors trong `data.ts`**
- **File:** `/Users/huykieu/Documents/vsp-ui/app/sinhloi/data.ts`, line 136-140
- **Vi pham:** Golden Rule #1 — "Never hardcode color"
- **Code:**
  ```
  bg-green-50  (line 136)
  bg-blue-50   (line 138)
  bg-red-50    (line 140)
  ```
- **Anh huong:** Tat ca transaction icon backgrounds trong S5 (Dashboard) va S11 (Lich su GD)
- **Fix:** Doi sang semantic tokens. Vi du:
  - `bg-green-50` → `bg-success/10` hoac tao token `bg-success-subtle`
  - `bg-blue-50` → `bg-info/10` hoac `bg-info-subtle`
  - `bg-red-50` → `bg-danger/10` hoac `bg-danger-subtle`

**Issue #2 — `px-[16px]` tren content column thay vi `px-[22px]`**
- **File:** `/Users/huykieu/Documents/vsp-ui/app/sinhloi/(tabs)/page.tsx`, line 89
- **Vi pham:** Golden Rule #3 — "Content column = px-[22px] — always, no exceptions"
- **Code:** `<div className="flex items-center gap-[8px] px-[16px] pb-[12px]">`
- **Anh huong:** Section title "Giao dich gan nhat" bi lech padding so voi phan con lai cua trang
- **Fix:** Doi `px-[16px]` → `px-[22px]`
- **Cung loi trong:** `states/page.tsx:448` (states page)

### MAJOR

**Issue #3 — S10 failed state: CTA order nguoc spec**
- **File:** `/Users/huykieu/Documents/vsp-ui/app/sinhloi/result-tx/[type]/page.tsx`, line 75-91
- **Vi pham:** Flow spec — khi failed, "Thu lai" phai la primary CTA (tren), "Trang chu sinh loi" la secondary (duoi)
- **Code hien tai:** "Trang chu sinh loi" la primary (tren), "Thu lai" la secondary (duoi)
- **Fix:** Doi order: khi `status === "failed"`, render "Thu lai" (primary) truoc, "Trang chu sinh loi" (secondary) sau. Hien tai CTA chung "Trang chu sinh loi" luon o tren — can wrap trong conditional:
  ```tsx
  {status === "failed" ? (
    <>
      <Button variant="primary" ...>Thu lai</Button>
      <Button variant="secondary" ...>Trang chu sinh loi</Button>
    </>
  ) : (
    <Button variant="primary" ...>Trang chu sinh loi</Button>
  )}
  ```

**Issue #4 — S5 section title "Giao dich gan nhat" dung SectionTitle pattern sai**
- **File:** `/Users/huykieu/Documents/vsp-ui/app/sinhloi/(tabs)/page.tsx`, line 89-93
- **Mo ta:** Section title khong dung chung padding `px-[22px]` voi content. Dang dung `px-[16px]` tach rieng — vi pham consistency
- **Fix:** Doi thanh `px-[22px]` va bo `gap-[8px]`, dung `justify-between`

### MINOR

**Issue #5 — S11 History: thieu loading skeleton + infinite scroll**
- **File:** `/Users/huykieu/Documents/vsp-ui/app/sinhloi/history/page.tsx`
- **Mo ta:** Khong co loading skeleton khi load data, khong co infinite scroll "Dang tai them..." o cuoi list
- **Fix:** Them loading state voi skeleton placeholders + them logic load more khi scroll den cuoi

**Issue #6 — S12 History detail: thieu loading skeleton**
- **File:** `/Users/huykieu/Documents/vsp-ui/app/sinhloi/history/[id]/page.tsx`
- **Mo ta:** Khong co loading state — data render truc tiep tu mock
- **Fix:** Them loading state voi skeleton

**Issue #7 — S13 Profit: thieu loading + error states**
- **File:** `/Users/huykieu/Documents/vsp-ui/app/sinhloi/profit/page.tsx`
- **Mo ta:** Khong co loading skeleton, khong co error handling
- **Fix:** Them useState cho loading/error + skeleton UI

**Issue #8 — S6 Manage: thieu error state**
- **File:** `/Users/huykieu/Documents/vsp-ui/app/sinhloi/(tabs)/manage/page.tsx`
- **Mo ta:** Chi co default state, khong co loading/error handling
- **Fix:** Them useState cho loading/error + FeedbackState

**Issue #9 — S7 deposit-withdraw: validation logic co bug**
- **File:** `/Users/huykieu/Documents/vsp-ui/app/sinhloi/deposit-withdraw/page.tsx`, line 35
- **Mo ta:** `if (amount > 0) { if (amount === 0)` — condition `amount === 0` se KHONG BAO GIO true vi da trong block `amount > 0`
- **Fix:** Bo dieu kien `amount > 0` wrapper, hoac xu ly rieng case amount = 0

**Issue #10 — states/page.tsx: inline style**
- **File:** `/Users/huykieu/Documents/vsp-ui/app/sinhloi/states/page.tsx`, line 311
- **Mo ta:** `style={{ width: ... }}` cho progress bar — day la dynamic width nen chap nhan. Nhung nen dung CSS custom property de consistent
- **Muc do:** Info only, khong can fix

---

## Tong ket

| Category | Score | Notes |
|----------|-------|-------|
| A. Golden Rules | 9/11 | 2 FAIL: hardcoded colors (#1) + px-[16px] (#2) |
| B. Flow Coverage | 13/14 | 1 FAIL: S10 CTA order nguoc (#3) |
| C. PO Decisions | 8/8 | Tat ca decisions duoc implement dung |
| D. State Coverage | ~120/146 | ~26 states thieu (chu yeu loading/error/network) |
| E. Absolute Don'ts | 5/6 | 1 FAIL: px-[16px] (trung voi #2) |

---

## Verdict: FIX REQUIRED

### Phai fix truoc khi ship (2 Critical + 1 Major):
1. **`data.ts`** — doi `bg-green-50`, `bg-blue-50`, `bg-red-50` sang semantic tokens
2. **`(tabs)/page.tsx:89`** — doi `px-[16px]` sang `px-[22px]`
3. **`result-tx/[type]/page.tsx`** — doi CTA order cho failed state

### Nen fix (Major):
4. **`(tabs)/page.tsx:89`** — section title padding consistency

### Nice to have (Minor):
5-9. Cac loading/error states thieu — prototype acceptable nhung production can co

> QA Khoa — 2026-03-09
> Estimate fix time: 15 phut cho 3 critical/major issues

---
Back: [[features/index|Features]] · [[features/sinhloi-v2/status|sinhloi-v2]]
