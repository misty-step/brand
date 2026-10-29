// Voxel stairs: six flights of stairs build out of mist one step at a time, hold, and sink from
// the top, each on its own period (43 to 71 s) so the field never visibly loops. The focal
// flight's top tread is the only accent, and only once that flight is complete.
// Ported from the 2026-10-28 Direction C field (raw WebGL2, one instanced draw per frame).
import type { MotionCtx, MotionHandle } from '../../../src/contract';
import { mix, type RGB } from '../_motion-a/color';
import { compile, KEEP_CLEAR_GLSL, keepClear, keepClearUniforms, mountField, smoothstep, type Frame, type GL, type RowPainter } from '../_motion-a/field';

const MAX_FLIGHTS = 8;
// x, z: footprint origin; n steps of depth d and width w; p: period (s); f: phase;
// hold: share of the period spent fully built; base: floor height. The first flight is focal.
const FLIGHTS = [
  { x: -10, z: 9, dir: 'z', d: 2, n: 6, w: 4, p: 67, f: 0.36, rise: 0.3, hold: 0.6, base: 0, goal: true },
  { x: -12, z: -2, dir: 'x', d: 2, n: 5, w: 3, p: 53, f: 0.62, hold: 0.3, base: 0 },
  { x: -26, z: 14, dir: 'z', d: 2, n: 6, w: 3, p: 59, f: 0.18, hold: 0.34, base: -1 },
  { x: -24, z: 0, dir: 'z', d: 2, n: 5, w: 2, p: 71, f: 0.84, hold: 0.28, base: 0 },
  { x: -36, z: 8, dir: 'z', d: 2, n: 5, w: 3, p: 61, f: 0.05, hold: 0.32, base: 1 },
  { x: -30, z: -10, dir: 'x', d: 2, n: 5, w: 3, p: 43, f: 0.71, hold: 0.3, base: 1 },
];

const VS = `#version 300 es
layout(location=0) in vec3 aPos;
layout(location=1) in float aFace;
layout(location=2) in vec4 aBox;   // x0, z0, size x, size z (world units)
layout(location=3) in vec4 aStep;  // step index, flight, height, goal flag
uniform vec2 uView, uAnchor;
uniform float uScale;
uniform float uBuild[${MAX_FLIGHTS}];
out vec3 vWorld;
flat out float vFace;
flat out float vGoal;
void main() {
  float r = clamp(uBuild[int(aStep.y)] - aStep.x, 0.0, 1.0);
  r = r * r * (3.0 - 2.0 * r);
  vec3 p = vec3(aBox.x + aPos.x * aBox.z, mix(-12.0, mix(-8.0, aStep.z, r), aPos.y), aBox.y + aPos.z * aBox.w);
  vWorld = p;
  vFace = aFace;
  vGoal = aStep.w * step(0.999, r);
  // 2:1 dimetric: one world unit is uScale field px across, so tread edges are clean pixel lines.
  vec2 px = vec2((p.x - p.z) * uScale, p.y * 1.2247449 * uScale - (p.x + p.z) * 0.5 * uScale) + uAnchor;
  float near = (p.x + p.z) * 0.6123724 + p.y * 0.5;
  gl_Position = vec4(px / uView * 2.0 - 1.0, clamp(0.5 - near * 0.006, -1.0, 1.0), 1.0);
}`;

