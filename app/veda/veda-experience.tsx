"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const files = [
  "radial-gold",
  "flower-copper",
  "spiral-silver",
  "facet-gold",
  "flower-silver",
  "logo-gold",
  "spiral-copper",
  "facet-copper",
];
type Mode = "scroll" | "ring" | "assembly";
type Stage = {
  element: HTMLElement;
  scene: THREE.Scene;
  root: THREE.Group;
  objects: THREE.Group[];
  camera: THREE.PerspectiveCamera;
  kind: string;
};
const clamp = THREE.MathUtils.clamp;
const mix = THREE.MathUtils.lerp;
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

function Brand({ large = false }: { large?: boolean }) {
  return (
    <a
      href="#top"
      className={`veda-brand ${large ? "veda-brand-large" : ""}`}
      aria-label="Veda, back to top"
    >
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <path
          d="M22 12H78Q99 12 88 34L59 86Q50 102 40 86L10 34Q-2 12 22 12Z"
          fill="currentColor"
        />
        <circle cx="65" cy="32" r="17" className="veda-brand-aperture" />
      </svg>
      <span>Veda</span>
    </a>
  );
}

function Renderer({
  controls,
  onStatus,
}: {
  controls: React.RefObject<{
    paused: boolean;
    mode: Mode;
    wire: boolean;
    dragX: number;
    dragY: number;
  }>;
  onStatus: (s: string) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host.current) return;
    let disposed = false;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      onStatus("3D unavailable — please enable WebGL in your browser.");
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
    renderer.setSize(innerWidth, innerHeight);
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    renderer.autoClear = false;
    host.current.appendChild(renderer.domElement);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, 0.025);
    room.dispose();
    pmrem.dispose();
    const loader = new GLTFLoader();
    const stages: Stage[] = [];
    let originals: THREE.Group[] = [];
    const rootElement = document.querySelector(".veda-page")!;
    const colorToken = (name: string) => {
      const probe = document.createElement("span");
      probe.style.color = `var(${name})`;
      rootElement.appendChild(probe);
      const color = getComputedStyle(probe).color;
      probe.remove();
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const p = ctx.getImageData(0, 0, 1, 1).data;
      return new THREE.Color().setRGB(
        p[0] / 255,
        p[1] / 255,
        p[2] / 255,
        THREE.SRGBColorSpace
      );
    };
    const finishes = [
      colorToken("--veda-silver"),
      colorToken("--veda-gold"),
      colorToken("--veda-copper"),
    ];
    Promise.all(
      files.map((file) => loader.loadAsync(`/veda/models/${file}.glb`))
    )
      .then((results) => {
        originals = results.map((r) => r.scene);
        if (disposed) {
          originals.forEach(disposeObject);
          return;
        }
        document
          .querySelectorAll<HTMLElement>("[data-veda-stage]")
          .forEach((element) => {
            const kind = element.dataset.vedaStage!;
            const scene = new THREE.Scene();
            scene.environment = env.texture;
            scene.environmentIntensity = 1.0;
            const root = new THREE.Group();
            scene.add(root);
            const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
            camera.position.set(0, 0, 12);
            const key = new THREE.DirectionalLight(finishes[0], 1.4);
            key.position.set(-3, 5, 6);
            scene.add(key);
            const fill = new THREE.DirectionalLight(finishes[1], 0.65);
            fill.position.set(4, -2, 5);
            scene.add(fill);
            const indices =
              kind === "hero"
                ? [5]
                : kind === "materials"
                ? [5, 5, 5]
                : kind === "forms"
                ? [0, 2, 3, 1]
                : [1, 0, 3, 4, 6, 2];
            const objects = indices.map((index, i) => {
              const group = new THREE.Group();
              const model = originals[index].clone(true);
              model.name = "primary";
              model.traverse((o) => {
                if (o instanceof THREE.Mesh) {
                  o.material = (
                    o.material as THREE.MeshStandardMaterial
                  ).clone();
                  const m = o.material as THREE.MeshStandardMaterial;
                  m.envMapIntensity = 1.2;
                  if (kind === "materials") m.color.set(finishes[i]);
                }
              });
              group.add(model);
              if (kind === "assembly" && i === 0) {
                const alt = originals[7].clone(true);
                alt.name = "alternate";
                alt.visible = false;
                alt.traverse((o) => {
                  if (o instanceof THREE.Mesh)
                    o.material = (
                      o.material as THREE.MeshStandardMaterial
                    ).clone();
                });
                group.add(alt);
              }
              root.add(group);
              return group;
            });
            stages.push({ element, scene, root, objects, camera, kind });
          });
        rootElement.setAttribute("data-ready", "true");
        onStatus("ready");
      })
      .catch(() => {
        if (!disposed)
          onStatus("Could not load the sculptures. Reload to try again.");
      });
    function disposeObject(object: THREE.Object3D) {
      object.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => m.dispose());
        }
      });
    }
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let last = performance.now();
    let time = 0;
    let progress = 0;
    const resize = () => {
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
      renderer.setSize(innerWidth, innerHeight);
    };
    window.addEventListener("resize", resize);
    const handleLost = (event: Event) => {
      event.preventDefault();
      onStatus("3D paused — reload to restore the graphics context.");
    };
    renderer.domElement.addEventListener("webglcontextlost", handleLost);
    renderer.setAnimationLoop((now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (rootElement.getAttribute("data-reference")) time = 0;
      if (!controls.current.paused && !reduced.matches && !document.hidden)
        time += dt;
      renderer.setScissorTest(false);
      renderer.clear();
      renderer.setScissorTest(true);
      for (const stage of stages) {
        const { element, camera, scene, objects, root, kind } = stage;
        const r = element.getBoundingClientRect();
        if (
          r.bottom <= 0 ||
          r.top >= innerHeight ||
          r.width === 0 ||
          r.height === 0
        )
          continue;
        const aspect = r.width / r.height;
        camera.aspect = aspect;
        camera.position.z =
          kind === "hero"
            ? aspect < 1
              ? 9
              : 8
            : kind === "assembly"
            ? aspect < 0.8
              ? 18
              : 13
            : kind === "forms"
            ? aspect < 1
              ? 17
              : 13
            : aspect < 1
            ? 14
            : 12;
        if (kind === "forms" || kind === "materials") {
          const requiredWidth = kind === "forms" ? 11.3 : 9;
          camera.position.z =
            Math.max(2.8, requiredWidth / aspect) /
            (2 * Math.tan(THREE.MathUtils.degToRad(16)));
        }
        camera.updateProjectionMatrix();
        if (kind === "hero") {
          objects[0].scale.setScalar(1.25);
          objects[0].rotation.set(
            0.14 + Math.sin(time * 0.35) * 0.12,
            Math.sin(time * 0.28) * 0.48,
            -0.15 + Math.sin(time * 0.23) * 0.12
          );
        } else if (kind === "assembly") {
          const reference = rootElement.getAttribute("data-reference");
          const section = element
            .closest<HTMLElement>(".veda-assembly-scroll")!
            .getBoundingClientRect();
          const target =
            reference === "assembly"
              ? 1
              : reference === "ring"
              ? 0
              : controls.current.mode === "ring"
              ? 0
              : controls.current.mode === "assembly"
              ? 1
              : smooth(
                  0,
                  1,
                  -section.top / Math.max(1, section.height - innerHeight)
                );
          progress =
            reference || reduced.matches
              ? target
              : THREE.MathUtils.damp(progress, target, 5, dt);
          element.dataset.formation = progress > 0.5 ? "assembly" : "ring";
          root.rotation.x = THREE.MathUtils.damp(
            root.rotation.x,
            controls.current.dragY,
            7,
            dt
          );
          root.rotation.y = THREE.MathUtils.damp(
            root.rotation.y,
            controls.current.dragX,
            7,
            dt
          );
          objects.forEach((object, i) => {
            const angle =
              Math.PI / 2 - (i * Math.PI) / 3 + Math.sin(time * 0.12) * 0.06;
            const ringX = 2.35 * Math.cos(angle);
            const ringY = 2.35 * Math.sin(angle);
            const clusterX = [-1.03, -1.78, 0.65, 0, 1.45, -0.24][i];
            object.position.set(
              mix(ringX, clusterX, progress),
              mix(ringY, Math.sin(i * 1.4) * 0.12, progress),
              mix(0, [0.5, -0.4, 0.65, -0.6, -0.2, 0.85][i], progress)
            );
            const tilt = Math.sin(time * 0.4 + i * 0.65) * 0.3;
            const primary = object.getObjectByName("primary");
            const alternate = object.getObjectByName("alternate");
            if (primary && alternate) {
              primary.visible = progress < 0.5;
              alternate.visible = progress >= 0.5;
            }
            const clusterTilt = [-0.65, -0.6, 0.7, 0, 0.2, 1.52][i];
            object.visible = !(i === 3 && progress > 0.8);
            object.rotation.set(
              mix(0.15, 0.07, progress),
              mix(tilt, clusterTilt + tilt * 0.3, progress),
              mix(Math.sin(time * 0.18 + i) * 0.1, 0.06 * Math.sin(i), progress)
            );
            object.scale.setScalar(
              mix(0.91, i === 5 ? 1.05 : i === 4 ? 1.2 : 1.25, progress)
            );
            if (reference) {
              camera.position.z = reference === "assembly" ? 6.3 : 15;
              camera.updateProjectionMatrix();
            }
          });
        } else {
          const spacing = kind === "forms" ? 2.45 : 2.65;
          objects.forEach((object, i) => {
            object.position.set((i - (objects.length - 1) / 2) * spacing, 0, 0);
            object.rotation.set(
              0.08,
              Math.sin(time * 0.35 + i * 0.65) * 0.26,
              kind === "materials" ? -0.12 : 0
            );
            object.scale.setScalar(kind === "materials" ? 1.1 : 1);
            object.traverse((o) => {
              if (o instanceof THREE.Mesh) {
                const mat = o.material as THREE.MeshStandardMaterial;
                mat.wireframe = kind === "forms" && controls.current.wire;
              }
            });
          });
        }
        renderer.setViewport(r.left, innerHeight - r.bottom, r.width, r.height);
        renderer.setScissor(
          Math.max(0, r.left),
          Math.max(0, innerHeight - r.bottom),
          Math.min(innerWidth, r.right) - Math.max(0, r.left),
          Math.min(innerHeight, r.bottom) - Math.max(0, r.top)
        );
        renderer.clearDepth();
        renderer.render(scene, camera);
      }
      renderer.setScissorTest(false);
    });
    return () => {
      disposed = true;
      window.removeEventListener("resize", resize);
      renderer.domElement.removeEventListener("webglcontextlost", handleLost);
      renderer.setAnimationLoop(null);
      stages.forEach((stage) => disposeObject(stage.root));
      originals.forEach(disposeObject);
      env.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [controls, onStatus]);
  return <div ref={host} className="veda-renderer" aria-hidden="true" />;
}

