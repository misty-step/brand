// Grid beams: light climbs the page's grid in steps. The rails are invisible until a beam runs
// along them: each beam takes a staircase path (a run of cells to the right, one cell up, again),
// its head a bright pixel, its tail fading over 150 CSS px, and every rail it crossed stays faintly
// lit for a few seconds before the grid goes dark again. Raw WebGL1, axis-aligned quads only.
import type { MotionCtx } from '../../../src/contract';
import { blend, crisp, mountStage, program, uniforms, type Frame, type RGB, type Scene } from '../_motionb/stage';

const STILL = 14;          // seconds of simulation behind the still frame
const SPEED = 200;         // CSS px per second along the rails
const TAIL = 200;          // CSS px of fading tail
const GLOW = 2.4;          // seconds for a crossed rail's afterglow to halve
const MAX_BEAMS = 4;
const QUADS = 512;

const VS = `
attribute vec2 aPos;   // CSS px from the host's top-left
attribute vec2 aTone;  // x: alpha, y: tone (0 lit rail, 1 tail, 2 head, 3 pointer cell, 4 landing)
uniform vec2 uRes;
uniform vec3 uF3, uInk, uAcc;
varying vec4 vCol;
void main() {
  float k = aTone.y;
  vec3 col = k < 0.5 ? uF3 : (k < 1.5 ? mix(uF3, uInk, aTone.x * 0.8) : (k < 2.5 ? uInk : (k < 3.5 ? uF3 : uAcc)));
  vCol = vec4(col * aTone.x, aTone.x);
  vec2 clip = aPos / uRes * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}`;
const FS = `precision mediump float; varying vec4 vCol; void main() { gl_FragColor = vCol; }`;

/** Rail module in CSS px: a calmer, wider grid on wide hosts. */
const moduleFor = (W: number) => (W >= 900 ? 80 : W >= 560 ? 64 : 48);

interface Beam { path: [number, number][]; len: number[]; total: number; born: number }
interface Glow { x0: number; y0: number; x1: number; y1: number; at: number }
interface World {
  /** advance to time t; returns the rail module and grid origin in CSS px */
  advance(f: Frame, t: number): { m: number; ox: number; oy: number };
  beams(): Beam[];
  glows(): Glow[];
  clock(): number;
}

/** The world: beams climbing staircases, and the rails they have lit. Deterministic from its seed. */
function world(seed0: number): World {
  let seed = seed0;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  let beams: Beam[] = [], glows: Glow[] = [], clock = 0, nextSpawn = 0.2;
  let geom = '';

  const spawn = (f: Frame, m: number, ox: number, oy: number) => {
    const cols = Math.floor((f.cssW - ox) / m), rows = Math.floor((f.cssH - oy) / m);
    if (cols < 3 || rows < 2) return;
    // keep the climb off the copy: right half on wide full-bleed hosts, lower band on phones
    const wide = f.kind !== 'panel' && f.cssW >= 700, phone = f.kind !== 'panel' && f.cssW < 700;
    const c0 = wide ? Math.ceil(cols * 0.5) : 0;
    let cx = c0 + Math.floor(rand() * Math.max(1, cols - c0 - 2));
    let cy = phone ? rows - Math.floor(rand() * 2) : Math.max(2, rows - Math.floor(rand() * Math.ceil(rows * 0.6)));
    const top = phone ? Math.max(1, rows - 4) : 0;
    const path: [number, number][] = [[ox + cx * m, oy + cy * m]];
    // climb inside the host: every staircase ends on a step you can see
    for (let step = 0; step < 9 && cx < cols - 1 && cy > top + 1; step++) {
      const run = 1 + Math.floor(rand() * 2);
      cx = Math.min(cols - 1, cx + run); path.push([ox + cx * m, oy + cy * m]);
      cy -= 1; path.push([ox + cx * m, oy + cy * m]);
    }
    if (path.length < 3) return;
    const len = [0];
    for (let i = 1; i < path.length; i++) len.push(len[i - 1] + Math.abs(path[i][0] - path[i - 1][0]) + Math.abs(path[i][1] - path[i - 1][1]));
    beams.push({ path, len, total: len[len.length - 1], born: clock });
  };

  /** Advance to time t (seconds), spawning and retiring beams on a fixed 1/30 s step. */
  const advance = (f: Frame, t: number) => {
    const m = moduleFor(f.cssW);
    const ox = Math.round((f.cssW % m) / 2), oy = Math.round((f.cssH % m) / 2);
    const g = `${f.cssW}x${f.cssH}`;
    // beams live under 10 s and glows under 12 s, so a reset only replays the last 20 s
    if (g !== geom || t < clock) { seed = seed0; beams = []; glows = []; clock = Math.max(0, t - 20); nextSpawn = clock + 0.2; geom = g; }
    while (clock < t) {
      clock += 1 / 30;
      if (clock >= nextSpawn) {
        if (beams.length < MAX_BEAMS) spawn(f, m, ox, oy);
        nextSpawn = clock + 0.9 + rand() * 1.2;
      }
      for (const b of beams) {
        const d = (clock - b.born) * SPEED;
        for (let i = 1; i < b.path.length; i++) {
          if (b.len[i] <= d && b.len[i] > d - SPEED / 30) {
            const [x0, y0] = b.path[i - 1], [x1, y1] = b.path[i];
            glows.push({ x0, y0, x1, y1, at: clock });
          }
        }
      }
      beams = beams.filter((b) => (clock - b.born) * SPEED < b.total + TAIL);
      glows = glows.filter((q) => clock - q.at < GLOW * 5);
    }
    return { m, ox, oy };
  };
  return { advance, beams: () => beams, glows: () => glows, clock: () => clock };
}

