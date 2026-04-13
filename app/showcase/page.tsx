"use client"

import * as React from "react"
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  Gift,
  Home,
  Info,
  Mail,
  Moon,
  Search,
  Send,
  Settings,
  Shield,
  Star,
  Sun,
  Trash2,
  User,
  Wallet,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { TextField } from "@/components/ui/text-field"
import { Checkbox } from "@/components/ui/checkbox"
import { Header } from "@/components/ui/header"
import { FeedbackState } from "@/components/ui/feedback-state"
import { ToastBar } from "@/components/ui/toast-bar"
import { InformMessage } from "@/components/ui/inform-message"
import { Dialog } from "@/components/ui/dialog"
import { BottomSheet } from "@/components/ui/bottom-sheet"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { Radio } from "@/components/ui/radio"
import { Toggle } from "@/components/ui/toggle"
import { Chip } from "@/components/ui/chip"
import { Tab } from "@/components/ui/tab"
import { Pagination } from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { FixedBottom } from "@/components/ui/fixed-bottom"
import { Dropdown } from "@/components/ui/dropdown"
import { SearchBar } from "@/components/ui/search-bar"
import { TextArea } from "@/components/ui/text-area"
import { PinInput } from "@/components/ui/pin-input"
import { Section } from "@/components/ui/section"
import { Divider } from "@/components/ui/divider"
import { Skeleton } from "@/components/ui/skeleton"
import { GlassBar } from "@/components/ui/glass-bar"
import { Uploader } from "@/components/ui/uploader"
import { ImageFrame } from "@/components/ui/image-frame"
import { Terms } from "@/components/ui/terms"
import { SpecialTextField } from "@/components/ui/special-text-field"
import { DateField } from "@/components/ui/date-field"

/* ── Section IDs ─────────────────────────────────────────────────────── */
const SECTIONS = [
  { id: "button",          label: "Button" },
  { id: "button-group",    label: "ButtonGroup" },
  { id: "textfield",       label: "TextField" },
  { id: "checkbox",        label: "Checkbox" },
  { id: "radio",           label: "Radio" },
  { id: "toggle",          label: "Toggle" },
  { id: "chip",            label: "Chip" },
  { id: "tab",             label: "Tab" },
  { id: "pagination",      label: "Pagination" },
  { id: "badge",           label: "Badge" },
  { id: "label",           label: "Label" },
  { id: "dropdown",        label: "Dropdown" },
  { id: "searchbar",       label: "SearchBar" },
  { id: "textarea",        label: "TextArea" },
  { id: "pininput",        label: "PinInput" },
  { id: "specialtextfield",label: "SpecialTextField" },
  { id: "datefield",       label: "DateField" },
  { id: "section",         label: "Section" },
  { id: "divider",         label: "Divider" },
  { id: "skeleton",        label: "Skeleton" },
  { id: "uploader",        label: "Uploader" },
  { id: "imageframe",      label: "ImageFrame" },
  { id: "terms",           label: "Terms" },
  { id: "header",          label: "Header" },
  { id: "toast",           label: "ToastBar" },
  { id: "inform",          label: "InformMessage" },
  { id: "feedback",        label: "FeedbackState" },
  { id: "itemlist",        label: "ItemList" },
  { id: "fixedbottom",     label: "FixedBottom" },
  { id: "glassbar",        label: "GlassBar" },
  { id: "dialog",          label: "Dialog" },
  { id: "bottomsheet",     label: "BottomSheet" },
]

