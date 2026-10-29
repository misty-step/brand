// The mark bench: every mark option, round 2 first, in each place a Misty Step mark has to work,
// drawn in the chosen baseline (industrial-condensed type, mono colour, editorial nav) at real sizes.
//   /marks.html?only=<id,id>&theme=light|dark   guides=0 hides lockup guides, field=<motion id>
//   swaps the field (default: the chosen preset's), anim=1 plays every animateIn once on load.
// Frame mode draws only the real navs for one mark, so the phone navs get the layout's own
// media queries inside an iframe: /marks.html?frame=nav&mark=<id>&theme=<theme>
import '../preview/base.css';
import './bench.css';
import type { ColorOption, ColorTokens, CopyOption, Ctx, LayoutOption, MotionCtx, MotionHandle, MotionOption, PageContent, TypeOption } from '../contract';
import { esc } from '../html';
import { loadOption, optionIds } from '../options';
import { presets } from '../presets';
import { encode } from '../state';
import { dataUrl, drawGuides, enlarge, iconDocument, oneBit, raster, type Mark } from './proof';

type Theme = 'light' | 'dark';
type Page = 'studio' | 'stack';
const params = new URLSearchParams(location.search);
const theme: Theme = params.get('theme') === 'dark' ? 'dark' : 'light';
const only = params.get('only')?.split(',').map(id => id.trim()).filter(Boolean);
const guides = params.get('guides') !== '0';
const chosen = presets.find(preset => preset.id === 'chosen')!.picks;
const fieldId = params.get('field') ?? chosen.motion;
const root = document.documentElement;
const PAGES: Page[] = ['studio', 'stack'];
const LADDER = [16, 24, 32, 48, 64, 128, 256];
const LOCKUP_H = 3, LOCKUP_S = 2.5; // lockup scales: the nav lockup (32 px symbol) times k, drawn at 32k
const ORIGIN: Record<string, string> = { r2: 'round 2', new: 'round 1', A: 'round 1, direction A', B: 'round 1, direction B', C: 'round 1, direction C', baseline: 'plain control' };

function style(id: string, css: string) {
  let el = document.getElementById(id) as HTMLStyleElement | null;
  if (!el) { el = document.createElement('style'); el.id = id; document.head.append(el); }
  el.textContent = css;
}
const cssVars = (tokens: ColorTokens) => Object.entries(tokens).map(([k, v]) => `${k}:${v}`).join(';');
const oneColour = (svg: string) => svg.replace(/var\(--[\w-]+\)/g, 'currentColor');
const isR2 = (m: Mark) => m.origin === 'r2' || m.id.startsWith('r2-');
const rank = (m: Mark) => isR2(m) ? 0 : m.id === chosen.mark ? 1 : m.id === 'baseline-mark' ? 3 : 2;

/** The chosen baseline's type, colour and layout applied to this document, as the preview applies them. */
async function baseline() {
  const [type, color, layout, copy] = await Promise.all([
    loadOption('type', chosen.type), loadOption('color', chosen.color), loadOption('layout', chosen.layout), loadOption('copy', chosen.copy),
  ]) as [TypeOption, ColorOption, LayoutOption, CopyOption];
  Object.assign(root.dataset, { layout: layout.id, type: type.id, color: color.id, theme });
  for (const [k, v] of Object.entries({ ...type.tokens, ...color[theme] })) root.style.setProperty(k, v);
  style('mb-fonts', type.faces.map(face => `@font-face{font-family:${JSON.stringify(face.family)};src:url(${JSON.stringify(face.src)}) format('woff2');font-weight:${face.weight};font-style:${face.style ?? 'normal'};font-display:swap;${face.unicodeRange ? 'unicode-range:' + face.unicodeRange + ';' : ''}}`).join('\n'));
  style('mb-layout', layout.css);
  return { color, copy };
}

// The renderer's nav (src/preview/render.ts) with inert links.
const TOGGLE = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor"/></svg>';
const brand = (m: Mark, name: string, size: number, extra = '') =>
  `<span class="brand${extra}"><span class="brand-mark">${m.svg({ size, title: name })}</span><span class="brand-name">${m.wordmark?.({ name }) ?? esc(name)}</span></span>`;
