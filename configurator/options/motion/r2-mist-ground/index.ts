import { mistOption } from '../_r2-mist/option';

export default mistOption({
  id: 'r2-mist-ground',
  label: 'Ground fog',
  summary: "Ground fog in three banks under a one-cell horizon line, drawn through a blue-noise screen in two inks: dense on the ground, thinning upward with wisps, drifting right at three speeds, parted by the pointer and lifted by scrolling, and now and then a patch steps a short way off.",
  refs: [
    { name: 'Omarchy', url: 'https://omarchy.org/', what: 'A pixel-cell field on one strict grid that thickens toward the bottom edge and stops offscreen. Here the cells pool as ground fog under a horizon line and keep clear of the words.' },
    { name: 'Moments in Graphics: free blue noise textures', url: 'http://momentsingraphics.de/BlueNoise.html', what: 'Blue-noise thresholds space the inked cells evenly at every density, so the mist reads as grain instead of the cross-hatch a Bayer matrix draws. Generated here by void-and-cluster at load.' },
    { name: 'Earendil', url: 'https://earendil.com/', what: 'A living backdrop at a fraction of CSS resolution that gets out of the way of one sentence; this field draws one canvas pixel per 2 to 6 CSS px and steps its frame rate down when frames drop.' },
  ],
  values: { screen: 0, cell: 3, inks: 2, density: 0.6, height: 0.42, depth: 0.5, wind: 0.6, turbulence: 0.35, travel: 0, step: 0.35 },
  look: { entrance: "clear", wake: 0.9, lift: 0.8, feather: 1, wisps: 0.8, horizon: 0.45 },
});
