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
  /** Discounts đã áp dụng — trừ vào amount */
  discounts?: Line[];
  /** Voucher có sẵn nhưng chưa áp dụng — chip xanh CTA, không ảnh hưởng amount */
  availableVouchers?: string[];
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
  availableVouchers = [],
  walletBalance,
  walletLabel = "Name wallet",
}: BillSheetProps) {
  const totalFees = fees.reduce((s, f) => s + f.amount, 0);
  const totalDiscount = discounts.reduce((s, d) => s + d.amount, 0);
  const finalAmount = billAmount + totalFees - totalDiscount;
  const delta = finalAmount - billAmount;

  /* ── Tween BIG amount from billAmount → finalAmount on mount ── */
  const [displayAmount, setDisplayAmount] = useState(billAmount);

  useEffect(() => {
    setDisplayAmount(billAmount);

    if (delta === 0) {
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
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [billAmount, finalAmount, delta]);

  /* ── Breakdown collapse state ── */
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-[390px] h-[844px] bg-[#262626]/70 flex flex-col relative overflow-hidden">
      {/* Full dim backdrop — sheet overlays a dimmed base */}
      <div className="flex-1 min-h-[72px] flex flex-col justify-end">
        {/* Sheet */}
        <div className="bg-background rounded-t-[28px] pt-6 pb-0 px-[22px] flex flex-col max-h-[calc(100%-40px)] overflow-y-auto">
          {/* Close */}
          <button
            aria-label="Close"
            className="h-8 w-8 -ml-2 mb-3 inline-flex items-center justify-center rounded-full hover:bg-muted"
          >
            <X className="size-5" />
          </button>

          {/* 1. TITLE */}
          <div className="text-[17px] font-semibold text-foreground leading-tight">
            {title}
          </div>

          {/* 2. BIG amount — to nhất, dominant */}
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-[44px] font-bold tabular-nums tracking-tight leading-none">
              {fmt(displayAmount)}
            </span>
            <span className="text-2xl font-semibold text-foreground-secondary leading-none">
              ₫
            </span>
          </div>

          {/* Savings badge — hiện ngay từ đầu, shine sweep animation trên mount */}
          {delta < 0 && (
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
                className="absolute inset-y-0 -inset-x-4 pointer-events-none animate-shine-sweep"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.6) 40%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.6) 60%, transparent 80%)",
                }}
              />
            </div>
          )}

          {/* 3. Breakdown (collapsible) — chỉ hiện khi có fees/discount */}
          {(fees.length > 0 || discounts.length > 0) && (
          <div className="mt-3">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="w-full flex items-center justify-between py-2"
            >
              <span className="text-[13px] font-semibold text-foreground">
                Chi tiết giao dịch
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
          )}

          {/* 4. Transaction info — compact rows, text nhỏ, không divider */}
          <div className="border-t border-border pt-4 mt-1">
            <div className="text-[13px] font-semibold mb-2">
              Thông tin giao dịch
            </div>
            <dl className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-[13px]">
                <dt className="text-foreground-secondary">Dịch vụ</dt>
                <dd className="font-medium truncate">{title}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 text-[13px]">
                <dt className="text-foreground-secondary">Nhà cung cấp</dt>
                <dd className="font-medium truncate">{merchant}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 text-[13px]">
                <dt className="text-foreground-secondary">Mã khách hàng</dt>
                <dd className="font-medium font-mono">{merchantCode}</dd>
              </div>
            </dl>
          </div>

          {/* 5. Voucher — 3 trạng thái: applied / available offer / empty */}
          <div className="mt-4 flex flex-col gap-2">
            {discounts.some((d) => d.chip) ? (
              /* Applied — xanh đậm, có chữ "Đã áp dụng" implicit */
              discounts
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
                ))
            ) : availableVouchers.length > 0 ? (
              /* Available offer — chip xanh CTA, chưa áp dụng */
              availableVouchers.map((v, i) => (
                <button
                  key={`offer-${i}`}
                  className="flex items-center gap-2.5 h-11 px-3 rounded-2xl bg-emerald-50 ring-1 ring-inset ring-emerald-100 text-left w-full"
                >
                  <div className="size-6 rounded-md bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    %
                  </div>
                  <span className="flex-1 text-[13px] font-medium text-emerald-800 truncate">
                    {v}
                  </span>
                  <ChevronRight className="size-4 text-emerald-700" />
                </button>
              ))
            ) : (
              /* Empty — gray border, invite user thêm */
              <button className="flex items-center gap-2.5 h-11 px-3 rounded-2xl bg-background border border-border hover:bg-muted transition-colors text-left w-full">
                <div className="size-6 rounded-md bg-muted text-foreground-secondary flex items-center justify-center text-[10px] font-bold shrink-0">
                  %
                </div>
                <span className="flex-1 text-[13px] font-medium text-foreground-secondary">
                  Chọn voucher khuyến mãi
                </span>
                <ChevronRight className="size-4 text-foreground-secondary" />
              </button>
            )}
          </div>

          {/* 6. Payment source */}
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

          {/* 7. CTA */}
          <div className="mt-4">
            <Button variant="primary" size="48" className="w-full">
              Xác thực giao dịch
            </Button>
          </div>

          {/* Home indicator */}
          <div className="flex items-end justify-center h-[21px] pb-1 mt-3 shrink-0">
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
