"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";

interface GlassMap { width: number; height: number; displacement: string; highlight: string; scale: number }
const cache = new Map<string, GlassMap>();

/** Original rounded-rectangle ray field, using a convex squircle bevel and Snell's law. */
function createGlassMap(width: number, height: number, cornerRadius: number): GlassMap {
  const key = `${width}:${height}:${cornerRadius}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const radius = Math.min(cornerRadius, height / 2);
  const bevel = Math.min(5, height / 5);
  const thickness = 7;
  const eta = 1 / 1.5;
  const vectors = new Float32Array(width * height * 2);
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Glass map canvas unavailable");
  const map = ctx.createImageData(width, height);
  const highlight = ctx.createImageData(width, height);
  let maximum = 1;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const px = x + .5 - width / 2, py = y + .5 - height / 2;
    const qx = Math.abs(px) - (width / 2 - radius), qy = Math.abs(py) - (height / 2 - radius);
    const ox = Math.max(qx, 0), oy = Math.max(qy, 0), length = Math.hypot(ox, oy);
    const distance = length + Math.min(Math.max(qx, qy), 0) - radius;
    const i = y * width + x;
    if (distance > 0 || distance < -bevel) continue;
    let nx = 0, ny = 0;
    if (length > 0) { nx = Math.sign(px) * ox / length; ny = Math.sign(py) * oy / length; }
    else if (qx > qy) nx = Math.sign(px); else ny = Math.sign(py);
    const u = Math.min(.999, Math.max(.001, -distance / bevel));
    const v = 1 - u;
    const profile = Math.pow(1 - v ** 4, .25);
    const slope = Math.min(12, v ** 3 / Math.pow(1 - v ** 4, .75));
    const normalLength = Math.hypot(slope, 1);
    const nz = 1 / normalLength;
    const bend = eta * nz - Math.sqrt(1 - eta ** 2 * (1 - nz ** 2));
    const tz = -eta + bend * nz;
    const travel = (thickness + 2 * profile) / Math.max(.1, -tz);
    const dx = bend * nx * slope / normalLength * travel;
    const dy = bend * ny * slope / normalLength * travel;
    vectors[i * 2] = dx; vectors[i * 2 + 1] = dy;
    maximum = Math.max(maximum, Math.abs(dx), Math.abs(dy));
    const light = Math.max(0, (nx + ny) * -.7071);
    const rim = Math.exp(-(((-distance - 1.1) / .85) ** 2));
    const alpha = rim * (.03 + .22 * light ** 3);
    highlight.data[i * 4] = 255; highlight.data[i * 4 + 1] = 255; highlight.data[i * 4 + 2] = 255;
    highlight.data[i * 4 + 3] = Math.round(alpha * 255);
  }
  for (let i = 0; i < width * height; i++) {
    map.data[i * 4] = Math.round(127.5 + vectors[i * 2] / maximum * 127.5);
    map.data[i * 4 + 1] = Math.round(127.5 + vectors[i * 2 + 1] / maximum * 127.5);
    map.data[i * 4 + 2] = 128; map.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(map, 0, 0); const displacement = canvas.toDataURL();
  ctx.putImageData(highlight, 0, 0);
  const result = { width, height, displacement, highlight: canvas.toDataURL(), scale: maximum * 2 };
  if (cache.size > 24) cache.clear();
  cache.set(key, result);
  return result;
}

export function TopGlassOptics() {
  const id = `vc-refraction-${useId().replace(/:/g, "")}`;
  const layer = useRef<HTMLSpanElement>(null);
  const [map, setMap] = useState<GlassMap | null>(null);
  useEffect(() => {
    const node = layer.current;
    if (!node || !/Chrome|Chromium|Edg\//.test(navigator.userAgent)) return;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const { width, height } = node.getBoundingClientRect();
        if (width > 0 && height > 0) setMap(createGlassMap(Math.round(width), Math.round(height), parseFloat(getComputedStyle(node).borderTopLeftRadius) || 0));
      });
    });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  const style = map ? { "--top-glass-filter": `url(#${id})`, "--top-glass-highlight": `url("${map.highlight}")` } as CSSProperties : undefined;
  return <>
    {map && <svg className="vc-refraction-defs" aria-hidden="true"><defs><filter id={id} filterUnits="userSpaceOnUse" x="0" y="0" width={map.width} height={map.height} colorInterpolationFilters="sRGB">
      <feGaussianBlur in="SourceGraphic" stdDeviation=".35" result="soft"/>
      <feImage href={map.displacement} x="0" y="0" width={map.width} height={map.height} preserveAspectRatio="none" result="field"/>
      <feDisplacementMap in="soft" in2="field" scale={map.scale} xChannelSelector="R" yChannelSelector="G"/>
    </filter></defs></svg>}
    <span ref={layer} className={`vc-liquid-optics vc-top-optics${map ? " vc-top-refractive" : ""}`} aria-hidden="true" style={style}/>
  </>;
}
