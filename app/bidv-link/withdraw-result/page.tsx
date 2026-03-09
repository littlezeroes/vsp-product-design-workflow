"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Clock, AlertCircle, Phone } from "lucide-react"
import { FeedbackState } from "@/components/ui/feedback-state"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { InformMessage } from "@/components/ui/inform-message"
import { Button } from "@/components/ui/button"

/* ── Page ──────────────────────────────────────────────────────── */
export default function WithdrawResultPage() {
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
      case "success": return "Rút tiền thành công"
      case "pending": return "Đang xử lý"
      default: return "Rút tiền không thành công"
    }
  }

  const getDescription = () => {
    switch (state) {
      case "failed-account": return "Tài khoản ngân hàng không khả dụng"
      case "failed-refund": return "Đã xảy ra lỗi. Vui lòng thử lại."
      case "failed": return "Đã xảy ra lỗi. Vui lòng thử lại."
      default: return undefined
    }
  }

  const showRefundNotice = state === "failed-account" || state === "failed-refund" || state === "pending"

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

        {/* Detail — success */}
        {state === "success" && (
          <div className="pt-[32px]">
            <div className="px-[22px]">
              <div className="bg-secondary rounded-[28px] px-[20px] py-[18px]">
                <ItemList>
                  <ItemListItem label="Tài khoản nhận" metadata="BIDV ****1234" divider />
                  <ItemListItem label="Số tiền" metadata="200.000đ" divider />
                  <ItemListItem label="Phí" metadata="0đ" divider />
                  <ItemListItem label="Thời gian" metadata="09/03/2026 14:30" divider />
                  <ItemListItem label="Mã giao dịch" metadata="TXN005678" />
                </ItemList>
              </div>
            </div>
          </div>
        )}

        {/* Refund notice — failed with refund or pending */}
        {showRefundNotice && (
          <div className="pt-[32px]">
            <div className="px-[22px]">
              <InformMessage
                hierarchy="primary"
                icon={<AlertCircle size={24} />}
                body={
                  state === "pending"
                    ? "Hoàn tiền trong tối đa 15 phút nếu giao dịch không thành công"
                    : "Tiền sẽ được hoàn về ví trong tối đa 15 phút"
                }
              />
            </div>
          </div>
        )}

        {/* Pending — balance + hotline */}
        {state === "pending" && (
          <div className="pt-[16px]">
            <div className="px-[22px] space-y-3">
              <p className="text-sm font-normal leading-5 text-foreground-secondary">
                Số dư hiện tại: 1.300.000đ
              </p>
              <Button
                variant="secondary"
                size="32"
                className="gap-[6px]"
                onClick={() => {/* hotline */}}
              >
                <Phone size={16} />
                Liên hệ hỗ trợ
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Fixed CTAs */}
      <div className="absolute bottom-0 inset-x-0 bg-background px-[22px] pb-[34px] pt-[12px] space-y-3">
        {state === "success" && (
          <Button variant="primary" size="48" className="w-full" onClick={() => router.push("/")}>
            Về trang chủ
          </Button>
        )}
        {state === "pending" && (
          <Button variant="primary" size="48" className="w-full" onClick={() => router.push("/")}>
            Về trang chủ
          </Button>
        )}
        {(state === "failed" || state === "failed-account" || state === "failed-refund") && (
          <>
            <Button variant="primary" size="48" className="w-full" onClick={() => router.push("/bidv-link/withdraw-auth")}>
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
