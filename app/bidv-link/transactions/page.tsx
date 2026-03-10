"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ArrowDownLeft, ArrowUpRight, Link2, Unlink, FileText } from "lucide-react"
import { Header } from "@/components/ui/header"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { FeedbackState } from "@/components/ui/feedback-state"

/* ── Types ────────────────────────────────────────────────────── */
type TxType = "deposit" | "withdraw" | "link" | "unlink"
type TxStatus = "success" | "pending" | "failed"

interface Transaction {
  id: string
  type: TxType
  amount: number
  status: TxStatus
  date: string
  bank: string
  group: string
}

/* ── Mock data ─────────────────────────────────────────────────── */
const MOCK_TXS: Transaction[] = [
  { id: "1", type: "deposit", amount: 200000, status: "success", date: "09/03 14:30", bank: "BIDV", group: "Hôm nay" },
  { id: "2", type: "withdraw", amount: 100000, status: "pending", date: "09/03 12:15", bank: "BIDV", group: "Hôm nay" },
  { id: "3", type: "link", amount: 0, status: "success", date: "09/03 10:00", bank: "BIDV", group: "Hôm nay" },
  { id: "4", type: "deposit", amount: 500000, status: "failed", date: "08/03 16:45", bank: "BIDV", group: "Hôm qua" },
  { id: "5", type: "withdraw", amount: 300000, status: "success", date: "08/03 09:30", bank: "BIDV", group: "Hôm qua" },
]

const FILTERS = [
  { label: "Tất cả", value: "all" },
  { label: "Nạp", value: "deposit" },
  { label: "Rút", value: "withdraw" },
  { label: "Liên kết", value: "link" },
  { label: "Hủy", value: "unlink" },
]

/* ── Helpers ───────────────────────────────────────────────────── */
function getTxLabel(type: TxType) {
  switch (type) {
    case "deposit": return "Nạp tiền"
    case "withdraw": return "Rút tiền"
    case "link": return "Liên kết ngân hàng"
    case "unlink": return "Hủy liên kết"
  }
}

function getTxIcon(type: TxType) {
  const size = 20
  switch (type) {
    case "deposit": return <ArrowDownLeft size={size} className="text-success" />
    case "withdraw": return <ArrowUpRight size={size} className="text-danger" />
    case "link": return <Link2 size={size} className="text-foreground" />
    case "unlink": return <Unlink size={size} className="text-foreground-secondary" />
  }
}

function getIconBg(type: TxType) {
  switch (type) {
    case "deposit": return "bg-green-50 dark:bg-green-950"
    case "withdraw": return "bg-red-50 dark:bg-red-950"
    case "link": return "bg-secondary"
    case "unlink": return "bg-secondary"
  }
}

function getStatusText(status: TxStatus) {
  switch (status) {
    case "success": return "Thành công"
    case "pending": return "Đang xử lý"
    case "failed": return "Thất bại"
  }
}

function getStatusColor(status: TxStatus) {
  switch (status) {
    case "success": return "text-success"
    case "pending": return "text-warning"
    case "failed": return "text-danger"
  }
}

function getAmountColor(type: TxType) {
  switch (type) {
    case "deposit": return "text-success"
    case "withdraw": return "text-danger"
    default: return "text-foreground"
  }
}

function formatTxAmount(type: TxType, amount: number) {
  if (type === "link" || type === "unlink") return ""
  const prefix = type === "deposit" ? "+" : "-"
  return `${prefix}${amount.toLocaleString("vi-VN")}đ`
}

/** Group transactions by their `group` field, preserving order */
function groupTransactions(txs: Transaction[]): { group: string; items: Transaction[] }[] {
  const groups: { group: string; items: Transaction[] }[] = []
  for (const tx of txs) {
    const last = groups[groups.length - 1]
    if (last && last.group === tx.group) {
      last.items.push(tx)
    } else {
      groups.push({ group: tx.group, items: [tx] })
    }
  }
  return groups
}

