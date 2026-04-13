"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Header } from "@/components/ui/header"
import { TextField } from "@/components/ui/text-field"
import { Button } from "@/components/ui/button"

const DENOMINATIONS = ["10,000", "20,000", "50,000", "100,000", "200,000", "500,000"]
const SAVED_PHONES = [
  { number: "0912 345 678", carrier: "Viettel" },
  { number: "0938 111 222", carrier: "Mobifone" },
]

export default function Topup() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "empty"

  const [phone, setPhone] = React.useState(state === "carrier-detected" ? "0912345678" : "")
  const [selected, setSelected] = React.useState<string | null>(state === "amount-selected" ? "100,000" : null)
  const [error, setError] = React.useState<string | null>(state === "error" ? "Số điện thoại không hợp lệ" : null)

  const carrier = phone.length >= 4
    ? phone.startsWith("09") ? "Viettel"
      : phone.startsWith("093") ? "Mobifone"
      : phone.startsWith("094") ? "Vinaphone"
      : "Nhà mạng"
    : null

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header variant="default" title="Nạp tiền điện thoại" leading={<ChevronLeft className="w-6 h-6" onClick={() => router.back()} />} />

      <div className="flex-1 overflow-y-auto pb-[100px]">
        {/* Saved phones */}
        <div className="pt-[16px] px-[22px]">
          <div className="flex gap-[8px] overflow-x-auto no-scrollbar">
            {SAVED_PHONES.map((p) => (
              <button
                key={p.number}
                onClick={() => setPhone(p.number.replace(/\s/g, ""))}
                className="shrink-0 bg-secondary rounded-14 px-[12px] py-[8px] flex flex-col"
              >
                <span className="text-sm font-medium">{p.number}</span>
                <span className="text-xs text-foreground-secondary">{p.carrier}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Phone input */}
        <div className="pt-[24px] px-[22px]">
          <TextField
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setError(null) }}
            error={error ?? undefined}
          />
          {carrier && (
            <div className="mt-[8px] flex items-center gap-[6px]">
              <div className="w-[20px] h-[20px] rounded-full bg-secondary flex items-center justify-center">
                <span className="text-[10px] font-semibold">{carrier.slice(0, 1)}</span>
              </div>
              <span className="text-sm text-foreground-secondary">{carrier}</span>
            </div>
          )}
        </div>

        {/* Denominations */}
        <div className="pt-[24px]">
          <div className="px-[22px] pb-[12px]">
            <span className="text-md font-semibold">Mệnh giá</span>
          </div>
          <div className="px-[22px] flex flex-wrap gap-[8px]">
            {DENOMINATIONS.map((d) => (
              <button
                key={d}
                onClick={() => setSelected(d)}
                className={`px-[16px] py-[8px] rounded-full text-sm font-medium transition-colors ${
                  selected === d
                    ? "bg-foreground text-background"
                    : "bg-secondary text-foreground"
                }`}
              >
                {d}đ
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="absolute bottom-0 inset-x-0 bg-background">
        <div className="px-[22px] pt-[12px] pb-[16px]">
          <Button variant="primary" className="w-full" disabled={!phone || !selected} onClick={() => router.push(`/vas/confirm?type=topup&phone=${phone}&amount=${selected}`)}>
            Tiếp tục
          </Button>
        </div>
        <div className="flex justify-center pb-[8px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </div>
    </div>
  )
}
