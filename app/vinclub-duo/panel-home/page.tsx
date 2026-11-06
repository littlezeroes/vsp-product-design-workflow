"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ChevronRight, Grid2X2, Plus, ScanLine } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HomeDiscovery } from "@/app/vinclub-dualsurface/home-discovery";
import { AssetActionSheet, type Voucher } from "@/app/vinclub-dualsurface/my-space";
import { DailyIcon, PaymentIcon } from "@/components/vinclub/daily-icons";
import { AiPrompt } from "@/app/vinclub-dualsurface/ai-prompt";
import { AiChat } from "@/app/vinclub-dualsurface/ai-chat";
import { PaymentHome } from "@/app/vinclub-dualsurface/payment-home";
import "@/app/vinclub-dualsurface/dualsurface.css";
import "@/components/vinclub/glass.css";
import "./panel.css";

const services=[{name:"Gọi xe",icon:"car",route:"/xanhsm-vsp/booking"},{name:"Đồ ăn",icon:"food",route:"/vinclub-dualsurface/ui"},{name:"Vinmec",icon:"medical",route:"/vinclub-dualsurface/ui"},{name:"Học phí",icon:"school",route:"/sbh/education"},{name:"Khách sạn",icon:"hotel",route:"/vinclub-dualsurface/ui"},{name:"Du lịch",icon:"travel",route:"/vinclub-dualsurface/ui"},{name:"Vé máy bay",icon:"flight",route:"/vinclub-dualsurface/ui"},{name:"Mua sắm",icon:"shopping",route:"/vinclub-dualsurface/ui"}];
export default function DuoHomePanel(){
 const router=useRouter();const [wallet,setWallet]=useState(false);const [prompt,setPrompt]=useState<string|null>(null);
 const [voucher,setVoucher]=useState<Voucher|null>(null);const [saved,setSaved]=useState<string[]>([]);
 const discover=(name:string)=>{if(name==="Gọi xe")router.push("/xanhsm-vsp/booking");else if(name==="Hóa đơn")router.push("/sbh/my-bills");else if(name==="Bảo hiểm")router.push("/insurance");else parent.postMessage({type:"duo-right",view:"experiences",category:name},location.origin);};
 const navigate=(route:string)=>router.push(route);
 const open=(label:string)=>{const routes:Record<string,string>={"Nạp tiền":"/bidv-link/deposit","Chuyển tiền":"/transfer/entry","Rút tiền":"/bidv-link/withdraw","Quét mã":"/qr-payment","Hóa đơn":"/sbh/my-bills","Lịch sử":"/transaction-360"};navigate(routes[label]??"/service-hub/services");};
 useEffect(()=>{const receive=(event:MessageEvent)=>{if(event.origin!==location.origin)return;if(event.data?.type==="duo-left"){setWallet(event.data.view==="wallet");if(event.data.view==="ai")setPrompt(event.data.prompt??"Hôm nay tôi có thể làm gì với VinClub?");}};window.addEventListener("message",receive);return()=>window.removeEventListener("message",receive);},[]);
 return <main className="duo-task-home vc-daily-premium text-foreground bg-background">
   <header className="duo-task-heading px-[22px]"><h1>{wallet?"VinPay":"Cuộc sống trong tầm tay bạn"}</h1>{wallet&&<Button variant="secondary" size="32" onClick={()=>setWallet(false)}>Home</Button>}</header>
   <div className="duo-task-scroll">{wallet?<PaymentHome visible toggleVisible={()=>{}} open={open} iconApproach={1}/>:<>
    <section className="px-[22px]" aria-label="Widget thanh toán VinPay"><Card className="duo-payment-widget dark rounded-28 border-0 shadow-none bg-background text-foreground"><div className="duo-payment-top"><span>VinPay</span></div><div className="duo-payment-body"><strong className="duo-payment-amount">28.650.000 <small>₫</small></strong><div className="duo-payment-actions">{[{label:"Nạp",icon:Plus,route:"/bidv-link/deposit"},{label:"Chuyển",icon:ArrowUpRight,route:"/transfer/entry"},{label:"Scan",icon:ScanLine,route:"/qr-payment"}].map(({label,icon:Icon,route})=><Button key={label} variant="secondary" size="32" aria-label={label} title={label} onClick={()=>navigate(route)}><Icon size={20} strokeWidth={1.6}/><span>{label}</span></Button>)}</div></div></Card></section>
    <section className="px-[22px] ds-promo-section" aria-label="Ưu đãi nổi bật"><div className="ds-promo-rail">{[{title:"WinMart",line:"Giảm 100k",icon:"grocery"},{title:"Mua sắm",line:"Mua trước, trả sau",icon:"shopping"},{title:"Nghỉ dưỡng Elite",line:"Ưu đãi đến 30%",icon:"hotel"}].slice(0,2).map(item=><Button variant="secondary" className="ds-promo rounded-14" key={item.title} onClick={()=>item.icon==="shopping"?navigate("/bnpl/dashboard"):parent.postMessage({type:"duo-right",view:"offers"},location.origin)}><span>{item.title}<strong>{item.line}</strong></span><DailyIcon name={item.icon} size={76}/><ArrowUpRight className="ds-promo-arrow" size={13}/></Button>)}</div></section>
    <section className="px-[22px]" aria-label="Dịch vụ nhanh"><h2 className="pt-[24px] pb-[12px]">Dịch vụ</h2><div className="duo-task-services">{services.map(service=><Button variant="secondary" className="ds-service rounded-28" key={service.name} onClick={()=>{if(["Mua sắm","Du lịch","Vinmec","Đồ ăn","Khách sạn","Vé máy bay"].includes(service.name)){parent.postMessage({type:"duo-right",view:"experiences",category:service.name},location.origin);}else navigate(service.route);}}>{service.name==="Tất cả"?<Grid2X2 size={32} strokeWidth={1.3}/>:service.name==="Hóa đơn"?<PaymentIcon name={service.icon} size={42}/>:<DailyIcon name={service.icon} size={42}/>}<span>{service.name}</span></Button>)}</div></section>
    <HomeDiscovery completeGrid open={discover} onExperiences={()=>discover("Trải nghiệm")} onOffers={()=>parent.postMessage({type:"duo-right",view:"offers"},location.origin)} onVoucher={setVoucher} savedVouchers={saved}/>

   </>}</div>
   <footer className="duo-task-ai px-[22px]"><AiPrompt onChoose={setPrompt}/></footer>
   {voucher&&<AssetActionSheet voucher={voucher} bill={null} saved={saved.includes(voucher.id)} paid={false} onClose={()=>setVoucher(null)} onSave={()=>setSaved(previous=>previous.includes(voucher.id)?previous.filter(id=>id!==voucher.id):[...previous,voucher.id])} onPay={()=>{}}/>}
   {prompt!==null&&<AiChat initialPrompt={prompt} onClose={()=>setPrompt(null)} onNavigate={action=>{setPrompt(null);if(action==="bills")navigate("/sbh/my-bills");else parent.postMessage({type:"duo-right",view:action==="offers"?"offers":"experiences"},location.origin);}}/>}
 </main>;
}
