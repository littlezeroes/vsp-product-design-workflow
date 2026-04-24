"use client"

import * as React from "react"
import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronLeft, Check, Star, Wallet } from "lucide-react"

type RState = "default" | "rated"

function StatusBar({ dark = false }: { dark?: boolean }) {
  const color = dark ? "white" : "currentColor"
  return (
    <div className="h-[54px] px-[22px] flex items-end justify-between pb-[6px]" style={{ color }}>
      <span className="text-[15px] font-semibold">9:41</span>
      <div className="flex items-center gap-[6px]">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="0.5"/><rect x="4" y="5" width="3" height="7" rx="0.5"/><rect x="8" y="2" width="3" height="10" rx="0.5"/><rect x="12" y="0" width="3" height="12" rx="0.5"/></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="currentColor"/><path d="M4.5 7.5a5 5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M2 5a8 8 0 0 1 12 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
        <div className="flex items-center gap-[1px]"><div className="w-[22px] h-[11px] rounded-[3px] border border-current flex items-center p-[1px]"><div className="flex-1 h-full bg-current rounded-[1.5px]"/></div><div className="w-[1px] h-[4px] bg-current opacity-40 rounded-full"/></div>
      </div>
    </div>
  )
}

function ReceiptInner() {
  const params = useSearchParams()
  const router = useRouter()
  const state = (params.get("state") as RState) ?? "default"
  const [rating, setRating] = useState(state === "rated" ? 5 : 0)

  const ride = { price: 48_000, balanceAfter: 32_000, route: { from: "Vinhomes Ocean Park", to: "Keangnam" }, eta: "28 phút", driver: "Anh Tuấn", plate: "30A-999.88" }

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      {/* ═══ HERO green ═══ */}
      <div className="text-white relative" style={{ background: "linear-gradient(180deg, #28bdbf 0%, #0b5457 100%)" }}>
        <StatusBar dark />
        <div className="flex items-center gap-2 pl-[8px] pr-[22px] h-[56px]">
          <button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full">
            <ChevronLeft size={18} />
          </button>
          <span className="flex-1 text-[18px] font-bold">Chuyến xong</span>
        </div>

        <div className="px-[22px] pt-[8px] pb-[32px]">
          <div className="w-[72px] h-[72px] rounded-full bg-white/15 flex items-center justify-center mb-[20px]">
            <Check size={40} strokeWidth={2.5} />
          </div>

          <div className="text-[13px] text-white/70">Đã trả bằng VSP</div>
          <div className="text-[44px] font-black tracking-[-2px] leading-none mt-[2px]">
            {ride.price.toLocaleString("vi-VN")} <span className="text-[24px] font-bold text-white/40">₫</span>
          </div>
          <div className="text-[13px] text-white/70 mt-[12px] flex items-center gap-[6px]">
            <Wallet size={13} />
            <span>Còn {ride.balanceAfter.toLocaleString("vi-VN")} ₫ trong ví</span>
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="flex-1 pb-[140px]">
        {/* Route */}
        <div className="px-[22px] pt-[24px]">
          <div className="flex gap-[14px]">
            <div className="flex flex-col items-center pt-[4px]">
              <div className="w-[10px] h-[10px] rounded-full bg-foreground/70" />
              <div className="w-[1.5px] flex-1 bg-foreground/20 my-[6px]" />
              <div className="w-[10px] h-[10px] rounded-[2px] bg-foreground/70" />
            </div>
            <div className="flex-1 flex flex-col gap-[14px] pb-[6px]">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-foreground-secondary">Điểm đi</div>
                <div className="text-[15px] font-semibold">{ride.route.from}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-foreground-secondary">Điểm đến</div>
                <div className="text-[15px] font-semibold">{ride.route.to}</div>
              </div>
            </div>
          </div>
          <div className="mt-[8px] text-[12px] text-foreground-secondary">Xanh Car · {ride.eta}</div>
        </div>

        {/* Rate driver */}
        <div className="pt-[28px]">
          <div className="px-[22px] pb-[12px]">
            <div className="text-[13px] font-semibold text-foreground-secondary uppercase tracking-wide">Đánh giá tài xế</div>
          </div>
          <div className="mx-[22px] p-[18px] rounded-[18px] bg-secondary flex items-center gap-[14px]">
            <div className="w-[52px] h-[52px] rounded-full bg-foreground text-background flex items-center justify-center text-[16px] font-bold">
              AT
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-semibold">{ride.driver}</div>
              <div className="text-[12px] text-foreground-secondary mt-[1px]">{ride.plate} · ⭐ 4.9</div>
              <div className="flex items-center gap-[4px] mt-[10px]">
                {[1, 2, 3, 4, 5].map((n) => {
                  const filled = n <= rating
                  return (
                    <button key={n} onClick={() => setRating(n)} className="p-[2px]">
                      <Star
                        size={22}
                        fill={filled ? "#F2BF00" : "none"}
                        className={filled ? "text-[#F2BF00]" : "text-foreground/30"}
                        strokeWidth={1.4}
                      />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Invoice line item */}
        <div className="pt-[24px]">
          <div className="px-[22px] pb-[12px]">
            <div className="text-[13px] font-semibold text-foreground-secondary uppercase tracking-wide">Chi tiết</div>
          </div>
          <div className="mx-[22px] p-[16px] rounded-[16px] border border-foreground/10">
            <div className="flex justify-between text-[13px] mb-[8px]">
              <span className="text-foreground-secondary">Giá chuyến</span>
              <span className="font-semibold">{ride.price.toLocaleString("vi-VN")} ₫</span>
            </div>
            <div className="flex justify-between text-[13px] mb-[8px]">
              <span className="text-foreground-secondary">Phí thanh toán</span>
              <span className="font-semibold text-success">0 ₫</span>
            </div>
            <div className="h-[1px] bg-foreground/10 my-[8px]" />
            <div className="flex justify-between">
              <span className="text-[14px] font-semibold">Đã trừ VSP</span>
              <span className="text-[16px] font-bold">{ride.price.toLocaleString("vi-VN")} ₫</span>
            </div>
            <button className="mt-[14px] w-full text-[13px] font-semibold text-foreground-secondary py-[8px]">
              Xem hoá đơn điện tử
            </button>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto pointer-events-auto">
        <div className="px-[22px] pt-[14px] pb-[34px]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 30%, rgba(255,255,255,1) 100%)" }}>
          <div className="flex gap-[8px]">
            <button className="flex-1 h-[52px] rounded-full bg-secondary text-foreground font-semibold text-[14px]">
              Xem hoá đơn
            </button>
            <button
              onClick={() => router.push("/xanhsm-vsp/booking?state=has-vsp")}
              className="flex-1 h-[52px] rounded-full text-white font-bold text-[15px]"
              style={{ background: "#28bdbf" }}
            >
              Đặt tiếp
            </button>
          </div>
        </div>
      </div>

      {/* Home indicator */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] h-[21px] flex items-end justify-center pb-[4px] pointer-events-none z-[60]">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}

export default function ReceiptPage() {
  return (
    <Suspense>
      <ReceiptInner />
    </Suspense>
  )
}
