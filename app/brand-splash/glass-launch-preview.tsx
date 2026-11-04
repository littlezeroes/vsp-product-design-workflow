'use client'

import { useEffect, useRef, useState } from 'react'
import { FixedBottom } from '@/components/ui/fixed-bottom'
import { GlassScene } from './glass-scene'
import type { GlassId } from './glass-options'
import { prismaticMedia } from './prismatic-media'

type Phase = 'intro' | 'hold' | 'out' | 'close' | 'home'

/** Key this component by replay to reset both the renderer and the transition. */
export function GlassLaunchPreview({ look, paused, inspect = false, onComplete }: { look: GlassId; paused: boolean; inspect?: boolean; onComplete?: () => void }) {
  const homeFrame = useRef<HTMLIFrameElement>(null)
  const [phase, setPhase] = useState<Phase>('intro')
  const [introDone, setIntroDone] = useState(false)
  const [destinationReady, setDestinationReady] = useState(false)
  const [homeReady, setHomeReady] = useState(Boolean(onComplete))
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (onComplete) return
    // A cached server-rendered iframe can finish before React attaches onLoad.
    const frame = homeFrame.current
    const checkReady = () => {
      if (frame?.contentDocument?.readyState === 'complete' && frame.contentWindow?.location.pathname === '/vinclub-home') setHomeReady(true)
    }
    const timer = setTimeout(checkReady, 0)
    frame?.addEventListener('load', checkReady)
    return () => { clearTimeout(timer); frame?.removeEventListener('load', checkReady) }
  }, [onComplete])
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update(); media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (phase !== 'intro' || !introDone || paused || inspect) return
    const timer = setTimeout(() => setPhase(reduced && homeReady ? 'home' : 'hold'), 0)
    return () => clearTimeout(timer)
  }, [phase, introDone, homeReady, reduced, paused, inspect])
  useEffect(() => {
    if (phase !== 'hold' || paused || !homeReady) return
    const timer = setTimeout(() => setPhase(reduced ? 'home' : 'out'), 0)
    return () => clearTimeout(timer)
  }, [phase, paused, homeReady, reduced])
  useEffect(() => {
    if (phase !== 'out' || paused) return
    // Covers disabled animations and a tab being backgrounded during the exit.
    const timer = setTimeout(() => setPhase(reduced || (look === 'jewel-glass' && !prismaticMedia.out) ? 'home' : 'close'), reduced ? 0 : look === 'jewel-glass' ? prismaticMedia.out ? 1800 : 720 : 780)
    return () => clearTimeout(timer)
  }, [phase, reduced, paused, look])
  useEffect(() => {
    if (phase !== 'close' || paused) return
    const timer = setTimeout(() => setPhase('home'), reduced ? 0 : 420)
    return () => clearTimeout(timer)
  }, [phase, paused, reduced])
  useEffect(() => {
    if (phase !== 'home' || onComplete) return
    let cancelled = false
    const frameDocument = homeFrame.current?.contentDocument
    const images = Array.from(frameDocument?.querySelectorAll('img') ?? []).slice(0, 8)
    const assets = Promise.all([frameDocument?.fonts.ready, ...images.map(image => image.decode().catch(() => {}))])
    let minimumTimer: ReturnType<typeof setTimeout>, deadlineTimer: ReturnType<typeof setTimeout>
    const minimum = new Promise(resolve => { minimumTimer = setTimeout(resolve, 600) })
    const deadline = new Promise(resolve => { deadlineTimer = setTimeout(resolve, 1800) })
    void Promise.all([minimum, Promise.race([assets, deadline])]).then(() => { if (!cancelled) setDestinationReady(true) })
    return () => { cancelled = true; clearTimeout(minimumTimer); clearTimeout(deadlineTimer) }
  }, [phase, onComplete])
  useEffect(() => { if (phase === 'home') onComplete?.() }, [phase, onComplete])
  return <div className="glass-phone glass-launch" data-look={look} data-phase={phase} data-intro-done={introDone} data-home-ready={homeReady} data-paused={paused} data-inspect={inspect} aria-label="VinClub — Splash" aria-busy={!introDone || (!inspect && phase !== 'home')}>
    {!onComplete && <div className="glass-launch__destination bg-background text-foreground" aria-busy={!destinationReady} inert={phase !== 'home'} aria-hidden={phase !== 'home'}>
      <iframe ref={homeFrame} src="/vinclub-home?embedded=1&launch=0" title="Trang chủ VinClub" className="glass-launch__iframe" tabIndex={phase === 'home' ? 0 : -1} onLoad={() => setHomeReady(true)} />
    </div>}
    {phase !== 'home' && <div className="glass-launch__curtain" onAnimationEnd={event => { if (event.target === event.currentTarget && (event.animationName === 'prism-circle-close' || event.animationName === 'prism-circular-exit')) setPhase('home') }}>
      <div className="glass-phone__light" />
      <GlassScene look={look} motion="liquid" exiting={phase === 'out' || phase === 'close'} replay={0} paused={paused} duration={look === 'jewel-glass' ? 3 : 2.4} onComplete={() => setIntroDone(true)} onExitComplete={() => setPhase(current => current === 'out' ? 'close' : current)} />
      <header className="glass-phone__status" aria-hidden="true"><span>9:41</span><span>5G ▰</span></header>
      <section className="glass-phone__identity" aria-label="VinClub by VSF"><div className="glass-phone__wordmark" /><div className="glass-phone__parent"><span>by</span><span>VSF</span></div></section>
      <FixedBottom className="!absolute !border-0 !bg-transparent !p-0 !shadow-none"><div className="glass-phone__home h-[5px] w-[139px] rounded-full" aria-hidden="true" /></FixedBottom>
    </div>}
  </div>
}
