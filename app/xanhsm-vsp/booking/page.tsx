"use client"

import * as React from "react"
import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Check,
  CreditCard,
  Wallet,
  Plus,
  X,
  Fingerprint,
  MapPin,
  Navigation2,
} from "lucide-react"

/* ── Mocked data ────────────────────────────────────────────────── */
const ROUTE = {
  from: "Vinhomes Ocean Park",
  to: "Keangnam · Phạm Hùng",
  distance: "12.4 km",
  eta: "28 phút",
}

const SERVICES = [
  { id: "bike", name: "Xanh Bike", sub: "2 phút · tiết kiệm", price: 28000, icon: "🛵" },
  { id: "car", name: "Xanh Car", sub: "5 phút · 4 chỗ", price: 48000, icon: "🚗", recommended: true },
  { id: "limo", name: "Xanh Limo", sub: "6 phút · cao cấp", price: 96000, icon: "🚙" },
]

type PayState = "no-vsp" | "has-vsp" | "low-balance" | "topup-sheet" | "topup-success" | "momo"

/* ── Status bar + NavBar — reused across screens ────────────────── */
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

/* ── XanhSM green header ─────────────────────────────────────────── */
const XANH_GRADIENT = "linear-gradient(180deg, #28bdbf 0%, #0b5457 100%)"

