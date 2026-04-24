"use client"

import * as React from "react"
import { Suspense, useState, useEffect } from "react"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  QrCode,
  ArrowLeftRight,
  Sparkles,
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  X,
  Fingerprint,
  Check,
  Wallet,
  Info,
  Lock,
  Clock,
} from "lucide-react"

/* VSP Wallet — giản lược theo demo VSP × XanhSM
 *   - state=fresh-50k     (PIN ✅, KYC ⏳, Bank ⏳ · balance 50K) — sau claim
 *   - state=half-unlocked (PIN ✅, KYC ✅, Bank ⏳ · balance 50K)
 *   - state=active        (PIN ✅, KYC ✅, Bank ✅ · balance 50K) — full unlock
 */

type WalletState = "no-pin" | "fresh-50k" | "half-unlocked" | "active"
type ActionOverlay = "topup" | "withdraw" | "ekyc" | "link-bank" | "qr" | "transfer" | "fs" | "pin" | null

const BG_GRAD = "linear-gradient(180deg, #c9e7e8 0%, #e8f3f3 45%, #f4f6f7 100%)"

function StatusBar() {
  return (
    <div className="h-[54px] px-[22px] flex items-end justify-between pb-[6px]">
      <span className="text-[15px] font-semibold">10:12</span>
      <div className="flex items-center gap-[6px]">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="0.5"/><rect x="4" y="5" width="3" height="7" rx="0.5"/><rect x="8" y="2" width="3" height="10" rx="0.5"/><rect x="12" y="0" width="3" height="12" rx="0.5"/></svg>
        <span className="text-[11px] font-bold">5G</span>
        <div className="flex items-center gap-[1px]"><div className="w-[22px] h-[11px] rounded-[3px] border border-current flex items-center p-[1px]"><div className="flex-1 h-full bg-current rounded-[1.5px]"/></div></div>
      </div>
    </div>
  )
}

const TXS_FRESH = [
  { title: "Nhận từ Kỳ Sự Xanh · Xanh SM", amount: +50_000, at: "Hôm nay · 10:10", icon: "🌿" },
]

const TXS_ACTIVE = [
  { title: "Xanh Car · Vinhomes → Keangnam", amount: -0, at: "Hôm nay · 11:02", icon: "🚗", hint: "Miễn phí cuốc đầu" },
  { title: "Nhận từ Kỳ Sự Xanh · Xanh SM", amount: +50_000, at: "Hôm nay · 10:10", icon: "🌿" },
]

