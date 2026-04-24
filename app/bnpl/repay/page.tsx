"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, Wallet } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import { FixedBottom } from "@/components/ui/fixed-bottom"
import { Radio } from "@/components/ui/radio"

/**
 * S11: Thanh toán dư nợ
 * States: default (partial mode), full, insufficient
 */

const PER_MONTH = 637_350
const TOTAL_DEBT = 3_600_000

function formatVnd(n: number) {
  return Math.round(n).toLocaleString("vi-VN")
}

export default function RepayPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "default"
  const [mode, setMode] = React.useState<"current" | "full" | "custom">(state === "full" ? "full" : "current")
  const [custom, setCustom] = React.useState("1000000")
  const walletBal = state === "insufficient" ? 240_000 : 2_450_000

  const amount = mode === "current" ? PER_MONTH : mode === "full" ? TOTAL_DEBT : parseInt(custom.replace(/\D/g, ""), 10) || 0
  const insufficient = amount > walletBal

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header
        variant="large-title"
        largeTitle="Thanh toán dư nợ"
        description="VinMart+ · Kỳ 2/3"
        leading={
          <button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full">
            <ChevronLeft size={18} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto pb-[240px]">
        {/* Amount options */}
        <div className="px-[22px] pt-[16px]">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-[12px]">
            Số tiền trả
          </p>
          <div className="flex flex-col gap-[8px]">
            {[
              { id: "current" as const, label: "Trả kỳ này", meta: "Kỳ 2/3 — hạn 20/05/2026", amount: PER_MONTH },
              { id: "full" as const, label: "Tất toán toàn bộ", meta: "Đóng khoản vay này", amount: TOTAL_DEBT },
              { id: "custom" as const, label: "Số khác", meta: "Bạn tự nhập", amount: null },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setMode(opt.id)}
                className={`w-full flex items-center gap-[12px] px-[14px] py-[14px] rounded-14 border text-left ${
                  mode === opt.id ? "border-foreground" : "border-border"
                }`}
              >
                <Radio checked={mode === opt.id} />
                <div className="flex-1 min-w-0">
                  <p className="text-md font-semibold leading-6 text-foreground">{opt.label}</p>
                  <p className="text-xs leading-4 text-foreground-secondary">{opt.meta}</p>
                </div>
                {opt.amount !== null && (
                  <span className="text-sm font-semibold text-foreground shrink-0">
                    {formatVnd(opt.amount)} ₫
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Custom input */}
          {mode === "custom" && (
            <div className="mt-[12px] px-[14px] py-[14px] rounded-14 border border-grey-400">
              <p className="text-xs leading-5 text-foreground-secondary">Nhập số tiền (VND)</p>
              <input
                type="text"
                inputMode="numeric"
                value={custom}
                onChange={(e) => setCustom(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-transparent text-[24px] font-bold tracking-[-0.016em] text-foreground outline-none mt-[2px]"
                placeholder="0"
              />
            </div>
          )}
        </div>

        {/* Source */}
        <div className="pt-[32px]">
          <div className="px-[22px] pt-[24px] pb-[12px]">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
              Nguồn tiền
            </p>
          </div>
          <div className="px-[22px]">
            <div className="flex items-center gap-[12px] px-[14px] py-[14px] rounded-14 border border-foreground">
              <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <Wallet size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-md font-semibold leading-6 text-foreground">Ví V-Smart Pay</p>
                <p className={`text-xs leading-4 ${insufficient ? "text-danger" : "text-foreground-secondary"}`}>
                  Số dư {formatVnd(walletBal)} ₫
                  {insufficient && " · Không đủ"}
                </p>
              </div>
              <Radio checked />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="pt-[32px] px-[22px]">
          <div className="bg-secondary rounded-28 px-[16px] py-[16px]">
            <div className="flex items-center justify-between">
              <span className="text-sm leading-5 text-foreground-secondary">Số tiền trả</span>
              <span className="text-md font-bold text-foreground">{formatVnd(amount)} ₫</span>
            </div>
            <div className="flex items-center justify-between mt-[8px]">
              <span className="text-sm leading-5 text-foreground-secondary">Phí</span>
              <span className="text-sm font-semibold text-foreground">Miễn phí</span>
            </div>
            <div className="flex items-center justify-between mt-[12px] pt-[12px] border-t border-background">
              <span className="text-sm font-semibold text-foreground">Tổng trừ từ Ví</span>
              <span className="text-md font-bold text-foreground">{formatVnd(amount)} ₫</span>
            </div>
          </div>
        </div>

        {insufficient && (
          <div className="mt-[12px] px-[22px]">
            <p className="text-xs leading-5 text-danger">
              Số dư Ví không đủ. Vui lòng nạp thêm hoặc chọn số tiền nhỏ hơn.
            </p>
          </div>
        )}
      </div>

      <FixedBottom>
        <Button
          variant="primary"
          size="48"
          className="w-full"
          disabled={insufficient || amount <= 0}
          onClick={() => router.push("/bnpl/dashboard")}
        >
          Trả {formatVnd(amount)} ₫
        </Button>
        <div className="flex justify-center pt-[8px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </FixedBottom>
    </div>
  )
}
