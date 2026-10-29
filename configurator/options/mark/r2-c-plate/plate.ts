// The plate, round 2: shared by r2-c-plate (the sign inside the plate) and r2-c-plate-edge (the sign cut through its edge).
// Not an option itself (no index.ts here is imported by it); both options import draw() and css() from this file.
//
// Construction. One unit u = 2 px at the 32 px nav size; every drawing's viewBox is in its own pixels.
//   Plate      Square, 16 u by 16 u (32 x 32 at nav size), every corner chamfered by one unit, a sixteenth of the side,
//              so it reads as cut metal, not an octagonal badge (MG) and not a portrait page. At 16, 24 and 32 px the
//              chamfer is a pixel stair (1, 2 and 2 px); from 48 px up it is a true 45 degree cut.
//   M          Sofia Sans Extra Condensed's own M (the baseline display face, OFL), weight 800. 32 px: cap 14, top at y 3,
//              stems snapped to whole pixels at 3 px (the bar weight) and the letter widened from 10.5 to 13 px so its
//              steep diagonals stay open. 24 px: cap 10, stems 2, width 10. 16 px: drawn cell by cell, 10 x 8.
//              From 48 px up: the font's outline, untouched and centred.
//   Mist sign  The weather-map sign for mist, two bars of equal weight with a gap of at least one bar, the lower bar
//              starting exactly one unit right of the upper one (the step). 32 px: 3 px bars at y 20 and 26, gap 3.
//              24 px: 2 px bars at y 15 and 19. From 48 px up: 2.4 thick on the 32 px centre lines (horizontals
//              lighter than the 2.56 stems), starting under the M's left stem.
//   Edge       r2-c-plate-edge cuts the upper bar out through the plate's right edge (one notch: 1 px at 16, 2 at 24,
//              3 at 32) and stops the lower bar one unit short of that edge, so the step shows at the edge itself.
//              r2-c-plate keeps both bars inside, ending under the M's right stem.
//   Pixels     16, 24 and 32 px edges land on whole pixels; the 16 px favicons have no partly covered pixel at all.
// Lockup: the plate is 32 px tall beside capitals 19.7 px tall (font-size 30 px x cap 0.655): 1.63 times the cap height,
// centred on the capitals (text-box trims the name to cap height and baseline). Gap and clear space: one chamfer plus
// one bar is 5 px at nav size; the name sits two of those (10 px) away. Phones step the name to 26 px (1.88 x).
import type { Ctx } from '../../../src/contract';
import { quiet, runs, cells, svg } from '../_lib/mark';

const n = (v: number) => +v.toFixed(3);

// Sofia Sans Extra Condensed ExtraBold "M", font units, y down from the cap line (0) to the baseline (655).
// Points are [x, y, onCurve]; consecutive off-curve points are quadratic, TrueType style.
type P = [number, number, 0 | 1];
const M_FONT: P[] = [
  [42, 655, 1], [32, 655, 0], [32, 644, 1], [41, 12, 1], [41, 0, 0], [51, 0, 1], [176, 0, 1], [186, 0, 0], [187, 9, 1],
  [276, 340, 1], [366, 9, 1], [368, 0, 0], [378, 0, 1], [503, 0, 1], [512, 0, 0], [512, 12, 1], [521, 644, 1],
  [521, 655, 0], [511, 655, 1], [409, 655, 1], [399, 655, 0], [399, 643, 1], [397, 366, 1], [396, 315, 0], [400, 232, 0],
  [403, 197, 1], [402, 197, 1], [394, 228, 0], [375, 293, 0], [365, 324, 1], [289, 567, 1], [286, 575, 0], [278, 575, 1],
  [274, 575, 1], [267, 575, 0], [265, 567, 1], [188, 323, 1], [178, 293, 0], [159, 228, 0], [151, 197, 1], [149, 197, 1],
  [153, 232, 0], [157, 315, 0], [157, 366, 1], [154, 643, 1], [154, 655, 0], [144, 655, 1],
];
const CAP = 655, M_LEFT = 32, M_RIGHT = 521;

