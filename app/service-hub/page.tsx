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
    title: "Epic 1 — Trang chu (updated)",
    desc: "Vi + Actions + Reminder + Kham pha + GD",
    color: "#6366f1",
    screens: [
      {
        screen: "S1: Home — Q2 (chua kich hoat SP)",
        route: "/service-hub/home",
        states: [
          { label: "default (no reminder)", param: "" },
          { label: "with reminder", param: "?state=with-reminder" },
        ],
      },
      {
        screen: "S1b: Home — Q3 (da kich hoat Sinh loi)",
        route: "/service-hub/home",
        states: [
          { label: "Q3 + products", param: "?state=q3" },
        ],
      },
      {
        screen: "S1c: Home — Q4 (full: SL + BDS + CCQ)",
        route: "/service-hub/home",
        states: [
          { label: "Q4 full portfolio", param: "?state=q4" },
        ],
      },
    ],
  },
  {
    id: "e2",
    title: "Epic 2 — Tab Dich vu (NEW)",
    desc: "Service Hub thay Chuyen tien — scale 60+ features",
    color: "#22c55e",
    screens: [
      {
        screen: "S2: Dich vu — Q2 Launch (it services)",
        route: "/service-hub/services",
        states: [
          { label: "Q2 launch", param: "?state=q2-launch" },
        ],
      },
      {
        screen: "S2b: Dich vu — Q3 Growing",
        route: "/service-hub/services",
        states: [
          { label: "Q3 growing", param: "?state=q3-growing" },
        ],
      },
      {
        screen: "S2c: Dich vu — Q4 Full",
        route: "/service-hub/services",
        states: [
          { label: "Q4 full", param: "?state=q4-full" },
        ],
      },
      {
        screen: "S2d: Dich vu — Search",
        route: "/service-hub/services",
        states: [
          { label: "search", param: "?state=search" },
        ],
      },
    ],
  },
  {
    id: "e3",
    title: "Epic 3 — Bottom Nav Compare",
    desc: "So sanh nav cu vs moi",
    color: "#f59e0b",
    screens: [
      {
        screen: "S3: Nav Compare",
        route: "/service-hub/nav-compare",
        states: [
          { label: "compare", param: "" },
        ],
      },
    ],
  },
]

