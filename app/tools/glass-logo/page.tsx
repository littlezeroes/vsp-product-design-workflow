"use client"

import { useEffect, useRef, useState } from "react"
import { Header } from "@/components/ui/header"
import { FixedBottom } from "@/components/ui/fixed-bottom"
import { Button } from "@/components/ui/button"
import { Pause, Play, Download } from "lucide-react"

export default function GlassLogoPage() {
  const video = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      void video.current?.play().catch(() => {})
    }
  }, [])

  function toggle() {
    if (video.current?.paused) void video.current.play().catch(() => {})
    else video.current?.pause()
  }

  return (
    <main className="min-h-dvh bg-background text-foreground pb-[180px]">
      <div className="mx-auto max-w-[640px]">
        <Header title="VSP · Glass logo" />
        <section className="px-[22px]">
          <h1 className="pt-[24px] pb-[12px] text-2xl font-semibold">Logo kính 3D</h1>
          <video
            ref={video}
            src="/vsp-glass-logo/rotation.mp4?v=2"
            poster="/vsp-glass-logo/poster.png?v=2"
            loop muted playsInline preload="auto"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            aria-label="Logo VSP chất liệu kính xoay 360 độ"
            className="aspect-square w-full rounded-28 object-contain"
          />
          <p className="pt-[24px] pb-[12px] text-sm text-foreground-secondary">
            Kính nguyên khối dày, cạnh bo bóng và phản chiếu champagne trên nền đen. Một vòng xoay 360° trong 6 giây, lặp liên tục.
          </p>
          <a href="/vsp-glass-logo/poster.png?v=2" download className="text-sm underline underline-offset-4">Tải ảnh PNG</a>
        </section>
      </div>
      <FixedBottom className="border-t-0 pb-[8px] shadow-none">
        <div className="mx-auto flex max-w-[596px] gap-[12px]">
          <Button variant="secondary" className="flex-1" onClick={toggle} leftIcon={playing ? <Pause size={18} /> : <Play size={18} />}>
            {playing ? "Tạm dừng" : "Phát animation"}
          </Button>
          <Button variant="primary" className="flex-1" leftIcon={<Download size={18} />} onClick={() => {
            const link = document.createElement("a")
            link.href = "/vsp-glass-logo/rotation.mp4?v=2"
            link.download = "vsp-glass-logo.mp4"
            link.click()
          }}>Tải video</Button>
        </div>
        <div className="mx-auto mt-[24px] h-[5px] w-[139px] rounded-full bg-foreground" />
      </FixedBottom>
    </main>
  )
}
