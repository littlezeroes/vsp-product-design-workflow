"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, Info } from "lucide-react"
import { Header } from "@/components/ui/header"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { InformMessage } from "@/components/ui/inform-message"
import { ButtonGroup } from "@/components/ui/button-group"
import { FixedBottom } from "@/components/ui/fixed-bottom"
import { Dialog } from "@/components/ui/dialog"
import { FeedbackState } from "@/components/ui/feedback-state"
import { formatVND, SINHLOI_CONFIG, MOCK_USER, MOCK_BALANCE, calculateInterest } from "../data"

/* ── Constants ──────────────────────────────────────────────────── */
const STALE_TIMEOUT_MS = 5 * 60 * 1000 // 5 minutes
const AUTH_THRESHOLD = 5_000_000 // Nap <= 5M skip auth per decisions.md

/* ── Confirm Transaction Screen ─────────────────────────────────── */
export default function ConfirmTxPage() {
  return (
    <React.Suspense fallback={null}>
      <ConfirmTxContent />
    </React.Suspense>
  )
}

function ConfirmTxContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get("type") || "deposit"
  const amount = parseInt(searchParams.get("amount") || "0", 10)

  const [loading, setLoading] = React.useState(false)
  const [fetchLoading, setFetchLoading] = React.useState(true)
  const [fetchError, setFetchError] = React.useState(false)
  const [networkDialog, setNetworkDialog] = React.useState(false)
  const [sessionDialog, setSessionDialog] = React.useState(false)
  const [staleWarning, setStaleWarning] = React.useState(false)

  const isDeposit = type === "deposit"
  const serviceTitle = isDeposit ? "Nạp tiền sinh lời" : "Rút tiền sinh lời"

  const estimatedInterestYear = calculateInterest(amount, SINHLOI_CONFIG.interestRate)
  const estimatedInterestDay = Math.round(estimatedInterestYear / 365)
  const estimatedInterestMonth = Math.round(estimatedInterestYear / 12)

  // Simulate fresh balance fetch on mount
  React.useEffect(() => {
    const timer = setTimeout(() => setFetchLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // Stale timeout
  React.useEffect(() => {
    const timer = setTimeout(() => setStaleWarning(true), STALE_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [])

  // Tiered auth per decisions.md
  const handleConfirm = () => {
    if (loading) return
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      if (isDeposit && amount <= AUTH_THRESHOLD) {
        // Skip auth for small deposits
        router.push(`/sinhloi/result/${type}?amount=${amount}&status=success`)
      } else {
        // Require OTP auth
        router.push(`/sinhloi/otp?type=${type}&amount=${amount}`)
      }
    }, 500)
  }

  const handleCancel = () => {
    router.back()
  }

  // Balance after withdraw
  const balanceAfterWithdraw = MOCK_BALANCE.balance - amount

  // Fetch error state
  if (fetchError) {
    return (
      <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
        <Header
          variant="default"
          title="Xác nhận"
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
        <div className="flex-1 flex items-center justify-center px-[22px]">
          <FeedbackState
            title="Không thể tải thông tin giao dịch"
            actionLabel="Thử lại"
            actionProps={{
              onClick: () => {
                setFetchError(false)
                setFetchLoading(true)
                setTimeout(() => setFetchLoading(false), 800)
              },
            }}
          />
        </div>
        {/* Home indicator */}
        <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col pb-[100px]">
      {/* Header */}
      <Header
        variant="default"
        title="Xác nhận"
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

      {fetchLoading ? (
        /* Loading skeleton */
        <div className="px-[22px] pt-[32px]">
          <div className="bg-secondary rounded-28 px-[20px] py-[24px] space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-background rounded-14 animate-pulse" />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* Stale warning */}
          {staleWarning && (
            <div className="px-[22px] pt-[16px]">
              <InformMessage
                hierarchy="primary"
                icon={<Info size={20} />}
                body="Thông tin có thể đã thay đổi. Vui lòng kiểm tra lại."
                actionLabel="Quay lại"
                onAction={() => router.back()}
              />
            </div>
          )}

          {/* Transaction summary section */}
          <div className="pt-[32px] px-[22px]">
            <ItemList>
              <ItemListItem
                label="Loại giao dịch"
                metadata={serviceTitle}
                divider
              />
              <ItemListItem
                label="Số tiền"
                metadata={formatVND(amount)}
                divider
              />
              <ItemListItem
                label="Phí giao dịch"
                metadata="Miễn phí"
                divider
              />
              <ItemListItem
                label={isDeposit ? "Từ" : "Từ"}
                metadata={isDeposit ? "Ví V-Smart Pay" : "Ví sinh lời"}
                divider
              />
              <ItemListItem
                label={isDeposit ? "Đến" : "Về"}
                metadata={isDeposit ? "Ví sinh lời" : "Ví V-Smart Pay"}
                divider
              />
              {isDeposit ? (
                <>
                  <ItemListItem
                    label="Lãi suất dự kiến"
                    metadata={`${SINHLOI_CONFIG.interestRate}%/năm`}
                    divider
                  />
                  <ItemListItem
                    label="Tần suất nhận lãi"
                    metadata="Hàng tháng"
                    divider
                  />
                  <ItemListItem
                    label="Lãi ước tính/ngày"
                    metadata={`+${estimatedInterestDay.toLocaleString("vi-VN")}₫`}
                    divider
                  />
                  <ItemListItem
                    label="Lãi ước tính/tháng"
                    metadata={`+${estimatedInterestMonth.toLocaleString("vi-VN")}₫`}
                  />
                </>
              ) : (
                <>
                  <ItemListItem
                    label="Số dư SL sau rút"
                    metadata={`${balanceAfterWithdraw.toLocaleString("vi-VN")}₫`}
                    divider
                  />
                  <ItemListItem
                    label="Lãi bị giảm/ngày"
                    metadata={`-${estimatedInterestDay.toLocaleString("vi-VN")}₫`}
                  />
                </>
              )}
            </ItemList>
          </div>

          {/* InformMessage */}
          <div className="pt-[32px] px-[22px]">
            <InformMessage
              hierarchy="secondary"
              icon={<Info size={20} />}
              body={
                isDeposit
                  ? "Lợi nhuận là tạm tính và có thể thay đổi theo điều kiện thị trường."
                  : "Tiền sẽ về Ví V-Smart Pay ngay lập tức sau khi xác thực."
              }
            />
          </div>

          {/* Tiered auth notice for small deposits */}
          {isDeposit && amount <= AUTH_THRESHOLD && (
            <div className="pt-[16px] px-[22px]">
              <InformMessage
                hierarchy="primary"
                icon={<Info size={20} />}
                body="Giao dịch nạp dưới 5 triệu không cần xác thực OTP."
              />
            </div>
          )}
        </div>
      )}

      {/* FixedBottom with ButtonGroup */}
      <FixedBottom>
        <ButtonGroup
          layout="horizontal"
          primaryLabel="Xác nhận"
          secondaryLabel="Huỷ"
          primaryProps={{
            onClick: handleConfirm,
            disabled: fetchLoading || staleWarning,
            isLoading: loading,
          }}
          secondaryProps={{
            onClick: handleCancel,
          }}
        />
      </FixedBottom>

      {/* Session Timeout Dialog */}
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

      {/* Network Dialog */}
      <Dialog
        open={networkDialog}
        onClose={() => setNetworkDialog(false)}
        title="Không có kết nối mạng"
        description="Vui lòng kiểm tra Internet và thử lại."
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
