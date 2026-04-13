"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

/*
 * VSP_Terms
 * Terms and conditions text block with optional checkbox variant.
 *
 * Tokens (100% Figma match):
 *   Text font         → xs (12px) / regular (400) / leading-5 (20px)
 *   Text color        → foreground/secondary → var(--foreground-secondary) → #262626
 *   Link color        → foreground/primary → var(--foreground) → #080808
 *   Link weight       → medium (500) + underline
 *
 *   Checkbox gap      → 12px (gap-3)
 *   Checkbox size     → 24px (from VSP_Checkbox)
 */

export interface TermsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  children: React.ReactNode
  /** Show checkbox variant */
  withCheckbox?: boolean
  /** Checkbox checked state */
  checked?: boolean
  /** Checkbox change handler */
  onChange?: (checked: boolean) => void
}

function Terms({
  children,
  withCheckbox = false,
  checked,
  onChange,
  className,
  ...props
}: TermsProps) {
  if (withCheckbox) {
    return (
      <div
        className={cn("flex items-start gap-3", className)}
        {...props}
      >
        <Checkbox
          checked={checked}
          onChange={onChange}
          className="mt-[2px] shrink-0"
        />
        <div className="text-xs font-normal leading-5 text-foreground-secondary [&_a]:text-foreground [&_a]:font-medium [&_a]:underline">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "text-xs font-normal leading-5 text-foreground-secondary",
        "[&_a]:text-foreground [&_a]:font-medium [&_a]:underline",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

Terms.displayName = "VSP_Terms"

export { Terms }
