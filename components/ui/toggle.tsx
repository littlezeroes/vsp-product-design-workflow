"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/*
 * VSP_Toggle
 * Switch / toggle control
 *
 * Figma props → React props:
 *   checked      = true | false  (on/off)
 *   disabled     = true | false
 *
 * Tokens (100% Figma match):
 *   Track size              → 52×32px
 *   Track radius            → rounded-full
 *   Track off               → Grey.200          → var(--border)           → #e5e5e5
 *   Track on                → FG.Primary          → var(--foreground)       → #080808
 *
 *   Thumb size              → 28px circle
 *   Thumb bg                → bg/surface/primary → var(--background)       → #ffffff
 *   Thumb shadow            → 0 2px 4px rgba(0,0,0,0.15)
 *   Thumb off position      → translateX(0)
 *   Thumb on position       → translateX(20px)
 *   Transition              → 200ms ease
 *
 *   Disabled                → opacity 50%
 */

export interface ToggleProps {
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  className?: string
  id?: string
  "aria-label"?: string
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
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
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          // Track: 52×32px, rounded-full
          "w-[52px] h-[32px] rounded-full shrink-0",
          "relative inline-flex items-center",
          "transition-colors duration-200 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          "disabled:pointer-events-none",
          // Track color
          checked ? "bg-foreground" : "bg-border",
          // Disabled
          disabled && "opacity-50",
          className
        )}
      >
        {/* Thumb — 28px circle */}
        <span
          className={cn(
            "w-7 h-7 rounded-full bg-background",
            "absolute left-[2px] top-[2px]",
            "shadow-[0_2px_4px_rgba(0,0,0,0.15)]",
            "transition-transform duration-200 ease-in-out",
            checked && "translate-x-[20px]"
          )}
        />
      </button>
    )
  }
)

Toggle.displayName = "VSP_Toggle"

export { Toggle }
