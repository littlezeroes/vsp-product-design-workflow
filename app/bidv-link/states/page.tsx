"use client"

import * as React from "react"
import Link from "next/link"
import { Header } from "@/components/ui/header"

/* ── Screen × State matrix ─────────────────────────────────────── */
interface ScreenState {
  screen: string
  route: string
  states: { label: string; param: string }[]
}

const SCREENS: ScreenState[] = [
  {
    screen: "S1: Danh sách ngân hàng",
    route: "/bidv-link/bank-list",
    states: [
      { label: "loaded", param: "" },
      { label: "empty", param: "?state=empty" },
      { label: "loading", param: "?state=loading" },
      { label: "error", param: "?state=error" },
    ],
  },
  {
    screen: "S2: Form Liên kết BIDV",
    route: "/bidv-link/bidv-form",
    states: [
      { label: "empty", param: "" },
      { label: "typing", param: "?state=typing" },
      { label: "valid", param: "?state=valid" },
      { label: "tnc-sheet", param: "?state=tnc-sheet" },
      { label: "loading", param: "?state=loading" },
      { label: "error-stk", param: "?state=error-stk" },
      { label: "error-mismatch", param: "?state=error-mismatch" },
      { label: "error-no-smartbanking", param: "?state=error-no-smartbanking" },
      { label: "error-maintenance", param: "?state=error-maintenance" },
      { label: "error-rate-limit", param: "?state=error-rate-limit" },
      { label: "error-network", param: "?state=error-network" },
      { label: "redirect-store", param: "?state=redirect-store" },
      { label: "resume-from-store", param: "?state=resume-from-store" },
      { label: "deeplink-fail", param: "?state=deeplink-fail" },
    ],
  },
  {
    screen: "S3: Chờ xác thực (Liên kết)",
    route: "/bidv-link/bidv-waiting",
    states: [
      { label: "waiting", param: "" },
      { label: "callback-success", param: "?state=callback-success" },
      { label: "callback-failed", param: "?state=callback-failed" },
      { label: "callback-pending", param: "?state=callback-pending" },
      { label: "callback-cancel", param: "?state=callback-cancel" },
      { label: "timeout", param: "?state=timeout" },
      { label: "cancel-confirm", param: "?state=cancel-confirm" },
      { label: "cancelled", param: "?state=cancelled" },
      { label: "network-lost", param: "?state=network-lost" },
      { label: "app-resume", param: "?state=app-resume" },
    ],
  },
  {
    screen: "S4: Kết quả Liên kết",
    route: "/bidv-link/bidv-result",
    states: [
      { label: "success", param: "?state=success" },
      { label: "failed", param: "?state=failed" },
      { label: "failed-cancel", param: "?state=failed-cancel" },
      { label: "failed-timeout", param: "?state=failed-timeout" },
      { label: "pending", param: "?state=pending" },
    ],
  },
  {
    screen: "S5: Nạp tiền",
    route: "/bidv-link/deposit",
    states: [
      { label: "empty", param: "" },
      { label: "typing", param: "?state=typing" },
      { label: "valid", param: "?state=valid" },
      { label: "error-min", param: "?state=error-min" },
      { label: "error-max", param: "?state=error-max" },
      { label: "error-daily", param: "?state=error-daily" },
      { label: "error-monthly", param: "?state=error-monthly" },
      { label: "quick-select", param: "?state=quick-select" },
      { label: "loading", param: "?state=loading" },
    ],
  },
  {
    screen: "Auth-Deposit: Xác nhận Nạp tiền",
    route: "/bidv-link/deposit-auth",
    states: [
      { label: "default", param: "" },
      { label: "biometric-prompt", param: "?state=biometric-prompt" },
      { label: "biometric-success", param: "?state=biometric-success" },
      { label: "biometric-fail", param: "?state=biometric-fail" },
      { label: "pin-typing", param: "?state=pin-typing" },
      { label: "pin-success", param: "?state=pin-success" },
      { label: "pin-error-1", param: "?state=pin-error-1" },
      { label: "pin-error-2", param: "?state=pin-error-2" },
      { label: "pin-locked", param: "?state=pin-locked" },
      { label: "redirect-store", param: "?state=redirect-store" },
      { label: "session-timeout", param: "?state=session-timeout" },
      { label: "fee-changed", param: "?state=fee-changed" },
    ],
  },
  {
    screen: "S7: Chờ xác thực (Nạp tiền)",
    route: "/bidv-link/deposit-waiting",
    states: [
      { label: "waiting", param: "" },
      { label: "callback-success", param: "?state=callback-success" },
      { label: "callback-failed", param: "?state=callback-failed" },
      { label: "callback-pending", param: "?state=callback-pending" },
      { label: "timeout", param: "?state=timeout" },
      { label: "cancel-confirm", param: "?state=cancel-confirm" },
      { label: "cancelled", param: "?state=cancelled" },
      { label: "network-lost", param: "?state=network-lost" },
      { label: "app-resume", param: "?state=app-resume" },
    ],
  },
  {
    screen: "S8: Kết quả Nạp tiền",
    route: "/bidv-link/deposit-result",
    states: [
      { label: "success", param: "?state=success" },
      { label: "failed", param: "?state=failed" },
      { label: "failed-insufficient", param: "?state=failed-insufficient" },
      { label: "failed-timeout", param: "?state=failed-timeout" },
      { label: "pending", param: "?state=pending" },
    ],
  },
  {
    screen: "S9: Rút tiền",
    route: "/bidv-link/withdraw",
    states: [
      { label: "empty", param: "" },
      { label: "typing", param: "?state=typing" },
      { label: "valid", param: "?state=valid" },
      { label: "error-min", param: "?state=error-min" },
      { label: "error-max", param: "?state=error-max" },
      { label: "error-balance", param: "?state=error-balance" },
      { label: "error-daily", param: "?state=error-daily" },
      { label: "error-monthly", param: "?state=error-monthly" },
      { label: "quick-select", param: "?state=quick-select" },
      { label: "loading", param: "?state=loading" },
    ],
  },
  {
    screen: "Auth-Withdraw: Xác nhận Rút tiền",
    route: "/bidv-link/withdraw-auth",
    states: [
      { label: "default", param: "" },
      { label: "biometric-prompt", param: "?state=biometric-prompt" },
      { label: "biometric-success", param: "?state=biometric-success" },
      { label: "biometric-fail", param: "?state=biometric-fail" },
      { label: "pin-typing", param: "?state=pin-typing" },
      { label: "pin-success", param: "?state=pin-success" },
      { label: "pin-error-1", param: "?state=pin-error-1" },
      { label: "pin-error-2", param: "?state=pin-error-2" },
      { label: "pin-locked", param: "?state=pin-locked" },
      { label: "session-timeout", param: "?state=session-timeout" },
      { label: "fee-changed", param: "?state=fee-changed" },
    ],
  },
  {
    screen: "S11: Kết quả Rút tiền",
    route: "/bidv-link/withdraw-result",
    states: [
      { label: "success", param: "?state=success" },
      { label: "failed", param: "?state=failed" },
      { label: "failed-account", param: "?state=failed-account" },
      { label: "failed-refund", param: "?state=failed-refund" },
      { label: "pending", param: "?state=pending" },
    ],
  },
  {
    screen: "S12: Chi tiết ngân hàng BIDV",
    route: "/bidv-link/bank-detail",
    states: [
      { label: "loaded", param: "" },
      { label: "unlink-check", param: "?state=unlink-check" },
      { label: "pending-block", param: "?state=pending-block" },
      { label: "confirm-normal", param: "?state=confirm-normal" },
      { label: "confirm-last", param: "?state=confirm-last" },
      { label: "redirect-store", param: "?state=redirect-store" },
      { label: "loading", param: "?state=loading" },
      { label: "error", param: "?state=error" },
    ],
  },
  {
    screen: "S13: Chờ xác thực (Hủy liên kết)",
    route: "/bidv-link/unlink-waiting",
    states: [
      { label: "waiting", param: "" },
      { label: "callback-success", param: "?state=callback-success" },
      { label: "callback-failed", param: "?state=callback-failed" },
      { label: "callback-pending", param: "?state=callback-pending" },
      { label: "callback-cancel", param: "?state=callback-cancel" },
      { label: "timeout", param: "?state=timeout" },
      { label: "cancel-confirm", param: "?state=cancel-confirm" },
      { label: "cancelled", param: "?state=cancelled" },
      { label: "network-lost", param: "?state=network-lost" },
      { label: "app-resume", param: "?state=app-resume" },
    ],
  },
  {
    screen: "S14: Kết quả Hủy liên kết",
    route: "/bidv-link/unlink-result",
    states: [
      { label: "success", param: "?state=success" },
      { label: "failed", param: "?state=failed" },
      { label: "failed-cancel", param: "?state=failed-cancel" },
      { label: "failed-timeout", param: "?state=failed-timeout" },
      { label: "pending", param: "?state=pending" },
    ],
  },
  {
    screen: "S15: Quản lý thanh toán",
    route: "/bidv-link/bank-management",
    states: [
      { label: "loaded", param: "" },
      { label: "empty", param: "?state=empty" },
      { label: "loading", param: "?state=loading" },
      { label: "error", param: "?state=error" },
    ],
  },
  {
    screen: "S16: Lịch sử giao dịch",
    route: "/bidv-link/transactions",
    states: [
      { label: "loaded", param: "" },
      { label: "empty", param: "?state=empty" },
      { label: "filtered", param: "?state=filtered" },
      { label: "filtered-empty", param: "?state=filtered-empty" },
      { label: "loading", param: "?state=loading" },
      { label: "error", param: "?state=error" },
    ],
  },
  {
    screen: "S17: Chi tiết giao dịch",
    route: "/bidv-link/transaction-detail",
    states: [
      { label: "loaded", param: "" },
      { label: "loading", param: "?state=loading" },
      { label: "status-updated", param: "?state=status-updated&txStatus=pending" },
      { label: "error", param: "?state=error" },
    ],
  },
]

