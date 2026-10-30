// The identity runtime: the configurator's preview lifecycle, run on a real page that emits the contract
// markup. scripts/identity/generate.mjs bundles it into identity/runtime.js; the Ground fog field
// (identity/field.js) loads lazily after first paint. Its public types live in generate.mjs (runtime.d.ts).
import type { Ctx, HeroOption, MotionCtx, MotionOption } from '../../configurator/src/contract';
import { MotionLifecycle, observeEntrances } from '../../configurator/src/preview/motion';
import mark from 'brand:mark';
import { MOTION_HOST } from 'brand:locked';

interface StartBrandOptions { root?: Document; motion?: boolean; params?: Record<string, number> }
interface BrandHandle { destroy(): void }

const PAUSE_ITEM = 'brand-motion-paused'; // localStorage item that remembers the pause control
let markPlayed = false;
let active: BrandHandle | undefined;
let drawable: boolean | undefined;

/** Whether this browser can create a WebGL context (a blocklisted GPU has the API but no context). Probed once, on a throwaway canvas. */
function canDraw(doc: Document): boolean {
  if (drawable === undefined) {
    const gl = doc.createElement('canvas').getContext('webgl');
    drawable = gl !== null;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  }
  return drawable;
}

function storedPause(): boolean {
  try {
    return localStorage.getItem(PAUSE_ITEM) === 'true';
  } catch {
    return false; // storage refused (private mode, blocked cookies): motion starts unpaused
  }
}

export function startBrand(options: StartBrandOptions = {}): BrandHandle {
  const doc = options.root ?? globalThis.document;
  if (!doc) throw new Error('startBrand needs a document: call it in the browser, after hydration');
  active?.destroy();
  const view = doc.defaultView ?? window;
  const html = doc.documentElement;
  const reduce = view.matchMedia('(prefers-reduced-motion: reduce)');
  const dark = view.matchMedia('(prefers-color-scheme: dark)');
  const phone = view.matchMedia('(max-width: 700px)');
  // Save-Data: the field draws one still frame. Without WebGL there is no field at all. Either way, nothing to pause.
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  const hero = doc.querySelector<HTMLElement>('[data-hero-root]');
  const field = options.motion !== false && hero !== null && typeof view.WebGLRenderingContext === 'function';
  let blind = false; // the field loaded, but this browser cannot create a WebGL context
  // Lazy by contract: the field (about 11 KB gzip) must stay off the critical path, so it is a separate file.
  const fieldOption = {
    background: {
      load: async () => {
        const module = await (await import('./field.js')).load();
        if (!canDraw(doc)) {
          blind = true;
          apply();
        }
        return module;
      },
    },
  } as unknown as MotionOption;
  const button = doc.querySelector<HTMLButtonElement>('.motion-toggle');
  const home = button?.parentNode ? { parent: button.parentNode, next: button.nextSibling } : undefined;
  let paused = storedPause();
  let dead = false;
  let holder: HTMLElement | undefined;
  let lifecycle: MotionLifecycle | undefined;
  let disposeMark: (() => void) | undefined;

  const context = (): Ctx => {
    const theme = html.getAttribute('data-theme');
    return {
      page: html.getAttribute('data-page') === 'stack' ? 'stack' : 'studio',
      theme: theme === 'dark' || theme === 'light' ? theme : dark.matches ? 'dark' : 'light',
      reducedMotion: reduce.matches,
      viewport: phone.matches ? 'phone' : 'desktop',
    };
  };
  const motionContext = (): MotionCtx => {
    const css = view.getComputedStyle(html);
    const value = (name: string) => css.getPropertyValue(name).trim();
    return {
      ...context(), reducedMotion: reduce.matches || saveData, dprCap: 1.5, tune: options.params,
      colors: { bg: value('--bg'), ink: value('--ink'), accent: value('--accent'), field1: value('--field-1'), field2: value('--field-2'), field3: value('--field-3') },
    };
  };
  // Moving a node removes it first, which drops keyboard focus: the control moves only when its parent changes.
  const restore = () => {
    if (button && home && button.parentNode !== home.parent) home.parent.insertBefore(button, home.next?.parentNode === home.parent ? home.next : null);
    holder?.remove();
  };
  // As in the lab: at phone widths the pause control is an in-flow row inside the hero, so it never
  // covers copy; elsewhere it stays where the page rendered it.
  const place = () => {
    if (!button || !hero) return;
    if (!phone.matches) return restore();
    if (!holder) {
      holder = doc.createElement('div');
      holder.className = 'hero-motion-controls';
    }
    if (holder.parentNode !== hero) hero.append(holder);
    if (button.parentNode !== holder) holder.append(button);
    holder.hidden = button.hidden;
  };
  // The lab's applyTheme: attributes, the pause control, settled entrances, then the field.
  const apply = () => {
    html.setAttribute('data-reduced-motion', reduce.matches ? '1' : '0');
    html.setAttribute('data-paused', paused ? '1' : '0');
    if (button) {
      button.textContent = paused ? 'Resume motion' : 'Pause motion';
      button.setAttribute('aria-pressed', String(paused));
      button.hidden = !field || blind || reduce.matches || saveData;
    }
    place();
    if (paused || reduce.matches) {
      disposeMark?.();
      disposeMark = undefined;
      doc.querySelectorAll('[data-enter]').forEach(element => element.classList.add('is-in'));
    }
    lifecycle?.update(motionContext());
    lifecycle?.pause(paused);
  };
  const onClick = (event: Event) => {
    if (!(event.target as Element | null)?.closest?.('.motion-toggle')) return;
    paused = !paused;
    try {
      localStorage.setItem(PAUSE_ITEM, String(paused));
    } catch {
      // storage refused: the choice holds for this page only
    }
    apply();
  };

  apply();
  if (field) lifecycle = new MotionLifecycle(fieldOption, { motionHost: MOTION_HOST } as HeroOption, motionContext(), paused, doc);
  const brandMark = doc.querySelector('.brand-mark');
  if (!markPlayed && brandMark && mark.animateIn && !reduce.matches && !paused) {
    markPlayed = true;
    disposeMark = mark.animateIn(brandMark, context());
  }
  const entrances = observeEntrances(doc, reduce.matches || paused);
  // The site's toggle owns data-theme; a flip re-colours the field in place, without a remount.
  const themes = new MutationObserver(apply);
  themes.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
  doc.addEventListener('click', onClick);
  dark.addEventListener('change', apply);
  reduce.addEventListener('change', apply);
  phone.addEventListener('change', place);

  const handle: BrandHandle = {
    destroy() {
      if (dead) return;
      dead = true;
      if (active === handle) active = undefined;
      themes.disconnect();
      doc.removeEventListener('click', onClick);
      dark.removeEventListener('change', apply);
      reduce.removeEventListener('change', apply);
      phone.removeEventListener('change', place);
      entrances.disconnect();
      lifecycle?.destroy();
      disposeMark?.();
      restore();
    },
  };
  active = handle;
  return handle;
}
