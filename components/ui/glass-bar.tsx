"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/*
 * VSP_GlassBar
 * Bottom navigation floating bar with glassmorphism effect.
 *
 * Tokens (100% Figma match):
 *   Container bg         → background/80 opacity + backdrop-blur-xl
 *   Container radius     → rounded-full
 *   Container shadow     → shadow-lg
 *   Container height     → 64px
 *   Container px         → 20px
 *
 *   Icon size            → 24px
 *   Label font           → text-[10px]
 *   Active color         → foreground/primary → var(--foreground) → #080808
 *   Inactive color       → foreground/secondary → var(--foreground-secondary)
 *   Active dot           → 4px circle, bg-brand-secondary
 */

export interface GlassBarItem {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}

export interface GlassBarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: GlassBarItem[]
  activeItem?: string
  onItemChange?: (value: string) => void
}

function GlassBar({
  items,
  activeItem,
  onItemChange,
  className,
  ...props
}: GlassBarProps) {
  return (
    <div
      className={cn(
        "fixed bottom-[24px] left-1/2 -translate-x-1/2 z-50",
        "h-[64px] bg-background/80 backdrop-blur-xl rounded-full shadow-lg",
        "flex items-center px-[20px]",
        className
      )}
      {...props}
    >
      {items.map((item) => {
        const isActive = item.value === activeItem

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onItemChange?.(item.value)}
            className={cn(
              "flex flex-col items-center justify-center gap-[2px] flex-1 min-w-[56px]",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-8",
              isActive ? "text-foreground" : "text-foreground-secondary"
            )}
          >
            {/* Icon — 24px */}
            <span className="w-6 h-6 flex items-center justify-center">
              {item.icon}
            </span>

            {/* Label — 10px */}
            <span className="text-[10px] font-medium leading-3">
              {item.label}
            </span>

            {/* Active dot indicator — 4px */}
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-brand-secondary" />
            )}
          </button>
        )
      })}
    </div>
  )
}

GlassBar.displayName = "VSP_GlassBar"

export { GlassBar }
