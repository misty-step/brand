import type { MarkOption } from '../../../src/contract';
import { esc } from '../../../src/html';
import { cell, cut, quiet, runs, settle, setPixels, svg, type Cell, type PixelFont } from '../_lib/mark';

// A drawn pixel logotype in Omarchy's manner, lowercase and chunky, coloured in horizontal tonal bands.
// Omarchy bands its brand colour light to dark for depth; here the bands are mist settling: each letter is
// solid at the top and thins toward the ground, so the name reads as standing in fog. pi.dev's lesson is the
// entrance: the bands build once, bottom to top, then everything holds still.

// 13 rows: ascenders 0-2, x-height 3-9, descenders 10-12. Two-cell strokes, one-cell chamfers.
const LOWER: PixelFont = { height: 13, space: 3, tracking: 1, glyphs: {
  m: ['..........', '..........', '..........', '########..', '##########', '##..##..##', '##..##..##', '##..##..##', '##..##..##', '##..##..##', '..........', '..........', '..........'],
  i: ['..', '##', '..', '##', '##', '##', '##', '##', '##', '##', '..', '..', '..'],
  s: ['.......', '.......', '.......', '.######', '##.....', '##.....', '.#####.', '.....##', '.....##', '######.', '.......', '.......', '.......'],
  t: ['......', '.##...', '.##...', '######', '.##...', '.##...', '.##...', '.##...', '.##...', '..####', '......', '......', '......'],
  y: ['.......', '.......', '.......', '##...##', '##...##', '##...##', '##...##', '##...##', '##...##', '.######', '.....##', '.....##', '######.'],
  e: ['........', '........', '........', '.######.', '##....##', '##....##', '########', '##......', '##......', '.#######', '........', '........', '........'],
  p: ['........', '........', '........', '#######.', '##....##', '##....##', '##....##', '##....##', '##....##', '#######.', '##......', '##......', '##......'],
  a: ['........', '........', '........', '.######.', '......##', '.#######', '##....##', '##....##', '##....##', '.#######', '........', '........', '........'],
  c: ['.......', '.......', '.......', '.######', '##.....', '##.....', '##.....', '##.....', '##.....', '.######', '.......', '.......', '.......'],
  k: ['##......', '##......', '##......', '##...##.', '##..##..', '##.##...', '#####...', '##.##...', '##..##..', '##...##.', '........', '........', '........'],
} };

// Tonal bands by row, solid at the top, thinning toward the ground. Every band stays a tint of currentColor.
const BANDS: readonly { rows: readonly [number, number]; opacity: number }[] = [
  { rows: [0, 5], opacity: 1 }, { rows: [6, 7], opacity: 0.8 }, { rows: [8, 9], opacity: 0.64 }, { rows: [10, 12], opacity: 0.5 },
];

function banded(cells: Cell[], offsetY = 0): string {
  return BANDS.map((b, i) => {
    const band = cells.filter(([, y]) => y + offsetY >= b.rows[0] && y + offsetY <= b.rows[1]);
    return band.length ? `<path data-band="${i}" fill="currentColor"${b.opacity < 1 ? ` fill-opacity="${b.opacity}"` : ''} d="${runs(band)}"/>` : '';
  }).join('');
}

function wordmark(name: string): string {
  const set = setPixels(name, LOWER, false);
  if (!set) return esc(name);
  return svg({
    viewBox: [set.width, 13], width: set.width * 2, height: 26, cls: 'mk-wm mk-banded-wm', crisp: true, label: name,
    body: banded(set.cells),
  });
}

// The symbol is the logotype's own m, banded the same way, sitting on the ground line of its square.
const M = setPixels('m', LOWER, false)!.cells.map(([x, y]): Cell => [x, y - 3]); // x-height rows only: 10 x 7
// A wider 14 x 10 m for the favicon: two-pixel strokes with four-pixel counters stay open in a browser tab.
const FAV: Cell[] = [];
['############..', '##############', ...Array<string>(8).fill('##....##....##')]
  .forEach((row, y) => [...row].forEach((c, x) => { if (c === '#') FAV.push([x + 1, y + 3]); }));

function symbol(size: number): string {
  if (size <= 20) {
    // Placed on rows 3-12 but banded as rows 1-10, so a tab still sees a mostly solid m with misty feet.
    return svg({ viewBox: [16, 16], width: 16 * cell(size, 16), height: 16 * cell(size, 16), cls: 'mk mk-banded', crisp: true, body: banded(FAV, -2) });
  }
  const px = cell(size, 12, 2);
  const placed = M.map(([x, y]): Cell => [x + 1, y + 3]);
  return svg({ viewBox: [12, 12], width: 12 * px, height: 12 * px, cls: 'mk mk-banded', crisp: true, body: banded(placed, 0) });
}

export default {
  id: 'banded',
  layer: 'mark',
  label: 'Banded pixel',
  origin: 'new',
  summary: 'A drawn pixel logotype in lowercase, banded from solid ink at the top to mist at the ground, with its own m as the symbol: 8-bit type that reads as a name standing in fog.',
  refs: [
    { name: 'Omarchy', url: 'https://omarchy.org', what: 'A custom pixel logotype painted in horizontal tonal bands of one colour, used as the identity in every placement.' },
    { name: 'pi.dev', url: 'https://pi.dev', what: 'Pixel type that builds once on load and then holds completely still.' },
  ],
  svg: ({ size }) => symbol(size),
  wordmark: ({ name }) => wordmark(name),
  // Once per load: the bands land from the ground up, four hard cuts 90ms apart, settled by 360ms.
  animateIn(el, ctx) {
    if (quiet(ctx)) return () => {};
    const brand = el.closest('.brand') ?? el;
    const anims: Animation[] = [];
    brand.querySelectorAll('[data-band]').forEach(p => anims.push(cut(p, 90 + (3 - Number(p.getAttribute('data-band'))) * 90)));
    return settle(anims);
  },
  css: `
html[data-mark="banded"] .brand { gap: 10px; }
html[data-mark="banded"] .brand-mark svg, html[data-mark="banded"] .brand-name svg { display: block; }
html[data-mark="banded"] .brand-mark svg { width: 24px; height: 24px; }
html[data-mark="banded"] .brand-name svg { width: auto; height: 26px; }
html[data-mark="banded"] .brand-name { line-height: 0; }
@media (max-width: 480px) { html[data-mark="banded"] .brand-mark { display: none; } }
`,
} satisfies MarkOption & { css: string };
