import type { MarkOption } from '../../../src/contract';
import { EASE_OUT, quiet, settle, svg } from '../_lib/mark';
import { sector } from '../_lib/geom';

// A geometric S drawn from two circles, the way a precise symbol is built in Linear's or Vercel's tradition,
// compressed around one event the way Grok compresses an event horizon into a G: the stroke vanishes at the
// spine and lands one step on. Misty Step is the spell for exactly that short jump.

// The top bowl is a touch smaller than the bottom one, as in any well-set S, so the letter stands rather than tips.
const TOP = { r: 4.7, y: 7 }, BOTTOM = { r: 5, y: 16.7 }; // both bowls meet the spine at y = 11.7
interface Cut { w: number; step: number }
// The favicon gets a heavier stroke and a wider break so both survive at 16px.
const SMALL: Cut = { w: 4.2, step: 2.9 };
const LARGE: Cut = { w: 3.6, step: 2.4 };

function bowls({ w, step }: Cut): { top: string; bottom: string } {
  // Top bowl: from the upper terminal, counter-clockwise over the top and down the left, to the spine.
  // Bottom bowl: from the spine, clockwise round the right and the bottom, to the lower terminal; it sits `step` further on.
  const x = 12 - step / 2;
  return { top: sector(x, TOP.y, TOP.r, w, -28, -270), bottom: sector(x + step, BOTTOM.y, BOTTOM.r, w, -90, 152) };
}

function draw(size: number): string {
  const { top, bottom } = bowls(size <= 20 ? SMALL : LARGE);
  return svg({
    viewBox: [24, 24], width: size, height: size, cls: 'mk mk-blink',
    body: `<g fill="currentColor"><path d="${top}"/><path data-land="" d="${bottom}"/></g>`,
  });
}

export default {
  id: 'blink',
  layer: 'mark',
  label: 'Blink S',
  origin: 'new',
  summary: 'A geometric S whose stroke breaks at the spine and lands one step further on: the spell the studio is named for, a short jump through mist, held in one letter.',
  refs: [
    { name: 'Grok', url: 'https://grok.com', what: 'One physical event (an accretion disc) compressed into a single letterform in one colour, so the letter carries the idea by itself.' },
    { name: 'Linear', url: 'https://linear.app', what: 'A symbol built from circles and one deliberate cut that implies motion, exact enough to hold at favicon size.' },
    { name: 'Vercel', url: 'https://vercel.com', what: 'A solid figure with no detail to lose, confident enough to stand alone in the nav at 20px.' },
  ],
  svg: ({ size }) => draw(size),
  // Once per load: the lower bowl starts as mist directly under the upper one, then blinks one step on.
  animateIn(el, ctx) {
    if (quiet(ctx)) return () => {};
    const land = el.querySelector('[data-land]');
    if (!land) return () => {};
    const shift = `translateX(-${LARGE.step}px)`;
    return settle([
      land.animate(
        [{ transform: shift, opacity: 0.32 }, { transform: 'translateX(0px)', opacity: 1 }],
        { duration: 460, delay: 120, easing: 'steps(1, jump-end)', fill: 'backwards' },
      ),
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: EASE_OUT, fill: 'backwards' }),
    ]);
  },
  css: `
html[data-mark="blink"] .brand { gap: 8px; }
html[data-mark="blink"] .brand-mark svg { display: block; width: 30px; height: 30px; }
`,
} satisfies MarkOption & { css: string };
