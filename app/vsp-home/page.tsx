"use client"

import * as React from "react"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  Wallet,
  Receipt,
  Plane,
  Banknote,
  ShieldCheck,
  Sparkles,
  Home as HomeIcon,
  QrCode,
  History,
  CircleUser,
  Grid2x2,
  Plus,
  AlertCircle,
  Heart,
  ShoppingBag,
  Users,
  GraduationCap,
  ChevronRight,
  CreditCard,
  Send,
  Calendar,
  Car,
  Zap,
  Tag,
  Check,
  Eye,
  EyeOff,
  ArrowDownUp,
  Gift,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* VSP Home — Hũ-centric · Monochrome
 * Default selected: Hũ chính (main wallet)
 * Selected state: inverted black background
 * Inactive: white + border
 */

type HuAction = { icon: React.ElementType; label: string; primary?: boolean }
type CreditPitch = { eyebrow: string; title: string; body: string; cta: string }

type Meta =
  | { kind: "text"; label: string; value: string }
  | { kind: "progress"; label: string; pct: number; value: string }
  | { kind: "avatars"; label: string; names: string[] }
  | { kind: "chart"; label: string; data: number[]; value: string; positive?: boolean }

type HuGroup = "today" | "pay" | "travel" | "share" | "grow"

type Hu = {
  id: string
  icon: React.ElementType
  name: string
  amount: number
  goal?: number
  /** Group nhu cầu mà Hũ này phục vụ */
  group: HuGroup
  /** 1 visual có mục đích, đặc trưng cho loại Hũ này */
  meta?: Meta
  vinExclusive?: boolean
  isMain?: boolean
  actions: HuAction[]
  pitch: CreditPitch
}

const GROUPS: { id: HuGroup | "all"; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "today", label: "Hôm nay" },
  { id: "pay", label: "Phải trả" },
  { id: "travel", label: "Đi lại" },
  { id: "share", label: "Chung" },
  { id: "grow", label: "Sinh lời" },
]

const formatVND = (n: number) => n.toLocaleString("vi-VN")

