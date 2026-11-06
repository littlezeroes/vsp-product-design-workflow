"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { projectPlateReflection } from "./reflections";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";

type SceneMode = "ring" | "assembly" | "logos" | "facet";
type Key = {
  sourceFrame: number;
  ptsMs: number;
  smoothedCenterPx: [number, number];
  smoothedRadiusPx: number;
  smoothedTiltRadians: number;
};
type Panel = {
  sourceFrame: number;
  ptsMs: number;
  scene: SceneMode;
  panelTop: number;
  image: string;
};
type Data = {
  facet: {
    sourceFrame: number;
    smoothedRotationY: number;
    centerPx: [number, number];
    scale: number;
  }[];
  fps: number;
  sourceFrameCount: number;
  ring: Key[];
  panels: Panel[];
  stack: {
    referenceTimeMs: number;
    angularSpeedRadPerSec: number;
    objects: {
      model: number;
      position: [number, number, number];
      rotationY: number;
      scale: number;
    }[];
  };
};
const files = [
  "flower-copper",
  "radial-gold",
  "facet-gold",
  "flower-silver",
  "spiral-copper",
  "spiral-silver",
  "facet-copper",
  "logo-gold",
];
const zAxis = new THREE.Vector3(0, 0, 1),
  xAxis = new THREE.Vector3(1, 0, 0),
  yAxis = new THREE.Vector3(0, 1, 0);

