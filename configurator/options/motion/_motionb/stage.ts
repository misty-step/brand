// Shared runtime for the MotionB backgrounds: one canvas, one WebGL context, no library.
// It owns the background rules so each scene only draws: nothing is drawn until the canvas is
// on screen, the loop stops when paused, offscreen or hidden, reduced motion gets one still frame,
// quality steps down when frames drop, palettes ease on update(), destroy() releases the context.
// Without WebGL (or after a lost context) the scene paints the same still on the CPU instead.
// Not an option: this directory has no index.ts.
import type { MotionCtx, MotionHandle } from '../../../src/contract';

export type RGB = [number, number, number];
export interface Palette { bg: RGB; ink: RGB; accent: RGB; f1: RGB; f2: RGB; f3: RGB }
export type HostKind = 'panel' | 'full' | 'page';

/** Geometry and colour a scene draws with, shared by the WebGL and CPU paths. */
export interface Frame {
  kind: HostKind;
  /** backing size in canvas pixels */
  w: number; h: number;
  /** CSS size the backing store covers */
  cssW: number; cssH: number;
  /** backing pixels per CSS pixel */
  px: number;
  tier: number;
  pal: Palette;
  /** pointer in CSS px from the host's top-left; s eases 0..1 while a fine pointer is near */
  ptr: { x: number; y: number; s: number };
  ctx: MotionCtx;
}
export interface Stage extends Frame { gl: WebGLRenderingContext; canvas: HTMLCanvasElement; host: HTMLElement }
export interface Pixels { data: Uint8ClampedArray; width: number; height: number }

export interface Scene {
  /** backing pixels per CSS pixel for a quality tier */
  scale(tier: number, dpr: number, cap: number): number;
  tiers: number;
  pixelated?: boolean;
  /** frame-rate ceiling for the loop */
  fps?: number;
  /** seconds: the composed frame used under reduced motion, as the first frame and as the poster */
  still: number;
  init(s: Stage): void;
  draw(s: Stage, t: number): void;
  /** The same composition on the CPU (unpremultiplied RGBA), used when WebGL is missing or lost. */
  paint(img: Pixels, f: Frame, t: number): void;
}

/** Largest backing scale <= cap whose upscale to device pixels is a whole number. */
export function crisp(dpr: number, cap: number): number {
  return dpr / Math.ceil(dpr / Math.min(dpr, cap));
}

let probe: CanvasRenderingContext2D | null | undefined;
/** Any CSS colour the browser understands (oklch, color-mix, hex) to sRGB 0..1. */
export function rgb(css: string, fallback: RGB): RGB {
  if (probe === undefined) {
    const c = document.createElement('canvas');
    c.width = c.height = 1;
    probe = c.getContext('2d', { willReadFrequently: true });
  }
  if (!probe || !css) return fallback;
  probe.clearRect(0, 0, 1, 1);
  probe.fillStyle = css;
  probe.fillRect(0, 0, 1, 1);
  const d = probe.getImageData(0, 0, 1, 1).data;
  return d[3] ? [d[0] / 255, d[1] / 255, d[2] / 255] : fallback;
}

export function palette(ctx: MotionCtx): Palette {
  const dark = ctx.theme === 'dark';
  const bg = rgb(ctx.colors.bg, dark ? [0.1, 0.1, 0.1] : [0.96, 0.96, 0.95]);
  const ink = rgb(ctx.colors.ink, dark ? [0.93, 0.93, 0.92] : [0.14, 0.15, 0.14]);
  return {
    bg, ink,
    accent: rgb(ctx.colors.accent, ink),
    f1: rgb(ctx.colors.field1, bg),
    f2: rgb(ctx.colors.field2, bg),
    f3: rgb(ctx.colors.field3, ink),
  };
}

export function hostKind(host: HTMLElement): HostKind {
  if (host.classList.contains('hero-motion-host')) return 'full';
  if (host.hasAttribute('data-motion-root')) return 'page';
  return 'panel';
}

export function program(gl: WebGLRenderingContext, vs: string, fs: string): WebGLProgram {
  const p = gl.createProgram()!;
  for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]] as const) {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS) && !gl.isContextLost()) throw new Error('shader: ' + gl.getShaderInfoLog(s));
    gl.attachShader(p, s);
  }
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS) && !gl.isContextLost()) throw new Error('link: ' + gl.getProgramInfoLog(p));
  return p;
}

export function uniforms(gl: WebGLRenderingContext, p: WebGLProgram, names: string[]): Record<string, WebGLUniformLocation | null> {
  const u: Record<string, WebGLUniformLocation | null> = {};
  for (const n of names) u[n] = gl.getUniformLocation(p, n);
  return u;
}

/** A buffer holding one triangle that covers the viewport. */
export function cover(gl: WebGLRenderingContext): WebGLBuffer {
  const b = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  return b;
}

