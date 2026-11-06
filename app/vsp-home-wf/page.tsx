import type { LucideIcon } from "lucide-react"
import {
  ArrowDownUp,
  ArrowDownToLine,
  Bell,
  Check,
  ChevronRight,
  Circle,
  CircleUser,
  Clock,
  Eye,
  Grid2x2,
  History,
  Home as HomeIcon,
  QrCode,
  Receipt,
  ScanLine,
  Send,
  Smartphone,
  Square,
} from "lucide-react"
import { Button } from "@/components/ui/button"

/* Lo-fi wireframe v2 — áp layout per-block đã chốt: dark zone + white sheet,
   typography hero (bỏ thẻ vật lý), action straddle, 6 slots. Grayscale, chưa có visual. */

type Tile = { icon: LucideIcon; label: string }
type MoneyRowData = { label: string; value: string; note?: string }
type Offer = { title: string; body: string; cta: string }
type Txn = { name: string; sub: string; amount: string }

const CURRENT_SERVICES: Tile[] = [
  { icon: Receipt, label: "Hóa đơn" },
  { icon: Smartphone, label: "Nạp ĐT" },
]

const SCALED_SERVICES: Tile[] = [
  ...CURRENT_SERVICES,
  { icon: Square, label: "Điện" },
  { icon: Square, label: "Nước" },
  { icon: Square, label: "Internet" },
  { icon: Square, label: "Nhà ở" },
  { icon: Square, label: "Bảo hiểm" },
  { icon: Grid2x2, label: "Tất cả" },
]

/* Block 2 — 3 action, "Thanh toán" bỏ vì QR giữa tab bar đã đảm nhiệm */
const MONEY_ACTIONS: Tile[] = [
  { icon: ArrowDownUp, label: "Nạp / Rút" },
  { icon: Send, label: "Chuyển" },
  { icon: ArrowDownToLine, label: "Nhận tiền" },
]

const WALLET: MoneyRowData = { label: "Số dư V-Smart Pay", value: "2.328.000₫" }
const EARN: MoneyRowData = { label: "Sinh lời tự động", value: "12.500.000₫", note: "+3.120₫ hôm qua" }
const LOAN: MoneyRowData = { label: "Vay nhanh", value: "30.000.000₫", note: "Hạn mức khả dụng" }
const PAY_LATER: MoneyRowData = { label: "Trả sau", value: "5.000.000₫", note: "Hạn mức khả dụng" }

const OFFER_EARN: Offer = { title: "Sinh lời tự động", body: "Tiền nhàn rỗi có lãi mỗi ngày", cta: "Kích hoạt" }
const OFFER_LOAN: Offer = { title: "Vay nhanh", body: "Xem hạn mức của bạn", cta: "Xem" }
const OFFER_INSURE: Offer = { title: "Bảo hiểm", body: "Bảo vệ khoản tiền của bạn", cta: "Xem" }

const TXNS: Txn[] = [
  { name: "Công ty Điện lực HN", sub: "Hóa đơn điện · 10:32", amount: "-380.000₫" },
  { name: "Hồ Thị Minh Anh", sub: "Chuyển tiền · Hôm qua", amount: "-100.000₫" },
]

function SectionTitle({ children, action }: { children: React.ReactNode; action?: string }) {
  return (
    <div className="flex items-baseline justify-between px-[22px] pt-[24px] pb-[12px]">
      <h2 className="text-[18px] leading-[24px] font-semibold text-foreground">{children}</h2>
      {action && <span className="text-[14px] leading-[20px] text-foreground-secondary">{action}</span>}
    </div>
  )
}

function MoneyRow({ label, value, note }: MoneyRowData) {
  return (
    <button type="button" className="flex w-full items-center justify-between py-[12px] text-inherit">
      <span className="flex flex-col items-start">
        <span className="text-[15px] leading-[20px]">{label}</span>
        {note && <span className="text-[13px] leading-[18px] opacity-60">{note}</span>}
      </span>
      <span className="flex items-center gap-[4px] text-[15px] leading-[20px] font-semibold">
        {value}
        <ChevronRight className="size-[16px] opacity-60" aria-hidden />
      </span>
    </button>
  )
}

