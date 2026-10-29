import { mistOption } from '../_r2-mist/option';

export default mistOption({
  id: 'r2-mist-drift',
  label: 'Drift',
  summary: "The same banks as stipple that travels with the mist: each bank carries its own dots at its own speed, so the depth reads in motion and the field feels like weather passing rather than a screen being redrawn.",
  refs: [
    { name: 'Lucas Pope: Return of the Obra Dinn devlog', url: 'https://forums.tigsource.com/index.php?topic=40832.msg1363742#msg1363742', what: 'One-bit dither judged in motion: a screen fixed to the display shimmers as things move through it, a pattern carried by the world reads as material. Each bank here can carry its own screen.' },
    { name: 'Stippling', url: 'https://en.wikipedia.org/wiki/Stippling', what: 'Tone from separate dots that never merge: the densest mist stays a field of points, which makes each bank legible as it slides past the others.' },
    { name: 'Omarchy', url: 'https://omarchy.org/', what: 'A pixel-cell field on one strict grid that thickens toward the bottom edge and stops offscreen. Here the cells pool as ground fog under a horizon line and keep clear of the words.' },
  ],
  values: { screen: 5, cell: 2, inks: 3, density: 0.7, height: 0.5, depth: 0.45, wind: 1.2, turbulence: 0.5, travel: 1, step: 0.25 },
  look: { entrance: "drift", wake: 1, lift: 0.6, feather: 1.3, wisps: 1, horizon: 0.3 },
});
