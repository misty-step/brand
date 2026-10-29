// Terraces: six ridges of terraced hills, far to near, each with a crisp stepped crest that
// dissolves downslope into drifting mist; a very slow aperiodic swell makes the whole bank rise
// and sink so the terraces surface and go under again. Ridges climb the field ramp from
// --field-1 (far) to --field-3 (near); the mist is the ground the host sits on.
// Ported from the 2026-10-28 Direction B field (raw WebGL1, one fullscreen triangle).
import type { MotionCtx, MotionHandle } from '../../../src/contract';
import { mix } from '../_motion-a/color';
import { compile, fullscreen, FULLSCREEN_VS, KEEP_CLEAR_GLSL, keepClear, keepClearUniforms, mountField, smoothstep, type Frame, type GL, type RowPainter } from '../_motion-a/field';

const FS = `
precision highp float;
uniform vec2 uRes;
uniform float uCell, uTime, uTop, uDetail;
uniform vec3 uGround, uFar, uMid, uNear, uWall;
${KEEP_CLEAR_GLSL}
float h1(float n){ return fract(sin(n * 12.9898 + 233.9) * 43758.5453); }
float n1(float x){ float i = floor(x), f = fract(x); float u = f * f * (3. - 2. * f); return mix(h1(i), h1(i + 1.), u); }
float fbm1(float x){ float s = 0., a = .5; for (int k = 0; k < 4; k++){ s += a * n1(x); x = x * 2.07 + 3.1; a *= .5; } return s / .9375; }
float h2(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
  return mix(mix(h2(i), h2(i + vec2(1., 0.)), u.x), mix(h2(i + vec2(0., 1.)), h2(i + vec2(1., 1.)), u.x), u.y); }
float fbm2(vec2 p){ float s = 0., a = .5; for (int k = 0; k < 3; k++){ if (float(k) >= uDetail) break; s += a * n2(p); p = p * 2.03 + vec2(17.1, 3.7); a *= .5; } return s / .875; }
void main(){
  // World units are host heights in a panel; under text (uTop > 1) the hills sit in the lower part.
  float y = gl_FragCoord.y / uRes.y * uTop;
  float x = gl_FragCoord.x / uRes.y * uTop;
  float t = uTime;
  float swell = .5 + .5 * (fbm1(t * .017 + 40.) * 2. - 1.) * 1.4;
  float q = 2. * uTop / uRes.y;                 // two field pixels: the crest's step height
  vec3 col = uGround;
  // Nearest ridge first: the first one that covers this pixel is the one you see.
  for (int j = 0; j < 6; j++) {
    float fi = float(5 - j);
    float d = fi / 5.;                            // 0 far .. 1 near
    float base = mix(.56, .04, d);
    float freq = mix(2.1, 1.25, d);
    float stepH = mix(.016, .03, d);
    float n = fbm1(x * freq + fi * 13.7);
    float pk = 1. - abs(2. * fbm1(x * freq * .5 + fi * 5.1) - 1.);
    float hx = base + .30 * (.35 * n + .65 * pk * pk * pk);
    if (y < floor(hx / q) * q) {
      float depth = hx - y;
      float fl = clamp(depth / .27, 0., 1.);
      float c = mix(depth, (base + .15) - y, fl * .55) / stepH;   // terrace walls follow the crest, flatten in the valley
      vec3 tread = d < .5 ? mix(uFar, uMid, d * 2.) : mix(uMid, uNear, d * 2. - 1.);
      vec3 hill = mix(tread, uWall, step(fract(c), .2) * (.35 + .35 * d));
      float wisp = fbm2(vec2(x * (1.6 - .7 * d) - t * (.012 + .006 * d) + fi * 7., y * (4. - 1.5 * d) + fi * 3. + t * .002));
      float band = .11 * wisp * wisp * (.55 + .7 * swell) * (.8 + .7 * d);
      float veil = smoothstep(band, band + .07 + .06 * d, depth);
      col = mix(hill, uGround, veil * (.84 - .1 * d));   // the body never quite vanishes: layered silhouettes
      break;
    }
  }
  col = mix(col, uGround, smoothstep(.55, .95, y) * .5);           // haze over the far ridges
  col = mix(col, uGround, (1. - smoothstep(.0, .10, y)) * .85);    // ground mist hands the host back to the page
  col = mix(uGround, col, keepClear(gl_FragCoord.xy * uCell, 96.));
  col += (h2(gl_FragCoord.xy) - .5) / 255.;                        // sub-LSB noise against banding only
  gl_FragColor = vec4(col, 1.);
}`;

/** Ridge inks: far ridges barely leave the ground, near ones take --field-3, walls lean to ink. */
function inks(f: Frame) {
  const p = f.pal;
  return { ground: p.ground, far: mix(p.ground, p.f1, 0.9), mid: p.f2, near: p.f3, wall: mix(p.f3, p.ink, 0.25) };
}
// Panels are the plate; under text (full and page hosts) the bank keeps to the lower ~45%.
const topOf = (f: Frame) => (f.kind === 'panel' ? 1 : 1.9);

