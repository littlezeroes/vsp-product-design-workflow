const brandPersonality = [
  {
    trait: 'Trustworthy',
    description: 'VSP là ví điện tử — nơi người dùng gửi gắm tiền bạc. Mọi từ ngữ đều phải tạo cảm giác an toàn, minh bạch.',
  },
  {
    trait: 'Modern',
    description: 'Ngôn ngữ hiện đại, gần gũi với người dùng trẻ nhưng không quá trending hay thiếu chuyên nghiệp.',
  },
  {
    trait: 'Friendly',
    description: 'Thân thiện nhưng không suồng sã. Như một người bạn hiểu biết về tài chính, luôn sẵn sàng hỗ trợ.',
  },
  {
    trait: 'Professional',
    description: 'Fintech đòi hỏi sự chính xác. Không đùa cợt về tiền bạc, không mơ hồ về số liệu.',
  },
]

const fiveCPrinciples = [
  {
    letter: 'C',
    name: 'Clear',
    description: 'Rõ ràng, không mơ hồ. Người dùng không bao giờ phải đoán ý nghĩa.',
    doExample: 'Chuyển 500.000đ đến Nguyễn Văn A?',
    dontExample: 'Bạn có chắc muốn thực hiện thao tác này?',
  },
  {
    letter: 'C',
    name: 'Concise',
    description: 'Ngắn gọn, đủ ý. Cắt bỏ mọi từ thừa.',
    doExample: 'Xác nhận giao dịch',
    dontExample: 'Vui lòng xác nhận để hoàn tất quá trình thực hiện giao dịch của bạn',
  },
  {
    letter: 'C',
    name: 'Calling to action',
    description: 'Luôn có hướng dẫn rõ ràng cho bước tiếp theo.',
    doExample: 'Liên kết ngân hàng để nạp tiền',
    dontExample: 'Bạn chưa có tài khoản ngân hàng liên kết',
  },
  {
    letter: 'C',
    name: 'Consistent',
    description: 'Cùng một hành động, cùng một cách diễn đạt. Không dùng "hủy" ở trang này, "bỏ qua" ở trang khác cho cùng một tác vụ.',
    doExample: 'Luôn dùng "Xác nhận" cho mọi confirmation button',
    dontExample: 'Lúc "Xác nhận", lúc "Đồng ý", lúc "OK"',
  },
  {
    letter: 'C',
    name: 'Conversational',
    description: 'Tự nhiên như đang nói chuyện. Không cứng nhắc, không kiểu hành chính.',
    doExample: 'Giao dịch thành công!',
    dontExample: 'Giao dịch của quý khách đã được xử lý thành công.',
  },
]

const toneDimensions = [
  {
    dimension: 'Formal ↔ Casual',
    position: 'Hơi nghiêng về Casual',
    description: 'Chuyên nghiệp nhưng gần gũi. Dùng "bạn" thay vì "quý khách". Tránh văn phong hành chính.',
  },
  {
    dimension: 'Serious ↔ Playful',
    position: 'Tùy ngữ cảnh',
    description: 'Serious với giao dịch, lỗi hệ thống, bảo mật. Playful được với onboarding, thành tựu, rewards.',
  },
  {
    dimension: 'Respectful ↔ Direct',
    position: 'Hơi nghiêng về Direct',
    description: 'Nói thẳng vào vấn đề. Tôn trọng thời gian người dùng. Không vòng vo.',
  },
  {
    dimension: 'Empathetic ↔ Matter-of-fact',
    position: 'Empathetic khi lỗi, Matter-of-fact khi thông tin',
    description: 'Thể hiện sự thấu hiểu khi người dùng gặp vấn đề. Trình bày số liệu/thông tin một cách khách quan.',
  },
]

