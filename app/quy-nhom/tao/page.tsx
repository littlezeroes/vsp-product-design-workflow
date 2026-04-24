"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Camera, ChevronLeft, Lock, Globe } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import { TextField } from "@/components/ui/text-field"

export default function TaoQuyNhom() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [goal, setGoal] = useState("")
  const [privacy, setPrivacy] = useState<"private" | "public">("private")

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header variant="default" title="Tạo quỹ nhóm" leading={<button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full"><ChevronLeft size={18} /></button>} />

      <div className="flex-1 overflow-y-auto px-[22px] pt-[8px] pb-[120px]">
        {/* Avatar upload — mint gradient + premium */}
        <div className="flex justify-center mb-[32px]">
          <div className="relative w-[96px] h-[96px]">
            <button
              className="w-full h-full rounded-full flex items-center justify-center active:scale-95 transition-transform shadow-[0_4px_16px_rgba(0,177,130,0.15)]"
              style={{ background: "linear-gradient(135deg, #e6f9f1 0%, #c2f0e0 100%)" }}
            >
              <Camera size={28} className="text-foreground" strokeWidth={1.5} />
            </button>
            <div className="absolute bottom-0 right-0 w-[28px] h-[28px] rounded-full bg-foreground text-background flex items-center justify-center border-[3px] border-background">
              <span className="text-[14px] font-bold leading-none">+</span>
            </div>
          </div>
        </div>

        {/* Fund name */}
        <TextField
          label="Tên quỹ"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Du lịch Đà Lạt"
        />

        <div className="h-[20px]" />

        {/* Description */}
        <TextField
          label="Mô tả · tuỳ chọn"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Gom tiền đi Đà Lạt tháng 6"
        />

        <div className="h-[20px]" />

        {/* Goal amount */}
        <TextField
          label="Mục tiêu · tuỳ chọn"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="5.000.000 ₫"
          inputMode="numeric"
          helpText="Để trống nếu không có mục tiêu cụ thể"
        />

        {/* Privacy — chip pair, Cash App segmented */}
        <div className="pt-[40px]">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-foreground-secondary mb-[14px]">
            Ai có thể tham gia
          </div>

          <div className="flex gap-[8px]">
            <button
              onClick={() => setPrivacy("private")}
              className={`flex-1 h-[56px] rounded-full flex items-center justify-center gap-[8px] transition-colors ${
                privacy === "private"
                  ? "bg-foreground text-background"
                  : "bg-secondary text-foreground"
              }`}
            >
              <Lock size={16} strokeWidth={privacy === "private" ? 2.2 : 1.8} />
              <span className="text-[14px] font-semibold">Riêng tư</span>
            </button>
            <button
              onClick={() => setPrivacy("public")}
              className={`flex-1 h-[56px] rounded-full flex items-center justify-center gap-[8px] transition-colors ${
                privacy === "public"
                  ? "bg-foreground text-background"
                  : "bg-secondary text-foreground"
              }`}
            >
              <Globe size={16} strokeWidth={privacy === "public" ? 2.2 : 1.8} />
              <span className="text-[14px] font-semibold">Công khai</span>
            </button>
          </div>

          <p className="text-[13px] text-foreground-secondary mt-[14px] leading-[20px]">
            {privacy === "private"
              ? "Chỉ người được bạn mời mới có thể xem và tham gia quỹ."
              : "Bất cứ ai có link đều có thể tham gia quỹ này."}
          </p>
        </div>
      </div>

      {/* CTA — fixed bottom */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-[22px] pt-[12px] pb-[28px] bg-background/90 backdrop-blur-xl z-40">
        <Button
          variant="primary"
          className="w-full"
          disabled={!name.trim()}
          onClick={() => router.push("/quy-nhom/dashboard")}
        >
          Tạo quỹ nhóm
        </Button>
      </div>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[390px] h-[21px] flex items-end justify-center pb-[4px] pointer-events-none z-50">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}
