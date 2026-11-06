"use client";

import Image from "next/image";
import { PaymentIcon } from "@/components/vinclub/daily-icons";
import { illustrationAssets } from "./illustration-assets";
import { useRef, useState, type PointerEvent } from "react";
import { CalendarDays, Check, ChevronLeft, ChevronRight, MapPin, Search, ChevronUp, ChevronDown, Navigation, RotateCcw, ShoppingBag, X } from "lucide-react";
import { AiAvatar } from "@/components/vinclub/ai-avatar";
import { MiniCity } from "@/components/vinclub/mini-city";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBar } from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { FixedBottom } from "@/components/ui/fixed-bottom";
import { ServiceIcon } from "@/components/vinclub/visuals";
import { explorationLandmarks, shoppingStores } from "@/components/vinclub/shopping-data";
import "./experiences-map.css";
import { ExperienceBooking, type Trip } from "./experience-booking";
export type { Trip } from "./experience-booking";


const experiences = [
  { id: "resort", type: "Du lịch", title: "Một cuối tuần bên biển", location: "Vinpearl · 1 đêm", image: illustrationAssets.escape, price: 2400000, unit: "/ phòng · 2 khách", focus: undefined },
  { id: "events", type: "Sự kiện", title: "Ngày hội tại Ocean Park", location: "Ocean Park · Vé trải nghiệm", image: illustrationAssets.weekend, price: 180000, unit: "/ khách", focus: "events" },
  { id: "city", type: "Khám phá", title: "Một ngày ở Vincom", location: "Vincom Ocean Park · Gói trải nghiệm", image: illustrationAssets.shopping, price: 250000, unit: "/ khách", focus: "vincom" },
];
const money = (value: number) => `${value.toLocaleString("vi-VN")}đ`;


function PayLaterExperience({ onShopping }: { onShopping: () => void }) {
  return <Card className="dx-paylater-card rounded-28 border-0 shadow-none p-0 gap-0">
    <div className="dx-paylater-copy">
      <h3 className="text-lg font-semibold">Mua trước, trả sau</h3>
      <p className="text-xs text-foreground-secondary mt-[8px]">Chia nhỏ thanh toán với Ví trả sau.</p>
      <Button variant="secondary" size="32" className="dx-paylater-shop mt-[12px]" onClick={onShopping}>Khám phá<ChevronRight size={14}/></Button>
    </div>
    <div className="dx-paylater-art" aria-hidden="true"><PaymentIcon name="credit" size={104}/></div>
  </Card>;
}

