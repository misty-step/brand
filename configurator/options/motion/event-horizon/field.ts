// Event horizon: a black hole seen almost edge on, drawn as stipple. The shadow is empty, a thin
// photon ring circles it, the near side of the disc crosses in front, and the far side is lensed
// into arcs over and under the shadow. The disc turns faster inside than out (Keplerian), so its
// streaks shear and never repeat. Dark is light in a void (three tones); light is an engraved plate
// (one ink, dot density follows brightness, the ring a continuous line).
// Raw WebGL1, one fullscreen triangle, one stipple cell per 2 CSS px, upscaled crisp.
import type { MotionCtx } from '../../../src/contract';
import { blend, cover, mountStage, program, uniforms, type Frame, type RGB, type Scene } from '../_motionb/stage';

const CELLS = [2, 3, 4];   // CSS px per stipple cell, per quality tier
const STILL = 41;          // seconds: the composed frame used under reduced motion
const TILT = -0.16;        // the disc leans a little, so the plate is not a symbol
const SPIN = 0.42;         // radians per second at the inner edge of the disc
const RIN = 1.55, ROUT = 4.4, INC = 0.12; // disc radii in shadow radii; cos of the inclination

const VS = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;
const FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uCell, uT, uLight;
uniform vec3 uHole, uPtr, uF1, uF2, uF3, uInk;
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
// brightness of the disc at radius r (shadow radii) and orbital angle a
float disc(float r, float a) {
  if (r < ${RIN} - 0.1 || r > ${ROUT}) return 0.0;
  float a2 = a - uT * ${SPIN} * pow(${RIN} / r, 1.5);       // Keplerian shear: inner orbits run ahead
  vec2 c = vec2(cos(a2), sin(a2));
  float n = 0.62 * noise(vec2(r * 3.1, 0.0) + c * 2.2) + 0.38 * noise(vec2(r * 7.3, 3.7) + c * 5.3);
  float body = smoothstep(${RIN} - 0.1, ${RIN} + 0.3, r) * (1.0 - smoothstep(${ROUT} - 1.6, ${ROUT}, r)) * pow(${RIN} / r, 1.1);
  return body * (1.0 - 0.5 * cos(a)) * (0.35 + 0.95 * n);  // the approaching side (left) is brighter
}
void main() {
  vec2 cell = floor(gl_FragCoord.xy);
  vec2 css = vec2(cell.x + 0.5, uRes.y - cell.y - 0.5) * uCell;
  vec2 dp = css - uPtr.xy;
  css -= dp * uPtr.z * 700.0 / (dot(dp, dp) + 2600.0);    // the pointer is a small second mass
  vec2 q = (css - uHole.xy) / uHole.z;
  float ct = cos(${TILT}), st = sin(${TILT});
  q = vec2(ct * q.x + st * q.y, st * q.x - ct * q.y);      // lean, then y up
  float rho = length(q), phi = atan(q.y, q.x);
  vec2 d = vec2(q.x, q.y / ${INC});
  float r = length(d), a = atan(d.y, d.x);
  float Ld = (rho > 1.0 || d.y < 0.0) ? disc(r, a) * 1.15 : 0.0; // direct image; the far half hides behind the shadow
  float over = smoothstep(1.02, 1.1, rho) * (1.0 - smoothstep(1.45, 1.95, rho)) * smoothstep(-0.25, 0.55, q.y / rho);
  float under = smoothstep(1.03, 1.08, rho) * (1.0 - smoothstep(1.16, 1.3, rho)) * smoothstep(0.1, 0.9, -q.y / rho);
  float L = max(Ld, over * disc(1.55 + (rho - 1.05) * 3.4, phi) * 1.1 + under * disc(1.7 + (rho - 1.03) * 6.0, -phi) * 0.8);
  // the photon ring: one connected line of cells at any size (0.72 cell reaches the diagonals), behind the near side of the disc
  float ring = step(abs(rho - 1.03) * uHole.z / uCell, 0.72) * (1.0 - step(0.0, -d.y) * step(0.25, Ld));
  float doppler = 0.5 - 0.5 * cos(phi);                    // 1 on the approaching side (left)
  if (rho < 1.0 && d.y >= 0.0) L = 0.0;                    // the shadow itself
  // stipple: interleaved gradient noise, fixed to the screen so the grain never crawls
  float th = fract(52.9829189 * fract(dot(cell, vec2(0.06711056, 0.00583715))));
  vec3 col; float alpha;
  if (uLight > 0.5) {
    alpha = step(th, clamp(L, 0.0, 1.0) * 0.78);
    col = mix(uF3, uInk, 0.3);
    if (ring > 0.5) { alpha = 1.0; col = mix(uF3, uInk, 0.42 + 0.3 * doppler); }
  } else {
    float lv = floor(clamp(L, 0.0, 1.0) * 3.0 + th);
    col = lv < 1.5 ? uF1 : (lv < 2.5 ? uF2 : uF3);
    alpha = lv < 0.5 ? 0.0 : 1.0;
    if (ring > 0.5) { alpha = 1.0; col = mix(uF3, uInk, 0.15 + 0.4 * doppler); }
  }
  gl_FragColor = vec4(col * alpha, alpha);
}`;

/**
 * The hole sits in the clear rectangle the hero copy leaves; without one, beside the copy on wide
 * full-bleed hosts and low on phones. Panels centre it.
 */
function place(f: Frame): [number, number, number] {
  const W = f.cssW, H = f.cssH, b = f.band;
  if (b) {
    // the drawing spans about 8.8 shadow radii across (the disc) and 3.4 down (lensed arc to under-arc)
    const rs = Math.min(b.w / 8.8, b.h / 4.4, Math.min(W, H) * 0.13);
    const x = b.x <= 1 && b.x + b.w >= W - 1 ? Math.min(W - rs * 3.2, Math.max(rs * 3.2, W * b.along)) : b.x + b.w / 2;
    return [x, b.y + b.h * 0.52, rs];
  }
  if (f.kind !== 'panel') {
    if (W >= 700) { const rs = Math.min(W * 0.068, H * 0.13); return [W - rs * 4.1, H * 0.5, rs]; }
    const rs = W * 0.11; return [W * 0.56, H - rs * 2.6, rs];
  }
  const rs = Math.min(W * 0.105, H * 0.2);
  return [W * 0.5, H * 0.52, rs];
}

// CPU twins of the shader functions, for the poster
const fract = (x: number) => x - Math.floor(x);
const sstep = (a: number, b: number, x: number) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
function hash(x: number, y: number) {
  let px = fract(x * 123.34), py = fract(y * 456.21);
  const d = px * (px + 45.32) + py * (py + 45.32);
  px += d; py += d;
  return fract(px * py);
}
function noise(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}
function disc(r: number, a: number, t: number) {
  if (r < RIN - 0.1 || r > ROUT) return 0;
  const a2 = a - t * SPIN * (RIN / r) ** 1.5, cx = Math.cos(a2), cy = Math.sin(a2);
  const n = 0.62 * noise(r * 3.1 + cx * 2.2, cy * 2.2) + 0.38 * noise(r * 7.3 + cx * 5.3, 3.7 + cy * 5.3);
  const body = sstep(RIN - 0.1, RIN + 0.3, r) * (1 - sstep(ROUT - 1.6, ROUT, r)) * (RIN / r) ** 1.1;
  return body * (1 - 0.5 * Math.cos(a)) * (0.35 + 0.95 * n);
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
      U = uniforms(gl, prog, ['uRes', 'uCell', 'uT', 'uLight', 'uHole', 'uPtr', 'uF1', 'uF2', 'uF3', 'uInk']);
      loc = gl.getAttribLocation(prog, 'p');
      cover(gl);
    },
    draw(s, t) {
      const gl = s.gl, p = s.pal;
      const [x, y, rs] = place(s);
      gl.useProgram(prog);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(U.uRes, s.w, s.h);
      gl.uniform1f(U.uCell, 1 / s.px);
      gl.uniform1f(U.uT, t);
      gl.uniform1f(U.uLight, s.ctx.theme === 'light' ? 1 : 0);
      gl.uniform3f(U.uHole, x, y, rs);
      gl.uniform3f(U.uPtr, s.ptr.x, s.ptr.y, s.ptr.s);
      gl.uniform3fv(U.uF1, p.f1); gl.uniform3fv(U.uF2, p.f2); gl.uniform3fv(U.uF3, p.f3); gl.uniform3fv(U.uInk, p.ink);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    paint(img, f, t) {
      const [hx, hy, rs] = place(f), cell = 1 / f.px, p = f.pal, light = f.ctx.theme === 'light';
      const mix = (k: number): RGB => [p.f3[0] + (p.ink[0] - p.f3[0]) * k, p.f3[1] + (p.ink[1] - p.f3[1]) * k, p.f3[2] + (p.ink[2] - p.f3[2]) * k];
      const ct = Math.cos(TILT), st = Math.sin(TILT), dots = mix(0.3);
      for (let y = 0; y < f.h; y++) for (let x = 0; x < f.w; x++) {
        const ux = ((x + 0.5) * cell - hx) / rs, uy = ((y + 0.5) * cell - hy) / rs;
        const qx = ct * ux + st * uy, qy = st * ux - ct * uy; // the shader's lean, then y up
        const rho = Math.hypot(qx, qy), phi = Math.atan2(qy, qx);
        const dx = qx, dy = qy / INC, r = Math.hypot(dx, dy), a = Math.atan2(dy, dx);
        const Ld = rho > 1 || dy < 0 ? disc(r, a, t) * 1.15 : 0;
        const over = sstep(1.02, 1.1, rho) * (1 - sstep(1.45, 1.95, rho)) * sstep(-0.25, 0.55, qy / rho);
        const under = sstep(1.03, 1.08, rho) * (1 - sstep(1.16, 1.3, rho)) * sstep(0.1, 0.9, -qy / rho);
        let L = Math.max(Ld, over * disc(1.55 + (rho - 1.05) * 3.4, phi, t) * 1.1 + under * disc(1.7 + (rho - 1.03) * 6, -phi, t) * 0.8);
        const ring = (Math.abs(rho - 1.03) * rs) / cell <= 0.72 && !(dy <= 0 && Ld >= 0.25);
        const doppler = 0.5 - 0.5 * Math.cos(phi);
        if (rho < 1 && dy >= 0) L = 0;
        const gy = f.h - 1 - y; // the shader's cell rows count from the bottom
        const th = fract(52.9829189 * fract(x * 0.06711056 + gy * 0.00583715));
        const k = Math.min(1, Math.max(0, L));
        if (ring) blend(img, x, y, mix(light ? 0.42 + 0.3 * doppler : 0.15 + 0.4 * doppler), 1);
        else if (light) { if (th <= k * 0.78) blend(img, x, y, dots, 1); }
        else {
          const lv = Math.floor(k * 3 + th);
          if (lv >= 1) blend(img, x, y, lv < 2 ? p.f1 : lv < 3 ? p.f2 : p.f3, 1);
        }
      }
    },
  };
}

export function mount(host: HTMLElement, ctx: MotionCtx) {
  return mountStage(host, ctx, scene());
}
