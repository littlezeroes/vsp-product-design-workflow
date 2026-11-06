"use client";
import { useEffect, useRef } from "react";

/** One decoded light treatment, shared by Home and every card detail. */
export function CardLightVideo({ active = true, delay = 0 }: { active?: boolean; delay?: number }) {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const node = video.current;
    if (!node || !active || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => { node.currentTime = 0; void node.play().catch(() => {}); }, delay);
    return () => { clearTimeout(timer); node.pause(); };
  }, [active, delay]);
  return <video ref={video} className="vc-card-light-video" src="/vinclub-assets/cards/light-orbit-v2.mp4" muted playsInline preload="auto" aria-hidden="true"/>;
}
