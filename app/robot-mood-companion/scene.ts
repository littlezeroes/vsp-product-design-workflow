// Adapted directly from Native Cook RobotMoodCompanion.tsx; original saved in output/robot-mood-companion.
import {BlurStyle,PaintStyle,Skia,StrokeCap,SkCanvas,SkImage} from "./canvas-skia";
/** Seconds. */
export const LOOP = 8.4;
const STOP = 1.4;
const FIRST = 1.2;
const CLOSE = 0.12;
const OPEN = 0.14;
const HEAD = 300;
const HOLD = 2;

type Mood = { name: string; line: string; bg: string; ink: string };
const MOODS: Mood[] = [
  { name: 'Happy', line: 'Pip had a good day. So did you?', bg: '#F8E6A0', ink: '#3A2E0A' },
  { name: 'Surprised', line: 'Three new messages, all at once.', bg: '#F0957F', ink: '#3E150B' },
  { name: 'Sleepy', line: 'Past eleven. Pip is winding down.', bg: '#B49E9E', ink: '#2E2222' },
  { name: 'Proud', line: 'You finished every task today.', bg: '#55CF9C', ink: '#0D3B27' },
  { name: 'Sad', line: 'You skipped your walk again.', bg: '#1F4652', ink: '#E6F6FA' },
  { name: 'Grumpy', line: 'Four hours of meetings? Really?', bg: '#E8206E', ink: '#FFF0F5' },
];
const CYAN = '#3FE0F0';


function clamp01(x: number) {
  'worklet';
  return Math.min(1, Math.max(0, x));
}
function smooth(x: number) {
  'worklet';
  const u = clamp01(x);
  return u * u * (3 - 2 * u);
}
function mixColor(a: string, b: string, u: number) {
  'worklet';
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const r = Math.round(((pa >> 16) & 255) * (1 - u) + ((pb >> 16) & 255) * u);
  const g = Math.round(((pa >> 8) & 255) * (1 - u) + ((pb >> 8) & 255) * u);
  const bl = Math.round((pa & 255) * (1 - u) + (pb & 255) * u);
  return `rgb(${r}, ${g}, ${bl})`;
}

/** Mood shown, the previous one, cross-fade weight, eye openness and seconds into the mood. */
function moodAt(t: number) {
  'worklet';
  const k = Math.floor((t - FIRST) / STOP) + 1;
  const b = FIRST + (k - 1) * STOP;
  const since = t - b;
  // Before the first switch the loop is still in mood 0, which began at 8.2 - 8.4 = -0.2 s.
  const s = k === 0 ? t + (LOOP - (FIRST + 5 * STOP)) : since;
  const toNext = FIRST + k * STOP - t;
  let open = 1;
  if (s < OPEN) open = smooth(s / OPEN);
  if (toNext < CLOSE) open = smooth(toNext / CLOSE);
  const cur = ((k % 6) + 6) % 6;
  const prev = (cur + 5) % 6;
  const fade = smooth((s + CLOSE) / (CLOSE + OPEN));
  return { cur, prev, fade, open, s };
}

/** Head pose for mood m, s seconds into it. */
function poseOf(m: number, s: number) {
  'worklet';
  if (m === 0) return { y: -6 * Math.abs(Math.sin(s * Math.PI * 2.2)), rot: 0, x: 0 };
  if (m === 1) return { y: -16 * Math.sin(Math.PI * clamp01(s / 0.45)), rot: 0, x: 0 };
  if (m === 2) return { y: 6, rot: 7 * Math.sin(s * 1.6 + 0.4), x: 0 };
  if (m === 3) return { y: -10 - 4 * Math.sin(s * Math.PI * 1.4), rot: -3, x: 0 };
  if (m === 4) return { y: 10, rot: -5, x: 0 };
  return { y: 0, rot: 0, x: 3.5 * Math.sin(s * 42) * Math.exp(-2 * s) };
}

