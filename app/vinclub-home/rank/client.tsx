/* eslint-disable @next/next/no-img-element -- Local badge and brand artwork has explicit CSS sizing. */
"use client"

import type * as React from "react"
import { AwardConfetti } from "./award-confetti"
import { VPointWallet } from "./vpoint-wallet"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TabBar } from "@/components/ui/header"
import { useState } from "react"
import { ChevronRight, X } from "lucide-react"
import { TierBadge, TIERS, type Tier, BADGE_OPTIONS, type BadgeStyle } from "./badge"

/* VinPay · VinClub membership.
   Content sources, all already in the repos: tier names and per-tier benefits from app/vinclub-rank/layout-study/study.tsx,
   brand logos from public/vinclub-rank/dls, unlock icons from vinclub-assets/membership, service badges from vinclub-assets/badges-v1.
   Point thresholds and qualifying rules are not in any source yet, so they read {chờ data}. Earned badges are sample state. */

const BENEFITS = (tier: Tier) => [
  { title: "Nghỉ dưỡng xứng tầm", sub: `Ưu đãi đến ${tier === "platinum" ? "30" : tier === "gold" ? "20" : "10"}% tại Vinpearl`, logo: "vinpearl" },
  { title: "Đặc quyền chăm sóc", sub: tier === "silver" ? "Ưu đãi gói khám sức khỏe Vinmec" : "Ưu tiên đặt lịch và ưu đãi gói khám", logo: "vinmec" },
  { title: "Mua sắm mỗi ngày", sub: "Ưu đãi riêng tại hệ thống Vincom", logo: "vincom" },
  { title: "Đi xanh, sống trọn", sub: "Tích VPoint trên mỗi hành trình Xanh SM", logo: "xanh-sm" },
]
const MARK: Record<Tier, string> = { silver: "silver", gold: "gold", platinum: "black" }
const BADGES = [
  { id: "vinpay", title: "Cao thủ VinPay", earned: true },
  { id: "vincom", title: "Trùm săn deal Vincom", earned: true },
  { id: "vinfast", title: "Tay lái vàng VinFast", earned: false },
  { id: "vinpearl", title: "Chill guy Vinpearl", earned: false },
  { id: "vinwonders", title: "Phá đảo VinWonders", earned: false },
  { id: "greenfood", title: "Chiến thần Greenfood", earned: false },
]
const tierName = (id: Tier) => TIERS.find(t => t.id === id)!.name

