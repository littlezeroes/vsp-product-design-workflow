# UX Analysis Report: Sub-Merchant Management

## Summary

Feature Sub-Merchant Management implement ~60% UI so voi BRD. Danh sach, phan cap, chi tiet, va buoc 1 tao moi da co. **Thieu nhieu flows quan trong**: form nhap thong tin (step 2-5), import dialog, kich hoat flow, va hau het edge cases chua handle.

## Scope

- **BRD**: PRD Create & Manage Sub-Merchant (Confluence v1.0, Mar 30 2026)
- **User Stories**: MC_SMC_01 ~ MC_SMC_05
- **Pages**: `localhost:3001/sub-merchants`, `/create`, `/SM-001`
- **Date**: 2026-04-12

---

## BRD Compliance Matrix

### MC_SMC_01 — Tao sub-merchant thu cong

| # | Requirement | Status | Evidence |
|---|---|---|---|
| Step 1 | Chon loai Sub-merchant (PNDL/CNTT) | DONE | `/create` page co 2 cards |
| Step 2 | Form nhap thong tin (10 fields DEP / 18 fields IND) | MISSING | Card click khong navigate |
| Step 3 | Xac nhan tao (review screen) | MISSING | |
| Step 4 | Ket qua (toast + navigate chi tiet) | MISSING | |
| Step 5 | Tao Level 2/3 tu chi tiet SM | PARTIAL | Detail page co nut "+ Them" |
| AC1 | Permission check (button disabled) | MISSING | |
| AC2 | Form validation (3 cases) | MISSING | |
| AC3 | Submit success/fail (toast messages) | MISSING | |
| S01-CC-01 | Parent khong BUSINESS → tab an | MISSING | |
| S01-CC-02 | Parent khong ACTIVE → button disabled | MISSING | |
| S01-CC-03 | Doi loai reset form → dialog | MISSING | |
| S01-CC-04 | taxId trung → inline error | MISSING | |
| S01-CC-05 | Ten trung → warning (van cho luu) | MISSING | |
| S01-CC-06 | Luu thanh cong → DRAFT + toast | MISSING | |

### MC_SMC_02 — Import sub-merchant (bulk)

| # | Requirement | Status | Evidence |
|---|---|---|---|
| Dialog Import | Nut Import → dialog + tai template | MISSING | Nut "Import" ton tai nhung chua co dialog |
| Upload file | Drag/drop + validate format/size/header | MISSING | |
| Preview table | Green/red rows + tooltip loi | MISSING | |
| Progress bar | "Dang xu ly X/Y dong..." | MISSING | |
| Ket qua | Toast + download file ket qua | MISSING | |
| EC-01 | File corrupt | MISSING | |
| EC-02 | CSV doi duoi .xlsx | MISSING | |
| EC-03 | Data nham Sheet2 | MISSING | |
| EC-04 | Header sai thu tu | MISSING | |
| EC-05 | Merged cells | MISSING | |
| EC-06 | Excel formulas | MISSING | |
| EC-07 | File > 5MB | MISSING | |
| EC-08 | Auto-trim spaces | MISSING | |
| EC-09 | Duplicate taxId trong file | MISSING | |
| EC-10 | IND thieu fields | MISSING | |
| EC-11 | DEP co taxId → bo qua | MISSING | |
| EC-12 | Phone format clean | MISSING | |
| EC-13 | Invalid MCC | MISSING | |
| EC-14 | Scientific notation phone | MISSING | |
| EC-15 | Concurrent import race condition | MISSING | |
| EC-16 | Parent deactivated during import | MISSING | |
| EC-17 | Session expired | MISSING | |
| EC-18 | Double-click (idempotency) | MISSING | |
| EC-19 | > 500 dong | MISSING | |
| EC-20 | Multiple imports allowed | MISSING | |
| EC-21 | 500 dong fail | MISSING | |
| EC-22 | Storage down | MISSING | |
| EC-23 | Network lost | MISSING | |
| EC-24 | Merchant service down | MISSING | |

### MC_SMC_03 — Kich hoat sub-merchant

