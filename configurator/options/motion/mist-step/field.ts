// Mist step: the spell, as page navigation. "Briefly surrounded by silvery mist, you teleport up to
// 30 feet to an unoccupied space that you can see." An in-page link no longer scrolls: pixel mist
// gathers over the viewport in 180 ms, the page jumps while it is covered, and the mist clears at
// the destination in 320 ms, rising as it goes. The hero keeps a still bank of the same mist, which
// clears once on arrival. Canvas 2D at 4 to 6 CSS px per cell: no WebGL context, nothing loops.
import type { MotionCtx, MotionHandle } from '../../../src/contract';
import { blend, composeAroundCopy, hostKind, observeLayout, palette, type Frame, type Palette, type Pixels, type RGB } from '../_motionb/stage';

const BANK_CELL = 4;       // CSS px per mist cell in the hero bank
const VEIL_CELL = 6;       // CSS px per mist cell in the viewport veil
const IN = 180, OUT = 320, ARRIVE = 640; // ms
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

const fract = (x: number) => x - Math.floor(x);
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
/** Mist density 0..1 at a point measured in cells, three octaves of value noise. */
function mist(x: number, y: number) {
  return 0.55 * noise(x / 22, y / 14) + 0.3 * noise(x / 9 + 17.3, y / 6 + 4.1) + 0.15 * noise(x / 4 + 3.7, y / 3 + 9.2);
}

/**
 * Density of the hero's mist bank per cell: thick on its floor, ragged on top, Bayer-dithered. The
 * floor is the host's lower edge, or the foot of the strip the hero copy leaves clear, so the copy
 * stands on clear ground; outside that strip the bank thins away sideways.
 */
export function bankField(f: Frame): Float32Array {
  const d = new Float32Array(f.w * f.h), b = f.band, k = f.px; // cells per CSS px
  const floor = b ? Math.min(f.h, (b.y + b.h) * k - 2) : f.h;
  const top = b ? (b.y + b.h * 0.3) * k : f.h * (f.kind === 'panel' ? 0.42 : 0.62);
  const x0 = b ? b.x * k : 0, x1 = b ? (b.x + b.w) * k : f.w, soft = Math.max(4, (x1 - x0) * 0.15);
  for (let y = 0; y < f.h; y++) {
    const g = Math.min(1, Math.max(0, (y - top) / Math.max(1, floor - top))), rise = g * g * (3 - 2 * g);
    const under = y > floor ? Math.max(0, 1 - (y - floor) / 6) : 1; // clear within 6 cells below the floor
    for (let x = 0; x < f.w; x++) {
      const side = Math.min(1, Math.max(0, Math.min(x - x0, x1 - x) / soft + 1));
      d[y * f.w + x] = (mist(x, y) * 0.6 + rise * 0.62) * under * side + BAYER[(y & 3) * 4 + (x & 3)] * 0.22;
    }
  }
  return d;
}

/**
 * The bank in two field tones. `cover` 0 is the resting bank; 1 hides the whole host (the arrival
 * starts there). Light palettes keep their fields closer to the ground than dark ones, so the light
 * bank uses the two stronger tones to read as clearly as the dark one.
 */
export function paintBank(img: Pixels, f: Frame, d: Float32Array, cover: number) {
  const edge = 0.78 - cover * 1.1, p = f.pal;
  const [thin, dense] = f.ctx.theme === 'light' ? [p.f2, p.f3] : [p.f1, p.f2];
  for (let i = 0; i < d.length; i++) {
    if (d[i] <= edge) continue;
    blend(img, i % f.w, Math.floor(i / f.w), d[i] > edge + 0.3 ? dense : thin, 1);
  }
}

/** Veil threshold per cell, with `extra` rows below the viewport for the mist to rise through. */
export function veilField(w: number, h: number, extra: number): Float32Array {
  const v = new Float32Array(w * (h + extra));
  for (let y = 0; y < h + extra; y++) for (let x = 0; x < w; x++) v[y * w + x] = mist(x * 0.75, y * 0.75) * 0.66 + BAYER[(y & 3) * 4 + (x & 3)] * 0.34;
  return v;
}

/** The veil at coverage c (0 clear, 1 covered); `rise` whole rows lift the mist as it clears. */
export function paintVeil(img: Pixels, v: Float32Array, p: Palette, c: number, rise: number) {
  const w = img.width;
  for (let y = 0; y < img.height; y++) for (let x = 0; x < w; x++) {
    const t = v[(y + rise) * w + x], i = (y * w + x) * 4;
    if (t >= c) { img.data[i + 3] = 0; continue; }
    const col: RGB = t < c - 0.38 ? p.f2 : p.f1;
    img.data[i] = col[0] * 255; img.data[i + 1] = col[1] * 255; img.data[i + 2] = col[2] * 255; img.data[i + 3] = 255;
  }
}

const easeOut = (x: number) => 1 - (1 - Math.min(1, Math.max(0, x))) ** 3;

