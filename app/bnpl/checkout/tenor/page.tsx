"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, Info } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import { FixedBottom } from "@/components/ui/fixed-bottom"

/**
 * S7: Chọn kỳ hạn + Breakdown realtime
 * States: tenor-1 (default, 0% lãi), tenor-3, tenor-6, tenor-12
 */
const AMOUNT = 1_890_000
const FEE_RATE = 0.005

const TENORS = [
  { months: 1, rate: 0, label: "1 tháng", badge: "0% lãi" },
  { months: 3, rate: 0.015, label: "3 tháng", badge: null },
  { months: 6, rate: 0.015, label: "6 tháng", badge: null },
  { months: 12, rate: 0.015, label: "12 tháng", badge: null },
]

function formatVnd(n: number) {
  return Math.round(n).toLocaleString("vi-VN")
}

function calcSchedule(months: number, rate: number) {
  const principal = AMOUNT
  const fee = principal * FEE_RATE
  const interest = principal * rate * months
  const total = principal + interest + fee
  const perMonth = total / months
  return { principal, fee, interest, total, perMonth }
}

export default function TenorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preset = parseInt(searchParams.get("state")?.replace("tenor-", "") ?? "1", 10)
  const [selected, setSelected] = React.useState<number>([1, 3, 6, 12].includes(preset) ? preset : 1)

  const tenor = TENORS.find((t) => t.months === selected)!
  const sched = calcSchedule(selected, tenor.rate)

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header
        variant="large-title"
        largeTitle="Chọn kỳ hạn"
        description={`Khoản cần trả ${formatVnd(AMOUNT)} ₫`}
        leading={
          <button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full">
            <ChevronLeft size={18} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto pb-[240px]">
        {/* Tenor picker */}
        <div className="px-[22px] pt-[16px]">
          <div className="grid grid-cols-4 gap-[8px]">
            {TENORS.map((t) => {
              const isActive = selected === t.months
              return (
                <button
                  key={t.months}
                  onClick={() => setSelected(t.months)}
                  className={`flex flex-col items-center py-[14px] rounded-14 border-2 transition-colors ${
                    isActive ? "border-foreground bg-secondary" : "border-border bg-background"
                  }`}
                >
                  <span className="text-[22px] font-bold leading-7 text-foreground">{t.months}</span>
                  <span className="text-xs leading-4 text-foreground-secondary mt-[2px]">tháng</span>
                  {t.badge && (
                    <span className="mt-[6px] text-[10px] font-bold uppercase tracking-wider text-success">
                      {t.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Per-month amount — hero */}
        <div className="px-[22px] pt-[32px]">
          <p className="text-sm leading-5 text-foreground-secondary mb-[6px]">Mỗi kỳ bạn trả</p>
          <p className="text-[36px] font-bold leading-[44px] tracking-[-0.02em] text-foreground">
            {formatVnd(sched.perMonth)} ₫
          </p>
          <p className="text-sm leading-5 text-foreground-secondary mt-[6px]">
            × {selected} kỳ · Tổng {formatVnd(sched.total)} ₫
          </p>
        </div>

        {/* Breakdown */}
        <div className="pt-[32px]">
          <div className="px-[22px] pt-[24px] pb-[12px]">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
              Chi tiết
            </p>
          </div>
          <div className="px-[22px]">
            {[
              ["Tiền gốc", formatVnd(sched.principal) + " ₫"],
              ["Phí xử lý (0.5%)", formatVnd(sched.fee) + " ₫"],
              ["Lãi (" + (tenor.rate * 100).toFixed(1) + "% / tháng)", formatVnd(sched.interest) + " ₫"],
              ["Tổng phải trả", formatVnd(sched.total) + " ₫"],
            ].map(([k, v], i) => {
              const isTotal = i === 3
              return (
                <div
                  key={k}
                  className={`flex items-center justify-between py-[12px] ${
                    isTotal ? "border-t border-border pt-[16px] mt-[4px]" : "border-b border-border"
                  }`}
                >
                  <span className={`text-sm leading-5 ${isTotal ? "font-semibold text-foreground" : "text-foreground-secondary"}`}>
                    {k}
                  </span>
                  <span className={`text-sm leading-5 ${isTotal ? "font-bold text-foreground text-md" : "font-semibold text-foreground"}`}>
                    {v}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Schedule preview */}
        <div className="pt-[32px]">
          <div className="px-[22px] pt-[24px] pb-[12px]">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
              Lịch trả nợ dự kiến
            </p>
          </div>
          <div className="px-[22px]">
            {Array.from({ length: selected }).map((_, i) => {
              const date = new Date(2026, 3 + i + 1, 20)
              const label = `${date.getDate()}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`
              return (
                <div key={i} className="flex items-center justify-between py-[12px] border-b border-border last:border-b-0">
                  <div>
                    <p className="text-sm font-semibold leading-5 text-foreground">Kỳ {i + 1}</p>
                    <p className="text-xs leading-4 text-foreground-secondary mt-[2px]">{label}</p>
                  </div>
                  <span className="text-sm font-semibold leading-5 text-foreground">
                    {formatVnd(sched.perMonth)} ₫
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Notice */}
        <div className="px-[22px] pt-[24px]">
          <div className="flex items-start gap-[10px] px-[14px] py-[12px] bg-secondary rounded-14">
            <Info size={18} className="text-foreground-secondary shrink-0 mt-[1px]" />
            <p className="text-xs leading-5 text-foreground-secondary">
              Kỳ tiếp theo sẽ được tự động trừ từ Ví vào ngày 20 mỗi tháng. Bạn có thể tắt auto-debit trong Cài đặt.
            </p>
          </div>
        </div>
      </div>

      <FixedBottom>
        <Button variant="primary" size="48" className="w-full" onClick={() => router.push("/bnpl/checkout/result?status=success")}>
          Xác nhận và thanh toán
        </Button>
        <div className="flex justify-center pt-[8px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </FixedBottom>
    </div>
  )
}
