"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Bell,
  CreditCard,
  Moon,
  Settings,
  Shield,
  Sun,
  User,
  Wallet,
} from "lucide-react"

import {
  SearchTabsScreen,
  SettingsScreen,
  DetailScreenGrey,
  DetailScreenWhite,
  Section,
} from "@/components/templates/screen-templates"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { InformMessage } from "@/components/ui/inform-message"
import { ToastBar } from "@/components/ui/toast-bar"
import { Button } from "@/components/ui/button"

const TEMPLATES = [
  { id: "a", label: "A · SearchTabs" },
  { id: "b", label: "B · Settings" },
  { id: "c", label: "C · Detail Grey" },
  { id: "d", label: "D · Detail White" },
]

export default function TemplatesShowcasePage() {
  const [active, setActive] = React.useState<"a" | "b" | "c" | "d">("a")
  const [isDark, setIsDark] = React.useState(false)
  const [tab, setTab] = React.useState("all")
  const router = useRouter()

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[390px] flex flex-col min-h-screen">

        {/* ── Switcher ─────────────────────────────────────────── */}
        <div className="bg-background border-b border-border px-[22px] py-3 flex flex-col gap-2 shrink-0 z-10">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Screen Templates</p>
            <button
              type="button"
              onClick={() => setIsDark(v => !v)}
              className="flex items-center justify-center w-[36px] h-[36px] rounded-full text-foreground"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActive(t.id as typeof active)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  active === t.id
                    ? "bg-foreground text-background"
                    : "bg-secondary text-foreground-secondary"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Template Preview ─────────────────────────────────── */}
        <div className="flex-1 overflow-hidden relative">

          {/* ── Template A: SearchTabs ── */}
          {active === "a" && (
            <SearchTabsScreen
              title="History"
              onBack={() => router.back()}
              trailing={<Bell size={20} className="text-foreground" />}
              searchProps={{ placeholder: "Search transactions…" }}
              tabs={[
                { label: "All", value: "all" },
                { label: "Sent", value: "sent" },
                { label: "Received", value: "received" },
                { label: "Pending", value: "pending" },
              ]}
              activeTab={tab}
              onTabChange={setTab}
            >
              <Section title="Today" action="See all">
                <div className="bg-secondary rounded-28 px-[16px]">
                  <ItemList>
                    <ItemListItem
                      label="Transfer to Minh"
                      sublabel="11:42 AM"
                      metadata="-200,000 VND"
                      subMetadata="Completed"
                      showChevron
                      onPress={() => {}}
                      prefix={<div className="w-[44px] h-[44px] rounded-full bg-background flex items-center justify-center"><User size={20} className="text-foreground" /></div>}
                    />
                    <ItemListItem
                      label="Apple Pay"
                      sublabel="9:17 AM"
                      metadata="+500,000 VND"
                      subMetadata="Completed"
                      showChevron
                      onPress={() => {}}
                      prefix={<div className="w-[44px] h-[44px] rounded-full bg-background flex items-center justify-center"><CreditCard size={20} className="text-foreground" /></div>}
                    />
                  </ItemList>
                </div>
              </Section>

              <Section title="Yesterday">
                <div className="bg-secondary rounded-28 px-[16px]">
                  <ItemList>
                    <ItemListItem
                      label="Top up wallet"
                      sublabel="3:55 PM"
                      metadata="+1,000,000 VND"
                      subMetadata="Completed"
                      showChevron
                      onPress={() => {}}
                      prefix={<div className="w-[44px] h-[44px] rounded-full bg-background flex items-center justify-center"><Wallet size={20} className="text-foreground" /></div>}
                    />
                  </ItemList>
                </div>
              </Section>
            </SearchTabsScreen>
          )}

          {/* ── Template B: Settings ── */}
          {active === "b" && (
            <SettingsScreen
              largeTitle="Setting and privacy"
              onBack={() => router.back()}
            >
              <Section title="Account">
                <div className="bg-background rounded-28 px-[16px]">
                  <ItemList>
                    <ItemListItem
                      label="Personal information"
                      sublabel="Name, phone, email"
                      showChevron
                      onPress={() => {}}
                      prefix={<div className="w-[44px] h-[44px] rounded-full bg-secondary flex items-center justify-center"><User size={20} className="text-foreground" /></div>}
                    />
                    <ItemListItem
                      label="Security"
                      sublabel="Password, biometrics, 2FA"
                      showChevron
                      onPress={() => {}}
                      prefix={<div className="w-[44px] h-[44px] rounded-full bg-secondary flex items-center justify-center"><Shield size={20} className="text-foreground" /></div>}
                    />
                    <ItemListItem
                      label="Linked accounts"
                      sublabel="Banks, cards, wallets"
                      showChevron
                      onPress={() => {}}
                      prefix={<div className="w-[44px] h-[44px] rounded-full bg-secondary flex items-center justify-center"><CreditCard size={20} className="text-foreground" /></div>}
                    />
                  </ItemList>
                </div>
              </Section>

              <Section title="App">
                <div className="bg-background rounded-28 px-[16px]">
                  <ItemList>
                    <ItemListItem
                      label="Notifications"
                      sublabel="Alerts, push, email"
                      showChevron
                      onPress={() => {}}
                      prefix={<div className="w-[44px] h-[44px] rounded-full bg-secondary flex items-center justify-center"><Bell size={20} className="text-foreground" /></div>}
                    />
                    <ItemListItem
                      label="Preferences"
                      sublabel="Language, theme, currency"
                      showChevron
                      onPress={() => {}}
                      prefix={<div className="w-[44px] h-[44px] rounded-full bg-secondary flex items-center justify-center"><Settings size={20} className="text-foreground" /></div>}
                    />
                  </ItemList>
                </div>
              </Section>
            </SettingsScreen>
          )}

          {/* ── Template C: DetailScreenGrey ── */}
          {active === "c" && (
            <DetailScreenGrey
              largeTitle="V-Smart Pay saving"
              description="Personal savings account"
              onBack={() => router.back()}
            >
              <InformMessage
                hierarchy="primary"
                icon={<Shield size={20} />}
                body="Your savings are protected up to 75,000,000 VND by state insurance."
              />

              <div className="pt-[32px]">
                <div className="bg-background rounded-28 px-[16px]">
                  <ItemList>
                    <ItemListItem label="Account number" metadata="VSP-4892-001" />
                    <ItemListItem label="Interest rate" metadata="5.5% / year" />
                    <ItemListItem label="Term" metadata="12 months" />
                    <ItemListItem label="Maturity date" metadata="28/02/2027" />
                    <ItemListItem label="Status" metadata="Active" subMetadata="Since 28/02/2026" />
                  </ItemList>
                </div>
              </div>

              <div className="pt-[32px]">
                <Button variant="primary" size="48" className="w-full">
                  Withdraw early
                </Button>
              </div>
            </DetailScreenGrey>
          )}

          {/* ── Template D: DetailScreenWhite ── */}
          {active === "d" && (
            <DetailScreenWhite
              largeTitle="V-Smart Pay saving"
              description="Personal savings account"
              onBack={() => router.back()}
            >
              <ToastBar
                type="success"
                title="Interest paid"
                body="22,916 VND was added to your wallet on Feb 28."
              />

              <div className="pt-[32px]">
                <div className="bg-secondary rounded-28 px-[16px]">
                  <ItemList>
                    <ItemListItem label="Account number" metadata="VSP-4892-001" />
                    <ItemListItem label="Interest rate" metadata="5.5% / year" />
                    <ItemListItem label="Term" metadata="12 months" />
                    <ItemListItem label="Maturity date" metadata="28/02/2027" />
                    <ItemListItem label="Status" metadata="Active" subMetadata="Since 28/02/2026" />
                  </ItemList>
                </div>
              </div>

              <div className="pt-[32px]">
                <Button variant="primary" size="48" className="w-full">
                  Withdraw early
                </Button>
              </div>
            </DetailScreenWhite>
          )}

        </div>
      </div>
    </div>
  )
}
