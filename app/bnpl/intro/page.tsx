"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronDown } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Button } from "@/components/ui/button"
import { FixedBottom } from "@/components/ui/fixed-bottom"
import { Terms } from "@/components/ui/terms"

/**
 * S2: Intro + FAQ + Consent
 * Benefits, how it works, FAQs, data sharing + T&C consent
 */
const FAQS = [
  {
    q: "Ví trả sau là gì?",
    a: "Là hình thức tín dụng nhúng trong V-Smart Pay, cho phép bạn mua trước và trả dần theo kỳ hạn 1, 3, 6 hoặc 12 tháng.",
  },
  {
    q: "Lãi suất và phí thế nào?",
    a: "Kỳ 1 tháng: 0% lãi, miễn phí. Kỳ 3-12 tháng: lãi suất từ 1.5%/tháng, phí xử lý được hiển thị trước khi xác nhận.",
  },
  {
    q: "Tôi có thể trả sớm không?",
    a: "Có. Bạn có thể trả một phần hoặc toàn phần bất kỳ lúc nào. Không tính phí trả trước.",
  },
  {
    q: "Nếu trễ hạn thì sao?",
    a: "Phí phạt quá hạn 150.000 ₫/kỳ + lãi phạt 0.05%/ngày trên số dư. Quá hạn 30 ngày sẽ ảnh hưởng điểm tín dụng CIC.",
  },
]

export default function IntroPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const state = searchParams.get("state") ?? "default"
  const [agreedData, setAgreedData] = React.useState(state === "consented")
  const [agreedTerms, setAgreedTerms] = React.useState(state === "consented")
  const [open, setOpen] = React.useState<number | null>(0)

  const canContinue = agreedData && agreedTerms

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header
        variant="large-title"
        largeTitle="Cách hoạt động"
        description="Đọc kỹ trước khi đăng ký"
        leading={
          <button onClick={() => router.back()} className="p-[10px] min-h-[44px] rounded-full">
            <ChevronLeft size={18} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto pb-[240px]">
        {/* How it works — 3 steps */}
        <div className="px-[22px] pt-[16px]">
          <div className="flex flex-col gap-[16px]">
            {[
              { n: "1", t: "Đăng ký — tái dùng eKYC", d: "Bổ sung thu nhập + nghề nghiệp. Hệ thống duyệt trong vài giây." },
              { n: "2", t: "Mua & chọn kỳ", d: "Tại bước thanh toán, chọn Ví trả sau và kỳ 1/3/6/12 tháng." },
              { n: "3", t: "Trả theo lịch", d: "Auto debit từ Ví mỗi kỳ hoặc trả tay. Thông báo 3 ngày trước hạn." },
            ].map((s) => (
              <div key={s.n} className="flex gap-[14px]">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-foreground">{s.n}</span>
                </div>
                <div className="flex-1 pt-[2px]">
                  <p className="text-md font-semibold leading-6 text-foreground">{s.t}</p>
                  <p className="text-sm leading-5 text-foreground-secondary mt-[2px]">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ accordion */}
        <div className="pt-[32px]">
          <div className="px-[22px] pt-[24px] pb-[12px]">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
              Câu hỏi thường gặp
            </p>
          </div>
          <div className="px-[22px] flex flex-col">
            {FAQS.map((f, i) => (
              <div key={i} className="border-b border-border">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between py-[16px] text-left"
                >
                  <span className="text-md font-semibold leading-6 text-foreground pr-[12px]">{f.q}</span>
                  <ChevronDown
                    size={20}
                    className={`text-foreground-secondary shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
                  />
                </button>
                {open === i && (
                  <p className="text-sm leading-5 text-foreground-secondary pb-[16px] pr-[32px]">
                    {f.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Consent checkboxes */}
        <div className="pt-[24px] px-[22px] flex flex-col gap-[12px]">
          <Terms withCheckbox checked={agreedData} onChange={setAgreedData}>
            Tôi đồng ý cho V-Smart Pay chia sẻ <a href="#">dữ liệu cá nhân</a> với đối tác cấp tín dụng để phục vụ việc thẩm định.
          </Terms>
          <Terms withCheckbox checked={agreedTerms} onChange={setAgreedTerms}>
            Tôi đã đọc và đồng ý với <a href="#">Điều khoản dịch vụ Ví trả sau</a>.
          </Terms>
        </div>
      </div>

      <FixedBottom>
        <Button
          variant="primary"
          size="48"
          className="w-full"
          disabled={!canContinue}
          onClick={() => router.push("/bnpl/info")}
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
