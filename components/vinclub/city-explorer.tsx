"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ChevronLeft, X, Search, Navigation, RotateCcw, Heart, ChevronRight, ShoppingBag, Check, Sparkles, Car, Layers } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FixedBottom } from "@/components/ui/fixed-bottom";
import { MiniCity } from "./mini-city";
import { ServiceIcon } from "./visuals";
import { explorationLandmarks, shoppingStores } from "./shopping-data";
import "./city-explorer.css";

type Snap = "peek" | "half" | "full";
type Props = { initialPlace?: string; bagCount: number; onClose: () => void; onMall: (id: string) => void; onRide: (id: string) => void; onStore: (id: string) => void; onBag: () => void };
const destinations = [...explorationLandmarks, { ...explorationLandmarks[0], id: "vincom-center", name: "Vincom Center" }, { ...explorationLandmarks[0], id: "vincom-plaza", name: "Vincom Plaza" }];
const intents = [{ name: "Mua sắm", id: "vincom", icon: "shopping" }, { name: "Đi chợ", id: "winmart", icon: "food" }, { name: "Chăm sóc", id: "vinmec", icon: "medical" }, { name: "Cuối tuần", id: "events", icon: "travel" }];
const categories = [{ name: "Tất cả", id: "all", icon: "home" }, ...intents.map(p => p.id === "events" ? { ...p, name: "Sự kiện" } : p)];
const matchesCategory = (id: string, category: string) => category === "all" || (category === "vincom" ? id.startsWith("vincom") : id === category);

