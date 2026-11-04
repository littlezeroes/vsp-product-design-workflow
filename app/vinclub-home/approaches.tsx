"use client";

import { useState, type ComponentType } from "react";
import { Check, ChevronRight, Search } from "lucide-react";
import { DailyIcon } from "@/components/vinclub/daily-icons";
import { illustrationAssets as art } from "@/app/vinclub-dualsurface/illustration-assets";

/* Seven structurally different VinClub Homes. Each leads with a different hook. All data is sample data. */
type Props = { tier: string; onPay: () => void; onMember?: () => void; picks?: Record<string, number> };

function Photo({ src, className }: { src: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} src={src} alt="" />;
}
const Pay = ({ onPay }: { onPay: () => void }) => <button type="button" className="vx-pay" aria-label="Mở VinPay" onClick={onPay}><small>VinPay</small><b>28.650.000 ₫</b><ChevronRight size={14} /></button>;
const Head = ({ title, action }: { title: string; action?: string }) => <div className="vx-head"><h2>{title}</h2>{action && <button type="button">{action}<ChevronRight size={14} /></button>}</div>;

const TICKETS = [
  { src: art.weekend, status: "Đã giữ vé", title: "Đêm nhạc mẫu", meta: "Thứ Bảy, 15/11 · 20:00", place: "VinWonders" },
  { src: art.winmart, status: "Còn 2 ngày", title: "Voucher giảm 100.000đ", meta: "Dùng trước 03/11", place: "WinMart" },
  { src: art.escape, status: "Còn 30 ngày", title: "Giảm 15% phòng nghỉ", meta: "Dùng trước 30/11", place: "Vinpearl" },
];
const PICKS = [
  { src: art.escape, tag: "Sự kiện", title: "Lễ hội mẫu cuối tuần", meta: "Vinpearl · Từ 200.000đ" },
  { src: art.shopping, tag: "Ưu đãi", title: "Nhân đôi VPoint", meta: "Vincom · Hết tuần này" },
  { src: art.wellness, tag: "Ưu đãi", title: "Giảm 20% gói khám", meta: "Vinmec · Hết tháng 11" },
  { src: art.food, tag: "Tin mới", title: "Tin mẫu về quyền lợi hội viên", meta: "VinClub · Hôm nay" },
];
const Picks = ({ title = "Dành cho bạn" }: { title?: string }) => <section className="vx-section"><Head title={title} action="Tất cả" /><div className="vx-grid">{PICKS.map(item => <button type="button" key={item.title}><Photo src={item.src} /><small>{item.tag}</small><strong>{item.title}</strong><em>{item.meta}</em></button>)}</div></section>;

/* 1. Luma: what I already own comes first. */
function Agenda({ tier, onPay }: Props) {
  return <>
    <header className="vx-top"><div><small>Hạng {tier} · 12.450 VPoint</small><h1>Sắp tới của bạn</h1></div><Pay onPay={onPay} /></header>
    <section className="vx-section vx-agenda">{TICKETS.map(item => <button type="button" key={item.title}><span className="vx-thumb"><Photo src={item.src} /><i>{item.status}</i></span><span><small>{item.place}</small><strong>{item.title}</strong><em>{item.meta}</em></span></button>)}</section>
    <Picks />
  </>;
}

