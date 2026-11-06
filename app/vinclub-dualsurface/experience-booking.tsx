"use client";

import { useRef, useState } from "react";
import { CalendarDays, Check, ChevronLeft, CreditCard, Ticket, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { Input } from "@/components/ui/input";
import { FixedBottom } from "@/components/ui/fixed-bottom";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export type Trip = { id: string; title: string; date: string; guests: number; total: number; kind?: "ticket" | "stay"; code?: string; time?: string; ticketType?: string; paymentSource?: string };
type Experience = { id: string; title: string; price: number; unit: string };
const money = (n: number) => `${n.toLocaleString("vi-VN")}đ`;
function localToday() { const now=new Date();now.setMinutes(now.getMinutes()-now.getTimezoneOffset());return now.toISOString().slice(0,10); }

export function ExperienceBooking({ experience, initialTrip, onClose, onBooked }: { experience: Experience; initialTrip?: Trip; onClose: () => void; onBooked: (trip: Trip) => void }) {
  const ticket=experience.id==="events";
  const [stage,setStage]=useState<"schedule"|"payment"|"success">(initialTrip?"success":"schedule");
  const [date,setDate]=useState("");
  const [quantity,setQuantity]=useState("2");
  const [time,setTime]=useState("15:00");
  const [ticketType,setTicketType]=useState("Tiêu chuẩn");
  const [source,setSource]=useState("Tiền ví");
  const [receipt,setReceipt]=useState(initialTrip);
  const [today]=useState(localToday);
  const locked=useRef(false);
  const count=Number(quantity);
  const unit=ticket?experience.price+(ticketType==="Premium"?100000:0):experience.price;
  const total=unit*(ticket?count:Math.ceil(count/2));
  const valid=/^\d{4}-\d{2}-\d{2}$/.test(date)&&date>=today&&Number.isInteger(count)&&count>=1&&count<=6;
  const confirm=()=>{
    if(stage==="success"){onClose();return;}
    if(!valid)return;
    if(stage==="schedule"){setStage("payment");return;}
    if(locked.current)return;locked.current=true;
    const id=crypto.randomUUID();const trip:Trip={id,title:experience.title,date,guests:count,total,kind:ticket?"ticket":"stay",paymentSource:source,...(ticket?{code:`VC-DEMO-${id.slice(0,8).toUpperCase()}`,time,ticketType}:{})};
    onBooked(trip);setReceipt(trip);setStage("success");
  };
  return <Sheet open onOpenChange={open=>{if(!open)onClose();}}><SheetContent side="bottom" className="ds-action-sheet vc-daily-premium rounded-28 border-0 gap-0" showCloseButton={false}>
    <Header showStatusBar={false} title={stage==="schedule"?ticket?"Đặt vé sự kiện":"Lên lịch chuyến đi":stage==="payment"?"Kiểm tra & thanh toán":ticket?"Vé của bạn":"Chuyến đi của bạn"} leading={stage==="payment"?<Button variant="secondary" size="32" aria-label="Quay lại chọn vé" onClick={()=>setStage("schedule")}><ChevronLeft size={20}/></Button>:undefined} trailing={<Button variant="secondary" size="32" aria-label="Đóng lịch chuyến đi" onClick={onClose}><X size={18}/></Button>}/>
    <section className="px-[22px] pt-[24px] pb-[12px]">
      <SheetTitle className="text-xl">{stage==="success"?ticket?"Đặt vé thành công":"Lịch trình đã sẵn sàng":experience.title}</SheetTitle>
      <SheetDescription className="text-foreground-secondary mt-[12px]">{stage==="success"?ticket?"Vé đã được lưu tại Trải nghiệm. Bạn có thể mở lại bất cứ lúc nào.":"Chuyến đi đã được lưu trong Trải nghiệm.":ticket?"Chọn ngày, khung giờ và loại vé phù hợp.":"Chọn lịch phù hợp trước khi thanh toán."}</SheetDescription>
      {stage==="schedule"?<>
        <label className="ds-plan-label">{ticket?"Ngày tham dự":"Ngày bắt đầu"}<Input type="date" min={today} value={date} onChange={e=>setDate(e.target.value)}/></label>
        {ticket&&<><h2 className="pt-[24px] pb-[12px] text-sm font-semibold">Khung giờ</h2><div className="dx-ticket-options">{["10:00","15:00","18:30"].map(value=><Button key={value} variant="secondary" size="32" aria-pressed={time===value} onClick={()=>setTime(value)}>{value}</Button>)}</div><h2 className="pt-[24px] pb-[12px] text-sm font-semibold">Loại vé</h2><div className="dx-ticket-options">{["Tiêu chuẩn","Premium"].map(value=><Button key={value} variant="secondary" aria-pressed={ticketType===value} onClick={()=>setTicketType(value)}>{value} · {money(experience.price+(value==="Premium"?100000:0))}</Button>)}</div></>}
        <label className="ds-plan-label">{ticket?"Số vé":"Số khách"}<Input type="number" min="1" max="6" value={quantity} onChange={e=>setQuantity(e.target.value)}/></label>
        <Card className="rounded-14 border-0 shadow-none bg-secondary p-[22px] mt-[24px] gap-[8px]"><p className="text-xs text-foreground-secondary">Tổng dự kiến</p><p className="text-2xl font-medium">{valid?money(total):"Chọn ngày và số lượng"}</p></Card>
      </>:stage==="payment"?<>
        <Card className="rounded-28 border-0 shadow-none bg-secondary p-[22px] gap-[12px] mt-[24px]"><p className="font-semibold">{experience.title}</p><p className="text-sm text-foreground-secondary">{date}{ticket?` · ${time} · ${count} vé ${ticketType}`:` · ${count} khách · ${Math.ceil(count/2)} phòng, 1 đêm`}</p><p className="text-2xl font-medium">{money(total)}</p></Card>
        <label className="ds-plan-label">Nguồn thanh toán<select className="bg-secondary text-foreground rounded-14 p-[12px]" value={source} onChange={e=>setSource(e.target.value)}><option>Tiền ví</option><option>Thẻ BIDV · 6868</option></select></label>
      </>:receipt&&<Card className="dx-ticket-receipt rounded-28 border-0 shadow-none bg-secondary p-[22px] gap-[12px] mt-[24px]">
        {ticket?<Ticket size={32}/>:<CalendarDays size={32}/>}<p className="text-lg font-semibold">{receipt.title}</p><p className="text-sm text-foreground-secondary">{receipt.date}{receipt.time?` · ${receipt.time}`:""}</p><p className="text-sm">{receipt.guests} {ticket?`vé · ${receipt.ticketType}`:"khách"}</p>{receipt.code&&<><p className="text-xs text-foreground-secondary">Mã vé demo</p><p className="font-mono text-base" data-ticket-code>{receipt.code}</p></>}<p className="text-xl">{money(receipt.total)}</p><p className="text-xs text-foreground-secondary">{receipt.paymentSource}</p><p role="status" className="flex items-center gap-[8px] text-sm"><Check size={18}/>Đã thanh toán demo</p>
      </Card>}
      <p className="text-xs text-foreground-secondary pt-[24px]">Giá, vé và thanh toán là dữ liệu minh họa. Không đặt chỗ hoặc trừ tiền thật.</p>
    </section>
    <FixedBottom className="relative inset-auto border-0 shadow-none pb-[8px]"><Button variant="primary" className="w-full" disabled={stage==="schedule"&&!valid} onClick={confirm}>{stage==="schedule"?<><CreditCard size={18}/>Tiếp tục thanh toán</>:stage==="payment"?"Xác nhận thanh toán demo":"Hoàn tất"}</Button>{stage==="payment"&&<Button variant="secondary" className="w-full mt-[8px]" onClick={()=>setStage("schedule")}>{ticket?"Đổi thông tin vé":"Đổi lịch chuyến đi"}</Button>}<div className="w-[139px] h-[5px] bg-foreground rounded-full mx-auto mt-[12px]"/></FixedBottom>
  </SheetContent></Sheet>;
}
