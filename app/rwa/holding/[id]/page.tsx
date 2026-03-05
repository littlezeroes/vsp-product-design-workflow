"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ChevronLeft, TrendingUp, Lock, Loader2,
  Layers, Calendar, MapPin,
  Receipt,
  ShieldCheck, Clock, BookOpen, Plus, Send, Repeat2,
  BadgeCheck, Building2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tip } from "@/components/ui/tip"
import {
  HOLDINGS,
  getProject, formatVND, getCampaignsForProject,
} from "../../data"

const SPINE_COLORS = ["bg-success", "bg-indigo-500", "bg-yellow-500", "bg-danger"]
const PASSBOOK_COLORS = [
  { spine: "bg-success",   dot: "bg-success/20",   text: "text-success" },
  { spine: "bg-indigo-500", dot: "bg-indigo-500/20", text: "text-indigo-500" },
  { spine: "bg-yellow-500", dot: "bg-yellow-500/20", text: "text-yellow-500" },
  { spine: "bg-danger",    dot: "bg-danger/20",     text: "text-danger" },
]


export default function HoldingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [flipped, setFlipped] = React.useState(true)
  const [devStep, setDevStep] = React.useState(3) // 1=Đăng ký, 2=Escrow, 3=Chờ phân bổ, 4=Nhận token

  const holdingIndex = HOLDINGS.findIndex((h) => h.id === params.id)
  const holding = HOLDINGS[holdingIndex]
  const project = holding ? getProject(holding.projectId) : null

  if (!holding || !project) {
    return (
      <div className="min-h-screen bg-grey-100 dark:bg-grey-900 flex items-center justify-center">
        <p className="text-foreground-secondary">Không tìm thấy tài sản</p>
      </div>
    )
  }

  const isUp = holding.profitPct > 0
  const isPending = holding.status === "pending"
  const isLocked = holding.status === "locked"
  const isActive = holding.status === "active"
  const invested = holding.shares * holding.avgPrice
  const profit = holding.currentValue - invested
  const color = PASSBOOK_COLORS[holdingIndex % PASSBOOK_COLORS.length]
  const spineColor = SPINE_COLORS[holdingIndex % SPINE_COLORS.length]

  return (
    <div className="min-h-screen bg-grey-100 dark:bg-grey-900 flex flex-col items-center">

      {/* ── DEV: Step controls — OUTSIDE phone frame ──── */}
      {isPending && (
        <div className="w-full max-w-[800px] px-[16px] py-[10px]">
          <div className="flex items-center gap-[6px]">
            <span className="text-[10px] font-medium text-foreground-secondary shrink-0">Bước:</span>
            <div className="flex gap-[4px] flex-wrap">
              {([
                { step: 1, label: "Đăng ký" },
                { step: 2, label: "Escrow" },
                { step: 3, label: "Chờ phân bổ" },
                { step: 4, label: "Nhận token" },
              ] as const).map((s) => (
                <button
                  key={s.step} type="button"
                  onClick={() => setDevStep(s.step)}
                  className={cn(
                    "px-[8px] py-[3px] rounded-full text-[10px] font-semibold transition-colors",
                    devStep === s.step ? "bg-foreground text-background" : "bg-secondary text-foreground-secondary"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="relative w-[390px] h-[844px] bg-background text-foreground flex flex-col rounded-[40px] shadow-xl overflow-hidden mt-[16px]">

        {/* Status bar */}
        <div className="w-full shrink-0 flex items-center px-6 h-[44px]" aria-hidden="true">
          <span className="text-[17px] font-semibold leading-none text-foreground flex-1">9:41</span>
          <div className="flex items-center gap-[6px]">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor" className="text-foreground">
              <rect x="0" y="8" width="3" height="4" rx="0.5" />
              <rect x="4" y="5" width="3" height="7" rx="0.5" />
              <rect x="8" y="2" width="3" height="10" rx="0.5" />
              <rect x="12" y="0" width="3" height="12" rx="0.5" />
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="text-foreground">
              <path d="M8 9.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="currentColor" />
              <path d="M4.5 7.5a5 5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M2 5a8 8 0 0 1 12 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <div className="flex items-center gap-[1px]">
              <div className="w-[22px] h-[11px] rounded-[3px] border border-current flex items-center p-[1px]">
                <div className="flex-1 h-full bg-current rounded-[1.5px]" />
              </div>
              <div className="w-[1px] h-[4px] bg-current opacity-40 rounded-full" />
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="h-[44px] flex items-center px-[14px]">
          <button type="button" onClick={() => router.back()}
            className="w-[32px] h-[32px] rounded-full flex items-center justify-center">
            <ChevronLeft size={22} className="text-foreground" />
          </button>
          <p className="flex-1 text-center text-[17px] font-bold text-foreground pr-[32px]">Chi tiết tài sản</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-[40px]">

          {/* ── Black Summary Card — pending only ─────────────── */}
          {isPending && (
          <div className="px-[22px] pt-[8px]">
            <div className="bg-foreground rounded-[20px] px-[20px] py-[18px] overflow-hidden relative">
              {/* Decorative circles */}
              <div className="absolute -top-[40px] -right-[40px] w-[120px] h-[120px] rounded-full border border-background/5" />
              <div className="absolute -bottom-[30px] -left-[30px] w-[100px] h-[100px] rounded-full border border-background/5" />

              {/* Header: project + token badge */}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-[8px]">
                  <div className="w-[32px] h-[32px] rounded-[8px] bg-background/10 flex items-center justify-center">
                    <Building2 size={16} className="text-background/60" />
                  </div>
                  <div>
                    <p className="text-[11px] text-background/50">{project.name}</p>
                    <p className="text-[10px] text-background/30 font-mono">{project.id.toUpperCase()}</p>
                  </div>
                </div>
                {/* Token symbol */}
                <div className="flex items-center gap-[6px] bg-background/10 rounded-full px-[10px] py-[4px]">
                  <div className="w-[14px] h-[14px] rounded-full bg-background/20 flex items-center justify-center">
                    <span className="text-[7px] font-bold text-background">V</span>
                  </div>
                  <span className="text-[10px] font-bold text-background/70">{holding.shares} token</span>
                </div>
              </div>

              {/* Amount */}
              <div className="relative z-10 mt-[14px]">
                <p className="text-[10px] text-background/40 uppercase tracking-wide">Số tiền đặt mua</p>
                <p className="text-[28px] font-bold text-background leading-none tracking-tight tabular-nums mt-[2px]">
                  {formatVND(invested)}
                </p>
              </div>

              {/* ── Progress bar: 4 steps ── */}
                  {(() => {
                    const campaign = getCampaignsForProject(holding.projectId).find(c => c.status === "open" || c.status === "calculating")
                    const demandPct = campaign ? Math.round((campaign.raisedAmount / campaign.targetAmount) * 100) : 150

                    const STEPS = [
                      { key: "register", label: "Đăng ký mua",           desc: `${holding.shares} token · ${formatVND(invested)}`, done: devStep > 1, active: devStep === 1, bank: false },
                      { key: "escrow",   label: "Escrow · Techcombank",  desc: "Tiền được ngân hàng bảo vệ", done: devStep > 2, active: devStep === 2, bank: true },
                      { key: "alloc",    label: "Chờ phân bổ",           desc: `Tiến độ ${demandPct}%${demandPct > 100 ? " · Vượt mức" : ""}`, done: devStep > 3, active: devStep === 3, bank: false },
                      { key: "token",    label: "Nhận token vào ví",     desc: "Token chuyển vào ví VSP", done: devStep > 4, active: devStep === 4, bank: false },
                    ]

                    return (
                      <div className="relative z-10 mt-[16px]">
                        {/* Vertical timeline */}
                        {STEPS.map((s, i) => {
                          const isLast = i === STEPS.length - 1
                          return (
                            <div key={s.key} className="flex gap-[12px]">
                              {/* Vertical line + dot */}
                              <div className="flex flex-col items-center w-[16px]">
                                <div className={cn(
                                  "w-[10px] h-[10px] rounded-full border-[2px] shrink-0 mt-[2px]",
                                  s.done ? "bg-success border-success"
                                    : s.active ? "border-warning bg-warning/40"
                                    : "bg-transparent border-background/15"
                                )} />
                                {!isLast && (
                                  <div className={cn(
                                    "w-[2px] flex-1 min-h-[16px]",
                                    s.done ? "bg-success" : "bg-background/10"
                                  )} />
                                )}
                              </div>

                              {/* Content */}
                              <div className={cn("pb-[14px] flex-1 min-w-0", isLast && "pb-0")}>
                                <p className={cn(
                                  "text-[11px] font-semibold leading-tight",
                                  s.done ? "text-success"
                                    : s.active ? "text-background"
                                    : "text-background/25"
                                )}>
                                  {s.done ? `✓ ${s.label}`
                                    : s.key === "escrow" ? <span><Tip text="Tài khoản trung gian do ngân hàng quản lý — không ai tự ý rút được cho đến khi phân bổ xong">Escrow</Tip> · Techcombank</span>
                                    : s.key === "alloc" ? <span>Chờ <Tip text="Chia token cho nhà đầu tư theo tỷ lệ sau khi đợt bán kết thúc">phân bổ</Tip></span>
                                    : s.key === "token" ? <span>Nhận <Tip text="Đơn vị sở hữu số — đại diện cho phần BĐS bạn mua">token</Tip> vào ví</span>
                                    : s.label}
                                </p>
                                {(s.done || s.active) && (
                                  <p className="text-[10px] text-background/40 mt-[2px]">{s.desc}</p>
                                )}

                                {/* Bank logo inline for escrow step */}
                                {s.bank && (s.done || s.active) && (
                                  <div className="flex items-center gap-[8px] mt-[6px] bg-background/[0.07] rounded-[10px] px-[10px] py-[7px]">
                                    <div className="w-[28px] h-[28px] rounded-[7px] bg-red-500/20 flex items-center justify-center shrink-0">
                                      <span className="text-[8px] font-extrabold text-red-500">TCB</span>
                                    </div>
                                    <p className="text-[10px] font-medium text-background/60">Techcombank Escrow</p>
                                    <ShieldCheck size={12} className="text-success ml-auto shrink-0" />
                                  </div>
                                )}

                                {/* Campaign progress + allocation estimate for alloc step */}
                                {(s.done || s.active) && s.key === "alloc" && (() => {
                                  const isOver = demandPct > 100
                                  const ratio = isOver ? Math.round((100 / demandPct) * 100) : 100
                                  const estRcv = Math.round(holding.shares * ratio / 100)
                                  const estRef = holding.shares - estRcv
                                  return (
                                    <div className="mt-[8px] bg-background/[0.07] rounded-[12px] px-[12px] py-[10px] space-y-[10px]">
                                      {/* Bar 1: Tiến độ đăng ký */}
                                      <div>
                                        <div className="flex items-center justify-between mb-[4px]">
                                          <span className="text-[9px] text-background/50">Tiến độ đăng ký</span>
                                          <span className={cn(
                                            "text-[10px] font-bold tabular-nums",
                                            isOver ? "text-warning" : "text-success"
                                          )}>{demandPct}%{isOver ? " · Vượt mức" : ""}</span>
                                        </div>
                                        <div className="h-[4px] bg-background/10 rounded-full overflow-hidden">
                                          <div className={cn(
                                            "h-full rounded-full",
                                            isOver ? "bg-warning" : "bg-success"
                                          )} style={{ width: `${Math.min(demandPct, 100)}%` }} />
                                        </div>
                                      </div>

                                      {/* Bar 2: Ước tính phân bổ — split green + blue */}
                                      {isOver && (
                                        <div>
                                          <div className="flex items-center justify-between mb-[4px]">
                                            <span className="text-[9px] text-background/50">Ước tính phân bổ</span>
                                            <span className="text-[10px] font-bold text-background/70 tabular-nums">{ratio}%</span>
                                          </div>
                                          <div className="h-[4px] bg-background/10 rounded-full overflow-hidden flex">
                                            <div className="h-full bg-success" style={{ width: `${ratio}%` }} />
                                            <div className="h-full bg-info" style={{ width: `${100 - ratio}%` }} />
                                          </div>
                                          <div className="flex items-center gap-[10px] mt-[4px]">
                                            <div className="flex items-center gap-[4px]">
                                              <div className="w-[6px] h-[6px] rounded-full bg-success" />
                                              <span className="text-[9px] text-background/40">Nhận token</span>
                                            </div>
                                            <div className="flex items-center gap-[4px]">
                                              <div className="w-[6px] h-[6px] rounded-full bg-info" />
                                              <span className="text-[9px] text-background/40">Hoàn tiền</span>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {/* Ước nhận + Hoàn tiền */}
                                      {isOver && (
                                        <div className="flex gap-[8px] pt-[4px]">
                                          <div className="flex-1 bg-success/10 rounded-[10px] px-[10px] py-[8px]">
                                            <p className="text-[9px] text-background/40">Ước nhận</p>
                                            <p className="text-[13px] font-bold text-success tabular-nums mt-[2px]">~{estRcv} token</p>
                                          </div>
                                          <div className="flex-1 bg-info/10 rounded-[10px] px-[10px] py-[8px]">
                                            <p className="text-[9px] text-background/40">Hoàn tiền</p>
                                            <p className="text-[13px] font-bold text-info tabular-nums mt-[2px]">~{formatVND(estRef * holding.avgPrice)}</p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })()}

                                {/* Token received confirmation for token step */}
                                {(s.done || s.active) && s.key === "token" && (
                                  <div className="mt-[6px] bg-background/[0.07] rounded-[10px] px-[10px] py-[7px] flex items-center gap-[6px]">
                                    <div className="w-[18px] h-[18px] rounded-full bg-background/15 flex items-center justify-center shrink-0">
                                      <span className="text-[7px] font-bold text-background">V</span>
                                    </div>
                                    <span className="text-[10px] font-medium text-background/60">{holding.shares} {project.id.toUpperCase()} → Ví VSP</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}
            </div>
          </div>
          )}

          {/* Pending: action icons + note */}
          {isPending && (
            <>
              <div className="px-[22px] pt-[20px]">
                <div className="flex items-start justify-center gap-[24px]">
                  {[
                    { icon: Plus, label: "Đặt thêm", onClick: () => router.push(`/rwa/project/${holding.projectId}`) },
                    { icon: MapPin, label: "Chi tiết dự án", onClick: () => router.push(`/rwa/project/${holding.projectId}`) },
                  ].map((action, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={action.onClick}
                      className="flex flex-col items-center gap-[6px] w-[64px]"
                    >
                      <div className="w-[48px] h-[48px] rounded-full bg-secondary flex items-center justify-center">
                        <action.icon size={20} className="text-foreground" />
                      </div>
                      <span className="text-[10px] font-medium text-foreground-secondary text-center leading-tight">
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="px-[22px] pt-[12px]">
                <p className="text-[11px] text-foreground-secondary leading-snug">
                  Không phân bổ → hoàn 100% tự động về ví trong 1-2 ngày
                </p>
              </div>
            </>
          )}

          {/* ── Active/Locked: Flippable Passbook + Action Icons + Detail Rows ── */}
          {!isPending && (
            <>
              <div className="px-[22px] pt-[8px]">
                <div
                  className="cursor-pointer"
                  style={{ perspective: "1000px" }}
                  onClick={(e) => { e.stopPropagation(); setFlipped((f) => !f) }}
                >
                  {/* Explicit height so back (absolute) doesn't overlap content below */}
                  <div
                    className="relative w-full transition-transform duration-500"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                      height: "200px",
                    }}
                  >
                    {/* ─── FRONT ───────────────────────────────── */}
                    <div
                      className="absolute inset-0 w-full h-full rounded-[20px] overflow-hidden bg-card-accent"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <div className={cn("h-[4px] w-full", color.spine)} />
                      <div className="px-[18px] py-[14px] flex flex-col h-[calc(100%-4px)]">
                        {/* Name */}
                        <div className="flex items-center gap-[10px]">
                          <div className={cn("w-[40px] h-[40px] rounded-[10px] flex items-center justify-center shrink-0 text-[14px] font-bold", color.dot, color.text)}>
                            {project.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-foreground truncate">{project.name}</p>
                            <p className="text-[11px] text-foreground-secondary">{holding.shares} token</p>
                          </div>
                          <div className="shrink-0">
                            {isLocked ? (
                              <span className="text-[11px] text-foreground-secondary flex items-center gap-[3px]">
                                <Lock size={10} /> {holding.lockDaysLeft}d
                              </span>
                            ) : isUp ? (
                              <span className="text-[11px] font-semibold text-success">+{holding.profitPct}%</span>
                            ) : (
                              <span className="text-[11px] text-foreground-secondary">0%</span>
                            )}
                          </div>
                        </div>
                        {/* Value */}
                        <div className="mt-auto pt-[12px]">
                          <p className="text-[10px] text-foreground-secondary uppercase tracking-wide">Giá trị</p>
                          <p className="text-[24px] font-bold text-foreground tabular-nums leading-tight">{formatVND(holding.currentValue)}</p>
                        </div>
                        {/* Hint */}
                        <div className="flex items-center justify-center gap-[4px] mt-[10px] pt-[10px] border-t border-border/50">
                          <BookOpen size={11} className="text-foreground-secondary/50" />
                          <p className="text-[10px] text-foreground-secondary/50">Nhấn để mở sổ</p>
                        </div>
                      </div>
                    </div>

                    {/* ─── BACK ────────────────────────────────── */}
                    <div
                      className="absolute inset-0 w-full h-full rounded-[20px] overflow-hidden bg-card-accent"
                      style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                    >
                      <div className={cn("h-[4px] w-full", color.spine)} />
                      <div className="px-[18px] py-[14px] flex flex-col items-center h-[calc(100%-4px)]">
                        {/* Stamp */}
                        <div className="w-[72px] h-[72px] rounded-full border-[2px] border-dashed border-success/60 flex items-center justify-center mt-[6px]">
                          <div className="w-[60px] h-[60px] rounded-full border-[1.5px] border-success/40 flex flex-col items-center justify-center">
                            <BadgeCheck size={16} className="text-success mb-[1px]" />
                            <span className="text-[7px] font-bold text-success uppercase tracking-widest">Đã sở hữu</span>
                          </div>
                        </div>
                        <p className="text-[10px] font-bold text-foreground uppercase tracking-widest mt-[8px]">Chứng nhận</p>
                        <p className="text-[9px] text-foreground-secondary">V-Smart Pay · {project.id.toUpperCase()}</p>
                        {/* Hint */}
                        <div className="mt-auto flex items-center justify-center gap-[4px] pt-[10px] border-t border-border/50 w-full">
                          <p className="text-[10px] text-foreground-secondary/50">Nhấn để đóng sổ</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Icons */}
              <div className="px-[22px] pt-[20px]">
                <div className="flex items-start justify-center gap-[24px]">
                  {[
                    { icon: Send, label: "Chuyển", onClick: () => {} },
                    { icon: Repeat2, label: "Đổi tài sản thật", onClick: () => {} },
                    { icon: Plus, label: "Đặt thêm", onClick: () => router.push(`/rwa/project/${holding.projectId}`) },
                    { icon: MapPin, label: "Chi tiết dự án", onClick: () => router.push(`/rwa/project/${holding.projectId}`) },
                  ].map((action, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={action.onClick}
                      className="flex flex-col items-center gap-[6px] w-[64px]"
                    >
                      <div className="w-[48px] h-[48px] rounded-full bg-secondary flex items-center justify-center">
                        <action.icon size={20} className="text-foreground" />
                      </div>
                      <span className="text-[10px] font-medium text-foreground-secondary text-center leading-tight">
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Detail Rows */}
              <div className="px-[22px] pt-[24px]">
                <p className="text-[11px] font-bold text-foreground-secondary uppercase tracking-wide mb-[8px]">Thông tin sở hữu</p>
                <div className="bg-secondary rounded-[20px] px-[18px] py-[4px]">
                  {[
                    { icon: Layers, label: "Số token sở hữu", value: `${holding.shares} token` },
                    { icon: Receipt, label: "Giá vốn / token", value: formatVND(holding.avgPrice) },
                    { icon: Calendar, label: "Tổng giá vốn", value: formatVND(invested) },
                    { icon: TrendingUp, label: "Lợi suất kỳ vọng", value: `${project.expectedYield}%/năm`, color: "text-success" },
                  ].map((row, i) => (
                    <div key={i} className={cn(
                      "flex items-center justify-between py-[13px]",
                      i < 3 && "border-b border-border/50"
                    )}>
                      <div className="flex items-center gap-[10px]">
                        <row.icon size={15} className="text-foreground-secondary" />
                        <span className="text-sm text-foreground-secondary">{row.label}</span>
                      </div>
                      <span className={cn("text-sm font-semibold tabular-nums", row.color ?? "text-foreground")}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {isLocked && (
                <div className="px-[22px] pt-[16px]">
                  <div className="bg-foreground/[0.03] rounded-[16px] px-[14px] py-[12px] flex items-start gap-[8px]">
                    <Lock size={14} className="text-foreground-secondary shrink-0 mt-[1px]" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">Tài sản đang khóa</p>
                      <p className="text-[11px] text-foreground-secondary mt-[2px] leading-snug">
                        Còn {holding.lockDaysLeft} ngày. Sau khi hết khóa, bạn có thể bán lại trên sàn V-Smart Pay.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>


        {/* Home indicator */}
        <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </div>
    </div>
  )
}
