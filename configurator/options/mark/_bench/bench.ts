// Mark specimen: every mark at favicon, nav and display sizes, on four palettes in both themes.
// Dev-only page (not part of the build inputs): http://127.0.0.1:<port>/options/mark/_bench/  ?only=a,b  ?anim=1
import type { Ctx, MarkOption } from '../../../src/contract';

type Mark = MarkOption & { css?: string };
type Tokens = Record<string, string>;
const marks = import.meta.glob<{ default: Mark }>('/options/mark/*/index.ts', { eager: true });

const PALETTES: { name: string; light: Tokens; dark: Tokens }[] = [
  { name: 'baseline',
    light: { '--bg': '#f5f5f2', '--ink': '#252724', '--ink-2': '#4f544e', '--ink-3': '#5f655e', '--accent': '#343e33', '--accent-2': '#4b5948' },
    dark: { '--bg': '#1c1f1b', '--ink': '#eef0e9', '--ink-2': '#c4c9bf', '--ink-3': '#aab1a5', '--accent': '#dfe7d8', '--accent-2': '#c9d6c1' } },
  { name: 'A amber',
    light: { '--bg': 'oklch(0.942 0.006 245)', '--ink': 'oklch(0.24 0.02 255)', '--ink-2': 'oklch(0.47 0.016 255)', '--ink-3': 'oklch(0.5 0.016 255)', '--accent': 'oklch(0.80 0.15 78)', '--accent-2': 'oklch(0.55 0.15 62)' },
    dark: { '--bg': 'oklch(0.165 0.012 255)', '--ink': 'oklch(0.93 0.008 250)', '--ink-2': 'oklch(0.74 0.012 250)', '--ink-3': 'oklch(0.7 0.012 250)', '--accent': 'oklch(0.80 0.14 78)', '--accent-2': 'oklch(0.82 0.14 78)' } },
  { name: 'B rubric',
    light: { '--bg': 'oklch(.972 .004 240)', '--ink': 'oklch(.255 .016 252)', '--ink-2': 'oklch(.445 .014 250)', '--ink-3': 'oklch(.5 .014 250)', '--accent': 'oklch(.525 .185 27)', '--accent-2': 'oklch(.525 .185 27)' },
    dark: { '--bg': 'oklch(.168 .010 252)', '--ink': 'oklch(.935 .006 240)', '--ink-2': 'oklch(.755 .010 242)', '--ink-3': 'oklch(.7 .010 242)', '--accent': 'oklch(.705 .150 27)', '--accent-2': 'oklch(.705 .150 27)' } },
  { name: 'C signal',
    light: { '--bg': 'oklch(0.958 0.004 90)', '--ink': 'oklch(0.215 0.01 90)', '--ink-2': 'oklch(0.455 0.01 90)', '--ink-3': 'oklch(0.5 0.01 90)', '--accent': 'oklch(0.52 0.135 150)', '--accent-2': 'oklch(0.52 0.135 150)' },
    dark: { '--bg': 'oklch(0.178 0.006 90)', '--ink': 'oklch(0.935 0.005 90)', '--ink-2': 'oklch(0.735 0.007 90)', '--ink-3': 'oklch(0.7 0.007 90)', '--accent': 'oklch(0.66 0.13 150)', '--accent-2': 'oklch(0.66 0.13 150)' } },
];

const params = new URLSearchParams(location.search);
const only = params.get('only')?.split(',');
const themes = (params.get('themes') ?? 'light,dark').split(',') as ('light' | 'dark')[];
const ctx = (theme: 'light' | 'dark'): Ctx => ({ page: 'studio', theme, reducedMotion: false, viewport: 'desktop' });
const vars = (t: Tokens) => Object.entries({ '--font-display': 'Arial, Helvetica, sans-serif', ...t }).map(([k, v]) => `${k}:${v}`).join(';');

// The same substitution the renderer performs for the themed favicon.
const favicon = (m: Mark, t: Tokens) =>
  'data:image/svg+xml,' + encodeURIComponent(m.svg({ size: 16, title: 'Misty Step' }).replace(/currentColor/g, t['--ink']).replace(/var\((--[\w-]+)\)/g, (_, n: string) => t[n] ?? '#f0f'));

const app = document.getElementById('app')!;
const styles = document.createElement('style');
document.head.append(styles);

const list = Object.values(marks).map(m => m.default).filter(m => m.id !== 'baseline-mark' && (!only || only.includes(m.id)));
styles.textContent = list.map(m => (m.css ?? '').replaceAll(`html[data-mark="${m.id}"]`, `[data-mark="${m.id}"]`)).join('\n');

app.innerHTML = list.map(m => {
  const lockups = themes.flatMap(theme => PALETTES.map(p => {
    const t = p[theme];
    return `<div class="cell" style="${vars(t)}">
      <a class="brand" href="#"><span class="brand-mark">${m.svg({ size: 32, title: 'Misty Step' })}</span><span class="brand-name">${m.wordmark?.({ name: 'Misty Step' }) ?? 'Misty Step'}</span></a>
      <a class="brand" href="#"><span class="brand-mark">${m.svg({ size: 32, title: 'mistystack' })}</span><span class="brand-name">${m.wordmark?.({ name: 'mistystack' }) ?? 'mistystack'}</span></a>
      <div class="tabs">
        <span class="tab" style="background:#fff;color:#222"><img alt="" src="${favicon(m, p.light)}">tab</span>
        <span class="tab" style="background:#dfe1e5;color:#222"><img alt="" src="${favicon(m, p.light)}">tab</span>
        <span class="tab" style="background:#35363a;color:#eee"><img alt="" src="${favicon(m, p.dark)}">tab</span>
        <span class="zoom"><img alt="" src="${favicon(m, t)}"></span>
      </div>
      <small>${p.name} ${theme}</small>
    </div>`;
  })).join('');
  const heroes = themes.map(theme => {
    const t = PALETTES[theme === 'light' ? 1 : 2][theme];
    return `<div class="cell" style="${vars(t)}"><div class="heroes">
      <span class="big">${m.svg({ size: 256, title: 'Misty Step' })}</span>
      <span class="big">${m.svg({ size: 160, title: 'Misty Step' })}</span>
      <span class="big">${m.svg({ size: 64, title: 'Misty Step' })}</span>
      <span class="big">${m.svg({ size: 48, title: 'Misty Step' })}</span>
      ${m.wordmark ? `<span class="wm">${m.wordmark({ name: 'Misty Step' })}</span>` : ''}
    </div></div>`;
  }).join('');
  return `<section class="row" data-mark="${m.id}">
    <h2>${m.label} <code>${m.id}</code> ${m.origin ?? ''} <button data-replay>replay</button></h2>
    <p>${m.summary}</p>
    <div class="grid">${lockups}</div>
    <div class="grid" style="grid-template-columns:1fr 1fr">${heroes}</div>
  </section>`;
}).join('');

const disposers: (() => void)[] = [];
function replay(row: Element) {
  const m = list.find(x => x.id === row.getAttribute('data-mark'));
  if (!m?.animateIn) return;
  row.querySelectorAll('.brand-mark').forEach(el => disposers.push(m.animateIn!(el, ctx('light'))));
}
app.addEventListener('click', e => {
  const b = (e.target as Element).closest('[data-replay]');
  if (b) { e.preventDefault(); replay(b.closest('.row')!); }
});
if (params.get('anim')) document.querySelectorAll('.row').forEach(replay);
Object.assign(window, { __BENCH__: { ready: true, ids: list.map(m => m.id), dispose: () => disposers.forEach(d => d()) } });
