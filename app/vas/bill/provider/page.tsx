"use client"

import * as React from "react"
import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Header } from "@/components/ui/header"
import { TextField } from "@/components/ui/text-field"

const PROVIDERS: Record<string, { region: string; items: string[] }[]> = {
  electric: [
    { region: "TP. Hồ Chí Minh", items: ["EVN HCMC", "EVNSPC"] },
    { region: "Hà Nội", items: ["EVN Hà Nội", "EVNNPC"] },
    { region: "Miền Trung", items: ["EVN CPC"] },
  ],
  water: [
    { region: "TP. Hồ Chí Minh", items: ["Sawaco", "Nước Tân Hòa"] },
    { region: "Hà Nội", items: ["Nước sạch Hà Nội", "Viwasupco"] },
  ],
  internet: [
    { region: "Tất cả", items: ["FPT Telecom", "VNPT", "Viettel", "CMC Telecom"] },
  ],
  tv: [
    { region: "Tất cả", items: ["VTVcab", "SCTV", "K+", "MyTV"] },
  ],
}

export default function ProviderSelectPage() {
  return (
    <Suspense fallback={null}>
      <ProviderSelect />
    </Suspense>
  )
}

function ProviderSelect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get("type") ?? "electric"
  const [search, setSearch] = React.useState("")

  const groups = PROVIDERS[type] ?? PROVIDERS.electric
  const filtered = search
    ? groups.map(g => ({ ...g, items: g.items.filter(i => i.toLowerCase().includes(search.toLowerCase())) })).filter(g => g.items.length > 0)
    : groups

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header variant="default" title="Chọn nhà cung cấp" leading={<ChevronLeft className="w-6 h-6" onClick={() => router.back()} />} />

      <div className="flex-1 overflow-y-auto pb-[21px]">
        <div className="px-[22px] pt-[12px]">
          <TextField label="" placeholder="Tìm nhà cung cấp" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {filtered.length === 0 ? (
          <div className="pt-[48px] flex flex-col items-center">
            <span className="text-md text-foreground-secondary">Không tìm thấy</span>
          </div>
        ) : (
          filtered.map((group) => (
            <div key={group.region} className="pt-[24px]">
              <div className="px-[22px] pb-[12px]">
                <span className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">{group.region}</span>
              </div>
              <div className="px-[22px] flex flex-col">
                {group.items.map((name) => (
                  <button key={name} onClick={() => router.push(`/vas/bill/input?provider=${encodeURIComponent(name)}`)} className="flex items-center gap-[12px] py-[12px] border-b border-border last:border-0">
                    <div className="w-[36px] h-[36px] rounded-8 bg-secondary flex items-center justify-center">
                      <span className="text-xs font-semibold">{name.slice(0, 2)}</span>
                    </div>
                    <span className="text-sm font-medium flex-1 text-left">{name}</span>
                    <ChevronRight className="w-4 h-4 text-foreground-secondary" />
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center pb-[8px]">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}
