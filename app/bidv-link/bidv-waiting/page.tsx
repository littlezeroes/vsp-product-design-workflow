"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Shield } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"

/* ── Step Indicator ────────────────────────────────────────────── */
function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-[6px] px-[22px] pb-[8px]">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-[4px] flex-1 rounded-full ${i < step ? "bg-foreground" : "bg-secondary"}`}
        />
      ))}
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function BidvWaitingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "waiting"

  const [timeLeft, setTimeLeft] = React.useState(180)
  const [cancelDialog, setCancelDialog] = React.useState(state === "cancel-confirm")
  const [networkDialog, setNetworkDialog] = React.useState(state === "network-lost")

  // Countdown timer
  React.useEffect(() => {
    if (state !== "waiting") return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/bidv-link/bidv-result?state=failed-timeout")
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [state, router])

  // Simulate callbacks for demo states
  React.useEffect(() => {
    if (state === "callback-success") {
      const t = setTimeout(() => router.push("/bidv-link/bidv-result?state=success"), 1500)
      return () => clearTimeout(t)
    }
    if (state === "callback-failed") {
      const t = setTimeout(() => router.push("/bidv-link/bidv-result?state=failed"), 1500)
      return () => clearTimeout(t)
    }
    if (state === "callback-pending") {
      const t = setTimeout(() => router.push("/bidv-link/bidv-result?state=pending"), 1500)
      return () => clearTimeout(t)
    }
    if (state === "callback-cancel") {
      const t = setTimeout(() => router.push("/bidv-link/bidv-result?state=failed-cancel"), 1500)
      return () => clearTimeout(t)
    }
  }, [state, router])

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header
        variant="default"
        title="Xác thực liên kết"
      />

      <StepIndicator step={3} total={3} />

      <div className="flex-1 overflow-y-auto pb-[21px]">
        {/* Centered content */}
        <div className="flex flex-col items-center justify-center px-[22px] pt-[80px]">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-[24px]">
            <Shield size={32} className="text-foreground" />
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold leading-6 tracking-[-0.005em] text-foreground text-center mb-[8px]">
            Đang chờ xác thực từ BIDV SmartBanking
          </h2>

          {/* Countdown */}
          <p className="text-sm font-normal leading-5 text-foreground-secondary">
            Còn lại: {mins}:{secs.toString().padStart(2, "0")}
          </p>

          {/* App resume state info */}
          {state === "app-resume" && (
            <p className="text-sm font-normal leading-5 text-foreground-secondary mt-[8px]">
              Đang kiểm tra trạng thái giao dịch...
            </p>
          )}
        </div>
      </div>

      {/* Fixed CTAs */}
      <div className="absolute bottom-0 inset-x-0 bg-background px-[22px] pb-[34px] pt-[12px] space-y-3">
        <Button
          variant="primary"
          size="48"
          className="w-full"
          onClick={() => {
            // Simulate deeplink retry
          }}
        >
          Mở lại BIDV SmartBanking
        </Button>
        <Button
          variant="secondary"
          size="48"
          className="w-full"
          onClick={() => setCancelDialog(true)}
        >
          Hủy giao dịch
        </Button>
      </div>

      {/* Cancel Confirm Dialog */}
      <Dialog
        open={cancelDialog}
        onClose={() => setCancelDialog(false)}
        title="Hủy giao dịch?"
        description="Yêu cầu liên kết sẽ bị hủy."
        primaryLabel="Hủy giao dịch"
        secondaryLabel="Tiếp tục chờ"
        footerProps={{
          primaryProps: {
            intent: "danger",
            onClick: () => router.push("/bidv-link/bidv-form"),
          },
          secondaryProps: { onClick: () => setCancelDialog(false) },
        }}
      />

      {/* Network Lost Dialog */}
      <Dialog
        open={networkDialog}
        onClose={() => setNetworkDialog(false)}
        title="Mất kết nối mạng"
        description="Vui lòng kiểm tra kết nối và thử lại."
        primaryLabel="Thử lại"
        secondaryLabel="Đóng"
        footerProps={{
          primaryProps: { onClick: () => setNetworkDialog(false) },
          secondaryProps: { onClick: () => setNetworkDialog(false) },
        }}
      />

      {/* Home indicator */}
      <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}
