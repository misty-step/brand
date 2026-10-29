import type { MarkOption } from '../../../src/contract';
import { esc } from '../../../src/html';
import { EASE_OUT, quiet, settle, svg } from '../_lib/mark';

// A drawn lowercase wordmark in Stripe's tradition: the name itself is the logo, set tight, with one detail
// to remember it by. Here the dot of the i has taken a short step up and to the right and left a faint trace
// of mist where it was: the spell, at the scale of a single letter.
//
// Monoline construction: stroke W on an H-unit x-height (y = 0 is the x-height line, y = H the baseline).
// Bowls are circles on one centreline radius; diagonals are polygons so every terminal is cut flat.

const W = 2.4, H = 11, h = W / 2, C = H / 2, R = (H - W) / 2, A = 3, DESC = 15.6;
const n = (v: number) => +v.toFixed(3);
const on = (cx: number, cy: number, rx: number, ry: number, deg: number) =>
  `${n(cx + rx * Math.cos((deg * Math.PI) / 180))} ${n(cy + ry * Math.sin((deg * Math.PI) / 180))}`;
/** A slanted stroke as a polygon with horizontal cuts: centreline (x0,y0) to (x1,y1). */
function slant(x0: number, y0: number, x1: number, y1: number): string {
  const half = (W / 2) * Math.hypot(x1 - x0, y1 - y0) / Math.abs(y1 - y0);
  return `M${n(x0 - half)} ${y0}H${n(x0 + half)}L${n(x1 + half)} ${y1}H${n(x1 - half)}Z`;
}

type Glyph = { advance: number; stroke?: string; fill?: string };
const S = { cx: 3.75, top: { rx: 2.45, ry: (C - h) / 2 }, bottom: { rx: 2.6, ry: (C - h) / 2 } };
const GLYPHS: Record<string, Glyph> = {
  m: { advance: 4 * A + W + 2.1, stroke: `M${h} 0V${H}M${h} ${h + A}A${A} ${A} 0 0 1 ${h + 2 * A} ${h + A}V${H}M${h + 2 * A} ${h + A}A${A} ${A} 0 0 1 ${h + 4 * A} ${h + A}V${H}` },
  i: { advance: W + 2.1, stroke: `M${h} 0V${H}` },
  s: {
    advance: S.cx + S.bottom.rx + h + 1.9,
    stroke: `M${on(S.cx, h + S.top.ry, S.top.rx, S.top.ry, -34)}A${S.top.rx} ${S.top.ry} 0 1 0 ${S.cx} ${C}`
      + `A${S.bottom.rx} ${S.bottom.ry} 0 1 1 ${on(S.cx, C + S.bottom.ry, S.bottom.rx, S.bottom.ry, 146)}`,
  },
  t: { advance: 7.4, stroke: `M2.5 -2.9V${n(H - h - 2.2)}A2.2 2.2 0 0 0 4.7 ${H - h}H6M0 ${h}H5.7` },
  y: { advance: 9.4, fill: slant(6.85, 0, 2.05, DESC) + slant(1.25, 0, 3.75, 10.5) },
  e: { advance: H + 1.9, stroke: `M${h} ${C}H${H - h}A${R} ${R} 0 1 0 ${on(C, C, R, R, 42)}` },
  p: { advance: H + 1.9, stroke: `M${h} 0V${DESC}M${h} ${C}A${R} ${R} 0 1 1 ${H - h} ${C}A${R} ${R} 0 1 1 ${h} ${C}` },
  a: { advance: H + 2.1, stroke: `M${H - h} 0V${H}M${H - h} ${C}A${R} ${R} 0 1 0 ${h} ${C}A${R} ${R} 0 1 0 ${H - h} ${C}` },
  c: { advance: H + 0.6, stroke: `M${on(C, C, R, R, -42)}A${R} ${R} 0 1 0 ${on(C, C, R, R, 42)}` },
  k: { advance: 10.2, stroke: `M${h} -4.4V${H}`, fill: slant(7.8, 0, 2.6, 6.3) + slant(4.4, 5.2, 8.6, H) },
};
const SPACE = 4.4;
const DOT = 1.45;                      // tittle radius, a touch heavier than the stroke so it holds its own
const HOME = { x: h, y: -2.9 };        // where an i's dot belongs
const STEP = { x: 3.4, y: -1.6 };      // how far this one moved

// Offset every absolute x in a path by dx (arcs move only their end point).
function shift(d: string, dx: number): string {
  return d.replace(/([MLHVAZ])([^MLHVAZ]*)/g, (_, cmd: string, args: string) => {
    const v = args.trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if (cmd === 'M' || cmd === 'L') return `${cmd}${n(v[0] + dx)} ${v[1]}`;
    if (cmd === 'H') return `${cmd}${n(v[0] + dx)}`;
    if (cmd === 'A') return `${cmd}${v[0]} ${v[1]} ${v[2]} ${v[3]} ${v[4]} ${n(v[5] + dx)} ${v[6]}`;
    return cmd + args;
  });
}

