"use client"

import * as React from "react"
import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

/*
 * VSP_DateField
 * Date input field using TextField visual pattern.
 *
 * Tokens (100% Figma match — same as VSP_TextField):
 *   Container height   → 58px
 *   Container radius   → 14px
 *   Container padding  → px-[14px] py-[10px]
 *   Container border   → border/primary → var(--border) → #e5e5e5
 *   Focus border       → brand-secondary → var(--brand-secondary) [1.5px]
 *   Error border       → danger → var(--danger)
 *   Disabled bg        → secondary → var(--secondary)
 *
 *   Label font         → xs (12px) / regular (400) / leading-5
 *   Value font         → sm (14px) / medium (500) / leading-5
 *   Helptext font      → xs (12px) / regular (400) / leading-5
 *
 *   Trailing icon      → Calendar, 20px, foreground-secondary
 *   Display format     → DD/MM/YYYY
 */

export interface DateFieldProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  label?: string
  /** Date value */
  value?: Date
  /** Change handler */
  onChange?: (date: Date | undefined) => void
  /** Minimum date */
  min?: Date
  /** Maximum date */
  max?: Date
  /** Error message */
  error?: string
  /** Help text below field */
  helpText?: string
  disabled?: boolean
  /** Wrapper className */
  wrapperClassName?: string
}

/** Format Date to DD/MM/YYYY */
function formatDateDisplay(date?: Date): string {
  if (!date) return ""
  const dd = String(date.getDate()).padStart(2, "0")
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const yyyy = date.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

/** Format Date to YYYY-MM-DD for native input */
function toNativeValue(date?: Date): string {
  if (!date) return ""
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

const DateField = React.forwardRef<HTMLInputElement, DateFieldProps>(
  (
    {
      label,
      value,
      onChange,
      min,
      max,
      error,
      helpText,
      disabled,
      className,
      wrapperClassName,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [focused, setFocused] = React.useState(false)

    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      if (!val) {
        onChange?.(undefined)
        return
      }
      const parsed = new Date(val + "T00:00:00")
      if (!isNaN(parsed.getTime())) {
        onChange?.(parsed)
      }
    }

    const handleContainerClick = () => {
      if (!disabled) {
        try {
          inputRef.current?.showPicker()
        } catch {
          inputRef.current?.focus()
        }
      }
    }

    return (
      <div className={cn("w-full", wrapperClassName)} {...props}>
        {/* ── Container ── */}
        <div
          role="button"
          tabIndex={-1}
          onClick={handleContainerClick}
          className={cn(
            "w-full min-h-[58px] rounded-14 border",
            "flex items-center gap-[16px] px-[14px] py-[10px]",
            "transition-colors duration-150",
            error
              ? "border-danger"
              : focused
              ? "border-brand-secondary border-[1.5px]"
              : disabled
              ? "border-disabled-border bg-secondary"
              : "border-border",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
            className
          )}
        >
          {/* Label + display value stacked */}
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
                "text-sm font-medium leading-5",
                value ? "text-foreground" : "text-grey-300",
                disabled && "text-disabled-fg"
              )}
            >
              {value ? formatDateDisplay(value) : "DD/MM/YYYY"}
            </span>

            {/* Hidden native date input */}
            <input
              ref={inputRef}
              type="date"
              value={toNativeValue(value)}
              min={min ? toNativeValue(min) : undefined}
              max={max ? toNativeValue(max) : undefined}
              onChange={handleNativeChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              disabled={disabled}
              className="sr-only"
              tabIndex={-1}
            />
          </div>

          {/* Trailing icon — Calendar 20px */}
          <Calendar
            size={20}
            className={cn(
              "shrink-0",
              disabled ? "text-disabled-fg" : "text-foreground-secondary"
            )}
          />
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

DateField.displayName = "VSP_DateField"

export { DateField }