const HUS: Hu[] = [
  {
    id: "main",
    icon: Wallet,
    name: "Tài khoản chính",
    amount: 120_000_000,
    isMain: true,
    group: "today",
    actions: [
      { icon: ArrowDownUp, label: "Nạp / Rút", primary: true },
      { icon: ArrowLeftRight, label: "Chuyển" },
      { icon: QrCode, label: "QR" },
      { icon: Gift, label: "Ưu đãi" },
    ],
    pitch: {
      eyebrow: "Tôi đang giúp bạn",
      title: "Chia lương cho từng việc",
      body: "Tôi xem cách bạn tiêu 3 tháng — tháng này nên để 62% tiêu, 25% sinh lời, 13% phòng thân. Tự đổi khi bạn tiêu khác.",
      cta: "Xem đề xuất",
    },
  },
  {
    id: "bills",
    icon: Receipt,
    name: "Hóa đơn",
    amount: 4_230_000,
    vinExclusive: true,
    group: "pay",
    meta: { kind: "text", label: "Bill kế tiếp", value: "850k · 30/05" },
    actions: [
      { icon: Zap, label: "Thanh toán", primary: true },
      { icon: Plus, label: "Thêm bill" },
      { icon: Calendar, label: "Auto-pay" },
      { icon: Banknote, label: "Vay nhanh" },
    ],
    pitch: {
      eyebrow: "Thiếu tiền trả bill?",
      title: "Mượn nhanh 500k · trả sau 1 tháng",
      body: "Không cần giấy tờ. 5 phút có tiền. Tháng đầu không tính lãi.",
      cta: "Mượn ngay",
    },
  },
  {
    id: "emergency",
    icon: AlertCircle,
    name: "Khẩn cấp",
    amount: 12_500_000,
    goal: 15_000_000,
    group: "pay",
    meta: { kind: "text", label: "Đủ chi tiêu", value: "3 tháng" },
    actions: [
      { icon: ArrowDownUp, label: "Nạp / Rút", primary: true },
      { icon: ShieldCheck, label: "BH tai nạn" },
      { icon: Heart, label: "BH sức khỏe" },
      { icon: Calendar, label: "Tự nạp" },
    ],
    pitch: {
      eyebrow: "Phòng thêm cho bạn",
      title: "Bảo hiểm tai nạn chỉ 50k/tháng",
      body: "Khi Hũ này chưa đủ, có bảo hiểm trả thay nếu xảy ra việc.",
      cta: "Tìm hiểu",
    },
  },
  {
    id: "dalat",
    icon: Plane,
    name: "Đà Lạt",
    amount: 4_230_000,
    goal: 10_000_000,
    group: "travel",
    meta: { kind: "text", label: "Tới mục tiêu", value: "32 ngày" },
    actions: [
      { icon: Plane, label: "Đặt vé", primary: true },
      { icon: ShieldCheck, label: "BH du lịch" },
      { icon: Banknote, label: "Vay du lịch" },
      { icon: Users, label: "Mời góp" },
    ],
    pitch: {
      eyebrow: "Sắp đi chưa?",
      title: "Mượn thêm + bảo hiểm du lịch · giảm 30%",
      body: "Mượn 5 tr · trả 12 lần. Tặng kèm bảo hiểm 10 ngày.",
      cta: "Xem combo",
    },
  },
  {
    id: "family",
    icon: Heart,
    name: "Gia đình",
    amount: 28_500_000,
    group: "share",
    meta: { kind: "avatars", label: "Thành viên", names: ["B", "M", "A", "E"] },
    actions: [
      { icon: ArrowDownToLine, label: "Nạp", primary: true },
      { icon: Send, label: "Gửi" },
      { icon: Users, label: "Members" },
      { icon: Banknote, label: "Vay nhóm" },
    ],
    pitch: {
      eyebrow: "Cả nhà cùng để dành",
      title: "Mượn ngắn hạn cho đám cưới em",
      body: "Cả nhà đứng tên. Lãi nhẹ 0.8%/tháng. Trả 12 lần.",
      cta: "Đăng ký",
    },
  },
  {
    id: "invest",
    icon: TrendingUp,
    name: "Đầu tư",
    amount: 45_000_000,
    group: "grow",
    meta: {
      kind: "chart",
      label: "Hiệu suất 30 ngày",
      data: [12, 14, 13, 15, 17, 16, 18, 19, 21, 20, 23, 25, 26],
      value: "+12.3%",
      positive: true,
    },
    actions: [
      { icon: Plus, label: "Mua thêm", primary: true },
      { icon: Grid2x2, label: "Phân bổ" },
      { icon: History, label: "Lịch sử" },
      { icon: TrendingUp, label: "Lãi gộp" },
    ],
    pitch: {
      eyebrow: "Cho tiền nhàn rỗi",
      title: "Mua một phần nhỏ bất động sản · từ 100k",
      body: "Pháp lý rõ ràng. Mỗi năm sinh lời 8-12%. Bán lại được khi cần.",
      cta: "Tìm hiểu",
    },
  },
  {
    id: "shopping",
    icon: ShoppingBag,
    name: "Mua sắm",
    amount: 1_850_000,
    group: "today",
    meta: { kind: "progress", label: "Ngân sách tháng", pct: 62, value: "62%" },
    actions: [
      { icon: Tag, label: "Quẹt thẻ", primary: true },
      { icon: ArrowLeftRight, label: "Chia trả" },
      { icon: Wallet, label: "Cashback" },
      { icon: CreditCard, label: "BNPL 0%" },
    ],
    pitch: {
      eyebrow: "Đang định mua gì?",
      title: "Chia 3 lần trả · không lãi · từ 1 tr",
      body: "Mua ở đâu thuộc Vingroup đều được.",
      cta: "Bật chia trả",
    },
  },
]

const SERVICES = [
  { icon: Receipt, title: "Hóa đơn", sub: "Điện, nước, internet" },
  { icon: Plane, title: "Du lịch", sub: "Vé máy bay, tàu" },
  { icon: Car, title: "Đi lại", sub: "GreenSM, Vinfast" },
  { icon: Banknote, title: "Vay", sub: "Cá nhân, ứng lương" },
  { icon: ShieldCheck, title: "Bảo hiểm", sub: "Xe, sức khỏe" },
  { icon: GraduationCap, title: "Học phí", sub: "Vinschool" },
]

function StatusBar() {
  return (
    <div className="h-[44px] w-full flex items-center px-6 text-foreground">
      <span className="text-[14px] font-semibold leading-none flex-1">9:41</span>
      <div className="flex items-center gap-[6px]">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="0.5" />
          <rect x="4" y="5" width="3" height="7" rx="0.5" />
          <rect x="8" y="2" width="3" height="10" rx="0.5" />
          <rect x="12" y="0" width="3" height="12" rx="0.5" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 9.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="currentColor" />
          <path d="M4.5 7.5a5 5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M2 5a8 8 0 0 1 12 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <div className="flex items-center gap-[1px]">
          <div className="w-[22px] h-[10px] rounded-[3px] border border-current flex items-center p-[1px]">
            <div className="flex-1 h-full bg-current rounded-[1.5px]" />
          </div>
        </div>
      </div>
    </div>
  )
}