/* ── Page ──────────────────────────────────────────────────────── */
export default function AllStatesPage() {
  return (
    <div className="w-full max-w-[390px] min-h-screen bg-background text-foreground">
      <Header variant="large-title" largeTitle="All States — BIDV Link" />

      <div className="flex-1 overflow-y-auto pb-[21px]">
        {SCREENS.map((screen, sIdx) => (
          <div key={sIdx}>
            {/* Screen title */}
            <div className="pt-[32px]">
              <div className="px-[22px]">
                <h2 className="text-[17px] font-semibold text-foreground">{screen.screen}</h2>
                <p className="text-xs font-normal text-foreground-secondary mt-[2px]">{screen.route}</p>
              </div>
            </div>

            {/* States list */}
            <div className="pt-[12px]">
              <div className="px-[22px]">
                <div className="flex flex-wrap gap-[6px]">
                  {screen.states.map((s, idx) => (
                    <Link
                      key={idx}
                      href={`${screen.route}${s.param}`}
                      className="inline-flex px-[12px] py-[6px] rounded-full bg-secondary text-sm font-medium text-foreground hover:bg-foreground hover:text-background transition-colors"
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Summary stats */}
        <div className="pt-[32px]">
          <div className="px-[22px]">
            <div className="bg-secondary rounded-[28px] px-[20px] py-[18px] space-y-[8px]">
              <p className="text-sm font-semibold text-foreground">Summary</p>
              <p className="text-xs font-normal text-foreground-secondary">Screens: {SCREENS.length}</p>
              <p className="text-xs font-normal text-foreground-secondary">
                Total states: {SCREENS.reduce((acc, s) => acc + s.states.length, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="h-[40px]" />
      </div>
    </div>
  )
}
