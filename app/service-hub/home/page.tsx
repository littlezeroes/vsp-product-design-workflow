"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  ChevronRight,
  CreditCard,
  Eye,
  EyeOff,
  Receipt,
  Send,
  Shield,
  Film,
  Train,
  Smartphone,
  Home as HomeIcon,
  BarChart3,
  Gift,
  Ticket,
  Car,
  Stethoscope,
  Zap,
  Droplets,
} from "lucide-react"

/* ── Quick Actions (giữ design gốc CEO đã duyệt) ── */
const QUICK_ACTIONS = [
  { icon: ArrowUpRight, label: "Nạp tiền" },
  { icon: Send, label: "Chuyển tiền" },
  { icon: CreditCard, label: "Thanh toán" },
  { icon: ArrowDownLeft, label: "Sản phẩm" },
]

/* ── Khám phá items per phase ── */
interface DiscoverItem {
  icon: React.ElementType
  label: string
  sub: string
}

const DISCOVER_Q2: DiscoverItem[] = [
  { icon: Shield, label: "Bảo hiểm xe máy", sub: "Từ 66.000 đ/năm" },
  { icon: Receipt, label: "Thanh toán hoá đơn", sub: "Điện, nước, internet" },
  { icon: Film, label: "Mua vé xem phim", sub: "CGV, Lotte, Galaxy" },
  { icon: Train, label: "Mua vé tàu", sub: "Đặt vé nhanh" },
]

const DISCOVER_Q3: DiscoverItem[] = [
  { icon: BarChart3, label: "Chứng chỉ quỹ", sub: "Đầu tư từ 100K" },
  { icon: HomeIcon, label: "BĐS mã hoá", sub: "Từ 1.000.000 đ" },
  { icon: Stethoscope, label: "Bảo hiểm SK", sub: "Bảo vệ sức khoẻ" },
  { icon: Car, label: "XanhSM", sub: "Đặt xe, thanh toán" },
]

const DISCOVER_Q4: DiscoverItem[] = [
  { icon: Gift, label: "V-Point", sub: "Tích điểm khi chi tiêu" },
  { icon: Ticket, label: "Voucher", sub: "Ưu đãi Vincom, CGV" },
  { icon: HomeIcon, label: "BĐS mã hoá", sub: "Từ 1.000.000 đ" },
  { icon: Smartphone, label: "Thanh toán tự động", sub: "Set & forget" },
]

/* Promotions defined inline below */

function getDiscoverItems(state: string): { items: DiscoverItem[]; subtitle: string } {
  switch (state) {
    case "q3":
      return { items: DISCOVER_Q3, subtitle: "Mới ra mắt" }
    case "q4":
      return { items: DISCOVER_Q4, subtitle: "Dành cho bạn" }
    default:
      return { items: DISCOVER_Q2, subtitle: "Dịch vụ mới" }
  }
}

