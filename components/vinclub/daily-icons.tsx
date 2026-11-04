import Image from "next/image";
import inventory from "@/components/visuals/inventory.json";

const libraryIcons = Object.fromEntries(inventory.items.filter(item => item.scope === "vinclub" && item.type === "brand").map(item => [item.id, item.src]));
import "./daily-icons.css";

export const iconApproaches = [
  {id:0,name:"Glass Atelier",note:"Kính champagne + sứ kem + đồng xước · nghiêng 35°"},
  {id:1,name:"Resin Flow",note:"Resin ngà + kính amber · hình hữu cơ"},
  {id:2,name:"Stone Pavilion",note:"Travertine + kính mờ + gold · hình kiến trúc"},
  {id:3,name:"Satin Fold",note:"Satin kem + kính + kim loại · nếp gấp mềm"},
  {id:4,name:"Precision Alloy",note:"Nhôm champagne + enamel kem + kính · cơ khí nhẹ"},
  {id:5,name:"Opal Bloom",note:"Kính opal + ngọc trai + gold · khối phồng xếp lớp"},
  {id:6,name:"Amber Wire",note:"Ống đồng mảnh + kính amber + sứ · hình mở"},
  {id:7,name:"Ivory Mosaic",note:"Gốm men kem + kính champagne · khối ghép"},
  {id:8,name:"Crystal Cut",note:"Pha lê faceted + sứ ngà + vàng nhạt · cạnh cắt"},
  {id:9,name:"Paper Luxe",note:"Giấy kem ép + kính mờ + đồng · hình gấp nghiêng"},
];

export function DailyIcon({name,size=64,approach=1}:{name:string;size?:number;approach?:number}) {
  const libraryId = name === "medical" ? "vinclub-custom-medical" : name === "grocery" ? "vinclub-custom-grocery" : `vinclub-daily-${name}`;
  const src = (approach === 1 && libraryIcons[libraryId]) || (name === "medical" ? "/vinclub-assets/icons-custom/vinmec-stethoscope-v1.webp" : name === "grocery" ? "/vinclub-assets/icons-custom/winmart-grocery-v1.webp" : `/vinclub-assets/icons-v3/${approach}/${name}.webp?v=vin-red-2`);
  return <Image unoptimized loading="eager" data-approach={approach} className="daily-icon daily-icon-raster" src={src} width={size} height={size} alt="" />;
}

export function PaymentIcon({name,size=64,approach=1}:{name:string;size?:number;approach?:number}) {
  return <Image unoptimized loading="eager" data-approach={approach} data-icon-family="payment" className="daily-icon daily-icon-raster ds-payment-raster" src={(approach === 1 && libraryIcons[`vinclub-${["train","water","loan"].includes(name) ? "custom" : "payment"}-${name}`]) || (["train","water","loan"].includes(name) ? `/vinclub-assets/payment-custom/${name}-v1.webp` : `/vinclub-assets/payment-icons/${approach}/${name}.webp?v=vin-red-1`)} width={size} height={size} alt="" />;
}
