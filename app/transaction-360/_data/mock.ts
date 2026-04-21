export type TxStatus =
  | "done"
  | "pending"
  | "failed"
  | "cancelled"
  | "reversed"
  | "expired"
  | "refused"
  | "refunded"
  | "redeemed"
  | "processing"
  | "attempt";

export type TxType =
  | "normal"
  | "fee"
  | "tax"
  | "discount"
  | "cashback"
  | "commission"
  | "reversal";

export type Channel = "customer" | "agent" | "merchant" | "officer" | "corporate";
export type Client = "customer" | "merchant" | "agent" | "system";
export type Source = "admin" | "app" | "api";

export interface Transaction {
  id: string;
  refId: string;
  code: string;
  serviceName: string;
  source: Source;
  senderPhone: string;
  senderClient: Client;
  receiverPhone: string;
  receiverClient: Client;
  receiverName?: string;
  receiverShortName?: string;
  merchantId?: string;
  createdAt: string;
  channel: Channel;
  amount: number;
  currency: "VND";
  type: TxType;
  status: TxStatus;
  transactionCode: string;
  deviceId: string;
  ip: string;
  message?: string;
  errorMessage?: string;
  errorCode?: string;
  originalRefId?: string;
  partnerRefId?: string;
}

export interface SubStep {
  name: string;
  count?: number;
  status: "pass" | "fail" | "skip";
  details?: { label: string; value: string; status: "pass" | "fail" }[];
}

export interface StageLog {
  stage: "START" | "REQUEST" | "CONFIRM" | "VERIFY" | "END";
  timestamp?: string;
  /** Offset from baseTime in milliseconds — used for timing deltas in the timeline. */
  offsetMs?: number;
  subSteps?: SubStep[];
  authMethod?: "OTP" | "PIN" | "TPIN" | "BIO" | "SIG" | "NONE";
  bioRequired?: boolean;
  inputMessage?: Record<string, string | number>;
  outputMessage?: Record<string, string | number | object>;
}

export interface GLEntry {
  title: string;
  debit: { amount: number; from: string; type: "WALLET" | "GL" };
  credit: { amount: number; to: string; type: "WALLET" | "GL" };
  timestamp: string;
}

export interface TransactionDetail extends Transaction {
  stages: StageLog[];
  glPosting: GLEntry[];
}

export const SERVICES = [
  "Customer pay online merchant wallet token",
  "Customer Cash In By BIDV",
  "Customer Cash Out To BIDV",
  "Customer Transfer To Customer",
  "Customer Top Up Airtime",
  "Customer Pay Bill Electricity",
  "Merchant Refund Customer",
  "Agent Cash In For Customer",
  "Customer QR Payment",
  "Customer Buy Insurance",
];

export const CHANNELS: Channel[] = ["customer", "agent", "merchant", "officer", "corporate"];
export const STATUSES: TxStatus[] = [
  "pending",
  "done",
  "cancelled",
  "failed",
  "reversed",
  "expired",
  "refused",
  "refunded",
  "redeemed",
  "processing",
  "attempt",
];
export const TX_TYPES: TxType[] = [
  "normal",
  "fee",
  "tax",
  "discount",
  "cashback",
  "commission",
  "reversal",
];

const rand = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

const r = rand(42);

// Fixed timestamp for deterministic rendering (SSR-safe)
const FIXED_NOW = new Date("2026-04-21T09:00:00Z").getTime();

const pad = (n: number, w = 2) => String(n).padStart(w, "0");
const genRefId = (i: number) => {
  const h = "0123456789abcdef";
  let out = "";
  for (let k = 0; k < 24; k++) out += h[Math.floor(r() * 16)];
  return out;
};
const genCode = (i: number) => {
  let out = "26" + pad(Math.floor(r() * 4) + 4) + pad(Math.floor(r() * 28) + 1);
  for (let k = 0; k < 14; k++) out += Math.floor(r() * 10);
  return out;
};

const phones = [
  "0396247750",
  "0986586926",
  "0912345678",
  "0901234567",
  "0977123456",
  "0888999111",
  "0355123456",
  "0978888555",
];