const FS = `#version 300 es
precision highp float;
in vec3 vWorld;
flat in float vFace;
flat in float vGoal;
uniform vec3 uTop, uSideA, uSideB, uSeam, uMist, uGoal;
uniform float uTime, uScale, uCell;
uniform vec2 uView;
${KEEP_CLEAR_GLSL}
out vec4 o;
float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y);
}
void main() {
  float px = 1.15 / (uScale * 1.41421356);
  vec3 c;
  if (vFace < 0.5) {
    c = vGoal > 0.5 ? uGoal : uTop;
    vec2 g = fract(vWorld.xz + 1e-4);
    if (vGoal < 0.5 && (g.x < px * 0.7 || g.y < px * 0.7)) c = mix(c, uSeam, 0.28);
  } else {
    c = vFace < 1.5 ? uSideA : uSideB;
    if (fract(vWorld.y + 1e-4) > 1.0 - px * 1.25) c = mix(c, uSeam, 0.7);
  }
  // Mist: a drifting surface the stairs rise through, plus haze with distance.
  float n = vnoise(vWorld.xz * 0.16 + vec2(uTime * 0.011, -uTime * 0.008)) * 1.5
          + vnoise(vWorld.xz * 0.055 + vec2(-uTime * 0.004, uTime * 0.003)) * 1.3;
  float inMist = smoothstep(0.6 + n + 0.4, 0.6 + n - 3.4, vWorld.y);
  float haze = clamp(-(vWorld.x + vWorld.z) / 46.0 + 0.08, 0.0, 0.62);
  // The stage's left and top edges dissolve into mist, so no voxel is ever cut by a hard edge.
  float edge = max(smoothstep(10.0 * uScale, uScale, gl_FragCoord.x), smoothstep(uView.y - 4.5 * uScale, uView.y - 0.25 * uScale, gl_FragCoord.y));
  float veil = max(max(inMist, haze), edge);
  veil = max(veil, 1.0 - keepClear(gl_FragCoord.xy * uCell, 64.0));
  o = vec4(mix(c, uMist, veil), 1.0);
}`;

// The three camera-facing faces of a unit box (top, +x, +z), two triangles each.
const FACES: [number, number[][]][] = [
  [0, [[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 0], [1, 1, 1], [0, 1, 1]]],
  [1, [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 0], [1, 1, 1], [1, 0, 1]]],
  [2, [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 0, 1], [1, 1, 1], [0, 1, 1]]],
];

/** Build level of one flight at time t: steps rise one at a time, hold, then sink from the top. */
function build(fl: (typeof FLIGHTS)[number], t: number) {
  const u = (((t / fl.p + fl.f) % 1) + 1) % 1;
  const rise = fl.rise ?? 0.42, sink = 1 - rise - fl.hold;
  const b = u < rise ? u / rise : u < rise + fl.hold ? 1 : 1 - (u - rise - fl.hold) / sink;
  return b * (fl.n + 0.6);
}

/** Face colours by light: the lit top is the lightest ink, the far side the darkest. */
function faces(f: Frame): { top: RGB; a: RGB; b: RGB; seam: RGB } {
  const p = f.pal;
  return p.dark
    ? { top: p.f3, a: p.f2, b: p.f1, seam: mix(p.ground, p.f1, 0.5) }
    : { top: mix(p.ground, [1, 1, 1], 0.6), a: p.f2, b: p.f3, seam: mix(p.f3, p.ink, 0.3) };
}

/** One box per step, 8 floats each: x0, z0, size x, size z, step index, flight, height, goal flag. */
const BOXES = FLIGHTS.flatMap((fl, i) => Array.from({ length: fl.n }, (_, k) => {
  const goal = fl.goal && k === fl.n - 1 ? 1 : 0;
  return fl.dir === 'z'
    ? [fl.x, fl.z - fl.d * (k + 1), fl.w, fl.d, k, i, fl.base + k + 1, goal]
    : [fl.x - fl.d * (k + 1), fl.z, fl.d, fl.w, k, i, fl.base + k + 1, goal];
}));
/** Field px per world unit: 4 where the focal flight fits whole, 2 on small hosts (phone panels).
 *  Even scales keep every tread edge a clean 2:1 pixel line. The anchor offsets scale with it. */
const scaleOf = (f: Frame) => (f.cols >= 92 && f.rows >= 80 ? 4 : 2);