/* ── Page ──────────────────────────────────────────────────────── */
function TransactionsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "loaded"

  const [activeFilter, setActiveFilter] = React.useState(
    state === "filtered" ? "deposit"
      : state === "filtered-empty" ? "unlink"
      : "all"
  )

  const filtered = activeFilter === "all"
    ? MOCK_TXS
    : MOCK_TXS.filter((tx) => tx.type === activeFilter)

  const isEmpty = state === "empty" || filtered.length === 0
  const isFilteredEmpty = activeFilter !== "all" && filtered.length === 0
  const grouped = groupTransactions(filtered)

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header
        variant="large-title"
        largeTitle="Lịch sử giao dịch"
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

      {/* Filter chips */}
      <div className="px-[22px] pb-[8px]">
        <div className="flex gap-[8px] overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setActiveFilter(f.value)}
              className={`shrink-0 px-[14px] py-[6px] rounded-full text-sm font-semibold leading-5 transition-colors ${
                activeFilter === f.value
                  ? "bg-foreground text-background"
                  : "bg-secondary text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-[21px]">
        {/* Loading */}
        {state === "loading" && (
          <div className="pt-[32px] px-[22px] space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-secondary animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-secondary rounded-full animate-pulse" />
                  <div className="h-3 w-1/2 bg-secondary rounded-full animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-secondary rounded-full animate-pulse" />
                  <div className="h-3 w-12 bg-secondary rounded-full animate-pulse ml-auto" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {state === "error" && (
          <div className="pt-[32px] px-[22px]">
            <FeedbackState
              icon={
                <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center">
                  <FileText size={32} className="text-danger" />
                </div>
              }
              title="Không thể tải lịch sử"
              description="Vui lòng kiểm tra kết nối và thử lại."
              actionLabel="Thử lại"
              actionProps={{ onClick: () => router.refresh() }}
            />
          </div>
        )}

        {/* Empty */}
        {state !== "loading" && state !== "error" && isEmpty && (
          <div className="pt-[32px] px-[22px]">
            <FeedbackState
              icon={
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                  <FileText size={32} className="text-foreground-secondary" />
                </div>
              }
              title={isFilteredEmpty ? "Không tìm thấy giao dịch" : "Chưa có giao dịch nào"}
            />
          </div>
        )}

        {/* Loaded / Filtered — grouped by date */}
        {state !== "loading" && state !== "error" && !isEmpty && (
          <div className="pt-[16px]">
            {grouped.map((section, sIdx) => (
              <div key={section.group}>
                {/* Date group header */}
                <div className="px-[22px] pt-[16px] pb-[8px]">
                  <p className="text-sm font-semibold leading-5 text-foreground-secondary">
                    {section.group}
                  </p>
                </div>

                {/* Transaction items */}
                <div className="px-[22px]">
                  <ItemList>
                    {section.items.map((tx, idx) => (
                      <ItemListItem
                        key={tx.id}
                        prefix={
                          <div className={`w-full h-full rounded-full flex items-center justify-center ${getIconBg(tx.type)}`}>
                            {getTxIcon(tx.type)}
                          </div>
                        }
                        label={getTxLabel(tx.type)}
                        sublabel={tx.date}
                        suffix={
                          <div className="shrink-0 flex flex-col gap-1 items-end">
                            {formatTxAmount(tx.type, tx.amount) && (
                              <span className={`text-md font-semibold leading-6 ${getAmountColor(tx.type)}`}>
                                {formatTxAmount(tx.type, tx.amount)}
                              </span>
                            )}
                            <span className={`text-sm font-normal leading-5 ${getStatusColor(tx.status)}`}>
                              {getStatusText(tx.status)}
                            </span>
                          </div>
                        }
                        divider={idx < section.items.length - 1}
                        onPress={() => router.push(`/bidv-link/transaction-detail?id=${tx.id}&txStatus=${tx.status}`)}
                      />
                    ))}
                  </ItemList>
                </div>
              </div>
            ))}
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

export default function TransactionsPage() {
  return (
    <React.Suspense fallback={null}>
      <TransactionsContent />
    </React.Suspense>
  )
}
