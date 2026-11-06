"use client";

import { ChargingCar } from "./charging-car";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, MapPin, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/ui/header";
import { FixedBottom } from "@/components/ui/fixed-bottom";
import "./charging.css";

export function ChargingWidget() {
  const [opened, setOpened] = useState(false);
  return <section className="px-[22px] pt-[24px] charge-home-section" aria-label="Xe của bạn">
    <Button variant="secondary" className="charge-widget rounded-16" onClick={() => setOpened(true)} aria-label="VinFast, đang sạc 72 phần trăm. Xem chi tiết">
      <span className="charge-widget-content">
        <span className="charge-widget-top"><span><span className="charge-kicker">XE CỦA BẠN</span><span className="charge-model">VinFast</span></span><span className="charge-status"><Zap size={12}/> Đang sạc</span></span>
        <span className="charge-widget-middle"><span className="charge-reading">72<span>%</span></span><ChargingCar/></span>
        <span className="charge-progress" role="progressbar" aria-label="Mức pin" aria-valuenow={72} aria-valuemin={0} aria-valuemax={100}><span/></span>
        <span className="charge-widget-bottom"><span>Còn 25 phút <span className="text-foreground-secondary">đến 80%</span></span><ChevronRight size={16}/></span>
      </span>
    </Button>
    {opened && createPortal(<ChargingDetail onClose={() => setOpened(false)}/>, document.body)}
  </section>;
}

function ChargingDetail({ onClose }: { onClose: () => void }) {
  const [stopped, setStopped] = useState(false);
  const [replay, setReplay] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const node = dialog.current;
    const home = document.querySelector<HTMLElement>(".ds-root");
    const wasInert = home?.inert ?? false;
    if (home) home.inert = true;
    node?.querySelector<HTMLButtonElement>("button")?.focus();
    const handle = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const controls = Array.from(node?.querySelectorAll<HTMLElement>("button:not(:disabled),a[href]") ?? []);
      if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1)?.focus(); }
      else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0]?.focus(); }
    };
    node?.addEventListener("keydown", handle);
    return () => { node?.removeEventListener("keydown", handle); if (home) home.inert = wasInert; previous?.focus(); };
  }, [onClose]);
  return <div ref={dialog} className={`charge-detail dark ${stopped ? "charge-paused" : ""}`} role="dialog" aria-modal="true" aria-label="Chi tiết sạc VinFast">
    <Header title="Xe của bạn" leading={<Button variant="secondary" size="32" aria-label="Quay lại" onClick={onClose}><ChevronLeft size={20}/></Button>} trailing={<Button variant="secondary" size="32" aria-label="Đóng chi tiết sạc" onClick={onClose}><X size={18}/></Button>}/>
    <div className="charge-detail-scroll">
      <section className="px-[22px]"><div className="pt-[24px] pb-[12px] flex items-start justify-between"><div><p className="charge-kicker">VINFAST</p><h1 className="text-2xl font-semibold mt-[8px]">Xe của Minh Anh</h1></div><span className="charge-status"><Zap size={12}/>{stopped ? "Đã dừng" : "Đang sạc"}</span></div><ChargingCar large stopped={stopped} replay={replay}/><Button variant="secondary" size="32" className="charge-replay" onClick={() => setReplay(value => value + 1)}>Xoay xe</Button>
        <div className="charge-detail-reading"><span className="charge-reading">72<span>%</span></span><div><p className="text-sm font-semibold">{stopped ? "Phiên sạc đã kết thúc" : "Sẵn sàng sau 25 phút"}</p><p className="text-xs text-foreground-secondary mt-[4px]">{stopped ? "Bạn có thể rút cáp sạc" : "Mục tiêu 80% · Dự kiến 10:06"}</p></div></div>
        <div className="charge-progress mt-[16px]" role="progressbar" aria-label="Mức pin" aria-valuenow={72} aria-valuemin={0} aria-valuemax={100}><span/></div><div className="flex justify-between text-xs text-foreground-secondary mt-[8px]"><span>Pin hiện tại</span><span>Mục tiêu 80%</span></div>
      </section>
      <section className="px-[22px]"><h2 className="pt-[24px] pb-[12px] text-sm font-semibold">Phiên sạc hiện tại</h2><div className="charge-metrics">{[{ label: "Công suất", value: stopped ? "0" : "60", unit: "kW" }, { label: "Đã nạp", value: "18,4", unit: "kWh" }].map(item => <Card key={item.label} className="rounded-28 border-0 shadow-none bg-card p-[16px]"><p className="text-xs text-foreground-secondary">{item.label}</p><p className="text-2xl font-medium mt-[8px]">{item.value}<span className="text-xs text-foreground-secondary ml-[4px]">{item.unit}</span></p></Card>)}</div>
        <div className="flex gap-[12px] items-center pt-[24px]"><MapPin size={18} className="text-foreground-secondary"/><div><p className="text-sm font-medium">Vincom Ocean Park</p><p className="text-xs text-foreground-secondary mt-[4px]">Trụ DC-08 · Cổng 02</p></div></div><p className="text-xs text-foreground-secondary pt-[24px] pb-[12px]">Dữ liệu và thao tác sạc trong bản thiết kế là minh họa.</p>
      </section>
    </div>
    <FixedBottom className="charge-fixed border-0 shadow-none pb-[8px]">
      {confirm && <p className="text-sm pb-[12px]" role="status">Dừng phiên sạc ở mức pin 72%?</p>}
      <Button variant="primary" className="w-full" onClick={() => stopped ? onClose() : confirm ? (setStopped(true), setConfirm(false)) : setConfirm(true)}>{stopped ? "Về trang chủ" : confirm ? "Xác nhận dừng sạc" : "Dừng sạc"}</Button>
      {confirm && <Button variant="secondary" className="w-full mt-[8px]" onClick={() => setConfirm(false)}>Tiếp tục sạc</Button>}
      <div className="w-[139px] h-[5px] bg-foreground rounded-full mx-auto mt-[12px]"/>
    </FixedBottom>
  </div>;
}
