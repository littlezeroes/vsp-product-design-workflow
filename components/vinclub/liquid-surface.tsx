"use client";

import type { CSSProperties, ReactNode } from "react";
import { TopGlassOptics } from "./glass-refraction";

/** Native backdrop glass; decorative layers never intercept VSP controls. */
export function LiquidSurface({ children, className = "", selectedIndex, count = 3, ...props }: {
  children: ReactNode;
  className?: string;
  selectedIndex?: number;
  count?: number;
  "data-space"?: string;
}) {
  return <div className={`vc-liquid-surface ${className}`} {...props}>
    {/\b(ds-spaces-glass|daily-nav-glass)\b/.test(className) ? <TopGlassOptics/> : <span className="vc-liquid-optics" aria-hidden="true"/>}
    {selectedIndex !== undefined && <span className="vc-liquid-lens" aria-hidden="true" style={{ "--lens-index": selectedIndex, "--lens-count": count } as CSSProperties}/>}
    <div className="vc-liquid-content">{children}</div>
  </div>;
}
