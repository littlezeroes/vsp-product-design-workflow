"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, Building2, Check } from "lucide-react"
import { Header } from "@/components/ui/header"
import { FeedbackState } from "@/components/ui/feedback-state"
import { Button } from "@/components/ui/button"
import { ToastBar } from "@/components/ui/toast-bar"

/* ── Bank brand colors ────────────────────────────────────────── */
const BANK_BRANDS: Record<string, { bg: string; text: string }> = {
  techcombank: { bg: "bg-red-600", text: "text-white" },
  vietcombank: { bg: "bg-green-700", text: "text-white" },
  tpbank: { bg: "bg-purple-600", text: "text-white" },
  bidv: { bg: "bg-red-700", text: "text-white" },
}

/* ── Mock data ─────────────────────────────────────────────────── */
const LINKED_BANKS = [
  { id: "techcombank", name: "Techcombank", account: "****5678" },
  { id: "vietcombank", name: "Vietcombank", account: "****9999" },
  { id: "tpbank", name: "TPbank", account: "****3456" },
  { id: "bidv", name: "BIDV", account: "****1234" },
]

function BankLogo({ id, name }: { id: string; name: string }) {
  const brand = BANK_BRANDS[id] ?? { bg: "bg-foreground-secondary", text: "text-white" }
  return (
    <div className={`w-11 h-11 rounded-full flex items-center justify-center ${brand.bg}`}>
      <span className={`text-[13px] font-bold ${brand.text}`}>
        {name.slice(0, 2).toUpperCase()}
      </span>
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────── */
function BankManagementContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "loaded"

  const [showSnackbar, setShowSnackbar] = React.useState(state === "unlinked")

  // Auto-dismiss snackbar
  React.useEffect(() => {
    if (showSnackbar) {
      const t = setTimeout(() => setShowSnackbar(false), 3000)
      return () => clearTimeout(t)
    }
  }, [showSnackbar])

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header
        variant="large-title"
        largeTitle="Quản lý tài khoản"
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

      <div className="flex-1 overflow-y-auto pb-[120px]">
        {/* Loading */}
        {state === "loading" && (
          <div className="pt-[32px] px-[22px] flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[68px] bg-secondary rounded-[28px] animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {state === "error" && (
          <div className="pt-[32px] px-[22px]">
            <FeedbackState
              icon={
                <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center">
                  <Building2 size={32} className="text-danger" />
                </div>
              }
              title="Không thể tải danh sách"
              description="Vui lòng kiểm tra kết nối và thử lại."
              actionLabel="Thử lại"
              actionProps={{ onClick: () => router.refresh() }}
            />
          </div>
        )}

        {/* Empty */}
        {state === "empty" && (
          <div className="pt-[32px] px-[22px]">
            <FeedbackState
              icon={
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                  <Building2 size={32} className="text-foreground-secondary" />
                </div>
              }
              title="Chưa có ngân hàng liên kết"
              description="Liên kết ngân hàng để nạp, rút tiền và sử dụng các dịch vụ của V-Smart Pay."
              actionLabel="Thêm ngân hàng"
              actionProps={{ onClick: () => router.push("/bidv-link/bank-list") }}
            />
          </div>
        )}

        {/* Loaded / Unlinked */}
        {(state === "loaded" || state === "unlinked") && (
          <div className="pt-[32px] px-[22px]">
            {/* Section label */}
            <p className="text-sm font-normal leading-5 text-foreground-secondary mb-3">
              Ngân hàng liên kết
            </p>

            {/* Bank cards */}
            <div className="flex flex-col gap-3">
              {LINKED_BANKS.map((bank) => (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => router.push(`/bidv-link/bank-detail?bank=${bank.id}`)}
                  className="w-full bg-secondary rounded-[28px] px-[14px] py-[14px] flex items-center gap-3 text-left cursor-pointer active:opacity-80 transition-opacity"
                >
                  <BankLogo id={bank.id} name={bank.name} />
                  <div className="flex-1 min-w-0">
                    <p className="text-md font-semibold leading-6 text-foreground">{bank.name}</p>
                    <p className="text-sm font-normal leading-5 text-foreground-secondary">{bank.account}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add bank CTA — fixed bottom */}
      {(state === "loaded" || state === "unlinked") && (
        <div className="absolute bottom-0 inset-x-0 bg-background px-[22px] pb-[34px] pt-[12px]">
          <Button
            variant="primary"
            size="48"
            className="w-full"
            onClick={() => router.push("/bidv-link/bank-list")}
          >
            Thêm ngân hàng
          </Button>
        </div>
      )}

      {/* Snackbar — unlink success */}
      {showSnackbar && (
        <div className="absolute bottom-[100px] inset-x-0 px-[22px] z-40 animate-in fade-in slide-in-from-bottom-4">
          <ToastBar
            type="success"
            icon={<Check size={20} className="text-success" />}
            title="Hủy liên kết thành công"
            onClose={() => setShowSnackbar(false)}
          />
        </div>
      )}

      {/* Home indicator */}
      <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}

export default function BankManagementPage() {
  return (
    <React.Suspense fallback={null}>
      <BankManagementContent />
    </React.Suspense>
  )
}
