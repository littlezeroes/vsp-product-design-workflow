"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/*
 * VSP_TextArea
 * Multi-line text input — reuses TextField container pattern.
 *
 * Tokens (100% Figma match — same as TextField):
 *   Container border default  → border/primary         → var(--border)              → #e5e5e5
 *   Container border focus    → decor/foreground/green → var(--brand-secondary)     → #00dda3  [1.5px]
 *   Container border error    → border/danger          → var(--danger)              → #eb002b
 *   Container border disabled → disabled/border        → var(--disabled-border)     → #f5f5f5
 *   Container bg disabled     → bg/surface/secondary   → var(--secondary)           → #f3f3f3
 *   Container min-height      → 120px
 *   Container radius          → 14px
 *   Container padding         → px-[14px] py-[10px]
 *
 *   Label color               → foreground/secondary   → var(--foreground-secondary)→ #262626
 *   Label font                → xs / regular (400) / line-height 20px
 *   Textarea text             → sm / medium (500) / line-height 20px → var(--foreground)
 *   Placeholder color         → foreground/tertiary    → #d4d4d4 (grey-300)
 *   Disabled text color       → disabled/foreground    → var(--disabled-fg)         → #a1a1a1
 *   Helptext color (normal)   → foreground/secondary   → var(--foreground-secondary)
 *   Helptext color (error)    → foreground/danger      → var(--danger)
 *   Character count           → xs / text-foreground-secondary / right-aligned
 */

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  /** Floating label above the textarea */
  label?: string
  /** Helper text shown below the field */
  helpText?: string
  /** Error message — activates error state (overrides helpText) */
  error?: string
  /** Controlled value */
  value?: string
  /** Change handler */
  onChange?: (value: string) => void
  /** Maximum character count (enables counter display) */
  maxLength?: number
  /** Number of visible rows */
  rows?: number
  /** Wrapper div className */
  wrapperClassName?: string
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      helpText,
      error,
      value,
      onChange,
      disabled,
      placeholder,
      maxLength,
      rows = 4,
      className,
      wrapperClassName,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false)
    const charCount = value?.length ?? 0

    return (
      <div className={cn("w-full", wrapperClassName)}>
        {/* ── Container ── */}
        <div
          className={cn(
            "w-full min-h-[120px] rounded-14 border",
            "flex flex-col px-[14px] py-[10px]",
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
          {/* Label */}
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

          {/* Textarea — gap-[2px] from label */}
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={rows}
            className={cn(
              "w-full bg-transparent text-sm font-medium leading-5 text-foreground outline-none",
              "placeholder:text-grey-300 placeholder:font-normal",
              "resize-y mt-[2px]",
              disabled && "cursor-not-allowed text-disabled-fg resize-none",
              className
            )}
            {...props}
          />
        </div>

        {/* ── Footer: help/error text + character count ── */}
        <div className="flex items-start justify-between mt-1 px-[14px]">
          {(helpText || error) ? (
            <p
              className={cn(
                "text-xs font-normal leading-5 flex-1",
                error ? "text-danger" : "text-foreground-secondary"
              )}
            >
              {error ?? helpText}
            </p>
          ) : (
            <span />
          )}

          {maxLength !== undefined && (
            <span className="text-xs font-normal leading-5 text-foreground-secondary shrink-0 ml-2">
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    )
  }
)

TextArea.displayName = "VSP_TextArea"

export { TextArea }
