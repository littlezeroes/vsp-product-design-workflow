"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { offerArt } from "./offer-art";
import { Button } from "@/components/ui/button";

const BANNER = "/vinclub-duo/stories/daily-gift-ivory-v5.png";

export function HomeStory({ children, banner = BANNER }: { children: ReactNode; banner?: string }) {
  const [step, setStep] = useState<number | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const viewer = useRef<HTMLElement>(null);
  const touch = useRef<number | null>(null);
  const open = step !== null;
  const last = 3;
  const move = (delta: number) => setStep(value => value === null ? null : Math.max(0, Math.min(last, value + delta)));
  useEffect(() => {
    if (!open) return;
    viewer.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") setStep(null);
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "Tab") {
        const controls = Array.from(viewer.current?.querySelectorAll<HTMLElement>('button:not([disabled]), [tabindex="0"]') ?? []);
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("keydown", key); trigger.current?.focus(); };
  }, [open]);
  const phone = trigger.current?.closest(".vk-phone");
  return <>
    <div className="vr-home-story-frame rounded-28"><Button ref={trigger} variant="secondary" size="32" className="vr-home-story rounded-28" aria-label="Mở story Quà mỗi ngày" onClick={() => setStep(0)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="vr-home-story-banner" src={banner} alt="" />
      <span className="vr-home-story-shade" aria-hidden="true" />
      <span className="vr-home-story-label"><small>VinClub</small><strong>Quà mỗi ngày</strong></span>
    </Button></div>
    {open && phone && createPortal(<section ref={viewer} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Story Quà mỗi ngày" className="vr-story-viewer vr-home-story-viewer" onTouchStart={event => { touch.current = (event.target as Element).closest("canvas,button") ? null : event.touches[0].clientX; }} onTouchEnd={event => { if (touch.current !== null) { const delta = event.changedTouches[0].clientX - touch.current; if (Math.abs(delta) > 50) move(delta < 0 ? 1 : -1); } touch.current = null; }}>
      <div className="vr-story-progress">{[0, 1, 2, 3].map(index => <Button key={index} variant="secondary" size="32" aria-label={`Story ${index + 1}`} aria-current={step === index ? "step" : undefined} onClick={() => setStep(index)}><span data-seen={index <= step! || undefined} /></Button>)}</div>
      <header className="vr-story-nav"><div><strong>VinClub</strong><small>Quà mỗi ngày</small></div><Button variant="secondary" size="32" aria-label="Đóng story" onClick={() => setStep(null)}><X size={20} /></Button></header>
      {step === 0 ? <div className="vr-home-story-intro">
        {/* eslint-disable-next-line @next/next/no-img-element */}<img src={banner} alt="" />
        <div><h2>Quà vui mỗi ngày</h2><p>Chạm một chút, khám phá quà mới.</p><Button variant="secondary" size="48" onClick={() => setStep(1)}>Mở thẻ cào</Button></div>
      </div> : step === 1 ? <div className="vr-story-content">{children}</div> : <div className="vr-story-campaign" data-campaign={step === 2 ? "ride" : "shop"}><small>{step === 2 ? "GreenSM" : "WinMart"}</small><h2>{step === 2 ? "Đi vui hơn" : "Mua sắm thảnh thơi"}</h2><img src={offerArt(step === 2 ? "xanhsm" : "winmart")} alt="" /><p>{step === 2 ? "Hoàn đến 15% · Mọi chuyến" : "Giảm đến 10% · Tối đa 100.000đ"}</p><Button variant="secondary" size="48" onClick={() => { setStep(null); window.dispatchEvent(new Event("vinclub:offers")); }}>Xem ưu đãi</Button></div>}
      <footer className="vr-story-controls"><Button variant="secondary" size="32" aria-label="Story trước" disabled={step === 0} onClick={() => move(-1)}><ChevronLeft size={20} /></Button><Button variant="secondary" size="32" aria-label="Story tiếp theo" disabled={step === last} onClick={() => move(1)}><ChevronRight size={20} /></Button></footer>
    </section>, phone)}
  </>;
}
