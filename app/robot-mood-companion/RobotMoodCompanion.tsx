"use client";
import {useEffect,useRef} from 'react';
import {Button} from '@/components/ui/button';
import {SkCanvas,SkImage} from './canvas-skia';
import {MOODS,LOOP,FIRST,STOP,CLOSE,HOLD,moodAt,mixColor,drawScene} from './scene';
import './robot-mood-companion.css';

type Props={brand?:string;action?:string;autoPlay?:boolean};
export function RobotMoodCompanion({brand='pip',action='Talk to Pip',autoPlay=false}:Props){
 const root=useRef<HTMLElement>(null),canvas=useRef<HTMLCanvasElement>(null);
 const advance=useRef<()=>void>(()=>{});
 useEffect(()=>{
  const node=root.current,el=canvas.current;if(!node||!el)return;
  const ctx=el.getContext('2d');if(!ctx)return;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const image=new Image();let head:SkImage|null=null,raf=0,last:number|null=null;
  let width=0,height=0,elapsed=0,origin=0,clock=.6,touchedAt=-10,frozen=false,manual=false,frozenTarget=0;
  const texts=Array.from(node.querySelectorAll<HTMLElement>('.pip-mood-box'));
  const dots=Array.from(node.querySelectorAll<HTMLElement>('.pip-dot'));
  const live=node.querySelector<HTMLElement>('.pip-live');let announced=-1;
  const paint=()=>{
   const mo=moodAt(clock);node.style.setProperty('--pip-room',mixColor(MOODS[mo.prev].bg,MOODS[mo.cur].bg,mo.fade));node.style.setProperty('--pip-ink',mixColor(MOODS[mo.prev].ink,MOODS[mo.cur].ink,mo.fade));
   node.dataset.mood=MOODS[mo.cur].name.toLowerCase();node.dataset.reducedMotion=String(reduce.matches);
   texts.forEach((text,k)=>{const o=mo.cur===k?mo.fade:mo.prev===k?1-mo.fade:0;text.style.opacity=String(o);text.style.transform=`translateY(${12*(1-o)}px)`;text.setAttribute('aria-hidden',String(k!==mo.cur));});
   dots.forEach((dot,k)=>{const on=mo.cur===k?mo.fade:mo.prev===k?1-mo.fade:0;dot.style.width=`${8+18*on}px`;dot.style.opacity=String(.3+.7*on);});
   if(announced!==mo.cur){announced=mo.cur;if(live)live.textContent=`${MOODS[mo.cur].name}. ${MOODS[mo.cur].line}`;}
   const dpr=Math.min(devicePixelRatio||1,3);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
   const scale=Math.min(1,width/393);ctx.save();ctx.translate(width/2,height*.52);ctx.scale(scale,scale);drawScene(new SkCanvas(ctx),clock,0,0,head);ctx.restore();
  };
  const resize=()=>{const r=node.getBoundingClientRect();width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio||1,3);el.width=Math.round(width*dpr);el.height=Math.round(height*dpr);paint();};
  const observer=new ResizeObserver(resize);observer.observe(node);
  image.onload=()=>{head=new SkImage(image);paint();};image.src='/robot-mood-companion/robot-head.png';
  const tick=(timestamp:number)=>{
   const dt=last===null?0:(timestamp-last)/1000;last=timestamp;
   if(!reduce.matches&&!document.hidden){elapsed+=dt;if(frozen){const t=clock+dt;if(moodAt(clock).cur!==frozenTarget||moodAt(t).s<STOP-CLOSE-.02)clock=t;else origin+=dt;if(elapsed-touchedAt>HOLD){frozen=false;if(!autoPlay)manual=true;}}else if(autoPlay){clock=(((elapsed-origin)%LOOP)+LOOP)%LOOP;}else if(!manual)clock=.6;paint();}
   raf=requestAnimationFrame(tick);
  };
  advance.current=()=>{if(reduce.matches)return;const mo=moodAt(clock);const next=FIRST+mo.cur*STOP-CLOSE;const t=mo.cur===0&&clock>FIRST+5*STOP?FIRST-CLOSE:((next%LOOP)+LOOP)%LOOP;origin=elapsed-t;clock=t;frozenTarget=(mo.cur+1)%6;frozen=true;manual=false;touchedAt=elapsed;navigator.vibrate?.(10);paint();};
  const visibility=()=>{last=null;};const preference=()=>{last=null;paint();};
  document.addEventListener('visibilitychange',visibility);reduce.addEventListener('change',preference);
  resize();raf=requestAnimationFrame(tick);
  return()=>{cancelAnimationFrame(raf);observer.disconnect();image.onload=null;document.removeEventListener('visibilitychange',visibility);reduce.removeEventListener('change',preference);advance.current=()=>{};};
 },[autoPlay]);
 return <main ref={root} className="pip-screen" aria-label="Pip mood companion">
  <header className="pip-top"><span className="pip-brand">{brand}</span><span className="pip-meta">Battery 82 %</span></header>
  <section className="pip-moods" aria-label="Pip’s mood">{MOODS.map((m,k)=><div key={m.name} className="pip-mood-box" aria-hidden={k!==0}><h1>{m.name}</h1><p>{m.line}</p></div>)}</section>
  <canvas ref={canvas} className="pip-canvas" aria-hidden="true"/>
  <Button variant="secondary" className="pip-touch" aria-label="Pip. Tap to change its mood." onClick={()=>advance.current()}/>
  <footer className="pip-footer"><div className="pip-dots" aria-hidden="true">{MOODS.map(m=><span key={m.name} className="pip-dot"/>)}</div><Button variant="primary" className="pip-action" onClick={()=>advance.current()}>{action}</Button><div className="pip-home-indicator" aria-hidden="true"/></footer>
  <span className="sr-only pip-live" role="status" aria-live="off"/>
 </main>;
}
