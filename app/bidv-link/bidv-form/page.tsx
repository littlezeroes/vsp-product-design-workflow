"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, AlertCircle } from "lucide-react"
import { Header } from "@/components/ui/header"
import { TextField } from "@/components/ui/text-field"
import { Button } from "@/components/ui/button"
import { BottomSheet } from "@/components/ui/bottom-sheet"
import { InformMessage } from "@/components/ui/inform-message"
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
function BidvFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "empty"

  const [stk, setStk] = React.useState("")
  const [tncOpen, setTncOpen] = React.useState(state === "tnc-sheet")
  const [isLoading, setIsLoading] = React.useState(state === "loading")
  const [networkDialog, setNetworkDialog] = React.useState(state === "error-network")
  const [deeplinkDialog, setDeeplinkDialog] = React.useState(state === "deeplink-fail")

  // Determine error messages based on state
  const getSTKError = () => {
    switch (state) {
      case "error-stk": return "Số tài khoản không tồn tại"
      case "error-mismatch": return "Thông tin không khớp với ngân hàng"
      case "error-no-smartbanking": return "Tài khoản chưa đăng ký SmartBanking"
      default: return undefined
    }
  }

  const isValid = stk.length >= 3 && stk.length <= 14

  const handleSubmit = () => {
    setTncOpen(true)
  }

  const handleTncAgree = () => {
    setTncOpen(false)
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/bidv-link/bidv-waiting")
    }, 1500)
  }

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header
        variant="large-title"
        largeTitle="Liên kết BIDV"
        leading={
          <button
            type="button"
            onClick={() => router.push("/bidv-link/bank-list")}
            className="w-[44px] h-[44px] flex items-center justify-center rounded-full"
          >
            <ChevronLeft size={18} className="text-foreground" />
          </button>
        }
      />

      <StepIndicator step={2} total={3} />

      <div className="flex-1 overflow-y-auto pb-[120px]">
        {/* Maintenance banner */}
        {state === "error-maintenance" && (
          <div className="px-[22px] pt-[16px]">
            <InformMessage
              hierarchy="primary"
              icon={<AlertCircle size={24} />}
              body="BIDV đang bảo trì. Vui lòng thử lại sau."
            />
          </div>
        )}

        {/* Rate limit banner */}
        {state === "error-rate-limit" && (
          <div className="px-[22px] pt-[16px]">
            <InformMessage
              hierarchy="primary"
              icon={<AlertCircle size={24} />}
              body="Quá nhiều yêu cầu. Thử lại sau 5 phút."
            />
          </div>
        )}

        {/* eKYC readonly fields */}
        <div className="pt-[32px]">
          <div className="px-[22px] space-y-3">
            <TextField
              label="Họ và tên"
              value="NGUYEN VAN A"
              disabled
            />
            <TextField
              label="Số điện thoại"
              value="0912 345 678"
              disabled
            />
            <TextField
              label="Số CCCD"
              value="001234567890"
              disabled
            />
          </div>
        </div>

        {/* STK input */}
        <div className="pt-[32px]">
          <div className="px-[22px]">
            <TextField
              label="Số tài khoản BIDV"
              placeholder="Nhập số tài khoản"
              type="text"
              inputMode="numeric"
              maxLength={14}
              value={stk}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "")
                setStk(val)
              }}
              error={getSTKError()}
              helpText={stk.length > 0 ? `${stk.length}/14 ký tự` : undefined}
            />
          </div>
        </div>
      </div>

      {/* Fixed CTA */}
      <div className="absolute bottom-0 inset-x-0 bg-background px-[22px] pb-[34px] pt-[12px]">
        <Button
          variant="primary"
          size="48"
          className="w-full"
          disabled={!isValid || isLoading || state === "error-maintenance"}
          isLoading={isLoading}
          onClick={handleSubmit}
        >
          Đồng ý &amp; Tiếp tục
        </Button>
      </div>

      {/* TnC Bottom Sheet */}
      <BottomSheet open={tncOpen} onClose={() => setTncOpen(false)}>
        <div className="pt-[16px] pb-[16px]">
          <h3 className="text-lg font-semibold leading-6 text-foreground mb-[12px]">
            Điều khoản &amp; Điều kiện
          </h3>
          <div className="text-sm font-normal leading-5 text-foreground space-y-3 max-h-[300px] overflow-y-auto">
            <p>Bằng việc nhấn &quot;Đồng ý &amp; Tiếp tục&quot;, bạn đồng ý:</p>
            <p>1. Cho phép V-Smart Pay truy cập thông tin tài khoản BIDV của bạn để thực hiện các giao dịch nạp/rút tiền.</p>
            <p>2. Thông tin cá nhân của bạn sẽ được bảo mật theo chính sách bảo mật của V-Smart Pay.</p>
            <p>3. Mọi giao dịch đều cần xác thực qua BIDV SmartBanking.</p>
            <p>4. V-Smart Pay không lưu trữ mật khẩu hoặc mã PIN ngân hàng của bạn.</p>
          </div>
          <div className="pt-[20px]">
            <Button
              variant="primary"
              size="48"
              className="w-full"
              onClick={handleTncAgree}
            >
              Đồng ý &amp; Tiếp tục
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* Network Error Dialog */}
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

      {/* Deeplink Fail Dialog */}
      <Dialog
        open={deeplinkDialog}
        onClose={() => setDeeplinkDialog(false)}
        title="Không thể mở BIDV SmartBanking"
        description="Vui lòng kiểm tra ứng dụng đã được cập nhật."
        primaryLabel="Mở App Store"
        secondaryLabel="Đóng"
        footerProps={{
          primaryProps: { onClick: () => setDeeplinkDialog(false) },
          secondaryProps: { onClick: () => setDeeplinkDialog(false) },
        }}
      />

      {/* Home indicator */}
      <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}

export default function BidvFormPage() {
  return (
    <React.Suspense fallback={null}>
      <BidvFormContent />
    </React.Suspense>
  )
}
