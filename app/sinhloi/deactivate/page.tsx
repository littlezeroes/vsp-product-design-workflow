"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"

const CONDITIONS = [
  "Bạn cần rút toàn bộ số tiền từ ví Sinh lời tự động về ví V-Pay trước khi hủy liên kết.",
  "Không có giao dịch Sinh lời tự động nào đang chờ xử lý.",
]

const CONSEQUENCES = [
  "Toàn bộ lịch sử giao dịch Sinh lời tự động sẽ biến mất.",
  "Nếu bạn tái kích hoạt, ví Sinh lời tự động mới sẽ được tạo ra.",
]

function BulletCard({
  items,
  borderColor = "border-border",
}: {
  items: string[]
  borderColor?: string
}) {
  return (
    <div className="px-[22px]">
      <div className={`bg-background border ${borderColor} rounded-[14px] py-[8px]`}>
        {items.map((item, i) => (
          <div key={i} className="px-[16px] py-[8px]">
            <p className="text-sm leading-5 text-foreground whitespace-pre-wrap">
              •{"  "}{item}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DeactivatePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-grey-100 dark:bg-grey-900 flex flex-col items-center">
      <div className="relative w-[390px] h-[844px] bg-background text-foreground flex flex-col rounded-[40px] shadow-xl overflow-hidden mt-[16px]">

        {/* Header */}
        <Header
          variant="default"
          title="Tắt Sinh lời tự động"
          showStatusBar
          leading={
            <button
              type="button"
              onClick={() => router.back()}
              className="p-[10px] min-h-[44px] rounded-full flex items-center justify-center"
            >
              <ChevronLeft size={18} className="text-foreground" />
            </button>
          }
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Section 1: Conditions */}
          <div className="px-[22px] pt-[24px] pb-[16px]">
            <p className="text-md font-semibold leading-6 text-foreground">
              Điều kiện tắt Sinh lời tự động
            </p>
          </div>
          <BulletCard items={CONDITIONS} />

          {/* Section 2: Consequences */}
          <div className="px-[22px] pt-[32px] pb-[16px]">
            <p className="text-md font-semibold leading-6 text-foreground">
              Điều gì xảy ra sau khi tắt Sinh lời tự động?
            </p>
          </div>
          <BulletCard items={CONSEQUENCES} />
        </div>

        {/* Fixed bottom — dual buttons */}
        <div className="shrink-0 bg-background pt-[16px] flex flex-col items-center gap-[16px]">
          <div className="w-full px-[22px] flex flex-col gap-[12px]">
            <Button
              variant="secondary"
              size="48"
              className="w-full border border-foreground"
              onClick={() => router.back()}
            >
              Quay lại
            </Button>
            <Button
              variant="primary"
              intent="danger"
              size="48"
              className="w-full"
              onClick={() => router.push("/sinhloi/otp?context=deactivate")}
            >
              Xác nhận tắt
            </Button>
          </div>
          {/* Home indicator */}
          <div className="h-[21px] flex items-end justify-center pb-[8px]">
            <div className="w-[139px] h-[5px] bg-foreground rounded-[100px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
