"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, Check, ChevronLeft, ChevronRight, Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./events.css";

const ROOT = "/vinclub-assets/events-v1";
/* Editorial prototype inventory, not live events or ticket availability. */
const EVENTS = [
  { id: "sunset", title: "Đêm nhạc giữa đảo ngọc", category: "Âm nhạc", city: "Phú Quốc", venue: "Grand World · VinWonders", date: "2026-11-15", day: "15", month: "TH11", time: "17:30 – 21:00", price: 300000, image: `${ROOT}/concert-v2.webp`, tag: "Nổi bật", intro: "Chạm vào nhịp sống đảo ngọc cùng âm nhạc, ánh sáng và những khoảnh khắc bùng nổ bên bạn bè. Một đêm ngoài trời tại Grand World, trọn vẹn từ hoàng hôn đến khi sân khấu lên đèn." },
  { id: "escape", title: "Một ngày thảnh thơi bên biển", category: "Nghỉ dưỡng", city: "Phú Quốc", venue: "Vinpearl Resort", date: "2026-11-07", day: "07", month: "TH11", time: "09:00 – 17:00", price: 650000, image: `${ROOT}/resort.webp`, tag: "Dành cho hội viên", intro: "Rời nhịp sống thường ngày, dành một ngày cho biển xanh và không gian nghỉ dưỡng. Thư giãn bên hồ bơi, dạo biển và dùng bữa trong khu nghỉ dưỡng." },
  { id: "taste", title: "Hẹn nhau một bữa thật ngon", category: "Ẩm thực", city: "TP. Hồ Chí Minh", venue: "Vincom Center", date: "2026-11-08", day: "08", month: "TH11", time: "18:00 – 20:30", price: 250000, image: `${ROOT}/food.jpg`, tag: "Cuối tuần này", intro: "Khám phá hương vị mới cùng những người có chung niềm yêu thích ẩm thực. Một buổi hẹn thân mật để thưởng thức và chia sẻ câu chuyện quanh bàn ăn." },
  { id: "active", title: "Cuối tuần, ra ngoài vận động", category: "Thể thao", city: "Hà Nội", venue: "Vinhomes Ocean Park", date: "2026-11-14", day: "14", month: "TH11", time: "06:30 – 09:00", price: 0, image: `${ROOT}/active.jpg`, tag: "Miễn phí", intro: "Bắt đầu ngày mới với hoạt động thể thao ngoài trời dành cho cộng đồng. Mang theo nước uống, trang phục thoải mái và sẵn sàng cho một buổi sáng nhiều năng lượng." },
] as const;
type Event = typeof EVENTS[number];
const CATEGORIES = ["Tất cả", "Âm nhạc", "Ẩm thực", "Nghỉ dưỡng", "Thể thao"];
const price = (value: number) => value ? `${value.toLocaleString("vi-VN")}đ` : "Miễn phí";