export function Experiences({ trips, onBooked, onShopping, onStore, onAskAi, completeGrid = false }: { completeGrid?: boolean; onAskAi: () => void; trips: Trip[]; onBooked: (trip: Trip) => void; onShopping: (id?: string, entry?:"mall"|"catalog") => void; onStore: (id: string) => void }) {
  const [filter,setFilter] = useState("Tất cả");
  const [selected,setSelected] = useState(experiences[0]);
  const [booking,setBooking] = useState(false);
  const [snap,setSnap] = useState<"peek"|"half"|"full">("half");
  const [focus,setFocus] = useState<string>();
  const [query,setQuery] = useState("");
  const [revision,setRevision] = useState(0);
  const [detail,setDetail] = useState(false);
  const [landmark,setLandmark] = useState<string>();
  const scroll=useRef<HTMLDivElement>(null);
  const root=useRef<HTMLDivElement>(null);
  const [dragTop,setDragTop]=useState<number|null>(null);
  const drag=useRef<{y:number;top:number;height:number}|null>(null);
  const dragged=useRef(false);
  const [ticketReceipt,setTicketReceipt]=useState<Trip>();
  const categories=[{name:"Tất cả",icon:"home"},{name:"Mua sắm",icon:"shopping"},{name:"Đi chợ",icon:"food"},{name:"Chăm sóc",icon:"medical"},{name:"Du lịch",icon:"hotel"},{name:"Sự kiện",icon:"travel"}];
  const serviceFilter=filter==="Đi chợ"?"winmart":filter==="Chăm sóc"?"vinmec":undefined;
  const visibleExperiences=[...experiences,...(completeGrid?[{id:"winmart",type:"Mua sắm",title:"Đi chợ ở WinMart",location:"Ocean Park · Thực phẩm & đồ dùng",image:illustrationAssets.winmart,price:0,unit:"",focus:"winmart"}]:[])].sort((a,b)=>Number(b.id==="city")-Number(a.id==="city")).filter(item=>(filter==="Tất cả"||item.type===filter||(filter==="Mua sắm"&&item.id==="city"))&&`${item.title} ${item.location} ${item.type}`.toLocaleLowerCase("vi").includes(query.toLocaleLowerCase("vi")));
  const places=explorationLandmarks.filter(p=>(filter==="Tất cả"?p.id==="winmart"||p.id==="vinmec":p.id===serviceFilter)&&`${p.name} ${p.category}`.toLocaleLowerCase("vi").includes(query.toLocaleLowerCase("vi")));
  const visibleIds=[...visibleExperiences.flatMap(item=>item.id==="city"?["vincom","vincom-center","vincom-plaza"]:item.focus?[item.focus]:[]),...places.map(p=>p.id)];
  const place=explorationLandmarks.find(p=>p.id===landmark);
  const resetScroll=()=>{if(scroll.current)scroll.current.scrollTop=0;};
  const choose = (id: string) => { if(id==="winmart"){onStore("winmart");return;} setQuery("");setDetail(true);setSnap("half");setRevision(v=>v+1);resetScroll();if(id==="winmart"||id==="vinmec"){setLandmark(id);setFocus(id);return;}setLandmark(undefined);const item=experiences.find(item=>item.id===id)??experiences[2];setSelected(item);setFocus(id.startsWith("vincom")?id:item.focus); };
  const overview=()=>{setFilter("Tất cả");setFocus(undefined);setLandmark(undefined);setDetail(false);setQuery("");setSnap("half");setRevision(v=>v+1);resetScroll();};
  const changeCategory=(name:string)=>{setFilter(name);setFocus(undefined);setLandmark(undefined);setDetail(false);setQuery("");setSnap("half");setRevision(v=>v+1);resetScroll();};
  const snapPositions=(height:number)=>({peek:height*.70,half:height*.50,full:Math.min(124,height*.22)});
  const beginDrag=(event:PointerEvent<HTMLButtonElement>)=>{
    const height=root.current?.clientHeight??0;
    if(!height)return;
    dragged.current=false;
    const top=snapPositions(height)[snap];
    drag.current={y:event.clientY,top,height};
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag=(event:PointerEvent<HTMLButtonElement>)=>{
    if(!drag.current)return;
    const {y,top,height}=drag.current;
    const delta=event.clientY-y;
    if(Math.abs(delta)>6)dragged.current=true;
    const points=snapPositions(height);
    setDragTop(Math.max(points.full,Math.min(points.peek,top+delta)));
  };
  const endDrag=(event:PointerEvent<HTMLButtonElement>)=>{
    if(!drag.current)return;
    const {y,top,height}=drag.current;
    const delta=event.clientY-y;
    if(Math.abs(delta)>6){
      dragged.current=true;
      const points=snapPositions(height);
      const next=(Object.keys(points) as Array<"peek"|"half"|"full">).reduce((best,key)=>Math.abs(points[key]-(top+delta))<Math.abs(points[best]-(top+delta))?key:best,snap);
      setSnap(next);
    }
    drag.current=null;setDragTop(null);
  };
  const startBooking = () => { setTicketReceipt(undefined);setBooking(true); };
  return <div ref={root} className="ds-experiences dx-root" data-sheet={snap} data-category={filter}>
    <div className="dx-map"><MiniCity mode="city" fullscreen entrance focus={focus} focusRevision={revision} activeStore={focus} visiblePlaceIds={visibleIds} onSelect={choose}/></div>
    <div className="dx-status"><StatusBar/></div>
    <section className="dx-search px-[22px]" aria-label="Tìm kiếm trải nghiệm"><div className="dx-search-field rounded-28"><Search size={18}/><Input value={query} aria-label="Tìm trải nghiệm quanh bạn" placeholder="Đi đâu, làm gì hôm nay?" onFocus={()=>setSnap("full")} onChange={e=>{setQuery(e.target.value);setDetail(false);setLandmark(undefined);setFocus(undefined);setSnap("full");}}/>{query&&<Button variant="secondary" size="32" aria-label="Xóa tìm kiếm trải nghiệm" onClick={()=>setQuery("")}><X size={16}/></Button>}</div></section>
    <div className="dx-tools"><Button variant="secondary" size="32" aria-label="Về toàn cảnh trải nghiệm" onClick={overview}><Navigation size={18}/></Button><Button variant="secondary" size="32" aria-label="Xoay khám phá điểm đến" onClick={()=>{setRevision(v=>v+1);setSnap("peek");}}><RotateCcw size={18}/></Button>{trips.length>0&&<Button variant="secondary" size="32" aria-label="Xem chuyến đi đã lên lịch" onClick={()=>{setSnap("full");requestAnimationFrame(()=>scroll.current?.querySelector("#dx-trips")?.scrollIntoView({behavior:"smooth",block:"start"}));}}><CalendarDays size={18}/></Button>}</div>
    <div className="dx-sheet rounded-28" data-dragging={dragTop!==null} style={dragTop!==null?{top:dragTop}:undefined} aria-label="Khám phá trải nghiệm">
      <Button variant="secondary" size="32" className="dx-grabber" aria-label={snap==="full"?"Thu gọn trải nghiệm":"Mở rộng trải nghiệm"} onPointerDown={beginDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={()=>{drag.current=null;setDragTop(null);}} onClick={()=>{if(dragged.current){dragged.current=false;return;}setSnap(snap==="peek"?"half":snap==="half"?"full":"peek");}}><span/></Button>
      <div className="dx-sheet-scroll" ref={scroll}>
        <section className="px-[22px]">{snap==="full"&&<Button variant="secondary" size="32" aria-label="Quay lại khám phá bản đồ" onClick={overview}><ChevronLeft size={14}/>Bản đồ</Button>}<div className="dx-sheet-heading pt-[24px] pb-[12px]"><div><p className="dx-location text-foreground-secondary"><MapPin size={12}/>Ocean Park, Hà Nội</p><h1 className={`text-xl font-semibold mt-[8px] ${!place&&!detail?"dx-overview-title":""}`}>{place?place.name:detail?selected.title:"Đi đâu, làm gì hôm nay?"}</h1></div><div className="dx-heading-actions"><Button variant="secondary" size="32" className="dx-expand" aria-label={snap==="full"?"Thu gọn danh sách trải nghiệm":"Mở rộng danh sách trải nghiệm"} aria-expanded={snap==="full"} onClick={()=>setSnap(snap==="full"?"half":"full")}>{snap==="full"?<ChevronDown size={18}/>:<ChevronUp size={18}/>}</Button>{!detail&&<Button variant="secondary" size="48" className="dx-ask-ai" onClick={onAskAi}><AiAvatar size={32}/><span>Hỏi AI</span></Button>}</div></div></section>
        <nav className="dx-categories px-[22px]" aria-label="Loại trải nghiệm">{categories.map(item=><Button variant="secondary" size="32" key={item.name} aria-pressed={filter===item.name} onClick={()=>changeCategory(item.name)}><ServiceIcon name={item.icon} size={24}/>{item.name}</Button>)}</nav>
        {detail ? <section className="px-[22px] dx-detail">
          <p className="text-xs text-foreground-secondary mt-[12px] flex items-center gap-[8px]"><MapPin size={13}/>{place?place.location:selected.location}</p>
          {place ? <><p className="text-sm text-foreground-secondary mt-[16px]">{place.description}</p><p className="text-xs text-foreground-secondary mt-[12px]">{place.hours}</p><div className="dx-choices">{place.choices.map(choice=><Button key={choice} variant="secondary" size="32" onClick={()=>onShopping(place.id)}>{choice}<ChevronRight size={14}/></Button>)}</div></> : selected.id==="city" ? <>
            <p className="text-sm text-foreground-secondary mt-[16px]">Mua online tại các store hoặc xem showroom và nội thất 3D trước khi chọn sản phẩm.</p>
            <div className="dx-mall-preview rounded-28 mt-[16px]"><Image src="/vinclub-assets/city/mall-poster.webp" alt="Showroom bên trong Vincom" fill sizes="390px"/><Button variant="secondary" size="32" onClick={()=>onShopping(focus||"vincom","mall")}>Xem showroom 3D</Button></div>
            <div className="pt-[24px]"><PayLaterExperience onShopping={()=>onShopping(focus||"vincom","catalog")}/></div>
            <h2 className="pt-[24px] pb-[12px] text-sm font-semibold">Xem nội thất store · 3D tùy chọn</h2>
            <div className="dx-stores">{shoppingStores.map(store=><Button key={store.id} variant="secondary" className="dx-store rounded-14" aria-label={`Vào store 3D ${store.name}`} onClick={()=>onStore(store.id)}><ServiceIcon name={store.icon} size={40}/><span className="text-left flex-1"><strong className="block text-sm">{store.name}</strong><small className="block text-xs text-foreground-secondary">{store.category} · {store.floor}</small></span><ChevronRight size={16}/></Button>)}</div>
            <Button variant="secondary" className="w-full mt-[16px]" onClick={()=>onShopping(focus||"vincom","catalog")}><ShoppingBag size={18}/>Mua online · Green SM giao<ChevronRight size={16}/></Button>
          </> : <><p className="text-2xl font-medium mt-[16px]">{money(selected.price)} <span className="text-xs text-foreground-secondary">{selected.unit}</span></p>{selected.id==="resort"&&<p className="text-xs text-foreground-secondary mt-[12px]">Vinpearl · Điểm đến ngoài khu vực bản đồ này.</p>}<p className="text-sm text-foreground-secondary mt-[12px]">{selected.id==="events"?"Chọn ngày, khung giờ và loại vé. Vé sẽ được lưu tại đây sau thanh toán demo.":"Chọn ngày, số khách và lên lịch chuyến đi của bạn."}</p></>}

          <Button variant="secondary" size="32" className="mt-[16px]" onClick={overview}>Xem các điểm xung quanh</Button>
        </section> : <div className="dx-discovery">
          {!!visibleExperiences.length&&<section className="px-[22px]" aria-labelledby="dx-today-title"><div className="dx-discovery-heading pt-[24px] pb-[12px]"><h2 id="dx-today-title" className="text-base font-semibold">{query ? "Trải nghiệm phù hợp" : filter === "Tất cả" ? "Gợi ý cho hôm nay" : filter}</h2><span className="text-xs text-foreground-secondary">{visibleExperiences.length} trải nghiệm</span></div><div className="dx-journey-rail" aria-label="Gợi ý trải nghiệm">{visibleExperiences.map(item=><Card key={item.id} className="dx-journey-card rounded-28 border-0 shadow-none bg-secondary p-0 gap-0"><div className="dx-journey-art"><Image src={item.image} alt={item.title} fill sizes="240px"/><span className="dx-journey-tag rounded-8">{item.id==="city"?"Mua sắm":item.type}</span></div><div className="dx-journey-copy"><h3 className="text-base font-semibold">{item.title}</h3><p className="text-xs text-foreground-secondary mt-[4px]">{item.location}</p><Button variant="secondary" size="32" className="dx-journey-link mt-[12px]" aria-label={item.id==="city"?"Khám phá Vincom":`Khám phá ${item.title}`} onClick={()=>choose(item.id)}>Khám phá<ChevronRight size={14}/></Button></div></Card>)}</div>{filter==="Du lịch"&&<p className="text-xs text-foreground-secondary mt-[12px]">Điểm đến ngoài khu vực bản đồ.</p>}</section>}
          {!query&&(filter==="Tất cả"||filter==="Mua sắm")&&<section className="px-[22px]" aria-label="Mua sắm với Ví trả sau"><div className="pt-[24px]"><PayLaterExperience onShopping={()=>onShopping("vincom","catalog")}/></div></section>}
          {!!places.length&&<section className="px-[22px]" aria-labelledby="dx-nearby-title"><div className="dx-discovery-heading pt-[24px] pb-[12px]"><h2 id="dx-nearby-title" className="text-base font-semibold">Tiện ích gần bạn</h2><span className="text-xs text-foreground-secondary">Ocean Park</span></div><div className="dx-nearby-grid">{places.map(item=><Card key={item.id} className="dx-nearby-card rounded-28 border-0 bg-secondary shadow-none p-[12px] gap-[8px]"><ServiceIcon name={item.icon} size={48}/><h3 className="text-sm font-semibold">{item.name}</h3><p className="text-xs text-foreground-secondary">{item.category}</p><Button variant="secondary" size="32" className="dx-journey-link" aria-label={`Khám phá ${item.name}`} onClick={()=>choose(item.id)}>Khám phá<ChevronRight size={14}/></Button></Card>)}</div></section>}
          {!visibleExperiences.length&&!places.length&&<section className="px-[22px] pt-[24px]"><Card className="rounded-28 border-0 bg-secondary shadow-none px-[22px] py-[24px] gap-[8px]"><h2 className="text-base font-semibold">Chưa tìm thấy trải nghiệm</h2><p className="text-sm text-foreground-secondary">Thử tìm “Vincom”, “Vinmec” hoặc “Ocean Park”.</p><Button variant="secondary" size="32" className="self-start mt-[8px]" onClick={()=>{setQuery("");changeCategory("Tất cả");}}>Xem tất cả trải nghiệm</Button></Card></section>}
        </div>}

        {trips.length>0&&<section className="px-[22px] pt-[24px]" id="dx-trips"><div className="flex flex-col gap-[12px]">{trips.map(trip=><Card key={trip.id} className="rounded-28 border-0 shadow-none bg-secondary p-[22px] gap-[8px]"><p className="text-sm font-semibold">{trip.title}</p><p className="text-xs text-foreground-secondary">{trip.date}{trip.time?` · ${trip.time}`:""} · {trip.guests} {trip.kind==="ticket"?"vé":"khách"} · {money(trip.total)}</p><p className="text-xs flex items-center gap-[8px]"><Check size={14}/>Đã thanh toán demo</p>{trip.code&&<p className="text-xs font-mono">{trip.code}</p>}<Button variant="secondary" size="32" onClick={()=>{setSelected(experiences.find(item=>item.id===(trip.kind==="ticket"?"events":"resort"))!);setTicketReceipt(trip);setBooking(true);}}>{trip.kind==="ticket"?"Xem vé":"Xem chuyến đi"}<ChevronRight size={14}/></Button></Card>)}</div></section>}
      </div>
      {detail&&<FixedBottom className="dx-action border-0 shadow-none"><Button variant={booking?"secondary":"primary"} className="w-full" onClick={()=>place?onShopping(place.id):selected.id==="city"?onShopping(focus||"vincom","catalog"):startBooking()}>{place?`Khám phá ${place.name}`:selected.id==="city"?"Mua online":selected.id==="events"?"Đặt vé sự kiện":"Lên lịch chuyến đi"}</Button></FixedBottom>}
    </div>
    {booking&&<ExperienceBooking experience={selected} initialTrip={ticketReceipt} onClose={()=>setBooking(false)} onBooked={onBooked}/>}

  </div>;
}