const scenarios = [
  {
    name: 'Communicating with user',
    description: 'Thông báo, cập nhật, tin nhắn hệ thống',
    doExample: 'Bạn vừa nhận 1.000.000đ từ Nguyễn Văn A',
    dontExample: 'Hệ thống thông báo: Tài khoản của quý khách vừa được ghi có số tiền 1.000.000 VND',
  },
  {
    name: 'Guiding user',
    description: 'Hướng dẫn thao tác, tooltip, placeholder',
    doExample: 'Nhập số tiền muốn chuyển',
    dontExample: 'Vui lòng điền số tiền mà bạn muốn thực hiện chuyển khoản vào ô bên dưới',
  },
  {
    name: 'User completing action',
    description: 'Khi người dùng hoàn thành một tác vụ',
    doExample: 'Chuyển tiền thành công!',
    dontExample: 'Yêu cầu chuyển tiền của bạn đã được hệ thống xử lý thành công. Cảm ơn bạn đã sử dụng dịch vụ.',
  },
  {
    name: 'Encouraging user',
    description: 'Khuyến khích hành động, upsell, gamification',
    doExample: 'Mở Sinh lời để tiền nhàn rỗi sinh lời mỗi ngày',
    dontExample: 'HÃY THỬ NGAY tính năng mới siêu HOT!!!',
  },
  {
    name: 'User error',
    description: 'Khi người dùng nhập sai hoặc thao tác lỗi',
    doExample: 'Số tiền tối thiểu là 10.000đ',
    dontExample: 'Lỗi: Số tiền không hợp lệ',
  },
  {
    name: 'System error',
    description: 'Khi hệ thống gặp sự cố',
    doExample: 'Không thể kết nối. Vui lòng thử lại.',
    dontExample: 'Lỗi 500: Internal Server Error',
  },
]