const merchantNames = [
  { full: "CÔNG TY CỔ PHẦN DI CHUYỂN XANH VÀ THÔNG MINH GSM", short: "XANH SM" },
  { full: "CÔNG TY CỔ PHẦN VINCOMMERCE", short: "WINMART" },
  { full: "CÔNG TY CỔ PHẦN VINFAST", short: "VINFAST" },
  { full: "CÔNG TY CỔ PHẦN VINPEARL", short: "VINPEARL" },
];

export const MOCK_TRANSACTIONS: Transaction[] = Array.from({ length: 48 }).map((_, i) => {
  const status: TxStatus = ([
    "done",
    "done",
    "done",
    "pending",
    "failed",
    "done",
    "cancelled",
    "reversed",
    "done",
    "processing",
  ] as TxStatus[])[Math.floor(r() * 10)];
  const channel: Channel = CHANNELS[Math.floor(r() * CHANNELS.length)];
  const service = SERVICES[Math.floor(r() * SERVICES.length)];
  // Realistic merchant volumes — small retail up to whale transactions.
  // With 48 txs mix, total revenue should land in the billions.
  const amount = [
    49_000, 120_000, 399_000, 899_000, 1_490_000, 2_990_000,
    4_500_000, 9_900_000, 15_000_000, 32_000_000, 68_500_000,
    120_000_000, 199_000_000, 485_000_000,
  ][Math.floor(r() * 14)];
  const t = new Date(FIXED_NOW - Math.floor(r() * 30 * 24 * 3600 * 1000));
  const type: TxType = (["normal", "normal", "normal", "fee", "cashback", "reversal"] as TxType[])[
    Math.floor(r() * 6)
  ];
  const merchant = merchantNames[Math.floor(r() * merchantNames.length)];

  return {
    id: String(i + 1),
    refId: genRefId(i),
    code: genCode(i),
    serviceName: service,
    source: (["api", "app", "admin"] as Source[])[Math.floor(r() * 3)],
    senderPhone: phones[Math.floor(r() * phones.length)],
    senderClient: "customer",
    receiverPhone: phones[Math.floor(r() * phones.length)],
    receiverClient: service.toLowerCase().includes("merchant") ? "merchant" : "customer",
    receiverName: service.toLowerCase().includes("merchant") ? merchant.full : undefined,
    receiverShortName: service.toLowerCase().includes("merchant") ? merchant.short : undefined,
    merchantId: service.toLowerCase().includes("merchant")
      ? "6979bc6a61132cab8b814d57"
      : undefined,
    createdAt: t.toISOString(),
    channel,
    amount,
    currency: "VND",
    type,
    status,
    transactionCode: genCode(i),
    deviceId: "4C:26:F3:DF:3A:00:14:78:CF:39:8F:F5:B9:4A:03:75",
    ip: `10.250.${Math.floor(r() * 255)}.${Math.floor(r() * 255)}`,
    message: undefined,
    errorMessage:
      status === "failed"
        ? (["Insufficient balance", "Invalid OTP", "Merchant not found", "Velocity limit exceeded"][
            Math.floor(r() * 4)
          ])
        : status === "cancelled"
        ? "User cancelled before confirm"
        : status === "expired"
        ? "Transaction expired (15 min window)"
        : status === "refused"
        ? "Blocked by risk engine (score 87)"
        : undefined,
    errorCode:
      status === "failed"
        ? (["E4001", "E4203", "E5004", "E6010"][Math.floor(r() * 4)])
        : status === "cancelled"
        ? "E1001"
        : status === "expired"
        ? "E1008"
        : status === "refused"
        ? "E5510"
        : undefined,
    originalRefId: type === "reversal" ? genRefId(i + 100) : undefined,
    partnerRefId: channel === "merchant" ? genRefId(i + 200) : undefined,
  };
});

