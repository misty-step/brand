import type { MotionOption } from '../../../src/contract';
import { focal, focalOrder, live } from '../_motion-a/entrance';
import { interactionCss } from '../_motion-a/interaction';

const S = 'html[data-motion="dither-mist"]';
// 4x4 Bayer order; each step uncovers four more 2px cells of every 8px tile (25, 50, 75%).
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const tile = (k: number) => {
  const cells = BAYER.map((v, i) => (v < k * 4 ? `<rect x='${(i % 4) * 2}' y='${Math.floor(i / 4) * 2}' width='2' height='2'/>` : '')).join('');
  return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8' shape-rendering='crispEdges'>${cells}</svg>`)}")`;
};

// The focal pieces land the way the field is drawn: through four ordered-dither cuts, 80ms each.
const css = `
@keyframes ma-dm-land{0%{opacity:0}25%{opacity:1;mask-image:${tile(1)}}50%{mask-image:${tile(2)}}75%{mask-image:${tile(3)}}100%{mask-image:none}}
${focalOrder(S)}
${focal(S)}{mask-size:8px 8px;mask-repeat:repeat}
${focal(live('dither-mist'))}{animation:ma-dm-land 320ms steps(1,end) backwards;animation-delay:calc(min(var(--ma-i),4) * 70ms)}`;

export default {
  id: 'dither-mist',
  layer: 'motion',
  label: 'Dither mist',
  summary: 'Low fog drawn in two field inks through an 8x8 Bayer dither, drifting without a period and parting around a fine pointer; the headline lands through the same four dither steps. Mist, for a studio named after a step through it.',
  origin: 'A',
  renderer: 'webgl',
  refs: [
    { name: 'Omarchy', url: 'https://omarchy.org/', what: 'A pixel-cell field on one strict grid that thickens toward the bottom edge and pauses offscreen. Here the cells are dither, not noise, and they keep clear of the text.' },
    { name: 'Nous Research', url: 'https://nousresearch.com/', what: 'Dither as a two-ink material over a quiet ground: the texture carries the brand while the inks stay within the palette.' },
    { name: 'Earendil', url: 'https://earendil.com/', what: 'A living backdrop rendered at a fraction of CSS resolution with adaptive quality, so it gets out of the way of the sentence. This field runs at 0.25x with three tiers.' },
    { name: 'Ordered dithering', url: 'https://en.wikipedia.org/wiki/Ordered_dithering', what: 'The 8x8 Bayer threshold matrix: fog quantised to two inks with a regular, crisp pattern instead of random grain.' },
  ],
  background: { load: () => import('./field') },
  entrance: { css },
  interaction: { css: interactionCss('dither-mist', 'pixel') },
  budget: {
    gzipKB: 8.0,
    frameMs: 'GPU draw: pending conductor (no browser allowed on this Mac; bench at /options/motion/_motion-a/bench.html). CPU still, once: 1.7 ms (358x220 panel) to 16.9 ms (1440x820 full), painted in idle slices of at most 8 ms',
    note: 'Measured: 8.0 KB gzip (2.0 option + 6.0 lazy field incl. runtime), vite build; CPU still timed in JavaScriptCore on this Mac. Raw WebGL1, one fullscreen triangle, one cell = 4 CSS px at any DPR (0.25x backing store, under the 1.5 cap). Tiers 5/4/3 octaves at 24/15/10 fps, 2 s frame-rate sampling, still below the last tier. Reduced motion, Save-Data, no WebGL and context loss draw the same composition on the CPU with no GPU context. Shaders validated with glslang (ESSL 1.00).',
  },
} satisfies MotionOption & { renderer: 'webgl' | 'canvas2d' | 'none' };
