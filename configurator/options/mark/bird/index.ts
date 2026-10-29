import type { MarkOption } from '../../../src/contract';
import { cell, cells, cut, quiet, rects, runs, settle, svg, type Cell } from '../_lib/mark';

// Ported from Direction B (Atelier): the bird from Misty Step's own bird-and-hand print, redrawn as a pixel mark
// rising out of a trail of mist, with one accent pixel for the beak. The favicon is a separate 8x8 drawing, not a
// scaled copy; the nav and display sizes share the 15x11 drawing at whole-pixel cells.

const BIRD = cells([
  '...#...........',
  '...##..........',
  '...###.........',
  '....###.....##.',
  '....####...###r',
  '.....####.####.',
  '..:.#########..',
  '.:.#########...',
  ':.:########....',
  '.:.:.####......',
  '...:.:.........',
]);
const SMALL = cells([
  '.#......',
  '.##.....',
  '..##..#r',
  '..###.##',
  '...#####',
  '.:#####.',
  ':.####..',
  '.:.##...',
]);

const MIST = 'fill="currentColor" fill-opacity=".38"';

function still(art: Map<string, Cell[]>, w: number, h: number, px: number): string {
  return svg({
    viewBox: [w, h], width: w * px, height: h * px, cls: 'mk mk-bird', crisp: true,
    body: `<path ${MIST} d="${runs(art.get(':')!)}"/><path fill="currentColor" d="${runs(art.get('#')!)}"/><path style="fill:var(--accent-2)" d="${runs(art.get('r')!)}"/>`,
  });
}

// The nav drawing carries one rect per cell so the bird can coalesce out of its own mist (B's signature).
// Displacements are seeded so every load and every theme draws the same flight.
function seeded(seed: number) {
  return () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function flight(): string {
  const rand = seeded(7);
  const lift = () => {
    const a = Math.PI * (0.55 + rand() * 0.7), d = [2, 3, 3, 4, 5][Math.floor(rand() * 5)];
    return ` data-dx="${Math.round(Math.cos(a) * d)}" data-dy="${Math.round(Math.sin(a) * d)}"`;
  };
  const mist = BIRD.get(':')!;
  const ink = [...BIRD.get('#')!].sort((p, q) => (p[0] - p[1] * 0.6) - (q[0] - q[1] * 0.6)); // tail to head
  return `<g ${MIST}>${rects(mist, (_, i) => `${lift()} data-o="${i}"`)}</g>`
    + `<g fill="currentColor" data-ink="">${rects(ink, (_, i) => `${lift()} data-o="${mist.length + (i >> 1)}"`)}</g>`
    + `<path data-beak="" style="fill:var(--accent-2)" d="${runs(BIRD.get('r')!)}"/>`;
}
const NAV_BODY = flight();

export default {
  id: 'bird',
  layer: 'mark',
  label: 'Pixel bird',
  origin: 'B',
  summary: 'The bird from Misty Step\'s own dithered print, redrawn on a 15 by 11 pixel grid as it lifts out of a trail of mist, beak in the accent.',
  refs: [
    { name: 'Misty Step', url: 'https://mistystep.io', what: 'The studio already owns a dithered bird-and-hand image; the mark is that bird, so the identity grows from its own asset.' },
    { name: 'pi.dev', url: 'https://pi.dev', what: 'A pixel mark that assembles once on load, then the page goes completely still.' },
  ],
  svg: ({ size }) => {
    // Under 30px the 15-cell bird cannot keep whole-pixel cells, so the 8x8 drawing takes over.
    if (size < 30) return still(SMALL, 8, 8, cell(size, 8));
    const px = cell(size, 15);
    if (size >= 64) return still(BIRD, 15, 11, px);
    return svg({ viewBox: [15, 11], width: 15 * px, height: 11 * px, cls: 'mk mk-bird', crisp: true, body: NAV_BODY });
  },
  // Each cell steps in from its mist offset in four hard steps, ink cells darkening last; the beak lands at 760ms.
  animateIn(el, ctx) {
    if (quiet(ctx)) return () => {};
    const anims: Animation[] = [];
    el.querySelectorAll<SVGRectElement>('rect[data-o]').forEach(r => {
      const move = `translate(${r.dataset.dx}px, ${r.dataset.dy}px)`;
      const timing: KeyframeAnimationOptions = { duration: 420, delay: 80 + Number(r.dataset.o) * 8, easing: 'steps(4, jump-none)', fill: 'backwards' };
      anims.push(r.parentElement?.hasAttribute('data-ink')
        ? r.animate([{ transform: move, opacity: 0, fillOpacity: 0.38 }, { opacity: 1, fillOpacity: 0.38, offset: 0.25 }, { fillOpacity: 0.38, offset: 0.74 }, { transform: 'translate(0px, 0px)', opacity: 1, fillOpacity: 1 }], timing)
        : r.animate([{ transform: move, opacity: 0 }, { opacity: 1, offset: 0.25 }, { transform: 'translate(0px, 0px)', opacity: 1 }], timing));
    });
    const beak = el.querySelector('[data-beak]');
    if (beak) anims.push(cut(beak, 760));
    return settle(anims);
  },
  css: `
html[data-mark="bird"] .brand { gap: 10px; }
html[data-mark="bird"] .brand-mark svg { display: block; overflow: visible; }
`,
} satisfies MarkOption & { css: string };
