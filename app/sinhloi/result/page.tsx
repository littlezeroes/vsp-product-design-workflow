"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, XCircle } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import { FeedbackState } from "@/components/ui/feedback-state"
import { formatVND, type OtpContext } from "../data"

const RESULT_COPY: Record<OtpContext, { success: string; failed: string }> = {
  activate: { success: "Kích hoạt thành công!", failed: "Kích hoạt thất bại" },
  deactivate: { success: "Đã tắt Sinh lời tự động", failed: "Không thể tắt" },
  deposit: { success: "Nạp tiền thành công", failed: "Nạp tiền thất bại" },
  withdraw: { success: "Rút tiền thành công", failed: "Rút tiền thất bại" },
}

function ResultContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const context = (searchParams.get("context") || "activate") as OtpContext
  const status = (searchParams.get("status") || "success") as "success" | "failed"
  const amount = Number(searchParams.get("amount") || 0)

  const isSuccess = status === "success"
  const copy = RESULT_COPY[context]
  const title = isSuccess ? copy.success : copy.failed
  const showBreakdown = isSuccess && (context === "deposit" || context === "withdraw") && amount > 0

  return (
    <div className="min-h-screen bg-grey-100 dark:bg-grey-900 flex flex-col items-center">
      <div className="relative w-[390px] h-[844px] bg-background text-foreground flex flex-col rounded-[40px] shadow-xl overflow-hidden mt-[16px]">

        {/* Header */}
        <Header
          variant="default"
          title="Kết quả"
          showStatusBar
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <FeedbackState
            icon={
              isSuccess ? (
                <CheckCircle size={64} className="text-success" />
              ) : (
                <XCircle size={64} className="text-destructive" />
              )
            }
            title={title}
            description={
              isSuccess
                ? (context === "deposit" || context === "withdraw")
                  ? `Giao dịch ${formatVND(amount)} đã được xử lý`
                  : undefined
                : "Vui lòng thử lại sau"
            }
          />

          {/* Breakdown card for deposit/withdraw success */}
          {showBreakdown && (
            <div className="px-[22px]">
              <div className="bg-secondary rounded-[14px] py-[8px]">
                <div className="flex items-center justify-between px-[16px] py-[8px]">
                  <span className="text-sm leading-5 text-foreground-secondary">Số tiền</span>
                  <span className="text-sm font-medium leading-5 text-foreground tabular-nums">
                    {formatVND(amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between px-[16px] py-[8px]">
                  <span className="text-sm leading-5 text-foreground-secondary">Phí</span>
                  <span className="text-sm font-medium leading-5 text-success">Miễn phí</span>
                </div>
                <div className="flex items-center justify-between px-[16px] py-[8px]">
                  <span className="text-sm leading-5 text-foreground-secondary">Nguồn</span>
                  <span className="text-sm font-medium leading-5 text-foreground">Ví V-Pay</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1" />
        </div>

        {/* Fixed bottom */}
        <div className="shrink-0 bg-background pt-[16px] flex flex-col items-center">
          <div className="w-full px-[22px] flex flex-col gap-[12px]">
            {!isSuccess && (
              <Button
                variant="secondary"
                size="48"
                className="w-full"
                onClick={() => router.back()}
              >
                Thử lại
              </Button>
            )}
            <Button
              variant="primary"
              size="48"
              className="w-full"
              onClick={() => router.push("/sinhloi")}
            >
              Về trang chủ
            </Button>
          </div>
          <div className="h-[21px] flex items-end justify-center pb-[8px]">
            <div className="w-[139px] h-[5px] bg-foreground rounded-[100px]" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResultPage() {
  return (
    <React.Suspense fallback={null}>
      <ResultContent />
    </React.Suspense>
  )
}
