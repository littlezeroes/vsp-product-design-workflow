"use client";

import { VINPAY_APP_ORIGIN } from "@/lib/app-origins";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import "./mini-app.css";

export function TetGame({ onClose }: { onClose: () => void }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [progress, setProgress] = useState(0);
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const [slow, setSlow] = useState(false);
  const ready = progress === 100 && minimumElapsed;
  useEffect(() => {
    closeButton.current?.focus();
    const minimum = window.setTimeout(() => setMinimumElapsed(true), 1100);
    const deadline = window.setTimeout(() => setSlow(true), 15000);
    return () => { clearTimeout(minimum); clearTimeout(deadline); };
  }, []);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    const receive = (event: MessageEvent) => {
      if (event.origin !== VINPAY_APP_ORIGIN || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "tet-game:close") onClose();
      if (event.data?.type === "tet-game:progress" && Number.isFinite(event.data.progress)) setProgress(value => Math.max(value, Math.min(100, event.data.progress)));
    };
    window.addEventListener("keydown", close);
    window.addEventListener("message", receive);
    return () => { window.removeEventListener("keydown", close); window.removeEventListener("message", receive); };
  }, [onClose]);
  useEffect(() => { if (ready) frame.current?.focus(); }, [ready]);
  return <section className="mini-app tet-mini-app bg-background text-foreground" role="dialog" aria-modal="true" aria-label="Mở Cửa Tết · Game trong VinClub">
    <div className="mini-app-content" aria-busy={!ready}>
      {!ready && <div className="tet-game-loading px-[22px]">
        <Button ref={closeButton} variant="secondary" size="32" className="tet-loading-back" aria-label="Quay lại VinClub" onClick={onClose}><Image src="/vinclub-game/loading-back.webp" width={44} height={44} alt="" /></Button>
        <Image className="tet-loading-title" src="/vinclub-game/loading-title-v2.png" width={310} height={90} alt="Tết Đủ Đầy · Mở Cửa Tết" priority />
        <Image className="tet-loading-character" src="/vinclub-game/loading-character.webp" width={200} height={230} alt="Lộc An" priority />
        <p>{slow ? "Sân Tết đang tải lâu hơn một chút…" : progress < 55 ? "Đang mở cửa Tết…" : progress < 100 ? "Đang chuẩn bị món ngon…" : "Sẵn sàng đón Tết!"}</p>
        <div className="tet-loading-progress"><progress max={100} value={progress} aria-label="Tiến độ chuẩn bị game" /><span>{progress}%</span></div>
        {slow && <Button variant="secondary" size="32" className="tet-loading-retry" onClick={() => { setSlow(false); setProgress(0); if (frame.current) frame.current.src = frame.current.src; }}>Tải lại game</Button>}
      </div>}
      <iframe ref={frame} title="Mở Cửa Tết · Courtyard" src={`${VINPAY_APP_ORIGIN}/vinclub/tet-2027?visual=courtyard&appearance=vinclub`} onLoad={() => setProgress(value => Math.max(value, 25))} allow="autoplay" tabIndex={ready ? 0 : -1} />
    </div>
  </section>;
}
