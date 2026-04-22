"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BillSheet } from "../_components/bill-sheet";

const common = {
  title: "Thanh toán hóa đơn điện",
  merchant: "EVN Hồ Chí Minh",
  merchantCode: "PE0123456789",
  billAmount: 2_000_000,
  walletBalance: 20_000_000,
};

const cases: Record<string, Parameters<typeof BillSheet>[0]> = {
  "1": {
    ...common,
    fees: [],
    discounts: [],
    availableVouchers: ["Giảm giá 10k cho lần đầu sử dụng"],
  },
  "2": {
    ...common,
    fees: [
      { label: "Phí tiện ích NCC", amount: 5_000 },
      { label: "Phí thanh toán", amount: 5_000 },
    ],
    discounts: [
      { label: "Giảm giá", amount: 50_000, chip: "Voucher thành viên VIP −50k" },
    ],
  },
  "3": {
    ...common,
    fees: [
      { label: "Phí tiện ích NCC", amount: 5_000 },
      { label: "Phí thanh toán", amount: 5_000 },
    ],
    discounts: [],
  },
};

function View() {
  const sp = useSearchParams();
  const c = sp.get("case") ?? "1";
  const props = cases[c] ?? cases["1"];
  return (
    <div className="w-[390px] h-[844px] bg-background flex items-center justify-center overflow-hidden">
      <BillSheet {...props} />
    </div>
  );
}

export default function BillSheetView() {
  return (
    <Suspense fallback={null}>
      <View />
    </Suspense>
  );
}
