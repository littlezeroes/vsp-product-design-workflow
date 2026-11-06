"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Minus, Plus, RotateCcw, MapPin, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./mini-city.css";
import { CityMapIntro } from "./city-map-intro";

type Mode = "city" | "mall" | "store" | "product" | "delivery";
const cityPlaces=[{id:"vincom",label:"Vincom",x:42,y:42},{id:"vincom-center",label:"Vincom Center",x:15,y:25},{id:"vincom-plaza",label:"Vincom Plaza",x:80,y:55},{id:"winmart",label:"WinMart",x:20,y:60},{id:"vinmec",label:"Vinmec",x:70,y:30},{id:"events",label:"Sự kiện",x:70,y:65},{id:"home",label:"Nhà bạn",x:75,y:68}];
type Anchor = {id:string;label:string;x:number;y:number;hidden?:boolean};
const places: Record<Mode,Anchor[]> = {
  city:cityPlaces,
  mall:[{id:"may",label:"Mây Studio",x:24,y:50},{id:"lumi",label:"Lumi Beauty",x:50,y:50},{id:"pulse",label:"Pulse Lab",x:76,y:50}],
  delivery:cityPlaces,
  store:[],product:[],
};

export function MiniCity({mode="city",onSelect,activeStore,progress=0,productId="sneakers",travelDirection="to-home",focus,productColor,productExploded=false,storeLevel=1,buildingOpen=false,onExpand,fullscreen=false,focusRevision=0,entrance=false,visiblePlaceIds}:{mode?:Mode;onSelect?:(id:string)=>void;activeStore?:string;progress?:number;productId?:string;travelDirection?:"to-mall"|"to-home";focus?:string;productColor?:string;productExploded?:boolean;storeLevel?:number;buildingOpen?:boolean;cinematic?:boolean;onExpand?:()=>void;fullscreen?:boolean;focusRevision?:number;entrance?:boolean;visiblePlaceIds?:string[]}) {
  const asset=mode==="mall"?"mall":mode==="store"?`store-${activeStore||"may"}`:mode==="product"?`product-${productId}`:"city";
  const host=useRef<HTMLDivElement>(null);
  const videoIntro=asset==="city"&&fullscreen&&entrance;
  const [introDismissed,setIntroDismissed]=useState(false);
  useEffect(()=>{if(focus||focusRevision>0)setIntroDismissed(true);},[focus,focusRevision]);
  const visiblePlaces=useRef(visiblePlaceIds);const refreshLabels=useRef<(()=>void)|null>(null);
  useEffect(()=>{visiblePlaces.current=visiblePlaceIds;refreshLabels.current?.();},[visiblePlaceIds]);
  const callback=useRef(onSelect);const expandCallback=useRef(onExpand);
  const productOptions=useRef({productColor,productExploded,storeLevel,buildingOpen});
  const updateProduct=useRef<(()=>void)|null>(null);
  useEffect(()=>{expandCallback.current=onExpand;},[onExpand]);
  useEffect(()=>{productOptions.current={productColor,productExploded,storeLevel,buildingOpen};updateProduct.current?.();},[productColor,productExploded,storeLevel,buildingOpen]); const currentProgress=useRef(progress); const selected=useRef(activeStore);
  useEffect(()=>{callback.current=onSelect;},[onSelect]);
  const updateProgress=useRef<((p:number)=>void)|null>(null);
  const updateSelection=useRef<((id?:string)=>void)|null>(null);
  const control=useRef<((action:"in"|"out"|"reset"|"street")=>void)|null>(null);
  const focusCamera=useRef<((id?:string)=>void)|null>(null);
  const selectPlace=useRef<((id:string)=>void)|null>(null);
    const direction=useRef(travelDirection);
  const focusValue=useRef(focus);
  const [status,setStatus]=useState<"loading"|"ready"|"fallback">("loading");
  const [anchors,setAnchors]=useState<Anchor[]>(places[mode]);
  useEffect(()=>{currentProgress.current=progress;updateProgress.current?.(progress);},[progress]);
  useEffect(()=>{selected.current=activeStore;updateSelection.current?.(activeStore);},[activeStore]);
  useEffect(()=>{direction.current=travelDirection;},[travelDirection]);
  useEffect(()=>{focusValue.current=focus;focusCamera.current?.(focus);},[focus,focusRevision]);
  useEffect(()=>{
    const node=host.current;if(!node)return;
    let dead=false;let cleanup=()=>{};queueMicrotask(()=>{if(!dead)setStatus("loading");});
    Promise.all([import("three"),import("three/addons/loaders/GLTFLoader.js"),import("three/addons/controls/OrbitControls.js"),import("three/addons/environments/RoomEnvironment.js"),import("three/addons/loaders/DRACOLoader.js")]).then(([T,{GLTFLoader},{OrbitControls},{RoomEnvironment},{DRACOLoader}])=>{
      if(dead)return;
      let renderer:InstanceType<typeof T.WebGLRenderer>;
      try{renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:"low-power"});}catch{setStatus("fallback");return;}
      renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.78;
      renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
      renderer.domElement.setAttribute("aria-label",mode==="product"?"Sản phẩm 3D Blender. Kéo để xoay và phóng to.":mode==="store"?"Cửa hàng 3D Blender. Kéo để khám phá nội thất.":mode==="mall"?"Mô hình Blender ba cửa hàng bên trong Vincom":"Bản đồ đô thị 3D Blender với Vincom, nhân vật đi bộ và xe Green SM");renderer.domElement.setAttribute("role","img");
      node.appendChild(renderer.domElement);
      const scene=new T.Scene();
      const room=new RoomEnvironment();const pmrem=new T.PMREMGenerator(renderer);const environment=pmrem.fromScene(room,.06);scene.environment=environment.texture;scene.environmentIntensity=.7;room.dispose();pmrem.dispose();
      const white=getComputedStyle(node).getPropertyValue("--color-white").trim();
      const paper=getComputedStyle(node).getPropertyValue("--background").trim();
            const accent=getComputedStyle(node).getPropertyValue("--success").trim();
      scene.add(new T.HemisphereLight(white||paper,paper,.85));
      const hemisphere=scene.children.find(o=>o instanceof T.HemisphereLight) as InstanceType<typeof T.HemisphereLight>;
      const sun=new T.DirectionalLight(white||paper,1.8);sun.position.set(-8,12,7);sun.castShadow=true;sun.shadow.mapSize.set(asset==="city"?2048:1024,asset==="city"?2048:1024);sun.shadow.camera.left=-10;sun.shadow.camera.right=10;sun.shadow.camera.top=10;sun.shadow.camera.bottom=-10;sun.shadow.normalBias=.012;sun.shadow.bias=-.00015;scene.add(sun);const cityFog=new T.FogExp2(paper,.0035);let rim:InstanceType<typeof T.DirectionalLight>|undefined;let fill:InstanceType<typeof T.DirectionalLight>|undefined;if(asset==="city")scene.fog=cityFog;{rim=new T.DirectionalLight(white||paper,.75);rim.position.set(8,9,-10);scene.add(rim);const cool=new T.Color(getComputedStyle(node).getPropertyValue("--info").trim()).lerp(new T.Color(white||paper),.9);fill=new T.DirectionalLight(cool,.25);fill.position.set(10,4,5);scene.add(fill);sun.shadow.camera.left=-14;sun.shadow.camera.right=14;sun.shadow.camera.top=14;sun.shadow.camera.bottom=-14;}
      const tuneLighting=()=>{const bg=new T.Color(getComputedStyle(node).getPropertyValue("--background").trim());const dark=(bg.r+bg.g+bg.b)/3<.2;sun.intensity=dark?1.65:2.1;hemisphere.intensity=dark?.12:.16;scene.environmentIntensity=dark?.3:.4;if(rim)rim.intensity=dark?.95:.85;if(fill)fill.intensity=dark?.20:.24;renderer.toneMappingExposure=asset==="city"?(dark?.65:.62):(dark?.72:.70);sun.shadow.radius=3;node.dataset.lighting="studio-key-fill-rim";};tuneLighting();
      const fixedCity=asset==="city";const camera=fixedCity?new T.OrthographicCamera(-10,10,8,-8,.05,500):new T.PerspectiveCamera(42,1,.05,500);node.dataset.cameraKind=fixedCity?"orthographic":"perspective";node.dataset.viewStage="city";node.dataset.fixedView=String(fixedCity);camera.position.set(asset==="city"?14:mode==="product"?4:9,asset==="city"?18:mode==="product"?3:10,asset==="city"?16:mode==="product"?5:12);
      const orbit=new OrbitControls(camera,renderer.domElement);orbit.enableDamping=!fixedCity;orbit.dampingFactor=.12;orbit.enablePan=mode!=="product";orbit.enableZoom=true;orbit.minZoom=.65;orbit.maxZoom=6;orbit.minPolarAngle=.28;orbit.maxPolarAngle=1.48;orbit.minDistance=.5;orbit.maxDistance=1000;orbit.enabled=!fixedCity;if(asset==="city"){orbit.touches.ONE=T.TOUCH.PAN;orbit.touches.TWO=T.TOUCH.DOLLY_ROTATE;orbit.mouseButtons.LEFT=T.MOUSE.PAN;orbit.mouseButtons.RIGHT=T.MOUSE.ROTATE;}
      const reduced=matchMedia("(prefers-reduced-motion: reduce)");
      let preparing=false;let firstRendered=false;let model:InstanceType<typeof T.Group>|null=null;let car:InstanceType<typeof T.Object3D>|undefined;
      let walker:InstanceType<typeof T.Object3D>|undefined;
      const limbs:InstanceType<typeof T.Object3D>[]=[];
      let productFocus:InstanceType<typeof T.Object3D>|undefined;
      const articulated:{object:InstanceType<typeof T.Object3D>;base:InstanceType<typeof T.Vector3>;offset:InstanceType<typeof T.Vector3>}[]=[];
      const tintMaterials:InstanceType<typeof T.MeshStandardMaterial>[]=[];
      const floors:InstanceType<typeof T.Object3D>[]=[];const cityFloors:InstanceType<typeof T.Object3D>[]=[];const facades:InstanceType<typeof T.MeshStandardMaterial>[]=[];
      updateProduct.current=()=>{const value=productOptions.current.productColor||"";const token=value.includes("Đen")?"--background":value.includes("Xám")?"--foreground-secondary":"--color-white";const color=getComputedStyle(node).getPropertyValue(token).trim()||white;for(const material of tintMaterials)material.color.set(color);node.dataset.productColor=value;node.dataset.productExploded=String(productOptions.current.productExploded);node.dataset.storeLevel=String(productOptions.current.storeLevel);node.dataset.buildingOpen=String(productOptions.current.buildingOpen);draw();};
      let started=performance.now();let interacted=0;let lastRender=0;let lastLabels=0;let deliveryPosition=0;let deliveryTarget=0;
      let cameraMotion:{kind?:"entrance"|"explore";duration?:number;start:number;from:InstanceType<typeof T.Vector3>;to:InstanceType<typeof T.Vector3>;zoomFrom:number;zoomTo:number;positionFrom?:InstanceType<typeof T.Vector3>;positionTo?:InstanceType<typeof T.Vector3>}|null=null;
      let selectTimer:ReturnType<typeof setTimeout>|null=null;
      let bounds=new T.Box3();let frame=0;let visible=true;
      const nodes=new Map<string,InstanceType<typeof T.Object3D>>();
      const pickables:InstanceType<typeof T.Object3D>[]=[];
      const ray=new T.Raycaster();const pointer=new T.Vector2();
      const center=new T.Vector3();
      const overview=new T.Vector3();
      const updateAnchors=()=>{
        const occupied:{x:number;y:number;width:number}[]=[];const {width,height}=node.getBoundingClientRect();
        const priority=["vincom","winmart","vinmec","events","may","lumi","pulse","vincom-center","vincom-plaza","home"];
        const next=[...places[mode]].sort((a,b)=>priority.indexOf(a.id)-priority.indexOf(b.id)).map(a=>{const n=nodes.get(a.id);if(!n)return a;const b=new T.Box3().setFromObject(n);const p=b.getCenter(new T.Vector3());p.y=b.min.y+Math.min((b.max.y-b.min.y)*.65,2.4)+.18;p.project(camera);const x=(p.x+1)*50,y=(1-p.y)*50;const pixelX=x*width/100,pixelY=y*height/100,labelWidth=a.label.length*5+24;const filtered=visiblePlaces.current&&!visiblePlaces.current.includes(a.id);const hidden=Boolean(filtered)||occupied.some(r=>Math.abs(r.x-pixelX)<(r.width+labelWidth)/2+4&&Math.abs(r.y-pixelY)<30);if(!hidden&&x>5&&x<95&&y>8&&y<90)occupied.push({x:pixelX,y:pixelY,width:labelWidth});return {...a,x,y,hidden};});
        setAnchors(previous=>previous.length===next.length&&previous.every((a,i)=>Math.abs(a.x-next[i].x)<.3&&Math.abs(a.y-next[i].y)<.3&&a.hidden===next[i].hidden)?previous:next);
      };
      const draw=()=>{if(!dead&&!preparing&&visible&&!frame)frame=requestAnimationFrame(tick);};
      refreshLabels.current=()=>{updateAnchors();draw();};
      const walkingCurve=new T.CatmullRomCurve3([new T.Vector3(2,.1,1.15),new T.Vector3(2,.1,1),new T.Vector3(0,.1,1),new T.Vector3(-1,.1,1),new T.Vector3(-1,.1,.7),new T.Vector3(0,.1,.7),new T.Vector3(2,.1,.7)],true);
      const tick=(now:number)=>{
        frame=0;if(dead||!visible||preparing)return;
        if(!document.hidden&&!node.closest('[inert]')&&now-lastRender>32){
          const elapsed=(now-started)/1000;
          if(model&&!reduced.matches){
            if(!fixedCity){const entrance=Math.min(elapsed/.9,1);const ease=1-Math.pow(1-entrance,3);model.scale.setScalar(.92+.08*ease);model.position.y=(1-ease)*-.25;}
            if(productFocus&&now-interacted>2500)productFocus.rotation.y+=.006;
            if(walker&&!fixedCity){const p=(elapsed/28)%1;walker.position.copy(walkingCurve.getPoint(p));const d=walkingCurve.getTangent(p);walker.rotation.y=Math.atan2(d.x,d.z);limbs.forEach(l=>{const left=l.name.endsWith('_l');l.rotation.x=Math.sin(elapsed*8+(left?0:Math.PI))*(l.name.includes('leg')?.5:.35);});node.dataset.characterMotion=elapsed.toFixed(2);}
          }
          for(const part of articulated){const target=part.base.clone();if(productOptions.current.productExploded)target.add(part.offset);part.object.position.lerp(target,reduced.matches?1:.12);}
          for(const material of facades){material.opacity=T.MathUtils.lerp(material.opacity,productOptions.current.buildingOpen?.05:.74,reduced.matches?1:.1);}
          for(const floor of cityFloors){const index=Number(floor.name.slice(-1));floor.position.y=T.MathUtils.lerp(floor.position.y,floor.userData.restY+(productOptions.current.buildingOpen?index*.5:0),reduced.matches?1:.12);}
          for(const floor of floors){const chosen=productOptions.current.storeLevel||1;floor.position.y=T.MathUtils.lerp(floor.position.y,floor.userData.restY+(chosen===2&&floor.name.includes('_2')?.6:0),reduced.matches?1:.12);}
          if(cameraMotion){const t=reduced.matches?1:T.MathUtils.clamp((now-cameraMotion.start)/(cameraMotion.duration||(fixedCity?1100:750)),0,1);const e=fixedCity?(1-Math.cos(Math.PI*t))/2:1-Math.pow(1-t,3);orbit.target.lerpVectors(cameraMotion.from,cameraMotion.to,e);if(cameraMotion.positionFrom&&cameraMotion.positionTo){if(fixedCity){const a=new T.Spherical().setFromVector3(cameraMotion.positionFrom.clone().sub(cameraMotion.from));const b=new T.Spherical().setFromVector3(cameraMotion.positionTo.clone().sub(cameraMotion.to));const angle=T.MathUtils.euclideanModulo(b.theta-a.theta+Math.PI,Math.PI*2)-Math.PI;camera.position.copy(orbit.target).add(new T.Vector3().setFromSpherical(new T.Spherical(T.MathUtils.lerp(a.radius,b.radius,e),T.MathUtils.lerp(a.phi,b.phi,e),a.theta+angle*e)));node.dataset.rotationProgress=t.toFixed(3);node.dataset.motionKind=cameraMotion.kind||"explore";if(cameraMotion.kind==="entrance")node.dataset.entranceProgress=t.toFixed(3);}else camera.position.lerpVectors(cameraMotion.positionFrom,cameraMotion.positionTo,e);}camera.zoom=T.MathUtils.lerp(cameraMotion.zoomFrom,cameraMotion.zoomTo,e);camera.updateProjectionMatrix();if(t===1){const wasEntrance=cameraMotion.kind==="entrance";cameraMotion=null;if(wasEntrance&&focusValue.current)focusCamera.current?.(focusValue.current);}}
          if(car&&mode==='delivery'){deliveryPosition=reduced.matches?deliveryTarget:T.MathUtils.lerp(deliveryPosition,deliveryTarget,.12);placeCar(deliveryPosition);}
          orbit.update();renderer.render(scene,camera);if(model&&!firstRendered){firstRendered=true;node.dataset.renderer="blender-webgl";setStatus("ready");}node.dataset.cameraDistance=camera.position.distanceTo(orbit.target).toFixed(2);node.dataset.cameraPosition=JSON.stringify(camera.position.toArray());node.dataset.cameraTarget=JSON.stringify(orbit.target.toArray());node.dataset.modelVisible=String(model?.visible);lastRender=now;
          if(now-lastLabels>160){updateAnchors();lastLabels=now;}
        }
        if((!fixedCity&&!reduced.matches)||mode==="delivery"||cameraMotion)draw();
      };
      const fit=()=>{
        const {width,height}=node.getBoundingClientRect();if(!width||!height)return;
        const retainedPose=fullscreen&&fixedCity&&node.dataset.viewStage==="detail"?{position:camera.position.clone(),target:orbit.target.clone()}:null;renderer.setSize(width,height);const aspect=width/height;
        if(model){bounds=new T.Box3().setFromObject(model);if(fixedCity)bounds.set(new T.Vector3(-8.5,0,-6.5),new T.Vector3(8.5,5,6.5));bounds.getCenter(center);if(fixedCity)center.set(0,.6,0);node.dataset.modelBounds=JSON.stringify({min:bounds.min.toArray(),max:bounds.max.toArray()});const size=bounds.getSize(new T.Vector3());
          if(camera instanceof T.OrthographicCamera){camera.position.copy(center).add(new T.Vector3(14,16,18));orbit.target.copy(center);camera.lookAt(center);camera.updateMatrixWorld();const xs:number[]=[],ys:number[]=[];for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]){const p=new T.Vector3(x,y,z).applyMatrix4(camera.matrixWorldInverse);xs.push(p.x);ys.push(p.y);}const half=Math.max((Math.max(...ys)-Math.min(...ys))/2,(Math.max(...xs)-Math.min(...xs))/(2*aspect))*.7;camera.left=-half*aspect;camera.right=half*aspect;camera.top=fullscreen?half*.7:half;camera.bottom=fullscreen?-half*1.3:-half;overview.copy(camera.position);}
          else{camera.aspect=aspect;const v=T.MathUtils.degToRad(camera.fov);const distance=Math.max(size.y/(2*Math.tan(v/2)),Math.max(size.x,size.z)/(2*Math.tan(v/2)*Math.min(aspect,1)))*1.25;overview.copy(center).addScaledVector(new T.Vector3(.8,.7,1.2).normalize(),distance);orbit.target.copy(center);camera.position.copy(overview);}
        }else if(camera instanceof T.PerspectiveCamera)camera.aspect=aspect;
        if(retainedPose){camera.position.copy(retainedPose.position);orbit.target.copy(retainedPose.target);}camera.updateProjectionMatrix();orbit.update();draw();
      };
      const themeObserver=new MutationObserver(()=>{const styles=getComputedStyle(node);const background=styles.getPropertyValue("--background").trim();const foreground=styles.getPropertyValue("--color-white").trim()||styles.getPropertyValue("--foreground").trim();hemisphere.groundColor.set(background);hemisphere.color.set(foreground);cityFog.color.set(background);tuneLighting();updateProduct.current?.();draw();});themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:["class"]});
      const resize=new ResizeObserver(fit);resize.observe(node);
      const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;if(visible)draw();});observer.observe(node);
      const orbitChange=()=>draw();orbit.addEventListener("change",orbitChange);
      let down={x:0,y:0};const pointerdown=(e:PointerEvent)=>{down={x:e.clientX,y:e.clientY};interacted=performance.now();cameraMotion=null;};
      const pointerup=(e:PointerEvent)=>{
        if(Math.hypot(e.clientX-down.x,e.clientY-down.y)>7)return;
        const b=node.getBoundingClientRect();pointer.set((e.clientX-b.left)/b.width*2-1,-((e.clientY-b.top)/b.height*2-1));ray.setFromCamera(pointer,camera);
        const hit=ray.intersectObjects(model?[model]:pickables,true)[0];if(!hit){expandCallback.current?.();return;}
        let n:InstanceType<typeof T.Object3D>|null=hit.object;
        while(n){const id=n.userData.placeId as string|undefined;if(id){selectPlace.current?.(id);return;}n=n.parent;}
        if(expandCallback.current){expandCallback.current();return;}if(fixedCity)return;const target=hit.point.clone();cameraMotion={start:performance.now(),from:orbit.target.clone(),to:target,zoomFrom:camera.zoom,zoomTo:3.5};node.dataset.cameraFocus=hit.object.name;draw();
      };
      const hover=(e:PointerEvent)=>{if(!fixedCity)return;const b=node.getBoundingClientRect();pointer.set((e.clientX-b.left)/b.width*2-1,-((e.clientY-b.top)/b.height*2-1));ray.setFromCamera(pointer,camera);let object=ray.intersectObjects(model?[model]:[],true)[0]?.object as InstanceType<typeof T.Object3D>|undefined;let clickable=false;while(object){if(object.userData.placeId){clickable=true;break;}object=object.parent||undefined;}renderer.domElement.style.cursor=clickable?"pointer":"default";};renderer.domElement.addEventListener("pointermove",hover);renderer.domElement.addEventListener("pointerdown",pointerdown);renderer.domElement.addEventListener("pointerup",pointerup);
      const lost=(e:Event)=>{e.preventDefault();setStatus("fallback");};renderer.domElement.addEventListener("webglcontextlost",lost);
      control.current=action=>{if(fixedCity){if(action==="reset")focusCamera.current?.();return;}if(action==="reset"){cameraMotion=null;camera.zoom=1;fit();}else{cameraMotion={start:performance.now(),from:orbit.target.clone(),to:orbit.target.clone(),zoomFrom:camera.zoom,zoomTo:T.MathUtils.clamp(camera.zoom*(action==="in"?1.4:1/1.4),.65,6)};draw();}};
      const route=[new T.Vector3(-2,.11,1.5),new T.Vector3(0,.11,1.5),new T.Vector3(2,.11,1.5),new T.Vector3(2,.11,3)];
      const curve=new T.CatmullRomCurve3(route);let trail:InstanceType<typeof T.Mesh>|null=null;
      const placeCar=(value:number)=>{if(!car)return;const p=direction.current==='to-mall'?1-value:value;car.position.copy(curve.getPoint(p));const d=curve.getTangent(p);car.rotation.y=Math.atan2(-d.z,d.x)+(direction.current==='to-mall'?Math.PI:0);node.dataset.deliveryProgress=value.toFixed(2);};
      const move=(value:number)=>{deliveryTarget=T.MathUtils.clamp(value>1?value/100:value,0,1);if(reduced.matches){deliveryPosition=deliveryTarget;placeCar(deliveryPosition);}draw();};updateProgress.current=move;
      focusCamera.current=id=>{if(!model)return;if(fixedCity){const n=id?nodes.get(id):undefined;const target=n?new T.Box3().setFromObject(n).getCenter(new T.Vector3()):center.clone();if(n)target.y=Math.max(.6,target.y-.25);const view=overview.clone().sub(center);if(n){if(node.dataset.cameraFocus===id)view.copy(camera.position).sub(orbit.target);view.applyAxisAngle(new T.Vector3(0,1,0),node.dataset.cameraFocus===id?-.65:-.95);}const destination=n?target.clone().add(view):overview.clone();orbit.enabled=Boolean(n);orbit.enablePan=false;orbit.minZoom=1;orbit.maxZoom=3.2;orbit.minPolarAngle=.5;orbit.maxPolarAngle=1.18;orbit.mouseButtons.LEFT=T.MOUSE.ROTATE;orbit.touches.ONE=T.TOUCH.ROTATE;cameraMotion={start:performance.now(),from:orbit.target.clone(),to:target,zoomFrom:camera.zoom,zoomTo:n?2.25:1,positionFrom:camera.position.clone(),positionTo:destination};node.dataset.rotationProgress="0";node.dataset.cameraFocus=id||"city";node.dataset.fixedView=String(!n);node.dataset.viewStage=n?"detail":"city";draw();return;}const n=id?nodes.get(id):undefined;const target=n?new T.Box3().setFromObject(n).getCenter(new T.Vector3()):center.clone();const box=n?new T.Box3().setFromObject(n):bounds;const dimensions=box.getSize(new T.Vector3());const perspective=camera as InstanceType<typeof T.PerspectiveCamera>;const distance=Math.max(dimensions.x,dimensions.y,dimensions.z)/(2*Math.tan(T.MathUtils.degToRad(perspective.fov)/2)*Math.min(perspective.aspect,1))*1.55;const view=camera.position.clone().sub(orbit.target).normalize();const destination=n?target.clone().addScaledVector(view,distance):overview.clone();cameraMotion={start:performance.now(),from:orbit.target.clone(),to:target,zoomFrom:camera.zoom,zoomTo:1,positionFrom:camera.position.clone(),positionTo:destination};node.dataset.cameraFocus=id||'city';draw();};
      selectPlace.current=id=>{if(fixedCity&&visiblePlaces.current&&!visiblePlaces.current.includes(id))return;if(fixedCity&&callback.current){callback.current(id);return;}focusCamera.current?.(id);if(selectTimer)clearTimeout(selectTimer);selectTimer=setTimeout(()=>{if(!dead)callback.current?.(id);},fixedCity||reduced.matches?0:850);};
      updateSelection.current=id=>{node.dataset.selectedPlace=id||"";draw();};
      const draco=new DRACOLoader().setDecoderPath("/vinclub-assets/draco/");const loader=new GLTFLoader().setDRACOLoader(draco);loader.load(`/vinclub-assets/city/${asset}.glb${asset === "city" ? "?v=architectural-depth-12" : "?v=map-style-1"}`,gltf=>{
        if(dead){gltf.scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});return;}
        preparing=true;model=gltf.scene;scene.add(model);
        model.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=true;o.receiveShadow=true;}const id=o.name.startsWith("vincom_center")?"vincom-center":o.name.startsWith("vincom_plaza")?"vincom-plaza":["vincom","winmart","vinmec","events","home","may","lumi","pulse"].find(key=>o.name.startsWith(`${key}_`));if(id){o.userData.placeId=id;pickables.push(o);if(!nodes.has(id)||["vincom_mall","home_destination","may_store","lumi_store","pulse_store","winmart_destination","vinmec_destination","events_destination","vincom_center","vincom_plaza"].includes(o.name))nodes.set(id,o);}if(asset==="city"&&o instanceof T.Mesh&&/district_static|tower|building|shop|house|park|lake/.test(o.name)&&!o.userData.placeId)pickables.push(o);if(o.name==="car_delivery")car=o;if(o.name==="character_walker")walker=o;if(o.name.startsWith('walker_leg_')||o.name.startsWith('walker_arm_'))limbs.push(o);if(o.name==='product_focus')productFocus=o;
          if(mode==='product'&&o instanceof T.Mesh){const name=o.name;const offset=new T.Vector3();if(/sole|base/.test(name))offset.y=-.22;else if(/lace|dropper|headband/.test(name))offset.y=.36;else if(/cushion|earcup/.test(name))offset.x=o.position.x>=0?.25:-.25;else if(/tongue|neck/.test(name))offset.y=.17;else if(/heel/.test(name))offset.z=.2;if(offset.length())articulated.push({object:o,base:o.position.clone(),offset});if(/upper|heel|earcup|headband$/.test(name)&&o.material instanceof T.MeshStandardMaterial){o.material=o.material.clone();tintMaterials.push(o.material);}}
          if(o.name.startsWith('vincom_floor_')){o.userData.restY=o.position.y;cityFloors.push(o);}if(o.name==='vincom_facade_reveal'){o.traverse(child=>{if(child instanceof T.Mesh&&child.material instanceof T.MeshStandardMaterial){child.material=child.material.clone();child.material.transparent=true;facades.push(child.material);}});}
          if(o.name==='mall_floor_1'||o.name==='mall_floor_2'){o.userData.restY=o.position.y;floors.push(o);}});
        if(mode==="delivery"){
          trail=new T.Mesh(new T.TubeGeometry(curve,40,.025,6,false),new T.MeshBasicMaterial({color:accent}));scene.add(trail);move(currentProgress.current);
        }
        updateSelection.current?.(selected.current);updateProduct.current?.();fit();node.dataset.asset=asset;void renderer.compileAsync(scene,camera).then(()=>{if(dead)return;preparing=false;started=performance.now();if(entrance&&fixedCity&&!videoIntro&&!reduced.matches){const initial=overview.clone().sub(center).applyAxisAngle(new T.Vector3(0,1,0),.28);initial.y*=1.12;camera.position.copy(center).add(initial);camera.zoom=.84;camera.updateProjectionMatrix();cameraMotion={kind:"entrance",duration:1500,start:started,from:center.clone(),to:center.clone(),zoomFrom:.84,zoomTo:1,positionFrom:camera.position.clone(),positionTo:overview.clone()};node.dataset.entranceProgress="0";}else{node.dataset.entranceProgress="1";if(focusValue.current)focusCamera.current?.(focusValue.current);}draw();}).catch(()=>{if(dead)return;preparing=false;draw();});
      },undefined,()=>setStatus("fallback"));
      cleanup=()=>{themeObserver.disconnect();resize.disconnect();observer.disconnect();cancelAnimationFrame(frame);if(selectTimer)clearTimeout(selectTimer);orbit.removeEventListener("change",orbitChange);orbit.dispose();renderer.domElement.removeEventListener("pointermove",hover);renderer.domElement.removeEventListener("pointerdown",pointerdown);renderer.domElement.removeEventListener("pointerup",pointerup);renderer.domElement.removeEventListener("webglcontextlost",lost);scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material]){if(m instanceof T.MeshStandardMaterial||m instanceof T.MeshBasicMaterial)m.map?.dispose();m.dispose();}}});draco.dispose();environment.dispose();renderer.dispose();renderer.domElement.remove();delete node.dataset.renderer;control.current=null;updateProgress.current=null;updateSelection.current=null;focusCamera.current=null;selectPlace.current=null;updateProduct.current=null;};
    }).catch(()=>setStatus("fallback"));
    return()=>{dead=true;cleanup();};
  },[mode,asset,fullscreen,entrance,videoIntro]);
  return <div className="mini-city bg-secondary rounded-28" data-map-mode={mode} data-render-status={status} onPointerDownCapture={()=>setIntroDismissed(true)}>
    <div ref={host} className="mini-city-host"/>
    {videoIntro&&<CityMapIntro ready={status==="ready"} dismissed={introDismissed}/>}
    {status!=="ready"&&<div className="mini-city-poster">{asset!=="city"&&<Image src={`/vinclub-assets/city/${asset==='city'?'poster':`${asset}-poster`}.webp`} alt={mode==="product"?"Mô hình sản phẩm":mode==="store"?"Nội thất cửa hàng 3D":mode==="mall"?"Không gian ba store bên trong Vincom":"Thành phố premium với kiến trúc ngọc trai, kính khói và chi tiết champagne"} fill sizes="390px"/>}<p className="text-xs text-foreground-secondary bg-background rounded-8">{status==="loading"?"Đang mở không gian…":"Chọn điểm đến bên dưới"}</p></div>}
    <div className="mini-city-labels">{anchors.map(a=><Button key={a.id} variant="secondary" size="32" aria-label={mode==="mall"?`Vào store ${a.label}`:a.id==="home"?"Xem nhà nhận hàng":`Mở ${a.label} trên bản đồ 3D`} data-place-id={a.id} className={`mini-city-pin ${a.id===activeStore?"mini-city-pin-active":""}`} style={{left:`${a.x}%`,top:`${a.y}%`,visibility:a.hidden||a.x<5||a.x>95||a.y<8||a.y>90?"hidden":"visible"}} onClick={()=>selectPlace.current?selectPlace.current(a.id):callback.current?.(a.id)}><MapPin size={11}/>{a.label}</Button>)}</div>
    <div className="mini-city-controls">{onExpand&&<Button variant="secondary" size="32" aria-label="Mở bản đồ toàn màn hình" onClick={onExpand}><Maximize2 size={13}/></Button>}{mode!=="city"&&mode!=="delivery"&&<><Button variant="secondary" size="32" aria-label="Phóng to mô hình 3D" onClick={()=>control.current?.("in")}><Plus size={13}/></Button><Button variant="secondary" size="32" aria-label="Thu nhỏ mô hình 3D" onClick={()=>control.current?.("out")}><Minus size={13}/></Button><Button variant="secondary" size="32" aria-label="Đặt lại góc nhìn" onClick={()=>control.current?.("reset")}><RotateCcw size={12}/></Button></>}</div>
    <span className="mini-city-caption text-foreground-secondary bg-background/90 rounded-8">{mode==="product"?"Kéo để xoay · chụm để phóng to":mode==="store"?"Kéo để khám phá cửa hàng":mode==="mall"?"Chạm store để khám phá":mode==="delivery"?"Green SM · hành trình minh họa":focus?"Kéo xoay điểm đến · chạm để khám phá":"Chạm địa điểm · mở góc nhìn chi tiết"}</span>
  </div>;
}
