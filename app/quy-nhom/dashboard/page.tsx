"use client"

import * as React from "react"
import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Eye,
  EyeOff,
  Users,
  UserPlus,
  Settings,
  Crown,
  Wallet,
  PiggyBank,
  ScrollText,
  Filter,
} from "lucide-react"

const MEMBERS = [
  { name: "Huy", avatar: "HK", isAdmin: true, joined: "01/04/2026" },
  { name: "Linh", avatar: "TL", isAdmin: false, joined: "02/04/2026" },
  { name: "Nam", avatar: "VN", isAdmin: false, joined: "03/04/2026" },
  { name: "Trang", avatar: "MT", isAdmin: false, joined: "05/04/2026" },
  { name: "Duy", avatar: "PD", isAdmin: false, joined: "10/04/2026" },
]

const ACTIVITIES = [
  { name: "Huy", action: "góp", amount: "+500.000 ₫", time: "14:30", date: "Hôm nay" },
  { name: "Linh", action: "góp", amount: "+200.000 ₫", time: "09:15", date: "Hôm nay" },
  { name: "Nam", action: "góp", amount: "+300.000 ₫", time: "18:40", date: "Hôm qua" },
  { name: "Trang", action: "góp", amount: "+200.000 ₫", time: "12:00", date: "15/04" },
  { name: "Huy", action: "góp", amount: "+100.000 ₫", time: "10:00", date: "14/04" },
  { name: "Duy", action: "góp", amount: "+150.000 ₫", time: "08:30", date: "13/04" },
]

function DashboardInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const state = searchParams.get("state") ?? "loaded"

  const [balanceHidden, setBalanceHidden] = useState(false)
  const [activeTab, setActiveTab] = useState<"fund" | "members" | "history">("fund")
  const [historyFilter, setHistoryFilter] = useState<"all" | "deposit" | "withdraw">("all")

  const isAdmin = state !== "member-view"
  const goalReached = state === "goal-reached"
  const isEmpty = state === "empty"

  const totalAmount = isEmpty ? 0 : goalReached ? 5000000 : 1200000
  const goalAmount = 5000000
  const progress = totalAmount / goalAmount

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">

      <div className="flex-1 overflow-y-auto pb-[100px]">

        {/* ═══ HERO — light green, only on fund tab ═══ */}
        {activeTab === "fund" && (
          <div
            className="relative text-foreground pb-[32px]"
            style={{ background: "linear-gradient(180deg, #e6f9f1 0%, #d0f4e8 40%, #c2f0e0 100%)" }}
          >
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
            <div className="flex items-center gap-2 pl-[8px] pr-[22px] h-[56px]">
              <button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full">
                <ChevronLeft size={18} />
              </button>
              <span className="flex-1 text-[18px] font-bold">Du lịch Đà Lạt 2026</span>
              {isAdmin && (
                <button onClick={() => router.push("/quy-nhom/settings")} className="p-[10px]"><Settings size={18} className="text-foreground-secondary" /></button>
              )}
            </div>

            {/* Balance */}
            <div className="px-[22px] pt-[16px]">
              <div className="flex items-center gap-[6px] mb-[6px]">
                <span className="text-[13px] text-foreground-secondary">Số dư</span>
                <button onClick={() => setBalanceHidden(!balanceHidden)}>
                  {balanceHidden ? <EyeOff size={14} className="text-foreground-secondary" /> : <Eye size={14} className="text-foreground-secondary" />}
                </button>
              </div>
              <div className="text-[44px] font-black tracking-[-2px] leading-none">
                {balanceHidden ? "••••••••" : totalAmount.toLocaleString("vi-VN")} <span className="text-[24px] font-bold text-foreground/40">₫</span>
              </div>

              {/* Progress */}
              <div className="mt-[24px]">
                <div className="w-full h-[4px] bg-foreground/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-foreground transition-all" style={{ width: `${Math.min(progress * 100, 100)}%` }} />
                </div>
                <div className="flex justify-between mt-[8px]">
                  <span className="text-[13px] text-foreground-secondary">{Math.round(progress * 100)}%</span>
                  <span className="text-[13px] text-foreground-secondary">Mục tiêu {goalAmount.toLocaleString("vi-VN")} ₫</span>
                </div>
              </div>

              {/* Members row */}
              <div className="flex items-center mt-[20px]">
                <div className="flex -space-x-[6px]">
                  {MEMBERS.slice(0, 4).map((m, i) => (
                    <div key={i} className="w-[28px] h-[28px] rounded-full bg-foreground text-background flex items-center justify-center text-[9px] font-bold border-2 border-[#d0f4e8]">
                      {m.avatar}
                    </div>
                  ))}
                  {MEMBERS.length > 4 && (
                    <div className="w-[28px] h-[28px] rounded-full bg-foreground/10 text-foreground-secondary flex items-center justify-center text-[9px] font-semibold border-2 border-[#d0f4e8]">
                      +{MEMBERS.length - 4}
                    </div>
                  )}
                </div>
                <span className="text-[13px] text-foreground-secondary ml-[10px]">{MEMBERS.length} thành viên</span>
                <button onClick={() => router.push("/quy-nhom/moi")} className="ml-auto w-[28px] h-[28px] rounded-full bg-foreground/10 flex items-center justify-center">
                  <Plus size={12} />
                </button>
              </div>

              {goalReached && (
                <div className="mt-[16px] text-[14px] font-semibold text-success">Đã đạt mục tiêu</div>
              )}
            </div>
          </div>
        )}

        {/* ═══ MEMBERS/HISTORY tabs — white bg with own header ═══ */}
        {activeTab !== "fund" && (
          <>
            {/* Status bar white */}
            <div className="h-[54px] px-[22px] flex items-end justify-between pb-[6px]">
              <span className="text-[15px] font-semibold">9:41</span>
              <div className="flex items-center gap-[6px]">
                <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="0.5"/><rect x="4" y="5" width="3" height="7" rx="0.5"/><rect x="8" y="2" width="3" height="10" rx="0.5"/><rect x="12" y="0" width="3" height="12" rx="0.5"/></svg>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="currentColor"/><path d="M4.5 7.5a5 5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M2 5a8 8 0 0 1 12 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                <div className="flex items-center gap-[1px]"><div className="w-[22px] h-[11px] rounded-[3px] border border-current flex items-center p-[1px]"><div className="flex-1 h-full bg-current rounded-[1.5px]"/></div><div className="w-[1px] h-[4px] bg-current opacity-40 rounded-full"/></div>
              </div>
            </div>
            {/* NavBar */}
            <div className="flex items-center gap-2 pl-[8px] pr-[22px] h-[56px]">
              <button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full">
                <ChevronLeft size={18} />
              </button>
              <span className="flex-1 text-[18px] font-bold">Du lịch Đà Lạt 2026</span>
            </div>
          </>
        )}

        {/* ═══ TAB: QUỸ NHÓM ═══ */}
        {activeTab === "fund" && (
          <>
            {/* Actions */}
            <div className="px-[22px] pt-[24px] pb-[8px]">
              <div className="flex gap-[8px]">
                <button onClick={() => router.push("/quy-nhom/gop")} className="flex-1 h-[44px] bg-foreground text-background rounded-full text-[14px] font-semibold">
                  Góp tiền
                </button>
                <button onClick={() => router.push("/quy-nhom/rut")} className="flex-1 h-[44px] bg-secondary text-foreground rounded-full text-[14px] font-semibold">
                  {isAdmin ? "Rút tiền" : "Yêu cầu rút"}
                </button>
              </div>
            </div>

            {/* Recent activity */}
            <div className="pt-[16px]">
              <div className="px-[22px] pb-[12px]">
                <span className="text-[13px] font-semibold text-foreground-secondary uppercase tracking-wide">Hoạt động gần đây</span>
              </div>
              {isEmpty ? (
                <div className="px-[22px] py-[40px] flex flex-col items-center">
                  <div className="w-[56px] h-[56px] rounded-full bg-secondary flex items-center justify-center mb-[14px]">
                    <Clock size={24} className="text-foreground-secondary" />
                  </div>
                  <span className="text-[15px] font-semibold">Chưa có hoạt động</span>
                  <span className="text-[13px] text-foreground-secondary mt-[4px]">Góp tiền để bắt đầu</span>
                </div>
              ) : (
                <div className="px-[22px]">
                  {ACTIVITIES.slice(0, 4).map((a, i) => {
                    const isDeposit = a.action === "góp"
                    return (
                      <div key={i} className="flex items-center gap-[12px] py-[14px]">
                        <div className="w-[36px] h-[36px] rounded-full bg-secondary flex items-center justify-center shrink-0">
                          {isDeposit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[15px] font-semibold">{a.name}</div>
                          <div className="text-[12px] text-foreground-secondary mt-[2px]">{a.time} · {a.date}</div>
                        </div>
                        <span className={`text-[15px] font-semibold ${isDeposit ? "text-success" : "text-foreground"}`}>{a.amount}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* ═══ TAB: THÀNH VIÊN — unique layout ═══ */}
        {activeTab === "members" && (
          <div className="pt-[8px]">
            {/* Invite banner — brand green card */}
            <div className="px-[22px] pb-[20px]">
              <div className="rounded-[20px] p-[18px] flex items-center gap-[14px]" style={{ background: "linear-gradient(135deg, #00b182 0%, #00dda3 100%)" }}>
                <div className="flex-1">
                  <div className="text-[15px] font-bold text-white mb-[4px]">Mời bạn bè</div>
                  <div className="text-[12px] text-white/70">Chia sẻ link hoặc QR để mời tham gia quỹ nhóm</div>
                </div>
                <button onClick={() => router.push("/quy-nhom/moi")} className="h-[36px] px-[16px] bg-white text-foreground rounded-full text-[13px] font-semibold shrink-0">
                  Mời
                </button>
              </div>
            </div>

            {/* Member count */}
            <div className="px-[22px] pb-[12px]">
              <span className="text-[13px] font-semibold text-foreground-secondary uppercase tracking-wide">{MEMBERS.length} thành viên</span>
            </div>

            {/* Member list */}
            <div className="px-[22px]">
              {MEMBERS.map((m, i) => (
                <div key={i} className="flex items-center gap-[14px] py-[14px]">
                  <div className="w-[44px] h-[44px] rounded-full bg-foreground text-background flex items-center justify-center text-[12px] font-bold">
                    {m.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-[6px]">
                      <span className="text-[15px] font-semibold">{m.name}</span>
                      {m.isAdmin && (
                        <span className="text-[10px] font-semibold text-foreground-secondary bg-secondary px-[6px] py-[2px] rounded-full">Admin</span>
                      )}
                    </div>
                    <span className="text-[12px] text-foreground-secondary">Tham gia {m.joined}</span>
                  </div>
                  {isAdmin && !m.isAdmin && (
                    <button className="text-[12px] text-foreground-secondary">
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ TAB: LỊCH SỬ — unique layout with date groups ═══ */}
        {activeTab === "history" && (
          <div className="pt-[8px]">
            {/* Filter row */}
            <div className="px-[22px] pb-[16px] flex items-center gap-[8px]">
              {(["all", "deposit", "withdraw"] as const).map((f) => {
                const isActive = historyFilter === f
                const label = f === "all" ? "Tất cả" : f === "deposit" ? "Góp tiền" : "Rút tiền"
                return (
                  <button
                    key={f}
                    onClick={() => setHistoryFilter(f)}
                    className={`h-[32px] px-[14px] rounded-full text-[12px] font-semibold transition-colors ${
                      isActive ? "bg-foreground text-background" : "bg-secondary text-foreground"
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            {/* Date grouped transactions */}
            {["Hôm nay", "Hôm qua", "15/04", "14/04", "13/04"].map((date) => {
              const items = ACTIVITIES.filter((a) => a.date === date)
              if (items.length === 0) return null
              return (
                <div key={date} className="mb-[8px]">
                  <div className="px-[22px] py-[8px]">
                    <span className="text-[12px] font-semibold text-foreground-secondary">{date}</span>
                  </div>
                  {items.map((a, i) => {
                    const isDeposit = a.action === "góp"
                    return (
                      <div key={i} className="flex items-center gap-[12px] py-[12px] px-[22px]">
                        <div className="w-[36px] h-[36px] rounded-full bg-secondary flex items-center justify-center shrink-0">
                          {isDeposit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[15px] font-semibold">{a.name}</div>
                          <div className="text-[12px] text-foreground-secondary mt-[1px]">{a.time}</div>
                        </div>
                        <span className={`text-[15px] font-semibold ${isDeposit ? "text-success" : "text-foreground"}`}>{a.amount}</span>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )}

      </div>

      {/* ═══ ISLAND BAR ═══ */}
      <div className="fixed bottom-[40px] left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        {/* Shadow wrapper — separate from blur to prevent clip */}
        <div className="rounded-full" style={{ filter: "drop-shadow(0px 4px 20px rgba(0,0,0,0.25))" }}>
        <div
          className="backdrop-blur-[40px] h-[66px] rounded-full flex items-center justify-evenly w-[358px]"
          style={{ background: "rgba(240,240,240,0.85)" }}
        >
          {[
            { label: "Quỹ nhóm", value: "fund" as const, icon: Wallet },
            { label: "Thành viên", value: "members" as const, icon: Users },
            { label: "Lịch sử", value: "history" as const, icon: Clock },
          ].map((tab) => {
            const isActive = activeTab === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className="flex flex-col gap-[4px] items-center justify-center w-[69px]"
              >
                <tab.icon
                  size={24}
                  className={isActive ? "text-foreground" : "text-foreground opacity-40"}
                  strokeWidth={isActive ? 2.2 : 1.5}
                  fill={isActive ? "currentColor" : "none"}
                />
                <span className={`text-[10px] font-semibold ${
                  isActive ? "text-foreground" : "text-foreground opacity-40"
                }`}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>
        </div>
      </div>

      {/* Home indicator */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] h-[21px] flex items-end justify-center pb-[4px] pointer-events-none z-50">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}

export default function QuyNhomDashboard() {
  return (
    <Suspense>
      <DashboardInner />
    </Suspense>
  )
}
