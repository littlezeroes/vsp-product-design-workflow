"use client";

import Image from "next/image";
import { GoldSplash } from "@/components/vinclub/gold-splash";
import { illustrationAssets } from "./illustration-assets";
import { useRouter } from "next/navigation";
import { Experiences, type Trip } from "./experiences";
import { MySpace, AssetActionSheet, vouchers, type Voucher, type Bill } from "./my-space";
import { AiPrompt } from "./ai-prompt";
import { AiChat } from "./ai-chat";
import { Membership } from "./membership";
import { OffersBrowser } from "./offers-browser";
import { Profile } from "./profile";
import { HomeDiscovery } from "./home-discovery";
import { PaymentHome } from "./payment-home";
import { ShoppingJourney } from "@/components/vinclub/shopping-journey";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, ArrowUpRight, Check, ChevronLeft, ChevronRight, Home, Compass, Ticket, User, ScanLine, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { FixedBottom } from "@/components/ui/fixed-bottom";
import { Input } from "@/components/ui/input";
import { MembershipVisual } from "@/components/vinclub/visuals";
import "./dualsurface.css";
import "@/components/vinclub/glass.css";
import { LiquidSurface } from "@/components/vinclub/liquid-surface";
import { DailyIcon as ServiceIcon } from "@/components/vinclub/daily-icons";

const services = [{name:"Gọi xe",icon:"car",brand:"Green SM"},{name:"Đồ ăn",icon:"food",brand:"Bữa ngon mỗi ngày"},{name:"Vinmec",icon:"medical",brand:"Chăm sóc sức khỏe"},{name:"Học phí",icon:"school",brand:"Vinschool"},{name:"Khách sạn",icon:"hotel",brand:"Vinpearl"},{name:"Du lịch",icon:"travel",brand:"Trải nghiệm mới"},{name:"Vé máy bay",icon:"flight",brand:"Mọi hành trình"},{name:"Mua sắm",icon:"shopping",brand:"Vincom"}];
const offer = { name:"Một khoảng trời riêng.", points:80000 };
function Indicator(){return <div className="w-[139px] h-[5px] bg-foreground rounded-full mx-auto mt-[12px]"/>;}

