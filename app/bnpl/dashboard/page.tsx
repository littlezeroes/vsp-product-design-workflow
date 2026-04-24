"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Settings, AlertTriangle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FixedBottom } from "@/components/ui/fixed-bottom"

/**
 * S9 · Dashboard BNPL — hero scrolls inside scroll container, sticky NavBar at top.
 * NavBar is transparent on hero (top=0), becomes white + border on scroll.
 */

const LOANS_ACTIVE = [
  { id: "L1", merchant: "VinMart+", perMonth: 637_350, installments: "2/3", next: "20/05/2026", status: "current" as const },
  { id: "L2", merchant: "VinFast Charging", perMonth: 480_000, installments: "1/1", next: "25/04/2026", status: "current" as const },
  { id: "L3", merchant: "VinMec", perMonth: 308_000, installments: "4/12", next: "20/05/2026", status: "current" as const },
]
const LOANS_OVERDUE = [
  { ...LOANS_ACTIVE[0], next: "15/04 · quá 4 ngày", status: "overdue" as const },
  ...LOANS_ACTIVE.slice(1),
]

function formatVnd(n: number) { return Math.round(n).toLocaleString("vi-VN") }

function LimitRing({ used, total, heroMode }: { used: number; total: number; heroMode: boolean }) {
  const pct = total === 0 ? 0 : used / total
  const size = 200
  const stroke = 16
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = c * pct
  const trackColor = heroMode ? "rgba(255,255,255,0.18)" : "var(--secondary)"
  const fillColor = heroMode ? "#ffffff" : (pct > 0.8 ? "var(--danger)" : "var(--foreground)")
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={trackColor} strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={fillColor} strokeWidth={stroke} fill="none" strokeDasharray={`${dash} ${c - dash}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-xs font-semibold uppercase tracking-[0.1em] ${heroMode ? "text-white/70" : "text-foreground-secondary"}`}>Đã dùng</span>
        <span className={`text-[40px] font-black leading-[44px] tracking-[-0.02em] ${heroMode ? "text-white" : "text-foreground"}`}>{Math.round(pct * 100)}%</span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "active"
  const isOverdue = state === "overdue"
  const isCritical = state === "critical"
  const isLocked = state === "locked"

  const total = 15_000_000
  const used = isCritical ? 13_500_000 : 4_090_000
  const remaining = total - used
  const loans = isOverdue ? LOANS_OVERDUE : LOANS_ACTIVE
  const nextPayment = isOverdue
    ? { amount: 637_350, date: "15/04/2026 · quá 4 ngày", dpd: 4 }
    : { amount: 1_425_350, date: "Hạn chốt 20/05/2026", dpd: 0 }

  const heroGradient = isOverdue
    ? "linear-gradient(160deg, #450a0a 0%, #991b1b 50%, #ef4444 100%)"
    : isCritical
    ? "linear-gradient(160deg, #422006 0%, #92400e 50%, #f59e0b 100%)"
    : "linear-gradient(160deg, #1e1b4b 0%, #3730a3 45%, #6366f1 100%)"

  // Scroll detection for sticky NavBar color change
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => setScrolled(el.scrollTop > 60)
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="relative w-full max-w-[390px] min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Scroll container — contains EVERYTHING scrollable including hero */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pb-[200px]">
        {/* Status bar — inside scroll, transparent on hero */}
        <div
          className="h-[54px] px-6 flex items-center sticky top-0 z-30 transition-colors duration-200"
          style={{
            background: scrolled ? "var(--background)" : "transparent",
            color: scrolled ? "var(--foreground)" : "#ffffff",
          }}
        >
          <span className="text-[17px] font-semibold flex-1">9:41</span>
          <div className="flex items-center gap-[6px]">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="0.5"/><rect x="4" y="5" width="3" height="7" rx="0.5"/><rect x="8" y="2" width="3" height="10" rx="0.5"/><rect x="12" y="0" width="3" height="12" rx="0.5"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="currentColor"/><path d="M4.5 7.5a5 5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M2 5a8 8 0 0 1 12 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            <div className="flex items-center gap-[1px]">
              <div className="w-[22px] h-[11px] rounded-[3px] border border-current flex items-center p-[1px]">
                <div className="flex-1 h-full bg-current rounded-[1.5px]" />
              </div>
              <div className="w-[1px] h-[4px] bg-current opacity-40 rounded-full" />
            </div>
          </div>
        </div>

        {/* NavBar — sticky at top=54, bg switches on scroll */}
        <div
          className="h-[56px] pl-[8px] pr-[22px] flex items-center sticky top-[54px] z-30 transition-all duration-200"
          style={{
            background: scrolled ? "var(--background)" : "transparent",
            color: scrolled ? "var(--foreground)" : "#ffffff",
            boxShadow: scrolled ? "0 1px 0 var(--border)" : "none",
          }}
        >
          <button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full">
            <ChevronLeft size={18} />
          </button>
          <span className="flex-1 text-md font-bold text-center">Ví trả sau</span>
          <button onClick={() => router.push("/bnpl/settings")} className="p-[10px] min-h-[44px] rounded-full">
            <Settings size={20} />
          </button>
        </div>

        {/* Hero — scrollable, sits behind sticky status/nav */}
        <div className="relative text-white pt-[20px] pb-[40px] -mt-[110px]" style={{ background: heroGradient }}>
          {/* Spacer for status + nav heights so hero fills top */}
          <div className="h-[110px]" />

          {(isOverdue || isLocked) && (
            <div className="mx-[22px] mb-[16px] px-[14px] py-[12px] rounded-14 bg-white/15 backdrop-blur flex items-start gap-[10px]">
              {isOverdue ? <AlertTriangle size={18} className="text-white shrink-0 mt-[1px]" /> : <Lock size={18} className="text-white shrink-0 mt-[1px]" />}
              <div>
                <p className="text-sm font-semibold leading-5 text-white">
                  {isOverdue ? "Trễ hạn 4 ngày · Phí phạt 150.000 ₫" : "Tài khoản đang bị khóa"}
                </p>
                <p className="text-xs leading-5 text-white/80 mt-[2px]">
                  {isOverdue ? "Trả ngay để tránh ảnh hưởng điểm tín dụng CIC." : "Phát hiện giao dịch bất thường. Liên hệ CSKH."}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-center mt-[8px]">
            <LimitRing used={used} total={total} heroMode />
          </div>

          <div className="mt-[24px] text-center">
            <p className="text-sm leading-5 text-white/70">Hạn mức còn lại</p>
            <p className="text-[32px] font-black leading-[40px] tracking-[-0.02em] text-white mt-[2px]">
              {formatVnd(remaining)} ₫
            </p>
            <p className="text-xs leading-5 text-white/70 mt-[4px]">
              / {formatVnd(total)} ₫ tổng hạn mức
            </p>
          </div>

          <div className="absolute top-[80px] right-[-60px] w-[180px] h-[180px] rounded-full opacity-40 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)" }} />
          <div className="absolute bottom-[-40px] left-[-30px] w-[140px] h-[140px] rounded-full opacity-30 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(192,132,252,0.5) 0%, transparent 70%)" }} />
        </div>

        {/* Next payment card — overlaps hero using transform (no overflow clip since container is the card itself) */}
        <div className="px-[22px] mt-[-24px] relative z-10">
          <button
            onClick={() => router.push("/bnpl/repay")}
            className={`w-full rounded-28 px-[20px] py-[20px] text-left shadow-[0_12px_40px_rgba(0,0,0,0.15)] ${isOverdue ? "bg-danger text-white" : "bg-foreground text-background"}`}
          >
            <div className="flex items-center justify-between mb-[8px]">
              <p className={`text-xs font-semibold uppercase tracking-[0.1em] ${isOverdue ? "text-white/80" : "text-background/70"}`}>
                {isOverdue ? "CẦN TRẢ NGAY" : "KỲ TRẢ KẾ TIẾP"}
              </p>
              <span className={`text-xs font-semibold ${isOverdue ? "text-white/80" : "text-background/70"}`}>{nextPayment.date}</span>
            </div>
            <div className="flex items-end justify-between">
              <p className={`text-[30px] font-black leading-[38px] tracking-[-0.02em] ${isOverdue ? "text-white" : "text-background"}`}>
                {formatVnd(nextPayment.amount)} ₫
              </p>
              <div className={`flex items-center gap-1 ${isOverdue ? "text-white" : "text-background"}`}>
                <span className="text-sm font-semibold">Trả ngay</span>
                <ChevronRight size={18} />
              </div>
            </div>
          </button>
        </div>

        {/* Active loans */}
        <div className="pt-[32px]">
          <div className="px-[22px] pb-[12px] flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-foreground-secondary">
              Khoản vay đang hoạt động
            </p>
            <span className="text-xs font-semibold text-foreground-secondary">{loans.length} khoản</span>
          </div>
          <div className="px-[22px] flex flex-col gap-[8px]">
            {loans.map((l) => (
              <button
                key={l.id}
                onClick={() => router.push(`/bnpl/loan?id=${l.id}`)}
                className="w-full bg-secondary rounded-14 px-[14px] py-[14px] flex items-center gap-[12px]"
              >
                <div className="w-11 h-11 rounded-full bg-background flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-foreground">{l.merchant.slice(0, 2).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-md font-semibold leading-6 text-foreground truncate">{l.merchant}</p>
                  <p className="text-xs leading-4 text-foreground-secondary">
                    Kỳ {l.installments} · {l.next}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-semibold leading-5 ${l.status === "overdue" ? "text-danger" : "text-foreground"}`}>
                    {formatVnd(l.perMonth)} ₫
                  </p>
                  {l.status === "overdue" && <p className="text-xs font-semibold text-danger">Trễ hạn</p>}
                </div>
                <ChevronRight size={16} className="text-foreground-secondary shrink-0" />
              </button>
            ))}
          </div>
        </div>

        <div className="pt-[24px] px-[22px]">
          <div className="flex gap-[8px]">
            <button className="flex-1 bg-secondary rounded-14 py-[14px] text-center">
              <p className="text-sm font-semibold text-foreground">Tải sao kê</p>
            </button>
            <button className="flex-1 bg-secondary rounded-14 py-[14px] text-center">
              <p className="text-sm font-semibold text-foreground">Lịch sử giao dịch</p>
            </button>
          </div>
        </div>
      </div>

      <FixedBottom>
        <Button
          variant="primary"
          size="48"
          className="w-full"
          disabled={isLocked}
          onClick={() => router.push("/bnpl/checkout/source")}
        >
          {isLocked ? "Tài khoản bị khóa" : "Dùng ví trả sau"}
        </Button>
        <div className="flex justify-center pt-[8px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </FixedBottom>
    </div>
  )
}
