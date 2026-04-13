import * as React from "react"
import { cn } from "@/lib/utils"

/*
 * VSP_Tab
 * Standalone horizontal scrollable tab bar component.
 *
 * Tokens:
 *   Container         → border-b border-border
 *   Tab item          → text-sm font-medium, min-h-[44px], px-[16px]
 *   Active text       → text-foreground, border-b-2 border-foreground
 *   Inactive text     → text-foreground-secondary
 *   Indicator         → transition-all animated underline
 */

export interface TabItem {
  label: string
  value: string
}

export interface TabProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: TabItem[]
  activeTab?: string
  onTabChange?: (value: string) => void
}

const Tab = React.forwardRef<HTMLDivElement, TabProps>(
  ({ tabs, activeTab, onTabChange, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full overflow-x-auto border-b border-border",
          className
        )}
        role="tablist"
        {...props}
      >
        <div className="flex items-center">
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
                  "relative min-h-[44px] px-[16px]",
                  "text-sm font-medium whitespace-nowrap",
                  "focus-visible:outline-none transition-all duration-200",
                  isActive
                    ? "text-foreground"
                    : "text-foreground-secondary"
                )}
              >
                {tab.label}
                {/* Active underline indicator */}
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-[2px] bg-foreground rounded-t-full transition-all duration-200" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }
)

Tab.displayName = "VSP_Tab"

export { Tab }
