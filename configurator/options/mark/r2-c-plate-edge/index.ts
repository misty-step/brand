import type { MarkOption } from '../../../src/contract';
import { css, draw, stepOut } from '../r2-c-plate/plate';

// The plate with the weather-map sign for mist keyed into its right edge (construction in ../r2-c-plate/plate.ts):
// the upper bar is cut out through the edge, the lower bar starts one unit later and stops one unit short of it.
// One notch reads as a cut or keyed plate (two parallel notches read as the pages of a book), keeps the silhouette
// recognisable at 16 px, and separates the mark from an M in a chamfered octagon (MG).

export default {
  id: 'r2-c-plate-edge',
  layer: 'mark',
  label: 'Plate, stepped edge',
  origin: 'r2',
  summary: "A square cut-metal plate with the display face's own M over the weather-map sign for mist, its upper bar keyed out through the plate's edge and the lower bar stepped one unit short: the step is in the silhouette, down to the 16 px tab.",
  refs: [
    { name: 'WMO present-weather symbols', url: 'https://github.com/OGCMetOceanDWG/WorldWeatherSymbols', what: 'The plotted sign for mist (ww 10) is two parallel bars. With its upper bar cut through the edge, the sign becomes part of the plate\'s outline rather than a detail inside it.' },
    { name: 'Brass Hands', url: 'https://www.brasshands.com', what: 'Data plates drawn to pass a shipping-container test: a solid cut-metal shape whose slots survive stencilling, stamping and a 16 px tab.' },
  ],
  svg: ({ size }) => draw(size, true),
  animateIn: stepOut,
  css: css('r2-c-plate-edge'),
} satisfies MarkOption & { css: string };
