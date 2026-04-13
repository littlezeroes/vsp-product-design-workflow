import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/*
 * InformMessage
 * Figma: https://www.figma.com/design/m8U2GMl2eptDD5gv9iwXDs/VSP_Core-Components?node-id=3667-3587
 *
 * Figma props → React props:
 *   hierarchy = primary | secondary
 *   icon      = true | false
 *   button    = true | false
 *
 * Tokens (100% Figma match):
 *   Radius          → 14px
 *   Padding         → px-[14px] py-[12px]
 *   Inner gap       → 12px (gap-3)
 *   Icon size       → 24px, 4px top offset
 *   Text gap        → 6px
 *
 *   Secondary bg    → background/surface/secondary → var(--secondary)  → #f3f3f3
 *   Primary bg      → decor/background/blue-subtle → bg-blue-50        → #eff6ff
 *
 *   Text color      → foreground/primary           → var(--foreground)  → #080808
 *   Action label    → foreground/success           → var(--success)     → #00b182
 *
 * Typography:
 *   Body   → sm (14px) / regular (400) / line-height 20px
 *   Action → sm (14px) / semibold (600) / line-height 20px / color success
 */

const informMessageVariants = cva(
  [
    "w-full flex items-center gap-3",
    "rounded-14 px-[14px] py-[12px]",
  ],
  {
    variants: {
      hierarchy: {
        // Secondary: neutral grey background
        secondary: "bg-secondary dark:bg-muted",
        // Primary: blue-subtle background
        primary: "bg-blue-50 dark:bg-blue-950",
      },
    },
    defaultVariants: {
      hierarchy: "secondary",
    },
  }
)

export interface InformMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof informMessageVariants> {
  /** 24px leading icon */
  icon?: React.ReactNode
  /** Main message text */
  body: React.ReactNode
  /** Inline action text (success color) */
  actionLabel?: string
  onAction?: () => void
}

function InformMessage({
  hierarchy,
  icon,
  body,
  actionLabel,
  onAction,
  className,
  ...props
}: InformMessageProps) {
  return (
    <div className={cn(informMessageVariants({ hierarchy }), className)} {...props}>
      {/* Icon — 24px, top-aligned with py-[4px] to align with first text line */}
      {icon && (
        <div className="flex flex-row items-center self-stretch">
          <span className="shrink-0 w-6 h-6 flex items-center justify-center py-[4px] text-foreground">
            {icon}
          </span>
        </div>
      )}

      {/* Content — body + action, gap-[6px] */}
      <div className="flex-1 min-w-0 flex flex-col gap-[6px] items-start justify-center">
        {/* Body text — foreground/primary */}
        <span className="text-sm font-normal leading-5 text-foreground">
          {body}
        </span>

        {/* Action label — foreground/success always */}
        {actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className="shrink-0 text-sm font-semibold leading-5 text-success focus-visible:outline-none focus-visible:underline"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}

InformMessage.displayName = "InformMessage"

export { InformMessage, informMessageVariants }