function set(name: string): { body: string; width: number } | null {
  let x = 0, strokes = '', fills = '', dots = '', stepped = false;
  for (const ch of name.toLowerCase()) {
    if (ch === ' ') { x += SPACE; continue; }
    const g = GLYPHS[ch];
    if (!g) return null;
    if (g.stroke) strokes += shift(g.stroke, x);
    if (g.fill) fills += shift(g.fill, x);
    if (ch === 'i' && !stepped) {
      stepped = true;
      // The home dot is drawn but clear: the entrance shows it, then lets it thin to nothing.
      dots += `<circle cx="${n(x + HOME.x)}" cy="${HOME.y}" r="${DOT}" fill="currentColor" fill-opacity="0" data-home=""/>`
        + `<circle cx="${n(x + HOME.x + STEP.x)}" cy="${n(HOME.y + STEP.y)}" r="${DOT}" style="fill:var(--accent-2)" data-step=""/>`;
    } else if (ch === 'i') dots += `<circle cx="${n(x + HOME.x)}" cy="${HOME.y}" r="${DOT}" fill="currentColor"/>`;
    x += g.advance;
  }
  return {
    width: n(x - 2),
    body: `<path d="${strokes}" fill="none" stroke="currentColor" stroke-width="${W}" stroke-linecap="butt"/><path d="${fills}" fill="currentColor"/>${dots}`,
  };
}

const TOP = -6.3, BOTTOM = 16; // the stepped dot to the descender of y and p
function wordmark(name: string): string {
  const s = set(name);
  if (!s) return esc(name);
  const w = n(s.width + 0.4), height = n(BOTTOM - TOP);
  return svg({
    viewBox: [w, height], width: Math.round((w / height) * 26), height: 26, cls: 'mk-wm mk-lettered-wm', label: name,
    body: `<g transform="translate(0.2 ${-TOP})">${s.body}</g>`,
  });
}

// The symbol is the wordmark's own m, its last stem standing in for the i, with the dot just stepped off it:
// "mi", the way Stripe's favicon is its own s. At favicon size it reverses out of an accent tile to hold in a tab.
const NUDGE = 2; // the dot's step off the stem in the symbol (smaller than in the wordmark, so it still reads as the i's)
function symbol(size: number): string {
  const m = GLYPHS.m.stroke!;
  const dotX = h + 4 * A + NUDGE, dotY = HOME.y + STEP.y;
  if (size <= 20) {
    return svg({
      viewBox: [24, 24], width: size, height: size, cls: 'mk mk-lettered',
      body: `<rect width="24" height="24" style="fill:var(--accent)"/><g transform="translate(3.5 9.65)"><path d="${m}" fill="none" stroke-width="3" style="stroke:var(--accent-ink)"/><circle cx="${dotX}" cy="${dotY}" r="1.8" style="fill:var(--accent-ink)"/></g>`,
    });
  }
  return svg({
    viewBox: [24, 24], width: size, height: size, cls: 'mk mk-lettered',
    body: `<g transform="translate(2 8.97) scale(1.2)"><path d="${m}" fill="none" stroke="currentColor" stroke-width="${W}"/><circle cx="${dotX}" cy="${dotY}" r="${DOT}" style="fill:var(--accent-2)"/></g>`,
  });
}

export default {
  id: 'lettered',
  layer: 'mark',
  label: 'Lettered',
  origin: 'new',
  summary: 'The name drawn as one lowercase geometric wordmark whose single detail is the dot of the i, caught one short step up and ahead of its stem: the spell at the scale of a letter.',
  refs: [
    { name: 'Stripe', url: 'https://stripe.com', what: 'A custom-drawn lowercase wordmark is the whole logo in the nav, with no symbol beside it, and the favicon is a separate solid tile in the brand colour.' },
    { name: 'Vercel', url: 'https://vercel.com', what: 'Geometric construction from circles and straight strokes, with nothing decorative to lose at small sizes.' },
  ],
  svg: ({ size }) => symbol(size),
  wordmark: ({ name }) => wordmark(name),
  // Once per load: the dot sits at home, then steps; the place it left thins to mist.
  animateIn(el, ctx) {
    if (quiet(ctx)) return () => {};
    const brand = el.closest('.brand') ?? el;
    const home = brand.querySelector('.brand-name [data-home]'), step = brand.querySelector('.brand-name [data-step]');
    if (!home || !step) return () => {};
    return settle([
      home.animate([{ fillOpacity: 1 }, { fillOpacity: 1, offset: 0.4 }, { fillOpacity: 0 }], { duration: 560, delay: 160, easing: EASE_OUT, fill: 'backwards' }),
      step.animate([{ visibility: 'hidden' }, { visibility: 'visible' }], { duration: 1, delay: 380, easing: 'steps(1, end)', fill: 'backwards' }),
    ]);
  },
  css: `
html[data-mark="lettered"] .brand-mark { display: none; }
html[data-mark="lettered"] .brand-name { line-height: 0; }
html[data-mark="lettered"] .brand-name svg { display: block; overflow: visible; width: auto; height: 26px; }
`,
} satisfies MarkOption & { css: string };
