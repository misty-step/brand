import type { HeroOption } from '../../../src/contract';
import { title, sub, actions, proof, fit, EDGE, GUTTER } from '../shared';

const S = 'html[data-hero="horizon"] .hero';

export default {
  id: 'horizon',
  layer: 'hero',
  label: 'Horizon',
  summary: 'The motion field fills the whole first screen like a landscape: the statement sits high on it with the sentence and actions on one line and the field rises below as the ground; on a phone the field opens as a band above the statement.',
  origin: 'new',
  refs: [
    { name: 'Earendil', url: 'https://earendil.com', what: 'One statement set directly on a full-viewport living field, with the remaining words pushed to the corners of the screen.' },
    { name: 'Stripe', url: 'https://stripe.com', what: 'The WebGL wave runs behind the headline itself, so the type sits on the motion instead of beside it in a box.' },
  ],
  motionHost: 'full',
  render: ctx => `<div class="hz-copy">${title(ctx)}<div class="hz-row">${sub(ctx)}${actions(ctx)}</div></div>${proof(ctx)}`,
  css: `${S}{display:grid;grid-template-rows:auto minmax(clamp(120px,22vh,240px),1fr) auto;min-height:clamp(560px,calc(100svh - var(--nav-h,80px)),1000px);padding:clamp(48px,9vh,104px) ${EDGE} clamp(28px,5vh,48px)}
${S} .hz-copy{grid-row:1;container-type:inline-size}
${fit(S)}
${S} .hz-row{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:24px 64px;margin-top:clamp(20px,3.5vh,36px)}
${S} .hero-sub{flex:1 1 420px;max-width:min(var(--measure,56ch),100%);font-size:var(--step-1);color:var(--ink)}
${S} .actions{margin-top:0}
${S} .hero-proof{grid-row:3;max-width:min(44ch,100%);font-size:var(--step--1);color:var(--ink)}
${S}>.hero-motion-controls{grid-row:4}
@media (max-width:700px){${S}{--hz-band:clamp(160px,26svh,240px);grid-template-rows:var(--hz-band) auto auto;min-height:0;padding:0 ${GUTTER} 32px}
${S}>.hero-motion-host{bottom:auto;height:var(--hz-band);border-bottom:1px solid var(--line)}
${S} .hz-copy{grid-row:2;padding-top:24px}
${S} .hero-proof{margin-top:28px}
${S} .hz-row{flex-direction:column;align-items:stretch;gap:28px}
${S} .hero-sub{flex:none}
${S} .actions{flex-direction:column;align-items:stretch}}`,
} satisfies HeroOption;
