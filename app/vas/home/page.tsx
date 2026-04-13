"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, Search, Zap, Droplets, Wifi, Smartphone, Landmark, MoreHorizontal, Settings } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Skeleton } from "@/components/ui/skeleton"

const CATEGORIES = [
  { icon: Zap, label: "Điện", route: "/vas/bill?cat=electric" },
  { icon: Droplets, label: "Nước", route: "/vas/bill?cat=water" },
  { icon: Wifi, label: "Internet", route: "/vas/bill?cat=internet" },
  { icon: Smartphone, label: "Di động", route: "/vas/topup" },
  { icon: Landmark, label: "Tài chính", route: "/vas/finance" },
  { icon: MoreHorizontal, label: "Khác", route: "/vas/bill?cat=other" },
]

const SAVED = [
  { id: "1", label: "EVN HCM", sub: "PE01 ••• 456", type: "bill" },
  { id: "2", label: "0912 345 678", sub: "Viettel", type: "phone" },
  { id: "3", label: "FPT Internet", sub: "HD ••• 789", type: "bill" },
]

export default function VasHome() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "loaded"

  if (state === "loading") {
    return (
      <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
        <Header variant="large-title" largeTitle="Dịch vụ" leading={<ChevronLeft className="w-6 h-6" onClick={() => router.back()} />} />
        <div className="flex-1 px-[22px] pt-[24px] flex flex-col gap-[16px]">
          <Skeleton className="h-[48px] w-full rounded-14" />
          <div className="grid grid-cols-3 gap-[12px]">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-[88px] rounded-28" />)}
          </div>
        </div>
      </div>
    )
  }

  const showSaved = state !== "empty-saved"

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header variant="large-title" largeTitle="Dịch vụ" leading={<ChevronLeft className="w-6 h-6" onClick={() => router.back()} />} />

      <div className="flex-1 overflow-y-auto pb-[21px]">
        {/* Search */}
        <div className="px-[22px] pt-[12px]">
          <div className="flex items-center gap-[8px] h-[44px] bg-secondary rounded-14 px-[12px]">
            <Search className="w-5 h-5 text-foreground-secondary" />
            <span className="text-sm text-foreground-secondary">Tìm dịch vụ</span>
          </div>
        </div>

        {/* Saved items */}
        {showSaved && (
          <div className="pt-[24px]">
            <div className="px-[22px] pb-[12px] flex items-center justify-between">
              <span className="text-md font-semibold">Đã lưu</span>
              <button onClick={() => router.push("/vas/saved")} className="flex items-center gap-[4px] text-sm text-foreground-secondary">
                <Settings className="w-4 h-4" />
                <span>Quản lý</span>
              </button>
            </div>
            <div className="px-[22px] flex gap-[8px] overflow-x-auto no-scrollbar">
              {SAVED.map((s) => (
                <button key={s.id} className="shrink-0 w-[120px] bg-secondary rounded-14 px-[12px] py-[12px] flex flex-col gap-[4px] text-left">
                  <span className="text-sm font-semibold truncate w-full">{s.label}</span>
                  <span className="text-xs text-foreground-secondary truncate w-full">{s.sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="pt-[24px]">
          <div className="px-[22px] pb-[12px]">
            <span className="text-md font-semibold">Danh mục</span>
          </div>
          <div className="px-[22px] grid grid-cols-3 gap-[12px]">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => router.push(cat.route)}
                className="flex flex-col items-center gap-[8px] bg-secondary rounded-28 py-[16px]"
              >
                <cat.icon className="w-6 h-6 text-foreground" />
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Home indicator */}
      <div className="flex justify-center pb-[8px]">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}
