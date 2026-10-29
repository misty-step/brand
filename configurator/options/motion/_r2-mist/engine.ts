// R2 mist: one WebGL1 program behind every r2-mist-* option, drawn at one canvas pixel per cell
// (2 to 6 CSS px, snapped to whole device pixels) and upscaled nearest-neighbour.
// Three banks (far on the horizon, mid, near on the ground) drift right at three speeds. Each bank
// is thresholded through the chosen screen at its own offset, which slides with the bank when the
// pattern travels, and the nearest inked bank takes the cell in its own ink. A fine pointer parts
// the mist and leaves a wake that drifts downwind and refills; scrolling the hero away lifts and
// thins it; now and then a patch glitters, vanishes and reappears a short way off (the misty step).
// On arrival a veil clears from the headline outward. Reduced motion draws one finished frame.
// The lab pauses offscreen, hidden and paused hosts; the field also guards itself.
import type { MotionCtx, MotionHandle, MotionParam } from '../../../src/contract';
import { mix, palette, type Palette, type RGB } from '../_motion-a/color';
import { blueNoise, type Look, type Values } from './option';

const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const FS = `precision highp float;
uniform sampler2D uTex;
uniform float uCell, uT, uNClear;
uniform vec4 uField, uLook, uFx, uStepA, uStepB;
uniform vec4 uBankA[3], uBankB[3], uTrail[12], uClear[4];
uniform vec3 uInk[3];
float n2(vec2 x){ vec2 p = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f); return texture2D(uTex, (p + f + 0.5) / 64.0).g; }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ v += a * n2(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p + 5.3; a *= 0.5; } return v / 0.9375; }
float lifted(){ return uField.y * uField.x * 0.3; }
// a: centre line (CSS px above the canvas bottom), half thickness, scale, drift; b: undulation, gain, screen offset (cells), stretch.
// A bank is a soft horizontal band, thicker where its body is dense; the ground bank has no underside.
float bank(vec2 px, vec4 a, vec4 b, float seed, float ground){
  float y = px.y - lifted(), dy = y - a.x;
  if (dy > b.x + 1.5 * a.y || (ground < 0.5 && dy < -b.x - 1.5 * a.y)) return 0.0;
  vec2 q = vec2((px.x - a.w) / (a.z * b.w), y / (a.z * 0.5)) + seed;
  q += (vec2(n2(q * 1.7 + vec2(uLook.z, seed)), n2(q * 1.7 - vec2(seed, uLook.z))) - 0.5) * (0.25 + 1.6 * uField.w);
  float body = fbm(q + vec2(uLook.z * 0.4, 0.0));
  dy -= b.x * (2.0 * n2(vec2(q.x * 0.45, seed)) - 1.0);
  float hw = a.y * (0.7 + 0.5 * body);
  float prof = 1.0 - smoothstep(hw * 0.25, hw, ground > 0.5 ? max(dy, 0.0) : abs(dy));
  float lump = smoothstep(0.42, 0.72, body);
  if (ground > 0.5) lump = mix(lump, 0.6 + 0.4 * lump, 1.0 - smoothstep(0.0, a.x * 1.4, y));
  return prof * lump * b.y * (1.0 - 0.6 * uField.y);
}
// strands rising off the top of a bank and leaning downwind
float wisps(vec2 px, vec4 a, float seed){
  float h = px.y - lifted() - a.x - a.y * 0.6;
  if (h < -a.y || h > uField.x * 0.55) return 0.0;
  vec2 q = vec2((px.x - a.w * 1.05 - h * 0.25) / (a.z * 0.55), (px.y - uLook.w) / (a.z * 0.55)) + seed;
  return 0.6 * smoothstep(0.6, 0.85, fbm(q + vec2(uLook.z, 0.0))) * smoothstep(-a.y, 0.0, h) * exp(-max(h, 0.0) / (uField.x * 0.12));
}
vec3 field(vec2 p){
  return vec3(
    bank(p, uBankA[0], uBankB[0], 3.7, 0.0),
    bank(p, uBankA[1], uBankB[1], 11.3, 0.0) + uFx.y * 0.6 * uBankB[1].y * wisps(p, uBankA[1], 41.0),
    bank(p, uBankA[2], uBankB[2], 23.9, 1.0) + uFx.y * uBankB[2].y * wisps(p, uBankA[2], 31.0));
}
float keepClear(vec2 p, float soft){
  float m = 1.0;
  for (int i = 0; i < 4; i++){
    if (float(i) >= uNClear) break;
    vec4 b = uClear[i];
    vec2 d = abs(p - b.xy) - b.zw;
    m = min(m, smoothstep(-16.0, soft, length(max(d, 0.0)) + min(max(d.x, d.y), 0.0)));
  }
  return m;
}
float blue(vec2 c){ return texture2D(uTex, (mod(c, 64.0) + 0.5) / 64.0).r; }
float bay2(vec2 a){ a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bay4(vec2 a){ return bay2(0.5 * a) * 0.25 + bay2(a); }
// threshold of cell c under the chosen screen; never below 0.03, so thin air stays clear (above 1 never inks)
float screen(vec2 c){
  float k = uLook.x, b = blue(c), t = b * 2.2;
  if (k < 0.5) t = b;
  else if (k < 1.5) t = bay4(0.5 * c) * 0.25 + bay2(c) + 0.0078;
  else if (k < 2.5) t = bay4(c) + 0.031;
  else if (k < 3.5){ vec2 q = vec2(c.x + c.y, c.x - c.y) * 0.7854; t = 0.5 - 0.25 * (cos(q.x) + cos(q.y)) + (b - 0.5) * 0.06; }
  else if (k < 4.5){ float r = mod(c.y, 4.0); t = (r < 0.5 ? 0.0 : (r > 1.5 && r < 2.5) ? 0.86 : 0.6) + b * 0.5; }
  return max(t, 0.03);
}
void main(){
  vec2 c = floor(gl_FragCoord.xy), px = (c + 0.5) * uCell;
  float Hf = uField.x, veil = 1.0 - uField.z;
  if (px.y > Hf * 1.6 + lifted() && veil <= 0.0 && uStepB.z <= 0.0){ gl_FragColor = vec4(0.0); return; }
  vec2 push = vec2(0.0);
  float wake = 0.0;
  for (int i = 0; i < 12; i++){
    vec4 p = uTrail[i];
    if (p.z <= 0.0) continue;
    vec2 dv = px - p.xy;
    float g = p.z * exp(-dot(dv, dv) / (p.w * p.w));
    wake += g; push += dv * g;
  }
  vec2 sp = px - push * 0.35 * uFx.x;
  vec3 d = field(sp);
  float k = keepClear(px, 110.0);
  // The entrance: a light veil hangs over the words and clears from them outward, then everywhere.
  if (veil > 0.0) d.x = max(d.x, clamp(veil * 1.6 - (1.0 - k) * 0.8, 0.0, 1.0) * smoothstep(Hf * 0.7, Hf * 1.2, px.y) * (0.3 + 0.45 * n2(px / vec2(260.0, 60.0) + uLook.z)));
  d *= mix(1.0, k, uField.z);
  // Commit to mass: mid densities become solid cores, so dither lives at the edges, as in pixel-art fog.
  d = smoothstep(vec3(0.06), vec3(0.75), d);
  // A misty step: ragged soft patches, so what leaves A and lands at B reads as mist, not a disc.
  float mA = 0.0, mB = 0.0;
  if (uStepA.w + uStepB.z + uStepB.w > 0.0){
    vec2 dA = (px - uStepA.xy) / uStepA.z, dB = (px - uStepB.xy) / uStepA.z;
    mA = exp(-2.5 * dot(dA, dA)) * (0.55 + 0.45 * n2(dA * 2.5 + 3.0));
    mB = exp(-2.5 * dot(dB, dB)) * (0.55 + 0.45 * n2(dB * 2.5 + 3.0));
  }
  if (uStepA.w > 0.0) d *= 1.0 - mA * uStepA.w;
  if (uStepB.z > 0.0 && mB > 0.02) d = max(d, field(sp - (uStepB.xy - uStepA.xy)) * mB * uStepB.z * k);
  float spark = uStepB.w > 1.5 ? mB : uStepB.w > 0.5 ? mA : 0.0;
  d *= 1.0 - clamp(wake, 0.0, 1.0) * uFx.x;
  vec3 t = vec3(screen(c + vec2(uBankB[0].z, 0.0)), screen(c + vec2(uBankB[1].z, 0.0)), screen(c + vec2(uBankB[2].z, 0.0)));
  if (spark > 0.5){ t = fract(t + floor(uT * 15.0) * 0.618); d = max(d, vec3(0.0, 0.0, 0.35)); }
  vec3 col = uInk[2];
  float on = 1.0;
  if (d.z > t.z) col = uInk[2];
  else if (d.y > t.y) col = uInk[1];
  else if (d.x > t.x) col = uInk[0];
  else if (abs(px.y - Hf - lifted()) < uCell * 0.5 && blue(c + 17.0) < uLook.y * k * (1.0 - min(d.x * 1.5, 1.0)) * smoothstep(0.35, 0.65, n2(vec2((px.x - uBankA[0].w) / 160.0, 7.0)))) col = uInk[0];
  else on = 0.0;
  gl_FragColor = vec4(col * on, on);
}`;

