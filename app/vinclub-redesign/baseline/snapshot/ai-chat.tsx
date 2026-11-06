"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, ChevronLeft, Plus, ChevronRight, ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";
import { DailyIcon, PaymentIcon } from "@/components/vinclub/daily-icons";
import { AiVoiceButton } from "@/components/vinclub/ai-voice-button";
import { AiBooking } from "./ai-booking";
import { AiAvatar } from "@/components/vinclub/ai-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/ui/header";
import { FixedBottom } from "@/components/ui/fixed-bottom";
import "./ai-chat.css";

const welcomeIdeas = [
  { text: "Một chuyến xe đến Vincom", icons: ["car", "shopping", "car"] },
  { text: "Bữa trưa giao tận nhà", icons: ["food", "food", "food"] },
  { text: "Ưu đãi dành cho bạn", icons: ["shopping", "hotel", "shopping"] },
  { text: "Một lịch hẹn cuối tuần", icons: ["travel", "hotel", "travel"] },
];

const suggestions = [
  { icon: "car", family: "service", detail: "Chuyến đi của bạn", title: "Đặt xe", prompt: "Đón mình đến Vincom nhé" },
  { icon: "food", family: "service", detail: "Bữa ngon mỗi ngày", title: "Đặt đồ ăn", prompt: "Đặt giúp mình bữa trưa nhé" },
  { icon: "shopping", family: "service", detail: "Ưu đãi hợp với bạn", title: "Tìm ưu đãi", prompt: "Tìm ưu đãi hợp với mình" },
  { icon: "travel", family: "service", detail: "Kỳ nghỉ cuối tuần", title: "Lên lịch đi chơi", prompt: "Cuối tuần đi đâu cho vui?" },
  { icon: "bill", family: "payment", detail: "Nhà, xe và học phí", title: "Xem hóa đơn", prompt: "Có khoản nào sắp đến hạn không?" },
  { icon: "credit", family: "payment", detail: "Khám phá quyền lợi", title: "Dùng VPoint", prompt: "VPoint của mình đổi được gì?" },
];
type Message = { role: "user" | "assistant"; text: string; flow?: "ride" | "food"; action?: "offers" | "trips" | "bills" };
function answer(text: string): Message {
  if (/đặt xe|gọi xe|đưa tôi|đón tôi|đón mình/i.test(text)) return {role:"assistant",text:"Mình đã chuẩn bị chuyến xe đến Vincom. Bạn xác nhận bên dưới nhé.",flow:"ride"};
  if (/đồ ăn|đặt món|bữa|ăn trưa|món ăn|ăn gì/i.test(text)) return {role:"assistant",text:"Mình gợi ý mì rau củ từ Bếp Nhà. Bạn xác nhận đơn bên dưới nhé.",flow:"food"};
  if (/hóa đơn|học phí|thanh toán|đến hạn/i.test(text)) return { role: "assistant", text: "Bạn có thể xem các hóa đơn nhà, xe và học phí trong VinLife. Mình mở danh sách để bạn kiểm tra số tiền và hạn thanh toán nhé.", action: "bills" };
  if (/đi chơi|kỳ nghỉ|chuyến|cuối tuần|du lịch/i.test(text)) return { role: "assistant", text: "Một kỳ nghỉ ngắn ở Vinpearl là gợi ý cho cuối tuần này. Bạn có thể khám phá điểm đến và chọn lịch phù hợp trong Trải nghiệm.", action: "trips" };
  if (/điểm|vpoint|ưu đãi/i.test(text)) return { role: "assistant", text: "Bạn có 300.000 VPoint trong bản trải nghiệm. Mình gợi ý bắt đầu từ đặc quyền nghỉ dưỡng, mua sắm và chăm sóc sức khỏe. Chọn ưu đãi để xem điều kiện sử dụng nhé.", action: "offers" };
  return { role: "assistant", text: "Mình có thể giúp bạn tìm ưu đãi, khám phá chuyến đi hoặc xem hóa đơn trong VinClub. Bạn muốn bắt đầu từ việc nào?" };
}
export function AiChat({ initialPrompt = "", onClose, onNavigate }: { initialPrompt?: string; onClose: () => void; onNavigate: (action: "offers" | "trips" | "bills") => void }) {
  const [draft, setDraft] = useState(initialPrompt);
  const [welcomeIndex, setWelcomeIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [flow, setFlow] = useState<"ride" | "food" | null>(null);
  const [flowVersion, setFlowVersion] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const close = useRef(onClose);
  useEffect(() => {
    if (messages.length) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let interval: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      clearInterval(interval);
      if (!preference.matches) interval = setInterval(() => setWelcomeIndex(index => (index + 1) % welcomeIdeas.length), 4200);
    };
    sync();
    preference.addEventListener("change", sync);
    return () => { clearInterval(interval); preference.removeEventListener("change", sync); };
  }, [messages.length]);
  useEffect(() => { close.current = onClose; }, [onClose]);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    root.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close.current();
      if (e.key !== "Tab") return;
      const items = Array.from(root.current?.querySelectorAll<HTMLElement>("button:not(:disabled),input") ?? []);
      if (e.shiftKey && document.activeElement === items[0]) { e.preventDefault(); items.at(-1)?.focus(); }
      else if (!e.shiftKey && document.activeElement === items.at(-1)) { e.preventDefault(); items[0]?.focus(); }
    };
    const node = root.current; node?.addEventListener("keydown", key);
    return () => { node?.removeEventListener("keydown", key); if (timer.current) clearTimeout(timer.current); previous?.focus(); };
  }, []);
  useEffect(() => { if (!messages.length) { root.current?.querySelector(".vc-ai-scroll")?.scrollTo({ top: 0 }); return; } if(flow){root.current?.querySelector(".vc-ai-booking")?.scrollIntoView({block:"start",behavior:"instant"});return;} bottom.current?.scrollIntoView({ block: "end", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); }, [messages, thinking, flow]);
  const send = (text = draft) => {
    const clean = text.trim(); if (!clean || thinking) return;
    setMessages(current => [...current, { role: "user", text: clean }]); setDraft(""); setThinking(true); setSuggestionsOpen(false);
    timer.current = setTimeout(() => { const reply = answer(clean); setMessages(current => [...current, reply]); if(reply.flow){setFlow(reply.flow);setFlowVersion(value=>value+1);} setThinking(false); }, 900);
  };
  const reset = () => { if (timer.current) clearTimeout(timer.current); setFlow(null); setMessages([]); setDraft(""); setThinking(false); setSuggestionsOpen(false); };
  const suggestionList = <div className="vc-ai-suggestion-list" aria-label="Gợi ý câu hỏi">{suggestions.map(({ icon, family, title, prompt }) => <div key={title} className="vc-ai-suggestion-row">{family === "payment" ? <PaymentIcon name={icon} size={40}/> : <DailyIcon name={icon} size={40}/>}<Button type="button" variant="secondary" size="32" className="vc-ai-list-choice" disabled={thinking} onClick={() => send(prompt)}><span><strong>{title}</strong><span>{prompt}</span></span><ChevronRight size={14}/></Button></div>)}</div>;
  const composer = <form onSubmit={event => { event.preventDefault(); send(); }} className="vc-ai-composer rounded-28 bg-secondary">
    <div className="vc-ai-input-row"><Input aria-label="Hỏi VinClub AI" placeholder="Bạn muốn VinClub giúp gì hôm nay?" value={draft} onChange={event => setDraft(event.target.value)} className="vc-ai-input" autoComplete="off"/></div>
    <div className="vc-ai-composer-tools"><AiVoiceButton onTranscript={setDraft} disabled={thinking}/>{messages.length > 0 && <Button type="button" variant="secondary" size="32" className="vc-ai-inline-suggestions" aria-expanded={suggestionsOpen} aria-controls="ai-composer-suggestions" onClick={() => setSuggestionsOpen(value => !value)}>Gợi ý<ChevronDown size={14} className={suggestionsOpen ? "rotate-180" : ""}/></Button>}<Button variant="primary" size="32" type="submit" aria-label="Gửi tin nhắn" disabled={!draft.trim() || thinking}><ArrowUp size={18}/></Button></div>
    {messages.length > 0 && suggestionsOpen && <div id="ai-composer-suggestions" className="vc-ai-composer-dropdown">{suggestionList}</div>}
  </form>;
  return createPortal(<div ref={root} className="vc-ai-chat bg-background text-foreground" role="dialog" aria-modal="true" aria-label="Chat với AI">
    <Header title="VinClub AI" leading={<Button variant="secondary" size="32" aria-label="Quay lại" onClick={onClose}><ChevronLeft size={20}/></Button>} trailing={<Button variant="secondary" size="32" aria-label="Cuộc trò chuyện mới" onClick={reset}><Plus size={19}/></Button>}/>
    <div className="vc-ai-scroll">
      {messages.length === 0 ? <>
        <section className="vc-ai-welcome px-[22px]" aria-label="Trợ lý VinClub"><div key={`bubble-${welcomeIndex}`} className="vc-ai-speech rounded-14 bg-secondary"><span>{welcomeIdeas[welcomeIndex].text}</span></div><div className="vc-ai-hero-bot"><div className="vc-ai-character"><div key={`burst-${welcomeIndex}`} className="vc-ai-service-burst" aria-hidden="true">{welcomeIdeas[welcomeIndex].icons.map((icon,i)=><span key={`${icon}-${i}`} className="vc-ai-flying-service"><DailyIcon name={icon} size={40}/></span>)}</div><AiAvatar size={144}/></div></div><h1 className="pt-[24px] pb-[12px] text-2xl font-medium">Để VinClub chăm chút ngày của bạn.</h1></section>
        <section className="px-[22px]" aria-label="Bắt đầu trò chuyện">{composer}</section>
        <section className="px-[22px] pt-[24px] pb-[24px]" aria-label="Gợi ý bắt đầu">{suggestionList}</section>
      </> : <section className="px-[22px] pt-[24px] pb-[12px] vc-ai-messages" aria-label="Cuộc trò chuyện" aria-live="polite">{messages.map((message, i) => <div key={i} className={`vc-ai-message vc-ai-message-${message.role}`}>{message.role === "assistant" && <p className="vc-ai-author">VinClub AI</p>}<p>{message.text}</p>{message.action && <Button variant="secondary" size="32" className="mt-[12px]" onClick={() => onNavigate(message.action!)}>{message.action === "offers" ? "Khám phá ưu đãi" : message.action === "trips" ? "Xem trải nghiệm" : "Xem hóa đơn"}<ChevronRight size={14}/></Button>}</div>)}{flow && <AiBooking key={`${flow}-${flowVersion}`} kind={flow} onDismiss={()=>setFlow(null)}/>} {thinking && <p role="status" className="vc-ai-thinking text-foreground-secondary">Đang tìm gợi ý<span>…</span></p>}</section>}
      <div ref={bottom}/>
    </div>
    <FixedBottom className="vc-ai-bottom border-0 shadow-none pb-[8px]">{messages.length > 0 && composer}<div className="w-[139px] h-[5px] bg-foreground rounded-full mx-auto mt-[12px]"/></FixedBottom>
  </div>, document.body);
}
