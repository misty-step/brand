import './style.css';
import type { Layer, ColorOption, TypeOption, MotionOption } from '../contract';
import { catalog, LAYERS, type Option } from '../options';
import { baseline, decode, encode, type LabState } from '../state';
import { presets } from '../presets';
import { esc } from '../html';

interface Saved { id: string; date: string; state: LabState; note: string }
const storageKey = 'misty-brand-lab:shortlist:v1';
const selected = new Set<string>();
let state = decode(location.hash);
let options: Option[] = [];
let saved: Saved[] = [];
try { saved = JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { saved = []; }

const app = document.getElementById('app')!;
app.innerHTML = `
  <header class="shell-head">
    <div class="identity"><h1>Misty Step <span aria-hidden="true">/</span> Brand lab</h1></div>
    <div class="head-actions">
      <button data-action="full">Full preview</button>
      <button data-action="shortlist">Shortlist <span id="saved-count">${saved.length}</span></button>
      <button data-action="save" class="primary">Save</button>
      <button data-action="spec">Spec</button>
      <button data-action="share">Share</button>
    </div>
  </header>
  <div class="workspace">
    <aside class="rail" aria-label="Brand layers">
      <div class="rail-title"><span>Layers</span><span id="option-count">Loading…</span></div>
      <div id="layers"></div>
      <button class="primary shuffle-all" data-action="shuffle">Shuffle unlocked</button>
      <p class="rail-hint">Select a layer name for its description and references.</p>
      <details class="about"><summary>About this lab</summary>
        <p>Real content, independent layers. Plain options are controls, not proposed directions.</p>
        <p>Previous whole directions A, B and C are reusable parts, not endorsements.</p>
        <p>Alt+R shuffles. Alt+S saves. Alt+L shares.</p>
      </details>
    </aside>
    <main class="stage">
      <div class="toolbar">
        <div class="page-switch" aria-label="Page"><button data-page="studio">mistystep.io</button><button data-page="stack">stack.mistystep.io</button></div>
        <div class="view-controls"><button data-action="theme">Light theme</button><label><input id="reduced" type="checkbox"> Reduced motion</label><button data-action="pause">Pause</button></div>
      </div>
      <div class="presets"><span>Start from</span><button data-preset="baseline">Plain baseline</button><span id="preset-options" style="display:contents"></span></div>
      <div class="frames">
        <section class="frame-wrap desktop" aria-label="Desktop preview">
          <div class="frame-top"><span>Desktop / 1440</span><a id="open-desktop" target="_blank" rel="noopener">Open actual size ↗</a></div>
          <div class="frame-window"><iframe title="Desktop page preview at 1440 pixels" id="desktop" width="1440" height="900"></iframe></div>
        </section>
        <section class="frame-wrap phone" aria-label="Phone preview">
          <div class="frame-top"><span>Phone / 390</span><a id="open-phone" target="_blank" rel="noopener" aria-label="Open phone preview actual size">↗</a></div>
          <div class="frame-window"><iframe title="Phone page preview at 390 pixels" id="phone" width="390" height="844"></iframe></div>
        </section>
      </div>
      <div class="stage-bottom"><span id="combination-name">Plain baseline</span><span>Scroll inside a preview.</span><button data-action="export">Export JSON</button></div>
    </main>
  </div>
  <button class="full-preview-exit" data-action="full">Show controls <span aria-hidden="true">Esc</span></button>
  <dialog id="panel"><div class="dialog-head"><h2 id="panel-title"></h2><button data-action="close" aria-label="Close panel">Close</button></div><div id="panel-body" class="dialog-body"></div></dialog>
  <div class="status" role="status" aria-live="polite"></div>`;

const dialog = document.getElementById('panel') as HTMLDialogElement;
const panelBody = document.getElementById('panel-body')!;
const resolved = (layer: Layer) => options.find(o => o.layer === layer && o.id === state.picks[layer])!;

function notify(message: string) {
  const el = document.querySelector('.status')!;
  el.textContent = message;
  setTimeout(() => { if (el.textContent === message) el.textContent = ''; }, 3500);
}
function persistSaved() {
  localStorage.setItem(storageKey, JSON.stringify(saved));
  document.getElementById('saved-count')!.textContent = String(saved.length);
}
function openPanel(title: string, html: string) {
  document.getElementById('panel-title')!.textContent = title;
  panelBody.innerHTML = html;
  if (!dialog.open) dialog.showModal();
}
function syncFrames(initial = false) {
  for (const id of ['desktop', 'phone']) {
    const frame = document.getElementById(id) as HTMLIFrameElement;
    const href = './preview.html' + encode(state);
    if (initial || !frame.getAttribute('src')) frame.src = href;
    else frame.contentWindow?.postMessage({ type: 'lab:update', state }, location.origin);
    document.getElementById('open-' + id)!.setAttribute('href', href);
  }
}
function paint() {
  document.body.classList.toggle('is-full-preview', state.fullPreview === true);
  for (const layer of LAYERS) {
    const option = resolved(layer);
    const select = document.querySelector<HTMLSelectElement>(`select[data-layer="${layer}"]`);
    if (select) { select.value = state.picks[layer]; select.title = option?.label ?? ''; }
    const lock = document.querySelector<HTMLButtonElement>(`[data-lock="${layer}"]`);
    const locked = state.locks.includes(layer);
    if (lock) {
      lock.setAttribute('aria-pressed', String(locked));
      lock.textContent = locked ? '●' : '○';
      lock.setAttribute('aria-label', (locked ? 'Unlock ' : 'Lock ') + layer);
    }
    const summary = document.getElementById('summary-' + layer);
    if (summary) summary.textContent = option?.summary ?? '';
    const heading = document.getElementById('detail-title-' + layer);
    if (heading) heading.textContent = option?.label ?? '';
    const refs = document.getElementById('refs-' + layer);
    if (refs) refs.innerHTML = option?.refs.map(ref => `<a class="ref" href="${esc(ref.url)}" target="_blank" rel="noopener" title="${esc(ref.what)}">${esc(ref.name)}</a>`).join('') ?? '';
  }
  document.querySelectorAll<HTMLButtonElement>('[data-page]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.page === state.page)));
  const theme = document.querySelector('[data-action="theme"]')!;
  theme.textContent = state.theme === 'light' ? 'Light theme' : 'Dark theme';
  theme.setAttribute('aria-label', 'Switch to ' + (state.theme === 'light' ? 'dark' : 'light') + ' theme');
  (document.getElementById('reduced') as HTMLInputElement).checked = state.reducedMotion;
  const pause = document.querySelector('[data-action="pause"]')!;
  pause.textContent = state.paused ? 'Resume' : 'Pause';
  pause.setAttribute('aria-pressed', String(state.paused));
  const preset = presets.find(p => LAYERS.every(layer => p.picks[layer] === state.picks[layer]));
  document.getElementById('combination-name')!.textContent = preset?.label ?? (LAYERS.every(layer => state.picks[layer] === 'baseline-' + layer) ? 'Plain baseline' : 'Custom combination');
  resize();
}
function commit(next = state) {
  state = next;
  history.replaceState(null, '', encode(state));
  localStorage.setItem('lab-motion-paused', String(state.paused));
  paint();
  syncFrames();
  (window as unknown as { __LAB__: unknown }).__LAB__ = { ready: true, state, options: options.map(({ id, layer, label }) => ({ id, layer, label })) };
}
function choose(layer: Layer, id: string) { state.picks = { ...state.picks, [layer]: id }; commit(); }
function step(layer: Layer, delta: number) {
  const list = options.filter(option => option.layer === layer);
  const index = list.findIndex(option => option.id === state.picks[layer]);
  choose(layer, list[(index + delta + list.length) % list.length].id);
}
function shuffle(layer?: Layer) {
  for (const target of layer ? [layer] : LAYERS.filter(item => !state.locks.includes(item))) {
    const list = options.filter(option => option.layer === target && option.id !== state.picks[target]);
    if (list.length) state.picks[target] = list[Math.floor(Math.random() * list.length)].id;
  }
  commit();
}
function spec() {
  const color = resolved('color') as ColorOption;
  const type = resolved('type') as TypeOption;
  const motion = resolved('motion') as MotionOption;
  return {
    version: 1, createdAt: new Date().toISOString(), page: state.page, theme: state.theme, state,
    options: Object.fromEntries(LAYERS.map(layer => { const option = resolved(layer); return [layer, { id: option.id, label: option.label, summary: option.summary, origin: option.origin, refs: option.refs }]; })),
    tokens: { ...type.tokens, ...color[state.theme] }, themes: { light: color.light, dark: color.dark },
    fonts: { faces: type.faces, license: type.license }, motionBudget: motion.budget,
  };
}
function showSpec() {
  const data = spec();
  openPanel('Combination spec', `<div class="shortlist-controls"><span>The resolved system, with sources.</span><button data-action="export">Export JSON</button></div>${LAYERS.map(layer => {
    const option = resolved(layer);
    return `<section class="spec-section"><h3>${esc(layer)} / ${esc(option.label)}</h3><p>${esc(option.summary)}</p><ul>${option.refs.map(ref => `<li><a href="${esc(ref.url)}" target="_blank" rel="noopener">${esc(ref.name)}</a>: ${esc(ref.what)}</li>`).join('')}</ul></section>`;
  }).join('')}<section class="spec-section"><h3>Font licence</h3><p>${esc(data.fonts.license)}</p></section><section class="spec-section"><h3>Motion budget</h3><p>${esc(JSON.stringify(data.motionBudget))}</p></section><section class="spec-section"><h3>Resolved tokens / ${state.theme}</h3><pre>${esc(JSON.stringify(data.tokens, null, 2))}</pre></section>`);
}
function save() {
  saved.unshift({ id: crypto.randomUUID(), date: new Date().toISOString(), state: structuredClone(state), note: '' });
  persistSaved();
  notify('Saved to shortlist');
}
function showShortlist() {
  openPanel('Shortlist', `<div class="shortlist-controls"><span>Select two or three to compare.</span><button data-action="compare" ${saved.length < 2 ? 'disabled' : ''}>Compare selected</button></div>${saved.length ? saved.map((item, index) => `<article class="saved"><input type="checkbox" data-compare="${item.id}" aria-label="Compare combination ${index + 1}" ${selected.has(item.id) ? 'checked' : ''}><div><h3>Combination ${saved.length - index}</h3><p>${LAYERS.map(layer => esc(options.find(option => option.id === item.state.picks[layer] && option.layer === layer)?.label ?? item.state.picks[layer])).join(' / ')}</p><textarea data-note="${item.id}" aria-label="Notes for combination ${index + 1}" placeholder="What works? What would you change?">${esc(item.note)}</textarea></div><div class="saved-actions"><button data-load="${item.id}">Load</button><button data-remove="${item.id}" aria-label="Remove combination ${index + 1}">Remove</button></div></article>`).join('') : '<p class="shortlist-empty">No combinations saved yet. Find something worth keeping, then save it here.</p>'}`);
}
function compare() {
  const items = saved.filter(item => selected.has(item.id));
  if (items.length < 2 || items.length > 3) { notify('Select two or three combinations to compare.'); return; }
  openPanel('Compare combinations', `<div class="shortlist-controls"><span>Same page and theme, different systems.</span><button data-action="shortlist">Back to shortlist</button></div><div class="compare-grid" style="--count:${items.length}">${items.map((item, index) => `<section class="compare-item"><h3>${esc(item.note || 'Combination ' + (index + 1))}</h3><div class="compare-window"><iframe title="Compare combination ${index + 1}" src="./preview.html${encode({ ...item.state, page: state.page, theme: state.theme, reducedMotion: true, paused: true })}"></iframe></div><button data-load="${item.id}">Load this combination</button></section>`).join('')}</div>`);
  resize();
}
async function share() {
  const url = location.origin + location.pathname + encode(state);
  try { await navigator.clipboard.writeText(url); notify('Share link copied'); }
  catch {
    openPanel('Share this combination', `<p>Copy this link. It includes every selection and viewing setting.</p><input class="share-input" readonly value="${esc(url)}" aria-label="Share URL">`);
    (panelBody.querySelector('input') as HTMLInputElement).select();
  }
}
function exportJSON() {
  const url = URL.createObjectURL(new Blob([JSON.stringify(spec(), null, 2) + '\n'], { type: 'application/json' }));
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = 'misty-step-brand-spec.json'; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function resize() {
  for (const id of ['desktop', 'phone']) {
    const frame = document.getElementById(id) as HTMLIFrameElement | null;
    if (!frame || frame.closest<HTMLElement>('.frame-wrap')!.offsetWidth === 0) continue;
    const width = id === 'desktop' ? 1440 : 390;
    const scale = frame.parentElement!.clientWidth / width;
    const viewportHeight = state.fullPreview && id === 'desktop' ? Math.max(600, Math.round((innerHeight - 52) / scale)) : id === 'desktop' ? 900 : 844;
    frame.height = String(viewportHeight);
    frame.style.transform = `scale(${scale})`;
    frame.parentElement!.style.height = `${Math.round(viewportHeight * scale)}px`;
  }
  document.querySelectorAll<HTMLIFrameElement>('.compare-window iframe').forEach(frame => {
    const scale = frame.parentElement!.clientWidth / 1440;
    frame.style.transform = `scale(${scale})`;
    frame.height = String(Math.round(560 / scale));
  });
}
// No ResizeObserver or animation loop in the shell: only actual user/layout events resize frames.
window.addEventListener('resize', resize, { passive: true });

document.addEventListener('click', event => {
  const button = (event.target as Element).closest<HTMLElement>('button,a');
  if (!button) return;
  if (button.dataset.page) { commit({ ...state, page: button.dataset.page as LabState['page'] }); return; }
  if (button.dataset.prev) { step(button.dataset.prev as Layer, -1); return; }
  if (button.dataset.next) { step(button.dataset.next as Layer, 1); return; }
  if (button.dataset.random) { shuffle(button.dataset.random as Layer); return; }
  if (button.dataset.lock) {
    const layer = button.dataset.lock as Layer;
    state.locks = state.locks.includes(layer) ? state.locks.filter(item => item !== layer) : [...state.locks, layer];
    commit(); return;
  }
  if (button.dataset.preset) {
    const preset = presets.find(item => item.id === button.dataset.preset);
    state.picks = button.dataset.preset === 'baseline' ? baseline().picks : { ...preset!.picks };
    commit(); return;
  }
  if (button.dataset.load) { commit(structuredClone(saved.find(item => item.id === button.dataset.load)!.state)); dialog.close(); return; }
  if (button.dataset.remove) {
    saved = saved.filter(item => item.id !== button.dataset.remove); selected.delete(button.dataset.remove);
    persistSaved(); showShortlist(); return;
  }
  switch (button.dataset.action) {
    case 'full': commit({ ...state, fullPreview: !state.fullPreview }); break;
    case 'shuffle': shuffle(); break;
    case 'theme': commit({ ...state, theme: state.theme === 'light' ? 'dark' : 'light' }); break;
    case 'pause': commit({ ...state, paused: !state.paused }); break;
    case 'save': save(); break;
    case 'shortlist': showShortlist(); break;
    case 'compare': compare(); break;
    case 'spec': showSpec(); break;
    case 'share': void share(); break;
    case 'export': exportJSON(); break;
    case 'close': dialog.close(); break;
  }
});
document.addEventListener('change', event => {
  const element = event.target as HTMLInputElement;
  if (element.dataset.layer) choose(element.dataset.layer as Layer, element.value);
  if (element.id === 'reduced') commit({ ...state, reducedMotion: element.checked });
  if (element.dataset.compare) {
    if (element.checked && selected.size >= 3) { element.checked = false; notify('Compare up to three combinations.'); return; }
    if (element.checked) selected.add(element.dataset.compare); else selected.delete(element.dataset.compare);
  }
});
document.addEventListener('input', event => {
  const element = event.target as HTMLTextAreaElement;
  if (element.dataset.note) { const item = saved.find(item => item.id === element.dataset.note); if (item) { item.note = element.value; persistSaved(); } }
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !dialog.open && state.fullPreview) { commit({ ...state, fullPreview: false }); return; }
  if (!event.altKey || event.ctrlKey || event.metaKey) return;
  switch (event.key.toLowerCase()) {
    case 'r': event.preventDefault(); shuffle(); break;
    case 's': event.preventDefault(); save(); break;
    case 'l': event.preventDefault(); void share(); break;
  }
});
// Opening one description closes the others, keeping the compact rail predictable.
document.addEventListener('toggle', event => {
  const element = event.target as HTMLDetailsElement;
  if (!element.matches('.layer-info') || !element.open) return;
  document.querySelectorAll<HTMLDetailsElement>('.layer-info[open]').forEach(other => { if (other !== element) other.open = false; });
}, true);
window.addEventListener('message', event => {
  if (event.origin !== location.origin) return;
  const sources = ['desktop', 'phone'].map(id => (document.getElementById(id) as HTMLIFrameElement).contentWindow);
  if (!sources.includes(event.source as Window)) return;
  if (event.data?.type === 'lab:exit-full') {
    commit({ ...state, fullPreview: false });
    return;
  }
  if (event.data?.type !== 'lab:state') return;
  const next = decode(encode(event.data.state));
  if (JSON.stringify(next) !== JSON.stringify(state)) commit(next);
});
window.addEventListener('hashchange', () => { state = decode(location.hash); paint(); syncFrames(); });

options = await catalog();
const layerLabel = (layer: Layer) => ({ mark: 'Mark', type: 'Type', color: 'Colour', layout: 'Layout', hero: 'Hero', motion: 'Motion', copy: 'Copy' }[layer]);
document.getElementById('layers')!.innerHTML = LAYERS.map(layer => `
  <section class="layer">
    <div class="layer-row">
      <details class="layer-info"><summary id="label-${layer}">${layerLabel(layer)}</summary><div class="layer-description"><h2 id="detail-title-${layer}"></h2><p class="summary" id="summary-${layer}"></p><div class="refs" id="refs-${layer}"></div><button data-random="${layer}">Shuffle this layer</button></div></details>
      <select id="pick-${layer}" aria-labelledby="label-${layer}" data-layer="${layer}">${options.filter(option => option.layer === layer).map(option => `<option value="${option.id}">${esc(option.label)}${option.origin === 'baseline' ? ' (plain)' : ''}</option>`).join('')}</select>
      <button data-prev="${layer}" aria-label="Previous ${layer}">‹</button><button data-next="${layer}" aria-label="Next ${layer}">›</button><button data-lock="${layer}" aria-pressed="false" aria-label="Lock ${layer}">○</button>
    </div>
  </section>`).join('');
document.getElementById('option-count')!.textContent = options.length + ' options';
document.getElementById('preset-options')!.innerHTML = presets.map(preset => `<button data-preset="${preset.id}" title="${esc(preset.note)}">${esc(preset.label)}</button>`).join('');
paint();
syncFrames(true);
commit();