/**
 * Emits the frame as axis-aligned quads [x0, y0, x1, y1, alpha at start, alpha at end, tone]:
 * lit rails, each beam's tail along its staircase, its head pixel, and the pointer's cell.
 */
function quads(f: Frame, w: World, t: number, out: (q: number[]) => void) {
  const { m, ox, oy } = w.advance(f, t);
  const now = w.clock(), line = 1;
  for (const g of w.glows()) {
    const a = 0.7 * Math.pow(0.5, (now - g.at) / GLOW);
    if (a > 0.02) out([Math.min(g.x0, g.x1), Math.min(g.y0, g.y1), Math.max(g.x0, g.x1) + line, Math.max(g.y0, g.y1) + line, a, a, 0]);
  }
  for (const b of w.beams()) {
    const d = (now - b.born) * SPEED;
    for (let i = 1; i < b.path.length; i++) {
      const s0 = Math.max(b.len[i - 1], d - TAIL), s1 = Math.min(b.len[i], d);
      if (s1 <= s0) continue;
      const [x0, y0] = b.path[i - 1], [x1, y1] = b.path[i];
      const seg = b.len[i] - b.len[i - 1], k0 = (s0 - b.len[i - 1]) / seg, k1 = (s1 - b.len[i - 1]) / seg;
      const ax = x0 + (x1 - x0) * k0, ay = y0 + (y1 - y0) * k0, bx = x0 + (x1 - x0) * k1, by = y0 + (y1 - y0) * k1;
      const a0 = 1 - (d - s0) / TAIL, a1 = 1 - (d - s1) / TAIL;
      // quads run low-to-high coordinates; keep the alpha ramp pointing at the head
      if (ax <= bx && ay <= by) out([ax, ay, bx + line, by + line, a0, a1, 1]);
      else out([bx, by, ax + line, ay + line, a1, a0, 1]);
    }
    if (d >= b.total) {
      // the step it lands on: the one accent cell, fading as the tail drains in
      const [lx, ly] = b.path[b.path.length - 1], a = Math.max(0, 1 - (d - b.total) / TAIL);
      out([lx - 2, ly - 2, lx + 3, ly + 3, a, a, 4]);
    } else {
      let i = 1;
      while (i < b.path.length - 1 && b.len[i] < d) i++;
      const [x0, y0] = b.path[i - 1], [x1, y1] = b.path[i], k = (d - b.len[i - 1]) / (b.len[i] - b.len[i - 1]);
      const hx = Math.round(x0 + (x1 - x0) * k), hy = Math.round(y0 + (y1 - y0) * k);
      out([hx - 1, hy - 1, hx + 2, hy + 2, 1, 1, 2]);
    }
  }
  if (f.ptr.s > 0.02) {
    // the cell under a fine pointer outlines itself, faintly
    const cx = ox + Math.floor((f.ptr.x - ox) / m) * m, cy = oy + Math.floor((f.ptr.y - oy) / m) * m, a = 0.35 * f.ptr.s;
    out([cx, cy, cx + m + line, cy + line, a, a, 3]); out([cx, cy + m, cx + m + line, cy + m + line, a, a, 3]);
    out([cx, cy, cx + line, cy + m + line, a, a, 3]); out([cx + m, cy, cx + m + line, cy + m + line, a, a, 3]);
  }
}

