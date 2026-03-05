"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ChevronLeft, ChevronRight, MapPin, AlertTriangle,
  ShieldCheck, FileText, Building2,
  CheckCircle, Plus, X, Calculator, Clock,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  getProject, getCampaignsForProject, getUserCommitment,
  formatVND, PROJECTS, HOLDINGS, type UserProjectStatus
} from "../../data"

/* ── Project Status Badge ──────────────────────────────────────────── */
function ProjectStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    "coming-soon": { label: "Sắp mở bán",  cls: "bg-warning/10 text-warning" },
    "open":        { label: "Đang mở bán",  cls: "bg-success/10 text-success" },
    "closed":      { label: "Đã kết thúc",  cls: "bg-foreground/10 text-foreground-secondary" },
  }
  const v = map[status] ?? map["coming-soon"]
  return (
    <span className={cn("px-[8px] py-[3px] rounded-full text-[11px] font-semibold shrink-0", v.cls)}>
      {v.label}
    </span>
  )
}

/* ── Campaign Badge ────────────────────────────────────────────────── */
function CampaignBadge({ status }: { status: string }) {
  const c: Record<string, { label: string; cls: string }> = {
    "coming-soon": { label: "Sắp mở bán", cls: "bg-warning/10 text-warning" },
    "open":        { label: "Đang mở bán", cls: "bg-success/10 text-success" },
    "calculating": { label: "Đang xử lý",  cls: "bg-info/10 text-info" },
    "completed":   { label: "Đã hoàn tất", cls: "bg-foreground/10 text-foreground" },
    "cancelled":   { label: "Đã hủy",      cls: "bg-danger/10 text-danger" },
  }
  const v = c[status] ?? c["coming-soon"]
  return <span className={cn("px-[10px] py-[4px] rounded-full text-xs font-semibold", v.cls)}>{v.label}</span>
}

