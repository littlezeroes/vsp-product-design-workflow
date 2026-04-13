"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"

/* ── Data ─────────────────────────────────────────────────────── */
interface Screen {
  screen: string
  route: string
  states: { label: string; param: string }[]
}

interface Epic {
  id: string
  title: string
  desc: string
  color: string
  screens: Screen[]
}

const BASE_URL = "http://localhost:3001"

const EPICS: Epic[] = [
  /* ═══ MC_SMC_04 — Danh sach & Phan cap ═══ */
  {
    id: "e1",
    title: "Epic 1 — Danh sach & Phan cap (MC_SMC_04)",
    desc: "S1: Danh sach · S2: Phan cap · S3: Export",
    color: "#6366f1",
    screens: [
      {
        screen: "S1: Tab Danh sach",
        route: "/sub-merchants",
        states: [
          { label: "default (10 items)", param: "" },
          { label: "empty-list (CC-01)", param: "?state=empty" },
          { label: "loading", param: "?state=loading" },
          { label: "filter: Active", param: "?filter=active" },
          { label: "filter: Draft", param: "?filter=draft" },
          { label: "filter: Tam dung", param: "?filter=suspended" },
          { label: "search result", param: "?search=vinpearl" },
          { label: "search no-result (CC-06)", param: "?search=xyz" },
          { label: "bulk select (checkboxes)", param: "?state=bulk-select" },
          { label: "action bar (N selected)", param: "?state=action-bar" },
        ],
      },
      {
        screen: "S2: Tab Cau truc phan cap",
        route: "/sub-merchants",
        states: [
          { label: "default (L1 collapsed)", param: "?tab=hierarchy" },
          { label: "expanded L2", param: "?tab=hierarchy&expand=L2" },
          { label: "expanded all (Mo rong)", param: "?tab=hierarchy&expand=all" },
          { label: "search highlight (CC-07)", param: "?tab=hierarchy&search=vinke" },
          { label: "filter Active only", param: "?tab=hierarchy&filter=active" },
          { label: "empty tree (CC-01)", param: "?tab=hierarchy&state=empty" },
          { label: "lazy loading >200 (CC-04)", param: "?tab=hierarchy&state=lazy" },
          { label: "circular ref error (CC-05)", param: "?tab=hierarchy&state=circular-error" },
          { label: "parent SUSPENDED banner (CC-13)", param: "?tab=hierarchy&state=parent-suspended" },
        ],
      },
      {
        screen: "S3: Export bao cao",
        route: "/sub-merchants",
        states: [
          { label: "export dialog", param: "?modal=export" },
          { label: "exporting (loading)", param: "?modal=export&state=loading" },
          { label: "export success", param: "?modal=export&state=success" },
          { label: "export >500 → email (CC-10)", param: "?modal=export&state=email-fallback" },
        ],
      },
    ],
  },
  /* ═══ MC_SMC_01 — Tao thu cong ═══ */
  {
    id: "e2",
    title: "Epic 2 — Tao Sub-Merchant (MC_SMC_01)",
    desc: "S4→S5→S6→S7→S8: Chon loai → Form → Xac nhan → KQ",
    color: "#22c55e",
    screens: [
      {
        screen: "S4: Pre-check truoc tao",
        route: "/sub-merchants",
        states: [
          { label: "nut Tao SM enabled", param: "?state=create-enabled" },
          { label: "CC-01: Parent khong BUSINESS → an", param: "?state=parent-individual" },
          { label: "CC-02: Parent khong ACTIVE → disabled", param: "?state=parent-not-active" },
          { label: "no permission → disabled", param: "?state=no-permission" },
        ],
      },
      {
        screen: "S5: Chon loai Sub-merchant",
        route: "/sub-merchants/create",
        states: [
          { label: "default (chua chon)", param: "" },
          { label: "Chi nhanh truc thuoc selected", param: "?type=dependent" },
          { label: "Phap nhan doc lap selected", param: "?type=independent" },
        ],
      },
      {
        screen: "S6: Form nhap TT — Chi nhanh (DEP, 10 fields)",
        route: "/sub-merchants/create",
        states: [
          { label: "empty form", param: "?step=2&type=dep" },
          { label: "partially filled", param: "?step=2&type=dep&state=partial" },
          { label: "all valid → btn enabled", param: "?step=2&type=dep&state=valid" },
          { label: "validation errors (AC2-C3)", param: "?step=2&type=dep&state=errors" },
          { label: "CC-05: ten trung → warning", param: "?step=2&type=dep&state=name-dup" },
        ],
      },
      {
        screen: "S6b: Form nhap TT — Phap nhan (IND, 18 fields)",
        route: "/sub-merchants/create",
        states: [
          { label: "empty form (18 fields)", param: "?step=2&type=ind" },
          { label: "all valid", param: "?step=2&type=ind&state=valid" },
          { label: "CC-04: taxId trung → inline error", param: "?step=2&type=ind&state=tax-dup" },
          { label: "CC-03: doi loai → reset dialog", param: "?step=2&type=ind&state=switch-type" },
          { label: "TKNH verify Napas", param: "?step=2&type=ind&state=bank-verify" },
        ],
      },
      {
        screen: "S7: Xac nhan tao SM",
        route: "/sub-merchants/create",
        states: [
          { label: "review (read-only)", param: "?step=3" },
          { label: "submitting (loading)", param: "?step=3&state=submitting" },
        ],
      },
      {
        screen: "S8: Ket qua tao SM",
        route: "/sub-merchants/create",
        states: [
          { label: "CC-06: thanh cong → DRAFT + toast", param: "?step=4&result=success" },
          { label: "that bai → toast error + retry", param: "?step=4&result=fail" },
          { label: "taxId trung server-side", param: "?step=4&result=tax-conflict" },
        ],
      },
      {
        screen: "S8b: Tao SM Level 2/3 tu chi tiet",
        route: "/sub-merchants/SM-001",
        states: [
          { label: "nut [+ Them SM Level 2]", param: "?state=add-child" },
          { label: "tao Level 3 tu Level 2", param: "?state=add-level3" },
        ],
      },
    ],
  },
  /* ═══ MC_SMC_02 — Import ═══ */
  {
    id: "e3",
    title: "Epic 3 — Import Sub-Merchant (MC_SMC_02)",
    desc: "S9→S10→S11→S12→S13: Template → Upload → Preview → Process → KQ",
    color: "#f59e0b",
    screens: [
      {
        screen: "S9: Dialog Import — Tai template",
        route: "/sub-merchants",
        states: [
          { label: "dialog open", param: "?modal=import" },
          { label: "downloading template", param: "?modal=import&state=download-tpl" },
        ],
      },
      {
        screen: "S10: Upload file",
        route: "/sub-merchants",
        states: [
          { label: "upload area (drag/drop)", param: "?modal=import&step=upload" },
          { label: "file selected", param: "?modal=import&step=upload&state=selected" },
          { label: "uploading", param: "?modal=import&step=upload&state=uploading" },
          { label: "EC-01: file corrupt", param: "?modal=import&step=upload&err=corrupt" },
          { label: "EC-02: CSV doi duoi xlsx", param: "?modal=import&step=upload&err=fake-xlsx" },
          { label: "EC-03: Sheet1 trong", param: "?modal=import&step=upload&err=empty-sheet" },
          { label: "EC-04: header sai thu tu (OK)", param: "?modal=import&step=upload&state=header-reorder" },
          { label: "EC-06: formulas error", param: "?modal=import&step=upload&err=formulas" },
          { label: "EC-07: file >5MB", param: "?modal=import&step=upload&err=too-large" },
          { label: "EC-19: >500 dong", param: "?modal=import&step=upload&err=too-many" },
        ],
      },
      {
        screen: "S11: Preview & Validate",
        route: "/sub-merchants",
        states: [
          { label: "all valid (green rows)", param: "?modal=import&step=preview&state=all-valid" },
          { label: "has errors (red rows)", param: "?modal=import&step=preview&state=has-errors" },
          { label: "all errors → disabled", param: "?modal=import&step=preview&state=all-errors" },
          { label: "partial errors → confirm", param: "?modal=import&step=preview&state=partial" },
          { label: "EC-05: merged cells warn", param: "?modal=import&step=preview&err=merged" },
          { label: "EC-08: auto-trim spaces", param: "?modal=import&step=preview&state=trimmed" },
          { label: "EC-09: dup taxId in file", param: "?modal=import&step=preview&err=dup-tax" },
          { label: "EC-10: IND thieu fields", param: "?modal=import&step=preview&err=ind-missing" },
          { label: "EC-11: DEP co taxId → skip", param: "?modal=import&step=preview&state=dep-tax-skip" },
          { label: "EC-12: phone format clean", param: "?modal=import&step=preview&state=phone-clean" },
          { label: "EC-13: invalid MCC", param: "?modal=import&step=preview&err=bad-mcc" },
          { label: "EC-14: scientific phone", param: "?modal=import&step=preview&err=sci-phone" },
        ],
      },
      {
        screen: "S12: Processing import",
        route: "/sub-merchants",
        states: [
          { label: "progress bar X/Y", param: "?modal=import&step=process" },
          { label: "EC-15: concurrent (race)", param: "?modal=import&step=process&err=race" },
          { label: "EC-16: parent deactivated", param: "?modal=import&step=process&err=parent-off" },
          { label: "EC-17: session expired", param: "?modal=import&step=process&err=session" },
          { label: "EC-18: double-click block", param: "?modal=import&step=process&state=idempotent" },
          { label: "EC-23: network lost", param: "?modal=import&step=process&err=network" },
        ],
      },
      {
        screen: "S13: Ket qua import",
        route: "/sub-merchants",
        states: [
          { label: "all success → download", param: "?modal=import&step=result&state=all-ok" },
          { label: "partial success X/Y", param: "?modal=import&step=result&state=partial" },
          { label: "all failed", param: "?modal=import&step=result&state=all-fail" },
          { label: "EC-21: 500 dong fail", param: "?modal=import&step=result&err=500-fail" },
          { label: "EC-22: storage down", param: "?modal=import&step=result&err=no-file" },
          { label: "EC-24: service down", param: "?modal=import&step=result&err=service-down" },
          { label: "system error → retry", param: "?modal=import&step=result&state=sys-error" },
        ],
      },
    ],
  },
  /* ═══ MC_SMC_03 — Kich hoat ═══ */
  {
    id: "e4",
    title: "Epic 4 — Kich hoat Sub-Merchant (MC_SMC_03)",
    desc: "S14: Single · S15: Bulk · S16: KQ + API Key + Email",
    color: "#8b5cf6",
    screens: [
      {
        screen: "S14: Pre-check kich hoat",
        route: "/sub-merchants/SM-001",
        states: [
          { label: "READY → btn enabled", param: "?state=ready-to-activate" },
          { label: "CC-01: no permission → disabled", param: "?state=no-perm-activate" },
          { label: "CC-02: not READY → disabled", param: "?state=not-ready" },
          { label: "CC-03: parent not ACTIVE", param: "?state=parent-inactive" },
          { label: "CC-04: da ACTIVE → btn hidden", param: "?state=already-active" },
        ],
      },
      {
        screen: "S14b: Dialog xac nhan kich hoat (Single)",
        route: "/sub-merchants/SM-001",
        states: [
          { label: "confirm dialog", param: "?modal=activate" },
          { label: "CC-05: double-click → spinner", param: "?modal=activate&state=processing" },
          { label: "CC-10: session expired", param: "?modal=activate&err=session" },
        ],
      },
      {
        screen: "S15: Bulk Activate",
        route: "/sub-merchants",
        states: [
          { label: "select multiple READY", param: "?state=bulk-activate-select" },
          { label: "CC-11: >50 → disabled", param: "?state=bulk-over-50" },
          { label: "CC-12: mixed status → grey", param: "?state=bulk-mixed-status" },
          { label: "confirm dialog bulk", param: "?modal=bulk-activate" },
          { label: "CC-13: concurrent activate", param: "?modal=bulk-activate&state=concurrent" },
          { label: "CC-14: dup IDs → dedupe", param: "?modal=bulk-activate&state=dedupe" },
        ],
      },
      {
        screen: "S16: Ket qua Kich hoat",
        route: "/sub-merchants/SM-001",
        states: [
          { label: "single success (AC3)", param: "?result=activate-ok" },
          { label: "single fail → rollback (CC-09)", param: "?result=activate-fail" },
          { label: "CC-06: OK + DVCNTT=NO (no key)", param: "?result=activate-no-key" },
          { label: "CC-07: OK + DVCNTT=YES (key OK)", param: "?result=activate-with-key" },
          { label: "CC-08: key generate fail", param: "?result=activate-key-pending" },
          { label: "CC-16: email send fail", param: "?result=activate-email-fail" },
          { label: "bulk all success (AC5-C1)", param: "?result=bulk-all-ok" },
          { label: "bulk partial (AC5-C2)", param: "?result=bulk-partial" },
          { label: "bulk all fail (CC-15)", param: "?result=bulk-all-fail" },
          { label: "CC-17: parent cascade suspend", param: "?result=parent-cascade" },
        ],
      },
    ],
  },
  /* ═══ MC_SMC_05 — Chi tiet ═══ */
  {
    id: "e5",
    title: "Epic 5 — Chi tiet & Chinh sua (MC_SMC_05)",
    desc: "S17: Chi tiet · S18: Edit · S19: API Key",
    color: "#ef4444",
    screens: [
      {
        screen: "S17: Chi tiet Sub-merchant",
        route: "/sub-merchants/SM-001",
        states: [
          { label: "ACTIVE detail", param: "" },
          { label: "DRAFT detail", param: "?status=draft" },
          { label: "READY detail", param: "?status=ready" },
          { label: "SUSPENDED detail", param: "?status=suspended" },
          { label: "INACTIVE (read-only)", param: "?status=inactive" },
          { label: "3 tabs: SM/LSGD/Bien dong", param: "?tab=transactions" },
        ],
      },
      {
        screen: "S18: Chinh sua thong tin",
        route: "/sub-merchants/SM-001/edit",
        states: [
          { label: "editing (pre-filled)", param: "" },
          { label: "validation error", param: "?state=errors" },
          { label: "saving (loading)", param: "?state=saving" },
          { label: "saved success → toast", param: "?state=saved" },
          { label: "save failed → toast error", param: "?state=save-failed" },
        ],
      },
      {
        screen: "S19: API Key section",
        route: "/sub-merchants/SM-001",
        states: [
          { label: "keys hien thi (DVCNTT=YES)", param: "?state=api-key-visible" },
          { label: "key pending (generate fail)", param: "?state=api-key-pending" },
          { label: "key masked (sau lan dau)", param: "?state=api-key-masked" },
          { label: "DVCNTT=NO → khong co section", param: "?state=no-api-key" },
        ],
      },
    ],
  },
  /* ═══ State Machine ═══ */
  {
    id: "e6",
    title: "Epic 6 — State Machine & Cascade",
    desc: "DRAFT → READY → ACTIVE → SUSPENDED → INACTIVE",
    color: "#06b6d4",
    screens: [
      {
        screen: "State transitions",
        route: "/sub-merchants",
        states: [
          { label: "DRAFT (moi tao/import)", param: "?state=sm-draft" },
          { label: "DRAFT → READY (du ho so)", param: "?state=sm-ready" },
          { label: "READY → ACTIVE (kich hoat)", param: "?state=sm-active" },
          { label: "ACTIVE → SUSPENDED (tam dung)", param: "?state=sm-suspended" },
          { label: "SUSPENDED → ACTIVE (kich hoat lai)", param: "?state=sm-reactivate" },
          { label: "→ INACTIVE (khoa vinh vien)", param: "?state=sm-inactive" },
          { label: "Parent SUSPENDED → cascade all", param: "?state=sm-cascade" },
        ],
      },
    ],
  },
]

