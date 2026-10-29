import type { HeroCtx, HeroOption } from '../../../src/contract';
import { FACTS } from '../../../src/content/facts';
import { esc } from '../../../src/html';
import { title, sub, actions, proof, slot, enter, fit, markPair, markPairCss, EDGE, GUTTER } from '../shared';

const S = 'html[data-hero="plate"] .hero';

/** Spec rows, every value from facts.ts: the offer's terms on the studio page, the stack's counts and harnesses on the stack page. */
function rows(ctx: HeroCtx): [string, string][] {
  if (ctx.page === 'stack') {
    const node = (id: string) => FACTS.nodes.find(n => n.id === id);
    const out: [string, string][] = [];
    const core = node('core');
    if (core) out.push([core.label, `${FACTS.core.split('\n').length} lines`]);
    for (const id of ['playbooks', 'principles']) { const n = node(id); if (n?.count) out.push([n.label, n.count]); }
    out.push(['Harnesses', FACTS.install.map(h => h.name).join(', ')]);
    return out;
  }
  return [...FACTS.offer.steps.map((s): [string, string] => [s.title, s.terms]), ['Credit', FACTS.offer.credit]];
}

export default {
  id: 'plate',
  layer: 'hero',
  label: 'Spec plate',
  summary: 'An industrial nameplate: one ruled plate holds the name, the statement and a window onto the motion field, and its bottom row reads like a machine spec, the real terms or counts in figures.',
  origin: 'new',
  refs: [
    { name: 'Brass Hands', url: 'https://brasshands.com', what: 'A ruled header of label and value pairs and a framed plate around each piece of work: industrial data plates as the page system.' },
    { name: 'Greptile', url: 'https://www.greptile.com', what: 'Content held in hairline-ruled cells that run edge to edge, so the frame itself carries the structure.' },
  ],
  motionHost: 'panel',
  render: ctx => `<div class="pl-plate"><div class="pl-head"><span class="pl-brand" aria-hidden="true"><span class="pl-mark">${ctx.mark(32)}</span><span class="pl-name">${ctx.wordmark()}</span></span>${proof(ctx)}</div><div class="pl-main">${title(ctx)}${sub(ctx)}${actions(ctx)}</div><div class="pl-window" ${enter(4)}><div class="pl-emblem" aria-hidden="true">${markPair(ctx, 128, 96)}</div>${slot()}</div><dl class="pl-spec" ${enter(5)}>${rows(ctx).map(([dt, dd]) => `<div><dt>${esc(dt)}</dt><dd>${esc(dd)}</dd></div>`).join('')}</dl></div>`,
  css: `${S}{padding:clamp(24px,5vh,48px) ${EDGE} clamp(48px,9vh,96px)}
${S} .pl-plate{display:grid;grid-template-columns:minmax(0,8fr) minmax(0,4fr);overflow:hidden;background:var(--bg-2);border:max(var(--rule,1px),2px) solid var(--ink);border-radius:var(--radius,0)}
${S} .pl-head{grid-column:1/-1;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 32px;min-height:64px;padding:12px clamp(20px,2.4vw,32px);background:var(--ink);color:var(--bg)}
${S} .pl-brand{display:inline-flex;align-items:center;gap:12px}
${S} .pl-mark svg{display:block}
${S} .pl-name{font-family:var(--font-display);font-weight:var(--display-weight);font-size:var(--step-1);letter-spacing:var(--display-tracking);text-transform:var(--display-transform);line-height:1}
${S} .pl-name svg{display:block;height:1.1em;width:auto}
${S} .hero-proof{font-size:var(--step--1);color:var(--bg);text-align:right}
${S} .pl-main{container-type:inline-size;padding:clamp(28px,4vw,64px) clamp(20px,4vw,64px) clamp(32px,4vw,56px)}
${fit(S)}
${S} .hero-sub{margin-top:20px;max-width:min(var(--measure,60ch),100%);font-size:var(--step-1);color:var(--ink-2)}
${S} .actions{margin-top:32px}
${S} .pl-window{position:relative;isolation:isolate;display:grid;place-items:center;min-height:320px;background:var(--bg-3);border-left:1px solid var(--line);color:var(--ink-2)}
${S} .pl-window>.hero-visual{position:absolute;inset:0;z-index:1;overflow:hidden}
${markPairCss(S)}
${S} .pl-window:has(.hero-visual>*) .pl-emblem{visibility:hidden}
${S} .pl-spec{grid-column:1/-1;display:grid;grid-template-columns:repeat(3,minmax(0,1fr)) minmax(0,2fr);gap:1px;margin:0;background:var(--line);border-top:1px solid var(--line)}
${S} .pl-spec>div{padding:16px clamp(16px,2vw,28px) 20px;background:var(--bg-2)}
${S} .pl-spec dt{font-size:var(--step--1);color:var(--ink-2)}
${S} .pl-spec dd{margin:6px 0 0;font-size:var(--step-1);line-height:1.3;font-variant-numeric:tabular-nums;text-wrap:balance}
@media (max-width:1000px){${S} .pl-spec{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:700px){${S}{padding:16px ${GUTTER} 48px}
${S} .pl-plate{grid-template-columns:minmax(0,1fr)}
${S} .pl-head{min-height:0;padding:12px 16px}
${S} .hero-proof{text-align:left}
${S} .pl-main{padding:24px 16px 28px}
${S} .actions{flex-direction:column;align-items:stretch}
${S} .pl-window{min-height:0;aspect-ratio:16/9;border-left:0;border-top:1px solid var(--line)}
${S} .pl-spec{grid-template-columns:minmax(0,1fr)}
${S} .pl-spec>div{display:grid;grid-template-columns:minmax(0,2fr) minmax(0,3fr);gap:12px;padding:12px 16px}
${S} .pl-spec dd{margin:0;font-size:var(--step-0)}}`,
} satisfies HeroOption;
