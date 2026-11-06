"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { PinInput } from "@/components/ui/pin-input"
import { Button } from "@/components/ui/button"
import { FixedBottom } from "@/components/ui/fixed-bottom"

export default function SmsOtp() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "default"
  // states: default, error, expired, resent

  const [otp, setOtp] = React.useState(state === "error" ? "123456" : state === "expired" ? "" : "")
  const isError = state === "error"
  const isExpired = state === "expired"
  const isResendBlocked = state === "resend-blocked"
  const [resendCooldown, setResendCooldown] = React.useState(state === "resent" ? 30 : 0)
  const [timer, setTimer] = React.useState(isExpired ? 0 : state === "resent" ? 110 : 95)
  const [resendsLeft, setResendsLeft] = React.useState(state === "resent" ? 2 : isResendBlocked ? 0 : 3)

  React.useEffect(() => {
    if (timer > 0) {
      const id = setTimeout(() => setTimer((t) => t - 1), 1000)
      return () => clearTimeout(id)
    }
  }, [timer])

  React.useEffect(() => {
    if (resendCooldown > 0) {
      const id = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
      return () => clearTimeout(id)
    }
  }, [resendCooldown])

  const minutes = Math.floor(timer / 60)
  const seconds = timer % 60
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`

  const handleSubmit = () => {
    if (otp.length === 6) router.push("/soft-otp/result?type=activated")
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

      {/* Title */}
      <div className="px-[22px] pt-[16px]">
        <h1 className="text-[28px] font-bold tracking-[-0.5px] leading-[34px]">Nhập mã xác thực</h1>
        <p className="text-[14px] text-foreground-secondary mt-[8px] leading-[20px]">
          Đã gửi mã xác thực đến số <span className="font-semibold text-foreground">+84 ••• 234</span>.
          Mã có hiệu lực trong 2 phút.
        </p>
      </div>

      {/* PIN input */}
      <div className="pt-[40px]">
        <PinInput length={6} value={otp} onChange={setOtp} error={isError || isExpired} />
      </div>

      {/* Timer / error message */}
      <div className="min-h-[40px] pt-[16px] text-center px-[24px]">
        {isError ? (
          <p className="text-[13px] text-danger leading-[18px]">
            Mã OTP không đúng hoặc đã hết hạn. Bạn còn 2 lần nhập trước khi tài khoản bị tạm khoá.
          </p>
        ) : isExpired ? (
          <p className="text-[13px] text-danger leading-[18px]">
            Mã OTP đã hết hiệu lực. Vui lòng yêu cầu mã mới.
          </p>
        ) : (
          <p className={`text-[13px] leading-[18px] ${timer < 30 ? "text-danger font-medium" : "text-foreground-secondary"}`}>
            Mã hết hiệu lực sau <span className="font-semibold">{formattedTime}</span>
          </p>
        )}
      </div>

      {/* Resend link + retries left */}
      <div className="pt-[24px] text-center">
        {isResendBlocked || resendsLeft === 0 ? (
          <span className="text-[13px] text-danger">
            Bạn đã vượt quá số lần yêu cầu cho phép. Vui lòng thử lại sau 15 phút.
          </span>
        ) : resendCooldown > 0 ? (
          <div className="space-y-[4px]">
            <div className="text-[14px] text-foreground-secondary">
              Gửi lại mã sau <span className="font-semibold">{resendCooldown}s</span>
            </div>
            <div className="text-[12px] text-foreground-secondary">
              Bạn còn <span className="font-semibold">{resendsLeft}</span> lần yêu cầu gửi lại mã
            </div>
          </div>
        ) : (
          <div className="space-y-[4px]">
            <button
              onClick={() => { setResendCooldown(30); setTimer(120); setResendsLeft(r => Math.max(0, r - 1)); router.replace("/soft-otp/sms-otp?state=resent") }}
              className="text-[14px] font-semibold text-brand-secondary"
            >
              Gửi lại mã
            </button>
            <div className="text-[12px] text-foreground-secondary">
              Bạn còn <span className="font-semibold">{resendsLeft}</span> lần yêu cầu
            </div>
          </div>
        )}
      </div>

      <div className="flex-1" />

      <FixedBottom>
        <Button
          variant="primary"
          size="48"
          className="w-full"
          disabled={otp.length < 6 || isExpired}
          onClick={handleSubmit}
        >
          Xác nhận
        </Button>
        <div className="flex justify-center pt-[8px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </FixedBottom>
    </div>
  )
}