const nav = (m: Mark, page: PageContent) =>
  `<header class="nav"><a class="brand" href="#top" aria-label="${esc(page.brand)}"><span class="brand-mark">${m.svg({ size: 32, title: page.brand })}</span><span class="brand-name">${m.wordmark?.({ name: page.brand }) ?? esc(page.brand)}</span></a><nav class="nav-links" aria-label="Primary">${page.nav.map(a => `<a class="link" href="#top">${esc(a.label)}</a>`).join('')}</nav><div class="nav-actions"><button class="theme-toggle" aria-label="Switch colour theme" tabindex="-1">${TOGGLE}</button>${page.navCta ? `<a class="btn btn-primary btn-sm" href="#top">${esc(page.navCta.label)}</a>` : ''}</div></header>`;

/** A lockup: the nav lockup scaled k times through CSS zoom, its symbol drawn at the scaled size. */
const lockup = (m: Mark, name: string, k: number, stacked: boolean) =>
  `<div class="mb-lk${stacked ? ' mb-lk-stacked' : ''}"${guides ? ' data-guides' : ''}><div class="mb-zoom" style="zoom:${k}" data-k="${k}">${brand(m, name, 32 * k, stacked ? ' mb-stacked' : '')}</div><div class="mb-guides" aria-hidden="true"></div><p class="mb-cap">${esc(name)}, ${stacked ? 'stacked' : 'horizontal'}, symbol ${32 * k} px</p></div>`;

function tabs(m: Mark, color: ColorOption, copy: CopyOption, scheme: Theme, scale: 1 | 2) {
  const icon = (page: Page) => `<img alt="" width="16" height="16" src="${esc(dataUrl(iconDocument(m, color[scheme], copy.pages[page].brand)))}">`;
  const tab = (page: Page, current: boolean) => `<span class="mb-tab"${current ? ' aria-current="page"' : ''}>${icon(page)}<span class="mb-tab-title">${esc(copy.pages[page].brand)}</span><span class="mb-tab-x" aria-hidden="true">×</span></span>`;
  const blank = scale === 1 ? '<span class="mb-tab"><span class="mb-tab-blank"></span><span class="mb-tab-title">New Tab</span><span class="mb-tab-x" aria-hidden="true">×</span></span>' : '';
  return `<div class="mb-chrome" data-scheme="${scheme}" style="zoom:${scale}">${tab('studio', true)}${tab('stack', false)}${blank}</div>`;
}

