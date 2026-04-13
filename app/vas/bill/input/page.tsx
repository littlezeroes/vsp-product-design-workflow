"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Header } from "@/components/ui/header"
import { TextField } from "@/components/ui/text-field"
import { Button } from "@/components/ui/button"

export default function BillInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const provider = searchParams.get("provider") ?? "EVN HCMC"
  const state = searchParams.get("state") ?? "empty"

  const [code, setCode] = React.useState(state === "typing" ? "PE01234" : "")
  const [loading, setLoading] = React.useState(state === "loading")
  const [error, setError] = React.useState<string | null>(state === "error-not-found" ? "Không tìm thấy hóa đơn" : null)

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push(`/vas/confirm?type=bill&provider=${encodeURIComponent(provider)}&code=${code}`)
    }, 1500)
  }

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header variant="default" title={provider} leading={<ChevronLeft className="w-6 h-6" onClick={() => router.back()} />} />

      <div className="flex-1 overflow-y-auto pb-[100px]">
        {/* Provider card */}
        <div className="pt-[24px] px-[22px]">
          <div className="bg-secondary rounded-14 px-[12px] py-[12px] flex items-center gap-[12px]">
            <div className="w-[40px] h-[40px] rounded-8 bg-background flex items-center justify-center">
              <span className="text-sm font-semibold">{provider.slice(0, 2)}</span>
            </div>
            <span className="text-sm font-semibold">{provider}</span>
          </div>
        </div>

        {/* Input */}
        <div className="pt-[24px] px-[22px]">
          <TextField
            label="Mã khách hàng"
            placeholder="Nhập mã khách hàng"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(null) }}
            error={error ?? undefined}
          />
          <button className="mt-[8px] text-sm text-foreground-secondary underline">
            Xem hướng dẫn
          </button>
        </div>
      </div>

      {/* CTA */}
      <div className="absolute bottom-0 inset-x-0 bg-background">
        <div className="px-[22px] pt-[12px] pb-[16px]">
          <Button variant="primary" className="w-full" disabled={!code} isLoading={loading} onClick={handleSubmit}>
            Tra cứu
          </Button>
        </div>
        <div className="flex justify-center pb-[8px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </div>
    </div>
  )
}
