# Sub-Merchant — User Flows (Complete)

Extracted from PRD + supplemented with edge cases.

---

## Flow 1: Tao Sub-merchant Thu cong (MC_SMC_01)

```
[Ops login] → [Merchant Portal]
     ↓
[Sidebar: Quan ly Sub-merchant]
     ↓
[Trang Quan ly SM] ← summary cards + 2 tabs
     ↓
     ├── Check: Parent = BUSINESS?
     │    └── NO → Tab "Sub-merchants" AN. Nut [+ Them] AN. Stop.
     │
     ├── Check: Parent = ACTIVE?
     │    └── NO → Nut [Tao SM] DISABLED + tooltip "MC can ACTIVE"
     │
     └── YES → Click [+ Tao Sub-merchant]
              ↓
         [Step 1: Chon loai SM]
              ├── Phap nhan doc lap (IND)
              │    └── Form: 18 fields (them MST, NDD, TKNH)
              │
              └── Chi nhanh truc thuoc (DEP)
                   └── Form: 10 fields (ke thua Parent)
              ↓
         [Step 2: Nhap thong tin]
              ├── Nhap du → Button [Xac nhan] ENABLED
              ├── Thieu fields → Button DISABLED
              ├── CC: taxId trung → Inline error, block luu
              ├── CC: Ten hien thi trung → Warning, van cho luu
              ├── CC: Doi loai (IND→DEP) → Dialog reset form
              └── Validation errors → Inline per field
              ↓
         [Step 3: Xac nhan tao]
              └── Review all info → [Huy] / [Xac nhan tao SM]
              ↓
         [Step 4: Submit API]
              ├── 200 OK → Toast "Tao SM thanh cong"
              │            → Navigate → Chi tiet SM (status: DRAFT)
              │            → Audit log: created_by, created_at
              │
              └── 500 Error → Toast "Tao that bai, vui long thu lai"
                             → User retry tu Step 3

--- TAO LEVEL 2/3 ---

[Chi tiet SM Level 1] → [+ Them sub-merchant Level 2]
     ↓
     └── Repeat Step 1-4 voi parent_id = SM Level 1 ID

[Chi tiet SM Level 2] → [+ Them sub-merchant Level 3]
     ↓
     └── Repeat Step 1-4 voi parent_id = SM Level 2 ID
```

---

## Flow 2: Import Sub-merchant (MC_SMC_02)

```
[Trang Quan ly SM] → Click [Import]
     ↓
[Dialog Import]
     ├── [Tai template Excel] → Download .xlsx template
     │
     └── [Chon file / Keo tha]
          ↓
     [Validate File]
          ├── Sai format (.csv, .pdf) → Toast "Chi ho tro .xlsx/.xls"
          ├── > 5MB → Toast "Vuot dung luong"
          ├── Header khong khop → Toast "Khong dung template"
          ├── Khong co du lieu → Toast "Khong co du lieu"
          ├── > 500 dong → Toast "Vuot gioi han 500 dong"
          ├── File corrupt → Toast "File khong doc duoc"
          ├── CSV doi duoi → Toast "Noi dung khong hop le"
          │
          └── OK → Hien thi Preview Table
               ↓
     [Preview & Validate]
          ├── All valid (green ✅) → [Xac nhan Import] ENABLED
          ├── Has errors (red ❌) → [Xac nhan] DISABLED
          │    └── "File co N loi. Vui long sua va upload lai"
          ├── Partial errors → Canh bao "X loi Y OK. Tiep tuc?"
          │    └── Ops xac nhan → chi import dong OK
          ├── All errors → DISABLED "Toan bo du lieu co loi"
          │
          │   --- Validation Rules per field ---
          │   taxId: 10/13 so, unique toan he thong
          │   phone: 10-11 so, auto-clean format
          │   email: dung format
          │   MCC: phai ton tai trong danh muc
          │   IND fields: bat buoc neu type = INDEPENDENT
          │   DEP + taxId: bo qua, khong validate
          │   Spaces: auto-trim
          │   Scientific notation: parse lai
          │   Merged cells: unmerge, lay goc tren trai
          │
          └── Click [Xac nhan Import]
               ↓
     [Processing]
          ├── Progress bar "Dang xu ly X/Y dong..."
          ├── Nut disabled (chong double-click)
          ├── Khong cho dong dialog / navigate
          │    └── Co dong tab → Confirm "Import dang chay. Thoat?"
          │
          │   --- Race Conditions ---
          │   2 Ops import cung taxId → DB unique constraint
          │   Parent bi DEACTIVATE → dong chua xu ly FAILED
          │   Session expired → 401, redirect login
          │   Double-click → idempotency_key
          │
          └── Hoan tat
               ↓
     [Ket qua Import]
          ├── All success → Toast "Da import N SM thanh cong"
          ├── Partial → Toast "X thanh cong, Y that bai"
          ├── All failed → Toast "Import that bai"
          ├── System error → Toast "Import that bai, thu lai"
          │
          └── [Tai file ket qua] → Excel goc + 2 cot:
               ├── "Trang thai": THANH CONG / THAT BAI
               └── "Ly do loi": chi tiet per dong
               File: import_result_{YYYYMMDD}_{HHmmss}.xlsx
               Link: hieu luc 24h

          --- Edge Cases ---
          Storage down → "Import OK nhung khong tao dc file KQ"
          Network lost → Auto poll 30s, else "Mat ket noi"
          Service down → Partial success, file KQ van generate
```

