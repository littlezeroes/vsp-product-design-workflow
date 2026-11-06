/** Native Cook artwork, original paths. Skia drawing helpers adapted to Canvas2D. */
type Color = string;
type Shader = (c: CanvasRenderingContext2D) => CanvasGradient;
export function hex(v: number, a = 1): Color {
  return `rgba(${(v >> 16) & 255},${(v >> 8) & 255},${v & 255},${a})`;
}
function stops(g: CanvasGradient, colors: Color[], pos: number[] | null) {
  colors.forEach((color, i) => g.addColorStop(pos?.[i] ?? i / (colors.length - 1), color));
  return g;
}
function linear(x0: number, y0: number, x1: number, y1: number, colors: Color[], pos: number[] | null = null): Shader {
  return c => stops(c.createLinearGradient(x0, y0, x1, y1), colors, pos);
}
export function radial(cx: number, cy: number, r: number, colors: Color[], pos: number[] | null = null): Shader {
  return c => stops(c.createRadialGradient(cx, cy, 0, cx, cy, r), colors, pos);
}
export function fillShader(c: CanvasRenderingContext2D, p: Path2D, shader: Shader, alpha = 1) {
  c.save(); c.globalAlpha *= alpha; c.fillStyle = shader(c); c.fill(p); c.restore();
}
export function fillColor(c: CanvasRenderingContext2D, p: Path2D, color: Color) { c.fillStyle = color; c.fill(p); }
export function strokeColor(c: CanvasRenderingContext2D, p: Path2D, color: Color, width: number, round = true) {
  c.strokeStyle = color; c.lineWidth = width; c.lineCap = round ? 'round' : 'butt'; c.stroke(p);
}
export function ellipse(x: number, y: number, w: number, h: number): Path2D {
  const p = new Path2D(); p.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2); return p;
}
function line(x0: number, y0: number, x1: number, y1: number): Path2D {
  const p = new Path2D(); p.moveTo(x0, y0); p.lineTo(x1, y1); return p;
}
// Folder (104 × 84, centred on (0, 0); the tab rises to y = -50)

function backPath(): Path2D {
  const p = new Path2D();
  p.moveTo(-52, -44);
  p.quadraticCurveTo(-52, -50, -46, -50);
  p.lineTo(-22, -50);
  p.quadraticCurveTo(-19.5, -50, -17, -47.5);
  p.lineTo(-13, -43.5);
  p.quadraticCurveTo(-11.2, -42, -9, -42);
  p.lineTo(42, -42);
  p.quadraticCurveTo(52, -42, 52, -32);
  p.lineTo(52, 32);
  p.quadraticCurveTo(52, 42, 42, 42);
  p.lineTo(-42, 42);
  p.quadraticCurveTo(-52, 42, -52, 32);
  p.closePath();
  return p;
}

function frontPath(o: number): Path2D {
  const top = -30 + 8 * o;
  const half = 52 + 3 * o;
  const p = new Path2D();
  p.moveTo(-half, top + 7);
  p.quadraticCurveTo(-half, top, -half + 7, top);
  p.lineTo(half - 7, top);
  p.quadraticCurveTo(half, top, half, top + 7);
  p.lineTo(52, 32);
  p.quadraticCurveTo(52, 42, 42, 42);
  p.lineTo(-42, 42);
  p.quadraticCurveTo(-52, 42, -52, 32);
  p.closePath();
  return p;
}

export function drawBack(c: CanvasRenderingContext2D) {
  fillShader(c, backPath(), linear(0, -50, 0, 42, [hex(0x3a9ad3), hex(0x2c7fb8)]));
  const inside = new Path2D();
  inside.rect(-48, -40, 96, 12);
  fillShader(c, inside, linear(0, -40, 0, -28, [hex(0x0b2a44, 0), hex(0x0b2a44, 0.45)]));
}

export function drawFront(c: CanvasRenderingContext2D, o: number, light: number) {
  const path = frontPath(o);
  const top = -30 + 8 * o;
  fillShader(c, path, linear(0, top, 0, 42, [hex(0x8edcf9), hex(0x56bdec)]));
  if (light > 0.001) {
    fillShader(c, path, linear(0, top, 0, top + 40, [hex(0xffe9f6, 0.55 * light), hex(0xffe9f6, 0)]));
  }
  strokeColor(c, line(-52 - 3 * o + 7, top + 0.75, 52 + 3 * o - 7, top + 0.75), hex(0xffffff, 0.55), 1.5);
  strokeColor(c, line(-42, 41.25, 42, 41.25), hex(0x2c7fb8, 0.7), 1.5, false);
}

// Items

function leaf(c: CanvasRenderingContext2D, p: Path2D, x0: number, y0: number, x1: number, y1: number) {
  fillShader(c, p, linear(x0, y0, x1, y1, [hex(0x7bd36b), hex(0x2e8b57)]));
}

