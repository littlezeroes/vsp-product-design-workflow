import * as React from "react"
import { cn } from "@/lib/utils"

/*
 * VSP_Section
 * Card container used to group content.
 *
 * Tokens (100% Figma match):
 *   Container bg      → bg/surface/secondary → var(--secondary) → #f3f3f3
 *   Container radius  → 28px
 *   Container padding → px-[16px] py-[16px]
 *
 *   Title font        → xs (12px) / semibold (600) / uppercase / tracking-wider
 *   Title color       → foreground/secondary → var(--foreground-secondary) → #262626
 *   Title margin      → mb-[12px]
 */

export interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional uppercase section title */
  title?: string
  children: React.ReactNode
}

function Section({ title, children, className, ...props }: SectionProps) {
  return (
    <div
      className={cn(
        "w-full bg-secondary rounded-28 px-[16px] py-[16px]",
        className
      )}
      {...props}
    >
      {title && (
        <p className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-[12px]">
          {title}
        </p>
      )}
      {children}
    </div>
  )
}

Section.displayName = "VSP_Section"

export { Section }
