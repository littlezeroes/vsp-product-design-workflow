"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Receipt,
  Plane,
  Users,
  Wallet,
  Pencil,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* VSP Onboarding — 2 step, intent-based, guideline-rich
 * Step 1: "Bạn lo gì về tiền?" — pick 1-3 intents
 * Step 2: Preview Hũ → Tạo và bắt đầu
 *
 * Intent = pain user CÓ THẬT (Bills lo quên, Tiền lẻ tiêu mất...)
 * → mapping sang Hũ với outcome rõ ràng
 */

type IntentId = "bills" | "travel" | "shared"

type Intent = {
  id: IntentId
  emoji: string
  title: string
  sub: string
  hu: { icon: React.ElementType; name: string; pre: string }
}

const INTENTS: Intent[] = [
  {
    id: "bills",
    emoji: "🧾",
    title: "Bill tự lo",
    sub: "Hóa đơn, học phí — auto trừ đúng hạn",
    hu: { icon: Receipt, name: "Hóa đơn", pre: "Vinhomes · EVN · Vinschool · Smart billing" },
  },
  {
    id: "travel",
    emoji: "✈️",
    title: "Đi lại",
    sub: "Du lịch, GreenSM, sạc xe",
    hu: { icon: Plane, name: "Đi lại", pre: "Vé · GreenSM · Vinfast charge" },
  },
  {
    id: "shared",
    emoji: "👨‍👩‍👧",
    title: "Tiền chung",
    sub: "Gia đình, nhóm bạn, chia bill",
    hu: { icon: Users, name: "Quỹ chung", pre: "Members · phân quyền · chia bill" },
  },
]

function StatusBar() {
  return (
    <div className="h-[44px] w-full flex items-center px-6 text-foreground">
      <span className="text-[14px] font-semibold leading-none flex-1">9:41</span>
      <div className="flex items-center gap-[6px]">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="0.5" />
          <rect x="4" y="5" width="3" height="7" rx="0.5" />
          <rect x="8" y="2" width="3" height="10" rx="0.5" />
          <rect x="12" y="0" width="3" height="12" rx="0.5" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 9.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="currentColor" />
          <path d="M4.5 7.5a5 5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M2 5a8 8 0 0 1 12 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <div className="flex items-center gap-[1px]">
          <div className="w-[22px] h-[10px] rounded-[3px] border border-current flex items-center p-[1px]">
            <div className="flex-1 h-full bg-current rounded-[1.5px]" />
          </div>
        </div>
      </div>
    </div>
  )
}

function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = React.useState<1 | 2>(1)
  const [picked, setPicked] = React.useState<Set<IntentId>>(new Set())

  const toggle = (id: IntentId) => {
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selected = INTENTS.filter((i) => picked.has(i.id))

  const goNext = () => {
    if (step === 1) {
      if (picked.size === 0) return
      setStep(2)
    } else {
      try {
        sessionStorage.setItem(
          "vsp-onboarding-picks",
          JSON.stringify(Array.from(picked))
        )
      } catch {}
      router.push("/vsp-home")
    }
  }

  const goBack = () => {
    if (step === 2) setStep(1)
    else router.back()
  }

  return (
    <div className="relative w-full max-w-[390px] mx-auto min-h-screen flex flex-col bg-background">
      <StatusBar />

      {/* Top nav */}
      <div className="px-[16px] h-[48px] flex items-center justify-between">
        <button
          onClick={goBack}
          className="p-[10px] -ml-[10px] rounded-full active:bg-secondary"
          aria-label="Quay lại"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        {/* 2-dot progress */}
        <div className="flex items-center gap-[6px]">
          <div className={cn("h-[4px] rounded-full transition-all", step >= 1 ? "w-[24px] bg-foreground" : "w-[16px] bg-secondary")} />
          <div className={cn("h-[4px] rounded-full transition-all", step >= 2 ? "w-[24px] bg-foreground" : "w-[16px] bg-secondary")} />
        </div>
        <button
          onClick={() => router.push("/vsp-home")}
          className="text-[13px] font-medium text-foreground-secondary px-[10px] -mr-[10px]"
        >
          Bỏ qua
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col px-[22px] pt-[24px] pb-[24px]">
        {step === 1 ? (
          <StepPick picked={picked} onToggle={toggle} />
        ) : (
          <StepPreview selected={selected} />
        )}
      </div>

      {/* FIXED CTA */}
      <div className="px-[22px] pt-[12px] pb-[16px] bg-background border-t border-border">
        <button
          onClick={goNext}
          disabled={step === 1 && picked.size === 0}
          className={cn(
            "w-full h-[52px] rounded-full font-semibold text-[15px] flex items-center justify-center gap-[8px] transition-all",
            (step === 1 && picked.size === 0)
              ? "bg-secondary text-foreground-secondary cursor-not-allowed"
              : "bg-foreground text-background active:opacity-80"
          )}
        >
          {step === 1
            ? picked.size === 0
              ? "Chọn ít nhất 1"
              : "Tiếp tục"
            : "Bắt đầu"}
          {(step === 2 || picked.size > 0) && <ArrowRight size={18} />}
        </button>
        <div className="pt-[10px] flex justify-center">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </div>
    </div>
  )
}

