# Phase 1 Analysis — Chuyen tien → Thanh toan (30/4)
> Analyst: Nate | Date: 2026-03-21
> Scope: 10 areas deep analysis cho Phase 1 App Architecture Evolution
> Sources: BRD, ux-knowledge.md, edge-case-library.md, vas-payment feature, smart-billing-hub feature, global-search-research, ref-patterns.md

---

## 1. User Flow Analysis: Home → Tab TT → DV → NCC → Ma KH → Bill → Confirm → Result

### Happy Path — Thanh toan hoa don moi (VD: tien dien)

```
[Home]                    Tap 1: Tab "Thanh toan"
  → [Tab Thanh toan]      Tap 2: Category "Dien" trong grid
  → [Chon NCC]            Tap 3: Chon "EVN HCMC" trong list
  → [Nhap ma KH]          Tap 4: Nhap ma + tap "Tra cuu"
  → [Bill detail/Confirm]  Tap 5: Review + tap "Xac thuc giao dich"
  → [Auth PIN]             Tap 6: Nhap PIN 6 so
  → [Result]               Done.
```

**Tap count: 6 taps + nhap ma + nhap PIN = 8 interactions**

### So sanh voi v1.0.6:

```
v1.0.6: Home → Payment Hub → Chon DV → Ma KH → Bill → Confirm → Auth → Result
        = cung 6 taps, nhung Payment Hub la landing page chung (khong co search, saved)
```

**Nhan xet:**
- Tap count KHONG tang so voi v1.0.6 — tot
- NHUNG: them 1 decision point moi = chon category trong grid (v1.0.6 da co sub-category list)
- Cai duoc: Tab Thanh toan co search, saved billers, recent — giup RETURNING user giam xuong 3-4 taps
- **First-time user: 8 interactions. Returning user (saved biller): 4 interactions (tap saved → confirm → auth → result)**

### Happy Path — Nap tien dien thoai

```
[Home]                    Tap 1: Tab "Thanh toan"
  → [Tab Thanh toan]      Tap 2: Category "Nap tien" hoac "Nap nhanh" chip
  → [Form nap tien]       Tap 3: Nhap/chon SDT + chon menh gia + "Tiep tuc"
  → [Confirm]             Tap 4: Review + "Xac thuc"
  → [Auth]                Tap 5: PIN
  → [Result]              Done.
```

**Tap count: 5 taps + nhap SDT = 6 interactions (first-time)**
**Returning (saved phone): 4 interactions**

### Gap phat hien:

- **Khoan — tu Home den category "Dien" mat 2 taps (Tab TT → Dien).** V1.0.6 cung mat 2 taps (Payment Hub → Dien). Khong toi uu hon. Cai duoc la Tab TT LUON hien thi saved billers — first thing user thay la hoa don can tra, khong phai grid category.
- **Bill detail va Confirm co the MERGE** — hien tai flow.md tach V2b (nhap ma KH + fetch bill) va V5 (confirm). Nhung khi bill found, thong tin bill + nguon TT + CTA co the hien TREN CUNG 1 screen. Ly do: bill da fetch = da co du thong tin de confirm. Merge = giam 1 tap.
- **Missing: "Tra cuu" button co can thiet khong?** Neu user nhap ma KH xong, app co the auto-fetch khi input valid (debounce 500ms) thay vi bat user tap "Tra cuu". Reference: Cash App auto-detects recipient khi nhap du ky tu. Giam 1 tap.

---

## 2. Edge Cases

### 2.1 Chua lien ket ngan hang

- **Trigger:** User moi, chua lien ket NH, so du vi = 0
- **Flow hien tai:** Confirm screen → "Nguon thanh toan" chi co "Vi V-Smart Pay 0d" → user tap "Them lien ket" → flow lien ket NH (mat ~10 steps) → quay lai confirm
- **Gap:** Khi user quay lai confirm sau lien ket, bill data co the stale (het han, amount thay doi). **PHAI re-fetch bill** truoc khi show confirm lai.
- **Edge case chua cover:** User HOAN THANH lien ket NH nhung KHONG quay lai flow thanh toan (kill app, bam Home). Session mat? Data mat? → Can save draft payment state.
- **Reference edge-case-library:** "Amount > balance → inline error 'So du khong du'" — da co. Nhung chua co case "KHONG CO nguon thanh toan nao"

