# User Flow — Sub-Merchant Management
> Designer: Nate (Claude Code) | Date: 2026-04-12
> Based on: PRD Create & Manage Sub-Merchant v1.0 (Mar 30 2026)
> BRD Source: Confluence VPay / PRD Create & Manage Sub-Merchant

---

## Entry Points

1. **Sidebar: Quan ly Sub-merchant** — Ops click tu sidebar Merchant Portal
2. **Chi tiet Merchant → Tab SM** — Ops xem Merchant root → tab Sub-merchant
3. **Deep link** — URL truc tiep `/sub-merchants` hoac `/sub-merchants/SM-001`
4. **Notification** — Push/email khi SM can phe duyet

---

## Happy Path — Tao Sub-merchant

```
[Sidebar] → [Danh sach SM] → [+ Tao SM] → [Chon loai] → [Nhap thong tin] → [Xac nhan] → [Thanh cong / DRAFT]
```

## Happy Path — Kich hoat Sub-merchant

```
[Danh sach SM] → [Chon SM (READY)] → [Kich hoat] → [Xac nhan] → [ACTIVE + Email + API Key]
```

## Happy Path — Import Sub-merchant

```
[Danh sach SM] → [Import] → [Tai template] → [Dien data] → [Upload] → [Preview] → [Xac nhan] → [Progress] → [Ket qua + Download]
```

---

## Flow 1: Tao Sub-merchant Thu cong (MC_SMC_01)

```
[S1: Trang Quan ly Sub-merchant]
  ├── Check: Parent merchantType = BUSINESS?
  │    └── NO → Tab SM AN, nut [+Them] AN → Stop (S01-CC-01)
  ├── Check: Parent status = ACTIVE?
  │    └── NO → Nut [Tao SM] DISABLED + tooltip (S01-CC-02)
  └── YES → Click [+ Tao Sub-merchant]

[S2: Chon loai Sub-merchant]
  ├── Phap nhan doc lap (INDEPENDENT)
  │    └── → [S3-IND: Form 18 fields]
  └── Chi nhanh truc thuoc (DEPENDENT)
       └── → [S3-DEP: Form 10 fields]
  ├── CC: Doi loai sau khi da nhap → Dialog reset form (S01-CC-03)
  └── [Huy] → quay lai [S1]

[S3: Nhap thong tin co ban]
  ├── Chua du bat buoc → Button [Xac nhan] DISABLED (AC2-Case1)
  ├── Du + hop le → Button [Xac nhan] ENABLED (AC2-Case2)
  ├── Validation error → Inline error per field (AC2-Case3)
  ├── taxId trung (IND) → Inline error, block luu (S01-CC-04)
  ├── Ten hien thi trung MC ACTIVE → Warning, van cho luu (S01-CC-05)
  └── [Tiep tuc] → [S4]

[S4: Xac nhan tao Sub-merchant]
  ├── Review all info (read-only)
  ├── [Quay lai] → back to [S3]
  └── [Xac nhan tao SM] → API submit

[S5: Ket qua]
  ├── API 200 → Toast "Tao SM thanh cong" (S01-CC-06)
  │    ├── SM status = DRAFT
  │    ├── SubMerchantID auto-generated (unique)
  │    ├── Audit log: created_by, created_at
  │    └── Navigate → [Chi tiet SM moi]
  ├── API 500 → Toast "Tao that bai, vui long thu lai" (AC3-Case2)
  │    └── User retry tu [S4]
  └── taxId trung (server-side) → Toast error + back [S3]
```

### Tao Level 2/3

```
[Chi tiet SM Level 1] → [+ Them sub-merchant Level 2]
  └── Repeat [S2] → [S5] voi parent_id = SM Level 1

[Chi tiet SM Level 2] → [+ Them sub-merchant Level 3]
  └── Repeat [S2] → [S5] voi parent_id = SM Level 2
```

---

## Flow 2: Import Sub-merchant (MC_SMC_02)

