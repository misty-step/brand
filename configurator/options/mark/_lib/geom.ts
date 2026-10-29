// Vector construction helpers for the geometric marks (no index.ts here, so the registry ignores this folder).

const f = (n: number) => +n.toFixed(3);
export const at = (cx: number, cy: number, r: number, deg: number): [number, number] =>
  [f(cx + r * Math.cos((deg * Math.PI) / 180)), f(cy + r * Math.sin((deg * Math.PI) / 180))];

/**
 * A filled ring segment between two angles (degrees, screen space: 0 is +x, 90 is down).
 * `from` to `to` runs clockwise when to > from and counter-clockwise otherwise. Ends are radial cuts.
 */
export function sector(cx: number, cy: number, r: number, width: number, from: number, to: number): string {
  const ro = r + width / 2, ri = r - width / 2;
  const cw = to > from ? 1 : 0, large = Math.abs(to - from) > 180 ? 1 : 0;
  const [ax, ay] = at(cx, cy, ro, from), [bx, by] = at(cx, cy, ro, to);
  const [cx2, cy2] = at(cx, cy, ri, to), [dx, dy] = at(cx, cy, ri, from);
  return `M${ax} ${ay}A${f(ro)} ${f(ro)} 0 ${large} ${cw} ${bx} ${by}L${cx2} ${cy2}A${f(ri)} ${f(ri)} 0 ${large} ${1 - cw} ${dx} ${dy}Z`;
}

/** A lens (vesica) between two points on a horizontal line; `sag` is how far each lid bows from the line. */
export function lens(x0: number, x1: number, y: number, sag: number): string {
  const c = (x1 - x0) / 2, r = f((c * c + sag * sag) / (2 * sag));
  return `M${x0} ${y}A${r} ${r} 0 0 1 ${x1} ${y}A${r} ${r} 0 0 1 ${x0} ${y}Z`;
}

export const circle = (cx: number, cy: number, r: number): string =>
  `M${f(cx - r)} ${cy}a${r} ${r} 0 1 0 ${f(2 * r)} 0a${r} ${r} 0 1 0 ${f(-2 * r)} 0Z`;
