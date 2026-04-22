"use client";

import { BillSheet } from "./_components/bill-sheet";

const common = {
  title: "Thanh toán hóa đơn điện",
  merchant: "EVN Hồ Chí Minh",
  merchantCode: "PE0123456789",
  merchantInitial: "N",
  billAmount: 2_000_000,
  walletBalance: 20_000_000,
};

const cases = [
  {
    caption: "Case 1 — Even",
    desc: "Bill 2M + phí 10k − giảm 10k = 2.000.000 ₫. Không badge.",
    props: {
      ...common,
      fees: [
        { label: "Phí tiện ích NCC", amount: 5_000 },
        { label: "Phí thanh toán", amount: 5_000 },
      ],
      discounts: [
        {
          label: "Giảm giá",
          amount: 10_000,
          chip: "Giảm giá 10k cho lần đầu sử dụng",
        },
      ],
    },
  },
  {
    caption: "Case 2 — Discount (khuyến mãi mạnh)",
    desc: "Bill 2M + phí 10k − giảm 50k = 1.960.000 ₫. Badge xanh Tiết kiệm 40k.",
    props: {
      ...common,
      fees: [
        { label: "Phí tiện ích NCC", amount: 5_000 },
        { label: "Phí thanh toán", amount: 5_000 },
      ],
      discounts: [
        {
          label: "Giảm giá",
          amount: 50_000,
          chip: "Voucher thành viên VIP −50k",
        },
      ],
    },
  },
  {
    caption: "Case 3 — Surcharge (không giảm, có phí)",
    desc: "Bill 2M + phí 10k = 2.010.000 ₫. Badge cam Phụ thu 10k.",
    props: {
      ...common,
      fees: [
        { label: "Phí tiện ích NCC", amount: 5_000 },
        { label: "Phí thanh toán", amount: 5_000 },
      ],
      discounts: [],
    },
  },
];

export default function BillSheetDemoPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f5f7fb] via-white to-[#eef2f7] p-8 text-foreground">
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold leading-tight">
            Bill Sheet — cấu trúc cho 3 trường hợp
          </h1>
          <p className="mt-2 text-sm text-foreground-secondary max-w-3xl">
            Số tiền <b>BIG ở trên = số tiền thực trả</b> (không phải bill gốc).
            Dòng chi tiết tách{" "}
            <span className="font-mono text-orange-700">+phí</span> và{" "}
            <span className="font-mono text-emerald-700">−giảm giá</span>,
            badge ngay dưới amount cho biết tiết kiệm hay phụ thu so với bill
            gốc. Áp dụng nguyên tắc NN/g & Stripe: <i>primary action</i> +
            <i>clear hierarchy</i> + <i>real-time recalc</i>.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {cases.map((c) => (
            <div key={c.caption} className="flex flex-col items-center gap-3">
              <div className="text-center max-w-[390px]">
                <div className="text-sm font-semibold text-foreground">
                  {c.caption}
                </div>
                <p className="text-xs text-foreground-secondary mt-1">
                  {c.desc}
                </p>
              </div>
              <BillSheet {...c.props} />
            </div>
          ))}
        </div>

        {/* Reference notes */}
        <div className="mt-12 max-w-4xl text-xs text-foreground-secondary space-y-2">
          <p className="font-semibold text-foreground">Nguồn tham khảo</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>NN/g — checkout clarity: primary action prominent, clear hierarchy</li>
            <li>
              Stripe / Shopify checkout — subtotal → fees → discount → total,
              total là row đậm nhất
            </li>
            <li>
              MoMo / ZaloPay — pattern “Tổng / Khuyến mãi / Thực thanh toán”
              với green badge Tiết kiệm
            </li>
            <li>
              Mobbin payment screens — amount hero ở top, breakdown bên dưới,
              sticky CTA
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
