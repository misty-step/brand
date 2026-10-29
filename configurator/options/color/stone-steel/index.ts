import type { ColorOption } from '../../../src/contract';

// Strategy: Restrained UI, playful field. Steel blue fills the action and marks links and focus; the tetromino trio lives only in the field.
// contrast:begin (written by options/color/check.mjs --write; WCAG 2 ratios, 8-bit sRGB)
// light on bg, bg-2, bg-3: ink 11.00 12.22 10.03; ink-2 6.88 7.64 6.27; ink-3 5.52 6.13 5.04; accent-2 5.23 5.81 4.77
//       accent-ink on accent 5.81; accent on bg, bg-2, bg-3 5.23 5.81 4.77; line-2 on bg, bg-2 3.22 3.58; line 1.24 1.38 1.14; ink on selection 8.86
//       fields vs bg 1.11 1.31 1.48; ink on fields 9.87 8.40 7.43; ink-2 on fields 6.17 5.25 4.65; focus on bg, bg-2, bg-3, fields 5.23 5.81 4.77 4.70 3.99 3.53
// dark  on bg, bg-2, bg-3: ink 11.84 10.50 12.91; ink-2 7.91 7.02 8.63; ink-3 5.89 5.23 6.43; accent-2 6.01 5.33 6.55
//       accent-ink on accent 6.01; accent on bg, bg-2, bg-3 6.01 5.33 6.55; line-2 on bg, bg-2 3.48 3.09; line 1.39 1.23 1.52; ink on selection 6.97
//       fields vs bg 1.12 1.26 1.58; ink on fields 10.56 9.40 7.48; ink-2 on fields 7.06 6.28 5.00; focus on bg, bg-2, bg-3, fields 6.01 5.33 6.55 5.36 4.77 3.79
// contrast:end
export default {
  id: 'stone-steel',
  layer: 'color',
  label: 'Stone and steel',
  summary: 'Warm stone and slate ink with one steel blue for the action, and pi’s three tetromino colours tinting the field: a tool set as a book, its 8-bit pieces kept to the picture.',
  origin: 'new',
  refs: [
    { name: 'pi.dev', url: 'https://pi.dev', what: 'Its two composed themes: warm stone #ebe7e4 with slate ink #252f3d and steel #4b607c by day, and #161d27 and #212730 with #d5d8db type and #6a9fcc by night. The logo’s tetromino colours (#f09082, #4d9abf, #f1be58) become the field tints, the only colour outside the steel.' },
  ],
  light: {
    '--bg': 'oklch(0.93 0.006 59.6)',
    '--bg-2': 'oklch(0.965 0.004 60)',
    '--bg-3': 'oklch(0.9 0.008 60)',
    '--ink': 'oklch(0.302 0.029 256.8)',
    '--ink-2': 'oklch(0.42 0.03 256)',
    '--ink-3': 'oklch(0.47 0.028 256)',
    '--line': 'oklch(0.86 0.007 60)',
    '--line-2': 'oklch(0.6 0.02 250)',
    '--accent': 'oklch(0.483 0.052 255.8)',
    '--accent-ink': 'oklch(0.965 0.004 60)',
    '--accent-2': 'oklch(0.483 0.052 255.8)',
    '--focus': 'oklch(0.483 0.052 255.8)',
    '--selection': 'oklch(0.86 0.03 250)',
    '--field-1': 'oklch(0.895 0.05 82)',
    '--field-2': 'oklch(0.85 0.06 29)',
    '--field-3': 'oklch(0.805 0.055 231)',
  },
  dark: {
    '--bg': 'oklch(0.229 0.022 257.3)',
    '--bg-2': 'oklch(0.271 0.019 258.4)',
    '--bg-3': 'oklch(0.19 0.02 257)',
    '--ink': 'oklch(0.881 0.005 247.9)',
    '--ink-2': 'oklch(0.76 0.01 250)',
    '--ink-3': 'oklch(0.68 0.012 250)',
    '--line': 'oklch(0.33 0.02 258)',
    '--line-2': 'oklch(0.55 0.02 255)',
    '--accent': 'oklch(0.683 0.087 245.2)',
    '--accent-ink': 'oklch(0.229 0.022 257.3)',
    '--accent-2': 'oklch(0.683 0.087 245.2)',
    '--focus': 'oklch(0.683 0.087 245.2)',
    '--selection': 'oklch(0.38 0.05 245)',
    '--field-1': 'oklch(0.27 0.025 82)',
    '--field-2': 'oklch(0.31 0.04 29)',
    '--field-3': 'oklch(0.36 0.05 231)',
  },
} satisfies ColorOption;
