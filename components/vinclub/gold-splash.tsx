"use client";

import { useEffect, useRef, useState } from "react";
import "./gold-splash.css";

/** Pre-rendered gold logo: decode video instead of constructing a WebGL scene. */
export function GoldSplash({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(() => setDone(true), 180);
      return () => window.clearTimeout(timer);
    }
    const deadline = window.setTimeout(() => setDone(true), 2200);
    void video.current?.play().then(() => {
      if (host.current) host.current.dataset.ready = "true";
    }).catch(() => setDone(true));
    return () => window.clearTimeout(deadline);
  }, []);
  useEffect(() => { if (done) onComplete?.(); }, [done, onComplete]);
  if (done) return null;
  return <div ref={host} className="vc-gold-splash" role="status" aria-label="Đang mở VinClub">
    <video ref={video} className="vc-gold-splash-video" src="/vinclub-assets/splash/gold.mp4?v=gold-bright-2" poster="/vinclub-assets/splash/gold-poster.webp?v=gold-bright-2" autoPlay muted playsInline preload="auto" onEnded={() => setDone(true)} onError={() => setDone(true)} onPlaying={() => { if (host.current) host.current.dataset.ready = "true"; }} onTimeUpdate={event => { if (event.currentTarget.currentTime >= .72) host.current?.classList.add("vc-gold-splash-exit"); }} />
  </div>;
}
