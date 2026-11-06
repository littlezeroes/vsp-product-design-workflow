"use client"

import * as React from "react"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  ArrowDownUp,
  Wallet,
  Receipt,
  Plane,
  Banknote,
  ShieldCheck,
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
  Tag,
  Check,
  Eye,
  Sparkles,
  TrendingUp,
  Gift,
  Building2,
  Briefcase,
  Coins,
  PiggyBank,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* VSP — Segment UI Gallery
 * Cùng IA, khác Hũ data theo persona.
 * 4 segments: Mass · Investment · Family/Vin · GenZ
 */

type HuAction = { icon: React.ElementType; label: string; primary?: boolean }
type Meta =
  | { kind: "text"; label: string; value: string }
  | { kind: "progress"; label: string; pct: number; value: string }
  | { kind: "avatars"; label: string; names: string[] }
  | { kind: "chart"; label: string; data: number[]; value: string; positive?: boolean }

type Hu = {
  id: string
  icon: React.ElementType
  name: string
  amount: number
  badge?: string
  isMain?: boolean
  meta?: Meta
  actions: HuAction[]
  pitch: { eyebrow: string; title: string; body: string }
}

const formatVND = (n: number) => n.toLocaleString("vi-VN")

/* ───────────── SEGMENT DATA ───────────── */

const SEG_MASS: Hu[] = [
  {
    id: "main",
    icon: Wallet,
    name: "Tài khoản chính",
    amount: 12_000_000,
    badge: "CHÍNH",
    isMain: true,
    actions: [
      { icon: ArrowDownUp, label: "Nạp / Rút", primary: true },
      { icon: ArrowLeftRight, label: "Chuyển" },
      { icon: QrCode, label: "QR" },
      { icon: Gift, label: "Ưu đãi" },
    ],
    pitch: {
      eyebrow: "AI Smart Split",
      title: "Chia lương theo thói quen",
      body: "AI đề xuất 70/20/10 từ chi tiêu 3 tháng.",
    },
  },
  {
    id: "bills",
    icon: Receipt,
    name: "Hóa đơn",
    amount: 850_000,
    meta: { kind: "text", label: "Bill kế tiếp", value: "120k · 30/05" },
    actions: [
      { icon: ArrowDownUp, label: "Thanh toán", primary: true },
      { icon: Plus, label: "Thêm bill" },
      { icon: Calendar, label: "Auto-pay" },
      { icon: Banknote, label: "Vay nhanh" },
    ],
    pitch: {
      eyebrow: "Thiếu trả bill?",
      title: "Vay 500k trả sau 1 tháng",
      body: "Duyệt 5 phút. Lãi 0% kỳ đầu.",
    },
  },
  {
    id: "emergency",
    icon: AlertCircle,
    name: "Khẩn cấp",
    amount: 3_500_000,
    meta: { kind: "text", label: "Đủ chi tiêu", value: "1.2 tháng" },
    actions: [
      { icon: ArrowDownUp, label: "Nạp / Rút", primary: true },
      { icon: ShieldCheck, label: "BH tai nạn" },
      { icon: Heart, label: "BH sức khỏe" },
      { icon: Calendar, label: "Tự nạp" },
    ],
    pitch: {
      eyebrow: "Tăng lưới an toàn",
      title: "BH tai nạn 50k/tháng",
      body: "Backup khi quỹ chưa đủ.",
    },
  },
  {
    id: "shopping",
    icon: ShoppingBag,
    name: "Mua sắm",
    amount: 1_850_000,
    meta: { kind: "progress", label: "Ngân sách tháng", pct: 62, value: "62%" },
    actions: [
      { icon: Tag, label: "Quẹt thẻ", primary: true },
      { icon: ArrowLeftRight, label: "Chia trả" },
      { icon: Wallet, label: "Cashback" },
      { icon: CreditCard, label: "BNPL" },
    ],
    pitch: {
      eyebrow: "Đang mua gì?",
      title: "Chia 3 kỳ 0% từ 1tr",
      body: "Áp dụng mọi merchant Vingroup.",
    },
  },
]

