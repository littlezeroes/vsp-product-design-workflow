"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Search,
  Star,
  Zap,
  Droplets,
  Wifi,
  Smartphone,
  GraduationCap,
  Landmark,
  Film,
  Train,
  Bus,
  Car,
  Hotel,
  Building2,
  ShoppingBag,
  School,
  Stethoscope,
  TrendingUp,
  BarChart3,
  Home as HomeIcon,
  Shield,
  CreditCard as CardIcon,
  Banknote,
  Gift,
  Ticket,
  Users,
  Send,
  Receipt,
  Calendar,
} from "lucide-react"

/* ── Service data per phase ── */
interface Service {
  icon: React.ElementType
  label: string
  phase: "q2" | "q3" | "q4"
}

const CATEGORIES: { title: string; services: Service[] }[] = [
  {
    title: "Yêu thích",
    services: [
      { icon: Zap, label: "Điện", phase: "q2" },
      { icon: Send, label: "Chuyển tiền", phase: "q2" },
      { icon: Smartphone, label: "Data", phase: "q2" },
      { icon: TrendingUp, label: "Sinh lời", phase: "q2" },
    ],
  },
  {
    title: "Thanh toán",
    services: [
      { icon: Zap, label: "Điện", phase: "q2" },
      { icon: Droplets, label: "Nước", phase: "q2" },
      { icon: Wifi, label: "Internet", phase: "q2" },
      { icon: Smartphone, label: "Data", phase: "q2" },
      { icon: GraduationCap, label: "Học phí", phase: "q2" },
      { icon: Landmark, label: "Khoản vay", phase: "q2" },
      { icon: Receipt, label: "Hoá đơn đã lưu", phase: "q2" },
      { icon: Calendar, label: "Tự động", phase: "q4" },
    ],
  },
  {
    title: "Vé & Di chuyển",
    services: [
      { icon: Film, label: "Vé phim", phase: "q2" },
      { icon: Train, label: "Vé tàu", phase: "q2" },
      { icon: Bus, label: "Xe buýt", phase: "q2" },
    ],
  },
  {
    title: "Vingroup",
    services: [
      { icon: Car, label: "XanhSM", phase: "q3" },
      { icon: Hotel, label: "VinPearl", phase: "q3" },
      { icon: Stethoscope, label: "Vinmec", phase: "q3" },
      { icon: Car, label: "VinFast", phase: "q3" },
      { icon: ShoppingBag, label: "Vincom", phase: "q3" },
      { icon: School, label: "VinSchool", phase: "q3" },
    ],
  },
  {
    title: "Tài chính",
    services: [
      { icon: TrendingUp, label: "Sinh lời", phase: "q2" },
      { icon: BarChart3, label: "Chứng chỉ quỹ", phase: "q3" },
      { icon: HomeIcon, label: "BĐS mã hoá", phase: "q3" },
      { icon: Shield, label: "Bảo hiểm", phase: "q2" },
      { icon: CardIcon, label: "Ví trả sau", phase: "q3" },
      { icon: Banknote, label: "Vay VinFast", phase: "q3" },
    ],
  },
  {
    title: "Ưu đãi",
    services: [
      { icon: Star, label: "V-Point", phase: "q3" },
      { icon: Gift, label: "Voucher", phase: "q2" },
      { icon: Ticket, label: "Ưu đãi TT", phase: "q3" },
      { icon: Users, label: "Giới thiệu bạn", phase: "q3" },
    ],
  },
  {
    title: "Chuyển tiền",
    services: [
      { icon: Send, label: "Ví VSP", phase: "q2" },
      { icon: Landmark, label: "Ngân hàng", phase: "q2" },
      { icon: Users, label: "Ví nhóm", phase: "q3" },
      { icon: Users, label: "Ví gia đình", phase: "q3" },
      { icon: Receipt, label: "Chia hoá đơn", phase: "q2" },
    ],
  },
]

function getVisiblePhases(state: string): Set<string> {
  switch (state) {
    case "q2-launch":
      return new Set(["q2"])
    case "q3-growing":
      return new Set(["q2", "q3"])
    case "q4-full":
    case "search":
    default:
      return new Set(["q2", "q3", "q4"])
  }
}