function peach(c: CanvasRenderingContext2D) {
  fillShader(
    c,
    ellipse(-19, -15, 38, 36),
    radial(-6, -6, 28, [hex(0xffd08a), hex(0xff8a5b), hex(0xe2474f)], [0, 0.55, 1]),
  );
  const crease = new Path2D();
  crease.moveTo(1, -13);
  crease.quadraticCurveTo(-8, -4, -3, 6);
  strokeColor(c, crease, hex(0xc93a44, 0.5), 1.6);
  fillColor(c, ellipse(-13, -9, 8, 6), hex(0xffffff, 0.35));
  strokeColor(c, line(1, -13, -1, -19), hex(0x6b4b2a), 2);
  const l = new Path2D();
  l.moveTo(2, -14);
  l.quadraticCurveTo(6, -24, 16, -22);
  l.quadraticCurveTo(14, -13, 2, -14);
  l.closePath();
  leaf(c, l, 6, -22, 12, -14);
}

function cherries(c: CanvasRenderingContext2D) {
  const stems = new Path2D();
  stems.moveTo(-8, 2);
  stems.quadraticCurveTo(-6, -12, 6, -20);
  stems.moveTo(9, 4);
  stems.quadraticCurveTo(12, -8, 6, -20);
  strokeColor(c, stems, hex(0x4e7d2b), 2);
  const l = new Path2D();
  l.moveTo(6, -20);
  l.quadraticCurveTo(14, -25, 18, -18);
  l.quadraticCurveTo(12, -14, 6, -20);
  l.closePath();
  leaf(c, l, 8, -24, 16, -16);
  const balls = [
    [-9, 10],
    [9, 12],
  ];
  for (let i = 0; i < balls.length; i++) {
    const x = balls[i][0];
    const y = balls[i][1];
    fillShader(
      c,
      ellipse(x - 10, y - 10, 20, 20),
      radial(x - 3, y - 3, 14, [hex(0xff6a7a), hex(0xd0142f), hex(0x7a0019)], [0, 0.6, 1]),
    );
    fillColor(c, ellipse(x - 6, y - 6.5, 4.5, 3.2), hex(0xffffff, 0.7));
  }
}

function aubergine(c: CanvasRenderingContext2D) {
  const body = new Path2D();
  body.moveTo(-2, -14);
  body.bezierCurveTo(5, -15, 9, -4, 10, 8);
  body.bezierCurveTo(11, 18, 8, 25, 2, 25);
  body.bezierCurveTo(-5, 25, -8, 14, -9, 4);
  body.bezierCurveTo(-10, -6, -8, -13, -2, -14);
  body.closePath();
  fillShader(c, body, radial(-3, 2, 24, [hex(0xa779e0), hex(0x5b2a86), hex(0x2e1247)], [0, 0.55, 1]));
  const hi = new Path2D();
  hi.moveTo(-5, -4);
  hi.quadraticCurveTo(-7, 8, -2, 16);
  strokeColor(c, hi, hex(0xffffff, 0.4), 2.5);
  const stem = new Path2D();
  stem.roundRect(-1.5, -22, 3, 8, 1.5);
  fillColor(c, stem, hex(0x4e8a3a));
  const cap = new Path2D();
  cap.moveTo(-9, -11);
  cap.quadraticCurveTo(-4, -6, 0, -8);
  cap.quadraticCurveTo(4, -6, 9, -11);
  cap.quadraticCurveTo(6, -17, 0, -17);
  cap.quadraticCurveTo(-6, -17, -9, -11);
  cap.closePath();
  fillShader(c, cap, linear(0, -17, 0, -8, [hex(0x6cc46a), hex(0x2f7d3a)]));
}

function chili(c: CanvasRenderingContext2D) {
  const pod = new Path2D();
  pod.moveTo(-8, -14);
  pod.bezierCurveTo(10, -14, 16, 8, 12, 22);
  pod.bezierCurveTo(6, 12, -2, -4, -12, -8);
  pod.quadraticCurveTo(-12, -14, -8, -14);
  pod.closePath();
  fillShader(c, pod, linear(-8, -14, 12, 22, [hex(0xff6a45), hex(0xe0201e), hex(0xa50f18)], [0, 0.5, 1]));
  const hi = new Path2D();
  hi.moveTo(-2, -10);
  hi.quadraticCurveTo(8, -6, 9, 8);
  strokeColor(c, hi, hex(0xffffff, 0.45), 2.2);
  fillColor(c, ellipse(-15, -18, 11, 7), hex(0x4e9a3a));
  const stem = new Path2D();
  stem.moveTo(-9, -16);
  stem.quadraticCurveTo(-8, -23, -3, -24);
  strokeColor(c, stem, hex(0x3e7d2b), 2.5);
}

export function drawItem(c: CanvasRenderingContext2D, kind: number) {
  if (kind === 0) peach(c);
  else if (kind === 1) cherries(c);
  else if (kind === 2) aubergine(c);
  else chili(c);
}
