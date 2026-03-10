"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ChevronLeft, ChevronRight, Search,
  Zap, Droplets, Wifi, Tv, Smartphone, CreditCard, Signal, Landmark, Clock, Settings,
} from "lucide-react"
import { Header } from "@/components/ui/header"
import { TextField } from "@/components/ui/text-field"
import { FeedbackState } from "@/components/ui/feedback-state"

/* ── Category data with accent colors ────────────────────────────────── */
const CATEGORIES = [
  { label: "Dien", href: "/vas/bill/provider?type=electric", Icon: Zap, accent: "bg-warning", iconColor: "text-background" },
  { label: "Nuoc", href: "/vas/bill/provider?type=water", Icon: Droplets, accent: "bg-info", iconColor: "text-background" },
  { label: "Internet", href: "/vas/bill/provider?type=internet", Icon: Wifi, accent: "bg-foreground", iconColor: "text-background" },
  { label: "Truyen hinh", href: "/vas/bill/provider?type=tv", Icon: Tv, accent: "bg-danger", iconColor: "text-background" },
  { label: "Nap tien", href: "/vas/topup", Icon: Smartphone, accent: "bg-success", iconColor: "text-background" },
  { label: "The cao", href: "/vas/card", Icon: CreditCard, accent: "bg-foreground", iconColor: "text-background" },
  { label: "Goi data", href: "/vas/data", Icon: Signal, accent: "bg-info", iconColor: "text-background" },
  { label: "Tai chinh", href: "/vas/finance", Icon: Landmark, accent: "bg-warning", iconColor: "text-background" },
] as const

/* ── Mock saved billers — with real context ──────────────────────────── */
const SAVED_BILLERS = [
  { id: "evn-hcm", provider: "EVN HCMC", code: "PA01234567", type: "electric", amount: "1.250.000d", due: "15/03", urgent: true },
  { id: "sawaco", provider: "SAWACO", code: "NV0098765", type: "water", amount: "385.000d", due: "20/03", urgent: false },
  { id: "fpt", provider: "FPT Telecom", code: "FPT2891034", type: "internet", amount: "220.000d", due: "25/03", urgent: false },
]

const SAVED_PHONES = [
  { id: "p1", phone: "0912 345 678", carrier: "Viettel", lastAmount: "100.000d" },
  { id: "p2", phone: "0988 765 432", carrier: "Mobifone", lastAmount: "50.000d" },
]

/* ── Recent transactions ─────────────────────────────────────────────── */
const RECENT = [
  { id: "r1", label: "Nap tien 0912 345 678", detail: "Viettel · 100.000d", date: "Hom nay", Icon: Smartphone, status: "success" as const },
  { id: "r2", label: "EVN HCMC", detail: "PA01234567 · 1.250.000d", date: "08/03", Icon: Zap, status: "success" as const },
  { id: "r3", label: "FPT Telecom", detail: "FPT2891034 · 220.000d", date: "01/03", Icon: Wifi, status: "success" as const },
]

/* ── Helpers ──────────────────────────────────────────────────────────── */
function getBillerIcon(type: string) {
  switch (type) {
    case "electric": return { Icon: Zap, accent: "bg-warning" }
    case "water": return { Icon: Droplets, accent: "bg-info" }
    case "internet": return { Icon: Wifi, accent: "bg-foreground" }
    case "tv": return { Icon: Tv, accent: "bg-danger" }
    default: return { Icon: Zap, accent: "bg-secondary" }
  }
}

function getCarrierAccent(carrier: string) {
  switch (carrier) {
    case "Viettel": return "bg-danger"
    case "Mobifone": return "bg-info"
    case "Vinaphone": return "bg-success"
    default: return "bg-foreground"
  }
}

