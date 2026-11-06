"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

type Recognition = {
  lang: string; interimResults: boolean; continuous: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal?: boolean }> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void; stop: () => void; abort: () => void;
};
export function AiVoiceButton({ onTranscript, label = "Nói với AI", disabled = false, visual, className, compact = false, expanded = false }: { onTranscript: (text: string) => void; label?: string; disabled?: boolean; visual?: ReactNode; className?: string; compact?: boolean; expanded?: boolean }) {
  const recognition = useRef<Recognition | null>(null);
  const [listening, setListening] = useState(false);
  const [notice, setNotice] = useState("");
  const [heard, setHeard] = useState("");
  useEffect(() => () => { const active = recognition.current; if (active) { active.onend = null; active.onresult = null; active.onerror = null; active.abort(); } }, []);
  const toggle = () => {
    if (listening) { recognition.current?.stop(); return; }
    const browser = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
    const Constructor = browser.SpeechRecognition ?? browser.webkitSpeechRecognition;
    if (!Constructor) { setNotice("Trình duyệt chưa hỗ trợ voice. Bạn có thể nhập yêu cầu bằng bàn phím."); return; }
    const active = new Constructor(); recognition.current = active;
    active.lang = "vi-VN"; active.interimResults = true; active.continuous = false;
    active.onresult = event => { const results = Array.from(event.results); const text = results.map(result => result[0].transcript).join(" ").trim(); setHeard(text); if (text && results.at(-1)?.isFinal !== false) { onTranscript(text); setNotice("Đã điền lời nói. Bạn kiểm tra trước khi tiếp tục nhé."); } };
    active.onerror = event => { setListening(false); setNotice(event.error === "not-allowed" ? "Hãy cho phép micro để nói với AI." : "Chưa nghe rõ. Bạn thử lại hoặc nhập bằng bàn phím nhé."); };
    active.onend = () => setListening(false);
    setHeard("");
    try { active.start(); setListening(true); setNotice("Đang nghe… Hãy nói yêu cầu của bạn."); } catch { setListening(false); setNotice("Micro chưa sẵn sàng. Bạn thử lại nhé."); }
  };
  return <div className={`vc-ai-voice ${className??""}`} data-listening={listening}><Button type="button" variant="secondary" size="32" disabled={disabled} onClick={toggle} aria-pressed={listening} aria-label={listening ? "Dừng ghi âm" : label}>{visual??(listening ? <Square size={14}/> : <Mic size={16}/>)}{!compact&&<span>{listening ? "Đang nghe…" : label}</span>}</Button>{listening && expanded && <div className="vc-ai-voice-session rounded-28 bg-secondary" role="status"><div className="vc-ai-voice-wave" aria-hidden="true">{Array.from({length:9},(_,i)=><span key={i}/>)}</div><strong>VinClub đang lắng nghe</strong><p>{heard || "Hỏi về ưu đãi, chuyến đi hoặc việc bạn cần làm…"}</p><span className="text-xs text-foreground-secondary">Bấm dừng để kết thúc. Kiểm tra lời nói trước khi gửi.</span></div>}{notice && <p role="status" className="text-xs text-foreground-secondary mt-[8px]">{notice}</p>}</div>;
}
