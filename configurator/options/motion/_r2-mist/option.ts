// Shared by the r2-mist-* motion options: the Tune panel's params, each variant's fixed look, the
// hero entrances and the option factory. The field itself (engine.ts) loads lazily after first paint.
import type { MotionOption, MotionParam, Ref } from '../../../src/contract';
import { focal, focalOrder, live } from '../_motion-a/entrance';
import { interactionCss } from '../_motion-a/interaction';

export const SCREENS = ['Blue noise', 'Bayer 8', 'Bayer 4', 'Halftone', 'Line screen', 'Stipple'];
export type Key = 'screen' | 'cell' | 'inks' | 'density' | 'height' | 'depth' | 'wind' | 'turbulence' | 'travel' | 'step';
export type Values = Record<Key, number>;

const PARAMS: (Omit<MotionParam, 'value'> & { key: Key })[] = [
  { key: 'screen', label: 'Screen', min: 0, max: 5, step: 1, options: SCREENS },
  { key: 'cell', label: 'Cell (CSS px)', min: 2, max: 6, step: 1 },
  { key: 'inks', label: 'Inks', min: 1, max: 3, step: 1 },
  { key: 'density', label: 'Density', min: 0, max: 1, step: 0.05 },
  { key: 'height', label: 'Fog height', min: 0.2, max: 0.8, step: 0.02 },
  { key: 'depth', label: 'Ink depth', min: 0, max: 1, step: 0.05 },
  { key: 'wind', label: 'Wind', min: 0, max: 2, step: 0.05 },
  { key: 'turbulence', label: 'Turbulence', min: 0, max: 1, step: 0.05 },
  { key: 'travel', label: 'Pattern travels with mist', min: 0, max: 1, step: 0.05 },
  { key: 'step', label: 'Misty step', min: 0, max: 1, step: 0.05 },
];

/** What a variant fixes beyond its tunable defaults. */
export interface Look {
  entrance: 'clear' | 'dots' | 'lines' | 'drift' | 'step';
  wake: number;    // how far a fine pointer parts the mist, 0..1
  lift: number;    // how much scrolling the hero away lifts and thins it, 0..1
  feather: number; // edge softness of the banks: 0.6 crisp .. 1.6 soft
  wisps: number;   // strands rising off the mid and near banks, 0..1
  horizon: number; // coverage of the one-cell horizon line, 0 = none
}

/**
 * Void-and-cluster threshold ranks (Ulichney 1993) on an n x n torus: every cell's rank spreads
 * the cells evenly at every threshold, so the screen has no cross-hatch. Deterministic seed.
 * Returns thresholds 0..255. A generator that yields every 64 placements, so a caller can spread
 * the 64 x 64 screen (about 25 ms of work on a fast laptop) across idle slices.
 */
export function* blueNoise(n: number, sigma: number): Generator<void, Uint8Array, void> {
  const N = n * n, R = Math.min(n >> 1, Math.ceil(sigma * 3)), w = 2 * R + 1;
  const kern = new Float32Array(w * w);
  for (let y = -R, k = 0; y <= R; y++) for (let x = -R; x <= R; x++) kern[k++] = Math.exp(-(x * x + y * y) / (2 * sigma * sigma));
  const E = new Float32Array(N), on = new Uint8Array(N), rank = new Uint16Array(N);
  const splat = (i: number, s: number) => {
    const x0 = i % n, y0 = (i / n) | 0;
    for (let y = -R, k = 0; y <= R; y++) {
      const row = ((y0 + y + n) % n) * n;
      for (let x = -R; x <= R; x++) E[row + ((x0 + x + n) % n)] += s * kern[k++];
    }
  };
  // tightest cluster among the ones (want 1, sign 1) or largest void among the zeros (want 0, sign -1)
  const pick = (want: number, sign: number) => {
    let best = 0, bv = -Infinity;
    for (let i = 0; i < N; i++) if (on[i] === want && sign * E[i] > bv) { bv = sign * E[i]; best = i; }
    return best;
  };
  let seed = 0x9e3779b9;
  const rnd = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return (seed >>> 0) / 4294967296; };
  const m = Math.max(1, (N / 10) | 0);
  for (let c = 0; c < m;) { const i = (rnd() * N) | 0; if (!on[i]) { on[i] = 1; splat(i, 1); c++; } }
  for (let it = 0; it < 4 * m; it++) {
    const a = pick(1, 1); on[a] = 0; splat(a, -1);
    const b = pick(0, -1); on[b] = 1; splat(b, 1);
    if (a === b) break;
    if (!(it & 31)) yield;
  }
  const on0 = on.slice(), E0 = E.slice();
  for (let r = m - 1; r >= 0; r--) { const a = pick(1, 1); on[a] = 0; splat(a, -1); rank[a] = r; if (!(r & 63)) yield; }
  on.set(on0); E.set(E0);
  for (let r = m; r < N; r++) { const b = pick(0, -1); on[b] = 1; splat(b, 1); rank[b] = r; if (!(r & 63)) yield; }
  return Uint8Array.from(rank, (r) => Math.floor((r * 256) / N));
}

// Entrance masks: the same blue-noise order on an 8 x 8 tile of 2 px cells (16 px), so the hero's
// words resolve out of mist cells rather than a Bayer cross-hatch.
const vac8 = blueNoise(8, 1.5);
let done = vac8.next();
while (!done.done) done = vac8.next();
const RANK8 = done.value;
const tile = (k: number, of: number) => {
  let cells = '';
  RANK8.forEach((r, i) => { if (r < (256 * k) / of) cells += `M${(i % 8) * 2} ${(i >> 3) * 2}h2v2h-2z`; });
  return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' shape-rendering='crispEdges'><path d='${cells || 'M0 0'}'/></svg>`)}")`;
};