export function scene(gl: GL) {
  const g = gl as WebGL2RenderingContext;
  const prog = compile(g, VS, FS);
  g.useProgram(prog);
  const u = (n: string) => g.getUniformLocation(prog, n);
  const U = { view: u('uView'), anchor: u('uAnchor'), scale: u('uScale'), cell: u('uCell'), build: u('uBuild'), time: u('uTime'),
    top: u('uTop'), a: u('uSideA'), b: u('uSideB'), seam: u('uSeam'), mist: u('uMist'), goal: u('uGoal') };
  const clear = keepClearUniforms(g, prog);

  const vao = g.createVertexArray();
  g.bindVertexArray(vao);
  const verts: number[] = [];
  for (const [face, tris] of FACES) for (const v of tris) verts.push(v[0], v[1], v[2], face);
  const vb = g.createBuffer();
  g.bindBuffer(g.ARRAY_BUFFER, vb);
  g.bufferData(g.ARRAY_BUFFER, new Float32Array(verts), g.STATIC_DRAW);
  g.enableVertexAttribArray(0);
  g.vertexAttribPointer(0, 3, g.FLOAT, false, 16, 0);
  g.enableVertexAttribArray(1);
  g.vertexAttribPointer(1, 1, g.FLOAT, false, 16, 12);
  const inst = BOXES.flat();
  const count = BOXES.length;
  const ib = g.createBuffer();
  g.bindBuffer(g.ARRAY_BUFFER, ib);
  g.bufferData(g.ARRAY_BUFFER, new Float32Array(inst), g.STATIC_DRAW);
  g.enableVertexAttribArray(2);
  g.vertexAttribPointer(2, 4, g.FLOAT, false, 32, 0);
  g.vertexAttribDivisor(2, 1);
  g.enableVertexAttribArray(3);
  g.vertexAttribPointer(3, 4, g.FLOAT, false, 32, 16);
  g.vertexAttribDivisor(3, 1);
  g.enable(g.DEPTH_TEST);
  g.depthFunc(g.LEQUAL);
  const levels = new Float32Array(MAX_FLIGHTS);

  return {
    draw(f: Frame) {
      const c = faces(f), p = f.pal;
      g.uniform2f(U.view, f.cols, f.rows);
      // Anchored to the bottom-right corner so every host crops the same composition and the
      // stairs stay out of the left third, where heroes set their text.
      const s = scaleOf(f);
      g.uniform2f(U.anchor, f.cols - 6 * s, 4.5 * s);
      g.uniform1f(U.scale, s);
      g.uniform1f(U.cell, f.cell);
      for (let i = 0; i < FLIGHTS.length; i++) levels[i] = build(FLIGHTS[i], f.t);
      g.uniform1fv(U.build, levels);
      g.uniform1f(U.time, f.t);
      g.uniform3fv(U.top, c.top); g.uniform3fv(U.a, c.a); g.uniform3fv(U.b, c.b); g.uniform3fv(U.seam, c.seam);
      g.uniform3fv(U.mist, p.ground); g.uniform3fv(U.goal, p.accent);
      clear(f);
      g.clearColor(p.ground[0], p.ground[1], p.ground[2], 1);
      g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT);
      g.drawArraysInstanced(g.TRIANGLES, 0, 18, count);
    },
    dispose() { g.deleteBuffer(vb); g.deleteBuffer(ib); g.deleteVertexArray(vao); g.deleteProgram(prog); },
  };
}

// CPU twin for the still (reduced motion, Save-Data, no WebGL): the same boxes and projection,
// filled per field pixel with a depth test, shaded and misted exactly as FS does.
const fract = (x: number) => x - Math.floor(x);
const h21 = (x: number, y: number) => fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453);
function vnoise(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y);
  let fx = x - ix, fy = y - iy;
  fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy);
  const lo = h21(ix, iy) + (h21(ix + 1, iy) - h21(ix, iy)) * fx, hi = h21(ix, iy + 1) + (h21(ix + 1, iy + 1) - h21(ix, iy + 1)) * fx;
  return lo + (hi - lo) * fy;
}

