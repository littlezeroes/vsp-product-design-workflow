"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft, X, Delete, ArrowDown, Camera, ImageIcon,
  CheckCircle2, XCircle, Clock, Info, MessageCircle,
  ChevronRight, Share2, Home as HomeIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/header"
import { Dialog } from "@/components/ui/dialog"
import { ItemListItem } from "@/components/ui/item-list"
import { InformMessage } from "@/components/ui/inform-message"

/*
 * QR Payment Flow — V-Smart Pay
 * Source: Figma Snowflake QR Payment (CxLBZDoFRNBz1uCWeRoVHY)
 *
 * Screens:
 *   1. scan    — QR Scanner (camera view)
 *   2. amount  — Chuyển số tiền (enter amount + numpad)
 *   3. confirm — Xác nhận chuyển tiền (review + payment source)
 *   4. face    — Face authentication
 *   5. result  — Kết quả (success / processing / failed)
 *
 * Modals:
 *   - cameraPermission — Yêu cầu quyền camera
 *   - qrInvalid — QR không hợp lệ
 *   - qrError — Lỗi quét QR
 *   - dailyLimit — Vượt hạn mức ngày
 */

type Screen = "scan" | "amount" | "confirm" | "face" | "result"
type ResultType = "success" | "processing" | "failed"

const RECEIVER = {
  name: "NGUYEN DUC THIEN",
  wallet: "Ví V-Smart Pay",
  phone: "0939399222",
  account: "***9999",
}

const SENDER = {
  name: "KIEU MANH HUY",
  wallet: "Ví V-Smart Pay",
  account: "***2321",
  balance: 240_000,
}

function formatVND(n: number) {
  return n.toLocaleString("vi-VN")
}

/* ═══════════════════════════════════════════════════════════════
   PHONE FRAME WRAPPER
   ═══════════════════════════════════════════════════════════════ */