### 2.2 First-time vs Returning user

| State | Tab Thanh toan hien gi | Behavior |
|-------|------------------------|----------|
| First-time (chua co saved) | Grid category only. Section "Da luu" AN. Section "Gan day" AN. | User phai navigate category → NCC → nhap ma |
| Returning (co saved billers) | Urgent bill banner (neu co) + Grid + Saved billers + Nap nhanh + Gan day | 1-tap vao saved biller → pre-filled |
| Power user (>10 saved) | Nhu tren nhung list dai hon. "Tat ca" link → full saved management | Pagination? Infinite scroll? |

**Gap:** BRD va flow.md KHONG dinh nghia onboarding cho first-time user tren Tab Thanh toan. User moi thay grid trong tron → khong biet bat dau tu dau. **Can empty state guidance** (VD: "Thanh toan hoa don dien, nuoc, internet — bat dau ngay" + CTA hoac illustration).

### 2.3 Bill het han

- **Scenario:** User fetch bill → thay bill → roi app → quay lai sau 2 ngay → bill da het han
- **Xu ly can co:**
  - Khi user quay lai confirm screen → re-fetch bill → neu bill da thanh toan/het han → dialog "Hoa don nay da duoc thanh toan / het han" + CTA "Ve trang chu"
  - Khi user tap "Tra cuu" → bill tra ve status = "da thanh toan" → show inline message "Khong co hoa don can thanh toan"
- **Reference edge-case-library:** "Data stale (user been on screen too long → re-fetch)" — da co pattern

### 2.4 NCC not found

- **Scenario:** User search NCC nhung khong tim thay (NCC chua duoc VSP ho tro)
- **Hien tai:** Screen V2a co state "search-empty" → "Khong tim thay"
- **Gap:** THIEU thong tin "tai sao khong tim thay" va "lam gi tiep". Nen co: "Nha cung cap chua duoc ho tro. Lien he CSKH de de xuat." + link CSKH
- **Edge case them:** User nhap SAI TEN NCC (VD: "EVN" thay vi "EVN HCMC") → search phai fuzzy match, khong chi exact match

### 2.5 So du thieu

- **Hien tai:** Confirm screen V5 co state "insufficient-balance" → badge "Khong du so du" tren nguon TT
- **Gap:**
  - Neu user chi co 1 nguon TT (vi VSP) va so du thieu → CTA "Xac thuc giao dich" phai DISABLED + message "Nap tien vao vi de thanh toan"
  - Neu user co nhieu nguon → auto-suggest nguon co du so du
  - **Chua cover:** User co du so du TAI THOI DIEM CONFIRM nhung khi AUTH xong → so du bi tru boi GD khac (race condition). Backend phai handle, nhung UI can hien "So du thay doi, vui long thu lai"

### 2.6 HST offline

- **Scenario:** XanhSM/VHR/VinPearl server loi → VSP goi API fail
- **Xu ly:** Theo edge-case-library: "Fetch error → retry option"
- **Gap can lam ro:** Khi 1 NCC bi offline nhung NCC khac van hoat dong → hien NCC do voi status "Tam ngung" (greyed out, khong tap duoc) thay vi an hoan toan. Ly do: user thay NCC mat → hoang mang. Thay "Tam ngung" → hieu la tam thoi.

---

## 3. Mental Model Validation: "Tien di chuyen" vs "Tra cho dich vu"

### BRD dinh nghia:
- **Home** = "tien di chuyen" (Nap / Rut / Chuyen / Nhan)
- **Tab Thanh toan** = "tien tra cho ai do" (hoa don, DV, HST)

### Nate's analysis — User co confuse khong?

**Khoan, co van de.**

