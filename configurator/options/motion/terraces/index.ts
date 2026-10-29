import type { MotionOption } from '../../../src/contract';
import { focal, focalOrder, live } from '../_motion-a/entrance';
import { interactionCss } from '../_motion-a/interaction';

const S = 'html[data-motion="terraces"]';
const L = live('terraces');

// The focal pieces surface the way the terraces do: out of a short mist (6px blur), 620ms on
// an expo ease-out, 60ms apart. Phones drop the blur, which costs the most paint on small GPUs.
const css = `
@keyframes ma-tr-surface{from{opacity:0;filter:blur(6px);translate:0 6px}}
@keyframes ma-tr-surface-phone{from{opacity:0;translate:0 6px}}
${focalOrder(S)}
${focal(L)}{animation:ma-tr-surface 620ms cubic-bezier(.16,1,.3,1) backwards;animation-delay:calc(min(var(--ma-i),3) * 60ms)}
@media (max-width:700px){${focal(L)}{animation-name:ma-tr-surface-phone}}`;

export default {
  id: 'terraces',
  layer: 'motion',
  label: 'Terraces',
  summary: 'Six ridges of terraced hills in the field ramp, crisp at the crest and dissolving downslope into mist; the bank swells and sinks over tens of seconds, and the headline surfaces from a short blur. Steps coming out of mist, said as landscape.',
  origin: 'B',
  renderer: 'webgl',
  refs: [
    { name: 'Earendil', url: 'https://earendil.com/', what: 'One slow living backdrop under one sentence, engineered to get out of the way: low resolution, adaptive quality, aperiodic drift. Here the drift is the mist bank, not the camera.' },
    { name: 'Linear', url: 'https://linear.app/', what: 'Its hero lines rise out of a 10px blur over 1000ms. Terraces keeps the blur as mist clearing, shortens it to 620ms with 60ms steps, and drops it on phones.' },
    { name: 'Stripe', url: 'https://stripe.com/', what: 'Its shader wave ships a still of the same wave for every breakpoint and one governor that pauses offscreen and on hidden tabs and steps quality on frame time. The terraces do both, computing their still on the CPU instead of shipping images.' },
  ],
  background: { load: () => import('./field') },
  entrance: { css },
  interaction: { css: interactionCss('terraces', 'smooth') },
  budget: {
    gzipKB: 8.5,
    frameMs: 'GPU draw: pending conductor (no browser allowed on this Mac; bench at /options/motion/_motion-a/bench.html). CPU still, once: 7.4 ms (358x220 panel) to 33.3 ms (1440x820 full), painted in idle slices of at most 8 ms',
    note: 'Measured: 8.5 KB gzip (1.8 option + 6.8 lazy field incl. runtime), vite build; CPU still timed in JavaScriptCore on this Mac. Raw WebGL1, one fullscreen triangle, nearest ridge first with an early exit. One cell = 2 CSS px (0.5x backing store), then 4 CSS px tiers: 30, 24, 12 fps with 3/2/1 mist octaves; still below the last tier. Reduced motion, Save-Data, no WebGL and context loss draw the same composition on the CPU with no GPU context. Shaders validated with glslang (ESSL 1.00).',
  },
} satisfies MotionOption & { renderer: 'webgl' | 'canvas2d' | 'none' };
