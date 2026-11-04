"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MembershipScreen, AwardScreen, TIER_TINT } from "./client";
import { TierBadge, BADGE_OPTIONS, type BadgeStyle, type Tier } from "./badge";
import "./rank.css";
import "./member.css";
export function RankMember({ tier, onBack }: { tier: string; onBack: () => void }) {
  const [variant, setVariant] = useState<BadgeStyle>("hex");
  const [award, setAward] = useState(false);
  const current: Tier = tier === "Bạc" ? "silver" : tier === "Bạch Kim" ? "platinum" : "gold";
  const label = current === "silver" ? "Silver" : current === "gold" ? "Gold" : "Platinum";
  return <div className="rk-page rk-integrated" data-award={award}>
    {award ? <AwardScreen eyebrow="Lên hạng" title={["Chào mừng bạn đến với", label]} art={<div className="aw-rank-object" data-metal={current}>{current === "gold" ? <img className="aw-new-rank" src="/vinclub-rank/celebration/gold-medallion-v3.png" alt="Huy hiệu hạng Vàng" /> : <TierBadge tier={current} size={220} variant={current === "silver" ? "medallion" : "shield"} />}</div>} tint={TIER_TINT[current]} earnedBy="Một dấu mốc mới trên hành trình của bạn" perks={current} onClose={() => setAward(false)} /> : <>
      <MembershipScreen current={current} variant={variant} onBack={onBack} onAward={() => setAward(true)} />
      <details className="rk-badge-picker"><summary>Thiết kế badge · {BADGE_OPTIONS.find(item => item.id === variant)?.name}</summary><div>{BADGE_OPTIONS.map(item => <Button key={item.id} variant="secondary" size="32" aria-label={item.name} aria-pressed={variant === item.id} onClick={() => setVariant(item.id)}><TierBadge tier={current} variant={item.id} size={32} />{item.name}</Button>)}</div></details>
    </>}
  </div>;
}
