"use client"

import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

/*
 * VSP_Dropdown
 * Select/Dropdown — reuses TextField container pattern.
 *
 * Tokens (100% Figma match):
 *   Container border default  → border/primary         → var(--border)              → #e5e5e5
 *   Container border focus    → decor/foreground/green → var(--brand-secondary)     → #00dda3  [1.5px]
 *   Container border error    → border/danger          → var(--danger)              → #eb002b
 *   Container border disabled → disabled/border        → var(--disabled-border)     → #f5f5f5
 *   Container bg disabled     → bg/surface/secondary   → var(--secondary)           → #f3f3f3
 *   Container height          → 58px
 *   Container radius          → 14px
 *   Container padding         → px-[14px] py-[10px]
 *
 *   Label color               → foreground/secondary   → var(--foreground-secondary)→ #262626
 *   Label font                → xs / regular (400) / line-height 20px
 *   Value text                → sm / medium (500) / line-height 20px → var(--foreground)
 *   Placeholder color         → foreground/tertiary    → #d4d4d4 (grey-300)
 *   Disabled text color       → disabled/foreground    → var(--disabled-fg)         → #a1a1a1
 *   Helptext color (normal)   → foreground/secondary   → var(--foreground-secondary)
 *   Helptext color (error)    → foreground/danger      → var(--danger)
 *
 *   Menu bg                   → bg/surface/primary     → var(--background)
 *   Menu radius               → 14px
 *   Menu item min-height      → 44px
 *   Menu item hover           → bg/surface/secondary   → var(--secondary)
 *   Selected checkmark        → trailing
 */

export interface DropdownOption {
  label: string
  value: string
}

export interface DropdownProps {
  /** Floating label above the value */
  label?: string
  /** List of selectable options */
  options: DropdownOption[]
  /** Currently selected value */
  value?: string
  /** Change handler */
  onChange?: (value: string) => void
  /** Placeholder when no value selected */
  placeholder?: string
  /** Error message — activates error state */
  error?: string
  /** Helper text shown below the field */
  helpText?: string
  /** Disabled state */
  disabled?: boolean
  /** Wrapper className */
  className?: string
}

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      label,
      options,
      value,
      onChange,
      placeholder,
      error,
      helpText,
      disabled,
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    const selectedOption = options.find((o) => o.value === value)

    // Close on outside click
    React.useEffect(() => {
      if (!open) return
      const handler = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setOpen(false)
        }
      }
      document.addEventListener("mousedown", handler)
      return () => document.removeEventListener("mousedown", handler)
    }, [open])

    // Close on Escape
    React.useEffect(() => {
      if (!open) return
      const handler = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false)
      }
      document.addEventListener("keydown", handler)
      return () => document.removeEventListener("keydown", handler)
    }, [open])

    return (
      <div ref={ref} className={cn("w-full relative", className)}>
        <div ref={containerRef}>
          {/* ── Trigger Container ── */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setOpen((prev) => !prev)}
            className={cn(
              "w-full min-h-[58px] rounded-14 border",
              "flex items-center gap-[16px] px-[14px] py-[10px]",
              "transition-colors duration-150 text-left",
              "cursor-pointer",
              // Border states (priority: error > open > default > disabled)
              error
                ? "border-danger"
                : open
                ? "border-brand-secondary border-[1.5px]"
                : disabled
                ? "border-disabled-border bg-secondary cursor-not-allowed"
                : "border-border"
            )}
          >
            {/* Label + value stacked */}
            <div className="flex flex-col flex-1 min-w-0 gap-[2px]">
              {label && (
                <span
                  className={cn(
                    "text-xs font-normal leading-5 shrink-0",
                    error
                      ? "text-danger"
                      : disabled
                      ? "text-disabled-fg"
                      : "text-foreground-secondary"
                  )}
                >
                  {label}
                </span>
              )}
              <span
                className={cn(
                  "text-sm font-medium leading-5 truncate",
                  selectedOption
                    ? disabled
                      ? "text-disabled-fg"
                      : "text-foreground"
                    : "text-grey-300 font-normal"
                )}
              >
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </div>

            {/* Trailing chevron — 16px */}
            <span
              className={cn(
                "shrink-0 w-4 h-4 flex items-center justify-center text-foreground-secondary",
                "transition-transform duration-200",
                open && "rotate-180"
              )}
            >
              <ChevronDown size={16} />
            </span>
          </button>

          {/* ── Dropdown Menu ── */}
          {open && (
            <div
              className={cn(
                "absolute z-50 left-0 right-0 mt-1",
                "bg-background rounded-14 border border-border shadow-lg",
                "overflow-auto max-h-[220px]",
                "animate-in fade-in-0 slide-in-from-top-1 duration-150"
              )}
            >
              {options.map((option) => {
                const isSelected = option.value === value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange?.(option.value)
                      setOpen(false)
                    }}
                    className={cn(
                      "w-full min-h-[44px] px-[14px] flex items-center justify-between",
                      "text-sm text-foreground",
                      "transition-colors duration-100",
                      "hover:bg-secondary cursor-pointer",
                      isSelected && "font-medium"
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
                      <Check
                        size={16}
                        className="shrink-0 ml-2 text-brand-secondary"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Help / error text ── */}
        {(helpText || error) && (
          <p
            className={cn(
              "mt-1 px-[14px] text-xs font-normal leading-5",
              error ? "text-danger" : "text-foreground-secondary"
            )}
          >
            {error ?? helpText}
          </p>
        )}
      </div>
    )
  }
)

Dropdown.displayName = "VSP_Dropdown"

export { Dropdown }