export function scene(gl: GL) {
  const prog = compile(gl, FULLSCREEN_VS, FS);
  gl.useProgram(prog);
  const buf = fullscreen(gl, prog);
  const u = (n: string) => gl.getUniformLocation(prog, n);
  const res = u('uRes'), cell = u('uCell'), time = u('uTime'), top = u('uTop'), detail = u('uDetail');
  const ground = u('uGround'), far = u('uFar'), mid = u('uMid'), near = u('uNear'), wall = u('uWall');
  const clear = keepClearUniforms(gl, prog);
  return {
    draw(f: Frame) {
      const c = inks(f);
      gl.uniform2f(res, f.cols, f.rows);
      gl.uniform1f(cell, f.cell);
      gl.uniform1f(time, f.t);
      gl.uniform1f(detail, f.q);
      gl.uniform1f(top, topOf(f));
      gl.uniform3fv(ground, c.ground);
      gl.uniform3fv(far, c.far);
      gl.uniform3fv(mid, c.mid);
      gl.uniform3fv(near, c.near);
      gl.uniform3fv(wall, c.wall);
      clear(f);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() { gl.deleteBuffer(buf); gl.deleteProgram(prog); },
  };
}

// CPU twin of FS for the still (reduced motion, Save-Data, no WebGL). Same constants, same order;
// the ridge lines depend on x alone, so they are computed once per column.
const fract = (x: number) => x - Math.floor(x);
const h1 = (n: number) => fract(Math.sin(n * 12.9898 + 233.9) * 43758.5453);
function n1(x: number) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return h1(i) + (h1(i + 1) - h1(i)) * u; }
function fbm1(x: number) { let s = 0, a = 0.5; for (let k = 0; k < 4; k++) { s += a * n1(x); x = x * 2.07 + 3.1; a *= 0.5; } return s / 0.9375; }
function h2(x: number, y: number) {
  let qx = fract(x * 0.1031), qy = fract(y * 0.1031), qz = qx;
  const d = qx * (qy + 33.33) + qy * (qz + 33.33) + qz * (qx + 33.33);
  qx += d; qy += d; qz += d;
  return fract((qx + qy) * qz);
}
function n2(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const lo = h2(ix, iy) + (h2(ix + 1, iy) - h2(ix, iy)) * ux, hi = h2(ix, iy + 1) + (h2(ix + 1, iy + 1) - h2(ix, iy + 1)) * ux;
  return lo + (hi - lo) * uy;
}
function fbm2(x: number, y: number, oct: number) {
  let s = 0, a = 0.5;
  for (let k = 0; k < oct; k++) { s += a * n2(x, y); x = x * 2.03 + 17.1; y = y * 2.03 + 3.7; a *= 0.5; }
  return s / 0.875;
}

export function still(f: Frame): RowPainter {
  const top = topOf(f), c = inks(f), T = f.t, q = (2 * top) / f.rows;
  const swell = 0.5 + 0.5 * (fbm1(T * 0.017 + 40) * 2 - 1) * 1.4;
  const ridges = Array.from({ length: 6 }, (_, fi) => {
    const d = fi / 5, base = 0.56 + (0.04 - 0.56) * d, freq = 2.1 + (1.25 - 2.1) * d;
    const line = new Float32Array(f.cols);
    for (let cx = 0; cx < f.cols; cx++) {
      const x = ((cx + 0.5) / f.rows) * top;
      const pk = 1 - Math.abs(2 * fbm1(x * freq * 0.5 + fi * 5.1) - 1);
      line[cx] = base + 0.3 * (0.35 * fbm1(x * freq + fi * 13.7) + 0.65 * pk * pk * pk);
    }
    return { d, base, line, stepH: 0.016 + (0.03 - 0.016) * d };
  });
  return (out, y0, y1) => {
    for (let iy = y0; iy < y1; iy++) {
      const cy = f.rows - 1 - iy, y = ((cy + 0.5) / f.rows) * top;
      for (let cx = 0; cx < f.cols; cx++) {
        const x = ((cx + 0.5) / f.rows) * top;
        let col = c.ground;
        for (let fi = 5; fi >= 0; fi--) {
          const { d, base, line, stepH } = ridges[fi], hx = line[cx];
          if (y >= Math.floor(hx / q) * q) continue;
          const depth = hx - y, fl = Math.min(1, Math.max(0, depth / 0.27));
          const terrace = (depth + ((base + 0.15 - y) - depth) * fl * 0.55) / stepH;
          const tread = d < 0.5 ? mix(c.far, c.mid, d * 2) : mix(c.mid, c.near, d * 2 - 1);
          const hill = mix(tread, c.wall, (fract(terrace) <= 0.2 ? 1 : 0) * (0.35 + 0.35 * d));
          const wisp = fbm2(x * (1.6 - 0.7 * d) - T * (0.012 + 0.006 * d) + fi * 7, y * (4 - 1.5 * d) + fi * 3 + T * 0.002, f.q);
          const band = 0.11 * wisp * wisp * (0.55 + 0.7 * swell) * (0.8 + 0.7 * d);
          col = mix(hill, c.ground, smoothstep(band, band + 0.07 + 0.06 * d, depth) * (0.84 - 0.1 * d));
          break;
        }
        col = mix(col, c.ground, smoothstep(0.55, 0.95, y) * 0.5);
        col = mix(col, c.ground, (1 - smoothstep(0, 0.1, y)) * 0.85);
        col = mix(c.ground, col, keepClear(f, (cx + 0.5) * f.cell, (cy + 0.5) * f.cell, 96));
        const grain = (h2(cx + 0.5, cy + 0.5) - 0.5) / 255, o = (iy * f.cols + cx) * 4;
        out[o] = (col[0] + grain) * 255; out[o + 1] = (col[1] + grain) * 255; out[o + 2] = (col[2] + grain) * 255; out[o + 3] = 255;
      }
    }
  };
}

export function mount(host: HTMLElement, ctx: MotionCtx): MotionHandle {
  return mountField(host, ctx, {
    tiers: [{ cell: 2, fps: 30, q: 3 }, { cell: 4, fps: 24, q: 2 }, { cell: 4, fps: 12, q: 1 }],
    anchor: 'left',
    t0: 40,
    keepClear: true,
    scene,
    still,
    stillCell: 2,
  });
}
