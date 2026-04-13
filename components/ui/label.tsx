import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/*
 * VSP_Label
 * Status label — larger than Badge, used for status indicators.
 *
 * Tokens:
 *   Default  → bg-secondary, text-foreground
 *   Success  → bg-green-50, text-green-700
 *   Warning  → bg-yellow-50, text-yellow-700
 *   Danger   → bg-red-50, text-danger
 *   Size     → text-sm font-medium, h-[28px], px-[12px], rounded-8
 */

const labelVariants = cva(
  [
    "inline-flex items-center justify-center",
    "h-[28px] px-[12px] rounded-8",
    "text-sm font-medium whitespace-nowrap",
  ],
  {
    variants: {
      variant: {
        default: "bg-secondary text-foreground",
        success: "bg-green-50 text-green-700",
        warning: "bg-yellow-50 text-yellow-700",
        danger: "bg-red-50 text-danger",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface LabelProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof labelVariants> {}

const Label = React.forwardRef<HTMLSpanElement, LabelProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(labelVariants({ variant }), className)}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Label.displayName = "VSP_Label"

export { Label, labelVariants }