- **"Chuyen tien" la gi?** User VN hieu "chuyen tien" = gui tien cho nguoi khac (P2P hoac bank). Day la "tien di chuyen" → dung, nam o Home.
- **"Thanh toan" la gi?** User VN hieu "thanh toan" = tra tien cho dich vu/hang hoa. Day la "tra cho ai do" → dung, nam o Tab TT.
- **NHUNG:** "Nap tien dien thoai" nam o dau trong mental model? User co the hieu la "tra tien cho nha mang" (= Thanh toan) HOAC "nap tien vao SDT" (= tien di chuyen). Hien tai BRD de "Nap tien" trong Tab Thanh toan → HOP LY vi user dang "tra cho nha mang de mua airtime".
- **"Nap tien vao vi"** nam o Home quick action → dung, vi day la "tien di chuyen" (tu bank vao vi)
- **Potential confusion point:** "Nap" xuat hien O CA 2 NOI:
  - Home: "Nap" (= nap tien vao vi)
  - Tab TT: "Nap tien" (= nap tien dien thoai)
  - User co the tap "Nap" tren Home vi nghi la nap DT → sai. Hoac tap "Nap tien" tren Tab TT vi nghi la nap vi → sai.
  - **Khac phuc:** Home quick action nen ghi "Nap vi" (khong chi "Nap"). Tab TT nen ghi "Nap dien thoai" (khong chi "Nap tien"). Label phai UNAMBIGUOUS.

### Evidence tu reference apps:
- **MoMo:** Tach "Chuyen tien" (P2P) va "Thanh toan" (DV/hoa don) — 2 tab rieng. User VN da quen pattern nay.
- **ZaloPay:** Tuong tu — "Chuyen tien" va "Thanh toan" la 2 concept khac nhau.
- **Revolut:** "Send" (= chuyen) va "Payments" (= thanh toan) — cung tach.

**Ket luan: Mental model "tien di chuyen" vs "tra cho DV" la DUNG va CONSISTENT voi thi truong VN. User se KHONG confuse NEU label chinh xac.**

**Recommend:**
- Home quick actions: "Nap vi" / "Rut tien" / "Chuyen" / "Nhan"
- Tab TT label: "Nap dien thoai" (khong phai "Nap tien")

---

## 4. Chuyen tien solved? Dua len Home quick action co du khong?

### Hien tai v1.0.6:
- "Chuyen tien" la 1 TAB RIENG tren bottom nav
- Tab chuyen tien co: search nguoi nhan, recent, P2P, bank transfer

### Phase 1 de xuat:
- "Chuyen tien" BI XOA khoi bottom nav
- Thay the bang: Home quick action "Chuyen" (1 circle icon)
- User tap "Chuyen" → vao CUNG flow chuyen tien nhu cu

### Nate's verdict: **CHUA DU — nhung co the lam duoc voi dieu kien.**

**Van de:**
- Chuyen tien la TOP 3 feature su dung nhieu nhat cua moi payment app (ref: MoMo, ZaloPay data)
- Xoa khoi bottom nav = GIAM visibility. User phai NHO la "Chuyen" nam tren Home
- Khi user KHONG o Home (VD: dang o Tab Thanh toan), muon chuyen tien → phai TAP HOME truoc → roi tap "Chuyen" → them 1 tap

**Dieu kien de "du":**
1. **"Chuyen" quick action phai LUON VISIBLE** khi user o Home — khong bi scroll mat
2. **Recent transfers nen hien tren Home** (duoi wallet card) — de user thay va tap lai
3. **QR tab van con** → QR scan auto-detect chuyen tien vs thanh toan → entry point thu 2 cho chuyen tien
4. **Deep link support:** Notification "A gui ban 500k" → tap → thang vao chuyen tien reply

**Risk:**
- Neu Home co qua nhieu content (wallet + quick actions + sinh loi teaser + BH teaser + GD gan day) → quick actions bi push xuong → "Chuyen" khong con above the fold
- **Khac phuc:** Quick actions PHAI STICKY hoac nam ngay duoi wallet card, khong bi scroll

**Recommend:** OK de dua len Home quick action, NHUNG:
- Quick actions = fixed row ngay duoi wallet card, KHONG scroll di
- Tab Thanh toan KHONG co entry point chuyen tien (dung — 2 mental model khac nhau)
- QR tab la backup entry cho chuyen tien

---

## 5. Tab Thanh toan Content Check — 30/4 Ready

### BRD noi Tab TT co:

