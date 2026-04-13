"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ShieldCheck, AlertCircle, Wifi } from "lucide-react"
import { Header } from "@/components/ui/header"
import { PinInput } from "@/components/ui/pin-input"
import { Button } from "@/components/ui/button"
import { ToastBar } from "@/components/ui/toast-bar"
import { Dialog } from "@/components/ui/dialog"
import { formatVND, MOCK_USER } from "../data"

/* ── Mask phone ────────────────────────────────────────────────── */
function maskPhone(phone: string) {
  if (phone.length < 7) return phone
  return phone.slice(0, 3) + "****" + phone.slice(-3)
}

/* ── Unified OTP/PIN Verification Screen ───────────────────────── */
export default function OtpPage() {
  return (
    <React.Suspense fallback={null}>
      <OtpContent />
    </React.Suspense>
  )
}

function OtpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Unified params — works for both old OTP flow and auth flow
  const context = searchParams.get("context") || "activate" // activate | cancel | deposit | withdraw
  const type = searchParams.get("type") // deposit | withdraw (from auth flow)
  const amount = parseInt(searchParams.get("amount") || "0", 10)
  const stateParam = searchParams.get("state")

  // Resolve effective context from either param style
  const effectiveContext = type || context

  const [pin, setPin] = React.useState("")
  const [error, setError] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [verifying, setVerifying] = React.useState(false)
  const [countdown, setCountdown] = React.useState(60)
  const [attempts, setAttempts] = React.useState(0)
  const [resendCount, setResendCount] = React.useState(0)
  const [locked, setLocked] = React.useState(false)
  const [lockCountdown, setLockCountdown] = React.useState(0)
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)
  const [toastType, setToastType] = React.useState<"error" | "success" | "default">("error")
  const [networkDialog, setNetworkDialog] = React.useState(false)
  const [sessionDialog, setSessionDialog] = React.useState(false)

  const maskedPhone = maskPhone(MOCK_USER.phone)
  const MAX_ATTEMPTS = 3
  const MAX_RESENDS = 3
  const LOCK_DURATION = 300 // 5 minutes

  // Init from query params
  React.useEffect(() => {
    if (stateParam === "wrong") {
      setError(true)
      setErrorMessage("Mã PIN không chính xác. Vui lòng thử lại.")
      setAttempts(1)
    } else if (stateParam === "expired") {
      setCountdown(0)
    } else if (stateParam === "api-error") {
      showToast("Hệ thống đang xử lý. Vui lòng thử lại.", "error")
    }
  }, [stateParam])

  // Countdown timer
  React.useEffect(() => {
    if (countdown <= 0 || locked) return
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000)
    return () => clearInterval(timer)
  }, [countdown, locked])

  // Lock countdown timer
  React.useEffect(() => {
    if (lockCountdown <= 0) return
    const timer = setInterval(() => {
      setLockCountdown((c) => {
        if (c <= 1) {
          setLocked(false)
          setAttempts(0)
          setResendCount(0)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [lockCountdown])

  const showToast = (message: string, type: "error" | "success" | "default" = "error") => {
    setToastMessage(message)
    setToastType(type)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const getContextTitle = () => {
    switch (effectiveContext) {
      case "activate": return "Kích hoạt sinh lời"
      case "cancel": return "Huỷ sinh lời"
      case "deposit": return "Nạp tiền sinh lời"
      case "withdraw": return "Rút tiền sinh lời"
      default: return "Xác thực"
    }
  }

  const getSuccessRoute = () => {
    switch (effectiveContext) {
      case "activate":
        return "/sinhloi/result/activate?status=success"
      case "cancel":
        return "/sinhloi/result/cancel?status=success"
      case "deposit":
        return `/sinhloi/result/deposit?amount=${amount}&status=success`
      case "withdraw":
        return `/sinhloi/result/withdraw?amount=${amount}&status=success`
      default:
        return "/sinhloi/dashboard"
    }
  }

  const handlePinChange = (value: string) => {
    if (locked || verifying) return

    setPin(value)
    setError(false)
    setErrorMessage("")

    // Auto-submit when 6 digits entered
    if (value.length === 6) {
      setVerifying(true)
      setTimeout(() => {
        // Mock: "123456" is correct PIN
        if (value === "123456") {
          router.push(getSuccessRoute())
        } else {
          const newAttempts = attempts + 1
          setAttempts(newAttempts)
          setVerifying(false)
          setPin("")

          if (newAttempts >= MAX_ATTEMPTS) {
            setLocked(true)
            setLockCountdown(LOCK_DURATION)
            setError(true)
            setErrorMessage("Bạn đã thử quá nhiều lần. Vui lòng thử lại sau 5 phút.")
          } else {
            const remaining = MAX_ATTEMPTS - newAttempts
            setError(true)
            setErrorMessage(
              remaining === 1
                ? "Mã PIN không chính xác. Bạn còn 1 lần thử."
                : "Mã PIN không chính xác. Vui lòng thử lại."
            )
          }
        }
      }, 1000)
    }
  }

  const handleResend = () => {
    if (locked) return

    const newResendCount = resendCount + 1
    setResendCount(newResendCount)

    if (newResendCount >= MAX_RESENDS) {
      setLocked(true)
      setLockCountdown(LOCK_DURATION)
      setError(true)
      setErrorMessage("Bạn đã gửi lại quá nhiều lần. Vui lòng thử lại sau 5 phút.")
      return
    }

    setCountdown(60)
    setError(false)
    setErrorMessage("")
    setPin("")
    setAttempts(0)
    showToast("Đã gửi lại mã OTP", "success")
  }

  const formatLockTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <Header
        variant="default"
        title="Xác thực"
        showStatusBar={true}
        leading={
          <button
            type="button"
            onClick={() => router.back()}
            className="w-[44px] h-[44px] flex items-center justify-center rounded-full"
          >
            <ChevronLeft size={18} className="text-foreground" />
          </button>
        }
      />

      <div className="flex-1 flex flex-col">
        {/* Icon centered */}
        <div className="pt-[32px] flex flex-col items-center">
          <div className="w-16 h-16 flex items-center justify-center">
            <ShieldCheck size={64} className="text-foreground" />
          </div>
        </div>

        {/* Description */}
        <div className="pt-[16px] px-[22px]">
          <p className="text-md font-normal leading-6 text-foreground text-center">
            Nhập mã PIN để xác thực giao dịch
          </p>
          {amount > 0 && (
            <p className="text-lg font-semibold leading-6 text-foreground text-center mt-[8px]">
              {getContextTitle()} - {formatVND(amount)}
            </p>
          )}
        </div>

        {/* PinInput component */}
        <div className="pt-[32px] px-[22px]">
          <PinInput
            length={6}
            value={pin}
            onChange={handlePinChange}
            error={error}
            secure
            disabled={locked || verifying}
          />
        </div>

        {/* Error message below PIN */}
        {errorMessage && (
          <div className="pt-[8px] px-[22px]">
            <p className={`text-sm font-normal leading-5 text-center ${locked ? "text-foreground-secondary" : "text-danger"}`}>
              {errorMessage}
            </p>
          </div>
        )}

        {/* Lock countdown */}
        {locked && lockCountdown > 0 && (
          <div className="pt-[4px] px-[22px]">
            <p className="text-sm font-normal leading-5 text-foreground-secondary text-center">
              Thử lại sau {formatLockTime(lockCountdown)}
            </p>
          </div>
        )}

        {/* Verifying indicator */}
        {verifying && !errorMessage && (
          <div className="pt-[8px] px-[22px]">
            <p className="text-sm font-normal leading-5 text-foreground-secondary text-center">
              Đang xác thực...
            </p>
          </div>
        )}

        {/* Resend timer */}
        <div className="pt-[32px] flex flex-col items-center px-[22px]">
          {locked ? null : countdown > 0 ? (
            <p className="text-sm font-normal leading-5 text-foreground-secondary">
              Gửi lại mã sau {countdown}s
            </p>
          ) : (
            <Button
              variant="secondary"
              size="32"
              onClick={handleResend}
            >
              Gửi lại mã
            </Button>
          )}
        </div>

        {/* Masked phone info */}
        <div className="pt-[16px] px-[22px]">
          <p className="text-sm font-normal leading-5 text-foreground-secondary text-center">
            Mã OTP đã gửi đến {maskedPhone}
          </p>
        </div>
      </div>

      {/* Toast bar */}
      {toastMessage && (
        <div className="absolute top-[110px] inset-x-[22px] z-50">
          <ToastBar
            type={toastType}
            title={toastMessage}
            icon={toastType === "error" ? <AlertCircle size={20} /> : undefined}
            onClose={() => setToastMessage(null)}
          />
        </div>
      )}

      {/* Network error dialog */}
      <Dialog
        open={networkDialog}
        onClose={() => setNetworkDialog(false)}
        type="icon"
        icon={<Wifi size={36} className="text-danger" />}
        title="Không có kết nối mạng"
        description="Vui lòng kiểm tra Internet và thử lại."
        primaryLabel="Thử lại"
        secondaryLabel="Đóng"
        footerProps={{
          primaryProps: { onClick: () => setNetworkDialog(false) },
          secondaryProps: { onClick: () => setNetworkDialog(false) },
        }}
      />

      {/* Session expired dialog */}
      <Dialog
        open={sessionDialog}
        onClose={() => setSessionDialog(false)}
        title="Phiên giao dịch hết hạn"
        description="Vui lòng thực hiện lại giao dịch."
        primaryLabel="Quay lại"
        secondaryLabel="Đóng"
        footerProps={{
          primaryProps: { onClick: () => { setSessionDialog(false); router.back() } },
          secondaryProps: { onClick: () => setSessionDialog(false) },
        }}
      />

      {/* Home indicator */}
      <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}
