# User Flow — Sinh loi tu dong v2.1
> Designer: Nate | Date: 2026-03-09
> Based on: BRD v2.0 + PO answers + Duc review + PO decisions (2026-03-09)

---

## MVP Scope Recap
- **In:** Epic 1 (Dang ky) + Epic 2 (Quan ly, tru AC 2.6.1+2.6.2) + Epic 3 (chi Nap/Rut) + Epic 4 (Huy)
- **Out:** US 3.3 (Chuyen tien) + US 3.4 (Thanh toan) + AC 2.6.1 + AC 2.6.2
- **eKYC gate:** [FIXED] Khong block, khong disabled. User vao Product Page binh thuong, CTA = "Xac thuc ngay" (chua eKYC) hoac "Kich hoat sinh loi" (da eKYC)
- **Huy khi co balance:** [FIXED] Atomic — rut fail = huy fail. Tu dong rut ve vi chinh, xu ly trong ngay (khong instant)
- **Mo hinh:** Cho vay (can disclaimer)

---

## Entry Points

| # | Entry | Trigger | Dieu kien |
|---|-------|---------|-----------|
| E1 | Icon "Sinh loi" trong danh muc dich vu | User tap icon tren man Tat ca dich vu | Da login |
| E2 | Landing Page / Banner tren Home | User tap banner sinh loi tren Homepage | Da login |
| E3 | Universal Link / Deeplink | User tap link tu push noti, SMS, email | Da login (neu chua → login truoc → redirect) |
| E4 | Tab "Quan ly" → Dieu khoan & Hop dong → "Huy dang ky" | User muon huy | Da kich hoat sinh loi |

**Routing logic tai moi entry:**
- Chua kich hoat sinh loi → **Product Page** (Flow 1)
- Da kich hoat → **Dashboard** (Flow 2)

---

## Screen Inventory

| ID | Ten man hinh | Loai | Reuse? |
|----|-------------|------|--------|
| S1 | Product Page (Gioi thieu + Demo lai) | Screen | Moi |
| S2 | Xac nhan kich hoat | Screen | Moi |
| S3 | OTP | Screen | (reuse) Luong OTP chung VSP |
| S4 | Ket qua dang ky | Screen | (reuse) Result pattern chung |
| S5 | Dashboard — Tab San pham | Screen | Moi |
| S6 | Dashboard — Tab Quan ly | Screen | Moi |
| S7 | Nap/Rut tien (shared screen, switch tab) | Screen | Moi |
| S8 | Xac nhan giao dich (Nap hoac Rut) | Screen | Moi (tuong tu Confirm pattern VSP) |
| S9 | Xac thuc giao dich (PIN/Biometric) | Screen | (reuse) Luong auth chung VSP |
| S10 | Ket qua giao dich (Thanh cong/Cho xu ly/That bai) | Screen | (reuse) Result pattern chung |
| S11 | Lich su giao dich | Screen | Moi (tuong tu History pattern VSP) |
| S12 | Chi tiet giao dich | Screen | Moi (tuong tu History detail VSP) |
| S13 | Tong ket loi nhuan | Screen | Moi |
| S14 | Dieu khoan va Hop dong | Screen | Moi |
| S15 | Xac nhan huy dang ky | Screen | Moi |
| S16 | Ket qua huy dang ky | Screen | (reuse) Result pattern chung |

**Overlays / Bottom Sheets:**

| ID | Ten | Loai |
|----|-----|------|
| O1 | Bottom sheet: Gioi thieu co che sinh loi (AC 2.2.1) | Bottom Sheet |
| O2 | Bottom sheet: Tong loi nhuan tam tinh (AC 2.2.2) | Bottom Sheet |
| O3 | Bottom sheet: Thoi diem tra loi nhuan (AC 2.2.3) | Bottom Sheet |
| O4 | Full screen: Dieu khoan su dung | Full Screen |
| O5 | Full screen: Hop dong cho vay | Full Screen |
| O7 | [FIXED] Dialog: So du = 0 chan rut tien | Dialog |

> [FIXED] O6 (Dialog eKYC gate) da bi xoa — thay bang CTA dong tren S1 (xem Flow 1). Them O7 cho so du = 0.

---

## Sub-flows

### Flow 1: Dang ky sinh loi

**Tai sao can 4 screens (S1→S2→S3→S4)?**
- S1 (Product Page): Giai doan kham pha — user can hieu san pham truoc khi commit. Khong the merge voi S2 vi S1 co interaction phuc tap (progress bar demo lai) va noi dung giao duc dai.
- S2 (Xac nhan kich hoat): Giai doan cam ket phap ly — 2 checkbox bat buoc (T&C + hop dong cho vay). Tach rieng de user focus vao quyet dinh phap ly, khong bi distract boi content marketing.
- S3 (OTP): Reuse luong chung, khong the merge.
- S4 (Ket qua): Reuse pattern chung, khong the merge.

