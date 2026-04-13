"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Eye, EyeOff, ArrowDownLeft, TrendingUp, ArrowUpRight, Settings, Calendar, Flame } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Section } from "@/components/ui/section"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { Tab } from "@/components/ui/tab"
import { Badge } from "@/components/ui/badge"
import { BottomSheet } from "@/components/ui/bottom-sheet"
import {
  MOCK_BALANCE, MOCK_ACCOUNT_BREAKDOWN, MOCK_DAILY_INTEREST, MOCK_PROFIT,
  SINHLOI_CONFIG, formatVND,
} from "../data"

/* ── Page ─────────────────────────────────────────────────────── */
export default function AccountDetailPage() {
  const router = useRouter()
  const [hidden, setHidden] = React.useState(false)
  const [showYear, setShowYear] = React.useState(false)
  const [selectedYearIdx, setSelectedYearIdx] = React.useState(0)

  const { balance } = MOCK_BALANCE
  const { totalDeposited, totalInterest, totalWithdrawn } = MOCK_ACCOUNT_BREAKDOWN
  const { interestRate } = SINHLOI_CONFIG

  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  // Profit data
  const years = MOCK_PROFIT.map((p) => p.year)
  const yearTabs = years.map((y) => ({ label: `${y}`, value: `${y}` }))
  const selectedYear = years[selectedYearIdx] ?? currentYear
  const yearData = MOCK_PROFIT.find((p) => p.year === selectedYear)

  // Streak
  const data = MOCK_DAILY_INTEREST
  const streakCount = data.filter((d) => d.amount > 0).length

  // Month grid for bottom sheet
  const months = Array.from({ length: 12 }, (_, i) => {
    const monthNum = i + 1
    const found = yearData?.months.find((m) => m.month === monthNum)
    return { month: monthNum, amount: found?.amount ?? 0, isEstimate: found?.isEstimate ?? false, hasData: !!found }
  })

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <Header
        variant="default"
        title="Chi tiết tài khoản"
        leading={
          <button
            type="button"
            onClick={() => router.back()}
            className="w-[44px] h-[44px] flex items-center justify-center rounded-full"
          >
            <ChevronLeft size={18} className="text-foreground" />
          </button>
        }
        trailing={
          <button
            type="button"
            onClick={() => router.push("/sinhloi/settings")}
            className="w-[44px] h-[44px] flex items-center justify-center rounded-full"
          >
            <Settings size={20} className="text-foreground" />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto pb-[40px]">
        {/* ── Balance card ────────────────────────────── */}
        <div className="pt-[16px] px-[22px]">
          <Section>
            <div className="flex flex-col items-center gap-1 py-[8px]">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                TỔNG SỐ DƯ
              </p>
              <div className="flex items-center gap-[8px]">
                <p className="text-[28px] font-bold leading-9 tabular-nums text-foreground">
                  {hidden ? "••••••••" : formatVND(balance)}
                </p>
                <button type="button" onClick={() => setHidden(!hidden)} className="p-1">
                  {hidden
                    ? <EyeOff size={18} className="text-foreground-secondary" />
                    : <Eye size={18} className="text-foreground-secondary" />
                  }
                </button>
              </div>
              <p className="text-xs text-foreground-secondary">
                Lãi suất {interestRate}%/năm
              </p>
            </div>
          </Section>
        </div>

        {/* ── Breakdown ───────────────────────────────── */}
        <div className="pt-[32px] px-[22px]">
          <Section title="PHÂN TÍCH">
            <ItemList>
              <ItemListItem
                prefix={
                  <div className="w-full h-full rounded-full flex items-center justify-center bg-info/10">
                    <ArrowDownLeft size={20} className="text-info" />
                  </div>
                }
                label="Đã nạp"
                metadata={hidden ? "••••" : `+${formatVND(totalDeposited)}`}
                divider
                onPress={() => router.push("/sinhloi/history?filter=deposit")}
                showChevron
              />
              <ItemListItem
                prefix={
                  <div className="w-full h-full rounded-full flex items-center justify-center bg-success/10">
                    <TrendingUp size={20} className="text-success" />
                  </div>
                }
                label="Lãi tích lũy"
                metadata={hidden ? "••••" : `+${formatVND(totalInterest)}`}
                divider
                onPress={() => router.push("/sinhloi/history?filter=interest")}
                showChevron
              />
              <ItemListItem
                prefix={
                  <div className="w-full h-full rounded-full flex items-center justify-center bg-danger/10">
                    <ArrowUpRight size={20} className="text-danger" />
                  </div>
                }
                label="Đã rút"
                metadata={hidden ? "••••" : `-${formatVND(totalWithdrawn)}`}
                onPress={() => router.push("/sinhloi/history?filter=withdrawal")}
                showChevron
              />
            </ItemList>
          </Section>
        </div>

        {/* ── Monthly profit ──────────────────────────── */}
        <div className="pt-[32px] px-[22px]">
          <Section title="LỢI NHUẬN THEO THÁNG">
            {/* Year tabs */}
            {yearTabs.length > 1 && (
              <div className="mb-[12px] -mx-[16px]">
                <Tab
                  tabs={yearTabs}
                  activeTab={`${selectedYear}`}
                  onTabChange={(v) => {
                    const idx = years.indexOf(Number(v))
                    if (idx >= 0) setSelectedYearIdx(idx)
                  }}
                />
              </div>
            )}

            {yearData ? (
              <ItemList>
                {yearData.months.map((month, idx) => (
                  <ItemListItem
                    key={month.month}
                    label={`Tháng ${month.month}`}
                    metadata={hidden ? "••••" : `+${formatVND(month.amount)}`}
                    suffix={
                      month.isEstimate
                        ? <Badge variant="warning">Ước tính</Badge>
                        : undefined
                    }
                    divider={idx < yearData.months.length - 1}
                  />
                ))}
              </ItemList>
            ) : (
              <p className="text-sm text-foreground-secondary text-center py-[16px]">
                Chưa có dữ liệu
              </p>
            )}

            {/* Year total */}
            {yearData && (
              <div className="pt-[12px] flex items-center justify-between">
                <p className="text-sm text-foreground-secondary">Tổng năm {selectedYear}</p>
                <p className="text-md font-bold tabular-nums text-success">
                  {hidden ? "••••" : `+${formatVND(yearData.total)}`}
                </p>
              </div>
            )}

            {/* View full history */}
            <button
              type="button"
              onClick={() => setShowYear(true)}
              className="w-full mt-[12px] text-center text-sm font-semibold text-success py-[8px]"
            >
              Xem tất cả tháng
            </button>
          </Section>
        </div>

        {/* ── Interest streak ─────────────────────────── */}
        <div className="pt-[32px] px-[22px]">
          <Section title="CHUỖI SINH LỜI">
            <ItemList>
              <ItemListItem
                prefix={
                  <div className="w-full h-full rounded-full flex items-center justify-center bg-warning/10">
                    <Flame size={20} className="text-warning" />
                  </div>
                }
                label={`${streakCount} ngày liên tiếp`}
                sublabel="Sinh lời mỗi ngày"
                metadata={hidden ? "••••" : `+${formatVND(data.reduce((s, d) => s + d.amount, 0))}`}
              />
            </ItemList>
          </Section>
        </div>

        <div className="h-[32px]" />
      </div>

      {/* Home indicator */}
      <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] bg-background pointer-events-none">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>

      {/* ── Year BottomSheet — Full month grid ────────── */}
      <BottomSheet open={showYear} onClose={() => setShowYear(false)}>
        <div className="pb-[16px]">
          <div className="flex items-center gap-[8px] mb-[16px]">
            <button type="button" onClick={() => setShowYear(false)} className="w-[44px] h-[44px] flex items-center justify-center">
              <ChevronLeft size={18} className="text-foreground" />
            </button>
            <p className="flex-1 text-center text-lg font-semibold text-foreground">Lịch sử sinh lời</p>
            <div className="w-[44px]" />
          </div>

          {/* Total */}
          <div className="text-center mb-[24px]">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
              NĂM {yearData?.year ?? currentYear}
            </p>
            <p className="text-[24px] font-bold tabular-nums text-foreground mt-[4px]">
              {hidden ? "••••" : `+${formatVND(yearData?.total ?? 0)}`}
            </p>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-3 gap-[8px]">
            {months.map((m) => {
              const isCurrent = m.month === currentMonth && selectedYear === currentYear
              return (
                <div
                  key={m.month}
                  className={`rounded-[16px] p-[14px] min-h-[72px] ${
                    isCurrent ? "bg-foreground text-background" : "bg-secondary text-foreground"
                  }`}
                >
                  <p className={`text-xs font-semibold ${isCurrent ? "opacity-60" : "text-foreground-secondary"}`}>
                    Tháng {m.month}
                  </p>
                  {m.hasData && !hidden && (
                    <p className={`text-sm font-bold tabular-nums mt-[4px] ${isCurrent ? "" : "text-foreground"}`}>
                      {m.isEstimate ? "~" : "+"}{formatVND(m.amount)}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}
