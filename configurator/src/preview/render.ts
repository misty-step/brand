import type { PageContent, Section, Link, HeroOption, HeroCtx, MarkOption } from '../contract';
import { esc } from '../html';
const heading = (value: string) => esc(value).replace(/[^\s-]+(?:-[^\s-]+)+/g, word => `<span class="nowrap">${word}</span>`);
const link = (a: Link, cls='link', format: (value: string) => string = esc) => `<a class="${cls}" href="${esc(a.href)}"${a.href.startsWith('#')?'':' target="_blank" rel="noopener noreferrer"'}>${format === esc ? esc(a.label) : `<span class="link-text">${format(a.label)}</span>`}</a>`;
const head = (s: Section) => `<div class="s-head" data-enter><h2 class="s-title">${heading(s.title)}</h2>${'intro' in s&&s.intro?`<p class="s-intro">${esc(s.intro)}</p>`:''}</div>`;
export function section(s: Section): string {
  let body = '';
  switch(s.type) {
    case 'steps': body = `${head(s)}<ol class="s-items">${s.items.map(i=>`<li class="item" data-enter><span class="item-label">${esc(i.label)}</span><h3 class="item-title">${heading(i.title)}</h3>${i.terms?`<p class="item-terms">${esc(i.terms)}</p>`:''}<p class="item-body">${esc(i.body)}</p></li>`).join('')}</ol>`; break;
    case 'work': body = head(s)+s.groups.map(g=>`<div class="group"><h3 class="group-label">${heading(g.label)}</h3><ul class="s-items">${g.items.map(i=>`<li class="item" data-enter><a class="item-link" href="${esc(i.href)}" target="_blank" rel="noopener noreferrer"><span class="item-title">${heading(i.name)}</span><span class="item-body">${esc(i.body)}</span><span class="item-host">${esc(i.host)}</span></a></li>`).join('')}</ul></div>`).join(''); break;
    case 'points': body = `${head(s)}<ul class="s-items">${s.items.map(i=>`<li class="item" data-enter><h3 class="item-title">${heading(i.title)}</h3><p class="item-body">${esc(i.body)}</p></li>`).join('')}</ul>`; break;
    case 'diagram': body = `${head(s)}<ol class="diagram">${s.nodes.map(n=>`<li class="node" data-node="${esc(n.id)}" data-enter>${n.count?`<span class="node-count">${esc(n.count)}</span>`:''}<h3 class="node-label">${n.href?link({label:n.label,href:n.href},'link',heading):heading(n.label)}</h3><p class="node-body">${esc(n.body)}</p></li>`).join('')}</ol>`; break;
    case 'install': body = `${head(s)}<div class="tabs" role="tablist" aria-label="Choose your harness">${s.harnesses.map((h,i)=>`<button role="tab" class="tab" id="${esc(s.id)}-tab-${esc(h.id)}" aria-controls="${esc(s.id)}-panel-${esc(h.id)}" aria-selected="${i===0}" tabindex="${i===0?0:-1}">${esc(h.name)}</button>`).join('')}</div>${s.harnesses.map((h,i)=>`<div class="tabpanel" role="tabpanel" id="${esc(s.id)}-panel-${esc(h.id)}" aria-labelledby="${esc(s.id)}-tab-${esc(h.id)}"${i===0?'':' hidden'}>${h.lines.length?`<pre class="code"><code>${esc(h.lines.join('\n'))}</code></pre><button class="copy">Copy</button>`:''}${h.note?`<p class="note">${esc(h.note)}</p>`:''}</div>`).join('')}`; break;
    case 'evidence': body = `${head(s)}<div class="bars">${s.rows.map(r=>`<div class="bar" data-highlight="${r.highlight===true}"><span class="bar-label">${esc(r.label)}</span><span class="bar-track"><span class="bar-fill" style="--v:${r.passed}/${r.total}"></span></span><span class="bar-value">${r.passed}/${r.total}</span></div>`).join('')}</div><ul class="limits">${s.limits.map(l=>`<li>${esc(l)}</li>`).join('')}</ul>${link({label:'Read the trial record and limitations',href:s.href})}`; break;
    case 'code': body = `${head(s)}<figure class="codefig"><pre class="code"><code>${esc(s.code)}</code></pre><figcaption>${esc(s.caption)}</figcaption></figure>`; break;
    case 'cta': body = `<h2 class="s-title">${heading(s.title)}</h2><p class="s-intro">${esc(s.body)}</p><div class="actions">${link(s.primary,'btn btn-primary')}${s.secondary?link(s.secondary,'btn btn-quiet'):''}</div>`; break;
  }
  return `<section class="s s-${s.type}" id="${esc(s.id)}">${body}</section>`;
}
export function render(content: PageContent, hero: HeroOption, ctx: HeroCtx, mark: MarkOption): string {
 return `<div class="bg" data-motion-root aria-hidden="true"></div>
  <a class="skip" href="#main">Skip to content</a>
  <header class="nav">
    <a class="brand" href="#top" aria-label="${esc(content.brand)}"><span class="brand-mark">${mark.svg({size:32,title:content.brand})}</span><span class="brand-name">${ctx.wordmark()}</span></a>
    <nav class="nav-links" aria-label="Primary">${content.nav.map(a=>link(a)).join('')}</nav>
    <div class="nav-actions"><button class="theme-toggle" aria-label="Switch colour theme"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor"/></svg></button>${content.navCta?link(content.navCta,'btn btn-primary btn-sm'):''}</div>
  </header>
  <main id="main" tabindex="-1">
    <section class="hero" data-hero-root>${hero.render(ctx)}</section>
    <nav class="toc" aria-label="Contents"><ol>${content.sections.map(item => `<li>${link({ label: item.title, href: '#' + item.id })}</li>`).join('')}</ol></nav>
    ${content.sections.map(section).join('')}
  </main>
  <footer class="foot"><p class="foot-line">${esc(content.footer.line)}</p><nav class="foot-links" aria-label="Footer">${content.footer.links.map(a=>link(a)).join('')}</nav></footer>
  <button class="motion-toggle" aria-pressed="false">Pause motion</button>`;
}
