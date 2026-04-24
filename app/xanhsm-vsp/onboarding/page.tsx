"use client"

import * as React from "react"
import { Suspense, useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronLeft, Wallet, Check, ShieldCheck, ArrowLeft, X, Camera, Building2, AlertCircle, ChevronRight, RefreshCw } from "lucide-react"
import { StatusBar, HomeIndicator, BG_GRAD, MapTexture } from "../_shared"
import { PinInput } from "@/components/ui/pin-input"

/* Onboarding — full flow theo slide 8 của deck:
 *   Bắt đầu → Nhấn VSP icon
 *   Đã có TK VSP? Yes → Nhập PIN · No → Auto-create + Thiết lập PIN → Homepage
 *   Đã eKYC? No → Popup nhắc eKYC → Chụp CCCD → eKYC thành công? → tiếp / Thất bại → Kết thúc
 *   Đã link bank? No → Popup nhắc → Chọn NH → Nhập info → Link thành công? → tiếp / Thất bại → Kết thúc
 *   Sẵn sàng để nạp tiền vào ví và thanh toán
 *
 * 15 states. Note deck: "Giai đoạn release bypass authen sẽ bỏ step này"
 * → các step OTP/eKYC có thể bypass ở release đầu.
 */

type S =
  | "intro"
  | "pin-setup"
  | "pin-confirm"
  | "pin-login"
  | "home-first"
  | "ekyc-reminder"
  | "ekyc-capture"
  | "ekyc-success"
  | "ekyc-fail"
  | "link-reminder"
  | "link-pick-bank"
  | "link-enter-info"
  | "link-success"
  | "link-fail"
  | "ready"