/** Hero entrance, timed by CSS from render; every focal piece is final by 700 ms at the latest. */
function entranceCss(id: string, kind: Look['entrance']): string {
  const s = `html[data-motion="${id}"]`, on = focal(live(id)), name = `r2m-${id}`;
  const order = `${focalOrder(s)}\n`;
  switch (kind) {
    // Mist clears: five blue-noise steps of 80 ms, 60 ms apart (final by 400 + 3 x 60 = 580 ms).
    case 'clear':
      return `${order}@keyframes ${name}{${Array.from({ length: 5 }, (_, i) => `${i * 20}%{mask-image:${tile(i, 5)}}`).join('')}100%{mask-image:none}}
${on}{mask-size:16px 16px;animation:${name} 400ms steps(1,end) backwards;animation-delay:calc(min(var(--ma-i),3) * 60ms)}`;
    // The same cells drift in from the left while they fill (final by 440 + 3 x 60 = 620 ms).
    case 'drift':
      return `${order}@keyframes ${name}{${Array.from({ length: 5 }, (_, i) => `${i * 20}%{mask-image:${tile(i, 5)};mask-position:${12 - i * 3}px 0}`).join('')}100%{mask-image:none}}
${on}{mask-size:16px 16px;animation:${name} 440ms steps(1,end) backwards;animation-delay:calc(min(var(--ma-i),3) * 60ms)}`;
    // Halftone dots grow on a 6 px screen until they merge (final by 420 + 3 x 60 = 600 ms).
    case 'dots':
      return `${order}@property --r2m-r{syntax:'<length>';inherits:false;initial-value:5px}
@keyframes ${name}{0%{--r2m-r:0px}100%{--r2m-r:5px}}
${on}{mask-image:radial-gradient(circle,#000 var(--r2m-r),transparent calc(var(--r2m-r) + .5px));mask-size:6px 6px;animation:${name} 420ms steps(6,end) both;animation-delay:calc(min(var(--ma-i),3) * 60ms)}`;
    // A line screen thickens until the words are solid (final by 360 + 3 x 60 = 540 ms).
    case 'lines':
      return `${order}@property --r2m-t{syntax:'<length>';inherits:false;initial-value:6px}
@keyframes ${name}{0%{--r2m-t:0px}100%{--r2m-t:6px}}
${on}{mask-image:repeating-linear-gradient(#000 0 var(--r2m-t),transparent var(--r2m-t) 6px);animation:${name} 360ms steps(4,end) both;animation-delay:calc(min(var(--ma-i),3) * 60ms)}`;
    // A misty step: the words gather 12 px short of their place, vanish, and land (final by 520 + 3 x 50 = 670 ms).
    case 'step':
      return `${order}@keyframes ${name}{0%{mask-image:${tile(0, 5)};translate:-12px 0}12%{mask-image:${tile(1, 5)}}24%{mask-image:${tile(2, 5)}}36%{mask-image:${tile(3, 5)}}48%{mask-image:${tile(1, 5)}}56%{mask-image:${tile(0, 5)};translate:0 0}64%{mask-image:${tile(2, 5)}}80%{mask-image:${tile(4, 5)}}100%{mask-image:none;translate:0 0}}
${on}{mask-size:16px 16px;animation:${name} 520ms steps(1,end) backwards;animation-delay:calc(min(var(--ma-i),3) * 50ms)}`;
  }
}

export interface Variant { id: string; label: string; summary: string; refs: Ref[]; values: Values; look: Look }

// One engine serves every variant, so they share one measured budget.
const BUDGET: MotionOption['budget'] = {
  gzipKB: 11,
  frameMs: 'SwiftShader (software GL on a Linux Boat worker, no GPU), 1440x900 hero, one draw plus a 1 px readback over 120 frames: Ground fog (3 px cells, 480x268) median 17.3 to 21.3 ms, p95 20.7 to 24.6 ms; the 2 px variants (720x402) median 31 to 46 ms. GPU timing on a Mac is pending (no browser may run on this one). Draws are capped at 30 fps and step down to 20 and 12 fps when the page drops below 45 fps, then hold the frame.',
  note: 'Measured, vite production chunks at gzip -9: 3.7 KB load with the option (variant 0.9, shared option 2.0, MotionA entrance and interaction 0.8) and 7.5 KB load lazily after first paint (engine 6.8, colour helper 0.8). Raw WebGL1, one fullscreen triangle, one canvas pixel per 2 to 6 CSS px. Blue noise is made by void-and-cluster in idle slices of at most 6 ms (about 25 ms of work in Node on this Mac). Reduced motion draws one finished frame and stops.',
};

export function mistOption(o: Variant): MotionOption {
  const params: MotionParam[] = PARAMS.map((p) => ({ ...p, value: o.values[p.key] }));
  return {
    id: o.id, layer: 'motion', label: o.label, summary: o.summary, refs: o.refs, origin: 'r2', renderer: 'webgl',
    params,
    // Lazy chunk by contract: the WebGL field never loads on the critical path.
    background: { load: async () => { const { mount } = await import('./engine'); return { mount: (host, ctx) => mount(host, ctx, params, o.look) }; } },
    entrance: { css: entranceCss(o.id, o.look.entrance) },
    interaction: { css: interactionCss(o.id, 'pixel') },
    budget: BUDGET,
  };
}
