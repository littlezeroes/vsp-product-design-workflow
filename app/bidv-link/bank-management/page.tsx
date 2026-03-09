"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, Building2 } from "lucide-react"
import { Header } from "@/components/ui/header"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { FeedbackState } from "@/components/ui/feedback-state"
import { Button } from "@/components/ui/button"

/* ── Mock data ─────────────────────────────────────────────────── */
const LINKED_BANKS = [
  { id: "bidv", name: "BIDV", account: "****1234", linkedDate: "09/03/2026" },
]

function BankLogo({ name }: { name: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-secondary rounded-full">
      <span className="text-[11px] font-bold text-foreground">{name.slice(0, 2).toUpperCase()}</span>
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────── */
export default function BankManagementPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "loaded"

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header
        variant="large-title"
        largeTitle="Quản lý thanh toán"
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
          <div className="pt-[32px] px-[22px] space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-[68px] bg-secondary rounded-[14px] animate-pulse" />
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
              title="Chưa liên kết ngân hàng nào"
              actionLabel="Liên kết ngay"
              actionProps={{ onClick: () => router.push("/bidv-link/bank-list") }}
            />
          </div>
        )}

        {/* Loaded */}
        {state === "loaded" && (
          <div className="pt-[32px]">
            <div className="px-[22px]">
              <ItemList>
                {LINKED_BANKS.map((bank, idx) => (
                  <ItemListItem
                    key={bank.id}
                    prefix={<BankLogo name={bank.name} />}
                    label={bank.name}
                    sublabel={bank.account}
                    metadata="Đã liên kết"
                    showChevron
                    divider={idx < LINKED_BANKS.length - 1}
                    onPress={() => router.push("/bidv-link/bank-detail")}
                  />
                ))}
              </ItemList>
            </div>
          </div>
        )}
      </div>

      {/* Add bank CTA */}
      {(state === "loaded") && (
        <div className="absolute bottom-0 inset-x-0 bg-background px-[22px] pb-[34px] pt-[12px]">
          <Button
            variant="secondary"
            size="48"
            className="w-full"
            onClick={() => router.push("/bidv-link/bank-list")}
          >
            Thêm ngân hàng
          </Button>
        </div>
      )}

      {/* Home indicator */}
      <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}
