"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/*
 * VSP_Radio
 * Selection control — radio button (single-select)
 *
 * Figma props → React props:
 *   checked      = true | false
 *   disabled     = true | false
 *
 * Tokens (100% Figma match):
 *   Size                    → 24×24px
 *   Radius                  → rounded-full (circle)
 *   Inner dot size          → 10px
 *
 *   Checked border          → foreground          → var(--foreground)        → #080808 / #ffffff dark
 *   Checked dot             → foreground          → var(--foreground)        → #080808 / #ffffff dark
 *
 *   Unchecked bg            → bg/surface/primary  → var(--background)       → #ffffff / #080808 dark
 *   Unchecked border        → border/bold-primary → var(--border-bold)      → #d4d4d4 / #404040 dark
 *
 *   Disabled bg (all)       → disabled/background → var(--disabled-bg)      → #e5e5e5 / #525252 dark
 *   Disabled border         → border/bold-primary → var(--border-bold)      → #d4d4d4
 *   Disabled dot            → disabled/foreground → var(--disabled-fg)      → #a1a1a1
 */

export interface RadioProps {
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  className?: string
  id?: string
  "aria-label"?: string
}

const Radio = React.forwardRef<HTMLButtonElement, RadioProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      disabled = false,
      onChange,
      className,
      id,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
    const checked =
      controlledChecked !== undefined ? controlledChecked : internalChecked

    const handleClick = () => {
      if (disabled) return
      const next = !checked
      setInternalChecked(next)
      onChange?.(next)
    }

    return (
      <button
        ref={ref}
        id={id}
        type="button"
        role="radio"
        aria-checked={checked}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          // Figma: 24×24px, circle, border 2px
          "w-6 h-6 rounded-full border-2 shrink-0",
          "inline-flex items-center justify-center",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          "disabled:pointer-events-none",
          // Color states
          disabled
            ? "bg-disabled-bg border-border-bold"
            : checked
            ? "bg-background border-foreground"
            : "bg-background border-border-bold",
          className
        )}
      >
        {/* Inner dot — 10px circle */}
        {checked && (
          <span
            className={cn(
              "w-[10px] h-[10px] rounded-full",
              disabled ? "bg-disabled-fg" : "bg-foreground"
            )}
          />
        )}
      </button>
    )
  }
)

Radio.displayName = "VSP_Radio"

export { Radio }
