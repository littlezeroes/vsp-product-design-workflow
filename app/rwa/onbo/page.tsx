"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

/* ── Visuals (full-screen bg) ────────────────────────────────────────── */

function Visual1() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(255,255,255,0.08) 0%, transparent 70%)" }} />
      <div className="absolute w-[320px] h-[320px] rounded-full border border-white/8" style={{ top: "50%", left: "50%", transform: "translate(-50%, -60%)" }} />
      <div className="absolute w-[220px] h-[220px] rounded-full border border-white/10" style={{ top: "50%", left: "50%", transform: "translate(-50%, -60%)" }} />

      {/* Coin stack */}
      <div className="relative" style={{ marginTop: "-60px" }}>
        {/* Stack layers */}
        <div className="absolute w-[168px] h-[168px] rounded-full" style={{ background: "linear-gradient(145deg,#222,#111)", top: "-20px", left: "6px" }} />
        <div className="absolute w-[172px] h-[172px] rounded-full" style={{ background: "linear-gradient(145deg,#333,#1a1a1a)", top: "-10px", left: "3px" }} />
        {/* Main coin */}
        <div className="relative w-[178px] h-[178px] rounded-full flex items-center justify-center" style={{ background: "linear-gradient(145deg,#fff 0%,#d0d0d0 50%,#909090 100%)" }}>
          <div className="flex flex-col items-center leading-none">
            <span className="text-[13px] font-semibold text-black/40">từ</span>
            <span className="text-[44px] font-black text-black tracking-tight">₫1M</span>
          </div>
        </div>

        {/* Floating chips below */}
        <div className="flex gap-[8px] mt-[20px] justify-center">
          {["Chuẩn hóa", "An toàn", "Sinh lời"].map((t) => (
            <div key={t} className="px-[10px] py-[5px] rounded-full" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)" }}>
              <span className="text-[11px] font-semibold text-white/60">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Visual2() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(255,255,255,0.06) 0%, transparent 70%)" }} />
      <div style={{ marginTop: "-40px" }}>
        <svg width="280" height="230" viewBox="0 0 280 230" fill="none">
          <line x1="140" y1="115" x2="56" y2="50" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="5 5" />
          <line x1="140" y1="115" x2="224" y2="50" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="5 5" />
          <line x1="140" y1="115" x2="56" y2="180" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="5 5" />
          <line x1="140" y1="115" x2="224" y2="180" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="5 5" />
          <line x1="56" y1="50" x2="224" y2="50" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <line x1="56" y1="180" x2="224" y2="180" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

          {[[56,50],[224,50],[56,180],[224,180]].map(([cx,cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="26" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <circle cx={cx} cy={cy} r="9" fill="rgba(255,255,255,0.35)" />
            </g>
          ))}

          <circle cx="140" cy="115" r="46" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
          <circle cx="140" cy="115" r="32" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
          <circle cx="140" cy="115" r="20" fill="rgba(255,255,255,0.9)" />
          <path d="M133 111 Q133 107 137 107 L143 107 Q147 107 147 111 L147 119 Q147 123 143 123 L137 123 Q133 123 133 119 Z" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="136" y1="115" x2="144" y2="115" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}

function Visual3() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 70% at 50% 45%, rgba(255,255,255,0.06) 0%, transparent 70%)" }} />
      <div className="flex flex-col items-center gap-[20px]" style={{ marginTop: "-60px" }}>
        <svg width="130" height="100" viewBox="0 0 130 100" fill="none">
          <path d="M12 50 L65 10 L118 50" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 44 L22 88 L108 88 L108 44" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M52 88 L52 64 L78 64 L78 88" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 44 L22 88 L108 88 L108 44 L65 10 Z" fill="rgba(255,255,255,0.04)" />
        </svg>
        <div className="flex items-end gap-[10px]">
          {[2,3,4,5,6].map((count, i) => (
            <div key={i} className="flex flex-col items-center gap-[3px]">
              {Array.from({ length: count }).map((_, j) => (
                <div key={j} className="w-[30px] h-[11px] rounded-full"
                  style={{ background: `rgba(255,255,255,${0.1 + j * 0.04})`, border: "1px solid rgba(255,255,255,0.18)" }} />
              ))}
            </div>
          ))}
        </div>
        <p className="text-[11px] font-semibold text-white/25 tracking-[2px] uppercase">Tích lũy → Sở hữu</p>
      </div>
    </div>
  )
}

