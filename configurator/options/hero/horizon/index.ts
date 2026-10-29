import type { HeroOption } from '../../../src/contract';
import { title, sub, actions, proof, fit, EDGE, GUTTER } from '../shared';

const S = 'html[data-hero="horizon"]';

export default {
  id: 'horizon',
  layer: 'hero',
  label: 'Horizon',
  summary: 'The motion field fills the whole first screen and the statement sits on it like a title on a poster: headline low on the left, sentence and actions on its baseline, the proof in the top corner.',
  origin: 'new',
  refs: [
    { name: 'Earendil', url: 'https://earendil.com', what: 'One statement set directly on a full-viewport living field, with the remaining words pushed to the corners of the screen.' },
    { name: 'Stripe', url: 'https://stripe.com', what: 'The WebGL wave runs behind the headline itself, so the type sits on the motion instead of beside it in a box.' },
  ],
  motionHost: 'full',
  render: ctx => `<div class="hz-copy">${title(ctx)}<div class="hz-row">${sub(ctx)}${actions(ctx)}</div></div>${proof(ctx)}`,
  css: `${S} .hero{display:grid;grid-template-rows:auto minmax(0,1fr) auto;min-height:clamp(560px,calc(100svh - var(--nav-h,80px)),1000px);padding:clamp(24px,4vh,40px) ${EDGE} clamp(48px,10vh,112px)}
${S} .hero-motion-host{-webkit-mask-image:linear-gradient(to bottom,var(--ink) 74%,transparent);mask-image:linear-gradient(to bottom,var(--ink) 74%,transparent)}
${S} .hero-proof{grid-row:1;max-width:40ch;font-size:var(--step--1);color:var(--ink)}
${S} .hz-copy{grid-row:3;container-type:inline-size}
${fit(S)}
${S} .hero-title{max-width:min(100%,1100px)}
${S} .hz-row{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:24px 64px;margin-top:clamp(24px,4vh,40px)}
${S} .hero-sub{flex:1 1 420px;max-width:min(var(--measure,56ch),100%);font-size:var(--step-1);color:var(--ink)}
${S} .actions{margin-top:0}
@media (max-width:700px){${S} .hero{min-height:max(560px,calc(100svh - var(--nav-h,64px)));padding:24px ${GUTTER} 40px}
${S} .hz-row{flex-direction:column;align-items:stretch;gap:28px}
${S} .hero-sub{flex:none}
${S} .actions{flex-direction:column;align-items:stretch}}`,
} satisfies HeroOption;
