import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  valueColor,
  className,
}: {
  label: string;
  value: string;
  valueColor?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card px-4 py-3 min-w-0",
        className,
      )}
    >
      <p className="text-xs text-muted-foreground mb-1 truncate">{label}</p>
      <p className={cn("text-lg font-bold tabular-nums", valueColor)}>{value}</p>
    </div>
  );
}