export function EventsPage() {
  const [category, setCategory] = useState("Tất cả");
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [selected, setSelected] = useState<Event | null>(null);
  const [calendarAdded, setCalendarAdded] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const stored: unknown = JSON.parse(localStorage.getItem("vinclub-saved-events") || "[]");
        if (Array.isArray(stored)) setSaved(stored.filter((id): id is string => typeof id === "string"));
      } catch { /* Keep the empty saved list when browser storage is unavailable. */ }
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  const save = (id: string) => setSaved(current => { const next = current.includes(id) ? current.filter(value => value !== id) : [...current, id]; localStorage.setItem("vinclub-saved-events", JSON.stringify(next)); return next; });
  const select = (event: Event | null) => { setSelected(event); setCalendarAdded(false); document.querySelector(".vk-scroll")?.scrollTo({ top: 0 }); requestAnimationFrame(() => heading.current?.focus()); };
  const calendar = (event: Event) => {
    const escape = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
    const next = new Date(`${event.date}T00:00:00Z`); next.setUTCDate(next.getUTCDate() + 1);
    const stamp = (s: string) => s.replaceAll("-", "");
    const content = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//VinClub//Events Preview//VI", "BEGIN:VEVENT", `UID:${event.id}-2026-preview@vinclub.local`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`, `DTSTART;VALUE=DATE:${stamp(event.date)}`, `DTEND;VALUE=DATE:${stamp(next.toISOString().slice(0, 10))}`, `SUMMARY:${escape(event.title)}`, `LOCATION:${escape(`${event.venue}, ${event.city}`)}`, "DESCRIPTION:Lịch trải nghiệm mẫu VinClub. Không phải vé tham dự.", "END:VEVENT", "END:VCALENDAR", ""].join("\r\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" })); const link = document.createElement("a"); link.href = url; link.download = `vinclub-${event.id}.ics`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); setCalendarAdded(true);
  };
  const filtered = EVENTS.filter(event => (category === "Tất cả" || category === event.category) && (!savedOnly || saved.includes(event.id)));
  const heart = (event: Event, className = "ve-heart") => <Button variant="secondary" size="32" className={className} aria-label={`${saved.includes(event.id) ? "Bỏ lưu" : "Lưu"} ${event.title}`} aria-pressed={saved.includes(event.id)} onClick={() => save(event.id)}><Heart size={19} fill={saved.includes(event.id) ? "currentColor" : "none"} aria-hidden /></Button>;

  if (selected) return <article className="ve ve-detail">
    <header className="ve-detail-nav px-[22px]"><Button variant="secondary" size="32" className="ve-icon" aria-label="Quay lại sự kiện" onClick={() => select(null)}><ChevronLeft size={24}/></Button>{heart(selected, "ve-icon")}</header>
    <div className="ve-detail-art px-[22px]">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={selected.image} alt={selected.title} className="rounded-14" /></div>
    <section className="px-[22px] pt-[24px] pb-[12px]"><p className="ve-eyebrow">{selected.category} · {selected.venue}</p><h1 ref={heading} tabIndex={-1}>{selected.title}</h1><p className="ve-detail-city"><MapPin size={16}/>{selected.city}</p><div className="ve-facts rounded-14"><CalendarDays size={22}/><span><strong>{selected.day}/11/2026</strong><small>{selected.time}</small></span></div></section>
    <section className="px-[22px] pt-[24px] pb-[12px]"><h2>Trải nghiệm đang chờ bạn</h2><p className="ve-description">{selected.intro}</p><p className="ve-prototype">Lịch trải nghiệm mẫu · Thông tin và giá minh họa</p></section>
    <footer className="ve-detail-bottom px-[22px]"><span><strong>{price(selected.price)}</strong><small>{selected.price ? "Giá tham khảo / người" : "Hoạt động cộng đồng"}</small></span><Button variant="primary" size="48" onClick={() => calendar(selected)}>{calendarAdded ? <><Check size={16}/>Đã tải lịch</> : "Thêm vào lịch"}</Button></footer>
    <p className="ve-sr" role="status">{calendarAdded ? "Đã tải lịch sự kiện về thiết bị" : ""}</p>
  </article>;

  return <div className="ve" data-events-page>
    <div className="ve-top dark">
    <img className="ve-backdrop" src={EVENTS[0].image} alt="" aria-hidden width={1000} height={1250}/>
    <header className="ve-heading px-[22px]"><div><h1 ref={heading} tabIndex={-1}>Sự kiện</h1></div><Button variant="secondary" size="32" className="ve-icon" aria-label="Sự kiện đã lưu" aria-pressed={savedOnly} onClick={() => setSavedOnly(value => !value)}><Heart size={21} fill={savedOnly ? "currentColor" : "none"}/></Button></header>
    <div className="ve-categories" role="group" aria-label="Loại sự kiện">{CATEGORIES.map(value => <Button key={value} variant="secondary" size="32" aria-pressed={category === value} onClick={() => setCategory(value)}>{value}</Button>)}</div>
    {!savedOnly && category === "Tất cả" && <section className="ve-featured-section px-[22px] pt-[24px]" aria-label="VinClub chọn cho bạn">
      <div className="ve-featured rounded-28">
        <div className="ve-featured-photo"><Button variant="secondary" className="ve-featured-link" aria-label={`Khám phá ${EVENTS[0].title}`} onClick={() => select(EVENTS[0])}><img src={EVENTS[0].image} alt="Sân khấu concert trên đảo ngọc với ánh sáng và pháo hoa" width={1024} height={1280}/></Button>{heart(EVENTS[0])}</div>
        <div className="ve-featured-copy"><p>GRAND WORLD · PHÚ QUỐC</p><Button variant="secondary" className="ve-featured-title" onClick={() => select(EVENTS[0])}>Đêm nhạc giữa đảo ngọc</Button><span className="ve-concert-time"><CalendarDays size={14}/>15.11.2026 · 17:30</span></div>
      </div>
      <div className="ve-ticket-strip"><div><strong><span>Từ</span> 300.000đ</strong></div><Button variant="primary" size="32" className="ve-ticket-cta" onClick={() => select(EVENTS[0])}>Xem vé</Button></div>
    </section>}

    </div>

    <section className="ve-results px-[22px] pt-[24px] pb-[12px]" aria-label="Danh sách sự kiện"><div className="ve-section-head"><h2>{savedOnly ? "Những cuộc hẹn đã lưu" : "Đi đâu, chơi gì?"}</h2><span>{filtered.length}</span></div><p className="ve-prototype">Từ sân khấu rực sáng đến một ngày bên biển.</p>
      <div className="ve-list" key={`${category}-${savedOnly}`}>{filtered.map(event => <article className="ve-card" key={event.id}><div className="ve-card-image rounded-14"><Button variant="secondary" className="ve-image-link" onClick={() => select(event)} aria-label={`Xem ${event.title}`}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={event.image} alt="" width={360} height={420}/></Button>{heart(event)}<span className="ve-date rounded-8"><strong>{event.day}</strong><small>{event.month}</small></span></div><div className="ve-card-info"><p>{event.category} · {event.city}</p><Button variant="secondary" className="ve-title" onClick={() => select(event)}>{event.title}</Button><small>{event.venue}</small><span className="ve-time">{event.day}/11 · {event.time.split(" – ")[0]}</span><strong className="ve-price">{event.price > 0 && <small>Từ </small>}{price(event.price)}{event.price > 0 && <small> / người</small>}</strong>{event.tag === "Dành cho hội viên" && <span className="ve-member-tag">Quyền lợi hội viên</span>}</div></article>)}</div>
      {filtered.length === 0 && <div className="ve-empty"><CalendarDays size={32}/><h3>{savedOnly ? "Chưa có cuộc hẹn nào được lưu" : "Chưa tìm thấy trải nghiệm phù hợp"}</h3><p>{savedOnly ? "Chạm trái tim trên sự kiện bạn thích để lưu tại đây." : "Thử một địa điểm hoặc loại sự kiện khác nhé."}</p><Button variant="secondary" size="32" onClick={() => { setCategory("Tất cả"); setSavedOnly(false); }}>Xem tất cả sự kiện</Button></div>}
    </section>
    <p className="ve-prototype ve-disclaimer px-[22px]">Lịch trải nghiệm mẫu · Thông tin và giá minh họa</p>
  </div>;
}
