"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Clock, AlertCircle, Phone } from "lucide-react"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { InformMessage } from "@/components/ui/inform-message"
import { Button } from "@/components/ui/button"

/* ── S11: Kết quả Rút tiền ─────────────────────────────────────── */
function WithdrawResultContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "success"

  const isSuccess = state === "success"
  const isPending = state === "pending"
  const isFailed = !isSuccess && !isPending

  const showRefundNotice = state === "failed-account" || state === "failed-refund" || state === "pending"

  const getTitle = () => {
    switch (state) {
      case "success": return "Giao dịch thành công"
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
            {isSuccess && (
              <p className="text-[28px] font-bold leading-[34px] text-foreground mt-[8px]">
                200.000 đ
              </p>
            )}
            {getDescription() && (
              <p className="text-sm font-normal leading-5 text-foreground-secondary mt-[4px]">
                {getDescription()}
              </p>
            )}
          </div>

          {/* Detail rows — success */}
          {isSuccess && (
            <div className="px-[20px] pb-[18px]">
              <ItemList>
                <ItemListItem label="Thời gian" metadata="09/03/2026 14:30" divider />
                <ItemListItem label="Mã giao dịch" metadata="TXN005678" showChevron divider />
                <ItemListItem label="Dịch vụ" metadata="Rút tiền" divider />
                <ItemListItem label="Rút tiền về" metadata="BIDV ****1234" divider />
                <ItemListItem label="Số tài khoản" metadata="****1234" divider />
                <ItemListItem label="Nội dung" metadata="Rút tiền từ ví" divider />
                <ItemListItem label="Phí" metadata="Miễn phí" />
              </ItemList>
            </div>
          )}
        </div>

        {/* Refund notice — failed with refund or pending */}
        {showRefundNotice && (
          <div className="pt-[16px] px-[22px]">
            <InformMessage
              hierarchy="primary"
              icon={<AlertCircle size={24} />}
              body={
                isPending
                  ? "Hoàn tiền trong tối đa 15 phút nếu giao dịch không thành công"
                  : "Tiền sẽ được hoàn về ví trong tối đa 15 phút"
              }
            />
          </div>
        )}

        {/* Pending — balance + hotline */}
        {isPending && (
          <div className="pt-[16px] px-[22px] space-y-3">
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
        )}

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

export default function WithdrawResultPage() {
  return (
    <React.Suspense fallback={null}>
      <WithdrawResultContent />
    </React.Suspense>
  )
}
