"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Building2, CheckCircle2, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/header"
import { InformMessage } from "@/components/ui/inform-message"

/* ── Mock user (in production: from VPay session) ───────────────────── */
const VPAY_USER = {
  name: "Trần Mai Linh",
  phone: "0901 234 567",
  initial: "T",
}

/* ── Page ───────────────────────────────────────────────────────────── */
export default function VPayEntryPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">

        {/* ── Header ──────────────────────────────────────────────── */}
        <Header
          variant="default"
          showStatusBar={false}
          leading={
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center justify-center pl-[8px] pr-[10px] py-[10px] min-h-[44px] rounded-full text-foreground focus-visible:outline-none"
            >
              <ChevronLeft size={18} />
            </button>
          }
          trailing={
            <div className="flex items-center gap-[6px] pr-[2px]">
              <div className="w-[24px] h-[24px] rounded-[6px] bg-foreground flex items-center justify-center">
                <Building2 size={13} className="text-background" />
              </div>
              <span className="text-[15px] font-bold text-foreground tracking-tight">POLARIS</span>
            </div>
          }
        />

        {/* ── Scrollable content ──────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto pb-[120px]">

          {/* ── Hero logo block ───────────────────────────────────── */}
          <div className="flex flex-col items-center pt-[32px] pb-[8px]">
            <div className="w-[72px] h-[72px] rounded-[20px] bg-foreground flex items-center justify-center mb-[16px]">
              <Building2 size={32} className="text-background" />
            </div>
            <h1 className="text-xl font-bold leading-8 tracking-[-0.016em] text-foreground text-center px-[22px]">
              Đầu tư bất động sản cùng POLARIS
            </h1>
            <p className="text-sm text-foreground-secondary text-center px-[40px] mt-[6px] leading-5">
              Token hoá BĐS cao cấp · Từ 5 triệu đồng · Powered by VPay
            </p>
          </div>

          {/* ── VPay account card ─────────────────────────────────── */}
          <div className="pt-[24px] px-[22px]">
            <p className="text-xs font-semibold text-foreground-secondary uppercase tracking-widest mb-[10px]">
              Tài khoản VPay của bạn
            </p>
            <div className="bg-secondary rounded-[28px] px-[20px] py-[16px] flex items-center gap-[14px]">
              {/* Avatar */}
              <div className="w-[48px] h-[48px] rounded-full bg-background flex items-center justify-center shrink-0">
                <span className="text-[18px] font-bold text-foreground">{VPAY_USER.initial}</span>
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-md font-semibold text-foreground leading-6">{VPAY_USER.name}</p>
                <p className="text-sm text-foreground-secondary leading-5">{VPAY_USER.phone}</p>
              </div>
              {/* Verified badge */}
              <div className="flex items-center gap-[4px] shrink-0">
                <CheckCircle2 size={14} className="text-success" />
                <span className="text-xs font-semibold text-success">Đã xác thực</span>
              </div>
            </div>
          </div>

          {/* ── Value props ───────────────────────────────────────── */}
          <div className="pt-[20px] px-[22px]">
            <div className="bg-secondary rounded-[28px] px-[20px] py-[16px] space-y-0">
              {[
                { label: "Đầu tư từ 5 triệu đồng", sub: "Sở hữu token BĐS cao cấp với vốn nhỏ" },
                { label: "Lợi nhuận thuê nhà hàng quý", sub: "Về ví VPay tự động, không cần làm gì" },
                { label: "Mua bán token dễ dàng", sub: "Thị trường thứ cấp, thanh khoản linh hoạt" },
              ].map((item, i, arr) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 py-[10px] ${i < arr.length - 1 ? "border-b border-border" : ""}`}
                >
                  <CheckCircle2 size={16} className="text-success shrink-0 mt-[2px]" />
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-5">{item.label}</p>
                    <p className="text-xs text-foreground-secondary leading-4 mt-[2px]">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Info note ─────────────────────────────────────────── */}
          <div className="pt-[12px] px-[22px]">
            <InformMessage
              hierarchy="primary"
              icon={<Info size={16} />}
              body="Dùng tài khoản VPay của bạn để vào POLARIS — không cần đăng ký riêng."
            />
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
            Tiếp tục vào POLARIS
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
