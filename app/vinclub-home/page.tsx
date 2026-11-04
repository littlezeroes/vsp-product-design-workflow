"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarDays, Crown, Home, Moon, QrCode, Sun, TicketPercent } from "lucide-react";
import "@/components/vinclub/home-skeleton.css";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TetGame } from "@/components/mini-app/tet-game";
import { VinPayMiniApp } from "@/components/mini-app/vinpay";
import { GlassLaunchPreview } from "@/app/brand-splash/glass-launch-preview";
import "@/app/brand-splash/glass-studies.css";
import { EventsPage } from "./events";
import { VinClubOnboarding } from "./vinclub-onboarding";
import { VinClubActivation, VINCLUB_ACTIVATION_DRAFT } from "./vinclub-activation";
import { RankMember } from "./rank/member";
import { Plan } from "./approaches-more";
import { APPROACHES as HOOK_APPROACHES, FIXED_LAYOUT, HookHome, LAYOUTS } from "./hooks";
import "./hooks.css";
import { OffersPage, HOOK_DETAILS, SECTION_REVIEW, STACK_OPTIONS } from "./ref-layouts";
import "./ref-layouts.css";
import "./approaches.css";
import "./approaches-more.css";
import "./vinclub-home.css";
import "./directions.css";
import "./brand-colors.css";
import "./hierarchy.css";
import { VinPayHeaderBackdrop } from "./vinpay-header-backdrop";
import { HIERARCHIES } from "./hierarchy";

/* One approach each, numbered like the Header visual menu on Home VinPay. */
const APPROACHES = [
  ...HOOK_APPROACHES.map(item => ({ id: item.id, name: item.name, hook: item.why, ref: item.refs.map(entry => entry.app).join(", ") })),
  { id: "plan", name: "Theo cấu trúc mới", hook: "Hạng, VPoint, ví; product; lên hạng; gợi ý", ref: "Cấu trúc của mày" },
];
/* Approach 10: every section has its own numbered options, like Header visual on Home VinPay. */
const SECTIONS = [
  { key: "top", title: "Top", hint: "Hạng, VPoint, ví", options: ["Da và thẻ", "Thẻ lớn", "Dải 3 cột", "Chữ lớn"] },
  { key: "promote", title: "Product", hint: "Số sản phẩm", options: ["1", "2", "3", "4"] },
  { key: "unlock", title: "Mở khóa hạng", hint: "Cách hiển thị", options: ["Danh sách việc", "Thẻ cuộn ngang", "Trước và sau khi lên hạng", "1 việc nên làm"] },
  { key: "suggest", title: "Gợi ý", hint: "Ưu đãi, sự kiện, tin", options: ["Chip và danh sách", "Chip và lưới 2 cột", "Poster cuộn ngang", "Thẻ lớn"] },
];
const CONFIRMED_STACK_OPTIONS: Record<string, number> = { header: 1, wallet: 2, products: 3, vouchers: 1, feed: 2, style: 3, pos: 1 };
const number = (id: string) => APPROACHES.findIndex(item => item.id === id) + 1;
const TIERS = ["Bạc", "Vàng", "Bạch Kim", "Nhân viên"];

function Choice({ label, options, value, onChange }: { label: string; options: { id: string; label: string }[]; value: string; onChange: (id: string) => void }) {
  return <div className="vk-control"><p>{label}</p><div role="group" aria-label={label}>{options.map(item => <button type="button" key={item.id} aria-pressed={value === item.id} onClick={() => onChange(item.id)}>{item.label}</button>)}</div></div>;
}

