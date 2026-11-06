"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronLeft, Shield, ArrowRight, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FixedBottom } from "@/components/ui/fixed-bottom"

export default function SoftOtpDisplay() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "active"
  const txType = searchParams.get("type") ?? "AB"
  // states: active (full timer), expiring (10s warning), expired (regenerating)

  const initialTime = state === "expiring" ? 8 : state === "expired" ? 0 : 30
  const [timeLeft, setTimeLeft] = React.useState(initialTime)
  const [otp, setOtp] = React.useState("482 619")

  React.useEffect(() => {
    if (timeLeft > 0) {
      const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
      return () => clearTimeout(id)
    } else if (state !== "expired") {
      // Regenerate OTP
      setTimeout(() => {
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
        setOtp(`${newOtp.slice(0, 3)} ${newOtp.slice(3)}`)
        setTimeLeft(30)
      }, 600)
    }
  }, [timeLeft, state])

  const isExpiring = timeLeft < 10 && timeLeft > 0
  const isExpired = timeLeft === 0
  const progress = (timeLeft / 30) * 100
  const circumference = 2 * Math.PI * 56
  const dashOffset = circumference - (progress / 100) * circumference

  const handleConfirm = () => {
    if (txType === "CD") router.push("/soft-otp/face")
    else router.push("/soft-otp/result?type=tx-success")
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
        <span className="flex-1" />
      </div>

      {/* Title */}
      <div className="px-[22px] pt-[8px]">
        <h1 className="text-[24px] font-bold tracking-[-0.5px] leading-[30px]">Xác thực OTP</h1>
        <p className="text-[13px] text-foreground-secondary mt-[6px]">
          Kiểm tra thông tin và xác nhận mã OTP dưới đây.
        </p>
      </div>

      {/* Transaction info card */}
      <div className="px-[22px] pt-[20px]">
        <div className="bg-secondary rounded-28 px-[20px] py-[18px]">
          <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-foreground-secondary">
            Chuyển tiền đến
          </div>
          <div className="text-[20px] font-bold mt-[4px] leading-[26px]">Nguyễn Văn A</div>
          <div className="text-[13px] text-foreground-secondary mt-[2px]">Vietcombank • 0123 456 789</div>

          <div className="h-[1px] bg-border my-[14px]" />

          <div className="flex items-end justify-between">
            <div>
              <div className="text-[12px] text-foreground-secondary">Số tiền</div>
              <div className="text-[28px] font-bold tracking-[-0.5px] mt-[2px]">500.000 ₫</div>
            </div>
            <div className="text-right">
              <div className="text-[12px] text-foreground-secondary">Phí</div>
              <div className="text-[14px] font-semibold mt-[2px]">Miễn phí</div>
            </div>
          </div>
        </div>
      </div>

      {/* OTP display with ring */}
      <div className="pt-[28px] flex flex-col items-center">
        <div className="relative w-[140px] h-[140px] flex items-center justify-center">
          {/* Ring */}
          <svg className="absolute inset-0 -rotate-90" width="140" height="140" viewBox="0 0 140 140">
            <circle
              cx="70" cy="70" r="56"
              fill="none"
              className="stroke-border"
              strokeWidth="4"
            />
            <circle
              cx="70" cy="70" r="56"
              fill="none"
              className={isExpiring ? "stroke-danger" : "stroke-brand-secondary"}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>

          {/* Time inside */}
          <div className="flex flex-col items-center">
            <div className={`text-[28px] font-bold tabular-nums tracking-[-0.5px] ${isExpiring ? "text-danger" : "text-foreground"}`}>
              {String(timeLeft).padStart(2, "0")}s
            </div>
          </div>
        </div>

        {/* OTP code */}
        <div className="pt-[20px] flex items-center gap-[12px]">
          {otp.split("").map((c, i) =>
            c === " " ? (
              <div key={i} className="w-[8px]" />
            ) : (
              <span
                key={i}
                className={`text-[44px] font-bold tracking-[-0.5px] tabular-nums ${isExpired ? "text-foreground-secondary" : "text-foreground"} ${isExpired ? "animate-pulse" : ""}`}
              >
                {isExpired ? "•" : c}
              </span>
            )
          )}
        </div>

        <p className={`text-[13px] mt-[12px] ${isExpiring ? "text-danger font-semibold" : isExpired ? "text-foreground-secondary" : "text-foreground-secondary"}`}>
          {isExpired
            ? "Đang tạo mã mới..."
            : isExpiring
            ? `Mã sẽ hết hạn sau ${timeLeft}s`
            : `Mã hết hạn sau ${timeLeft}s`}
        </p>
      </div>

      {/* Security tip */}
      <div className="px-[22px] pt-[24px]">
        <div className="flex items-start gap-[10px] px-[16px] py-[12px] rounded-14 bg-warning/15">
          <Info size={16} className="text-warning shrink-0 mt-[2px]" strokeWidth={2} />
          <p className="text-[12px] leading-[16px] text-foreground">
            Không chia sẻ mã OTP với bất kỳ ai, kể cả nhân viên ngân hàng hay V-Smart Pay.
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-[80px]" />

      <FixedBottom>
        <Button
          variant="primary"
          size="48"
          className="w-full"
          disabled={isExpired}
          onClick={handleConfirm}
        >
          {isExpired ? "Đang tạo mã mới..." : "Xác nhận giao dịch"}
        </Button>
        <div className="flex justify-center pt-[8px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </FixedBottom>
    </div>
  )
}
