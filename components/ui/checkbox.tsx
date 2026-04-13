"use client"

import * as React from "react"
import { Check, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

/*
 * VSP_Checkbox
 * Figma: https://www.figma.com/design/m8U2GMl2eptDD5gv9iwXDs/VSP_Core-Components?node-id=4608-7076
 *
 * Figma props → React props:
 *   checked      = true | false
 *   type         = Checkmark | Indeterminate
 *   disabled     = true | false
 *
 * Tokens (100% Figma match):
 *   Size                    → 24×24px
 *   Radius                  → radius/rounded-lg → 8px
 *   Inner icon size         → 18px
 *   Padding (checked)       → 4px (gap-1)
 *
 *   Checked bg (enabled)    → bg/contextual/brand  → var(--primary)          → #1f1f1f / #ffffff dark
 *   Checked border          → bg/contextual/brand  → var(--primary)          → #1f1f1f / #ffffff dark
 *   Checked icon            → foreground/inverse   → var(--primary-foreground)→ #ffffff / #080808 dark
 *
 *   Unchecked bg            → bg/surface/primary   → var(--background)       → #ffffff / #080808 dark
 *   Unchecked border        → border/bold-primary  → var(--border-bold)      → #d4d4d4 / #404040 dark
 *
 *   Disabled bg (all)       → disabled/background  → var(--disabled-bg)      → #e5e5e5 / #525252 dark
 *   Disabled border         → border/bold-primary  → var(--border-bold)      → #d4d4d4
 *   Disabled icon           → disabled/foreground  → var(--disabled-fg)      → #a1a1a1
 */

export interface CheckboxProps {
  checked?: boolean
  defaultChecked?: boolean
  /** Renders minus icon instead of checkmark */
  indeterminate?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  className?: string
  id?: string
  "aria-label"?: string
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      indeterminate = false,
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
    const isActive = checked || indeterminate

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
        role="checkbox"
        aria-checked={indeterminate ? "mixed" : checked}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          // Figma: 24×24px, radius 8px
          "w-6 h-6 rounded-8 border shrink-0",
          "inline-flex items-center justify-center p-[4px]",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          "disabled:pointer-events-none",
          // Color states
          disabled
            ? "bg-disabled-bg border-border-bold"
            : isActive
            ? "bg-primary border-primary"
            : "bg-background border-border-bold",
          className
        )}
      >
        {/* Inner icon — 18px (Figma spec, use size=18) */}
        {indeterminate ? (
          <Minus
            size={18}
            className={disabled ? "text-disabled-fg" : "text-primary-foreground"}
            strokeWidth={2.5}
          />
        ) : checked ? (
          <Check
            size={18}
            className={disabled ? "text-disabled-fg" : "text-primary-foreground"}
            strokeWidth={2.5}
          />
        ) : null}
      </button>
    )
  }
)

Checkbox.displayName = "VSP_Checkbox"

export { Checkbox }
