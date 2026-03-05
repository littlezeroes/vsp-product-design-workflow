"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, X, Delete, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BottomSheet } from "@/components/ui/bottom-sheet"
import { MOCK_BALANCE, SINHLOI_LIMITS, formatVND } from "../data"

type Tab = "deposit" | "withdraw"

function getSmartChips(amount: number): number[] {
  if (amount === 0) return [100_000, 200_000, 500_000]
  const suggestions: number[] = []
  const x10 = amount * 10
  const x100 = amount * 100
  const x1000 = amount * 1000
  if (x10 <= 999_999_999 && x10 >= 1_000) suggestions.push(x10)
  if (x100 <= 999_999_999 && x100 >= 1_000) suggestions.push(x100)
  if (x1000 <= 999_999_999 && x1000 >= 1_000) suggestions.push(x1000)
  if (suggestions.length === 0) return [100_000, 200_000, 500_000]
  if (suggestions.length === 1) return [suggestions[0], 200_000, 500_000]
  if (suggestions.length === 2) return [suggestions[0], suggestions[1], 500_000]
  return suggestions.slice(0, 3)
}

function formatAmount(n: number): string {
  if (n === 0) return "0"
  return n.toLocaleString("vi-VN")
}

function DepositContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") === "withdraw" ? "withdraw" : "deposit"

  const [tab, setTab] = React.useState<Tab>(initialTab)
  const [amount, setAmount] = React.useState(0)
  const [balanceHidden, setBalanceHidden] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)

  const balance = MOCK_BALANCE.balance
  const limits = SINHLOI_LIMITS

  const isValid = tab === "deposit"
    ? amount >= limits.minDeposit && amount <= limits.maxDeposit
    : amount >= limits.minWithdraw && amount <= limits.maxWithdraw && amount <= balance

  function pressDigit(d: string) {
    setAmount((prev) => {
      const str = prev === 0 ? d : String(prev) + d
      const n = Number(str)
      if (n > 999_999_999) return prev
      return n
    })
  }

  function pressDelete() {
    setAmount((prev) => {
      const str = String(prev)
      if (str.length <= 1) return 0
      return Number(str.slice(0, -1))
    })
  }

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "000", "0", "del"]
  const chips = getSmartChips(amount)

  const contextParam = tab === "deposit" ? "deposit" : "withdraw"

  return (
    <div className="min-h-screen bg-grey-100 dark:bg-grey-900 flex flex-col items-center">
      <div className="relative w-[390px] h-[844px] bg-background text-foreground flex flex-col rounded-[40px] shadow-xl overflow-hidden mt-[16px]">

        {/* Status bar */}
        <div className="w-full shrink-0 flex items-center px-6 h-[44px]" aria-hidden="true">
          <span className="text-[17px] font-semibold leading-none text-foreground flex-1">9:41</span>
          <div className="flex items-center gap-[6px]">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor" className="text-foreground">
              <rect x="0" y="8" width="3" height="4" rx="0.5" />
              <rect x="4" y="5" width="3" height="7" rx="0.5" />
              <rect x="8" y="2" width="3" height="10" rx="0.5" />
              <rect x="12" y="0" width="3" height="12" rx="0.5" />
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="text-foreground">
              <path d="M8 9.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="currentColor" />
              <path d="M4.5 7.5a5 5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M2 5a8 8 0 0 1 12 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <div className="flex items-center gap-[1px]">
              <div className="w-[22px] h-[11px] rounded-[3px] border border-current flex items-center p-[1px]">
                <div className="flex-1 h-full bg-current rounded-[1.5px]" />
              </div>
              <div className="w-[1px] h-[4px] bg-current opacity-40 rounded-full" />
            </div>
          </div>
        </div>

        {/* Header bar */}
        <div className="h-[44px] flex items-center px-[16px]">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center pl-[8px] pr-[10px] py-[10px] min-h-[44px] rounded-full text-foreground"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex-1 flex justify-center">
            <div className="flex items-center bg-secondary rounded-full p-[3px]">
              {(["deposit", "withdraw"] as Tab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setTab(t); setAmount(0) }}
                  className={cn(
                    "px-[18px] py-[6px] rounded-full text-sm font-semibold transition-colors",
                    tab === t
                      ? "bg-background text-foreground shadow-sm"
                      : "text-foreground-secondary"
                  )}
                >
                  {t === "deposit" ? "Nạp tiền" : "Rút tiền"}
                </button>
              ))}
            </div>
          </div>

          <div className="w-[44px]" />
        </div>

        {/* Amount display */}
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col items-center pt-[24px] px-[22px]">
            <button
              type="button"
              onClick={() => setBalanceHidden((v) => !v)}
              className="text-sm text-foreground-secondary flex items-center gap-[4px]"
            >
              <span>Số dư Sinh lời</span>{" "}
              {balanceHidden ? (
                <span className="font-semibold text-foreground">******** đ</span>
              ) : (
                <span className="font-semibold text-foreground">
                  {formatAmount(balance)} đ
                </span>
              )}
            </button>

            <div className="mt-[16px] flex items-baseline justify-center min-h-[60px]">
              <span
                className={cn(
                  "font-extrabold tabular-nums leading-none transition-all",
                  amount === 0 ? "text-foreground/20" : "text-foreground",
                  formatAmount(amount).length > 11 ? "text-[32px]" :
                  formatAmount(amount).length > 9 ? "text-[36px]" :
                  formatAmount(amount).length > 7 ? "text-[40px]" :
                  "text-[48px]"
                )}
              >
                {formatAmount(amount)}
              </span>
              <span className="w-[2px] h-[32px] bg-[#3B82F6] rounded-full animate-pulse mx-[2px] self-center" />
              <span className={cn(
                "text-[28px] font-medium",
                amount === 0 ? "text-foreground/20" : "text-foreground/50"
              )}>
                đ
              </span>
            </div>

            {amount > 0 && amount < limits.minDeposit && (
              <p className="text-xs text-foreground-secondary mt-[8px]">
                Tối thiểu {formatAmount(limits.minDeposit)} đ
              </p>
            )}

            {tab === "deposit" && amount > limits.maxDeposit && (
              <p className="text-xs text-destructive mt-[8px]">
                Tối đa {formatAmount(limits.maxDeposit)} đ
              </p>
            )}

            {tab === "withdraw" && amount > balance && (
              <p className="text-xs text-destructive mt-[8px]">
                Số dư không đủ
              </p>
            )}

            {tab === "withdraw" && amount > limits.maxWithdraw && amount <= balance && (
              <p className="text-xs text-destructive mt-[8px]">
                Tối đa rút {formatAmount(limits.maxWithdraw)} đ/ngày
              </p>
            )}
          </div>

          <div className="flex-1" />

          {/* Quick amount chips */}
          <div className="flex items-center justify-center gap-[10px] px-[22px] pb-[16px]">
            {chips.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setAmount(n)}
                className={cn(
                  "px-[16px] py-[8px] rounded-full text-sm font-medium border transition-colors",
                  amount === n
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-foreground"
                )}
              >
                {formatAmount(n)}
              </button>
            ))}
          </div>

          {/* Numpad */}
          <div className="grid grid-cols-3 px-[22px] pb-[8px]">
            {keys.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  if (key === "del") pressDelete()
                  else pressDigit(key)
                }}
                className={cn(
                  "h-[56px] flex items-center justify-center text-foreground active:bg-secondary rounded-[12px] transition-colors",
                  key === "del" ? "" : "text-[24px] font-medium"
                )}
              >
                {key === "del" ? (
                  <Delete size={24} className="text-foreground" />
                ) : key}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="px-[22px] pb-[8px]">
            <Button
              variant={isValid ? "primary" : "secondary"}
              size="48"
              className="w-full"
              disabled={!isValid}
              onClick={() => setShowConfirm(true)}
            >
              Tiếp tục
            </Button>
          </div>
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>

        {/* Confirmation Bottom Sheet */}
        <BottomSheet open={showConfirm} onClose={() => setShowConfirm(false)}>
          <button
            type="button"
            onClick={() => setShowConfirm(false)}
            className="w-[32px] h-[32px] flex items-center justify-center rounded-full bg-secondary"
          >
            <X size={16} className="text-foreground" />
          </button>

          <p className="text-[16px] font-medium text-foreground mt-[20px]">
            {tab === "deposit" ? "Xác nhận nạp tiền Sinh lời" : "Xác nhận rút tiền Sinh lời"}
          </p>

          <p className="text-[32px] font-bold text-foreground mt-[4px] tabular-nums leading-tight">
            {formatVND(amount)}
          </p>

          <div className="h-px bg-border mt-[20px]" />

          <div className="flex items-center justify-between py-[14px]">
            <span className="text-[14px] text-foreground-secondary">Dịch vụ</span>
            <span className="text-[14px] font-semibold text-foreground">
              {tab === "deposit" ? "Nạp tiền Sinh lời" : "Rút tiền Sinh lời"}
            </span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between py-[14px]">
            <span className="text-[14px] text-foreground-secondary">Số tiền</span>
            <span className="text-[14px] font-semibold text-foreground tabular-nums">
              {formatVND(amount)}
            </span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between py-[14px]">
            <span className="text-[14px] text-foreground-secondary">Phí dịch vụ</span>
            <span className="text-[14px] font-semibold text-success">Miễn phí</span>
          </div>
          <div className="h-px bg-border" />

          {/* Source */}
          <div className="pt-[20px]">
            <p className="text-[15px] font-semibold text-foreground mb-[12px]">
              {tab === "deposit" ? "Nguồn thanh toán" : "Nhận tiền về"}
            </p>
            <div className="flex items-center gap-[8px]">
              <div className="flex items-center gap-[8px] px-[12px] py-[8px] rounded-full border border-foreground bg-background">
                <div className="w-[28px] h-[28px] rounded-[6px] bg-info flex items-center justify-center shrink-0">
                  <Wallet size={14} className="text-info-foreground" />
                </div>
                <div className="leading-none">
                  <p className="text-[12px] font-semibold text-foreground">Ví V-Pay</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-[28px] pb-[8px]">
            <Button
              variant="primary"
              size="48"
              className="w-full"
              onClick={() => {
                setShowConfirm(false)
                router.push(`/sinhloi/otp?context=${contextParam}&amount=${amount}`)
              }}
            >
              Xác thực giao dịch
            </Button>
          </div>
        </BottomSheet>
      </div>
    </div>
  )
}

export default function DepositPage() {
  return (
    <React.Suspense fallback={null}>
      <DepositContent />
    </React.Suspense>
  )
}
