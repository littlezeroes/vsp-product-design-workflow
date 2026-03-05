"use client"

import * as React from "react"
import {
  ChevronRight, HelpCircle, ShieldCheck, FileText, Building2, BarChart3, Wallet,
} from "lucide-react"
import { USER } from "../../data"

/* ── FAQ Data ─────────────────────────────────────────────────────── */
const FAQ_CATEGORIES = [
  {
    icon: Building2,
    title: "Về dự án & Token",
    items: [
      { q: "Token bất động sản là gì?", a: "Token bất động sản đại diện cho quyền sở hữu bất động sản thực. Mỗi token có giá trị tương ứng với tài sản bạn sở hữu." },
      { q: "Tôi có quyền gì khi sở hữu token?", a: "Bạn có quyền nhận lợi nhuận theo tỷ lệ sở hữu, quyền biểu quyết trong các quyết định quan trọng, và quyền chuyển nhượng token." },
      { q: "Lợi nhuận được tính như thế nào?", a: "Lợi nhuận bao gồm: thu nhập cho thuê (trả hàng tháng/quý) và chênh lệch giá trị tài sản (khi quyết toán dự án)." },
    ],
  },
  {
    icon: Wallet,
    title: "Đăng ký mua & Thanh toán",
    items: [
      { q: "Đăng ký mua token hoạt động như thế nào?", a: "Bạn chọn số lượng token muốn mua, xác nhận và thanh toán. Số tiền sẽ được tạm giữ cho đến khi đợt mở bán kết thúc và phân bổ." },
      { q: "Tại sao tôi có thể nhận ít hơn số đã đăng ký?", a: "Nếu nhu cầu mua vượt quá số token phát hành (oversubscribed), hệ thống sẽ phân bổ theo tỷ lệ. Phần tiền thừa sẽ được hoàn trả tự động." },
      { q: "Tôi có thể đăng ký nhiều lần không?", a: "Có. Bạn có thể đăng ký thêm bất cứ lúc nào trong thời gian đợt mở bán còn hoạt động." },
    ],
  },
  {
    icon: BarChart3,
    title: "Kết quả & Phân bổ",
    items: [
      { q: "Khi nào tôi nhận được kết quả phân bổ?", a: "Sau khi đợt mở bán kết thúc, hệ thống sẽ tính toán phân bổ trong 1-3 ngày. Bạn sẽ nhận thông báo khi có kết quả." },
      { q: "Tiền hoàn trả khi nào về?", a: "Tiền hoàn trả (nếu có) sẽ tự động chuyển về ví VSP của bạn cùng lúc với kết quả phân bổ." },
    ],
  },
  {
    icon: ShieldCheck,
    title: "Bảo mật & Xác minh",
    items: [
      { q: "Tài sản của tôi có an toàn không?", a: "Token được phát hành trên blockchain, lưu trữ bởi Fireblocks (tiêu chuẩn quốc tế). Danh tính được xác minh qua eKYC cấp 2." },
      { q: "Tôi cần xác minh gì để đầu tư?", a: "Bạn cần hoàn tất eKYC cấp 2 (CCCD/Hộ chiếu + selfie) và kết nối ví VSP. Quá trình mất khoảng 5 phút." },
    ],
  },
]

/* ── FAQ Item ──────────────────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false)

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className="w-full text-left py-[14px] border-b border-border"
    >
      <div className="flex items-start gap-[10px]">
        <HelpCircle size={16} className="text-foreground-secondary shrink-0 mt-[2px]" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{q}</p>
          {open && (
            <p className="text-sm text-foreground-secondary mt-[8px] leading-relaxed">{a}</p>
          )}
        </div>
        <ChevronRight
          size={16}
          className={`text-foreground-secondary shrink-0 mt-[2px] transition-transform ${open ? "rotate-90" : ""}`}
        />
      </div>
    </button>
  )
}

/* ── Page ──────────────────────────────────────────────────────────── */
export default function AccountTabPage() {
  return (
    <div>
      {/* Avatar + Name */}
      <div className="flex items-center gap-[14px] px-[22px] pt-[8px] pb-[20px]">
        <div className="w-[52px] h-[52px] rounded-full bg-foreground flex items-center justify-center shrink-0">
          <span className="text-[20px] font-bold text-background">{USER.name.charAt(0)}</span>
        </div>
        <div>
          <p className="text-md font-bold text-foreground">{USER.name}</p>
          <p className="text-xs text-foreground-secondary mt-[1px]">{USER.phone}</p>
        </div>
      </div>

      {/* ── FAQ Section ──────────────────────────────────────────── */}
      <div className="pt-[32px]">
        <div className="px-[22px]">
          <p className="text-[11px] font-bold text-foreground-secondary uppercase tracking-wide">Hỏi đáp</p>
          <p className="text-xs text-foreground-secondary mt-[4px]">
            Câu hỏi thường gặp về đầu tư bất động sản mã hóa
          </p>
        </div>

        {FAQ_CATEGORIES.map((cat, i) => {
          const Icon = cat.icon
          return (
            <div key={i} className="pt-[20px]">
              <div className="px-[22px] flex items-center gap-[8px] mb-[4px]">
                <Icon size={16} className="text-foreground" />
                <p className="text-sm font-bold text-foreground">{cat.title}</p>
              </div>
              <div className="px-[22px]">
                {cat.items.map((item, j) => (
                  <FaqItem key={j} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          )
        })}

        {/* Contact support */}
        <div className="px-[22px] pt-[32px] pb-[16px]">
          <div className="bg-secondary rounded-[28px] px-[20px] py-[18px] text-center">
            <p className="text-sm font-semibold text-foreground">Không tìm thấy câu trả lời?</p>
            <p className="text-xs text-foreground-secondary mt-[4px]">
              Liên hệ hỗ trợ qua VPay · Hàng ngày 8:00 – 22:00
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