```
[S1: Trang Quan ly SM] → Click [Import]

[S6: Dialog Import — Tai template]
  ├── [Tai template Excel] → download .xlsx
  └── [Chon file / keo tha] → upload

[S7: Upload & Validate file]
  ├── Sai format (.csv, .pdf, .jpg) → Toast loi (AC3-Case1)
  ├── > 5MB → Toast "Vuot dung luong" (EC-07)
  ├── Header khong khop → Toast "Khong dung template" (AC3-Case1)
  ├── Khong co du lieu → Toast "Khong co du lieu" (AC3-Case1)
  ├── > 500 dong → Toast "Vuot gioi han" (EC-19)
  ├── File corrupt → Toast "File khong doc duoc" (EC-01)
  ├── CSV doi duoi .xlsx → Toast "Noi dung khong hop le" (EC-02)
  ├── Sheet1 trong (data o Sheet2) → Toast "Khong tim thay du lieu" (EC-03)
  └── OK → [S8: Preview]

[S8: Preview & Validate du lieu]
  ├── All valid → ✅ green rows, [Xac nhan Import] ENABLED (AC3-Case2)
  ├── Co loi → ❌ red rows + tooltip, [Xac nhan] DISABLED (AC3-Case3)
  │    └── "File co N loi. Vui long sua va upload lai"
  ├── Partial loi → Canh bao "X loi bo qua, Y OK. Tiep tuc?"
  │    └── Ops xac nhan → chi import dong OK
  ├── All loi → DISABLED "Toan bo du lieu co loi"
  │
  │   Validation per field:
  │   ├── taxId: 10/13 so, unique → error (EC-09)
  │   ├── phone: 10-11 so, auto-clean (EC-12, EC-14)
  │   ├── email: format check
  │   ├── MCC: phai ton tai (EC-13)
  │   ├── IND fields: bat buoc neu type=IND (EC-10)
  │   ├── DEP + taxId: bo qua (EC-11)
  │   ├── Spaces: auto-trim (EC-08)
  │   ├── Merged cells: unmerge (EC-05)
  │   └── Formulas: error (EC-06)
  │
  └── [Xac nhan Import] → [S9]

[S9: Processing]
  ├── Progress bar "Dang xu ly X/Y dong..."
  ├── Nut disabled (chong double-click) (EC-18)
  ├── Khong cho dong dialog → Confirm "Import dang chay. Thoat?" (AC5)
  │
  │   Race conditions:
  │   ├── 2 Ops import cung taxId → DB unique (EC-15)
  │   ├── Parent DEACTIVATE → dong chua xu ly FAILED (EC-16)
  │   ├── Session expired → 401 redirect (EC-17)
  │   └── Network lost → poll 30s, else error (EC-23)
  │
  └── Hoan tat → [S10]

[S10: Ket qua Import]
  ├── All success → Toast "Da import N SM thanh cong" (AC4)
  │    └── SM status = DRAFT, SubMerchantID auto-generated
  ├── Partial success → Toast "X thanh cong, Y that bai"
  │    └── [Tai file ket qua]
  ├── All failed → Toast "Import that bai"
  │    └── [Tai file ket qua]
  ├── System error → Toast "Import that bai, thu lai" (EC-24)
  │    └── Preview giu nguyen, Ops retry
  │
  │   File ket qua:
  │   ├── Excel goc + 2 cot: "Trang thai" + "Ly do loi"
  │   ├── Filename: import_result_{YYYYMMDD}_{HHmmss}.xlsx
  │   └── Link hieu luc 24h
  │
  │   Edge cases:
  │   ├── Storage down → "Import OK nhung khong tao dc file KQ" (EC-22)
  │   └── 500 dong deu fail → Toast + file KQ (EC-21)
  │
  └── [Dong dialog] → refresh danh sach SM
```

---

## Flow 3: Kich hoat Sub-merchant (MC_SMC_03)

### Single Activate

