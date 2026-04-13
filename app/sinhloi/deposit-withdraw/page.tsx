"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, Delete, Info } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Tab } from "@/components/ui/tab"
import { Chip } from "@/components/ui/chip"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { InformMessage } from "@/components/ui/inform-message"
import { Dialog } from "@/components/ui/dialog"
import {
  SINHLOI_CONFIG,
  MOCK_USER,
  MOCK_BALANCE,
  QUICK_AMOUNTS,
  formatVND,
  calculateInterest,
} from "../data"

/* ── Constants ─────────────────────────────────────────────────── */
const MIN_AMOUNT = 10_000
const MOCK_MONTHLY_DEPOSITED = 15_000_000 // amount already deposited this month

/* ── Helpers ───────────────────────────────────────────────────── */
function formatChip(value: number): string {
  if (value >= 1_000_000) return `${value / 1_000_000}tr`
  return `${value / 1_000}k`
}

/* ── Custom Numpad ───────────────────────────────────────────────── */
function Numpad({ onInput, disabled }: { onInput: (key: string) => void; disabled?: boolean }) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "000", "0", "backspace"]
  return (
    <div className="grid grid-cols-3">
      {keys.map((key) => (
        <button
          key={key}
          type="button"
          disabled={disabled}
          onClick={() => onInput(key)}
          className="h-[52px] flex items-center justify-center text-[20px] font-semibold text-foreground active:bg-secondary rounded-8 transition-colors disabled:opacity-40"
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

/* ── S7: Nap/Rut tien ───────────────────────────────────────────── */
export default function DepositWithdrawPage() {
  return <React.Suspense fallback={null}><DepositWithdrawContent /></React.Suspense>
}

function DepositWithdrawContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") || "deposit"

  const [activeTab, setActiveTab] = React.useState<"deposit" | "withdraw">(initialTab as "deposit" | "withdraw")
  const [amount, setAmount] = React.useState(0)
  const [loading, setLoading] = React.useState(false)
  const [networkDialog, setNetworkDialog] = React.useState(false)

  const isDeposit = activeTab === "deposit"
  const walletBalance = MOCK_USER.walletBalance
  const sinhloiBalance = MOCK_BALANCE.balance
  const { maxBalance, dailyWithdrawLimit, interestRate, monthlyDepositLimit } = SINHLOI_CONFIG

  // Monthly remaining limit
  const monthlyRemaining = monthlyDepositLimit - MOCK_MONTHLY_DEPOSITED

  // Validation — per decisions.md: min 10K, monthly limit, max balance
  const getError = (): string | undefined => {
    if (amount === 0) return undefined
    if (amount < MIN_AMOUNT) return "Số tiền tối thiểu là 10.000₫"

    if (isDeposit) {
      if (amount > walletBalance) return "Số dư ví không đủ"
      if (amount + sinhloiBalance > maxBalance) {
        const remaining = maxBalance - sinhloiBalance
        return `Vượt hạn mức tối đa 100.000.000₫. Có thể nạp thêm: ${remaining.toLocaleString("vi-VN")}₫`
      }
      if (amount > monthlyRemaining) {
        return `Đã đạt hạn mức nạp tháng. Hạn mức còn lại: ${monthlyRemaining.toLocaleString("vi-VN")}₫`
      }
    } else {
      if (amount > sinhloiBalance) return "Số dư sinh lời không đủ"
      if (amount > dailyWithdrawLimit) {
        return `Vượt hạn mức rút ${dailyWithdrawLimit.toLocaleString("vi-VN")}₫/ngày`
      }
    }
    return undefined
  }

  const error = getError()
  const isValid = amount >= MIN_AMOUNT && !error

  // Tiered auth per decisions.md
  const handleContinue = () => {
    if (!isValid) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push(`/sinhloi/confirm-tx?type=${activeTab}&amount=${amount}`)
    }, 500)
  }

  const handleAmountInput = (digit: string) => {
    if (digit === "backspace") {
      setAmount((prev) => Math.floor(prev / 10))
    } else if (digit === "000") {
      setAmount((prev) => {
        const next = prev * 1000
        return next > 999_999_999 ? prev : next
      })
    } else {
      setAmount((prev) => {
        const next = prev * 10 + parseInt(digit)
        return next > 999_999_999 ? prev : next
      })
    }
  }

  const handleTabSwitch = (tab: string) => {
    setActiveTab(tab as "deposit" | "withdraw")
    setAmount(0)
  }

  const handleWithdrawAll = () => {
    const maxWithdraw = Math.min(sinhloiBalance, dailyWithdrawLimit)
    setAmount(maxWithdraw)
  }

  const estimatedInterestYear = calculateInterest(amount, interestRate)
  const estimatedInterestDay = Math.round(estimatedInterestYear / 365)

  const isWalletEmpty = isDeposit && walletBalance === 0

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      {/* Header: default variant with back arrow */}
      <Header
        variant="default"
        title="Nạp / Rút"
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

      {/* Tab component — deposit / withdraw */}
      <Tab
        tabs={[
          { label: "Nạp tiền", value: "deposit" },
          { label: "Rút tiền", value: "withdraw" },
        ]}
        activeTab={activeTab}
        onTabChange={handleTabSwitch}
      />

      <div className="flex-1 flex flex-col pb-[100px]">
        {/* Wallet empty warning */}
        {isWalletEmpty && (
          <div className="px-[22px] pt-[12px]">
            <InformMessage
              hierarchy="primary"
              icon={<Info size={20} />}
              body="Số dư ví không đủ. Nạp tiền vào ví trước."
              actionLabel="Nạp ví"
              onAction={() => router.push("/")}
            />
          </div>
        )}

        {/* Balance source display — centered */}
        <div className="px-[22px] pt-[16px] flex justify-center">
          <p className="text-sm font-normal leading-5 text-foreground-secondary">
            {isDeposit ? "Từ Ví V-Smart Pay" : "Đến Ví V-Smart Pay"}{" "}
            <span className="font-bold text-foreground-secondary">
              {formatVND(isDeposit ? walletBalance : sinhloiBalance)}
            </span>
          </p>
        </div>

        {/* Monthly limit display (deposit only) */}
        {isDeposit && (
          <div className="px-[22px] pt-[4px] flex justify-center">
            <p className="text-xs font-normal leading-4 text-foreground-secondary">
              Hạn mức còn lại tháng này: {monthlyRemaining.toLocaleString("vi-VN")}₫
            </p>
          </div>
        )}

        {/* Amount display — big amount center */}
        <div className="px-[22px] pt-[24px] flex flex-col items-center">
          <div className="flex items-center gap-[2px]">
            <p className="text-[40px] font-bold tabular-nums text-foreground leading-tight">
              {amount === 0 ? "0" : amount.toLocaleString("vi-VN")}₫
            </p>
            {/* Cursor line */}
            <div className="w-[2px] h-[36px] bg-info animate-pulse rounded-full" />
          </div>
          {error && (
            <p className="text-xs font-normal leading-5 text-danger mt-[4px] text-center px-[16px]">{error}</p>
          )}
        </div>

        {/* Quick amount chips */}
        <div className="pt-[24px] px-[22px]">
          <div className="flex gap-[8px] justify-center flex-wrap">
            {QUICK_AMOUNTS.map((val) => (
              <Chip
                key={val}
                variant="filled"
                size="md"
                selected={amount === val}
                onPress={() => setAmount(val)}
              >
                {formatChip(val)}
              </Chip>
            ))}
          </div>
        </div>

        {/* Withdraw all link */}
        {!isDeposit && (
          <div className="pt-[12px] flex justify-center">
            <button type="button" onClick={handleWithdrawAll} className="text-sm font-semibold text-success">
              Rút tất cả
            </button>
          </div>
        )}

        {/* Interest estimate — using ItemList */}
        {amount > 0 && !error && (
          <div className="px-[22px] pt-[12px]">
            {isDeposit ? (
              <InformMessage
                hierarchy="secondary"
                body={
                  <span>
                    Ước tính lãi thêm: <span className="text-success font-semibold">+{estimatedInterestYear.toLocaleString("vi-VN")}₫/năm</span>
                  </span>
                }
              />
            ) : (
              <InformMessage
                hierarchy="secondary"
                body={
                  <span>
                    Lãi bị giảm ước tính: <span className="text-danger font-semibold">-{estimatedInterestYear.toLocaleString("vi-VN")}₫/năm</span>
                  </span>
                }
              />
            )}
          </div>
        )}

        {/* Withdraw all warning */}
        {!isDeposit && amount > 0 && amount === sinhloiBalance && (
          <div className="px-[22px] pt-[8px]">
            <InformMessage
              hierarchy="secondary"
              icon={<Info size={20} className="text-warning" />}
              body={`Bạn sẽ mất tiền lãi hôm nay: ${estimatedInterestDay.toLocaleString("vi-VN")}₫`}
              className="bg-warning/10"
            />
          </div>
        )}

        {/* Min/max limits info */}
        <div className="px-[22px] pt-[16px]">
          <InformMessage
            hierarchy="secondary"
            icon={<Info size={20} />}
            body={
              isDeposit
                ? `Tối thiểu 10.000₫. Tối đa ${formatVND(maxBalance)}.`
                : `Tối thiểu 10.000₫. Tối đa ${formatVND(dailyWithdrawLimit)}/ngày.`
            }
          />
        </div>

        {/* Custom Numpad */}
        <div className="pt-[32px] mt-auto">
          <div className="px-[22px]">
            <Numpad onInput={handleAmountInput} disabled={isWalletEmpty} />
          </div>
        </div>
      </div>

      {/* Fixed CTA */}
      <div className="absolute bottom-0 inset-x-0 bg-background px-[22px] pb-[34px] pt-[12px]">
        <ButtonGroup
          layout="horizontal"
          primaryLabel="Tiếp tục"
          secondaryLabel="Huỷ"
          primaryProps={{
            disabled: !isValid || loading || isWalletEmpty,
            isLoading: loading,
            onClick: handleContinue,
          }}
          secondaryProps={{
            onClick: () => router.back(),
          }}
        />
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>

      <Dialog
        open={networkDialog}
        onClose={() => setNetworkDialog(false)}
        title="Không có kết nối mạng"
        description="Vui lòng kiểm tra Internet và thử lại"
        primaryLabel="Thử lại"
        secondaryLabel="Đóng"
        footerProps={{
          primaryProps: { onClick: () => setNetworkDialog(false) },
          secondaryProps: { onClick: () => setNetworkDialog(false) },
        }}
      />
    </div>
  )
}
