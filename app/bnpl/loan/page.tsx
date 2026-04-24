"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, Check, Clock, AlertCircle } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import { FixedBottom } from "@/components/ui/fixed-bottom"

/**
 * S10: Chi tiết khoản vay + Schedule timeline
 * States: default, overdue, completed
 */

type Status = "paid" | "current" | "upcoming" | "overdue"

function formatVnd(n: number) {
  return Math.round(n).toLocaleString("vi-VN")
}

export default function LoanDetailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "default"
  const loanId = searchParams.get("id") ?? "L1"

  const isOverdue = state === "overdue"
  const isCompleted = state === "completed"

  const principal = 3_600_000
  const perMonth = 308_000
  const totalMonths = 12
  const paidCount = isCompleted ? 12 : isOverdue ? 3 : 4

  const schedule: { idx: number; date: string; amount: number; status: Status }[] = Array.from(
    { length: totalMonths },
    (_, i) => {
      const date = new Date(2026, 0 + i + 1, 20)
      const label = `${date.getDate()}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`
      let status: Status = "upcoming"
      if (i < paidCount) status = "paid"
      else if (i === paidCount) status = isOverdue ? "overdue" : "current"
      return { idx: i + 1, date: label, amount: perMonth, status }
    }
  )

  const totalPaid = paidCount * perMonth
  const remaining = principal - totalPaid
  const pct = paidCount / totalMonths

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header
        variant="large-title"
        largeTitle="Chi tiết khoản vay"
        leading={
          <button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full">
            <ChevronLeft size={18} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto pb-[240px]">
        {/* Merchant header */}
        <div className="px-[22px] pt-[16px]">
          <div className="bg-secondary rounded-28 px-[16px] py-[20px]">
            <div className="flex items-center gap-[12px] mb-[16px]">
              <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shrink-0">
                <span className="text-md font-bold text-foreground">VM</span>
              </div>
              <div className="flex-1">
                <p className="text-md font-semibold leading-6 text-foreground">VinMec</p>
                <p className="text-xs leading-4 text-foreground-secondary">Mã khoản vay · {loanId}</p>
              </div>
            </div>

            <div className="flex items-end justify-between mb-[12px]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">Còn phải trả</p>
                <p className="text-[28px] font-bold leading-9 tracking-[-0.016em] text-foreground mt-[2px]">
                  {formatVnd(remaining)} ₫
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs leading-4 text-foreground-secondary">Đã trả</p>
                <p className="text-sm font-semibold leading-5 text-foreground">{paidCount}/{totalMonths} kỳ</p>
              </div>
            </div>

            <div className="h-[6px] rounded-full bg-background overflow-hidden">
              <div
                className={`h-full ${isOverdue ? "bg-danger" : "bg-foreground"}`}
                style={{ width: `${pct * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Key info */}
        <div className="px-[22px] pt-[24px]">
          {[
            ["Tiền gốc gốc ban đầu", formatVnd(principal) + " ₫"],
            ["Kỳ hạn", `${totalMonths} tháng`],
            ["Lãi suất", "1.5% / tháng"],
            ["Ngày cấp", "15/01/2026"],
            ["Ngày đáo hạn", "20/12/2026"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-[10px] border-b border-border last:border-b-0">
              <span className="text-sm leading-5 text-foreground-secondary">{k}</span>
              <span className="text-sm font-semibold leading-5 text-foreground">{v}</span>
            </div>
          ))}
        </div>

        {/* Schedule timeline */}
        <div className="pt-[32px]">
          <div className="px-[22px] pt-[24px] pb-[12px]">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
              Lịch trả nợ
            </p>
          </div>
          <div className="px-[22px]">
            {schedule.map((s, i) => {
              const isLast = i === schedule.length - 1
              return (
                <div key={s.idx} className="flex items-start gap-[14px]">
                  {/* Timeline dot + line */}
                  <div className="flex flex-col items-center shrink-0" style={{ minHeight: isLast ? 48 : 56 }}>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center mt-[8px] ${
                        s.status === "paid"
                          ? "bg-success"
                          : s.status === "current"
                          ? "bg-foreground"
                          : s.status === "overdue"
                          ? "bg-danger"
                          : "bg-secondary border border-border"
                      }`}
                    >
                      {s.status === "paid" && <Check size={14} className="text-background" strokeWidth={3} />}
                      {s.status === "current" && <Clock size={12} className="text-background" />}
                      {s.status === "overdue" && <AlertCircle size={14} className="text-white" />}
                    </div>
                    {!isLast && <div className="flex-1 w-[2px] bg-border" />}
                  </div>

                  {/* Row content */}
                  <div className={`flex-1 flex items-center justify-between py-[12px] ${!isLast ? "border-b border-border" : ""}`}>
                    <div>
                      <p className={`text-sm font-semibold leading-5 ${s.status === "overdue" ? "text-danger" : "text-foreground"}`}>
                        Kỳ {s.idx}
                      </p>
                      <p className="text-xs leading-4 text-foreground-secondary mt-[2px]">
                        {s.date} · {s.status === "paid" ? "Đã trả" : s.status === "current" ? "Hạn kế" : s.status === "overdue" ? "Trễ hạn" : "Sắp tới"}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-semibold leading-5 ${
                        s.status === "paid"
                          ? "text-foreground-secondary line-through"
                          : s.status === "overdue"
                          ? "text-danger"
                          : "text-foreground"
                      }`}
                    >
                      {formatVnd(s.amount)} ₫
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <FixedBottom>
        {isCompleted ? (
          <Button variant="secondary" size="48" className="w-full" onClick={() => router.back()}>
            Đã hoàn tất
          </Button>
        ) : (
          <Button variant="primary" size="48" className="w-full" onClick={() => router.push(`/bnpl/repay?id=${loanId}`)}>
            Trả {formatVnd(perMonth)} ₫ ngay
          </Button>
        )}
        <div className="flex justify-center pt-[8px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </FixedBottom>
    </div>
  )
}
