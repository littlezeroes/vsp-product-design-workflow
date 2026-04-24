"use client"

import * as React from "react"
import Image from "next/image"
import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Plus, Check, ArrowDownToLine, Gift, Zap, Sparkles, Fingerprint, ArrowUpRight } from "lucide-react"
import { StatusBar, HomeIndicator, BG_GRAD, VSP_GRAD, MapTexture } from "../_shared"

/* Luồng User 2 — Green e-Card (slide 5.2):
 *   "Có thể thêm VSP làm phương thức để top-up và là phương thức
 *    withdraw/quy đổi quà thành tiền mặt"
 *
 * States:
 *   hub        — danh sách e-Card user đang có
 *   topup      — chọn mệnh giá để nạp
 *   confirm    — confirm + PIN/biometric
 *   success    — nạp xong
 *   withdraw   — quy đổi e-Card về VSP
 *   withdraw-success
 */

type S = "hub" | "topup" | "confirm" | "success" | "withdraw" | "withdraw-success"

const CARDS = [
  { id: "main", name: "Green e-Card Chính", balance: 420_000, color: "#0b5457", emoji: "🌿" },
  { id: "gift", name: "Quà tặng từ Trang", balance: 100_000, color: "#b8860b", emoji: "🎁" },
]

const DENOMS = [50_000, 100_000, 200_000, 500_000, 1_000_000, 2_000_000]

