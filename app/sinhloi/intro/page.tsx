"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Shield, TrendingUp, Clock, Wallet } from "lucide-react"
import { Header } from "@/components/ui/header"
import { ButtonGroup } from "@/components/ui/button-group"
import { InformMessage } from "@/components/ui/inform-message"
import { ItemList, ItemListItem } from "@/components/ui/item-list"

/* ── S1: Onboarding — Sinh lời tự động ────────────────────────────── */
export default function OnboardingPage() {
  const router = useRouter()

  return (
    <div className="relative w-full max-w-[390px] min-h-screen text-foreground flex flex-col">
      {/* Green gradient background — Brand gradient, not a semantic token */}
      <div
        className="absolute inset-x-0 top-0 h-[400px] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #e5fff8 0%, white 28%)" }}
      />

      {/* Header — transparent over gradient, back only */}
      <div className="relative z-10">
        <Header
          variant="default"
          showStatusBar={true}
          className="bg-transparent"
          leading={
            <button
              type="button"
              onClick={() => router.back()}
              className="w-[44px] h-[44px] flex items-center justify-center"
            >
              <ChevronLeft size={18} className="text-foreground" />
            </button>
          }
        />
      </div>

      {/* Scrollable content */}
      <div className="relative z-10 flex-1 overflow-y-auto pb-[160px]">
        {/* Product icon */}
        <div className="flex justify-center pt-[8px]">
          <div className="w-[82px] h-[82px] rounded-full bg-success/10 flex items-center justify-center">
            <Wallet size={40} className="text-success" />
          </div>
        </div>

        {/* Title section */}
        <div className="px-[22px] pt-[16px] flex flex-col items-center gap-[8px]">
          <p className="text-[20px] font-semibold leading-[24px] text-foreground text-center">
            Sinh lời tự động
          </p>
          <p className="text-[22px] font-bold leading-[32px] text-foreground text-center">
            Lãi suất lên{" "}
            <span className="text-success">đến</span>{" "}
            <span className="text-success">5.75%/năm</span>
          </p>
          <p className="text-[16px] font-normal leading-[24px] text-foreground text-center">
            Tiền nhàn rỗi sinh lời mỗi ngày, rút bất kỳ lúc nào
          </p>
        </div>

        {/* Benefits row — 3 items */}
        <div className="px-[22px] pt-[24px]">
          <div className="relative rounded-[24px] px-[22px] py-10 bg-secondary overflow-hidden">
            <div className="flex items-start justify-between gap-[14px]">
              {[
                { icon: <Shield size={24} className="text-success" />, label: "An toàn &\nbảo đảm" },
                { icon: <TrendingUp size={24} className="text-success" />, label: "Lợi suất\nhấp dẫn" },
                { icon: <Clock size={24} className="text-success" />, label: "Thanh khoản\ntức thì" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-[8px] flex-1">
                  <div className="w-[56px] h-[56px] rounded-full bg-background/80 shadow-sm flex items-center justify-center">
                    {item.icon}
                  </div>
                  <p className="text-[14px] font-semibold text-foreground text-center whitespace-pre-line leading-[18px]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dashed divider */}
        <div className="px-[22px] pt-[32px]">
          <div className="w-full border-t border-dashed border-border" />
        </div>

        {/* Comparison card */}
        <div className="px-[22px] pt-[32px]">
          <div className="rounded-[20px] shadow-sm bg-grey-25 p-[20px]">
            <p className="text-[20px] font-semibold leading-[28px] text-foreground">
              Thảnh thơi nhận tiền lời mỗi ngày
            </p>
            <p className="text-[14px] font-normal leading-[20px] text-foreground-secondary mt-[6px]">
              Hãy để Sinh lời tự động giúp bạn sinh lời tối đa
            </p>

            {/* Bar chart comparison */}
            <div className="flex items-end justify-center gap-[40px] mt-[24px]">
              {/* Left — not registered */}
              <div className="flex flex-col items-center gap-[8px]">
                <span className="text-[12px] font-medium text-foreground-secondary">0%</span>
                <div className="w-[48px] h-[24px] rounded-[4px] bg-secondary" />
                <div className="flex flex-col items-center gap-[2px]">
                  <span className="text-[14px] font-bold text-foreground">Chưa đăng ký</span>
                  <span className="text-[12px] font-normal text-foreground-secondary">Sinh lời tự động</span>
                </div>
              </div>

              {/* Right — registered */}
              <div className="flex flex-col items-center gap-[8px]">
                <span className="text-[12px] font-semibold text-success">Lên đến 5.5%</span>
                <div
                  className="w-[48px] h-[113px] rounded-[4px]"
                  style={{
                    background: "linear-gradient(to bottom, var(--brand-secondary), rgba(0,177,130,0.2))",
                  }}
                />
                <div className="flex flex-col items-center gap-[2px]">
                  <span className="text-[14px] font-bold text-foreground">Đã đăng ký</span>
                  <span className="text-[12px] font-normal text-foreground-secondary">Sinh lời tự động</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashed divider */}
        <div className="px-[22px] pt-[32px]">
          <div className="w-full border-t border-dashed border-border" />
        </div>

        {/* FAQ items */}
        <div className="px-[22px] pt-[20px]">
          <ItemList>
            <ItemListItem
              label="Cách tính tiền lời"
              showChevron
              divider
              onPress={() => {}}
              className="h-[48px]"
            />
            <ItemListItem
              label="Thời điểm nhận tiền lời"
              showChevron
              onPress={() => {}}
              className="h-[48px]"
            />
          </ItemList>
        </div>

        {/* Inform message — partner disclaimer */}
        <div className="px-[22px] pt-[32px]">
          <div className="border border-border rounded-14 p-[12px] flex flex-col gap-[10px]">
            <p className="text-[12px] font-normal leading-[18px] text-foreground-secondary">
              Sản phẩm được cung cấp bởi đối tác tài chính hợp tác với V-Smart Pay.
              Tiền của bạn được bảo vệ theo quy định pháp luật hiện hành.
            </p>
            {/* Partner logo placeholder */}
            <div className="w-[104px] h-[14px] bg-secondary rounded-[2px]" />
          </div>
        </div>
      </div>

      {/* Fixed bottom */}
      <div className="absolute bottom-0 inset-x-0 bg-background z-20">
        {/* Disclaimer text */}
        <div className="px-[22px] pt-[12px]">
          <p className="text-[12px] font-medium leading-[18px] text-foreground-secondary text-center">
            Bằng việc tiếp tục, bạn đồng ý với các điều khoản sử dụng dịch vụ
          </p>
        </div>

        {/* Button group */}
        <div className="px-[22px] pt-[12px] pb-[34px]">
          <ButtonGroup
            layout="horizontal"
            size="48"
            secondaryLabel="Tìm hiểu thêm"
            primaryLabel="Tiếp tục"
            primaryProps={{
              onClick: () => router.push("/sinhloi/activate"),
            }}
          />
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-0 inset-x-0 h-[21px] flex items-end justify-center pb-[4px] pointer-events-none">
          <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
        </div>
      </div>
    </div>
  )
}
