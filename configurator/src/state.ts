import type { Layer } from './contract';
import { LAYERS, optionIds } from './options';
export interface LabState { v: 1; page: 'studio'|'stack'; theme: 'light'|'dark'; reducedMotion: boolean; paused: boolean; picks: Record<Layer,string>; locks: Layer[] }
export function baseline(): LabState { return { v: 1, page: 'studio', theme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light', reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches, paused: localStorage.getItem('lab-motion-paused') === 'true', picks: Object.fromEntries(LAYERS.map(l => [l, 'baseline-' + l])) as Record<Layer,string>, locks: [] }; }
export const encode = (state: LabState) => '#' + encodeURIComponent(JSON.stringify(state));
export function decode(hash: string): LabState {
  const state = baseline();
  try { const x = JSON.parse(decodeURIComponent(hash.replace(/^#/,''))); if (x.page === 'stack') state.page = 'stack'; if (x.theme === 'light' || x.theme === 'dark') state.theme=x.theme; state.reducedMotion=x.reducedMotion === true; state.paused=x.paused === true; state.locks=Array.isArray(x.locks)? x.locks.filter((l: Layer)=>LAYERS.includes(l)):[]; for (const l of LAYERS) if (optionIds(l).includes(x.picks?.[l])) state.picks[l]=x.picks[l]; } catch { /* Empty or invalid links open the plain baseline. */ }
  return state;
}