/** TrueType-style quadratic outline to an SVG path, through a coordinate map. */
function outline(pts: P[], map: (x: number, y: number) => [number, number]): string {
  const q = pts.map(([x, y, on]) => [...map(x, y), on] as [number, number, number]);
  const mid = (a: number[], b: number[]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let d = `M${n(q[0][0])} ${n(q[0][1])}`;
  for (let i = 1; i <= q.length; i++) {
    const p = q[i % q.length];
    if (p[2]) { d += `L${n(p[0])} ${n(p[1])}`; continue; }
    const next = q[(i + 1) % q.length];
    const end = next[2] ? next : mid(p, next);
    d += `Q${n(p[0])} ${n(p[1])} ${n(end[0])} ${n(end[1])}`;
    if (next[2]) i++;
  }
  return d + 'Z';
}

/** Piecewise-linear map through sorted anchors [from, to]; flat runs snap a slanted edge onto one pixel column. */
const pw = (anchors: [number, number][]) => (x: number) => {
  if (x <= anchors[0][0]) return anchors[0][1];
  for (let i = 1; i < anchors.length; i++) {
    const [a, fa] = anchors[i - 1], [b, fb] = anchors[i];
    if (x <= b) return b === a ? fb : fa + ((x - a) / (b - a)) * (fb - fa);
  }
  return anchors[anchors.length - 1][1];
};

/**
 * The M hinted for one pixel size: stems `stem` px wide on whole pixels, total width `w`, cap height `cap`,
 * top-left at (x0, y0). The diagonals keep the font's angles between the snapped stems.
 */
export function hintedM(x0: number, y0: number, cap: number, stem: number, w: number): string {
  const k = cap / CAP;
  const fx = pw([[32, 0], [41, 0], [149, stem], [157, stem], [176, stem + 0.45], [276.5, w / 2], [377, w - stem - 0.45], [397, w - stem], [403, w - stem], [512, w], [521, w]]);
  return outline(M_FONT, (x, y) => [x0 + fx(x), y0 + y * k]);
}
/** The font's M, untouched, cap height `cap`, ink centred on cx, cap line at y0. */
export function fontM(cx: number, y0: number, cap: number): string {
  const k = cap / CAP, x0 = cx - ((M_LEFT + M_RIGHT) / 2) * k;
  return outline(M_FONT, (x, y) => [x0 + x * k, y0 + y * k]);
}

const rect = (x0: number, y0: number, x1: number, y1: number) => `M${n(x0)} ${n(y0)}H${n(x1)}V${n(y1)}H${n(x0)}Z`;

/**
 * The plate outline, clockwise, w x h with corners cut by c: a pixel stair of c one-pixel steps when `stair`, else a
 * 45 degree chamfer. `notch` [y0, y1, x] is a slot running from x out through the right edge.
 */
function plateOutline(w: number, h: number, c: number, stair: boolean, notch?: readonly [number, number, number]): string {
  // Each corner as [start, end]; a stair walks between them in c one-pixel steps, a chamfer is the straight cut.
  const steps = (x0: number, y0: number, dx: number, dy: number, xFirst: boolean): [number, number][] =>
    stair ? Array.from({ length: c }, (_, i): [number, number][] => xFirst
      ? [[x0 + i * dx, y0 + i * dy], [x0 + i * dx, y0 + (i + 1) * dy], [x0 + (i + 1) * dx, y0 + (i + 1) * dy]]
      : [[x0 + i * dx, y0 + i * dy], [x0 + (i + 1) * dx, y0 + i * dy], [x0 + (i + 1) * dx, y0 + (i + 1) * dy]]).flat()
      : [[x0, y0], [x0 + c * dx, y0 + c * dy]];
  const pts: [number, number][] = [
    ...steps(w - c, 0, 1, 1, true),
    ...(notch ? [[w, notch[0]], [notch[2], notch[0]], [notch[2], notch[1]], [w, notch[1]]] as [number, number][] : []),
    ...steps(w, h - c, -1, 1, false),
    ...steps(c, h, -1, -1, true),
    ...steps(0, c, 1, -1, false),
  ];
  const clean = pts.filter((p, i) => i === 0 || p[0] !== pts[i - 1][0] || p[1] !== pts[i - 1][1]);
  return 'M' + clean.map(([x, y]) => `${n(x)} ${n(y)}`).join('L') + 'Z';
}

// 16 px favicons, drawn on the pixel grid ('#' is metal, '.' is cut or empty): the M at x 3 to 12, the sign below it.
const M16 = ['###..######..###', '###...####...###', '###....##....###', '###..#....#..###', '###..##..##..###', '###..######..###', '###..######..###', '###..######..###'];
const PX16 = (upper: string, lower: string) => ['.##############.', '################', ...M16, '################', upper, '################', lower, '################', '.##############.'];
const PX_INSIDE = PX16('###..........###', '####.........###');
const PX_EDGE = PX16('###.............', '####...........#');

interface Geometry { s: number; stair: boolean; m: () => string; upper: readonly [number, number]; lower: readonly [number, number]; start: number; end: number; short: number }
const U = 2; // one unit at nav size; also the step at 24 px, where a unit (1.5 px) rounds to 2
/** The 32 px nav drawing; animateIn works on this geometry. */
export const NAV: Geometry = { s: 32, stair: true, m: () => hintedM(9, 3, 14, 3, 13), upper: [20, 23], lower: [26, 29], start: 9, end: 22, short: 30 };
const G24: Geometry = { s: 24, stair: true, m: () => hintedM(7, 3, 10, 2, 10), upper: [15, 17], lower: [19, 21], start: 7, end: 17, short: 22 };
const half = (489 / 655) * 7; // half the font M's ink width at cap 14
const DISPLAY: Geometry = { s: 32, stair: false, m: () => fontM(16, 3, 14), upper: [20.3, 22.7], lower: [26.3, 28.7], start: 16 - half, end: 16 + half, short: 30 };

export function draw(size: number, edge: boolean): string {
  const cls = `mk mk-r2-plate${edge ? ' mk-r2-plate-edge' : ''}`;
  if (size < 24) {
    const ink = cells(edge ? PX_EDGE : PX_INSIDE).get('#') ?? [];
    return svg({ viewBox: [16, 16], width: size, height: size, cls, crisp: true, body: `<path fill="currentColor" d="${runs(ink)}"/>` });
  }
  const g = size < 32 ? G24 : size < 48 ? NAV : DISPLAY;
  const { s, upper: u, lower: l, start, end, short } = g;
  const body = edge
    ? plateOutline(s, s, U, g.stair, [u[0], u[1], start]) + g.m() + rect(start + U, l[0], short, l[1])
    : plateOutline(s, s, U, g.stair) + g.m() + rect(start, u[0], end, u[1]) + rect(start + U, l[0], end, l[1]);
  return svg({ viewBox: [s, s], width: size, height: size, cls, body: `<path fill="currentColor" fill-rule="evenodd" d="${body}"/>` });
}

/** The upper bar's cut runs out through the edge once, in three hard steps over 420 ms; then the drawing is untouched. */
export function stepOut(el: Element, ctx: Ctx): () => void {
  const root = el.querySelector('svg');
  if (quiet(ctx) || !root || root.getAttribute('viewBox') !== `0 0 ${NAV.s} ${NAV.s}` || root.getAttribute('width') !== String(NAV.s)) return () => {};
  const plug = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  plug.setAttribute('fill', 'currentColor');
  plug.setAttribute('d', rect(NAV.start, NAV.upper[0], NAV.s, NAV.upper[1]));
  plug.style.transformBox = 'fill-box';
  plug.style.transformOrigin = '100% 50%';
  root.append(plug);
  const anim = plug.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], { duration: 420, delay: 120, easing: 'steps(3, end)', fill: 'both' });
  anim.onfinish = () => plug.remove();
  return () => { anim.cancel(); plug.remove(); };
}

/** Nav lockup: capitals 1.63 x smaller than the plate, centred on it, 10 px apart; 26 px capitals on phones. */
export const css = (id: string) => `
html[data-mark="${id}"] .brand { gap: 10px; }
html[data-mark="${id}"] .brand-mark svg { display: block; }
html[data-mark="${id}"] .brand-name { font-size: 30px; line-height: 1; text-transform: uppercase; letter-spacing: 0.035em; text-box: trim-both cap alphabetic; }
@media (max-width: 480px) { html[data-mark="${id}"] .brand-name { font-size: 26px; letter-spacing: 0.02em; } }
`;
