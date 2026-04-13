const punctuationRules = [
  {
    rule: 'Không dùng dấu chấm cuối button label',
    doExample: 'Xác nhận',
    dontExample: 'Xác nhận.',
  },
  {
    rule: 'Không dùng dấu chấm than quá mức — tối đa 1 lần trong 1 màn hình',
    doExample: 'Chuyển tiền thành công!',
    dontExample: 'Tuyệt vời!! Bạn đã chuyển tiền thành công!!!',
  },
  {
    rule: 'Dùng dấu phẩy và dấu chấm đúng tiếng Việt — không dùng dấu 3 chấm tùy tiện',
    doExample: 'Vui lòng thử lại sau.',
    dontExample: 'Vui lòng thử lại sau...',
  },
  {
    rule: 'Ngoặc kép dùng cho thuật ngữ, trích dẫn — không dùng cho nhấn mạnh',
    doExample: 'Tính năng Sinh lời giúp tối ưu lãi suất',
    dontExample: 'Tính năng "Sinh lời" giúp "tối ưu" lãi suất',
  },
]

const numberFormatting = [
  {
    type: 'VND Currency',
    format: '1.000.000đ',
    note: 'Dùng dấu chấm phân cách hàng nghìn, hậu tố "đ". Không dùng "VND" trong UI ngắn gọn.',
  },
  {
    type: 'VND Currency (formal)',
    format: '1.000.000 VND',
    note: 'Dùng trong biên lai, xác nhận giao dịch, tài liệu chính thức.',
  },
  {
    type: 'Percentage',
    format: '8,5%',
    note: 'Dùng dấu phẩy thập phân theo chuẩn tiếng Việt.',
  },
  {
    type: 'Date',
    format: 'dd/mm/yyyy',
    note: 'Ví dụ: 15/03/2026. Luôn dùng format này, không dùng mm/dd/yyyy.',
  },
  {
    type: 'Date (short)',
    format: 'dd/mm',
    note: 'Dùng khi năm đã rõ ngữ cảnh (lịch sử giao dịch trong năm).',
  },
  {
    type: 'Time',
    format: 'HH:mm',
    note: 'Dùng 24h format. Ví dụ: 14:30. Không dùng AM/PM.',
  },
  {
    type: 'Phone',
    format: '0912 345 678',
    note: 'Nhóm 4-3-3 với dấu cách. Không dùng dấu chấm hoặc gạch ngang.',
  },
  {
    type: 'Account number',
    format: '1234 5678 9012',
    note: 'Nhóm 4 số, cách bằng dấu cách. Che bớt khi cần: •••• 9012.',
  },
]

const capitalizationRules = [
  'Tên tính năng: viết hoa chữ đầu — "Sinh lời", "Chuyển tiền", "Nạp tiền"',
  'Button label: viết hoa chữ đầu — "Xác nhận", "Hủy giao dịch"',
  'Section title: viết hoa chữ đầu — "Lịch sử giao dịch", "Tài khoản liên kết"',
  'Body text: viết thường bình thường theo quy tắc tiếng Việt',
  'Không VIẾT HOA TOÀN BỘ — trừ mã giao dịch, mã lỗi kỹ thuật',
  'Tên riêng, thương hiệu: giữ nguyên — "V-Smart Pay", "BIDV", "Vietcombank"',
]

const buttonPatterns = [
  {
    pattern: 'Verb + Noun (max 3 words)',
    examples: ['Xác nhận', 'Chuyển tiền', 'Liên kết ngân hàng', 'Nạp tiền'],
  },
  {
    pattern: 'Primary action = positive, specific',
    examples: ['Chuyển 500.000đ', 'Xác nhận giao dịch', 'Mở Sinh lời'],
  },
  {
    pattern: 'Secondary/Cancel = neutral',
    examples: ['Hủy', 'Quay lại', 'Để sau', 'Bỏ qua'],
  },
  {
    pattern: 'Destructive = clear consequence',
    examples: ['Xóa tài khoản', 'Hủy liên kết', 'Đóng Sinh lời'],
  },
]

