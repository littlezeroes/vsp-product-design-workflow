import { cn } from "@/lib/utils";
import type { TxStatus, TxType } from "../_data/mock";

/* 4 tones only — subtle bg + colored text for readability */
const STATUS_TONE: Record<TxStatus, "success" | "danger" | "warning" | "neutral"> = {
  done: "success",
  redeemed: "success",
  failed: "danger",
  refused: "danger",
  pending: "warning",
  processing: "warning",
  attempt: "warning",
  cancelled: "neutral",
  expired: "neutral",
  reversed: "neutral",
  refunded: "neutral",
};

const BADGE_STYLE: Record<"success" | "danger" | "warning" | "neutral", string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
  danger: "bg-red-50 text-red-700 ring-red-100 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20",
  warning: "bg-orange-50 text-orange-700 ring-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-500/20",
  neutral: "bg-muted text-foreground/70 ring-border",
};

const DOT: Record<"success" | "danger" | "warning" | "neutral", string> = {
  success: "bg-emerald-500",
  danger: "bg-red-500",
  warning: "bg-orange-500",
  neutral: "bg-muted-foreground/50",
};

export function StatusPill({ status }: { status: TxStatus }) {
  const tone = STATUS_TONE[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 h-[22px] px-2 rounded-md ring-1 ring-inset text-[11px] font-medium capitalize",
        BADGE_STYLE[tone],
      )}
    >
      <span className={cn("size-1.5 rounded-full", DOT[tone])} aria-hidden />
      {status}
    </span>
  );
}

/* Type: plain text, reversal visually emphasized */
export function TypePill({ type }: { type: TxType }) {
  const isReversal = type === "reversal";
  return (
    <span
      className={cn(
        "text-xs capitalize",
        isReversal ? "text-red-700 dark:text-red-400 font-medium" : "text-muted-foreground",
      )}
    >
      {type}
    </span>
  );
}
