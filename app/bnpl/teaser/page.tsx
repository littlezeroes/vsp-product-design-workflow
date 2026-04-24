"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FixedBottom } from "@/components/ui/fixed-bottom"

/**
 * S1 · Pre-approved Teaser
 * Cash App-style reward reveal — gradient hero, massive limit typography.
 */
export default function TeaserPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "default"
  const notEligible = state === "not-eligible"

  if (notEligible) {
    return (
      <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
        <div className="h-[54px] px-6 flex items-center">
          <span className="text-[17px] font-semibold text-foreground flex-1">9:41</span>
        </div>
        <div className="h-[56px] flex items-center pl-[8px]">
          <button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full">
            <ChevronLeft size={18} />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-[22px] text-center">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-[24px]">
            <Sparkles size={28} className="text-foreground-secondary" />
          </div>
          <h1 className="text-[22px] font-bold leading-[28px] tracking-[-0.016em] mb-[8px]">
            Chưa khả dụng
          </h1>
          <p className="text-md leading-6 text-foreground-secondary max-w-[280px]">
            Tài khoản của bạn chưa đủ điều kiện đăng ký Ví trả sau. Quay lại sau hoặc hoàn tất eKYC.
          </p>
        </div>
        <FixedBottom>
          <Button variant="secondary" size="48" className="w-full" onClick={() => router.back()}>Đóng</Button>
          <div className="flex justify-center pt-[8px]"><div className="w-[139px] h-[5px] rounded-full bg-foreground" /></div>
        </FixedBottom>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-[390px] min-h-screen flex flex-col bg-background text-foreground">
      {/* HERO — gradient indigo → purple, full-bleed */}
      <div
        className="relative text-white pb-[48px]"
        style={{
          background: "linear-gradient(160deg, #1e1b4b 0%, #3730a3 45%, #6366f1 100%)",
        }}
      >
        {/* Status bar */}
        <div className="h-[54px] px-6 flex items-center">
          <span className="text-[17px] font-semibold text-white flex-1">9:41</span>
          <div className="flex items-center gap-[6px] text-white">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="0.5"/><rect x="4" y="5" width="3" height="7" rx="0.5"/><rect x="8" y="2" width="3" height="10" rx="0.5"/><rect x="12" y="0" width="3" height="12" rx="0.5"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="currentColor"/><path d="M4.5 7.5a5 5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M2 5a8 8 0 0 1 12 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            <div className="flex items-center gap-[1px]">
              <div className="w-[22px] h-[11px] rounded-[3px] border border-current flex items-center p-[1px]">
                <div className="flex-1 h-full bg-current rounded-[1.5px]" />
              </div>
              <div className="w-[1px] h-[4px] bg-current opacity-40 rounded-full" />
            </div>
          </div>
        </div>

        {/* Nav bar */}
        <div className="h-[56px] pl-[8px] pr-[22px] flex items-center">
          <button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full text-white">
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Sparkle badge */}
        <div className="px-[22px] flex items-center gap-2 mb-[16px]">
          <span className="inline-flex items-center gap-[6px] px-[10px] py-[5px] rounded-full bg-white/15 backdrop-blur">
            <Sparkles size={12} className="text-white" />
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white">
              Pre-approved
            </span>
          </span>
        </div>

        {/* Label */}
        <p className="px-[22px] text-md leading-6 text-white/70 mb-[4px]">
          Hạn mức tạm duyệt cho bạn
        </p>

        {/* MASSIVE limit number */}
        <p className="px-[22px] text-[48px] font-black leading-[52px] tracking-[-0.025em] text-white whitespace-nowrap">
          15.000.000 ₫
        </p>

        {/* Sub */}
        <p className="px-[22px] text-sm leading-5 text-white/80 mt-[12px]">
          Lãi suất từ <span className="font-semibold text-white">0%</span> · Kỳ hạn 1 / 3 / 6 / 12 tháng
        </p>

        {/* Decorative blur orbs */}
        <div
          className="absolute top-[140px] right-[-40px] w-[160px] h-[160px] rounded-full opacity-40 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-30px] left-[-30px] w-[120px] h-[120px] rounded-full opacity-30 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(192,132,252,0.6) 0%, transparent 70%)" }}
        />
      </div>

      {/* Benefits section */}
      <div className="flex-1 overflow-y-auto pb-[240px] pt-[32px]">
        <div className="px-[22px] pb-[12px]">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-foreground-secondary">
            Lợi ích khi dùng
          </p>
        </div>
        <div className="px-[22px] flex flex-col gap-[20px]">
          {[
            { k: "01", t: "Mua ngay, trả sau", d: "Thanh toán VinMart+, VinFast, VinMec… với hạn mức tới 15 triệu." },
            { k: "02", t: "Chia nhỏ theo kỳ", d: "Chọn 1, 3, 6, 12 tháng — xem breakdown trước khi chốt." },
            { k: "03", t: "Xét duyệt tức thì", d: "Tái sử dụng eKYC của Ví — không cần nộp lại giấy tờ." },
          ].map((b) => (
            <div key={b.k} className="flex gap-[14px]">
              <div className="w-[32px] h-[32px] rounded-full bg-secondary flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-foreground-secondary tracking-wide">{b.k}</span>
              </div>
              <div className="flex-1 pt-[4px]">
                <p className="text-md font-semibold leading-6 text-foreground">{b.t}</p>
                <p className="text-sm leading-5 text-foreground-secondary mt-[2px]">{b.d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div className="mt-[32px] mx-[22px] px-[16px] py-[14px] rounded-14 bg-secondary flex items-center gap-[10px]">
          <span className="text-xl">🛡️</span>
          <p className="text-xs leading-5 text-foreground-secondary">
            Đối tác tín dụng được NHNN cấp phép. Hợp đồng điện tử có giá trị pháp lý.
          </p>
        </div>
      </div>

      <FixedBottom>
        <div className="flex flex-col gap-[8px]">
          <Button variant="primary" size="48" className="w-full" onClick={() => router.push("/bnpl/intro")}>
            <span className="flex items-center gap-2">
              Bắt đầu đăng ký
              <ArrowRight size={18} />
            </span>
          </Button>
          <Button variant="secondary" size="48" className="w-full" onClick={() => router.back()}>
            Để sau
          </Button>
        </div>
        <div className="flex justify-center pt-[8px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </FixedBottom>
    </div>
  )
}
