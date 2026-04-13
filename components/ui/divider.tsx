import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/*
 * VSP_Divider
 * Horizontal line separator with optional centered label.
 *
 * Tokens (100% Figma match):
 *   Line height       → 1px
 *   Line color        → border/primary → var(--border) → #e5e5e5
 *   Label font        → xs (12px) / regular (400)
 *   Label color       → foreground/secondary → var(--foreground-secondary)
 *   Label bg          → bg/surface/primary → var(--background) → #ffffff
 *   Label px          → 8px
 */

const dividerVariants = cva("w-full", {
  variants: {
    variant: {
      full: "",
      inset: "px-[16px]",
    },
  },
  defaultVariants: {
    variant: "full",
  },
})

export interface DividerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dividerVariants> {
  /** Centered label text */
  label?: string
}

function Divider({ variant, label, className, ...props }: DividerProps) {
  if (label) {
    return (
      <div
        className={cn(
          dividerVariants({ variant }),
          "relative flex items-center",
          className
        )}
        {...props}
      >
        <div className="flex-1 h-[1px] bg-border" />
        <span className="shrink-0 px-[8px] text-xs font-normal text-foreground-secondary bg-background">
          {label}
        </span>
        <div className="flex-1 h-[1px] bg-border" />
      </div>
    )
  }

  return (
    <div
      className={cn(dividerVariants({ variant }), className)}
      {...props}
    >
      <div className="h-[1px] bg-border" />
    </div>
  )
}

Divider.displayName = "VSP_Divider"

export { Divider, dividerVariants }
