import type { ColorOption } from '../../../src/contract';

// Strategy: Restrained. Green appears on the primary action, the goal and the you-are-here markers only.
// contrast:begin (written by options/color/check.mjs --write; WCAG 2 ratios, 8-bit sRGB)
// light on bg, bg-2, bg-3: ink 15.55 16.84 14.19; ink-2 7.84 8.49 7.16; ink-3 5.81 6.29 5.30; accent-2 5.48 5.94 5.00
//       accent-ink on accent 4.80; accent on bg, bg-2, bg-3 4.56 4.93 4.16; line-2 on bg, bg-2 4.13 4.48; line 1.49 1.62 1.36; ink on selection 12.95
//       fields vs bg 1.14 1.35 1.68; ink on fields 13.67 11.51 9.25; ink-2 on fields 6.89 5.81 4.67; focus on bg, bg-2, bg-3, fields 5.23 5.66 4.77 4.59 3.87 3.11
// dark  on bg, bg-2, bg-3: ink 15.58 14.65 16.24; ink-2 8.04 7.56 8.38; ink-3 5.62 5.29 5.86; accent-2 6.41 6.02 6.68
//       accent-ink on accent 6.41; accent on bg, bg-2, bg-3 6.41 6.02 6.68; line-2 on bg, bg-2 4.40 4.14; line 1.54 1.45 1.60; ink on selection 9.40
//       fields vs bg 1.11 1.30 1.71; ink on fields 14.06 12.02 9.12; ink-2 on fields 7.26 6.20 4.71; focus on bg, bg-2, bg-3, fields 6.41 6.02 6.68 5.78 4.94 3.75
// contrast:end
export default {
  id: 'stone-green',
  layer: 'color',
  label: 'Stone and signal green',
  summary: 'Direction C’s stairwell: warm stone and graphite with one signal green, the green of a passed check and an exit sign, on the action and the goal.',
  origin: 'C',
  refs: [
    { name: 'ISO 7010 safe condition signs', url: 'https://en.wikipedia.org/wiki/ISO_7010', what: 'Green as the colour of the way out and the safe state, read here as the step you can take next.' },
  ],
  light: {
    '--bg': 'oklch(0.958 0.004 90)',
    '--bg-2': 'oklch(0.985 0.003 90)',
    '--bg-3': 'oklch(0.928 0.005 90)',
    '--ink': 'oklch(0.215 0.01 90)',
    '--ink-2': 'oklch(0.41 0.01 90)',
    '--ink-3': 'oklch(0.48 0.01 90)',
    '--line': 'oklch(0.83 0.006 90)',
    '--line-2': 'oklch(0.56 0.008 90)',
    '--accent': 'oklch(0.52 0.135 150)',
    '--accent-ink': 'oklch(0.975 0.004 90)',
    '--accent-2': 'oklch(0.48 0.125 150)',
    '--focus': 'oklch(0.49 0.132 150)',
    '--selection': 'oklch(0.89 0.06 150)',
    '--field-1': 'oklch(0.915 0.006 90)',
    '--field-2': 'oklch(0.86 0.007 90)',
    '--field-3': 'oklch(0.795 0.008 90)',
  },
  dark: {
    '--bg': 'oklch(0.178 0.006 90)',
    '--bg-2': 'oklch(0.208 0.006 90)',
    '--bg-3': 'oklch(0.15 0.005 90)',
    '--ink': 'oklch(0.935 0.005 90)',
    '--ink-2': 'oklch(0.735 0.007 90)',
    '--ink-3': 'oklch(0.64 0.007 90)',
    '--line': 'oklch(0.33 0.006 90)',
    '--line-2': 'oklch(0.58 0.008 90)',
    '--accent': 'oklch(0.66 0.13 150)',
    '--accent-ink': 'oklch(0.178 0.006 90)',
    '--accent-2': 'oklch(0.66 0.13 150)',
    '--focus': 'oklch(0.66 0.13 150)',
    '--selection': 'oklch(0.34 0.06 150)',
    '--field-1': 'oklch(0.225 0.006 90)',
    '--field-2': 'oklch(0.28 0.007 90)',
    '--field-3': 'oklch(0.355 0.008 90)',
  },
} satisfies ColorOption;
