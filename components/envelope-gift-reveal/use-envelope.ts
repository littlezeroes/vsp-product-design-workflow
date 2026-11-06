"use client";

import { useEffect, useRef } from "react";
import { AMBIENT, LOOP_MS, OPEN, REDUCED_MS, RESET, RESUME_AFTER_MS, REVEAL, SCRIPT, SPRINGS } from "./motion";

export const PHASE = { sealed: 0, dragging: 1, revealing: 2, revealed: 3, resetting: 4 } as const;
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const easeOut = (t: number) => 1 - (1 - clamp01(t)) ** 3;
export const easeInOut = (t: number) => (t = clamp01(t)) < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
export function finishMs(p0: number, reduced: boolean) { return reduced ? REDUCED_MS : 260 + REVEAL.finishMs * (1 - p0); }
export type Haptic = "flap" | "crack" | "commit" | "success" | "light";

export type EnvelopeValues = {
  clock: number; p: number; tilt: number; phase: number;
  commit: { at: number; p0: number; tilt0: number };
  resetAt: number; breath: number; phaseAt: number;
};

/** Same single-clock poses as EnvelopeScene.tsx in Native Cook. */
export function frameOf(v: EnvelopeValues, reduced: boolean) {
  const now = v.clock, c = v.commit;
  let p = v.p, fly = 0, after = -1;
  if (c.at >= 0) {
    const fin = finishMs(c.p0, reduced);
    p = c.p0 + (1 - c.p0) * easeOut((now - c.at) / fin);
    after = now - c.at - fin;
    fly = reduced ? (after >= 0 ? 1 : 0) : REVEAL.flyEase(clamp01(after / REVEAL.flyMs));
  }
  const reset = v.resetAt < 0 ? 0 : clamp01((now - v.resetAt) / (reduced ? REDUCED_MS : RESET.fadeMs));
  const flipT = after < 0 ? 0 : reduced ? 1 : clamp01((after - REVEAL.flyMs - REVEAL.flipDelay) / REVEAL.flipMs);
  const breath = c.at < 0 && !reduced && v.breath < 700 ? Math.sin(Math.PI * v.breath / 700) * OPEN.breathDeg : 0;
  const float = reduced ? 0 : AMBIENT.floatPt * Math.sin(2 * Math.PI * now / AMBIENT.floatMs) * (1 - clamp01(p / 0.05));
  return {
    now, p, fly, after, reset, resetOut: clamp01(reset / RESET.outShare),
    resetIn: clamp01((reset - RESET.inFrom) / (1 - RESET.inFrom)),
    drop: after < 0 || reduced ? (after >= 0 ? 1 : 0) : clamp01((after - 60) / REVEAL.envelopeDropMs),
    flipT, breath, float, tilt0: c.at >= 0 ? c.tilt0 : v.tilt,
  };
}
export type EnvelopeFrame = ReturnType<typeof frameOf>;

// Browser vibration is best-effort; iOS Safari has no equivalent to Expo haptics.
function haptic(kind: Haptic, scripted: boolean) {
  if (!scripted && typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(kind === "success" ? [12, 45, 18] : kind === "commit" ? 20 : kind === "crack" ? 14 : 8);
  }
}

