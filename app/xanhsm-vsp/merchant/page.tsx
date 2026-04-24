"use client"

import * as React from "react"
import Image from "next/image"
import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronLeft, Store, ArrowUpRight, Check, Fingerprint, TrendingUp, Clock, ChevronRight } from "lucide-react"
import { StatusBar, HomeIndicator, BG_GRAD, VSP_GRAD, MapTexture } from "../_shared"

/* Luồng Merchant (slide 5):
 *   "Food Merchant: Đề xuất ví VSP cho các merchant là Cá nhân kinh doanh
 *    và Hộ kinh doanh → Merchant chủ động rút tiền, Xanh giảm được chi phí
 *    chuyển khoản ngân hàng."
 *
 * States:
 *   home       — Merchant wallet (số dư settle + today sales)
 *   cashout    — Real-time manual cash out (UI rút)
 *   cashout-ok — rút thành công
 */

type S = "home" | "cashout" | "cashout-ok"

function Inner() {
  const params = useSearchParams()
  const router = useRouter()
  const state = (params.get("state") as S) ?? "home"
  const push = (s: S) => router.push(`/xanhsm-vsp/merchant?state=${s}`)

  return (
    <div className="relative w-full max-w-[390px] min-h-screen flex flex-col" style={{ background: BG_GRAD }}>
      <MapTexture />
      <div className="relative z-10 flex-1 flex flex-col pb-[40px]">
        <StatusBar />
        <div className="flex items-center gap-2 pl-[8px] pr-[22px] h-[56px]">
          <button onClick={() => (state === "home" ? router.push("/xanhsm-vsp/wallet?state=active") : router.back())} className="p-[10px] min-h-[44px] rounded-full">
            <ChevronLeft size={20} />
          </button>
          <span className="flex-1 text-[18px] font-black">
            {state === "home" && "Ví đối tác · Phở Hoà Pasteur"}
            {state === "cashout" && "Rút về ngân hàng"}
            {state === "cashout-ok" && ""}
          </span>
        </div>

        {state === "home" && (
          <div className="flex-1 pb-[40px]">
            {/* Settle balance card */}
            <div className="px-[18px] pt-[6px] pb-[12px]">
              <div className="rounded-[22px] p-[20px] text-white relative overflow-hidden" style={{ background: "#28bdbf", boxShadow: "0 4px 14px rgba(40,189,191,0.35)" }}>
                <div className="flex items-center gap-[10px] mb-[12px]">
                  <Store size={16} className="text-white/70" />
                  <span className="text-[11px] uppercase tracking-wide text-white/70">Settlement · sẵn sàng rút</span>
                </div>
                <div className="text-[36px] font-black tracking-[-1.5px] leading-none">
                  4.280.000 <span className="text-[22px] font-bold text-white/50">₫</span>
                </div>
                <div className="text-[11px] text-white/70 mt-[8px]">
                  Real-time · không cần đợi T+1 từ ngân hàng
                </div>
                <button onClick={() => push("cashout")} className="mt-[14px] w-full h-[44px] bg-white text-[#0b5457] rounded-full text-[14px] font-bold flex items-center justify-center gap-[6px]">
                  <ArrowUpRight size={16} /> Rút về ngân hàng
                </button>
              </div>
            </div>

            {/* Today sales */}
            <div className="px-[18px] pb-[12px]">
              <div className="grid grid-cols-2 gap-[10px]">
                <div className="rounded-[18px] bg-white p-[14px] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center gap-[6px] mb-[6px]">
                    <TrendingUp size={14} className="text-success" />
                    <span className="text-[11px] text-foreground-secondary">Doanh thu hôm nay</span>
                  </div>
                  <div className="text-[18px] font-black">1.240.000 ₫</div>
                  <div className="text-[10px] text-foreground-secondary mt-[1px]">42 đơn</div>
                </div>
                <div className="rounded-[18px] bg-white p-[14px] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center gap-[6px] mb-[6px]">
                    <Clock size={14} className="text-foreground-secondary" />
                    <span className="text-[11px] text-foreground-secondary">Chờ settle</span>
                  </div>
                  <div className="text-[18px] font-black">180.000 ₫</div>
                  <div className="text-[10px] text-foreground-secondary mt-[1px]">Trong 15 phút</div>
                </div>
              </div>
            </div>

            <div className="px-[22px] pt-[10px] pb-[8px] flex items-center justify-between">
              <span className="text-[15px] font-black">Giao dịch gần đây</span>
              <button className="text-[12px] text-foreground-secondary font-medium">Tất cả</button>
            </div>
            <div className="px-[18px]">
              <div className="rounded-[16px] bg-white overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                {[
                  { title: "Đơn #4821 · Phở bò tái gầu", amount: 85_000, time: "21:32" },
                  { title: "Đơn #4820 · Phở gà", amount: 70_000, time: "21:28" },
                  { title: "Đã rút về Techcombank ****4412", amount: -3_000_000, time: "18:00", cashout: true },
                  { title: "Đơn #4818 · Phở đặc biệt × 2", amount: 190_000, time: "17:45" },
                ].map((t, i, arr) => (
                  <div key={i} className={`flex items-center gap-[12px] px-[14px] py-[11px] ${i < arr.length - 1 ? "border-b border-foreground/5" : ""}`}>
                    <div className="w-[34px] h-[34px] rounded-full bg-[#e5f2f3] flex items-center justify-center">
                      {t.cashout ? <ArrowUpRight size={14} className="text-[#b45309]" /> : <Store size={14} className="text-[#0b5457]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold truncate">{t.title}</div>
                      <div className="text-[10px] text-foreground-secondary mt-[1px]">Hôm nay · {t.time}</div>
                    </div>
                    <div className={`text-[13px] font-bold ${t.amount > 0 ? "text-success" : "text-[#b45309]"}`}>
                      {t.amount > 0 ? "+" : "-"}{Math.abs(t.amount).toLocaleString("vi-VN")} ₫
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Value prop */}
            <div className="px-[18px] pt-[18px]">
              <div className="rounded-[16px] bg-[#fef3c7] p-[14px] flex items-start gap-[10px]">
                <div className="w-[32px] h-[32px] rounded-full bg-[#fde68a] flex items-center justify-center shrink-0">
                  <TrendingUp size={14} className="text-[#92400e]" />
                </div>
                <div className="flex-1">
                  <div className="text-[12px] font-bold" style={{ color: "#5b3a04" }}>Tiết kiệm 2-4% phí chuyển khoản so với settle qua ngân hàng</div>
                  <div className="text-[10px] mt-[2px]" style={{ color: "#7a5206" }}>Ví VSP bypass bank fee cho Cá nhân KD và Hộ KD</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {state === "cashout" && (
          <div className="flex-1 pb-[120px]">
            <div className="px-[22px] pt-[8px] pb-[16px]">
              <div className="text-[13px] text-foreground-secondary">Có thể rút</div>
              <div className="text-[17px] font-bold mt-[2px]">4.280.000 ₫ · 0 phí trong ngày</div>
            </div>
            <div className="px-[18px] mb-[16px]">
              <div className="rounded-[20px] bg-white p-[20px] text-center">
                <div className="text-[11px] text-foreground-secondary uppercase tracking-wide">Số tiền rút</div>
                <div className="text-[40px] font-black tracking-[-1.5px] leading-none mt-[6px]">
                  4.280.000 <span className="text-[22px] font-bold text-foreground/40">₫</span>
                </div>
                <div className="text-[12px] text-foreground-secondary mt-[8px]">Rút toàn bộ settlement · sẽ về trong 5 phút</div>
              </div>
            </div>
            <div className="px-[18px]">
              <div className="text-[11px] font-bold text-foreground-secondary uppercase tracking-wide mb-[10px]">Về tài khoản</div>
              <div className="rounded-[14px] bg-white p-[14px] flex items-center gap-[12px]">
                <div className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center text-[11px] font-bold text-white" style={{ background: "#d32c1f" }}>TCB</div>
                <div className="flex-1">
                  <div className="text-[14px] font-semibold">Techcombank ****4412</div>
                  <div className="text-[11px] text-foreground-secondary">Tài khoản Hộ KD Phở Hoà Pasteur</div>
                </div>
                <ChevronRight size={14} className="text-foreground-secondary" />
              </div>
            </div>
            <div className="px-[22px] pt-[14px] text-[11px] text-foreground-secondary">
              Hoa hồng Green SM đã trừ trước. Số còn lại là của merchant.
            </div>
          </div>
        )}

        {state === "cashout-ok" && (
          <div className="flex-1 flex flex-col items-center justify-start pt-[60px] px-[22px]">
            <Image src="/vsp-icons/check.png" alt="Done" width={104} height={104} className="mb-[18px]" />
            <div className="text-[30px] font-black text-center tracking-[-0.3px] mb-[6px]">Đã rút 4.280.000 ₫</div>
            <div className="text-[14px] text-foreground-secondary text-center mb-[24px]">Vào Techcombank ****4412 · real-time qua VSP</div>
            <div className="w-full rounded-[18px] bg-white p-[16px]">
              <div className="flex justify-between py-[10px] border-b border-foreground/5"><span className="text-[13px] text-foreground-secondary">Phí</span><span className="text-[13px] font-semibold text-success">0 ₫</span></div>
              <div className="flex justify-between py-[10px] border-b border-foreground/5"><span className="text-[13px] text-foreground-secondary">Tiết kiệm so với bank</span><span className="text-[13px] font-semibold">~85.600 ₫ (2%)</span></div>
              <div className="flex justify-between py-[10px] border-b border-foreground/5"><span className="text-[13px] text-foreground-secondary">Mã giao dịch</span><span className="text-[13px] font-semibold">MCH-RTG-1208</span></div>
              <div className="flex justify-between py-[10px]"><span className="text-[13px] text-foreground-secondary">Thời gian</span><span className="text-[13px] font-semibold">23/04 · 21:44</span></div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto pointer-events-auto">
        <div className="px-[22px] pt-[14px] pb-[34px]" style={{ background: "linear-gradient(180deg, rgba(244,246,247,0) 0%, rgba(244,246,247,0.95) 30%, rgba(244,246,247,1) 100%)" }}>
          {state === "cashout" && (
            <button onClick={() => push("cashout-ok")} className="w-full h-[52px] rounded-full text-white font-bold text-[15px] flex items-center justify-center gap-[8px]" style={{ background: VSP_GRAD }}>
              <Fingerprint size={18} /> Xác thực rút
            </button>
          )}
          {state === "cashout-ok" && (
            <button onClick={() => push("home")} className="w-full h-[52px] rounded-full text-white font-bold text-[15px]" style={{ background: VSP_GRAD }}>
              Xong
            </button>
          )}
        </div>
      </div>

      <HomeIndicator />
    </div>
  )
}

export default function MerchantPage() {
  return <Suspense><Inner /></Suspense>
}
