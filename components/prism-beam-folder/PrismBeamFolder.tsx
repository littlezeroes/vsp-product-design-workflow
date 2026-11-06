"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { createBeamRenderer } from "./beamShader";
import { drawBack, drawFront, drawItem, ellipse, fillColor, fillShader, hex, radial } from "./prismBeamArt";
import { type Frame, type Geo, LOOP, makeGeo, makeSim, REDUCED_AT, scriptFrame, simFrame, simPress, simRelease } from "./prismBeamMotion";
import "./prism-beam.css";

export type PrismBeamFolderProps = { autoPlay?: boolean };
const reducedQuery = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (callback: () => void) => {
  const query = matchMedia(reducedQuery); query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
const getReduced = () => matchMedia(reducedQuery).matches;
const getServerReduced = () => false;

/** Original stage drawing order and transformations; labels stay in the DOM. */
function drawArtwork(c: CanvasRenderingContext2D, g: Geo, f: Frame, dpr: number) {
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.clearRect(0, 0, g.w, g.h);
  const cx = g.cx, cy = g.folderCY;
  c.save(); c.filter = "blur(4px)";
  fillColor(c, ellipse(cx - 55 * f.folderSX, cy + 38, 110 * f.folderSX, 12), hex(0x000000, .7)); c.restore();
  c.save(); c.translate(cx, cy + 42); c.scale(f.folderSX, f.folderSY); c.translate(0, -42);
  drawBack(c);
  if (f.beamAlpha > .001) {
    const k = f.beamAlpha * (.4 + .6 * f.glow);
    c.save(); c.globalCompositeOperation = "lighter";
    fillShader(c, ellipse(-70, -104, 140, 140), radial(0, -34, 70, [hex(0xfff3e6, .55 * k), hex(0xff5fd2, .22 * k), hex(0xff5fd2, 0)], [0, .45, 1]));
    c.restore();
  }
  c.restore();
  for (const item of f.items) {
    c.save(); c.translate(item.x, item.y); c.rotate(item.angle * Math.PI / 180);
    const scale = item.scale * item.size / 48; c.scale(scale, scale); c.globalAlpha = item.alpha;
    drawItem(c, item.kind); c.restore();
  }
  c.save(); c.translate(cx, cy + 42); c.scale(f.folderSX, f.folderSY); c.translate(0, -42);
  drawFront(c, f.open, f.glow * f.beamAlpha); c.restore();
  if (f.rippleA > .001) {
    fillColor(c, ellipse(cx - 22, cy - 22, 44, 44), hex(0xffffff, f.rippleA * .45));
    c.beginPath(); c.arc(cx, cy, f.rippleR, 0, Math.PI * 2);
    c.strokeStyle = hex(0xffffff, f.rippleA); c.lineWidth = 2; c.stroke();
  }
  if (f.badge > .001) {
    c.save(); c.translate(cx + 46, cy - 38); c.scale(f.badge, f.badge);
    fillColor(c, ellipse(-14.5, -14.5, 29, 29), hex(0x08070c));
    const gradient = c.createLinearGradient(0, -13, 0, 13);
    gradient.addColorStop(0, hex(0xff4d9a)); gradient.addColorStop(1, hex(0xe8317f));
    c.fillStyle = gradient; c.beginPath(); c.arc(0, 0, 13, 0, Math.PI * 2); c.fill(); c.restore();
  }
}

export function PrismBeamFolder({ autoPlay = false }: PrismBeamFolderProps) {
  const root = useRef<HTMLElement>(null), beam = useRef<HTMLCanvasElement>(null), artwork = useRef<HTMLCanvasElement>(null);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, getServerReduced);
  const [error, setError] = useState("");
  const controls = useRef({ press: () => {}, release: () => {} });
  const activePointer = useRef<number | null>(null);
  const holdingKey = useRef<string | null>(null);

  useEffect(() => {
    const el = root.current!, beamCanvas = beam.current!, artCanvas = artwork.current!;
    let renderer: ReturnType<typeof createBeamRenderer>;
    try { renderer = createBeamRenderer(beamCanvas); }
    catch (cause) {
      const id = requestAnimationFrame(() => setError(cause instanceof Error ? cause.message : "Unable to render prism beam."));
      return () => cancelAnimationFrame(id);
    }
    const c = artCanvas.getContext("2d");
    if (!c) {
      renderer.dispose(); const id = requestAnimationFrame(() => setError("Unable to create the artwork canvas."));
      return () => cancelAnimationFrame(id);
    }
    let geo = makeGeo(393, 852, 54, 34), sim = makeSim(), raf = 0;
    let previousFeel = 0, previousCount = -1, dpr = Math.min(devicePixelRatio || 1, 2);
    const badgeText = el.querySelector<HTMLElement>(".prism-badge-text")!;
    const savedText = el.querySelector<HTMLElement>(".prism-count-saved")!;
    const button = el.querySelector<HTMLButtonElement>(".prism-hold")!;
    const draw = (f: Frame) => {
      renderer.draw(geo.w, geo.h, dpr, geo.originY, geo.length, f.tip, f.hb, f.ht, f.beamAlpha, f.phase, geo.top);
      drawArtwork(c, geo, f, dpr);
      const css = (name: string, value: number | string) => el.style.setProperty(`--prism-${name}`, String(value));
      css("header-opacity", f.header); css("saved-opacity", f.saved); css("ready-opacity", 1 - f.saved);
      css("badge-scale", f.badge); css("floor-opacity", f.glow);
      el.dataset.count = String(f.count); el.dataset.items = String(f.items.length);
      el.dataset.beam = f.beamAlpha.toFixed(4); el.dataset.open = f.open.toFixed(4);
      el.dataset.phase = ((f.phase % LOOP + LOOP) % LOOP).toFixed(4);
      el.dataset.holding = String(sim.holding);
      button.setAttribute("aria-pressed", String(sim.holding));
      if (f.count !== previousCount) {
        previousCount = f.count; badgeText.textContent = String(f.count); savedText.textContent = `+${f.count} saved`;
      }
      if (sim.feel !== previousFeel) {
        previousFeel = sim.feel;
        if (navigator.vibrate) navigator.vibrate(8);
      }
    };
    const measure = () => {
      const rect = el.getBoundingClientRect();
      geo = makeGeo(rect.width, rect.height, rect.height < 700 ? 24 : 54, 34);
      sim = makeSim(); previousFeel = 0; dpr = Math.min(devicePixelRatio || 1, 2);
      artCanvas.width = Math.round(geo.w * dpr); artCanvas.height = Math.round(geo.h * dpr);
      const props = { "folder-y": geo.folderCY, "folder-label-y": geo.folderCY + 58, "header-y": geo.top + 18, "hint-y": geo.h - geo.bottom - 39, "stage-radius": geo.h * .75 };
      for (const [key, value] of Object.entries(props)) el.style.setProperty(`--prism-${key}`, `${value}px`);
      draw(reduced ? scriptFrame(REDUCED_AT, geo) : simFrame(sim, performance.now() / 1000, geo, autoPlay));
    };
    controls.current = {
      press: () => { if (!reduced) simPress(sim, performance.now() / 1000, geo, autoPlay); },
      release: () => { if (sim.holding) simRelease(sim, performance.now() / 1000); },
    };
    const tick = (time: number) => { draw(simFrame(sim, time / 1000, geo, autoPlay)); raf = requestAnimationFrame(tick); };
    const observer = new ResizeObserver(measure); observer.observe(el); measure();
    if (!reduced) raf = requestAnimationFrame(tick);
    const release = () => { controls.current.release(); activePointer.current = null; holdingKey.current = null; };
    const visibility = () => { if (document.hidden) release(); };
    window.addEventListener("blur", release); document.addEventListener("visibilitychange", visibility);
    const contextLost = (e: Event) => { e.preventDefault(); cancelAnimationFrame(raf); setError("The graphics context was lost. Reload to restore the prism beam."); };
    beamCanvas.addEventListener("webglcontextlost", contextLost);
    return () => {
      cancelAnimationFrame(raf); observer.disconnect(); renderer.dispose();
      window.removeEventListener("blur", release); document.removeEventListener("visibilitychange", visibility);
      beamCanvas.removeEventListener("webglcontextlost", contextLost);
      controls.current = { press: () => {}, release: () => {} };
      activePointer.current = null; holdingKey.current = null;
    };
  }, [autoPlay, reduced]);

  return <main className="prism-page">
    <article ref={root} className="prism-screen" data-reduced={reduced} aria-label="Prism Beam Folder">
      <div className="prism-floor" aria-hidden="true"/>
      <canvas ref={beam} className="prism-beam" aria-hidden="true"/>
      <canvas ref={artwork} className="prism-art" aria-hidden="true"/>
      <header className="prism-header">
        <p className="prism-eyebrow">LARDER · COLLECTIONS</p>
        <h1>Save your picks</h1>
        <p className="prism-sub">Hold a folder to pour them in.</p>
      </header>
      <section aria-label="Save to collection">
        <Button variant="secondary" className="prism-hold" disabled={reduced || !!error}
          aria-label="Weekend Snacks folder. Hold it to pour your picks in." aria-describedby="prism-folder-count" aria-pressed="false"
          onPointerDown={e => {
            if (!e.isPrimary || e.button !== 0 || activePointer.current !== null || holdingKey.current) return;
            e.currentTarget.setPointerCapture(e.pointerId); activePointer.current = e.pointerId; controls.current.press();
          }}
          onPointerUp={e => { if (activePointer.current === e.pointerId) { activePointer.current = null; controls.current.release(); } }}
          onPointerCancel={() => { activePointer.current = null; controls.current.release(); }}
          onLostPointerCapture={() => { if (activePointer.current !== null) { activePointer.current = null; controls.current.release(); } }}
          onKeyDown={e => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault(); if (!e.repeat && !holdingKey.current && activePointer.current === null) { holdingKey.current = e.key; controls.current.press(); }
            }
          }}
          onKeyUp={e => { if (e.key === holdingKey.current) { e.preventDefault(); holdingKey.current = null; controls.current.release(); } }}
          onBlur={() => { holdingKey.current = null; controls.current.release(); }}
          onContextMenu={e => e.preventDefault()}
        ><span className="sr-only">Hold the folder to pour</span></Button>
        <span className="prism-badge-text" aria-hidden="true">0</span>
        <div className="prism-folder-text">
          <h2>Weekend Snacks</h2>
          <div className="prism-count-line" id="prism-folder-count">
            <p className="prism-count-ready">9 picks ready</p>
            <p className="prism-count-saved" aria-live="polite" aria-atomic="true">+0 saved</p>
          </div>
        </div>
      </section>
      <footer className="prism-footer">
        <p className="prism-hint">Hold the folder to pour</p>
        <div className="prism-home-indicator w-[139px] h-[5px] bg-foreground" aria-hidden="true"/>
      </footer>
      {error && <p className="prism-error" role="alert">{error}</p>}
    </article>
  </main>;
}
