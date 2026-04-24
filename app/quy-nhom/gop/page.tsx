"use client"

import * as React from "react"
import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronLeft, Check, CheckCircle2 } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import { TextField } from "@/components/ui/text-field"
import { FeedbackState } from "@/components/ui/feedback-state"
import { ItemList, ItemListItem } from "@/components/ui/item-list"

const QUICK_AMOUNTS = [100000, 200000, 500000, 1000000]

export default function GopTien() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const state = searchParams.get("state") ?? "input"
  const [amount, setAmount] = useState("500000")
  const [selectedChip, setSelectedChip] = useState(500000)

  const formatAmount = (val: string) => {
    const num = parseInt(val.replace(/\D/g, ""), 10)
    return isNaN(num) ? "" : num.toLocaleString("vi-VN")
  }

  /* ═══ SUCCESS ═══ */
  if (state === "success") {
    return (
      <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
        <Header variant="default" leading={<button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full"><ChevronLeft size={18} /></button>} />

        <div className="flex-1 flex flex-col items-center justify-center px-[22px]">
          <FeedbackState
            icon={<CheckCircle2 size={64} className="text-success" strokeWidth={1.5} />}
            title="Góp tiền thành công"
            description="Bạn đã góp 500.000 ₫ vào quỹ Du lịch Đà Lạt 2026"
          />

          <div className="w-full mt-[24px]">
            <ItemList>
              <ItemListItem label="Số tiền góp" metadata="500.000 ₫" divider />
              <ItemListItem label="Tổng quỹ sau góp" metadata="1.700.000 ₫" divider />
              <ItemListItem label="Tiến độ" metadata="34%" />
            </ItemList>
          </div>
        </div>

        <div className="px-[22px] pt-[12px] pb-[16px]">
          <Button variant="primary" className="w-full" onClick={() => router.push("/quy-nhom/dashboard")}>
            Về quỹ nhóm
          </Button>
        </div>
        <div className="flex justify-center pb-[8px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </div>
    )
  }

  /* ═══ CONFIRM ═══ */
  if (state === "confirm") {
    return (
      <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
        <Header variant="default" title="Xác nhận góp tiền" leading={<button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full"><ChevronLeft size={18} /></button>} />

        <div className="flex-1 overflow-y-auto">
          {/* Fund info */}
          <div className="px-[22px] pt-[16px]">
            <div className="bg-secondary rounded-14 px-[14px] py-[12px] mb-[24px] flex items-center gap-[12px]">
              <div className="w-[36px] h-[36px] rounded-8 bg-background flex items-center justify-center text-[20px] shrink-0">
                🏔️
              </div>
              <div>
                <div className="text-[12px] text-foreground-secondary">Quỹ nhóm</div>
                <div className="text-[14px] font-semibold">Du lịch Đà Lạt 2026</div>
              </div>
            </div>
          </div>

          {/* Transaction details */}
          <div className="pt-[24px] pb-[12px] px-[22px]">
            <span className="text-[15px] font-bold">Thông tin góp tiền</span>
          </div>
          <div className="px-[22px]">
            <ItemList>
              <ItemListItem label="Số tiền góp" metadata="500.000 ₫" divider />
              <ItemListItem label="Nguồn tiền" metadata="Ví V-Smart Pay" divider />
              <ItemListItem label="Số dư ví hiện tại" metadata="120.000.000 ₫" divider />
              <ItemListItem label="Số dư sau góp" metadata="119.500.000 ₫" />
            </ItemList>
          </div>
        </div>

        <div className="px-[22px] pt-[12px] pb-[16px]">
          <Button variant="primary" className="w-full" onClick={() => router.push("/quy-nhom/gop?state=success")}>
            Xác nhận góp tiền
          </Button>
        </div>
        <div className="flex justify-center pb-[8px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </div>
    )
  }

  /* ═══ INPUT (default) ═══ */
  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header variant="default" title="Góp tiền" leading={<button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full"><ChevronLeft size={18} /></button>} />

      <div className="flex-1 overflow-y-auto">
        {/* Fund info card */}
        <div className="px-[22px] pt-[16px]">
          <div className="bg-secondary rounded-14 px-[14px] py-[12px] mb-[24px] flex items-center gap-[12px]">
            <div className="w-[36px] h-[36px] rounded-8 bg-foreground text-background flex items-center justify-center text-[10px] font-bold shrink-0">
              DL
            </div>
            <div>
              <div className="text-[14px] font-semibold">Du lịch Đà Lạt 2026</div>
              <div className="text-[12px] text-foreground-secondary">Quỹ: 1.200.000 / 5.000.000 ₫</div>
            </div>
          </div>
        </div>

        {/* Amount input — using TextField component */}
        <div className="px-[22px]">
          <TextField
            label="Số tiền góp"
            value={formatAmount(amount)}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
            placeholder="Nhập số tiền"
            helpText="Số dư ví: 120.000.000 ₫"
            inputMode="numeric"
          />
        </div>

        {/* Quick amount chips */}
        <div className="px-[22px] pt-[16px] flex gap-[8px] flex-wrap">
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              onClick={() => { setAmount(String(amt)); setSelectedChip(amt) }}
              className={`px-[16px] py-[8px] rounded-full text-[13px] font-semibold transition-colors ${
                selectedChip === amt
                  ? "bg-foreground text-background"
                  : "bg-secondary text-foreground"
              }`}
            >
              {(amt / 1000).toLocaleString()}K
            </button>
          ))}
        </div>
      </div>

      <div className="px-[22px] pt-[12px] pb-[16px]">
        <Button
          variant="primary"
          className="w-full"
          onClick={() => router.push("/quy-nhom/gop?state=confirm")}
          disabled={!amount || amount === "0"}
        >
          Tiếp tục
        </Button>
      </div>
      <div className="flex justify-center pb-[8px]">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}
