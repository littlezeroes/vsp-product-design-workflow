"use client";
import Image from "next/image";
import { illustrationAssets, type IllustrationName } from "./illustration-assets";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Voucher } from "./my-space";
import "./home-discovery.css";
const offerBanners: Record<string,IllustrationName> = { "vinpearl-offer": "escape", "winmart-offer": "winmart", "vincom-offer": "shopping", "vinmec-offer": "wellness", "ride-home": "ride", "shopping-home": "shopping", "maintenance": "ride", "charging": "ride", "resort": "escape" };
export function OfferGrid({offers,savedVouchers,onVoucher}:{offers:Voucher[];savedVouchers:string[];onVoucher:(voucher:Voucher)=>void}){return (<div className="ds-home-offers-grid">{offers.map(voucher => {
        const id = voucher.id;
        return <Card key={id} className="ds-home-offer rounded-28 border-0 p-0 overflow-hidden shadow-none gap-0 bg-secondary"><div className="ds-home-offer-art"><Image src={illustrationAssets[offerBanners[id] ?? "shopping"]} alt="" fill sizes="(max-width: 600px) 45vw, 240px"/><span className="ds-home-offer-brand rounded-8">{voucher.brand}</span></div><div className="ds-home-offer-copy"><h3 className="text-base font-semibold">{voucher.title}</h3><Button variant="secondary" size="32" className="ds-discovery-link" onClick={() => onVoucher(voucher)}>{savedVouchers.includes(id) ? "Đã lưu" : "Xem ưu đãi"}<ChevronRight size={14}/></Button></div></Card>;
      })}</div>);}
