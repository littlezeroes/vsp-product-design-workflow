"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Check, ArrowUpRight, Home, Compass, User, Wallet, CalendarDays, MapPin, Users, Ticket, Clock, Moon, Sun, MessageCircle, Heart, ShieldCheck, SlidersHorizontal, Receipt, LayoutGrid, ListChecks, Gem, Route } from "lucide-react";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FixedBottom } from "@/components/ui/fixed-bottom";
import type { Concept, ConceptCard } from "./concepts";
import type { VariantProps } from "./variant-types";
import { VariantsA } from "./variants-a";
import { VariantsB } from "./variants-b";
import { VariantsC } from "./variants-c";
import "./redesign.css";
const identity:Record<string,{label:string;kicker:string;icons:typeof Home[]}>={
 today:{label:"DAY / VinClub",kicker:"THE DAILY EDIT",icons:[Clock,LayoutGrid,ListChecks,User]},
 savings:{label:"VinClub / Value",kicker:"SPEND SMARTER",icons:[Wallet,SlidersHorizontal,Receipt,User]},
 household:{label:"Nhà mình",kicker:"TOGETHER, EVERY DAY",icons:[Users,LayoutGrid,CalendarDays,Home]},
 journey:{label:"VinClub Voyages",kicker:"GO SOMEWHERE GOOD",icons:[Route,Compass,Ticket,User]},
 neighborhood:{label:"VinClub Local",kicker:"YOUR PLACE, CONNECTED",icons:[MapPin,Compass,Clock,Home]},
 autopilot:{label:"VinClub Control",kicker:"LESS TO REMEMBER",icons:[SlidersHorizontal,LayoutGrid,ListChecks,ShieldCheck]},
 concierge:{label:"VinClub / Ask",kicker:"START WITH A CONVERSATION",icons:[MessageCircle,Compass,Receipt,User]},
 membership:{label:"VinClub Privé",kicker:"BELONG TO SOMETHING MORE",icons:[Gem,Ticket,Wallet,User]},
 wellbeing:{label:"VinClub Care",kicker:"MAKE ROOM FOR YOURSELF",icons:[Heart,Compass,CalendarDays,Users]},
 transparent:{label:"VinClub Clear",kicker:"EVERY DETAIL, ACCOUNTED FOR",icons:[Receipt,LayoutGrid,Clock,ShieldCheck]},
};
const receiptLabels:Record<string,string>={payment:"Nguồn thanh toán",basket:"Giỏ hàng (đ)",shopping:"Nhu cầu",flowChoice:"Lựa chọn",approver:"Người duyệt",share:"Chia sẻ",departure:"Ngày đi",guests:"Số khách",area:"Khu vực",radius:"Bán kính (km)",place:"Địa điểm",arrival:"Giờ dự kiến",benefit:"Quyền lợi",benefitDate:"Ngày sử dụng",days:"Nhắc trước (ngày)",limit:"Ngưỡng cảnh báo (đ)",enabled:"Quy tắc",message:"Yêu cầu",budget:"Ngân sách (đ)",date:"Ngày dự kiến",time:"Giờ",specialty:"Chuyên khoa",pickup:"Điểm đón",person:"Người được chăm sóc",provider:"Cơ sở",day:"Ngày",source:"Nguồn tiền",consent:"Đã kiểm tra"};
const receiptKeys:Record<string,string[]>={today:["payment"],savings:["basket","shopping","flowChoice"],household:["flowChoice","approver","share"],journey:["departure","guests"],neighborhood:["area","radius","place","arrival"],autopilot:["days","limit","enabled"],concierge:["message","date","time","specialty","pickup","budget"],membership:["benefit","benefitDate"],wellbeing:["person","provider","day","time"],transparent:["source","consent"]};
export function ConceptApp({concept:c}:{concept:Concept}) {
 const [tab,setTab]=useState(0),[step,setStep]=useState(-1),[query,setQuery]=useState(""),[selection,setSelection]=useState(0),[saved,setSaved]=useState<string[]>([]),[done,setDone]=useState(false),[dark,setDark]=useState(false),[detail,setDetail]=useState<ConceptCard|null>(null),[values,setValues]=useState<Record<string,string>>({});
 const design=identity[c.slug];
 const start=()=>{setSelection(0);setStep(0);};
 const switchTab=(index:number)=>{setTab(index);setQuery("");setStep(-1);};
 const toggleSave=(title:string)=>setSaved(old=>old.includes(title)?old.filter(t=>t!==title):[...old,title]);
 const props:VariantProps={concept:c,tab,query,onQuery:setQuery,openDetail:card=>{setDetail(card);setStep(4);},saved,toggleSave,step,selection,onSelect:setSelection,values,setValue:(key,value)=>setValues(old=>({...old,[key]:value}))};
 const Variant=["today","savings","household"].includes(c.slug)?VariantsA:["journey","neighborhood","membership"].includes(c.slug)?VariantsB:VariantsC;
 const back=()=>setStep(step===0||step>=3?-1:step-1);
 return <main className={`redesign-shell design-${c.slug} bg-secondary text-foreground`}><div data-testid="app-preview" data-design={c.slug} className="redesign-phone">
 <Header className="variant-header" title={step>=0?step===4?"Chi tiết":step===3?"Hoàn tất":c.flow[step]:design.label} leading={step>=0?<Button variant="secondary" aria-label="Quay lại" className="p-[10px] min-h-[44px]" onClick={back}><ChevronLeft size={18}/></Button>:<Link href="/vinclub-redesign" aria-label="Các phương án" className="p-[10px] flex items-center min-h-[44px]"><ChevronLeft size={18}/></Link>} trailing={<Button variant="secondary" aria-label="Đổi giao diện" className="p-[10px] min-h-[44px]" onClick={()=>{document.documentElement.classList.toggle("dark");setDark(!dark);}}>{dark?<Sun size={18}/>:<Moon size={18}/>}</Button>}/>
 <div className="redesign-content" key={`${tab}-${step}`}>
 {step<0||step<3?<Variant {...props}/>:step===4&&detail?<>
 <section className="px-[22px] pt-[24px] pb-[12px] variant-detail"><p className="text-xs tracking-widest text-foreground-secondary">{design.kicker}</p><h1 className="text-2xl font-semibold mt-[12px]">{detail.title}</h1><p className="text-base text-foreground-secondary mt-[12px]">{detail.description}</p><p className="text-xl font-semibold mt-[24px]">{detail.meta}</p></section>
 <section className="px-[22px] pt-[24px] pb-[12px]"><h2 className="text-base font-semibold mb-[12px]">{c.slug==="transparent"?"Thông tin có thể truy vết":c.slug==="membership"?"Giữ quyền lợi trong tầm tay":"Bước tiếp theo của bạn"}</h2><Card className="redesign-card rounded-28"><p className="text-sm">{c.need}</p><Button variant="secondary" aria-pressed={saved.includes(detail.title)} onClick={()=>toggleSave(detail.title)}>{saved.includes(detail.title)?"Đã lưu":"Lưu mục này"}</Button><p className="text-xs text-foreground-secondary">Dữ liệu minh họa. Không phát sinh giao dịch thật.</p></Card></section>
 </>:<>
 <section data-testid="flow-confirmation" className="px-[22px] pt-[24px] pb-[12px] variant-result" aria-live="polite"><div className="result-stamp"><Check size={32}/></div><p className="text-xs tracking-widest text-foreground-secondary mt-[24px]">{design.kicker}</p><h1 className="text-2xl font-semibold mt-[12px]">{c.outcome}</h1><p className="text-base mt-[12px]">{c.success}</p></section>
 <section className="px-[22px] pt-[24px] pb-[12px]"><h2 className="font-semibold mb-[12px]">Thông tin bạn vừa chọn</h2><Card className="redesign-card rounded-28"><p className="text-sm font-semibold">{c.screens[0].cards[selection%c.screens[0].cards.length].title}</p>{Object.entries(values).filter(([key,value])=>receiptKeys[c.slug].includes(key)&&value).map(([key,value])=><p key={key} className="text-sm break-words"><span className="text-foreground-secondary">{receiptLabels[key]}: </span>{value==="yes"||value==="on"?"Đã bật":value==="no"||value==="off"?"Đã tắt":value}</p>)}<p className="text-xs text-foreground-secondary">VC-{String(c.id).padStart(2,"0")}-1024 · xác nhận mô phỏng</p><p className="text-xs text-foreground-secondary">Không thanh toán, đặt dịch vụ hoặc gửi dữ liệu thật.</p></Card></section>
 </>}
 {step<0&&tab===2&&done&&<section className="px-[22px] pt-[24px] pb-[12px]"><Card className="redesign-card rounded-28"><Check className="text-success"/><h2 className="font-semibold">Yêu cầu vừa hoàn tất</h2><p className="text-sm">{c.success}</p></Card></section>}
 </div>
 <FixedBottom className="redesign-bottom">
 {step===4?<Button variant="primary" className="w-full" onClick={start}>Thử: {c.primaryAction}</Button>:step<0?<Button data-testid="primary-action" variant="primary" className="w-full" onClick={start}>{c.primaryAction}<ArrowUpRight size={18}/></Button>:step<3?<Button data-testid="flow-next" variant="primary" disabled={c.slug==="transparent"&&step===2&&values.consent!=="yes"} className="w-full" onClick={()=>{setStep(step+1);if(step===2)setDone(true);}}>{step===2?"Xác nhận mô phỏng":step===0?c.slug==="concierge"?"Tạo bản nháp":"Xem phương án":"Kiểm tra lần cuối"}</Button>:<Button variant="primary" className="w-full" onClick={()=>{setStep(-1);setTab(2);setQuery("");}}>Xem trong {c.navigation[2]}</Button>}
 <nav aria-label="Điều hướng ứng dụng" className="redesign-nav grid grid-cols-4 gap-[4px] mt-[8px]">{c.navigation.map((label,index)=>{const NavIcon=design.icons[index];return <Button key={label} variant="secondary" className="flex-col gap-[4px] min-h-[56px]" aria-current={tab===index&&step<0?"page":undefined} onClick={()=>switchTab(index)}><NavIcon size={18}/><span>{label}</span></Button>;})}</nav><div className="w-[139px] h-[5px] bg-foreground rounded-full mx-auto mt-[12px]"/>
 </FixedBottom>
 </div></main>;
}
