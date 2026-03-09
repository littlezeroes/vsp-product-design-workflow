"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, Loader2 } from "lucide-react"
import { Header } from "@/components/ui/header"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { FeedbackState } from "@/components/ui/feedback-state"

/* ── Mock data ─────────────────────────────────────────────────── */
const MOCK_TX = {
  id: "TXN001234",
  type: "Nạp tiền",
  status: "success" as const,
  amount: 200000,
  fee: 0,
  bank: "BIDV",
  account: "****1234",
  time: "09/03/2026 14:30",
}

function getStatusBadge(status: string) {
  switch (status) {
    case "success":
      return (
        <span className="inline-flex px-[10px] py-[4px] rounded-full text-xs font-semibold bg-success/10 text-success">
          Thành công
        </span>
      )
    case "pending":
      return (
        <span className="inline-flex px-[10px] py-[4px] rounded-full text-xs font-semibold bg-warning/10 text-warning">
          Đang xử lý
        </span>
      )
    case "failed":
      return (
        <span className="inline-flex px-[10px] py-[4px] rounded-full text-xs font-semibold bg-danger/10 text-danger">
          Thất bại
        </span>
      )
    default:
      return null
  }
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function TransactionDetailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "loaded"
  const txStatus = searchParams.get("txStatus") ?? "success"

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header
        variant="default"
        title="Chi tiết giao dịch"
        leading={
          <button
            type="button"
            onClick={() => router.push("/bidv-link/transactions")}
            className="w-[44px] h-[44px] flex items-center justify-center rounded-full"
          >
            <ChevronLeft size={18} className="text-foreground" />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto pb-[21px]">
        {/* Loading */}
        {state === "loading" && (
          <div className="flex items-center justify-center pt-[80px]">
            <Loader2 size={32} className="text-foreground-secondary animate-spin" />
          </div>
        )}

        {/* Error */}
        {state === "error" && (
          <div className="pt-[32px] px-[22px]">
            <FeedbackState
              title="Không thể tải chi tiết"
              description="Vui lòng kiểm tra kết nối và thử lại."
              actionLabel="Thử lại"
              actionProps={{ onClick: () => router.refresh() }}
            />
          </div>
        )}

        {/* Loaded */}
        {(state === "loaded" || state === "status-updated") && (
          <>
            {/* Amount + Status */}
            <div className="px-[22px] pt-[32px] flex flex-col items-center">
              <p className="text-[40px] font-bold tabular-nums text-foreground leading-tight">
                +{MOCK_TX.amount.toLocaleString("vi-VN")}đ
              </p>
              <div className="mt-[8px]">
                {getStatusBadge(txStatus)}
              </div>
            </div>

            {/* Detail rows */}
            <div className="pt-[32px]">
              <div className="px-[22px]">
                <div className="bg-secondary rounded-[28px] px-[20px] py-[18px]">
                  <ItemList>
                    <ItemListItem label="Loại giao dịch" metadata={MOCK_TX.type} divider />
                    <ItemListItem label="Ngân hàng" metadata={MOCK_TX.bank} divider />
                    <ItemListItem label="Số tài khoản" metadata={MOCK_TX.account} divider />
                    <ItemListItem label="Phí" metadata={`${MOCK_TX.fee.toLocaleString("vi-VN")}đ`} divider />
                    <ItemListItem label="Thời gian" metadata={MOCK_TX.time} divider />
                    <ItemListItem label="Mã giao dịch" metadata={MOCK_TX.id} />
                  </ItemList>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] bg-background pointer-events-none">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}
