import * as React from "react"
import { cn } from "@/lib/utils"

/*
 * VSP_Header
 * Figma: https://www.figma.com/design/m8U2GMl2eptDD5gv9iwXDs/VSP_Core-Components?node-id=3922-994
 *
 * Figma props → React props:
 *   state       = "Default" | "Large Title" | "VP_Header"
 *   statusBar   = true | false
 *   searchBar   = true | false
 *   tabs        = true | false
 *   description = true | false  (Large Title only)
 *
 * Structure per state:
 *   Default    → StatusBar + NavBar[title?] + (searchBar?) + (tabs?)
 *   LargeTitle → StatusBar + NavBar[NO title — NavBar is icon-only] + LargeTitleBlock + (searchBar?) + (tabs?)
 *   VP_Header  → VPStatusBar + NavBar[title?] + (searchBar?) + (tabs?)
 *
 * iOS Large Title rule:
 *   In expanded (large-title) state, the NavBar has NO title text.
 *   The page name goes in `largeTitle` (24px bold block below NavBar).
 *   `title` prop is for Default / VP_Header variants only (18px bold in NavBar).
 *   Do NOT pass `title` when using variant="large-title".
 *
 * Tokens (100% Figma match):
 *   Container bg          → bg/surface/primary       → var(--background)          → white
 *
 *   StatusBar height      → 44px (iOS standard) / 54px (VP_Header)
 *
 *   NavBar height         → 56px
 *   NavBar padding        → pl-[14px] pr-[22px]
 *   NavBar gap            → gap-2 (8px)
 *   Back button padding   → p-[10px] / min-h-[44px] / rounded-full
 *   Back icon size        → 18px
 *
 *   Title                 → LEFT-ALIGNED (not centered!) flex-1 fills space
 *   Title font            → 18px / bold (700) / leading-[28px]
 *   Title color           → foreground/primary → var(--foreground) → #080808
 *
 *   SearchBar outer       → gap-[12px] px-[10px] py-[8px]
 *   SearchBar pill        → bg-search / pl-[14px] pr-[12px] py-[8px] / rounded-full / flex-1
 *   SearchBar icon        → 24px
 *   SearchBar gap         → gap-[12px] (between icon & placeholder)
 *   SearchBar placeholder → foreground/secondary → var(--foreground-secondary) → #262626
 *   SearchBar placeholder font → 14px / medium (500) / leading-5
 *   Search action label   → foreground/success → var(--success) → #00b182 / 16px / semibold
 *
 *   LargeTitle block      → px-[22px] pb-[8px] / gap-[8px]
 *   LargeTitle font       → 24px / bold (700) / leading-8 / tracking-[-0.25px]
 *   Description font      → 16px / regular (400) / leading-6
 *   Both color            → foreground/primary → var(--foreground)
 *
 *   TabBar outer          → pl-[22px] pr-[10px] / gap-[16px] / border-b border-border
 *   Tab item gap (inner)  → gap-[4px]
 *   Tab item padding      → py-[12px]
 *   Tab active border     → border-b-[2.5px] / border/brand → var(--foreground) → #080808/#121212
 *   Tab active text       → foreground/primary → var(--foreground) → #080808
 *   Tab inactive text     → foreground/secondary → var(--foreground-secondary) → #262626
 *   Tab font              → 14px / semibold (600) / leading-5
 */

/* ── Status Bar (iOS mock) ───────────────────────────────────────────── */
function StatusBar({ variant = "default" }: { variant?: "default" | "vp" }) {
  const height = variant === "vp" ? "h-[54px]" : "h-[54px]"
  return (
    <div
      className={cn("w-full shrink-0 flex items-center px-6", height)}
      aria-hidden="true"
    >
      {/* Time — left */}
      <span className="text-[17px] font-semibold leading-none text-foreground flex-1">
        9:41
      </span>
      {/* Icons — right: signal + wifi + battery */}
      <div className="flex items-center gap-[6px]">
        {/* Signal bars */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor" className="text-foreground">
          <rect x="0"  y="8"  width="3" height="4" rx="0.5" />
          <rect x="4"  y="5"  width="3" height="7" rx="0.5" />
          <rect x="8"  y="2"  width="3" height="10" rx="0.5" />
          <rect x="12" y="0"  width="3" height="12" rx="0.5" />
        </svg>
        {/* Wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" className="text-foreground">
          <path d="M8 9.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="currentColor"/>
          <path d="M4.5 7.5a5 5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M2 5a8 8 0 0 1 12 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        {/* Battery */}
        <div className="flex items-center gap-[1px]">
          <div className="w-[22px] h-[11px] rounded-3 border border-current flex items-center p-[1px]">
            <div className="flex-1 h-full bg-current rounded-[1.5px]" />
          </div>
          <div className="w-[1px] h-[4px] bg-current opacity-40 rounded-full" />
        </div>
      </div>
    </div>
  )
}

/* ── SearchBar ───────────────────────────────────────────────────────── */
export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string
  actionLabel?: string
  onAction?: () => void
}

