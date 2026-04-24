"use client"

import { useEffect, useMemo, useState } from "react"

/* ════════════════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════════════════ */

type Owner = "Human" | "Human + AI" | "AI"

const LAYERS: {
  title: string
  subtitle: string
  color: string
  dark: string
  textDark?: boolean
  owner: Owner
  phone?: boolean
}[] = [
  { title: "Strategy",                 subtitle: "Goal · User · Metric",           color: "#F5D6D0", dark: "#D9A89F", textDark: true,  owner: "Human" },
  { title: "Information Architecture", subtitle: "Mental model · Navigation",      color: "#C9D4F0", dark: "#94A5D0", textDark: true,  owner: "Human + AI" },
  { title: "User Flow",                subtitle: "Screens · States · Edge cases",  color: "#8BA3DE", dark: "#5A7BC4", owner: "AI" },
  { title: "UI Skeleton",              subtitle: "Layout · Hierarchy · Components",color: "#5A7BC4", dark: "#3B5A9F", owner: "AI", phone: true },
  { title: "Visual Design",            subtitle: "Color · Typography · Restraint", color: "#2C4785", dark: "#1A2D5C", owner: "Human + AI" },
  { title: "Micro-interaction",        subtitle: "Motion · Timing · Haptic",       color: "#1A2240", dark: "#0D1127", owner: "AI" },
]

const OWNER_COLOR: Record<Owner, { bg: string; fg: string; dot: string }> = {
  "Human":      { bg: "#FEE2E2", fg: "#991B1B", dot: "#DC2626" },
  "Human + AI": { bg: "#FEF3C7", fg: "#92400E", dot: "#D97706" },
  "AI":         { bg: "#DCFCE7", fg: "#166534", dot: "#16A34A" },
}

/* ════════════════════════════════════════════════════════════════════
   PRESENTATION SHELL
   ════════════════════════════════════════════════════════════════════ */

interface Slide { id: string; steps: number; render: (step: number) => React.ReactNode }

