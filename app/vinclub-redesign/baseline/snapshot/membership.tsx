"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { OfferGrid } from "./offer-grid";
import { vouchers, type Voucher } from "./my-space";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ItemListItem } from "@/components/ui/item-list";
import { Header } from "@/components/ui/header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FixedBottom } from "@/components/ui/fixed-bottom";
import { MembershipVisual } from "@/components/vinclub/visuals";

const tiers = [
  { name: "Essential", visual: "glass", tone: "silver" },
  { name: "Signature", visual: "silver", tone: "silver" },
  { name: "Elite", visual: "gold", tone: "gold" },
  { name: "Black", visual: "obsidian", tone: "black" },
] as const;
const privileges = [
  {id:"points",name:"Tích điểm trong từng trải nghiệm",brand:"VINCLUB",value:"Tích VPoint mỗi ngày",required:0,detail:"Tích điểm từ mua sắm và dịch vụ trong hệ sinh thái; xem mức tích trước khi sử dụng."},
  {id:"shopping",name:"Mua sắm trước giờ mở cửa",brand:"VINCOM",value:"Ưu đãi & nhân đôi điểm",required:1,detail:"Khung giờ mua sắm riêng và quyền xem trước bộ sưu tập tại thương hiệu tham gia; chương trình minh họa."},
  {id:"food",name:"Quà tặng cho ngày thường",brand:"WINMART",value:"Voucher 100.000đ",required:1,detail:"Voucher cho giỏ hàng từ 1.000.000đ, một lần mỗi tháng trong kịch bản minh họa."},
  {id:"stay",name:"Nhận phòng sớm, thong thả hơn",brand:"VINPEARL",value:"Giảm 15% phòng nghỉ",required:2,detail:"Giảm giá phòng và ưu tiên nhận phòng sớm khi còn phòng tại điểm đến tham gia."},
  {id:"wellness",name:"Một ngày chăm sóc bản thân",brand:"VINMEC",value:"Giảm 20% gói khám",required:2,detail:"Ưu đãi gói khám tổng quát và hỗ trợ chọn lịch hẹn cho bạn và gia đình."},
  {id:"ride",name:"Đón tiễn sân bay riêng",brand:"GREEN SM",value:"3 voucher 30.000đ",required:2,detail:"Hai lượt đón tiễn sân bay bằng xe điện mỗi năm; đặt trước theo lịch còn trống. Quyền lợi minh họa."},
  {id:"car",name:"Chăm xe tận nơi",brand:"VINFAST",value:"Giảm 15% bảo dưỡng",required:2,detail:"Nhận xe tại nhà, đưa xe đi bảo dưỡng và bàn giao lại theo lịch hẹn tại khu vực tham gia. Quyền lợi minh họa."},
  {id:"suite",name:"Một đêm trong hạng phòng suite",brand:"VINPEARL",value:"Nâng hạng suite",required:3,detail:"Đặc quyền Black: một đêm nghỉ suite mỗi năm tại resort tuyển chọn, đặt trước và tùy tình trạng phòng. Quyền lợi minh họa."},
  {id:"concierge",name:"Concierge riêng, mọi lúc",brand:"VINCLUB",value:"Trợ lý riêng 24/7",required:3,detail:"Đặc quyền Black: hỗ trợ riêng cho đặt chỗ, hành trình và trải nghiệm trong hệ sinh thái."},
  {id:"events",name:"Phòng chờ thương gia",brand:"VINCLUB",value:"Phòng chờ sân bay",required:3,detail:"Đặc quyền Black: trải nghiệm phòng chờ thương gia tại sân bay tham gia; lượt sử dụng và điều kiện là minh họa."},
  {id:"dining",name:"Bàn riêng cho một buổi tối đặc biệt",brand:"VINPEARL",value:"Trải nghiệm ẩm thực",required:2,detail:"Ưu tiên giữ bàn và tặng món chào đón tại nhà hàng tham gia; đặt trước. Quyền lợi minh họa."},
  {id:"birthday",name:"Sinh nhật theo cách của bạn",brand:"VINCLUB",value:"Quà sinh nhật",required:2,detail:"Chọn quà sinh nhật từ bữa tối, spa hoặc voucher nghỉ dưỡng trong danh mục minh họa."},
  {id:"private",name:"Lời mời dành riêng cho bạn",brand:"VINCLUB",value:"Trải nghiệm giới hạn",required:3,detail:"Đặc quyền Black: lời mời đến buổi ra mắt, đêm nhạc và sự kiện riêng theo chương trình minh họa."},
];

