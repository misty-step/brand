import type { MotionOption } from '../../../src/contract';
import { focal, focalOrder, live } from '../_motion-a/entrance';
import { interactionCss } from '../_motion-a/interaction';

const S = 'html[data-motion="voxel-stairs"]';
const L = live('voxel-stairs');

// Everything arrives the way the stairs do: built bottom-up in four hard cuts (80ms each),
// never faded. The first cut is hidden by opacity, not by a full clip, so the element always
// keeps a visible box for IntersectionObserver. Hero pieces are final by 320ms + 3 x 60ms = 500ms.
// The offer's steps build in turn as they enter; the stack route lights node by node.
const css = `
@keyframes ma-vx-build{0%{opacity:0;clip-path:inset(75% -8px 0 -8px)}25%{opacity:1;clip-path:inset(75% -8px 0 -8px)}50%{clip-path:inset(50% -8px 0 -8px)}75%{clip-path:inset(25% -8px 0 -8px)}100%{clip-path:inset(0 -8px 0 -8px)}}
@keyframes ma-vx-light{from{opacity:0}}
${focalOrder(S)}
${focal(L)}{animation:ma-vx-build 320ms steps(1,end) backwards;animation-delay:calc(min(var(--ma-i),3) * 60ms)}
${L} .s-steps .item[data-enter]:not(.is-in),${L} .s-diagram .node[data-enter]:not(.is-in){opacity:0}
${L} .s-steps .item[data-enter].is-in{animation:ma-vx-build 320ms steps(1,end) backwards}
${L} .s-diagram .node[data-enter].is-in{animation:ma-vx-light 1ms steps(1,end) backwards}
${[2, 3, 4, 5, 6].map((n) => `${L} :is(.s-steps .item,.s-diagram .node)[data-enter].is-in:nth-child(${n}){animation-delay:${(n - 1) * 60}ms}`).join('\n')}`;

export default {
  id: 'voxel-stairs',
  layer: 'motion',
  label: 'Voxel stairs',
  summary: 'Flights of voxel stairs build out of mist a step at a time, hold and sink on their own periods; one top tread takes the accent when its flight is complete. The page builds the same way: four hard cuts, bottom up. The step as the unit of everything.',
  origin: 'C',
  renderer: 'webgl',
  refs: [
    { name: 'Omarchy', url: 'https://omarchy.org/', what: 'Its pixel wordmark rebuilds row by row in hard steps when the theme changes: pixel state changes as cuts, never as fades. The page here builds in four.' },
    { name: 'Linear', url: 'https://linear.app/', what: 'Measured 2026-10-29: its dot-matrix glyphs animate on steps(1) keyframes. A pixel world earns its feel from stepped timing, not from blur or easing.' },
    { name: 'Vercel', url: 'https://vercel.com/', what: 'Its hero scene falls back to a static render of the same scene when WebGL2 is missing or reduced motion is on, and caps the pixel ratio at 1.5. The stairs do the same with a CPU still and a 4px cell.' },
  ],
  background: { load: () => import('./field') },
  entrance: { css },
  interaction: { css: interactionCss('voxel-stairs', 'pixel') },
  budget: {
    gzipKB: 10.1,
    frameMs: 'GPU draw: pending conductor (no browser allowed on this Mac; bench at /options/motion/_motion-a/bench.html). CPU still, once: 0.5 ms (358x220 panel) to 6.2 ms (1440x820 full)',
    note: 'Measured: 10.1 KB gzip (2.3 option + 7.8 lazy field incl. runtime), vite build; CPU still timed in JavaScriptCore on this Mac. Raw WebGL2, one instanced draw per frame (32 boxes x 18 vertices, three visible faces), one cell = 4 CSS px; world scale 4 px per unit, 2 on small hosts so the focal flight stays whole. Tiers 30/15/8 fps, still below the last. Reduced motion, Save-Data, no WebGL2 and context loss rasterise the same boxes on the CPU with a depth test, no GPU context. Shaders validated with glslang (ESSL 3.00).',
  },
} satisfies MotionOption & { renderer: 'webgl' | 'canvas2d' | 'none' };
