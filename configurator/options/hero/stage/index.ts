import type { HeroCtx, HeroOption } from '../../../src/contract';
import { FACTS } from '../../../src/content/facts';
import { esc } from '../../../src/html';
import { title, sub, actions, proof, slot, enter, fit, href, EDGE, GUTTER } from '../shared';

const S = 'html[data-hero="stage"]';
const core = FACTS.nodes.find(n => n.id === 'core');
const corePath = core ? core.href.replace(/^.*\/blob\/[^/]+\//, '') : '';

/** The stage's object: the studio's emblem in the field, or the real always-on core file. */
function artefact(ctx: HeroCtx): string {
  if (ctx.page === 'stack' && core) {
    const lines = FACTS.core.split('\n').map(l => `<span class="ln">${esc(l)}</span>`).join('\n');
    return `<figure class="st-file"><figcaption class="st-file-head"><code>${esc(corePath)}</code><a class="link" ${href(core.href)}>Source on GitHub</a></figcaption><pre class="code"><code>${lines}</code></pre></figure>`;
  }
  return `<div class="st-emblem" aria-hidden="true">${ctx.mark(192)}</div>`;
}

export default {
  id: 'stage',
  layer: 'hero',
  label: 'Centre stage',
  summary: 'A centred two-line statement and one clear action above a wide stage: on the studio page the mark stands in the motion field, on the stack page the stage holds the real always-on core file.',
  origin: 'new',
  refs: [
    { name: 'Linear', url: 'https://linear.app', what: 'The product is the illustration: a real artefact set in live DOM below the statement and faded into the ground, with no browser chrome around it.' },
    { name: 'Vercel', url: 'https://vercel.com', what: 'One emblem alone on a wide stage as the hero object; here the mark stands in the motion field instead of a glow.' },
    { name: 'Grok', url: 'https://x.ai/grok', what: 'A centred, balanced two-line statement with one sentence and two actions, and nothing else competing above the fold.' },
  ],
  motionHost: 'panel',
  render: ctx => `<div class="st-copy">${title(ctx)}${sub(ctx)}${actions(ctx)}${proof(ctx)}</div><div class="st-stage" ${enter(4)}>${slot()}${artefact(ctx)}</div>`,
  css: `${S} .hero{display:flex;flex-direction:column;align-items:center;text-align:center;padding:clamp(56px,11vh,120px) ${EDGE} 0}
${S} .st-copy{container-type:inline-size;width:min(100%,1120px);display:flex;flex-direction:column;align-items:center}
${fit(S)}
${S} .hero-title{max-width:100%}
${S} .hero-sub{margin-top:24px;max-width:min(var(--measure,62ch),100%);font-size:var(--step-1);color:var(--ink-2)}
${S} .actions{justify-content:center;margin-top:32px}
${S} .hero-proof{margin-top:20px;font-size:var(--step--1);color:var(--ink-2)}
${S} .st-stage{position:relative;isolation:isolate;align-self:stretch;display:flex;justify-content:center;align-items:flex-start;margin-top:clamp(48px,8vh,88px);min-height:clamp(340px,34vw,500px);padding:clamp(40px,5vw,72px) clamp(16px,4vw,64px) 120px}
${S} .st-stage>.hero-visual{position:absolute;inset:0;z-index:-1;overflow:hidden;background:var(--bg-2);border-radius:var(--radius,0);-webkit-mask-image:linear-gradient(to bottom,var(--ink) 50%,transparent);mask-image:linear-gradient(to bottom,var(--ink) 50%,transparent)}
${S} .st-emblem{color:var(--ink);line-height:0}
${S} .st-emblem svg{display:block}
${S} .st-file{width:min(100%,780px);text-align:left;background:var(--bg-2);border:1px solid var(--line);border-radius:var(--radius,0);overflow:hidden}
${S} .st-file-head{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:0 20px;min-height:48px;border-bottom:1px solid var(--line);font-size:var(--step--1);color:var(--ink-2)}
${S} .st-file .ln{display:inline-block;width:100%;padding-left:2ch;text-indent:-2ch;vertical-align:top}
${S} .st-file .ln+.ln{margin-top:.45em}
${S} .st-file .code{margin:0;border:0;border-radius:0;padding:20px 24px 24px}
${S} .st-file-head code{color:var(--ink);font-family:var(--font-mono)}
${S} .st-file-head .link{display:inline-flex;align-items:center;min-height:44px}
@media (max-width:700px){${S} .hero{align-items:stretch;text-align:left;padding:40px ${GUTTER} 0}
${S} .st-copy{align-items:flex-start;width:100%}
${S} .actions{flex-direction:column;align-items:stretch;align-self:stretch}
${S} .st-stage{margin:40px calc(-1 * ${GUTTER}) 0;min-height:300px;padding:40px ${GUTTER} 72px}
${S} .st-stage>.hero-visual{border-radius:0}
${S} .st-emblem{zoom:.6667}
${S} .st-file-head{padding:0 16px}
${S} .st-file .code{padding:16px}}`,
} satisfies HeroOption;
