import type { ColorOption } from '../../../src/contract';

// Strategy: Restrained. Safety orange is a fill and a focus ring only; olive is the second ink; khaki and olive drab fill the field.
// contrast:begin (written by options/color/check.mjs --write; WCAG 2 ratios, 8-bit sRGB)
// light on bg, bg-2, bg-3: ink 14.40 15.95 13.02; ink-2 7.61 8.43 6.88; ink-3 5.45 6.03 4.92; accent-2 6.35 7.04 5.74
//       accent-ink on accent 5.22; accent on bg, bg-2, bg-3 2.76 3.06 2.50; focus 4.20 4.65 3.80; line-2 on bg, bg-2 3.28 3.64; line 1.23 1.37 1.11; ink on selection 11.06
//       fields vs bg 1.14 1.34 1.69; ink on fields 12.64 10.77 8.53; ink-2 on field-1, field-2 6.68 5.69
// dark  on bg, bg-2, bg-3: ink 15.84 14.33 16.41; ink-2 9.46 8.56 9.81; ink-3 6.09 5.51 6.31; accent-2 10.19 9.22 10.56
//       accent-ink on accent 6.27; accent on bg, bg-2, bg-3 6.27 5.67 6.50; focus 7.08 6.40 7.33; line-2 on bg, bg-2 3.57 3.23; line 1.33 1.21 1.38; ink on selection 9.08
//       fields vs bg 1.14 1.35 1.75; ink on fields 13.91 11.74 9.04; ink-2 on field-1, field-2 8.31 7.02
// contrast:end
export default {
  id: 'olive-safety',
  layer: 'color',
  label: 'Olive and safety orange',
  summary: 'Olive-black and sage with khaki fields and safety orange held back for the action and focus: an industrial register for a studio that puts AI to work inside real operations.',
  origin: 'new',
  refs: [
    { name: 'Brass Hands', url: 'https://brasshands.com', what: 'Its own tokens: charcoal ground, cool grey type (#adb3b7), safety orange (#ff6200, #ff7235) for links, dashed rules and the one bordered action, and the pale sage #e7ece5 used here as the light ground. Olive and khaki carry its “design for the new industrial age” line into the neutrals and the field.' },
  ],
  light: {
    '--bg': 'oklch(0.937 0.011 136.6)',
    '--bg-2': 'oklch(0.972 0.008 130)',
    '--bg-3': 'oklch(0.905 0.016 118)',
    '--ink': 'oklch(0.22 0.015 125)',
    '--ink-2': 'oklch(0.4 0.025 118)',
    '--ink-3': 'oklch(0.48 0.025 115)',
    '--line': 'oklch(0.87 0.016 125)',
    '--line-2': 'oklch(0.6 0.025 118)',
    '--accent': 'oklch(0.665 0.198 41)',
    '--accent-ink': 'oklch(0.22 0.015 125)',
    '--accent-2': 'oklch(0.44 0.095 118)',
    '--focus': 'oklch(0.56 0.17 40)',
    '--selection': 'oklch(0.86 0.06 45)',
    '--field-1': 'oklch(0.895 0.02 112)',
    '--field-2': 'oklch(0.845 0.032 110)',
    '--field-3': 'oklch(0.775 0.045 112)',
  },
  dark: {
    '--bg': 'oklch(0.18 0.01 118)',
    '--bg-2': 'oklch(0.225 0.012 118)',
    '--bg-3': 'oklch(0.155 0.009 118)',
    '--ink': 'oklch(0.94 0.012 135)',
    '--ink-2': 'oklch(0.78 0.028 105)',
    '--ink-3': 'oklch(0.66 0.025 110)',
    '--line': 'oklch(0.29 0.014 118)',
    '--line-2': 'oklch(0.53 0.02 115)',
    '--accent': 'oklch(0.69 0.207 42)',
    '--accent-ink': 'oklch(0.18 0.01 118)',
    '--accent-2': 'oklch(0.8 0.09 110)',
    '--focus': 'oklch(0.72 0.176 42)',
    '--selection': 'oklch(0.36 0.05 115)',
    '--field-1': 'oklch(0.235 0.025 115)',
    '--field-2': 'oklch(0.29 0.04 115)',
    '--field-3': 'oklch(0.36 0.055 112)',
  },
} satisfies ColorOption;
