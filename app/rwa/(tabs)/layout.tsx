"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Building2, Wallet, Home, UserCircle } from "lucide-react"
import { cn } from "@/lib/utils"

/* ── Tab config ────────────────────────────────────────────────────── */
const TABS = [
  { href: "/rwa", label: "Dự án", icon: Building2 },
  { href: "/rwa/tai-san", label: "Portfolio", icon: Wallet },
  { href: "/rwa/bat-dong-san", label: "Bất động sản", icon: Home },
  { href: "/rwa/tai-khoan", label: "Tài khoản", icon: UserCircle },
]

/* ── State config ─────────────────────────────────────────────────── */
export type CardState = "exploring" | "registered" | "escrow" | "pending-alloc" | "received" | "invested"
export type ProjectCardState = "coming-soon" | "open" | "whitelisted" | "committed" | "closed"

export const CARD_STATES: { key: CardState; label: string }[] = [
  { key: "exploring", label: "Sẵn sàng" },
  { key: "registered", label: "Đăng ký" },
  { key: "escrow", label: "Escrow" },
  { key: "pending-alloc", label: "Chờ phân bổ" },
  { key: "received", label: "Nhận token" },
  { key: "invested", label: "Đã đầu tư" },
]

export const PROJECT_STATES: { key: ProjectCardState; label: string }[] = [
  { key: "coming-soon", label: "Sắp mở" },
  { key: "open", label: "Đang mở" },
  { key: "whitelisted", label: "Đã đăng ký" },
  { key: "committed", label: "Đã đặt mua" },
  { key: "closed", label: "Đã đóng" },
]

// Context
interface AppCtx {
  cardState: CardState
  setCardState: (s: CardState) => void
  projectState: ProjectCardState
  setProjectState: (s: ProjectCardState) => void
}

export const AppStateContext = React.createContext<AppCtx>({
  cardState: "exploring", setCardState: () => {},
  projectState: "open", setProjectState: () => {},
})

export function useAppState() {
  return React.useContext(AppStateContext)
}

/* ── Inline state tabs ─────────────────────────────────────────────── */
function StatePills<T extends string>({ label, options, value, onChange }: {
  label: string
  options: { key: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex items-center gap-[6px]">
      <span className="text-[10px] font-medium text-foreground-secondary shrink-0">{label}</span>
      <div className="flex gap-[4px] flex-wrap">
        {options.map((o) => (
          <button key={o.key} type="button" onClick={() => onChange(o.key)}
            className={cn(
              "px-[8px] py-[3px] rounded-full text-[10px] font-semibold transition-colors",
              value === o.key
                ? "bg-foreground text-background"
                : "bg-secondary text-foreground-secondary"
            )}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Layout ────────────────────────────────────────────────────────── */
export default function RwaTabsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [cardState, setCardState] = React.useState<CardState>("exploring")
  const [projectState, setProjectState] = React.useState<ProjectCardState>("open")

  return (
    <AppStateContext.Provider value={{ cardState, setCardState, projectState, setProjectState }}>
    <div className="min-h-screen bg-grey-100 dark:bg-grey-900 flex flex-col items-center">

      {/* ── DEV: State controls — OUTSIDE phone frame ──── */}
      <div className="w-full max-w-[800px] px-[16px] py-[10px] space-y-[6px]">
        <StatePills label="Card:" options={CARD_STATES} value={cardState} onChange={setCardState} />
        <StatePills label="Dự án:" options={PROJECT_STATES} value={projectState} onChange={setProjectState} />
      </div>

      {/* ── Phone frame ──────────────────────────────────── */}
      <div className="relative w-[390px] h-[844px] bg-background text-foreground flex flex-col rounded-[40px] shadow-xl overflow-hidden mt-[16px]">

        {/* ── Status bar ───────────────────────────────────────── */}
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

        {/* ── Title bar ────────────────────────────────────────── */}
        <div className="h-[44px] flex items-center px-[16px]">
          <p className="flex-1 text-center text-[18px] font-bold text-foreground">Tài sản mã hóa</p>
        </div>

        {/* ── Content ──────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto pb-[120px]">
          {children}
        </div>

        {/* ── Floating bottom tab bar ────────────────────────── */}
        <div className="absolute bottom-[28px] inset-x-[16px]">
          <div className="bg-white/60 backdrop-blur-2xl rounded-[20px] px-[8px] py-[8px] flex items-center justify-around shadow-[0_8px_40px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] border border-white/40">
            {TABS.map((tab) => {
              const isActive = tab.href === "/rwa"
                ? pathname === "/rwa"
                : pathname.startsWith(tab.href)
              const Icon = tab.icon
              return (
                <button
                  key={tab.href}
                  type="button"
                  onClick={() => router.push(tab.href)}
                  className={cn(
                    "flex flex-col items-center gap-[3px] py-[6px] px-[10px] rounded-[14px] transition-colors",
                    isActive && "bg-foreground/8"
                  )}
                >
                  <Icon
                    size={20}
                    className={cn(
                      isActive ? "text-foreground" : "text-foreground/40"
                    )}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  <span className={cn(
                    "text-[10px]",
                    isActive
                      ? "font-semibold text-foreground"
                      : "font-medium text-foreground/40"
                  )}>
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>

      </div>
    </div>
    </AppStateContext.Provider>
  )
}
