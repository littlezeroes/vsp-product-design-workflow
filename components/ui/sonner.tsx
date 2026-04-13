"use client"

import { Loader2Icon } from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const SuccessIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="currentColor" />
    <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ErrorIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="currentColor" />
    <path d="M6 6l4 4M10 6l-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const WarningIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M7.134 2.5a1 1 0 011.732 0l5.196 9a1 1 0 01-.866 1.5H2.804a1 1 0 01-.866-1.5l5.196-9z" fill="currentColor" />
    <path d="M8 6v3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="11" r=".75" fill="white" />
  </svg>
)

const InfoSolidIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="8" fill="currentColor" />
    <path d="M8 7v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="5" r=".75" fill="white" />
  </svg>
)

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  const isDark = theme === "dark"

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <span className="text-success"><SuccessIcon /></span>,
        info: <span className="text-blue-500"><InfoSolidIcon /></span>,
        warning: <span className="text-orange-500"><WarningIcon /></span>,
        error: <span className="text-destructive"><ErrorIcon /></span>,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": isDark ? "var(--color-green-950)" : "#e5fcf6",
          "--success-text": "var(--foreground)",
          "--success-border": "var(--color-green-600, #00b182)",
          "--error-bg": isDark ? "var(--color-rose-950)" : "#fff1f2",
          "--error-text": "var(--foreground)",
          "--error-border": "var(--color-rose-500, #ef4444)",
          "--warning-bg": isDark ? "#422006" : "#fffbeb",
          "--warning-text": "var(--foreground)",
          "--warning-border": "var(--color-orange-500, #f59e0b)",
          "--info-bg": isDark ? "#172554" : "#eff6ff",
          "--info-text": "var(--foreground)",
          "--info-border": "#3b82f6",
          "--border-radius": "12px",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
