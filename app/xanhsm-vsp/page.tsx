"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Moon, Sun, PanelLeft, LayoutGrid, GitBranch } from "lucide-react"
import { FLOW_CHARTS } from "./_flows"

/* ── Data ───────────────────────────────────────────────────────── */
interface State { label: string; param: string; note?: string }
interface Screen { id: string; title: string; route: string; states: State[]; why: string }
interface Epic { id: string; title: string; desc: string; color: string; screens: Screen[]; hasFlow?: boolean }

const EPICS: Epic[] = [
  {
    id: "e3", title: "Happy case demo · Claim Kỳ Sự Xanh", hasFlow: true,
    desc: "Luồng demo duy nhất. Entry: Profile tab Xanh SM. Claim value cây xanh → tiền vào ví VSP. 2 branch: đã có VSP (skip PIN) / chưa có VSP (set PIN inline).",
    color: "#0b5457",
    screens: [
      {
        id: "S0", title: "Xanh SM Home · no entry", route: "/xanhsm-vsp/gsm-home",
        why: "Home Xanh SM thuần. KHÔNG có VSP card. Entry point duy nhất là tab Tài khoản ở bottom nav.",
        states: [
          { label: "Home Xanh SM", param: "no-vsp" },
        ],
      },
      {
        id: "S1", title: "Profile · Kỳ Sự Xanh entry",
        route: "/xanhsm-vsp/profile",
        why: "Block Kỳ Sự Xanh nổi bật: '2.687 cây = 50.000₫' + CTA 'Đổi thành tiền'. Đây là entry point claim. State khác nhau để test 2 branch user.",
        states: [
          { label: "Chưa có VSP · claim", param: "no-vsp" },
          { label: "Đã có VSP · claim", param: "active" },
        ],
      },
      {
        id: "S2", title: "PIN setup (Case B · user mới)", route: "/xanhsm-vsp/claim",
        why: "Chỉ xuất hiện khi user chưa có ví VSP. 2 step: nhập PIN 6 số + xác nhận lại. Auto-advance.",
        states: [
          { label: "Đặt PIN", param: "pin-setup&case=new" },
          { label: "Xác nhận PIN", param: "pin-confirm&case=new" },
        ],
      },
      {
        id: "S3", title: "T&C fullscreen · liên kết", route: "/xanhsm-vsp/claim",
        why: "Fullscreen modal. 2 logo (VSP + Xanh SM) · text 'Bạn đang liên kết' · scroll điều khoản · checkbox · CTA 'Đồng ý & Nhận tiền'.",
        states: [
          { label: "T&C · Case A (đã có VSP)", param: "tnc&case=existing" },
          { label: "T&C · Case B (user mới)", param: "tnc&case=new" },
        ],
      },
      {
        id: "S4", title: "Success · đã nhận tiền", route: "/xanhsm-vsp/claim",
        why: "'+50.000₫ vào ví VSP'. Source: Kỳ Sự Xanh. CTA 'Vào ví VSP' → wallet với balance 50K.",
        states: [
          { label: "Đã nhận 50K", param: "success&amount=50000" },
        ],
      },
      {
        id: "S5", title: "Wallet · progress 3 step", route: "/xanhsm-vsp/wallet",
        why: "Balance 50K. Progress card gating services: PIN ✅ · KYC ⏳ · Bank ⏳. Khi đủ 3 step mới hiện Gọi xe/Đặt đồ ăn. Flow show rõ progressive unlock.",
        states: [
          { label: "Vừa claim · 1/3 bước", param: "fresh-50k" },
          { label: "KYC xong · 2/3 bước", param: "half-unlocked" },
          { label: "Đủ 3/3 · hiện services", param: "active" },
        ],
      },
    ],
  },
]

const FONT = "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