```
[S1/S11: Danh sach SM] hoac [Chi tiet SM]

  ├── Check: User co quyen ACTIVE_SUBMERCHANT?
  │    └── NO → Nut disabled + tooltip "Ban khong co quyen" (CC-01)
  │
  ├── Check: SM status = READY_FOR_ACTIVATION?
  │    └── NO → Nut disabled + "SM chua hoan tat ho so" (CC-02)
  │
  ├── Check: Parent = ACTIVE?
  │    └── NO → Nut disabled + "MC cha khong hoat dong" (CC-03)
  │
  ├── Check: SM da ACTIVE?
  │    └── YES → Nut KHONG HIEN THI (CC-04)
  │
  └── All OK → Click [Kich hoat]

[S12: Dialog Xac nhan kich hoat]
  ├── Tom tat: ten SM + loai + parent
  ├── [Huy] → dong dialog
  ├── [Xac nhan kich hoat] → API call
  │    └── Double-click → disabled + spinner (CC-05)
  └── Session expired → redirect login (CC-10)

[S13: API Processing]
  ├── 200 OK:
  │    ├── SM → ACTIVE
  │    │
  │    ├── DVCNTT = YES:
  │    │    ├── Generate API Key OK → keys luu encrypted (CC-07)
  │    │    └── Generate FAIL → api_key_pending, retry BG (CC-08)
  │    │         └── Van fail 3 lan → Alert Ops generate manual
  │    │
  │    ├── DVCNTT = NO → Khong generate key (CC-06)
  │    │
  │    ├── Email notification (async):
  │    │    ├── Gui: NDD email + contact email (dedup)
  │    │    ├── OK → done
  │    │    └── FAIL → retry 3 lan, else alert Ops (CC-16)
  │    │
  │    └── Toast "Kich hoat SM thanh cong" (AC3)
  │         └── Danh sach refresh, badge ACTIVE
  │
  ├── 500 Error:
  │    └── Rollback → SM giu READY (CC-09)
  │         └── Toast "Kich hoat that bai. Thu lai."
  │
  └── Session expired → redirect login (CC-10)
```

### Bulk Activate

```
[S1: Danh sach SM] → Tick checkbox

  ├── Chi SM READY_FOR_ACTIVATION co checkbox enable
  │    └── DRAFT/ACTIVE/SUSPENDED → checkbox greyed out (CC-12)
  ├── > 50 selected → Canh bao do, nut DISABLED (CC-11)
  └── OK → Action bar: "Da chon N SM" + [Kich hoat hang loat]

[S14: Dialog Xac nhan Bulk]
  └── "Kich hoat X Sub-Merchant?" + [Huy] / [Xac nhan]

[S15: API Bulk Processing]
  ├── All success → Toast "Da kich hoat X SM" (AC5-Case1)
  │    └── All SM → ACTIVE, refresh
  │
  ├── Partial → Toast "X/Y thanh cong" (AC5-Case2)
  │    ├── Popup chi tiet: danh sach Y SM that bai + ly do
  │    └── X SM → ACTIVE, Y giu READY
  │
  ├── All failed → Toast "Kich hoat that bai" (AC5-Case3, CC-15)
  │
  │   Race conditions:
  │   ├── SM da activate boi nguoi khac → ALREADY_PROCESSED (CC-13)
  │   ├── Duplicate IDs → BE deduplicate (CC-14)
  │   └── Idempotency: idempotency_key per batch
  │
  └── Audit log: batch_id + per-record result (AC8)
```

### State Cascade

```
[Parent bi SUSPENDED]
  ├── ALL SM children → Tu dong ngung nhan GD (CC-17)
  ├── Badge: "Tam dung do Parent SUSPENDED"
  ├── Khong can thao tac thu cong
  └── Parent ACTIVE lai → SM tu dong ACTIVE lai
```

---

## Flow 4: Quan ly Danh sach & Phan cap (MC_SMC_04)