| Category | Sub-services | KHHD Timeline | 30/4 Ready? |
|----------|-------------|---------------|-------------|
| Hoa don Dien | EVN cac mien | VAS dien/nuoc/net: 30/4 | YES |
| Hoa don Nuoc | SAWACO, etc. | VAS dien/nuoc/net: 30/4 | YES |
| Hoa don Internet | FPT, VNPT, Viettel | VAS dien/nuoc/net: 30/4 | YES |
| Truyen hinh | VTVcab, SCTV, etc. | Khong ro timeline | RISKY — can confirm |
| Nap tien DT | Viettel/Mobi/Vina/VNM/Reddi/Itel | Da co tu v1.0 | YES |
| The cao | Cung nha mang | Da co tu v1.0 | YES |
| Goi data | Cung nha mang | Moi, nhung cung BRD VAS | YES (neu dev kip) |
| Tai chinh (vay) | 12 providers | Moi | RISKY — 12 providers, moi cai co input khac nhau |
| HST grid | XanhSM (T3), VHR/VinPearl/VinFast (T4) | XanhSM: T3, VHR/VP/VF: T4 | PARTIAL — chi XanhSM + VHR + VinPearl + VinFast |
| Ve (phim/xe/tau) | Chua co BRD | Chua co timeline | NO — khong kip 30/4 |
| BH xe may/o to | Rieng, 20/4 | 20/4 | YES nhung co the la module rieng, khong nam trong Tab TT |

### Ket luan cho 30/4:

**CHAC CHAN co (P0):**
- Hoa don: Dien, Nuoc, Internet
- Di dong: Nap tien DT, The cao
- HST: XanhSM, VHR, VinPearl, VinFast (4 items)

**CO THE co (P1):**
- Goi data (moi nhung logic tuong tu nap tien)
- Tai chinh — vay tieu dung (12 providers, nhung co the bat dau voi 3-5 providers truoc)
- Truyen hinh (neu NCC san sang)

**CHAC CHAN KHONG co:**
- Ve (phim/xe/tau) — chua co BRD
- BH — module rieng, co the tach tab hoac entry rieng

**Recommend:** Grid 30/4 nen co 6-8 categories: Dien / Nuoc / Internet / Nap DT / The cao / Goi data / Tai chinh / (Truyen hinh neu kip). HST la section rieng duoi grid.

---

## 6. HST Grid vs List: Nen dung gi?

### Phan tich tu first principles:

**HST items 30/4:** XanhSM, VHR, VinPearl, VinFast = 4 items
**HST items Q2-Q3:** + Vinschool, VinUni, Vincom = 7 items
**HST items tuong lai:** Co the 10-15 items

### Grid (icon + label):

| Uu | Nhuoc |
|----|-------|
| Compact — hien nhieu item tren 1 row | Icon nho, kho phan biet brand |
| Quen thuoc (MoMo style) | Khong hien duoc description/status |
| Nhanh scan visual | Khong scale tot khi >12 items (2+ rows) |

### List (logo + label + description + chevron):

| Uu | Nhuoc |
|----|-------|
| Logo lon hon, brand recognition tot | Chiem nhieu khong gian vertical |
| Hien duoc description ("Dat xe, Thanh toan") | Cham scan hon grid |
| Hien duoc status ("Moi", "Khuyen mai") | |
| Scale tot voi nhieu item | |

### Nate's verdict: **LIST cho HST. GRID cho DV categories.**

**Ly do:**
1. **HST = brand partners, can brand recognition.** XanhSM logo khac VinPearl logo — user nhan dien bang HINH, khong phai text. Logo can lon → list.
2. **HST items co context khac nhau.** XanhSM = "Dat xe, Thanh toan cuoc". VinPearl = "Dat phong, Ve khu vui choi". Description nay quan trong de user hieu minh co the lam gi → list moi hien duoc.
3. **DV categories (Dien/Nuoc/Internet) = GENERIC, chi can icon + label.** User da biet "Dien" la gi → grid du.
4. **Ref evidence:** MoMo dung GRID cho categories (dien/nuoc/internet) nhung LIST cho partners/merchants. Cash App dung LIST cho tat ca services. Revolut dung LIST.
5. **30/4 chi co 4 HST items** — list 4 items chiem ~280px vertical = vua phai, khong phai scroll nhieu. Grid 4 items tren 1 row = qua nho, khong noi bat.

