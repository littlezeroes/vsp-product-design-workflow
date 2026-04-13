"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/*
 * VSP_SpecialTextField
 * TextField with formatted display (currency, phone, card number).
 * Extends the TextField visual pattern.
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
 *   Input font         → sm (14px) / medium (500) / leading-5
 *   Helptext font      → xs (12px) / regular (400) / leading-5
 *
 * Format types:
 *   currency → adds VND suffix, thousand separators (1.000.000)
 *   phone   → +84 prefix, groups (xxx xxx xxxx)
 *   card    → 4-digit groups with spaces (xxxx xxxx xxxx xxxx)
 */

export interface SpecialTextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange"> {
  label?: string
  helpText?: string
  error?: string
  format: "currency" | "phone" | "card"
  /** Custom prefix text (overrides default, e.g. "+84") */
  prefix?: string
  /** Controlled value (raw digits) */
  value?: string
  onChange?: (value: string) => void
  wrapperClassName?: string
}

/* ── Formatting helpers ── */

function formatCurrency(raw: string): string {
  const digits = raw.replace(/\D/g, "")
  if (!digits) return ""
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "")
  if (!digits) return ""
  // Group: xxx xxx xxxx
  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 10)]
  return parts.filter(Boolean).join(" ")
}

function formatCard(raw: string): string {
  const digits = raw.replace(/\D/g, "")
  if (!digits) return ""
  // Group: xxxx xxxx xxxx xxxx
  const groups = digits.match(/.{1,4}/g) || []
  return groups.join(" ")
}

function formatValue(format: "currency" | "phone" | "card", raw: string): string {
  switch (format) {
    case "currency":
      return formatCurrency(raw)
    case "phone":
      return formatPhone(raw)
    case "card":
      return formatCard(raw)
  }
}

function getMaxLength(format: "currency" | "phone" | "card"): number | undefined {
  switch (format) {
    case "phone":
      return 12 // xxx xxx xxxx = 10 digits + 2 spaces
    case "card":
      return 19 // xxxx xxxx xxxx xxxx = 16 digits + 3 spaces
    default:
      return undefined
  }
}

const SpecialTextField = React.forwardRef<HTMLInputElement, SpecialTextFieldProps>(
  (
    {
      label,
      helpText,
      error,
      format,
      prefix: customPrefix,
      value: controlledValue,
      onChange,
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

    const defaultPrefix =
      format === "phone" ? "+84" : format === "currency" ? undefined : undefined
    const displayPrefix = customPrefix ?? defaultPrefix

    const displayValue = controlledValue
      ? formatValue(format, controlledValue)
      : ""

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "")
      onChange?.(raw)
    }

    const suffix = format === "currency" ? "VND" : undefined

    return (
      <div className={cn("w-full", wrapperClassName)}>
        {/* ── Container ── */}
        <div
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
              : "border-border"
          )}
        >
          {/* Prefix text */}
          {displayPrefix && (
            <span className="shrink-0 text-sm font-medium leading-5 text-foreground-secondary">
              {displayPrefix}
            </span>
          )}

          {/* Label + input stacked */}
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
            <input
              ref={ref}
              disabled={disabled}
              inputMode="numeric"
              maxLength={getMaxLength(format)}
              value={displayValue}
              onChange={handleChange}
              onFocus={(e) => {
                setFocused(true)
                onFocus?.(e)
              }}
              onBlur={(e) => {
                setFocused(false)
                onBlur?.(e)
              }}
              className={cn(
                "w-full bg-transparent text-sm font-medium leading-5 text-foreground outline-none",
                "placeholder:text-grey-300 placeholder:font-normal",
                disabled && "cursor-not-allowed text-disabled-fg",
                className
              )}
              {...props}
            />
          </div>

          {/* Suffix text (e.g. VND) */}
          {suffix && (
            <span className="shrink-0 text-sm font-medium leading-5 text-foreground-secondary">
              {suffix}
            </span>
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

SpecialTextField.displayName = "VSP_SpecialTextField"

export { SpecialTextField }
