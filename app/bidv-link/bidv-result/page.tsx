"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { FeedbackState } from "@/components/ui/feedback-state"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { Button } from "@/components/ui/button"

/* ── Page ──────────────────────────────────────────────────────── */
export default function BidvResultPage() {
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
      case "success": return "Liên kết BIDV thành công"
      case "pending": return "Đang xử lý"
      case "failed-cancel": return "Liên kết không thành công"
      case "failed-timeout": return "Liên kết không thành công"
      default: return "Liên kết không thành công"
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
      {/* No header back button on result screens */}
      <div className="h-[44px]" />

      <div className="flex-1 overflow-y-auto pb-[160px]">
        {/* Feedback */}
        <div className="px-[22px]">
          <FeedbackState
            icon={getIcon()}
            title={getTitle()}
            description={getDescription()}
          />
        </div>

        {/* Detail — only for success */}
        {state === "success" && (
          <div className="pt-[32px]">
            <div className="px-[22px]">
              <div className="bg-secondary rounded-[28px] px-[20px] py-[18px]">
                <ItemList>
                  <ItemListItem
                    label="Ngân hàng"
                    metadata="BIDV"
                    divider
                  />
                  <ItemListItem
                    label="Số tài khoản"
                    metadata="****1234"
                  />
                </ItemList>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed CTAs */}
      <div className="absolute bottom-0 inset-x-0 bg-background px-[22px] pb-[34px] pt-[12px] space-y-3">
        {state === "success" && (
          <>
            <Button
              variant="primary"
              size="48"
              className="w-full"
              onClick={() => router.push("/bidv-link/deposit")}
            >
              Nạp tiền ngay
            </Button>
            <Button
              variant="secondary"
              size="48"
              className="w-full"
              onClick={() => router.push("/")}
            >
              Về trang chủ
            </Button>
          </>
        )}
        {state === "pending" && (
          <Button
            variant="primary"
            size="48"
            className="w-full"
            onClick={() => router.push("/")}
          >
            Về trang chủ
          </Button>
        )}
        {(state === "failed" || state === "failed-cancel" || state === "failed-timeout") && (
          <>
            <Button
              variant="primary"
              size="48"
              className="w-full"
              onClick={() => router.push("/bidv-link/bidv-form")}
            >
              Thử lại
            </Button>
            <Button
              variant="secondary"
              size="48"
              className="w-full"
              onClick={() => router.push("/")}
            >
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
