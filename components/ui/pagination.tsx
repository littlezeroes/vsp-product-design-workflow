import * as React from "react"
import { cn } from "@/lib/utils"

/*
 * VSP_Pagination
 * Dot-style pagination indicator for carousels and onboarding flows.
 *
 * Tokens:
 *   Active dot    → 8px circle, bg-foreground
 *   Inactive dot  → 6px circle, bg-grey-300
 *   Gap           → 8px between dots
 *   Transition    → size & color animate
 */

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Total number of dots */
  total: number
  /** Current active index (0-based) */
  current: number
  /** Called when a dot is clicked */
  onChange?: (index: number) => void
}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ total, current, onChange, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center gap-[8px]", className)}
        role="tablist"
        aria-label="Pagination"
        {...props}
      >
        {Array.from({ length: total }, (_, i) => {
          const isActive = i === current
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Page ${i + 1}`}
              onClick={() => onChange?.(i)}
              className={cn(
                "rounded-full shrink-0 transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "size-[8px] bg-foreground"
                  : "size-[6px] bg-grey-300"
              )}
            />
          )
        })}
      </div>
    )
  }
)

Pagination.displayName = "VSP_Pagination"

export { Pagination }
