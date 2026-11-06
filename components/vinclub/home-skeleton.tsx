"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import "./home-skeleton.css";

export function HomeSkeleton({ leaving = false, matchHome = false }: { leaving?: boolean; matchHome?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<{ sheet: number; blocks: { x: number; y: number; w: number; h: number; dark: boolean }[] } | null>(null);
  useLayoutEffect(() => {
    if (!matchHome || !root.current) return;
    const phone = root.current.closest(".vk-phone");
    if (!phone) return;
    const measure = () => {
      const origin = root.current!.getBoundingClientRect();
      const sheet = phone.querySelector(".vr-sheet")?.getBoundingClientRect();
      const top = sheet ? sheet.top - origin.top : origin.height * .45;
      const candidates = Array.from(phone.querySelectorAll<HTMLElement>(".vk-status,.vk-bar button,.vr-brand small,.vr-brand h1,.vr-brand .vs-pts-num,.vr-brand .vr-tier-metal,.vr-pouches,.vr-sheet h2,.vr-sheet article,.vr-sheet section,.vr-sheet > div"));
      const selected = candidates.filter(el => !candidates.some(parent => parent !== el && parent.contains(el) && !parent.matches(".vr-brand")));
      const blocks = selected.map(el => { const r = el.getBoundingClientRect(); return { x:r.left-origin.left,y:r.top-origin.top,w:r.width,h:r.height,dark:r.top-origin.top<top }; }).filter(r => r.w>0 && r.h>0 && r.y<origin.height && r.y+r.h>0);
      setGeometry({sheet:top,blocks});
    };
    measure();
    const observer = new ResizeObserver(measure); observer.observe(phone); const stack = phone.querySelector(".vr-stack"); if (stack) observer.observe(stack);
    const frame = requestAnimationFrame(measure);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [matchHome]);
  if (geometry) return <div ref={root} className="vk-home-skeleton vk-home-skeleton--matched" data-leaving={leaving || undefined} role="status" aria-label="Đang tải Trang chủ"><div className="vk-skeleton-matched-sheet" style={{top:geometry.sheet}} />{geometry.blocks.map((r,i)=><Skeleton key={i} variant="card" className={r.dark ? "vk-skeleton-dark" : ""} style={{position:"absolute",left:r.x,top:r.y,width:r.w,height:r.h}} />)}</div>;

  return <div ref={root} className="vk-home-skeleton" data-leaving={leaving || undefined} role="status" aria-label="Đang tải Trang chủ"><div className="vk-skeleton-hero"><div className="vk-skeleton-status">9:41</div><Skeleton variant="text" className="w-[112px]" /><Skeleton variant="text" className="mt-[12px] h-[40px] w-[160px]" /><Skeleton variant="card" className="mt-[24px] h-[136px] w-full" /></div><div className="vk-skeleton-sheet"><div className="grid grid-cols-2 gap-[12px]"><Skeleton variant="card" className="h-[112px]" /><Skeleton variant="card" className="h-[112px]" /></div><Skeleton variant="card" className="mt-[28px] h-[200px] w-full" /><Skeleton variant="text" className="mt-[32px] w-[190px]" /><Skeleton variant="card" className="mt-[12px] h-[280px] w-full" /></div></div>;
}
