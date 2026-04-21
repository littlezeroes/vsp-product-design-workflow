"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Eye,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  CHANNELS,
  MOCK_TRANSACTIONS,
  SERVICES,
  STATUSES,
  TX_TYPES,
  formatDateTime,
  formatVND,
} from "./_data/mock";
import { StatusPill, TypePill } from "./_components/status-pill";
import { StatCard } from "./_components/stat-card";
import { PortalButton } from "./_components/portal-button";

type SortDir = "latest" | "oldest";

const TODAY = "2026-04-21";
const fmtDate30 = () => {
  const d = new Date("2026-04-21T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - 30);
  return d.toISOString().slice(0, 10);
};

export default function TransactionListPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-sm text-muted-foreground">Loading transactions…</div>
      }
    >
      <TransactionListInner />
    </Suspense>
  );
}

function TransactionListInner() {
  const router = useRouter();
  const sp = useSearchParams();

  // Init from URL so Back from detail preserves filters.
  const [refId, setRefId] = useState(() => sp.get("ref") ?? "");
  const [search, setSearch] = useState(() => sp.get("q") ?? "");
  const [phone, setPhone] = useState(() => sp.get("phone") ?? "");
  const [channel, setChannel] = useState(() => sp.get("ch") ?? "All");
  const [status, setStatus] = useState(() => sp.get("st") ?? "All");
  const [txType, setTxType] = useState(() => sp.get("ty") ?? "All");
  const [fromDate, setFromDate] = useState(() => sp.get("from") ?? fmtDate30());
  const [toDate, setToDate] = useState(() => sp.get("to") ?? TODAY);
  const [errorMessage, setErrorMessage] = useState(() => sp.get("em") ?? "");
  const [errorCode, setErrorCode] = useState(() => sp.get("ec") ?? "");
  const [services, setServices] = useState<string[]>(
    () => sp.get("svc")?.split("|").filter(Boolean) ?? [],
  );
  const [originalRefId, setOriginalRefId] = useState(() => sp.get("oref") ?? "");
  const [partnerRefId, setPartnerRefId] = useState(() => sp.get("pref") ?? "");
  const [txCode, setTxCode] = useState(() => sp.get("code") ?? "");
  const [filterOpen, setFilterOpen] = useState(false);

  const [sort, setSort] = useState<SortDir>(
    () => (sp.get("sort") === "oldest" ? "oldest" : "latest"),
  );
  const [perPage, setPerPage] = useState(() => Number(sp.get("pp")) || 10);
  const [page, setPage] = useState(() => Number(sp.get("p")) || 1);

  // Sync state back to URL (so row-click → detail → back preserves everything)
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (refId) params.set("ref", refId);
    if (phone) params.set("phone", phone);
    if (channel !== "All") params.set("ch", channel);
    if (status !== "All") params.set("st", status);
    if (txType !== "All") params.set("ty", txType);
    if (fromDate !== fmtDate30()) params.set("from", fromDate);
    if (toDate !== TODAY) params.set("to", toDate);
    if (errorMessage) params.set("em", errorMessage);
    if (errorCode) params.set("ec", errorCode);
    if (services.length) params.set("svc", services.join("|"));
    if (originalRefId) params.set("oref", originalRefId);
    if (partnerRefId) params.set("pref", partnerRefId);
    if (txCode) params.set("code", txCode);
    if (sort !== "latest") params.set("sort", sort);
    if (perPage !== 10) params.set("pp", String(perPage));
    if (page !== 1) params.set("p", String(page));
    const q = params.toString();
    const url = q ? `/transaction-360?${q}` : "/transaction-360";
    window.history.replaceState(null, "", url);
  }, [
    search, refId, phone, channel, status, txType, fromDate, toDate,
    errorMessage, errorCode, services, originalRefId, partnerRefId, txCode,
    sort, perPage, page,
  ]);

  const filtered = useMemo(() => {
    const list = MOCK_TRANSACTIONS.filter((t) => {
      if (search) {
        const s = search.toLowerCase();
        if (
          !t.refId.toLowerCase().includes(s) &&
          !t.transactionCode.includes(search) &&
          !t.senderPhone.includes(search) &&
          !t.receiverPhone.includes(search) &&
          !t.serviceName.toLowerCase().includes(s)
        )
          return false;
      }
      if (refId && !t.refId.includes(refId)) return false;
      if (phone && !(t.senderPhone.includes(phone) || t.receiverPhone.includes(phone)))
        return false;
      if (channel !== "All" && t.channel !== channel) return false;
      if (status !== "All" && t.status !== status) return false;
      if (txType !== "All" && t.type !== txType) return false;
      if (errorMessage && !(t.errorMessage ?? "").toLowerCase().includes(errorMessage.toLowerCase()))
        return false;
      if (errorCode && t.errorCode !== errorCode) return false;
      if (services.length && !services.includes(t.serviceName)) return false;
      if (originalRefId && (t.originalRefId ?? "") !== originalRefId) return false;
      if (partnerRefId && (t.partnerRefId ?? "") !== partnerRefId) return false;
      if (txCode && !t.transactionCode.includes(txCode)) return false;
      const d = new Date(t.createdAt).getTime();
      if (d < new Date(fromDate).getTime()) return false;
      if (d > new Date(toDate).getTime() + 24 * 3600 * 1000) return false;
      return true;
    });
    list.sort((a, b) => {
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sort === "latest" ? diff : -diff;
    });
    return list;
  }, [
    search, refId, phone, channel, status, txType, errorMessage, errorCode, services,
    originalRefId, partnerRefId, txCode, fromDate, toDate, sort,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageStart = (page - 1) * perPage;
  const paged = filtered.slice(pageStart, pageStart + perPage);

  const stats = useMemo(() => {
    const all = MOCK_TRANSACTIONS.length;
    const done = MOCK_TRANSACTIONS.filter((t) => t.status === "done").length;
    const pending = MOCK_TRANSACTIONS.filter(
      (t) => t.status === "pending" || t.status === "processing",
    ).length;
    const failed = MOCK_TRANSACTIONS.filter(
      (t) => t.status === "failed" || t.status === "refused",
    ).length;
    const reversed = MOCK_TRANSACTIONS.filter(
      (t) => t.status === "reversed" || t.status === "refunded",
    ).length;
    const total = MOCK_TRANSACTIONS.filter((t) => t.status === "done").reduce(
      (s, t) => s + t.amount,
      0,
    );
    return [
      { label: "Tổng giao dịch", value: all.toLocaleString("vi-VN") },
      { label: "Thành công", value: done.toLocaleString("vi-VN"), valueColor: "text-emerald-600" },
      { label: "Đang xử lý", value: pending.toLocaleString("vi-VN"), valueColor: "text-orange-500" },
      { label: "Thất bại", value: failed.toLocaleString("vi-VN"), valueColor: "text-red-500" },
      { label: "Đã hoàn/đảo", value: reversed.toLocaleString("vi-VN") },
      { label: "Tổng giá trị", value: `${formatVND(total)} ₫` },
    ];
  }, []);

  const resetFilters = () => {
    setRefId("");
    setPhone("");
    setChannel("All");
    setStatus("All");
    setTxType("All");
    setFromDate(fmtDate30());
    setToDate(TODAY);
    setErrorMessage("");
    setErrorCode("");
    setServices([]);
    setOriginalRefId("");
    setPartnerRefId("");
    setTxCode("");
    setSearch("");
    setPage(1);
    toast.success("Đã reset bộ lọc", {
      description: "Tất cả filter đã về mặc định (30 ngày gần nhất).",
    });
  };

  const toggleService = (s: string) => {
    setServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const activeFilterCount =
    [refId, phone, errorMessage, errorCode, originalRefId, partnerRefId, txCode].filter(Boolean)
      .length +
    (channel !== "All" ? 1 : 0) +
    (status !== "All" ? 1 : 0) +
    (txType !== "All" ? 1 : 0) +
    services.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start md:items-center justify-between gap-3 flex-col md:flex-row">
        <div>
          <h1 className="text-xl font-bold">Transaction 360</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tra cứu, theo dõi và phân tích toàn bộ vòng đời giao dịch trong hệ thống.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <PortalButton variant="outline" size="sm" onClick={resetFilters}>
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            Refresh
          </PortalButton>
          <PortalButton
            size="sm"
            onClick={() => {
              if (filtered.length === 0) {
                toast.warning("Không có giao dịch nào để export");
                return;
              }
              exportCSV(filtered);
              toast.success(`Đã export ${filtered.length} giao dịch`, {
                description: "File CSV đã được tải xuống.",
              });
            }}
          >
            <Download className="mr-1 h-3.5 w-3.5" />
            Export
          </PortalButton>
        </div>
      </div>

      {/* Stat Cards — responsive: 2→3→6 cols, last card wider on xl */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-[repeat(5,minmax(0,1fr))_minmax(0,1.8fr)] gap-3 md:gap-4">
        {stats.map((s, i) => (
          <StatCard
            key={s.label}
            {...s}
            className={cn(i === 5 && "col-span-2 md:col-span-3 lg:col-span-1")}
          />
        ))}
      </div>

      {/* Table Section */}
      <div id="tx-table" className="rounded-lg border bg-card scroll-mt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b gap-2 sm:gap-4">
          <h2 className="text-sm font-semibold">Danh sách giao dịch</h2>
          <div className="flex items-center gap-2 sm:flex-1 sm:justify-end">
            <div className="relative w-full sm:w-80 sm:max-w-full">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground z-10" />
              <Input
                placeholder="Tìm theo RefID, phone, service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-9 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Filter row */}
        <div className="flex items-center justify-between px-4 py-3 border-b gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <FilterSelect
              label="Channel"
              value={channel}
              onChange={setChannel}
              options={["All", ...CHANNELS]}
            />
            <FilterSelect
              label="Status"
              value={status}
              onChange={setStatus}
              options={["All", ...STATUSES]}
            />
            <FilterSelect
              label="Type"
              value={txType}
              onChange={setTxType}
              options={["All", ...TX_TYPES]}
            />
            <DateRangePicker
              fromDate={fromDate}
              toDate={toDate}
              onFromChange={setFromDate}
              onToChange={setToDate}
            />
            <Popover>
              <PopoverTrigger asChild>
                <PortalButton variant="outline" size="sm">
                  <SlidersHorizontal className="mr-1 h-3.5 w-3.5" />
                  Services
                  {services.length > 0 && (
                    <span className="ml-1 rounded-full bg-primary text-primary-foreground text-[10px] px-1.5 py-0">
                      {services.length}
                    </span>
                  )}
                </PortalButton>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="start">
                <div className="max-h-80 overflow-y-auto py-1">
                  {SERVICES.map((s) => (
                    <label
                      key={s}
                      className="flex items-center gap-2 px-3 py-3 hover:bg-muted text-xs cursor-pointer"
                    >
                      <Checkbox
                        checked={services.includes(s)}
                        onChange={() => toggleService(s)}
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <PortalButton variant="outline" size="sm">
                  <SlidersHorizontal className="mr-1 h-3.5 w-3.5" />
                  More filters
                  {activeFilterCount > 0 && (
                    <span className="ml-1 rounded-full bg-primary text-primary-foreground text-[10px] px-1.5 py-0">
                      {activeFilterCount}
                    </span>
                  )}
                </PortalButton>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-3 space-y-2" align="start">
                <MiniField label="Transaction Ref ID">
                  <MiniInput value={refId} onChange={setRefId} placeholder="e.g. 7a3f..." />
                </MiniField>
                <MiniField label="Phone (Sender/Receiver)">
                  <MiniInput value={phone} onChange={setPhone} placeholder="0912..." />
                </MiniField>
                <MiniField label="Transaction Code">
                  <MiniInput value={txCode} onChange={setTxCode} placeholder="26041401..." />
                </MiniField>
                <MiniField label="Error Message">
                  <MiniInput value={errorMessage} onChange={setErrorMessage} placeholder="Insufficient..." />
                </MiniField>
                <MiniField label="Error Code">
                  <MiniInput value={errorCode} onChange={setErrorCode} placeholder="E4001" />
                </MiniField>
                <MiniField label="Original Transaction Ref ID">
                  <MiniInput value={originalRefId} onChange={setOriginalRefId} placeholder="reversal/refund" />
                </MiniField>
                <MiniField label="Partner Ref ID">
                  <MiniInput value={partnerRefId} onChange={setPartnerRefId} placeholder="Partner..." />
                </MiniField>
                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                  <PortalButton variant="outline" size="sm" onClick={resetFilters}>
                    Reset
                  </PortalButton>
                  <PortalButton size="sm" onClick={() => setFilterOpen(false)}>
                    Apply
                  </PortalButton>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Sort</span>
            <Select value={sort} onValueChange={(v) => setSort(v as SortDir)}>
              <SelectTrigger size="sm" className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto [&_th:first-child]:pl-4 [&_td:first-child]:pl-4 [&_th:last-child]:pr-4 [&_td:last-child]:pr-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs whitespace-nowrap">Ref ID</TableHead>
                <TableHead className="text-xs whitespace-nowrap">Tx Code</TableHead>
                <TableHead className="text-xs">Service</TableHead>
                <TableHead className="text-xs whitespace-nowrap">Source</TableHead>
                <TableHead className="text-xs whitespace-nowrap">Status</TableHead>
                <TableHead className="text-xs whitespace-nowrap">Sender</TableHead>
                <TableHead className="text-xs whitespace-nowrap">Receiver</TableHead>
                <TableHead className="text-xs whitespace-nowrap text-right">Amount</TableHead>
                <TableHead className="text-xs whitespace-nowrap">Type</TableHead>
                <TableHead className="text-xs whitespace-nowrap">Channel</TableHead>
                <TableHead className="text-xs whitespace-nowrap">Created At</TableHead>
                <TableHead className="text-xs w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((t) => (
                <TableRow
                  key={t.id}
                  className="group cursor-pointer"
                  onClick={() => router.push(`/transaction-360/${t.id}`)}
                >
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs text-foreground group-hover:underline">
                        {t.refId.slice(0, 8)}…{t.refId.slice(-6)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard?.writeText(t.refId);
                        }}
                        aria-label="Copy RefId"
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                    {t.transactionCode.slice(0, 14)}
                  </TableCell>
                  <TableCell className="py-3 text-xs">{t.serviceName}</TableCell>
                  <TableCell className="py-3 text-xs capitalize text-muted-foreground">
                    {t.source}
                  </TableCell>
                  <TableCell className="py-3">
                    <StatusPill status={t.status} />
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="text-xs">{t.senderPhone}</div>
                    <div className="text-[10px] text-muted-foreground capitalize">
                      {t.senderClient}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="text-xs">{t.receiverPhone}</div>
                    <div className="text-[10px] text-muted-foreground capitalize">
                      {t.receiverClient}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-right text-xs font-medium">
                    {formatVND(t.amount)}
                    <span className="text-muted-foreground ml-0.5">₫</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <TypePill type={t.type} />
                  </TableCell>
                  <TableCell className="py-3 text-xs capitalize text-muted-foreground">
                    {t.channel}
                  </TableCell>
                  <TableCell className="py-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                    {formatDateTime(t.createdAt)}
                  </TableCell>
                  <TableCell
                    className="py-3.5 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <PortalButton variant="ghost" size="icon-sm">
                          <Eye className="h-3.5 w-3.5" />
                        </PortalButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/transaction-360/${t.id}`}>
                            <Eye className="mr-2 h-3.5 w-3.5" /> Detail
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {paged.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={12}
                    className="py-16 text-center text-muted-foreground text-sm"
                  >
                    Không có giao dịch nào khớp bộ lọc.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t text-xs text-muted-foreground">
          <span>
            {filtered.length === 0 ? 0 : pageStart + 1}–
            {Math.min(pageStart + perPage, filtered.length)} (Tổng:{" "}
            {filtered.length.toLocaleString("vi-VN")})
          </span>
          <div className="flex items-center gap-1.5">
            <PortalButton
              variant="outline"
              size="icon-sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </PortalButton>
            {(() => {
              const maxVisible = 5;
              const start = Math.max(
                1,
                Math.min(page - Math.floor(maxVisible / 2), totalPages - maxVisible + 1),
              );
              const end = Math.min(totalPages, start + maxVisible - 1);
              return Array.from({ length: end - start + 1 }).map((_, i) => {
                const pn = start + i;
                return (
                  <PortalButton
                    key={pn}
                    variant={pn === page ? "default" : "outline"}
                    size="icon-sm"
                    onClick={() => setPage(pn)}
                  >
                    {pn}
                  </PortalButton>
                );
              });
            })()}
            <PortalButton
              variant="outline"
              size="icon-sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </PortalButton>
            <div className="flex items-center gap-1 ml-1">
              <span className="text-xs">Go to</span>
              <Input
                type="number"
                min={1}
                max={totalPages}
                value={page}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (!isNaN(n) && n >= 1 && n <= totalPages) setPage(n);
                }}
                className="h-7 w-14 px-2 text-xs text-center"
              />
              <span className="text-xs">/ {totalPages}</span>
            </div>
            <Select
              value={String(perPage)}
              onValueChange={(v) => {
                setPerPage(Number(v));
                setPage(1);
              }}
            >
              <SelectTrigger size="sm" className="h-7 ml-1 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 50].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}/trang
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" className="h-8 text-xs gap-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="h-4 w-px bg-border" />
        <SelectValue className="capitalize" />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o} className="capitalize">
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function DateRangePicker({
  fromDate,
  toDate,
  onFromChange,
  onToChange,
}: {
  fromDate: string;
  toDate: string;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
}) {
  const invalid = new Date(fromDate).getTime() > new Date(toDate).getTime();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <PortalButton
          variant="outline"
          size="sm"
          className={cn(invalid && "border-destructive text-destructive")}
        >
          <SlidersHorizontal className="mr-1 h-3.5 w-3.5" />
          {fromDate} → {toDate}
        </PortalButton>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3 space-y-2" align="start">
        <MiniField label="From">
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => onFromChange(e.target.value)}
            className="h-8 px-2 text-xs"
            aria-invalid={invalid}
          />
        </MiniField>
        <MiniField label="To">
          <Input
            type="date"
            value={toDate}
            onChange={(e) => onToChange(e.target.value)}
            className="h-8 px-2 text-xs"
            aria-invalid={invalid}
          />
        </MiniField>
        {invalid && (
          <p className="text-[11px] text-destructive">
            From Date phải ≤ To Date
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}

function MiniField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-medium text-muted-foreground mb-1">{label}</div>
      {children}
    </div>
  );
}

function MiniInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-8 px-2 text-xs"
    />
  );
}

/* Export the currently filtered transactions to CSV. */
function exportCSV(
  rows: Array<{
    refId: string;
    transactionCode: string;
    serviceName: string;
    source: string;
    status: string;
    senderPhone: string;
    senderClient: string;
    receiverPhone: string;
    receiverClient: string;
    amount: number;
    currency: string;
    type: string;
    channel: string;
    createdAt: string;
  }>,
) {
  const headers = [
    "Ref ID",
    "Tx Code",
    "Service",
    "Source",
    "Status",
    "Sender Phone",
    "Sender Client",
    "Receiver Phone",
    "Receiver Client",
    "Amount",
    "Currency",
    "Type",
    "Channel",
    "Created At",
  ];
  const escape = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.map(escape).join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.refId,
        r.transactionCode,
        r.serviceName,
        r.source,
        r.status,
        r.senderPhone,
        r.senderClient,
        r.receiverPhone,
        r.receiverClient,
        r.amount,
        r.currency,
        r.type,
        r.channel,
        formatDateTime(r.createdAt),
      ]
        .map(escape)
        .join(","),
    );
  }
  // BOM for Excel Vietnamese compat
  const blob = new Blob(["﻿" + lines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