/* 2. Shopee, SHEIN, ShopBack: a daily streak is the reason to open the app. */
function Streak({ tier, onPay }: Props) {
  const [done, setDone] = useState(false);
  const days = [10, 10, 20, 20, 30, 30, 100];
  return <>
    <header className="vx-top"><div><small>Hạng {tier}</small><h1>{done ? "12.470" : "12.450"} VPoint</h1></div><Pay onPay={onPay} /></header>
    <section className="vx-card vx-streak"><div className="vx-streak-head"><strong>Chuỗi {done ? 4 : 3} ngày</strong><small>7 ngày nhận 100 VPoint</small></div>
      <ol>{days.map((value, index) => { const finished = index < 3 || (done && index === 3); return <li key={index} data-state={finished ? "done" : index === 3 ? "today" : undefined}><i>{finished ? <Check size={16} /> : `+${value}`}</i><small>{index === 3 && !done ? "Hôm nay" : `Ngày ${index + 1}`}</small></li>; })}</ol>
      <button type="button" className="vx-primary" disabled={done} onClick={() => setDone(true)}>{done ? "Đã điểm danh, mai quay lại nhé" : "Điểm danh nhận 20 VPoint"}</button></section>
    <section className="vx-section vx-rail-wrap"><Head title="Kiếm thêm VPoint" /><div className="vx-rail">{[{ t: "Vòng quay may mắn", m: "1 lượt miễn phí", s: art.weekend }, { t: "Mua vé sự kiện", m: "Nhân đôi VPoint", s: art.escape }, { t: "Đi GreenSM", m: "+50 VPoint mỗi chuyến", s: art.ride }].map(item => <button type="button" key={item.t}><Photo src={item.s} /><strong>{item.t}</strong><em>{item.m}</em></button>)}</div></section>
    <Picks title="Đổi VPoint" />
  </>;
}

/* 3. DICE, Live Nation: one poster sells the event, like a media app. */
function Poster({ onPay }: Props) {
  return <>
    <header className="vx-top"><div><small>Vừa mở bán</small><h1>Đang diễn ra</h1></div><Pay onPay={onPay} /></header>
    <div className="vx-chips">{["Tất cả", "Âm nhạc", "Lễ hội", "Gia đình", "Ẩm thực"].map((item, index) => <button type="button" key={item} aria-pressed={index === 0}>{item}</button>)}</div>
    <section className="vx-poster"><Photo src={art.weekend} /><div><small>Còn 120 vé · 15/11</small><h2>Đêm nhạc mẫu tại VinWonders</h2><button type="button" className="vx-primary">Giữ vé · Từ 300.000đ</button></div></section>
    <section className="vx-section vx-rail-wrap"><Head title="Tuần này" action="Tất cả" /><div className="vx-rail vx-rail-tall">{[{ t: "Lễ hội mẫu cuối tuần", m: "Vinpearl · 22/11", s: art.escape }, { t: "Hội chợ mẫu", m: "Vincom · 23/11", s: art.shopping }, { t: "Ngày hội gia đình", m: "VinWonders · 29/11", s: art.apartment }].map(item => <button type="button" key={item.t}><Photo src={item.s} /><strong>{item.t}</strong><em>{item.m}</em></button>)}</div></section>
    <Picks title="Ưu đãi cho bạn" />
  </>;
}

/* 4. Starbucks: points banner, then one concrete mission with a checklist. */
function Mission({ tier, onPay }: Props) {
  const [tasks, setTasks] = useState([true, false, false]);
  const count = tasks.filter(Boolean).length;
  return <>
    <header className="vx-top"><div><small>Chào buổi sáng</small><h1>Hôm nay làm gì?</h1></div><Pay onPay={onPay} /></header>
    <section className="vx-points"><span><small>Số VPoint</small><strong>12.450</strong></span><b>Hạng {tier}<ChevronRight size={16} /></b></section>
    <section className="vx-card vx-mission"><small>Nhiệm vụ tuần · Còn 4 ngày</small><h2>Làm đủ 3 việc, nhận 500 VPoint</h2><i className="vx-bar-progress" aria-hidden><i style={{ width: `${count / 3 * 100}%` }} /></i>
      <ul>{["Đi 1 chuyến GreenSM", "Dùng 1 voucher WinMart", "Mua 1 vé sự kiện"].map((label, index) => <li key={label}><button type="button" aria-pressed={tasks[index]} onClick={() => setTasks(list => list.map((value, at) => at === index ? !value : value))}><i>{tasks[index] && <Check size={14} />}</i>{label}</button></li>)}</ul></section>
    <Picks />
  </>;
}

