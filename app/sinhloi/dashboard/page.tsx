"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft, ChevronRight, Eye, EyeOff, ArrowRight,
  CheckCircle, Calendar, Wallet, Clock, Info,
} from "lucide-react"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { Badge } from "@/components/ui/badge"
import { Divider } from "@/components/ui/divider"
import { InformMessage } from "@/components/ui/inform-message"
import { GlassBar } from "@/components/ui/glass-bar"

/* ── Mock data for wireframing ─────────────────────────────────── */
const MOCK_DATES = [
  { label: "01/04", active: false },
  { label: "02/04", active: false },
  { label: "03/04", active: true },
  { label: "04/04", active: false },
  { label: "05/04", active: false },
]

/* ── Date Streak Row ───────────────────────────────────────────── */
function DateStreak() {
  return (
    <div className="flex gap-[8px] overflow-x-auto no-scrollbar">
      {MOCK_DATES.map((d, i) => (
        <div
          key={i}
          className={`shrink-0 w-[63px] h-[72px] rounded-8 flex flex-col items-center justify-center gap-[6px] ${
            d.active
              ? "bg-background border-2 border-success"
              : "bg-border"
          }`}
        >
          <Calendar size={16} className={d.active ? "text-success" : "text-foreground-secondary"} />
          <span className={`text-[10px] leading-[12px] font-medium ${
            d.active ? "text-success" : "text-foreground-secondary"
          }`}>
            {d.label}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ── Main Dashboard Page ───────────────────────────────────────── */
export default function DashboardPage() {
  const router = useRouter()
  const [balanceHidden, setBalanceHidden] = React.useState(false)
  const [activeNav, setActiveNav] = React.useState("product")

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-secondary text-foreground flex flex-col">
      {/* ── Header: variant="default", title, back button ── */}
      <Header
        variant="default"
        title="Sinh lời tự động"
        showStatusBar={true}
        leading={
          <button
            type="button"
            onClick={() => router.back()}
            className="w-[44px] h-[44px] flex items-center justify-center rounded-full"
          >
            <ChevronLeft size={18} className="text-foreground" />
          </button>
        }
      />

      {/* ── Scrollable content area ── */}
      <div className="flex-1 overflow-y-auto pb-[100px]">

        {/* ── Green tinted background area ── */}
        <div className="bg-green-50 px-[22px] pt-[16px] pb-[20px]">

          {/* ── Balance Card (white, floating) ── */}
          <div className="bg-background rounded-[20px] shadow-sm p-[12px]">

            {/* Badge + Rate label row */}
            <div className="flex items-center justify-between mb-[12px]">
              <Badge variant="success" className="gap-[4px]">
                <CheckCircle size={12} />
                An toàn và đảm bảo
                <ChevronRight size={12} />
              </Badge>
              <span className="text-sm font-semibold text-success">
                Lên đến 5.75%/năm
              </span>
            </div>

            {/* Row: "Tổng số dư" + Eye toggle */}
            <div className="flex items-center gap-[8px] mb-[4px]">
              <span className="text-sm text-foreground-secondary">Tổng số dư</span>
              <button type="button" onClick={() => setBalanceHidden(!balanceHidden)} className="p-1">
                {balanceHidden
                  ? <EyeOff size={16} className="text-foreground-secondary" />
                  : <Eye size={16} className="text-foreground-secondary" />
                }
              </button>
            </div>

            {/* Balance amount */}
            <p className="text-[24px] font-semibold leading-[32px] text-foreground mb-[12px]">
              {balanceHidden ? "********" : "0 ₫"}
            </p>

            {/* Divider inside card */}
            <Divider />

            {/* ItemList: Tiền lời ước tính */}
            <div className="py-[4px]">
              <ItemList>
                <ItemListItem
                  label="Tiền lời ước tính"
                  sublabel="(01/04 - 03/04/2026)"
                  metadata={balanceHidden ? "****" : "0 ₫"}
                  className="py-[8px]"
                />
              </ItemList>
            </div>

            {/* Estimated date text */}
            <p className="text-sm font-normal leading-5 text-foreground-secondary mb-[12px]">
              Ngày nhận dự kiến không muộn hơn 10/05/2026
            </p>

            {/* Divider */}
            <Divider />

            {/* Sub-footer: Chi tiết tiền lời (bg-grey-50 area) */}
            <div className="mt-[12px] -mx-[12px] -mb-[12px] bg-grey-50 rounded-b-[20px] px-[12px]">
              <ItemList>
                <ItemListItem
                  label="Chi tiết tiền lời"
                  showChevron
                  className="py-[12px]"
                  onPress={() => router.push("/sinhloi/profit")}
                />
              </ItemList>
            </div>
          </div>
        </div>

        {/* ── Button: Nạp / Rút tiền (primary, full-width) ── */}
        <div className="px-[22px] pt-[16px]">
          <Button
            variant="primary"
            className="w-full"
            leftIcon={<ArrowRight size={18} />}
            onClick={() => router.push("/sinhloi/deposit-withdraw")}
          >
            Nạp / Rút tiền
          </Button>
        </div>

        {/* ── Product Info Card ── */}
        <div className="pt-[32px] px-[22px]">
          <div className="bg-grey-50 rounded-[20px] pt-[12px] px-[12px]">
            {/* Title */}
            <p className="text-md font-semibold leading-6 text-foreground mb-[4px]">
              Sinh lời tự động
            </p>
            {/* Subtitle */}
            <p className="text-sm font-normal leading-5 text-foreground-secondary mb-[12px]">
              Nhận tiền lời sinh lời lên đến 4.5%/năm
            </p>

            {/* Date streak row */}
            <div className="mb-[12px]">
              <DateStreak />
            </div>

            {/* Dashed divider */}
            <div className="border-t border-dashed border-border" />

            {/* Công thức tính tiền lời */}
            <ItemList>
              <ItemListItem
                label="Công thức tính tiền lời"
                showChevron
                onPress={() => {}}
                className="py-[12px]"
              />
            </ItemList>

            {/* Dashed divider */}
            <div className="border-t border-dashed border-border" />

            {/* Thời điểm trả */}
            <ItemList>
              <ItemListItem
                label="Thời điểm trả"
                showChevron
                onPress={() => {}}
                className="py-[12px]"
              />
            </ItemList>
          </div>
        </div>

        {/* ── InformMessage (disclaimer) ── */}
        <div className="pt-[32px] px-[22px]">
          <InformMessage
            hierarchy="secondary"
            body={
              <span className="text-xs leading-4">
                Tiền lời được tính trên số dư cuối ngày và trả vào tài khoản mỗi tháng.
                Lãi suất có thể thay đổi theo thỏa thuận với đối tác tài chính.
              </span>
            }
            className="border border-border rounded-14"
          />
          {/* Logo placeholder */}
          <div className="flex justify-center mt-[8px]">
            <div className="w-[104px] h-[14px] bg-border rounded-[4px]" />
          </div>
        </div>
      </div>

      {/* ── Bottom Nav Bar: GlassBar (3 items) ── */}
      <GlassBar
        items={[
          {
            icon: <Wallet size={24} />,
            label: "Sản phẩm",
            value: "product",
          },
          {
            icon: <Clock size={24} />,
            label: "Lịch sử",
            value: "history",
          },
          {
            icon: <Info size={24} />,
            label: "Thông tin",
            value: "info",
          },
        ]}
        activeItem={activeNav}
        onItemChange={(v) => {
          setActiveNav(v)
          if (v === "history") router.push("/sinhloi/history")
        }}
      />
    </div>
  )
}
