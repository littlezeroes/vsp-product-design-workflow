"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronLeft, Fingerprint, Delete, Lock } from "lucide-react"

export default function SoftOtpPin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "default"
  const action = searchParams.get("action") ?? "activate"
  // action: activate | deactivate | confirm-tx
  // states: default, error, last-attempt, locked, biometric

  const [pin, setPin] = React.useState("")
  const isError = state === "error" || state === "last-attempt"
  const isLocked = state === "locked"
  const isBiometric = state === "biometric"
  const attemptsLeft = state === "last-attempt" ? 1 : state === "error" ? 2 : 0

  const contextLine = {
    activate: "Bật xác thực bằng Soft OTP",
    deactivate: "Tắt xác thực bằng Soft OTP",
    "confirm-tx": "Xác thực giao dịch 500.000 ₫",
  }[action] ?? "Xác thực bằng PIN"

  const handleNum = (n: string) => {
    if (isLocked || pin.length >= 6) return
    const next = pin + n
    setPin(next)
    if (next.length === 6) {
      setTimeout(() => {
        if (action === "activate") router.push("/soft-otp/sms-otp")
        else if (action === "deactivate") router.push("/soft-otp/result?type=deactivated")
        else router.push("/soft-otp/otp")
      }, 200)
    }
  }

  const handleDelete = () => {
    if (isLocked) return
    setPin((s) => s.slice(0, -1))
  }

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

      {/* Title + context */}
      <div className="px-[22px] pt-[16px] text-center">
        <div className="text-[24px] font-bold tracking-[-0.5px]">Nhập mã PIN đăng nhập</div>
        <div className="text-[14px] text-foreground-secondary mt-[8px]">
          {contextLine}
        </div>
      </div>

      {/* Biometric prompt */}
      {isBiometric ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-[16px]">
          <button className="w-[80px] h-[80px] rounded-full bg-secondary flex items-center justify-center active:scale-95 transition-transform">
            <Fingerprint size={40} className="text-foreground" strokeWidth={1.5} />
          </button>
          <div className="text-[14px] text-foreground-secondary">Chạm để xác thực bằng vân tay</div>
          <button
            onClick={() => router.replace(`/soft-otp/pin?action=${action}`)}
            className="text-[14px] font-semibold text-brand-secondary"
          >
            Dùng mã PIN
          </button>
        </div>
      ) : (
        <>
          {/* PIN dots */}
          <div className="pt-[40px] flex justify-center gap-[16px]">
            {Array.from({ length: 6 }).map((_, i) => {
              const filled = i < pin.length
              return (
                <div
                  key={i}
                  className={`w-[16px] h-[16px] rounded-full transition-colors ${
                    isError
                      ? "bg-danger"
                      : filled
                      ? "bg-foreground"
                      : "border-[1.5px] border-border"
                  }`}
                />
              )
            })}
          </div>

          {/* Hint */}
          <div className="min-h-[40px] pt-[16px] text-center px-[40px]">
            {isLocked ? (
              <span className="text-[13px] text-danger font-semibold">
                Tài khoản tạm khoá. Vui lòng thử lại sau 30 phút hoặc xác thực bằng khuôn mặt.
              </span>
            ) : isError ? (
              <span className="text-[13px] text-danger">
                Mã PIN không đúng. Bạn còn {attemptsLeft} lần nhập trước khi tài khoản bị tạm khoá.
              </span>
            ) : null}
          </div>

          {/* Locked icon */}
          {isLocked && (
            <div className="flex flex-col items-center pt-[24px]">
              <div className="w-[64px] h-[64px] rounded-full bg-secondary flex items-center justify-center mb-[12px]">
                <Lock size={28} className="text-danger" />
              </div>
              <button
                onClick={() => router.push("/soft-otp/face?state=unlock")}
                className="text-[14px] font-semibold text-brand-secondary mt-[8px]"
              >
                Xác thực bằng khuôn mặt →
              </button>
            </div>
          )}

          {/* Numpad */}
          {!isLocked && (
            <div className="flex-1 flex items-end pb-[24px]">
              <div className="w-full px-[32px]">
                <div className="grid grid-cols-3 gap-y-[14px] gap-x-[48px]">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
                    <NumpadButton key={n} onClick={() => handleNum(n)}>{n}</NumpadButton>
                  ))}
                  <button
                    onClick={() => router.replace(`/soft-otp/pin?state=biometric&action=${action}`)}
                    className="h-[64px] flex items-center justify-center active:bg-secondary rounded-full transition-colors"
                    aria-label="Biometric"
                  >
                    <Fingerprint size={28} className="text-foreground" strokeWidth={1.5} />
                  </button>
                  <NumpadButton onClick={() => handleNum("0")}>0</NumpadButton>
                  <button
                    onClick={handleDelete}
                    disabled={pin.length === 0}
                    className="h-[64px] flex items-center justify-center active:bg-secondary rounded-full disabled:opacity-30 transition-colors"
                    aria-label="Xoá"
                  >
                    <Delete size={26} className="text-foreground" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="text-center pt-[20px]">
                  <button className="text-[13px] text-foreground-secondary font-medium">
                    Quên mã PIN?
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex justify-center pb-[8px]">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}

function NumpadButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-[64px] flex items-center justify-center text-[28px] font-light active:bg-secondary rounded-full transition-colors"
    >
      {children}
    </button>
  )
}
