import type { HeroOption } from '../../../src/contract';
import { title, sub, actions, proof, slot, fit } from '../shared';

const S = 'html[data-hero="baseline-hero"] .hero';

export default {
  id: 'baseline-hero',
  layer: 'hero',
  label: 'Plain opening',
  summary: 'A simple headline, explanation and action, with an unadorned motion panel.',
  origin: 'baseline',
  refs: [{ name: 'Misty Step', url: 'https://mistystep.io', what: 'Preserves the real page hierarchy and primary action as a neutral control.' }],
  motionHost: 'panel',
  render: ctx => `<div class="hero-copy">${title(ctx)}${sub(ctx)}${actions(ctx)}${proof(ctx)}</div>${slot()}`,
  css: `${S}{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(0,1fr);align-items:center;gap:48px;padding-block:88px;padding-inline:var(--edge,clamp(20px,4vw,64px));min-height:640px}
${S} .hero-copy{container-type:inline-size}
${fit(S)}
${S} .hero-sub{margin-block:24px;max-width:min(52ch,100%)}
${S} .hero-visual{min-height:400px;background:var(--bg-2);border:1px solid var(--line);position:relative;overflow:hidden}
${S} .hero-proof{margin-top:24px;color:var(--ink-2)}
@media (max-width:700px){${S}{grid-template-columns:minmax(0,1fr);gap:32px;min-height:auto;padding-block:48px}${S} .hero-visual{min-height:220px}${S} .actions{align-items:stretch;flex-direction:column}}`,
} satisfies HeroOption;