function cyan(alpha: number, glow: boolean) {
  'worklet';
  const p = Skia.Paint();
  p.setAntiAlias(true);
  p.setColor(Skia.Color(CYAN));
  p.setAlphaf(alpha * (glow ? 0.65 : 1));
  if (glow) p.setMaskFilter(Skia.MaskFilter.MakeBlur(BlurStyle.Normal, 6, true));
  return p;
}

/** One eye of mood m on side `side` (-1 left, 1 right), centred at (ex, ey). */
function drawEye(c: SkCanvas, m: number, side: number, ex: number, ey: number, open: number, glow: boolean) {
  'worklet';
  const rx = 16.5;
  const ry = Math.max(1.5, 15 * open);
  const fill = cyan(1, glow);
  if (m === 2 || m === 3) {
    // Closed arcs: sleepy hangs down, proud curves up.
    const p = cyan(1, glow);
    p.setStyle(PaintStyle.Stroke);
    p.setStrokeWidth(4);
    p.setStrokeCap(StrokeCap.Round);
    const path = Skia.Path.Make();
    const oval = Skia.XYWHRect(ex - rx, ey - 9, rx * 2, 18);
    if (m === 2) path.addArc(oval, 20, 140);
    else path.addArc(oval, 200, 140);
    c.drawPath(path, p);
    return;
  }
  let erx = rx;
  let ery = ry;
  if (m === 1) {
    erx = 14;
    ery = Math.max(1.5, 20 * open);
  }
  c.save();
  const clip = Skia.Path.Make();
  if (m === 0) {
    // Happy: flat bottom.
    clip.addRect(Skia.XYWHRect(ex - 30, ey - 40, 60, 43));
  } else if (m === 4 || m === 5) {
    // A lid line: grumpy drops at the inner corner, sad at the outer one.
    const inner = m === 5 ? ey - 2 : ey - ery - 4;
    const outer = m === 5 ? ey - ery - 6 : ey - 3;
    const yl = side < 0 ? outer : inner;
    const yr = side < 0 ? inner : outer;
    clip.moveTo(ex - 30, yl - (yr - yl) * (14 / 60));
    clip.lineTo(ex + 30, yr + (yr - yl) * (14 / 60));
    clip.lineTo(ex + 30, ey + 40);
    clip.lineTo(ex - 30, ey + 40);
    clip.close();
  } else {
    clip.addRect(Skia.XYWHRect(ex - 30, ey - 40, 60, 80));
  }
  c.clipPath(clip, 1, true);
  c.drawOval(Skia.XYWHRect(ex - erx, ey - ery, erx * 2, ery * 2), fill);
  c.restore();
}

function drawFace(c: SkCanvas, m: number, open: number, s: number, vx: number, vy: number, glow: boolean) {
  'worklet';
  drawEye(c, m, -1, vx - 42, vy - 6, open, glow);
  drawEye(c, m, 1, vx + 42, vy - 6, open, glow);
  const stroke = cyan(1, glow);
  stroke.setStyle(PaintStyle.Stroke);
  stroke.setStrokeWidth(3.5);
  stroke.setStrokeCap(StrokeCap.Round);
  if (m === 1) {
    c.drawOval(Skia.XYWHRect(vx - 5, vy + 24, 10, 13), cyan(1, glow));
  } else if (m === 3) {
    const path = Skia.Path.Make();
    path.addArc(Skia.XYWHRect(vx - 9, vy + 16, 18, 12), 20, 140);
    c.drawPath(path, stroke);
  } else if (m === 4) {
    // Tears run from under each eye and loop every 0.9 s.
    for (let side = -1; side <= 1; side += 2) {
      const run = (s % 0.9) / 0.9;
      const len = 10 + 34 * run;
      const path = Skia.Path.Make();
      const x0 = vx + side * 46;
      path.moveTo(x0, vy + 6);
      for (let i = 1; i <= 8; i++) {
        const y = vy + 6 + (len * i) / 8;
        path.lineTo(x0 + Math.sin(i * 1.4 + s * 6) * 2.5, y);
      }
      const tear = cyan(1 - run * 0.3, glow);
      tear.setStyle(PaintStyle.Stroke);
      tear.setStrokeWidth(7);
      tear.setStrokeCap(StrokeCap.Round);
      c.drawPath(path, tear);
    }
  } else if (m === 5) {
    const path = Skia.Path.Make();
    path.moveTo(vx - 10, vy + 30);
    path.quadTo(vx, vy + 24, vx + 10, vy + 30);
    c.drawPath(path, stroke);
  }
}

