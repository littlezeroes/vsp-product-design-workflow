"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import "./visuals.css";

export function ServiceIcon({ name, size = 64 }: { name: string; size?: number }) {
  return <Image className="vc-service-icon" src={name === "medical" ? "/vinclub-assets/icons-custom/vinmec-stethoscope-v1.webp" : `/vinclub-assets/icons/${name}.webp`} alt="" width={size} height={size} />;
}

export function MembershipVisual({ interactive = false, tier = "gold", still = false, playWhen = true, revealDelay = 0 }: { interactive?: boolean; still?: boolean; playWhen?: boolean; revealDelay?: number; tier?: "gold" | "silver" | "glass" | "obsidian" }) {
  const host = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const node = video.current;
    if (!node || active || still) return;
    node.pause();
    if (!playWhen) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout> | undefined;
    let started = false;
    const observer = new IntersectionObserver(entries => {
      if (!entries[0]?.isIntersecting || reduced.matches || started) return;
      started = true;
      timer = setTimeout(() => { node.currentTime = 0; node.playbackRate = .7; void node.play().catch(() => {}); }, revealDelay);
      observer.disconnect();
    }, { threshold: .2 });
    observer.observe(node);
    const visibility = () => { if (document.hidden) node.pause(); };
    document.addEventListener("visibilitychange", visibility);
    return () => { clearTimeout(timer); observer.disconnect(); document.removeEventListener("visibilitychange", visibility); node.pause(); };
  }, [tier, active, still, playWhen, revealDelay]);
  useEffect(() => {
    const node = host.current;
    if (!active || !node) return;
    let dead = false;
    let cleanup = () => {};
    Promise.all([import("three"), import("three/addons/loaders/GLTFLoader.js"), import("three/addons/environments/RoomEnvironment.js")]).then(([T, { GLTFLoader }, { RoomEnvironment }]) => {
      if (dead) return;
      let renderer: InstanceType<typeof T.WebGLRenderer>;
      try { renderer = new T.WebGLRenderer({ alpha: true, antialias: true }); }
      catch { setFailed(true); return; }
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      node.appendChild(renderer.domElement);
      renderer.domElement.setAttribute("aria-label", "Thẻ hội viên Blender 3D. Di chuyển con trỏ để xoay.");
      renderer.domElement.setAttribute("role", "img");
      const scene = new T.Scene();
      const studio = new RoomEnvironment();
      const pmrem = new T.PMREMGenerator(renderer);
      const environment = pmrem.fromScene(studio, .04);
      scene.environment = environment.texture;
      studio.dispose(); pmrem.dispose();
      const camera = new T.PerspectiveCamera(32, 1, .01, 100);
      const ink = getComputedStyle(node).getPropertyValue("--foreground").trim();
      const light = getComputedStyle(node).getPropertyValue("--color-white").trim() || getComputedStyle(node).getPropertyValue("--background").trim();
      scene.add(new T.HemisphereLight(light, ink, 3));
      for (const [x,y,z,power] of [[-3,4,5,7],[4,1,3,5],[-2,-3,2,3]]) {
        const lamp = new T.DirectionalLight(light, power); lamp.position.set(x,y,z); scene.add(lamp);
      }
      const group = new T.Group(); scene.add(group);
      let frame = 0;
      const draw = () => { if (!frame && !dead) frame = requestAnimationFrame(() => { frame = 0; renderer.render(scene, camera); }); };
      const resize = new ResizeObserver(() => {
        const { width, height } = node.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); draw();
      }); resize.observe(node);
      const reduced = matchMedia("(prefers-reduced-motion: reduce)");
      const move = (e: PointerEvent) => {
        if (reduced.matches) return;
        const b = node.getBoundingClientRect();
        group.rotation.y = ((e.clientX-b.left)/b.width-.5)*.7;
        group.rotation.x = ((e.clientY-b.top)/b.height-.5)*.35;
        draw();
      };
      node.addEventListener("pointermove", move);
      new GLTFLoader().load("/vinclub-assets/membership.glb", gltf => {
        if (dead) { gltf.scene.traverse(o => { if (o instanceof T.Mesh) o.geometry.dispose(); }); return; }
        const box = new T.Box3().setFromObject(gltf.scene);
        const size = box.getSize(new T.Vector3());
        gltf.scene.position.sub(box.getCenter(new T.Vector3()));
        const scale = 2.8 / Math.max(size.x,size.y,size.z);
        gltf.scene.traverse(o => { if(o instanceof T.Mesh && o.material instanceof T.MeshStandardMaterial) { o.material.metalness=.8; o.material.roughness=.28; o.material.emissiveIntensity=.08; } });
        group.add(gltf.scene); group.scale.setScalar(scale);
        const label = document.createElement("canvas"); label.width=1024; label.height=640;
        const ctx = label.getContext("2d");
        if(ctx) {
          ctx.fillStyle=light; ctx.font="italic 96px Georgia"; ctx.fillText("V.",100,155);
          ctx.font="52px Georgia"; ctx.fillText("VinClub",100,230);
          ctx.font="18px sans-serif"; ctx.fillText("E L I T E  /  M E M B E R  E D I T I O N",100,276);
          ctx.font="20px sans-serif"; ctx.fillText("0248 · 2026",100,530);
          const texture = new T.CanvasTexture(label); texture.colorSpace=T.SRGBColorSpace;
          const decal = new T.Mesh(new T.PlaneGeometry(size.x,size.y),new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,toneMapped:false}));
          decal.position.z=size.z/2+.002; group.add(decal);
        }
        camera.position.set(0,0,3.6); camera.lookAt(0,0,0);
        draw();
      }, undefined, () => setFailed(true));
      cleanup = () => {
        resize.disconnect(); node.removeEventListener("pointermove",move); cancelAnimationFrame(frame);
        scene.traverse(o => { if (o instanceof T.Mesh) { o.geometry.dispose(); for (const m of Array.isArray(o.material)?o.material:[o.material]) { if(m instanceof T.MeshBasicMaterial || m instanceof T.MeshStandardMaterial) m.map?.dispose(); m.dispose(); } } });
        environment.dispose();
        renderer.dispose(); renderer.domElement.remove();
      };
    }).catch(() => setFailed(true));
    return () => { dead = true; cleanup(); };
  }, [active]);
  return <div className="vc-membership-visual">
    <div className="vc-membership-stage" ref={host}>
      {still && <Image src={`/vinclub-assets/cards/${tier}.png`} alt={`Thẻ VinClub ${tier}`} fill sizes="(max-width: 800px) 100vw, 430px" unoptimized priority className="object-contain"/>}
      {!still && (!active || failed) && <video key={tier} ref={video} playsInline muted preload="metadata" poster={`/vinclub-assets/cards/${tier}.png`} onClick={() => { if (!matchMedia("(prefers-reduced-motion: reduce)").matches) { if(video.current)video.current.currentTime=0; void video.current?.play(); } }} aria-label={`Animation thẻ hội viên ${tier} được render bằng Blender`}><source src={`/vinclub-assets/cards/${tier}.mp4`} type="video/mp4" /></video>}
      {!still && (!active || failed) && <div className="vc-card-lettering" aria-hidden="true"><span className="vc-card-mark">V.</span><span className="vc-card-name">VinClub</span><span className="vc-card-tier">ELITE / MEMBER EDITION</span><span className="vc-card-number">0248 · 2026</span></div>}
    </div>
    {interactive && <div className="flex flex-wrap gap-[8px]"><Button variant="secondary" size="32" className="vc-membership-toggle" onClick={() => { setFailed(false); setActive(v=>!v); }}>{active ? "Xem animation" : "Chạm & xoay thẻ 3D"}</Button>{!active && <Button variant="secondary" size="32" className="vc-membership-toggle" onClick={() => { if (video.current && !matchMedia("(prefers-reduced-motion: reduce)").matches) { video.current.currentTime=0; void video.current.play(); } }}>Phát animation</Button>}</div>}
    {failed && <p role="status" className="text-xs text-foreground-secondary">Đang hiển thị bản render thẻ.</p>}
  </div>;
}
