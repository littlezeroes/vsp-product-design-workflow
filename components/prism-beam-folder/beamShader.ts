/*
 Prism Beam Folder — the beam, as SkSL: a step-for-step port of PrismBeamFolderBeam.metal. An
 inverted cone of light standing on the folder's mouth, split in three soft bands by bright seams,
 colours drifting through a six-stop prism palette, a glow round its edges and a halo at its foot.
 Skia treats RuntimeEffect output as Display P3 on iOS: the colour goes out through toP3.

 beam  = (cx, origin y, full length, current length)
 shape = (half width at the foot, half width at full length, alpha, phase · 2π)
 fade  = (top fade from y, to y, unused, unused)
*/
export const BEAM_SKSL = `
uniform float4 beam;
uniform float4 shape;
uniform float4 fade;

float sstep(float e0, float e1, float x) {
  float t = clamp((x - e0) / (e1 - e0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}

float3 stopColor(float i) {
  if (i < 0.5) return float3(1.0, 0.373, 0.824);
  if (i < 1.5) return float3(1.0, 0.239, 0.369);
  if (i < 2.5) return float3(1.0, 0.843, 0.369);
  if (i < 3.5) return float3(1.0, 0.953, 0.902);
  if (i < 4.5) return float3(0.435, 0.549, 1.0);
  return float3(0.714, 0.361, 1.0);
}

float3 prism(float k) {
  float s = fract(k) * 6.0;
  float i = floor(s);
  float f = sstep(0.0, 1.0, s - i);
  float j = i + 1.0;
  if (j > 5.5) j = 0.0;
  return mix(stopColor(i), stopColor(j), f);
}

float3 toP3(float3 c) {
  float3 l = pow(clamp(c, 0.0, 1.0), float3(2.2));
  float3 m = float3(
    dot(l, float3(0.8225, 0.1774, 0.0)),
    dot(l, float3(0.0332, 0.9669, 0.0)),
    dot(l, float3(0.0171, 0.0724, 0.9108)));
  return pow(m, float3(1.0 / 2.2));
}

half4 main(float2 pos) {
  float alpha = shape.z;
  if (alpha <= 0.001) return half4(0.0);
  float cx = beam.x;
  float oy = beam.y;
  float L = beam.z;
  float len = beam.w;
  float hb = shape.x;
  float ht = shape.y;
  float ph = shape.w;

  float d = oy - pos.y;
  float hw = max(0.75, hb + (ht - hb) * max(d, 0.0) / L);
  float u = (pos.x - cx) / hw;
  float au = abs(u);
  float v = max(d, 0.0) / L;

  float soft = min(40.0, len * 0.5 + 1.0);
  float along = sstep(-4.0, 6.0, d) * (1.0 - sstep(len - soft, len, d));
  float inside = 1.0 - sstep(1.0 - 1.5 / hw, 1.0 + 1.0 / hw, au);
  float beamA = inside * along;

  float band = floor(clamp((u + 1.0) * 1.5, 0.0, 2.999));
  float k = 1.35 * v + 0.83 * band + 0.12 * sin(3.1 * u + ph) + ph / 6.2831853;
  float3 base = prism(k);

  float3 col = mix(base, float3(1.0), 0.45 * exp(-max(d, 0.0) / 70.0));
  float seam = (au - 1.0 / 3.0) * hw / 1.3;
  float edge = (1.0 - au) * hw / 1.8;
  col += float3(0.55 * exp(-seam * seam) + 0.35 * exp(-edge * edge));
  col *= 1.0 + 0.1 * sin(0.05 * d + 6.0 * ph);
  col = clamp(col, 0.0, 1.0);

  float outside = max(0.0, (au - 1.0) * hw);
  float glowAlong = sstep(-20.0, 10.0, d) * (1.0 - sstep(len - soft * 2.0, len + 10.0, d));
  float glow = 0.5 * exp(-outside / 22.0) * glowAlong;
  float2 r = pos - float2(cx, oy);
  float halo = 0.6 * exp(-length(r) / 60.0) * sstep(0.0, 0.3, len / L);
  float3 gcol = mix(base, float3(1.0, 0.9, 0.95), 0.3);

  float top = 0.4 + 0.6 * sstep(fade.x, fade.y, pos.y);
  float a = clamp(beamA + (glow + halo) * (1.0 - beamA), 0.0, 1.0) * alpha * top;
  float3 rgb = (col * beamA + gcol * (glow + halo) * (1.0 - beamA)) * alpha * top;
  rgb = min(rgb, float3(a));
  if (a > 0.0001) rgb = toP3(rgb / a) * a;
  return half4(half3(rgb), half(a));
}
`;

