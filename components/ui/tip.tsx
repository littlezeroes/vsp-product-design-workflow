"use client"

import * as React from "react"

export function Tip({ children, text }: { children: React.ReactNode; text: string }) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    if (!open) return
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [open])

  return (
    <span ref={ref} className="relative inline">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
        className="underline decoration-dotted decoration-foreground-secondary/40 underline-offset-[3px] cursor-help"
      >
        {children}
      </button>
      {open && (
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[6px] w-[200px] bg-foreground text-background rounded-[10px] px-[10px] py-[8px] z-50 shadow-lg text-[11px] leading-snug font-normal text-center pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-[8px] h-[8px] bg-foreground rotate-45" />
        </span>
      )}
    </span>
  )
}
