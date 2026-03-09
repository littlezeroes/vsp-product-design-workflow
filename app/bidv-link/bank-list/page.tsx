"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, Loader2, Building2 } from "lucide-react"
import { Header } from "@/components/ui/header"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { FeedbackState } from "@/components/ui/feedback-state"
import { Button } from "@/components/ui/button"

/* ── Mock data ─────────────────────────────────────────────────── */
const BANKS = [
  { id: "bidv", name: "BIDV", fullName: "Ngân hàng TMCP Đầu tư và Phát triển VN", linked: false },
  { id: "vcb", name: "Vietcombank", fullName: "Ngân hàng TMCP Ngoại thương VN", linked: false },
  { id: "tcb", name: "Techcombank", fullName: "Ngân hàng TMCP Kỹ thương VN", linked: false },
]

function BankLogo({ name }: { name: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-secondary rounded-full">
      <span className="text-[11px] font-bold text-foreground">{name.slice(0, 2).toUpperCase()}</span>
    </div>
  )
}

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
export default function BankListPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "loaded"

  const availableBanks = BANKS.filter((b) => !b.linked)

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header
        variant="large-title"
        largeTitle="Liên kết ngân hàng"
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

      <StepIndicator step={1} total={3} />

      <div className="flex-1 overflow-y-auto pb-[21px]">
        {state === "loading" && (
          <div className="pt-[32px] px-[22px] space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[68px] bg-secondary rounded-[14px] animate-pulse" />
            ))}
          </div>
        )}

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

        {state === "empty" && (
          <div className="pt-[32px] px-[22px]">
            <FeedbackState
              icon={
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                  <Building2 size={32} className="text-success" />
                </div>
              }
              title="Bạn đã liên kết tất cả ngân hàng hỗ trợ"
            />
          </div>
        )}

        {state === "loaded" && (
          <div className="pt-[32px]">
            <div className="px-[22px]">
              <ItemList>
                {availableBanks.map((bank, idx) => (
                  <ItemListItem
                    key={bank.id}
                    prefix={<BankLogo name={bank.name} />}
                    label={bank.name}
                    sublabel={bank.fullName}
                    showChevron
                    divider={idx < availableBanks.length - 1}
                    onPress={() => {
                      if (bank.id === "bidv") {
                        router.push("/bidv-link/bidv-form")
                      }
                    }}
                  />
                ))}
              </ItemList>
            </div>
          </div>
        )}
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] bg-background pointer-events-none">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}
