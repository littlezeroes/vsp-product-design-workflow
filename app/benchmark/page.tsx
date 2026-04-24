"use client"

import { useEffect, useMemo, useState } from "react"

/* ══════════════════════════════════════════════════════════════
   THE CLARITY INDEX — VSP vs Vapp vs World-Class
   Single-slide deck for C-Level escalation.
   Style: editorial, black-on-white, no decoration.
   Numbers are PLACEHOLDERS — replace with measured benchmarks
   before sharing upstairs.
   ══════════════════════════════════════════════════════════════ */

type Metric = {
  key: string
  title: string
  unit: string
  lowerIsBetter: boolean
  vapp: number
  vsp: number
  best: number
  bestLabel: string
  insight: string
}

const METRICS: Metric[] = [
  {
    key: "ttm",
    title: "Time-to-Money",
    unit: "seconds to transfer",
    lowerIsBetter: true,
    vapp: 31,
    vsp: 7,
    best: 4,
    bestLabel: "Cash App",
    insight: "4.4× faster. Users stop thinking about the app — they think about the money.",
  },
  {
    key: "taps",
    title: "Taps-to-Goal",
    unit: "core flow: send money",
    lowerIsBetter: true,
    vapp: 9,
    vsp: 4,
    best: 3,
    bestLabel: "Revolut",
    insight: "Each extra tap is a 15% drop-off risk. We cut 5 taps out of 9.",
  },
  {
    key: "loaders",
    title: "Loader Debt",
    unit: "skeleton screens per flow",
    lowerIsBetter: true,
    vapp: 6,
    vsp: 1,
    best: 0,
    bestLabel: "Apple Wallet",
    insight: "Loaders teach users the app is slow. We replaced 5 of 6 with optimistic UI.",
  },
  {
    key: "type",
    title: "Type Discipline",
    unit: "fonts × weights in shipped app",
    lowerIsBetter: true,
    vapp: 14,
    vsp: 5,
    best: 3,
    bestLabel: "Apple HIG",
    insight: "Design system, not designer taste. One family, five roles, zero exceptions.",
  },
  {
    key: "trust",
    title: "Trust Score",
    unit: "NPS — 'would you trust with 10M₫?'",
    lowerIsBetter: false,
    vapp: -12,
    vsp: 34,
    best: 68,
    bestLabel: "Revolut APAC",
    insight: "From detractor territory to promoter. Still 34 points of ceiling to claim.",
  },
]

const SLIDES = [
  { id: "title" },
  { id: "index" },
  ...METRICS.map((m) => ({ id: `m-${m.key}` })),
  { id: "verdict" },
  { id: "decision" },
]

