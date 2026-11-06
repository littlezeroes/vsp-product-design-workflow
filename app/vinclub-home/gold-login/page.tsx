'use client'
import {useCallback,useEffect,useRef,useState} from 'react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {StatusBar} from '@/components/ui/header'
import {FixedBottom} from '@/components/ui/fixed-bottom'
import {Card} from '@/components/ui/card'
import './style.css'

function Logo({onReady}:{onReady:()=>void}){
 const host=useRef<HTMLDivElement>(null)
 useEffect(()=>{let disposed=false;let cleanup=()=>{};
 void(async()=>{const T=await import('three');const {SVGLoader}=await import('three/addons/loaders/SVGLoader.js');const el=host.current;if(!el||disposed)return;
 const css=getComputedStyle(el);const gold=css.getPropertyValue('--login-gold').trim();const white=css.getPropertyValue('--foreground').trim();
 const renderer=new T.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(280,220);renderer.toneMapping=T.ACESFilmicToneMapping;el.appendChild(renderer.domElement);
 const scene=new T.Scene();const camera=new T.PerspectiveCamera(35,280/220,.1,100);camera.position.z=7;
 const group=new T.Group();scene.add(group);scene.add(new T.AmbientLight(white,1.1));const light=new T.DirectionalLight(gold,5);light.position.set(-3,2,4);scene.add(light);const fill=new T.DirectionalLight(white,2);fill.position.set(3,-1,3);scene.add(fill);
 const material=new T.MeshStandardMaterial({color:gold,metalness:.65,roughness:.24});
 cleanup=()=>{renderer.setAnimationLoop(null);scene.traverse(n=>{if(n instanceof T.Mesh)n.geometry.dispose()});material.dispose();renderer.dispose();renderer.domElement.remove()};
 const svg=await fetch('/brand-splash/vinclub-symbol.svg').then(r=>r.text());if(disposed)return;
 const data=new SVGLoader().parse(svg);for(const path of data.paths){for(const shape of SVGLoader.createShapes(path)){const geo=new T.ExtrudeGeometry(shape,{depth:7,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:1.5,bevelThickness:1.5});group.add(new T.Mesh(geo,material))}}
 const box=new T.Box3().setFromObject(group);const size=box.getSize(new T.Vector3());const center=box.getCenter(new T.Vector3());group.children.forEach(n=>n.position.sub(center));const scale=2.5/Math.max(size.x,size.y);group.scale.set(scale,-scale,scale);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const start=performance.now();onReady();renderer.setAnimationLoop(()=>{const t=reduced?1:Math.min(1,(performance.now()-start)/1100);const ease=1-Math.pow(1-t,3);group.rotation.y=-.35*(1-ease);group.rotation.x=.12*(1-ease);light.position.set(-3+6*Math.min(t/.65,1),2-3*t,4);renderer.render(scene,camera)});
 })().catch(()=>{if(!disposed)onReady()});return()=>{disposed=true;cleanup()}
 },[onReady]);return <div className="login-logo" ref={host} role="img" aria-label="Logo VinClub 3D"/>
}
function Trial(){const [ready,setReady]=useState(false);const [leaving,setLeaving]=useState(false);const [phone,setPhone]=useState('');const [home,setHome]=useState(false);const timer=useRef<ReturnType<typeof setTimeout>|null>(null);useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
 const onReady=useCallback(()=>setReady(true),[]);
 return <main className="login-trial dark bg-background text-foreground" data-ready={ready} data-leaving={leaving}>
 {home?<iframe className="login-home" title="Home VinClub" src="/vinclub-home?embedded=1&launch=0"/>:<><header><StatusBar/><nav className="h-[56px] px-[22px] flex items-center"><span className="login-wordmark">VINCLUB</span></nav></header>
 <section className="login-stage"><Logo onReady={onReady}/><span className="login-transfer" aria-hidden="true"/><div className="login-welcome px-[22px] pt-[24px] pb-[12px]"><p className="text-sm text-foreground-secondary">MỌI KẾT NỐI. MỘT VINCLUB.</p><h1 className="text-2xl font-semibold mt-[8px]">Chào mừng bạn.</h1></div>
 <Card className="login-card rounded-28 border-0 mx-[22px] p-[22px] shadow-none"><span className="login-edge" aria-hidden="true"/><form onSubmit={e=>{e.preventDefault();setLeaving(true);timer.current=setTimeout(()=>setHome(true),650)}}><label htmlFor="login-phone" className="text-sm font-medium">Số điện thoại</label><Input id="login-phone" className="login-input rounded-14 mt-[12px] h-[56px]" type="tel" inputMode="tel" autoComplete="tel" placeholder="Nhập số điện thoại" value={phone} onChange={e=>setPhone(e.target.value)} required pattern="[0-9+ ()-]{9,15}"/><p className="text-xs text-foreground-secondary mt-[12px]">Trải nghiệm mẫu · không gửi mã xác thực.</p><Button type="submit" variant="primary" className="login-submit w-full mt-[24px]" disabled={!ready||leaving}>{leaving?'Đang mở VinClub…':'Tiếp tục'}</Button></form></Card></section></>}
 <FixedBottom className="login-bottom !absolute !border-0 !shadow-none !bg-transparent !pb-[8px]"><p className="text-xs text-foreground-secondary mb-[16px]">VinClub · by VSF</p><div className="w-[139px] h-[5px] bg-foreground rounded-full mx-auto"/></FixedBottom>
 </main>
}
export default function Page(){const [replay,setReplay]=useState(0);return <div className="login-preview"><Trial key={replay}/><Button className="login-replay" variant="secondary" onClick={()=>setReplay(x=>x+1)}>Phát lại</Button></div>}