export const getTransactionDetail = (id: string): TransactionDetail | null => {
  const tx = MOCK_TRANSACTIONS.find((t) => t.id === id);
  if (!tx) return null;

  const baseTime = new Date(tx.createdAt).getTime();
  const ts = (offsetMs: number) =>
    new Date(baseTime + offsetMs).toISOString().replace("T", " ").slice(0, 19);

  const stages: StageLog[] = [
    {
      stage: "START",
      inputMessage: {
        MessageType: "FO",
        SENDERCLIENT: tx.senderClient,
        merchantId: tx.merchantId ?? "",
        url: "/partner/merchant/transactions/request",
        ip: tx.ip,
        SERVICEID: "69aae8168484579926c4954f",
        SENDERPHONE: tx.senderPhone,
        EXPIREDAT: new Date(baseTime + 15 * 60 * 1000).toISOString().slice(0, 19) + "Z",
        RECEIVERPHONE: tx.receiverPhone,
        RECEIVERCLIENT: tx.receiverClient,
        RECEIVERNAME: tx.receiverName ?? "",
        RECEIVERSHORTNAME: tx.receiverShortName ?? "",
        MACHID: tx.merchantId ?? "",
        AMOUNT: tx.amount,
        CURRENCY: tx.currency,
        TRANSACTIONID: tx.refId,
        DEVICEID: tx.deviceId,
      },
    },
    {
      stage: "REQUEST",
      offsetMs: 120,
      timestamp: ts(120),
      subSteps: [
        {
          name: "Validate Fields",
          count: 27,
          status: "pass",
          details: [
            { label: "AMOUNT", value: String(tx.amount), status: "pass" },
            { label: "CURRENCY", value: tx.currency, status: "pass" },
            { label: "SENDERPHONE", value: tx.senderPhone, status: "pass" },
            { label: "RECEIVERPHONE", value: tx.receiverPhone, status: "pass" },
            { label: "SERVICEID", value: "69aae8168484579926c4954f", status: "pass" },
          ],
        },
        { name: "Validate Service Action", status: "pass" },
        {
          name: "Validate Transaction",
          count: 18,
          status: "pass",
          details: [
            { label: "Check balance", value: "Sufficient", status: "pass" },
            { label: "Check velocity limit", value: "Within limit", status: "pass" },
            { label: "Check blacklist", value: "Not blacklisted", status: "pass" },
          ],
        },
        { name: "Fee Calculating", count: 1, status: "pass" },
        { name: "Tax Calculating", count: 1, status: "pass" },
      ],
    },
    {
      stage: "CONFIRM",
      offsetMs: 4800,
      timestamp: ts(4800),
      authMethod: "BIO",
      bioRequired: true,
    },
    {
      stage: "VERIFY",
      offsetMs: 6200,
      timestamp: ts(6200),
      subSteps: [
        { name: "Verify Pin and OTP", status: "pass" },
        { name: "Validate Fields", count: 27, status: "pass" },
        { name: "Validate Transaction", count: 18, status: "pass" },
        { name: "Fee Calculating", count: 1, status: "pass" },
        { name: "Tax Calculating", count: 1, status: "pass" },
      ],
    },
    {
      stage: "END",
      outputMessage: {
        OFFERID: "a3b1c9d2-4e5f-6a7b-8c9d-0e1f2a3b4c5d",
        SERVICEID: "69aae8168484579926c4954f",
        TRANSACTIONID: tx.refId,
        TRANSTEP: 3,
        MessageType: "FO",
        SENDERCLIENT: tx.senderClient,
        SENDERID: "senderid-uuid",
        SENDERPHONE: tx.senderPhone,
        SENDERUSERID: "senderuserid-uuid",
        SENDERSETTLEMENT: "immediately",
        RECEIVERCLIENT: tx.receiverClient,
        RECEIVERPHONE: tx.receiverPhone,
        RECEIVERID: "receiverid-uuid",
        RECEIVERUSERID: "receiveruserid-uuid",
        RECEIVERSETTLEMENT: "deferred",
        RECEIVERSETTLEMENTDATES: 1,
        MERCHANTCODE: tx.merchantId ?? "",
        MACHID: tx.merchantId ?? "",
        CURRENCY: tx.currency,
        AMOUNT: tx.amount,
        DEBITFEE: 0,
        CREDITFEE: Math.round(tx.amount * 0.01),
        DEBITDISCOUNT: 0,
        CREDITDISCOUNT: 0,
        TOTALAMOUNT: tx.amount,
        THIRDPARTYDATA: { cpqr_id: "286914696227481" },
        FEECALCULATING: [],
        DISCOUNTCALCULATING: [],
        DISTRIBUTIONCALCULATING: {},
        DEVICEID: tx.deviceId,
        IP: tx.ip,
        CLIENT: tx.senderClient,
        USERID: "senderuserid-uuid",
      },
    },
  ];

  const glPosting: GLEntry[] = tx.receiverClient === "merchant"
    ? [
        {
          title: "Block money",
          debit: { amount: tx.amount, from: `${tx.senderPhone} (customer)`, type: "WALLET" },
          credit: {
            amount: tx.amount,
            to: "3388179999 (Suspense Account)",
            type: "GL",
          },
          timestamp: ts(6500),
        },
        {
          title: "Recognize merchant payable",
          debit: { amount: tx.amount, from: "3388179999 (Suspense Account)", type: "GL" },
          credit: {
            amount: tx.amount,
            to: `${tx.receiverPhone} (merchant)`,
            type: "WALLET",
          },
          timestamp: ts(6520),
        },
        {
          title: "Collect merchant fee",
          debit: {
            amount: Math.round(tx.amount * 0.01),
            from: `${tx.receiverPhone} (merchant)`,
            type: "WALLET",
          },
          credit: {
            amount: Math.round(tx.amount * 0.01),
            to: "1119979999 (Fee Revenue Account)",
            type: "GL",
          },
          timestamp: ts(6540),
        },
      ]
    : [
        {
          title: "Transfer money",
          debit: { amount: tx.amount, from: `${tx.senderPhone} (customer)`, type: "WALLET" },
          credit: { amount: tx.amount, to: `${tx.receiverPhone} (customer)`, type: "WALLET" },
          timestamp: ts(6500),
        },
      ];

  return { ...tx, stages, glPosting };
};

