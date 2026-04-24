"use client"

import * as React from "react"
import Image from "next/image"
import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronLeft, Gift, Users, Check, Fingerprint, Share2, ChevronRight } from "lucide-react"
import { StatusBar, HomeIndicator, BG_GRAD, VSP_GRAD, MapTexture } from "../_shared"

type S = "buy" | "confirm" | "success"

const DENOMS = [50_000, 100_000, 200_000, 500_000]

function Inner() {
  const params = useSearchParams()
  const router = useRouter()
  const state = (params.get("state") as S) ?? "buy"
  const [amount, setAmount] = useState(200_000)
  const [msg, setMsg] = useState("Chúc vui vẻ!")

  const push = (s: S) => router.push(`/xanhsm-vsp/gift-card?state=${s}`)

  return (
    <div className="relative w-full max-w-[390px] min-h-screen flex flex-col" style={{ background: BG_GRAD }}>
      <MapTexture />
      <div className="relative z-10 flex-1 flex flex-col pb-[40px]">
        <StatusBar />
        <div className="flex items-center gap-2 pl-[8px] pr-[22px] h-[56px]">
          <button onClick={() => (state === "buy" ? router.push("/xanhsm-vsp/wallet?state=active") : router.back())} className="p-[10px] min-h-[44px] rounded-full">
            <ChevronLeft size={20} />
          </button>
          <span className="flex-1 text-[18px] font-black">
            {state === "buy" && "Quà tặng Xanh SM"}
            {state === "confirm" && "Xác nhận quà"}
            {state === "success" && ""}
          </span>
        </div>

        {state === "buy" && (
          <div className="flex-1 pb-[120px]">
            {/* Gift preview card */}
            <div className="px-[18px] pt-[8px] pb-[14px]">
              <div
                className="rounded-[22px] p-[20px] text-white relative overflow-hidden h-[160px]"
                style={{ background: "linear-gradient(135deg, #d946ef 0%, #a855f7 45%, #7c3aed 100%)" }}
              >
                <div className="flex items-center gap-[8px] mb-[10px]">
                  <Gift size={18} />
                  <span className="text-[11px] uppercase tracking-wide font-bold">Green SM Gift</span>
                </div>
                <div className="text-[32px] font-black tracking-[-1px] leading-none">
                  {amount.toLocaleString("vi-VN")} <span className="text-[18px] font-bold text-white/60">₫</span>
                </div>
                <div className="text-[12px] text-white/80 mt-[8px] italic">"{msg}"</div>
                <div className="text-[10px] text-white/60 mt-[8px]">Người gửi · Huy Kieu</div>
                <div className="absolute right-[-12px] bottom-[-12px] text-[80px] opacity-20">🎁</div>
              </div>
            </div>

            <div className="px-[18px] mb-[14px]">
              <div className="text-[11px] font-bold text-foreground-secondary uppercase tracking-wide mb-[10px]">Mệnh giá</div>
              <div className="grid grid-cols-4 gap-[8px]">
                {DENOMS.map((d) => (
                  <button key={d} onClick={() => setAmount(d)} className={`h-[44px] rounded-full font-bold text-[12px] ${amount === d ? "bg-foreground text-background" : "bg-white"}`}>
                    {d >= 1_000_000 ? `${d / 1_000_000}M` : `${d / 1000}K`}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-[18px] mb-[14px]">
              <div className="text-[11px] font-bold text-foreground-secondary uppercase tracking-wide mb-[10px]">Người nhận</div>
              <button className="w-full rounded-[14px] bg-white p-[14px] flex items-center gap-[12px]">
                <div className="w-[40px] h-[40px] rounded-full bg-[#e5f2f3] flex items-center justify-center">
                  <Users size={18} className="text-[#0b5457]" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-[14px] font-semibold">Trần Linh · 0988 555 104</div>
                  <div className="text-[11px] text-foreground-secondary">Bạn bè · dùng Xanh SM</div>
                </div>
                <ChevronRight size={14} className="text-foreground-secondary" />
              </button>
            </div>

            <div className="px-[18px] mb-[14px]">
              <div className="text-[11px] font-bold text-foreground-secondary uppercase tracking-wide mb-[10px]">Lời nhắn</div>
              <input
                className="w-full rounded-[14px] bg-white p-[14px] text-[14px] outline-none"
                value={msg}
                onChange={(e) => setMsg(e.target.value.slice(0, 60))}
                placeholder="Chúc mừng sinh nhật..."
              />
              <div className="text-[10px] text-foreground-secondary mt-[4px]">{msg.length}/60 ký tự</div>
            </div>

            <div className="px-[18px]">
              <div className="text-[11px] font-bold text-foreground-secondary uppercase tracking-wide mb-[10px]">Thanh toán từ</div>
              <div className="rounded-[14px] bg-white p-[14px] flex items-center gap-[12px]">
                <div className="w-[40px] h-[40px] rounded-[12px] flex items-center justify-center text-white" style={{ background: VSP_GRAD }}>VSP</div>
                <div className="flex-1">
                  <div className="text-[14px] font-semibold">VSP · 156.000 ₫</div>
                  <div className="text-[11px] text-[#b45309]">Không đủ · cần nạp thêm {Math.max(0, amount - 156_000).toLocaleString("vi-VN")} ₫</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {state === "confirm" && (
          <div className="flex-1 pb-[120px]">
            <div className="px-[22px] pt-[24px]">
              <div className="rounded-[20px] bg-white p-[20px] text-center">
                <div className="text-[11px] text-foreground-secondary uppercase tracking-wide">Gửi quà cho Trần Linh</div>
                <div className="text-[38px] font-black tracking-[-1.5px] leading-none mt-[6px]">
                  -{amount.toLocaleString("vi-VN")} <span className="text-[20px] font-bold text-foreground/40">₫</span>
                </div>
                <div className="text-[12px] text-foreground-secondary mt-[6px]">Trừ từ VSP · phí 0 ₫</div>
              </div>

              <div className="rounded-[14px] bg-white mt-[14px] p-[14px]">
                <Row label="Mệnh giá" value={`${amount.toLocaleString("vi-VN")} ₫`} />
                <Row label="Người nhận" value="Trần Linh · 0988 555 104" />
                <Row label="Lời nhắn" value={`"${msg}"`} />
                <Row label="Quà có thể quy đổi lại VSP" value="Có, cho người nhận" last />
              </div>
            </div>
          </div>
        )}

        {state === "success" && (
          <div className="flex-1 flex flex-col items-center justify-start pt-[48px] px-[22px]">
            <Image src="/vsp-icons/check.png" alt="Done" width={104} height={104} className="mb-[18px]" />
            <div className="text-[30px] font-black text-center tracking-[-0.3px] mb-[6px]">Quà đã gửi thành công</div>
            <div className="text-[14px] text-foreground-secondary text-center mb-[24px]">Trần Linh sẽ nhận thông báo trong vài giây</div>
            <div className="w-full rounded-[18px] p-[20px] text-white text-center mb-[16px]" style={{ background: "linear-gradient(135deg, #d946ef 0%, #7c3aed 100%)" }}>
              <Gift size={22} className="mx-auto mb-[8px]" />
              <div className="text-[28px] font-black">{amount.toLocaleString("vi-VN")} ₫</div>
              <div className="text-[12px] text-white/80 italic mt-[8px]">"{msg}"</div>
              <div className="text-[10px] text-white/60 mt-[8px]">Mã quà: VSP-GIFT-8812</div>
            </div>
            <button className="w-full h-[48px] rounded-full bg-white flex items-center justify-center gap-[8px] text-[14px] font-semibold">
              <Share2 size={16} /> Chia sẻ qua Zalo
            </button>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto pointer-events-auto">
        <div className="px-[22px] pt-[14px] pb-[34px]" style={{ background: "linear-gradient(180deg, rgba(244,246,247,0) 0%, rgba(244,246,247,0.95) 30%, rgba(244,246,247,1) 100%)" }}>
          {state === "buy" && (
            <button onClick={() => push("confirm")} className="w-full h-[52px] rounded-full text-white font-bold text-[15px]" style={{ background: VSP_GRAD }}>
              Tiếp tục
            </button>
          )}
          {state === "confirm" && (
            <button onClick={() => push("success")} className="w-full h-[52px] rounded-full text-white font-bold text-[15px] flex items-center justify-center gap-[8px]" style={{ background: VSP_GRAD }}>
              <Fingerprint size={18} /> Xác thực gửi quà
            </button>
          )}
          {state === "success" && (
            <button onClick={() => router.push("/xanhsm-vsp/wallet?state=active")} className="w-full h-[52px] rounded-full text-white font-bold text-[15px]" style={{ background: VSP_GRAD }}>
              Xong
            </button>
          )}
        </div>
      </div>
      <HomeIndicator />
    </div>
  )
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex items-start justify-between py-[10px] gap-[10px] ${!last ? "border-b border-foreground/5" : ""}`}>
      <span className="text-[13px] text-foreground-secondary shrink-0">{label}</span>
      <span className="text-[13px] font-semibold text-right">{value}</span>
    </div>
  )
}

export default function GiftCardPage() {
  return <Suspense><Inner /></Suspense>
}