export function Membership({ source, points, onClose, onVoucher, savedVouchers }: { source: HTMLButtonElement | null; points: number; onClose: () => void; onVoucher: (voucher: Voucher) => void; savedVouchers: string[] }) {
  const [tab, setTab] = useState("membership");
  const [selected, setSelected] = useState(2);
  const [activeBenefit, setActiveBenefit] = useState<string|null>(null);
  const root = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const closeAction = useRef<() => void>(() => {});
  const tier = tiers[selected];
  useLayoutEffect(() => {
    const node = root.current;
    const target = card.current;
    if (!node || !target) return;
    const openingTarget = target.getBoundingClientRect();
    const previous = document.activeElement as HTMLElement | null;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animations: Animation[] = [];
    let closed = false;
    let flight: HTMLDivElement | null = null;
    const animate = (element: Element, frames: Keyframe[], duration: number, delay = 0) => {
      const animation = element.animate(frames, {duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, easing: "cubic-bezier(.22,1,.36,1)", fill: "both"});
      animations.push(animation);
      return animation;
    };
    const makeFlight = () => {
      if (!source) return null;
      const wrapper = document.createElement("div");
      wrapper.className = "ds-shell ds-membership-flight";
      const clone = source.cloneNode(true) as HTMLButtonElement;
      clone.removeAttribute("id");
      clone.tabIndex = -1;
      clone.setAttribute("aria-hidden", "true");
      const originalCanvases = source.querySelectorAll("canvas");
      clone.querySelectorAll("canvas").forEach((canvas, index) => {
        const original = originalCanvases[index];
        if (!original) return;
        canvas.width = original.width; canvas.height = original.height;
        canvas.getContext("2d")?.drawImage(original, 0, 0);
      });
      clone.querySelectorAll("video").forEach(video => {
        if (video.classList.contains("vc-card-light-video")) { video.currentTime=0; void video.play().catch(()=>{}); return; }
        const poster = document.createElement("img");
        poster.src = video.poster;
        poster.alt = "";
        video.replaceWith(poster);
      });
      wrapper.append(clone);
      node.append(wrapper);
      return wrapper;
    };
    const fly = (reverse: boolean) => {
      if (!source || reduced) return null;
      const from = source.getBoundingClientRect();
      const measured = target.getBoundingClientRect();
      const to = measured.height ? measured : openingTarget;
      flight?.remove();
      flight = makeFlight();
      if (!flight) return null;
      Object.assign(flight.style, {left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px`});
      const destination = `translate(${to.left-from.left}px, ${to.top-from.top}px) scale(${to.width/from.width}, ${to.height/from.height})`;
      return animate(flight, reverse ? [{transform:destination}, {transform:"none"}] : [{transform:"none"}, {transform:destination}], reverse ? 480 : 600);
    };
    const contents = Array.from(node.children).filter(child => child !== flight && child !== node.querySelector(".ds-membership-scroll"));
    source?.style.setProperty("visibility", "hidden");
    target.style.visibility = "hidden";
    animate(node, [{opacity:0}, {opacity:1}], 180);
    contents.forEach(child => animate(child, [{opacity:0}, {opacity:1}], 180, 100));
    const scroll = node.querySelector(".ds-membership-scroll")!;
    Array.from(scroll.children).forEach((section, index) => {
      if (index === 0) return;
      animate(section, [{opacity:0, transform:"translateY(12px)"}, {opacity:1, transform:"none"}], 220, 140);
    });
    const opening = fly(false);
    const reveal = () => {
      if (closed) return;
      target.style.visibility = "visible";
      if (flight) {
        const fade = animate(flight, [{opacity:1}, {opacity:0}], 180);
        fade.onfinish = () => { flight?.remove(); flight = null; };
      }
    };
    if (opening) opening.onfinish = reveal; else reveal();
    closeAction.current = () => {
      if (closed) return;
      closed = true;
      animations.forEach(animation => animation.cancel());
      target.style.visibility = "hidden";
      contents.forEach(child => animate(child, [{opacity:1}, {opacity:0}], 120));
      animate(scroll, [{opacity:1}, {opacity:0}], 180);
      const returning = fly(true);
      const fading = animate(node, [{opacity:1}, {opacity:0}], 140, 140);
      (returning ?? fading).onfinish = onClose;
    };
    const controls = () => Array.from(node.querySelectorAll<HTMLButtonElement>("button:not(:disabled):not([aria-hidden])")).filter(button => button.getClientRects().length > 0);
    controls()[0]?.focus({preventScroll:true});
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAction.current();
      if (event.key !== "Tab") return;
      const buttons = controls();
      if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons.at(-1)?.focus(); }
      else if (!event.shiftKey && document.activeElement === buttons.at(-1)) { event.preventDefault(); buttons[0]?.focus(); }
    };
    node.addEventListener("keydown", key);
    return () => {
      closed = true;
      animations.forEach(animation => animation.cancel());
      flight?.remove();
      source?.style.removeProperty("visibility");
      node.removeEventListener("keydown", key);
      previous?.focus({preventScroll:true});
    };
  }, [source, onClose]);
  return <div ref={root} className="ds-membership" role="dialog" aria-modal="true" aria-label="Thẻ hội viên">
    <Header title="Thẻ hội viên" leading={<Button variant="secondary" size="32" aria-label="Quay lại Home" onClick={() => closeAction.current()}><ChevronLeft size={20}/></Button>}/>
    <div className="ds-membership-scroll">
      <section className="px-[22px]" aria-label="Số dư VPoint">
        <h2 className="pt-[24px] pb-[12px] text-sm text-foreground-secondary font-normal">VPoint của bạn</h2>
        <p className="ds-membership-balance"><span className="ds-vpoint-logo" aria-hidden="true"/><span>{points.toLocaleString("vi-VN")}</span><span className="text-sm text-foreground-secondary">VPoint</span></p>
      </section>
      <Tabs value={tab} onValueChange={setTab} className="ds-member-tabs gap-0">
        <div className="px-[22px] pt-[24px] pb-[12px]">
          <TabsList variant="line" className="ds-member-tablist w-full text-foreground-secondary" aria-label="Thông tin hội viên">
            <TabsTrigger value="membership" className="rounded-8 border-0 text-foreground-secondary">Hạng thành viên</TabsTrigger>
            <TabsTrigger value="vpoint" className="rounded-8 border-0 text-foreground-secondary">VPoint</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="membership" forceMount className="ds-member-pane">
          <section className="px-[22px]" aria-label="Thẻ và hạng hội viên">
            <div ref={card} className="ds-membership-card rounded-14"><MembershipVisual tier={tier.visual} revealDelay={660} interactive/><div className="ds-membership-card-copy"><span className="ds-serif">VinClub {tier.name}</span><small>Hạng hiện tại · Elite</small></div><div className="ds-member-card-progress"><div className="flex items-center justify-between text-xs"><span>Tiến trình lên Black</span><strong>42%</strong></div><progress className="ds-member-progress" value={42} max={100} aria-label="Tiến trình lên hạng Black">42%</progress><p>Elite là hạng hiện tại · Tiến trình minh họa</p></div></div>
            <nav className="ds-membership-tiers" aria-label="Hạng thành viên">{tiers.map((item, index) => <Button key={item.name} variant="secondary" size="32" aria-pressed={index === selected} onClick={() => {setSelected(index);setActiveBenefit(null);}}><Image src={`/vinclub-assets/cards/${item.visual}.png`} width={48} height={30} alt=""/><span>{item.name}</span><small>{index===2?"Hiện tại":index<2?"Đã đạt":"Tiếp theo"}</small></Button>)}</nav>
          </section>
          <section className="px-[22px]">
            <h2 className="pt-[24px] pb-[12px] text-base font-semibold">Đặc quyền {tier.name}</h2>
            {privileges.map(benefit => {
              const unlocked=selected>=benefit.required&&benefit.required<=2;
              const expanded=activeBenefit===benefit.id;
              return <div key={benefit.id} className="ds-member-privilege">
                <Button variant="secondary" className="ds-member-privilege-button" aria-expanded={expanded} onClick={()=>setActiveBenefit(expanded?null:benefit.id)}>
                  <Image src={`/vinclub-assets/membership/${unlocked?tier.tone+"-check":"silver-lock"}.webp`} width={20} height={20} alt={unlocked?"Đã mở khóa":"Chưa mở khóa"}/>
                  <span className="ds-member-privilege-copy"><strong>{benefit.name}</strong></span>
                </Button>
                {expanded&&<div className="ds-member-privilege-detail rounded-14 bg-secondary"><p className="text-xs font-semibold">{unlocked?"Đặc quyền đã mở khóa":`Mở khóa ở hạng ${tiers[benefit.required].name}`}</p><p className="text-xs text-foreground-secondary mt-[4px]">{benefit.detail}</p></div>}
              </div>;
            })}
          </section>
        </TabsContent>
        <TabsContent value="vpoint" className="ds-member-pane">
          <section className="px-[22px]">
            <h2 className="pt-[24px] pb-[12px] text-base font-semibold">Làm sao để tăng VPoint?</h2>
            <ItemListItem label="Mua sắm & dùng dịch vụ" sublabel="Tích điểm tại đối tác tham gia trong hệ sinh thái Vin." className="ds-vpoint-guide"/>
            <ItemListItem label="Chọn ưu đãi tích thêm điểm" sublabel="Khám phá chương trình nhân đôi VPoint và kiểm tra điều kiện trước khi dùng." className="ds-vpoint-guide"/>
            <p className="text-xs text-foreground-secondary mt-[8px]">Mức tích và thời điểm cộng điểm tùy chương trình.</p>
          </section>
          <section className="px-[22px]">
            <h2 className="pt-[24px] pb-[12px] text-base font-semibold">VPoint dùng để làm gì?</h2>
            <ItemListItem label="Đổi ưu đãi & trải nghiệm" sublabel="Dành điểm cho voucher mua sắm, nghỉ dưỡng và dịch vụ có hỗ trợ đổi điểm." className="ds-vpoint-guide"/>
            <ItemListItem label="Sử dụng tại đối tác" sublabel="Kiểm tra nơi chấp nhận VPoint và điều kiện của từng ưu đãi." className="ds-vpoint-guide"/>
            <p className="text-xs text-foreground-secondary mt-[8px]">VPoint sử dụng và tiến trình lên hạng được theo dõi riêng.</p>
          </section>
        </TabsContent>
      </Tabs>
      <section className="px-[22px] ds-member-offers">
        <h2 className="pt-[24px] pb-[12px] text-base font-semibold">{tab === "vpoint" ? "Tích thêm điểm & khám phá ưu đãi" : "Ưu đãi dành cho bạn"}</h2>
        <OfferGrid offers={vouchers.filter(v=>tab === "vpoint" ? ["vincom-offer","winmart-offer"].includes(v.id) : ["vinpearl-offer","vinmec-offer"].includes(v.id))} savedVouchers={savedVouchers} onVoucher={onVoucher}/>
        <p className="text-xs text-foreground-secondary pt-[24px] pb-[12px]">Quyền lợi minh họa · Điều kiện áp dụng theo đối tác.</p>
      </section>
    </div>
    <FixedBottom className="relative inset-auto border-0 shadow-none pb-[8px]"><div className="w-[139px] h-[5px] bg-foreground rounded-full mx-auto"/></FixedBottom>
  </div>;
}
