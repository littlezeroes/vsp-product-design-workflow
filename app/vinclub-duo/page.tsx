"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Maximize2, Minimize2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./duo.css";

export default function DuoPage() {
  const [angle, setAngle] = useState(0);
  const [playing, setPlaying] = useState(false);
  const frame = useRef(0);
  const current = useRef(0);
  const stage = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const observer = new ResizeObserver(entries => setScale(Math.min(1, entries[0].contentRect.width / 780)));
    if (stage.current) observer.observe(stage.current);
    return () => { observer.disconnect(); cancelAnimationFrame(frame.current); };
  }, []);
  const update = (value: number) => { current.current = value; setAngle(value); };
  const animate = useCallback((target: number, onEnd?: () => void) => {
    cancelAnimationFrame(frame.current);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { update(target); setPlaying(false); if(target===0)document.querySelector<HTMLIFrameElement>('iframe[title="Home VinClub màn ngoài"]')?.contentWindow?.postMessage({type:"duo-cover-show"},location.origin); onEnd?.(); return; }
    setPlaying(true);
    const from = current.current;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1400);
      const eased = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      update(from + (target - from) * eased);
      if (t < 1) frame.current = requestAnimationFrame(tick);
      else { setPlaying(false); if(target===0)document.querySelector<HTMLIFrameElement>('iframe[title="Home VinClub màn ngoài"]')?.contentWindow?.postMessage({type:"duo-cover-show"},location.origin); onEnd?.(); }
    };
    frame.current = requestAnimationFrame(tick);
  }, []);
  useEffect(() => {
    const receive = (event: MessageEvent) => { if (event.origin === location.origin && event.data?.type === "duo-open") animate(180,()=>{const view=event.data.view;if(!view)return;const inner=document.querySelector<HTMLIFrameElement>('iframe[title="Home và Trải nghiệm VinClub"]');inner?.contentWindow?.postMessage({type:["wallet","ai"].includes(view)?"duo-left":"duo-right",view},location.origin);}); };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [animate]);
  const demo = () => { const replay = () => { const cover = document.querySelector<HTMLIFrameElement>('iframe[title="Home VinClub màn ngoài"]'); cover?.contentWindow?.postMessage({type:"duo-points"},location.origin); }; if(current.current > 0) animate(0,replay); else replay(); };
  const open = angle >= 180;
  return <main className="duo-mode bg-background text-foreground">
    <header className="duo-heading px-[22px]"><span className="text-foreground-secondary">VINCLUB / IPHONE DUO</span><h1>Gập gọn. Mở trọn.</h1><p className="text-foreground-secondary">Một chiếc thẻ khi gập. Home và Trải nghiệm khi mở.</p></header>
    <div className="duo-stage" ref={stage} style={{ height: 590 * scale } as CSSProperties}>
      <div className="duo-rig" style={{ "--fold": `${180 - angle}deg`, "--cover-angle": `${-angle}deg`, "--center": `${-175 * (1 - angle / 180)}px`, "--shade": (1 - angle / 180) * .65, "--fold-blur": `${Math.sin(angle / 180 * Math.PI) * 4}px`, "--reveal-blur": `${18 * Math.pow(1 - Math.max(0, (angle - 90) / 90), 2)}px`, "--cover-blur": `${Math.min(1, angle / 75) * 10}px`, transform: `translateX(-50%) scale(${scale})` } as CSSProperties} data-angle={Math.round(angle)}>
        <div className="duo-phone">
          <div className="duo-right duo-metal rounded-28"><div className="duo-inner-half right-half"><iframe title="Trải nghiệm khi gập" src="/vinclub-duo/home?preview=right" tabIndex={-1}/></div><div className="duo-shade" /><div className="duo-side-key" /></div>
          <div className="duo-left duo-metal rounded-28" style={{ visibility: angle < 90 ? "hidden" : "visible" }}>
            <div className="duo-inside"><div className="duo-inner-half left-half"><iframe title="Home khi gập" src="/vinclub-duo/home?preview=left" tabIndex={-1}/></div><div className="duo-shade" /></div>
            </div>
          <div className="duo-exterior duo-metal rounded-28">
            <div className="duo-cover rounded-28 bg-background">
              <div className="duo-camera" aria-hidden="true" />
              <iframe title="Home VinClub màn ngoài" src="/vinclub-duo/cover" />
            </div>
          </div>
          <div className="duo-hinge" aria-hidden="true" />
          <div className={`duo-live rounded-28 ${open ? "is-visible" : ""}`} inert={!open} aria-hidden={!open}>
            <iframe title="Home và Trải nghiệm VinClub" src="/vinclub-duo/home" tabIndex={open ? 0 : -1} />
          </div>
        </div>
      </div>
    </div>
    <footer className="duo-controls px-[22px]">
      <div className="duo-control-row"><Button variant="secondary" disabled={playing} onClick={()=>animate(current.current > 90 ? 0 : 180)} leftIcon={angle > 90 ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}>{angle > 90 ? "Gập điện thoại" : "Mở điện thoại"}</Button><Button variant="secondary" onClick={demo} disabled={playing} leftIcon={<Play size={15}/>}>Tích điểm 3D</Button></div>
      <label className="duo-slider"><span className="text-foreground-secondary">Góc mở</span><input aria-label="Góc mở điện thoại" type="range" min="0" max="180" value={angle} onChange={e=>{cancelAnimationFrame(frame.current);setPlaying(false);update(Number(e.target.value));}} /><output>{Math.round(angle)}°</output></label>
      <p className="text-foreground-secondary"><a href="/vinclub-duo/points-success.mp4" target="_blank" rel="noreferrer">Video tích điểm 3D ↗</a> · Tham chiếu chuyển động: <a href="https://www.apple.com/iphone-duo/" target="_blank" rel="noreferrer">Apple · Take a closer look ↗</a></p>
    </footer>
  </main>;
}