/* ── Calculator Bottom Sheet ───────────────────────────────────────── */
function CalculatorSheet({ tokenPrice, yieldPct, userStatus, projectId, onClose }: {
  tokenPrice: number; yieldPct: number; userStatus: UserProjectStatus; projectId: string; onClose: () => void
}) {
  const router = useRouter()
  const [shares, setShares] = React.useState(10)
  const inv = shares * tokenPrice
  const yearly = inv * yieldPct / 100
  const monthly = yearly / 12

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/40" />
      <div
        className="relative w-full max-w-[390px] bg-background rounded-t-[28px] px-[22px] pt-[14px] pb-[34px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center mb-[12px]">
          <div className="w-[36px] h-[4px] rounded-full bg-border" />
        </div>

        <div className="flex items-center justify-between mb-[16px]">
          <p className="text-md font-bold text-foreground">Ước tính lợi nhuận</p>
          <button type="button" onClick={onClose} className="w-[32px] h-[32px] rounded-full bg-secondary flex items-center justify-center">
            <X size={16} className="text-foreground" />
          </button>
        </div>

        {/* Quick select */}
        <div className="flex items-center gap-[8px] mb-[16px]">
          <span className="text-xs text-foreground-secondary shrink-0">Số token</span>
          {[1, 5, 10, 20, 50].map((n) => (
            <button
              key={n} type="button" onClick={() => setShares(n)}
              className={cn(
                "w-[36px] h-[36px] rounded-full text-xs font-semibold transition-colors",
                shares === n ? "bg-foreground text-background" : "bg-secondary text-foreground-secondary"
              )}
            >{n}</button>
          ))}
        </div>

        {/* Result */}
        <div className="bg-secondary rounded-[20px] px-[18px] py-[14px] space-y-[10px]">
          <div className="flex justify-between">
            <span className="text-sm text-foreground-secondary">Tổng đầu tư</span>
            <span className="text-sm font-bold text-foreground tabular-nums">{formatVND(inv)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-foreground-secondary">Lợi nhuận / năm</span>
            <span className="text-sm font-bold text-success tabular-nums">{formatVND(Math.round(yearly))}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-foreground-secondary">Lợi nhuận / tháng</span>
            <span className="text-sm font-bold text-success tabular-nums">~{formatVND(Math.round(monthly))}</span>
          </div>
        </div>
        <div className="mt-[10px] mb-[16px] bg-warning/5 rounded-[10px] px-[10px] py-[8px]">
          <p className="text-[11px] text-foreground-secondary leading-snug">
            ⚠ Đây là ước tính, không phải cam kết. Lợi suất thực tế phụ thuộc vào thị trường cho thuê và giá BĐS. Chưa bao gồm phí quản lý.
          </p>
        </div>

        {/* CTA by state */}
        {userStatus === "none" && (
          <Button variant="primary" size="48" className="w-full"
            onClick={() => { onClose(); router.push(`/rwa/invest/${projectId}`) }}>
            Tham gia · {shares} token
          </Button>
        )}
        {userStatus === "whitelisted" && (
          <Button variant="primary" size="48" className="w-full"
            onClick={() => { onClose(); router.push(`/rwa/invest/${projectId}`) }}>
            Đặt mua {shares} token
          </Button>
        )}
        {userStatus === "committed" && (
          <Button variant="secondary" size="48" className="w-full"
            onClick={() => { onClose(); router.push(`/rwa/invest/${projectId}`) }}>
            <Plus size={18} />
            Đặt thêm {shares} token
          </Button>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   CONTENT SECTIONS — single scroll, no tabs
   ══════════════════════════════════════════════════════════════════════ */

/* ── Stats Strip ──────────────────────────────────────────────────── */
function StatsStrip({ project }: { project: typeof PROJECTS[0] }) {
  return (
    <div className="px-[22px] pt-[14px]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-foreground-secondary uppercase tracking-wide">Giá / token</p>
          <p className="text-sm font-bold text-foreground tabular-nums">{formatVND(project.tokenPrice)}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-foreground-secondary uppercase tracking-wide">Lợi suất</p>
          <p className="text-sm font-bold text-success">{project.expectedYield}%/năm</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-foreground-secondary uppercase tracking-wide">Ký hiệu</p>
          <div className="flex items-center justify-end gap-[4px] mt-[2px]">
            <div className="w-[16px] h-[16px] rounded-full bg-foreground/10 flex items-center justify-center">
              <span className="text-[8px] font-bold text-foreground">V</span>
            </div>
            <span className="text-sm font-bold text-foreground">{project.id.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Campaign Progress ────────────────────────────────────────────── */
function CampaignRow({ project, campaign }: {
  project: typeof PROJECTS[0]; campaign: ReturnType<typeof getCampaignsForProject>[0]
}) {
  const pct = project.totalSupply > 0 ? Math.round((project.soldCount / project.totalSupply) * 100) : 0
  return (
    <div className="px-[22px] pt-[14px]">
      <div className="flex items-center justify-between mb-[6px]">
        <CampaignBadge status={campaign.status} />
        {(() => {
          const days = Math.ceil((new Date(project.endDate).getTime() - Date.now()) / 86_400_000)
          return days > 0 ? (
            <span className="text-[11px] font-semibold text-foreground tabular-nums">Còn {days} ngày</span>
          ) : null
        })()}
      </div>
      <div className="flex items-center gap-[8px]">
        <div className="flex-1 h-[3px] bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-success rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-[11px] font-bold text-foreground tabular-nums">{pct}%</span>
      </div>
    </div>
  )
}

/* ── Info Sheet Overlay ───────────────────────────────────────────── */
function InfoSheet({ title, icon: Icon, iconColor, children, onClose }: {
  title: string; icon: typeof Clock; iconColor: string; children: React.ReactNode; onClose: () => void
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/40" />
      <div
        className="relative w-full bg-background rounded-t-[28px] px-[22px] pt-[14px] pb-[34px] max-h-[75%] flex flex-col animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center mb-[12px]">
          <div className="w-[36px] h-[4px] rounded-full bg-border" />
        </div>

        <div className="flex items-center gap-[10px] mb-[16px]">
          <Icon size={18} className={iconColor} />
          <p className="text-md font-bold text-foreground flex-1">{title}</p>
          <button type="button" onClick={onClose} className="w-[32px] h-[32px] rounded-full bg-secondary flex items-center justify-center shrink-0">
            <X size={16} className="text-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

/* ── Info Section — Tappable rows that open overlay sheets ────────── */
type SheetKey = "about" | "risk" | "safety" | "faq" | null

const INFO_ROWS: { key: Exclude<SheetKey, null>; icon: typeof Clock; iconColor: string; title: string; subtitle: string }[] = [
  { key: "about", icon: Building2, iconColor: "text-foreground", title: "Giới thiệu dự án", subtitle: "Chủ đầu tư · Tài sản cơ sở · Vị trí" },
  { key: "risk",  icon: AlertTriangle, iconColor: "text-warning", title: "Rủi ro & Điều kiện", subtitle: "Khóa vốn · Biến động giá · Hoàn tiền" },
  { key: "safety", icon: ShieldCheck, iconColor: "text-success", title: "An toàn & Pháp lý", subtitle: "Fireblocks · SPV · eKYC · ERC-3643" },
  { key: "faq",   icon: FileText, iconColor: "text-foreground-secondary", title: "Câu hỏi thường gặp", subtitle: "Token là gì · An toàn · Lợi nhuận" },
]

function InfoSection({ project, activeSheet, onOpenSheet }: {
  project: typeof PROJECTS[0]; activeSheet: SheetKey; onOpenSheet: (key: SheetKey) => void
}) {
  return (
    <>
      {/* Tappable rows */}
      <div className="px-[22px] pt-[32px]">
        <p className="text-[11px] font-bold text-foreground-secondary uppercase tracking-wide mb-[4px]">Tìm hiểu thêm</p>
        <div>
          {INFO_ROWS.map((row) => {
            const Icon = row.icon
            return (
              <button
                key={row.key}
                type="button"
                onClick={() => onOpenSheet(row.key)}
                className="w-full flex items-center gap-[12px] py-[14px] border-b border-border last:border-b-0"
              >
                <div className={cn("w-[36px] h-[36px] rounded-[10px] flex items-center justify-center shrink-0",
                  row.key === "about" ? "bg-foreground/5" :
                  row.key === "risk" ? "bg-warning/10" :
                  row.key === "safety" ? "bg-success/10" : "bg-secondary"
                )}>
                  <Icon size={16} className={row.iconColor} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold text-foreground">{row.title}</p>
                  <p className="text-[11px] text-foreground-secondary mt-[1px]">{row.subtitle}</p>
                </div>
                <ChevronRight size={16} className="text-foreground-secondary/40 shrink-0" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Overlay sheets */}
      {activeSheet === "about" && (
        <InfoSheet title="Giới thiệu dự án" icon={Building2} iconColor="text-foreground" onClose={() => onOpenSheet(null)}>
          <div>
            <p className="text-sm text-foreground-secondary leading-relaxed">{project.description}</p>
            <div className="flex items-center gap-[6px] mt-[12px]">
              <span className="text-xs font-semibold text-foreground">{project.developer}</span>
              <span className="text-xs text-foreground-secondary">· {project.area}</span>
            </div>

            {project.properties.length > 0 && (
              <div className="mt-[16px]">
                <p className="text-[11px] text-foreground-secondary mb-[8px]">Tài sản cơ sở — token đại diện quyền lợi tài chính chung</p>
                <div className="space-y-[6px]">
                  {project.properties.map((p) => (
                    <div key={p.id} className="flex items-center gap-[10px] bg-secondary rounded-[14px] px-[12px] py-[10px]">
                      <div className="w-[36px] h-[36px] rounded-[8px] bg-border/30 flex items-center justify-center shrink-0">
                        <Building2 size={14} className="text-foreground-secondary/40" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{p.name}</p>
                        <p className="text-[11px] text-foreground-secondary">{p.area} m² · {p.bedrooms} PN · {formatVND(p.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </InfoSheet>
      )}

      {activeSheet === "risk" && (
        <InfoSheet title="Rủi ro & Điều kiện" icon={AlertTriangle} iconColor="text-warning" onClose={() => onOpenSheet(null)}>
          <div className="space-y-[10px]">
            {[
              { icon: Clock, color: "text-warning", bg: "bg-warning/10", text: "Khóa tối thiểu 12 tháng · Sau đó có thể bán lại trên sàn V-Smart Pay" },
              { icon: AlertTriangle, color: "text-danger", bg: "bg-danger/10", text: `Lợi suất ${project.expectedYield}%/năm là kỳ vọng, không cam kết · Giá BĐS có thể giảm · Bạn có thể mất vốn` },
              { icon: ShieldCheck, color: "text-success", bg: "bg-success/10", text: "Tiền được ngân hàng giữ bảo vệ · Không phân bổ → hoàn 100% về ví trong 1-2 ngày" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-[10px]">
                <div className={cn("w-[28px] h-[28px] rounded-[8px] flex items-center justify-center shrink-0 mt-[1px]", item.bg)}>
                  <item.icon size={14} className={item.color} />
                </div>
                <p className="text-sm text-foreground-secondary leading-snug pt-[4px]">{item.text}</p>
              </div>
            ))}
          </div>
        </InfoSheet>
      )}

      {activeSheet === "safety" && (
        <InfoSheet title="An toàn & Pháp lý" icon={ShieldCheck} iconColor="text-success" onClose={() => onOpenSheet(null)}>
          <div className="space-y-[10px]">
            <div className="flex items-start gap-[10px]">
              <div className="w-[28px] h-[28px] rounded-[8px] bg-success/10 flex items-center justify-center shrink-0">
                <ShieldCheck size={14} className="text-success" />
              </div>
              <p className="text-sm text-foreground-secondary leading-snug pt-[4px]">Bảo mật cấp ngân hàng (Fireblocks) · Chỉ nhà đầu tư đã xác minh danh tính mới giao dịch được</p>
            </div>
            <div className="flex items-start gap-[10px]">
              <div className="w-[28px] h-[28px] rounded-[8px] bg-foreground/5 flex items-center justify-center shrink-0">
                <FileText size={14} className="text-foreground-secondary" />
              </div>
              <p className="text-sm text-foreground-secondary leading-snug pt-[4px]">Tài sản được giữ bởi pháp nhân riêng biệt (SPV) — nếu công ty vận hành gặp vấn đề, tài sản của bạn vẫn an toàn</p>
            </div>
            <div className="flex items-start gap-[10px]">
              <div className="w-[28px] h-[28px] rounded-[8px] bg-success/10 flex items-center justify-center shrink-0">
                <CheckCircle size={14} className="text-success" />
              </div>
              <p className="text-sm text-foreground-secondary leading-snug pt-[4px]">Xác minh danh tính qua VNPT eKYC · Tuân chuẩn quốc tế ERC-3643</p>
            </div>
          </div>
        </InfoSheet>
      )}

      {activeSheet === "faq" && (
        <InfoSheet title="Câu hỏi thường gặp" icon={FileText} iconColor="text-foreground-secondary" onClose={() => onOpenSheet(null)}>
          <div className="space-y-[14px]">
            {[
              { q: "\"Token\" là gì?", a: "1 token = 1 đơn vị quyền lợi tài chính từ BĐS (cho thuê + tăng giá). Bạn sở hữu thật, ghi nhận trên hợp đồng số không thể sửa xóa." },
              { q: "Tối thiểu bao nhiêu?", a: `Từ 1 token (${formatVND(project.tokenPrice)}). Không cần mua cả căn hộ.` },
              { q: "Tiền tôi có an toàn không?", a: "Tiền được ngân hàng giữ trong tài khoản Escrow. Nếu đợt bán không thành công, hoàn 100% tự động trong 1-2 ngày." },
              { q: "Khi nào tôi nhận được lợi nhuận?", a: "Lợi nhuận cho thuê được phân phối hàng quý sau khi BĐS bắt đầu vận hành. Lợi nhuận từ tăng giá nhận khi bán token." },
              { q: "Tôi có thể bán lại không?", a: "Sau thời gian khóa (12 tháng), bạn có thể bán lại trên sàn V-Smart Pay cho nhà đầu tư khác." },
              { q: "Nếu công ty vận hành gặp vấn đề thì sao?", a: "Tài sản được giữ bởi pháp nhân riêng (SPV). Tài sản của bạn tách biệt hoàn toàn, không bị ảnh hưởng." },
            ].map((item, i) => (
              <div key={i}>
                <p className="text-sm font-semibold text-foreground">{item.q}</p>
                <p className="text-xs text-foreground-secondary leading-snug mt-[4px]">{item.a}</p>
              </div>
            ))}
          </div>
        </InfoSheet>
      )}
    </>
  )
}

/* ══════════════════════════════════════════════════════════════════════
   PAGE — single scroll brochure, CTA changes by state
   ══════════════════════════════════════════════════════════════════════ */
export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [showCalc, setShowCalc] = React.useState(false)
  const [activeSheet, setActiveSheet] = React.useState<SheetKey>(null)

  const project = getProject(params.id as string)
  const campaigns = getCampaignsForProject(params.id as string)
  const activeCampaign = campaigns.find((c) => c.status === "open" || c.status === "coming-soon") ?? campaigns[0]
  const realCommitment = getUserCommitment(params.id as string)

  // Dev: state switcher overrides
  const [devOverride, setDevOverride] = React.useState<UserProjectStatus | null>(null)
  const [devCommitStep, setDevCommitStep] = React.useState(3)
  const userStatus = devOverride ?? realCommitment.status

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground-secondary">Không tìm thấy dự án</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-grey-100 dark:bg-grey-900 flex flex-col items-center">

      {/* ── DEV: State controls — OUTSIDE phone frame ──── */}
      <div className="w-full max-w-[800px] px-[16px] py-[10px] space-y-[6px]">
        <div className="flex items-center gap-[6px]">
          <span className="text-[10px] font-medium text-foreground-secondary shrink-0">Dự án:</span>
          <div className="flex gap-[4px] flex-wrap">
            {(["none", "whitelisted", "committed"] as const).map((s) => (
              <button
                key={s} type="button"
                onClick={() => setDevOverride(s)}
                className={cn(
                  "px-[8px] py-[3px] rounded-full text-[10px] font-semibold transition-colors",
                  userStatus === s ? "bg-foreground text-background" : "bg-secondary text-foreground-secondary"
                )}
              >
                {s === "none" ? "Mới" : s === "whitelisted" ? "Đã tham gia" : "Đã đặt mua"}
              </button>
            ))}
          </div>
        </div>
        {userStatus === "committed" && (
          <div className="flex items-center gap-[6px]">
            <span className="text-[10px] font-medium text-foreground-secondary shrink-0">Bước:</span>
            <div className="flex gap-[4px] flex-wrap">
              {([1, 2, 3, 4] as const).map((step) => (
                <button
                  key={step} type="button"
                  onClick={() => setDevCommitStep(step)}
                  className={cn(
                    "px-[8px] py-[3px] rounded-full text-[10px] font-semibold transition-colors",
                    devCommitStep === step ? "bg-foreground text-background" : "bg-secondary text-foreground-secondary"
                  )}
                >
                  {step === 1 ? "Đăng ký" : step === 2 ? "Escrow" : step === 3 ? "Chờ phân bổ" : "Nhận token"}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Phone frame ──────────────────────────────────── */}
      <div className="relative w-[390px] h-[844px] bg-background text-foreground flex flex-col rounded-[40px] shadow-xl overflow-hidden">

        {/* Floating back button */}
        <div className="absolute top-[50px] left-[14px] z-20">
          <button type="button" onClick={() => router.back()}
            className="w-[40px] h-[40px] rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
            <ChevronLeft size={22} className="text-foreground" />
          </button>
        </div>

        {/* Scroll content — single scroll, no tabs */}
        <div className="flex-1 overflow-y-auto pb-[100px]">

          {/* Hero image */}
          <div className="relative h-[200px] bg-secondary shrink-0">
            <div className="absolute inset-0 bg-foreground/5 flex items-center justify-center">
              <Building2 size={48} className="text-foreground-secondary/20" />
            </div>
            {/* Status bar overlay */}
            <div className="absolute top-0 inset-x-0 h-[44px] flex items-center px-6" aria-hidden="true">
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
          </div>

          {/* Identity */}
          <div className="px-[22px] pt-[20px]">
            <div className="flex items-center gap-[8px]">
              <p className="text-lg font-bold text-foreground">{project.name}</p>
              <ProjectStatusBadge status={project.status} />
            </div>
            <div className="flex items-center gap-[4px] mt-[4px]">
              <MapPin size={13} className="text-foreground-secondary" />
              <p className="text-sm text-foreground-secondary">{project.location}</p>
            </div>
          </div>

          {/* Stats strip */}
          <StatsStrip project={project} />

          {/* Campaign progress — show for open/coming-soon */}
          {activeCampaign && (project.status === "open" || project.status === "coming-soon") && (
            <CampaignRow project={project} campaign={activeCampaign} />
          )}

          {/* Whitelisted banner → link to holding */}
          {userStatus === "whitelisted" && (() => {
            const holding = HOLDINGS.find((h) => h.projectId === project.id)
            return (
              <div className="px-[22px] pt-[14px]">
                <button
                  type="button"
                  onClick={() => holding && router.push(`/rwa/holding/${holding.id}`)}
                  className="w-full flex items-center gap-[10px] bg-success/5 rounded-[16px] px-[14px] py-[10px]"
                >
                  <CheckCircle size={14} className="text-success shrink-0" />
                  <p className="text-xs text-foreground-secondary flex-1 text-left"><span className="font-semibold text-foreground">Đã đăng ký</span> · Đặt mua để giữ chỗ</p>
                  <ChevronRight size={14} className="text-foreground-secondary/40 shrink-0" />
                </button>
              </div>
            )
          })()}

          {/* Committed — black card → holding detail */}
          {userStatus === "committed" && realCommitment.shares && realCommitment.amount && (() => {
            const holding = HOLDINGS.find((h) => h.projectId === project.id)
            return (
              <div className="px-[22px] pt-[14px]">
                <button
                  type="button"
                  onClick={() => holding && router.push(`/rwa/holding/${holding.id}`)}
                  className="w-full bg-foreground rounded-[20px] px-[16px] py-[14px] overflow-hidden relative"
                >
                  {/* Decorative circles */}
                  <div className="absolute -top-[20px] -right-[20px] w-[80px] h-[80px] rounded-full border border-background/10" />
                  <div className="absolute -bottom-[10px] -left-[10px] w-[50px] h-[50px] rounded-full border border-background/10" />

                  <div className="relative flex items-center gap-[12px]">
                    <div className="w-[40px] h-[40px] rounded-full bg-background/10 flex items-center justify-center shrink-0">
                      <Loader2 size={18} className="text-warning animate-spin" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-bold text-background">
                        {realCommitment.shares} token · {formatVND(realCommitment.amount)}
                      </p>
                      <p className="text-xs text-background/60 mt-[2px]">Đang chờ phân bổ · Xem chi tiết</p>
                    </div>
                    <ChevronRight size={16} className="text-background/40 shrink-0" />
                  </div>
                </button>
              </div>
            )
          })()}

          {/* Info rows → overlay sheets */}
          <InfoSection project={project} activeSheet={activeSheet} onOpenSheet={setActiveSheet} />
        </div>

        {/* ── Sticky CTA ─────────────────────────────────────── */}
        <div className="absolute bottom-0 inset-x-0 bg-background border-t border-border px-[22px] pb-[34px] pt-[12px]">

          {/* Calculator link */}
          {project.status === "open" && (
            <button
              type="button" onClick={() => setShowCalc(true)}
              className="w-full flex items-center justify-center gap-[6px] mb-[10px]"
            >
              <Calculator size={13} className="text-foreground-secondary" />
              <span className="text-xs font-semibold text-foreground-secondary">Ước tính lợi nhuận</span>
            </button>
          )}

          {/* CTA by user status */}
          {project.status === "open" && userStatus === "none" && (
            <>
              <p className="text-[10px] text-foreground-secondary text-center mb-[6px]">Đăng ký miễn phí, chưa cần chuyển tiền</p>
              <Button variant="primary" size="48" className="w-full"
                onClick={() => router.push(`/rwa/invest/${project.id}`)}>
                Đăng ký tham gia
              </Button>
            </>
          )}
          {project.status === "open" && userStatus === "whitelisted" && (
            <Button variant="primary" size="48" className="w-full"
              onClick={() => router.push(`/rwa/invest/${project.id}`)}>
              Đặt mua ngay
            </Button>
          )}
          {project.status === "open" && userStatus === "committed" && (
            <Button variant="secondary" size="48" className="w-full"
              onClick={() => router.push(`/rwa/invest/${project.id}`)}>
              <Plus size={18} />
              Đặt thêm
            </Button>
          )}

          {/* Coming soon */}
          {project.status === "coming-soon" && (
            <Button variant="secondary" size="48" className="w-full" disabled>
              Sắp mở bán
            </Button>
          )}

          {/* Closed */}
          {project.status === "closed" && (
            <Button variant="secondary" size="48" className="w-full"
              onClick={() => router.push("/rwa")}>
              Xem dự án khác
            </Button>
          )}
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>

        {/* Calculator sheet */}
        {showCalc && (
          <CalculatorSheet
            tokenPrice={project.tokenPrice}
            yieldPct={project.expectedYield}
            userStatus={userStatus}
            projectId={project.id}
            onClose={() => setShowCalc(false)}
          />
        )}
      </div>
    </div>
  )
}
