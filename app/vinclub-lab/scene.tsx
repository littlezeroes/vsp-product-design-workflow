"use client";

import { useEffect, useRef, useState } from "react";
import type { BufferGeometry, NormalBufferAttributes } from "three";

export function Scene({ material }: { material: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    let disposed = false;
    let cleanup = () => {};
    setFallback(false);
    import("three").then(THREE => {
      if (disposed) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
      catch { setFallback(true); return; }
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      node.appendChild(renderer.domElement);
      renderer.domElement.setAttribute("aria-label", `Three.js ${material} material study — chạm hoặc kéo để xem`);
      renderer.domElement.setAttribute("role", "img");
      node.dataset.renderer = "three-webgl";
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, .1, 30);
      camera.position.z = 5;
      const styles = getComputedStyle(node);
      const color = styles.getPropertyValue("--foreground").trim();
      const accent = styles.getPropertyValue("--lab-accent").trim();
      const body = new THREE.MeshPhysicalMaterial({ color: accent || color, metalness: material === "metal" ? .95 : .25, roughness: material === "metal" ? .22 : .16, transparent: material === "glass", opacity: material === "glass" ? .66 : 1, clearcoat: 1, side: THREE.DoubleSide });
      const group = new THREE.Group(); scene.add(group);
      const geometries: BufferGeometry<NormalBufferAttributes>[] = [];
      function mesh(geometry: BufferGeometry<NormalBufferAttributes>) {
        geometries.push(geometry); const m = new THREE.Mesh(geometry, body); group.add(m); return m;
      }
      if (material === "metal" || material === "glass") {
        const s = new THREE.Shape(); const w=2.5,h=1.45,r=.13;
        s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
        mesh(new THREE.ExtrudeGeometry(s,{depth:.035,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:3,steps:1}));
        group.rotation.set(-.12,.2,-.07);
      } else if(material === "spatial") {
        mesh(new THREE.TorusGeometry(.82,.09,24,80));
        const core=mesh(new THREE.IcosahedronGeometry(.3,1));core.rotation.z=.3;
        group.rotation.set(.1,.25,0);
      } else if(material === "concierge") {
        mesh(new THREE.TorusKnotGeometry(.52,.12,80,12,2,3));
      } else {
        mesh(new THREE.TorusKnotGeometry(.55,.055,100,12,2,3));
        mesh(new THREE.IcosahedronGeometry(.28,1));
      }
      scene.add(new THREE.HemisphereLight(color, color, 2.4));
      const key=new THREE.DirectionalLight(color,5);key.position.set(-3,4,4);scene.add(key);
      const rim=new THREE.DirectionalLight(accent || color,3);rim.position.set(3,-2,2);scene.add(rim);
      let raf=0;
      const render=()=> { raf=0; if(!disposed) renderer.render(scene,camera); };
      const request=()=> {if(!raf && !disposed) raf=requestAnimationFrame(render);};
      const resize=new ResizeObserver(()=> { const {width,height}=node.getBoundingClientRect(); if(!width||!height)return;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();request(); });
      resize.observe(node);
      const reduced=matchMedia("(prefers-reduced-motion: reduce)");
      const move=(event:PointerEvent)=> { if(reduced.matches)return;const b=node.getBoundingClientRect();group.rotation.y=((event.clientX-b.left)/b.width-.5)*.7;group.rotation.x=((event.clientY-b.top)/b.height-.5)*.35;request(); };
      let animation=0;
      const pulse=()=> { if(reduced.matches)return;cancelAnimationFrame(animation);const start=performance.now();const tick=(now:number)=>{if(disposed)return;const t=Math.min((now-start)/850,1);const scale=1+Math.sin(t*Math.PI)*.1;group.scale.setScalar(scale);renderer.render(scene,camera);if(t<1)animation=requestAnimationFrame(tick);};animation=requestAnimationFrame(tick);};
      node.addEventListener("pointermove",move);node.addEventListener("pointerdown",pulse);
      const lost=(ev:Event)=> { ev.preventDefault();setFallback(true); };
      renderer.domElement.addEventListener("webglcontextlost",lost);
      request();
      cleanup=()=> {resize.disconnect();cancelAnimationFrame(raf);cancelAnimationFrame(animation);node.removeEventListener("pointermove",move);node.removeEventListener("pointerdown",pulse);renderer.domElement.removeEventListener("webglcontextlost",lost);geometries.forEach(g=>g.dispose());body.dispose();renderer.dispose();renderer.domElement.remove();delete node.dataset.renderer;};
    }).catch(()=>setFallback(true));
    return ()=>{disposed=true;cleanup();};
  },[material]);
  return <div ref={host} className="lab-scene">{fallback && <p className="px-[22px] text-sm text-foreground-secondary">Thiết bị chưa mở được 3D. Nội dung và tác vụ vẫn dùng được.</p>}</div>;
}
