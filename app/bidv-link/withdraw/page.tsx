"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, Delete } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"

/* ── Helpers ───────────────────────────────────────────────────── */
function formatVND(value: number): string {
  if (value === 0) return "0"
  return value.toLocaleString("vi-VN")
}

function formatChip(value: number): string {
  return value.toLocaleString("vi-VN")
}

const QUICK_AMOUNTS = [100000, 200000, 500000]

/* ── Tab Switcher (pill toggle) ────────────────────────────────── */
function TabSwitcher({ active }: { active: "deposit" | "withdraw" }) {
  const router = useRouter()
  return (
    <div className="flex items-center justify-center py-[8px]">
      <div className="flex items-center bg-secondary rounded-full p-[3px]">
        <button
          type="button"
          onClick={() => router.replace("/bidv-link/deposit")}
          className={`px-[16px] py-[6px] rounded-full text-sm font-semibold leading-5 transition-colors ${
            active === "deposit"
              ? "bg-foreground text-background"
              : "text-foreground"
          }`}
        >
          Nạp tiền
        </button>
        <button
          type="button"
          onClick={() => router.replace("/bidv-link/withdraw")}
          className={`px-[16px] py-[6px] rounded-full text-sm font-semibold leading-5 transition-colors ${
            active === "withdraw"
              ? "bg-foreground text-background"
              : "text-foreground"
          }`}
        >
          Rút tiền
        </button>
      </div>
    </div>
  )
}

/* ── Bank Destination Card ─────────────────────────────────────── */
function BankDestCard() {
  return (
    <div className="px-[22px]">
      <p className="text-xs font-normal leading-5 text-foreground-secondary mb-[8px]">
        Rút tiền về
      </p>
      <div className="bg-secondary rounded-[14px] px-[14px] py-[12px] flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
          <span className="text-[10px] font-bold text-foreground">TCB</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-5 text-foreground">Techcombank</p>
        </div>
      </div>
    </div>
  )
}

/* ── Custom Numpad ─────────────────────────────────────────────── */
function Numpad({ onInput }: { onInput: (key: string) => void }) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "000", "0", "backspace"]
  return (
    <div className="grid grid-cols-3">
      {keys.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onInput(key)}
          className="h-[52px] flex items-center justify-center text-[20px] font-semibold text-foreground active:bg-secondary rounded-[8px] transition-colors"
        >
          {key === "backspace" ? (
            <Delete size={24} className="text-foreground" />
          ) : (
            key
          )}
        </button>
      ))}
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────── */
function WithdrawContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "empty"

  const [amount, setAmount] = React.useState(
    state === "valid" ? 200000 : state === "quick-select" ? 100000 : 0
  )
  const [isLoading, setIsLoading] = React.useState(state === "loading")

  const walletBalance = 125000

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
      setAmount((prev) => {
        const next = prev * 1000
        return next > 999999999 ? prev : next
      })
    } else {
      setAmount((prev) => {
        const next = prev * 10 + parseInt(digit)
        return next > 999999999 ? prev : next
      })
    }
  }

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      {/* Header: default variant with back arrow */}
      <Header
        variant="default"
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

      {/* Tab switcher */}
      <TabSwitcher active="withdraw" />

      <div className="flex-1 flex flex-col pb-[100px]">
        {/* Balance display — centered */}
        <div className="px-[22px] pt-[16px] flex justify-center">
          <p className="text-sm font-normal leading-5 text-foreground-secondary">
            Số dư ví{" "}
            <span className="font-bold text-foreground-secondary">{formatVND(walletBalance)}đ</span>
          </p>
        </div>

        {/* Bank destination card */}
        <div className="pt-[20px]">
          <BankDestCard />
        </div>

        {/* Amount display */}
        <div className="px-[22px] pt-[24px] flex flex-col items-center">
          <div className="flex items-center gap-[2px]">
            <p className="text-[40px] font-bold tabular-nums text-foreground leading-tight">
              {amount === 0 ? "0" : formatVND(amount)}đ
            </p>
            {/* Blue cursor line */}
            <div className="w-[2px] h-[36px] bg-info animate-pulse rounded-full" />
          </div>
          {error && (
            <p className="text-xs font-normal leading-5 text-danger mt-[4px]">{error}</p>
          )}
        </div>

        {/* Quick amount chips */}
        <div className="pt-[24px]">
          <div className="px-[22px]">
            <div className="flex gap-[8px] justify-center">
              {QUICK_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`px-[16px] py-[8px] rounded-full text-sm font-semibold leading-5 transition-colors ${
                    amount === val
                      ? "bg-foreground text-background"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {formatChip(val)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Numpad */}
        <div className="pt-[32px] mt-auto">
          <div className="px-[22px]">
            <Numpad onInput={handleAmountInput} />
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

export default function WithdrawPage() {
  return (
    <React.Suspense fallback={null}>
      <WithdrawContent />
    </React.Suspense>
  )
}