**Recommend layout:**
```
[Search bar]
[Urgent bill banner — neu co]
[Section: "Dich vu" — GRID 4 col: Dien / Nuoc / Internet / Nap DT / The cao / Data / Tai chinh / ...]
[Section: "He sinh thai" — LIST: XanhSM row / VHR row / VinPearl row / VinFast row]
[Section: "Da luu" — LIST: saved billers]
[Section: "Gan day" — LIST: recent transactions]
```

---

## 7. Search UX: Search gi? NCC? Service? Ma KH?

### Hien tai (Tab TT wireframe):

- Search bar placeholder: "Tim dich vu, nha cung cap..."
- Search filter ACROSS categories

### Phan tich: User search gi tren Tab Thanh toan?

| Search intent | VD | Tan suat | Dang ho tro? |
|--------------|-----|---------|-------------|
| Tim dich vu/category | "dien", "nuoc", "internet" | Thap (da co grid) | YES |
| Tim NCC | "EVN", "SAWACO", "FPT" | TRUNG BINH | YES |
| Tim HST partner | "XanhSM", "VinPearl" | TRUNG BINH | PHAI CO |
| Tim ma KH (tra cuu hoa don) | "PA01234567" | THAP — user khong nho ma | KHONG NEN |
| Tim hoa don da luu | "tien dien thang 3" | THAP | CO THE (phase 2) |

### Gap phat hien:

- **Hien tai search chi filter categories.** THIEU: search NCC across categories. VD: user go "FPT" → phai hien "FPT Telecom (Internet)" + "FPT Play (Truyen hinh)" — cross-category.
- **Search HST partners:** User go "Xanh" → phai hien "XanhSM" trong ket qua. Hien tai wireframe KHONG ro co search HST khong.
- **KHONG NEN search ma KH** tren Tab TT. Ma KH chi co y nghia trong context NCC cu the. Search "PA01234567" ma khong biet la EVN hay SAWACO → vo nghia.

### Recommend search scope:

```
Tab TT search → filter dong thoi:
  1. Category names (Dien, Nuoc, Internet...)
  2. NCC names across ALL categories (EVN, SAWACO, FPT, Viettel...)
  3. HST partner names (XanhSM, VinPearl, VHR...)
  4. Saved biller names (neu co) → "EVN HCMC — PA01234567"
```

**Search result UI:**
```
Ket qua tim kiem "FPT":
|- [NCC] FPT Telecom — Internet                    → tap → nhap ma KH
|- [NCC] FPT Play — Truyen hinh                    → tap → nhap ma KH
|- [Da luu] FPT Telecom — FPT2891034 / 220.000d    → tap → confirm
```

- **Grouped by type** (NCC / Da luu / HST) de user phan biet
- **Saved billers LUON LEN TRUOC** — vi user search ten NCC thuong la de thanh toan hoa don DA CO, khong phai hoa don moi

---

## 8. Saved Billers: Nam o dau?

### Hien tai (wireframe Tab TT):

- Section "Hoa don da luu" — list style voi provider + ma KH + amount + due date
- Section "Nap nhanh" — horizontal chips voi saved phones
- Trailing icon "Settings" tren header → link /vas/saved (quan ly da luu)

### Phan tich vi tri:

**Saved billers CAN nam o 3 cho:**

1. **Tab Thanh toan — section rieng** (hien tai) — DANG LAM
2. **Tab Thanh toan — above the fold, truoc categories** — RECOMMEND
3. **Home — section rieng** — CO THE lam phase 2

### Nate's verdict:

- **Saved billers PHAI la FIRST THING user thay** khi mo Tab Thanh toan. Ly do: 80% lan mo Tab TT, user muon THANH TOAN HOA DON DA CO, khong phai dang ky moi.
- **Hien tai layout:** Search → Urgent banner → Grid → Da luu → Nap nhanh → Gan day
- **Recommend:** Search → Urgent banner → **DA LUU** → Grid → Nap nhanh → Gan day