function Inner() {
  const params = useSearchParams()
  const router = useRouter()
  const state = (params.get("state") as S) ?? "hub"
  const [amount, setAmount] = useState(200_000)

  const push = (s: S) => router.push(`/xanhsm-vsp/e-card?state=${s}`)

  return (
    <div className="relative w-full max-w-[390px] min-h-screen flex flex-col" style={{ background: BG_GRAD }}>
      <MapTexture />
      <div className="relative z-10 flex-1 flex flex-col pb-[40px]">
        <StatusBar />

        <div className="flex items-center gap-2 pl-[8px] pr-[22px] h-[56px]">
          <button
            onClick={() => (state === "hub" ? router.push("/xanhsm-vsp/wallet?state=active") : router.back())}
            className="p-[10px] min-h-[44px] rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="flex-1 text-[18px] font-black">
            {state === "hub" && "Green e-Card"}
            {state === "topup" && "Nạp thẻ"}
            {state === "confirm" && "Xác nhận nạp"}
            {state === "success" && ""}
            {state === "withdraw" && "Quy đổi về ví"}
            {state === "withdraw-success" && ""}
          </span>
        </div>

        {/* ═══ HUB — danh sách e-Card ═══ */}
        {state === "hub" && (
          <div className="flex-1 pb-[120px]">
            <div className="px-[22px] pt-[8px] pb-[18px]">
              <div className="text-[13px] text-foreground-secondary">Tổng giá trị thẻ</div>
              <div className="text-[36px] font-black tracking-[-1.5px] leading-none mt-[2px]">
                520.000 <span className="text-[22px] font-bold text-foreground/40">₫</span>
              </div>
            </div>

            <div className="px-[18px] flex flex-col gap-[12px]">
              {CARDS.map((c) => (
                <div
                  key={c.id}
                  className="rounded-[22px] p-[18px] text-white relative overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                  style={{ background: `linear-gradient(135deg, ${c.color} 0%, #2a8f78 100%)` }}
                >
                  <div className="flex items-center justify-between mb-[24px]">
                    <div className="text-[11px] text-white/70 uppercase tracking-wide">GREEN SM · e-Card</div>
                    <span className="text-[22px]">{c.emoji}</span>
                  </div>
                  <div className="text-[12px] text-white/70">Số dư</div>
                  <div className="text-[30px] font-black tracking-[-0.5px] leading-none mt-[2px]">
                    {c.balance.toLocaleString("vi-VN")} <span className="text-[14px] font-bold text-white/50">₫</span>
                  </div>
                  <div className="text-[12px] text-white/80 mt-[10px]">{c.name}</div>
                </div>
              ))}
            </div>

            <div className="px-[18px] pt-[18px] pb-[14px] text-[15px] font-black">Thao tác</div>
            <div className="px-[18px] grid grid-cols-2 gap-[10px]">
              <button
                onClick={() => push("topup")}
                className="rounded-[18px] bg-white p-[16px] flex items-start gap-[12px] text-left shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
              >
                <div className="w-[40px] h-[40px] rounded-[12px] flex items-center justify-center text-white" style={{ background: VSP_GRAD }}>
                  <Plus size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-bold">Nạp thẻ</div>
                  <div className="text-[11px] text-foreground-secondary mt-[2px]">Từ VSP · 0 phí</div>
                </div>
              </button>
              <button
                onClick={() => push("withdraw")}
                className="rounded-[18px] bg-white p-[16px] flex items-start gap-[12px] text-left shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
              >
                <div className="w-[40px] h-[40px] rounded-[12px] bg-[#e5f2f3] flex items-center justify-center">
                  <ArrowUpRight size={18} className="text-[#0b5457]" />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-bold">Quy đổi</div>
                  <div className="text-[11px] text-foreground-secondary mt-[2px]">Thẻ → VSP ví</div>
                </div>
              </button>
            </div>

            <div className="px-[18px] pt-[20px] pb-[10px] text-[15px] font-black">Ưu đãi nạp thẻ</div>
            <div className="px-[18px] rounded-[18px] bg-white p-[16px] flex items-center gap-[12px] shadow-[0_1px_4px_rgba(0,0,0,0.04)] mx-[18px]">
              <div className="w-[40px] h-[40px] rounded-[12px] bg-[#fef3c7] flex items-center justify-center">
                <Zap size={18} className="text-[#92400e]" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-bold">Nạp 1 triệu, tặng 30K voucher</div>
                <div className="text-[11px] text-foreground-secondary mt-[2px]">Hạn: 31/05/2026</div>
              </div>
              <ChevronRight size={14} className="text-foreground-secondary" />
            </div>
          </div>
        )}

        {/* ═══ TOPUP — chọn mệnh giá ═══ */}
        {state === "topup" && (
          <div className="flex-1 pb-[120px]">
            <div className="px-[22px] pt-[8px] pb-[16px]">
              <div className="text-[13px] text-foreground-secondary">Nạp vào</div>
              <div className="text-[17px] font-bold mt-[2px]">Green e-Card Chính · còn 420.000 ₫</div>
            </div>

            <div className="px-[18px] mb-[16px]">
              <div className="rounded-[20px] bg-white p-[20px] text-center shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
                <div className="text-[11px] text-foreground-secondary uppercase tracking-wide">Số tiền nạp</div>
                <div className="text-[40px] font-black tracking-[-1.5px] leading-none mt-[6px]">
                  {amount.toLocaleString("vi-VN")} <span className="text-[22px] font-bold text-foreground/40">₫</span>
                </div>
                <div className="text-[12px] text-foreground-secondary mt-[8px]">
                  Số dư thẻ sau nạp: {(420_000 + amount).toLocaleString("vi-VN")} ₫
                </div>
              </div>
            </div>

            <div className="px-[18px] mb-[16px]">
              <div className="text-[11px] font-bold text-foreground-secondary uppercase tracking-wide mb-[10px]">Chọn mệnh giá</div>
              <div className="grid grid-cols-3 gap-[8px]">
                {DENOMS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setAmount(d)}
                    className={`h-[52px] rounded-[14px] font-bold text-[13px] ${
                      amount === d ? "bg-foreground text-background" : "bg-white"
                    }`}
                  >
                    {d >= 1_000_000 ? `${d / 1_000_000}M` : `${d / 1000}K`}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-[18px] mb-[16px]">
              <div className="text-[11px] font-bold text-foreground-secondary uppercase tracking-wide mb-[10px]">Từ nguồn</div>
              <div className="rounded-[14px] bg-white p-[14px] flex items-center gap-[12px]">
                <div className="w-[40px] h-[40px] rounded-[12px] flex items-center justify-center text-white" style={{ background: VSP_GRAD }}>
                  <Sparkles size={16} />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-semibold">VSP · 156.000 ₫</div>
                  <div className="text-[11px] text-foreground-secondary mt-[1px]">Miễn phí · tức thì</div>
                </div>
                <span className="text-[12px] font-semibold text-foreground-secondary">Đổi</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══ CONFIRM — PIN/biometric ═══ */}
        {state === "confirm" && (
          <div className="flex-1 pb-[120px]">
            <div className="px-[22px] pt-[24px]">
              <div className="rounded-[20px] bg-white p-[20px] text-center">
                <div className="text-[11px] text-foreground-secondary uppercase tracking-wide">Nạp Green e-Card</div>
                <div className="text-[38px] font-black tracking-[-1.5px] leading-none mt-[6px]">
                  -{amount.toLocaleString("vi-VN")} <span className="text-[20px] font-bold text-foreground/40">₫</span>
                </div>
                <div className="text-[12px] text-foreground-secondary mt-[6px]">Trừ từ VSP · miễn phí</div>
              </div>

              <div className="rounded-[14px] bg-white mt-[14px] p-[14px]">
                <Row label="Thẻ nhận" value="Green e-Card Chính" />
                <Row label="Số dư sau nạp" value={`${(420_000 + amount).toLocaleString("vi-VN")} ₫`} />
                <Row label="VSP sau nạp" value="-44.000 ₫ (cảnh báo)" negative />
                <Row label="Phí" value="0 ₫" success last />
              </div>
            </div>
          </div>
        )}

        {/* ═══ SUCCESS ═══ */}
        {state === "success" && (
          <div className="flex-1 flex flex-col items-center justify-start pt-[60px] px-[22px] pb-[120px]">
            <Image src="/vsp-icons/check.png" alt="Done" width={104} height={104} className="mb-[18px]" />
            <div className="text-[30px] font-black text-center tracking-[-0.3px] mb-[6px]">Đã nạp thành công</div>
            <div className="text-[14px] text-foreground-secondary text-center mb-[24px]">
              Green e-Card Chính vừa nhận {amount.toLocaleString("vi-VN")} ₫
            </div>
            <div className="w-full rounded-[18px] bg-white p-[16px] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <Row label="Thẻ" value="Green e-Card Chính" />
              <Row label="Số dư mới" value={`${(420_000 + amount).toLocaleString("vi-VN")} ₫`} />
              <Row label="Mã giao dịch" value="VSP2604-8821" />
              <Row label="Thời gian" value="23/04/2026 · 21:44" last />
            </div>
          </div>
        )}

        {/* ═══ WITHDRAW — quy đổi e-Card về VSP ═══ */}
        {state === "withdraw" && (
          <div className="flex-1 pb-[120px]">
            <div className="px-[22px] pt-[8px] pb-[16px]">
              <div className="text-[13px] text-foreground-secondary">Quy đổi từ</div>
              <div className="text-[17px] font-bold mt-[2px]">Quà tặng từ Trang · 100.000 ₫</div>
              <div className="text-[11px] text-foreground-secondary mt-[2px]">Chỉ thẻ quà tặng có thể quy đổi. Thẻ chính không.</div>
            </div>

            <div className="px-[18px] mb-[16px]">
              <div className="rounded-[20px] bg-white p-[20px] text-center">
                <div className="text-[11px] text-foreground-secondary uppercase tracking-wide">Số tiền quy đổi</div>
                <div className="text-[40px] font-black tracking-[-1.5px] leading-none mt-[6px]">
                  100.000 <span className="text-[22px] font-bold text-foreground/40">₫</span>
                </div>
                <div className="text-[12px] text-foreground-secondary mt-[8px]">Toàn bộ số dư thẻ · phí quy đổi 0 ₫</div>
              </div>
            </div>

            <div className="px-[18px]">
              <div className="rounded-[14px] bg-white p-[14px]">
                <Row label="Về ví" value="VSP · sau quy đổi 256.000 ₫" />
                <Row label="Phí" value="0 ₫" success />
                <Row label="Thời gian" value="Tức thì" last />
              </div>
            </div>

            <div className="px-[22px] pt-[16px] text-[11px] text-foreground-secondary">
              Sau khi quy đổi, thẻ quà tặng sẽ bị đóng. Thao tác không thể hoàn tác.
            </div>
          </div>
        )}

        {state === "withdraw-success" && (
          <div className="flex-1 flex flex-col items-center justify-start pt-[60px] px-[22px] pb-[120px]">
            <Image src="/vsp-icons/check.png" alt="Done" width={104} height={104} className="mb-[18px]" />
            <div className="text-[30px] font-black text-center tracking-[-0.3px] mb-[6px]">Đã chuyển về ví VSP</div>
            <div className="text-[14px] text-foreground-secondary text-center mb-[24px]">
              +100.000 ₫ từ quà tặng của Trang
            </div>
            <div className="w-full rounded-[18px] bg-white p-[16px] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <Row label="Ví VSP mới" value="256.000 ₫" />
              <Row label="Mã giao dịch" value="VSP-QD-4419" last />
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto pointer-events-auto">
        <div className="px-[22px] pt-[14px] pb-[34px]" style={{ background: "linear-gradient(180deg, rgba(244,246,247,0) 0%, rgba(244,246,247,0.95) 30%, rgba(244,246,247,1) 100%)" }}>
          {state === "hub" && (
            <button onClick={() => push("topup")} className="w-full h-[52px] rounded-full text-white font-bold text-[15px]" style={{ background: VSP_GRAD }}>
              Nạp Green e-Card
            </button>
          )}
          {state === "topup" && (
            <button onClick={() => push("confirm")} className="w-full h-[52px] rounded-full text-white font-bold text-[15px]" style={{ background: VSP_GRAD }}>
              Tiếp tục
            </button>
          )}
          {state === "confirm" && (
            <button onClick={() => push("success")} className="w-full h-[52px] rounded-full text-white font-bold text-[15px] flex items-center justify-center gap-[8px]" style={{ background: VSP_GRAD }}>
              <Fingerprint size={18} /> Xác thực để nạp
            </button>
          )}
          {state === "success" && (
            <button onClick={() => router.push("/xanhsm-vsp/wallet?state=active")} className="w-full h-[52px] rounded-full text-white font-bold text-[15px]" style={{ background: VSP_GRAD }}>
              Xong
            </button>
          )}
          {state === "withdraw" && (
            <button onClick={() => push("withdraw-success")} className="w-full h-[52px] rounded-full text-white font-bold text-[15px] flex items-center justify-center gap-[8px]" style={{ background: VSP_GRAD }}>
              <Fingerprint size={18} /> Xác thực để quy đổi
            </button>
          )}
          {state === "withdraw-success" && (
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

function Row({ label, value, last, success, negative }: { label: string; value: string; last?: boolean; success?: boolean; negative?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-[10px] ${!last ? "border-b border-foreground/5" : ""}`}>
      <span className="text-[13px] text-foreground-secondary">{label}</span>
      <span className={`text-[13px] font-semibold ${success ? "text-success" : negative ? "text-[#b45309]" : ""}`}>{value}</span>
    </div>
  )
}

export default function ECardPage() {
  return (
    <Suspense>
      <Inner />
    </Suspense>
  )
}
