import type { MarkOption } from '../../../src/contract';
import { EASE_OUT, cut, quiet, settle, svg } from '../_lib/mark';
import { circle } from '../_lib/geom';

// A friendly emblem in Cloudflare's tradition: one cloud built from three circles on a flat base, split in two
// tones. The split is a single stair-step: mist below, the step above it in the signature colour.

let serial = 0; // clipPath ids must stay unique when the nav, a hero and the favicon all draw this mark
// All subpaths wind the same way (counter-clockwise), so the nonzero rule fills their union.
const CLOUD = circle(7.6, 13.6, 4.9) + circle(13.4, 9.6, 6.3) + circle(18.6, 14, 4.5) + 'M7.6 12V18.5H18.6V12Z';
// The stair-step cut: from the left edge at y = 15.2, up a riser at x = 12.4, to y = 11.6 on the right.
const above = (g: number) => `M0 0H24V${11.6 - g / 2}H${12.4 - g / 2}V${15.2 - g / 2}H0Z`;
const below = (g: number) => `M0 24V${15.2 + g / 2}H${12.4 + g / 2}V${11.6 + g / 2}H24V24Z`;

function draw(size: number): string {
  const id = `mk-cloudstep-${++serial}`, g = size <= 20 ? 2.2 : 1.3;
  return svg({
    viewBox: [24, 24], width: size, height: size, cls: 'mk mk-cloudstep',
    body: `<defs><clipPath id="${id}-a"><path d="${above(g)}"/></clipPath><clipPath id="${id}-b"><path d="${below(g)}"/></clipPath></defs>`
      + `<g transform="translate(-0.9 1.1)"><path data-mist="" d="${CLOUD}" fill="currentColor" fill-opacity=".42" clip-path="url(#${id}-b)"/>`
      + `<path data-step="" d="${CLOUD}" style="fill:var(--accent-2)" clip-path="url(#${id}-a)"/></g>`,
  });
}

export default {
  id: 'cloudstep',
  layer: 'mark',
  label: 'Cloud step',
  origin: 'new',
  summary: 'One cloud cut by a single stair-step: mist below, the step above it in the signature colour, an emblem that says the name at a glance and stays friendly at any size.',
  refs: [
    { name: 'Cloudflare', url: 'https://www.cloudflare.com', what: 'An emblem that draws the name as one friendly silhouette from a few circles, with two tones of one idea giving depth instead of detail.' },
  ],
  svg: ({ size }) => draw(size),
  // Once per load: the mist settles, then the step lands on top of it with one hard cut.
  animateIn(el, ctx) {
    if (quiet(ctx)) return () => {};
    const mist = el.querySelector('[data-mist]'), step = el.querySelector('[data-step]');
    if (!mist || !step) return () => {};
    return settle([
      mist.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 280, easing: EASE_OUT, fill: 'backwards' }),
      cut(step, 320),
    ]);
  },
  css: `
html[data-mark="cloudstep"] .brand { gap: 8px; }
html[data-mark="cloudstep"] .brand-mark svg { display: block; width: 34px; height: 34px; }
`,
} satisfies MarkOption & { css: string };
