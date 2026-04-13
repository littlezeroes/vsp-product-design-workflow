# Flow Review — Sinh loi tu dong v2
> Reviewer: Duc | Date: 2026-03-09
> Reviewed: flow.md by Nate

---

## Phai sua (block)

### 1. Flow huy: Nate viet "dong thoi rut" — PO noi "xu ly trong ngay" (KHONG instant)

- **Van de:** PO answer Q2 ghi ro: he thong tu (1) tinh lai con lai, (2) tra lai ve tk sinh loi, (3) rut het ve vi chinh. Qua trinh **xu ly trong ngay**, khong instant. Nate lai viet "API huy se dong thoi thuc hien rut toan bo so du ve vi chinh" — day la 2 y nghia khac nhau. "Dong thoi" = instant. "Trong ngay" = co the mat vai gio.
- **Tai sao quan trong:** S16 hien "Da tiep nhan yeu cau tat tinh nang" nhung khong noi ro bao lau tien ve. User huy xong, mo vi chinh, chua thay tien → hoang → goi CSKH. Day la fintech — tien khong thay la panic.
- **De xuat:**
  - S16 body phai ghi ro: "So du va lai cua ban se duoc chuyen ve Vi V-Smart Pay trong ngay. Vui long kiem tra lai sau."
  - Hien cu the: "So du: XXX VND + Lai du kien: YYY VND"
  - Them push notification khi tien da chuyen xong: "So du sinh loi XXX VND da duoc chuyen ve Vi V-Smart Pay"

### 2. Flow huy: Sau khi huy, user KHONG CO CACH theo doi tien

- **Van de:** Sau khi huy, vi sinh loi chuyen sang inactive. Dashboard (S5, S6) khong truy cap duoc nua. Lich su GD (S11) nam trong Dashboard → cung mat. Vay user biet tien da ve chua bang cach nao? Khong co man hinh nao hien thi trang thai "dang xu ly hoan tien".
- **Tai sao quan trong:** Dead end nghiem trong. Tien "mat tich" trong mat user. Khong fintech app nao duoc phep de user mat kha nang theo doi tien cua minh.
- **De xuat:**
  - GD rut tu dong khi huy phai hien trong Lich su GD **chung** cua VSP (tab Giao dich tren bottom nav), khong chi trong S11.
  - Them push noti khi hoan tat + push noti neu that bai (kem CTA lien he CSKH).
  - Neu API rut that bai (Nate ghi "24h fallback"): can man "Dang xu ly hoan tien" accessible tu Home.

### 3. Flow huy: API rut that bai + API huy thanh cong = tien ket

