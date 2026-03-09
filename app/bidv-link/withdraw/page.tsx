"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"

/* ── Helpers ───────────────────────────────────────────────────── */
function formatAmount(value: number): string {
  return value.toLocaleString("vi-VN") + "đ"
}

function BankDestCard() {
  return (
    <div className="bg-secondary rounded-[14px] px-[14px] py-[12px] flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
        <span className="text-[10px] font-bold text-foreground">BI</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-5 text-foreground">BIDV</p>
        <p className="text-xs font-normal leading-5 text-foreground-secondary">****1234</p>
      </div>
    </div>
  )
}

const QUICK_AMOUNTS = [100000, 200000, 500000, 1000000]

/* ── Page ──────────────────────────────────────────────────────── */
export default function WithdrawPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "empty"

  const [amount, setAmount] = React.useState(state === "valid" ? 200000 : 0)
  const [isLoading, setIsLoading] = React.useState(state === "loading")

  const walletBalance = 1500000

  const getError = () => {
    if (amount === 0) return undefined
    if (state === "error-min" || amount < 10000) return "Tối thiểu 10.000đ"
    if (state === "error-max" || amount > 50000000) return "Tối đa 50.000.000đ"
    if (state === "error-balance" || amount > walletBalance) return "Số dư ví không đủ"
    if (state === "error-daily") return "Vượt hạn mức ngày 100.000.000đ"
    if (state === "error-monthly") return "Vượt hạn mức tháng"
    return undefined
  }

  const error = getError()
  const isValid = amount >= 10000 && amount <= walletBalance && !error

  const handleContinue = () => {
    setIsLoading(true)
    setTimeout(() => {
      router.push("/bidv-link/withdraw-auth")
    }, 500)
  }

  const handleAmountInput = (digit: string) => {
    if (digit === "backspace") {
      setAmount((prev) => Math.floor(prev / 10))
    } else if (digit === "000") {
      setAmount((prev) => prev * 1000)
    } else {
      setAmount((prev) => prev * 10 + parseInt(digit))
    }
  }

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header
        variant="large-title"
        largeTitle="Rút tiền"
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

      <div className="flex-1 overflow-y-auto pb-[120px]">
        {/* Balance */}
        <div className="px-[22px] pt-[8px]">
          <p className="text-sm font-normal leading-5 text-foreground-secondary">
            Số dư ví: {formatAmount(walletBalance)}
          </p>
        </div>

        {/* Destination */}
        <div className="pt-[32px]">
          <div className="px-[22px]">
            <p className="text-xs font-normal leading-5 text-foreground-secondary mb-[8px]">Tài khoản nhận</p>
            <BankDestCard />
          </div>
        </div>

        {/* Amount input */}
        <div className="pt-[32px]">
          <div className="px-[22px] flex flex-col items-center">
            <p className="text-[40px] font-bold tabular-nums text-foreground leading-tight">
              {amount === 0 ? "0đ" : formatAmount(amount)}
            </p>
            {error && (
              <p className="text-xs font-normal leading-5 text-danger mt-[4px]">{error}</p>
            )}
          </div>
        </div>

        {/* Quick chips */}
        <div className="pt-[24px]">
          <div className="px-[22px]">
            <div className="flex gap-[8px] justify-center flex-wrap">
              {QUICK_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`px-[16px] py-[8px] rounded-full text-sm font-semibold leading-5 transition-colors ${
                    amount === val ? "bg-foreground text-background" : "bg-secondary text-foreground"
                  }`}
                >
                  {val >= 1000000 ? `${val / 1000000}M` : `${val / 1000}K`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Numpad */}
        <div className="pt-[32px]">
          <div className="px-[22px]">
            <div className="grid grid-cols-3 gap-[1px]">
              {["1","2","3","4","5","6","7","8","9","000","0","backspace"].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleAmountInput(key)}
                  className="h-[52px] flex items-center justify-center text-lg font-semibold text-foreground active:bg-secondary rounded-[8px] transition-colors"
                >
                  {key === "backspace" ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                      <line x1="18" y1="9" x2="12" y2="15" />
                      <line x1="12" y1="9" x2="18" y2="15" />
                    </svg>
                  ) : key}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed CTA */}
      <div className="absolute bottom-0 inset-x-0 bg-background px-[22px] pb-[34px] pt-[12px]">
        <Button
          variant="primary"
          size="48"
          className="w-full"
          disabled={!isValid || isLoading}
          isLoading={isLoading}
          onClick={handleContinue}
        >
          Tiếp tục
        </Button>
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}
