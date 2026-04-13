import * as React from "react"
import { cn } from "@/lib/utils"

/*
 * VSP_FixedBottom
 * Container fixed to the bottom of the screen for action buttons.
 *
 * Tokens:
 *   Background  → bg-background
 *   Border      → border-t border-border
 *   Padding     → px-[22px] pt-[12px] pb-[34px] (safe area)
 *   Shadow      → shadow-[0_-4px_12px_rgba(0,0,0,0.05)]
 */

export interface FixedBottomProps extends React.HTMLAttributes<HTMLDivElement> {}

const FixedBottom = React.forwardRef<HTMLDivElement, FixedBottomProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50",
          "bg-background border-t border-border",
          "px-[22px] pt-[12px] pb-[34px]",
          "shadow-[0_-4px_12px_rgba(0,0,0,0.05)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

FixedBottom.displayName = "VSP_FixedBottom"

export { FixedBottom }