#### Happy Path
```
[E1/E2/E3] → [S1: Product Page] → tap "Kich hoat sinh loi" (da eKYC) → [S2: Xac nhan kich hoat]
  → tick 2 checkbox → tap "Xac nhan" → [S3: OTP (reuse)] → nhap OTP dung
  → [S4: Ket qua — Thanh cong] → tap "Xem chi tiet Sinh loi" → [S5: Dashboard]
```

#### Flow Diagram
```
[S1: Product Page]
  ├── [FIXED] CTA cuoi trang (da eKYC): "Kich hoat sinh loi" ──→ [S2: Xac nhan kich hoat]
  ├── [FIXED] CTA cuoi trang (chua eKYC): "Xac thuc ngay" ──→ Luong eKYC chung VSP
  │     └── Sau eKYC xong quay lai → CTA tu dong doi thanh "Kich hoat sinh loi"
  ├── keo progress bar ──→ cap nhat so tien demo + lai du kien (client-side)
  ├── [FIXED] Disclaimer cuoi trang: "San pham hoat dong theo mo hinh cho vay. Lai suat co the thay doi theo thoa thuan voi doi tac."
  └── back ──→ man hinh truoc (Home / Tat ca dich vu)

[S2: Xac nhan kich hoat]
  ├── thong tin hien thi: Ho ten, SDT, CCCD (tu eKYC data)
  ├── checkbox 1: Dong y chinh sach chia se du lieu → tap link ──→ [O4: Full screen Dieu khoan]
  ├── checkbox 2: Dong y hop dong cho vay voi cong ty ABC → tap link ──→ [O5: Full screen Hop dong]
  ├── ca 2 checkbox checked → button "Xac nhan" enabled
  ├── [FIXED] Disclaimer: "San pham hoat dong theo mo hinh cho vay. Lai suat co the thay doi theo thoa thuan voi doi tac."
  ├── tap "Xac nhan" ──→ [S3: OTP (reuse)]
  └── back ──→ [S1: Product Page]

[S3: OTP (reuse)]
  ├── OTP dung ──→ API dang ky ──→ [S4: Ket qua]
  ├── OTP sai ──→ hien loi + retry
  ├── OTP het han ──→ "Gui lai OTP"
  └── back ──→ [S2: Xac nhan kich hoat]

[S4: Ket qua dang ky]
  ├── Thanh cong ──→ "Hoan tat, xem chi tiet Sinh loi" ──→ [S5: Dashboard]
  ├── That bai ──→ "Thu lai" ──→ [S2: Xac nhan kich hoat]
  │                  "Ve trang chu" ──→ Home
  └── (khong co trang thai "Cho xu ly" cho dang ky — chi co thanh cong/that bai)
```

#### [FIXED] eKYC Gate — CTA dong (PO OVERRIDE)
```
Tren S1 Product Page:
  - Chua eKYC: CTA = "Xac thuc ngay" → di thang vao luong eKYC chung VSP
  - Da eKYC: CTA = "Kich hoat sinh loi" → chuyen sang S2

  Ly do PO: Bien blocker thanh motivation. User thay value san pham truoc (xem lai suat, keo demo)
  → muon eKYC de su dung. Khong can disabled button, khong can dialog.
  Khong co O6 nua.
```

---

### Flow 2: Dashboard (Quan ly)

**Tai sao can 2 tab thay vi 2 screen rieng?**
- Tab San pham + Tab Quan ly cung thuoc "Trang chu sinh loi". Dung tab bar de user switch nhanh giua xem thong tin realtime (San pham) va quan ly chi tiet (Quan ly) ma khong can navigate ra/vao.
- Tab bar nam phia tren, duoi header — theo pattern chuan VSP.

#### Tab San pham (S5)
```
[S5: Dashboard — Tab San pham]
  ├── Header: "Sinh loi"
  ├── So du hien tai: XXX VND + toggle an/hien
  ├── Lai suat: X%/nam
  ├── Tien loi hom qua: +XXX VND
  │     └── tap icon info ──→ [O2: Bottom sheet Tong loi nhuan tam tinh]
  ├── Tong tien loi: +XXX VND
  │     └── tap icon info ──→ [O3: Bottom sheet Thoi diem tra loi nhuan]
  ├── [FIXED] Section "3 GD gan nhat": hien 3 GD moi nhat (neu co), tap 1 GD ──→ [S12]
  │     └── Note: "Giao dich hom nay se hien thi vao ngay mai (T-1)"
  ├── Section gioi thieu co che ──→ tap ──→ [O1: Bottom sheet Gioi thieu sinh loi]
  ├── Button "Nap tien" ──→ [S7: Nap/Rut — tab Nap] (Flow 3)
  ├── [FIXED] Button "Rut tien":
  │     ├── So du > 0 ──→ [S7: Nap/Rut — tab Rut] (Flow 4)
  │     └── So du = 0 ──→ [O7: Dialog chan rut tien]
  ├── Pull-to-refresh ──→ reload so du + lai
  └── back ──→ Home
```

