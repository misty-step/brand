import type { MarkOption } from '../../../src/contract';
import { esc } from '../../../src/html';
import { bayer, cell, cut, quiet, runs, settle, setPixels, svg, type Cell, type PixelFont } from '../_lib/mark';

// Ported from Direction A (Tiling): a binary split of three panes. The tall pane is ink, the lit pane is the
// accent, the third pane is ordered-dither mist. Drawn at 16px first; 10 cells for the nav; 32 cells at display
// size, where the mist thickens toward the ground the way A's field did.

type Tile = { n: number; ink: Cell[]; lamp: Cell[]; mist: Cell[] };

function tile(n: number, split: number, gap: number, density: (y: number) => number): Tile {
  const ink: Cell[] = [], lamp: Cell[] = [], mist: Cell[] = [];
  const right = split + gap;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if (x < split) ink.push([x, y]);
    else if (x >= right && y < split) lamp.push([x, y]);
    else if (x >= right && y >= right && bayer(x - right, y - right) < density(y - right) * 16) mist.push([x, y]);
  }
  return { n, ink, lamp, mist };
}

// 16 and 10 cells keep A's 50% checkerboard; the display grid ramps from 30% to 85% coverage downward.
const FAVICON = tile(16, 7, 1, () => 0.5);
const NAV = tile(10, 4, 1, () => 0.5);
const DISPLAY = tile(32, 14, 2, y => 0.3 + 0.55 * (y / 15));

function draw(t: Tile, px: number): string {
  // Mist cells are grouped by threshold so animateIn can land them in dither order.
  const groups = new Map<number, Cell[]>();
  for (const c of t.mist) { const k = bayer(c[0], c[1]); (groups.get(k) ?? groups.set(k, []).get(k)!).push(c); }
  const mist = [...groups.entries()].sort((a, b) => a[0] - b[0]).map(([k, list]) => `<path data-b="${k}" d="${runs(list)}"/>`).join('');
  return svg({
    viewBox: [t.n, t.n], width: t.n * px, height: t.n * px, cls: 'mk mk-tile', crisp: true,
    body: `<path fill="currentColor" d="${runs(t.ink)}"/><path style="fill:var(--accent)" d="${runs(t.lamp)}"/><g fill="currentColor">${mist}</g>`,
  });
}

// A's pixel capitals: two-cell strokes, seven rows, standing in a two-row fog band. A, C and K are new, drawn to match.
const CAPS: PixelFont = { height: 7, space: 2, tracking: 1, glyphs: {
  M: ['##....##', '###..###', '########', '##.##.##', '##....##', '##....##', '##....##'],
  I: ['##', '##', '##', '##', '##', '##', '##'],
  S: ['.#####', '##....', '##....', '.####.', '....##', '....##', '#####.'],
  T: ['######', '..##..', '..##..', '..##..', '..##..', '..##..', '..##..'],
  Y: ['##..##', '##..##', '##..##', '.####.', '..##..', '..##..', '..##..'],
  E: ['#####', '##...', '##...', '####.', '##...', '##...', '#####'],
  P: ['#####.', '##..##', '##..##', '#####.', '##....', '##....', '##....'],
  A: ['.####.', '##..##', '##..##', '######', '##..##', '##..##', '##..##'],
  C: ['.#####', '##....', '##....', '##....', '##....', '##....', '.#####'],
  K: ['##..##', '##.##.', '####..', '###...', '####..', '##.##.', '##..##'],
} };

function wordmark(name: string): string {
  const set = setPixels(name, CAPS, true);
  if (!set) return esc(name);
  const fog: Cell[] = [];
  for (let x = 0; x < set.width; x++) { if (x % 4 === 3) fog.push([x, 7]); if (x % 2 === 0) fog.push([x, 8]); }
  const groups = new Map<number, Cell[]>();
  for (const c of set.cells) { const k = bayer(c[0], c[1]); (groups.get(k) ?? groups.set(k, []).get(k)!).push(c); }
  const letters = [...groups.entries()].sort((a, b) => a[0] - b[0]).map(([k, list]) => `<path data-b="${k}" d="${runs(list)}"/>`).join('');
  return svg({
    viewBox: [set.width, 10], width: set.width * 2, height: 20, cls: 'mk-wm mk-tile-wm', crisp: true, label: name,
    body: `<g fill="currentColor">${letters}<path data-fog="" d="${runs(fog)}"/></g>`,
  });
}

export default {
  id: 'tile',
  layer: 'mark',
  label: 'Tile',
  origin: 'A',
  summary: 'Three tiled panes, one lit and one dithered into mist, beside pixel capitals standing in fog: the studio as a workspace you step between.',
  refs: [
    { name: 'Omarchy', url: 'https://omarchy.org', what: 'A tiling workspace worn as identity, and a logotype drawn cell by cell instead of set in a font.' },
    { name: 'Making Software', url: 'https://makingsoftware.com', what: 'A pixel wordmark that arrives once on load and then holds still.' },
  ],
  svg: ({ size }) => size <= 20 ? draw(FAVICON, 1) : size < 64 ? draw(NAV, cell(size, 16, 2)) : draw(DISPLAY, cell(size, 32)),
  wordmark: ({ name }) => wordmark(name),
  // The signature from A: letters and mist land in Bayer order, sixteen hard cuts 40ms apart, fog last, settled by 720ms.
  animateIn(el, ctx) {
    if (quiet(ctx)) return () => {};
    const brand = el.closest('.brand') ?? el;
    const anims: Animation[] = [];
    brand.querySelectorAll('[data-b]').forEach(p => anims.push(cut(p, 80 + Number(p.getAttribute('data-b')) * 40)));
    brand.querySelectorAll('[data-fog]').forEach(p => anims.push(cut(p, 720)));
    return settle(anims);
  },
  css: `
html[data-mark="tile"] .brand { gap: 10px; }
html[data-mark="tile"] .brand-mark svg, html[data-mark="tile"] .brand-name svg { display: block; }
html[data-mark="tile"] .brand-mark svg { width: 20px; height: 20px; }
html[data-mark="tile"] .brand-name svg { width: auto; height: 20px; }
html[data-mark="tile"] .brand-name { line-height: 0; }
@media (max-width: 480px) { html[data-mark="tile"] .brand-mark { display: none; } }
`,
} satisfies MarkOption & { css: string };
