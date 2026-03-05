"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Percent, Plus, ArrowRight } from "lucide-react"
import { Header } from "@/components/ui/header"
import { cn } from "@/lib/utils"
import {
  MOCK_TRANSACTIONS_FULL,
  formatVND,
  getStatusLabel,
  type SinhLoiTransaction,
  type TransactionType,
} from "../data"

type FilterTab = "all" | "deposit" | "withdrawal" | "interest"

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "deposit", label: "Nạp tiền" },
  { key: "withdrawal", label: "Rút tiền" },
  { key: "interest", label: "Tiền lời" },
]

function TxIcon({ type }: { type: TransactionType }) {
  const cls = "size-[24px] text-foreground-secondary"
  switch (type) {
    case "interest":
      return <Percent className={cls} size={24} />
    case "deposit":
      return <Plus className={cls} size={24} />
    case "withdrawal":
      return <ArrowRight className={cls} size={24} />
  }
}

export default function TransactionsPage() {
  const router = useRouter()
  const [filter, setFilter] = React.useState<FilterTab>("all")

  const filtered = filter === "all"
    ? MOCK_TRANSACTIONS_FULL
    : MOCK_TRANSACTIONS_FULL.filter((tx) => tx.type === filter)

  return (
    <div className="min-h-screen bg-grey-100 dark:bg-grey-900 flex flex-col items-center">
      <div className="relative w-[390px] h-[844px] bg-background text-foreground flex flex-col rounded-[40px] shadow-xl overflow-hidden mt-[16px]">

        {/* Header */}
        <Header
          variant="large-title"
          largeTitle="Lịch sử giao dịch"
          showStatusBar
          leading={
            <button
              type="button"
              onClick={() => router.back()}
              className="p-[10px] min-h-[44px] rounded-full flex items-center justify-center"
            >
              <ChevronLeft size={18} className="text-foreground" />
            </button>
          }
        />

        {/* Filter tabs */}
        <div className="px-[22px] pb-[16px]">
          <div className="bg-secondary flex items-center p-[4px] rounded-[16px]">
            {FILTER_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setFilter(t.key)}
                className={cn(
                  "flex-1 px-[8px] py-[8px] rounded-[12px] text-sm font-semibold leading-5 text-center whitespace-nowrap transition-all",
                  filter === t.key
                    ? "bg-background shadow-[0px_6px_12px_-6px_rgba(0,0,0,0.12),0px_8px_24px_-4px_rgba(0,0,0,0.08)] text-foreground"
                    : "text-foreground-secondary"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction list */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col">
            {filtered.map((tx) => {
              const statusInfo = getStatusLabel(tx.status)
              return (
                <div key={tx.id} className="flex items-center gap-[16px] px-[22px] py-[10px] h-[64px]">
                  <div className="size-[44px] shrink-0 rounded-full bg-secondary flex items-center justify-center">
                    <TxIcon type={tx.type} />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
                    <p className="text-sm font-medium leading-5 text-foreground truncate">{tx.label}</p>
                    <p className="text-sm leading-5 text-foreground-secondary truncate">{tx.date}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-[4px]">
                    <p className="text-sm font-semibold leading-5 text-foreground tabular-nums">
                      {tx.amount < 0 ? formatVND(tx.amount) : `+${formatVND(tx.amount)}`}
                    </p>
                    <p className={cn("text-sm leading-5", statusInfo.color)}>
                      {statusInfo.text}
                    </p>
                  </div>
                </div>
              )
            })}

            {filtered.length === 0 && (
              <div className="flex items-center justify-center py-[40px]">
                <p className="text-sm text-foreground-secondary">Không có giao dịch</p>
              </div>
            )}
          </div>
        </div>

        {/* Home indicator */}
        <div className="h-[21px] shrink-0 flex items-end justify-center pb-[8px]">
          <div className="w-[139px] h-[5px] bg-foreground rounded-[100px]" />
        </div>
      </div>
    </div>
  )
}
