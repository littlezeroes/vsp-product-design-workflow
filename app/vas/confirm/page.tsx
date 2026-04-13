"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { X } from "lucide-react"
import { Header } from "@/components/ui/header"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { Button } from "@/components/ui/button"
import { InformMessage } from "@/components/ui/inform-message"

export default function Confirm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get("type") ?? "topup"
  const state = searchParams.get("state") ?? "default"

  const [loading, setLoading] = React.useState(state === "loading")
  const isInsufficient = state === "insufficient"

  const details = type === "bill"
    ? { title: "Thanh toán hóa đơn", amount: "350,000đ", rows: [
        { label: "Nhà cung cấp", value: searchParams.get("provider") ?? "EVN HCMC" },
        { label: "Mã KH", value: searchParams.get("code") ?? "PE01234567" },
        { label: "Kỳ", value: "03/2026" },
        { label: "Phí dịch vụ", value: "Miễn phí" },
      ]}
    : { title: "Nạp tiền điện thoại", amount: `${searchParams.get("amount") ?? "100,000"}đ`, rows: [
        { label: "Số điện thoại", value: searchParams.get("phone") ?? "0912 345 678" },
        { label: "Nhà mạng", value: "Viettel" },
        { label: "Mệnh giá", value: `${searchParams.get("amount") ?? "100,000"}đ` },
        { label: "Phí", value: "Miễn phí" },
      ]}

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-secondary text-foreground flex flex-col">
      {/* Dark header */}
      <div className="bg-foreground px-[22px] pt-[54px] pb-[60px] flex flex-col items-center">
        <div className="w-full flex items-center mb-[24px]">
          <button onClick={() => router.back()} className="p-[10px] -ml-[10px]">
            <X className="w-6 h-6 text-background" />
          </button>
          <span className="flex-1 text-center text-md font-semibold text-background">Xác nhận</span>
          <div className="w-[44px]" />
        </div>
        <span className="text-[28px] font-bold text-background">{details.amount}</span>
        <span className="text-sm text-background/60 mt-[4px]">{details.title}</span>
      </div>

      {/* White card overlap */}
      <div className="flex-1 overflow-y-auto -mt-[32px] pb-[100px]">
        <div className="mx-[12px] bg-background rounded-28 px-[12px] py-[16px]">
          <ItemList>
            {details.rows.map((r) => (
              <ItemListItem key={r.label} label={r.label} suffix={<span className="text-sm text-foreground-secondary">{r.value}</span>} />
            ))}
          </ItemList>
        </div>

        {/* Payment source */}
        <div className="pt-[16px] px-[22px]">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">Nguồn thanh toán</span>
          <div className={`mt-[8px] bg-background rounded-14 px-[12px] py-[12px] flex items-center justify-between ${isInsufficient ? "border border-danger" : ""}`}>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Ví V-Smart Pay</span>
              <span className="text-xs text-foreground-secondary">Số dư: 1,200,000đ</span>
            </div>
            {isInsufficient && <span className="text-xs text-danger font-medium">Không đủ số dư</span>}
          </div>
        </div>

        {isInsufficient && (
          <div className="pt-[12px] px-[22px]">
            <InformMessage hierarchy="primary" body="Vui lòng nạp thêm tiền hoặc chọn nguồn thanh toán khác" />
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="absolute bottom-0 inset-x-0 bg-secondary">
        <div className="px-[22px] pt-[12px] pb-[16px]">
          <Button variant="primary" className="w-full" disabled={isInsufficient} isLoading={loading} onClick={() => setLoading(true)}>
            Xác nhận giao dịch
          </Button>
        </div>
        <div className="flex justify-center pb-[8px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </div>
    </div>
  )
}
