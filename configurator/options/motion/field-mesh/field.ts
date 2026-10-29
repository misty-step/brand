// Field mesh: one slow ribbon of the palette's field colours sweeping through the hero, the way
// Stripe's wave does, but posterised into three flat tones and drawn on a 2 CSS px grid, so it
// reads as a screenprint in steps rather than a glowing gradient. The ribbon bows, breathes and
// twists on incommensurate periods (27 to 43 s), so it never visibly repeats.
// Raw WebGL1, one fullscreen triangle, upscaled crisp.
import type { MotionCtx } from '../../../src/contract';
import { KEEP_GLSL, KEEP_IN, blend, cover, ign, mountStage, program, setKeep, uniforms, type Frame, type RGB, type Scene } from '../_motionb/stage';

const CELLS = [2, 3, 4];   // CSS px per cell, per quality tier
const STILL = 19;          // seconds: the composed frame used under reduced motion
const TAU = Math.PI * 2;
const W1 = TAU / 27, W2 = TAU / 37, W3 = TAU / 43, W4 = TAU / 31;

const VS = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;
const FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uCell, uT;
uniform vec4 uAxis;        // A.xy, B.xy in CSS px
uniform vec2 uSize;        // half-width and bow, CSS px
uniform vec2 uEnds;        // 1 where an end stops inside the frame and dissolves, 0 where it runs off the edge
uniform vec3 uPtr, uF1, uF2, uF3;
${KEEP_GLSL}
void main() {
  vec2 cell = floor(gl_FragCoord.xy);
  vec2 at = vec2(cell.x + 0.5, uRes.y - cell.y - 0.5) * uCell;
  vec2 dp = at - uPtr.xy;
  vec2 css = uPtr.xy + dp * (1.0 - 0.14 * uPtr.z * exp(-dot(dp, dp) / 9800.0)); // a fine pointer lifts the cloth locally
  vec2 A = uAxis.xy, B = uAxis.zw, d = normalize(B - A), n = vec2(-d.y, d.x);
  float len = length(B - A);
  float s = dot(css - A, d) / len, u = dot(css - A, n);
  float c = -uSize.y * sin(3.14159 * s)
    + uSize.x * (0.5 * sin(6.2832 * 0.7 * s + uT * ${W1.toFixed(5)}) + 0.25 * sin(6.2832 * 1.6 * s - uT * ${W2.toFixed(5)} + 1.3));
  float w = uSize.x * (0.72 + 0.28 * sin(6.2832 * 0.5 * s + uT * ${W3.toFixed(5)} + 0.7));
  float th = 6.2832 * 0.6 * s + uT * ${W4.toFixed(5)};
  float face = cos(th);
  float hw = w * (0.3 + 0.7 * abs(face));                   // the band narrows where it turns edge on
  float v = (u - c) / hw;
  if (abs(v) > 1.0 || s < -0.05 || s > 1.05) { gl_FragColor = vec4(0.0); return; }
  float tone = 0.52 + 0.36 * face * (1.0 - 0.45 * v * v) + 0.16 * v * sign(face);
  vec3 col = tone < 0.4 ? uF1 : (tone < 0.7 ? uF2 : uF3);
  // dithered on the cell grid: thin away from the hero copy, and dissolve an end that stops in frame
  float dith = fract(52.9829189 * fract(dot(cell, vec2(0.06711056, 0.00583715))));
  float ends = mix(1.0, smoothstep(-0.05, 0.12, s), uEnds.x) * mix(1.0, 1.0 - smoothstep(0.88, 1.05, s), uEnds.y);
  gl_FragColor = vec4(col, 1.0) * keep(at, dith) * step(dith, ends);
}`;

type Layout = { A: [number, number]; B: [number, number]; half: number; bow: number; ends: [number, number] };

/**
 * Ribbon axis (from A to B), half-width and bow in CSS px, per host. It runs through the clear
 * rectangle the hero copy leaves; without one, it keeps to the side away from the copy. Each end
 * runs on past the host's edge when that path stays clear of the copy; otherwise it stops in the
 * frame and dissolves (`ends`), so the ribbon never stops in a straight cut or slices the text.
 */
function layout(f: Frame): Layout {
  const W = f.cssW, H = f.cssH, a = W / H, m = Math.min(W, H), b = f.band;
  let L: Omit<Layout, 'ends'>;
  if (b && b.h >= b.w) {
    // tall: climb the rectangle corner to corner, leaning away from the side the copy is on
    const k = b.w, left = b.x <= 1 && b.x + b.w < W - 1;
    L = left
      ? { A: [b.x + b.w, b.y + b.h * 1.12], B: [b.x - b.w * 0.15, b.y - b.h * 0.12], half: k * 0.24, bow: k * 0.14 }
      : { A: [b.x, b.y + b.h * 1.12], B: [b.x + b.w * 1.15, b.y - b.h * 0.12], half: k * 0.24, bow: k * 0.14 };
  } else if (b) L = { A: [b.x - b.w * 0.1, b.y + b.h * 0.9], B: [b.x + b.w * 1.1, b.y + b.h * 0.15], half: b.h * 0.22, bow: b.h * 0.1 };
  else if (f.kind !== 'panel' && W >= 700) L = { A: [W * 0.44, H * 1.15], B: [W * 1.08, -H * 0.15], half: m * 0.22, bow: m * 0.16 };
  else if (f.kind !== 'panel') L = { A: [-W * 0.1, H * 1.02], B: [W * 1.1, H * 0.64], half: W * 0.2, bow: W * 0.08 };
  else if (a > 2.4) L = { A: [-W * 0.05, H * 0.9], B: [W * 1.05, H * 0.15], half: H * 0.26, bow: H * 0.14 };
  else L = { A: [-W * 0.1, H * 1.05], B: [W * 1.1, -H * 0.05], half: m * 0.22, bow: m * 0.12 };
  // where the axis line leaves the host plus a margin (Liang-Barsky clip, both ways)
  const dx = L.B[0] - L.A[0], dy = L.B[1] - L.A[1], pad = 0.08 * Math.max(W, H);
  let t0 = -Infinity, t1 = Infinity;
  for (const [p, d, lo, hi] of [[L.A[0], dx, -pad, W + pad], [L.A[1], dy, -pad, H + pad]]) {
    if (Math.abs(d) < 1e-6) continue;
    t0 = Math.max(t0, Math.min((lo - p) / d, (hi - p) / d));
    t1 = Math.min(t1, Math.max((lo - p) / d, (hi - p) / d));
  }
  // an end may run on only if the ribbon's corridor (it swings about 1.8 half-widths plus the bow) misses the copy
  const reach = 1.8 * L.half + L.bow + KEEP_IN;
  const clear = (from: number, to: number) => {
    for (let i = 0; i <= 24; i++) {
      const t = from + ((to - from) * i) / 24, x = L.A[0] + dx * t, y = L.A[1] + dy * t;
      if (x < 0 || y < 0 || x > W || y > H) continue; // beyond the edge nothing shows
      for (const [x0, y0, x1, y1] of f.keep) if (Math.hypot(Math.max(x0 - x, 0, x - x1), Math.max(y0 - y, 0, y - y1)) < reach) return false;
    }
    return true;
  };
  const runA = t0 < 0 && clear(t0, 0), runB = t1 > 1 && clear(1, t1);
  const s0 = runA ? t0 : 0, s1 = runB ? t1 : 1;
  return { ...L, A: [L.A[0] + dx * s0, L.A[1] + dy * s0], B: [L.A[0] + dx * s1, L.A[1] + dy * s1], ends: [t0 < 0 && !runA ? 1 : 0, t1 > 1 && !runB ? 1 : 0] };
}

export function scene(): Scene {
  let prog: WebGLProgram, U: Record<string, WebGLUniformLocation | null>, loc = 0;
  return {
    tiers: 3,
    fps: 30,
    pixelated: true,
    still: STILL,
    scale: (tier) => 1 / CELLS[tier],
    init(s) {
      const gl = s.gl;
      prog = program(gl, VS, FS);
      U = uniforms(gl, prog, ['uRes', 'uCell', 'uT', 'uAxis', 'uSize', 'uEnds', 'uPtr', 'uF1', 'uF2', 'uF3', 'uKeep[0]', 'uKeepN']);
      loc = gl.getAttribLocation(prog, 'p');
      cover(gl);
    },
    draw(s, t) {
      const gl = s.gl, p = s.pal, L = layout(s);
      gl.useProgram(prog);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(U.uRes, s.w, s.h);
      gl.uniform1f(U.uCell, 1 / s.px);
      gl.uniform1f(U.uT, t);
      setKeep(gl, U, s);
      gl.uniform4f(U.uAxis, L.A[0], L.A[1], L.B[0], L.B[1]);
      gl.uniform2f(U.uSize, L.half, L.bow);
      gl.uniform2f(U.uEnds, L.ends[0], L.ends[1]);
      gl.uniform3f(U.uPtr, s.ptr.x, s.ptr.y, s.ptr.s);
      gl.uniform3fv(U.uF1, p.f1); gl.uniform3fv(U.uF2, p.f2); gl.uniform3fv(U.uF3, p.f3);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    paint(img, f, t) {
      const L = layout(f), cell = 1 / f.px, p = f.pal;
      const dx0 = L.B[0] - L.A[0], dy0 = L.B[1] - L.A[1], len = Math.hypot(dx0, dy0), dx = dx0 / len, dy = dy0 / len;
      for (let y = 0; y < f.h; y++) for (let x = 0; x < f.w; x++) {
        const px = (x + 0.5) * cell - L.A[0], py = (y + 0.5) * cell - L.A[1];
        const s = (px * dx + py * dy) / len, u = px * -dy + py * dx;
        const c = -L.bow * Math.sin(Math.PI * s) + L.half * (0.5 * Math.sin(TAU * 0.7 * s + t * W1) + 0.25 * Math.sin(TAU * 1.6 * s - t * W2 + 1.3));
        const w = L.half * (0.72 + 0.28 * Math.sin(TAU * 0.5 * s + t * W3 + 0.7));
        const face = Math.cos(TAU * 0.6 * s + t * W4), v = (u - c) / (w * (0.3 + 0.7 * Math.abs(face)));
        if (Math.abs(v) > 1 || s < -0.05 || s > 1.05) continue;
        const tone = 0.52 + 0.36 * face * (1 - 0.45 * v * v) + 0.16 * v * Math.sign(face);
        const col: RGB = tone < 0.4 ? p.f1 : tone < 0.7 ? p.f2 : p.f3;
        const ea = L.ends[0] ? Math.min(1, Math.max(0, (s + 0.05) / 0.17)) : 1, eb = L.ends[1] ? Math.min(1, Math.max(0, (1.05 - s) / 0.17)) : 1;
        if (ign(x, f.h - 1 - y) <= (ea * ea * (3 - 2 * ea)) * (eb * eb * (3 - 2 * eb))) blend(img, x, y, col, 1);
      }
    },
  };
}

export function mount(host: HTMLElement, ctx: MotionCtx) {
  return mountStage(host, ctx, scene());
}
