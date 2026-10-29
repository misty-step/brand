import type { HeroOption } from '../../../src/contract';
import { title, sub, actions, proof, slot, enter, fit, EDGE, GUTTER } from '../shared';

const S = 'html[data-hero="spread"]';

export default {
  id: 'spread',
  layer: 'hero',
  label: 'Spread',
  summary: 'A two-page spread: the statement on the left page and a full-height motion plate bleeding off the right edge, so the field gets a whole page without ever sitting behind text.',
  origin: 'B',
  refs: [
    { name: 'Making Software', url: 'https://www.makingsoftware.com', what: 'A narrow text column set beside one large figure plate, the book spread as a page system.' },
    { name: 'Macroscope', url: 'https://macroscope.com', what: 'Headline and actions on the left, the image world filling the right and running to the edge of the screen.' },
    { name: 'Vercel', url: 'https://vercel.com', what: 'The statement and two actions held to one side so the visual object owns the rest of the first screen.' },
  ],
  motionHost: 'panel',
  render: ctx => `<div class="sp-copy">${title(ctx)}${sub(ctx)}${actions(ctx)}${proof(ctx)}</div><div class="sp-plate" ${enter(4)}><div class="sp-colophon" aria-hidden="true">${ctx.mark(128)}</div>${slot()}</div>`,
  css: `${S} .hero{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.04fr);column-gap:clamp(40px,6vw,112px);min-height:clamp(560px,calc(100svh - var(--nav-h,80px)),940px);padding-inline-start:${EDGE}}
${S} .sp-copy{container-type:inline-size;align-self:center;padding-block:clamp(48px,8vh,96px)}
${fit(S)}
${S} .hero-sub{margin-top:24px;max-width:min(var(--measure,58ch),100%);font-size:var(--step-1);color:var(--ink-2)}
${S} .actions{margin-top:36px}
${S} .hero-proof{margin-top:28px;font-size:var(--step--1);color:var(--ink-2)}
${S} .sp-plate{position:relative;isolation:isolate;overflow:hidden;min-height:480px;background:var(--bg-2);border-radius:var(--radius,0) 0 0 var(--radius,0)}
${S} .sp-plate>.hero-visual{position:absolute;inset:0;z-index:1}
${S} .sp-colophon{position:absolute;left:clamp(24px,3vw,48px);bottom:clamp(24px,3vw,48px);color:var(--ink-2);line-height:0}
${S} .sp-colophon svg{display:block}
${S} .sp-plate:has(.hero-visual>*) .sp-colophon{visibility:hidden}
@media (max-width:899px){${S} .hero{grid-template-columns:minmax(0,1fr);min-height:0;padding-inline:${GUTTER}}
${S} .sp-copy{padding-block:40px 48px}
${S} .sp-plate{margin-inline:calc(-1 * ${GUTTER});min-height:0;aspect-ratio:4/3;border-radius:0}}
@media (max-width:700px){${S} .actions{flex-direction:column;align-items:stretch}
${S} .sp-plate{aspect-ratio:5/4}
${S} .sp-colophon{zoom:.75}}`,
} satisfies HeroOption;
