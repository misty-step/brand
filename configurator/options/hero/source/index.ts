import type { HeroCtx, HeroOption } from '../../../src/contract';
import { FACTS } from '../../../src/content/facts';
import { esc } from '../../../src/html';
import { title, sub, actions, proof, slot, enter, fit, href, EDGE, GUTTER } from '../shared';

const S = 'html[data-hero="source"]';
const core = FACTS.nodes.find(n => n.id === 'core');
const oracle = FACTS.nodes.find(n => n.id === 'oracle');
const corePath = core ? core.href.replace(/^.*\/blob\/[^/]+\//, '') : '';
const coreLines = FACTS.core.split('\n');
// The three rules a client of the studio would care about, verbatim. Missing lines are skipped.
const excerpt = ['- Before work, name the check', '- Ship the smallest change', '- Ask Phaedrus before'].map(p => coreLines.find(l => l.startsWith(p))).filter((l): l is string => Boolean(l));
const harnesses = FACTS.install;

/** Studio: real lines of the always-on core, the Oracle line highlighted. */
function coreCard(): string {
  if (!core) return '';
  const lines = excerpt.map(l => `<span class="ln"${l.startsWith('- Before work') ? ' data-mark' : ''}>${esc(l)}</span>`).join('\n');
  const note = `${excerpt.length} of the ${coreLines.length} lines in the always-on core of mistystack, Misty Step's engineering method.${oracle ? ` Highlighted: the Oracle, ${esc(oracle.body.charAt(0).toLowerCase() + oracle.body.slice(1))}` : ''}`;
  return `<figure class="src-card" ${enter(4)}><figcaption class="src-head"><code>${esc(corePath)}</code><a class="link" ${href(core.href)}>Read all ${coreLines.length} lines</a></figcaption><pre class="code"><code>${lines}</code></pre><p class="src-note">${note}</p></figure>`;
}

/** Stack: the exact install lines per harness; radio buttons switch them without script, Copy uses the renderer's handler. */
function installCard(): string {
  const picks = harnesses.map((h, i) => `<label class="src-opt"><input type="radio" name="hero-harness" value="${esc(h.id)}"${i === 0 ? ' checked' : ''}><span>${esc(h.name)}</span></label>`).join('');
  const panels = harnesses.map(h => `<div class="src-panel" data-h="${esc(h.id)}">${h.lines.length ? `<pre class="code"><code>${h.lines.map(l => `<span class="ln">${esc(l)}</span>`).join('\n')}</code></pre><button class="copy" type="button">Copy</button>` : ''}${h.note ? `<p class="src-note">${esc(h.note)}</p>` : ''}</div>`).join('');
  return `<div class="src-card" ${enter(4)}><fieldset class="src-pick"><legend>Choose your harness</legend>${picks}</fieldset>${panels}</div>`;
}

const switches = harnesses.map(h => `${S} .src-card:has(input[value="${h.id}"]:checked) .src-panel[data-h="${h.id}"]{display:block}`).join('\n');

export default {
  id: 'source',
  layer: 'hero',
  label: 'Source',
  summary: 'Code first: the statement beside a real artefact in mono, the exact install commands for each harness on the stack page and verbatim lines of the always-on core on the studio page.',
  origin: 'new',
  refs: [
    { name: 'pi', url: 'https://pi.dev', what: 'The install command is the hero object, in a box with a copy button and one control to switch the installer.' },
    { name: 'Greptile', url: 'https://www.greptile.com', what: 'The product shown through its real output on real code, set in ruled panels instead of an illustration.' },
    { name: 'Macroscope', url: 'https://macroscope.com', what: 'Headline on the left, product panels on the right laid over the brand image, which shows around their edges.' },
  ],
  motionHost: 'panel',
  render: (ctx: HeroCtx) => `<div class="src-copy">${title(ctx)}${sub(ctx)}${actions(ctx)}${proof(ctx)}</div>${slot()}${ctx.page === 'stack' ? installCard() : coreCard()}`,
  css: `${S} .hero{display:grid;grid-template-columns:[full-start] ${EDGE} [copy-start] minmax(0,5fr) [copy-end] clamp(40px,5vw,88px) [art-start] minmax(0,7fr) [art-end] ${EDGE} [full-end];align-items:center;padding-block:clamp(56px,10vh,112px) clamp(64px,11vh,128px)}
${S} .src-copy{grid-column:copy;grid-row:1;container-type:inline-size}
${fit(S)}
${S} .hero-sub{margin-top:24px;max-width:min(var(--measure,56ch),100%);font-size:var(--step-1);color:var(--ink-2)}
${S} .actions{margin-top:32px}
${S} .hero-proof{margin-top:24px;font-size:var(--step--1);color:var(--ink-2)}
${S} .hero>.hero-visual{grid-column:art-start/full-end;grid-row:1;align-self:stretch;position:relative;overflow:hidden;margin:clamp(-64px,-6vh,-40px) 0 clamp(-64px,-6vh,-40px) clamp(48px,6vw,96px);border-radius:var(--radius,0) 0 0 var(--radius,0)}
${S} .src-card{grid-column:art;grid-row:1;position:relative;z-index:1;margin:0;background:var(--bg-2);border:1px solid var(--line);border-radius:var(--radius,0);padding:clamp(20px,2.2vw,32px)}
${S} .src-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px 24px;margin-bottom:16px;font-size:var(--step--1);color:var(--ink-2)}
${S} .src-head code{font-family:var(--font-mono);color:var(--ink)}
${S} .src-head .link{display:inline-flex;align-items:center;min-height:44px}
${S} .src-card .code{margin:0}
${S} .src-card .ln{display:inline-block;width:100%;padding-left:2ch;text-indent:-2ch;vertical-align:top}
${S} .src-card .ln+.ln{margin-top:.5em}
${S} .src-card .ln[data-mark]{background:var(--selection);box-shadow:-8px 0 0 var(--selection),8px 0 0 var(--selection)}
${S} .src-panel .ln::before{content:"$ ";color:var(--ink-2);user-select:none}
${S} .src-note{margin-top:16px;max-width:min(var(--measure,60ch),100%);font-size:var(--step--1);color:var(--ink-2)}
${S} .src-pick{display:flex;flex-wrap:wrap;gap:8px;min-inline-size:0;margin:0 0 20px;padding:0;border:0}
${S} .src-pick legend{float:left;width:100%;margin-bottom:12px;padding:0;font-size:var(--step--1);color:var(--ink-2)}
${S} .src-opt{position:relative;display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border:1px solid var(--line-2);border-radius:var(--radius,0);font-family:var(--font-ui);font-size:var(--step--1);cursor:pointer}
${S} .src-opt input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}
${S} .src-opt:has(input:checked){background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
${S} .src-opt:has(input:focus-visible){outline:2px solid var(--focus);outline-offset:3px}
${S} .src-panel{display:none}
${switches}
${S} .src-panel .copy{margin-top:12px}
@supports not selector(:has(*)){${S} .src-panel{display:block}${S} .src-panel+.src-panel{margin-top:24px}}
@media (max-width:899px){${S} .hero{grid-template-columns:[full-start] ${GUTTER} [copy-start art-start] minmax(0,1fr) [copy-end art-end] ${GUTTER} [full-end];row-gap:clamp(40px,7vh,64px);padding-block:40px 64px}
${S} .src-card{grid-row:2}
${S} .hero>.hero-visual{grid-column:full;grid-row:2;margin:-24px 0 45% 0;border-radius:0}}
@media (max-width:700px){${S} .actions{flex-direction:column;align-items:stretch}
${S} .src-card{padding:16px}}`,
} satisfies HeroOption;
