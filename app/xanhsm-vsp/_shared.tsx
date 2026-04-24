/* Shared layout primitives cho toàn bộ xanhsm-vsp.
 * File không phải route (prefix `_` để Next.js bỏ qua nếu có, nhưng
 * nằm trong folder app nên vẫn cần safe — dùng trong import path).
 */

"use client"

import * as React from "react"

export const BG_GRAD = "linear-gradient(180deg, #c9e7e8 0%, #e8f3f3 45%, #f4f6f7 100%)"
export const XANH_TIFF = "#86c9cc"
export const XANH_MINT = "#c9e7e8"
export const XANH_DARK = "#0b5457"
export const VSP_GRAD = "linear-gradient(135deg, #28bdbf 0%, #0b5457 100%)"

export function StatusBar({ time = "21:44" }: { time?: string }) {
  return (
    <div className="h-[54px] px-[22px] flex items-end justify-between pb-[6px]">
      <span className="text-[15px] font-semibold">{time}</span>
      <div className="flex items-center gap-[6px]">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="0.5"/><rect x="4" y="5" width="3" height="7" rx="0.5"/><rect x="8" y="2" width="3" height="10" rx="0.5"/><rect x="12" y="0" width="3" height="12" rx="0.5"/></svg>
        <span className="text-[11px] font-bold">5G</span>
        <div className="flex items-center gap-[1px]">
          <div className="w-[22px] h-[11px] rounded-[3px] border border-current flex items-center p-[1px]">
            <div className="flex-1 h-full bg-current rounded-[1.5px]" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function HomeIndicator() {
  return (
    <div className="w-full h-[21px] flex items-end justify-center pb-[4px] shrink-0">
      <div className="w-[139px] h-[5px] rounded-full bg-foreground" />
    </div>
  )
}

export function MapTexture({ opacity = 0.06 }: { opacity?: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity,
        backgroundImage:
          "linear-gradient(135deg, transparent 40%, #5b9fa2 40%, #5b9fa2 41%, transparent 41%), linear-gradient(45deg, transparent 40%, #5b9fa2 40%, #5b9fa2 41%, transparent 41%)",
        backgroundSize: "64px 64px",
      }}
    />
  )
}

export function Frame({ children, withTexture = true }: { children: React.ReactNode; withTexture?: boolean }) {
  return (
    <div className="relative w-full max-w-[390px] min-h-screen flex flex-col" style={{ background: BG_GRAD }}>
      {withTexture && <MapTexture />}
      <div className="relative z-10 flex-1 flex flex-col">{children}</div>
      <HomeIndicator />
    </div>
  )
}
