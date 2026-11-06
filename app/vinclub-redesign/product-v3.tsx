"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, User, Bell, Moon, Sun, RotateCcw, Grid2X2 } from "lucide-react";
import { Header } from "@/components/ui/header";
import { FixedBottom } from "@/components/ui/fixed-bottom";
import { Button } from "@/components/ui/button";
import { initialStore, productDesigns } from "./product-data";
import { ProductHome, ServicesPage } from "./product-home";
import { useCommerceView } from "./commerce-v3";
import { useLifestyleView } from "./lifestyle-v3";
import type { DomainProps, ProductDesign, Screen, ScreenView, Store, StoreApi, RecordEntry } from "./product-types";
import "./product-v3.css";
const commerceKinds=new Set(["wallet","bills","bill","transfer","deposit","withdraw","qr","shopping","product","cart","checkout","receipt"]);
const roots=new Set(["home","services","offers","membership","wallet","bills","shopping","experiences","life","account","activity","assistant"]);
function PageFrame({p,view}:{p:DomainProps;view:ScreenView}){const root=roots.has(p.screen.kind);return <>
 <Header title={p.screen.kind==="home"?p.design.label:view.title} className="v3-header" leading={<Button variant="secondary" aria-label={p.screen.kind==="home"?"Tất cả dịch vụ":"Quay lại"} className="p-[10px] min-h-[44px]" onClick={()=>p.screen.kind==="home"?p.navigate({kind:"services"}):p.back()}>{p.screen.kind==="home"?<Grid2X2 size={18}/>:<ChevronLeft size={18}/>}</Button>} trailing={<div className="flex items-center gap-[8px]">{p.screen.kind==="home"&&<Button variant="secondary" aria-label="Thông báo" className="p-[10px] min-h-[44px]" onClick={()=>p.navigate({kind:"notifications"})}><Bell size={18}/></Button>}<Button variant="secondary" aria-label="Tài khoản của tôi" className="p-[10px] min-h-[44px]" onClick={()=>p.navigate({kind:"account"})}><User size={18}/></Button></div>}/>
 <div className={`v3-scroll ${root?"v3-scroll-root":"v3-scroll-detail"}`} data-testid="domain-body">
 {view.body}
 {root&&view.action&&<section className="px-[22px] pt-[24px] pb-[12px]"><Button data-testid="domain-action" variant="primary" disabled={view.action.disabled} className="w-full" onClick={view.action.run}>{view.action.label}</Button>{view.secondary&&<Button variant="secondary" className="w-full mt-[8px]" onClick={view.secondary.run}>{view.secondary.label}</Button>}</section>}
 </div>
 <FixedBottom className="v3-bottom border-0 shadow-none pb-[8px]">
 {!root&&view.action&&<><Button data-testid="domain-action" variant="primary" disabled={view.action.disabled} className="w-full" onClick={view.action.run}>{view.action.label}</Button>{view.secondary&&<Button variant="secondary" className="w-full mt-[8px]" onClick={view.secondary.run}>{view.secondary.label}</Button>}</>}
 {root&&<nav aria-label="Điều hướng ứng dụng" className="v3-nav">{p.design.navigation.map(item=><Button key={item.kind} variant="secondary" className="min-h-[48px]" aria-current={p.screen.kind===item.kind?"page":undefined} onClick={()=>p.navigate({kind:item.kind})}>{item.label}</Button>)}</nav>}
 <div className="w-[139px] h-[5px] bg-foreground rounded-full mx-auto mt-[12px]"/>
 </FixedBottom>
 </>;}
