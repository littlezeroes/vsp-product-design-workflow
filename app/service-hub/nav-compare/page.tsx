"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import {
  CreditCard,
  Home,
  Send,
  Clock,
  User,
  Grid3X3,
} from "lucide-react"

export default function NavCompare() {
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "compare"

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      {/* Status Bar */}
      <div className="h-[54px] px-[22px] flex items-end justify-between pb-[6px]">
        <span className="text-sm font-semibold">9:41</span>
        <div className="flex gap-1">
          <div className="w-4 h-2 bg-foreground rounded-sm" />
          <div className="w-4 h-2 bg-foreground rounded-sm" />
          <div className="w-4 h-2 bg-foreground rounded-sm" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-[22px] pt-[24px]">
        <h1 className="text-[24px] font-bold tracking-[-0.25px] mb-[8px]">
          Bottom Nav
        </h1>
        <p className="text-[14px] text-foreground-secondary mb-[32px]">
          So sánh navigation cũ vs mới. Chỉ đổi 1 tab duy nhất.
        </p>

        {/* OLD Nav */}
        <div className="mb-[32px]">
          <div className="text-[11px] font-bold text-foreground-secondary uppercase tracking-wide mb-[12px]">
            v1.0.8 — Hiện tại
          </div>
          <div className="border border-border rounded-28 overflow-hidden">
            <div className="flex justify-around py-[12px] bg-secondary">
              {[
                { icon: Home, label: "Trang chủ", active: true },
                { icon: Send, label: "Chuyển tiền", active: false, highlight: true },
                { icon: CreditCard, label: "QR", active: false, isCenter: true },
                { icon: Clock, label: "Giao dịch", active: false },
                { icon: User, label: "Tài khoản", active: false },
              ].map((tab) => (
                <div key={tab.label} className="flex flex-col items-center gap-1">
                  {tab.isCenter ? (
                    <div className="w-[40px] h-[40px] rounded-14 bg-foreground flex items-center justify-center">
                      <tab.icon size={18} className="text-background" />
                    </div>
                  ) : (
                    <div
                      className={`w-[24px] h-[24px] rounded-full flex items-center justify-center ${
                        tab.active ? "bg-foreground" : tab.highlight ? "bg-foreground-secondary" : "bg-border"
                      }`}
                    >
                      <tab.icon size={12} className={tab.active || tab.highlight ? "text-background" : "text-foreground-secondary"} />
                    </div>
                  )}
                  <span
                    className={`text-[10px] ${
                      tab.highlight
                        ? "font-bold text-foreground line-through decoration-2"
                        : tab.active
                        ? "font-bold text-foreground"
                        : "text-foreground-secondary"
                    }`}
                  >
                    {tab.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-[16px] py-[10px] bg-background">
              <div className="text-[11px] text-foreground-secondary text-center">
                <span className="font-bold">Chuyển tiền</span> chiếm 1 tab, chỉ phục vụ 1 việc
              </div>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center mb-[24px]">
          <div className="w-[40px] h-[40px] rounded-full bg-foreground flex items-center justify-center">
            <span className="text-background text-lg">↓</span>
          </div>
        </div>

        {/* NEW Nav */}
        <div className="mb-[32px]">
          <div className="text-[11px] font-bold text-foreground-secondary uppercase tracking-wide mb-[12px]">
            v2.0 — Đề xuất 2026
          </div>
          <div className="border-2 border-foreground rounded-28 overflow-hidden">
            <div className="flex justify-around py-[12px] bg-background">
              {[
                { icon: Home, label: "Trang chủ", active: false },
                { icon: Grid3X3, label: "Dịch vụ", active: false, highlight: true },
                { icon: CreditCard, label: "QR", active: false, isCenter: true },
                { icon: Clock, label: "Giao dịch", active: false },
                { icon: User, label: "Tài khoản", active: false },
              ].map((tab) => (
                <div key={tab.label} className="flex flex-col items-center gap-1">
                  {tab.isCenter ? (
                    <div className="w-[40px] h-[40px] rounded-14 bg-foreground flex items-center justify-center">
                      <tab.icon size={18} className="text-background" />
                    </div>
                  ) : (
                    <div
                      className={`w-[24px] h-[24px] rounded-full flex items-center justify-center ${
                        tab.highlight ? "bg-foreground" : "bg-secondary"
                      }`}
                    >
                      <tab.icon size={12} className={tab.highlight ? "text-background" : "text-foreground-secondary"} />
                    </div>
                  )}
                  <span
                    className={`text-[10px] ${
                      tab.highlight ? "font-bold text-foreground" : "text-foreground-secondary"
                    }`}
                  >
                    {tab.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-[16px] py-[10px] bg-secondary">
              <div className="text-[11px] text-foreground-secondary text-center">
                <span className="font-bold">Dịch vụ</span> = hub chứa 60+ features. Scale vô hạn.
              </div>
            </div>
          </div>
        </div>

        {/* What changes */}
        <div className="mb-[32px]">
          <div className="text-[11px] font-bold text-foreground-secondary uppercase tracking-wide mb-[12px]">
            Thay đổi
          </div>
          <div className="flex flex-col gap-[8px]">
            {[
              { label: "Chuyển tiền → Quick Action trên Home", type: "move" },
              { label: "Tab 2 đổi tên: Chuyển tiền → Dịch vụ", type: "change" },
              { label: "3 tab còn lại giữ nguyên 100%", type: "keep" },
              { label: "Feature mới = thêm icon vào grid", type: "add" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-secondary rounded-14 px-[14px] py-[10px]"
              >
                <div
                  className={`w-[24px] h-[24px] rounded-full flex items-center justify-center text-[11px] font-bold ${
                    item.type === "change"
                      ? "bg-foreground text-background"
                      : "bg-border text-foreground-secondary"
                  }`}
                >
                  {item.type === "move"
                    ? "↗"
                    : item.type === "change"
                    ? "★"
                    : item.type === "keep"
                    ? "="
                    : "+"}
                </div>
                <span className="text-[13px] font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Home indicator */}
      <div className="flex justify-center pb-[8px]">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}