/* Slot 3 — user mới: checklist kích hoạt (pattern Figma 17/12 + Sumeria First step) */
function Checklist() {
  return (
    <>
      <SectionTitle>Bắt đầu với V-Smart Pay</SectionTitle>
      <div className="flex flex-col gap-[16px] px-[22px]">
        <div className="flex items-center gap-[12px]">
          <Check className="size-[20px] text-foreground" aria-hidden />
          <div className="flex-1">
            <p className="text-[15px] leading-[20px] font-semibold text-foreground line-through opacity-60">
              Tạo tài khoản
            </p>
          </div>
        </div>
        <div className="flex items-center gap-[12px]">
          <Circle className="size-[20px] text-foreground-secondary" aria-hidden />
          <div className="flex-1">
            <p className="text-[15px] leading-[20px] font-semibold text-foreground">Xác thực Căn cước / CCCD</p>
            <p className="text-[13px] leading-[18px] text-foreground-secondary">Để bắt đầu sử dụng ví</p>
          </div>
          <Button size="32" variant="primary">
            Xác thực
          </Button>
        </div>
        <div className="flex items-center gap-[12px]">
          <Circle className="size-[20px] text-foreground-secondary" aria-hidden />
          <div className="flex-1">
            <p className="text-[15px] leading-[20px] font-semibold text-foreground">Nạp tiền lần đầu</p>
            <p className="text-[13px] leading-[18px] text-foreground-secondary">Từ ngân hàng liên kết</p>
          </div>
        </div>
      </div>
    </>
  )
}

/* Slot 3 — user cũ: việc đang chờ, tối đa 3 dòng theo deadline */
function Reminder() {
  return (
    <>
      <SectionTitle>Cần xử lý</SectionTitle>
      <div className="flex items-center justify-between gap-[12px] px-[22px]">
        <div>
          <p className="text-[15px] leading-[20px] font-semibold text-foreground">Hóa đơn điện đến hạn 15/11</p>
          <p className="text-[14px] leading-[20px] text-foreground-secondary">EVN Hà Nội · 380.000₫</p>
        </div>
        <Button size="32" variant="secondary">
          Trả
        </Button>
      </div>
    </>
  )
}

function IconTile({ icon: Icon, label }: Tile) {
  return (
    <button type="button" className="flex flex-col items-center gap-[8px]">
      <span className="flex size-[52px] items-center justify-center rounded-14 bg-secondary">
        <Icon className="size-[22px] text-foreground" aria-hidden />
      </span>
      <span className="text-[13px] leading-[18px] text-foreground">{label}</span>
    </button>
  )
}