function section(m: Mark, color: ColorOption, copy: CopyOption): string {
  const studio = copy.pages.studio, stack = copy.pages.stack;
  const state = (path: string) => path + encode({ v: 1, page: 'studio', theme, reducedMotion: false, paused: false, preset: 'chosen', picks: { ...chosen, mark: m.id }, locks: [] });
  const frame = (width: number) => `<iframe class="mb-phone" title="${esc(m.label)}: phone navs at ${width} px" width="${width}" height="129" loading="lazy" src="?frame=nav&amp;mark=${encodeURIComponent(m.id)}&amp;theme=${theme}"></iframe>`;
  const tile = (scheme: Theme, label: string) => `<div class="mb-tile" style="${esc(cssVars(color[scheme]))}"><div class="mb-tile-mark">${oneColour(m.svg({ size: 128, title: studio.brand }))}</div><div class="mb-tile-lockup">${oneColour(brand(m, studio.brand, 32))}</div><p class="mb-cap">${label}</p></div>`;
  return `<section class="mb-mark" id="m-${esc(m.id)}" data-mark="${esc(m.id)}" data-theme="${theme}">
  <header class="mb-head">
    <div class="mb-name"><p class="mb-id"><code>${esc(m.id)}</code><span>${esc(ORIGIN[m.origin ?? ''] ?? m.origin ?? '')}</span></p><h2 class="mb-label">${esc(m.label)}</h2></div>
    <div class="mb-about"><p class="mb-summary">${esc(m.summary)}</p><p class="mb-tools"><a class="mb-link" href="${esc(state('/'))}">Open in the lab</a><a class="mb-link" href="${esc(state('/preview.html'))}">Preview page</a>${m.animateIn ? '<button type="button" class="mb-replay" data-replay>Replay animateIn</button>' : ''}</p></div>
  </header>
  <div class="mb-navs">${PAGES.map(p => `<div class="mb-strip"><p class="mb-cap mb-strip-cap">${p} nav at this width, real size</p>${nav(m, copy.pages[p])}</div>`).join('')}</div>
  <div class="mb-grid">
    <figure class="mb-cell mb-c7"><figcaption class="mb-cap">Favicon in a browser tab strip: 16 px at 1x, then the same tabs at 2x (32 px)</figcaption><div class="mb-chromes">${tabs(m, color, copy, 'light', 1)}${tabs(m, color, copy, 'dark', 1)}${tabs(m, color, copy, 'light', 2)}${tabs(m, color, copy, 'dark', 2)}</div></figure>
    <figure class="mb-cell mb-c5"><figcaption class="mb-cap">Phone navs, studio over stack, at 390 and 320 px</figcaption><div class="mb-phones">${frame(390)}${frame(320)}</div></figure>
    <figure class="mb-cell mb-c5"><figcaption class="mb-cap">Pixel proofs, shown 6x: the 16 px favicon at 1x, at one bit, at 2x; the 32 px nav drawing at 1x</figcaption><div class="mb-proofs" data-proofs></div></figure>
    <figure class="mb-cell mb-c7"><figcaption class="mb-cap">Symbol at ${LADDER.join(', ')} px</figcaption><div class="mb-ladder">${LADDER.map(s => `<div class="mb-rung"><div class="mb-rung-mark">${m.svg({ size: s, title: studio.brand })}</div><span class="mb-cap">${s}</span></div>`).join('')}</div></figure>
    <figure class="mb-cell mb-c7"><figcaption class="mb-cap">Horizontal lockups${guides ? '; guides: cap height and baseline (solid), symbol box (dashed)' : ''}</figcaption><div class="mb-lockups">${lockup(m, studio.brand, LOCKUP_H, false)}${lockup(m, stack.brand, LOCKUP_H, false)}</div></figure>
    <figure class="mb-cell mb-c5"><figcaption class="mb-cap">Stacked lockups</figcaption><div class="mb-lockups">${lockup(m, studio.brand, LOCKUP_S, true)}${lockup(m, stack.brand, LOCKUP_S, true)}</div></figure>
    <figure class="mb-cell mb-c5"><figcaption class="mb-cap">One colour (every token as the one ink), positive and negative</figcaption><div class="mb-tiles">${tile('light', 'Positive')}${tile('dark', 'Negative')}</div></figure>
    <figure class="mb-cell mb-c7"><figcaption class="mb-cap">On a still of the ${esc(fieldId)} field, ${theme}</figcaption><div class="mb-field"><div class="mb-field-host"></div><div class="mb-field-over">${brand(m, studio.brand, 32)}<div class="mb-field-sizes">${[128, 64, 32].map(s => m.svg({ size: s, title: studio.brand })).join('')}</div></div></div></figure>
  </div>
</section>`;
}

/** Each lockup symbol is drawn at 32k px but sized to 32 px (its nav size) before the k-times zoom. */
function sizeLockups(scope: ParentNode) {
  for (const zoom of scope.querySelectorAll<HTMLElement>('.mb-zoom')) {
    const k = Number(zoom.dataset.k), svg = zoom.querySelector<SVGSVGElement>('.brand-mark > svg');
    if (!svg) continue;
    const w = parseFloat(svg.getAttribute('width') ?? ''), h = parseFloat(svg.getAttribute('height') ?? '');
    if (w > 0) svg.style.width = `${w / k}px`;
    if (h > 0) svg.style.height = `${h / k}px`;
  }
}

