"use client"

import * as React from "react"
import { Suspense } from "react"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import {
  Home,
  Clock,
  Bell,
  User,
  Search,
  Sparkles,
  MoreHorizontal,
  Plus,
  ArrowLeftRight,
  QrCode,
  ChevronRight,
} from "lucide-react"

/* GSM Home — đơn giản hoá triệt để:
 *   - BỎ toàn bộ VSP card (full/tile/icon/strip/MVP mode)
 *   - Home Xanh SM thuần: Search + Quick-route + 2 feature card + Services grid + Promo
 *   - Entry point duy nhất của VSP là Bottom nav "Tài khoản" → /xanhsm-vsp/profile
 */

type HomeState = "no-vsp" | "active"

const BG_GRAD = "linear-gradient(180deg, #c9e7e8 0%, #e8f3f3 45%, #f4f6f7 100%)"
const GREEN_RACE = "#b0e8c4"

function StatusBar() {
  return (
    <div className="h-[54px] px-[22px] flex items-end justify-between pb-[6px]">
      <span className="text-[15px] font-semibold">21:44</span>
      <div className="flex items-center gap-[6px]">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="0.5"/><rect x="4" y="5" width="3" height="7" rx="0.5"/><rect x="8" y="2" width="3" height="10" rx="0.5"/><rect x="12" y="0" width="3" height="12" rx="0.5"/></svg>
        <span className="text-[11px] font-bold">5G</span>
        <div className="flex items-center gap-[1px]"><div className="w-[22px] h-[11px] rounded-[3px] border border-current flex items-center p-[1px]"><div className="flex-1 h-full bg-current rounded-[1.5px]"/></div></div>
      </div>
    </div>
  )
}

const SERVICES = [
  { src: "/xanhsm-icons/scooter.png", label: "Xe máy" },
  { src: "/xanhsm-icons/gift-box.png", label: "Giao hàng" },
  { src: "/xanhsm-icons/car-key.png", label: "Thuê xe tự lái" },
  { src: "/xanhsm-icons/vinbus.png", label: "VinBus" },
  { src: "/xanhsm-icons/signpost.png", label: "Liên tỉnh" },
  { src: "/xanhsm-icons/showroom.png", label: "Mua xe VinFast" },
  { src: "/xanhsm-icons/diamond.png", label: "Hội viên" },
  { src: "/xanhsm-icons/gift-discount.png", label: "Thẻ quà tặng" },
]

