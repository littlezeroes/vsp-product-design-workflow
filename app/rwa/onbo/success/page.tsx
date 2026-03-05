"use client"

/**
 * ONBO · Success / Unlock Confirmation Screen
 *
 * First Principles:
 * - "Reinforce good decision" — user vừa hoàn thành một hành động lớn (trust gap)
 * - Progressive Commitment endpoint: Explore → Learn → KYC → Unlock ← đây
 * - Show concrete outcome, không nói "thành công" chung chung
 * - Next action rõ ràng: quay về dự án vừa xem → close the loop
 *
 * Flow: Wallet Setup → this screen → Home (PREO phase)
 */

import * as React from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, TrendingUp, Wallet, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/header"

/* ── Page ───────────────────────────────────────────────────────────── */
export default function OnboSuccessPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">

        {/* ── Header — no back (end of onboarding) ────────────────── */}
        <Header
          variant="default"
          showStatusBar={false}
        />

        {/* ── Content ─────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto pb-[120px]">

          {/* ── Success hero ──────────────────────────────────────── */}
          <div className="flex flex-col items-center pt-[40px] pb-[8px] px-[22px]">
            <div className="w-[80px] h-[80px] rounded-full bg-success/10 flex items-center justify-center mb-[20px]">
              <CheckCircle2 size={40} className="text-success" />
            </div>
            <h1 className="text-xl font-bold leading-8 tracking-[-0.016em] text-foreground text-center mb-[8px]">
              Tài khoản đầu tư đã mở khóa!
            </h1>
            <p className="text-sm text-foreground-secondary text-center leading-5 px-[8px]">
              Bạn đã sẵn sàng đầu tư vào bất động sản cùng POLARIS.
            </p>
          </div>

          {/* ── What user now has — concrete, not generic ─────────── */}
          <div className="pt-[24px] px-[22px]">
            <p className="text-xs font-semibold text-foreground-secondary uppercase tracking-widest mb-[10px]">
              Bạn vừa mở khóa được
            </p>
            <div className="bg-secondary rounded-[28px] px-[20px] py-[16px]">
              {[
                {
                  icon: <Wallet size={16} className="text-success" />,
                  title: "Ví đầu tư POLARIS",
                  sub:   "Nhận token BĐS sau khi đầu tư thành công",
                },
                {
                  icon: <TrendingUp size={16} className="text-success" />,
                  title: "Quyền tham gia Token Offering",
                  sub:   "Đầu tư vào các dự án BĐS đang mở bán",
                },
                {
                  icon: <ShieldCheck size={16} className="text-success" />,
                  title: "Quyền lợi pháp lý được ghi nhận",
                  sub:   "Trên blockchain · Không thể bị thay đổi",
                },
              ].map((item, i, arr) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 py-[10px] ${
                    i < arr.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="w-[32px] h-[32px] rounded-[8px] bg-background flex items-center justify-center shrink-0 mt-[1px]">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-5">{item.title}</p>
                    <p className="text-xs text-foreground-secondary leading-4 mt-[2px]">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Project hook — close the loop with intent ─────────── */}
          <div className="pt-[12px] px-[22px]">
            <div className="bg-info/8 rounded-[14px] px-[14px] py-[12px]">
              <p className="text-xs font-semibold text-foreground-secondary uppercase tracking-widest mb-[4px]">
                Dự án bạn quan tâm trước đó
              </p>
              <p className="text-sm font-bold text-foreground mb-[10px]">
                Landmark 81 · Giai đoạn 1
              </p>
              <button
                type="button"
                onClick={() => router.push("/rwa")}
                className="text-xs font-semibold text-success focus-visible:outline-none focus-visible:underline"
              >
                Xem lại dự án →
              </button>
            </div>
          </div>

        </div>

        {/* ── Fixed CTA ───────────────────────────────────────────── */}
        <div className="absolute bottom-[21px] inset-x-0 px-[22px] pb-3 bg-background">
          <Button
            variant="primary"
            size="48"
            className="w-full"
            onClick={() => router.push("/rwa")}
          >
            Khám phá dự án đầu tư
          </Button>
        </div>

        {/* ── Home indicator ──────────────────────────────────────── */}
        <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] bg-background pointer-events-none">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>

      </div>
    </div>
  )
}
