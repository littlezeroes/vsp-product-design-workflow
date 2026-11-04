"use client";

import { CORE_APP_ORIGIN, VINPAY_APP_ORIGIN } from "@/lib/app-origins";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { getSvgPath } from "figma-squircle";
import { HIERARCHIES } from "./hierarchy";
import { HOME_DIRECTIONS } from "./directions";
import { offerArt } from "./offer-art";
import { HomeStory } from "./home-story";
import { ArrowRight, Check, Gift, ChevronLeft, ChevronRight, Share2, Trophy } from "lucide-react";
import { DailyIcon } from "@/components/vinclub/daily-icons";
import { AnimatedNumber } from "@/components/vinclub/animated-number";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { illustrationAssets as art } from "@/app/vinclub-dualsurface/illustration-assets";

/* Homes that follow the layouts the user sent. Content is VinClub's; every figure is sample data. */
type Props = { tier: string; onPay: () => void; onMember?: () => void; productNames?: [string, string]; onProduct?: (index: number) => void; walletHome?: string; beforeProducts?: ReactNode; beforeExperiences?: ReactNode };
const BRANDS = [
  { n: "GreenSM", i: "car", c: "#2dccd3", v: "Hoàn 15%" }, { n: "WinMart", i: "grocery", c: "#c82032", v: "Giảm 10%" },
  { n: "Vinmec", i: "medical", c: "#0079a8", v: "Giảm 20%" }, { n: "Vinpearl", i: "hotel", c: "#a66c24", v: "Giảm 15%" }, { n: "VinWonders", i: "travel", c: "#763ba0", v: "Giảm 25%" },
];
const tone = (c: string) => ({ "--brand-tone": c }) as React.CSSProperties;

