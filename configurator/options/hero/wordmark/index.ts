import type { HeroOption } from '../../../src/contract';
import { title, sub, actions, proof, fit, bigName, bigNameCss, EDGE, GUTTER } from '../shared';

const S = 'html[data-hero="wordmark"] .hero';

export default {
  id: 'wordmark',
  layer: 'hero',
  label: 'Wordmark',
  summary: 'The name is the hero image: the wordmark runs the full width of the first screen over the motion field, then a ruled line and the statement, sentence and actions beneath it.',
  origin: 'new',
  refs: [
    { name: 'Omarchy', url: 'https://omarchy.org', what: 'A custom logotype as the hero object, drawn large in a field of pixels, with the words and actions set calmly underneath.' },
    { name: 'Nous Research', url: 'https://nousresearch.com', what: 'The name set at poster scale, edge to edge, as the image of the page.' },
    { name: 'Brass Hands', url: 'https://brasshands.com', what: 'Its header sets the name as a heavy block beside columns of short facts and closes the band with a rule; here the rule separates the name from the statement.' },
  ],
  motionHost: 'full',
  render: ctx => `${bigName(ctx, 'wm-name', 0)}<div class="wm-copy"><div class="wm-head">${title(ctx)}</div><div class="wm-side">${sub(ctx)}${actions(ctx)}${proof(ctx)}</div></div>`,
  css: `${S}{padding:clamp(24px,5vh,56px) ${EDGE} clamp(56px,10vh,112px)}
${S} .wm-name{color:var(--ink)}
${bigNameCss(S, '.wm-name', '90cqi', 'min(34svh,300px)')}
${S} .wm-copy{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);column-gap:clamp(32px,5vw,96px);align-items:start;margin-top:clamp(24px,5vh,56px);padding-top:clamp(24px,4vh,40px);border-top:max(var(--rule,1px),1px) solid var(--line-2)}
${S} .wm-head{container-type:inline-size}
${fit(S, '.hero-title', 'var(--step-4)')}
${S} .hero-sub{font-size:var(--step-1);color:var(--ink)}
${S} .actions{margin-top:28px}
${S} .hero-proof{margin-top:20px;font-size:var(--step--1);color:var(--ink)}
@media (max-width:700px){${S}{padding:24px ${GUTTER} 56px}
${S} .wm-copy{grid-template-columns:minmax(0,1fr);row-gap:20px;margin-top:20px;padding-top:20px}
${S} .actions{flex-direction:column;align-items:stretch}}`,
} satisfies HeroOption;
