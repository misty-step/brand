import type { MarkOption } from '../../../src/contract';
import { css, draw } from './plate';

// Plate II: the plate Phaedrus kept, redrawn on a construction (see plate.ts): the display face's own M cut through a
// square cut-metal plate, over the weather-map sign for mist with its lower bar stepped short by one unit.
// The conservative twin of r2-c-plate-edge, which cuts the same sign through the plate's edge.

export default {
  id: 'r2-c-plate',
  layer: 'mark',
  label: 'Plate II',
  origin: 'r2',
  summary: "The plate you kept, redrawn: Sofia Sans Extra Condensed's own M cut through a square metal plate, over the weather-map sign for mist with its lower bar stepped short by one unit; separate drawings for the tab (16), 24, the nav (32) and display.",
  refs: [
    { name: 'WMO present-weather symbols', url: 'https://github.com/OGCMetOceanDWG/WorldWeatherSymbols', what: 'The plotted sign for mist (ww 10) is two parallel bars; fog (ww 40 to 49) is three. The plate carries the two-bar sign, with the step as the one change.' },
    { name: 'Brass Hands', url: 'https://www.brasshands.com', what: 'Identity as equipment: data plates and marks drawn to pass a shipping-container test, so the plate is a solid cut-metal shape that survives stencilling, stamping and a 16 px tab.' },
  ],
  svg: ({ size }) => draw(size, false),
  css: css('r2-c-plate'),
} satisfies MarkOption & { css: string };