/* Membership page: current tier, its benefits, the next tiers, and the badge library. */
export function MembershipScreen({ current, variant = "hex", onAward }: { current: Tier; variant?: BadgeStyle; onBack?: () => void; onAward?: () => void }) {
  const index = TIERS.findIndex(t => t.id === current)
  const next = TIERS[index + 1]
  const [selectedTier, setSelectedTier] = useState<Tier>(current)
  return <div className="rk-phone">
    <div className="rk-scroll">
      <div className="rk-status">9:41</div>
      <header className="rk-nav rk-nav-tab"><h1>Hạng thành viên</h1></header>
      <section className="rk-hero">
        <Card className="rk-current-card rounded-28 border-0 p-0 shadow-none gap-0">
        <div className="rk-current-summary"><TierBadge variant={variant} tier={current} size={80} className="rk-hero-badge" /><div>
        <p className="rk-eyebrow">Hạng hiện tại</p>
        <h2>{tierName(current)}</h2>{onAward && <Button variant="secondary" size="32" className="rk-celebrate" onClick={onAward}>Khoảnh khắc lên hạng<ChevronRight size={16} /></Button>}</div></div>
        {next ? <div className="rk-progress" aria-label={`Tiến độ lên hạng ${next.name}`}>
          <div className="rk-progress-row"><span>Lên {next.name}</span><b>{"{chờ data}"}</b></div>
          <progress className="rk-rank-progress" max={100} aria-label={`Tiến độ lên hạng ${next.name}`} aria-valuetext="Đang chờ dữ liệu ngưỡng xét hạng" />
          <small>Ngưỡng VPoint và thời hạn xét hạng: {"{chờ data}"}</small>
        </div> : <div className="rk-progress rk-progress-complete"><div className="rk-progress-row"><span>Hạng cao nhất</span></div><progress className="rk-rank-progress" max={100} value={100} aria-label="Đã đạt hạng cao nhất" /><small>Bạn đang ở hạng cao nhất</small></div>}
        </Card>
      </section>

      <VPointWallet />
      <div className="rk-light-content">
      <section className="rk-section" aria-label="Đặc quyền theo hạng">
        <h3>Đặc quyền theo hạng</h3>
        <TabBar className="rk-tier-tabs !px-0 border-0" tabs={TIERS.map(tier => ({ value: tier.id, label: tier.name }))} activeTab={selectedTier} onTabChange={value => setSelectedTier(value as Tier)} />
        <div className="rk-tier-panel" role="tabpanel" aria-label={`Quyền lợi ${tierName(selectedTier)}`}>{TIERS.filter(tier => tier.id === selectedTier).map(tier => {
          const i = TIERS.findIndex(item => item.id === tier.id)
          const state = i < index ? "past" : i === index ? "current" : "locked"
          return <article key={tier.id} className="rk-tier-card" data-state={state}>

            <div className="rk-list rk-tier-benefits">{BENEFITS(tier.id).map(benefit => <div className="rk-benefit" key={benefit.title}>
              <img className="rk-brand" src={`/vinclub-rank/dls/brand-${benefit.logo}.png`} alt="" />
              <span><strong>{benefit.title}</strong><small>{benefit.sub}</small></span>
              <img className="rk-mark" src={`/vinclub-rank/membership/${MARK[tier.id]}-${state === "locked" ? "lock" : "check"}.webp`} alt={state === "locked" ? "Chưa mở khóa" : state === "current" ? "Đang có" : "Đã đạt"} />
            </div>)}</div>
          </article>
        })}</div>
      </section>

      <section className="rk-section" aria-label="Thư viện huy hiệu">
        <div className="rk-section-head"><h3>Thư viện huy hiệu</h3><button type="button">{BADGES.filter(b => b.earned).length}/{BADGES.length}<ChevronRight size={16} /></button></div>
        <div className="rk-badges">{BADGES.map(b => <figure key={b.id} data-earned={b.earned || undefined}>
          
          <img src={`/vinclub-rank/badges-v1/${b.id}.webp`} alt="" />
          <figcaption>{b.title}</figcaption>
          <small>{b.earned ? "Đã đạt" : "Chưa đạt"}</small>
        </figure>)}</div>
      </section>
      </div>
    </div>
    <div className="rk-indicator" />
  </div>
}

/* Award screen, cloned from the reference (Pinterest 5c0e88bf…, 736×1472) at scale 0.53: left-set eyebrow, two-line bold title
   and date, stage spotlights with confetti, the badge centred over a floor glow, a centred "earned by" line, then a white primary
   and a grey secondary pill. The stage takes the badge's own colour, as the reference's blue matches its blue badge. */
