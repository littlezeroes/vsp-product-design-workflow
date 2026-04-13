"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronDown, Check, X, Lock, Star, UserPlus, Settings, DollarSign, ArrowUpRight, TrendingUp, Shield } from "lucide-react"
import { Header } from "@/components/ui/header"
import { Section } from "@/components/ui/section"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { Toggle } from "@/components/ui/toggle"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Divider } from "@/components/ui/divider"
import {
  MEMBERSHIP_RANKS,
  INTEREST_TIERS,
  CURRENT_TIER_IDX,
  FAQ_DATA,
  MOCK_SETTINGS,
} from "../data"

/* ── FAQ Icon Map ──────────────────────────────────────────────── */
const ICON_MAP: Record<string, React.ReactNode> = {
  "user-plus": <UserPlus size={20} className="text-info" />,
  settings: <Settings size={20} className="text-warning" />,
  "dollar-sign": <DollarSign size={20} className="text-success" />,
  "arrow-up-right": <ArrowUpRight size={20} className="text-danger" />,
  "trending-up": <TrendingUp size={20} className="text-success" />,
  shield: <Shield size={20} className="text-info" />,
}

/* ── Tab 1: Cai dat ───────────────────────────────────────────── */
function TabSettings() {
  const router = useRouter()
  const [autoReceive, setAutoReceive] = React.useState(MOCK_SETTINGS.autoReceive)
  const [payFromBalance, setPayFromBalance] = React.useState(MOCK_SETTINGS.payFromBalance)
  const [showBalance, setShowBalance] = React.useState(MOCK_SETTINGS.showBalance)

  return (
    <div className="flex-1 overflow-y-auto pb-[21px]">
      {/* Section: Tuỳ chỉnh */}
      <div className="pt-[32px] px-[22px]">
        <Section title="TUỲ CHỈNH">
          <ItemList>
            <ItemListItem
              label="Tự động nhận lãi"
              sublabel="Tiền chuyển đến từ bạn bè, QR cá nhân sẽ tự động vào Số dư sinh lời"
              suffix={<Toggle checked={autoReceive} onChange={setAutoReceive} />}
              divider
            />
            <ItemListItem
              label="Ưu tiên thanh toán"
              sublabel="Khi thanh toán, ưu tiên trừ tiền từ Số dư sinh lời trước"
              suffix={<Toggle checked={payFromBalance} onChange={setPayFromBalance} />}
              divider
            />
            <ItemListItem
              label="Ẩn số dư"
              sublabel="Luôn thấy Tiền hiện có và Tiền lời, không cần xác thực"
              suffix={<Toggle checked={showBalance} onChange={setShowBalance} />}
            />
          </ItemList>
        </Section>
      </div>

      {/* Section: Phap ly */}
      <div className="pt-[32px] px-[22px]">
        <Section title="PHÁP LÝ">
          <ItemList>
            <ItemListItem
              label="Điều khoản sử dụng"
              showChevron
              onPress={() => router.push("/sinhloi/terms?doc=policy")}
              divider
            />
            <ItemListItem
              label="Chính sách bảo mật"
              showChevron
              onPress={() => router.push("/sinhloi/terms?doc=policy")}
            />
          </ItemList>
        </Section>
      </div>

      {/* Section: Khác */}
      <div className="pt-[32px] px-[22px]">
        <Section title="KHÁC">
          <ItemList>
            <ItemListItem
              label="Huỷ dịch vụ"
              onPress={() => router.push("/sinhloi/cancel")}
              className="text-danger"
              suffix={
                <span className="text-danger">
                  <ChevronDown size={18} className="-rotate-90" />
                </span>
              }
            />
          </ItemList>
        </Section>
      </div>

      {/* Info note */}
      <div className="pt-[32px] px-[22px]">
        <p className="text-sm text-foreground-secondary">
          Các thay đổi sẽ được áp dụng ngay lập tức. Bạn có thể thay đổi bất kỳ lúc nào.
        </p>
      </div>
    </div>
  )
}