function BookingInner() {
  const params = useSearchParams()
  const router = useRouter()
  const state = (params.get("state") as PayState) ?? "no-vsp"

  const [selectedService, setSelectedService] = useState("car")
  const service = SERVICES.find((s) => s.id === selectedService)!
  const ridePrice = service.price

  const vspBalance =
    state === "no-vsp"
      ? 0
      : state === "low-balance" || state === "topup-sheet"
      ? 30_000
      : state === "topup-success"
      ? 80_000
      : 156_000

  const vspCanPay = vspBalance >= ridePrice
  const shortfall = Math.max(0, ridePrice - vspBalance)

  const topUpAmount = 50_000

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      {/* ═══ HERO — XanhSM green ═══ */}
      <div className="text-white relative" style={{ background: XANH_GRADIENT }}>
        <StatusBar dark />

        <div className="flex items-center gap-2 pl-[8px] pr-[22px] h-[56px]">
          <button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full">
            <ChevronLeft size={18} />
          </button>
          <span className="flex-1 text-[18px] font-bold">Xác nhận chuyến</span>
        </div>

        {/* Route summary */}
        <div className="px-[22px] pt-[4px] pb-[24px]">
          <div className="flex gap-[14px]">
            <div className="flex flex-col items-center pt-[4px]">
              <div className="w-[10px] h-[10px] rounded-full bg-white" />
              <div className="w-[1.5px] flex-1 bg-white/40 my-[6px]" />
              <div className="w-[10px] h-[10px] rounded-[2px] bg-white" />
            </div>
            <div className="flex-1 flex flex-col gap-[14px]">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-white/60">Điểm đi</div>
                <div className="text-[15px] font-semibold">{ROUTE.from}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-white/60">Điểm đến</div>
                <div className="text-[15px] font-semibold">{ROUTE.to}</div>
              </div>
            </div>
          </div>
          <div className="mt-[14px] flex items-center gap-[8px] text-[12px] text-white/70">
            <Navigation2 size={12} />
            <span>{ROUTE.distance} · {ROUTE.eta}</span>
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="flex-1 pb-[140px]">
        {/* ─ Service tier ─ */}
        <div className="px-[22px] pt-[24px] pb-[12px]">
          <div className="text-[13px] font-semibold text-foreground-secondary uppercase tracking-wide">Dịch vụ</div>
        </div>
        <div className="px-[22px] flex flex-col gap-[8px]">
          {SERVICES.map((s) => {
            const active = selectedService === s.id
            return (
              <button
                key={s.id}
                onClick={() => setSelectedService(s.id)}
                className={`flex items-center gap-[14px] p-[14px] rounded-[14px] border transition-colors text-left ${
                  active ? "border-foreground bg-secondary" : "border-foreground/10 bg-background"
                }`}
              >
                <div className="w-[44px] h-[44px] rounded-[12px] bg-secondary flex items-center justify-center text-[24px]">
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-[6px]">
                    <span className="text-[15px] font-semibold">{s.name}</span>
                    {s.recommended && <span className="text-[10px] font-semibold text-white px-[6px] py-[1px] rounded-full" style={{ background: "#28bdbf" }}>Đề xuất</span>}
                  </div>
                  <div className="text-[12px] text-foreground-secondary mt-[2px]">{s.sub}</div>
                </div>
                <div className="text-[15px] font-bold">{s.price.toLocaleString("vi-VN")} ₫</div>
              </button>
            )
          })}
        </div>

        {/* ─ Payment method ─ */}
        <div className="px-[22px] pt-[32px] pb-[12px]">
          <div className="text-[13px] font-semibold text-foreground-secondary uppercase tracking-wide">Phương thức</div>
        </div>

        <div className="px-[22px]">
          {/* STATE: no-vsp — show Create VSP wallet chip PROMINENT */}
          {state === "no-vsp" && (
            <>
              <button
                onClick={() => router.push("/xanhsm-vsp/onboarding?state=welcome")}
                className="w-full p-[16px] rounded-[18px] bg-foreground text-background flex items-center gap-[14px]"
              >
                <div className="w-[40px] h-[40px] rounded-full bg-background/10 flex items-center justify-center">
                  <Wallet size={18} />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-[6px]">
                    <span className="text-[15px] font-bold">Tạo ví VSP</span>
                    <span className="text-[10px] font-bold text-foreground px-[6px] py-[1px] rounded-full bg-background">0 phí</span>
                  </div>
                  <div className="text-[12px] text-background/60 mt-[2px]">Setup 2-3 phút · dùng 1 lần</div>
                </div>
                <ChevronRight size={16} />
              </button>

              <div className="flex items-center gap-[10px] my-[14px]">
                <div className="flex-1 h-[1px] bg-foreground/10" />
                <span className="text-[11px] text-foreground-secondary">hoặc dùng</span>
                <div className="flex-1 h-[1px] bg-foreground/10" />
              </div>

              <div className="flex flex-col gap-[6px]">
                <PaymentRow icon="💳" title="MoMo" sub="Đã liên kết" />
                <PaymentRow icon="💰" title="ZaloPay" sub="Đã liên kết" />
                <PaymentRow icon="💳" title="Thẻ ****4521" sub="Techcombank Debit" />
                <PaymentRow icon="💵" title="Tiền mặt" sub="Trả tài xế sau chuyến" />
              </div>
            </>
          )}

          {/* STATE: has-vsp — VSP selected as default */}
          {state === "has-vsp" && (
            <button className="w-full p-[14px] rounded-[14px] border border-foreground bg-secondary flex items-center gap-[14px]">
              <div className="w-[40px] h-[40px] rounded-full bg-foreground text-background flex items-center justify-center">
                <Wallet size={16} />
              </div>
              <div className="flex-1 text-left">
                <div className="text-[15px] font-semibold">VSP</div>
                <div className="text-[12px] text-foreground-secondary mt-[1px]">{vspBalance.toLocaleString("vi-VN")} ₫ khả dụng</div>
              </div>
              <span className="text-[12px] font-semibold text-foreground-secondary">Đổi</span>
            </button>
          )}

          {/* STATE: low-balance / topup-sheet / topup-success */}
          {(state === "low-balance" || state === "topup-sheet" || state === "topup-success") && (
            <button
              className={`w-full p-[14px] rounded-[14px] border flex items-center gap-[14px] ${
                state === "topup-success" ? "border-foreground bg-secondary" : "border-warning/40"
              }`}
              style={state === "topup-success" ? {} : { background: "#fff8ec" }}
            >
              <div className="w-[40px] h-[40px] rounded-full bg-foreground text-background flex items-center justify-center">
                <Wallet size={16} />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-[6px]">
                  <span className="text-[15px] font-semibold">VSP</span>
                  <span className="text-[15px] font-bold">{vspBalance.toLocaleString("vi-VN")} ₫</span>
                </div>
                {!vspCanPay && (
                  <div className="text-[12px] mt-[2px]" style={{ color: "#7a5206" }}>
                    Thiếu {shortfall.toLocaleString("vi-VN")} ₫ cho chuyến này
                  </div>
                )}
                {state === "topup-success" && (
                  <div className="text-[12px] mt-[2px] text-success flex items-center gap-[4px]">
                    <Check size={12} /> Đã nạp {topUpAmount.toLocaleString("vi-VN")} ₫
                  </div>
                )}
              </div>
            </button>
          )}

          {/* Inline top-up CTA when low balance */}
          {state === "low-balance" && (
            <button
              onClick={() => router.replace("/xanhsm-vsp/booking?state=topup-sheet")}
              className="mt-[10px] w-full p-[14px] rounded-[14px] bg-foreground text-background flex items-center gap-[14px]"
            >
              <div className="w-[32px] h-[32px] rounded-full bg-background/10 flex items-center justify-center">
                <Plus size={14} />
              </div>
              <div className="flex-1 text-left">
                <div className="text-[14px] font-bold">Nạp {topUpAmount.toLocaleString("vi-VN")} ₫ từ Techcombank ****4521</div>
                <div className="text-[11px] text-background/60 mt-[1px]">Xác thực vân tay · ~3 giây</div>
              </div>
              <ChevronRight size={14} />
            </button>
          )}

          {(state === "low-balance" || state === "topup-sheet" || state === "topup-success") && (
            <>
              <div className="flex items-center gap-[10px] my-[14px]">
                <div className="flex-1 h-[1px] bg-foreground/10" />
                <span className="text-[11px] text-foreground-secondary">phương thức khác</span>
                <div className="flex-1 h-[1px] bg-foreground/10" />
              </div>
              <div className="flex flex-col gap-[6px]">
                <PaymentRow icon="💳" title="Techcombank ****4521" sub="Trực tiếp không qua VSP" />
                <PaymentRow icon="💰" title="MoMo" sub="Đã liên kết" />
                <PaymentRow icon="💵" title="Tiền mặt" sub="Trả tài xế sau" />
              </div>
            </>
          )}

          {/* STATE: momo — example of non-VSP selected, with VSP as option */}
          {state === "momo" && (
            <>
              <button className="w-full p-[14px] rounded-[14px] border border-foreground bg-secondary flex items-center gap-[14px]">
                <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center text-[20px]" style={{ background: "#d82e7a" }}>💳</div>
                <div className="flex-1 text-left">
                  <div className="text-[15px] font-semibold">MoMo</div>
                  <div className="text-[12px] text-foreground-secondary mt-[1px]">Phí 1.1% · ~528 ₫</div>
                </div>
                <span className="text-[12px] font-semibold text-foreground-secondary">Đổi</span>
              </button>
              <div className="mt-[10px] p-[14px] rounded-[14px] border border-foreground/10 flex items-center gap-[14px]">
                <div className="w-[40px] h-[40px] rounded-full bg-foreground text-background flex items-center justify-center">
                  <Wallet size={16} />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-semibold">Hoặc dùng VSP — 0 phí</div>
                  <div className="text-[11px] text-foreground-secondary mt-[1px]">Tiết kiệm {(528).toLocaleString("vi-VN")} ₫ chuyến này</div>
                </div>
                <button className="h-[32px] px-[14px] bg-foreground text-background rounded-full text-[12px] font-semibold">Đổi</button>
              </div>
            </>
          )}
        </div>

        {/* Fee summary */}
        <div className="px-[22px] pt-[32px]">
          <div className="p-[14px] rounded-[14px] bg-secondary">
            <div className="flex items-center justify-between text-[13px] mb-[6px]">
              <span className="text-foreground-secondary">Giá chuyến</span>
              <span className="font-semibold">{ridePrice.toLocaleString("vi-VN")} ₫</span>
            </div>
            {state === "momo" && (
              <div className="flex items-center justify-between text-[13px] mb-[6px]">
                <span className="text-foreground-secondary">Phí thanh toán MoMo</span>
                <span className="font-semibold">+528 ₫</span>
              </div>
            )}
            <div className="h-[1px] bg-foreground/10 my-[8px]" />
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-semibold">Tổng trả</span>
              <span className="text-[17px] font-bold">{(ridePrice + (state === "momo" ? 528 : 0)).toLocaleString("vi-VN")} ₫</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ BOTTOM CTA ═══ */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto pointer-events-auto">
        <div className="px-[22px] pt-[14px] pb-[34px]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 30%, rgba(255,255,255,1) 100%)" }}>
          <button
            disabled={state === "low-balance"}
            onClick={() => {
              if (state === "has-vsp" || state === "topup-success") router.push("/xanhsm-vsp/receipt")
              else if (state === "no-vsp") router.push("/xanhsm-vsp/onboarding?state=welcome")
            }}
            className="w-full h-[52px] rounded-full font-bold text-[15px] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: state === "low-balance" ? "#ccc" : "#0f6b4e", color: "white" }}
          >
            {state === "low-balance" ? "Nạp tiền để tiếp tục" : state === "no-vsp" ? "Tạo ví VSP để tiếp tục" : `Đặt chuyến · ${(ridePrice + (state === "momo" ? 528 : 0)).toLocaleString("vi-VN")} ₫`}
          </button>
        </div>
      </div>

      {/* ═══ TOP-UP BOTTOM SHEET ═══ */}
      {state === "topup-sheet" && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => router.replace("/xanhsm-vsp/booking?state=low-balance")} />
          <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto z-50 bg-background rounded-t-[28px] p-[22px] pb-[34px]">
            <div className="w-[40px] h-[4px] rounded-full bg-foreground/20 mx-auto mb-[18px]" />
            <div className="flex items-center justify-between mb-[16px]">
              <span className="text-[19px] font-bold">Nạp VSP</span>
              <button onClick={() => router.replace("/xanhsm-vsp/booking?state=low-balance")} className="w-[32px] h-[32px] rounded-full bg-secondary flex items-center justify-center">
                <X size={16} />
              </button>
            </div>

            <div className="p-[16px] rounded-[16px] bg-secondary mb-[16px]">
              <div className="text-[12px] text-foreground-secondary">Số tiền nạp</div>
              <div className="text-[36px] font-black tracking-[-1.5px] leading-none mt-[4px]">
                {topUpAmount.toLocaleString("vi-VN")} <span className="text-[20px] font-bold text-foreground/40">₫</span>
              </div>
              <div className="text-[12px] text-foreground-secondary mt-[6px]">
                Số dư sau nạp: {(vspBalance + topUpAmount).toLocaleString("vi-VN")} ₫
              </div>
            </div>

            <div className="text-[11px] font-semibold text-foreground-secondary uppercase tracking-wide mb-[8px]">Từ nguồn</div>
            <div className="p-[14px] rounded-[14px] border border-foreground/10 flex items-center gap-[14px] mb-[20px]">
              <div className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center text-[12px] font-bold text-white" style={{ background: "#d32c1f" }}>
                TCB
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-semibold">Techcombank ****4521</div>
                <div className="text-[11px] text-foreground-secondary mt-[1px]">Ngân hàng TMCP Kỹ thương Việt Nam</div>
              </div>
              <span className="text-[12px] font-semibold text-foreground-secondary">Đổi</span>
            </div>

            <button
              onClick={() => router.replace("/xanhsm-vsp/booking?state=topup-success")}
              className="w-full h-[52px] rounded-full bg-foreground text-background font-bold text-[15px] flex items-center justify-center gap-[8px]"
            >
              <Fingerprint size={18} />
              Xác thực vân tay để nạp
            </button>

            <div className="text-center text-[11px] text-foreground-secondary mt-[10px]">
              Miễn phí · xử lý trong 3 giây
            </div>
          </div>
        </>
      )}

      {/* Home indicator */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] h-[21px] flex items-end justify-center pb-[4px] pointer-events-none z-[60]">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}

function PaymentRow({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <button className="w-full p-[14px] rounded-[14px] border border-foreground/10 bg-background flex items-center gap-[14px] text-left hover:bg-secondary/50 transition-colors">
      <div className="w-[40px] h-[40px] rounded-full bg-secondary flex items-center justify-center text-[20px]">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-semibold">{title}</div>
        <div className="text-[12px] text-foreground-secondary mt-[1px]">{sub}</div>
      </div>
      <div className="w-[20px] h-[20px] rounded-full border border-foreground/20" />
    </button>
  )
}

export default function BookingPage() {
  return (
    <Suspense>
      <BookingInner />
    </Suspense>
  )
}
