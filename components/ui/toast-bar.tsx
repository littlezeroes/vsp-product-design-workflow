import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/*
 * VSP_ToastBar
 * Figma: https://www.figma.com/design/m8U2GMl2eptDD5gv9iwXDs/VSP_Core-Components?node-id=5122-14467
 *
 * Figma props → React props:
 *   type = Default | Error | Success
 *
 * Tokens (100% Figma match):
 *   Radius            → 12px
 *   Padding           → 14px all sides
 *   Inner gap         → 12px (gap-3)
 *   Icon size         → 24px
 *   Text gap          → 4px
 *
 *   Default bg        → component/background/toast → var(--toast)     → #262626
 *   Default text      → foreground/white           → #ffffff
 *   Default action    → foreground/success         → var(--success)   → #00b182
 *
 *   Error bg          → decor/background/rose-subtle → bg-rose-50      → #fff1f2
 *   Error title/body  → foreground/primary         → var(--foreground) → #080808
 *
 *   Success bg        → decor/background/green-subtle → bg-green-50    → #e5fcf6
 *   Success title/body→ foreground/primary         → var(--foreground) → #080808
 *
 * Typography:
 *   Title  → sm (14px) / semibold (600) / line-height 20px
 *   Body   → sm (14px) / regular (400) / line-height 20px
 *   Action → sm (14px) / semibold (600) / line-height 20px / color success
 */

const toastBarVariants = cva(
  [
    "w-full flex items-center gap-3",
    "rounded-12 p-[14px]",
  ],
  {
    variants: {
      type: {
        // Default: dark bg, white text
        default: "bg-toast text-background",
        // Error: rose-50 bg (#fff1f2), foreground text
        error: "bg-rose-50 text-foreground dark:bg-rose-950",
        // Success: green-50 bg (#e5fcf6), foreground text
        success: "bg-green-50 text-foreground dark:bg-green-950",
      },
    },
    defaultVariants: {
      type: "default",
    },
  }
)

export interface ToastBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastBarVariants> {
  /** 24px leading icon */
  icon?: React.ReactNode
  /** Bold title line (semibold 600) */
  title?: string
  /** Regular body line (regular 400) */
  body?: string
  /** Inline action label — rendered in success color */
  actionLabel?: string
  onAction?: () => void
  /** Close / dismiss button */
  onClose?: () => void
}

function ToastBar({
  type = "default",
  icon,
  title,
  body,
  actionLabel,
  onAction,
  onClose,
  className,
  ...props
}: ToastBarProps) {
  const isDefault = type === "default"

  return (
    <div className={cn(toastBarVariants({ type }), className)} {...props}>
      {/* Icon — 24px, top-aligned with py-[4px] to align with first text line */}
      {icon && (
        <div className="flex flex-row items-center self-stretch">
          <span className="shrink-0 w-6 h-6 flex items-start justify-center py-[4px]">
            {icon}
          </span>
        </div>
      )}

      {/* Text block — gap-[4px] between title and body */}
      <div className="flex-1 min-w-0 flex flex-col gap-[4px]">
        {title && (
          <span
            className={cn(
              "text-sm font-semibold leading-5",
              isDefault ? "text-background" : "text-foreground"
            )}
          >
            {title}
          </span>
        )}
        {body && (
          <span
            className={cn(
              "text-sm font-normal leading-5",
              isDefault ? "text-background" : "text-foreground"
            )}
          >
            {body}
          </span>
        )}
      </div>

      {/* Action label — always success color */}
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 text-sm font-semibold leading-5 text-success focus-visible:outline-none focus-visible:underline"
        >
          {actionLabel}
        </button>
      )}

      {/* Close button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className={cn(
            "shrink-0 w-5 h-5 flex items-center justify-center",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded",
            isDefault ? "text-background" : "text-foreground"
          )}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}

ToastBar.displayName = "VSP_ToastBar"

export { ToastBar, toastBarVariants }
