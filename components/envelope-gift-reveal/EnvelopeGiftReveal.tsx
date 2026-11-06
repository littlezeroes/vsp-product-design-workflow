"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnvelopeScene } from "./EnvelopeScene";
import { HEADLINE, OPEN, POLISH, REDUCED_MS, RESET, REVEAL } from "./motion";
import { GIFT, LAYOUT, screenLayout } from "./theme";
import { clamp01, easeInOut, easeOut, frameOf, PHASE, useEnvelope, type EnvelopeValues } from "./use-envelope";
import { cubicBezier } from "./bezier";
import "./envelope.css";

export type EnvelopeGiftRevealProps = { autoPlay?: boolean; onShop?: () => void };
const textEase = cubicBezier(...POLISH.easeOut);

export function EnvelopeGiftReveal({ autoPlay = false, onShop }: EnvelopeGiftRevealProps) {
  const root = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(false);
  const [phase, setPhase] = useState<number>(PHASE.sealed);
  const phaseRef = useRef<number>(PHASE.sealed);
  const geometry = useRef({ width: 393, height: 852, scale: 1, lay: screenLayout(852, 54, 34) });
  const pointer = useRef<{ id: number; y: number; time: number; velocity: number } | null>(null);
  const render = useCallback((v: EnvelopeValues) => {
    const el = root.current;
    if (!el) return;
    const f = frameOf(v, reduced), { lay, scale } = geometry.current;
    const css = (name: string, val: string | number) => el.style.setProperty(`--${name}`, String(val));
    const angle = f.reset > 0 ? 0 : clamp01(f.p / OPEN.flapShare) * 180 + f.breath;
    const split = clamp01(clamp01(f.p / OPEN.flapShare) * 180 / OPEN.sealSplitDeg);
    const out = f.reset > 0 ? 0 : clamp01((f.p - OPEN.flapShare) / (1 - OPEN.flapShare));
    const settle = f.reset > 0 ? 0 : 16 * clamp01(f.p / OPEN.flapShare);
    const insideY = lay.envTop + settle + 18 + LAYOUT.cardH * LAYOUT.cardInScale / 2 - out * OPEN.cardRise;
    const k = f.fly, finalY = lay.cardTop + LAYOUT.cardH / 2;
    const cardY = insideY + (finalY - insideY) * k - 36 * Math.sin(Math.PI * k);
    const u = f.flipT - 1;
    const turn = 1 + (REVEAL.flipBack + 1) * u ** 3 + REVEAL.flipBack * u ** 2;
    const cardScale = (LAYOUT.cardInScale + (1 - LAYOUT.cardInScale) * easeInOut(k)) * (1 + REVEAL.flipLift * Math.sin(Math.PI * f.flipT));
    const flying = f.after >= 0 && f.reset === 0;
    css("env-y", `${reduced ? lay.envTop : lay.envTop + settle + (f.reset > 0 ? 0 : f.drop ** 2 * 520) + f.float}px`);
    css("env-opacity", f.reset > 0 ? f.resetIn : reduced ? 1 - clamp01(f.p) : 1 - f.drop);
    css("env-scale", scale * (f.reset > 0 ? .96 + .04 * f.resetIn : 1));
    css("angle", `${reduced ? 0 : -angle}deg`);
    css("curl", `${reduced ? 0 : OPEN.curlDeg * Math.sin(Math.PI * Math.min(180, angle) / 180)}deg`);
    css("flap-front", angle < 90 ? 1 : 0); css("flap-back", angle >= 90 ? 1 : 0);
    css("seal-opacity", 1 - clamp01((split - .55) / .45));
    css("seal-pop", 1 + .08 * Math.sin(Math.PI * clamp01(split * 2.5)));
    css("seal-left-x", `${-12 * split}px`); css("seal-left-y", `${10 * split ** 2}px`); css("seal-left-r", `${-.3 * split}rad`);
    css("seal-right-x", `${12 * split}px`); css("seal-right-y", `${12 * split ** 2}px`); css("seal-right-r", `${.36 * split}rad`);
    css("inside-opacity", flying || reduced ? 0 : 1);
    css("inside-y", `${cardY - lay.envTop}px`);
    css("card-y", `${reduced ? finalY : cardY}px`);
    css("card-scale", (reduced ? 1 : cardScale) * scale);
    css("inside-scale", cardScale);
    css("card-rotate", `${reduced ? 0 : f.tilt0 * (1 - k)}deg`);
    css("card-flip", `${reduced ? 180 : turn * 180}deg`);
    const cardOpacity = reduced ? clamp01(f.after / REDUCED_MS) : 1;
    css("flying-opacity", flying ? cardOpacity * (1 - f.resetOut) : 0);
    const lift = Math.sin(Math.PI * f.flipT);
    css("shadow-y", `${(reduced ? finalY : cardY) + 14 + 10 * lift}px`);
    css("shadow-scale-x", Math.max(.15, Math.abs(Math.cos(turn * Math.PI))) * cardScale * scale);
    css("shadow-scale-y", cardScale * scale);
    css("shadow-opacity", flying ? cardOpacity * (1 - f.resetOut) * (1 - .35 * lift) : 0);
    css("kicker-opacity", f.reset > 0 ? f.resetIn : 1 - clamp01(f.p / .08));
    const leaving = f.reset > 0 ? 1 - f.resetIn : clamp01(f.p / .06);
    css("hint-opacity", 1 - leaving); css("hint-scale", 1 - .08 * leaving);
    const letters = el.querySelectorAll<HTMLElement>("[data-letter]");
    letters.forEach((letter) => {
      const i = Number(letter.dataset.letter);
      let e = 0;
      if (f.reset > 0) e = reduced ? f.resetIn : easeOut((f.reset * RESET.fadeMs - RESET.inFrom * RESET.fadeMs - i * RESET.letterStagger) / RESET.letterMs);
      else {
        const a = reduced ? clamp01(f.p / .08) : clamp01((f.p - i * HEADLINE.stagger) / HEADLINE.span);
        e = 1 - a * a * (3 - 2 * a);
      }
      letter.style.opacity = String(e);
      letter.style.transform = `translateY(${reduced ? 0 : HEADLINE.drop * (1 - e)}px)`;
    });
    for (let i = 0; i < 3; i++) {
      const show = v.phase === PHASE.revealing || v.phase === PHASE.revealed;
      const delay = reduced ? 0 : 400 + REVEAL.textDelay + i * REVEAL.stagger;
      const a = show ? textEase(clamp01((v.clock - v.commit.at - delay) / (reduced ? REDUCED_MS : 320))) : 0;
      const opacity = f.reset > 0 ? 1 - clamp01(f.reset * (reduced ? REDUCED_MS : RESET.fadeMs) / (reduced ? 80 : RESET.textOutMs)) : a;
      css(`final-${i}-opacity`, opacity); css(`final-${i}-y`, `${reduced ? 0 : POLISH.textRise * (1 - opacity)}px`);
    }
    el.dataset.phase = String(v.phase);
    el.dataset.progress = f.p.toFixed(4);
    el.dataset.flip = f.flipT.toFixed(4);
    if (phaseRef.current !== v.phase) { phaseRef.current = v.phase; setPhase(v.phase); }
  }, [reduced]);
  const { input } = useEnvelope(autoPlay, reduced, render);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(media.matches);
    change(); media.addEventListener("change", change);
    const el = root.current!;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      const scale = Math.min(1, (width - 32) / LAYOUT.cardW);
      const lay = screenLayout(height, height < 700 ? 24 : 54, 34);
      geometry.current = { width, height, scale, lay };
      const entries = { "headline-top": lay.headlineTop, "kicker-top": lay.headlineTop - 24, "hint-top": lay.buttonY - LAYOUT.hintH / 2, "card-top": lay.cardTop, "message-top": lay.messageTop, "cta-top": lay.ctaTop };
      for (const [key, value] of Object.entries(entries)) el.style.setProperty(`--${key}`, `${value}px`);
    };
    const observer = new ResizeObserver(measure); observer.observe(el); measure();
    return () => { media.removeEventListener("change", change); observer.disconnect(); };
  }, []);

  const sealed = phase === PHASE.sealed || phase === PHASE.dragging;
  return <main className="gift-page">
    <article ref={root} className="envelope-gift" data-phase="0" data-reduced={reduced} aria-label="Envelope Gift Reveal">
      <EnvelopeScene/>
      <header className="gift-header">
        <p className="gift-kicker">{GIFT.kicker}</p>
        <h1 className="gift-headline" aria-label={sealed ? GIFT.headline.replace("\n", " ") : GIFT.title.replace("\n", " ")}>
          {GIFT.headline.split("\n").map((line, row) => <span className="gift-headline-line" key={row} aria-hidden="true">{[...line].map((ch, i) => <span key={i} data-letter={row * 8 + i}>{ch === " " ? "\u00a0" : ch}</span>)}</span>)}
        </h1>
        <div className="gift-final-title gift-final-0" aria-hidden="true">{GIFT.title}</div>
      </header>
      <section className="gift-interaction" aria-label="Gift envelope">
        <div className="gift-drag-area" role="button" tabIndex={sealed ? 0 : -1} aria-label="Gift envelope" aria-disabled={!sealed} aria-describedby={sealed ? "gift-instructions" : undefined}
          onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); input.current.open(); } }}
          onPointerDown={e => {
            if (!e.isPrimary || e.button !== 0) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            pointer.current = { id: e.pointerId, y: e.clientY, time: e.timeStamp, velocity: 0 };
            input.current.down(e.clientX, e.clientY);
          }}
          onPointerMove={e => {
            const p = pointer.current; if (!p || p.id !== e.pointerId) return;
            const elapsed = e.timeStamp - p.time;
            if (elapsed > 0) p.velocity = (e.clientY - p.y) / elapsed * 1000;
            p.y = e.clientY; p.time = e.timeStamp;
            input.current.move(e.clientX, e.clientY);
          }}
          onPointerUp={e => {
            const p = pointer.current; if (!p || p.id !== e.pointerId) return;
            input.current.up(e.timeStamp - p.time > 100 ? 0 : p.velocity); pointer.current = null;
          }}
          onPointerCancel={() => { input.current.up(0, true); pointer.current = null; }}
          onLostPointerCapture={() => { if (pointer.current) { input.current.up(0, true); pointer.current = null; } }}
        />
        <p id="gift-instructions" className="sr-only">Swipe up to open it, or press Lift the flap.</p>
        <div className="gift-message gift-final-1" aria-hidden={sealed}>
          <p>{GIFT.caption}</p><p className="gift-message-sub">{GIFT.captionSub}</p>
        </div>
        <p className="sr-only" aria-live="polite">{phase === PHASE.revealed ? `Gift card, ${GIFT.amount} at ${GIFT.shop}. ${GIFT.message}` : ""}</p>
      </section>
      <footer className="gift-footer">
        <div className="gift-hint-wrap" aria-hidden={!sealed}>
          <Button variant="secondary" className="gift-hint" tabIndex={sealed ? 0 : -1} disabled={!sealed} onClick={() => input.current.open()} leftIcon={<ChevronUp size={16} strokeWidth={1.75}/>}>{GIFT.hint}</Button>
        </div>
        <div className="gift-cta-wrap gift-final-2" aria-hidden={phase !== PHASE.revealed}>
          <Button variant="primary" className="gift-cta" disabled={phase !== PHASE.revealed} tabIndex={phase === PHASE.revealed ? 0 : -1} onClick={() => onShop ? onShop() : input.current.reset()}>{GIFT.cta}</Button>
        </div>
        <div className="gift-home-indicator w-[139px] h-[5px] bg-foreground" aria-hidden="true"/>
      </footer>
    </article>
  </main>;
}