#### [FIXED] Dialog so du = 0 chan rut tien (O7)
```
[O7: Dialog chan rut tien]
  Title: "Chua co so du"
  Body: "Vi sinh loi chua co so du. Ban co muon nap tien?"
  CTA Primary: "Nap tien" → [S7: Nap/Rut — tab Nap]
  CTA Secondary: "Dong" → dong dialog, quay lai S5
```

#### Tab Quan ly (S6)
```
[S6: Dashboard — Tab Quan ly]
  ├── Row "Lich su giao dich" ──→ [S11: Lich su GD]
  ├── Row "Tong ket loi nhuan" ──→ [S13: Tong ket loi nhuan]
  ├── Row "Dieu khoan & Hop dong" ──→ [S14: Dieu khoan va Hop dong]
  └── [FIXED] back ──→ [S5: Dashboard — Tab San pham] (khong phai Home)
```

#### Sub-screens tu Tab Quan ly

**S11: Lich su giao dich**
```
[S11: Lich su giao dich]
  ├── Dropdown "Loai giao dich": Tat ca | Nap tien | Rut tien | Tra lai thang XX
  ├── Calendar picker: default 7 ngay gan nhat (T-1), max 90 ngay
  │     └── Khong cho chon ngay hom nay hoac tuong lai (T-1 rule)
  ├── [FIXED] Note: "Giao dich hom nay se hien thi vao ngay mai"
  ├── Danh sach GD: icon + loai + ngay + so tien (+/-)
  │     └── tap 1 GD ──→ [S12: Chi tiet giao dich]
  ├── [FIXED] Pagination: infinite scroll, 20 items/page, "Dang tai them..." o cuoi
  ├── Empty state: "Chua co giao dich nao"
  ├── Pull-to-refresh
  └── back ──→ [S6]
```

**S12: Chi tiet giao dich**
```
[S12: Chi tiet giao dich]
  ├── Loai giao dich
  ├── So tien
  ├── Trang thai
  ├── Ngay giao dich (dd/mm/yyyy)
  ├── Ma giao dich
  └── back ──→ [S11] (hoac [S5] neu vao tu deep link push — xem Flow 6)
```

**S13: Tong ket loi nhuan**
```
[S13: Tong ket loi nhuan]
  ├── Dropdown nam (max 5 nam, bao gom nam hien tai)
  │     └── Moi nam: danh sach thang (chi hien thang da tra lai hoac co lai tam tinh)
  │           ├── Thang da tra: +XXX VND
  │           └── Thang chua tra: "du kien" +XXX VND
  ├── Tong loi nhuan da nhan (cua nam dang xem): +XXX VND
  └── back ──→ [S6]
```

**S14: Dieu khoan va Hop dong**
```
[S14: Dieu khoan va Hop dong]
  ├── Row "Dieu khoan su dung" → tap ──→ [O4: Full screen Dieu khoan]
  ├── Row "Hop dong cho vay" → tap ──→ [O5: Full screen Hop dong]
  ├── [FIXED] Button "Tat sinh loi" (destructive, mau do) ──→ [S15: Xac nhan huy] (Flow 5)
  └── back ──→ [S6]
```

---

### Flow 3: Nap tien

**Tai sao Nap va Rut share cung 1 screen (S7)?**
- BRD da hint "Component Switch: Nap tien - Rut tien" — 2 tab tren cung 1 man hinh.
- Content tuong tu: nguon tien, so tien, lai du kien. Chi khac huong tien (vao/ra) va label.
- Giam cognitive load: user khong can nho 2 entry point khac nhau.

**Merge S7+S8:** [FIXED] Xem xet merge nhap so tien + xac nhan thanh 1 man (giam depth xuong 4). Neu merge: so tien phia tren, thong tin xac nhan phia duoi, CTA "Xac thuc giao dich" o cuoi. Tuy nhien giu 2 screen rieng trong flow nay de dam bao user review truoc khi commit. Team UI quyet dinh khi design.

#### Happy Path
```
[S5: Dashboard] → tap "Nap tien" → [S7: Nap/Rut — tab Nap]
  → nhap so tien hop le → tap "Tiep tuc" → [S8: Xac nhan GD Nap]
  → tap "Xac thuc giao dich" → [S9: Auth PIN/Biometric (reuse)]
  → xac thuc thanh cong → [S10: Ket qua — Thanh cong]
  → tap "Trang chu sinh loi" → [S5: Dashboard]
```