---

## Flow 3: Kich hoat Sub-merchant (MC_SMC_03)

```
=== SINGLE ACTIVATE ===

[Danh sach SM] hoac [Chi tiet SM]
     ↓
     ├── Check: User co quyen ACTIVE_SUBMERCHANT?
     │    └── NO → Nut [Kich hoat] disabled + tooltip
     │
     ├── Check: SM status = READY_FOR_ACTIVATION?
     │    └── NO → Nut disabled + "Chua hoan tat ho so"
     │
     ├── Check: Parent = ACTIVE?
     │    └── NO → Nut disabled + "MC cha khong hoat dong"
     │
     ├── Check: SM da ACTIVE?
     │    └── YES → Nut [Kich hoat] KHONG HIEN THI
     │
     └── All OK → Click [Kich hoat]
          ↓
     [Dialog Xac nhan]
          ├── Tom tat: ten SM + loai + parent
          ├── [Huy] / [Xac nhan kich hoat]
          └── Double-click → disabled + spinner
          ↓
     [API Call]
          ├── 200 OK:
          │    ├── SM → ACTIVE
          │    ├── DVCNTT = YES → Generate API Key
          │    │    ├── Key OK → public_key + secret_key (encrypted)
          │    │    └── Key FAIL → api_key_pending = true
          │    │         └── Retry background 3 lan
          │    │         └── Van fail → Alert Ops generate manual
          │    │
          │    ├── DVCNTT = NO → Khong generate key
          │    │
          │    ├── Email notification (async)
          │    │    ├── Gui: NDD email + contact email (dedup)
          │    │    ├── OK → done
          │    │    └── FAIL → retry 3 lan (1m, 3m, 10m)
          │    │         └── Van fail → email_failed = true, alert Ops
          │    │
          │    └── Toast "Kich hoat SM thanh cong"
          │         └── Danh sach refresh
          │
          ├── 500 Error:
          │    └── Rollback. SM giu READY_FOR_ACTIVATION
          │         └── Toast "Kich hoat that bai. Thu lai."
          │
          └── Session expired:
               └── Redirect login. SM khong thay doi.

=== BULK ACTIVATE ===

[Danh sach SM] → Tick checkbox (toi da 50)
     ↓
     ├── > 50 selected → Canh bao do, nut DISABLED
     ├── Mixed status → Chi READY_FOR_ACTIVATION co checkbox
     │    └── DRAFT/ACTIVE → checkbox greyed out
     │
     └── Action bar: "Da chon N SM" + [Kich hoat hang loat]
          ↓
     [Dialog Xac nhan Bulk]
          └── "Kich hoat X Sub-Merchant?"
          ↓
     [API Bulk - Sequential processing]
          ├── All success → Toast "Da kich hoat X SM"
          ├── Partial → Toast "X/Y" + popup chi tiet loi
          ├── All failed → Toast "Kich hoat that bai"
          │
          │   --- Race Conditions ---
          │   Concurrent: SM da dc activate boi nguoi khac
          │    → ALREADY_PROCESSED trong results[]
          │   Duplicate IDs trong request → BE deduplicate
          │
          └── Idempotency: idempotency_key per batch

=== STATE TRANSITIONS ===

Parent bi SUSPENDED sau khi SM ACTIVE:
  → SM tu dong ngung nhan GD (cascade)
  → Badge: "Tam dung do Parent SUSPENDED"
  → Khong can thao tac thu cong
  → Parent ACTIVE lai → SM tu dong ACTIVE lai
```

---

## Flow 4: Quan ly Danh sach & Phan cap (MC_SMC_04)

