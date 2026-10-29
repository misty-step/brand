// Shared drawing and motion helpers for the mark options.
// This directory has no index.ts, so the option registry never loads it as an option.
import type { Ctx } from '../../../src/contract';
import { esc } from '../../../src/html';

export type Cell = readonly [x: number, y: number];

/** Parse ASCII art into cell lists keyed by character. '.' and ' ' are empty. */
export function cells(rows: readonly string[]): Map<string, Cell[]> {
  const out = new Map<string, Cell[]>();
  rows.forEach((row, y) => [...row].forEach((ch, x) => {
    if (ch === '.' || ch === ' ') return;
    const list = out.get(ch) ?? [];
    list.push([x, y]);
    out.set(ch, list);
  }));
  return out;
}

/** One path of horizontal runs: the smallest exact description of a set of grid cells. */
export function runs(list: Iterable<Cell>): string {
  const rows = new Map<number, number[]>();
  for (const [x, y] of list) (rows.get(y) ?? rows.set(y, []).get(y)!).push(x);
  let d = '';
  for (const y of [...rows.keys()].sort((a, b) => a - b)) {
    const xs = [...new Set(rows.get(y)!)].sort((a, b) => a - b);
    for (let i = 0; i < xs.length; i++) {
      let j = i;
      while (j + 1 < xs.length && xs[j + 1] === xs[j] + 1) j++;
      d += `M${xs[i]} ${y}h${xs[j] - xs[i] + 1}v1h-${xs[j] - xs[i] + 1}z`;
      i = j;
    }
  }
  return d;
}

/** One rect per cell, for marks that animate cell by cell. */
export const rects = (list: Iterable<Cell>, attrs: (c: Cell, i: number) => string = () => ''): string =>
  [...list].map((c, i) => `<rect x="${c[0]}" y="${c[1]}" width="1" height="1"${attrs(c, i)}/>`).join('');

export interface SvgOpts {
  viewBox: readonly [number, number];
  width: number;
  height: number;
  cls: string;
  body: string;
  crisp?: boolean;
  /** Only wordmarks are named; symbols sit beside the name or decorate a hero, so they stay hidden from assistive tech. */
  label?: string;
}

export function svg(o: SvgOpts): string {
  const a11y = o.label ? `role="img" aria-label="${esc(o.label)}"` : 'aria-hidden="true"';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${o.viewBox[0]} ${o.viewBox[1]}" width="${o.width}" height="${o.height}" class="${o.cls}"${o.crisp ? ' shape-rendering="crispEdges"' : ''} ${a11y} focusable="false">${o.body}</svg>`;
}

/** Ordered dither threshold map (Bayer 4x4), values 0..15. */
export const BAYER4: readonly (readonly number[])[] = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
export const bayer = (x: number, y: number): number => BAYER4[y & 3][x & 3];

/** Whole CSS pixels per cell, so pixel marks stay crisp at DPR 1 and 2. */
export const cell = (size: number, count: number, min = 1): number => Math.max(min, Math.floor(size / count));

/** Glyph sets for pixel wordmarks. Returns null when a name uses a letter the set does not draw. */
export interface PixelFont { height: number; space: number; tracking: number; glyphs: Record<string, readonly string[]> }
export function setPixels(name: string, font: PixelFont, upper: boolean): { cells: Cell[]; width: number } | null {
  const text = upper ? name.toUpperCase() : name.toLowerCase();
  const out: Cell[] = [];
  let x = 0;
  for (const ch of text) {
    if (ch === ' ') { x += font.space; continue; }
    const g = font.glyphs[ch];
    if (!g) return null;
    g.forEach((row, y) => [...row].forEach((c, dx) => { if (c !== '.') out.push([x + dx, y]); }));
    x += g[0].length + font.tracking;
  }
  return { cells: out, width: Math.max(0, x - font.tracking) };
}

/** True when the visitor or the lab asked for less motion. animateIn never runs then, this is a second guard. */
export const quiet = (ctx: Ctx): boolean =>
  ctx.reducedMotion || (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);

/** Cancel returns every animated node to its natural, finished state at once. */
export const settle = (anims: Animation[]) => () => { for (const a of anims) a.cancel(); };

/** A hard cut from hidden to shown at `delay` ms: the pixel state flip the canon asks for. */
export const cut = (el: Element, delay: number): Animation =>
  el.animate([{ visibility: 'hidden' }, { visibility: 'visible' }], { duration: 1, delay, easing: 'steps(1, end)', fill: 'backwards' });

export const EASE_OUT = 'cubic-bezier(.23,1,.32,1)';
export const EASE_EXPO = 'cubic-bezier(.16,1,.3,1)';