#### Flow Diagram
```
[S7: Nap/Rut — tab Nap]
  ├── Switch tab: "Nap tien" (active) | "Rut tien"
  ├── Hien thi: "Tu Vi V-Smart Pay" + so du vi chinh
  ├── Input so tien nap vao Vi Sinh loi (auto-focus, hien ban phim so)
  │     ├── = 0 ──→ inline error "So tien nap phai khac 0" + button disabled
  │     ├── > so du vi chinh ──→ inline error "So tien nap vuot qua so du nguon tien"
  │     ├── nap + so du sinh loi hien tai > 100tr ──→ inline error "So du vi sinh loi vuot qua 100 trieu VND"
  │     ├── vuot han muc 100tr/thang ──→ inline error "So tien nap vuot qua han muc"
  │     └── hop le ──→ button "Tiep tuc" enabled
  ├── [FIXED] Quick amount chips: 500k | 1tr | 5tr | 10tr
  ├── [FIXED] Hien thi: "Lai du kien cho so tien nay: +XXX VND/nam"
  ├── tap "Tiep tuc" ──→ [S8: Xac nhan GD Nap]
  └── back ──→ [S5: Dashboard]

[S8: Xac nhan GD Nap]
  ├── Header: "Xac nhan nap tien vao Vi sinh loi"
  ├── So tien
  ├── Service Title: "Nap tien sinh loi"
  ├── Phi: Mien phi
  ├── Nguon thanh toan: Vi V-Smart Pay
  ├── tap "Xac thuc giao dich" ──→ [S9: Auth (reuse)]
  │     └── Double-tap prevention: disable button sau tap dau tien
  └── back ──→ [S7: tab Nap] (giu nguyen data da nhap)

[S9: Auth PIN/Biometric (reuse)]
  ├── Xac thuc thanh cong ──→ API nap tien ──→ [S10: Ket qua]
  ├── PIN sai 1-2 lan ──→ error + retry
  ├── PIN sai 3 lan ──→ khoa tai khoan
  ├── Biometric that bai ──→ fallback PIN
  └── back ──→ [S8]

[S10: Ket qua GD Nap]
  ├── Thanh cong:
  │     ├── Hien thi: trang thai, so tien, thoi gian, ma GD, service title, nguon, phi
  │     ├── CTA: "Trang chu sinh loi" ──→ [S5]
  │     └── Push notification: "Ban da nap tien thanh cong voi so tien {{amount}} d"
  ├── Cho xu ly:
  │     ├── Hien thi: "GD da duoc tiep nhan va cho xu ly. Vui long kiem tra lai trong it phut..."
  │     └── CTA: "Trang chu sinh loi" ──→ [S5]
  └── That bai:
        ├── CTA 1: "Thu lai" ──→ [S8: Xac nhan GD] (khong phai nhap lai so tien)
        └── CTA 2: "Trang chu sinh loi" ──→ [S5]
```

---

### Flow 4: Rut tien

#### Happy Path
```
[S5: Dashboard] → tap "Rut tien" (so du > 0) → [S7: Nap/Rut — tab Rut]
  → nhap so tien hop le → tap "Tiep tuc" → [S8: Xac nhan GD Rut]
  → tap "Xac thuc giao dich" → [S9: Auth (reuse)]
  → xac thuc thanh cong → [S10: Ket qua — Thanh cong]
  → tap "Trang chu sinh loi" → [S5: Dashboard]
```

#### Flow Diagram
```
[S7: Nap/Rut — tab Rut]
  ├── Switch tab: "Nap tien" | "Rut tien" (active)
  ├── Hien thi: "Den Vi V-Smart Pay" + so du vi chinh
  ├── Input so tien rut tu Vi Sinh loi (auto-focus, hien ban phim so)
  │     ├── = 0 ──→ inline error "So tien rut phai khac 0"
  │     ├── > so du vi sinh loi ──→ inline error "So tien rut vuot qua so du nguon tien"
  │     ├── vuot han muc rut/ngay ──→ inline error "So tien rut vuot qua han muc"
  │     └── hop le ──→ button "Tiep tuc" enabled
  ├── Quick action: "Rut tat ca" (prefill max amount) — AI assume
  ├── [FIXED] Quick amount chips: 500k | 1tr | 5tr | 10tr
  ├── Hien thi: "Ban co the mat so tien lai nam du kien: -XXX VND"
  ├── tap "Tiep tuc" ──→ [S8: Xac nhan GD Rut]
  └── back ──→ [S5: Dashboard]

[S8: Xac nhan GD Rut]
  ├── Header: "Xac nhan rut tien tu Vi sinh loi"
  ├── So tien
  ├── Service Title: "Rut tien sinh loi" (NOTE: BRD ghi nham "Nap tien sinh loi" — da fix)
  ├── Phi: Mien phi
  ├── Nguon thanh toan: Vi V-Smart Pay
  ├── tap "Xac thuc giao dich" ──→ [S9: Auth (reuse)]
  └── back ──→ [S7: tab Rut]

[S10: Ket qua GD Rut]
  ├── Thanh cong:
  │     ├── Service Title: "Rut tien sinh loi"
  │     ├── CTA: "Trang chu sinh loi" ──→ [S5]
  │     └── Push notification: "Ban da rut tien thanh cong voi so tien {{amount}} d"
  ├── Cho xu ly:
  │     └── CTA: "Trang chu sinh loi" ──→ [S5]
  └── That bai:
        ├── CTA 1: "Thu lai" ──→ [S8: Xac nhan GD Rut]
        └── CTA 2: "Trang chu sinh loi" ──→ [S5]
```

