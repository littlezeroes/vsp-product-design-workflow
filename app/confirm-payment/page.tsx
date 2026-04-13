"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, ArrowDown } from "lucide-react"
import { Header } from "@/components/ui/header"
import { ItemListItem } from "@/components/ui/item-list"
import { Button } from "@/components/ui/button"

/*
 * [Screen] Xác nhận thanh toán
 * Source: VNPAY SDK Handoff — node 40020542:56839
 * Rebuilt with VSP Design System components
 *
 * Structure (from Figma):
 *   [VSP] Header (large-title variant)
 *   Body
 *     [VSP] Section — Amount input (2.000.000 đ)
 *     Arrow down icon
 *     [VSP] Section — Receive account info (merchant + order ID)
 *     [VSP] Section — Metadata (Dịch vụ, Phí giao dịch)
 *   VSP_SoF_fixedBottom
 *     [VSP] Section — Nguồn thanh toán (wallet cards)
 *     [VSP] fixedBottom — CTA button
 */

export default function ConfirmPaymentPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-grey-100 dark:bg-grey-900 flex flex-col items-center">

      {/* ── iPhone frame ── */}
      <div className="relative w-[390px] h-[844px] bg-background text-foreground flex flex-col rounded-[40px] shadow-xl overflow-hidden mt-[16px]">

      {/* ── Header ── */}
      <Header
        variant="large-title"
        largeTitle="Xác nhận thanh toán"
        leading={
          <button
            onClick={() => router.back()}
            className="p-[10px] min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full active:bg-secondary"
          >
            <ChevronLeft size={18} className="text-foreground" />
          </button>
        }
      />

      {/* ── Body ── */}
      <div className="flex-1 flex flex-col">
        {/* Amount Section */}
        <div className="px-[22px] pt-[16px]">
          <p className="text-[40px] font-bold leading-[48px] tracking-[-1px] text-foreground">
            2.000.000
            <span className="text-[24px] font-normal text-foreground-secondary ml-1">đ</span>
          </p>
        </div>

        {/* Arrow down */}
        <div className="px-[22px] py-[6px]">
          <ArrowDown size={20} className="text-foreground" />
        </div>

        {/* Receive Account Info */}
        <div className="px-[10px]">
          <ItemListItem
            label="{{Loại giao dịch}}"
            sublabel="Mã đơn hàng 0939399222"
            prefix={
              <div className="size-[44px] rounded-full bg-secondary" />
            }
          />
        </div>

        {/* Metadata Section */}
        <div className="px-[22px] pt-[24px]">
          {/* Dịch vụ */}
          <div className="flex items-center justify-between py-2">
            <span className="text-md leading-[24px] text-foreground-secondary">Dịch vụ</span>
            <span className="text-md leading-[24px] font-semibold text-foreground">{"{{Tên dịch vụ}}"}</span>
          </div>
          {/* Phí giao dịch */}
          <div className="flex items-center justify-between py-2">
            <span className="text-md leading-[24px] text-foreground-secondary">Phí giao dịch</span>
            <span className="text-md leading-[24px] font-semibold text-foreground">Miễn phí</span>
          </div>
        </div>
      </div>

      {/* ── Fixed Bottom: Source of Fund + CTA ── */}
      <div className="mt-auto">
        {/* Nguồn thanh toán section */}
        <div className="pt-[24px] pb-[12px]">
          <p className="text-md leading-[24px] font-semibold text-foreground mb-3 px-[22px]">
            Nguồn thanh toán
          </p>

          {/* Payment method cards */}
          <div className="flex gap-3 px-[22px]">
            {/* Ví V-Smart Pay — selected */}
            <button className="relative flex items-center gap-2 px-3 py-3 bg-background min-w-0 shrink-0 rounded-[16px]">
              {/* Border layer — absolute, slightly larger, behind content */}
              <span className="absolute inset-[-1.5px] rounded-[17px] bg-foreground -z-10" aria-hidden="true" />
              <span className="absolute inset-0 rounded-[16px] bg-background -z-[5]" aria-hidden="true" />
              <div className="size-[32px] rounded-[10px] bg-foreground flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 14L9 4L16 14H2Z" fill="white" />
                </svg>
              </div>
              <div className="flex flex-col items-start min-w-0">
                <span className="text-xs leading-[16px] font-medium text-foreground truncate">Ví V-Smart Pay</span>
                <span className="text-sm leading-[20px] font-semibold text-foreground">137.500 đ</span>
              </div>
            </button>

            {/* Nguồn liên kết — disabled / upcoming */}
            <div className="relative flex items-center gap-2 px-3 py-3 bg-background min-w-0 shrink-0 rounded-[16px] opacity-60">
              <span className="absolute inset-[-1px] rounded-[17px] bg-border -z-10" aria-hidden="true" />
              <span className="absolute inset-0 rounded-[16px] bg-background -z-[5]" aria-hidden="true" />
              <div className="size-[32px] rounded-[10px] bg-secondary flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="3" y="5" width="12" height="8" rx="1" stroke="#a1a1a1" strokeWidth="1.5" />
                  <path d="M3 8H15" stroke="#a1a1a1" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="flex flex-col items-start min-w-0">
                <span className="text-xs leading-[16px] font-medium text-foreground-secondary truncate">Nguồn liên kết</span>
                <span className="text-sm leading-[20px] text-foreground-secondary">Sắp ra mắt</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button + Home indicator */}
        <div className="px-[22px] pt-[12px] pb-[8px]">
          <Button variant="primary" size="48" className="w-full">
            Xác thực giao dịch
          </Button>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center pb-[8px] pt-[12px]">
          <div className="w-[139px] h-[5px] bg-foreground rounded-full" />
        </div>
      </div>

      </div>{/* end iPhone frame */}
    </div>
  )
}
