"use client";
import { useEffect, useRef, useState } from "react";
import { MeshGradient } from "@paper-design/shaders-react";

/* One viewport-sized shader; tier and theme come from inherited design tokens. */
export function VinPayHeaderBackdrop() {
  const host = useRef<HTMLDivElement>(null);
  const [palette, setPalette] = useState<string[] | null>(null);
  const [still, setStill] = useState(false);
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const sync = () => {
      const style = getComputedStyle(node);
      const dark = node.closest('[data-mode="dark"]') !== null;
      const hex = style.getPropertyValue("--home-shader-tint").trim();
      if (!/^#[0-9a-f]{6}$/i.test(hex)) return;
      const baseHex = style.getPropertyValue(dark ? "--color-grey-950" : "--color-grey-00").trim();
      const base = parseInt(baseHex.slice(1, 3), 16);
      const mix = (amount: number) => "#" + [1, 3, 5].map(at => Math.round(parseInt(hex.slice(at, at + 2), 16) * (1 - amount) + base * amount).toString(16).padStart(2, "0")).join("");
      const back = mix(dark ? .94 : .94), soft = mix(dark ? .78 : .66), lift = mix(dark ? .52 : .36);
      setPalette([back, soft, lift, soft]);
    };
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () => setStill(media.matches);
    sync(); motion(); media.addEventListener("change", motion);
    const observer = new MutationObserver(sync);
    const page = node.closest(".vk-page");
    if (page) observer.observe(page, { attributes: true, attributeFilter: ["data-mode"] });
    const phone = node.closest(".vk-phone");
    if (phone) observer.observe(phone, { attributes: true, attributeFilter: ["data-tier"] });
    return () => { observer.disconnect(); media.removeEventListener("change", motion); };
  }, []);
  return <div ref={host} className="vk-vinpay-header-backdrop" aria-hidden="true">{palette && <MeshGradient colors={palette} speed={still ? 0 : .3} distortion={.8} swirl={.3} style={{ width: "100%", height: "100%" }} />}</div>;
}
