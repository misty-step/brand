// Field mesh: one slow ribbon of the palette's field colours sweeping through the hero, the way
// Stripe's wave does, but posterised into three flat tones and drawn on a 2 CSS px grid, so it
// reads as a screenprint in steps rather than a glowing gradient. The ribbon bows, breathes and
// twists on incommensurate periods (27 to 43 s), so it never visibly repeats.
// Raw WebGL1, one fullscreen triangle, upscaled crisp.
import type { MotionCtx } from '../../../src/contract';
import { blend, cover, mountStage, program, uniforms, type Frame, type RGB, type Scene } from '../_motionb/stage';

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
uniform vec3 uPtr, uF1, uF2, uF3;
void main() {
  vec2 cell = floor(gl_FragCoord.xy);
  vec2 css = vec2(cell.x + 0.5, uRes.y - cell.y - 0.5) * uCell;
  vec2 dp = css - uPtr.xy;
  css = uPtr.xy + dp * (1.0 - 0.14 * uPtr.z * exp(-dot(dp, dp) / 9800.0)); // a fine pointer lifts the cloth locally
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
  gl_FragColor = vec4(col, 1.0);
}`;

/**
 * Ribbon axis (from A to B), half-width and bow in CSS px, per host. It runs through the strip the
 * hero copy leaves clear; without one, it keeps to the side away from the copy.
 */
function layout(f: Frame): { A: [number, number]; B: [number, number]; half: number; bow: number } {
  const W = f.cssW, H = f.cssH, a = W / H, m = Math.min(W, H), b = f.band;
  if (b && b.h >= H) {
    const k = Math.min(b.w, H), left = b.x <= 1 && b.x + b.w < W - 1;
    return left
      ? { A: [b.x + b.w, H * 1.12], B: [b.x - b.w * 0.15, -H * 0.12], half: k * 0.24, bow: k * 0.14 }
      : { A: [b.x, H * 1.12], B: [b.x + b.w * 1.15, -H * 0.12], half: k * 0.24, bow: k * 0.14 };
  }
  if (b) return { A: [-W * 0.1, b.y + b.h * 0.9], B: [W * 1.1, b.y + b.h * 0.15], half: b.h * 0.22, bow: b.h * 0.1 };
  if (f.kind !== 'panel') {
    if (W >= 700) return { A: [W * 0.44, H * 1.15], B: [W * 1.08, -H * 0.15], half: m * 0.22, bow: m * 0.16 };
    return { A: [-W * 0.1, H * 1.02], B: [W * 1.1, H * 0.64], half: W * 0.2, bow: W * 0.08 };
  }
  if (a > 2.4) return { A: [-W * 0.05, H * 0.9], B: [W * 1.05, H * 0.15], half: H * 0.26, bow: H * 0.14 };
  return { A: [-W * 0.1, H * 1.05], B: [W * 1.1, -H * 0.05], half: m * 0.22, bow: m * 0.12 };
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
      U = uniforms(gl, prog, ['uRes', 'uCell', 'uT', 'uAxis', 'uSize', 'uPtr', 'uF1', 'uF2', 'uF3']);
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
      gl.uniform4f(U.uAxis, L.A[0], L.A[1], L.B[0], L.B[1]);
      gl.uniform2f(U.uSize, L.half, L.bow);
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
        blend(img, x, y, col, 1);
      }
    },
  };
}

export function mount(host: HTMLElement, ctx: MotionCtx) {
  return mountStage(host, ctx, scene());
}