export default function ServicesHub() {
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "q4-full"
  const [searchQuery, setSearchQuery] = React.useState("")

  const visiblePhases = getVisiblePhases(state)
  const isSearch = state === "search" || searchQuery.length > 0

  const filteredCategories = CATEGORIES.map((cat) => ({
    ...cat,
    services: cat.services.filter((s) => {
      const phaseOk = visiblePhases.has(s.phase)
      const searchOk = !isSearch || s.label.toLowerCase().includes(searchQuery.toLowerCase())
      return phaseOk && searchOk
    }),
  })).filter((cat) => cat.services.length > 0)

  // Count total services
  const totalServices = filteredCategories.reduce((acc, cat) => acc + cat.services.length, 0)

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      {/* Status Bar */}
      <div className="h-[54px] px-[22px] flex items-end justify-between pb-[6px]">
        <span className="text-sm font-semibold">9:41</span>
        <div className="flex gap-1">
          <div className="w-4 h-2 bg-foreground rounded-sm" />
          <div className="w-4 h-2 bg-foreground rounded-sm" />
          <div className="w-4 h-2 bg-foreground rounded-sm" />
        </div>
      </div>

      {/* NavBar */}
      <div className="h-[56px] px-[22px] flex items-center gap-2">
        <span className="text-[24px] font-bold tracking-[-0.25px] flex-1">Dịch vụ</span>
        <span className="text-[12px] text-foreground-secondary">{totalServices} dịch vụ</span>
      </div>

      {/* Search Bar */}
      <div className="px-[22px] pb-[8px]">
        <div className="flex items-center gap-3 bg-search rounded-full px-[16px] py-[10px]">
          <Search size={18} className="text-foreground-secondary shrink-0" />
          <input
            type="text"
            placeholder="Tìm dịch vụ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-foreground-secondary"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-[80px]">
        {filteredCategories.map((cat, catIdx) => (
          <div key={cat.title + catIdx} className="pt-[20px]">
            {/* Category title (skip for "Yêu thích") */}
            <div className="px-[22px] flex items-center justify-between mb-[10px]">
              <span className="text-[13px] font-bold text-foreground-secondary uppercase tracking-wide">
                {cat.title === "Yêu thích" ? "⭐ Yêu thích" : cat.title}
              </span>
              {cat.title === "Yêu thích" && (
                <button className="text-[11px] text-foreground-secondary">Sửa</button>
              )}
            </div>

            {/* Service grid */}
            <div className="px-[22px]">
              {cat.title === "Yêu thích" ? (
                /* Favorites: horizontal scroll */
                <div className="flex gap-[10px] overflow-x-auto pb-2">
                  {cat.services.map((s, i) => (
                    <button
                      key={i}
                      className="flex flex-col items-center gap-[6px] min-w-[72px] py-[10px] bg-secondary rounded-14"
                    >
                      <s.icon size={20} />
                      <span className="text-[11px] font-medium whitespace-nowrap">{s.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                /* Regular: 4-column grid */
                <div className="grid grid-cols-4 gap-y-[14px] gap-x-[10px]">
                  {cat.services.map((s, i) => (
                    <button
                      key={i}
                      className="flex flex-col items-center gap-[6px]"
                    >
                      <div className="w-[48px] h-[48px] rounded-14 bg-secondary flex items-center justify-center">
                        <s.icon size={20} />
                      </div>
                      <span className="text-[11px] font-medium text-center leading-tight">{s.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Divider between categories */}
            {catIdx < filteredCategories.length - 1 && cat.title !== "Yêu thích" && (
              <div className="mx-[22px] mt-[16px] border-b border-border" />
            )}
          </div>
        ))}

        {/* Empty search */}
        {filteredCategories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-[80px] px-[22px]">
            <Search size={48} className="text-foreground-secondary opacity-30 mb-4" />
            <span className="text-[15px] font-semibold">Không tìm thấy dịch vụ</span>
            <span className="text-[13px] text-foreground-secondary mt-1">
              Thử từ khoá khác
            </span>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="flex justify-around py-[8px] pb-[28px]">
          {[
            { label: "Trang chủ", active: false },
            { label: "Dịch vụ", active: true },
            { label: "QR", active: false, isCenter: true },
            { label: "Giao dịch", active: false },
            { label: "Tài khoản", active: false },
          ].map((tab) => (
            <button key={tab.label} className="flex flex-col items-center gap-1">
              {tab.isCenter ? (
                <div className="w-[44px] h-[44px] rounded-14 bg-foreground flex items-center justify-center -mt-[10px]">
                  <CreditCard size={20} className="text-background" />
                </div>
              ) : (
                <div
                  className={`w-[24px] h-[24px] rounded-full ${
                    tab.active ? "bg-foreground" : "bg-secondary"
                  }`}
                />
              )}
              <span
                className={`text-[10px] ${
                  tab.active ? "font-bold text-foreground" : "text-foreground-secondary"
                }`}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