export default function VedaExperience() {
  const [reference, setReference] = useState("");
  const [status, setStatus] = useState("loading");
  const [paused, setPaused] = useState(false);
  const [mode, setMode] = useState<Mode>("scroll");
  const [wire, setWire] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  useEffect(() => {
    const value = new URLSearchParams(location.search).get("reference");
    if (value === "assembly" || value === "ring") {
      setReference(value);
      setPaused(true);
      setMode(value === "ring" ? "ring" : "assembly");
    }
  }, []);
  const controls = useRef({
    paused: false,
    mode: "scroll" as Mode,
    wire: false,
    dragX: 0,
    dragY: 0,
  });
  const drag = useRef<{
    x: number;
    y: number;
    startX: number;
    startY: number;
  } | null>(null);
  useEffect(() => {
    controls.current.paused = paused;
    controls.current.mode = mode;
    controls.current.wire = wire;
  }, [paused, mode, wire]);
  useEffect(() => {
    const update = () =>
      setScrollPercent(
        Math.round(
          (scrollY /
            Math.max(1, document.documentElement.scrollHeight - innerHeight)) *
            100
        )
      );
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);
  return (
    <main className="veda-page" id="top" data-reference={reference}>
      <Renderer controls={controls} onStatus={setStatus} />
      <header className="veda-header px-[22px]">
        <Brand />
        <span className="veda-header-caption">
          An exploration of form
          <br />
          and the value within.
        </span>
        <a href="#assemblies" className="veda-header-link">
          Explore the forms <ArrowUpRight size={15} />
        </a>
      </header>
      <section className="veda-hero px-[22px]" aria-labelledby="hero-title">
        <div className="veda-hero-copy">
          <h1 id="hero-title">Form Assemblies</h1>
          <p>
            Form Assemblies bring together individual geometric assets to create
            fluid compositions that extend the visual language beyond single
            forms.
          </p>
          <p>
            By combining different forms, materials, scales, and orientations,
            the system gains greater depth, richness, and flexibility.
          </p>
          <Button
            variant="primary"
            size="32"
            onClick={() =>
              document
                .getElementById("assemblies")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore assemblies <ArrowDown size={14} />
          </Button>
        </div>
        <div
          className="veda-hero-object"
          data-veda-stage="hero"
          role="img"
          aria-label="A gold rounded triangular medallion with an offset circular opening and radiating ribs"
        />
        <div className="veda-section-meta">
          <span>01 / 05</span>
          <span>Veda — Form studies</span>
          <span>SCROLL TO EXPLORE ↓</span>
        </div>
      </section>
      <section
        id="assemblies"
        className="veda-assembly-scroll veda-dark"
        aria-labelledby="assembly-title"
      >
        <div className="veda-assembly-sticky">
          <div className="veda-editorial-heading px-[22px] pt-[24px] pb-[12px]">
            <Brand />
            <h2 id="assembly-title">Form Assemblies</h2>
            <div>
              <p>
                Form Assemblies combine multiple geometric assets into unified
                compositions that showcase the flexibility of the visual system.
              </p>
              <p>
                Through the interaction of form, materiality, and spatial
                relationships, these arrangements create visual depth while
                maintaining an underlying program of structure, complexity, and
                expression that defines the Veda identity.
              </p>
            </div>
          </div>
          <div
            data-veda-stage="assembly"
            className="veda-assembly-stage"
            role="img"
            aria-label="Six metallic medallions transition from a circular arrangement to a layered horizontal assembly as you scroll"
            onPointerDown={(e) => {
              if (e.pointerType === "touch") return;
              e.currentTarget.setPointerCapture(e.pointerId);
              drag.current = {
                x: e.clientX,
                y: e.clientY,
                startX: controls.current.dragX,
                startY: controls.current.dragY,
              };
            }}
            onPointerMove={(e) => {
              if (!drag.current) return;
              controls.current.dragX = clamp(
                drag.current.startX + (e.clientX - drag.current.x) * 0.005,
                -1.2,
                1.2
              );
              controls.current.dragY = clamp(
                drag.current.startY + (e.clientY - drag.current.y) * 0.005,
                -0.7,
                0.7
              );
            }}
            onPointerUp={() => {
              drag.current = null;
            }}
            onPointerCancel={() => {
              drag.current = null;
            }}
          />
          <div className="veda-assembly-controls px-[22px]">
            <span>SCROLL TO ASSEMBLE · DRAG TO ROTATE</span>
            <div>
              {(["scroll", "ring", "assembly"] as Mode[]).map((value) => (
                <Button
                  key={value}
                  size="32"
                  variant="secondary"
                  aria-pressed={mode === value}
                  onClick={() => setMode(value)}
                  className="veda-mode-button"
                >
                  {value === "scroll"
                    ? "Follow scroll"
                    : value === "ring"
                    ? "Orbit"
                    : "Assembly"}
                </Button>
              ))}
              <Button
                variant="secondary"
                size="32"
                aria-label="Reset rotation"
                onClick={() => {
                  controls.current.dragX = 0;
                  controls.current.dragY = 0;
                  setMode("scroll");
                }}
              >
                <RotateCcw size={13} />
              </Button>
            </div>
          </div>
          <div className="veda-section-meta px-[22px]">
            <span>{reference ? "12 / 29" : "02 / 05"}</span>
            <span>Six objects. One visual language.</span>
            <span>
              {reference ? "©2025 Veda — Brand Guidelines" : "FORM ASSEMBLIES"}
            </span>
          </div>
        </div>
      </section>
      <section
        className="veda-geometry px-[22px]"
        id="geometry"
        aria-labelledby="geometry-title"
      >
        <div className="veda-editorial-heading pt-[24px] pb-[12px]">
          <Brand />
          <h2 id="geometry-title">Foundational Geometry</h2>
          <div>
            <p>
              A shared vocabulary of radial lines, interlacing curves, and
              folded planes.
            </p>
            <p>From a simple construction to a dimensional object.</p>
          </div>
        </div>
        <div className="veda-geometry-toggle">
          <span>THE STRUCTURE BENEATH THE SURFACE</span>
          <Button
            variant="secondary"
            size="32"
            onClick={() => setWire((v) => !v)}
            aria-pressed={wire}
          >
            {wire ? "Show surfaces" : "Reveal geometry"}{" "}
            <ArrowUpRight size={13} />
          </Button>
        </div>
        <div
          className="veda-forms-stage"
          data-veda-stage="forms"
          role="img"
          aria-label="Four geometric metal forms: radial fan, sixfold spiral, faceted octagon and interlaced petals"
        />
        <div className="veda-form-labels">
          <span>01 — Radial</span>
          <span>02 — Spiral</span>
          <span>03 — Faceted</span>
          <span>04 — Interlaced</span>
        </div>
        <div className="veda-section-meta">
          <span>03 / 05</span>
          <span>Geometry as a common thread.</span>
          <span>FOUNDATIONS</span>
        </div>
      </section>
      <section
        className="veda-materials px-[22px]"
        id="materials"
        aria-labelledby="material-title"
      >
        <div className="veda-editorial-heading pt-[24px] pb-[12px]">
          <Brand />
          <h2 id="material-title">Material Expressions</h2>
          <div>
            <p>
              One form, three distinct expressions. Reflections move across cast
              surfaces, revealing depth and detail.
            </p>
            <p>Platinum. Champagne. Copper.</p>
          </div>
        </div>
        <div
          className="veda-material-stage"
          data-veda-stage="materials"
          role="img"
          aria-label="The Veda rounded triangle in platinum silver, champagne gold and rose copper"
        />
        <div className="veda-material-labels">
          <span>
            PLATINUM
            <br />
            <small>Cool / reflective</small>
          </span>
          <span>
            CHAMPAGNE
            <br />
            <small>Warm / luminous</small>
          </span>
          <span>
            COPPER
            <br />
            <small>Rich / expressive</small>
          </span>
        </div>
        <div className="veda-section-meta">
          <span>04 / 05</span>
          <span>A study in light and material.</span>
          <span>MATERIALS</span>
        </div>
      </section>
      <section
        className="veda-end veda-dark px-[22px]"
        aria-label="End of collection"
      >
        <span className="veda-eyebrow">MANY FORMS. ONE VEDA.</span>
        <Brand large />
        <a href="#top">
          Back to the beginning <ArrowUpRight size={16} />
        </a>
        <div className="veda-section-meta">
          <span>05 / 05</span>
          <span>Reference reconstruction / interactive study</span>
          <span>VEDA</span>
        </div>
      </section>
      <footer className="veda-fixed-bottom px-[22px]">
        <span>
          {status === "ready"
            ? "FORM STUDIES"
            : status === "loading"
            ? "LOADING OBJECTS…"
            : status}
        </span>
        <span className="veda-scroll-count">
          {String(scrollPercent).padStart(2, "0")} / 100
        </span>
        <Button
          variant="secondary"
          size="32"
          aria-label={paused ? "Resume motion" : "Pause motion"}
          aria-pressed={paused}
          onClick={() => setPaused((v) => !v)}
        >
          {paused ? <Play size={12} /> : <Pause size={12} />}
          <span>{paused ? "Play" : "Pause"}</span>
        </Button>
        <div className="veda-home-indicator w-[139px] h-[5px] bg-foreground" />
      </footer>
    </main>
  );
}
