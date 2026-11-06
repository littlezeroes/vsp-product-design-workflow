"use client";
import { useEffect,useRef,useState } from "react";
import { Home,Compass,Ticket,Wallet } from "lucide-react";
import { ShortcutIcon } from "../cover/shortcut-icon";
import { AiVoiceButton } from "@/components/vinclub/ai-voice-button";
import { Button } from "@/components/ui/button";
import "./split.css";
const destinations=[{id:"home",label:"Trang chủ",icon:Home},{id:"experiences",label:"Trải nghiệm",icon:Compass},{id:"offers",label:"Ưu đãi",icon:Ticket},{id:"wallet",label:"VinPay",icon:Wallet}];
export default function DuoHome(){
 const left=useRef<HTMLIFrameElement>(null),right=useRef<HTMLIFrameElement>(null);const [view,setView]=useState("home");
 const sendLeft=(next:string,category?:string)=>right.current?.contentWindow?.postMessage({type:"duo-right",view:next,category},location.origin);
 const sendRight=(next:string)=>left.current?.contentWindow?.postMessage({type:"duo-left",view:next},location.origin);
 const navigate=(next:string)=>{setView(next);if(next==="offers"||next==="experiences")sendLeft(next);else sendRight(next);};
 useEffect(()=>{const receive=(event:MessageEvent)=>{if(event.origin!==location.origin)return;if(event.data?.type==="duo-right"){setView(event.data.view);sendLeft(event.data.view,event.data.category);}if(event.data?.type==="duo-left")navigate(event.data.view);};window.addEventListener("message",receive);return()=>window.removeEventListener("message",receive);},[]);
 return <main className="duo-split duo-ipad bg-background text-foreground"><div className="duo-ipad-body"><aside className="duo-icon-rail" aria-label="Điều hướng VinClub"><header><span className="duo-shared-logo" aria-label="VinClub"/></header><nav>{destinations.map(({id,label,icon:Icon})=><Button key={id} variant="secondary" size="32" className="duo-rail-button rounded-14" title={label} aria-label={label} aria-current={view===id?"page":undefined} onClick={()=>navigate(id)}><Icon size={20} strokeWidth={1.7}/></Button>)}</nav></aside><div className="duo-optimized-panes"><section className="duo-pane" aria-label="Home"><iframe ref={left} title="Home" src="/vinclub-duo/panel-home"/></section><section className="duo-pane" aria-label="Trải nghiệm"><iframe ref={right} title="Trải nghiệm" src="/vinclub-duo/experience"/></section></div><div className="duo-ai-floating-bar rounded-28"><Button variant="secondary" className="duo-ai-chat-trigger" aria-label="Chat với AI" onClick={()=>sendRight("ai")}><ShortcutIcon kind="ai" size={36}/><span className="duo-ai-wave" aria-hidden="true">{Array.from({length:9},(_,i)=><i key={i}/>)}</span></Button><AiVoiceButton className="duo-bar-voice" label="Voice" onTranscript={text=>left.current?.contentWindow?.postMessage({type:"duo-left",view:"ai",prompt:text},location.origin)}/></div></div><footer className="duo-shared-indicator"><div className="w-[139px] h-[5px] bg-foreground rounded-full mx-auto"/></footer></main>;
}