const EARNED_ON = "01/11/2026"
/* Faint star dust in the upper haze (positions fixed so renders are stable). */
/* Short labels of the same per-tier benefits (study.tsx), for the unlocked row. */
const PERK_SHORT = (tier: Tier) => [
  { label: `Vinpearl đến ${tier === "platinum" ? "30" : tier === "gold" ? "20" : "10"}%` },
  { label: tier === "silver" ? "Ưu đãi Vinmec" : "Ưu tiên Vinmec" },
  { label: "Ưu đãi Vincom" },
  { label: "VPoint Xanh SM" },
]
export function AwardScreen({ eyebrow, title, art, tint, earnedBy, primary, perks, onClose }: { eyebrow: string; title: [string, string]; art: React.ReactNode; tint: string; earnedBy: string; primary?: string; perks?: Tier; onClose: () => void }) {
  return <div className="rk-phone aw" data-perks={perks ? "" : undefined} style={{ "--tint": tint } as React.CSSProperties}>
    <div className="aw-stage" aria-hidden>
      <i className="aw-floor" />
    </div>
    <AwardConfetti />
    <div className="rk-status">9:41</div>
    <button type="button" className="aw-close" aria-label="Đóng" onClick={onClose}><X size={22} strokeWidth={1.8} /></button>
    <header className="aw-head"><p>{eyebrow}</p><h1><span>{title[0]}</span><strong>{title[1]}</strong></h1><time>{EARNED_ON}</time></header>
    <div className="aw-art">{art}</div>
    <p className="aw-earned">{earnedBy === "{chờ data}" ? "Một dấu mốc mới trên hành trình của bạn" : earnedBy}</p>
    {perks && <section className="aw-perks" aria-label="Đặc quyền vừa mở khoá">
      <h2>Đặc quyền vừa mở khoá</h2>
      <div>{PERK_SHORT(perks).map((k, index) => <figure key={k.label}>
        
        <span className="aw-perk-icon"><img src={`/vinclub-rank/celebration/glass-perk-${index}-v3.png`} alt="" width={56} height={56} /></span>
        <figcaption>{k.label}</figcaption>
      </figure>)}</div>
    </section>}
    <footer className="aw-actions">{primary && <Button variant="primary" className="aw-primary" onClick={onClose}>{primary}</Button>}<Button variant="secondary" className="aw-secondary" onClick={() => { if (navigator.share) void navigator.share({ title: `${title[0]} ${title[1]}`, url: location.href }).catch(() => {}); else void navigator.clipboard?.writeText(location.href); }}>Chia sẻ</Button></footer>
    <div className="rk-indicator" />
  </div>
}

export const TIER_TINT: Record<Tier, string> = { silver: "#8fa3b8", gold: "#c9962f", platinum: "#5d9fc4" }

export default function RankPage() {
  const [to, setTo] = useState<Tier>("gold")
  const [play, setPlay] = useState(0)
  const [variant, setVariant] = useState<BadgeStyle>("hex")
  const from = TIERS[Math.max(0, TIERS.findIndex(t => t.id === to) - 1)].id
  return <main className="rk-page">
    <aside className="rk-controls">
      <h1>Hạng VinClub</h1>
      <p>Lên hạng</p>
      <div role="group" aria-label="Lên hạng">{TIERS.slice(1).map(t => <button type="button" key={t.id} aria-pressed={to === t.id} onClick={() => { setTo(t.id); setPlay(n => n + 1) }}>{tierName(TIERS[TIERS.indexOf(t) - 1].id)} → {t.name}</button>)}</div>
      <p>Thiết kế badge</p><div role="group" aria-label="Thiết kế badge">{BADGE_OPTIONS.map(option => <button type="button" key={option.id} aria-pressed={variant === option.id} onClick={() => { setVariant(option.id); setPlay(n => n + 1) }}><TierBadge tier={to} variant={option.id} size={44} /><span>{option.name}<small>{option.note}</small></span></button>)}</div>
      <button type="button" className="rk-replay" onClick={() => setPlay(n => n + 1)}>Chạy lại</button>
    </aside>
    <figure><figcaption>Hạng</figcaption><MembershipScreen current={to} variant={variant} /></figure>
    <figure><figcaption>Nhận huy hiệu</figcaption><AwardScreen key={`b${play}`} eyebrow="Huy hiệu mới" title={["Cao thủ", "VinPay"]} art={ <img className="aw-badge-img" src="/vinclub-rank/badges-v1/vinpay.webp" alt="Huy hiệu Cao thủ VinPay" />} tint="#b3263a" earnedBy="{chờ data}" primary="Xem phần thưởng" onClose={() => setPlay(n => n + 1)} /></figure>
    <figure><figcaption>Lên hạng {tierName(from)} → {tierName(to)}</figcaption><AwardScreen key={`r${play}`} eyebrow="Lên hạng" title={["Chào mừng bạn đến với", tierName(to)]} art={<TierBadge variant={variant} tier={to} size={200} className="aw-badge-svg" />} tint={TIER_TINT[to]} earnedBy="{chờ data}" primary="Xem đặc quyền" perks={to} onClose={() => setPlay(n => n + 1)} /></figure>
  </main>
}