```
[S1: Trang Quan ly Sub-merchant]
  ├── Header: Vinpearl Nha Trang (MCH001) + [Lam moi] [Import] [Xuat Excel] [+ Tao SM]
  ├── Summary Cards: Tong | Active | Draft | Du HS | Cho duyet | Tam dung
  │    └── Click card → apply filter tuong ung (AC5)
  │
  ├── [Tab 1: Danh sach (N)]
  │    ├── Filter: ALL / dropdown trang thai
  │    ├── Search: ten, ma, SDT (debounce 300ms) (AC4)
  │    │    ├── Tim thay → highlight rows
  │    │    └── Khong thay → empty state "Khong tim thay..."
  │    ├── Table: Ma SM | Ten SM | Loai | Dia chi | Nguoi LH | Ngay tao | Trang thai | ...
  │    ├── Checkbox → bulk actions (max 50)
  │    ├── Row click → navigate [Chi tiet SM]
  │    ├── "..." menu → Xem | Sua | Kich hoat | Tam dung
  │    ├── Pagination / infinite scroll
  │    └── Empty: "Chua co SM nao. Nhan + Them de bat dau." (CC-01)
  │
  └── [Tab 2: Cau truc phan cap (N)]
       ├── Default: chi hien L1, collapsed (AC1)
       ├── Click ► → expand children (lazy load) (AC3)
       ├── Click ▼ → collapse cay con
       ├── Leaf node → bullet •, khong toggle
       ├── [Mo rong tat ca] → expand den L5 (AC3)
       ├── [Thu gon tat ca] → chi L1 (AC3)
       │
       ├── Search: ten/ID/MST/NDD (debounce 300ms) (AC4)
       │    ├── Tim thay → auto expand path root→node, highlight (CC-07)
       │    ├── Khong thay → empty state (CC-06)
       │    └── Xoa search → tro ve trang thai ban dau
       │
       ├── Filter: loc giu context cha (AC5)
       │    ├── Node cha giu lai du khong khop
       │    ├── Summary cards cap nhat theo filter
       │    └── Khong match → empty state (CC-08)
       │
       ├── [Xuat bao cao] → Dialog export (AC6)
       │    ├── So luong ban ghi
       │    ├── Dinh dang: xlsx
       │    ├── Bo loc trang thai
       │    ├── [Tai xuong]
       │    └── > 30s → gui qua email (CC-10)
       │
       ├── Tree node info:
       │    ├── Icon loai: 🏢 IND / 🔗 DEP
       │    ├── Level badge + mau theo cap
       │    ├── Status badge (Active/Draft/Ready/Suspended)
       │    ├── So GD | Doanh thu (aggregated)
       │    ├── So SM con truc tiep (count)
       │    └── 👁️ icon → navigate chi tiet (AC6)
       │
       │   Edge Cases:
       │   ├── > 200 nodes → lazy loading per expand (CC-04)
       │   ├── Circular ref (bug DB) → 422 error (CC-05)
       │   ├── Node expand dong thoi → independent (CC-09)
       │   ├── has_children race → auto-fix icon (CC-03)
       │   ├── Real-time: SM activate/tao moi → refresh (CC-11, CC-12)
       │   └── Parent SUSPENDED → Banner canh bao (CC-13)
       │
       └── Level color coding:
            L1: blue | L2: purple | L3: orange | L4: yellow | L5: gray
```

---

## Flow 5: Chi tiet Sub-merchant (MC_SMC_05)

```
[Danh sach / Phan cap] → Click SM row hoac 👁️

[S11: Chi tiet Sub-merchant]
  ├── Breadcrumb: QL Sub-Merchant > SM-001
  ├── [← Quay lai QL Sub-Merchant]
  │
  ├── Header: Ten SM + Status Badge + Level Badge
  ├── Action buttons (theo status):
  │    ├── DRAFT → [Chinh sua] [Bo sung ho so]
  │    ├── READY → [Kich hoat] [Chinh sua]
  │    ├── ACTIVE → [Tam dung] [Xuat bao cao] [Chinh sua]
  │    │    └── + API Key section (neu DVCNTT=YES)
  │    │         ├── public_key: hien thi
  │    │         ├── secret_key: masked (chi hien 1 lan dau)
  │    │         └── api_key_pending → warning "Dang xu ly"
  │    ├── SUSPENDED → [Kich hoat lai] [Khoa vinh vien]
  │    └── INACTIVE → read-only, khong action
  │
  ├── Metrics: GD | Doanh thu | Phi GD | Thuc nhan | Vi
  │
  ├── [Thong tin doanh nghiep]
  │    ├── Ten DN / Ten hien thi
  │    ├── MST (IND only)
  │    ├── Nguoi dai dien (IND only)
  │    ├── Lien he: ten + SDT + email
  │    ├── Dia chi van hanh
  │    ├── Loai: Chi nhanh / Phap nhan
  │    └── MCC
  │
  ├── [Tai khoan ngan hang]
  │    ├── Ngan hang + Chi nhanh
  │    ├── So tai khoan
  │    └── Chu tai khoan
  │
  └── [3 Tabs]
       ├── [Sub-merchant (N)] → Danh sach SM con
       │    ├── Summary cards
       │    ├── Tree view / list
       │    └── [+ Them] → Tao SM Level tiep theo
       │
       ├── [Lich su giao dich] → Table GD
       │    └── Filter: date range, type, status
       │
       └── [Bien dong vi] → Table bien dong so du
            └── Filter: date range

  Chinh sua:
  ├── Click [Chinh sua] → form edit (pre-filled)
  ├── Thay doi thong tin → validate inline
  ├── [Luu] → API update
  │    ├── OK → Toast "Cap nhat thanh cong"
  │    └── Error → Toast "Cap nhat that bai"
  └── [Huy] → discard changes
```

