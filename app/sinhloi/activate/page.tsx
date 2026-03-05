"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { SINHLOI_CONFIG, formatVND } from "../data"

/* ── Benefits rows ─────────────────────────────────────────────────── */
const BENEFITS = [
  { label: "Lợi suất hiện tại", value: "4.5%/năm", isSuccess: true },
  { label: "Số dư tối đa", value: "100.000.000 đ" },
  { label: "Rút tiền về ví V-Pay", value: "30.000.000 đ/ngày" },
  { label: "Thanh toán, chuyển tiền\nđến ngân hàng", value: "Không giới hạn" },
]

export default function ActivatePage() {
  const router = useRouter()
  const [check1, setCheck1] = React.useState(false)
  const [check2, setCheck2] = React.useState(false)
  const allChecked = check1 && check2

  return (
    <div className="min-h-screen bg-grey-100 dark:bg-grey-900 flex flex-col items-center">
      <div className="relative w-[390px] h-[844px] bg-background text-foreground flex flex-col rounded-[40px] shadow-xl overflow-hidden mt-[16px]">

        {/* Header */}
        <Header
          variant="default"
          title="Kích hoạt Sinh lời tự động"
          showStatusBar
          leading={
            <button
              type="button"
              onClick={() => router.back()}
              className="p-[10px] min-h-[44px] rounded-full flex items-center justify-center"
            >
              <ChevronLeft size={18} className="text-foreground" />
            </button>
          }
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Section title */}
          <div className="px-[22px] pt-[24px] pb-[16px]">
            <p className="text-md font-semibold leading-6 text-foreground">
              Quyền lợi khi kích hoạt Sinh lời tự động
            </p>
          </div>

          {/* Benefits card */}
          <div className="px-[22px]">
            <div className="rounded-[14px] bg-success/10 overflow-hidden">
              {/* Top section with border */}
              <div className="bg-background border border-success rounded-[14px] py-[8px]">
                {BENEFITS.map((b, i) => (
                  <div key={i} className="flex items-start gap-[16px] px-[16px] py-[8px]">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-5 text-foreground-secondary whitespace-pre-line">{b.label}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className={`text-sm font-medium leading-5 ${b.isSuccess ? "text-success" : "text-foreground"}`}>
                        {b.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Green footer note */}
              <div className="px-[14px] py-[12px]">
                <p className="text-sm leading-5 text-foreground">
                  Miễn phí không giới hạn toàn bộ các giao dịch chuyển tiền đến ngân hàng từ nguồn thanh toán Sinh lời tự động!
                </p>
              </div>
            </div>
          </div>

          {/* T&C Section */}
          <div className="px-[22px] pt-[32px]">
            <p className="text-xs leading-5 text-foreground mb-[16px]">
              Khi nhấn Xác nhận, bạn đồng ý với:
            </p>

            <div className="bg-secondary rounded-[12px] px-[14px] py-[4px]">
              {/* Checkbox 1 */}
              <div className="flex items-center gap-[12px] py-[10px]">
                <Checkbox checked={check1} onChange={setCheck1} />
                <p className="flex-1 text-xs leading-5 text-foreground-secondary">
                  <span className="text-info">Điều khoản sử dụng</span>
                  {" "}Sinh lời tự động của V-Pay
                </p>
              </div>

              {/* Checkbox 2 */}
              <div className="flex items-center gap-[12px] py-[10px]">
                <Checkbox checked={check2} onChange={setCheck2} />
                <p className="flex-1 text-xs leading-5 text-foreground-secondary">
                  Giao kết{" "}
                  <span className="text-info">Hợp đồng hợp tác kinh doanh</span>
                  {" "}với {SINHLOI_CONFIG.provider} và{" "}
                  <span className="text-info">Chính sách bảo vệ dữ liệu</span>
                  {" "}của V-Pay
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed bottom */}
        <div className="shrink-0 bg-background pt-[16px] flex flex-col items-center">
          <div className="w-full px-[22px]">
            <Button
              variant="primary"
              size="48"
              className="w-full"
              disabled={!allChecked}
              onClick={() => router.push("/sinhloi/otp?context=activate")}
            >
              Xác nhận
            </Button>
          </div>
          {/* Home indicator */}
          <div className="h-[21px] flex items-end justify-center pb-[8px]">
            <div className="w-[139px] h-[5px] bg-foreground rounded-[100px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
