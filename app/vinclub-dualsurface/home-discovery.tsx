"use client";

import { OfferGrid } from "./offer-grid";
import Image from "next/image";
import "./home-discovery.css";
import { illustrationAssets, type IllustrationName } from "./illustration-assets";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { vouchers, type Voucher } from "./my-space";

const groups = [
  { title: "Di chuyển & ăn uống", description: "Từ chuyến đi đến bữa ngon mỗi ngày.", items: [
    { title: "Đi đâu cũng tiện", copy: "Gọi xe điện, đến nơi nhẹ nhàng.", target: "Gọi xe", banner: "ride" },
    { title: "Bữa ngon đến tận cửa", copy: "Đặt món yêu thích, để chúng tôi giao.", target: "Đồ ăn", banner: "food" },
    { title: "Sẵn sàng cất cánh", copy: "Tìm chuyến bay cho hành trình mới.", target: "Vé máy bay", banner: "flight" },
  ] },
  { title: "Mua sắm & tiện ích", description: "Lo việc thường ngày, thêm thời gian cho bạn.", items: [
    { title: "Dạo phố, chọn món", copy: "Khám phá cửa hàng và mua sắm tại Vincom.", target: "Mua sắm", banner: "shopping" },
    { title: "Hóa đơn gọn một chạm", copy: "Điện, nước, internet và học phí.", target: "Hóa đơn", banner: "bills" },
    { title: "An tâm mỗi ngày", copy: "Tìm giải pháp bảo vệ bạn và gia đình.", target: "Bảo hiểm", banner: "insurance" },
  ] },
  { title: "Nghỉ dưỡng & chăm sóc", description: "Dành một khoảng thời gian cho chính mình.", items: [
    { title: "Hẹn một kỳ nghỉ", copy: "Tìm nơi nghỉ, lên lịch và đặt chuyến đi.", target: "Trải nghiệm", banner: "escape" },
    { title: "Khỏe để tận hưởng", copy: "Khám phá dịch vụ chăm sóc tại Vinmec.", target: "Vinmec", banner: "wellness" },
    { title: "Cuối tuần có hẹn", copy: "Khám phá sự kiện và trải nghiệm mới.", target: "Trải nghiệm", banner: "weekend" },
  ] },
];


export function HomeDiscovery({ open, onExperiences, onOffers, onVoucher, savedVouchers, completeGrid = false }: {
  open: (name: string) => void; onExperiences: () => void; onOffers: () => void;
  onVoucher: (voucher: Voucher) => void; savedVouchers: string[]; completeGrid?: boolean;
}) {
  const extras = [
    {title:"Đi chợ cho cả nhà",copy:"Chọn thực phẩm và đồ dùng tại WinMart.",target:"Mua sắm",banner:"winmart"},
    {title:"Sẵn sàng năm học mới",copy:"Xem và thanh toán học phí trong VinPay.",target:"Hóa đơn",banner:"bills"},
    {title:"Một ngày cho gia đình",copy:"Lên lịch dạo chơi và khám phá Vincom.",target:"Trải nghiệm",banner:"shopping"},
  ];
  const shownGroups = completeGrid ? groups.map((group,index)=>({...group,items:[...group.items,extras[index]]})) : groups;
  const go = (name: string) => name === "Trải nghiệm" ? onExperiences() : open(name);
  return <div className="ds-home-discovery">
    {shownGroups.map(group => <section key={group.title} className="px-[22px] ds-discovery-section">
      <div className="pt-[24px] pb-[12px]"><h2 className="text-xl font-semibold">{group.title}</h2><p className="text-sm text-foreground-secondary mt-[8px]">{group.description}</p></div>
      <div className="ds-discovery-rail" tabIndex={0} role="region" aria-label={`${group.title}${completeGrid ? "" : " · vuốt để khám phá"}`}>
        {group.items.map(item => <Card key={item.title} className="ds-discovery-card rounded-28 border-0 shadow-none p-0 gap-0 overflow-hidden bg-secondary">
          <div className="ds-discovery-art"><Image src={illustrationAssets[item.banner as IllustrationName]} alt="" fill sizes="244px"/></div>
          <div className="ds-discovery-copy"><h3 className="text-base font-semibold">{item.title}</h3><p className="text-sm text-foreground-secondary mt-[8px]">{item.copy}</p><Button variant="secondary" size="32" className="ds-discovery-link" onClick={() => go(item.target)}>{item.target === "Trải nghiệm" ? "Khám phá" : item.target}<ArrowUpRight size={14}/></Button></div>
        </Card>)}
      </div>
    </section>)}
    <section className="px-[22px] ds-home-offers">
      <div className="pt-[24px] pb-[12px] flex items-center justify-between"><div><h2 className="text-xl font-semibold">Ưu đãi dành cho bạn</h2></div><Button variant="secondary" size="32" className="ds-small-link" onClick={onOffers}>Tất cả<ChevronRight size={14}/></Button></div>
      <OfferGrid offers={vouchers.filter(v=>["vinpearl-offer","winmart-offer","vincom-offer","vinmec-offer"].includes(v.id))} savedVouchers={savedVouchers} onVoucher={onVoucher}/>
    </section>
  </div>;
}
