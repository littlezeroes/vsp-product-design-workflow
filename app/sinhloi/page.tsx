"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowRight,
  Info,
  Eye,
  EyeOff,
  Percent,
  FileText,
  Receipt,
  Power,
} from "lucide-react"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import {
  MOCK_BALANCE,
  MOCK_CHART_DATA,
  MOCK_TRANSACTIONS,
  SINHLOI_CONFIG,
  SINHLOI_LIMITS,
  formatVND,
  formatVNDSigned,
  type SinhLoiTransaction,
  type ChartDataPoint,
} from "./data"

/* ── Transaction icon by type ─────────────────────────────────────── */
function TxIcon({ type }: { type: SinhLoiTransaction["type"] }) {
  const cls = "size-[24px] text-foreground-secondary"
  switch (type) {
    case "interest":
      return <Percent className={cls} size={24} />
    case "deposit":
      return <Plus className={cls} size={24} />
    case "withdrawal":
      return <ArrowRight className={cls} size={24} />
  }
}

/* ── Bar Chart ────────────────────────────────────────────────────── */
function BarChart({ data, maxValue }: { data: ChartDataPoint[]; maxValue: number }) {
  const yLabels = [4, 3, 2, 1, 0]
  const chartH = 200 // px for the grid area

  return (
    <div className="px-[22px] pb-[16px]">
      <div className="flex gap-[8px]">
        {/* Y-Axis */}
        <div className="flex flex-col justify-between shrink-0 w-[20px]" style={{ height: chartH }}>
          {yLabels.map((v) => (
            <span key={v} className="text-[12px] font-medium leading-5 text-foreground text-right uppercase">
              {v === 0 ? "0" : `${v}k`}
            </span>
          ))}
        </div>

        {/* Grid + Bars */}
        <div className="flex-1 relative" style={{ height: chartH }}>
          {/* Grid lines */}
          {yLabels.map((v, i) => (
            <div
              key={v}
              className="absolute left-0 right-0 border-t border-border"
              style={{ top: `${(i / (yLabels.length - 1)) * 100}%` }}
            />
          ))}

          {/* Bars container — sits above grid */}
          <div className="absolute inset-x-0 bottom-[28px] top-0 flex items-end justify-between px-[8px]">
            {data.map((d) => {
              const pct = Math.min((d.value / maxValue) * 100, 100)
              return (
                <div key={d.label} className="flex flex-col items-center flex-1 h-full justify-end relative">
                  {/* Tooltip */}
                  {d.isHighlight && (
                    <div className="relative mb-[6px]">
                      <div className="bg-foreground text-background text-sm font-semibold leading-5 px-[8px] py-[6px] rounded-[8px] whitespace-nowrap relative z-10">
                        {(d.value / 1000).toFixed(1)}K
                      </div>
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-[-5px] w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-foreground" />
                    </div>
                  )}
                  {/* Bar */}
                  <div
                    className="w-[16px] rounded-t-[20px] bg-lime-500 shrink-0"
                    style={{
                      height: `${pct}%`,
                      opacity: d.isHighlight ? 1 : 0.5,
                    }}
                  />
                </div>
              )
            })}
          </div>

          {/* X labels */}
          <div className="absolute bottom-0 inset-x-0 flex justify-between px-[8px]">
            {data.map((d) => (
              <span
                key={d.label}
                className={`flex-1 text-[12px] font-medium leading-5 text-center uppercase whitespace-nowrap ${d.isDanger ? "text-destructive" : "text-foreground-secondary"}`}
              >
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Dashboard Page ───────────────────────────────────────────────── */
export default function SinhLoiDashboard() {
  const router = useRouter()
  const [hideBalance, setHideBalance] = React.useState(false)
  const [chartTab, setChartTab] = React.useState<"day" | "flow">("day")
  const [showInfo, setShowInfo] = React.useState(false)

  const bal = MOCK_BALANCE
  const cfg = SINHLOI_CONFIG

  return (
    <div className="min-h-screen bg-grey-100 dark:bg-grey-900 flex flex-col items-center">
      {/* Phone frame */}
      <div className="relative w-[390px] h-[844px] bg-background text-foreground flex flex-col rounded-[40px] shadow-xl overflow-hidden mt-[16px]">

        {/* Green gradient BG */}
        <div className="absolute inset-x-0 top-0 h-[280px] bg-gradient-to-b from-[#e5f4d9] to-background pointer-events-none" />
        {/* Decorative leaf vector */}
        <div className="absolute top-[20px] right-[-40px] w-[137px] h-[148px] opacity-20 mix-blend-overlay pointer-events-none">
          <svg viewBox="0 0 137 148" fill="none" className="w-full h-full">
            <path d="M20 148C20 60 80 10 137 0H0v148h20Z" fill="#84cc16" opacity="0.4" />
            <path d="M60 148C60 80 100 30 137 10V0C80 10 20 60 20 148h40Z" fill="#84cc16" opacity="0.3" />
          </svg>
        </div>

        {/* Header */}
        <Header
          variant="default"
          title="Sinh lời tự động"
          showStatusBar
          leading={
            <button
              type="button"
              onClick={() => router.back()}
              className="p-[10px] min-h-[44px] rounded-full flex items-center justify-center"
            >
              <ChevronLeft size={18} className="text-foreground" />
            </button>
          }
          className="relative z-10 bg-transparent"
        />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto relative z-10">
          <div className="flex flex-col items-center py-[24px] gap-[24px]">

            {/* ── Balance Card ── */}
            <div className="w-[346px] rounded-[18px] border border-white/80 shadow-[0px_4px_40px_0px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="backdrop-blur-[20px] bg-background/80">
                <div className="flex flex-col gap-[8px] py-[16px]">
                  {/* Balance row */}
                  <div className="flex items-start justify-between px-[16px]">
                    <div className="flex flex-col gap-[4px] pt-[2px]">
                      <p className="text-md leading-6 text-foreground">Số dư hiện tại</p>
                      <div className="flex items-center gap-[8px]">
                        <p className="text-[32px] font-semibold leading-10 tracking-[-1px] text-foreground">
                          {hideBalance ? "••••••••" : formatVND(bal.balance)}
                        </p>
                        <button type="button" onClick={() => setHideBalance(!hideBalance)} className="p-1">
                          {hideBalance ? (
                            <EyeOff size={24} className="text-foreground-secondary" />
                          ) : (
                            <Eye size={24} className="text-foreground-secondary" />
                          )}
                        </button>
                      </div>
                    </div>
                    {/* Interest rate badge */}
                    <div className="bg-lime-500 border border-lime-500 px-[8px] py-[4px] rounded-[6px]">
                      <span className="text-sm font-medium leading-5 text-white whitespace-nowrap">
                        {cfg.interestRate}%/năm
                      </span>
                    </div>
                  </div>

                  {/* Total interest row */}
                  <div className="flex items-center gap-[16px] px-[16px] py-[8px]">
                    <span className="text-md leading-6 text-foreground flex-1">Tổng tiền lời đã nhận</span>
                    <span className="text-md font-semibold leading-6 text-success">
                      {formatVNDSigned(bal.totalInterestEarned)}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-border" />

                {/* Action buttons */}
                <div className="flex items-start justify-center pt-[24px] pb-[16px]">
                  {/* Nạp tiền */}
                  <button type="button" onClick={() => router.push("/sinhloi/deposit")} className="flex-1 flex flex-col items-center gap-[8px]">
                    <div className="size-[52px] rounded-full bg-foreground flex items-center justify-center">
                      <Plus size={24} className="text-background" />
                    </div>
                    <span className="text-[10px] font-semibold leading-4 text-foreground-secondary text-center">
                      Nạp tiền
                    </span>
                  </button>
                  {/* Rút tiền */}
                  <button type="button" onClick={() => router.push("/sinhloi/deposit?tab=withdraw")} className="flex-1 flex flex-col items-center gap-[8px]">
                    <div className="size-[52px] rounded-full bg-secondary flex items-center justify-center">
                      <ArrowRight size={24} className="text-foreground" />
                    </div>
                    <span className="text-[10px] font-semibold leading-4 text-foreground-secondary text-center">
                      Rút tiền
                    </span>
                  </button>
                  {/* Thông tin */}
                  <button type="button" onClick={() => setShowInfo(true)} className="flex-1 flex flex-col items-center gap-[8px]">
                    <div className="size-[52px] rounded-full bg-secondary flex items-center justify-center">
                      <Info size={24} className="text-foreground" />
                    </div>
                    <span className="text-[10px] font-semibold leading-4 text-foreground-secondary text-center">
                      Thông tin
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* ── Chart Section ── */}
            <div className="w-full flex flex-col">
              {/* Section header */}
              <div className="flex items-center justify-between px-[22px] pb-[16px] pt-[24px]">
                <div className="flex flex-col gap-[4px]">
                  <p className="text-md font-semibold leading-6 text-foreground">Biểu đồ tiền lời</p>
                  <p className="text-sm leading-5">
                    <span className="font-medium text-foreground-secondary">Hôm nay </span>
                    <span className="text-success">{formatVNDSigned(bal.todayInterest)}</span>
                  </p>
                </div>
                {/* Segment control */}
                <div className="bg-secondary flex items-center p-[4px] rounded-[16px]">
                  <button
                    type="button"
                    onClick={() => setChartTab("day")}
                    className={`px-[12px] py-[8px] rounded-[12px] text-sm font-semibold leading-5 text-center whitespace-nowrap transition-all ${
                      chartTab === "day"
                        ? "bg-background shadow-[0px_6px_12px_-6px_rgba(0,0,0,0.12),0px_8px_24px_-4px_rgba(0,0,0,0.08)] text-foreground"
                        : "text-foreground-secondary"
                    }`}
                  >
                    Ngày
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartTab("flow")}
                    className={`px-[12px] py-[8px] rounded-[12px] text-sm font-semibold leading-5 text-center whitespace-nowrap transition-all ${
                      chartTab === "flow"
                        ? "bg-background shadow-[0px_6px_12px_-6px_rgba(0,0,0,0.12),0px_8px_24px_-4px_rgba(0,0,0,0.08)] text-foreground"
                        : "text-foreground-secondary"
                    }`}
                  >
                    Nạp/Rút
                  </button>
                </div>
              </div>

              {/* Chart */}
              <BarChart data={MOCK_CHART_DATA} maxValue={4000} />
            </div>

            {/* ── Recent Transactions ── */}
            <div className="w-full flex flex-col">
              <div className="flex items-center justify-between px-[22px] pb-[16px] pt-[24px]">
                <p className="text-md font-semibold leading-6 text-foreground">Giao dịch gần đây</p>
                <button type="button" onClick={() => router.push("/sinhloi/transactions")} className="text-sm font-semibold leading-5 text-info">
                  Xem tất cả
                </button>
              </div>

              <div className="flex flex-col">
                {MOCK_TRANSACTIONS.map((tx) => (
                  <div key={tx.id} className="flex items-center gap-[16px] px-[22px] py-[10px] h-[64px]">
                    {/* Icon */}
                    <div className="size-[44px] shrink-0 rounded-full bg-secondary flex items-center justify-center">
                      <TxIcon type={tx.type} />
                    </div>
                    {/* Title group */}
                    <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
                      <p className="text-sm font-medium leading-5 text-foreground truncate">{tx.label}</p>
                      <p className="text-sm leading-5 text-foreground-secondary truncate">{tx.date}</p>
                    </div>
                    {/* Amount */}
                    <div className="shrink-0 flex flex-col items-end gap-[4px]">
                      <p className="text-sm font-semibold leading-5 text-foreground">
                        {tx.amount < 0 ? formatVND(tx.amount) : `+${formatVND(tx.amount)}`}
                      </p>
                      <p className="text-sm leading-5 text-success">Thành công</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Management Section ── */}
            <div className="w-full flex flex-col">
              <div className="px-[22px] pb-[16px] pt-[24px]">
                <p className="text-md font-semibold leading-6 text-foreground">Quản lý</p>
              </div>

              <div className="flex flex-col gap-[12px]">
                {/* Điều khoản & Hợp đồng */}
                <Link href="/sinhloi/transactions" className="flex items-center gap-[16px] px-[22px] py-[10px]">
                  <FileText size={20} className="text-foreground shrink-0" />
                  <span className="flex-1 text-sm font-medium leading-5 text-foreground">
                    Điều khoản & Hợp đồng
                  </span>
                  <ChevronRight size={20} className="text-foreground-secondary shrink-0" />
                </Link>

                {/* Sao kê */}
                <Link href="/sinhloi/transactions" className="flex items-center gap-[16px] px-[22px] py-[10px]">
                  <Receipt size={20} className="text-foreground shrink-0" />
                  <span className="flex-1 text-sm font-medium leading-5 text-foreground">Sao kê</span>
                  <ChevronRight size={20} className="text-foreground-secondary shrink-0" />
                </Link>

                {/* Tắt Sinh lời tự động */}
                <Link href="/sinhloi/deactivate" className="flex items-center gap-[16px] px-[22px] py-[10px]">
                  <Power size={20} className="text-foreground shrink-0" />
                  <span className="flex-1 text-sm font-medium leading-5 text-foreground">
                    Tắt Sinh lời tự động
                  </span>
                  <ChevronRight size={20} className="text-foreground-secondary shrink-0" />
                </Link>
              </div>
            </div>

            {/* Footer */}
            <p className="text-xs leading-5 text-foreground text-center w-[346px]">
              Cung cấp bởi {cfg.provider}
            </p>
          </div>
        </div>

        {/* Home indicator */}
        <div className="h-[21px] shrink-0 flex items-end justify-center pb-[8px]">
          <div className="w-[139px] h-[5px] bg-foreground rounded-[100px]" />
        </div>

        {/* Info Dialog */}
        <Dialog
          open={showInfo}
          onClose={() => setShowInfo(false)}
          type="icon"
          icon={<Info size={36} className="text-info" />}
          title="Thông tin Sinh lời tự động"
          description={`Lợi suất: ${cfg.interestRate}%/năm\nSố dư tối đa: ${formatVND(SINHLOI_LIMITS.maxDeposit)}\nRút tối đa: ${formatVND(SINHLOI_LIMITS.maxWithdraw)}/ngày\nNhà cung cấp: ${cfg.provider}`}
          primaryLabel="Đã hiểu"
          secondaryLabel="Đóng"
          footerProps={{
            primaryProps: { onClick: () => setShowInfo(false) },
            secondaryProps: { onClick: () => setShowInfo(false) },
          }}
        />
      </div>
    </div>
  )
}