| # | Requirement | Status | Evidence |
|---|---|---|---|
| Single activate | Dialog confirm + spinner | MISSING | |
| Bulk activate | Checkbox + action bar (max 50) | MISSING | Checkbox ton tai nhung action bar chua co |
| AC1 | Permission check | MISSING | |
| AC2 | Dieu kien kich hoat (3 cases) | MISSING | |
| AC3 | Activate thanh cong → ACTIVE | MISSING | |
| AC4 | Activate that bai → rollback | MISSING | |
| AC5 | Bulk activate (3 cases) | MISSING | |
| AC6 | Generate API Key | MISSING | |
| AC7 | Email notification | MISSING | |
| AC8 | Audit log | MISSING | |
| CC-01~18 | 18 corner cases | MISSING | |

### MC_SMC_04 — Quan ly danh sach & Phan cap

| # | Requirement | Status | Evidence |
|---|---|---|---|
| Tab Danh sach | Table + filter + search | DONE | Filter dropdown + search input co |
| Tab Phan cap | Tree view + expand/collapse | DONE | Co tree L1, nut "Mo rong tat ca" |
| Summary cards | 5 status cards | DONE | Hien thi dung |
| Search real-time | Debounce 300ms | PARTIAL | Input co, chua test debounce |
| Filter theo trang thai | Click card → filter | MISSING | Cards chua clickable |
| Expand All / Collapse All | Toggle buttons | DONE | Nut "Mo rong tat ca" co |
| Xuat bao cao | Dialog config + download | MISSING | Nut co, dialog chua co |
| CC-01 | Chua co SM → empty state | MISSING | |
| CC-04 | > 200 nodes → lazy loading | MISSING | |
| CC-05 | Circular reference → error | MISSING | |
| CC-07 | Search deep node → auto expand | MISSING | |
| CC-10 | Export large tree → email fallback | MISSING | |
| CC-13 | Parent suspended → banner | MISSING | |

### MC_SMC_05 — Chi tiet thong tin sub-merchant

| # | Requirement | Status | Evidence |
|---|---|---|---|
| Detail page | Thong tin DN + TKNH + metrics | DONE | `/sub-merchants/SM-001` |
| 3 tabs (SM/LSGD/Bien dong vi) | Tab navigation | DONE | |
| Chinh sua thong tin | Button "Chinh sua" | PARTIAL | Button co, form edit chua ro |
| Xuat bao cao | Button "Xuat bao cao" | PARTIAL | Button co, chua test |
| Tao SM con | Button "+ Them" | DONE | |
| Status badge | Active/Draft/etc | DONE | |

---

## Problems Found

| # | Severity | Problem | BRD Ref |
|---|---|---|---|
| P01 | CRITICAL | Create flow chi co step 1 — card click khong navigate sang form | MC_SMC_01 Step 2-5 |
| P02 | CRITICAL | Import dialog chua implement | MC_SMC_02 |
| P03 | CRITICAL | Kich hoat flow chua implement | MC_SMC_03 |
| P04 | MAJOR | Export dialog chua implement | MC_SMC_04 AC6 |
| P05 | MAJOR | Filter cards chua clickable | MC_SMC_04 AC5 |
| P06 | MAJOR | Permission check chua co | MC_SMC_01 AC1, MC_SMC_03 AC1 |
| P07 | MAJOR | Bulk action bar chua co | MC_SMC_03 AC5 |
| P08 | MINOR | Status "READY_FOR_ACTIVATION" chua co trong summary cards | MC_SMC_03 |
| P09 | MINOR | State machine chua day du (thieu INACTIVE) | BRD State Machine |
| P10 | MINOR | "..." menu tren rows chua co dropdown actions | MC_SMC_04 |
| P11 | ENHANCEMENT | Search debounce chua kiem chung | MC_SMC_04 AC4 |
| P12 | ENHANCEMENT | Lazy loading cho tree > 200 nodes | MC_SMC_04 CC-04 |
| P13 | ENHANCEMENT | Real-time update summary cards | MC_SMC_04 CC-11 |

---

## Recommended Solutions

### Must Fix (Critical + Major)

