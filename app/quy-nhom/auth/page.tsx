"use client"

import * as React from "react"
import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronLeft, Fingerprint, Delete, ScanFace, Lock } from "lucide-react"

function AuthInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const state = searchParams.get("state") ?? "pin"
  const action = searchParams.get("action") ?? "Góp"
  const amount = searchParams.get("amount") ?? "500.000"
  const fund = searchParams.get("fund") ?? "Du lịch Đà Lạt 2026"
  const returnTo = searchParams.get("return") ?? "/quy-nhom/gop?state=success"

  const [pin, setPin] = useState("")
  const [error, setError] = useState(state === "wrong-pin")
  const [attempts, setAttempts] = useState(state === "wrong-pin" ? 2 : 0)
  const isLocked = state === "locked" || attempts >= 3
  const showBiometric = state === "biometric"

  const handleNum = (n: string) => {
    if (isLocked || pin.length >= 6) return
    setError(false)
    const next = pin + n
    setPin(next)
    if (next.length === 6) {
      setTimeout(() => {
        // Simulate success for PIN "123456", else fail
        if (next === "123456") {
          router.push(returnTo)
        } else {
          const nextAttempts = attempts + 1
          setAttempts(nextAttempts)
          setError(true)
          setPin("")
        }
      }, 200)
    }
  }

  const handleDelete = () => {
    if (isLocked) return
    setError(false)
    setPin((s) => s.slice(0, -1))
  }

  const errorMessage = isLocked
    ? "Đã khoá. Thử lại sau 30 phút."
    : error
    ? `Mã PIN sai. Còn ${3 - attempts} lần thử.`
    : ""

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
      <div className="flex items-center gap-2 pl-[8px] pr-[22px] h-[56px]">
        <button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full">
          <ChevronLeft size={18} />
        </button>
        <span className="flex-1" />
      </div>

      {/* Title + context */}
      <div className="px-[22px] pt-[16px] text-center">
        <div className="text-[24px] font-bold tracking-[-0.5px]">Nhập mã PIN</div>
        <div className="text-[14px] text-foreground-secondary mt-[8px]">
          {action} <span className="font-semibold text-foreground">{amount} ₫</span>
        </div>
        <div className="text-[14px] text-foreground-secondary">
          vào quỹ <span className="font-semibold text-foreground">{fund}</span>
        </div>
      </div>

      {/* Biometric state — center icon */}
      {showBiometric ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-[16px]">
          <button className="w-[80px] h-[80px] rounded-full bg-secondary flex items-center justify-center active:scale-95 transition-transform">
            <ScanFace size={40} className="text-foreground" strokeWidth={1.5} />
          </button>
          <div className="text-[14px] text-foreground-secondary">Nhìn vào camera để xác thực</div>
          <button
            onClick={() => router.push(`/quy-nhom/auth?action=${action}&amount=${amount}&fund=${encodeURIComponent(fund)}`)}
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
                    error
                      ? "bg-danger"
                      : filled
                      ? "bg-foreground"
                      : "border-[1.5px] border-border-bold"
                  }`}
                />
              )
            })}
          </div>

          {/* Error / locked message */}
          <div className="h-[20px] pt-[16px] text-center">
            {errorMessage && (
              <span className={`text-[13px] ${isLocked ? "text-danger font-semibold" : "text-danger"}`}>
                {errorMessage}
              </span>
            )}
          </div>

          {/* Locked — lock icon */}
          {isLocked && (
            <div className="flex flex-col items-center pt-[24px]">
              <div className="w-[64px] h-[64px] rounded-full bg-secondary flex items-center justify-center mb-[12px]">
                <Lock size={28} className="text-danger" />
              </div>
              <div className="text-[14px] text-foreground-secondary text-center max-w-[280px]">
                Quá nhiều lần nhập sai. Vui lòng thử lại sau 30 phút hoặc đặt lại mã PIN.
              </div>
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
                  {/* Biometric / empty */}
                  <button
                    onClick={() => router.push(`/quy-nhom/auth?state=biometric&action=${action}&amount=${amount}&fund=${encodeURIComponent(fund)}`)}
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

                {/* Forgot PIN */}
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

      {/* Home indicator */}
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

export default function QuyNhomAuth() {
  return (
    <Suspense>
      <AuthInner />
    </Suspense>
  )
}
