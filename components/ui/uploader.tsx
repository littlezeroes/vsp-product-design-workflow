"use client"

import * as React from "react"
import { Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"

/*
 * VSP_Uploader
 * Dashed border upload area with drag-and-drop support.
 *
 * Tokens (100% Figma match):
 *   Border             → border-2 border-dashed border-border
 *   Radius             → rounded-14
 *   Icon size          → 32px
 *   Icon color         → foreground/secondary → var(--foreground-secondary)
 *   Text "Tải lên"     → sm (14px) / semibold (600)
 *   Subtitle           → xs (12px) / regular (400) / foreground-secondary
 *
 *   Active/drag bg     → green-50 (light)
 *   Active border      → brand-secondary → var(--brand-secondary)
 *
 *   Preview remove btn → 20px X icon, absolute top-right
 */

export interface UploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Accepted file types (e.g. "image/*") */
  accept?: string
  /** Callback when file is selected */
  onUpload?: (file: File) => void
  /** Preview URL after upload */
  preview?: string
  /** Callback to remove uploaded file */
  onRemove?: () => void
  disabled?: boolean
}

function Uploader({
  accept,
  onUpload,
  preview,
  onRemove,
  disabled = false,
  className,
  ...props
}: UploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = React.useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onUpload?.(file)
    // Reset so same file can be re-selected
    e.target.value = ""
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (disabled) return
    const file = e.dataTransfer.files?.[0]
    if (file) onUpload?.(file)
  }

  // ── Preview state ──
  if (preview) {
    return (
      <div
        className={cn("relative w-full rounded-14 overflow-hidden bg-secondary", className)}
        {...props}
      >
        <img
          src={preview}
          alt="Preview"
          className="w-full h-full object-cover"
        />
        {onRemove && !disabled && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-foreground/60 flex items-center justify-center text-background transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X size={14} />
          </button>
        )}
      </div>
    )
  }

  // ── Upload area ──
  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "w-full flex flex-col items-center justify-center gap-[8px]",
        "py-[24px] px-[16px] rounded-14",
        "border-2 border-dashed transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        dragging
          ? "border-brand-secondary bg-green-50 dark:bg-green-950"
          : "border-border",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer",
        className
      )}
      {...props}
    >
      <Upload size={32} className="text-foreground-secondary" />
      <span className="text-sm font-semibold text-foreground">Tải lên</span>
      <span className="text-xs font-normal text-foreground-secondary">
        Kéo thả hoặc nhấn để chọn tệp
      </span>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
        tabIndex={-1}
      />
    </div>
  )
}

Uploader.displayName = "VSP_Uploader"

export { Uploader }