function HomeInner() {
  const params = useSearchParams()
  const router = useRouter()
  const state = (params.get("state") as HomeState) ?? "no-vsp"

  return (
    <div
      className="relative w-full max-w-[390px] min-h-screen flex flex-col"
      style={{ background: BG_GRAD }}
    >
      {/* subtle map texture via repeating SVG */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(135deg, transparent 40%, #5b9fa2 40%, #5b9fa2 41%, transparent 41%), linear-gradient(45deg, transparent 40%, #5b9fa2 40%, #5b9fa2 41%, transparent 41%)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col">
        <StatusBar />

        {/* Search — white pill */}
        <div className="px-[18px] pt-[12px] pb-[18px]">
          <button className="w-full h-[56px] bg-white rounded-[28px] pl-[22px] pr-[20px] flex items-center gap-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <Search size={20} className="text-foreground-secondary" strokeWidth={2} />
            <span className="text-[16px] text-foreground-secondary font-normal">Bạn muốn đi đâu?</span>
          </button>
        </div>

        {/* Quick-route card */}
        <div className="px-[18px] pb-[18px]">
          <div className="flex items-center gap-[8px] mb-[10px] px-[4px]">
            <Sparkles size={16} className="text-foreground" />
            <span className="text-[15px] font-bold">Đi xe máy cho nhanh hơn nhé?</span>
            <MoreHorizontal size={16} className="ml-auto text-foreground-secondary" />
          </div>
          <div className="flex flex-col gap-[8px]">
            {["Đặt xe đi 53 Đường Số 17", "Đặt xe đi AMERICANO COFFEE"].map((t) => (
              <button
                key={t}
                className="h-[52px] bg-white rounded-[26px] pl-[10px] pr-[20px] flex items-center gap-[10px] shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
              >
                <div className="w-[36px] h-[36px] flex items-center justify-center shrink-0">
                  <Image src="/xanhsm-icons/scooter.png" alt="scooter" width={36} height={36} />
                </div>
                <span className="text-[14px] font-medium">{t}</span>
              </button>
            ))}
          </div>

          {/* 2 chip */}
          <div className="flex gap-[10px] mt-[14px] px-[4px]">
            <button className="h-[34px] px-[16px] bg-white rounded-full text-[13px] font-medium shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              Đặt xe ô tô
            </button>
            <button className="h-[34px] px-[16px] bg-white rounded-full text-[13px] font-medium shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              Đặt đồ ăn
            </button>
          </div>
        </div>

        {/* 2 feature cards */}
        <div className="px-[18px] grid grid-cols-2 gap-[10px] pb-[18px]">
          <button
            onClick={() => router.push("/xanhsm-vsp/booking?state=" + (state === "active" ? "has-vsp" : "no-vsp"))}
            className="relative h-[130px] rounded-[22px] overflow-hidden text-left"
            style={{ background: "linear-gradient(180deg, #ffffff 0%, #d9f0e6 100%)" }}
          >
            <span className="absolute top-[14px] left-[14px] text-[18px] font-black">Gọi xe</span>
            <div className="absolute bottom-[6px] right-[-4px] w-[84px] h-[76px]">
              <Image src="/xanhsm-icons/car.png" alt="car" fill style={{ objectFit: "contain" }} />
            </div>
          </button>
          <button
            className="relative h-[130px] rounded-[22px] overflow-hidden text-left"
            style={{ background: "linear-gradient(180deg, #ffffff 0%, #fff1d9 100%)" }}
          >
            <span className="absolute top-[14px] left-[14px] text-[18px] font-black">Gọi đồ ăn</span>
            <div className="absolute bottom-[6px] right-[0px] w-[78px] h-[72px]">
              <Image src="/xanhsm-icons/food.png" alt="food" fill style={{ objectFit: "contain" }} />
            </div>
          </button>
        </div>

        {/* Dịch vụ khác */}
        <div className="px-[18px] pb-[10px] flex items-center justify-between">
          <span className="text-[16px] font-black">Dịch vụ khác</span>
          <button className="text-[13px] text-foreground-secondary font-medium">Xem tất cả</button>
        </div>
        <div className="px-[18px] grid grid-cols-4 gap-[10px] pb-[20px]">
          {SERVICES.map((s) => (
            <button
              key={s.label}
              className="bg-white rounded-[18px] h-[100px] flex flex-col items-center justify-center gap-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.04)] pt-[6px] relative"
            >
              <div className="w-[48px] h-[48px] flex items-center justify-center">
                <Image src={s.src} alt={s.label} width={48} height={48} />
              </div>
              <span className="text-[10px] font-semibold text-center leading-[1.2] px-[4px]">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Promo banner */}
        <div className="px-[18px] pb-[18px]">
          <div
            className="rounded-[22px] overflow-hidden h-[122px] relative"
            style={{ background: "linear-gradient(135deg, #2a6b6d 0%, #4a9194 60%, #5b9fa2 100%)" }}
          >
            <div className="absolute top-[16px] left-[18px] text-white">
              <div className="flex items-center gap-[6px] mb-[4px]">
                <div className="w-[18px] h-[18px] rounded-full bg-white/90 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 20 20" fill="#0f6b4e"><path d="M10 2 L3 10 L10 18 L17 10 Z"/></svg>
                </div>
                <span className="text-[11px] font-bold tracking-wide">GREEN SM</span>
              </div>
              <div className="text-[17px] font-black leading-[1.15] max-w-[200px]">
                Giao diện hoàn toàn mới
              </div>
            </div>
            <div className="absolute bottom-[10px] right-[8px] flex gap-[6px] opacity-80">
              <span className="text-[32px]">🚗</span>
              <span className="text-[32px]">🏙️</span>
            </div>
          </div>
        </div>

        {/* VSP card — below banner. active: wallet · no-vsp: activation CTA */}
        <div className="px-[18px] pb-[140px]">
          {state === "active" ? (
            <button
              onClick={() => router.push("/xanhsm-vsp/wallet?state=active")}
              className="w-full rounded-[22px] overflow-hidden text-left active:opacity-90"
              style={{
                background: "linear-gradient(135deg, #28bdbf 0%, #0b5457 100%)",
                boxShadow: "0 4px 14px rgba(40,189,191,0.25)",
              }}
            >
              <div className="px-[16px] pt-[14px] pb-[12px] flex items-center gap-[12px]">
                <Image src="/vsp-logo.png" alt="VSP" width={38} height={38} className="rounded-[22%] shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-white/75 uppercase tracking-wide leading-none">Ví V-Smart Pay</div>
                  <div className="text-[20px] font-black text-white leading-none mt-[5px] tracking-[-0.3px]">
                    156.000<span className="text-[12px] font-bold text-white/60 ml-[2px]">₫</span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-white/70 shrink-0" />
              </div>
              <div className="grid grid-cols-3 border-t border-white/15">
                {[
                  { icon: Plus, label: "Nạp", key: "topup" },
                  { icon: ArrowLeftRight, label: "Chuyển", key: "transfer" },
                  { icon: QrCode, label: "QR", key: "qr" },
                ].map((a, i) => (
                  <div
                    key={a.key}
                    className={`py-[10px] flex flex-col items-center gap-[4px] ${i > 0 ? "border-l border-white/15" : ""}`}
                  >
                    <a.icon size={16} className="text-white" strokeWidth={2.2} />
                    <span className="text-[11px] font-bold text-white leading-none">{a.label}</span>
                  </div>
                ))}
              </div>
            </button>
          ) : (
            <button
              onClick={() => router.push("/xanhsm-vsp/profile?state=no-vsp")}
              className="w-full rounded-[22px] overflow-hidden text-left active:opacity-90 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
              style={{ border: "1.5px dashed #bfd5d4" }}
            >
              <div className="px-[16px] py-[14px] flex items-center gap-[12px]">
                <div
                  className="w-[42px] h-[42px] rounded-[13px] flex items-center justify-center shrink-0"
                  style={{ background: "#e5f2f3" }}
                >
                  <Image src="/vsp-logo.png" alt="VSP" width={26} height={26} className="rounded-[22%]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-black leading-tight">Kích hoạt ví VSP</div>
                  <div className="text-[11.5px] text-foreground-secondary mt-[3px] leading-tight">
                    Nhận <span className="font-bold" style={{ color: "#0b5457" }}>50.000₫</span> · thanh toán 0 phí
                  </div>
                </div>
                <span
                  className="h-[32px] px-[14px] rounded-full text-[12px] font-bold text-white flex items-center shrink-0"
                  style={{ background: "#28bdbf", boxShadow: "0 2px 8px rgba(40,189,191,0.35)" }}
                >
                  Kích hoạt
                </span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* ═══ Bottom Nav — floating blur pill + GreenRace chip ═══ */}
      <div className="fixed bottom-[22px] left-[18px] right-[18px] max-w-[354px] mx-auto z-50 flex items-center gap-[8px]">
        <div
          className="flex-1 h-[60px] rounded-full backdrop-blur-[24px] flex items-center justify-around px-[8px] shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
          style={{ background: "rgba(255,255,255,0.82)" }}
        >
          {[
            { icon: Home, label: "Trang chủ", active: true, onClick: () => {} },
            { icon: Clock, label: "Hoạt động", active: false, onClick: () => {} },
            { icon: Bell, label: "Thông báo", active: false, onClick: () => {} },
            {
              icon: User,
              label: "Tài khoản",
              active: false,
              onClick: () => router.push(`/xanhsm-vsp/profile?state=${state}`),
            },
          ].map((t) => (
            <button
              key={t.label}
              onClick={t.onClick}
              className={`w-[44px] h-[44px] rounded-full flex items-center justify-center ${t.active ? "bg-[#86c9cc]/25" : ""}`}
            >
              <t.icon size={22} className={t.active ? "text-[#0b5457]" : "text-foreground-secondary"} strokeWidth={t.active ? 2.2 : 1.7} />
            </button>
          ))}
        </div>
        {/* XEM NGAY floating chip */}
        <button
          className="w-[60px] h-[60px] rounded-full flex flex-col items-center justify-center shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
          style={{ background: `radial-gradient(circle at 50% 40%, ${GREEN_RACE} 0%, #7fcf9a 100%)` }}
        >
          <span className="text-[18px] leading-none">🌿</span>
          <span className="text-[8px] font-black text-[#0b5457] leading-tight mt-[2px]">XEM NGAY</span>
        </button>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] h-[21px] flex items-end justify-center pb-[4px] pointer-events-none z-[60]">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}

export default function GSMHomePage() {
  return (
    <Suspense>
      <HomeInner />
    </Suspense>
  )
}
