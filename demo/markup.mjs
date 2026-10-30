// The contract markup (configurator/README.md, "Markup the renderer emits") for one home page, written the way a
// site writes it: every class, attribute and drawing comes from the package, the words from the page content.
import { HTML_ATTRS, twoLineLength } from '@misty-step/brand/attrs';
import { lockup } from '@misty-step/brand/mark';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const heading = value => esc(value).replace(/[^\s-]+(?:-[^\s-]+)+/g, word => `<span class="nowrap">${word}</span>`);
const target = href => (href.startsWith('#') ? '' : ' target="_blank" rel="noopener noreferrer"');
const link = (a, cls = 'link', label = esc(a.label)) => `<a class="${cls}" href="${esc(a.href)}"${target(a.href)}>${label}</a>`;
const head = s => `<div class="s-head" data-enter><h2 class="s-title">${heading(s.title)}</h2>${s.intro ? `<p class="s-intro">${esc(s.intro)}</p>` : ''}</div>`;

const SECTIONS = {
  steps: s => `${head(s)}<ol class="s-items">${s.items.map(i => `<li class="item" data-enter><span class="item-label">${esc(i.label)}</span><h3 class="item-title">${heading(i.title)}</h3>${i.terms ? `<p class="item-terms">${esc(i.terms)}</p>` : ''}<p class="item-body">${esc(i.body)}</p></li>`).join('')}</ol>`,
  work: s => head(s) + s.groups.map(g => `<div class="group"><h3 class="group-label">${heading(g.label)}</h3><ul class="s-items">${g.items.map(i => `<li class="item" data-enter><a class="item-link" href="${esc(i.href)}" target="_blank" rel="noopener noreferrer"><span class="item-title">${heading(i.name)}</span><span class="item-body">${esc(i.body)}</span><span class="item-host">${esc(i.host)}</span></a></li>`).join('')}</ul></div>`).join(''),
  points: s => `${head(s)}<ul class="s-items">${s.items.map(i => `<li class="item" data-enter><h3 class="item-title">${heading(i.title)}</h3><p class="item-body">${esc(i.body)}</p></li>`).join('')}</ul>`,
  diagram: s => `${head(s)}<ol class="diagram">${s.nodes.map(n => `<li class="node" data-node="${esc(n.id)}" data-enter>${n.count ? `<span class="node-count">${esc(n.count)}</span>` : ''}<h3 class="node-label">${n.href ? link(n, 'link', `<span class="link-text">${heading(n.label)}</span>`) : heading(n.label)}</h3><p class="node-body">${esc(n.body)}</p></li>`).join('')}</ol>`,
  install: s => `${head(s)}<div class="tabs" role="tablist" aria-label="Choose your harness">${s.harnesses.map((h, i) => `<button role="tab" class="tab" id="${esc(s.id)}-tab-${esc(h.id)}" aria-controls="${esc(s.id)}-panel-${esc(h.id)}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(h.name)}</button>`).join('')}</div>${s.harnesses.map((h, i) => `<div class="tabpanel" role="tabpanel" id="${esc(s.id)}-panel-${esc(h.id)}" aria-labelledby="${esc(s.id)}-tab-${esc(h.id)}"${i === 0 ? '' : ' hidden'}>${h.lines.length ? `<pre class="code"><code>${esc(h.lines.join('\n'))}</code></pre><button class="copy">Copy</button>` : ''}${h.note ? `<p class="note">${esc(h.note)}</p>` : ''}</div>`).join('')}`,
  evidence: s => `${head(s)}<div class="bars">${s.rows.map(r => `<div class="bar" data-highlight="${r.highlight === true}"><span class="bar-label">${esc(r.label)}</span><span class="bar-track"><span class="bar-fill" style="--v:${r.passed}/${r.total}"></span></span><span class="bar-value">${r.passed}/${r.total}</span></div>`).join('')}</div><ul class="limits">${s.limits.map(l => `<li>${esc(l)}</li>`).join('')}</ul>${link({ label: 'Read the trial record and limitations', href: s.href })}`,
  code: s => `${head(s)}<figure class="codefig"><pre class="code"><code>${esc(s.code)}</code></pre><figcaption>${esc(s.caption)}</figcaption></figure>`,
  cta: s => `<h2 class="s-title">${heading(s.title)}</h2><p class="s-intro">${esc(s.body)}</p><div class="actions">${link(s.primary, 'btn btn-primary')}${s.secondary ? link(s.secondary, 'btn btn-quiet') : ''}</div>`,
};

/**
 * The horizon hero. `inlineOrder: false` writes the hero as a strict-CSP page must (no inline --enter-i;
 * brand.css carries the order), leaving only --h2 inline.
 */
function hero(h, inlineOrder) {
  const order = i => (inlineOrder ? ` style="--enter-i:${i}"` : '');
  const title = `<h1 class="hero-title" data-enter style="${inlineOrder ? '--enter-i:0;' : ''}--h2:${twoLineLength(h.headline)}">${esc(h.headline)}</h1>`;
  const actions = `<div class="actions" data-enter${order(2)}>${link(h.primary, 'btn btn-primary')}${h.secondary ? link(h.secondary, 'btn btn-quiet') : ''}</div>`;
  return `<div class="hero-motion-host" aria-hidden="true"></div><div class="hz-copy">${title}<div class="hz-row"><p class="hero-sub" data-enter${order(1)}>${esc(h.sub)}</p>${actions}</div></div>${h.proof ? `<p class="hero-proof" data-enter${order(3)}>${esc(h.proof)}</p>` : ''}`;
}

const THEME_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor"/></svg>';

export function page(content, { inlineOrder = true } = {}) {
  const attrs = Object.entries(HTML_ATTRS).map(([name, value]) => `${name}="${esc(value)}"`).join(' ');
  return `<!doctype html>
<html lang="en" ${attrs}>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(content.brand)}: identity demo</title>
<link rel="icon" type="image/svg+xml" href="/identity/icons/favicon.svg"><link rel="stylesheet" href="/identity/brand.css"><script type="module" src="/demo/app.js"></script></head>
<body id="top">
  <div class="bg" data-motion-root aria-hidden="true"></div>
  <a class="skip" href="#main">Skip to content</a>
  <header class="nav">
    ${lockup(content.brand.toUpperCase(), { href: '#top' })}
    <nav class="nav-links" aria-label="Primary">${content.nav.map(a => link(a)).join('')}</nav>
    <div class="nav-actions"><button class="theme-toggle" aria-label="Switch colour theme">${THEME_ICON}</button>${content.navCta ? link(content.navCta, 'btn btn-primary btn-sm') : ''}</div>
  </header>
  <main id="main" tabindex="-1">
    <section class="hero" data-hero-root>${hero(content.hero, inlineOrder)}</section>
    <nav class="toc" aria-label="Contents"><ol>${content.sections.map(s => `<li>${link({ label: s.title, href: '#' + s.id })}</li>`).join('')}</ol></nav>
    ${content.sections.map(s => `<section class="s s-${s.type}" id="${esc(s.id)}">${SECTIONS[s.type](s)}</section>`).join('')}
  </main>
  <footer class="foot"><p class="foot-line">${esc(content.footer.line)}</p><nav class="foot-links" aria-label="Footer">${content.footer.links.map(a => link(a)).join('')}</nav></footer>
  <button class="motion-toggle" aria-pressed="false">Pause motion</button>
</body></html>
`;
}
