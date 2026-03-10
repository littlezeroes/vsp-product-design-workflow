"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, AlertCircle, Scan, Fingerprint, Lock } from "lucide-react"
import { Header } from "@/components/ui/header"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { InformMessage } from "@/components/ui/inform-message"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

/* ── PIN Cell ──────────────────────────────────────────────────── */
function PinCell({ filled, error }: { filled: boolean; error: boolean }) {
  return (
    <div
      className={`w-[44px] h-[44px] rounded-[14px] border-2 flex items-center justify-center transition-all ${
        error ? "border-danger animate-shake" : filled ? "border-foreground" : "border-border"
      }`}
    >
      {filled && <div className="w-[12px] h-[12px] rounded-full bg-foreground" />}
    </div>
  )
}

/* ── Auth Method Option ────────────────────────────────────────── */
function AuthMethodOption({
  icon,
  label,
  selected,
  onSelect,
}: {
  icon: React.ReactNode
  label: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full flex items-center gap-3 px-[16px] py-[14px] rounded-[14px] transition-colors ${
        selected
          ? "bg-secondary ring-2 ring-foreground"
          : "bg-secondary"
      }`}
    >
      <div className="w-[36px] h-[36px] rounded-full bg-background flex items-center justify-center shrink-0">
        {icon}
      </div>
      <span className="text-sm font-semibold leading-5 text-foreground flex-1 text-left">{label}</span>
      <div
        className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center ${
          selected ? "border-foreground" : "border-border"
        }`}
      >
        {selected && <div className="w-[10px] h-[10px] rounded-full bg-foreground" />}
      </div>
    </button>
  )
}

