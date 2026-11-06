/** SVG/3D port of Native Cook's Skia scene; original geometry and typography. */
import { GIFT } from "./theme";

const EW = 336, EH = 232;
const FLAP = `M0 0H336L194 ${EH * .66 - 12}Q168 ${EH * .66 + 4} 142 ${EH * .66 - 12}Z`;
const LEFT = `M0 0L${EW * .47} ${EH * .56}L0 232Z`;
const RIGHT = `M336 0L${EW * .53} ${EH * .56}L336 232Z`;
const POCKET = `M0 232Q${EW * .3} ${EH * .5} 168 ${EH * .44}Q${EW * .7} ${EH * .5} 336 232Z`;
const WAX = Array.from({ length: 73 }, (_, k) => {
  const a = k / 72 * Math.PI * 2;
  const r = 28 * (1 + .05 * Math.sin(5 * a + .6) + .035 * Math.sin(9 * a + 2.1) + .02 * Math.sin(14 * a + 4));
  return `${k === 0 ? "M" : "L"}${Math.cos(a) * r},${Math.sin(a) * r}`;
}).join(" ") + "Z";

function PaperDefs({ id }: { id: string }) {
  return <defs>
    <linearGradient id={`${id}-paper`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="201.6" y2="153.12"><stop stopColor="var(--gift-paper-high)"/><stop offset="1" stopColor="var(--gift-paper)"/></linearGradient>
    <linearGradient id={`${id}-left`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="157.92" y2="129.92"><stop stopColor="var(--gift-paper-high)"/><stop offset="1" stopColor="var(--gift-paper)"/></linearGradient>
    <linearGradient id={`${id}-pocket`} gradientUnits="userSpaceOnUse" x1="0" y1="104.4" x2="134.4" y2="232"><stop stopColor="var(--gift-paper-high)"/><stop offset="1" stopColor="var(--gift-paper)"/></linearGradient>
    <linearGradient id={`${id}-right`} gradientUnits="userSpaceOnUse" x1="336" y1="0" x2="178.08" y2="129.92"><stop stopColor="var(--gift-paper)"/><stop offset="1" stopColor="var(--gift-paper-low)"/></linearGradient>
    <pattern id={`${id}-grain`} width="512" height="512" patternUnits="userSpaceOnUse"><image href="/envelope-gift-reveal/grain-11.png" width="512" height="512"/></pattern>
    <clipPath id={`${id}-shape`}><path d={FLAP}/></clipPath>
  </defs>;
}

function SealFace() {
  return <>
    <path d={WAX} fill="url(#gift-wax)"/>
    <circle r="19.6" fill="none" stroke="var(--gift-wax-low)" strokeWidth="1.6" opacity=".75"/>
    <circle cx=".6" cy=".8" r="19.6" fill="none" stroke="var(--gift-wax-high)" strokeWidth=".8" opacity=".6"/>
    <text textAnchor="middle" x=".7" y="10.8" className="gift-serif" fontSize="30" fill="var(--gift-wax-high)" opacity=".7">N</text>
    <text textAnchor="middle" y="10" className="gift-serif" fontSize="30" fill="var(--gift-wax-low)">N</text>
    <ellipse cx="-10.36" cy="-15.96" rx="7" ry="3.64" fill="var(--gift-wax-glint)" filter="url(#gift-glint)"/>
  </>;
}
function Seal() {
  return <g transform="translate(168 143.84)">
    <defs>
      <radialGradient id="gift-wax" gradientUnits="userSpaceOnUse" cx="-9.8" cy="-11.2" r="44.8"><stop stopColor="var(--gift-wax-high)"/><stop offset=".45" stopColor="var(--gift-wax)"/><stop offset="1" stopColor="var(--gift-wax-low)"/></radialGradient>
      <clipPath id="gift-seal-left"><rect x="-32" y="-32" width="32.5" height="64"/></clipPath>
      <clipPath id="gift-seal-right"><rect x="0" y="-32" width="32" height="64"/></clipPath>
      <filter id="gift-glint"><feGaussianBlur stdDeviation="1.5"/></filter>
    </defs>
    <g className="gift-seal-pop">
      <g className="gift-seal-left"><g clipPath="url(#gift-seal-left)"><SealFace/></g></g>
      <g className="gift-seal-right"><g clipPath="url(#gift-seal-right)"><SealFace/></g></g>
    </g>
  </g>;
}
export function GiftCard({ back = false }: { back?: boolean }) {
  return <svg viewBox="0 0 340 214" width="340" height="214" className={`gift-card-face ${back ? "gift-card-back" : "gift-card-front"}`} aria-hidden="true">
    <rect width="340" height="214" rx="8" fill="var(--gift-card)"/>
    <image href={`/envelope-gift-reveal/grain-${back ? 77 : 31}.png`} width="512" height="512" style={{ clipPath: "inset(0 172px 298px 0 round 8px)" }}/>
    {back ? <>
      {GIFT.note.map((line, i) => <text key={line} x={26 + (i === GIFT.note.length - 1 ? 150 : 0) + i % 2 * 2} y={44 + i * 32 + (i === GIFT.note.length - 1 ? 4 : 0)} className="gift-hand" fontSize="25" fill="var(--gift-pen)" opacity=".92">{line}</text>)}
      <text x="318" y="34" textAnchor="end" fontSize="22" className="gift-serif" fill="var(--gift-letterpress)">{GIFT.amount}</text>
      <text x="318" y="48" textAnchor="end" fontSize="9" className="gift-ui-bold" fill="var(--gift-card-mute)">FABLE &amp; FERN</text>
    </> : <>
      <rect x="12" y="12" width="316" height="190" rx="3" fill="none" stroke="var(--gift-letterpress)" strokeWidth="1" opacity=".7"/>
      <rect x="15" y="15" width="310" height="184" rx="2" fill="none" stroke="var(--gift-letterpress)" strokeWidth=".5" opacity=".5"/>
      <text x="28" y="56" fontSize="32" className="gift-serif" fill="var(--gift-letterpress)">{GIFT.shop}</text>
      <text x="29" y="74" fontSize="9" className="gift-ui-bold" fill="var(--gift-card-mute)">{GIFT.shopLine}</text>
      <text x="29" y="184" fontSize="9" className="gift-ui-bold" fill="var(--gift-card-mute)">GIFT CARD</text>
      <text x="312" y="188.8" textAnchor="end" fontSize="60" className="gift-serif" fill="var(--gift-letterpress-light)">{GIFT.amount}</text>
      <text x="312" y="188" textAnchor="end" fontSize="60" className="gift-serif" fill="var(--gift-letterpress)">{GIFT.amount}</text>
    </>}
    <rect x=".5" y=".5" width="339" height="213" rx="8" fill="none" stroke="var(--gift-card-edge)"/>
  </svg>;
}

export function EnvelopeScene() {
  return <div className="gift-scene" aria-hidden="true">
    <div className="gift-envelope">
      <div className="gift-envelope-shadow"/>
      <div className="gift-envelope-inner"/>
      <div className="gift-flap gift-flap-back">
        <svg viewBox="0 0 336 232" width="336" height="232">
          <PaperDefs id="back"/>
          <path d={FLAP} fill="var(--gift-paper-low)"/>
          <g clipPath="url(#back-shape)" transform="translate(6 5) scale(.96)">
            <rect width="336" height="232" fill="var(--gift-letterpress)"/>
            {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M${i * 18 - 120} 0L${i * 18 + 60} 232`} stroke="var(--gift-liner-stripe)" strokeWidth=".6"/>)}
          </g>
        </svg>
      </div>
      <div className="gift-inside-card"><GiftCard/></div>
      <svg viewBox="0 0 336 232" width="336" height="232" className="gift-pocket">
        <PaperDefs id="pocket"/>
        <defs><clipPath id="gift-pocket-clip"><rect width="336" height="232" rx="4"/></clipPath><filter id="gift-crease"><feGaussianBlur stdDeviation="1.2"/></filter></defs>
        <g clipPath="url(#gift-pocket-clip)">
          <path d={LEFT} fill="url(#pocket-left)"/>
          <path d={RIGHT} fill="url(#pocket-right)"/>
          <path d={LEFT} fill="none" stroke="var(--gift-paper-shade)" strokeWidth="1.2" filter="url(#gift-crease)"/>
          <path d={POCKET} fill="url(#pocket-pocket)"/>
          <path d={POCKET} fill="none" stroke="var(--gift-crease)" strokeWidth="2" filter="url(#gift-crease)"/>
          <image href="/envelope-gift-reveal/grain-3.png" width="512" height="512"/>
          <text x="312" y="204" textAnchor="end" className="gift-hand" fontSize="30" fill="var(--gift-pen)" opacity=".9">{GIFT.to}</text>
        </g>
      </svg>
      <div className="gift-flap gift-flap-front">
        <svg width="336" height="232" viewBox="0 0 336 232" className="gift-flap-upper">
          <PaperDefs id="upper"/>
          <path d={FLAP} fill="url(#upper-paper)"/>
          <path d={FLAP} fill="url(#upper-grain)"/>
        </svg>
        <div className="gift-flap-tip">
          <svg width="336" height="232" viewBox="0 0 336 232">
            <PaperDefs id="tip"/>
            <path d={FLAP} fill="url(#tip-paper)"/>
            <path d={FLAP} fill="url(#tip-grain)"/>
            <Seal/>
          </svg>
        </div>
      </div>
    </div>
    <div className="gift-flying-shadow"/>
    <div className="gift-flying-card"><GiftCard/><GiftCard back/></div>
  </div>;
}
