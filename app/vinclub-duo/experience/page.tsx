"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Experiences, type Trip } from "@/app/vinclub-dualsurface/experiences";
import { ExperienceBooking } from "@/app/vinclub-dualsurface/experience-booking";
import { illustrationAssets } from "@/app/vinclub-dualsurface/illustration-assets";
import { OffersBrowser } from "@/app/vinclub-dualsurface/offers-browser";
import { AssetActionSheet, type Voucher } from "@/app/vinclub-dualsurface/my-space";
import { ShoppingJourney } from "@/components/vinclub/shopping-journey";
import { AiChat } from "@/app/vinclub-dualsurface/ai-chat";
import "@/app/vinclub-dualsurface/dualsurface.css";
import "@/components/vinclub/glass.css";
import "./experience.css";

const items=[{id:"city",category:"Mua sắm",title:"Một ngày ở Vincom",detail:"Ocean Park · Mua sắm & ẩm thực",price:250000,unit:"/ khách",image:illustrationAssets.shopping},{id:"events",category:"Sự kiện",title:"Cuối tuần ở Ocean Park",detail:"Vé sự kiện · Đi cùng gia đình",price:180000,unit:"/ khách",image:illustrationAssets.weekend},{id:"resort",category:"Du lịch",title:"Một cuối tuần bên biển",detail:"Vinpearl · 1 đêm · 2 khách",price:2400000,unit:"/ phòng",image:illustrationAssets.escape},{id:"winmart",category:"Mua sắm",title:"Đi chợ ở WinMart",detail:"Ocean Park · Thực phẩm & đồ dùng",price:0,unit:"",image:illustrationAssets.winmart}];
export default function DuoExperience(){
 const [view,setView]=useState("experiences");const [category,setCategory]=useState("Tất cả");const [map,setMap]=useState(true);
 const [trips,setTrips]=useState<Trip[]>([]);const [booking,setBooking]=useState<typeof items[number]|null>(null);
 const [shopping,setShopping]=useState<{store?:string;landmark?:string;entry?:"mall"|"catalog"}|null>(null);const [ai,setAi]=useState(false);const [voucher,setVoucher]=useState<Voucher|null>(null);const [saved,setSaved]=useState<string[]>([]);
 useEffect(()=>{const receive=(event:MessageEvent)=>{if(event.origin!==location.origin||event.data?.type!=="duo-right")return;if(event.data.view==="ai"){setAi(true);return;}setView(event.data.view??"experiences");setMap(event.data.view!=="offers");setCategory(["Mua sắm","Du lịch"].includes(event.data.category)?event.data.category:"Tất cả");if(event.data.category==="Vinmec"||event.data.category==="Đồ ăn")setMap(true);};window.addEventListener("message",receive);return()=>window.removeEventListener("message",receive);},[]);
 return <main className="duo-experience bg-background text-foreground">

  {map?<div className="duo-map-view"><Experiences completeGrid trips={trips} onBooked={trip=>setTrips(previous=>[trip,...previous])} onShopping={(landmark,entry)=>setShopping({landmark,entry})} onStore={store=>setShopping({store})} onAskAi={()=>setAi(true)}/></div>:<div className="duo-discover-scroll">{view==="offers"?<OffersBrowser savedVouchers={saved} onVoucher={setVoucher}/>:<>
    <nav className="duo-discover-filters px-[22px]" aria-label="Loại trải nghiệm">{["Tất cả","Mua sắm","Du lịch","Sự kiện"].map(name=><Button variant="secondary" size="32" key={name} aria-pressed={category===name} onClick={()=>setCategory(name)}>{name}</Button>)}</nav>
    <section className="px-[22px]"><div className="duo-discover-section-title pt-[24px] pb-[12px]"><h2>Gợi ý cho hôm nay</h2><span>Ocean Park</span></div><div className="duo-discover-items">{items.filter(item=>category==="Tất cả"||item.category===category).map(item=><Card className="duo-discover-card rounded-14 border-0 shadow-none p-0 gap-0" key={item.id}><Button variant="secondary" className="duo-discover-open rounded-14" aria-label={`Khám phá ${item.title}`} onClick={()=>item.id==="winmart"?setShopping({store:"winmart"}):item.id==="city"?setShopping({landmark:"vincom",entry:"catalog"}):setBooking(item)}><Image src={item.image} alt="" width={88} height={108}/><span className="duo-discover-copy"><small>{item.category}</small><strong>{item.title}</strong><span>{item.detail}</span><b>{item.id==="winmart"?"Xem sản phẩm":`${item.price.toLocaleString("vi-VN")}đ`} <small>{item.unit}</small></b></span><ChevronRight size={14}/></Button></Card>)}</div></section>
    {trips.length>0&&<section className="px-[22px]"><h2 className="pt-[24px] pb-[12px] text-sm font-semibold">Đã lên lịch</h2>{trips.map(trip=><p key={trip.id} className="text-xs mb-3">{trip.title} · {trip.date}</p>)}</section>}
  </>}</div>}
  {booking&&<ExperienceBooking experience={booking} onClose={()=>setBooking(null)} onBooked={trip=>setTrips(previous=>[trip,...previous])}/>}
  {shopping&&<ShoppingJourney initialStore={shopping.store} initialLandmark={shopping.landmark} initialStep={shopping.entry?"mall":undefined} catalogMode={shopping.entry==="catalog"} onClose={()=>setShopping(null)}/>}
  {ai&&<AiChat initialPrompt="Gợi ý trải nghiệm quanh tôi" onClose={()=>setAi(false)} onNavigate={()=>setAi(false)}/>}
  {voucher&&<AssetActionSheet voucher={voucher} bill={null} saved={saved.includes(voucher.id)} paid={false} onClose={()=>setVoucher(null)} onSave={()=>setSaved(previous=>previous.includes(voucher.id)?previous.filter(id=>id!==voucher.id):[...previous,voucher.id])} onPay={()=>{}}/>}
 </main>;
}
