import type { ColorOption } from '../../../src/contract';

// Strategy: Colour as image. Ink fills the buttons; one periwinkle ink tints the field and marks links and focus; lavender washes the wells.
// contrast:begin (written by options/color/check.mjs --write; WCAG 2 ratios, 8-bit sRGB)
// light on bg, bg-2, bg-3: ink 15.77 16.43 14.55; ink-2 8.25 8.59 7.61; ink-3 5.28 5.50 4.87; accent-2 5.05 5.26 4.66
//       accent-ink on accent 16.43; accent on bg, bg-2, bg-3 15.77 16.43 14.55; line-2 on bg, bg-2 3.45 3.60; line 1.23 1.28 1.13; ink on selection 12.27
//       fields vs bg 1.13 1.37 1.68; ink on fields 13.93 11.52 9.41; ink-2 on fields 7.28 6.02 4.92; focus on bg, bg-2, bg-3, fields 5.19 5.40 4.79 4.58 3.79 3.10
// dark  on bg, bg-2, bg-3: ink 16.98 15.98 17.49; ink-2 10.47 9.85 10.78; ink-3 6.27 5.90 6.46; accent-2 7.71 7.26 7.95
//       accent-ink on accent 16.98; accent on bg, bg-2, bg-3 16.98 15.98 17.49; line-2 on bg, bg-2 3.28 3.08; line 1.30 1.23 1.34; ink on selection 11.11
//       fields vs bg 1.10 1.25 1.58; ink on fields 15.49 13.59 10.76; ink-2 on fields 9.55 8.38 6.63; focus on bg, bg-2, bg-3, fields 7.71 7.26 7.95 7.04 6.18 4.89
// contrast:end
export default {
  id: 'navy-periwinkle',
  layer: 'color',
  label: 'Navy and periwinkle',
  summary: 'Navy ink and ink-filled buttons on near-white, with colour arriving only as one periwinkle ink in the field, the links and focus, the way a halftone photograph prints through mist.',
  origin: 'new',
  refs: [
    { name: 'Macroscope', url: 'https://macroscope.com', what: 'Its colour is image, not UI: navy ink #191e2d and #3e4a70 secondaries on #f8f9fc, primary buttons in ink rather than brand colour, one periwinkle (#5b4dff) printed as a halftone and used for links, and lavender washes (#e9e9fb). Macroscope has no dark theme; the night here grows from its #05070f dark section.' },
  ],
  light: {
    '--bg': 'oklch(0.982 0.004 271.4)',
    '--bg-2': 'oklch(0.996 0.001 271)',
    '--bg-3': 'oklch(0.955 0.016 286)',
    '--ink': 'oklch(0.237 0.03 269.8)',
    '--ink-2': 'oklch(0.416 0.066 270)',
    '--ink-3': 'oklch(0.52 0.036 269)',
    '--line': 'oklch(0.915 0.012 278)',
    '--line-2': 'oklch(0.62 0.035 270)',
    '--accent': 'oklch(0.237 0.03 269.8)',
    '--accent-ink': 'oklch(0.996 0.001 271)',
    '--accent-2': 'oklch(0.552 0.251 277.8)',
    '--focus': 'oklch(0.547 0.25 277.8)',
    '--selection': 'oklch(0.9 0.045 285)',
    '--field-1': 'oklch(0.94 0.022 284)',
    '--field-2': 'oklch(0.88 0.05 280)',
    '--field-3': 'oklch(0.82 0.08 278)',
  },
  dark: {
    '--bg': 'oklch(0.15 0.02 270)',
    '--bg-2': 'oklch(0.19 0.024 270)',
    '--bg-3': 'oklch(0.125 0.018 270)',
    '--ink': 'oklch(0.95 0.008 275)',
    '--ink-2': 'oklch(0.8 0.045 275)',
    '--ink-3': 'oklch(0.66 0.04 272)',
    '--line': 'oklch(0.27 0.025 270)',
    '--line-2': 'oklch(0.5 0.035 270)',
    '--accent': 'oklch(0.95 0.008 275)',
    '--accent-ink': 'oklch(0.15 0.02 270)',
    '--accent-2': 'oklch(0.72 0.143 276)',
    '--focus': 'oklch(0.72 0.143 276)',
    '--selection': 'oklch(0.32 0.08 276)',
    '--field-1': 'oklch(0.205 0.04 272)',
    '--field-2': 'oklch(0.26 0.065 274)',
    '--field-3': 'oklch(0.33 0.09 276)',
  },
} satisfies ColorOption;