/* ── Special views ──────────────────────────────────────────────── */
function ReferenceView() {
  return (
    <div style={{ padding: 32, maxWidth: 640, fontFamily: FONT, fontSize: 13, lineHeight: 1.6 }}>
      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Market research benchmarks</div>
      <div style={{ marginBottom: 16 }}><strong>GoPay × GoJek</strong> — GoPay sống như 1 card on GoJek home (Pay / Top Up / Explore). 2023 GoPay tách standalone để reach tier-2/3 cities (lightweight app 25MB).</div>
      <div style={{ marginBottom: 16 }}><strong>Grab × GrabPay</strong> — Payment tab dedicated với Wallet balance + 3 action (Top Up / Scan to Pay / Transfer) + Financial services grid (Invest, Loan, Card, Insurance).</div>
      <div style={{ marginTop: 20, padding: 14, background: "#f5f5f5", borderRadius: 8 }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>4 use case chính xuất hiện ở cả 2 app:</div>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Nạp tiền (top-up từ linked bank)</li>
          <li>Quét QR thanh toán</li>
          <li>Chuyển tiền</li>
          <li>Mua thêm dịch vụ (Financial Services)</li>
        </ul>
      </div>
    </div>
  )
}

function OpportunityView() {
  return (
    <div style={{ padding: 32, maxWidth: 820, fontFamily: FONT, fontSize: 12, lineHeight: 1.5 }}>
      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Opportunity Map · VSP × Green SM</div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#fae0d9" }}>
            <td style={{ padding: 10, border: "1px solid #ccc", fontWeight: 800 }}>SERVICE</td>
            <td style={{ padding: 10, border: "1px solid #ccc", textAlign: "center" }} colSpan={3}>Food · Ride hailing · Delivery · Others</td>
          </tr>
          <tr style={{ background: "#d6e8fa" }}>
            <td style={{ padding: 10, border: "1px solid #ccc", fontWeight: 800 }}>USER TYPE</td>
            <td style={{ padding: 10, border: "1px solid #ccc", textAlign: "center" }}>User</td>
            <td style={{ padding: 10, border: "1px solid #ccc", textAlign: "center" }}>Merchant</td>
            <td style={{ padding: 10, border: "1px solid #ccc", textAlign: "center" }}>Driver</td>
          </tr>
        </thead>
        <tbody>
          <tr style={{ background: "#ffe3b3" }}>
            <td style={{ padding: 10, border: "1px solid #ccc", fontWeight: 800 }}>PAYMENT USE CASE</td>
            <td style={{ padding: 10, border: "1px solid #ccc" }}>· Top-up Green e-Card<br />· Service payment<br />· Buy Gift card</td>
            <td style={{ padding: 10, border: "1px solid #ccc" }}>· Settlement</td>
            <td style={{ padding: 10, border: "1px solid #ccc" }}>· Driver wallet top-up<br />· Pocket<br />· Withdrawal</td>
          </tr>
          <tr style={{ background: "#c7edd0" }}>
            <td style={{ padding: 10, border: "1px solid #ccc", fontWeight: 800 }}>VSP OPPORTUNITY</td>
            <td style={{ padding: 10, border: "1px solid #ccc" }}>· e-Card withdrawal<br />· Payment method<br />· Gift card withdrawal</td>
            <td style={{ padding: 10, border: "1px solid #ccc" }}>· Merchant Wallet (Real-time Manual cash out)</td>
            <td style={{ padding: 10, border: "1px solid #ccc" }}>· V-Smart Pay Wallet</td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: 20, padding: 14, background: "#f5f5f5", borderRadius: 8, fontSize: 11 }}>
        <strong>MVP ưu tiên</strong>: Payment method + Green e-Card. Phase 2: Gift card. Phase 3: Merchant + Driver.
      </div>
    </div>
  )
}

