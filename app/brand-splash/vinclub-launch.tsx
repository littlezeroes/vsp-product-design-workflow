"use client";

import { useEffect, useRef, useState } from 'react';
import VinClubSplash from './vinclub-splash';
import './vinclub-launch.css';

type Phase = 'intro' | 'waiting' | 'grow' | 'close' | 'home';

export default function VinClubLaunch() {
  const [phase, setPhase] = useState<Phase>('intro');
  const homeReady = useRef(false);
  const turnDone = useRef(false);
  const started = useRef(false);

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => {
      if (preference.matches && homeReady.current) setPhase('home');
    };
    preference.addEventListener('change', change);
    return () => preference.removeEventListener('change', change);
  }, []);

  const begin = () => {
    if (started.current) return;
    started.current = true;
    setPhase(matchMedia('(prefers-reduced-motion: reduce)').matches ? 'home' : 'grow');
  };

  return (
    <main className="vc-launch brand-splash" data-launch-phase={phase} aria-label="VinClub" aria-busy={phase !== 'home'}>
      <div className="vc-launch__stage">
        <iframe className="vc-launch__home" src="/vinclub-duo/panel-home" title="Trang chủ VinClub"
          inert={phase !== 'home'} aria-hidden={phase !== 'home'} tabIndex={phase === 'home' ? 0 : -1}
          onLoad={() => {
            homeReady.current = true;
            if (turnDone.current || matchMedia('(prefers-reduced-motion: reduce)').matches) begin();
          }} />
        <div className="vc-launch__curtain" inert={phase === 'home'} aria-hidden={phase === 'home'}
          onAnimationEnd={event => {
            if (event.animationName === 'vc-launch-logo-grow' && phase === 'grow') setPhase('close');
            if (event.target === event.currentTarget && event.animationName === 'vc-launch-circle-close' && phase === 'close') setPhase('home');
          }}>
          <div className="vc-launch__content">
            <VinClubSplash option="turn" embedded showParent holdLastFrame playbackRate={1.65} motionSrc="/brand-splash/vinclub-gold-shimmer.mp4" posterSrc="/brand-splash/vinclub-gold-shimmer-poster.png" onTurnComplete={() => {
              if (started.current) return;
              turnDone.current = true;
              if (homeReady.current) begin();
              else setPhase('waiting');
            }} />
          </div>
          <div className="vc-launch__radiance" aria-hidden="true" />
        </div>
      </div>
    </main>
  );
}