function HuCard({
  hu,
  active,
  hidden,
  onSelect,
  onToggleHide,
}: {
  hu: Hu
  active: boolean
  hidden?: boolean
  onSelect: () => void
  onToggleHide?: (e: React.MouseEvent) => void
}) {
  const Icon = hu.icon

  return (
    <button
      onClick={onSelect}
      className={cn(
        "shrink-0 w-[160px] h-[200px] rounded-[20px] p-[16px] flex flex-col items-start text-left transition-all relative",
        active
          ? "bg-foreground text-background"
          : "bg-background text-foreground border border-border"
      )}
    >
      {/* Selected check badge top-right */}
      {active && (
        <div className="absolute top-[12px] right-[12px] w-[20px] h-[20px] rounded-full bg-background flex items-center justify-center">
          <Check size={12} className="text-foreground" strokeWidth={3} />
        </div>
      )}

      {/* Top: icon + labels */}
      <div className="flex items-center gap-[8px] w-full">
        <div
          className={cn(
            "w-[36px] h-[36px] rounded-[10px] flex items-center justify-center",
            active ? "bg-background/10" : "bg-secondary"
          )}
        >
          <Icon size={18} />
        </div>
        {hu.isMain && (
          <span
            className={cn(
              "text-[8px] font-bold uppercase tracking-wider px-[6px] py-[2px] rounded-full",
              active
                ? "bg-background text-foreground"
                : "bg-foreground text-background"
            )}
          >
            Chính
          </span>
        )}
        {hu.vinExclusive && (
          <span
            className={cn(
              "text-[8px] font-bold uppercase tracking-wider px-[6px] py-[2px] rounded-full border",
              active ? "border-background/40 text-background" : "border-foreground text-foreground"
            )}
          >
            VIN
          </span>
        )}
      </div>

      <div className="flex items-center gap-[6px] mt-[14px]">
        <p className="text-[12px] font-medium opacity-70 line-clamp-1">
          {hu.name}
        </p>
        {hu.isMain && onToggleHide && (
          <button
            onClick={onToggleHide}
            className="opacity-60 hover:opacity-100 active:opacity-80 -m-[2px] p-[2px]"
            aria-label={hidden ? "Hiện số dư" : "Ẩn số dư"}
          >
            {hidden ? <EyeOff size={12} /> : <Eye size={12} />}
          </button>
        )}
      </div>

      <p className="text-[18px] font-bold mt-[2px] leading-tight whitespace-nowrap">
        {hidden ? "••••••" : formatVND(hu.amount)}
        {!hidden && (
          <span className="text-[11px] font-medium opacity-60 ml-[3px]">đ</span>
        )}
      </p>

      {/* Meta — visual có mục đích per Hũ type */}
      {hu.meta && (
        <div className={cn(
          "mt-auto pt-[8px] border-t",
          active ? "border-background/15" : "border-border"
        )}>
          <p className="text-[9px] font-medium uppercase tracking-wider opacity-60 leading-tight">
            {hu.meta.label}
          </p>
          {hu.meta.kind === "text" && (
            <p className="text-[12px] font-semibold mt-[2px] leading-tight line-clamp-1">
              {hu.meta.value}
            </p>
          )}
          {hu.meta.kind === "progress" && (
            <div className="mt-[5px]">
              <div className={cn(
                "h-[5px] rounded-full overflow-hidden",
                active ? "bg-background/20" : "bg-secondary"
              )}>
                <div
                  className={cn("h-full rounded-full", active ? "bg-background" : "bg-foreground")}
                  style={{ width: `${hu.meta.pct}%` }}
                />
              </div>
              <p className="text-[10px] font-semibold mt-[3px] leading-tight">
                {hu.meta.value}
              </p>
            </div>
          )}
          {hu.meta.kind === "chart" && (
            <div className="mt-[5px]">
              <svg
                width="100%"
                height="24"
                viewBox="0 0 120 24"
                preserveAspectRatio="none"
                className={cn(active ? "text-background" : "text-foreground")}
              >
                {(() => {
                  const data = hu.meta.data
                  const min = Math.min(...data)
                  const max = Math.max(...data)
                  const range = max - min || 1
                  const W = 120, H = 22, PAD = 1
                  const step = W / (data.length - 1)
                  const points = data
                    .map((v, i) => {
                      const x = i * step
                      const y = PAD + (1 - (v - min) / range) * (H - PAD * 2)
                      return `${x.toFixed(1)},${y.toFixed(1)}`
                    })
                    .join(" ")
                  const lastIdx = data.length - 1
                  const lastX = lastIdx * step
                  const lastY = PAD + (1 - (data[lastIdx] - min) / range) * (H - PAD * 2)
                  return (
                    <>
                      <polyline
                        points={points}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx={lastX} cy={lastY} r="2" fill="currentColor" />
                    </>
                  )
                })()}
              </svg>
              <p className="text-[10px] font-semibold mt-[2px] leading-tight">
                {hu.meta.positive ? "↑ " : "↓ "}{hu.meta.value}
              </p>
            </div>
          )}
          {hu.meta.kind === "avatars" && (
            <div className="flex items-center gap-[6px] mt-[3px]">
              <div className="flex -space-x-[5px]">
                {hu.meta.names.slice(0, 4).map((n, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-[18px] h-[18px] rounded-full ring-[1.5px] flex items-center justify-center",
                      active
                        ? "bg-background text-foreground ring-foreground"
                        : "bg-foreground text-background ring-background"
                    )}
                  >
                    <span className="text-[8px] font-bold">{n}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] font-semibold leading-tight">
                {hu.meta.names.length} người
              </p>
            </div>
          )}
        </div>
      )}
    </button>
  )
}