export function scene(): Scene {
  const w = world(20261029);
  const verts = new Float32Array(QUADS * 6 * 4);
  let prog: WebGLProgram, U: Record<string, WebGLUniformLocation | null>, buf: WebGLBuffer, aPos = 0, aTone = 1;
  return {
    tiers: 2,
    fps: 60,
    pixelated: true,
    still: STILL,
    scale: (tier, dpr, cap) => (tier === 0 ? crisp(dpr, cap) : 1),
    init(s) {
      const gl = s.gl;
      prog = program(gl, VS, FS);
      U = uniforms(gl, prog, ['uRes', 'uF3', 'uInk', 'uAcc']);
      aPos = gl.getAttribLocation(prog, 'aPos'); aTone = gl.getAttribLocation(prog, 'aTone');
      buf = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, verts.byteLength, gl.DYNAMIC_DRAW);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    },
    draw(s, t) {
      const gl = s.gl, p = s.pal;
      let n = 0;
      quads(s, w, t, ([x0, y0, x1, y1, a0, a1, tone]) => {
        if (n >= QUADS) return;
        // horizontal quads ramp along x, vertical ones along y
        const horiz = x1 - x0 >= y1 - y0;
        const v = [[x0, y0, a0], [x1, y0, horiz ? a1 : a0], [x0, y1, horiz ? a0 : a1], [x1, y0, horiz ? a1 : a0], [x1, y1, a1], [x0, y1, horiz ? a0 : a1]];
        let o = n * 24;
        for (const [x, y, a] of v) { verts[o++] = x; verts[o++] = y; verts[o++] = a; verts[o++] = tone; }
        n++;
      });
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(prog);
      gl.uniform2f(U.uRes, s.cssW, s.cssH);
      gl.uniform3fv(U.uF3, p.f3); gl.uniform3fv(U.uInk, p.ink); gl.uniform3fv(U.uAcc, p.accent);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, verts.subarray(0, n * 24));
      gl.enableVertexAttribArray(aPos); gl.enableVertexAttribArray(aTone);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 16, 0);
      gl.vertexAttribPointer(aTone, 2, gl.FLOAT, false, 16, 8);
      gl.drawArrays(gl.TRIANGLES, 0, n * 6);
    },
    paint(img, f, t) {
      const p = f.pal;
      quads(f, w, t, ([x0, y0, x1, y1, a0, a1, tone]) => {
        const X0 = Math.round(x0 * f.px), Y0 = Math.round(y0 * f.px), X1 = Math.max(X0 + 1, Math.round(x1 * f.px)), Y1 = Math.max(Y0 + 1, Math.round(y1 * f.px));
        const horiz = X1 - X0 >= Y1 - Y0;
        for (let y = Y0; y < Y1; y++) for (let x = X0; x < X1; x++) {
          const k = horiz ? (x - X0 + 0.5) / (X1 - X0) : (y - Y0 + 0.5) / (Y1 - Y0), a = a0 + (a1 - a0) * k;
          const col: RGB = tone < 0.5 || (tone > 2.5 && tone < 3.5) ? p.f3 : tone < 1.5 ? (p.f3.map((c, i) => c + (p.ink[i] - c) * a * 0.8) as RGB) : tone < 2.5 ? p.ink : p.accent;
          blend(img, x, y, col, a);
        }
      });
    },
  };
}

export function mount(host: HTMLElement, ctx: MotionCtx) {
  return mountStage(host, ctx, scene());
}