---

## State Machine

```
                    ┌─────────────────────────┐
                    │                         │
                    ▼                         │
  ┌──────┐    ┌──────────┐    ┌────────┐    │
  │ DRAFT │───▶│  READY   │───▶│ ACTIVE │────┘
  └──────┘    │FOR ACTIV.│    └───┬────┘
   (tao moi)  └──────────┘        │    ▲
   (import)   (du ho so)     ┌────▼────┤
                              │SUSPENDED│
                              └────┬────┘
                                   │
                              ┌────▼────┐
                              │INACTIVE │
                              └─────────┘

Transitions:
  DRAFT → READY_FOR_ACTIVATION : khi du thong tin bat buoc
  READY → ACTIVE              : MC_SMC_03 kich hoat (single/bulk)
  ACTIVE → SUSPENDED          : Tam dung (manual hoac cascade Parent)
  SUSPENDED → ACTIVE          : Kich hoat lai
  ACTIVE → INACTIVE           : Khoa vinh vien
  SUSPENDED → INACTIVE        : Khoa vinh vien
  Parent SUSPENDED → ALL children SUSPENDED (cascade auto)
  Parent ACTIVE → ALL children ACTIVE (cascade auto)
```

---

## Edge Cases (Complete)

### MC_SMC_01 — Tao thu cong

| # | Case | Trigger | UI Response | Source |
|---|---|---|---|---|
| S01-CC-01 | Parent khong BUSINESS | merchantType = INDIVIDUAL | Tab SM an, nut an, API 422 | BRD |
| S01-CC-02 | Parent khong ACTIVE | status = DRAFT/SUSPENDED | Nut disabled + tooltip | BRD |
| S01-CC-03 | Doi loai SM sau nhap | IND → DEP hoac nguoc lai | Dialog confirm reset form | BRD |
| S01-CC-04 | taxId trung (IND) | taxId da ton tai ACTIVE/WFA | Inline error, block luu | BRD |
| S01-CC-05 | Ten hien thi trung | displayName trung MC ACTIVE | Warning, van cho luu | BRD |
| S01-CC-06 | Luu thanh cong | Submit OK | Toast + navigate chi tiet, DRAFT | BRD |

### MC_SMC_02 — Import

