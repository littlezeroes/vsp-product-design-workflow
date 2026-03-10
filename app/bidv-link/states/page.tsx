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

const EPICS: Epic[] = [
  {
    id: "e1",
    title: "Epic 1 — Lien ket BIDV",
    desc: "S1 → S2 → S3 → S4",
    color: "#6366f1",
    screens: [
      {
        screen: "S1: Danh sach ngan hang",
        route: "/bidv-link/bank-list",
        states: [
          { label: "loaded", param: "" },
          { label: "empty", param: "?state=empty" },
          { label: "loading", param: "?state=loading" },
          { label: "error", param: "?state=error" },
        ],
      },
      {
        screen: "S2: Form Lien ket BIDV",
        route: "/bidv-link/bidv-form",
        states: [
          { label: "empty", param: "" },
          { label: "typing", param: "?state=typing" },
          { label: "valid", param: "?state=valid" },
          { label: "tnc-sheet", param: "?state=tnc-sheet" },
          { label: "loading", param: "?state=loading" },
          { label: "error-stk", param: "?state=error-stk" },
          { label: "error-mismatch", param: "?state=error-mismatch" },
          { label: "error-no-smartbanking", param: "?state=error-no-smartbanking" },
          { label: "error-maintenance", param: "?state=error-maintenance" },
          { label: "error-rate-limit", param: "?state=error-rate-limit" },
          { label: "error-network", param: "?state=error-network" },
          { label: "redirect-store", param: "?state=redirect-store" },
          { label: "resume-from-store", param: "?state=resume-from-store" },
          { label: "deeplink-fail", param: "?state=deeplink-fail" },
        ],
      },
      {
        screen: "S3: Cho xac thuc (Lien ket)",
        route: "/bidv-link/bidv-waiting",
        states: [
          { label: "waiting", param: "" },
          { label: "callback-success", param: "?state=callback-success" },
          { label: "callback-failed", param: "?state=callback-failed" },
          { label: "callback-pending", param: "?state=callback-pending" },
          { label: "callback-cancel", param: "?state=callback-cancel" },
          { label: "timeout", param: "?state=timeout" },
          { label: "cancel-confirm", param: "?state=cancel-confirm" },
          { label: "cancelled", param: "?state=cancelled" },
          { label: "network-lost", param: "?state=network-lost" },
          { label: "app-resume", param: "?state=app-resume" },
        ],
      },
      {
        screen: "S4: Ket qua Lien ket",
        route: "/bidv-link/bidv-result",
        states: [
          { label: "success", param: "?state=success" },
          { label: "failed", param: "?state=failed" },
          { label: "failed-cancel", param: "?state=failed-cancel" },
          { label: "failed-timeout", param: "?state=failed-timeout" },
          { label: "pending", param: "?state=pending" },
        ],
      },
    ],
  },
  {
    id: "e2",
    title: "Epic 2 — Nap tien",
    desc: "S5 → Auth → S7 → S8",
    color: "#22c55e",
    screens: [
      {
        screen: "S5: Nap tien",
        route: "/bidv-link/deposit",
        states: [
          { label: "empty", param: "" },
          { label: "typing", param: "?state=typing" },
          { label: "valid", param: "?state=valid" },
          { label: "error-min", param: "?state=error-min" },
          { label: "error-max", param: "?state=error-max" },
          { label: "error-daily", param: "?state=error-daily" },
          { label: "error-monthly", param: "?state=error-monthly" },
          { label: "quick-select", param: "?state=quick-select" },
          { label: "loading", param: "?state=loading" },
        ],
      },
      {
        screen: "Auth: Xac nhan Nap tien",
        route: "/bidv-link/deposit-auth",
        states: [
          { label: "default", param: "" },
          { label: "biometric-prompt", param: "?state=biometric-prompt" },
          { label: "biometric-success", param: "?state=biometric-success" },
          { label: "biometric-fail", param: "?state=biometric-fail" },
          { label: "pin-typing", param: "?state=pin-typing" },
          { label: "pin-success", param: "?state=pin-success" },
          { label: "pin-error-1", param: "?state=pin-error-1" },
          { label: "pin-error-2", param: "?state=pin-error-2" },
          { label: "pin-locked", param: "?state=pin-locked" },
          { label: "redirect-store", param: "?state=redirect-store" },
          { label: "resume-store", param: "?state=resume-store" },
          { label: "session-timeout", param: "?state=session-timeout" },
          { label: "fee-changed", param: "?state=fee-changed" },
        ],
      },
      {
        screen: "S7: Cho xac thuc (Nap tien)",
        route: "/bidv-link/deposit-waiting",
        states: [
          { label: "waiting", param: "" },
          { label: "callback-success", param: "?state=callback-success" },
          { label: "callback-failed", param: "?state=callback-failed" },
          { label: "callback-pending", param: "?state=callback-pending" },
          { label: "timeout", param: "?state=timeout" },
          { label: "cancel-confirm", param: "?state=cancel-confirm" },
          { label: "cancelled", param: "?state=cancelled" },
          { label: "network-lost", param: "?state=network-lost" },
          { label: "app-resume", param: "?state=app-resume" },
        ],
      },
      {
        screen: "S8: Ket qua Nap tien",
        route: "/bidv-link/deposit-result",
        states: [
          { label: "success", param: "?state=success" },
          { label: "failed", param: "?state=failed" },
          { label: "failed-insufficient", param: "?state=failed-insufficient" },
          { label: "failed-timeout", param: "?state=failed-timeout" },
          { label: "pending", param: "?state=pending" },
        ],
      },
    ],
  },
  {
    id: "e3",
    title: "Epic 3 — Rut tien",
    desc: "S9 → Auth → S11",
    color: "#f59e0b",
    screens: [
      {
        screen: "S9: Rut tien",
        route: "/bidv-link/withdraw",
        states: [
          { label: "empty", param: "" },
          { label: "typing", param: "?state=typing" },
          { label: "valid", param: "?state=valid" },
          { label: "error-min", param: "?state=error-min" },
          { label: "error-max", param: "?state=error-max" },
          { label: "error-balance", param: "?state=error-balance" },
          { label: "error-daily", param: "?state=error-daily" },
          { label: "error-monthly", param: "?state=error-monthly" },
          { label: "quick-select", param: "?state=quick-select" },
          { label: "loading", param: "?state=loading" },
        ],
      },
      {
        screen: "Auth: Xac nhan Rut tien",
        route: "/bidv-link/withdraw-auth",
        states: [
          { label: "default", param: "" },
          { label: "biometric-prompt", param: "?state=biometric-prompt" },
          { label: "biometric-success", param: "?state=biometric-success" },
          { label: "biometric-fail", param: "?state=biometric-fail" },
          { label: "pin-typing", param: "?state=pin-typing" },
          { label: "pin-success", param: "?state=pin-success" },
          { label: "pin-error-1", param: "?state=pin-error-1" },
          { label: "pin-error-2", param: "?state=pin-error-2" },
          { label: "pin-locked", param: "?state=pin-locked" },
          { label: "session-timeout", param: "?state=session-timeout" },
          { label: "fee-changed", param: "?state=fee-changed" },
        ],
      },
      {
        screen: "S11: Ket qua Rut tien",
        route: "/bidv-link/withdraw-result",
        states: [
          { label: "success", param: "?state=success" },
          { label: "failed", param: "?state=failed" },
          { label: "failed-account", param: "?state=failed-account" },
          { label: "failed-refund", param: "?state=failed-refund" },
          { label: "pending", param: "?state=pending" },
        ],
      },
    ],
  },
  {
    id: "e4",
    title: "Epic 4 — Huy lien ket",
    desc: "S12 → S13 → S14",
    color: "#ef4444",
    screens: [
      {
        screen: "S12: Chi tiet ngan hang BIDV",
        route: "/bidv-link/bank-detail",
        states: [
          { label: "loaded", param: "" },
          { label: "unlink-check", param: "?state=unlink-check" },
          { label: "pending-block", param: "?state=pending-block" },
          { label: "confirm-normal", param: "?state=confirm-normal" },
          { label: "confirm-last", param: "?state=confirm-last" },
          { label: "redirect-store", param: "?state=redirect-store" },
          { label: "loading", param: "?state=loading" },
          { label: "error", param: "?state=error" },
        ],
      },
      {
        screen: "S13: Cho xac thuc (Huy lien ket)",
        route: "/bidv-link/unlink-waiting",
        states: [
          { label: "waiting", param: "" },
          { label: "callback-success", param: "?state=callback-success" },
          { label: "callback-failed", param: "?state=callback-failed" },
          { label: "callback-pending", param: "?state=callback-pending" },
          { label: "callback-cancel", param: "?state=callback-cancel" },
          { label: "timeout", param: "?state=timeout" },
          { label: "cancel-confirm", param: "?state=cancel-confirm" },
          { label: "cancelled", param: "?state=cancelled" },
          { label: "network-lost", param: "?state=network-lost" },
          { label: "app-resume", param: "?state=app-resume" },
        ],
      },
      {
        screen: "S14: Ket qua Huy lien ket",
        route: "/bidv-link/unlink-result",
        states: [
          { label: "success", param: "?state=success" },
          { label: "failed", param: "?state=failed" },
          { label: "failed-cancel", param: "?state=failed-cancel" },
          { label: "failed-timeout", param: "?state=failed-timeout" },
          { label: "pending", param: "?state=pending" },
        ],
      },
    ],
  },
  {
    id: "e5",
    title: "Epic 5 — Quan ly",
    desc: "S15 · S16 · S17",
    color: "#8b5cf6",
    screens: [
      {
        screen: "S15: Quan ly thanh toan",
        route: "/bidv-link/bank-management",
        states: [
          { label: "loaded", param: "" },
          { label: "empty", param: "?state=empty" },
          { label: "loading", param: "?state=loading" },
          { label: "error", param: "?state=error" },
        ],
      },
      {
        screen: "S16: Lich su giao dich",
        route: "/bidv-link/transactions",
        states: [
          { label: "loaded", param: "" },
          { label: "empty", param: "?state=empty" },
          { label: "filtered", param: "?state=filtered" },
          { label: "filtered-empty", param: "?state=filtered-empty" },
          { label: "load-more", param: "?state=load-more" },
          { label: "loading", param: "?state=loading" },
          { label: "error", param: "?state=error" },
        ],
      },
      {
        screen: "S17: Chi tiet giao dich",
        route: "/bidv-link/transaction-detail",
        states: [
          { label: "loaded", param: "" },
          { label: "loading", param: "?state=loading" },
          { label: "status-updated", param: "?state=status-updated&txStatus=pending" },
          { label: "error", param: "?state=error" },
        ],
      },
    ],
  },
]