---

### Flow 5: Huy dang ky

**Tai sao can 3 screens (S15→S3→S16)?**
- S15 (Xac nhan huy): Destructive action — can canh bao ro rang + hien so du se bi chuyen. Khong the merge voi OTP vi user can doc ky truoc khi commit.
- S3 (OTP): Reuse luong chung. OTP cho destructive action la bat buoc — khong the bo.
- S16 (Ket qua huy): Reuse result pattern. Can confirm action da hoan tat.

#### Happy Path
```
[S14: Dieu khoan & Hop dong] → tap "Tat sinh loi"
  → [S15: Xac nhan huy] → tap "Tat sinh loi" (destructive)
  → [S3: OTP (reuse)] → nhap OTP dung
  → [S16: Ket qua huy — "Da tiep nhan yeu cau tat tinh nang"]
  → tap "Ve trang chu" → Home
```

#### Flow Diagram
```
[S15: Xac nhan huy dang ky]
  ├── Title: "Ban co chac muon tat tinh nang sinh loi?"
  ├── Body: hien so du hien tai cua vi sinh loi
  │     ├── So du > 0: [FIXED] "So du va lai se duoc chuyen ve Vi V-Smart Pay trong ngay"
  │     │     └── Hien cu the: "So du: XXX VND | Lai du kien: YYY VND"
  │     └── So du = 0: "Vi sinh loi cua ban hien khong co so du"
  ├── [FIXED] CTA Primary: "Giu tinh nang" ──→ quay lai [S14] (an toan — primary = giu lai)
  ├── [FIXED] CTA Destructive (do): "Tat sinh loi" ──→ [S3: OTP (reuse)]
  └── back ──→ [S14]

[S3: OTP (reuse)]
  ├── [FIXED] OTP dung ──→ API huy (ATOMIC: rut truoc → huy sau)
  │     ├── Rut thanh cong + Huy thanh cong ──→ [S16: Ket qua huy]
  │     └── Rut that bai ──→ Huy cung fail ──→ [S16: Ket qua — That bai]
  │           └── "Huy that bai, vui long thu lai" + CTA "Thu lai" ──→ [S15]
  │           └── Sinh loi VAN ACTIVE, tien van an toan trong vi sinh loi
  ├── OTP sai ──→ hien loi + retry
  └── back ──→ [S15]

[S16: Ket qua huy dang ky]
  ├── [FIXED] Thanh cong:
  │     ├── Title: "Da tiep nhan yeu cau tat tinh nang"
  │     ├── Body: "So du va lai cua ban se duoc chuyen ve Vi V-Smart Pay trong ngay. Vui long kiem tra lai sau."
  │     ├── Hien thi cu the: "So du: XXX VND + Lai du kien: YYY VND"
  │     ├── CTA: "Ve trang chu" ──→ Home (KHONG phai Dashboard sinh loi)
  │     └── (trang thai vi sinh loi: inactive, du lieu khong bi xoa)
  ├── [FIXED] That bai (rut tien fail → huy fail):
  │     ├── Title: "Huy that bai"
  │     ├── Body: "Khong the tat tinh nang sinh loi luc nay. Vui long thu lai sau."
  │     ├── CTA 1: "Thu lai" ──→ [S15: Xac nhan huy]
  │     ├── CTA 2: "Ve trang chu" ──→ Home
  │     └── Sinh loi VAN ACTIVE — khong co trang thai "da huy nhung tien chua ve"
  └── S16 khong co back button. Chi co CTA. System back gesture → Home.
```

