import type { Layer } from './contract';
export interface Preset { id: string; label: string; note: string; picks: Record<Layer,string> }
// Opinionated starting points: each is one complete direction, all seven layers chosen together.
// The three previous-round directions come last, rebuilt from their ported parts.
export const presets: Preset[] = [
  {
    id: 'mist',
    label: 'Mist',
    note: 'Misty Step itself: the name drawn in pixels standing in fog, one sodium lamp on the action, the page built on one 4px step, and in-page links that teleport through half a second of pixel mist, the spell the studio is named for.',
    picks: { mark: 'banded', type: 'precise-grotesk', color: 'fog-sodium', layout: 'steps', hero: 'wordmark', motion: 'mist-step', copy: 'show-the-work' },
  },
  {
    id: 'report',
    label: 'Report',
    note: 'Stripe: light type in navy ink, one magenta action and one screenprinted ribbon through the opening, with every section a two-tone lede beside ruled entries, so the business case reads like a carefully set report.',
    picks: { mark: 'lettered', type: 'light-ledger', color: 'navy-magenta', layout: 'editorial', hero: 'horizon', motion: 'field-mesh', copy: 'business-case' },
  },
  {
    id: 'void',
    label: 'Void',
    note: 'Grok and x.ai: one stippled black hole in a monochrome void, the single light in the room, with a pixel display face drawn from the same pixels, an eye for a mark and short, hard sentences.',
    picks: { mark: 'oracle', type: 'geist-pixel', color: 'mono', layout: 'corners', hero: 'horizon', motion: 'event-horizon', copy: 'hard-edges' },
  },
  {
    id: 'precise',
    label: 'Precise',
    note: 'Linear with Vercel\'s light: near-black slate stepped by lightness, one in-between display weight, the real core file as the product on stage, and light climbing the page grid to land on one accent step.',
    picks: { mark: 'blink', type: 'precise-grotesk', color: 'slate-indigo', layout: 'bento', hero: 'stage', motion: 'grid-beams', copy: 'quiet-craft' },
  },
  {
    id: 'proof',
    label: 'Proof',
    note: 'Greptile and Macroscope: a code-review register of grey paper, violet-grey ink and one mint signal, square and flat, with the real core lines and install commands as the opening artefact and nothing moving until you touch it.',
    picks: { mark: 'stairs', type: 'mono-console', color: 'grey-mint', layout: 'console', hero: 'source', motion: 'still', copy: 'working-code' },
  },
  {
    id: 'network',
    label: 'Network',
    note: 'Cloudflare: warm grey with one tangerine fill, a dotted globe crossed by one traveller in the opening pane, wide heavy type whose figures turn pixel, and a ruled ledger that explains the process before the technology.',
    picks: { mark: 'cloudstep', type: 'c-steps', color: 'tangerine', layout: 'ledger', hero: 'tiles', motion: 'dot-globe', copy: 'process-first' },
  },
  {
    id: 'book',
    label: 'Book',
    note: 'pi and Earendil: a software studio set as a well-made book, Brygada italic on stone paper with one steel ink, the real core file and install line as its first figure, and a headline that assembles once from pixels before the page goes still.',
    picks: { mark: 'lettered', type: 'book-italic', color: 'stone-steel', layout: 'book', hero: 'source', motion: 'pixel-assemble', copy: 'human-scale' },
  },
  {
    id: 'plate',
    label: 'Plate',
    note: 'Brass Hands, used only for the mark, the plate hero and the step glyph: an equipment nameplate in condensed capitals with the real terms in its spec row and voxel steps in its window, inked in Flexoki rather than defence olive.',
    picks: { mark: 'plate', type: 'industrial-condensed', color: 'flexoki', layout: 'ledger', hero: 'plate', motion: 'voxel-stairs', copy: 'business-case' },
  },
  {
    id: 'a-tiling',
    label: 'A Tiling (previous round)',
    note: 'Previous round A, rebuilt from its ported parts: Omarchy\'s tiled workspace with a dithered mist pane, Schibsted Grotesk, and one sodium amber that only ever means active.',
    picks: { mark: 'tile', type: 'a-tiling', color: 'fog-sodium', layout: 'tiling', hero: 'tiles', motion: 'dither-mist', copy: 'working-code' },
  },
  {
    id: 'b-atelier',
    label: 'B Atelier (previous round)',
    note: 'Previous round B, rebuilt from its ported parts: an editorial book in Literata with Departure Mono for chrome, the pixel bird, and terraced hills surfacing from mist beside the title page.',
    picks: { mark: 'bird', type: 'b-atelier', color: 'paper-rubric', layout: 'book', hero: 'spread', motion: 'terraces', copy: 'quiet-craft' },
  },
  {
    id: 'c-steps',
    label: 'C Steps (previous round)',
    note: 'Previous round C, rebuilt from its ported parts: the step as the unit, with the priced offer as treads, voxel stairs building out of mist, Archivo with pixel numerals and one signal green.',
    picks: { mark: 'stairs', type: 'c-steps', color: 'stone-green', layout: 'steps', hero: 'treads', motion: 'voxel-stairs', copy: 'process-first' },
  },
];
