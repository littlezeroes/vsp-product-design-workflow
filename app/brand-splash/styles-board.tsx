'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/ui/header'
import { Button } from '@/components/ui/button'
import { FixedBottom } from '@/components/ui/fixed-bottom'
import { directions } from './style-directions'

const base = '/brand-splash/style-research/'
const filters = [{ id: 'all', label: 'Tất cả 8 hướng' }, { id: 'light', label: 'Trong & sáng' }, { id: 'dark', label: 'Kính tối' }, { id: 'color', label: 'Màu & đổi sắc' }]

export function StylesBoard() {
  const [filter, setFilter] = useState('all')
  const [playing, setPlaying] = useState<string[]>([])
  const visible = directions.filter(d => filter === 'all' || (filter === 'picks' ? d.pick : d.group === filter))
  return <main className="min-h-screen bg-background text-foreground">
    <Header variant="large-title" largeTitle="VinClub / Material research" />
    <section className="px-[22px] pt-[24px] pb-[12px]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground-secondary">3D · Premium · Glass / 08 directions</p>
      <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">Tám chất liệu.<br />Tám cách xuất hiện.</h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-foreground-secondary">Một vòng khám phá mới cho splash VinClub: từ kính quang học tinh khiết đến sapphire, kính khói và vật liệu đổi sắc. Mỗi hướng có một cách chuyển động riêng.</p>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground-secondary">Đây là bảng nghiên cứu với hình và clip của các studio được ghi nguồn, chưa phải 8 animation VinClub hoàn thiện. Phần “Motion cho VinClub” là ý tưởng đề xuất; thời lượng là dự kiến.</p>
      <Link href="/brand-splash/vinclub/glass" className="mt-5 inline-block font-semibold underline underline-offset-4">Xem 4 option 3D kết hợp mới ↗</Link>
      <div className="mt-6 flex flex-wrap gap-2" aria-label="Lọc hướng chất liệu">
        <Button variant="primary" size="48" aria-pressed={filter === 'picks'} onClick={() => setFilter(filter === 'picks' ? 'all' : 'picks')}>3 hướng ưu tiên</Button>
        {filters.map(f => <Button key={f.id} variant="secondary" size="48" aria-pressed={filter === f.id} className={filter === f.id ? 'ring-2 ring-foreground' : ''} onClick={() => setFilter(f.id)}>{f.label}</Button>)}
      </div>
    </section>
    <section className="px-[22px] pt-[24px] pb-[12px]">
      <div className="mb-3 flex items-baseline justify-between gap-4"><h2 className="text-xl font-semibold">Chọn cảm giác trước, dựng chuyển động sau</h2><span className="shrink-0 text-sm text-foreground-secondary">{visible.length} hướng</span></div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {visible.map(d => <article key={d.id} data-direction={d.id} className="overflow-hidden rounded-28 bg-secondary">
          <div className="relative aspect-[16/10] overflow-hidden">
            {d.film && playing.includes(d.id) ? <video className="h-full w-full object-contain" src={base + d.film} controls autoPlay muted playsInline preload="metadata" aria-label={`Clip tham khảo ${d.name}`} /> : <Image src={base + d.image} alt={`${d.project} — tham khảo ${d.vn}`} fill unoptimized sizes="(min-width:1280px) 25vw, (min-width:768px) 50vw, 100vw" className="object-cover" />}
          </div>
          <div className="p-[22px]">
            <div className="flex items-center justify-between text-xs font-medium text-foreground-secondary"><span>/{d.id}</span>{d.pick && <span>ƯU TIÊN THỬ</span>}</div>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">{d.name}</h3>
            <p className="mt-1 text-sm font-medium">{d.vn}</p>
            <p className="mt-4 text-sm leading-6 text-foreground-secondary">{d.mood}</p>
            <p className="mt-3 text-sm leading-6 text-foreground-secondary">{d.material}</p>
            <div className="mt-5 rounded-14 bg-background p-4"><p className="text-xs font-semibold uppercase tracking-wide">Motion cho VinClub · {d.duration}</p><p className="mt-2 text-sm leading-6">{d.motion}</p></div>
            {d.film && <Button variant="secondary" size="32" className="mt-4" onClick={() => setPlaying(p => p.includes(d.id) ? p.filter(id => id !== d.id) : [...p, d.id])}>{playing.includes(d.id) ? 'Về hình tham khảo' : 'Xem clip chất liệu'}</Button>}
            <a className="mt-5 block text-sm font-semibold underline underline-offset-4" href={d.url} target="_blank" rel="noreferrer">{d.studio} ↗</a>
            <p className="mt-1 text-xs leading-5 text-foreground-secondary">{d.project} · hình/film tham khảo</p>
          </div>
        </article>)}
      </div>
    </section>
    <section className="px-[22px] pt-[24px] pb-[12px]"><h2 className="text-xl font-semibold">Nên thử hướng nào trước?</h2><p className="mt-3 max-w-3xl leading-7 text-foreground-secondary">01 Clear optical nếu muốn sang và tinh khiết. 03 Smoked glass nếu muốn tương phản mạnh. 06 Sapphire + titanium nếu muốn cảm giác vật phẩm cao cấp. 04 Liquid glass là hướng thử thêm khi ưu tiên khoảnh khắc bất ngờ.</p></section>
    <FixedBottom className="!relative !border-0 !shadow-none"><p className="text-xs leading-5 text-foreground-secondary">Visual credits: Dabarti · Tendril · Found · FutureDeluxe. Các clip trên trang là trích đoạn nghiên cứu chất liệu từ nguồn, không minh họa chính xác chuyển động đề xuất.</p><div className="mx-auto mt-6 h-[5px] w-[139px] rounded-full bg-foreground" /></FixedBottom>
  </main>
}