**[FIXED] Luu y ve so du khi huy — ATOMIC:**
- API huy la ATOMIC: buoc 1 rut toan bo so du + lai → buoc 2 huy dang ky. Neu buoc 1 fail → buoc 2 khong chay → user thu lai.
- KHONG ton tai trang thai "da huy nhung tien chua ve". Neu rut fail thi huy cung fail, sinh loi van active.
- GD rut tu dong khi huy thanh cong hien trong Lich su GD **chung** cua VSP (tab Giao dich tren bottom nav).
- Tien ve vi trong ngay (khong instant, co the mat vai gio). Push noti khi hoan tat.

---

### Flow 6: Deeplink & Re-entry

```
[Deeplink vao sinh loi]
  ├── User da login + da kich hoat ──→ [S5: Dashboard — Tab San pham]
  ├── User da login + chua kich hoat ──→ [S1: Product Page]
  ├── User chua login ──→ Luong login VSP ──→ redirect theo trang thai kich hoat
  └── User vua huy xong + tap deeplink ──→ [S1: Product Page] (co the dang ky lai)

[FIXED] [Deep link tu push notification]
  ├── Tap push noti GD ──→ [S12: Chi tiet GD]
  │     └── back ──→ [S5: Dashboard] (KHONG phai S11)
  └── Tap push noti huy hoan tat ──→ Mo app → Home

[User quay lai app sau kill mid-flow]
  ──→ [S5: Dashboard] (khong resume flow — AI assume)
  ──→ User kiem tra lich su GD de biet trang thai
```

---

## Edge Cases

| # | Case | Trigger | UI Response | Source |
|---|------|---------|-------------|--------|
| 1 | User nap tien dung luc dang xu ly tra lai thang | Nap tien trong ngay tra lai | Server validate → neu conflict, tra loi 20002 → [S10: That bai] + "He thong dang xu ly. Vui long thu lai sau it phut" | analysis.md #1 |
| 2 | Rut tien khi doi tac maintenance/downtime | Tap "Xac thuc giao dich" | Server tra 20002 (503) → [S10: That bai] + "Dich vu tam thoi gian doan" + CTA "Thu lai" | analysis.md #2 |
| 3 | So du vi chinh thay doi giua luc user o man nap | User mo app khac rut tien, quay lai man nap | Khi tap "Tiep tuc" → API validate so du realtime → neu khong du → dialog "So du vi da thay doi. Vui long nhap lai so tien" → quay ve S7 | analysis.md #3 |
| 4 | Lai suat thay doi giua luc xem Product Page va kich hoat | Admin doi lai suat tren backend | Lai suat tren S1 la client-side display. Lai suat thuc te ap dung theo thoi diem kich hoat. Khong block — difference nho, co the update khi reload. | analysis.md #4 |
| 5 | Nap so tien khien tong vuot 100tr (race condition 2 device) | 2 device cung nap dong thoi | Server-side validate tong so du. Device thu 2 nhan loi → [S10: That bai] + "So du vi sinh loi vuot qua 100 trieu VND" | analysis.md #5 |
| 6 | Han muc 100tr/thang bi vuot do nhieu GD nho | Cong don nhieu GD trong thang | Client check truoc (tong GD thang + so tien moi). Server validate chot. Neu vuot → inline error "So tien nap vuot qua han muc" | analysis.md #6 |
| 7 | User vua huy xong, nhan back | Tap back sau S16 | S16 khong co back button. Chi co CTA "Ve trang chu" → Home. System back gesture → Home (khong quay lai Dashboard sinh loi) | analysis.md #7 |
| 8 | Deeplink vao sinh loi khi chua login | Tap link tu ben ngoai | Redirect → Login VSP → sau login, redirect ve sinh loi (Product Page hoac Dashboard tuy trang thai) | analysis.md #8 |
| 9 | Deeplink vao sinh loi khi chua kich hoat | Tap link tu push noti | Redirect → S1: Product Page | analysis.md #9 |
| 10 | User o tab Quan ly, nhan push noti tra lai | Push noti "Nhan lai thanh cong" | Khong auto-refresh tab Quan ly. Khi user switch sang tab San pham → pull-to-refresh hoac auto-fetch so du moi | analysis.md #12 |
| 11 | Mat mang giua flow nap/rut | Bat ky man hinh nao mat ket noi | Error 20003 → dialog "Khong co ket noi mang. Vui long kiem tra Internet va thu lai" + CTA "Thu lai" (khong auto-retry) | BRD error codes |
| 12 | Double-tap tren button "Xac nhan" / "Xac thuc" | User nhan nhanh 2 lan | Disable button sau tap dau tien + hien loading spinner. Server idempotency key chong duplicate. | edge-case-library |
| 13 | OTP het han khi dang ky hoac huy | User cham nhap OTP | Hien "Ma OTP da het han" + button "Gui lai OTP" + countdown timer reset | edge-case-library |
| 14 | PIN sai 3 lan khi xac thuc GD nap/rut | User nhap sai PIN lien tuc | Khoa tai khoan → redirect man khoa → lien he CSKH | ux-knowledge.md |
| 15 | [FIXED] So du sinh loi = 0 va user tap "Rut tien" | Tap "Rut tien" tren Dashboard | Dialog O7: "Vi sinh loi chua co so du. Ban co muon nap tien?" CTA "Nap tien" / "Dong". KHONG cho vao S7. | Duc review + PO decision |
| 16 | API load Dashboard cham/loi | Vao Dashboard lan dau hoac pull-to-refresh | Skeleton loading (<=2s). Neu loi → error state + CTA "Thu lai" | edge-case-library + NFR |
| 17 | Content Dieu khoan/Hop dong chua cau hinh backend | Tap xem dieu khoan | Hien "Thong tin dang duoc cap nhat." (theo BRD error handling) | BRD AC 2.3.1 |
| 18 | User dang ky lai sau khi da huy | User vao sinh loi sau khi huy | Hien S1: Product Page (nhu user moi). Du lieu cu van con (inactive → co the reactivate). Flow dang ky chay lai binh thuong. | Logic |
| 19 | [FIXED] Huy that bai (rut tien fail) | API rut tien that bai trong flow huy | Huy cung fail (atomic). User thay "Huy that bai, vui long thu lai". Sinh loi van active, tien an toan. | PO decision #3 |
| 20 | [FIXED] Tien chua ve sau huy (processing) | User huy thanh cong nhung tien chua ve vi | Push noti khi tien da chuyen xong. GD hien trong lich su GD chung VSP. Neu that bai → push noti + CTA lien he CSKH. | PO decision #1+#2 |

