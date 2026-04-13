"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, AlertTriangle } from "lucide-react"
import { Header } from "@/components/ui/header"
import { InformMessage } from "@/components/ui/inform-message"
import { Section } from "@/components/ui/section"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { Dialog } from "@/components/ui/dialog"
import { FixedBottom } from "@/components/ui/fixed-bottom"
import { ButtonGroup } from "@/components/ui/button-group"
import { MOCK_BALANCE, MOCK_PROFIT, formatVND, MOCK_MONTHLY_STATS } from "../data"

/* ── Page ─────────────────────────────────────────────────────── */
export default function CancelPage() {
  const router = useRouter()
  const [showDialog, setShowDialog] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const { balance } = MOCK_BALANCE

  // Total profit earned
  const totalProfit = MOCK_PROFIT.reduce((sum, y) => sum + y.total, 0)
  // Current month unpaid interest
  const currentMonthInterest = MOCK_MONTHLY_STATS.interestMonth

  // Projected payout = balance + current month interest
  const projectedPayout = balance + currentMonthInterest

  const handleConfirmCancel = () => {
    if (loading) return
    setLoading(true)
    setShowDialog(false)
    setTimeout(() => {
      setLoading(false)
      router.push("/sinhloi/auth?context=cancel")
    }, 500)
  }

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <Header
        variant="default"
        title="Hủy dịch vụ"
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
        {/* Warning message */}
        <div className="pt-[16px] px-[22px]">
          <InformMessage
            hierarchy="secondary"
            icon={<AlertTriangle size={20} className="text-warning" />}
            body={
              <span>
                Sau khi hủy dịch vụ sinh lời:
                <br />• Tiền lời sẽ ngừng được tính
                <br />• Số dư hiện tại sẽ được chuyển về ví
                <br />• Dữ liệu lịch sử vẫn được lưu
                <br />• Bạn có thể đăng ký lại bất kỳ lúc nào
              </span>
            }
          />
        </div>

        {/* Summary section */}
        <div className="pt-[32px] px-[22px]">
          <Section title="TÓM TẮT">
            <ItemList>
              <ItemListItem
                label="Số dư hiện tại"
                metadata={formatVND(balance)}
                divider
              />
              <ItemListItem
                label="Dự kiến nhận về"
                metadata={formatVND(projectedPayout)}
                divider
              />
              <ItemListItem
                label="Lãi tích lũy đã nhận"
                metadata={`+${formatVND(totalProfit)}`}
              />
            </ItemList>
          </Section>
        </div>
      </div>

      {/* Fixed bottom — ButtonGroup */}
      <FixedBottom>
        <ButtonGroup
          layout="horizontal"
          primaryLabel="Xác nhận hủy"
          secondaryLabel="Quay lại"
          primaryProps={{
            intent: "danger",
            isLoading: loading,
            onClick: () => setShowDialog(true),
          }}
          secondaryProps={{
            onClick: () => router.back(),
          }}
        />
      </FixedBottom>

      {/* Home indicator */}
      <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>

      {/* Confirmation dialog */}
      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        type="icon"
        icon={<AlertTriangle size={36} className="text-danger" />}
        title="Bạn chắc chắn muốn hủy?"
        description="Tiền lời sẽ ngừng được tính sau khi hủy. Số dư sẽ được chuyển về ví V-Smart Pay."
        primaryLabel="Xác nhận hủy"
        secondaryLabel="Giữ dịch vụ"
        footerProps={{
          primaryProps: {
            intent: "danger",
            onClick: handleConfirmCancel,
          },
          secondaryProps: {
            onClick: () => setShowDialog(false),
          },
        }}
      />
    </div>
  )
}