export function useEnvelope(autoPlay: boolean, reduced: boolean, render: (v: EnvelopeValues) => void) {
  const renderRef = useRef(render);
  useEffect(() => { renderRef.current = render; }, [render]);
  const v = useRef<EnvelopeValues>({ clock: 0, p: 0, tilt: 0, phase: PHASE.sealed, commit: { at: -1, p0: 0, tilt0: 0 }, resetAt: -1, breath: 1000, phaseAt: 0 });
  const inputRef = useRef<{
    down: (x: number, y: number) => void; move: (x: number, y: number) => void;
    up: (velocity: number, cancel?: boolean) => void; open: () => void; reset: () => void;
  }>({ down: () => {}, move: () => {}, up: () => {}, open: () => {}, reset: () => {} });

  useEffect(() => {
    const s = v.current;
    let active = false, scripted = false, cracked = false, flapped = false;
    let x0 = 0, y0 = 0, p0 = 0, spring = false, velocity = 0, tiltVelocity = 0;
    let scriptOn = autoPlay && !reduced, scriptTime = 0, quiet = 0, touching = false, fired = false;
    const phase = (p: number) => { if (s.phase !== p) { s.phase = p; s.phaseAt = s.clock; } };
    const close = () => { spring = true; active = false; phase(PHASE.sealed); };
    const commit = () => {
      spring = false; active = false; fired = false;
      s.commit = { at: s.clock, p0: s.p, tilt0: s.tilt };
      phase(PHASE.revealing); haptic("commit", scripted);
    };
    const reset = () => {
      if (s.phase !== PHASE.revealed && s.phase !== PHASE.revealing) return;
      s.resetAt = s.clock; phase(PHASE.resetting);
    };
    const down = (x: number, y: number, isScripted: boolean) => {
      if (s.phase === PHASE.revealing && !isScripted && s.clock - s.commit.at < finishMs(s.commit.p0, reduced)) {
        s.p = frameOf(s, reduced).p; s.commit.at = -1; close(); haptic("light", false); return;
      }
      if (s.phase !== PHASE.sealed) return;
      active = true; spring = false; velocity = 0; tiltVelocity = 0;
      scripted = isScripted; cracked = false; flapped = false;
      x0 = x; y0 = y; p0 = s.p; phase(PHASE.dragging);
    };
    const move = (x: number, y: number) => {
      if (!active || s.phase !== PHASE.dragging) return;
      let next = Math.max(0, p0 + (y0 - y) / OPEN.travel);
      if (next > 1) next = 1 + (next - 1) * 0.2;
      s.p = next;
      const out = Math.max(0, (next - OPEN.flapShare) / (1 - OPEN.flapShare));
      s.tilt = reduced ? 0 : Math.max(-OPEN.tiltMax, Math.min(OPEN.tiltMax, (x - x0) * 0.08)) * Math.min(1, out * 2);
      if (!cracked && next >= OPEN.flapShare * 0.22) { cracked = true; haptic("crack", scripted); }
      if (!flapped && next >= OPEN.flapShare) { flapped = true; haptic("flap", scripted); }
    };
    const up = (vy: number, cancel = false) => {
      if (!active) return;
      active = false;
      if (!cancel && (s.p >= OPEN.commit || (vy < -900 && s.p > 0.15))) { commit(); return; }
      velocity = vy / OPEN.travel;
      close(); if (s.p > 0.08) haptic("light", scripted);
    };
    const takeOver = () => {
      if (scriptOn && active && scripted) close();
      scriptOn = false; quiet = 0; touching = true;
    };
    inputRef.current = {
      down: (x, y) => { takeOver(); down(x, y, false); }, move,
      up: (vy, cancel) => { up(vy, cancel); touching = false; quiet = 0; },
      open: () => { takeOver(); if (s.phase === PHASE.sealed) { scripted = false; commit(); } touching = false; },
      reset: () => { takeOver(); reset(); touching = false; },
    };
    let raf = 0, previous = performance.now();
    const tick = (time: number) => {
      const dt = Math.min(Math.max(time - previous, 0), 64); previous = time; s.clock += dt;
      if (spring) {
        // Integrate the reference stiffness 260 / damping 18 spring in small stable steps.
        const steps = Math.max(1, Math.ceil(dt / 8)), step = dt / steps / 1000;
        for (let i = 0; i < steps; i++) {
          velocity += (-SPRINGS.close.stiffness * s.p - SPRINGS.close.damping * velocity) * step;
          s.p += velocity * step;
          tiltVelocity += (-SPRINGS.close.stiffness * s.tilt - SPRINGS.close.damping * tiltVelocity) * step;
          s.tilt += tiltVelocity * step;
        }
        if (Math.abs(s.p) < 0.0001 && Math.abs(velocity) < 0.001) { s.p = 0; s.tilt = 0; spring = false; }
      }
      const c = s.commit;
      if (c.at >= 0 && s.phase !== PHASE.resetting) {
        const done = finishMs(c.p0, reduced) + (reduced ? 0 : REVEAL.flyMs);
        if (!fired && s.clock - c.at >= done) { fired = true; haptic("success", scripted); }
        if (s.phase === PHASE.revealing && s.clock - c.at >= done) phase(PHASE.revealed);
      }
      if (s.resetAt >= 0 && s.clock - s.resetAt >= (reduced ? REDUCED_MS : RESET.fadeMs)) {
        s.resetAt = -1; s.commit = { at: -1, p0: 0, tilt0: 0 }; s.p = 0; s.tilt = 0; phase(PHASE.sealed);
      }
      s.breath = ((scriptOn ? scriptTime : s.clock) + OPEN.breathLead) % OPEN.breathMs;
      if (autoPlay && !reduced) {
        if (!scriptOn) {
          quiet = !touching && !active ? quiet + dt : 0;
          if (quiet >= RESUME_AFTER_MS && s.phase === PHASE.revealed) { reset(); quiet = 0; }
          if (quiet >= RESUME_AFTER_MS && s.phase === PHASE.sealed && Math.abs(s.p) < 0.01) { scriptOn = true; scriptTime = 0; }
        } else {
          const prev = scriptTime, t = prev + dt;
          if (prev < SCRIPT.down && t >= SCRIPT.down) down(0, 0, true);
          if (t > SCRIPT.down && prev < SCRIPT.up) {
            const e = easeInOut((t - SCRIPT.down - 80) / (SCRIPT.up - SCRIPT.down - 150));
            move(34 * Math.sin(Math.PI * e), -SCRIPT.rise * e);
          }
          if (prev < SCRIPT.up && t >= SCRIPT.up) up(0);
          if (prev < SCRIPT.reset && t >= SCRIPT.reset) reset();
          scriptTime = t >= LOOP_MS ? t - LOOP_MS : t;
        }
      }
      renderRef.current(s);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoPlay, reduced]);
  return { values: v, input: inputRef };
}