/* ── Tab 2: Hang thanh vien ───────────────────────────────────── */
function TabMembership() {
  const [activeRank, setActiveRank] = React.useState(
    MEMBERSHIP_RANKS.findIndex((r) => r.isCurrent)
  )
  const rank = MEMBERSHIP_RANKS[activeRank]

  return (
    <div className="flex-1 overflow-y-auto pb-[21px]">
      {/* Rank selector pills */}
      <div className="pt-[32px] px-[22px]">
        <div className="flex gap-[8px]">
          {MEMBERSHIP_RANKS.map((r, idx) => (
            <Button
              key={r.id}
              variant={activeRank === idx ? "primary" : "secondary"}
              size="32"
              className="flex-1"
              onClick={() => setActiveRank(idx)}
            >
              {r.name}
              {r.isCurrent && " *"}
            </Button>
          ))}
        </div>
      </div>

      {/* Current tier display */}
      <div className="pt-[32px] px-[22px]">
        <Section>
          <div className="flex items-center gap-[12px] mb-[16px]">
            <div className="w-11 h-11 rounded-full bg-background flex items-center justify-center">
              <Star size={22} className="text-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-[8px]">
                <p className="text-lg font-bold text-foreground">{rank.name}</p>
                {rank.isCurrent && <Badge variant="success">Hien tai</Badge>}
              </div>
            </div>
          </div>

          <Divider className="mb-[12px]" />

          {/* Benefits list */}
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary mb-[12px]">
            QUYỀN LỢI
          </p>
          <ItemList>
            {rank.benefits.map((b, i) => (
              <ItemListItem
                key={i}
                label={b.text}
                prefix={
                  b.available ? (
                    <Check size={18} className="text-success" />
                  ) : (
                    <X size={18} className="text-foreground-secondary" />
                  )
                }
                divider={i < rank.benefits.length - 1}
              />
            ))}
          </ItemList>
        </Section>
      </div>

      {/* Upgrade path: progress bar */}
      <div className="pt-[32px] px-[22px]">
        <Section title="NÂNG CẤP LÃI SUẤT">
          <div className="flex items-center gap-[4px] mb-[16px]">
            {INTEREST_TIERS.map((tier, idx) => (
              <div key={tier.rate} className="flex-1 flex flex-col items-center gap-[6px]">
                <div
                  className={`w-full h-[6px] rounded-full ${
                    idx <= CURRENT_TIER_IDX ? "bg-success" : "bg-border"
                  }`}
                />
                <div className="flex items-center gap-[4px]">
                  {tier.unlocked ? (
                    <Check size={12} className="text-success" />
                  ) : (
                    <Lock size={12} className="text-foreground-secondary" />
                  )}
                  <span
                    className={`text-xs font-semibold tabular-nums ${
                      idx <= CURRENT_TIER_IDX ? "text-success" : "text-foreground-secondary"
                    }`}
                  >
                    {tier.rate}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Conditions to unlock next tiers */}
          <ItemList>
            {INTEREST_TIERS.filter((_, idx) => idx > CURRENT_TIER_IDX).map((tier, i, arr) => (
              <ItemListItem
                key={tier.rate}
                label={`${tier.rate}% — ${tier.label}`}
                sublabel={tier.mission}
                prefix={<Lock size={18} className="text-foreground-secondary" />}
                showChevron
                divider={i < arr.length - 1}
              />
            ))}
          </ItemList>
        </Section>
      </div>

      {/* How to upgrade */}
      <div className="pt-[32px] px-[22px]">
        <p className="text-sm text-foreground-secondary">
          Sử dụng các tính năng của V-Smart Pay (thanh toán, chuyển tiền, nạp tiền) để tích luỹ điểm và lên hạng.
          Hạng càng cao, quyền lợi càng nhiều.
        </p>
      </div>
    </div>
  )
}

/* ── Tab 3: FAQ ───────────────────────────────────────────────── */
function TabFaq() {
  const router = useRouter()
  const [expandedCat, setExpandedCat] = React.useState<number | null>(null)
  const [expandedQ, setExpandedQ] = React.useState<string | null>(null)

  return (
    <div className="flex-1 overflow-y-auto pb-[21px]">
      {/* Quick question card */}
      <div className="pt-[32px] px-[22px]">
        <Section>
          <p className="text-md font-semibold text-foreground">
            Giao dịch không thành công thì phải làm thế nào?
          </p>
          <p className="text-sm text-foreground-secondary mt-[4px]">
            Xem hướng dẫn xử lý &rarr;
          </p>
        </Section>
      </div>

      {/* Category grid */}
      <div className="pt-[32px] px-[22px]">
        <p className="text-md font-semibold text-foreground mb-[16px]">Tìm hiểu theo chủ đề</p>
        <div className="grid grid-cols-3 gap-[12px]">
          {FAQ_DATA.map((cat, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setExpandedCat(expandedCat === idx ? null : idx)}
              className={`flex flex-col items-center gap-[8px] p-[16px] rounded-[20px] transition-colors ${
                expandedCat === idx
                  ? "bg-secondary ring-1 ring-border-bold"
                  : "bg-secondary"
              }`}
            >
              <div className="w-[40px] h-[40px] rounded-full bg-background flex items-center justify-center">
                {ICON_MAP[cat.icon]}
              </div>
              <p className="text-sm text-foreground text-center leading-[16px]">{cat.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Expanded category: accordion Q&A */}
      {expandedCat !== null && (
        <div className="pt-[32px] px-[22px]">
          <p className="text-md font-semibold text-foreground mb-[12px]">
            {FAQ_DATA[expandedCat].label}
          </p>
          <ItemList>
            {FAQ_DATA[expandedCat].items.map((item, qIdx) => {
              const key = `${expandedCat}-${qIdx}`
              const isOpen = expandedQ === key
              return (
                <div key={key}>
                  <ItemListItem
                    label={item.q}
                    onPress={() => setExpandedQ(isOpen ? null : key)}
                    suffix={
                      <ChevronDown
                        size={18}
                        className={`text-foreground-secondary transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    }
                    divider={!isOpen && qIdx < FAQ_DATA[expandedCat].items.length - 1}
                  />
                  {isOpen && (
                    <div className="pb-[12px]">
                      <p className="text-sm text-foreground-secondary">{item.a}</p>
                      {qIdx < FAQ_DATA[expandedCat].items.length - 1 && (
                        <Divider className="mt-[12px]" />
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </ItemList>
        </div>
      )}

      {/* Policies links */}
      <div className="pt-[32px] px-[22px]">
        <Section title="CHÍNH SÁCH / ĐIỀU KHOẢN">
          <ItemList>
            {["Chính sách bảo mật", "Điều khoản sử dụng", "Chính sách tra soát và bồi hoàn"].map(
              (label, i, arr) => (
                <ItemListItem
                  key={label}
                  label={label}
                  showChevron
                  onPress={() => router.push("/sinhloi/terms?doc=policy")}
                  divider={i < arr.length - 1}
                />
              )
            )}
          </ItemList>
        </Section>
      </div>
    </div>
  )
}

/* ── Main: Settings Page (3 tabs) ─────────────────────────────── */
const TABS = [
  { label: "Cài đặt", value: "settings" },
  { label: "Hạng thành viên", value: "membership" },
  { label: "FAQ", value: "faq" },
]

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState("settings")

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">
      <Header
        variant="large-title"
        largeTitle="Cài đặt"
        leading={
          <button
            type="button"
            onClick={() => router.back()}
            className="w-[44px] h-[44px] flex items-center justify-center"
          >
            <ChevronLeft size={18} className="text-foreground" />
          </button>
        }
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === "settings" && <TabSettings />}
      {activeTab === "membership" && <TabMembership />}
      {activeTab === "faq" && <TabFaq />}

      {/* Home indicator */}
      <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] bg-background pointer-events-none">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}
