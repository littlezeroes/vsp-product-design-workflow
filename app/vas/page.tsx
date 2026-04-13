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
    title: "Epic 1 — Thanh toán hóa đơn",
    desc: "V1 → V2 → V2a → V2b → V5(confirm)",
    color: "#6366f1",
    screens: [
      {
        screen: "V1: VAS Home",
        route: "/vas/home",
        states: [
          { label: "loaded", param: "" },
          { label: "empty-saved", param: "?state=empty-saved" },
          { label: "loading", param: "?state=loading" },
        ],
      },
      {
        screen: "V2: Danh mục hóa đơn",
        route: "/vas/bill",
        states: [
          { label: "default", param: "" },
        ],
      },
      {
        screen: "V2a: Chọn NCC",
        route: "/vas/bill/provider",
        states: [
          { label: "điện", param: "?type=electric" },
          { label: "nước", param: "?type=water" },
          { label: "internet", param: "?type=internet" },
          { label: "truyền hình", param: "?type=tv" },
          { label: "search empty", param: "?type=electric&state=search-empty" },
        ],
      },
      {
        screen: "V2b: Nhập mã KH",
        route: "/vas/bill/input",
        states: [
          { label: "empty", param: "?provider=EVN%20HCMC" },
          { label: "typing", param: "?provider=EVN%20HCMC&state=typing" },
          { label: "loading", param: "?provider=EVN%20HCMC&state=loading" },
          { label: "error-not-found", param: "?provider=EVN%20HCMC&state=error-not-found" },
        ],
      },
    ],
  },
  {
    id: "e2",
    title: "Epic 2 — Nạp tiền điện thoại",
    desc: "V3 → V5(confirm)",
    color: "#22c55e",
    screens: [
      {
        screen: "V3: Nạp tiền ĐT",
        route: "/vas/topup",
        states: [
          { label: "empty", param: "" },
          { label: "carrier detected", param: "?state=carrier-detected" },
          { label: "amount selected", param: "?state=amount-selected" },
          { label: "error", param: "?state=error" },
        ],
      },
    ],
  },
  {
    id: "e3",
    title: "Epic 3 — Xác nhận (shared)",
    desc: "V5 confirm — dùng chung cho mọi flow",
    color: "#f59e0b",
    screens: [
      {
        screen: "V5: Confirm — Topup",
        route: "/vas/confirm",
        states: [
          { label: "default", param: "?type=topup&phone=0912345678&amount=100,000" },
          { label: "loading", param: "?type=topup&state=loading" },
          { label: "insufficient", param: "?type=topup&state=insufficient" },
        ],
      },
      {
        screen: "V5: Confirm — Bill",
        route: "/vas/confirm",
        states: [
          { label: "default", param: "?type=bill&provider=EVN%20HCMC&code=PE01234567" },
          { label: "loading", param: "?type=bill&state=loading" },
          { label: "insufficient", param: "?type=bill&state=insufficient" },
        ],
      },
    ],
  },
]

