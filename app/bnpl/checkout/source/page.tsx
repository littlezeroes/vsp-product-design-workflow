"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, Wallet, CreditCard, Building2, Sparkles } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import { FixedBottom } from "@/components/ui/fixed-bottom"
import { Radio } from "@/components/ui/radio"

/**
 * S6: Chọn nguồn thanh toán (at checkout, with BNPL option)
 * States: default, bnpl-selected, bnpl-maxed (no limit left)
 */
const SOURCES = [
  { id: "wallet", label: "Ví V-Smart Pay", meta: "Số dư 2.450.000 ₫", Icon: Wallet },
  { id: "bank", label: "BIDV •• 4321", meta: "Ngân hàng liên kết", Icon: Building2 },
  { id: "card", label: "VISA •• 8812", meta: "Thẻ quốc tế", Icon: CreditCard },
]

export default function CheckoutSourcePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "default"
  const bnplMaxed = state === "bnpl-maxed"
  const bnplHigh = state === "bnpl-high"

  const [selected, setSelected] = React.useState(state === "bnpl-selected" ? "bnpl" : "wallet")

  const limit = bnplMaxed ? 0 : bnplHigh ? 2500000 : 12800000
  const usedPct = bnplMaxed ? 100 : bnplHigh ? 83 : 15

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header
        variant="large-title"
        largeTitle="Phương thức thanh toán"
        leading={
          <button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full">
            <ChevronLeft size={18} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto pb-[240px]">
        {/* Order summary */}
        <div className="px-[22px] pt-[16px]">
          <div className="bg-secondary rounded-28 px-[16px] py-[16px]">
            <div className="flex items-center justify-between mb-[8px]">
              <span className="text-sm leading-5 text-foreground-secondary">Đơn hàng tại VinMart+</span>
            </div>
            <p className="text-[28px] font-bold leading-9 tracking-[-0.016em] text-foreground">
              1.890.000 ₫
            </p>
          </div>
        </div>

        {/* BNPL highlighted card */}
        <div className="px-[22px] pt-[24px]">
          <div className="flex items-center gap-2 mb-[10px]">
            <Sparkles size={14} className="text-foreground-secondary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
              Trả sau — lãi suất từ 0%
            </span>
          </div>
          <button
            onClick={() => !bnplMaxed && setSelected("bnpl")}
            disabled={bnplMaxed}
            className={`w-full rounded-28 border-2 px-[16px] py-[16px] text-left transition-colors ${
              selected === "bnpl" ? "border-foreground bg-secondary" : "border-border bg-background"
            } ${bnplMaxed ? "opacity-50" : ""}`}
          >
            <div className="flex items-center gap-[12px]">
              <div className="w-11 h-11 rounded-full bg-foreground flex items-center justify-center shrink-0">
                <span className="text-background text-xs font-bold">BNPL</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-md font-semibold leading-6 text-foreground">Ví trả sau</p>
                <p className="text-sm leading-5 text-foreground-secondary">
                  {bnplMaxed ? "Hết hạn mức khả dụng" : `Còn ${(limit / 1_000_000).toFixed(1)} triệu khả dụng`}
                </p>
              </div>
              <Radio checked={selected === "bnpl"} disabled={bnplMaxed} />
            </div>

            {/* Limit bar */}
            <div className="mt-[12px]">
              <div className="h-[4px] rounded-full bg-background overflow-hidden">
                <div
                  className={`h-full ${usedPct > 80 ? "bg-danger" : usedPct > 50 ? "bg-foreground" : "bg-success"}`}
                  style={{ width: `${usedPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-[6px]">
                <span className="text-xs leading-5 text-foreground-secondary">Đã dùng {usedPct}%</span>
                <span className="text-xs leading-5 text-foreground-secondary">Tổng 15.000.000 ₫</span>
              </div>
            </div>
          </button>
        </div>

        {/* Other sources */}
        <div className="pt-[32px]">
          <div className="px-[22px] pt-[24px] pb-[12px]">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
              Nguồn khác
            </p>
          </div>
          <div className="px-[22px] flex flex-col gap-[8px]">
            {SOURCES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelected(s.id)}
                className={`w-full flex items-center gap-[12px] px-[14px] py-[12px] rounded-14 border ${
                  selected === s.id ? "border-foreground" : "border-border"
                }`}
              >
                <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <s.Icon size={20} className="text-foreground" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-md font-semibold leading-6 text-foreground">{s.label}</p>
                  <p className="text-sm leading-5 text-foreground-secondary truncate">{s.meta}</p>
                </div>
                <Radio checked={selected === s.id} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <FixedBottom>
        <Button
          variant="primary"
          size="48"
          className="w-full"
          onClick={() => {
            if (selected === "bnpl") router.push("/bnpl/checkout/tenor")
            else router.push("/bnpl/checkout/result?status=success")
          }}
        >
          Tiếp tục
        </Button>
        <div className="flex justify-center pt-[8px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </FixedBottom>
    </div>
  )
}
