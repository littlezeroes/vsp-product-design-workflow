"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft, Copy, Check } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Section } from "@/components/ui/section"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { FeedbackState } from "@/components/ui/feedback-state"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { InformMessage } from "@/components/ui/inform-message"
import { MOCK_TRANSACTIONS_FULL, formatVND, formatVNDSigned, getStatusLabel } from "../../data"

/* ── Helpers ──────────────────────────────────────────────────── */
function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "success": return "success" as const
    case "pending": return "warning" as const
    case "failed": return "danger" as const
    default: return "default" as const
  }
}

function getStatusText(status: string) {
  switch (status) {
    case "success": return "Thành công"
    case "pending": return "Đang xử lý"
    case "failed": return "Thất bại"
    default: return status
  }
}

/* ── Loading skeleton ─────────────────────────────────────────── */
function DetailSkeleton() {
  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header
        variant="default"
        title="Chi tiết giao dịch"
        leading={
          <div className="w-[44px] h-[44px] flex items-center justify-center rounded-full">
            <Skeleton variant="circle" width={18} height={18} />
          </div>
        }
      />
      <div className="px-[22px] pt-[32px] flex flex-col items-center gap-3">
        <Skeleton variant="text" width={80} height={22} />
        <Skeleton variant="text" width={160} height={32} />
      </div>
      <div className="px-[22px] pt-[32px]">
        <Skeleton variant="card" width="100%" height={220} />
      </div>
      <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function TransactionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const txId = params.id as string

  const [isLoading, setIsLoading] = React.useState(true)
  const [copied, setCopied] = React.useState(false)

  const tx = MOCK_TRANSACTIONS_FULL.find((t) => t.id === txId)

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timer)
  }, [])

  const handleCopyId = () => {
    if (!tx) return
    navigator.clipboard?.writeText(tx.id.toUpperCase()).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* Loading */
  if (isLoading) return <DetailSkeleton />

  /* Not found */
  if (!tx) {
    return (
      <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
        <Header
          variant="default"
          title="Chi tiết giao dịch"
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
        <div className="flex-1 flex items-center justify-center px-[22px]">
          <FeedbackState
            title="Không tìm thấy giao dịch"
            description="Nội dung bạn đang tìm hiện chưa sẵn sàng hoặc không còn tồn tại"
            actionLabel="Quay lại"
            actionProps={{ onClick: () => router.back() }}
          />
        </div>
        <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </div>
    )
  }

  const typeLabel = tx.type === "deposit" ? "Nạp tiền" : tx.type === "withdrawal" ? "Rút tiền" : "Trả lãi"

  // Mock balance before/after
  const balanceBefore = 10_831_048
  const balanceAfter = balanceBefore + tx.amount

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <Header
        variant="default"
        title="Chi tiết giao dịch"
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

      <div className="flex-1 overflow-y-auto pb-[40px]">
        {/* Status badge + amount — centered */}
        <div className="pt-[32px] px-[22px] flex flex-col items-center gap-3">
          <Badge variant={getStatusBadgeVariant(tx.status)} dot>
            {getStatusText(tx.status)}
          </Badge>
          <p className="text-[24px] font-bold leading-8 tabular-nums text-foreground">
            {formatVNDSigned(tx.amount)}
          </p>
        </div>

        {/* Details section */}
        <div className="pt-[32px] px-[22px]">
          <Section title="CHI TIẾT">
            <ItemList>
              <ItemListItem
                label="Mã giao dịch"
                suffix={
                  <div className="flex items-center gap-2">
                    <span className="text-md font-semibold text-foreground">{tx.id.toUpperCase()}</span>
                    <button type="button" onClick={handleCopyId} className="p-1">
                      {copied
                        ? <Check size={16} className="text-success" />
                        : <Copy size={16} className="text-foreground-secondary" />
                      }
                    </button>
                  </div>
                }
                divider
              />
              <ItemListItem label="Loại" metadata={typeLabel} divider />
              <ItemListItem label="Thời gian" metadata={tx.date} divider />
              <ItemListItem label="Số dư trước" metadata={formatVND(balanceBefore)} divider />
              <ItemListItem label="Số dư sau" metadata={formatVND(balanceAfter)} divider />
              <ItemListItem
                label="Trạng thái"
                suffix={
                  <Badge variant={getStatusBadgeVariant(tx.status)} dot>
                    {getStatusText(tx.status)}
                  </Badge>
                }
              />
            </ItemList>
          </Section>
        </div>

        {/* Failed reason */}
        {tx.status === "failed" && (
          <div className="pt-[16px] px-[22px]">
            <InformMessage
              hierarchy="secondary"
              body="Giao dịch không thành công. Vui lòng thử lại hoặc liên hệ CSKH."
            />
          </div>
        )}

        {/* Repeat action */}
        {(tx.type === "deposit" || tx.type === "withdrawal") && tx.status !== "pending" && (
          <div className="pt-[32px] px-[22px]">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => router.push("/sinhloi/deposit-withdraw")}
            >
              Thực hiện lại
            </Button>
          </div>
        )}
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}
