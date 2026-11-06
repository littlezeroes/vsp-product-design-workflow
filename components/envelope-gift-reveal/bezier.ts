/** Solve x before evaluating y, matching Reanimated's cubic-bezier easing. */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  return (x: number) => {
    if (x <= 0 || x >= 1) return Math.min(1, Math.max(0, x));
    const at = (t: number, a: number, b: number) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t * t * b + t ** 3;
    let lo = 0, hi = 1;
    for (let i = 0; i < 18; i++) {
      const mid = (lo + hi) / 2;
      if (at(mid, x1, x2) < x) lo = mid; else hi = mid;
    }
    return at((lo + hi) / 2, y1, y2);
  };
}
