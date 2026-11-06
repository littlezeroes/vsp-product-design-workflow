"use client";
import {useEffect,useRef} from 'react';
import {Button} from '@/components/ui/button';
import {SkCanvas} from './canvas-skia';
import {WALLET_W,WALLET_H,NOTES_W,NOTES_H,drawBack,drawPocket,drawNotes} from './art';
import {LOOP,OUT_AT,SEQUENCE_END,USER_HOLD,heroAt} from './timeline';
import './wallet-unpack-welcome.css';
type Props={overline?:string;title?:string;tagline?:string;subtitle?:string;teaser?:string;buttonLabel?:string;cardLabel?:string;cardNumber?:string;cardExpiry?:string;autoPlay?:boolean;onGetStarted?:()=>void;onBack?:()=>void};
const WAVES=[3,6,9].map(r=>{const a=Math.PI/4;return `M${2+r*Math.cos(a)} ${7-r*Math.sin(a)}A${r} ${r} 0 0 1 ${2+r*Math.cos(a)} ${7+r*Math.sin(a)}`;});
const haptic=()=>navigator.vibrate?.(10);
export function WalletUnpackWelcome({overline='EXPECT MORE FROM YOUR',title='WALLET',tagline='a prepaid wallet designed for the\ncreditworthy',subtitle="A PAYMENT EXPERIENCE THAT'S",teaser='FAST,\nCONVENIENT &',buttonLabel='Get started',cardLabel='CREDIT CARD',cardNumber='1234 5678 9123 XXXX',cardExpiry='12/25',autoPlay=false,onGetStarted,onBack}:Props){
 const root=useRef<HTMLElement>(null),notes=useRef<HTMLCanvasElement>(null),back=useRef<HTMLCanvasElement>(null),pocket=useRef<HTMLCanvasElement>(null);
 const controls=useRef({takeOver:()=>{},letGo:()=>{},play:()=>{}});
 useEffect(()=>{
  const screen=root.current;if(!screen)return;const backEl=back.current,pocketEl=pocket.current,notesEl=notes.current;if(!backEl||!pocketEl||!notesEl)return;
  const init=(el:HTMLCanvasElement,w:number,h:number)=>{const dpr=Math.min(devicePixelRatio||1,3);el.width=w*dpr;el.height=h*dpr;const ctx=el.getContext('2d')!;ctx.scale(dpr,dpr);return ctx;};
  drawBack(new SkCanvas(init(backEl,WALLET_W,WALLET_H)));drawPocket(new SkCanvas(init(pocketEl,WALLET_W,WALLET_H)));const nc=init(notesEl,NOTES_W,NOTES_H);
  const wallets=screen.querySelectorAll<HTMLElement>('.unpack-wallet-layer'),card=screen.querySelector<HTMLElement>('.unpack-card-layer')!,tip=screen.querySelector<HTMLElement>('.unpack-card-tip')!,blank=screen.querySelector<HTMLElement>('.unpack-card-blank')!;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');let clock=0,last:number|null=null,origin=autoPlay?0:-1,playAt=-1,down=false,lastTouch=0,raf=0;
  const sequenceAt=()=>{if(origin>=0&&clock>=origin)return(clock-origin)%LOOP;if(playAt>=0&&clock-playAt<SEQUENCE_END)return clock-playAt;return 0;};
  const paint=()=>{const q=sequenceAt(),h=heroAt(q,reduce.matches);screen.dataset.time=q.toFixed(3);screen.dataset.phase=q<OUT_AT?'rest':q<1.5?'tip':q<4.7?'notes':q<SEQUENCE_END?'return':'rest';screen.dataset.reducedMotion=String(reduce.matches);screen.dataset.walletOpacity=String(h.wallet);
   wallets.forEach(el=>{el.style.opacity=String(h.wallet);el.style.transform=`scale(${h.walletScale})`;});
   card.style.opacity=String(h.card);card.style.transform=`translateY(${h.cardY}px) rotate(${h.turn}deg) scale(${h.cardScale})`;tip.style.transform=`perspective(700px) rotateX(${h.tip}deg)`;blank.style.opacity=String(1-h.face);
   nc.clearRect(0,0,NOTES_W,NOTES_H);if(h.wallet>.001)drawNotes(new SkCanvas(nc),{y:h.note1Y,turn:h.note1Turn,wave:h.note1Wave,blur:h.note1Blur},{y:h.note2Y,turn:h.note2Turn,wave:h.note2Wave,blur:h.note2Blur},h.phase);
  };
  controls.current={takeOver:()=>{down=true;lastTouch=clock;if(origin<0)return;const q=sequenceAt();playAt=q>OUT_AT&&q<SEQUENCE_END?clock-q:-1;origin=-1;},letGo:()=>{down=false;lastTouch=clock;},play:()=>{haptic();if(playAt>=0&&clock-playAt<SEQUENCE_END)return;playAt=clock-OUT_AT;paint();}};
  const frame=(t:number)=>{const dt=last===null?0:(t-last)/1000;last=t;if(!document.hidden)clock+=dt;if(autoPlay&&origin<0&&!down&&clock>=Math.max(lastTouch,playAt>=0?playAt+SEQUENCE_END:0)+USER_HOLD){origin=clock;playAt=-1;}paint();raf=requestAnimationFrame(frame);};
  const visibility=()=>{last=null;};const preference=()=>paint();document.addEventListener('visibilitychange',visibility);reduce.addEventListener('change',preference);paint();raf=requestAnimationFrame(frame);
  return()=>{cancelAnimationFrame(raf);document.removeEventListener('visibilitychange',visibility);reduce.removeEventListener('change',preference);controls.current={takeOver:()=>{},letGo:()=>{},play:()=>{}};};
 },[autoPlay]);
 return <main ref={root} className="unpack-screen" aria-label="Wallet Unpack Welcome" onPointerDown={()=>controls.current.takeOver()} onPointerUp={()=>controls.current.letGo()} onPointerCancel={()=>controls.current.letGo()}>
  <header className="unpack-header"><div className="unpack-top-shade"/><Button variant="secondary" className="unpack-back" aria-label="Back" onClick={()=>{if(onBack)onBack();else if(history.length>1)history.back();else location.assign('/robot-mood-companion');}}><svg width="20" height="12" aria-hidden="true"><path d="M.75 6H20M5.5 1 .75 6l4.75 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></Button><p className="unpack-overline">{overline}</p><h1 className="unpack-title">{title}</h1></header>
  <section className="unpack-scene" aria-label="Animated card and wallet">
   <Button variant="secondary" className="unpack-hero" aria-label="Card and wallet" aria-description="Plays the animation" onClick={()=>{controls.current.takeOver();controls.current.letGo();controls.current.play();}}/>
   <canvas ref={back} className="unpack-layer unpack-wallet-layer unpack-back-art" aria-hidden="true"/>
   <canvas ref={notes} className="unpack-layer unpack-wallet-layer unpack-notes-art" aria-hidden="true"/>
   <div className="unpack-layer unpack-card-layer" aria-hidden="true"><div className="unpack-card-tip"><div className="unpack-card"><div className="unpack-chip"><i/><i/><i/></div><svg className="unpack-contactless" width="14" height="14">{WAVES.map(d=><path key={d} d={d} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>)}</svg><span className="unpack-card-label">{cardLabel}</span><span className="unpack-card-number">{cardNumber}</span><span className="unpack-card-expiry">{cardExpiry}</span></div><div className="unpack-card-blank"/></div></div>
   <canvas ref={pocket} className="unpack-layer unpack-wallet-layer unpack-pocket-art" aria-hidden="true"/>
  </section>
  <footer className="unpack-footer"><p className="unpack-tagline">{tagline}</p><svg className="unpack-rule" width="100%" height="1" aria-hidden="true"><line x1="0" y1=".5" x2="100%" y2=".5" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5,2.5"/></svg><p className="unpack-teaser">{teaser}</p><div className="unpack-bottom-shade"/><p className="unpack-subtitle">{subtitle}</p><Button variant="primary" className="unpack-start" onClick={()=>{haptic();onGetStarted?.();}}>{buttonLabel}</Button><div className="unpack-home-indicator" aria-hidden="true"/></footer>
 </main>;
}
