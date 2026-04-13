"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Zap, Droplets, Wifi, Tv } from "lucide-react"
import { Header } from "@/components/ui/header"

const SUBCATEGORIES = [
  { icon: Zap, label: "Điện", route: "/vas/bill/provider?type=electric" },
  { icon: Droplets, label: "Nước", route: "/vas/bill/provider?type=water" },
  { icon: Wifi, label: "Internet", route: "/vas/bill/provider?type=internet" },
  { icon: Tv, label: "Truyền hình", route: "/vas/bill/provider?type=tv" },
]

export default function BillCategory() {
  const router = useRouter()

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header variant="large-title" largeTitle="Thanh toán hóa đơn" leading={<ChevronLeft className="w-6 h-6" onClick={() => router.back()} />} />

      <div className="flex-1 overflow-y-auto pb-[21px]">
        <div className="pt-[24px]">
          <div className="px-[22px] flex flex-col">
            {SUBCATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => router.push(cat.route)}
                className="flex items-center gap-[12px] py-[14px] border-b border-border last:border-0"
              >
                <div className="w-[40px] h-[40px] rounded-14 bg-secondary flex items-center justify-center">
                  <cat.icon className="w-5 h-5 text-foreground" />
                </div>
                <span className="text-md font-medium flex-1 text-left">{cat.label}</span>
                <ChevronRight className="w-5 h-5 text-foreground-secondary" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center pb-[8px]">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}