async function proofs(m: Mark, host: HTMLElement, color: ColorOption, title: string) {
  for (const scheme of ['light', 'dark'] as Theme[]) {
    const tokens = color[scheme];
    const [x1, x2, nav] = await Promise.all([raster(iconDocument(m, tokens, title), 16), raster(iconDocument(m, tokens, title), 32), raster(iconDocument(m, tokens, title, 32), 32)]);
    const row = document.createElement('div');
    row.className = 'mb-proof-row';
    row.setAttribute('style', cssVars(tokens));
    const cell = (canvas: HTMLCanvasElement, label: string) => {
      const fig = document.createElement('div');
      fig.className = 'mb-proof';
      fig.append(enlarge(canvas, 96));
      const cap = document.createElement('span');
      cap.className = 'mb-cap';
      cap.textContent = label;
      fig.append(cap);
      row.append(fig);
    };
    const soft = (r: { inked: number; soft: number }) => `${r.soft}/${r.inked} soft`;
    cell(x1.canvas, `16, 1x: ${soft(x1)}`);
    cell(oneBit(x1.canvas), '16, one bit');
    cell(x2.canvas, `16, 2x: ${soft(x2)}`);
    cell(nav.canvas, `32, 1x: ${soft(nav)}`);
    host.append(row);
  }
}

async function silhouettes(marks: Mark[], color: ColorOption, title: string) {
  const host = document.querySelector<HTMLElement>('[data-silhouettes]')!;
  for (const scheme of ['light', 'dark'] as Theme[]) {
    const tokens = color[scheme];
    const rasters = await Promise.all(marks.map(m => raster(iconDocument(m, tokens, title), 16).catch(() => null)));
    const row = document.createElement('div');
    row.className = 'mb-sil-row';
    row.setAttribute('style', cssVars(tokens));
    marks.forEach((m, i) => {
      const r = rasters[i];
      const a = document.createElement('a');
      a.className = 'mb-sil';
      a.href = `#m-${m.id}`;
      if (r) a.append(enlarge(r.canvas, 16), enlarge(cloneCanvas(r.canvas), 64));
      const label = document.createElement('span');
      label.className = 'mb-cap';
      label.textContent = m.id;
      a.append(label);
      row.append(a);
    });
    host.append(row);
  }
}
/** A second view of the same pixels (a canvas can sit in one place only). */
function cloneCanvas(source: HTMLCanvasElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  canvas.getContext('2d')!.drawImage(source, 0, 0);
  return canvas;
}

async function fields(color: ColorOption): Promise<MotionHandle[]> {
  const motion = await loadOption('motion', fieldId) as MotionOption;
  if (!motion.background) return [];
  const module = await motion.background.load();
  const t = color[theme];
  const ctx: MotionCtx = { page: 'studio', theme, reducedMotion: true, viewport: 'desktop', dprCap: 1.5, colors: { bg: t['--bg'], ink: t['--ink'], accent: t['--accent'], field1: t['--field-1'], field2: t['--field-2'], field3: t['--field-3'] } };
  return [...document.querySelectorAll<HTMLElement>('.mb-field-host')].map(host => {
    const handle = module.mount(host, ctx);
    handle.update(ctx);
    handle.pause();
    return handle;
  });
}

async function frameMode(id: string) {
  const { copy } = await baseline();
  const m = await loadOption('mark', id) as Mark;
  root.dataset.mark = m.id;
  style('mb-mark', m.css ?? '');
  document.body.className = 'mb-frame';
  document.body.innerHTML = PAGES.map(p => nav(m, copy.pages[p])).join('');
  await document.fonts.ready;
  Object.assign(window, { __BENCH__: { ready: true, frame: 'nav', id } });
}

