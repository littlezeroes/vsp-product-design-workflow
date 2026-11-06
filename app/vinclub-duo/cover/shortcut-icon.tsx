"use client";
import { DailyIcon } from "@/components/vinclub/daily-icons";
import { AiAvatar } from "@/components/vinclub/ai-avatar";
export function ShortcutIcon({kind,size=56}:{kind:string;size?:number}) {
 return <span className="duo-shortcut-art" aria-hidden="true">{kind==="ai"?<AiAvatar size={size}/>:<DailyIcon name={kind==="wallet"?"payment":kind==="offers"?"shopping":"travel"} size={size} approach={1}/>}</span>;
}
