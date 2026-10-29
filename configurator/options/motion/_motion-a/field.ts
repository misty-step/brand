// Shared lifecycle for MotionA's three fields (dither mist, terraces, voxel stairs).
// Live: one WebGL canvas, one context, one draw per frame, drawn at one field pixel per `cell`
// CSS px and upscaled with nearest-neighbour filtering, so every field keeps a single crisp
// pixel unit at any DPR. Still: the same composition computed on the CPU into a 2D canvas, in
// idle slices, for reduced motion, Save-Data, no WebGL and a lost context (no GPU context at all).
// The renderer already pauses offscreen, hidden and paused hosts; the field also guards itself
// (IntersectionObserver + visibilitychange) so it stays correct outside this lab.
import type { MotionCtx, MotionHandle } from '../../../src/contract';
import { palette, type Palette } from './color';

export type HostKind = 'panel' | 'full' | 'page';
export type GL = WebGLRenderingContext | WebGL2RenderingContext;

/** One quality tier: CSS px per field pixel, draw rate, and a scene-specific detail knob. */
export interface Tier { cell: number; fps: number; q: number }

export interface Frame {
  t: number;            // field clock in seconds (stops while paused, offscreen or hidden)
  cols: number; rows: number;
  cell: number;
  q: number;
  pal: Palette;
  kind: HostKind;
  ptr: [number, number, number];   // CSS px from the canvas bottom-left, strength 0..1
  clear: Float32Array;  // up to 4 keep-clear boxes: centre x, centre y, half w, half h (CSS px, bottom-left origin)
  nClear: number;
}

export interface Scene { draw(f: Frame): void; dispose(): void }

/** Fills straight-alpha RGBA for image rows y0..y1 (top-down) of a CPU still. */
export type RowPainter = (out: Uint8ClampedArray, y0: number, y1: number) => void;

export interface FieldDef {
  gl2?: boolean;
  depth?: boolean;
  tiers: Tier[];
  anchor: 'left' | 'right';
  /** Field time of the first live frame and of the still. */
  t0: number;
  pointer?: boolean;
  /** Thin the field behind the hero's text when the host sits under it (full and page hosts). */
  keepClear?: boolean;
  scene(gl: GL): Scene;
  /** CPU mirror of one frame, painted at `stillCell` CSS px per pixel (default: the last tier's). */
  still(f: Frame): RowPainter;
  stillCell?: number;
}

const FADE = 'opacity 400ms cubic-bezier(.23,1,.32,1)';
const CANVAS_CSS = `position:absolute;bottom:0;display:block;pointer-events:none;image-rendering:pixelated;opacity:0;transition:${FADE}`;
const CLEAR_TARGETS = '.hero-title, .hero-sub, .actions, .hero-proof';

export function compile(gl: GL, vs: string, fs: string): WebGLProgram {
  const prog = gl.createProgram()!;
  for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]] as const) {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) ?? 'shader');
    gl.attachShader(prog, sh);
    gl.deleteShader(sh);
  }
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? 'link');
  return prog;
}

