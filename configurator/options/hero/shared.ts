import type { HeroCtx } from '../../src/contract';
import { esc } from '../../src/html';

// Shared hero pieces. Not an option: discovery only loads options/<layer>/<id>/index.ts.

/** Entrance hook for the motion layer's one focal sequence; --enter-i gives the order. */
export const enter = (i: number, style = '') => `data-enter style="--enter-i:${i}${style ? `;${style}` : ''}"`;

/** Same link behaviour as the renderer: in-page anchors stay, external links open a new tab. */
export const href = (url: string) => `href="${esc(url)}"${url.startsWith('#') ? '' : ' target="_blank" rel="noopener noreferrer"'}`;

/** The h1 carries its own length (--hl) so CSS can keep any headline to two lines. */
export function title(ctx: HeroCtx, i = 0): string {
  const text = ctx.content.headline;
  return `<h1 class="hero-title" ${enter(i, `--hl:${[...text].length}`)}>${esc(text)}</h1>`;
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
 * Display size for the h1: the type option's step, capped so the headline fits two lines of its
 * column. Two balanced lines need about chars x 0.6 x advance em once word breaks eat the slack,
 * where --display-advance is the type option's measured average advance per character at display
 * settings (tracking and transform included). The column must be an inline-size container. 24px
 * floor so a 320px screen never gets a caption-sized headline.
 */
export function fit(scope: string, sel = '.hero-title', max = 'var(--step-5)'): string {
  return `${scope} ${sel}{font-size:max(24px,min(${max},calc(100cqi / (var(--hl,32) * var(--display-advance,.55) * .6))))}`;
}
/** Inline padding that lines the hero up with the layout's container (layouts set --edge). */
export const EDGE = 'var(--edge,max(20px,(100% - 1280px) / 2))';
export const GUTTER = 'var(--gutter,20px)';
