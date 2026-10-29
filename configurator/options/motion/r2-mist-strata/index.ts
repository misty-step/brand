import { mistOption } from '../_r2-mist/option';

export default mistOption({
  id: 'r2-mist-strata',
  label: 'Strata',
  summary: "Mist as an engraved landscape: horizontal lines that break into dashes where the fog thins and thicken where it pools, calm and stratified under a solid horizon, with the headline scanned in line by line.",
  refs: [
    { name: 'Hatching', url: 'https://en.wikipedia.org/wiki/Hatching', what: 'Tone carried by the weight and continuity of parallel lines; here horizontal lines break into dashes where the mist thins and thicken where it pools, like an engraved landscape.' },
    { name: 'Omarchy', url: 'https://omarchy.org/', what: 'A pixel-cell field on one strict grid that thickens toward the bottom edge and stops offscreen. Here the cells pool as ground fog under a horizon line and keep clear of the words.' },
  ],
  values: { screen: 4, cell: 2, inks: 2, density: 0.62, height: 0.46, depth: 0.5, wind: 0.45, turbulence: 0.15, travel: 0, step: 0.3 },
  look: { entrance: "lines", wake: 0.85, lift: 0.8, feather: 1.2, wisps: 0.3, horizon: 0.6 },
});