const fieldLabelRules = [
  {
    rule: 'Required fields: không cần đánh dấu nếu hầu hết field đều required',
    doExample: 'Số tiền',
    dontExample: 'Số tiền *',
  },
  {
    rule: 'Optional fields: ghi rõ "(không bắt buộc)"',
    doExample: 'Nội dung chuyển tiền (không bắt buộc)',
    dontExample: 'Nội dung chuyển tiền (optional)',
  },
  {
    rule: 'Placeholder: gợi ý format, không lặp lại label',
    doExample: 'Placeholder: "0912 345 678"',
    dontExample: 'Placeholder: "Nhập số điện thoại của bạn"',
  },
  {
    rule: 'Helper text: đặt dưới field, mô tả ràng buộc',
    doExample: 'Tối thiểu 10.000đ, tối đa 500.000.000đ',
    dontExample: 'Vui lòng nhập số tiền hợp lệ',
  },
]

export default function WritingGuidelinesPage() {
  return (
    <div className="flex flex-col gap-[48px]">
      {/* Header */}
      <section className="flex flex-col gap-[8px]">
        <h1
          className="text-[32px] font-semibold leading-[40px] tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Writing Guidelines
        </h1>
        <p
          className="max-w-[600px] text-[16px] leading-[24px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          Quy tắc viết nội dung cho V-Smart Pay — format số, ngày tháng, label, placeholder.
        </p>
      </section>

      {/* Punctuation */}
      <section className="flex flex-col gap-[16px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Punctuation Rules
        </h2>
        {punctuationRules.map((r, idx) => (
          <div key={idx} className="flex flex-col gap-[8px]">
            <p
              className="text-[14px] font-medium leading-[22px]"
              style={{ color: 'var(--foreground)' }}
            >
              {r.rule}
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
                  {r.doExample}
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
                  {r.dontExample}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Number Formatting */}
      <section className="flex flex-col gap-[12px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Number &amp; Date Formatting
        </h2>
        <div className="flex flex-col gap-[2px] overflow-hidden rounded-14">
          {numberFormatting.map((n, idx) => (
            <div
              key={idx}
              className="flex items-start gap-[16px] p-[12px]"
              style={{ backgroundColor: 'var(--secondary)' }}
            >
              <div className="w-[140px] shrink-0">
                <p
                  className="text-[13px] font-semibold leading-[20px]"
                  style={{ color: 'var(--foreground)' }}
                >
                  {n.type}
                </p>
              </div>
              <div className="w-[160px] shrink-0">
                <code
                  className="text-[13px] font-medium leading-[20px]"
                  style={{ color: 'var(--foreground)' }}
                >
                  {n.format}
                </code>
              </div>
              <p
                className="text-[13px] leading-[20px]"
                style={{ color: 'var(--foreground-secondary)' }}
              >
                {n.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Capitalization */}
      <section className="flex flex-col gap-[12px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Capitalization Rules
        </h2>
        <div className="flex flex-col gap-[6px]">
          {capitalizationRules.map((rule, idx) => (
            <div key={idx} className="flex items-start gap-[10px]">
              <span
                className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full"
                style={{ backgroundColor: 'var(--foreground-secondary)' }}
              />
              <p
                className="text-[14px] leading-[22px]"
                style={{ color: 'var(--foreground)' }}
              >
                {rule}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Button Label Patterns */}
      <section className="flex flex-col gap-[16px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Button Label Patterns
        </h2>
        {buttonPatterns.map((bp, idx) => (
          <div key={idx} className="flex flex-col gap-[6px]">
            <h3
              className="text-[14px] font-semibold leading-[20px]"
              style={{ color: 'var(--foreground)' }}
            >
              {bp.pattern}
            </h3>
            <div className="flex flex-wrap gap-[8px]">
              {bp.examples.map((ex, i) => (
                <span
                  key={i}
                  className="rounded-full px-[12px] py-[4px] text-[13px] font-medium"
                  style={{
                    backgroundColor: 'var(--secondary)',
                    color: 'var(--foreground)',
                  }}
                >
                  {ex}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Field Labels */}
      <section className="flex flex-col gap-[16px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Field Labels &amp; Placeholders
        </h2>
        {fieldLabelRules.map((r, idx) => (
          <div key={idx} className="flex flex-col gap-[8px]">
            <p
              className="text-[14px] font-medium leading-[22px]"
              style={{ color: 'var(--foreground)' }}
            >
              {r.rule}
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
                  {r.doExample}
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
                  {r.dontExample}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
