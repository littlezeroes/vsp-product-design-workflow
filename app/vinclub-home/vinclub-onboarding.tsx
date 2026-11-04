"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBar } from "@/components/ui/header";
import "./vinclub-onboarding.css";

const STORIES = [
  { id: "vpoint", label: "ĐIỂM THƯỞNG", title: ["Mỗi ngày.", "Thêm VPoint."], body: "Kích hoạt hội viên. Tích điểm khi chi tiêu.", alt: "Vòng xoắn đồng VPoint vàng trên nền xanh điện" },
  { id: "ecosystem", label: "ƯU ĐÃI", title: ["Đi. Chơi.", "Tận hưởng."], body: "Mở Ưu đãi, chọn điều bạn thích.", alt: "Xe điện và kỳ nghỉ trên bục vàng nền tím" },
  { id: "privileges", label: "ĐẶC QUYỀN", title: ["Hạng mới.", "Trải nghiệm mới."], body: "Xem hạng và quyền lợi của bạn.", alt: "Thẻ hội viên và huy hiệu vàng rực rỡ" },
];

export function VinClubOnboarding({ onActivate, onClose }: { onActivate: () => void; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const closeButton = useRef<HTMLButtonElement>(null);
  const story = STORIES[index];
  useEffect(() => { closeButton.current?.focus(); }, []);
  return <section className="vc-onboarding" data-story={story.id} role="dialog" aria-modal="true" aria-label="Giới thiệu VinClub" onKeyDown={event => {
    if (event.key === "Escape") onClose();
    if (event.key === "ArrowRight") setIndex(value => Math.min(STORIES.length - 1, value + 1));
    if (event.key === "ArrowLeft") setIndex(value => Math.max(0, value - 1));
    if (event.key === "Tab") {
      const nodes = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled)'));
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }}>
    <Image className="vc-onboarding-backdrop" src={`/vinclub-onboarding/${story.id}-v2.png`} fill sizes="390px" alt={story.alt} priority />
    <header className="vc-onboarding-header">
      <StatusBar />
      <div className="vc-onboarding-bars" role="group" aria-label="Các trang giới thiệu">{STORIES.map((item, at) => <button type="button" key={item.id} aria-label={`Trang ${at + 1}: ${item.label}`} aria-current={index === at ? "step" : undefined} data-complete={at <= index || undefined} onClick={() => setIndex(at)}><span /></button>)}</div>
      <div className="vc-onboarding-nav"><span>VINCLUB</span><Button ref={closeButton} variant="secondary" size="32" aria-label="Đóng giới thiệu VinClub" onClick={onClose}><X size={20} /></Button></div>
    </header>
    <section className="vc-onboarding-content px-[22px] pt-[24px] pb-[12px]" key={story.id} aria-live="polite">
      <p className="vc-onboarding-kicker">{story.label}</p>
      <h1>{story.title[0]}<br />{story.title[1]}</h1>
      <p className="vc-onboarding-description">{story.body}</p>
      
    </section>
    <footer className="vc-onboarding-footer px-[22px]">
      <div className="vc-onboarding-step"><Button variant="secondary" size="32" disabled={index === 0} aria-label="Trang giới thiệu trước" onClick={() => setIndex(index - 1)}><ChevronLeft size={20} /></Button><span>{index + 1} / {STORIES.length}</span><Button variant="secondary" size="32" disabled={index === STORIES.length - 1} aria-label="Trang giới thiệu tiếp" onClick={() => setIndex(index + 1)}><ChevronRight size={20} /></Button></div>
      <Button variant="primary" className="vc-onboarding-continue" onClick={onActivate}>Kích hoạt hội viên<ChevronRight size={18} /></Button>
      <Button variant="secondary" className="vc-onboarding-later" onClick={onClose}>Vào Trang chủ trước</Button>
      <div className="w-[139px] h-[5px] bg-foreground" aria-hidden="true" />
    </footer>
  </section>;
}
