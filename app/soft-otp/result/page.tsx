"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Check, X, Lock, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FixedBottom } from "@/components/ui/fixed-bottom"

type ResultType = "activated" | "deactivated" | "tx-success" | "tx-failed" | "tx-locked" | "activation-failed"

export default function Result() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = (searchParams.get("type") ?? "activated") as ResultType

  const config = {
    activated: {
      icon: <Check size={32} className="text-background" strokeWidth={3} />,
      iconBg: "bg-brand-secondary",
      title: "Kích hoạt thành công",
      description: "Bạn có thể xác thực giao dịch bằng Soft OTP. Mã OTP sẽ được sinh ngay trong app, không cần chờ SMS.",
      primaryLabel: "Hoàn tất",
      primaryAction: () => router.push("/soft-otp/security?state=on"),
      secondaryLabel: "",
    },
    deactivated: {
      icon: <Check size={32} className="text-background" strokeWidth={3} />,
      iconBg: "bg-foreground",
      title: "Đã tắt xác thực bằng Soft OTP",
      description: "Bạn có thể bật lại bất cứ lúc nào trong Trung tâm bảo mật.",
      primaryLabel: "Hoàn tất",
      primaryAction: () => router.push("/soft-otp/security?state=off"),
      secondaryLabel: "",
    },
    "tx-success": {
      icon: <Check size={32} className="text-background" strokeWidth={3} />,
      iconBg: "bg-brand-secondary",
      title: "Giao dịch thành công",
      description: "",
      primaryLabel: "Về trang chủ",
      primaryAction: () => router.push("/"),
      secondaryLabel: "Xem biên lai",
    },
    "tx-failed": {
      icon: <X size={32} className="text-background" strokeWidth={3} />,
      iconBg: "bg-danger",
      title: "Giao dịch thất bại",
      description: "Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng thực hiện lại giao dịch.",
      primaryLabel: "Thử lại",
      primaryAction: () => router.push("/soft-otp/otp"),
      secondaryLabel: "Về trang chủ",
    },
    "tx-locked": {
      icon: <Lock size={28} className="text-background" strokeWidth={2.5} />,
      iconBg: "bg-danger",
      title: "Tạm khoá xác thực giao dịch",
      description: "Vì lý do bảo mật, tính năng xác thực giao dịch bị tạm khoá do bạn đã nhập sai nhiều lần. Vui lòng bật lại để tiếp tục sử dụng.",
      primaryLabel: "Bật lại xác thực",
      primaryAction: () => router.push("/soft-otp/face?state=unlock"),
      secondaryLabel: "Về trang chủ",
    },
    "activation-failed": {
      icon: <X size={32} className="text-background" strokeWidth={3} />,
      iconBg: "bg-danger",
      title: "Kích hoạt thất bại",
      description: "Không thể nhận được dữ liệu từ máy chủ. Vui lòng kiểm tra kết nối và thử lại.",
      primaryLabel: "Thử lại",
      primaryAction: () => router.push("/soft-otp/security"),
      secondaryLabel: "Về trang chủ",
    },
  }[type] ?? {
    icon: <Check size={32} className="text-background" strokeWidth={3} />,
    iconBg: "bg-brand-secondary",
    title: "Thành công",
    description: "",
    primaryLabel: "Hoàn tất",
    primaryAction: () => router.push("/"),
    secondaryLabel: "",
  }

  const isTxSuccess = type === "tx-success"

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

      {/* NavBar — empty for full feedback flow */}
      <div className="h-[56px]" />

      <div className="flex-1 flex flex-col items-center text-center px-[22px] pt-[40px]">
        {/* Icon */}
        <div className={`w-[80px] h-[80px] rounded-full ${config.iconBg} flex items-center justify-center mb-[24px]`}>
          {config.icon}
        </div>

        {/* Title */}
        <h1 className="text-[24px] font-bold tracking-[-0.5px] leading-[30px]">{config.title}</h1>

        {/* Description */}
        {config.description && (
          <p className="text-[14px] text-foreground-secondary mt-[12px] leading-[20px] max-w-[300px]">
            {config.description}
          </p>
        )}

        {/* Transaction detail card for tx-success */}
        {isTxSuccess && (
          <div className="w-full mt-[28px]">
            <div className="bg-secondary rounded-28 px-[20px] py-[18px] text-left">
              <Row label="Số tiền" value="500.000 ₫" highlight />
              <div className="h-[1px] bg-border my-[10px]" />
              <Row label="Người nhận" value="Nguyễn Văn A" />
              <Row label="Ngân hàng" value="Vietcombank" />
              <Row label="Số tài khoản" value="0123 456 789" />
              <div className="h-[1px] bg-border my-[10px]" />
              <Row label="Thời gian" value="11/05/2026 09:41" />
              <Row label="Mã giao dịch" value="VSP202605110941" />
              <Row label="Phương thức" value="Soft OTP" />
            </div>
          </div>
        )}
      </div>

      <div className="min-h-[24px]" />

      <FixedBottom>
        <Button
          variant="primary"
          size="48"
          className="w-full"
          onClick={config.primaryAction}
        >
          {config.primaryLabel}
        </Button>
        {config.secondaryLabel && (
          <button
            onClick={() => router.push("/")}
            className="w-full text-center text-[14px] font-semibold text-brand-secondary py-[12px] mt-[4px]"
          >
            {config.secondaryLabel}
          </button>
        )}
        <div className="flex justify-center pt-[4px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </FixedBottom>
    </div>
  )
}

function Row({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-[4px]">
      <span className="text-[13px] text-foreground-secondary">{label}</span>
      <span className={highlight ? "text-[18px] font-bold tabular-nums" : "text-[14px] font-semibold tabular-nums"}>
        {value}
      </span>
    </div>
  )
}