function WalletInner() {
  const params = useSearchParams()
  const router = useRouter()
  const state = (params.get("state") as WalletState) ?? "fresh-50k"
  const action = (params.get("action") as ActionOverlay) ?? null

  const [balanceHidden, setBalanceHidden] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // Balance logic: 50K từ claim, giữ nguyên qua các state (demo happy case)
  const balance = 50_000

  // Confetti chỉ show 1 lần ngay sau khi hoàn tất bước cuối (URL param celebrate=1)
  useEffect(() => {
    if (state === "active" && params.get("celebrate") === "1") {
      setShowConfetti(true)
      const t = setTimeout(() => setShowConfetti(false), 3500)
      // Xoá param để reload/quay lại không trigger nữa
      router.replace(`/xanhsm-vsp/wallet?state=active`)
      return () => clearTimeout(t)
    }
  }, [state, params, router])

  // Progress steps
  const pinDone = state !== "no-pin"
  const kycDone = state === "half-unlocked" || state === "active"
  const bankDone = state === "active"
  const doneCount = [pinDone, kycDone, bankDone].filter(Boolean).length
  const progressPct = Math.round((doneCount / 3) * 100)
  const allDone = state === "active"

  const closeOverlay = () => router.replace(`/xanhsm-vsp/wallet?state=${state}`)

  // From pending row → full-screen flow qua /claim (PIN) hoặc /onboarding (eKYC/Bank)
  const gotoPin = () => router.push(`/xanhsm-vsp/claim?state=pin-setup&case=new&return=wallet`)
  const gotoKyc = () => router.push(`/xanhsm-vsp/onboarding?state=ekyc-reminder&return=wallet`)
  const gotoBank = () => router.push(`/xanhsm-vsp/onboarding?state=link-pick-bank&return=wallet`)

  return (
    <div
      className="relative w-full max-w-[390px] min-h-screen flex flex-col"
      style={{ background: BG_GRAD }}
    >
      {/* texture */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(135deg, transparent 40%, #5b9fa2 40%, #5b9fa2 41%, transparent 41%), linear-gradient(45deg, transparent 40%, #5b9fa2 40%, #5b9fa2 41%, transparent 41%)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col pb-[40px]">
        <StatusBar />

        {/* NavBar */}
        <div className="flex items-center gap-2 pl-[8px] pr-[22px] h-[56px]">
          <button
            onClick={() => router.push(`/xanhsm-vsp/profile?state=active`)}
            className="p-[10px] min-h-[44px] rounded-full"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="flex-1 text-[18px] font-black">V-Smart Pay</span>
          <button className="p-[10px]">
            <Info size={18} className="text-foreground-secondary" />
          </button>
        </div>

        {/* ═══ Balance hero ═══ */}
        <div className="px-[18px] pt-[6px] pb-[14px]">
          <div
            className="rounded-[24px] overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
            style={{ background: "linear-gradient(180deg, #ffffff 0%, #f7fbfb 100%)" }}
          >
            {/* Row 1: Balance hero */}
            <div className="px-[22px] pt-[22px] pb-[20px]">
              <div className="flex items-start gap-[14px]">
                <Image src="/vsp-logo.png" alt="VSP" width={48} height={48} className="shrink-0 rounded-[22%]" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-[8px]">
                    <div className="text-[11px] text-foreground-secondary uppercase tracking-[0.8px] font-bold leading-none">Số dư ví VSP</div>
                    <button onClick={() => setBalanceHidden(!balanceHidden)} className="p-[4px] -mt-[4px] -mr-[4px]">
                      {balanceHidden ? <EyeOff size={16} className="text-foreground-secondary" /> : <Eye size={16} className="text-foreground-secondary" />}
                    </button>
                  </div>
                  <div className="text-[32px] font-black tracking-[-1px] leading-none mt-[8px]">
                    {balanceHidden ? "••••••" : balance.toLocaleString("vi-VN")}
                    <span className="text-[18px] font-bold text-foreground/40 ml-[4px]">₫</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: 3 actions */}
            <div className="grid grid-cols-3 border-t border-foreground/5">
              {[
                { icon: Plus, label: "Nạp", key: "topup", locked: !allDone },
                { icon: Minus, label: "Rút", key: "withdraw", locked: !allDone },
                { icon: QrCode, label: "QR", key: "qr", locked: !allDone },
              ].map((a, i) => (
                <button
                  key={a.key}
                  onClick={() => {
                    if (a.locked) {
                      // Redirect to the next required step
                      if (!kycDone) gotoKyc()
                      else if (!bankDone) gotoBank()
                    } else if (a.key === "topup") {
                      router.push("/bidv-link/deposit")
                    } else if (a.key === "withdraw") {
                      router.push("/bidv-link/withdraw")
                    } else {
                      router.push(`/xanhsm-vsp/wallet?state=${state}&action=${a.key}`)
                    }
                  }}
                  className={`py-[16px] flex flex-col items-center gap-[8px] active:bg-foreground/5 transition-colors ${i > 0 ? "border-l border-foreground/5" : ""}`}
                >
                  <div
                    className="w-[44px] h-[44px] rounded-[14px] flex items-center justify-center relative"
                    style={{ background: a.locked ? "#f1f1f1" : "#e5f2f3" }}
                  >
                    <a.icon size={20} style={{ color: a.locked ? "#9a9a9a" : "#0b5457" }} />
                    {a.locked && <div className="absolute top-[-3px] right-[-3px] w-[9px] h-[9px] rounded-full bg-[#f2bf00] border-[1.5px] border-white" />}
                  </div>
                  <span className="text-[12px] font-semibold" style={{ color: a.locked ? "#9a9a9a" : undefined }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ Progress card — Hoàn tất để dùng với Xanh SM ═══ */}
        {!allDone && (
          <div className="px-[18px] pb-[14px]">
            <div className="bg-white rounded-[20px] px-[18px] py-[18px] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-[16px]">
                <div>
                  <div className="text-[15px] font-black leading-tight">Hoàn tất để dùng với Xanh SM</div>
                  <div className="text-[11px] text-foreground-secondary mt-[3px]">{doneCount}/3 bước · {progressPct}% hoàn tất</div>
                </div>
                <div
                  className="w-[44px] h-[44px] rounded-full flex items-center justify-center text-white text-[13px] font-black"
                  style={{
                    background: `conic-gradient(#28bdbf ${progressPct}%, #e5e7eb ${progressPct}% 100%)`,
                  }}
                >
                  <div className="w-[34px] h-[34px] rounded-full bg-white flex items-center justify-center text-foreground text-[11px] font-black">
                    {progressPct}%
                  </div>
                </div>
              </div>

              {/* 3 rows · chỉ hiện state, KHÔNG có button inline */}
              <div className="flex flex-col gap-[8px] mb-[14px]">
                <StepRow
                  index={1}
                  done={pinDone}
                  current={!pinDone}
                  title="Đặt mã PIN 6 số"
                />
                <StepRow
                  index={2}
                  done={kycDone}
                  current={pinDone && !kycDone}
                  title="Xác minh CCCD"
                />
                <StepRow
                  index={3}
                  done={bankDone}
                  current={kycDone && !bankDone}
                  title="Liên kết bank"
                />
              </div>

              {/* 1 CTA duy nhất · label đổi theo step hiện tại */}
              <button
                onClick={!pinDone ? gotoPin : !kycDone ? gotoKyc : gotoBank}
                className="w-full h-[48px] rounded-full text-white font-black text-[14px] flex items-center justify-center"
                style={{ background: "#28bdbf", boxShadow: "0 4px 14px rgba(40,189,191,0.35)" }}
              >
                {!pinDone
                  ? "Đặt mã PIN · Bước 1/3"
                  : !kycDone
                    ? "Xác minh CCCD · Bước 2/3"
                    : "Liên kết bank · Bước 3/3"}
              </button>
            </div>
          </div>
        )}

        {/* ═══ Xanh SM services — CHỈ khi state===active ═══ */}
        {allDone && (
          <>
            <div className="px-[18px] pb-[14px]">
              <div className="flex items-center gap-[6px] mb-[10px] px-[4px]">
                <Sparkles size={14} style={{ color: "#28bdbf" }} />
                <span className="text-[13px] font-bold">Dùng ví với Xanh SM</span>
                <span className="text-[11px] text-foreground-secondary ml-auto">Miễn phí · nhanh hơn</span>
              </div>
              <div className="grid grid-cols-2 gap-[12px]">
                <button
                  onClick={() => router.push(`/xanhsm-vsp/booking?state=has-vsp`)}
                  className="relative h-[112px] rounded-[20px] overflow-hidden text-left active:opacity-90"
                  style={{ background: "linear-gradient(180deg, #ffffff 0%, #d9f0e6 100%)" }}
                >
                  <span className="absolute top-[14px] left-[16px] text-[15px] font-black tracking-[-0.2px]">Gọi xe</span>
                  <span className="absolute top-[40px] left-[16px] text-[10px] font-semibold text-[#0b5457]">Trả bằng VSP · 0 phí</span>
                  <div className="absolute bottom-[4px] right-[-4px] w-[72px] h-[66px]">
                    <Image src="/xanhsm-icons/car.png" alt="car" fill style={{ objectFit: "contain" }} />
                  </div>
                </button>
                <button
                  className="relative h-[112px] rounded-[20px] overflow-hidden text-left active:opacity-90"
                  style={{ background: "linear-gradient(180deg, #ffffff 0%, #fff1d9 100%)" }}
                >
                  <span className="absolute top-[14px] left-[16px] text-[15px] font-black tracking-[-0.2px]">Đặt đồ ăn</span>
                  <span className="absolute top-[40px] left-[16px] text-[10px] font-semibold text-[#8a5a00]">Voucher 30K · VSP</span>
                  <div className="absolute bottom-[4px] right-[0px] w-[68px] h-[62px]">
                    <Image src="/xanhsm-icons/food.png" alt="food" fill style={{ objectFit: "contain" }} />
                  </div>
                </button>
                <button
                  className="relative h-[112px] rounded-[20px] overflow-hidden text-left active:opacity-90"
                  style={{ background: "linear-gradient(180deg, #ffffff 0%, #e8edf7 100%)" }}
                >
                  <span className="absolute top-[14px] left-[16px] text-[15px] font-black tracking-[-0.2px]">Giao hàng</span>
                  <span className="absolute top-[40px] left-[16px] text-[10px] font-semibold text-[#2a4a8a]">Trả bằng VSP · nhanh</span>
                  <div className="absolute bottom-[4px] right-[-2px] w-[66px] h-[62px]">
                    <Image src="/xanhsm-icons/gift-box.png" alt="Giao hàng" fill style={{ objectFit: "contain" }} />
                  </div>
                </button>
                <button
                  className="relative h-[112px] rounded-[20px] overflow-hidden text-left active:opacity-90"
                  style={{ background: "linear-gradient(180deg, #ffffff 0%, #e0f3eb 100%)" }}
                >
                  <span className="absolute top-[14px] left-[16px] text-[15px] font-black tracking-[-0.2px]">VinBus</span>
                  <span className="absolute top-[40px] left-[16px] text-[10px] font-semibold text-[#0f6b4e]">Trả vé xe buýt</span>
                  <div className="absolute bottom-[4px] right-[-2px] w-[72px] h-[66px]">
                    <Image src="/xanhsm-icons/vinbus.png" alt="VinBus" fill style={{ objectFit: "contain" }} />
                  </div>
                </button>
              </div>
            </div>
          </>
        )}

        {/* ═══ Transactions ═══ */}
        <div className="px-[18px] pt-[4px] pb-[10px]">
          <span className="text-[15px] font-black">Giao dịch gần đây</span>
        </div>

        <div className="px-[18px]">
          <div className="bg-white rounded-[18px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            {(allDone ? TXS_ACTIVE : TXS_FRESH).map((t, i, arr) => (
              <div
                key={i}
                className={`flex items-center gap-[12px] px-[16px] py-[12px] ${i < arr.length - 1 ? "border-b border-foreground/5" : ""}`}
              >
                <div className="w-[36px] h-[36px] rounded-full bg-[#e5f2f3] flex items-center justify-center text-[14px]">
                  {t.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold truncate">{t.title}</div>
                  <div className="text-[11px] text-foreground-secondary mt-[1px]">{t.at}</div>
                </div>
                <div className={`text-[14px] font-bold whitespace-nowrap ${t.amount > 0 ? "text-success" : "text-foreground"}`}>
                  {t.amount === 0 ? "Miễn phí" : `${t.amount > 0 ? "+" : "-"}${Math.abs(t.amount).toLocaleString("vi-VN")} ₫`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ ACTION OVERLAYS ═══ */}
      {action && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={closeOverlay} />
          <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto z-50 bg-background rounded-t-[28px] p-[22px] pb-[34px]">
            <div className="w-[40px] h-[4px] rounded-full bg-foreground/20 mx-auto mb-[18px]" />
            {action === "ekyc" && (
              <EkycSheet
                onClose={closeOverlay}
                onDone={() =>
                  router.replace(
                    state === "fresh-50k" ? `/xanhsm-vsp/wallet?state=half-unlocked` : `/xanhsm-vsp/wallet?state=active&celebrate=1`
                  )
                }
              />
            )}
            {action === "link-bank" && (
              <LinkBankSheet
                onClose={closeOverlay}
                onDone={() => router.replace(`/xanhsm-vsp/wallet?state=active&celebrate=1`)}
              />
            )}
            {action === "topup" && <SimpleSheet title="Nạp tiền" subtitle="Nạp vào ví từ ngân hàng đã liên kết" icon={<Plus size={24} />} onClose={closeOverlay} />}
            {action === "withdraw" && <WithdrawSheet balance={balance} onClose={closeOverlay} />}
            {action === "qr" && <SimpleSheet title="Quét QR thanh toán" subtitle="Quét mã để thanh toán · nhận tiền" icon={<QrCode size={24} />} onClose={closeOverlay} />}
            {action === "transfer" && <SimpleSheet title="Chuyển tiền" subtitle="Chuyển cho bạn bè · tài khoản ngân hàng" icon={<ArrowLeftRight size={24} />} onClose={closeOverlay} />}
            {action === "fs" && <SimpleSheet title="Mua thêm dịch vụ" subtitle="Bảo hiểm · Đầu tư · Trả dần · Giáo dục" icon={<Sparkles size={24} />} onClose={closeOverlay} />}
          </div>
        </>
      )}

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] h-[21px] flex items-end justify-center pb-[4px] pointer-events-none z-[60]">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>

      {showConfetti && <Confetti />}
    </div>
  )
}

/* ═══ Confetti celebration khi state → active ═══ */
function Confetti() {
  const COLORS = ["#28bdbf", "#0b5457", "#c4f443", "#f4c443", "#f46443", "#ffffff", "#5fe3e5"]
  const PIECES = 56
  return (
    <>
      <style>{`
        @keyframes cfFall {
          0%   { transform: translate3d(0,-20vh,0) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          100% { transform: translate3d(var(--cf-dx,0), 110vh, 0) rotate(720deg); opacity: 0; }
        }
        @keyframes cfToast {
          0%   { transform: translate(-50%,-8px) scale(0.92); opacity: 0; }
          15%  { transform: translate(-50%,0) scale(1); opacity: 1; }
          85%  { transform: translate(-50%,0) scale(1); opacity: 1; }
          100% { transform: translate(-50%,-6px) scale(0.96); opacity: 0; }
        }
      `}</style>

      {/* confetti pieces */}
      <div className="fixed inset-0 pointer-events-none z-[70] overflow-hidden max-w-[390px] left-1/2 -translate-x-1/2">
        {Array.from({ length: PIECES }).map((_, i) => {
          const color = COLORS[i % COLORS.length]
          const left = Math.random() * 100
          const dx = (Math.random() - 0.5) * 180
          const delay = Math.random() * 0.8
          const duration = 2.2 + Math.random() * 1.4
          const size = 6 + Math.random() * 6
          const radius = i % 3 === 0 ? "50%" : i % 3 === 1 ? "2px" : "0"
          return (
            <span
              key={i}
              style={{
                position: "absolute",
                top: 0,
                left: `${left}%`,
                width: `${size}px`,
                height: `${size * 1.4}px`,
                background: color,
                borderRadius: radius,
                ["--cf-dx" as string]: `${dx}px`,
                animation: `cfFall ${duration}s cubic-bezier(0.2,0.6,0.3,1) ${delay}s forwards`,
              }}
            />
          )
        })}
      </div>

      {/* center celebration toast */}
      <div
        className="fixed top-[34%] left-1/2 z-[80] pointer-events-none rounded-[20px] px-[24px] py-[18px] text-center shadow-[0_10px_30px_rgba(11,84,87,0.35)]"
        style={{
          background: "linear-gradient(135deg, #28bdbf 0%, #0b5457 100%)",
          color: "#fff",
          animation: "cfToast 3.4s cubic-bezier(0.2,0.6,0.3,1) forwards",
        }}
      >
        <div className="text-[32px] leading-none mb-[6px]">🎉</div>
        <div className="text-[16px] font-black leading-tight">Hoàn tất!</div>
        <div className="text-[11.5px] font-semibold opacity-85 mt-[4px]">Sẵn sàng dùng ví với Xanh SM</div>
      </div>
    </>
  )
}

/* ═══ Progress helpers ═══ */
function StepRow({
  index,
  done,
  current,
  title,
}: {
  index: number
  done: boolean
  current: boolean
  title: string
}) {
  const locked = !done && !current
  return (
    <div
      className="w-full flex items-center gap-[12px] py-[10px] px-[12px] rounded-[14px] text-left transition-opacity"
      style={{
        background: done ? "#f0faf9" : current ? "#fffaed" : "#f9fafb",
        opacity: locked ? 0.55 : 1,
      }}
    >
      {/* 3D icon per step */}
      <div className="w-[44px] h-[44px] flex items-center justify-center shrink-0 relative">
        {index === 1 ? (
          <Image src="/claim-icons/icon-3.png" alt="PIN" width={44} height={44} />
        ) : index === 2 ? (
          <Image src="/vsp-icons/cccd.png" alt="CCCD" width={44} height={44} />
        ) : (
          <Image src="/vsp-icons/bank-link.png" alt="Bank" width={44} height={44} />
        )}
        {done && (
          <div className="absolute -bottom-[2px] -right-[2px] w-[16px] h-[16px] rounded-full flex items-center justify-center" style={{ background: "#22c55e", border: "2px solid #fff" }}>
            <Check size={9} color="#fff" strokeWidth={4} />
          </div>
        )}
      </div>

      {/* title only */}
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-bold leading-tight" style={{ color: done ? "#0b5457" : "#111" }}>
          {title}
        </div>
      </div>

      {/* State icon only · không text */}
      {done ? (
        <div
          className="shrink-0 w-[22px] h-[22px] rounded-full flex items-center justify-center mr-[4px]"
          style={{ background: "#22c55e" }}
        >
          <Check size={13} color="#fff" strokeWidth={3.2} />
        </div>
      ) : current ? (
        <div
          className="shrink-0 w-[22px] h-[22px] rounded-full flex items-center justify-center mr-[4px]"
          style={{ background: "#fbbf24" }}
        >
          <Clock size={12} color="#fff" strokeWidth={2.5} />
        </div>
      ) : (
        <Lock size={14} className="text-foreground-secondary shrink-0 mr-[6px]" />
      )}
    </div>
  )
}

function WithdrawSheet({ balance, onClose }: { balance: number; onClose: () => void }) {
  const [amount, setAmount] = useState(Math.min(50_000, balance))
  const presets = [50_000, 100_000, 200_000, balance].filter((v) => v > 0 && v <= balance)
  return (
    <>
      <div className="flex items-center justify-between mb-[16px]">
        <span className="text-[19px] font-black">Rút tiền về ngân hàng</span>
      </div>
      <div className="p-[16px] rounded-[16px] mb-[16px]" style={{ background: "#e5f2f3" }}>
        <div className="text-[12px] text-foreground-secondary">Số tiền rút</div>
        <div className="text-[36px] font-black tracking-[-1.5px] leading-none mt-[4px]">
          {amount.toLocaleString("vi-VN")} <span className="text-[20px] font-bold text-foreground/40">₫</span>
        </div>
        <div className="text-[11px] text-foreground-secondary mt-[6px]">Số dư khả dụng · {balance.toLocaleString("vi-VN")} ₫</div>
      </div>
      <div className="grid grid-cols-4 gap-[6px] mb-[16px]">
        {presets.map((a, i) => (
          <button
            key={i}
            onClick={() => setAmount(a)}
            className={`h-[40px] rounded-full text-[12px] font-semibold ${amount === a ? "bg-foreground text-background" : "bg-secondary text-foreground"}`}
          >
            {a >= 1_000_000 ? `${(a / 1_000_000).toFixed(1).replace(/\.0$/, "")}M` : a === balance ? "Tất cả" : `${a / 1000}K`}
          </button>
        ))}
      </div>

      <div className="text-[11px] font-semibold text-foreground-secondary uppercase tracking-wide mb-[8px]">Về tài khoản</div>
      <div className="p-[14px] rounded-[14px] border border-foreground/10 flex items-center gap-[14px] mb-[20px]">
        <div className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center text-[12px] font-bold text-white" style={{ background: "#d32c1f" }}>TCB</div>
        <div className="flex-1">
          <div className="text-[14px] font-semibold">Techcombank ****4521</div>
          <div className="text-[11px] text-foreground-secondary mt-[1px]">Ngân hàng đã liên kết</div>
        </div>
        <span className="text-[12px] font-semibold text-foreground-secondary">Đổi</span>
      </div>

      <button
        onClick={onClose}
        className="w-full h-[52px] rounded-full text-white font-bold text-[15px] flex items-center justify-center gap-[8px]"
        style={{ background: "#28bdbf", boxShadow: "0 4px 14px rgba(40,189,191,0.35)" }}
      >
        <Fingerprint size={18} />
        Xác thực để rút
      </button>
      <div className="text-center text-[11px] text-foreground-secondary mt-[10px]">Miễn phí &lt; 5 triệu/ngày · về bank trong 5 phút</div>
    </>
  )
}

function EkycSheet({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  return (
    <>
      <div className="flex items-start justify-between mb-[16px]">
        <div className="w-[48px] h-[48px] rounded-[14px] bg-[#fef3c7] flex items-center justify-center">
          <ShieldCheck size={22} className="text-[#92400e]" />
        </div>
        <button onClick={onClose} className="w-[32px] h-[32px] rounded-full bg-secondary flex items-center justify-center">
          <X size={16} />
        </button>
      </div>
      <div className="text-[26px] font-black leading-[1.15] tracking-[-0.3px] mb-[8px]">Xác minh CCCD để tiếp tục</div>
      <div className="text-[13px] text-foreground-secondary leading-[1.5] mb-[20px]">
        Ngân hàng Nhà nước yêu cầu xác minh CCCD khi ví vượt 10 triệu/tháng hoặc dùng chuyển tiền ra ngoài Xanh.
      </div>
      <div className="flex flex-col gap-[10px] mb-[24px]">
        <InfoRow text="Chụp mặt trước và sau CCCD" />
        <InfoRow text="Chụp khuôn mặt để đối chiếu" />
        <InfoRow text="Mất ~2 phút · 1 lần" />
      </div>
      <button
        onClick={onDone}
        className="w-full h-[52px] rounded-full text-white font-bold text-[15px]"
        style={{ background: "#28bdbf", boxShadow: "0 4px 14px rgba(40,189,191,0.35)" }}
      >
        Chụp CCCD ngay
      </button>
      <button onClick={onClose} className="w-full h-[44px] mt-[6px] text-[13px] font-semibold text-foreground-secondary">
        Để sau
      </button>
    </>
  )
}

function LinkBankSheet({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  return (
    <>
      <div className="flex items-start justify-between mb-[16px]">
        <div className="w-[48px] h-[48px] rounded-[14px] bg-[#e5f2f3] flex items-center justify-center">
          <Building2 size={22} className="text-[#0b5457]" />
        </div>
        <button onClick={onClose} className="w-[32px] h-[32px] rounded-full bg-secondary flex items-center justify-center">
          <X size={16} />
        </button>
      </div>
      <div className="text-[26px] font-black leading-[1.15] tracking-[-0.3px] mb-[8px]">Liên kết ngân hàng để nạp tiền</div>
      <div className="text-[13px] text-foreground-secondary leading-[1.5] mb-[16px]">
        Nạp tiền trực tiếp từ tài khoản ngân hàng, miễn phí, qua SDK nhanh.
      </div>

      <div className="flex flex-col gap-[6px] mb-[20px]">
        {[
          { code: "TCB", name: "Techcombank", available: true },
        ].map((b) => (
          <button
            key={b.code}
            onClick={b.available ? onDone : undefined}
            disabled={!b.available}
            className={`w-full p-[12px] rounded-[12px] border flex items-center gap-[12px] text-left ${b.available ? "border-foreground/15 hover:bg-secondary" : "border-foreground/5 opacity-50"}`}
          >
            <div className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center text-[10px] font-bold text-white" style={{ background: "#d32c1f" }}>{b.code}</div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold">{b.name}</div>
              {!b.available && <div className="text-[10px] text-foreground-secondary">Sắp có · Q3/2026</div>}
            </div>
            {b.available && <ChevronRight size={14} />}
          </button>
        ))}
      </div>
      <button onClick={onClose} className="w-full h-[44px] text-[13px] font-semibold text-foreground-secondary">
        Để sau
      </button>
    </>
  )
}

function SimpleSheet({ title, subtitle, icon, onClose }: { title: string; subtitle: string; icon: React.ReactNode; onClose: () => void }) {
  return (
    <>
      <div className="flex items-start justify-between mb-[16px]">
        <div className="w-[48px] h-[48px] rounded-[14px] bg-[#e5f2f3] flex items-center justify-center text-[#0b5457]">{icon}</div>
        <button onClick={onClose} className="w-[32px] h-[32px] rounded-full bg-secondary flex items-center justify-center">
          <X size={16} />
        </button>
      </div>
      <div className="text-[26px] font-black leading-[1.15] tracking-[-0.3px] mb-[4px]">{title}</div>
      <div className="text-[13px] text-foreground-secondary leading-[1.5] mb-[20px]">{subtitle}</div>
      <div className="p-[20px] rounded-[14px] bg-secondary text-center text-[12px] text-foreground-secondary mb-[20px]">
        Tính năng này mở SDK của VSP đang tích hợp trong Xanh SM — preview
      </div>
      <button onClick={onClose} className="w-full h-[52px] rounded-full bg-foreground text-background font-bold text-[15px]">
        Đóng
      </button>
    </>
  )
}

function InfoRow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-[10px]">
      <Check size={14} className="text-success shrink-0" />
      <span className="text-[13px] text-foreground">{text}</span>
    </div>
  )
}

export default function WalletPage() {
  return (
    <Suspense>
      <WalletInner />
    </Suspense>
  )
}
