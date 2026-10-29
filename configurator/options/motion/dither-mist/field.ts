// Dither mist: domain-warped fbm fog that lies low and drifts at two incommensurate speeds
// (no period), quantised to two field inks through an 8x8 Bayer matrix. Ground cells stay
// transparent, so whatever surface the hero gives the host shows through.
// Ported from the 2026-10-28 Direction A field (raw WebGL1, one fullscreen triangle).
import type { MotionCtx, MotionHandle } from '../../../src/contract';
import { compile, fullscreen, FULLSCREEN_VS, KEEP_CLEAR_GLSL, keepClear, keepClearUniforms, mountField, smoothstep, type Frame, type GL, type RowPainter } from '../_motion-a/field';

const FS = `
precision highp float;
uniform vec2 uRes;
uniform float uCell, uT, uOct, uLow;
uniform vec3 uC1, uC2, uPtr;
${KEEP_CLEAR_GLSL}
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    if (float(i) >= uOct) break;
    v += a * noise(p);
    p = r * p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}
float bayer2(vec2 a){ a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer4(vec2 a){ return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a){ return bayer4(0.5 * a) * 0.25 + bayer2(a); }
void main(){
  vec2 cell = floor(gl_FragCoord.xy);
  vec2 px = (cell + 0.5) * uCell;                 // CSS px from the canvas bottom-left
  float H = uRes.y * uCell;
  vec2 p = px / 520.0 * 1.9 + vec2(uT * 0.019, uT * 0.0053);
  vec2 q = vec2(fbm(p + vec2(0.0, uT * 0.011)), fbm(p + vec2(5.2, 1.3) - vec2(uT * 0.0087, 0.0)));
  float f = fbm(p + 1.7 * q);
  // Fog lies low. In a panel it keeps the original 560px ground band; under text (full and
  // page hosts) it pools in the lower part of the host and thins out above it.
  float ground = 1.0 - smoothstep(0.0, mix(560.0, 0.55 * H, uLow), px.y);
  float d = smoothstep(0.36, 0.80, f + ground * 0.30) * 0.94;
  d *= 1.0 - uLow * smoothstep(0.30 * H, 0.80 * H, px.y);
  d *= keepClear(px, 72.0);
  d = mix(d, smoothstep(0.10, 1.0, d), uLow);     // no lone cells of dust in the clear sky over text
  if (uPtr.z > 0.001) d -= uPtr.z * 0.38 * (1.0 - smoothstep(0.0, 120.0, length(px - uPtr.xy)));
  float lvl = min(floor(clamp(d, 0.0, 1.0) * 2.0 + bayer8(cell)), 2.0);
  gl_FragColor = lvl < 0.5 ? vec4(0.0) : vec4(lvl < 1.5 ? uC1 : uC2, 1.0);
}`;

export function scene(gl: GL) {
  const prog = compile(gl, FULLSCREEN_VS, FS);
  gl.useProgram(prog);
  const buf = fullscreen(gl, prog);
  const u = (n: string) => gl.getUniformLocation(prog, n);
  const res = u('uRes'), cell = u('uCell'), time = u('uT'), oct = u('uOct'), low = u('uLow'), c1 = u('uC1'), c2 = u('uC2'), ptr = u('uPtr');
  const clear = keepClearUniforms(gl, prog);
  return {
    draw(f: Frame) {
      gl.uniform2f(res, f.cols, f.rows);
      gl.uniform1f(cell, f.cell);
      gl.uniform1f(time, f.t);
      gl.uniform1f(oct, f.q);
      gl.uniform1f(low, f.kind === 'panel' ? 0 : 1);
      gl.uniform3fv(c1, f.pal.f1);
      gl.uniform3fv(c2, f.pal.f2);
      gl.uniform3f(ptr, f.ptr[0], f.ptr[1], f.ptr[2]);
      clear(f);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() { gl.deleteBuffer(buf); gl.deleteProgram(prog); },
  };
}

// CPU twin of FS for the still (reduced motion, Save-Data, no WebGL). Same constants, same order.
const fract = (x: number) => x - Math.floor(x);
function hash(x: number, y: number) {
  x = fract(x * 123.34); y = fract(y * 456.21);
  const d = x * (x + 45.32) + y * (y + 45.32);
  return fract((x + d) * (y + d));
}
function noise(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
  const lo = a + (b - a) * ux, hi = c + (d - c) * ux;
  return lo + (hi - lo) * uy;
}
function fbm(x: number, y: number, oct: number) {
  let v = 0, a = 0.5;
  for (let i = 0; i < oct; i++) {
    v += a * noise(x, y);
    const nx = (0.8 * x + 0.6 * y) * 2.03 + 1.7, ny = (-0.6 * x + 0.8 * y) * 2.03 + 9.2;
    x = nx; y = ny; a *= 0.5;
  }
  return v;
}
const bayer2 = (x: number, y: number) => fract(Math.floor(x) * 0.5 + Math.floor(y) * Math.floor(y) * 0.75);
const bayer4 = (x: number, y: number) => bayer2(x * 0.5, y * 0.5) * 0.25 + bayer2(x, y);
const bayer8 = (x: number, y: number) => bayer4(x * 0.5, y * 0.5) * 0.25 + bayer2(x, y);

export function still(f: Frame): RowPainter {
  const H = f.rows * f.cell, low = f.kind === 'panel' ? 0 : 1, T = f.t;
  const inks = [f.pal.f1, f.pal.f2].map((c) => c.map((v) => Math.round(v * 255)));
  return (out, y0, y1) => {
    for (let iy = y0; iy < y1; iy++) {
      const cy = f.rows - 1 - iy;
      for (let cx = 0; cx < f.cols; cx++) {
        const px = (cx + 0.5) * f.cell, py = (cy + 0.5) * f.cell;
        const x = (px / 520) * 1.9 + T * 0.019, y = (py / 520) * 1.9 + T * 0.0053;
        const qx = fbm(x, y + T * 0.011, f.q), qy = fbm(x + 5.2 - T * 0.0087, y + 1.3, f.q);
        const n = fbm(x + 1.7 * qx, y + 1.7 * qy, f.q);
        const ground = 1 - smoothstep(0, 560 + (0.55 * H - 560) * low, py);
        let d = smoothstep(0.36, 0.8, n + ground * 0.3) * 0.94;
        d *= 1 - low * smoothstep(0.3 * H, 0.8 * H, py);
        d *= keepClear(f, px, py, 72);
        d += (smoothstep(0.1, 1, d) - d) * low;
        const lvl = Math.min(Math.floor(Math.min(1, Math.max(0, d)) * 2 + bayer8(cx, cy)), 2);
        const o = (iy * f.cols + cx) * 4;
        if (lvl < 1) { out[o + 3] = 0; continue; }
        const ink = inks[lvl - 1];
        out[o] = ink[0]; out[o + 1] = ink[1]; out[o + 2] = ink[2]; out[o + 3] = 255;
      }
    }
  };
}

export function mount(host: HTMLElement, ctx: MotionCtx): MotionHandle {
  return mountField(host, ctx, {
    tiers: [{ cell: 4, fps: 24, q: 5 }, { cell: 4, fps: 15, q: 4 }, { cell: 4, fps: 10, q: 3 }],
    anchor: 'left',
    t0: 37,
    pointer: true,
    keepClear: true,
    scene,
    still,
  });
}