const SEG_INVEST: Hu[] = [
  {
    id: "main",
    icon: Wallet,
    name: "Tài khoản chính",
    amount: 320_000_000,
    badge: "CHÍNH",
    isMain: true,
    actions: [
      { icon: ArrowDownUp, label: "Nạp / Rút", primary: true },
      { icon: ArrowLeftRight, label: "Chuyển" },
      { icon: QrCode, label: "QR" },
      { icon: Briefcase, label: "Concierge" },
    ],
    pitch: {
      eyebrow: "Wealth Manager AI",
      title: "Phân bổ tài sản tối ưu",
      body: "AI rebalance hàng tháng theo profile rủi ro của bạn.",
    },
  },
  {
    id: "invest",
    icon: TrendingUp,
    name: "Đầu tư",
    amount: 450_000_000,
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
      eyebrow: "Tăng độ đa dạng",
      title: "BĐS mã hóa từ 100k",
      body: "Pháp lý rõ. Lãi 8-12%/năm.",
    },
  },
  {
    id: "rwa",
    icon: Building2,
    name: "BĐS mã hóa",
    amount: 180_000_000,
    meta: { kind: "text", label: "Cổ phần", value: "3 dự án Vinhomes" },
    actions: [
      { icon: Plus, label: "Mua thêm", primary: true },
      { icon: ArrowLeftRight, label: "Chuyển nhượng" },
      { icon: History, label: "Cổ tức" },
      { icon: Grid2x2, label: "Sổ đỏ" },
    ],
    pitch: {
      eyebrow: "Sắp launch",
      title: "Vinhomes Cần Giờ phase 2",
      body: "Pre-sale early bird -5%.",
    },
  },
  {
    id: "fund",
    icon: PiggyBank,
    name: "Quỹ mở",
    amount: 95_000_000,
    meta: {
      kind: "chart",
      label: "VESAF Equity",
      data: [10, 11, 10.5, 11.5, 12, 11.8, 13, 13.5, 14, 14.5, 15, 15.5, 16],
      value: "+8.7% YTD",
      positive: true,
    },
    actions: [
      { icon: Plus, label: "Mua thêm", primary: true },
      { icon: ArrowUpFromLine, label: "Bán" },
      { icon: History, label: "NAV" },
      { icon: Grid2x2, label: "So sánh" },
    ],
    pitch: {
      eyebrow: "Bán chéo quỹ",
      title: "Quỹ trái phiếu thu nhập cao",
      body: "Lãi 9.5%/năm. Risk thấp.",
    },
  },
  {
    id: "yield",
    icon: Coins,
    name: "Sinh lời cao",
    amount: 80_000_000,
    meta: { kind: "text", label: "Lãi tích lũy", value: "+42.5k hôm nay" },
    actions: [
      { icon: ArrowDownUp, label: "Nạp / Rút", primary: true },
      { icon: Calendar, label: "Kỳ hạn" },
      { icon: History, label: "Lịch sử" },
      { icon: TrendingUp, label: "So sánh" },
    ],
    pitch: {
      eyebrow: "Bậc cao",
      title: "Lãi 7.2%/năm cho ≥ 50tr",
      body: "Tier upgrade tự động khi tăng số dư.",
    },
  },
]