export default function VinClubHomePage() {
  const [ready, setReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [homeLoaded, setHomeLoaded] = useState(false);
  const [skeletonVisible, setSkeletonVisible] = useState(true);
  const finishSplash = useCallback(() => setShowSplash(false), []);
  const [miniApp, setMiniApp] = useState(false);
  const [membershipStage, setMembershipStage] = useState<"story" | "activation" | null>("story");
  const [gameOpen, setGameOpen] = useState(false);
  const gameTrigger = useRef<HTMLButtonElement>(null);
  const closeGame = useCallback(() => { setGameOpen(false); requestAnimationFrame(() => gameTrigger.current?.focus()); }, []);
  const payTrigger = useRef<HTMLButtonElement>(null);
  const closeMiniApp = useCallback(() => { setMiniApp(false); requestAnimationFrame(() => payTrigger.current?.focus()); }, []);
  const [mode, setMode] = useState("light");
  const [approach, setApproach] = useState("stack");
  const [tier, setTier] = useState("Vàng");
  const [embedded, setEmbedded] = useState(false);
  const [framed, setFramed] = useState(false);
  const [tab, setTab] = useState("home");
  const [layout, setLayout] = useState(1);
  const [picks, setPicks] = useState<Record<string, number>>({ top: 1, promote: 2, unlock: 1, suggest: 1, skin: 2, header: 1, wallet: 2, products: 3, productCount: 2, walletState: 1, hierarchy: 1, vinclubState: 1, story: 1, offerHeader: 1, giftCount: 3, giftTone: 2, direction: 0, vouchers: 1, feed: 2, style: 3, hook: 1, pos: 1 });
  const pick = (key: string, value: number) => { setPicks(current => ({ ...current, [key]: value })); const url = new URL(location.href); url.searchParams.set(key, String(value)); history.replaceState(null, "", url); };
  const set = (key: string, setter: (value: string) => void) => (value: string) => {
    setter(value);
    const url = new URL(location.href);
    if (value) url.searchParams.set(key, value); else url.searchParams.delete(key);
    history.replaceState(null, "", url);
  };
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    if ((q.get("tab") && q.get("tab") !== "home") || (window.parent !== window && q.get("launch") === "0")) setShowSplash(false);
    /* eslint-disable react-hooks/set-state-in-effect -- URL is only readable after mount */
    if (q.get("mode") === "dark") setMode("dark");
    if (APPROACHES.some(item => item.id === q.get("approach"))) setApproach(q.get("approach")!);
    if (TIERS.includes(q.get("tier") ?? "")) setTier(q.get("tier")!);
    setEmbedded(q.get("embedded") === "1");
    setFramed(window.parent !== window);
    if (["member", "offers", "events"].includes(q.get("tab") || "")) setTab(q.get("tab")!);
    if ([1, 2, 3, 4].includes(Number(q.get("layout")))) setLayout(Number(q.get("layout")));
    setPicks(current => Object.fromEntries(Object.entries(current).map(([key, value]) => { const next = Number(q.get(key)); if (key === "hierarchy") return [key, next >= 1 && next <= HIERARCHIES.length ? next : 1]; if (key === "direction") return [key, next >= 0 && next <= 10 ? next : 0]; if (key === "skin") return [key, 2]; if (key === "hook" && next === 8) return [key, 1]; return [key, next >= 1 && next <= (STACK_OPTIONS.find(section => section.key === key)?.options.length ?? 4) ? next : value]; })));
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    const images = Array.from(document.querySelectorAll<HTMLImageElement>(".vk-phone .vr-stack img")).slice(0, 8);
    const assets = Promise.all([document.fonts.ready, ...images.map(img => img.decode().catch(() => {}))]);
    let minimumTimer: ReturnType<typeof setTimeout>, deadlineTimer: ReturnType<typeof setTimeout>;
    const minimum = new Promise(resolve => { minimumTimer = setTimeout(resolve, 220); });
    const deadline = new Promise(resolve => { deadlineTimer = setTimeout(resolve, 1400); });
    Promise.all([minimum, Promise.race([assets, deadline])]).then(() => { if (!cancelled) setHomeLoaded(true); });
    return () => { cancelled = true; clearTimeout(minimumTimer); clearTimeout(deadlineTimer); };
  }, [ready]);
  useEffect(() => {
    if (!homeLoaded || showSplash) return;
    const timer = setTimeout(() => setSkeletonVisible(false), matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 200);
    return () => clearTimeout(timer);
  }, [homeLoaded, showSplash]);
  const openTab = (id: string) => { if (id === "member" && picks.vinclubState === 2) { let resume = false; try { resume = !!sessionStorage.getItem(VINCLUB_ACTIVATION_DRAFT); } catch {} setMembershipStage(resume ? "activation" : "story"); return; } setTab(id); const url = new URL(location.href); if (id !== "home") url.searchParams.set("tab", id); else url.searchParams.delete("tab"); history.replaceState(null, "", url); };
  useEffect(() => {
    const openOffers = () => openTab("offers");
    window.addEventListener("vinclub:offers", openOffers);
    return () => window.removeEventListener("vinclub:offers", openOffers);
  }, []);
  const current = APPROACHES.find(item => item.id === approach)!;
  const hookData = HOOK_APPROACHES.find(item => item.id === approach);

  const onboardingOpen = ready && !showSplash && homeLoaded && picks.vinclubState === 2 && membershipStage !== null;

  return <main className="vk-page" inert={!ready} data-ready={ready} data-home-enter={(ready && !showSplash && homeLoaded) || undefined} data-direction={picks.direction} data-hierarchy={picks.hierarchy} data-home-skeleton={(tab === "home" && skeletonVisible) || undefined} data-skeleton-leaving={(homeLoaded && !showSplash) || undefined} data-home-loading={(!homeLoaded && tab === "home") || undefined} data-mode={mode} data-framed={(embedded && framed) || undefined}>
    {/* Option column: same panels as Home VinPay. Hidden only when another page hosts this one in a frame. */}
    {!(embedded && framed) && <div className="vk-left">
      {tab === "home" && <aside className="vk-panel" aria-label="Visual tổng thể"><h1>Visual tổng thể<small>{HIERARCHIES[picks.hierarchy - 1]?.name}</small></h1><div className="vk-hierarchy-options" role="group" aria-label="Visual tổng thể">{HIERARCHIES.filter(item => item.id === 1).map(item => <Button key={item.id} variant="secondary" size="32" aria-pressed={picks.hierarchy === item.id} onClick={() => pick("hierarchy", item.id)}><span>{item.id}</span><span><strong>{item.name}</strong><small>{item.note}</small></span></Button>)}</div><details className="vk-visual-archive"><summary>Các option chưa chọn · lưu trữ</summary><div className="vk-hierarchy-options">{HIERARCHIES.filter(item => item.id !== 1).map(item => <Button key={item.id} variant="secondary" size="32" aria-pressed={picks.hierarchy === item.id} onClick={() => pick("hierarchy", item.id)}><span>{item.id}</span><span><strong>{item.name}</strong><small>{item.note}</small></span></Button>)}</div></details></aside>}
      <aside className="vk-panel" aria-label="Trạng thái VinClub"><h1>Trạng thái VinClub</h1><Choice label="Hội viên" options={[{ id: "1", label: "Đã kích hoạt" }, { id: "2", label: "Chưa kích hoạt" }]} value={String(picks.vinclubState)} onChange={value => { pick("vinclubState", Number(value)); setMembershipStage("story"); }} /></aside>
      <aside className="vk-panel" aria-label="Trạng thái ví"><h1>Trạng thái ví</h1><Choice label="Ví" options={[{ id: "1", label: "Đang dùng" }, { id: "2", label: "Chưa kích hoạt" }, { id: "3", label: "Mới kích hoạt" }]} value={String(picks.walletState)} onChange={value => pick("walletState", Number(value))} /></aside>
      <aside className="vk-panel" aria-label="Story"><h1>Story</h1><Choice label="Hiển thị" options={[{ id: "1", label: "Có story" }, { id: "2", label: "Không có story" }]} value={String(picks.story)} onChange={value => pick("story", Number(value))} /></aside>
      <aside className="vk-panel" aria-label="Giao diện"><h1>Giao diện</h1><div className="vk-mode" role="group" aria-label="Giao diện">
        <button type="button" aria-label="Sáng" aria-pressed={mode === "light"} onClick={() => set("mode", setMode)("light")}><Sun size={18} /></button>
        <button type="button" aria-label="Tối" aria-pressed={mode === "dark"} onClick={() => set("mode", setMode)("dark")}><Moon size={18} /></button>
      </div></aside>
      {hookData && !FIXED_LAYOUT.has(approach) && tab === "home" && <aside className="vk-panel" aria-label="Layout"><h1>Layout<small>{LAYOUTS[layout - 1]}</small></h1><div className="vk-numbers" role="group" aria-label="Layout">{LAYOUTS.map((label, index) => <button type="button" key={label} title={label} aria-label={`Layout ${index + 1}. ${label}`} aria-pressed={layout === index + 1} onClick={() => { setLayout(index + 1); const url = new URL(location.href); url.searchParams.set("layout", String(index + 1)); history.replaceState(null, "", url); }}>{index + 1}</button>)}</div></aside>}
      {approach === "stack" && tab === "home" && STACK_OPTIONS.filter(section => !CONFIRMED_STACK_OPTIONS[section.key] && !["hook", "giftCount", "giftTone", "offerHeader"].includes(section.key)).map(section => <aside className="vk-panel" key={section.key} aria-label={section.title}><h1>{section.title}<small>{section.options[picks[section.key] - 1]}</small></h1>{SECTION_REVIEW[section.key] && <p className="vk-why">{SECTION_REVIEW[section.key]}</p>}{section.key === "hook" && HOOK_DETAILS[picks.hook] && <p className="vk-why">{HOOK_DETAILS[picks.hook].reward}<br />Nội dung và điều kiện minh họa để review concept.</p>}<div className="vk-numbers" role="group" aria-label={section.title}>{section.options.map((label, index) => section.key === "hook" && index === 7 ? null : <button type="button" key={label} title={label} aria-label={`${section.title} ${index + 1}. ${label}`} aria-pressed={picks[section.key] === index + 1} onClick={() => pick(section.key, index + 1)}>{index + 1}</button>)}</div></aside>)}
      {approach === "plan" && tab === "home" && SECTIONS.map(section => <aside className="vk-panel" key={section.key} aria-label={section.title}><h1>{section.title}<small>{section.options[picks[section.key] - 1]}</small></h1>{SECTION_REVIEW[section.key] && <p className="vk-why">{SECTION_REVIEW[section.key]}</p>}{section.key === "hook" && HOOK_DETAILS[picks.hook] && <p className="vk-why">{HOOK_DETAILS[picks.hook].reward}<br />Nội dung và điều kiện minh họa để review concept.</p>}<div className="vk-numbers" role="group" aria-label={section.title}>{section.options.map((label, index) => section.key === "hook" && index === 7 ? null : <button type="button" key={label} title={label} aria-label={`${section.title} ${index + 1}. ${label}`} aria-pressed={picks[section.key] === index + 1} onClick={() => pick(section.key, index + 1)}>{index + 1}</button>)}</div></aside>)}
      {tab === "offers" && STACK_OPTIONS.filter(section => ["hook", "giftCount", "giftTone"].includes(section.key)).map(section => <aside className="vk-panel" key={section.key} aria-label={section.title}><h1>{section.title}<small>{section.options[picks[section.key] - 1]}</small></h1><div className="vk-numbers" role="group" aria-label={section.title}>{section.options.map((label, index) => section.key === "hook" && index === 7 ? null : <Button variant="secondary" size="32" key={label} title={label} aria-label={`${section.title} ${index + 1}. ${label}`} aria-pressed={picks[section.key] === index + 1} onClick={() => pick(section.key, index + 1)}>{index + 1}</Button>)}</div></aside>)}


    </div>}

    <div className="vk-phone-col">
    {!(embedded && framed) && <p className="vk-frame-name">{tab === "events" ? <>Sự kiện<small>Tham khảo Airbnb Experiences</small></> : tab === "offers" ? <>Ưu đãi<small>Dạng sheet</small></> : tab === "member" ? <>Hạng<small>Hạng, đặc quyền và huy hiệu</small></> : <><b>{number(current.id)}</b> {current.name}<small>{current.ref}</small></>}</p>}
    <div className={`vk-phone${tab === "member" ? " dark" : ""}`} data-approach={approach} data-tab={tab} data-tier={tier}>
      {(tab === "home" || tab === "offers") && <VinPayHeaderBackdrop />}
      <div data-mini-app-host inert={miniApp || gameOpen || onboardingOpen || showSplash || (!homeLoaded && tab === "home")} aria-hidden={miniApp || gameOpen || onboardingOpen || showSplash || (!homeLoaded && tab === "home") || undefined}><div className="vk-scroll" key={tab}>
        <div className="vk-status">9:41</div>
        {tab === "events" ? <EventsPage /> : tab === "offers" ? <OffersPage opts={picks} /> : tab === "member" ? picks.vinclubState === 2 ? null : <RankMember tier={tier} onBack={() => openTab("home")} /> : hookData ? <HookHome key={hookData.id} a={hookData} layout={layout} opts={picks} onOption={pick} tier={tier} onPay={() => setMiniApp(true)} onMember={() => openTab("member")} /> : <Plan tier={tier} onPay={() => setMiniApp(true)} onMember={() => openTab("member")} picks={picks} />}
      </div>
      <div className="vk-bar-fade" aria-hidden />
      <nav className="vk-bar" aria-label="Điều hướng chính">
        <button type="button" aria-current={tab === "home" ? "page" : undefined} onClick={() => openTab("home")}><Home size={24} strokeWidth={1.5} /><small>Trang chủ</small></button>
        <button type="button" aria-current={tab === "offers" ? "page" : undefined} onClick={() => openTab("offers")}><TicketPercent size={24} strokeWidth={1.5} /><small>Ưu đãi</small></button>
        <span><button type="button" aria-label="Quét QR"><QrCode size={26} strokeWidth={1.5} /></button></span>
        <button type="button" aria-current={tab === "events" ? "page" : undefined} onClick={() => openTab("events")}><CalendarDays size={24} strokeWidth={1.5} /><small>Sự kiện</small></button>
        <button type="button" data-member-tab aria-label="Hạng" aria-current={tab === "member" ? "page" : undefined} onClick={() => openTab("member")}><Crown size={24} strokeWidth={1.5} /><small>Hạng</small></button>
      </nav>
      <div className="vk-indicator" aria-hidden />
      </div>
      {tab === "home" && homeLoaded && !showSplash && !miniApp && !gameOpen && !onboardingOpen && <Button ref={gameTrigger} variant="secondary" size="32" className="vk-game-fab" aria-label="Chơi Tết · Mở Cửa Tết 2027" onClick={() => picks.vinclubState === 2 ? openTab("member") : setGameOpen(true)}><Image src="/vinclub-game/mo-cua-tet-fab-v1.png" width={88} height={88} alt="Mở Cửa Tết" draggable={false} /></Button>}
      {ready && showSplash && <div className="vk-launch glass-studies"><GlassLaunchPreview look="jewel-glass" paused={false} onComplete={finishSplash}/></div>}
      {miniApp && <VinPayMiniApp onClose={closeMiniApp} mode={mode}/>}
      {gameOpen && <TetGame onClose={closeGame}/>}
      {onboardingOpen && membershipStage === "story" && <VinClubOnboarding onActivate={() => setMembershipStage("activation")} onClose={() => { setMembershipStage(null); openTab("home"); }} />}
      {onboardingOpen && membershipStage === "activation" && <VinClubActivation mode={mode} onBack={() => { setMembershipStage(null); openTab("home"); }} onActivate={() => { pick("vinclubState", 1); setMembershipStage(null); openTab("home"); }} />}
    </div>
    </div>
    {!(embedded && framed) && approach === "stack" && tab === "home" && <section className="vk-confirmed" aria-label="Các tuỳ chỉnh đã chốt">
      {approach === "stack" && tab === "home" && STACK_OPTIONS.filter(section => CONFIRMED_STACK_OPTIONS[section.key]).map(section => {
        const confirmed = CONFIRMED_STACK_OPTIONS[section.key];
        const option = (label: string, index: number) => <button type="button" key={label} title={label} aria-label={`${section.title} ${index + 1}. ${label}`} aria-pressed={picks[section.key] === index + 1} onClick={() => pick(section.key, index + 1)}>{index + 1}</button>;
        return <aside className="vk-panel" key={section.key} aria-label={section.title}>
          <h1>{section.title}<small>Đã chốt {confirmed} · {section.options[confirmed - 1]}</small></h1>
          <div className="vk-numbers" role="group" aria-label={section.title}>{option(section.options[confirmed - 1], confirmed - 1)}</div>
          <details className="vk-archive" open={picks[section.key] !== confirmed || undefined}>
            <summary>Archive ({section.options.length - 1})</summary>
            <div className="vk-numbers" role="group" aria-label={`Archive ${section.title}`}>{section.options.map((label, index) => index + 1 !== confirmed ? option(label, index) : null)}</div>
          </details>
        </aside>;
      })}
    </section>}
  </main>;
}