**Ly do doi order:**
- Grid DV la static content — user da biet cac category, khong can o vi tri noi bat nhat
- Da luu la DYNAMIC, ACTIONABLE content — co bill can tra, co due date, co amount
- User returning thay da luu TRUOC grid = giam 1 scroll de den action

**Tuy nhien:** Neu user CHUA CO saved billers (first-time) → grid nen len truoc (vi da luu section an). Layout tu dieu chinh theo co saved hay khong.

### Saved billers management:

- Hien tai: "/vas/saved" — tabbed list (Hoa don | SDT)
- Entry: Header trailing icon (Settings) + "Tat ca" link trong section
- **Gap:** KHONG co entry tu Home. Phase 2 nen co Home widget "Ban co 3 hoa don sap den han" link thang vao saved.

---

## 9. Category Pills: Logic phan nhom dung khong?

### Hien tai (wireframe grid 4 col):

```
Row 1: Dien | Nuoc | Internet | Truyen hinh
Row 2: Nap tien | The cao | Goi data | Tai chinh
```

### Phan tich phan nhom:

| Nhom | Items | Logic | Dung? |
|------|-------|-------|-------|
| Hoa don (tien ich) | Dien, Nuoc, Internet, Truyen hinh | Tra tien cho dich vu dinh ky | YES — clear mental model |
| Di dong | Nap tien DT, The cao, Goi data | Lien quan den SDT/nha mang | YES nhung CHIA 3 ENTRY hoi nhieu |
| Tai chinh | Vay tieu dung (12 NCC) | Tra khoan vay | YES — tach rieng vi mental model khac |

### Gap phat hien:

1. **"Nap tien", "The cao", "Goi data" = 3 categories cho CUNG 1 viec: "dich vu di dong".**
   - User co phan biet "nap tien" vs "goi data" khong? Nhieu user nghi "nap tien" la de mua data.
   - **Option A (hien tai):** 3 entries rieng — clear nhung chiem 3 slots trong grid
   - **Option B:** Gop thanh 1 entry "Di dong" → sub-menu: Nap tien | The cao | Goi data
   - **Recommend:** GIU TACH 3 entries. Ly do: moi flow co input khac nhau (SDT vs chon nha mang vs chon goi). Merge vao 1 entry = them 1 tap + 1 decision. First principles: it step > gop.

2. **"Truyen hinh" co the KHONG kip 30/4.** Neu khong co → grid chi co 7 items (2 rows: 4 + 3). Row 2 lech 1 item → UI khong can doi.
   - **Khac phuc:** Dung slot thu 8 cho "Tat ca dich vu" hoac "Khac" → link den full service list (phase 2)

3. **Tai chinh — "vay tieu dung" label khong truc quan.** User khong tim "Tai chinh" khi muon tra khoan vay. Ho tim "Tra khoan vay" hoac "Khoan vay".
   - **Recommend:** Doi label thanh "Khoan vay" thay vi "Tai chinh". "Tai chinh" qua rong — Phase 2 Tab "Tai chinh" moi la financial hub.

4. **HST items (XanhSM, VHR...) KHONG nam trong grid nay** — dung. HST la partners, khong phai categories DV. Nen o section rieng.

5. **BH xe may/o to co nam trong grid khong?** BRD noi BH ship 20/4 truoc Phase 1. Nhung mental model BH = "bao ve tai san" khong phai "thanh toan hoa don". → KHONG nen de BH trong Tab TT. BH nen nam o Home teaser card (BRD da noi) va Tab Tai chinh (Phase 2).

---

## 10. Transition from v1.0.6: Onboarding can gi?

### Thay doi lon nhat user se thay:

| v1.0.6 | Phase 1 | Impact |
|--------|---------|--------|
| Tab "Chuyen tien" (bottom nav) | XOA — dua vao Home quick action | HIGH — user mat quen |
| Payment Hub (lam nhieu viec) | Tab "Thanh toan" (chuyen dung) | MEDIUM — khac ten, khac vi tri |
| 5 tabs: Home / CT / QR / GD / TK | 5 tabs: Home / TT / QR / GD / TK | LOW — chi doi 1 tab label |
| Home: wallet + quick actions (2: Nap/Rut) | Home: wallet + 4 quick actions (Nap/Rut/Chuyen/Nhan) + teasers | MEDIUM — them content |

