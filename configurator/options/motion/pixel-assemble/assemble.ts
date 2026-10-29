// Pixel assemble: once per load, a dithered cloud of mist pixels over the headline's own box
// condenses into the headline in a left-to-right wave, sharpens through one finer mosaic and
// hands over to the real text. About 0.7 s, then nothing runs at all.
// The h1 stays real text throughout: CSS holds it (fail-safe 700ms) while this canvas draws.
import type { MotionCtx, MotionHandle } from '../../../src/contract';
import { palette, parseColor, type RGB } from '../_motion-a/color';

const WAVE = 300, JITTER = 60, TRAVEL = 260, SHARPEN = 80, PRE = 120;
const inert: MotionHandle = { pause() {}, resume() {}, update() {}, destroy() {} };
const expo = (p: number) => (1 - 2 ** (-10 * p)) / (1 - 2 ** -10);
const pack = (c: RGB) => (255 << 24) | (Math.round(c[2] * 255) << 16) | (Math.round(c[1] * 255) << 8) | Math.round(c[0] * 255);

/** The title's glyph coverage, drawn where the layout put each character. */
interface Raster { alpha: ImageData; box: DOMRect }

/** Rasterises the title's glyphs in title-local CSS px at scale s. */
function rasterise(title: HTMLElement, s: number): Raster {
  const box = title.getBoundingClientRect();
  const off = document.createElement('canvas');
  off.width = Math.ceil(box.width * s) + 2;
  off.height = Math.ceil(box.height * s) + 2;
  const g = off.getContext('2d', { willReadFrequently: true })!;
  g.scale(s, s);
  g.textBaseline = 'alphabetic';
  const range = document.createRange();
  const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const cs = getComputedStyle(node.parentElement!);
    g.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const ascent = g.measureText('Hg').fontBoundingBoxAscent;
    const text = node.nodeValue ?? '';
    for (let i = 0; i < text.length; i++) {
      if (/\s/.test(text[i])) continue;
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const r = range.getBoundingClientRect();
      if (!r.width) continue;
      const ch = cs.textTransform === 'uppercase' ? text[i].toUpperCase() : cs.textTransform === 'lowercase' ? text[i].toLowerCase() : text[i];
      g.fillText(ch, r.left - box.left, r.top - box.top + ascent);
    }
  }
  return { alpha: g.getImageData(0, 0, off.width, off.height), box };
}

/** Grid cells (size c, origin at the hero's top-left) that the glyphs cover by half or more. */
function cells(raster: Raster, s: number, c: number, hero: DOMRect, cols: number, rows: number) {
  const { alpha, box } = raster;
  const ox = box.left - hero.left, oy = box.top - hero.top;
  const out: number[] = [];
  const x0 = Math.max(0, Math.floor(ox / c)), x1 = Math.min(cols, Math.ceil((ox + box.width) / c));
  const y0 = Math.max(0, Math.floor(oy / c)), y1 = Math.min(rows, Math.ceil((oy + box.height) / c));
  for (let gy = y0; gy < y1; gy++) {
    for (let gx = x0; gx < x1; gx++) {
      let sum = 0, n = 0;
      for (let py = Math.round((gy * c - oy) * s); py < Math.round(((gy + 1) * c - oy) * s); py++) {
        for (let px = Math.round((gx * c - ox) * s); px < Math.round(((gx + 1) * c - ox) * s); px++) {
          n++;
          if (px >= 0 && py >= 0 && px < alpha.width && py < alpha.height) sum += alpha.data[(py * alpha.width + px) * 4 + 3];
        }
      }
      if (n && sum / n >= 127) out.push(gx, gy);
    }
  }
  return out;
}