/* Slot 5 — Giao dịch gần đây, 2 dòng + Tất cả → tab Giao dịch */
function Transactions({ txns }: { txns: Txn[] }) {
  return (
    <>
      <SectionTitle action={txns.length > 0 ? "Tất cả" : undefined}>Giao dịch gần đây</SectionTitle>
      {txns.length === 0 ? (
        <div className="flex flex-col items-center gap-[8px] px-[22px] py-[16px]">
          <Clock className="size-[40px] text-foreground-secondary opacity-40" aria-hidden />
          <p className="text-[13px] leading-[18px] text-foreground-secondary">Chưa có giao dịch nào</p>
        </div>
      ) : (
        <div className="flex flex-col gap-[16px] px-[22px]">
          {txns.map((txn) => (
            <div key={txn.name} className="flex items-center justify-between gap-[12px]">
              <div>
                <p className="text-[15px] leading-[20px] font-semibold text-foreground">{txn.name}</p>
                <p className="text-[13px] leading-[18px] text-foreground-secondary">{txn.sub}</p>
              </div>
              <p className="text-[15px] leading-[20px] font-semibold text-foreground">{txn.amount}</p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

/* Slot 6 — khuôn card Figma: title + desc + CTA + visual phải; mọi sản phẩm cùng khuôn */
function ForYou({ offers }: { offers: Offer[] }) {
  return (
    <>
      <SectionTitle>Dành cho bạn</SectionTitle>
      <div className="flex flex-col gap-[12px] px-[22px]">
        {offers.map((offer) => (
          <div key={offer.title} className="flex items-center gap-[16px] rounded-28 bg-secondary p-[22px]">
            <div className="flex flex-1 flex-col items-start gap-[12px]">
              <div>
                <p className="text-[16px] leading-[22px] font-semibold text-foreground">{offer.title}</p>
                <p className="text-[14px] leading-[20px] text-foreground-secondary">{offer.body}</p>
              </div>
              <Button size="32" variant="secondary">
                {offer.cta}
              </Button>
            </div>
            <span className="size-[64px] shrink-0 rounded-14 bg-background" aria-hidden />
          </div>
        ))}
        {offers.length > 1 && (
          <div className="flex justify-center gap-[6px] pt-[4px]">
            <span className="size-[6px] rounded-full bg-foreground" />
            <span className="size-[6px] rounded-full bg-foreground opacity-20" />
          </div>
        )}
      </div>
    </>
  )
}

function TabBar() {
  return (
    <nav className="mt-[24px] bg-secondary">
      <div className="grid grid-cols-5 items-end pt-[8px]">
        <span className="flex flex-col items-center gap-[4px] text-[11px] leading-[14px] font-semibold text-foreground">
          <HomeIcon className="size-[22px]" aria-hidden />
          Trang chủ
        </span>
        <span className="flex flex-col items-center gap-[4px] text-[11px] leading-[14px] text-foreground-secondary">
          <Grid2x2 className="size-[22px]" aria-hidden />
          Dịch vụ
        </span>
        {/* QR giữa, nổi — kế thừa "QR đỏ" của Figma nhưng dời từ góc phải vào giữa */}
        <span className="flex flex-col items-center gap-[4px] text-[11px] leading-[14px] text-foreground">
          <span className="-mt-[24px] flex size-[52px] items-center justify-center rounded-full bg-foreground">
            <QrCode className="size-[24px] text-background" aria-hidden />
          </span>
          QR
        </span>
        <span className="flex flex-col items-center gap-[4px] text-[11px] leading-[14px] text-foreground-secondary">
          <History className="size-[22px]" aria-hidden />
          Giao dịch
        </span>
        <span className="flex flex-col items-center gap-[4px] text-[11px] leading-[14px] text-foreground-secondary">
          <CircleUser className="size-[22px]" aria-hidden />
          Tài khoản
        </span>
      </div>
      <div className="flex h-[34px] items-center justify-center">
        <span className="h-[5px] w-[139px] rounded-full bg-foreground" />
      </div>
    </nav>
  )
}

function Phone({
  caption,
  total,
  money = [],
  credit = [],
  checklist = false,
  reminder = false,
  services,
  txns,
  offers,
}: {
  caption: string
  total: string
  money?: MoneyRowData[]
  credit?: MoneyRowData[]
  checklist?: boolean
  reminder?: boolean
  services: Tile[]
  txns: Txn[]
  offers: Offer[]
}) {
  return (
    <section className="w-[390px] shrink-0">
      <p className="pb-[12px] text-[14px] leading-[20px] font-semibold text-foreground">{caption}</p>
      <div className="relative overflow-hidden rounded-28 bg-background">
        {/* Giới hạn màn hình đầu tiên của iPhone 390×844 trừ vùng tab 83px */}
        <div className="pointer-events-none absolute inset-x-0 top-[761px] z-10 border-t border-dashed border-border-bold" />

        {/* ── Dark zone: header + Slot 1 (Tiền của tôi) ── */}
        <div className="bg-foreground pb-[80px] text-background">
          <div className="flex h-[54px] items-center px-[22px] text-[15px] font-semibold">9:41</div>
          <header className="flex h-[56px] items-center justify-between px-[22px]">
            <p className="text-[16px] leading-[22px] font-semibold">Xin chào, Huy</p>
            <Bell className="size-[22px]" aria-hidden />
          </header>

          <div className="px-[22px] pt-[4px]">
            <div className="flex items-center gap-[8px] text-[14px] leading-[20px] opacity-60">
              Tổng tiền của bạn
              <Eye className="size-[16px]" aria-hidden />
            </div>
            <p className="pt-[4px] pb-[4px] text-[40px] leading-[48px] font-bold">{total}</p>
            {money.map((row) => (
              <MoneyRow key={row.label} {...row} />
            ))}
            {credit.length > 0 && (
              <p className="pt-[8px] text-[13px] leading-[18px] opacity-60">Hạn mức, không tính vào tổng</p>
            )}
            {credit.map((row) => (
              <MoneyRow key={row.label} {...row} />
            ))}
          </div>
        </div>

        {/* ── White sheet, bo góc đè lên dark zone ── */}
        <div className="relative -mt-[28px] rounded-t-28 bg-background">
          {/* Slot 2: action cưỡi mép sheet — nửa trên nền tối */}
          <div className="flex -translate-y-[36px] justify-center gap-[36px] px-[22px]">
            {MONEY_ACTIONS.map(({ icon: Icon, label }) => (
              <button key={label} type="button" className="flex w-[72px] flex-col items-center gap-[8px]">
                <span className="flex size-[56px] items-center justify-center rounded-full border border-border bg-background">
                  <Icon className="size-[22px] text-foreground" aria-hidden />
                </span>
                <span className="text-[13px] leading-[18px] text-foreground">{label}</span>
              </button>
            ))}
          </div>

          <div className="-mt-[20px]">
            {/* Slot 3: việc đang chờ / checklist kích hoạt */}
            {checklist && <Checklist />}
            {reminder && <Reminder />}

            {/* Slot 4: Dịch vụ — grid 4 cột, Tất cả → tab Dịch vụ */}
            <SectionTitle>Dịch vụ</SectionTitle>
            <div className="grid grid-cols-4 gap-y-[16px] px-[22px]">
              {services.map((service) => (
                <IconTile key={service.label} {...service} />
              ))}
            </div>

            {/* Slot 5: Giao dịch gần đây */}
            <Transactions txns={txns} />

            {/* Slot 6: Dành cho bạn — khuôn chung, bán ngang nhau */}
            <ForYou offers={offers} />
          </div>

          <TabBar />
        </div>
      </div>
    </section>
  )
}

export default function VspHomeWireframePage() {
  return (
    <main className="min-h-screen bg-secondary p-[32px]">
      <p className="pb-[24px] text-[14px] leading-[20px] text-foreground-secondary">
        Wireframe Home V-Smart Pay v2 — layout per-block theo Figma 17/12 + slot structure. Grayscale, chưa có visual
        direction. Đường nét đứt là giới hạn màn hình đầu tiên. Số liệu là mẫu.
      </p>
      <div className="flex items-start gap-[32px] overflow-x-auto">
        <Phone
          caption="A. User mới: checklist kích hoạt, chưa có giao dịch"
          total="0₫"
          checklist
          services={CURRENT_SERVICES}
          txns={[]}
          offers={[OFFER_EARN, OFFER_LOAN]}
        />
        <Phone
          caption="B. Đang dùng: Sinh lời đã lên khối tiền, có lời nhắc"
          total="14.828.000₫"
          money={[WALLET, EARN]}
          reminder
          services={CURRENT_SERVICES}
          txns={TXNS}
          offers={[OFFER_LOAN]}
        />
        <Phone
          caption="C. Tương lai: hạn mức + 8 dịch vụ"
          total="14.828.000₫"
          money={[WALLET, EARN]}
          credit={[LOAN, PAY_LATER]}
          reminder
          services={SCALED_SERVICES}
          txns={TXNS}
          offers={[OFFER_INSURE]}
        />
      </div>
    </main>
  )
}