/* ── Flow charts per epic ─────────────────────────────────────── */
const FLOW_CHARTS: Record<string, string> = {
  e1: `flowchart TD
  HOME((Trang chu)) --> WALLET[1. Vi & Actions\\nSo du + Sinh loi + 4 nut]
  WALLET --> REM{Co hoa don\\nsap han?}
  REM -->|Co| REMINDER[2. Reminder\\nTen + So tien + Han + Tra]
  REM -->|Khong| SKIP[An]
  REMINDER --> KHAMPHA[3. Kham pha dich vu\\nGrid 2x2 - doi theo phase]
  SKIP --> KHAMPHA
  KHAMPHA -->|Tat ca| SERVICES((Tab Dich vu))
  KHAMPHA --> GD[4. GD gan day\\n3 muc]
  WALLET -->|Tap Sinh loi| SL[Chi tiet Sinh loi]
  WALLET -->|Tap BDS/CCQ| TC[Chi tiet Tai chinh]
  classDef st fill:#6366f1,stroke:#4f46e5,color:#fff
  classDef sc fill:#1a1a2e,stroke:#374151,color:#e5e5e5
  classDef dc fill:#0f172a,stroke:#6366f1,color:#c7d2fe
  classDef ok fill:#052e16,stroke:#22c55e,color:#86efac
  classDef lk fill:#162032,stroke:#3b82f6,color:#93c5fd
  classDef ac fill:#e5e5e5,stroke:#a3a3a3,color:#080808
  class HOME st
  class WALLET,REMINDER,KHAMPHA,GD sc
  class REM dc
  class SERVICES ok
  class SKIP ac
  class SL,TC lk`,

  e2: `flowchart TD
  TAB((Tab Dich vu)) --> SEARCH[Search bar\\nTim dich vu]
  TAB --> FAV[Yeu thich\\nUser tu pin 4 icon]
  TAB --> TT[Thanh toan\\nDien Nuoc Net Data Hoc phi Vay]
  TAB --> VE[Ve & Di chuyen\\nPhim Tau Buyt]
  TAB --> VIN[Vingroup\\nXanhSM VinPearl Vinmec\\nVinFast Vincom VinSchool]
  TAB --> TC[Tai chinh\\nSinh loi CCQ BDS BH BNPL Vay]
  TAB --> UD[Uu dai\\nV-Point Voucher GTTB]
  TAB --> CT[Chuyen tien\\nVi Ngan hang Vi nhom Chia bill]
  TT -->|Chon dv| FLOW_TT[Flow thanh toan\\nNhap ma KH - Fetch bill - Confirm - Auth - Result]
  TC -->|Chon sp| FLOW_TC[Flow tai chinh\\nKham pha - Dang ky - Dashboard]
  SEARCH -->|Tim| RESULTS[Ket qua tim kiem\\nFilter theo ten dich vu]
  classDef st fill:#22c55e,stroke:#16a34a,color:#fff
  classDef sc fill:#1a1a2e,stroke:#374151,color:#e5e5e5
  classDef dc fill:#0f172a,stroke:#22c55e,color:#bbf7d0
  classDef lk fill:#162032,stroke:#3b82f6,color:#93c5fd
  class TAB st
  class SEARCH,FAV,TT,VE,VIN,TC,UD,CT sc
  class FLOW_TT,FLOW_TC,RESULTS lk`,

  e3: `flowchart LR
  OLD[v1.0.8\\nTrang chu - Chuyen tien - QR - Giao dich - Tai khoan] --> CHANGE{Doi 1 tab}
  CHANGE --> NEW[v2.0\\nTrang chu - DICH VU - QR - Giao dich - Tai khoan]
  CHANGE --> MOVE[Chuyen tien\\nlên Quick Action Home]
  NEW --> SCALE[Feature moi\\n= them icon vao grid]
  classDef st fill:#f59e0b,stroke:#d97706,color:#fff
  classDef sc fill:#1a1a2e,stroke:#374151,color:#e5e5e5
  classDef dc fill:#0f172a,stroke:#f59e0b,color:#fde68a
  classDef ok fill:#052e16,stroke:#22c55e,color:#86efac
  class OLD st
  class CHANGE dc
  class NEW,MOVE sc
  class SCALE ok`,
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

/* ── Sidebar ─────────────────────────────────────────────────── */
function Sidebar({
  epics, expandedEpic, setExpandedEpic, activeEpicId, onSelectEpic, mode,
  screenIdx, stateIdx, onSelectScreen, onSelectState, getFlatIdx,
}: {
  epics: Epic[]; expandedEpic: string; setExpandedEpic: (id: string) => void
  activeEpicId?: string; onSelectEpic?: (id: string) => void; mode: "ui" | "flow"
  screenIdx?: number; stateIdx?: number
  onSelectScreen?: (flatIdx: number) => void; onSelectState?: (idx: number) => void
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
                        {screen.states.map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => onSelectState(idx)}
                            style={{
                              padding: "3px 10px", borderRadius: 100, border: "none",
                              fontSize: 10, fontWeight: idx === stateIdx ? 600 : 400,
                              background: idx === stateIdx ? "var(--foreground)" : "var(--secondary)",
                              color: idx === stateIdx ? "var(--background)" : "var(--foreground-secondary)",
                              cursor: "pointer", fontFamily: FONT,
                            }}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            }
            {mode === "flow" && isExpanded &&
              epic.screens.map((screen, sIdx) => (
                <div key={sIdx} style={{ padding: "4px 16px 4px 30px", fontSize: 11, color: "var(--foreground-secondary)", fontFamily: FONT }}>
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
export default function ServiceHubStates() {
  const [tab, setTab] = useState<"ui" | "flow">("ui")
  const [screenIdx, setScreenIdx] = useState(0)
  const [stateIdx, setStateIdx] = useState(0)
  const [expandedEpicUI, setExpandedEpicUI] = useState("e1")
  const [flowEpicId, setFlowEpicId] = useState("e1")
  const [expandedEpicFlow, setExpandedEpicFlow] = useState("e1")

  const currentScreen = ALL_SCREENS[screenIdx]
  const currentState = currentScreen.states[stateIdx]
  const iframeSrc = `${currentScreen.route}${currentState.param}`
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
      {/* Sidebar */}
      <div style={{ width: 300, minWidth: 300, borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "20px 16px 0", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.5px" }}>
            VSP 2026 — SERVICE HUB
          </div>
          <div style={{ fontSize: 11, color: "var(--foreground-secondary)", marginTop: 4 }}>
            3 epics &middot; {ALL_SCREENS.length} screens &middot; {TOTAL_STATES} states
          </div>
          <div style={{ display: "flex", gap: 0, marginTop: 12 }}>
            <button style={tabStyle(tab === "ui")} onClick={() => setTab("ui")}>UI</button>
            <button style={tabStyle(tab === "flow")} onClick={() => setTab("flow")}>Flow</button>
          </div>
        </div>

        {tab === "ui" ? (
          <Sidebar
            epics={EPICS} expandedEpic={expandedEpicUI} setExpandedEpic={setExpandedEpicUI}
            mode="ui" screenIdx={screenIdx} stateIdx={stateIdx}
            onSelectScreen={selectScreen} onSelectState={setStateIdx} getFlatIdx={getFlatIdx}
          />
        ) : (
          <Sidebar
            epics={EPICS} expandedEpic={expandedEpicFlow}
            setExpandedEpic={(id) => { setExpandedEpicFlow(id); if (id) setFlowEpicId(id) }}
            activeEpicId={flowEpicId} onSelectEpic={setFlowEpicId} mode="flow"
          />
        )}
      </div>

      {/* Main area */}
      {tab === "ui" ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", gap: 12, padding: "20px 32px", overflow: "auto" }}>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{currentScreen.screen}</div>
            <div style={{ fontSize: 11, color: "var(--foreground-secondary)", marginTop: 2 }}>{currentState.label} &mdash; {iframeSrc}</div>
          </div>

          {(() => {
            const SCALE = 0.78, W = 390, H = 844, PAD = 8
            const frameW = Math.round(W * SCALE) + PAD * 2
            const frameH = Math.round(H * SCALE) + PAD * 2
            return (
              <div style={{ width: frameW, height: frameH, borderRadius: Math.round(52 * SCALE), background: "#1a1a1a", border: "1px solid #333", padding: PAD, boxShadow: "0 25px 60px rgba(0,0,0,0.3)", position: "relative", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: Math.round(12 * SCALE) + PAD, left: "50%", transform: "translateX(-50%)", width: Math.round(120 * SCALE), height: Math.round(36 * SCALE), borderRadius: 16, background: "#000", zIndex: 10 }} />
                <div style={{ width: Math.round(W * SCALE), height: Math.round(H * SCALE), borderRadius: Math.round(44 * SCALE), overflow: "hidden", background: "#000" }}>
                  <iframe key={iframeSrc} src={iframeSrc} style={{ width: W, height: H, border: "none", transform: `scale(${SCALE})`, transformOrigin: "0 0" }} title={`${currentScreen.screen}`} />
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
              &larr; Prev
            </button>
            <span style={{ fontSize: 11, color: "var(--foreground-secondary)", minWidth: 60, textAlign: "center" }}>{globalStatePos} / {TOTAL_STATES}</span>
            <button
              onClick={() => { if (stateIdx < currentScreen.states.length - 1) { setStateIdx(stateIdx + 1) } else if (screenIdx < ALL_SCREENS.length - 1) { selectScreen(screenIdx + 1) } }}
              disabled={screenIdx === ALL_SCREENS.length - 1 && stateIdx === currentScreen.states.length - 1}
              style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid var(--border-bold)", background: "var(--secondary)", color: screenIdx === ALL_SCREENS.length - 1 && stateIdx === currentScreen.states.length - 1 ? "var(--muted-foreground)" : "var(--foreground)", fontSize: 12, cursor: screenIdx === ALL_SCREENS.length - 1 && stateIdx === currentScreen.states.length - 1 ? "not-allowed" : "pointer", fontFamily: FONT }}
            >
              Next &rarr;
            </button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "20px 32px 16px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{flowEpic.title}</div>
            <div style={{ fontSize: 12, color: "var(--foreground-secondary)", marginTop: 4 }}>{flowEpic.desc}</div>
            <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
              {[
                { style: "solid", label: "Screen" },
                { style: "dashed", label: "Decision" },
                { style: "double", label: "Destination" },
              ].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                  <div style={{ width: 12, height: 12, borderRadius: item.style === "dashed" ? "50%" : 3, background: "var(--background)", border: `1.5px ${item.style === "double" ? "solid" : item.style} var(--foreground-secondary)`, ...(item.style === "double" ? { outline: "1.5px solid var(--foreground-secondary)", outlineOffset: 1 } : {}) }} />
                  <span style={{ color: "var(--foreground-secondary)" }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: 32, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
            <FlowRenderer key={flowEpicId} chart={FLOW_CHARTS[flowEpicId]} epicId={flowEpicId} />
          </div>
        </div>
      )}
    </div>
  )
}