async function bench() {
  const { color, copy } = await baseline();
  const ids = optionIds('mark').filter(id => !only || only.includes(id));
  const loaded = await Promise.allSettled(ids.map(id => loadOption('mark', id) as Promise<Mark>));
  const failed = loaded.flatMap((r, i) => r.status === 'rejected' ? [`${ids[i]}: ${String(r.reason)}`] : []);
  const marks = loaded.flatMap(r => r.status === 'fulfilled' ? [r.value] : []).sort((a, b) => rank(a) - rank(b) || a.id.localeCompare(b.id));
  style('mb-marks', marks.map(m => (m.css ?? '').replaceAll(`html[data-mark="${m.id}"]`, `[data-mark="${m.id}"]`)).join('\n'));
  const missing = only?.filter(id => !ids.includes(id)) ?? [];
  const sections = marks.map(m => {
    try { return section(m, color, copy); } catch (error) { failed.push(`${m.id}: ${String(error)}`); return ''; }
  });
  document.body.className = 'mb';
  document.body.innerHTML = `<header class="mb-top" id="top">
    <h1 class="mb-title">Mark bench</h1>
    <p class="mb-lede">${marks.length} ${marks.length === 1 ? 'mark' : 'marks'}, round 2 first (${marks.filter(isR2).length}), each where a mark has to work: the browser tab, the real nav, a size ladder, lockups, one colour and the field. Drawn in the chosen baseline (${esc(chosen.type)}, ${esc(chosen.color)}, ${esc(chosen.layout)}), ${theme}. A soft pixel is partly covered: a favicon drawn on the pixel grid has none.</p>
    <p class="mb-params"><code>?only=id,id</code> <code>?theme=light|dark</code> <code>?guides=0</code> <code>?field=${esc(fieldId)}</code> <code>?anim=1</code></p>
    ${failed.length || missing.length ? `<p class="mb-error">${[...failed, ...missing.map(id => `${id}: no such mark`)].map(esc).join('<br>')}</p>` : ''}
  </header>
  <section class="mb-sils" aria-label="Every mark at 16 px"><p class="mb-cap">Every favicon at 16 px, 1x and enlarged 4x, light and dark</p><div data-silhouettes></div></section>
  <section class="mb-sils" aria-label="Every mark side by side"><p class="mb-cap">Every mark at 128 px over its studio nav lockup at real size</p><div class="mb-lineup">${marks.map(m => `<a class="mb-line" href="#m-${esc(m.id)}" data-mark="${esc(m.id)}" data-theme="${theme}"><span class="mb-line-mark">${m.svg({ size: 128, title: copy.pages.studio.brand })}</span>${brand(m, copy.pages.studio.brand, 32)}<span class="mb-cap">${esc(m.id)}</span></a>`).join('')}</div></section>
  ${sections.join('\n')}`;
  sizeLockups(document);
  await document.fonts.ready;
  await Promise.all([silhouettes(marks, color, copy.pages.studio.brand), ...marks.map(m => {
    const host = document.querySelector<HTMLElement>(`#m-${CSS.escape(m.id)} [data-proofs]`);
    return host ? proofs(m, host, color, copy.pages.studio.brand).catch(error => { host.textContent = String(error); }) : undefined;
  })]);
  if (guides) drawGuides(document);
  const handles = await fields(color).catch(error => { console.error('Field still failed', error); return [] as MotionHandle[]; });
  const disposers: (() => void)[] = [];
  const ctx: Ctx = { page: 'studio', theme, reducedMotion: false, viewport: innerWidth <= 700 ? 'phone' : 'desktop' };
  const play = (m: Mark) => document.querySelectorAll(`#m-${CSS.escape(m.id)} .mb-navs .brand-mark`).forEach(el => disposers.push(m.animateIn!(el, ctx)));
  document.addEventListener('click', event => {
    const button = (event.target as Element).closest('[data-replay]');
    const m = marks.find(x => x.id === button?.closest<HTMLElement>('.mb-mark')?.dataset.mark);
    if (m?.animateIn) play(m);
  });
  if (params.get('anim') === '1') marks.filter(m => m.animateIn).forEach(play);
  addEventListener('pagehide', () => { handles.forEach(h => h.destroy()); disposers.forEach(d => d()); });
  Object.assign(window, { __BENCH__: { ready: true, theme, ids: marks.map(m => m.id), failed } });
}

const frame = params.get('frame');
void (frame === 'nav' ? frameMode(params.get('mark') ?? chosen.mark) : bench()).catch(error => {
  console.error(error);
  document.body.textContent = 'The mark bench could not load: ' + String(error);
});