| # | Case | Trigger | UI Response | Source |
|---|---|---|---|---|
| EC-01 | File corrupt | File khong parse duoc | Toast "File khong doc duoc" | BRD |
| EC-02 | CSV doi duoi xlsx | Content khong hop le | Toast "Noi dung khong hop le" | BRD |
| EC-03 | Data nham Sheet2 | Sheet1 trong | Toast "Khong tim thay du lieu Sheet1" | BRD |
| EC-04 | Header sai thu tu | Header khac vi tri | Validate theo ten, khong theo vi tri | BRD |
| EC-05 | Merged cells | O bi merge | Unmerge, lay goc tren trai | BRD |
| EC-06 | Excel formulas | =A1&B1 | Toast "Dinh dang field khong hop le" | BRD |
| EC-07 | File > 5MB | Size vuot gioi han | Toast "Vuot dung luong (max 5MB)" | BRD |
| EC-08 | Spaces thua | "  Ha Noi  " | Auto-trim, khong bao loi | BRD |
| EC-09 | Duplicate taxId file | 2 dong cung taxId | Dong dau OK, dong sau FAILED | BRD |
| EC-10 | IND thieu fields | type=IND, bo trong bat buoc | FAILED per field | BRD |
| EC-11 | DEP co taxId | type=DEP nhung dien taxId | Bo qua, khong validate | BRD |
| EC-12 | Phone format la | 090.123.4567 | Auto-clean dau cham/cach/gach | BRD |
| EC-13 | MCC khong ton tai | Ma MCC la | Warning preview, FAILED submit | BRD |
| EC-14 | Phone khoa hoc | 9.01234E+9 | Parse lai, fail → loi format | BRD |
| EC-15 | Concurrent import | 2 Ops import cung taxId | DB unique constraint | BRD |
| EC-16 | Parent deactivated | Parent SUSPENDED khi import | Dong chua xu ly FAILED | BRD |
| EC-17 | Session expired | JWT het han | 401, redirect login | BRD |
| EC-18 | Double-click import | Click nhanh 2 lan | Idempotency key, 1 request | BRD |
| EC-19 | > 500 dong | File qua lon | Toast "Vuot gioi han 500 dong" | BRD |
| EC-20 | Import nhieu lan | Ops import lien tiep | Cho phep, audit per batch | BRD |
| EC-21 | 500 dong deu fail | All FAILED | Toast + file ket qua | BRD |
| EC-22 | Storage down | Khong tao dc file KQ | "Import OK nhung khong tao dc file" | BRD |
| EC-23 | Network lost | Mat ket noi khi import | Poll 30s, else error | BRD |
| EC-24 | Service down | Merchant service die | Partial success, file KQ van ok | BRD |

### MC_SMC_03 — Kich hoat

| # | Case | Trigger | UI Response | Source |
|---|---|---|---|---|
| CC-01 | Khong quyen | User khong co ACTIVE_SUBMERCHANT | Nut disabled + tooltip | BRD |
| CC-02 | SM chua READY | status ≠ READY_FOR_ACTIVATION | Nut disabled + tooltip | BRD |
| CC-03 | Parent khong ACTIVE | Parent SUSPENDED/DRAFT | Nut disabled + tooltip | BRD |
| CC-04 | SM da ACTIVE | Ops co activate SM ACTIVE | Nut khong hien thi, API 422 | BRD |
| CC-05 | Double-click | Click nhanh | Nut disabled + spinner + idempotency | BRD |
| CC-06 | OK + DVCNTT=NO | isPaymentAccepting = false | ACTIVE, khong generate key | BRD |
| CC-07 | OK + DVCNTT=YES | isPaymentAccepting = true | ACTIVE + keys generated | BRD |
| CC-08 | Key generate fail | Key service loi | ACTIVE, api_key_pending, retry BG | BRD |
| CC-09 | API 500 | Server error | Rollback READY, toast error | BRD |
| CC-10 | Session expired | JWT het han | Redirect login | BRD |
| CC-11 | Bulk > 50 | Chon qua nhieu | Canh bao do, nut disabled | BRD |
| CC-12 | Mixed status | Chon READY + DRAFT | Chi READY co checkbox | BRD |
| CC-13 | Concurrent activate | 2 user cung activate | ALREADY_PROCESSED | BRD |
| CC-14 | Duplicate IDs | ids[] co trung | BE deduplicate | BRD |
| CC-15 | Bulk all fail | Tat ca record fail | Toast loi + popup chi tiet | BRD |
| CC-16 | Email fail | Email service loi | Retry 3 lan, alert Ops | BRD |
| CC-17 | Parent suspended | Parent SUSPENDED sau activate | SM cascade tam dung | BRD |
| CC-18 | Need suspend | Ops muon tam dung | Scope khac (MC_SUB_04) | BRD |