**P01 — Create flow step 2-5:**
- Build form component voi 2 variants (DEPENDENT: 10 fields, INDEPENDENT: 18 fields)
- Add stepper/progress indicator
- Add review screen truoc submit
- Add result screen (toast + navigate)
- Files: `/sub-merchants/create/page.tsx` (update), them `step-form.tsx`
- Effort: L

**P02 — Import dialog:**
- Build multi-step dialog: Template download → Upload → Preview table → Progress → Result
- Validation engine cho 24 edge cases
- Files: them `import-dialog.tsx`, `import-preview-table.tsx`
- Effort: L

**P03 — Kich hoat flow:**
- Single: confirm dialog → API call → result toast
- Bulk: checkbox selection → action bar → confirm → progress → result popup
- Permission gate
- Files: them `activate-dialog.tsx`, `bulk-action-bar.tsx`
- Effort: L

**P04 — Export dialog:**
- Config dialog: so luong, format, filter
- Loading state → download
- Files: them `export-dialog.tsx`
- Effort: M

**P05 — Filter cards clickable:**
- Them onClick vao summary cards → apply filter tuong ung
- Files: update list/hierarchy components
- Effort: S

**P06 — Permission check:**
- Gate buttons based on user role/permissions
- Disabled state + tooltip
- Effort: M

**P07 — Bulk action bar:**
- Floating bar khi chon checkbox: "Da chon N" + action buttons
- Max 50 validation
- Effort: M

### Should Fix (Minor)

**P08 — READY_FOR_ACTIVATION status:** Them vao summary cards va filter options
**P09 — INACTIVE status:** Them vao state machine
**P10 — Row actions menu:** Dropdown voi: Xem chi tiet, Chinh sua, Kich hoat, Tam dung, Xoa

### Nice to Have (Enhancement)

**P11 — Search debounce:** Verify 300ms debounce
**P12 — Lazy loading:** Implement cho tree > 200 nodes
**P13 — Real-time updates:** WebSocket hoac polling 30s

---

## Implementation Order

1. **P01** Create flow (Critical — core feature)
2. **P03** Kich hoat flow (Critical — unblocks Active status)
3. **P02** Import dialog (Critical — bulk operation)
4. **P07** Bulk action bar (Major — enables bulk activate)
5. **P06** Permission check (Major — security)
6. **P04** Export dialog (Major — reporting)
7. **P05** Filter cards (Major — UX improvement)
8. **P08-P10** Minor fixes
9. **P11-P13** Enhancements

---

## Edge Cases BRD Thieu (Bo sung)

| # | Edge Case | Recommendation |
|---|---|---|
| EC-NEW-01 | User resize browser khi dang import → layout break | Responsive dialog |
| EC-NEW-02 | Copy-paste du lieu tu Google Sheets → format khac Excel | Detect va clean format |
| EC-NEW-03 | SM Level > 3 (BRD noi N level configurable) | UI can handle dynamic depth |
| EC-NEW-04 | Parent thay doi thong tin → SM con co reflect? | Banner "Parent updated" |
| EC-NEW-05 | Bulk export > 10,000 rows | Async + email download link |
| EC-NEW-06 | Concurrent edit: 2 ops edit cung 1 SM | Optimistic locking + conflict dialog |
| EC-NEW-07 | SM da ACTIVE → doi loai (IND↔DEP) | Block: "Khong the doi loai sau khi kich hoat" |
| EC-NEW-08 | Delete SM co SM con | Block: "Hay xoa SM con truoc" hoac cascade confirm |

---

## Coverage Score

| Dimension | Implemented | Total BRD | Coverage |
|---|---|---|---|
| User Stories | 2/5 partial | 5 | ~30% |
| Acceptance Criteria | 8/35 | 35 | ~23% |
| Corner Cases (MC_SMC_01) | 0/6 | 6 | 0% |
| Corner Cases (MC_SMC_02) | 0/24 | 24 | 0% |
| Corner Cases (MC_SMC_03) | 0/18 | 18 | 0% |
| Corner Cases (MC_SMC_04) | 3/13 | 13 | ~23% |
| Corner Cases (MC_SMC_05) | N/A | TBD | N/A |
| **Overall** | | | **~20%** |

---

*Report generated: 2026-04-12 by Claude Code UX Analyzer*
