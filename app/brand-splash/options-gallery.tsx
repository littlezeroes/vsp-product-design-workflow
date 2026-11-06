"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, RotateCcw, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/ui/header';
import { FixedBottom } from '@/components/ui/fixed-bottom';
import VinClubSplash from './vinclub-splash';
import { splashOptions } from './vinclub-options';
import './vinclub-options.css';

export default function SplashOptionsGallery() {
  const [replay, setReplay] = useState(0);
  const [individual, setIndividual] = useState<Record<string, number>>({});
  return (
    <main className="splash-options">
      <Header variant="large-title" largeTitle="VinClub / Splash motion" />
      <section className="px-[22px] pt-[24px] pb-[12px]">
        <div className="flex flex-wrap items-start justify-between gap-[16px]">
          <div>
            <p className="text-[12px] font-medium text-foreground-secondary">MOTION STUDY / 01 NOV 2026</p>
            <h2 className="mt-[8px] text-[24px] font-semibold leading-[32px]">Một biểu tượng lớn. Năm cách xuất hiện.</h2>
            <p className="mt-[8px] max-w-[760px] text-[14px] leading-[22px] text-foreground-secondary">Logo lớn hơn khoảng 30% so với bản cũ. Nền đen, vàng VinClub, đúng wordmark gốc. Mỗi hướng chạy một lần, trong khoảng 1,6–2 giây, rồi giữ nhận diện.</p>
          </div>
          <Button variant="primary" size="32" onClick={() => setReplay(value => value + 1)}><RotateCcw size={15} />Phát lại cả 5</Button>
        </div>
      </section>
      <section className="px-[22px] pt-[32px] pb-[24px]" aria-label="Năm phương án splash animation">
        <div className="splash-options__grid">
          {splashOptions.map(option => (
            <article key={option.id}>
              <div className="splash-options__phone rounded-28" data-preview={option.id}>
                <VinClubSplash option={option.id} embedded replay={replay + (individual[option.id] ?? 0)} />
              </div>
              <div className="pt-[24px] pb-[12px]">
                <div className="flex items-start justify-between gap-[8px]">
                  <h3 className="text-[16px] font-semibold">{option.number} / {option.name}</h3>
                  <span className="shrink-0 text-[12px] text-foreground-secondary">{option.duration}</span>
                </div>
                <p className="mt-[8px] min-h-[66px] text-[13px] leading-[22px] text-foreground-secondary">{option.description}</p>
                <p className="mt-[12px] min-h-[40px] text-[11px] leading-[18px] text-foreground-secondary">{option.timing}</p>
                <div className="mt-[16px] flex flex-wrap gap-[8px]">
                  <Button variant="secondary" size="32" aria-label={`Phát lại ${option.name}`} onClick={() => setIndividual(values => ({ ...values, [option.id]: (values[option.id] ?? 0) + 1 }))}><Play size={14} />Phát lại</Button>
                  <Link className="inline-flex min-h-[32px] items-center gap-[4px] text-[12px] font-medium underline underline-offset-4" href={`/brand-splash/vinclub?option=${option.id}`}>Toàn màn hình<ArrowUpRight size={13} /></Link>
                </div>
                <a href={option.href} target="_blank" rel="noreferrer" className="mt-[16px] inline-flex items-center gap-[4px] text-[12px] text-foreground-secondary underline underline-offset-4">{option.reference}<ArrowUpRight size={12} /></a>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="px-[22px] pt-[24px] pb-[12px]">
        <h2 className="text-[16px] font-semibold">Gợi ý chọn hướng</h2>
        <p className="mt-[8px] max-w-[900px] text-[14px] leading-[22px] text-foreground-secondary">01 hợp mở app hằng ngày: nhận diện xuất hiện nhanh, chuyển động vừa đủ. 02 giữ chất kim loại 3D của video trước. 05 tạo ấn tượng mạnh hơn khi mở lần đầu. Đây là các hướng motion VinClub đề xuất từ nghiên cứu, không phải bản sao của những app tham khảo.</p>
      </section>
      <FixedBottom className="splash-options__footer !relative !border-0 !shadow-none">
        <p className="text-[12px] text-foreground-secondary">Có chế độ giảm chuyển động: tự giữ logo tĩnh theo cài đặt thiết bị.</p>
        <div className="splash-options__indicator" />
      </FixedBottom>
    </main>
  );
}
