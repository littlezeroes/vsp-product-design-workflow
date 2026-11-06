"use client";
import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  CalendarDays, Crown, Ticket, Clock, SlidersHorizontal, Car,
  ArrowDownToLine,
  ArrowUpFromLine,
  Eye,
  EyeOff,
  Landmark,
  ReceiptText,
  ShieldCheck,
  Wallet,
  CheckCircle2,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { SearchBar } from "@/components/ui/search-bar";
import { TextField } from "@/components/ui/text-field";
import { ItemListItem } from "@/components/ui/item-list";
import type {
  DomainProps,
  ScreenView,
  RecordEntry,
  Store,
} from "./product-types";
import "./commerce-v3.css";
const money = (v: number) => new Intl.NumberFormat("vi-VN").format(v) + "đ";
const makeRecord = (
  kind: string,
  title: string,
  amount: number,
  detail: string,
  fields: Record<string, string>
): RecordEntry => ({
  id: crypto.randomUUID(),
  date: new Date().toISOString(),
  kind,
  title,
  amount,
  status: "Hoàn thành",
  detail,
  fields,
});
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="px-[22px]">
      <h2 className="pt-[24px] pb-[12px] text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}
function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={`rounded-28 border-0 bg-secondary p-[12px] shadow-none gap-[12px] ${className}`}
    >
      {children}
    </Card>
  );
}
function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-[12px] py-[8px]">
      <span className="text-foreground-secondary">{label}</span>
      <strong className="text-right">{value}</strong>
    </div>
  );
}
export function useCommerceView({
  design,
  store,
  screen,
  navigate,
}: DomainProps): ScreenView {
  const s = store.data;
  const [hidden, setHidden] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [qty, setQty] = useState(1);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [account, setAccount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("VinPay");
  const [review, setReview] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [assignee, setAssignee] = useState("Minh Anh");
  const [addingBill, setAddingBill] = useState(false);
  const [provider, setProvider] = useState("EVN");
  const [billName, setBillName] = useState("");
  const [dueDate, setDueDate] = useState("2026-10-15");
  const pending = useRef(false);
  const wrap = (children: ReactNode) => (
    <div className={`commerce-v3 commerce-${design.slug}`}>
      {children}
      {error && (
        <p role="alert" className="px-[22px] pt-[24px] text-danger">
          {error}
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="px-[22px] pt-[24px] text-foreground-secondary"
        >
          {notice}
        </p>
      )}
    </div>
  );
  const unavailable = (title: string): ScreenView => ({
    title,
    body: wrap(
      <Section title="Không tìm thấy nội dung">
        <p>Nội dung này đã thay đổi. Quay về danh sách để chọn lại.</p>
      </Section>
    ),
    action: { label: "Về dịch vụ", run: () => navigate({ kind: "services" }) },
  });
  const context =
    design.slug === "household"
      ? "Chi tiêu chung · Gia đình Minh Anh"
      : design.slug === "savings"
      ? "Giá cuối rõ ràng · Quyền lợi áp dụng ngay"
      : design.slug === "journey"
      ? "Chi tiêu cho hành trình của bạn"
      : design.slug === "autopilot"
      ? "Bạn duyệt trước mọi giao dịch"
      : design.slug === "transparent"
      ? "Số tiền · nguồn tiền · trạng thái"
      : design.slug === "membership"
      ? "VinClub Elite · tận hưởng quyền lợi"
      : design.slug === "wellbeing"
      ? "Nhẹ việc để có thời gian chăm sóc"
      : design.slug === "neighborhood"
      ? "Dịch vụ trong khu Ocean Park"
      : design.slug === "concierge"
      ? "Chọn dịch vụ, chúng tôi giúp bạn chuẩn bị"
      : "Những việc cần xong hôm nay";
  const banner = (title: string, image?: string) => (
    <div className="px-[22px] pt-[24px]">
      <Panel className="commerce-feature">
        {image && (
          <img
            src={image}
            alt=""
            className="commerce-image w-full object-cover rounded-14"
          />
        )}
        <p className="text-xs text-foreground-secondary">{context}</p>
        <h2 className="text-2xl font-semibold">{title}</h2>
      </Panel>
    </div>
  );
  const atomic = (record: RecordEntry, mutate: (prev: Store) => Store) => {
    if (pending.current) return;
    pending.current = true;
    store.update((prev) =>
      mutate({ ...prev, records: [record, ...prev.records] })
    );
    navigate({ kind: "receipt", id: record.id });
  };
  if (screen.kind === "wallet")
    return {
      title: "Ví VinPay",
      body: wrap(
        <>
          {banner(
            "Tiền sẵn sàng cho mọi kế hoạch",
            `/vinclub-redesign-art/${design.slug}.png`
          )}
          <Section title="Số dư khả dụng">
            <Panel className="commerce-balance">
              <div className="flex justify-between">
                <Wallet />
                <Button
                  variant="secondary"
                  size="32"
                  aria-label={hidden ? "Hiện số dư" : "Ẩn số dư"}
                  onClick={() => setHidden(!hidden)}
                >
                  {hidden ? <Eye size={18} /> : <EyeOff size={18} />}
                </Button>
              </div>
              <p className="text-2xl font-semibold tabular-nums">
                {hidden ? "••••••" : money(s.balance)}
              </p>
              <p className="text-sm text-foreground-secondary">
                Ví của {s.name} · VND
              </p>
            </Panel>
          </Section>
          <Section title="Sử dụng ví">
            <div className="commerce-shortcuts">
              {(
                [
                  ["Nạp tiền", "deposit", ArrowDownToLine],
                  ["Rút tiền", "withdraw", ArrowUpFromLine],
                  ["Chuyển tiền", "transfer", Landmark],
                  ["Thanh toán QR", "qr", ReceiptText],
                ] as const
              ).map(([label, kind, Icon]) => (
                <Button
                  key={kind}
                  variant="secondary"
                  className="h-auto min-h-[72px] flex-col gap-[8px]"
                  onClick={() => navigate({ kind })}
                >
                  <Icon size={20} />
                  {label}
                </Button>
              ))}
            </div>
            <ItemListItem
              label="Hóa đơn gia đình"
              sublabel={`${
                s.bills.filter((b) => !b.paid).length
              } khoản chưa thanh toán`}
              prefix={<ReceiptText />}
              onPress={() => navigate({ kind: "bills" })}
              showChevron
            />
            <ItemListItem
              label="Lịch sử giao dịch"
              sublabel="Biên nhận và nguồn tiền"
              onPress={() => navigate({ kind: "activity" })}
              showChevron
            />
          </Section>
          <Section title="Dịch vụ tài chính">
            <Link className="commerce-link" href="/bidv-link">
              Liên kết ngân hàng · BIDV
            </Link>
            <Link className="commerce-link" href="/sinhloi/intro">
              AutoEarn · tìm hiểu sinh lời
            </Link>
            <Link className="commerce-link" href="/bnpl/loan">
              Vay tiêu dùng · xem điều kiện
            </Link>
            <Link className="commerce-link" href="/sbh/auto-payment">
              Thanh toán tự động · quản lý ủy quyền
            </Link>
            <Link className="commerce-link" href="/insurance">
              <ShieldCheck size={20} /> Bảo hiểm · xem và đăng ký
            </Link>
            <Link className="commerce-link" href="/bnpl">
              Mua trước trả sau · xem hạn mức
            </Link>
          </Section>
        </>
      ),
      action: {
        label: "Chuyển tiền",
        run: () => navigate({ kind: "transfer" }),
      },
    };
  if (screen.kind === "bills")
    return {
      title: "Hóa đơn",
      body: wrap(
        <>
          {banner(
            money(
              s.bills.filter((b) => !b.paid).reduce((t, b) => t + b.amount, 0)
            ) + " cần thanh toán"
          )}
          {addingBill && (
            <Section title="Thêm hóa đơn theo thông tin của bạn">
              <div className="flex flex-col gap-[12px]">
                <p className="text-sm text-foreground-secondary">
                  Nhập hóa đơn để tổ chức khoản cần trả. Prototype không tra cứu
                  công nợ thật tại nhà cung cấp.
                </p>
                <div className="flex flex-wrap gap-[8px]">
                  {["EVN", "Nước sạch", "FPT", "Khác"].map((p) => (
                    <Chip
                      key={p}
                      selected={provider === p}
                      onClick={() => setProvider(p)}
                    >
                      {p}
                    </Chip>
                  ))}
                </div>
                <TextField
                  aria-label="Tên hóa đơn"
                  label="Tên hóa đơn"
                  value={billName}
                  onChange={(e) => setBillName(e.target.value)}
                />
                <TextField
                  aria-label="Mã khách hàng"
                  label="Mã khách hàng"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                />
                <TextField
                  aria-label="Số tiền hóa đơn"
                  label="Số tiền hóa đơn (VND)"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <TextField
                  aria-label="Hạn thanh toán"
                  label="Hạn thanh toán"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </Section>
          )}
          {[false, true].map((paid) => (
            <Section
              key={String(paid)}
              title={paid ? "Đã thanh toán" : "Đến hạn trong tháng"}
            >
              {s.bills
                .filter((b) => b.paid === paid)
                .map((b) => (
                  <ItemListItem
                    key={b.id}
                    label={b.title}
                    sublabel={`${
                      b.asset === "family" ? "Gia đình" : "Căn hộ S2.01"
                    } · ${b.due}`}
                    metadata={money(b.amount)}
                    subMetadata={b.paid ? "Đã trả" : "Chưa trả"}
                    prefix={b.paid ? <CheckCircle2 /> : <ReceiptText />}
                    showChevron
                    onPress={() => navigate({ kind: "bill", id: b.id })}
                  />
                ))}
              {!s.bills.some((b) => b.paid === paid) && (
                <p className="text-foreground-secondary">
                  {paid
                    ? "Biên nhận sẽ xuất hiện sau khi thanh toán."
                    : "Các hóa đơn đều đã được thanh toán."}
                </p>
              )}
            </Section>
          ))}
        </>
      ),
      action: {
        label: addingBill ? "Lưu hóa đơn" : "Thêm hóa đơn",
        run: () => {
          if (!addingBill) {
            setAddingBill(true);
            setError("");
            return;
          }
          const value = Number(amount);
          if (
            billName.trim().length < 3 ||
            !/^\w[\w-]{3,29}$/.test(account) ||
            !/^\d+$/.test(amount) ||
            !Number.isSafeInteger(value) ||
            value < 1000 ||
            value > 50000000 ||
            !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)
          ) {
            setError(
              "Nhập tên hóa đơn, mã khách hàng 4–30 ký tự, số tiền từ 1.000đ đến 50.000.000đ và hạn thanh toán."
            );
            return;
          }
          const duplicate = s.bills.some(
            (b) =>
              s.preferences[`bill:${b.id}:customer`] === account.trim() &&
              s.preferences[`bill:${b.id}:provider`] === provider &&
              !b.paid
          );
          if (duplicate) {
            setError(
              "Khách hàng này đã có hóa đơn chưa thanh toán tại nhà cung cấp đã chọn."
            );
            return;
          }
          const id = crypto.randomUUID();
          store.update((prev) => ({
            ...prev,
            bills: [
              ...prev.bills,
              {
                id,
                title: billName.trim(),
                amount: value,
                due: dueDate,
                asset: "home",
                paid: false,
              },
            ],
            preferences: {
              ...prev.preferences,
              [`bill:${id}:customer`]: account.trim(),
              [`bill:${id}:provider`]: provider,
            },
          }));
          navigate({ kind: "bill", id });
        },
      },
      secondary: addingBill
        ? {
            label: "Hủy thêm hóa đơn",
            run: () => {
              setAddingBill(false);
              setError("");
            },
          }
        : undefined,
    };
  if (screen.kind === "bill") {
    const bill = s.bills.find((b) => b.id === screen.id);
    if (!bill) return unavailable("Hóa đơn");
    const record = s.records.find((r) => r.fields.billId === bill.id);
    return {
      title: bill.title,
      body: wrap(
        <>
          {banner(bill.paid ? "Đã thanh toán" : money(bill.amount))}
          <Section title="Thông tin hóa đơn">
            <Panel>
              <Line
                label="Tài sản"
                value={bill.asset === "home" ? "Căn hộ S2.01" : "Gia đình"}
              />
              <Line label="Hạn thanh toán" value={bill.due} />
              {s.preferences[`bill:${bill.id}:provider`] && (
                <Line
                  label="Nhà cung cấp"
                  value={s.preferences[`bill:${bill.id}:provider`]}
                />
              )}
              {s.preferences[`bill:${bill.id}:customer`] && (
                <Line
                  label="Mã khách hàng"
                  value={s.preferences[`bill:${bill.id}:customer`]}
                />
              )}
              <Line label="Nguồn thanh toán" value="Ví VinPay" />
              <Line label="Phí" value="0đ" />
              <Line label="Số dư hiện tại" value={money(s.balance)} />
            </Panel>
          </Section>
          {design.slug === "household" && (
            <Section title="Người phụ trách">
              <div className="flex flex-wrap gap-[8px]">
                {["Minh Anh", "Quang", "Chi tiêu chung"].map((n) => (
                  <Chip
                    key={n}
                    selected={n === assignee}
                    onClick={() => setAssignee(n)}
                  >
                    {n}
                  </Chip>
                ))}
              </div>
            </Section>
          )}
          <Section title="Trước khi xác nhận">
            <p className="text-sm text-foreground-secondary">
              {bill.paid
                ? "Hóa đơn này đã được ghi nhận. Không thể thanh toán lần hai."
                : `Trừ ${money(bill.amount)} từ ví. ${
                    s.balance >= bill.amount
                      ? `Số dư còn ${money(s.balance - bill.amount)}.`
                      : "Bạn cần nạp thêm tiền trước khi thanh toán."
                  } Hóa đơn chỉ được thanh toán một lần.`}
            </p>
          </Section>
        </>
      ),
      action: bill.paid
        ? {
            label: "Xem biên nhận",
            disabled: !record,
            run: () => record && navigate({ kind: "receipt", id: record.id }),
          }
        : {
            label: `Thanh toán ${money(bill.amount)}`,
            run: () => {
              if (pending.current) return;
              if (s.balance < bill.amount) {
                setError("Số dư chưa đủ. Nạp thêm tiền để thanh toán.");
                return;
              }
              const r = makeRecord(
                "bill",
                bill.title,
                bill.amount,
                "Thanh toán hóa đơn",
                {
                  billId: bill.id,
                  source: "VinPay",
                  assignee,
                  fee: "0đ",
                  asset: bill.asset,
                  provider:
                    s.preferences[`bill:${bill.id}:provider`] || bill.title,
                  customer:
                    s.preferences[`bill:${bill.id}:customer`] || "Căn hộ S2.01",
                }
              );
              atomic(r, (prev) => ({
                ...prev,
                balance: prev.balance - bill.amount,
                bills: prev.bills.map((b) =>
                  b.id === bill.id ? { ...b, paid: true } : b
                ),
              }));
            },
          },
      secondary:
        !bill.paid && s.balance < bill.amount
          ? { label: "Nạp tiền", run: () => navigate({ kind: "deposit" }) }
          : undefined,
    };
  }
  if (["transfer", "deposit", "withdraw", "qr"].includes(screen.kind)) {
    const kind = screen.kind;
    const isDeposit = kind === "deposit";
    const title =
      kind === "transfer"
        ? "Chuyển tiền"
        : isDeposit
        ? "Nạp tiền"
        : kind === "withdraw"
        ? "Rút tiền"
        : "Thanh toán QR thử nghiệm";
    const numeric = Number(amount);
    const validAmount =
      /^\d+$/.test(amount) &&
      Number.isSafeInteger(numeric) &&
      numeric >= 1000 &&
      numeric <= 50000000;
    const validate = () => {
      if (!validAmount) return "Nhập số tiền từ 1.000đ đến 50.000.000đ.";
      if (!isDeposit && numeric > s.balance)
        return "Số dư VinPay không đủ cho giao dịch này.";
      if (kind === "transfer" || kind === "withdraw") {
        if (!/^\d{8,19}$/.test(account)) return "Số tài khoản cần 8–19 chữ số.";
        if (recipient.trim().length < 3) return "Nhập tên người nhận đầy đủ.";
      }
      if (
        kind === "qr" &&
        (recipient.trim().length < 3 || purpose.trim().length < 3)
      )
        return "Nhập đơn vị nhận tiền và nội dung thanh toán.";
      return "";
    };
    return {
      title,
      body: wrap(
        <>
          {banner(
            review
              ? "Kiểm tra trước khi xác nhận"
              : isDeposit
              ? "Bổ sung số dư ví"
              : "Tiền đến đúng nơi"
          )}
          <Section
            title={review ? "Chi tiết giao dịch" : "Thông tin thanh toán"}
          >
            {review ? (
              <Panel>
                <Line label="Loại giao dịch" value={title} />
                <Line label="Số tiền" value={money(numeric)} />
                <Line label="Nguồn" value={isDeposit ? source : "Ví VinPay"} />
                <Line
                  label="Người nhận"
                  value={isDeposit ? s.name : recipient || s.name}
                />
                {account && <Line label="Tài khoản" value={account} />}
                <Line label="Phí" value="0đ" />
                <Line
                  label="Số dư sau giao dịch"
                  value={money(s.balance + (isDeposit ? numeric : -numeric))}
                />
                {purpose && (
                  <p className="text-sm text-foreground-secondary">{purpose}</p>
                )}
              </Panel>
            ) : (
              <div className="flex flex-col gap-[12px]">
                <TextField
                  label="Số tiền (VND)"
                  aria-label="Số tiền"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="flex flex-wrap gap-[8px]">
                  {[100000, 500000, 1000000].map((n) => (
                    <Chip key={n} onClick={() => setAmount(String(n))}>
                      {money(n)}
                    </Chip>
                  ))}
                </div>
                {isDeposit ? (
                  <>
                    <p className="text-sm font-semibold">
                      Nguồn nạp thử nghiệm
                    </p>
                    <div className="flex flex-wrap gap-[8px]">
                      {["Vietcombank demo", "Techcombank demo"].map((n) => (
                        <Chip
                          key={n}
                          selected={source === n}
                          onClick={() => setSource(n)}
                        >
                          {n}
                        </Chip>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    {kind !== "qr" && (
                      <TextField
                        label="Số tài khoản ngân hàng"
                        aria-label="Số tài khoản"
                        value={account}
                        inputMode="numeric"
                        onChange={(e) => setAccount(e.target.value)}
                      />
                    )}
                    <TextField
                      label={
                        kind === "qr"
                          ? "Đơn vị nhận tiền (demo)"
                          : "Tên người nhận"
                      }
                      aria-label="Tên người nhận"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                    />
                  </>
                )}
                <TextField
                  label="Nội dung giao dịch"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </div>
            )}
          </Section>
          <Section title="Giao dịch mô phỏng">
            <p className="text-sm text-foreground-secondary">
              {kind === "qr"
                ? "Nhập thông tin để thử luồng QR. Prototype không quét mã hay xác thực người bán."
                : "Nguồn ngân hàng là dữ liệu demo. Xác nhận chỉ thay đổi số dư trong phiên bản này."}
            </p>
          </Section>
        </>
      ),
      action: {
        label: review ? `Xác nhận ${money(numeric)}` : "Kiểm tra giao dịch",
        run: () => {
          const message = validate();
          if (message) {
            setError(message);
            return;
          }
          if (isDeposit && source === "VinPay") {
            setError("Chọn ngân hàng demo để nạp tiền.");
            return;
          }
          setError("");
          if (!review) {
            setReview(true);
            return;
          }
          const r = makeRecord(kind, title, numeric, purpose || title, {
            source: isDeposit ? source : "VinPay",
            recipient: isDeposit ? s.name : recipient,
            account,
            purpose,
            fee: "0đ",
            balanceAfter: money(s.balance + (isDeposit ? numeric : -numeric)),
          });
          atomic(r, (prev) => ({
            ...prev,
            balance: prev.balance + (isDeposit ? numeric : -numeric),
          }));
        },
      },
      secondary: review
        ? { label: "Sửa thông tin", run: () => setReview(false) }
        : undefined,
    };
  }
  const cartItems = Object.entries(s.cart)
    .map(([id, q]) => ({
      product: s.products.find((p) => p.id === id),
      qty: q,
    }))
    .filter(
      (x): x is { product: Store["products"][number]; qty: number } =>
        !!x.product && x.qty > 0
    );
  const subtotal = cartItems.reduce(
    (sum, x) => sum + x.product.price * x.qty,
    0
  );
  const voucher = s.offers.find((o) => o.id === "winmart" && o.redeemed);
  const discount = voucher && subtotal >= 500000 ? 100000 : 0;
  const total = subtotal - discount;
  if (screen.kind === "shopping") {
    const products = s.products.filter(
      (p) =>
        (category === "Tất cả" || category === p.category) &&
        p.name.toLocaleLowerCase("vi").includes(query.toLocaleLowerCase("vi"))
    );
    return {
      title: "Mua sắm",
      body: wrap(
        <>
          {banner(
            design.slug === "savings"
              ? "Giỏ đầy hơn. Giá nhẹ hơn."
              : design.slug === "household"
              ? "Những thứ cả nhà cần"
              : "Một lựa chọn tốt cho ngày mới",
            "/vinclub-assets/home-banners/shopping.webp"
          )}
          <Section title="Chọn theo nhu cầu">
            <SearchBar
              aria-label="Tìm sản phẩm"
              placeholder="Tìm thực phẩm, đồ dùng…"
              value={query}
              onChange={setQuery}
            />
            <div className="flex flex-wrap gap-[8px] pt-[12px]">
              {["Tất cả", "Thực phẩm", "Gia dụng", "Chăm sóc"].map((c) => (
                <Chip
                  key={c}
                  selected={c === category}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </Chip>
              ))}
            </div>
          </Section>
          <Section
            title={
              design.slug === "savings" ? "Giá mua & quyền lợi" : "Dành cho bạn"
            }
          >
            <div className="commerce-catalogue">
              {products.map((p) => (
                <Panel key={p.id} className="commerce-product">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="commerce-image w-full object-cover rounded-14"
                  />
                  <p className="text-xs text-foreground-secondary">
                    {p.category} · còn {p.stock}
                  </p>
                  <h3 className="text-base font-semibold">{p.name}</h3>
                  <strong>{money(p.price)}</strong>
                  {design.slug === "savings" && p.price >= 500000 && (
                    <p className="text-sm text-foreground-secondary">
                      {voucher
                        ? `Sau voucher: ${money(p.price - 100000)}`
                        : "Đổi ưu đãi WinMart để giảm 100.000đ"}
                    </p>
                  )}
                  <Button
                    variant="secondary"
                    onClick={() => navigate({ kind: "product", id: p.id })}
                  >
                    Xem sản phẩm
                  </Button>
                </Panel>
              ))}
            </div>
            {!products.length && (
              <p>Không tìm thấy sản phẩm. Thử từ khóa khác.</p>
            )}
          </Section>
        </>
      ),
      action: {
        label: `Giỏ hàng · ${cartItems.reduce((sum, x) => sum + x.qty, 0)} món`,
        run: () => navigate({ kind: "cart" }),
      },
    };
  }
  if (screen.kind === "product") {
    const p = s.products.find((p) => p.id === screen.id);
    if (!p) return unavailable("Sản phẩm");
    const inCart = s.cart[p.id] || 0;
    return {
      title: p.name,
      body: wrap(
        <>
          {banner(p.name, p.image)}
          <Section title="Thông tin sản phẩm">
            <Panel>
              <Line label="Giá mỗi sản phẩm" value={money(p.price)} />
              <Line label="Tồn kho" value={`${p.stock} sản phẩm`} />
              <Line label="Đã có trong giỏ" value={`${inCart} sản phẩm`} />
              <p className="text-sm text-foreground-secondary">
                {p.category} · giao trong khu Ocean Park. Giá đã gồm thuế;
                prototype miễn phí vận chuyển.
              </p>
            </Panel>
          </Section>
          <Section title="Số lượng">
            <div className="flex items-center gap-[16px]">
              <Button
                variant="secondary"
                aria-label="Giảm số lượng"
                disabled={qty <= 1}
                onClick={() => setQty(qty - 1)}
              >
                <Minus size={18} />
              </Button>
              <span className="text-xl font-semibold" aria-live="polite">
                {qty}
              </span>
              <Button
                variant="secondary"
                aria-label="Tăng số lượng"
                disabled={qty + inCart >= p.stock}
                onClick={() => setQty(qty + 1)}
              >
                <Plus size={18} />
              </Button>
            </div>
            <p className="pt-[12px] text-foreground-secondary">
              Tạm tính {money(qty * p.price)}
            </p>
          </Section>
        </>
      ),
      action: {
        label: "Thêm vào giỏ",
        disabled: qty + inCart > p.stock,
        run: () => {
          if (qty + inCart > p.stock) {
            setError("Số lượng vượt quá tồn kho.");
            return;
          }
          store.update((prev) => ({
            ...prev,
            cart: { ...prev.cart, [p.id]: (prev.cart[p.id] || 0) + qty },
          }));
          setNotice(`Đã thêm ${qty} ${p.name} vào giỏ.`);
        },
      },
      secondary: {
        label: "Xem giỏ hàng",
        run: () => navigate({ kind: "cart" }),
      },
    };
  }
  if (screen.kind === "cart")
    return {
      title: "Giỏ hàng",
      body: wrap(
        <>
          <Section
            title={
              cartItems.length ? "Sản phẩm đã chọn" : "Giỏ hàng đang trống"
            }
          >
            {cartItems.map(({ product: p, qty: q }) => (
              <Panel key={p.id} className="mb-[12px]">
                <div className="flex gap-[12px]">
                  <img
                    src={p.image}
                    alt=""
                    className="w-[72px] h-[72px] rounded-14 object-cover"
                  />
                  <div>
                    <h3 className="text-base font-semibold">{p.name}</h3>
                    <p>{money(p.price)} / sản phẩm</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[12px]">
                    <Button
                      variant="secondary"
                      size="32"
                      aria-label={`Giảm ${p.name}`}
                      onClick={() =>
                        store.update((prev) => ({
                          ...prev,
                          cart: { ...prev.cart, [p.id]: Math.max(0, q - 1) },
                        }))
                      }
                    >
                      <Minus size={16} />
                    </Button>
                    <span>{q}</span>
                    <Button
                      variant="secondary"
                      size="32"
                      aria-label={`Tăng ${p.name}`}
                      disabled={q >= p.stock}
                      onClick={() =>
                        store.update((prev) => ({
                          ...prev,
                          cart: { ...prev.cart, [p.id]: q + 1 },
                        }))
                      }
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <strong>{money(q * p.price)}</strong>
                </div>
              </Panel>
            ))}
            {!cartItems.length && (
              <p className="text-foreground-secondary">
                Chọn đồ dùng, thực phẩm và sản phẩm chăm sóc cho ngày mới.
              </p>
            )}
          </Section>
          {cartItems.length > 0 && (
            <Section title="Chi phí cuối">
              <Panel>
                <Line label="Tạm tính" value={money(subtotal)} />
                <Line
                  label="Ưu đãi WinMart"
                  value={discount ? `−${money(discount)}` : "Chưa áp dụng"}
                />
                <Line label="Giao hàng" value="Miễn phí" />
                <Line label="Tổng thanh toán" value={money(total)} />
              </Panel>
              {!discount && (
                <p className="pt-[12px] text-sm text-foreground-secondary">
                  {voucher
                    ? "Đơn từ 500.000đ được giảm 100.000đ."
                    : "Đổi ưu đãi WinMart bằng điểm trước khi thanh toán để nhận giảm giá."}
                </p>
              )}
            </Section>
          )}
        </>
      ),
      action: cartItems.length
        ? {
            label: `Thanh toán ${money(total)}`,
            run: () => navigate({ kind: "checkout" }),
          }
        : {
            label: "Khám phá sản phẩm",
            run: () => navigate({ kind: "shopping" }),
          },
      secondary:
        !voucher && cartItems.length
          ? {
              label: "Xem ưu đãi WinMart",
              run: () => navigate({ kind: "offer", id: "winmart" }),
            }
          : undefined,
    };
  if (screen.kind === "checkout")
    return {
      title: "Đặt hàng",
      body: wrap(
        <>
          <Section title={review ? "Kiểm tra đơn hàng" : "Thông tin giao hàng"}>
            {review ? (
              <Panel>
                <Line label="Người nhận" value={recipient} />
                <Line label="Điện thoại" value={phone} />
                <Line label="Địa chỉ" value={address} />
                <Line label="Nguồn tiền" value={source} />
                {cartItems.map((x) => (
                  <Line
                    key={x.product.id}
                    label={`${x.qty} × ${x.product.name}`}
                    value={money(x.qty * x.product.price)}
                  />
                ))}
              </Panel>
            ) : (
              <div className="flex flex-col gap-[12px]">
                <TextField
                  label="Tên người nhận"
                  aria-label="Tên người nhận"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
                <TextField
                  label="Số điện thoại"
                  aria-label="Số điện thoại"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <TextField
                  label="Địa chỉ giao hàng"
                  aria-label="Địa chỉ giao hàng"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <TextField
                  label="Ghi chú cho người giao"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
                <p className="text-sm font-semibold">Nguồn thanh toán</p>
                <Chip
                  selected={source === "VinPay"}
                  onClick={() => setSource("VinPay")}
                >
                  Ví VinPay · {money(s.balance)}
                </Chip>
              </div>
            )}
          </Section>
          <Section title="Tổng tiền">
            <Panel>
              <Line label="Tạm tính" value={money(subtotal)} />
              <Line
                label="Giảm giá"
                value={discount ? `−${money(discount)}` : "0đ"}
              />
              <Line label="Phí giao hàng" value="0đ" />
              <Line label="Thanh toán" value={money(total)} />
            </Panel>
            <p className="pt-[12px] text-sm text-foreground-secondary">
              Đơn mô phỏng. Xác nhận ghi nhận đơn, trừ số dư ví và làm trống giỏ
              hàng của phiên bản này.
            </p>
          </Section>
        </>
      ),
      action: {
        label: review ? `Đặt hàng · ${money(total)}` : "Kiểm tra đơn hàng",
        disabled: cartItems.length === 0,
        run: () => {
          if (!cartItems.length) {
            setError("Giỏ hàng đang trống.");
            return;
          }
          if (
            recipient.trim().length < 3 ||
            address.trim().length < 10 ||
            !/^0\d{9}$/.test(phone)
          ) {
            setError(
              "Nhập tên, địa chỉ tối thiểu 10 ký tự và số điện thoại Việt Nam 10 chữ số."
            );
            return;
          }
          if (s.balance < total) {
            setError("Số dư không đủ. Nạp thêm tiền trước khi đặt hàng.");
            return;
          }
          if (cartItems.some((x) => x.qty > x.product.stock)) {
            setError("Một sản phẩm không đủ tồn kho. Điều chỉnh giỏ hàng.");
            return;
          }
          setError("");
          if (!review) {
            setReview(true);
            return;
          }
          const r = makeRecord(
            "order",
            "Đơn hàng WinMart",
            total,
            "Đã ghi nhận đơn hàng mô phỏng",
            {
              recipient,
              phone,
              address,
              source,
              subtotal: money(subtotal),
              discount: money(discount),
              delivery: "0đ",
              items: cartItems
                .map(
                  (x) =>
                    `${x.qty} × ${x.product.name}: ${money(
                      x.qty * x.product.price
                    )}`
                )
                .join("; "),
              note: purpose,
            }
          );
          atomic(r, (prev) => ({
            ...prev,
            balance: prev.balance - total,
            cart: {},
            products: prev.products.map((p) => ({
              ...p,
              stock: p.stock - (prev.cart[p.id] || 0),
            })),
            offers: prev.offers.map((o) =>
              discount && o.id === "winmart" ? { ...o, redeemed: false } : o
            ),
          }));
        },
      },
      secondary: review
        ? { label: "Sửa thông tin", run: () => setReview(false) }
        : s.balance < total
        ? { label: "Nạp tiền", run: () => navigate({ kind: "deposit" }) }
        : undefined,
    };
  if (screen.kind === "receipt") {
    const r = s.records.find((r) => r.id === screen.id);
    if (!r) return unavailable("Biên nhận");
    const labels: Record<string,string>={care:"Lịch chăm sóc",rule:"Quy tắc nhắc",request:"Yêu cầu dịch vụ",ride:"Yêu cầu xe",food:"Yêu cầu giao món",charging:"Phiên sạc",booking:"Vé & lịch trình",offer:"Quyền lợi của bạn",order:"Đơn hàng"};
    const resultTitle=labels[r.kind]||"Biên nhận";
    const monetary=["bill","transfer","deposit","withdraw","qr","order","booking","charging"].includes(r.kind);
    const StatusIcon=/Chờ|Đang/.test(r.status)?Clock:r.kind==="care"?CalendarDays:r.kind==="rule"?SlidersHorizontal:r.kind==="offer"?Crown:r.kind==="booking"?Ticket:r.kind==="charging"?Car:CheckCircle2;
    return {
      title: resultTitle,
      body: wrap(
        <>
          <div className="px-[22px] pt-[24px]">
            <Panel className="commerce-receipt">
              <StatusIcon size={36} />
              <p className="text-sm text-foreground-secondary">
                {r.status} · bản ghi mô phỏng
              </p>
              {monetary&&<h2 className="text-2xl font-semibold">{money(r.amount)}</h2>}
              {r.kind==="offer"&&<p className="text-xl font-semibold">{Number(r.fields["Điểm đã dùng"]||0).toLocaleString("vi-VN")} VPoint đã dùng</p>}
              <h3 className="text-base font-semibold">{r.title}</h3>
              <p>{r.detail}</p>
            </Panel>
          </div>
          <Section title={monetary?"Dấu vết giao dịch":"Thông tin đã lưu"}>
            <Panel>
              <Line
                label="Thời gian"
                value={new Date(r.date).toLocaleString("vi-VN")}
              />
              <p className="text-sm text-foreground-secondary">Mã tham chiếu</p>
              <p className="text-xs break-all font-mono">{r.id}</p>
              {Object.entries(r.fields)
                .filter(([k, v]) => v && k !== "billId")
                .map(([k, v]) => (
                  <div key={k} className="py-[6px]">
                    <p className="text-xs text-foreground-secondary">
                      {(
                        {
                          provider: "Nhà cung cấp",
                          customer: "Mã khách hàng",
                          source: "Nguồn tiền",
                          recipient: "Người nhận",
                          account: "Tài khoản",
                          purpose: "Nội dung",
                          fee: "Phí",
                          balanceAfter: "Số dư sau giao dịch",
                          address: "Địa chỉ",
                          phone: "Điện thoại",
                          subtotal: "Tạm tính",
                          discount: "Giảm giá",
                          delivery: "Giao hàng",
                          items: "Sản phẩm",
                          note: "Ghi chú",
                          assignee: "Người phụ trách",
                          asset: "Tài sản",
                        } as Record<string, string>
                      )[k] || k}
                    </p>
                    <p className="text-sm break-words">{v}</p>
                  </div>
                ))}
            </Panel>
          </Section>
        </>
      ),
      action: {
        label: "Xem lịch sử",
        run: () => navigate({ kind: "activity" }),
      },
      secondary: {
        label: r.kind==="offer"?"Xem quyền lợi đã đổi":r.kind==="care"?"Xem lịch chăm sóc":r.kind==="booking"?"Khám phá chuyến đi":r.kind==="order"?"Tiếp tục mua sắm":r.kind==="rule"?"Xem các quy tắc":r.kind==="request"?"Về nhà và xe":"Về ví VinPay",
        run: () => navigate({ kind: r.kind==="offer"?"account":r.kind==="care"?"activity":r.kind==="booking"?"experiences":r.kind==="order"?"shopping":r.kind==="rule"?"account":r.kind==="request"?"life":"wallet" }),
      },
    };
  }
  return unavailable("Dịch vụ");
}