export function mount(_host: HTMLElement, ctx: MotionCtx): MotionHandle {
  const hero = document.querySelector<HTMLElement>('[data-hero-root]');
  const title = hero?.querySelector<HTMLElement>('.hero-title');
  if (!hero || !title || ctx.reducedMotion || document.documentElement.dataset.paused === '1') return inert;
  const hold = title.getAnimations().find((a) => a instanceof CSSAnimation && a.animationName === 'ma-pa-hold');
  if (!hold || hold.playState !== 'running') return inert;

  // The canvas covers the hero from the first moment, so the renderer can follow it for visibility.
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.width = canvas.height = 1;
  const first = hero.getBoundingClientRect();
  canvas.style.cssText = `position:absolute;left:0;top:0;width:${first.width}px;height:${first.height}px;pointer-events:none;image-rendering:pixelated;z-index:1`;
  hero.append(canvas);
  let state: 'waiting' | 'running' | 'done' = 'waiting', raf = 0;
  const startY = scrollY;

  const finish = () => {
    if (state === 'done') return;
    const wasRunning = state === 'running';
    state = 'done';
    cancelAnimationFrame(raf);
    removeEventListener('scroll', onScroll);
    removeEventListener('resize', finish);
    canvas.remove();
    if (wasRunning) title.dataset.maPa = 'done';
  };
  const onScroll = () => { if (Math.abs(scrollY - startY) > 4) finish(); };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', finish);

  // Start once the faces are in (or after 300ms, whichever comes first).
  const run = () => {
    if (state !== 'waiting') return;
    // Too late: the CSS fail-safe is about to show the headline, so let it.
    if (hold.playState !== 'running' || Number(hold.currentTime) > 450) return finish();
    const fontSize = parseFloat(getComputedStyle(title).fontSize);
    const c = fontSize >= 48 ? 4 : 2;
    const box = hero.getBoundingClientRect();
    const cols = Math.floor(box.width / c), rows = Math.floor(box.height / c);
    const raster = rasterise(title, 2);
    const coarse = cells(raster, 2, c, box, cols, rows);
    const fine = c >= 4 ? cells(raster, 2, c / 2, box, cols * 2, rows * 2) : null;
    if (!coarse.length) return finish();

    const pal = palette(ctx, hero);
    const ink = pack(parseColor(getComputedStyle(title).color, title, pal.ink));
    const mist = pack(pal.f2);
    const dpr = devicePixelRatio || 1;
    canvas.width = cols; canvas.height = rows;
    canvas.style.width = `${cols * c}px`;
    canvas.style.height = `${rows * c}px`;
    canvas.style.transform = `translate(${Math.round(box.left * dpr) / dpr - box.left}px,${Math.round(box.top * dpr) / dpr - box.top}px)`;
    const g = canvas.getContext('2d')!;
    let img = new ImageData(cols, rows);
    let px = new Uint32Array(img.data.buffer);

    // Each pixel starts somewhere in a loose cloud over its own letter and leaves on a wave.
    const n = coarse.length / 2;
    let minX = Infinity, maxX = -Infinity;
    for (let i = 0; i < n; i++) { minX = Math.min(minX, coarse[i * 2]); maxX = Math.max(maxX, coarse[i * 2]); }
    const sx = new Int16Array(n), sy = new Int16Array(n), delay = new Float32Array(n), seen = new Float32Array(n);
    const spread = Math.max(3, Math.round(fontSize / c / 4));
    for (let i = 0; i < n; i++) {
      const gx = coarse[i * 2], gy = coarse[i * 2 + 1];
      sx[i] = Math.min(cols - 1, Math.max(0, gx + Math.round((Math.random() + Math.random() - 1) * spread * 2)));
      sy[i] = Math.min(rows - 1, Math.max(0, gy + Math.round((Math.random() + Math.random() - 1) * spread)));
      delay[i] = PRE + (WAVE * (gx - minX)) / Math.max(1, maxX - minX) + Math.random() * JITTER;
      seen[i] = Math.random() * PRE;
    }
    const landed = PRE + WAVE + JITTER + TRAVEL;
    title.dataset.maPa = 'run';
    state = 'running';
    const t0 = performance.now();

    const frame = (now: number) => {
      if (state !== 'running') return;
      const t = now - t0;
      if (t >= landed + SHARPEN * (fine ? 2 : 1)) return finish();
      if (fine && t >= landed + SHARPEN) {
        // One finer mosaic in ink, then the real glyphs.
        if (canvas.width !== cols * 2) {
          canvas.width = cols * 2; canvas.height = rows * 2;
          img = new ImageData(cols * 2, rows * 2);
          px = new Uint32Array(img.data.buffer);
          for (let i = 0; i < fine.length; i += 2) px[fine[i + 1] * cols * 2 + fine[i]] = ink;
          g.putImageData(img, 0, 0);
        }
      } else {
        px.fill(0);
        for (let i = 0; i < n; i++) {
          if (t < seen[i]) continue;
          const p = Math.min(1, Math.max(0, (t - delay[i]) / TRAVEL));
          const e = expo(p);
          const x = Math.round(sx[i] + (coarse[i * 2] - sx[i]) * e), y = Math.round(sy[i] + (coarse[i * 2 + 1] - sy[i]) * e);
          px[y * cols + x] = p >= 1 ? ink : mist;
        }
        g.putImageData(img, 0, 0);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
  };
  void document.fonts.ready.then(run);
  setTimeout(run, 300);

  return {
    pause: finish,
    resume() {},
    update(next) { if (next.reducedMotion || next.theme !== ctx.theme) finish(); },
    destroy: finish,
  };
}
