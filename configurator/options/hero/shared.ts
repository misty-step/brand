import type { HeroCtx } from '../../src/contract';
import { esc } from '../../src/html';

// Shared hero pieces. Not an option: discovery only loads options/<layer>/<id>/index.ts.

/** Entrance hook for the motion layer's one focal sequence; --enter-i gives the order. */
export const enter = (i: number, style = '') => `data-enter style="--enter-i:${i}${style ? `;${style}` : ''}"`;

/** Same link behaviour as the renderer: in-page anchors stay, external links open a new tab. */
export const href = (url: string) => `href="${esc(url)}"${url.startsWith('#') ? '' : ' target="_blank" rel="noopener noreferrer"'}`;

// Generic proportional advances (Helvetica, 1000 units per em): m and w run wide, i, l and t narrow.
const ADVANCE: Record<string, number> = { ' ': 278, '.': 278, ',': 278, ':': 278, ';': 278, '!': 278, '/': 278, "'": 191, '\u2019': 222, '-': 333, '(': 333, ')': 333, '$': 556, '?': 556, '&': 667, '%': 889 };
[...'abcdefghijklmnopqrstuvwxyz'].forEach((c, i) => { ADVANCE[c] = [556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500][i]; });
[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].forEach((c, i) => { ADVANCE[c] = [667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611][i]; });
const units = (s: string) => [...s].reduce((sum, c) => sum + (ADVANCE[c] ?? 556), 0);
// TypeSetter measures --display-advance as the mean per-character advance over these headlines, so
// lengths below are in that unit: "average characters" of the type option's display face.
const SAMPLE = ['Reimagine the process. Show the dollars.', 'Give your agent a method.', 'One process, rebuilt with AI. The savings in dollars.', 'Your coding agent, with a method and an outside check.', 'Reimagine one process with AI. See the savings in dollars.'];
const PER_CHAR = SAMPLE.reduce((sum, s) => sum + units(s) / [...s].length, 0) / SAMPLE.length;

/**
 * Length of one line of display text in average characters: the larger of its character count
 * (exact for monospaced faces) and its width under the proportional model (a line full of m and w
 * runs wider than its count). Multiply by --display-advance for its width in em.
 */
export function displayLength(text: string): number {
  return Math.max([...text].length, units(text) / PER_CHAR);
}

/**
 * Length of the longer line of the best two-line word break. Sizing to it (not to half the text)
 * is exact about word breaks: if that split fits the column, a greedy wrap also fits in two lines,
 * because its first line takes at least as many words and leaves at most as many for the second.
 */
export function twoLineLength(text: string): number {
  const words = text.trim().split(/\s+/);
  let best = displayLength(text.trim());
  for (let i = 1; i < words.length; i++) {
    best = Math.min(best, Math.max(displayLength(words.slice(0, i).join(' ')), displayLength(words.slice(i).join(' '))));
  }
  return Math.round(best * 100) / 100;
}

/** The h1 carries its two-line length (--h2) so CSS can keep any headline to two lines. */
export function title(ctx: HeroCtx, i = 0): string {
  const text = ctx.content.headline;
  return `<h1 class="hero-title" ${enter(i, `--h2:${twoLineLength(text)}`)}>${esc(text)}</h1>`;
}

export const sub = (ctx: HeroCtx, i = 1) => `<p class="hero-sub" ${enter(i)}>${esc(ctx.content.sub)}</p>`;

export function actions(ctx: HeroCtx, i = 2): string {
  const { primary, secondary } = ctx.content;
  return `<div class="actions" ${enter(i)}><a class="btn btn-primary" ${href(primary.href)}>${esc(primary.label)}</a>${secondary ? `<a class="btn btn-quiet" ${href(secondary.href)}>${esc(secondary.label)}</a>` : ''}</div>`;
}

export const proof = (ctx: HeroCtx, i = 3) => (ctx.content.proof ? `<p class="hero-proof" ${enter(i)}>${esc(ctx.content.proof)}</p>` : '');

/** The motion background mounts here (motionHost 'panel'). */
export const slot = () => '<div class="hero-visual" data-motion-slot aria-hidden="true"></div>';

/**
 * Display size for the h1: the type option's step, capped so the headline's best two-line break
 * (--h2, in average characters) fits its column. --display-advance is the type option's measured
 * mean advance per character at display settings (tracking and transform included); x1.1 is slack
 * for faces whose proportions differ from the model. The column must be an inline-size container.
 * The 22px floor (about 1.3 x body) keeps a 320px screen from a caption-sized headline.
 */
export function fit(scope: string, sel = '.hero-title', max = 'var(--step-5)'): string {
  return `${scope} ${sel}{font-size:max(22px,min(${max},calc(100cqi / (var(--h2,20) * var(--display-advance,.55) * 1.1))))}`;
}

/**
 * The mark at two native sizes, one per breakpoint. Scaling one SVG with CSS would put pixel marks
 * off their cell grid (192px x 2/3 gives 5.33px cells on a 24-cell mark), so each size is requested
 * from the mark layer, which snaps cells to whole pixels. Pair with markPairCss.
 */
export const markPair = (ctx: HeroCtx, desktop: number, phone: number) =>
  `<span class="mk-lg">${ctx.mark(desktop)}</span><span class="mk-sm">${ctx.mark(phone)}</span>`;
export const markPairCss = (scope: string) =>
  `${scope} .mk-lg,${scope} .mk-lg svg,${scope} .mk-sm svg{display:block}${scope} .mk-sm{display:none}@media (max-width:700px){${scope} .mk-lg{display:none}${scope} .mk-sm{display:block}}`;

/**
 * The brand name at display scale, decorative (the nav and h1 carry it for assistive tech). A drawn
 * wordmark keeps its viewBox ratio as --wm-r so CSS can cap its height and still align it left; a
 * set name carries its length as --wm-n so CSS sizes it to the measure with --display-advance.
 */
export function bigName(ctx: HeroCtx, cls: string): string {
  const mark = ctx.wordmark();
  if (mark.trimStart().startsWith('<svg')) {
    const vb = mark.match(/viewBox="\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/);
    const ratio = vb && +vb[2] > 0 ? +vb[1] / +vb[2] : 6;
    return `<div class="${cls} bn-drawn" aria-hidden="true" style="--wm-r:${ratio.toFixed(3)}">${mark}</div>`;
  }
  return `<div class="${cls}" aria-hidden="true"><span class="bn-set" style="--wm-n:${Math.round(displayLength(ctx.brand) * 100) / 100}">${mark}</span></div>`;
}
/** CSS for bigName: `fill` is the share of the measure the name spans, `cap` the tallest it may get. */
export function bigNameCss(scope: string, sel: string, fill: string, cap: string): string {
  return `${scope} ${sel}{container-type:inline-size;overflow-x:clip;line-height:0}
${scope} ${sel}.bn-drawn svg{display:block;width:min(100%,calc(${cap} * var(--wm-r)));height:auto}
${scope} ${sel} .bn-set{display:block;width:max-content;margin-left:-.04em;padding-block:.04em .08em;font-family:var(--font-display);font-weight:var(--display-weight);letter-spacing:var(--display-tracking);text-transform:var(--display-transform);line-height:.8;white-space:nowrap;font-size:min(${cap},calc(${fill} / (var(--wm-n) * var(--display-advance,.6))))}`;
}

/** Inline padding that lines the hero up with the layout's container (layouts set --edge). */
export const EDGE = 'var(--edge,max(20px,(100% - 1280px) / 2))';
export const GUTTER = 'var(--gutter,20px)';
