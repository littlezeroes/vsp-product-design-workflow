"use client";

import { useState } from "react";
import { Award, Bike, Check, ChevronRight, Flame, Gift, Lock, Search, Ticket, Users, Zap } from "lucide-react";
import { DailyIcon } from "@/components/vinclub/daily-icons";
import { illustrationAssets as art } from "@/app/vinclub-dualsurface/illustration-assets";

/* Second research round: Homes built around progress and member identity, plus the Hội viên page. All data is sample data. */
type Props = { tier: string; onPay: () => void; onMember?: () => void; picks?: Record<string, number> };
function Photo({ src, className }: { src: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} src={src} alt="" />;
}
const Pay = ({ onPay }: { onPay: () => void }) => <button type="button" className="vx-pay" aria-label="Mở VinPay" onClick={onPay}><small>VinPay</small><b>28.650.000 ₫</b><ChevronRight size={14} /></button>;

/* 9. Sweatcoin: a daily goal ring fills the first screen; rewards ride under it. */
export function DailyGoal({ tier, onPay }: Props) {
  const [claimed, setClaimed] = useState(false);
  return <>
    <header className="vy-bar"><span className="vy-streak"><Flame size={16} />3 ngày</span><Pay onPay={onPay} /></header>
    <section className="vy-goal"><div className="vy-goal-ring"><div><small>VPoint hôm nay</small><strong>{claimed ? 70 : 20}</strong><span>Mục tiêu 100 · Hạng {tier}</span></div></div><button type="button" className="vy-boost" aria-label="Bật nhân đôi"><Zap size={22} /></button><p>Bật nhân đôi VPoint hôm nay</p></section>
    <ol className="vy-week">{["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, index) => <li key={day} data-on={index === 2 || undefined}><Gift size={18} /><small>{day}</small></li>)}</ol>
    <section className="vy-rail">
      <article><small>Quà hôm nay</small><strong>{claimed ? "1/3" : "0/3"}</strong><button type="button" disabled={claimed} onClick={() => setClaimed(true)}>{claimed ? "Đã nhận" : "Nhận 50"}</button></article>
      <article><small>Mua vé sự kiện</small><strong>x2</strong><button type="button">Xem vé</button></article>
      <article><small>Mời đồng nghiệp</small><strong>+500</strong><button type="button">Mời</button></article>
    </section>
  </>;
}

/* 10. Crypto.com Rewards+: tiers as a journey of stations; the next one is unlocked by quests. */
export function Journey({ tier, onPay }: Props) {
  const stops = [
    { name: "Bạc", state: "done", note: "Đã đạt", perks: ["x1 VPoint", "Voucher sinh nhật"] },
    { name: "Vàng", state: "now", note: `Hạng hiện tại: ${tier}`, perks: ["x1,5 VPoint", "Mua vé sớm"] },
    { name: "Bạch Kim", state: "next", note: "2/3 nhiệm vụ", perks: ["x2 VPoint", "Phòng chờ sự kiện"] },
    { name: "Kim Cương", state: "lock", note: "Mở sau Bạch Kim", perks: ["x3 VPoint", "Quản lý riêng"] },
  ];
  return <>
    <header className="vx-top"><div><small>12.450 VPoint</small><h1>Hành trình hạng</h1></div><Pay onPay={onPay} /></header>
    <ol className="vy-journey">{stops.map(stop => <li key={stop.name} data-state={stop.state}>
      <div className="vy-stop-head"><i>{stop.state === "lock" ? <Lock size={18} /> : stop.state === "done" ? <Check size={18} /> : <Award size={18} />}</i><span><strong>{stop.name}</strong><small>{stop.note}</small></span></div>
      <div className="vy-perks">{stop.perks.map(perk => <span key={perk}>{perk}</span>)}</div>
      {stop.state === "next" && <button type="button" className="vx-primary">Làm nhiệm vụ cuối</button>}
    </li>)}</ol>
  </>;
}

/* 11. Abode, Rodeo: a bento of live widgets, each its own small reason to tap. */
export function Bento({ tier, onPay }: Props) {
  const days = Array.from({ length: 14 }, (_, index) => index + 10);
  return <>
    <header className="vx-top"><div><small>Hạng {tier}</small><h1>Hôm nay</h1></div><Pay onPay={onPay} /></header>
    <section className="vy-bento">
      <button type="button" className="vy-b-points"><small>VPoint</small><strong>12.450</strong><i aria-hidden><i /></i><em>Còn 550 lên Bạch Kim</em></button>
      <button type="button" className="vy-b-ticket"><Photo src={art.weekend} /><span><small>Còn 14 ngày</small><strong>Đêm nhạc mẫu</strong></span></button>
      <button type="button" className="vy-b-calendar"><strong>Tháng 11</strong><span>{days.map(day => <i key={day} data-on={[15, 22].includes(day) || undefined}>{day}</i>)}</span></button>
      <button type="button" className="vy-b-voucher"><small>Sắp hết hạn</small><strong>100.000đ</strong><em>WinMart · 2 ngày</em></button>
      <button type="button" className="vy-b-gift"><Gift size={26} /><strong>Mở quà</strong><em>Hôm nay</em></button>
      <button type="button" className="vy-b-staff"><Users size={22} /><span><strong>Nhân viên tập đoàn</strong><em>Xác minh để nhận hạng riêng</em></span><ChevronRight size={18} /></button>
    </section>
  </>;
}

/* 12. Shangri-La Circle: the next booking sits on top, then the ecosystem and editorial offers. */
export function NextUp({ tier, onPay }: Props) {
  return <>
    <section className="vx-card vy-next"><div><span><Ticket size={16} />VinWonders</span><b>Sắp diễn ra</b></div><strong>Đêm nhạc mẫu</strong><p>Thứ Bảy, 15/11 · 20:00 · Còn 14 ngày</p><div className="vy-next-cta"><button type="button">Thêm lịch</button><button type="button">Mở vé</button></div></section>
    <div className="vx-search vy-search"><Search size={20} /><span>Tìm ưu đãi, sự kiện</span></div>
    <section className="vy-round">{[["GreenSM", "car"], ["Vinmec", "medical"], ["Vinpearl", "hotel"], ["Vincom", "shopping"], ["WinMart", "grocery"]].map(([name, icon]) => <button type="button" key={name}><i><DailyIcon name={icon} size={40} /></i><small>{name}</small></button>)}</section>
    <button type="button" className="vy-member" onClick={onPay}><span>Hạng {tier}</span><b>12.450 VPoint</b></button>
    <section className="vy-editorial"><button type="button"><Photo src={art.escape} /><span><strong>Kho voucher thứ Ba</strong><small>Nhận mới mỗi tuần lúc 12:00</small></span></button><div><button type="button"><Photo src={art.shopping} /><small>Chỉ cho hội viên</small><strong>Nhân đôi VPoint</strong></button><button type="button"><Photo src={art.wellness} /><small>Chỉ cho hội viên</small><strong>Giảm 20% gói khám</strong></button></div></section>
  </>;
}

/* Hội viên tab, not a Home: tier, challenges that earn badges, then the badge case (after Strava). */
const BADGES = [
  { id: "greenfood", name: "Chiến thần Greenfood", brand: "Greenfood", on: true },
  { id: "vinpearl", name: "Chill guy Vinpearl", brand: "Vinpearl", on: true },
  { id: "vinfast", name: "Tay lái vàng VinFast", brand: "VinFast", on: true },
  { id: "vinwonders", name: "Phá đảo VinWonders", brand: "VinWonders", on: false },
  { id: "vincom", name: "Trùm săn deal Vincom", brand: "Vincom", on: false },
  { id: "vinpay", name: "Cao thủ VinPay", brand: "VinPay", on: false },
];
export function MemberPage({ tier, onPay }: Props) {
  return <>
    <header className="vx-top"><div><small>Hội viên</small><h1>12.450 VPoint</h1></div><Pay onPay={onPay} /></header>
    <section className="vx-tier"><div><strong>{tier}</strong><small>Hiệu lực đến 31/12/2026</small></div><p>Còn 550 VPoint nữa lên Bạch Kim<ChevronRight size={14} /></p><ol aria-hidden><li data-on /><li data-on /><li /></ol><div className="vx-tier-scale"><small>Bạc</small><small>Vàng</small><small>Bạch Kim</small></div></section>
    <section className="vy-block vy-block-first"><button type="button" className="vy-event"><i className="vy-staff"><Users size={22} /></i><span><strong>Hạng nhân viên tập đoàn</strong><em>Xác minh để nhận quyền lợi riêng</em></span><ChevronRight size={18} /></button></section>
    <section className="vy-block vy-member-badges" aria-label="Tủ huy hiệu"><div className="vx-head"><h2>Tủ huy hiệu</h2><span className="vy-count">{BADGES.filter(item => item.on).length}/{BADGES.length}</span></div><div className="vy-badge-grid">{BADGES.map(item => <figure key={item.id} data-earned={item.on}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/vinclub-assets/badges-v1/${item.id}.png`} alt={item.name} width={1254} height={1254} loading="lazy" decoding="async" />
      <figcaption><small>{item.brand}</small><strong>{item.name}</strong><span>{item.on ? <Check size={12} aria-hidden /> : <Lock size={12} aria-hidden />}{item.on ? "Đã đạt" : "Chưa mở khóa"}</span></figcaption>
    </figure>)}</div></section>
    <section className="vy-block"><div className="vx-head"><h2>Thử thách nhận huy hiệu</h2><button type="button">Tất cả<ChevronRight size={14} /></button></div><div className="vy-challenges">{[{ t: "Đi đủ 5 sự kiện", v: 20, m: "1/5 · Huy hiệu 5 sự kiện", I: Ticket }, { t: "Dùng 7 thương hiệu", v: 57, m: "4/7 · +500 VPoint", I: Bike }].map(item => <button type="button" key={item.t}><i><item.I size={22} /></i><span><strong>{item.t}</strong><em>{item.m}</em><u aria-hidden><u style={{ width: `${item.v}%` }} /></u></span></button>)}</div></section>
  </>;
}

/* 14. Discord Nitro, Target Circle: the whole Home is the membership, one perk per large card. */
export function Perks({ tier, onPay }: Props) {
  const [tab, setTab] = useState("Mới");
  const list = tab === "Mới" ? [{ s: art.weekend, t: "Mua vé trước 24 giờ", c: "Hội viên được mở bán sớm.", a: "Xem vé" }, { s: art.shopping, t: "Nhân đôi VPoint tại Vincom", c: "Tự động áp dụng đến hết tháng.", a: "Đi mua sắm" }] : [{ s: art.escape, t: "Giảm 15% phòng nghỉ", c: "Áp dụng cho hạng Vàng.", a: "Dùng ngay" }, { s: art.wellness, t: "Giảm 20% gói khám", c: "Dùng được tại Vinmec.", a: "Đặt lịch" }];
  return <>
    <header className="vy-perk-head"><div><small>Hạng {tier}</small><h1>Quyền lợi của bạn</h1></div><Pay onPay={onPay} /></header>
    <div className="vy-tabs" role="group" aria-label="Quyền lợi">{["Mới", "Đang có"].map(item => <button type="button" key={item} aria-pressed={tab === item} onClick={() => setTab(item)}>{item}</button>)}</div>
    <section className="vy-perks-list">{list.map(item => <article key={item.t}><Photo src={item.s} /><div><h2>{item.t}</h2><p>{item.c}</p><button type="button">{item.a}</button></div></article>)}</section>
  </>;
}

/* Promote product uses the Dịch vụ rule from Home VinPay: 1 is a row card, 2 are white cards, 3 or more become the icon grid. Sample products. */
const PRODUCTS = [
  { i: "hotel", t: "Nghỉ dưỡng", s: "Ưu đãi đến 30%" },
  { i: "grocery", t: "Đi chợ", s: "Giảm 100k" },
  { i: "shopping", t: "Mua sắm", s: "Nhân đôi VPoint" },
  { i: "medical", t: "Sức khỏe", s: "Giảm 20% gói khám" },
];
function Promote({ count = "2" }: { count?: string }) {
  const items = PRODUCTS.slice(0, Number(count));
  return <section className="vz-products" aria-label="Sản phẩm nổi bật">
    {items.length === 1 ? <button type="button" className="vz-p-row"><DailyIcon name={items[0].i} size={44} /><span><strong>{items[0].t}</strong><small>{items[0].s}</small></span><b>Khám phá<ChevronRight size={16} /></b></button>
      : items.length === 2 ? <div className="vz-p-cards">{items.map(item => <button type="button" key={item.t}><DailyIcon name={item.i} size={44} /><span><small>{item.t}</small><strong>{item.s}</strong></span></button>)}</div>
        : <div className="vz-p-grid">{items.map(item => <button type="button" key={item.t}><DailyIcon name={item.i} size={44} /><small>{item.t}</small></button>)}</div>}
  </section>;
}

/* 15. The agreed structure: status on top, promoted product, how to reach the next tier, then one suggestion feed. */
const SUGGEST = {
  "Ưu đãi": [{ s: art.escape, b: "Vinpearl", t: "Giảm 15% phòng nghỉ", m: "Còn 30 ngày" }, { s: art.winmart, b: "WinMart", t: "Giảm 100.000đ", m: "Còn 2 ngày" }, { s: art.shopping, b: "Vincom", t: "Nhân đôi VPoint", m: "Hết tuần này" }],
  "Sự kiện": [{ s: art.weekend, b: "VinWonders", t: "Đêm nhạc mẫu", m: "15/11 · Còn 120 vé" }, { s: art.escape, b: "Vinpearl", t: "Lễ hội mẫu cuối tuần", m: "22/11 · Từ 200.000đ" }],
  "Tin mới": [{ s: art.food, b: "VinClub", t: "Tin mẫu về quyền lợi hội viên", m: "Hôm nay" }, { s: art.wellness, b: "Vinmec", t: "Tin mẫu về chăm sóc sức khỏe", m: "2 ngày trước" }],
};
function Top({ tier, onPay, onMember, kind }: Props & { kind: number }) {
  const label = "Mở ví VinClub";
  if (kind === 2) return <section className="vz-t2" aria-label="Hạng, VPoint và ví"><button type="button" onClick={onMember}><small>Hạng</small><strong>{tier}</strong></button><div><button type="button" onClick={onMember}><small>VPoint</small><b>12.450</b></button><button type="button" aria-label={label} onClick={onPay}><small>Ví VinClub</small><b>28.650.000 ₫</b></button></div></section>;
  if (kind === 3) return <section className="vz-t3" aria-label="Hạng, VPoint và ví"><button type="button" onClick={onMember}><small>Hạng</small><strong>{tier}</strong></button><button type="button" onClick={onMember}><small>VPoint</small><strong>12.450</strong></button><button type="button" aria-label={label} onClick={onPay}><small>Ví VinClub</small><strong>28.650.000 ₫</strong></button></section>;
  if (kind === 4) return <section className="vz-t4" aria-label="Hạng, VPoint và ví"><button type="button" onClick={onMember}><small>Hạng {tier}</small><strong>12.450</strong><span>VPoint</span></button><button type="button" className="vx-pay" aria-label={label} onClick={onPay}><small>Ví VinClub</small><b>28.650.000 ₫</b><ChevronRight size={14} /></button></section>;
  return <section className="vz-top" aria-label="Hạng, VPoint và ví">
    <button type="button" className="vz-tier" onClick={onMember}><small>Hạng</small><strong>{tier}</strong><ChevronRight size={18} /></button>
    <div className="vz-cells"><button type="button" onClick={onMember}><small>VPoint</small><strong>12.450</strong></button><button type="button" onClick={onPay} aria-label={label}><small>Ví VinClub</small><strong>28.650.000 ₫</strong></button></div>
  </section>;
}
const TASKS = [{ I: Gift, t: "Dùng 1 voucher WinMart", v: "+100" }, { I: Bike, t: "Đi 3 chuyến GreenSM", v: "+150" }, { I: Award, t: "Mua sắm tại Vincom", v: "+300" }];
function Unlock({ kind }: { kind: number }) {
  const head = <p className="vz-need"><span>Còn 550 VPoint để mở khóa <b>Bạch Kim</b></span></p>;
  const bar = <i className="vx-bar-progress" aria-hidden><i style={{ width: "96%" }} /></i>;
  if (kind === 2) return <section className="vz-suggest vz-up2" aria-label="Mở khóa hạng tiếp theo"><h2>Mở khóa hạng tiếp theo</h2><div className="vz-pad">{head}{bar}</div><div className="vz-taskrail">{TASKS.map(item => <button type="button" key={item.t}><i><item.I size={20} /></i><strong>{item.t}</strong><b>{item.v} VPoint</b></button>)}</div></section>;
  if (kind === 3) return <section className="vx-section vz-up" aria-label="Mở khóa hạng tiếp theo"><h2>Mở khóa hạng tiếp theo</h2><div className="vx-card vz-compare">{head}{bar}<div><span><small>Vàng, hiện tại</small><em>x1,5 VPoint</em><em>Voucher sinh nhật</em></span><span data-next><small>Bạch Kim</small><em>x2 VPoint</em><em>Giảm 20% phòng nghỉ</em></span></div><button type="button" className="vx-primary">Xem cách đạt</button></div></section>;
  if (kind === 4) return <section className="vx-section vz-up" aria-label="Mở khóa hạng tiếp theo"><h2>Mở khóa hạng tiếp theo</h2><div className="vx-card vz-one">{head}{bar}<small>Nên làm tiếp</small><strong>Dùng 1 voucher WinMart, nhận 100 VPoint</strong><button type="button" className="vx-primary">Dùng ngay</button></div></section>;
  return <section className="vx-section vz-up" aria-label="Mở khóa hạng tiếp theo"><h2>Mở khóa hạng tiếp theo</h2>
    <div className="vx-card">{head}{bar}{TASKS.map(item => <button type="button" key={item.t}><i><item.I size={20} /></i><strong>{item.t}</strong><b>{item.v}</b><ChevronRight size={16} /></button>)}</div></section>;
}
function Suggest({ kind }: { kind: number }) {
  const [tag, setTag] = useState<keyof typeof SUGGEST>("Ưu đãi");
  const chips = <div className="vx-chips">{(Object.keys(SUGGEST) as (keyof typeof SUGGEST)[]).map(item => <button type="button" key={item} aria-pressed={tag === item} onClick={() => setTag(item)}>{item}</button>)}</div>;
  const mixed = [SUGGEST["Ưu đãi"][0], SUGGEST["Ưu đãi"][1], SUGGEST["Tin mới"][0], SUGGEST["Ưu đãi"][2]];
  const body = kind === 2 ? <>{chips}<div className="vz-sgrid">{SUGGEST[tag].map(item => <button type="button" key={item.t}><Photo src={item.s} /><small>{item.b}</small><strong>{item.t}</strong><em>{item.m}</em></button>)}</div></>
    : kind === 3 ? <div className="vz-srail">{mixed.map(item => <button type="button" key={item.t}><Photo src={item.s} /><span><small>{item.b}</small><strong>{item.t}</strong><em>{item.m}</em></span></button>)}</div>
      : kind === 4 ? <div className="vz-sbig">{mixed.slice(0, 3).map(item => <button type="button" key={item.t}><Photo src={item.s} /><span><small>{item.b}</small><strong>{item.t}</strong><em>{item.m}</em></span></button>)}</div>
        : <>{chips}<div className="vz-list">{SUGGEST[tag].map(item => <button type="button" key={item.t}><Photo src={item.s} /><span><small>{item.b}</small><strong>{item.t}</strong><em>{item.m}</em></span><ChevronRight size={18} /></button>)}</div></>;
  return <section className="vz-suggest" aria-label="Gợi ý cho bạn"><h2>Gợi ý cho bạn</h2>{body}</section>;
}
export function Plan({ tier, onPay, onMember, picks }: Props) {
  return <>
    <Top tier={tier} onPay={onPay} onMember={onMember} kind={picks?.top ?? 1} />
    <Promote count={String(picks?.promote ?? 2)} />
    <Unlock kind={picks?.unlock ?? 1} />
    <Suggest kind={picks?.suggest ?? 1} />
  </>;
}
