"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Info, Wallet, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ItemList, ItemListItem } from "@/components/ui/item-list";

type Line = { label: string; amount: number; chip?: string };

export interface BillSheetProps {
  title: string;
  merchant: string;
  merchantCode: string;
  merchantInitial?: string;
  billAmount: number;
  fees?: Line[];
  discounts?: Line[];
  walletBalance: number;
  walletLabel?: string;
}

const fmt = (n: number) => new Intl.NumberFormat("vi-VN").format(Math.round(n));

export function BillSheet({
  title,
  merchant,
  merchantCode,
  merchantInitial = "N",
  billAmount,
  fees = [],
  discounts = [],
  walletBalance,
  walletLabel = "Ví V-Smart Pay",
}: BillSheetProps) {
  const totalFees = fees.reduce((s, f) => s + f.amount, 0);
  const totalDiscount = discounts.reduce((s, d) => s + d.amount, 0);
  const finalAmount = billAmount + totalFees - totalDiscount;
  const delta = finalAmount - billAmount;

  /* ── Tween BIG amount from billAmount → finalAmount on mount ── */
  const [displayAmount, setDisplayAmount] = useState(billAmount);
  const [badgeVisible, setBadgeVisible] = useState(false);

  useEffect(() => {
    // Reset to start
    setDisplayAmount(billAmount);
    setBadgeVisible(false);

    if (delta === 0) {
      // Nothing to animate, show immediately
      setDisplayAmount(finalAmount);
      return;
    }

    const duration = 900;
    const start = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    let rafId = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(t);
      setDisplayAmount(billAmount + (finalAmount - billAmount) * eased);
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setBadgeVisible(true);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [billAmount, finalAmount, delta]);

  /* ── Breakdown collapse state ── */
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-[390px] h-[844px] bg-muted/40 flex flex-col relative overflow-hidden rounded-[40px] ring-1 ring-border shadow-2xl">
      {/* status bar */}
      <div className="h-[54px] shrink-0" />

      {/* Dim backdrop */}
      <div className="flex-1 bg-[#262626]/60 flex flex-col justify-end">
        {/* Sheet */}
        <div className="bg-background rounded-t-[28px] pt-8 pb-[21px] px-[22px] flex flex-col max-h-[calc(100%-40px)] overflow-y-auto">
          {/* Close */}
          <button
            aria-label="Close"
            className="h-8 w-8 -ml-2 mb-3 inline-flex items-center justify-center rounded-full hover:bg-muted"
          >
            <X className="size-5" />
          </button>

          {/* 1. TITLE */}
          <div className="text-[15px] font-semibold text-foreground leading-tight">
            {title}
          </div>

          {/* 2. BIG amount + badge */}
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-[36px] font-bold tabular-nums tracking-tight leading-none">
              {fmt(displayAmount)}
            </span>
            <span className="text-xl font-medium text-foreground-secondary leading-none">
              ₫
            </span>
          </div>

          {/* Savings badge — chỉ hiện khi tiết kiệm (shine sweep khi mount) */}
          {delta < 0 && badgeVisible && (
            <div
              key={`badge-${delta}`}
              className="relative inline-flex items-center gap-1 h-6 px-2 mt-2 w-fit rounded-md text-[12px] font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100 overflow-hidden"
            >
              <span className="relative z-10">
                ✓ Tiết kiệm {fmt(-delta)} ₫
              </span>
              {/* Shine overlay sweeping across */}
              <span
                aria-hidden
                className="absolute inset-y-0 -inset-x-2 pointer-events-none animate-shine-sweep"
                style={{
                  background:
                    "linear-gradient(100deg, transparent 10%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.85) 55%, transparent 90%)",
                }}
              />
            </div>
          )}

          {/* 3. Voucher section — standalone block (nếu có voucher) */}
          {discounts.some((d) => d.chip) && (
            <div className="mt-5 flex flex-col gap-2">
              {discounts
                .filter((d) => d.chip)
                .map((d, i) => (
                  <button
                    key={`voucher-${i}`}
                    className="flex items-center gap-2.5 h-11 px-3 rounded-2xl bg-emerald-50 ring-1 ring-inset ring-emerald-100 text-left w-full"
                  >
                    <div className="size-6 rounded-md bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      %
                    </div>
                    <span className="flex-1 text-[13px] font-medium text-emerald-800 truncate">
                      {d.chip}
                    </span>
                    <ChevronRight className="size-4 text-emerald-700" />
                  </button>
                ))}
            </div>
          )}

          {/* 4. Breakdown (collapsible, no +/- column) */}
          <div className="mt-5 border-t border-border">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="w-full flex items-center justify-between py-3 text-sm"
            >
              <span className="font-medium text-foreground">
                Chi tiết khoản tiền
              </span>
              <ChevronDown
                className={cn(
                  "size-4 text-foreground-secondary transition-transform",
                  expanded && "rotate-180",
                )}
              />
            </button>

            {expanded && (
              <div className="pb-3 space-y-2.5 text-sm">
                <Row label="Hóa đơn gốc" value={`${fmt(billAmount)} ₫`} />
                {fees.map((f, i) => (
                  <Row
                    key={`fee-${i}`}
                    label={f.label}
                    value={`${fmt(f.amount)} ₫`}
                  />
                ))}
                {discounts.map((d, i) => (
                  <Row
                    key={`disc-${i}`}
                    label={d.label}
                    value={`−${fmt(d.amount)} ₫`}
                    valueClassName="text-emerald-700"
                  />
                ))}
              </div>
            )}
          </div>

          {/* 4. Transaction info — ItemList horizontal rows */}
          <div className="border-t border-border pt-2">
            <ItemList>
              <ItemListItem
                label="Giao dịch"
                metadata={title}
                divider
              />
              <ItemListItem
                label="Nhà cung cấp"
                metadata={merchant}
                divider
              />
              <ItemListItem
                label="Mã khách hàng"
                metadata={merchantCode}
              />
            </ItemList>
          </div>

          {/* 5. Payment source */}
          <div className="mt-4">
            <div className="text-[13px] font-semibold mb-2">
              Nguồn thanh toán
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-2xl border-2 border-primary p-3 flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[11px] text-foreground-secondary">
                  <Wallet className="size-3.5" />
                  {walletLabel}
                </div>
                <div className="text-[15px] font-semibold tabular-nums">
                  {fmt(walletBalance)} ₫
                </div>
              </div>
              <div className="rounded-2xl border border-border p-3 flex flex-col gap-1.5 opacity-60">
                <div className="flex items-center gap-1.5 text-[11px] text-foreground-secondary">
                  Nguồn liên kết
                </div>
                <div className="text-[13px] text-foreground-secondary">
                  Sắp ra mắt
                </div>
              </div>
            </div>
          </div>

          {/* 6. CTA */}
          <div className="mt-4">
            <Button variant="primary" size="48" className="w-full">
              Xác thực giao dịch
            </Button>
          </div>

          {/* Home indicator */}
          <div className="flex items-end justify-center h-[21px] pb-1 mt-2 shrink-0">
            <span className="w-[139px] h-[5px] bg-foreground rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-foreground-secondary">{label}</span>
      <span className={cn("font-medium tabular-nums", valueClassName)}>
        {value}
      </span>
    </div>
  );
}
