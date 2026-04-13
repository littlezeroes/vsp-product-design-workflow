"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ArrowUpRight, ArrowDownLeft, Percent, FileText } from "lucide-react"
import { Header } from "@/components/ui/header"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { FeedbackState } from "@/components/ui/feedback-state"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { MOCK_TRANSACTIONS_FULL, formatVND, formatVNDSigned, getTxIcon } from "../data"
import type { SinhLoiTransaction } from "../data"

/* ── Tab config ──────────────────────────────────────────────── */
const TABS = [
  { label: "Tất cả", value: "all" },
  { label: "Nạp", value: "deposit" },
  { label: "Rút", value: "withdrawal" },
  { label: "Lãi", value: "interest" },
]

/* ── Helpers ──────────────────────────────────────────────────── */
function getStatusBadgeVariant(status: SinhLoiTransaction["status"]) {
  switch (status) {
    case "success": return "success" as const
    case "pending": return "warning" as const
    case "failed": return "danger" as const
  }
}

function getStatusText(status: SinhLoiTransaction["status"]) {
  switch (status) {
    case "success": return "Thành công"
    case "pending": return "Đang xử lý"
    case "failed": return "Thất bại"
  }
}

function getAmountPrefix(type: string) {
  switch (type) {
    case "deposit": return "+"
    case "withdrawal": return "-"
    default: return "+"
  }
}

function getTxPrefixIcon(type: string) {
  switch (type) {
    case "deposit":
      return <ArrowDownLeft size={20} className="text-info" />
    case "withdrawal":
      return <ArrowUpRight size={20} className="text-danger" />
    default:
      return <Percent size={20} className="text-success" />
  }
}

/** Group transactions by date */
function groupByDate(txs: SinhLoiTransaction[]): { date: string; items: SinhLoiTransaction[] }[] {
  const groups: { date: string; items: SinhLoiTransaction[] }[] = []
  for (const tx of txs) {
    const last = groups[groups.length - 1]
    if (last && last.date === tx.date) {
      last.items.push(tx)
    } else {
      groups.push({ date: tx.date, items: [tx] })
    }
  }
  return groups
}

/* ── Loading skeleton ─────────────────────────────────────────── */
function HistorySkeleton() {
  return (
    <div className="px-[22px] pt-[16px] flex flex-col gap-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton variant="circle" width={44} height={44} />
          <div className="flex-1 flex flex-col gap-2">
            <Skeleton variant="text" width="75%" />
            <Skeleton variant="text" width="50%" />
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Skeleton variant="text" width={64} />
            <Skeleton variant="text" width={48} />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function HistoryPage() {
  return <React.Suspense fallback={null}><HistoryContent /></React.Suspense>
}

function HistoryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const stateParam = searchParams.get("state")

  const [activeTab, setActiveTab] = React.useState("all")
  const [isLoading, setIsLoading] = React.useState(stateParam === "loading")

  // Simulate loading
  React.useEffect(() => {
    if (stateParam === "loading") {
      const timer = setTimeout(() => setIsLoading(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [stateParam])

  const filtered = activeTab === "all"
    ? (stateParam === "empty" ? [] : MOCK_TRANSACTIONS_FULL)
    : MOCK_TRANSACTIONS_FULL.filter((tx) => tx.type === activeTab)

  const isEmpty = filtered.length === 0
  const grouped = groupByDate(filtered)

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      {/* Header — large-title with search + tabs */}
      <Header
        variant="large-title"
        largeTitle="Lịch sử"
        showSearch
        searchProps={{ placeholder: "Tìm giao dịch..." }}
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={(v) => setActiveTab(v)}
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

      <div className="flex-1 overflow-y-auto pb-[21px]">
        {/* Loading */}
        {isLoading && <HistorySkeleton />}

        {/* Empty */}
        {!isLoading && isEmpty && (
          <div className="pt-[32px] px-[22px]">
            <FeedbackState
              icon={
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                  <FileText size={32} className="text-foreground-secondary" />
                </div>
              }
              title="Chưa có giao dịch"
              description={
                activeTab !== "all"
                  ? "Không tìm thấy giao dịch với bộ lọc này"
                  : "Nạp tiền vào ví sinh lời để bắt đầu"
              }
              actionLabel={activeTab !== "all" ? "Xóa bộ lọc" : undefined}
              actionProps={activeTab !== "all" ? { onClick: () => setActiveTab("all") } : undefined}
            />
          </div>
        )}

        {/* Transaction list grouped by date */}
        {!isLoading && !isEmpty && (
          <div className="pt-[16px]">
            {grouped.map((section) => (
              <div key={section.date}>
                {/* Date group header */}
                <div className="px-[22px] pt-[16px] pb-[8px]">
                  <p className="text-sm font-semibold leading-5 text-foreground-secondary">
                    {section.date}
                  </p>
                </div>

                {/* Items */}
                <div className="px-[22px]">
                  <ItemList>
                    {section.items.map((tx, idx) => (
                      <ItemListItem
                        key={tx.id}
                        prefix={
                          <div className={`w-full h-full rounded-full flex items-center justify-center ${getTxIcon(tx.type).bg}`}>
                            {getTxPrefixIcon(tx.type)}
                          </div>
                        }
                        label={tx.label}
                        sublabel={tx.date}
                        metadata={formatVNDSigned(tx.amount)}
                        suffix={
                          <div className="flex flex-col items-end gap-1">
                            <Badge variant={getStatusBadgeVariant(tx.status)} dot>
                              {getStatusText(tx.status)}
                            </Badge>
                          </div>
                        }
                        showChevron
                        divider={idx < section.items.length - 1}
                        onPress={() => router.push(`/sinhloi/history/${tx.id}`)}
                      />
                    ))}
                  </ItemList>
                </div>
              </div>
            ))}

            {/* End of list */}
            <div className="px-[22px] pt-[24px] pb-[16px]">
              <p className="text-xs text-foreground-secondary text-center">
                Đã hiển thị tất cả giao dịch
              </p>
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