function SearchBar({ wrapperClassName, className, actionLabel, onAction, ...props }: SearchBarProps) {
  return (
    /* Outer: px-[10px] py-[8px], gap-[12px] */
    <div className={cn("w-full flex items-center gap-[12px] px-[10px] py-[8px]", wrapperClassName)}>
      {/* Pill: bg-search / pl-[14px] pr-[12px] py-[8px] / rounded-full / gap-[12px] */}
      <div className="flex-1 flex items-center gap-[12px] bg-search rounded-full pl-[14px] pr-[12px] py-[8px]">
        {/* Search icon — 24px */}
        <svg
          width="24" height="24" viewBox="0 0 24 24" fill="none"
          className="shrink-0 text-foreground-secondary"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path d="m16.5 16.5 3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {/* Placeholder / input — 14px / medium (500) / leading-5 / foreground-secondary */}
        <input
          type="search"
          className={cn(
            "flex-1 min-w-0 bg-transparent outline-none",
            "text-sm font-medium leading-5 text-foreground",
            "placeholder:text-foreground-secondary",
            className
          )}
          {...props}
        />
      </div>
      {/* Action label — foreground/success / 16px / semibold */}
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 text-md font-semibold leading-6 text-success focus-visible:outline-none"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

/* ── TabBar ──────────────────────────────────────────────────────────── */
export interface TabItem {
  label: string
  value: string
}

export interface TabBarProps {
  tabs: TabItem[]
  activeTab?: string
  onTabChange?: (value: string) => void
  className?: string
}

function TabBar({ tabs, activeTab, onTabChange, className }: TabBarProps) {
  return (
    /* pl-[22px] pr-[10px] / gap-[16px] / bottom border */
    <div
      className={cn(
        "w-full flex items-center gap-[16px] pl-[22px] pr-[10px]",
        "border-b border-border",
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange?.(tab.value)}
            className={cn(
              /* py-[12px] / gap-[4px] / 14px / semibold / leading-5 */
              "flex items-center gap-[4px] py-[12px]",
              "text-sm font-semibold leading-5 whitespace-nowrap",
              "relative focus-visible:outline-none transition-colors duration-150",
              isActive ? "text-foreground" : "text-foreground-secondary"
            )}
          >
            {tab.label}
            {/* Active indicator: border/brand = var(--foreground) / 2.5px */}
            {isActive && (
              <span className="absolute inset-x-0 bottom-0 h-[2.5px] bg-foreground rounded-t-full" />
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ── Header ──────────────────────────────────────────────────────────── */
export interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "large-title" | "vp-header"
  title?: string
  largeTitle?: string
  /** Description shown below largeTitle (large-title variant) */
  description?: string
  /** Leading slot — rendered inside 44px touch-target back-button wrapper */
  leading?: React.ReactNode
  /** Trailing slot — rendered inside 44px touch-target wrapper */
  trailing?: React.ReactNode
  /** Show search bar */
  showSearch?: boolean
  searchProps?: SearchBarProps
  tabs?: TabItem[]
  activeTab?: string
  onTabChange?: (value: string) => void
  /** Show iOS status bar mock (default: true) */
  showStatusBar?: boolean
}

function Header({
  variant = "default",
  title,
  largeTitle,
  description,
  leading,
  trailing,
  showSearch,
  searchProps,
  tabs,
  activeTab,
  onTabChange,
  showStatusBar = true,
  className,
  ...props
}: HeaderProps) {
  const isVP = variant === "vp-header"
  const isLargeTitle = variant === "large-title"

  return (
    <div className={cn("w-full bg-background flex flex-col", className)} {...props}>

      {/* ── Status bar ── */}
      {showStatusBar && <StatusBar variant={isVP ? "vp" : "default"} />}

      {/* ── Nav bar — h-[56px] / pl-[8px] pr-[22px] / gap-2 (8px) ── */}
      {/* pl-[8px]: optical alignment — ChevronLeft tip aligns with x=22 content below */}
      <div className="flex items-center gap-2 pl-[8px] pr-[22px] h-[56px] shrink-0">

        {/* Back button — consumer provides the 44px touch target */}
        {leading && (
          <div className="shrink-0">
            {leading}
          </div>
        )}

        {/* Title — Default / VP_Header only. Large Title variant uses largeTitle block below. */}
        {title && !isLargeTitle && (
          <div className="flex-1 min-w-0 flex items-center h-[40px]">
            {/* 18px / bold / leading-[28px] / foreground/primary */}
            <p className="text-[18px] font-bold leading-7 text-foreground truncate">
              {title}
            </p>
          </div>
        )}
        {/* Spacer keeps trailing right-aligned when no title in large-title variant */}
        {isLargeTitle && <div className="flex-1" />}

        {/* Trailing — consumer provides the 44px touch target */}
        {trailing && (
          <div className="shrink-0">
            {trailing}
          </div>
        )}
      </div>

      {/* ── Large title block — px-[22px] pb-[8px] / gap-[8px] ── */}
      {isLargeTitle && (largeTitle || description) && (
        <div className="flex flex-col gap-[8px] px-[22px] pb-[8px] shrink-0 text-foreground">
          {largeTitle && (
            /* 24px / bold / leading-8 / tracking-[-0.25px] */
            <p className="text-xl font-bold leading-8 tracking-[-0.016em]">{largeTitle}</p>
          )}
          {description && (
            /* 16px / regular / leading-6 */
            <p className="text-md font-normal leading-6">{description}</p>
          )}
        </div>
      )}

      {/* ── Search bar ── */}
      {showSearch && <SearchBar {...searchProps} />}

      {/* ── Tab bar ── */}
      {tabs && tabs.length > 0 && (
        <TabBar tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
      )}
    </div>
  )
}

Header.displayName = "VSP_Header"

export { Header, SearchBar, TabBar }
