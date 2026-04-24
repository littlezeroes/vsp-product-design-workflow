"use client"

import * as React from "react"
import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronLeft, Plus, Users, PiggyBank } from "lucide-react"

interface Fund {
  id: string
  name: string
  avatar: string
  balance: number
  goal: number
  members: string[]
  lastActivity: string
  accent: string
}

const FUNDS: Fund[] = [
  {
    id: "dalat",
    name: "Du lịch Đà Lạt 2026",
    avatar: "🏔️",
    balance: 1200000,
    goal: 5000000,
    members: ["HK", "TL", "VN", "MT", "PD"],
    lastActivity: "Huy góp 500.000 ₫ · 2 giờ trước",
    accent: "#c2f0e0",
  },
  {
    id: "lop12a1",
    name: "Quỹ lớp 12A1",
    avatar: "🎓",
    balance: 3400000,
    goal: 10000000,
    members: ["HK", "AN", "BT", "CD"],
    lastActivity: "Trang góp 200.000 ₫ · hôm qua",
    accent: "#e3e8ff",
  },
  {
    id: "sinh-nhat",
    name: "Sinh nhật Mẹ",
    avatar: "🎂",
    balance: 800000,
    goal: 2000000,
    members: ["HK", "TL"],
    lastActivity: "Tạo quỹ · 3 ngày trước",
    accent: "#fde7c8",
  },
]

function ListInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const state = searchParams.get("state") ?? "default"
  const isEmpty = state === "empty"
  const isLoading = state === "loading"

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

      {/* NavBar — icon only (large-title pattern) */}
      <div className="flex items-center gap-2 pl-[8px] pr-[10px] h-[56px]">
        <button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full">
          <ChevronLeft size={18} />
        </button>
        <span className="flex-1" />
        <button
          onClick={() => router.push("/quy-nhom/tao")}
          className="w-[40px] h-[40px] rounded-full bg-secondary flex items-center justify-center"
          aria-label="Tạo quỹ mới"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Large title */}
      <div className="px-[22px] pb-[8px]">
        <h1 className="text-[34px] font-black tracking-[-1px] leading-[40px]">Quỹ nhóm</h1>
        <p className="text-[14px] text-foreground-secondary mt-[4px]">
          {isEmpty ? "Tạo quỹ đầu tiên để cùng bạn bè tiết kiệm" : `${FUNDS.length} quỹ đang hoạt động`}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pb-[120px]">
        {/* ═══ LOADING ═══ */}
        {isLoading && (
          <div className="px-[22px] pt-[16px] space-y-[12px]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[112px] rounded-28 bg-secondary animate-pulse" />
            ))}
          </div>
        )}

        {/* ═══ EMPTY ═══ */}
        {isEmpty && (
          <div className="px-[22px] pt-[48px] flex flex-col items-center text-center">
            <div className="w-[96px] h-[96px] rounded-full bg-secondary flex items-center justify-center mb-[20px]">
              <PiggyBank size={40} className="text-foreground-secondary" strokeWidth={1.5} />
            </div>
            <div className="text-[18px] font-bold mb-[6px]">Chưa có quỹ nào</div>
            <div className="text-[14px] text-foreground-secondary max-w-[280px] mb-[24px]">
              Tạo quỹ nhóm để cùng bạn bè, gia đình góp tiền cho chuyến đi, bữa tiệc, hay mục tiêu chung
            </div>
          </div>
        )}

        {/* ═══ DEFAULT — fund cards ═══ */}
        {!isEmpty && !isLoading && (
          <div className="px-[22px] pt-[16px] space-y-[12px]">
            {FUNDS.map((fund) => {
              const progress = Math.min(fund.balance / fund.goal, 1)
              return (
                <button
                  key={fund.id}
                  onClick={() => router.push("/quy-nhom/dashboard")}
                  className="w-full text-left rounded-28 p-[18px] active:scale-[0.99] transition-transform"
                  style={{ background: fund.accent }}
                >
                  {/* Top row: avatar + name */}
                  <div className="flex items-center gap-[12px] mb-[14px]">
                    <div className="w-[40px] h-[40px] rounded-14 bg-background/70 flex items-center justify-center text-[22px] shrink-0">
                      {fund.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] font-bold truncate">{fund.name}</div>
                      <div className="text-[11px] text-foreground/60 truncate">{fund.lastActivity}</div>
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="text-[24px] font-black tracking-[-0.5px] leading-none">
                    {fund.balance.toLocaleString("vi-VN")} <span className="text-[14px] font-bold text-foreground/40">₫</span>
                  </div>

                  {/* Progress */}
                  <div className="mt-[10px] flex items-center gap-[10px]">
                    <div className="flex-1 h-[4px] bg-foreground/10 rounded-full overflow-hidden">
                      <div className="h-full bg-foreground rounded-full" style={{ width: `${progress * 100}%` }} />
                    </div>
                    <span className="text-[11px] text-foreground/60 shrink-0">{Math.round(progress * 100)}%</span>
                  </div>

                  {/* Members */}
                  <div className="flex items-center mt-[14px]">
                    <div className="flex -space-x-[5px]">
                      {fund.members.slice(0, 4).map((m, i) => (
                        <div
                          key={i}
                          className="w-[22px] h-[22px] rounded-full bg-foreground text-background flex items-center justify-center text-[8px] font-bold border-2"
                          style={{ borderColor: fund.accent }}
                        >
                          {m}
                        </div>
                      ))}
                      {fund.members.length > 4 && (
                        <div
                          className="w-[22px] h-[22px] rounded-full bg-foreground/10 text-foreground/70 flex items-center justify-center text-[8px] font-bold border-2"
                          style={{ borderColor: fund.accent }}
                        >
                          +{fund.members.length - 4}
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] text-foreground/60 ml-[8px]">{fund.members.length} thành viên</span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="fixed bottom-[24px] left-1/2 -translate-x-1/2 z-40 w-[358px] max-w-[calc(100%-32px)]">
        <button
          onClick={() => router.push("/quy-nhom/tao")}
          className="w-full h-[56px] bg-foreground text-background rounded-full text-[15px] font-bold flex items-center justify-center gap-[8px] shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
        >
          <Plus size={18} strokeWidth={2.5} />
          Tạo quỹ nhóm
        </button>
      </div>

      {/* Home indicator */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] h-[21px] flex items-end justify-center pb-[4px] pointer-events-none z-50">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}

export default function QuyNhomList() {
  return (
    <Suspense>
      <ListInner />
    </Suspense>
  )
}