/** Sorted transaction IDs (latest first) — used for prev/next navigation. */
export const SORTED_IDS = [...MOCK_TRANSACTIONS]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .map((t) => t.id);

export const getNeighborIds = (id: string) => {
  const idx = SORTED_IDS.indexOf(id);
  if (idx === -1) return { prev: null, next: null, index: -1, total: SORTED_IDS.length };
  return {
    prev: idx > 0 ? SORTED_IDS[idx - 1] : null,
    next: idx < SORTED_IDS.length - 1 ? SORTED_IDS[idx + 1] : null,
    index: idx,
    total: SORTED_IDS.length,
  };
};

/** Find transactions that share the originalRefId — used for reversal/refund linking. */
export const findRelatedTxs = (tx: Transaction) => {
  const related: Array<{ id: string; refId: string; type: string; status: string; amount: number; relation: string }> = [];
  // If this tx has originalRefId — find txs whose refId matches
  if (tx.originalRefId) {
    const original = MOCK_TRANSACTIONS.find((t) => t.refId === tx.originalRefId);
    if (original) {
      related.push({
        id: original.id,
        refId: original.refId,
        type: original.type,
        status: original.status,
        amount: original.amount,
        relation: "Original transaction",
      });
    } else {
      // Original not found in mock — still show a stub card
      related.push({
        id: "",
        refId: tx.originalRefId,
        type: "normal",
        status: "done",
        amount: tx.amount,
        relation: "Original transaction (ref only)",
      });
    }
  }
  // Find reversals of this tx
  const reversals = MOCK_TRANSACTIONS.filter(
    (t) => t.originalRefId === tx.refId,
  );
  for (const rev of reversals) {
    related.push({
      id: rev.id,
      refId: rev.refId,
      type: rev.type,
      status: rev.status,
      amount: rev.amount,
      relation: "Reversal",
    });
  }
  return related;
};

export const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(n);

export const formatDuration = (ms: number) => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  const min = Math.floor(ms / 60_000);
  const sec = Math.floor((ms % 60_000) / 1000);
  return `${min}m ${sec}s`;
};

export const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  const pad2 = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(
    d.getHours(),
  )}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
};