/* ────────── STEP 1: PICK INTENTS ────────── */
function StepPick({
  picked,
  onToggle,
}: {
  picked: Set<IntentId>
  onToggle: (id: IntentId) => void
}) {
  return (
    <>
      <h1 className="text-[28px] font-bold leading-[34px] text-foreground">
        Bắt đầu với cái gì?
      </h1>
      <p className="text-[14px] leading-[20px] text-foreground-secondary mt-[4px]">
        Chọn cái cần · đổi sau được
      </p>

      <div className="mt-[20px] flex flex-col gap-[8px]">
        {INTENTS.map((it) => {
          const isPicked = picked.has(it.id)
          return (
            <button
              key={it.id}
              onClick={() => onToggle(it.id)}
              className={cn(
                "w-full rounded-[14px] p-[14px] flex items-center gap-[12px] text-left transition-all",
                isPicked
                  ? "bg-foreground text-background"
                  : "bg-background border border-border active:bg-secondary"
              )}
            >
              <span className="text-[24px] leading-none shrink-0 w-[32px] text-center">{it.emoji}</span>

              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold leading-[18px]">{it.title}</p>
                <p className={cn(
                  "text-[12px] leading-[15px] mt-[2px]",
                  isPicked ? "opacity-65" : "text-foreground-secondary"
                )}>
                  {it.sub}
                </p>
              </div>

              <div
                className={cn(
                  "w-[22px] h-[22px] rounded-full shrink-0 flex items-center justify-center transition-all",
                  isPicked ? "bg-background text-foreground" : "border-[1.5px] border-border"
                )}
              >
                {isPicked && <Check size={13} strokeWidth={3} />}
              </div>
            </button>
          )
        })}
      </div>
    </>
  )
}

/* ────────── STEP 2: PREVIEW ────────── */
function StepPreview({ selected }: { selected: Intent[] }) {
  const total = selected.length + 1
  return (
    <>
      <h1 className="text-[28px] font-bold leading-[34px] text-foreground">
        {total} Hũ sẵn sàng
      </h1>
      <p className="text-[14px] leading-[20px] text-foreground-secondary mt-[4px]">
        Đổi tên · điều chỉnh sau
      </p>

      <div className="mt-[20px] flex flex-col gap-[8px]">
        <div className="rounded-[14px] bg-foreground text-background p-[14px] flex items-center gap-[12px]">
          <div className="w-[36px] h-[36px] rounded-[10px] bg-background/10 flex items-center justify-center shrink-0">
            <Wallet size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold">Tài khoản chính</p>
            <p className="text-[11px] opacity-70 mt-[1px]">Mặc định · everyday</p>
          </div>
        </div>

        {selected.map((it) => {
          const Icon = it.hu.icon
          return (
            <div
              key={it.id}
              className="rounded-[14px] bg-background border border-border p-[14px] flex items-center gap-[12px]"
            >
              <div className="w-[36px] h-[36px] rounded-[10px] bg-secondary flex items-center justify-center shrink-0">
                <Icon size={18} className="text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-foreground">{it.hu.name}</p>
                <p className="text-[11px] text-foreground-secondary mt-[1px]">{it.hu.pre}</p>
              </div>
              <Pencil size={14} className="text-foreground-secondary" />
            </div>
          )
        })}
      </div>

      <div className="mt-[16px] rounded-[12px] bg-secondary p-[12px]">
        <p className="text-[11px] leading-[16px] text-foreground">
          Có sẵn: Sinh lời 5.6% · Mời bạn nhận thưởng · Chia bill nhanh
        </p>
      </div>
    </>
  )
}

export default OnboardingPage
