// Measuring instruments for the mark bench: pixel rasters as a browser draws a favicon, a one-bit
// threshold (fax, stencil, embroidery punch) and cap-height guides on lockups.
import type { ColorTokens, MarkOption } from '../contract';

export type Mark = MarkOption & { css?: string };

/** The renderer's favicon document for one scheme: the size-n drawing in an n x n svg, its colours resolved as the renderer resolves them. */
export function iconDocument(mark: Mark, tokens: ColorTokens, title: string, n = 16): string {
  const drawing = mark.svg({ size: n, title })
    .replace(/currentColor/g, tokens['--ink'])
    .replace(/var\((--[\w-]+)\)/g, (_, name: string) => tokens[name as keyof ColorTokens] ?? '');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${n}" viewBox="0 0 ${n} ${n}">${drawing}</svg>`;
}

export const dataUrl = (svg: string) => 'data:image/svg+xml,' + encodeURIComponent(svg);

export interface Raster { canvas: HTMLCanvasElement; inked: number; soft: number }

/** Draws an svg document into a px x px canvas: the pixels a browser shows for that size at 1x. */
export async function raster(svg: string, px: number): Promise<Raster> {
  const img = new Image();
  img.src = dataUrl(svg);
  await img.decode();
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = px;
  const g = canvas.getContext('2d', { willReadFrequently: true })!;
  g.drawImage(img, 0, 0, px, px);
  const { data } = g.getImageData(0, 0, px, px);
  let inked = 0, soft = 0;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] > 8) inked++;
    if (data[i] > 8 && data[i] < 247) soft++;
  }
  return { canvas, inked, soft };
}

/** The same pixels at one bit: coverage of half or more prints, anything less vanishes. */
export function oneBit(source: HTMLCanvasElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  const image = source.getContext('2d')!.getImageData(0, 0, source.width, source.height);
  const { data } = image;
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < data.length; i += 4) if (data[i + 3] > 247) { r = data[i]; g = data[i + 1]; b = data[i + 2]; break; }
  for (let i = 0; i < data.length; i += 4) {
    const on = data[i + 3] >= 128;
    data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = on ? 255 : 0;
  }
  canvas.getContext('2d')!.putImageData(image, 0, 0);
  return canvas;
}

/** Shows a raster at `css` CSS px with hard pixel edges. */
export function enlarge(canvas: HTMLCanvasElement, css: number): HTMLCanvasElement {
  canvas.className = 'mb-px';
  canvas.style.width = canvas.style.height = `${css}px`;
  return canvas;
}

/**
 * Guides over each lockup: the wordmark's cap height and baseline (solid) and the symbol's top and
 * bottom (dashed), measured from layout, so a symbol that misses the caps shows at a glance.
 * The baseline comes from an empty 1em inline-block probe; the cap height from the face's own H.
 */
export function drawGuides(scope: ParentNode) {
  const meter = document.createElement('canvas').getContext('2d')!;
  for (const cell of scope.querySelectorAll<HTMLElement>('.mb-lk[data-guides]')) {
    const layer = cell.querySelector<HTMLElement>('.mb-guides')!;
    layer.replaceChildren();
    const box = cell.getBoundingClientRect();
    const line = (y: number, kind: 'cap' | 'base' | 'mark') => {
      const el = document.createElement('i');
      el.className = `mb-g mb-g-${kind}`;
      el.style.top = `${Math.round(y - box.top)}px`;
      layer.append(el);
    };
    const symbol = cell.querySelector('.brand-mark svg');
    if (symbol) {
      const r = symbol.getBoundingClientRect();
      line(r.top, 'mark');
      line(r.bottom - 1, 'mark');
    }
    const name = cell.querySelector<HTMLElement>('.brand-name');
    if (!name) continue;
    const drawn = name.querySelector('svg');
    if (drawn) {
      const r = drawn.getBoundingClientRect();
      line(r.top, 'cap');
      line(r.bottom - 1, 'base');
      continue;
    }
    const probe = document.createElement('span');
    probe.className = 'mb-probe';
    name.append(probe);
    const r = probe.getBoundingClientRect();
    probe.remove();
    const cs = getComputedStyle(name);
    meter.font = `${cs.fontWeight} 100px ${cs.fontFamily}`;
    const cap = meter.measureText('H').actualBoundingBoxAscent / 100;
    line(r.bottom - 1, 'base');
    line(r.bottom - cap * r.height, 'cap');
  }
}
