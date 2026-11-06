"use client";

import { ChevronRight, Eye, EyeOff, ArrowDownUp, ArrowUpRight, TrendingUp } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { PaymentIcon } from "@/components/vinclub/daily-icons";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ItemList, ItemListItem } from "@/components/ui/item-list";

const shortcuts = [
  { name: "Ví trả sau", icon: "credit" }, { name: "Vay nhanh", icon: "loan" },
  { name: "Điện", icon: "electricity" }, { name: "Nước", icon: "water" },
  { name: "Internet", icon: "internet" }, { name: "Bảo hiểm", icon: "insurance" },
  { name: "Vé tàu", icon: "train" }, { name: "Dịch vụ khác", icon: "bank" },
];
const transactions = [
  { name: "Thanh toán điện", detail: "EVN Hà Nội · Hôm nay, 09:12", value: "−850.000đ", icon: "electricity" },
  { name: "Nạp tiền vào ví", detail: "BIDV · Hôm qua, 18:42", value: "+2.000.000đ", icon: "deposit" },
  { name: "Chuyển tiền cho Lan", detail: "Hôm qua, 12:30", value: "−240.000đ", icon: "transfer" },
];

export function PaymentHome({ open, visible, toggleVisible, iconApproach }: { open: (name: string) => void; visible: boolean; toggleVisible: () => void; iconApproach: number }) {
  const [reserveOpen, setReserveOpen] = useState(false);
  const [fundsOpen, setFundsOpen] = useState(false);
  return <div className="ds-payment-home">
    <section className="ds-payment-balance px-[22px]" aria-label="Số dư VinPay">
      <div className="flex items-center gap-[8px]"><p className="text-sm text-foreground-secondary">Số dư VinPay</p><Button variant="secondary" size="32" aria-label={visible ? "Ẩn số dư" : "Hiện số dư"} onClick={toggleVisible}>{visible ? <Eye size={16}/> : <EyeOff size={16}/>}</Button></div>
      <div className="ds-payment-balance-row">
        <h1 className="ds-payment-amount">{visible ? "12.500.000" : "••••••••"}<span>đ</span></h1>
        <div className="ds-payment-money-actions" role="group" aria-label="Thao tác với số dư">
          <Button variant="primary" size="32" aria-label="Nạp / Rút" onClick={() => setFundsOpen(true)}><ArrowDownUp size={18}/></Button>
          <Button variant="secondary" size="32" aria-label="Chuyển tiền" onClick={() => open("Chuyển tiền")}><ArrowUpRight size={18}/></Button>
          <Button variant="secondary" size="32" aria-label="Sinh lời" onClick={() => open("Auto Earn")}><TrendingUp size={18}/></Button>
        </div>
      </div>
      <Button variant="secondary" size="32" className="ds-payment-autoearn" onClick={() => open("Auto Earn")}><span>Auto Earn · {visible ? "3.000.000đ" : "••••••"} · <span className="text-success">{visible ? "+ 45.000đ hôm nay" : "•••• hôm nay"}</span></span><ChevronRight size={12}/></Button>
    </section>
    <section className="ds-reserve-stage px-[22px]" aria-label="Quỹ dự phòng">
      <Card className="ds-payment-reserve ds-reserve-glass-card rounded-28 border-0 shadow-none p-0 gap-0">
        <div className="ds-reserve-copy">
          <h2 className="text-sm font-medium">Quỹ dự phòng</h2>
          <p className="ds-reserve-amount">{visible ? "15.000.000đ" : "••••••"}</p>
          <Button variant="secondary" size="32" className="ds-reserve-withdraw" onClick={() => setReserveOpen(true)}>Rút quỹ<ChevronRight size={14}/></Button>
        </div>
        <Image src="/vinclub-assets/payment-custom/reserve-premium-safe-v1.webp" width={192} height={192} sizes="160px" alt="Tủ kính 3D chứa các bó tiền và đồng xu gold" className="ds-reserve-render"/>
      </Card>
    </section>
    <div className="ds-payment-sheet rounded-28"><div className="ds-payment-handle" aria-hidden="true"/>
      <section className="px-[22px]" aria-label="Dịch vụ thanh toán"><h2 className="pt-[24px] pb-[12px] text-base font-semibold">Tiện ích mỗi ngày</h2><div className="ds-payment-shortcuts">{shortcuts.map(s => <Button key={s.name} variant="secondary" className="ds-payment-shortcut" onClick={() => open(s.name)}><span className="ds-payment-icon-frame rounded-14"><PaymentIcon name={s.icon} size={50} approach={iconApproach}/></span><span>{s.name}</span></Button>)}</div></section>
      <section className="px-[22px]" aria-label="Lịch sử giao dịch"><div className="pt-[24px] pb-[12px] flex items-center justify-between"><h2 className="text-base font-semibold">Giao dịch gần đây</h2><Button variant="secondary" size="32" className="ds-payment-link" onClick={() => open("Lịch sử")}>Tất cả<ChevronRight size={14}/></Button></div><Card className="ds-payment-widget rounded-28 border-0 shadow-none px-[12px] py-[8px] gap-0"><ItemList>{transactions.map(t => <ItemListItem key={t.name} label={t.name} sublabel={t.detail} metadata={t.value} prefix={<PaymentIcon name={t.icon} size={36} approach={iconApproach}/>} onPress={() => open(t.name)}/>)}</ItemList></Card></section>
    </div>
    <Sheet open={fundsOpen} onOpenChange={setFundsOpen}><SheetContent side="bottom" className="vc-daily-premium ds-payment-theme ds-account-sheet rounded-28 border-0"><SheetHeader className="px-[22px] pt-[24px] pb-[12px]"><SheetTitle>Nạp / Rút tiền</SheetTitle><SheetDescription>Chọn cách di chuyển tiền của bạn.</SheetDescription></SheetHeader><div className="px-[22px] pb-[24px]"><ItemList><ItemListItem label="Nạp tiền" prefix={<PaymentIcon name="deposit" size={40} approach={iconApproach}/>} showChevron onPress={() => { setFundsOpen(false); open("Nạp tiền"); }}/><ItemListItem label="Rút tiền" prefix={<PaymentIcon name="withdraw" size={40} approach={iconApproach}/>} showChevron onPress={() => { setFundsOpen(false); open("Rút tiền"); }}/></ItemList><div className="w-[139px] h-[5px] bg-foreground rounded-full mx-auto mt-[24px]"/></div></SheetContent></Sheet>
    <Sheet open={reserveOpen} onOpenChange={setReserveOpen}><SheetContent side="bottom" className="vc-daily-premium ds-payment-theme ds-account-sheet rounded-28 border-0" showCloseButton={false}><div className="ds-payment-handle" aria-hidden="true"/><SheetHeader className="px-[22px] pt-[24px] pb-[12px]"><SheetTitle>Quỹ dự phòng</SheetTitle><SheetDescription>Dành riêng một khoản cho những việc bất ngờ.</SheetDescription></SheetHeader><div className="px-[22px]"><ItemListItem label="Số dư dự phòng" metadata={visible ? "15.000.000đ" : "••••••"} prefix={<PaymentIcon name="insurance" size={36} approach={iconApproach}/>}/><Button variant="secondary" className="w-full mt-[24px]" onClick={() => setReserveOpen(false)}>Đóng</Button><div className="w-[139px] h-[5px] bg-foreground rounded-full mx-auto mt-[24px] mb-[8px]"/></div></SheetContent></Sheet>
  </div>;
}