const UNIFORMS = ['uTex', 'uCell', 'uT', 'uNClear', 'uField', 'uLook', 'uFx', 'uStepA', 'uStepB', 'uBankA', 'uBankB', 'uTrail', 'uClear', 'uInk'] as const;
type GL = WebGLRenderingContext;
interface Res { prog: WebGLProgram; buf: WebGLBuffer; tex: WebGLTexture; u: Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null> }

// 64 x 64 RGBA: R blue-noise thresholds (read at texel centres), G white noise (read filtered, as value noise).
// Made once per page in slices of at most 6 ms, so it never becomes a long task.
// Executor form: the lab compiles against ES2022, which has no Promise.withResolvers.
let noise: Promise<Uint8Array> | null = null;
function noiseTexture(): Promise<Uint8Array> {
  noise ??= new Promise((done) => {
    const vac = blueNoise(64, 1.9);
    const slice = () => {
      const end = performance.now() + 6;
      for (let r = vac.next(); ; r = vac.next()) {
        if (r.done) {
          const tex = new Uint8Array(64 * 64 * 4).fill(255);
          let s = 0x2545f491;
          r.value.forEach((v, i) => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; tex[i * 4] = v; tex[i * 4 + 1] = (s >>> 0) >>> 24; });
          done(tex);
          return;
        }
        if (performance.now() > end) break;
      }
      setTimeout(slice, 0);
    };
    slice();
  });
  return noise;
}

