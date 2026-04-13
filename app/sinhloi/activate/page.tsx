"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Header } from "@/components/ui/header"
import { ButtonGroup } from "@/components/ui/button-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ItemList, ItemListItem } from "@/components/ui/item-list"
import { Divider } from "@/components/ui/divider"
import { FixedBottom } from "@/components/ui/fixed-bottom"
import { MOCK_USER, SINHLOI_CONFIG, formatVND } from "../data"

/* ── Stepper (inline) ──────────────────────────────────────────── */
function Stepper({ current }: { current: number }) {
  const steps = [1, 2, 3]
  return (
    <div className="flex items-center justify-center w-[210px] mx-auto py-[16px]">
      {steps.map((step, i) => {
        const isDone = step < current
        const isCurrent = step === current
        const isActive = isDone || isCurrent
        return (
          <React.Fragment key={step}>
            {/* Circle */}
            <div
              className={`w-[24px] h-[24px] rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                isActive
                  ? "bg-success text-background"
                  : "bg-background border border-border-bold text-foreground-secondary"
              }`}
            >
              {step}
            </div>
            {/* Line between circles */}
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-[2px] ${
                  step < current ? "bg-success" : "bg-border-bold"
                }`}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

/* ── Section Title with suffix ─────────────────────────────────── */
function SectionTitle({ title, suffix }: { title: string; suffix?: string }) {
  return (
    <div className="flex items-center justify-between px-[22px] pb-[8px]">
      <p className="text-md font-semibold leading-6 text-foreground">{title}</p>
      {suffix && (
        <span className="text-sm font-medium text-success">{suffix}</span>
      )}
    </div>
  )
}

/* ── S2: Xac nhan dang ky ─────────────────────────────────────── */
export default function ActivatePage() {
  return <React.Suspense fallback={null}><ActivateContent /></React.Suspense>
}

function ActivateContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const stateParam = searchParams.get("state")

  const [cb1, setCb1] = React.useState(stateParam === "valid")
  const [cb2, setCb2] = React.useState(stateParam === "valid")
  const [loading, setLoading] = React.useState(stateParam === "loading")

  const isValid = cb1 && cb2

  const handleConfirm = () => {
    if (!isValid || loading) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push("/sinhloi/otp?context=activate")
    }, 800)
  }

  const productName = "Sinh lời tự động"

  return (
    <div className="relative w-full max-w-[390px] min-h-screen bg-background text-foreground flex flex-col pb-[100px]">
      {/* Header */}
      <Header
        variant="default"
        title={`Đăng ký ${productName}`}
        leading={
          <button
            type="button"
            onClick={() => router.back()}
            className="w-[44px] h-[44px] flex items-center justify-center rounded-full"
          >
            <ChevronLeft size={18} className="text-foreground" />
          </button>
        }
      />

      {/* Stepper — 3 steps, step 2 is current */}
      <Stepper current={2} />

      {/* Divider */}
      <Divider />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Product Card */}
        <div className="pt-[32px] px-[22px]">
          <div className="bg-background rounded-[20px] shadow-sm px-[12px] py-[14px] flex items-center justify-between">
            {/* Left: product info */}
            <div className="flex flex-col gap-[4px]">
              <p className="text-md font-normal leading-6 text-foreground-secondary">
                Sản phẩm tham gia
              </p>
              <p className="text-lg font-medium leading-6 text-foreground">
                {productName}
              </p>
            </div>
            {/* Right: product image placeholder */}
            <div className="w-[79px] h-[79px] rounded-14 bg-secondary shrink-0 flex items-center justify-center">
              <span className="text-xs text-foreground-secondary">IMG</span>
            </div>
          </div>
        </div>

        {/* Section: Thong tin khach hang */}
        <div className="pt-[32px]">
          <SectionTitle title="Thông tin khách hàng" suffix="Chỉnh sửa" />
          <div className="px-[22px]">
            <ItemList>
              <ItemListItem
                label="Họ và tên"
                metadata={MOCK_USER.fullName}
                divider
              />
              <ItemListItem
                label="Số điện thoại"
                metadata={MOCK_USER.phone}
              />
            </ItemList>
          </div>
        </div>

        {/* Section: Tom tat san pham */}
        <div className="pt-[32px]">
          <SectionTitle title="Tóm tắt sản phẩm" />
          <div className="px-[22px]">
            <ItemList>
              <ItemListItem
                label="Sinh lời lên đến"
                suffix={
                  <span className="text-md font-semibold leading-6 text-success">
                    {`${SINHLOI_CONFIG.interestRate}%/năm`}
                  </span>
                }
                divider
              />
              <ItemListItem
                label="Số dư tối đa"
                metadata={formatVND(SINHLOI_CONFIG.maxBalance)}
                divider
              />
              <ItemListItem
                label="Rút tiền"
                metadata="Tức thì và miễn phí"
              />
            </ItemList>
          </div>
        </div>

        {/* Consent Section */}
        <div className="pt-[32px] px-[22px] space-y-[12px]">
          <div className="flex items-start gap-3">
            <Checkbox checked={cb1} onChange={setCb1} />
            <p className="text-sm font-normal leading-5 text-foreground flex-1">
              Tôi xác nhận đã đọc và đồng ý{" "}
              <button type="button" className="text-success font-semibold underline">
                Chính sách quyền riêng tư
              </button>
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox checked={cb2} onChange={setCb2} />
            <p className="text-sm font-normal leading-5 text-foreground flex-1">
              Tôi đã đọc và đồng ý{" "}
              <button type="button" className="text-success font-semibold underline">
                Hợp đồng hợp tác
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* FixedBottom with ButtonGroup */}
      <FixedBottom>
        <ButtonGroup
          layout="horizontal"
          secondaryLabel="Quay lại"
          primaryLabel="Đăng ký"
          primaryProps={{
            disabled: !isValid,
            isLoading: loading,
            onClick: handleConfirm,
          }}
          secondaryProps={{
            onClick: () => router.back(),
          }}
        />
      </FixedBottom>

      {/* Home indicator */}
      <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
        <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
      </div>
    </div>
  )
}
