/* ── Sinh lời tự động — Types & Mock Data ─────────────────────────── */

export type TransactionType = "interest" | "deposit" | "withdrawal"
export type OtpContext = "activate" | "deactivate" | "deposit" | "withdraw"

export interface SinhLoiTransaction {
  id: string
  type: TransactionType
  label: string
  amount: number
  date: string
  status: "success" | "pending" | "failed"
}

export interface SinhLoiConfig {
  interestRate: number        // 4.5 (%/năm)
  maxBalance: number          // 100_000_000
  dailyWithdrawLimit: number  // 30_000_000
  provider: string            // "ABC"
}

export interface ChartDataPoint {
  label: string
  value: number
  isHighlight?: boolean
  isDanger?: boolean
}

/* ── Config ────────────────────────────────────────────────────────── */
export const SINHLOI_CONFIG: SinhLoiConfig = {
  interestRate: 4.5,
  maxBalance: 100_000_000,
  dailyWithdrawLimit: 30_000_000,
  provider: "ABC",
}

/* ── Limits ────────────────────────────────────────────────────────── */
export const SINHLOI_LIMITS = {
  minDeposit: 10_000,
  maxDeposit: 100_000_000,
  minWithdraw: 10_000,
  maxWithdraw: 30_000_000,
}

/* ── Mock balance state ────────────────────────────────────────────── */
export const MOCK_BALANCE = {
  balance: 10_831_048,
  totalInterestEarned: 100_000,
  todayInterest: 2_714,
}

/* ── Mock chart data (7 days) ──────────────────────────────────────── */
export const MOCK_CHART_DATA: ChartDataPoint[] = [
  { label: "30",   value: 3700 },
  { label: "1/11", value: 1250, isDanger: true },
  { label: "2",    value: 2500 },
  { label: "3",    value: 1900 },
  { label: "4",    value: 2300 },
  { label: "5",    value: 1800 },
  { label: "6",    value: 2714, isHighlight: true },
]

/* ── Mock transactions (recent — shown on dashboard) ─────────────── */
export const MOCK_TRANSACTIONS: SinhLoiTransaction[] = [
  {
    id: "t1",
    type: "interest",
    label: "Tiền lời hằng ngày",
    amount: 2_714,
    date: "18:30 • 06/11/2025",
    status: "success",
  },
  {
    id: "t2",
    type: "deposit",
    label: "Nạp tiền",
    amount: 150_000,
    date: "18:30 • 06/11/2025",
    status: "success",
  },
  {
    id: "t3",
    type: "interest",
    label: "Tiền lời hằng ngày",
    amount: 2_672,
    date: "18:30 • 05/11/2025",
    status: "success",
  },
  {
    id: "t4",
    type: "withdrawal",
    label: "Rút tiền",
    amount: -200_000,
    date: "18:30 • 05/11/2025",
    status: "success",
  },
  {
    id: "t5",
    type: "deposit",
    label: "Nạp tiền",
    amount: 3_000_000,
    date: "18:30 • 04/11/2025",
    status: "success",
  },
]

/* ── Full transactions (for history page) ────────────────────────── */
export const MOCK_TRANSACTIONS_FULL: SinhLoiTransaction[] = [
  ...MOCK_TRANSACTIONS,
  {
    id: "t6",
    type: "interest",
    label: "Tiền lời hằng ngày",
    amount: 2_650,
    date: "18:30 • 04/11/2025",
    status: "success",
  },
  {
    id: "t7",
    type: "withdrawal",
    label: "Rút tiền",
    amount: -500_000,
    date: "10:15 • 03/11/2025",
    status: "success",
  },
  {
    id: "t8",
    type: "interest",
    label: "Tiền lời hằng ngày",
    amount: 2_580,
    date: "18:30 • 03/11/2025",
    status: "success",
  },
  {
    id: "t9",
    type: "deposit",
    label: "Nạp tiền",
    amount: 5_000_000,
    date: "09:00 • 02/11/2025",
    status: "success",
  },
  {
    id: "t10",
    type: "interest",
    label: "Tiền lời hằng ngày",
    amount: 2_510,
    date: "18:30 • 02/11/2025",
    status: "success",
  },
  {
    id: "t11",
    type: "withdrawal",
    label: "Rút tiền",
    amount: -1_000_000,
    date: "14:20 • 01/11/2025",
    status: "failed",
  },
  {
    id: "t12",
    type: "interest",
    label: "Tiền lời hằng ngày",
    amount: 2_490,
    date: "18:30 • 01/11/2025",
    status: "success",
  },
  {
    id: "t13",
    type: "deposit",
    label: "Nạp tiền",
    amount: 2_000_000,
    date: "11:00 • 31/10/2025",
    status: "success",
  },
  {
    id: "t14",
    type: "interest",
    label: "Tiền lời hằng ngày",
    amount: 2_420,
    date: "18:30 • 31/10/2025",
    status: "success",
  },
  {
    id: "t15",
    type: "deposit",
    label: "Nạp tiền",
    amount: 1_000_000,
    date: "08:45 • 30/10/2025",
    status: "pending",
  },
]

/* ── Status label helper ─────────────────────────────────────────── */
export function getStatusLabel(status: SinhLoiTransaction["status"]): { text: string; color: string } {
  switch (status) {
    case "success":
      return { text: "Thành công", color: "text-success" }
    case "pending":
      return { text: "Đang xử lý", color: "text-warning" }
    case "failed":
      return { text: "Thất bại", color: "text-destructive" }
  }
}

/* ── Helpers ────────────────────────────────────────────────────────── */
export function formatVND(n: number): string {
  const abs = Math.abs(n)
  const formatted = abs.toLocaleString("vi-VN")
  if (n < 0) return `-${formatted} đ`
  return `${formatted} đ`
}

export function formatVNDSigned(n: number): string {
  const abs = Math.abs(n)
  const formatted = abs.toLocaleString("vi-VN")
  if (n < 0) return `-${formatted} đ`
  return `+${formatted} đ`
}
