import type { Layer } from './contract';
export interface Preset { id: string; label: string; note: string; picks: Record<Layer,string> }
export const presets: Preset[] = [
  {
    id: 'a-tiling',
    label: 'A Tiling',
    note: 'Previous tiled-workspace direction, rebuilt from its ported visual layers. Canonical live copy replaces the rejected earlier headline.',
    picks: { mark: 'tile', type: 'a-tiling', color: 'fog-sodium', layout: 'tiling', hero: 'tiles', motion: 'dither-mist', copy: 'baseline-copy' },
  },
  {
    id: 'b-atelier',
    label: 'B Atelier',
    note: 'Previous editorial direction, rebuilt from its ported visual layers. Canonical live copy replaces the rejected earlier headline.',
    picks: { mark: 'bird', type: 'b-atelier', color: 'paper-rubric', layout: 'book', hero: 'spread', motion: 'terraces', copy: 'baseline-copy' },
  },
];
