"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Building2 } from "lucide-react"
import { Header } from "@/components/ui/header"
import { FeedbackState } from "@/components/ui/feedback-state"

/* ── Bank data ────────────────────────────────────────────────── */
const BANKS = [
  { id: "bidv", name: "BIDV", fullName: "Ngân hàng TMCP Đầu tư và Phát triển VN", colorClass: "bg-danger" },
  { id: "vcb", name: "Vietcombank", fullName: "Ngân hàng TMCP Ngoại thương VN", colorClass: "bg-success" },
  { id: "tcb", name: "Techcombank", fullName: "Ngân hàng TMCP Kỹ thương VN", colorClass: "bg-danger" },
  { id: "tpb", name: "TPBank", fullName: "Ngân hàng TMCP Tiên Phong", colorClass: "bg-info" },
]

/* ── Bank Logo ────────────────────────────────────────────────── */
function BankLogo({ name, colorClass }: { name: string; colorClass: string }) {
  return (
    <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center ${colorClass}`}>
      <span className="text-[11px] font-bold text-white">{name.slice(0, 2).toUpperCase()}</span>
    </div>
  )
}

/* ── Step Indicator ────────────────────────────────────────────── */
function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-[6px] px-[22px] pb-[8px]">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-[4px] flex-1 rounded-full ${i < step ? "bg-foreground" : "bg-secondary"}`}
        />
      ))}
    </div>
  )
}

/* ── Bank Card ────────────────────────────────────────────────── */
function BankCard({
  bank,
  onPress,
}: {
  bank: (typeof BANKS)[number]
  onPress: () => void
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="w-full flex items-center gap-[12px] bg-secondary rounded-[28px] p-[16px] text-left active:opacity-80 transition-opacity"
    >
      <BankLogo name={bank.name} colorClass={bank.colorClass} />
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold leading-5 text-foreground">{bank.name}</p>
        <p className="text-[13px] font-normal leading-[18px] text-foreground-secondary truncate">{bank.fullName}</p>
      </div>
      <ChevronRight size={18} className="text-foreground-secondary shrink-0" />
    </button>
  )
}

/* ── Page ──────────────────────────────────────────────────────── */
function BankListContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "loaded"

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header
        variant="large-title"
        largeTitle="Liên kết ngân hàng"
        leading={
          <button
            type="button"
            onClick={() => router.back()}
            className="w-[44px] h-[44px] flex items-center justify-center rounded-full"
          >
            <ChevronLeft size={18} className="text-foreground" />
          </button>
        }
      />

      <StepIndicator step={1} total={3} />

      <div className="flex-1 overflow-y-auto pb-[21px]">
        {state === "loading" && (
          <div className="pt-[32px] px-[22px] space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[72px] bg-secondary rounded-[28px] animate-pulse" />
            ))}
          </div>
        )}

        {state === "error" && (
          <div className="pt-[32px] px-[22px]">
            <FeedbackState
              icon={
                <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center">
                  <Building2 size={32} className="text-danger" />
                </div>
              }
              title="Không thể tải danh sách"
              description="Vui lòng kiểm tra kết nối và thử lại."
              actionLabel="Thử lại"
              actionProps={{ onClick: () => router.refresh() }}
            />
          </div>
        )}

        {state === "empty" && (
          <div className="pt-[32px] px-[22px]">
            <FeedbackState
              icon={
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                  <Building2 size={32} className="text-success" />
                </div>
              }
              title="Bạn đã liên kết tất cả ngân hàng hỗ trợ"
            />
          </div>
        )}

        {state === "loaded" && (
          <div className="pt-[32px]">
            <p className="px-[22px] text-[13px] font-semibold leading-[18px] text-foreground-secondary uppercase tracking-wide mb-[12px]">
              Chọn ngân hàng
            </p>
            <div className="px-[22px] space-y-3">
              {BANKS.map((bank) => (
                <BankCard
                  key={bank.id}
                  bank={bank}
                  onPress={() => {
                    if (bank.id === "bidv") {
                      router.push("/bidv-link/bidv-form")
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] bg-background pointer-events-none">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}

export default function BankListPage() {
  return (
    <React.Suspense fallback={null}>
      <BankListContent />
    </React.Suspense>
  )
}