function init(gl: GL, data: Uint8Array): Res {
  const prog = gl.createProgram()!;
  for (const [type, src] of [[gl.VERTEX_SHADER, VS], [gl.FRAGMENT_SHADER, FS]] as const) {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) ?? 'shader');
    gl.attachShader(prog, sh);
    gl.deleteShader(sh);
  }
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? 'link');
  gl.useProgram(prog);
  const buf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 64, 64, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
  for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.REPEAT], [gl.TEXTURE_WRAP_T, gl.REPEAT]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
  const u = Object.fromEntries(UNIFORMS.map((n) => [n, gl.getUniformLocation(prog, n)])) as Res['u'];
  gl.uniform1i(u.uTex, 0);
  return { prog, buf, tex, u };
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ramp = (x: number, a: number, b: number) => clamp01((x - a) / (b - a));
const TIERS = [30, 20, 12];
const SPEED = [0.28, 0.55, 1]; // far, mid, near: share of the wind each bank feels
const WIND = 18;               // CSS px per second at wind 1 for the near bank
const CLEAR_TARGETS = '.hero-title, .hero-sub, .actions, .hero-proof';

export function mount(host: HTMLElement, ctx: MotionCtx, params: MotionParam[], look: Look): MotionHandle {
  const kind = host.matches('[data-motion-root]') ? 'page' : host.classList.contains('hero-motion-host') ? 'full' : 'panel';
  const heroRoot = host.closest('[data-hero-root]') ?? document.querySelector('[data-hero-root]');
  const wrap = document.createElement('div');
  wrap.setAttribute('aria-hidden', 'true');
  wrap.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none';
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;left:0;bottom:0;display:block;pointer-events:none;image-rendering:pixelated;opacity:0;transition:opacity 400ms cubic-bezier(.23,1,.32,1)';
  wrap.append(canvas);
  host.append(wrap);

  const resolve = (tune?: Record<string, number>) => Object.fromEntries(params.map((p) => {
    const v = tune?.[p.key];
    return [p.key, typeof v === 'number' && Number.isFinite(v) ? Math.min(p.max, Math.max(p.min, v)) : p.value];
  })) as Values;
  let v = resolve(ctx.tune);
  let pal: Palette = palette(ctx, host), palKey = ctx.theme + JSON.stringify(ctx.colors);
  let reduced = ctx.reducedMotion;
  let gl: GL | null = null, res: Res | null = null;
  let alive = true, ext = true, onScreen = true, gaveUp = false, drawn = false;
  let raf = 0, last = 0, lastDraw = 0, tier = 0, started = 0, winStart = 0, winFrames = 0, lastTier = 0;
  let t = 0, born = -1, evolve = 0, rise = 0, lift = 0, liftTarget = 0;
  const drift = [0, 0, 0];
  let cols = 1, rows = 1, cell = 3, clearDirty = true, nClear = 0;
  const clear = new Float32Array(16);
  const trail: { x: number; y: number; age: number; head: boolean }[] = [];
  const trailU = new Float32Array(48);
  let step: { ax: number; ay: number; bx: number; by: number; r: number; u: number } | null = null;
  let stepAt = 4 + (30 - 24 * v.step) * 0.6 * Math.random();
  const bankA = new Float32Array(12), bankB = new Float32Array(12), inks = new Float32Array(9);

  /** Whole cells that cover the host, each a whole number of device pixels, pinned bottom-left. */
  const fit = () => {
    const r = wrap.getBoundingClientRect(), dpr = devicePixelRatio || 1;
    cell = Math.max(1, Math.round(v.cell * dpr)) / dpr;
    cols = Math.max(1, Math.ceil(r.width / cell));
    rows = Math.max(1, Math.ceil(r.height / cell));
    if (canvas.width !== cols || canvas.height !== rows) { canvas.width = cols; canvas.height = rows; }
    canvas.style.width = `${cols * cell}px`;
    canvas.style.height = `${rows * cell}px`;
    const dx = Math.round(r.left * dpr) / dpr - r.left, dy = Math.round(r.bottom * dpr) / dpr - r.bottom;
    canvas.style.transform = dx || dy ? `translate(${dx}px,${dy}px)` : '';
    clearDirty = true;
  };

  /** The hero's words, as boxes from the canvas bottom-left, so the mist keeps clear of them. */
  const measure = () => {
    clearDirty = kind === 'page';
    nClear = 0;
    if (kind === 'panel' || !heroRoot) return;
    const r = canvas.getBoundingClientRect();
    for (const el of heroRoot.querySelectorAll<HTMLElement>(CLEAR_TARGETS)) {
      const b = el.getBoundingClientRect();
      if (nClear === 4 || !b.width || b.bottom < r.top || b.top > r.bottom || b.right < r.left || b.left > r.right) continue;
      clear.set([(b.left + b.right) / 2 - r.left, r.bottom - (b.top + b.bottom) / 2, b.width / 2 + 10, b.height / 2 + 8], nClear++ * 4);
    }
  };
  const clearAt = (x: number, y: number) => {
    let m = 1;
    for (let i = 0; i < nClear; i++) {
      const dx = Math.abs(x - clear[i * 4]) - clear[i * 4 + 2], dy = Math.abs(y - clear[i * 4 + 1]) - clear[i * 4 + 3];
      m = Math.min(m, clamp01(Math.max(dx, dy) / 64));
    }
    return m;
  };

  const composition = () => {
    const H = rows * cell, W = cols * cell;
    // A short band (phone heroes, panels) is mostly fog; a tall hero keeps sky for the words.
    const Hf = H * (v.height + (0.86 - v.height) * clamp01((440 - H) / 240));
    return { H, W, Hf, sc: Math.min(1.4, Math.max(0.45, Hf / 340)) };
  };

  const draw = () => {
    if (!gl || !res) return;
    if (clearDirty) measure();
    const { Hf, sc } = composition();
    const g = 0.45 + v.density, fe = look.feather;
    // centre, half thickness (shares of the fog height), feature scale (px), undulation (share), gain, stretch:
    // a thin broken band on the horizon, one floating layer, and the ground fog with clear air between.
    const geo = [[0.92, 0.06, 110, 0.02, 0.7, 4], [0.6, 0.1, 220, 0.05, 0.7, 4.2], [0.2, 0.42, 320, 0.09, 0.95, 3]];
    for (let b = 0; b < 3; b++) {
      const [c, hw, scale, amp, gain, stretch] = geo[b];
      bankA.set([Hf * c, Hf * hw * fe, scale * sc, drift[b]], b * 4);
      bankB.set([Hf * amp, gain * g, 24 * b - Math.floor((v.travel * drift[b]) / cell), stretch], b * 4);
    }
    // Inks along the palette's own field ramp (bg, field-1..3, then a little toward ink); light grounds go one step deeper.
    const at = (s: number): RGB => s <= 1 ? mix(pal.bg, pal.f1, s) : s <= 2 ? mix(pal.f1, pal.f2, s - 1) : s <= 3 ? mix(pal.f2, pal.f3, s - 2) : mix(pal.f3, pal.ink, Math.min(0.45, (s - 3) * 0.12));
    const deep = 2.3 + v.depth * 2.2 + (pal.dark ? 0 : 0.45), n = Math.round(v.inks);
    const levels = n === 1 ? [deep, deep, deep] : n === 2 ? [deep * 0.78, deep * 0.78, deep] : [deep * 0.6, deep * 0.8, deep];
    levels.forEach((s, i) => inks.set(at(s), i * 3));
    const enter = born < 0 ? 1 : 1 - (1 - clamp01((t - born) / 1.5)) ** 2;
    for (let i = 0; i < 12; i++) {
      const p = trail[i];
      if (p) trailU.set([p.x, p.y, p.head ? 1 : Math.exp(-p.age / 1.4), 72 + p.age * 36], i * 4); else trailU[i * 4 + 2] = 0;
    }
    let sA = [0, 0, 1, 0], sB = [0, 0, 0, 0];
    if (step) {
      const u = step.u;
      sA = [step.ax, step.ay, step.r, ramp(u, 0.42, 0.62) * (1 - ramp(u, 1.1, 2.6))];
      sB = [step.bx, step.by, ramp(u, 0.5, 0.7) * (1 - ramp(u, 1.0, 2.6)), u < 0.5 ? 1 : u < 0.9 ? 2 : 0];
    }
    const { u } = res;
    gl.viewport(0, 0, cols, rows);
    gl.uniform1f(u.uCell, cell);
    gl.uniform1f(u.uT, t);
    gl.uniform1f(u.uNClear, nClear);
    gl.uniform4f(u.uField, Hf, lift * look.lift, enter, v.turbulence);
    gl.uniform4f(u.uLook, Math.round(v.screen), look.horizon, evolve, rise);
    gl.uniform4f(u.uFx, look.wake, look.wisps, 0, 0);
    gl.uniform4fv(u.uStepA, sA);
    gl.uniform4fv(u.uStepB, sB);
    gl.uniform4fv(u.uBankA, bankA);
    gl.uniform4fv(u.uBankB, bankB);
    gl.uniform4fv(u.uTrail, trailU);
    gl.uniform4fv(u.uClear, clear);
    gl.uniform3fv(u.uInk, inks);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!drawn) { drawn = true; requestAnimationFrame(() => { canvas.style.opacity = '1'; }); }
  };

  const startStep = () => {
    const { W, Hf, sc } = composition();
    for (let i = 0; i < 12; i++) {
      const ax = W * (0.1 + 0.8 * Math.random()), ay = Hf * (0.12 + 0.6 * Math.random());
      const dir = Math.random() < 0.7 ? 1 : -1, len = (150 + 110 * Math.random()) * Math.max(0.6, sc);
      const bx = ax + dir * len < 40 || ax + dir * len > W - 40 ? ax - dir * len : ax + dir * len;
      const by = ay + (Math.random() - 0.5) * 36;
      if (bx < 40 || bx > W - 40 || clearAt(ax, ay) < 1 || clearAt(bx, by) < 1) continue;
      step = { ax, ay, bx, by, r: (44 + 20 * Math.random()) * Math.max(0.6, sc), u: 0 };
      return;
    }
  };

  /** Advances the field clock and everything that drifts with it. */
  const advance = (dt: number) => {
    t += dt;
    if (born < 0) born = t;
    const wind = WIND * v.wind;
    for (let b = 0; b < 3; b++) drift[b] += wind * SPEED[b] * dt;
    evolve += dt * (0.02 + 0.03 * v.wind);
    rise += dt * (5 + 7 * v.wind);
    lift += (liftTarget - lift) * Math.min(1, dt * 4);
    for (const p of trail) { p.age += p.head ? 0 : dt; p.x += wind * SPEED[1] * dt; }
    while (trail.length && !trail[trail.length - 1].head && trail[trail.length - 1].age > 4) trail.pop();
    if (step) {
      step.u += dt;
      step.ax += wind * SPEED[1] * dt; step.bx += wind * SPEED[1] * dt;
      if (step.u > 2.6) { step = null; stepAt = t + (30 - 24 * v.step) * (0.75 + 0.5 * Math.random()); }
    } else if (v.step > 0 && t >= stepAt && t - born > 3) startStep();
  };

  const running = () => alive && !!res && ext && onScreen && !document.hidden && !reduced && !gaveUp;
  const halt = () => { if (raf) cancelAnimationFrame(raf); raf = 0; };
  const frame = (now: number) => {
    raf = 0;
    if (!running()) return;
    raf = requestAnimationFrame(frame);
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    // Adaptive quality: sample the page frame rate in 2 s windows after a 2 s warm-up; below 45 fps
    // drop to the next draw rate (at most every 4 s); below the last one, hold the current frame.
    if (!started) started = winStart = now;
    winFrames++;
    if (now - winStart >= 2000) {
      const fps = (winFrames * 1000) / (now - winStart);
      winStart = now; winFrames = 0;
      if (now - started > 2000 && fps < 45 && now - lastTier > 4000) {
        lastTier = now;
        if (tier < TIERS.length - 1) tier++;
        else { gaveUp = true; halt(); return; }
      }
    }
    advance(dt);
    if (now - lastDraw >= 1000 / TIERS[tier] - 2) { lastDraw = now; draw(); }
  };
  const kick = () => {
    if (raf || !running()) return;
    last = started = winFrames = 0;
    raf = requestAnimationFrame(frame);
  };
  /** One frame without the clock: the finished composition when nothing has run yet. */
  const still = () => {
    if (born < 0) born = t - 10;
    draw();
  };

  let data: Uint8Array | null = null;
  const start = () => {
    const c = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false, powerPreference: 'low-power' });
    if (!c || !data) return;
    try { res = init(c, data); gl = c; } catch (error) { console.warn('Mist field could not start', error); c.getExtension('WEBGL_lose_context')?.loseContext(); }
  };
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); halt(); res = null; });
  canvas.addEventListener('webglcontextrestored', () => {
    if (!gl || !data || !alive) return;
    try { res = init(gl, data); } catch { return; }
    if (running()) kick(); else still();
  });

  const io = new IntersectionObserver((entries) => { onScreen = entries[entries.length - 1].isIntersecting; if (onScreen) kick(); else halt(); });
  io.observe(wrap);
  const onVisibility = () => (document.hidden ? halt() : kick());
  document.addEventListener('visibilitychange', onVisibility);
  const ro = new ResizeObserver(() => { fit(); if (!raf && res) draw(); });
  ro.observe(wrap);
  if (heroRoot) ro.observe(heroRoot);
  // The entrance moves the words a few pixels; measure them again once it has settled.
  const settle = setTimeout(() => { clearDirty = true; }, 900);
  const onScroll = () => {
    if (kind === 'page') { clearDirty = true; return; }
    if (!heroRoot) return;
    const r = heroRoot.getBoundingClientRect();
    liftTarget = clamp01(-r.top / Math.max(1, r.height * 0.75));
  };
  addEventListener('scroll', onScroll, { passive: true });

  // A fine pointer parts the mist; its path leaves a wake that drifts downwind and refills.
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const onMove = (e: PointerEvent) => {
    if (reduced) return;
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = r.bottom - e.clientY;
    const inside = x >= 0 && y >= 0 && x <= r.width && y <= r.height;
    const head = trail[0]?.head ? trail[0] : null;
    if (!inside) { if (head) head.head = false; return; }
    if (head && Math.hypot(head.x - x, head.y - y) < 16) { head.x = x; head.y = y; return; }
    if (head) head.head = false;
    trail.unshift({ x, y, age: 0, head: true });
    if (trail.length > 12) trail.length = 12;
  };
  const onLeave = () => { if (trail[0]) trail[0].head = false; };
  if (fine) { addEventListener('pointermove', onMove, { passive: true }); document.documentElement.addEventListener('pointerleave', onLeave); }

  fit();
  onScroll();
  // The first frame waits for the screen; by then the lab has said pause or resume.
  void noiseTexture().then((tex) => {
    if (!alive) return;
    data = tex;
    start();
    if (running()) kick(); else still();
  });

  return {
    pause() { ext = false; halt(); if (!drawn) still(); },
    resume() { ext = true; kick(); },
    update(next) {
      const key = next.theme + JSON.stringify(next.colors);
      if (key !== palKey) { pal = palette(next, host); palKey = key; }
      const nv = resolve(next.tune), resize = nv.cell !== v.cell;
      v = nv;
      if (resize) fit();
      if (next.reducedMotion !== reduced) {
        reduced = next.reducedMotion;
        if (reduced) { halt(); trail.length = 0; step = null; lift = 0; born = -1; }
      }
      if (running()) kick(); else if (res) still();
    },
    destroy() {
      if (!alive) return;
      alive = false;
      halt();
      clearTimeout(settle);
      io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      removeEventListener('scroll', onScroll);
      if (fine) { removeEventListener('pointermove', onMove); document.documentElement.removeEventListener('pointerleave', onLeave); }
      if (gl && res) { gl.deleteTexture(res.tex); gl.deleteBuffer(res.buf); gl.deleteProgram(res.prog); }
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
      wrap.remove();
    },
  };
}
