"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronLeft, ScanFace, Check, X } from "lucide-react"

export default function FaceAuth() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "scanning"
  const isUnlock = state === "unlock"
  // states: scanning, success, fail, fail-last, unlock

  React.useEffect(() => {
    if (state === "success") {
      setTimeout(() => router.push("/soft-otp/result?type=tx-success"), 800)
    }
  }, [state, router])

  const statusText = {
    scanning: "Đưa khuôn mặt vào khung",
    success: "Xác thực thành công",
    fail: "Không nhận diện được — thử lại",
    "fail-last": "Không nhận diện được",
    unlock: "Quét mặt để mở khoá xác thực giao dịch",
  }[state] ?? "Đưa khuôn mặt vào khung"

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      {/* Status bar */}
      <div className="h-[54px] px-[22px] flex items-end justify-between pb-[6px]">
        <span className="text-[15px] font-semibold">9:41</span>
        <div className="flex items-center gap-[6px]">
          <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="0.5"/><rect x="4" y="5" width="3" height="7" rx="0.5"/><rect x="8" y="2" width="3" height="10" rx="0.5"/><rect x="12" y="0" width="3" height="12" rx="0.5"/></svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="currentColor"/><path d="M4.5 7.5a5 5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M2 5a8 8 0 0 1 12 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          <div className="flex items-center gap-[1px]"><div className="w-[22px] h-[11px] rounded-[3px] border border-current flex items-center p-[1px]"><div className="flex-1 h-full bg-current rounded-[1.5px]"/></div><div className="w-[1px] h-[4px] bg-current opacity-40 rounded-full"/></div>
        </div>
      </div>

      {/* NavBar */}
      <div className="flex items-center pl-[8px] pr-[22px] h-[56px]">
        <button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full">
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* Title */}
      <div className="px-[22px] pt-[8px]">
        <h1 className="text-[24px] font-bold tracking-[-0.5px] leading-[30px]">
          {isUnlock ? "Mở khoá xác thực" : "Xác thực khuôn mặt"}
        </h1>
        <p className="text-[14px] text-foreground-secondary mt-[8px] leading-[20px]">
          {isUnlock
            ? "Tài khoản bị tạm khoá — quét mặt để bật lại xác thực giao dịch."
            : "Giao dịch giá trị lớn cần xác thực thêm bằng khuôn mặt."}
        </p>
      </div>

      {/* Camera viewport */}
      <div className="flex-1 flex flex-col items-center justify-center pt-[24px] pb-[24px]">
        <div className="relative w-[260px] h-[260px]">
          {/* Outer ring */}
          <div className={`absolute inset-0 rounded-full ${
            state === "success" ? "bg-brand-secondary/15" :
            state === "fail" || state === "fail-last" ? "bg-danger/10" :
            "bg-secondary"
          }`} />

          {/* Inner camera circle */}
          <div className="absolute inset-[16px] rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-secondary to-secondary">
            {state === "success" ? (
              <div className="w-[100px] h-[100px] rounded-full bg-brand-secondary flex items-center justify-center">
                <Check size={56} className="text-background" strokeWidth={3} />
              </div>
            ) : state === "fail" || state === "fail-last" ? (
              <div className="w-[100px] h-[100px] rounded-full bg-danger flex items-center justify-center">
                <X size={56} className="text-background" strokeWidth={3} />
              </div>
            ) : (
              <ScanFace size={140} className="text-foreground/30" strokeWidth={1} />
            )}
          </div>

          {/* Scan line animation */}
          {state === "scanning" && (
            <div
              className="absolute left-[16px] right-[16px] h-[2px] bg-brand-secondary rounded-full"
              style={{
                top: "50%",
                animation: "scan 2s ease-in-out infinite",
                boxShadow: "0 0 12px var(--brand-secondary)",
              }}
            />
          )}
        </div>

        {/* Status text */}
        <p className={`text-[15px] mt-[24px] font-semibold ${
          state === "success" ? "text-brand-secondary" :
          state === "fail" || state === "fail-last" ? "text-danger" :
          "text-foreground"
        }`}>
          {statusText}
        </p>

        {/* Attempts warning */}
        {state === "fail" && (
          <p className="text-[13px] text-foreground-secondary mt-[8px] text-center px-[40px]">
            Bạn còn <span className="font-semibold text-danger">2 lần</span> thử trước khi tài khoản bị tạm khoá.
          </p>
        )}
        {state === "fail-last" && (
          <p className="text-[13px] text-foreground-secondary mt-[8px] text-center px-[40px]">
            Bạn còn <span className="font-semibold text-danger">1 lần</span> thử trước khi tài khoản bị tạm khoá.
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="px-[22px] pb-[24px] flex flex-col gap-[8px]">
        {(state === "fail" || state === "fail-last") && (
          <button
            onClick={() => router.replace("/soft-otp/face?state=scanning")}
            className="w-full h-[48px] rounded-full bg-foreground text-background font-semibold text-[15px]"
          >
            Thử lại
          </button>
        )}
        <button className="w-full text-center text-[14px] font-semibold text-brand-secondary py-[8px]">
          Dùng cách khác
        </button>
      </div>

      <div className="flex justify-center pb-[8px]">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>

      <style jsx>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-80px); opacity: 0; }
          10%, 90% { opacity: 1; }
          50% { transform: translateY(80px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
