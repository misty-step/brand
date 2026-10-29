import type { ColorOption } from '../../../src/contract';

// Strategy: Restrained. Amber marks only the active thing (action, current item, focus); cool fog and night do the rest.
// contrast:begin (written by options/color/check.mjs --write; WCAG 2 ratios, 8-bit sRGB)
// light on bg, bg-2, bg-3: ink 13.85 15.28 12.84; ink-2 7.80 8.61 7.24; ink-3 5.78 6.38 5.36; accent-2 5.19 5.72 4.81
//       accent-ink on accent 8.47; accent on bg, bg-2, bg-3 1.61 1.77 1.49; focus 4.26 4.70 3.95; line-2 on bg, bg-2 3.33 3.67; line 1.31 1.45 1.22; ink on selection 11.37
//       fields vs bg 1.12 1.31 1.71; ink on fields 12.35 10.54 8.07; ink-2 on field-1, field-2 6.96 5.94
// dark  on bg, bg-2, bg-3: ink 15.62 14.88 16.20; ink-2 8.99 8.56 9.33; ink-3 5.73 5.46 5.95; accent-2 10.11 9.63 10.49
//       accent-ink on accent 9.36; accent on bg, bg-2, bg-3 10.11 9.63 10.49; focus 10.87 10.36 11.28; line-2 on bg, bg-2 3.22 3.07; line 1.47 1.40 1.52; ink on selection 8.89
//       fields vs bg 1.10 1.24 1.67; ink on fields 14.21 12.55 9.35; ink-2 on field-1, field-2 8.18 7.23
// contrast:end
export default {
  id: 'fog-sodium',
  layer: 'color',
  label: 'Fog and sodium',
  summary: 'Direction A’s weather: cool fog by day and night with one sodium-lamp amber that only ever marks the active thing, mist as the material and the lamp as the signal.',
  origin: 'A',
  refs: [
    { name: 'Sodium-vapor lamp', url: 'https://en.wikipedia.org/wiki/Sodium-vapor_lamp', what: 'The amber of street lighting in fog: the one warm light in a cool scene, kept for state.' },
    { name: 'Omarchy', url: 'https://omarchy.org', what: 'One brand colour that fills the primary action and marks state over a curated neutral theme; Direction A swapped its acid green for amber.' },
  ],
  light: {
    '--bg': 'oklch(0.942 0.006 245)',
    '--bg-2': 'oklch(0.975 0.004 245)',
    '--bg-3': 'oklch(0.918 0.007 245)',
    '--ink': 'oklch(0.24 0.02 255)',
    '--ink-2': 'oklch(0.4 0.018 255)',
    '--ink-3': 'oklch(0.47 0.016 255)',
    '--line': 'oklch(0.855 0.008 245)',
    '--line-2': 'oklch(0.6 0.014 250)',
    '--accent': 'oklch(0.8 0.15 78)',
    '--accent-ink': 'oklch(0.25 0.05 65)',
    '--accent-2': 'oklch(0.5 0.105 68)',
    '--focus': 'oklch(0.55 0.122 62)',
    '--selection': 'oklch(0.88 0.07 80)',
    '--field-1': 'oklch(0.905 0.009 245)',
    '--field-2': 'oklch(0.855 0.012 248)',
    '--field-3': 'oklch(0.775 0.016 250)',
  },
  dark: {
    '--bg': 'oklch(0.165 0.012 255)',
    '--bg-2': 'oklch(0.195 0.013 255)',
    '--bg-3': 'oklch(0.14 0.011 255)',
    '--ink': 'oklch(0.93 0.008 250)',
    '--ink-2': 'oklch(0.76 0.012 250)',
    '--ink-3': 'oklch(0.64 0.012 250)',
    '--line': 'oklch(0.31 0.014 255)',
    '--line-2': 'oklch(0.5 0.015 255)',
    '--accent': 'oklch(0.8 0.14 78)',
    '--accent-ink': 'oklch(0.21 0.04 65)',
    '--accent-2': 'oklch(0.8 0.14 78)',
    '--focus': 'oklch(0.82 0.14 78)',
    '--selection': 'oklch(0.36 0.06 78)',
    '--field-1': 'oklch(0.215 0.014 255)',
    '--field-2': 'oklch(0.262 0.016 255)',
    '--field-3': 'oklch(0.345 0.02 255)',
  },
} satisfies ColorOption;
