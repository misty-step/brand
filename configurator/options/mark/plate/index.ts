import type { MarkOption } from '../../../src/contract';
import { setPixels, svg, type PixelFont } from '../_lib/mark';

// An industrial nameplate in Brass Hands' Neo-Industrial manner: a chamfered plate with a heavy M cut through it.
// Under the M runs the weather-map sign for mist, two horizontal bars (=), the lower one stepped short.
// At display size those two bars resolve into what they stood for: the name in plate lettering, and a run of
// bars that thins out like mist.

const n = (v: number) => +v.toFixed(3);
const PLATE = 'M4 1H20L23 4V20L20 23H4L1 20V4Z';

/** A heavy geometric M as one closed polygon inside the box x0..x1, y0..y1. */
function M(x0: number, x1: number, y0: number, y1: number, stem: number): string {
  const h = y1 - y0, cx = (x0 + x1) / 2, e = stem * 0.09;
  const pts = [
    [x0, y1], [x0, y0], [x0 + stem + e, y0], [cx, y0 + 0.39 * h], [x1 - stem - e, y0], [x1, y0], [x1, y1],
    [x1 - stem, y1], [x1 - stem, y0 + 0.45 * h], [cx + 0.07 * (x1 - x0), y0 + 0.75 * h], [cx - 0.07 * (x1 - x0), y0 + 0.75 * h],
    [x0 + stem, y0 + 0.45 * h], [x0 + stem, y1],
  ];
  return 'M' + pts.map(([x, y]) => `${n(x)} ${n(y)}`).join('L') + 'Z';
}
const bar = (x0: number, x1: number, y0: number, y1: number) => `M${n(x0)} ${n(y0)}H${n(x1)}V${n(y1)}H${n(x0)}Z`;

// Plate lettering: a 3x5 technical cap set (M is five wide), drawn as cells and knocked out of the plate.
const PLATE_CAPS: PixelFont = { height: 5, space: 2, tracking: 1, glyphs: {
  M: ['#...#', '##.##', '#.#.#', '#...#', '#...#'],
  I: ['###', '.#.', '.#.', '.#.', '###'],
  S: ['###', '#..', '###', '..#', '###'],
  T: ['###', '.#.', '.#.', '.#.', '.#.'],
  Y: ['#.#', '#.#', '.#.', '.#.', '.#.'],
  E: ['###', '#..', '##.', '#..', '###'],
  P: ['###', '#.#', '###', '#..', '#..'],
} };
function lettering(text: string, cx: number, y: number, cellSize: number): string {
  const set = setPixels(text, PLATE_CAPS, true)!;
  const x0 = cx - (set.width * cellSize) / 2;
  return set.cells.map(([x, yy]) => bar(x0 + x * cellSize, x0 + (x + 1) * cellSize, y + yy * cellSize, y + (yy + 1) * cellSize)).join('');
}
// Bars that thin out to the right, Brass Hands' compression run read as mist dissipating.
function thinning(x0: number, x1: number, y0: number, y1: number, count: number, gap: number): string {
  const weights = Array.from({ length: count }, (_, i) => 1 - (0.85 * i) / count);
  const unit = (x1 - x0 - gap * (count - 1)) / weights.reduce((a, b) => a + b, 0);
  let x = x0, d = '';
  for (const w of weights) { d += bar(x, x + w * unit, y0, y1); x += w * unit + gap; }
  return d;
}

function draw(size: number): string {
  let cutout: string;
  if (size <= 20) cutout = M(5.2, 18.8, 5.4, 18.6, 3.9);
  else if (size < 96) cutout = M(5.6, 18.4, 5, 15.4, 3.4) + bar(5.6, 18.4, 16.9, 18.1) + bar(8, 18.4, 19.3, 20.5);
  else cutout = M(6.9, 17.1, 4.2, 12.2, 2.75) + lettering('MISTY STEP', 12, 14.2, 0.4) + thinning(4.4, 19.6, 17.9, 19.7, 16, 0.42);
  return svg({
    viewBox: [24, 24], width: size, height: size, cls: 'mk mk-plate',
    body: `<path fill="currentColor" fill-rule="evenodd" d="${PLATE}${cutout}"/>`,
  });
}

export default {
  id: 'plate',
  layer: 'mark',
  label: 'Nameplate',
  origin: 'new',
  summary: 'A chamfered industrial plate with a heavy M cut through it over the weather-map sign for mist; at display size the sign resolves into plate lettering and a run of thinning bars.',
  refs: [
    { name: 'Brass Hands', url: 'https://www.brasshands.com', what: 'Neo-Industrial identity: a letter used as a machined container, horizontal interruptions as flow, and spec-sheet lettering instead of ornament.' },
    { name: 'Brass Hands for Helix-DB', url: 'https://www.usbrandingstudio.com/projects/brass-hands-frames-helix-dbs-ai-infrastructure-as-industrial-machinery', what: 'A mark simple enough to hold at any scale that compresses the whole system; a row of bars thinning out as a graphic device.' },
  ],
  svg: ({ size }) => draw(size),
  css: `
html[data-mark="plate"] .brand { gap: 10px; }
html[data-mark="plate"] .brand-mark svg { display: block; width: 32px; height: 32px; }
html[data-mark="plate"] .brand-name { text-transform: uppercase; letter-spacing: 0.06em; }
`,
} satisfies MarkOption & { css: string };