/* ── Flow charts per epic (simplified happy paths) ────────────── */
const FLOW_CHARTS: Record<string, string> = {
  e1: `flowchart LR
  S1[S1: Chon ngan hang] --> S2[S2: Nhap STK\\n+ Dieu khoan]
  S2 --> STORE[Mo BIDV app]
  STORE --> S3[S3: Cho xac thuc]
  S3 --> S4[S4: Ket qua]
  classDef sc fill:#1a1a2e,stroke:#6366f1,color:#e5e5e5
  classDef ok fill:#052e16,stroke:#22c55e,color:#86efac
  classDef lk fill:#162032,stroke:#3b82f6,color:#93c5fd
  class S1,S2,S3 sc
  class STORE lk
  class S4 ok`,

  e2: `flowchart LR
  S5[S5: Nhap so tien] --> AUTH[Auth: PIN/Bio]
  AUTH --> STORE[Mo BIDV app]
  STORE --> S7[S7: Cho xac thuc]
  S7 --> S8[S8: Ket qua]
  classDef sc fill:#1a1a2e,stroke:#22c55e,color:#e5e5e5
  classDef ok fill:#052e16,stroke:#22c55e,color:#86efac
  classDef lk fill:#162032,stroke:#3b82f6,color:#93c5fd
  class S5,AUTH,S7 sc
  class STORE lk
  class S8 ok`,

  e3: `flowchart LR
  S9[S9: Nhap so tien] --> AUTH[Auth: PIN/Bio]
  AUTH --> S11[S11: Ket qua]
  classDef sc fill:#1a1a2e,stroke:#f59e0b,color:#e5e5e5
  classDef ok fill:#052e16,stroke:#22c55e,color:#86efac
  class S9,AUTH sc
  class S11 ok`,

  e4: `flowchart LR
  S12[S12: Chi tiet NH] --> CHK{Kiem tra\\npending?}
  CHK -->|No| CONFIRM[Xac nhan huy]
  CHK -->|Yes| BLOCK[Chan huy]
  CONFIRM --> STORE[Mo BIDV app]
  STORE --> S13[S13: Cho xac thuc]
  S13 --> S14[S14: Ket qua]
  classDef sc fill:#1a1a2e,stroke:#ef4444,color:#e5e5e5
  classDef ok fill:#052e16,stroke:#22c55e,color:#86efac
  classDef fl fill:#450a0a,stroke:#ef4444,color:#fca5a5
  classDef lk fill:#162032,stroke:#3b82f6,color:#93c5fd
  classDef dc fill:#0f172a,stroke:#ef4444,color:#fecaca
  class S12,CONFIRM,S13 sc
  class CHK dc
  class STORE lk
  class S14 ok
  class BLOCK fl`,

  e5: `flowchart LR
  S15[S15: DS ngan hang] --> S12[S12: Chi tiet NH]
  S15 --> S16[S16: Lich su GD]
  S16 --> S17[S17: Chi tiet GD]
  S12 --> NAP[Nap tien]
  S12 --> RUT[Rut tien]
  S12 --> HUY[Huy lien ket]
  classDef sc fill:#1a1a2e,stroke:#8b5cf6,color:#e5e5e5
  classDef lk fill:#162032,stroke:#3b82f6,color:#93c5fd
  class S15,S16,S17,S12 sc
  class NAP,RUT,HUY lk`,
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
  borderBottom: active ? "2px solid #fff" : "2px solid transparent",
  background: "transparent",
  color: active ? "#fff" : "#525252",
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
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        themeVariables: {
          darkMode: true,
          primaryColor: "#6366f1",
          primaryTextColor: "#e5e5e5",
          primaryBorderColor: "#4f46e5",
          lineColor: "#525252",
          secondaryColor: "#1e1b4b",
          tertiaryColor: "#0f172a",
          fontSize: "13px",
          fontFamily: FONT,
        },
        flowchart: { htmlLabels: true, curve: "basis", padding: 14, nodeSpacing: 28, rankSpacing: 44 },
      })
      if (cancelled || !ref.current) return
      const uid = `flow-${epicId}-${Date.now()}`
      const { svg } = await mermaid.render(uid, chart)
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
  onSelectEpic,
  mode,
  screenIdx,
  stateIdx,
  onSelectScreen,
  onSelectState,
  getFlatIdx,
}: {
  epics: Epic[]
  expandedEpic: string
  setExpandedEpic: (id: string) => void
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
                background: isExpanded ? `${epic.color}10` : "transparent",
                border: "none", borderLeft: `3px solid ${isExpanded ? epic.color : "transparent"}`,
                color: isExpanded ? "#fff" : "#a3a3a3",
                fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT, letterSpacing: "0.3px",
              }}
            >
              <span style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s", fontSize: 10 }}>&#9654;</span>
              <span style={{ flex: 1 }}>{epic.title}</span>
              <span style={{ fontSize: 10, color: "#525252", fontWeight: 400 }}>
                {mode === "ui" ? epicStateCount : `${epic.screens.length} screens`}
              </span>
            </button>

            {isExpanded && (
              <div style={{ padding: "0 16px 6px 30px", fontSize: 10, color: "#525252" }}>{epic.desc}</div>
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
                        background: isActive ? `${epic.color}20` : "transparent",
                        border: "none", color: isActive ? "#fff" : "#a3a3a3",
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
                                background: isStateActive ? epic.color : "#262626",
                                color: isStateActive ? "#fff" : "#a3a3a3",
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
                    padding: "4px 16px 4px 30px", fontSize: 11, color: "#737373", fontFamily: FONT,
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
export default function AllStatesPage() {
  const [tab, setTab] = useState<"ui" | "flow">("ui")

  /* UI mode state */
  const [screenIdx, setScreenIdx] = useState(0)
  const [stateIdx, setStateIdx] = useState(0)
  const [expandedEpicUI, setExpandedEpicUI] = useState("e1")

  /* Flow mode state */
  const [flowEpicId, setFlowEpicId] = useState("e1")
  const [expandedEpicFlow, setExpandedEpicFlow] = useState("e1")

  const currentScreen = ALL_SCREENS[screenIdx]
  const currentState = currentScreen.states[stateIdx]
  const iframeSrc = `${currentScreen.route}${currentState.param}`
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
    <div style={{ display: "flex", height: "100vh", background: "#0a0a0a", color: "#e5e5e5", fontFamily: FONT }}>
      {/* ── Sidebar ── */}
      <div style={{ width: 300, minWidth: 300, borderRight: "1px solid #262626", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "20px 16px 0", borderBottom: "1px solid #262626" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.5px" }}>
            BIDV LINK
          </div>
          <div style={{ fontSize: 11, color: "#737373", marginTop: 4 }}>
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
            onSelectEpic={setFlowEpicId}
            mode="flow"
          />
        )}
      </div>

      {/* ── Main area ── */}
      {tab === "ui" ? (
        /* ── Device Preview ── */
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "16px 32px", overflow: "hidden" }}>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 100, background: `${currentEpic.color}20`, color: currentEpic.color, letterSpacing: "0.3px" }}>
                {currentEpic.title.split(" — ")[0]}
              </span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{currentScreen.screen}</div>
            <div style={{ fontSize: 11, color: "#525252", marginTop: 2 }}>{currentState.label} &mdash; {iframeSrc}</div>
          </div>

          {(() => {
            const SCALE = 0.78, W = 390, H = 844, PAD = 8
            const frameW = Math.round(W * SCALE) + PAD * 2
            const frameH = Math.round(H * SCALE) + PAD * 2
            return (
              <div style={{ width: frameW, height: frameH, borderRadius: Math.round(52 * SCALE), background: "#1a1a1a", border: "1px solid #333", padding: PAD, boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)", position: "relative", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: Math.round(12 * SCALE) + PAD, left: "50%", transform: "translateX(-50%)", width: Math.round(120 * SCALE), height: Math.round(36 * SCALE), borderRadius: 16, background: "#000", zIndex: 10 }} />
                <div style={{ width: Math.round(W * SCALE), height: Math.round(H * SCALE), borderRadius: Math.round(44 * SCALE), overflow: "hidden", background: "#000" }}>
                  <iframe key={iframeSrc} src={iframeSrc} style={{ width: W, height: H, border: "none", transform: `scale(${SCALE})`, transformOrigin: "0 0" }} title={`${currentScreen.screen} — ${currentState.label}`} />
                </div>
              </div>
            )
          })()}

          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            <button
              onClick={() => { if (stateIdx > 0) { setStateIdx(stateIdx - 1) } else if (screenIdx > 0) { const prev = ALL_SCREENS[screenIdx - 1]; selectScreen(screenIdx - 1); setStateIdx(prev.states.length - 1) } }}
              disabled={screenIdx === 0 && stateIdx === 0}
              style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid #333", background: "#1a1a1a", color: screenIdx === 0 && stateIdx === 0 ? "#404040" : "#e5e5e5", fontSize: 12, cursor: screenIdx === 0 && stateIdx === 0 ? "not-allowed" : "pointer", fontFamily: FONT }}
            >
              Prev
            </button>
            <span style={{ fontSize: 11, color: "#525252", minWidth: 60, textAlign: "center" }}>{globalStatePos} / {TOTAL_STATES}</span>
            <button
              onClick={() => { if (stateIdx < currentScreen.states.length - 1) { setStateIdx(stateIdx + 1) } else if (screenIdx < ALL_SCREENS.length - 1) { selectScreen(screenIdx + 1) } }}
              disabled={screenIdx === ALL_SCREENS.length - 1 && stateIdx === currentScreen.states.length - 1}
              style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid #333", background: "#1a1a1a", color: screenIdx === ALL_SCREENS.length - 1 && stateIdx === currentScreen.states.length - 1 ? "#404040" : "#e5e5e5", fontSize: 12, cursor: screenIdx === ALL_SCREENS.length - 1 && stateIdx === currentScreen.states.length - 1 ? "not-allowed" : "pointer", fontFamily: FONT }}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        /* ── Flow view (Mermaid chart) ── */
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Flow header */}
          <div style={{ padding: "20px 32px 16px", borderBottom: "1px solid #1a1a1a", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: flowEpic.color }} />
              <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{flowEpic.title}</span>
            </div>
            <div style={{ fontSize: 12, color: "#737373" }}>{flowEpic.desc}</div>
            {/* Legend */}
            <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
              {[
                { bg: "#1a1a2e", border: "#374151", label: "Screen" },
                { bg: "#0f172a", border: "#6366f1", label: "Decision" },
                { bg: "#052e16", border: "#22c55e", label: "Thanh cong" },
                { bg: "#450a0a", border: "#ef4444", label: "That bai" },
                { bg: "#162032", border: "#3b82f6", label: "External app" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: item.bg, border: `1.5px solid ${item.border}` }} />
                  <span style={{ color: "#737373" }}>{item.label}</span>
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
