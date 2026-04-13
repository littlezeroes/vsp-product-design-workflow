"use client"

import * as React from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { Header } from "@/components/ui/header"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { ButtonGroup } from "@/components/ui/button-group"
import { FixedBottom } from "@/components/ui/fixed-bottom"
import {
  formatVND,
  SINHLOI_CONFIG,
  MOCK_BALANCE,
  MOCK_USER,
  MOCK_PROFIT,
} from "../../data"

/* ── Unified Result Screen ─────────────────────────────────────── */
/* Handles: activate, deposit, withdraw, cancel results           */
export default function ResultPage() {
  return (
    <React.Suspense fallback={null}>
      <ResultContent />
    </React.Suspense>
  )
}


function ResultContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  const type = params.type as string // activate | deposit | withdraw | cancel
  const status = searchParams.get("status") || "success" // success | processing | failed
  const amount = parseInt(searchParams.get("amount") || "0", 10)
  const errorCode = searchParams.get("error")

  const isSuccess = status === "success"
  const isProcessing = status === "processing"
  const isFailed = !isSuccess && !isProcessing
  const isNonRetryable = errorCode === "non-retryable"

  const isDeposit = type === "deposit"
  const isWithdraw = type === "withdraw"
  const isActivate = type === "activate"
  const isCancel = type === "cancel"
  const isTx = isDeposit || isWithdraw

  const txnId = "TXN" + Date.now().toString().slice(-8)
  const timestamp = new Date().toLocaleString("vi-VN")

  // Calculated balances
  const newSinhloiBalance = isDeposit
    ? MOCK_BALANCE.balance + amount
    : isWithdraw
    ? MOCK_BALANCE.balance - amount
    : MOCK_BALANCE.balance
  const newWalletBalance = isDeposit
    ? MOCK_USER.walletBalance - amount
    : isWithdraw
    ? MOCK_USER.walletBalance + amount
    : MOCK_USER.walletBalance

  const totalProfit = MOCK_PROFIT.reduce((sum, y) => sum + y.total, 0)

  const productName = "Sinh lời tự động"

  /* ── Dynamic content per type + status ────────────────────────── */
  const getIcon = () => {
    if (isSuccess)
      return <CheckCircle2 size={64} className="text-success" />
    if (isProcessing)
      return <Clock size={64} className="text-foreground-secondary" />
    return <AlertCircle size={64} className="text-danger" />
  }

  const getTitle = () => {
    if (isActivate) {
      if (isSuccess) return `Đăng ký ${productName}\nthành công`
      if (isProcessing) return "Đang xử lý"
      if (isNonRetryable) return "Không thể đăng ký"
      return "Đăng ký thất bại"
    }
    if (isCancel) {
      if (isSuccess) return "Huỷ đăng ký thành công"
      if (isProcessing) return "Đang xử lý"
      return "Huỷ thất bại"
    }
    // deposit / withdraw
    if (isSuccess) return "Giao dịch thành công"
    if (isProcessing) return "Đang xử lý"
    return "Giao dịch thất bại"
  }

  const getDescription = () => {
    if (isActivate) {
      if (isSuccess) return "Bạn có thể nạp tiền ngay hôm nay để bắt đầu sinh lời"
      if (isProcessing) return "Yêu cầu đăng ký đang được xử lý. Vui lòng kiểm tra lại sau."
      if (isNonRetryable) return "Tài khoản không đủ điều kiện. Vui lòng liên hệ CSKH."
      return "Đã xảy ra lỗi. Vui lòng thử lại."
    }
    if (isCancel) {
      if (isSuccess) return "Tài khoản sinh lời đã được huỷ. Tiền lãi (nếu có) sẽ được trả vào cuối tháng."
      if (isProcessing) return "Yêu cầu huỷ đang được xử lý. Kiểm tra lại sau."
      return "Không thể huỷ đăng ký sinh lời lúc này. Vui lòng thử lại sau."
    }
    // deposit / withdraw
    if (isProcessing) {
      return isDeposit
        ? "Giao dịch nạp tiền đang được xử lý. Kiểm tra lại trong lịch sử giao dịch."
        : "Giao dịch rút tiền đang được xử lý. Kiểm tra lại trong lịch sử giao dịch."
    }
    if (isFailed) return "Vui lòng thử lại hoặc liên hệ CSKH."
    return undefined
  }

  /* ── Navigation handlers ──────────────────────────────────────── */
  const goHome = () => router.push("/")
  const goDashboard = () => router.push("/sinhloi/dashboard")
  const goDetail = () => router.push("/sinhloi/history")

  const getRetryRoute = () => {
    if (isActivate) return "/sinhloi/activate"
    if (isCancel) return "/sinhloi/cancel"
    return `/sinhloi/deposit-withdraw?tab=${type}`
  }

  /* ── Primary / Secondary button labels + handlers ──────────────── */
  const getPrimaryLabel = () => {
    if (isFailed && !isNonRetryable) return "Thử lại"
    if (isSuccess && isActivate) return "Nạp tiền ngay"
    if (isSuccess && isTx) return "Về trang chủ"
    return "Về trang chủ"
  }

  const getSecondaryLabel = () => {
    if (isFailed && !isNonRetryable) return "Về trang chủ"
    if (isSuccess && isActivate) return "Chi tiết sinh lời"
    if (isSuccess && isTx) return "Chi tiết"
    return "Về trang chủ"
  }

  const handlePrimary = () => {
    if (isFailed && !isNonRetryable) {
      router.push(getRetryRoute())
    } else if (isSuccess && isActivate) {
      router.push("/sinhloi/deposit-withdraw?tab=deposit")
    } else if (isSuccess && isTx) {
      goDashboard()
    } else {
      goHome()
    }
  }

  const handleSecondary = () => {
    if (isFailed && !isNonRetryable) {
      goHome()
    } else if (isSuccess && isActivate) {
      goDashboard()
    } else if (isSuccess && isTx) {
      goDetail()
    } else {
      goHome()
    }
  }

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col pb-[100px]">
      {/* Status bar only — Header with no title, no back */}
      <Header variant="default" showStatusBar={true} />

      {/* Illustration placeholder — 200x200, centered */}
      <div className="flex items-center justify-center mt-[56px]">
        <div className="w-[200px] h-[200px] flex items-center justify-center">
          {getIcon()}
        </div>
      </div>

      {/* Content — px-32, centered text */}
      <div className="flex flex-col items-center gap-[32px] px-[22px] pt-[32px]">
        {/* Title + Description */}
        <div className="flex flex-col items-center gap-[8px]">
          {/* Title: 24px semibold, centered, multiline */}
          <h2 className="text-xl font-semibold leading-8 text-foreground text-center whitespace-pre-line">
            {getTitle()}
          </h2>
          {getDescription() && (
            <p className="text-md font-normal leading-6 text-foreground text-center">
              {getDescription()}
            </p>
          )}
        </div>

        {/* Amount display for successful TX */}
        {isSuccess && isTx && amount > 0 && (
          <p className="text-[28px] font-bold leading-[34px] text-foreground text-center">
            {formatVND(amount)}
          </p>
        )}

        {/* Transaction details — ItemList */}
        {isTx && (isSuccess || isProcessing) && (
          <div className="w-full">
            <ItemList>
              <ItemListItem label="Mã giao dịch" metadata={txnId} divider />
              <ItemListItem label="Thời gian" metadata={timestamp} divider />
              <ItemListItem
                label="Dịch vụ"
                metadata={isDeposit ? "Nạp tiền sinh lời" : "Rút tiền sinh lời"}
                divider
              />
              <ItemListItem label="Số tiền" metadata={formatVND(amount)} divider />
              <ItemListItem label="Phí" metadata="Miễn phí" divider />
              {isSuccess && isDeposit && (
                <ItemListItem
                  label="Số dư sinh lời mới"
                  metadata={`${newSinhloiBalance.toLocaleString("vi-VN")}₫`}
                />
              )}
              {isSuccess && isWithdraw && (
                <>
                  <ItemListItem
                    label="Số dư SL còn lại"
                    metadata={`${newSinhloiBalance.toLocaleString("vi-VN")}₫`}
                    divider
                  />
                  <ItemListItem
                    label="Số dư ví mới"
                    metadata={`${newWalletBalance.toLocaleString("vi-VN")}₫`}
                  />
                </>
              )}
            </ItemList>
          </div>
        )}

        {/* Activate success details */}
        {isActivate && isSuccess && (
          <div className="w-full">
            <ItemList>
              <ItemListItem
                label="Sinh lời lên đến"
                suffix={
                  <span className="text-md font-semibold leading-6 text-success">
                    {`${SINHLOI_CONFIG.interestRate}%/năm`}
                  </span>
                }
                divider
              />
              <ItemListItem
                label="Số dư tối đa"
                metadata={formatVND(SINHLOI_CONFIG.maxBalance)}
              />
            </ItemList>
          </div>
        )}

        {/* Cancel success — total profit */}
        {isCancel && isSuccess && (
          <div className="w-full">
            <ItemList>
              <ItemListItem
                label="Tổng lợi nhuận đã nhận"
                metadata={`+${totalProfit.toLocaleString("vi-VN")}₫`}
              />
            </ItemList>
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* FixedBottom with ButtonGroup VERTICAL */}
      <FixedBottom>
        <ButtonGroup
          layout="vertical"
          primaryLabel={getPrimaryLabel()}
          secondaryLabel={getSecondaryLabel()}
          primaryProps={{ onClick: handlePrimary }}
          secondaryProps={{ onClick: handleSecondary }}
        />
      </FixedBottom>

      {/* Home indicator */}
      <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}
