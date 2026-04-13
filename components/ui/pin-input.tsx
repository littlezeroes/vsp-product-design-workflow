"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/*
 * VSP_PinInput
 * Row of individual digit boxes for PIN / OTP entry.
 *
 * Tokens:
 *   Box size                  → 48x56
 *   Box radius                → 14px
 *   Box border default        → border/primary         → var(--border)              → #e5e5e5
 *   Box border focus          → decor/foreground/green → var(--brand-secondary)     → #00dda3  [1.5px]
 *   Box border error          → border/danger          → var(--danger)              → #eb002b
 *   Box border disabled       → disabled/border        → var(--disabled-border)     → #f5f5f5
 *   Box bg disabled           → bg/surface/secondary   → var(--secondary)           → #f3f3f3
 *
 *   Digit text                → xl / semibold (600) → text-foreground
 *   Secure dot                → • (U+2022) in same style
 *   Disabled text             → text-disabled-fg
 */

export interface PinInputProps {
  /** Number of digit boxes (4 or 6) */
  length: 4 | 6
  /** Controlled value string */
  value?: string
  /** Change handler — returns full string */
  onChange?: (value: string) => void
  /** Error state — all boxes turn danger */
  error?: boolean
  /** Show dots instead of digits for security */
  secure?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Wrapper className */
  className?: string
}

const PinInput = React.forwardRef<HTMLDivElement, PinInputProps>(
  (
    {
      length = 6,
      value = "",
      onChange,
      error,
      secure,
      disabled,
      className,
    },
    ref
  ) => {
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

    const digits = React.useMemo(() => {
      const arr = value.split("").slice(0, length)
      while (arr.length < length) arr.push("")
      return arr
    }, [value, length])

    const focusBox = (index: number) => {
      if (index >= 0 && index < length) {
        inputRefs.current[index]?.focus()
      }
    }

    const updateValue = (index: number, char: string) => {
      const arr = [...digits]
      arr[index] = char
      const newValue = arr.join("")
      onChange?.(newValue)
      return newValue
    }

    const handleInput = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      // Take only the last character typed (handles paste-over)
      const char = raw.replace(/[^0-9]/g, "").slice(-1)
      if (!char) return

      updateValue(index, char)
      // Auto-focus next box
      if (index < length - 1) {
        focusBox(index + 1)
      }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault()
        if (digits[index]) {
          // Clear current box
          updateValue(index, "")
        } else if (index > 0) {
          // Move back and clear previous
          updateValue(index - 1, "")
          focusBox(index - 1)
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault()
        focusBox(index - 1)
      } else if (e.key === "ArrowRight" && index < length - 1) {
        e.preventDefault()
        focusBox(index + 1)
      }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, length)
      if (!pasted) return
      onChange?.(pasted.padEnd(length, "").slice(0, length))
      // Focus the box after last pasted digit
      const focusIndex = Math.min(pasted.length, length - 1)
      focusBox(focusIndex)
    }

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-[8px] justify-center", className)}
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={2}
            disabled={disabled}
            value={secure && digit ? "\u2022" : digit}
            onChange={(e) => handleInput(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={cn(
              "w-[48px] h-[56px] rounded-14 border text-center",
              "text-xl font-semibold text-foreground outline-none",
              "transition-colors duration-150",
              "caret-transparent",
              // Border states (priority: error > focus > default > disabled)
              error
                ? "border-danger"
                : disabled
                ? "border-disabled-border bg-secondary text-disabled-fg cursor-not-allowed"
                : "border-border focus:border-brand-secondary focus:border-[1.5px]"
            )}
            aria-label={`Digit ${index + 1}`}
          />
        ))}
      </div>
    )
  }
)

PinInput.displayName = "VSP_PinInput"

export { PinInput }
