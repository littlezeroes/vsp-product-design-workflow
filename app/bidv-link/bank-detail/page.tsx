"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, MoreHorizontal, Link2, Info } from "lucide-react"
import { Header } from "@/components/ui/header"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { Button } from "@/components/ui/button"
import { BottomSheet } from "@/components/ui/bottom-sheet"
import { Dialog } from "@/components/ui/dialog"
import { InformMessage } from "@/components/ui/inform-message"
import { FeedbackState } from "@/components/ui/feedback-state"

/* ── Bank brand colors ────────────────────────────────────────── */
const BANK_BRANDS: Record<string, { bg: string; text: string; name: string; account: string }> = {
  techcombank: { bg: "bg-red-600", text: "text-white", name: "Techcombank", account: "****5678" },
  vietcombank: { bg: "bg-green-700", text: "text-white", name: "Vietcombank", account: "****9999" },
  tpbank: { bg: "bg-purple-600", text: "text-white", name: "TPbank", account: "****3456" },
  bidv: { bg: "bg-red-700", text: "text-white", name: "BIDV", account: "****1234" },
}

/* ── Page ──────────────────────────────────────────────────────── */
function BankDetailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "loaded"
  const bankId = searchParams.get("bank") ?? "vietcombank"

  const bank = BANK_BRANDS[bankId] ?? BANK_BRANDS.vietcombank

  const [menuSheet, setMenuSheet] = React.useState(false)
  const [confirmDialog, setConfirmDialog] = React.useState(
    state === "confirm-normal"
  )
  const [lastBankDialog, setLastBankDialog] = React.useState(
    state === "confirm-last"
  )
  const [pendingDialog, setPendingDialog] = React.useState(state === "pending-block")

  const isLastBank = state === "confirm-last"

  const handleMenuDots = () => {
    setMenuSheet(true)
  }

  const handleUnlinkTap = () => {
    setMenuSheet(false)
    if (isLastBank) {
      setLastBankDialog(true)
    } else {
      setConfirmDialog(true)
    }
  }

  const handleConfirmUnlink = () => {
    setConfirmDialog(false)
    setLastBankDialog(false)
    router.push("/bidv-link/unlink-waiting")
  }

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header
        variant="default"
        title="Chi tiết tài khoản"
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

      <div className="flex-1 overflow-y-auto pb-[40px]">
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
            {/* ── Bank card ── */}
            <div className="pt-[32px] px-[22px]">
              <div className="bg-secondary rounded-[28px] p-[20px] flex items-center gap-3 relative">
                {/* Bank logo */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bank.bg}`}>
                  <span className={`text-[14px] font-bold ${bank.text}`}>
                    {bank.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                {/* Bank info */}
                <div className="flex-1 min-w-0">
                  <p className="text-md font-semibold leading-6 text-foreground">{bank.name}</p>
                  <p className="text-sm font-normal leading-5 text-foreground-secondary">
                    STK {bank.account}
                  </p>
                </div>
                {/* Three-dot menu */}
                <button
                  type="button"
                  onClick={handleMenuDots}
                  className="w-[44px] h-[44px] flex items-center justify-center rounded-full shrink-0"
                >
                  <MoreHorizontal size={20} className="text-foreground-secondary" />
                </button>
              </div>
            </div>

            {/* ── Hạn mức giao dịch ── */}
            <div className="pt-[32px] px-[22px]">
              <p className="text-sm font-semibold leading-5 text-foreground-secondary mb-2">
                Hạn mức giao dịch
              </p>
              <ItemList>
                <ItemListItem
                  label="Nạp tiền tối thiểu"
                  metadata="10.000 đ"
                  divider
                />
                <ItemListItem
                  label="Nạp tiền tối đa"
                  metadata="50.000.000 đ"
                />
              </ItemList>
            </div>

            {/* ── Dịch vụ hỗ trợ ── */}
            <div className="pt-[32px] px-[22px]">
              <p className="text-sm font-semibold leading-5 text-foreground-secondary mb-2">
                Dịch vụ hỗ trợ
              </p>
              <ItemList>
                <ItemListItem
                  label="Nạp tiền vào ví"
                  suffix={
                    <span className="text-md font-semibold leading-6 text-success">
                      Miễn phí
                    </span>
                  }
                  divider
                />
                <ItemListItem
                  label="Rút tiền"
                  suffix={
                    <span className="text-md font-semibold leading-6 text-foreground-secondary">
                      Chưa hỗ trợ
                    </span>
                  }
                />
              </ItemList>
            </div>
          </>
        )}
      </div>

      {/* ── Menu Bottom Sheet ── */}
      <BottomSheet open={menuSheet} onClose={() => setMenuSheet(false)}>
        <div className="pt-[8px] pb-[8px]">
          {/* Unlink option */}
          <button
            type="button"
            onClick={handleUnlinkTap}
            className="w-full flex items-center gap-3 py-3 text-left cursor-pointer"
          >
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
              <Link2 size={20} className="text-danger" />
            </div>
            <span className="flex-1 text-md font-semibold leading-6 text-danger">
              Hủy liên kết tài khoản
            </span>
            <ChevronRight size={20} className="text-foreground-secondary shrink-0" />
          </button>

          {/* Inform message */}
          <div className="mt-3">
            <InformMessage
              hierarchy="secondary"
              icon={<Info size={20} />}
              body="Khi hủy liên kết ngân hàng cuối cùng, tài khoản sẽ không thể tiếp tục sử dụng các dịch vụ của V-Smart Pay"
            />
          </div>
        </div>
      </BottomSheet>

      {/* ── Confirm Unlink Dialog (normal) ── */}
      <Dialog
        open={confirmDialog}
        onClose={() => setConfirmDialog(false)}
        type="icon"
        icon={
          <div className="flex items-center gap-2">
            {/* VSP logo placeholder */}
            <div className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center">
              <span className="text-[10px] font-bold text-background">VSP</span>
            </div>
            <Link2 size={16} className="text-foreground-secondary" />
            {/* Bank logo */}
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${bank.bg}`}>
              <span className={`text-[10px] font-bold ${bank.text}`}>
                {bank.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
          </div>
        }
        title="Hủy liên kết ví trên ứng dụng ngân hàng điện tử"
        description="Bạn sẽ được chuyển sang ứng dụng ngân hàng để thực hiện thao tác hủy liên kết ví."
        primaryLabel="Xác thực để hủy liên kết"
        secondaryLabel="Hủy bỏ"
        footerProps={{
          primaryProps: {
            intent: "danger",
            onClick: handleConfirmUnlink,
          },
          secondaryProps: {
            onClick: () => setConfirmDialog(false),
          },
        }}
      />

      {/* ── Last Bank Dialog ── */}
      <Dialog
        open={lastBankDialog}
        onClose={() => setLastBankDialog(false)}
        title="Hủy liên kết ngân hàng cuối cùng"
        description="Sau khi hủy liên kết, số dư ví sẽ không dùng để nạp, rút, thanh toán, chuyển tiền hoặc nhận tiền."
        primaryLabel="Hủy liên kết"
        secondaryLabel="Quay lại"
        footerProps={{
          primaryProps: {
            intent: "danger",
            onClick: handleConfirmUnlink,
          },
          secondaryProps: {
            onClick: () => setLastBankDialog(false),
          },
        }}
      />

      {/* ── Pending Block Dialog ── */}
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

export default function BankDetailPage() {
  return (
    <React.Suspense fallback={null}>
      <BankDetailContent />
    </React.Suspense>
  )
}