function StudyCanvas({
  data,
  frame,
  mode,
  onStatus,
}: {
  data: Data | null;
  frame: number;
  mode: SceneMode;
  onStatus: (s: string) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const current = useRef({ frame, mode });
  useEffect(() => {
    current.current = { frame, mode };
  }, [frame, mode]);
  useEffect(() => {
    if (!host.current || !data) return;
    let dead = false;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
      });
    } catch {
      onStatus("Không khởi tạo được WebGL.");
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setClearColor(0, 0);
    renderer.toneMapping = THREE.AgXToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.current.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -6.6,
      6.6,
      3.72,
      -3.72,
      0.1,
      100
    );
    camera.position.set(0, 0, 20);
    const loader = new GLTFLoader();
    let environment: THREE.DataTexture | null = null;
    const models: THREE.Group[] = [];
    const ring = new THREE.Group(),
      stack = new THREE.Group(),
      logos = new THREE.Group(),
      facet = new THREE.Group();
    scene.add(ring, stack, logos, facet);
    const ringPieces: THREE.Group[] = [],
      stackPieces: THREE.Group[] = [],
      logoPieces: THREE.Group[] = [],
      facetPieces: THREE.Group[] = [];
    const logoChildren: { old: THREE.Group; logo: THREE.Group }[] = [];
    const reflections = new Map<
      THREE.Group,
      {
        camera: THREE.CubeCamera;
        target: THREE.WebGLCubeRenderTarget;
        materials: THREE.MeshStandardMaterial[];
      }
    >();
    const addReflection = (piece: THREE.Group) => {
      const target = new THREE.WebGLCubeRenderTarget(64, {
        type: THREE.HalfFloatType,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
      });
      const probe = new THREE.CubeCamera(0.04, 60, target);
      const materials: THREE.MeshStandardMaterial[] = [];
      piece.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.material = (
            object.material as THREE.MeshStandardMaterial
          ).clone();
          projectPlateReflection(
            object.material as THREE.MeshStandardMaterial,
            probe.position
          );
          materials.push(object.material as THREE.MeshStandardMaterial);
        }
      });
      reflections.set(piece, { camera: probe, target, materials });
    };
    let lastFrame = -1,
      lastMode = "";
    let loaded = false;
    const resize = () => {
      if (!host.current) return;
      const r = host.current.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      lastFrame = -1;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host.current);
    resize();
    const dispose = (object: THREE.Object3D) => {
      object.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          for (const m of Array.isArray(o.material) ? o.material : [o.material])
            m.dispose();
        }
      });
    };
    Promise.all([
      new HDRLoader().loadAsync("/veda-v3/studio.hdr"),
      ...files.map((file) => loader.loadAsync(`/veda-v3/models/${file}.glb`)),
    ])
      .then((results) => {
        environment = results[0] as THREE.DataTexture;
        for (const result of results.slice(1))
          models.push(
            (result as Awaited<ReturnType<GLTFLoader["loadAsync"]>>).scene
          );
        if (dead) {
          environment.dispose();
          models.forEach(dispose);
          return;
        }
        environment.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = environment;
        scene.environmentIntensity = 1;
        scene.environmentRotation.y = Number(
          new URLSearchParams(location.search).get("studioRotation") ??
            Math.PI / 2
        );
        for (let i = 0; i < 6; i++) {
          const p = new THREE.Group();
          p.add(models[i].clone(true));
          ring.add(p);
          ringPieces.push(p);
          addReflection(p);
        }
        data.stack.objects.forEach((item) => {
          const p = new THREE.Group();
          p.add(models[item.model].clone(true));
          p.position.set(...item.position);
          p.rotation.y = item.rotationY;
          p.scale.setScalar(item.scale);
          stack.add(p);
          stackPieces.push(p);
          addReflection(p);
        });
        stack.position.y = -0.24;
        const withFinish = (index: number, finishIndex: number) => {
          let finish: THREE.MeshStandardMaterial | null = null;
          models[finishIndex].traverse((o) => {
            if (!finish && o instanceof THREE.Mesh)
              finish = o.material as THREE.MeshStandardMaterial;
          });
          const result = models[index].clone(true);
          result.traverse((o) => {
            if (o instanceof THREE.Mesh) {
              const m = (o.material as THREE.MeshStandardMaterial).clone();
              if (finish) {
                m.color.copy((finish as THREE.MeshStandardMaterial).color);
                m.roughness = (finish as THREE.MeshStandardMaterial).roughness;
              }
              o.material = m;
            }
          });
          return result;
        };
        [1, 0, 6].forEach((index, i) => {
          const p = new THREE.Group();
          p.position.set(([83.5, 250, 415.5][i] - 330) / 50, 0.02, 0);
          const old = withFinish(index, [5, 1, 0][i]);
          old.scale.setScalar([1.12, 1.12, 1.15][i]);
          const logo = withFinish(7, [5, 1, 0][i]);
          logo.rotation.x = Math.PI;
          logo.scale.setScalar(1.24);
          p.add(old, logo);
          logos.add(p);
          logoPieces.push(p);
          logoChildren.push({ old, logo });
          addReflection(p);
        });
        const isolated = withFinish(2, 5);
        const isolatedGroup = new THREE.Group();
        isolatedGroup.add(isolated);
        facet.add(isolatedGroup);
        facetPieces.push(isolatedGroup);
        addReflection(isolatedGroup);

        loaded = true;
        onStatus("ready");
        host.current?.setAttribute("data-ready", "true");
      })
      .catch(() => {
        if (!dead)
          onStatus("Không tải được bộ mô hình hoặc môi trường ánh sáng.");
      });
    renderer.setAnimationLoop(() => {
      if (!loaded) return;
      const value = current.current;
      if (value.frame === lastFrame && value.mode === lastMode) return;
      lastFrame = value.frame;
      lastMode = value.mode;
      ring.visible = value.mode === "ring";
      stack.visible = value.mode === "assembly";
      logos.visible = value.mode === "logos";
      facet.visible = value.mode === "facet";
      if (value.mode === "ring") {
        const k =
          data.ring.find((k) => k.sourceFrame === value.frame) || data.ring[0];
        const [cx, cy] = k.smoothedCenterPx;
        ringPieces.forEach((p, i) => {
          const a = Math.PI / 2 - (i * Math.PI) / 3;
          const r = k.smoothedRadiusPx / 50;
          p.position.set(
            (cx - 330) / 50 + r * Math.cos(a),
            (186 - cy) / 50 + r * Math.sin(a),
            0
          );
          p.quaternion
            .setFromAxisAngle(zAxis, a - Math.PI / 2)
            .multiply(
              new THREE.Quaternion().setFromAxisAngle(
                xAxis,
                k.smoothedTiltRadians
              )
            )
            .multiply(
              new THREE.Quaternion().setFromAxisAngle(
                yAxis,
                i === 2 ? Math.PI : 0
              )
            );
          p.scale.setScalar(1.06);
        });
      } else if (value.mode === "assembly") {
        stack.rotation.y =
          (value.frame / 30 - data.stack.referenceTimeMs / 1000) *
          data.stack.angularSpeedRadPerSec;
      } else if (value.mode === "logos") {
        logoPieces.forEach((p, i) => {
          const u = THREE.MathUtils.smoothstep(
            value.frame,
            448 + 5 * i,
            472 + 5 * i
          );
          p.rotation.x = Math.PI * u;
          logoChildren[i].old.visible = value.frame < [460, 465, 470][i];
          logoChildren[i].logo.visible = !logoChildren[i].old.visible;
        });
      } else {
        const k =
          data.facet.find((k) => k.sourceFrame === value.frame) ||
          data.facet[0];
        facetPieces[0].position.set(
          (k.centerPx[0] - 330) / 50,
          (186 - k.centerPx[1]) / 50,
          0
        );
        facetPieces[0].rotation.y = k.smoothedRotationY;
        facetPieces[0].scale.setScalar(k.scale);
      }
      // Capture the neighbouring plates as well as the studio cards. A distant
      // environment alone misses the coloured reflections visible in the source.
      scene.updateMatrixWorld(true);
      scene.background = environment;
      scene.backgroundRotation.copy(scene.environmentRotation);
      for (const piece of value.mode === "ring"
        ? ringPieces
        : value.mode === "assembly"
        ? stackPieces
        : value.mode === "logos"
        ? logoPieces
        : facetPieces) {
        const reflection = reflections.get(piece)!;
        piece.getWorldPosition(reflection.camera.position);
        piece.visible = false;
        reflection.camera.update(renderer, scene);
        piece.visible = true;
        for (const material of reflection.materials) {
          if (material.envMap !== reflection.target.texture) {
            material.envMap = reflection.target.texture;
            material.needsUpdate = true;
          }
        }
      }
      scene.background = null;
      renderer.render(scene, camera);
      host.current?.setAttribute("data-rendered-frame", String(value.frame));
    });
    return () => {
      dead = true;
      observer.disconnect();
      renderer.setAnimationLoop(null);
      for (const reflection of reflections.values()) {
        reflection.target.dispose();
        reflection.materials.forEach((material) => material.dispose());
      }
      models.forEach(dispose);
      environment?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [data, onStatus]);
  return (
    <div
      ref={host}
      className={`veda-study-canvas ${
        mode === "logos" || mode === "facet" ? "veda-study-canvas-light" : ""
      }`}
      role="img"
      aria-label={`Bản dựng 3D tại frame ${frame}, cảnh ${mode}`}
    />
  );
}

