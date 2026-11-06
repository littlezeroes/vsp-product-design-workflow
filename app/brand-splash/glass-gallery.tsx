'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/ui/header'
import { Button } from '@/components/ui/button'
import { FixedBottom } from '@/components/ui/fixed-bottom'
import { prismaticMedia } from './prismatic-media'
import { GlassLaunchPreview } from './glass-launch-preview'
import './glass-studies.css'

export function GlassGallery() {
  const [replay, setReplay] = useState(0)
  const [paused, setPaused] = useState(false)
  const [inspect, setInspect] = useState(true)
  function play(hold: boolean) { setInspect(hold); setPaused(false); setReplay(value => value + 1) }
  return <main className="glass-studies dark min-h-dvh bg-background text-foreground">
    <Header variant="large-title" largeTitle="VinClub / Glass + metal" />
    <section className="px-[22px] pt-[24px] pb-[12px]">
      <p className="text-xs font-semibold uppercase tracking-[.16em] text-foreground-secondary">Applied material / Dark optical glass</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">Kính trong. Viền kim loại.</h1>
      <p className="mt-4 max-w-2xl leading-7 text-foreground-secondary">Kính khối trong, viền kim loại riêng và ánh màu khúc xạ ở cạnh. Logo xoay 1,5 vòng để thấy rõ mặt trước, mặt sau và độ dày; bộ icon 3D từ Home hội tụ. Xoay xong, camera lùi ra với blur nhẹ, rồi khung splash thu tròn mở Home.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button variant="primary" size="48" onClick={() => play(false)}>Phát animation → Home</Button>
        <Button variant="secondary" size="48" aria-pressed={inspect} onClick={() => play(true)}>Xem chất liệu</Button>
        <Button variant="secondary" size="48" aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? 'Tiếp tục' : 'Tạm dừng'}</Button>
        <Link href="/brand-splash/vinclub" className="self-center text-sm underline underline-offset-4">Mở toàn màn hình ↗</Link>
      </div>
    </section>
    <section className="px-[22px] pt-[24px] pb-[12px]">
      <div className="mx-auto grid max-w-[1100px] items-start gap-6 md:grid-cols-2">
        <article data-glass-option="jewel-glass" className="overflow-hidden rounded-28 bg-secondary">
          <GlassLaunchPreview key={replay} look="jewel-glass" paused={paused} inspect={inspect} />
          <div className="p-[22px]"><h2 className="text-xl font-semibold">VinClub / Applied</h2><p className="mt-3 text-sm leading-6 text-foreground-secondary">Dùng cùng bộ icon 3D và chất liệu đang có ở Home: xe, nghỉ dưỡng, giáo dục, y tế, mua sắm và vui chơi. Giữ chữ VinClub nhỏ cùng “by VSF” phía dưới.</p><div className="mt-4 flex flex-wrap gap-4 text-sm"><a href={prismaticMedia.intro} download className="underline underline-offset-4">Tải video chất liệu 1440px</a><a href={prismaticMedia.poster} download className="underline underline-offset-4">Ảnh chất liệu</a></div></div>
        </article>
        <article className="overflow-hidden rounded-28 bg-secondary">
          <div className="relative aspect-square"><Image fill unoptimized src="/brand-splash/dark-glass-research/reference.jpg" alt="Ảnh tham khảo người dùng cung cấp: kính dày trên nền đen với cạnh tán sắc" sizes="(min-width:768px) 50vw, 100vw" className="object-contain" /></div>
          <div className="p-[22px]"><h2 className="text-xl font-semibold">Reference</h2><p className="mt-3 text-sm leading-6 text-foreground-secondary">Đối chiếu mặt tối, độ dày, cạnh sáng và các vệt tách màu. Hình do bạn cung cấp; tác giả chưa được xác minh.</p><Link href="/brand-splash/vinclub/glass-research" className="mt-4 inline-block text-sm underline underline-offset-4">Xem phân tích chi tiết ↗</Link></div>
        </article>
      </div>
    </section>
    <FixedBottom className="!relative !border-0 !shadow-none"><p className="max-w-2xl text-sm leading-6 text-foreground-secondary">Xem chất liệu giữ logo ở cuối chuyển động. Phát animation chạy toàn bộ splash và đoạn mở Home.</p><div className="mx-auto mt-6 h-[5px] w-[139px] rounded-full bg-foreground" /></FixedBottom>
  </main>
}