/* ── Page Content ──────────────────────────────────────────────── */
function WithdrawAuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "default"

  const [pin, setPin] = React.useState(state === "pin-success" ? "123456" : "")
  const [pinError, setPinError] = React.useState<string | null>(
    state === "pin-error-1" ? "Sai mã PIN. Còn 2 lần thử"
      : state === "pin-error-2" ? "Sai mã PIN. Còn 1 lần thử"
      : null
  )
  const [sessionDialog, setSessionDialog] = React.useState(state === "session-timeout")
  const [lockedDialog, setLockedDialog] = React.useState(state === "pin-locked")
  const [authMethod, setAuthMethod] = React.useState<"faceid" | "touchid" | "pin">(
    ["pin-entry", "pin-typing", "pin-success", "pin-error-1", "pin-error-2", "pin-locked"].includes(state) ? "pin" : "faceid"
  )

  const PIN_STATES = ["pin-entry", "pin-typing", "pin-success", "pin-error-1", "pin-error-2"]
  const isPinView = PIN_STATES.includes(state) || authMethod === "pin"
  const isLoading = state === "loading"

  // Auto-submit when 6 digits entered
  React.useEffect(() => {
    if (pin.length === 6 && state !== "pin-success" && state !== "pin-error-1" && state !== "pin-error-2") {
      setTimeout(() => {
        router.push("/bidv-link/withdraw-result?state=success")
      }, 800)
    }
  }, [pin, router, state])

  // biometric-success auto-navigates
  React.useEffect(() => {
    if (state === "biometric-success") {
      const t = setTimeout(() => router.push("/bidv-link/withdraw-result?state=success"), 1500)
      return () => clearTimeout(t)
    }
  }, [state, router])

  const handleDigit = (digit: string) => {
    if (digit === "backspace") {
      setPin((prev) => prev.slice(0, -1))
      setPinError(null)
    } else if (pin.length < 6) {
      setPin((prev) => prev + digit)
      setPinError(null)
    }
  }

  const handleConfirm = () => {
    if (authMethod === "pin") {
      router.push("/bidv-link/withdraw-auth?state=pin-entry")
    } else {
      router.push("/bidv-link/withdraw-result?state=success")
    }
  }

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-secondary text-foreground flex flex-col">
      {/* Header with back button */}
      <Header
        variant="default"
        title="Xác nhận rút tiền"
        showStatusBar={false}
        leading={
          <button
            type="button"
            onClick={() => router.push("/bidv-link/withdraw")}
            className="w-[44px] h-[44px] flex items-center justify-center rounded-full"
          >
            <ChevronLeft size={18} className="text-foreground" />
          </button>
        }
      />

      {/* Fee changed warning — above dark header */}
      {state === "fee-changed" && (
        <div className="px-[22px] pb-[12px] bg-background">
          <InformMessage
            hierarchy="primary"
            icon={<AlertCircle size={24} />}
            body="Phí đã thay đổi"
          />
        </div>
      )}

      {/* Dark header — amount hero */}
      <div className="bg-foreground px-[22px] pt-[54px] pb-[60px] flex flex-col items-center">
        <p className="text-sm font-semibold text-background mb-[8px]">V-Smart Pay</p>
        <p className="text-[28px] font-bold leading-[34px] text-background">200.000đ</p>
      </div>

      {/* White card overlapping dark header */}
      <div className="px-[22px] -mt-[32px]">
        <div className="bg-background rounded-[28px] px-[20px] py-[24px] shadow-sm">
          <ItemList>
            <ItemListItem label="Tài khoản nhận" metadata="BIDV ****1234" divider />
            <ItemListItem label="Số tiền" metadata="200.000đ" divider />
            <ItemListItem label="Phí giao dịch" metadata="0đ" divider />
            <ItemListItem label="Số dư còn lại" metadata="1.300.000đ" />
          </ItemList>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Conditional: PIN entry view or auth method selection */}
        {isPinView && PIN_STATES.includes(state) ? (
          <>
            {/* PIN input */}
            <div className="pt-[32px]">
              <div className="px-[22px] flex flex-col items-center">
                <p className="text-sm font-semibold leading-5 text-foreground mb-[16px]">Nhập mã PIN</p>
                <div className="flex gap-[8px]">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <PinCell key={i} filled={i < pin.length} error={!!pinError} />
                  ))}
                </div>
                {pinError && (
                  <p className="text-xs font-normal leading-5 text-danger mt-[8px]">{pinError}</p>
                )}
                {state === "pin-success" && (
                  <p className="text-xs font-normal leading-5 text-success mt-[8px]">Xác thực thành công</p>
                )}
              </div>
            </div>

            {/* Numpad */}
            <div className="pt-[32px]">
              <div className="px-[22px]">
                <div className="grid grid-cols-3 gap-[1px]">
                  {["1","2","3","4","5","6","7","8","9","","0","backspace"].map((key) => (
                    <button
                      key={key || "empty"}
                      type="button"
                      disabled={!key}
                      onClick={() => key && handleDigit(key)}
                      className={`h-[52px] flex items-center justify-center text-lg font-semibold text-foreground active:bg-secondary rounded-[8px] transition-colors ${!key ? "invisible" : ""}`}
                    >
                      {key === "backspace" ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                          <line x1="18" y1="9" x2="12" y2="15" />
                          <line x1="12" y1="9" x2="18" y2="15" />
                        </svg>
                      ) : key}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Auth method selection */}
            <div className="pt-[32px]">
              <div className="px-[22px]">
                <p className="text-sm font-semibold leading-5 text-foreground mb-[12px]">
                  Chọn phương thức xác thực
                </p>
                <div className="flex flex-col gap-[8px]">
                  <AuthMethodOption
                    icon={<Scan size={18} className="text-foreground" />}
                    label="Face ID"
                    selected={authMethod === "faceid"}
                    onSelect={() => setAuthMethod("faceid")}
                  />
                  <AuthMethodOption
                    icon={<Fingerprint size={18} className="text-foreground" />}
                    label="Touch ID"
                    selected={authMethod === "touchid"}
                    onSelect={() => setAuthMethod("touchid")}
                  />
                  <AuthMethodOption
                    icon={<Lock size={18} className="text-foreground" />}
                    label="Mã PIN"
                    selected={authMethod === "pin"}
                    onSelect={() => setAuthMethod("pin")}
                  />
                </div>

                {/* Biometric prompt */}
                {state === "biometric-prompt" && (
                  <p className="text-sm font-normal leading-5 text-foreground-secondary mt-[16px] text-center">
                    Đang xác thực Face ID...
                  </p>
                )}

                {/* Biometric success */}
                {state === "biometric-success" && (
                  <p className="text-sm font-normal leading-5 text-success mt-[16px] text-center">
                    Xác thực thành công. Đang xử lý...
                  </p>
                )}

                {/* Biometric fail */}
                {state === "biometric-fail" && (
                  <p className="text-sm font-normal leading-5 text-danger mt-[16px] text-center">
                    Face ID thất bại. Vui lòng nhập PIN.
                  </p>
                )}
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />
          </>
        )}
      </div>

      {/* Bottom CTA — only in default/auth-method view (not PIN view) */}
      {!PIN_STATES.includes(state) && (
        <div className="shrink-0 px-[22px] pb-[34px] pt-[12px]">
          <Button
            variant="primary"
            size="48"
            className="w-full"
            isLoading={isLoading}
            onClick={handleConfirm}
          >
            Xác nhận
          </Button>
        </div>
      )}

      {/* Session Timeout Dialog */}
      <Dialog
        open={sessionDialog}
        onClose={() => setSessionDialog(false)}
        title="Phiên đã hết hạn"
        description="Vui lòng thử lại."
        primaryLabel="Thử lại"
        secondaryLabel="Về trang chủ"
        footerProps={{
          primaryProps: { onClick: () => { setSessionDialog(false); router.push("/bidv-link/withdraw") } },
          secondaryProps: { onClick: () => router.push("/") },
        }}
      />

      {/* PIN Locked Dialog */}
      <Dialog
        open={lockedDialog}
        onClose={() => setLockedDialog(false)}
        title="Tài khoản tạm khóa"
        description="Bạn đã nhập sai mã PIN quá nhiều lần. Tài khoản tạm thời bị khóa. Vui lòng thử lại sau."
        primaryLabel="Quên mã PIN"
        secondaryLabel="Đóng"
        footerProps={{
          primaryProps: { onClick: () => setLockedDialog(false) },
          secondaryProps: { onClick: () => { setLockedDialog(false); router.push("/bidv-link/withdraw") } },
        }}
      />

      {/* Home indicator */}
      <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}

export default function WithdrawAuthPage() {
  return (
    <React.Suspense fallback={null}>
      <WithdrawAuthContent />
    </React.Suspense>
  )
}
