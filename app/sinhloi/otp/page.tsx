"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Header } from "@/components/ui/header"
import { cn } from "@/lib/utils"

const OTP_LENGTH = 6
const COUNTDOWN_SECONDS = 30

function OtpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const context = searchParams.get("context") || "activate"
  const amount = searchParams.get("amount") || ""

  const [otp, setOtp] = React.useState<string[]>(Array(OTP_LENGTH).fill(""))
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [countdown, setCountdown] = React.useState(COUNTDOWN_SECONDS)
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  React.useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  React.useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const digit = value.slice(-1)
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)

    if (digit && index < OTP_LENGTH - 1) {
      setActiveIndex(index + 1)
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every((d) => d !== "")) {
      const params = new URLSearchParams({ context, status: "success" })
      if (amount) params.set("amount", amount)
      setTimeout(() => router.replace(`/sinhloi/result?${params.toString()}`), 500)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveIndex(index - 1)
      inputRefs.current[index - 1]?.focus()
      const newOtp = [...otp]
      newOtp[index - 1] = ""
      setOtp(newOtp)
    }
  }

  const handleResend = () => {
    if (countdown > 0) return
    setCountdown(COUNTDOWN_SECONDS)
    setOtp(Array(OTP_LENGTH).fill(""))
    setActiveIndex(0)
    inputRefs.current[0]?.focus()
  }

  const formatCountdown = (s: number) => {
    const mm = String(Math.floor(s / 60)).padStart(2, "0")
    const ss = String(s % 60).padStart(2, "0")
    return `${mm}:${ss}`
  }

  return (
    <div className="min-h-screen bg-grey-100 dark:bg-grey-900 flex flex-col items-center">
      <div className="relative w-[390px] h-[844px] bg-background text-foreground flex flex-col rounded-[40px] shadow-xl overflow-hidden mt-[16px]">

        <Header
          variant="large-title"
          largeTitle="Nhập mã xác thực OTP"
          showStatusBar
          leading={
            <button
              type="button"
              onClick={() => router.back()}
              className="p-[10px] min-h-[44px] rounded-full flex items-center justify-center"
            >
              <ChevronLeft size={18} className="text-foreground" />
            </button>
          }
        />

        <div className="px-[22px] pb-[8px]">
          <p className="text-md leading-6 text-foreground">
            Vui lòng nhập mã xác thực 6 số được gửi đến{" "}
            <span className="font-semibold">0939399222</span>
          </p>
        </div>

        <div className="px-[22px] py-[24px]">
          <div className="flex gap-[8px]">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onFocus={() => setActiveIndex(i)}
                className={cn(
                  "w-[48px] h-[48px] rounded-[10px] border text-center text-xl font-semibold text-foreground bg-background outline-none transition-colors",
                  i === activeIndex && !digit
                    ? "border-[1.5px] border-info"
                    : digit
                    ? "border-[1.5px] border-info"
                    : "border border-border"
                )}
              />
            ))}
          </div>

          <div className="mt-[24px]">
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0}
              className={cn(
                "px-[12px] py-[6px] rounded-full text-sm font-semibold leading-5",
                countdown > 0
                  ? "bg-disabled-bg text-disabled-fg cursor-not-allowed"
                  : "bg-foreground text-background"
              )}
            >
              Gửi lại mã OTP{countdown > 0 ? ` (${formatCountdown(countdown)})` : ""}
            </button>
          </div>
        </div>

        <div className="flex-1" />

        <div className="h-[21px] shrink-0 flex items-end justify-center pb-[8px]">
          <div className="w-[139px] h-[5px] bg-foreground rounded-[100px]" />
        </div>
      </div>
    </div>
  )
}

export default function OtpPage() {
  return (
    <React.Suspense fallback={null}>
      <OtpContent />
    </React.Suspense>
  )
}