export default function Page() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const k = e.key
      if (k === "ArrowRight" || k === " " || k === "Enter" || k === "PageDown") {
        setIdx((n) => Math.min(SLIDES.length - 1, n + 1))
      } else if (k === "ArrowLeft" || k === "Backspace" || k === "PageUp") {
        setIdx((n) => Math.max(0, n - 1))
      } else if (k === "Home") setIdx(0)
      else if (k === "End") setIdx(SLIDES.length - 1)
      else if (k === "f" || k === "F") document.documentElement.requestFullscreen?.().catch(() => {})
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const slide = SLIDES[idx]

  return (
    <div className="min-h-screen bg-white text-neutral-950 font-sans antialiased selection:bg-black selection:text-white">
      <main className="relative mx-auto max-w-[1400px] px-12 pt-16 pb-24">
        {slide.id === "title" && <TitleSlide />}
        {slide.id === "index" && <IndexSlide />}
        {METRICS.map((m) => slide.id === `m-${m.key}` && <MetricSlide key={m.key} m={m} />)}
        {slide.id === "verdict" && <VerdictSlide />}
        {slide.id === "decision" && <DecisionSlide />}
      </main>

      {/* Footer chrome */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-neutral-200 bg-white">
        <div className="h-1 bg-neutral-100">
          <div
            className="h-full bg-neutral-950 transition-all duration-200"
            style={{ width: `${((idx + 1) / SLIDES.length) * 100}%` }}
          />
        </div>
        <div className="px-12 h-10 flex items-center justify-between text-[11px] tracking-widest uppercase text-neutral-500">
          <span>{String(idx + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}</span>
          <span>V-Smart Pay · Clarity Index · Draft for C-Level</span>
          <span>← → · F fullscreen</span>
        </div>
      </footer>
    </div>
  )
}

/* ── Slides ──────────────────────────────────────────────── */

function TitleSlide() {
  return (
    <div className="flex flex-col justify-center min-h-[80vh]">
      <div className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 mb-10">
        Escalation · April 2026 · One page · Measured, not felt
      </div>
      <h1 className="text-[88px] leading-[0.95] font-semibold tracking-tight">
        The Clarity<br />Index.
      </h1>
      <p className="mt-8 text-[20px] leading-snug text-neutral-600 max-w-[760px]">
        Five measurable dimensions. Three benchmarks: where we were (Vapp),
        where we are (V-Smart Pay), where the world is (Revolut / Cash App / Apple).
        No opinions — only numbers we can defend.
      </p>
    </div>
  )
}

function IndexSlide() {
  return (
    <div className="min-h-[80vh]">
      <Kicker>The Index</Kicker>
      <h2 className="text-[56px] leading-[1.02] font-semibold tracking-tight mb-14 max-w-[920px]">
        If we can't measure the elephant,<br />we can't ship it.
      </h2>
      <ol className="space-y-6 max-w-[920px]">
        {METRICS.map((m, i) => (
          <li key={m.key} className="grid grid-cols-[48px_1fr_auto] items-baseline gap-6 pb-6 border-b border-neutral-200">
            <span className="text-[13px] tabular-nums tracking-wider text-neutral-400">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <div className="text-[22px] font-semibold">{m.title}</div>
              <div className="text-[14px] text-neutral-500">{m.unit}</div>
            </div>
            <div className="text-[13px] tracking-wider uppercase text-neutral-400">
              {m.lowerIsBetter ? "↓ lower = better" : "↑ higher = better"}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function MetricSlide({ m }: { m: Metric }) {
  const values = [
    { label: "Vapp",    short: "Legacy",      value: m.vapp, tone: "legacy" as const },
    { label: "V-Smart Pay", short: "Us",      value: m.vsp,  tone: "us" as const },
    { label: m.bestLabel,   short: "Ceiling", value: m.best, tone: "best" as const },
  ]
  const max = Math.max(Math.abs(m.vapp), Math.abs(m.vsp), Math.abs(m.best))
  const winner = m.lowerIsBetter
    ? values.reduce((a, b) => (b.value < a.value ? b : a))
    : values.reduce((a, b) => (b.value > a.value ? b : a))

  const gap = ((m.vsp - m.vapp) / (m.vapp || 1)) * 100
  const gapText = m.lowerIsBetter
    ? `${Math.abs(gap).toFixed(0)}% reduction vs Vapp`
    : `${Math.abs(gap).toFixed(0)}% lift vs Vapp`

  return (
    <div className="min-h-[80vh]">
      <Kicker>{m.title} · {m.unit}</Kicker>
      <div className="grid grid-cols-3 gap-10 mt-14">
        {values.map((v) => (
          <div key={v.label} className={`pt-8 border-t-4 ${v.tone === "us" ? "border-neutral-950" : "border-neutral-200"}`}>
            <div className="text-[11px] tracking-widest uppercase text-neutral-500">
              {v.short}
            </div>
            <div className="text-[16px] font-medium mt-1 mb-6">{v.label}</div>
            <div className={`text-[120px] leading-none font-semibold tabular-nums tracking-tight ${v === winner ? "text-neutral-950" : "text-neutral-400"}`}>
              {v.value > 0 && !m.lowerIsBetter ? "+" : ""}{v.value}
            </div>
            {/* bar */}
            <div className="mt-6 h-[6px] bg-neutral-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${v.tone === "us" ? "bg-neutral-950" : v.tone === "best" ? "bg-emerald-500" : "bg-rose-400"}`}
                style={{ width: `${(Math.abs(v.value) / (max || 1)) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-16 max-w-[900px]">
        <div className="text-[11px] tracking-widest uppercase text-neutral-500 mb-2">
          The gap · {gapText}
        </div>
        <p className="text-[28px] leading-snug font-medium text-neutral-900">
          {m.insight}
        </p>
      </div>
    </div>
  )
}

function VerdictSlide() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center">
      <Kicker>Verdict</Kicker>
      <h2 className="text-[72px] leading-[0.98] font-semibold tracking-tight mb-10 max-w-[1100px]">
        On four of five dimensions,<br />
        V-Smart Pay has left Vapp behind.
      </h2>
      <div className="grid grid-cols-2 gap-12 max-w-[1100px] mt-6">
        <div>
          <div className="text-[13px] tracking-widest uppercase text-neutral-500 mb-3">What we shipped</div>
          <ul className="space-y-2 text-[18px] text-neutral-800">
            <li>— 4.4× faster transfer (31s → 7s)</li>
            <li>— 56% fewer taps (9 → 4)</li>
            <li>— 83% fewer loaders (6 → 1)</li>
            <li>— Trust score flipped from −12 to +34</li>
          </ul>
        </div>
        <div>
          <div className="text-[13px] tracking-widest uppercase text-neutral-500 mb-3">What's still on the table</div>
          <ul className="space-y-2 text-[18px] text-neutral-800">
            <li>— 3 seconds of TTM vs Cash App</li>
            <li>— 34 points of NPS vs Revolut</li>
            <li>— 2 font-weight families we haven't killed</li>
            <li>— 1 loader we still can't defend</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function DecisionSlide() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center">
      <Kicker>Decision</Kicker>
      <h2 className="text-[64px] leading-[1.0] font-semibold tracking-tight mb-10 max-w-[1100px]">
        Continue under the legacy model,<br />
        or lock the Green Zone until 30/04.
      </h2>
      <div className="grid grid-cols-2 gap-10 max-w-[1100px]">
        <div className="p-8 border border-neutral-200">
          <div className="text-[13px] tracking-widest uppercase text-neutral-500 mb-3">Path A · Status quo</div>
          <div className="text-[24px] font-medium mb-3">Design Center routes everything</div>
          <p className="text-[15px] text-neutral-600">
            Predictable process, predictable result.
            Projected 30/04 score on this index: Vapp +15%.
            Not enough to flip NPS.
          </p>
        </div>
        <div className="p-8 bg-neutral-950 text-white">
          <div className="text-[13px] tracking-widest uppercase text-neutral-400 mb-3">Path B · Green Zone</div>
          <div className="text-[24px] font-medium mb-3">Thread-based, 24h loop, AI-native</div>
          <p className="text-[15px] text-neutral-300">
            Autonomy until 30/04. Measured weekly against this Index.
            If we miss the line, authority reverts. No politics, only metrics.
          </p>
        </div>
      </div>
      <div className="mt-14 text-[13px] tracking-widest uppercase text-neutral-500">
        Ask: sign off Path B for 10 working days · weekly review on this one page.
      </div>
    </div>
  )
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 mb-8">
      {children}
    </div>
  )
}
