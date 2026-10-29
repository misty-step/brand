import type { ColorOption } from '../../../src/contract';

// Strategy: No hue, mid-scale grounds. Ink fills the action; the grounds sit off both ends of the scale so the page reads as weather.
// contrast:begin (written by options/color/check.mjs --write; WCAG 2 ratios, 8-bit sRGB)
// light on bg, bg-2, bg-3: ink 11.54 12.67 10.68; ink-2 6.80 7.46 6.29; ink-3 5.29 5.81 4.90; accent-2 11.54 12.67 10.68
//       accent-ink on accent 12.67; accent on bg, bg-2, bg-3 11.54 12.67 10.68; line-2 on bg, bg-2 3.47 3.81; line 1.30 1.42 1.20; ink on selection 7.74
//       fields vs bg 1.10 1.22 1.38; ink on fields 10.47 9.47 8.35; ink-2 on fields 6.17 5.58 4.92; focus on bg, bg-2, bg-3, fields 11.54 12.67 10.68 10.47 9.47 8.35
// dark  on bg, bg-2, bg-3: ink 11.58 9.53 13.28; ink-2 7.81 6.43 8.95; ink-3 6.15 5.07 7.06; accent-2 11.58 9.53 13.28
//       accent-ink on accent 11.58; accent on bg, bg-2, bg-3 11.58 9.53 13.28; line-2 on bg, bg-2 3.92 3.23; line 1.56 1.28 1.79; ink on selection 5.78
//       fields vs bg 1.14 1.31 1.56; ink on fields 10.13 8.82 7.42; ink-2 on fields 6.83 5.94 5.00; focus on bg, bg-2, bg-3, fields 11.58 9.53 13.28 10.13 8.82 7.42
// contrast:end
export default {
  id: 'overcast',
  layer: 'color',
  label: 'Overcast',
  summary: 'Mid-grey sky and sea with no hue at all, graphite type by day and white type at night: Misty Step’s name taken literally, as weather.',
  origin: 'new',
  refs: [
    { name: 'Earendil', url: 'https://earendil.com', what: 'Pure monochrome with no accent: a night sky of #303030 over a #3d3d3d sea with white type at 95%, and a day of #dedede over #d6d6d6. The grounds sit in the middle of the scale rather than at the ends.' },
  ],
  light: {
    '--bg': 'oklch(0.901 0 0)',
    '--bg-2': 'oklch(0.93 0 0)',
    '--bg-3': 'oklch(0.876 0 0)',
    '--ink': 'oklch(0.26 0 0)',
    '--ink-2': 'oklch(0.4 0 0)',
    '--ink-3': 'oklch(0.46 0 0)',
    '--line': 'oklch(0.82 0 0)',
    '--line-2': 'oklch(0.56 0 0)',
    '--accent': 'oklch(0.26 0 0)',
    '--accent-ink': 'oklch(0.93 0 0)',
    '--accent-2': 'oklch(0.26 0 0)',
    '--focus': 'oklch(0.26 0 0)',
    '--selection': 'oklch(0.78 0 0)',
    '--field-1': 'oklch(0.87 0 0)',
    '--field-2': 'oklch(0.84 0 0)',
    '--field-3': 'oklch(0.8 0 0)',
  },
  dark: {
    '--bg': 'oklch(0.309 0 0)',
    '--bg-2': 'oklch(0.36 0 0)',
    '--bg-3': 'oklch(0.27 0 0)',
    '--ink': 'oklch(0.955 0 0)',
    '--ink-2': 'oklch(0.83 0 0)',
    '--ink-3': 'oklch(0.76 0 0)',
    '--line': 'oklch(0.42 0 0)',
    '--line-2': 'oklch(0.64 0 0)',
    '--accent': 'oklch(0.955 0 0)',
    '--accent-ink': 'oklch(0.309 0 0)',
    '--accent-2': 'oklch(0.955 0 0)',
    '--focus': 'oklch(0.955 0 0)',
    '--selection': 'oklch(0.48 0 0)',
    '--field-1': 'oklch(0.345 0 0)',
    '--field-2': 'oklch(0.38 0 0)',
    '--field-3': 'oklch(0.42 0 0)',
  },
} satisfies ColorOption;