---

## Error States

| Error Code | Man hinh ap dung | Behavior |
|------------|-----------------|----------|
| 20001 (404) | O4, O5, S11, S13 | "Noi dung ban dang tim hien chua san sang hoac khong con ton tai" + CTA "Quay lai" |
| 20001 (408) | Moi man hinh co API call | "Ket noi dang cham hon binh thuong. Vui long thu lai" + CTA "Thu lai" |
| 20002 (500/502/503/504) | S3, S8, S9, S10, S15 | "Dich vu tam thoi gian doan. Vui long thu lai sau it phut" + CTA "Thu lai" |
| 20003 (No internet) | Tat ca | "Khong co ket noi mang. Vui long kiem tra Internet va thu lai" + CTA "Thu lai khi co mang" |
| OTP sai | S3 (dang ky + huy) | Hien loi inline + cho nhap lai. Sau N lan → "Thu lai sau X phut" |
| PIN sai 3 lan | S9 | Khoa tai khoan → man khoa → CSKH |
| Validation loi (so tien) | S7 | Inline error text do + button "Tiep tuc" disabled |

---

## Notifications (Push)

| Trigger | Header (VI) | Body (VI) | Target screen khi tap |
|---------|-------------|-----------|----------------------|
| Nap tien thanh cong | Giao dich nap tien vao vi sinh loi | Ban da nap tien thanh cong voi so tien {{amount}} d | [FIXED] Chi tiet GD (S12) → back → Dashboard (S5) |
| Rut tien thanh cong | Giao dich rut tien tu vi sinh loi | Ban da rut tien thanh cong voi so tien {{amount}} d | [FIXED] Chi tiet GD (S12) → back → Dashboard (S5) |
| Tra lai thanh cong | Giao dich nhan lai ve vi sinh loi | Ban da nhan lai sinh loi thanh cong voi so tien {{amount}} d | [FIXED] Chi tiet GD (S12) → back → Dashboard (S5) |
| [FIXED] Huy + rut tu dong hoan tat | So du sinh loi da chuyen ve vi | So du sinh loi {{amount}} d da duoc chuyen ve Vi V-Smart Pay | Home |
| [FIXED] Huy + rut tu dong that bai | Chuyen tien tu vi sinh loi that bai | Vui long lien he CSKH de duoc ho tro chuyen tien ve vi | Home (CTA trong noti → CSKH) |

---

## Summary

