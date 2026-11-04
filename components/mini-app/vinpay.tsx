"use client";

import { VINPAY_APP_ORIGIN } from "@/lib/app-origins";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import "./mini-app.css";

const VINPAY_ORIGIN = VINPAY_APP_ORIGIN;

/** The host owns app chrome; the mini app owns wallet navigation and content. */
export function VinPayMiniApp({ onClose, mode = "light" }: { onClose: () => void; mode?: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [retry, setRetry] = useState(0);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setSlow(true), 12000);
    const receive = (event: MessageEvent) => {
      if (event.origin !== VINPAY_ORIGIN || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "mini-app:close") onClose();
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("message", receive); window.addEventListener("keydown", key);
    return () => { clearTimeout(timer); window.removeEventListener("message", receive); window.removeEventListener("keydown", key); };
  }, [onClose, retry]);
  return <section className="mini-app bg-background text-foreground" role="dialog" aria-modal="true" aria-label="VinPay · Mini app trong VinClub" data-mini-app="vinpay">
    <div className="mini-app-content" aria-busy={!ready}>
      {!ready && <div className="mini-app-loading px-[22px]" role="status"><p>{slow ? "VinPay đang mất nhiều thời gian để tải." : "Đang mở VinPay…"}</p>{slow && <Button variant="secondary" onClick={() => { setReady(false); setSlow(false); setRetry(value => value + 1); }}>Thử lại</Button>}</div>}
      <iframe ref={frame} key={retry} title="VinPay mini app" src={`${VINPAY_ORIGIN}/ui-templates/sumeria/vsp?host=vinclub&mode=${mode}&embedded=1&miniApp=vinpay`} onLoad={() => setReady(true)} referrerPolicy="origin" />
    </div>
  </section>;
}
