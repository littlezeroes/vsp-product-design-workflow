"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/*
 * VSP_TextField
 * Figma: https://www.figma.com/design/m8U2GMl2eptDD5gv9iwXDs/VSP_Core-Components?node-id=5256-8737
 *
 * Figma props → React props:
 *   state  = outfocus | focus | typing | filled | filled-disabled
 *   error  = true | false
 *   icon   = true | false  (leadingIcon / trailingIcon slots)
 *   helptext = true | false
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
 *   Label color (floating)    → foreground/secondary   → var(--foreground-secondary)→ #262626
 *   Label font                → xs / regular (400) / line-height 20px
 *   Input text color          → foreground/primary     → var(--foreground)          → #080808
 *   Input font                → sm / medium (500) / line-height 20px
 *   Placeholder color         → foreground/tertiary    → #d4d4d4 (grey-300)
 *   Disabled text color       → disabled/foreground    → var(--disabled-fg)         → #a1a1a1
 *   Helptext color (normal)   → foreground/secondary   → var(--foreground-secondary)→ #262626
 *   Helptext color (error)    → foreground/danger      → var(--danger)              → #eb002b
 *   Helptext font             → xs / regular (400) / line-height 20px
 *
 *   Gap (label → input)       → 2px
 *   Gap (container → helptext)→ 4px
 *   Icon size                 → 24px (leading) / 16px (trailing/clear)
 */

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Floating label above the input */
  label?: string
  /** Helper text shown below the field */
  helpText?: string
  /** Error message — activates error state (overrides helpText) */
  error?: string
  /** 24px leading icon slot */
  leadingIcon?: React.ReactNode
  /** 16px trailing icon slot (clear / reveal) */
  trailingIcon?: React.ReactNode
  /** Wrapper div className */
  wrapperClassName?: string
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      helpText,
      error,
      leadingIcon,
      trailingIcon,
      disabled,
      className,
      wrapperClassName,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false)

    return (
      <div className={cn("w-full", wrapperClassName)}>
        {/* ── Container ── */}
        <div
          className={cn(
            "w-full min-h-[58px] rounded-14 border",
            "flex items-center gap-[16px] px-[14px] py-[10px]",
            "transition-colors duration-150",
            // Border states (priority: error > focus > default > disabled)
            error
              ? "border-danger"
              : focused
              ? "border-brand-secondary border-[1.5px]"
              : disabled
              ? "border-disabled-border bg-secondary"
              : "border-border"
          )}
        >
          {/* Leading icon — 24px */}
          {leadingIcon && (
            <span className="shrink-0 w-6 h-6 flex items-center justify-center text-foreground-secondary">
              {leadingIcon}
            </span>
          )}

          {/* Label + input stacked — gap-[2px] */}
          <div className="flex flex-col flex-1 min-w-0 gap-[2px]">
            {label && (
              <span
                className={cn(
                  // Figma: xs (12px) / regular (400) / line-height 20px
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
            <input
              ref={ref}
              disabled={disabled}
              onFocus={(e) => { setFocused(true); onFocus?.(e) }}
              onBlur={(e) => { setFocused(false); onBlur?.(e) }}
              className={cn(
                // Figma: sm (14px) / medium (500) / line-height 20px
                "w-full bg-transparent text-sm font-medium leading-5 text-foreground outline-none",
                // Figma placeholder: foreground/tertiary = grey-300 = #d4d4d4
                "placeholder:text-grey-300 placeholder:font-normal",
                disabled && "cursor-not-allowed text-disabled-fg",
                className
              )}
              {...props}
            />
          </div>

          {/* Trailing icon — 16px */}
          {trailingIcon && (
            <span className="shrink-0 w-4 h-4 flex items-center justify-center text-foreground-secondary">
              {trailingIcon}
            </span>
          )}
        </div>

        {/* ── Help / error text — gap-[4px] from container ── */}
        {(helpText || error) && (
          <p
            className={cn(
              // Figma: xs (12px) / regular (400) / line-height 20px / px-[14px]
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

TextField.displayName = "VSP_TextField"

export { TextField }