| Metric | Count |
|--------|-------|
| Total screens | 16 (10 moi + 6 reuse) |
| Total overlays/bottom sheets | [FIXED] 6 (O1-O5 + O7) — bo O6, them O7 |
| Total unique UI states | ~48 (bao gom empty, loading, error, success, processing, huy fail cho moi man hinh) |
| Max depth tu Home | [FIXED] 5 (giu nguyen; merge S7+S8 la optional, team UI quyet dinh khi design — neu merge → 4) |
| Edge cases covered | [FIXED] 20 (them 2 case moi: #19 huy atomic fail, #20 tien chua ve sau huy) |
| Reuse ratio | 37.5% screens reuse tu VSP existing patterns |

### Screens moi can design (10):
1. S1: Product Page (gioi thieu + demo lai)
2. S2: Xac nhan kich hoat
3. S5: Dashboard — Tab San pham
4. S6: Dashboard — Tab Quan ly
5. S7: Nap/Rut tien (shared screen)
6. S8: Xac nhan giao dich
7. S11: Lich su giao dich
8. S12: Chi tiet giao dich
9. S13: Tong ket loi nhuan
10. S14: Dieu khoan va Hop dong
11. S15: Xac nhan huy dang ky

### Screens reuse (6):
1. S3: OTP (reuse luong OTP chung)
2. S4: Ket qua dang ky (reuse Result pattern)
3. S9: Auth PIN/Biometric (reuse luong auth chung)
4. S10: Ket qua giao dich (reuse Result pattern — 3 trang thai)
5. S16: Ket qua huy (reuse Result pattern)
6. [FIXED] O7: Dialog so du = 0 (moi, thay O6 eKYC dialog)

### BRD bugs da fix trong flow:
1. Service Title man rut tien: "Nap tien sinh loi" → "Rut tien sinh loi" (dong 1974 BRD)
2. AC 4.1 "I want" sai context (copy-paste tu PRD bao hiem) → da dung lai intent dung
3. AC 2.6.1 + 2.6.2 → defer MVP 2 (PO confirmed)

---

## Changelog v2.1

> So voi flow.md v2.0 — tat ca thay doi theo Duc review + PO decisions (2026-03-09)

### Block fixes (5)

| # | Block | Thay doi | Nguon |
|---|-------|---------|-------|
| 1 | Flow huy timing | S16 body: "So du va lai se duoc chuyen ve Vi V-Smart Pay trong ngay" + hien cu the so du + lai du kien | Decision #1 |
| 2 | Theo doi tien sau huy | GD rut tu dong hien trong lich su GD chung VSP. Them 2 push noti (hoan tat + that bai kem CTA CSKH) | Decision #2 |
| 3 | Huy ATOMIC | Rut fail → huy fail → sinh loi van active. Xoa trang thai "da huy nhung tien chua ve". Them S16 That bai state | Decision #3 |
| 4 | eKYC gate — PO OVERRIDE | Xoa O6 dialog. S1 CTA = "Xac thuc ngay" (chua eKYC) hoac "Kich hoat sinh loi" (da eKYC). Khong disabled button | Decision #4 |
| 5 | So du = 0 + Rut | Them O7 dialog chan truoc. KHONG cho vao S7 khi so du = 0. Edge case #15 da cap nhat | Decision #5 |

### Suggestion fixes (10)

| # | Suggestion | Thay doi | Nguon |
|---|-----------|---------|-------|
| 1 | Disclaimer cho vay | Them disclaimer text o S1 + S2 | Duc suggestion #1 |
| 2 | Tab Quan ly back | S6 back → S5 (khong phai Home) | Duc suggestion #3 |
| 3 | CTA huy wording | "Khong huy" → "Giu tinh nang" (primary). "Van muon huy" → "Tat sinh loi" (destructive, do) | Duc suggestion #5 |
| 4 | Quick chips | 1tr\|5tr\|10tr\|50tr → 500k\|1tr\|5tr\|10tr | Duc suggestion #9 |
| 5 | Note T-1 | Them note "Giao dich hom nay se hien thi vao ngay mai" trong S11 | Duc suggestion #4 |
| 6 | 3 GD gan nhat | Them section "3 GD gan nhat" tren tab San pham (S5) | Duc suggestion #4 |
| 7 | Deep link push → back | Tap push → S12 → back → Dashboard S5 (khong phai S11) | Duc suggestion #7 |
| 8 | Pagination lich su GD | Infinite scroll, 20 items/page, "Dang tai them..." | Duc suggestion #8 |
| 9 | Merge S7+S8 (optional) | Ghi note: team UI xem xet merge khi design, giam depth xuong 4 | Duc suggestion #2 |
| 10 | Wording nap tien | "Ban co the nhan them..." → "Lai du kien cho so tien nay: +XXX VND/nam" | Duc suggestion #10 |

### Metrics thay doi

| Metric | v2.0 | v2.1 | Ghi chu |
|--------|------|------|---------|
| Overlays | 6 (O1-O6) | 6 (O1-O5 + O7) | Bo O6 eKYC dialog, them O7 so du = 0 |
| Edge cases | 18 | 20 | Them #19 (huy atomic fail), #20 (tien chua ve sau huy) |
| Push notifications | 3 | 5 | Them huy hoan tat + huy that bai |
| UI states | ~45 | ~48 | Them huy fail state, dialog O7 states |
| Max depth | 5 | 5 (4 neu merge S7+S8) | Optional merge |

---
Back: [[features/index|Features]] · [[features/sinhloi-v2/status|sinhloi-v2]]
