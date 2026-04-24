"use client"

import * as React from "react"
import { Suspense, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import {
  ChevronLeft,
  X,
  Link as LinkIcon,
  Leaf,
} from "lucide-react"
import { PinInput } from "@/components/ui/pin-input"

/* VSP × XanhSM Claim Flow
 *   - state=pin-setup   (Case B: chưa có VSP) → nhập PIN
 *   - state=pin-confirm (Case B) → xác nhận PIN → T&C
 *   - state=tnc         (Cả 2 case) → T&C fullscreen modal → Success
 *   - state=success     → đã nhận 50K → về Wallet
 *
 *   URL params:
 *     state: "pin-setup" | "pin-confirm" | "tnc" | "success"
 *     case:  "new" | "existing"
 *     amount: number (success)
 */

type ClaimState = "pin-setup" | "pin-confirm" | "tnc"
type ClaimCase = "new" | "existing"

const BG_GRAD = "linear-gradient(180deg, #c9e7e8 0%, #e8f3f3 45%, #f4f6f7 100%)"

function StatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`h-[54px] px-[22px] flex items-end justify-between pb-[6px] ${dark ? "text-white" : "text-foreground"}`}
    >
      <span className="text-[15px] font-semibold">10:08</span>
      <div className="flex items-center gap-[6px]">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="0.5"/><rect x="4" y="5" width="3" height="7" rx="0.5"/><rect x="8" y="2" width="3" height="10" rx="0.5"/><rect x="12" y="0" width="3" height="12" rx="0.5"/></svg>
        <span className="text-[11px] font-bold">5G</span>
        <div className="flex items-center gap-[1px]"><div className="w-[22px] h-[11px] rounded-[3px] border border-current flex items-center p-[1px]"><div className="flex-1 h-full bg-current rounded-[1.5px]"/></div></div>
      </div>
    </div>
  )
}

function HomeIndicator({ dark = false }: { dark?: boolean }) {
  return (
    <div className="w-full h-[21px] flex items-end justify-center pb-[4px] shrink-0">
      <div className={`w-[139px] h-[5px] rounded-full ${dark ? "bg-white" : "bg-foreground"}`} />
    </div>
  )
}

function ClaimInner() {
  const params = useSearchParams()
  const router = useRouter()
  const state = (params.get("state") as ClaimState) ?? "pin-setup"
  const claimCase = (params.get("case") as ClaimCase) ?? "new"
  const returnTo = params.get("return") // "wallet" khi user đặt PIN từ progress card

  if (state === "pin-setup") {
    return (
      <PinScreen
        title="Đặt mã PIN"
        subtitle="Chọn 6 số dễ nhớ, không trùng SĐT hay ngày sinh."
        onComplete={() =>
          router.push(`/xanhsm-vsp/claim?state=pin-confirm&case=${claimCase}${returnTo ? `&return=${returnTo}` : ""}`)
        }
        onBack={() =>
          router.push(
            returnTo === "wallet" ? `/xanhsm-vsp/wallet?state=no-pin` : `/xanhsm-vsp/profile?state=no-vsp`
          )
        }
      />
    )
  }

  if (state === "pin-confirm") {
    return (
      <PinScreen
        title="Xác nhận mã PIN"
        subtitle="Nhập lại 6 số để xác nhận."
        onComplete={() =>
          router.push(
            returnTo === "wallet"
              ? `/xanhsm-vsp/wallet?state=fresh-50k`
              : `/xanhsm-vsp/claim?state=tnc&case=${claimCase}`
          )
        }
        onBack={() =>
          router.push(`/xanhsm-vsp/claim?state=pin-setup&case=${claimCase}${returnTo ? `&return=${returnTo}` : ""}`)
        }
      />
    )
  }

  if (state === "tnc") {
    return (
      <TncModal
        onClose={() => router.push(`/xanhsm-vsp/profile?state=${claimCase === "new" ? "no-vsp" : "active"}`)}
        onAgree={() =>
          router.push(
            claimCase === "new"
              ? `/xanhsm-vsp/wallet?state=no-pin`
              : `/xanhsm-vsp/wallet?state=fresh-50k`
          )
        }
      />
    )
  }

  return null
}