export default function Presentation() {
  const slides: Slide[] = useMemo(() => [
    { id: "title",      steps: 1, render: () => <TitleSlide /> },
    { id: "bottleneck", steps: 3, render: (s) => <BottleneckSlide step={s} /> },
    { id: "workflow",   steps: 5, render: (s) => <WorkflowSlide step={s} /> },
    { id: "layers",     steps: 7, render: (s) => <LayersSlide step={s} /> },
    { id: "validators", steps: 2, render: (s) => <ValidatorsSlide step={s} /> },
    { id: "results",    steps: 5, render: (s) => <ResultsSlide step={s} /> },
    { id: "next",       steps: 1, render: () => <NextSlide /> },
  ], [])

  const [nav, setNav] = useState({ slideIdx: 0, step: 0 })
  const { slideIdx, step } = nav
  const current = slides[slideIdx]

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const k = e.key
      if (k === "Enter" || k === " " || k === "ArrowRight" || k === "PageDown") {
        e.preventDefault()
        setNav(n => {
          const cur = slides[n.slideIdx]
          if (n.step + 1 < cur.steps) return { slideIdx: n.slideIdx, step: n.step + 1 }
          if (n.slideIdx + 1 < slides.length) return { slideIdx: n.slideIdx + 1, step: 0 }
          return n
        })
      } else if (k === "ArrowLeft" || k === "Backspace" || k === "PageUp") {
        e.preventDefault()
        setNav(n => {
          if (n.step > 0) return { slideIdx: n.slideIdx, step: n.step - 1 }
          if (n.slideIdx > 0) return { slideIdx: n.slideIdx - 1, step: Math.max(0, slides[n.slideIdx - 1].steps - 1) }
          return n
        })
      } else if (k === "Home") setNav({ slideIdx: 0, step: 0 })
      else if (k === "End")    setNav({ slideIdx: slides.length - 1, step: slides[slides.length - 1].steps - 1 })
      else if (k.toLowerCase() === "f") {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen()
        else document.exitFullscreen()
      }
    }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [slides])

  return (
    <main className="fixed inset-0 bg-white text-[#0f172a] overflow-hidden select-none flex flex-col">
      {/* Slide stage — flex-1 fills available space; centering is correct because it lives above fixed chrome */}
      <div key={current.id} className="flex-1 min-h-0 flex items-center justify-center animate-fadein">
        {current.render(step)}
      </div>

      {/* Bottom chrome — fixed height */}
      <div className="relative h-14 shrink-0">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#f1f5f9]">
          <div
            className="h-full bg-[#0f172a] transition-[width] duration-500 ease-out"
            style={{ width: `${((slideIdx + (step + 1) / current.steps) / slides.length) * 100}%` }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-between px-8 pt-[3px]">
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] text-[#94a3b8]">
            <span>{String(slideIdx + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
            <span className="opacity-60">VSP · Design Team</span>
          </div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#94a3b8]">
            Enter ▸  ◂ Back  ·  F fullscreen
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadein  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadein    { animation: fadein 0.45s ease-out; }
        @keyframes planein { from { opacity: 0; transform: rotateY(-55deg) translateY(40px); } to { opacity: 1; transform: rotateY(-45deg) translateY(0); } }
        .animate-planein   { animation: planein 0.65s cubic-bezier(0.2,0.8,0.2,1) both; }
        @keyframes rise    { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .animate-rise      { animation: rise 0.5s ease-out both; }
        html, body         { overscroll-behavior: none; }
      `}</style>
    </main>
  )
}

/* ════════════════════════════════════════════════════════════════════
   Shared: centered slide frame
   ════════════════════════════════════════════════════════════════════ */

function Frame({
  eyebrow,
  children,
  wide = false,
}: {
  eyebrow?: string
  children: React.ReactNode
  wide?: boolean
}) {
  return (
    <div className={`w-full ${wide ? "max-w-[1440px]" : "max-w-[1180px]"} px-16 flex flex-col`}>
      {eyebrow && (
        <div className="text-[11px] uppercase tracking-[0.3em] text-[#64748b] mb-5">
          {eyebrow}
        </div>
      )}
      {children}
    </div>
  )
}

function OwnerBadge({ owner }: { owner: Owner }) {
  const c = OWNER_COLOR[owner]
  return (
    <div
      className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
      style={{ background: c.bg, color: c.fg }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
      {owner}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════
   01 — TITLE
   ════════════════════════════════════════════════════════════════════ */

function TitleSlide() {
  return (
    <Frame>
      <div className="text-[11px] uppercase tracking-[0.3em] text-[#64748b] mb-8">
        V-Smart Pay · Design Team · 2026
      </div>
      <h1 className="text-[96px] leading-[0.95] font-semibold tracking-[-0.03em] mb-8">
        How we cut design<br />
        time <span className="text-[#5A7BC4]">in half.</span>
      </h1>
      <p className="text-[22px] leading-[1.45] text-[#475569] max-w-[720px]">
        AI handles what can be measured. Humans concentrate on taste.
        Here is the workflow, the validators, and the results.
      </p>
      <div className="mt-14 text-[13px] text-[#94a3b8] tracking-wider">
        Press <kbd className="px-2 py-1 rounded bg-[#f1f5f9] text-[#334155] font-mono text-[11px]">Enter</kbd> to continue
      </div>
    </Frame>
  )
}

/* ════════════════════════════════════════════════════════════════════
   02 — BOTTLENECK
   ════════════════════════════════════════════════════════════════════ */

function BottleneckSlide({ step }: { step: number }) {
  return (
    <Frame eyebrow="The bottleneck">
      <div className="flex items-end gap-10 mb-10">
        <div className="text-[160px] leading-[0.85] font-semibold tracking-[-0.04em]">80%</div>
        <div className="text-[28px] leading-[1.25] text-[#475569] pb-4 max-w-[520px]">
          of design work is <strong className="text-[#0f172a]">mechanical</strong>.
        </div>
      </div>

      <div className="space-y-5 max-w-[900px]">
        {step >= 1 && (
          <div className="animate-rise flex items-baseline gap-5">
            <div className="text-[20px] text-[#94a3b8] shrink-0">→</div>
            <div className="text-[22px] leading-[1.4] text-[#334155]">
              Tokens · alignment · states · edge cases · copy variants —
              repetitive, rule-based, easy to verify.
            </div>
          </div>
        )}
        {step >= 2 && (
          <div className="animate-rise flex items-baseline gap-5">
            <div className="text-[20px] text-[#94a3b8] shrink-0">→</div>
            <div className="text-[22px] leading-[1.4] font-medium text-[#5A7BC4]">
              When designers handle this by hand, features ship slowly
              and consistency drifts.
            </div>
          </div>
        )}
      </div>
    </Frame>
  )
}

/* ════════════════════════════════════════════════════════════════════
   03 — WORKFLOW (main narrative)
   ════════════════════════════════════════════════════════════════════ */

function WorkflowSlide({ step }: { step: number }) {
  const stages = [
    { n: "01", title: "Frame",       who: "Human" as Owner, time: "~30 min",    desc: "Lead designer writes strategy, taste anchors, non-negotiables. One-time input per feature." },
    { n: "02", title: "AI Loop",     who: "AI"    as Owner, time: "1–2 h · bg", desc: "Generates layout, tokens, states. Auto-validates against 8+ mechanical rules." },
    { n: "03", title: "Taste Gate",  who: "Human" as Owner, time: "~30 min",    desc: "Designer reviews hierarchy, premium feel, copy voice in one batch. Overrides saved as examples." },
    { n: "04", title: "Polish Loop", who: "AI"    as Owner, time: "~30 min",    desc: "AI re-applies validators + taste overrides until clean. Ship." },
  ]

  return (
    <Frame eyebrow="Our workflow" wide>
      <h2 className="text-[56px] leading-[1.05] font-semibold tracking-[-0.02em] mb-3">
        Four stages.
      </h2>
      <h2 className="text-[56px] leading-[1.05] font-semibold tracking-[-0.02em] mb-14 text-[#5A7BC4]">
        Humans gate. AI iterates.
      </h2>

      <div className="flex items-stretch gap-3 w-full">
        {stages.map((s, i) => {
          const visible = step > i
          const isAI = s.who === "AI"
          return (
            <div key={s.title} className="flex items-stretch flex-1">
              <div
                className={`flex-1 rounded-[18px] p-6 ${visible ? "animate-rise" : "opacity-0"}`}
                style={{
                  background: isAI ? "#0F172A" : "#F8FAFC",
                  color: isAI ? "#fff" : "#0f172a",
                  border: isAI ? "none" : "1.5px solid #E2E8F0",
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[11px] uppercase tracking-wider opacity-60 font-mono">{s.n}</div>
                  <div className="text-[10px] opacity-60">{s.time}</div>
                </div>
                <div className="text-[24px] font-semibold leading-tight mb-3">{s.title}</div>
                <div
                  className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mb-4"
                  style={{
                    background: isAI ? "rgba(255,255,255,0.15)" : OWNER_COLOR[s.who].bg,
                    color: isAI ? "#fff" : OWNER_COLOR[s.who].fg,
                  }}
                >
                  {s.who}
                </div>
                <div className={`text-[12.5px] leading-[1.55] ${isAI ? "text-white/70" : "text-[#475569]"}`}>
                  {s.desc}
                </div>
              </div>
              {i < stages.length - 1 && (
                <div className={`flex items-center px-2 ${step > i + 1 ? "opacity-100" : "opacity-20"} transition-opacity`}>
                  <div className="text-[#94a3b8] text-[22px]">→</div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {step >= 4 && (
        <div className="mt-10 animate-rise">
          <div className="inline-flex items-center gap-6 px-6 py-4 rounded-[12px] bg-[#EFF6FF] border border-[#BFDBFE]">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#1E40AF] font-semibold">Net effect</div>
              <div className="text-[18px] font-semibold text-[#0f172a] mt-0.5">
                Designer-time per feature: 8h → 4h. Mechanical consistency: 0 → 90+/100.
              </div>
            </div>
          </div>
        </div>
      )}
    </Frame>
  )
}

/* ════════════════════════════════════════════════════════════════════
   04 — LAYERS (supporting visual)
   ════════════════════════════════════════════════════════════════════ */

function LayersSlide({ step }: { step: number }) {
  return (
    <Frame eyebrow="Under the hood" wide>
      <h2 className="text-[44px] leading-[1.05] font-semibold tracking-[-0.02em] mb-10 text-center">
        We split design into <span className="text-[#5A7BC4]">6 layers</span> — each with its own owner.
      </h2>

      <div
        className="relative flex items-end justify-center gap-[50px] min-h-[480px] w-full"
        style={{ perspective: "2400px", perspectiveOrigin: "50% 30%" }}
      >
        {LAYERS.map((layer, i) => {
          const visible = step > i
          return (
            <div key={layer.title} className="flex flex-col items-center" style={{ transformStyle: "preserve-3d" }}>
              <div
                className={visible ? "animate-planein" : "opacity-0"}
                style={{
                  width: "160px",
                  height: "420px",
                  background: `linear-gradient(135deg, ${layer.color} 0%, ${layer.dark} 100%)`,
                  transform: "rotateY(-45deg)",
                  transformStyle: "preserve-3d",
                  transformOrigin: "right center",
                  position: "relative",
                  boxShadow: "-30px 35px 70px -15px rgba(15,23,42,0.35), -5px 10px 20px -5px rgba(15,23,42,0.2)",
                }}
              >
                <div
                  style={{
                    position: "absolute", left: 0, top: 0, width: "12px", height: "100%",
                    background: layer.dark, transform: "rotateY(90deg)", transformOrigin: "left center",
                  }}
                />
                <div
                  className="absolute top-5 left-5 text-[11px] font-semibold tracking-wider opacity-60"
                  style={{ color: layer.textDark ? "#1a1a1a" : "#fff" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                {layer.phone && visible && (
                  <img
                    src="/workflow-slide-phone.png"
                    alt="Phone"
                    className="absolute rounded-[26px] shadow-[0_30px_60px_-10px_rgba(15,23,42,0.5)]"
                    style={{
                      top: "30px", left: "-110px", width: "190px", height: "auto",
                      transform: "rotateY(45deg) translateZ(80px)",
                      border: "2px solid rgba(255,255,255,0.9)",
                      animation: "rise 0.8s 0.3s ease-out both",
                    }}
                  />
                )}
              </div>
              {visible && (
                <div className="mt-8 text-center w-[170px] animate-rise">
                  <div className="text-[14px] font-semibold leading-tight mb-1">{layer.title}</div>
                  <div className="text-[10.5px] text-[#64748b] leading-[1.4] mb-2.5">{layer.subtitle}</div>
                  <OwnerBadge owner={layer.owner} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {step >= 6 && (
        <div className="mt-8 text-center animate-rise">
          <div className="text-[16px] leading-[1.5] text-[#475569] max-w-[900px] mx-auto">
            AI handles what can be measured. Humans own what still can't.
          </div>
        </div>
      )}
    </Frame>
  )
}

/* ════════════════════════════════════════════════════════════════════
   05 — VALIDATORS
   ════════════════════════════════════════════════════════════════════ */

function ValidatorsSlide({ step }: { step: number }) {
  const running = [
    "Token compliance — no raw hex, no banned classes",
    "22px alignment axis — every text element on grid",
    "Typography hierarchy — 3–5 distinct font levels",
    "WCAG contrast — 4.5:1 minimum",
    "BRD coverage — every user story mapped to a route",
    "Figma diff — pixel match against design ref",
  ]
  const humanOnly = [
    "Premium feel — Cash App-tier restraint",
    "Brand voice — quiet, confident, trust",
    "Hierarchy judgment — what matters most on this screen",
    "Copy tone — human, not AI-generic",
  ]

  return (
    <Frame eyebrow="What we measure">
      <h2 className="text-[52px] leading-[1.05] font-semibold tracking-[-0.02em] mb-12">
        If it can be measured, <span className="text-[#5A7BC4]">AI handles it.</span>
      </h2>

      <div className="grid grid-cols-2 gap-14">
        <div className="animate-rise">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
            <div className="text-[12px] uppercase tracking-wider font-semibold text-[#166534]">
              Running automated
            </div>
          </div>
          <div className="space-y-2.5">
            {running.map((r) => (
              <div key={r} className="flex items-start gap-3 text-[15px] leading-[1.5]">
                <div className="text-[#16A34A] font-mono text-[14px] mt-0.5">✓</div>
                <div className="text-[#0f172a]">{r}</div>
              </div>
            ))}
          </div>
        </div>

        {step >= 1 && (
          <div className="animate-rise">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-2 h-2 rounded-full bg-[#DC2626]" />
              <div className="text-[12px] uppercase tracking-wider font-semibold text-[#991B1B]">
                Human-only (for now)
              </div>
            </div>
            <div className="space-y-2.5">
              {humanOnly.map((r) => (
                <div key={r} className="flex items-start gap-3 text-[15px] leading-[1.5]">
                  <div className="text-[#DC2626] font-mono text-[14px] mt-0.5">◆</div>
                  <div className="text-[#0f172a]">{r}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Frame>
  )
}

/* ════════════════════════════════════════════════════════════════════
   06 — RESULTS
   ════════════════════════════════════════════════════════════════════ */

function ResultsSlide({ step }: { step: number }) {
  const metrics = [
    { value: "50%",   label: "Designer-time saved",  note: "per feature, hybrid workflow" },
    { value: "5+",    label: "Features shipped",      note: "Q1 2026" },
    { value: "40+",   label: "Screens delivered",     note: "across flagship flows" },
    { value: "96",    label: "Alignment score",       note: "auto-measured /100" },
  ]

  return (
    <Frame eyebrow="Early results" wide>
      <h2 className="text-[52px] leading-[1.05] font-semibold tracking-[-0.02em] mb-16">
        What this has delivered <span className="text-[#5A7BC4]">so far.</span>
      </h2>

      <div className="grid grid-cols-4 gap-10 w-full">
        {metrics.map((m, i) => {
          const visible = step > i
          return (
            <div key={m.label} className={visible ? "animate-rise" : "opacity-0"} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="text-[12px] uppercase tracking-wider text-[#64748b] mb-3">{m.label}</div>
              <div className="text-[80px] leading-[0.9] font-semibold tracking-[-0.03em] text-[#0f172a] mb-3">
                {m.value}
              </div>
              <div className="text-[12.5px] text-[#94a3b8]">{m.note}</div>
            </div>
          )
        })}
      </div>
    </Frame>
  )
}

/* ════════════════════════════════════════════════════════════════════
   07 — NEXT
   ════════════════════════════════════════════════════════════════════ */

function NextSlide() {
  const asks = [
    { n: "01", title: "Build the validator suite",      desc: "Automate mechanical checks across all features." },
    { n: "02", title: "Ship /design-v2",                desc: "Replace the 4-phase workflow with 6-layer pipeline." },
    { n: "03", title: "Codify taste as training data",  desc: "Every designer override becomes an AI example." },
  ]

  return (
    <Frame eyebrow="What's next">
      <h2 className="text-[72px] leading-[1.0] font-semibold tracking-[-0.03em] mb-12">
        Three moves<br />
        <span className="text-[#5A7BC4]">this month.</span>
      </h2>

      <div className="space-y-6">
        {asks.map((a) => (
          <div key={a.n} className="flex gap-8 items-baseline border-b border-[#e2e8f0] pb-6 last:border-0">
            <div className="text-[26px] font-mono text-[#94a3b8] tabular-nums">{a.n}</div>
            <div>
              <div className="text-[24px] font-semibold leading-tight mb-1.5">{a.title}</div>
              <div className="text-[15px] text-[#475569] leading-[1.45]">{a.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-[13px] text-[#94a3b8]">Thank you. Questions?</div>
    </Frame>
  )
}