- **Van de:** Nate ghi: "Neu API rut tien that bai nhung API huy thanh cong → hien canh bao: So du se duoc chuyen ve vi trong vong 24h". Day la CRITICAL. User da huy, sinh loi inactive, nhung tien van ket trong vi sinh loi suot 24h. Khong co man hinh nao de user theo doi (xem item #2).
- **Tai sao quan trong:** User mat 50tr trong 24h khong biet trang thai. Bat ky fintech nao de xay ra tinh trang nay deu bi bao chi viet bai.
- **De xuat:** Huy phai la **atomic**: rut thanh cong → huy thanh cong. Neu rut that bai → huy cung that bai → quay ve S15, user thu lai. KHONG duoc de trang thai "da huy nhung tien chua ve" ton tai.

### 4. eKYC gate: Nate tu y override PO decision

- **Van de:** PO answer Q1 ghi: `button "Kich hoat" o trang thai disabled`. Nate thiet ke nguoc lai: `button khong disabled, khi tap hien dialog O6`. Nate co ghi ly do UX nhung day la **di nguoc PO decision** — khong phai AI assumption.
- **Tai sao quan trong:** Designer khong duoc override PO decision ma khong escalate. Neu Nate thay UX tot hon → phai ghi "De xuat khac PO, xin re-confirm", khong tu y ship.
- **De xuat:**
  - Option A: Theo PO — disabled button + helper text "Can eKYC de kich hoat"
  - Option B: Nate escalate lai PO voi ly do, xin re-confirm
  - Bat buoc chon 1, ghi ro trong flow.md

### 5. So du = 0 + tap "Rut tien" — bat user nhap roi moi bao loi

- **Van de:** Edge case #15: so du = 0, tap "Rut tien" → vao S7 → nhap so → inline error "vuot so du". Tao la user, tao thay nut "Rut tien", tao tap, nhap 50k, bi loi. Mat 3 tap de nhan 1 thong tin co the biet truoc 100%.
- **Tai sao quan trong:** MoMo, ZaloPay deu xu ly truoc (disable nut hoac dialog ngay). Khong ai bat user nhap so tien roi moi bao loi.
- **De xuat:** So du = 0 → tap "Rut tien" → dialog "Vi sinh loi chua co so du. Ban co muon nap tien?" CTA "Nap tien" / "Dong". KHONG cho vao S7.

---

## Nen sua

### 1. Thieu disclaimer "cho vay" — van de phap ly

- **Van de:** PO confirm (hoac AI assume) day la mo hinh cho vay. Analysis.md Q4 de xuat can disclaimer. Nhung flow.md khong co bat ky man hinh nao hien disclaimer "Day khong phai tien gui ngan hang, lai suat khong duoc dam bao".
- **De xuat:** Them disclaimer text o cuoi S1 Product Page + S2 Xac nhan kich hoat. Bat buoc cho san pham cho vay.

### 2. Max depth = 5 — vuot chuan VSP (max 4)

- **Van de:** Home → Dashboard → Nap tien → Xac nhan → Auth → Ket qua = 5 cap. VSP hien tai max 4 cap.
- **De xuat:** Xem xet merge S7 (nhap so tien) + S8 (xac nhan) thanh 1 man: so tien phia tren, thong tin xac nhan phia duoi. MoMo dang lam kieu nay cho chuyen tien.

### 3. Tab Quan ly back → Home: sai mental model

- **Van de:** S6 (tab Quan ly) ghi `back → Home`. User dang o **trong** Dashboard, switch sang tab Quan ly. Back nen quay ve tab San pham (S5), khong phai nhay ra Home. Dang o tab B ma back la ra khoi screen → khong ai lam the.
- **De xuat:** S6 back → S5 (tab San pham). Chi S5 back moi ra Home.

### 4. Lich su GD: T-1 rule khong giai thich cho user

- **Van de:** Calendar picker khong cho chon ngay hom nay. User vua nap xong, vao lich su, khong thay → "toi vua nap 10 phut truoc, sao khong co?"
- **De xuat:** Them note: "Giao dich hom nay se hien thi vao ngay mai". Hoac them "3 GD gan nhat" tren tab San pham (S5) de user check nhanh.

### 5. CTA "Khong huy" — double negation

- **Van de:** S15 co 2 nut: Primary "Khong huy" + Secondary "Van muon huy". Phu dinh kep. User luoi doc → tap nut to nhat (primary) → "Khong huy" → tuong app loi vi khong thay gi xay ra.
- **De xuat:** Primary = "Giu tinh nang", Secondary (destructive, mau do) = "Tat sinh loi". Ro rang, khong phu dinh.

### 6. S2 checkbox khong co link doc dieu khoan

- **Van de:** S2 co 2 checkbox phap ly nhung flow diagram khong ghi link de doc noi dung. S1 co link → O4, O5 nhung S2 thi thieu.
- **De xuat:** Moi checkbox tren S2 phai co link mo O4/O5. User phai co quyen doc truoc khi dong y — yeu cau phap ly.

### 7. Push notification tap → S12: back button di dau?

- **Van de:** Tap push → S12 (Chi tiet GD). Nhung S12 nam trong stack Dashboard → Quan ly → Lich su → Chi tiet. Back tu S12 khi vao tu push → se ve S11 (noi user chua tung vao)?
- **De xuat:** Deep link vao S12 → back → Dashboard (S5), khong phai S11.

### 8. Thieu pagination lich su GD

- **Van de:** Edge case library yeu cau pagination > 20 items. Nate khong nhac. User dung 3 thang = 90+ GD.
- **De xuat:** Infinite scroll, 20 items/page, "Dang tai them..." o cuoi.

### 9. Quick amount chips 50tr — khong thuc te

- **Van de:** Chips: 1tr | 5tr | 10tr | 50tr. So du vi e-wallet trung binh VN dau co 50tr. User tap → loi "vuot so du".
- **De xuat:** 500k | 1tr | 5tr | 10tr. Hoac dynamic chips theo so du vi hien tai.

### 10. Nap tien wording "nhan them" — so voi cai gi?

- **Van de:** "Ban co the nhan them so tien lai nam du kien: +50,000 VND". "Nhan them" so voi truoc khi nap? User moi, chua co base.
- **De xuat:** "Lai du kien cho so tien nay: +50,000 VND/nam" — don gian, khong can so sanh.

---

## Chap nhan duoc

- Flow dang ky 4 buoc (S1→S2→S3→S4) — moi buoc co muc dich ro, khong merge duoc
- Nap/Rut share S7 voi tab switch — giam cognitive load, dung BRD hint
- Reuse ratio 37.5% — tot, dung pattern VSP co san
- S16 khong co back button, chi CTA "Ve trang chu" — tranh quay lai Dashboard da inactive
- Edge case #5 race condition 2 device — server-side validate, dung
- Double-tap prevention tren action buttons — co
- Pull-to-refresh tren Dashboard — co
- Error codes mapping day du (20001-20003)
- Deep link routing 4 case (login/chua login x kich hoat/chua) — day du
- "Rut tat ca" prefill max amount — co
- BRD bugs da fix (service title rut tien, AC 4.1 copy-paste) — can than
- 18 edge cases — nhieu hon mong doi
- S15 Primary = "Khong huy" (safe option) — dung pattern destructive (du wording can sua)

---

## Duc vs Nate

| Topic | Nate noi | Duc noi | PO can chon |
|-------|----------|---------|-------------|
| Huy dang ky timing | "Dong thoi rut tien" | PO noi "trong ngay", khong instant. Can sua wording + them noti | Khong can chon — theo PO |
| Theo doi tien sau huy | Khong co mechanism | Can push noti + hien trong lich su GD chung VSP | **BLOCK — phai co** |
| API rut fail + huy OK | Canh bao "24h" | Huy phai atomic (rut fail = huy fail) | **BLOCK — PO chon** |
| eKYC gate button | Khong disabled, tap → dialog | PO noi disabled. Khong override | **BLOCK — re-confirm PO** |
| So du 0 + Rut | Cho vao S7, inline error | Dialog chan truoc | Nen theo Duc |
| Max depth | 5 cap (chap nhan) | Merge S7+S8, giam 4 cap | Tuy do |
| Tab Quan ly back | Ve Home | Ve tab San pham | Nen theo Duc |
| Disclaimer cho vay | Khong co | Bat buoc phap ly | **Nen co** |
| CTA "Khong huy" | Primary = phu dinh kep | "Giu tinh nang" ro rang hon | Nen theo Duc |
| Quick chips | 1tr-50tr | 500k-10tr | UX decision |

---

## Verdict: REWORK

**5 items block phai sua truoc khi chuyen sang UI design:**

1. **Fix flow huy theo dung PO answer** — "xu ly trong ngay" khong phai "dong thoi". Sua wording S16, them timeline, them push noti
2. **Them cach user theo doi tien sau khi huy** — GD rut tu dong phai hien trong lich su GD chung VSP + push noti
3. **Chot atomic huy** — khong de trang thai "da huy nhung tien chua ve" ton tai. Escalate PO
4. **Chot eKYC gate** — disabled hay dialog? Align voi PO, khong tu y override
5. **Fix so du = 0 + Rut** — chan truoc, khong bat user nhap roi moi bao loi

Fix xong 5 items → update flow.md → gui lai Duc review → PASS.

---
Back: [[features/index|Features]] · [[features/sinhloi-v2/status|sinhloi-v2]]
