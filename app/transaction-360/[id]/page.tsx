"use client";

import Link from "next/link";
import { use, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatVND,
  getTransactionDetail,
  type StageLog,
  type SubStep,
} from "../_data/mock";
import { StatusPill, TypePill } from "../_components/status-pill";
import { PortalButton } from "../_components/portal-button";
import { useRole, ROLE_META } from "../_components/use-role";

export default function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const detail = getTransactionDetail(id);
  const [role] = useRole();
  const roleMeta = ROLE_META[role];
  const [unmasked, setUnmasked] = useState(roleMeta.defaultUnmasked);
  const [activeStage, setActiveStage] = useState<StageLog["stage"]>("START");
  const [verifyTab, setVerifyTab] = useState<"verify" | "gl">("verify");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [jsonOpen, setJsonOpen] = useState<Record<string, boolean>>({});

  if (!detail) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <div className="text-sm text-muted-foreground mb-2">Không tìm thấy giao dịch.</div>
        <Link href="/transaction-360" className="text-sm text-blue-600 hover:underline">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  // BRD: Stage node only displayed if has data in transStepLog
  const visibleStages = detail.stages.filter((s) => {
    if (s.stage === "START") return !!s.inputMessage;
    if (s.stage === "END") return !!s.outputMessage;
    if (s.stage === "CONFIRM") return !!s.authMethod;
    return (s.subSteps?.length ?? 0) > 0;
  });

  const activeStageLog =
    visibleStages.find((s) => s.stage === activeStage) ?? visibleStages[0];

  const maskPhone = (p: string) =>
    unmasked ? p : p.length >= 7 ? `${p.slice(0, 3)}****${p.slice(-3)}` : p;

  return (
    <div className="space-y-4">
      {/* Top nav row — back + breadcrumb-style title */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <PortalButton variant="outline" size="icon" asChild>
            <Link href="/transaction-360" aria-label="Back to list">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </PortalButton>
          <h1 className="text-xl font-bold leading-tight truncate">
            Detail Transaction
            <span className="text-muted-foreground font-normal ml-1.5">
              (RefId:{detail.refId.slice(0, 10)}…)
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <PortalButton
            variant="outline"
            size="sm"
            disabled={!roleMeta.canUnmask}
            title={!roleMeta.canUnmask ? "Role không có quyền unmask" : undefined}
            onClick={() => setUnmasked((v) => !v)}
          >
            {unmasked ? (
              <EyeOff className="mr-1 h-3.5 w-3.5" />
            ) : (
              <Eye className="mr-1 h-3.5 w-3.5" />
            )}
            {unmasked ? "Mask phones" : "Unmask phones"}
          </PortalButton>
          <PortalButton
            variant="outline"
            size="sm"
            onClick={() => navigator.clipboard?.writeText(detail.refId)}
          >
            <Copy className="mr-1 h-3.5 w-3.5" />
            Copy RefId
          </PortalButton>
        </div>
      </div>

      {/* Hero — single panel, strong hierarchy: title+amount → meta → identifiers */}
      <section className="rounded-lg border bg-card">
        {/* Row 1: title left, amount right */}
        <div className="p-6 flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <h2 className="text-[24px] font-semibold text-foreground leading-tight">
              {detail.serviceName}
            </h2>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <StatusPill status={detail.status} />
              <TypePill type={detail.type} />
              <span className="text-xs text-muted-foreground capitalize">
                · {detail.channel} · {detail.source}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[11px] font-medium text-muted-foreground mb-1">Amount</div>
            <div className="text-[32px] font-semibold tabular-nums tracking-tight leading-none">
              {formatVND(detail.amount)}
              <span className="text-muted-foreground">&nbsp;₫</span>
            </div>
          </div>
        </div>

        {/* Row 2: From / To */}
        <div className="px-6 pb-4">
          <dl className="grid grid-cols-[80px_1fr] gap-y-1 text-sm">
            <dt className="text-muted-foreground text-xs pt-0.5">From</dt>
            <dd>
              <span className="font-medium">{maskPhone(detail.senderPhone)}</span>{" "}
              <span className="text-muted-foreground capitalize text-xs">
                {detail.senderClient}
              </span>
            </dd>
            <dt className="text-muted-foreground text-xs pt-0.5">To</dt>
            <dd>
              <span className="font-medium">{maskPhone(detail.receiverPhone)}</span>{" "}
              <span className="text-muted-foreground capitalize text-xs">
                {detail.receiverShortName ?? detail.receiverClient}
              </span>
            </dd>
          </dl>
        </div>

        {/* Row 3: identifiers — 2-col definition list, label fixed width */}
        <div className="px-6 py-4 border-t grid grid-cols-2 gap-x-8 gap-y-2">
          <DefRow label="Ref ID" value={detail.refId} mono copy />
          <DefRow label="Code" value={detail.transactionCode} mono copy />
          <DefRow label="Device ID" value={detail.deviceId} mono />
          <DefRow label="IP" value={detail.ip} mono />
          <DefRow label="Beneficiary" value={detail.receiverName ?? "—"} />
          <DefRow label="Message" value={detail.message ?? "—"} />
        </div>
      </section>

      {/* Bottom row: [Stages | Stage Details] — 2 cột */}
      <div className="grid grid-cols-[300px_1fr] gap-4">
        <section className="rounded-lg border bg-card self-start">
          <div className="p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Stages
            </div>
            <Timeline
              stages={visibleStages}
              active={activeStage}
              onSelect={(s) => {
                setActiveStage(s);
                if (s === "VERIFY") setVerifyTab("verify");
              }}
            />
          </div>
        </section>

        {/* Panel 3: Stage Details */}
        <section className="rounded-lg border bg-card min-h-[560px]">
          <header className="h-11 px-4 flex items-center justify-between border-b">
            <div className="text-sm font-semibold">
              Stage Details
              <span className="text-muted-foreground font-normal ml-1.5">· {activeStage}</span>
            </div>
            {activeStageLog?.timestamp && (
              <div className="text-xs text-muted-foreground font-mono">
                {activeStageLog.timestamp}
              </div>
            )}
          </header>

          {activeStage === "VERIFY" && (
            <div className="flex gap-1 px-4 pt-3 border-b">
              {(["verify", "gl"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setVerifyTab(t)}
                  className={cn(
                    "h-9 px-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                    verifyTab === t
                      ? "text-foreground border-foreground"
                      : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  {t === "verify" ? "VERIFY" : "GL Posting"}
                </button>
              ))}
            </div>
          )}

          <div className="p-4">
            {activeStage === "START" && activeStageLog?.inputMessage && (
              <KeyValueList
                data={activeStageLog.inputMessage}
                title="Input Message"
                maskPhone={maskPhone}
              />
            )}

            {activeStage === "REQUEST" && (
              <SubStepList
                subSteps={activeStageLog?.subSteps ?? []}
                expanded={expanded}
                setExpanded={setExpanded}
                prefix="req"
              />
            )}

            {activeStage === "CONFIRM" && (
              <ConfirmDetails
                authMethod={activeStageLog?.authMethod}
                bioRequired={activeStageLog?.bioRequired}
                timestamp={activeStageLog?.timestamp}
              />
            )}

            {activeStage === "VERIFY" && verifyTab === "verify" && (
              <SubStepList
                subSteps={activeStageLog?.subSteps ?? []}
                expanded={expanded}
                setExpanded={setExpanded}
                prefix="ver"
              />
            )}

            {activeStage === "VERIFY" && verifyTab === "gl" && (
              <GLPostingList entries={detail.glPosting} />
            )}

            {activeStage === "END" && activeStageLog?.outputMessage && (
              <OutputMessage
                data={activeStageLog.outputMessage}
                jsonOpen={jsonOpen}
                setJsonOpen={setJsonOpen}
                maskPhone={maskPhone}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------- InfoRow ---------- */

/* Definition-list row — label fixed width left, value right, aligned column. */
function DefRow({
  label,
  value,
  mono,
  copy,
}: {
  label: string;
  value: string;
  mono?: boolean;
  copy?: boolean;
}) {
  return (
    <div className="grid grid-cols-[100px_1fr] items-baseline gap-3 min-w-0 group">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="min-w-0 flex items-center gap-1.5">
        <span
          className={cn(
            "text-sm truncate",
            mono && "font-mono text-[13px]",
          )}
          title={value}
        >
          {value}
        </span>
        {copy && (
          <button
            onClick={() => navigator.clipboard?.writeText(value)}
            aria-label={`Copy ${label}`}
            className="opacity-0 group-hover:opacity-100 h-6 w-6 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground shrink-0"
          >
            <Copy className="w-3 h-3" />
          </button>
        )}
      </dd>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono,
  copy,
  capitalize,
  truncate,
}: {
  label: string;
  value: string;
  mono?: boolean;
  copy?: boolean;
  capitalize?: boolean;
  truncate?: boolean;
}) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] text-muted-foreground mb-0.5">{label}</div>
      <div className="flex items-center gap-1.5 group min-w-0">
        <span
          className={cn(
            "text-sm text-foreground min-w-0",
            mono && "font-mono text-xs",
            capitalize && "capitalize",
            truncate && "truncate",
          )}
          title={value}
        >
          {value}
        </span>
        {copy && (
          <button
            onClick={() => navigator.clipboard?.writeText(value)}
            className="opacity-0 group-hover:opacity-100 h-6 w-6 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground shrink-0"
            aria-label={`Copy ${label}`}
          >
            <Copy className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------- Timeline ---------- */

function HorizontalStages({
  stages,
  active,
  onSelect,
}: {
  stages: StageLog[];
  active: StageLog["stage"];
  onSelect: (s: StageLog["stage"]) => void;
}) {
  const label = (s: StageLog["stage"]) =>
    s === "START"
      ? "Start"
      : s === "REQUEST"
      ? "Request"
      : s === "CONFIRM"
      ? "Confirm"
      : s === "VERIFY"
      ? "Verify"
      : "End";

  return (
    <div className="rounded-lg border bg-card p-1">
      <div className="flex items-stretch gap-1">
        {stages.map((s, i) => {
          const isActive = s.stage === active;
          return (
            <button
              key={s.stage}
              onClick={() => onSelect(s.stage)}
              className={cn(
                "flex-1 min-w-0 flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left",
                isActive ? "bg-muted" : "hover:bg-muted/50",
              )}
            >
              <span
                className={cn(
                  "inline-flex items-center justify-center size-7 rounded-full text-xs font-semibold shrink-0",
                  isActive
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground",
                )}
                aria-hidden
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <div
                  className={cn(
                    "text-sm",
                    isActive ? "font-semibold text-foreground" : "font-medium text-foreground/80",
                  )}
                >
                  {label(s.stage)}
                </div>
                {s.timestamp ? (
                  <div className="text-[11px] text-muted-foreground font-mono truncate">
                    {s.timestamp.slice(11)}
                  </div>
                ) : (
                  <div className="text-[11px] text-muted-foreground">
                    {s.stage === "START" ? "Input" : "Output"}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const STAGE_LABEL: Record<StageLog["stage"], string> = {
  START: "Start",
  REQUEST: "Request",
  CONFIRM: "Confirm",
  VERIFY: "Verify",
  END: "End",
};

function Timeline({
  stages,
  active,
  onSelect,
}: {
  stages: StageLog[];
  active: StageLog["stage"];
  onSelect: (s: StageLog["stage"]) => void;
}) {
  return (
    <ol className="relative">
      {stages.map((s, i) => {
        const isActive = s.stage === active;
        return (
          <li key={s.stage} className="relative">
            {i < stages.length - 1 && (
              <span className="absolute left-[7px] top-5 bottom-0 w-px bg-border" aria-hidden />
            )}
            <button
              onClick={() => onSelect(s.stage)}
              className={cn(
                "flex items-start gap-3 w-full py-1.5 px-2 -mx-2 rounded-md transition-colors text-left",
                isActive ? "bg-muted" : "hover:bg-muted/50",
              )}
            >
              <span
                className={cn(
                  "size-[14px] rounded-full shrink-0 mt-[3px] relative z-10 border-2 border-card",
                  isActive ? "bg-foreground" : "bg-muted-foreground/40",
                )}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div
                  className={cn(
                    "text-sm",
                    isActive ? "font-semibold text-foreground" : "font-medium text-foreground/80",
                  )}
                >
                  {STAGE_LABEL[s.stage]}
                </div>
                {s.timestamp && (
                  <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                    {s.timestamp}
                  </div>
                )}
                {s.stage === "CONFIRM" && s.authMethod && (
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Auth: <span className="text-foreground">{s.authMethod}</span>
                    {s.bioRequired ? " · required" : ""}
                  </div>
                )}
              </div>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------- SubStepList ---------- */

function SubStepList({
  subSteps,
  expanded,
  setExpanded,
  prefix,
}: {
  subSteps: SubStep[];
  expanded: Record<string, boolean>;
  setExpanded: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  prefix: string;
}) {
  if (!subSteps.length)
    return <div className="text-muted-foreground text-sm">No data</div>;
  return (
    <div className="space-y-2">
      {subSteps.map((s, i) => {
        const key = `${prefix}-${i}`;
        const canExpand = !!s.details?.length;
        const open = !!expanded[key];
        return (
          <div key={key} className="rounded-md border bg-muted/30 overflow-hidden">
            <button
              onClick={() =>
                canExpand && setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
              }
              className={cn(
                "w-full flex items-center gap-2 px-3 h-10",
                canExpand ? "hover:bg-muted" : "",
              )}
            >
              <CheckCircle2
                className={cn(
                  "w-4 h-4",
                  s.status === "pass" && "text-emerald-600",
                  s.status === "fail" && "text-red-600",
                  s.status === "skip" && "text-muted-foreground",
                )}
              />
              <span className="text-sm text-foreground font-medium flex-1 text-left">
                {s.name}
                {s.count !== undefined && (
                  <span className="text-muted-foreground font-normal ml-1">({s.count})</span>
                )}
              </span>
              {canExpand && (
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 text-muted-foreground transition-transform",
                    open && "rotate-180",
                  )}
                />
              )}
            </button>
            {canExpand && open && (
              <div className="border-t bg-card divide-y">
                {s.details!.map((d, di) => (
                  <div key={di} className="flex items-center gap-3 px-3 py-2 text-xs">
                    <CheckCircle2
                      className={cn(
                        "w-3 h-3 shrink-0",
                        d.status === "pass" ? "text-emerald-600" : "text-red-600",
                      )}
                    />
                    <span className="text-muted-foreground w-40 shrink-0">{d.label}</span>
                    <span className="text-foreground font-mono break-all">{d.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- ConfirmDetails ---------- */

function ConfirmDetails({
  authMethod,
  bioRequired,
  timestamp,
}: {
  authMethod?: string;
  bioRequired?: boolean;
  timestamp?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 max-w-lg">
      <div className="rounded-md border bg-muted/30 p-3 col-span-2">
        <div className="text-[11px] text-muted-foreground mb-1">Timestamp</div>
        <div className="text-sm font-mono">{timestamp ?? "—"}</div>
      </div>
      <div className="rounded-md border bg-muted/30 p-3">
        <div className="text-[11px] text-muted-foreground mb-1">Authentication Method</div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center h-7 px-2.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold">
            {authMethod ?? "NONE"}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {authMethod === "OTP" && "One-Time Password"}
            {authMethod === "PIN" && "Personal PIN"}
            {authMethod === "TPIN" && "Transaction PIN"}
            {authMethod === "BIO" && "Biometric"}
            {authMethod === "SIG" && "Signature"}
          </span>
        </div>
      </div>
      <div className="rounded-md border bg-muted/30 p-3">
        <div className="text-[11px] text-muted-foreground mb-1">BIO Required</div>
        <div className="text-sm font-mono">{bioRequired ? "true" : "false"}</div>
      </div>
    </div>
  );
}

/* ---------- GL Posting ---------- */

function GLPostingList({
  entries,
}: {
  entries: {
    title: string;
    debit: { amount: number; from: string; type: "WALLET" | "GL" };
    credit: { amount: number; to: string; type: "WALLET" | "GL" };
    timestamp: string;
  }[];
}) {
  if (!entries.length)
    return <div className="text-muted-foreground text-sm">No GL entries</div>;
  return (
    <div className="space-y-3">
      {entries.map((e, i) => (
        <div key={i} className="rounded-lg border bg-card overflow-hidden">
          <div className="flex items-center justify-between h-10 px-3 border-b bg-muted/30">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-bold">
                {i + 1}
              </span>
              {e.title}
            </div>
            <div className="text-[11px] text-muted-foreground font-mono">{e.timestamp}</div>
          </div>
          <div className="grid grid-cols-2 divide-x">
            <div className="p-3">
              <div className="flex items-center gap-1.5 text-[11px] text-red-600 font-semibold uppercase mb-1">
                <ArrowUpRight className="w-3 h-3" /> Debit
              </div>
              <div className="text-base font-bold">
                {formatVND(e.debit.amount)}
                <span className="text-[11px] text-muted-foreground font-normal ml-1">VND</span>
              </div>
              <div className="text-xs text-foreground/80 mt-1">
                <span className="text-muted-foreground">from</span> {e.debit.from}
              </div>
              <span className="inline-flex mt-1.5 items-center h-5 px-1.5 rounded bg-red-50 text-red-600 text-[10px] font-medium border border-red-100">
                {e.debit.type}
              </span>
            </div>
            <div className="p-3">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold uppercase mb-1">
                <ArrowDownLeft className="w-3 h-3" /> Credit
              </div>
              <div className="text-base font-bold">
                {formatVND(e.credit.amount)}
                <span className="text-[11px] text-muted-foreground font-normal ml-1">VND</span>
              </div>
              <div className="text-xs text-foreground/80 mt-1">
                <span className="text-muted-foreground">to</span> {e.credit.to}
              </div>
              <span className="inline-flex mt-1.5 items-center h-5 px-1.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-medium border border-emerald-100">
                {e.credit.type}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Input Message (key-value list) ---------- */

function KeyValueList({
  data,
  title,
  maskPhone,
}: {
  data: Record<string, string | number | object>;
  title?: string;
  maskPhone?: (s: string) => string;
}) {
  const entries = Object.entries(data);
  const phoneKeys = new Set(["SENDERPHONE", "RECEIVERPHONE"]);
  return (
    <div>
      {title && (
        <div className="text-[11px] text-muted-foreground uppercase font-semibold mb-2">
          {title}
        </div>
      )}
      <div className="rounded-md border divide-y">
        {entries.map(([k, v]) => {
          const display =
            phoneKeys.has(k) && maskPhone && typeof v === "string"
              ? maskPhone(v)
              : typeof v === "object"
              ? JSON.stringify(v)
              : String(v);
          return (
            <div
              key={k}
              className="flex items-center gap-4 pl-3 pr-1.5 py-1.5 text-xs group hover:bg-muted/40"
            >
              <span className="font-mono text-muted-foreground w-44 shrink-0">{k}</span>
              <span className="font-mono text-foreground break-all flex-1">{display}</span>
              <button
                onClick={() =>
                  navigator.clipboard?.writeText(
                    typeof v === "object" ? JSON.stringify(v) : String(v),
                  )
                }
                aria-label={`Copy ${k}`}
                className="opacity-0 group-hover:opacity-100 h-7 w-7 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Output Message ---------- */

const OUTPUT_GROUPS: { title: string; keys: string[] }[] = [
  {
    title: "1. Transaction Identity",
    keys: ["OFFERID", "SERVICEID", "TRANSACTIONID", "TRANSTEP", "MessageType"],
  },
  {
    title: "2. Sender",
    keys: ["SENDERCLIENT", "SENDERID", "SENDERPHONE", "SENDERUSERID", "SENDERSETTLEMENT"],
  },
  {
    title: "3. Receiver",
    keys: [
      "RECEIVERCLIENT",
      "RECEIVERPHONE",
      "RECEIVERID",
      "RECEIVERUSERID",
      "RECEIVERSETTLEMENT",
      "RECEIVERSETTLEMENTDATES",
    ],
  },
  { title: "4. Merchant", keys: ["MERCHANTCODE", "MACHID"] },
  {
    title: "5. Financial",
    keys: [
      "CURRENCY",
      "AMOUNT",
      "DEBITFEE",
      "CREDITFEE",
      "DEBITDISCOUNT",
      "CREDITDISCOUNT",
      "TOTALAMOUNT",
    ],
  },
  {
    title: "6. JSON Data",
    keys: ["THIRDPARTYDATA", "FEECALCULATING", "DISCOUNTCALCULATING", "DISTRIBUTIONCALCULATING"],
  },
  { title: "7. Device & Network", keys: ["DEVICEID", "IP", "CLIENT", "USERID"] },
];

function OutputMessage({
  data,
  jsonOpen,
  setJsonOpen,
  maskPhone,
}: {
  data: Record<string, string | number | object>;
  jsonOpen: Record<string, boolean>;
  setJsonOpen: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  maskPhone?: (s: string) => string;
}) {
  const phoneKeys = new Set(["SENDERPHONE", "RECEIVERPHONE"]);
  return (
    <div className="space-y-4">
      {OUTPUT_GROUPS.map((g) => (
        <div key={g.title}>
          <div className="text-[11px] text-muted-foreground uppercase font-semibold mb-2">
            {g.title}
          </div>
          <div className="rounded-md border divide-y">
            {g.keys.map((k) => {
              const v = data[k];
              if (v === undefined) return null;
              const isJSON = typeof v === "object";
              const isOpen = !!jsonOpen[k];
              const display =
                phoneKeys.has(k) && maskPhone && typeof v === "string"
                  ? maskPhone(v)
                  : isJSON
                  ? isOpen
                    ? ""
                    : JSON.stringify(v).length > 60
                    ? JSON.stringify(v).slice(0, 60) + "..."
                    : JSON.stringify(v) || "{}"
                  : typeof v === "number"
                  ? formatVND(v)
                  : String(v);
              return (
                <div key={k} className="pl-3 pr-1.5 py-1.5 text-xs hover:bg-muted/40">
                  <div className="flex items-center gap-4 group">
                    <span className="font-mono text-muted-foreground w-44 shrink-0">{k}</span>
                    <span
                      className={cn(
                        "font-mono flex-1 break-all",
                        isJSON ? "text-blue-600 cursor-pointer" : "text-foreground",
                      )}
                      onClick={() => isJSON && setJsonOpen((p) => ({ ...p, [k]: !p[k] }))}
                    >
                      {display}
                    </span>
                    <button
                      onClick={() =>
                        navigator.clipboard?.writeText(isJSON ? JSON.stringify(v) : String(v))
                      }
                      aria-label={`Copy ${k}`}
                      className="opacity-0 group-hover:opacity-100 h-7 w-7 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {isJSON && (
                      <button
                        onClick={() => setJsonOpen((p) => ({ ...p, [k]: !p[k] }))}
                        aria-label={`Toggle ${k}`}
                        className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-muted text-muted-foreground shrink-0"
                      >
                        <ChevronRight
                          className={cn(
                            "w-3.5 h-3.5 transition-transform",
                            isOpen && "rotate-90",
                          )}
                        />
                      </button>
                    )}
                  </div>
                  {isJSON && isOpen && (
                    <pre className="mt-2 ml-48 p-2 bg-foreground text-background rounded-md text-[11px] overflow-x-auto">
                      {JSON.stringify(v, null, 2)}
                    </pre>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
