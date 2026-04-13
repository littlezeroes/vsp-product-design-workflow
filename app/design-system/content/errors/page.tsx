const errorPrinciples = [
  'Nói rõ chuyện gì xảy ra — không dùng mã lỗi kỹ thuật',
  'Hướng dẫn bước tiếp theo — luôn có action cụ thể',
  'Không đổ lỗi cho người dùng — dù lỗi do họ gây ra',
  'Không đùa cợt về lỗi — đặc biệt lỗi liên quan đến tiền',
  'Ngắn gọn — không giải thích dài dòng, không xin lỗi quá mức',
  'Giọng điệu empathetic — thể hiện VSP hiểu và đang giúp xử lý',
]

const errorTypes = [
  {
    type: 'Validation Errors',
    description: 'Lỗi nhập liệu — người dùng cần sửa thông tin',
    rules: [
      'Chỉ ra chính xác field nào sai',
      'Nêu rõ yêu cầu (min/max, format)',
      'Hiển thị inline ngay dưới field, không dùng toast',
      'Giữ lại dữ liệu đã nhập, không xóa form',
    ],
    examples: [
      {
        doExample: 'Số tiền tối thiểu là 10.000đ',
        dontExample: 'Số tiền không hợp lệ',
      },
      {
        doExample: 'Số điện thoại cần 10 chữ số',
        dontExample: 'Lỗi: sai định dạng',
      },
      {
        doExample: 'Số dư không đủ. Số dư hiện tại: 50.000đ',
        dontExample: 'Không thể thực hiện giao dịch',
      },
    ],
  },
  {
    type: 'Network Errors',
    description: 'Mất kết nối hoặc timeout',
    rules: [
      'Xin lỗi ngắn gọn — lỗi không phải do người dùng',
      'Cung cấp nút Thử lại',
      'Nếu offline kéo dài, gợi ý kiểm tra kết nối',
      'Không mất dữ liệu đã nhập khi retry',
    ],
    examples: [
      {
        doExample: 'Không thể kết nối. Vui lòng thử lại.',
        dontExample: 'Network Error: Connection timeout',
      },
      {
        doExample: 'Kiểm tra kết nối internet và thử lại',
        dontExample: 'Lỗi kết nối mạng. Mã lỗi: NET_ERR_001',
      },
    ],
  },
  {
    type: 'System Errors',
    description: 'Lỗi server, service unavailable',
    rules: [
      'Thừa nhận vấn đề — "Hệ thống đang gặp sự cố"',
      'Đưa ra bước tiếp theo rõ ràng',
      'Nếu có thời gian khắc phục ước tính, thông báo',
      'Cung cấp kênh liên hệ hỗ trợ nếu quan trọng',
    ],
    examples: [
      {
        doExample: 'Hệ thống đang bảo trì. Vui lòng quay lại sau 30 phút.',
        dontExample: 'Error 500: Internal Server Error',
      },
      {
        doExample: 'Không thể xử lý yêu cầu lúc này. Thử lại sau hoặc liên hệ 1900-xxxx.',
        dontExample: 'Đã xảy ra lỗi không xác định. Vui lòng thao tác lại.',
      },
    ],
  },
  {
    type: 'Permission / Auth Errors',
    description: 'Hết phiên, chưa xác thực, không đủ quyền',
    rules: [
      'Giải thích lý do — "Phiên đăng nhập đã hết hạn"',
      'Hướng dẫn cụ thể — "Đăng nhập lại để tiếp tục"',
      'Không mất ngữ cảnh — quay về đúng trang sau khi đăng nhập lại',
    ],
    examples: [
      {
        doExample: 'Phiên đăng nhập đã hết hạn. Đăng nhập lại để tiếp tục.',
        dontExample: 'Unauthorized. Error 401.',
      },
      {
        doExample: 'Bạn cần xác thực eKYC để sử dụng tính năng này',
        dontExample: 'Không có quyền truy cập',
      },
    ],
  },
  {
    type: 'Transaction Errors',
    description: 'Giao dịch thất bại, bị từ chối',
    rules: [
      'Nêu rõ trạng thái giao dịch (thất bại / đang xử lý / hoàn tiền)',
      'Nếu tiền đã trừ, cam kết hoàn trả và nêu thời gian',
      'Cung cấp mã giao dịch để tra cứu',
      'Luôn có nút liên hệ hỗ trợ',
    ],
    examples: [
      {
        doExample: 'Giao dịch thất bại. Số tiền sẽ được hoàn trong 1-3 ngày làm việc. Mã GD: VSP2026041300001',
        dontExample: 'Giao dịch lỗi. Vui lòng thử lại.',
      },
      {
        doExample: 'Ngân hàng từ chối giao dịch. Liên hệ ngân hàng để biết thêm chi tiết.',
        dontExample: 'Transaction declined by bank',
      },
    ],
  },
]