export function mountField(host: HTMLElement, ctx: MotionCtx, def: FieldDef): MotionHandle {
  const kind: HostKind = host.matches('[data-motion-root]') ? 'page' : host.classList.contains('hero-motion-host') ? 'full' : 'panel';
  const heroRoot = host.closest('[data-hero-root]') ?? document.querySelector('[data-hero-root]');
  const wrap = document.createElement('div');
  wrap.setAttribute('aria-hidden', 'true');
  wrap.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none';
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
  host.append(wrap);

  const stillCell = def.stillCell ?? def.tiers[def.tiers.length - 1].cell;
  let pal = palette(ctx, host);
  let reduced = ctx.reducedMotion;
  let tier = 0, t = def.t0, raf = 0, last = 0, lastDraw = 0, started = 0;
  let winStart = 0, winFrames = 0, lastTierChange = 0, gaveUp = false;
  let ext = true, onScreen = true, alive = true, stillGen = 0;
  let gl: GL | null = null, scene: Scene | null = null, glCanvas: HTMLCanvasElement | null = null, stillCanvas: HTMLCanvasElement | null = null;
  let cols = 0, rows = 0, clearDirty = true, nClear = 0;
  const clear = new Float32Array(16);
  const ptr = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, s: 0, ts: 0 };

  /** Sizes `c` to whole cells covering the host and lands its pixels on device pixels. */
  const size = (c: HTMLCanvasElement, cell: number) => {
    const r = wrap.getBoundingClientRect();
    const w = Math.max(1, Math.ceil(r.width / cell)), h = Math.max(1, Math.ceil(r.height / cell));
    if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
    c.style.width = `${w * cell}px`;
    c.style.height = `${h * cell}px`;
    const dpr = devicePixelRatio || 1;
    const edge = def.anchor === 'left' ? r.left : r.right;
    const dx = Math.round(edge * dpr) / dpr - edge, dy = Math.round(r.bottom * dpr) / dpr - r.bottom;
    c.style.transform = dx || dy ? `translate(${dx}px,${dy}px)` : '';
    return [w, h];
  };

  const measureClear = (cell: number, w: number) => {
    clearDirty = kind === 'page';   // a fixed host moves under the text on every scroll
    nClear = 0;
    if (!def.keepClear || kind === 'panel' || !heroRoot) return;
    const r = wrap.getBoundingClientRect();
    const left = def.anchor === 'left' ? r.left : r.right - w * cell, bottom = r.bottom;
    for (const el of heroRoot.querySelectorAll<HTMLElement>(CLEAR_TARGETS)) {
      if (nClear === 4) break;
      const b = el.getBoundingClientRect();
      if (!b.width || b.bottom < r.top || b.top > r.bottom || b.right < r.left || b.left > r.right) continue;
      clear.set([(b.left + b.right) / 2 - left, bottom - (b.top + b.bottom) / 2, b.width / 2 + 12, b.height / 2 + 12], nClear * 4);
      nClear++;
    }
  };

  const frameAt = (cell: number, w: number, h: number): Frame => {
    if (clearDirty) measureClear(cell, w);
    return { t, cols: w, rows: h, cell, q: def.tiers[tier].q, pal, kind, ptr: [ptr.x, ptr.y, ptr.s], clear, nClear };
  };

  const show = (c: HTMLCanvasElement, other: HTMLCanvasElement | null) => {
    requestAnimationFrame(() => {
      c.style.opacity = '1';
      if (other) other.style.opacity = '0';
    });
  };

  const draw = () => {
    if (!alive || !gl || !scene || !glCanvas) return;
    gl.viewport(0, 0, cols, rows);
    scene.draw(frameAt(def.tiers[tier].cell, cols, rows));
    if (glCanvas.style.opacity !== '1') show(glCanvas, stillCanvas);
  };

  const fitLive = () => {
    if (!glCanvas) return;
    [cols, rows] = size(glCanvas, def.tiers[tier].cell);
    clearDirty = true;
  };

  /** The CPU still, painted in idle slices of about 8ms so it never makes a long task.
   *  Repaints only when the size, the text boxes or the palette change; a palette change hides
   *  the old still at once so the wrong theme never shows. */
  let stillKey = '', stillPal = '';
  const paintStill = () => {
    if (!stillCanvas) {
      stillCanvas = document.createElement('canvas');
      stillCanvas.setAttribute('aria-hidden', 'true');
      stillCanvas.style.cssText = `${CANVAS_CSS};${def.anchor}:0`;
      wrap.append(stillCanvas);
    }
    const target = stillCanvas;
    const [w, h] = size(target, stillCell);
    clearDirty = true;
    const frame = frameAt(stillCell, w, h);
    const palKey = [pal.ground, pal.f1, pal.f2, pal.f3, pal.accent, pal.ink].join('|');
    const key = `${w}x${h}|${Array.from(frame.clear.subarray(0, frame.nClear * 4), Math.round).join(',')}|${palKey}|${t}`;
    if (key === stillKey) return;
    stillKey = key;
    if (palKey !== stillPal) { target.style.transition = 'none'; target.style.opacity = '0'; stillPal = palKey; }
    const gen = ++stillGen;
    const paint = def.still(frame);
    const img = new ImageData(w, h);
    let y = 0;
    const slice = () => {
      if (gen !== stillGen || !alive) return;
      const begin = performance.now();
      while (y < h && performance.now() - begin < 8) { const y1 = Math.min(h, y + 4); paint(img.data, y, y1); y = y1; }
      if (y < h) { later(slice); return; }
      target.getContext('2d')!.putImageData(img, 0, 0);
      target.style.transition = FADE;
      show(target, glCanvas);
    };
    slice();
  };
  const later = (fn: () => void) => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 120 }) : setTimeout(fn, 16));

  const startLive = () => {
    if (gl) return true;
    const c = document.createElement('canvas');
    c.setAttribute('aria-hidden', 'true');
    c.style.cssText = `${CANVAS_CSS};${def.anchor}:0`;
    const attrs: WebGLContextAttributes = { alpha: true, premultipliedAlpha: true, antialias: false, depth: !!def.depth, stencil: false, preserveDrawingBuffer: false, powerPreference: 'low-power' };
    const context = (def.gl2 ? c.getContext('webgl2', attrs) : c.getContext('webgl', attrs)) as GL | null;
    if (!context) return false;
    try { scene = def.scene(context); } catch (error) {
      console.warn('Motion field falls back to its still', error);
      context.getExtension('WEBGL_lose_context')?.loseContext();
      return false;
    }
    gl = context;
    glCanvas = c;
    wrap.append(c);
    c.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      halt();
      scene = null; gl = null;
      gaveUp = true;
      paintStill();
    });
    fitLive();
    return true;
  };

  const running = () => alive && !!gl && ext && onScreen && !document.hidden && !reduced && !gaveUp;
  const halt = () => { if (raf) cancelAnimationFrame(raf); raf = 0; };
  const frame = (now: number) => {
    raf = 0;
    if (!running()) return;
    raf = requestAnimationFrame(frame);
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    // Adaptive quality: sample the page frame rate over 2 s windows (after a 2 s warm-up),
    // step down below 50 fps at most once per 4 s, and hold a still once the last tier misses.
    if (!started) started = now;
    if (!winStart) winStart = now;
    winFrames++;
    if (now - winStart >= 2000) {
      const fps = (winFrames * 1000) / (now - winStart);
      winStart = now; winFrames = 0;
      if (now - started > 2000 && fps < 50 && now - lastTierChange > 4000) {
        lastTierChange = now;
        if (tier < def.tiers.length - 1) { tier++; fitLive(); }
        else { gaveUp = true; halt(); draw(); return; }
      }
    }
    if (def.pointer) {
      // Critically damped spring: the field answers a fine pointer locally and never bounces.
      const k = 90, c = 2 * Math.sqrt(k);
      ptr.vx += ((ptr.tx - ptr.x) * k - ptr.vx * c) * dt; ptr.x += ptr.vx * dt;
      ptr.vy += ((ptr.ty - ptr.y) * k - ptr.vy * c) * dt; ptr.y += ptr.vy * dt;
      ptr.s += (ptr.ts - ptr.s) * Math.min(1, dt * 5);
    }
    t += dt;
    if (now - lastDraw >= 1000 / def.tiers[tier].fps - 2) { lastDraw = now; draw(); }
  };
  const kick = () => { if (!raf && running()) { last = 0; winStart = 0; winFrames = 0; started = 0; raf = requestAnimationFrame(frame); } };

  const io = new IntersectionObserver((entries) => { onScreen = entries[entries.length - 1].isIntersecting; onScreen ? kick() : halt(); });
  io.observe(wrap);
  const onVisibility = () => (document.hidden ? halt() : kick());
  document.addEventListener('visibilitychange', onVisibility);
  const ro = new ResizeObserver(() => {
    if (gl) { fitLive(); if (!raf) draw(); }
    else paintStill();
  });
  ro.observe(wrap);
  if (heroRoot && def.keepClear) ro.observe(heroRoot);
  const onScroll = () => { if (kind === 'page') clearDirty = true; };
  addEventListener('scroll', onScroll, { passive: true });

  const fine = def.pointer && matchMedia('(hover: hover) and (pointer: fine)').matches;
  const onMove = (e: PointerEvent) => {
    if (reduced || !glCanvas) return;
    const r = glCanvas.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    ptr.tx = e.clientX - r.left; ptr.ty = r.bottom - e.clientY; ptr.ts = inside ? 1 : 0;
    if (ptr.s < 0.01) { ptr.x = ptr.tx; ptr.y = ptr.ty; }
  };
  if (fine) addEventListener('pointermove', onMove, { passive: true });

  const connection: unknown = Reflect.get(navigator, 'connection');
  const saveData = typeof connection === 'object' && connection !== null && 'saveData' in connection && connection.saveData === true;
  if (reduced || saveData || !startLive()) paintStill();
  else { draw(); kick(); }

  return {
    pause() { ext = false; halt(); },
    resume() { ext = true; kick(); },
    update(next) {
      pal = palette(next, host);
      if (next.reducedMotion !== reduced) {
        reduced = next.reducedMotion;
        if (reduced) { halt(); ptr.ts = 0; ptr.s = 0; }
        else if (!gl && !gaveUp && !saveData && startLive()) { draw(); kick(); return; }
      }
      if (gl) { draw(); kick(); } else paintStill();
    },
    destroy() {
      if (!alive) return;
      alive = false;
      stillGen++;
      halt();
      io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      removeEventListener('scroll', onScroll);
      if (fine) removeEventListener('pointermove', onMove);
      scene?.dispose();
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
      wrap.remove();
    },
  };
}

