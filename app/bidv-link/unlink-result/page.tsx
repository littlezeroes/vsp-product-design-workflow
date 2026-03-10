"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { Button } from "@/components/ui/button"

/* ── S14: Kết quả Hủy liên kết ─────────────────────────────────── */
function UnlinkResultContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "success"

  const isSuccess = state === "success"
  const isPending = state === "pending"
  const isFailed = !isSuccess && !isPending

  const getTitle = () => {
    switch (state) {
      case "success": return "Đã hủy liên kết"
      case "pending": return "Đang xử lý"
      default: return "Hủy liên kết không thành công"
    }
  }

  const getDescription = () => {
    switch (state) {
      case "pending": return "Kết quả sẽ được thông báo qua tin nhắn"
      case "failed-cancel": return "Bạn đã hủy xác thực trên BIDV SmartBanking"
      case "failed-timeout": return "Hết thời gian xác thực. Vui lòng thử lại."
      case "failed": return "Đã xảy ra lỗi. Vui lòng thử lại."
      default: return undefined
    }
  }

  const getIcon = () => {
    if (isSuccess) return <CheckCircle size={48} className="text-success" />
    if (isPending) return <Clock size={48} className="text-warning" />
    return <XCircle size={48} className="text-danger" />
  }

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-secondary text-foreground flex flex-col">
      {/* Dark header */}
      <div className="bg-foreground pt-[44px] pb-[60px] flex items-center justify-center">
        <span className="text-background text-lg font-semibold leading-6 tracking-[-0.005em]">
          V-Smart Pay
        </span>
      </div>

      {/* White card — overlaps dark header */}
      <div className="flex-1 flex flex-col -mt-[32px]">
        <div className="mx-[22px] bg-background rounded-[28px] overflow-hidden">
          {/* Status section */}
          <div className="flex flex-col items-center text-center pt-[32px] pb-[24px] px-[24px]">
            <div className="w-16 h-16 flex items-center justify-center mb-[16px]">
              {getIcon()}
            </div>
            <h3 className="text-lg font-medium leading-6 tracking-[-0.005em] text-foreground">
              {getTitle()}
            </h3>
            {getDescription() && (
              <p className="text-sm font-normal leading-5 text-foreground-secondary mt-[4px]">
                {getDescription()}
              </p>
            )}
          </div>

          {/* Detail rows — success only */}
          {isSuccess && (
            <div className="px-[20px] pb-[18px]">
              <ItemList>
                <ItemListItem label="Ngân hàng" metadata="BIDV" divider />
                <ItemListItem label="Số tài khoản" metadata="****1234" divider />
                <ItemListItem label="Thời gian" metadata="09/03/2026 14:30" />
              </ItemList>
            </div>
          )}
        </div>

        {/* Spacer to push CTA to bottom */}
        <div className="flex-1" />
      </div>

      {/* Fixed CTAs */}
      <div className="shrink-0 bg-secondary px-[22px] pb-[34px] pt-[12px] space-y-3">
        {(isSuccess || isPending) && (
          <Button variant="primary" size="48" className="w-full" onClick={() => router.push("/")}>
            Về trang chủ
          </Button>
        )}
        {isFailed && (
          <>
            <Button variant="primary" size="48" className="w-full" onClick={() => router.push("/bidv-link/bank-detail")}>
              Thử lại
            </Button>
            <Button variant="secondary" size="48" className="w-full" onClick={() => router.push("/")}>
              Về trang chủ
            </Button>
          </>
        )}
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}

export default function UnlinkResultPage() {
  return (
    <React.Suspense fallback={null}>
      <UnlinkResultContent />
    </React.Suspense>
  )
}
