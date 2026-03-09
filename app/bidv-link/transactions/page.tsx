"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ArrowDownLeft, ArrowUpRight, Link2, Unlink, FileText } from "lucide-react"
import { Header } from "@/components/ui/header"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { FeedbackState } from "@/components/ui/feedback-state"

/* ── Mock data ─────────────────────────────────────────────────── */
type TxType = "deposit" | "withdraw" | "link" | "unlink"
type TxStatus = "success" | "pending" | "failed"

interface Transaction {
  id: string
  type: TxType
  amount: number
  status: TxStatus
  date: string
  bank: string
}

const MOCK_TXS: Transaction[] = [
  { id: "1", type: "deposit", amount: 200000, status: "success", date: "09/03 14:30", bank: "BIDV" },
  { id: "2", type: "withdraw", amount: 100000, status: "pending", date: "09/03 12:15", bank: "BIDV" },
  { id: "3", type: "link", amount: 0, status: "success", date: "09/03 10:00", bank: "BIDV" },
  { id: "4", type: "deposit", amount: 500000, status: "failed", date: "08/03 16:45", bank: "BIDV" },
  { id: "5", type: "withdraw", amount: 300000, status: "success", date: "08/03 09:30", bank: "BIDV" },
]

const FILTERS = [
  { label: "Tất cả", value: "all" },
  { label: "Nạp", value: "deposit" },
  { label: "Rút", value: "withdraw" },
  { label: "Liên kết", value: "link" },
  { label: "Hủy", value: "unlink" },
]

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

function formatTxAmount(type: TxType, amount: number) {
  if (type === "link" || type === "unlink") return ""
  const prefix = type === "deposit" ? "+" : "-"
  return `${prefix}${amount.toLocaleString("vi-VN")}đ`
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function TransactionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "loaded"

  const [activeFilter, setActiveFilter] = React.useState("all")

  const filtered = activeFilter === "all"
    ? MOCK_TXS
    : MOCK_TXS.filter((tx) => tx.type === activeFilter)

  const isEmpty = state === "empty" || filtered.length === 0
  const isFilteredEmpty = activeFilter !== "all" && filtered.length === 0

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
              <div key={i} className="h-[68px] bg-secondary rounded-[14px] animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {state === "error" && (
          <div className="pt-[32px] px-[22px]">
            <FeedbackState
              icon={
                <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center">
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

        {/* Loaded / Filtered */}
        {state !== "loading" && state !== "error" && !isEmpty && (
          <div className="pt-[16px]">
            <div className="px-[22px]">
              <ItemList>
                {filtered.map((tx, idx) => (
                  <ItemListItem
                    key={tx.id}
                    prefix={
                      <div className="w-full h-full flex items-center justify-center">
                        {getTxIcon(tx.type)}
                      </div>
                    }
                    label={getTxLabel(tx.type)}
                    sublabel={tx.date}
                    metadata={formatTxAmount(tx.type, tx.amount)}
                    subMetadata={getStatusText(tx.status)}
                    divider={idx < filtered.length - 1}
                    onPress={() => router.push(`/bidv-link/transaction-detail?id=${tx.id}`)}
                  />
                ))}
              </ItemList>
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
