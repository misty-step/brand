import type { HeroCtx, HeroOption } from '../../../src/contract';
import { FACTS } from '../../../src/content/facts';
import { esc } from '../../../src/html';
import { title, sub, actions, proof, slot, enter, fit, href, EDGE, GUTTER } from '../shared';

const S = 'html[data-hero="treads"]';

/** Studio: the three priced steps, the first lit because it is the primary action. Stack: the method path, the Oracle lit as the goal. */
function flight(ctx: HeroCtx): string {
  const steps = ctx.page === 'stack'
    ? FACTS.nodes.map((n, i) => `<li class="tr-step" style="--k:${i}"${n.id === 'oracle' ? ' data-lit' : ''}><p class="tr-head"><span class="tr-n" aria-hidden="true">${i + 1}</span><a class="link tr-title" ${href(n.href)}>${esc(n.label)}</a>${n.count ? `<span class="tr-count">${esc(n.count)}</span>` : ''}</p><p class="tr-body">${esc(n.body)}</p></li>`)
    : FACTS.offer.steps.map((s, i) => `<li class="tr-step" style="--k:${i}"${i === 0 ? ' data-lit' : ''}><p class="tr-head"><span class="tr-n" aria-hidden="true">${esc(s.label)}</span><span class="tr-title">${esc(s.title)}</span></p><p class="tr-terms">${esc(s.terms)}</p></li>`);
  return `<ol class="tr-steps" data-n="${steps.length}" style="--n:${steps.length}" ${enter(4)}>${steps.join('')}</ol>`;
}

export default {
  id: 'treads',
  layer: 'hero',
  label: 'Treads',
  summary: 'The offer is the hero: the three priced steps rise as treads across the first screen on the studio page, and the method path climbs from the core to the Oracle on the stack page, standing in the motion field.',
  origin: 'C',
  refs: [
    { name: 'Stripe', url: 'https://stripe.com/pricing', what: 'The price itself set as the display line ("2.9% + 30¢") ahead of any explanation, so the terms are the headline.' },
    { name: 'Brass Hands', url: 'https://brasshands.com', what: 'Stepped bands of colour as a graphic device in its case-study plates: a staircase silhouette built from flat bars.' },
    { name: 'Linear', url: 'https://linear.app', what: 'A full-width artefact directly under a two-line statement, carrying the proof in the first screen.' },
  ],
  motionHost: 'panel',
  render: ctx => `<div class="tr-copy">${title(ctx)}<div class="tr-row">${sub(ctx)}<div class="tr-act">${actions(ctx)}${proof(ctx)}</div></div></div>${slot()}${flight(ctx)}`,
  css: `${S} .hero{display:grid;grid-template-columns:[full-start] ${EDGE} [c-start] minmax(0,1fr) [c-end] ${EDGE} [full-end];padding-top:clamp(48px,8vh,96px)}
${S} .tr-copy{grid-column:c;grid-row:1;container-type:inline-size}
${fit(S)}
${S} .hero-title{max-width:min(100%,1080px)}
${S} .tr-row{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:24px 64px;margin-top:clamp(20px,3vh,32px)}
${S} .hero-sub{flex:1 1 440px;max-width:min(var(--measure,60ch),100%);font-size:var(--step-1);color:var(--ink-2)}
${S} .tr-act{display:flex;flex-direction:column;align-items:flex-end;gap:12px}
${S} .actions{margin-top:0}
${S} .hero-proof{font-size:var(--step--1);color:var(--ink-2)}
${S} .hero>.hero-visual{grid-column:full;grid-row:2;position:relative;overflow:hidden;-webkit-mask-image:linear-gradient(to bottom,transparent,var(--ink) 30%);mask-image:linear-gradient(to bottom,transparent,var(--ink) 30%)}
${S} .tr-steps{grid-column:c;grid-row:2;position:relative;z-index:1;display:grid;grid-template-columns:repeat(var(--n),minmax(0,1fr));align-items:end;margin-top:clamp(40px,7vh,72px);--base:176px;--rise:48px}
${S} .tr-steps[data-n="6"]{--base:150px;--rise:28px}
${S} .tr-step{min-height:calc(var(--base) + var(--k) * var(--rise));padding:18px clamp(14px,1.6vw,24px) 24px;background:var(--bg-2);border-top:max(var(--rule,1px),2px) solid var(--line-2)}
${S} .tr-step+.tr-step{border-left:1px solid var(--line)}
${S} .tr-step[data-lit]{border-top:max(var(--rule,1px),4px) solid var(--accent)}
${S} .tr-head{display:flex;align-items:baseline;gap:10px;font-family:var(--font-ui)}
${S} .tr-n{font-variant-numeric:tabular-nums;color:var(--ink-2)}
${S} .tr-title{font-weight:600}
${S} a.tr-title{display:inline-flex;align-items:center;min-height:44px;margin-block:-10px}
${S} .tr-count{margin-left:auto;font-variant-numeric:tabular-nums;color:var(--ink-2)}
${S} .tr-terms{margin-top:14px;font-family:var(--font-display);font-weight:var(--display-weight);font-size:var(--step-3);line-height:1.04;letter-spacing:var(--display-tracking);text-transform:var(--display-transform);text-wrap:balance}
${S} .tr-body{margin-top:10px;font-size:var(--step--1);color:var(--ink-2)}
@media (max-width:700px){${S} .hero{grid-template-columns:[full-start] ${GUTTER} [c-start] minmax(0,1fr) [c-end] ${GUTTER} [full-end];padding-top:40px}
${S} .tr-row{flex-direction:column;align-items:stretch;gap:28px}
${S} .hero-sub{flex:none}
${S} .tr-act{align-items:stretch}
${S} .actions{flex-direction:column;align-items:stretch}
${S} .tr-steps{grid-template-columns:minmax(0,1fr);align-items:stretch;margin-top:48px;--indent:20px}
${S} .tr-steps[data-n="6"]{--indent:12px}
${S} .tr-step{min-height:0;margin-left:calc(var(--k) * var(--indent));padding:14px 16px 18px}
${S} .tr-step+.tr-step{border-left:0}}`,
} satisfies HeroOption;