const SEG_FAMILY: Hu[] = [
  {
    id: "main",
    icon: Wallet,
    name: "Tài khoản chính",
    amount: 45_000_000,
    badge: "CHÍNH",
    isMain: true,
    actions: [
      { icon: ArrowDownUp, label: "Nạp / Rút", primary: true },
      { icon: ArrowLeftRight, label: "Chuyển" },
      { icon: QrCode, label: "QR" },
      { icon: Gift, label: "Ưu đãi Vin" },
    ],
    pitch: {
      eyebrow: "AI Smart Split",
      title: "Chia lương 2 vợ chồng",
      body: "Đề xuất phân bổ chung dựa trên bill gia đình.",
    },
  },
  {
    id: "family",
    icon: Heart,
    name: "Gia đình",
    amount: 28_500_000,
    badge: "NHÓM",
    meta: { kind: "avatars", label: "Thành viên", names: ["B", "M", "A", "E"] },
    actions: [
      { icon: ArrowDownToLine, label: "Nạp", primary: true },
      { icon: Send, label: "Gửi" },
      { icon: Users, label: "Members" },
      { icon: Banknote, label: "Vay nhóm" },
    ],
    pitch: {
      eyebrow: "Đám cưới em sắp tới",
      title: "Vay nhóm 50tr · 0.8%/tháng",
      body: "Vay đứng tên gia đình. 12 kỳ.",
    },
  },
  {
    id: "vinbills",
    icon: Receipt,
    name: "Hóa đơn",
    amount: 4_230_000,
    badge: "VIN",
    meta: { kind: "text", label: "Bill kế tiếp", value: "850k Vinhomes · 30/05" },
    actions: [
      { icon: ArrowDownUp, label: "Thanh toán", primary: true },
      { icon: Plus, label: "Thêm bill" },
      { icon: Calendar, label: "Auto-pay" },
      { icon: Banknote, label: "Vay nhanh" },
    ],
    pitch: {
      eyebrow: "Tiết kiệm Vin",
      title: "Gói combo bill 12 tháng -8%",
      body: "Trả trước bill Vinhomes + Vinschool.",
    },
  },
  {
    id: "school",
    icon: GraduationCap,
    name: "Học phí con",
    amount: 18_000_000,
    meta: { kind: "progress", label: "Học kỳ tới", pct: 45, value: "45% / 40tr" },
    actions: [
      { icon: ArrowDownUp, label: "Nạp / Rút", primary: true },
      { icon: Calendar, label: "Tự nạp" },
      { icon: Banknote, label: "Vay học phí" },
      { icon: Gift, label: "Học bổng" },
    ],
    pitch: {
      eyebrow: "Lãi suất giáo viên",
      title: "Vay học phí Vinschool 6%",
      body: "Trả góp 10 kỳ. Không hồ sơ phức tạp.",
    },
  },
  {
    id: "emergency",
    icon: AlertCircle,
    name: "Khẩn cấp",
    amount: 32_000_000,
    meta: { kind: "text", label: "Đủ chi tiêu", value: "4 tháng" },
    actions: [
      { icon: ArrowDownUp, label: "Nạp / Rút", primary: true },
      { icon: ShieldCheck, label: "BH tai nạn" },
      { icon: Heart, label: "BH gia đình" },
      { icon: Calendar, label: "Tự nạp" },
    ],
    pitch: {
      eyebrow: "Bảo vệ cả nhà",
      title: "BH sức khỏe 4 người",
      body: "Bundle gia đình -35% so với cá nhân.",
    },
  },
]

const SEG_GENZ: Hu[] = [
  {
    id: "main",
    icon: Wallet,
    name: "Tài khoản chính",
    amount: 2_800_000,
    badge: "CHÍNH",
    isMain: true,
    actions: [
      { icon: ArrowDownUp, label: "Nạp / Rút", primary: true },
      { icon: QrCode, label: "QR" },
      { icon: Gift, label: "Lì xì" },
      { icon: Tag, label: "Voucher" },
    ],
    pitch: {
      eyebrow: "AI Habit",
      title: "Bạn tiêu cafe 1.2tr/tháng",
      body: "Suggest đặt giới hạn 800k để dư 400k tự save.",
    },
  },
  {
    id: "split",
    icon: Users,
    name: "Quỹ bạn bè",
    amount: 1_200_000,
    badge: "NHÓM",
    meta: { kind: "avatars", label: "Đang nợ", names: ["L", "T", "K"] },
    actions: [
      { icon: ArrowLeftRight, label: "Chia tiền", primary: true },
      { icon: Send, label: "Đòi nợ" },
      { icon: Plus, label: "Thêm bill" },
      { icon: History, label: "Lịch sử" },
    ],
    pitch: {
      eyebrow: "Social",
      title: "Đòi nợ tự động qua chat",
      body: "Gửi link thanh toán. Nhắc nhẹ nhàng mỗi 3 ngày.",
    },
  },
  {
    id: "shopping",
    icon: ShoppingBag,
    name: "Mua sắm",
    amount: 480_000,
    meta: { kind: "progress", label: "Ngân sách tháng", pct: 88, value: "88% — cẩn thận!" },
    actions: [
      { icon: CreditCard, label: "BNPL 0%", primary: true },
      { icon: Tag, label: "Voucher" },
      { icon: Wallet, label: "Cashback" },
      { icon: ArrowLeftRight, label: "Chia trả" },
    ],
    pitch: {
      eyebrow: "Sắp hết budget",
      title: "Chia trả 4 kỳ · iPhone 17",
      body: "0% lãi · không hồ sơ · duyệt 3 phút.",
    },
  },
  {
    id: "save",
    icon: Heart,
    name: "Mục tiêu",
    amount: 850_000,
    meta: { kind: "progress", label: "Trip Đà Lạt", pct: 17, value: "17% / 5tr" },
    actions: [
      { icon: ArrowDownToLine, label: "Nạp", primary: true },
      { icon: Calendar, label: "Tự nạp 100k/tuần" },
      { icon: Users, label: "Mời bạn góp" },
      { icon: Plane, label: "Đặt vé" },
    ],
    pitch: {
      eyebrow: "Round-up",
      title: "Lẻ thừa tự bỏ vào Đà Lạt",
      body: "Mỗi giao dịch round lên 5k.",
    },
  },
]

