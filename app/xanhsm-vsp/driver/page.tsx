"use client"

import * as React from "react"
import Image from "next/image"
import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronLeft, Plus, ArrowUpRight, Wallet, Check, Fingerprint, Car, Clock, TrendingUp, ShieldCheck, ArrowDownLeft } from "lucide-react"
import { StatusBar, HomeIndicator, BG_GRAD, VSP_GRAD, MapTexture } from "../_shared"

/* Luồng Driver (slide 5.3):
 *   "Driver bản chất là cá nhân nên các use case của ví mình có thể
 *    đáp ứng: Nạp tiền làm tài khoản đảm bảo nhận cuốc xe tiền mặt,
 *    rút tiền về tknn"
 *
 * States:
 *   home        — Driver wallet hub (TKĐB + Pocket + withdraw)
 *   tkdb-topup  — nạp vào TKĐB để mở cuốc tiền mặt
 *   pocket      — lịch sử tiền cuốc
 *   withdraw    — rút về tknn
 *   withdraw-ok
 */

type S = "home" | "tkdb-topup" | "pocket" | "withdraw" | "withdraw-ok"

function Inner() {
  const params = useSearchParams()
  const router = useRouter()
  const state = (params.get("state") as S) ?? "home"
  const [amount, setAmount] = useState(200_000)

  const push = (s: S) => router.push(`/xanhsm-vsp/driver?state=${s}`)

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
            {state === "home" && "Ví tài xế Green SM"}
            {state === "tkdb-topup" && "Nạp TKĐB"}
            {state === "pocket" && "Lịch sử cuốc"}
            {state === "withdraw" && "Rút về ngân hàng"}
            {state === "withdraw-ok" && ""}
          </span>
        </div>

        {/* HOME — 2 balance sections + actions */}
        {state === "home" && (
          <div className="flex-1 pb-[40px]">
            {/* TKĐB card */}
            <div className="px-[18px] pt-[6px] pb-[12px]">
              <div className="rounded-[22px] p-[18px] text-white relative overflow-hidden" style={{ background: "#28bdbf", boxShadow: "0 4px 14px rgba(40,189,191,0.35)" }}>
                <div className="flex items-center gap-[10px] mb-[12px]">
                  <ShieldCheck size={16} className="text-white/70" />
                  <span className="text-[11px] uppercase tracking-wide text-white/70">Tài khoản đảm bảo · TKĐB</span>
                </div>
                <div className="text-[34px] font-black tracking-[-1px] leading-none">
                  450.000 <span className="text-[20px] font-bold text-white/50">₫</span>
                </div>
                <div className="text-[11px] text-white/70 mt-[6px]">
                  Cần ≥ 100.000 ₫ để mở cuốc tiền mặt · hiện ĐỦ
                </div>
                <div className="flex gap-[8px] mt-[14px]">
                  <button onClick={() => push("tkdb-topup")} className="flex-1 h-[40px] bg-white/15 hover:bg-white/20 rounded-full text-[13px] font-semibold flex items-center justify-center gap-[6px]">
                    <Plus size={14} /> Nạp TKĐB
                  </button>
                  <button className="flex-1 h-[40px] bg-white/15 hover:bg-white/20 rounded-full text-[13px] font-semibold">
                    Rút TKĐB
                  </button>
                </div>
              </div>
            </div>

            {/* Pocket balance */}
            <div className="px-[18px] pb-[12px]">
              <div className="rounded-[22px] bg-white p-[18px] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-[10px] mb-[12px]">
                  <Wallet size={16} className="text-foreground-secondary" />
                  <span className="text-[11px] uppercase tracking-wide text-foreground-secondary">Ví cuốc · đã thu</span>
                </div>
                <div className="text-[34px] font-black tracking-[-1px] leading-none">
                  2.450.000 <span className="text-[20px] font-bold text-foreground/40">₫</span>
                </div>
                <div className="flex items-center gap-[12px] mt-[8px]">
                  <div className="flex items-center gap-[4px] text-[11px] text-foreground-secondary">
                    <TrendingUp size={11} className="text-success" />
                    <span>+320K hôm nay</span>
                  </div>
                  <div className="text-[11px] text-foreground-secondary">24 cuốc</div>
                </div>
                <div className="flex gap-[8px] mt-[14px]">
                  <button onClick={() => push("withdraw")} className="flex-1 h-[40px] rounded-full text-white text-[13px] font-semibold" style={{ background: VSP_GRAD }}>
                    Rút về ngân hàng
                  </button>
                  <button onClick={() => push("pocket")} className="flex-1 h-[40px] bg-secondary rounded-full text-[13px] font-semibold">
                    Lịch sử
                  </button>
                </div>
              </div>
            </div>

            <div className="px-[22px] pt-[10px] pb-[8px] text-[15px] font-black">Hoạt động hôm nay</div>
            <div className="px-[18px]">
              <div className="rounded-[16px] bg-white overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
                {[
                  { title: "Cuốc Bike · Đường Láng → BKHN", amount: 28_000, time: "20:14" },
                  { title: "Cuốc Car · Keangnam → Times City", amount: 85_000, time: "18:02" },
                  { title: "Cuốc Bike (tiền mặt) · đã trừ TKĐB 35K", amount: 35_000, time: "16:45", cash: true },
                  { title: "Cuốc Car · Royal City → Vincom BT", amount: 72_000, time: "14:20" },
                ].map((t, i, arr) => (
                  <div key={i} className={`flex items-center gap-[12px] px-[14px] py-[12px] ${i < arr.length - 1 ? "border-b border-foreground/5" : ""}`}>
                    <div className="w-[34px] h-[34px] rounded-full bg-[#e5f2f3] flex items-center justify-center">
                      <Car size={14} className="text-[#0b5457]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold truncate">{t.title}</div>
                      <div className="text-[10px] text-foreground-secondary mt-[1px]">Hôm nay · {t.time}</div>
                    </div>
                    <div className={`text-[13px] font-bold ${t.cash ? "text-[#b45309]" : "text-success"}`}>
                      {t.cash ? "-" : "+"}{t.amount.toLocaleString("vi-VN")} ₫
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TKĐB TOP-UP */}
        {state === "tkdb-topup" && (
          <div className="flex-1 pb-[120px]">
            <div className="px-[22px] pt-[8px] pb-[16px]">
              <div className="text-[13px] text-foreground-secondary">Mức tối thiểu khuyến nghị</div>
              <div className="text-[17px] font-bold mt-[2px]">300.000 ₫ · mở cuốc tiền mặt liên tục</div>
            </div>
            <div className="px-[18px] mb-[16px]">
              <div className="rounded-[20px] bg-white p-[20px] text-center">
                <div className="text-[11px] text-foreground-secondary uppercase tracking-wide">Nạp vào TKĐB</div>
                <div className="text-[40px] font-black tracking-[-1.5px] leading-none mt-[6px]">
                  {amount.toLocaleString("vi-VN")} <span className="text-[22px] font-bold text-foreground/40">₫</span>
                </div>
                <div className="text-[12px] text-foreground-secondary mt-[8px]">TKĐB sau nạp: {(450_000 + amount).toLocaleString("vi-VN")} ₫</div>
              </div>
            </div>
            <div className="px-[18px] mb-[16px] grid grid-cols-4 gap-[8px]">
              {[100_000, 200_000, 500_000, 1_000_000].map((a) => (
                <button key={a} onClick={() => setAmount(a)} className={`h-[44px] rounded-full font-bold text-[12px] ${amount === a ? "bg-foreground text-background" : "bg-white"}`}>
                  {a >= 1_000_000 ? "1M" : `${a / 1000}K`}
                </button>
              ))}
            </div>
            <div className="px-[18px]">
              <div className="rounded-[14px] bg-white p-[14px] flex items-center gap-[12px]">
                <div className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center text-[11px] font-bold text-white" style={{ background: "#d32c1f" }}>TCB</div>
                <div className="flex-1">
                  <div className="text-[14px] font-semibold">Techcombank ****9921</div>
                  <div className="text-[11px] text-foreground-secondary">Tài khoản lương · đã liên kết</div>
                </div>
                <span className="text-[12px] font-semibold text-foreground-secondary">Đổi</span>
              </div>
            </div>
          </div>
        )}

        {/* POCKET history */}
        {state === "pocket" && (
          <div className="flex-1 pb-[40px]">
            <div className="px-[22px] pt-[6px] pb-[14px]">
              <div className="text-[13px] text-foreground-secondary">Tổng thu hôm nay</div>
              <div className="text-[28px] font-black tracking-[-0.5px] leading-none mt-[2px]">+320.000 ₫ · 24 cuốc</div>
            </div>
            <div className="px-[18px]">
              {["Hôm nay", "Hôm qua", "21/04/2026"].map((day) => (
                <div key={day} className="mb-[14px]">
                  <div className="text-[11px] font-bold text-foreground-secondary uppercase tracking-wide px-[4px] pb-[8px]">{day}</div>
                  <div className="rounded-[16px] bg-white overflow-hidden">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`flex items-center gap-[12px] px-[14px] py-[11px] ${i < 3 ? "border-b border-foreground/5" : ""}`}>
                        <div className="w-[32px] h-[32px] rounded-full bg-[#e5f2f3] flex items-center justify-center">
                          <Car size={13} className="text-[#0b5457]" />
                        </div>
                        <div className="flex-1">
                          <div className="text-[12px] font-semibold">Cuốc {i * 7 + 1} · {day}</div>
                          <div className="text-[10px] text-foreground-secondary">{14 + i}:0{i}0</div>
                        </div>
                        <div className="text-[13px] font-bold text-success">+{(28_000 + i * 5000).toLocaleString("vi-VN")} ₫</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WITHDRAW */}
        {state === "withdraw" && (
          <div className="flex-1 pb-[120px]">
            <div className="px-[22px] pt-[8px] pb-[16px]">
              <div className="text-[13px] text-foreground-secondary">Có thể rút</div>
              <div className="text-[17px] font-bold mt-[2px]">2.450.000 ₫ · miễn phí trong ngày</div>
            </div>
            <div className="px-[18px] mb-[16px]">
              <div className="rounded-[20px] bg-white p-[20px] text-center">
                <div className="text-[11px] text-foreground-secondary uppercase tracking-wide">Số tiền rút</div>
                <div className="text-[40px] font-black tracking-[-1.5px] leading-none mt-[6px]">
                  2.000.000 <span className="text-[22px] font-bold text-foreground/40">₫</span>
                </div>
                <div className="text-[12px] text-foreground-secondary mt-[8px]">Còn lại sau rút: 450.000 ₫</div>
              </div>
            </div>
            <div className="px-[18px]">
              <div className="text-[11px] font-bold text-foreground-secondary uppercase tracking-wide mb-[10px]">Về tài khoản</div>
              <div className="rounded-[14px] bg-white p-[14px] flex items-center gap-[12px]">
                <div className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center text-[11px] font-bold text-white" style={{ background: "#d32c1f" }}>TCB</div>
                <div className="flex-1">
                  <div className="text-[14px] font-semibold">Techcombank ****9921</div>
                  <div className="text-[11px] text-foreground-secondary">Nhận trong 5 phút · miễn phí</div>
                </div>
                <ChevronLeft size={14} className="rotate-180 text-foreground-secondary" />
              </div>
            </div>
            <div className="px-[22px] pt-[14px] text-[11px] text-foreground-secondary">
              Rút trên 5M/ngày có phí 2.000 ₫/giao dịch. Tốc độ chuyển tuỳ ngân hàng.
            </div>
          </div>
        )}

        {state === "withdraw-ok" && (
          <div className="flex-1 flex flex-col items-center justify-start pt-[60px] px-[22px]">
            <Image src="/vsp-icons/check.png" alt="Done" width={104} height={104} className="mb-[18px]" />
            <div className="text-[30px] font-black text-center tracking-[-0.3px] mb-[6px]">Đã rút 2.000.000 ₫</div>
            <div className="text-[14px] text-foreground-secondary text-center mb-[24px]">Vào Techcombank ****9921 · nhận trong 5 phút</div>
            <div className="w-full rounded-[18px] bg-white p-[16px]">
              <div className="flex justify-between py-[10px] border-b border-foreground/5"><span className="text-[13px] text-foreground-secondary">Phí</span><span className="text-[13px] font-semibold text-success">0 ₫</span></div>
              <div className="flex justify-between py-[10px] border-b border-foreground/5"><span className="text-[13px] text-foreground-secondary">Mã giao dịch</span><span className="text-[13px] font-semibold">VSP-DRV-7721</span></div>
              <div className="flex justify-between py-[10px]"><span className="text-[13px] text-foreground-secondary">Thời gian</span><span className="text-[13px] font-semibold">23/04 · 21:44</span></div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto pointer-events-auto">
        <div className="px-[22px] pt-[14px] pb-[34px]" style={{ background: "linear-gradient(180deg, rgba(244,246,247,0) 0%, rgba(244,246,247,0.95) 30%, rgba(244,246,247,1) 100%)" }}>
          {state === "tkdb-topup" && (
            <button className="w-full h-[52px] rounded-full text-white font-bold text-[15px] flex items-center justify-center gap-[8px]" style={{ background: VSP_GRAD }}>
              <Fingerprint size={18} /> Xác thực nạp TKĐB
            </button>
          )}
          {state === "withdraw" && (
            <button onClick={() => push("withdraw-ok")} className="w-full h-[52px] rounded-full text-white font-bold text-[15px] flex items-center justify-center gap-[8px]" style={{ background: VSP_GRAD }}>
              <Fingerprint size={18} /> Xác thực rút
            </button>
          )}
          {state === "withdraw-ok" && (
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

export default function DriverPage() {
  return <Suspense><Inner /></Suspense>
}
