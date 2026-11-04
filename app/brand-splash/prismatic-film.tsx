'use client'

import Image from 'next/image'
import { prismaticMedia } from './prismatic-media'
import { useEffect, useRef, useState } from 'react'

const BRAND_ICONS = [
  { id: 'vinfast', label: 'VinFast' },
  { id: 'vinhomes', label: 'Vinhomes' },
  { id: 'vinmec', label: 'Vinmec' },
  { id: 'vinpearl', label: 'Vinpearl' },
  { id: 'vinwonders', label: 'VinWonders' },
  { id: 'xanhsm', label: 'Green SM' },
] as const

/** Path-traced glass is composited on the same black as the splash curtain. */
export function PrismaticFilm({ replay, paused, exiting = false, onComplete, onExitComplete }: { replay: number; paused: boolean; exiting?: boolean; onComplete?: () => void; onExitComplete?: () => void }) {
  const video = useRef<HTMLVideoElement>(null)
  const outVideo = useRef<HTMLVideoElement>(null)
  const [outReady, setOutReady] = useState(false)
  const poster = useRef<HTMLImageElement>(null)
  const callback = useRef(onComplete)
  const notified = useRef(false)
  const [reduced, setReduced] = useState<boolean | null>(null)
  const [ready, setReady] = useState(false)
  const [posterReady, setPosterReady] = useState(false)
  const [failed, setFailed] = useState(false)
  useEffect(() => { callback.current = onComplete }, [onComplete])
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(preference.matches)
    apply(); preference.addEventListener('change', apply)
    const timer = setTimeout(() => { if (poster.current?.complete && poster.current.naturalWidth > 0) setPosterReady(true) }, 0)
    return () => { clearTimeout(timer); preference.removeEventListener('change', apply) }
  }, [])
  useEffect(() => {
    notified.current = false
    if (video.current) video.current.currentTime = 0
    if (outVideo.current) outVideo.current.currentTime = 0
  }, [replay])
  useEffect(() => {
    if (!posterReady || !(reduced || failed) || paused || notified.current) return
    notified.current = true
    callback.current?.()
  }, [posterReady, reduced, failed, paused, replay])
  useEffect(() => {
    const element = video.current
    const out = outVideo.current
    if (paused || reduced !== false) { element?.pause(); out?.pause() }
    else if (exiting && out) { element?.pause(); void out.play().catch(() => {}) }
    else if (!exiting && element) { element.playbackRate = 1.5; void element.play().catch(() => {}) }
  }, [paused, reduced, replay, exiting])
  return <section aria-label="Logo các ứng dụng Vin hội tụ vào biểu tượng VinClub 3D" className="glass-phone__stage prism-film" data-ready={ready && !failed} data-static={reduced === true || failed} data-rendered-exit={!!prismaticMedia.out} onAnimationEnd={event => { if (event.animationName === 'prism-logo-pullback' && exiting) onExitComplete?.() }}>
    <div className="prism-film__media"><Image ref={poster} src={prismaticMedia.poster} alt="Biểu tượng VinClub bằng kính khối trong trên nền đen, viền kim loại vàng champagne riêng biệt" fill unoptimized priority sizes="(min-width:768px) 480px, 100vw" className="prism-film__poster object-contain" onLoad={() => setPosterReady(true)} />
    {reduced === false && <video ref={video} className="prism-film__video" src={prismaticMedia.intro} poster={prismaticMedia.poster} muted playsInline preload="auto" onPlaying={() => setReady(true)} onError={() => setFailed(true)} data-prism-intro="true" onEnded={() => { if (!notified.current) { notified.current = true; callback.current?.() } }} aria-label="Logo VinClub kính optical xoay 3D" />}
    </div>
    {reduced === false && <div className="prism-brand-icons" aria-label="Icon 3D hệ sinh thái">{BRAND_ICONS.map(brand => <div key={brand.id} className="prism-brand-icon"><Image src={`/brand-splash/ecosystem-apps-glass-v3/${brand.id}.png`} alt={brand.label} width={64} height={64} unoptimized loading="eager" /></div>)}</div>}
    {reduced === false && prismaticMedia.out && <video ref={outVideo} className="prism-film__out" data-playing={exiting && outReady} src={prismaticMedia.out} muted playsInline preload="auto" onPlaying={() => setOutReady(true)} onEnded={onExitComplete} onError={onExitComplete} aria-hidden={!exiting} aria-label="Zoom kính VinClub mở Home" />}
  </section>
}