/* ── Flow charts per epic ─────────────────────────────────────── */
const FLOW_CHARTS: Record<string, string> = {
  e1: `flowchart TD
  START((Vao\\nQL SM)) --> TAB{Tab?}
  TAB -->|Danh sach| S1[S1: Bang\\ndanh sach]
  TAB -->|Phan cap| S2[S2: Cay\\nphan cap]
  S1 --> D15{Hanh dong?}
  D15 -->|Filter| FILTER[Loc theo\\ntrang thai]
  D15 -->|Search| SEARCH[Tim kiem\\nten/ID/MST]
  D15 -->|Tao moi| CREATE[Go Epic 2]
  D15 -->|Import| IMPORT[Go Epic 3]
  D15 -->|Export| S3[S3: Dialog\\nxuat bao cao]
  D15 -->|Xem chi tiet| DETAIL[Go Epic 5]
  D15 -->|Kich hoat| ACTIVATE[Go Epic 4]
  FILTER --> S1
  SEARCH --> S1
  S2 --> D16{Hanh dong?}
  D16 -->|Expand| EXPAND[Lazy load\\nchildren]
  D16 -->|Search| SEARCH2[Tim & highlight\\nauto expand]
  D16 -->|Export| S3
  EXPAND --> S2
  SEARCH2 --> S2
  S3 --> DOWNLOAD[Tai file Excel]
  classDef st fill:#6366f1,stroke:#4f46e5,color:#fff
  classDef sc fill:#1a1a2e,stroke:#374151,color:#e5e5e5
  classDef dc fill:#0f172a,stroke:#6366f1,color:#c7d2fe
  classDef lk fill:#1e1b4b,stroke:#818cf8,color:#c7d2fe
  classDef ac fill:#162032,stroke:#3b82f6,color:#93c5fd
  class START st
  class S1,S2,S3,FILTER,SEARCH,EXPAND,SEARCH2 sc
  class TAB,D15,D16 dc
  class CREATE,IMPORT,DETAIL,ACTIVATE lk
  class DOWNLOAD ac`,

  e2: `flowchart TD
  START((Tao\\nSM)) --> CHECK{Parent\\nBUSINESS\\n& ACTIVE?}
  CHECK -->|No| BLOCK[Nut Tao SM\\ndisabled]
  CHECK -->|Yes| S5[S5: Chon loai\\nPNDL / CNTT]
  S5 --> S6[S6: Form nhap\\nthong tin]
  S6 --> D3{Hop le?}
  D3 -->|Loi| S6
  D3 -->|taxId trung| ERR1[CC-04: Inline\\nerror block]
  D3 -->|Ten trung| WARN1[CC-05: Warning\\nvan cho luu]
  WARN1 --> S7
  D3 -->|OK| S7[S7: Xac nhan\\ntao SM]
  S7 --> D4{Submit?}
  D4 -->|Huy| S5
  D4 -->|OK| RESULT{API}
  RESULT -->|200| S8OK[S8: Thanh cong\\nDRAFT + toast]
  RESULT -->|500| S8FAIL[S8: That bai\\ntoast error]
  S8OK --> LIST((Danh sach))
  S8FAIL --> S7
  classDef st fill:#22c55e,stroke:#16a34a,color:#fff
  classDef sc fill:#1a1a2e,stroke:#374151,color:#e5e5e5
  classDef dc fill:#0f172a,stroke:#22c55e,color:#bbf7d0
  classDef ok fill:#052e16,stroke:#22c55e,color:#86efac
  classDef fl fill:#450a0a,stroke:#ef4444,color:#fca5a5
  classDef hm fill:#6366f1,stroke:#4f46e5,color:#fff
  classDef wn fill:#422006,stroke:#f59e0b,color:#fde68a
  class START st
  class S5,S6,S7 sc
  class CHECK,D3,D4,RESULT dc
  class S8OK ok
  class S8FAIL fl
  class BLOCK fl
  class ERR1 fl
  class WARN1 wn
  class LIST hm`,

  e3: `flowchart TD
  START((Import\\nSM)) --> S9[S9: Dialog\\nTai template]
  S9 --> S10[S10: Upload file]
  S10 --> D8{File hop le?}
  D8 -->|Sai format| ERR1[Toast loi\\nformat/size]
  D8 -->|OK| S11[S11: Preview\\n& Validate]
  S11 --> D9{Du lieu?}
  D9 -->|All OK| CONFIRM[Nut Import\\nenabled]
  D9 -->|Co loi| D9B{Tat ca loi?}
  D9B -->|Yes| BLOCK[Disabled\\nSua file]
  D9B -->|Partial| PARTIAL[X loi Y OK\\nConfirm?]
  PARTIAL --> CONFIRM
  CONFIRM --> S12[S12: Processing\\nProgress bar]
  S12 --> S13{Ket qua}
  S13 -->|All OK| OK[Toast N\\nthanh cong]
  S13 -->|Partial| MIX[Toast X/Y\\nTai KQ]
  S13 -->|All fail| FAIL[Toast loi\\nRetry]
  S13 -->|System| SYSERR[Toast loi\\nHe thong]
  ERR1 --> S10
  BLOCK --> S10
  classDef st fill:#f59e0b,stroke:#d97706,color:#fff
  classDef sc fill:#1a1a2e,stroke:#374151,color:#e5e5e5
  classDef dc fill:#0f172a,stroke:#f59e0b,color:#fde68a
  classDef ok fill:#052e16,stroke:#22c55e,color:#86efac
  classDef fl fill:#450a0a,stroke:#ef4444,color:#fca5a5
  classDef wn fill:#422006,stroke:#f59e0b,color:#fde68a
  class START st
  class S9,S10,S11,S12,CONFIRM sc
  class D8,D9,D9B,S13 dc
  class OK ok
  class ERR1,BLOCK,FAIL,SYSERR fl
  class PARTIAL,MIX wn`,

  e4: `flowchart TD
  START((Kich hoat\\nSM)) --> D1{Quyen?}
  D1 -->|Khong| NOPERM[CC-01: Disabled\\ntooltip]
  D1 -->|Co| D2{Status =\\nREADY?}
  D2 -->|Khong| NOREADY[CC-02: Disabled\\nChua du HS]
  D2 -->|Co| D3{Parent\\nACTIVE?}
  D3 -->|Khong| NOPARENT[CC-03: Disabled\\nParent off]
  D3 -->|Co| MODE{Don le\\nhay Bulk?}
  MODE -->|Don le| S14[S14: Dialog\\nxac nhan]
  MODE -->|Bulk max50| S15[S15: Chon\\nmax 50]
  S14 --> API1{API}
  S15 --> API2{API Bulk}
  API1 -->|OK| S16A[ACTIVE\\n+ toast]
  API1 -->|Fail| FAIL1[CC-09: Rollback\\ntoast loi]
  API2 -->|All OK| S16B[Toast X\\nthanh cong]
  API2 -->|Partial| MIX[Toast X/Y\\npopup detail]
  API2 -->|All fail| FAIL2[CC-15: Toast\\nloi retry]
  S16A --> DVCNTT{DVCNTT?}
  DVCNTT -->|YES| GENKEY{Generate\\nAPI Key}
  DVCNTT -->|NO| DONE1[CC-06: OK\\nkhong key]
  GENKEY -->|OK| DONE2[CC-07: Key OK\\nemail gui]
  GENKEY -->|Fail| PENDING[CC-08: Pending\\nretry BG]
  classDef st fill:#8b5cf6,stroke:#7c3aed,color:#fff
  classDef sc fill:#1a1a2e,stroke:#374151,color:#e5e5e5
  classDef dc fill:#0f172a,stroke:#8b5cf6,color:#ddd6fe
  classDef ok fill:#052e16,stroke:#22c55e,color:#86efac
  classDef fl fill:#450a0a,stroke:#ef4444,color:#fca5a5
  classDef wn fill:#422006,stroke:#f59e0b,color:#fde68a
  classDef ac fill:#162032,stroke:#3b82f6,color:#93c5fd
  class START st
  class S14,S15 sc
  class D1,D2,D3,MODE,API1,API2,DVCNTT,GENKEY dc
  class S16A,S16B,DONE1,DONE2 ok
  class NOPERM,NOREADY,NOPARENT,FAIL1,FAIL2 fl
  class MIX,PENDING wn`,

  e5: `flowchart TD
  START((Chi tiet\\nSM)) --> S17[S17: Chi tiet\\nSub-merchant]
  S17 --> D6{Hanh dong?}
  D6 -->|Chinh sua| S18[S18: Form\\nedit info]
  D6 -->|Kich hoat| ACT[Go Epic 4]
  D6 -->|Tam dung| SUSP[Dialog\\ntam dung]
  D6 -->|Tao SM con| CHILD[Go Epic 2\\nLevel +1]
  D6 -->|Xem LSGD| TAB2[Tab Lich su\\ngiao dich]
  D6 -->|Xem vi| TAB3[Tab Bien dong\\nvi]
  S18 --> D7{Luu?}
  D7 -->|OK| S17
  D7 -->|Fail| ERR[Toast error]
  D7 -->|Huy| S17
  ERR --> S18
  SUSP --> SUSPENDED[Status:\\nSUSPENDED]
  SUSPENDED --> S17
  classDef st fill:#ef4444,stroke:#dc2626,color:#fff
  classDef sc fill:#1a1a2e,stroke:#374151,color:#e5e5e5
  classDef dc fill:#0f172a,stroke:#ef4444,color:#fecaca
  classDef ok fill:#052e16,stroke:#22c55e,color:#86efac
  classDef fl fill:#450a0a,stroke:#ef4444,color:#fca5a5
  classDef lk fill:#1e1b4b,stroke:#818cf8,color:#c7d2fe
  classDef ac fill:#162032,stroke:#3b82f6,color:#93c5fd
  class START st
  class S17,S18,TAB2,TAB3 sc
  class D6,D7 dc
  class SUSP,ERR fl
  class ACT,CHILD lk
  class SUSPENDED ac`,

  e6: `flowchart LR
  DRAFT[DRAFT\\nmoi tao/import] -->|Du ho so| READY[READY FOR\\nACTIVATION]
  READY -->|Kich hoat| ACTIVE[ACTIVE\\nhoat dong]
  ACTIVE -->|Tam dung| SUSPENDED[SUSPENDED\\ntam khoa]
  SUSPENDED -->|Kich hoat lai| ACTIVE
  ACTIVE -->|Khoa vinh vien| INACTIVE[INACTIVE\\nngung VV]
  SUSPENDED -->|Khoa vinh vien| INACTIVE
  ACTIVE -.->|Parent SUSPENDED| PCASCADE[Cascade\\nSUSPEND all]
  PCASCADE -.-> SUSPENDED
  classDef draft fill:#374151,stroke:#6b7280,color:#e5e5e5
  classDef ready fill:#1e1b4b,stroke:#6366f1,color:#c7d2fe
  classDef active fill:#052e16,stroke:#22c55e,color:#86efac
  classDef susp fill:#422006,stroke:#f59e0b,color:#fde68a
  classDef inactive fill:#450a0a,stroke:#ef4444,color:#fca5a5
  classDef cascade fill:#0f172a,stroke:#06b6d4,color:#a5f3fc
  class DRAFT draft
  class READY ready
  class ACTIVE active
  class SUSPENDED susp
  class INACTIVE inactive
  class PCASCADE cascade`,
}