export function mount(host: HTMLElement, ctx0: MotionCtx): MotionHandle {
  let ctx = ctx0, pal = palette(ctx0), dead = false, visible = false, dirty = true, arrival = ctx0.reducedMotion ? 1 : 0, arrivalStart = 0, raf = 0;
  const root = document.documentElement;

  // the bank
  const bank = document.createElement('canvas');
  bank.setAttribute('aria-hidden', 'true');
  bank.style.cssText = 'position:absolute;left:0;top:0;display:block;pointer-events:none;image-rendering:pixelated';
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
  host.append(bank);
  const b2 = bank.getContext('2d');
  const f: Frame = { kind: hostKind(host), w: 1, h: 1, cssW: 1, cssH: 1, px: 1 / BANK_CELL, tier: 0, pal, ptr: { x: 0, y: 0, s: 0 }, ctx, band: null };
  let density: Float32Array = new Float32Array(0), relayout = true;
  const drawBank = (cover: number) => {
    if (!b2 || dead) return;
    const r = host.getBoundingClientRect();
    const w = Math.max(1, Math.floor(r.width / BANK_CELL)), h = Math.max(1, Math.floor(r.height / BANK_CELL));
    f.pal = pal; f.ctx = ctx;
    if (relayout || w !== f.w || h !== f.h) {
      relayout = false;
      f.w = w; f.h = h; f.cssW = w * BANK_CELL; f.cssH = h * BANK_CELL;
      composeAroundCopy(f, host, bank);
      bank.width = w; bank.height = h;
      bank.style.width = f.cssW + 'px'; bank.style.height = f.cssH + 'px';
      density = bankField(f);
    }
    const img = b2.createImageData(w, h);
    paintBank(img, f, density, cover);
    b2.putImageData(img, 0, 0);
  };
  // The arrival: the bank starts as a full cover and settles once, then the host is still.
  const settle = (now: number) => {
    raf = 0;
    if (dead) return;
    if (!arrivalStart) arrivalStart = now;
    arrival = Math.min(1, (now - arrivalStart) / ARRIVE);
    drawBank(1 - easeOut(arrival));
    if (arrival < 1) raf = requestAnimationFrame(settle);
  };
  const show = () => {
    if (dead || !visible) return;
    if (arrival < 1 && !raf && !ctx.reducedMotion && root.dataset.paused !== '1') { raf = requestAnimationFrame(settle); return; }
    if (arrival < 1) arrival = 1;
    if (dirty && !raf) { dirty = false; drawBank(0); }
  };
  const io = new IntersectionObserver((e) => { visible = e.some((x) => x.isIntersecting); show(); });
  io.observe(bank);
  const ro = new ResizeObserver(() => { dirty = true; relayout = true; show(); });
  observeLayout(ro, host);

  // the step
  let veil: HTMLCanvasElement | null = null, stepRaf = 0, pending: HTMLElement | null = null, jumped = false;
  const land = (target: HTMLElement) => {
    target.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
    const heading = target.matches('h1, h2') ? target : target.querySelector<HTMLElement>('h2, h1');
    if (heading) {
      if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  };
  const step = (target: HTMLElement) => {
    pending = target;
    if (veil) { if (jumped) land(target); return; } // already stepping: land on the latest choice
    veil = document.createElement('canvas');
    veil.setAttribute('aria-hidden', 'true');
    const w = Math.ceil(innerWidth / VEIL_CELL), h = Math.ceil(innerHeight / VEIL_CELL);
    veil.width = w; veil.height = h;
    veil.style.cssText = `position:fixed;left:0;top:0;width:${w * VEIL_CELL}px;height:${h * VEIL_CELL}px;z-index:40;pointer-events:none;image-rendering:pixelated`;
    document.body.append(veil);
    const v2 = veil.getContext('2d')!, img = v2.createImageData(w, h), field = veilField(w, h, 10);
    let start = 0;
    jumped = false;
    const frame = (now: number) => {
      if (dead || !veil) return;
      if (!start) start = now;
      const e = now - start;
      let c: number, rise = 0;
      if (e < IN) c = 1.05 * easeOut(e / IN);
      else {
        if (!jumped && pending) { jumped = true; land(pending); }
        const k = (e - IN) / OUT;
        c = 1.05 * (1 - easeOut(k)); rise = Math.round(10 * easeOut(k));
      }
      paintVeil(img, field, pal, c, rise);
      v2.putImageData(img, 0, 0);
      if (e < IN + OUT) stepRaf = requestAnimationFrame(frame);
      else { veil.remove(); veil = null; stepRaf = 0; pending = null; }
    };
    stepRaf = requestAnimationFrame(frame);
  };
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
    if (!a || a.matches('.skip')) return;
    const target = document.getElementById(a.getAttribute('href')!.slice(1));
    // Reduced motion, paused motion, or a destination already on screen: the renderer's instant jump.
    if (!target || ctx.reducedMotion || root.dataset.reducedMotion === '1' || root.dataset.paused === '1') return;
    const dist = target === document.body ? scrollY : Math.abs(target.getBoundingClientRect().top);
    if (dist < innerHeight * 0.4) return;
    e.preventDefault();
    e.stopPropagation();
    step(target);
  };
  document.addEventListener('click', onClick, true);

  return {
    pause() { if (raf) { cancelAnimationFrame(raf); raf = 0; } if (arrival < 1) { arrival = 1; dirty = true; show(); } },
    resume() { show(); },
    update(next) {
      ctx = next; pal = palette(next); dirty = true;
      if (next.reducedMotion) { if (raf) cancelAnimationFrame(raf); raf = 0; arrival = 1; }
      show();
    },
    destroy() {
      dead = true;
      if (raf) cancelAnimationFrame(raf);
      if (stepRaf) cancelAnimationFrame(stepRaf);
      io.disconnect(); ro.disconnect();
      document.removeEventListener('click', onClick, true);
      veil?.remove(); bank.remove();
    },
  };
}
