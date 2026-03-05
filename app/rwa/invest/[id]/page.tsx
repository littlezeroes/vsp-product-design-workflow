"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { CheckCircle, AlertTriangle, X, ShieldCheck, Minus, Plus, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tip } from "@/components/ui/tip"
import { getProject, USER, formatVND } from "../../data"

/* ── Confirm Sheet ───────────────────────────────────────────────── */
function ConfirmSheet({ project, shares, totalAmount, onConfirm, onClose, confirming }: {
  project: ReturnType<typeof getProject>
  shares: number
  totalAmount: number
  onConfirm: () => void
  onClose: () => void
  confirming: boolean
}) {
  if (!project) return null

  return (
    <div className="absolute inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-foreground/40" />
      <div
        className="relative w-full bg-background rounded-t-[28px] px-[22px] pt-[14px] pb-[34px] animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center mb-[12px]">
          <div className="w-[36px] h-[4px] rounded-full bg-border" />
        </div>

        <div className="flex items-center justify-between mb-[16px]">
          <p className="text-md font-bold text-foreground">Xác nhận đăng ký</p>
          <button type="button" onClick={onClose} className="w-[32px] h-[32px] rounded-full bg-secondary flex items-center justify-center">
            <X size={16} className="text-foreground" />
          </button>
        </div>

        {/* Summary */}
        <div className="bg-secondary rounded-[20px] px-[18px] py-[14px] space-y-[10px]">
          <div className="flex justify-between">
            <span className="text-sm text-foreground-secondary">Dự án</span>
            <span className="text-sm font-semibold text-foreground text-right max-w-[180px] truncate">{project.name}</span>
          </div>
          <div className="border-t border-border" />
          <div className="flex justify-between">
            <span className="text-sm text-foreground-secondary">Số token</span>
            <span className="text-sm font-semibold text-foreground">{shares} token</span>
          </div>
          <div className="border-t border-border" />
          <div className="flex justify-between">
            <span className="text-sm text-foreground-secondary">Giá / token</span>
            <span className="text-sm text-foreground tabular-nums">{formatVND(project.tokenPrice)}</span>
          </div>
          <div className="border-t border-border" />
          <div className="flex justify-between">
            <span className="text-sm font-semibold text-foreground">Tổng tiền</span>
            <span className="text-md font-bold text-foreground tabular-nums">{formatVND(totalAmount)}</span>
          </div>
          <div className="border-t border-border" />
          <div className="flex justify-between">
            <span className="text-sm text-foreground-secondary">Thanh toán</span>
            <span className="text-sm text-foreground">Ví VSP · {formatVND(USER.totalBalance)}</span>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-[12px] px-[12px] py-[10px] bg-warning/5 rounded-[12px]">
          <div className="flex gap-[8px]">
            <AlertTriangle size={14} className="text-warning shrink-0 mt-[1px]" />
            <p className="text-[11px] text-foreground-secondary leading-snug">
              Tiền sẽ được <strong className="text-foreground">ngân hàng tạm giữ bảo vệ</strong> cho đến khi có kết quả phân bổ. Nếu không được phân bổ → hoàn 100%.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-[16px] flex flex-col gap-[10px]">
          <Button variant="primary" size="48" className="w-full" isLoading={confirming} onClick={onConfirm}>
            Xác nhận · {formatVND(totalAmount)}
          </Button>
          <button type="button" onClick={onClose} className="text-sm font-medium text-foreground-secondary text-center py-[4px]">
            Quay lại
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Investment Sheet Page ───────────────────────────────────────── */
export default function InvestPage() {
  const params = useParams()
  const router = useRouter()
  const [shares, setShares] = React.useState(10)
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [confirming, setConfirming] = React.useState(false)
  const [done, setDone] = React.useState(false)

  const project = getProject(params.id as string)

  if (!project) {
    return (
      <div className="min-h-screen bg-grey-100 dark:bg-grey-900 flex items-center justify-center">
        <p className="text-foreground-secondary">Không tìm thấy dự án</p>
      </div>
    )
  }

  const totalAmount = shares * project.tokenPrice
  const hasBalance = USER.totalBalance >= totalAmount
  const maxAffordable = Math.min(100, Math.floor(USER.totalBalance / project.tokenPrice))

  function handleConfirm() {
    setConfirming(true)
    setTimeout(() => {
      setConfirming(false)
      setShowConfirm(false)
      setDone(true)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-grey-100 dark:bg-grey-900 flex flex-col items-center">
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

        {/* ── Background: Project peek ───────────────────────── */}
        {!done && (
          <div className="px-[22px] pt-[8px] pb-[16px]">
            <div className="flex items-center gap-[10px]">
              <div className="w-[40px] h-[40px] rounded-[10px] bg-secondary flex items-center justify-center shrink-0">
                <MapPin size={16} className="text-foreground-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-foreground truncate">{project.name}</p>
                <p className="text-xs text-foreground-secondary">{project.location}</p>
              </div>
              <button type="button" onClick={() => router.back()}
                className="w-[32px] h-[32px] rounded-full bg-secondary flex items-center justify-center shrink-0">
                <X size={16} className="text-foreground" />
              </button>
            </div>
          </div>
        )}

        {/* ── Sheet: Amount selector ─────────────────────────── */}
        {!done && (
          <div className="flex-1 flex flex-col bg-secondary rounded-t-[28px]">
            {/* Handle */}
            <div className="flex justify-center pt-[10px] pb-[6px]">
              <div className="w-[36px] h-[4px] rounded-full bg-border" />
            </div>

            <div className="flex-1 flex flex-col px-[22px]">
              <p className="text-[11px] font-bold text-foreground-secondary uppercase tracking-wide">Đăng ký mua</p>

              {/* Token count — big live number */}
              <div className="flex-1 flex flex-col items-center justify-center py-[16px]">
                <div className="flex items-center gap-[20px]">
                  <button
                    type="button"
                    onClick={() => setShares(Math.max(1, shares - 1))}
                    className="w-[44px] h-[44px] rounded-full bg-background flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <Minus size={18} className="text-foreground" />
                  </button>
                  <div className="text-center min-w-[140px]">
                    <p className="text-[56px] font-bold text-foreground leading-none tabular-nums">
                      {shares}
                    </p>
                    <p className="text-xs text-foreground-secondary mt-[4px]">
                      <Tip text="Đơn vị sở hữu số — đại diện cho phần BĐS bạn mua">token</Tip>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShares(Math.min(100, shares + 1))}
                    className="w-[44px] h-[44px] rounded-full bg-background flex items-center justify-center active:scale-95 transition-transform"
                  >
                    <Plus size={18} className="text-foreground" />
                  </button>
                </div>

                {/* Live total */}
                <p className="text-lg font-bold text-foreground tabular-nums mt-[12px]">
                  {formatVND(totalAmount)}
                </p>
                <p className="text-[11px] text-foreground-secondary mt-[2px]">
                  {formatVND(project.tokenPrice)} / token
                </p>
              </div>

              {/* Slider */}
              <div className="px-[4px]">
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={shares}
                  onChange={(e) => setShares(Number(e.target.value))}
                  className="w-full h-[6px] rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[28px] [&::-webkit-slider-thumb]:h-[28px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-background
                    [&::-moz-range-thumb]:w-[28px] [&::-moz-range-thumb]:h-[28px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-foreground [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:border-0"
                  style={{
                    background: `linear-gradient(to right, var(--color-foreground) 0%, var(--color-foreground) ${((shares - 1) / 99) * 100}%, var(--color-border) ${((shares - 1) / 99) * 100}%, var(--color-border) 100%)`,
                  }}
                />
                {/* Quick presets */}
                <div className="flex justify-between mt-[12px]">
                  {[1, 5, 10, 25, 50].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setShares(n)}
                      className={cn(
                        "px-[12px] py-[5px] rounded-full text-xs font-semibold transition-colors",
                        shares === n
                          ? "bg-foreground text-background"
                          : "bg-background text-foreground-secondary"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Balance + note */}
              <div className="mt-[20px] flex items-center justify-between">
                <p className="text-xs text-foreground-secondary">
                  Số dư ví: <span className="font-semibold text-foreground">{formatVND(USER.totalBalance)}</span>
                </p>
                {!hasBalance && (
                  <p className="text-xs font-medium text-danger">Không đủ</p>
                )}
              </div>

              <div className="mt-[10px] flex items-start gap-[6px]">
                <ShieldCheck size={12} className="text-foreground-secondary shrink-0 mt-[1px]" />
                <p className="text-[11px] text-foreground-secondary leading-snug">
                  Tiền được <Tip text="Tài khoản trung gian do ngân hàng quản lý — không ai tự ý rút được">Escrow</Tip> ngân hàng bảo vệ
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="px-[22px] pb-[34px] pt-[14px]">
              <Button
                variant="primary"
                size="48"
                className="w-full"
                disabled={!hasBalance || shares === 0}
                onClick={() => setShowConfirm(true)}
              >
                Tiếp tục · {shares} token · {formatVND(totalAmount)}
              </Button>
            </div>
          </div>
        )}

        {/* ── Success ──────────────────────────────────────────── */}
        {done && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 px-[22px] pt-[60px] flex flex-col items-center">
              <div className="w-[64px] h-[64px] rounded-full bg-success/10 flex items-center justify-center mb-[20px]">
                <CheckCircle size={36} className="text-success" />
              </div>
              <p className="text-xl font-bold text-foreground">Đăng ký thành công!</p>
              <p className="text-sm text-foreground-secondary mt-[8px] text-center">
                Đã đăng ký {shares} token · {formatVND(totalAmount)}
              </p>

              {/* Status card */}
              <div className="w-full bg-secondary rounded-[20px] px-[18px] py-[14px] mt-[28px] space-y-[10px]">
                <div className="flex justify-between">
                  <span className="text-sm text-foreground-secondary">Trạng thái</span>
                  <span className="text-sm font-semibold text-warning">Chờ kết quả phân bổ</span>
                </div>
                <div className="border-t border-border" />
                <div className="flex justify-between">
                  <span className="text-sm text-foreground-secondary">Tiền tạm giữ</span>
                  <span className="text-sm font-semibold text-foreground tabular-nums">{formatVND(totalAmount)}</span>
                </div>
                <div className="border-t border-border" />
                <div className="flex justify-between">
                  <span className="text-sm text-foreground-secondary">Kết quả dự kiến</span>
                  <span className="text-sm text-foreground">Sau khi đợt bán kết thúc</span>
                </div>
              </div>

              <p className="text-[10px] text-foreground-secondary mt-[12px] text-center">
                Bạn sẽ nhận thông báo qua app và SMS khi có kết quả
              </p>
            </div>

            <div className="px-[22px] pb-[34px] pt-[12px]">
              <Button variant="primary" size="48" className="w-full"
                onClick={() => router.push("/rwa/holding/hold-2")}>
                Hoàn tất
              </Button>
            </div>
          </div>
        )}

        {/* Home indicator */}
        <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>

        {/* Confirm sheet */}
        {showConfirm && (
          <ConfirmSheet
            project={project}
            shares={shares}
            totalAmount={totalAmount}
            onConfirm={handleConfirm}
            onClose={() => setShowConfirm(false)}
            confirming={confirming}
          />
        )}
      </div>
    </div>
  )
}
