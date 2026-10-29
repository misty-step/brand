import type { Layer } from './contract';
import { LAYERS, optionIds } from './options';
export interface LabState { v: 1; page: 'studio'|'stack'; theme: 'light'|'dark'; reducedMotion: boolean; paused: boolean; fullPreview?: boolean; picks: Record<Layer,string>; locks: Layer[] }
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
    state.locks = Array.isArray(value.locks) ? value.locks.filter((layer: Layer) => LAYERS.includes(layer)) : [];
    for (const layer of LAYERS) {
      if (optionIds(layer).includes(value.picks?.[layer])) state.picks[layer] = value.picks[layer];
    }
  } catch {
    // Empty or invalid links open the plain baseline.
  }
  return state;
}