export function still(f: Frame): RowPainter {
  const c = faces(f), p = f.pal, T = f.t, W = f.cols, H = f.rows, S = scaleOf(f), ax = W - 6 * S, ay = 4.5 * S;
  const seamW = 1.15 / (S * Math.SQRT2);
  const depth = new Float32Array(W * H).fill(-Infinity);
  const rgb = new Float32Array(W * H * 3);
  for (let i = 0; i < W * H; i++) rgb.set(p.ground, i * 3);
  const sx = (x: number, z: number) => (x - z) * S + ax;
  const sy = (x: number, y: number, z: number) => y * 1.2247449 * S - (x + z) * 0.5 * S + ay;
  for (const [x0, z0, bx, bz, k, fi, h, goalFlag] of BOXES) {
    const r0 = Math.min(1, Math.max(0, build(FLIGHTS[fi], T) - k)), r = r0 * r0 * (3 - 2 * r0);
    const top = -8 + (h + 8) * r, goal = goalFlag === 1 && r >= 0.999;
    // face id, origin, and the two world edge vectors
    const quads: [number, number[], number[], number[]][] = [
      [0, [x0, top, z0], [bx, 0, 0], [0, 0, bz]],
      [1, [x0 + bx, -12, z0], [0, top + 12, 0], [0, 0, bz]],
      [2, [x0, -12, z0 + bz], [bx, 0, 0], [0, top + 12, 0]],
    ];
    for (const [face, o, u, v] of quads) {
      const ox = sx(o[0], o[2]), oy = sy(o[0], o[1], o[2]);
      const ux = sx(o[0] + u[0], o[2] + u[2]) - ox, uy = sy(o[0] + u[0], o[1] + u[1], o[2] + u[2]) - oy;
      const vx = sx(o[0] + v[0], o[2] + v[2]) - ox, vy = sy(o[0] + v[0], o[1] + v[1], o[2] + v[2]) - oy;
      const det = ux * vy - uy * vx;
      if (Math.abs(det) < 1e-6) continue;
      const xs = [ox, ox + ux, ox + vx, ox + ux + vx], ys = [oy, oy + uy, oy + vy, oy + uy + vy];
      const x0p = Math.max(0, Math.floor(Math.min(...xs))), x1p = Math.min(W - 1, Math.ceil(Math.max(...xs)));
      const y0p = Math.max(0, Math.floor(Math.min(...ys))), y1p = Math.min(H - 1, Math.ceil(Math.max(...ys)));
      for (let cy = y0p; cy <= y1p; cy++) {
        for (let cx = x0p; cx <= x1p; cx++) {
          const px = cx + 0.5 - ox, py = cy + 0.5 - oy;
          const a = (px * vy - py * vx) / det, b = (ux * py - uy * px) / det;
          if (a < 0 || a > 1 || b < 0 || b > 1) continue;
          const wx = o[0] + a * u[0] + b * v[0], wy = o[1] + a * u[1] + b * v[1], wz = o[2] + a * u[2] + b * v[2];
          const near = (wx + wz) * 0.6123724 + wy * 0.5, idx = cy * W + cx;
          if (near < depth[idx]) continue;
          depth[idx] = near;
          let col: RGB;
          if (face === 0) {
            col = goal ? p.accent : c.top;
            const gx = fract(wx + 1e-4), gz = fract(wz + 1e-4);
            if (!goal && (gx < seamW * 0.7 || gz < seamW * 0.7)) col = mix(col, c.seam, 0.28);
          } else {
            col = face === 1 ? c.a : c.b;
            if (fract(wy + 1e-4) > 1 - seamW * 1.25) col = mix(col, c.seam, 0.7);
          }
          const n = vnoise(wx * 0.16 + T * 0.011, wz * 0.16 - T * 0.008) * 1.5 + vnoise(wx * 0.055 - T * 0.004, wz * 0.055 + T * 0.003) * 1.3;
          const inMist = smoothstep(0.6 + n + 0.4, 0.6 + n - 3.4, wy);
          const haze = Math.min(0.62, Math.max(0, -(wx + wz) / 46 + 0.08));
          const edge = Math.max(smoothstep(10 * S, S, cx + 0.5), smoothstep(H - 4.5 * S, H - 0.25 * S, cy + 0.5));
          const veil = Math.max(inMist, haze, edge, 1 - keepClear(f, (cx + 0.5) * f.cell, (cy + 0.5) * f.cell, 64));
          rgb.set(mix(col, p.ground, veil), idx * 3);
        }
      }
    }
  }
  return (out, y0, y1) => {
    for (let iy = y0; iy < y1; iy++) {
      const cy = H - 1 - iy;
      for (let cx = 0; cx < W; cx++) {
        const s = (cy * W + cx) * 3, o = (iy * W + cx) * 4;
        out[o] = rgb[s] * 255; out[o + 1] = rgb[s + 1] * 255; out[o + 2] = rgb[s + 2] * 255; out[o + 3] = 255;
      }
    }
  };
}

export function mount(host: HTMLElement, ctx: MotionCtx): MotionHandle {
  return mountField(host, ctx, {
    gl2: true,
    depth: true,
    tiers: [{ cell: 4, fps: 30, q: 1 }, { cell: 4, fps: 15, q: 1 }, { cell: 4, fps: 8, q: 1 }],
    anchor: 'right',
    t0: 14,
    keepClear: true,
    scene,
    still,
  });
}
