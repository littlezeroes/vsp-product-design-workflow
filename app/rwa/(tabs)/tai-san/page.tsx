"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  TrendingUp, Lock,
  Loader2, ChevronRight,
  ArrowDownLeft, ArrowUpRight, CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  HOLDINGS, TRANSACTIONS,
  getProject, formatVND, formatVNDShort,
} from "../../data"

/* ── Portfolio Summary Card ────────────────────────────────────────── */
function PortfolioCard() {
  const totalValue = HOLDINGS.reduce((s, h) => s + h.currentValue, 0)
  const totalInvested = HOLDINGS.reduce((s, h) => s + h.shares * h.avgPrice, 0)
  const totalProfit = totalValue - totalInvested
  const totalProfitPct = totalInvested > 0
    ? ((totalProfit / totalInvested) * 100).toFixed(1)
    : "0"
  const isUp = totalProfit >= 0

  return (
    <div className="px-[22px] pt-[8px]">
      <div className="bg-foreground rounded-[20px] px-[20px] py-[18px]">
        <p className="text-xs text-background/50">Tổng giá trị danh mục</p>
        <p className="text-[28px] font-bold text-background leading-none tracking-tight tabular-nums mt-[4px]">
          {formatVND(totalValue)}
        </p>

        <div className="flex items-center gap-[20px] mt-[16px]">
          <div>
            <p className="text-[10px] text-background/40 uppercase tracking-wide">Lợi nhuận</p>
            <p className={cn(
              "text-sm font-bold tabular-nums",
              isUp ? "text-success" : "text-danger"
            )}>
              {isUp ? "+" : ""}{formatVND(totalProfit)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-background/40 uppercase tracking-wide">%</p>
            <p className={cn(
              "text-sm font-bold tabular-nums",
              isUp ? "text-success" : "text-danger"
            )}>
              {isUp ? "+" : ""}{totalProfitPct}%
            </p>
          </div>
          <div className="ml-auto">
            <p className="text-[10px] text-background/40 uppercase tracking-wide">Dự án</p>
            <p className="text-sm font-bold text-background">{HOLDINGS.length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Passbook Colors ──────────────────────────────────────────────── */
const PASSBOOK_COLORS = [
  { spine: "bg-success",     dot: "bg-success/20",     text: "text-success" },
  { spine: "bg-indigo-500",   dot: "bg-indigo-500/20",   text: "text-indigo-500" },
  { spine: "bg-yellow-500",   dot: "bg-yellow-500/20",   text: "text-yellow-500" },
  { spine: "bg-danger",      dot: "bg-danger/20",       text: "text-danger" },
]

/* ── Passbook Card (Cuốn Sổ) ─────────────────────────────────────── */
function HoldingRow({
  holding,
  colorIndex,
}: {
  holding: typeof HOLDINGS[0]
  colorIndex: number
}) {
  const router = useRouter()
  const project = getProject(holding.projectId)
  if (!project) return null

  const isUp = holding.profitPct > 0
  const isPending = holding.status === "pending"
  const isLocked = holding.status === "locked"
  const color = PASSBOOK_COLORS[colorIndex % PASSBOOK_COLORS.length]

  return (
    <button
      type="button"
      onClick={() => router.push(`/rwa/holding/${holding.id}`)}
      className={cn(
        "w-full rounded-[20px] overflow-hidden text-left",
        holding.status === "active" ? "bg-card-accent" : "bg-background border border-border"
      )}
    >
      {/* Spine accent */}
      <div className={cn("h-[4px] w-full", color.spine)} />

      <div className="px-[18px] py-[16px]">
        {/* Top row: avatar + name */}
        <div className="flex items-center gap-[12px]">
          <div className={cn(
            "w-[44px] h-[44px] rounded-[12px] flex items-center justify-center shrink-0 text-[15px] font-bold",
            isPending ? "bg-warning/10 text-warning" : cn(color.dot, color.text)
          )}>
            {isPending
              ? <Loader2 size={20} className="animate-spin" />
              : project.name.charAt(0)
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-foreground leading-tight truncate">
              {project.name}
            </p>
            <p className="text-xs text-foreground-secondary mt-[2px]">
              {holding.shares} token · {formatVND(holding.avgPrice)}/token
            </p>
          </div>
          <ChevronRight size={16} className="text-foreground-secondary/40 shrink-0" />
        </div>

        {/* Value row */}
        <div className="flex items-end justify-between mt-[16px]">
          <div>
            <p className="text-[10px] text-foreground-secondary uppercase tracking-wide">
              Giá trị hiện tại
            </p>
            <p className="text-[22px] font-bold text-foreground tabular-nums leading-tight mt-[2px]">
              {formatVND(holding.currentValue)}
            </p>
          </div>

          {/* Status badge */}
          <div className="shrink-0 mb-[2px]">
            {isPending ? (
              <span className="text-xs font-medium text-warning bg-warning/10 px-[10px] py-[4px] rounded-full">
                Chờ phân bổ
              </span>
            ) : isLocked ? (
              <span className="text-xs text-foreground-secondary flex items-center gap-[3px]">
                <Lock size={10} />
                Còn {holding.lockDaysLeft} ngày
              </span>
            ) : isUp ? (
              <span className="text-xs font-semibold text-success flex items-center gap-[2px]">
                <TrendingUp size={12} />
                +{holding.profitPct}%
              </span>
            ) : (
              <span className="text-xs font-semibold text-foreground-secondary">
                0%
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

/* ── Transaction Row (inline) ──────────────────────────────────────── */
const ON_CHAIN_TYPES = new Set(["allocate", "transfer"])

function TransactionRow({ tx }: { tx: typeof TRANSACTIONS[0] }) {
  const project = getProject(tx.projectId)
  if (!project) return null

  const typeLabels: Record<string, string> = {
    register: "Đăng ký mua",
    allocate: "Nhận token",
    refund: "Hoàn tiền",
    transfer: "Chuyển nhượng",
  }

  const typeIcons: Record<string, React.ReactNode> = {
    register: <ArrowUpRight size={14} className="text-foreground" />,
    allocate: <CheckCircle size={14} className="text-success" />,
    refund: <ArrowDownLeft size={14} className="text-info" />,
    transfer: <ArrowUpRight size={14} className="text-foreground" />,
  }

  const statusColors: Record<string, string> = {
    pending: "text-warning",
    success: "text-success",
    refunded: "text-info",
    failed: "text-danger",
  }

  const isOnChain = ON_CHAIN_TYPES.has(tx.type)

  return (
    <div className="flex items-center gap-[12px] py-[12px]">
      <div className="w-[36px] h-[36px] rounded-full bg-secondary flex items-center justify-center shrink-0">
        {typeIcons[tx.type]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-[6px]">
          <p className="text-sm font-medium text-foreground truncate">{typeLabels[tx.type]}</p>
          <span className={cn(
            "text-[9px] font-semibold uppercase tracking-wide px-[5px] py-[1px] rounded",
            isOnChain
              ? "bg-success/10 text-success"
              : "bg-foreground/5 text-foreground-secondary"
          )}>
            {isOnChain ? "on-chain" : "off-chain"}
          </span>
        </div>
        <p className="text-xs text-foreground-secondary mt-[1px]">{project.name}</p>
      </div>
      <div className="text-right shrink-0">
        <p className={cn("text-sm font-semibold tabular-nums", statusColors[tx.status])}>
          {tx.type === "refund" || tx.type === "allocate" ? "+" : "-"}{formatVNDShort(tx.amount)}
        </p>
        <p className="text-[10px] text-foreground-secondary">{tx.date}</p>
      </div>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────────────────── */
export default function PortfolioPage() {
  return (
    <div>
      {/* Portfolio Summary */}
      <PortfolioCard />

      {/* Holdings — Passbook style */}
      <div className="px-[22px] pt-[20px]">
        {HOLDINGS.length > 0 ? (
          <div className="space-y-[14px]">
            {HOLDINGS.map((h, i) => (
              <HoldingRow key={h.id} holding={h} colorIndex={i} />
            ))}
          </div>
        ) : (
          <div className="py-[40px] text-center">
            <p className="text-sm text-foreground-secondary">Bạn chưa có tài sản nào</p>
            <p className="text-xs text-foreground-secondary mt-[4px]">
              Bắt đầu đầu tư tại tab Dự án
            </p>
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="pt-[32px]">
        <div className="px-[22px]">
          <p className="text-[15px] font-bold text-foreground">Lịch sử giao dịch</p>
        </div>
        <div className="px-[22px] pt-[4px]">
          {TRANSACTIONS.length > 0 ? (
            <div className="divide-y divide-border">
              {TRANSACTIONS.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}
            </div>
          ) : (
            <div className="py-[24px] text-center">
              <p className="text-sm text-foreground-secondary">Chưa có giao dịch nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