/** The original runtime shader compiled as GLSL for the host web renderer. */
const FRAGMENT = `precision highp float;
uniform vec2 resolution;
uniform float pixelRatio;
uniform float outputP3;
${BEAM_SKSL
  .replace(/float([234])/g, 'vec$1')
  .replace(/half([34])/g, 'vec$1')
  .replace(/\bhalf\b/g, 'float')
  .replace('vec4 main(vec2 pos)', 'vec4 beamMain(vec2 pos)')
  .replace('return pow(m, vec3(1.0 / 2.2));', 'return outputP3 > 0.5 ? pow(m, vec3(1.0 / 2.2)) : c;')}
void main() {
  vec2 pos = vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y) / pixelRatio;
  gl_FragColor = beamMain(pos);
}`;
const VERTEX = `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

export function createBeamRenderer(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, preserveDrawingBuffer: true });
  if (!gl) throw new Error('WebGL is unavailable. Prism Beam Folder needs WebGL to render its beam.');
  const shaders: WebGLShader[] = [];
  let p3 = false;
  if ('drawingBufferColorSpace' in gl) {
    try {
      const colorGL = gl as WebGLRenderingContext & { drawingBufferColorSpace: string };
      colorGL.drawingBufferColorSpace = 'display-p3';
      p3 = colorGL.drawingBufferColorSpace === 'display-p3';
    } catch { /* The original sRGB palette is emitted directly on sRGB canvases. */ }
  }
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) throw new Error('Unable to allocate prism shader.');
    shaders.push(shader); gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader); shaders.forEach(s => gl.deleteShader(s));
      throw new Error(`Prism shader: ${message}`);
    }
    return shader;
  };
  const program = gl.createProgram();
  if (!program) throw new Error('Unable to allocate prism shader program.');
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program); shaders.forEach(s => gl.deleteShader(s)); gl.deleteProgram(program);
    throw new Error(`Prism shader link: ${message}`);
  }
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
  gl.useProgram(program);
  const position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const locations = Object.fromEntries(['beam', 'shape', 'fade', 'resolution', 'pixelRatio', 'outputP3'].map(name => [name, gl.getUniformLocation(program, name)]));
  gl.uniform1f(locations.outputP3, p3 ? 1 : 0);
  return {
    draw(w: number, h: number, dpr: number, originY: number, length: number, tip: number, hb: number, ht: number, alpha: number, phase: number, top: number) {
      const pw = Math.round(w * dpr), ph = Math.round(h * dpr);
      if (canvas.width !== pw || canvas.height !== ph) { canvas.width = pw; canvas.height = ph; }
      gl.viewport(0, 0, pw, ph); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(locations.resolution, pw, ph); gl.uniform1f(locations.pixelRatio, dpr);
      gl.uniform4f(locations.beam, w / 2, originY, length, tip);
      gl.uniform4f(locations.shape, hb, ht, alpha, 2 * Math.PI * phase / 8);
      gl.uniform4f(locations.fade, top + 60, top + 260, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
    dispose() { gl.deleteBuffer(buffer); shaders.forEach(s => gl.deleteShader(s)); gl.deleteProgram(program); },
  };
}