export default function ToneOfVoicePage() {
  return (
    <div className="flex flex-col gap-[48px]">
      {/* Header */}
      <section className="flex flex-col gap-[8px]">
        <h1
          className="text-[32px] font-semibold leading-[40px] tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Tone of Voice
        </h1>
        <p
          className="max-w-[600px] text-[16px] leading-[24px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          Hướng dẫn giọng điệu và ngôn ngữ cho V-Smart Pay — ví điện tử fintech hiện đại, đáng tin cậy.
        </p>
      </section>

      {/* Pronouns */}
      <section className="flex flex-col gap-[12px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Pronoun Usage
        </h2>
        <div className="flex flex-col gap-[8px]">
          <div
            className="rounded-14 p-[16px]"
            style={{ backgroundColor: 'var(--secondary)' }}
          >
            <p
              className="text-[14px] font-medium leading-[22px]"
              style={{ color: 'var(--foreground)' }}
            >
              <strong>Xưng hô:</strong> &quot;Chúng tôi&quot; (VSP) vs &quot;Bạn&quot; (người dùng)
            </p>
            <p
              className="mt-[4px] text-[13px] leading-[20px]"
              style={{ color: 'var(--foreground-secondary)' }}
            >
              Không dùng &quot;quý khách&quot;, &quot;quý vị&quot;, &quot;anh/chị&quot;. Giữ ngôi thứ hai thân thiện, nhất quán.
              Trong UI ngắn gọn, có thể bỏ chủ ngữ: &quot;Nhập số tiền&quot; thay vì &quot;Bạn hãy nhập số tiền&quot;.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Personality */}
      <section className="flex flex-col gap-[12px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Brand Personality
        </h2>
        <div className="flex flex-col gap-[16px]">
          {brandPersonality.map((item) => (
            <div key={item.trait} className="flex flex-col gap-[4px]">
              <h3
                className="text-[16px] font-semibold leading-[24px]"
                style={{ color: 'var(--foreground)' }}
              >
                {item.trait}
              </h3>
              <p
                className="text-[14px] leading-[22px]"
                style={{ color: 'var(--foreground-secondary)' }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5C Principles */}
      <section className="flex flex-col gap-[24px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          5C Principles
        </h2>
        {fiveCPrinciples.map((c, idx) => (
          <div key={idx} className="flex flex-col gap-[8px]">
            <div
              className="h-[1px] w-full"
              style={{ backgroundColor: 'var(--border)' }}
            />
            <div className="flex items-baseline gap-[8px]">
              <span
                className="text-[13px] font-medium tabular-nums"
                style={{ color: 'var(--foreground-secondary)' }}
              >
                {String(idx + 1).padStart(2, '0')}
              </span>
              <h3
                className="text-[18px] font-semibold leading-[28px]"
                style={{ color: 'var(--foreground)' }}
              >
                {c.name}
              </h3>
            </div>
            <p
              className="pl-[28px] text-[14px] leading-[22px]"
              style={{ color: 'var(--foreground-secondary)' }}
            >
              {c.description}
            </p>
            <div className="flex gap-[16px] pl-[28px]">
              <div
                className="flex-1 rounded-14 p-[12px]"
                style={{ backgroundColor: 'var(--secondary)' }}
              >
                <span
                  className="text-[12px] font-semibold uppercase"
                  style={{ color: 'var(--epic)' }}
                >
                  Do
                </span>
                <p
                  className="mt-[4px] text-[13px] leading-[20px]"
                  style={{ color: 'var(--foreground)' }}
                >
                  {c.doExample}
                </p>
              </div>
              <div
                className="flex-1 rounded-14 p-[12px]"
                style={{ backgroundColor: 'var(--secondary)' }}
              >
                <span
                  className="text-[12px] font-semibold uppercase"
                  style={{ color: 'var(--destructive)' }}
                >
                  Don&apos;t
                </span>
                <p
                  className="mt-[4px] text-[13px] leading-[20px]"
                  style={{ color: 'var(--foreground)' }}
                >
                  {c.dontExample}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Tone Dimensions */}
      <section className="flex flex-col gap-[16px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Tone Dimensions
        </h2>
        {toneDimensions.map((d, idx) => (
          <div
            key={idx}
            className="rounded-14 p-[16px]"
            style={{ backgroundColor: 'var(--secondary)' }}
          >
            <div className="flex items-baseline justify-between">
              <h3
                className="text-[14px] font-semibold leading-[20px]"
                style={{ color: 'var(--foreground)' }}
              >
                {d.dimension}
              </h3>
              <span
                className="text-[12px] font-medium"
                style={{ color: 'var(--foreground-secondary)' }}
              >
                {d.position}
              </span>
            </div>
            <p
              className="mt-[4px] text-[13px] leading-[20px]"
              style={{ color: 'var(--foreground-secondary)' }}
            >
              {d.description}
            </p>
          </div>
        ))}
      </section>

      {/* Scenarios */}
      <section className="flex flex-col gap-[24px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Scenarios — Do / Don&apos;t
        </h2>
        {scenarios.map((s, idx) => (
          <div key={idx} className="flex flex-col gap-[8px]">
            <div
              className="h-[1px] w-full"
              style={{ backgroundColor: 'var(--border)' }}
            />
            <h3
              className="text-[16px] font-semibold leading-[24px]"
              style={{ color: 'var(--foreground)' }}
            >
              {s.name}
            </h3>
            <p
              className="text-[13px] leading-[20px]"
              style={{ color: 'var(--foreground-secondary)' }}
            >
              {s.description}
            </p>
            <div className="flex gap-[16px]">
              <div
                className="flex-1 rounded-14 p-[12px]"
                style={{ backgroundColor: 'var(--secondary)' }}
              >
                <span
                  className="text-[12px] font-semibold uppercase"
                  style={{ color: 'var(--epic)' }}
                >
                  Do
                </span>
                <p
                  className="mt-[4px] text-[13px] leading-[20px]"
                  style={{ color: 'var(--foreground)' }}
                >
                  {s.doExample}
                </p>
              </div>
              <div
                className="flex-1 rounded-14 p-[12px]"
                style={{ backgroundColor: 'var(--secondary)' }}
              >
                <span
                  className="text-[12px] font-semibold uppercase"
                  style={{ color: 'var(--destructive)' }}
                >
                  Don&apos;t
                </span>
                <p
                  className="mt-[4px] text-[13px] leading-[20px]"
                  style={{ color: 'var(--foreground)' }}
                >
                  {s.dontExample}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