### MC_SMC_04 — Danh sach & Phan cap

| # | Case | Trigger | UI Response | Source |
|---|---|---|---|---|
| CC-01 | Khong co SM | Root chua co SM nao | Empty state + CTA | BRD |
| CC-02 | Chi co L1 | Khong co L2+ | Hien thi binh thuong | BRD |
| CC-03 | has_children race | SM con bi xoa giua load | Auto-fix icon ► → • | BRD |
| CC-04 | > 200 nodes | Cau truc phuc tap | Lazy loading per expand | BRD |
| CC-05 | Circular ref | Bug DB: A→B→A | API 422 + canh bao | BRD |
| CC-06 | Search khong match | Tu khoa khong khop | Empty state | BRD |
| CC-07 | Search deep (L5) | Tim node o L5 | Auto expand path + highlight | BRD |
| CC-08 | Filter khong match | Filter status khong co SM | Empty state | BRD |
| CC-09 | Concurrent expand | Click expand nhieu node | Independent, khong block | BRD |
| CC-10 | Export large tree | > 500 nodes | Loading, > 30s → email | BRD |
| CC-11 | Real-time activate | SM duoc activate boi nguoi khac | Badge cap nhat / refresh 30s | BRD |
| CC-12 | SM moi tao | SM moi trong luc xem | Click [Lam moi] de update | BRD |
| CC-13 | Parent suspended | Root bi SUSPENDED | Banner canh bao | BRD |

### Bo sung (BRD thieu)

| # | Case | Trigger | UI Response | Source |
|---|---|---|---|---|
| NEW-01 | Resize browser khi import | Window resize | Responsive dialog | Assumption |
| NEW-02 | Paste tu Google Sheets | Format khac | Detect + clean | Assumption |
| NEW-03 | Level > 3 | N level configurable | UI handle dynamic depth | Assumption |
| NEW-04 | Parent thay doi TT | Parent update info | Banner "Parent updated" | Assumption |
| NEW-05 | Bulk export > 10K | Export qua lon | Async + email link | Assumption |
| NEW-06 | 2 Ops edit cung SM | Concurrent edit | Optimistic locking | Assumption |
| NEW-07 | ACTIVE doi loai | IND↔DEP sau activate | Block: "Khong the doi loai" | Assumption |
| NEW-08 | Delete SM co con | SM co children | Block hoac cascade confirm | Assumption |
| NEW-09 | Unicode BOM | File voi BOM | Auto-detect + strip | Assumption |
| NEW-10 | taxId leading zeros | 0123456789 | Preserve as string | Assumption |

---

## Error States

| Error | Screen | Behavior |
|---|---|---|
| Network timeout | Any API call | Toast "Loi ket noi. Vui long thu lai." + retry button |
| Session expired | Any screen | Redirect to login page. Data khong mat. |
| API 500 | Create/Activate | Rollback. Toast error. User retry. |
| API 422 | Validation | Inline error per field |
| API 403 | Permission denied | Toast + disable action button |
| File parse error | Import | Toast + keep dialog open |
| DB constraint | Import/Create | Inline error (taxId trung) |
| Email send fail | Post-activate | SM van ACTIVE. Retry BG. Alert Ops. |
| Key generate fail | Post-activate | SM van ACTIVE. api_key_pending. Retry BG. |

---

## Summary

- **Total screens**: 15 (S1-S15)
- **Total overlays**: 8 (Dialog: 5, Toast: nhiều, Progress: 1, Action bar: 1, Banner: 1)
- **Total unique UI states**: ~120 (tong cac state + edge case)
- **Max depth**: 4 levels (List → Detail → Edit → Confirm)
- **Edge cases covered**: 61 (6 + 24 + 18 + 13 + 10 bo sung)
- **Status values**: 5 (DRAFT, READY_FOR_ACTIVATION, ACTIVE, SUSPENDED, INACTIVE)

---

*Generated: 2026-04-12 by Nate (Claude Code)*
*Format: Step-03 Design Flow template*
*Source: PRD Create & Manage Sub-Merchant v1.0 + Edge Case Library*