```
[Merchant Portal] → [Quan ly Sub-merchant]
     ↓
[Header: Vinpearl Nha Trang (MCH001)]
[Summary Cards: Tong | Active | Draft | Du HS | Cho duyet | Tam dung]
     ↓
     ├── [Tab 1: Danh sach (10)]
     │    ├── Filter: ALL / status dropdown
     │    ├── Search: ten, ma, SDT (debounce 300ms)
     │    ├── Table: Ma SM | Ten | Loai | Dia chi | Nguoi LH | Ngay tao | Trang thai | ...
     │    ├── Row click → Navigate chi tiet SM
     │    ├── "..." menu → Xem | Sua | Kich hoat | Tam dung
     │    ├── Checkbox → Bulk action bar
     │    │
     │    ├── Click summary card → Apply filter tuong ung
     │    │    VD: click "Active (3)" → filter chi ACTIVE
     │    │
     │    └── Empty state: "Chua co SM nao. Nhan + Them de bat dau."
     │
     └── [Tab 2: Cau truc phan cap (20)]
          ├── Default: chi hien L1 (collapsed)
          ├── Click ► expand → hien children (lazy load)
          ├── Click ▼ collapse → an cay con
          ├── [Mo rong tat ca] → expand den L5
          ├── [Thu gon tat ca] → chi L1
          ├── Leaf node: bullet •, khong toggle
          │
          ├── Search: tim theo ten/ID/MST/NDD
          │    └── Tim thay → auto expand path root→node, highlight
          │    └── Khong thay → empty state
          │
          ├── Filter: loc giu context cha
          │    └── Node cha duoc giu lai du khong khop
          │
          ├── [Xuat bao cao] → Dialog config
          │    ├── So luong ban ghi
          │    ├── Dinh dang: xlsx
          │    ├── Bo loc trang thai
          │    ├── [Tai xuong]
          │    └── > 30s → Gui qua email
          │
          ├── Tree node info:
          │    ├── Icon loai: 🏢 IND / 🔗 DEP
          │    ├── Badge cap + badge status
          │    ├── So GD | Doanh thu (aggregated)
          │    ├── So SM con truc tiep
          │    └── 👁️ icon → navigate chi tiet
          │
          │   --- Edge Cases ---
          │   > 200 nodes → lazy loading per expand
          │   Circular ref (bug DB) → 422 error
          │   Node expand dong thoi → independent, khong block
          │   Export > 500 nodes → server generate + email
          │   Real-time: SM duoc activate/tao moi → refresh 30s
          │   Parent SUSPENDED → Banner canh bao dau trang
          │
          └── Color coding by level:
               L1: xanh duong
               L2: tim
               L3: cam
               L4: vang
               L5: xam
```

---

## Flow 5: Chi tiet Sub-merchant (MC_SMC_05)

```
[Danh sach / Phan cap] → Click SM row / 👁️ icon
     ↓
[Breadcrumb: QL Sub-Merchant > SM-001]
[← Quay lai QL Sub-Merchant]
     ↓
[Header: Ten SM + Status Badge + Level]
[Action buttons: [Xuat bao cao] [Chinh sua] [Kich hoat/Tam dung]]
     ↓
[Metrics: GD | Doanh thu | Phi GD | Thuc nhan | Vi]
     ↓
[Thong tin doanh nghiep] | [Tai khoan ngan hang]
  Ten DN                    Ngan hang
  MST                       Chi nhanh
  Nguoi DD                  So tai khoan
  Lien he                   Chu tai khoan
  Dia chi
     ↓
[3 Tabs]
  ├── [Sub-merchant (N)] → Danh sach SM con
  │    ├── Summary cards (Tong/Active/Draft/...)
  │    ├── Tree view SM con
  │    └── [+ Them] → Tao SM Level tiep theo
  │
  ├── [Lich su giao dich] → Table GD
  │
  └── [Bien dong vi] → Table bien dong so du vi

--- States ---
DRAFT: hien thi "Chinh sua" + "Bo sung ho so"
READY: hien thi "Kich hoat"
ACTIVE: hien thi "Tam dung" + "Xuat bao cao"
       + API Key section (neu DVCNTT=YES)
       + api_key_pending warning (neu generate fail)
SUSPENDED: hien thi "Kich hoat lai" + "Khoa vinh vien"
INACTIVE: read-only, khong action
```

---

## State Machine (Complete)

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
                              (khoa vinh vien)

Transitions:
  DRAFT → READY_FOR_ACTIVATION : khi du thong tin bat buoc
  READY → ACTIVE              : MC_SMC_03 kich hoat
  ACTIVE → SUSPENDED          : Tam dung (manual hoac cascade tu Parent)
  SUSPENDED → ACTIVE          : Kich hoat lai
  ACTIVE → INACTIVE           : Khoa vinh vien (khong hoi phuc)
  SUSPENDED → INACTIVE        : Khoa vinh vien tu trang thai tam dung

Cascade rules:
  Parent SUSPENDED → ALL SM children SUSPENDED (auto)
  Parent ACTIVE lai → ALL SM children ACTIVE lai (auto)
  Suspend 1 SM → KHONG anh huong Parent va SM khac
```

---

## Edge Cases BRD Thieu (Bo sung)

| ID | Edge Case | Recommendation |
|---|---|---|
| NEW-01 | Resize browser khi import → layout break | Responsive dialog |
| NEW-02 | Copy-paste tu Google Sheets | Detect + clean format |
| NEW-03 | SM Level > 3 (N level configurable) | UI handle dynamic depth |
| NEW-04 | Parent thay doi thong tin | Banner "Parent updated" |
| NEW-05 | Bulk export > 10,000 rows | Async + email link |
| NEW-06 | 2 Ops edit cung 1 SM | Optimistic locking |
| NEW-07 | SM ACTIVE → doi loai IND↔DEP | Block |
| NEW-08 | Delete SM co SM con | Block hoac cascade confirm |
| NEW-09 | Import file voi Unicode BOM | Auto-detect + strip BOM |
| NEW-10 | Ops paste taxId voi leading zeros | Preserve as string |

---

*Generated: 2026-04-12 by Claude Code UX Analyzer*
*Source: PRD Create & Manage Sub-Merchant v1.0*
