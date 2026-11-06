"use client";

import { useState } from "react";
import { SearchBar } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { DailyIcon } from "@/components/vinclub/daily-icons";
import { OfferGrid } from "./offer-grid";
import { vouchers, type Voucher } from "./my-space";

const categories = [
  { name: "Tất cả", icon: "travel", brands: [] },
  { name: "Mua sắm", icon: "shopping", brands: ["WINMART", "VINCOM"] },
  { name: "Nghỉ dưỡng", icon: "hotel", brands: ["VINPEARL"] },
  { name: "Sức khỏe", icon: "medical", brands: ["VINMEC"] },
  { name: "Di chuyển", icon: "car", brands: ["GREEN SM", "VINFAST", "V-GREEN"] },
];
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/gi, "d").toLowerCase();

export function OffersBrowser({ savedVouchers, onVoucher, initialSavedOnly = false }: { initialSavedOnly?: boolean; savedVouchers: string[]; onVoucher: (voucher: Voucher) => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [savedOnly, setSavedOnly] = useState(initialSavedOnly);
  const selected = categories.find(item => item.name === category)!;
  const offers = vouchers.filter(voucher => (!selected.brands.length || selected.brands.includes(voucher.brand)) && (!savedOnly || savedVouchers.includes(voucher.id)) && normalize(`${voucher.title} ${voucher.brand} ${voucher.description}`).includes(normalize(query.trim())));

  return <div className="ds-offers-browser ds-home-discovery">
    <section className="px-[22px] pt-[24px]" aria-label="Tìm và lọc ưu đãi">
      <SearchBar wrapperClassName="ds-offers-search" placeholder="Tìm ưu đãi, thương hiệu…" aria-label="Tìm ưu đãi" value={query} onChange={event => setQuery(event.target.value)}/>
      <nav className="ds-offers-categories" aria-label="Danh mục ưu đãi">{categories.map(item => <Button key={item.name} variant="secondary" size="32" aria-pressed={category === item.name} onClick={() => setCategory(item.name)}><DailyIcon name={item.icon} size={26}/>{item.name}</Button>)}</nav>
    </section>
    <section className="px-[22px]" aria-labelledby="offers-list-title">
      <div className="flex items-center justify-between gap-[12px] pt-[24px] pb-[12px]"><div><h2 id="offers-list-title" className="text-base font-semibold">{savedOnly ? "Ưu đãi đã lưu" : category === "Tất cả" ? "Dành cho bạn" : category}</h2><p className="text-xs text-foreground-secondary mt-[4px]" role="status">{offers.length} ưu đãi {query.trim() ? "phù hợp" : "đang có"}</p></div><Button variant="secondary" size="32" aria-pressed={savedOnly} onClick={() => setSavedOnly(value => !value)}>{savedOnly ? "Xem tất cả" : "Đã lưu"}</Button></div>
      {offers.length ? <OfferGrid offers={offers} savedVouchers={savedVouchers} onVoucher={onVoucher}/> : <div className="bg-secondary rounded-28 px-[22px] py-[24px]"><h3 className="text-base font-semibold">{savedOnly ? "Chưa có ưu đãi đã lưu" : "Chưa tìm thấy ưu đãi"}</h3><p className="text-sm text-foreground-secondary mt-[8px]">{savedOnly ? "Lưu ưu đãi bạn thích để xem lại tại đây." : "Thử từ khóa khác hoặc xem tất cả danh mục."}</p><Button variant="secondary" size="32" className="mt-[16px]" onClick={() => { setQuery(""); setCategory("Tất cả"); setSavedOnly(false); }}>Xem tất cả ưu đãi</Button></div>}
    </section>
  </div>;
}