function ScopeFlowView() {
  return (
    <div style={{ padding: 32, maxWidth: 900, fontFamily: FONT, fontSize: 12, lineHeight: 1.5 }}>
      <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>VSP × GSM Integration Flow (slide 7)</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <div style={{ background: "#fae0d9", padding: "8px 12px", fontWeight: 800, borderRadius: 6, marginBottom: 10 }}>GSM side</div>
          {[
            ["1", "Entry · user nhấn VSP icon"],
            ["2", "GSM gửi SĐT qua VSP"],
            ["3", "VSP kiểm tra có TK chưa", "diamond"],
            ["4", "Xác thực OTP (bypass khi release)", "dashed"],
            ["5", "Xác thực eKYC"],
            ["6", "Liên kết ngân hàng"],
            ["7", "Định danh + gắn ví · hiện số dư", "highlight"],
            ["8", "Phát sinh thanh toán"],
            ["9", "Đủ tiền?", "diamond"],
            ["10", "Gọi SDK nạp trong GSM (không bounce)"],
          ].map((n, i, a) => (
            <React.Fragment key={i}>
              <div style={{ padding: "10px 12px", background: n[2] === "highlight" ? "#c7edd0" : n[2] === "diamond" ? "#ffe3b3" : "#f5f5f5", borderRadius: n[2] === "diamond" ? 2 : 8, border: n[2] === "dashed" ? "1px dashed #999" : "1px solid #ddd", fontSize: 11, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ background: "#fff", padding: "2px 6px", borderRadius: 4, fontWeight: 800, fontSize: 10 }}>{n[0]}</span>
                <span>{n[1]}</span>
              </div>
              {i < a.length - 1 && <div style={{ textAlign: "center", color: "#888", padding: "2px 0" }}>↓</div>}
            </React.Fragment>
          ))}
        </div>
        <div>
          <div style={{ background: "#c7edd0", padding: "8px 12px", fontWeight: 800, borderRadius: 6, marginBottom: 10 }}>VSP side</div>
          {[
            "Mở liên kết nhanh ví VSP - GSM",
            "TKĐB của GSM nạp vào ví",
            "Ví cá nhân: Tăng số dư",
            "Ví cá nhân: Cập nhật số dư",
            "Thanh toán nhanh với liên kết ví",
          ].map((t, i, a) => (
            <React.Fragment key={i}>
              <div style={{ padding: "10px 12px", background: i === a.length - 1 ? "#c7edd0" : "#f5f5f5", borderRadius: 8, border: "1px solid #ddd", fontSize: 11 }}>{t}</div>
              {i < a.length - 1 && <div style={{ textAlign: "center", color: "#888", padding: "2px 0" }}>↓</div>}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 20, padding: 14, background: "#fff4d6", borderRadius: 8, fontSize: 11, color: "#5b3a04" }}>
        <strong>Note slide 7:</strong> "Giai đoạn khi release bypass authen sẽ bỏ step này" — OTP skip ở giai đoạn đầu.
      </div>
    </div>
  )
}

/* ── Flow renderer ──────────────────────────────────────────────── */
function FlowView({ chart, id }: { chart: string; id: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const mermaid = (await import("mermaid")).default
      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        securityLevel: "loose",
        themeVariables: {
          background: "transparent",
          primaryColor: "#ffffff",
          primaryTextColor: "#0b4a38",
          primaryBorderColor: "#0b5457",
          lineColor: "#0d99ff",
          fontSize: "13px",
          fontFamily: FONT,
        },
        flowchart: {
          htmlLabels: true,
          curve: "basis",
          padding: 30,
          nodeSpacing: 80,
          rankSpacing: 120,
          useMaxWidth: true,
        },
      })
      if (cancelled || !ref.current) return
      try {
        const uid = `flow-${id}-${Date.now().toString(36)}`
        const out = await mermaid.render(uid, chart)
        if (!cancelled && ref.current) {
          ref.current.innerHTML = out.svg
          // Style edge labels Có/Không pills
          const svgEl = ref.current.querySelector("svg")
          if (svgEl) {
            svgEl.querySelectorAll("g.edgeLabel").forEach((label) => {
              const fo = label.querySelector("foreignObject") as SVGForeignObjectElement | null
              const container = label.querySelector("foreignObject > div, foreignObject > span") as HTMLElement | null
              if (!container || !fo) return
              const text = (container.textContent || "").trim().toLowerCase()
              let bg = "#ffffff", color = "#475569", border = "1.5px solid #cbd5e1"
              if (/^có$/i.test(text)) { bg = "#DCFCE7"; color = "#15803D"; border = "1.5px solid #22c55e" }
              else if (/^không$/i.test(text)) { bg = "#FEE2E2"; color = "#B91C1C"; border = "1.5px solid #ef4444" }
              container.style.background = bg
              container.style.color = color
              container.style.border = border
              container.style.padding = "3px 10px"
              container.style.borderRadius = "100px"
              container.style.whiteSpace = "nowrap"
              container.style.display = "inline-block"
              container.style.fontWeight = "700"
              container.style.fontSize = "11px"
            })
          }
        }
      } catch (e) {
        console.error(e)
      }
    })()
    return () => { cancelled = true }
  }, [chart, id])
  return (
    <div style={{ padding: 32, overflow: "auto", width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
      <div ref={ref} style={{ width: "100%", maxWidth: 1200 }} />
    </div>
  )
}

/* ── Browser ──────────────────────────────────────────────────── */
export default function XanhSMVSPBrowser() {
  const [activeEpic, setActiveEpic] = useState<Epic>(EPICS[0])
  const [activeScreen, setActiveScreen] = useState<Screen>(EPICS[0].screens[0])
  const [activeState, setActiveState] = useState<State>(EPICS[0].screens[0].states[0])
  const [mode, setMode] = useState<"ui" | "flow">("ui")
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedEpics, setExpandedEpics] = useState<Record<string, boolean>>(
    EPICS.reduce((acc, e) => ({ ...acc, [e.id]: true }), {} as Record<string, boolean>)
  )

  // Dynamic scale: fit 390×844 iframe inside available canvas area
  const canvasRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [canvasWide, setCanvasWide] = useState(true)
  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const compute = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      const IFRAME_W = 402
      const IFRAME_H = 856
      const wide = w >= 1100
      setCanvasWide(wide)
      const SIDE_RESERVE = wide ? 620 : 120
      const widthBudget = w - SIDE_RESERVE
      const heightBudget = h - 80
      const s = Math.min(1, widthBudget / IFRAME_W, heightBudget / IFRAME_H)
      setScale(Math.max(0.3, s))
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    window.addEventListener("resize", compute)
    return () => { ro.disconnect(); window.removeEventListener("resize", compute) }
  }, [mode])

  const flatStates: { epic: Epic; screen: Screen; state: State }[] = EPICS.flatMap((e) =>
    e.screens.flatMap((s) => s.states.map((st) => ({ epic: e, screen: s, state: st })))
  )
  const currentFlatIdx = flatStates.findIndex(
    (f) => f.screen.id === activeScreen.id && f.state.param === activeState.param
  )

  const goPrev = () => {
    const idx = (currentFlatIdx - 1 + flatStates.length) % flatStates.length
    const f = flatStates[idx]
    setActiveEpic(f.epic); setActiveScreen(f.screen); setActiveState(f.state)
  }
  const goNext = () => {
    const idx = (currentFlatIdx + 1) % flatStates.length
    const f = flatStates[idx]
    setActiveEpic(f.epic); setActiveScreen(f.screen); setActiveState(f.state)
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT" || (e.target as HTMLElement)?.tagName === "TEXTAREA") return
      if (e.key === "ArrowRight") goNext()
      if (e.key === "ArrowLeft") goPrev()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [currentFlatIdx])

  const isSpecial = activeScreen.id.startsWith("R")
  const iframeSrc = `${activeScreen.route}?state=${activeState.param}`
  const iframeKey = `${activeScreen.id}-${activeState.param}`

  const T = {
    bg: darkMode ? "#06201f" : "#f4f8f8",
    panel: darkMode ? "#0c2b2a" : "#ffffff",
    border: darkMode ? "#164443" : "#e3eceb",
    borderStrong: darkMode ? "#235a57" : "#c9dcda",
    text: darkMode ? "#f5f7f7" : "#0b2420",
    textSecondary: darkMode ? "#9ab6b4" : "#5a7370",
    canvas: darkMode ? "#0a2625" : "#eef4f3",
    accent: "#28bdbf", // XanhSM brand
    accentDeep: "#0b5457",
    accentSoft: darkMode ? "#0f3a38" : "#d7f1f2",
    hi: "#c4f443", // Xanh SM lime chip
  }

  const canShowFlow = activeEpic.hasFlow && FLOW_CHARTS[activeEpic.id]

  return (
    <div style={{ height: "100vh", background: T.bg, color: T.text, fontFamily: FONT, display: "flex", fontSize: 13, overflow: "hidden" }}>
      {sidebarOpen && (
        <aside style={{ width: 288, borderRight: `1px solid ${T.border}`, background: T.panel, display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
          <div style={{ padding: "20px 22px 16px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 800, letterSpacing: 1, color: T.accent, textTransform: "uppercase", padding: "3px 8px", background: T.accentSoft, borderRadius: 999 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent }} /> VSP × XanhSM
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.5, color: T.text, marginTop: 10, lineHeight: 1.15 }}>Embedded<br/>wallet flows</div>
              <div style={{ fontSize: 11, color: T.textSecondary, marginTop: 6, letterSpacing: 0.2 }}>{EPICS.length} epics · {flatStates.length} states</div>
            </div>
            <button onClick={() => setSidebarOpen(false)} style={{ background: "transparent", border: "none", color: T.textSecondary, cursor: "pointer", padding: 4, marginTop: -2 }}>
              <PanelLeft size={16} />
            </button>
          </div>

          <div style={{ flex: 1, overflow: "auto", padding: "4px 10px 12px" }}>
            {EPICS.map((epic) => {
              const expanded = expandedEpics[epic.id]
              const stateCount = epic.screens.reduce((n, s) => n + s.states.length, 0)
              return (
                <div key={epic.id} style={{ marginBottom: 2 }}>
                  <button
                    onClick={() => setExpandedEpics((p) => ({ ...p, [epic.id]: !expanded }))}
                    style={{ width: "100%", padding: "10px 12px", background: "transparent", border: "none", color: T.text, cursor: "pointer", textAlign: "left", fontSize: 12, fontWeight: 800, fontFamily: FONT, display: "flex", alignItems: "center", gap: 10, borderRadius: 10 }}
                  >
                    <span style={{ width: 20, height: 20, borderRadius: 6, background: T.accentSoft, color: T.accent, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, letterSpacing: -0.3 }}>{epic.id.replace("e", "")}</span>
                    <span style={{ flex: 1, letterSpacing: -0.1 }}>{epic.title}</span>
                    {epic.hasFlow && <GitBranch size={10} style={{ color: T.textSecondary }} />}
                    <span style={{ fontSize: 10, color: T.textSecondary, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{stateCount}</span>
                  </button>
                  {expanded && epic.screens.map((screen) => (
                    <div key={screen.id} style={{ paddingLeft: 8 }}>
                      <div style={{ fontSize: 10, color: T.textSecondary, padding: "8px 12px 4px 30px", fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase" }}>{screen.title}</div>
                      {screen.states.map((st) => {
                        const isActive = activeScreen.id === screen.id && activeState.param === st.param
                        return (
                          <button
                            key={`${screen.id}-${st.param}`}
                            onClick={() => { setActiveEpic(epic); setActiveScreen(screen); setActiveState(st); setMode("ui") }}
                            style={{
                              width: "100%",
                              padding: "7px 12px 7px 30px",
                              background: isActive ? T.accentSoft : "transparent",
                              border: "none",
                              color: isActive ? T.accent : T.textSecondary,
                              fontWeight: isActive ? 700 : 500,
                              cursor: "pointer",
                              textAlign: "left",
                              fontSize: 12,
                              fontFamily: FONT,
                              borderRadius: 8,
                              marginBottom: 1,
                            }}
                          >
                            {st.label}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>

          <div style={{ padding: "14px 22px", borderTop: `1px solid ${T.border}`, display: "flex", flexDirection: "column", gap: 8 }}>
            <Link href="/xanhsm-vsp/gsm-home?state=no-vsp" target="_blank" style={{ fontSize: 11, color: T.textSecondary, textDecoration: "none", fontWeight: 600 }}>↗ Mở trang chủ GSM riêng</Link>
            <Link href="/" style={{ fontSize: 11, color: T.textSecondary, textDecoration: "none", fontWeight: 600 }}>← VSP UI home</Link>
          </div>
        </aside>
      )}

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ height: 56, padding: "0 22px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 12, background: T.panel }}>
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} style={{ background: T.accentSoft, border: "none", color: T.accent, cursor: "pointer", padding: "6px 8px", borderRadius: 8, display: "flex", alignItems: "center" }}>
              <PanelLeft size={16} />
            </button>
          )}
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.6, color: T.accent, textTransform: "uppercase", padding: "3px 8px", background: T.accentSoft, borderRadius: 999, flexShrink: 0 }}>
              {mode === "flow" ? "Flow" : activeEpic.id.toUpperCase()}
            </span>
            <span style={{ fontSize: 15, fontWeight: 800, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: -0.3 }}>
              {mode === "flow" ? `${activeEpic.title} · flow` : activeScreen.title}
            </span>
            {mode === "ui" && (
              <span style={{ fontSize: 12, color: T.textSecondary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 500 }}>· {activeState.label}</span>
            )}
          </div>

          {/* UI / Flow toggle */}
          {canShowFlow && (
            <div style={{ display: "flex", gap: 2, background: T.canvas, borderRadius: 999, padding: 3 }}>
              <button
                onClick={() => setMode("ui")}
                style={{ padding: "5px 12px", background: mode === "ui" ? T.panel : "transparent", border: "none", borderRadius: 999, cursor: "pointer", fontSize: 11, fontWeight: 700, color: mode === "ui" ? T.text : T.textSecondary, display: "flex", alignItems: "center", gap: 5, boxShadow: mode === "ui" ? "0 1px 3px rgba(0,0,0,0.06)" : "none" }}
              >
                <LayoutGrid size={11} /> UI
              </button>
              <button
                onClick={() => setMode("flow")}
                style={{ padding: "5px 12px", background: mode === "flow" ? T.panel : "transparent", border: "none", borderRadius: 999, cursor: "pointer", fontSize: 11, fontWeight: 700, color: mode === "flow" ? T.text : T.textSecondary, display: "flex", alignItems: "center", gap: 5, boxShadow: mode === "flow" ? "0 1px 3px rgba(0,0,0,0.06)" : "none" }}
              >
                <GitBranch size={11} /> Flow
              </button>
            </div>
          )}

          <div style={{ fontSize: 11, color: T.accent, padding: "4px 10px", background: T.accentSoft, borderRadius: 999, fontFamily: "ui-monospace, monospace", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
            {String(currentFlatIdx + 1).padStart(2, "0")} / {flatStates.length}
          </div>
          <button onClick={goPrev} style={{ width: 32, height: 32, borderRadius: 999, border: "none", background: T.canvas, cursor: "pointer", color: T.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronLeft size={15} />
          </button>
          <button onClick={goNext} style={{ width: 32, height: 32, borderRadius: 999, border: "none", background: T.canvas, cursor: "pointer", color: T.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ChevronRight size={15} />
          </button>
          <button onClick={() => setDarkMode(!darkMode)} style={{ width: 32, height: 32, borderRadius: 999, border: "none", background: T.canvas, cursor: "pointer", color: T.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>

        <div ref={canvasRef} style={{ flex: 1, display: "flex", background: darkMode ? T.canvas : "linear-gradient(180deg, #c9e7e8 0%, #e3f0ef 45%, #eef4f3 100%)", overflow: "hidden", position: "relative" }}>
          {/* subtle map dot texture */}
          {!darkMode && mode === "ui" && (
            <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(rgba(11,84,87,0.08) 0.8px, transparent 0.8px)`, backgroundSize: "22px 22px", pointerEvents: "none" }} />
          )}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: isSpecial || mode === "flow" || !canvasWide ? "1fr" : "1fr auto 1fr", alignItems: "center", padding: mode === "flow" ? 0 : "24px 32px", overflow: "auto", minWidth: 0, gap: 24, position: "relative", zIndex: 1 }}>
            {mode === "flow" && canShowFlow ? (
              <FlowView chart={FLOW_CHARTS[activeEpic.id]} id={activeEpic.id} />
            ) : isSpecial ? (
              <div style={{ background: T.panel, borderRadius: 20, maxWidth: 960, width: "100%", maxHeight: "100%", overflow: "auto", boxShadow: darkMode ? "0 30px 80px rgba(0,0,0,0.6)" : "0 20px 60px rgba(11,84,87,0.1)", justifySelf: "center" }}>
                {activeScreen.id === "R0" && <ReferenceView />}
                {activeScreen.id === "R1" && <OpportunityView />}
                {activeScreen.id === "R2" && <ScopeFlowView />}
              </div>
            ) : (
              <>
                {/* left context */}
                {canvasWide && <div style={{ justifySelf: "end", alignSelf: "center", maxWidth: 280, display: "flex", flexDirection: "column", gap: 10, paddingRight: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.8, color: T.accent, textTransform: "uppercase" }}>Epic {activeEpic.id.replace("e", "")} · {activeScreen.id}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: -0.6, lineHeight: 1.15 }}>{activeScreen.title}</div>
                  <div style={{ fontSize: 12, color: T.textSecondary, lineHeight: 1.55 }}>{activeScreen.why}</div>
                </div>}

                {/* iframe frame */}
                <div style={{ justifySelf: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <div style={{ position: "relative", width: 390 * scale, height: 844 * scale, borderRadius: 46 * scale, overflow: "hidden", border: `${6 * scale}px solid ${darkMode ? "#1a1a1a" : "#0a0a0a"}`, boxShadow: darkMode ? "0 30px 80px rgba(0,0,0,0.6)" : "0 30px 80px rgba(11,84,87,0.18)", flexShrink: 0, background: "#ffffff", boxSizing: "content-box" }}>
                    <iframe key={iframeKey} src={iframeSrc} style={{ width: 390, height: 844, border: "none", display: "block", transform: `scale(${scale})`, transformOrigin: "top left" }} title={`${activeScreen.title} — ${activeState.label}`} />
                  </div>
                </div>

                {/* right: state list */}
                {canvasWide && <div style={{ justifySelf: "start", alignSelf: "center", maxWidth: 280, display: "flex", flexDirection: "column", gap: 12, paddingLeft: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.8, color: T.textSecondary, textTransform: "uppercase" }}>Trạng thái · {activeScreen.states.length}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {activeScreen.states.map((st) => {
                      const on = st.param === activeState.param
                      return (
                        <button
                          key={st.param}
                          onClick={() => setActiveState(st)}
                          style={{ textAlign: "left", padding: "10px 14px", borderRadius: 12, border: "none", cursor: "pointer", background: on ? T.accent : T.panel, color: on ? "#fff" : T.text, fontSize: 12, fontWeight: on ? 700 : 600, display: "flex", alignItems: "center", gap: 10, boxShadow: on ? "0 4px 14px rgba(11,84,87,0.25)" : "0 1px 3px rgba(11,84,87,0.06)" }}
                        >
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: on ? T.hi : T.borderStrong, flexShrink: 0 }} />
                          <span style={{ flex: 1 }}>{st.label}</span>
                        </button>
                      )
                    })}
                  </div>
                  <div style={{ fontSize: 10, color: T.textSecondary, marginTop: 4, letterSpacing: 0.3 }}>← → điều hướng · {activeState.note || "tap để preview"}</div>
                </div>}
              </>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}

