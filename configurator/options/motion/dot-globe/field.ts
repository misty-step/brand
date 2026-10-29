// Dotted globe: Natural Earth land as square points on a Fibonacci lattice, turning west to east
// once every four minutes, with one accent traveller hopping between land points a short arc
// at a time. Raw WebGL1, two point draws per frame, no library.
import type { MotionCtx } from '../../../src/contract';
import { blend, crisp, mountStage, program, uniforms, type Frame, type RGB, type Scene } from '../_motionb/stage';
import { LAND_24K, LAND_9K } from './land';

type V3 = [number, number, number];
const GA = Math.PI * (3 - Math.sqrt(5));
const TILT_X = 0.42;                 // the north pole leans toward the viewer
const TILT_Z = -0.14;                // a slight axial lean
const SPIN = (2 * Math.PI) / 240;    // one turn every four minutes
const FACE = (-38 * Math.PI) / 180;  // longitude facing the viewer in the still frame: the Atlantic
const STILL = 30;                    // seconds; the still frame has a hop in flight
const HOP = 2.8, LAG = 0.9, REST = 0.7; // hop flight, trail lag and rest, seconds
const ARC = 56;                      // most dots one trail can use
const DOT = 2;                       // CSS px per dot

const VS = `
attribute vec3 aPos;
attribute vec2 aMeta;
uniform mat3 uRot;
uniform vec3 uGlobe;
uniform vec2 uRes;
uniform float uPx, uT;
uniform vec3 uPtr, uF1, uF2, uF3, uInk, uAcc;
varying vec4 vCol;
void main() {
  vec3 p = uRot * aPos;
  float kind = aMeta.x;
  vec2 css = uGlobe.xy - p.xy * uGlobe.z; // seen from outside: east on the right, north up
  if (p.z < 0.0 && (kind < 1.5 || dot(p.xy, p.xy) < 1.0)) { gl_Position = vec4(2.0); gl_PointSize = 0.0; return; }
  float face = smoothstep(0.0, 0.62, p.z);
  float near = uPtr.z * (1.0 - smoothstep(20.0, 120.0, length(css - uPtr.xy)));
  vec3 col; float a; float size = ${DOT.toFixed(1)};
  if (kind < 0.5) {            // ocean: a faint lattice that gives the sphere its edge
    col = uF1; a = (0.15 + 0.85 * face) * 0.6;
    if (face < 0.35) size = 1.0;
  } else if (kind < 1.5) {     // land, with a slow sparkle that never syncs
    float sp = pow(0.5 + 0.5 * sin(uT * (0.35 + 0.5 * aMeta.y) + aMeta.y * 61.0), 12.0);
    col = mix(mix(uF2, uF3, face), uInk, 0.38 * sp * face);
    a = 0.2 + 0.8 * face;
    if (face < 0.2) size = 1.0;  // crowded limb points shrink to one pixel
  } else {                     // the traveller and its fading wake: the only accent on the field
    col = uAcc; a = aMeta.y;
    if (kind > 2.5) size += 1.0;
  }
  if (kind < 1.5) { col = mix(col, uF3, near * 0.8); size += near; }
  vCol = vec4(col * a, a);
  vec2 clip = css / uRes * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = max(1.0, floor(size * uPx + 0.5));
}`;
const FS = `precision mediump float; varying vec4 vCol; void main() { gl_FragColor = vCol; }`;

const dot3 = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const apply = (m: Float32Array, v: V3): V3 => [m[0] * v[0] + m[3] * v[1] + m[6] * v[2], m[1] * v[0] + m[4] * v[1] + m[7] * v[2], m[2] * v[0] + m[5] * v[1] + m[8] * v[2]];
const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const smooth = (a: number, b: number, x: number) => ease((x - a) / (b - a));

interface Lattice { pos: Float32Array; ocean: number; land: number; buf?: WebGLBuffer }
/** Points of a Fibonacci lattice as [x, y, z, kind, phase]: ocean first, then land. */
function lattice(N: number, mask: string): Lattice {
  const bits = Uint8Array.from(atob(mask), (c) => c.charCodeAt(0));
  const ocean: number[] = [], land: number[] = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (2 * (i + 0.5)) / N, r = Math.sqrt(1 - y * y), th = i * GA;
    const pt = [Math.cos(th) * r, y, Math.sin(th) * r, 0, (i * 0.6180339887) % 1];
    if (bits[i >> 3] & (1 << (i & 7))) { pt[3] = 1; land.push(...pt); }
    else if (y > -0.86) ocean.push(...pt);
  }
  return { pos: new Float32Array([...ocean, ...land]), ocean: ocean.length / 5, land: land.length / 5 };
}

