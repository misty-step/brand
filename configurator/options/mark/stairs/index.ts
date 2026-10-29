import type { MarkOption } from '../../../src/contract';
import { cell, cells, cut, quiet, runs, settle, svg } from '../_lib/mark';

// Ported from Direction C (Steps): a four-step staircase on an 8x8 grid. The top step is the goal, in the accent;
// the bottom row is dithered, the mist the stair rises out of. One drawing at every size, always on whole pixels.

const ART = cells([
  '......aa',
  '......aa',
  '....####',
  '....####',
  '..######',
  '..######',
  '########',
  '#.#.#.#.',
]);
// Bottom-up build order: mist, then each tread, then the goal.
const TREADS: readonly (readonly [number, number])[] = [[7, 7], [6, 6], [4, 5], [2, 3]];

function draw(px: number, staged: boolean): string {
  const ink = ART.get('#')!;
  const body = staged
    ? TREADS.map(([a, b], i) => `<path data-t="${i}" d="${runs(ink.filter(c => c[1] >= a && c[1] <= b))}"/>`).join('')
    : `<path d="${runs(ink)}"/>`;
  return svg({
    viewBox: [8, 8], width: 8 * px, height: 8 * px, cls: 'mk mk-stairs', crisp: true,
    body: `<g fill="currentColor">${body}</g><path data-t="4" style="fill:var(--accent-2)" d="${runs(ART.get('a')!)}"/>`,
  });
}

export default {
  id: 'stairs',
  layer: 'mark',
  label: 'Staircase',
  origin: 'C',
  summary: 'Four pixel steps rising out of a dithered row of mist to an accent goal: the studio\'s name and its priced, step-by-step offer in one 8 by 8 drawing.',
  refs: [
    { name: 'Vercel', url: 'https://vercel.com', what: 'One solid primitive that needs no detail to hold at 16px; for a studio named for a step, the primitive is a stair.' },
    { name: 'pi.dev', url: 'https://pi.dev', what: 'A mark drawn on a tiny integer grid, so it stays crisp from the favicon to the hero.' },
  ],
  svg: ({ size }) => draw(cell(size, 8, 2), size > 20 && size < 64),
  // C's build: the stair rises bottom-up in hard cuts 90ms apart and the goal lights last, settled by 440ms.
  animateIn(el, ctx) {
    if (quiet(ctx)) return () => {};
    const anims: Animation[] = [];
    el.querySelectorAll('[data-t]').forEach(p => anims.push(cut(p, 80 + Number(p.getAttribute('data-t')) * 90)));
    return settle(anims);
  },
  css: `
html[data-mark="stairs"] .brand-mark svg { display: block; width: 32px; height: 32px; }
`,
} satisfies MarkOption & { css: string };
