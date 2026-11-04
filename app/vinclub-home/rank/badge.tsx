"use client"

import { useId } from "react"

/* Tier badge, drawn in SVG (no generated art), after the reference's polished-metal hexagon:
   offset back plates, chamfered rims whose six facets are each lit from the top left, studio-light reflection bands,
   fine grooves, a brushed face, and the VinClub mark (public/vinclub-rank/pattern-lab/logo.svg) raised with SVG specular lighting. */

export const BADGE_OPTIONS = [
  { id: "hex", name: "Di sản", note: "Lục giác · kim loại xếp lớp" },
  { id: "medallion", name: "Ấn tín", note: "Huy chương · vòng khắc tinh" },
  { id: "shield", name: "Bảo chứng", note: "Khiên · men tối và viền sáng" },
  { id: "diamond", name: "Lăng kính", note: "Kim cương · mặt cắt ánh sáng" },
  { id: "seal", name: "Tinh hoa", note: "Ấn sao · đường viền tỏa tia" },
  { id: "orbit", name: "Quỹ đạo", note: "Vòng tròn · tối giản đương đại" },
] as const
export type BadgeStyle = typeof BADGE_OPTIONS[number]["id"]
export type Tier = "silver" | "gold" | "platinum"

/* Tier names as used across the VinClub studies in this repo (layout-study: Silver, Gold, Platinum). */
export const TIERS: { id: Tier; name: string }[] = [
  { id: "silver", name: "Silver" },
  { id: "gold", name: "Gold" },
  { id: "platinum", name: "Platinum" },
]

/* Metal ramps, deep → highlight. */
const METAL: Record<Tier, string[]> = {
  silver: ["#2a2f35", "#4e555d", "#7d858e", "#aeb5bd", "#d9dee3", "#ffffff"],
  gold: ["#3a2306", "#6e4610", "#a8741f", "#d9a94a", "#f3d47f", "#fff7d6"],
  platinum: ["#1f2b33", "#3f5562", "#6f8a99", "#a3bccb", "#d3e4ee", "#f6fcff"],
}

const LIGHT = { x: 0.62, y: -0.78 } // light from the top right, as in the reference (bright right rim, dark left rim)

function vertices(r: number, cx = 100, cy = 100) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = Math.PI / 180 * (60 * i - 90)
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const
  })
}
const pts = (v: readonly (readonly [number, number])[]) => v.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ")

/* A chamfered ring: six trapezoid facets between two hexagons. Raised rings face outward; recessed ones face inward. */
function Ring({ outer, inner, ramp, recessed = false, cx = 100, cy = 100 }: { outer: number; inner: number; ramp: string[]; recessed?: boolean; cx?: number; cy?: number }) {
  const o = vertices(outer, cx, cy), n = vertices(inner, cx, cy)
  return <>{o.map((_, i) => {
    const j = (i + 1) % 6
    const mid = Math.PI / 180 * (60 * i - 60)
    const lit = (Math.cos(mid) * LIGHT.x + Math.sin(mid) * LIGHT.y) * (recessed ? -1 : 1)
    const shade = ramp[Math.max(0, Math.min(ramp.length - 1, Math.round((lit + 1) / 2 * (ramp.length - 1))))]
    return <polygon key={i} points={pts([o[i], o[j], n[j], n[i]])} fill={shade} />
  })}</>
}