function drawScene(c: SkCanvas, t: number, cx: number, cy: number, head: SkImage | null) {
  'worklet';
  const mo = moodAt(t);
  const a = poseOf(mo.prev, mo.s + STOP);
  const b = poseOf(mo.cur, mo.s);
  const w = mo.fade;
  const x = a.x * (1 - w) + b.x * w;
  const y = a.y * (1 - w) + b.y * w;
  const rot = a.rot * (1 - w) + b.rot * w;
  // Floor shadow.
  const sh = Skia.Paint();
  sh.setAntiAlias(true);
  sh.setColor(Skia.Color('rgba(0,0,0,0.16)'));
  sh.setMaskFilter(Skia.MaskFilter.MakeBlur(BlurStyle.Normal, 10, true));
  const lift = clamp01(-y / 20);
  c.drawOval(Skia.XYWHRect(cx - 100 * (1 - lift * 0.2), cy + 128, 200 * (1 - lift * 0.2), 22), sh);

  c.save();
  c.translate(cx + x, cy + y);
  c.rotate(rot, 0, 0);
  // Halo for proud.
  const halo = mo.cur === 3 ? smooth(mo.s / 0.3) : mo.prev === 3 ? 1 - w : 0;
  if (halo > 0) {
    const hp = Skia.Paint();
    hp.setAntiAlias(true);
    hp.setStyle(PaintStyle.Stroke);
    hp.setStrokeWidth(9);
    hp.setColor(Skia.Color('#FFF1C2'));
    hp.setAlphaf(halo);
    const hw = 150 * (0.4 + 0.6 * halo);
    c.drawOval(Skia.XYWHRect(-hw / 2, -128 - 12 * halo, hw, 26), hp);
  }
  if (head) c.drawImageRect(head, Skia.XYWHRect(0, 0, head.width(), head.height()), Skia.XYWHRect(-HEAD / 2, -HEAD / 2, HEAD, HEAD), Skia.Paint());
  const vx = 0.002 * HEAD;
  const vy = 0.002 * HEAD;
  c.save();
  c.clipRRect(Skia.RRectXY(Skia.XYWHRect(vx - 0.32 * HEAD, vy - 0.205 * HEAD, 0.64 * HEAD, 0.41 * HEAD), 50, 50), 1, true);
  drawFace(c, mo.cur, mo.open, mo.s, vx, vy, true);
  drawFace(c, mo.cur, mo.open, mo.s, vx, vy, false);
  c.restore();
  c.restore();

  // Sleepy z's drift up from the head.
  if (mo.cur === 2) {
    for (let i = 0; i < 3; i++) {
      const u = ((mo.s + i * 0.45) % 1.35) / 1.35;
      const zp = Skia.Paint();
      zp.setAntiAlias(true);
      zp.setStyle(PaintStyle.Stroke);
      zp.setStrokeWidth(3);
      zp.setStrokeCap(StrokeCap.Round);
      zp.setColor(Skia.Color('#FFFFFF'));
      zp.setAlphaf(Math.sin(Math.PI * u) * mo.open);
      const s = 8 + 8 * u;
      const zx = cx + 110 + 20 * u;
      const zy = cy - 110 - 70 * u;
      const z = Skia.Path.Make();
      z.moveTo(zx - s / 2, zy - s / 2);
      z.lineTo(zx + s / 2, zy - s / 2);
      z.lineTo(zx - s / 2, zy + s / 2);
      z.lineTo(zx + s / 2, zy + s / 2);
      c.drawPath(z, zp);
    }
  }
}


export { MOODS, FIRST, STOP, CLOSE, HOLD, moodAt, mixColor, drawScene };
