import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/*
 * VSP_Skeleton
 * Loading placeholder with pulse animation.
 *
 * Tokens (100% Figma match):
 *   Background        → bg/surface/secondary → var(--secondary) → #f3f3f3
 *   Animation         → animate-pulse (Tailwind default)
 *
 *   text variant      → h-[16px] rounded-8
 *   circle variant    → rounded-full
 *   rect variant      → rounded-14
 *   card variant      → rounded-28
 */

const skeletonVariants = cva("bg-secondary animate-pulse", {
  variants: {
    variant: {
      text: "h-[16px] rounded-8",
      circle: "rounded-full",
      rect: "rounded-14",
      card: "rounded-28",
    },
  },
  defaultVariants: {
    variant: "text",
  },
})

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  /** Width — CSS value or Tailwind class */
  width?: string | number
  /** Height — CSS value or Tailwind class */
  height?: string | number
}

function Skeleton({
  variant,
  width,
  height,
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant }), className)}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  )
}

Skeleton.displayName = "VSP_Skeleton"

export { Skeleton, skeletonVariants }