function KeypadIOS({ onPress, onDel }: { onPress: (n: string) => void; onDel: () => void }) {
  const letters: Record<string, string> = { "2": "ABC", "3": "DEF", "4": "GHI", "5": "JKL", "6": "MNO", "7": "PQRS", "8": "TUV", "9": "WXYZ" }
  const rows = [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["", "0", "del"]]
  return (
    <div className="pt-[12px] pb-[8px] px-[6px]" style={{ background: "#d1d5db" }}>
      <div className="grid grid-cols-3 gap-[6px]">
        {rows.flat().map((k, i) => {
          if (k === "") return <div key={i} />
          if (k === "del") {
            return (
              <button key={i} onClick={onDel} className="h-[46px] flex items-center justify-center active:opacity-60">
                <svg width="24" height="18" viewBox="0 0 28 22" fill="none" className="text-foreground"><path d="M9 2h17v18H9L2 11z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M15 7l6 8m0-8l-6 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </button>
            )
          }
          return (
            <button
              key={i}
              onClick={() => onPress(k)}
              className="h-[46px] rounded-[6px] bg-white active:bg-[#e5e7eb] transition-colors flex flex-col items-center justify-center"
              style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.16)" }}
            >
              <span className="text-[22px] leading-[1] font-normal text-foreground">{k}</span>
              {letters[k] && <span className="text-[8px] tracking-[2px] text-foreground-secondary mt-[1px]">{letters[k]}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Inner() {
  const params = useSearchParams()
  const router = useRouter()
  const state = (params.get("state") as S) ?? "intro"
  const returnTo = params.get("return") // "wallet" = đi từ progress card trong wallet
  const [pin, setPin] = useState("")
  const pinWrapRef = useRef<HTMLDivElement>(null)

  // Auto-focus the NEXT empty PIN box to show tiffany active state
  useEffect(() => {
    if (!["pin-setup", "pin-confirm", "pin-login"].includes(state)) return
    const inputs = pinWrapRef.current?.querySelectorAll<HTMLInputElement>("input")
    if (!inputs) return
    const idx = Math.min(pin.length, inputs.length - 1)
    inputs[idx]?.focus({ preventScroll: true })
  }, [state, pin.length])

  const go = (s: S) => router.push(`/xanhsm-vsp/onboarding?state=${s}${returnTo ? `&return=${returnTo}` : ""}`)

  const handlePress = (n: string) => {
    if (pin.length >= 6) return
    const next = pin + n
    setPin(next)
    if (next.length === 6) {
      setTimeout(() => {
        if (state === "pin-setup") { setPin(""); go("pin-confirm") }
        else if (state === "pin-confirm") go("home-first")
        else if (state === "pin-login") router.push("/xanhsm-vsp/wallet?state=active")
      }, 220)
    }
  }
  const handleDel = () => setPin((p) => p.slice(0, -1))

  return (
    <div className="relative w-full max-w-[390px] h-screen overflow-hidden flex flex-col" style={{ background: ["pin-setup", "pin-confirm", "pin-login", "link-pick-bank", "link-enter-info"].includes(state) ? "#ffffff" : BG_GRAD }}>
      {!["pin-setup", "pin-confirm", "pin-login", "link-pick-bank", "link-enter-info"].includes(state) && <MapTexture />}

      <div className="relative z-10 flex-1 flex flex-col overflow-y-auto min-h-0">
        <StatusBar />

        <div className="flex items-center gap-2 px-[22px] h-[56px]">
          <button
            onClick={() => (state === "intro" ? router.push("/xanhsm-vsp/gsm-home?state=no-vsp") : router.back())}
            className="p-[10px] min-h-[44px] rounded-full -ml-[10px]"
          >
            {state === "intro" ? <X size={18} /> : <ChevronLeft size={20} />}
          </button>
          <span className="flex-1 text-[13px] font-semibold text-foreground-secondary">
            {state === "home-first" && ""}
            {state === "ekyc-capture" && "Chụp CCCD"}
            {state === "link-enter-info" && "Liên kết Techcombank"}
          </span>
        </div>

        {/* ═══ INTRO — friendly activation after claim cây xanh ═══ */}
        {state === "intro" && (
          <div className="flex-1 flex flex-col items-center px-[22px] pt-[24px] pb-[140px]">
            {/* Wallet icon — teal circle */}
            <div
              className="w-[92px] h-[92px] rounded-full flex items-center justify-center mb-[20px]"
              style={{ background: "#bfdfe0" }}
            >
              <Wallet size={40} style={{ color: "#0b5457" }} strokeWidth={2} />
            </div>

            <div className="text-[26px] font-black text-center leading-[1.15] tracking-[-0.4px] mb-[10px]">
              Kích hoạt Ví Xanh SM
            </div>
            <div className="text-[14px] text-foreground-secondary text-center leading-[1.45] mb-[24px] max-w-[320px]">
              Thanh toán mọi chuyến xe, nạp tiền điện thoại, mua sắm — tất cả trong vài giây. Miễn phí.
            </div>

            <div className="w-full flex flex-col gap-[14px] px-[6px]">
              {[
                "Thanh toán siêu nhanh, không nhập thẻ",
                "Tích điểm Green Race mỗi giao dịch",
                "Bảo mật cấp ngân hàng",
              ].map((t) => (
                <div key={t} className="flex items-center gap-[12px]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0" style={{ color: "#0b5457" }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M8 12.5l2.8 2.8L16 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[14px] text-foreground leading-[1.3]">{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ PIN (setup / confirm / login) ═══ Cash App pattern + Xanh branding */}
        {(state === "pin-setup" || state === "pin-confirm" || state === "pin-login") && (
          <div className="flex-1 flex flex-col bg-white">
            <div className="px-[22px] pt-[8px] pb-[22px]">
              <div className="text-[32px] font-bold tracking-[-0.5px] leading-[1.15] text-foreground">
                {state === "pin-setup" && "Đặt mã PIN"}
                {state === "pin-confirm" && "Xác nhận mã PIN"}
                {state === "pin-login" && "Nhập mã PIN"}
              </div>
              <div className="text-[13px] text-foreground-secondary mt-[6px]">
                {state === "pin-setup" && "Chọn 6 số dễ nhớ, không trùng SĐT hay ngày sinh."}
                {state === "pin-confirm" && "Nhập lại 6 số để xác nhận."}
                {state === "pin-login" && "Vui lòng nhập mã PIN để xác thực"}
              </div>
            </div>

            <div className="px-[22px]" style={{ ["--brand-secondary" as string]: "#28bdbf" }} ref={pinWrapRef}>
              <PinInput length={6} value={pin} secure />
            </div>

            <div className="px-[22px] pt-[16px] flex items-center justify-start">
              <button className="px-[12px] h-[30px] rounded-full bg-[#f3f4f6] text-[12px] font-semibold text-foreground">
                Hiện mã PIN
              </button>
            </div>

            {state === "pin-login" && (
              <div className="px-[22px] pt-[36px]">
                <button className="text-[14px] font-bold" style={{ color: "#28bdbf" }}>Quên mã PIN?</button>
              </div>
            )}

            <div className="flex-1" />
            <KeypadIOS onPress={handlePress} onDel={handleDel} />
            <div className="flex justify-center py-[8px] bg-[#d1d5db]">
              <div className="w-[134px] h-[5px] bg-foreground rounded-full" />
            </div>
          </div>
        )}

        {/* ═══ HOME-FIRST — vừa tạo xong, trước khi check eKYC/link ═══ */}
        {state === "home-first" && (
          <div className="flex-1 items-center flex flex-col pt-[32px] pb-[120px] px-[22px]">
            <Image src="/vsp-icons/check.png" alt="Done" width={96} height={96} className="mb-[14px]" />
            <div className="text-[30px] font-black text-center mb-[8px] tracking-[-0.3px]">PIN đã đặt xong</div>
            <div className="text-[13px] text-foreground-secondary text-center mb-[24px] max-w-[280px] leading-[1.45]">Ví V-Smart Pay đã sẵn sàng. Hoàn tất thêm 2 bước để nạp tiền và dùng đầy đủ.</div>

            <div className="w-full rounded-[16px] bg-white p-[14px] mb-[10px] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-[12px]">
                <Image src="/vsp-icons/cccd.png" alt="CCCD" width={44} height={44} className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold leading-[1.2]">Xác minh CCCD</div>
                  <div className="text-[11px] text-foreground-secondary mt-[2px]">Cần để nạp tiền và chuyển tiền</div>
                </div>
                <span className="text-[10px] font-bold px-[10px] py-[3px] rounded-full shrink-0" style={{ color: "#0b5457", background: "#d7f1f2" }}>Bước 2</span>
              </div>
            </div>
            <div className="w-full rounded-[16px] bg-white p-[14px] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-[12px]">
                <Image src="/vsp-icons/bank-link.png" alt="Bank" width={44} height={44} className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold leading-[1.2]">Liên kết ngân hàng</div>
                  <div className="text-[11px] text-foreground-secondary mt-[2px]">Để nạp tiền từ tài khoản bank</div>
                </div>
                <span className="text-[10px] font-bold px-[10px] py-[3px] rounded-full shrink-0" style={{ color: "#0b5457", background: "#d7f1f2" }}>Bước 3</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══ EKYC REMINDER ═══ */}
        {state === "ekyc-reminder" && (
          <div className="flex-1 px-[22px] pt-[8px] pb-[120px]">
            <Image src="/vsp-icons/cccd.png" alt="CCCD" width={88} height={88} className="mb-[18px]" />
            <div className="text-[32px] font-black leading-[1.1] mb-[10px]">Xác minh danh tính</div>
            <div className="text-[14px] text-foreground-secondary leading-[1.5] mb-[24px]">
              Ngân hàng Nhà nước yêu cầu xác minh CCCD trước khi mở ví. Làm một lần, dùng cho tất cả dịch vụ VSP.
            </div>
            <div className="flex flex-col gap-[10px]">
              {[
                "Chụp mặt trước và sau CCCD",
                "Chụp khuôn mặt để đối chiếu",
                "Mất ~2 phút · dữ liệu mã hoá theo SBV",
              ].map((t) => (
                <div key={t} className="flex items-center gap-[10px]">
                  <Check size={14} className="text-success shrink-0" />
                  <span className="text-[13px]">{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ EKYC CAPTURE — camera mock ═══ */}
        {state === "ekyc-capture" && (
          <div className="flex-1 flex flex-col pt-[8px] pb-[120px]">
            <div className="px-[22px] pb-[16px]">
              <div className="text-[17px] font-bold mb-[4px]">Mặt trước CCCD</div>
              <div className="text-[12px] text-foreground-secondary">Đặt CCCD trong khung · đủ ánh sáng · không chói</div>
            </div>
            <div className="px-[22px]">
              <div className="relative rounded-[20px] overflow-hidden aspect-[85/54]" style={{ background: "linear-gradient(135deg, #1f2937 0%, #111827 100%)" }}>
                {/* Mock card outline */}
                <div className="absolute inset-[10px] rounded-[16px] border-2 border-white/40" />
                <div className="absolute top-[16%] left-[8%] w-[32%] h-[38%] rounded-[8px] bg-white/10" />
                <div className="absolute bottom-[20%] left-[44%] right-[8%] h-[10%] rounded-[4px] bg-white/15" />
                <div className="absolute bottom-[8%] left-[44%] right-[8%] h-[6%] rounded-[4px] bg-white/10" />
                {/* Corners */}
                {[
                  { top: 0, left: 0 },
                  { top: 0, right: 0 },
                  { bottom: 0, left: 0 },
                  { bottom: 0, right: 0 },
                ].map((p, i) => (
                  <div key={i} className="absolute w-[28px] h-[28px]" style={{ ...p }}>
                    <div className="absolute w-full h-[3px] bg-white" style={{ top: p.top === 0 ? 0 : "auto", bottom: p.bottom === 0 ? 0 : "auto" }} />
                    <div className="absolute h-full w-[3px] bg-white" style={{ left: p.left === 0 ? 0 : "auto", right: p.right === 0 ? 0 : "auto" }} />
                  </div>
                ))}
              </div>
              <div className="mt-[14px] rounded-[14px] bg-white p-[12px] text-[12px] flex items-start gap-[10px]">
                <AlertCircle size={14} className="text-foreground-secondary shrink-0 mt-[2px]" />
                <span>Ví dụ mock. Trong production dùng SDK camera VSP embed trong Xanh SM.</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══ EKYC SUCCESS ═══ */}
        {state === "ekyc-success" && (
          <div className="flex-1 flex flex-col items-center pt-[60px] px-[22px] pb-[120px]">
            <Image src="/vsp-icons/check.png" alt="Done" width={104} height={104} className="mb-[18px]" />
            <div className="text-[30px] font-black text-center mb-[6px] tracking-[-0.3px]">Xác minh thành công</div>
            <div className="text-[14px] text-foreground-secondary text-center mb-[24px]">Danh tính CCCD đã khớp. Bạn có thể dùng đầy đủ tính năng VSP.</div>
            <div className="w-full rounded-[16px] bg-white p-[16px]">
              <div className="flex justify-between py-[8px] border-b border-foreground/5"><span className="text-[12px] text-foreground-secondary">Họ tên</span><span className="text-[13px] font-semibold">Nguyễn Huy Kiều</span></div>
              <div className="flex justify-between py-[8px] border-b border-foreground/5"><span className="text-[12px] text-foreground-secondary">CCCD</span><span className="text-[13px] font-semibold">001••• ••• 612</span></div>
              <div className="flex justify-between py-[8px]"><span className="text-[12px] text-foreground-secondary">Hạn mức</span><span className="text-[13px] font-semibold">100 triệu/tháng</span></div>
            </div>
          </div>
        )}

        {/* ═══ EKYC FAIL ═══ */}
        {state === "ekyc-fail" && (
          <div className="flex-1 flex flex-col items-center pt-[60px] px-[22px] pb-[120px]">
            <div className="w-[88px] h-[88px] rounded-full flex items-center justify-center mb-[20px]" style={{ background: "#ff474722" }}>
              <X size={44} className="text-[#dc2626]" strokeWidth={2.5} />
            </div>
            <div className="text-[30px] font-black text-center mb-[6px]">Xác minh thất bại</div>
            <div className="text-[14px] text-foreground-secondary text-center mb-[24px] max-w-[300px]">
              Ảnh CCCD chưa rõ hoặc khuôn mặt không khớp. Thử lại với ánh sáng tốt hơn.
            </div>
            <div className="w-full rounded-[16px] bg-[#fef2f2] p-[14px] text-[12px] text-[#991b1b] mb-[8px]">
              <span className="font-semibold">Gợi ý:</span> Tháo kính, để mặt trong khung, chụp ở nơi sáng đều.
            </div>
          </div>
        )}

        {/* ═══ LINK REMINDER ═══ */}
        {state === "link-reminder" && (
          <div className="flex-1 px-[22px] pt-[8px] pb-[120px]">
            <Image src="/vsp-icons/bank-link.png" alt="Bank link" width={88} height={88} className="mb-[18px]" />
            <div className="text-[32px] font-black leading-[1.1] mb-[10px]">Liên kết ngân hàng</div>
            <div className="text-[14px] text-foreground-secondary leading-[1.5] mb-[24px]">
              Liên kết một lần để nạp tiền từ ngân hàng vào VSP, miễn phí, qua SDK nhanh.
            </div>
            <div className="flex flex-col gap-[10px] mb-[20px]">
              {[
                "Miễn phí liên kết · bỏ qua không mất gì",
                "Hỗ trợ Techcombank · MVP chỉ có 1 ngân hàng",
                "Rút lại lúc nào cũng được",
              ].map((t) => (
                <div key={t} className="flex items-center gap-[10px]">
                  <Check size={14} className="text-success shrink-0" />
                  <span className="text-[13px]">{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ LINK PICK BANK ═══ */}
        {state === "link-pick-bank" && (
          <div className="flex-1 px-[22px] pt-[8px] pb-[120px] bg-white">
            <div className="pb-[22px]">
              <div className="text-[32px] font-bold tracking-[-0.5px] leading-[1.15]">Thêm liên kết ngân hàng</div>
              <div className="text-[14px] text-foreground-secondary mt-[6px] leading-[1.4]">Thêm tài khoản/thẻ ngân hàng để nạp, rút tiền và thanh toán</div>
            </div>

            <div className="text-[14px] font-semibold text-foreground mb-[10px]">Tài khoản ngân hàng</div>
            <div className="flex flex-col gap-[8px] mb-[22px]">
              {[
                { code: "TCB", name: "Techcombank", bg: "#d32c1f", live: true },
              ].map((b) => (
                <button
                  key={b.code}
                  onClick={() => b.live && go("link-enter-info")}
                  disabled={!b.live}
                  className={`w-full p-[14px] rounded-[16px] flex items-center gap-[12px] text-left bg-[#f3f4f6] ${b.live ? "" : "opacity-50"}`}
                >
                  <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: b.bg }}>{b.code.slice(0, 2)}</div>
                  <div className="flex-1 text-[15px] font-bold">{b.name}</div>
                  <ChevronRight size={18} className="text-foreground-secondary" />
                </button>
              ))}
            </div>

            <div className="text-[14px] font-semibold text-foreground mb-[10px]">Thẻ</div>
            <button className="w-full p-[14px] rounded-[16px] flex items-center gap-[12px] text-left bg-[#f3f4f6]">
              <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center bg-white border border-[#e5e7eb]">
                <span className="text-[10px] font-black text-[#ff0000]">napas</span>
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-bold">Thẻ nội địa Napas</div>
                <div className="text-[12px] text-foreground-secondary mt-[1px]">Liên kết với 40 ngân hàng nội địa</div>
              </div>
              <ChevronRight size={18} className="text-foreground-secondary" />
            </button>
          </div>
        )}

        {/* ═══ LINK ENTER INFO — Cash App pattern */}
        {state === "link-enter-info" && (
          <div className="flex-1 px-[22px] pt-[8px] pb-[120px] bg-white">
            {/* 3-circle chain: VSP green · link · bank */}
            <div className="flex items-center justify-center gap-[14px] pt-[4px] pb-[22px]">
              <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center" style={{ background: "#e6f3f3" }}>
                <span className="text-[16px] font-black" style={{ color: "#28bdbf" }}>V</span>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-foreground-secondary"><path d="M9 12h6M7 8l-3 4 3 4M17 8l3 4-3 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <div className="w-[44px] h-[44px] rounded-full flex items-center justify-center" style={{ background: "#d32c1f" }}>
                <span className="text-[10px] font-black text-white">TCB</span>
              </div>
            </div>

            {/* info banner */}
            <div className="flex items-start gap-[10px] rounded-[14px] p-[14px] mb-[18px]" style={{ background: "#eef3ff" }}>
              <AlertCircle size={18} className="shrink-0 mt-[2px]" style={{ color: "#4f6bfd" }} />
              <div className="text-[13px] leading-[1.45] text-foreground">
                Thông tin đăng ký tài khoản Techcombank phải trùng với thông tin đăng ký ví của bạn
              </div>
            </div>

            {/* input — floating label inside */}
            <div className="rounded-[14px] border border-[#e5e7eb] px-[16px] py-[10px] mb-[14px]">
              <div className="text-[11px] font-semibold text-foreground-secondary">Nhập số tài khoản</div>
              <input
                className="w-full text-[16px] font-medium outline-none bg-transparent mt-[2px]"
                placeholder="Nhập số tài khoản"
                defaultValue=""
                style={{ caretColor: "#28bdbf" }}
              />
            </div>

            {/* name readonly */}
            <div className="flex items-center justify-between px-[2px] pb-[14px] border-b border-[#f3f4f6]">
              <div className="text-[14px] font-semibold">Họ và tên</div>
              <div className="text-[14px] text-foreground">Kiều Mạnh Huy</div>
            </div>

            {/* consent */}
            <div className="flex items-start gap-[10px] pt-[14px]">
              <div className="w-[20px] h-[20px] rounded-[5px] bg-foreground flex items-center justify-center shrink-0 mt-[1px]">
                <Check size={13} className="text-white" strokeWidth={3} />
              </div>
              <div className="text-[12px] leading-[1.45] text-foreground-secondary">
                Tôi đồng ý chia sẻ dữ liệu với Techcombank để liên kết Ví với tài khoản này theo Điều khoản &amp; Điều kiện của Techcombank.
              </div>
            </div>
          </div>
        )}

        {/* ═══ LINK SUCCESS ═══ */}
        {state === "link-success" && (
          <div className="flex-1 flex flex-col items-center pt-[60px] px-[22px] pb-[120px]">
            <Image src="/vsp-icons/check.png" alt="Done" width={104} height={104} className="mb-[18px]" />
            <div className="text-[30px] font-black text-center mb-[6px] tracking-[-0.3px]">Liên kết thành công</div>
            <div className="text-[14px] text-foreground-secondary text-center mb-[24px]">Techcombank ****4521 đã sẵn sàng để nạp tiền vào ví VSP.</div>
            <div className="w-full rounded-[16px] bg-white p-[14px] flex items-center gap-[12px]">
              <div className="w-[40px] h-[40px] rounded-[12px] flex items-center justify-center text-[11px] font-bold text-white" style={{ background: "#d32c1f" }}>TCB</div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold">Techcombank ****4521</div>
                <div className="text-[11px] text-foreground-secondary">Có thể rút/nạp · miễn phí</div>
              </div>
              <Check size={16} className="text-success" />
            </div>
          </div>
        )}

        {/* ═══ LINK FAIL ═══ */}
        {state === "link-fail" && (
          <div className="flex-1 flex flex-col items-center pt-[60px] px-[22px] pb-[120px]">
            <div className="w-[88px] h-[88px] rounded-full flex items-center justify-center mb-[20px]" style={{ background: "#ff474722" }}>
              <X size={44} className="text-[#dc2626]" strokeWidth={2.5} />
            </div>
            <div className="text-[30px] font-black text-center mb-[6px]">Liên kết thất bại</div>
            <div className="text-[14px] text-foreground-secondary text-center mb-[24px] max-w-[300px]">
              Thông tin tài khoản không khớp hoặc OTP sai. Hãy kiểm tra và thử lại.
            </div>
            <div className="w-full rounded-[16px] bg-[#fef2f2] p-[14px] text-[12px] text-[#991b1b]">
              <div className="font-semibold mb-[4px]">Lỗi Techcombank</div>
              <div>Số tài khoản không tìm thấy hoặc bị khoá Smart OTP. Liên hệ Techcombank 1800 588 822.</div>
            </div>
          </div>
        )}

        {/* ═══ READY — xong toàn bộ 3 bước ═══ */}
        {state === "ready" && (
          <div className="flex-1 flex flex-col items-center pt-[60px] px-[22px] pb-[120px]">
            <Image src="/vsp-icons/check.png" alt="Ready" width={112} height={112} className="mb-[18px]" />
            <div className="text-[30px] font-black text-center mb-[6px] tracking-[-0.3px]">Sẵn sàng dùng V-Smart Pay</div>
            <div className="text-[14px] text-foreground-secondary text-center mb-[24px] max-w-[300px]">
              Bạn có thể nạp tiền từ Techcombank, thanh toán chuyến Xanh SM, nạp e-Card, mua quà tặng.
            </div>
            <div className="w-full rounded-[16px] bg-white p-[14px] mb-[10px]">
              <div className="flex items-center gap-[10px]">
                <Check size={16} className="text-success" />
                <span className="text-[13px] font-semibold">PIN đã đặt</span>
              </div>
            </div>
            <div className="w-full rounded-[16px] bg-white p-[14px] mb-[10px]">
              <div className="flex items-center gap-[10px]">
                <Check size={16} className="text-success" />
                <span className="text-[13px] font-semibold">CCCD đã xác minh</span>
              </div>
            </div>
            <div className="w-full rounded-[16px] bg-white p-[14px]">
              <div className="flex items-center gap-[10px]">
                <Check size={16} className="text-success" />
                <span className="text-[13px] font-semibold">Techcombank đã liên kết</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA — inline (flex-end) instead of fixed to avoid iframe viewport bugs */}
      {!["pin-setup", "pin-confirm", "pin-login"].includes(state) && (
      <div className="w-full pointer-events-auto">
        <div className="px-[22px] pt-[14px] pb-[12px]">
          {state === "intro" && (
            <div className="flex gap-[10px]">
              <button
                onClick={() => router.push("/xanhsm-vsp/gsm-home?state=no-vsp")}
                className="h-[54px] px-[26px] rounded-full bg-white border border-[#e5e7eb] text-foreground font-semibold text-[14px] active:opacity-70"
              >
                Để sau
              </button>
              <button
                onClick={() => router.push("/xanhsm-vsp/gsm-home?state=active")}
                className="flex-1 h-[54px] rounded-full text-white font-bold text-[15px] flex items-center justify-center gap-[8px] active:opacity-90"
                style={{ background: "#0b5457", boxShadow: "0 4px 14px rgba(11,84,87,0.3)" }}
              >
                Kích hoạt ngay
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
          {state === "home-first" && (
            <div className="flex gap-[8px]">
              <button onClick={() => router.push("/xanhsm-vsp/gsm-home?state=fresh")} className="h-[54px] px-[22px] rounded-full bg-[#f3f4f6] text-foreground font-semibold text-[14px]">Để sau</button>
              <CTA onClick={() => go("ekyc-reminder")} label="Bắt đầu bước 2" grow />
            </div>
          )}
          {state === "ekyc-reminder" && <CTA onClick={() => go("ekyc-capture")} label="Chụp CCCD ngay" />}
          {state === "ekyc-capture" && <CTA onClick={() => go("ekyc-success")} label="Chụp & tiếp tục" icon={<Camera size={18} />} />}
          {state === "ekyc-success" && (
            <CTA
              onClick={() =>
                returnTo === "wallet"
                  ? router.push("/xanhsm-vsp/wallet?state=half-unlocked")
                  : go("link-pick-bank")
              }
              label={returnTo === "wallet" ? "Về ví VSP" : "Tiếp tục bước 3"}
            />
          )}
          {state === "ekyc-fail" && (
            <div className="flex gap-[8px]">
              <button onClick={() => router.push("/xanhsm-vsp/gsm-home?state=fresh")} className="h-[54px] px-[22px] rounded-full bg-[#f3f4f6] text-foreground font-semibold text-[14px]">Để sau</button>
              <button onClick={() => go("ekyc-capture")} className="flex-1 h-[54px] rounded-full text-white font-bold text-[15px] flex items-center justify-center gap-[8px]" style={{ background: "#28bdbf", boxShadow: "0 4px 14px rgba(40,189,191,0.35)" }}><RefreshCw size={16} />Thử lại</button>
            </div>
          )}
          {state === "link-reminder" && <CTA onClick={() => go("link-pick-bank")} label="Chọn ngân hàng" />}
          {state === "link-enter-info" && <CTA onClick={() => go("link-success")} label="Xác nhận liên kết" />}
          {state === "link-success" && (
            <CTA
              onClick={() =>
                returnTo === "wallet"
                  ? router.push("/xanhsm-vsp/wallet?state=active&celebrate=1")
                  : go("ready")
              }
              label={returnTo === "wallet" ? "Về ví VSP" : "Hoàn tất"}
            />
          )}
          {state === "link-fail" && (
            <div className="flex gap-[8px]">
              <button onClick={() => router.push("/xanhsm-vsp/gsm-home?state=ekyc-done")} className="h-[54px] px-[22px] rounded-full bg-[#f3f4f6] text-foreground font-semibold text-[14px]">Để sau</button>
              <button onClick={() => go("link-enter-info")} className="flex-1 h-[54px] rounded-full text-white font-bold text-[15px] flex items-center justify-center gap-[8px]" style={{ background: "#28bdbf", boxShadow: "0 4px 14px rgba(40,189,191,0.35)" }}><RefreshCw size={16} />Thử lại</button>
            </div>
          )}
          {state === "ready" && (
            <button onClick={() => router.push("/xanhsm-vsp/gsm-home?state=active")} className="w-full h-[52px] rounded-full text-white font-bold text-[15px] flex items-center justify-center gap-[8px]" style={{ background: "#28bdbf", boxShadow: "0 4px 14px rgba(40,189,191,0.35)" }}>
              <ArrowLeft size={16} /> Về trang chủ Xanh SM
            </button>
          )}
        </div>
      </div>
      )}

      {state === "link-enter-info" && (
        <>
          <KeypadIOS onPress={() => {}} onDel={() => {}} />
          <div className="flex justify-center py-[8px]" style={{ background: "#d1d5db" }}>
            <div className="w-[134px] h-[5px] bg-foreground rounded-full" />
          </div>
        </>
      )}

      {!["pin-setup", "pin-confirm", "pin-login", "link-enter-info"].includes(state) && <HomeIndicator />}
    </div>
  )
}

function CTA({ onClick, label, icon, grow }: { onClick: () => void; label: string; icon?: React.ReactNode; grow?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`${grow ? "flex-1 " : "w-full "}h-[54px] rounded-full text-white font-bold text-[15px] flex items-center justify-center gap-[8px]`}
      style={{ background: "#28bdbf", boxShadow: "0 4px 14px rgba(40,189,191,0.35)" }}
    >
      {icon}
      {label}
    </button>
  )
}

export default function Page() {
  return <Suspense><Inner /></Suspense>
}