const SEGMENTS = [
  {
    key: "mass",
    name: "Mass",
    persona: "Văn phòng · 23-35 · Lương 12-25tr",
    note: "Daily payment + Hóa đơn + Quỹ khẩn cấp",
    hus: SEG_MASS,
  },
  {
    key: "investment",
    name: "Investment",
    persona: "HNW · 35+ · Tài sản 1-10 tỉ",
    note: "Portfolio first · BĐS · Quỹ · Lãi tier cao",
    hus: SEG_INVEST,
  },
  {
    key: "family",
    name: "Family · Vin",
    persona: "Vợ chồng có con · Resident Vinhomes",
    note: "Quỹ gia đình · Bill Vin · Học phí con",
    hus: SEG_FAMILY,
  },
  {
    key: "genz",
    name: "GenZ",
    persona: "Sinh viên / mới đi làm · 18-25",
    note: "Chia tiền bạn · BNPL · Mục tiêu nhỏ",
    hus: SEG_GENZ,
  },
] as const

/* ───────────── COMPACT PHONE ───────────── */

function CompactHuCard({
  hu,
  active,
  onSelect,
}: {
  hu: Hu
  active: boolean
  onSelect: () => void
}) {
  const Icon = hu.icon
  return (
    <button
      onClick={onSelect}
      className={cn(
        "shrink-0 w-[120px] h-[150px] rounded-[14px] p-[10px] flex flex-col items-start text-left transition-all relative",
        active
          ? "bg-foreground text-background"
          : "bg-background text-foreground border border-border"
      )}
    >
      {active && (
        <div className="absolute top-[8px] right-[8px] w-[14px] h-[14px] rounded-full bg-background flex items-center justify-center">
          <Check size={9} className="text-foreground" strokeWidth={3} />
        </div>
      )}

      <div className="flex items-center gap-[5px] w-full">
        <div
          className={cn(
            "w-[26px] h-[26px] rounded-[7px] flex items-center justify-center",
            active ? "bg-background/10" : "bg-secondary"
          )}
        >
          <Icon size={14} />
        </div>
        {hu.badge && (
          <span
            className={cn(
              "text-[6.5px] font-bold uppercase tracking-wider px-[4px] py-[1px] rounded-full border",
              active
                ? "border-background/30 bg-background/10"
                : "border-foreground bg-transparent"
            )}
          >
            {hu.badge}
          </span>
        )}
      </div>

      <p className="text-[9.5px] font-medium mt-[8px] opacity-70 line-clamp-1">{hu.name}</p>
      <p className="text-[12.5px] font-bold mt-[1px] leading-tight whitespace-nowrap">
        {formatVND(hu.amount)}
        <span className="text-[8px] font-medium opacity-60 ml-[2px]">đ</span>
      </p>

      {hu.meta && (
        <div
          className={cn(
            "mt-auto pt-[5px] border-t w-full",
            active ? "border-background/15" : "border-border"
          )}
        >
          <p className="text-[7px] font-medium uppercase tracking-wider opacity-60 leading-tight">
            {hu.meta.label}
          </p>
          {hu.meta.kind === "text" && (
            <p className="text-[9px] font-semibold mt-[1px] leading-tight line-clamp-1">
              {hu.meta.value}
            </p>
          )}
          {hu.meta.kind === "progress" && (
            <>
              <div
                className={cn(
                  "h-[3px] rounded-full mt-[2px] overflow-hidden",
                  active ? "bg-background/20" : "bg-secondary"
                )}
              >
                <div
                  className={cn("h-full rounded-full", active ? "bg-background" : "bg-foreground")}
                  style={{ width: `${hu.meta.pct}%` }}
                />
              </div>
              <p className="text-[8px] font-semibold mt-[1px] leading-tight">{hu.meta.value}</p>
            </>
          )}
          {hu.meta.kind === "chart" && (
            <>
              <svg
                width="100%"
                height="16"
                viewBox="0 0 100 16"
                preserveAspectRatio="none"
                className={cn(active ? "text-background" : "text-foreground")}
              >
                {(() => {
                  const data = hu.meta.data
                  const min = Math.min(...data)
                  const max = Math.max(...data)
                  const range = max - min || 1
                  const W = 100, H = 14, PAD = 1
                  const step = W / (data.length - 1)
                  const points = data
                    .map((v, i) => {
                      const x = i * step
                      const y = PAD + (1 - (v - min) / range) * (H - PAD * 2)
                      return `${x.toFixed(1)},${y.toFixed(1)}`
                    })
                    .join(" ")
                  return (
                    <polyline
                      points={points}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )
                })()}
              </svg>
              <p className="text-[8px] font-semibold leading-tight">
                {hu.meta.positive ? "↑ " : "↓ "}
                {hu.meta.value}
              </p>
            </>
          )}
          {hu.meta.kind === "avatars" && (
            <div className="flex items-center gap-[3px] mt-[2px]">
              <div className="flex -space-x-[3px]">
                {hu.meta.names.slice(0, 4).map((n, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-[13px] h-[13px] rounded-full ring-[1px] flex items-center justify-center",
                      active
                        ? "bg-background text-foreground ring-foreground"
                        : "bg-foreground text-background ring-background"
                    )}
                  >
                    <span className="text-[6px] font-bold">{n}</span>
                  </div>
                ))}
              </div>
              <p className="text-[8.5px] font-semibold">{hu.meta.names.length}</p>
            </div>
          )}
        </div>
      )}
    </button>
  )
}

