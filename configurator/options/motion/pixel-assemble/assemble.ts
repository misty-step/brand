// Pixel assemble: once per load, a dithered cloud of mist pixels over the headline's own box
// condenses into the headline in a left-to-right wave, sharpens through one finer mosaic and
// hands over to the real text. About 0.6 s, then nothing runs at all.
//
// Timing contract (the h1 stays real text throughout):
// - CSS alone holds the h1 for at most 700ms, so it appears even if this script never arrives.
// - The assembly starts only if it can begin within 300ms of that hold starting; otherwise the
//   hold is released and the headline shows at once.
// - A started assembly stretches the hold to its own end, never later than 900ms after the hold
//   began. The reveal is that hold ending (a compositor animation), so the h1 appears on time
//   even when this script's frames stall; the canvas fades out on the same clock.
// - Nothing here ever hides a headline: the script only shortens or extends a hold that is
//   already running.
import type { MotionCtx, MotionHandle } from '../../../src/contract';
import { palette, parseColor, type RGB } from '../_motion-a/color';

const START_BY = 300, VISIBLE_BY = 900, PLANNED = 600, MIN_RUN = 450;
// Phase lengths for the planned 600ms run; a late start scales them all down together.
const PRE = 60, WAVE = 200, JITTER = 40, TRAVEL = 200, SHARPEN = 50;
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
  // Only a hold that is still running can be taken over; anything else means the h1 already shows.
  const hold = title.getAnimations().find((a) => a instanceof CSSAnimation && a.animationName === 'ma-pa-hold');
  if (!hold || hold.playState !== 'running') return inert;
  /** ms since the hold began; Infinity once it no longer hides the h1. */
  const elapsed = () => (hold.playState === 'running' && typeof hold.currentTime === 'number' ? hold.currentTime : Infinity);
  // Released holds show the headline at once: [data-ma-pa] drops the hold animation in CSS.
  const release = () => { title.dataset.maPa = 'done'; };
  if (elapsed() > START_BY) { release(); return inert; }

  // The canvas covers the hero from the first moment, so the renderer can follow it for visibility.
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.width = canvas.height = 1;
  const first = hero.getBoundingClientRect();
  canvas.style.cssText = `position:absolute;left:0;top:0;width:${first.width}px;height:${first.height}px;pointer-events:none;image-rendering:pixelated;z-index:1`;
  hero.append(canvas);
  let state: 'waiting' | 'running' | 'done' = 'waiting', raf = 0, timer = 0;
  const startY = scrollY;

  // Ends everything at once: the canvas goes, the hold goes, the real headline shows.
  const finish = () => {
    if (state === 'done') return;
    state = 'done';
    cancelAnimationFrame(raf);
    clearTimeout(timer);
    removeEventListener('scroll', onScroll);
    removeEventListener('resize', finish);
    canvas.remove();
    release();
  };
  const onScroll = () => { if (Math.abs(scrollY - startY) > 4) finish(); };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', finish);

  // Starts once the faces are in, but only inside the start window.
  const run = () => {
    if (state !== 'waiting') return;
    if (elapsed() > START_BY) return finish();
    const fontSize = parseFloat(getComputedStyle(title).fontSize);
    const c = fontSize >= 48 ? 4 : 2;
    const box = hero.getBoundingClientRect();
    const cols = Math.floor(box.width / c), rows = Math.floor(box.height / c);
    const raster = rasterise(title, 2);
    const coarse = cells(raster, 2, c, box, cols, rows);
    const fine = c >= 4 ? cells(raster, 2, c / 2, box, cols * 2, rows * 2) : null;
    // Rasterising can be slow on a loaded machine: fit the run before VISIBLE_BY or skip it.
    const at = elapsed();
    const total = Math.min(PLANNED, VISIBLE_BY - at);
    if (!coarse.length || !(total >= MIN_RUN)) return finish();
    const k = total / PLANNED;
    // The hold now ends exactly when the assembly does, so the reveal never waits on our frames.
    hold.effect?.updateTiming({ duration: at + total });

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
      delay[i] = (PRE + (WAVE * (gx - minX)) / Math.max(1, maxX - minX) + Math.random() * JITTER) * k;
      seen[i] = Math.random() * PRE * k;
    }
    const travel = TRAVEL * k, sharpenAt = (PRE + WAVE + JITTER + TRAVEL + SHARPEN) * k;
    state = 'running';
    clearTimeout(timer);
    // Backstops when frames stall: the canvas fades on the compositor at the end, a timer cleans up.
    canvas.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1, delay: total, fill: 'forwards' });
    timer = window.setTimeout(finish, total + 40);
    const t0 = performance.now();

    const frame = (now: number) => {
      if (state !== 'running') return;
      const t = now - t0;
      if (t >= total) return finish();
      if (fine && t >= sharpenAt) {
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
          const p = Math.min(1, Math.max(0, (t - delay[i]) / travel));
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
  // Faces not in by the end of the start window: let the headline show as it is.
  timer = window.setTimeout(() => { if (state === 'waiting') finish(); }, Math.max(0, START_BY - elapsed()));

  return {
    pause: finish,
    resume() {},
    update(next) { if (next.reducedMotion || next.theme !== ctx.theme) finish(); },
    destroy: finish,
  };
}