/* ─────────────────────────────────────────── */
/* PIN screen — iOS numpad + 6 PIN boxes      */
/* ─────────────────────────────────────────── */
function PinScreen({
  title,
  subtitle,
  onComplete,
  onBack,
}: {
  title: string
  subtitle: string
  onComplete: () => void
  onBack: () => void
}) {
  const [pin, setPin] = useState("")
  const pinWrapRef = useRef<HTMLDivElement>(null)

  // Auto-advance when 6 digits entered
  useEffect(() => {
    if (pin.length === 6) {
      const t = setTimeout(onComplete, 250)
      return () => clearTimeout(t)
    }
  }, [pin, onComplete])

  // Auto-focus NEXT empty PIN box to show tiffany active state
  useEffect(() => {
    const inputs = pinWrapRef.current?.querySelectorAll<HTMLInputElement>("input")
    if (!inputs) return
    const idx = Math.min(pin.length, inputs.length - 1)
    inputs[idx]?.focus({ preventScroll: true })
  }, [pin.length])

  const press = (n: string) => {
    if (pin.length >= 6) return
    setPin(pin + n)
  }
  const del = () => setPin(pin.slice(0, -1))

  return (
    <div className="relative w-full max-w-[390px] h-screen overflow-hidden flex flex-col bg-white">
      <StatusBar />

      {/* NavBar — large-title pattern: icon-only, page name nằm ở big title bên dưới */}
      <div className="flex items-center gap-2 pl-[8px] pr-[22px] h-[56px]">
        <button onClick={onBack} className="p-[10px] min-h-[44px] rounded-full">
          <ChevronLeft size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Big title — left-aligned, no logo (old UI) */}
        <div className="px-[22px] pt-[8px] pb-[22px]">
          <div className="text-[32px] font-bold tracking-[-0.5px] leading-[1.15] text-foreground">
            {title}
          </div>
          <div className="text-[13px] text-foreground-secondary mt-[6px]">
            {subtitle}
          </div>
        </div>

        {/* PIN boxes — left-aligned */}
        <div className="px-[22px]" style={{ ["--brand-secondary" as string]: "#28bdbf" }} ref={pinWrapRef}>
          <PinInput length={6} value={pin} onChange={setPin} secure />
        </div>

        {/* Hiện mã PIN — gần PIN boxes */}
        <div className="px-[22px] pt-[8px] flex items-center justify-start">
          <span className="inline-flex items-center px-[12px] h-[28px] rounded-full text-[12px] font-semibold" style={{ background: "#e5f2f3", color: "#0b5457" }}>
            Hiện mã PIN
          </span>
        </div>

        <div className="flex-1" />

        {/* iOS-style keypad with letters */}
        <div className="pt-[12px] pb-[8px] px-[6px]" style={{ background: "#d1d5db" }}>
          <div className="grid grid-cols-3 gap-[6px]">
            {[
              ["1", ""],
              ["2", "ABC"],
              ["3", "DEF"],
              ["4", "GHI"],
              ["5", "JKL"],
              ["6", "MNO"],
              ["7", "PQRS"],
              ["8", "TUV"],
              ["9", "WXYZ"],
              ["", ""],
              ["0", ""],
              ["del", ""],
            ].map(([k, letters], i) => {
              if (k === "") return <div key={i} />
              if (k === "del") {
                return (
                  <button key={i} onClick={del} onMouseDown={(e) => e.preventDefault()} className="h-[46px] flex items-center justify-center active:opacity-60">
                    <svg width="24" height="18" viewBox="0 0 28 22" fill="none" className="text-foreground">
                      <path d="M9 2h17v18H9L2 11z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                      <path d="M15 7l6 8m0-8l-6 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>
                )
              }
              return (
                <button
                  key={i}
                  onClick={() => press(k)}
                  onMouseDown={(e) => e.preventDefault()}
                  className="h-[46px] rounded-[6px] bg-white active:bg-[#e5e7eb] transition-colors flex flex-col items-center justify-center"
                  style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.16)" }}
                >
                  <span className="text-[22px] leading-[1] font-normal text-foreground">{k}</span>
                  {letters && (
                    <span className="text-[8px] tracking-[2px] text-foreground-secondary mt-[1px]">{letters}</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex justify-center py-[8px] bg-[#d1d5db]">
          <HomeIndicator />
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────── */
/* T&C fullscreen modal                        */
/* ─────────────────────────────────────────── */
function TncModal({ onClose, onAgree }: { onClose: () => void; onAgree: () => void }) {
  const [agreed, setAgreed] = useState(false)
  const benefits = [
    {
      icon: "/claim-icons/icon.png",
      title: "Nạp rút nhanh qua ngân hàng",
      desc: "Techcombank · Miễn phí · 2 phút",
    },
    {
      icon: "/claim-icons/icon-1.png",
      title: "Thanh toán dịch vụ Xanh SM",
      desc: "Gọi xe · Đồ ăn · 0 phí",
    },
    {
      icon: "/claim-icons/icon-2.png",
      title: "Ưu đãi độc quyền cho thành viên",
      desc: "Voucher · hoàn tiền · tích điểm",
    },
    {
      icon: "/claim-icons/icon-3.png",
      title: "Bảo mật bằng PIN 6 số",
      desc: "Xác thực mọi giao dịch an toàn",
    },
  ]

  return (
    <div className="relative w-full max-w-[390px] h-screen overflow-hidden flex flex-col bg-white">
      <StatusBar />

      {/* Close button only */}
      <div className="flex items-center pl-[12px] pr-[22px] h-[56px]">
        <button onClick={onClose} className="p-[10px] min-h-[44px] rounded-full">
          <X size={22} />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-[16px]">
        {/* Hero: 2 logo chain */}
        <div className="px-[22px] pt-[8px] pb-[18px] flex items-center justify-center gap-[14px]">
          <Image src="/vsp-logo.png" alt="VSP" width={52} height={52} className="rounded-[22%] shadow-[0_4px_14px_rgba(40,189,191,0.3)]" />
          <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center" style={{ background: "#e5f2f3" }}>
            <LinkIcon size={14} style={{ color: "#0b5457" }} strokeWidth={2.5} />
          </div>
          <div
            className="w-[52px] h-[52px] rounded-[16px] flex items-center justify-center shadow-[0_4px_14px_rgba(11,107,78,0.25)]"
            style={{ background: "linear-gradient(135deg, #2a6b6d 0%, #4a9194 100%)" }}
          >
            <Leaf size={26} color="#fff" strokeWidth={2.2} />
          </div>
        </div>

        {/* Title */}
        <div className="px-[22px] pb-[18px] text-center">
          <div className="text-[22px] font-black tracking-[-0.3px] leading-[1.2]">
            Liên kết Ví VSP với Xanh SM
          </div>
        </div>

        {/* Reward highlight — prominent tiffany card */}
        <div className="px-[22px] pb-[22px]">
          <div
            className="w-full rounded-[20px] px-[18px] py-[16px] flex items-center gap-[14px] text-left"
            style={{
              background: "linear-gradient(135deg, #28bdbf 0%, #0b5457 100%)",
              boxShadow: "0 6px 18px rgba(40,189,191,0.28)",
            }}
          >
            <div className="w-[60px] h-[60px] flex items-center justify-center shrink-0">
              <Image src="/xanhsm-icons/gift-box.png" alt="Quà" width={60} height={60} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-white/80 leading-none uppercase tracking-wide">
                Bạn sẽ nhận
              </div>
              <div className="text-[26px] font-black text-white leading-[1.1] mt-[4px] tracking-[-0.5px]">
                50.000₫
              </div>
              <div className="text-[11.5px] text-white/85 leading-none mt-[4px]">
                vào ví VSP & mở khoá các tính năng
              </div>
            </div>
          </div>
        </div>

        {/* Benefits list — clean, Xanh SM 3D icons */}
        <div className="px-[22px]">
          <div className="flex flex-col gap-[2px]">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-[14px] py-[10px]"
              >
                <div className="w-[44px] h-[44px] flex items-center justify-center shrink-0">
                  <Image src={b.icon} alt={b.title} width={44} height={44} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold leading-tight text-foreground">{b.title}</div>
                  <div className="text-[12px] text-foreground-secondary leading-tight mt-[3px]">
                    {b.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed bottom — checkbox + T&C + CTA */}
      <div className="shrink-0 bg-white px-[22px] pt-[12px] pb-[10px] border-t border-foreground/5">
        <button
          onClick={() => setAgreed((v) => !v)}
          className="w-full flex items-start gap-[10px] text-left mb-[12px] active:opacity-70"
        >
          <div
            className="w-[20px] h-[20px] rounded-[6px] flex items-center justify-center shrink-0 mt-[1px] transition-colors"
            style={{
              background: agreed ? "#28bdbf" : "#ffffff",
              border: agreed ? "1px solid #28bdbf" : "1.5px solid #d0d5dc",
            }}
          >
            {agreed && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 12 10 18 20 6" />
              </svg>
            )}
          </div>
          <div className="flex-1 text-[11.5px] text-foreground-secondary leading-[1.5]">
            Bằng cách tiếp tục, bạn đồng ý với{" "}
            <span className="font-bold underline" style={{ color: "#28bdbf" }}>
              Điều khoản sử dụng
            </span>{" "}
            và{" "}
            <span className="font-bold underline" style={{ color: "#28bdbf" }}>
              Chính sách riêng tư
            </span>{" "}
            của VSP × Xanh SM
          </div>
        </button>
        <button
          onClick={() => agreed && onAgree()}
          disabled={!agreed}
          className="w-full h-[54px] rounded-full font-black text-[15px] text-white transition-opacity"
          style={{
            background: "#28bdbf",
            boxShadow: agreed ? "0 4px 14px rgba(40,189,191,0.45)" : "none",
            opacity: agreed ? 1 : 0.5,
          }}
        >
          Đồng ý & Nhận 50.000₫
        </button>
      </div>

      <HomeIndicator />
    </div>
  )
}

export default function ClaimPage() {
  return (
    <Suspense>
      <ClaimInner />
    </Suspense>
  )
}