/** View rotation: spin about the pole, lean the pole toward the viewer, then a slight axial lean. */
function rotation(t: number): Float32Array {
  const yaw = FACE - Math.PI / 2 - SPIN * (t - STILL);
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cx = Math.cos(TILT_X), sx = Math.sin(TILT_X), cz = Math.cos(TILT_Z), sz = Math.sin(TILT_Z);
  // R = Rz * Rx * Ry, column-major for GLSL
  const ry = [cy, 0, -sy, 0, 1, 0, sy, 0, cy], rx = [1, 0, 0, 0, cx, sx, 0, -sx, cx], rz = [cz, sz, 0, -sz, cz, 0, 0, 0, 1];
  const mul = (a: number[], b: number[]) => {
    const o = new Array(9).fill(0);
    for (let c = 0; c < 3; c++) for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) o[c * 3 + r] += a[k * 3 + r] * b[c * 3 + k];
    return o;
  };
  return new Float32Array(mul(rz, mul(rx, ry)));
}

/** Where the globe sits: beside the copy on wide full-bleed hosts, a horizon on phones and bands. */
function place(f: Frame): V3 {
  const W = f.cssW, H = f.cssH, a = W / H;
  if (f.kind !== 'panel') {
    if (W >= 700) { const R = Math.min(H * 0.52, W * 0.32); return [W - R * 0.92, H * 0.54, R]; }
    const R = W * 0.74; return [W * 0.58, H + R * 0.12, R];
  }
  // panels: the disc's top sits near the upper edge and the sphere rests on, or below, the lower edge
  let R: number, top: number;
  if (a < 0.85) { R = W * 0.6; top = H * 0.2; }
  else if (a < 1.5) { R = Math.min(W * 0.46, H * 0.56); top = H * 0.13; }
  else if (a < 2.4) { R = W * 0.4; top = H * 0.14; }
  else { R = W * 0.34; top = H * 0.12; }
  return [W * 0.5, top + R, R];
}

