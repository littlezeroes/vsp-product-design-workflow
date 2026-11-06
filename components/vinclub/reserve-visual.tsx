"use client";
import { useEffect, useRef } from "react";
import { ShieldCheck } from "lucide-react";

export function ReserveVisual() {
  const host = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = host.current; if (!node) return;
    let disposed = false; let cleanup = () => {};
    Promise.all([import("three"), import("three/addons/geometries/RoundedBoxGeometry.js"), import("three/addons/environments/RoomEnvironment.js")]).then(([T,{RoundedBoxGeometry},{RoomEnvironment}]) => {
      if (disposed) return;
      let renderer: InstanceType<typeof T.WebGLRenderer>;
      try { renderer = new T.WebGLRenderer({alpha:true,antialias:true}); } catch { return; }
      renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.setSize(148,148); renderer.toneMapping=T.ACESFilmicToneMapping; renderer.domElement.setAttribute("aria-hidden","true");
      const scene=new T.Scene(); const studio=new RoomEnvironment(); const pmrem=new T.PMREMGenerator(renderer); const environment=pmrem.fromScene(studio,.04); scene.environment=environment.texture; studio.dispose();pmrem.dispose();
      const tokens=getComputedStyle(node); const color=(name:string)=>tokens.getPropertyValue(name).trim();
      const glass=new T.MeshPhysicalMaterial({color:color("--color-grey-50"),metalness:.08,roughness:.1,transmission:.85,thickness:.65,ior:1.45,clearcoat:1});
      const metal=new T.MeshStandardMaterial({color:color("--color-orange-100"),metalness:.75,roughness:.2});
      const group=new T.Group();scene.add(group);
      const vault=new T.Mesh(new RoundedBoxGeometry(1.6,1.45,.8,5,.2),glass);group.add(vault);
      const door=new T.Mesh(new RoundedBoxGeometry(1.15,1.02,.12,4,.16),glass);door.position.z=.47;group.add(door);
      const ring=new T.Mesh(new T.TorusGeometry(.26,.055,12,40),metal);ring.position.z=.6;group.add(ring);
      const hub=new T.Mesh(new T.SphereGeometry(.1,20,16),metal);hub.position.z=.62;group.add(hub);
      for(const angle of [0,Math.PI/2]) {const spoke=new T.Mesh(new T.BoxGeometry(.42,.045,.04),metal);spoke.rotation.z=angle;spoke.position.z=.62;group.add(spoke);}
      for(let i=0;i<3;i++){const coin=new T.Mesh(new T.CylinderGeometry(.22,.22,.08,32),metal);coin.position.set(.9-i*.13,-.65+i*.1,.62);group.add(coin);}
      const camera=new T.PerspectiveCamera(32,1,.1,20);camera.position.set(2,1.2,5);camera.lookAt(0,0,0);
      scene.add(new T.HemisphereLight(color("--color-grey-50"),color("--color-grey-500"),3));
      const light=new T.DirectionalLight(color("--color-grey-50"),5);light.position.set(-3,4,5);scene.add(light);
      const reduced=matchMedia("(prefers-reduced-motion: reduce)");let inView=true;
      const render=(time:number)=>{group.rotation.y=reduced.matches?0:Math.sin(time/1600)*.12;renderer.render(scene,camera);};
      const sync=()=>{renderer.setAnimationLoop(null);if(inView&&!document.hidden&&!reduced.matches)renderer.setAnimationLoop(render);else render(0);};
      const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();});observer.observe(node);document.addEventListener("visibilitychange",sync);reduced.addEventListener("change",sync);
      node.appendChild(renderer.domElement);node.dataset.ready="true";sync();
      cleanup=()=>{observer.disconnect();document.removeEventListener("visibilitychange",sync);reduced.removeEventListener("change",sync);renderer.setAnimationLoop(null);group.traverse(child=>{if(child instanceof T.Mesh)child.geometry.dispose();});glass.dispose();metal.dispose();environment.dispose();renderer.dispose();renderer.domElement.remove();delete node.dataset.ready;};
    }).catch(()=>{});
    return()=>{disposed=true;cleanup();};
  },[]);
  return <span ref={host} className="ds-reserve-visual" aria-hidden="true"><ShieldCheck size={80}/></span>;
}
