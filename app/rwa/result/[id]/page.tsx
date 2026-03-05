"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, CheckCircle, AlertCircle, ArrowDownLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { getProject, CAMPAIGNS, getCampaignsForProject, formatVND } from "../../data"

/* ── Allocation Result Page ────────────────────────────────────────── */
export default function ResultPage() {
  const params = useParams()
  const router = useRouter()

  const project = getProject(params.id as string)
  const campaigns = getCampaignsForProject(params.id as string)
  const campaign = campaigns.find((c) => c.status === "completed")

  if (!project || !campaign) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground-secondary">Không tìm thấy kết quả</p>
      </div>
    )
  }

  // Mock allocation data
  const registered = 10
  const allocated = campaign.allocationRatio ? Math.round(registered * campaign.allocationRatio / 100) : registered
  const totalPaid = registered * project.tokenPrice
  const actualPaid = allocated * project.tokenPrice
  const refunded = totalPaid - actualPaid
  const ratio = campaign.allocationRatio ?? 100

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">

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
        <div className="flex items-center gap-2 pl-[14px] pr-[22px] h-[56px]">
          <button type="button" onClick={() => router.back()}
            className="w-[44px] h-[44px] flex items-center justify-center rounded-full">
            <ChevronLeft size={24} className="text-foreground" />
          </button>
          <p className="text-[18px] font-bold leading-7 text-foreground flex-1">Kết quả phân bổ</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-[120px]">

          {/* Hero */}
          <div className="px-[22px] pt-[20px] flex flex-col items-center">
            <div className="w-[64px] h-[64px] rounded-full bg-success/10 flex items-center justify-center mb-[16px]">
              <CheckCircle size={36} className="text-success" />
            </div>
            <p className="text-xl font-bold text-foreground">Phân bổ hoàn tất</p>
            <p className="text-sm text-foreground-secondary mt-[4px]">{project.name}</p>
          </div>

          {/* Result breakdown */}
          <div className="px-[22px] pt-[24px]">
            <div className="bg-secondary rounded-[28px] px-[20px] py-[18px] space-y-[14px]">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground-secondary">Đã đăng ký</span>
                <span className="text-sm text-foreground">{registered} token</span>
              </div>
              <div className="border-t border-border" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-foreground">Được phân bổ</span>
                <div className="flex items-center gap-[6px]">
                  <span className="text-md font-bold text-success">{allocated} token</span>
                  <CheckCircle size={14} className="text-success" />
                </div>
              </div>
              <div className="border-t border-border" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground-secondary">Tổng tiền đã giữ</span>
                <span className="text-sm text-foreground">{formatVND(totalPaid)}</span>
              </div>
              <div className="border-t border-border" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground-secondary">Đã thanh toán</span>
                <span className="text-sm font-semibold text-foreground">{formatVND(actualPaid)}</span>
              </div>
              {refunded > 0 && (
                <>
                  <div className="border-t border-border" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground-secondary">Hoàn trả</span>
                    <div className="flex items-center gap-[6px]">
                      <span className="text-sm font-semibold text-info">{formatVND(refunded)}</span>
                      <CheckCircle size={14} className="text-info" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Allocation explanation */}
          {ratio < 100 && (
            <div className="px-[22px] pt-[16px]">
              <div className="px-[14px] py-[12px] bg-info/8 rounded-[14px]">
                <div className="flex gap-[10px]">
                  <AlertCircle size={16} className="text-info shrink-0 mt-[1px]" />
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-[4px]">
                      Tỷ lệ phân bổ: {ratio}%
                    </p>
                    <p className="text-xs text-foreground-secondary leading-relaxed">
                      Tổng cộng có {campaign.commitmentCount} người đăng ký.
                      Nhu cầu vượt mức nên mỗi người nhận được {ratio}% số đã đăng ký.
                      Phần tiền thừa đã được hoàn trả tự động về ví VSP.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Status */}
          <div className="px-[22px] pt-[24px]">
            <p className="text-sm font-semibold text-foreground mb-[10px]">Trạng thái</p>
            <div className="space-y-[12px]">
              <div className="flex items-center gap-[10px]">
                <CheckCircle size={16} className="text-success" />
                <span className="text-sm text-foreground">Phần đã chuyển vào Tài sản</span>
              </div>
              {refunded > 0 && (
                <div className="flex items-center gap-[10px]">
                  <ArrowDownLeft size={16} className="text-info" />
                  <span className="text-sm text-foreground">Hoàn trả {formatVND(refunded)} về ví VSP</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="absolute bottom-0 inset-x-0 bg-background border-t border-border px-[22px] pb-[34px] pt-[12px]">
          <Button
            variant="primary"
            size="48"
            className="w-full"
            onClick={() => router.push("/rwa/tai-san")}
          >
            Xem tài sản
          </Button>
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </div>
    </div>
  )
}
