"use client";

import { useEffect, useRef, useState } from "react";
import { ShortcutIcon } from "./shortcut-icon";
import { Button } from "@/components/ui/button";

export function PointsScene() {
  const host=useRef<HTMLDivElement>(null);
  const [success,setSuccess]=useState(false);
  const [settled,setSettled]=useState(false);
  const restart=useRef<()=>void>(()=>{});
  const showCover=useRef<()=>void>(()=>{setSuccess(false);setSettled(true);});
  useEffect(()=>{
    const node=host.current;
    if(!node)return;
    let dead=false;
    let dispose=()=>{};
    import("three").then(async T=>{
      if(dead)return;
      const renderer=new T.WebGLRenderer({antialias:true,alpha:true});
      renderer.setPixelRatio(Math.min(devicePixelRatio,2));
      renderer.setClearColor(0,0);
      renderer.outputColorSpace=T.SRGBColorSpace;
      renderer.toneMapping=T.ACESFilmicToneMapping;
      node.appendChild(renderer.domElement);
      const scene=new T.Scene();
      const camera=new T.PerspectiveCamera(34,1,.1,100);camera.position.set(0,0,9);
      const style=getComputedStyle(node);
      const ink=style.getPropertyValue("--color-grey-1000").trim();
      const gold=new T.Color(style.getPropertyValue("--color-yellow-500").trim()).lerp(new T.Color(style.getPropertyValue("--color-orange-400").trim()),.2);
      const studioWhite=style.getPropertyValue("--color-grey-00").trim();
      scene.add(new T.HemisphereLight(studioWhite,style.getPropertyValue("--secondary").trim(),1.3));
      for(const [x,y,z,power] of [[-3,4,5,2],[4,1,3,1.8],[0,-3,4,.8]]){const light=new T.DirectionalLight(studioWhite,power);light.position.set(x,y,z);scene.add(light);}
      const {RoomEnvironment}=await import("three/addons/environments/RoomEnvironment.js");
      if(dead){renderer.dispose();return;}
      const environment=new RoomEnvironment();const pmrem=new T.PMREMGenerator(renderer);const env=pmrem.fromScene(environment,.06);scene.environment=env.texture;environment.dispose();pmrem.dispose();
      const card=new T.Group();scene.add(card);
      const silver=new T.MeshStandardMaterial({color:style.getPropertyValue("--color-grey-200").trim(),metalness:.95,roughness:.2});
      const body=new T.Mesh(new T.BoxGeometry(3.1,1.94,.065),silver);card.add(body);
      const faceCanvas=document.createElement("canvas");faceCanvas.width=1000;faceCanvas.height=620;
      const ctx=faceCanvas.getContext("2d")!;
      await Promise.all([400,500,600].map(weight=>document.fonts.load(`${weight} 22px "Google Sans Flex"`)));
      const cardImage=new Image();cardImage.src="/vinclub-assets/cards/gold.png";
      await cardImage.decode().catch(()=>{});
      if(dead){renderer.dispose();env.dispose();return;}
      ctx.clearRect(0,0,1000,620);ctx.drawImage(cardImage,0,0,1000,620);
      ctx.fillStyle=ink;ctx.font="500 48px Georgia";ctx.fillText("VinClub Elite",85,130);ctx.font='500 22px "Google Sans Flex"';ctx.fillText("MINH ANH",85,520);
      ctx.font='600 38px "Google Sans Flex"';ctx.fillText("300.000",85,440);ctx.font='22px "Google Sans Flex"';ctx.fillText("VPoint",265,440);
      const faceTexture=new T.CanvasTexture(faceCanvas);faceTexture.colorSpace=T.SRGBColorSpace;
      const face=new T.Mesh(new T.PlaneGeometry(3.1,1.94),new T.MeshBasicMaterial({map:faceTexture,transparent:true}));face.position.z=.04;card.add(face);
      const coinMaterial=new T.MeshStandardMaterial({color:gold,metalness:.78,roughness:.3,envMapIntensity:.65,emissive:gold,emissiveIntensity:.04});
      const polished=new T.MeshStandardMaterial({color:gold,metalness:.85,roughness:.24,envMapIntensity:.6});
      const darkGold=new T.MeshStandardMaterial({color:style.getPropertyValue("--color-yellow-700").trim(),metalness:.8,roughness:.3});
      const coin=new T.Group();scene.add(coin);
      const disc=new T.Mesh(new T.CylinderGeometry(.64,.64,.105,96),coinMaterial);disc.rotation.x=Math.PI/2;coin.add(disc);
      const {SVGLoader}=await import("three/addons/loaders/SVGLoader.js");
      const logoSvg=await fetch("/vinclub-assets/vinclub-logo.svg").then(response=>response.text());
      if(dead){renderer.dispose();env.dispose();return;}
      const logoData=new SVGLoader().parse(logoSvg);
      const logoGeometry=logoData.paths.flatMap(path=>SVGLoader.createShapes(path)).map(shape=>new T.ExtrudeGeometry(shape,{depth:.38,bevelEnabled:true,bevelSize:.12,bevelThickness:.08,bevelSegments:3,steps:1}));
      for(const side of [1,-1]){
        const rim=new T.Mesh(new T.TorusGeometry(.59,.024,12,96),polished);rim.position.z=side*.061;coin.add(rim);
        const inset=new T.Mesh(new T.TorusGeometry(.48,.008,8,96),darkGold);inset.position.z=side*.058;coin.add(inset);
        const emblem=new T.Group();for(const geometry of logoGeometry)emblem.add(new T.Mesh(geometry,darkGold));const bounds=new T.Box3().setFromObject(emblem);const center=bounds.getCenter(new T.Vector3());emblem.children.forEach(child=>child.position.sub(center));emblem.scale.set(.048,-.048,.048);emblem.position.z=side*.075;if(side<0)emblem.rotation.y=Math.PI;coin.add(emblem);
      }
      for(let i=0;i<72;i++){const a=i/72*Math.PI*2;const notch=new T.Mesh(new T.BoxGeometry(.009,.026,.1),polished);notch.position.set(Math.cos(a)*.638,Math.sin(a)*.638,0);notch.rotation.z=a-Math.PI/2;coin.add(notch);}
      const shock=new T.Mesh(new T.TorusGeometry(.68,.018,10,96),new T.MeshBasicMaterial({color:gold,transparent:true,opacity:0}));scene.add(shock);
      const sparkles=Array.from({length:32},(_,i)=>{const mesh=new T.Mesh(new T.OctahedronGeometry(.05),new T.MeshStandardMaterial({color:gold,metalness:.8,roughness:.15}));scene.add(mesh);return{mesh,i};});
      const glowMaterial=new T.ShaderMaterial({
        uniforms:{uTime:{value:0},uStrength:{value:0},uBlue:{value:new T.Color(style.getPropertyValue("--color-yellow-300").trim())},uPurple:{value:new T.Color(style.getPropertyValue("--color-orange-300").trim())},uPink:{value:new T.Color(style.getPropertyValue("--color-yellow-600").trim())},uGold:{value:gold}},
        vertexShader:`varying vec2 vPosition;void main(){vPosition=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
        fragmentShader:`varying vec2 vPosition;uniform float uTime;uniform float uStrength;uniform vec3 uBlue;uniform vec3 uPurple;uniform vec3 uPink;uniform vec3 uGold;
        void main(){vec2 q=abs(vPosition)-vec2(1.43,.85);float d=length(max(q,0.0))+min(max(q.x,q.y),0.0)-.12;if(d<-.025)discard;float theta=atan(vPosition.y,vPosition.x)+uTime*1.3;float phase=fract(theta/6.28318);vec3 col=phase<.25?mix(uBlue,uPurple,phase*4.0):phase<.5?mix(uPurple,uPink,(phase-.25)*4.0):phase<.75?mix(uPink,uGold,(phase-.5)*4.0):mix(uGold,uBlue,(phase-.75)*4.0);float core=exp(-abs(d)*85.0);float halo=exp(-abs(d)*7.0)*.75;float wide=exp(-abs(d)*3.0)*.3;float a=(core+halo+wide)*uStrength;gl_FragColor=vec4(col*1.25,a);}`,
        transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide,
      });
      const cardLightMaterial=new T.MeshBasicMaterial({color:gold,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false});
      const cardLight=new T.Mesh(new T.PlaneGeometry(3.07,1.91),cardLightMaterial);cardLight.position.z=.052;card.add(cardLight);
      const glow=new T.Mesh(new T.PlaneGeometry(4.5,3.35),glowMaterial);glow.position.z=-.05;card.add(glow);
      const resize=new ResizeObserver(()=>{const w=node.clientWidth,h=node.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();});resize.observe(node);
      let start=performance.now(),frame=0,announced=false,finished=false;
      const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
      const paintTotal=(total:string)=>{ctx.clearRect(0,0,1000,620);ctx.drawImage(cardImage,0,0,1000,620);ctx.fillStyle=ink;ctx.font="500 48px Georgia";ctx.fillText("VinClub Elite",85,130);ctx.font='500 22px "Google Sans Flex"';ctx.fillText("MINH ANH",85,520);ctx.font='600 38px "Google Sans Flex"';ctx.fillText(total,85,440);ctx.font='22px "Google Sans Flex"';ctx.fillText("VPoint",265,440);faceTexture.needsUpdate=true;};
      showCover.current=()=>{start=performance.now()-7000;announced=true;finished=true;paintTotal("300.500");setSuccess(false);setSettled(true);};
      restart.current=()=>{start=performance.now();announced=false;finished=false;paintTotal("300.000");setSuccess(false);setSettled(false);};
      const draw=(now:number)=>{
        const t=reduced?7:(now-start)/1000;
        const tilt=Math.exp(-Math.max(0,t-4)*2);
        card.rotation.set(.1*tilt,-.24*tilt,-.045*tilt);
        card.position.y=.65+.03*Math.sin(t*1.4)*tilt;
        const impact=Math.min(1,Math.max(0,(t-3.8)/.55));
        card.scale.setScalar(1+Math.sin(impact*Math.PI)*.07);
        glowMaterial.uniforms.uTime.value=t;
        const ignite=Math.min(1,Math.max(0,(t-3.2)/.55));const fade=Math.exp(-Math.max(0,t-4.6)*1.5);glowMaterial.uniforms.uStrength.value=ignite*fade*(1.3+Math.sin(impact*Math.PI)*1.7);
        cardLightMaterial.opacity=Math.sin(impact*Math.PI)*.28;
        const screenStrength=reduced?0:Math.min(1,t/.5)*Math.exp(-Math.max(0,t-4.8)*2);
        node.parentElement?.style.setProperty("--aura-strength",String(screenStrength));
        node.parentElement?.style.setProperty("--aura-angle",`${t*95}deg`);
        node.parentElement?.style.setProperty("--source-strength",String(reduced?0:Math.min(1,t/.45)*Math.exp(-Math.max(0,t-1.7)*1.8)));
        const fly=Math.min(1,Math.max(0,(t-2.6)/1.2));
        const ease=fly*fly*(3-2*fly);
        const enter=Math.min(1,Math.max(0,(t-.3)/1.3));const rise=1-Math.pow(1-enter,3);
        coin.visible=t>.3&&t<3.8;
        coin.position.set(Math.sin(enter*Math.PI)*.16*(1-ease)-.9*ease,(-3.2+2.05*rise)*(1-ease)+.4*ease, .7+.55*rise+Math.sin(fly*Math.PI)*.65-.95*ease);
        const spin=t<2.2?Math.min(1,t/2.2)*Math.PI*2:Math.PI*2;
        coin.rotation.set(.12*Math.sin(t*2)*(1-ease),spin+ease*Math.PI*2,-.06+ease*.2);
        coin.scale.setScalar((.8+.2*Math.sin(Math.min(1,enter)*Math.PI/2))*(1-ease*.94));
        const pulse=Math.min(1,Math.max(0,(t-3.65)/.8));
        shock.visible=false;shock.position.set(-.45,.5,.15);shock.scale.setScalar(1+pulse*2.7);(shock.material as InstanceType<typeof T.MeshBasicMaterial>).opacity=(1-pulse)*.65;
        sparkles.forEach(({mesh,i})=>{const p=Math.min(1,Math.max(0,(t-3.7)/1.1));const a=i/32*Math.PI*2;mesh.visible=p>0&&p<1;mesh.position.set(-.3+Math.cos(a)*p*1.8,.55+Math.sin(a)*p*1.4,.25+Math.sin(i)*p);mesh.scale.setScalar(1-p);mesh.rotation.set(p*5,i,p*4);});
        if(t>3.85&&!announced){announced=true;paintTotal("300.500");setSuccess(true);}
        if(t>5.7&&!finished){finished=true;setSuccess(false);setSettled(true);}
        renderer.render(scene,camera);frame=requestAnimationFrame(draw);
      };frame=requestAnimationFrame(draw);
      dispose=()=>{cancelAnimationFrame(frame);resize.disconnect();scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();for(const material of Array.isArray(o.material)?o.material:[o.material])material.dispose();}});faceTexture.dispose();env.dispose();renderer.dispose();renderer.domElement.remove();};
    }).catch(()=>setSettled(true));
    const receive=(event:MessageEvent)=>{if(event.origin!==location.origin)return;if(event.data?.type==="duo-points")restart.current();if(event.data?.type==="duo-cover-show")showCover.current();};window.addEventListener("message",receive);
    return()=>{dead=true;dispose();window.removeEventListener("message",receive);};
  },[]);
  return <section className="duo-points-scene" aria-label="Thẻ VinClub và animation tích điểm 3D"><div className="duo-bottom-source" aria-hidden="true"/><div ref={host} className="duo-points-canvas"/><div className={`duo-points-success ${success?"is-success":""}`} role="status"><span className="duo-success-check">✓</span><strong>+500 <small>VPoint</small></strong><p>Tích điểm thành công</p></div><nav className={`duo-cover-shortcuts px-[22px] ${settled?"is-ready":""}`} aria-label="Đi nhanh" inert={!settled}><div className="duo-cover-wallet"><span>Số dư VinPay</span><strong>28.650.000đ</strong></div><div className="duo-cover-shortcut-grid">{[{label:"Trải nghiệm",view:"experiences",},{label:"Ưu đãi",view:"offers",},{label:"VinPay",view:"wallet",},{label:"AI Voice",view:"ai",}].map(({label,view})=><Button key={view} variant="secondary" className="duo-cover-shortcut" onClick={()=>parent.postMessage({type:"duo-open",view},location.origin)}><ShortcutIcon kind={view}/><span>{label}</span></Button>)}</div></nav></section>;
}
