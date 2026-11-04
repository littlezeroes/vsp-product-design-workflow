"use client";
import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

export function AwardConfetti() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvas.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const style = getComputedStyle(canvas.current);
    const colors = ["--color-yellow-200", "--color-yellow-600", "--color-grey-00"].map(token => style.getPropertyValue(token).trim());
    const fire = confetti.create(canvas.current, { resize: true, useWorker: true, disableForReducedMotion: true });
    const timer = setTimeout(() => {
      const base = { particleCount: 36, spread: 65, startVelocity: 28, gravity: .85, decay: .94, ticks: 180, scalar: .7, colors };
      void fire({ ...base, angle: 65, origin: { x: .05, y: .58 } });
      void fire({ ...base, angle: 115, origin: { x: .95, y: .58 } });
    }, 550);
    return () => { clearTimeout(timer); fire.reset(); };
  }, []);
  return <canvas ref={canvas} className="aw-confetti-canvas" aria-hidden="true" />;
}
