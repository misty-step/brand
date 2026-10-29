import type { HeroCtx, HeroOption } from '../../../src/contract';
import { title, sub, actions, proof, fit, EDGE, GUTTER } from '../shared';

const S = 'html[data-hero="wordmark"]';

/** The brand name across the full measure: a drawn wordmark scales by its viewBox, a set name by its own length. */
function name(ctx: HeroCtx): string {
  const mark = ctx.wordmark();
  return mark.trimStart().startsWith('<svg')
    ? `<div class="wm-name wm-drawn" aria-hidden="true">${mark}</div>`
    : `<div class="wm-name" aria-hidden="true"><span class="wm-set" style="--wm-n:${[...ctx.brand].length}">${mark}</span></div>`;
}

export default {
  id: 'wordmark',
  layer: 'hero',
  label: 'Wordmark',
  summary: 'The name is the hero image: the wordmark runs the full width of the first screen over the motion field, then a ruled line and the statement, sentence and actions beneath it.',
  origin: 'new',
  refs: [
    { name: 'Omarchy', url: 'https://omarchy.org', what: 'A custom logotype as the hero object, drawn large in a field of pixels, with the words and actions set calmly underneath.' },
    { name: 'Nous Research', url: 'https://nousresearch.com', what: 'The name set at poster scale, edge to edge, as the image of the page.' },
    { name: 'Brass Hands', url: 'https://brasshands.com', what: 'A heavy block name above a ruled line, with the supporting text arranged in columns under the rule.' },
  ],
  motionHost: 'full',
  render: ctx => `${name(ctx)}<div class="wm-copy"><div class="wm-head">${title(ctx)}</div><div class="wm-side">${sub(ctx)}${actions(ctx)}${proof(ctx)}</div></div>`,
  css: `${S} .hero{padding:clamp(24px,5vh,56px) ${EDGE} clamp(56px,10vh,112px)}
${S} .hero-motion-host{-webkit-mask-image:linear-gradient(to bottom,var(--ink) 70%,transparent);mask-image:linear-gradient(to bottom,var(--ink) 70%,transparent)}
${S} .wm-name{container-type:inline-size;overflow-x:clip;color:var(--ink);line-height:0}
${S} .wm-drawn svg{display:block;width:100%;height:auto}
${S} .wm-set{display:block;width:max-content;max-width:none;margin-left:-.04em;padding-block:.04em .08em;font-family:var(--font-display);font-weight:var(--display-weight);letter-spacing:var(--display-tracking);text-transform:var(--display-transform);line-height:.8;white-space:nowrap;font-size:calc(90cqi / (var(--wm-n) * var(--display-advance,.6)))}
${S} .wm-copy{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);column-gap:clamp(32px,5vw,96px);align-items:start;margin-top:clamp(24px,5vh,56px);padding-top:clamp(24px,4vh,40px);border-top:max(var(--rule,1px),1px) solid var(--line-2)}
${S} .wm-head{container-type:inline-size}
${fit(S, '.hero-title', 'var(--step-4)')}
${S} .hero-sub{font-size:var(--step-1);color:var(--ink)}
${S} .actions{margin-top:28px}
${S} .hero-proof{margin-top:20px;font-size:var(--step--1);color:var(--ink)}
@media (max-width:700px){${S} .hero{padding:24px ${GUTTER} 56px}
${S} .wm-copy{grid-template-columns:minmax(0,1fr);row-gap:20px;margin-top:20px;padding-top:20px}
${S} .actions{flex-direction:column;align-items:stretch}}`,
} satisfies HeroOption;
