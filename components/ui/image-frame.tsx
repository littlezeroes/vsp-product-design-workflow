"use client"

import * as React from "react"
import { ImageOff } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/*
 * VSP_ImageFrame
 * Image display component with loading state and aspect ratio variants.
 *
 * Tokens (100% Figma match):
 *   Container bg      → bg/surface/secondary → var(--secondary)
 *   Container radius  → rounded-14
 *   Overflow          → hidden
 *
 *   Aspect ratios:
 *     square → 1:1   → aspect-square
 *     wide   → 16:9  → aspect-video
 *     tall   → 3:4   → aspect-[3/4]
 *
 *   Error icon size   → 24px
 *   Error text        → xs (12px) / foreground-secondary
 */

const imageFrameVariants = cva(
  "relative w-full rounded-14 overflow-hidden bg-secondary",
  {
    variants: {
      ratio: {
        square: "aspect-square",
        wide: "aspect-video",
        tall: "aspect-[3/4]",
      },
    },
    defaultVariants: {
      ratio: "square",
    },
  }
)

export interface ImageFrameProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof imageFrameVariants> {
  src?: string
  alt?: string
}

function ImageFrame({
  src,
  alt = "",
  ratio,
  className,
  ...props
}: ImageFrameProps) {
  const [status, setStatus] = React.useState<"loading" | "loaded" | "error">(
    src ? "loading" : "error"
  )

  React.useEffect(() => {
    if (src) setStatus("loading")
    else setStatus("error")
  }, [src])

  return (
    <div
      className={cn(imageFrameVariants({ ratio }), className)}
      {...props}
    >
      {/* Loading skeleton */}
      {status === "loading" && (
        <div className="absolute inset-0 bg-secondary animate-pulse" />
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[8px]">
          <ImageOff size={24} className="text-foreground-secondary" />
          <span className="text-xs font-normal text-foreground-secondary">
            Không tải được ảnh
          </span>
        </div>
      )}

      {/* Image */}
      {src && status !== "error" && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          className={cn(
            "absolute inset-0 w-full h-full object-cover",
            status === "loading" && "opacity-0"
          )}
        />
      )}
    </div>
  )
}

ImageFrame.displayName = "VSP_ImageFrame"

export { ImageFrame, imageFrameVariants }