### Onboarding can thiet:

**1. Coach mark / tooltip (first launch sau update):**
- **Coach mark 1:** Chi vao Tab "Thanh toan" → "Thanh toan hoa don, nap tien DT, va nhieu dich vu khac — o day!"
- **Coach mark 2:** Chi vao quick action "Chuyen" tren Home → "Chuyen tien da chuyen ve day"
- **Max 2 coach marks.** User KHONG doc nhieu hon 2.

**2. Tab badge "Moi" (dot indicator):**
- Tab "Thanh toan" co badge "Moi" (red dot) trong 7 ngay dau sau update
- Sau 7 ngay hoac sau khi user tap vao Tab TT → badge bien mat

**3. What's New bottom sheet (app update):**
- Trigger: Lan dau mo app sau update len version moi
- Content: 1 illustration + 2-3 bullet points
  - "Chuyen tien nhanh hon — ngay tren Trang chu"
  - "Tab Thanh toan moi — tat ca dich vu 1 noi"
  - "Ho tro he sinh thai Vingroup"
- CTA: "Da hieu" (tat sheet)

**4. KHONG lam:**
- KHONG multi-step onboarding tutorial — user se skip
- KHONG force tour — user se frustrated
- KHONG change log page — khong ai doc
- KHONG re-order bottom nav animation — confusing

**5. Backward compatibility:**
- Deep links cu (VD: vsppay://transfer) PHAI van hoat dong → redirect den flow chuyen tien moi
- Notification links cu PHAI van dung
- Saved shortcuts (iOS widget, Android shortcut) PHAI update target

### Risk:

- **User quen tab "Chuyen tien" se tap vi tri cu (tab 2) → vao "Thanh toan" thay vi chuyen tien.** Giai phap: Tab Thanh toan co thong bao inline lan dau: "Ban muon chuyen tien? Tap 'Chuyen' tren Trang chu" + link nhanh.
- **User khong thay quick action "Chuyen" neu Home co nhieu content push xuong.** Giai phap: Quick actions PHAI above the fold, khong scroll.

---

## Tong ket — Top 5 Risks cho Phase 1

| # | Risk | Severity | Mitigation |
|---|------|----------|-----------|
| 1 | User mat tab "Chuyen tien" → confused | HIGH | Coach marks + inline guidance + quick action above fold |
| 2 | "Nap" ambiguous (nap vi vs nap DT) | HIGH | Doi label: "Nap vi" (Home) vs "Nap dien thoai" (Tab TT) |
| 3 | HST grid khong du content 30/4 (chi 4 items) | MEDIUM | Dung LIST thay grid, 4 items voi logo lon thi van dep |
| 4 | Bill stale khi user quay lai confirm | MEDIUM | Auto re-fetch bill khi focus lai confirm screen |
| 5 | First-time user Tab TT trong — khong co saved, khong co recent | MEDIUM | Empty state guidance + popular services suggestion |

---

## Action Items cho Vi (Lead)

1. **Confirm voi PO:** Truyen hinh co kip 30/4 khong? Neu khong → grid 7 items + "Khac"
2. **Confirm voi PO:** BH xe may (20/4) nam o dau trong IA? Tab TT hay rieng?
3. **Confirm voi PO:** Quick action "Nap" tren Home label la gi? "Nap vi" hay "Nap tien"?
4. **Flow optimization:** Merge bill detail + confirm thanh 1 screen (giam 1 tap)
5. **Duc review:** Layout priority — da luu truoc grid hay grid truoc da luu?
6. **Ivy:** HST dung LIST layout voi logo lon, khong dung grid
7. **Khoa:** QA checklist cho 2.1-2.6 edge cases

---

*"Khoan, case nay chua cover ne — user nap tien DT tu Tab Thanh toan xong, tap Home, thay quick action 'Nap' → nghi la nap DT → tap → vao flow nap vi → confused. Label PHAI khac nhau." — Nate*

---
Back: [[features/index|Features]] · [[features/app-architecture-2026/status|app-architecture-2026]]