export function TierBadge({ tier, size = 200, locked = false, className, variant = "hex" }: { tier: Tier; size?: number; locked?: boolean; className?: string; variant?: BadgeStyle }) {
  const ramp = METAL[tier]
  const [deep, dark, mid, base, light, hi] = ramp
  const id = useId().replace(/:/g, "")
  const url = (name: string) => `url(#${id}-${name})`
  return <svg className={className} width={size} height={size} viewBox="0 0 200 200" role="img" aria-label={`Huy hiệu hạng ${TIERS.find(t => t.id === tier)?.name}`} data-metal={tier} data-locked={locked || undefined}>
    <defs>
      <pattern id={`${id}-material`} width={tier === "silver" ? 3 : 8} height={tier === "silver" ? 3 : 8} patternUnits="userSpaceOnUse">
        {tier === "silver" ? <path d="M0 1.5h3" stroke={hi} strokeOpacity=".24" strokeWidth=".5" /> : tier === "gold" ? <><path d="m0 0 8 8m-4-4 8 8m-12-4 8 8" stroke={hi} strokeOpacity=".2" strokeWidth=".4" /></> : <><path d="M0 0 8 8M8 0 0 8" stroke={hi} strokeOpacity=".28" strokeWidth=".5" /><circle cx="4" cy="4" r=".6" fill={hi} /></>}
      </pattern>
      {/* Studio reflections: hard-edged light bands, two angles so neighbouring rings never mirror each other. */}
      <linearGradient id={`${id}-bands`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={hi} /><stop offset=".1" stopColor={light} /><stop offset=".2" stopColor={dark} /><stop offset=".34" stopColor={base} />
        <stop offset=".42" stopColor={hi} /><stop offset=".47" stopColor={light} /><stop offset=".6" stopColor={mid} /><stop offset=".74" stopColor={deep} />
        <stop offset=".86" stopColor={base} /><stop offset="1" stopColor={dark} />
      </linearGradient>
      <linearGradient id={`${id}-bands2`} x1="1" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={base} /><stop offset=".22" stopColor={hi} /><stop offset=".3" stopColor={light} /><stop offset=".5" stopColor={dark} />
        <stop offset=".64" stopColor={light} /><stop offset=".7" stopColor={hi} /><stop offset=".85" stopColor={mid} /><stop offset="1" stopColor={deep} />
      </linearGradient>
      <radialGradient id={`${id}-face`} cx=".32" cy=".22" r=".95">
        <stop offset="0" stopColor={light} /><stop offset=".35" stopColor={base} /><stop offset=".75" stopColor={mid} /><stop offset="1" stopColor={dark} />
      </radialGradient>
      <linearGradient id={`${id}-sweep`} x1="0" y1="0" x2="1" y2=".4">
        <stop offset=".18" stopColor="#fff" stopOpacity="0" /><stop offset=".32" stopColor="#fff" stopOpacity=".38" /><stop offset=".4" stopColor="#fff" stopOpacity="0" />
        <stop offset=".62" stopColor="#fff" stopOpacity="0" /><stop offset=".68" stopColor="#fff" stopOpacity=".16" /><stop offset=".74" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      {/* Brushed metal: horizontal streak noise, laid over the face. */}
      <filter id={`${id}-brush`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency=".02 .9" numOctaves="2" seed="7" />
        <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .3 -.1" />
      </filter>
      {/* Raised metal: specular plus diffuse lighting on the shape's own alpha, light from the top left. */}
      <filter id={`${id}-raise`} x="-15%" y="-15%" width="130%" height="130%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.1" result="b" />
        <feDiffuseLighting in="b" surfaceScale="2.6" diffuseConstant="1.05" lightingColor="#fff" result="d"><feDistantLight azimuth="315" elevation="48" /></feDiffuseLighting>
        <feComposite in="d" in2="SourceAlpha" operator="in" result="dIn" />
        <feBlend in="SourceGraphic" in2="dIn" mode="multiply" result="m" />
        <feSpecularLighting in="b" surfaceScale="2.6" specularConstant="1.2" specularExponent="24" lightingColor="#fff" result="s"><feDistantLight azimuth="315" elevation="38" /></feSpecularLighting>
        <feComposite in="s" in2="SourceAlpha" operator="in" result="sIn" />
        <feComposite in="m" in2="sIn" operator="arithmetic" k2="1" k3=".9" result="lit" />
        <feDropShadow dx="1.2" dy="1.8" stdDeviation="1" floodColor="#000" floodOpacity=".45" />
      </filter>
      <filter id={`${id}-soft`}><feGaussianBlur stdDeviation="3" /></filter>
      <clipPath id={`${id}-faceclip`}><polygon points={pts(vertices(69))} /></clipPath>
      <clipPath id={`${id}-birdclip`}><rect x="0" y="0" width="200" height="137" /></clipPath>
      {/* The bird only (top of the VinClub logo), enlarged to fill the face like the reference monogram. */}
      <mask id={`${id}-mark`} style={{ maskType: "alpha" }}><g clipPath={`url(#${id}-birdclip)`}><image href="/vinclub-rank/pattern-lab/logo.svg" x="1.6" y="53" width="199" height="125.4" /></g></mask>
    </defs>

    {variant === "hex" ? <g>    {/* Offset back plates, two tiers per side, each edged by a dark seam so they read as separate stacked frames (reference top corners). */}
    {[[-15, -9, "bands2"], [15, -9, "bands"], [-7.5, -4.5, "bands"], [7.5, -4.5, "bands2"]].map(([dx, dy, fill]) => <g key={`${dx}`}>
      <polygon points={pts(vertices(92, 100 + (dx as number), 100 + (dy as number)))} fill="#000" stroke="#000" strokeWidth="3" />
      <polygon points={pts(vertices(91, 100 + (dx as number), 100 + (dy as number)))} fill={url(fill as string)} />
      <Ring outer={91} inner={87} ramp={ramp} cx={100 + (dx as number)} cy={100 + (dy as number)} />
      <polygon points={pts(vertices(86, 100 + (dx as number), 100 + (dy as number)))} fill={deep} />
    </g>)}
    <polygon points={pts(vertices(97, 101, 103))} fill="#000" opacity=".5" filter={url("soft")} />
    <polygon points={pts(vertices(96.5))} fill="#000" />

    {/* Main plate: raised chamfer, reflective band, fine grooves, recessed chamfer, face. */}
    <Ring outer={95} inner={87} ramp={ramp} />
    <polygon points={pts(vertices(87))} fill={url("bands")} />
    <polygon points={pts(vertices(87))} fill={url("sweep")} />
    {[84, 82.6, 81.2, 79.8, 78.4, 77.2].map((r, i) => <polygon key={r} points={pts(vertices(r))} fill="none" stroke={i % 2 ? deep : hi} strokeOpacity={i % 2 ? .55 : .75} strokeWidth=".7" />)}
    <polygon points={pts(vertices(76.5))} fill={url("bands2")} />
    <Ring outer={76.5} inner={69} ramp={ramp} recessed />
    <polygon points={pts(vertices(69))} fill={url("face")} />
    <g clipPath={url("faceclip")}>
      <rect x="20" y="20" width="160" height="160" filter={url("brush")} style={{ mixBlendMode: "overlay" }} />
      <polygon points={pts(vertices(69))} fill={url("sweep")} />
    </g>
    <polygon points={pts(vertices(69))} fill="none" stroke={hi} strokeOpacity=".5" strokeWidth=".6" />

    {/* Raised VinClub mark and base gem, lit as solid metal. */}
    <g filter={url("raise")}><rect x="20" y="40" width="160" height="110" fill={base} mask={url("mark")} /></g>
    <g filter={url("raise")}>
      <polygon points={pts(vertices(18, 100, 160))} fill={url("bands")} />
      <polygon points={pts(vertices(13, 100, 160))} fill={url("face")} />
    </g>

    {/* Hot specular spots where the studio light hits the top-left rim. */}
    <ellipse cx="140" cy="40" rx="16" ry="3" fill="#fff" opacity=".8" transform="rotate(30 140 40)" filter={url("soft")} />
    <rect x="174" y="70" width="5" height="56" rx="2.5" fill="#fff" opacity=".7" filter={url("soft")} /></g> : <g>
      {variant === "shield" ? <path d="M100 8 178 38v65c0 40-34 70-78 89-44-19-78-49-78-89V38Z" fill={url("bands")} stroke={deep} strokeWidth="3" /> : variant === "diamond" ? <path d="M100 5 190 100 100 195 10 100Z" fill={url("bands")} stroke={light} strokeWidth="2" /> : variant === "seal" ? <polygon points={Array.from({length:32},(_,i)=>{const a=i*Math.PI/16-Math.PI/2,r=i%2?82:96;return `${100+Math.cos(a)*r},${100+Math.sin(a)*r}`}).join(" ")} fill={url("bands")} stroke={light} strokeWidth="1" /> : <circle cx="100" cy="100" r="92" fill={url("bands")} stroke={deep} strokeWidth="3" />}
      {variant === "shield" ? <path d="m100 24 63 26v53c0 30-25 55-63 74-38-19-63-44-63-74V50Z" fill={deep} stroke={light} strokeWidth="1.5" /> : variant === "diamond" ? <path d="m100 24 71 76-71 76-71-76Z" fill={url("face")} stroke={hi} strokeWidth="1" /> : <circle cx="100" cy="100" r="76" fill={variant === "orbit" ? deep : url("face")} stroke={light} strokeWidth="1.5" />}
      {variant === "medallion" && Array.from({length:48},(_,i)=><path key={i} d="M100 14v5" stroke={deep} strokeWidth="1.5" transform={`rotate(${i*7.5} 100 100)`} />)}
      {variant === "orbit" && <><ellipse cx="100" cy="100" rx="86" ry="37" fill="none" stroke={hi} strokeWidth="1.2" transform="rotate(-32 100 100)" /><circle cx="171" cy="59" r="5" fill={hi} /></>}
      <circle cx="100" cy="100" r="67" fill={url("material")} />
      <g filter={url("raise")}><rect x="20" y="40" width="160" height="110" fill={light} mask={url("mark")} /></g>
      <path d="m94 151 6-6 6 6-6 6Z" fill={hi} />
    </g>}

  </svg>
}
