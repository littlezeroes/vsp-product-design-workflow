"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, FileText, Download } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import { FixedBottom } from "@/components/ui/fixed-bottom"
import { PinInput } from "@/components/ui/pin-input"

/**
 * S4: Ký hợp đồng + OTP
 * Contract review → e-sign via OTP
 * States: review (default), otp-empty, otp-wrong, otp-loading
 */
export default function ContractPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "review"

  const [otp, setOtp] = React.useState(state === "otp-wrong" ? "123456" : "")
  const isReview = state === "review"
  const isOtpWrong = state === "otp-wrong"
  const isOtpLoading = state === "otp-loading"

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header
        variant="large-title"
        largeTitle={isReview ? "Hợp đồng cấp hạn mức" : "Xác thực ký hợp đồng"}
        description={isReview ? "Đọc kỹ trước khi ký" : "Nhập mã OTP gửi tới +84 ••• 4231"}
        leading={
          <button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full">
            <ChevronLeft size={18} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto pb-[240px]">
        {isReview ? (
          <>
            {/* Contract summary */}
            <div className="px-[22px] pt-[16px]">
              <div className="bg-secondary rounded-28 px-[16px] py-[16px] flex items-center gap-[12px]">
                <div className="w-11 h-11 rounded-full bg-background flex items-center justify-center shrink-0">
                  <FileText size={20} className="text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-md font-semibold leading-6 text-foreground truncate">
                    Hợp đồng cấp hạn mức BNPL
                  </p>
                  <p className="text-sm leading-5 text-foreground-secondary">PDF · 248 KB</p>
                </div>
                <button className="shrink-0 p-[10px] rounded-full bg-background">
                  <Download size={18} className="text-foreground" />
                </button>
              </div>
            </div>

            {/* Key terms */}
            <div className="pt-[32px]">
              <div className="px-[22px] pt-[24px] pb-[12px]">
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                  Điều khoản chính
                </p>
              </div>
              <div className="px-[22px]">
                {[
                  ["Hạn mức được cấp", "15.000.000 ₫"],
                  ["Lãi suất kỳ 1 tháng", "0%"],
                  ["Lãi suất kỳ 3-12 tháng", "1.5% / tháng"],
                  ["Phí xử lý", "0.5% / giao dịch"],
                  ["Phí phạt quá hạn", "150.000 ₫ / kỳ"],
                  ["Hiệu lực hạn mức", "12 tháng kể từ ngày ký"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-[12px] border-b border-border last:border-b-0">
                    <span className="text-sm leading-5 text-foreground-secondary">{k}</span>
                    <span className="text-sm font-semibold leading-5 text-foreground">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-[22px] pt-[20px]">
              <p className="text-xs leading-5 text-foreground-secondary">
                Bằng việc ký kết, bạn xác nhận đã đọc và đồng ý toàn bộ điều khoản hợp đồng. Hợp đồng có giá trị pháp lý tương đương chữ ký tay.
              </p>
            </div>
          </>
        ) : (
          <div className="px-[22px] pt-[40px] flex flex-col items-center">
            <PinInput length={6} value={otp} onChange={setOtp} error={isOtpWrong} />
            {isOtpWrong && (
              <p className="text-sm text-danger mt-[16px]">Mã OTP không đúng. Còn 2 lần thử.</p>
            )}
            <button className="mt-[24px] text-sm font-semibold text-success">
              Gửi lại mã (00:48)
            </button>
          </div>
        )}
      </div>

      <FixedBottom>
        {isReview ? (
          <Button
            variant="primary"
            size="48"
            className="w-full"
            onClick={() => router.push("/bnpl/contract?state=otp-empty")}
          >
            Ký hợp đồng bằng OTP
          </Button>
        ) : (
          <Button
            variant="primary"
            size="48"
            className="w-full"
            disabled={otp.length < 6 && !isOtpLoading}
            isLoading={isOtpLoading}
            onClick={() => router.push("/bnpl/result?status=approved")}
          >
            Xác nhận ký
          </Button>
        )}
        <div className="flex justify-center pt-[8px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </FixedBottom>
    </div>
  )
}
