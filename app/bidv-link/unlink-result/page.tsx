"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { FeedbackState } from "@/components/ui/feedback-state"
import { Button } from "@/components/ui/button"

/* ── Page ──────────────────────────────────────────────────────── */
export default function UnlinkResultPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "success"

  const getIcon = () => {
    switch (state) {
      case "success":
        return (
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle size={36} className="text-success" />
          </div>
        )
      case "pending":
        return (
          <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center">
            <Clock size={36} className="text-warning" />
          </div>
        )
      default:
        return (
          <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center">
            <XCircle size={36} className="text-danger" />
          </div>
        )
    }
  }

  const getTitle = () => {
    switch (state) {
      case "success": return "Đã hủy liên kết BIDV"
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

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <div className="h-[44px]" />

      <div className="flex-1 overflow-y-auto pb-[160px]">
        <div className="px-[22px]">
          <FeedbackState
            icon={getIcon()}
            title={getTitle()}
            description={getDescription()}
          />
        </div>
      </div>

      {/* Fixed CTAs */}
      <div className="absolute bottom-0 inset-x-0 bg-background px-[22px] pb-[34px] pt-[12px] space-y-3">
        {(state === "success" || state === "pending") && (
          <Button variant="primary" size="48" className="w-full" onClick={() => router.push("/")}>
            Về trang chủ
          </Button>
        )}
        {(state === "failed" || state === "failed-cancel" || state === "failed-timeout") && (
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