function HomePage() {
  // Default: Hũ chính
  const [selectedId, setSelectedId] = React.useState(HUS[0].id)
  const [mainHidden, setMainHidden] = React.useState(false)
  const [activeGroup, setActiveGroup] = React.useState<HuGroup | "all">("all")
  const selected = HUS.find((h) => h.id === selectedId)!
  const filteredHus =
    activeGroup === "all" ? HUS : HUS.filter((h) => h.group === activeGroup)

  return (
    <div className="relative w-full max-w-[390px] mx-auto min-h-screen flex flex-col bg-foreground">
      {/* ═══════════════════ DARK TOP ZONE ═══════════════════ */}
      <div className="text-background relative overflow-hidden">
        <div className="absolute -top-[40px] -right-[60px] w-[200px] h-[200px] rounded-full bg-background/[0.04]" />
        <div className="absolute top-[60px] -left-[80px] w-[180px] h-[180px] rounded-full bg-background/[0.03]" />

        <div className="text-background">
          <StatusBar />
        </div>

        {/* Greeting */}
        <div className="relative px-[22px] h-[48px] flex items-center">
          <div className="w-[28px] h-[28px] rounded-full bg-background/10 flex items-center justify-center mr-[10px]">
            <CircleUser size={18} />
          </div>
          <p className="text-[15px] font-medium flex-1">Xin chào Huy</p>
          <div className="relative">
            <div className="w-[32px] h-[32px] rounded-full bg-background/10 ring-2 ring-background/20 flex items-center justify-center">
              <span className="text-[12px] font-bold">H</span>
            </div>
            <span className="absolute -top-[2px] -right-[2px] min-w-[16px] h-[16px] px-[3px] rounded-full bg-background text-foreground text-[9px] font-bold flex items-center justify-center">
              9+
            </span>
          </div>
        </div>

        {/* Sinh lời banner — minimal style + rise + flash */}
        <style jsx>{`
          @keyframes vspRise {
            0% { transform: translateY(10px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes vspFlash {
            0% { transform: translateX(-120%) skewX(-18deg); opacity: 0; }
            10% { opacity: 1; }
            55% { transform: translateX(240%) skewX(-18deg); opacity: 1; }
            56%, 100% { opacity: 0; }
          }
          @keyframes vspGlow {
            0%, 100% { box-shadow: 0 0 0 1px rgba(255,255,255,0.10); }
            50% { box-shadow: 0 0 0 1px rgba(255,255,255,0.25), 0 6px 28px rgba(255,255,255,0.08); }
          }
          .vsp-rise {
            animation:
              vspRise 0.55s cubic-bezier(0.22, 1, 0.36, 1) both,
              vspGlow 3.6s ease-in-out 0.6s infinite;
          }
          .vsp-flash {
            position: absolute;
            top: 0; bottom: 0; left: 0;
            width: 35%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255,255,255,0.28),
              rgba(255,255,255,0.45),
              rgba(255,255,255,0.28),
              transparent
            );
            animation: vspFlash 3.4s ease-in-out 1s infinite;
            pointer-events: none;
            mix-blend-mode: overlay;
          }
        `}</style>
        <div className="relative px-[16px] pt-[10px] pb-[44px]">
          <button className="vsp-rise w-full rounded-[16px] p-[14px] flex items-center gap-[12px] active:opacity-90 relative overflow-hidden bg-background/5 border border-background/10">
            <span className="vsp-flash" />
            <svg className="absolute right-0 bottom-0 opacity-30" width="160" height="50" viewBox="0 0 160 50" fill="none">
              <path d="M0 40 Q 40 35, 60 20 T 100 15 T 160 5" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <div className="relative flex-1 min-w-0">
              <p className="text-[13px] font-normal opacity-70">Sinh lời cùng V-Smart Pay</p>
              <p className="text-[16px] font-semibold mt-[2px] leading-tight">
                Nhận thêm 5.6%/năm
              </p>
            </div>
            <span className="relative h-[34px] px-[16px] rounded-full bg-foreground text-background text-[13px] font-semibold inline-flex items-center whitespace-nowrap ring-1 ring-background/10">
              Kích hoạt ngay
            </span>
          </button>
        </div>
      </div>

      {/* ═══════════════════ WHITE SHEET ═══════════════════ */}
      <div className="bg-secondary rounded-t-[28px] -mt-[28px] relative flex-1">
        {/* Sheet grabber visual hint */}
        <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[40px] h-[4px] rounded-full bg-foreground/10" />

      {/* Hũ row title */}
      <div className="px-[22px] pt-[24px] pb-[8px] flex items-center justify-between">
        <p className="text-[13px] font-bold text-foreground">Hũ chi tiêu</p>
        <button className="text-[12px] font-medium text-foreground-secondary inline-flex items-center gap-[2px]">
          <Plus size={14} />
          Thêm mới
        </button>
      </div>

      {/* Group chips — filter by nhu cầu */}
      <div className="overflow-x-auto no-scrollbar pb-[10px]">
        <div className="flex gap-[6px] px-[16px]">
          {GROUPS.map((g) => {
            const isActive = activeGroup === g.id
            const count =
              g.id === "all" ? HUS.length : HUS.filter((h) => h.group === g.id).length
            return (
              <button
                key={g.id}
                onClick={() => setActiveGroup(g.id)}
                className={cn(
                  "shrink-0 h-[30px] px-[14px] rounded-full text-[12px] font-semibold transition-all inline-flex items-center gap-[5px]",
                  isActive
                    ? "bg-foreground text-background"
                    : "bg-background border border-border text-foreground active:bg-secondary"
                )}
              >
                {g.label}
                <span
                  className={cn(
                    "text-[10px] font-bold rounded-full px-[5px] min-w-[16px] text-center",
                    isActive ? "bg-background/15" : "bg-secondary"
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Horizontal scroll Hũ cards — filtered */}
      <div className="overflow-x-auto no-scrollbar pb-[8px]">
        <div className="flex gap-[6px] px-[16px]">
          {filteredHus.map((hu) => (
            <HuCard
              key={hu.id}
              hu={hu}
              active={hu.id === selectedId}
              hidden={hu.isMain ? mainHidden : false}
              onSelect={() => setSelectedId(hu.id)}
              onToggleHide={
                hu.isMain
                  ? (e) => {
                      e.stopPropagation()
                      setMainHidden((v) => !v)
                    }
                  : undefined
              }
            />
          ))}
          {/* + Tạo Hũ */}
          <button className="shrink-0 w-[160px] h-[200px] rounded-[20px] border-2 border-dashed border-border bg-background flex flex-col items-center justify-center gap-[10px] active:bg-secondary">
            <div className="w-[44px] h-[44px] rounded-full bg-foreground flex items-center justify-center">
              <Plus size={22} className="text-background" />
            </div>
            <p className="text-[13px] font-semibold text-foreground">Tạo Hũ</p>
            <p className="text-[10px] text-foreground-secondary px-[12px] text-center leading-tight">
              Nhóm · Mục tiêu · Khẩn cấp
            </p>
          </button>
        </div>
      </div>

      {/* Dynamic quick actions */}
      <div className="px-[16px] pt-[12px]">
        <div className="rounded-[20px] bg-background p-[12px]">
          <div className="grid grid-cols-4 gap-[4px]">
            {selected.actions.map((a, i) => {
              const Icon = a.icon
              return (
                <button
                  key={i}
                  className="flex flex-col items-center gap-[6px] py-[8px] rounded-[12px] active:bg-secondary"
                >
                  <div
                    className={cn(
                      "w-[44px] h-[44px] rounded-[14px] flex items-center justify-center",
                      a.primary
                        ? "bg-foreground text-background"
                        : "bg-secondary text-foreground"
                    )}
                  >
                    <Icon size={20} />
                  </div>
                  <span className="text-[10.5px] font-medium text-foreground leading-tight text-center">
                    {a.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Credit pitch contextual — black card */}
      <div className="px-[16px] pt-[10px]">
        <button className="w-full rounded-[20px] bg-foreground text-background p-[16px] flex items-start gap-[12px] text-left active:opacity-90">
          <div className="w-[40px] h-[40px] rounded-[12px] flex items-center justify-center shrink-0 bg-background/10">
            <Sparkles size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">
              {selected.pitch.eyebrow}
            </p>
            <p className="text-[14px] font-bold leading-[18px] mt-[2px]">
              {selected.pitch.title}
            </p>
            <p className="text-[11px] leading-[15px] opacity-60 mt-[4px]">
              {selected.pitch.body}
            </p>
            <p className="text-[12px] font-bold mt-[8px] inline-flex items-center gap-[2px]">
              {selected.pitch.cta}
              <ChevronRight size={14} />
            </p>
          </div>
        </button>
      </div>

      {/* Service grid */}
      <div className="px-[22px] pt-[24px] pb-[12px]">
        <p className="text-[13px] font-bold text-foreground">Dịch vụ</p>
      </div>
      <div className="px-[16px]">
        <div className="grid grid-cols-3 gap-[8px]">
          {SERVICES.map((s) => {
            const Icon = s.icon
            return (
              <button
                key={s.title}
                className="rounded-[16px] bg-background p-[12px] flex flex-col items-start gap-[10px] active:bg-secondary"
              >
                <div className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center bg-secondary">
                  <Icon size={18} className="text-foreground" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-foreground leading-tight">
                    {s.title}
                  </p>
                  <p className="text-[10px] leading-[14px] text-foreground-secondary mt-[2px] line-clamp-1">
                    {s.sub}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Ưu đãi */}
      <div className="px-[22px] pt-[24px] pb-[12px] flex items-center justify-between">
        <div>
          <p className="text-[13px] font-bold text-foreground">Ưu đãi cho bạn</p>
          <p className="text-[10px] text-foreground-secondary mt-[1px]">
            Khớp với {selected.name}
          </p>
        </div>
        <button className="text-[12px] font-medium text-foreground-secondary inline-flex items-center gap-[2px]">
          Xem tất cả
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="overflow-x-auto no-scrollbar pb-[16px]">
        <div className="flex gap-[10px] px-[16px]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-[140px] shrink-0">
              <div className="aspect-square rounded-[14px] bg-background flex items-center justify-center border border-border">
                <Tag size={28} className="text-foreground-secondary" />
              </div>
              <p className="text-[11px] font-semibold text-foreground leading-[14px] mt-[8px] line-clamp-2">
                {i === 1
                  ? `Ưu đãi 10% ${selected.name.replace("Hũ ", "").replace("Quỹ ", "")}`
                  : i === 2
                    ? "Combo Vingroup -15%"
                    : "Cashback 5% hôm nay"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[88px] shrink-0" />
      </div>
      {/* end white sheet */}

      {/* Tab bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-background border-t border-border">
        <div className="grid grid-cols-5">
          {[
            { icon: HomeIcon, label: "Trang chủ", active: true },
            { icon: QrCode, label: "QR" },
            { icon: Grid2x2, label: "Dịch vụ" },
            { icon: History, label: "Lịch sử" },
            { icon: CircleUser, label: "Tài khoản" },
          ].map((t, i) => {
            const Icon = t.icon
            return (
              <button
                key={i}
                className={cn(
                  "py-[10px] flex flex-col items-center gap-[3px]",
                  t.active ? "text-foreground" : "text-foreground-secondary"
                )}
              >
                <Icon size={20} />
                <span className={cn("text-[10px] leading-tight", t.active ? "font-semibold" : "font-medium")}>
                  {t.label}
                </span>
              </button>
            )
          })}
        </div>
        <div className="pb-[8px] pt-[4px] flex justify-center">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </div>
    </div>
  )
}

export default HomePage