/** Source-over one colour into an unpremultiplied RGBA pixel. */
export function blend(img: Pixels, x: number, y: number, c: RGB, a: number) {
  if (x < 0 || y < 0 || x >= img.width || y >= img.height || a <= 0) return;
  const i = (y * img.width + x) * 4, d = img.data;
  const da = d[i + 3] / 255, oa = a + da * (1 - a);
  for (let k = 0; k < 3; k++) d[i + k] = ((c[k] * 255 * a + d[i + k] * da * (1 - a)) / oa);
  d[i + 3] = oa * 255;
}

const mixRGB = (a: RGB, b: RGB, k: number): RGB => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

const NOOP: MotionHandle = { pause() {}, resume() {}, update() {}, destroy() {} };

function canvasFor(host: HTMLElement, pixelated: boolean): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;left:0;top:0;display:block;pointer-events:none;opacity:0;transition:opacity .4s cubic-bezier(.23,1,.32,1)'
    + (pixelated ? ';image-rendering:pixelated' : '');
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
  return canvas;
}

/** Fit whole backing pixels inside the host: no overflow and no fractional cells. */
function fit(f: Frame, canvas: HTMLCanvasElement, host: HTMLElement, scene: Scene) {
  const r = host.getBoundingClientRect();
  const dpr = Math.max(1, devicePixelRatio || 1);
  const px = scene.scale(f.tier, dpr, Math.min(f.ctx.dprCap || 1.5, 1.5));
  const w = Math.max(1, Math.floor(r.width * px)), h = Math.max(1, Math.floor(r.height * px));
  f.px = px; f.w = w; f.h = h; f.cssW = w / px; f.cssH = h / px;
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  canvas.style.width = f.cssW + 'px';
  canvas.style.height = f.cssH + 'px';
}

/** CPU still for hosts without WebGL: the scene's composed frame, painted once per size or theme. */
function mountPoster(host: HTMLElement, ctx0: MotionCtx, scene: Scene, replace?: HTMLCanvasElement): MotionHandle {
  const canvas = canvasFor(host, true);
  const c2 = canvas.getContext('2d');
  if (!c2) return NOOP;
  const f: Frame = { kind: hostKind(host), w: 1, h: 1, cssW: 1, cssH: 1, px: 1, tier: 0, pal: palette(ctx0), ptr: { x: -1e4, y: -1e4, s: 0 }, ctx: ctx0 };
  if (replace) replace.replaceWith(canvas); else host.append(canvas);
  let visible = false, dirty = true, dead = false;
  const paint = () => {
    if (dead || !visible || !dirty) return;
    dirty = false;
    // the finest tier that keeps the one-off CPU paint short: at most 160k backing pixels
    for (f.tier = 0; ; f.tier++) { fit(f, canvas, host, scene); if (f.w * f.h <= 160_000 || f.tier >= scene.tiers - 1) break; }
    const img = c2.createImageData(f.w, f.h);
    scene.paint(img, f, scene.still);
    c2.putImageData(img, 0, 0);
    canvas.style.opacity = '1';
  };
  const io = new IntersectionObserver((e) => { visible = e.some((x) => x.isIntersecting); paint(); });
  io.observe(canvas);
  const ro = new ResizeObserver(() => { dirty = true; paint(); });
  ro.observe(host);
  return {
    pause() {}, resume() {},
    update(ctx) { f.ctx = ctx; f.pal = palette(ctx); dirty = true; paint(); },
    destroy() { dead = true; io.disconnect(); ro.disconnect(); canvas.remove(); },
  };
}

