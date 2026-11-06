"use client";
import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { ApprovedPhone } from "../vinclub-lab/approved-phone";
import config from "@/public/vinclub-lab/config.json";
const subscribe=()=>()=>{};
function Gallery(){
 const q=new URLSearchParams(location.search);
 const [selected,setSelected]=useState(q.get("ia")||"atlas");
 const [solo,setSolo]=useState(q.get("solo")==="1");
 const [space,setSpace]=useState("VinClub");
 const options=config.ia.filter(x=>["atlas","daily","dualsurface"].includes(x.id));
 return <main className="lab-root bg-background text-foreground min-h-screen pb-[40px]" data-ready="true"><div className="px-[22px] max-w-[1400px] mx-auto pt-[32px]"><p className="text-xs text-foreground-secondary">VINCLUB · DESIGN DIRECTIONS</p><h1 className="text-3xl font-semibold mt-[12px]">Một thế giới. Ba cách chạm.</h1><p className="text-sm text-foreground-secondary mt-[12px]">01 · Khám phá không gian / 02 · Trợ lý cá nhân / 03 · Hội viên & hệ sinh thái</p><div className="flex flex-wrap gap-[8px] mt-[24px]">{options.map(x=><Button variant="secondary" size="32" key={x.id} aria-pressed={selected===x.id} onClick={()=>{setSelected(x.id);setSolo(true);}}>{x.name}</Button>)}<Button variant="secondary" size="32" onClick={()=>setSolo(!solo)}>{solo?"So sánh cả ba":"Xem riêng"}</Button></div><div className="lab-comparison mt-[24px]">{(solo?options.filter(x=>x.id===selected):options).map(x=><article className="lab-column" key={x.id}><h2 className="text-lg font-semibold">{x.name}</h2><p className="text-sm text-foreground-secondary mt-[8px]">{x.promise}</p><ApprovedPhone key={`${x.id}-${space}`} ia={x} stage="visual" visual={x.id==="daily"?"luminous":x.id==="atlas"?"glass":"metal"} space={x.id==="dualsurface"?space:"VinClub"} onSpace={setSpace}/></article>)}</div><p className="text-xs text-foreground-secondary pt-[32px]">Concept tương tác · số dư, voucher và địa điểm minh họa. AI chưa kết nối dữ liệu thật.</p><p className="text-xs mt-[12px]"><a className="underline" href="https://www.awwwards.com/sites/lusion">Art direction reference · Lusion</a> · <a className="underline" href="https://www.awwwards.com/sites/ultima-collection">Ultima Collection</a></p></div></main>;
}
export default function Premium(){const ready=useSyncExternalStore(subscribe,()=>true,()=>false);return ready?<Gallery/>:<main className="px-[22px] pt-[32px]">Đang mở VinClub…</main>;}