/* Flatten for Prev/Next navigation */
const ALL_SCREENS = EPICS.flatMap((e) => e.screens)
const TOTAL_STATES = ALL_SCREENS.reduce((acc, s) => acc + s.states.length, 0)

function findEpicIdx(flatScreenIdx: number): number {
  let count = 0
  for (let i = 0; i < EPICS.length; i++) {
    count += EPICS[i].screens.length
    if (flatScreenIdx < count) return i
  }
  return 0
}

/* ── Shared styles ────────────────────────────────────────────── */
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

const tabStyle = (active: boolean): React.CSSProperties => ({
  padding: "8px 16px",
  fontSize: 12,
  fontWeight: 600,
  fontFamily: FONT,
  border: "none",
  borderBottom: active ? "2px solid var(--foreground)" : "2px solid transparent",
  background: "transparent",
  color: active ? "var(--foreground)" : "var(--muted-foreground)",
  cursor: "pointer",
  letterSpacing: "0.5px",
})

/* ── Mermaid renderer ─────────────────────────────────────────── */
function FlowRenderer({ chart, epicId }: { chart: string; epicId: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    async function render() {
      const mermaid = (await import("mermaid")).default
      const isDark = document.documentElement.classList.contains("dark")
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? "dark" : "neutral",
        themeVariables: isDark ? {
          darkMode: true,
          primaryColor: "#6366f1",
          primaryTextColor: "#e5e5e5",
          primaryBorderColor: "#4f46e5",
          lineColor: "#525252",
          secondaryColor: "#1e1b4b",
          tertiaryColor: "#0f172a",
          fontSize: "13px",
          fontFamily: FONT,
        } : {
          darkMode: false,
          primaryColor: "#f5f5f5",
          primaryTextColor: "#080808",
          primaryBorderColor: "#a3a3a3",
          lineColor: "#a3a3a3",
          secondaryColor: "#f5f5f5",
          tertiaryColor: "#fafafa",
          fontSize: "13px",
          fontFamily: FONT,
        },
        flowchart: { htmlLabels: true, curve: "basis", padding: 14, nodeSpacing: 28, rankSpacing: 44 },
      })
      if (cancelled || !ref.current) return
      /* Swap classDef fills for light mode — monochrome */
      let finalChart = chart
      if (!isDark) {
        finalChart = finalChart.replace(/classDef\s+\w+\s+fill:[^;\n]+/g, (match) => {
          const name = match.match(/classDef\s+(\w+)/)?.[1]
          const mono: Record<string, string> = {
            st: "classDef st fill:#080808,stroke:#080808,color:#fff",
            sc: "classDef sc fill:#f5f5f5,stroke:#d4d4d4,color:#080808",
            dc: "classDef dc fill:#fff,stroke:#080808,color:#080808",
            ok: "classDef ok fill:#080808,stroke:#080808,color:#fff",
            fl: "classDef fl fill:#fff,stroke:#080808,color:#080808,stroke-dasharray:5 3",
            dl: "classDef dl fill:#e5e5e5,stroke:#a3a3a3,color:#080808",
            lk: "classDef lk fill:#e5e5e5,stroke:#a3a3a3,color:#080808",
            ac: "classDef ac fill:#e5e5e5,stroke:#a3a3a3,color:#080808",
            hm: "classDef hm fill:#080808,stroke:#080808,color:#fff",
          }
          return name && mono[name] ? mono[name] : match
        })
      }
      const uid = `flow-${epicId}-${Date.now()}`
      const { svg } = await mermaid.render(uid, finalChart)
      if (cancelled || !ref.current) return
      ref.current.innerHTML = svg
      const svgEl = ref.current.querySelector("svg")
      if (svgEl) { svgEl.style.maxWidth = "100%"; svgEl.style.height = "auto" }
    }
    render()
    return () => { cancelled = true }
  }, [chart, epicId])

  return <div ref={ref} style={{ display: "flex", justifyContent: "center", overflow: "auto" }} />
}

