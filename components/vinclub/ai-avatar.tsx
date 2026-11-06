"use client";

import Image from "next/image";
import type { BufferGeometry, NormalBufferAttributes } from "three";
import { useEffect, useRef } from "react";

export function AiAvatar({ size = 38 }: { size?: number }) {
  const host = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    let disposed = false;
    let cleanup = () => {};
    Promise.all([import("three"), import("three/addons/geometries/RoundedBoxGeometry.js"), import("three/addons/environments/RoomEnvironment.js")]).then(([T, { RoundedBoxGeometry }, { RoomEnvironment }]) => {
      if (disposed) return;
      let renderer: InstanceType<typeof T.WebGLRenderer>;
      try { renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" }); } catch { return; }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(size, size);
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.domElement.setAttribute("aria-hidden", "true");
      const scene = new T.Scene();
      const studio = new RoomEnvironment();
      const pmrem = new T.PMREMGenerator(renderer);
      const environment = pmrem.fromScene(studio, .04);
      scene.environment = environment.texture;
      studio.dispose(); pmrem.dispose();
      const tokens = getComputedStyle(node);
      const color = (name: string) => tokens.getPropertyValue(name).trim();
      const glass = new T.MeshPhysicalMaterial({
        color: color("--color-grey-50"), roughness: .08, metalness: 0,
        transmission: .65, thickness: .45, ior: 1.45,
        transparent: true, opacity: .82, clearcoat: 1, clearcoatRoughness: .06,
        envMapIntensity: 1.8,
      });
      const rim = new T.MeshPhysicalMaterial({ color: color("--color-grey-200"), roughness: .16, metalness: .65, clearcoat: 1 });
      const visor = new T.MeshPhysicalMaterial({ color: color("--color-grey-950"), roughness: .2, metalness: .15, clearcoat: 1 });
      const glow = new T.MeshStandardMaterial({ color: color("--color-grey-50"), emissive: color("--color-grey-50"), emissiveIntensity: .8 });
      const robot = new T.Group();
      const add = (geometry: BufferGeometry<NormalBufferAttributes>, material: InstanceType<typeof T.MeshStandardMaterial>, x=0, y=0, z=0) => {
        const mesh = new T.Mesh(geometry, material);
        mesh.position.set(x,y,z); robot.add(mesh); return mesh;
      };
      const shell = add(new T.SphereGeometry(.9,48,32), glass);
      shell.scale.set(1.05,1,.85);
      const faceRim = add(new T.SphereGeometry(.7,40,28), rim,0,-.015,.5);
      faceRim.scale.set(1,.74,.36);
      const face = add(new T.SphereGeometry(.65,40,28), visor,0,-.015,.6);
      face.scale.set(1,.73,.28);
      const eyes = [-.25,.25].map(x => add(new RoundedBoxGeometry(.14,.25,.055,4,.065), glow,x,.02,.79));
      for (const x of [-.91,.91]) {
        const ear = add(new T.SphereGeometry(.17,24,16), glass,x,0,0);
        ear.scale.set(.65,1,1);
      }
      add(new T.SphereGeometry(.09,24,16), rim,0,.94,0);
      scene.add(robot);
      const camera = new T.PerspectiveCamera(32,1,.1,20);
      camera.position.set(0,.12,5); camera.lookAt(0,0,0);
      scene.add(new T.HemisphereLight(color("--color-grey-50"), color("--color-grey-500"), 2));
      const key = new T.DirectionalLight(color("--color-grey-50"), 4);
      key.position.set(-3,4,5); scene.add(key);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      let inView = true;
      const render = (time: number) => {
        const seconds = time/1000;
        robot.rotation.y = -.12 + (reduced.matches?0:Math.sin(seconds*.9)*.12);
        robot.rotation.z = reduced.matches?0:Math.sin(seconds*.65)*.045;
        robot.position.y = reduced.matches?0:Math.sin(seconds*1.6)*.055;
        const blinkPhase = seconds % 4.2;
        const blink = !reduced.matches && blinkPhase < .26 ? 1 - .92 * Math.sin(Math.PI * blinkPhase / .26) : 1;
        eyes.forEach(eye=>{eye.scale.y=blink;});
        renderer.render(scene,camera);
      };
      const sync = () => {
        renderer.setAnimationLoop(null);
        if(inView&&!document.hidden&&!reduced.matches) renderer.setAnimationLoop(render);
        else render(0);
      };
      const observer = new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();});
      observer.observe(node);
      document.addEventListener("visibilitychange",sync);
      reduced.addEventListener("change",sync);
      render(0);
      node.appendChild(renderer.domElement);
      node.dataset.ready="true";
      sync();
      cleanup=()=>{
        observer.disconnect(); document.removeEventListener("visibilitychange",sync); reduced.removeEventListener("change",sync);
        renderer.setAnimationLoop(null);
        robot.traverse(child=>{if (child instanceof T.Mesh) child.geometry.dispose();});
        [glass,rim,visor,glow].forEach(material=>material.dispose());
        environment.dispose();renderer.dispose();renderer.domElement.remove();delete node.dataset.ready;
      };
    }).catch(()=>{});
    return ()=>{disposed=true;cleanup();};
  },[size]);
  return <span ref={host} className="ds-ai-avatar" style={{ width: size, height: size }} aria-hidden="true"><Image src="/vinclub-assets/icons/assistant-robot.webp" width={size} height={size} alt=""/></span>;
}