export default function FrameStudy() {
  const [data, setData] = useState<Data | null>(null);
  const [mode, setMode] = useState<SceneMode>("ring");
  const [frame, setFrame] = useState(60);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.25);
  const [status, setStatus] = useState("Đang tải dữ liệu đo…");
  useEffect(() => {
    fetch("/veda-v3/motion.json")
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then(setData)
      .catch(() => setStatus("Không tải được dữ liệu đo."));
  }, []);
  const panels = data?.panels.filter((p) => p.scene === mode) || [];
  const min = panels[0]?.sourceFrame ?? 55,
    max = panels.at(-1)?.sourceFrame ?? 95;
  const panel = panels.find((p) => p.sourceFrame === frame);
  const key = data?.ring.find((k) => k.sourceFrame === frame);
  const updateStatus = useCallback((s: string) => setStatus(s), []);
  useEffect(() => {
    if (!playing) return;
    let id: number;
    let last = performance.now();
    let accumulated = 0;
    const step = (now: number) => {
      accumulated += Math.min(now - last, 100);
      last = now;
      const amount = Math.floor(accumulated / (1000 / 30 / speed));
      if (amount) {
        accumulated -= amount * (1000 / 30 / speed);
        setFrame((f) => min + ((f - min + amount) % (max - min + 1)));
      }
      id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [playing, speed, min, max]);
  const select = (m: SceneMode) => {
    setPlaying(false);
    setMode(m);
    setFrame({ ring: 60, assembly: 315, logos: 480, facet: 150 }[m]);
  };
  const step = (n: number) => {
    setPlaying(false);
    setFrame((f) => Math.min(max, Math.max(min, f + n)));
  };
  return (
    <main className="veda-page veda-study">
      <header className="veda-study-header px-[22px]">
        <a href="#study-title">Veda</a>
        <span>BLENDER / SOURCE FRAME STUDY</span>
        <a href="/veda-v3/blender-study.mp4">Clip Blender</a>
      </header>
      <section className="px-[22px]" aria-labelledby="study-title">
        <div className="pt-[24px] pb-[12px] veda-study-heading">
          <div>
            <h1 id="study-title">Đối chiếu từng khung hình</h1>
            <p>
              680 frame nguồn · 30 fps · bước 33,33 ms. Hình gốc được cắt theo
              vị trí trang đã quan sát.
            </p>
          </div>
          <div className="veda-study-modes">
            <Button
              variant="secondary"
              size="32"
              aria-pressed={mode === "ring"}
              onClick={() => select("ring")}
            >
              01 · Vòng
            </Button>
            <Button
              variant="secondary"
              size="32"
              aria-pressed={mode === "assembly"}
              onClick={() => select("assembly")}
            >
              02 · Xếp ngang
            </Button>
            <Button
              variant="secondary"
              size="32"
              aria-pressed={mode === "facet"}
              onClick={() => select("facet")}
            >
              03 · Khối đa giác
            </Button>
            <Button
              variant="secondary"
              size="32"
              aria-pressed={mode === "logos"}
              onClick={() => select("logos")}
            >
              04 · Lật logo
            </Button>
          </div>
        </div>
        <div className="veda-study-comparison">
          <figure>
            <figcaption>
              <span>VIDEO GỐC</span>
              <span>{panel?.ptsMs.toFixed(2) ?? "—"} ms</span>
            </figcaption>
            <div className="veda-study-reference">
              {panel && (
                <img
                  src={panel.image}
                  width={660}
                  height={372}
                  alt={`Khung hình gốc ${frame}, ${panel.ptsMs.toFixed(2)} ms`}
                  decoding="sync"
                />
              )}
            </div>
          </figure>
          <figure>
            <figcaption>
              <span>HÌNH HỌC BLENDER → 3D</span>
              <span>{status === "ready" ? `Frame ${frame}` : status}</span>
            </figcaption>
            <StudyCanvas
              data={data}
              frame={frame}
              mode={mode}
              onStatus={updateStatus}
            />
          </figure>
        </div>
        <div className="veda-study-timeline">
          <label htmlFor="source-frame">
            Frame nguồn <strong>{frame}</strong> / 679{" "}
            <span>· {((frame * 1000) / 30).toFixed(2)} ms</span>
          </label>
          <input
            id="source-frame"
            type="range"
            min={min}
            max={max}
            step={1}
            value={frame}
            onChange={(e) => {
              setPlaying(false);
              setFrame(Number(e.target.value));
            }}
          />
          <div className="veda-study-range">
            <span>{((min * 1000) / 30).toFixed(2)} ms</span>
            <span>Mỗi nấc = 1 frame nguồn</span>
            <span>{((max * 1000) / 30).toFixed(2)} ms</span>
          </div>
        </div>
      </section>
      <section
        className="px-[22px] veda-study-observations"
        aria-labelledby="observation-title"
      >
        <h2 id="observation-title" className="pt-[24px] pb-[12px]">
          Bằng chứng và phần chưa khớp
        </h2>
        <div className="veda-study-notes">
          <p>
            <strong>8 múi xoáy.</strong> Đếm được 8 đường cắt tại năm bán kính
            trên sơ đồ gốc ở 6500 ms. Đĩa nan có điểm hội tụ lệch tâm.
          </p>
          <p>
            <strong>
              {mode === "ring"
                ? "Trục lật theo tiếp tuyến."
                : mode === "assembly"
                ? "Chuyển động toàn nhóm."
                : mode === "logos"
                ? "Lật lệch pha."
                : "Góc nghiêng từ đường bao."}
            </strong>{" "}
            {mode === "ring"
              ? `Góc nghiêng suy ra từ ảnh: ${
                  key
                    ? THREE.MathUtils.radToDeg(key.smoothedTiltRadians).toFixed(
                        1
                      )
                    : "—"
                }°. Góc này là ước lượng từ ellipse, không phải dữ liệu animation gốc.`
              : mode === "assembly"
              ? "Cảnh xếp ngang xoay một nhóm cứng; vị trí sâu được suy ra từ các tâm quan sát tại hai mốc. Cấu trúc này chưa phải nghiệm 3D duy nhất."
              : mode === "logos"
              ? "Ba cột lật lệch nhau 5 frame, khoảng 166,67 ms. Đường bao logo và lỗ tròn được đo từ frame 480; đổi hình ở cạnh nghiêng là cách dựng thử, không khẳng định cơ chế gốc."
              : "Góc quay của khối được ước lượng từ tỷ lệ rộng/cao trong 38 frame nhìn đủ. Phản chiếu và hình bị che có thể làm lệch phép đo."}
          </p>
          <p>
            <strong>Chưa đạt khớp tuyệt đối.</strong> Còn lệch ánh sáng, đường
            bao múi xoáy và một số chi tiết mặt sau. Không dùng video AI làm mô
            hình 3D.
          </p>
        </div>
      </section>
      <footer className="veda-study-bottom px-[22px]">
        <Button
          variant="secondary"
          size="32"
          aria-label="Lùi một frame"
          disabled={!data || frame === min}
          onClick={() => step(-1)}
        >
          <ChevronLeft size={16} />
          33,33 ms
        </Button>
        <Button
          variant="primary"
          size="32"
          disabled={status !== "ready"}
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}{" "}
          {playing ? "Dừng" : "Phát"}
        </Button>
        <Button
          variant="secondary"
          size="32"
          aria-label="Tiến một frame"
          disabled={!data || frame === max}
          onClick={() => step(1)}
        >
          33,33 ms
          <ChevronRight size={16} />
        </Button>
        <label className="veda-study-speed">
          Tốc độ
          <select
            aria-label="Tốc độ phát"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          >
            <option value={0.25}>0.25×</option>
            <option value={0.5}>0.5×</option>
            <option value={1}>1×</option>
          </select>
        </label>
        <Button
          variant="secondary"
          size="32"
          aria-label="Về đầu đoạn"
          onClick={() => {
            setPlaying(false);
            setFrame(min);
          }}
        >
          <RotateCcw size={14} />
        </Button>
        <div className="veda-study-home w-[139px] h-[5px] bg-foreground" />
      </footer>
    </main>
  );
}
