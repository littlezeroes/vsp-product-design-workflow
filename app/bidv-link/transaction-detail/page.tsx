"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, Loader2 } from "lucide-react"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { FeedbackState } from "@/components/ui/feedback-state"
import { Button } from "@/components/ui/button"

/* ── Mock data ─────────────────────────────────────────────────── */
const MOCK_TXS: Record<string, {
  id: string
  type: string
  typeLabel: string
  status: "success" | "pending" | "failed"
  amount: number
  fee: number
  bank: string
  account: string
  time: string
}> = {
  "1": { id: "TXN001234", type: "deposit", typeLabel: "Nạp tiền", status: "success", amount: 200000, fee: 0, bank: "BIDV", account: "****1234", time: "09/03/2026 14:30" },
  "2": { id: "TXN001235", type: "withdraw", typeLabel: "Rút tiền", status: "pending", amount: 100000, fee: 0, bank: "BIDV", account: "****1234", time: "09/03/2026 12:15" },
  "3": { id: "TXN001236", type: "link", typeLabel: "Liên kết ngân hàng", status: "success", amount: 0, fee: 0, bank: "BIDV", account: "****1234", time: "09/03/2026 10:00" },
  "4": { id: "TXN001237", type: "deposit", typeLabel: "Nạp tiền", status: "failed", amount: 500000, fee: 0, bank: "BIDV", account: "****1234", time: "08/03/2026 16:45" },
  "5": { id: "TXN001238", type: "withdraw", typeLabel: "Rút tiền", status: "success", amount: 300000, fee: 0, bank: "BIDV", account: "****1234", time: "08/03/2026 09:30" },
}

/* ── Status badge ──────────────────────────────────────────────── */
function getStatusBadge(status: string) {
  switch (status) {
    case "success":
      return (
        <span className="inline-flex px-[12px] py-[4px] rounded-full text-sm font-semibold bg-green-50 text-success dark:bg-green-950">
          Thành công
        </span>
      )
    case "pending":
      return (
        <span className="inline-flex px-[12px] py-[4px] rounded-full text-sm font-semibold bg-yellow-50 text-warning dark:bg-yellow-950">
          Đang xử lý
        </span>
      )
    case "failed":
      return (
        <span className="inline-flex px-[12px] py-[4px] rounded-full text-sm font-semibold bg-red-50 text-danger dark:bg-red-950">
          Thất bại
        </span>
      )
    default:
      return null
  }
}

function formatAmount(type: string, amount: number) {
  if (type === "link" || type === "unlink") return "0đ"
  const prefix = type === "deposit" ? "+" : "-"
  return `${prefix}${amount.toLocaleString("vi-VN")}đ`
}

/* ── Page ──────────────────────────────────────────────────────── */
function TransactionDetailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "loaded"
  const txId = searchParams.get("id") ?? "1"
  const txStatusParam = searchParams.get("txStatus")

  const tx = MOCK_TXS[txId] ?? MOCK_TXS["1"]
  const txStatus = txStatusParam ?? tx.status

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-secondary text-foreground flex flex-col">
      {/* ── Loading ── */}
      {state === "loading" && (
        <>
          <div className="bg-foreground px-[22px] pt-[54px] pb-[60px] flex flex-col items-center">
            <Loader2 size={32} className="text-background animate-spin" />
          </div>
          <div className="flex-1 bg-secondary" />
        </>
      )}

      {/* ── Error ── */}
      {state === "error" && (
        <>
          <div className="bg-background pt-[54px] pb-[32px] px-[22px]">
            <button
              type="button"
              onClick={() => router.push("/bidv-link/transactions")}
              className="w-[44px] h-[44px] flex items-center justify-center rounded-full"
            >
              <ChevronLeft size={18} className="text-foreground" />
            </button>
          </div>
          <div className="flex-1 bg-background px-[22px]">
            <FeedbackState
              title="Không thể tải chi tiết"
              description="Vui lòng kiểm tra kết nối và thử lại."
              actionLabel="Thử lại"
              actionProps={{ onClick: () => router.refresh() }}
            />
          </div>
        </>
      )}

      {/* ── Loaded ── */}
      {state !== "loading" && state !== "error" && (
        <>
          {/* Dark header */}
          <div className="bg-foreground px-[22px] pt-[54px] pb-[60px] flex flex-col items-center relative">
            {/* Back button — absolute top-left */}
            <button
              type="button"
              onClick={() => router.push("/bidv-link/transactions")}
              className="absolute top-[44px] left-[14px] w-[44px] h-[44px] flex items-center justify-center rounded-full"
            >
              <ChevronLeft size={18} className="text-background" />
            </button>

            {/* V-Smart Pay label */}
            <p className="text-sm font-semibold text-background mb-[8px]">V-Smart Pay</p>

            {/* Amount */}
            <p className="text-[40px] font-bold tabular-nums text-background leading-tight">
              {formatAmount(tx.type, tx.amount)}
            </p>
          </div>

          {/* White card overlay */}
          <div className="px-[22px] -mt-[32px] flex-1">
            <div className="bg-background rounded-[28px] px-[20px] py-[24px] shadow-sm">
              {/* Status badge */}
              <div className="flex justify-center mb-[20px]">
                {getStatusBadge(txStatus)}
              </div>

              {/* Detail rows */}
              <ItemList>
                <ItemListItem label="Loại giao dịch" metadata={tx.typeLabel} divider />
                <ItemListItem label="Ngân hàng" metadata={tx.bank} divider />
                <ItemListItem label="Số tài khoản" metadata={tx.account} divider />
                <ItemListItem label="Phí" metadata={`${tx.fee.toLocaleString("vi-VN")}đ`} divider />
                <ItemListItem label="Thời gian" metadata={tx.time} divider />
                <ItemListItem label="Mã giao dịch" metadata={tx.id} />
              </ItemList>
            </div>

            {/* Repeat transaction button */}
            {(tx.type === "deposit" || tx.type === "withdraw") && (
              <div className="pt-[32px] pb-[21px]">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => router.push("/bidv-link")}
                >
                  Thực hiện lại
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Home indicator */}
      <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}

export default function TransactionDetailPage() {
  return (
    <React.Suspense fallback={null}>
      <TransactionDetailContent />
    </React.Suspense>
  )
}
