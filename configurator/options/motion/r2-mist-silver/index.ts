import { mistOption } from '../_r2-mist/option';

export default mistOption({
  id: 'r2-mist-silver',
  label: 'Silvery',
  summary: "The spell itself: a fine, pale, near-still mist in three inks where patches glitter, vanish and reappear a short step away every few seconds, and the headline makes the same short step into place.",
  refs: [
    { name: 'Misty Step, D&D 5e SRD', url: 'https://5thsrd.org/spellcasting/spells/misty_step/', what: 'Briefly surrounded by silvery mist, you teleport a short way to a place you can see: a patch of mist glitters, vanishes and reappears a short step away, and the headline lands the same way.' },
    { name: 'Moments in Graphics: free blue noise textures', url: 'http://momentsingraphics.de/BlueNoise.html', what: 'Blue-noise thresholds space the inked cells evenly at every density, so the mist reads as grain instead of the cross-hatch a Bayer matrix draws. Generated here by void-and-cluster at load.' },
  ],
  values: { screen: 0, cell: 2, inks: 3, density: 0.55, height: 0.4, depth: 0.35, wind: 0.25, turbulence: 0.3, travel: 0, step: 0.85 },
  look: { entrance: "step", wake: 0.8, lift: 0.7, feather: 1.1, wisps: 0.6, horizon: 0.4 },
});
