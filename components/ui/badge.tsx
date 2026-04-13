import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/*
 * VSP_Badge
 * Small inline status badge with CVA variants.
 *
 * Tokens:
 *   Default  → bg-secondary, text-foreground
 *   Success  → bg-green-50, text-green-700
 *   Warning  → bg-yellow-50, text-yellow-700
 *   Danger   → bg-red-50, text-danger
 *   Info     → bg-blue-50, text-blue-700
 *   Size     → text-xs font-medium, h-[22px], px-[8px], rounded-full
 */

const badgeVariants = cva(
  [
    "inline-flex items-center justify-center",
    "h-[22px] px-[8px] rounded-full",
    "text-xs font-medium whitespace-nowrap",
  ],
  {
    variants: {
      variant: {
        default: "bg-secondary text-foreground",
        success: "bg-green-50 text-green-700",
        warning: "bg-yellow-50 text-yellow-700",
        danger: "bg-red-50 text-danger",
        info: "bg-blue-50 text-blue-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/* Dot color per variant */
const dotColorMap: Record<string, string> = {
  default: "bg-foreground",
  success: "bg-green-700",
  warning: "bg-yellow-700",
  danger: "bg-danger",
  info: "bg-blue-700",
}

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Show a small dot indicator before the text */
  dot?: boolean
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", dot = false, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "size-[6px] rounded-full shrink-0 mr-[4px]",
              dotColorMap[variant ?? "default"]
            )}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    )
  }
)

Badge.displayName = "VSP_Badge"

export { Badge, badgeVariants }