/* Stacked cards on top (after Y Pay), with four interchangeable lower parts. */
export const VOUCHERS = [
  { brand: "Vinmec", art: "vinmec", color: "#0079a8", icon: "medical", lead: "Giảm đến", value: "20%", note: "Gói khám" },
  { brand: "GreenSM", art: "xanhsm", color: "#2dccd3", icon: "car", lead: "Hoàn đến", value: "15%", note: "Mọi chuyến" },
  { brand: "WinMart", art: "winmart", color: "#c82032", icon: "grocery", lead: "Giảm đến", value: "10%", note: "Tối đa 100.000đ" },
  { brand: "Vinpearl", art: "vinpearl", color: "#a66c24", icon: "hotel", lead: "Giảm đến", value: "15%", note: "Phòng nghỉ" },
  { brand: "VinWonders", art: "vinwonders", color: "#763ba0", icon: "travel", lead: "Giảm đến", value: "25%", note: "Vé vào cổng" },
  { brand: "VinBus", art: "vinbus", color: "#208c4b", icon: "school", lead: "Hoàn đến", value: "30%", note: "Vé tháng" },
];
export const SKINS = [{ id: "matte", label: "Đen nhám" }, { id: "carbon", label: "Carbon" }, { id: "titan", label: "Titan đen" }, { id: "piano", label: "Gốm bóng" }];
/* Fixed: stacked wallets, products, vouchers, Dành cho bạn. Everything else is a numbered option. Sample data. */
export const SECTION_REVIEW: Record<string, string> = {
  header: "Hạng và điểm cùng mở Hội viên; cần phân cấp rõ, tránh lấn vùng ví.",
  wallet: "Ví đang chiếm nhiều chiều cao; thử mức thu gọn nhưng vẫn giữ số dư và nút Mở.",
  products: "Hai thẻ khá giống nhau; thử cách nhấn lợi ích và giảm khoảng trống icon.",
  vouchers: "Cuộn ngang che các voucher sau; thử lưới hoặc danh sách để dễ quét.",
  feed: "Ảnh và chữ trên ảnh cạnh tranh; thử hero, danh sách hoặc chữ ngoài ảnh.",
};
export const STACK_OPTIONS = [
  { key: "offerHeader", title: "Header thẻ ưu đãi", options: ["Tên PNL", "Icon nhỏ + PNL", "Tên PNL lớn", "PNL + mô tả ngắn", "PNL có vạch nhấn", "PNL trên nhãn", "Icon trong ô · tên bên dưới", "Nhãn ngành · tên thương hiệu", "Tên + mũi tên", "Nhãn đặc quyền hội viên", "Số thứ tự · editorial", "Dải header tương phản"] },
  { key: "giftTone", title: "Màu card · xem tổng thể", options: ["Champagne", "Vàng · đào", "Hồng · lavender", "Lavender · xanh băng", "Xanh băng · mint", "Mint · chanh", "Hoàng hôn", "Aurora", "Cầu vồng pastel", "Ngọc trai"] },
  { key: "giftCount", title: "Số lượng Quà tặng mỗi ngày", options: ["1 thẻ", "2 thẻ xếp chồng", "3 thẻ xếp chồng", "4 thẻ xếp chồng"] },
  { key: "header", title: "Header · Hội viên & điểm", options: ["Điểm lớn · hiện tại", "Chào và điểm cùng hàng", "Điểm vừa · gọn", "Điểm và nhãn tách hàng"] },
  { key: "wallet", title: "Ví · độ cao", options: ["Hiện tại", "Gọn hơn", "Cân bằng", "Số dư nổi bật"] },
  { key: "productCount", title: "Số dịch vụ · như VinPay", options: ["1 dịch vụ", "2 dịch vụ", "3 dịch vụ", "4 dịch vụ", "6 dịch vụ", "8 dịch vụ", "11 dịch vụ · Xem thêm"] },
  { key: "products", title: "Sản phẩm", options: ["Hai thẻ gọn", "Icon cạnh nội dung", "Lợi ích trước", "Hai hàng dễ đọc"] },
  { key: "vouchers", title: "Voucher", options: ["Cuộn ngang", "Lưới hai cột", "Danh sách ngang", "Thẻ rộng · có gợi ý cuộn"] },
  { key: "feed", title: "Dành cho bạn", options: ["Lưới ảnh", "Apple · vuốt ngang", "Danh sách gọn", "Chữ dưới ảnh"] },
  { key: "hook", title: "Lý do mở app", options: ["Thẻ cào", "Điểm danh 7 ngày", "Nhiệm vụ tuần", "Deal giờ trưa", "Sưu tập tem", "Giữ hạng", "Tổng kết tháng", "Vòng quay", "Hộp quà", "Chọn ưu đãi tuần", "Sắp hết hạn", "Rút thăm", "x5 VPoint hôm nay", "Mời bạn bè", "Không có"] },
  { key: "style", title: "Viền sáng chạy", options: ["Đa sắc", "Vàng", "Tỏa sáng", "Một vệt trắng", "Hai vệt đối nhau", "Chậm, kính đậm", "Nền trắng", "Vàng trên nền vàng"] },
  { key: "pos", title: "Vị trí khối đó", options: ["Dưới product", "Trên product", "Sau voucher"] },
];
function CheckIn() {
  const [done, setDone] = useState(false);
  return <section className="vs-block" aria-label="Điểm danh"><header><h2>Điểm danh</h2><span>Chuỗi {done ? 4 : 3} ngày</span></header><ol className="vs-days">{[10, 10, 20, 20, 30, 30, 100].map((v, i) => { const on = i < 3 || (done && i === 3); return <li key={i} data-on={on || undefined} data-today={(i === 3 && !done) || undefined}><i>{on ? <Check size={16} /> : `+${v}`}</i><small>{i === 6 ? "Quà lớn" : `Ngày ${i + 1}`}</small></li>; })}</ol><button type="button" className="vs-cta" disabled={done} onClick={() => setDone(true)}>{done ? "Mai quay lại nhé" : "Điểm danh nhận 20 VPoint"}</button></section>;
}
function Mission() {
  const [on, setOn] = useState([true, false, false]);
  const n = on.filter(Boolean).length;
  return <section className="vs-block" aria-label="Nhiệm vụ tuần"><header><h2>Nhiệm vụ tuần</h2><span>Còn 4 ngày</span></header><p>Xong {n}/3 việc, mở thẻ cào vàng</p><i className="vs-bar" aria-hidden><i style={{ width: `${n / 3 * 100}%` }} /></i>{["Đi 1 chuyến GreenSM", "Dùng 1 voucher WinMart", "Mua sắm tại Vincom"].map((t, i) => <button type="button" className="vs-task" key={t} aria-pressed={on[i]} onClick={() => setOn(list => list.map((v, at) => at === i ? !v : v))}><i>{on[i] && <Check size={14} />}</i>{t}</button>)}</section>;
}
function Deal() {
  const [claimed, setClaimed] = useState(false);
  const [left, setLeft] = useState(2 * 3600 + 14 * 60 + 33);
  useEffect(() => { const t = setInterval(() => setLeft(v => Math.max(0, v - 1)), 1000); return () => clearInterval(t); }, []);
  return <section className="vs-block vs-deal" aria-label="Deal giờ trưa"><header><h2>Deal giờ trưa</h2><span className="vs-clock">{[Math.floor(left / 3600), Math.floor(left / 60) % 60, left % 60].map((v, i) => <i key={i}>{String(v).padStart(2, "0")}</i>)}</span></header><div className="vs-deal-row"><DailyIcon name="grocery" size={56} /><span><small>WinMart · Còn 120 suất</small><strong>Giảm 50% đơn đầu tiên</strong></span><Button variant="secondary" size="32" className="vs-hook-action" onClick={() => setClaimed(true)} disabled={claimed}>{claimed ? "Đã lưu" : "Lấy"}</Button></div></section>;
}
function Stamps() {
  const items = [["GreenSM", "car", 1], ["WinMart", "grocery", 1], ["Vincom", "shopping", 1], ["Vinmec", "medical", 1], ["Vinpearl", "hotel", 0], ["VinWonders", "travel", 0], ["Vinschool", "school", 0]] as const;
  return <section className="vs-block vs-stamp-card" aria-label="Sưu tập tem"><header><h2>Sưu tập tem</h2><span>4/7</span></header><p>Dùng đủ 7 thương hiệu, nhận kỳ nghỉ mẫu</p><div className="vs-stamps">{items.map(([n, icon, on]) => <button type="button" key={n} data-on={on || undefined}><DailyIcon name={icon} size={36} /><small>{n}</small></button>)}</div></section>;
}
const KeepTier = () => <section className="vs-block" aria-label="Giữ hạng"><header><h2>Giữ hạng Vàng</h2><span>Còn 60 ngày</span></header><p>Thêm 200 VPoint để giữ quyền lợi cả năm sau</p><i className="vs-bar" aria-hidden><i style={{ width: "86%" }} /></i><button type="button" className="vs-cta">Xem cách đạt</button></section>;
const Recap = () => <section className="vs-block" aria-label="Tổng kết tháng"><header><h2>Tháng 10 của bạn</h2><span>Chia sẻ</span></header><strong className="vs-big">420.000đ</strong><p>đã tiết kiệm, nhiều hơn tháng trước 80.000đ</p><span className="vs-bars" aria-hidden>{[40, 55, 35, 62, 68, 100].map((v, i) => <i key={i} style={{ height: `${v}%` }} />)}</span></section>;
const HOOK_NONE = 15;
function GiftBox() {
  const [open, setOpen] = useState(false);
  return <section className="vs-block vs-row" aria-label="Hộp quà"><i className="vs-gift" data-open={open || undefined} aria-hidden>{open ? "+50" : <Gift size={30} strokeWidth={1.4} />}</i><span><h2>{open ? "Bạn nhận 50 VPoint" : "Hộp quà hôm nay"}</h2><p>Mở mỗi ngày, ngày 7 quà lớn</p></span><button type="button" className="vs-pill" disabled={open} onClick={() => setOpen(true)}>{open ? "Đã mở" : "Mở"}</button></section>;
}
function WeekPick() {
  const [on, setOn] = useState<string[]>([]);
  return <section className="vs-block" aria-label="Chọn ưu đãi tuần"><header><h2>Chọn 3 ưu đãi tuần này</h2><span>{on.length}/3</span></header><div className="vs-picks">{VOUCHERS.slice(0, 6).map(item => { const active = on.includes(item.brand); return <button type="button" key={item.brand} aria-pressed={active} onClick={() => setOn(list => active ? list.filter(v => v !== item.brand) : list.length < 3 ? [...list, item.brand] : list)}><small>{item.brand}</small><b>{item.value}</b></button>; })}</div></section>;
}
const Expiring = () => <section className="vs-block vs-row" aria-label="Sắp hết hạn"><DailyIcon name="grocery" size={52} /><span><h2>120.000đ sắp mất</h2><p>Voucher WinMart, còn 2 ngày</p></span><button type="button" className="vs-pill">Dùng</button></section>;
function Draw() {
  const [n, setN] = useState(3);
  const [received, setReceived] = useState(false);
  return <section className="vs-block vs-row" aria-label="Rút thăm"><strong className="vs-count">{n}</strong><span><h2>Lượt rút kỳ nghỉ mẫu</h2><p>Quay số sau 29 ngày</p></span><Button variant="secondary" size="32" className="vs-hook-action" disabled={received} onClick={() => { setN(v => v + 1); setReceived(true); }}>{received ? "Đã nhận" : "+1 lượt"}</Button></section>;
}
const Boost = () => <section className="vs-block vs-row" aria-label="x5 VPoint"><strong className="vs-count">x5</strong><span><h2>VPoint tại WinMart</h2><p>Chỉ hôm nay, thường x1</p></span><button type="button" className="vs-pill">Xem</button></section>;
const Invite = () => <section className="vs-block vs-row" aria-label="Mời bạn bè"><strong className="vs-count">+500</strong><span><h2>Mời đồng nghiệp</h2><p>Cả hai cùng nhận VPoint</p></span><button type="button" className="vs-pill">Mời</button></section>;
export const HOOK_DETAILS: Record<number, { reward: string; condition: string; time: string; next: string }> = {
  1: { reward: "", condition: "Cào lớp phủ để mở quà. Một lượt miễn phí mỗi ngày.", time: "Lượt mới bắt đầu vào ngày mai.", next: "Cào xong, card hiển thị trạng thái đã mở." },
  2: { reward: "20 VPoint hôm nay · 100 VPoint ngày 7", condition: "Điểm danh mỗi ngày để nối chuỗi. Mỗi ngày chỉ nhận một lần.", time: "Lượt mới bắt đầu lúc 00:00 ngày mai.", next: "Nhận xong, ô hôm nay được đánh dấu và nút chuyển sang đã nhận." },
  3: { reward: "Hoàn tất 3 việc, mở một thẻ cào", condition: "Đi một chuyến GreenSM, dùng voucher WinMart và mua sắm tại Vincom.", time: "Còn 4 ngày để hoàn tất tuần này.", next: "Theo dõi từng nhiệm vụ để biết việc tiếp theo cần làm." },
  4: { reward: "Giảm 50% · tối đa 100.000đ", condition: "Đơn WinMart đầu tiên từ 200.000đ. Mỗi hội viên nhận một mã.", time: "Nhận trước khi đồng hồ về 00:00; mã dùng trong ngày.", next: "Bấm Lấy để lưu mã, sau đó tìm trong Voucher của tôi ở tab Ưu đãi." },
  5: { reward: "Sưu tập đủ 7 tem, mở quà nghỉ dưỡng", condition: "Mỗi thương hiệu ghi nhận một tem từ giao dịch hợp lệ.", time: "4/7 tem đã có; còn Vinpearl, VinWonders và Vinschool.", next: "Chọn thương hiệu chưa có tem để xem trải nghiệm tiếp theo." },
  6: { reward: "", condition: "Cần thêm 200 VPoint đủ điều kiện xét hạng.", time: "Còn 60 ngày trước kỳ xét hạng.", next: "Xem ưu đãi tích điểm từ mua sắm, di chuyển và nghỉ dưỡng." },
  7: { reward: "420.000đ đã tiết kiệm trong tháng", condition: "Tổng giá trị ưu đãi đã dùng; nhiều hơn tháng trước 80.000đ.", time: "Tổng kết tháng 10; cập nhật theo voucher đã sử dụng.", next: "Xem lại thương hiệu đã mang đến nhiều quyền lợi nhất." },
  9: { reward: "Mở hộp hôm nay, khám phá VPoint", condition: "Một hộp mỗi ngày. Duy trì đến ngày 7 để mở quà lớn.", time: "Hộp mới xuất hiện vào ngày tiếp theo.", next: "Mở xong, card hiển thị phần thưởng và trạng thái đã nhận." },
  10: { reward: "Tự chọn 3 ưu đãi phù hợp với bạn", condition: "Chọn tối đa 3 thương hiệu trong danh sách. Chạm lại để bỏ chọn.", time: "Lựa chọn áp dụng cho tuần này.", next: "Đủ 3 lựa chọn, bạn có một bộ ưu đãi riêng để bắt đầu tuần." },
  11: { reward: "Giữ lại 120.000đ ưu đãi chưa dùng", condition: "Voucher WinMart có trong ví; kiểm tra đơn tối thiểu trước khi dùng.", time: "Còn 2 ngày trước khi voucher hết hạn.", next: "Mở tab Ưu đãi để xem mã và điều kiện của voucher." },
  12: { reward: "3 lượt tham gia rút thăm kỳ nghỉ", condition: "Nhận thêm tối đa một lượt từ lượt ghé app mỗi ngày.", time: "Kỳ quay số diễn ra sau 29 ngày.", next: "Nhận lượt hôm nay xong, card khóa thao tác đến lượt tiếp theo." },
  13: { reward: "Tích VPoint x5 tại WinMart", condition: "Áp dụng cho giao dịch đủ điều kiện, thay mức tích thông thường x1.", time: "Ưu đãi áp dụng trong hôm nay.", next: "Kiểm tra điều kiện tích điểm trước khi thanh toán." },
  14: { reward: "Bạn và người được mời cùng nhận 500 VPoint", condition: "Người được mời đăng ký mới và hoàn tất giao dịch đầu tiên hợp lệ.", time: "Điểm được ghi nhận sau khi đủ điều kiện.", next: "Chia sẻ lời mời, sau đó theo dõi trạng thái người được giới thiệu." },
};
function HookBlock({ kind }: { kind: number }) {
  const content: Record<number, ReactNode> = { 1: <ScratchRow />, 2: <CheckIn />, 3: <Mission />, 4: <Deal />, 5: <Stamps />, 6: <KeepTier />, 7: <Recap />, 9: <GiftBox />, 10: <WeekPick />, 11: <Expiring />, 12: <Draw />, 13: <Boost />, 14: <Invite /> };
  if (!content[kind]) return null;
  return <div key={kind}>{content[kind]}</div>;
}
/* Mixed feed in App Store Today cards: label and big title over full-bleed art, action at the foot. Sample content. */
const FOR_YOU = [
  { s: "/vinclub-duo/foryou/vinfast-day-v1.png", k: "Trải nghiệm", badge: "HÀNH TRÌNH MỚI", t: "Lái thử VinFast", m: "VinFast · Xe điện", v: "Khám phá các dòng xe điện và lựa chọn trải nghiệm phù hợp với bạn." },
  { s: "/vinclub-duo/foryou/dao-ngoc-day-v1.png", k: "Nghỉ dưỡng", badge: "KỲ NGHỈ CỦA BẠN", t: "Đến với Đảo Ngọc", m: "Biển xanh · Nghỉ dưỡng", v: "Tìm cảm hứng cho kỳ nghỉ tiếp theo giữa biển xanh và thiên nhiên Đảo Ngọc." },
];
/* Category tabs, then two App Store style cards per row with the copy inside the photo. */
function ForYou({ layout = 2 }: { layout?: number }) {
  const [selected, setSelected] = useState<(typeof FOR_YOU)[number] | null>(null);
  const cards = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const nodes = Array.from(cards.current?.querySelectorAll<HTMLDivElement>(":scope > .vr-experience-card") ?? []);
    const draw = (node: HTMLDivElement) => {
      if (layout !== 2) { node.style.removeProperty("clip-path"); return; }
      const radius = parseFloat(getComputedStyle(node).getPropertyValue("--radius-28")) || 28;
      const path = getSvgPath({ width: node.clientWidth, height: node.clientHeight, cornerRadius: radius, cornerSmoothing: .6, preserveSmoothing: true });
      node.style.clipPath = `path("${path}")`;
      node.dataset.cornerSmoothing = "60%";
    };
    const observer = new ResizeObserver(entries => entries.forEach(entry => draw(entry.target as HTMLDivElement)));
    nodes.forEach(node => { draw(node); observer.observe(node); });
    return () => observer.disconnect();
  }, [layout]);
  return <section className="vr-fy" data-feed={layout} aria-label="Khám phá trải nghiệm">
    <h2>Khám phá trải nghiệm</h2>
    <div ref={cards} className="vr-today-cards vr-fy-grid">{FOR_YOU.map(item => <Card className="vr-experience-card rounded-28" data-artwork="daylight" key={item.t}>
      {/* eslint-disable-next-line @next/next/no-img-element */}<img src={item.s} alt="" />
      <span className="vr-tc-head"><small>{item.badge}</small><strong>{item.t}</strong></span>
      <div className="vr-tc-foot"><em>{item.m}</em><Button variant="secondary" size="32" className="vr-experience-cta" onClick={() => setSelected(item)}>{item.k === "Sự kiện" ? "Xem sự kiện" : item.k === "Tin mới" ? "Đọc tiếp" : item.t.includes("Voucher") ? "Xem ưu đãi" : "Khám phá"}</Button></div>
    </Card>)}</div>
    {selected && cards.current?.closest(".vk-phone") && createPortal(<div className="vr-experience-overlay"><BottomSheet open onClose={() => setSelected(null)}><div role="dialog" aria-modal="true" aria-label={selected.t}><div className="flex items-center justify-between gap-[12px] pt-[12px] pb-[12px]"><span className="text-sm text-foreground-secondary">{selected.k}</span><Button variant="secondary" size="32" onClick={() => setSelected(null)}>Đóng</Button></div><h2 className="pb-[12px] text-foreground">{selected.t}</h2><p className="pb-[12px] text-sm text-foreground-secondary">{selected.m} · {selected.badge}</p>{/* eslint-disable-next-line @next/next/no-img-element */}<img className="vr-experience-detail-image rounded-14" src={selected.s} alt="" /><p className="pt-[12px] pb-[12px] text-foreground">{selected.v}</p></div></BottomSheet></div>, cards.current.closest(".vk-phone")!)}
  </section>;
}
/* Product cards, then vouchers to swipe, then event tickets. */
/* A real scratch-off: silver foil on a canvas, wiped by finger or mouse; past 45% cleared the rest falls away. The button scratches for you. */
function ScratchRow() {
  const [won, setWon] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const autoFrame = useRef(0);
  const running = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const node = canvas.current, ctx = node?.getContext("2d");
    if (!node || !ctx) return;
    const ratio = window.devicePixelRatio || 1, w = node.clientWidth, h = node.clientHeight;
    node.width = w * ratio; node.height = h * ratio; ctx.scale(ratio, ratio);
    const css = getComputedStyle(node);
    const token = (name: string) => css.getPropertyValue(name).trim();
    const foil = ctx.createLinearGradient(0, 0, w, h * .45);
    [[0, "--color-grey-300"], [.24, "--color-grey-150"], [.48, "--color-grey-300"], [.72, "--color-grey-100"], [1, "--color-grey-300"]].forEach(([at, name]) => foil.addColorStop(at as number, token(name as string)));
    ctx.fillStyle = foil; ctx.fillRect(0, 0, w, h);
    // A simple diagonal security pattern reads as removable foil, rather than a button.
    ctx.strokeStyle = token("--color-grey-500"); ctx.globalAlpha = .1; ctx.lineWidth = .6;
    for (let x = -h; x < w + h; x += 12) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + h, h); ctx.stroke();
    }
    ctx.globalAlpha = .55; ctx.strokeStyle = token("--color-grey-00");
    for (let x = -h; x < w + h; x += 12) {
      ctx.beginPath(); ctx.moveTo(x + 1, 0); ctx.lineTo(x + h + 1, h); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    const x = w / 2, center = h / 2;
    ctx.strokeStyle = token("--color-grey-500"); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(x, center - 14, 11, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = token("--color-grey-600"); ctx.font = "600 13px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("₫", x, center - 14);
    ctx.font = "500 12px system-ui, sans-serif";
    ctx.fillText("Chạm để nhận quà", x, center + 16);
    ctx.globalCompositeOperation = "destination-out"; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = 28;
    return () => cancelAnimationFrame(autoFrame.current);
  }, []);
  const stroke = (x: number, y: number) => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const from = last.current ?? { x, y };
    ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(x + .01, y); ctx.stroke();
    last.current = { x, y };
  };
  const auto = () => {
    const node = canvas.current;
    if (!node || won || running.current) return;
    running.current = true;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setWon(true); return; }
    const w = node.clientWidth, h = node.clientHeight, start = performance.now(), rows = 5;
    last.current = null;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 650), p = t * rows, row = Math.floor(p), part = p - row;
      stroke(row % 2 ? w * (1 - part) : w * part, h * (Math.min(row, rows - 1) + .5) / rows);
      if (t < 1) autoFrame.current = requestAnimationFrame(tick); else { last.current = null; running.current = false; setWon(true); }
    };
    autoFrame.current = requestAnimationFrame(tick);
  };
  return <section className="vr-scratch-full" aria-label="Cào để nhận thưởng">
    <header><h2>Cào để nhận thưởng</h2></header>
    <span className="vr-scratch-card" data-won={won || undefined}><b>Quà đã mở</b><small>Hẹn bạn vào ngày mai</small>
      <canvas ref={canvas} role="button" tabIndex={won ? -1 : 0} aria-label="Chạm để nhận quà" aria-disabled={won} onPointerDown={auto} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); auto(); } }} /></span>
  </section>;
}
const PRODUCT_CASES = [
  { id: "saving", title: "Sinh lời", value: "Đến 5,7%/năm" },
  { id: "vay", title: "Vay nhanh", value: "Đến 50 triệu" },
  { id: "svc-bill", title: "Hóa đơn", value: "" },
  { id: "svc-phone", title: "Nạp ĐT", value: "" },
  { id: "svc-plug", title: "Điện", value: "" },
  { id: "tra-sau", title: "Trả sau", value: "" },
  { id: "svc-umbrella", title: "Bảo hiểm", value: "" },
  { id: "svc-gift", title: "Ưu đãi", value: "" },
  { id: "svc-card", title: "Thẻ", value: "" },
  { id: "svc-calculator", title: "Trả góp", value: "" },
  { id: "ung-luong", title: "Ứng lương", value: "" },
];
function ProductCases({ count, productNames, onProduct }: { count: number; productNames?: [string, string]; onProduct?: (index: number) => void }) {
  const [expanded, setExpanded] = useState(false);
  useEffect(() => setExpanded(false), [count]);
  const overflow = count > 8 && !expanded;
  const items = PRODUCT_CASES.slice(0, overflow ? 7 : count);
  return <section className="vr-vinpay-services" data-service-mode={count === 1 ? "row" : count === 2 ? "cards" : "grid"} aria-label="Sản phẩm">
    {items.map((item, index) => <Button variant="secondary" size="32" key={item.id} className="vr-service rounded-14" aria-label={count === 2 ? productNames?.[index] ?? `Product ${index + 1}` : item.title} onClick={onProduct ? () => onProduct(index) : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/ui-templates/sumeria/home/icons/${item.id}@1x.png`} alt="" width={44} height={44} /><span className="vr-service-copy"><small>{count === 2 ? productNames?.[index] ?? `Product ${index + 1}` : item.title}</small>{count <= 2 && <strong>{count === 2 ? index === 0 ? "Tích lũy linh hoạt" : "Chi tiêu linh hoạt" : item.value}</strong>}</span>
      {count === 1 && <span className="vr-service-cta">Khám phá<ChevronRight size={16} /></span>}
    </Button>)}
    {overflow && <Button variant="secondary" size="32" className="vr-service rounded-14" onClick={() => setExpanded(true)} aria-label={`Xem thêm ${count - 7} dịch vụ`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/ui-templates/sumeria/home/icons/xem-tat-ca@1x.png" width={44} height={44} alt="" /><span className="vr-service-copy"><small>Xem thêm</small></span>
    </Button>}
  </section>;
}
function TicketOutline() {
  const edgeId = useId();
  const svg = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ width: 346, height: 170 });
  useEffect(() => {
    const parent = svg.current?.parentElement;
    if (!parent) return;
    const update = () => setSize({ width: parent.clientWidth, height: parent.clientHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(parent);
    return () => observer.disconnect();
  }, []);
  const { width: w, height: h } = size;
  const e = 1, r = 14, n = 8, y = h * .65;
  const path = `M ${r} ${e} H ${w-r} Q ${w-e} ${e} ${w-e} ${r} V ${y-n} A ${n} ${n} 0 0 0 ${w-e} ${y+n} V ${h-r} Q ${w-e} ${h-e} ${w-r} ${h-e} H ${r} Q ${e} ${h-e} ${e} ${h-r} V ${y+n} A ${n} ${n} 0 0 0 ${e} ${y-n} V ${r} Q ${e} ${e} ${r} ${e} Z`;
  return <svg ref={svg} className="vr-ticket-outline" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id={edgeId} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="var(--color-orange-200)" /><stop offset="45%" stopColor="var(--color-blue-200)" /><stop offset="75%" stopColor="var(--color-red-200)" /><stop offset="100%" stopColor="var(--color-yellow-200)" /></linearGradient></defs><path d={path} stroke={`url(#${edgeId})`} /></svg>;
}
function GiftDeck({ kind, look, count = 3, tone = 2, above = false }: { kind: number; look: number; count?: number; tone?: number; above?: boolean }) {
  return <section className={`vr-daily-gifts${above ? " vr-daily-gifts-above" : ""}`} aria-label="Quà tặng mỗi ngày" data-gift-tone={tone}>
    <div className="vr-daily-deck" data-count={count}>
      {Array.from({ length: count - 1 }, (_, index) => count - 1 - index).map(level => <span key={level} className="vr-gift-backplate" data-level={level} aria-hidden="true" />)}
      <div className="vr-special" data-run={look}><TicketOutline /><span className="vr-hook-label">Quà tặng mỗi ngày</span><HookBlock kind={kind} /></div>
    </div>
  </section>;
}
function OfferCards({ header = 1, showStory = true, visual = 1 }: { header?: number; showStory?: boolean; visual?: number }) {
  return <div className="vr-offer-stories" role="group" aria-label="Dành cho bạn">
    {showStory && <HomeStory banner={`/vinclub-duo/stories/${HIERARCHIES[visual - 1]?.banner ?? HIERARCHIES[0].banner}`}><GiftDeck kind={1} look={3} count={1} tone={1} /></HomeStory>}
    {VOUCHERS.map(voucher => <Button variant="secondary" size="32" className="vr-offer-story rounded-28" key={voucher.brand} data-art={voucher.art} data-header={header} onClick={() => window.dispatchEvent(new Event("vinclub:offers"))} aria-label={`Xem ưu đãi ${voucher.brand}`}>
      <span className="vr-offer-pnl">
        {header === 8 && <small className="vr-offer-kicker">{voucher.note}</small>}
        {header === 10 && <small className="vr-offer-member"><Trophy size={10} aria-hidden />Dành cho hội viên</small>}
        {(header === 2 || header === 7) && <span className="vr-offer-mini-art" aria-hidden><img src={offerArt(voucher.art)} alt="" /></span>}
        <strong>{voucher.brand}</strong>
        {header === 4 && <small>Ưu đãi dành cho bạn</small>}
        {header === 9 && <ChevronRight size={16} className="vr-offer-header-arrow" aria-hidden />}
      </span>
      <span className="vr-offer-value"><small>{voucher.lead}</small><b>{voucher.value}</b><small>{voucher.note}</small></span>
      <span className="vr-offer-art" aria-hidden><img src={offerArt(voucher.art)} width={88} height={88} alt="" /></span>
    </Button>)}
  </div>;
}
function VoucherLower({ opts, productNames, onProduct, beforeProducts, beforeExperiences }: { opts?: Record<string, number>; productNames?: [string, string]; onProduct?: (index: number) => void; beforeProducts?: ReactNode; beforeExperiences?: ReactNode }) {
  return <div className="vr-mix" data-products={opts?.products ?? 3} data-vouchers={opts?.vouchers ?? 1}>
    {beforeProducts}
    <ProductCases count={[1, 2, 3, 4, 6, 8, 11][(opts?.productCount ?? 2) - 1]} productNames={productNames} onProduct={onProduct} />
    <div className="vr-offers-section-head"><h2>Dành cho bạn</h2><Button variant="secondary" size="32" className="vr-offers-view-all" onClick={() => window.dispatchEvent(new Event("vinclub:offers"))}>Xem tất cả<ChevronRight size={14} aria-hidden="true" /></Button></div>
    <OfferCards header={opts?.offerHeader ?? 1} showStory={opts?.story !== 2} visual={opts?.hierarchy ?? 1} />
    {beforeExperiences}
    <ForYou layout={opts?.feed ?? 2} />
  </div>;
}
const VINPAY_HOME = `${VINPAY_APP_ORIGIN}/ui-templates/sumeria/vsp?host=vinclub&embedded=1&miniApp=vinpay`;
const MY_VOUCHERS = [{ i: "grocery", t: "Giảm 100.000đ", m: "WinMart · Còn 2 ngày" }, { i: "hotel", t: "Giảm 15% phòng nghỉ", m: "Vinpearl · Còn 30 ngày" }, { i: "car", t: "Hoàn 15% chuyến đi", m: "GreenSM · Còn 12 ngày" }];
type Pouch = "wallet" | "voucher";
const POUCHES = [{ kind: "wallet" as const, label: "Ví VinClub", value: "28.650.000 ₫", metal: "front" }, { kind: "voucher" as const, label: "Voucher của tôi", value: "2 sắp hết hạn", metal: "back" }];
const Pouch = ({ item, inactive = false }: { item: typeof POUCHES[number]; inactive?: boolean }) => <><span className="vr-pouch-card" data-metal={item.metal}><small>{item.label}</small><strong>{item.value}</strong></span><span className="vr-pouch-cover" aria-hidden>{item.kind === "wallet" && <i className="vr-pouch-stitch" aria-hidden="true" />}<small>{item.label}</small><strong>{item.value}</strong><i className="vr-pouch-snap"><i className="vr-snap-logo" /><b>{inactive ? "Kích hoạt ví" : "Xem chi tiết"}</b></i></span></>;
const TIER_ART: Record<string, string> = { "Bạc": "bac", "Vàng": "vang", "Bạch Kim": "bachkim", "Nhân viên": "nhanvien" };
/*
 * Wallets are the same size and final position as the wallet on the inner screen (346 by 237, 22 from the left, 106 from the top).
 * Tap: the inner screen fades in behind a copy of the cover, which lands on the inner wallet and swings open onto it, so there is no second wallet to crossfade.
 * Mount the wallet frame on each open so returning always starts at VinPay Home.
 */
function WalletInside({ open, skin, onClose, fresh = false, homeUrl = VINPAY_HOME }: { homeUrl?: string; fresh?: boolean; open: { kind: Pouch; top: number } | null; skin: string; onClose: () => void }) {
  const walletFrame = useRef<HTMLIFrameElement>(null);
  const [phone, setPhone] = useState<Element | null>(null);
  const [mode, setMode] = useState("light");
  useEffect(() => {
    const phoneNode = document.querySelector(".vk-phone");
    setPhone(phoneNode);
    const host = phoneNode?.closest("[data-mode]");
    if (!host) return;
    const sync = () => setMode(host.getAttribute("data-mode") === "dark" ? "dark" : "light");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(host, { attributes: true, attributeFilter: ["data-mode"] });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== new URL(homeUrl).origin || event.source !== walletFrame.current?.contentWindow) return;
      if (event.data?.type === "mini-app:close") onClose();
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [onClose, homeUrl]);
  if (!phone) return null;
  const item = POUCHES.find(entry => entry.kind === open?.kind);
  return createPortal(<div className="vr-open" data-open={open?.kind} role={open ? "dialog" : undefined} aria-modal={open ? true : undefined} aria-hidden={!open || undefined} aria-label={item?.label}>
    {open?.kind === "wallet" && <iframe ref={walletFrame} className="vr-open-frame" src={`${homeUrl}&mode=${mode}${fresh ? "&state=new" : ""}`} title="Home ví" />}
    {open?.kind === "voucher" && <div className="vr-open-voucher"><h1>Voucher của tôi</h1><span className="vr-pouch vr-pouch-static" data-kind="voucher"><span className="vr-pouch-card" data-metal="back"><small>Voucher của tôi</small><strong>2 sắp hết hạn</strong></span></span>{MY_VOUCHERS.map(entry => <button type="button" className="vr-row" key={entry.t}><DailyIcon name={entry.i} size={40} /><span><strong>{entry.t}</strong><em>{entry.m}</em></span><b>Dùng</b></button>)}</div>}
    {open && item && <span className="vr-pouch vr-fly" data-skin={skin} data-kind={item.kind} aria-hidden style={{ "--from": `${open.top}px` } as React.CSSProperties}><span className="vr-pouch-cover" aria-hidden>{item.kind === "wallet" && <i className="vr-pouch-stitch" aria-hidden="true" />}<small>{item.label}</small><strong>{item.value}</strong><i className="vr-pouch-snap"><i className="vr-snap-logo" /><b>Xem chi tiết</b></i></span></span>}
    {open?.kind === "voucher" && <Button variant="secondary" size="32" className="vr-open-back" aria-label="Đóng ví" onClick={onClose}><ChevronLeft size={24} aria-hidden="true" /></Button>}
  </div>, phone);
}
function WalletActivation({ open, onClose, onComplete }: { open: boolean; onClose: () => void; onComplete: () => void }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [phone, setPhone] = useState<Element | null>(null);
  useEffect(() => { setPhone(document.querySelector(".vk-phone")); }, []);
  useEffect(() => {
    if (!open) return;
    const receive = (event: MessageEvent) => {
      if (event.origin !== CORE_APP_ORIGIN || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "vsp-activation-complete") onComplete();
      if (event.data?.type === "vsp-activation-close") onClose();
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [open, onClose, onComplete]);
  if (!open || !phone) return null;
  const theme = phone.closest("[data-mode]")?.getAttribute("data-mode") ?? "light";
  return createPortal(<section className="vr-wallet-activation" role="dialog" aria-modal="true" aria-label="Kích hoạt ví"><iframe ref={frame} referrerPolicy="origin" title="Kích hoạt ví V-Smart" src={`${CORE_APP_ORIGIN}/driver-care/activate?lv=l0&embedded=1&wallet=1&hostCanvas=sumeria&from=h4&theme=${theme}&brand=vsp`} /></section>, phone);
}
/* Ưu đãi tab: same frame as Home, black ground with the glass voucher wallet, a light sheet rising over it. Sample data. */
const MINE_VOUCHERS = [
  { art: "winmart", brand: "WinMart", c: "#c82032", v: "Giảm 100.000đ", m: "Đơn từ 500.000đ", left: "Còn 2 ngày", soon: true },
  { art: "xanhsm", brand: "GreenSM", c: "#2dccd3", v: "Hoàn 15%", m: "Tối đa 50.000đ", left: "Còn 2 ngày", soon: true },
  { art: "vinpearl", brand: "Vinpearl", c: "#a66c24", v: "Giảm 15%", m: "Phòng nghỉ", left: "Còn 30 ngày", soon: false },
  { art: "vinmec", brand: "Vinmec", c: "#0079a8", v: "Giảm 20%", m: "Gói khám", left: "Còn 45 ngày", soon: false },
];
const REDEEM = [{ art: "vinwonders", brand: "VinWonders", c: "#763ba0", t: "Vé vào cổng -25%", cost: 3000 }, { art: "vinbus", brand: "VinBus", c: "#208c4b", t: "Vé tháng -30%", cost: 800 }, { art: "winmart", brand: "WinMart", c: "#c82032", t: "Voucher 50.000đ", cost: 5000 }, { art: "vinpearl", brand: "Vinpearl", c: "#a66c24", t: "Đêm nghỉ -40%", cost: 20000 }];
const voucherArt = (art: string) => ({ src: `/vinclub-duo/voucher/${art}@2x.png`, srcSet: `/vinclub-duo/voucher/${art}@2x.png 2x, /vinclub-duo/voucher/${art}@3x.png 3x` });
export function OffersPage(_props: { opts?: Record<string, number> }) {
  const [used, setUsed] = useState<string[]>([]);
  const POINTS = 12450;
  const list = MINE_VOUCHERS.filter(item => item.soon);
  return <div className="vr-stack vo-page">
    <header className="vo-head"><div className="vo-heading"><h1>Ưu đãi</h1></div>
      <div className="vo-wallet vo-wallet-split"><div><small>VPoint khả dụng</small><strong>{POINTS.toLocaleString("vi-VN")} <span className="vo-wallet-unit">VPoint</span></strong></div><span className="vo-wallet-divider" aria-hidden="true" /><div><small>Ưu đãi của tôi</small><strong>{MINE_VOUCHERS.length} <span className="vo-wallet-unit">ưu đãi</span></strong></div></div>
    </header>
    <div className="vo-sheet">
      <span className="vo-grip" aria-hidden />
      <div className="vo-title"><h2>Sắp hết hạn</h2></div>
      <section className="vo-list vo-expiring-rail" aria-label="Sắp hết hạn">{list.map(item => { const on = used.includes(item.brand); return <article key={item.brand} className="vo-ticket" style={tone(item.c)}><span className="vo-stub">{/* eslint-disable-next-line @next/next/no-img-element */}<img {...voucherArt(item.art)} alt="" width={64} height={64} /></span><span className="vo-body"><small>{item.brand}</small><strong>{item.v}</strong><em data-soon={item.soon || undefined}>{item.m} · {item.left}</em></span><button type="button" disabled={on} onClick={() => setUsed(all => [...all, item.brand])}>{on ? "Đã dùng" : "Dùng"}</button></article>; })}</section>
      <div className="vo-title"><h2>Ưu đãi dành cho bạn</h2></div>
      <section className="vo-redeem" aria-label="Ưu đãi dành cho bạn">{REDEEM.map(item => { const can = POINTS >= item.cost; return <button type="button" key={item.t} style={tone(item.c)}>{/* eslint-disable-next-line @next/next/no-img-element */}<img {...voucherArt(item.art)} alt="" width={72} height={72} /><small>{item.brand}</small><strong>{item.t}</strong>{can ? <b>{item.cost.toLocaleString("vi-VN")} VPoint</b> : <span className="vo-need"><i style={{ width: `${POINTS / item.cost * 100}%` }} /><em>Thiếu {(item.cost - POINTS).toLocaleString("vi-VN")}</em></span>}</button>; })}</section>
    </div>
  </div>;
}
export function StackHome({ tier, onMember, onPay, opts, onOption, productNames, onProduct, walletHome, beforeProducts, beforeExperiences }: Props & { opts?: Record<string, number>; onOption?: (key: string, value: number) => void }) {
  const [open, setOpen] = useState<{ kind: Pouch; top: number } | null>(null);
  const tap = (kind: Pouch, node: HTMLElement) => { if (!open) setOpen({ kind, top: node.getBoundingClientRect().top - node.closest(".vk-phone")!.getBoundingClientRect().top }); };
  const inactive = opts?.walletState === 2;
  const [activationOpen, setActivationOpen] = useState(false);
  const art = TIER_ART[tier] ?? "vang";
  const tag = <Button variant="secondary" size="32" className="vr-tier-metal vr-member-subtle" data-tier={tier} aria-label={`Hạng ${tier}, xem tiến trình`} onClick={onMember}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={`/vinclub-duo/tier/${art}@1x.png`} srcSet={`/vinclub-duo/tier/${art}@2x.png 2x, /vinclub-duo/tier/${art}@3x.png 3x`} alt="" width={24} height={24} /><span className="vr-member-text"><span>{tier === "Nhân viên" ? "Nhân viên tập đoàn" : tier}</span><small>Xem tiến trình</small></span><ChevronRight size={16} /></Button>;
  const skinId = (opts?.hierarchy ?? 1) > 1 ? HIERARCHIES[(opts?.hierarchy ?? 1) - 1]?.skin ?? "matte" : HOME_DIRECTIONS.find(item => item.id === opts?.direction)?.skin ?? SKINS[1].id;
  const header = opts?.vinclubState === 2 ? <header className="vr-brand vr-hello vc-inactive-header"><small>Xin chào, Minh</small><h1>Chào mừng đến VinClub</h1><p>Kích hoạt hội viên để tích VPoint và nhận đặc quyền dành cho bạn.</p><Button variant="secondary" size="32" className="vc-join-cta" onClick={onMember}>Kích hoạt VinClub<ChevronRight size={16} /></Button></header> : <header className="vr-brand vr-hello vs-pts" data-header-layout={opts?.header ?? 1} data-member-layout="3">{tag}<small>Xin chào, Minh</small><button type="button" className="vs-pts-num" onClick={onMember}><strong><AnimatedNumber value={12450}/></strong> VPoint</button></header>;
  return <div className="vr-stack" data-wallet-state={opts?.walletState ?? 1} data-skin={skinId} data-wallet-layout={opts?.wallet ?? 2}>
    {header}
    <section className="vr-pouches" data-arrange="1" aria-label="Ví và voucher">{POUCHES.filter(item => item.kind === "wallet").map(item => <button type="button" className="vr-pouch" key={item.kind} data-kind={item.kind} aria-label={`Mở ${item.label}`} onClick={event => inactive ? setActivationOpen(true) : tap(item.kind, event.currentTarget)}><Pouch item={{ ...item, value: inactive ? "Chưa kích hoạt" : opts?.walletState === 3 ? "0 ₫" : item.value }} inactive={inactive} /></button>)}</section>
    <WalletActivation open={activationOpen} onClose={() => setActivationOpen(false)} onComplete={() => { onOption?.("walletState", 3); setActivationOpen(false); }} />
    <WalletInside open={open} skin={skinId} homeUrl={walletHome} fresh={opts?.walletState === 3} onClose={() => setOpen(null)} />
    <div className="vr-sheet">
      <VoucherLower opts={opts} productNames={productNames} onProduct={onProduct} beforeProducts={beforeProducts} beforeExperiences={beforeExperiences} />
    </div>
  </div>;
}

function CatalogParts({ onMember }: { onMember?: () => void }) {
  return <>
    <section className="vr-banner" aria-label="Ưu đãi nổi bật"><h2>Voucher 100.000đ đang chờ</h2><p>Khi đi chợ tại WinMart</p><button type="button">Xem voucher</button><DailyIcon name="grocery" size={112} /></section>
    <h2 className="vr-title">Thương hiệu</h2>
    <section className="vr-uneven" aria-label="Thương hiệu">{BRANDS.map(item => <button type="button" key={item.n}><span>{item.n}</span><DailyIcon name={item.i} size={72} /></button>)}<button type="button" onClick={onMember}><span>Tất cả</span><ArrowRight size={18} /></button></section>
  </>;
}

/* Parts catalog: big title with art and chips, gradient banner, uneven category grid. */
export function CatalogHome({ tier, onMember }: Props) {
  const [chip, setChip] = useState("Cho bạn");
  return <div className="vr-cat">
    <header><h1>Ưu đãi hệ sinh thái</h1><DailyIcon name="shopping" size={96} /></header>
    <div className="vr-chips">{["Cho bạn", `Hạng ${tier}`, "Nhân viên tập đoàn"].map(item => <button type="button" key={item} aria-pressed={chip === item} onClick={() => setChip(item)}>{item}</button>)}</div>
    <CatalogParts onMember={onMember} />
  </div>;
}

/* Award screen: the first thing on Home is a reward just earned. */
export function AwardHome({ onMember }: Props) {
  const [claimed, setClaimed] = useState(false);
  return <div className="vr-award">
    <small>Huy hiệu mới</small><h1>3 thương hiệu trong tháng</h1><em>01/11/2026</em>
    <i className="vr-badge" aria-hidden><Trophy size={84} strokeWidth={1.1} /></i>
    <p>{claimed ? "Đã cộng 200 VPoint vào tài khoản" : "Bạn đạt được vì đã dùng 3 thương hiệu Vin"}</p>
    <button type="button" className="vr-primary" disabled={claimed} onClick={() => setClaimed(true)}>{claimed ? "Đã nhận 200 VPoint" : "Nhận thưởng"}</button>
    <button type="button" className="vr-ghost" onClick={onMember}><Share2 size={18} />Chia sẻ</button>
  </div>;
}

/* Offer catalog card: large title, one action, an object with a price tag. */
export function OfferCardsHome({ tier, onMember }: Props) {
  const cards = [{ t: "Quyền lợi hạng " + tier, s: "Nhận thêm mỗi khi dùng dịch vụ trong hệ sinh thái", c: "Xem quyền lợi", i: "hotel", tag: "15%", k: "Giảm", b: "#a66c24" }, { t: "Voucher đi chợ tháng này", s: "Dùng được tại mọi cửa hàng WinMart", c: "Lấy voucher", i: "grocery", tag: "10%", k: "Giảm", b: "#c82032" }, { t: "Đi GreenSM, hoàn tiền về ví", s: "Áp dụng mọi chuyến trong tháng", c: "Xem chi tiết", i: "car", tag: "15%", k: "Hoàn", b: "#2dccd3" }];
  return <div className="vr-offer">{cards.map(item => <section key={item.t} style={tone(item.b)} aria-label={item.t}><h2>{item.t}</h2><p>{item.s}</p><button type="button" onClick={onMember}>{item.c}</button><div><DailyIcon name={item.i} size={140} /><span><small>{item.k}</small><b>{item.tag}</b></span></div></section>)}</div>;
}
