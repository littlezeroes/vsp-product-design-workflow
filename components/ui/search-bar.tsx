"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

/*
 * VSP_SearchBar
 * Full-width search input with leading Search icon and trailing clear button.
 *
 * Tokens:
 *   Container bg              → bg/search              → var(--search)             → #f3f3f3
 *   Container height          → 44px
 *   Container radius          → rounded-full
 *   Container padding         → px-[16px]
 *   Focus border              → border-brand-secondary (1.5px)
 *
 *   Leading icon              → Search (20px) → text-foreground-secondary
 *   Input text                → sm / normal (400) / text-foreground
 *   Placeholder               → text-grey-300
 *   Clear icon                → X (16px) → text-foreground-secondary, visible only when value
 */

export interface SearchBarProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  /** Controlled value */
  value?: string
  /** Change handler */
  onChange?: (value: string) => void
  /** Placeholder text */
  placeholder?: string
  /** Clear handler (also clears via trailing X) */
  onClear?: () => void
  /** Wrapper className */
  className?: string
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      value,
      onChange,
      placeholder = "Search",
      onClear,
      className,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false)
    const hasValue = value !== undefined && value !== ""

    const handleClear = () => {
      onChange?.("")
      onClear?.()
    }

    return (
      <div
        className={cn(
          "w-full h-[44px] rounded-full bg-search",
          "flex items-center gap-[8px] px-[16px]",
          "transition-colors duration-150",
          focused && "border border-brand-secondary border-[1.5px]",
          className
        )}
      >
        {/* Leading icon — Search 20px */}
        <span className="shrink-0 w-5 h-5 flex items-center justify-center text-foreground-secondary">
          <Search size={20} />
        </span>

        {/* Input */}
        <input
          ref={ref}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={cn(
            "w-full bg-transparent text-sm font-normal leading-5 text-foreground outline-none",
            "placeholder:text-grey-300"
          )}
          {...props}
        />

        {/* Trailing clear — X 16px, only when has value */}
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 w-4 h-4 flex items-center justify-center text-foreground-secondary cursor-pointer"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    )
  }
)

SearchBar.displayName = "VSP_SearchBar"

export { SearchBar }
