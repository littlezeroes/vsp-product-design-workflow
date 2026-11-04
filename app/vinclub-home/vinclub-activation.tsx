"use client";

import { CORE_APP_ORIGIN } from "@/lib/app-origins";
import { useEffect, useRef, useState } from "react";
import "@/components/mini-app/mini-app.css";

export const VINCLUB_ACTIVATION_DRAFT = "vinclub:activation-resume";
const ORIGIN = CORE_APP_ORIGIN;
const RESUMABLE = new Set(["intro", "verification", "front", "review-front", "back", "review-back", "nfc", "info", "face", "verified"]);

function activationSource(mode: string) {
  const fallback = `${ORIGIN}/driver-care/activate?lv=l0&embedded=1&wallet=1&membership=1&hostCanvas=sumeria&from=h4&theme=${mode}&brand=vsp`;
  try {
    const saved = sessionStorage.getItem(VINCLUB_ACTIVATION_DRAFT);
    if (!saved) return fallback;
    const url = new URL(saved);
    const step = url.pathname.split("/").at(-1);
    if (url.origin !== ORIGIN || !url.pathname.startsWith("/driver-care/activate/") || !RESUMABLE.has(step ?? "") || url.searchParams.get("membership") !== "1") return fallback;
    url.searchParams.set("theme", mode);
    return url.toString();
  } catch { return fallback; }
}

/** The shared wallet UI runs membership eKYC without linking a bank account. */
export function VinClubActivation({ onActivate, onBack, mode = "light" }: { onActivate: () => void; onBack: () => void; mode?: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [source] = useState(() => activationSource(mode));
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== ORIGIN || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "vsp-activation-step" && RESUMABLE.has(event.data.step)) {
        try {
          const url = new URL(event.data.url);
          if (url.origin === ORIGIN && url.pathname.startsWith("/driver-care/activate") && url.searchParams.get("membership") === "1") sessionStorage.setItem(VINCLUB_ACTIVATION_DRAFT, url.toString());
        } catch { /* Keep browsing available when storage is unavailable. */ }
      }
      if (event.data?.type === "vsp-activation-complete") {
        try { sessionStorage.removeItem(VINCLUB_ACTIVATION_DRAFT); } catch { /* Optional prototype persistence. */ }
        onActivate();
      }
      if (event.data?.type === "vsp-activation-close") onBack();
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [onActivate, onBack]);
  return <section className="mini-app bg-background text-foreground" role="dialog" aria-modal="true" aria-label="Kích hoạt VinClub"><div className="mini-app-content"><iframe ref={frame} title="Kích hoạt hội viên VinClub" src={source} referrerPolicy="origin" /></div></section>;
}
