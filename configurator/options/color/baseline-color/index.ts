import type { ColorOption } from '../../../src/contract';

// Strategy: Plain control. Green-grey neutrals and an ink-dark accent with no direction claim; fields kept light enough that text and focus stay legal over them.
// contrast:begin (written by options/color/check.mjs --write; WCAG 2 ratios, 8-bit sRGB)
// light on bg, bg-2, bg-3: ink 13.79 14.40 12.37; ink-2 7.09 7.41 6.36; ink-3 5.48 5.72 4.92; accent-2 6.81 7.12 6.11
//       accent-ink on accent 10.46; accent on bg, bg-2, bg-3 10.21 10.67 9.16; line-2 on bg, bg-2 3.62 3.78; line 1.39 1.45 1.24; ink on selection 11.28
//       fields vs bg 1.14 1.30 1.52; ink on fields 12.08 10.58 9.07; ink-2 on fields 6.21 5.44 4.67; focus on bg, bg-2, bg-3, fields 8.78 9.17 7.88 7.69 6.74 5.78
// dark  on bg, bg-2, bg-3: ink 14.49 12.87 15.58; ink-2 9.62 8.54 10.34; ink-3 7.32 6.50 7.87; accent-2 9.49 8.42 10.20
//       accent-ink on accent 10.74; accent on bg, bg-2, bg-3 11.88 10.55 12.77; line-2 on bg, bg-2 4.94 4.38; line 1.79 1.59 1.92; ink on selection 7.32
//       fields vs bg 1.24 1.56 2.07; ink on fields 11.73 9.30 7.00; ink-2 on fields 7.79 6.17 4.64; focus on bg, bg-2, bg-3, fields 12.15 10.79 13.06 9.83 7.80 5.86
// contrast:end
export default {
  id: 'baseline-color',
  layer: 'color',
  label: 'Plain neutral',
  summary: 'An intentionally plain two-theme neutral control with a readable ink accent.',
  origin: 'baseline',
  refs: [
    { name: 'WCAG 2.2', url: 'https://www.w3.org/TR/WCAG22/', what: 'Role-based contrast and visible focus, with no colour-direction claim.' },
  ],
  light: {
    '--bg': 'oklch(0.969 0.004 106.5)',
    '--bg-2': 'oklch(0.984 0.004 106.5)',
    '--bg-3': 'oklch(0.933 0.005 106.5)',
    '--ink': 'oklch(0.27 0.006 134.9)',
    '--ink-2': 'oklch(0.439 0.012 140.5)',
    '--ink-3': 'oklch(0.499 0.013 141.2)',
    '--line': 'oklch(0.863 0.01 125.7)',
    '--line-2': 'oklch(0.598 0.017 136.1)',
    '--accent': 'oklch(0.351 0.023 142.6)',
    '--accent-ink': 'oklch(0.977 0.005 117.9)',
    '--accent-2': 'oklch(0.447 0.032 140.1)',
    '--focus': 'oklch(0.385 0.057 138.6)',
    '--selection': 'oklch(0.901 0.024 133.5)',
    '--field-1': 'oklch(0.925 0.011 123.5)',
    '--field-2': 'oklch(0.88 0.02 133.1)',
    '--field-3': 'oklch(0.832 0.034 131.7)',
  },
  dark: {
    '--bg': 'oklch(0.235 0.009 137.8)',
    '--bg-2': 'oklch(0.275 0.012 135.1)',
    '--bg-3': 'oklch(0.205 0.008 137.8)',
    '--ink': 'oklch(0.952 0.01 119.6)',
    '--ink-2': 'oklch(0.821 0.018 131.9)',
    '--ink-3': 'oklch(0.741 0.025 133.5)',
    '--line': 'oklch(0.395 0.022 132.2)',
    '--line-2': 'oklch(0.636 0.038 130.7)',
    '--accent': 'oklch(0.885 0.025 132.1)',
    '--accent-ink': 'oklch(0.268 0.027 136.2)',
    '--accent-2': 'oklch(0.814 0.044 133.5)',
    '--focus': 'oklch(0.89 0.049 130.2)',
    '--selection': 'oklch(0.418 0.037 132.1)',
    '--field-1': 'oklch(0.3 0.026 132)',
    '--field-2': 'oklch(0.36 0.042 132.2)',
    '--field-3': 'oklch(0.426 0.063 130.5)',
  },
} satisfies ColorOption;
