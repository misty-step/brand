import type { Layer } from './contract';
import { LAYERS, optionIds } from './options';
// tune: Tune panel overrides per motion option id ({ 'r2-mist-ground': { density: 0.6 } }); a missing entry means the option's defaults.
export interface LabState { v: 1; page: 'studio'|'stack'; theme: 'light'|'dark'; reducedMotion: boolean; paused: boolean; fullPreview?: boolean; preset?: string; picks: Record<Layer,string>; locks: Layer[]; tune?: Record<string, Record<string, number>> }
export function baseline(): LabState { return { v: 1, page: 'studio', theme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light', reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches, paused: localStorage.getItem('lab-motion-paused') === 'true', picks: Object.fromEntries(LAYERS.map(l => [l, 'baseline-' + l])) as Record<Layer,string>, locks: [] }; }
export const encode = (state: LabState) => '#' + encodeURIComponent(JSON.stringify(state));
export function decode(hash: string): LabState {
  const state = baseline();
  try {
    const value = JSON.parse(decodeURIComponent(hash.replace(/^#/, '')));
    if (value.page === 'stack') state.page = 'stack';
    if (value.theme === 'light' || value.theme === 'dark') state.theme = value.theme;
    state.reducedMotion = value.reducedMotion === true;
    state.paused = value.paused === true;
    state.fullPreview = value.fullPreview === true;
    if (typeof value.preset === 'string') state.preset = value.preset;
    state.locks = Array.isArray(value.locks) ? value.locks.filter((layer: Layer) => LAYERS.includes(layer)) : [];
    for (const layer of LAYERS) {
      if (optionIds(layer).includes(value.picks?.[layer])) state.picks[layer] = value.picks[layer];
    }
    const tune = Object.entries(value.tune ?? {}).filter(([id]) => optionIds('motion').includes(id)).map(([id, values]) => [id, Object.fromEntries(Object.entries(values ?? {}).filter(([key, v]) => /^\w{1,24}$/.test(key) && typeof v === 'number' && Number.isFinite(v)))] as const).filter(([, values]) => Object.keys(values).length);
    if (tune.length) state.tune = Object.fromEntries(tune);
  } catch {
    // Empty or invalid links open the plain baseline.
  }
  return state;
}
