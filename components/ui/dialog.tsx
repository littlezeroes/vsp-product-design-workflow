"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ButtonGroup, type ButtonGroupProps } from "@/components/ui/button-group"

/*
 * VSP_Dialog
 * Figma: https://www.figma.com/design/m8U2GMl2eptDD5gv9iwXDs/VSP_Core-Components?node-id=4457-722
 *
 * Figma props → React props:
 *   type = default | Icon | Image
 *
 * Tokens (100% Figma match):
 *   Overlay        → background/contextual/overlay → var(--overlay) → rgba(38,38,38,0.6)
 *   Overlay blur   → backdrop-blur-[5px]
 *   Card bg        → background/surface/primary    → var(--background) → #ffffff
 *   Card radius    → 28px
 *   Card h-padding → 16px (px-4 on outer container)
 *
 *   Content pt     → 20px (pt-5)
 *   Content pb     → 8px  (pb-2)
 *   Content px     → 24px (px-6)
 *   Content gap    → 16px (gap-4) — icon/image → text block
 *   Text gap       → 8px  (gap-2) — title → description
 *
 *   Icon slot      → 36px
 *   Image slot     → 80px height
 *
 *   Title    → foreground/primary → var(--foreground) → #080808
 *   Title font → lg (20px) / semibold (600) / leading-6 (24px) / tracking -0.1px = -0.005em
 *   Description → foreground/primary → var(--foreground) → #080808
 *   Desc font → sm (14px) / regular (400) / leading-5 (20px)
 *
 *   Footer pad (Image) → px-[22px] py-[20px]
 *   Footer pad (others)→ pt-[16px] pb-[20px] px-6
 *   Button gap     → 12px
 */

export interface DialogProps {
  open?: boolean
  onClose?: () => void
  /** Figma "type" prop */
  type?: "default" | "icon" | "image"
  /** 80px image slot (type=image) */
  image?: React.ReactNode
  /** 36px icon slot (type=icon) */
  icon?: React.ReactNode
  title?: string
  description?: string
  primaryLabel?: string
  secondaryLabel?: string
  footerProps?: Omit<ButtonGroupProps, "layout" | "primaryLabel" | "secondaryLabel">
  className?: string
}

function Dialog({
  open,
  onClose,
  type = "default",
  image,
  icon,
  title,
  description,
  primaryLabel = "Confirm",
  secondaryLabel = "Cancel",
  footerProps,
  className,
}: DialogProps) {
  if (!open) return null

  const isImage = type === "image"

  return (
    /* Overlay + backdrop-blur-[5px] */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center backdrop-blur-[5px] bg-overlay"
      onClick={onClose}
    >
      {/* Modal card */}
      <div
        className={cn(
          "w-full max-w-sm bg-background rounded-[28px] overflow-hidden shadow-xl",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image slot — 80px */}
        {isImage && image && (
          <div className="w-full h-[80px] overflow-hidden">{image}</div>
        )}

        {/* Body — pt-5 pb-2 px-6, gap-4 between icon/image and text, gap-2 in text */}
        <div
          className={cn(
            "flex flex-col items-center text-center gap-4",
            isImage ? "pt-5 pb-2 px-6" : "pt-5 pb-2 px-6"
          )}
        >
          {/* Icon slot — 36px (type=icon) */}
          {type === "icon" && icon && (
            <div className="w-9 h-9 flex items-center justify-center shrink-0">
              {icon}
            </div>
          )}

          {/* Text block — gap-2 */}
          <div className="flex flex-col gap-2 w-full">
            {title && (
              /* lg (20px) / semibold (600) / leading-6 / tracking -0.1px = -0.005em */
              <h2 className="text-lg font-semibold leading-6 tracking-[-0.005em] text-foreground">
                {title}
              </h2>
            )}
            {description && (
              /* sm (14px) / regular (400) / leading-5 */
              <p className="text-sm font-normal leading-5 text-foreground whitespace-pre-line">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className={cn(
            isImage ? "px-[22px] py-[20px]" : "pt-[16px] pb-[20px] px-6"
          )}
        >
          <ButtonGroup
            layout="horizontal"
            size="48"
            primaryLabel={primaryLabel}
            secondaryLabel={secondaryLabel}
            {...footerProps}
          />
        </div>
      </div>
    </div>
  )
}

Dialog.displayName = "VSP_Dialog"

export { Dialog }