/* 5. Yami, Shell: the tier card is the identity; benefits sit right under it. */
function Tier({ tier, onPay }: Props) {
  return <>
    <header className="vx-top"><div><small>Chào bạn</small><h1>Hạng của bạn</h1></div><Pay onPay={onPay} /></header>
    <section className="vx-tier"><div><strong>{tier}</strong><small>Hiệu lực đến 31/12/2026</small></div><p>Còn 550 VPoint nữa lên Bạch Kim<ChevronRight size={14} /></p><ol aria-hidden><li data-on /><li data-on /><li /></ol><div className="vx-tier-scale"><small>Bạc</small><small>Vàng</small><small>Bạch Kim</small></div></section>
    <section className="vx-section"><Head title="Quyền lợi của bạn" action="Tất cả" />
      {[{ i: "shopping", t: "Nhân đôi VPoint tại Vincom", s: "Áp dụng cho hạng Vàng", c: "Dùng" }, { i: "travel", t: "Mua vé trước 24 giờ", s: "Mở bán sớm cho hội viên", c: "Xem vé" }, { i: "car", t: "Hạng nhân viên tập đoàn", s: "Xác minh để nhận quyền lợi", c: "Xác minh" }].map(item => <button type="button" className="vx-benefit" key={item.t}><DailyIcon name={item.i} size={40} /><span><strong>{item.t}</strong><em>{item.s}</em></span><b>{item.c}</b></button>)}</section>
    <Picks />
  </>;
}

/* 6. Blackbird, Qantas: big number and rings; progress is the whole message. */
function Rings({ tier, onPay }: Props) {
  const ring = (value: number) => ({ background: `conic-gradient(var(--ink) ${value}%, var(--line) 0)` });
  return <>
    <section className="vx-big"><small>Hạng {tier}</small><strong>12.450</strong><span>VPoint</span><Pay onPay={onPay} /></section>
    <section className="vx-card vx-rings"><div className="vx-head"><h2>Tiến độ lên Bạch Kim</h2><ChevronRight size={18} /></div><div>{[{ v: 96, a: "12.450 / 13.000", b: "VPoint" }, { v: 60, a: "3 / 5", b: "Dịch vụ đã dùng" }].map(item => <span key={item.b}><i style={ring(item.v)} /><span><strong>{item.a}</strong><small>{item.b}</small></span></span>)}</div></section>
    <section className="vx-card vx-earn"><span><strong>Thêm cách kiếm VPoint</strong><em>Làm nhiệm vụ trong hệ sinh thái để lên hạng nhanh hơn.</em></span><Photo src={art.weekend} /></section>
    <Picks />
  </>;
}

/* 7. Gojek, Grab: services first, offers ride on the icons. */
function Super({ tier, onPay }: Props) {
  const services = [{ n: "GreenSM", i: "car", b: "-20k" }, { n: "Vinmec", i: "medical" }, { n: "Vinschool", i: "school" }, { n: "Vinpearl", i: "hotel", b: "-15%" }, { n: "VinWonders", i: "travel", b: "Vé mới" }, { n: "Vincom", i: "shopping", b: "x2" }, { n: "WinMart", i: "grocery", b: "-100k" }, { n: "Vé sự kiện", i: "flight" }];
  return <>
    <header className="vx-search"><Search size={20} /><span>Tìm ưu đãi, sự kiện, dịch vụ</span></header>
    <section className="vx-services">{services.map(item => <button type="button" key={item.n}>{item.b && <i>{item.b}</i>}<DailyIcon name={item.i} size={44} /><small>{item.n}</small></button>)}</section>
    <div className="vx-tiles"><button type="button" onClick={onPay}><small>VinPay</small><strong>28.650.000 ₫</strong></button><button type="button"><small>VPoint · {tier}</small><strong>12.450</strong></button><button type="button"><small>Voucher của tôi</small><strong>3 voucher</strong></button></div>
    <section className="vx-banner"><Photo src={art.weekend} /><span><small>Vừa mở bán</small><strong>Đêm nhạc mẫu, còn 120 vé</strong></span></section>
    <Picks />
  </>;
}

export const APPROACH_VIEWS: Record<string, ComponentType<Props>> = { agenda: Agenda, streak: Streak, poster: Poster, mission: Mission, tier: Tier, rings: Rings, super: Super };