/** GLSL: soft keep-clear mask (1 = free, 0 = under text) from the boxes in Frame.clear. */
export const KEEP_CLEAR_GLSL = `
uniform vec4 uClear[4];
uniform float uNClear;
float keepClear(vec2 p, float soft) {
  float m = 1.0;
  for (int i = 0; i < 4; i++) {
    if (float(i) >= uNClear) break;
    vec4 b = uClear[i];
    vec2 d = abs(p - b.xy) - b.zw;
    float sd = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
    m = min(m, smoothstep(0.0, soft, sd));
  }
  return m;
}`;

/** CPU twin of KEEP_CLEAR_GLSL. */
export function keepClear(f: Frame, x: number, y: number, soft: number) {
  let m = 1;
  for (let i = 0; i < f.nClear; i++) {
    const dx = Math.abs(x - f.clear[i * 4]) - f.clear[i * 4 + 2], dy = Math.abs(y - f.clear[i * 4 + 1]) - f.clear[i * 4 + 3];
    const sd = Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) + Math.min(Math.max(dx, dy), 0);
    m = Math.min(m, smoothstep(0, soft, sd));
  }
  return m;
}

/** GLSL smoothstep, for the CPU mirrors. */
export function smoothstep(a: number, b: number, x: number) {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
}

/** Binds the KEEP_CLEAR_GLSL uniforms of `prog`; call the result with each Frame. */
export function keepClearUniforms(gl: GL, prog: WebGLProgram) {
  const boxes = gl.getUniformLocation(prog, 'uClear'), count = gl.getUniformLocation(prog, 'uNClear');
  return (f: Frame) => { gl.uniform4fv(boxes, f.clear); gl.uniform1f(count, f.nClear); };
}

export const FULLSCREEN_VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

/** One triangle that covers the viewport; returns its buffer for disposal. */
export function fullscreen(gl: GL, prog: WebGLProgram): WebGLBuffer {
  const buf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  return buf;
}
