"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, Loader2 } from "lucide-react"
import { Header } from "@/components/ui/header"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { Button } from "@/components/ui/button"
import { BottomSheet } from "@/components/ui/bottom-sheet"
import { Dialog } from "@/components/ui/dialog"
import { FeedbackState } from "@/components/ui/feedback-state"

/* ── Page ──────────────────────────────────────────────────────── */
export default function BankDetailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "loaded"

  const [unlinkSheet, setUnlinkSheet] = React.useState(
    state === "confirm-normal" || state === "confirm-last"
  )
  const [pendingDialog, setPendingDialog] = React.useState(state === "pending-block")
  const [isChecking, setIsChecking] = React.useState(state === "unlink-check")

  const isLastBank = state === "confirm-last"

  const handleUnlink = () => {
    setIsChecking(true)
    // Simulate check for pending transactions
    setTimeout(() => {
      setIsChecking(false)
      setUnlinkSheet(true)
    }, 800)
  }

  const handleConfirmUnlink = () => {
    setUnlinkSheet(false)
    router.push("/bidv-link/unlink-waiting")
  }

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header
        variant="large-title"
        largeTitle="BIDV"
        leading={
          <button
            type="button"
            onClick={() => router.push("/bidv-link/bank-management")}
            className="w-[44px] h-[44px] flex items-center justify-center rounded-full"
          >
            <ChevronLeft size={18} className="text-foreground" />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto pb-[120px]">
        {/* Error state */}
        {state === "error" && (
          <div className="pt-[32px] px-[22px]">
            <FeedbackState
              title="Không thể tải thông tin"
              description="Vui lòng kiểm tra kết nối và thử lại."
              actionLabel="Thử lại"
              actionProps={{ onClick: () => router.refresh() }}
            />
          </div>
        )}

        {state !== "error" && (
          <>
            {/* Bank card */}
            <div className="pt-[32px]">
              <div className="px-[22px]">
                <div className="bg-secondary rounded-[14px] p-[14px] flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-background flex items-center justify-center">
                    <span className="text-[11px] font-bold text-foreground">BI</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-md font-semibold leading-6 text-foreground">BIDV</p>
                    <p className="text-sm font-normal leading-5 text-foreground-secondary">****1234</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Detail rows */}
            <div className="pt-[32px]">
              <div className="px-[22px]">
                <ItemList>
                  <ItemListItem label="Tên ngân hàng" metadata="BIDV" divider />
                  <ItemListItem label="Số tài khoản" metadata="****1234" divider />
                  <ItemListItem label="Ngày liên kết" metadata="09/03/2026" />
                </ItemList>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Fixed CTA — destructive */}
      {state !== "error" && (
        <div className="absolute bottom-0 inset-x-0 bg-background px-[22px] pb-[34px] pt-[12px]">
          <Button
            variant="secondary"
            intent="danger"
            size="48"
            className="w-full"
            disabled={isChecking}
            isLoading={isChecking}
            onClick={handleUnlink}
          >
            Hủy liên kết
          </Button>
        </div>
      )}

      {/* Unlink Confirm BottomSheet */}
      <BottomSheet open={unlinkSheet} onClose={() => setUnlinkSheet(false)}>
        <div className="pt-[16px] pb-[16px]">
          <h3 className="text-lg font-semibold leading-6 text-foreground mb-[8px]">
            Hủy liên kết BIDV?
          </h3>
          <p className="text-sm font-normal leading-5 text-foreground mb-[24px]">
            {isLastBank
              ? "Đây là ngân hàng liên kết cuối cùng. Sau khi hủy, bạn sẽ không thể nạp/rút tiền cho đến khi liên kết ngân hàng mới."
              : "Bạn có thể liên kết lại sau."
            }
          </p>
          <div className="space-y-3">
            <Button
              variant="primary"
              intent="danger"
              size="48"
              className="w-full"
              onClick={handleConfirmUnlink}
            >
              Hủy liên kết
            </Button>
            <Button
              variant="secondary"
              size="48"
              className="w-full"
              onClick={() => setUnlinkSheet(false)}
            >
              Giữ lại
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* Pending Block Dialog */}
      <Dialog
        open={pendingDialog}
        onClose={() => setPendingDialog(false)}
        title="Không thể hủy liên kết"
        description="Có giao dịch đang xử lý. Vui lòng chờ hoàn tất trước khi hủy liên kết."
        primaryLabel="Đóng"
        secondaryLabel=""
        footerProps={{
          primaryProps: { onClick: () => setPendingDialog(false) },
        }}
      />

      {/* Home indicator */}
      <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}
