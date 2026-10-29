import type { MarkOption } from '../../../src/contract';
import { cut, quiet, settle, svg } from '../_lib/mark';
import { circle, lens } from '../_lib/geom';

// A solid disc with one eye-shaped counter and a square pupil glancing up and to the right.
// Misty Step only works toward "a space you can see", and mistystack's Oracle is the outside check you name
// before work starts: the mark is that look ahead. The square pupil is the one pixel in an otherwise vector mark.

interface Eye { lid: number; sag: number; pupil: number; px: number; py: number }
const SMALL: Eye = { lid: 3.2, sag: 5.8, pupil: 5.6, px: 13.0, py: 7.9 };
const LARGE: Eye = { lid: 3.4, sag: 5.3, pupil: 5.0, px: 13.2, py: 8.1 };
// Where the pupil starts in the entrance: looking back, low and to the left.
const BACK = { px: 6.8, py: 11.6 };

function draw(size: number): string {
  const e = size <= 20 ? SMALL : LARGE;
  const counter = lens(e.lid, 24 - e.lid, 12.4, e.sag);
  const pupil = (x: number, y: number, attrs = '') => `<rect x="${x}" y="${y}" width="${e.pupil}" height="${e.pupil}"${attrs}/>`;
  const glance = size > 20 && size < 64 ? pupil(BACK.px, BACK.py, ' data-back="" visibility="hidden"') : '';
  return svg({
    viewBox: [24, 24], width: size, height: size, cls: 'mk mk-oracle',
    body: `<g fill="currentColor"><path fill-rule="evenodd" d="${circle(12, 12, 11)}${counter}"/>${pupil(e.px, e.py, ' data-look=""')}${glance}</g>`,
  });
}

export default {
  id: 'oracle',
  layer: 'mark',
  label: 'Oracle eye',
  origin: 'new',
  summary: 'A disc with one eye cut into it and a square pupil glancing up and ahead: you only step where you can see, and mistystack names its Oracle before work starts.',
  refs: [
    { name: 'Macroscope', url: 'https://macroscope.com/brand-kit', what: 'One solid disc carved by a single counter-form, so figure and ground carry the character and it reads as one mass at 16px.' },
    { name: 'Greptile', url: 'https://www.greptile.com/blog/brand-refresh', what: 'A code tool whose mark is an eye with personality, built from hard geometry instead of a cartoon.' },
  ],
  svg: ({ size }) => draw(size),
  // Once per load: the eye looks back first, then the pupil blinks to where it is going. One hard cut at 360ms.
  animateIn(el, ctx) {
    if (quiet(ctx)) return () => {};
    const back = el.querySelector('[data-back]'), look = el.querySelector('[data-look]');
    if (!back || !look) return () => {};
    return settle([
      back.animate([{ visibility: 'visible' }, { visibility: 'visible' }], { duration: 360, delay: 0, easing: 'steps(1, jump-end)', fill: 'none' }),
      cut(look, 360),
    ]);
  },
  css: `
html[data-mark="oracle"] .brand { gap: 10px; }
html[data-mark="oracle"] .brand-mark svg { display: block; width: 28px; height: 28px; }
`,
} satisfies MarkOption & { css: string };