export function scene(): Scene {
  const big = lattice(24000, LAND_24K), small = lattice(9000, LAND_9K);
  const land: V3[] = [];
  for (let i = big.ocean; i < big.ocean + big.land; i++) land.push([big.pos[i * 5], big.pos[i * 5 + 1], big.pos[i * 5 + 2]]);
  const arc = new Float32Array((ARC + 1) * 5);
  let seed = 7;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  /** Next landing: 26 to 55 degrees away, facing the viewer on arrival, and long enough on screen to read. */
  const pick = (from: V3, arrive: number) => {
    const m = rotation(arrive), f = apply(m, from);
    let best = land[0], bestScore = -1;
    for (let n = 0; n < 120; n++) {
      const c = land[(rand() * land.length) | 0];
      const ang = Math.acos(Math.min(1, dot3(from, c)));
      const v = apply(m, c), screen = Math.hypot(v[0] - f[0], v[1] - f[1]);
      if (ang > 0.45 && ang < 0.95 && v[2] > 0.4 && screen > 0.42) return c;
      const score = v[2] > 0.2 ? screen : 0;
      if (ang > 0.2 && score > bestScore) { best = c; bestScore = score; }
    }
    return best;
  };
  // The chain starts from Iberia so the still frame is composed; each hop starts where the last landed.
  const iberia: V3 = [0.79, 0.61, -0.04];
  let first = land[0];
  for (const p of land) if (dot3(p, iberia) > dot3(first, iberia)) first = p;
  const start0 = STILL - HOP * 0.62;
  let hop = { a: first, b: pick(first, start0 + HOP), start: start0 };

  /** Fills `arc` with the current hop's trail for time t: `dots` wake dots, then the traveller. */
  const trail = (t: number, R: number) => {
    if (t < hop.start) hop = { a: first, b: hop.b, start: start0 };
    while (t - hop.start > HOP + LAG + REST) {
      const start = hop.start + HOP + LAG + REST;
      hop = { a: hop.b, b: pick(hop.b, start + HOP), start };
    }
    const tau = t - hop.start;
    const head = ease(tau / HOP), tail = ease((tau - LAG) / HOP), visible = head > tail + 0.002 ? 1 : 0;
    const ang = Math.acos(Math.min(1, dot3(hop.a, hop.b)));
    const sin = Math.sin(ang) || 1, lift = 0.05 + 0.32 * (ang / Math.PI);
    // the wake is dotted like the land: one dot every 6 CSS px of arc
    const dots = Math.max(2, Math.min(ARC, Math.round(((head - tail) * ang * R * (1 + lift)) / 6)));
    for (let i = 0; i <= ARC; i++) {
      const u = i < ARC ? tail + ((head - tail) * Math.min(i, dots - 1)) / (dots - 1) : head;
      const ka = Math.sin((1 - u) * ang) / sin, kb = Math.sin(u * ang) / sin, h = 1 + lift * Math.sin(Math.PI * u);
      const o = i * 5;
      for (let k = 0; k < 3; k++) arc[o + k] = (hop.a[k] * ka + hop.b[k] * kb) * h;
      arc[o + 3] = i < ARC ? 2 : 3;
      arc[o + 4] = i < ARC ? (i < dots ? visible * (0.1 + 0.9 * (i / (dots - 1)) ** 1.4) : 0) : visible * (tau < HOP + LAG * 0.5 ? 1 : 0);
    }
  };

  let prog: WebGLProgram, U: Record<string, WebGLUniformLocation | null>, arcBuf: WebGLBuffer, aPos = 0, aMeta = 1;
  return {
    tiers: 3,
    fps: 30,
    pixelated: true,
    still: STILL,
    scale: (tier, dpr, cap) => (tier < 2 ? crisp(dpr, cap) : 1),
    init(s) {
      const gl = s.gl;
      prog = program(gl, VS, FS);
      U = uniforms(gl, prog, ['uRot', 'uGlobe', 'uRes', 'uPx', 'uT', 'uPtr', 'uF1', 'uF2', 'uF3', 'uInk', 'uAcc']);
      aPos = gl.getAttribLocation(prog, 'aPos'); aMeta = gl.getAttribLocation(prog, 'aMeta');
      for (const l of [big, small]) {
        l.buf = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, l.buf);
        gl.bufferData(gl.ARRAY_BUFFER, l.pos, gl.STATIC_DRAW);
      }
      arcBuf = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, arcBuf);
      gl.bufferData(gl.ARRAY_BUFFER, arc.byteLength, gl.DYNAMIC_DRAW);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    },
    draw(s, t) {
      const gl = s.gl, p = s.pal;
      const [cx, cy, R] = place(s);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);
      gl.uniformMatrix3fv(U.uRot, false, rotation(t));
      gl.uniform3f(U.uGlobe, cx, cy, R);
      gl.uniform2f(U.uRes, s.cssW, s.cssH);
      gl.uniform1f(U.uPx, s.px);
      gl.uniform1f(U.uT, t);
      gl.uniform3f(U.uPtr, s.ptr.x, s.ptr.y, s.ptr.s);
      gl.uniform3fv(U.uF1, p.f1); gl.uniform3fv(U.uF2, p.f2); gl.uniform3fv(U.uF3, p.f3);
      gl.uniform3fv(U.uInk, p.ink); gl.uniform3fv(U.uAcc, p.accent);
      // keep dot spacing near 6 CSS px: the 24k lattice spaces dots 0.0229 R apart
      const l = s.tier < 2 && R * 0.0229 >= 5 ? big : small;
      gl.bindBuffer(gl.ARRAY_BUFFER, l.buf!);
      gl.enableVertexAttribArray(aPos); gl.enableVertexAttribArray(aMeta);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 20, 0);
      gl.vertexAttribPointer(aMeta, 2, gl.FLOAT, false, 20, 12);
      if (s.tier === 0) gl.drawArrays(gl.POINTS, 0, l.ocean);
      gl.drawArrays(gl.POINTS, l.ocean, l.land);
      trail(t, R);
      gl.bindBuffer(gl.ARRAY_BUFFER, arcBuf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, arc);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 20, 0);
      gl.vertexAttribPointer(aMeta, 2, gl.FLOAT, false, 20, 12);
      gl.drawArrays(gl.POINTS, 0, ARC + 1);
    },
    paint(img, f, t) {
      // the vertex shader, per point, on the CPU
      const p = f.pal, m = rotation(t);
      const [cx, cy, R] = place(f);
      const l = R * 0.0229 >= 5 ? big : small;
      trail(t, R);
      const dotAt = (src: Float32Array, i: number) => {
        const kind = src[i + 3], v = apply(m, [src[i], src[i + 1], src[i + 2]]);
        if (v[2] < 0 && (kind < 1.5 || v[0] * v[0] + v[1] * v[1] < 1)) return;
        const face = smooth(0, 0.62, v[2]);
        let col: RGB, a: number, size = DOT;
        if (kind < 0.5) { col = p.f1; a = (0.15 + 0.85 * face) * 0.6; if (face < 0.35) size = 1; }
        else if (kind < 1.5) { col = p.f2.map((c, k) => c + (p.f3[k] - c) * face) as RGB; a = 0.2 + 0.8 * face; if (face < 0.2) size = 1; }
        else { col = p.accent; a = src[i + 4]; if (kind > 2.5) size += 1; }
        const n = Math.max(1, Math.floor(size * f.px + 0.5));
        const x0 = Math.round((cx - v[0] * R) * f.px - n / 2), y0 = Math.round((cy - v[1] * R) * f.px - n / 2);
        for (let y = y0; y < y0 + n; y++) for (let x = x0; x < x0 + n; x++) blend(img, x, y, col, a);
      };
      for (let i = 0; i < l.ocean + l.land; i++) dotAt(l.pos, i * 5);
      for (let i = 0; i <= ARC; i++) dotAt(arc, i * 5);
    },
  };
}

export function mount(host: HTMLElement, ctx: MotionCtx) {
  return mountStage(host, ctx, scene());
}
