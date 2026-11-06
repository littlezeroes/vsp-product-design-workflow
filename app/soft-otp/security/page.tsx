"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronLeft, ShieldCheck, Info, Lock } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"

export default function SecurityCenter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "off"
  // states: off (default), on, locked, dialog-enable, dialog-ekyc

  const showEnableDialog = state === "dialog-enable"
  const showEkycDialog = state === "dialog-ekyc"
  const showLockedDialog = state === "dialog-locked"
  const isOn = state === "on"
  const isLocked = state === "locked"

  const handleToggle = (next: boolean) => {
    if (isLocked) return
    if (next) {
      router.push("/soft-otp/pin?action=activate")
    } else {
      router.push("/soft-otp/pin?action=deactivate")
    }
  }

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      {/* Status bar */}
      <div className="h-[54px] px-[22px] flex items-end justify-between pb-[6px]">
        <span className="text-[15px] font-semibold">9:41</span>
        <div className="flex items-center gap-[6px]">
          <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="0.5"/><rect x="4" y="5" width="3" height="7" rx="0.5"/><rect x="8" y="2" width="3" height="10" rx="0.5"/><rect x="12" y="0" width="3" height="12" rx="0.5"/></svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="currentColor"/><path d="M4.5 7.5a5 5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M2 5a8 8 0 0 1 12 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          <div className="flex items-center gap-[1px]"><div className="w-[22px] h-[11px] rounded-[3px] border border-current flex items-center p-[1px]"><div className="flex-1 h-full bg-current rounded-[1.5px]"/></div><div className="w-[1px] h-[4px] bg-current opacity-40 rounded-full"/></div>
        </div>
      </div>

      {/* NavBar */}
      <div className="flex items-center pl-[8px] pr-[22px] h-[56px]">
        <button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full">
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* Large title */}
      <div className="px-[22px] pt-[8px]">
        <h1 className="text-[28px] font-bold tracking-[-0.5px] leading-[34px]">Trung tâm bảo mật</h1>
        <p className="text-[14px] text-foreground-secondary mt-[6px]">
          Quản lý phương thức xác thực giao dịch của bạn.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pt-[24px] pb-[40px]">
        {/* Section: Xác thực giao dịch */}
        <div className="px-[22px] pt-[24px] pb-[12px]">
          <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-foreground-secondary">
            Xác thực giao dịch
          </span>
        </div>

        <div className="px-[22px]">
          <div className="bg-secondary rounded-14 px-[16px] py-[14px]">
            <div className="flex items-center gap-[12px]">
              <div className="w-[40px] h-[40px] rounded-full bg-background flex items-center justify-center shrink-0">
                <ShieldCheck size={20} className={isOn ? "text-brand-secondary" : "text-foreground-secondary"} strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-semibold leading-[20px]">Xác thực bằng Soft OTP</div>
                <div className="text-[13px] text-foreground-secondary mt-[2px] leading-[18px]">
                  {isLocked
                    ? <span className="text-danger">Tạm khoá — bật lại để tiếp tục</span>
                    : isOn
                    ? <span className="text-brand-secondary">Đang sử dụng cho giao dịch</span>
                    : "Chưa kích hoạt"}
                </div>
              </div>
              <Toggle
                checked={isOn}
                disabled={isLocked}
                onChange={handleToggle}
                aria-label="Xác thực bằng Soft OTP"
              />
            </div>
          </div>
        </div>

        {/* Info banner */}
        <div className="px-[22px] pt-[16px]">
          <div className="bg-warning/15 rounded-14 px-[16px] py-[12px] flex items-start gap-[10px]">
            <Info size={16} className="text-warning shrink-0 mt-[2px]" strokeWidth={2} />
            <p className="text-[13px] leading-[18px] text-foreground">
              Soft OTP thay thế FIDO. Mã OTP được sinh ngay trong app, không cần chờ SMS khi xác thực giao dịch.
            </p>
          </div>
        </div>

        {/* Locked recovery hint */}
        {isLocked && (
          <div className="px-[22px] pt-[16px]">
            <div className="bg-secondary rounded-14 px-[16px] py-[14px] flex items-start gap-[12px]">
              <Lock size={18} className="text-danger shrink-0 mt-[2px]" />
              <div className="flex-1">
                <div className="text-[14px] font-semibold mb-[4px]">Tài khoản tạm khoá</div>
                <p className="text-[13px] text-foreground-secondary leading-[18px]">
                  Vì lý do bảo mật, tính năng xác thực giao dịch đã bị tạm khoá. Bật lại bằng xác thực khuôn mặt.
                </p>
                <button
                  onClick={() => router.push("/soft-otp/face?state=unlock")}
                  className="text-[13px] font-semibold text-brand-secondary mt-[8px]"
                >
                  Mở khoá ngay →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Home indicator */}
      <div className="flex justify-center pb-[8px]">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>

      {/* Dialog: Bật xác thực */}
      {showEnableDialog && (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-overlay backdrop-blur-[5px]">
          <div className="w-[calc(100%-32px)] max-w-[358px] bg-background rounded-28 overflow-hidden shadow-xl mb-[24px] sm:mb-0">
            <div className="px-[24px] pt-[24px] pb-[8px] text-center">
              <h2 className="text-[20px] font-semibold leading-[26px] tracking-[-0.005em]">Bật xác thực giao dịch</h2>
              <p className="text-[14px] leading-[20px] text-foreground mt-[8px]">
                Bạn cần bật phương thức xác thực giao dịch để tiếp tục.
              </p>
            </div>
            <div className="flex gap-[8px] px-[24px] pt-[16px] pb-[20px]">
              <button
                onClick={() => router.back()}
                className="flex-1 h-[48px] rounded-full bg-secondary text-foreground font-semibold text-[15px]"
              >
                Để sau
              </button>
              <button
                onClick={() => router.push("/soft-otp/pin?action=activate")}
                className="flex-1 h-[48px] rounded-full bg-foreground text-background font-semibold text-[15px]"
              >
                Bật xác thực
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog: eKYC required */}
      {showEkycDialog && (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-overlay backdrop-blur-[5px]">
          <div className="w-[calc(100%-32px)] max-w-[358px] bg-background rounded-28 overflow-hidden shadow-xl mb-[24px] sm:mb-0">
            <div className="px-[24px] pt-[24px] pb-[8px] text-center">
              <div className="w-[48px] h-[48px] rounded-full bg-warning/20 mx-auto mb-[12px] flex items-center justify-center">
                <ShieldCheck size={24} className="text-warning" />
              </div>
              <h2 className="text-[20px] font-semibold leading-[26px] tracking-[-0.005em]">Xác thực CCCD/Căn cước</h2>
              <p className="text-[14px] leading-[20px] text-foreground mt-[8px]">
                Hãy xác thực danh tính để kích hoạt tài khoản và sử dụng đầy đủ tính năng V-Smart Pay.
              </p>
            </div>
            <div className="flex gap-[8px] px-[24px] pt-[16px] pb-[20px]">
              <button
                onClick={() => router.back()}
                className="flex-1 h-[48px] rounded-full bg-secondary text-foreground font-semibold text-[15px]"
              >
                Đóng
              </button>
              <button className="flex-1 h-[48px] rounded-full bg-foreground text-background font-semibold text-[15px]">
                Xác thực ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog: Locked */}
      {showLockedDialog && (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-overlay backdrop-blur-[5px]">
          <div className="w-[calc(100%-32px)] max-w-[358px] bg-background rounded-28 overflow-hidden shadow-xl mb-[24px] sm:mb-0">
            <div className="px-[24px] pt-[24px] pb-[8px] text-center">
              <div className="w-[48px] h-[48px] rounded-full bg-secondary mx-auto mb-[12px] flex items-center justify-center">
                <Lock size={24} className="text-danger" />
              </div>
              <h2 className="text-[20px] font-semibold leading-[26px] tracking-[-0.005em]">Xác thực giao dịch bị khoá</h2>
              <p className="text-[14px] leading-[20px] text-foreground mt-[8px]">
                Vì lý do bảo mật, tính năng xác thực giao dịch bị tạm khoá. Vui lòng bật lại tính năng để tiếp tục sử dụng.
              </p>
            </div>
            <div className="px-[24px] pt-[16px] pb-[20px]">
              <button
                onClick={() => router.push("/soft-otp/security?state=locked")}
                className="w-full h-[48px] rounded-full bg-foreground text-background font-semibold text-[15px]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
