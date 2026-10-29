import { mistOption } from '../_r2-mist/option';

export default mistOption({
  id: 'r2-mist-halftone',
  label: 'Halftone',
  summary: "Ground fog printed as a newspaper photograph: one ink in clustered dots on a 45 degree screen that swell where the mist pools, with the headline arriving through the same dots.",
  refs: [
    { name: 'Halftone', url: 'https://en.wikipedia.org/wiki/Halftone', what: 'An amplitude-modulated screen: clustered dots on a 45 degree grid that swell with density until they merge, the print grammar of a newspaper photograph.' },
    { name: 'Omarchy', url: 'https://omarchy.org/', what: 'A pixel-cell field on one strict grid that thickens toward the bottom edge and stops offscreen. Here the cells pool as ground fog under a horizon line and keep clear of the words.' },
  ],
  values: { screen: 3, cell: 2, inks: 1, density: 0.6, height: 0.44, depth: 0.55, wind: 0.5, turbulence: 0.25, travel: 0, step: 0.3 },
  look: { entrance: "dots", wake: 0.85, lift: 0.8, feather: 0.8, wisps: 0.5, horizon: 0.5 },
});