export function CityExplorer({ initialPlace, bagCount, onClose, onMall, onRide, onStore, onBag }: Props) {
  const [selected, setSelected] = useState(initialPlace);
  const [revision, setRevision] = useState(0);
  const [snap, setSnap] = useState<Snap>(initialPlace ? "half" : "peek");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const [choice, setChoice] = useState("");
  const [recorded, setRecorded] = useState(false);
  const [plan, setPlan] = useState(false);
  const [category, setCategory] = useState("all");
  const dragged = useRef(false);
  const drag = useRef<{ y: number; start: Snap } | null>(null);
  const place = destinations.find(p => p.id === selected);
  const vincom = selected?.startsWith("vincom");
  const filtered = destinations.filter(p => matchesCategory(p.id, category));
  const results = destinations.filter(p => `${p.name} ${p.category} ${p.choices.join(" ")} ${intents.find(i=>i.id===p.id)?.name||""}`.toLocaleLowerCase("vi").includes(query.toLocaleLowerCase("vi")));
  const visibleIds = query ? results.map(p => p.id) : filtered.map(p => p.id);
  const choose = (id: string) => { if (id === "home") return; if(!matchesCategory(id,category))setCategory("all");setSelected(id); setRevision(r => r + 1); setSnap("half"); setQuery(""); setChoice(""); setRecorded(false); };
  const overview = () => { setSelected(undefined); setCategory("all");setRevision(r => r + 1); setSnap("peek"); setQuery(""); setRecorded(false); };
  const filterCategory = (id: string) => { setCategory(id);setSelected(undefined);setQuery("");setRevision(r=>r+1);setSnap("half");setPlan(false);setRecorded(false); };
  const categoryControls = <nav className="cx-categories px-[22px]" aria-label="Danh mục khám phá">{categories.map(item=><Button key={item.id} variant="secondary" size="32" aria-pressed={category===item.id} onClick={()=>filterCategory(item.id)}><ServiceIcon name={item.icon} size={24}/>{item.name}</Button>)}</nav>;
  useEffect(()=>{queueMicrotask(()=>{try{const value=JSON.parse(sessionStorage.getItem("vinclub-map-saved")||"[]");if(Array.isArray(value))setSaved(value.filter((id):id is string=>typeof id==="string"));}catch{ /* Saved places remain available in the current view. */ }});},[]);
  const toggleSave = () => { if(!selected)return;const next=saved.includes(selected)?saved.filter(id=>id!==selected):[...saved,selected];setSaved(next);try{sessionStorage.setItem("vinclub-map-saved",JSON.stringify(next));}catch{ /* Keep the local list if storage is unavailable. */ } };
  const endDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (!drag.current) return;
    const delta = event.clientY - drag.current.y;
    const index = ["peek", "half", "full"].indexOf(drag.current.start);
    if (Math.abs(delta) > 35) { dragged.current = true; setSnap((["peek", "half", "full"] as Snap[])[Math.max(0, Math.min(2, index + (delta < 0 ? 1 : -1)))]); }
    drag.current = null;
  };
  return <div className="cx-root bg-background text-foreground" role="dialog" aria-modal="true" aria-label="Mua sắm tại Vincom" data-sheet={snap} data-category={category} onKeyDown={e => { if(e.key==="Tab"){const controls=Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled)'));if(e.shiftKey&&document.activeElement===controls[0]){e.preventDefault();controls.at(-1)?.focus();}else if(!e.shiftKey&&document.activeElement===controls.at(-1)){e.preventDefault();controls[0]?.focus();}}if (e.key === "Escape") { e.preventDefault(); if(selected)overview();else onClose(); } }}>
    <div className="cx-map sj-scene"><MiniCity mode="city" fullscreen entrance visiblePlaceIds={visibleIds} focus={selected} focusRevision={revision} activeStore={selected} onSelect={choose}/></div>
    <Header className="cx-header" title="Khám phá VinClub" leading={<Button variant="secondary" size="32" aria-label="Quay lại VinClub" onClick={onClose}><ChevronLeft size={20}/></Button>} trailing={<Button variant="secondary" size="32" aria-label="Đóng bản đồ" onClick={onClose}><X size={18}/></Button>}/>
    <section className="cx-search px-[22px]" aria-label="Tìm kiếm trên bản đồ"><div className="cx-search-field rounded-28"><Search size={18}/><Input aria-label="Tìm địa điểm hoặc nhu cầu" placeholder="Đi đâu, mua gì hôm nay?" value={query} onFocus={() => setSnap("full")} onChange={e => { setQuery(e.target.value); setSnap("full"); }}/>{query && <Button variant="secondary" size="32" aria-label="Xóa tìm kiếm" onClick={() => setQuery("")}><X size={15}/></Button>}</div></section>
    <nav className="cx-breadcrumb sj-breadcrumb" aria-label="Vị trí trong hành trình"><Button variant="secondary" size="32" onClick={overview}>Thành phố</Button>{place && <><ChevronRight size={12}/><span>{place.name}</span></>}</nav>
    <div className="cx-tools"><Button variant="secondary" size="32" aria-label="Về góc nhìn tổng quan" onClick={overview}><Navigation size={17}/></Button><Button variant="secondary" size="32" aria-label="Xoay lại điểm đến" onClick={() => { setRevision(r => r + 1); setSnap("peek"); }}><RotateCcw size={17}/></Button><Button variant="secondary" size="32" aria-label="Xem các điểm đã lưu" onClick={() => { setSelected(undefined); setSnap("full"); setPlan(false); setQuery(""); }}><Heart size={17}/>{saved.length > 0 && <span className="cx-save-count">{saved.length}</span>}</Button></div>
    {bagCount > 0 && <Button variant="secondary" size="32" className="cx-bag" aria-label="Xem túi mua sắm" onClick={onBag}><ShoppingBag size={15}/>{bagCount}</Button>}
    <div className="cx-sheet rounded-28" aria-label="Thông tin bản đồ">
      <Button variant="secondary" size="32" className="cx-grabber" aria-label={snap === "full" ? "Thu gọn sheet" : "Mở rộng sheet"} onClick={() => { if(dragged.current){dragged.current=false;return;}setSnap(snap === "peek" ? "half" : snap === "half" ? "full" : "peek"); }} onPointerDown={e => { drag.current = { y: e.clientY, start: snap }; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerUp={endDrag} onPointerCancel={() => { drag.current = null; }}><span className="cx-handle"/></Button>
      <div className="cx-sheet-scroll">
        {categoryControls}
        {query ? <section className="px-[22px]"><h1 className="pt-[24px] pb-[12px] cx-title">Tìm thấy cho bạn</h1><p className="text-xs text-foreground-secondary">{results.length} địa điểm · bản đồ trải nghiệm</p><div className="cx-result-list">{results.map(p => <Button variant="secondary" key={p.id} className="cx-result rounded-14" onClick={() => choose(p.id)}><ServiceIcon name={p.icon} size={40}/><span><strong>{p.name}</strong><small>{p.category}</small></span><ChevronRight size={16}/></Button>)}{!results.length && <p className="text-sm text-foreground-secondary">Thử “Vincom”, “đi chợ” hoặc “gia đình”.</p>}</div></section> : place ? <>
          <section className="px-[22px]"><div className="cx-place-title"><div><p className="cx-eyebrow pt-[24px] pb-[12px]">{place.category}</p><h1 className="cx-title">{place.name}</h1></div><Button variant="secondary" size="32" aria-label={saved.includes(place.id) ? "Bỏ lưu điểm đến" : "Lưu điểm đến"} aria-pressed={saved.includes(place.id)} onClick={toggleSave}><Heart size={18} fill={saved.includes(place.id) ? "currentColor" : "none"}/></Button></div><p className="cx-location text-xs text-foreground-secondary"><MapLocation/>{place.location}</p><div className="cx-place-actions"><Button variant="secondary" size="32" onClick={() => vincom ? onRide(place.id) : setRecorded(true)}><Car size={16}/>Đi đến đây</Button><Button variant="secondary" size="32" onClick={() => { setRevision(r => r + 1); setSnap("peek"); }}><RotateCcw size={16}/>Xem 3D</Button><Button variant="secondary" size="32" onClick={() => setSnap(snap === "full" ? "half" : "full")}><Layers size={16}/>Chi tiết</Button></div></section>
          <div className="cx-expanded"><section className="px-[22px]"><p className="text-sm text-foreground-secondary mt-[16px]">{place.description}</p><p className="text-xs text-foreground-secondary mt-[12px]">{place.hours}</p>{vincom ? <><h2 className="pt-[24px] pb-[12px] text-sm font-semibold">Mua theo cách của bạn</h2><div className="cx-shopping-modes"><Button variant="secondary" className="rounded-14" onClick={() => onMall(place.id)}><ShoppingBag size={20}/><span><strong>Mua online</strong><small>Xem món · chọn trả sau · GSM giao</small></span><ChevronRight size={16}/></Button><Button variant="secondary" className="rounded-14" onClick={() => onRide(place.id)}><Car size={20}/><span><strong>Đến khám phá</strong><small>Chọn Green SM đến Vincom</small></span><ChevronRight size={16}/></Button></div><h2 className="pt-[24px] pb-[12px] text-sm font-semibold">Store bên trong</h2><div className="cx-store-rail">{shoppingStores.map(store => <Button variant="secondary" key={store.id} className="cx-store rounded-14" onClick={() => onStore(store.id)}><ServiceIcon name={store.icon} size={48}/><strong>{store.name}</strong><small>{store.category}</small></Button>)}</div></> : <><h2 className="pt-[24px] pb-[12px] text-sm font-semibold">Bạn đang cần gì?</h2><div className="cx-choices">{place.choices.map(item => <Button variant="secondary" size="32" key={item} aria-pressed={choice === item} onClick={() => { setChoice(item); setRecorded(false); }}>{item}</Button>)}</div></>}{recorded && <p role="status" className="cx-confirm text-sm"><Check size={16}/>Đã lưu lựa chọn trong demo.</p>}</section></div>
        </> : <>
          <section className="px-[22px]"><p className="cx-eyebrow pt-[24px] pb-[12px]">OCEAN PARK · {filtered.length} ĐIỂM ĐẾN</p><h1 className="cx-title">{category==="all"?"Khám phá quanh bạn":categories.find(p=>p.id===category)?.name}</h1><div className="sj-landmark-rail cx-landmarks">{filtered.map(p => <Button key={p.id} variant="secondary" size="32" onClick={() => choose(p.id)}><ServiceIcon name={p.icon} size={25}/>{p.id === "vincom" ? "Vincom" : p.id === "events" ? "Sự kiện" : p.name}</Button>)}</div></section>
          <div className="cx-expanded"><section className="px-[22px]">{category==="all"&&<><h2 className="pt-[24px] pb-[12px] text-sm font-semibold">Một buổi chiều dành riêng cho bạn</h2><Card className="cx-plan rounded-28 border-0 shadow-none bg-secondary"><Sparkles size={20}/><div><strong>Shopping & chill</strong><p className="text-xs text-foreground-secondary mt-[8px]">Vincom → ghé WinMart → sự kiện ven sông</p></div><Button variant="secondary" size="32" onClick={() => setPlan(v => !v)}>{plan ? "Thu gọn" : "Xem lịch trình"}</Button></Card></>}{plan && <div className="cx-itinerary">{["vincom", "winmart", "events"].map((id, i) => <Button variant="secondary" key={id} className="cx-result rounded-14" onClick={() => choose(id)}><span className="cx-stop">{i + 1}</span><span><strong>{destinations.find(p => p.id === id)?.name}</strong><small>{["Khám phá store bạn thích", "Chuẩn bị bữa tối", "Một trải nghiệm cuối ngày"][i]}</small></span><ChevronRight size={16}/></Button>)}</div>}<h2 className="pt-[24px] pb-[12px] text-sm font-semibold">{category!=="all"?`${filtered.length} địa điểm phù hợp`:saved.length ? "Điểm đến đã lưu" : "Khám phá quanh bạn"}</h2><div className="cx-result-list">{filtered.filter(p => category!=="all" || !saved.length || saved.includes(p.id)).map(p => <Button key={p.id} variant="secondary" className="cx-result rounded-14" onClick={() => choose(p.id)}><ServiceIcon name={p.icon} size={40}/><span><strong>{p.name}</strong><small>{p.category}</small></span><ChevronRight size={16}/></Button>)}</div><p className="text-xs text-foreground-secondary pt-[24px] pb-[24px]">Địa điểm, dịch vụ và lịch trình minh họa.</p></section></div>
        </>}
      </div>
    <FixedBottom className="cx-bottom border-0 shadow-none pb-[10px]"><Button variant="primary" className="w-full" onClick={() => place ? vincom ? onMall(place.id) : setRecorded(true) : choose(filtered[0]?.id||"vincom")}>{place ? vincom ? "Xem store · mua online" : recorded ? "Đã ghi nhận trong demo" : place.action : `Khám phá ${filtered[0]?.id==="vincom"?"Vincom":filtered[0]?.name||"Vincom"}`}</Button><div className="w-[139px] h-[5px] bg-foreground rounded-full mx-auto mt-[12px]"/></FixedBottom>
    </div>
  </div>;
}

function MapLocation() { return <Navigation size={12}/>; }