export default function DualsurfacePage(){
  const router=useRouter();
  const [iconApproach,setIconApproach]=useState(1);
  useEffect(()=>{const valid=(id:number)=>Number.isInteger(id)&&id>=0&&id<10;const read=()=>{const value=new URLSearchParams(location.search).get("icons");const id=value===null?1:Number(value);if(valid(id))setIconApproach(id);};read();const receive=(event:MessageEvent)=>{if(event.origin===location.origin&&event.data?.type==="daily-icons"&&valid(event.data.approach))setIconApproach(event.data.approach);};window.addEventListener("message",receive);return()=>window.removeEventListener("message",receive);},[]);
  useEffect(()=>{
    const preload=()=>["gold","silver","glass","obsidian"].forEach(tier=>{
      const image=new window.Image();image.src=`/vinclub-assets/cards/${tier}.png`;
      void image.decode().catch(()=>{});
    });
    const timer=window.setTimeout(preload,200);
    return()=>window.clearTimeout(timer);
  },[]);
  const [shoppingOpen,setShoppingOpen]=useState(false);
  const [shoppingCatalog,setShoppingCatalog]=useState(false);
  const [shoppingEntry,setShoppingEntry]=useState<"mall"|undefined>();
  const [shoppingStore,setShoppingStore]=useState<string>();
  const [shoppingLandmark,setShoppingLandmark]=useState<string|undefined>(undefined);
  const [space,setSpace]=useState("VinClub");
  const [navTab,setNavTab]=useState("Trang chủ");
  const [trips,setTrips]=useState<Trip[]>([]);
  const [selectedVoucher,setSelectedVoucher]=useState<Voucher|null>(null);
  const [selectedBill,setSelectedBill]=useState<Bill|null>(null);
  const [offersSavedOnly,setOffersSavedOnly]=useState(false);
  const [savedVouchers,setSavedVouchers]=useState<string[]>([]);
  const [requestedPlans,setRequestedPlans]=useState<string[]>([]);
  const [extraBills,setExtraBills]=useState<Bill[]>([]);
  const [paidBills,setPaidBills]=useState<string[]>([]);
  const changeSpace=(name:string)=>{setSpace(name);setNavTab("Trang chủ");};
  const changeNav=(name:string)=>{setOffersSavedOnly(false);setNavTab(name);setSpace("VinClub");};
  const [membershipOpen,setMembershipOpen]=useState(false);
  const [homeReady,setHomeReady]=useState(false);
  const splashComplete=useCallback(()=>setHomeReady(true),[]);
  const [memberSource,setMemberSource]=useState<HTMLButtonElement|null>(null);
  const closeMembership=useCallback(()=>setMembershipOpen(false),[]);
  const memberCard=useRef<HTMLButtonElement>(null);
  const [panel,setPanel]=useState("");
  const [step,setStep]=useState("idle");
  const [points,setPoints]=useState(300000);
  const [redeemed,setRedeemed]=useState(false);
  const [visible,setVisible]=useState(true);
  const [query,setQuery]=useState("");
  const [prompt,setPrompt]=useState("");
  const [source,setSource]=useState("Tiền ví");
  const [amount,setAmount]=useState("100000");
  const dialog=useRef<HTMLDivElement>(null);
  const scrollArea=useRef<HTMLDivElement>(null);
  const homeStage=useRef<HTMLDivElement>(null);
  const isClubHome=space==="VinClub"&&navTab==="Trang chủ";
  useEffect(()=>{
    const area=scrollArea.current;
    const stage=homeStage.current;
    if(!area||!stage)return;
    area.scrollTo({top:0});
    stage.style.setProperty("--sheet-collapse","0px");
    stage.style.setProperty("--card-parallax","0px");
    if(!isClubHome)return;
    let frame=0;
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
    const update=()=>{
      frame=0;
      const collapse=Math.min(96,Math.max(0,area.scrollTop));
      stage.style.setProperty("--sheet-collapse",`${collapse}px`);
      stage.style.setProperty("--card-parallax",`${reduced.matches?0:-collapse*.25}px`);
    };
    const scroll=()=>{if(!frame)frame=requestAnimationFrame(update);};
    area.addEventListener("scroll",scroll,{passive:true});
    return()=>{area.removeEventListener("scroll",scroll);cancelAnimationFrame(frame);};
  },[space,navTab,isClubHome]);
  const active=services.find(s=>s.name===panel);
  const reward=panel===offer.name;
  const payment=["Học phí","Nạp tiền","Chuyển tiền","Quét mã"].includes(panel);
  const launchShopping=(landmark?:string,entry?:"mall"|"catalog")=>{setShoppingCatalog(entry==="catalog");setShoppingEntry(entry==="catalog"?"mall":entry);setShoppingStore(undefined);setShoppingLandmark(landmark);setPanel("");setShoppingOpen(true);};
  const open=(name:string)=>{if(name==="Thẻ hội viên"){setMemberSource(memberCard.current);setMembershipOpen(true);return;}if(space==="Thanh toán"){const routes:Record<string,string>={"Nạp tiền":"/bidv-link/deposit","Chuyển tiền":"/transfer/entry","Rút tiền":"/bidv-link/withdraw","Quét mã":"/qr-payment","Hóa đơn":"/sbh/my-bills","Bảo hiểm":"/insurance","Tín dụng":"/bnpl","Vay nhanh":"/bnpl/loan","Điện":"/sbh/my-bills","Nước":"/sbh/my-bills","Internet":"/sbh/my-bills","Dịch vụ khác":"/service-hub/services","Tài khoản ví":"/bidv-link","Auto Earn":"/sinhloi/intro","Thanh toán tự động":"/sbh/auto-payment","Ví trả sau":"/bnpl/dashboard","Internet FPT":"/sbh/my-bills","Thanh toán điện":"/sbh/history","Nạp tiền vào ví":"/bidv-link/transactions","Chuyển tiền cho Lan":"/transaction-360","Lịch sử":"/transaction-360"};if(routes[name]){router.push(routes[name]);return;}}if(name==="Mua sắm"){launchShopping();return;}setPanel(name);setStep("idle");};
  useEffect(()=>{if(!panel)return;const previous=document.activeElement as HTMLElement|null;const node=dialog.current;const controls=()=>Array.from(node?.querySelectorAll<HTMLElement>('button:not(:disabled),input,select')??[]);controls()[0]?.focus();const key=(e:KeyboardEvent)=>{if(e.key==="Escape")setPanel("");if(e.key==="Tab"){const list=controls();if(e.shiftKey&&document.activeElement===list[0]){e.preventDefault();list.at(-1)?.focus();}else if(!e.shiftKey&&document.activeElement===list.at(-1)){e.preventDefault();list[0]?.focus();}}};node?.addEventListener("keydown",key);return()=>{node?.removeEventListener("keydown",key);previous?.focus();};},[panel]);

  const offerCard=<Card className="ds-offer rounded-28 border-0 p-0 overflow-hidden shadow-none"><div className="ds-offer-photo"><Image src={illustrationAssets.escape} alt="Minh họa resort bên biển với hồ bơi xanh ngọc và ô đỏ" fill sizes="(max-width: 800px) 100vw, 45vw"/><span className="ds-photo-tag">VINPEARL · ELITE EXCLUSIVE</span></div><div className="px-[22px] py-[22px]"><p className="ds-eyebrow">ĐẶC QUYỀN NGHỈ DƯỠNG</p><h3 className="ds-serif ds-offer-title">{offer.name}</h3><p className="text-sm text-foreground-secondary mt-[12px]">Ưu đãi 30% phòng nghỉ. Đổi điểm để dành thời gian cho những điều bạn yêu.</p><div className="flex items-center justify-between mt-[24px]"><span className="text-sm font-semibold">80.000 VPoint</span><Button variant="secondary" size="32" onClick={()=>open(offer.name)}>{redeemed?"Voucher của tôi":"Khám phá"}<ArrowUpRight size={16}/></Button></div></div></Card>;
  const proceed=()=>{if(step==="success")setPanel("");else if(step==="error")setStep("confirm");else if(reward||payment){if(step==="confirm"){if(reward){setPoints(p=>p-offer.points);setRedeemed(true);}setStep("success");}else setStep("confirm");}else setPanel("");};
  const isLightPage=navTab==="Tài khoản"||(space==="VinClub"&&navTab==="Ưu đãi");
  const isExperience=space==="VinClub"&&navTab==="Trải nghiệm";
  return <div className="vc-premium-home vc-daily-premium"><GoldSplash onComplete={splashComplete}/><main inert={shoppingOpen} className={`ds-root bg-background text-foreground ${space==="Thanh toán"?"ds-payment-theme":""}`}><div inert={membershipOpen||!!panel} className={`ds-shell ${isLightPage?"ds-light-page":""} ${isExperience?"ds-experience-mode":""} ${space==="VinLife"?"ds-personal-mode":""} ${space==="Thanh toán"?"ds-payment-mode":""} ${space==="VinLife"||navTab!=="Trang chủ"?"ds-content-mode":""}`}>
  {isLightPage?<Header className="ds-light-header" title={navTab==="Tài khoản"?"Tài khoản":"Ưu đãi"}/>:!isExperience&&<div className="ds-dark-header"><Header className="ds-main-header" title={space==="VinLife"?"Cuộc sống trong tầm tay":space==="Thanh toán"?"Thanh toán tiện lợi":navTab === "Trang chủ" ? "Xin chào, Minh Anh" : navTab} leading={<span className="ds-brand ds-brand-logo" role="img" aria-label="Logo VinClub"/>} trailing={navTab==="Trang chủ"?<Button variant="secondary" aria-label="Thông báo" className="p-[10px] min-h-[44px]" onClick={()=>open("Thông báo")}><Bell size={20}/></Button>:undefined}/><nav className="ds-spaces px-[22px]" aria-label="Không gian VinClub"><LiquidSurface className="ds-spaces-glass" data-space={space} selectedIndex={["Thanh toán","VinClub","VinLife"].indexOf(space)}>{["Thanh toán","VinClub","VinLife"].map(s=><Button key={s} variant="secondary" aria-current={space===s?"page":undefined} onClick={()=>changeSpace(s)}>{s==="Thanh toán"?"VinPay":s==="VinLife"?"VinCare":s}</Button>)}</LiquidSurface></nav></div>}
  <div ref={homeStage} className={`ds-stage ${isClubHome?"ds-home-stage":""}`}>
  {space==="VinClub"&&navTab==="Trang chủ"&&<section className="ds-hero px-[22px]" aria-label="Thẻ hội viên Elite"><Button variant="secondary" ref={memberCard} className="ds-hero-card rounded-28" onClick={()=>open("Thẻ hội viên")}><MembershipVisual tier="gold" playWhen={homeReady&&!membershipOpen} revealDelay={120}/><span className="ds-hero-heading"><span className="ds-hero-identity"><span className="ds-serif">VinClub Elite</span><span className="ds-tier-progress"/></span><span className="ds-hero-points"><span>V {points.toLocaleString("vi-VN")}</span><small>VPoint</small></span></span></Button></section>}
  <div ref={scrollArea} className="ds-scroll">
  <div className="ds-surface rounded-28">
  {space==="Thanh toán"?<PaymentHome open={open} visible={visible} toggleVisible={()=>setVisible(!visible)} iconApproach={iconApproach}/>:space==="VinLife"?<MySpace extraBills={extraBills} onAddBill={bill=>setExtraBills(previous=>[...previous,bill])} requestedPlans={requestedPlans} onRequestPlan={id=>setRequestedPlans(previous=>previous.includes(id)?previous:[...previous,id])} iconApproach={iconApproach} paidBills={paidBills} savedVouchers={savedVouchers} onVoucher={setSelectedVoucher} onBill={setSelectedBill}/>:navTab==="Tài khoản"?<Profile points={points} onMembership={()=>open("Thẻ hội viên")} onOffers={()=>{changeNav("Ưu đãi");setOffersSavedOnly(true);}} onPayment={()=>changeSpace("Thanh toán")} extraBills={extraBills} onAddBill={bill=>setExtraBills(previous=>[...previous,bill])} requestedPlans={requestedPlans} onRequestPlan={id=>setRequestedPlans(previous=>previous.includes(id)?previous:[...previous,id])} iconApproach={iconApproach} paidBills={paidBills} savedVouchers={savedVouchers} onVoucher={setSelectedVoucher} onBill={setSelectedBill}/>:navTab==="Trải nghiệm"?<Experiences onAskAi={()=>{setPrompt("Gợi ý một chuyến đi quanh Ocean Park hôm nay");open("Trợ lý AI");}} onStore={id=>{setShoppingCatalog(false);setShoppingStore(id);setShoppingEntry(undefined);setShoppingLandmark(undefined);setShoppingOpen(true);}} onShopping={launchShopping} trips={trips} onBooked={trip=>setTrips(previous=>[trip,...previous])}/>:navTab==="Ưu đãi"?<OffersBrowser initialSavedOnly={offersSavedOnly} savedVouchers={savedVouchers} onVoucher={setSelectedVoucher}/>:<>
  <section className="px-[22px] ds-ai-section"><AiPrompt onChoose={suggestion=>{setPrompt(suggestion);open("Trợ lý AI");}}/></section>
  <section className="px-[22px] ds-promo-section" aria-label="Ưu đãi nổi bật"><div className="ds-promo-rail">{[{title:"Đi chợ WinMart",line:"Giảm 100.000đ",icon:"grocery",target:"WinMart"},{title:"Mua sắm online",line:"Nhân đôi VPoint",icon:"shopping",target:"Mua sắm"},{title:"Nghỉ dưỡng Elite",line:"Ưu đãi đến 30%",icon:"hotel",target:offer.name}].map(p=><Button variant="secondary" className="ds-promo rounded-14" key={p.title} onClick={()=>p.target==="WinMart"?setSelectedVoucher(vouchers.find(v=>v.id==="winmart-offer")??null):open(p.target)}><span>{p.title}<strong>{p.line}</strong></span><ServiceIcon approach={iconApproach} name={p.icon} size={76}/><ArrowUpRight className="ds-promo-arrow" size={13}/></Button>)}</div></section>
  <section className="px-[22px] ds-service-section" aria-label="Dịch vụ"><div className="ds-services">{services.map(s=><Button variant="secondary" key={s.name} className="ds-service rounded-28" onClick={()=>open(s.name)}><ServiceIcon approach={iconApproach} name={s.icon} size={64}/><span>{s.name}</span></Button>)}</div></section>

  <HomeDiscovery open={name=>{if(name==="Hóa đơn")router.push("/sbh/my-bills");else if(name==="Bảo hiểm")router.push("/insurance");else open(name);}} onExperiences={()=>changeNav("Trải nghiệm")} onOffers={()=>changeNav("Ưu đãi")} onVoucher={setSelectedVoucher} savedVouchers={savedVouchers}/>
  </>}
  </div></div></div>
  <FixedBottom className="ds-bottom border-0 shadow-none pb-[10px]"><LiquidSurface className="ds-bottom-inner rounded-28" count={5} selectedIndex={space==="VinLife"?undefined:["Trang chủ","Trải nghiệm","Quét mã","Ưu đãi","Tài khoản"].indexOf(navTab)}>{[{name:"Trang chủ",icon:Home},{name:"Trải nghiệm",icon:Compass},{name:"Quét mã",icon:ScanLine},{name:"Ưu đãi",icon:Ticket},{name:"Tài khoản",icon:User}].map(n=><Button variant="secondary" className={`ds-nav-item ${n.name==="Quét mã"?"ds-nav-scan":""}`} aria-label={n.name==="Quét mã"?"Quét mã QR":undefined} aria-current={n.name===(space==="VinLife"?"":navTab)?"page":undefined} key={n.name} onClick={()=>n.name==="Quét mã"?router.push("/qr-payment"):changeNav(n.name)}><n.icon size={n.name==="Quét mã"?24:20} strokeWidth={2.4}/>{n.name!=="Quét mã"&&<span>{n.name}</span>}</Button>)}</LiquidSurface><Indicator/></FixedBottom>
  </div>{membershipOpen&&<Membership source={memberSource} points={points} onClose={closeMembership} savedVouchers={savedVouchers} onVoucher={voucher=>{setMembershipOpen(false);setSelectedVoucher(voucher);}}/>}{panel==="Trợ lý AI"&&<AiChat initialPrompt={prompt} savedVouchers={savedVouchers} onVoucher={voucher=>{setPanel("");setSelectedVoucher(voucher);}} onClose={()=>setPanel("")} onNavigate={action=>{setPanel("");action==="bills"?changeSpace("VinLife"):changeNav(action==="offers"?"Ưu đãi":"Trải nghiệm");}}/>}{panel&&panel!=="Trợ lý AI"&&<div className="ds-dialog-backdrop"><div ref={dialog} className="ds-dialog bg-background" role="dialog" aria-modal="true" aria-label={panel}><Header title={panel} leading={<Button variant="secondary" size="32" aria-label="Quay lại" onClick={()=>setPanel("")}><ChevronLeft size={20}/></Button>} trailing={<Button variant="secondary" size="32" aria-label="Đóng" onClick={()=>setPanel("")}><X size={18}/></Button>}/><div className="ds-dialog-content px-[22px]">
  {step==="success"?<section className="pt-[24px]"><Check className="ds-success" size={44}/><h2 className="ds-serif ds-dialog-title">{reward?"Đặc quyền đã sẵn sàng.":"Mọi thứ đã hoàn tất."}</h2><p className="text-sm text-foreground-secondary">{reward?"Voucher đã thêm vào tài khoản của bạn trong phiên trải nghiệm.":"Giao dịch mô phỏng thành công. Số dư thật không thay đổi."}</p></section>:step==="error"?<section><h2 className="pt-[24px] pb-[12px] text-xl font-semibold">Chưa thể hoàn tất</h2><p className="text-sm text-foreground-secondary">Kết nối gián đoạn trong kịch bản demo. Bạn có thể thử lại; điểm chưa bị trừ.</p></section>:reward?<section><h2 className="pt-[24px] pb-[12px] font-semibold">{step==="confirm"?"Kiểm tra trước khi đổi":"Kỳ nghỉ dành riêng cho bạn"}</h2>{offerCard}<p className="text-sm text-foreground-secondary mt-[24px]">Hiệu lực 30 ngày · dùng một lần · đặt trước với Vinpearl. Không cộng dồn ưu đãi. Điều kiện và điểm là dữ liệu minh họa.</p><p className="text-sm mt-[12px]">Điểm sau khi đổi: {(points-offer.points).toLocaleString("vi-VN")} VPoint</p></section>:payment?<section><h2 className="pt-[24px] pb-[12px] text-xl font-semibold">{step==="confirm"?"Kiểm tra giao dịch":panel==="Học phí"?"Học phí tháng 10":"Chi tiết giao dịch"}</h2><Card className="rounded-28 border-0 shadow-none bg-secondary px-[22px] py-[24px]"><p className="ds-eyebrow">{panel==="Học phí"?"VINSCHOOL · NGUYỄN MINH ANH":"VINPAY"}</p><p className="text-2xl font-semibold">{Number(panel==="Học phí"?"2450000":amount).toLocaleString("vi-VN")}đ</p><p className="text-xs text-foreground-secondary">{panel==="Học phí"?"Hóa đơn HP-1026 · Hạn 10/10/2026":"Thông tin giao dịch minh họa"}</p></Card>{step!=="confirm"&&panel!=="Học phí"&&<label className="block pt-[24px] text-sm">Số tiền<Input type="number" min="1" value={amount} onChange={e=>setAmount(e.target.value)} className="mt-[12px]"/></label>}<label className="block pt-[24px] text-sm">Nguồn thanh toán<select aria-label="Nguồn thanh toán" className="ds-select bg-secondary rounded-14 mt-[12px]" value={source} onChange={e=>setSource(e.target.value)} disabled={step==="confirm"}><option>Tiền ví</option><option>VPoint (giả định demo)</option></select></label><p className="text-xs text-foreground-secondary mt-[16px]">Nguồn VPoint là giả định concept; cần xác nhận điều kiện theo dịch vụ.</p></section>:panel==="Dịch vụ"?<section><h2 className="pt-[24px] pb-[12px] font-semibold">Tìm đúng điều bạn cần</h2><Input placeholder="Tìm dịch vụ…" aria-label="Tìm dịch vụ" value={query} onChange={e=>setQuery(e.target.value)}/><div className="mt-[24px]">{services.filter(s=>`${s.name} ${s.brand}`.toLowerCase().includes(query.toLowerCase())).map(s=><Button key={s.name} variant="secondary" className="ds-catalog w-full justify-start" onClick={()=>open(s.name)}><ServiceIcon approach={iconApproach} name={s.icon} size={54}/><span className="flex-1 text-left">{s.name}<span className="block text-xs text-foreground-secondary">{s.brand}</span></span><ChevronRight size={16}/></Button>)}{!services.some(s=>`${s.name} ${s.brand}`.toLowerCase().includes(query.toLowerCase()))&&<p className="text-sm text-foreground-secondary">Chưa tìm thấy dịch vụ. Thử từ khóa khác.</p>}</div></section>:panel==="Thẻ hội viên"||panel==="Cá nhân"?<section><h2 className="pt-[24px] pb-[12px] font-semibold">Minh Anh · Elite</h2><MembershipVisual interactive/><p className="ds-points mt-[24px]">{points.toLocaleString("vi-VN")}<span> VPoint</span></p><p className="text-sm text-foreground-secondary mt-[12px]">Đặc quyền nghỉ dưỡng, mua sắm và chăm sóc sức khỏe trong hệ sinh thái Vin.</p><Button variant="secondary" className="mt-[24px]" onClick={()=>open(offer.name)}>Xem đặc quyền<ChevronRight size={16}/></Button></section>:active?<section><h2 className="pt-[24px] pb-[12px] font-semibold">{active.brand}</h2><ServiceIcon approach={iconApproach} name={active.icon} size={100}/><h3 className="ds-serif ds-dialog-title">Thêm tiện ích.<br/>Thêm thảnh thơi.</h3><p className="text-sm text-foreground-secondary">Chọn trải nghiệm và khám phá quyền lợi liên quan.</p>{["Trải nghiệm nổi bật","Quyền lợi hội viên"].map(n=><Button variant="secondary" className="w-full justify-between mt-[16px]" key={n} onClick={()=>n==="Quyền lợi hội viên"?open(offer.name):setStep("selected")}>{n}<ChevronRight size={16}/></Button>)}{step==="selected"&&<p role="status" className="text-sm mt-[16px]">Lựa chọn đã được ghi nhận trong demo. Nhà cung cấp chưa được kết nối.</p>}</section>:<section><h2 className="pt-[24px] pb-[12px] font-semibold">{panel==="Thông báo"?"Bạn đã xem hết thông báo":"Hoạt động của bạn"}</h2><p className="text-sm text-foreground-secondary">{panel==="Thông báo"?"Quyền lợi mới sẽ xuất hiện tại đây.":"Green SM · −85.000đ · Hôm qua, 18:42"}</p></section>}
  <p className="text-xs text-foreground-secondary pt-[32px] pb-[24px]">Bản trải nghiệm · dữ liệu và giao dịch minh họa.</p></div><FixedBottom className="relative inset-auto border-0 shadow-none pb-[12px]"><Button variant="primary" className="w-full" onClick={proceed} disabled={reward&&step!=="success"&&(redeemed||points<offer.points)||payment&&panel!=="Học phí"&&(!Number.isFinite(Number(amount))||Number(amount)<=0)}>{step==="success"?"Về VinClub":step==="error"?"Thử lại":reward?redeemed?"Đã đổi voucher":step==="confirm"?"Xác nhận đổi điểm demo":"Đổi quyền lợi":payment?step==="confirm"?"Xác nhận demo":"Tiếp tục":"Hoàn tất"}</Button>{step==="confirm"&&<Button variant="secondary" size="32" className="w-full mt-[8px]" onClick={()=>setStep("error")}>Thử trạng thái lỗi</Button>}<Indicator/></FixedBottom></div></div>}<AssetActionSheet voucher={selectedVoucher} bill={selectedBill} saved={!!selectedVoucher&&savedVouchers.includes(selectedVoucher.id)} paid={!!selectedBill&&paidBills.includes(selectedBill.id)} onClose={()=>{setSelectedVoucher(null);setSelectedBill(null);}} onSave={()=>{if(selectedVoucher)setSavedVouchers(previous=>previous.includes(selectedVoucher.id)?previous:[...previous,selectedVoucher.id]);}} onPay={()=>{if(selectedBill)setPaidBills(previous=>previous.includes(selectedBill.id)?previous:[...previous,selectedBill.id]);}}/></main>{shoppingOpen&&<ShoppingJourney catalogMode={shoppingCatalog} initialStore={shoppingStore} initialStep={shoppingEntry} initialLandmark={shoppingLandmark} onClose={()=>setShoppingOpen(false)}/>}</div>;
}