function PhoneFrame({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="min-h-screen bg-grey-100 dark:bg-grey-900 flex flex-col items-center">
      <div className={cn(
        "relative w-[390px] h-[844px] flex flex-col rounded-[40px] shadow-xl overflow-hidden mt-4",
        dark ? "bg-grey-1000 text-white" : "bg-background text-foreground",
      )}>
        {children}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   STATUS BAR
   ═══════════════════════════════════════════════════════════════ */
function StatusBar({ light }: { light?: boolean }) {
  const c = light ? "text-white" : "text-foreground"
  return (
    <div className={cn("w-full shrink-0 flex items-center px-6 h-[44px]", c)} aria-hidden="true">
      <span className="text-[17px] font-semibold leading-none flex-1">9:41</span>
      <div className="flex items-center gap-[6px]">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="0.5" />
          <rect x="4" y="5" width="3" height="7" rx="0.5" />
          <rect x="8" y="2" width="3" height="10" rx="0.5" />
          <rect x="12" y="0" width="3" height="12" rx="0.5" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 9.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" fill="currentColor" />
          <path d="M4.5 7.5a5 5 0 0 1 7 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M2 5a8 8 0 0 1 12 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="currentColor">
          <rect x="0.5" y="0.5" width="24" height="12" rx="3.5" stroke="currentColor" fill="none" />
          <rect x="26" y="4" width="1.5" height="5" rx="0.5" />
          <rect x="2" y="2" width="20" height="9" rx="2" />
        </svg>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   HOME INDICATOR
   ═══════════════════════════════════════════════════════════════ */
function HomeIndicator({ light }: { light?: boolean }) {
  return (
    <div className="flex justify-center pb-2 pt-3">
      <div className={cn("w-[139px] h-[5px] rounded-full", light ? "bg-white" : "bg-foreground")} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAYMENT SOURCE CARD (reused in confirm screens)
   ═══════════════════════════════════════════════════════════════ */
function PaymentSourceSection() {
  return (
    <div className="pt-6 pb-3">
      <p className="text-md leading-[24px] font-semibold text-foreground mb-3 px-[22px]">
        Nguồn thanh toán
      </p>
      <div className="flex gap-3 px-[22px]">
        {/* Ví V-Smart Pay — selected */}
        <button className="relative flex items-center gap-2 px-3 py-3 bg-background min-w-0 shrink-0 rounded-[16px]">
          <span className="absolute inset-[-1.5px] rounded-[17px] bg-foreground -z-10" aria-hidden="true" />
          <span className="absolute inset-0 rounded-[16px] bg-background -z-[5]" aria-hidden="true" />
          <div className="size-8 rounded-[10px] bg-foreground flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 14L9 4L16 14H2Z" fill="white" /></svg>
          </div>
          <div className="flex flex-col items-start min-w-0">
            <span className="text-xs leading-4 font-medium text-foreground truncate">Ví V-Smart Pay</span>
            <span className="text-sm leading-5 font-semibold text-foreground">137.500 đ</span>
          </div>
        </button>
        {/* Nguồn liên kết — upcoming */}
        <div className="relative flex items-center gap-2 px-3 py-3 bg-background min-w-0 shrink-0 rounded-[16px] opacity-60">
          <span className="absolute inset-[-1px] rounded-[17px] bg-border -z-10" aria-hidden="true" />
          <span className="absolute inset-0 rounded-[16px] bg-background -z-[5]" aria-hidden="true" />
          <div className="size-8 rounded-[10px] bg-secondary flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="3" y="5" width="12" height="8" rx="1" stroke="#a1a1a1" strokeWidth="1.5" />
              <path d="M3 8H15" stroke="#a1a1a1" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="flex flex-col items-start min-w-0">
            <span className="text-xs leading-4 font-medium text-foreground-secondary truncate">Nguồn liên kết</span>
            <span className="text-sm leading-5 text-foreground-secondary">Sắp ra mắt</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   RECEIVER CARD (dark bg card)
   ═══════════════════════════════════════════════════════════════ */
function ReceiverCard() {
  return (
    <div className="mx-[22px] flex items-center gap-3 px-4 py-4 rounded-[20px] bg-grey-100 dark:bg-grey-800">
      <div className="size-10 rounded-full bg-foreground flex items-center justify-center shrink-0">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 16L10 5L17 16H3Z" fill="white" /></svg>
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-md leading-6 font-semibold text-foreground">{RECEIVER.name}</span>
        <span className="text-sm leading-5 text-foreground-secondary">{RECEIVER.wallet} | {RECEIVER.phone}</span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function QRPaymentFlow() {
  const router = useRouter()
  // Allow ?screen=amount etc. for testing
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null
  const initialScreen = (params?.get("screen") as Screen) || "scan"
  const [screen, setScreen] = React.useState<Screen>(initialScreen)
  const [amount, setAmount] = React.useState(0)
  const [note, setNote] = React.useState("Kieu Manh Huy chuyen tien")
  const [resultType, setResultType] = React.useState<ResultType>("success")
  const [showCameraDialog, setShowCameraDialog] = React.useState(false)
  const [showLimitDialog, setShowLimitDialog] = React.useState(false)
  const [showQrErrorDialog, setShowQrErrorDialog] = React.useState(false)
  const [faceState, setFaceState] = React.useState<"scanning" | "error" | "success">("scanning")

  // Numpad
  const handleKey = (key: string) => {
    if (key === "del") {
      setAmount(Math.floor(amount / 10))
    } else if (key === "000") {
      const next = amount * 1000
      if (next <= 999_999_999) setAmount(next)
    } else {
      const next = amount * 10 + parseInt(key)
      if (next <= 999_999_999) setAmount(next)
    }
  }

  const chips = React.useMemo(() => {
    if (amount === 0) return [100_000, 200_000, 500_000]
    const s: number[] = []
    for (const m of [10, 100, 1000]) {
      const v = amount * m
      if (v >= 1000 && v <= 999_999_999) s.push(v)
    }
    return s.length ? s.slice(0, 3) : [100_000, 200_000, 500_000]
  }, [amount])

  // Simulate QR scan
  const handleScan = () => setScreen("amount")

  // ───────── SCREEN: QR SCANNER ─────────
  if (screen === "scan") {
    return (
      <PhoneFrame dark>
        <StatusBar light />
        {/* Nav */}
        <div className="flex items-center px-[14px] h-[56px] shrink-0">
          <button onClick={() => router.back()} className="p-[10px] rounded-full">
            <ChevronLeft size={18} className="text-white" />
          </button>
          <span className="flex-1 text-[18px] font-bold text-white">Quét QR</span>
          <button className="p-[10px] rounded-full">
            <Camera size={18} className="text-white" />
          </button>
        </div>

        {/* QR Logos */}
        <div className="flex items-center justify-center gap-4 py-2">
          <span className="text-xs font-semibold text-white/80">v-smart pay</span>
          <span className="text-xs font-semibold text-white/80">VietQR Pay</span>
          <span className="text-xs font-semibold text-white/80">VietQR</span>
        </div>

        {/* Camera view placeholder — click to simulate scan */}
        <button onClick={handleScan} className="flex-1 relative mx-6 my-4 cursor-pointer">
          <div className="absolute inset-0 rounded-[20px] bg-grey-800 flex items-center justify-center">
            <div className="size-[220px] border-2 border-green-500 rounded-[20px] flex items-center justify-center flex-col gap-2">
              <Camera size={48} className="text-grey-500" />
              <span className="text-xs text-grey-400">Tap để giả lập quét</span>
            </div>
          </div>
        </button>

        {/* Help text */}
        <p className="text-center text-sm text-white/70 px-6 pb-2">
          Di chuyển camera đến mã QR để quét hoặc
        </p>
        <button className="flex items-center justify-center gap-2 pb-4 text-white">
          <ImageIcon size={20} />
          <span className="text-sm font-medium">Tải ảnh lên</span>
        </button>

        {/* Bottom tabs */}
        <div className="flex items-center justify-around pb-2 pt-3">
          <button onClick={handleScan} className="px-4 py-2 rounded-full bg-white text-foreground text-sm font-semibold">
            Quét QR
          </button>
          <button className="px-4 py-2 text-white/60 text-sm font-medium">Thanh toán</button>
          <button className="px-4 py-2 text-white/60 text-sm font-medium">Nhận tiền</button>
        </div>

        <HomeIndicator light />

        {/* Dialogs */}
        <Dialog
          open={showCameraDialog}
          onClose={() => setShowCameraDialog(false)}
          type="icon"
          icon={<Info size={36} className="text-info" />}
          title="Ví V-Smart Pay cần quyền truy cập máy ảnh"
          description="Cho phép V-Smart Pay quyền truy cập máy ảnh để bắt đầu quét QR"
          primaryLabel="Mở cài đặt"
          secondaryLabel="Hủy"
        />
        <Dialog
          open={showQrErrorDialog}
          onClose={() => setShowQrErrorDialog(false)}
          title="Lỗi quét mã QR"
          description="Vui lòng thử lại"
          primaryLabel="Đóng"
          secondaryLabel=""
        />
      </PhoneFrame>
    )
  }

  // ───────── SCREEN: ENTER AMOUNT ─────────
  if (screen === "amount") {
    return (
      <PhoneFrame>
        <Header
          variant="default"
          title="Chuyển tiền"
          leading={
            <button onClick={() => setScreen("scan")} className="p-[10px] min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full active:bg-secondary">
              <ChevronLeft size={18} className="text-foreground" />
            </button>
          }
        />

        {/* Balance + Amount input */}
        <div className="px-[22px] pt-2">
          <div className="rounded-[20px] border border-border p-4">
            <p className="text-sm text-foreground-secondary mb-2">Số dư ví: {formatVND(SENDER.balance)} đ</p>
            <div className="flex items-baseline">
              <span className="text-[2px] w-[3px] h-[32px] bg-green-500 rounded-full mr-1" />
              <span className={cn(
                "text-[40px] font-bold leading-[48px] tracking-[-1px]",
                amount === 0 ? "text-grey-300" : "text-foreground"
              )}>
                {amount === 0 ? "0" : formatVND(amount)}
              </span>
              <span className="text-[24px] text-grey-300 ml-1">đ</span>
            </div>
          </div>
        </div>

        {/* Arrow down */}
        <div className="flex justify-center py-2">
          <ArrowDown size={20} className="text-foreground" />
        </div>

        {/* Receiver */}
        <ReceiverCard />

        {/* Note */}
        <div className="px-[22px] pt-3">
          <div className="flex items-center gap-2 py-3">
            <MessageCircle size={20} className="text-foreground-secondary shrink-0" />
            <span className="text-sm text-foreground-secondary">{note}</span>
          </div>
        </div>

        {/* Continue button (disabled if 0) */}
        <div className="px-[22px] pt-4">
          <Button
            variant="primary"
            size="48"
            className="w-full"
            disabled={amount === 0}
            onClick={() => setScreen("confirm")}
          >
            Tiếp tục
          </Button>
        </div>

        {/* Quick chips */}
        <div className="flex gap-2 px-[22px] pt-3">
          {chips.map(v => (
            <button
              key={v}
              onClick={() => setAmount(v)}
              className="flex-1 py-2 rounded-full border border-border text-sm font-medium text-foreground active:bg-secondary"
            >
              {formatVND(v)}
            </button>
          ))}
        </div>

        {/* Numpad */}
        <div className="mt-auto grid grid-cols-3 px-4 pb-2">
          {["1","2","3","4","5","6","7","8","9","000","0","del"].map(key => (
            <button
              key={key}
              onClick={() => handleKey(key)}
              className="h-[56px] flex items-center justify-center text-[24px] font-semibold text-foreground active:bg-secondary rounded-xl"
            >
              {key === "del" ? <Delete size={24} /> : key}
            </button>
          ))}
        </div>

        <HomeIndicator />
      </PhoneFrame>
    )
  }

  // ───────── SCREEN: CONFIRM TRANSFER ─────────
  if (screen === "confirm") {
    const fee = amount > 2_000_000 ? 1100 : 0
    const total = amount + fee

    return (
      <PhoneFrame>
        <Header
          variant="large-title"
          largeTitle="Xác nhận chuyển tiền"
          leading={
            <button onClick={() => setScreen("amount")} className="p-[10px] min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full active:bg-secondary">
              <ChevronLeft size={18} className="text-foreground" />
            </button>
          }
        />

        <div className="flex-1 flex flex-col">
          {/* Amount */}
          <div className="px-[22px] pt-4">
            <p className="text-[40px] font-bold leading-[48px] tracking-[-1px] text-foreground">
              {formatVND(total)}
              <span className="text-[24px] font-normal text-foreground-secondary ml-1">đ</span>
            </p>
          </div>

          {/* Arrow */}
          <div className="px-[22px] py-1.5">
            <ArrowDown size={20} className="text-foreground" />
          </div>

          {/* Receiver */}
          <ReceiverCard />

          {/* Metadata */}
          <div className="px-[22px] pt-6 space-y-0">
            <div className="flex items-center justify-between py-2">
              <span className="text-md text-foreground-secondary">Nội dung</span>
              <span className="text-md font-semibold text-foreground">{note}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-md text-foreground-secondary">Dịch vụ</span>
              <span className="text-md font-semibold text-foreground">Chuyển tiền đến Ví</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-md text-foreground-secondary">Phí giao dịch</span>
              <span className="text-md font-semibold text-foreground">
                {fee === 0 ? "Miễn phí" : `${formatVND(fee)} đ`}
              </span>
            </div>
          </div>
        </div>

        {/* Fixed bottom */}
        <div className="mt-auto">
          <PaymentSourceSection />
          <div className="px-[22px] pt-3 pb-2">
            <Button variant="primary" size="48" className="w-full" onClick={() => setScreen("face")}>
              Xác thực giao dịch
            </Button>
          </div>
          <HomeIndicator />
        </div>

        {/* Limit dialog */}
        <Dialog
          open={showLimitDialog}
          onClose={() => setShowLimitDialog(false)}
          title="Thông báo"
          description="Bạn đã vượt quá hạn mức giao dịch trong ngày"
          primaryLabel="Đóng"
          secondaryLabel=""
        />
      </PhoneFrame>
    )
  }

  // ───────── SCREEN: FACE AUTHENTICATION ─────────
  if (screen === "face") {
    const borderColor = faceState === "success" ? "border-green-500" : faceState === "error" ? "border-red-500" : "border-green-500"
    const bgTint = faceState === "error" ? "bg-red-50" : "bg-grey-50"
    const statusText = faceState === "scanning"
      ? "Vui lòng giữ trong giây lát"
      : faceState === "error"
        ? "Di chuyển khuôn mặt vào khung hình"
        : "Xác thực thành công"
    const statusColor = faceState === "error" ? "text-danger" : "text-foreground-secondary"

    // Auto-proceed after 2s
    React.useEffect(() => {
      if (screen === "face") {
        const timer = setTimeout(() => {
          setResultType("success")
          setScreen("result")
        }, 3000)
        return () => clearTimeout(timer)
      }
    }, [screen])

    return (
      <PhoneFrame>
        <StatusBar />
        {/* Nav with X */}
        <div className="flex items-center px-[14px] h-[56px] shrink-0">
          <button onClick={() => setScreen("confirm")} className="p-[10px] rounded-full active:bg-secondary">
            <X size={18} className="text-foreground" />
          </button>
        </div>

        {/* Title */}
        <div className="px-[22px] pb-4">
          <h1 className="text-[24px] font-bold leading-8 tracking-[-0.25px]">Chụp ảnh khuôn mặt</h1>
          <p className="text-sm text-foreground-secondary mt-1">Giữ khuôn mặt của bạn trong khung hình</p>
        </div>

        {/* Face oval */}
        <div className="flex-1 flex items-center justify-center px-[22px]">
          <div className={cn(
            "w-[260px] h-[340px] rounded-full border-[3px] flex items-center justify-center",
            borderColor, bgTint
          )}>
            <div className="text-[80px]">🧑</div>
          </div>
        </div>

        {/* Status text */}
        <p className={cn("text-center text-sm pb-8 px-6", statusColor)}>
          {statusText}
        </p>

        <HomeIndicator />
      </PhoneFrame>
    )
  }

  // ───────── SCREEN: RESULT ─────────
  if (screen === "result") {
    const config = {
      success: {
        icon: <CheckCircle2 size={28} className="text-success" />,
        title: "Giao dịch thành công",
        bg: "bg-green-50",
        headerBg: "bg-grey-1000",
        showShare: true,
      },
      processing: {
        icon: <Clock size={28} className="text-info" />,
        title: "Giao dịch đang xử lý",
        bg: "bg-blue-50",
        headerBg: "bg-grey-1000",
        showShare: false,
      },
      failed: {
        icon: <XCircle size={28} className="text-danger" />,
        title: "Giao dịch thất bại",
        bg: "bg-red-50",
        headerBg: "bg-grey-1000",
        showShare: false,
      },
    }[resultType]

    return (
      <PhoneFrame>
        {/* Dark header band */}
        <div className="bg-grey-1000 pt-0">
          <StatusBar light />
          <div className="flex items-center justify-center gap-2 pb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 20L12 6L20 20H4Z" fill="white" /></svg>
            <span className="text-sm font-semibold text-white">v-smart pay</span>
          </div>
        </div>

        {/* Result card */}
        <div className="flex-1 overflow-y-auto -mt-2">
          <div className="mx-[22px] rounded-[20px] bg-background p-5 shadow-sm">
            {/* Status badge */}
            <div className={cn("inline-flex items-center justify-center size-10 rounded-full mb-3", config.bg)}>
              {config.icon}
            </div>
            <p className="text-md font-semibold text-foreground">{config.title}</p>
            <p className="text-[32px] font-bold leading-[40px] tracking-[-0.5px] text-foreground mt-1">
              {formatVND(amount)}
              <span className="text-[20px] font-normal text-foreground-secondary ml-1">đ</span>
            </p>
          </div>

          {/* Error message for failed */}
          {resultType === "failed" && (
            <div className="mx-[22px] mt-3">
              <InformMessage
                icon={<Info size={24} />}
                body="Chúng tôi rất tiếc vì giao dịch chưa hoàn thành."
              />
            </div>
          )}

          {/* Processing message */}
          {resultType === "processing" && (
            <div className="mx-[22px] mt-3">
              <InformMessage
                icon={<Info size={24} />}
                body="Giao dịch đã được tiếp nhận và chờ xử lý. Vui lòng kiểm tra lại trong ít phút hoặc liên hệ chăm sóc khách hàng để được tư vấn."
              />
            </div>
          )}

          {/* Transfer info */}
          <div className="mx-[22px] mt-3 rounded-[20px] bg-background p-4 shadow-sm">
            {/* Sender */}
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-foreground flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 14L9 4L16 14H2Z" fill="white" /></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{SENDER.name}</p>
                <p className="text-xs text-foreground-secondary">{SENDER.wallet} | Tài khoản {SENDER.account}</p>
              </div>
            </div>
            {/* Arrow */}
            <div className="pl-5 py-1">
              <ArrowDown size={16} className="text-foreground-secondary" />
            </div>
            {/* Receiver */}
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-foreground flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 14L9 4L16 14H2Z" fill="white" /></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{RECEIVER.name}</p>
                <p className="text-xs text-foreground-secondary">{RECEIVER.wallet} | Tài khoản {RECEIVER.account}</p>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="mx-[22px] mt-3 flex items-center gap-3 py-3">
            <MessageCircle size={20} className="text-foreground-secondary shrink-0" />
            <span className="text-sm text-foreground">{note}</span>
          </div>

          {/* Metadata */}
          <div className="mx-[22px] border-t border-border">
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-foreground-secondary">Dịch vụ</span>
              <span className="text-sm font-semibold text-foreground">Chuyển tiền</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-foreground-secondary">Mã giao dịch</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-foreground">{"{{Mã giao dịch}}"}</span>
                <ChevronRight size={16} className="text-foreground-secondary" />
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-foreground-secondary">Thời gian</span>
              <span className="text-sm font-semibold text-foreground">hh:mm • dd/mm/yyyy</span>
            </div>
          </div>

          {/* Support link */}
          <div className="mx-[22px] border-t border-border">
            <button className="flex items-center justify-between w-full py-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground">Gửi yêu cầu hỗ trợ</span>
              </div>
              <ChevronRight size={20} className="text-foreground-secondary" />
            </button>
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="px-[22px] pb-2 pt-3">
          {resultType === "success" ? (
            <div className="flex gap-3">
              <Button variant="surface" size="48" className="flex-1">Chia sẻ</Button>
              <Button variant="primary" size="48" className="flex-1" onClick={() => { setScreen("scan"); setAmount(0) }}>
                Về trang chủ
              </Button>
            </div>
          ) : (
            <Button variant="primary" size="48" className="w-full" onClick={() => { setScreen("scan"); setAmount(0) }}>
              Về trang chủ
            </Button>
          )}
        </div>
        <HomeIndicator />
      </PhoneFrame>
    )
  }

  return null
}
