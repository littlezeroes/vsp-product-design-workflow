"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import { FixedBottom } from "@/components/ui/fixed-bottom"
import { TextField } from "@/components/ui/text-field"

/**
 * S3: Bổ sung thông tin
 * Thu nhập, nghề nghiệp, mục đích sử dụng
 */
const OCCUPATIONS = ["Nhân viên văn phòng", "Công nhân", "Kinh doanh / Tự do", "Công chức nhà nước", "Sinh viên", "Khác"]
const PURPOSES = ["Mua sắm Vingroup", "Thanh toán hóa đơn", "Du lịch", "Sức khỏe / y tế", "Giáo dục", "Khác"]

export default function InfoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "default"
  const isFilled = state === "filled"
  const isError = state === "error"

  const [income, setIncome] = React.useState(isFilled ? "15000000" : "")
  const [occupation, setOccupation] = React.useState(isFilled ? OCCUPATIONS[0] : "")
  const [purpose, setPurpose] = React.useState(isFilled ? PURPOSES[0] : "")

  const canContinue = income && occupation && purpose

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header
        variant="large-title"
        largeTitle="Bổ sung thông tin"
        description="Giúp chúng tôi duyệt hồ sơ nhanh hơn"
        leading={
          <button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full">
            <ChevronLeft size={18} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto pb-[240px]">
        <div className="px-[22px] pt-[16px] flex flex-col gap-[16px]">
          <TextField
            label="Thu nhập hàng tháng (VNĐ)"
            placeholder="Ví dụ: 15.000.000"
            inputMode="numeric"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            error={isError ? "Thu nhập tối thiểu phải từ 5.000.000 ₫" : undefined}
          />

          {/* Occupation picker */}
          <div>
            <p className="text-xs font-normal text-foreground-secondary px-[14px] mb-[8px]">Nghề nghiệp</p>
            <div className="flex flex-col rounded-14 border border-grey-400 overflow-hidden">
              {OCCUPATIONS.map((o, i) => (
                <button
                  key={o}
                  onClick={() => setOccupation(o)}
                  className={`flex items-center justify-between px-[14px] py-[14px] text-left ${
                    i < OCCUPATIONS.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <span className={`text-sm leading-5 ${occupation === o ? "font-semibold text-foreground" : "text-foreground-secondary"}`}>
                    {o}
                  </span>
                  {occupation === o && (
                    <span className="w-5 h-5 rounded-full bg-foreground flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-background">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Purpose picker */}
          <div>
            <p className="text-xs font-normal text-foreground-secondary px-[14px] mb-[8px]">Mục đích sử dụng</p>
            <div className="flex flex-wrap gap-[8px]">
              {PURPOSES.map((p) => (
                <button
                  key={p}
                  onClick={() => setPurpose(p)}
                  className={`px-3 h-9 rounded-full text-sm font-medium ${
                    purpose === p
                      ? "bg-foreground text-background"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <FixedBottom>
        <Button
          variant="primary"
          size="48"
          className="w-full"
          disabled={!canContinue}
          onClick={() => router.push("/bnpl/contract")}
        >
          Tiếp tục
        </Button>
        <div className="flex justify-center pt-[8px]">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </FixedBottom>
    </div>
  )
}