/* ── Flow charts ─────────────────────────────────────────────── */
const FLOW_CHARTS: Record<string, string> = {
  e1: `flowchart TD
  START((VAS\\nHome)) --> V2[V2: Danh muc\\nhoa don]
  V2 --> V2A[V2a: Chon\\nnha cung cap]
  V2A --> V2B[V2b: Nhap\\nma khach hang]
  V2B --> D1{Tra cuu?}
  D1 -->|Tim thay| V5[V5: Xac nhan\\nthanh toan]
  D1 -->|Khong tim thay| ERR[Inline error]
  ERR --> V2B
  V5 --> AUTH[Auth\\nPIN/Bio]
  AUTH -->|OK| RESULT[Ket qua\\nGiao dich]
  AUTH -->|Fail| V5
  classDef st fill:#6366f1,stroke:#4f46e5,color:#fff
  classDef sc fill:#1a1a2e,stroke:#374151,color:#e5e5e5
  classDef dc fill:#0f172a,stroke:#6366f1,color:#c7d2fe
  classDef ok fill:#052e16,stroke:#22c55e,color:#86efac
  classDef fl fill:#450a0a,stroke:#ef4444,color:#fca5a5
  class START st
  class V2,V2A,V2B,V5 sc
  class D1 dc
  class RESULT ok
  class ERR fl
  class AUTH sc`,

  e2: `flowchart TD
  START((VAS\\nHome)) --> V3[V3: Nap tien\\ndien thoai]
  V3 --> D1{Nhap SĐT\\n+ chon menh gia}
  D1 -->|Valid| V5[V5: Xac nhan]
  D1 -->|Invalid| ERR[SĐT khong\\nhop le]
  ERR --> V3
  V5 --> AUTH[Auth\\nPIN/Bio]
  AUTH -->|OK| RESULT[Ket qua]
  AUTH -->|Fail| V5
  classDef st fill:#22c55e,stroke:#16a34a,color:#fff
  classDef sc fill:#1a1a2e,stroke:#374151,color:#e5e5e5
  classDef dc fill:#0f172a,stroke:#22c55e,color:#bbf7d0
  classDef ok fill:#052e16,stroke:#22c55e,color:#86efac
  classDef fl fill:#450a0a,stroke:#ef4444,color:#fca5a5
  class START st
  class V3,V5,AUTH sc
  class D1 dc
  class RESULT ok
  class ERR fl`,

  e3: `flowchart TD
  ANY((Bat ky flow\\nnao)) --> V5[V5: Xac nhan\\nthanh toan]
  V5 --> D1{Du so du?}
  D1 -->|Du| AUTH[Auth\\nPIN/Bio]
  D1 -->|Khong du| WARN[Canh bao\\nKhong du so du]
  WARN --> V5
  AUTH -->|OK| RESULT[Ket qua\\nThanh cong]
  AUTH -->|Fail| FAIL[Ket qua\\nThat bai]
  FAIL --> V5
  classDef st fill:#f59e0b,stroke:#d97706,color:#fff
  classDef sc fill:#1a1a2e,stroke:#374151,color:#e5e5e5
  classDef dc fill:#0f172a,stroke:#f59e0b,color:#fde68a
  classDef ok fill:#052e16,stroke:#22c55e,color:#86efac
  classDef fl fill:#450a0a,stroke:#ef4444,color:#fca5a5
  class ANY st
  class V5,AUTH sc
  class D1 dc
  class RESULT ok
  class WARN,FAIL fl`,
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
          darkMode: true, primaryColor: "#6366f1", primaryTextColor: "#e5e5e5",
          primaryBorderColor: "#4f46e5", lineColor: "#525252", secondaryColor: "#1e1b4b",
          tertiaryColor: "#0f172a", fontSize: "13px", fontFamily: FONT,
        } : {
          darkMode: false, primaryColor: "#f5f5f5", primaryTextColor: "#080808",
          primaryBorderColor: "#a3a3a3", lineColor: "#a3a3a3", secondaryColor: "#f5f5f5",
          tertiaryColor: "#fafafa", fontSize: "13px", fontFamily: FONT,
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
  screenIdx?: number; stateIdx?: number; onSelectScreen?: (flatIdx: number) => void
  onSelectState?: (idx: number) => void; getFlatIdx?: (epicIdx: number, localScreenIdx: number) => number
}) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}>
      {epics.map((epic, eIdx) => {
        const isExpanded = expandedEpic === epic.id
        const epicStateCount = epic.screens.reduce((a, s) => a + s.states.length, 0)
        return (
          <div key={epic.id}>
            <button
              onClick={() => { setExpandedEpic(isExpanded ? "" : epic.id); if (mode === "flow" && onSelectEpic) onSelectEpic(epic.id) }}
              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", padding: "10px 16px", background: isExpanded ? "var(--secondary)" : "transparent", border: "none", borderLeft: `3px solid ${isExpanded ? "var(--foreground)" : "transparent"}`, color: isExpanded ? "var(--foreground)" : "var(--foreground-secondary)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT, letterSpacing: "0.3px" }}
            >
              <span style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s", fontSize: 10 }}>&#9654;</span>
              <span style={{ flex: 1 }}>{epic.title}</span>
              <span style={{ fontSize: 10, color: "var(--foreground-secondary)", fontWeight: 400 }}>{mode === "ui" ? epicStateCount : `${epic.screens.length} screens`}</span>
            </button>
            {isExpanded && <div style={{ padding: "0 16px 6px 30px", fontSize: 10, color: "var(--foreground-secondary)" }}>{epic.desc}</div>}
            {mode === "ui" && isExpanded && getFlatIdx && onSelectScreen && onSelectState &&
              epic.screens.map((screen, sIdx) => {
                const flatIdx = getFlatIdx(eIdx, sIdx)
                const isActive = flatIdx === screenIdx
                return (
                  <div key={sIdx}>
                    <button onClick={() => onSelectScreen(flatIdx)} style={{ display: "block", width: "100%", textAlign: "left", padding: "6px 16px 6px 30px", background: isActive ? "var(--secondary)" : "transparent", border: "none", color: isActive ? "var(--foreground)" : "var(--foreground-secondary)", fontSize: 12, fontWeight: isActive ? 600 : 400, cursor: "pointer", fontFamily: FONT }}>
                      {screen.screen}
                    </button>
                    {isActive && (
                      <div style={{ padding: "4px 16px 8px 40px", display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {screen.states.map((s, idx) => {
                          const isStateActive = idx === stateIdx
                          return (
                            <button key={idx} onClick={() => onSelectState(idx)} style={{ padding: "3px 10px", borderRadius: 100, border: "none", fontSize: 10, fontWeight: isStateActive ? 600 : 400, background: isStateActive ? "var(--foreground)" : "var(--secondary)", color: isStateActive ? "var(--background)" : "var(--foreground-secondary)", cursor: "pointer", fontFamily: FONT }}>
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
            {mode === "flow" && isExpanded && epic.screens.map((screen, sIdx) => (
              <div key={sIdx} style={{ padding: "4px 16px 4px 30px", fontSize: 11, color: "var(--foreground-secondary)", fontFamily: FONT }}>{screen.screen}</div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function VasStates() {
  const [tab, setTab] = useState<"ui" | "flow">("ui")
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"))
    check()
    const obs = new MutationObserver(check)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => obs.disconnect()
  }, [])

  const [screenIdx, setScreenIdx] = useState(0)
  const [stateIdx, setStateIdx] = useState(0)
  const [expandedEpicUI, setExpandedEpicUI] = useState("e1")
  const [flowEpicId, setFlowEpicId] = useState("e1")
  const [expandedEpicFlow, setExpandedEpicFlow] = useState("e1")

  const currentScreen = ALL_SCREENS[screenIdx]
  const currentState = currentScreen.states[stateIdx]
  const iframeSrc = `${currentScreen.route}${currentState.param}`
  const currentEpicIdx = findEpicIdx(screenIdx)
  const flowEpic = EPICS.find((e) => e.id === flowEpicId) || EPICS[0]

  function selectScreen(flatIdx: number) { setScreenIdx(flatIdx); setStateIdx(0); setExpandedEpicUI(EPICS[findEpicIdx(flatIdx)].id) }
  function getFlatIdx(epicIdx: number, localScreenIdx: number): number { let flat = 0; for (let i = 0; i < epicIdx; i++) flat += EPICS[i].screens.length; return flat + localScreenIdx }
  const globalStatePos = ALL_SCREENS.slice(0, screenIdx).reduce((acc, s) => acc + s.states.length, 0) + stateIdx + 1

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--background)", color: "var(--foreground)", fontFamily: FONT }}>
      {/* Sidebar */}
      <div style={{ width: 300, minWidth: 300, borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "20px 16px 0", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)", letterSpacing: "0.5px" }}>VAS PAYMENT</div>
          <div style={{ fontSize: 11, color: "var(--foreground-secondary)", marginTop: 4 }}>3 epics &middot; {ALL_SCREENS.length} screens &middot; {TOTAL_STATES} states</div>
          <div style={{ display: "flex", gap: 0, marginTop: 12 }}>
            <button style={tabStyle(tab === "ui")} onClick={() => setTab("ui")}>UI</button>
            <button style={tabStyle(tab === "flow")} onClick={() => setTab("flow")}>Flow</button>
          </div>
        </div>
        {tab === "ui" ? (
          <Sidebar epics={EPICS} expandedEpic={expandedEpicUI} setExpandedEpic={setExpandedEpicUI} mode="ui" screenIdx={screenIdx} stateIdx={stateIdx} onSelectScreen={selectScreen} onSelectState={setStateIdx} getFlatIdx={getFlatIdx} />
        ) : (
          <Sidebar epics={EPICS} expandedEpic={expandedEpicFlow} setExpandedEpic={(id) => { setExpandedEpicFlow(id); if (id) setFlowEpicId(id) }} activeEpicId={flowEpicId} onSelectEpic={setFlowEpicId} mode="flow" />
        )}
      </div>

      {/* Main */}
      {tab === "ui" ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", gap: 12, padding: "20px 32px", overflow: "auto" }}>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>{currentScreen.screen}</div>
            <div style={{ fontSize: 11, color: "var(--foreground-secondary)", marginTop: 2 }}>{currentState.label} &mdash; {iframeSrc}</div>
          </div>
          {(() => {
            const SCALE = 0.78, W = 390, H = 844, PAD = 8
            const frameW = Math.round(W * SCALE) + PAD * 2
            const frameH = Math.round(H * SCALE) + PAD * 2
            return (
              <div style={{ width: frameW, height: frameH, borderRadius: Math.round(52 * SCALE), background: "#1a1a1a", border: "1px solid #333", padding: PAD, boxShadow: "0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.1)", position: "relative", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: Math.round(12 * SCALE) + PAD, left: "50%", transform: "translateX(-50%)", width: Math.round(120 * SCALE), height: Math.round(36 * SCALE), borderRadius: 16, background: "#000", zIndex: 10 }} />
                <div style={{ width: Math.round(W * SCALE), height: Math.round(H * SCALE), borderRadius: Math.round(44 * SCALE), overflow: "hidden", background: "#000" }}>
                  <iframe key={iframeSrc} src={iframeSrc} style={{ width: W, height: H, border: "none", transform: `scale(${SCALE})`, transformOrigin: "0 0" }} title={`${currentScreen.screen} — ${currentState.label}`} />
                </div>
              </div>
            )
          })()}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            <button onClick={() => { if (stateIdx > 0) { setStateIdx(stateIdx - 1) } else if (screenIdx > 0) { const prev = ALL_SCREENS[screenIdx - 1]; selectScreen(screenIdx - 1); setStateIdx(prev.states.length - 1) } }} disabled={screenIdx === 0 && stateIdx === 0} style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--secondary)", color: screenIdx === 0 && stateIdx === 0 ? "var(--foreground-secondary)" : "var(--foreground)", fontSize: 12, cursor: screenIdx === 0 && stateIdx === 0 ? "not-allowed" : "pointer", fontFamily: FONT }}>← Prev</button>
            <span style={{ fontSize: 11, color: "var(--foreground-secondary)", minWidth: 60, textAlign: "center" }}>{globalStatePos} / {TOTAL_STATES}</span>
            <button onClick={() => { if (stateIdx < currentScreen.states.length - 1) { setStateIdx(stateIdx + 1) } else if (screenIdx < ALL_SCREENS.length - 1) { selectScreen(screenIdx + 1) } }} disabled={screenIdx === ALL_SCREENS.length - 1 && stateIdx === currentScreen.states.length - 1} style={{ padding: "6px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--secondary)", color: screenIdx === ALL_SCREENS.length - 1 && stateIdx === currentScreen.states.length - 1 ? "var(--foreground-secondary)" : "var(--foreground)", fontSize: 12, cursor: screenIdx === ALL_SCREENS.length - 1 && stateIdx === currentScreen.states.length - 1 ? "not-allowed" : "pointer", fontFamily: FONT }}>Next →</button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "20px 32px 16px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
            <div style={{ marginBottom: 6 }}><span style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>{flowEpic.title}</span></div>
            <div style={{ fontSize: 12, color: "var(--foreground-secondary)" }}>{flowEpic.desc}</div>
            <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
              {[{ style: "solid", label: "Screen" }, { style: "dashed", label: "Decision" }, { style: "double", label: "Thanh cong" }, { style: "dotted", label: "That bai" }].map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                  <div style={{ width: 12, height: 12, borderRadius: item.style === "dashed" ? "50%" : 3, background: "var(--background)", border: `1.5px ${item.style === "double" ? "solid" : item.style} var(--foreground-secondary)`, ...(item.style === "double" ? { outline: "1.5px solid var(--foreground-secondary)", outlineOffset: 1 } : {}) }} />
                  <span style={{ color: "var(--foreground-secondary)" }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: "32px", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
            <FlowRenderer key={flowEpicId} chart={FLOW_CHARTS[flowEpicId]} epicId={flowEpicId} />
          </div>
        </div>
      )}
    </div>
  )
}
