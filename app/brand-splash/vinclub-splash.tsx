"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from 'react';
import { StatusBar } from '@/components/ui/header';
import { FixedBottom } from '@/components/ui/fixed-bottom';
import type { SplashOption } from './vinclub-options';
import './vinclub-options.css';

export default function VinClubSplash({ option = 'light', embedded = false, replay = 0, playbackRate = 1, onTurnComplete, showParent = false, holdLastFrame = false, motionSrc = "/brand-splash/vinclub-spin-centered.mp4", posterSrc = "/brand-splash/vinclub-source-gold.png" }: {
  option?: SplashOption; embedded?: boolean; replay?: number; playbackRate?: number; onTurnComplete?: () => void; showParent?: boolean; holdLastFrame?: boolean; motionSrc?: string; posterSrc?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(true);
  const [ready, setReady] = useState(false);
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(preference.matches);
    apply(); preference.addEventListener('change', apply);
    return () => preference.removeEventListener('change', apply);
  }, []);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    element.currentTime = 0;
    element.playbackRate = playbackRate;
    if (reduced) element.pause();
    else void element.play().catch(() => {});
  }, [replay, reduced, playbackRate]);
  return (
    <main className="vc-splash brand-splash" data-option={option} data-embedded={embedded} data-reduced={reduced} aria-label="VinClub">
      <div className="vc-splash__screen" key={replay}>
        <header className="vc-splash__header"><StatusBar /></header>
        <section className="vc-splash__hero px-[22px]" aria-label="Biểu tượng VinClub">
          <div className="vc-splash__art">
            <div className="vc-splash__outline" aria-hidden="true" />
            <div className="vc-splash__object">
              <Image unoptimized src={posterSrc} alt="" className="vc-splash__gold" width={768} height={768} fetchPriority="high" />
              {option === 'turn' && !reduced && (
                <video ref={video} src={motionSrc} muted playsInline preload="auto"
                  className="vc-splash__turn" data-visible={ready && (!finished || holdLastFrame)}
                  onPlaying={() => { setReady(true); setFinished(false); }}
                  onEnded={() => { setFinished(true); onTurnComplete?.(); }} onError={() => { setFinished(true); onTurnComplete?.(); }} aria-hidden="true" tabIndex={-1} />
              )}
              <div className="vc-splash__light" aria-hidden="true" />
            </div>
          </div>
        </section>
        <section className="vc-splash__identity px-[22px]" aria-label={showParent ? "VinClub by VSF" : "VinClub — Kết nối giá trị, trải nghiệm tinh hoa"}>
          <h1 className="sr-only">VinClub</h1>
          <div className="vc-splash__wordmark" role="img" aria-label="VinClub" />
          {showParent ? (
            <div className="vc-splash__parent" aria-label="by VSF">
              <span className="vc-splash__by">by</span>
              <div className="vc-splash__parent-mark"><span>VSF</span></div>
            </div>
          ) : <p className="vc-splash__tagline">Kết nối giá trị · Trải nghiệm tinh hoa</p>}
        </section>
        <FixedBottom className="vc-splash__bottom !absolute !border-0 !bg-transparent !p-0 !shadow-none">
          <div className="vc-splash__home mx-auto h-[5px] w-[139px] rounded-full bg-foreground" />
        </FixedBottom>
      </div>
    </main>
  );
}