/* ── Slide data ──────────────────────────────────────────────────────── */
const SLIDES = [
  {
    tag:    "VIN · TÍN",
    title:  "Đầu tư bất động sản từ 1 triệu đồng.",
    body:   "Tiếp cận cơ hội đầu tư bất động sản thế hệ mới.",
    visual: <Visual1 />,
  },
  {
    tag:    "SMART · CÔNG NGHỆ",
    title:  "Quyền sở hữu của bạn được ghi nhận trên blockchain.",
    body:   "Minh bạch, bảo toàn và không thể thay đổi.",
    visual: <Visual2 />,
  },
  {
    tag:    "FUTURE · TƯƠNG LAI",
    title:  "Giao dịch linh hoạt theo nhu cầu đầu tư.",
    body:   "Tích lũy theo thời gian — hướng tới sở hữu tài sản thực.",
    visual: <Visual3 />,
  },
]

/* ── Page ───────────────────────────────────────────────────────────── */
export default function OnboardingPage() {
  const router  = useRouter()
  const [slide, setSlide] = React.useState(0)
  const isLast  = slide === SLIDES.length - 1
  const current = SLIDES[slide]

  return (
    <div className="dark min-h-screen flex justify-center bg-black">
      <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground overflow-hidden">

        {/* ── Full-screen visual ────────────────────────────────────── */}
        {current.visual}

        {/* ── Bottom gradient overlay ───────────────────────────────── */}
        <div className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.95) 40%, rgba(0,0,0,0.6) 70%, transparent 100%)" }} />

        {/* ── Story indicators — TOP ────────────────────────────────── */}
        <div className="absolute top-0 inset-x-0 z-20 pt-[14px] px-[16px]">
          <div className="flex gap-[5px]">
            {SLIDES.map((_, i) => (
              <div key={i} className="flex-1 h-[2.5px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
                <div className={`h-full rounded-full transition-all duration-300 ${i < slide ? "w-full" : i === slide ? "w-full" : "w-0"}`}
                  style={{ background: i <= slide ? "rgba(255,255,255,0.9)" : "transparent" }} />
              </div>
            ))}
          </div>

          {/* Logo + Skip */}
          <div className="flex items-center justify-between mt-[12px]">
            <div className="flex items-center gap-[8px]">
              <div className="w-[30px] h-[30px] rounded-[8px] bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <span className="text-[9px] font-black text-white tracking-tight">VSF</span>
              </div>
              <span className="text-[13px] font-semibold text-white">Vin Smart Future</span>
            </div>
            <button
              type="button"
              onClick={() => router.push("/rwa")}
              className="text-sm text-white/50 focus-visible:outline-none py-[6px]"
            >
              Bỏ qua
            </button>
          </div>
        </div>

        {/* ── Bottom content ────────────────────────────────────────── */}
        <div className="absolute inset-x-0 bottom-0 z-20 px-[22px] pb-[42px]">
          <p className="text-xs font-semibold text-white/40 tracking-[2px] uppercase mb-[10px]">
            {current.tag}
          </p>
          <h1 className="text-[30px] font-black leading-[1.18] tracking-[-0.02em] text-white mb-[10px]">
            {current.title}
          </h1>
          <p className="text-sm text-white/60 leading-[1.6] mb-[28px]">
            {current.body}
          </p>

          <Button
            variant="primary"
            size="48"
            className="w-full"
            onClick={() => isLast ? router.push("/rwa") : setSlide(s => s + 1)}
          >
            {isLast ? "Khám phá ngay" : "Tiếp theo"}
          </Button>
        </div>

        {/* ── Home indicator ────────────────────────────────────────── */}
        <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none z-30">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>

      </div>
    </div>
  )
}