/* ── Sidebar (shared between UI and Flow) ─────────────────────── */
function Sidebar({
  epics,
  expandedEpic,
  setExpandedEpic,
  activeEpicId,
  onSelectEpic,
  mode,
  /* UI mode props */
  screenIdx,
  stateIdx,
  onSelectScreen,
  onSelectState,
  getFlatIdx,
}: {
  epics: Epic[]
  expandedEpic: string
  setExpandedEpic: (id: string) => void
  activeEpicId?: string
  onSelectEpic?: (id: string) => void
  mode: "ui" | "flow"
  screenIdx?: number
  stateIdx?: number
  onSelectScreen?: (flatIdx: number) => void
  onSelectState?: (idx: number) => void
  getFlatIdx?: (epicIdx: number, localScreenIdx: number) => number
}) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}>
      {epics.map((epic, eIdx) => {
        const isExpanded = expandedEpic === epic.id
        const epicStateCount = epic.screens.reduce((a, s) => a + s.states.length, 0)

        return (
          <div key={epic.id}>
            <button
              onClick={() => {
                setExpandedEpic(isExpanded ? "" : epic.id)
                if (mode === "flow" && onSelectEpic) onSelectEpic(epic.id)
              }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                width: "100%", textAlign: "left", padding: "10px 16px",
                background: isExpanded ? "var(--secondary)" : "transparent",
                border: "none", borderLeft: `3px solid ${isExpanded ? "var(--foreground)" : "transparent"}`,
                color: isExpanded ? "var(--foreground)" : "var(--foreground-secondary)",
                fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT, letterSpacing: "0.3px",
              }}
            >
              <span style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s", fontSize: 10 }}>&#9654;</span>
              <span style={{ flex: 1 }}>{epic.title}</span>
              <span style={{ fontSize: 10, color: "var(--foreground-secondary)", fontWeight: 400 }}>
                {mode === "ui" ? epicStateCount : `${epic.screens.length} screens`}
              </span>
            </button>

            {isExpanded && (
              <div style={{ padding: "0 16px 6px 30px", fontSize: 10, color: "var(--foreground-secondary)" }}>{epic.desc}</div>
            )}

            {/* UI mode: show screens + state pills */}
            {mode === "ui" && isExpanded && getFlatIdx && onSelectScreen && onSelectState &&
              epic.screens.map((screen, sIdx) => {
                const flatIdx = getFlatIdx(eIdx, sIdx)
                const isActive = flatIdx === screenIdx
                return (
                  <div key={sIdx}>
                    <button
                      onClick={() => onSelectScreen(flatIdx)}
                      style={{
                        display: "block", width: "100%", textAlign: "left",
                        padding: "6px 16px 6px 30px",
                        background: isActive ? "var(--secondary)" : "transparent",
                        border: "none", color: isActive ? "var(--foreground)" : "var(--foreground-secondary)",
                        fontSize: 12, fontWeight: isActive ? 600 : 400, cursor: "pointer", fontFamily: FONT,
                      }}
                    >
                      {screen.screen}
                    </button>
                    {isActive && (
                      <div style={{ padding: "4px 16px 8px 40px", display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {screen.states.map((s, idx) => {
                          const isStateActive = idx === stateIdx
                          return (
                            <button
                              key={idx}
                              onClick={() => onSelectState(idx)}
                              style={{
                                padding: "3px 10px", borderRadius: 100, border: "none",
                                fontSize: 10, fontWeight: isStateActive ? 600 : 400,
                                background: isStateActive ? "var(--foreground)" : "var(--secondary)",
                                color: isStateActive ? "var(--background)" : "var(--foreground-secondary)",
                                cursor: "pointer", fontFamily: FONT,
                              }}
                            >
                              {s.label}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })
            }

            {/* Flow mode: show screen list (no states) */}
            {mode === "flow" && isExpanded &&
              epic.screens.map((screen, sIdx) => (
                <div
                  key={sIdx}
                  style={{
                    padding: "4px 16px 4px 30px", fontSize: 11, color: "var(--foreground-secondary)", fontFamily: FONT,
                  }}
                >
                  {screen.screen}
                </div>
              ))
            }
          </div>
        )
      })}
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function SubMerchantStatesPage() {
  const [tab, setTab] = useState<"ui" | "flow">("ui")
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => obs.disconnect()
  }, [])

  /* UI mode state */
  const [screenIdx, setScreenIdx] = useState(0)
  const [stateIdx, setStateIdx] = useState(0)
  const [expandedEpicUI, setExpandedEpicUI] = useState("e1")

  /* Flow mode state */
  const [flowEpicId, setFlowEpicId] = useState("e1")
  const [expandedEpicFlow, setExpandedEpicFlow] = useState("e1")

  const currentScreen = ALL_SCREENS[screenIdx]
  const currentState = currentScreen.states[stateIdx]
  const iframeSrc = `${BASE_URL}${currentScreen.route}${currentState.param}`
  const currentEpicIdx = findEpicIdx(screenIdx)
  const currentEpic = EPICS[currentEpicIdx]
  const flowEpic = EPICS.find((e) => e.id === flowEpicId) || EPICS[0]

  function selectScreen(flatIdx: number) {
    setScreenIdx(flatIdx)
    setStateIdx(0)
    setExpandedEpicUI(EPICS[findEpicIdx(flatIdx)].id)
  }

  function getFlatIdx(epicIdx: number, localScreenIdx: number): number {
    let flat = 0
    for (let i = 0; i < epicIdx; i++) flat += EPICS[i].screens.length
    return flat + localScreenIdx
  }

  const globalStatePos =
    ALL_SCREENS.slice(0, screenIdx).reduce((acc, s) => acc + s.states.length, 0) + stateIdx + 1

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--background)", color: "var(--foreground)", fontFamily: FONT }}>
      {/* ── Sidebar ── */}
      <div style={{ width: 300, minWidth: 300, borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "20px 16px 0", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)", letterSpacing: "0.5px" }}>
            SUB-MERCHANTS
          </div>
          <div style={{ fontSize: 11, color: "var(--foreground-secondary)", marginTop: 4 }}>
            {EPICS.length} epics &middot; {ALL_SCREENS.length} screens &middot; {TOTAL_STATES} states
          </div>
          {/* Tab bar */}
          <div style={{ display: "flex", gap: 0, marginTop: 12 }}>
            <button style={tabStyle(tab === "ui")} onClick={() => setTab("ui")}>UI</button>
            <button style={tabStyle(tab === "flow")} onClick={() => setTab("flow")}>Flow</button>
          </div>
        </div>

        {/* Sidebar content */}
        {tab === "ui" ? (
          <Sidebar
            epics={EPICS}
            expandedEpic={expandedEpicUI}
            setExpandedEpic={setExpandedEpicUI}
            mode="ui"
            screenIdx={screenIdx}
            stateIdx={stateIdx}
            onSelectScreen={selectScreen}
            onSelectState={setStateIdx}
            getFlatIdx={getFlatIdx}
          />
        ) : (
          <Sidebar
            epics={EPICS}
            expandedEpic={expandedEpicFlow}
            setExpandedEpic={(id) => { setExpandedEpicFlow(id); if (id) setFlowEpicId(id) }}
            activeEpicId={flowEpicId}
            onSelectEpic={setFlowEpicId}
            mode="flow"
          />
        )}
      </div>

      {/* ── Main area ── */}
      {tab === "ui" ? (
        /* ── Device Preview ── */
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "20px 32px", overflow: "auto" }}>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>{currentScreen.screen}</div>
            <div style={{ fontSize: 11, color: "var(--foreground-secondary)", marginTop: 2 }}>{currentState.label} &mdash; {currentScreen.route}{currentState.param}</div>
          </div>

          {(() => {
            /* Desktop-sized iframe for sub-merchants (admin panel, not mobile app) */
            const W = 1280, H = 800, SCALE = 0.75, PAD = 8
            const frameW = Math.round(W * SCALE) + PAD * 2
            const frameH = Math.round(H * SCALE) + PAD * 2
            return (
              <div style={{ width: frameW, height: frameH, borderRadius: 12, background: "#1a1a1a", border: "1px solid #333", padding: PAD, boxShadow: "0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.1)", position: "relative", flexShrink: 0 }}>
                {/* Browser-style top bar */}
                <div style={{ height: 28, background: "#2a2a2a", borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", gap: 6, padding: "0 12px" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
                  <div style={{ flex: 1, marginLeft: 8, height: 16, borderRadius: 4, background: "#1a1a1a", display: "flex", alignItems: "center", padding: "0 8px" }}>
                    <span style={{ fontSize: 9, color: "#888", fontFamily: FONT }}>{iframeSrc}</span>
                  </div>
                </div>
                <div style={{ width: Math.round(W * SCALE), height: Math.round(H * SCALE) - 28, overflow: "hidden", background: "#fff" }}>
                  <iframe key={iframeSrc} src={iframeSrc} style={{ width: W, height: H, border: "none", transform: `scale(${SCALE})`, transformOrigin: "0 0" }} title={`${currentScreen.screen} — ${currentState.label}`} />
                </div>
              </div>
            )
          })()}

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            <button
              onClick={() => { if (stateIdx > 0) { setStateIdx(stateIdx - 1) } else if (screenIdx > 0) { const prev = ALL_SCREENS[screenIdx - 1]; selectScreen(screenIdx - 1); setStateIdx(prev.states.length - 1) } }}
              disabled={screenIdx === 0 && stateIdx === 0}
              style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid var(--border-bold)", background: "var(--secondary)", color: screenIdx === 0 && stateIdx === 0 ? "var(--muted-foreground)" : "var(--foreground)", fontSize: 12, cursor: screenIdx === 0 && stateIdx === 0 ? "not-allowed" : "pointer", fontFamily: FONT }}
            >
              ← Prev
            </button>
            <span style={{ fontSize: 11, color: "var(--foreground-secondary)", minWidth: 60, textAlign: "center" }}>{globalStatePos} / {TOTAL_STATES}</span>
            <button
              onClick={() => { if (stateIdx < currentScreen.states.length - 1) { setStateIdx(stateIdx + 1) } else if (screenIdx < ALL_SCREENS.length - 1) { selectScreen(screenIdx + 1) } }}
              disabled={screenIdx === ALL_SCREENS.length - 1 && stateIdx === currentScreen.states.length - 1}
              style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid var(--border-bold)", background: "var(--secondary)", color: screenIdx === ALL_SCREENS.length - 1 && stateIdx === currentScreen.states.length - 1 ? "var(--muted-foreground)" : "var(--foreground)", fontSize: 12, cursor: screenIdx === ALL_SCREENS.length - 1 && stateIdx === currentScreen.states.length - 1 ? "not-allowed" : "pointer", fontFamily: FONT }}
            >
              Next →
            </button>
          </div>
        </div>
      ) : (
        /* ── Flow view (no device frame) ── */
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Flow header */}
          <div style={{ padding: "20px 32px 16px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>{flowEpic.title}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--foreground-secondary)" }}>{flowEpic.desc}</div>
            {/* Legend */}
            <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
              {[
                { style: "solid", label: "Screen" },
                { style: "dashed", label: "Decision" },
                { style: "double", label: "Thanh cong" },
                { style: "dotted", label: "That bai" },
                { style: "link", label: "Link epic" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                  <div style={{ width: 12, height: 12, borderRadius: item.style === "dashed" ? "50%" : 3, background: "var(--background)", border: `1.5px ${item.style === "double" ? "solid" : item.style === "link" ? "dashed" : item.style} var(--foreground-secondary)`, ...(item.style === "double" ? { outline: "1.5px solid var(--foreground-secondary)", outlineOffset: 1 } : {}), ...(item.style === "link" ? { background: "var(--secondary)" } : {}) }} />
                  <span style={{ color: "var(--foreground-secondary)" }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mermaid chart */}
          <div style={{ flex: 1, overflow: "auto", padding: "32px", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
            <FlowRenderer key={flowEpicId} chart={FLOW_CHARTS[flowEpicId]} epicId={flowEpicId} />
          </div>
        </div>
      )}
    </div>
  )
}