function CommerceHost(p:DomainProps){const view=useCommerceView(p);return <PageFrame p={p} view={view}/>;}
function LifestyleHost(p:DomainProps){const view=useLifestyleView(p);return <PageFrame p={p} view={view}/>;}
function HomeHost(p:DomainProps){if(p.screen.kind==="notifications"){const bills=p.store.data.bills.filter(b=>!b.paid);return <PageFrame p={p} view={{title:"Thông báo",body:<><section className="px-[22px] pt-[24px] pb-[12px]"><h2 className="text-base font-semibold pb-[12px]">Hóa đơn cần kiểm tra</h2><div className="grid gap-[12px]">{bills.length?bills.map(b=><Button key={b.id} variant="secondary" className="h-auto min-h-[72px] justify-start whitespace-normal text-left rounded-28" onClick={()=>p.navigate({kind:"bill",id:b.id})}><Bell size={18}/><span className="flex-1"><strong className="block">{b.title}</strong><span className="block text-sm text-foreground-secondary">Hạn {b.due} · {b.amount.toLocaleString("vi-VN")}đ</span></span><ChevronRight size={16}/></Button>):<p className="text-sm text-foreground-secondary">Bạn không còn hóa đơn chờ thanh toán.</p>}</div></section><section className="px-[22px] pt-[24px] pb-[12px]"><h2 className="text-base font-semibold pb-[12px]">Hoạt động gần đây</h2><div className="grid gap-[12px]">{p.store.data.records.length?p.store.data.records.slice(0,5).map(r=><Button key={r.id} variant="secondary" className="h-auto min-h-[72px] justify-start whitespace-normal text-left rounded-28" onClick={()=>p.navigate({kind:"receipt",id:r.id})}><span className="flex-1"><strong className="block">{r.title}</strong><span className="block text-sm text-foreground-secondary">{r.status}</span></span><ChevronRight size={16}/></Button>):<p className="text-sm text-foreground-secondary">Chưa có hoạt động mới.</p>}</div></section></>}}/>;}const view:ScreenView={title:p.screen.kind==="services"?"Tất cả dịch vụ":p.design.label,body:p.screen.kind==="services"?<ServicesPage {...p}/>:<ProductHome {...p}/>};return <PageFrame p={p} view={view}/>;}
export function ProductApp({design}:{design:ProductDesign}){
 const [data,setData]=useState<Store>(()=>structuredClone(initialStore));const [loaded,setLoaded]=useState(false);const [history,setHistory]=useState<Screen[]>([{kind:"home"}]);const [dark,setDark]=useState(false);
 const key=`vinclub-product-v3-${design.slug}`;
 useEffect(()=>{try {const raw=localStorage.getItem(key);if(raw){const parsed=JSON.parse(raw);if(Array.isArray(parsed.records)&&Array.isArray(parsed.bills)&&Array.isArray(parsed.products)&&typeof parsed.balance==="number")setData(parsed);}}catch{}setLoaded(true);setDark(document.documentElement.classList.contains("dark"));},[key]);
 useEffect(()=>{if(loaded)try{localStorage.setItem(key,JSON.stringify(data));}catch{}},[key,data,loaded]);
 const update=useCallback((fn:(prev:Store)=>Store)=>setData(prev=>fn(prev)),[]);
 const record=useCallback((entry:Omit<RecordEntry,"id"|"date">)=>{const row={...entry,id:crypto.randomUUID(),date:new Date().toISOString()};setData(prev=>({...prev,records:[row,...prev.records]}));return row;},[]);
 const store:StoreApi=useMemo(()=>({data,update,record}),[data,update,record]);
 const navigate=useCallback((screen:Screen)=>setHistory(old=>old.at(-1)?.kind===screen.kind&&old.at(-1)?.id===screen.id?old:[...old,screen]),[]);
 const back=useCallback(()=>setHistory(old=>old.length>1?old.slice(0,-1):[{kind:"home"}]),[]);
 const screen=history[history.length-1];const props:DomainProps={design,store,screen,navigate,back};
 const reset=()=>{setData(structuredClone(initialStore));setHistory([{kind:"home"}]);};
 const mode=()=>{document.documentElement.classList.toggle("dark");setDark(document.documentElement.classList.contains("dark"));};
 return <main className={`v3-studio v3-design-${design.slug} bg-secondary text-foreground`}>
 <aside className="v3-studio-rail"><Link href="/vinclub-redesign" className="text-sm font-semibold inline-flex gap-[8px] items-center"><ChevronLeft size={18}/>10 hướng thiết kế</Link><h1 className="text-xl font-semibold mt-[24px]">{design.name}</h1><p className="text-sm text-foreground-secondary mt-[8px]">{design.strategy}</p><div className="mt-[24px] grid gap-[8px]">{productDesigns.map(d=><Link className={`v3-studio-option rounded-14 ${d.slug===design.slug?"bg-background":""}`} href={`/vinclub-redesign/${d.slug}`} key={d.slug}>{String(productDesigns.indexOf(d)+1).padStart(2,"0")} · {d.name}<ChevronRight size={14}/></Link>)}</div><div className="grid gap-[8px] mt-[24px]"><Button variant="secondary" onClick={mode}>{dark?<Sun size={18}/>:<Moon size={18}/>} {dark?"Giao diện sáng":"Giao diện tối"}</Button><Button variant="secondary" onClick={reset}><RotateCcw size={18}/>Đặt lại dữ liệu demo</Button></div><p className="text-xs text-foreground-secondary mt-[24px]">Hình mới và dữ liệu riêng cho mỗi version. Thanh toán và đặt dịch vụ được mô phỏng, không gửi yêu cầu thật.</p></aside>
 <div className="v3-device"><div data-testid="app-preview" data-design={design.slug} data-screen={screen.kind} className="v3-phone">
 {screen.kind==="home"||screen.kind==="services"||screen.kind==="notifications"?<HomeHost key={`${screen.kind}-${screen.id||""}`} {...props}/>:commerceKinds.has(screen.kind)?<CommerceHost key={`${screen.kind}-${screen.id||""}`} {...props}/>:<LifestyleHost key={`${screen.kind}-${screen.id||""}`} {...props}/>}
 </div></div>
 </main>;
}
