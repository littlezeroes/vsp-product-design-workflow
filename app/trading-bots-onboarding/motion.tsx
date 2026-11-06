/* Physical spring adapter: preserves the native mass/stiffness/damping parameters. */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {useEffect,useState,useSyncExternalStore} from 'react';
import {View,Text} from './native';
let version=0;const listeners=new Set<()=>void>();let queued=false;function emit(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;version++;listeners.forEach(f=>f())})}const subscribe=(f:()=>void)=>{listeners.add(f);return()=>{listeners.delete(f)}};const snapshot=()=>version;
export type SharedValue<T>={get:()=>T;set:(v:any)=>void};export type WithSpringConfig={mass:number;stiffness:number;damping:number};
type Anim={target:number;duration:number;delay?:number;sample:(t:number,from:number)=>number};
export function withTiming(target:number,{duration=300,easing=(t:number)=>t}:any={}):Anim{return {target,duration,sample:(t,from)=>from+(target-from)*easing(Math.min(1,t/duration))}}
export function withSpring(target:number,c:WithSpringConfig):Anim{const w=Math.sqrt(c.stiffness/c.mass),z=c.damping/(2*Math.sqrt(c.stiffness*c.mass));const d=w*Math.sqrt(Math.max(.0001,1-z*z));return {target,duration:Math.max(600,1000*8/(z*w)),sample:(t,from)=>target+(from-target)*Math.exp(-z*w*t/1000)*(Math.cos(d*t/1000)+z*w/d*Math.sin(d*t/1000))}}
export function withDelay(delay:number,a:Anim):Anim{return {...a,delay:(a.delay||0)+delay}}
export function useSharedValue<T>(initial:T):SharedValue<T>{const [holder]=useState(()=>{let value=initial;let frame=0;return {get:()=>value,set:(next:any)=>{cancelAnimationFrame(frame);if(typeof next!=='object'||!next?.sample){value=next;emit();return}const from=Number(value),start=performance.now()+(next.delay||0);const tick=()=>{const t=performance.now()-start;if(t<0){frame=requestAnimationFrame(tick);return}value=(t>=next.duration?next.target:next.sample(t,from)) as T;emit();if(t<next.duration)frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick)},dispose:()=>cancelAnimationFrame(frame)}});useEffect(()=>()=>holder.dispose(),[holder]);return holder}
export function useAnimatedStyle(fn:()=>any){useSyncExternalStore(subscribe,snapshot,()=>0);return fn()}
export function useReducedMotion(){return useSyncExternalStore(f=>{const m=matchMedia('(prefers-reduced-motion: reduce)');m.addEventListener('change',f);return()=>m.removeEventListener('change',f)},()=>matchMedia('(prefers-reduced-motion: reduce)').matches,()=>false)}
export const Easing={bezier:(a:number,b:number,c:number,d:number)=>(x:number)=>{let t=x;for(let i=0;i<7;i++){const q=3*(1-t)*(1-t)*t*a+3*(1-t)*t*t*c+t*t*t;const slope=3*(1-t)*(1-t)*a+6*(1-t)*t*(c-a)+3*t*t*(1-c);if(Math.abs(slope)>.00001)t=Math.max(0,Math.min(1,t-(q-x)/slope))}return 3*(1-t)*(1-t)*t*b+3*(1-t)*t*t*d+t*t*t}};
const Animated={View,Text};export default Animated;