/* ── Skeleton ─────────────────────────────────────────────────────────── */
function SkeletonPage() {
  return (
    <>
      {/* Skeleton search */}
      <div className="px-[22px] pt-[16px]">
        <div className="h-[44px] rounded-full bg-secondary animate-pulse" />
      </div>
      {/* Skeleton banner */}
      <div className="px-[22px] pt-[32px]">
        <div className="h-[72px] rounded-[28px] bg-secondary animate-pulse" />
      </div>
      {/* Skeleton grid */}
      <div className="px-[22px] pt-[32px]">
        <div className="h-[14px] w-[100px] rounded-full bg-secondary animate-pulse mb-[12px]" />
        <div className="grid grid-cols-4 gap-[12px]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-[8px]">
              <div className="w-[48px] h-[48px] rounded-full bg-secondary animate-pulse" />
              <div className="w-[40px] h-[10px] rounded-full bg-secondary animate-pulse" />
            </div>
          ))}
        </div>
      </div>
      {/* Skeleton saved */}
      <div className="px-[22px] pt-[32px]">
        <div className="h-[14px] w-[120px] rounded-full bg-secondary animate-pulse mb-[12px]" />
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-[12px] py-[12px]">
            <div className="w-[40px] h-[40px] rounded-full bg-secondary animate-pulse shrink-0" />
            <div className="flex-1 space-y-[6px]">
              <div className="h-[14px] w-3/4 rounded-full bg-secondary animate-pulse" />
              <div className="h-[10px] w-1/2 rounded-full bg-secondary animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ── Page ─────────────────────────────────────────────────────────────── */
function VasHomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "loaded"

  const showSaved = state !== "empty-saved" && state !== "loading"
  const isLoading = state === "loading"
  const isSearch = state === "search-active" || state === "search-empty"
  const [searchQuery, setSearchQuery] = React.useState(state === "search-empty" ? "xyz" : "")

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      {/* ── Header ──────────────────────────────────────────────── */}
      <Header
        variant="large-title"
        largeTitle="Thanh toan"
        leading={
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center p-[10px] min-h-[44px] rounded-full"
          >
            <ChevronLeft size={18} className="text-foreground" />
          </button>
        }
        trailing={
          <button
            type="button"
            onClick={() => router.push("/vas/saved")}
            className="flex items-center justify-center p-[10px] min-h-[44px] rounded-full"
          >
            <Settings size={18} className="text-foreground" />
          </button>
        }
      />

      {/* ── Scrollable content ──────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto pb-[21px]">

        {/* ── Search bar ───────────────────────────────────────── */}
        <div className="px-[22px] pt-[16px]">
          <div className="relative">
            <Search size={16} className="absolute left-[14px] top-1/2 -translate-y-1/2 text-foreground-secondary pointer-events-none" />
            <input
              type="text"
              placeholder="Tim dich vu, nha cung cap..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[44px] rounded-full bg-secondary pl-[40px] pr-[16px] text-sm text-foreground placeholder:text-foreground-secondary outline-none"
            />
          </div>
        </div>

        {isLoading && <SkeletonPage />}

        {!isLoading && state === "search-empty" && (
          <div className="pt-[32px] px-[22px]">
            <FeedbackState
              icon={
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                  <Search size={32} className="text-foreground-secondary" />
                </div>
              }
              title="Khong tim thay dich vu"
              description="Thu tim voi tu khoa khac"
            />
          </div>
        )}

        {!isLoading && !isSearch && (
          <>
            {/* ── Urgent bill reminder banner ─────────────────── */}
            {showSaved && SAVED_BILLERS.some((b) => b.urgent) && (
              <div className="px-[22px] pt-[32px]">
                {SAVED_BILLERS.filter((b) => b.urgent).map((bill) => {
                  const { Icon, accent } = getBillerIcon(bill.type)
                  return (
                    <button
                      key={bill.id}
                      type="button"
                      onClick={() => router.push(`/vas/bill/input?provider=${bill.id}&type=${bill.type}&state=bill-found`)}
                      className="w-full bg-secondary rounded-[28px] p-[16px] flex items-center gap-[12px]"
                    >
                      <div className={`w-[40px] h-[40px] rounded-full ${accent} flex items-center justify-center shrink-0`}>
                        <Icon size={20} className="text-background" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-semibold text-foreground">{bill.provider} · {bill.amount}</p>
                        <p className="text-xs font-normal text-danger">Han {bill.due} — Thanh toan ngay</p>
                      </div>
                      <ChevronRight size={16} className="text-foreground-secondary shrink-0" />
                    </button>
                  )
                })}
              </div>
            )}

            {/* ── Category grid (3 col) ───────────────────────── */}
            <div className="pt-[32px] px-[22px]">
              <p className="text-sm font-semibold text-foreground pb-[16px]">Dich vu</p>
              <div className="grid grid-cols-4 gap-y-[20px] gap-x-[12px]">
                {CATEGORIES.map(({ label, href, Icon, accent }) => (
                  <button
                    key={href}
                    type="button"
                    onClick={() => router.push(href)}
                    className="flex flex-col items-center gap-[8px]"
                  >
                    <div className={`w-[48px] h-[48px] rounded-full ${accent} flex items-center justify-center`}>
                      <Icon size={22} className="text-background" />
                    </div>
                    <p className="text-xs font-medium text-foreground text-center leading-[16px]">{label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Saved billers — list style with context ──────── */}
            {showSaved && (
              <div className="pt-[32px]">
                <div className="flex items-center justify-between px-[22px] pb-[8px]">
                  <p className="text-sm font-semibold text-foreground">Hoa don da luu</p>
                  <button
                    type="button"
                    onClick={() => router.push("/vas/saved")}
                    className="text-sm font-semibold text-success"
                  >
                    Tat ca
                  </button>
                </div>
                <div className="px-[22px]">
                  {SAVED_BILLERS.map((bill, idx) => {
                    const { Icon, accent } = getBillerIcon(bill.type)
                    return (
                      <button
                        key={bill.id}
                        type="button"
                        onClick={() => router.push(`/vas/bill/input?provider=${bill.id}&type=${bill.type}`)}
                        className={`w-full flex items-center gap-[12px] py-[14px] ${idx < SAVED_BILLERS.length - 1 ? "border-b border-border" : ""}`}
                      >
                        <div className={`w-[40px] h-[40px] rounded-full ${accent} flex items-center justify-center shrink-0`}>
                          <Icon size={18} className="text-background" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-sm font-semibold text-foreground">{bill.provider}</p>
                          <p className="text-xs font-normal text-foreground-secondary">{bill.code}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-semibold text-foreground">{bill.amount}</p>
                          <p className="text-xs font-normal text-foreground-secondary">Han {bill.due}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Saved phones — horizontal chips ─────────────── */}
            {showSaved && (
              <div className="pt-[32px]">
                <div className="flex items-center justify-between px-[22px] pb-[8px]">
                  <p className="text-sm font-semibold text-foreground">Nap nhanh</p>
                </div>
                <div className="flex gap-[10px] overflow-x-auto px-[22px] scrollbar-none">
                  {SAVED_PHONES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => router.push(`/vas/topup?phone=${p.phone.replace(/\s/g, "")}`)}
                      className="shrink-0 bg-secondary rounded-[28px] px-[16px] py-[12px] flex items-center gap-[10px]"
                    >
                      <div className={`w-[32px] h-[32px] rounded-full ${getCarrierAccent(p.carrier)} flex items-center justify-center`}>
                        <Smartphone size={14} className="text-background" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-foreground">{p.phone}</p>
                        <p className="text-xs font-normal text-foreground-secondary">{p.carrier} · {p.lastAmount}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Recent transactions ──────────────────────────── */}
            <div className="pt-[32px]">
              <div className="flex items-center justify-between px-[22px] pb-[8px]">
                <p className="text-sm font-semibold text-foreground">Gan day</p>
                <button
                  type="button"
                  onClick={() => router.push("/vas/history")}
                  className="text-sm font-semibold text-success"
                >
                  Xem tat ca
                </button>
              </div>
              <div className="px-[22px]">
                {RECENT.map((tx, idx) => (
                  <div
                    key={tx.id}
                    className={`flex items-center gap-[12px] py-[12px] ${idx < RECENT.length - 1 ? "border-b border-border" : ""}`}
                  >
                    <div className="w-[36px] h-[36px] rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <tx.Icon size={16} className="text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{tx.label}</p>
                      <p className="text-xs font-normal text-foreground-secondary">{tx.detail}</p>
                    </div>
                    <div className="shrink-0">
                      <p className="text-xs font-normal text-foreground-secondary">{tx.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

      </div>

      {/* ── Home indicator ──────────────────────────────────────── */}
      <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] bg-background pointer-events-none">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}

export default function VasHomePage() {
  return (
    <React.Suspense fallback={null}>
      <VasHomeContent />
    </React.Suspense>
  )
}