export default function ShowcasePage() {
  const [isDark, setIsDark] = React.useState(false)

  /* TextField */
  const [tf1, setTf1] = React.useState("")
  const [tf2, setTf2] = React.useState("huy@vsp.io")
  const [tf3, setTf3] = React.useState("bad input")
  const [tf4, setTf4] = React.useState("")

  /* Checkbox */
  const [cb1, setCb1] = React.useState(false)
  const [cb2, setCb2] = React.useState(true)
  const [cb3, setCb3] = React.useState(false)

  /* Radio */
  const [radio1, setRadio1] = React.useState(false)
  const [radio2, setRadio2] = React.useState(true)

  /* Toggle */
  const [toggle1, setToggle1] = React.useState(false)
  const [toggle2, setToggle2] = React.useState(true)

  /* Chip */
  const [chipSel1, setChipSel1] = React.useState(false)
  const [chipSel2, setChipSel2] = React.useState(true)
  const [chipSel3, setChipSel3] = React.useState(false)
  const [chipSel4, setChipSel4] = React.useState(true)

  /* Tab */
  const [demoTab, setDemoTab] = React.useState("tab1")

  /* Pagination */
  const [paginationIdx, setPaginationIdx] = React.useState(1)

  /* Dropdown */
  const [dropdownVal, setDropdownVal] = React.useState("")

  /* SearchBar */
  const [searchVal, setSearchVal] = React.useState("")
  const [searchVal2, setSearchVal2] = React.useState("Payment history")

  /* TextArea */
  const [taVal1, setTaVal1] = React.useState("")
  const [taVal2, setTaVal2] = React.useState("This is a multi-line text area with some content already filled in.")
  const [taVal3, setTaVal3] = React.useState("Error content")
  const [taVal4, setTaVal4] = React.useState("Character count demo")

  /* PinInput */
  const [pin4, setPin4] = React.useState("")
  const [pin6, setPin6] = React.useState("")
  const [pinSecure, setPinSecure] = React.useState("1234")

  /* SpecialTextField */
  const [currencyVal, setCurrencyVal] = React.useState("500000")
  const [phoneVal, setPhoneVal] = React.useState("0987654321")
  const [cardVal, setCardVal] = React.useState("4242424242424242")

  /* DateField */
  const [dateVal, setDateVal] = React.useState<Date | undefined>(new Date(2026, 3, 10))

  /* Terms */
  const [termsChecked, setTermsChecked] = React.useState(false)

  /* GlassBar */
  const [glassActive, setGlassActive] = React.useState("home")

  /* Overlays */
  const [dialogType, setDialogType] = React.useState<"default" | "icon" | "image" | null>(null)
  const [sheetOpen, setSheetOpen] = React.useState(false)

  /* Header tabs */
  const [activeTab, setActiveTab] = React.useState("all")

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col">

        {/* ── Header ─────────────────────────────────────────────── */}
        <Header
          variant="large-title"
          largeTitle="Components"
          description="VSP Design System · 32 components"
          trailing={
            <button
              type="button"
              onClick={() => setIsDark(v => !v)}
              className="flex items-center justify-center p-[10px] min-h-[44px] rounded-full text-foreground"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          }
        />

        {/* ── Scrollable body ─────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto pb-[32px]">

          {/* ── Quick nav ───────────────────────────────────────────── */}
          <div className="pt-[32px] px-[22px]">
            <div className="bg-secondary rounded-28 px-[16px] py-[16px] flex flex-wrap gap-2">
              {SECTIONS.map(s => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="px-3 py-1 rounded-full bg-background text-sm font-medium text-foreground-secondary active:bg-border transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              BUTTON
          ══════════════════════════════════════════════════════════ */}
          <section id="button" className="pt-[32px]">
            <SectionTitle>Button</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>primary · 48</DemoLabel>
              <Button variant="primary" size="48">Confirm payment</Button>

              <DemoLabel>secondary · 48</DemoLabel>
              <Button variant="secondary" size="48">Cancel</Button>

              <DemoLabel>primary · 32</DemoLabel>
              <Button variant="primary" size="32">Save</Button>

              <DemoLabel>secondary · 32</DemoLabel>
              <Button variant="secondary" size="32">Discard</Button>

              <DemoLabel>danger / primary</DemoLabel>
              <Button variant="primary" intent="danger" size="48">Delete account</Button>

              <DemoLabel>danger / secondary</DemoLabel>
              <Button variant="secondary" intent="danger" size="48">Remove card</Button>

              <DemoLabel>loading</DemoLabel>
              <Button variant="primary" size="48" isLoading>Processing…</Button>

              <DemoLabel>disabled</DemoLabel>
              <Button variant="primary" size="48" disabled>Unavailable</Button>

              <DemoLabel>with icon</DemoLabel>
              <div className="flex gap-3">
                <Button variant="primary" size="48" className="flex-1"><Send size={18} />Send</Button>
                <Button variant="secondary" size="48" className="flex-1"><CreditCard size={18} />Pay</Button>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              BUTTON GROUP
          ══════════════════════════════════════════════════════════ */}
          <section id="button-group" className="pt-[32px]">
            <SectionTitle>ButtonGroup</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>horizontal</DemoLabel>
              <ButtonGroup layout="horizontal" primaryLabel="Confirm" secondaryLabel="Cancel" />

              <DemoLabel>vertical</DemoLabel>
              <ButtonGroup layout="vertical" primaryLabel="Continue" secondaryLabel="Go back" />

              <DemoLabel>horizontal · size 32</DemoLabel>
              <ButtonGroup layout="horizontal" size="32" primaryLabel="Save" secondaryLabel="Discard" />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              TEXT FIELD
          ══════════════════════════════════════════════════════════ */}
          <section id="textfield" className="pt-[32px]">
            <SectionTitle>TextField</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>outfocus (empty)</DemoLabel>
              <TextField
                label="Email address"
                placeholder="you@example.com"
                value={tf1}
                onChange={e => setTf1(e.target.value)}
              />

              <DemoLabel>filled</DemoLabel>
              <TextField
                label="Email address"
                value={tf2}
                onChange={e => setTf2(e.target.value)}
              />

              <DemoLabel>with leading icon</DemoLabel>
              <TextField
                label="Search"
                placeholder="Search transactions…"
                leadingIcon={<Search size={20} />}
                value={tf4}
                onChange={e => setTf4(e.target.value)}
              />

              <DemoLabel>error state</DemoLabel>
              <TextField
                label="Email address"
                value={tf3}
                onChange={e => setTf3(e.target.value)}
                error="Please enter a valid email address."
              />

              <DemoLabel>with help text</DemoLabel>
              <TextField
                label="Password"
                type="password"
                placeholder="At least 8 characters"
                helpText="Must contain uppercase, number and symbol."
                value=""
                onChange={() => {}}
              />

              <DemoLabel>disabled</DemoLabel>
              <TextField
                label="Account number"
                value="VSP-4892-001"
                disabled
                onChange={() => {}}
              />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              CHECKBOX
          ══════════════════════════════════════════════════════════ */}
          <section id="checkbox" className="pt-[32px]">
            <SectionTitle>Checkbox</SectionTitle>

            <div className="px-[22px] bg-secondary rounded-28 mx-[22px] overflow-hidden">
              <CheckRow label="Unchecked">
                <Checkbox checked={cb1} onChange={setCb1} />
              </CheckRow>
              <CheckRow label="Checked" divider>
                <Checkbox checked={cb2} onChange={setCb2} />
              </CheckRow>
              <CheckRow label="Indeterminate" divider>
                <Checkbox checked={cb3} onChange={setCb3} indeterminate />
              </CheckRow>
              <CheckRow label="Disabled · checked" divider>
                <Checkbox checked disabled onChange={() => {}} />
              </CheckRow>
              <CheckRow label="Disabled · unchecked" divider>
                <Checkbox checked={false} disabled onChange={() => {}} />
              </CheckRow>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              RADIO
          ══════════════════════════════════════════════════════════ */}
          <section id="radio" className="pt-[32px]">
            <SectionTitle>Radio</SectionTitle>

            <div className="px-[22px] bg-secondary rounded-28 mx-[22px] overflow-hidden">
              <CheckRow label="Unchecked">
                <Radio checked={radio1} onChange={setRadio1} />
              </CheckRow>
              <CheckRow label="Checked" divider>
                <Radio checked={radio2} onChange={setRadio2} />
              </CheckRow>
              <CheckRow label="Disabled · checked" divider>
                <Radio checked disabled />
              </CheckRow>
              <CheckRow label="Disabled · unchecked" divider>
                <Radio checked={false} disabled />
              </CheckRow>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              TOGGLE
          ══════════════════════════════════════════════════════════ */}
          <section id="toggle" className="pt-[32px]">
            <SectionTitle>Toggle</SectionTitle>

            <div className="px-[22px] bg-secondary rounded-28 mx-[22px] overflow-hidden">
              <CheckRow label="Off">
                <Toggle checked={toggle1} onChange={setToggle1} />
              </CheckRow>
              <CheckRow label="On" divider>
                <Toggle checked={toggle2} onChange={setToggle2} />
              </CheckRow>
              <CheckRow label="Disabled · on" divider>
                <Toggle checked disabled />
              </CheckRow>
              <CheckRow label="Disabled · off" divider>
                <Toggle checked={false} disabled />
              </CheckRow>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              CHIP
          ══════════════════════════════════════════════════════════ */}
          <section id="chip" className="pt-[32px]">
            <SectionTitle>Chip</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>filled · default & selected</DemoLabel>
              <div className="flex flex-wrap gap-2">
                <Chip variant="filled" selected={chipSel1} onPress={() => setChipSel1(!chipSel1)}>All</Chip>
                <Chip variant="filled" selected={chipSel2} onPress={() => setChipSel2(!chipSel2)}>Transfers</Chip>
                <Chip variant="filled">Payments</Chip>
              </div>

              <DemoLabel>outline · default & selected</DemoLabel>
              <div className="flex flex-wrap gap-2">
                <Chip variant="outline" selected={chipSel3} onPress={() => setChipSel3(!chipSel3)}>Daily</Chip>
                <Chip variant="outline" selected={chipSel4} onPress={() => setChipSel4(!chipSel4)}>Weekly</Chip>
                <Chip variant="outline">Monthly</Chip>
              </div>

              <DemoLabel>with icon</DemoLabel>
              <div className="flex flex-wrap gap-2">
                <Chip variant="filled" icon={<Star size={14} />}>Favorites</Chip>
                <Chip variant="outline" icon={<Zap size={14} />} selected>Quick</Chip>
              </div>

              <DemoLabel>with close</DemoLabel>
              <div className="flex flex-wrap gap-2">
                <Chip variant="filled" selected onClose={() => {}}>Removable</Chip>
                <Chip variant="outline" onClose={() => {}}>Filter</Chip>
              </div>

              <DemoLabel>size sm</DemoLabel>
              <div className="flex flex-wrap gap-2">
                <Chip variant="filled" size="sm">Small</Chip>
                <Chip variant="filled" size="sm" selected>Selected</Chip>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              TAB
          ══════════════════════════════════════════════════════════ */}
          <section id="tab" className="pt-[32px]">
            <SectionTitle>Tab</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>3-tab bar</DemoLabel>
              <Tab
                tabs={[
                  { label: "Overview", value: "tab1" },
                  { label: "Transactions", value: "tab2" },
                  { label: "Settings", value: "tab3" },
                ]}
                activeTab={demoTab}
                onTabChange={setDemoTab}
              />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              PAGINATION
          ══════════════════════════════════════════════════════════ */}
          <section id="pagination" className="pt-[32px]">
            <SectionTitle>Pagination</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>5 dots · interactive</DemoLabel>
              <Pagination total={5} current={paginationIdx} onChange={setPaginationIdx} />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              BADGE
          ══════════════════════════════════════════════════════════ */}
          <section id="badge" className="pt-[32px]">
            <SectionTitle>Badge</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>all variants</DemoLabel>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="info">Info</Badge>
              </div>

              <DemoLabel>with dot</DemoLabel>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success" dot>Active</Badge>
                <Badge variant="warning" dot>Pending</Badge>
                <Badge variant="danger" dot>Failed</Badge>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              LABEL
          ══════════════════════════════════════════════════════════ */}
          <section id="label" className="pt-[32px]">
            <SectionTitle>Label</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>all variants</DemoLabel>
              <div className="flex flex-wrap gap-2">
                <Label variant="default">Default</Label>
                <Label variant="success">Success</Label>
                <Label variant="warning">Warning</Label>
                <Label variant="danger">Danger</Label>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              DROPDOWN
          ══════════════════════════════════════════════════════════ */}
          <section id="dropdown" className="pt-[32px]">
            <SectionTitle>Dropdown</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>with options</DemoLabel>
              <Dropdown
                label="Account type"
                placeholder="Select an option"
                options={[
                  { label: "Personal", value: "personal" },
                  { label: "Business", value: "business" },
                  { label: "Joint account", value: "joint" },
                ]}
                value={dropdownVal}
                onChange={setDropdownVal}
              />

              <DemoLabel>disabled</DemoLabel>
              <Dropdown
                label="Currency"
                placeholder="VND"
                options={[]}
                disabled
              />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              SEARCH BAR
          ══════════════════════════════════════════════════════════ */}
          <section id="searchbar" className="pt-[32px]">
            <SectionTitle>SearchBar</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>empty</DemoLabel>
              <SearchBar
                placeholder="Search transactions…"
                value={searchVal}
                onChange={setSearchVal}
              />

              <DemoLabel>with value</DemoLabel>
              <SearchBar
                value={searchVal2}
                onChange={setSearchVal2}
                onClear={() => setSearchVal2("")}
              />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              TEXT AREA
          ══════════════════════════════════════════════════════════ */}
          <section id="textarea" className="pt-[32px]">
            <SectionTitle>TextArea</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>empty</DemoLabel>
              <TextArea
                label="Notes"
                placeholder="Add a note…"
                value={taVal1}
                onChange={setTaVal1}
              />

              <DemoLabel>with content</DemoLabel>
              <TextArea
                label="Description"
                value={taVal2}
                onChange={setTaVal2}
              />

              <DemoLabel>error</DemoLabel>
              <TextArea
                label="Reason"
                value={taVal3}
                onChange={setTaVal3}
                error="This field is required."
              />

              <DemoLabel>with counter</DemoLabel>
              <TextArea
                label="Bio"
                placeholder="Tell us about yourself…"
                value={taVal4}
                onChange={setTaVal4}
                maxLength={200}
              />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              PIN INPUT
          ══════════════════════════════════════════════════════════ */}
          <section id="pininput" className="pt-[32px]">
            <SectionTitle>PinInput</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>4-digit</DemoLabel>
              <PinInput length={4} value={pin4} onChange={setPin4} />

              <DemoLabel>6-digit</DemoLabel>
              <PinInput length={6} value={pin6} onChange={setPin6} />

              <DemoLabel>secure mode</DemoLabel>
              <PinInput length={4} value={pinSecure} onChange={setPinSecure} secure />

              <DemoLabel>error</DemoLabel>
              <PinInput length={4} value="12" error />

              <DemoLabel>disabled</DemoLabel>
              <PinInput length={4} value="1234" disabled />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              SPECIAL TEXT FIELD
          ══════════════════════════════════════════════════════════ */}
          <section id="specialtextfield" className="pt-[32px]">
            <SectionTitle>SpecialTextField</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>currency format</DemoLabel>
              <SpecialTextField
                label="Amount"
                format="currency"
                placeholder="0"
                value={currencyVal}
                onChange={setCurrencyVal}
              />

              <DemoLabel>phone format</DemoLabel>
              <SpecialTextField
                label="Phone number"
                format="phone"
                placeholder="xxx xxx xxxx"
                value={phoneVal}
                onChange={setPhoneVal}
              />

              <DemoLabel>card format</DemoLabel>
              <SpecialTextField
                label="Card number"
                format="card"
                placeholder="xxxx xxxx xxxx xxxx"
                value={cardVal}
                onChange={setCardVal}
              />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              DATE FIELD
          ══════════════════════════════════════════════════════════ */}
          <section id="datefield" className="pt-[32px]">
            <SectionTitle>DateField</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>with label</DemoLabel>
              <DateField
                label="Date of birth"
                value={dateVal}
                onChange={setDateVal}
              />

              <DemoLabel>empty</DemoLabel>
              <DateField label="Start date" />

              <DemoLabel>disabled</DemoLabel>
              <DateField label="End date" value={new Date(2026, 11, 31)} disabled />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              SECTION
          ══════════════════════════════════════════════════════════ */}
          <section id="section" className="pt-[32px]">
            <SectionTitle>Section</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>with title</DemoLabel>
              <Section title="Account Details">
                <p className="text-sm text-foreground">Content inside a Section card with an uppercase title.</p>
              </Section>

              <DemoLabel>no title</DemoLabel>
              <Section>
                <p className="text-sm text-foreground">A plain Section card without a title.</p>
              </Section>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              DIVIDER
          ══════════════════════════════════════════════════════════ */}
          <section id="divider" className="pt-[32px]">
            <SectionTitle>Divider</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>full</DemoLabel>
              <Divider variant="full" />

              <DemoLabel>inset</DemoLabel>
              <Divider variant="inset" />

              <DemoLabel>with label</DemoLabel>
              <Divider label="or" />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              SKELETON
          ══════════════════════════════════════════════════════════ */}
          <section id="skeleton" className="pt-[32px]">
            <SectionTitle>Skeleton</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>text</DemoLabel>
              <div className="flex flex-col gap-2">
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="75%" />
                <Skeleton variant="text" width="50%" />
              </div>

              <DemoLabel>circle</DemoLabel>
              <Skeleton variant="circle" width={48} height={48} />

              <DemoLabel>rect</DemoLabel>
              <Skeleton variant="rect" width="100%" height={80} />

              <DemoLabel>card</DemoLabel>
              <Skeleton variant="card" width="100%" height={120} />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              UPLOADER
          ══════════════════════════════════════════════════════════ */}
          <section id="uploader" className="pt-[32px]">
            <SectionTitle>Uploader</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>empty state</DemoLabel>
              <Uploader accept="image/*" />

              <DemoLabel>disabled</DemoLabel>
              <Uploader disabled />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              IMAGE FRAME
          ══════════════════════════════════════════════════════════ */}
          <section id="imageframe" className="pt-[32px]">
            <SectionTitle>ImageFrame</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>square (no src — error state)</DemoLabel>
              <ImageFrame ratio="square" />

              <DemoLabel>wide 16:9</DemoLabel>
              <ImageFrame ratio="wide" />

              <DemoLabel>tall 3:4</DemoLabel>
              <div className="w-[160px]">
                <ImageFrame ratio="tall" />
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              TERMS
          ══════════════════════════════════════════════════════════ */}
          <section id="terms" className="pt-[32px]">
            <SectionTitle>Terms</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>text only</DemoLabel>
              <Terms>
                By continuing, you agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
              </Terms>

              <DemoLabel>with checkbox</DemoLabel>
              <Terms withCheckbox checked={termsChecked} onChange={setTermsChecked}>
                I have read and agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a> of V-Smart Pay.
              </Terms>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              HEADER
          ══════════════════════════════════════════════════════════ */}
          <section id="header" className="pt-[32px]">
            <SectionTitle>Header</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">

              <DemoLabel>default</DemoLabel>
              <Frame>
                <Header variant="default" title="Payment details" showStatusBar={false} />
              </Frame>

              <DemoLabel>default · back + trailing</DemoLabel>
              <Frame>
                <Header
                  variant="default"
                  title="Transfer"
                  showStatusBar={false}
                  leading={
                    <button type="button" className="flex items-center justify-center pl-[8px] pr-[10px] py-[10px] min-h-[44px] rounded-full text-foreground">
                      <ChevronLeft size={18} />
                    </button>
                  }
                  trailing={<Bell size={20} className="text-foreground" />}
                />
              </Frame>

              <DemoLabel>large-title</DemoLabel>
              <Frame>
                <Header
                  variant="large-title"
                  largeTitle="Dashboard"
                  description="Good morning, Huy"
                  showStatusBar={false}
                />
              </Frame>

              <DemoLabel>large-title · search</DemoLabel>
              <Frame>
                <Header
                  variant="large-title"
                  largeTitle="Explore"
                  showStatusBar={false}
                  showSearch
                  searchProps={{ placeholder: "Search…" }}
                />
              </Frame>

              <DemoLabel>large-title · search + tabs</DemoLabel>
              <Frame>
                <Header
                  variant="large-title"
                  largeTitle="History"
                  showStatusBar={false}
                  showSearch
                  searchProps={{ placeholder: "Search transactions…" }}
                  tabs={[
                    { label: "All", value: "all" },
                    { label: "Sent", value: "sent" },
                    { label: "Received", value: "received" },
                  ]}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />
              </Frame>

            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              TOAST BAR
          ══════════════════════════════════════════════════════════ */}
          <section id="toast" className="pt-[32px]">
            <SectionTitle>ToastBar</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>default</DemoLabel>
              <ToastBar
                type="default"
                title="Security reminder"
                body="Enable biometric login to keep your account safe."
                actionLabel="Enable"
              />

              <DemoLabel>default · icon + dismiss</DemoLabel>
              <ToastBar
                type="default"
                icon={<Bell size={20} />}
                title="New notification"
                body="You have a pending transfer request."
                onClose={() => {}}
              />

              <DemoLabel>success</DemoLabel>
              <ToastBar
                type="success"
                icon={<CheckCircle2 size={20} />}
                title="Payment sent"
                body="500,000 VND was successfully sent to Minh."
              />

              <DemoLabel>error</DemoLabel>
              <ToastBar
                type="error"
                icon={<AlertCircle size={20} />}
                title="Transfer failed"
                body="Insufficient balance. Please top up your account."
                onClose={() => {}}
              />

              <DemoLabel>no title · body only</DemoLabel>
              <ToastBar
                type="default"
                body="Your session will expire in 5 minutes."
                actionLabel="Extend"
              />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              INFORM MESSAGE
          ══════════════════════════════════════════════════════════ */}
          <section id="inform" className="pt-[32px]">
            <SectionTitle>InformMessage</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>secondary · icon</DemoLabel>
              <InformMessage
                hierarchy="secondary"
                icon={<Info size={20} />}
                body="Your account will be reviewed within 24 hours."
              />

              <DemoLabel>secondary · action</DemoLabel>
              <InformMessage
                hierarchy="secondary"
                body="Keep your profile up to date for better security."
                actionLabel="Update now"
              />

              <DemoLabel>secondary · icon + action</DemoLabel>
              <InformMessage
                hierarchy="secondary"
                icon={<Shield size={20} />}
                body="Two-factor authentication adds an extra layer of security."
                actionLabel="Enable 2FA"
              />

              <DemoLabel>primary (blue) · icon + action</DemoLabel>
              <InformMessage
                hierarchy="primary"
                icon={<Gift size={20} />}
                body={<>Invite friends and earn <span className="text-success font-semibold">50,000 VND</span> per referral.</>}
                actionLabel="Invite now"
              />

              <DemoLabel>primary · action only</DemoLabel>
              <InformMessage
                hierarchy="primary"
                icon={<Mail size={20} />}
                body="Verify your email to unlock all features."
                actionLabel="Verify email"
              />
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              FEEDBACK STATE
          ══════════════════════════════════════════════════════════ */}
          <section id="feedback" className="pt-[32px]">
            <SectionTitle>FeedbackState</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>success · CTA</DemoLabel>
              <Frame>
                <FeedbackState
                  icon={<CheckCircle2 size={64} className="text-success" />}
                  title="Transfer complete"
                  description="500,000 VND has been sent to Minh. It may take up to 2 minutes."
                  actionLabel="Done"
                />
              </Frame>

              <DemoLabel>empty state</DemoLabel>
              <Frame>
                <FeedbackState
                  icon={<Wallet size={64} className="text-foreground-secondary" />}
                  title="No transactions yet"
                  description="Your history will appear here once you make your first transfer."
                  actionLabel="Add money"
                />
              </Frame>

              <DemoLabel>error · retry</DemoLabel>
              <Frame>
                <FeedbackState
                  icon={<AlertCircle size={64} className="text-danger" />}
                  title="Something went wrong"
                  description="We couldn't process your request. Please try again."
                  actionLabel="Retry"
                />
              </Frame>

              <DemoLabel>no action</DemoLabel>
              <Frame>
                <FeedbackState
                  icon={<Shield size={64} className="text-foreground-secondary" />}
                  title="No insurance yet"
                  description="Purchase insurance to get comprehensive protection."
                />
              </Frame>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              ITEM LIST
          ══════════════════════════════════════════════════════════ */}
          <section id="itemlist" className="pt-[32px]">
            <SectionTitle>ItemList</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>label + sublabel + chevron</DemoLabel>
              <div className="bg-secondary rounded-28 px-[16px] overflow-hidden">
                <ItemList>
                  <ItemListItem label="Profile" sublabel="Huy Kieu · Verified" showChevron onPress={() => {}}
                    prefix={<div className="w-[44px] h-[44px] rounded-full bg-background flex items-center justify-center"><User size={20} className="text-foreground" /></div>}
                  />
                  <ItemListItem label="Wallet" sublabel="Manage accounts & cards" showChevron onPress={() => {}}
                    prefix={<div className="w-[44px] h-[44px] rounded-full bg-background flex items-center justify-center"><Wallet size={20} className="text-foreground" /></div>}
                  />
                  <ItemListItem label="Settings" sublabel="Language, theme, security" showChevron onPress={() => {}}
                    prefix={<div className="w-[44px] h-[44px] rounded-full bg-background flex items-center justify-center"><Settings size={20} className="text-foreground" /></div>}
                  />
                  <ItemListItem label="Delete account" sublabel="Permanently remove your data" showChevron onPress={() => {}}
                    prefix={<div className="w-[44px] h-[44px] rounded-full bg-rose-50 flex items-center justify-center"><Trash2 size={20} className="text-danger" /></div>}
                  />
                </ItemList>
              </div>

              <DemoLabel>metadata + subMetadata</DemoLabel>
              <div className="bg-secondary rounded-28 px-[16px] overflow-hidden">
                <ItemList>
                  <ItemListItem label="Apple Pay" sublabel="Today · 11:17 PM" metadata="+500,000 VND" subMetadata="Completed" showChevron onPress={() => {}}
                    prefix={<div className="w-[44px] h-[44px] rounded-full bg-background flex items-center justify-center"><CreditCard size={20} className="text-foreground" /></div>}
                  />
                  <ItemListItem label="Transfer to Minh" sublabel="Yesterday · 3:42 PM" metadata="-200,000 VND" subMetadata="Pending" showChevron onPress={() => {}}
                    prefix={<div className="w-[44px] h-[44px] rounded-full bg-background flex items-center justify-center"><User size={20} className="text-foreground" /></div>}
                  />
                </ItemList>
              </div>

              <DemoLabel>no prefix · no chevron</DemoLabel>
              <div className="bg-secondary rounded-28 px-[16px] overflow-hidden">
                <ItemList>
                  <ItemListItem label="Version" metadata="1.0.0" />
                  <ItemListItem label="Build" metadata="2026.02.28" />
                </ItemList>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              FIXED BOTTOM
          ══════════════════════════════════════════════════════════ */}
          <section id="fixedbottom" className="pt-[32px]">
            <SectionTitle>FixedBottom</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>preview (non-fixed for demo)</DemoLabel>
              <Frame>
                <div className="relative h-[100px] bg-background">
                  <div className="absolute bottom-0 left-0 right-0 bg-background border-t border-border px-[22px] pt-[12px] pb-[16px] shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                    <Button variant="primary" size="48" className="w-full">Continue</Button>
                  </div>
                </div>
              </Frame>
              <p className="text-xs text-foreground-secondary">FixedBottom is position-fixed. Shown here in a Frame for preview.</p>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              GLASS BAR
          ══════════════════════════════════════════════════════════ */}
          <section id="glassbar" className="pt-[32px]">
            <SectionTitle>GlassBar</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>bottom nav (in frame)</DemoLabel>
              <Frame>
                <div className="relative h-[140px] bg-secondary overflow-hidden">
                  <div className="absolute bottom-[12px] left-1/2 -translate-x-1/2 z-10 h-[64px] bg-background/80 backdrop-blur-xl rounded-full shadow-lg flex items-center px-[20px]">
                    {[
                      { icon: <Home size={24} />, label: "Home", value: "home" },
                      { icon: <Wallet size={24} />, label: "Wallet", value: "wallet" },
                      { icon: <Bell size={24} />, label: "Alerts", value: "alerts" },
                      { icon: <User size={24} />, label: "Profile", value: "profile" },
                    ].map((item) => {
                      const isActive = item.value === glassActive
                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => setGlassActive(item.value)}
                          className={`flex flex-col items-center justify-center gap-[2px] flex-1 min-w-[56px] transition-colors duration-150 ${isActive ? "text-foreground" : "text-foreground-secondary"}`}
                        >
                          <span className="w-6 h-6 flex items-center justify-center">{item.icon}</span>
                          <span className="text-[10px] font-medium leading-3">{item.label}</span>
                          {isActive && <span className="w-1 h-1 rounded-full bg-brand-secondary" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </Frame>
              <p className="text-xs text-foreground-secondary">GlassBar is position-fixed. Shown here inline for preview.</p>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              DIALOG
          ══════════════════════════════════════════════════════════ */}
          <section id="dialog" className="pt-[32px]">
            <SectionTitle>Dialog</SectionTitle>

            <div className="px-[22px] flex flex-col gap-3">
              <DemoLabel>default</DemoLabel>
              <Button variant="secondary" size="48" onClick={() => setDialogType("default")}>
                Open Default Dialog
              </Button>

              <DemoLabel>with icon</DemoLabel>
              <Button variant="secondary" size="48" onClick={() => setDialogType("icon")}>
                Open Icon Dialog
              </Button>

              <DemoLabel>with image</DemoLabel>
              <Button variant="secondary" size="48" onClick={() => setDialogType("image")}>
                Open Image Dialog
              </Button>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════
              BOTTOM SHEET
          ══════════════════════════════════════════════════════════ */}
          <section id="bottomsheet" className="pt-[32px]">
            <SectionTitle>BottomSheet</SectionTitle>

            <div className="px-[22px]">
              <Button variant="secondary" size="48" className="w-full" onClick={() => setSheetOpen(true)}>
                Open Bottom Sheet
              </Button>
            </div>
          </section>

        </div>

        {/* ── Home indicator ───────────────────────────────────────── */}
        <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] bg-background pointer-events-none">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>

        {/* ── Dialog portals ───────────────────────────────────────── */}
        <Dialog
          open={dialogType === "default"}
          onClose={() => setDialogType(null)}
          type="default"
          title="Confirm transfer"
          description="You are about to send 500,000 VND to Nguyen Van Minh. This action cannot be undone."
          primaryLabel="Send now"
          secondaryLabel="Cancel"
          footerProps={{ secondaryProps: { onClick: () => setDialogType(null) } }}
        />

        <Dialog
          open={dialogType === "icon"}
          onClose={() => setDialogType(null)}
          type="icon"
          icon={<Trash2 size={36} className="text-danger" />}
          title="Delete account"
          description="All your data will be permanently removed. This action cannot be undone."
          primaryLabel="Delete"
          secondaryLabel="Cancel"
          footerProps={{
            primaryProps: { intent: "danger", onClick: () => setDialogType(null) },
            secondaryProps: { onClick: () => setDialogType(null) },
          }}
        />

        <Dialog
          open={dialogType === "image"}
          onClose={() => setDialogType(null)}
          type="image"
          image={
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
              <Gift size={40} className="text-success" />
            </div>
          }
          title="You earned a reward!"
          description="Complete 3 more transfers to unlock your next bonus."
          primaryLabel="Claim reward"
          secondaryLabel="Later"
          footerProps={{ secondaryProps: { onClick: () => setDialogType(null) } }}
        />

        {/* ── BottomSheet portal ───────────────────────────────────── */}
        <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
          <p className="text-md font-semibold text-foreground pb-[12px]">Share or export</p>
          <div className="bg-background rounded-28 overflow-hidden mb-3">
            <ItemList>
              <ItemListItem label="Share link" sublabel="Send via message or email" showChevron onPress={() => setSheetOpen(false)}
                prefix={<div className="w-[44px] h-[44px] rounded-full bg-secondary flex items-center justify-center"><Send size={20} className="text-foreground" /></div>}
              />
              <ItemListItem label="Download PDF" sublabel="Save to Files" showChevron onPress={() => setSheetOpen(false)}
                prefix={<div className="w-[44px] h-[44px] rounded-full bg-secondary flex items-center justify-center"><CreditCard size={20} className="text-foreground" /></div>}
              />
              <ItemListItem label="Copy link" sublabel="Paste anywhere" showChevron onPress={() => setSheetOpen(false)}
                prefix={<div className="w-[44px] h-[44px] rounded-full bg-secondary flex items-center justify-center"><Mail size={20} className="text-foreground" /></div>}
              />
            </ItemList>
          </div>
          <Button variant="secondary" size="48" className="w-full" onClick={() => setSheetOpen(false)}>
            Cancel
          </Button>
        </BottomSheet>

      </div>
    </div>
  )
}

/* ── Helpers ─────────────────────────────────────────────────────────── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-[22px] pb-[12px]">
      <p className="text-md font-semibold leading-6 text-foreground">{children}</p>
    </div>
  )
}

function DemoLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium text-foreground-secondary uppercase tracking-wider pt-1">
      {children}
    </p>
  )
}

/** Thin border preview frame for components like Header, FeedbackState */
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-14 overflow-hidden">
      {children}
    </div>
  )
}

function CheckRow({
  label,
  children,
  divider,
}: {
  label: string
  children: React.ReactNode
  divider?: boolean
}) {
  return (
    <div className={`flex items-center justify-between py-3 ${divider ? "border-t border-border" : ""}`}>
      <span className="text-md text-foreground">{label}</span>
      {children}
    </div>
  )
}
