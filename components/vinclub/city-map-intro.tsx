"use client";

import { useEffect, useRef, useState } from "react";

export function CityMapIntro({ready,dismissed}:{ready:boolean;dismissed:boolean}) {
  const video = useRef<HTMLVideoElement>(null);
  const [theme,setTheme] = useState<"light"|"dark">();
  const [ended,setEnded] = useState(false);
  const [skip,setSkip] = useState(false);
  const [removed,setRemoved] = useState(false);
  const fading = skip || dismissed || (ended && ready);
  useEffect(()=>{
    const reduced=matchMedia("(prefers-reduced-motion: reduce)");
    const sync=()=>setTheme(document.documentElement.classList.contains("dark")?"dark":"light");
    sync();
    const motion=()=>{if(reduced.matches)setSkip(true);};motion();
    reduced.addEventListener("change",motion);
    const observer=new MutationObserver(sync);observer.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});
    const timeout=setTimeout(()=>setSkip(true),15000);
    return()=>{observer.disconnect();reduced.removeEventListener("change",motion);clearTimeout(timeout);};
  },[]);
  useEffect(()=>{
    if(theme&&!skip&&!dismissed)video.current?.play().catch(()=>setSkip(true));
  },[theme,skip,dismissed]);
  useEffect(()=>{
    if(!fading)return;
    const timer=setTimeout(()=>{video.current?.pause();setRemoved(true);},650);
    return()=>clearTimeout(timer);
  },[fading]);
  if(!theme||removed)return null;
  return <video ref={video} key={theme} className="mini-city-intro" data-intro-phase={fading?"handoff":ended?"waiting-for-map":"playing"} src={`/vinclub-assets/city/map-intro-${theme}.mp4?v=1`} muted autoPlay playsInline preload="auto" disablePictureInPicture aria-hidden="true" onEnded={()=>setEnded(true)} onError={()=>setSkip(true)}/>;
}