export function mountStage(host: HTMLElement, ctx0: MotionCtx, scene: Scene): MotionHandle {
  const canvas = canvasFor(host, !!scene.pixelated);
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false, powerPreference: 'low-power' });
  if (!gl) return mountPoster(host, ctx0, scene);
  host.append(canvas);

  let target = palette(ctx0);
  const s: Stage = { gl, canvas, host, kind: hostKind(host), w: 1, h: 1, cssW: 1, cssH: 1, px: 1, tier: 0, pal: target, ptr: { x: -1e4, y: -1e4, s: 0 }, ctx: ctx0 };
  let from = target, mixStart = 0, mixing = false;
  let t = scene.still, last = 0, lastDraw = 0, raf = 0, eased = 0;
  let paused = true, visible = false, dead = false, still = false, drawn = false;
  let poster: MotionHandle | undefined;
  let winStart = 0, winFrames = 0, lastTierChange = 0;
  const ptrTarget = { x: -1e4, y: -1e4, s: 0 }, ptrV = { x: 0, y: 0 };

  const size = () => { fit(s, canvas, host, scene); gl.viewport(0, 0, s.w, s.h); };
  const draw = (now: number) => {
    if (dead || poster) return;
    if (mixing) {
      const k = Math.min(1, (now - mixStart) / 300);
      s.pal = {
        bg: mixRGB(from.bg, target.bg, k), ink: mixRGB(from.ink, target.ink, k), accent: mixRGB(from.accent, target.accent, k),
        f1: mixRGB(from.f1, target.f1, k), f2: mixRGB(from.f2, target.f2, k), f3: mixRGB(from.f3, target.f3, k),
      };
      if (k >= 1) mixing = false;
    }
    scene.draw(s, t);
    if (!drawn) { drawn = true; canvas.style.opacity = '1'; }
  };
  const live = () => !dead && !poster && !paused && visible && !document.hidden && !s.ctx.reducedMotion && !still;

  const frame = (now: number) => {
    raf = 0;
    if (!live()) {
      // finish a palette ease even while still, then stop
      if (mixing && visible && !dead && !poster) { draw(now); raf = requestAnimationFrame(frame); }
      return;
    }
    raf = requestAnimationFrame(frame);
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    // Adaptive quality: sample the frame rate over 2 s; below 50 fps step down, 4 s apart.
    if (!winStart) winStart = now;
    winFrames++;
    if (now - winStart >= 2000) {
      const fps = (winFrames * 1000) / (now - winStart);
      winStart = now; winFrames = 0;
      if (fps < 50 && now - lastTierChange > 4000 && now - eased > 4000) {
        lastTierChange = now;
        if (s.tier < scene.tiers - 1) { s.tier++; size(); }
        else { still = true; draw(now); return; }
      }
    }
    // Pointer: critically damped spring toward the target; strength eases in and out.
    if (ptrTarget.s > 0 && s.ptr.s < 0.01) { s.ptr.x = ptrTarget.x; s.ptr.y = ptrTarget.y; ptrV.x = ptrV.y = 0; }
    const k = 120, c = 2 * Math.sqrt(k);
    ptrV.x += ((ptrTarget.x - s.ptr.x) * k - ptrV.x * c) * dt; s.ptr.x += ptrV.x * dt;
    ptrV.y += ((ptrTarget.y - s.ptr.y) * k - ptrV.y * c) * dt; s.ptr.y += ptrV.y * dt;
    s.ptr.s += (ptrTarget.s - s.ptr.s) * Math.min(1, dt * 5);
    t += dt;
    if (now - lastDraw >= 1000 / (scene.fps ?? 60) - 2) { lastDraw = now; draw(now); }
  };
  const kick = () => { if (!raf && (live() || mixing)) { last = 0; winStart = 0; winFrames = 0; raf = requestAnimationFrame(frame); } };
  const halt = () => { if (raf) cancelAnimationFrame(raf); raf = 0; };
  /** One composed frame when not looping (reduced motion, paused, quality floor), only while on screen. */
  const settle = () => {
    if (dead || poster || !visible || document.hidden) return;
    if (s.ctx.reducedMotion) { t = scene.still; s.ptr.s = 0; }
    requestAnimationFrame((now) => { if (!raf) draw(now); });
  };

  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const onMove = (e: PointerEvent) => {
    if (!fine.matches || e.pointerType !== 'mouse') return;
    const r = host.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    ptrTarget.x = x; ptrTarget.y = y;
    ptrTarget.s = x > -40 && y > -40 && x < r.width + 40 && y < r.height + 40 ? 1 : 0;
  };
  const onLeave = () => { ptrTarget.s = 0; };
  addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);

  const io = new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    if (visible) { if (!drawn || !live()) settle(); kick(); } else halt();
  });
  io.observe(canvas);
  const ro = new ResizeObserver(() => { if (dead || poster) return; size(); if (!raf) settle(); });
  ro.observe(host);
  const onVis = () => { if (document.hidden) halt(); else kick(); };
  document.addEventListener('visibilitychange', onVis);
  // A lost context falls back to the CPU still of the same composition.
  const onLost = (e: Event) => {
    e.preventDefault(); halt(); io.disconnect(); ro.disconnect();
    if (!dead && !poster) poster = mountPoster(host, s.ctx, scene, canvas);
  };
  canvas.addEventListener('webglcontextlost', onLost);

  scene.init(s);
  size();

  return {
    pause() { paused = true; halt(); if (!drawn) settle(); },
    resume() { paused = false; kick(); },
    update(ctx: MotionCtx) {
      if (poster) { poster.update(ctx); return; }
      const wasReduced = s.ctx.reducedMotion;
      s.ctx = ctx;
      const next = palette(ctx);
      if (ctx.reducedMotion || !drawn) { target = next; s.pal = next; mixing = false; }
      else { from = s.pal; target = next; mixStart = performance.now(); mixing = true; eased = mixStart; }
      if (ctx.reducedMotion) { halt(); settle(); }
      else if (wasReduced) { kick(); settle(); }
      else if (!raf) { if (mixing) kick(); else settle(); }
    },
    destroy() {
      dead = true; halt();
      io.disconnect(); ro.disconnect();
      poster?.destroy();
      document.removeEventListener('visibilitychange', onVis);
      removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('webglcontextlost', onLost);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    },
  };
}
