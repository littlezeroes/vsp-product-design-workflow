"use client";

import { AiAvatar } from "@/components/vinclub/ai-avatar";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const suggestions = [
  { text: "Một chuyến xe đến Vincom", prompt: "Đặt xe đưa tôi đến Vincom", icons: ["car", "shopping", "car"] },
  { text: "Bữa trưa giao tận nhà", prompt: "Đặt đồ ăn trưa giao tận nhà", icons: ["food", "food", "food"] },
  { text: "Ưu đãi dành cho bạn", prompt: "Tìm ưu đãi dành cho tôi", icons: ["shopping", "hotel", "shopping"] },
  { text: "Một lịch hẹn cuối tuần", prompt: "Gợi ý một kỳ nghỉ cuối tuần cho tôi", icons: ["travel", "hotel", "travel"] },
];

export function AiPrompt({ onChoose }: { onChoose: (prompt: string) => void }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const update = () => {
      clearInterval(timer);
      if (!preference.matches) timer = setInterval(() => setIndex(current => (current + 1) % suggestions.length), 3400);
    };
    update();
    preference.addEventListener("change", update);
    return () => { clearInterval(timer); preference.removeEventListener("change", update); };
  }, []);
  const suggestion = suggestions[index];
  return <Button variant="secondary" className="ds-ai w-full justify-start" onClick={() => onChoose(suggestion.prompt)}>
    <AiAvatar/>
    <span className="ds-ai-copy"><span className="ds-ai-label">Chat với AI,</span><span className="ds-ai-rotator"><span key={index} className="ds-ai-suggestion">{suggestion.text}</span></span></span>
    <ArrowUpRight size={14} className="shrink-0"/>
  </Button>;
}
