import type { Ctx, MarkOption } from '../../../src/contract';
import { cut, quiet, settle, svg } from '../_lib/mark';
import { capitals } from '../r2-a-kit/capitals';

// Mist sign. Mist where you stood, solid ground where you can see.
// The two bars are the weather map's sign for mist (thin fog; thick fog is three). One step over and one step up
// from the sign is the space the step reached, drawn solid. It is the plate's `=` taken out of the plate and given
// the job the studio is named for.
//
// Construction. u = 1/16 of the box. Ink box 15u x 11u.
//   Sign: two bars, 7u long and 1u thick, 1u apart: as wide as the block, the same space left behind as mist.
//   Block: 7u square, one unit over (1u between the bars' ends and its left side) and one unit up (1u between its
//   foot and the upper bar). In ink-box units: bars (0,8)-(7,9) and (0,10)-(7,11); block (8,0)-(15,7).
//   The ink box sits 3u from the top and 2u from the bottom, so the heavy block does not ride high.
// Drawings.
//   Below 96 px: snapped to whole pixels. At 16 px the bars are 1 px with a 1 px gap and the block 7 px; at 32 px
//   everything doubles (bars 2 px); 48, 64 and 80 px stay on whole pixels too. 0 soft pixels at 16 and 32.
//   96 px and up (viewBox 160, u = 10): the bars are 9 thick, a touch under the unit, because a horizontal reads
//   heavier than its measure and the sign must stay a light mark against the block; their gap opens to 11. The block
//   keeps its full 70 so its top and foot stay on the name's cap line and baseline at every lockup scale.
// Lockup. The block is exactly the cap height of the name: 14 px at the 32 px nav, which is Sofia Sans Extra
// Condensed's cap height at the type's own 22 px nav size. Its top sits on the cap line and its foot on the baseline;
// the sign hangs below the line like a descender. Gap 8 px (4u). Clear space: one block width (7u) on every side.

const NS = 'http://www.w3.org/2000/svg';
const rect = (x0: number, y0: number, x1: number, y1: number) => `M${x0} ${y0}H${x1}V${y1}H${x0}Z`;

interface Drawing { box: number; mist: string; block: string; origin: string; crisp: boolean }

/** Pixel drawing for small sizes: every edge on a whole pixel of a `size` px box. */
function pixel(size: number): Drawing {
  const s = size / 16, r = (v: number) => Math.round(v * s);
  const x0 = Math.floor((size - r(15)) / 2), y0 = Math.round((size - r(11)) / 2 + s / 2);
  const X = (v: number) => x0 + r(v), Y = (v: number) => y0 + r(v);
  return {
    box: size, crisp: true,
    mist: rect(X(0), Y(8), X(7), Y(9)) + rect(X(0), Y(10), X(7), Y(11)),
    block: rect(X(8), Y(0), X(15), Y(7)),
    origin: rect(X(0), Y(4), X(7), Y(11)),
  };
}

/** Full drawing, viewBox 160 (u = 10), with the optical corrections above. */
const FULL: Drawing = {
  box: 160, crisp: false,
  mist: rect(5, 110.5, 75, 119.5) + rect(5, 130.5, 75, 139.5),
  block: rect(85, 30, 155, 100),
  origin: rect(5, 70, 75, 140),
};

const drawing = (size: number): Drawing => (size >= 96 ? FULL : pixel(size));

function draw(size: number): string {
  const d = drawing(size);
  return svg({
    viewBox: [d.box, d.box], width: size, height: size, cls: 'mk mk-r2-a-mist', crisp: d.crisp,
    body: `<path class="mk-mist" fill="currentColor" d="${d.mist}"/><path class="mk-block" fill="currentColor" d="${d.block}"/>`,
  });
}

export default {
  id: 'r2-a-mist',
  layer: 'mark',
  label: 'Mist sign',
  origin: 'r2',
  summary: 'The weather map\'s sign for mist where you stood and a solid block one step over and one step up where you can see: the spell the studio is named for, drawn as a diagram.',
  refs: [
    { name: 'NOAA Weather Prediction Center, station model symbols', url: 'https://www.wpc.ncep.noaa.gov/html/stationplot.shtml', what: 'The public weather-map notation the sign is taken from: two horizontal lines for mist or thin fog, three for thick fog. A sign nobody owns as a logo, so the mark can.' },
    { name: 'Brass Hands', url: 'https://www.brasshands.com', what: 'Marks built from a few bars and blocks on a coarse grid, drawn to pass the shipping-container test: stencilled, stamped, embroidered and at 16 px.' },
  ],
  svg: ({ size }) => draw(size),
  wordmark: ({ name }) => capitals(name, { track: 30, space: 150, cls: 'mk-word' }),
  // The step, once: the block stands where the sign will be, the sign takes its place, then the block lands.
  animateIn(el: Element, ctx: Ctx) {
    const root = el.querySelector('svg');
    if (!root || quiet(ctx)) return () => {};
    const d = drawing(Number(root.getAttribute('width')) || 32);
    const ghost = document.createElementNS(NS, 'path');
    ghost.setAttribute('d', d.origin);
    ghost.setAttribute('fill', 'currentColor');
    root.append(ghost);
    const anims = [
      ghost.animate([{ visibility: 'visible' }, { visibility: 'hidden' }], { duration: 1, delay: 200, easing: 'steps(1, end)', fill: 'forwards' }),
      cut(root.querySelector('.mk-mist')!, 200),
      cut(root.querySelector('.mk-block')!, 380),
    ];
    const done = () => ghost.remove();
    anims[0].finished.then(done, done);
    return () => { settle(anims)(); done(); };
  },
  css: `
html[data-mark="r2-a-mist"] .brand { gap: 8px; }
html[data-mark="r2-a-mist"] .brand-mark svg { width: 32px; height: 32px; }
html[data-mark="r2-a-mist"] .brand-name { display: block; line-height: 0; }
html[data-mark="r2-a-mist"] .brand-name svg { display: block; height: 14px; width: auto; position: relative; top: -3px; }
`,
} satisfies MarkOption & { css: string };
