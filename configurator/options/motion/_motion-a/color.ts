// Palette helpers shared by MotionA's options. ctx.colors arrives as raw computed custom
// property strings (usually oklch()), so every value is resolved by the browser itself.
import type { MotionCtx } from '../../../src/contract';

export type RGB = [number, number, number];

export interface Palette {
  bg: RGB; ink: RGB; accent: RGB;
  /** --field-1..3: a ramp from --bg toward --ink, faintest first. */
  f1: RGB; f2: RGB; f3: RGB;
  /** The opaque colour actually behind the host (a panel may sit on --bg-2). */
  ground: RGB;
  dark: boolean;
}

let probe: CanvasRenderingContext2D | null = null;

function viaCanvas(value: string): [number, number, number, number] | null {
  if (!probe) {
    const c = document.createElement('canvas');
    c.width = c.height = 1;
    probe = c.getContext('2d', { willReadFrequently: true });
  }
  const c = probe!;
  // An unparsable value leaves fillStyle untouched, so two different sentinels disagree.
  c.fillStyle = '#000';
  c.fillStyle = value;
  const first = c.fillStyle;
  c.fillStyle = '#fff';
  c.fillStyle = value;
  if (first !== c.fillStyle) return null;
  c.clearRect(0, 0, 1, 1);
  c.fillRect(0, 0, 1, 1);
  const d = c.getImageData(0, 0, 1, 1).data;
  return [d[0] / 255, d[1] / 255, d[2] / 255, d[3] / 255];
}

/** Any CSS colour (oklch, color-mix, var() inside scope) to gamma-encoded sRGB 0..1. */
export function parseColor(value: string, scope: Element, fallback: RGB): RGB {
  const v = value.trim();
  if (!v) return fallback;
  const direct = viaCanvas(v);
  if (direct) return [direct[0], direct[1], direct[2]];
  const el = document.createElement('i');
  el.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;visibility:hidden';
  el.style.color = v;
  scope.appendChild(el);
  const resolved = viaCanvas(getComputedStyle(el).color);
  el.remove();
  return resolved ? [resolved[0], resolved[1], resolved[2]] : fallback;
}

/** The first opaque background at or above `el`. */
function groundOf(el: Element | null, fallback: RGB): RGB {
  for (let n = el; n; n = n.parentElement) {
    const c = viaCanvas(getComputedStyle(n).backgroundColor);
    if (c && c[3] > 0.98) return [c[0], c[1], c[2]];
  }
  return fallback;
}

const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
export const luminance = (c: RGB) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
export const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

export function palette(ctx: MotionCtx, host: Element): Palette {
  const k = ctx.colors;
  const bg = parseColor(k.bg, host, ctx.theme === 'dark' ? [0.1, 0.1, 0.1] : [0.95, 0.95, 0.95]);
  const ink = parseColor(k.ink, host, ctx.theme === 'dark' ? [0.93, 0.93, 0.93] : [0.12, 0.12, 0.12]);
  const f1 = parseColor(k.field1, host, mix(bg, ink, 0.08));
  const f2 = parseColor(k.field2, host, mix(bg, ink, 0.16));
  const f3 = parseColor(k.field3, host, mix(bg, ink, 0.28));
  const accent = parseColor(k.accent, host, f3);
  return { bg, ink, accent, f1, f2, f3, ground: groundOf(host, bg), dark: luminance(bg) < luminance(ink) };
}
