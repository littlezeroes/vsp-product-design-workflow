"use client"

import * as React from "react"
import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { CheckCircle2, XCircle, Clock } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import { TextField } from "@/components/ui/text-field"
import { TextArea } from "@/components/ui/text-area"
import { FeedbackState } from "@/components/ui/feedback-state"
import { ItemList, ItemListItem } from "@/components/ui/item-list"

const QUICK_AMOUNTS = [100000, 200000, 500000, 1000000]
const FUND_BALANCE = 1200000
const FUND_NAME = "Du lịch Đà Lạt 2026"

function RutInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const state = searchParams.get("state") ?? "input"
  const role = searchParams.get("role") ?? "admin"
  const isMember = role === "member"
  const [amount, setAmount] = useState("500000")
  const [selectedChip, setSelectedChip] = useState(500000)
  const [reason, setReason] = useState("")

  const formatAmount = (val: string) => {
    const num = parseInt(val.replace(/\D/g, ""), 10)
    return isNaN(num) ? "" : num.toLocaleString("vi-VN")
  }

  const nextHref = (nextState: string) =>
    `/quy-nhom/rut?state=${nextState}${isMember ? "&role=member" : ""}`

  /* ═══ SUCCESS (admin) ═══ */
  if (state === "success") {
    return (
      <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
        <Header variant="default" leading={<button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full"><ChevronLeft size={18} /></button>} />

        <div className="flex-1 flex flex-col items-center justify-center px-[22px]">
          <FeedbackState
            icon={<CheckCircle2 size={64} className="text-success" strokeWidth={1.5} />}
            title="Rút tiền thành công"
            description={`Đã rút 500.000 ₫ từ quỹ ${FUND_NAME} về Ví V-Smart Pay`}
          />
          <div className="w-full mt-[24px]">
            <ItemList>
              <ItemListItem label="Số tiền rút" metadata="500.000 ₫" divider />
              <ItemListItem label="Quỹ sau rút" metadata="700.000 ₫" divider />
              <ItemListItem label="Nhận tại" metadata="Ví V-Smart Pay" />
            </ItemList>
          </div>
        </div>

        <div className="px-[22px] pt-[12px] pb-[16px]">
          <Button variant="primary" className="w-full" onClick={() => router.push("/quy-nhom/dashboard")}>
            Về quỹ nhóm
          </Button>
        </div>
        <div className="flex justify-center pb-[8px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </div>
    )
  }

  /* ═══ PENDING (member) ═══ */
  if (state === "pending") {
    return (
      <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
        <Header variant="default" leading={<button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full"><ChevronLeft size={18} /></button>} />

        <div className="flex-1 flex flex-col items-center justify-center px-[22px]">
          <FeedbackState
            icon={<Clock size={64} className="text-foreground-secondary" strokeWidth={1.5} />}
            title="Đã gửi yêu cầu rút"
            description="Admin sẽ nhận được thông báo và xử lý yêu cầu trong vòng 24 giờ"
          />
          <div className="w-full mt-[24px]">
            <ItemList>
              <ItemListItem label="Số tiền yêu cầu" metadata="500.000 ₫" divider />
              <ItemListItem label="Trạng thái" metadata="Chờ duyệt" divider />
              <ItemListItem label="Lý do" sublabel={reason || "Không có"} />
            </ItemList>
          </div>
        </div>

        <div className="px-[22px] pt-[12px] pb-[16px]">
          <Button variant="primary" className="w-full" onClick={() => router.push("/quy-nhom/dashboard")}>
            Về quỹ nhóm
          </Button>
        </div>
        <div className="flex justify-center pb-[8px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </div>
    )
  }

  /* ═══ FAILED ═══ */
  if (state === "failed") {
    return (
      <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
        <Header variant="default" leading={<button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full"><ChevronLeft size={18} /></button>} />

        <div className="flex-1 flex flex-col items-center justify-center px-[22px]">
          <FeedbackState
            icon={<XCircle size={64} className="text-danger" strokeWidth={1.5} />}
            title="Rút tiền thất bại"
            description="Số dư quỹ không đủ hoặc giao dịch bị từ chối. Vui lòng thử lại."
          />
        </div>

        <div className="px-[22px] pt-[12px] pb-[16px] space-y-[8px]">
          <Button variant="primary" className="w-full" onClick={() => router.push(nextHref("input"))}>
            Thử lại
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => router.push("/quy-nhom/dashboard")}>
            Về quỹ nhóm
          </Button>
        </div>
        <div className="flex justify-center pb-[8px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </div>
    )
  }

  /* ═══ CONFIRM ═══ */
  if (state === "confirm") {
    const confirmTitle = isMember ? "Xác nhận yêu cầu rút" : "Xác nhận rút tiền"
    const ctaText = isMember ? "Gửi yêu cầu" : "Xác nhận rút tiền"
    const nextState = isMember ? "pending" : "success"

    return (
      <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
        <Header variant="default" title={confirmTitle} leading={<button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full"><ChevronLeft size={18} /></button>} />

        <div className="flex-1 overflow-y-auto">
          {/* Fund info */}
          <div className="px-[22px] pt-[16px]">
            <div className="bg-secondary rounded-14 px-[14px] py-[12px] mb-[24px] flex items-center gap-[12px]">
              <div className="w-[36px] h-[36px] rounded-8 bg-background flex items-center justify-center text-[20px] shrink-0">
                🏔️
              </div>
              <div>
                <div className="text-[12px] text-foreground-secondary">Quỹ nhóm</div>
                <div className="text-[14px] font-semibold">{FUND_NAME}</div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="pt-[24px] pb-[12px] px-[22px]">
            <span className="text-[15px] font-bold">
              {isMember ? "Thông tin yêu cầu" : "Thông tin rút tiền"}
            </span>
          </div>
          <div className="px-[22px]">
            <ItemList>
              <ItemListItem label="Số tiền rút" metadata="500.000 ₫" divider />
              <ItemListItem label="Nhận tại" metadata="Ví V-Smart Pay" divider />
              <ItemListItem label="Số dư quỹ" metadata={`${FUND_BALANCE.toLocaleString("vi-VN")} ₫`} divider />
              <ItemListItem label="Quỹ sau rút" metadata="700.000 ₫" divider={isMember && Boolean(reason)} />
              {isMember && reason && <ItemListItem label="Lý do" sublabel={reason} />}
            </ItemList>
          </div>

          {isMember && (
            <div className="px-[22px] pt-[16px]">
              <div className="rounded-14 bg-secondary p-[14px]">
                <div className="text-[12px] text-foreground-secondary mb-[4px]">Sẽ gửi đến admin</div>
                <div className="text-[13px] font-semibold">Huy Kiều (admin quỹ)</div>
              </div>
            </div>
          )}
        </div>

        <div className="px-[22px] pt-[12px] pb-[16px]">
          <Button variant="primary" className="w-full" onClick={() => router.push(nextHref(nextState))}>
            {ctaText}
          </Button>
        </div>
        <div className="flex justify-center pb-[8px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </div>
    )
  }

  /* ═══ INPUT (default — admin or member) ═══ */
  const inputTitle = isMember ? "Yêu cầu rút tiền" : "Rút tiền"
  const ctaText = isMember ? "Tiếp tục" : "Tiếp tục"
  const disabled = !amount || amount === "0" || (isMember && !reason.trim())

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header variant="default" title={inputTitle} leading={<button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full"><ChevronLeft size={18} /></button>} />

      <div className="flex-1 overflow-y-auto">
        {/* Fund info card */}
        <div className="px-[22px] pt-[16px]">
          <div className="bg-secondary rounded-14 px-[14px] py-[12px] mb-[24px] flex items-center gap-[12px]">
            <div className="w-[36px] h-[36px] rounded-8 bg-foreground text-background flex items-center justify-center text-[10px] font-bold shrink-0">
              DL
            </div>
            <div className="min-w-0">
              <div className="text-[14px] font-semibold">{FUND_NAME}</div>
              <div className="text-[12px] text-foreground-secondary">
                Quỹ hiện có: {FUND_BALANCE.toLocaleString("vi-VN")} ₫
              </div>
            </div>
          </div>
        </div>

        {/* Amount input */}
        <div className="px-[22px]">
          <TextField
            label="Số tiền rút"
            value={formatAmount(amount)}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
            placeholder="Nhập số tiền"
            helpText={isMember ? "Yêu cầu sẽ gửi đến admin quỹ" : "Rút về Ví V-Smart Pay của bạn"}
            inputMode="numeric"
          />
        </div>

        {/* Quick chips */}
        <div className="px-[22px] pt-[16px] flex gap-[8px] flex-wrap">
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              onClick={() => { setAmount(String(amt)); setSelectedChip(amt) }}
              className={`px-[16px] py-[8px] rounded-full text-[13px] font-semibold transition-colors ${
                selectedChip === amt
                  ? "bg-foreground text-background"
                  : "bg-secondary text-foreground"
              }`}
            >
              {(amt / 1000).toLocaleString()}K
            </button>
          ))}
        </div>

        {/* Reason (member only) */}
        {isMember && (
          <div className="px-[22px] pt-[24px]">
            <TextArea
              label="Lý do rút tiền"
              value={reason}
              onChange={(val) => setReason(val)}
              placeholder="VD: Đóng tiền vé máy bay cho chuyến đi"
              helpText="Admin cần biết để duyệt yêu cầu"
              rows={3}
            />
          </div>
        )}
      </div>

      <div className="px-[22px] pt-[12px] pb-[16px]">
        <Button
          variant="primary"
          className="w-full"
          onClick={() => router.push(nextHref("confirm"))}
          disabled={disabled}
        >
          {ctaText}
        </Button>
      </div>
      <div className="flex justify-center pb-[8px]">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}

export default function RutTien() {
  return (
    <Suspense>
      <RutInner />
    </Suspense>
  )
}
