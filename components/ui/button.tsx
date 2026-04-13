import * as React from "react"
import { Loader2 } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/*
 * VSP Button Component
 * Figma: [VSP] Button/Brand (node 3549:5585)
 *
 * Figma props → React props:
 *   hierarchy  → variant   (primary | secondary)
 *   type       → intent    (default | danger)
 *   size       → size      (48 | 32)
 *   leftIcon   → leftIcon  (ReactNode)
 *   state      → disabled | isLoading | CSS :active (whilepressing)
 *
 * Figma structure:
 *   Button (container, relative, rounded-full, padding)
 *     └── background (absolute inset-0, shrinks on press via inset-[4.17%_4px] / inset-[6.25%_2px])
 *     └── leftIcon (optional)
 *     └── content > label (text)
 *
 * Whilepressing: background layer shrinks inward (not color change).
 *   size 48: inset 4.17% vertical = 2px, 4px horizontal
 *   size 32: inset 6.25% vertical = 2px, 2px horizontal
 */

/* ── Background layer variants (the inner shrinking layer) ── */
const bgVariants = cva(
  [
    "absolute inset-0 rounded-full",
    "transition-all duration-150",
  ],
  {
    variants: {
      variant: {
        primary: "bg-foreground",
        secondary: "bg-btn-secondary-bg",
        surface: "bg-secondary",
      },
      intent: {
        default: "",
        danger: "",
      },
    },
    compoundVariants: [
      { variant: "primary", intent: "danger", class: "bg-danger" },
      { variant: "secondary", intent: "danger", class: "bg-red-50 dark:bg-red-950" },
    ],
    defaultVariants: { variant: "primary", intent: "default" },
  }
)

/* ── Text color variants ── */
const textVariants = cva("", {
  variants: {
    variant: {
      primary: "text-background",
      secondary: "text-foreground",
      surface: "text-foreground",
    },
    intent: {
      default: "",
      danger: "",
    },
  },
  compoundVariants: [
    { variant: "primary", intent: "danger", class: "text-white" },
    { variant: "secondary", intent: "danger", class: "text-danger dark:text-red-400" },
  ],
  defaultVariants: { variant: "primary", intent: "default" },
})

/* ── Container variants (padding, size, gap — no bg color) ── */
const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center",
    "rounded-full font-semibold whitespace-nowrap",
    "cursor-pointer select-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
    "disabled:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        primary: "",
        secondary: "",
        surface: "",
      },
      intent: {
        default: "",
        danger: "",
      },
      size: {
        // Figma: px=var(--24,24px) py=var(--12,12px) gap=var(--6,6px)
        // No fixed height — height from padding + content
        "48": "px-6 py-3 text-md leading-[24px] gap-1.5",
        // Figma: px=var(--12,12px) py=var(--6,6px) gap=var(--4,4px)
        "32": "px-3 py-1.5 text-sm leading-[20px] gap-1",
      },
    },
    defaultVariants: {
      variant: "primary",
      intent: "default",
      size: "48",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  leftIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      intent,
      size,
      isLoading = false,
      disabled,
      leftIcon,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading

    // Figma gap changes per state:
    // size 48: enabled/disabled-default = 6px, loading = 10px, disabled-danger = 4px
    // size 32: enabled = 4px, loading = 0px
    const gapClass = isLoading
      ? (size === "32" ? "gap-0" : "gap-[10px]")
      : (isDisabled && intent === "danger" && size === "48")
        ? "gap-1"
        : undefined // use default from buttonVariants

    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, intent, size }),
          gapClass,
          isDisabled && "disabled:cursor-default",
          textVariants({ variant, intent }),
          isDisabled && "!text-disabled-fg",
          className,
        )}
        disabled={isDisabled}
        {...props}
      >
        {/* Background layer — shrinks on :active (whilepressing) */}
        <span
          className={cn(
            bgVariants({ variant, intent }),
            isDisabled && "!bg-disabled-bg",
            // Whilepressing shrink: background insets on :active
            // size 48: inset-[4.17%_4px] ≈ 2px vertical, 4px horizontal
            // size 32: inset-[6.25%_2px] ≈ 2px all sides
            !isDisabled && size === "48" && "active:inset-[2px_4px]",
            !isDisabled && size === "32" && "active:inset-[2px]",
          )}
          aria-hidden="true"
        />
        {/* Content layer — above background */}
        {isLoading ? (
          <span className="relative z-10 flex items-center justify-center">
            <Loader2
              className="animate-spin"
              size={size === "32" ? 20 : 24}
            />
          </span>
        ) : (
          <>
            {leftIcon && (
              <span className={cn(
                "relative z-10 shrink-0 flex items-center justify-center",
                size === "48" ? "size-[22px]" : "size-[16px]",
              )}>
                {leftIcon}
              </span>
            )}
            <span className="relative z-10 flex items-center gap-1">
              {children}
            </span>
          </>
        )}
      </button>
    )
  }
)

Button.displayName = "VSP_Button"

export { Button, buttonVariants }
