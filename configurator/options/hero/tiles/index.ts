import type { HeroCtx, HeroOption } from '../../../src/contract';
import { FACTS } from '../../../src/content/facts';
import { esc } from '../../../src/html';
import { title, sub, actions, proof, slot, enter, fit, EDGE, GUTTER } from '../shared';

const S = 'html[data-hero="tiles"]';

/** The offer's three steps (studio) or the method path (stack) as the bottom row of panes. */
function strip(ctx: HeroCtx): string {
  const items = ctx.page === 'stack'
    ? FACTS.nodes.map(n => `<li><p class="ti-k">${esc(n.label)}${n.count ? ` <span class="ti-count">${esc(n.count)}</span>` : ''}</p><p class="ti-v">${esc(n.body)}</p></li>`)
    : FACTS.offer.steps.map(s => `<li><p class="ti-k">${esc(s.title)}</p><p class="ti-v">${esc(s.terms)}</p></li>`);
  return `<ol class="ti-strip" data-n="${items.length}" ${enter(5)}>${items.join('')}</ol>`;
}

export default {
  id: 'tiles',
  layer: 'hero',
  label: 'Tiles',
  summary: 'A tiled workspace: unequal panes split by hairline gaps, the statement in the wide pane, the name resting at the foot of a motion-field pane, and the offer or method path as the bottom row.',
  origin: 'A',
  refs: [
    { name: 'Omarchy', url: 'https://omarchy.org', what: 'The tiling window manager it ships: panes of unequal size separated by thin gaps, the screen divided rather than decorated.' },
    { name: 'Linear', url: 'https://linear.app', what: 'Panels separated by hairlines and raised only by lightness steps, never by shadow.' },
  ],
  motionHost: 'panel',
  render: ctx => {
    const mark = ctx.wordmark();
    const word = mark.trimStart().startsWith('<svg') ? `<div class="ti-word ti-drawn" aria-hidden="true">${mark}</div>` : `<div class="ti-word" aria-hidden="true"><span class="ti-set-name" style="--wm-n:${[...ctx.brand].length}">${mark}</span></div>`;
    return `<div class="ti-set"><div class="ti-copy">${title(ctx)}${sub(ctx)}${actions(ctx)}${proof(ctx)}</div><div class="ti-field" ${enter(4)}>${slot()}${word}</div>${strip(ctx)}</div>`;
  },
  css: `${S} .hero{padding:clamp(16px,3vh,32px) ${EDGE} clamp(48px,9vh,96px)}
${S} .ti-set{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:max(var(--rule,1px),1px);overflow:hidden;background:var(--line);border:max(var(--rule,1px),1px) solid var(--line);border-radius:var(--radius,0)}
${S} .ti-copy{grid-column:span 8;container-type:inline-size;padding:clamp(28px,4vw,56px);background:var(--bg)}
${fit(S)}
${S} .hero-sub{margin-top:20px;max-width:min(var(--measure,60ch),100%);font-size:var(--step-1);color:var(--ink-2)}
${S} .actions{margin-top:32px}
${S} .hero-proof{margin-top:20px;font-size:var(--step--1);color:var(--ink-2)}
${S} .ti-field{grid-column:span 4;position:relative;isolation:isolate;container-type:inline-size;display:flex;align-items:flex-end;min-height:360px;padding:clamp(16px,2vw,28px);background:var(--bg-3);color:var(--ink)}
${S} .ti-field>.hero-visual{position:absolute;inset:0;z-index:-1;overflow:hidden}
${S} .ti-word{width:100%;overflow-x:clip;line-height:0}
${S} .ti-drawn svg{display:block;width:100%;height:auto}
${S} .ti-set-name{display:block;width:max-content;margin-left:-.04em;padding-block:.04em .06em;font-family:var(--font-display);font-weight:var(--display-weight);letter-spacing:var(--display-tracking);text-transform:var(--display-transform);line-height:.8;white-space:nowrap;font-size:calc(88cqi / (var(--wm-n) * var(--display-advance,.6)))}
${S} .ti-strip{grid-column:1/-1;display:grid;grid-template-columns:subgrid;margin:0}
${S} .ti-strip>li{grid-column:span 4;padding:18px clamp(16px,2vw,28px) 22px;background:var(--bg)}
${S} .ti-strip[data-n="3"]>li:nth-child(1){grid-column:span 3}
${S} .ti-strip[data-n="3"]>li:nth-child(2){grid-column:span 5}
${S} .ti-strip[data-n="6"]>li{grid-column:span 2}
${S} .ti-k{font-family:var(--font-ui);font-size:var(--step--1);color:var(--ink-2)}
${S} .ti-count{font-variant-numeric:tabular-nums;color:var(--ink)}
${S} .ti-v{margin-top:6px;font-size:var(--step-1);line-height:1.3;text-wrap:balance}
${S} .ti-strip[data-n="6"] .ti-v{font-size:var(--step--1);color:var(--ink)}
@media (max-width:899px){${S} .ti-copy{grid-column:1/-1}
${S} .ti-field{grid-column:1/-1;order:-1;min-height:168px}
${S} .ti-strip[data-n="6"]>li{grid-column:span 4}}
@media (max-width:700px){${S} .hero{padding:12px ${GUTTER} 48px}
${S} .ti-copy{padding:24px 16px 28px}
${S} .actions{flex-direction:column;align-items:stretch}
${S} .ti-strip>li,${S} .ti-strip[data-n="3"]>li:nth-child(n),${S} .ti-strip[data-n="6"]>li{grid-column:1/-1;display:grid;grid-template-columns:minmax(0,2fr) minmax(0,3fr);gap:12px;padding:12px 16px}
${S} .ti-v,${S} .ti-strip[data-n="6"] .ti-v{margin-top:0;font-size:var(--step-0)}}`,
} satisfies HeroOption;
