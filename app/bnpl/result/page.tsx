"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, Clock, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FixedBottom } from "@/components/ui/fixed-bottom"

/**
 * S5 · Kết quả phê duyệt
 * Approved: gradient hero celebration. Rejected/pending: minimal centered.
 */
export default function ResultPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const status = searchParams.get("status") ?? "approved"

  if (status === "approved") {
    return (
      <div className="relative w-full max-w-[390px] min-h-screen flex flex-col bg-background text-foreground">
        {/* Full-bleed gradient celebration — scrollable area */}
        <div
          className="relative flex-1 flex flex-col text-white overflow-y-auto pb-[200px]"
          style={{ background: "linear-gradient(160deg, #064e3b 0%, #047857 45%, #10b981 100%)" }}
        >
          <div className="h-[54px] px-6 flex items-center">
            <span className="text-[17px] font-semibold text-white flex-1">9:41</span>
          </div>
          <div className="h-[56px]" />

          <div className="flex-1 flex flex-col items-center justify-center px-[22px]">
            {/* Big check icon with pulse ring */}
            <div className="relative mb-[32px]">
              <div className="absolute inset-0 rounded-full bg-white/20 blur-2xl scale-150" />
              <div className="relative w-[100px] h-[100px] rounded-full bg-white flex items-center justify-center">
                <Check size={52} className="text-success" strokeWidth={2.5} />
              </div>
            </div>

            <span className="inline-flex items-center gap-[6px] px-[10px] py-[5px] rounded-full bg-white/15 backdrop-blur mb-[16px]">
              <Sparkles size={12} className="text-white" />
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white">
                Phê duyệt thành công
              </span>
            </span>

            <p className="text-md leading-6 text-white/80 text-center mb-[6px]">
              Hạn mức được cấp
            </p>
            <p className="text-[48px] font-black leading-[52px] tracking-[-0.025em] text-white whitespace-nowrap">
              15.000.000 ₫
            </p>
            <p className="text-sm leading-5 text-white/70 mt-[16px] text-center max-w-[300px]">
              Bắt đầu thanh toán Vingroup, VinFast, VinMec… ngay hôm nay.
            </p>
          </div>

          {/* Decorative orbs */}
          <div
            className="absolute top-[100px] right-[-50px] w-[200px] h-[200px] rounded-full opacity-40 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-[80px] left-[-40px] w-[140px] h-[140px] rounded-full opacity-30 pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(110,231,183,0.6) 0%, transparent 70%)" }}
          />
        </div>

        <FixedBottom>
          <div className="flex flex-col gap-[8px]">
            <Button variant="primary" size="48" className="w-full" onClick={() => router.push("/bnpl/dashboard")}>
              Bắt đầu dùng ngay
            </Button>
            <Button variant="secondary" size="48" className="w-full" onClick={() => router.push("/")}>
              Về trang chủ
            </Button>
          </div>
          <div className="flex justify-center pt-[8px]"><div className="w-[139px] h-[5px] rounded-full bg-foreground" /></div>
        </FixedBottom>
      </div>
    )
  }

  const isRejected = status === "rejected"

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <div className="h-[54px] px-6 flex items-center">
        <span className="text-[17px] font-semibold text-foreground flex-1">9:41</span>
      </div>
      <div className="h-[56px]" />

      <div className="flex-1 flex flex-col items-center justify-center px-[22px] text-center pb-[140px]">
        <div
          className={`w-[96px] h-[96px] rounded-full flex items-center justify-center mb-[32px] ${
            isRejected ? "bg-danger" : "bg-secondary"
          }`}
        >
          {isRejected ? (
            <X size={48} className="text-white" strokeWidth={2.5} />
          ) : (
            <Clock size={44} className="text-foreground-secondary" />
          )}
        </div>

        <h1 className="text-[28px] font-bold leading-[36px] tracking-[-0.02em] mb-[12px]">
          {isRejected ? "Không đủ điều kiện" : "Đang xét duyệt"}
        </h1>
        <p className="text-md leading-6 text-foreground-secondary max-w-[300px]">
          {isRejected
            ? "Hồ sơ chưa đủ điều kiện cấp hạn mức. Bạn có thể đăng ký lại sau 30 ngày."
            : "Hồ sơ cần thẩm định thêm. Kết quả sẽ được gửi trong 24 giờ qua thông báo."}
        </p>
      </div>

      <FixedBottom>
        <div className="flex flex-col gap-[8px]">
          <Button variant="primary" size="48" className="w-full" onClick={() => router.push("/")}>
            {isRejected ? "Về trang chủ" : "Đã hiểu"}
          </Button>
          {isRejected && (
            <Button variant="secondary" size="48" className="w-full">
              Liên hệ hỗ trợ
            </Button>
          )}
        </div>
        <div className="flex justify-center pt-[8px]"><div className="w-[139px] h-[5px] rounded-full bg-foreground" /></div>
      </FixedBottom>
    </div>
  )
}