function SegmentPhone({ segment }: { segment: typeof SEGMENTS[number] }) {
  const [selectedId, setSelectedId] = React.useState(segment.hus[0].id)
  const selected = segment.hus.find((h) => h.id === selectedId)!

  return (
    <div className="shrink-0 w-[320px]">
      {/* Persona header */}
      <div className="mb-[12px]">
        <p className="text-[11px] font-bold uppercase tracking-wider text-foreground-secondary">
          {segment.persona}
        </p>
        <p className="text-[20px] font-bold leading-tight mt-[2px]">{segment.name}</p>
        <p className="text-[11px] leading-[14px] text-foreground-secondary mt-[2px]">
          {segment.note}
        </p>
      </div>

      {/* Phone frame */}
      <div className="rounded-[28px] overflow-hidden border-4 border-foreground bg-secondary">
        {/* Notch */}
        <div className="h-[24px] bg-foreground flex items-center justify-center">
          <div className="w-[64px] h-[14px] rounded-full bg-black/40" />
        </div>

        {/* Dark zone */}
        <div className="bg-foreground text-background px-[12px] pt-[12px] pb-[28px]">
          <div className="flex items-center gap-[6px] mb-[8px]">
            <div className="w-[20px] h-[20px] rounded-full bg-background/10 flex items-center justify-center">
              <CircleUser size={12} />
            </div>
            <p className="text-[11px] font-medium flex-1">Xin chào</p>
            <div className="w-[20px] h-[20px] rounded-full bg-background/10 flex items-center justify-center text-[8px] font-bold">
              H
            </div>
          </div>
          <div className="rounded-[10px] p-[10px] bg-background/5 border border-background/10 flex items-center gap-[8px]">
            <div className="flex-1 min-w-0">
              <p className="text-[8px] opacity-70">Sinh lời cùng V-Smart Pay</p>
              <p className="text-[11px] font-bold mt-[1px]">5.6%/năm</p>
            </div>
            <span className="h-[22px] px-[10px] rounded-full bg-foreground text-background text-[9px] font-bold inline-flex items-center ring-1 ring-background/10">
              Kích hoạt
            </span>
          </div>
        </div>

        {/* White sheet */}
        <div className="bg-secondary rounded-t-[20px] -mt-[20px] relative pb-[16px]">
          <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[28px] h-[3px] rounded-full bg-foreground/10" />

          <div className="px-[14px] pt-[20px] pb-[8px] flex items-center justify-between">
            <p className="text-[11px] font-bold">Hũ chi tiêu</p>
            <span className="text-[9px] font-medium text-foreground-secondary inline-flex items-center gap-[2px]">
              <Plus size={10} />
              Thêm
            </span>
          </div>

          <div className="overflow-x-auto no-scrollbar pb-[6px]">
            <div className="flex gap-[6px] px-[12px]">
              {segment.hus.map((hu) => (
                <CompactHuCard
                  key={hu.id}
                  hu={hu}
                  active={hu.id === selectedId}
                  onSelect={() => setSelectedId(hu.id)}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="px-[12px] pt-[10px]">
            <div className="rounded-[14px] bg-background p-[8px] grid grid-cols-4 gap-[2px]">
              {selected.actions.map((a, i) => {
                const Icon = a.icon
                return (
                  <div key={i} className="flex flex-col items-center gap-[4px] py-[6px]">
                    <div
                      className={cn(
                        "w-[30px] h-[30px] rounded-[9px] flex items-center justify-center",
                        a.primary ? "bg-foreground text-background" : "bg-secondary text-foreground"
                      )}
                    >
                      <Icon size={14} />
                    </div>
                    <span className="text-[8px] font-medium leading-tight text-center">
                      {a.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pitch */}
          <div className="px-[12px] pt-[8px]">
            <div className="rounded-[14px] bg-foreground text-background p-[10px] flex items-start gap-[8px]">
              <div className="w-[26px] h-[26px] rounded-[8px] bg-background/10 flex items-center justify-center shrink-0">
                <Sparkles size={13} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[8px] font-bold uppercase tracking-wider opacity-60">
                  {selected.pitch.eyebrow}
                </p>
                <p className="text-[10px] font-bold leading-[13px] mt-[1px]">
                  {selected.pitch.title}
                </p>
                <p className="text-[8.5px] leading-[11px] opacity-60 mt-[2px] line-clamp-2">
                  {selected.pitch.body}
                </p>
              </div>
            </div>
          </div>

          {/* Tab bar */}
          <div className="mt-[12px] mx-[12px] bg-background border-t border-border rounded-b-[14px]">
            <div className="grid grid-cols-5 py-[6px]">
              {[HomeIcon, QrCode, Grid2x2, History, CircleUser].map((Ic, i) => (
                <div key={i} className="flex justify-center">
                  <Ic size={14} className={i === 0 ? "text-foreground" : "text-foreground-secondary"} />
                </div>
              ))}
            </div>
            <div className="pb-[6px] flex justify-center">
              <div className="w-[80px] h-[3px] rounded-full bg-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ───────────── GALLERY PAGE ───────────── */

function SegmentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-[40px] py-[40px]">
        <header className="mb-[32px]">
          <p className="text-[12px] font-bold uppercase tracking-wider text-foreground-secondary">
            VSP · Segment UI Gallery
          </p>
          <h1 className="text-[36px] font-bold text-foreground mt-[4px]">
            4 personas · 4 layout
          </h1>
          <p className="text-[15px] text-foreground-secondary mt-[6px] max-w-[680px]">
            Cùng IA · cùng design system · Hũ set khác nhau theo nhu cầu thực tế.
            Tap mỗi Hũ trong mỗi phone → quick actions + pitch đổi theo context.
          </p>
        </header>

        <div className="overflow-x-auto pb-[40px]">
          <div className="flex gap-[28px] min-w-max">
            {SEGMENTS.map((seg) => (
              <SegmentPhone key={seg.key} segment={seg} />
            ))}
          </div>
        </div>

        <footer className="mt-[24px] pt-[20px] border-t border-border">
          <div className="grid grid-cols-4 gap-[20px]">
            {SEGMENTS.map((seg) => (
              <div key={seg.key} className="text-[12px]">
                <p className="font-bold text-foreground">{seg.name}</p>
                <p className="text-foreground-secondary mt-[4px] leading-[16px]">
                  {seg.hus.length} Hũ · {seg.hus[0].isMain ? "TK chính + " : ""}
                  {seg.hus
                    .filter((h) => !h.isMain)
                    .map((h) => h.name)
                    .join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </footer>
      </div>
    </div>
  )
}

export default SegmentsPage
