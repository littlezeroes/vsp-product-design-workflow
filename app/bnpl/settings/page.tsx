"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, Lock, Smartphone, Bell, FileText, Zap } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"

/**
 * S12: Settings Ví trả sau
 * Auto-repay, lock/unlock, device management, notifications
 * States: active (default), locked
 */
export default function SettingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "active"
  const isLocked = state === "locked"

  const [autoRepay, setAutoRepay] = React.useState(!isLocked)
  const [alerts, setAlerts] = React.useState(true)

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header
        variant="large-title"
        largeTitle="Cài đặt Ví trả sau"
        leading={
          <button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full">
            <ChevronLeft size={18} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto pb-[40px]">
        {/* Status card */}
        <div className="px-[22px] pt-[16px]">
          <div className={`rounded-28 px-[16px] py-[16px] ${isLocked ? "bg-danger/10" : "bg-secondary"}`}>
            <div className="flex items-center gap-[12px]">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${isLocked ? "bg-danger" : "bg-foreground"}`}>
                <Lock size={18} className={isLocked ? "text-white" : "text-background"} />
              </div>
              <div className="flex-1">
                <p className="text-md font-semibold leading-6 text-foreground">
                  {isLocked ? "Đang bị khóa" : "Đang hoạt động"}
                </p>
                <p className="text-xs leading-4 text-foreground-secondary">
                  {isLocked ? "Liên hệ CSKH để mở khóa" : "Mã HĐ · BNPL-CONT-2601"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-repayment */}
        <div className="pt-[32px]">
          <div className="px-[22px] pt-[24px] pb-[12px]">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
              Tự động thanh toán
            </p>
          </div>
          <div className="px-[22px] flex flex-col gap-[8px]">
            <div className="flex items-center gap-[12px] px-[14px] py-[14px] rounded-14 bg-secondary">
              <div className="w-11 h-11 rounded-full bg-background flex items-center justify-center shrink-0">
                <Zap size={18} className="text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-md font-semibold leading-6 text-foreground">Auto debit</p>
                <p className="text-xs leading-4 text-foreground-secondary">
                  Tự trừ từ Ví vào ngày đến hạn
                </p>
              </div>
              <button
                onClick={() => setAutoRepay(!autoRepay)}
                disabled={isLocked}
                className={`w-[48px] h-[28px] rounded-full relative transition-colors ${
                  autoRepay ? "bg-foreground" : "bg-grey-400"
                } ${isLocked ? "opacity-50" : ""}`}
              >
                <span
                  className={`absolute top-[2px] w-[24px] h-[24px] rounded-full bg-background transition-transform ${
                    autoRepay ? "translate-x-[22px]" : "translate-x-[2px]"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-[12px] px-[14px] py-[14px] rounded-14 bg-secondary">
              <div className="w-11 h-11 rounded-full bg-background flex items-center justify-center shrink-0">
                <Bell size={18} className="text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-md font-semibold leading-6 text-foreground">Nhắc hạn trả</p>
                <p className="text-xs leading-4 text-foreground-secondary">
                  Thông báo 3, 1 ngày trước hạn
                </p>
              </div>
              <button
                onClick={() => setAlerts(!alerts)}
                className={`w-[48px] h-[28px] rounded-full relative transition-colors ${
                  alerts ? "bg-foreground" : "bg-grey-400"
                }`}
              >
                <span
                  className={`absolute top-[2px] w-[24px] h-[24px] rounded-full bg-background transition-transform ${
                    alerts ? "translate-x-[22px]" : "translate-x-[2px]"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="pt-[32px]">
          <div className="px-[22px] pt-[24px] pb-[12px]">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
              Bảo mật
            </p>
          </div>
          <div className="px-[22px]">
            {[
              { Icon: Smartphone, label: "Thiết bị đăng nhập", meta: "3 thiết bị đang hoạt động" },
              { Icon: FileText, label: "Hợp đồng & sao kê", meta: "Xem và tải xuống" },
            ].map((r) => (
              <button
                key={r.label}
                className="w-full flex items-center gap-[12px] py-[12px] border-b border-border last:border-b-0"
              >
                <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <r.Icon size={18} className="text-foreground" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-md font-semibold leading-6 text-foreground">{r.label}</p>
                  <p className="text-xs leading-4 text-foreground-secondary">{r.meta}</p>
                </div>
                <ChevronRight size={20} className="text-foreground-secondary shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Lock action */}
        <div className="pt-[32px] px-[22px]">
          {isLocked ? (
            <Button variant="secondary" size="48" className="w-full">
              Liên hệ CSKH để mở khóa
            </Button>
          ) : (
            <Button variant="secondary" intent="danger" size="48" className="w-full">
              Khóa Ví trả sau
            </Button>
          )}
          <p className="text-xs leading-5 text-foreground-secondary text-center mt-[10px]">
            Khóa để tạm ngừng sử dụng khi nghi ngờ bất thường. Không ảnh hưởng khoản vay đang có.
          </p>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center pt-[20px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </div>
    </div>
  )
}
