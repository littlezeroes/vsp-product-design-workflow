"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Wallet, Copy, Headphones, Check, X, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FixedBottom } from "@/components/ui/fixed-bottom"

/**
 * S8 · Kết quả thanh toán — V-Smart Save receipt pattern (A)
 * Guilloche pattern hero + GREEN amount + flow visualization + detail list
 */

function Guilloche({ className = "" }: { className?: string }) {
  // Subtle rosette/guilloche security pattern SVG — ~8% opacity
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      viewBox="0 0 390 340"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <g opacity="0.09" stroke="var(--foreground)" strokeWidth="0.4" fill="none">
        {Array.from({ length: 18 }).map((_, i) => (
          <ellipse
            key={i}
            cx="195" cy="170"
            rx={70 + i * 6}
            ry={60 + i * 4}
            transform={`rotate(${i * 10} 195 170)`}
          />
        ))}
        {Array.from({ length: 24 }).map((_, i) => (
          <circle
            key={`c${i}`}
            cx="195" cy="170"
            r={i * 7 + 5}
          />
        ))}
      </g>
    </svg>
  )
}

export default function CheckoutResultPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const status = searchParams.get("status") ?? "success"
  const isSuccess = status === "success"

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Status bar */}
      <div className="h-[54px] px-6 flex items-center shrink-0">
        <span className="text-[17px] font-semibold text-foreground flex-1">9:41</span>
        <div className="flex items-center gap-[6px] text-foreground">
          <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="0.5"/><rect x="4" y="5" width="3" height="7" rx="0.5"/><rect x="8" y="2" width="3" height="10" rx="0.5"/><rect x="12" y="0" width="3" height="12" rx="0.5"/></svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="currentColor"/><path d="M4.5 7.5a5 5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M2 5a8 8 0 0 1 12 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          <div className="flex items-center gap-[1px]">
            <div className="w-[22px] h-[11px] rounded-[3px] border border-current flex items-center p-[1px]"><div className="flex-1 h-full bg-current rounded-[1.5px]" /></div>
            <div className="w-[1px] h-[4px] bg-current opacity-40 rounded-full" />
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <div className="h-[56px] pl-[8px] pr-[22px] flex items-center shrink-0">
        <button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full">
          <ChevronLeft size={18} />
        </button>
        <span className="flex-1 text-md font-bold text-center text-foreground">Chi tiết giao dịch</span>
        <button onClick={() => router.push("/")} className="p-[10px] min-h-[44px] rounded-full">
          <Home size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-[240px]">
        {/* Hero with guilloche pattern */}
        <div className="relative pt-[24px] pb-[32px]">
          <Guilloche />
          <div className="relative flex flex-col items-center">
            <div className="w-[56px] h-[56px] rounded-full bg-secondary flex items-center justify-center mb-[16px]">
              <Wallet size={24} className="text-foreground" strokeWidth={1.8} />
            </div>
            <p className="text-md leading-6 text-foreground-secondary text-center mb-[8px]">
              {isSuccess ? "Thanh toán tới" : "Giao dịch thất bại"}
            </p>
            <p className="text-lg font-semibold leading-7 text-foreground mb-[12px]">VinMart+</p>
            <p className={`text-[40px] font-black leading-[48px] tracking-[-0.02em] ${isSuccess ? "text-success" : "text-foreground-secondary"}`}>
              {isSuccess ? "-1.890.000 ₫" : "Thất bại"}
            </p>
            <div className="mt-[12px] flex items-center gap-[6px]">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSuccess ? "bg-success" : "bg-danger"}`}>
                {isSuccess ? <Check size={12} className="text-background" strokeWidth={3} /> : <X size={12} className="text-white" strokeWidth={3} />}
              </div>
              <span className="text-sm font-medium leading-5 text-foreground-secondary">
                {isSuccess ? "Thành công" : "Vui lòng thử lại"}
              </span>
            </div>
          </div>
        </div>

        {/* Flow card: BNPL → Merchant */}
        <div className="px-[22px]">
          <div className="bg-secondary rounded-28 px-[16px] py-[14px]">
            <div className="flex items-center gap-[12px]">
              <div className="w-[44px] h-[44px] rounded-full bg-foreground flex items-center justify-center shrink-0">
                <span className="text-xs font-black text-background">BNPL</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-md font-semibold leading-6 text-foreground truncate">Ví trả sau</p>
                <p className="text-sm leading-5 text-foreground-secondary truncate">
                  Kỳ hạn 3 tháng · 637.350 ₫/kỳ
                </p>
              </div>
            </div>
            <div className="py-[4px] flex justify-center">
              <svg width="16" height="20" viewBox="0 0 16 20" fill="none" className="text-foreground-secondary">
                <path d="M8 2v16m0 0l-5-5m5 5l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex items-center gap-[12px]">
              <div className="w-[44px] h-[44px] rounded-full bg-background flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-foreground">VM</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-md font-semibold leading-6 text-foreground truncate">VinMart+</p>
                <p className="text-sm leading-5 text-foreground-secondary truncate">Tạp hoá · Merchant ID 4021</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detail list card */}
        <div className="px-[22px] pt-[16px]">
          <div className="bg-secondary rounded-28 px-[16px] py-[8px]">
            {[
              { k: "Mã giao dịch", v: "BNPL2604031", copy: true },
              { k: "Thời gian", v: "09:41 · 19/04/2026" },
              { k: "Số tiền", v: "1.890.000 ₫" },
              { k: "Kỳ trả đầu tiên", v: "20/05/2026" },
              { k: "Phí dịch vụ", v: "Miễn phí" },
            ].map((row, i, arr) => (
              <div
                key={row.k}
                className={`flex items-center justify-between py-[12px] ${i < arr.length - 1 ? "border-b border-background" : ""}`}
              >
                <span className="text-sm leading-5 text-foreground-secondary">{row.k}</span>
                <div className="flex items-center gap-[8px]">
                  <span className="text-sm font-semibold leading-5 text-foreground">{row.v}</span>
                  {row.copy && (
                    <button className="text-foreground-secondary">
                      <Copy size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Limit updated — only on success */}
        {isSuccess && (
          <div className="px-[22px] pt-[16px]">
            <div className="bg-background border border-border rounded-28 px-[16px] py-[14px]">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-foreground-secondary mb-[8px]">
                Hạn mức Ví trả sau còn lại
              </p>
              <div className="flex items-baseline gap-[6px] mb-[10px]">
                <span className="text-[22px] font-bold leading-7 text-foreground">10.910.000 ₫</span>
                <span className="text-xs text-foreground-secondary">/ 15.000.000 ₫</span>
              </div>
              <div className="h-[4px] rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-foreground" style={{ width: "27%" }} />
              </div>
            </div>
          </div>
        )}

        {/* Support row */}
        <div className="px-[22px] pt-[16px]">
          <button className="w-full bg-secondary rounded-28 px-[16px] py-[14px] flex items-center gap-[12px]">
            <div className="w-[44px] h-[44px] rounded-full bg-background flex items-center justify-center shrink-0">
              <Headphones size={18} className="text-foreground" strokeWidth={1.8} />
            </div>
            <span className="flex-1 text-left text-md font-semibold leading-6 text-foreground">
              Gửi yêu cầu hỗ trợ
            </span>
            <ChevronRight size={18} className="text-foreground-secondary" />
          </button>
        </div>
      </div>

      <FixedBottom>
        <div className="flex flex-col gap-[8px]">
          <Button variant="primary" size="48" className="w-full" onClick={() => router.push(isSuccess ? "/bnpl/dashboard" : "/bnpl/checkout/source")}>
            {isSuccess ? "Xem khoản vay" : "Thử lại"}
          </Button>
          <Button variant="secondary" size="48" className="w-full" onClick={() => router.push("/")}>
            Về trang chủ
          </Button>
        </div>
        <div className="flex justify-center pt-[8px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </FixedBottom>
    </div>
  )
}
