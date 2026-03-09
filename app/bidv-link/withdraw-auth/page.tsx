"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, AlertCircle } from "lucide-react"
import { Header } from "@/components/ui/header"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { InformMessage } from "@/components/ui/inform-message"
import { Dialog } from "@/components/ui/dialog"

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

/* ── Page ──────────────────────────────────────────────────────── */
export default function WithdrawAuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "default"

  const [pin, setPin] = React.useState("")
  const [pinError, setPinError] = React.useState<string | null>(
    state === "pin-error-1" ? "Sai mã PIN. Còn 2 lần thử"
      : state === "pin-error-2" ? "Sai mã PIN. Còn 1 lần thử"
      : null
  )
  const [sessionDialog, setSessionDialog] = React.useState(state === "session-timeout")

  React.useEffect(() => {
    if (pin.length === 6) {
      setTimeout(() => {
        router.push("/bidv-link/withdraw-result?state=success")
      }, 800)
    }
  }, [pin, router])

  const handleDigit = (digit: string) => {
    if (digit === "backspace") {
      setPin((prev) => prev.slice(0, -1))
      setPinError(null)
    } else if (pin.length < 6) {
      setPin((prev) => prev + digit)
      setPinError(null)
    }
  }

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header
        variant="default"
        title="Xác nhận rút tiền"
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

      <div className="flex-1 overflow-y-auto pb-[21px]">
        {/* Fee changed warning */}
        {state === "fee-changed" && (
          <div className="px-[22px] pt-[16px]">
            <InformMessage
              hierarchy="primary"
              icon={<AlertCircle size={24} />}
              body="Phí đã thay đổi"
            />
          </div>
        )}

        {/* Transaction summary */}
        <div className="pt-[32px]">
          <div className="px-[22px]">
            <div className="bg-secondary rounded-[28px] px-[20px] py-[18px]">
              <ItemList>
                <ItemListItem label="Tài khoản nhận" metadata="BIDV ****1234" divider />
                <ItemListItem label="Số tiền" metadata="200.000đ" divider />
                <ItemListItem label="Phí giao dịch" metadata="0đ" divider />
                <ItemListItem label="Số dư còn lại" metadata="1.300.000đ" />
              </ItemList>
            </div>
          </div>
        </div>

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

            {state === "biometric-prompt" && (
              <p className="text-sm font-normal leading-5 text-foreground-secondary mt-[16px]">
                Đang yêu cầu xác thực Face ID...
              </p>
            )}
            {state === "biometric-fail" && (
              <p className="text-sm font-normal leading-5 text-foreground-secondary mt-[16px]">
                Face ID không thành công. Vui lòng nhập mã PIN.
              </p>
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
      </div>

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

      {/* Home indicator */}
      <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}
