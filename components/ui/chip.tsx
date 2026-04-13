"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/*
 * VSP_Chip
 * Compact selection / filter element
 *
 * Figma props → React props:
 *   variant      = filled | outline
 *   size         = sm (28h) | md (36h)
 *   selected     = true | false
 *   icon         = ReactNode (leading)
 *   onClose      = callback (shows close icon)
 *
 * Tokens (100% Figma match):
 *   Radius                  → rounded-full
 *   Font                    → text-sm font-medium
 *   Padding                 → px-3 (12px)
 *
 *   Filled default          → bg-secondary, text-foreground
 *   Filled selected         → bg-foreground, text-background (inverted)
 *
 *   Outline default         → border border-border, bg-transparent, text-foreground
 *   Outline selected        → border-foreground, bg-foreground, text-background (inverted)
 */

const chipVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5",
    "rounded-full px-3 text-sm font-medium",
    "cursor-pointer select-none shrink-0",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
  ],
  {
    variants: {
      variant: {
        filled: "",
        outline: "border",
      },
      size: {
        sm: "h-7",
        md: "h-9",
      },
      selected: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      // Filled — default
      { variant: "filled", selected: false, class: "bg-secondary text-foreground" },
      // Filled — selected (inverted)
      { variant: "filled", selected: true, class: "bg-foreground text-background" },
      // Outline — default
      { variant: "outline", selected: false, class: "border-border bg-transparent text-foreground" },
      // Outline — selected (inverted)
      { variant: "outline", selected: true, class: "border-foreground bg-foreground text-background" },
    ],
    defaultVariants: {
      variant: "filled",
      size: "md",
      selected: false,
    },
  }
)

export interface ChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    Omit<VariantProps<typeof chipVariants>, "selected"> {
  selected?: boolean
  /** Leading icon slot */
  icon?: React.ReactNode
  /** Shows close (X) icon and fires callback */
  onClose?: () => void
  /** Alias for onClick — press handler */
  onPress?: () => void
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      className,
      variant,
      size,
      selected = false,
      icon,
      onClose,
      onPress,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e)
      onPress?.()
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        className={cn(chipVariants({ variant, size, selected }), className)}
        {...props}
      >
        {/* Leading icon */}
        {icon && (
          <span className="shrink-0 flex items-center justify-center size-4">
            {icon}
          </span>
        )}

        {/* Label */}
        <span>{children}</span>

        {/* Close icon */}
        {onClose && (
          <span
            role="button"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="shrink-0 flex items-center justify-center size-4 cursor-pointer"
          >
            <X size={14} strokeWidth={2.5} />
          </span>
        )}
      </button>
    )
  }
)

Chip.displayName = "VSP_Chip"

export { Chip, chipVariants }
