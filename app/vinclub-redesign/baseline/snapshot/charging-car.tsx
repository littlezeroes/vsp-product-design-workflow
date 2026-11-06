"use client";

import { useEffect, useRef, useState } from "react";
import { Box } from "lucide-react";
import type * as Three from "three";

export function ChargingCar({ large = false, stopped = false, replay = 0 }: { large?: boolean; stopped?: boolean; replay?: number }) {
  const host = useRef<HTMLDivElement>(null);
  const paused = useRef(stopped);
  const transition = useRef(0);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  useEffect(() => { paused.current = stopped; }, [stopped]);
  useEffect(() => { transition.current = performance.now(); }, [replay]);
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    let disposed = false;
    let cleanup = () => {};
    Promise.all([import("three"), import("three/addons/loaders/GLTFLoader.js"), import("three/addons/environments/RoomEnvironment.js")]).then(async ([T, { GLTFLoader }, { RoomEnvironment }]) => {
      if (disposed) return;
      const tokens = getComputedStyle(node);
      const color = (token: string) => new T.Color(tokens.getPropertyValue(token).trim());
      let renderer: Three.WebGLRenderer;
      try { renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" }); }
      catch { setStatus("failed"); return; }
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = .75;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = T.PCFSoftShadowMap;
      node.appendChild(renderer.domElement);
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(32, 1, .1, 40);
      const pmrem = new T.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      const environment = pmrem.fromScene(room, .015);
      scene.environment = environment.texture;
      scene.environmentIntensity = .85;
      const modelGroup = new T.Group();
      scene.add(modelGroup);
      const chargeTint = color("--charge-accent");
      const floor = new T.Mesh(new T.PlaneGeometry(20, 20), new T.ShadowMaterial({ opacity: .25 }));
      floor.rotation.x = -Math.PI / 2; floor.position.y = -.02; floor.receiveShadow = true; scene.add(floor);
      scene.add(new T.HemisphereLight(color("--color-grey-00"), color("--color-grey-700"), 1));
      const key = new T.DirectionalLight(color("--color-grey-00"), 1.4);
      key.position.set(-3, 7, 5); key.castShadow = true; key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.left = -4; key.shadow.camera.right = 4; key.shadow.camera.top = 4; key.shadow.camera.bottom = -4;
      key.shadow.bias = -.001; key.shadow.normalBias = .03; key.shadow.radius = 4; scene.add(key);
      const rim = new T.DirectionalLight(color("--color-grey-00"), 1.1);
      rim.position.set(3, 4, -5); scene.add(rim);
      // One continuous pool of bounced light, with a soft moving highlight.
      // Everything sits on the floor, so the car occludes the light naturally.
      const chargingMaterial = new T.ShaderMaterial({
        uniforms: { tint: { value: chargeTint }, hot: { value: color("--color-grey-00") }, time: { value: 0 }, strength: { value: 1 } },
        vertexShader: "varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
        fragmentShader: `varying vec2 v;uniform vec3 tint;uniform vec3 hot;uniform float time;uniform float strength;
          void main(){
            vec2 p=(v-.5)*2.;float d=length(p);
            float pool=exp(-d*d*4.5);
            float skirt=exp(-pow((d-.62)*6.,2.));
            float angle=atan(p.y,p.x);
            float sweep=pow(max(0.,cos(angle-time)),8.);
            float falloff=1.-smoothstep(.68,1.,d);
            float phase=fract(time*.32);
            float ripple=exp(-pow((d-phase*.85)*9.,2.))*(1.-phase);
            float alpha=(pool*.2+skirt*(.07+sweep*.19)+ripple*.28)*falloff*strength;
            gl_FragColor=vec4(mix(tint,hot,sweep*.12),alpha);
          }`,
        transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      });
      const chargingPool = new T.Mesh(new T.PlaneGeometry(7.2, 4.5), chargingMaterial);
      chargingPool.rotation.x = -Math.PI / 2; chargingPool.position.y = .012; scene.add(chargingPool);
      const bouncedLights: Three.PointLight[] = [];
      for (const side of [-1, 1]) {
        const light = new T.PointLight(chargeTint, 3, 4, 2);
        light.position.set(-.5, .18, side * 1.12); scene.add(light); bouncedLights.push(light);
      }
      const chargePortMaterial = new T.MeshStandardMaterial({ color: chargeTint, emissive: chargeTint, emissiveIntensity: 2, roughness: .4 });
      const chargePort = new T.Mesh(new T.SphereGeometry(.018, 12, 8), chargePortMaterial);
      chargePort.position.set(-1.78, 1.06, .955); modelGroup.add(chargePort);
      let frame = 0;
      let visible = true;
      const observer = new ResizeObserver(() => { const bounds = node.getBoundingClientRect(); renderer.setSize(bounds.width, bounds.height); camera.aspect = bounds.width / bounds.height; camera.updateProjectionMatrix(); });
      observer.observe(node);
      const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); visibility.observe(node);
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const dispose = () => {
        cancelAnimationFrame(frame); observer.disconnect(); visibility.disconnect();
        scene.traverse(object => { if (object instanceof T.Mesh) { object.geometry.dispose(); const materials = Array.isArray(object.material) ? object.material : [object.material]; materials.forEach(material => material.dispose()); } });
        environment.dispose(); room.dispose(); pmrem.dispose(); renderer.dispose(); renderer.domElement.remove();
      };
      cleanup = dispose;
      try {
        const gltf = await new GLTFLoader().loadAsync("/vinclub-assets/charging/electric-sedan-pearl.glb");
        if (disposed) { gltf.scene.traverse(object => { if (object instanceof T.Mesh) { object.geometry.dispose(); (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => material.dispose()); } }); return; }
        const bounds = new T.Box3().setFromObject(gltf.scene);
        const center = bounds.getCenter(new T.Vector3());
        gltf.scene.position.set(-center.x, -bounds.min.y, -center.z);
        gltf.scene.traverse(object => { if (object instanceof T.Mesh) { object.castShadow = true; object.receiveShadow = true;
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          const polished = materials.map(material => {
            if (!(material instanceof T.MeshStandardMaterial) || material.name !== "Pearl white paint") return material;
            const paint = new T.MeshPhysicalMaterial({
              name: material.name, color: color("--color-grey-50"),
              roughness: .2, metalness: .18, clearcoat: 1, clearcoatRoughness: .12,
              envMapIntensity: 1.15,
            });
            material.dispose();
            return paint;
          });
          object.material = Array.isArray(object.material) ? polished : polished[0];
          } });
        modelGroup.add(gltf.scene);
        transition.current = performance.now();
        node.dataset.viewer = "ready";
        node.dataset.source = "local-electric-sedan";
        setStatus("ready");
      } catch { if (!disposed) setStatus("failed"); }
      if (disposed) return;
      const tick = (now: number) => {
        if (disposed) return;
        frame = requestAnimationFrame(tick);
        if (!visible || document.hidden) return;
        const progress = large ? reduced ? 1 : Math.min(Math.max((now - transition.current - 150) / 1550, 0), 1) : 0;
        const ease = progress * progress * (3 - 2 * progress);
        const angle = -.95 + ease * .25;
        camera.position.set(Math.sin(angle) * 10 * ease, 10.7 - 5.9 * ease, Math.cos(angle) * 10 * ease + .01);
        camera.up.set(-1 + ease, ease, 0).normalize(); camera.lookAt(0, .75, 0);
        node.dataset.pose = large && progress < 1 ? "rotating" : large ? "three-quarter" : "overhead";
        const breath = reduced ? 1 : .88 + Math.sin(now * .0018) * .12;
        chargingMaterial.uniforms.time.value = reduced ? .6 : now * .00075;
        chargingMaterial.uniforms.strength.value = paused.current ? 0 : breath;
        bouncedLights.forEach(light => { light.intensity = paused.current ? 0 : 3 * breath; });
        chargePortMaterial.emissiveIntensity = paused.current ? 0 : 1.8 * breath;
        chargePort.visible = !paused.current;
        node.dataset.chargingLight = paused.current ? "off" : "soft-ground-glow";
        renderer.render(scene, camera);
      };
      frame = requestAnimationFrame(tick);
    }).catch(() => { if (!disposed) setStatus("failed"); });
    return () => { disposed = true; cleanup(); };
  }, [large]);
  return <div ref={host} className={`charge-stage charge-model-stage ${large ? "charge-stage-large" : ""}`} role="img" aria-label="Sedan trắng 3D với ánh sáng sạc chuyển động">{status !== "ready" && <span className="charge-model-loading"><Box size={18}/><span>{status === "failed" ? "Chưa thể hiển thị 3D" : "Đang tải xe…"}</span></span>}</div>;
}
