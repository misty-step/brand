import type { Ctx, MarkOption } from '../../../src/contract';
import { cut, quiet, settle, svg } from '../_lib/mark';
import { capitals } from '../r2-a-kit/capitals';

// Mid-step. One block caught crossing the mist: the half that is still leaving is a dot screen, the half that has
// arrived is solid and stands exactly one unit over and one unit up.
// The dots are the 1-bit language of the dither-mist field behind the hero, so the mark and the field speak the same
// grain; here the grain is bounded by the block it came from.
//
// Construction. u = 1/16 of the box. Ink box 15u x 14u.
//   The block before the step: 15u x 13u, split down the middle into two 7u x 13u halves with 1u between them.
//   Trailing half: a dot screen of 1u squares on a 2u pitch, 4 across and 7 down, with dots on all four edges so the
//   half keeps its outline. 28 dots: 25% ink, a mist that still holds the shape.
//   Leading half: solid, moved one unit over (the 1u gap) and one unit up. In ink-box units: dots at (2i, 1 + 2j),
//   i = 0..3, j = 0..6; solid half (8,0)-(15,13).
// Drawings.
//   Below 96 px: snapped to whole pixels. At 16 px the dots are single pixels on a 2 px pitch (a bounded screen, never
//   a checkerboard) and the solid half 7 x 13 px; at 32 px everything doubles. 0 soft pixels at 16 and 32.
//   96 px and up (viewBox 160, u = 10): the dots grow to 11 around their centres, because a screen of separate dots
//   reads lighter than its measured 25% beside a solid; the solid half keeps its exact 70 x 130.
// Lockup. The name's baseline stands on the solid half's foot, the ground the step reached; the cap height is the
// type's own nav cap height (14 px at the 32 px nav). Gap 8 px. Clear space: one half width (7u) on every side.

const NS = 'http://www.w3.org/2000/svg';
const rect = (x0: number, y0: number, x1: number, y1: number) => `M${x0} ${y0}H${x1}V${y1}H${x0}Z`;

interface Drawing { box: number; mist: string; solid: string; origin: string; crisp: boolean }

/** Pixel drawing for small sizes: every edge on a whole pixel of a `size` px box. */
function pixel(size: number): Drawing {
  const s = size / 16, r = (v: number) => Math.round(v * s);
  const x0 = Math.floor((size - r(15)) / 2), y0 = Math.round((size - r(14)) / 2);
  const X = (v: number) => x0 + r(v), Y = (v: number) => y0 + r(v);
  let mist = '';
  for (let j = 0; j < 7; j++) for (let i = 0; i < 4; i++) mist += rect(X(2 * i), Y(1 + 2 * j), X(2 * i + 1), Y(2 + 2 * j));
  return { box: size, crisp: true, mist, solid: rect(X(8), Y(0), X(15), Y(13)), origin: rect(X(0), Y(1), X(15), Y(14)) };
}

/** Full drawing, viewBox 160 (u = 10): dots 11 around the 1u cell centres, solid half exact. */
function full(): Drawing {
  let mist = '';
  for (let j = 0; j < 7; j++) for (let i = 0; i < 4; i++) mist += rect(9.5 + 20 * i, 19.5 + 20 * j, 20.5 + 20 * i, 30.5 + 20 * j);
  return { box: 160, crisp: false, mist, solid: rect(85, 10, 155, 140), origin: rect(5, 20, 155, 150) };
}
const FULL = full();

const drawing = (size: number): Drawing => (size >= 96 ? FULL : pixel(size));

function draw(size: number): string {
  const d = drawing(size);
  return svg({
    viewBox: [d.box, d.box], width: size, height: size, cls: 'mk mk-r2-a-midstep', crisp: d.crisp,
    body: `<path class="mk-mist" fill="currentColor" d="${d.mist}"/><path class="mk-solid" fill="currentColor" d="${d.solid}"/>`,
  });
}

export default {
  id: 'r2-a-midstep',
  layer: 'mark',
  label: 'Mid-step',
  origin: 'r2',
  summary: 'One block caught crossing the mist, its trailing half a 1-bit dot screen and its leading half solid, exactly one unit over and one unit up: the instant of the step the studio is named for.',
  refs: [
    { name: 'Brass Hands', url: 'https://www.brasshands.com', what: 'One form drawn twice in the same mark, solid and as a 1-bit stipple (their Cadrian C), on a coarse grid that survives stencilling and a 16 px tab.' },
    { name: 'NOAA Weather Prediction Center, station model symbols', url: 'https://www.wpc.ncep.noaa.gov/html/stationplot.shtml', what: 'Notation over illustration: weather drawn as a few exact marks on a plot, which is how the mist half is drawn here, as a measured screen rather than a cloud.' },
  ],
  svg: ({ size }) => draw(size),
  wordmark: ({ name }) => capitals(name, { track: 30, space: 150, cls: 'mk-word' }),
  // The step, once: the whole block stands solid, then its trailing half turns to mist as the leading half lands.
  animateIn(el: Element, ctx: Ctx) {
    const root = el.querySelector('svg');
    if (!root || quiet(ctx)) return () => {};
    const d = drawing(Number(root.getAttribute('width')) || 32);
    const ghost = document.createElementNS(NS, 'path');
    ghost.setAttribute('d', d.origin);
    ghost.setAttribute('fill', 'currentColor');
    root.append(ghost);
    const anims = [
      ghost.animate([{ visibility: 'visible' }, { visibility: 'hidden' }], { duration: 1, delay: 240, easing: 'steps(1, end)', fill: 'forwards' }),
      cut(root.querySelector('.mk-mist')!, 240),
      cut(root.querySelector('.mk-solid')!, 240),
    ];
    const done = () => ghost.remove();
    anims[0].finished.then(done, done);
    return () => { settle(anims)(); done(); };
  },
  css: `
html[data-mark="r2-a-midstep"] .brand { gap: 8px; }
html[data-mark="r2-a-midstep"] .brand-mark svg { width: 32px; height: 32px; }
html[data-mark="r2-a-midstep"] .brand-name { display: block; line-height: 0; }
html[data-mark="r2-a-midstep"] .brand-name svg { display: block; height: 14px; width: auto; position: relative; top: 5px; }
`,
} satisfies MarkOption & { css: string };