const absoluteDonts = [
  'Không dùng mã lỗi kỹ thuật trong UI — Error 500, NET_ERR, TIMEOUT_001',
  'Không đổ lỗi người dùng — "Bạn đã nhập sai" → "Số điện thoại cần 10 chữ số"',
  'Không đùa cợt — "Oops! Có gì đó sai sai 😅" → "Không thể xử lý. Thử lại."',
  'Không dùng ngôn ngữ mơ hồ — "Đã xảy ra lỗi" → "Không thể kết nối với ngân hàng"',
  'Không dùng ALL CAPS — "LỖI!" → "Giao dịch thất bại"',
  'Không xin lỗi quá mức — "Chúng tôi vô cùng xin lỗi vì sự bất tiện này" → "Vui lòng thử lại sau."',
]

export default function ErrorMessagesPage() {
  return (
    <div className="flex flex-col gap-[48px]">
      {/* Header */}
      <section className="flex flex-col gap-[8px]">
        <h1
          className="text-[32px] font-semibold leading-[40px] tracking-tight"
          style={{ color: 'var(--foreground)' }}
        >
          Error Messages
        </h1>
        <p
          className="max-w-[600px] text-[16px] leading-[24px]"
          style={{ color: 'var(--foreground-secondary)' }}
        >
          Hướng dẫn viết thông báo lỗi cho V-Smart Pay — cụ thể, thân thiện, có hướng giải quyết.
        </p>
      </section>

      {/* Core Principles */}
      <section className="flex flex-col gap-[12px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Core Principles
        </h2>
        <div className="flex flex-col gap-[6px]">
          {errorPrinciples.map((p, idx) => (
            <div key={idx} className="flex items-start gap-[10px]">
              <span
                className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full"
                style={{ backgroundColor: 'var(--foreground-secondary)' }}
              />
              <p
                className="text-[14px] leading-[22px]"
                style={{ color: 'var(--foreground)' }}
              >
                {p}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Error Types */}
      {errorTypes.map((et, idx) => (
        <section key={idx} className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[4px]">
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
              <h2
                className="text-[20px] font-semibold leading-[24px]"
                style={{ color: 'var(--foreground)' }}
              >
                {et.type}
              </h2>
            </div>
            <p
              className="pl-[28px] text-[14px] leading-[22px]"
              style={{ color: 'var(--foreground-secondary)' }}
            >
              {et.description}
            </p>
          </div>

          {/* Rules */}
          <div className="flex flex-col gap-[4px] pl-[28px]">
            {et.rules.map((rule, rIdx) => (
              <div key={rIdx} className="flex items-start gap-[8px]">
                <span
                  className="mt-[7px] h-[4px] w-[4px] shrink-0 rounded-full"
                  style={{ backgroundColor: 'var(--foreground-secondary)' }}
                />
                <p
                  className="text-[13px] leading-[20px]"
                  style={{ color: 'var(--foreground)' }}
                >
                  {rule}
                </p>
              </div>
            ))}
          </div>

          {/* Examples */}
          <div className="flex flex-col gap-[12px] pl-[28px]">
            {et.examples.map((ex, eIdx) => (
              <div key={eIdx} className="flex gap-[16px]">
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
                    {ex.doExample}
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
                    {ex.dontExample}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Absolute Don'ts */}
      <section className="flex flex-col gap-[12px]">
        <h2
          className="text-[20px] font-semibold leading-[24px]"
          style={{ color: 'var(--foreground)' }}
        >
          Absolute Don&apos;ts
        </h2>
        <div className="flex flex-col gap-[6px]">
          {absoluteDonts.map((d, idx) => (
            <div key={idx} className="flex items-start gap-[10px]">
              <span
                className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full"
                style={{ backgroundColor: 'var(--destructive)' }}
              />
              <p
                className="text-[14px] leading-[22px]"
                style={{ color: 'var(--foreground)' }}
              >
                {d}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
