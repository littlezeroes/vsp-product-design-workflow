"use client";
import { useEffect, useRef } from "react";

/** Fixed-width digit reels start when the actual Home loading state clears. */
export function AnimatedNumber({ value }: { value: number }) {
  const node = useRef<HTMLSpanElement>(null);
  const formatted = value.toLocaleString("vi-VN");
  useEffect(() => {
    const element = node.current;
    if (!element) return;
    const host = element.closest<HTMLElement>("[data-mini-app-host]");
    const page = element.closest<HTMLElement>(".vk-page");
    const animations: Animation[] = [];
    let started = false;
    const start = () => {
      if (started || host?.inert || page?.hasAttribute("data-home-skeleton")) return;
      started = true;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      element.querySelectorAll<HTMLElement>("[data-digit-reel]").forEach((reel, index) => {
        const digit = Number(reel.dataset.digitReel);
        animations.push(reel.animate([
          { transform: "translateY(0)" },
          { transform: `translateY(-${(10 + digit) * 1.1}em)` },
        ], { duration: 620 + index * 18, easing: "cubic-bezier(.16,1,.3,1)" }));
      });
    };
    const observer = new MutationObserver(start);
    if (host) observer.observe(host, { attributes: true, attributeFilter: ["inert"] });
    if (page) observer.observe(page, { attributes: true, attributeFilter: ["data-home-skeleton"] });
    start();
    return () => { animations.forEach(animation => animation.cancel()); observer.disconnect(); };
  }, [value]);
  return <span ref={node} className="vk-number-reels tabular-nums" aria-label={formatted}>{Array.from(formatted).map((char,index) => /\d/.test(char) ? <span key={index} className="vk-number-digit" aria-hidden="true"><span className="vk-number-column" data-digit-reel={char} style={{ transform: `translateY(-${(10 + Number(char)) * 1.1}em)` }}>{Array.from({length:20},(_,i)=><span key={i}>{i%10}</span>)}</span></span> : <span key={index} aria-hidden="true">{char}</span>)}</span>;
}