export default function HomeUpdated() {
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "default"
  const [balanceHidden, setBalanceHidden] = React.useState(false)

  const showReminder = state === "with-reminder" || state === "q3" || state === "q4"
  const phase = state === "q3" ? "q3" : state === "q4" ? "q4" : "q2"
  const { items: discoverItems, subtitle: discoverSub } = getDiscoverItems(phase)

  // Wallet card: show RWA + CCQ lines when q3/q4
  const hasProducts = state === "q3" || state === "q4"

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

      {/* Greeting + Bell */}
      <div className="px-[22px] py-[10px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-[36px] h-[36px] rounded-full bg-secondary flex items-center justify-center">
            <span className="text-[11px] font-bold">HK</span>
          </div>
          <span className="text-[15px] font-semibold">Xin chào Huy</span>
        </div>
        <button className="w-[36px] h-[36px] rounded-full bg-secondary flex items-center justify-center relative">
          <Bell size={16} />
          <div className="absolute -top-0.5 -right-0.5 w-[16px] h-[16px] rounded-full bg-destructive text-[9px] font-bold text-white flex items-center justify-center">
            9+
          </div>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-[80px]">

        {/* ═══ ① VÍ & ACTIONS ═══ */}
        <div className="px-[22px] pt-[4px]">
          {/* Sinh lời CTA banner (nếu chưa kích hoạt) */}
          {!hasProducts && (
            <div className="flex items-center justify-between bg-secondary rounded-t-[20px] px-[16px] py-[10px] mb-[-4px]">
              <div>
                <span className="text-[13px] font-semibold">Nhận thêm lợi suất </span>
                <span className="text-[13px] font-bold text-success">5.6% / năm</span>
              </div>
              <button className="text-[12px] font-bold px-[14px] py-[6px] bg-foreground text-background rounded-full">
                Kích hoạt
              </button>
            </div>
          )}

          {/* Wallet Card */}
          <div className={`bg-foreground text-background p-[20px] ${!hasProducts ? 'rounded-b-[20px]' : 'rounded-[20px]'}`}>
            <div className="flex items-center gap-1 mb-[2px]">
              <span className="text-[12px] opacity-50">Số dư ví V-Smart Pay</span>
              <button onClick={() => setBalanceHidden(!balanceHidden)} className="opacity-50">
                {balanceHidden ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <div className="text-[24px] font-bold tracking-[-0.5px]">
              {balanceHidden ? "**********" : "120.000.000"} đ
            </div>

            {/* Sinh lời status (khi đã kích hoạt) */}
            {hasProducts && !balanceHidden && (
              <div className="mt-[8px] pt-[8px] border-t border-white/15 flex flex-col gap-[3px]">
                <div className="flex justify-between text-[12px]">
                  <span className="opacity-50">Sinh lời</span>
                  <span>5.000.000 đ <span className="opacity-50">+12.500 đ hôm nay</span></span>
                </div>
                {state === "q4" && (
                  <>
                    <div className="flex justify-between text-[12px]">
                      <span className="opacity-50">BĐS mã hoá</span>
                      <span>20.000.000 đ <span className="text-success text-[11px]">+1.2%</span></span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="opacity-50">CCQ</span>
                      <span>10.000.000 đ <span className="text-destructive text-[11px]">-0.3%</span></span>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Pagination dots placeholder */}
            <div className="flex justify-center gap-[4px] mt-[12px]">
              <div className="w-[6px] h-[6px] rounded-full bg-white" />
              <div className="w-[6px] h-[6px] rounded-full bg-white/30" />
              <div className="w-[6px] h-[6px] rounded-full bg-white/30" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-[22px] pt-[14px]">
          <div className="flex gap-[10px]">
            {QUICK_ACTIONS.map((a) => (
              <button
                key={a.label}
                className="flex-1 flex flex-col items-center gap-[6px] py-[12px] bg-secondary rounded-14"
              >
                <div className="w-[36px] h-[36px] rounded-full bg-background flex items-center justify-center">
                  <a.icon size={16} />
                </div>
                <span className="text-[11px] font-medium">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ═══ ② REMINDER ═══ */}
        {showReminder && (
          <div className="px-[22px] pt-[20px]">
            <div className="flex items-center gap-3 bg-secondary rounded-14 p-[14px]">
              <div className="w-[40px] h-[40px] rounded-14 bg-background flex items-center justify-center shrink-0">
                <Receipt size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-foreground-secondary">
                  Sắp đến hạn
                </div>
                <div className="text-[13px] font-semibold truncate">
                  EVN Hà Nội · 380.000 đ
                </div>
                <div className="text-[11px] text-foreground-secondary">Hạn 20/04/2026</div>
              </div>
              <button className="text-[12px] font-bold px-[14px] py-[8px] bg-foreground text-background rounded-full shrink-0">
                Trả
              </button>
            </div>
          </div>
        )}

        {/* ═══ ③ KHÁM PHÁ DỊCH VỤ ═══ */}
        <div className="px-[22px] pt-[24px]">
          <div className="flex items-center justify-between mb-[14px]">
            <div>
              <span className="text-[17px] font-bold">Khám phá</span>
              <span className="text-[13px] text-foreground-secondary ml-[8px]">{discoverSub}</span>
            </div>
            <button className="text-[13px] font-semibold text-foreground-secondary flex items-center">
              Tất cả <ChevronRight size={14} />
            </button>
          </div>

          {/* Container xám + card trắng bên trong (kiểu OKX) */}
          <div className="bg-secondary rounded-[20px] p-[10px]">
            <div className="grid grid-cols-2 gap-[8px]">
              {discoverItems.map((item, i) => (
                <button
                  key={i}
                  className="flex items-center gap-[10px] bg-background rounded-14 p-[12px] text-left"
                >
                  <div className="w-[40px] h-[40px] rounded-14 bg-secondary flex items-center justify-center shrink-0">
                    <item.icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold truncate">{item.label}</div>
                    <div className="text-[11px] text-foreground-secondary truncate">{item.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ ④ PROMOTION / ƯU ĐÃI ═══ */}
        <div className="px-[22px] pt-[24px]">
          <div className="flex items-center justify-between mb-[14px]">
            <span className="text-[17px] font-bold">Ưu đãi</span>
            <button className="text-[13px] font-semibold text-foreground-secondary flex items-center">
              Xem thêm <ChevronRight size={14} />
            </button>
          </div>

          {/* Promo banner card */}
          <div className="bg-foreground text-background rounded-[20px] p-[18px] mb-[10px]">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-[11px] font-semibold opacity-50 uppercase tracking-wide mb-[4px]">
                  Ưu đãi đặc biệt
                </div>
                <div className="text-[15px] font-bold leading-tight mb-[6px]">
                  Giảm 20% tại Vincom
                </div>
                <div className="text-[12px] opacity-60 mb-[12px]">
                  Thanh toán bằng V-Smart Pay. HSD 30/04
                </div>
                <button className="text-[12px] font-bold px-[14px] py-[6px] bg-background text-foreground rounded-full">
                  Dùng ngay
                </button>
              </div>
              <div className="w-[64px] h-[64px] rounded-14 bg-white/10 flex items-center justify-center shrink-0 ml-[12px]">
                <Gift size={28} className="opacity-60" />
              </div>
            </div>
          </div>

          {/* Small promo chips */}
          <div className="flex gap-[8px] overflow-x-auto">
            {[
              { label: "CGV 1+1", sub: "Mua 1 tặng 1" },
              { label: "Grab -30K", sub: "Chuyến đi đầu" },
              { label: "VinFast", sub: "Free rửa xe" },
            ].map((promo, i) => (
              <button
                key={i}
                className="flex-shrink-0 bg-secondary rounded-14 px-[14px] py-[10px] text-left"
              >
                <div className="text-[12px] font-semibold">{promo.label}</div>
                <div className="text-[10px] text-foreground-secondary">{promo.sub}</div>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* ═══ ISLAND BAR (GlassBar) ═══ */}
      <div className="fixed bottom-[24px] left-1/2 -translate-x-1/2 z-50 h-[64px] bg-background/80 backdrop-blur-xl rounded-full shadow-lg flex items-center px-[20px]" style={{ width: 'calc(min(390px, 100%) - 44px)' }}>
        {[
          { label: "Trang chủ", value: "home", active: true },
          { label: "Dịch vụ", value: "services", active: false },
          { label: "QR", value: "qr", active: false, isCenter: true },
          { label: "Giao dịch", value: "history", active: false },
          { label: "Tài khoản", value: "account", active: false },
        ].map((tab) => (
          <button
            key={tab.value}
            className={`flex flex-col items-center justify-center gap-[2px] flex-1 min-w-[56px] ${
              tab.active ? "text-foreground" : "text-foreground-secondary"
            }`}
          >
            {tab.isCenter ? (
              <div className="w-[40px] h-[40px] rounded-14 bg-foreground flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-background">
                  <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  <rect x="15" y="15" width="2" height="2" fill="currentColor" />
                  <rect x="19" y="15" width="2" height="2" fill="currentColor" />
                  <rect x="15" y="19" width="2" height="2" fill="currentColor" />
                  <rect x="19" y="19" width="2" height="2" fill="currentColor" />
                </svg>
              </div>
            ) : (
              <span className="w-6 h-6 flex items-center justify-center">
                <div className={`w-[20px] h-[20px] rounded-full ${tab.active ? "bg-foreground" : "bg-foreground-secondary/30"}`} />
              </span>
            )}
            <span className="text-[10px] font-medium leading-3">{tab.label}</span>
            {tab.active && <span className="w-1 h-1 rounded-full bg-brand-secondary" />}
          </button>
        ))}
      </div>
    </div>
  )
}
